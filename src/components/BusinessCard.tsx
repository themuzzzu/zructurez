
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
import { Business } from "@/types/business";

interface BusinessCardProps {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  location?: string;
  contact?: string;
  hours?: string;
  verified?: boolean;
  appointment_price?: number;
  consultation_price?: number;
  wait_time?: string;
  closure_reason?: string;
  is_open?: boolean;
  business?: Business;
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
  is_open,
  business
}: BusinessCardProps) => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  
  // If business object is provided, use its properties instead of individual props
  const businessId = business?.id || id || "";
  const businessName = business?.name || name || "";
  const businessCategory = business?.category || category || "";
  const businessDescription = business?.description || description || "";
  const businessImage = business?.image_url || image || "";
  const businessRating = business?.ratings || rating || 0;
  const businessReviews = business?.reviews_count || reviews || 0;
  const businessLocation = business?.location || location || "";
  const businessContact = business?.contact || contact || "";
  const businessHours = business?.hours || hours || "";
  const businessVerified = business?.verified || verified || false;
  const businessAppointmentPrice = business?.appointment_price || appointment_price || 0;
  const businessConsultationPrice = business?.consultation_price || consultation_price;
  const businessWaitTime = business?.wait_time || wait_time;
  const businessClosureReason = business?.closure_reason || closure_reason;
  const businessIsOpen = business?.is_open ?? is_open ?? true;
  
  const { isLiked, likesCount, toggleLike } = useBusinessLikes(businessId);

  return (
    <>
      <BusinessCardUI 
        onClick={() => navigate(`/businesses/${businessId}`)}
        className="group w-full max-w-full"
      >
        <BusinessCardImage 
          src={businessImage} 
          alt={businessName} 
          className="w-full aspect-video object-cover"
        />
        
        <BusinessCardContent>
          <BusinessCardHeader
            name={businessName}
            category={businessCategory}
            is_open={businessIsOpen}
            verified={businessVerified}
            wait_time={businessWaitTime}
            closure_reason={businessClosureReason}
          />
          
          <BusinessCardRating
            rating={businessRating}
            reviews={businessReviews}
            isLiked={isLiked || false}
            likesCount={likesCount}
            onLikeClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          />

          <BusinessCardDescription description={businessDescription} />

          <BusinessCardInfo
            location={businessLocation}
            hours={businessHours}
            appointment_price={businessAppointmentPrice}
            consultation_price={businessConsultationPrice}
          />

          <BusinessCardActions
            appointment_price={businessAppointmentPrice}
            onBookClick={(e) => {
              e.stopPropagation();
              setShowBooking(true);
            }}
            onWhatsAppClick={(e) => openWhatsAppChat(e, businessName, businessContact)}
            onShareClick={(e) => shareBusinessProfile(e, businessName, businessDescription, businessId)}
            onCallClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${businessContact}`;
            }}
            is_open={businessIsOpen}
          />
        </BusinessCardContent>
      </BusinessCardUI>

      <BookAppointmentDialog
        businessId={businessId}
        businessName={businessName}
        serviceName="General Appointment"
        cost={businessAppointmentPrice || 0}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
};
