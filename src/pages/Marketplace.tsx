import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, MessageSquare, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  seller: {
    name: string;
    avatar: string;
  };
  location: string;
  postedAt: string;
}

const SAMPLE_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    title: "Vintage Dining Table Set",
    price: 350,
    description: "Beautiful solid wood dining table with 6 chairs. Minor wear but great condition overall. Perfect for family gatherings.",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800",
    seller: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    location: "Oak Street",
    postedAt: "2 days ago"
  },
  {
    id: "2",
    title: "Mountain Bike",
    price: 275,
    description: "Trek mountain bike, 21-speed, recently tuned up. Great for trails or commuting.",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800",
    seller: {
      name: "Mike Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    location: "Pine Avenue",
    postedAt: "1 day ago"
  },
  {
    id: "3",
    title: "Garden Tools Set",
    price: 45,
    description: "Complete set of garden tools including shovel, rake, pruning shears, and more. All in good condition.",
    image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=800",
    seller: {
      name: "Emma Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    },
    location: "Maple Drive",
    postedAt: "3 hours ago"
  }
];

const Marketplace = () => {
  const handleContact = (itemId: string) => {
    toast.success("Message feature coming soon!");
  };

  const handleShare = (itemId: string) => {
    toast.success("Share feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container max-w-[1400px]">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Marketplace</h1>
            </div>
            <Button onClick={() => toast.info("New listing feature coming soon!")}>
              List an Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_ITEMS.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="text-lg font-bold text-primary">${item.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">{item.seller.name}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{item.location}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{item.postedAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleContact(item.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare(item.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
