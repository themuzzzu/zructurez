
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { ImageUpload } from "@/components/ImageUpload";
import { AdSlotSelector } from "./AdSlotSelector";
import { AdSlot, AdSlotType } from "@/types/advertising";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CalendarIcon, CircleDollarSign, Clock } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateAdCampaignProps {
  businessId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateAdCampaign = ({ businessId, onSuccess, onCancel }: CreateAdCampaignProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [pricingType, setPricingType] = useState<"daily" | "monthly" | "exclusive">("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch ad slots
  const { data: adSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ["ad-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data as AdSlot[];
    }
  });

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    const slot = adSlots.find(s => s.id === slotId) || null;
    setSelectedSlot(slot);
    
    // Reset pricing type if new slot doesn't support exclusive
    if (slot && slot.exclusive_price === null && pricingType === "exclusive") {
      setPricingType("daily");
    }
  };

  // Calculate campaign duration in days
  const durationDays = dateRange.from && dateRange.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1
    : 0;

  // Calculate total price based on duration and pricing type
  const calculateTotalPrice = () => {
    if (!selectedSlot) return 0;
    
    switch (pricingType) {
      case "daily":
        return selectedSlot.daily_price * durationDays;
      case "monthly":
        // Calculate proper monthly price with daily rate for partial months
        const fullMonths = Math.floor(durationDays / 30);
        const remainingDays = durationDays % 30;
        return (fullMonths * selectedSlot.monthly_price) + (remainingDays * selectedSlot.daily_price);
      case "exclusive":
        if (selectedSlot.exclusive_price === null) return 0;
        return selectedSlot.exclusive_price;
      default:
        return 0;
    }
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId || !selectedSlotId || !dateRange.from || !dateRange.to) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Format dates for database
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");

      const { error } = await supabase.from('advertisements').insert({
        business_id: businessId,
        title,
        description,
        type: selectedSlot?.type || 'sponsored_product',
        format: 'standard',
        reference_id: businessId, // We're using business_id as reference for now
        location: 'global', // Default location
        budget: totalPrice,
        start_date: startDate,
        end_date: endDate,
        image_url: imageUrl,
        status: 'pending',
        is_exclusive: pricingType === "exclusive"
      });

      if (error) throw error;
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating ad campaign:', error);
      toast.error("Failed to create ad campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create New Ad Campaign</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Ad Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your ad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Ad Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your advertisement briefly"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Ad Image</Label>
            <ImageUpload
              selectedImage={imageUrl}
              onImageSelect={setImageUrl}
              skipAutoSave
            />
            <p className="text-xs text-muted-foreground">
              Upload an image for your ad. Recommended size: 1200×628px
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Select Ad Placement</CardTitle>
              <CardDescription>Choose where your ad will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <AdSlotSelector 
                slots={adSlots}
                selectedSlotId={selectedSlotId}
                onSelect={handleSlotSelect}
                isLoading={isLoadingSlots}
              />
            </CardContent>
          </Card>

          {selectedSlot && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Campaign Details</CardTitle>
                <CardDescription>Set duration and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Duration</Label>
                  <div className="flex items-center gap-2 border rounded-md p-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <DateRangePicker 
                      initialDateFrom={dateRange.from}
                      initialDateTo={dateRange.to}
                      onUpdate={({ from, to }) => {
                        if (from && to) setDateRange({ from, to });
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 
                    Duration: {durationDays} day{durationDays !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Pricing Option</Label>
                  <RadioGroup
                    value={pricingType}
                    onValueChange={(value) => setPricingType(value as "daily" | "monthly" | "exclusive")}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="flex-1 cursor-pointer">
                        <div className="font-medium">Daily</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{selectedSlot.daily_price}/day
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                        <div className="font-medium">Monthly (Save 30%)</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{selectedSlot.monthly_price}/month
                        </div>
                      </Label>
                    </div>
                    
                    {selectedSlot.exclusive_price !== null && (
                      <div className="flex items-center space-x-2 border rounded-md p-3 border-primary/30 bg-primary/5">
                        <RadioGroupItem value="exclusive" id="exclusive" />
                        <Label htmlFor="exclusive" className="flex-1 cursor-pointer">
                          <div className="font-medium">Exclusive</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{selectedSlot.exclusive_price} (No rotation with other ads)
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="text-lg font-bold flex items-center">
                      <CircleDollarSign className="h-4 w-4 mr-1" />
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pricingType === "daily" ? (
                      <>₹{selectedSlot.daily_price}/day × {durationDays} days</>
                    ) : pricingType === "monthly" ? (
                      <>₹{selectedSlot.monthly_price}/month (discounted rate)</>
                    ) : (
                      <>Exclusive placement with no other ads</>
                    )}
                  </p>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
      
      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedSlot}>
          {isSubmitting ? "Creating..." : "Create Ad Campaign"}
        </Button>
      </div>
    </form>
  );
};
