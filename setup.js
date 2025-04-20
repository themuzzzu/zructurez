
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting project setup...');

try {
  // Run npm install first to ensure all dependencies are installed
  console.log('\n=== INSTALLING BASE DEPENDENCIES ===');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install critical dependencies
  console.log('\n=== INSTALLING CRITICAL DEPENDENCIES ===');
  execSync('npm install react react-dom @tanstack/react-query react-router-dom sonner lucide-react framer-motion', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/react @types/react-dom typescript @types/node', { stdio: 'inherit' });
  
  // Install DOMPurify types explicitly
  console.log('\n=== INSTALLING DOMPURIFY TYPES ===');
  execSync('npm install dompurify', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/dompurify', { stdio: 'inherit' });
  
  // Install Vite and React plugin explicitly
  console.log('\n=== INSTALLING VITE AND PLUGINS ===');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  
  // Verify Vite installation
  console.log('\n=== VERIFYING VITE INSTALLATION ===');
  try {
    // Use npx to ensure we run the local installation
    execSync('npx vite --version', { stdio: 'inherit' });
    console.log('Vite is installed correctly.');
  } catch (error) {
    console.log('Issue with Vite installation, reinstalling...');
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
    execSync('npm install', { stdio: 'inherit' }); // Run npm install again to fix dependencies
  }
  
  // Make sure npm scripts are set up correctly
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('Updating package.json scripts...');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  console.log('\n=== SETUP COMPLETE ===');
  console.log('You can now run the project with: npm run dev');
  
  // Make script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
