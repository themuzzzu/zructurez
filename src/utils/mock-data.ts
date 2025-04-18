
import { UserSubscription } from "@/types/analytics";

export const mockUserSubscription: UserSubscription = {
  id: "subscription-123",
  userId: "user-123", // Changed from user_id to userId
  planId: "basic",
  planName: "Basic",
  status: "active",
  amount: 0,
  billingInterval: "monthly",
  nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  productLimit: 10,
  serviceLimit: 5,
  visibilityLevel: "standard",
  analyticsLevel: "basic",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
};
