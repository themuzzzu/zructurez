
#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Direct Vite Launch Utility');

// Ensure vite.config.js exists
if (!fs.existsSync('vite.config.js')) {
  console.log('Creating vite.config.js...');
  const config = `
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      server: {
        port: 3000
      }
    });
  `;
  fs.writeFileSync('vite.config.js', config);
}

// Ensure dependencies are installed
try {
  if (!fs.existsSync('node_modules/vite')) {
    console.log('Installing vite dependency...');
    execSync('npm install vite@latest --save-dev --force', { stdio: 'inherit' });
  }
  
  if (!fs.existsSync('node_modules/@vitejs/plugin-react')) {
    console.log('Installing @vitejs/plugin-react dependency...');
    execSync('npm install @vitejs/plugin-react@latest --save-dev --force', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Dependency installation failed:', error.message);
}

// First try: Use npx vite
console.log('Attempting to start Vite with npx...');
const npxProcess = spawn('npx', ['vite'], { 
  stdio: 'inherit',
  shell: true
});

npxProcess.on('error', (error) => {
  console.error('npx vite failed:', error.message);
  console.log('Attempting direct node_modules path...');
  
  // Second try: Use vite from node_modules/.bin directly
  const viteBinPath = path.resolve('./node_modules/.bin/vite');
  
  if (fs.existsSync(viteBinPath)) {
    const directProcess = spawn(viteBinPath, [], { 
      stdio: 'inherit',
      shell: true 
    });
    
    directProcess.on('error', (err) => {
      console.error('Direct vite bin execution failed:', err.message);
      console.error('Please try installing Vite manually with: npm install vite --save-dev --force');
    });
  } else {
    console.error('Vite binary not found in node_modules/.bin');
    console.error('Please try installing Vite manually with: npm install vite --save-dev --force');
  }
});
