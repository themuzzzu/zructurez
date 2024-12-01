import { Navbar } from "@/components/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCategoryFilter } from "@/components/BusinessCategoryFilter";
import { CreateBusinessListing } from "@/components/CreateBusinessListing";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Business = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
              <h1 className="text-3xl font-bold animate-fade-up">Business Directory</h1>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              List Your Business
            </Button>
          </div>
          
          <BusinessCategoryFilter />
          
          {showCreateForm && (
            <CreateBusinessListing 
              onClose={() => setShowCreateForm(false)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BUSINESSES.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SAMPLE_BUSINESSES = [
  {
    id: "1",
    name: "City General Hospital",
    category: "Healthcare",
    description: "24/7 emergency care and specialized medical services.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800",
    rating: 4.8,
    reviews: 156,
    location: "123 Medical Center Drive",
    contact: "+1 (555) 123-4567",
    hours: "Open 24/7",
    verified: true
  },
  {
    id: "2",
    name: "DriveRight Academy",
    category: "Driving School",
    description: "Professional driving instruction for all skill levels.",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800",
    rating: 4.9,
    reviews: 203,
    location: "456 Learning Lane",
    contact: "+1 (555) 234-5678",
    hours: "Mon-Sat: 8AM-6PM",
    verified: true
  },
  {
    id: "3",
    name: "The Golden Plate",
    category: "Restaurant",
    description: "Fine dining experience with international cuisine.",
    image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800",
    rating: 4.7,
    reviews: 89,
    location: "789 Dining Street",
    contact: "+1 (555) 345-6789",
    hours: "Tue-Sun: 11AM-10PM",
    verified: true
  }
];

export default Business;