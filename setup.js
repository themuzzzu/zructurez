
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive project setup...');

try {
  // Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  
  // Install UI libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner lucide-react framer-motion dompurify class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  
  // Install dev dependencies
  console.log('\n📦 Installing TypeScript and dev dependencies...');
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node @types/dompurify', { stdio: 'inherit' });
  
  // Install Vite and plugins
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  
  // Create lib/utils.ts file for cn utility
  const libDir = path.join(__dirname, 'src/lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const utilsPath = path.join(libDir, 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    console.log('\n📝 Creating utility functions...');
    fs.writeFileSync(utilsPath, `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);
  }

  // Fix the badge component to support variant prop
  const badgeComponentDir = path.join(__dirname, 'src/components/ui');
  if (!fs.existsSync(badgeComponentDir)) {
    fs.mkdirSync(badgeComponentDir, { recursive: true });
  }

  // Update package.json scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('\n📝 Updating package.json scripts...');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Make script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ Setup complete! Run `npm run dev` to start the development server.');
} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}
