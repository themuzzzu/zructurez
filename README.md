
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

After setup is complete, start the development server:

```bash
./start.sh
```

## Manual Setup (if needed)

If the automatic setup doesn't work, you can run these steps manually:

1. Install dependencies directly:
```bash
npm install vite@latest lucide-react@latest react@latest react-dom@latest @vitejs/plugin-react@latest --force
```

2. Make the start script executable:
```bash
chmod +x start.sh
```

3. Start the development server:
```bash
./node_modules/.bin/vite
```

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js is installed and up to date
2. Check that you have write permissions in the project directory
3. If you get "command not found" errors, try running scripts with `node` prefix, e.g., `node install-dependencies.js`
4. If you encounter issues with icon imports, make sure the type declarations are correctly loaded
5. If "vite not found" error persists, verify that the vite package is installed in node_modules by running:
```bash
ls -la node_modules/.bin/vite
```
