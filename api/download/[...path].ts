import { handleDownloadRequest } from "../../src/server/downloadHandler";

declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(request: any, response: any) {
  await handleDownloadRequest(process.env, request, response);
}
