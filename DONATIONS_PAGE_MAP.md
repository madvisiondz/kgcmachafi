# Donations page — architecture + service value (trust-first)

This document is the **single source of truth** for the Donations page rebuild in the new frontend.

## 1) Purpose (why this page matters)

The Donations page is not “just a payment button”.

Its primary value to visitors is:

- **Trust**: show that donations are tied to **real campaigns** with measurable progress.
- **Speed to action**: make it easy to choose **one-time** vs **monthly** support and pick an amount quickly.
- **Clarity**: reduce confusion about currency, what the money supports, and what happens next.

If we do this page correctly, MACHAFI becomes a credible channel for solidarity:

- urgent medical cases (surgeries, medication gaps)
- equipment that improves local care capacity
- sustained funding via subscriptions

The page must optimize for **trust, transparency, and a safe donation journey**.

---

## 2) Legacy source (what we cloned / improved)

### Legacy page shell

- `legacy/src/pages/DonationsPage.jsx` → renders `Donations` only.

### Legacy UI + behavior

- `legacy/src/components/Donations.jsx`
  - Currency selector (EUR/DZD/USD)
  - Impact stats grid
  - Campaign cards with progress bars
  - Donation form with tabs (one-time vs monthly)
  - Slider + presets + “secure payment” trust row
  - Uses `framer-motion`, `lucide-react`, shadcn UI (`Button`, `Tabs`, `Slider`), and `toast`

### Rebuild differences (new frontend)

- No `framer-motion` / `lucide-react` / shadcn dependencies: rebuilt with **Tailwind + native controls** (`<input type="range">`) for stability and smaller bundle.
- Campaign imagery: legacy used Unsplash URLs; rebuild uses **gradient hero panels** (no external image dependency in UI-first phase). Admin can later attach `cover_image_url`.
- “Confirm donation” is **UI-first**: scrolls to footer contact as the human confirmation path until payment gateway wiring exists (same phased approach as other pages).

---

## 3) Product model (what we are building toward)

This page combines **three datasets**:

### A) Campaigns (primary)

- Public-facing “cases / initiatives” with **goal**, **raised**, **donors**.
- Must be admin-managed and translatable (Rule #1).

### B) Donation intents (bridge to payments)

- A lightweight record created when a visitor confirms an amount:
  - supports “general donation” or “for a specific campaign”
  - later becomes a checkout session / invoice / receipt

### C) Impact stats (trust layer)

- Either computed from real donation rows, or **admin-editable** during early rollout.

---

## 4) UX principle (visitor flow)

Visitors should be able to answer these in < 30 seconds:

1) “What are you funding right now?” → **campaign cards**
2) “How much can I give, in my currency?” → **currency + presets + slider**
3) “Is this recurring?” → **one-time vs monthly**

### Recommended flow

- Read headline + subtitle (trust framing)
- Pick currency
- Browse campaigns → tap **Contribute now** (scrolls to form + highlights selected campaign)
- Choose one-time/monthly → adjust amount → confirm
- Next step (future): payment provider redirect; today: contact/support confirmation path

---

## 5) Page architecture (new frontend)

### Route

- `/donations`

### Files (UI-first stage)

| Item | Location |
| --- | --- |
| Route wiring | `frontend/src/App.tsx` |
| Page | `frontend/src/pages/DonationsPage.jsx` |
| Mock data | `frontend/src/data/donations.ts` |
| i18n | `frontend/src/i18n/translations.ts` → `donations.*` |

### Layout structure (legacy-inspired, rebuild-safe)

#### Header

- Gradient title + subtitle
- Currency chips (EUR/DZD/USD)

#### Stats grid (4 cards)

- Cases helped, total donations, active donors, success rate

#### Campaigns grid (3 cards)

- Gradient “cover” panel + donor count
- Title + description
- Progress bar (raised vs goal) with percent label
- CTA scrolls to donation form

