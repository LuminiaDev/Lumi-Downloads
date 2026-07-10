import { resolveDownloadEntry } from "../src/server/downloadHandler.js";

declare const process: {
  env: Record<string, string | undefined>;
};

type VercelRequest = {
  url?: string;
};

type VercelResponse = {
  end(body?: string): void;
  setHeader(name: string, value: string): void;
  statusCode: number;
};

function createDownloadPath(request: VercelRequest) {
  const url = new URL(request.url ?? "/", "https://lumi-downloads.invalid");
  const branch = url.searchParams.get("branch");
  const target = url.searchParams.get("target");

  if (branch && target) {
    return `/download/${encodeURIComponent(branch)}/${encodeURIComponent(target)}`;
  }

  return url.pathname.startsWith("/download/") ? url.pathname : null;
}

function sendText(response: VercelResponse, statusCode: number, body: string) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.end(body);
}

export default async function download(request: VercelRequest, response: VercelResponse) {
  try {
    const pathname = createDownloadPath(request);

    if (!pathname) {
      sendText(response, 404, "Download route not found");
      return;
    }

    const entry = await resolveDownloadEntry(process.env, pathname);

    if (!entry) {
      sendText(response, 404, "Download not found");
      return;
    }

    response.statusCode = 302;
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Location", entry.downloadUrl);
    response.end();
  } catch (error) {
    sendText(response, 500, error instanceof Error ? error.message : "Failed to resolve download");
  }
}
