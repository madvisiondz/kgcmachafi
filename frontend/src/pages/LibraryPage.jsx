import React, { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { libraryBooksMock } from '../data/libraryBooks';

function IconBookOpen({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconDownload({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconBook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconEye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconSearch({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconX({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function normalizeForSearch(s) {
  return s.trim().toLocaleLowerCase();
}

export default function LibraryPage() {
  const { t, dir } = useI18n();
  const [selectedBook, setSelectedBook] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    const q = normalizeForSearch(searchQuery);
    if (!q) return libraryBooksMock;
    return libraryBooksMock.filter((book) => {
      const title = t(`library.books.${book.bookKey}.title`);
      const author = t(`library.books.${book.bookKey}.author`);
      const category = t(`library.categories.${book.categoryKey}`);
      const haystack = normalizeForSearch(`${title} ${author} ${category}`);
      return haystack.includes(q);
    });
  }, [searchQuery, t]);

  const showNoFile = () => {
    setFeedback({ tone: 'error', title: t('library.noFileTitle'), desc: t('library.noFileDesc') });
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const handleDownload = (book) => {
    setFeedback({ tone: 'info', title: t('library.startDownload'), desc: t(`library.books.${book.bookKey}.title`) });
    window.setTimeout(() => setFeedback(null), 3000);

    if (book.filePath && book.filePath !== '#') {
      const a = document.createElement('a');
      a.href = book.filePath;
      a.download = `${t(`library.books.${book.bookKey}.title`)}.pdf`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    window.setTimeout(showNoFile, 350);
  };

  const handleReadBook = (book) => {
    if (!book.filePath || book.filePath === '#') {
      showNoFile();
      return;
    }
    setSelectedBook(book);
  };

  const closeModal = () => setSelectedBook(null);

  return (
    <div className="space-y-12">
      <section id="library" className="py-16 bg-slate-50" dir={dir}>
        <div className="container mx-auto px-4">
          {feedback && (
            <div
              role="status"
              className={`mb-8 rounded-xl border px-4 py-3 text-sm ${
                feedback.tone === 'error'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-blue-200 bg-blue-50 text-blue-900'
              }`}
            >
              <p className="font-bold">{feedback.title}</p>
              <p className="opacity-90">{feedback.desc}</p>
            </div>
          )}

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <IconBookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{t('library.title')}</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t('library.subtitle')}</p>
          </div>

          <div className="max-w-xl mx-auto mb-10">
            <label htmlFor="library-search" className="sr-only">
              {t('library.searchAriaLabel')}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch className="w-5 h-5" />
              </span>
              <input
                id="library-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('library.searchPlaceholder')}
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 ps-11 pe-11 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              />
              {searchQuery.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title={t('library.clearSearch')}
                  aria-label={t('library.clearSearch')}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  <IconX className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>

          {libraryBooksMock.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed text-gray-500">{t('library.empty')}</div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed text-gray-500">{t('library.noSearchResults')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => {
                const title = t(`library.books.${book.bookKey}.title`);
                const author = t(`library.books.${book.bookKey}.author`);
                const categoryLabel = t(`library.categories.${book.categoryKey}`);

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative group">
                      <img
                        src={book.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        draggable="false"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-xs text-blue-600 font-semibold">{categoryLabel}</div>
                        <span
                          className={`text-[11px] px-2 py-1 rounded-full ${
                            book.bookType === 'ebook' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {book.bookType === 'ebook' ? t('library.typeEbook') : t('library.typePhysical')}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
                      <p className="text-sm text-gray-500 mb-4">{author}</p>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <IconBook className="w-3 h-3" />
                          {book.pages}
                        </span>
                        {book.bookType === 'ebook' ? (
                          <button
                            type="button"
                            onClick={() => handleReadBook(book)}
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <IconEye className="w-4 h-4" />
                            {t('library.read')}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownload(book)}
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <IconDownload className="w-4 h-4" />
                            {t('library.download')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="library-dialog-title"
          onClick={closeModal}
          onKeyDown={(e) => e.key === 'Escape' && closeModal()}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2 border-b border-gray-100">
              <div>
                <h2 id="library-dialog-title" className="text-lg font-bold text-gray-900">
                  {t(`library.books.${selectedBook.bookKey}.title`)}
                </h2>
                <p className="text-sm text-gray-500">{t(`library.books.${selectedBook.bookKey}.author`)}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t('library.close')}
              </button>
            </div>
            <div className="flex-1 min-h-[60vh] px-6 pb-6 pt-4">
              <iframe
                title={t(`library.books.${selectedBook.bookKey}.title`)}
                src={selectedBook.filePath}
                className="w-full h-[70vh] rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
