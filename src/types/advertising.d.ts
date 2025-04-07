
export type AdType = 
  | "product"
  | "service"
  | "business"
  | "event"
  | "general";

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  type: AdType;
  format: string;
  reference_id: string;
  status: string;
  user_id: string;
  location: string;
  budget: number;
  clicks: number;
  impressions: number;
  start_date: string;
  end_date: string;
  created_at: string;
  video_url: string | null;
  carousel_images: any;
  business_id?: string;
}
