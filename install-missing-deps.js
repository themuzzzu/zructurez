
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  // Install React and related packages
  console.log('\nInstalling React and related packages...');
  execSync('npm install react@latest react-dom@latest react-router-dom@latest', { stdio: 'inherit' });
  
  // Install TypeScript and types
  console.log('\nInstalling TypeScript and type definitions...');
  execSync('npm install --save-dev typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest', { stdio: 'inherit' });
  
  // Install UI and utility libraries
  console.log('\nInstalling UI and utility libraries...');
  execSync('npm install @tanstack/react-query@latest sonner@latest lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
  
  // Install DOMPurify and its types
  console.log('\nInstalling DOMPurify...');
  execSync('npm install dompurify@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
  
  // Install Vite and plugins
  console.log('\nInstalling Vite and plugins...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  console.log('\nAll missing dependencies have been installed!');
  console.log('You can now run: node start-dev.js');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
