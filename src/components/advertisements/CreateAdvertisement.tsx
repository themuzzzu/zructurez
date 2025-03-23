
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationSelector } from "@/components/LocationSelector";
import { useAdvertisementForm } from "./hooks/useAdvertisementForm";
import { useSubmitAdvertisement } from "./hooks/useSubmitAdvertisement";
import { AdvertisementTypeSelect } from "./components/AdvertisementTypeSelect";
import { AdvertisementFormatSelect } from "./components/AdvertisementFormatSelect";
import { ItemSelect } from "./components/ItemSelect";
import { DateSelector } from "./components/DateSelector";
import { MediaUpload } from "./components/MediaUpload";
import { TargetingOptions } from "./components/TargetingOptions";
import { AdvertisementFormProps } from "./types";

export const CreateAdvertisement = ({ onClose }: AdvertisementFormProps) => {
  const {
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
    onClose: handleClose
  } = useAdvertisementForm(onClose);

  const { handleSubmit } = useSubmitAdvertisement(formValues, setLoading, handleClose);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdvertisementTypeSelect 
        value={formValues.type} 
        onChange={formSetters.setType}
      />

      <AdvertisementFormatSelect 
        value={formValues.format} 
        onChange={formSetters.setFormat}
      />

      <ItemSelect 
        type={formValues.type}
        format={formValues.format}
        selectedItemId={formValues.selectedItemId}
        onChange={formSetters.setSelectedItemId}
        businesses={businesses}
        services={services}
        products={products}
        posts={posts}
      />

      <div>
        <Label>Advertisement Title</Label>
        <Input
          value={formValues.title}
          onChange={(e) => formSetters.setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formValues.description}
          onChange={(e) => formSetters.setDescription(e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>

      <MediaUpload 
        format={formValues.format}
        imageUrl={formValues.imageUrl}
        setImageUrl={formSetters.setImageUrl}
        videoUrl={formValues.videoUrl}
        setVideoUrl={formSetters.setVideoUrl}
        carouselImages={formValues.carouselImages}
        addCarouselImage={addCarouselImage}
        removeCarouselImage={removeCarouselImage}
      />

      <div>
        <Label>Location</Label>
        <LocationSelector value={formValues.location} onChange={formSetters.setLocation} />
      </div>

      <div>
        <Label>Budget (₹)</Label>
        <Input
          type="number"
          value={formValues.budget}
          onChange={(e) => formSetters.setBudget(e.target.value)}
          placeholder="Enter budget in rupees"
          min="0"
          step="0.01"
          required
        />
      </div>

      <DateSelector 
        startDate={formValues.startDate}
        endDate={formValues.endDate}
        onStartDateChange={formSetters.setStartDate}
        onEndDateChange={formSetters.setEndDate}
      />

      <TargetingOptions 
        showTargeting={showTargeting}
        setShowTargeting={formSetters.setShowTargeting}
        newLocation={newLocation}
        setNewLocation={formSetters.setNewLocation}
        targetingLocations={formValues.targetingLocations}
        addTargetingLocation={addTargetingLocation}
        removeTargetingLocation={removeTargetingLocation}
        newInterest={newInterest}
        setNewInterest={formSetters.setNewInterest}
        targetingInterests={formValues.targetingInterests}
        addTargetingInterest={addTargetingInterest}
        removeTargetingInterest={removeTargetingInterest}
        targetAgeMin={formValues.targetAgeMin}
        setTargetAgeMin={formSetters.setTargetAgeMin}
        targetAgeMax={formValues.targetAgeMax}
        setTargetAgeMax={formSetters.setTargetAgeMax}
        targetGender={formValues.targetGender}
        setTargetGender={formSetters.setTargetGender}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Advertisement"}
        </Button>
      </div>
    </form>
  );
};
