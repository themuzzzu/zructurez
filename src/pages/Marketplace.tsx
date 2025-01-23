import { Navbar } from "@/components/Navbar";
import { ShoppingSection } from "@/components/ShoppingSection";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <ShoppingSection />
      </div>
    </div>
  );
};

export default Marketplace;