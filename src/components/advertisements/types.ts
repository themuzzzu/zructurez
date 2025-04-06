
import { AdType, AdFormat } from "@/services/adService";

export interface AdvertisementFormProps {
  onClose: () => void;
}

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

export type AdvertisementFormProps = {
  onClose: () => void;
};

export interface DateSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}
