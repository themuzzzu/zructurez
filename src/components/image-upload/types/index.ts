
export interface Position {
  x: number;
  y: number;
}

export type ImagePosition = Position;
// Export ImagePosition once and correctly
export { ImagePosition };
