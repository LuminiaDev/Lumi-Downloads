import { resolveDownloadEntry } from "../src/server/downloadHandler";

declare const process: {
  env: Record<string, string | undefined>;
};

function createDownloadPath(request: Request) {
  const url = new URL(request.url);
  const branch = url.searchParams.get("branch");
  const target = url.searchParams.get("target");

  if (!branch || !target) {
    return null;
  }

  return `/download/${encodeURIComponent(branch)}/${encodeURIComponent(target)}`;
}

async function handleRequest(request: Request) {
  const pathname = createDownloadPath(request);

  if (!pathname) {
    return new Response("Download route not found", { status: 404 });
  }

  try {
    const entry = await resolveDownloadEntry(process.env, pathname);

    if (!entry) {
      return new Response("Download not found", { status: 404 });
    }

    return new Response(null, {
      status: 302,
      headers: {
        "Cache-Control": "no-store",
        "Location": entry.downloadUrl,
      },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Failed to resolve download", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}

export function GET(request: Request) {
  return handleRequest(request);
}

export function HEAD(request: Request) {
  return handleRequest(request);
}
