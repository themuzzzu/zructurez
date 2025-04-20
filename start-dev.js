
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const vitePackagePath = path.join(__dirname, 'node_modules/vite');
const viteBinPath = path.join(__dirname, 'node_modules/.bin/vite');

// Check if Vite is installed
if (!fs.existsSync(vitePackagePath)) {
  console.error('Vite package not found. Please run setup-project.js first');
  process.exit(1);
}

// Run Vite directly from node_modules
console.log('Starting Vite development server...');
const vite = spawn(viteBinPath, [], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});
