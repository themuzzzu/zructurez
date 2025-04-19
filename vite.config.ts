
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import autoprefixer from "autoprefixer";
import tailwindcssPlugin from "@tailwindcss/postcss";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable TypeScript support
      tsDecorators: true,
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
    postcss: {
      plugins: [
        tailwindcssPlugin(),
        autoprefixer(),
      ],
    },
  },
}));
