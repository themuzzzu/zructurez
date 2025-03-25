
import { AdFormat, AdType } from "@/services/adService";

export interface AdFormValues {
  type: AdType;
  format: AdFormat;
  title: string;
  description: string;
  location: string;
  budget: string;
  startDate?: Date;
  endDate?: Date;
  selectedItemId: string;
  imageUrl: string | null;
  videoUrl: string;
  carouselImages: string[];
  targetingLocations: string[];
  targetingInterests: string[];
  targetAgeMin: string;
  targetAgeMax: string;
  targetGender: string;
}
