#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Enhanced Algeria Pharmacies Scraper
Features:
- Sources: EVEXIA + AnnuMed
- Resume after interruption
- Optional rotating proxies
- Retry with exponential backoff
- Export to CSV / Excel
- Export to MySQL
- Export to Supabase Postgres

Examples:
    python pharmacies_algeria_scraper_plus.py --outdir output
    python pharmacies_algeria_scraper_plus.py --source evexia --outdir output
    python pharmacies_algeria_scraper_plus.py --resume --outdir output
    python pharmacies_algeria_scraper_plus.py --mysql-url "mysql+pymysql://user:pass@localhost/dbname"
    python pharmacies_algeria_scraper_plus.py --supabase-url "postgresql+psycopg2://postgres:pass@db.xxx.supabase.co:5432/postgres"
    python pharmacies_algeria_scraper_plus.py --proxies-file proxies.txt
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import random
import re
import sys
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List, Optional, Dict
from urllib.parse import urljoin, urlparse

import pandas as pd
import requests
from bs4 import BeautifulSoup


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept-Language": "fr-FR,fr;q=0.9,ar;q=0.8,en;q=0.7",
}

PHONE_RE = re.compile(r'(?:(?:\+213|0)\s?[\d\s./()-]{7,20}\d)')
WILAYA_FROM_TITLE_RE = re.compile(r"pharmacies?\s+partenaires?\s+([^\n\r]+)", re.IGNORECASE)
COMMUNE_HINT_RE = re.compile(
    r"\b([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜa-zàâäçéèêëîïôöùûü' -]{2,})\s*-\s*([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜa-zàâäçéèêëîïôöùûü' -]{2,})$"
)


@dataclass
class PharmacyRecord:
    nom: str
    adresse: str
    telephone: str
    site_source: str
    wilaya: str
    commune: str


def clean_text(s: str) -> str:
    s = re.sub(r"[\u200b\u200e\u200f]", " ", s or "")
    s = s.replace("\xa0", " ")
    s = re.sub(r"\s+", " ", s).strip(" -\n\r\t")
    return s


def slug_to_wilaya(slug: str) -> str:
    slug = slug.replace("pharmacies-partenaires-", "").replace("-", " ").strip()
    return slug.title()


def infer_commune(address: str, wilaya: str) -> str:
    address = clean_text(address)
    if not address:
        return ""
    m = COMMUNE_HINT_RE.search(address)
    if m:
        left, right = clean_text(m.group(1)), clean_text(m.group(2))
        if right.lower() == wilaya.lower():
            return left
    parts = [clean_text(x) for x in re.split(r"[,/-]+", address) if clean_text(x)]
    if parts:
        last = parts[-1]
        if last and last.lower() != wilaya.lower():
            return last
    return ""


def record_key(rec: PharmacyRecord) -> str:
    raw = "|".join([
        clean_text(rec.nom).lower(),
        clean_text(rec.adresse).lower(),
        clean_text(rec.telephone),
        clean_text(rec.wilaya).lower(),
        clean_text(rec.commune).lower(),
    ])
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()


class CheckpointManager:
    def __init__(self, outdir: Path):
        self.outdir = outdir
        self.outdir.mkdir(parents=True, exist_ok=True)
        self.state_file = self.outdir / "checkpoint_state.json"
        self.records_file = self.outdir / "checkpoint_records.jsonl"
        self.seen_record_keys = set()
        self.seen_urls = set()
        self.state = {
            "evexia_done_urls": [],
            "annumed_done_profile_urls": [],
            "annumed_last_wilaya_id": 1,
            "annumed_last_page": 1,
        }
        self._load()

    def _load(self) -> None:
        if self.records_file.exists():
            with self.records_file.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    obj = json.loads(line)
                    self.seen_record_keys.add(obj["_key"])
        if self.state_file.exists():
            self.state.update(json.loads(self.state_file.read_text(encoding="utf-8")))
            self.seen_urls = set(self.state.get("evexia_done_urls", [])) | set(self.state.get("annumed_done_profile_urls", []))

    def append_record(self, rec: PharmacyRecord) -> bool:
        key = record_key(rec)
        if key in self.seen_record_keys:
            return False
        obj = asdict(rec)
        obj["_key"] = key
        with self.records_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(obj, ensure_ascii=False) + "\n")
        self.seen_record_keys.add(key)
        return True

    def mark_evexia_url_done(self, url: str) -> None:
        done = set(self.state.get("evexia_done_urls", []))
        done.add(url)
        self.state["evexia_done_urls"] = sorted(done)
        self.save_state()

    def mark_annumed_profile_done(self, url: str, wilaya_id: int, page: int) -> None:
        done = set(self.state.get("annumed_done_profile_urls", []))
        done.add(url)
        self.state["annumed_done_profile_urls"] = sorted(done)
        self.state["annumed_last_wilaya_id"] = wilaya_id
        self.state["annumed_last_page"] = page
        self.save_state()

    def save_state(self) -> None:
        self.state_file.write_text(json.dumps(self.state, ensure_ascii=False, indent=2), encoding="utf-8")

    def load_dataframe(self) -> pd.DataFrame:
        rows = []
        if self.records_file.exists():
            with self.records_file.open("r", encoding="utf-8") as f:
                for line in f:
                    obj = json.loads(line)
                    obj.pop("_key", None)
                    rows.append(obj)
        return to_dataframe_dicts(rows)


