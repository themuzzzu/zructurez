
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, XCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const PREDEFINED_CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "food", name: "Food" },
  { id: "beauty", name: "Beauty" },
  { id: "automotive", name: "Automotive" },
  { id: "clothing", name: "Clothing" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "homegoods", name: "Home Goods" },
  { id: "sports", name: "Sports & Fitness" },
  { id: "pets", name: "Pet Supplies" },
  { id: "toys", name: "Toys & Games" },
  { id: "jewelry", name: "Jewelry" },
  { id: "furniture", name: "Furniture" },
  { id: "books", name: "Books & Media" }
];

interface StepThreeProps {
  selectedCategory: string;
  customCategory: string;
  categories: Array<{id: string, name: string, is_custom: boolean}>;
  updateFormData: (data: {
    selectedCategory: string;
    customCategory: string;
    categories: Array<{id: string, name: string, is_custom: boolean}>;
  }) => void;
}

export const StepThree = ({
  selectedCategory,
  customCategory,
  categories,
  updateFormData
}: StepThreeProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategories, setCustomCategories] = useState<{id: string, name: string}[]>([]);
  const [newCustomCategory, setNewCustomCategory] = useState("");

  // Initialize categories if they're empty
  useEffect(() => {
    if (categories.length === 0) {
      updateFormData({
        selectedCategory,
        customCategory,
        categories: PREDEFINED_CATEGORIES.map(cat => ({
          ...cat,
          is_custom: false
        }))
      });
    } else {
      // Extract custom categories from the existing categories
      const existing = categories.filter(cat => cat.is_custom);
      setCustomCategories(existing);
    }
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    updateFormData({
      selectedCategory: categoryId,
      customCategory,
      categories
    });
    setShowCustomInput(categoryId === "custom");
  };

  const handleAddCustomCategory = () => {
    if (!newCustomCategory.trim()) return;
    
    const newId = uuidv4();
    const newCat = {
      id: newId,
      name: newCustomCategory,
      is_custom: true
    };
    
    const updatedCategories = [...categories, newCat];
    
    updateFormData({
      selectedCategory: newId,
      customCategory: newCustomCategory,
      categories: updatedCategories
    });
    
    setCustomCategories([...customCategories, {id: newId, name: newCustomCategory}]);
    setNewCustomCategory("");
  };

  const handleRemoveCustomCategory = (id: string) => {
    const updatedCustomCategories = customCategories.filter(c => c.id !== id);
    const updatedCategories = categories.filter(c => c.id !== id);
    
    setCustomCategories(updatedCustomCategories);
    
    updateFormData({
      selectedCategory: selectedCategory === id ? "" : selectedCategory,
      customCategory,
      categories: updatedCategories
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Category Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select a category for your items or create a custom one.
        </p>
      </div>

      <ScrollArea className="h-64 rounded-md border p-4">
        <RadioGroup 
          value={selectedCategory} 
          onValueChange={handleCategorySelect}
          className="space-y-3"
        >
          {categories
            .filter(cat => !cat.is_custom) // Show predefined categories
            .map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={category.id} />
                <Label htmlFor={category.id} className="cursor-pointer">{category.name}</Label>
              </div>
            ))}
          
          {/* Custom categories section */}
          {customCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Custom Categories</h4>
              {customCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={category.id} id={category.id} />
                    <Label htmlFor={category.id} className="cursor-pointer">{category.name}</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveCustomCategory(category.id)}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Custom Category button and input */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Add Custom Category</h4>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter custom category name"
                value={newCustomCategory}
                onChange={(e) => setNewCustomCategory(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleAddCustomCategory}
                disabled={!newCustomCategory.trim()}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </RadioGroup>
      </ScrollArea>
    </div>
  );
};
