
import { useState } from "react";
import { BusinessImageSection } from "./profile/BusinessImageSection";
import { BusinessActionButtons } from "./profile/BusinessActionButtons";
import { BusinessAdvertisements } from "./BusinessAdvertisements";
import { BusinessAboutSection } from "./profile/BusinessAboutSection";
import { ServiceMenuCard } from "./profile/ServiceMenuCard";
import { BusinessBioSection } from "./profile/BusinessBioSection";
import { BusinessTeamSection } from "./profile/BusinessTeamSection";
import { BusinessCommentSection } from "./comments/BusinessCommentSection";
import { BookAppointmentDialog } from "@/components/BookAppointmentDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Business } from "@/types/business";

interface BusinessProfileProps {
  id: string;
  name: string;
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  verified?: boolean;
  image_url?: string;
  bio?: string;
  website?: string;
  owners?: Business['owners'];
  staff_details?: Business['staff_details'];
  category?: string;
  appointment_price?: number;
  consultation_price?: number;
  business_products?: Business['business_products'];
}

export const BusinessProfile = ({
  id,
  name,
  description,
  location,
  hours,
  contact,
  verified,
  image_url,
  bio,
  website,
  owners,
  staff_details,
  category,
  appointment_price,
  consultation_price,
  business_products,
}: BusinessProfileProps) => {
  const [showBooking, setShowBooking] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <BusinessImageSection business={id} />
      
      <BusinessActionButtons businessId={id} />
      
      {!isMobile && <BusinessAdvertisements businessId={id} />}
      
      <BusinessAboutSection
        businessId={id}
        description={description}
        location={location}
        hours={hours}
        contact={contact}
        website={website}
        verified={verified}
        appointment_price={appointment_price}
        onBookAppointment={() => setShowBooking(true)}
      />

      {(category || appointment_price || consultation_price || (business_products && business_products.length > 0)) && (
        <ServiceMenuCard
          category={category}
          appointment_price={appointment_price}
          consultation_price={consultation_price}
          business_products={business_products}
        />
      )}

      {bio && <BusinessBioSection bio={bio} />}

      <BusinessTeamSection 
        owners={owners} 
        staff_details={staff_details}
      />

      <BusinessCommentSection businessId={id} />

      <BookAppointmentDialog
        businessId={id}
        businessName={name}
        serviceName="General Appointment"
        cost={appointment_price || 0}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </div>
  );
};
