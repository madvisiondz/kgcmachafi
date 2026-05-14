-- Optional one-time patches for Health Services admin UI (run in phpMyAdmin after main schema import).
-- Safe to run once; ignore errors if columns already exist (or run each statement manually).

ALTER TABLE contact_messages
  ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0 AFTER message;

ALTER TABLE donation_intents
  ADD COLUMN admin_note VARCHAR(512) NULL DEFAULT NULL AFTER message;

ALTER TABLE donation_intents
  ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'new' AFTER admin_note;

-- If services table predates icon/color columns used by admin API:
ALTER TABLE services
  ADD COLUMN icon_key VARCHAR(64) NOT NULL DEFAULT 'heart' AFTER id;

ALTER TABLE services
  ADD COLUMN color_class VARCHAR(128) NOT NULL DEFAULT 'from-green-500 to-emerald-600' AFTER features_json;

ALTER TABLE services
  ADD COLUMN bg_class VARCHAR(128) NOT NULL DEFAULT 'bg-green-50' AFTER color_class;
