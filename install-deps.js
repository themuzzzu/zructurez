
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // Install Vite and critical development dependencies
    console.log('Installing Vite and critical development dependencies...');
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest typescript@latest @types/node@latest', { stdio: 'inherit' });
    
    // Install DOMPurify with its types
    console.log('Installing DOMPurify...');
    execSync('npm install dompurify@latest', { stdio: 'inherit' });
    execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });

    // Additional dependencies for project
    console.log('Installing React and related dependencies...');
    execSync('npm install react@latest react-dom@latest', { stdio: 'inherit' });
    execSync('npm install --save-dev @types/react@latest @types/react-dom@latest', { stdio: 'inherit' });

    // Ensure npm scripts are set up
    console.log('Creating npm scripts...');
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

    // Make sure the scripts have the correct permissions
    if (process.platform !== 'win32') {
      try {
        execSync('chmod +x install-deps.js', { stdio: 'inherit' });
      } catch (error) {
        console.log('Failed to set permissions, but continuing...');
      }
    }

    // Final npm install to ensure everything is in place
    console.log('Running final npm install...');
    execSync('npm install', { stdio: 'inherit' });
  } else {
    console.error('package.json not found');
    process.exit(1);
  }
  
  console.log('All dependencies installed successfully!');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
