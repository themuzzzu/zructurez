
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive project setup...');

try {
  // Check if package.json exists
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Please create a package.json file first.');
    process.exit(1);
  }

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  };
  
  // Update dependencies
  console.log('📦 Installing core dependencies...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Install React and related packages
  console.log('\n📦 Installing React and related packages...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Install Vite and plugins
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  // Install UI and utility libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install @tanstack/react-query@latest sonner@latest lucide-react@latest framer-motion@latest dompurify@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
  
  // Make sure a vite.config.js file exists
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  if (!fs.existsSync(viteConfigPath)) {
    console.log('\n📝 Creating Vite configuration file...');
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
  }
  
  // Create or update tsconfig.json
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log('\n📝 Creating TypeScript configuration file...');
    const tsconfigContent = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;
    fs.writeFileSync(tsconfigPath, tsconfigContent);
  }
  
  // Create tsconfig.node.json if it doesn't exist
  const tsconfigNodePath = path.join(__dirname, 'tsconfig.node.json');
  if (!fs.existsSync(tsconfigNodePath)) {
    console.log('\n📝 Creating Node TypeScript configuration file...');
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
  }
  
  // Create environment.d.ts for type definitions
  const dtsPath = path.join(__dirname, 'src/vite-env.d.ts');
  if (!fs.existsSync(path.join(__dirname, 'src'))) {
    fs.mkdirSync(path.join(__dirname, 'src'), { recursive: true });
  }
  console.log('\n📝 Creating TypeScript environment declarations...');
  fs.writeFileSync(dtsPath, '/// <reference types="vite/client" />');

  // Update DOMPurify types
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Make executable
  if (process.platform !== 'win32') {
    try {
      console.log('\n🔑 Setting executable permissions...');
      execSync('chmod +x install.js', { stdio: 'inherit' });
      execSync('chmod +x setup.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️ Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ Setup complete! You can now run:');
  console.log('node start-dev.js');
  console.log('to start the development server.\n');
} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}
