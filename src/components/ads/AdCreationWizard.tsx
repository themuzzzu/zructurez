
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/ImageUpload";
import { LocationSelector } from "@/components/LocationSelector";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Check, 
  DollarSign, 
  Eye, 
  Image as ImageIcon, 
  MousePointer, 
  Sparkles, 
  Target, 
  Video 
} from "lucide-react";

export function AdCreationWizard({ onClose }: { onClose: () => void }) {
  const { data: currentUser } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [adType, setAdType] = useState<"product" | "banner" | "recommendation" | "ppc">("product");
  const [bidAmount, setBidAmount] = useState(100);
  const [dailyBudget, setDailyBudget] = useState(1000);
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [location, setLocation] = useState("All India");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [pricingModel, setPricingModel] = useState<"cpc" | "cpm">("cpc");
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [estimatedReach, setEstimatedReach] = useState(0);
  const [estimatedClicks, setEstimatedClicks] = useState(0);
  
  // Fetch user's products
  const { data: products = [] } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser && adType === "product"
  });
  
  // Fetch available ad placements
  const { data: placements = [] } = useQuery({
    queryKey: ['ad-placements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Filter placements by ad type
  const filteredPlacements = placements.filter(p => {
    if (adType === "product") return p.type === "sponsored";
    if (adType === "banner") return p.type === "banner";
    if (adType === "recommendation") return p.type === "recommendation";
    return true; // PPC shows all
  });
  
  // Update estimated reach and clicks when bid or budget changes
  const updateEstimates = () => {
    // In a real implementation, this would call an AI service to predict performance
    // For now, we'll use a simple formula
    const reach = dailyBudget * 10 * (1 + (bidAmount / 100));
    const clicks = reach * (0.01 + (bidAmount / 10000));
    
    setEstimatedReach(Math.round(reach));
    setEstimatedClicks(Math.round(clicks));
  };
  
  // Handle step navigation
  const nextStep = () => {
    if (step === 1 && !adType) {
      toast.error("Please select an ad type");
      return;
    }
    
    if (step === 2) {
      if (!adTitle) {
        toast.error("Please enter an ad title");
        return;
      }
      if (!adDescription) {
        toast.error("Please enter an ad description");
        return;
      }
      if (adType === "product" && !selectedProduct) {
        toast.error("Please select a product");
        return;
      }
      if ((adType === "banner" || adType === "recommendation") && !imageUrl) {
        toast.error("Please upload an image");
        return;
      }
    }
    
    if (step === 3) {
      updateEstimates();
    }
    
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Handle ad creation
  const handleCreateAd = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to create an ad");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // For now, we'll just simulate the ad creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Failed to create advertisement");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Advertisement</CardTitle>
          <CardDescription>
            Promote your products, services, or brand with targeted advertisements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="step-1" disabled={step !== 1}>
                1. Ad Type
              </TabsTrigger>
              <TabsTrigger value="step-2" disabled={step !== 2}>
                2. Ad Content
              </TabsTrigger>
              <TabsTrigger value="step-3" disabled={step !== 3}>
                3. Targeting
              </TabsTrigger>
              <TabsTrigger value="step-4" disabled={step !== 4}>
                4. Budget & Bidding
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="step-1" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all ${adType === "product" ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => setAdType("product")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Sponsored Product Ad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Promote your products in search results and category pages.
                      Increase visibility and drive more sales with product ads.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {adType === "product" && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </CardFooter>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all ${adType === "banner" ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => setAdType("banner")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Banner Advertisement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Large, eye-catching banner ads on homepage and category pages.
                      Perfect for brand awareness and promotional campaigns.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {adType === "banner" && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </CardFooter>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all ${adType === "recommendation" ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => setAdType("recommendation")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI Recommendation Ad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Appear in AI-powered recommendation sections.
                      Targeted to users most likely to be interested in your offerings.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {adType === "recommendation" && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </CardFooter>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all ${adType === "ppc" ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => setAdType("ppc")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MousePointer className="h-5 w-5 mr-2" />
                      Search Keywords PPC
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Bid on specific keywords to appear in search results.
                      Pay only when users click on your advertisement.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {adType === "ppc" && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="step-2" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ad-title">Ad Title</Label>
                  <Input
                    id="ad-title"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="Enter a compelling title for your ad"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ad-description">Ad Description</Label>
                  <Textarea
                    id="ad-description"
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    placeholder="Describe your product or service (50-150 characters recommended)"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                {adType === "product" && (
                  <div>
                    <Label htmlFor="product-select">Select Product</Label>
                    <Select 
                      value={selectedProduct} 
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger id="product-select" className="mt-1">
                        <SelectValue placeholder="Choose a product to promote" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {products.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        You don't have any products yet. Add products to your inventory first.
                      </p>
                    )}
                  </div>
                )}
                
                {(adType === "banner" || adType === "recommendation") && (
                  <div>
                    <Label>Upload Ad Image</Label>
                    <div className="mt-1">
                      <ImageUpload
                        selectedImage={imageUrl}
                        onImageSelect={setImageUrl}
                        skipAutoSave
                      />
                    </div>
                  </div>
                )}
                
                {adType === "banner" && (
                  <div>
                    <Label htmlFor="video-url">Video URL (Optional)</Label>
                    <Input
                      id="video-url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Enter URL of video (YouTube, Vimeo, etc.)"
                      className="mt-1"
                    />
                  </div>
                )}
                
                {adType === "ppc" && (
                  <div>
                    <Label htmlFor="keywords">Target Keywords</Label>
                    <Textarea
                      id="keywords"
                      value={targetKeywords}
                      onChange={(e) => setTargetKeywords(e.target.value)}
                      placeholder="Enter keywords separated by commas (e.g., phone, smartphone, mobile device)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="step-3" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Campaign Duration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Start Date</Label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">End Date</Label>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => !startDate || date < startDate}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Geographic Targeting</Label>
                  <LocationSelector 
                    value={location} 
                    onChange={setLocation}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Target Audience</Label>
                  <Card className="mt-2 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Age Groups</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["18-24", "25-34", "35-44", "45-54", "55+"].map(age => (
                            <Button
                              key={age}
                              type="button"
                              variant={targetAudience.includes(age) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (targetAudience.includes(age)) {
                                  setTargetAudience(prev => prev.filter(a => a !== age));
                                } else {
                                  setTargetAudience(prev => [...prev, age]);
                                }
                              }}
                            >
                              {age}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Interests</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Electronics", "Fashion", "Home", "Beauty", "Sports"].map(interest => (
                            <Button
                              key={interest}
                              type="button"
                              variant={targetAudience.includes(interest) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (targetAudience.includes(interest)) {
                                  setTargetAudience(prev => prev.filter(i => i !== interest));
                                } else {
                                  setTargetAudience(prev => [...prev, interest]);
                                }
                              }}
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {adType !== "ppc" && (
                  <div>
                    <Label>Ad Placement</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {filteredPlacements.map(placement => (
                        <Card 
                          key={placement.id}
                          className="cursor-pointer border-2 hover:border-primary p-4 transition-all"
                        >
                          <div className="font-medium">{placement.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {placement.location} - {placement.type}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs">
                              <span className="font-medium">CPM:</span> ₹{placement.cpm_rate} 
                              <span className="mx-2">|</span>
                              <span className="font-medium">CPC:</span> ₹{placement.cpc_rate}
                            </div>
                            <Button variant="outline" size="sm">Select</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="step-4" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bidding & Budget</CardTitle>
                  <CardDescription>
                    Set your budget and bidding strategy for this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Pricing Model</Label>
                    <RadioGroup 
                      defaultValue={pricingModel} 
                      onValueChange={(v) => setPricingModel(v as "cpc" | "cpm")}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cpc" id="cpc" />
                        <Label htmlFor="cpc" className="cursor-pointer">
                          <div className="font-medium">Cost Per Click (CPC)</div>
                          <div className="text-sm text-muted-foreground">
                            Pay only when users click on your ad
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cpm" id="cpm" />
                        <Label htmlFor="cpm" className="cursor-pointer">
                          <div className="font-medium">Cost Per Thousand Impressions (CPM)</div>
                          <div className="text-sm text-muted-foreground">
                            Pay based on the number of times your ad is shown
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bid-amount">Bid Amount (₹)</Label>
                      <span className="text-lg font-bold">₹{bidAmount}</span>
                    </div>
                    <Slider
                      id="bid-amount"
                      min={50}
                      max={500}
                      step={10}
                      value={[bidAmount]}
                      onValueChange={(values) => {
                        setBidAmount(values[0]);
                        updateEstimates();
                      }}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>₹50</span>
                      <span>₹500</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="daily-budget">Daily Budget (₹)</Label>
                      <span className="text-lg font-bold">₹{dailyBudget}</span>
                    </div>
                    <Slider
                      id="daily-budget"
                      min={500}
                      max={10000}
                      step={500}
                      value={[dailyBudget]}
                      onValueChange={(values) => {
                        setDailyBudget(values[0]);
                        updateEstimates();
                      }}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>₹500</span>
                      <span>₹10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Summary</CardTitle>
                  <CardDescription>
                    Review your campaign details before creating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Ad Type</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {adType === "product" && "Sponsored Product Ad"}
                        {adType === "banner" && "Banner Advertisement"}
                        {adType === "recommendation" && "AI Recommendation Ad"}
                        {adType === "ppc" && "Search Keywords PPC"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Campaign Dates</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {startDate && format(startDate, 'PPP')} - {endDate && format(endDate, 'PPP')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Pricing Model</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pricingModel === "cpc" ? "Cost Per Click (CPC)" : "Cost Per Thousand Impressions (CPM)"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center">
                        <Eye className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xl font-bold">{estimatedReach.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Estimated Monthly Reach</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MousePointer className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xl font-bold">{estimatedClicks.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Estimated Monthly Clicks</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <DollarSign className="h-5 w-5 text-muted-foreground mb-1 mx-auto" />
                      <span className="text-xl font-bold">
                        ₹{(dailyBudget * 30).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        Estimated Monthly Budget
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          
          {step < 4 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreateAd}
              disabled={isCreating}
            >
              {isCreating ? "Creating Ad..." : "Create Ad"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Ad Created Successfully
            </DialogTitle>
            <DialogDescription>
              Your ad has been created and will be reviewed shortly
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">{adTitle}</h3>
            <p className="text-sm text-muted-foreground">{adDescription}</p>
            <div className="flex justify-between items-center mt-4 text-sm">
              <span>Status: <Badge>Pending Review</Badge></span>
              <span>Budget: ₹{dailyBudget}/day</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                onClose();
              }}
            >
              View My Ads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper component for the card
function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
