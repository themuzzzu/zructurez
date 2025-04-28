
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing missing dependencies and fixing project issues...');

try {
  // Install all required dependencies
  console.log('\n📦 Installing core dependencies...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest', { stdio: 'inherit' });
  execSync('npm install @tanstack/react-query@latest sonner@latest', { stdio: 'inherit' });
  execSync('npm install lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  execSync('npm install class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Install Vite and its plugin
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  // Make required directories
  console.log('\n📂 Creating necessary directories...');
  const directories = [
    'src/lib',
    'src/components/ui',
    'src/types',
  ];
  
  for (const dir of directories) {
    if (!fs.existsSync(path.join(__dirname, dir))) {
      fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
    }
  }
  
  // Create lib/utils.ts for shadcn
  console.log('\n📝 Creating utility functions...');
  const utilsPath = path.join(__dirname, 'src/lib/utils.ts');
  const utilsContent = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  fs.writeFileSync(utilsPath, utilsContent.trim());
  
  // Create the Badge component with variant support
  console.log('\n📝 Creating Badge component with variant support...');
  const badgePath = path.join(__dirname, 'src/components/ui/badge.tsx');
  const badgeContent = `
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
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
`;
  fs.writeFileSync(badgePath, badgeContent.trim());
  
  // Create Vite environment declaration
  console.log('\n📝 Creating Vite environment declaration...');
  const viteEnvPath = path.join(__dirname, 'src/vite-env.d.ts');
  const viteEnvContent = `/// <reference types="vite/client" />`;
  fs.writeFileSync(viteEnvPath, viteEnvContent);
  
  // Create custom types for the project
  console.log('\n📝 Creating custom type declarations...');
  
  const customTypesPath = path.join(__dirname, 'src/types/custom.d.ts');
  const customTypesContent = `
// Extended React types for components
import { ReactNode } from 'react';

// Extend BadgeProps to include variant
declare module '@/components/ui/badge' {
  export interface BadgeProps {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
    children?: ReactNode;
  }
}

// Fix for React component props
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      children?: ReactNode;
    }
  }
}

export {};
`;
  fs.writeFileSync(customTypesPath, customTypesContent.trim());
  
  // Create supabase client stub if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'src/integrations/supabase'))) {
    console.log('\n📝 Creating Supabase client stub...');
    const supabaseDir = path.join(__dirname, 'src/integrations/supabase');
    fs.mkdirSync(supabaseDir, { recursive: true });
    
    const supabaseClientPath = path.join(supabaseDir, 'client.ts');
    const supabaseClientContent = `
// This is a stub for the Supabase client
// Replace with actual implementation when connecting to Supabase

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        limit: () => ({ data: [], error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      limit: () => ({ data: [], error: null }),
    }),
    insert: () => ({ error: null }),
    delete: () => ({ eq: () => ({ error: null }) }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};
`;
    fs.writeFileSync(supabaseClientPath, supabaseClientContent.trim());
  }
  
  // Create vite.config.ts
  console.log('\n📝 Creating Vite configuration...');
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
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
  },
});
`;
  fs.writeFileSync(viteConfigPath, viteConfigContent.trim());
  
  // Create tsconfig.node.json if it doesn't exist
  const tsconfigNodePath = path.join(__dirname, 'tsconfig.node.json');
  if (!fs.existsSync(tsconfigNodePath)) {
    console.log('\n📝 Creating Node TypeScript configuration...');
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
  
  // Update package.json if it exists to add scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('\n📝 Updating package.json scripts...');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  // Create a starter tsconfig extension file that doesn't modify the main tsconfig.json
  console.log('\n📝 Creating TypeScript configuration extension...');
  const tsconfigExtPath = path.join(__dirname, 'tsconfig.extend.json');
  const tsconfigExtContent = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
  fs.writeFileSync(tsconfigExtPath, tsconfigExtContent);
  
  // Create NetworkMonitor provider if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'src/providers'))) {
    console.log('\n📝 Creating NetworkMonitor provider...');
    const providersDir = path.join(__dirname, 'src/providers');
    fs.mkdirSync(providersDir, { recursive: true });
    
    const networkMonitorPath = path.join(providersDir, 'NetworkMonitor.tsx');
    const networkMonitorContent = `
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NetworkContextType {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType>({ isOnline: true });

export const useNetworkStatus = () => useContext(NetworkContext);

export const NetworkMonitorProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
};
`;
    fs.writeFileSync(networkMonitorPath, networkMonitorContent.trim());
  }
  
  // Create routes directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'src/routes'))) {
    console.log('\n📝 Creating routes...');
    const routesDir = path.join(__dirname, 'src/routes');
    fs.mkdirSync(routesDir, { recursive: true });
    
    const userRoutesPath = path.join(routesDir, 'userRoutes.tsx');
    const userRoutesContent = `
import { RouteObject } from "react-router-dom";

export const userRoutes: RouteObject[] = [
  // Add your user routes here
];
`;
    fs.writeFileSync(userRoutesPath, userRoutesContent.trim());
  }
  
  // Create start-dev.js script for easy startup
  console.log('\n📝 Creating start-dev.js script...');
  const startDevPath = path.join(__dirname, 'start-dev.js');
  const startDevContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vite development server...');

// Check if Vite is installed
const viteBinPath = path.join(__dirname, 'node_modules/.bin/vite');
if (!fs.existsSync(viteBinPath)) {
  console.error('Vite not found in node_modules/.bin.');
  console.log('Running install-missing-dependencies.js first...');
  require('./install-missing-dependencies');
}

// Run Vite directly
console.log('Starting development server...');
const viteProcess = spawn(viteBinPath, [], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(\`Vite process exited with code \${code}\`);
});
`;
  fs.writeFileSync(startDevPath, startDevContent.trim());
  
  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    console.log('\n🔑 Setting executable permissions...');
    try {
      execSync('chmod +x install-missing-dependencies.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
  
  // Create an index.html file if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'index.html'))) {
    console.log('\n📝 Creating index.html...');
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Business Directory App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtmlContent);
  }
  
  console.log('\n✅ All issues fixed! Run these commands to start the project:');
  console.log('1. node start-dev.js');
  console.log('\nAlternatively:');
  console.log('1. npm run dev');
} catch (error) {
  console.error('\n❌ Error fixing issues:', error);
  process.exit(1);
}
