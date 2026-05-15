-- Legacy migration: admin-only columns merged into `health_services_schema.sql` (2026-05-14+).
-- Use this file ONLY if you imported an older schema before those columns existed.
-- Import order: (1) `health_services_schema.sql` then (2) this file — or run individual ALTERs
-- and ignore "Duplicate column name" errors.
--
-- Columns covered:
--   contact_messages.is_read
--   donation_intents.admin_note, donation_intents.status
--   services.icon_key, services.color_class, services.bg_class

ALTER TABLE contact_messages
  ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0 AFTER message;

ALTER TABLE donation_intents
  ADD COLUMN admin_note VARCHAR(512) NULL DEFAULT NULL AFTER message;

ALTER TABLE donation_intents
  ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'new' AFTER admin_note;

ALTER TABLE services
  ADD COLUMN icon_key VARCHAR(64) NOT NULL DEFAULT 'heart' AFTER id;

ALTER TABLE services
  ADD COLUMN color_class VARCHAR(128) NOT NULL DEFAULT 'from-green-500 to-emerald-600' AFTER features_json;

ALTER TABLE services
  ADD COLUMN bg_class VARCHAR(128) NOT NULL DEFAULT 'bg-green-50' AFTER color_class;
