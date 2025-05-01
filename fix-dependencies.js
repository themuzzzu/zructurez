
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing project dependencies and configuration...');

try {
  // Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest @tanstack/react-query@latest', { stdio: 'inherit' });
  
  // Install UI libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner@latest lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  execSync('npm install class-variance-authority@latest tailwind-merge@latest clsx@latest', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Fix Tailwind CSS PostCSS issue
  console.log('\n📦 Installing Tailwind CSS with PostCSS...');
  execSync('npm install --save-dev @tailwindcss/postcss@latest postcss@latest tailwindcss@latest', { stdio: 'inherit' });
  
  // Install Vite
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });

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

  // Update vite.config.js to include PostCSS configuration
  console.log('\n📝 Updating Vite configuration...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import postcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [postcss],
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

  // Create a mock data service for Supabase
  const mockDataDir = path.join(__dirname, 'src/lib');
  console.log('\n📝 Creating mock data service...');
  fs.writeFileSync(path.join(mockDataDir, 'supabase.ts'), `
// Mock data for the marketplace products
export const getMockSearchResults = (category = "product") => {
  // Return different products depending on the category
  return mockProducts.filter(p => 
    category === "all" ? true : p.category.toLowerCase() === category.toLowerCase()
  );
};

const mockProducts = [
  {
    id: "1",
    title: "Wireless Headphones",
    price: 2499,
    original_price: 3999,
    isDiscounted: true,
    discount_percentage: "38",
    brand: "SoundMax",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "SoundMax Official",
    isSponsored: true,
    rating: 4.5,
    reviews: 238
  },
  {
    id: "2",
    title: "Smart Watch Series 7",
    price: 3299,
    original_price: 3999,
    isDiscounted: true,
    discount_percentage: "18",
    brand: "TechWear",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "TechWear Official",
    isSponsored: false,
    rating: 4.7,
    reviews: 542
  },
  {
    id: "3",
    title: "Cotton T-shirt",
    price: 899,
    original_price: null,
    isDiscounted: false,
    brand: "Comfy Wear",
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842717?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "Fashion Outlet",
    isSponsored: false,
    rating: 4.3,
    reviews: 156
  },
  {
    id: "4",
    title: "Stainless Steel Water Bottle",
    price: 799,
    original_price: 1199,
    isDiscounted: true,
    discount_percentage: "33",
    brand: "EcoLife",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "EcoLife Store",
    isSponsored: false,
    rating: 4.8,
    reviews: 320
  },
  {
    id: "5",
    title: "Organic Face Moisturizer",
    price: 1199,
    original_price: null,
    isDiscounted: false,
    brand: "NatureCare",
    category: "beauty",
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "Beauty Essentials",
    isSponsored: true,
    rating: 4.6,
    reviews: 210
  },
  {
    id: "6",
    title: "Yoga Mat Premium",
    price: 1499,
    original_price: 1999,
    isDiscounted: true,
    discount_percentage: "25",
    brand: "FitLife",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "FitLife Gear",
    isSponsored: false,
    rating: 4.5,
    reviews: 175
  },
  {
    id: "7",
    title: "Bestselling Novel",
    price: 599,
    original_price: null,
    isDiscounted: false,
    brand: "PublishCo",
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "Book Haven",
    isSponsored: false,
    rating: 4.7,
    reviews: 320
  },
  {
    id: "8",
    title: "Kids Building Blocks",
    price: 899,
    original_price: 1299,
    isDiscounted: true,
    discount_percentage: "30",
    brand: "ToyJoy",
    category: "toys",
    imageUrl: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "Kids Paradise",
    isSponsored: true,
    rating: 4.4,
    reviews: 198
  },
  {
    id: "9",
    title: "Indoor Plant Kit",
    price: 1299,
    original_price: null,
    isDiscounted: false,
    brand: "GreenThumb",
    category: "garden",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    provider: "Plant World",
    isSponsored: false,
    rating: 4.9,
    reviews: 87
  }
];
`);

  // Create start-dev.js script
  console.log('\n📝 Creating development startup script...');
  const startDevContent = `
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting development server...');

try {
  // Check if node_modules exists, if not run npm install
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Missing dependencies. Running npm install first...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  console.log('Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error);
  process.exit(1);
}
`;
  fs.writeFileSync(path.join(__dirname, 'start-dev.js'), startDevContent.trim());

  // Make scripts executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-dependencies.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  // Update package.json with proper scripts
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

  // Create marketplace components directory if it doesn't exist
  const marketplaceComponentsDir = path.join(__dirname, 'src/components/marketplace');
  if (!fs.existsSync(marketplaceComponentsDir)) {
    fs.mkdirSync(marketplaceComponentsDir, { recursive: true });
  }

  // Create CategoryIconGrid.tsx
  console.log('\n📝 Creating CategoryIconGrid component...');
  fs.writeFileSync(path.join(marketplaceComponentsDir, 'CategoryIconGrid.tsx'), `
import React from 'react';
import { Smartphone, Shirt, Home, Brush, Dumbbell, BookOpen, Toy, Leaf } from 'lucide-react';

type CategoryIconGridProps = {
  onCategorySelect: (category: string) => void;
}

export const CategoryIconGrid = ({ onCategorySelect }: CategoryIconGridProps) => {
  const categories = [
    { name: "Electronics", icon: <Smartphone className="h-6 w-6" />, color: "bg-blue-100 text-blue-600" },
    { name: "Fashion", icon: <Shirt className="h-6 w-6" />, color: "bg-pink-100 text-pink-600" },
    { name: "Home", icon: <Home className="h-6 w-6" />, color: "bg-yellow-100 text-yellow-600" },
    { name: "Beauty", icon: <Brush className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
    { name: "Sports", icon: <Dumbbell className="h-6 w-6" />, color: "bg-green-100 text-green-600" },
    { name: "Books", icon: <BookOpen className="h-6 w-6" />, color: "bg-orange-100 text-orange-600" },
    { name: "Toys", icon: <Toy className="h-6 w-6" />, color: "bg-red-100 text-red-600" },
    { name: "Garden", icon: <Leaf className="h-6 w-6" />, color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
          className={\`flex flex-col items-center justify-center p-4 rounded-lg transition-all \${category.color} hover:scale-105\`}
        >
          {category.icon}
          <span className="mt-2 text-xs font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
};
`);

  // Create CategoryNavigationBar.tsx
  console.log('\n📝 Creating CategoryNavigationBar component...');
  fs.writeFileSync(path.join(marketplaceComponentsDir, 'CategoryNavigationBar.tsx'), `
import React from 'react';

type CategoryNavigationBarProps = {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryNavigationBar = ({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}: CategoryNavigationBarProps) => {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={\`px-3 py-1 text-sm whitespace-nowrap rounded-full transition-all
              \${activeCategory === category
                ? 'bg-primary text-white font-medium'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
              }\`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
`);

  // Create hooks directory for business hooks
  const businessHooksDir = path.join(__dirname, 'src/components/business/hooks');
  if (!fs.existsSync(businessHooksDir)) {
    fs.mkdirSync(businessHooksDir, { recursive: true });
  }

  // Create useBusinessLikes.ts hook
  console.log('\n📝 Creating useBusinessLikes hook...');
  fs.writeFileSync(path.join(businessHooksDir, 'useBusinessLikes.ts'), `
import { useState, useEffect } from 'react';

export const useBusinessLikes = (businessId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load initial like status from localStorage or fetch from an API
  useEffect(() => {
    // For demo purposes, use localStorage
    const likedBusinesses = JSON.parse(localStorage.getItem('likedBusinesses') || '{}');
    setIsLiked(!!likedBusinesses[businessId]);
    
    // Generate a random number of likes for demo purposes
    // In a real app, this would come from an API
    setLikesCount(Math.floor(Math.random() * 200) + 5);
  }, [businessId]);
  
  const toggleLike = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API here
      // For demo purposes, we'll just use localStorage
      const likedBusinesses = JSON.parse(localStorage.getItem('likedBusinesses') || '{}');
      
      if (isLiked) {
        delete likedBusinesses[businessId];
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        likedBusinesses[businessId] = true;
        setLikesCount(prev => prev + 1);
      }
      
      localStorage.setItem('likedBusinesses', JSON.stringify(likedBusinesses));
      setIsLiked(!isLiked);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLiked,
    likesCount,
    toggleLike,
    isLoading
  };
};
`);

  // Create a providers directory
  const providersDir = path.join(__dirname, 'src/providers');
  if (!fs.existsSync(providersDir)) {
    fs.mkdirSync(providersDir, { recursive: true });
  }

  // Create NetworkMonitor.tsx
  console.log('\n📝 Creating NetworkMonitor provider...');
  fs.writeFileSync(path.join(providersDir, 'NetworkMonitor.tsx'), `
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
`);

  // Create a pages directory
  const pagesDir = path.join(__dirname, 'src/pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  // Create MarketplaceHub.tsx
  console.log('\n📝 Creating MarketplaceHub page...');
  fs.writeFileSync(path.join(pagesDir, 'MarketplaceHub.tsx'), `
import React from 'react';
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";

const MarketplaceHub = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Marketplace Hub</h1>
      <MarketplaceContent />
    </div>
  );
};

export default MarketplaceHub;
`);

  // Create a hooks directory
  const hooksDir = path.join(__dirname, 'src/hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Create use-toast.ts
  console.log('\n📝 Creating use-toast hook...');
  fs.writeFileSync(path.join(hooksDir, 'use-toast.ts'), `
import { toast } from 'sonner';

export { toast, useToast };

export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
};

// Re-export the useToast hook for compatibility with consumers
const useToast = () => {
  return { toast };
};
`);

  // Create a ui components directory
  const uiComponentsDir = path.join(__dirname, 'src/components/ui');
  if (!fs.existsSync(uiComponentsDir)) {
    fs.mkdirSync(uiComponentsDir, { recursive: true });
  }

  // Create card component
  console.log('\n📝 Creating Card component...');
  fs.writeFileSync(path.join(uiComponentsDir, 'card.tsx'), `
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`);

  // Create button component
  console.log('\n📝 Creating Button component...');
  fs.writeFileSync(path.join(uiComponentsDir, 'button.tsx'), `
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`);

  // Create badge component
  console.log('\n📝 Creating Badge component...');
  fs.writeFileSync(path.join(uiComponentsDir, 'badge.tsx'), `
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
`);

  // Create tabs component
  console.log('\n📝 Creating Tabs component...');
  fs.writeFileSync(path.join(uiComponentsDir, 'tabs.tsx'), `
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
`);

  // Create ErrorView component for error handling
  const componentsDir = path.join(__dirname, 'src/components');
  console.log('\n📝 Creating ErrorView component...');
  fs.writeFileSync(path.join(componentsDir, 'ErrorView.tsx'), `
import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorView = () => {
  const error = useRouteError() as any;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-gray-700 mb-2">
            {error?.statusText || error?.message || 'An unexpected error occurred.'}
          </p>
          {error?.stack && (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mr-2"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
`);

  // Create RedirectHandler component
  console.log('\n📝 Creating RedirectHandler component...');
  fs.writeFileSync(path.join(componentsDir, 'RedirectHandler.tsx'), `
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle legacy URLs or redirects here
    // This is just an example setup
    if (location.pathname === '/old-path') {
      navigate('/new-path', { replace: true });
    }
  }, [location, navigate]);
  
  // This component doesn't render anything
  return null;
};
`);

  // Create index.css that uses @tailwindcss/postcss
  console.log('\n📝 Creating index.css...');
  fs.writeFileSync(path.join(__dirname, 'src/index.css'), `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 60 4.8% 95.9%;
  --secondary-foreground: 24 9.8% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 60 9.1% 97.8%;
  --success: 142 70% 49%;
  --success-foreground: 0 0% 100%;
}

body {
  font-family: var(--font-sans);
}

/* Make scrollbars nicer on all browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
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
  plugins: [require("tailwindcss-animate")],
}
`;
  fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig.trim());

  console.log('\n✅ All dependencies and configurations have been fixed!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run the development server using: node start-dev.js');
  console.log('   or use: npm run dev');

} catch (error) {
  console.error('\n❌ Error fixing dependencies:', error);
  process.exit(1);
}
