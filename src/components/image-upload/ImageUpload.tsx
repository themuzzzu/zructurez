import { useImageUploadState } from "./hooks/useImageUploadState";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import { ImagePreview } from "./ImagePreview";
import { ImageControls } from "./ImageControls";
import { UploadButtons } from "./UploadButtons";
import type { ImageUploadProps } from "./types";

export const ImageUpload = ({
  selectedImage,
  onImageSelect,
  initialScale = 1,
  initialPosition = { x: 50, y: 50 },
  onScaleChange,
  onPositionChange,
}: ImageUploadProps) => {
  const {
    scale,
    setScale,
    position,
    setPosition,
    previewImage,
    setPreviewImage,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    handleSave,
  } = useImageUploadState(
    selectedImage,
    initialScale,
    initialPosition,
    onImageSelect,
    onScaleChange,
    onPositionChange
  );

  const { handleFileUpload, handleCameraCapture } = useImageUploadHandlers({
    setPreviewImage,
    setScale,
    setPosition,
    onImageSelect,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(100, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(100, e.clientY - dragStart.y));
    
    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <UploadButtons 
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileUpload}
      />

      {previewImage && (
        <div className="space-y-4">
          <ImagePreview
            previewImage={previewImage}
            scale={scale}
            position={position}
            onImageRemove={() => {
              setPreviewImage(null);
              onImageSelect(null);
            }}
            isDragging={isDragging}
            onDragStart={handleMouseDown}
            onDragMove={handleMouseMove}
            onDragEnd={handleMouseUp}
            onPositionChange={(newPosition) => {
              setPosition(newPosition);
              onPositionChange?.(newPosition);
            }}
          />

          <ImageControls
            scale={scale}
            onScaleChange={(newScale) => {
              setScale(newScale);
              onScaleChange?.(newScale);
            }}
            onPositionChange={(x, y) => {
              const newPosition = { x, y };
              setPosition(newPosition);
              onPositionChange?.(newPosition);
            }}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
};