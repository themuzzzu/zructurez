import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarIcon } from 'lucide-react';

interface BusinessReviewsSectionProps {
  businessId: string;
}

export const BusinessReviewsSection = ({ businessId }: BusinessReviewsSectionProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('business_comments')
        .select(`
          *,
          profiles(id, username, avatar_url, name)
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchReviews();
    fetchUser();
  }, [businessId]);

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please log in to leave a review');
      return;
    }

    if (!newReview.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      // Get user's profile ID
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const profileId = profileData?.id;

      if (!profileId) {
        throw new Error('Profile not found');
      }

      // Submit review
      const { data, error } = await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          profile_id: profileId,
          content: newReview,
          rating
        });

      if (error) throw error;

      // Fetch the newly added review with profile info
      const { data: newReviewData, error: fetchError } = await supabase
        .from('business_comments')
        .select(`
          *,
          profiles(id, username, avatar_url, name)
        `)
        .eq('id', data?.[0]?.id)
        .single();

      if (fetchError) throw fetchError;

      setReviews([newReviewData, ...reviews]);
      setNewReview('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Reviews & Ratings</h3>

        {user && (
          <div className="mb-6 space-y-4 border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">Your Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Write your review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitReview} disabled={submitting || !newReview.trim()}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        )}

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews && reviews.map((review, index) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.profiles?.avatar_url} />
                    <AvatarFallback>
                      {review.profiles?.name?.charAt(0) || review.profiles?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {review.profiles?.name || review.profiles?.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.rating && (
                      <div className="flex text-yellow-400 mt-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                      </div>
                    )}
                    <p className="mt-2 text-sm">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-muted-foreground">
            No reviews yet. Be the first to leave a review!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
