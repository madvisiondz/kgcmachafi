import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { contentApi } from '@/lib/localApi';

const NewsRating = ({ newsId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [newsId, user]);

  const fetchRatings = async () => {
    try {
      const response = await contentApi.getNewsRatings(newsId);
      setAverage(Number(response.average || 0));
      setCount(Number(response.count || 0));
      setUserRating(Number(response.user_rating || 0));
      setRating(Number(response.user_rating || 0));
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setAverage(0);
      setCount(0);
      setUserRating(0);
      setRating(0);
    }
  };

  const handleRate = async (value) => {
    if (!user) {
      toast({
        title: "تنبيه",
        description: "يرجى تسجيل الدخول لتقييم الخبر",
        variant: "destructive"
      });
      return;
    }

    setRating(value);
    setIsSubmitting(true);

    try {
      await contentApi.rateNews({
          news_id: newsId,
          rating: value
        });

      setUserRating(value);
      toast({
        title: "شكراً لك",
        description: "تم تسجيل تقييمك بنجاح",
      });
      await fetchRatings();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التقييم",
        variant: "destructive"
      });
      // Revert on error
      setRating(userRating);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 text-center">
      <h3 className="text-lg font-bold text-slate-800 mb-4">تقييم الخبر</h3>
      
      <div className="flex justify-center items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            disabled={isSubmitting}
            className={`transition-all duration-200 hover:scale-110 focus:outline-none ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            <Star 
              className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} 
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 flex flex-col gap-1">
        <span className="font-medium text-slate-700 text-lg">
          {average.toFixed(1)} <span className="text-gray-400 text-sm">/ 5</span>
        </span>
        <span>({count} صوت)</span>
      </div>
    </div>
  );
};

export default NewsRating;