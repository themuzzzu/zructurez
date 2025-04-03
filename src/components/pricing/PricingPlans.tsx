
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, BadgeDollarSign, BadgePercent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
}

interface PricingPlansProps {
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string;
  showCTA?: boolean;
  compact?: boolean;
}

export const PricingPlans = ({ 
  onSelectPlan, 
  selectedPlan, 
  showCTA = true,
  compact = false 
}: PricingPlansProps) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

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
      features: [
        { text: "List 100 products, 15 services" },
        { text: "Premium Visibility - Top-tier placement in search results" },
        { text: "Full Analytics - Understand customer trends & download reports" },
        { text: "Entire City & Tier-1 Region Coverage - Dominate your market" },
      ],
      ctaText: "Dominate Now",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      toast.info("Please sign in to select a plan");
      navigate("/auth");
    }
  };

  return (
    <div className="w-full">
      <div className={`grid ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'}`}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative p-6 flex flex-col h-full transition duration-300 ${
              plan.isPopular ? "border-primary border-2" : "border-border"
            } ${hovered === plan.id ? "shadow-lg transform -translate-y-1" : "shadow-md"}`}
            onMouseEnter={() => setHovered(plan.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground hover:bg-primary">
                Most Popular
              </Badge>
            )}
            
            {plan.isLimited && (
              <Badge variant="outline" className="absolute -top-2 -left-2 border-amber-500 text-amber-500">
                Limited Offer
              </Badge>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">₹{plan.price}</span>
              {plan.oneTime ? (
                <span className="text-sm text-muted-foreground ml-1">one-time</span>
              ) : (
                <span className="text-sm text-muted-foreground ml-1">/month</span>
              )}
            </div>

            {plan.originalPrice && (
              <div className="mb-4 text-sm">
                <span className="line-through text-muted-foreground">₹{plan.originalPrice}</span>
                <span className="ml-2 text-green-500">₹{plan.originalPrice - plan.price} off</span>
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
