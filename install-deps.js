
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  // Check if package.json exists
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // Check if vite is installed
    try {
      require.resolve('vite');
      console.log('Vite is already installed.');
    } catch (e) {
      console.log('Installing Vite...');
      execSync('npm install vite@latest --save-dev', { stdio: 'inherit' });
      console.log('Vite installed successfully.');
    }
  } else {
    console.error('package.json not found');
    process.exit(1);
  }
  
  console.log('All dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
