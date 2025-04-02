
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MenuType } from "@/types/menu";

interface StepOneProps {
  displayType: MenuType;
  updateFormData: (data: { displayType: MenuType }) => void;
}

export const StepOne = ({ displayType, updateFormData }: StepOneProps) => {
  const handleTypeChange = (value: MenuType) => {
    updateFormData({ displayType: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Display Type</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select whether you want to call it a "Menu" or a "List". This will be displayed throughout your business page.
        </p>
      </div>

      <RadioGroup 
        value={displayType} 
        onValueChange={(value) => handleTypeChange(value as MenuType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="flex items-start space-x-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="menu" id="menu" className="mt-1" />
          <div className="space-y-2 w-full">
            <Label htmlFor="menu" className="text-base font-medium cursor-pointer">Menu</Label>
            <p className="text-sm text-muted-foreground">
              Perfect for restaurants, cafes, and food-related businesses.
              Displays your items as a traditional menu with categories.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="list" id="list" className="mt-1" />
          <div className="space-y-2 w-full">
            <Label htmlFor="list" className="text-base font-medium cursor-pointer">List</Label>
            <p className="text-sm text-muted-foreground">
              Great for service businesses, stores, and non-food businesses.
              Displays your items as a categorized list.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
