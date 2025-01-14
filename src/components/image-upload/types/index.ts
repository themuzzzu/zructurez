export interface ImagePosition {
  x: number;
  y: number;
}

export interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  initialScale?: number;
  initialPosition?: ImagePosition;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: ImagePosition) => void;
  skipAutoSave?: boolean;
}

export interface ImageUploadHandlersProps {
  setPreviewImage: (image: string | null) => void;
  setScale: (scale: number) => void;
  setPosition: (position: ImagePosition) => void;
  onImageSelect: (image: string | null) => void;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: ImagePosition) => void;
  skipAutoSave?: boolean;
}