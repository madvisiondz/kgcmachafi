import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare, Send, Loader2, UserCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { contentApi } from '@/lib/localApi';

const NewsComments = ({ newsId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const response = await contentApi.listNewsComments(newsId);
      setComments(response.items || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!user) {
      toast({
        title: "تنبيه",
        description: "يجب عليك تسجيل الدخول لإضافة تعليق",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await contentApi.createNewsComment({
          news_id: newsId,
          content: newComment.trim()
        });

      setNewComment('');
      await fetchComments();
      toast({
        title: "تم النشر",
        description: "تمت إضافة تعليقك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة التعليق",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await contentApi.deleteNewsComment(commentId);
      setDeleteConfirmId(null);
      await fetchComments();
      toast({
        title: "تم الحذف",
        description: "تم حذف التعليق بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        التعليقات ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "أكتب تعليقاً..." : "سجل الدخول لكتابة تعليق"}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] mb-3 bg-white"
          disabled={!user || isSubmitting}
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!user || isSubmitting || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            نشر التعليق
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900">
                      {comment.user?.full_name || 'مستخدم مجهول'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ar })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {comment.content}
                  </p>
                  
                  {user && user.id === comment.user_id && (
                    <div className="mt-2 flex justify-end gap-2">
                      {deleteConfirmId === comment.id ? (
                        <>
                          <button 
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 text-xs font-medium hover:text-red-700 px-2 py-1 bg-red-50 rounded"
                          >
                            تأكيد الحذف
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-gray-600 text-xs font-medium hover:text-gray-700 px-2 py-1 bg-gray-100 rounded"
                          >
                            إلغاء
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(comment.id)}
                          className="text-red-500 text-xs hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          حذف
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
        </div>
      )}
    </div>
  );
};

export default NewsComments;