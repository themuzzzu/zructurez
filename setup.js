
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting project setup...');

// Run create package.json script if needed
if (!fs.existsSync('package.json')) {
  console.log('Creating package.json...');
  require('./create-package-json.js');
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('node install-dependencies.js', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Make start script executable
try {
  execSync('chmod +x start.sh', { stdio: 'inherit' });
  console.log('Made start.sh executable');
} catch (error) {
  console.error('Failed to make start.sh executable:', error);
}

console.log('\nSetup complete! You can now run:');
console.log('./start.sh');
