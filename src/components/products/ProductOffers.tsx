
import React from "react";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Offer {
  title: string;
  description: string;
}

interface ProductOffersProps {
  offers: Offer[];
}

export const ProductOffers = ({ offers }: ProductOffersProps) => {
  if (!offers || offers.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {offers.map((offer, index) => (
        <Card key={index} className="p-3 bg-muted/40">
          <div className="flex items-start gap-3">
            <Gift className="h-4 w-4 text-primary mt-1" />
            <div>
              <p className="font-medium text-sm">{offer.title}</p>
              <p className="text-xs text-muted-foreground">{offer.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
