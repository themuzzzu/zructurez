
import { UserSubscription } from "@/types/analytics";

export const mockUserSubscription: UserSubscription = {
  id: "subscription-123",
  user_id: "user-123",
  plan_id: "basic",
  plan_name: "Basic",
  status: "active",
  amount: 0,
  billing_interval: "monthly",
  next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  product_limit: 10,
  service_limit: 5,
  visibility_level: "standard",
  analytics_level: "basic",
  created_at: new Date().toISOString()
};
