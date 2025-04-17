
#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Direct Vite Runner');

// Ensure package.json exists
if (!fs.existsSync('package.json')) {
  console.log('📄 Creating package.json...');
  const packageJson = {
    "name": "vite_react_shadcn_ts",
    "version": "0.0.0",
    "type": "module",
    "private": true,
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.451.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

// Create index.html if it doesn't exist
if (!fs.existsSync('index.html')) {
  console.log('📄 Creating index.html...');
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
  `;
  fs.writeFileSync('index.html', html.trim());
}

// Create main.tsx if it doesn't exist
const srcDir = path.join(__dirname, 'src');
if (!fs.existsSync(srcDir)) {
  console.log('📁 Creating src directory...');
  fs.mkdirSync(srcDir, { recursive: true });
}

if (!fs.existsSync(path.join(srcDir, 'main.tsx'))) {
  console.log('📄 Creating main.tsx...');
  const mainTsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
  `;
  fs.writeFileSync(path.join(srcDir, 'main.tsx'), mainTsx.trim());
}

// Create App.tsx if it doesn't exist
if (!fs.existsSync(path.join(srcDir, 'App.tsx'))) {
  console.log('📄 Creating App.tsx...');
  const appTsx = `
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
  `;
  fs.writeFileSync(path.join(srcDir, 'App.tsx'), appTsx.trim());
}

// Create index.css if it doesn't exist
if (!fs.existsSync(path.join(srcDir, 'index.css'))) {
  console.log('📄 Creating index.css...');
  const css = `
body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
  `;
  fs.writeFileSync(path.join(srcDir, 'index.css'), css.trim());
}

// Create App.css if it doesn't exist
if (!fs.existsSync(path.join(srcDir, 'App.css'))) {
  console.log('📄 Creating App.css...');
  const css = `
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}
  `;
  fs.writeFileSync(path.join(srcDir, 'App.css'), css.trim());
}

// Ensure vite.config.js exists
if (!fs.existsSync('vite.config.js') && !fs.existsSync('vite.config.ts')) {
  console.log('📄 Creating vite.config.js...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});
`;
  fs.writeFileSync('vite.config.js', viteConfig.trim());
}

// Force install critical dependencies directly
console.log('📦 Installing critical dependencies...');
try {
  execSync('npm install vite@latest @vitejs/plugin-react@latest react@latest react-dom@latest --save-dev --force', { 
    stdio: 'inherit',
    timeout: 60000
  });
  console.log('✅ Dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('⚠️ Will attempt to run with existing packages...');
}

// Function to try different ways of starting Vite
async function tryStartVite() {
  console.log('🔄 Attempting to start Vite server...');
  
  // Method 1: Try node_modules/.bin/vite
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  if (fs.existsSync(localVitePath)) {
    console.log('🔍 Found local Vite at', localVitePath);
    console.log('🚀 Starting with local Vite...');
    
    const localProcess = spawn(localVitePath, [], { 
      stdio: 'inherit',
      shell: true
    });
    
    return new Promise((resolve) => {
      localProcess.on('error', (err) => {
        console.error('❌ Local Vite failed:', err.message);
        resolve(false);
      });
      
      // This means it's running successfully
      localProcess.on('exit', (code) => {
        if (code !== 0) {
          console.log(`❌ Local Vite exited with code ${code}`);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
  
  // Method 2: Try npx vite
  console.log('🔄 Trying with npx vite...');
  const npxProcess = spawn('npx', ['vite'], { 
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve) => {
    npxProcess.on('error', (err) => {
      console.error('❌ npx vite failed:', err.message);
      resolve(false);
    });
    
    // This means it's running successfully
    npxProcess.on('exit', (code) => {
      if (code !== 0) {
        console.log(`❌ npx vite exited with code ${code}`);
        resolve(false);
      }
      resolve(true);
    });
  });
}

// Start Vite
tryStartVite().then(success => {
  if (!success) {
    console.error('❌ All methods to start Vite have failed');
    console.log('Please try the following steps manually:');
    console.log('1. Run: npm install vite @vitejs/plugin-react --save-dev --force');
    console.log('2. Run: npx vite');
    process.exit(1);
  }
});
