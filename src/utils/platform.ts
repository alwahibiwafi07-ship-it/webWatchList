// Cek apakah teks adalah link http/https yang valid
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const PLATFORMS: [string, string][] = [
  ["youtube.com", "YouTube"],
  ["youtu.be", "YouTube"],
  ["netflix.com", "Netflix"],
  ["bilibili", "Bilibili"],
  ["vidio.com", "Vidio"],
  ["crunchyroll.com", "Crunchyroll"],
  ["wetv", "WeTV"],
];

// Tebak nama platform dari link; kalau tidak dikenal, pakai nama domainnya
export function getPlatform(link: string): string {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "").toLowerCase();
    const found = PLATFORMS.find(([key]) => host.includes(key));
    return found ? found[1] : host;
  } catch {
    return "";
  }
}