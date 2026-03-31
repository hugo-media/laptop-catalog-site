import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface WishlistButtonProps {
  productType: string;
  productId: number;
  className?: string;
}

export function WishlistButton({ productType, productId, className }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate or get session ID from localStorage
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', id);
    }
    setSessionId(id);
  }, []);

  const { data: wishlist } = trpc.ratings.getWishlist.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const addToWishlistMutation = trpc.ratings.addToWishlist.useMutation();
  const removeFromWishlistMutation = trpc.ratings.removeFromWishlist.useMutation();

  useEffect(() => {
    if (wishlist) {
      const exists = wishlist.some(
        (item) => item.productType === productType && item.productId === productId
      );
      setIsInWishlist(exists);
    }
  }, [wishlist, productType, productId]);

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate({
        productType,
        productId,
        sessionId,
      });
    } else {
      addToWishlistMutation.mutate({
        productType,
        productId,
        sessionId,
      });
    }
    setIsInWishlist(!isInWishlist);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleWishlist}
      className={className}
      title={isInWishlist ? 'Видалити з обраних' : 'Додати в обрані'}
    >
      <Heart
        size={20}
        className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
    </Button>
  );
}
