
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Import postcss config values directly
const postcssConfig = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable TypeScript support
      tsDecorators: true,
      // Remove tsconfig property as it doesn't exist in Options type
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
  css: {
    postcss: postcssConfig,
  },
}));
