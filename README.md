
# Project Setup Guide

This project uses Vite as a development server. Due to some configuration limitations, follow these steps to run the project:

## Step 1: Install Dependencies

Run the following command to install the required dependencies:

```bash
node install-dependencies.js
```

This will install:
- vite (development server)
- lucide-react (icon library)

## Step 2: Start the Development Server

Run the following command to start the development server:

```bash
./start.sh
```

Or alternatively:

```bash
node_modules/.bin/vite
```

## Troubleshooting

If you encounter any issues with missing modules:

1. Try running the install script again:
   ```bash
   node install-dependencies.js
   ```

2. If you get permissions errors, make the start script executable:
   ```bash
   chmod +x start.sh
   ```

3. If you're still experiencing issues, try installing the packages manually:
   ```bash
   npm install vite lucide-react --no-save
   ```
