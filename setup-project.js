
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up project dependencies and configurations...');

try {
  // Install required dependencies
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev @types/dompurify@latest', { stdio: 'inherit' });
  execSync('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
  execSync('npm install dompurify@latest', { stdio: 'inherit' });

  // Create dompurify types folder if it doesn't exist
  const typesDir = path.join(__dirname, 'src/types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Create a DOMPurify declaration file
  const dompurifyDTSPath = path.join(typesDir, 'dompurify.d.ts');
  const dompurifyContent = `
/// <reference types="@types/dompurify" />

declare module 'dompurify' {
  export interface DOMPurifyI {
    sanitize(
      source: string | Node,
      config?: {
        ALLOWED_TAGS?: string[],
        ALLOWED_ATTR?: string[],
        [key: string]: any
      }
    ): string;
    setConfig(config: object): DOMPurifyI;
    addHook(hook: string, callback: Function): DOMPurifyI;
    removeHook(hook: string): DOMPurifyI;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
  }

  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
}

declare global {
  interface Window {
    DOMPurify: import('dompurify').DOMPurifyI;
  }
}
`;
  
  fs.writeFileSync(dompurifyDTSPath, dompurifyContent);
  console.log('Created DOMPurify type definition file');

  // Create a start script that launches Vite directly
  const startScriptPath = path.join(__dirname, 'start-dev.js');
  const startScriptContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const vitePackagePath = path.join(__dirname, 'node_modules/vite');
const viteBinPath = path.join(__dirname, 'node_modules/.bin/vite');

// Check if Vite is installed
if (!fs.existsSync(vitePackagePath)) {
  console.error('Vite package not found. Please run setup-project.js first');
  process.exit(1);
}

// Run Vite directly from node_modules
console.log('Starting Vite development server...');
const vite = spawn(viteBinPath, [], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(\`Vite process exited with code \${code}\`);
});
`;

  fs.writeFileSync(startScriptPath, startScriptContent);
  console.log('Created start script for Vite');

  // Make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x setup-project.js', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      console.log('Made scripts executable');
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
  
  console.log('\nSetup complete! You can now run:');
  console.log('node start-dev.js');
  console.log('to start the development server.\n');
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
