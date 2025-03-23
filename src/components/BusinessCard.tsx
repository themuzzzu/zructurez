
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { BookAppointmentDialog } from "./BookAppointmentDialog";
import { BusinessCardHeader } from "./business/BusinessCardHeader";
import { BusinessCardRating } from "./business/BusinessCardRating";
import { BusinessCardDescription } from "./business/BusinessCardDescription";
import { BusinessCardInfo } from "./business/BusinessCardInfo";
import { BusinessCardActions } from "./business/BusinessCardActions";
import { useBusinessLikes } from "./business/hooks/useBusinessLikes";

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  contact: string;
  hours: string;
  verified: boolean;
  serviceName: string;
  cost: number;
  appointment_price?: number;
  consultation_price?: number;
  wait_time?: string;
  closure_reason?: string;
  is_open?: boolean;
}

export const BusinessCard = ({
  id,
  name,
  category,
  description,
  image,
  rating,
  reviews,
  location,
  contact,
  hours,
  verified,
  appointment_price,
  consultation_price,
  wait_time,
  closure_reason,
  is_open
}: BusinessCardProps) => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  
  const { isLiked, likesCount, toggleLike } = useBusinessLikes(id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const businessUrl = `${window.location.origin}/business/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} - ${description}`,
        url: businessUrl
      }).catch(() => {
        navigator.clipboard.writeText(businessUrl);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(businessUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const greeting = `Hi! I found your business profile for ${name}. I'm interested in learning more about your services.`;
    const whatsappUrl = `https://wa.me/${contact.replace(/\D/g, '')}?text=${encodeURIComponent(greeting)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-[360px] bg-black/95 text-white"
        onClick={() => navigate(`/business/${id}`)}
      >
        <AspectRatio ratio={16/9} className="bg-muted">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        
        <div className="p-4 space-y-4">
          <BusinessCardHeader
            name={name}
            category={category}
            is_open={is_open}
            verified={verified}
            wait_time={wait_time}
            closure_reason={closure_reason}
          />
          
          <BusinessCardRating
            rating={rating}
            reviews={reviews}
            isLiked={isLiked || false}
            likesCount={likesCount}
            onLikeClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          />

          <BusinessCardDescription description={description} />

          <BusinessCardInfo
            location={location}
            hours={hours}
            appointment_price={appointment_price}
            consultation_price={consultation_price}
          />

          <BusinessCardActions
            appointment_price={appointment_price}
            onBookClick={(e) => {
              e.stopPropagation();
              setShowBooking(true);
            }}
            onWhatsAppClick={handleWhatsApp}
            onShareClick={handleShare}
            onCallClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${contact}`;
            }}
            is_open={is_open}
          />
        </div>
      </Card>

      <BookAppointmentDialog
        businessId={id}
        businessName={name}
        serviceName="General Appointment"
        cost={appointment_price || 0}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
};
