
import { PollOption, PollVote, Poll, Post } from "../types/postTypes";

// Define the shape of raw data from the database
export interface DatabasePostData {
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

/**
 * Transforms raw database post data into the application's Post format
 */
export const transformPosts = (rawPosts: any[]): Post[] => {
  if (!rawPosts || rawPosts.length === 0) {
    return [];
  }

  try {
    const transformedPosts: Post[] = [];
    
    for (const rawData of rawPosts) {
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
        post.poll = transformPollData(rawPost.poll);
      }

      transformedPosts.push(post);
    }

    return transformedPosts;
  } catch (transformError) {
    console.error('Error transforming posts data:', transformError);
    return [];
  }
};

/**
 * Transforms raw poll data into the application's Poll format
 */
export const transformPollData = (pollData: any): Poll | undefined => {
  if (!pollData || typeof pollData !== 'object' || !('id' in pollData) || !('question' in pollData)) {
    return undefined;
  }

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

  return {
    id: String(pollData.id),
    question: String(pollData.question),
    options: pollOptions,
    votes: pollVotes
  };
};
