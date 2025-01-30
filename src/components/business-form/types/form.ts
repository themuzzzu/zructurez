import type { MembershipPlan } from "@/types/membership";
import type { BusinessOwner, StaffMember } from "@/types/business";

interface BusinessProduct {
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface BusinessFormData {
  name: string;
  category: string;
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
  membership_plans: MembershipPlan[];
}

export interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}