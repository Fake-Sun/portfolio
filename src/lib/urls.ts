export function normalizeHref(value: string) {
  const href = value.trim();

  if (!href) {
    return "#";
  }

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  return `https://${href}`;
}
