import { Owner, StaffMember } from "../../../types/business";

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