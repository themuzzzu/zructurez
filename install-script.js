
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing critical dependencies...');

try {
  // Install Vite and related packages
  console.log('Installing Vite and related packages...');
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  
  // Install DOMPurify types
  console.log('Installing DOMPurify types...');
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });

  // Add npm scripts to package.json
  console.log('Updating package.json scripts...');
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Make the script executable
  if (process.platform !== 'win32') {
    execSync('chmod +x install-script.js', { stdio: 'inherit' });
  }

  console.log('All dependencies installed successfully!');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
