
# Project Setup Guide

This project uses Vite as a development server with React and TypeScript.

## Quick Start

The simplest way to run this project is:

```bash
# Run the direct runner script
node direct-run.js
```

This script will:
1. Create necessary files if they don't exist
2. Install required dependencies
3. Start the Vite development server

## Alternative Start Methods

If the direct runner doesn't work, try these methods in order:

```bash
# Method 1: Using npm run
npm run dev

# Method 2: Using npx directly
npx vite

# Method 3: Using local node_modules binary
./node_modules/.bin/vite
```

## Manual Installation Steps (If Automatic Setup Fails)

If all automatic methods fail, try these manual steps:

1. Install Vite and its dependencies:
```bash
npm install vite @vitejs/plugin-react react react-dom --save-dev --force
```

2. Try running Vite directly:
```bash
npx vite
```

## Troubleshooting

If you encounter issues:

1. Make sure Node.js is installed and up to date (v16+ recommended)
2. Check npm is working correctly with `npm --version`
3. Try clearing npm cache: `npm cache clean --force`
4. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
5. Check `vite.config.js` exists and is correctly formatted
6. Try running with Node directly: `node ./node_modules/vite/bin/vite.js`
