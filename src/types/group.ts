export interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  group_members: {
    count: number;
    members: string[];
  };
}