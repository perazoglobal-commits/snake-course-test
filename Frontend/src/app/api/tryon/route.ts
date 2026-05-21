import { NextRequest, NextResponse } from "next/server";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const personImage = formData.get("person_image");
  const clothingImage = formData.get("clothing_image");

  if (!(personImage instanceof File) || !(clothingImage instanceof File)) {
    return NextResponse.json({ error: "Both images are required." }, { status: 400 });
  }

  for (const [name, file] of [["person_image", personImage], ["clothing_image", clothingImage]] as const) {
    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported format for ${name}. Use JPEG, PNG, or WEBP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large for ${name}. Max 5MB.` },
        { status: 400 }
      );
    }
  }

  const upstream = new FormData();
  upstream.append("person_image", personImage);
  upstream.append("clothing_image", clothingImage);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: upstream,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const status = response.status === 500 ? 502 : 503;
      return NextResponse.json({ error: "Upstream error." }, { status });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(blob, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Upstream timeout." }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
