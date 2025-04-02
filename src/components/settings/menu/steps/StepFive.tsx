
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Plus, Trash, Edit, Check, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { MenuType } from "@/types/menu";

interface Item {
  id: string;
  name: string;
  description: string;
  price: string;
  priceUnit: string;
  imageFile: File | null;
  imageUrl: string;
  availability: 'in_stock' | 'out_of_stock';
  subcategoryId: string;
}

interface StepFiveProps {
  items: Item[];
  subcategories: Array<{id: string, categoryId: string, name: string}>;
  categories: Array<{id: string, name: string, is_custom: boolean}>;
  updateFormData: (data: { items: Item[] }) => void;
  displayType: MenuType;
}

export const StepFive = ({
  items,
  subcategories,
  categories,
  updateFormData,
  displayType
}: StepFiveProps) => {
  const [currentItem, setCurrentItem] = useState<Item>({
    id: "",
    name: "",
    description: "",
    price: "",
    priceUnit: "₹",
    imageFile: null,
    imageUrl: "",
    availability: 'in_stock',
    subcategoryId: subcategories.length > 0 ? subcategories[0].id : ""
  });
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    subcategories.length > 0 ? subcategories[0].id : ""
  );

  // Function to get subcategory data with category name
  const getSubcategoryWithCategory = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return { subcategoryName: "Unknown", categoryName: "Unknown" };
    
    const category = categories.find(c => c.id === subcategory.categoryId);
    
    return {
      subcategoryName: subcategory.name,
      categoryName: category ? category.name : "Unknown"
    };
  };

  const handleAddItem = () => {
    if (!currentItem.name.trim()) return;
    
    const newItem = {
      ...currentItem,
      id: uuidv4(),
      subcategoryId: selectedSubcategoryId
    };
    
    updateFormData({
      items: [...items, newItem]
    });
    
    // Reset form
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      price: "",
      priceUnit: "₹",
      imageFile: null,
      imageUrl: "",
      availability: 'in_stock',
      subcategoryId: selectedSubcategoryId
    });
  };

  const handleEditItem = (item: Item) => {
    setEditingItemId(item.id);
    setCurrentItem(item);
  };

  const handleUpdateItem = () => {
    if (!editingItemId) return;
    
    const updatedItems = items.map(item => 
      item.id === editingItemId ? {...currentItem, id: editingItemId} : item
    );
    
    updateFormData({ items: updatedItems });
    
    // Reset editing state
    setEditingItemId(null);
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      price: "",
      priceUnit: "₹",
      imageFile: null,
      imageUrl: "",
      availability: 'in_stock',
      subcategoryId: selectedSubcategoryId
    });
  };

  const handleDeleteItem = (id: string) => {
    updateFormData({
      items: items.filter(item => item.id !== id)
    });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      price: "",
      priceUnit: "₹",
      imageFile: null,
      imageUrl: "",
      availability: 'in_stock',
      subcategoryId: selectedSubcategoryId
    });
  };

  // Filter items by selected subcategory
  const filteredItems = items.filter(item => 
    selectedSubcategoryId ? item.subcategoryId === selectedSubcategoryId : true
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          {displayType === 'menu' ? 'Menu' : 'List'} Items
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add items to your {displayType === 'menu' ? 'menu' : 'list'} with details like name, description, price, and images.
        </p>
      </div>

      <div className="space-y-4">
        {subcategories.length > 0 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="subcategorySelect">Select Subcategory</Label>
              <Select
                value={selectedSubcategoryId}
                onValueChange={setSelectedSubcategoryId}
              >
                <SelectTrigger id="subcategorySelect">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => {
                    const category = categories.find(c => c.id === subcategory.categoryId);
                    return (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {category?.name} - {subcategory.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Card className="border p-4">
              <CardContent className="p-0 space-y-4">
                <h4 className="font-medium">
                  {editingItemId ? "Edit Item" : "Add New Item"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                      placeholder="Enter item name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemPrice">Price</Label>
                    <div className="flex gap-2">
                      <Select
                        value={currentItem.priceUnit}
                        onValueChange={(value) => setCurrentItem({...currentItem, priceUnit: value})}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="₹" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="₹">₹</SelectItem>
                          <SelectItem value="$">$</SelectItem>
                          <SelectItem value="€">€</SelectItem>
                          <SelectItem value="£">£</SelectItem>
                          <SelectItem value="¥">¥</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        id="itemPrice"
                        type="number"
                        value={currentItem.price}
                        onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Description</Label>
                  <Textarea
                    id="itemDescription"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentItem.availability === 'in_stock'}
                      onCheckedChange={(checked) => setCurrentItem({
                        ...currentItem, 
                        availability: checked ? 'in_stock' : 'out_of_stock'
                      })}
                    />
                    <Label>
                      {currentItem.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Item Image (optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a small image (max 50KB) to display alongside your item
                  </p>
                  <ImageUpload
                    selectedImage={currentItem.imageUrl}
                    onImageSelect={(image) => {
                      if (image) {
                        setCurrentItem({...currentItem, imageUrl: image});
                      } else {
                        setCurrentItem({...currentItem, imageUrl: "", imageFile: null});
                      }
                    }}
                    skipAutoSave
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {editingItemId ? (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateItem}>
                        <Check className="h-4 w-4 mr-2" />
                        Update Item
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAddItem} disabled={!currentItem.name.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h4 className="font-medium mb-4">
                {filteredItems.length > 0 
                  ? `Items in ${subcategories.find(s => s.id === selectedSubcategoryId)?.name || ""}`
                  : "No items yet"}
              </h4>
              
              <ScrollArea className="h-96 rounded-md border">
                {filteredItems.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {filteredItems.map((item) => {
                      const { subcategoryName, categoryName } = getSubcategoryWithCategory(item.subcategoryId);
                      
                      return (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex justify-between items-start p-4">
                            <div className="flex gap-4">
                              {item.imageUrl && (
                                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              )}
                              
                              <div className="space-y-1">
                                <h5 className="font-semibold">{item.name}</h5>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                )}
                                {item.price && (
                                  <p className="font-medium">{item.priceUnit}{item.price}</p>
                                )}
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                                    item.availability === 'in_stock' ? 'bg-green-500' : 'bg-red-500'
                                  }`}></span>
                                  {item.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {categoryName} &gt; {subcategoryName}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No items added to this subcategory yet
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('itemName')?.focus()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add an Item
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border rounded-md p-4">
            <p className="text-muted-foreground text-center mb-4">
              No subcategories available. Please go back and add subcategories first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
