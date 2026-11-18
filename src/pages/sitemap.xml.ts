import type { APIRoute } from 'astro';
import { getVehicules } from '../lib/site';
import { ROUTES, lien, langues } from '../i18n';

/** Plan du site : toutes les pages dans les deux langues, avec leurs équivalents (hreflang). */
export const GET: APIRoute = async ({ site }) => {
  const vehicules = (await getVehicules()).filter((v) => v.data.statut === 'publie');
  const paires = [
    ...Object.values(ROUTES).map((r) => ({ fr: r.fr, en: r.en })),
    ...vehicules.map((v) => ({ fr: lien('fr', 'location', v.id), en: lien('en', 'location', v.id) })),
  ];
  const abs = (p: string) => new URL(p, site).href;
  const urls = paires.flatMap((p) => langues.map((l) => `  <url><loc>${abs(p[l])}</loc>${langues.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(p[x])}"/>`).join('')}</url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
