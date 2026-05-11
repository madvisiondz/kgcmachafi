-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 26, 2026 at 09:32 PM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kgcmachafi_madvision`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodation_reviews`
--

CREATE TABLE `accommodation_reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `accommodation_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(160) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `full_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin@kgc-machafi.com', '$2y$10$lMaVOndHiQgFgrEctJsrRO0qyKWo9YlfYkapKTyUp7oAfXIgPMcsK', 'KGC MACHAFI Admin', 'admin', 1, '2026-04-09 16:06:17', '2026-04-11 18:33:20'),
(2, 'kgcmachafi_admino', '$2y$10$suseSNYLknGuC/ykTma4yeScXXEaiOkD4YM1phXUC6bhuE74leW8K', 'KGC MACHAFI Admin', 'admin', 1, '2026-04-12 00:30:48', '2026-04-12 00:30:48');

-- --------------------------------------------------------

--
-- Table structure for table `ambulances`
--

CREATE TABLE `ambulances` (
  `id` int(10) UNSIGNED NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `phone` varchar(80) NOT NULL,
  `wilaya_id` varchar(10) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `is_free` tinyint(1) NOT NULL DEFAULT 0,
  `price_description` varchar(255) DEFAULT NULL,
  `vehicle_type` varchar(40) NOT NULL DEFAULT 'standard',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ambulance_reviews`
--

CREATE TABLE `ambulance_reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `ambulance_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `category` varchar(120) NOT NULL DEFAULT '',
  `book_type` enum('ebook','standard') NOT NULL DEFAULT 'standard',
  `file_path` varchar(500) NOT NULL DEFAULT '#',
  `image_url` varchar(500) DEFAULT NULL,
  `pages` int(10) UNSIGNED DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `category`, `book_type`, `file_path`, `image_url`, `pages`, `rating`, `created_at`, `updated_at`) VALUES
