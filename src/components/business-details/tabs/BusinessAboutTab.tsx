
import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import type { Business } from "@/types/business";

interface BusinessAboutTabProps {
  business: Business;
}

export const BusinessAboutTab = ({ business }: BusinessAboutTabProps) => {
  // Convert BusinessHours object to string representation for display
  const formatHours = (hours: any) => {
    if (!hours) return "";
    
    try {
      // Simple formatting - this can be enhanced as needed
      return typeof hours === 'string' ? hours : JSON.stringify(hours);
    } catch (e) {
      return "";
    }
  };
  
  return (
    <BusinessProfile
      id={business.id}
      name={business.name}
      description={business.description}
      location={business.location}
      hours={formatHours(business.hours)}
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
