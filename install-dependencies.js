
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
console.log('Installing dependencies...');
try {
  // Install dependencies globally in the project
  execSync('npm install vite@latest lucide-react@latest react@latest react-dom@latest @vitejs/plugin-react@latest --save --force', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Verify vite installation
  if (existsSync('node_modules/.bin/vite')) {
    console.log('Vite successfully installed!');
  } else {
    console.error('Vite installation verification failed! Installing again directly...');
    execSync('npm install vite@latest --save --force', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });
  }
  
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Create a more robust start script
const startScript = `
#!/bin/bash
# Check if node_modules/.bin/vite exists
if [ -f "node_modules/.bin/vite" ]; then
  echo "Starting Vite development server..."
  # Execute vite directly
  ./node_modules/.bin/vite
else
  echo "Vite not found in node_modules. Installing dependencies..."
  node install-dependencies.js
  if [ -f "node_modules/.bin/vite" ]; then
    echo "Starting Vite development server..."
    ./node_modules/.bin/vite
  else
    echo "ERROR: Vite installation failed. Attempting alternative method..."
    npx vite
  fi
fi
`;

writeFileSync('start.sh', startScript);
execSync('chmod +x start.sh', { stdio: 'inherit' });

console.log('\nSetup complete!');
console.log('To start the development server, run:');
console.log('./start.sh\n');
