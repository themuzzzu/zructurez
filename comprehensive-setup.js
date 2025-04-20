
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
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Install core dependencies
  console.log('\n📦 Installing React, React Router, and Tanstack Query...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest @tanstack/react-query@latest', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\n📦 Installing TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Install UI and utility libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner@latest lucide-react@latest framer-motion@latest dompurify@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });

  // Install Vite and plugins
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  // Ensure vite.config.ts exists
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
  server: {
    port: 8080,
    host: true,
  },
});
`;
    fs.writeFileSync(viteConfigPath, viteConfigContent);
  }
  
  // Create a simple start script to ensure Vite runs correctly
  const startScriptPath = path.join(__dirname, 'start-dev.js');
  console.log('\n📝 Creating start-dev script...');
  const startScriptContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vite development server...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('node_modules not found. Running setup first...');
  require('./comprehensive-setup');
}

// Get path to local Vite installation
const viteBin = path.join(__dirname, 'node_modules', '.bin', 'vite');

if (!fs.existsSync(viteBin)) {
  console.error('Vite not found. Please run comprehensive-setup.js first');
  process.exit(1);
}

console.log('Starting Vite development server using local installation...');

// Spawn Vite process using the local installation
const viteProcess = spawn(viteBin, [], { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite development server:', err);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(\`Vite process exited with code \${code}\`);
  }
});
`;

  fs.writeFileSync(startScriptPath, startScriptContent);

  // Create batch script for Windows users
  const batchScriptPath = path.join(__dirname, 'start-dev.bat');
  console.log('\n📝 Creating Windows batch script...');
  const batchScriptContent = `
@echo off
echo Starting Vite development server...

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
`;

  fs.writeFileSync(batchScriptPath, batchScriptContent);

  // Create shell script for Unix users
  const shellScriptPath = path.join(__dirname, 'start-dev.sh');
  console.log('\n📝 Creating Unix shell script...');
  const shellScriptContent = `
#!/bin/bash
echo "Starting Vite development server..."

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
`;

  fs.writeFileSync(shellScriptPath, shellScriptContent);
  
  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      console.log('\n🔑 Setting executable permissions...');
      execSync('chmod +x comprehensive-setup.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️ Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ Setup complete! You can now run:');
  if (process.platform === 'win32') {
    console.log('start-dev.bat');
  } else {
    console.log('node start-dev.js');
    console.log('or');
    console.log('./start-dev.sh');
  }
  console.log('to start the development server.\n');
} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}
