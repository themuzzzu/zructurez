
#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  console.log('Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error);
  process.exit(1);
}
