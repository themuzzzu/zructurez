
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting project setup...');

// Run create package.json script if needed
if (!fs.existsSync('package.json')) {
  console.log('Creating package.json...');
  require('./create-package-json.js');
}

// Create a temp vite.config.js if it doesn't exist
if (!fs.existsSync('vite.config.js')) {
  console.log('Creating temporary vite.config.js...');
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
  server: {
    port: 3000,
    open: true,
  }
});
`;
  fs.writeFileSync('vite.config.js', viteConfig);
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('node install-dependencies.js', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  console.log('Attempting alternative installation...');
  
  try {
    execSync('npm install vite --save --force', { stdio: 'inherit' });
    console.log('Vite installed directly.');
  } catch (secondError) {
    console.error('Failed to install Vite directly:', secondError);
  }
}

// Make all scripts executable
try {
  const scripts = [
    'start.sh', 
    'alternate-start.sh', 
    'try-vite.sh',
    'run-vite.js',
    'direct-run-vite.js'
  ];
  
  scripts.forEach(script => {
    if (fs.existsSync(script)) {
      execSync(`chmod +x ${script}`, { stdio: 'inherit' });
      console.log(`Made ${script} executable`);
    }
  });
} catch (error) {
  console.error('Failed to make scripts executable:', error);
}

console.log('\nSetup complete! You can now run one of these commands:');
console.log('1. node direct-run-vite.js (Recommended)');
console.log('2. ./try-vite.sh');
console.log('3. npx vite');
console.log('4. node run-vite.js');
