
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting comprehensive dependency installation...');

try {
  // Install React and core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  
  // Install UI and utility libraries
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner lucide-react framer-motion dompurify', { stdio: 'inherit' });
  
  // Install dev dependencies
  console.log('\n📦 Installing TypeScript and dev dependencies...');
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node @types/dompurify', { stdio: 'inherit' });
  
  // Install Vite
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  
  // Update package.json scripts if needed
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Make all scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x install-script.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ All dependencies installed successfully! Run `npm run dev` to start the development server.');
} catch (error) {
  console.error('❌ Error installing dependencies:', error);
  process.exit(1);
}
