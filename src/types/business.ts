export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location: string | null;
  contact: string | null;
  hours: string | null;
  image_url: string | null;
  video_url: string | null;
  verified: boolean | null;
  created_at: string;
  appointment_price: number | null;
  consultation_price: number | null;
  bio: string | null;
  website: string | null;
  image_scale: number | null;
  image_position: { x: number; y: number } | null;
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  business_portfolio: Array<{
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
  }>;
  business_products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    stock: number | null;
  }>;
  posts: Array<{
    id: string;
    content: string;
    image_url: string | null;
    category: string | null;
    created_at: string;
  }>;
}