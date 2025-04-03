
import { Layout } from "@/components/layout/Layout";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Star, Shield, Users, Medal, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Pricing = () => {
  const navigate = useNavigate();
  const [pricingType, setPricingType] = useState<"cards" | "comparison">("cards");

  return (
    <Layout>
      <div className="container max-w-7xl py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transparent Pricing for Every Business
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

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center rounded-lg border overflow-hidden">
            <Button 
              variant={pricingType === "cards" ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setPricingType("cards")}
            >
              Cards View
            </Button>
            <Button 
              variant={pricingType === "comparison" ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setPricingType("comparison")}
            >
              Comparison Table
            </Button>
          </div>
        </div>

        <div className="mb-16">
          <PricingPlans variant={pricingType} />
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-background p-8 rounded-lg mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Businesses Choose Zructures</h2>
              <p className="text-muted-foreground mb-6">
                Joining our platform connects you with customers actively searching for services like yours. Our powerful tools help you grow your business and manage your online presence effectively.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <span>Reach customers when they're actively searching for your services</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <span>Powerful booking tools to streamline your appointment scheduling</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <span>Comprehensive analytics to understand your business performance</span>
                </li>
              </ul>
              <Button 
                className="mt-6"
                onClick={() => navigate("/register-business")}
              >
                Register Your Business <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Increased Visibility</h3>
                </div>
                <p className="text-muted-foreground">
                  Get your business in front of thousands of potential customers looking for services like yours in your area.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="flex items-center mb-4">
                  <Medal className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Direct Bookings</h3>
                </div>
                <p className="text-muted-foreground">
                  Enable customers to book appointments directly through your business profile.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="flex items-center mb-4">
                  <BadgeDollarSign className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Membership Plans</h3>
                </div>
                <p className="text-muted-foreground">
                  Create recurring revenue with subscription plans for your loyal customers.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Trusted Platform</h3>
                </div>
                <p className="text-muted-foreground">
                  Join our community of verified businesses trusted by customers across India.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 text-left">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-lg mb-2">Can I upgrade my plan later?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade your plan at any time to get access to more features and increased visibility.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">All paid plans come with a 7-day free trial so you can test out all features before committing.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-lg mb-2">What is the transaction fee?</h3>
              <p className="text-muted-foreground">We charge a 7% commission on transactions processed through our platform. Early adopters lock in this rate for 1 year.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-lg mb-2">How do I get my first customers?</h3>
              <p className="text-muted-foreground">Once your business is live on Zructures, it will appear in search results for customers looking for your services in your area.</p>
            </div>
          </div>
          <Button 
            size="lg" 
            className="mt-8"
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
