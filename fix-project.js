
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing project issues...');

try {
  // Fix BusinessCard.tsx Badge variant issue
  console.log('Fixing Badge variant issue in BusinessCard.tsx...');
  const businessCardPath = path.join(__dirname, 'src/components/BusinessCard.tsx');
  
  if (fs.existsSync(businessCardPath)) {
    let content = fs.readFileSync(businessCardPath, 'utf-8');
    
    // Replace variant="success" with className="bg-green-500 text-white"
    content = content.replace(/variant="success"/g, 'className="bg-green-500 text-white"');
    
    // Replace variant="destructive" with className="bg-red-500 text-white"
    content = content.replace(/variant="destructive"/g, 'className="bg-destructive text-destructive-foreground"');
    
    // Replace variant="outline" with className="bg-background border-border"
    content = content.replace(/variant="outline"/g, 'className="bg-background border-border"');
    
    fs.writeFileSync(businessCardPath, content);
  } else {
    console.log('BusinessCard.tsx not found, skipping fix');
  }

  // Fix permissions on scripts
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-project.js', { stdio: 'inherit' });
      console.log('Fixed script permissions');
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }
  
  console.log('Project fixes completed!');
  console.log('You should now be able to run: npm run dev');
} catch (error) {
  console.error('Error fixing project:', error);
  process.exit(1);
}
