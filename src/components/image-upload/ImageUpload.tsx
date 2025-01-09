import { useImageUploadState } from "./hooks/useImageUploadState";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import { ImagePreview } from "./ImagePreview";
import { ImageControls } from "./ImageControls";
import { UploadButtons } from "./UploadButtons";
import { Button } from "../ui/button";
import type { ImageUploadProps } from "./types";

export const ImageUpload = ({
  selectedImage,
  onImageSelect,
  initialScale = 1,
  initialPosition = { x: 50, y: 50 },
  onScaleChange,
  onPositionChange,
  skipAutoSave = false,
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
    pendingImage,
    setPendingImage,
    handleSave,
  } = useImageUploadState(
    selectedImage,
    initialScale,
    initialPosition,
    onImageSelect,
    onScaleChange,
    onPositionChange,
    skipAutoSave
  );

  const { handleFileUpload, handleCameraCapture } = useImageUploadHandlers({
    setPreviewImage,
    setScale,
    setPosition,
    onImageSelect,
    onScaleChange,
    onPositionChange,
    skipAutoSave,
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
    if (!skipAutoSave) {
      onPositionChange?.(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCancel = () => {
    if (pendingImage) {
      setPreviewImage(selectedImage);
      setScale(initialScale);
      setPosition(initialPosition);
      setPendingImage(null);
    }
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
              setPendingImage(null);
            }}
            isDragging={isDragging}
            onDragStart={handleMouseDown}
            onDragMove={handleMouseMove}
            onDragEnd={handleMouseUp}
            onPositionChange={(newPosition) => {
              setPosition(newPosition);
              if (!skipAutoSave) {
                onPositionChange?.(newPosition);
              }
            }}
          />

          <ImageControls
            scale={scale}
            onScaleChange={(newScale) => {
              setScale(newScale);
              if (!skipAutoSave) {
                onScaleChange?.(newScale);
              }
            }}
            onPositionChange={(x, y) => {
              const newPosition = { x, y };
              setPosition(newPosition);
              if (!skipAutoSave) {
                onPositionChange?.(newPosition);
              }
            }}
            onSave={handleSave}
          />

          {(pendingImage || skipAutoSave) && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};