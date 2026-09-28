import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/dashboard": "http://localhost:8080",
      "/reports": "http://localhost:8080",
      "/schedulers": "http://localhost:8080",
      "/policies": "http://localhost:8080",
      "/dlq": "http://localhost:8080"
    }
  }
});
