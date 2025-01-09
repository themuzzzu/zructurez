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

export interface ImagePreviewProps {
  previewImage: string;
  scale: number;
  position: ImagePosition;
  onPositionChange: (position: ImagePosition) => void;
  onImageRemove: () => void;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
}

export interface ImageControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onPositionChange: (x: number, y: number) => void;
  onSave: () => void;
}

export interface UploadButtonsProps {
  onCameraCapture: () => void;
  onFileSelect: (file: File) => void;
}