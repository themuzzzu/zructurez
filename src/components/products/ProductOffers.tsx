
import { Tag, Percent, CreditCard, Gift } from "lucide-react";

type Offer = {
  title: string;
  description: string;
};

interface ProductOffersProps {
  offers: Offer[];
}

export const ProductOffers = ({ offers }: ProductOffersProps) => {
  // Get icon based on offer title
  const getOfferIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('bank') || lowerTitle.includes('emi') || lowerTitle.includes('credit')) {
      return <CreditCard className="h-4 w-4 text-orange-500 flex-shrink-0" />;
    }
    if (lowerTitle.includes('price') || lowerTitle.includes('off') || lowerTitle.includes('discount')) {
      return <Percent className="h-4 w-4 text-green-500 flex-shrink-0" />;
    }
    if (lowerTitle.includes('gift') || lowerTitle.includes('partner') || lowerTitle.includes('special')) {
      return <Gift className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
    return <Tag className="h-4 w-4 text-primary flex-shrink-0" />;
  };

  return (
    <div className="mt-2 space-y-2">
      {offers.map((offer, index) => (
        <div key={index} className="flex items-start gap-2 py-1.5">
          {getOfferIcon(offer.title)}
          <div>
            <span className="font-medium text-sm">{offer.title}: </span>
            <span className="text-sm text-muted-foreground">{offer.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
