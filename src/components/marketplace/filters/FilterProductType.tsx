
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FilterProductTypeProps {
  showDiscounted: boolean;
  onDiscountedChange: (checked: boolean) => void;
  showUsed: boolean;
  onUsedChange: (checked: boolean) => void;
  showBranded: boolean;
  onBrandedChange: (checked: boolean) => void;
}

export const FilterProductType = ({
  showDiscounted,
  onDiscountedChange,
  showUsed,
  onUsedChange,
  showBranded,
  onBrandedChange,
}: FilterProductTypeProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="discounted"
          checked={showDiscounted}
          onCheckedChange={onDiscountedChange}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="discounted" className="text-foreground">Discounted</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="used"
          checked={showUsed}
          onCheckedChange={onUsedChange}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="used" className="text-foreground">Used</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="branded"
          checked={showBranded}
          onCheckedChange={onBrandedChange}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="branded" className="text-foreground">Branded</Label>
      </div>
    </div>
  );
};
