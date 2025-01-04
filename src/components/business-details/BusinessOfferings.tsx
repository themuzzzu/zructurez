import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { BusinessProductForm } from "../settings/BusinessProductForm";
import { ServiceFormFields } from "../create-service/ServiceFormFields";
import { Card } from "../ui/card";

interface BusinessOfferingsProps {
  businessId: string;
  onSuccess?: () => void;
}

export const BusinessOfferings = ({ businessId, onSuccess }: BusinessOfferingsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Offerings</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Offering
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <BusinessProductForm 
                  businessId={businessId} 
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    onSuccess?.();
                  }} 
                />
              </TabsContent>

              <TabsContent value="services">
                <ServiceFormFields 
                  formData={{
                    title: "",
                    description: "",
                    category: "",
                    price: "",
                    location: "",
                    contact_info: "",
                    availability: "",
                    image: null,
                    works: []
                  }}
                  onChange={() => {}}
                />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};