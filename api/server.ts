import type { IncomingMessage, ServerResponse } from "node:http";
import { createServerApp } from "../src/server/app.js";

declare const process: {
  env: Record<string, string | undefined>;
};

const app = createServerApp(process.env, {
  downloadDeliveryMode: "redirect",
});

export default function server(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? "/", "https://downloads.invalid");
  const path = url.searchParams.get("path");

  if (path) {
    url.searchParams.delete("path");
    const query = url.searchParams.toString();
    request.url = `${path}${query ? `?${query}` : ""}`;
  }

  app(request, response);
}
