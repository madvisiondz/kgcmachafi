import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { contentApi } from '@/lib/localApi';

const ReviewList = ({ targetId, type }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (targetId) {
      fetchReviews();
    }
  }, [targetId]);

  const fetchReviews = async () => {
    try {
      const response = await contentApi.listReviews({ type, targetId });
      setReviews(response.items || []);
    } catch (error) {
      setReviews([]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "تنبيه", description: "يجب تسجيل الدخول للتقييم", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "تنبيه", description: "يرجى اختيار عدد النجوم", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await contentApi.createReview({
        type,
        target_id: targetId,
        rating,
        comment
      }).then(() => ({ error: null })).catch((apiError) => ({ error: apiError }));

    if (error) {
      toast({ title: "خطأ", description: "فشل إضافة التقييم", variant: "destructive" });
    } else {
      toast({ title: "شكراً", description: "تم إضافة تقييمك بنجاح" });
      setComment('');
      setRating(0);
      fetchReviews();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 mt-4 border-t pt-4">
      <h4 className="font-bold text-lg flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        التقييمات والآراء ({reviews.length})
      </h4>

      {/* Review Form */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="text-sm font-medium mb-2">أضف تقييمك</p>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="mr-2 text-sm text-gray-500">
            {rating > 0 ? `${rating}/5` : 'اضغط للتقييم'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            className="min-h-[60px] bg-white"
          />
          <Button onClick={handleSubmit} disabled={loading} className="h-auto px-4 bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">لا توجد تقييمات بعد. كن أول من يقيم!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-3 rounded border shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{review.user?.full_name || 'مستخدم'}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              )}
              <span className="text-xs text-gray-400 mt-2 block">
                {new Date(review.created_at).toLocaleDateString('ar-EG')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;