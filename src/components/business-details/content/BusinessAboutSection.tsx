
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Business } from '@/types/business';

interface BusinessAboutSectionProps {
  business: Business;
}

export const BusinessAboutSection = ({ business }: BusinessAboutSectionProps) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{business.description}</p>
        </div>

        {business.bio && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <p className="text-muted-foreground">{business.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {business.location && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Location</h4>
              <p>{business.location}</p>
            </div>
          )}
          
          {business.contact && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Contact</h4>
              <p>{business.contact}</p>
            </div>
          )}
          
          {business.hours && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Business Hours</h4>
              <p>{typeof business.hours === 'string' ? business.hours : JSON.stringify(business.hours)}</p>
            </div>
          )}
          
          {business.website && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Website</h4>
              <a 
                href={business.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {business.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
