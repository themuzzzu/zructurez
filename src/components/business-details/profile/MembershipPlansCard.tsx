import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
}

interface MembershipPlansCardProps {
  plans: MembershipPlan[];
  onSelectPlan: (plan: MembershipPlan) => void;
  selectedPlan?: string;
  loading?: boolean;
}

export const MembershipPlansCard = ({ 
  plans, 
  onSelectPlan, 
  selectedPlan,
  loading 
}: MembershipPlansCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold mb-6">Membership Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`p-6 flex flex-col ${
              selectedPlan === plan.name 
                ? 'border-2 border-primary' 
                : 'border border-border'
            }`}
          >
            <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
            <div className="text-2xl font-bold mb-4">
              ₹{plan.price}
              {plan.price === 0 && <span className="text-sm font-normal">/Free</span>}
              {plan.price > 0 && <span className="text-sm font-normal">/month</span>}
            </div>
            <ul className="space-y-2 flex-grow mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => onSelectPlan(plan)}
              variant={selectedPlan === plan.name ? "default" : "outline"}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : (selectedPlan === plan.name ? "Selected" : "Choose Plan")}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
};