
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostItem } from "./PostItem";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export interface PollOption {
  id: string;
  text: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  votes: PollVote[];
}

export interface Post {
  id: string;
  user_id: string;
  group_id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
  profile?: {
    username: string;
    avatar_url: string;
  };
  group?: {
    name: string;
  };
  poll?: Poll;
}

interface PostsListProps {
  selectedGroup: string | null;
  refreshTrigger: number;
}

// Define simple types to avoid recursive references
interface DatabasePostData {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  group_id?: string | null;
  business_id?: string | null; 
  profile_id?: string;
  image_url?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
  category?: string;
  location?: string;
  views?: number;
  profiles?: { username: string; avatar_url: string; } | null;
  group?: { name?: string; } | null;
  poll?: any;
}

export const PostsList = ({ selectedGroup, refreshTrigger }: PostsListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [selectedGroup, refreshTrigger]);

  const fetchPosts = async () => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:profile_id (username, avatar_url),
        group:group_id (name),
        poll:poll_id (
          id,
          question,
          options:text,
          votes:poll_votes (id, poll_id, user_id, option_index)
        )
      `)
      .order('created_at', { ascending: false });

    if (selectedGroup) {
      query = query.eq('group_id', selectedGroup);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    if (!data || data.length === 0) {
      setPosts([]);
      return;
    }

    try {
      const transformedPosts: Post[] = [];
      
      for (const rawData of data) {
        // Safely cast the raw data
        const rawPost = rawData as DatabasePostData;

        // Create the post object with mandatory fields
        const post: Post = {
          id: rawPost.id,
          user_id: rawPost.user_id,
          // Use group_id if present, otherwise try business_id, or fallback to empty string
          group_id: rawPost.group_id || rawPost.business_id || '',
          content: rawPost.content,
          created_at: rawPost.created_at,
          // Default group name
          group: { name: 'Unknown Group' }
        };

        // Add optional fields if they exist
        if (rawPost.image_url) post.image_url = rawPost.image_url;
        if (rawPost.poll_id) post.poll_id = rawPost.poll_id;
        if (rawPost.gif_url) post.gif_url = rawPost.gif_url;

        // Handle profile data 
        if (rawPost.profiles) {
          post.profile = {
            username: rawPost.profiles.username || '',
            avatar_url: rawPost.profiles.avatar_url || ''
          };
        }

        // Handle group data
        if (rawPost.group && rawPost.group.name) {
          post.group = {
            name: rawPost.group.name
          };
        }

        // Handle poll data
        if (rawPost.poll) {
          const pollData = rawPost.poll;
          
          if (pollData && typeof pollData === 'object' && 'id' in pollData && 'question' in pollData) {
            const pollOptions: PollOption[] = [];
            const pollVotes: PollVote[] = [];
            
            // Process options
            if ('options' in pollData && Array.isArray(pollData.options)) {
              pollData.options.forEach((opt: any) => {
                if (typeof opt === 'string') {
                  pollOptions.push({ 
                    id: crypto.randomUUID(), 
                    text: opt 
                  });
                } else if (opt && typeof opt === 'object' && 'text' in opt) {
                  pollOptions.push({ 
                    id: ('id' in opt && opt.id) ? String(opt.id) : crypto.randomUUID(), 
                    text: String(opt.text) 
                  });
                }
              });
            }
            
            // Process votes
            if ('votes' in pollData && Array.isArray(pollData.votes)) {
              pollData.votes.forEach((vote: any) => {
                if (vote && typeof vote === 'object' && 
                    'id' in vote && 'poll_id' in vote && 
                    'user_id' in vote && 'option_index' in vote) {
                  pollVotes.push({
                    id: String(vote.id),
                    poll_id: String(vote.poll_id),
                    user_id: String(vote.user_id),
                    option_index: Number(vote.option_index)
                  });
                }
              });
            }

            post.poll = {
              id: String(pollData.id),
              question: String(pollData.question),
              options: pollOptions,
              votes: pollVotes
            };
          }
        }

        transformedPosts.push(post);
      }

      setPosts(transformedPosts);
    } catch (transformError) {
      console.error('Error transforming posts data:', transformError);
      setPosts([]);
    }
  };

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to post in this community!
        </p>
        {!selectedGroup && (
          <p className="text-sm text-muted-foreground">
            Select a community to post in
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onVote={fetchPosts}
        />
      ))}
    </div>
  );
};
