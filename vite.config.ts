import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { downloadMiddlewarePlugin } from "./src/server/downloadMiddleware";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [downloadMiddlewarePlugin(env), react(), tailwindcss()],
  };
});

