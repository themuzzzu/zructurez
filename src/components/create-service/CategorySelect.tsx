import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const categories = [
  "Plumbing",
  "Electrical",
  "Computer Repair",
  "Beauty Services",
  "Home Cleaning",
  "Moving Services",
  "Painting",
  "Pest Control",
  "Photography",
  "Laundry",
  "Wellness",
  "Pet Care",
  "Tutoring",
  "Internet Services",
  "Automotive",
  "Catering",
  "Childcare",
  "Gardening",
  "Music Lessons",
  "Fitness Training",
  "Healthcare"
];

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value = '', onChange }: CategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
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