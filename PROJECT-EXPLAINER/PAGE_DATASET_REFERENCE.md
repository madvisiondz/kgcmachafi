# Machafi — Page overview & recommended dataset columns

Reference for the **frontend routes** in this repo (`frontend/src/App.tsx`). **Brief content & value** describes what each surface is for; **recommended columns** suggest a normalized schema for CMS / API / admin (extend with `created_at`, `updated_at`, `created_by`, `published_at`, `status` as needed).

---

## `/` — Home

| | |
|---|---|
| **Content** | Landing: hero, platform sections, stats, entry points to live, programs, services, library, directories, donations. |
| **Value** | Fast orientation: what Machafi offers and where to go next (discovery, not deep data). |
| **Recommended columns** | Mostly **CMS blocks** (ordered sections): `block_id`, `block_type`, `sort_order`, `title_ar`, `title_fr`, `title_en`, `body_*`, `cta_label_*`, `cta_url`, `image_asset_id`, `visible_from`, `visible_to`. Optional **aggregate stats** if real: `metric_key`, `value`, `as_of`. |

---

## `/about` — Who we are & contact

| | |
|---|---|
| **Content** | Editorial “press note” / institutional story and a **contact form** (UI demo; not wired to mail/API in mocks). |
| **Value** | Trust, partner context, and a channel for partnerships / press / non-urgent inquiries. |
| **Recommended columns** | **Static pages**: `slug`, `title_*`, `body_md_*`, `locale`, `version`. **Contact submissions** (if persisted): `id`, `submitted_at`, `name`, `email`, `message`, `ip_hash`, `spam_score`, `handled_at`, `assigned_to`. |

---

## `/library` — Health library

| | |
|---|---|
| **Content** | Catalog of books / materials (ebook vs physical), categories, download or preview links. |
| **Value** | Long-form trusted resources; supports awareness and patient education. |
| **Recommended columns** | `id`, `slug`, `title_ar`, `title_fr`, `title_en`, `author_*`, `category_id`, `book_type` (`ebook` \| `physical`), `pages`, `image_asset_id`, `file_asset_id` (or `external_url`), `language`, `is_published`, `sort_order`. **Categories**: `category_id`, `key`, `label_*`. |

*Aligned with `LibraryBookRecord` in `frontend/src/data/libraryBooks.ts`.*

---

## `/service` — Services & suppliers

| | |
|---|---|
| **Content** | Service listings, supplier/exhibition-style entries, searchable catalog. |
| **Value** | Connects audiences to **operational** health/social offerings beyond directories (events, suppliers, structured services). |
| **Recommended columns** | **Services**: `id`, `slug`, `section_id`, `name_*`, `summary_*`, `phone`, `email`, `website`, `wilaya_code`, `commune_id`, `latitude`, `longitude`, `tags[]`, `is_featured`, `is_active`. **Sections**: `id`, `key`, `title_*`, `sort_order`. **Suppliers / exhibitions**: same pattern + `booth_or_stand`, `event_date`, `logo_asset_id`. |

*See `frontend/src/data/services.ts` for mock shapes.*

---

## `/donations` — Donations

| | |
|---|---|
| **Content** | Campaigns, one-time vs recurring UI, currency selection, impact stats (demo). |
| **Value** | Fundraising and transparency for humanitarian / patient-support campaigns. |
| **Recommended columns** | **Campaigns**: `id`, `slug`, `title_*`, `story_*`, `goal_amount`, `currency`, `raised_amount`, `starts_at`, `ends_at`, `image_asset_id`, `is_active`. **Donation intents / transactions** (production): `id`, `campaign_id`, `amount`, `currency`, `type` (`one_time` \| `recurring`), `provider_ref`, `status`, `donor_hash`, `created_at`. **Stats snapshots**: `date`, `total_raised`, `donors_count` (if displayed). |

*See `frontend/src/data/donations.ts`.*

---

## `/news` & `/news/:id` — Newsroom

| | |
|---|---|
| **Content** | Listing with wires/sources, tags, search; **detail** with long-form body, share, disclaimer. |
| **Value** | Timely health information with editorial workflow hooks (breaking, featured, archives). |
| **Recommended columns** | `id`, `slug`, `source_key`, `tag_key`, `date`, `is_archived`, `featured`, `breaking`, `reading_minutes`, `byline_key`, `title_ar`, `title_fr`, `title_en`, `lead_ar`, `lead_fr`, `lead_en`, `body_ar` (JSON or HTML), `body_fr`, `body_en`, `seo_description_*`, `hero_image_asset_id`, `embargo_until`, `review_status`. |

*Aligned with `NewsArticleMock` in `frontend/src/data/news.ts`.*

---

## `/live` — Live broadcast

| | |
|---|---|
| **Content** | Stream player (demo URL), schedule CTA, recorded items, viewer-oriented copy. |
| **Value** | Real-time health programming; central place for **stream URL**, quality, and schedule. |
| **Recommended columns** | **Stream config** (singleton or env + DB override): `hls_url`, `rtmp_ingest` (admin only), `is_live`, `started_at`, `ended_at`. **Schedule rows**: `id`, `title_*`, `starts_at`, `duration_min`, `is_replay`, `replay_asset_id`. **Recorded episodes**: `id`, `title_*`, `duration_min`, `thumbnail_asset_id`, `video_asset_id`, `published_at`. |

---

## `/pharmacies` — Pharmacies directory

