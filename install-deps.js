
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // Install Vite and its React plugin
    console.log('Installing Vite and React plugin...');
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest lovable-tagger@latest', { stdio: 'inherit' });
    
    // Make sure we have React and React DOM
    console.log('Installing React dependencies...');
    execSync('npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest --save', { stdio: 'inherit' });

    // Install other essential dependencies for shadcn/UI
    console.log('Installing other UI dependencies...');
    execSync('npm install @radix-ui/react-label@latest @radix-ui/react-dialog@latest @radix-ui/react-select@latest @radix-ui/react-scroll-area@latest class-variance-authority@latest clsx@latest lucide-react@latest tailwindcss-animate@latest --save', { stdio: 'inherit' });

    // Run npm install to ensure all dependencies are properly installed
    console.log('Running npm install to ensure all dependencies are up to date...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Create a simple script to run the dev server
    console.log('Creating npm scripts...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    packageJson.scripts.dev = 'vite';
    packageJson.scripts.build = 'vite build';
    packageJson.scripts.preview = 'vite preview';
    
    fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(packageJson, null, 2));
  } else {
    console.error('package.json not found');
    process.exit(1);
  }
  
  console.log('All dependencies installed successfully!');
  console.log('You can now run the application with: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
