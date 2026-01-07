import { getCatalog } from "@/lib/catalog";

export default async function Page() {
  const siteTitle = process.env.SITE_TITLE || "Catalog";
  const items = await getCatalog();

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>{siteTitle}</h1>
        <p style={{ marginTop: 8, opacity: 0.75 }}>
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => {
          // IMPORTANT:
          // This is the link/source that must work in production.
          // It avoids the Apps Script exec URL entirely.
          const imgUrl = `/api/img/${encodeURIComponent(item.fileId)}`;

          return (
            <article
              key={item.fileId}
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                overflow: "hidden",
                background: "white",
              }}
            >
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
                title="Open image"
              >
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    background: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Use <img> (not next/image) to avoid remote config issues */}
                  <img
                    src={imgUrl}
                    alt={item.title || "Artwork"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>
              </a>

              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  {item.title || item.filename || item.fileId}
                </div>

                <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.35 }}>
                  {item.year ? <div>{item.year}</div> : null}
                  {item.medium ? <div>{item.medium}</div> : null}
                  {item.dimensions ? <div>{item.dimensions}</div> : null}
                  {item.price ? <div>Price: {item.price}</div> : null}
                  {item.status ? <div>Status: {item.status}</div> : null}
                </div>

                {item.description ? (
                  <p style={{ marginTop: 10, fontSize: 13, opacity: 0.9, lineHeight: 1.35 }}>
                    {item.description}
                  </p>
                ) : null}

                {/* Optional: keep this around for your hover/inspection */}
                {item.driveImageUrl ? (
                  <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Drive Image URL</div>
                    <div style={{ wordBreak: "break-all" }}>{item.driveImageUrl}</div>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}