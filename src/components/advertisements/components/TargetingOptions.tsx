
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TargetingOptionsProps } from "../types";

export const TargetingOptions = ({
  showTargeting,
  setShowTargeting,
  newLocation,
  setNewLocation,
  targetingLocations,
  addTargetingLocation,
  removeTargetingLocation,
  newInterest,
  setNewInterest,
  targetingInterests,
  addTargetingInterest,
  removeTargetingInterest,
  targetAgeMin,
  setTargetAgeMin,
  targetAgeMax,
  setTargetAgeMax,
  targetGender,
  setTargetGender,
}: TargetingOptionsProps) => {
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    addTargetingLocation();
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    addTargetingInterest();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg md:text-xl">Advanced Targeting</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTargeting(!showTargeting)}
            className="h-8 w-8 p-0"
          >
            {showTargeting ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Target specific audiences for better ad performance
        </CardDescription>
      </CardHeader>

      {showTargeting && (
        <CardContent className="space-y-6">
          {/* Location targeting */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Location Targeting</h4>
            <form onSubmit={handleAddLocation} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add location (city, region, country)"
                className="flex-grow"
              />
              <Button type="submit" disabled={!newLocation.trim()}>
                Add
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              {targetingLocations.map((location, index) => (
                <Badge key={index} variant="secondary" className="py-1">
                  {location}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTargetingLocation(index)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Interest targeting */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Interest Targeting</h4>
            <form onSubmit={handleAddInterest} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add interest (fashion, tech, sports)"
                className="flex-grow"
              />
              <Button type="submit" disabled={!newInterest.trim()}>
                Add
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              {targetingInterests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="py-1">
                  {interest}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTargetingInterest(index)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Age targeting */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Age Range</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs">Minimum Age</label>
                <Input
                  type="number"
                  min="13"
                  max="100"
                  value={targetAgeMin}
                  onChange={(e) => setTargetAgeMin(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs">Maximum Age</label>
                <Input
                  type="number"
                  min="13"
                  max="100"
                  value={targetAgeMax}
                  onChange={(e) => setTargetAgeMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Gender targeting */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Gender</h4>
            <Select value={targetGender} onValueChange={setTargetGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
