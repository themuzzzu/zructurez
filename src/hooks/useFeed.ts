
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserPost } from '@/types/post';

export const useFeed = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    try {
      setLoading(true);
      // Mock data for development
      const mockPosts: UserPost[] = [
        {
          id: '1',
          user_id: '123',
          profile_id: '123',
          content: 'This is a post about my new business!',
          image_url: 'https://source.unsplash.com/random/800x600/?business',
          created_at: new Date().toISOString(),
          likes_count: 15,
          comments_count: 3,
          reposts_count: 1,
          profile: {
            username: 'businessperson',
            avatar_url: 'https://source.unsplash.com/random/100x100/?person',
            name: 'Jane Business'
          }
        },
        {
          id: '2',
          user_id: '456',
          profile_id: '456',
          content: 'Check out our latest products!',
          image_url: 'https://source.unsplash.com/random/800x600/?product',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          likes_count: 42,
          comments_count: 7,
          reposts_count: 5,
          profile: {
            username: 'shopowner',
            avatar_url: 'https://source.unsplash.com/random/100x100/?shop',
            name: 'Shop Owner'
          }
        },
        {
          id: '3',
          user_id: '789',
          profile_id: '789',
          content: 'Looking for recommendations for good service providers in the area!',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          likes_count: 8,
          comments_count: 15,
          reposts_count: 0,
          profile: {
            username: 'localresident',
            avatar_url: 'https://source.unsplash.com/random/100x100/?resident',
            name: 'Local Resident'
          }
        },
        {
          id: '4',
          user_id: '101',
          profile_id: '101',
          content: 'Just launched our service website! Check it out at example.com',
          image_url: 'https://source.unsplash.com/random/800x600/?website',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          likes_count: 31,
          comments_count: 4,
          reposts_count: 12,
          profile: {
            username: 'techservice',
            avatar_url: 'https://source.unsplash.com/random/100x100/?tech',
            name: 'Tech Service'
          }
        }
      ];

      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          content,
          image_url,
          created_at,
          profile_id,
          location,
          category,
          business_id,
          views,
          profiles:profile_id (username, avatar_url, name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Format posts with profile information
      const formattedPosts: UserPost[] = data.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
        profile_id: post.profile_id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        category: post.category,
        location: post.location,
        business_id: post.business_id,
        views: post.views || 0,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        reposts_count: post.reposts_count || 0,
        profile: post.profiles
      }));

      // Fall back to mock data if no real data is available
      setPosts(formattedPosts.length > 0 ? formattedPosts : mockPosts);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed');
      // Fall back to mock data on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return { posts, loading, error, refreshFeed: fetchFeed };
};
