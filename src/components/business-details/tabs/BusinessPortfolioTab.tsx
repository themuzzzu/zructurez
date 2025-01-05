import { Card } from "@/components/ui/card";
import type { Business } from "@/types/business";

interface BusinessPortfolioTabProps {
  portfolio: Business['business_portfolio'];
}

export const BusinessPortfolioTab = ({ portfolio }: BusinessPortfolioTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Notable Works</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};