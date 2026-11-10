import type { APIRoute } from 'astro';
import { getVehicules } from '../lib/site';

const PAGES = ['/', '/vehicules/', '/tarifs-services/', '/a-propos/', '/contact/', '/mentions-legales/', '/confidentialite/'];

export const GET: APIRoute = async ({ site }) => {
  const vehicules = (await getVehicules()).filter((v) => v.data.statut === 'publie');
  const urls = [...PAGES, ...vehicules.map((v) => `/vehicules/${v.id}/`)].map((p) => new URL(p, site).href);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