class RotatingSession:
    def __init__(self, proxies: Optional[List[str]] = None, timeout: int = 30, max_retries: int = 4):
        self.session = requests.Session()
        self.timeout = timeout
        self.max_retries = max_retries
        self.proxies = [p.strip() for p in (proxies or []) if p.strip()]
        self.proxy_cycle = itertools.cycle(self.proxies) if self.proxies else None

    def _get_proxy_dict(self) -> Optional[Dict[str, str]]:
        if not self.proxy_cycle:
            return None
        proxy = next(self.proxy_cycle)
        return {"http": proxy, "https": proxy}

    def get(self, url: str) -> requests.Response:
        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                proxy_dict = self._get_proxy_dict()
                r = self.session.get(
                    url,
                    headers=HEADERS,
                    timeout=self.timeout,
                    proxies=proxy_dict,
                )
                r.raise_for_status()
                return r
            except Exception as e:
                last_error = e
                sleep_s = min(20, 1.5 ** attempt + random.uniform(0.2, 0.8))
                print(f"[WARN] Retry {attempt}/{self.max_retries} for {url}: {e}", file=sys.stderr)
                time.sleep(sleep_s)
        raise RuntimeError(f"Failed GET {url}: {last_error}")

    def close(self) -> None:
        self.session.close()


def parse_evexia_index(client: RotatingSession) -> List[str]:
    urls = []
    for index_url in [
        "https://evexiapharmadz.com/pages/pharmacies",
        "https://evexiapharmadz.com/ar/pages/pharmacies",
        "https://evexiapharmadz.com/fr/pages/pharmacies",
    ]:
        try:
            soup = BeautifulSoup(client.get(index_url).text, "html.parser")
        except Exception:
            continue
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            full = urljoin(index_url, href)
            if "pharmacies-partenaires" in full:
                urls.append(full)
    seen, out = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def parse_evexia_page(url: str, client: RotatingSession) -> List[PharmacyRecord]:
    html = client.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    title = clean_text(soup.get_text(" ", strip=True))
    h1 = clean_text(soup.find("h1").get_text(" ", strip=True)) if soup.find("h1") else ""
    full_title = h1 or title

    wilaya = ""
    m = WILAYA_FROM_TITLE_RE.search(full_title)
    if m:
        wilaya = clean_text(m.group(1))
    if not wilaya:
        wilaya = slug_to_wilaya(Path(urlparse(url).path).name)

    text = soup.get_text("\n", strip=True)
    lines = [clean_text(x) for x in text.splitlines() if clean_text(x)]

    records = []
    start_idx = 0
    if h1 and h1 in lines:
        start_idx = lines.index(h1) + 1

    i = start_idx
    while i < len(lines):
        line = lines[i]
        if re.search(r"(Contact|Livraison|blogs|Langue|Confirmation|service de vente)", line, re.I):
            i += 1
            continue

        if line.lower().startswith("pharmacie"):
            nom = line
            telephone = ""
            adresse = ""

            for j in range(i + 1, min(i + 6, len(lines))):
                candidate = lines[j]
                if not telephone:
                    phones = PHONE_RE.findall(candidate)
                    if phones:
                        telephone = " / ".join(dict.fromkeys(clean_text(p) for p in phones))
                        continue
                if ("➤" in candidate) or (
                    not adresse and not PHONE_RE.search(candidate) and not candidate.lower().startswith("pharmacie")
                ):
                    adresse = clean_text(candidate.replace("➤", ""))
                    break

            commune = infer_commune(adresse, wilaya)
            rec = PharmacyRecord(
                nom=nom,
                adresse=adresse,
                telephone=telephone,
                site_source=url,
                wilaya=wilaya,
                commune=commune,
            )
            records.append(rec)
        i += 1

    unique = {}
    for rec in records:
        unique[record_key(rec)] = rec
    return list(unique.values())


def annumed_candidate_links(soup: BeautifulSoup, base_url: str) -> List[str]:
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        full = urljoin(base_url, href)
        if re.search(r"/(medecin|annuaire|profil|detail|professionnel|pharmacie)", full, re.I):
            links.append(full)
    seen, out = set(), []
    for link in links:
        if link not in seen:
            seen.add(link)
            out.append(link)
    return out


