
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
  Info, Check, AlertCircle, Image as ImageIcon
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
  description: string;
  position: string;
  dailyPrice: number;
  monthlyPrice: number;
  exclusivePrice: number | null;
  previewImage?: string;
}

const adTypes: Record<string, AdTypeInfo> = {
  homepage_banner_1: {
    icon: Monitor,
    color: 'text-blue-500',
    description: 'Premium placement at the top hero section of the homepage',
    position: 'Top Hero Section',
    dailyPrice: 600,
    monthlyPrice: 12000,
    exclusivePrice: 15000,
    previewImage: '/lovable-uploads/f3f8aa48-7741-4ef4-b561-5578ab29cc38.png'
  },
  homepage_banner_2: {
    icon: LayoutTemplate,
    color: 'text-indigo-500',
    description: 'Prominent banner in the middle of the homepage',
    position: 'Mid Homepage',
    dailyPrice: 400,
    monthlyPrice: 8000,
    exclusivePrice: 10000
  },
  sponsored_product: {
    icon: ShoppingBag,
    color: 'text-green-500',
    description: 'Featured placement in the "Recommended for You" sections',
    position: 'Product Recommendations',
    dailyPrice: 150,
    monthlyPrice: 3000,
    exclusivePrice: 4500
  },
  sponsored_service: {
    icon: Briefcase,
    color: 'text-purple-500',
    description: 'Priority placement at the top of services sections',
    position: 'Services Section Top',
    dailyPrice: 130,
    monthlyPrice: 2500,
    exclusivePrice: 4000
  },
  trending_boost: {
    icon: TrendingUp,
    color: 'text-orange-500',
    description: 'Enhanced ranking in trending sections and feeds',
    position: 'Trending Sections',
    dailyPrice: 100,
    monthlyPrice: 2000,
    exclusivePrice: null
  },
  featured_business_pin: {
    icon: Award,
    color: 'text-amber-500',
    description: 'Priority placement at the top of business listings',
    position: 'Top of Business Listings',
    dailyPrice: 180,
    monthlyPrice: 3500,
    exclusivePrice: 5000
  },
  local_banner: {
    icon: MapPin,
    color: 'text-red-500',
    description: 'Targeted placement in city or locality-based feeds',
    position: 'Location-based Feeds',
    dailyPrice: 100,
    monthlyPrice: 2000,
    exclusivePrice: 3500
  }
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
  const [showPricingComparison, setShowPricingComparison] = useState(false);

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
          type: slot.type as AdSlotType,
          description: slot.description || adTypes[slot.type]?.description || '',
          daily_price: adTypes[slot.type]?.dailyPrice || 100,
          monthly_price: adTypes[slot.type]?.monthlyPrice || 2000,
          exclusive_price: adTypes[slot.type]?.exclusivePrice || null,
          position: slot.location || adTypes[slot.type]?.position || '',
          max_rotation_slots: 5,
          rotation_interval_seconds: 10,
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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Advertisement Pricing & Booking</h2>
          <p className="text-muted-foreground">
            Promote your business with targeted advertisements
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowPricingComparison(!showPricingComparison)}
        >
          {showPricingComparison ? "Hide Pricing Table" : "Compare All Pricing"}
        </Button>
      </div>
      
      <Separator />
      
      {showPricingComparison && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ad Pricing Comparison</CardTitle>
              <CardDescription>Compare pricing across all advertisement options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">Ad Type</th>
                      <th className="p-2 text-left font-medium">Position</th>
                      <th className="p-2 text-left font-medium">Daily Price</th>
                      <th className="p-2 text-left font-medium">Monthly Price</th>
                      <th className="p-2 text-left font-medium">Exclusive Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(adTypes).map(([type, info]) => (
                      <tr key={type} className="border-b border-muted hover:bg-muted/20">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${info.color.replace('text-', 'bg-')}/10`}>
                              <info.icon className={`h-3.5 w-3.5 ${info.color}`} />
                            </div>
                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                        </td>
                        <td className="p-2">{info.position}</td>
                        <td className="p-2">₹{info.dailyPrice.toLocaleString()}</td>
                        <td className="p-2">₹{info.monthlyPrice.toLocaleString()}</td>
                        <td className="p-2">{info.exclusivePrice ? `₹${info.exclusivePrice.toLocaleString()}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Exclusive pricing gives you sole placement in that ad position for the entire duration
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
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
          <div className="space-y-8">
            {categoryOrder.map(category => {
              if (!groupedSlots[category]) return null;
              
              return (
                <div key={category} className="space-y-4">
                  <h4 className="text-base font-medium capitalize mb-3">{category} Advertisements</h4>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSlots[category].map(slot => {
                      const adTypeInfo = adTypes[slot.type] || {
                        icon: TrendingUp,
                        color: 'text-gray-500',
                        description: slot.description || `Advertisement placement in ${slot.position}`,
                        position: slot.position
                      };
                      const AdIcon = adTypeInfo.icon;
                      const iconColor = adTypeInfo.color;
                      
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
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                                  <AdIcon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">{slot.name || slot.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</CardTitle>
                              </div>
                              {selectedSlot?.id === slot.id && (
                                <Check className="h-4 w-4 text-primary mt-1" />
                              )}
                            </div>
                            <CardDescription className="line-clamp-2">
                              {adTypeInfo.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 pb-2">
                            {adTypeInfo.previewImage && (
                              <div className="relative rounded-md overflow-hidden border bg-muted/30 h-32">
                                <img 
                                  src={adTypeInfo.previewImage} 
                                  alt={`${slot.type} placement example`} 
                                  className="object-contain w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs p-1 text-center">
                                  Sample placement
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Position:</p>
                              <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {adTypeInfo.position}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-xs">
                              <div className="bg-primary/10 text-primary rounded px-2 py-1 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatPrice(slot.daily_price)}/day
                              </div>
                              <div className="bg-primary/10 text-primary rounded px-2 py-1 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatPrice(slot.monthly_price)}/month
                              </div>
                              {slot.exclusive_price && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="bg-primary/10 text-primary rounded px-2 py-1 flex items-center gap-1">
                                      <Lock className="h-3 w-3" />
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
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant={selectedSlot?.id === slot.id ? "default" : "ghost"} 
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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Book Your Advertisement</CardTitle>
            <CardDescription>
              {selectedSlot.name} - {adTypes[selectedSlot.type]?.position || selectedSlot.position}
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

            {/* Price calculation display */}
            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <h4 className="text-sm font-medium">Price Calculation</h4>
              {pricingType === 'daily' ? (
                <div className="text-sm">
                  <p>₹{selectedSlot.daily_price.toLocaleString()}/day × {differenceInDays(dateRange.to, dateRange.from) + 1} days = <span className="font-semibold text-primary">₹{calculatedPrice?.toLocaleString()}</span></p>
                </div>
              ) : pricingType === 'monthly' ? (
                <div className="text-sm">
                  <p>Monthly rate for {format(selectedMonth, 'MMMM yyyy')}: <span className="font-semibold text-primary">₹{selectedSlot.monthly_price.toLocaleString()}</span></p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>Exclusive placement from {format(dateRange.from, 'MMM dd, yyyy')} to {format(dateRange.to, 'MMM dd, yyyy')}: <span className="font-semibold text-primary">₹{selectedSlot.exclusive_price?.toLocaleString()}</span></p>
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
      
      {/* Ad Placement Preview Section */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Advertisement Placement Examples</CardTitle>
            <CardDescription>Visual guide to where your ads will appear</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-md p-3 bg-muted/20">
                <div className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-500" />
                  Homepage Banner #1
                </div>
                <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-md border relative overflow-hidden">
                  <img 
                    src="/lovable-uploads/f3f8aa48-7741-4ef4-b561-5578ab29cc38.png" 
                    alt="Homepage Banner #1 Example" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <div className="bg-background/80 p-2 rounded text-xs">
                      Top Hero Section - Maximum Visibility
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-3 bg-muted/20">
                <div className="font-medium text-sm mb-1 flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4 text-indigo-500" />
                  Homepage Banner #2
                </div>
                <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-md border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/80 p-2 rounded text-xs">
                      Mid Homepage Banner
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-3 bg-muted/20">
                <div className="font-medium text-sm mb-1 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-green-500" />
                  Sponsored Product
                </div>
                <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-md border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/80 p-2 rounded text-xs">
                      Recommended Products Section
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
