
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdvertisementTypeSelect } from "./components/AdvertisementTypeSelect";
import { AdvertisementFormatSelect } from "./components/AdvertisementFormatSelect";
import { ItemSelect } from "./components/ItemSelect";
import { DateSelector } from "./components/DateSelector";
import { MediaUpload } from "./components/MediaUpload";
import { TargetingOptions } from "./components/TargetingOptions";
import { useAdvertisementForm } from "./hooks/useAdvertisementForm";
import { useSubmitAdvertisement } from "./hooks/useSubmitAdvertisement";
import { AdvertisementFormProps } from "./types";

export const CreateAdvertisement = ({ onClose }: AdvertisementFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formValues,
    formSetters,
    businesses,
    services,
    products,
    posts,
    showTargeting,
    newLocation,
    newInterest,
    addCarouselImage,
    removeCarouselImage,
    addTargetingLocation,
    removeTargetingLocation,
    addTargetingInterest,
    removeTargetingInterest,
  } = useAdvertisementForm(onClose);

  const { handleSubmit } = useSubmitAdvertisement(
    formValues,
    setIsLoading,
    onClose
  );

  return (
    <div className="flex flex-col space-y-6 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Create Advertisement</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
            <CardDescription>
              Select the type of advertisement you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdvertisementTypeSelect
                value={formValues.type}
                onChange={formSetters.setType}
              />

              <AdvertisementFormatSelect
                value={formValues.format}
                onChange={formSetters.setFormat}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Advertisement Title</Label>
                <Input
                  id="title"
                  value={formValues.title}
                  onChange={(e) => formSetters.setTitle(e.target.value)}
                  placeholder="Enter a catchy title for your ad"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Advertisement Description</Label>
                <Textarea
                  id="description"
                  value={formValues.description}
                  onChange={(e) => formSetters.setDescription(e.target.value)}
                  placeholder="Describe what you're advertising"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Target Location</Label>
                <Input
                  id="location"
                  value={formValues.location}
                  onChange={(e) => formSetters.setLocation(e.target.value)}
                  placeholder="e.g. New York, Global, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="5"
                  step="0.01"
                  value={formValues.budget}
                  onChange={(e) => formSetters.setBudget(e.target.value)}
                  placeholder="Your total budget for this campaign"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <DateSelector
          startDate={formValues.startDate}
          endDate={formValues.endDate}
          onStartDateChange={formSetters.setStartDate}
          onEndDateChange={formSetters.setEndDate}
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Advertisement"}
          </Button>
        </div>
      </form>
    </div>
  );
};