def parse_annumed_profile(url: str, client: RotatingSession, fallback_wilaya: str = "") -> Optional[PharmacyRecord]:
    try:
        html = client.get(url).text
    except Exception:
        return None

    soup = BeautifulSoup(html, "html.parser")
    text = clean_text(soup.get_text("\n", strip=True))
    lines = [clean_text(x) for x in text.splitlines() if clean_text(x)]

    nom = ""
    adresse = ""
    telephone = ""
    wilaya = fallback_wilaya
    commune = ""

    for tag in soup.find_all(["h1", "h2", "title", "strong"]):
        t = clean_text(tag.get_text(" ", strip=True))
        if "pharmacie" in t.lower():
            nom = t
            break

    if not nom:
        for line in lines[:25]:
            if "pharmacie" in line.lower():
                nom = line
                break

    phones = PHONE_RE.findall(text)
    if phones:
        telephone = " / ".join(dict.fromkeys(clean_text(p) for p in phones[:3]))

    address_markers = ["adresse", "address", "localisation", "lieu", "commune", "wilaya"]
    for idx, line in enumerate(lines):
        lower = line.lower()
        if any(m in lower for m in address_markers):
            merged = " ".join(lines[idx: idx + 3])
            if not adresse:
                adresse = clean_text(re.sub(r"^(adresse|address|localisation)\s*:?\s*", "", merged, flags=re.I))

    for idx, line in enumerate(lines):
        low = line.lower()
        if "wilaya" in low and idx + 1 < len(lines):
            cand = clean_text(lines[idx + 1])
            if len(cand) < 50:
                wilaya = cand
        if "commune" in low and idx + 1 < len(lines):
            cand = clean_text(lines[idx + 1])
            if len(cand) < 50:
                commune = cand

    if not commune:
        commune = infer_commune(adresse, wilaya) if adresse else ""

    if nom and (telephone or adresse):
        return PharmacyRecord(
            nom=nom,
            adresse=adresse,
            telephone=telephone,
            site_source=url,
            wilaya=wilaya,
            commune=commune,
        )
    return None


def scrape_evexia(client: RotatingSession, checkpoint: CheckpointManager, delay: float = 0.5, resume: bool = False) -> None:
    urls = parse_evexia_index(client)
    if not urls:
        raise RuntimeError("Impossible de récupérer les pages EVEXIA.")

    done = set(checkpoint.state.get("evexia_done_urls", [])) if resume else set()
    for idx, url in enumerate(urls, start=1):
        if resume and url in done:
            print(f"[SKIP] EVEXIA already done: {url}")
            continue
        print(f"[INFO] EVEXIA {idx}/{len(urls)} -> {url}")
        try:
            records = parse_evexia_page(url, client)
            for rec in records:
                checkpoint.append_record(rec)
        except Exception as e:
            print(f"[WARN] EVEXIA page ignorée: {url} -> {e}", file=sys.stderr)
        checkpoint.mark_evexia_url_done(url)
        time.sleep(delay)


def scrape_annumed(
    client: RotatingSession,
    checkpoint: CheckpointManager,
    max_pages_per_wilaya: int = 50,
    delay: float = 0.8,
    resume: bool = False
) -> None:
    start_wilaya = checkpoint.state.get("annumed_last_wilaya_id", 1) if resume else 1
    start_page = checkpoint.state.get("annumed_last_page", 1) if resume else 1
    done_profiles = set(checkpoint.state.get("annumed_done_profile_urls", [])) if resume else set()

    for wilaya_id in range(start_wilaya, 59):
        page_begin = start_page if wilaya_id == start_wilaya else 1
        empty_streak = 0

        for page in range(page_begin, max_pages_per_wilaya + 1):
            url = f"https://www.annumed.sante-dz.com/filter/categorie/pharmacie?wilaya={wilaya_id}&page={page}"
            print(f"[INFO] AnnuMed wilaya={wilaya_id} page={page}")
            try:
                resp = client.get(url)
            except Exception as e:
                print(f"[WARN] Page ignorée: {url} -> {e}", file=sys.stderr)
                break

            soup = BeautifulSoup(resp.text, "html.parser")
            page_text = clean_text(soup.get_text(" ", strip=True))

            wilaya_name = ""
            m = re.search(r"à la wilaya de\s+([A-Za-zÀ-ÿ' -]+)", page_text, re.I)
            if m:
                wilaya_name = clean_text(m.group(1))

            profile_links = annumed_candidate_links(soup, url)
            new_links = [u for u in profile_links if u not in done_profiles]

            if not new_links:
                empty_streak += 1
                if empty_streak >= 2:
                    break
            else:
                empty_streak = 0

            for link in new_links:
                try:
                    rec = parse_annumed_profile(link, client, fallback_wilaya=wilaya_name)
                    if rec:
                        checkpoint.append_record(rec)
                    checkpoint.mark_annumed_profile_done(link, wilaya_id, page)
                    done_profiles.add(link)
                except Exception as e:
                    print(f"[WARN] Profil ignoré: {link} -> {e}", file=sys.stderr)
                time.sleep(delay)

            checkpoint.state["annumed_last_wilaya_id"] = wilaya_id
            checkpoint.state["annumed_last_page"] = page
            checkpoint.save_state()
            time.sleep(delay)

        start_page = 1


