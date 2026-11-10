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
export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const messageVehicule = (nom: string) =>
  `Bonjour ${site.nom}, je souhaite connaître la disponibilité du véhicule « ${nom} ».\n` +
  `Dates : du … au …\nLieu de prise en charge : …\nAvec chauffeur : oui / non`;

export const messageGeneral = `Bonjour ${site.nom}, je souhaite louer un véhicule.\nDates : du … au …\nLieu de prise en charge : …`;
