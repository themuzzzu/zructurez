
const { execSync } = require('child_process');
const { existsSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

// Ensure node_modules directory exists
if (!existsSync('node_modules')) {
  mkdirSync('node_modules');
}

// Create .npmrc to avoid permissions issues
writeFileSync('.npmrc', 'save-exact=true\nlegacy-peer-deps=true\n');

// Install the necessary packages
console.log('Installing vite, react-dom, react and lucide-react...');
try {
  execSync('npm install vite@latest lucide-react@latest react@latest react-dom@latest @vitejs/plugin-react@latest --no-save', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Create a simple start script
const startScript = `
#!/bin/bash
# Check if node_modules/.bin/vite exists
if [ -f "node_modules/.bin/vite" ]; then
  # Execute vite directly
  node_modules/.bin/vite
else
  echo "Vite not found in node_modules. Installing dependencies..."
  node install-dependencies.js
  node_modules/.bin/vite
fi
`;

writeFileSync('start.sh', startScript);
execSync('chmod +x start.sh', { stdio: 'inherit' });

console.log('\nSetup complete!');
console.log('To start the development server, run:');
console.log('./start.sh\n');
