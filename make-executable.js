
const { execSync } = require('child_process');

try {
  console.log('Making scripts executable...');
  execSync('chmod +x start.sh run-direct-vite.js', { stdio: 'inherit' });
  console.log('Scripts are now executable!');
} catch (error) {
  console.error('Failed to make scripts executable:', error.message);
  console.log('Please run: chmod +x start.sh run-direct-vite.js');
}
