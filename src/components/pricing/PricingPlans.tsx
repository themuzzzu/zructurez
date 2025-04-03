
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, BadgeDollarSign, BadgePercent, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  highlighted?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  features: PlanFeature[];
  productLimit: number;
  serviceLimit: number;
  ctaText?: string;
  isLimited?: boolean;
  limitCount?: number;
  oneTime?: boolean;
  color?: string;
}

interface PricingPlansProps {
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string;
  showCTA?: boolean;
  compact?: boolean;
  variant?: "cards" | "comparison" | "minimal";
}

export const PricingPlans = ({ 
  onSelectPlan, 
  selectedPlan, 
  showCTA = true,
  compact = false,
  variant = "cards"
}: PricingPlansProps) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans: Plan[] = [
    {
      id: "early-supporter",
      name: "Early Supporter",
      description: "Only for 250 Users!",
      price: 50,
      isLimited: true,
      limitCount: 250,
      productLimit: 5,
      serviceLimit: 1,
      oneTime: true,
      color: "bg-gradient-to-r from-amber-100 to-amber-200",
      features: [
        { text: "List 5 Products, 1 Service" },
        { text: "Local Visibility - Show up in your colony/street searches" },
        { text: "Basic Analytics - See how many people viewed your business" },
        { text: "Customer Engagement - Receive messages from interested customers" },
        { text: "Business Profile Page - Your own page with business details" },
      ],
      ctaText: "Join Now",
    },
    {
      id: "basic",
      name: "Basic Plan",
      description: "Your Start, No Cost!",
      price: 100,
      oneTime: true,
      productLimit: 5,
      serviceLimit: 1,
      color: "bg-gradient-to-r from-blue-50 to-cyan-100",
      features: [
        { text: "All Early Supporter Plan features", highlighted: true },
        { text: "Business Enlisting - Be searchable on Zructures!" },
        { text: "Menu Feature - Showcase your food or service menu" },
        { text: "Improved Analytics - Track visits & engagement" },
        { text: "Better Visibility - Listed across your town for higher reach" },
      ],
      ctaText: "Get Started",
    },
    {
      id: "pro",
      name: "Pro Plan",
      description: "Your Business, Leveled Up!",
      price: 299,
      productLimit: 30,
      serviceLimit: 4,
      color: "bg-gradient-to-r from-violet-50 to-purple-100",
      features: [
        { text: "List 30 products, 4 services" },
        { text: "Bookings Enabled - Customers can reserve your services" },
        { text: "Subscription Plans - Offer membership deals & exclusive discounts" },
        { text: "Expanded Reach - Your business is shown town-wide!" },
        { text: "Follow Feature - Customers can follow you & get updates" },
        { text: "Flexible Listings - Convert unused product slots into services & vice versa" },
      ],
      ctaText: "Upgrade Now",
    },
    {
      id: "pro-plus",
      name: "Pro+ Plan",
      description: "Stand Out, Shine Bright!",
      price: 599,
      originalPrice: 799,
      isPopular: true,
      productLimit: 50,
      serviceLimit: 7,
      color: "bg-gradient-to-r from-fuchsia-50 to-fuchsia-100",
      features: [
        { text: "List 50 products, 7 services" },
        { text: "Advanced Analytics - See detailed insights, including sales trends" },
        { text: "Priority Listings - Appear at the top of searches" },
        { text: "City-Level Reach - Hyderabad, Bengaluru, and more!" },
      ],
      ctaText: "Go Premium",
    },
    {
      id: "master",
      name: "Master Plan",
      description: "Rule Your Market!",
      price: 1299,
      originalPrice: 1499,
      productLimit: 100,
      serviceLimit: 15,
      color: "bg-gradient-to-r from-emerald-50 to-teal-100",
      features: [
        { text: "List 100 products, 15 services" },
        { text: "Premium Visibility - Top-tier placement in search results" },
        { text: "Full Analytics - Understand customer trends & download reports" },
        { text: "Entire City & Tier-1 Region Coverage - Dominate your market" },
      ],
      ctaText: "Dominate Now",
    },
  ];

  const getAnnualPrice = (price: number) => {
    // 20% discount for annual billing
    return Math.round(price * 12 * 0.8);
  };

  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      toast.info("Please sign in to select a plan");
      navigate("/auth");
    }
  };

  if (variant === "comparison") {
    // Horizontal comparison table layout
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex justify-end mb-4 space-x-2">
          <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm bg-background">
            <span className={cn("mr-2", billingCycle === "monthly" ? "font-medium" : "text-muted-foreground")}>
              Monthly
            </span>
            <button 
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${billingCycle === "yearly" ? "bg-primary" : "bg-muted"}`}
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            >
              <span 
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"}`} 
              />
            </button>
            <span className={cn("ml-2", billingCycle === "yearly" ? "font-medium" : "text-muted-foreground")}>
              Yearly (20% off)
            </span>
          </div>
        </div>

        <div className="min-w-max">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-muted/30 rounded-tl-lg">
                  <span className="text-lg font-semibold">Plans & Features</span>
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className={cn("p-4 text-center", plan.id === "master" ? "rounded-tr-lg" : "", plan.isPopular ? "bg-primary/10" : "bg-muted/30")}>
                    {plan.isPopular && (
                      <Badge className="mb-2 bg-primary text-primary-foreground">Most Popular</Badge>
                    )}
                    <div className="text-lg font-semibold">{plan.name}</div>
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-2xl font-bold">
                        ₹{billingCycle === "yearly" && !plan.oneTime ? getAnnualPrice(plan.price) : plan.price}
                      </span>
                      {plan.oneTime ? (
                        <span className="text-xs text-muted-foreground ml-1">one-time</span>
                      ) : (
                        <span className="text-xs text-muted-foreground ml-1">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through mt-1">
                        ₹{billingCycle === "yearly" ? getAnnualPrice(plan.originalPrice) : plan.originalPrice}
                      </div>
                    )}
                    {showCTA && (
                      <Button
                        className="mt-3 w-full"
                        size="sm"
                        variant={selectedPlan === plan.id ? "secondary" : (plan.isPopular ? "default" : "outline")}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? "Selected" : plan.ctaText || "Choose Plan"}
                      </Button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 bg-muted/10 font-medium">Products & Services</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-products`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/5" : "bg-muted/10")}>
                    <div className="font-semibold">{plan.productLimit} Products</div>
                    <div className="font-semibold">{plan.serviceLimit} Services</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/20 font-medium">Visibility</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-visibility`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/10" : "bg-muted/20")}>
                    {plan.id === "early-supporter" && "Local (Colony/Street)"}
                    {plan.id === "basic" && "Town-wide"}
                    {plan.id === "pro" && "Town-wide+"}
                    {plan.id === "pro-plus" && "City-wide"}
                    {plan.id === "master" && "Multi-city & Region"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/10 font-medium">Analytics</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-analytics`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/5" : "bg-muted/10")}>
                    {plan.id === "early-supporter" && "Basic"}
                    {plan.id === "basic" && "Standard"}
                    {plan.id === "pro" && "Advanced"}
                    {plan.id === "pro-plus" && "Premium"}
                    {plan.id === "master" && "Complete"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/20 font-medium">Booking Capability</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-booking`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/10" : "bg-muted/20")}>
                    {plan.id === "early-supporter" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "basic" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro" && <Check className="inline h-5 w-5 text-green-500" />}
                    {plan.id === "pro-plus" && <Check className="inline h-5 w-5 text-green-500" />}
                    {plan.id === "master" && <Check className="inline h-5 w-5 text-green-500" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/10 font-medium">Subscription Plans</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-subscription`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/5" : "bg-muted/10")}>
                    {plan.id === "early-supporter" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "basic" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro" && <Check className="inline h-5 w-5 text-green-500" />}
                    {plan.id === "pro-plus" && <Check className="inline h-5 w-5 text-green-500" />}
                    {plan.id === "master" && <Check className="inline h-5 w-5 text-green-500" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/20 font-medium">Priority in Search</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-priority`} className={cn("p-4 text-center", plan.isPopular ? "bg-primary/10" : "bg-muted/20")}>
                    {plan.id === "early-supporter" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "basic" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro-plus" && <Check className="inline h-5 w-5 text-green-500" />}
                    {plan.id === "master" && <Check className="inline h-5 w-5 text-green-500" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 bg-muted/10 rounded-bl-lg font-medium">Export Reports</td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-reports`} className={cn("p-4 text-center", plan.id === "master" ? "rounded-br-lg" : "", plan.isPopular ? "bg-primary/5" : "bg-muted/10")}>
                    {plan.id === "early-supporter" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "basic" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "pro-plus" && <Check className="inline h-5 w-5 text-gray-400" />}
                    {plan.id === "master" && <Check className="inline h-5 w-5 text-green-500" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center mb-2">
            <BadgePercent className="h-4 w-4 mr-2" />
            <span>7% commission on transactions processed through Zructures</span>
          </div>
          <p className="max-w-2xl mx-auto">
            These pricing plans exist to cover infrastructure costs. When a business receives views and engagements, 
            our systems handle storage, search indexing, and analytics processing.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    // Compact, minimal version for embedding in other sections
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "border rounded-lg p-3 relative", 
                plan.isPopular ? "border-primary" : "border-border",
                hovered === plan.id ? "shadow-md" : ""
              )}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
              
              <h3 className="font-medium text-sm">{plan.name}</h3>
              <div className="flex items-baseline my-1">
                <span className="text-lg font-bold">₹{plan.price}</span>
                {plan.oneTime ? (
                  <span className="text-xs text-muted-foreground ml-1">one-time</span>
                ) : (
                  <span className="text-xs text-muted-foreground ml-1">/month</span>
                )}
              </div>

              <div className="text-xs text-muted-foreground mb-2">{plan.productLimit} products, {plan.serviceLimit} services</div>

              {showCTA && (
                <Button
                  variant={selectedPlan === plan.id ? "secondary" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : plan.ctaText || "Choose"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default card layout
  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 space-x-2">
        <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm bg-background">
          <span className={cn("mr-2", billingCycle === "monthly" ? "font-medium" : "text-muted-foreground")}>
            Monthly
          </span>
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${billingCycle === "yearly" ? "bg-primary" : "bg-muted"}`}
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          >
            <span 
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"}`} 
            />
          </button>
          <span className={cn("ml-2", billingCycle === "yearly" ? "font-medium" : "text-muted-foreground")}>
            Yearly (20% off)
          </span>
        </div>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'}`}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative p-5 flex flex-col h-full transition duration-300 ${
              plan.isPopular ? "border-primary border-2" : "border-border"
            } ${hovered === plan.id ? "shadow-lg transform -translate-y-1" : "shadow-sm"}`}
            onMouseEnter={() => setHovered(plan.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            
            {plan.isLimited && (
              <Badge variant="outline" className="absolute -top-2 -left-2 border-amber-500 text-amber-500">
                Limited Offer
              </Badge>
            )}

            <div className={`absolute right-0 top-0 w-24 h-24 opacity-10 rounded-bl-full ${plan.color || "bg-muted"}`}></div>

            <div className="mb-3">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">
                ₹{billingCycle === "yearly" && !plan.oneTime ? getAnnualPrice(plan.price) : plan.price}
              </span>
              {plan.oneTime ? (
                <span className="text-sm text-muted-foreground ml-1">one-time</span>
              ) : (
                <span className="text-sm text-muted-foreground ml-1">
                  /{billingCycle === "yearly" ? "year" : "month"}
                </span>
              )}
            </div>

            {plan.originalPrice && (
              <div className="mb-4 text-sm">
                <span className="line-through text-muted-foreground">
                  ₹{billingCycle === "yearly" ? getAnnualPrice(plan.originalPrice) : plan.originalPrice}
                </span>
                <span className="ml-2 text-green-500">
                  ₹{billingCycle === "yearly" 
                    ? getAnnualPrice(plan.originalPrice) - getAnnualPrice(plan.price)
                    : plan.originalPrice - plan.price} off
                </span>
              </div>
            )}

            <div className="flex space-x-2 mb-4">
              <BadgeDollarSign className="h-5 w-5 text-primary" />
              <div>
                <span className="font-semibold">{plan.productLimit} Products</span>
                <span className="text-muted-foreground"> & </span>
                <span className="font-semibold">{plan.serviceLimit} Services</span>
              </div>
            </div>

            <ul className={`space-y-2 mb-6 ${compact ? 'text-sm' : ''}`}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className={feature.highlighted ? "font-semibold" : ""}>{feature.text}</span>
                </li>
              ))}
            </ul>

            {plan.isLimited && (
              <div className="mb-4 text-xs text-amber-600">
                Limited to first {plan.limitCount} users! Once full, it will not be available again.
              </div>
            )}

            <div className="mt-auto">
              {showCTA && (
                <Button
                  className={`w-full transition-all duration-300 ${
                    hovered === plan.id ? "bg-primary-dark" : ""
                  } ${plan.isPopular ? "bg-primary hover:bg-primary/90" : ""}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={selectedPlan === plan.id ? "secondary" : "default"}
                >
                  {selectedPlan === plan.id ? "Selected" : plan.ctaText || "Choose Plan"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center mb-2">
          <BadgePercent className="h-4 w-4 mr-2" />
          <span>7% commission on transactions processed through Zructures</span>
        </div>
        <p>
          These pricing plans exist to cover infrastructure costs. When a business receives views and engagements, 
          our systems handle storage, search indexing, and analytics processing.
        </p>
      </div>
    </div>
  );
};
