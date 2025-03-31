
export interface StaffMember {
  name: string;
  position: string;
  experience?: string;
  bio?: string;
  image_url?: string | null;
}

export interface StaffMembersProps {
  staff: StaffMember[];
  onChange: (staff: StaffMember[]) => void;
}

export interface StaffFormFieldsProps {
  name: string;
  position: string;
  experience?: string; // Make experience optional
  bio?: string;
  image_url?: string | null;
  onUpdate: (field: keyof StaffMember, value: string) => void;
}
