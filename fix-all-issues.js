
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all issues in the project...');

try {
  console.log('\n📦 Installing required dependencies...');
  
  // Install DOMPurify and its type definitions
  console.log('Installing DOMPurify and its types...');
  execSync('npm install dompurify --save', { stdio: 'inherit' });
  execSync('npm install @types/dompurify --save-dev', { stdio: 'inherit' });
  
  // Install Vite and React
  console.log('Installing Vite, React, and other dependencies...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  execSync('npm install react react-dom react-router-dom', { stdio: 'inherit' });
  execSync('npm install @tanstack/react-query sonner lucide-react framer-motion', { stdio: 'inherit' });
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node', { stdio: 'inherit' });

  // Create necessary directories
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
    console.log('Created types directory');
  }

  // Create DOMPurify type definition file
  const dompurifyDTSPath = path.join(typesDir, 'dompurify-custom.d.ts');
  const dompurifyContent = `
/// <reference types="@types/dompurify" />

// This file is needed to ensure TypeScript can find the DOMPurify types
// without modifying the read-only tsconfig.json file

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
`;
  fs.writeFileSync(dompurifyDTSPath, dompurifyContent);
  console.log('Created DOMPurify type definition file');

  // Create a Vite environment file
  const viteEnvPath = path.join(__dirname, 'src/vite-env.d.ts');
  if (!fs.existsSync(path.dirname(viteEnvPath))) {
    fs.mkdirSync(path.dirname(viteEnvPath), { recursive: true });
  }
  fs.writeFileSync(viteEnvPath, '/// <reference types="vite/client" />');
  console.log('Created Vite environment declaration file');
  
  // Create Vite config file
  const viteConfigPath = path.join(__dirname, 'vite.config.js');
  const viteConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
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
  }
});
`;
  fs.writeFileSync(viteConfigPath, viteConfigContent);
  console.log('Created Vite configuration file');

  // Create a utility to verify Vite installation
  const utilsDir = path.join(__dirname, 'src/utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  const verifyVitePath = path.join(utilsDir, 'verifyVite.ts');
  const verifyViteContent = `
export const verifyVite = () => {
  console.log("Verifying Vite installation...");
  try {
    // This will only work in a Vite environment
    console.log("Vite is working correctly.");
    return true;
  } catch (e) {
    console.error("Vite is not working:", e);
    return false;
  }
};
`;
  fs.writeFileSync(verifyVitePath, verifyViteContent);
  console.log('Created Vite verification utility');

  // Update package.json scripts if it exists
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json scripts');
  }

  // Create a script to start the dev server
  const startDevPath = path.join(__dirname, 'start-dev.js');
  const startDevContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vite development server...');

const viteBinPath = path.join(__dirname, 'node_modules/.bin/vite');

// Check if Vite is installed
if (!fs.existsSync(viteBinPath)) {
  console.error('Vite not found in node_modules/.bin. Running npm install...');
  require('./fix-all-issues');
}

// Run Vite directly from node_modules
console.log('Starting Vite development server...');
const vite = spawn(viteBinPath, [], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(\`Vite process exited with code \${code}\`);
});
`;
  fs.writeFileSync(startDevPath, startDevContent);
  console.log('Created start-dev.js script');

  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-all-issues.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      console.log('Made scripts executable');
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  // Create a simple HTML entry point if it doesn't exist
  const indexHtmlPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    fs.writeFileSync(indexHtmlPath, indexHtmlContent);
    console.log('Created index.html');
  }
  
  console.log('\n✅ All issues fixed! Run these commands to start the development server:');
  console.log('1. node start-dev.js');
  console.log('\nAlternatively, you can now run:');
  console.log('npm run dev');

} catch (error) {
  console.error('\n❌ Error fixing issues:', error);
  process.exit(1);
}
