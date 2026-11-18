# IMAVAITA — site vitrine, vente et location de véhicules (Togo)

Langue du projet : **français** (contenus, commits, PR, commentaires de code).
Référence fonctionnelle : `docs/BRIEF.md` (brief client du 10/11/2026), complété le 18/11/2026 par le catalogue de ventes 2024-2025, les catalogues de location et le document d'offres du client. Décisions techniques : `docs/ARCHITECTURE.md`.

## Principe central
Site rapide, clair et rassurant. IMAVAITA **vend et loue** des véhicules : les deux métiers sont présentés **au même niveau**. Catalogues légers administrables par le client. **Les demandes de prix et réservations passent par WhatsApp.**
Site bilingue : français à la racine, anglais sous `/en/` (textes d'interface dans `src/i18n/fr.ts` et `en.ts`, même structure ; pages partagées dans `src/vues/`, routes minces dans `src/pages/` et `src/pages/en/`). Toute nouvelle page ou tout nouveau texte existe dans les deux langues.
Hors périmètre V1 : paiement en ligne, calendrier de disponibilités, espace client, CRM, automatisation WhatsApp.

## Stack
- Astro 5 en génération statique (`npm run dev`, `npm run build`), dépendances d'exécution : `astro`, `@fontsource/poppins`.
- Catalogues : `src/content/vente/*.md` (véhicules en vente, page `/vente/`) et `src/content/vehicules/*.md` (location, `/vehicules/`), schémas dans `src/content.config.ts`. Champs `*_en` = version anglaise (vide = texte français repris).
- Catalogue PDF de vente : `public/catalogue/` (chemin dans `site.json` → `catalogue_pdf`), version allégée du PDF client.
- Visuels : `src/assets/vente/` (photos du catalogue constructeur), `src/assets/location/` (photos réelles de la flotte), `src/assets/accueil/` (diaporama, intérieurs Changan).
- Coordonnées, avantages, services, avis : `src/data/site.json` ; FAQ : `src/data/faq.json`.
- Admin client : Sveltia CMS sur `/admin/` (`public/admin/config.yml`). **Tout champ ajouté au schéma doit l'être aussi dans `config.yml`**, et inversement.
- Hébergement : Infomaniak (Apache, `public/.htaccess`). L'action GitHub `build.yml` construit puis envoie `dist/` par rsync/SSH à chaque push sur `main`, y compris les enregistrements de l'admin.

## Règles impératives
1. **Ne jamais inventer de données client** : prix, avis, notes Google, engagements, coordonnées, véhicules. Une valeur non confirmée reste vide (voir règle 10). Les visuels et textes repris de la maquette ont été demandés par Ellipse le 10/11/2026 et restent à valider par le client.
2. Un véhicule de location sans `prix_jour` affiche « Tarif sur demande », un véhicule en vente sans `prix` « Prix sur demande ». Ne jamais promettre une disponibilité en temps réel.
3. Seuls les véhicules `statut: publie` sont construits en production ; `brouillon` n'apparaît qu'en `npm run dev`.
4. Accueil : 4 véhicules maximum, 2 en vente et 2 en location (bande défilante en CSS sur mobile). Héros : diaporama en CSS de 3 photos maximum (fondu + zoom lent), photos 2 et 3 chargées après l'affichage ; aucune bibliothèque de carrousel, pas de vidéo auto. Icônes : Tabler Icons (MIT) en SVG inline dans `Icone.astro`. Matière d'arrière-plan : grain et lignes en SVG inline (`--grain`, `--lignes`), jamais d'image de fond lourde. Seule police web : Poppins 600/700/800 auto-hébergée (`@fontsource/poppins`) pour les titres. Animations légères seulement (apparition au défilement, survol), toutes coupées par `prefers-reduced-motion`.
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
