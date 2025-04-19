
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing common project issues...');

try {
  // Install critical dependencies if Vite is missing
  if (!fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
    console.log('Vite not found, installing missing dependencies...');
    execSync('node install-deps.js', { stdio: 'inherit' });
  }

  // Fix permissions on script files
  console.log('Setting correct permissions for script files...');
  if (process.platform !== 'win32') {
    execSync('chmod +x install-deps.js', { stdio: 'inherit' });
    execSync('chmod +x fix-project.js', { stdio: 'inherit' });
  }
  
  console.log('Project issues fixed!');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('Error fixing project:', error);
  process.exit(1);
}
