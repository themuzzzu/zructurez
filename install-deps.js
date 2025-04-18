
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  // Check if package.json exists
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // Install Vite and its React plugin
    console.log('Installing Vite and React plugin...');
    execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev', { stdio: 'inherit' });
    
    // Make sure we have React and React DOM
    console.log('Installing React dependencies...');
    execSync('npm install react@latest react-dom@latest --save', { stdio: 'inherit' });

    // Run npm install to ensure all dependencies are properly installed
    console.log('Running npm install to ensure all dependencies are up to date...');
    execSync('npm install', { stdio: 'inherit' });
  } else {
    console.error('package.json not found');
    process.exit(1);
  }
  
  console.log('All dependencies installed successfully!');
  console.log('You can now run the application with: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
