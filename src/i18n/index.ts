import fr, { type Dico } from './fr';
import en from './en';

export type Lang = 'fr' | 'en';
export type { Dico };
export const langues: Lang[] = ['fr', 'en'];
const dicos: Record<Lang, Dico> = { fr, en };
export const t = (lang: Lang): Dico => dicos[lang];

/** Adresses des pages dans chaque langue (le français reste à la racine, l'anglais sous /en/). */
export const ROUTES = {
  accueil: { fr: '/', en: '/en/' },
  vente: { fr: '/vente/', en: '/en/cars-for-sale/' },
  location: { fr: '/vehicules/', en: '/en/car-rental/' },
  services: { fr: '/tarifs-services/', en: '/en/services/' },
  apropos: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  mentions: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  confidentialite: { fr: '/confidentialite/', en: '/en/privacy/' },
} as const;
export type Route = keyof typeof ROUTES;

/** Lien vers une page ; `id` = fiche de location (/vehicules/<id>/ ou /en/car-rental/<id>/). */
export const lien = (lang: Lang, route: Route, id?: string) => `${ROUTES[route][lang]}${id ? `${id}/` : ''}`;

/** Texte en anglais s'il existe, sinon le texte français (contenus administrables). */
export const trad = (lang: Lang, frTexte: string, enTexte?: string) => (lang === 'en' && enTexte?.trim() ? enTexte : frTexte);
