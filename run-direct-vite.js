
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Direct Vite Runner');

// Ensure vite is installed locally
function ensureViteInstalled() {
  console.log('📦 Checking Vite installation...');
  
  // First check if it's already installed
  if (fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
    console.log('✅ Vite already installed.');
    return true;
  }
  
  console.log('🔄 Installing Vite and React dependencies...');
  
  try {
    // Force install vite and critical dependencies
    execSync('npm install vite@latest @vitejs/plugin-react@latest react@latest react-dom@latest --save-dev --force', {
      stdio: 'inherit',
      timeout: 60000
    });
    
    return fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'));
  } catch (error) {
    console.error('❌ Failed to install Vite:', error.message);
    return false;
  }
}

// Start Vite directly using the local installation
function startLocalVite() {
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  console.log('🚀 Starting Vite from local path:', localVitePath);
  
  const viteProcess = spawn(localVitePath, [], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  viteProcess.on('error', (error) => {
    console.error('❌ Failed to start Vite:', error.message);
    console.log('🔄 Trying alternate methods...');
    tryNpxVite();
  });
}

// Try using npx to run Vite
function tryNpxVite() {
  console.log('🔄 Trying to run Vite with npx...');
  
  const npxProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true
  });
  
  npxProcess.on('error', (error) => {
    console.error('❌ Failed to run with npx:', error.message);
    console.log('⚠️ Please try installing Vite manually:');
    console.log('    npm install vite @vitejs/plugin-react react react-dom --save-dev');
    console.log('    npx vite');
  });
}

// Main execution
if (ensureViteInstalled()) {
  startLocalVite();
} else {
  console.log('⚠️ Could not install Vite. Trying with npx...');
  tryNpxVite();
}
