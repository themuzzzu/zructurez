import type { Json } from "@/integrations/supabase/types";

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

export interface MembershipDetails {
  plan: string;
  features: string[];
  price: number;
}

// Helper function to convert MembershipDetails to Json type
export const membershipDetailsToJson = (details: MembershipDetails): Json => {
  return details as unknown as Json;
};

// Helper function to convert Json to MembershipDetails
export const jsonToMembershipDetails = (json: Json): MembershipDetails => {
  if (typeof json !== 'object' || !json) {
    throw new Error('Invalid membership details format');
  }
  
  const obj = json as Record<string, unknown>;
  return {
    plan: String(obj.plan || ''),
    features: Array.isArray(obj.features) ? obj.features.map(String) : [],
    price: Number(obj.price || 0)
  };
};