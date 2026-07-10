import { handleDownloadRequest } from "../src/server/downloadHandler";

declare const process: {
  env: Record<string, string | undefined>;
};

function getQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : typeof value === "string" ? value : undefined;
}

export default async function handler(request: any, response: any) {
  const branch = getQueryValue(request.query?.branch);
  const target = getQueryValue(request.query?.target);

  if (!branch || !target) {
    response.statusCode = 404;
    response.end("Download route not found");
    return;
  }

  await handleDownloadRequest(
    process.env,
    {
      method: request.method,
      url: `/download/${encodeURIComponent(branch)}/${encodeURIComponent(target)}`,
    },
    response,
    { deliveryMode: "redirect" }
  );
}
