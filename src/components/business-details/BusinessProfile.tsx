import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Building, Users, Globe, Menu, Calendar } from "lucide-react";
import { BusinessOwnerCard } from "./profile/BusinessOwnerCard";
import { BusinessStaffCard } from "./profile/BusinessStaffCard";
import { ServiceMenuCard } from "./profile/ServiceMenuCard";
import { BusinessAdvertisements } from "./BusinessAdvertisements";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BookAppointmentDialog } from "@/components/BookAppointmentDialog";

interface BusinessProfileProps {
  id: string;
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  verified?: boolean;
  image_url?: string;
  bio?: string;
  website?: string;
  owners?: { 
    name: string; 
    role: string; 
    position: string; 
    experience?: string;
    qualifications?: string;
    image_url?: string | null;
  }[];
  staff_details?: { 
    name: string; 
    position: string; 
    experience?: string;
    image_url?: string | null;
  }[];
  category?: string;
  appointment_price?: number;
  consultation_price?: number;
  business_products?: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  name: string;
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
  const hasValidStaff = staff_details && staff_details.length > 0 && staff_details.some(staff => staff.name);

  return (
    <div className="space-y-6">
      {/* Business Image */}
      {image_url && (
        <div className="w-full rounded-lg overflow-hidden">
          <div className="relative w-full max-h-[600px]">
            <img
              src={image_url}
              alt="Business"
              className="w-full h-auto object-contain rounded-lg"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      )}

      {/* Advertisements Section */}
      <BusinessAdvertisements businessId={id} />

      {/* About Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">About</h2>
          {verified && (
            <Badge variant="outline" className="ml-2">
              Verified
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground break-words">{description}</p>

        <div className="grid gap-4">
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="break-words">{location}</span>
            </div>
          )}
          
          {hours && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{hours}</span>
            </div>
          )}
          
          {contact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {contact.includes('@') ? (
                <Mail className="h-4 w-4 shrink-0" />
              ) : (
                <Phone className="h-4 w-4 shrink-0" />
              )}
              <span>{contact}</span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4 shrink-0" />
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors break-words"
              >
                {website}
              </a>
            </div>
          )}
        </div>

        {appointment_price && (
          <div className="pt-4">
            <Button
              onClick={() => setShowBooking(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        )}
      </Card>

      {/* Service Menu/Info Card */}
      {(category || appointment_price || consultation_price || (business_products && business_products.length > 0)) && (
        <ServiceMenuCard
          category={category}
          appointment_price={appointment_price}
          consultation_price={consultation_price}
          business_products={business_products}
        />
      )}

      {/* Bio Section */}
      {bio && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bio</h2>
          <p className="text-muted-foreground break-words">{bio}</p>
        </Card>
      )}

      {/* Owners Section */}
      {owners && owners.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Owners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {owners.map((owner, index) => (
              <BusinessOwnerCard key={index} {...owner} />
            ))}
          </div>
        </Card>
      )}

      {/* Staff Section */}
      {hasValidStaff && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff_details.map((staff, index) => (
              staff.name && <BusinessStaffCard key={index} {...staff} />
            ))}
          </div>
        </Card>
      )}

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