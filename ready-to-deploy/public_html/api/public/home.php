<?php
declare(strict_types=1);

require dirname(__DIR__) . '/admin/bootstrap.php';

allow_methods(['GET']);

$lang = trim((string) ($_GET['lang'] ?? 'ar'));
if (!in_array($lang, ['ar', 'fr', 'en'], true)) {
    $lang = 'ar';
}

$heroStats = db()->query('SELECT * FROM hero_stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC')->fetchAll();
$sections = db()->query('SELECT * FROM homepage_sections WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();

$newsStmt = db()->prepare(
    'SELECT id, title, description, date, slug FROM news_articles WHERE is_archived = 0 ORDER BY date DESC, created_at DESC LIMIT :lim'
);
$newsStmt->bindValue(':lim', 6, PDO::PARAM_INT);
$newsStmt->execute();
$latestNews = $newsStmt->fetchAll();

if ($lang !== 'ar') {
    $heroMap = i18n_get_map('hero_stats', array_map(static fn ($r) => (int) $r['id'], $heroStats), $lang);
    foreach ($heroStats as &$row) {
        $id = (string) ((int) ($row['id'] ?? 0));
        if (isset($heroMap[$id]['label']) && $heroMap[$id]['label'] !== '') {
            $row['label'] = $heroMap[$id]['label'];
        }
    }
    unset($row);
}

api_envelope_ok([
    'hero_stats' => $heroStats,
    'homepage_sections' => $sections,
    'latest_news' => $latestNews,
    'lang' => $lang,
]);
