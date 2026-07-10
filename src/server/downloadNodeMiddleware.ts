import { handleDownloadRequest } from "./downloadHandler.js";

type ProviderEnvironment = Record<string, string | undefined>;

export function createDownloadNodeMiddleware(env: ProviderEnvironment) {
  return async (request: any, response: any, next?: () => void) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (!url.pathname.startsWith("/download/")) {
      next?.();
      return;
    }

    await handleDownloadRequest(env, request, response);
  };
}
