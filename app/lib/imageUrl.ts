export function normalizeArtworkImageUrl(url: string): string {
  if (!url) return url;

  const [withoutHash, hash = ""] = url.split("#");
  const [base, query = ""] = withoutHash.split("?");

  const lastSlash = base.lastIndexOf("/");
  const prefix = lastSlash >= 0 ? base.slice(0, lastSlash + 1) : "";
  let filename = lastSlash >= 0 ? base.slice(lastSlash + 1) : base;

  const looksLikeArtwork =
    /__v\d+\b/i.test(filename) || /__primary__/i.test(filename) || /__full__/i.test(filename);

  if (!looksLikeArtwork) {
    return url;
  }

  if (/__v01\b/i.test(filename)) {
    filename = filename.replace(/__v01\b/gi, "__v02");
  }

  if (/primary/i.test(filename)) {
    filename = filename.replace(/primary/gi, "full");
  }

  if (/\.(png|tiff?|jpe?g)$/i.test(filename)) {
    filename = filename.replace(/\.(png|tiff?|jpe?g)$/i, ".webp");
  }

  const updated = `${prefix}${filename}`;
  const querySuffix = query ? `?${query}` : "";
  const hashSuffix = hash ? `#${hash}` : "";

  return `${updated}${querySuffix}${hashSuffix}`;
}
