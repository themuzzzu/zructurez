import { Card } from "@/components/ui/card";
import type { Business } from "@/types/business";

interface BusinessPortfolioSectionProps {
  portfolio: Business['business_portfolio'];
}

export const BusinessPortfolioSection = ({ portfolio }: BusinessPortfolioSectionProps) => {
  if (!portfolio?.length) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.map((item) => (
          <Card key={item.id} className="p-4 space-y-2">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};