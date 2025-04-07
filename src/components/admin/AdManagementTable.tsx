
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash, Play, Pause } from "lucide-react";
import { Advertisement, AdStatus } from '@/services/adService';
import { useNavigate } from 'react-router-dom';

interface AdManagementTableProps {
  ads: Advertisement[];
  onStatusChange?: (id: string, status: AdStatus) => void;
  onDelete?: (id: string) => void;
}

export function AdManagementTable({ ads, onStatusChange, onDelete }: AdManagementTableProps) {
  const navigate = useNavigate();
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  
  const handleStatusChange = (id: string, newStatus: AdStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };
  
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };
  
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'paused':
        return 'bg-gray-500';
      case 'completed':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAds(ads.map(ad => ad.id));
    } else {
      setSelectedAds([]);
    }
  };
  
  const handleSelectAd = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAds([...selectedAds, id]);
    } else {
      setSelectedAds(selectedAds.filter(adId => adId !== id));
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={selectedAds.length === ads.length && ads.length > 0}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No advertisements found
              </TableCell>
            </TableRow>
          ) : (
            ads.map(ad => (
              <TableRow key={ad.id}>
                <TableCell>
                  <input 
                    type="checkbox"
                    checked={selectedAds.includes(ad.id)}
                    onChange={(e) => handleSelectAd(ad.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded overflow-hidden bg-gray-200 mr-2"
                      style={{ 
                        backgroundImage: ad.image_url ? `url(${ad.image_url})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                    <div>{ad.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{ad.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ad.status)}>
                    {ad.status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(ad.start_date)}</TableCell>
                <TableCell>{formatDate(ad.end_date)}</TableCell>
                <TableCell>${Number(ad.budget || 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/admin/ads/${ad.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/ads/${ad.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {ad.status === 'active' ? (
                        <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'paused')}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                      ) : ad.status === 'paused' || ad.status === 'pending' ? (
                        <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'active')}>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
