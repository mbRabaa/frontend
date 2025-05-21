import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';
  const isDev = mode === 'development';

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      isDev && componentTagger(),
    ].filter(Boolean),
    define: {
      ...(isTest ? {
        'process.env': {
          VITE_API_URL: JSON.stringify('http://localhost:8000'),
          VITE_API_GATEWAY_URL: JSON.stringify('http://localhost:8000'),
        }
      } : {})
    },
    server: {
      host: "::",
      port: 8080,
      proxy: !isTest ? {
        '/api': {
          target: process.env.VITE_API_GATEWAY_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      } : undefined,
    },
   test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.js',
  coverage: {
    provider: 'v8', // Changé depuis 'istanbul'
    reporter: ['text', 'json', 'lcov'],
    reportsDirectory: './coverage',
    include: ['src/**/*.{js,jsx,ts,tsx}'],
    exclude: [
      '**/*.d.ts',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      '**/*.test.{js,jsx,ts,tsx}'
    ]
  },
      deps: {
        optimizer: {
          web: {
            include: [
              '@radix-ui/react-.*',
              'lovable-tagger'
            ],
          },
        },
      },
      testTimeout: 15000,
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      silent: false, // Mieux pour le débogage
    },
    optimizeDeps: {
      include: [
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        // Ajoutez ici d'autres dépendances Radix que vous utilisez
      ],
    },
  };
});