
import { ImagePosition } from "./types/index";

export interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  initialScale?: number;
  initialPosition?: ImagePosition;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: ImagePosition) => void;
  skipAutoSave?: boolean;
  buttonText?: string;
}

export interface UploadButtonsProps {
  onFileSelect: (file: File) => void;
  onCameraCapture: () => void;
  buttonText?: string;
}
