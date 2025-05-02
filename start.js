
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting the application...');

try {
  // Check if node_modules exists, if not run setup
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Missing dependencies. Running fix-all.js first...');
    require('./fix-all.js');
  }
  
  console.log('Starting development server...');
  execSync('node start-dev.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Try running fix-all.js first:');
  console.log('  node fix-all.js');
  process.exit(1);
}
