
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
    
    // Install React and related dependencies
    console.log('Installing React and related dependencies...');
    execSync('npm install react@latest react-dom@latest', { stdio: 'inherit' });
    execSync('npm install --save-dev @types/react@latest @types/react-dom@latest', { stdio: 'inherit' });

    // Install additional dependencies that are causing errors
    console.log('Installing additional dependencies...');
    execSync('npm install @tanstack/react-query@latest react-router-dom@latest sonner@latest lucide-react@latest framer-motion@latest', { stdio: 'inherit' });
    
    // Install shadcn-ui dependencies
    console.log('Installing shadcn-ui dependencies...');
    execSync('npm install @radix-ui/react-dialog@latest @radix-ui/react-select@latest @radix-ui/react-scroll-area@latest @radix-ui/react-label@latest @radix-ui/react-alert-dialog@latest', { stdio: 'inherit' });
    
    // Install DOMPurify with its types
    console.log('Installing DOMPurify...');
    execSync('npm install dompurify@latest', { stdio: 'inherit' });
    execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });

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