#### Donation form (`#donation-form`)

- Mode toggle: one-time vs monthly
- Amount display (large)
- Range slider + preset buttons
- Confirm CTA + trust row (secure + cards)

---

## 6) Data fields (mock / future API)

### Currency config (public config)

Per currency:

- `code` (`EUR` | `DZD` | `USD`)
- `symbol`
- `label` (translated)
- `presets` (one-time quick picks)
- `subPresets` (monthly quick picks)
- `max`, `step`

### Campaign card (public list)

Minimum:

- `id`
- `title` (AR/FR/EN)
- `description` (AR/FR/EN)
- `goal_amount_base` (recommended base: **EUR**)
- `raised_amount_base` (EUR)
- `donors_count`
- `is_active`
- optional: `slug`, `sort_order`, `verified`, `cover_image_url`, `starts_at`, `ends_at`

### Donation intent (create)

Minimum:

- `campaign_id` (nullable)
- `type` (`one_time` | `monthly`)
- `amount` (number)
- `currency` (`EUR` | `DZD` | `USD`)
- optional: `full_name`, `phone`, `email`, `message`

---

## 7) Proposed public API endpoints (very important)

Naming note: the current PHP API uses file endpoints like `api/public/*.php`. Below lists **both**:

- **A)** canonical “clean” REST paths (good for future routing)
- **B)** pragmatic PHP file mappings (good for Apache/shared hosting)

### 7.1 Page bundle (recommended lightweight)

**A)** `GET /api/public/donations`

**B)** `GET /api/public/donations.php`

Query params:

- `lang` = `ar|fr|en` (default `ar`)
- `currency` = `EUR|DZD|USD` (optional; if omitted return all currency configs)

Response (JSON):

```json
{
  "section": {
    "title": { "ar": "...", "fr": "...", "en": "..." },
    "subtitle": { "ar": "...", "fr": "...", "en": "..." }
  },
  "stats": {
    "helped": { "label": { "ar": "...", "fr": "...", "en": "..." }, "value": "1,234" },
    "total_donations_eur": { "label": { "...": "..." }, "value": "25,000", "symbol": "€" },
    "active_donors": { "label": { "...": "..." }, "value": "5,678" },
    "success_rate": { "label": { "...": "..." }, "value": "94%" }
  },
  "currencies": {
    "EUR": { "code": "EUR", "symbol": "€", "label": { "...": "..." }, "presets": [], "subPresets": [], "max": 500, "step": 5 }
  },
  "campaigns": [
    {
      "id": "cmp-1",
      "title": { "ar": "...", "fr": "...", "en": "..." },
      "description": { "ar": "...", "fr": "...", "en": "..." },
      "goal_amount_eur": 8000,
      "raised_amount_eur": 4500,
      "donors_count": 156,
      "theme": "red"
    }
  ]
}
```

Why this endpoint matters:

- Keeps the donations page **fast** and decoupled from unrelated `site-content` payloads.

### 7.2 Single campaign (deep links / sharing)

**A)** `GET /api/public/donations/campaigns/:id`

**B)** `GET /api/public/donation-campaign.php?id=...`

Query params:

- `lang`

Response:

- campaign details + optional “updates/story” fields later (`updates[]`)

### 7.3 Create donation intent (UI-first → payment later)

**A)** `POST /api/public/donations/intents`

**B)** `POST /api/public/donation-intent.php`

Body (JSON):

```json
{
  "campaign_id": "cmp-1",
  "type": "one_time",
  "amount": 100,
  "currency": "EUR",
  "full_name": "Optional",
  "phone": "+213...",
  "message": "Optional"
}
```

Response:

```json
{
  "id": "intent_...",
  "status": "created",
  "next_step": "contact_support"
}
```

Later (payments):

- **A)** `POST /api/public/donations/intents/:id/checkout`
- **B)** `POST /api/public/donation-checkout.php`

Body:

