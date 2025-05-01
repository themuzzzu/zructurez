
export interface Business {
  id: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  image_url?: string;
  contact?: string;
  hours?: string;
  verified?: boolean;
  bio?: string;
  website?: string;
  owners?: {
    name: string;
    role: string;
    position?: string;
    experience?: string;
  }[];
  staff_details?: {
    name: string;
    position?: string;
    experience?: string;
  }[];
  is_open?: boolean;
  appointment_price?: number;
  consultation_price?: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  business_id: string;
  image_url?: string;
  stock?: number;
  category?: string;
}
