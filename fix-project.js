
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing project issues...');

try {
  // Fix for DOMPurify types
  console.log('Checking if DOMPurify types are installed...');
  try {
    const typesExist = fs.existsSync(path.join(__dirname, 'node_modules/@types/dompurify'));
    if (!typesExist) {
      console.log('Installing DOMPurify types...');
      execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
    } else {
      console.log('DOMPurify types already installed');
    }
  } catch (error) {
    console.error('Error checking DOMPurify types:', error);
  }
  
  // Create or update custom.d.ts for DOMPurify
  console.log('Setting up DOMPurify types declaration...');
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }
  
  const customDtsPath = path.join(typesDir, 'custom.d.ts');
  const customDtsContent = `
/// <reference types="dompurify" />

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

declare global {
  interface Window {
    DOMPurify: import('dompurify').DOMPurifyI;
  }
}

export {};
`;
  fs.writeFileSync(customDtsPath, customDtsContent.trim());
  
  // Create or update vite.config.js if it doesn't exist
  const viteConfigPath = path.join(__dirname, 'vite.config.js');
  if (!fs.existsSync(viteConfigPath)) {
    console.log('Creating vite.config.js...');
    const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
});
`;
    fs.writeFileSync(viteConfigPath, viteConfig.trim());
  }
  
  // Create a utility to verify Vite is working properly
  const verifyVitePath = path.join(__dirname, 'src/utils/verifyVite.ts');
  const verifyViteContent = `
export const verifyVite = () => {
  console.log('Verifying Vite installation...');
  try {
    // Check if we're running in a Vite environment
    const isViteEnv = import.meta.env !== undefined;
    
    if (isViteEnv) {
      console.log('Vite environment check successful');
      return true;
    } else {
      console.warn('Vite environment variables not detected - may be running in production build');
      return false;
    }
  } catch (error) {
    console.error('Error verifying Vite:', error);
    return false;
  }
};
`;
  
  if (!fs.existsSync(path.dirname(verifyVitePath))) {
    fs.mkdirSync(path.dirname(verifyVitePath), { recursive: true });
  }
  fs.writeFileSync(verifyVitePath, verifyViteContent.trim());
  
  // Fix permissions on scripts
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-project.js', { stdio: 'inherit' });
      console.log('Fixed script permissions');
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
  
  console.log('Project fixes completed!');
  console.log('You should now be able to run: npm run dev');
} catch (error) {
  console.error('Error fixing project:', error);
  process.exit(1);
}
