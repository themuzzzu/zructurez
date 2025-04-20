
#!/bin/bash
echo "Starting Vite development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install first..."
  npm install
fi

# Check if Vite exists in node_modules
if [ ! -f "node_modules/.bin/vite" ]; then
  echo "Vite not found. Installing Vite..."
  npm install --save-dev vite @vitejs/plugin-react-swc
fi

# Make script executable
chmod +x node_modules/.bin/vite

# Run Vite
echo "Starting Vite development server..."
npx vite
