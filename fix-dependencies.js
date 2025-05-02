
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing project dependencies and configuration...');

try {
  // Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  
  // Install UI libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner lucide-react framer-motion', { stdio: 'inherit' });
  execSync('npm install class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  execSync('npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-aspect-ratio', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node', { stdio: 'inherit' });
  
  // Fix Tailwind CSS issue
  console.log('\n📦 Installing Tailwind CSS with proper configuration...');
  execSync('npm install --save-dev tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  execSync('npm install --save-dev @tailwindcss/postcss', { stdio: 'inherit' });
  
  // Install Vite
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });

  // Create postcss.config.js
  console.log('\n📝 Creating PostCSS configuration...');
  const postcssConfig = `
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
  fs.writeFileSync(path.join(__dirname, 'postcss.config.js'), postcssConfig.trim());

  // Update vite.config.js
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
  server: {
    port: 8080,
    host: true,
  },
});
`;
  fs.writeFileSync(path.join(__dirname, 'vite.config.js'), viteConfig.trim());

  // Create a lib/utils.ts file for cn utility
  const utilsDir = path.join(__dirname, 'src/lib');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  console.log('\n📝 Creating utility functions...');
  fs.writeFileSync(path.join(utilsDir, 'utils.ts'), `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);

  // Create tailwind.config.js
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
`;
  fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig.trim());

  // Create index.css for Tailwind
  console.log('\n📝 Creating CSS with Tailwind directives...');
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

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}
`;
  
  // Make sure src directory exists
  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent.trim());

  // Create tsconfig.json
  console.log('\n📝 Creating TypeScript configuration...');
  const tsconfigContent = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
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
  fs.writeFileSync(path.join(__dirname, 'tsconfig.json'), tsconfigContent.trim());
  
  // Create tsconfig.node.json
  console.log('\n📝 Creating Node TypeScript configuration...');
  const tsconfigNodeContent = `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}`;
  fs.writeFileSync(path.join(__dirname, 'tsconfig.node.json'), tsconfigNodeContent.trim());

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

  console.log('\n✅ All dependencies and configurations have been fixed!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run npm run dev to start the development server');

} catch (error) {
  console.error('\n❌ Error fixing dependencies:', error);
  process.exit(1);
}
