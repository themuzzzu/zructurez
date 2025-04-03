
import type { MembershipPlan } from "@/types/membership";
import type { Owner } from "./owner";
import type { StaffMember } from "./staff";
import type { BusinessProduct } from "@/types/business"; // Import from central type definition

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
  membership_plans: MembershipPlan[];
}

export interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}
