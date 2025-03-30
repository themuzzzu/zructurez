import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Image as ImageIcon, 
  Shield, 
  Check, 
  Plus, 
  Trash2, 
  AlertCircle, 
  PlusCircle
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { BusinessFormValues } from "../BusinessRegistrationForm";
import { formatCurrency } from "../utils";

export const FinalSubmitStep = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<BusinessFormValues>();
  const [showMembershipPlans, setShowMembershipPlans] = useState(false);
  const [tempPlan, setTempPlan] = useState({
    name: "",
    price: "",
    description: "",
    features: [""] as string[]
  });
  
  const formValues = watch();
  const membershipPlans = watch("membership_plans") || [];
  
  const handleAddFeature = () => {
    setTempPlan(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };
  
  const handleUpdateFeature = (index: number, value: string) => {
    setTempPlan(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return {
        ...prev,
        features: newFeatures
      };
    });
  };
  
  const handleRemoveFeature = (index: number) => {
    setTempPlan(prev => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return {
        ...prev,
        features: newFeatures
      };
    });
  };
  
  const handleAddPlan = () => {
    if (!tempPlan.name || !tempPlan.price) {
      toast.error("Plan name and price are required");
      return;
    }
    
    const priceNumber = parseFloat(tempPlan.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error("Price must be a valid positive number");
      return;
    }
    
    // Filter out empty features
    const filteredFeatures = tempPlan.features.filter(f => f.trim() !== "");
    
    const newPlan = {
      name: tempPlan.name,
      price: priceNumber,
      description: tempPlan.description,
      features: filteredFeatures
    };
    
    const updatedPlans = [...membershipPlans, newPlan];
    setValue("membership_plans", updatedPlans);
    
    // Reset the temp plan
    setTempPlan({
      name: "",
      price: "",
      description: "",
      features: [""]
    });
    
    toast.success("Membership plan added");
  };
  
  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...membershipPlans];
    updatedPlans.splice(index, 1);
    setValue("membership_plans", updatedPlans);
    toast.success("Membership plan removed");
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Check className="mr-2 h-5 w-5 text-primary" />
        Final Details & Submit
      </h2>
      <p className="text-muted-foreground mb-6">
        Upload a business image, add optional membership plans, and submit your registration.
      </p>
      
      {/* Business Image Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" /> Business Image
          </h3>
          
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Business Image <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="mt-2">
                    <ImageUpload
                      selectedImage={field.value}
                      onImageSelect={(image) => {
                        field.onChange(image);
                      }}
                      initialScale={1}
                      initialPosition={{ x: 50, y: 50 }}
                      skipAutoSave={true}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a high-quality image that represents your business. This will be the main image displayed on your business profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Membership Plans Section (Optional) */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4" /> Membership Plans (Optional)
            </h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMembershipPlans(!showMembershipPlans)}
            >
              {showMembershipPlans ? "Hide Plans" : "Add Plans"}
            </Button>
          </div>
          
          {showMembershipPlans && (
            <div className="space-y-6">
              {/* Existing Plans */}
              {membershipPlans.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-base font-medium">Your Membership Plans</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {membershipPlans.map((plan, index) => (
                      <div key={index} className="border rounded-lg p-4 relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleRemovePlan(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <h5 className="font-semibold text-lg mb-1">{plan.name}</h5>
                        <div className="text-xl font-bold mb-2 text-primary">
                          {formatCurrency(plan.price)}
                        </div>
                        
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {plan.description}
                          </p>
                        )}
                        
                        {plan.features && plan.features.length > 0 && (
                          <ul className="space-y-1">
                            {plan.features.map((feature, fidx) => (
                              <li key={fidx} className="text-sm flex items-start">
                                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Plan Form */}
              <div className="border rounded-lg p-4 mt-6">
                <h4 className="text-base font-medium mb-4">Add New Membership Plan</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Plan Name <span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="e.g., Basic, Premium, Pro"
                        value={tempPlan.name}
                        onChange={(e) => setTempPlan({...tempPlan, name: e.target.value})}
                      />
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel>Price (₹) <span className="text-red-500">*</span></FormLabel>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tempPlan.price}
                        onChange={(e) => setTempPlan({...tempPlan, price: e.target.value})}
                      />
                    </FormItem>
                  </div>
                  
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Brief description of what this plan offers"
                      value={tempPlan.description}
                      onChange={(e) => setTempPlan({...tempPlan, description: e.target.value})}
                      className="min-h-[80px]"
                    />
                  </FormItem>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Features</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFeature}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Feature
                      </Button>
                    </div>
                    
                    {tempPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => handleUpdateFeature(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                          disabled={tempPlan.features.length <= 1}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={handleAddPlan}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!showMembershipPlans && (
            <div className="py-4 text-center text-muted-foreground">
              <p>You can add optional membership plans that customers can subscribe to.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => setShowMembershipPlans(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Membership Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Review & Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" /> Review & Submit
          </h3>
          
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Registration Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="font-medium">Business Name:</span> {formValues.name}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {formValues.category}
                </div>
                <div>
                  <span className="font-medium">Appointment Price:</span> {formatCurrency(formValues.appointment_price || 0)}
                </div>
                <div>
                  <span className="font-medium">Consultation Price:</span> {formatCurrency(formValues.consultation_price || 0)}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formValues.location}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {formValues.contact}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Business Hours:</span> {formValues.hours}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Owners:</span> {formValues.owners.map(o => o.name).join(", ")}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Staff Members:</span> {formValues.staff_details && formValues.staff_details.length > 0 
                    ? formValues.staff_details.map(s => s.name).join(", ") 
                    : "None added"}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Membership Plans:</span> {membershipPlans.length > 0 
                    ? membershipPlans.map(p => p.name).join(", ") 
                    : "None added"}
                </div>
              </div>
            </div>
            
            <FormField
              control={control}
              name="agree_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the Terms and Conditions <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>
                      By registering your business, you agree to our terms of service and privacy policy.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
