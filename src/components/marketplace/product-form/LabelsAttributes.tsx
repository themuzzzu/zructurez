
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, X, Save, Tag } from "lucide-react";
import type { ProductFormProps, ProductLabelFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const LabelsAttributes = ({ formData, onChange }: ProductFormProps) => {
  const [newLabel, setNewLabel] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  
  // Fetch saved labels for the current user
  const { data: savedLabels, isLoading, refetch } = useQuery({
    queryKey: ['saved-labels'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_product_labels')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data || [];
    }
  });

  const addLabel = () => {
    if (!newLabel.trim()) return;
    
    const updatedLabels = [
      ...formData.labels,
      { name: newLabel, attributes: [] }
    ];
    
    onChange("labels", updatedLabels);
    setNewLabel("");
  };

  const removeLabel = (index: number) => {
    const updatedLabels = [...formData.labels];
    updatedLabels.splice(index, 1);
    onChange("labels", updatedLabels);
  };

  const addAttribute = (labelIndex: number) => {
    if (!newAttribute.trim()) return;
    
    const updatedLabels = [...formData.labels];
    if (!updatedLabels[labelIndex].attributes) {
      updatedLabels[labelIndex].attributes = [];
    }
    
    // Add attribute if it doesn't already exist
    if (!updatedLabels[labelIndex].attributes.includes(newAttribute)) {
      updatedLabels[labelIndex].attributes.push(newAttribute);
      onChange("labels", updatedLabels);
    }
    
    setNewAttribute("");
  };

  const removeAttribute = (labelIndex: number, attrIndex: number) => {
    const updatedLabels = [...formData.labels];
    updatedLabels[labelIndex].attributes.splice(attrIndex, 1);
    onChange("labels", updatedLabels);
  };

  const saveLabel = async (label: ProductLabelFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('saved_product_labels')
        .insert({
          name: label.name,
          attributes: label.attributes,
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast.success("Label saved successfully!");
      refetch();
    } catch (error) {
      console.error("Error saving label:", error);
      toast.error("Failed to save label");
    }
  };

  const useSavedLabel = (savedLabel: any) => {
    // Check if this label already exists in the form
    const labelExists = formData.labels.some(l => l.name === savedLabel.name);
    
    if (!labelExists) {
      const updatedLabels = [
        ...formData.labels,
        { 
          name: savedLabel.name, 
          attributes: savedLabel.attributes 
        }
      ];
      
      onChange("labels", updatedLabels);
      toast.success(`Added ${savedLabel.name} to product`);
    } else {
      toast.info("This label is already added to the product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Labels & Attributes</Label>
      </div>
      
      {/* Add new label */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add new label (e.g., Size, Color, Material)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <Button 
          type="button" 
          onClick={addLabel}
          variant="outline"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Saved labels section */}
      {savedLabels && savedLabels.length > 0 && (
        <div className="mb-4">
          <Label className="text-sm mb-2 block">Your Saved Labels</Label>
          <div className="flex flex-wrap gap-2">
            {savedLabels.map((label) => (
              <Badge 
                key={label.id} 
                variant="outline" 
                className="cursor-pointer px-3 py-1.5 flex gap-1.5 items-center hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => useSavedLabel(label)}
              >
                <Tag className="h-3.5 w-3.5" />
                {label.name} ({label.attributes.length})
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Active labels */}
      {formData.labels.length > 0 && (
        <div className="grid gap-4">
          {formData.labels.map((label, labelIndex) => (
            <Card key={labelIndex} className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{label.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {label.attributes.length} attributes
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => saveLabel(label)}
                    className="h-7 w-7"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLabel(labelIndex)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Add new attribute */}
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder={`Add attribute for ${label.name} (e.g., S, M, L)`}
                  value={editing === labelIndex ? newAttribute : ""}
                  onChange={(e) => {
                    setNewAttribute(e.target.value);
                    setEditing(labelIndex);
                  }}
                  className="text-sm h-8"
                />
                <Button 
                  type="button" 
                  onClick={() => addAttribute(labelIndex)}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>
              
              {/* Attributes list */}
              {label.attributes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {label.attributes.map((attr, attrIndex) => (
                    <Badge key={attrIndex} variant="outline" className="px-2 py-1">
                      {attr}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttribute(labelIndex, attrIndex)}
                        className="h-4 w-4 ml-1 hover:bg-transparent hover:text-destructive p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {formData.labels.length === 0 && (
        <div className="text-center py-6 border border-dashed rounded-md">
          <Tag className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Add labels like Size, Color, or Material to help buyers find your product
          </p>
        </div>
      )}
    </div>
  );
};