```json
{ "provider": "stripe|cib|paypal|...", "success_url": "...", "cancel_url": "..." }
```

Response:

```json
{ "checkout_url": "https://..." }
```

Webhooks (provider-specific):

- `POST /api/public/payments/webhook.php` (single entry) OR per-provider files.

### 7.4 Optional: public transparency feed

**A)** `GET /api/public/donations/transparency?limit=20`

**B)** `GET /api/public/donation-transparency.php`

Returns anonymized “what we funded recently” events (builds trust without exposing sensitive donor PII).

---

## 8) Proposed admin endpoints + control panel workflows

### 8.1 Campaign manager (CRUD + publish)

**A)** `GET|POST|PUT|DELETE /api/admin/donation-campaigns`

**B)** `api/admin/donation-campaigns.php` (methods: GET/POST/PUT/DELETE)

Admin controls:

- create/edit campaign fields (AR/FR/EN)
- set `goal_amount_eur`, `raised_amount_eur` (or mark raised as computed-only)
- upload/select `cover_image_url`
- ordering (`sort_order`)
- active toggle (`is_active`)
- “verified campaign” toggle (trust)
- schedule windows (`starts_at`, `ends_at`) optional

### 8.2 Donation intents dashboard (operations)

**A)** `GET /api/admin/donations/intents?status=&campaign_id=&type=`

**B)** `api/admin/donation-intents.php`

Admin controls:

- filter + search
- status transitions (`created` → `confirmed` → `paid` / `cancelled`)
- attach internal notes (not public)
- export CSV for accounting

### 8.3 Stats configuration (early rollout)

Preferred: store under `site_settings` as `donations_stats` JSON (already have `api/admin/site-settings.php`).

Admin controls:

- edit headline stats values + labels (still must satisfy Rule #1)

---

## 9) i18n keys (Rule #1)

Implemented under `donations.*`:

- `donations.campaign.donors`
- `donations.campaign.contribute`
- `donations.campaign.complete` (uses `{p}` placeholder)
- `donations.form.title`
- `donations.form.subtitle`
- `donations.form.forCampaign`
- `donations.form.oneTime`
- `donations.form.monthly`
- `donations.form.amountOneTime`
- `donations.form.amountMonthly`
- `donations.form.amountSlider`
- `donations.form.confirmOneTime`
- `donations.form.confirmMonthly`
- `donations.form.secure`
- `donations.form.cards`

Campaign titles/descriptions are currently **data-driven translations** in `frontend/src/data/donations.ts` (AR/FR/EN objects), which matches the “dynamic content must be multilingual” part of Rule #1.

---

## 10) Edge cases / UX safeguards (must stay true after backend wiring)

- **Currency honesty**: show a clear note if displayed totals are “converted estimates” vs “native currency accounting”.
- **Campaign completion**: if `raised >= goal`, show “goal met” state and route new donations to a general fund (admin policy).
- **Monthly subscriptions**: require explicit consent copy + cancellation policy (future legal/ops text).
- **Fraud/abuse**: rate-limit intent creation; CAPTCHA on public POST (later).

---

## 11) Rule #0 compliance (documentation)

Whenever donations changes:

- update `DONATIONS_PAGE_MAP.md`
- update `PROMPT_LOG.md`
- update `PROJECT_STATUS.md`

---

## Changelog

| Date (UTC+1) | Note |
| --- | --- |
| 2026-04-29 | Initial rebuild: legacy-inspired layout (stats + campaigns + form), `/donations` route, mock data module, i18n keys, build verified. |
| 2026-04-29 | Tracker expanded to match other `*_PAGE_MAP.md` depth: legacy pointers, detailed endpoint proposals (public + admin), data contracts, i18n list, safeguards, changelog. |

## Related

- Platform intent: `project-explainer.md` (Donations section).
- Process: `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`.
- Site settings admin API (stats storage option): `api/admin/site-settings.php`.

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see root `PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in root `PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.
