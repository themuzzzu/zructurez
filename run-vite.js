
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if node_modules exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));

if (!nodeModulesExists) {
  console.log('Installing dependencies...');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies: ${error}`);
      return;
    }
    console.log(stdout);
    startVite();
  });
} else {
  startVite();
}

function startVite() {
  // Try to run vite directly from node_modules
  const viteProcess = exec('./node_modules/.bin/vite', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Vite: ${error}`);
      console.log('Trying with npx...');
      
      // Fallback to npx if direct execution fails
      const npxProcess = exec('npx vite', (npxError, npxStdout, npxStderr) => {
        if (npxError) {
          console.error(`Error starting Vite with npx: ${npxError}`);
          return;
        }
      });
      
      npxProcess.stdout.pipe(process.stdout);
      npxProcess.stderr.pipe(process.stderr);
      return;
    }
  });
  
  viteProcess.stdout.pipe(process.stdout);
  viteProcess.stderr.pipe(process.stderr);
}
