import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const thumbUrl = `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`;

  const upstream = await fetch(thumbUrl, {
    redirect: "follow",
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image", status: upstream.status, id, url: thumbUrl },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const buf = await upstream.arrayBuffer();

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=86400",
    },
  });
}
