
export interface StaffMember {
  id?: string;
  name: string;
  role?: string;
  position: string;
  experience: string;
  bio?: string;
  image_url?: string | null;
  specialties?: string[];
}

export interface StaffMembersProps {
  staff: StaffMember[];
  onChange: (staff: StaffMember[]) => void;
}

export interface StaffFormFieldsProps {
  name: string;
  position: string;
  experience: string;
  bio?: string;
  image_url?: string | null;
  onUpdate: (field: keyof StaffMember, value: string) => void;
}
