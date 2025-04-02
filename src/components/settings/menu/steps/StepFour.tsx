
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface StepFourProps {
  categories: Array<{id: string, name: string, is_custom: boolean}>;
  subcategories: Array<{id: string, categoryId: string, name: string}>;
  updateFormData: (data: {
    subcategories: Array<{id: string, categoryId: string, name: string}>;
  }) => void;
}

export const StepFour = ({
  categories,
  subcategories,
  updateFormData
}: StepFourProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;
    
    const newSubcategory = {
      id: uuidv4(),
      categoryId: selectedCategoryId,
      name: newSubcategoryName.trim()
    };
    
    updateFormData({
      subcategories: [...subcategories, newSubcategory]
    });
    
    setNewSubcategoryName("");
  };

  const handleRemoveSubcategory = (id: string) => {
    updateFormData({
      subcategories: subcategories.filter(s => s.id !== id)
    });
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredSubcategories = subcategories.filter(s => s.categoryId === selectedCategoryId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Subcategory Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create subcategories for your items. For example, if your category is "Food", 
          subcategories might be "Starters", "Main Course", and "Desserts".
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categorySelect">Select Category</Label>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger id="categorySelect">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategoryId && (
          <>
            <div className="space-y-2">
              <Label>Subcategories for {selectedCategory?.name}</Label>
              
              <div className="flex gap-3 mb-2">
                <Input
                  placeholder="Enter subcategory name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                />
                <Button 
                  onClick={handleAddSubcategory}
                  disabled={!newSubcategoryName.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <ScrollArea className="h-64 rounded-md border p-4">
                {filteredSubcategories.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSubcategories.map((subcategory) => (
                      <div 
                        key={subcategory.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                      >
                        <span>{subcategory.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveSubcategory(subcategory.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No subcategories yet. Add one above.</p>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <h4 className="font-medium mb-2">Subcategory Examples</h4>
              <p className="text-sm text-muted-foreground">
                {selectedCategory?.name === "Food" && "Starters, Main Course, Desserts, Beverages, Specials"}
                {selectedCategory?.name === "Electronics" && "Mobiles, Laptops, Audio, Accessories, Cameras"}
                {selectedCategory?.name === "Beauty" && "Skincare, Makeup, Hair, Fragrance, Nail Care"}
                {selectedCategory?.name === "Clothing" && "Casual Wear, Formal Wear, Seasonal, Accessories, Footwear"}
                {selectedCategory?.name !== "Food" && 
                 selectedCategory?.name !== "Electronics" && 
                 selectedCategory?.name !== "Beauty" && 
                 selectedCategory?.name !== "Clothing" && 
                 "Type A, Type B, Popular Items, New Arrivals, Special Items"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
