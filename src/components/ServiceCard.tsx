
import { Star, MapPin, Clock, Phone, Mail, Share2, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { trackContactClick } from "@/services/serviceService";

interface ServiceCardProps {
  id: string;
  name: string;
  provider: string;
  avatar: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  hourlyRate: number;
  location: string;
  availability: string;
  isOwner?: boolean;
  onDelete?: () => void;
  onView?: () => void;
  views?: number;
}

export const ServiceCard = ({
  id,
  name,
  provider,
  avatar,
  category,
  rating,
  reviews,
  description,
  image,
  hourlyRate,
  location,
  availability,
  isOwner = false,
  onDelete,
  onView,
  views = 0
}: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Track the contact click for analytics
    trackContactClick(id);
    toast.success("Contact request sent!");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Service shared!");
  };

  const handleCardClick = () => {
    // Call the onView callback if provided
    if (onView) {
      onView();
    }
    navigate(`/services/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Service deleted successfully");
      onDelete?.();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service");
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
          ${hourlyRate}/hr
        </div>
        {views > 0 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {views}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{category}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{rating}</span>
                <span className="ml-1">({reviews})</span>
              </div>
            </div>
          </div>
          <img
            src={avatar}
            alt={provider}
            className="h-10 w-10 rounded-full"
          />
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {availability}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleContact}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this service? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Card>
  );
};
