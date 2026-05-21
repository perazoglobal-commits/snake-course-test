# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (defaults to :3000, falls back to next available port)
npm run build    # Production build + type-check + lint
npm run lint     # ESLint only
npx tsc --noEmit # Type-check without building
```

No test suite is configured.

## Environment setup

Copy `.env.example` to `.env.local` and set `N8N_WEBHOOK_URL` before running. The server will start without it but every generation request will return 500.

## Architecture

Single-page Next.js 15 App Router application. All UI state lives in `src/app/page.tsx`; there is no global state manager or context.

### Data flow

```
page.tsx  →  useTryOn (hook)  →  POST /api/tryon  →  n8n webhook (server-side)
                                                              ↓
                                                   binary image response
                                                              ↓
                                              blob → URL.createObjectURL → ResultViewer
```

The browser never contacts n8n directly. The actual webhook URL is a server-only env var (`N8N_WEBHOOK_URL`) loaded from `.env.local`.

### `src/app/api/tryon/route.ts`
The only place that reads `N8N_WEBHOOK_URL`. Validates both files server-side (MIME type + 5 MB each), proxies the FormData to n8n, and streams the binary image response back. Returns structured status codes: 400 bad request, 502 upstream error, 503 busy, 504 timeout.

### `src/hooks/useTryOn.ts`
Client-side hook that calls `/api/tryon`. Manages `isLoading / resultUrl / error` state. Uses a 35-second `AbortController` timeout (5s longer than the server's 30s so the server's 504 arrives before the client aborts). `reset()` calls `URL.revokeObjectURL()` to free the blob — do not skip this.

### `src/components/UploadBox.tsx`
Handles drag-and-drop and click-to-upload. Client-side validation (MIME type + 5 MB) runs before `onSelect` — errors surface via the `onError` prop, which routes to the toast system in `page.tsx`. The server also validates, so client validation is UX-only.

### Toast system
All errors are funneled through `showToast` in `page.tsx` and auto-dismiss after 4 seconds. The `animate-slideUp` keyframe is defined in `src/app/globals.css`.

### Styling
Tailwind CSS 3 (`tailwind.config.ts`). Design tokens: background `#FAFAFA`, borders `#E5E5E5`. Custom keyframes (`fadeIn`, `slideUp`) live in `globals.css` as plain CSS classes — not in the Tailwind config.
