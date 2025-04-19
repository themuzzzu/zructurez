
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing project issues...');

try {
  // Fix BusinessCard.tsx Badge variant issue
  console.log('Fixing Badge variant issue in BusinessCard.tsx...');
  const businessCardPath = path.join(__dirname, 'src/components/BusinessCard.tsx');
  
  if (fs.existsSync(businessCardPath)) {
    let content = fs.readFileSync(businessCardPath, 'utf-8');
    
    // Replace variant="success" with className="bg-green-500 text-white"
    content = content.replace(/variant="success"/g, 'className="bg-green-500 text-white"');
    
    // Replace variant="destructive" with className="bg-destructive text-destructive-foreground"
    content = content.replace(/variant="destructive"/g, 'className="bg-destructive text-destructive-foreground"');
    
    // Replace variant="outline" with className="bg-background border-border"
    content = content.replace(/variant="outline"/g, 'className="bg-background border-border"');
    
    fs.writeFileSync(businessCardPath, content);
  } else {
    console.log('BusinessCard.tsx not found, skipping fix');
  }

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
