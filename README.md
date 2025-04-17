
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
4. Make all utility scripts executable

## Starting the Development Server

After setup is complete, try these methods in order until one works:

```bash
# Method 1: Using the direct run script (Most reliable)
node direct-run-vite.js

# Method 2: Using the comprehensive launch utility
./try-vite.sh

# Method 3: Using npx directly
npx vite

# Method 4: Using the run-vite.js script
node run-vite.js
```

## Manual Installation Steps (If Automatic Setup Fails)

If the automatic setup doesn't work, try these manual steps:

1. Install Vite first:
```bash
npm install vite --save-dev --force
```

2. Install other dependencies:
```bash
npm install @vitejs/plugin-react react react-dom lucide-react --save --force
```

3. Try running Vite directly:
```bash
npx vite
```

## Troubleshooting

If you encounter issues:

1. Make sure Node.js is installed and up to date (v14+ recommended)
2. Check that you have write permissions in the project directory
3. Try cleaning npm cache: `npm cache clean --force`
4. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
5. If behind a proxy, configure npm with:
   - `npm config set proxy http://your-proxy:port`
   - `npm config set https-proxy http://your-proxy:port`
6. Try running with Node directly: `node ./node_modules/vite/bin/vite.js`
7. Check npm logs for more details: `npm logs`

## System Requirements

- Node.js v14.18+ or 16+
- npm or yarn
