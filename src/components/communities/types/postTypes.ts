
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
