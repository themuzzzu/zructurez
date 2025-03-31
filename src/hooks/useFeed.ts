import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserPost } from '@/types/post';

export const useFeed = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for testing purposes
  const mockPosts: UserPost[] = [
    {
      id: '1',
      user_id: '1',
      profile_id: '1',
      content: 'This is a test post',
      image_url: '/placeholder.jpg',
      created_at: new Date().toISOString(),
      likes_count: 10,
      comments_count: 5,
      reposts_count: 2,
      profile: {
        username: 'testuser',
        avatar_url: '/avatar.jpg',
        name: 'Test User'
      }
    },
    {
      id: '2',
      user_id: '2',
      profile_id: '2',
      content: 'Another test post with more content. This is to test how the post card will handle longer text',
      image_url: '/placeholder2.jpg',
      created_at: new Date().toISOString(),
      likes_count: 15,
      comments_count: 8,
      reposts_count: 5,
      profile: {
        username: 'anotheruser',
        avatar_url: '/avatar2.jpg',
        name: 'Another User'
      }
    },
    {
      id: '3',
      user_id: '1',
      profile_id: '1',
      content: 'A third test post with no image',
      created_at: new Date().toISOString(),
      likes_count: 7,
      comments_count: 2,
      reposts_count: 1,
      profile: {
        username: 'testuser',
        avatar_url: '/avatar.jpg',
        name: 'Test User'
      }
    },
    {
      id: '4',
      user_id: '2',
      profile_id: '2',
      content: 'A fourth test post with a very long text to test the limits of the UI. We need to make sure that the text does not overflow and that it wraps correctly. This is a very important test to ensure the quality of the application',
      created_at: new Date().toISOString(),
      likes_count: 20,
      comments_count: 12,
      reposts_count: 7,
      profile: {
        username: 'anotheruser',
        avatar_url: '/avatar2.jpg',
        name: 'Another User'
      }
    }
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPosts;
    },
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      setError(null);
    } else if (isError) {
      setLoading(false);
      setError('Failed to fetch posts');
    } else if (data) {
      setLoading(false);
      setPosts(data);
      setError(null);
    }
  }, [data, isLoading, isError]);

  // Function to fetch posts from Supabase
  const fetchPosts = async (): Promise<UserPost[]> => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*');

      if (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts from Supabase');
      }

      return formatPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  };

  // Function to format posts to match the UserPost interface
  const formatPosts = (posts: any[]): UserPost[] => {
    return posts.map(post => ({
      id: post.id,
      user_id: post.user_id,
      profile_id: post.profile_id || post.user_id, // Fallback to user_id if profile_id is missing
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      reposts_count: post.reposts_count || 0,
      profile: post.profile || null
    }));
  };

  return { posts, loading, error };
};
