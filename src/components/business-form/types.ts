
import type { BusinessOwner, StaffMember, BusinessProduct } from "@/types/business";

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
  owners: BusinessOwner[];
  staff_details: StaffMember[];
  business_products: BusinessProduct[];
}
