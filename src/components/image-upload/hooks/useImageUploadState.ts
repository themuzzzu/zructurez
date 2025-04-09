
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImagePosition } from "../types";

export const useImageUploadState = (
  selectedImage: string | null,
  initialScale = 1,
  initialPosition = { x: 50, y: 50 },
  onImageSelect: (image: string | null) => void,
  onScaleChange?: (scale: number) => void,
  onPositionChange?: (position: ImagePosition) => void,
  skipAutoSave = false
) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const [previewImage, setPreviewImage] = useState<string | null>(selectedImage);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  useEffect(() => {
    setPreviewImage(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    setScale(initialScale);
  }, [initialScale]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleSave = () => {
    onImageSelect(previewImage);
    onScaleChange?.(scale);
    onPositionChange?.(position);
    if (!skipAutoSave) {
      toast.success("Image settings saved!");
    }
  };

  return {
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
  };
};
