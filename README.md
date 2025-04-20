
# React TypeScript Project

This is a React TypeScript project using Vite, React Router, TanStack Query, and other modern libraries.

## Getting Started

### First-time Setup

If this is your first time running the project, run the comprehensive setup script to ensure all dependencies are installed:

```bash
# On Windows
node comprehensive-setup.js

# On macOS/Linux
chmod +x comprehensive-setup.js
./comprehensive-setup.js
```

### Running the Development Server

To start the development server, you can use one of the following methods:

**Using NPM:**
```bash
npm run dev
```

**Using the start scripts:**
```bash
# On Windows
start-dev.bat

# On macOS/Linux
node start-dev.js
# OR
chmod +x start-dev.sh
./start-dev.sh
```

## Project Structure

- `/src` - Source code
  - `/components` - UI components
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
  - `/utils` - Utility functions

## Troubleshooting

If you encounter missing dependency errors, run:

```bash
node install-missing-deps.js
```

This will install all required dependencies without modifying your existing project structure.
