
#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Attempting to start Vite server with enhanced detection...');

// Try to install Vite directly if not found
function installVite() {
  console.log('Attempting to install Vite locally...');
  try {
    execSync('npm install vite@latest --save-dev --force', { stdio: 'inherit' });
    console.log('Vite installation successful!');
    return true;
  } catch (error) {
    console.error('Failed to install Vite:', error.message);
    return false;
  }
}

// Check for local vite in node_modules
const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
let hasLocalVite = fs.existsSync(localVitePath);

if (!hasLocalVite) {
  console.log('No local Vite found, attempting installation...');
  hasLocalVite = installVite();
}

if (hasLocalVite) {
  console.log('Found local Vite installation at:', localVitePath);
  console.log('Starting server with local Vite...');
  
  const viteProcess = spawn(localVitePath, [], { 
    stdio: 'inherit', 
    shell: true,
    env: { ...process.env, PATH: `${path.dirname(localVitePath)}:${process.env.PATH}` }
  });
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start local Vite:', err);
    tryNpxVite();
  });
} else {
  console.log('No local Vite available, trying with npx...');
  tryNpxVite();
}

function tryNpxVite() {
  console.log('Attempting to start Vite using npx...');
  const npxProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  
  npxProcess.on('error', (err) => {
    console.error('Failed to start Vite with npx:', err);
    tryGlobalVite();
  });
}

function tryGlobalVite() {
  console.log('Attempting to start Vite using global installation...');
  try {
    execSync('npm install -g vite', { stdio: 'inherit' });
    const globalProcess = spawn('vite', [], { stdio: 'inherit', shell: true });
    
    globalProcess.on('error', (err) => {
      console.error('Failed to start global Vite:', err);
      console.error('All Vite start methods failed. Please try installing Vite manually with: npm install vite --save-dev');
    });
  } catch (error) {
    console.error('Failed to install global Vite:', error.message);
    console.error('All Vite start methods failed. Please try installing Vite manually with: npm install vite --save-dev');
  }
}
