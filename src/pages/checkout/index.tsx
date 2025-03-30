
import { Layout } from "@/components/layout/Layout";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container max-w-[1400px] pt-4 pb-16">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground max-w-md">
            The checkout process will be available soon.
          </p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </Layout>
  );
}
