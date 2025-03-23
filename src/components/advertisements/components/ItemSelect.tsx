
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdType } from "@/services/adService";

interface ItemSelectProps {
  type: AdType;
  format: string;
  selectedItemId: string;
  onChange: (id: string) => void;
  businesses?: any[];
  services?: any[];
  products?: any[];
  posts?: any[];
}

export const ItemSelect = ({ 
  type, 
  format, 
  selectedItemId, 
  onChange,
  businesses,
  services,
  products,
  posts
}: ItemSelectProps) => {
  if (format === 'boosted_post') {
    return (
      <div>
        <Label>Select Post to Boost</Label>
        <Select value={selectedItemId} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select post" />
          </SelectTrigger>
          <SelectContent>
            {posts?.map((post) => (
              <SelectItem key={post.id} value={post.id}>
                {post.content.substring(0, 30)}...
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div>
      <Label>Select {type}</Label>
      <Select value={selectedItemId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${type}`} />
        </SelectTrigger>
        <SelectContent>
          {type === "business" && businesses?.map((business) => (
            <SelectItem key={business.id} value={business.id}>
              {business.name}
            </SelectItem>
          ))}
          {type === "service" && services?.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.title}
            </SelectItem>
          ))}
          {type === "product" && products?.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
