
export interface BusinessOwner {
  name: string;
  role: string;
  position: string;
  experience: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
}

export interface StaffMember {
  name: string;
  position: string;
  experience: string;
  bio?: string;
  image_url?: string | null;
}

export interface BusinessProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image_url?: string | null;
}

export interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  location: string;
  rating?: number;
  description: string;
  reviews?: number;
  contact?: string;
  hours?: string;
  appointment_price?: number;
  consultation_price?: number;
  is_open?: boolean;
  verified?: boolean;
}
