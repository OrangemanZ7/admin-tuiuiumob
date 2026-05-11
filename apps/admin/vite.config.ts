import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Faz o Vite escutar em todos os IPs da rede (essencial para o celular)
    host: true,

    // 2. Se você usa /api para falar com o seu backend, configure o proxy aqui
    proxy: {
      "/api": {
        target: "http://192.168.1.10:3000", // Substitua pela porta real do seu BACKEND
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
