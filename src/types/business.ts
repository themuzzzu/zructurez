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
  image_position: { x: number; y: number };
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  show_in_services: boolean | null;
  is_open: boolean | null;
  wait_time: string | null;
  closure_reason: string | null;
  aadhar_number: string | null;
  pan_number: string | null;
  gst_number: string | null;
  verification_status: string | null;
  verification_submitted_at: string | null;
  verification_documents: any[]; // Changed from Json to any[]
  membership_plans: any[];
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
}

export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
}