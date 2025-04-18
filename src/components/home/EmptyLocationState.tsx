
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyLocationStateProps {
  onExpandRadius: () => void;
}

export function EmptyLocationState({ onExpandRadius }: EmptyLocationStateProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Nearby Businesses</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We couldn't find any businesses in your immediate area. 
          Try expanding your search radius to discover more options.
        </p>
        <Button onClick={onExpandRadius}>
          Expand Search Radius
        </Button>
      </CardContent>
    </Card>
  );
}
