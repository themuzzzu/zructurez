
// Google Maps type definitions
declare global {
  interface Window {
    google: typeof google;
  }
}

// This ensures proper module augmentation compatibility
export {};
