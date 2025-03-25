
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { TargetingOptionsProps } from "../types";

export function TargetingOptions({
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
  setTargetGender
}: TargetingOptionsProps) {
  return (
    <Collapsible open={showTargeting} onOpenChange={setShowTargeting}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          {showTargeting ? "Hide Advanced Targeting" : "Show Advanced Targeting"}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <div>
          <Label>Target Locations</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Add a location"
            />
            <Button 
              type="button" 
              onClick={addTargetingLocation}
              disabled={!newLocation}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {targetingLocations.map((location) => (
              <Badge 
                key={location} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {location}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTargetingLocation(location)} 
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Target Interests</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest"
            />
            <Button 
              type="button" 
              onClick={addTargetingInterest}
              disabled={!newInterest}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {targetingInterests.map((interest) => (
              <Badge 
                key={interest} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {interest}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTargetingInterest(interest)} 
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Target Age Range</Label>
            <div className="flex gap-2 items-center mt-1">
              <Input
                type="number"
                value={targetAgeMin}
                onChange={(e) => setTargetAgeMin(e.target.value)}
                placeholder="Min Age"
                min="13"
                max="100"
              />
              <span>to</span>
              <Input
                type="number"
                value={targetAgeMax}
                onChange={(e) => setTargetAgeMax(e.target.value)}
                placeholder="Max Age"
                min={targetAgeMin || "13"}
                max="100"
              />
            </div>
          </div>

          <div>
            <Label>Target Gender</Label>
            <Select value={targetGender} onValueChange={setTargetGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
