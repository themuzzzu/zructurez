import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { BusinessFormData } from "./types";

interface BusinessBasicInfoProps {
  formData: BusinessFormData;
  onChange: (name: string, value: any) => void;
}

export const BusinessBasicInfo = ({ formData, onChange }: BusinessBasicInfoProps) => {
  const addProduct = () => {
    const updatedProducts = [...(formData.business_products || []), {
      name: "",
      price: 0,
      description: "",
      category: ""
    }];
    onChange("business_products", updatedProducts);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.business_products?.filter((_, i) => i !== index) || [];
    onChange("business_products", updatedProducts);
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = formData.business_products?.map((product, i) => {
      if (i === index) {
        return { ...product, [field]: value };
      }
      return product;
    }) || [];
    onChange("business_products", updatedProducts);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter your business name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beauty">Beauty & Wellness</SelectItem>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="health">Health & Medical</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="home">Home Services</SelectItem>
            <SelectItem value="professional">Professional Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your business"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment_price">Appointment Price (₹)</Label>
        <Input
          id="appointment_price"
          type="number"
          value={formData.appointment_price}
          onChange={(e) => onChange("appointment_price", e.target.value)}
          placeholder="Enter appointment price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultation_price">Consultation Price (₹)</Label>
        <Input
          id="consultation_price"
          type="number"
          value={formData.consultation_price}
          onChange={(e) => onChange("consultation_price", e.target.value)}
          placeholder="Enter consultation price"
        />
      </div>

      {/* Menu Items Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label>Menu Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProduct}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {formData.business_products?.map((product, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <Label>Menu Item {index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProduct(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={product.category}
                  onValueChange={(value) => updateProduct(index, "category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="starters">Starters</SelectItem>
                    <SelectItem value="main-course">Main Course</SelectItem>
                    <SelectItem value="specials">Chef's Specials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct(index, "name", e.target.value)}
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(index, "price", parseFloat(e.target.value) || 0)}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={product.description}
                  onChange={(e) => updateProduct(index, "description", e.target.value)}
                  placeholder="Enter item description"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};