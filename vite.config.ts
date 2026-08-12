import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold so we don't see noise for vendor chunks
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React runtime & Helmet — cached independently from feature code
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-helmet-async/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Radix UI primitives + Lucide icons — large but stable
          if (id.includes('node_modules/@radix-ui/') ||
              id.includes('node_modules/lucide-react/')) {
            return 'vendor-ui';
          }
          // Networking & toast — rarely changes
          if (id.includes('node_modules/axios/') ||
              id.includes('node_modules/sonner/') ||
              id.includes('node_modules/clsx/') ||
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/tailwind-merge/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
}));
