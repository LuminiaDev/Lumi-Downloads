# Deployment

Projects are configured in `src/config/projectFactory.ts`. Each project defines:

- A unique `id`
- A display `name` and `description`
- An ordered list of forwarding `domains`
- Its own list of version `providers`

When the same domain is used by multiple projects, the first matching project wins.

Frontend routes:

- `/project/:projectId`
- `/p/:projectId` — alias that redirects to the canonical route

Project-scoped download routes:

- `/download/:projectId/:branch/latest`
- `/download/:projectId/:branch/:fileName`

Legacy routes without a project ID resolve against the first configured project:

- `/download/:branch/latest`
- `/download/:branch/:fileName`

The download resolver is platform-neutral:

- Core resolver: `src/server/downloadHandler.ts`
- Generic Node/connect middleware: `src/server/downloadNodeMiddleware.ts`
- Vite dev/preview adapter: `src/server/downloadMiddleware.ts`
- Vercel adapter: `api/download.ts`

Any host that can run Node-style request/response handlers can mount `createDownloadNodeMiddleware()` at `/download/*`.

For Vercel, `vercel.json` rewrites download routes to the Vercel Function adapter. This is only the Vercel deployment adapter, not the core implementation.
