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
  // Your CSV headers:
  // fileId filename driveImageUrl title year medium dimensions price status description notes sortOrder
  const fileId = cleanString(row.fileId);

  return {
    fileId,
    filename: cleanString(row.filename) || undefined,
    driveImageUrl: cleanString(row.driveImageUrl) || undefined,
    title: cleanString(row.title) || undefined,
    year: cleanString(row.year) || undefined,
    medium: cleanString(row.medium) || undefined,
    dimensions: cleanString(row.dimensions) || undefined,
    price: cleanString(row.price) || undefined,
    status: cleanString(row.status) || undefined,
    description: cleanString(row.description) || undefined,
    notes: cleanString(row.notes) || undefined,
    sortOrder: toNumberOrUndefined(row.sortOrder),
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