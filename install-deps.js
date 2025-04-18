
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing missing dependencies...');

try {
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    // First install critical dependencies
    console.log('Installing critical dependencies...');
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest lovable-tagger@latest typescript@latest', { stdio: 'inherit' });
    
    // Then React dependencies
    console.log('Installing React dependencies...');
    execSync('npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest --save', { stdio: 'inherit' });

    // Install other essential dependencies
    console.log('Installing UI dependencies...');
    execSync('npm install @radix-ui/react-dialog@latest @radix-ui/react-select@latest @radix-ui/react-scroll-area@latest @radix-ui/react-label@latest --save', { stdio: 'inherit' });

    // Create npm scripts
    console.log('Creating npm scripts...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    };
    
    fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(packageJson, null, 2));
    
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
