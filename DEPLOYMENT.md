# Deployment

The download resolver is platform-neutral:

- Core resolver: `src/server/downloadHandler.ts`
- Generic Node/connect middleware: `src/server/downloadNodeMiddleware.ts`
- Vite dev/preview adapter: `src/server/downloadMiddleware.ts`
- Vercel adapter: `api/download/[...path].ts`

Any host that can run Node-style request/response handlers can mount `createDownloadNodeMiddleware()` at `/download/*`.

For Vercel, `vercel.json` rewrites `/download/:path*` to the Vercel Function adapter. This is only the Vercel deployment adapter, not the core implementation.
