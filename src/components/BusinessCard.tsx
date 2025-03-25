
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookAppointmentDialog } from "./BookAppointmentDialog";
import { BusinessCardHeader } from "./business/BusinessCardHeader";
import { BusinessCardRating } from "./business/BusinessCardRating";
import { BusinessCardDescription } from "./business/BusinessCardDescription";
import { BusinessCardInfo } from "./business/BusinessCardInfo";
import { BusinessCardActions } from "./business/BusinessCardActions";
import { useBusinessLikes } from "./business/hooks/useBusinessLikes";
import { shareBusinessProfile, openWhatsAppChat } from "@/utils/businessCardUtils";
import { BusinessCard as BusinessCardUI, BusinessCardImage, BusinessCardContent } from "./ui/business-card";

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

  return (
    <>
      <BusinessCardUI 
        onClick={() => navigate(`/businesses/${id}`)}
      >
        <BusinessCardImage 
          src={image} 
          alt={name} 
        />
        
        <BusinessCardContent>
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
            onWhatsAppClick={(e) => openWhatsAppChat(e, name, contact)}
            onShareClick={(e) => shareBusinessProfile(e, name, description, id)}
            onCallClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${contact}`;
            }}
            is_open={is_open}
          />
        </BusinessCardContent>
      </BusinessCardUI>

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
