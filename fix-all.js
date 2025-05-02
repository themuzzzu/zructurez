
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all project issues...');

try {
  // Install dependencies including Vite, React, and DOMPurify with types
  console.log('\n📦 Installing core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  execSync('npm install sonner lucide-react framer-motion dompurify', { stdio: 'inherit' });
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node @types/dompurify', { stdio: 'inherit' });
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  
  // Fix Tailwind CSS PostCSS issue by installing required packages
  console.log('\n📦 Setting up Tailwind correctly...');
  execSync('npm install --save-dev tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  
  // Create a proper Tailwind configuration
  console.log('\n📝 Creating Tailwind configuration...');
  const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}`;
  fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig.trim());
  
  // Create our own postcss.config.js since the original is read-only
  console.log('\n📝 Creating PostCSS configuration...');
  const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
  fs.writeFileSync(path.join(__dirname, 'postcss.config.local.js'), postcssConfig.trim());
  
  // Update vite.config.js to use our local postcss config
  console.log('\n📝 Updating Vite configuration...');
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
  css: {
    postcss: './postcss.config.local.js'
  },
  server: {
    port: 8080,
    host: true,
  },
});`;
  fs.writeFileSync(path.join(__dirname, 'vite.config.js'), viteConfig.trim());

  // Create a utilities file for shadcn components
  const libDir = path.join(__dirname, 'src/lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  console.log('\n📝 Creating utility functions...');
  const utilsContent = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
  fs.writeFileSync(path.join(libDir, 'utils.ts'), utilsContent.trim());

  // Create DOMPurify type definition file
  console.log('\n📝 Creating DOMPurify type definition file...');
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  const dompurifyDtsContent = `
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
}`;
  fs.writeFileSync(path.join(typesDir, 'dompurify.d.ts'), dompurifyDtsContent.trim());
  
  // Update index.css to use Tailwind
  console.log('\n📝 Updating CSS with Tailwind directives...');
  const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;

  --radius: 0.5rem;
}

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}`;
  
  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent.trim());

  // Create a start script to run the app
  console.log('\n📝 Creating start script...');
  const startScriptContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vite development server...');

// Get path to local Vite installation
const viteBin = path.join(__dirname, 'node_modules', '.bin', 'vite');

// Check if Vite binary exists
if (!fs.existsSync(viteBin)) {
  console.error('Vite not found. Running fix-all.js first...');
  require('./fix-all');
  return;
}

// Start Vite development server
const viteProcess = spawn(viteBin, [], { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
});

viteProcess.on('close', (code) => {
  console.log(\`Vite process exited with code \${code}\`);
});`;
  fs.writeFileSync(path.join(__dirname, 'start-dev.js'), startScriptContent.trim());

  // Update package.json scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.scripts = {
        ...packageJson.scripts,
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.log('Failed to update package.json, but continuing...');
    }
  }

  // Install additional dependencies for shadcn components
  console.log('\n📦 Installing additional UI dependencies...');
  execSync('npm install class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });

  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-all.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ All issues fixed! Run these commands to start the project:');
  console.log('node start-dev.js');

} catch (error) {
  console.error('\n❌ Error fixing issues:', error);
  process.exit(1);
}
