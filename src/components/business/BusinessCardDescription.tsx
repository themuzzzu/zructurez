
import { ChevronDown } from "lucide-react";

interface BusinessCardDescriptionProps {
  description: string;
}

export const BusinessCardDescription = ({ description }: BusinessCardDescriptionProps) => {
  return (
    <div className="relative">
      <p className="text-sm text-gray-300 line-clamp-3 mb-2">{description}</p>
      {description.length > 150 && (
        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-black to-transparent px-2">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
