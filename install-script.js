
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing critical dependencies...');

try {
  // Install Vite and related packages
  console.log('Installing Vite and related packages...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  // Install DOMPurify types
  console.log('Installing DOMPurify types...');
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });

  console.log('All dependencies installed successfully!');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
