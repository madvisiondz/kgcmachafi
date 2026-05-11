/**
 * Restores kgcmachafi_madvision.sql after a bad merge: fixes consultation_doctors
 * tail and re-inserts CREATE + INSERT for `hospitals` before international_hospitals.
 * Does NOT modify CREATE TABLE `hospitals` definition (must match dump lines 246–265).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, '..');
const madPath = join(projectRoot, 'kgcmachafi_madvision.sql');
const insPath = join(projectRoot, 'hospitals_insert.sql');

const mad = readFileSync(madPath, 'utf8');
const marker = '\n--\n-- Table structure for table `international_hospitals`\n--\n';
const idx = mad.indexOf(marker);
if (idx === -1) throw new Error('international_hospitals marker not found');

const before = mad.slice(0, idx);
const after = mad.slice(idx);

const badStart = before.indexOf("(3, 'Hospital of Timimoun'");
if (badStart === -1) throw new Error('corrupt hospital-in-doctors block not found');

const goodHead = before.slice(0, badStart);

const doctor3 =
  "(3, 2, 'د. يوسف بومدين', 'مستشفى مصطفى باشا', 11, 4.6, 40.00, 'EUR', 3, 1, '2026-04-09 16:25:51', '2026-04-09 16:25:51');\n";

const hospitalsCreate = `-- --------------------------------------------------------

--
-- Table structure for table \`hospitals\`
--

CREATE TABLE \`hospitals\` (
  \`id\` int(10) UNSIGNED NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`type\` varchar(40) NOT NULL DEFAULT 'public',
  \`wilaya_id\` varchar(10) NOT NULL,
  \`city\` varchar(255) DEFAULT NULL,
  \`address\` varchar(500) NOT NULL,
  \`specialties_json\` longtext DEFAULT NULL,
  \`rating\` decimal(3,2) NOT NULL DEFAULT 0.00,
  \`reviews_count\` int(10) UNSIGNED NOT NULL DEFAULT 0,
  \`hours\` varchar(120) NOT NULL DEFAULT '24/7',
  \`phone\` varchar(80) NOT NULL,
  \`website\` varchar(500) DEFAULT NULL,
  \`payment_methods_json\` longtext DEFAULT NULL,
  \`insurance_providers_json\` longtext DEFAULT NULL,
  \`features_json\` longtext DEFAULT NULL,
  \`sort_order\` int(11) NOT NULL DEFAULT 0,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table \`hospitals\`
--

INSERT INTO \`hospitals\` (\`id\`, \`name\`, \`type\`, \`wilaya_id\`, \`city\`, \`address\`, \`specialties_json\`, \`rating\`, \`reviews_count\`, \`hours\`, \`phone\`, \`website\`, \`payment_methods_json\`, \`insurance_providers_json\`, \`features_json\`, \`sort_order\`, \`is_active\`, \`created_at\`, \`updated_at\`) VALUES
(1, 'المستشفى الجامعي مصطفى باشا', 'public', '16', 'سيدي امحمد', 'ساحة أول ماي، الجزائر الوسطى', '[]', 4.20, 1240, '24/7', '021 23 55 11', 'www.chu-mustapha.dz', '[]', '[]', '[]', 1, 1, '2026-04-12 00:30:48', '2026-04-12 00:42:06'),
(2, 'عيادة الشفاء الخاصة', 'private', '31', 'الصديقية', 'حي الصديقية، وهران', '[]', 4.80, 312, '08:00 - 20:00', '041 33 22 11', 'www.clinique-chifa.dz', '[]', '[]', '[]', 2, 1, '2026-04-12 00:30:48', '2026-04-12 00:42:06'),
`;

const insLines = readFileSync(insPath, 'utf8').split(/\r?\n/);
const scraped = insLines.filter((l) => /^\(\d+,/.test(l)).join('\n');

const rebuilt = `${goodHead}${doctor3}\n${hospitalsCreate}${scraped}\n${after}`;
writeFileSync(madPath, rebuilt, 'utf8');
console.log('repaired', madPath);
