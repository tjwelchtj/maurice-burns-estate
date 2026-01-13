export const dynamic = "force-dynamic";

import { getCatalog } from "@/lib/catalog";

function statusLabel(status?: string) {
  const s = (status ?? "").trim();
  if (!s) return "";
  return s;
}

export default async function Page() {
  const items = await getCatalog();
  const siteTitle = process.env.SITE_TITLE || "Maurice Burns Estate";

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{siteTitle}</h1>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            <strong>Inquiries only</strong> — inquire for price
          </p>
        </div>

        <nav style={{ display: "flex", gap: 16 }}>
          <a href="#bio">Bio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <hr style={{ margin: "22px 0 26px", opacity: 0.3 }} />

      {/* GRID */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {items.map((item) => {
          const imgUrl = `/api/img/${encodeURIComponent(item.fileId)}`;
          const badge = statusLabel(item.status);

          return (
            <a
              key={item.fileId}
              href={imgUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 14,
                overflow: "hidden",
                background: "white",
              }}
            >
              {/* IMAGE */}
              <div style={{ position: "relative" }}>
                <img
                  src={imgUrl}
                  alt={item.title || "Artwork"}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: 240,
                    objectFit: "cover",
                    display: "block",
                    background: "rgba(0,0,0,0.04)",
                  }}
                />

                {badge ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      padding: "6px 10px",
                      fontSize: 12,
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.45)",
                      color: "white",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                    }}
                  >
                    {badge}
                  </div>
                ) : null}
              </div>

              {/* META */}
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 650 }}>
                  {item.title || item.filename || "Untitled"}
                </div>

                <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                  {[item.year, item.medium].filter(Boolean).join(" · ")}
                </div>

                {item.dimensions ? (
                  <div style={{ marginTop: 4, fontSize: 13, opacity: 0.75 }}>
                    {item.dimensions}
                  </div>
                ) : null}

                {!String(item.status || "").toLowerCase().includes("sold") ? (
                  <div style={{ marginTop: 10, fontSize: 13 }}>
                    {item.price ? <strong>{item.price}</strong> : "Inquiries only"}
                  </div>
                ) : null}
              </div>
            </a>
          );
        })}
      </section>

      {/* BIO */}
      <section id="bio" style={{ marginTop: 64 }}>
        <h2>About the Estate</h2>

        <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
          This site presents selected works and belongings from the estate of Maurice
          Burns, offered for inquiry and sale. Items include artwork, studio materials,
          and personal objects collected over the course of his life and career. For
          availability, pricing, and further information, please contact the estate
          representative.
        </p>

        <p style={{ marginTop: 16, opacity: 0.85, lineHeight: 1.6 }}>
          Maurice Burns (1937–2025) was a visionary American painter whose work spanned
          decades of cultural exploration and formal innovation. His complex,
          collage-like canvases drew from jazz, American history, figurative painting,
          and personal identity, weaving together influences from the Harlem
          Renaissance, Pop Art, Native American culture, and the School of London.
        </p>

        <p style={{ marginTop: 16, opacity: 0.85, lineHeight: 1.6 }}>
          After studying at the Rhode Island School of Design and the Royal College of
          Art in London, Burns became an influential figure in the American art world.
          He lived and worked in Santa Fe for more than forty years, where his work was
          widely exhibited and collected. His paintings have been shown nationally and
          internationally, including through Gerald Peters Gallery’s contemporary
          program.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ marginTop: 40 }}>
        <h2>Contact</h2>

        <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
          For inquiries regarding availability, pricing, or additional information,
          please contact the estate directly at{" "}
          <a
            href="mailto:solar_power@mac.com"
            style={{ textDecoration: "underline" }}
          >
            mauriceburnsestate@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}