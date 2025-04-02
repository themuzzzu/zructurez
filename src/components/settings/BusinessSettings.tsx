
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessVerification } from "./BusinessVerification";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BusinessSettings = () => {
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

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
    
    setIsDeleting(true);
    try {
      // Delete associated business_products first
      const { error: productsError } = await supabase
        .from('business_products')
        .delete()
        .eq('business_id', deletingBusinessId);
      
      if (productsError) {
        console.error("Error deleting business products:", productsError);
      }
      
      // Delete associated business_portfolio items
      const { error: portfolioError } = await supabase
        .from('business_portfolio')
        .delete()
        .eq('business_id', deletingBusinessId);
      
      if (portfolioError) {
        console.error("Error deleting business portfolio:", portfolioError);
      }
      
      // Delete any business_ratings
      const { error: ratingsError } = await supabase
        .from('business_ratings')
        .delete()
        .eq('business_id', deletingBusinessId);
      
      if (ratingsError) {
        console.error("Error deleting business ratings:", ratingsError);
      }
      
      // Delete the business
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', deletingBusinessId);
      
      if (error) throw error;
      
      toast.success("Business deleted successfully");
      refetch(); // Refresh the businesses list
      setIsDeleteDialogOpen(false);
      
      // If there are no more businesses, navigate to profile page
      if (businesses && businesses.length <= 1) {
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingBusinessId(null);
    }
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
                  <AlertDialog 
                    open={isDeleteDialogOpen && deletingBusinessId === business.id} 
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setDeletingBusinessId(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
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
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your business and all associated data including products, portfolio items, and other related information. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default form submission
                            handleDeleteBusiness();
                          }}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete Business"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

      {businesses.map((business) => (
        <BusinessVerification key={business.id} businessId={business.id} />
      ))}
    </div>
  );
};
