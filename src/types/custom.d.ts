
/// <reference types="dompurify" />

// This file adds custom type declarations for the project
// and ensures TypeScript can find the DOMPurify types

declare module 'dompurify' {
  export interface DOMPurifyI {
    sanitize(
      source: string | Node,
      config?: {
        ALLOWED_TAGS?: string[],
        ALLOWED_ATTR?: string[],
        [key: string]: any
      }
    ): string;
    setConfig(config: object): DOMPurifyI;
    addHook(hook: string, callback: Function): DOMPurifyI;
    removeHook(hook: string): DOMPurifyI;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
  }

  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
}

// Add window interface extension for browser environments
declare global {
  interface Window {
    DOMPurify: import('dompurify').DOMPurifyI;
  }
}
