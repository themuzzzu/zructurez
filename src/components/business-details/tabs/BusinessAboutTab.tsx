import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import type { Business } from "@/types/business";

interface BusinessAboutTabProps {
  business: Business;
}

export const BusinessAboutTab = ({ business }: BusinessAboutTabProps) => {
  return (
    <BusinessProfile
      description={business.description}
      location={business.location}
      hours={business.hours}
      contact={business.contact}
      verified={business.verified}
      image_url={business.image_url}
      bio={business.bio}
      website={business.website}
      owners={business.owners}
      staff_details={business.staff_details}
    />
  );
};