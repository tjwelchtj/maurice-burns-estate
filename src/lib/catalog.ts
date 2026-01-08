import Papa from "papaparse";

export type CatalogItem = {
  fileId: string;
  filename?: string;
  driveImageUrl?: string;
  title?: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  price?: string;
  status?: string;
  description?: string;
  notes?: string;
  sortOrder?: number;
};

export function normalizeStatus(s?: string) {
  return (s ?? "").trim().toLowerCase();
}

export function getPriceLabel(item: { status?: string; price?: string }) {
  const status = normalizeStatus(item.status);
  if (status !== "available") return null;

  const price = (item.price ?? "").trim();
  if (!price) return "Inquiry for price";

  return price; // can be "$500" or "500" etc. We'll display as-is.
}

function cleanString(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/^'+|'+$/g, "") // remove leading/trailing single quotes
    .replace(/^"+|"+$/g, ""); // remove leading/trailing double quotes
}

function toNumberOrUndefined(value: unknown): number | undefined {
  const s = cleanString(value);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeRow(row: Record<string, unknown>): CatalogItem {
  // Make CSV headers case/spacing-insensitive (e.g. "Price" vs "price")
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    r[k.trim().toLowerCase()] = v;
  }

  // Expected headers (any casing):
  // fileId filename driveImageUrl title year medium dimensions price status description notes sortOrder
  const fileId = cleanString(r["fileid"] ?? r["file id"] ?? r["file_id"]);

  return {
    fileId,
    filename: cleanString(r["filename"]) || undefined,
    driveImageUrl: cleanString(r["driveimageurl"] ?? r["drive image url"] ?? r["drive_image_url"]) || undefined,
    title: cleanString(r["title"]) || undefined,
    year: cleanString(r["year"]) || undefined,
    medium: cleanString(r["medium"]) || undefined,
    dimensions: cleanString(r["dimensions"]) || undefined,
    price: cleanString(r["price"]) || undefined,
    status: cleanString(r["status"]) || undefined,
    description: cleanString(r["description"]) || undefined,
    notes: cleanString(r["notes"]) || undefined,
    sortOrder: toNumberOrUndefined(r["sortorder"] ?? r["sort order"] ?? r["sort_order"]),
  };
}

export async function getCatalog(): Promise<CatalogItem[]> {
  const url = process.env.CATALOG_CSV_URL;

  if (!url) {
    throw new Error(
      "Missing CATALOG_CSV_URL environment variable. Set it in Vercel Project Settings → Environment Variables."
    );
  }

  const res = await fetch(url, {
    // helps avoid stale CSV caching weirdness
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch catalog CSV (${res.status}) from ${url}`);
  }

  const csvText = await res.text();

  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors?.length) {
    // Keep it readable if something goes wrong with the sheet
    const first = parsed.errors[0];
    throw new Error(
      `CSV parse error: ${first.message}${first.row != null ? ` (row ${first.row})` : ""}`
    );
  }

  const items = (parsed.data ?? [])
    .map(normalizeRow)
    .filter((i) => i.fileId); // must have a fileId

  

  return items;
}