# IMAVAITA — site vitrine et catalogue de location de véhicules (Togo)

Langue du projet : **français** (contenus, commits, PR, commentaires de code).
Référence fonctionnelle : `docs/BRIEF.md` (brief client du 10/11/2026). Décisions techniques : `docs/ARCHITECTURE.md`.

## Principe central
Site rapide, clair et rassurant. Catalogue léger administrable par le client. **Les réservations passent par WhatsApp.**
Hors périmètre V1 : paiement en ligne, calendrier de disponibilités, espace client, CRM, automatisation WhatsApp, multi-langue.

## Stack
- Astro 5 en génération statique (`npm run dev`, `npm run build`), dépendances d'exécution : `astro`, `@fontsource/poppins`.
- Catalogue : collection de contenu `src/content/vehicules/*.md` (schéma dans `src/content.config.ts`).
- Visuels provisoires tirés de la maquette : `src/assets/maquette/` et `src/assets/vehicules/` (basse définition, à remplacer par les photos réelles du client).
- Coordonnées, avantages, services, avis : `src/data/site.json` ; FAQ : `src/data/faq.json`.
- Admin client : Sveltia CMS sur `/admin/` (`public/admin/config.yml`). **Tout champ ajouté au schéma doit l'être aussi dans `config.yml`**, et inversement.
- Hébergement : Infomaniak (Apache, `public/.htaccess`). L'action GitHub `build.yml` construit puis envoie `dist/` par rsync/SSH à chaque push sur `main`, y compris les enregistrements de l'admin.

## Règles impératives
1. **Ne jamais inventer de données client** : prix, avis, notes Google, engagements, coordonnées, véhicules. Une valeur non confirmée reste vide (voir règle 10). Les visuels et textes repris de la maquette ont été demandés par Ellipse le 10/11/2026 et restent à valider par le client.
2. Un véhicule sans `prix_jour` affiche « Tarif sur demande ». Ne jamais promettre une disponibilité en temps réel.
3. Seuls les véhicules `statut: publie` sont construits en production ; `brouillon` n'apparaît qu'en `npm run dev`.
4. Accueil : 4 véhicules maximum (bande défilante en CSS sur mobile). Pas de carrousel JS, vidéo auto ni bibliothèque JS. Seule police web : Poppins 600/700/800 auto-hébergée (`@fontsource/poppins`) pour les titres. Animations légères seulement (apparition au défilement, survol), toutes coupées par `prefers-reduced-motion`.
5. Mobile d'abord : zones tactiles ≥ 44 px, aucun défilement horizontal à 360 px, WhatsApp visible sans masquer le contenu.
6. Chaque lien WhatsApp passe par `waLink()` (`src/lib/site.ts`) et porte un attribut `data-wa="<source>"` pour la mesure.
7. Images : toujours via `astro:assets` (`<Image>`), ratio 4:3 pour les véhicules, `loading="lazy"` hors premier écran.
8. Budget de performance : JS client < 5 Ko par page, page d'accueil < 300 Ko hors photo principale, Lighthouse mobile ≥ 90 partout.
9. Vert = WhatsApp uniquement. Palette : marine `#00306e`, orange `#ff8c00`, blanc.
10. Un champ de coordonnées vide (`site.json`) masque l'élément correspondant : ne jamais afficher de valeur fictive ou « à confirmer » sur le site public.
11. Bulle WhatsApp (`BulleWhatsApp.astro`) : s'ouvre au clic sur le bouton flottant ; sans JavaScript, le bouton reste un lien WhatsApp direct.

## Avant de pousser
- `npm run build` (inclut `astro check`) doit passer sans erreur ni avertissement.
- Vérifier à 390 px de large : pas de débordement horizontal, CTA WhatsApp présents.
