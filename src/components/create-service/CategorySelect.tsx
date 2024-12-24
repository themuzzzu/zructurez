import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const categories = [
  "Automotive",
  "Beauty Services",
  "Catering",
  "Childcare",
  "Computer Repair",
  "Electrical",
  "Fitness Training",
  "Gardening",
  "Healthcare",
  "Home Cleaning",
  "Internet Services",
  "Laundry",
  "Moving Services",
  "Music Lessons",
  "Painting",
  "Pest Control",
  "Pet Care",
  "Photography",
  "Plumbing",
  "Tutoring",
  "Wellness"
].sort();

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};