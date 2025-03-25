
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

export interface AdvertisementFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export interface DateSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export interface AdvertisementTypeSelectProps {
  value: AdType;
  onChange: (value: AdType) => void;
}

export interface AdvertisementFormatSelectProps {
  value: AdFormat;
  onChange: (value: AdFormat) => void;
}

export interface ItemSelectProps {
  type: AdType;
  format: AdFormat;
  selectedItemId: string;
  onChange: (id: string) => void;
  businesses?: any[];
  services?: any[];
  products?: any[];
  posts?: any[];
}

export interface MediaUploadProps {
  format: AdFormat;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  carouselImages: string[];
  addCarouselImage: (url: string) => void;
  removeCarouselImage: (index: number) => void;
}

export interface TargetingOptionsProps {
  showTargeting: boolean;
  setShowTargeting: (show: boolean) => void;
  newLocation: string;
  setNewLocation: (location: string) => void;
  targetingLocations: string[];
  addTargetingLocation: () => void;
  removeTargetingLocation: (location: string) => void;
  newInterest: string;
  setNewInterest: (interest: string) => void;
  targetingInterests: string[];
  addTargetingInterest: () => void;
  removeTargetingInterest: (interest: string) => void;
  targetAgeMin: string;
  setTargetAgeMin: (age: string) => void;
  targetAgeMax: string;
  setTargetAgeMax: (age: string) => void;
  targetGender: string;
  setTargetGender: (gender: string) => void;
}
