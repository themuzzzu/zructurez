
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const MarketplacePromotions = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <h3 className="text-xl font-bold mb-2">New Customer?</h3>
          <p className="mb-4 opacity-90">Get 20% off your first order when you sign up!</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md text-black flex-1"
              required
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
              Sign Up
            </Button>
          </form>
        </div>
      </Card>
      
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
          <h3 className="text-xl font-bold mb-2">Download Our App</h3>
          <p className="mb-4 opacity-90">Get exclusive app-only deals and faster checkout</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              App Store
            </Button>
            <Button className="bg-black hover:bg-zinc-800 text-white">
              Google Play
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
