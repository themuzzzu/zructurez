
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessVerification } from "./BusinessVerification";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessDeletion } from "@/hooks/useBusinessDeletion";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export const BusinessSettings = () => {
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { isDeleting, deleteBusiness } = useBusinessDeletion(() => {
    refetch();
    setIsDeleteDialogOpen(false);
  });

  const { data: businesses, isLoading, refetch } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);

      return data || [];
    },
  });

  const handleShowInServicesChange = async (businessId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('businesses')
      .update({ show_in_services: !currentValue })
      .eq('id', businessId);

    if (error) {
      toast.error("Failed to update setting");
      return;
    }

    toast.success("Setting updated successfully");
  };

  const handleDeleteBusiness = async () => {
    if (!deletingBusinessId) return;
    
    await deleteBusiness(deletingBusinessId);
  };

  if (isLoading) {
    return <div>Loading businesses...</div>;
  }

  if (!businesses?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't created any businesses yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {businesses.map((business) => (
            <div key={business.id} className="space-y-4 pt-4 first:pt-0 border-t first:border-t-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{business.name}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/business-edit/${business.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Business
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setDeletingBusinessId(business.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Business
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Visibility Settings</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`show-in-services-${business.id}`}>Show in Services Page</Label>
                  <Switch
                    id={`show-in-services-${business.id}`}
                    checked={business.show_in_services}
                    onCheckedChange={() => handleShowInServicesChange(business.id, business.show_in_services)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        title="Delete Business"
        description="Are you sure you want to delete this business? This action cannot be undone, and the business will be permanently removed from your catalog."
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteBusiness}
      />

      {businesses.map((business) => (
        <BusinessVerification key={business.id} businessId={business.id} />
      ))}
    </div>
  );
};
