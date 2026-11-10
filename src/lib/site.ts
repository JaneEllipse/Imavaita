import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import site from '../data/site.json';
import logo from '../assets/logo-imavaita.png';
import photoAgence from '../assets/maquette/hero-lome.jpg';

export { site };
export type Vehicule = CollectionEntry<'vehicules'>;

/** Véhicules visibles : « publié » en production, + « brouillon » en développement. */
export async function getVehicules(): Promise<Vehicule[]> {
  const all = await getCollection('vehicules', ({ data }) =>
    data.statut === 'publie' || (import.meta.env.DEV && data.statut === 'brouillon'),
  );
  return all.sort((a, b) => a.data.ordre - b.data.ordre || a.data.nom.localeCompare(b.data.nom, 'fr'));
}

const fcfa = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
export const formatPrix = (n: number) => `${fcfa.format(n).replace(/ | /g, ' ')} FCFA`;

/** Lien WhatsApp avec message prérempli (fonctionne sans JavaScript). */
export const numeroWa = site.whatsapp.replace(/\D/g, '');
export function waLink(message?: string): string {
  // Sans numéro configuré, wa.me laisse le visiteur choisir le destinataire : renseigner le numéro dans l'admin.
  const base = `https://wa.me/${numeroWa}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const messageVehicule = (nom: string) =>
  `Bonjour ${site.nom}, je souhaite connaître la disponibilité du véhicule « ${nom} ».\n` +
  `Dates : du … au …\nLieu de prise en charge : …\nAvec chauffeur : oui / non`;

export const messageGeneral = `Bonjour ${site.nom}, je souhaite louer un véhicule.\nDates : du … au …\nLieu de prise en charge : …`;

/**
 * Emplacement de l'agence sur Google Maps : coordonnées GPS en priorité (point exact),
 * sinon l'adresse saisie dans l'admin. Rien n'est affiché si les deux sont vides.
 */
const lieu = site.gps.trim() || (site.adresse.trim() ? `${site.adresse.trim()}, ${site.ville}, Togo` : '');
const q = encodeURIComponent(lieu);
export const carte = {
  /** Carte intégrée (sans clé d'API) */
  embed: lieu ? `https://maps.google.com/maps?q=${q}&z=16&hl=fr&output=embed` : '',
  itineraire: lieu ? `https://www.google.com/maps/dir/?api=1&destination=${q}` : site.google_maps_url,
  lien: site.google_maps_url || (lieu ? `https://www.google.com/maps/search/?api=1&query=${q}` : ''),
};
/** Adresse lisible : « rue…, Lomé, Togo » (la ville seule si l'adresse n'est pas encore saisie). */
export const adresseComplete = [site.adresse.trim(), site.ville, 'Togo'].filter(Boolean).join(', ');

/** Données structurées de l'agence (schema.org AutoRental), réutilisées par les pages. */
export async function entreprise(base: URL | undefined) {
  const url = new URL('/', base).href;
  const logoUrl = new URL((await getImage({ src: logo, format: 'png' })).src, base).href;
  const imageUrl = new URL((await getImage({ src: photoAgence, format: 'jpg' })).src, base).href;
  const [lat, lng] = site.gps.split(',').map((n) => Number(n.trim()));
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${url}#agence`,
    name: site.nom,
    url,
    description: `${site.slogan}. ${site.accroche}`,
    logo: logoUrl,
    image: imageUrl,
    ...(site.telephone ? { telephone: site.telephone } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: { '@type': 'PostalAddress', ...(site.adresse ? { streetAddress: site.adresse } : {}), addressLocality: site.ville, addressCountry: 'TG' },
    ...(Number.isFinite(lat) && Number.isFinite(lng) && site.gps ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } } : {}),
    ...(carte.lien ? { hasMap: carte.lien } : {}),
    areaServed: [{ '@type': 'City', name: site.ville }, { '@type': 'Country', name: 'Togo' }],
    currenciesAccepted: 'XOF',
  };
}

/** Fil d'Ariane schema.org. */
export const filAriane = (base: URL | undefined, etapes: { nom: string; chemin: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ nom: 'Accueil', chemin: '/' }, ...etapes].map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nom, item: new URL(e.chemin, base).href })),
});
