
export interface Position {
  x: number;
  y: number;
}

export type ImagePosition = Position;
// Use correct export syntax for re-exporting with isolatedModules
export type { ImagePosition };
