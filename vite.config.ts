import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Configuration commune
const commonConfig = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    process.env.NODE_ENV === 'development' && componentTagger(),
  ].filter(Boolean),
};

// Solution 1 : Valeur par défaut explicite
const API_GATEWAY_URL = process.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

// Configuration spécifique au mode
export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';
  
  return {
    ...commonConfig,
    server: isTest ? {
      host: "::",
      port: 8080,
    } : {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: API_GATEWAY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    test: isTest ? {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js'
    } : undefined,
  };
});