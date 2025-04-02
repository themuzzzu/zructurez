
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CreateMenuForm } from "./menu/CreateMenuForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export const MenuTab = ({ businessId }: { businessId: string }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuToDeleteId, setMenuToDeleteId] = useState<string | null>(null);

  const { data: menus, isLoading, refetch } = useQuery({
    queryKey: ['business-menus', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_menus')
        .select('*')
        .eq('business_id', businessId);
        
      if (error) throw error;
      return data || [];
    },
  });

  const handleDeleteMenu = async () => {
    if (!menuToDeleteId) return;
    
    try {
      setIsDeleting(true);
      
      // Delete menu items first
      const { error: itemsError } = await supabase
        .from('menu_items')
        .delete()
        .eq('business_id', businessId);
        
      if (itemsError) throw itemsError;
      
      // Delete subcategories
      const { error: subcategoriesError } = await supabase
        .from('menu_subcategories')
        .delete()
        .eq('business_id', businessId);
        
      if (subcategoriesError) throw subcategoriesError;
      
      // Delete categories
      const { error: categoriesError } = await supabase
        .from('menu_categories')
        .delete()
        .eq('business_id', businessId);
        
      if (categoriesError) throw categoriesError;
      
      // Finally delete the menu
      const { error: menuError } = await supabase
        .from('business_menus')
        .delete()
        .eq('id', menuToDeleteId);
        
      if (menuError) throw menuError;
      
      toast.success("Menu deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete menu. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setMenuToDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <p>Loading menus...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Menu / List Management</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Menu/List
          </Button>
        </CardHeader>
        <CardContent>
          {menus && menus.length > 0 ? (
            <div className="space-y-4">
              {menus.map((menu) => (
                <div 
                  key={menu.id} 
                  className="flex justify-between items-center p-4 border rounded-md"
                >
                  <div>
                    <h3 className="font-medium">
                      {menu.display_type === 'menu' ? 'Menu' : 'List'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {menu.is_published ? 'Published' : menu.is_draft ? 'Draft' : 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(menu.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setMenuToDeleteId(menu.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't created any menus or lists yet.
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Menu/List
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Menu Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {menus && menus.length > 0 ? 'Edit' : 'Create'} Menu/List
            </DialogTitle>
          </DialogHeader>
          <CreateMenuForm businessId={businessId} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        title="Delete Menu"
        description="Are you sure you want to delete this menu? This action cannot be undone, and all categories, subcategories, and items will be permanently removed."
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteMenu}
      />
    </div>
  );
};
