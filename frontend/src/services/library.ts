import type { LibraryBookRecord } from '../data/libraryBooks'
import { libraryBooksMock } from '../data/libraryBooks'
import { apiUrl, getJson } from './http'
import { extractListItems } from './envelope'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'

function mapCategoryKey(raw: string): LibraryBookRecord['categoryKey'] {
  const s = raw.trim().toLowerCase()
  if (s === 'nutrition' || s === 'psychology' || s === 'kids') return s as LibraryBookRecord['categoryKey']
  if (s === 'urgence' || s === 'emergency') return 'general'
  return 'general'
}

function mapBookType(raw: string): 'ebook' | 'physical' {
  const s = raw.trim().toLowerCase()
  return s === 'ebook' ? 'ebook' : 'physical'
}

export function mapPhpBookRow(row: Record<string, unknown>): LibraryBookRecord {
  const id = String(row.id ?? '')
  const title = String(row.title ?? '').trim()
  const author = String(row.author ?? '').trim()
  const category = String(row.category ?? '').trim()
  const filePath = String(row.file_path ?? '#').trim() || '#'
  const imageUrl = String(row.image_url ?? '').trim() || FALLBACK_IMG
  const pages = Math.max(0, Number(row.pages ?? 0) || 0)
  const bookType = mapBookType(String(row.book_type ?? 'standard'))

  return {
    id,
    bookKey: 'b1',
    categoryKey: mapCategoryKey(category),
    bookType,
    pages: pages || 1,
    imageUrl,
    filePath,
    apiTitle: title,
    apiAuthor: author,
    apiCategory: category,
  }
}

export async function loadLibraryBooksForList(): Promise<LibraryBookRecord[]> {
  if (import.meta.env.VITE_LIBRARY_API !== 'true') {
    return libraryBooksMock
  }
  const raw = await getJson<unknown>(apiUrl('/public/books.php'))
  const rows = extractListItems(raw)
  if (rows.length === 0) return libraryBooksMock
  return rows.map((r) => mapPhpBookRow(r))
}
