
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing all issues in the project...');

try {
  // Step 1: Install core dependencies
  console.log('\n📦 Installing React and core dependencies...');
  execSync('npm install react react-dom react-router-dom @tanstack/react-query', { stdio: 'inherit' });
  
  // Step 2: Install UI libraries and utilities
  console.log('\n📦 Installing UI and utility libraries...');
  execSync('npm install sonner lucide-react framer-motion dompurify class-variance-authority tailwind-merge clsx', { stdio: 'inherit' });
  
  // Step 3: Install dev dependencies
  console.log('\n📦 Installing TypeScript and dev dependencies...');
  execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node @types/dompurify', { stdio: 'inherit' });
  
  // Step 4: Install Vite and required plugins
  console.log('\n📦 Installing Vite and plugins...');
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc autoprefixer tailwindcss postcss', { stdio: 'inherit' });
  
  // Step 5: Install Supabase SDK and auth helpers
  console.log('\n📦 Installing Supabase SDK...');
  execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
  
  // Step 6: Create or update necessary configuration files
  console.log('\n📝 Creating necessary configuration files...');
  
  // Update postcss.config.js
  fs.writeFileSync('postcss.config.js', `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);
  
  // Update src/components/ui/badge.tsx to include success variant
  const badgeFilePath = path.join(__dirname, 'src/components/ui/badge.tsx');
  if (fs.existsSync(badgeFilePath)) {
    let badgeContent = fs.readFileSync(badgeFilePath, 'utf-8');
    
    if (!badgeContent.includes('success:')) {
      badgeContent = badgeContent.replace(
        'variants: {\n      variant: {',
        'variants: {\n      variant: {\n        success:\n          "border-transparent bg-green-500 text-white hover:bg-green-600",'
      );
      
      fs.writeFileSync(badgeFilePath, badgeContent, 'utf-8');
      console.log('✅ Added success variant to Badge component');
    }
  }

  // Make this script executable
  if (process.platform !== 'win32') {
    try {
      execSync('chmod +x fix-all-issues.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to set permissions, but continuing...');
    }
  }

  console.log('\n✅ All issues fixed successfully!');
  console.log('\n🚀 Start your application by running:');
  console.log('npm run dev');
} catch (error) {
  console.error('\n❌ Error fixing issues:', error);
  process.exit(1);
}
