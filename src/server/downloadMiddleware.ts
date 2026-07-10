import type { Plugin } from "vite";
import { createDownloadNodeMiddleware } from "./downloadNodeMiddleware.js";

type ProviderEnvironment = Record<string, string | undefined>;

export function downloadMiddlewarePlugin(env: ProviderEnvironment): Plugin {
  const middleware = createDownloadNodeMiddleware(env);

  return {
    name: "lumi-download-middleware",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
