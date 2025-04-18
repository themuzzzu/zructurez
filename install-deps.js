
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  // Check if package.json exists
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // Install Vite
    try {
      require.resolve('vite');
      console.log('Vite is already installed.');
    } catch (e) {
      console.log('Installing Vite...');
      execSync('npm install vite@latest --save-dev', { stdio: 'inherit' });
      console.log('Vite installed successfully.');
    }

    // Make sure we have the necessary Vite plugins for React
    try {
      require.resolve('@vitejs/plugin-react-swc');
      console.log('@vitejs/plugin-react-swc is already installed.');
    } catch (e) {
      console.log('Installing @vitejs/plugin-react-swc...');
      execSync('npm install @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
      console.log('@vitejs/plugin-react-swc installed successfully.');
    }

    // Ensure we have React and React DOM
    try {
      require.resolve('react');
      console.log('React is already installed.');
    } catch (e) {
      console.log('Installing React...');
      execSync('npm install react react-dom --save', { stdio: 'inherit' });
      console.log('React installed successfully.');
    }

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
