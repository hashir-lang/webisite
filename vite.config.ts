import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // Keep the whole React ecosystem (react, react-dom, router) and the app in
    // one chunk. Splitting them caused a cross-chunk temporal-dead-zone crash
    // ("Cannot access '…' before initialization"). Route-level code-splitting
    // is done with React.lazy in App.tsx instead, which is init-order safe.
    // Only bump the size-warning threshold so CI stays quiet.
    chunkSizeWarningLimit: 1100,
  },
}));
