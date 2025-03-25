
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Advertisement } from "@/services/adService";
import { 
  Check, 
  Eye, 
  MousePointer, 
  X 
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { approveAd } from "@/utils/adminApiMiddleware";

interface AdManagementTableProps {
  ads: Advertisement[];
  isLoading: boolean;
}

export function AdManagementTable({ ads, isLoading }: AdManagementTableProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const handleApproveAd = async (adId: string) => {
    setProcessingId(adId);
    try {
      const result = await approveAd({
        adId,
        approved: true
      });
      
      if (result) {
        toast.success("Advertisement approved successfully");
      }
    } catch (error) {
      console.error('Error approving ad:', error);
      toast.error("Failed to approve advertisement");
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectAd = async (adId: string) => {
    setProcessingId(adId);
    try {
      const result = await approveAd({
        adId,
        approved: false,
        rejectionReason: "Does not meet platform standards"
      });
      
      if (result) {
        toast.success("Advertisement rejected");
      }
    } catch (error) {
      console.error('Error rejecting ad:', error);
      toast.error("Failed to reject advertisement");
    } finally {
      setProcessingId(null);
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Loading advertisements...
            </TableCell>
          </TableRow>
        ) : ads.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No advertisements found
            </TableCell>
          </TableRow>
        ) : (
          ads.map((ad) => {
            const impressions = ad.reach || 0;
            const clicks = ad.clicks || 0;
            const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0";
            
            return (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs">
                    <div className="truncate">{ad.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{ad.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      <span>{impressions}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <MousePointer className="mr-1 h-3 w-3" />
                      <span>{clicks}</span>
                    </div>
                    <div className="text-xs">{ctr}%</div>
                  </div>
                </TableCell>
                <TableCell>₹{ad.budget}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      ad.status === "active" ? "bg-green-500" :
                      ad.status === "pending" ? "bg-yellow-500" :
                      ad.status === "rejected" ? "bg-red-500" :
                      "bg-gray-500"
                    }
                  >
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ad.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-500"
                        onClick={() => handleApproveAd(ad.id)}
                        disabled={processingId === ad.id}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRejectAd(ad.id)}
                        disabled={processingId === ad.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
