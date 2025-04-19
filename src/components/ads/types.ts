
export type AdSectionType = "home" | "marketplace" | "business" | "services";

export type AdType = 
  | "banner" 
  | "flash_deal"
  | "sponsored_product"
  | "suggested_product"
  | "sponsored_business"
  | "suggested_business"
  | "recommended_service"
  | "sponsored_service";

export type TargetType = "product" | "business" | "service" | "url";

export interface AdFormData {
  section?: AdSectionType;
  type?: AdType;
  mediaUrl: string;
  title: string;
  description: string;
  ctaText: string;
  targetType: TargetType;
  targetId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}
