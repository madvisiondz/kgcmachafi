import { contentApi } from '@/lib/localApi';

export const NEWS_AGENCIES = [
  { id: 'aps', name: 'APS (الجزائر)', color: 'bg-green-600', icon: '🇩🇿' },
  { id: 'spa', name: 'SPA (السعودية)', color: 'bg-emerald-600', icon: '🇸🇦' },
  { id: 'reuters', name: 'Reuters (عالمي)', color: 'bg-orange-500', icon: '🌍' },
  { id: 'afp', name: 'AFP (فرنسا)', color: 'bg-blue-700', icon: '🇫🇷' },
  { id: 'Al Jazeera', name: 'الجزيرة', color: 'bg-orange-600', icon: '🇶🇦' },
  { id: 'Al Arabiya', name: 'العربية', color: 'bg-purple-600', icon: '🇦🇪' },
  { id: 'BBC', name: 'BBC', color: 'bg-red-700', icon: '🇬🇧' },
  { id: 'AP News', name: 'AP News', color: 'bg-yellow-500', icon: '🇺🇸' },
  { id: 'DPA', name: 'DPA (ألمانيا)', color: 'bg-black', icon: '🇩🇪' },
];

// Helper to map database fields to the format components expect
const transformNewsItem = (item) => ({
  ...item,
  desc: item.description, // Frontend expects 'desc', DB has 'description'
});

// Fetch current active news
export const fetchNewsFromAgency = async (agencyId) => {
  try {
    const { items } = await contentApi.listNews();
    return items
      .filter((item) => String(item.source).toLowerCase() === String(agencyId).toLowerCase())
      .map(transformNewsItem);
  } catch (error) {
    console.error('Error fetching news from agency:', error);
    return [];
  }
};

// Fetch all active news
export const fetchAllNews = async () => {
  try {
    const { items } = await contentApi.listNews();
    return items.map(transformNewsItem);
  } catch (error) {
    console.error('Error fetching all news:', error);
    return [];
  }
};

// Fetch Archived News
export const fetchArchivedNews = async () => {
  try {
    const { items } = await contentApi.listNews({ archived: true });
    return items.map(transformNewsItem);
  } catch (error) {
    console.error('Error fetching archived news:', error);
    return [];
  }
};

export const fetchNewsById = async (id) => {
  try {
    const { item } = await contentApi.getNewsItem(id);
    return transformNewsItem(item);
  } catch (error) {
    throw new Error('News item not found');
  }
};

// Trigger Archiving (Simulated cron)
export const triggerArchiving = async () => {
  return { success: false, error: new Error('Auto archive is not configured in the local SQL version yet.') };
};

// Simulated Fetch for "New" News (For demonstration)
export const simulateFetchRecentNews = async () => {
  return { data: [], error: null };
};
