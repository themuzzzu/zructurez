
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
  execSync('npm install --save-dev postcss@latest tailwindcss@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev @tailwindcss/postcss@latest', { stdio: 'inherit' });
  
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
  css: {
    postcss: './postcss.config.js'
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

  // Fix badge component issues by implementing the variant prop
  const uiComponentsDir = path.join(__dirname, 'src/components/ui');
  if (!fs.existsSync(uiComponentsDir)) {
    fs.mkdirSync(uiComponentsDir, { recursive: true });
  }

  console.log('\n📝 Creating Badge component with proper variants...');
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

  // Create a button component
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

  // Create a starter App.tsx
  console.log('\n📝 Creating starter App.tsx...');
  const appContent = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<div className="p-8 text-center">Welcome to the application!</div>} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
`;
  fs.writeFileSync(path.join(__dirname, 'src/App.tsx'), appContent.trim());

  // Create index.html if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'index.html'))) {
    console.log('\n📝 Creating index.html...');
    const indexHtmlContent = `
<!DOCTYPE html>
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
    fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtmlContent.trim());
  }

  // Create main.tsx if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'src/main.tsx'))) {
    console.log('\n📝 Creating main.tsx...');
    const mainTsxContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    fs.writeFileSync(path.join(__dirname, 'src/main.tsx'), mainTsxContent.trim());
  }

  // Make scripts executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-dependencies.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ All dependencies and configurations have been fixed!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run npm run dev to start the development server');

} catch (error) {
  console.error('\n❌ Error fixing dependencies:', error);
  process.exit(1);
}
