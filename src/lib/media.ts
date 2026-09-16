export const siteImages = {
  heroPortrait: "/uploads/lucas-portrait-formal.png",
  aboutPortrait: "/uploads/lucas-portrait-smiling.png"
} as const;

export type ImageUsage = "cover" | "gallery" | "portrait";

// Cover recommendations allow roughly 2x the 1,144px-wide project detail image.
export const imageGuides = {
  cover: { recommendedWidth: 2400, recommendedHeight: 1500, minWidth: 1200, minHeight: 750, ratio: 1.6 },
  gallery: { recommendedWidth: 1600, recommendedHeight: 0, minWidth: 1200, minHeight: 0, ratio: null },
  portrait: { recommendedWidth: 1200, recommendedHeight: 1600, minWidth: 680, minHeight: 860, ratio: null }
} satisfies Record<ImageUsage, {
  recommendedWidth: number;
  recommendedHeight: number;
  minWidth: number;
  minHeight: number;
  ratio: number | null;
}>;

export function parseImageUrls(value: string) {
  return value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
}

export function safeImageSrc(value: string) {
  const source = value.trim();
  if (/^\/(?![\/\\])/.test(source) && !source.includes("\\")) return source;
  try {
    const url = new URL(source);
    if (["https:", "http:", "blob:"].includes(url.protocol)) return url.href;
  } catch {
    // Invalid or incomplete URLs are shown as a preview error, not opened as links.
  }
  return "";
}

export function imageAspectRatio(width: number, height: number) {
  function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return w <= 32 && h <= 32 ? `${w}:${h}` : `${(width / height).toFixed(2)}:1`;
}
