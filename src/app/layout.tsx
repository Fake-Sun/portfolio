import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio CMS",
  description: "Next.js portfolio with a lightweight CMS for profile content, projects, and image uploads.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Lucas Monzón Portfolio",
    description: "Software engineering portfolio and CMS.",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Lucas Monzón logo" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
