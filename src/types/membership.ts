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