
import { AdFormat, AdType, TargetingOptions } from "@/services/adService";

export interface AdFormValues {
  type: AdType;
  format: AdFormat;
  title: string;
  description: string;
  location: string;
  budget: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
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

export interface AdvertisementFormProps {
  onClose: () => void;
}
