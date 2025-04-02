
import { useState, useEffect } from "react";
import { ProductFormProps } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SavedLabel } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LabelsAttributes = ({ formData, onChange }: ProductFormProps) => {
  const [newLabel, setNewLabel] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [selectedSavedLabel, setSelectedSavedLabel] = useState<string>("");

  // Fetch saved labels
  const { data: savedLabels, refetch: refetchSavedLabels } = useQuery({
    queryKey: ["saved-labels"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Using any to bypass TypeScript error due to custom schema types
      const { data, error } = await (supabase as any)
        .from("saved_product_labels")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching saved labels:", error);
        return [];
      }
      
      return data as SavedLabel[];
    },
  });

  // Add a new label
  const addLabel = () => {
    if (!newLabel.trim()) {
      toast.error("Please enter a valid label name");
      return;
    }

    const updatedLabels = [
      ...formData.labels,
      { name: newLabel.trim(), attributes: [] }
    ];
    
    onChange("labels", updatedLabels);
    setNewLabel("");
  };

  // Add attribute to a specific label
  const addAttribute = (labelIndex: number) => {
    if (!newAttribute.trim()) {
      toast.error("Please enter a valid attribute");
      return;
    }

    const updatedLabels = [...formData.labels];
    updatedLabels[labelIndex].attributes.push(newAttribute.trim());
    
    onChange("labels", updatedLabels);
    setNewAttribute("");
  };

  // Remove attribute from a label
  const removeAttribute = (labelIndex: number, attrIndex: number) => {
    const updatedLabels = [...formData.labels];
    updatedLabels[labelIndex].attributes.splice(attrIndex, 1);
    
    onChange("labels", updatedLabels);
  };

  // Remove a label
  const removeLabel = (labelIndex: number) => {
    const updatedLabels = [...formData.labels];
    updatedLabels.splice(labelIndex, 1);
    
    onChange("labels", updatedLabels);
  };

  // Save a label for future use
  const saveLabel = async (labelIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save labels");
        return;
      }

      const labelToSave = formData.labels[labelIndex];
      
      // Using any to bypass TypeScript error due to custom schema types
      const { error } = await (supabase as any)
        .from("saved_product_labels")
        .insert({
          user_id: user.id,
          name: labelToSave.name,
          attributes: labelToSave.attributes
        });

      if (error) throw error;
      
      toast.success("Label saved successfully!");
      refetchSavedLabels();
    } catch (error) {
      console.error("Error saving label:", error);
      toast.error("Failed to save label");
    }
  };

  // Load a saved label
  const loadSavedLabel = () => {
    if (!selectedSavedLabel || !savedLabels) return;
    
    const selectedLabel = savedLabels.find(label => label.id === selectedSavedLabel);
    if (!selectedLabel) return;
    
    // Add the saved label to the current list
    const updatedLabels = [
      ...formData.labels,
      { 
        name: selectedLabel.name, 
        attributes: selectedLabel.attributes 
      }
    ];
    
    onChange("labels", updatedLabels);
    setSelectedSavedLabel("");
    toast.success("Saved label added!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Labels & Attributes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add labels and attributes to your product to help buyers find what they're looking for
        </p>
        
        {/* Saved Labels Dropdown */}
        <div className="flex items-center gap-2 mb-4">
          <Select value={selectedSavedLabel} onValueChange={setSelectedSavedLabel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select saved label" />
            </SelectTrigger>
            <SelectContent>
              {savedLabels?.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name} ({label.attributes.length} attributes)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            variant="outline" 
            onClick={loadSavedLabel}
            disabled={!selectedSavedLabel}
          >
            Add Saved Label
          </Button>
        </div>
        
        {/* Add New Label */}
        <div className="flex items-center gap-2 mb-6">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Enter label name (e.g., Size, Color)"
            className="flex-1"
          />
          <Button type="button" onClick={addLabel} variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Label
          </Button>
        </div>
        
        {/* List of Labels */}
        {formData.labels.map((label, labelIndex) => (
          <div key={labelIndex} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{label.name}</h4>
                <Badge variant="outline">{label.attributes.length} attributes</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => saveLabel(labelIndex)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive"
                  onClick={() => removeLabel(labelIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add Attribute */}
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                placeholder="Add attribute (e.g., S, M, L, XL)"
                className="flex-1"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={() => addAttribute(labelIndex)}
              >
                Add
              </Button>
            </div>
            
            {/* Attributes List */}
            <div className="flex flex-wrap gap-2">
              {label.attributes.map((attr, attrIndex) => (
                <Badge key={attrIndex} variant="secondary" className="flex items-center gap-1">
                  {attr}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAttribute(labelIndex, attrIndex)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
