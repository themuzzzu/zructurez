import type { StaffMember } from "../../../types/business";
import type { Owner } from "./owner";

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
  owners: Owner[];
  staff_details: StaffMember[];
}

export interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}