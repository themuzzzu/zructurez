
import { ImageUpload } from "@/components/ImageUpload";

interface UploadMediaProps {
  value: string;
  onChange: (value: string) => void;
}

export const UploadMedia = ({ value, onChange }: UploadMediaProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Media</h3>
        <p className="text-sm text-muted-foreground">
          Add images or video for your advertisement
        </p>
      </div>

      <ImageUpload
        selectedImage={value}
        onImageSelect={onChange}
        skipAutoSave
      />
    </div>
  );
};
