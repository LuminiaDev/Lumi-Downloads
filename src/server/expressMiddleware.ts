import type { Plugin } from "vite";
import { createServerApp } from "./app.js";

type ServerEnvironment = Record<string, string | undefined>;

export function expressMiddlewarePlugin(env: ServerEnvironment): Plugin {
  return {
    name: "lumi-express-middleware",
    configurePreviewServer(server) {
      server.middlewares.use(createServerApp(env));
    },
    configureServer(server) {
      server.middlewares.use(createServerApp(env));
    },
  };
}
