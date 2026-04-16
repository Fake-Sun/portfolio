import type { Metadata } from "next";

import "./globals.css";

const siteDescription =
  "Lucas Monzón portfolio showcasing full-stack software engineering, IT support, troubleshooting, deployment, and selected web projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasmonzon.dev"),
  applicationName: "Lucas Monzón Portfolio",
  title: {
    default: "Lucas Monzón | Full Stack Software Engineer",
    template: "%s | Lucas Monzón"
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      es: "/es"
    }
  },
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
    description: siteDescription,
    url: "https://lucasmonzon.dev",
    siteName: "Lucas Monzón Portfolio",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Lucas Monzón logo" }]
  },
  twitter: {
    card: "summary",
    title: "Lucas Monzón | Full Stack Software Engineer",
    description: siteDescription,
    images: ["/icon-512.png"]
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
