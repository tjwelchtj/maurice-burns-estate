import Link from "next/link";
import { fetchCatalog, slugFor } from "@/lib/catalog";

export default async function Home() {
  const items = await fetchCatalog();

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>{process.env.SITE_TITLE || "Estate Gallery"}</h1>
          <p style={{ marginTop: 6, opacity: 0.8 }}>Inquiries only • Price upon request</p>
        </div>
        <nav style={{ display: "flex", gap: 14 }}>
          <Link href="/bio">Bio</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {items.map((item) => {
            const slug = slugFor(item);
            const title = item.title || item.filename;
            const badge = item.status || "Available";

            return (
              <Link
                key={item.fileId}
                href={`/art/${slug}`}
                style={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 12,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "rgba(0,0,0,0.04)" }}>
                  <img
                    src={`/api/img/${item.fileId}`}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.70)",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    {badge}
                  </div>
                </div>

                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 650, lineHeight: 1.2 }}>{title}</div>
                  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
                    {item.medium ? item.medium : "—"}
                    {item.year ? ` • ${item.year}` : ""}
                  </div>
                  <div style={{ marginTop: 8, opacity: 0.85, fontSize: 13 }}>Price upon request</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer style={{ marginTop: 40, opacity: 0.7, fontSize: 13 }}>
        © {new Date().getFullYear()} {process.env.SITE_TITLE || "Estate Gallery"} • All rights reserved
      </footer>
    </main>
  );
}
