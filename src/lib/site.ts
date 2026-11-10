import { getCollection, type CollectionEntry } from 'astro:content';
import site from '../data/site.json';

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
