import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container max-w-[1400px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Marketplace</h1>
          </div>

          <ShoppingSection />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;