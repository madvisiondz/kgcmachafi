-- MACHAFI Health Services — MySQL 8+ / MariaDB 10.5+
-- UTF8MB4, InnoDB. Run as DB user with CREATE privileges.
-- Default admin: username `admin`, password `changeme` — CHANGE IMMEDIATELY after import.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(128) NOT NULL DEFAULT '',
  role VARCHAR(32) NOT NULL DEFAULT 'editor',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_articles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT NULL,
  tag VARCHAR(128) NOT NULL DEFAULT 'وطني',
  source VARCHAR(128) NOT NULL DEFAULT 'محلي',
  date DATE NOT NULL,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  slug VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_slug (slug),
  KEY idx_news_date (date),
  KEY idx_news_archived (is_archived)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pharmacies (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  wilaya VARCHAR(8) NOT NULL,
  commune VARCHAR(128) NOT NULL,
  phone VARCHAR(64) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  is_night_duty TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pharm_wilaya (wilaya, commune),
  KEY idx_pharm_night (is_night_duty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hospitals (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'public',
  wilaya_id VARCHAR(8) NOT NULL,
  city VARCHAR(128) NOT NULL,
  address VARCHAR(512) NULL,
  specialties_json JSON NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  reviews_count INT UNSIGNED NOT NULL DEFAULT 0,
  hours VARCHAR(128) NOT NULL DEFAULT '24/7',
  phone VARCHAR(64) NULL,
  website VARCHAR(255) NULL,
  payment_methods_json JSON NULL,
  insurance_providers_json JSON NULL,
  features_json JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_hosp_wilaya (wilaya_id, city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS international_hospitals (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(64) NOT NULL DEFAULT 'turkey',
  city VARCHAR(128) NOT NULL,
  specialty VARCHAR(64) NOT NULL DEFAULT 'oncology',
  description TEXT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  reviews_count INT UNSIGNED NOT NULL DEFAULT 0,
  hours VARCHAR(128) NOT NULL DEFAULT '24/7',
  phone VARCHAR(64) NULL,
  website VARCHAR(255) NULL,
  payment_methods_json JSON NULL,
  insurance_providers_json JSON NULL,
  features_json JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ih_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ambulances (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  wilaya_id VARCHAR(8) NOT NULL,
  city VARCHAR(128) NOT NULL,
  is_free TINYINT(1) NOT NULL DEFAULT 0,
  price_description VARCHAR(255) NULL,
  vehicle_type VARCHAR(64) NOT NULL DEFAULT 'standard',
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_amb_wilaya (wilaya_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS patient_accommodations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  wilaya_id VARCHAR(8) NOT NULL,
  city VARCHAR(128) NOT NULL,
  address VARCHAR(512) NULL,
  is_free TINYINT(1) NOT NULL DEFAULT 0,
  price_per_night DECIMAL(12,2) NOT NULL DEFAULT 0,
  capacity INT UNSIGNED NOT NULL DEFAULT 1,
  description TEXT NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_acc_wilaya (wilaya_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  details TEXT NULL,
  features_json JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS programs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  time_slot VARCHAR(32) NOT NULL,
  day_of_week TINYINT NULL,
  days_of_week VARCHAR(64) NULL,
  day_type VARCHAR(32) NOT NULL DEFAULT 'daily',
  category VARCHAR(64) NOT NULL DEFAULT 'general',
  description TEXT NULL,
  video_url VARCHAR(512) NULL,
  image_url VARCHAR(512) NULL,
  video_duration_seconds INT UNSIGNED NULL,
  video_duration_label VARCHAR(64) NULL,
  program_key VARCHAR(64) NULL,
  host_key VARCHAR(64) NULL,
  day_key VARCHAR(8) NULL,
  duration_min INT UNSIGNED NULL,
  is_live_slot TINYINT(1) NOT NULL DEFAULT 0,
  is_replay_available TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_prog_active (is_active, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL DEFAULT '',
  book_type VARCHAR(32) NOT NULL DEFAULT 'standard',
  file_path VARCHAR(512) NOT NULL,
  image_url VARCHAR(512) NULL,
  pages INT UNSIGNED NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_books_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS video_programs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  video_url VARCHAR(512) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(128) NOT NULL PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hero_stats (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  icon_key VARCHAR(64) NOT NULL DEFAULT 'users',
  label VARCHAR(255) NOT NULL,
  value VARCHAR(64) NOT NULL,
  color_class VARCHAR(128) NOT NULL DEFAULT 'from-green-500 to-emerald-600',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultation_specialties (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  specialty_key VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  icon_emoji VARCHAR(16) NOT NULL DEFAULT '🏥',
  color_class VARCHAR(128) NOT NULL DEFAULT 'from-green-500 to-emerald-600',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultation_doctors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  specialty_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  hospital VARCHAR(255) NULL,
  clinic_name VARCHAR(255) NULL,
  wilaya_id VARCHAR(8) NOT NULL DEFAULT '',
  commune_id VARCHAR(128) NOT NULL DEFAULT '',
  phone VARCHAR(64) NOT NULL DEFAULT '',
  experience_years INT UNSIGNED NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency VARCHAR(8) NOT NULL DEFAULT 'DZD',
  supports_remote TINYINT(1) NOT NULL DEFAULT 0,
  supports_in_person TINYINT(1) NOT NULL DEFAULT 1,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_doc_spec (specialty_id),
  KEY idx_doc_wilaya (wilaya_id),
  CONSTRAINT fk_doc_specialty FOREIGN KEY (specialty_id) REFERENCES consultation_specialties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultation_bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT UNSIGNED NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(64) NOT NULL,
  preferred_date DATE NULL,
  notes TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_book_doc (doctor_id),
  CONSTRAINT fk_booking_doctor FOREIGN KEY (doctor_id) REFERENCES consultation_doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donation_campaigns (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title_json JSON NOT NULL,
  description_json JSON NOT NULL,
  raised_eur DECIMAL(14,2) NOT NULL DEFAULT 0,
  goal_eur DECIMAL(14,2) NOT NULL DEFAULT 1,
  donors INT UNSIGNED NOT NULL DEFAULT 0,
  theme VARCHAR(16) NOT NULL DEFAULT 'emerald',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donation_intents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  campaign_id VARCHAR(64) NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'DZD',
  donor_name VARCHAR(255) NULL,
  donor_email VARCHAR(255) NULL,
  is_monthly TINYINT(1) NOT NULL DEFAULT 0,
  message TEXT NULL,
  honeypot VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_intent_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donation_stats (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
  helped_value VARCHAR(32) NOT NULL DEFAULT '0',
  total_value_eur VARCHAR(32) NOT NULL DEFAULT '0',
  donors_value VARCHAR(32) NOT NULL DEFAULT '0',
  success_value VARCHAR(32) NOT NULL DEFAULT '0',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  honeypot VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_page_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
  stream_url VARCHAR(1024) NOT NULL DEFAULT '',
  poster_url VARCHAR(512) NOT NULL DEFAULT '/home/hero.jpg',
  viewer_count_label VARCHAR(64) NOT NULL DEFAULT '0',
  broadcast_state ENUM('live','offline') NOT NULL DEFAULT 'offline',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_recorded_items (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  program_key VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  duration_min INT UNSIGNED NOT NULL DEFAULT 0,
  video_url VARCHAR(1024) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_up_next (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  program_key VARCHAR(64) NOT NULL,
  start_time VARCHAR(16) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS homepage_sections (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(512) NULL,
  payload_json JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS public_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  wilaya_id VARCHAR(8) NULL,
  commune VARCHAR(128) NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'member',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ─── Seed (idempotent inserts) ─────────────────────────────────────

INSERT INTO admin_users (id, username, password_hash, full_name, role, is_active) VALUES
(1, 'admin', '$2y$10$5U6.l4Vmx6XPARhPdeuOvOa1Ob3A/czfp943/bNBiPXn4uMrJ.PFS', 'Machafi Admin', 'admin', 1)
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO donation_stats (id, helped_value, total_value_eur, donors_value, success_value) VALUES
(1, '1,234', '25,000', '5,678', '94%')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO live_page_settings (id, stream_url, poster_url, viewer_count_label, broadcast_state) VALUES
(1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '/home/hero.jpg', '2.4K', 'live')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('about', JSON_OBJECT('mission_ar', 'منصة صحية جزائرية', 'mission_fr', 'Plateforme santé', 'mission_en', 'Health platform', 'contact_email', 'contact@kgc-machafi.net', 'contact_phone', '+213 555 000 000', 'address_ar', 'الجزائر', 'address_fr', 'Alger', 'address_en', 'Algiers'))
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

INSERT IGNORE INTO hero_stats (icon_key, label, value, color_class, sort_order, is_active) VALUES
('users', 'زوار يومياً', '12K+', 'from-blue-500 to-cyan-500', 1, 1),
('heart', 'خدمات', '24+', 'from-emerald-500 to-teal-600', 2, 1),
('book', 'كتب طبية', '150+', 'from-amber-500 to-orange-500', 3, 1);

DELETE FROM consultation_bookings;
DELETE FROM consultation_doctors;
DELETE FROM consultation_specialties;

INSERT INTO consultation_specialties (specialty_key, name, icon_emoji, color_class, sort_order, is_active) VALUES
('general', 'طب عام', '🩺', 'from-emerald-500 to-green-600', 1, 1),
('cardiology', 'قلب وأوعية', '❤️', 'from-rose-500 to-red-600', 2, 1),
('dermatology', 'جلدية', '🧴', 'from-teal-600 to-emerald-700', 3, 1),
('pediatrics', 'أطفال', '🧒', 'from-sky-500 to-blue-600', 4, 1),
('psychology', 'نفسية', '🧠', 'from-amber-500 to-orange-600', 5, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO consultation_doctors (specialty_id, name, hospital, clinic_name, wilaya_id, commune_id, phone, experience_years, rating, price, currency, supports_remote, supports_in_person, is_verified, sort_order, is_active)
SELECT s.id, 'Dr. Samira B.', 'CHU Alger', 'Clinique El Amal', '16', 'alger-centre', '+213555401016', 10, 4.7, 2500, 'DZD', 1, 1, 1, 1, 1 FROM consultation_specialties s WHERE s.specialty_key = 'cardiology' LIMIT 1;
INSERT INTO consultation_doctors (specialty_id, name, hospital, clinic_name, wilaya_id, commune_id, phone, experience_years, rating, price, currency, supports_remote, supports_in_person, is_verified, sort_order, is_active)
SELECT s.id, 'Dr. Karim N.', NULL, 'Cabinet privé', '16', 'bab-ezzouar', '+213555402016', 7, 4.4, 2000, 'DZD', 1, 0, 0, 2, 1 FROM consultation_specialties s WHERE s.specialty_key = 'dermatology' LIMIT 1;
INSERT INTO consultation_doctors (specialty_id, name, hospital, clinic_name, wilaya_id, commune_id, phone, experience_years, rating, price, currency, supports_remote, supports_in_person, is_verified, sort_order, is_active)
SELECT s.id, 'Dr. Lina H.', NULL, 'Cabinet pédiatrie', '31', 'oran', '+213555401031', 12, 4.6, 2200, 'DZD', 1, 1, 1, 1, 1 FROM consultation_specialties s WHERE s.specialty_key = 'pediatrics' LIMIT 1;

INSERT INTO pharmacies (name, wilaya, commune, phone, latitude, longitude, is_night_duty, is_active) VALUES
('صيدلية النور — الجزائر الوسطى', '16', 'الجزائر الوسطى', '+213555100001', 36.7538, 3.0588, 1, 1),
('Pharmacie El Biar', '16', 'البيار', '+213555100002', 36.7680, 3.0300, 0, 1),
('صيدلية وهران — وسط المدينة', '31', 'وهران', '+213555310001', 35.6969, -0.6331, 0, 1);

INSERT INTO hospitals (name, type, wilaya_id, city, address, specialties_json, rating, reviews_count, hours, phone, website, payment_methods_json, insurance_providers_json, features_json, sort_order, is_active) VALUES
('CHU Mustapha', 'public', '16', 'الجزائر', '1 Rue des Pins', JSON_ARRAY('urgences', 'cardiologie'), 4.5, 120, '24/7', '+21321300100', 'https://example.org', JSON_ARRAY('carte', 'especes'), JSON_ARRAY('CNAS'), JSON_ARRAY('emergency', 'icu'), 1, 1),
('Clinique El Azhar', 'private', '16', 'الجزائر', 'Hydra', JSON_ARRAY('chirurgie'), 4.6, 45, '08:00-20:00', '+213555200200', NULL, JSON_ARRAY('carte'), JSON_ARRAY(), JSON_ARRAY('online_consult'), 2, 1);

INSERT INTO international_hospitals (name, country, city, specialty, description, rating, reviews_count, hours, phone, website, payment_methods_json, insurance_providers_json, features_json, sort_order, is_active) VALUES
('Memorial Hospital', 'turkey', 'Istanbul', 'oncology', 'Centre de référence.', 4.7, 200, '24/7', '+902121234567', 'https://example.com', JSON_ARRAY('carte'), JSON_ARRAY(), JSON_ARRAY('icu'), 1, 1);

INSERT INTO ambulances (owner_name, phone, wilaya_id, city, is_free, price_description, vehicle_type, latitude, longitude, is_active) VALUES
('Ambulance Oran Express', '+213555410000', '31', 'وهران', 0, 'À partir de 3000 DZD', 'van', 35.697, -0.634, 1),
('Croissant Rouge — Alger', '+213555000099', '16', 'الجزائر', 1, 'Gratuit selon disponibilité', 'standard', 36.75, 3.06, 1);

INSERT INTO patient_accommodations (title, owner_name, phone, wilaya_id, city, address, is_free, price_per_night, capacity, description, latitude, longitude, is_active) VALUES
('Dar El Shifa', 'M. Khaled', '+213555330001', '16', 'الجزائر', '12 Rue Didouche', 0, 3500, 2, 'قرب المستشفى.', 36.76, 3.05, 1);

INSERT INTO services (title, description, details, features_json, sort_order, is_active) VALUES
('استشارة عن بُعد', 'موعد فيديو مع مختص', 'Réservez un créneau.', JSON_ARRAY('24/7', 'Vidéo sécurisée'), 1, 1),
('دليل الصيدليات', 'صيدليات الحراسة والليل', NULL, JSON_ARRAY('Wilayas', 'Carte'), 2, 1);

INSERT INTO programs (title, time_slot, day_of_week, days_of_week, day_type, category, description, video_url, image_url, video_duration_seconds, video_duration_label, program_key, host_key, day_key, duration_min, is_live_slot, is_replay_available, is_active) VALUES
('صباح صحي', '09:00', 6, '6', 'weekly', 'awareness', 'برنامج توعية', NULL, NULL, 35, '35 min', 'healthyMorning', 'drBenali', 'sat', 35, 0, 1, 1),
('أساسيات التغذية', '18:00', 6, '6', 'weekly', 'nutrition', 'حلقة مباشرة', NULL, NULL, 40, '40 min', 'nutritionBasics', 'coachLina', 'sat', 40, 1, 1, 1);

INSERT INTO books (title, author, category, book_type, file_path, image_url, pages, rating) VALUES
('دليل الإسعافات الأولية', 'KGC Medical', 'urgence', 'standard', '#', NULL, 120, 4.8),
('Nutrition et diabète', 'Dr. Benali', 'nutrition', 'standard', '#', NULL, 200, 4.5);

INSERT INTO news_articles (title, description, content, tag, source, date, is_archived, slug) VALUES
('افتتاح قسم الاستشارات عن بُعد', 'خدمة جديدة على منصة ماشافي.', 'Paragraphe un.\n\nParagraphe deux.', 'وطني', 'محلي', CURDATE(), 0, 'teleconsult-launch'),
('تذكير: التطعيم الموسمي', 'ننصح بزيارة أقرب صيدلية.', 'Contenu court.', 'صحة عامة', 'محلي', CURDATE(), 0, 'vaccination-reminder');

INSERT INTO donation_campaigns (id, title_json, description_json, raised_eur, goal_eur, donors, theme, sort_order, is_active) VALUES
('cmp-1',
 JSON_OBJECT('ar', 'علاج طفلة', 'fr', 'Opération urgente', 'en', 'Urgent surgery'),
 JSON_OBJECT('ar', 'وصف', 'fr', 'Description', 'en', 'Description'),
 4500, 8000, 156, 'red', 1, 1),
('cmp-2',
 JSON_OBJECT('ar', 'أدوية السرطان', 'fr', 'Médicaments', 'en', 'Medication'),
 JSON_OBJECT('ar', 'دعم', 'fr', 'Soutien', 'en', 'Support'),
 12000, 20000, 420, 'emerald', 2, 1)
ON DUPLICATE KEY UPDATE title_json = VALUES(title_json);

INSERT INTO live_recorded_items (id, program_key, category, duration_min, video_url, sort_order) VALUES
('vod-1', 'nutritionBasics', 'nutrition', 40, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1),
('vod-2', 'stressRelief', 'mental-health', 45, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 2)
ON DUPLICATE KEY UPDATE program_key = VALUES(program_key);

INSERT INTO live_up_next (id, program_key, start_time, sort_order) VALUES
('up-1', 'familyHealth', '19:00', 1),
('up-2', 'diabetesCare', '21:00', 2)
ON DUPLICATE KEY UPDATE start_time = VALUES(start_time);

INSERT INTO homepage_sections (section_key, title, subtitle, payload_json, sort_order, is_active) VALUES
('hero', 'Machafi Services', 'دليلك الصحي في الجزائر', JSON_OBJECT('ctaPrimary', '/healthservices/consultations'), 1, 1),
('stats', 'أرقام تهمك', NULL, JSON_OBJECT('source', 'hero_stats'), 2, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);
