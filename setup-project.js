
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up project environment...');

try {
  // Install core dependencies
  console.log('\n📦 Installing core dependencies...');
  
  // React and related packages
  console.log('Installing React and related packages...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest', { stdio: 'inherit' });
  
  // UI libraries
  console.log('Installing UI libraries...');
  execSync('npm install @tanstack/react-query@latest sonner@latest', { stdio: 'inherit' });
  execSync('npm install lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  execSync('npm install class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  
  // TypeScript and types
  console.log('Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Vite and plugins
  console.log('Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });

  // Create a simple start script
  const startScript = path.join(__dirname, 'start-dev.sh');
  fs.writeFileSync(startScript, `
#!/bin/bash
echo "Starting development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install first..."
  npm install
fi

# Check if Vite exists in node_modules
if [ ! -f "node_modules/.bin/vite" ]; then
  echo "Vite not found. Installing Vite..."
  npm install --save-dev vite @vitejs/plugin-react-swc
fi

# Make script executable
chmod +x node_modules/.bin/vite

# Run Vite
echo "Starting Vite development server..."
npx vite
`);

  // Make the start script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup-project.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  // Create a batch script for Windows users
  const batchScript = path.join(__dirname, 'start-dev.bat');
  fs.writeFileSync(batchScript, `
@echo off
echo Starting development server...

:: Check if node_modules exists
if not exist "node_modules" (
  echo node_modules not found. Running npm install first...
  call npm install
)

:: Check if Vite exists in node_modules
if not exist "node_modules\\.bin\\vite" (
  echo Vite not found. Installing Vite...
  call npm install --save-dev vite @vitejs/plugin-react-swc
)

:: Run Vite
echo Starting Vite development server...
npx vite
`);

  // Update tsconfig.json to include necessary settings
  let tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log('\nCreating tsconfig.json...');
    fs.writeFileSync(tsconfigPath, `
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
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`);
  }

  // Create tsconfig.node.json if it doesn't exist
  let tsconfigNodePath = path.join(__dirname, 'tsconfig.node.json');
  if (!fs.existsSync(tsconfigNodePath)) {
    console.log('Creating tsconfig.node.json...');
    fs.writeFileSync(tsconfigNodePath, `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`);
  }

  // Create or update package.json with correct scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('Updating package.json scripts...');
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
  } else {
    console.log('Creating basic package.json...');
    fs.writeFileSync(packageJsonPath, `
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
`);
  }

  // Update badge component to include variants
  const badgeComponentDir = path.join(__dirname, 'src/components/ui');
  if (!fs.existsSync(badgeComponentDir)) {
    fs.mkdirSync(badgeComponentDir, { recursive: true });
  }

  const badgePath = path.join(badgeComponentDir, 'badge.tsx');
  fs.writeFileSync(badgePath, `
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
`);

  // Create utils directory and utils.ts
  const utilsDir = path.join(__dirname, 'src/lib');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  const utilsPath = path.join(utilsDir, 'utils.ts');
  fs.writeFileSync(utilsPath, `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);

  console.log('\n✅ Setup complete! Run one of these commands to start the development server:');
  if (process.platform === 'win32') {
    console.log('- start-dev.bat');
  } else {
    console.log('- ./start-dev.sh');
  }
  console.log('- npm run dev');
  
} catch (error) {
  console.error('❌ Error setting up project:', error);
  process.exit(1);
}
