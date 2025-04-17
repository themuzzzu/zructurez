
const fs = require('fs');

// Only create package.json if it doesn't exist
if (!fs.existsSync('package.json')) {
  const packageJson = {
    "name": "vite_react_shadcn_ts",
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "lucide-react": "^0.263.1",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('package.json created successfully');
}
