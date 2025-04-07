
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ItemSelectProps } from "../types";

export function ItemSelect({ 
  type, 
  format, 
  selectedItemId, 
  onChange,
  businesses = [],
  services = [],
  products = [],
  posts = []
}: ItemSelectProps) {
  const getTypeLabel = () => {
    if (format === 'boosted_post') return 'Post';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getItems = () => {
    if (format === 'boosted_post') return posts;
    
    switch (type) {
      case "business":
        return businesses;
      case "service":
        return services;
      case "product":
      case "sponsored":
        return products;
      default:
        return [];
    }
  };

  const getItemName = (item: any) => {
    if (format === 'boosted_post') return item.content?.substring(0, 30) + '...';
    
    switch (type) {
      case "business":
        return item.name;
      case "service":
        return item.title;
      case "product":
      case "sponsored":
        return item.title;
      default:
        return '';
    }
  };

  const items = getItems();

  return (
    <div>
      <Label>Select {getTypeLabel()}</Label>
      <Select value={selectedItemId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${getTypeLabel()}`} />
        </SelectTrigger>
        <SelectContent>
          {items.length === 0 ? (
            <SelectItem value="none" disabled>No items available</SelectItem>
          ) : (
            items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {getItemName(item)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
