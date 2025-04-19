
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing common project issues...');

try {
  // Install critical dependencies if Vite is missing
  if (!fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
    console.log('Vite not found, installing missing dependencies...');
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  }
  
  // Install DOMPurify types if missing
  if (!fs.existsSync(path.join(__dirname, 'node_modules', '@types', 'dompurify'))) {
    console.log('Installing DOMPurify types...');
    execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
  }
  
  // Install PostCSS and related dependencies
  if (!fs.existsSync(path.join(__dirname, 'node_modules', 'postcss')) || 
      !fs.existsSync(path.join(__dirname, 'node_modules', 'autoprefixer')) ||
      !fs.existsSync(path.join(__dirname, 'node_modules', 'tailwindcss'))) {
    console.log('Installing PostCSS and related dependencies...');
    execSync('npm install --save-dev postcss@latest autoprefixer@latest tailwindcss@latest tailwindcss-animate@latest', { stdio: 'inherit' });
  }

  // Fix permissions on script files
  console.log('Setting correct permissions for script files...');
  if (process.platform !== 'win32') {
    execSync('chmod +x install-deps.js', { stdio: 'inherit' });
    execSync('chmod +x fix-project.js', { stdio: 'inherit' });
  }
  
  // Verify Vite installation one more time
  if (!fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
    console.log('Vite still not found. Installing it directly...');
    execSync('npm install --save-dev vite@latest', { stdio: 'inherit' });
  }
  
  console.log('Project issues fixed!');
  console.log('You can now run: npx vite dev');
} catch (error) {
  console.error('Error fixing project:', error);
  process.exit(1);
}
