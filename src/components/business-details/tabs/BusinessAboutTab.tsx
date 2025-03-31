
import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import type { Business, BusinessHours } from "@/types/business";

interface BusinessAboutTabProps {
  business: Business;
}

export const BusinessAboutTab = ({ business }: BusinessAboutTabProps) => {
  // Convert BusinessHours object or string to string representation for display
  const formatHours = (hours: BusinessHours | string | undefined) => {
    if (!hours) return "";
    
    try {
      // If hours is already a string, return it
      if (typeof hours === 'string') return hours;
      
      // If it's an object, try to format it
      const formattedHours = Object.entries(hours)
        .map(([day, time]) => {
          if (time && typeof time === 'object' && 'open' in time && 'close' in time) {
            return `${day}: ${time.open} - ${time.close}`;
          }
          return `${day}: Closed`;
        })
        .join(', ');
      
      return formattedHours || JSON.stringify(hours);
    } catch (e) {
      console.error("Error formatting hours:", e);
      return typeof hours === 'string' ? hours : "";
    }
  };
  
  return (
    <BusinessProfile
      id={business.id}
      name={business.name}
      description={business.description}
      location={business.location}
      hours={formatHours(business.hours || business.business_hours)}
      contact={business.contact}
      verified={business.verified}
      image_url={business.image_url}
      bio={business.bio}
      website={business.website}
      owners={business.owners}
      staff_details={business.staff_details}
      category={business.category}
      appointment_price={business.appointment_price}
      consultation_price={business.consultation_price}
      business_products={business.business_products}
    />
  );
};
