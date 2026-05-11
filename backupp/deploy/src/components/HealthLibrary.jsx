import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Book, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { contentApi } from '@/lib/localApi';

const fallbackImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794';

const HealthLibrary = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const { items } = await contentApi.listBooks();
        setBooks(items || []);
      } catch (error) {
        console.error('Failed to load books', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleDownload = (book) => {
    toast({
      title: t('library.startDownload'),
      description: book.title,
    });

    if (book.file_path && book.file_path !== '#') {
      const link = document.createElement('a');
      link.href = book.file_path;
      link.download = `${book.title}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    setTimeout(() => {
      toast({
        title: 'لا يوجد ملف مرتبط حالياً',
        description: 'أضف رابط الملف من لوحة التحكم ليصبح التحميل متاحاً.',
        variant: 'destructive',
      });
    }, 300);
  };

  const handleReadBook = (book) => {
    if (!book.file_path || book.file_path === '#') {
      toast({
        title: 'لا يوجد ملف مرتبط حالياً',
        description: 'أضف ملف PDF من لوحة التحكم ليصبح العرض متاحاً.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedBook(book);
  };

  return (
    <section id="library" className="py-16 bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t('library.title')}
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('library.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[380px] rounded-xl bg-white animate-pulse border" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed text-gray-500">
            لا توجد كتب محفوظة حالياً في المكتبة المحلية.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img
                    src={book.image_url || fallbackImage}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="text-xs text-blue-600 font-semibold">{book.category}</div>
                    <span className={`text-[11px] px-2 py-1 rounded-full ${book.book_type === 'ebook' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {book.book_type === 'ebook' ? 'كتاب إلكتروني' : 'كتاب عادي'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{book.author}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Book className="w-3 h-3" />
                      {book.pages || 0}
                    </span>
                    {book.book_type === 'ebook' ? (
                      <Button
                        size="sm"
                        onClick={() => handleReadBook(book)}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Eye className="w-4 h-4" />
                        قراءة
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(book)}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        {t('library.download')}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={Boolean(selectedBook)} onOpenChange={(open) => { if (!open) setSelectedBook(null); }}>
          <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden">
            {selectedBook && (
              <>
                <DialogHeader className="px-6 pt-6 pb-0">
                  <DialogTitle>{selectedBook.title}</DialogTitle>
                </DialogHeader>
                <div className="px-6 text-sm text-gray-500">{selectedBook.author}</div>
                <div className="flex-1 h-full px-6 pb-6">
                  <iframe
                    title={selectedBook.title}
                    src={selectedBook.file_path}
                    className="w-full h-full rounded-lg border"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HealthLibrary;
