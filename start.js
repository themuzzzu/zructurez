
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting the application...');

try {
  // Check if node_modules exists, if not run setup
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Missing dependencies. Running fix-all-issues.js first...');
    require('./fix-all-issues.js');
  }
  
  console.log('Starting development server...');
  execSync('npx vite', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting application:', error.message);
  console.log('Try running fix-all-issues.js first:');
  console.log('  node fix-all-issues.js');
  process.exit(1);
}
