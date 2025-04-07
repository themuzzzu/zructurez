
import { MouseEventHandler } from "react";

export interface AdFormValues {
  type: string;
  format: string;
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
}

export interface AdvertisementTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface AdvertisementFormatSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ItemSelectProps {
  type: string;
  format: string;
  selectedItemId: string;
  onChange: (value: string) => void;
  businesses?: any[];
  services?: any[];
  products?: any[];
  posts?: any[];
}

export interface DateSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export interface MediaUploadProps {
  format: string;
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
  removeTargetingLocation: (index: number) => void;
  newInterest: string;
  setNewInterest: (interest: string) => void;
  targetingInterests: string[];
  addTargetingInterest: () => void;
  removeTargetingInterest: (index: number) => void;
  targetAgeMin: string;
  setTargetAgeMin: (age: string) => void;
  targetAgeMax: string;
  setTargetAgeMax: (age: string) => void;
  targetGender: string;
  setTargetGender: (gender: string) => void;
}
