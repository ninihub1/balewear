// The public address of the site, from NEXT_PUBLIC_SITE_URL (or Netlify's URL).
// Falls back to a safe value if the variable is missing or not a valid web address,
// so a typo in Netlify can't break the build.
export function getSiteUrl(): string {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, process.env.URL];
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const u = new URL(raw);
      if (u.protocol === 'https:' || u.protocol === 'http:') return u.origin;
    } catch {
      // not a valid URL, try the next one
    }
  }
  return 'http://localhost:3000';
}
