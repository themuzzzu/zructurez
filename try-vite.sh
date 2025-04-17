
#!/bin/bash

# This script tries multiple methods to run Vite

echo "Attempting to run Vite through multiple methods..."

# Method 1: Try node_modules/.bin/vite directly
if [ -f "node_modules/.bin/vite" ]; then
  echo "Method 1: Running local Vite from node_modules..."
  ./node_modules/.bin/vite
  if [ $? -eq 0 ]; then
    exit 0
  else
    echo "Method 1 failed. Trying next method..."
  fi
else
  echo "Local Vite not found in node_modules/.bin"
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

echo "All methods failed. Please check your Node.js and npm installation."
echo "Try running: npm install vite --save --force"
