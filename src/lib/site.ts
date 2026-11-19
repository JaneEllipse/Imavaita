import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import site from '../data/site.json';
import logo from '../assets/logo-imavaita.png';
import photoAgence from '../assets/accueil/tiggo-8-pro.jpg';
import { type Lang, t, lien, trad } from '../i18n';

export { site };
export type Vehicule = CollectionEntry<'vehicules'>;
export type VehiculeVente = CollectionEntry<'vente'>;

const visible = (statut: string) => statut === 'publie' || (import.meta.env.DEV && statut === 'brouillon');

/** Catalogue de vente : « publié » en production, + « brouillon » en développement. */
export async function getVente(): Promise<VehiculeVente[]> {
  const all = await getCollection('vente', ({ data }) => visible(data.statut));
  return all.sort((a, b) => a.data.ordre - b.data.ordre || a.data.nom.localeCompare(b.data.nom, 'fr'));
}

/** Marques du catalogue de vente, dans l'ordre d'apparition. */
export const marquesVente = (liste: VehiculeVente[]) => [...new Set(liste.map((v) => v.data.marque))];

/** Nom affiché d'un véhicule en vente : « Toyota RAV4 2025 ». */
export const nomVente = (v: VehiculeVente) => [v.data.nom, v.data.annee].filter(Boolean).join(' ');

/** Véhicules visibles : « publié » en production, + « brouillon » en développement. */
export async function getVehicules(): Promise<Vehicule[]> {
  const all = await getCollection('vehicules', ({ data }) => visible(data.statut));
  return all.sort((a, b) => a.data.ordre - b.data.ordre || a.data.nom.localeCompare(b.data.nom, 'fr'));
}

const fcfa = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const fcfaEn = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
export const formatPrix = (n: number, lang: Lang = 'fr') => `${(lang === 'en' ? fcfaEn : fcfa).format(n).replace(/ | /g, ' ')} FCFA`;

/** Lien WhatsApp avec message prérempli (fonctionne sans JavaScript). */
export const numeroWa = site.whatsapp.replace(/\D/g, '');
export function waLink(message?: string): string {
  // Sans numéro configuré, wa.me laisse le visiteur choisir le destinataire : renseigner le numéro dans l'admin.
  const base = `https://wa.me/${numeroWa}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Messages WhatsApp préremplis, dans la langue de la page. */
export const messages = (lang: Lang) => {
  const w = t(lang).wa;
  return {
    general: w.general(site.nom),
    achat: w.achat(site.nom),
    prixVente: (modele: string) => w.prixVente(site.nom, modele),
    location: w.location(site.nom),
    vehicule: (v: string) => w.vehiculeLocation(site.nom, v),
    longueDuree: w.longueDuree(site.nom),
    transfert: w.transfert(site.nom),
    besoin: w.besoin(site.nom),
  };
};

/** Coordonnées traduites (champs *_en de site.json, sinon le français). */
export const infos = (lang: Lang) => ({
  slogan: trad(lang, site.slogan, site.slogan_en),
  accroche: trad(lang, site.accroche, site.accroche_en),
  horaires: trad(lang, site.horaires, site.horaires_en),
  zones: trad(lang, site.zones, site.zones_en),
});

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
export async function entreprise(base: URL | undefined, lang: Lang = 'fr') {
  const url = new URL('/', base).href;
  const logoUrl = new URL((await getImage({ src: logo, format: 'png' })).src, base).href;
  const imageUrl = new URL((await getImage({ src: photoAgence, format: 'jpg' })).src, base).href;
  const [lat, lng] = site.gps.split(',').map((n) => Number(n.trim()));
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoDealer', 'AutoRental'],
    '@id': `${url}#agence`,
    name: site.nom,
    legalName: site.raison_sociale,
    url,
    description: `${infos(lang).slogan}. ${infos(lang).accroche}`,
    logo: logoUrl,
    image: imageUrl,
    ...(site.whatsapp || site.telephone ? { telephone: site.telephone || `+${site.whatsapp}` } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: { '@type': 'PostalAddress', ...(site.adresse ? { streetAddress: site.adresse } : {}), addressLocality: site.ville, addressCountry: 'TG' },
    ...(Number.isFinite(lat) && Number.isFinite(lng) && site.gps ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } } : {}),
    ...(carte.lien ? { hasMap: carte.lien } : {}),
    areaServed: [{ '@type': 'City', name: site.ville }, { '@type': 'Country', name: 'Togo' }, { '@type': 'Continent', name: lang === 'en' ? 'Africa' : 'Afrique' }],
    ...(site.facebook ? { sameAs: [site.facebook] } : {}),
    currenciesAccepted: 'XOF',
  };
}

/** Fil d'Ariane schema.org. */
export const filAriane = (base: URL | undefined, etapes: { nom: string; chemin: string }[], lang: Lang = 'fr') => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ nom: t(lang).accueil, chemin: lien(lang, 'accueil') }, ...etapes].map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nom, item: new URL(e.chemin, base).href })),
});
