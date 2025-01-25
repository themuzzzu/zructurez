import { Card } from "@/components/ui/card";

interface BusinessImageSectionProps {
  image_url?: string;
}

export const BusinessImageSection = ({ image_url }: BusinessImageSectionProps) => {
  if (!image_url) return null;

  return (
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
  );
};