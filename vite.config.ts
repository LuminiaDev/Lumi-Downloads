import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { expressMiddlewarePlugin } from "./src/server/expressMiddleware";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [expressMiddlewarePlugin(env), react(), tailwindcss()],
  };
});

