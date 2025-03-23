
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  bio: string | null;
  location?: string | null;
}
