import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCategoryFilter } from "@/components/ServiceCategoryFilter";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SAMPLE_SERVICES = [
  {
    id: "1",
    name: "Mike's Plumbing",
    provider: "Mike Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    category: "Plumbing",
    rating: 4.8,
    reviews: 156,
    description: "Licensed plumber with 15+ years experience. Available 24/7 for emergencies. Specializing in repairs, installations, and maintenance.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800",
    hourlyRate: 85,
    location: "Oak Street",
    availability: "Available Now"
  },
  {
    id: "2",
    name: "Elite Electrical Services",
    provider: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    category: "Electrical",
    rating: 4.9,
    reviews: 203,
    description: "Certified electrician offering residential and commercial services. Expert in wiring, installations, and electrical repairs.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    hourlyRate: 95,
    location: "Pine Avenue",
    availability: "Available Tomorrow"
  },
  {
    id: "3",
    name: "HandyTech Solutions",
    provider: "David Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    category: "Computer Repair",
    rating: 4.7,
    reviews: 89,
    description: "Professional IT support and computer repair services. Hardware upgrades, virus removal, and data recovery.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800",
    hourlyRate: 75,
    location: "Maple Drive",
    availability: "Available Now"
  },
  {
    id: "4",
    name: "Green Thumb Gardens",
    provider: "Emma Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    category: "Landscaping",
    rating: 4.6,
    reviews: 167,
    description: "Professional landscaping and garden maintenance. Design, planting, and lawn care services.",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
    hourlyRate: 65,
    location: "Cedar Lane",
    availability: "Next Week"
  }
];

const Services = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = SAMPLE_SERVICES.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-3xl font-bold animate-fade-up">Local Services</h1>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Cancel" : "List a Service"}
            </Button>
          </div>

          {showCreateForm ? (
            <CreateServiceForm />
          ) : (
            <>
              <div className="flex flex-col gap-6">
                <SearchInput
                  placeholder="Search services by name, description, or category..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="max-w-xl"
                />
                <ServiceCategoryFilter />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;