| | |
|---|---|
| **Content** | Filter by wilaya, commune, search; optional night-duty; map-oriented data. |
| **Value** | Locate verified / listed pharmacies and contact them quickly. |
| **Recommended columns** | `id`, `name`, `wilaya_code`, `wilaya_name_ar`, `wilaya_name_fr`, `commune_id` or `city_ar` / `city_fr`, `address_ar`, `address_fr`, `phone`, `latitude`, `longitude`, `night_duty` (bool or schedule FK), `source` (`static` \| `dynamic`), `verified_at`, `is_active`. |

*Aligned with `Pharmacy` in `frontend/src/data/pharmacies.ts`.*

---

## `/ambulances` — Ambulances directory

| | |
|---|---|
| **Content** | Listings by wilaya/commune, vehicle type (standard / ICU / medical transport), pricing hint, map. |
| **Value** | Rapid access to transport for emergencies or transfers. |
| **Recommended columns** | `id`, `owner_name`, `phone`, `wilaya_code`, `commune_id`, `vehicle_type`, `is_free`, `price_description_*`, `latitude`, `longitude`, `is_active`, `verified_at`. |

*Aligned with `AmbulanceListing` in `frontend/src/data/ambulances.ts`.*

---

## `/accommodations` — Housing (patients & companions)

| | |
|---|---|
| **Content** | Hostels, volunteer homes, associations; capacity, price, verification, companion/long-stay flags. |
| **Value** | Reduces friction for families traveling for care (lodging near care pathways). |
| **Recommended columns** | `id`, `title_*`, `host_name`, `phone`, `wilaya_code`, `commune_id`, `address_*`, `housing_type`, `capacity`, `is_free`, `price_per_night_dzd`, `description_*`, `is_verified`, `accepts_companion`, `suitable_for_long_stay`, `latitude`, `longitude`, `is_active`. |

*Aligned with `HousingListing` in `frontend/src/data/housing.ts`.*

---

## `/programs` — Program schedule

| | |
|---|---|
| **Content** | Weekly grid: show title, host, category, time, live vs replay (i18n keys in UI). |
| **Value** | Predictable **broadcast schedule** and discovery of health programming. |
| **Recommended columns** | **Schedule**: `id`, `program_key`, `host_key`, `category`, `day_of_week`, `start_time`, `duration_min`, `is_live`, `is_replay_available`, `timezone`. **Programs dictionary**: `program_key`, `title_*`, `description_*`. **Hosts**: `host_key`, `display_name_*`, `photo_asset_id`. |

*Aligned with `ProgramScheduleItem` in `frontend/src/data/programs.ts`.*

---

## `/hospitals` — Hospitals (Algeria + abroad)

| | |
|---|---|
| **Content** | Local: wilaya, commune, type (public/private/clinic/specialized), features (ER, ICU, teleconsult), verification. Abroad: country, specialty. |
| **Value** | Core **facility discovery** for treatment and referrals (local + international options). |
| **Recommended columns (Algeria)** | `id`, `name`, `wilaya_code`, `commune_id`, `address_*`, `phone`, `website`, `type`, `specialty_tags[]`, `hours_label`, `is_verified`, `rating`, `reviews_count`, `features[]`, `latitude`, `longitude`, `is_active`. |
| **Recommended columns (international)** | `id`, `name`, `country_key`, `specialty_key`, `city_*`, `phone`, `website`, `is_verified`, `rating`, `reviews_count`, `features[]`, `is_active`. |

*Aligned with `HospitalListing` / `InternationalHospitalListing` in `frontend/src/data/hospitals.ts`.*

---

## `/consultations` — Consultations / doctors

| | |
|---|---|
| **Content** | Specialties, doctor cards: location, modes (remote / in-person), price, verification. |
| **Value** | Bridges users to **bookable** or reachable consultations with transparent pricing signals. |
| **Recommended columns** | **Specialties**: `id`, `key`, `label_*`, `icon`, `sort_order`. **Providers**: `id`, `display_name`, `specialty_id`, `wilaya_code`, `commune_id`, `clinic_name_*`, `experience_years`, `rating`, `price`, `currency`, `phone`, `supports_remote`, `supports_in_person`, `is_verified`, `is_active`, `booking_url` (future). |

*Aligned with `ConsultationDoctor` / `ConsultationSpecialty` in `frontend/src/data/consultations.ts`.*

---

## Cross-cutting recommendations

| Concern | Suggested approach |
|--------|---------------------|
| **Wilaya / commune** | Store canonical `wilaya_code` (2 digits) and `commune_id` matching administrative data (see `frontend/src/data/algeria-data.js`). |
| **i18n** | Prefer `*_ar`, `*_fr`, `*_en` (or JSON columns per locale) for user-facing strings; keep internal keys (`program_key`, `tag_key`) stable. |
| **Geo** | `latitude`, `longitude` as nullable decimals; index for map queries. |
| **Trust** | `is_verified`, `verified_at`, `source` for directory rows. |
| **Audit** | All mutable entities: timestamps + optional `updated_by` for admin integration. |

---

## Changelog

- **2026-04-30**: Synced with project docs. Confirmed coverage for all routes in `frontend/src/App.tsx` (`/` … `/consultations`). Site-wide header/nav styling (e.g. `.kgc-main-nav-gradient`) does not change per-page data contracts; see `PROMPT_LOG.md` (2026-04-30).

---

*Generated as a handoff reference for Machafi frontend routes and intended data models. Adjust column names to match your SQL or NoSQL conventions.*


---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*
