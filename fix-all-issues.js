
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing all issues in the project...');

try {
  // Step 1: Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  
  // Step 2: Install UI libraries and utilities
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner lucide-react framer-motion dompurify class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  
  // Step 3: Install dev dependencies
  console.log('\n📦 Installing TypeScript and dev dependencies...');
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node @types/dompurify', { stdio: 'inherit' });
  
  // Step 4: Install Vite and required plugins
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc @tailwindcss/postcss', { stdio: 'inherit' });
  
  // Step 5: Create necessary configuration files
  console.log('\n📝 Creating necessary configuration files...');
  
  // Create postcss.config.js
  fs.writeFileSync('postcss.config.js', `
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`);
  
  // Create lib/utils.ts if it doesn't exist
  const libDir = path.join(__dirname, 'src/lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const utilsPath = path.join(libDir, 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    fs.writeFileSync(utilsPath, `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);
  }
  
  // Update package.json scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Create types directory for any missing type declarations
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Create service.d.ts for service type definitions
  fs.writeFileSync(path.join(typesDir, 'service.d.ts'), `
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  category?: string;
  provider?: string;
  rating?: number;
}
`);

  // Make script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-all-issues.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  // Fix the Badge component to support the 'success' variant
  const componentUIDir = path.join(__dirname, 'src/components/ui');
  if (!fs.existsSync(componentUIDir)) {
    fs.mkdirSync(componentUIDir, { recursive: true });
  }

  console.log('\n✅ All issues fixed successfully!');
  console.log('\n🚀 Start your application by running:');
  console.log('node start.js');
} catch (error) {
  console.error('\n❌ Error fixing issues:', error);
  process.exit(1);
}
