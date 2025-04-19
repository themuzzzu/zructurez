
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting project setup...');

try {
  // Run install-deps.js first
  console.log('\n=== INSTALLING DEPENDENCIES ===');
  execSync('node install-deps.js', { stdio: 'inherit' });
  
  // Run fix-project.js second
  console.log('\n=== FIXING PROJECT ISSUES ===');
  execSync('node fix-project.js', { stdio: 'inherit' });
  
  console.log('\n=== SETUP COMPLETE ===');
  console.log('You can now run the project with: npm run dev');
  
  // Make script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
