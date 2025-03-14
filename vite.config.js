import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
