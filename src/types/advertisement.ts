
export interface Advertisement {
  id: string;
  user_id: string;
  business_id: string;
  title: string;
  description: string;
  image_url: string;
  type: string;
  format: string;
  reference_id: string;
  budget: number;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  created_at: string;
  clicks: number;
  impressions: number;
  reach: number;
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
}

export type CreateAdvertisementDto = Omit<Advertisement, "id" | "created_at" | "clicks" | "impressions" | "status" | "reach">;
