
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vite development server...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('node_modules not found. Running setup first...');
  require('./setup');
}

// Get path to local Vite installation
const viteBin = path.join(__dirname, 'node_modules', '.bin', 'vite');

if (!fs.existsSync(viteBin)) {
  console.error('Vite not found. Please run setup.js first');
  process.exit(1);
}

console.log('Starting Vite development server using local installation...');

// Spawn Vite process using the local installation
const viteProcess = spawn(viteBin, [], { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite development server:', err);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
});
