
const { execSync } = require('child_process');
const { existsSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const path = require('path');

// Ensure node_modules directory exists
if (!existsSync('node_modules')) {
  mkdirSync('node_modules');
}

// Create .npmrc to avoid permissions issues
writeFileSync('.npmrc', 'save-exact=true\nlegacy-peer-deps=true\n');

// Install the necessary packages
console.log('Installing dependencies...');
try {
  // Install dependencies with explicit save flag
  console.log('Installing Vite and related packages...');
  execSync('npm install vite@latest --save --force', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  console.log('Installing React and related packages...');
  execSync('npm install react@latest react-dom@latest @vitejs/plugin-react@latest lucide-react@latest --save --force', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Verify vite installation
  if (existsSync(path.join('node_modules', '.bin', 'vite'))) {
    console.log('✓ Vite successfully installed!');
  } else {
    console.error('! Vite binary not found in node_modules/.bin');
    console.log('Trying global installation as fallback...');
    execSync('npm install -g vite', {
      stdio: 'inherit'
    });
    console.log('✓ Vite installed globally as fallback');
  }
  
  console.log('✓ Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  console.log('Error details:', error.message);
}

// Create a more robust start script
const startScript = `#!/bin/bash

echo "Starting Vite development server..."

# Try local vite first
if [ -f "node_modules/.bin/vite" ]; then
  echo "Using locally installed Vite..."
  ./node_modules/.bin/vite
elif command -v npx > /dev/null; then
  echo "Using npx to run Vite..."
  npx vite
elif command -v vite > /dev/null; then
  echo "Using globally installed Vite..."
  vite
else
  echo "ERROR: Vite not found. Attempting to install it now..."
  npm install vite --save --force
  
  if [ -f "node_modules/.bin/vite" ]; then
    echo "Vite installed successfully. Starting server..."
    ./node_modules/.bin/vite
  else
    echo "CRITICAL ERROR: Could not install Vite. Please check your npm configuration."
    exit 1
  fi
fi
`;

writeFileSync('start.sh', startScript);
execSync('chmod +x start.sh', { stdio: 'inherit' });

// Create an alternative start script using npx
const alternateScript = `#!/bin/bash

# Alternative start script using npx for more reliable execution
echo "Starting Vite server using npx..."
npx vite
`;

writeFileSync('alternate-start.sh', alternateScript);
execSync('chmod +x alternate-start.sh', { stdio: 'inherit' });

console.log('\nSetup complete!');
console.log('To start the development server, try these commands in order:');
console.log('1. ./start.sh');
console.log('2. npx vite');
console.log('3. ./alternate-start.sh\n');
