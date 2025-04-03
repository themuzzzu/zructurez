
import { Layout } from "@/components/layout/Layout";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container max-w-7xl py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose the Perfect Plan for Your Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join Zructures today and get the visibility your business deserves
            with our range of affordable plans designed for every stage of growth.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm shadow-sm bg-background">
            <BadgeDollarSign className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">All plans include a 7-day free trial</span>
            <Button 
              variant="link" 
              className="text-primary ml-2"
              onClick={() => navigate("/register-business")}
            >
              Start Now
            </Button>
          </div>
        </div>

        <div className="mb-16">
          <PricingPlans />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-background rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold">Increased Visibility</h3>
            </div>
            <p className="text-muted-foreground">
              Get your business in front of thousands of potential customers looking for services like yours in your area.
            </p>
          </div>

          <div className="bg-background rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold">Direct Bookings</h3>
            </div>
            <p className="text-muted-foreground">
              Enable customers to book appointments directly through your business profile, reducing phone calls and increasing efficiency.
            </p>
          </div>

          <div className="bg-background rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold">Powerful Analytics</h3>
            </div>
            <p className="text-muted-foreground">
              Understand how customers find and interact with your business with our comprehensive analytics dashboard.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to take your business to the next level?</h2>
          <Button 
            size="lg" 
            className="animate-pulse"
            onClick={() => navigate("/register-business")}
          >
            Register Your Business Now
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
