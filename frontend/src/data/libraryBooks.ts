/**
 * UI-only mock catalog for Library page (no API).
 * Copy matches legacy HealthLibrary card fields; titles/authors come from i18n `library.books.*`.
 */

export type LibraryBookRecord = {
  id: string;
  /** Key under `library.books` in translations */
  bookKey: 'b1' | 'b2' | 'b3' | 'b4';
  /** Key under `library.categories` */
  categoryKey: 'nutrition' | 'psychology' | 'general' | 'kids';
  bookType: 'ebook' | 'physical';
  pages: number;
  imageUrl: string;
  /** Use '#' for “no file” (shows i18n notice). Sample PDF for one ebook for preview UX. */
  filePath: string;
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80';

export const libraryBooksMock: LibraryBookRecord[] = [
  {
    id: '1',
    bookKey: 'b1',
    categoryKey: 'nutrition',
    bookType: 'ebook',
    pages: 142,
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    filePath: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: '2',
    bookKey: 'b2',
    categoryKey: 'psychology',
    bookType: 'ebook',
    pages: 96,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    filePath: '#',
  },
  {
    id: '3',
    bookKey: 'b3',
    categoryKey: 'general',
    bookType: 'physical',
    pages: 210,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    filePath: '#',
  },
  {
    id: '4',
    bookKey: 'b4',
    categoryKey: 'kids',
    bookType: 'physical',
    pages: 88,
    imageUrl: FALLBACK_IMG,
    filePath: '#',
  },
];
