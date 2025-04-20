
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Get path to local Vite installation
const viteBin = path.join(__dirname, 'node_modules', '.bin', 'vite');

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
