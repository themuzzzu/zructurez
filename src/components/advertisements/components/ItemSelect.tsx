
import { AdType, AdFormat } from "@/services/adService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ItemSelectProps {
  type: AdType;
  format: AdFormat;
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
  businesses = [],
  services = [],
  products = [],
  posts = []
}: ItemSelectProps) => {
  // Check if we need to render this component
  const isBoostingPostFormat = format === 'boosted_post' as AdFormat;
  const hasItems = 
    (type === "business" && businesses && businesses.length > 0) ||
    (type === "service" && services && services.length > 0) ||
    (type === "product" && products && products.length > 0) ||
    (isBoostingPostFormat && posts && posts.length > 0) ||
    type === "sponsored" as AdType;

  if (!hasItems) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Select Item to Advertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === "business" && businesses && businesses.length > 0 && (
          <div>
            <Label htmlFor="business-select">Select Business</Label>
            <Select value={selectedItemId} onValueChange={onChange}>
              <SelectTrigger id="business-select">
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "service" && services && services.length > 0 && (
          <div>
            <Label htmlFor="service-select">Select Service</Label>
            <Select value={selectedItemId} onValueChange={onChange}>
              <SelectTrigger id="service-select">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.title || service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "product" && products && products.length > 0 && (
          <div>
            <Label htmlFor="product-select">Select Product</Label>
            <Select value={selectedItemId} onValueChange={onChange}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title || product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isBoostingPostFormat && posts && posts.length > 0 && (
          <div>
            <Label htmlFor="post-select">Select Post to Boost</Label>
            <Select value={selectedItemId} onValueChange={onChange}>
              <SelectTrigger id="post-select">
                <SelectValue placeholder="Select a post" />
              </SelectTrigger>
              <SelectContent>
                {posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.content.slice(0, 30) + (post.content.length > 30 ? "..." : "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "sponsored" as AdType && (
          <div>
            <Label htmlFor="url-input">External URL</Label>
            <input
              id="url-input"
              type="text"
              value={selectedItemId}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://your-website.com"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
