# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (defaults to :3000, falls back to :3001+)
npm run build    # Production build + type-check + lint
npm run lint     # ESLint only
npx tsc --noEmit # Type-check without building
```

No test suite is configured.

## Architecture

Single-page Next.js 15 App Router application. All state lives in `src/app/page.tsx`; there is no global state manager or context.

### Data flow

```
page.tsx  →  useTryOn (hook)  →  n8n webhook (POST multipart/form-data)
                                        ↓
                              binary image response (blob)
                                        ↓
                         URL.createObjectURL → displayed in ResultViewer
```

### Key constraint: binary response
The n8n webhook returns raw image bytes, **not JSON**. Always consume the response with `response.blob()`. Never call `response.json()`.

### `src/hooks/useTryOn.ts`
The only place that touches the network. Manages `isLoading / resultUrl / error` state. Uses `AbortController` for a hard 30-second timeout. `reset()` calls `URL.revokeObjectURL()` to free the blob — do not skip this on cleanup.

### `src/components/UploadBox.tsx`
Handles both drag-and-drop and click-to-upload. Validation (MIME type + 5 MB limit) happens here before `onSelect` is called; errors are surfaced via the `onError` prop, which routes to the toast system in `page.tsx`.

### Toast system
Errors from `useTryOn` and upload validation are funneled through `showToast` in `page.tsx`. Toasts auto-dismiss after 4 seconds via `setTimeout`; the animation class `animate-slideUp` is defined in `src/app/globals.css`.

### Styling
Tailwind CSS 3 with a custom `tailwind.config.ts`. Design tokens: background `#FAFAFA`, borders `#E5E5E5`. Custom keyframes (`fadeIn`, `slideUp`) are in `globals.css` — not in the Tailwind config — because they're referenced as plain CSS class names.

### Webhook endpoint
Defined as `WEBHOOK_URL` at the top of `src/hooks/useTryOn.ts`. FormData field names are `person_image` and `clothing_image` — these must match what n8n expects.