(1, 'دليل التغذية الصحية', 'د. محمد أحمد', 'تغذية', 'standard', '#', 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 250, 4.8, '2026-04-09 16:06:17', '2026-04-09 16:06:17'),
(2, 'صحة الطفل والأسرة', 'د. سارة علي', 'صحة الطفل', 'standard', '#', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 180, 4.9, '2026-04-09 16:06:17', '2026-04-09 16:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `consultation_doctors`
--

CREATE TABLE `consultation_doctors` (
  `id` int(10) UNSIGNED NOT NULL,
  `specialty_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `hospital` varchar(255) NOT NULL,
  `experience_years` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'EUR',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultation_doctors`
--

INSERT INTO `consultation_doctors` (`id`, `specialty_id`, `name`, `hospital`, `experience_years`, `rating`, `price`, `currency`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'د. كمال عمروش', 'مستشفى مصطفى باشا', 15, 4.8, 30.00, 'EUR', 1, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(2, 1, 'د. ليلى بوعلام', 'عيادة الشفاء', 8, 4.9, 35.00, 'EUR', 2, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(3, 2, 'د. يوسف بومدين', 'مستشفى مصطفى باشا', 11, 4.6, 40.00, 'EUR', 3, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(40) NOT NULL DEFAULT 'public',
  `wilaya_id` varchar(10) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address` varchar(500) NOT NULL,
  `specialties_json` longtext DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `hours` varchar(120) NOT NULL DEFAULT '24/7',
  `phone` varchar(80) NOT NULL,
  `website` varchar(500) DEFAULT NULL,
  `payment_methods_json` longtext DEFAULT NULL,
  `insurance_providers_json` longtext DEFAULT NULL,
  `features_json` longtext DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `type`, `wilaya_id`, `city`, `address`, `specialties_json`, `rating`, `reviews_count`, `hours`, `phone`, `website`, `payment_methods_json`, `insurance_providers_json`, `features_json`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'المستشفى الجامعي مصطفى باشا', 'public', '16', 'سيدي امحمد', 'ساحة أول ماي، الجزائر الوسطى', '[]', 4.20, 1240, '24/7', '021 23 55 11', 'www.chu-mustapha.dz', '[]', '[]', '[]', 1, 1, '2026-04-12 00:30:48', '2026-04-12 00:42:06'),
(2, 'عيادة الشفاء الخاصة', 'private', '31', 'الصديقية', 'حي الصديقية، وهران', '[]', 4.80, 312, '08:00 - 20:00', '041 33 22 11', 'www.clinique-chifa.dz', '[]', '[]', '[]', 2, 1, '2026-04-12 00:30:48', '2026-04-12 00:42:06'),
(3, 'Hospital of Timimoun', 'public', '49', 'تيميمون', '764M+9G5, N51, تيميمون', '[]', 4.20, 47, '24/7', '+213 49 90 45 28', NULL, '[]', '[]', '[]', 1, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(4, 'مستشفى تبركات المجاهد محمود قمامة', 'public', '11', 'تمنراست', 'RH35+RQP المستشفى الجديد, تمنراست', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 2, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(5, 'Hospital Tamnrasset', 'public', '11', 'تمنراست', 'QGFH+XMQ, تمنراست', '[]', 3.70, 43, '24/7', '+213 29 32 66 20', NULL, '[]', '[]', '[]', 3, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(6, 'In Amenas Hospital', 'public', '33', 'إن أمناس', 'Route de, إن أمناس', '[]', 4.30, 10, '24/7', '', NULL, '[]', '[]', '[]', 4, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(7, 'مستشفى سرسوف', 'public', '11', 'تمنراست', 'QGXH+734, تمنراست', '[]', 3.90, 14, '24/7', '', NULL, '[]', '[]', '[]', 5, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(8, 'المستشفى العسكري الجهوي الجامعي بتمنراست', 'public', '11', 'تمنراست', 'QGFF+W4V, Rocade S, تمنراست', '[]', 5.00, 3, '24/7', '+213 773 44 43 79', NULL, '[]', '[]', '[]', 6, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(9, 'Beni Ilman Hospital', 'public', '28', 'بني يلمان', 'W4X9+FGH, بني يلمان', '[]', 5.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 7, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(10, 'Hospital Eferi', 'public', '56', 'جانت', 'FGH5+2RG, جانت', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 8, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(11, 'مستشفى 120 سرير', 'public', '53', 'عين صالح', '7GC3+PG3, عين صالح', '[]', 4.50, 2, '24/7', '', NULL, '[]', '[]', '[]', 9, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(12, 'New hospital Tamnrest', 'public', '11', 'تمنراست', 'RH35+WJH, تمنراست', '[]', 3.10, 11, '24/7', '+213 666 66 66 99', NULL, '[]', '[]', '[]', 10, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(13, 'Bol-la Hospital', 'public', '37', 'تندوف', 'FX6X+J97, تندوف', '[]', 5.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 11, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(14, 'Hospital / Urgencias / Centro Médico Bojador - Bojdour', 'public', '37', 'تندوف', 'GX8R+66R, تندوف', '[]', 4.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 12, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(15, 'مستشفى الملك محمد السادس', 'public', '37', 'تندوف', 'PXRP+75P, تندوف', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 13, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(16, 'Hospital Auserd', 'public', '37', 'تندوف', 'J46G+P97, Unnamed Road, تندوف', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 14, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(17, 'Ibn Rochd University Hospital', 'public', '23', 'عنابة', 'WP6W+5MH, Centre Hospitalo Universitaire Ibn Rochd / Annaba. Adresse:, Rte de Séraïdi, عنابة', '[]', 3.30, 134, '24/7', '+213 658 08 52 79', NULL, '[]', '[]', '[]', 15, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(18, 'Hôspital Régional', 'public', '41', 'سوق أهراس', 'Hôpital régional de Souk-ahras, سوق أهراس', '[]', 3.10, 19, '24/7', '+213 661 51 79 47', NULL, '[]', '[]', '[]', 16, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(19, 'Houari Boumediene Hospital Sedrata', 'public', '41', 'سدراتة', 'Salam Street, سدراتة', '[]', 3.20, 29, '24/7', '+213 29 12 32 42', NULL, '[]', '[]', '[]', 17, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(20, 'Mother and child hospital El Bouni', 'public', '23', 'البوني', 'VP4P+FRF, البوني', '[]', 3.70, 43, '24/7', '+213 38 56 82 01', NULL, '[]', '[]', '[]', 18, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(21, 'EPH El Hadjar', 'public', '23', 'الحجار', 'RP3V+JVC, الحجار', '[]', 4.10, 30, '24/7', '+213 38 89 29 94', NULL, '[]', '[]', '[]', 19, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(22, 'Hospital Ibn Rochd', 'public', '41', 'سوق أهراس', '7X72+FQC, سوق أهراس', '[]', 3.30, 19, '24/7', '+213 37 72 43 15', NULL, '[]', '[]', '[]', 20, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(23, 'Ibn Sina Hospital (CHU)', 'public', '23', 'عنابة', 'WQ28+W89, Chem. des Caroubiers, عنابة', '[]', 2.70, 61, '24/7', '+213 38 40 51 53', NULL, '[]', '[]', '[]', 21, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(24, 'Urgences De Merahna', 'public', '41', 'المراهنة', '55W3+JWM, المراهنة', '[]', 2.50, 2, '24/7', '+213 30 96 44 20', NULL, '[]', '[]', '[]', 22, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(25, 'University Hospital Abdelhamid Ben Badis', 'public', '25', 'قسنطينة', '9JC9+X4J, قسنطينة', '[]', 3.90, 194, '24/7', '+213 31 88 66 22', NULL, '[]', '[]', '[]', 23, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(26, 'Hopital militaire Ali Mendjli', 'public', '25', 'الخروب', '6HWP+XJF Hôpital Régional Militaire Universitaire, الخروب', '[]', 4.30, 91, '24/7', '', NULL, '[]', '[]', '[]', 24, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(27, 'Hospital El Khroub', 'public', '25', 'الخروب', '7P65+48W, N3, الخروب', '[]', 3.00, 61, '24/7', '', NULL, '[]', '[]', '[]', 25, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(28, 'EPH Etablissement Hospitalier Public de Skikda', 'public', '21', 'سكيكدة', 'VWJ5+RHV, سكيكدة', '[]', 3.50, 24, '24/7', '', NULL, '[]', '[]', '[]', 26, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(29, 'CENTRE DE SANTÉ', 'public', '36', 'الشط', 'RVM7+425, الشط', '[]', 2.50, 2, '24/7', '', NULL, '[]', '[]', '[]', 27, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(30, 'Hopital abderrezak Bouhara', 'public', '21', 'سكيكدة', 'VV7X+224, Boulevard Brahim Maiza, سكيكدة', '[]', 3.30, 48, '24/7', '+213 38 74 72 17', NULL, '[]', '[]', '[]', 28, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(31, 'Hospital El Hakim Okbi', 'public', '24', 'قالمة', 'FC4P+F53, قالمة', '[]', 2.70, 79, '24/7', '+213 37 20 13 31', NULL, '[]', '[]', '[]', 29, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(32, 'Ehs hôpital seraidi', 'public', '23', 'عنابة', 'WQ29+V6W, Route de Séraïdi, عنابة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 30, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(33, 'CHU hôpital universitaire', 'public', '23', 'عنابة', '11 Bd Seddik Benyahia, عنابة', '[]', 2.00, 5, '24/7', '+213 38 83 56 30', NULL, '[]', '[]', '[]', 31, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(34, 'Seraidi proximity hospital', 'public', '23', 'سرايدي', 'WM7C+FQ9, سرايدي', '[]', 3.30, 3, '24/7', '', NULL, '[]', '[]', '[]', 32, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(35, 'Medical center', 'public', '21', 'أولاد عطية', '2C52+62R, أولاد عطية', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 33, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(36, 'El Hadi Ben Jdid Hospital', 'public', '36', 'الطارف', 'Q87F+7Q3, الطارف', '[]', 4.00, 5, '24/7', '+213 38 30 17 80', NULL, '[]', '[]', '[]', 34, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(37, 'Hospital Mentouri Bachir El Milia', 'public', '18', 'الميلية', 'Q75P+G59, الميلية', '[]', 2.90, 20, '24/7', '+213 795 37 22 59', NULL, '[]', '[]', '[]', 35, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(38, 'Hôpital privé NiSomed', 'private', '21', 'سكيكدة', 'VVFX+QW, سكيكدة', '[]', 3.90, 40, '24/7', '+213 550 45 45 95', NULL, '[]', '[]', '[]', 36, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(39, 'Psychiatric Hospital Aboubakr Er-Razi', 'public', '23', 'عنابة', 'VPXG+FQH, Rte Belaïd Belkacem, عنابة', '[]', 3.30, 15, '24/7', '+213 38 84 97 52', NULL, '[]', '[]', '[]', 37, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(40, 'mother & baby Hospital', 'public', '24', 'قالمة', 'FC2V+P46, قالمة', '[]', 4.20, 13, '24/7', '', NULL, '[]', '[]', '[]', 38, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(41, 'ibn Zohr Hospital', 'public', '24', 'قالمة', 'FC7H+9CC, قالمة', '[]', 3.80, 4, '24/7', '+213 37 14 10 54', NULL, '[]', '[]', '[]', 39, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(42, 'Centre de santé chinois/ المركز الصيني الصحي', 'public', '25', 'الخروب', '7H6Q+PF7, الخروب', '[]', 4.00, 4, '24/7', '+213 656 41 99 83', NULL, '[]', '[]', '[]', 40, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(43, 'Hospital Djaber Omor', 'public', '41', 'تاورة', '527X+Q56, تاورة', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 41, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(44, 'Préventorium', 'public', '23', 'سرايدي', 'WM5G+QMP, سرايدي', '[]', 3.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 42, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(45, 'المؤسسة الجهوية لاسناد الصحة العسكرية قسنطينة ERSSM', 'public', '25', 'الخروب', '6HWP+4C8, الخروب', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 43, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(46, 'Nouvelle Polyclinique', 'public', '16', 'الحراش', 'JRWG+VV8, Harrouch, الحراش', '[]', 3.00, 7, '24/7', '', NULL, '[]', '[]', '[]', 44, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(47, 'مستشفى الخروب', 'public', '25', 'الخروب', '7M5V+W4Q, الخروب', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 45, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(48, 'Hospital Center De Chirurgie Cardiaque', 'public', '25', 'قسنطينة', '9M43+942, قسنطينة', '[]', 3.30, 3, '24/7', '', NULL, '[]', '[]', '[]', 46, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(49, 'Hospital Bekkouche Lakhdar', 'public', '21', 'بكوش لخضر', 'M8X3+XG9, بكوش لخضر', '[]', 3.70, 3, '24/7', '', NULL, '[]', '[]', '[]', 47, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(50, 'HOSPICE pour personnes agées', 'public', '21', 'سكيكدة', 'VWM3+458، Rue Abdellah M''rah, سكيكدة', '[]', 5.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 48, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(51, 'قاعة العلاج المريج', 'public', '25', 'قسنطينة', '8PX3+JJR, قسنطينة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 49, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(52, 'Hospital Azzaba', 'public', '21', 'عزابة', 'P4R2+JX6, عزابة', '[]', 3.80, 6, '24/7', '', NULL, '[]', '[]', '[]', 50, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(53, 'medical clinic', 'public', '36', 'الذرعـان', 'MPJG+WC7, الذرعـان', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 51, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(54, 'Le Laboratoire d''analyses medicales Cité Frères Bouhadja', 'public', '21', 'سكيكدة', 'VW7G+8VG, سكيكدة', '[]', 4.50, 2, '24/7', '+213 38 70 54 80', NULL, '[]', '[]', '[]', 52, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(55, 'Hospital Of Cœur Benchiko', 'public', '25', 'قسنطينة', '9M43+72P, حي الرياض و حي المنى،, قسنطينة', '[]', 5.00, 5, '24/7', '', NULL, '[]', '[]', '[]', 53, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(56, 'Salle de soins Meniker Said', 'public', '25', 'زيغود يوسف', 'GPJ8+R6X, زيغود يوسف', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 54, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(57, 'The Former Hospital Du Khroub', 'public', '25', 'الخروب', 'Rue Maghlaoui Mabrouk, الخروب', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 55, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(58, 'Service de médecine physique et de réadaptation', 'public', '25', 'قسنطينة', '9JF8+H9V, قسنطينة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 56, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(59, 'epsp filali', 'private', '25', 'قسنطينة', '8JV2+HX5 Polyclinique Filali, قسنطينة', '[]', 3.80, 6, '24/7', '', NULL, '[]', '[]', '[]', 57, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(60, 'Hospital Razek Bouhara', 'public', '21', 'سكيكدة', 'VV6X+Q34, Boulevard Brahim Maiza, سكيكدة', '[]', 2.80, 4, '24/7', '+213 38 74 72 17', NULL, '[]', '[]', '[]', 58, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(61, 'Polyclinique Boumerzoug', 'public', '25', 'قسنطينة', '8JPP+7G3, قسنطينة', '[]', 4.20, 9, '24/7', '', NULL, '[]', '[]', '[]', 59, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(62, 'Hospital Pediatric And Gynecology', 'public', '24', 'قالمة', 'FC2R+QXC, قالمة', '[]', 3.30, 4, '24/7', '+213 37 11 89 09', NULL, '[]', '[]', '[]', 60, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(63, 'Centre de consultation spécialisé', 'public', '25', 'قسنطينة', '9J9J+89, قسنطينة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 61, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(64, 'مصحة الجلولية', 'public', '25', 'حامة بوزيان', 'CH77+HRG, N27, حامة بوزيان', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 62, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(65, 'La Boratoire D''analyse Midicales', 'public', '23', 'عنابة', 'WQ42+VJ4, Bd Ernesto Che Guevara, عنابة', '[]', 5.00, 2, '24/7', '+213 30 40 19 68', NULL, '[]', '[]', '[]', 63, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(66, 'Multi-service clinic Boumaiza', 'public', '21', 'بن عزوز', 'R85M+PQ9, بن عزوز', '[]', 2.30, 10, '24/7', '', NULL, '[]', '[]', '[]', 64, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(67, 'Settara Multi-Services Clinic', 'public', '18', 'السطارة', 'P88P+PWW, السطارة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 65, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(68, 'Hôpital Urgences Médico-Chirurgicales', 'public', '23', 'البوني', 'VP7Q+3RW, البوني', '[]', 4.50, 13, '24/7', '', NULL, '[]', '[]', '[]', 66, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(69, 'Hôpital Dorban "Pont blanc"', 'public', '23', 'عنابة', 'WP5J+P46, Rte Bichat Youcef, عنابة', '[]', 2.90, 31, '24/7', '+213 34 42 56 94', NULL, '[]', '[]', '[]', 67, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(70, 'Eph Bouzid Ammar El Kala', 'public', '36', 'القالة', 'VCWV+669, Rue d''evian, القالة', '[]', 3.70, 15, '24/7', '+213 38 66 24 00', NULL, '[]', '[]', '[]', 68, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(71, 'مستشفى ابو بكر الرازي للامراض العقلية', 'public', '23', 'عنابة', 'VPXG+73J, عنابة', '[]', 4.00, 4, '24/7', '+213 659 76 41 16', NULL, '[]', '[]', '[]', 69, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(72, 'Aguena clinic', 'public', '21', 'بني زيد', 'WGFG+PWX Village Aguena, بني زيد', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 70, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(73, 'Chems-Vet Clinic', 'public', '21', 'تمالوس', 'Cité balaska mouloud, تمالوس', '[]', 4.70, 3, '24/7', '+213 771 50 51 16', NULL, '[]', '[]', '[]', 71, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(74, 'Hospital Tindouf', 'public', '37', 'تندوف', 'مستشفىHôpital Tindouf, تندوف', '[]', 3.20, 32, '24/7', '+213 794 66 55 21', NULL, '[]', '[]', '[]', 72, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(75, 'Epsp Hassi Ammar Tindouf Lotfi', 'public', '37', 'تندوف', 'JVW8+QRJ, تندوف', '[]', 3.50, 22, '24/7', '', NULL, '[]', '[]', '[]', 73, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(76, 'مستشفى المريخ', 'public', '37', 'تندوف', 'MVF9+VXJ, تندوف', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 74, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(77, 'مستشفى محمد السادس', 'public', '37', 'تندوف', 'MVHH+QVJ, تندوف', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 75, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(78, 'Etablissement Public De Sante De Proximite', 'public', '37', 'تندوف', 'JVW8+RR5, Rue, تندوف', '[]', 4.00, 4, '24/7', '', NULL, '[]', '[]', '[]', 76, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(79, 'المستشفى الوطني (الجراحات)', 'public', '37', 'تندوف', 'FWM9+37J, تندوف', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 77, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(80, 'المصلحة الاستشفائية أم العسل', 'public', '37', 'أم العسل', 'J27C+JCP, أم العسل', '[]', 5.00, 3, '24/7', '', NULL, '[]', '[]', '[]', 78, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(81, 'Hospital Kadri Mohamed', 'public', '45', 'النعامة', '7MGV+8FC, النعامة', '[]', 5.00, 2, '24/7', '+213 49 59 36 39', NULL, '[]', '[]', '[]', 79, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(82, 'Hospital De Brezina', 'public', '32', 'بريزينة', '37X7+QJW, بريزينة', '[]', 2.50, 4, '24/7', '', NULL, '[]', '[]', '[]', 80, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(83, 'مستشفى عين صالح', 'public', '53', 'عين صالح', '5FWP+4W8, عين صالح', '[]', 3.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 81, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(84, 'مصلحة الأمومة والطفولة', 'public', '01', 'أدرار', 'VP9F+W2J, Unnamed Road, أدرار', '[]', 4.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 82, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(85, 'EPH Reggane', 'public', '28', 'المسيلة', '26°43''18.4"N 0°10''10., 5, المسيلة', '[]', 4.20, 20, '24/7', '+33 7 58 38 10 14', NULL, '[]', '[]', '[]', 83, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(86, 'مستشفى المختلط المساعد طاطي اغالي', 'public', '50', 'برج باجي مختار', '8XG8+HCP, برج باجي مختار', '[]', 5.00, 3, '24/7', '', NULL, '[]', '[]', '[]', 84, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(87, 'HOPITAL OF ZAOUIET KOUNTA', 'public', '01', 'زاوية كنتة', '6RQ2+JQX, N6, زاوية كنتة', '[]', 4.00, 4, '24/7', '', NULL, '[]', '[]', '[]', 85, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(88, 'Ex Hospital D''adrar', 'public', '01', 'أدرار', 'VPC9+65J, أدرار', '[]', 4.40, 8, '24/7', '', NULL, '[]', '[]', '[]', 86, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(89, 'المؤسسة العمومية للصحه الجورية ب ب م', 'public', '50', 'برج باجي مختار', 'Q36V+7P4, برج باجي مختار', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 87, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(90, 'Hospital ACCEPT', 'public', '01', 'اقبلي', 'P999+VXQ, اقبلي', '[]', 3.60, 7, '24/7', '', NULL, '[]', '[]', '[]', 88, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(91, 'Hospital D''aoulef', 'public', '01', 'أولف', 'X3FQ+873, Unnamed Road, أولف', '[]', 3.70, 14, '24/7', '+213 49 32 73 46', NULL, '[]', '[]', '[]', 89, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(92, 'مستشفى الإخوة شنافة', 'public', '45', 'المشرية', 'GPGC+G32, المشرية', '[]', 4.50, 11, '24/7', '', NULL, '[]', '[]', '[]', 90, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(93, 'E.h.p Goudjil Sante', 'public', '32', 'البيض', 'M28Q+7V6, البيض', '[]', 4.50, 8, '24/7', '+213 49 60 48 50', NULL, '[]', '[]', '[]', 91, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(94, 'EPH elbayadh', 'public', '32', 'البيض', 'M2F8+3MM, البيض', '[]', 3.50, 2, '24/7', '', NULL, '[]', '[]', '[]', 92, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(95, 'المستشفى الجديد 60 سرير بوعلام', 'public', '32', 'بوعلام', 'PGFC+PVX, بوعلام', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 93, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(96, 'مستشفي البلدية', 'public', '32', 'شلالة', '22JX+R5V, شلالة', '[]', 4.00, 4, '24/7', '', NULL, '[]', '[]', '[]', 94, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(97, 'Polyclinique Centrale LAZARI', 'public', '32', 'البيض', 'M2H8+V6G, البيض', '[]', 4.00, 3, '24/7', '+213 49 61 31 71', NULL, '[]', '[]', '[]', 95, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(98, 'مستوصف متعدد الخدمات لازاري', 'public', '32', 'البيض', 'M2H8+V5C, البيض', '[]', 3.70, 3, '24/7', '', NULL, '[]', '[]', '[]', 96, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(99, 'L''hôpital', 'public', '32', 'شلالة', '24F9+3GG, شلالة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 97, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(100, 'المستشفى', 'public', '03', 'الحاج مشري', 'XJ53+44G, الحاج مشري', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 98, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(101, 'المؤسسة العمومية للصحة الجوارية', 'public', '32', 'بريزينة', '37X7+QJ6, مستشفى à proximité de, بريزينة', '[]', 2.20, 5, '24/7', '+213 49 62 14 52', NULL, '[]', '[]', '[]', 99, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(102, 'EPSP GHASSOUL', 'public', '32', 'الغاسول', '96H4+64P, الغاسول', '[]', 4.00, 3, '24/7', '', NULL, '[]', '[]', '[]', 100, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(103, 'المؤسسة العمومية للصحة الجوارية الشهيد أقزوح سعيد', 'public', '32', 'البيض', 'M2FG+P2G, البيض', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 101, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(104, 'Eph AFLOU', 'public', '03', 'أفلو', '439V+2XC, Rue de Tiaret, أفلو', '[]', 3.30, 9, '24/7', '+213 29 16 64 65', NULL, '[]', '[]', '[]', 102, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(105, 'Hospital Cité Chenawa', 'public', '45', 'عين الصفراء', 'Q93R+8PV, حي, عين الصفراء', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 103, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(106, 'المستشفى', 'public', '03', 'وادي مرة', '587F+W53, وادي مرة', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 104, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(107, 'المستشفى', 'public', '03', 'أفلو', '438V+VQM, أفلو', '[]', 0.00, 0, '24/7', '', NULL, '[]', '[]', '[]', 105, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(108, 'مستشفى عين الصفراء الكبير', 'public', '45', 'عين الصفراء', 'QC54+GRF, عين الصفراء', '[]', 3.00, 2, '24/7', '', NULL, '[]', '[]', '[]', 106, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(109, 'مستشفى محمد بوضياف', 'public', '45', 'عين الصفراء', 'مستشفى محمد بوضياف, عين الصفراء', '[]', 3.60, 10, '24/7', '', NULL, '[]', '[]', '[]', 107, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39'),
(110, 'المؤسسة العمومية للصحة الجوارية Etablissement Public De Sante De Proximite', 'public', '45', 'عين الصفراء', 'QC48+GPC, عين الصفراء', '[]', 5.00, 1, '24/7', '', NULL, '[]', '[]', '[]', 108, 1, '2026-04-26 23:27:39', '2026-04-26 23:27:39');

--
-- Table structure for table `international_hospitals`
--

CREATE TABLE `international_hospitals` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `country` varchar(60) NOT NULL,
  `city` varchar(255) NOT NULL,
  `specialty` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `hours` varchar(120) NOT NULL DEFAULT '24/7',
  `phone` varchar(80) NOT NULL,
  `website` varchar(500) DEFAULT NULL,
  `payment_methods_json` longtext DEFAULT NULL,
  `insurance_providers_json` longtext DEFAULT NULL,
  `features_json` longtext DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `international_hospitals`
--

INSERT INTO `international_hospitals` (`id`, `name`, `country`, `city`, `specialty`, `description`, `rating`, `reviews_count`, `hours`, `phone`, `website`, `payment_methods_json`, `insurance_providers_json`, `features_json`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Anadolu Medical Center', 'turkey', 'Istanbul', 'oncology', 'مركز مرجعي لعلاج السرطان وزراعة النخاع', 4.90, 3200, '24/7', '+90 212 444 4 444', 'www.anadolumedicalcenter.com', '[\"cash\", \"card\", \"transfer\"]', '[\"Allianz\", \"Bupa\", \"AXA\"]', '[\"online_consult\", \"direct_booking\", \"translator\"]', 1, 1, '2026-04-12 00:42:06', '2026-04-12 00:42:06'),
(2, 'Clinique des Berges du Lac', 'tunisia', 'Tunis', 'fertility', 'تخصصات دقيقة في الخصوبة وجراحة القلب', 4.70, 890, '24/7', '+216 71 123 456', 'www.cbl.tn', '[\"cash\", \"card\"]', '[\"CNAM\", \"GAT\"]', '[\"direct_booking\"]', 2, 1, '2026-04-12 00:42:06', '2026-04-12 00:42:06');

-- --------------------------------------------------------

--
-- Table structure for table `news_articles`
--

CREATE TABLE `news_articles` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` mediumtext DEFAULT NULL,
  `tag` varchar(120) NOT NULL DEFAULT 'general',
  `source` varchar(120) NOT NULL DEFAULT 'local',
  `date` date NOT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_articles`
--

INSERT INTO `news_articles` (`id`, `title`, `description`, `content`, `tag`, `source`, `date`, `is_archived`, `created_at`, `updated_at`) VALUES
(1, 'نجاح كبير للحملة الوطنية للتلقيح', 'تم تلقيح أكثر من 443 ألف طفل ضد شلل الأطفال في اليوم الأول من انطلاق الحملة الوطنية.', 'تم تلقيح أكثر من 443 ألف طفل ضد شلل الأطفال في اليوم الأول من انطلاق الحملة الوطنية التي نظمتها وزارة الصحة عبر مختلف ولايات الوطن.', 'وطني', 'وزارة الصحة', '2025-11-30', 0, '2026-04-09 16:06:17', '2026-04-09 16:06:17'),
(2, 'اليوم العالمي لمكافحة السيدا', 'الجزائر تحيي اليوم العالمي لمكافحة السيدا مع التأكيد على مجانية العلاج والرعاية.', 'أحيت الجزائر اليوم العالمي لمكافحة السيدا تحت شعار يركز على الحقوق والوقاية والتكفل بالمصابين.', 'توعية', 'APS', '2025-12-01', 0, '2026-04-09 16:06:17', '2026-04-09 16:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `news_comments`
--

CREATE TABLE `news_comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `news_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_ratings`
--

CREATE TABLE `news_ratings` (
  `id` int(10) UNSIGNED NOT NULL,
  `news_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient_accommodations`
--

CREATE TABLE `patient_accommodations` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `phone` varchar(80) NOT NULL,
  `wilaya_id` varchar(10) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `is_free` tinyint(1) NOT NULL DEFAULT 0,
  `price_per_night` decimal(10,2) NOT NULL DEFAULT 0.00,
  `capacity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `wilaya` varchar(4) NOT NULL,
  `commune` varchar(8) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_night_duty` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `time_slot` time NOT NULL,
  `day_of_week` tinyint(3) UNSIGNED DEFAULT NULL,
  `days_of_week` varchar(50) DEFAULT NULL,
  `day_type` varchar(50) NOT NULL DEFAULT 'daily',
  `category` varchar(120) NOT NULL DEFAULT 'general',
  `description` text DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `video_duration_seconds` int(10) UNSIGNED DEFAULT NULL,
  `video_duration_label` varchar(32) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `title`, `time_slot`, `day_of_week`, `days_of_week`, `day_type`, `category`, `description`, `video_url`, `image_url`, `video_duration_seconds`, `video_duration_label`, `created_at`, `updated_at`) VALUES
(1, 'صباح الصحة', '08:00:00', 0, '0', 'weekly', 'general', 'برنامج يومي للتوعية الصحية.', NULL, NULL, NULL, NULL, '2026-04-09 16:06:17', '2026-04-11 20:18:37'),
(2, 'استشارات القلب', '10:00:00', 0, '0', 'weekly', 'cardiology', 'فقرة متخصصة في صحة القلب والشرايين.', NULL, NULL, NULL, NULL, '2026-04-09 16:06:17', '2026-04-11 20:18:37');

-- --------------------------------------------------------

--
-- Table structure for table `public_users`
--

CREATE TABLE `public_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(120) NOT NULL,
  `last_name` varchar(120) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(80) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `wilaya_id` varchar(10) NOT NULL,
  `commune` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'member',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(10) UNSIGNED NOT NULL,
  `icon_key` varchar(80) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `details` text DEFAULT NULL,
  `features_json` longtext DEFAULT NULL,
  `color_class` varchar(255) NOT NULL,
  `bg_class` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `icon_key`, `title`, `description`, `details`, `features_json`, `color_class`, `bg_class`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ambulance', 'النقل الصحي (الإسعاف)', 'خدمات الإسعاف العمومي والخاص المجهزة بأحدث التقنيات.', 'نوفر أسطولاً من سيارات الإسعاف المجهزة (ICU ambulances) لنقل الحالات الحرجة والعادية. خدمة متاحة 24/7 تغطي جميع الولايات، مع طاقم مسعفين محترف لضمان سلامة المريض أثناء النقل للمستشفيات أو العيادات.', '[\"إسعاف عمومي وخاص\", \"نقل بين الولايات\", \"تجهيزات إنعاش كاملة\", \"استجابة سريعة\"]', 'from-red-500 to-rose-600', 'bg-red-50', 1, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(2, 'phone-call', 'الو حكيم', 'خدمة الاستشارات والتوجيه الطبي الهاتفي الفوري.', 'خدمة الو حكيم تتيح لك التواصل المباشر مع أطباء عامين ومختصين للحصول على نصائح طبية، شرح الوصفات، أو التوجيه نحو التخصص المناسب لحالتك دون الحاجة للتنقل.', '[\"متاح 24/7\", \"أطباء معتمدون\", \"سرية المكالمات\", \"توجيه دقيق\"]', 'from-blue-500 to-cyan-600', 'bg-blue-50', 2, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(3, 'home', 'طبيب في بيتك', 'زيارة الطبيب للمريض في منزله للفحص والعلاج.', 'لا داعي لنقل المريض المتعب للمستشفى. نرسل إليك طبيباً مؤهلاً مع معدات الفحص اللازمة لتشخيص الحالة، وصف العلاج، وحتى إجراء بعض التدخلات الطبية البسيطة في راحة منزلك.', '[\"تغطية شاملة\", \"فحص سريري كامل\", \"توفير وقت وجهد\", \"متابعة فورية\"]', 'from-green-500 to-emerald-600', 'bg-green-50', 3, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(4, 'heart-handshake', 'رعاية ومرافقة', 'مرافقة ورعاية صحية شاملة للمرضى وكبار السن.', 'خدمة إنسانية توفر مساعدين وممرضين لرعاية كبار السن والمرضى المزمنين، سواء في المنزل أو أثناء المواعيد الطبية.', '[\"مرافقون مؤهلون\", \"رعاية يومية أو بالساعة\", \"دعم نفسي واجتماعي\", \"مساعدة في التنقل\"]', 'from-purple-500 to-violet-600', 'bg-purple-50', 4, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(5, 'stethoscope', 'استشارات طبية', 'حجز استشارة مع أفضل الأطباء المتخصصين.', 'نوفر لك شبكة واسعة من الأطباء الاستشاريين في جميع التخصصات ويمكنك حجز موعد حضوري أو استشارة عن بعد.', '[\"أطباء معتمدون\", \"حجز فوري\", \"تقارير طبية إلكترونية\"]', 'from-teal-500 to-emerald-600', 'bg-teal-50', 5, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(6, 'activity', 'متابعة صحية', 'برامج متابعة مستمرة للحالات المرضية المزمنة.', 'نقدم خطط رعاية صحية شخصية لمتابعة تطور الحالة الصحية للمرضى، مع تنبيهات بمواعيد الدواء والفحوصات الدورية.', '[\"ملف صحي رقمي\", \"تنبيهات ذكية\", \"تواصل مع الطبيب\"]', 'from-orange-500 to-amber-600', 'bg-orange-50', 6, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(7, 'users', 'مجموعات الدعم', 'مجموعات دعم نفسي واجتماعي للمرضى وعائلاتهم.', 'انضم لمجتمع داعم يشاركك نفس التحديات الصحية. جلسات حوارية وتبادل خبرات بإشراف مختصين نفسيين واجتماعيين.', '[\"جلسات جماعية\", \"سرية تامة\", \"دعم نفسي\"]', 'from-pink-500 to-rose-600', 'bg-pink-50', 7, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(8, 'heart', 'المساعدات الاجتماعية', 'دعم اجتماعي وصحي للأسر المحتاجة.', 'نعمل على توفير الدعم اللازم للأسر المعوزة لتغطية تكاليف العلاج والعمليات الجراحية، بالتعاون مع المحسنين والجمعيات الخيرية.', '[\"دراسة حالة سرية\", \"دعم مالي وعيني\", \"مرافقة اجتماعية\"]', 'from-indigo-500 to-blue-600', 'bg-indigo-50', 8, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(120) NOT NULL,
  `setting_value` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'hero_content', '{\"badge\":\"🏥 صحتك أولويتنا\",\"title_start\":\"مشافي\",\"title_end\":\"المنصة الصحية الشاملة\",\"description\":\"قناة صحية احترافية تقدم بث مباشر، استشارات طبية، خدمات اجتماعية، وباب التبرعات للمرضى المحتاجين على مدار الساعة. يمكنكم متابعة KGC MACHAFI TV على قائمة القنوات عبر القمر الاصطناعي.\",\"image_url\":\"https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3\"}', '2026-04-09 16:25:51', '2026-04-19 07:10:16'),
(2, 'services_content', '{\"section_title\":\"الخدمات والمساعدات الصحية\",\"section_subtitle\":\"خدمات صحية متكاملة تلبي احتياجاتك في المنزل والمستشفى، مع شبكة واسعة من المحترفين لخدمتك.\"}', '2026-04-09 16:25:51', '2026-04-19 07:10:16'),
(3, 'live_player', '{\"section_title\":\"البث المباشر والبرامج المسجلة\",\"section_subtitle\":\"شاهد البث المباشر أو تصفح مكتبة البرامج الصحية\",\"live_title\":\"برنامج الاستشارات الطبية المباشرة\",\"live_description\":\"استشارات طبية مباشرة مع نخبة من الأطباء المتخصصين\",\"preview_image_url\":\"https://images.unsplash.com/photo-1576671081741-c538eafccfff\",\"stream_url\":\"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4\"}', '2026-04-09 16:25:51', '2026-04-19 07:10:16'),
(4, 'consultations_content', '{\"section_title\":\"احجز استشارتك\",\"section_subtitle\":\"تواصل مع أطباء متخصصين عبر الفيديو\",\"sidebar_title\":\"احجز استشارتك\",\"contact_phone\":\"+213 2813-3022\"}', '2026-04-09 16:25:51', '2026-04-19 07:10:16'),
(5, 'footer_content', '{\"brand_name\":\"KGC MACHAFI\",\"slogan\":\"المنصة التلفزيوية الصحية الاحترافية\",\"description\":\"قناة صحية احترافية تقدم بث مباشر، استشارات طبية، خدمات اجتماعية، وباب التبرعات للمرضى المحتاجين على مدار الساعة.\",\"phone\":\"+213 2813-3022\",\"email\":\"info@kgc-machafi.online\",\"address\":\"1، شارع بشير عطار، سيدي امحمد، الجزائر\"}', '2026-04-09 16:25:51', '2026-04-19 07:10:16');

-- --------------------------------------------------------

--
-- Table structure for table `video_programs`
--

CREATE TABLE `video_programs` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `duration` varchar(120) NOT NULL,
  `specialty` varchar(120) NOT NULL DEFAULT 'general',
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `video_programs`
--

INSERT INTO `video_programs` (`id`, `title`, `duration`, `specialty`, `image_url`, `video_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'برنامج الصحة العامة', '45 دقيقة', 'general', 'https://images.unsplash.com/photo-1591206246224-04b4624adef4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(2, 'استشارات القلب والشرايين', '30 دقيقة', 'cardiology', 'https://images.unsplash.com/photo-1591206246224-04b4624adef4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 2, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(3, 'صحة الأطفال والرضع', '40 دقيقة', 'pediatrics', 'https://images.unsplash.com/photo-1591206246224-04b4624adef4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 3, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51'),
(4, 'التغذية الصحية', '35 دقيقة', 'nutrition', 'https://images.unsplash.com/photo-1591206246224-04b4624adef4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 4, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodation_reviews`
--
ALTER TABLE `accommodation_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_accommodation_reviews_target` (`accommodation_id`),
  ADD KEY `idx_accommodation_reviews_user` (`user_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `ambulances`
--
ALTER TABLE `ambulances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ambulances_wilaya` (`wilaya_id`),
  ADD KEY `idx_ambulances_active` (`is_active`);

--
-- Indexes for table `ambulance_reviews`
--
ALTER TABLE `ambulance_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ambulance_reviews_target` (`ambulance_id`),
  ADD KEY `idx_ambulance_reviews_user` (`user_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consultation_doctors`
--
ALTER TABLE `consultation_doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_consultation_doctors_specialty` (`specialty_id`);

--
-- Indexes for table `consultation_specialties`
--
ALTER TABLE `consultation_specialties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_i18n`
--
ALTER TABLE `content_i18n`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_entity_field_lang` (`entity_type`,`entity_id`,`field`,`lang`),
  ADD KEY `idx_entity_lang` (`entity_type`,`entity_id`,`lang`);

--
-- Indexes for table `hero_stats`
--
ALTER TABLE `hero_stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hospitals_wilaya` (`wilaya_id`),
  ADD KEY `idx_hospitals_type` (`type`),
  ADD KEY `idx_hospitals_active` (`is_active`);

--
-- Indexes for table `international_hospitals`
--
ALTER TABLE `international_hospitals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_international_hospitals_country` (`country`),
  ADD KEY `idx_international_hospitals_specialty` (`specialty`),
  ADD KEY `idx_international_hospitals_active` (`is_active`);

--
-- Indexes for table `news_articles`
--
ALTER TABLE `news_articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_comments`
--
ALTER TABLE `news_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_news_comments_news` (`news_id`),
  ADD KEY `idx_news_comments_user` (`user_id`);

--
-- Indexes for table `news_ratings`
--
ALTER TABLE `news_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_news_ratings_user` (`news_id`,`user_id`),
  ADD KEY `idx_news_ratings_news` (`news_id`),
  ADD KEY `idx_news_ratings_user` (`user_id`);

--
-- Indexes for table `patient_accommodations`
--
ALTER TABLE `patient_accommodations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_accommodation_wilaya` (`wilaya_id`),
  ADD KEY `idx_accommodation_active` (`is_active`);

--
-- Indexes for table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `public_users`
--
ALTER TABLE `public_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_public_users_wilaya` (`wilaya_id`),
  ADD KEY `idx_public_users_active` (`is_active`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `video_programs`
--
ALTER TABLE `video_programs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodation_reviews`
--
ALTER TABLE `accommodation_reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ambulances`
--
ALTER TABLE `ambulances`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ambulance_reviews`
--
ALTER TABLE `ambulance_reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `consultation_doctors`
--
ALTER TABLE `consultation_doctors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `consultation_specialties`
--
ALTER TABLE `consultation_specialties`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `content_i18n`
--
ALTER TABLE `content_i18n`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_stats`
--
ALTER TABLE `hero_stats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `international_hospitals`
--
ALTER TABLE `international_hospitals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `news_articles`
--
ALTER TABLE `news_articles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `news_comments`
--
ALTER TABLE `news_comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_ratings`
--
ALTER TABLE `news_ratings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient_accommodations`
--
ALTER TABLE `patient_accommodations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `public_users`
--
ALTER TABLE `public_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `video_programs`
--
ALTER TABLE `video_programs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `consultation_doctors`
--
ALTER TABLE `consultation_doctors`
  ADD CONSTRAINT `fk_consultation_doctors_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `consultation_specialties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
