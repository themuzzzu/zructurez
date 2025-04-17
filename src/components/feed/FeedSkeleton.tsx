
import React from "react";
import { Shimmer } from "@/components/ui/shimmer";
import { Card } from "@/components/ui/card";

interface FeedSkeletonProps {
  count?: number;
}

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Shimmer circle className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-16 w-full mt-2" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
