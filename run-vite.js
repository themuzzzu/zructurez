
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Attempting to start Vite server...');

// Check for local vite in node_modules
const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
const hasLocalVite = fs.existsSync(localVitePath);

if (hasLocalVite) {
  console.log('Found local Vite installation, starting server...');
  const viteProcess = spawn(localVitePath, [], { stdio: 'inherit', shell: true });
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start local Vite:', err);
    tryNpxVite();
  });
} else {
  console.log('No local Vite found, trying with npx...');
  tryNpxVite();
}

function tryNpxVite() {
  console.log('Attempting to start Vite using npx...');
  const npxProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  
  npxProcess.on('error', (err) => {
    console.error('Failed to start Vite with npx:', err);
    console.error('Please try installing Vite manually with: npm install -g vite');
  });
}
