export interface Owner {
  name: string;
  role: string;
  position: string;
  experience: string;
}

export interface StaffMember {
  name: string;
  position: string;
  experience: string;
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
  owners: Owner[];
  staff_details: StaffMember[];
}