import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface ProductRatingsProps {
  productType: string;
  productId: number;
}

export function ProductRatings({ productType, productId }: ProductRatingsProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: ratings } = trpc.ratings.getProductRatings.useQuery({
    productType,
    productId,
  });

  const { data: stats } = trpc.ratings.getRatingStats.useQuery({
    productType,
    productId,
  });

  const addRatingMutation = trpc.ratings.addRating.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setRating(0);
      setReview('');
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const handleSubmitRating = () => {
    if (rating === 0) return;
    addRatingMutation.mutate({
      productType,
      productId,
      rating,
      review: review || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Stats */}
      {stats && stats.totalRatings > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-3xl font-bold">{stats.averageRating}</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 ml-2">({stats.totalRatings} відгуків)</div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm w-12">{stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full"
                    style={{
                      width: `${stats.totalRatings > 0 ? (stats.distribution[stars as keyof typeof stats.distribution] / stats.totalRatings) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.distribution[stars as keyof typeof stats.distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Rating Form */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Залишити відгук</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Оцінка</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Коментар (опціонально)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Поділіться своїм досвідом..."
            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmitRating}
          disabled={rating === 0 || addRatingMutation.isPending}
          className="w-full"
        >
          {addRatingMutation.isPending ? 'Надсилання...' : 'Надіслати відгук'}
        </Button>

        {submitted && (
          <div className="mt-2 p-2 bg-green-50 text-green-700 rounded text-sm text-center">
            Дякуємо за ваш відгук!
          </div>
        )}
      </div>

      {/* Reviews List */}
      {ratings && ratings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Відгуки</h3>
          {ratings.slice(0, 3).map((review) => (
            <div key={review.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                </span>
              </div>
              {review.review && <p className="text-sm text-gray-700">{review.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
