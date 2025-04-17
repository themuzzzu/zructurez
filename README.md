
# Project Setup Guide

This project uses Vite as a development server with React and TypeScript. Follow these steps to set up and run the project:

## Quick Setup

Run the setup script to install all dependencies:

```bash
node setup.js
```

This will:
1. Create necessary configuration files
2. Install required dependencies (vite, react, lucide-react)
3. Set up the start script

## Starting the Development Server

After setup is complete, try these methods in order until one works:

```bash
# Method 1: Using the main start script
./start.sh

# Method 2: Using npx directly
npx vite

# Method 3: Using the alternate start script
./alternate-start.sh
```

## Manual Setup (if automatic setup fails)

If the automatic setup doesn't work, try these manual steps:

1. Install Vite first:
```bash
npm install vite --save --force
```

2. Install other dependencies:
```bash
npm install react react-dom @vitejs/plugin-react lucide-react --save --force
```

3. Try running Vite directly:
```bash
./node_modules/.bin/vite
```

## Troubleshooting

If you encounter issues:

1. Make sure Node.js is installed and up to date (v14+ recommended)
2. Check that you have write permissions in the project directory
3. Try these alternative commands:
   - `npx vite` (Uses npx to run Vite without a local installation)
   - `npm exec vite` (Alternative to npx)
   - `npm install -g vite && vite` (Install Vite globally and run)
4. Check if npm is working correctly with: `npm -v`
5. If you're behind a corporate proxy, configure npm with:
   - `npm config set proxy http://your-proxy:port`
   - `npm config set https-proxy http://your-proxy:port`
6. On Windows systems, try running commands from PowerShell or Git Bash instead of CMD
7. Clear npm cache with: `npm cache clean --force`
8. Check for permission issues: `ls -la node_modules/.bin/`
