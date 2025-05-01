
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting the application...');

try {
  // Check if node_modules exists, if not run setup
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Missing dependencies. Running setup first...');
    require('./fix-dependencies.js');
  }
  
  console.log('Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Try running fix-dependencies.js first:');
  console.log('  node fix-dependencies.js');
  process.exit(1);
}
