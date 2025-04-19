
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import postcss from '@tailwindcss/postcss';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      tsDecorators: true,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [postcss],
    },
  },
  server: {
    port: 8080,
    host: true,
    hmr: {
      overlay: false, // Disable the error overlay
    },
  },
}));
