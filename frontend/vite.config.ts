import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'global': {},
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer/",
      process: "process/browser",
      events: "events",
      // Fix for ~@fontsource imports in @uniswap/widgets
      "~@fontsource": "@fontsource",
      // Fix for ethers v5 imports in Uniswap SDKs - Map explicitly to installed v5 alias
      "ethers": "ethers-v5",
    },
  },
}));
