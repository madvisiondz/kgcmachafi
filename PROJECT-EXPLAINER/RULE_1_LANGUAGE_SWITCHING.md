# Rule #1 — Language switching must switch *all* text (AR/FR/EN)

This file is the **source of truth** for Rule #1.

## Rule #1 (non‑negotiable)

When the visitor switches language (AR/FR/EN), **every single visible text** must switch accordingly:

- headings, paragraphs, labels, helper text
- buttons, chips, badges, empty states
- placeholders, aria labels, `title` attributes/tooltips
- navigation labels, footer labels
- data-driven content titles/descriptions (news, services, etc.)

If *any* text stays in the previous language, it is treated as a **bug**.

---

## Why Rule #1 exists (legacy pain → rebuild guardrail)

In the legacy system, language switching could break or partially translate pages because:

- some strings were hardcoded in components
- some content came from the backend in one language only
- some sections depended on async fetch timing and re-render order

Rule #1 prevents “half-translated” pages, which destroys trust.

---

## Where the solution can “hide” (we must cover all)

Rule #1 can fail in multiple layers. We must treat it as an **end-to-end contract**:

1) **UI layer** (React components)
2) **UX/content strategy** (what is translated vs what is language-neutral)
3) **Database/content model** (how content is stored per language)
4) **Admin Control Panel** (how content is entered/edited/published per language)
5) **Automation & enforcement** (lint rules, CI checks, optional hooks/plugins)

---

## Recommended solution (the professional, durable approach)

### A) UI contract: never render user-visible strings directly

**Rule**: even if UI copy is “static”, it must **not** be hardcoded. Any user-visible string must come from one of these sources:

1) `t('...')` i18n keys (static UI copy)
2) data objects that explicitly contain language variants (dynamic content)

Do **not** mix hardcoded strings with translated keys in the same page.

#### What “static UI” means in this project

- “Static UI” means the text does not come from the database **yet**.
- It does **not** mean we write literal strings in JSX.
- Static UI copy still lives in `translations.ts` and is accessed via `t('...')`.

#### What “admin-controlled” means

- Anything **data-driven** (directories, schedules, news, programs, services) should be controlled via the Admin Control Panel.
- Admin must manage translations per language so public switching always updates **all** content.

#### UI implementation patterns

- **Static copy**: always via `translations.ts` keys.
- **Dynamic content**: always render `title[lang]`, `description[lang]`, etc., or render a `translationKey` and call `t(key)`.
- **Fallback**: if a translation is missing, fall back to English and show a “needs translation” state in admin (not in public UI).

### B) Data contract: every content entity must be bilingual/trilingual by design

For any entity that displays text publicly (News, Services, Programs, Books metadata, etc.), define one of these schemas:

#### Option 1 (recommended): store per-language fields

- `title_ar`, `title_fr`, `title_en`
- `description_ar`, `description_fr`, `description_en`

Pros:
- simplest to query, simplest to reason about
- makes “all text switches” guaranteed

Cons:
- more columns per table (still acceptable if we keep entities minimal)

#### Option 2: store a translations table (normalized)

Tables:
- `content_items` (id, type, status, ...)
- `content_item_translations` (item_id, lang, title, description, ...)

Pros:
- scalable to more languages
- avoids column explosion

Cons:
- more joins/queries
- easier to “forget a translation row” if admin UX is not strict

**If we stick to AR/FR/EN**, Option 1 is usually the fastest and most reliable.

### C) Admin Control Panel: translation entry must be part of the workflow

If admin can save/publish content without translations, Rule #1 will be violated in production.

#### Required admin controls (minimum)

- Every content form has language tabs: **AR / FR / EN**
- “Completeness” indicator (per language):
  - Missing fields highlighted
  - Prevent “Publish” until required fields exist for all languages (or enforce a policy)
- Preview the public card in all languages before publishing

#### Publishing policy options

1) **Strict** (recommended for trust-critical pages): cannot publish until AR/FR/EN are complete.
2) **Semi-strict**: can publish with EN/FR complete but AR missing → public UI must still display *something* (fallback), but admin must see a big “AR missing” warning.

### D) UX: avoid language-dependent “randomness”

To keep language switching stable:

- avoid “format strings” stored in the DB without clear placeholders
- keep numeric/date formatting locale-aware (later: `Intl.NumberFormat`)
- avoid embedding long HTML inside translation strings where possible

---

## What we can do in this repo now (UI-first stage)

### 1) Enforce “no hardcoded text” in new pages

Practical checklist for each page before marking “done”:

- search the page file for Arabic/French/English literals in JSX
- ensure placeholders + aria labels are also i18n keys

### 2) Standardize “dynamic content shape”

Even with mock data, shape it like the future API:

```ts
type TranslatedText = { ar: string; fr: string; en: string };
type NewsItem = { id: string; title: TranslatedText; desc: TranslatedText; ... };
```

So switching language always picks the right field.

---

## Automation & enforcement (optional but high leverage)

### A) ESLint rule / lint script (best)

Add a lint rule (or a small script) that flags:

- JSX text nodes containing non-empty strings (except numbers/punctuation)
- `placeholder="..."` without `t(...)`
- `aria-label="..."` without `t(...)`

This is the strongest “never regress” guard.

### B) CI gate

Run the lint check in CI so new PRs cannot introduce hardcoded strings.

### C) Optional Cursor automation (hooks)

If we want assistant-driven enforcement:

- a Cursor hook could remind/verify Rule #1 after edits (ex: scan changed files for JSX literals)
- this is optional; the primary enforcement should be lint/CI

---

## Proposed endpoints + admin controls for Rule #1 (platform-level)

These are not page-specific; they support consistent multilingual content across the platform.

### Public endpoints (examples)

- `GET /api/i18n/ui?lang=ar`
  - Optional if you ever decide to serve UI strings from backend (not required now)

- `GET /api/content/:type?lang=ar`
  - Returns localized content payload (server already selects the language)

### Admin endpoints (examples)

- `POST /api/admin/content/:type`
  - Accepts `title_ar/title_fr/title_en`, etc.
  - Enforces publishing policy (strict vs semi-strict)

---

## Machafi TV (planned) — edition routes (does not replace Rule #1 on Services)

The **Machafi Services** app (`frontend/`) keeps Rule #1 as documented: **AR/FR/EN** toggle on the **same routes**, all strings via **`t()`** (and multilingual shapes for data).

**Machafi TV** (see `PLATFORM_SHELL_LAYOUT.md`) adds a **different** pattern:

- Public URLs are **edition-prefixed**: e.g. `/tv/ar/...`, `/tv/fr/...`, `/tv/en/...`.
- Each edition has its **own editorial queue** (Arabic desk vs French desk vs English desk — **not** automatic translation of one article).
- Switching “language” **navigates** to the sibling edition route tree; within **each** edition page, Rule #1 still applies **for that edition’s UI language** (no mixed-language chrome inside `/tv/ar`, etc.).

Until TV ships in code, Services pages remain the reference implementation for Rule #1.

---

## Definition of done (Rule #1)

Rule #1 is satisfied when:

- switching AR/FR/EN updates **all UI copy**
- switching AR/FR/EN updates **all data-driven content**
- admin cannot accidentally publish “half-translated” content (or the fallback policy is explicit and visible)
- automated checks prevent regressions



---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*
