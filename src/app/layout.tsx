import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maurice Burns Estate - For Sale",
  description:
    "Selected belongings and artworks from the estate of Maurice Burns. Inquiries only.",
  openGraph: {
    title: "Maurice Burns Estate - For Sale",
    description:
      "Selected belongings and artworks from the estate of Maurice Burns. Inquiries only.",
    url: "https://maurice-burns-estate.vercel.app/",
    siteName: "Maurice Burns Estate - For Sale",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
