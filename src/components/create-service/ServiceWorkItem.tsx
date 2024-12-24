import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { X } from "lucide-react";

interface ServiceWorkItemProps {
  onRemove: () => void;
  onChange: (data: { description: string; media: string | null }) => void;
}

export const ServiceWorkItem = ({ onRemove, onChange }: ServiceWorkItemProps) => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string | null>(null);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onChange({ description: value, media });
  };

  const handleMediaChange = (value: string | null) => {
    setMedia(value);
    onChange({ description, media: value });
  };

  return (
    <Card className="p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <Textarea
          placeholder="Describe your work..."
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />

        <ImageUpload
          selectedImage={media}
          onImageSelect={handleMediaChange}
        />
      </div>
    </Card>
  );
};