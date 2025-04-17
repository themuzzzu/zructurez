
#!/bin/bash

# This script tries multiple methods to run Vite

echo "==================================="
echo "Comprehensive Vite Launch Utility"
echo "==================================="

# Make sure node_modules/.bin is in PATH
export PATH="$PATH:$(pwd)/node_modules/.bin"

# First, check if package.json exists
if [ ! -f "package.json" ]; then
  echo "Package.json not found, creating it..."
  node create-package-json.js
fi

# Method 1: Try node_modules/.bin/vite directly (after checking it exists)
if [ -f "node_modules/.bin/vite" ]; then
  echo "Method 1: Running local Vite from node_modules..."
  chmod +x node_modules/.bin/vite
  ./node_modules/.bin/vite
  if [ $? -eq 0 ]; then
    exit 0
  else
    echo "Method 1 failed. Trying next method..."
  fi
else
  echo "Local Vite not found in node_modules/.bin - attempting installation"
  npm install vite --save-dev --force
  
  if [ -f "node_modules/.bin/vite" ]; then
    echo "Installation successful! Running local Vite..."
    chmod +x node_modules/.bin/vite
    ./node_modules/.bin/vite
    if [ $? -eq 0 ]; then
      exit 0
    else
      echo "Installation succeeded but execution failed. Trying next method..."
    fi
  else
    echo "Vite installation failed. Trying next method..."
  fi
fi

# Method 2: Try using npx
echo "Method 2: Using npx to run Vite..."
npx vite
if [ $? -eq 0 ]; then
  exit 0
else
  echo "Method 2 failed. Trying next method..."
fi

# Method 3: Install Vite globally and try again
echo "Method 3: Installing Vite globally and running..."
npm install -g vite
if [ $? -eq 0 ]; then
  vite
  if [ $? -eq 0 ]; then
    exit 0
  fi
else
  echo "Failed to install Vite globally."
fi

# Method 4: Try with Node.js script
echo "Method 4: Using Node.js script to run Vite..."
node run-vite.js
if [ $? -eq 0 ]; then
  exit 0
else
  echo "Method 4 failed."
fi

# Method 5: Try direct npm run command
echo "Method 5: Using npm run dev..."
npm run dev
if [ $? -eq 0 ]; then
  exit 0
else
  echo "Method 5 failed."
fi

echo "All methods failed. This may be a system-specific issue."
echo "Try these manual steps:"
echo "1. Run: npm install vite --save-dev --force"
echo "2. Run: npx vite"
echo "3. Check your Node.js installation with: node --version"
