import type { Plugin } from "vite";
import { createProviderSources } from "../config/providerFactory";
import type { VersionEntry } from "../types";
import { sortEntries } from "../utils/versioning";

type ProviderEnvironment = Record<string, string | undefined>;

function parseDownloadPath(pathname: string) {
  const [download, branch, target] = pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (download !== "download" || !branch || !target) {
    return null;
  }

  if (target === "latest") {
    return { branch, type: "latest" as const };
  }

  return { branch, fileName: target, type: "file" as const };
}

async function loadEntries(env: ProviderEnvironment) {
  const providers = createProviderSources(env);
  const result = await Promise.all(providers.map(provider => provider.loadEntries()));
  return sortEntries(
    result.flat(),
    providers.map(provider => provider.branch)
  );
}

function findLatestEntry(entries: VersionEntry[], branch: string) {
  return entries.find(entry => entry.branch === branch) ?? null;
}

function findFileEntry(entries: VersionEntry[], branch: string, fileName: string) {
  const candidates = entries.filter(entry => entry.branch === branch && entry.fileName === fileName);
  return candidates.length === 1 ? candidates[0] : null;
}

function waitForDrain(response: any) {
  return new Promise<void>(resolve => response.once("drain", resolve));
}

async function pipeUpstreamBody(response: any, body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      response.end();
      return;
    }

    if (value && !response.write(value)) {
      await waitForDrain(response);
    }
  }
}

async function sendFile(response: any, requestMethod: string | undefined, entry: VersionEntry) {
  const upstream = await fetch(entry.downloadUrl);

  if (!upstream.ok) {
    response.statusCode = upstream.status;
    response.end(`Failed to fetch upstream file: ${upstream.status}`);
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", upstream.headers.get("content-type") ?? "application/java-archive");
  response.setHeader("Content-Disposition", `attachment; filename="${entry.fileName}"`);

  const contentLength = upstream.headers.get("content-length");

  if (contentLength) {
    response.setHeader("Content-Length", contentLength);
  }

  if (requestMethod === "HEAD") {
    response.end();
    return;
  }

  if (!upstream.body) {
    response.statusCode = 502;
    response.end("Upstream response body is empty");
    return;
  }

  await pipeUpstreamBody(response, upstream.body);
}

function handleDownloadRequest(env: ProviderEnvironment) {
  return async (request: any, response: any, next: () => void) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const route = parseDownloadPath(url.pathname);

    if (!route) {
      next();
      return;
    }

    try {
      const entries = await loadEntries(env);
      const entry =
        route.type === "latest"
          ? findLatestEntry(entries, route.branch)
          : findFileEntry(entries, route.branch, route.fileName);

      if (!entry) {
        response.statusCode = 404;
        response.end("Download not found");
        return;
      }

      await sendFile(response, request.method, entry);
    } catch (error) {
      response.statusCode = 500;
      response.end(error instanceof Error ? error.message : "Failed to resolve download");
    }
  };
}

export function downloadMiddlewarePlugin(env: ProviderEnvironment): Plugin {
  return {
    name: "lumi-download-middleware",
    configureServer(server) {
      server.middlewares.use(handleDownloadRequest(env));
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleDownloadRequest(env));
    },
  };
}
