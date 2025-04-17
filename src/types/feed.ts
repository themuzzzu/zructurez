
export interface FeedItem {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  userHasLiked?: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}
