export function normalizeViText(s: string) {
  return (s ?? "")
    .trim()
    .toLowerCase()
    // normalize unicode + strip diacritics
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    // common variants
    .replace(/\b(tp\.?|thanh pho)\b/g, "tp")
    .replace(/\b(tinh)\b/g, "")
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .replace(/[·•,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


