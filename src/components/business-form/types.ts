
export interface Owner {
  name: string;
  role: string;
  position: string;
  experience: string;
  image_url?: string | null;
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  image_url?: string | null;
}

export interface BusinessProduct {
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface BusinessFormData {
  name: string;
  category: string;
  otherCategory?: string;
  description: string;
  location: string;
  contact: string;
  hours: string;
  image: string | null;
  appointment_price: string;
  consultation_price: string;
  bio: string;
  website: string;
  owners: Owner[];
  staff_details: StaffMember[];
  business_products: BusinessProduct[];
}
