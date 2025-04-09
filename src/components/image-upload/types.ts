
import { Position } from "./types/index";

export interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  initialScale?: number;
  initialPosition?: Position;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: Position) => void;
  skipAutoSave?: boolean;
  buttonText?: string;
}

export interface UploadButtonsProps {
  onFileSelect: (file: File) => void;
  onCameraCapture: () => void;
  buttonText?: string;
}
