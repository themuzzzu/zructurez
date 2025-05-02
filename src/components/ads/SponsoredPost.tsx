
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  url?: string;
  company?: string;
}

interface SponsoredPostProps {
  ad: Ad;
}

export const SponsoredPost: React.FC<SponsoredPostProps> = ({ ad }) => {
  const { title, description, image_url, url, company } = ad;
  
  return (
    <Card className="overflow-hidden border-2 border-primary/20 transition-all hover:shadow-md">
      <div className="relative">
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className="h-40 w-full object-cover"
          />
        )}
        <div className="absolute right-2 top-2">
          <Badge variant="success" className="px-2 py-0.5 text-xs">
            Sponsored
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-lg font-medium">{title}</h3>
        {company && <p className="mb-2 text-sm text-muted-foreground">{company}</p>}
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-end bg-gray-50 p-2">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            Learn more <ExternalLink size={14} />
          </a>
        )}
      </CardFooter>
    </Card>
  );
};
