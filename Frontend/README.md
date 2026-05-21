# AI Try-On

AI-powered virtual try-on app. Upload a photo of yourself and a clothing item — the AI composites them and returns a preview image.

## How it works

1. Upload a full-body photo and a clothing item image (JPEG, PNG, or WEBP, max 5 MB each)
2. Click **Generate Try-On**
3. The result appears in ~20–30 seconds and can be downloaded

The app proxies requests through a Next.js API route to an [n8n](https://n8n.io) workflow that runs the AI model. The n8n webhook URL is never exposed to the browser.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local and set N8N_WEBHOOK_URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `N8N_WEBHOOK_URL` | Full URL of the n8n webhook that accepts `person_image` and `clothing_image` fields and returns a binary image |

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 3**
- **Lucide React** icons
- **n8n** for the AI backend workflow
