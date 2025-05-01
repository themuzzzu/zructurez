
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing project dependencies and configuration...');

try {
  // Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react@^18 react-dom@^18 react-router-dom@^6 @tanstack/react-query@^4', { stdio: 'inherit' });
  
  // Install UI libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner@latest lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  execSync('npm install class-variance-authority@latest tailwind-merge@latest clsx@latest', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@^18 @types/react-dom@^18 @types/node@latest', { stdio: 'inherit' });
  
  // Fix Tailwind CSS PostCSS issue
  console.log('\n📦 Installing Tailwind CSS with PostCSS...');
  execSync('npm install --save-dev postcss@latest tailwindcss@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev @tailwindcss/postcss@latest', { stdio: 'inherit' });
  
  // Install Vite
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react@latest', { stdio: 'inherit' });

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
import react from '@vitejs/plugin-react';
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

  --primary: 222.2 47.4% 11.2%;
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

  // Create a simple App.tsx
  console.log('\n📝 Creating basic App.tsx...');
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
  fs.writeFileSync(path.join(srcDir, 'App.tsx'), appContent.trim());

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
  if (!fs.existsSync(path.join(srcDir, 'main.tsx'))) {
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
    fs.writeFileSync(path.join(srcDir, 'main.tsx'), mainTsxContent.trim());
  }

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

  // Create starter script to help run the application
  console.log('\n📝 Creating start script...');
  const startScriptContent = `
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting the application...');

try {
  // Check if node_modules exists, if not run setup
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Missing dependencies. Running setup first...');
    require('./fix-project.js');
  }
  
  console.log('Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Try running fix-project.js first:');
  console.log('  node fix-project.js');
  process.exit(1);
}
`;
  fs.writeFileSync(path.join(__dirname, 'start.js'), startScriptContent.trim());

  // Make scripts executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-project.js', { stdio: 'inherit' });
      execSync('chmod +x start.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ All dependencies and configurations have been fixed!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run node start.js to start the development server');

} catch (error) {
  console.error('\n❌ Error fixing dependencies:', error);
  process.exit(1);
}
