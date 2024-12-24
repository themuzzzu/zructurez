import { Navbar } from "@/components/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCategoryFilter } from "@/components/BusinessCategoryFilter";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SAMPLE_BUSINESSES = [
  {
    id: "1",
    name: "Green Valley Medical Center",
    category: "Healthcare",
    description: "Full-service medical facility offering primary care and specialized treatments.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    rating: 4.8,
    reviews: 234,
    location: "123 Medical Drive",
    contact: "(555) 123-4567",
    hours: "Mon-Fri: 8AM-6PM",
    verified: true,
    serviceName: "General Consultation",
    cost: 150
  },
  {
    id: "2",
    name: "Elite Fitness Club",
    category: "Fitness",
    description: "State-of-the-art fitness center with personal training and group classes.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    rating: 4.7,
    reviews: 189,
    location: "456 Fitness Avenue",
    contact: "(555) 234-5678",
    hours: "Mon-Sun: 5AM-11PM",
    verified: true,
    serviceName: "Monthly Membership",
    cost: 75
  },
  {
    id: "3",
    name: "Sunshine Daycare",
    category: "Education",
    description: "Licensed childcare facility providing educational programs for children.",
    image: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=800",
    rating: 4.9,
    reviews: 156,
    location: "789 Education Lane",
    contact: "(555) 345-6789",
    hours: "Mon-Fri: 7AM-6PM",
    verified: true,
    serviceName: "Full-time Care",
    cost: 200
  }
];

const Business = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = SAMPLE_BUSINESSES.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold animate-fade-up">Local Businesses</h1>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Register Business
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <SearchInput
              placeholder="Search businesses by name, description, category, or location..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="max-w-xl"
            />
            <BusinessCategoryFilter />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;