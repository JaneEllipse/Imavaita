# IMAVAITA — site vitrine et catalogue de location de véhicules (Togo)

Langue du projet : **français** (contenus, commits, PR, commentaires de code).
Référence fonctionnelle : `docs/BRIEF.md` (brief client du 10/11/2026). Décisions techniques : `docs/ARCHITECTURE.md`.

## Principe central
Site rapide, clair et rassurant. Catalogue léger administrable par le client. **Les réservations passent par WhatsApp.**
Hors périmètre V1 : paiement en ligne, calendrier de disponibilités, espace client, CRM, automatisation WhatsApp, multi-langue.

## Stack
- Astro 5 en génération statique (`npm run dev`, `npm run build`), une seule dépendance d'exécution : `astro`.
- Catalogue : collection de contenu `src/content/vehicules/*.md` (schéma dans `src/content.config.ts`).
- Coordonnées, avantages, services, avis : `src/data/site.json` ; FAQ : `src/data/faq.json`.
- Admin client : Sveltia CMS sur `/admin/` (`public/admin/config.yml`). **Tout champ ajouté au schéma doit l'être aussi dans `config.yml`**, et inversement.
- Hébergement visé : Cloudflare Pages (build `npm run build`, sortie `dist/`).

## Règles impératives
1. **Ne jamais inventer de données client** : prix, avis, notes Google, engagements, coordonnées, véhicules. Les valeurs non confirmées restent marquées « à confirmer ». Les maquettes du brief sont des exemples fictifs.
2. Un véhicule sans `prix_jour` affiche « Tarif sur demande ». Ne jamais promettre une disponibilité en temps réel.
3. Seuls les véhicules `statut: publie` sont construits en production ; `brouillon` n'apparaît qu'en `npm run dev`.
4. Accueil : 4 véhicules maximum. Pas de carrousel, vidéo auto, animation décorative, police web ou bibliothèque JS sans raison forte.
5. Mobile d'abord : zones tactiles ≥ 44 px, aucun défilement horizontal à 360 px, WhatsApp visible sans masquer le contenu.
6. Chaque lien WhatsApp passe par `waLink()` (`src/lib/site.ts`) et porte un attribut `data-wa="<source>"` pour la mesure.
7. Images : toujours via `astro:assets` (`<Image>`), ratio 4:3 pour les véhicules, `loading="lazy"` hors premier écran.
8. Budget de performance : JS client < 5 Ko par page, page d'accueil < 300 Ko hors photo principale, Lighthouse mobile ≥ 90 partout.
9. Vert = WhatsApp uniquement. Palette : marine `#00306e`, orange `#ff8c00`, blanc.

## Avant de pousser
- `npm run build` (inclut `astro check`) doit passer sans erreur ni avertissement.
- Vérifier à 390 px de large : pas de débordement horizontal, CTA WhatsApp présents.
