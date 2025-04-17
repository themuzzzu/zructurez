
#!/bin/bash

# Check if node_modules exists, install if not
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Try to start Vite from node_modules first
if [ -f "node_modules/.bin/vite" ]; then
    echo "Running Vite from node_modules..."
    ./node_modules/.bin/vite
else
    # Fallback to npx
    echo "Running Vite with npx..."
    npx vite
fi
