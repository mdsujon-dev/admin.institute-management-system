import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path in tsconfig.app.json.
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // The antd chunk is deliberately large and deliberately separate: it is
    // cached across deploys, so warning about it every build is just noise.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        /**
         * Ant Design and React change far less often than the app does, so they
         * are split out to stay in the browser cache across deployments.
         */
        manualChunks: {
          react: ["react", "react-dom", "react-router"],
          antd: ["antd", "@ant-design/icons"],
          charts: ["apexcharts", "react-apexcharts"],
          redux: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
