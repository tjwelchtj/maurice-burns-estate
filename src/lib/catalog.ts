import Papa from "papaparse";

export type CatalogItem = {
  fileId: string;
  filename: string;
  driveImageUrl: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  price: string;
  status: string;
  description: string;
  notes: string;
  sortOrder: string;
};

function extractDriveId(value: string): string {
  const v = (value || "").trim();
  if (!v) return "";

  // If it's already an ID-ish string (most Drive IDs are 20+ chars, no spaces)
  if (!v.includes("/") && !v.includes("?") && v.length >= 20) return v;

  // Try query param id=
  try {
    const u = new URL(v);
    const id = u.searchParams.get("id");
    if (id) return id.trim();
  } catch {
    // not a full URL; continue
  }

  // Handle patterns like /file/d/<ID>/view
  const m1 = v.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1?.[1]) return m1[1];

  // Handle patterns like id=<ID> inside a non-URL string
  const m2 = v.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2?.[1]) return m2[1];

  return v; // fallback
}

function normalizeRow(r: any): CatalogItem {
  const rawFileId = String(r.fileId || "").trim();
  const fileId = extractDriveId(rawFileId);

  return {
    fileId,
    filename: String(r.filename || "").trim(),
    driveImageUrl: String(r.driveImageUrl || "").trim(),
    title: String(r.title || "").trim(),
    year: String(r.year || "").trim(),
    medium: String(r.medium || "").trim(),
    dimensions: String(r.dimensions || "").trim(),
    price: String(r.price || "").trim(),
    status: String(r.status || "").trim() || "Available",
    description: String(r.description || "").trim(),
    notes: String(r.notes || "").trim(),
    sortOrder: String(r.sortOrder || "").trim(),
  };
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  const url = process.env.CATALOG_CSV_URL;
  if (!url) throw new Error("Missing CATALOG_CSV_URL in .env.local");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch catalog CSV: ${res.status}`);
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const items = (parsed.data as any[])
    .map(normalizeRow)
    .filter((x) => x.fileId)
    .filter((x) => x.status !== "Removed");

  items.sort((a, b) => {
    const ao = Number(a.sortOrder || "999999");
    const bo = Number(b.sortOrder || "999999");
    if (ao !== bo) return ao - bo;
    const at = (a.title || a.filename).toLowerCase();
    const bt = (b.title || b.filename).toLowerCase();
    return at.localeCompare(bt);
  });

  return items;
}

export function slugFor(item: CatalogItem) {
  const base = (item.title || item.filename || "artwork")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const tail = item.fileId.slice(-6);
  return `${base}-${tail}`;
}
