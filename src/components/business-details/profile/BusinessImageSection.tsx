
import { Card } from "@/components/ui/card";
import { ImageOff } from "lucide-react";

interface BusinessImageSectionProps {
  image_url?: string;
}

export const BusinessImageSection = ({ image_url }: BusinessImageSectionProps) => {
  if (!image_url) {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center" style={{ height: '300px' }}>
        <div className="text-center p-4">
          <ImageOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <div className="relative w-full" style={{ maxHeight: '600px' }}>
        <img
          src={image_url}
          alt="Business"
          className="w-full h-auto object-contain rounded-lg"
          style={{ maxHeight: '600px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.parentElement?.classList.add('bg-muted');
            target.parentElement?.classList.add('flex');
            target.parentElement?.classList.add('items-center');
            target.parentElement?.classList.add('justify-center');
            target.parentElement?.style.height = '300px';
            target.style.display = 'none';
            
            // Create fallback content
            const fallback = document.createElement('div');
            fallback.className = 'text-center p-4';
            fallback.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 mx-auto mb-2 text-muted-foreground">
                <line x1="2" x2="22" y1="2" y2="22"></line>
                <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path>
                <line x1="13.5" x2="6.5" y1="13.5" y2="20.5"></line>
                <line x1="2" x2="22" y1="2" y2="22"></line>
                <path d="M21 15.3a2 2 0 0 0-1.3-1.3"></path>
                <path d="M15.3 21a2 2 0 0 0 1.3-1.3"></path>
                <path d="M21 8.7a2 2 0 0 0-1.3-1.3"></path>
                <path d="M15.3 2.7a2 2 0 0 1 1.3 1.3"></path>
                <path d="M8.7 21a2 2 0 0 1-1.3-1.3"></path>
                <path d="M2.7 15.3a2 2 0 0 1 1.3-1.3"></path>
                <path d="M2.7 8.7a2 2 0 0 1 1.3-1.3"></path>
                <path d="M8.7 2.7a2 2 0 0 0-1.3 1.3"></path>
              </svg>
              <p class="text-muted-foreground">Image failed to load</p>
            `;
            target.parentElement?.appendChild(fallback);
          }}
        />
      </div>
    </div>
  );
};
