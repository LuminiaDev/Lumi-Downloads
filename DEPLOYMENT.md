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

The HTTP server is implemented as a platform-neutral Express application:

- Express application: `src/server/app.ts`
- Download router: `src/server/download/download.router.ts`
- Download resolver: `src/server/download/download.service.ts`
- Vite dev/preview adapter: `src/server/expressMiddleware.ts`
- Vercel adapter: `api/server.ts`

Any Node hosting platform that supports Express can mount `createServerApp()`. Vite uses streaming
downloads, while the Vercel adapter redirects to the provider file to avoid buffering large files
inside a serverless function.

For Vercel, `vercel.json` rewrites API and download routes to the same Express Function adapter.
This is only the Vercel deployment adapter, not the core implementation.

The public API follows the same adapter model:

- Versioned API router: `src/server/api/v1/router.ts`
- Resource routes: `src/server/api/v1/routes`
- Query validation: `src/server/api/v1/validation.ts`
- Response serializers: `src/server/api/v1/serializers.ts`
- Shared Express application: `src/server/app.ts`
- Vercel adapter: `api/server.ts`
- Public routes: `/api/v1/*`

See `API.md` for endpoints, filters, and response formats. Additional incompatible versions can
be implemented in a separate `src/server/api/v2` module without changing v1.
