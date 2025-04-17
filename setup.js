
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

// Make start scripts executable
try {
  execSync('chmod +x start.sh', { stdio: 'inherit' });
  execSync('chmod +x alternate-start.sh', { stdio: 'inherit' });
  console.log('Made start scripts executable');
} catch (error) {
  console.error('Failed to make start scripts executable:', error);
}

console.log('\nSetup complete! You can now run:');
console.log('./start.sh');
console.log('If that fails, try: npx vite');
console.log('Or: ./alternate-start.sh');
