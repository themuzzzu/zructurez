import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { MembershipPlan } from "@/types/membership";

interface BusinessMembershipPlansProps {
  plans: MembershipPlan[];
  onChange: (plans: MembershipPlan[]) => void;
}

export const BusinessMembershipPlans = ({ plans, onChange }: BusinessMembershipPlansProps) => {
  const addPlan = () => {
    onChange([...plans, { name: "", price: 0, features: [], description: "" }]);
  };

  const removePlan = (index: number) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    onChange(newPlans);
  };

  const updatePlan = (index: number, field: keyof MembershipPlan, value: any) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onChange(newPlans);
  };

  const updateFeatures = (index: number, featuresText: string) => {
    const features = featuresText.split('\n').filter(f => f.trim() !== '');
    updatePlan(index, 'features', features);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">Membership Plans</Label>
        <Button type="button" onClick={addPlan} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid gap-6">
        {plans.map((plan, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <Label>Plan Name</Label>
                  <Input
                    value={plan.name}
                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                    placeholder="e.g., Basic, Premium, Pro"
                  />
                </div>
                
                <div>
                  <Label>Price (₹/month)</Label>
                  <Input
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePlan(index, 'price', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={plan.description}
                    onChange={(e) => updatePlan(index, 'description', e.target.value)}
                    placeholder="Describe what this plan offers"
                  />
                </div>

                <div>
                  <Label>Features (one per line)</Label>
                  <Textarea
                    value={plan.features.join('\n')}
                    onChange={(e) => updateFeatures(index, e.target.value)}
                    placeholder="List the features included in this plan"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePlan(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};