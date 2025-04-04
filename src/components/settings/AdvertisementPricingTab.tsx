
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AdSlot, AdSlotType } from '@/types/advertising';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, ShoppingBag, Briefcase, TrendingUp, 
  MapPin, Award, LayoutTemplate, Calendar, Lock, 
  Info, Check, AlertCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface AdTypeInfo {
  icon: React.ElementType;
  color: string;
}

const adTypeIcons: Record<string, AdTypeInfo> = {
  homepage_banner_1: { icon: Monitor, color: 'text-blue-500' },
  homepage_banner_2: { icon: LayoutTemplate, color: 'text-indigo-500' },
  sponsored_product: { icon: ShoppingBag, color: 'text-green-500' },
  sponsored_service: { icon: Briefcase, color: 'text-purple-500' },
  trending_boost: { icon: TrendingUp, color: 'text-orange-500' },
  featured_business_pin: { icon: Award, color: 'text-amber-500' },
  local_banner: { icon: MapPin, color: 'text-red-500' }
};

export const AdvertisementPricingTab = ({ businessId }: { businessId?: string }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [pricingType, setPricingType] = useState<'daily' | 'monthly' | 'exclusive'>('daily');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Fetch all available ad slots
  useEffect(() => {
    const fetchAdSlots = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('ad_placements')
          .select('*')
          .eq('active', true)
          .order('priority', { ascending: false });

        if (error) throw error;

        // Map database fields to AdSlot type
        const mappedSlots: AdSlot[] = (data || []).map(slot => ({
          id: slot.id,
          name: slot.name,
          type: slot.type,
          description: slot.description,
          daily_price: slot.type === 'homepage_banner_1' ? 600 :
                      slot.type === 'homepage_banner_2' ? 400 :
                      slot.type === 'sponsored_product' ? 150 :
                      slot.type === 'sponsored_service' ? 130 :
                      slot.type === 'trending_boost' ? 100 :
                      slot.type === 'featured_business_pin' ? 180 :
                      slot.type === 'local_banner' ? 100 : 100,
          monthly_price: slot.type === 'homepage_banner_1' ? 12000 :
                        slot.type === 'homepage_banner_2' ? 8000 :
                        slot.type === 'sponsored_product' ? 3000 :
                        slot.type === 'sponsored_service' ? 2500 :
                        slot.type === 'trending_boost' ? 2000 :
                        slot.type === 'featured_business_pin' ? 3500 :
                        slot.type === 'local_banner' ? 2000 : 2000,
          exclusive_price: slot.type === 'homepage_banner_1' ? 15000 :
                          slot.type === 'homepage_banner_2' ? 10000 :
                          slot.type === 'sponsored_product' ? 4500 :
                          slot.type === 'sponsored_service' ? 4000 :
                          slot.type === 'trending_boost' ? null :
                          slot.type === 'featured_business_pin' ? 5000 :
                          slot.type === 'local_banner' ? 3500 : null,
          position: slot.location || '',
          max_rotation_slots: 5, // Default value
          rotation_interval_seconds: 10, // Default value
          is_active: slot.active,
          
          // Include original database fields
          active: slot.active,
          cpc_rate: slot.cpc_rate,
          cpm_rate: slot.cpm_rate,
          created_at: slot.created_at,
          location: slot.location,
          max_size_kb: slot.max_size_kb,
          priority: slot.priority,
          size: slot.size
        }));

        setAdSlots(mappedSlots);
      } catch (error) {
        console.error('Error fetching ad slots:', error);
        toast.error('Failed to load advertisement slots');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdSlots();
  }, []);

  // Calculate price based on selected options
  useEffect(() => {
    if (!selectedSlot) {
      setCalculatedPrice(null);
      return;
    }

    let price = 0;

    if (pricingType === 'exclusive' && selectedSlot.exclusive_price) {
      price = selectedSlot.exclusive_price;
    } else if (pricingType === 'monthly') {
      price = selectedSlot.monthly_price;
    } else if (pricingType === 'daily') {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      price = selectedSlot.daily_price * days;
    }

    setCalculatedPrice(price);
  }, [selectedSlot, pricingType, dateRange]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const handleBookAdClick = () => {
    if (!selectedSlot) {
      toast.error('Please select an ad slot first');
      return;
    }
    
    if (!businessId && !user?.id) {
      toast.error('You need to be logged in as a business to book an ad');
      return;
    }
    
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !businessId || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the current authenticated user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast.error("You need to be logged in to create an ad campaign");
        setIsSubmitting(false);
        return;
      }

      // Determine dates based on pricing type
      let startDate, endDate;
      
      if (pricingType === 'monthly') {
        startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      } else {
        startDate = dateRange.from;
        endDate = dateRange.to;
      }
      
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      
      // Create ad campaign record
      const { error } = await supabase.from('advertisements').insert({
        user_id: currentUser.id,
        business_id: businessId,
        title: `${selectedSlot.name} Ad Campaign`,
        description: `Advertisement for ${selectedSlot.type}`,
        type: selectedSlot.type,
        reference_id: businessId, // Default to business ID
        format: 'standard',
        location: selectedSlot.position,
        budget: calculatedPrice || 0,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        status: 'pending',
        image_url: null, // Will be added later
      });

      if (error) throw error;
      
      setBookingConfirmed(true);
      toast.success('Advertisement booked successfully! Awaiting payment and approval.');
    } catch (error) {
      console.error('Error booking advertisement:', error);
      toast.error('Failed to book advertisement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSlotSelect = (slot: AdSlot) => {
    setSelectedSlot(slot);
    // Reset pricing type if exclusive is not available
    if (pricingType === 'exclusive' && !slot.exclusive_price) {
      setPricingType('daily');
    }
  };

  // Group slots by category for better display
  const groupedSlots = adSlots.reduce((acc, slot) => {
    const category = slot.type.split('_')[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push(slot);
    return acc;
  }, {} as Record<string, AdSlot[]>);
  
  // Categories in the order we want to display them
  const categoryOrder = ['homepage', 'sponsored', 'featured', 'trending', 'local'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advertisement Pricing & Booking</h2>
        <p className="text-muted-foreground">
          Promote your business with targeted advertisements
        </p>
      </div>
      
      <Separator />
      
      {/* Section 1: Available Ad Slots */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Ad Slots</h3>
        
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categoryOrder.map(category => {
              if (!groupedSlots[category]) return null;
              
              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-medium capitalize">{category} Advertisements</h4>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSlots[category].map(slot => {
                      const AdIcon = adTypeIcons[slot.type]?.icon || TrendingUp;
                      const iconColor = adTypeIcons[slot.type]?.color || 'text-gray-500';
                      
                      return (
                        <Card 
                          key={slot.id} 
                          className={`cursor-pointer transition-all ${
                            selectedSlot?.id === slot.id 
                              ? 'border-primary ring-1 ring-primary' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                                  <AdIcon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">{slot.name}</CardTitle>
                              </div>
                              {selectedSlot?.id === slot.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <CardDescription className="line-clamp-2">
                              {slot.description || `Advertisement placement in ${slot.position}`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-sm pb-2">
                            <div className="flex flex-wrap gap-2 text-xs mb-2">
                              <div className="bg-primary/10 text-primary rounded px-2 py-1">
                                {formatPrice(slot.daily_price)}/day
                              </div>
                              <div className="bg-primary/10 text-primary rounded px-2 py-1">
                                {formatPrice(slot.monthly_price)}/month
                              </div>
                              {slot.exclusive_price && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="bg-primary/10 text-primary rounded px-2 py-1 flex items-center gap-1">
                                      Exclusive: {formatPrice(slot.exclusive_price)}
                                      <Info className="h-3 w-3" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        Exclusive placement guarantees your ad will be the only one shown
                                        in this slot for the entire duration.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              Position: {slot.position}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="ghost" 
                              className="w-full text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSlotSelect(slot);
                              }}
                            >
                              {selectedSlot?.id === slot.id ? 'Selected' : 'Select This Slot'}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Section 2 & 3: Price Calculator & Booking Form */}
      {selectedSlot && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Book Your Advertisement</CardTitle>
            <CardDescription>
              {selectedSlot.name} - {selectedSlot.description || selectedSlot.position}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pricing Type Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Select Pricing Option</h4>
              <RadioGroup 
                value={pricingType} 
                onValueChange={(value) => setPricingType(value as 'daily' | 'monthly' | 'exclusive')}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Daily ({formatPrice(selectedSlot.daily_price)}/day)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Monthly ({formatPrice(selectedSlot.monthly_price)})
                  </Label>
                </div>
                
                {selectedSlot.exclusive_price && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exclusive" id="exclusive" />
                    <Label htmlFor="exclusive" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Exclusive ({formatPrice(selectedSlot.exclusive_price)})
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
            
            {/* Date Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Select Duration</h4>
              
              {pricingType === 'daily' ? (
                <div className="max-w-sm">
                  <DateRangePicker 
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    onUpdate={handleDateRangeChange}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Duration: {differenceInDays(dateRange.to, dateRange.from) + 1} days
                  </p>
                </div>
              ) : pricingType === 'monthly' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select 
                      className="border rounded p-2 bg-background"
                      value={selectedMonth.getMonth()}
                      onChange={(e) => {
                        const newDate = new Date(selectedMonth);
                        newDate.setMonth(parseInt(e.target.value));
                        setSelectedMonth(newDate);
                      }}
                    >
                      <option value="0">January</option>
                      <option value="1">February</option>
                      <option value="2">March</option>
                      <option value="3">April</option>
                      <option value="4">May</option>
                      <option value="5">June</option>
                      <option value="6">July</option>
                      <option value="7">August</option>
                      <option value="8">September</option>
                      <option value="9">October</option>
                      <option value="10">November</option>
                      <option value="11">December</option>
                    </select>
                    
                    <select
                      className="border rounded p-2 bg-background"
                      value={selectedMonth.getFullYear()}
                      onChange={(e) => {
                        const newDate = new Date(selectedMonth);
                        newDate.setFullYear(parseInt(e.target.value));
                        setSelectedMonth(newDate);
                      }}
                    >
                      {[0, 1, 2].map((offset) => {
                        const year = new Date().getFullYear() + offset;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your ad will run for the entire month
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Exclusive booking</span>: 
                    Your ad will be the only one shown in this slot for the selected duration.
                  </p>
                  <div className="mt-2 max-w-sm">
                    <DateRangePicker 
                      initialDateFrom={dateRange.from}
                      initialDateTo={dateRange.to}
                      onUpdate={handleDateRangeChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Price:</p>
              <p className="text-2xl font-bold">
                {calculatedPrice !== null ? formatPrice(calculatedPrice) : '-'}
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={handleBookAdClick} 
              className="sm:w-auto w-full"
            >
              Book Ad Now
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {bookingConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" /> Advertisement Booked Successfully!
                </DialogTitle>
                <DialogDescription>
                  Your ad booking is confirmed and awaiting approval.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md">
                  <p className="font-medium">Booking Summary:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>Ad Type: {selectedSlot?.name}</li>
                    <li>
                      Duration: {pricingType === 'monthly' 
                        ? format(selectedMonth, 'MMMM yyyy') 
                        : `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`}
                    </li>
                    <li>Pricing: {pricingType.charAt(0).toUpperCase() + pricingType.slice(1)}</li>
                    <li>Total: {calculatedPrice !== null ? formatPrice(calculatedPrice) : '-'}</li>
                  </ul>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  You can view the status of your advertisement in your business dashboard.
                </p>
              </div>
              
              <DialogFooter>
                <Button onClick={() => {
                  setIsDialogOpen(false);
                  setBookingConfirmed(false);
                }}>
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Advertisement Booking</DialogTitle>
                <DialogDescription>
                  Review the details below and confirm your ad booking.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <p className="text-sm font-medium">Ad Type:</p>
                  <p className="col-span-2">{selectedSlot?.name}</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p className="text-sm font-medium">Duration:</p>
                  <p className="col-span-2">
                    {pricingType === 'monthly' 
                      ? format(selectedMonth, 'MMMM yyyy') 
                      : `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`}
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p className="text-sm font-medium">Pricing:</p>
                  <p className="col-span-2 capitalize">{pricingType}</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p className="text-sm font-medium">Total:</p>
                  <p className="col-span-2 font-bold">
                    {calculatedPrice !== null ? formatPrice(calculatedPrice) : '-'}
                  </p>
                </div>
                
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md mt-2 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">This is a placeholder for payment</p>
                    <p className="text-xs">
                      In the production version, you'll be redirected to a payment gateway.
                      For now, we'll simply record your booking.
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertisementPricingTab;
