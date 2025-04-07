
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdFormat, AdType } from "@/services/adService";
import { toast } from "sonner";
import { AdFormValues } from "../types";

export const useAdvertisementForm = (onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<AdType>("business");
  const [format, setFormat] = useState<AdFormat>("standard");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedItemId, setSelectedItemId] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  
  // Targeting options
  const [showTargeting, setShowTargeting] = useState(false);
  const [targetingLocations, setTargetingLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [targetingInterests, setTargetingInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState<string>("18");
  const [targetAgeMax, setTargetAgeMax] = useState<string>("65");
  const [targetGender, setTargetGender] = useState<string>("all");

  const { data: businesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: services } = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: products } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: posts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: format === 'boosted_post'
  });

  // Carousel image management
  const addCarouselImage = (imageUrl: string) => {
    if (carouselImages.length < 5) {
      setCarouselImages([...carouselImages, imageUrl]);
    } else {
      toast.error("Maximum 5 images allowed in carousel");
    }
  };

  const removeCarouselImage = (index: number) => {
    const updatedImages = [...carouselImages];
    updatedImages.splice(index, 1);
    setCarouselImages(updatedImages);
  };

  // Targeting location management
  const addTargetingLocation = () => {
    if (newLocation && !targetingLocations.includes(newLocation)) {
      setTargetingLocations([...targetingLocations, newLocation]);
      setNewLocation("");
    }
  };

  const removeTargetingLocation = (index: number) => {
    const updatedLocations = [...targetingLocations];
    updatedLocations.splice(index, 1);
    setTargetingLocations(updatedLocations);
  };

  // Targeting interest management
  const addTargetingInterest = () => {
    if (newInterest && !targetingInterests.includes(newInterest)) {
      setTargetingInterests([...targetingInterests, newInterest]);
      setNewInterest("");
    }
  };

  const removeTargetingInterest = (index: number) => {
    const updatedInterests = [...targetingInterests];
    updatedInterests.splice(index, 1);
    setTargetingInterests(updatedInterests);
  };

  const formValues: AdFormValues = {
    type,
    format,
    title,
    description,
    location,
    budget,
    startDate,
    endDate,
    selectedItemId,
    imageUrl,
    videoUrl,
    carouselImages,
    targetingLocations,
    targetingInterests,
    targetAgeMin,
    targetAgeMax,
    targetGender
  };

  const formSetters = {
    setType,
    setFormat,
    setTitle,
    setDescription,
    setLocation,
    setBudget,
    setStartDate,
    setEndDate,
    setSelectedItemId,
    setImageUrl,
    setVideoUrl,
    setCarouselImages,
    setShowTargeting,
    setTargetingLocations,
    setNewLocation,
    setTargetingInterests,
    setNewInterest,
    setTargetAgeMin,
    setTargetAgeMax,
    setTargetGender
  };

  return {
    loading,
    setLoading,
    showTargeting,
    newLocation,
    newInterest,
    businesses,
    services,
    products,
    posts,
    formValues,
    formSetters,
    addCarouselImage,
    removeCarouselImage,
    addTargetingLocation,
    removeTargetingLocation,
    addTargetingInterest,
    removeTargetingInterest,
    onClose
  };
};