def to_dataframe(records: Iterable[PharmacyRecord]) -> pd.DataFrame:
    return to_dataframe_dicts([asdict(r) for r in records])


def to_dataframe_dicts(rows: List[dict]) -> pd.DataFrame:
    df = pd.DataFrame(rows)
    if df.empty:
        df = pd.DataFrame(columns=["nom", "adresse", "telephone", "site_source", "wilaya", "commune"])
    for col in df.columns:
        df[col] = df[col].fillna("").astype(str).map(clean_text)
    df = df.drop_duplicates()
    df = df.sort_values(by=["wilaya", "commune", "nom"], na_position="last").reset_index(drop=True)
    return df


def save_outputs(df: pd.DataFrame, outdir: Path) -> tuple[Path, Path]:
    outdir.mkdir(parents=True, exist_ok=True)
    csv_path = outdir / "pharmacies_algeria.csv"
    xlsx_path = outdir / "pharmacies_algeria.xlsx"
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    df.to_excel(xlsx_path, index=False)
    print(f"[OK] CSV  : {csv_path}")
    print(f"[OK] XLSX : {xlsx_path}")
    print(f"[OK] Rows : {len(df)}")
    return csv_path, xlsx_path


def export_sql(df: pd.DataFrame, db_url: str, table_name: str = "pharmacies_algeria", if_exists: str = "append") -> None:
    try:
        from sqlalchemy import create_engine
    except ImportError as e:
        raise RuntimeError("SQLAlchemy is required. Install: pip install sqlalchemy") from e

    engine = create_engine(db_url)
    df.to_sql(table_name, con=engine, if_exists=if_exists, index=False, chunksize=500, method="multi")
    print(f"[OK] Exported to DB table: {table_name}")


def load_proxies(proxies_file: Optional[str]) -> List[str]:
    if not proxies_file:
        return []
    p = Path(proxies_file)
    if not p.exists():
        raise FileNotFoundError(f"Proxies file not found: {proxies_file}")
    return [line.strip() for line in p.read_text(encoding="utf-8").splitlines() if line.strip() and not line.strip().startswith("#")]


def build_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Enhanced Algeria pharmacies scraper")
    parser.add_argument("--source", choices=["all", "evexia", "annumed"], default="all")
    parser.add_argument("--outdir", default="output_pharmacies_plus")
    parser.add_argument("--delay", type=float, default=0.8)
    parser.add_argument("--max-pages-annumed", type=int, default=50)
    parser.add_argument("--resume", action="store_true", help="Resume from checkpoint")
    parser.add_argument("--proxies-file", help="Text file with one proxy per line, example: http://user:pass@host:port")
    parser.add_argument("--mysql-url", help='Example: mysql+pymysql://user:pass@host:3306/dbname')
    parser.add_argument("--supabase-url", help='Example: postgresql+psycopg2://postgres:pass@db.x.supabase.co:5432/postgres')
    parser.add_argument("--table-name", default="pharmacies_algeria")
    parser.add_argument("--db-if-exists", choices=["append", "replace"], default="append")
    return parser.parse_args()


def main() -> None:
    args = build_args()
    outdir = Path(args.outdir)
    checkpoint = CheckpointManager(outdir)
    proxies = load_proxies(args.proxies_file)
    client = RotatingSession(proxies=proxies, timeout=35, max_retries=4)

    try:
        if args.source in ("all", "evexia"):
            print("[INFO] Scraping EVEXIA...")
            scrape_evexia(client=client, checkpoint=checkpoint, delay=args.delay, resume=args.resume)

        if args.source in ("all", "annumed"):
            print("[INFO] Scraping AnnuMed...")
            scrape_annumed(
                client=client,
                checkpoint=checkpoint,
                max_pages_per_wilaya=args.max_pages_annumed,
                delay=max(args.delay, 0.7),
                resume=args.resume,
            )
    finally:
        client.close()

    df = checkpoint.load_dataframe()
    save_outputs(df, outdir)

    if args.mysql_url:
        export_sql(df, args.mysql_url, table_name=args.table_name, if_exists=args.db_if_exists)

    if args.supabase_url:
        export_sql(df, args.supabase_url, table_name=args.table_name, if_exists=args.db_if_exists)

    print("[DONE]")


if __name__ == "__main__":
    main()
