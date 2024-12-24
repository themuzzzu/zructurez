import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value = '', onChange }: CategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Input
        id="category"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter service category..."
        className="w-full"
      />
    </div>
  );
};