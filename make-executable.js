
const fs = require('fs');
const { exec } = require('child_process');

// Make start.sh executable
exec('chmod +x start.sh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error making start.sh executable: ${error}`);
    return;
  }
  console.log('Made start.sh executable. You can now run ./start.sh to start the development server.');
});
