
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting the application...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Missing node_modules. Running setup first...');
  require('./setup');
}

// Run the development server
const viteProcess = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start development server:', err);
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
});
