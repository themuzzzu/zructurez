
export interface Address {
  id: string;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  address_type: "home" | "work" | "other";
  is_default: boolean;
  created_at?: string;
}
