
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TargetingOptionsProps {
  showTargeting: boolean;
  setShowTargeting: (value: boolean) => void;
  newLocation: string;
  setNewLocation: (value: string) => void;
  targetingLocations: string[];
  addTargetingLocation: () => void;
  removeTargetingLocation: (location: string) => void;
  newInterest: string;
  setNewInterest: (value: string) => void;
  targetingInterests: string[];
  addTargetingInterest: () => void;
  removeTargetingInterest: (interest: string) => void;
  targetAgeMin: string;
  setTargetAgeMin: (value: string) => void;
  targetAgeMax: string;
  setTargetAgeMax: (value: string) => void;
  targetGender: string;
  setTargetGender: (value: string) => void;
}

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
  setTargetGender
}: TargetingOptionsProps) => {
  return (
    <div className="border p-4 rounded-md">
      <button 
        type="button" 
        className="flex items-center justify-between w-full font-medium"
        onClick={() => setShowTargeting(!showTargeting)}
      >
        Advanced Targeting Options
        {showTargeting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {showTargeting && (
        <div className="mt-4 space-y-4">
          <div>
            <Label>Target Locations</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add location"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={addTargetingLocation}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {targetingLocations.map((loc) => (
                <div key={loc} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {loc}
                  <button 
                    type="button" 
                    onClick={() => removeTargetingLocation(loc)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Target Interests</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add interest (e.g. fashion, sports)"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={addTargetingInterest}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {targetingInterests.map((interest) => (
                <div key={interest} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {interest}
                  <button 
                    type="button" 
                    onClick={() => removeTargetingInterest(interest)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Age Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={targetAgeMin}
                  onChange={(e) => setTargetAgeMin(e.target.value)}
                  placeholder="Min"
                  min="13"
                  max="100"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={targetAgeMax}
                  onChange={(e) => setTargetAgeMax(e.target.value)}
                  placeholder="Max"
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
