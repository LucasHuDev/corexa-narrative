import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Split heavy vendors out of the main bundle so they cache independently
    // and don't block first paint on the home page.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("topojson")) return "three";
          if (id.includes("gsap")) return "gsap";
          if (id.includes("react-router")) return "router";
          if (id.includes("react-dom") || id.includes("scheduler")) return "react-dom";
          if (id.includes("/react/")) return "react";
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
