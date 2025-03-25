
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Advertisement } from "@/services/adService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Eye, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Trash, 
  AlertCircle, 
  Edit 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface AdManagementTableProps {
  ads: Advertisement[];
  isLoading: boolean;
}

export const AdManagementTable = ({ ads, isLoading }: AdManagementTableProps) => {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "delete">("approve");
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Ad ${status === 'active' ? 'approved' : 'rejected'} successfully`);
      // In a real app, we would refresh the data here
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update ad status');
    }
    
    setConfirmDialogOpen(false);
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Ad deleted successfully');
      // In a real app, we would refresh the data here
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
    }
    
    setConfirmDialogOpen(false);
  };
  
  const openConfirmDialog = (ad: Advertisement, action: "approve" | "reject" | "delete") => {
    setSelectedAd(ad);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };
  
  const viewAdDetails = (ad: Advertisement) => {
    setSelectedAd(ad);
    setViewDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (ads.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No advertisements found</AlertTitle>
        <AlertDescription>
          There are no advertisements matching your current filter criteria.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell className="capitalize">{ad.type}</TableCell>
                <TableCell>
                  {formatDate(ad.start_date)} - {formatDate(ad.end_date)}
                </TableCell>
                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                <TableCell>₹{ad.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Views: {ad.reach?.toLocaleString() || 0}</div>
                    <div>Clicks: {ad.clicks?.toLocaleString() || 0}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => viewAdDetails(ad)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {ad.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => openConfirmDialog(ad, "approve")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openConfirmDialog(ad, "reject")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => openConfirmDialog(ad, "delete")}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* View Ad Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
          </DialogHeader>
          {selectedAd && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{selectedAd.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{selectedAd.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium capitalize">{selectedAd.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(selectedAd.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">₹{selectedAd.budget.toLocaleString()}</span>
                  </div>
                </div>
                
                <h3 className="font-medium mt-4 mb-2">Time Period</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formatDate(selectedAd.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{formatDate(selectedAd.end_date)}</span>
                  </div>
                </div>
                
                <h3 className="font-medium mt-4 mb-2">Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views:</span>
                    <span>{selectedAd.reach?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clicks:</span>
                    <span>{selectedAd.clicks?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CTR:</span>
                    <span>
                      {selectedAd.reach 
                        ? (((selectedAd.clicks || 0) / selectedAd.reach) * 100).toFixed(2) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Content</h3>
                <p className="text-sm mb-4">{selectedAd.description}</p>
                
                {selectedAd.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Advertisement Image:</p>
                    <img 
                      src={selectedAd.image_url} 
                      alt={selectedAd.title} 
                      className="w-full h-auto rounded-md object-cover"
                    />
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-sm">{selectedAd.location}</p>
                </div>
                
                {selectedAd.targeting_locations && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Targeting</h3>
                    <div className="space-y-2 text-sm">
                      {selectedAd.targeting_locations && (
                        <div>
                          <span className="text-muted-foreground">Locations:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedAd.targeting_locations.map((location, i) => (
                              <Badge key={i} variant="outline">{location}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedAd.targeting_interests && (
                        <div className="mt-2">
                          <span className="text-muted-foreground">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedAd.targeting_interests.map((interest, i) => (
                              <Badge key={i} variant="outline">{interest}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {selectedAd && selectedAd.status === 'pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setViewDialogOpen(false);
                    openConfirmDialog(selectedAd, "reject");
                  }}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    setViewDialogOpen(false);
                    openConfirmDialog(selectedAd, "approve");
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "approve" && "Approve Advertisement"}
              {confirmAction === "reject" && "Reject Advertisement"}
              {confirmAction === "delete" && "Delete Advertisement"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve" && "This advertisement will be visible to users. Are you sure?"}
              {confirmAction === "reject" && "This advertisement will be rejected. Are you sure?"}
              {confirmAction === "delete" && "This advertisement will be permanently deleted. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            {selectedAd && (
              <Button 
                variant={confirmAction === "delete" ? "destructive" : confirmAction === "reject" ? "outline" : "default"}
                onClick={() => {
                  if (confirmAction === "approve") {
                    handleStatusChange(selectedAd.id, "active");
                  } else if (confirmAction === "reject") {
                    handleStatusChange(selectedAd.id, "rejected");
                  } else if (confirmAction === "delete") {
                    handleDelete(selectedAd.id);
                  }
                }}
              >
                {confirmAction === "approve" && "Approve"}
                {confirmAction === "reject" && "Reject"}
                {confirmAction === "delete" && "Delete"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
