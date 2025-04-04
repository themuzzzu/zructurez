
export interface SecurityEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  browser_fingerprint?: string;
  ip_address?: string;
  details?: any;
  activity_type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'business_owner' | 'customer';
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  before_state?: any;
  after_state?: any;
  ip_address?: string;
  created_at: string;
}

// Define user address type that matches what's used in the database
export interface UserAddress {
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
