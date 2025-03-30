
import { Gift, Percent, CreditCard, Tag } from "lucide-react";

interface Offer {
  title: string;
  description: string;
}

interface ProductOffersProps {
  offers: Offer[];
}

export const ProductOffers = ({ offers }: ProductOffersProps) => {
  // Function to get the appropriate icon for an offer
  const getOfferIcon = (title: string) => {
    if (title.toLowerCase().includes('bank')) return <CreditCard className="h-4 w-4 text-orange-500" />;
    if (title.toLowerCase().includes('special price') || title.toLowerCase().includes('discount')) return <Percent className="h-4 w-4 text-orange-500" />;
    if (title.toLowerCase().includes('gift') || title.toLowerCase().includes('free')) return <Gift className="h-4 w-4 text-orange-500" />;
    return <Tag className="h-4 w-4 text-orange-500" />;
  };

  return (
    <ul className="mt-2 space-y-2">
      {offers.map((offer, index) => (
        <li key={index} className="flex items-start gap-2">
          {getOfferIcon(offer.title)}
          <div>
            <span className="font-medium text-sm">{offer.title}: </span>
            <span className="text-sm text-muted-foreground">{offer.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
