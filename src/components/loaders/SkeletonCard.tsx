
import React from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ui/shimmer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface SkeletonCardProps {
  imageHeight?: string;
  className?: string;
  withActions?: boolean;
  withFooter?: boolean;
}

export function SkeletonCard({
  imageHeight = "h-48",
  className,
  withActions = true,
  withFooter = true
}: SkeletonCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <Shimmer className={cn(imageHeight, "w-full")} rounded />
      
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Shimmer className="h-5 w-2/3" rounded />
          {withActions && <Shimmer className="h-8 w-8" circle />}
        </div>
        
        <Shimmer className="h-3 w-1/3" rounded />
        
        <div className="space-y-2">
          <Shimmer className="h-3 w-full" rounded />
          <Shimmer className="h-3 w-4/5" rounded />
        </div>
        
        <Shimmer className="h-5 w-1/4" rounded />
      </CardContent>
      
      {withFooter && (
        <CardFooter className="p-4 pt-0">
          <Shimmer className="h-9 w-full" rounded />
        </CardFooter>
      )}
    </Card>
  );
}
