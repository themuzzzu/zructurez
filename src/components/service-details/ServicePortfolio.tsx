import { Card } from "@/components/ui/card";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
}

interface ServicePortfolioProps {
  items: PortfolioItem[];
}

export const ServicePortfolio = ({ items }: ServicePortfolioProps) => {
  if (!items?.length) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 space-y-2">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <h3 className="font-semibold">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};