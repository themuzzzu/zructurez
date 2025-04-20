
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up project dependencies and configurations...');

try {
  // Install required dependencies
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  execSync('npm install dompurify@latest', { stdio: 'inherit' });
  execSync('npm install react@latest react-dom@latest react-router-dom@latest', { stdio: 'inherit' });
  execSync('npm install @tanstack/react-query@latest sonner@latest lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });

  // Create dompurify types folder if it doesn't exist
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Create a DOMPurify declaration file
  const dompurifyDTSPath = path.join(typesDir, 'dompurify.d.ts');
  const dompurifyContent = `
/// <reference types="@types/dompurify" />

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

  // Create a Vite config file if it doesn't exist
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  if (!fs.existsSync(viteConfigPath)) {
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
});
`;
    fs.writeFileSync(viteConfigPath, viteConfigContent);
    console.log('Created Vite configuration file');
  }

  // Create tsconfig.json if it doesn't exist
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfigContent = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
    fs.writeFileSync(tsconfigPath, tsconfigContent);
    console.log('Created TypeScript configuration file');
  }

  // Create tsconfig.node.json if it doesn't exist
  const tsconfigNodePath = path.join(__dirname, 'tsconfig.node.json');
  if (!fs.existsSync(tsconfigNodePath)) {
    const tsconfigNodeContent = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;
    fs.writeFileSync(tsconfigNodePath, tsconfigNodeContent);
    console.log('Created Node TypeScript configuration file');
  }

  // Create environment.d.ts for type definitions
  const envDtsPath = path.join(__dirname, 'src/vite-env.d.ts');
  if (!fs.existsSync(path.dirname(envDtsPath))) {
    fs.mkdirSync(path.dirname(envDtsPath), { recursive: true });
  }
  fs.writeFileSync(envDtsPath, '/// <reference types="vite/client" />');
  console.log('Created Vite environment declaration file');

  // Create a start script that launches Vite directly
  const startScriptPath = path.join(__dirname, 'start-dev.js');
  const startScriptContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const vitePackagePath = path.join(__dirname, 'node_modules/vite');
const viteBinPath = path.join(__dirname, 'node_modules/.bin/vite');

// Check if Vite is installed
if (!fs.existsSync(vitePackagePath)) {
  console.error('Vite package not found. Please run setup-project.js first');
  process.exit(1);
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

  fs.writeFileSync(startScriptPath, startScriptContent);
  console.log('Created start script for Vite');

  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup-project.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      execSync('chmod +x install.js', { stdio: 'inherit' });
      console.log('Made scripts executable');
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
  
  console.log('\nSetup complete! You can now run:');
  console.log('node start-dev.js');
  console.log('to start the development server.\n');
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
