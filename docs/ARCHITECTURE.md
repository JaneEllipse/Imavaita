# Architecture et décisions

## Choix de la stack (validé le 10/11/2026)
**Astro statique + Sveltia CMS + Cloudflare Pages**, à la place de WordPress envisagé dans le brief.

| Critère | Astro + Sveltia | WordPress |
|---|---|---|
| Vitesse sur réseau mobile | HTML statique, ~0 JS | PHP + thème + plugins |
| Hébergement | Gratuit (Cloudflare Pages) | 4–10 €/mois |
| Sécurité / maintenance | Aucune base de données ni plugin à mettre à jour | Mises à jour régulières obligatoires |
| Admin client | Formulaire « Véhicules » sur `/admin/`, connexion via un compte GitHub | Identifiant / mot de passe WordPress |
| Historique | Chaque modification est un commit (retour arrière possible) | Révisions partielles |

Contrepartie : la personne qui administre a besoin d'un compte GitHub (créé une fois, invité comme collaborateur), et une publication prend ~1 minute (reconstruction du site).

## Arborescence
```
src/
  content.config.ts        schéma des fiches véhicules
  content/vehicules/*.md   une fiche = un fichier (créé par l'admin)
  assets/vehicules/        photos (converties en WebP par l'admin, puis redimensionnées au build)
  data/site.json           coordonnées, avantages, services, avis
  data/faq.json            questions fréquentes
  lib/site.ts              lecture du catalogue, prix FCFA, liens WhatsApp
  layouts/Base.astro       en-tête, pied de page, bouton WhatsApp flottant, SEO
  components/              carte véhicule, bouton WhatsApp, icône
  pages/                   accueil, véhicules, fiche, tarifs-services, à propos, contact, légal, sitemap, robots
public/admin/              Sveltia CMS (index.html + config.yml)
```

## Parcours WhatsApp
- En-tête, bannière, bandeau final, pied de page et bouton flottant : message général prérempli.
- Fiche véhicule : mini-formulaire (dates, lieu, chauffeur) qui **compose** le message WhatsApp côté navigateur. Rien n'est envoyé au site ni stocké. Sans JavaScript, le lien reste fonctionnel avec un message à compléter.
- Tous les liens portent `data-wa="<source>"`.

## Mesure
Aucun outil de statistiques activé par défaut. Recommandation si validé par le client : **Cloudflare Web Analytics** (gratuit, sans cookie) pour les vues, ou **Plausible** pour compter les clics WhatsApp par véhicule (le script de `Base.astro` appelle déjà `plausible('WhatsApp', {source})` s'il est présent). Mettre à jour la page Confidentialité en conséquence.

## SEO
Titres et descriptions par page, URL canoniques, `sitemap.xml` (véhicules publiés uniquement), `robots.txt`, données structurées `AutoRental` (accueil) et `FAQPage` (tarifs). Fiches non publiées en `noindex`.

## Déploiement (à faire une fois)
1. Cloudflare Pages → « Connect to Git » → `JaneEllipse/Imavaita`, branche `main`, commande `npm run build`, dossier `dist`, variable `NODE_VERSION=22`.
2. Déployer le worker d'authentification [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) et créer une OAuth App GitHub ; renseigner son URL dans `public/admin/config.yml` (`base_url`).
3. Brancher le domaine du client (au nom du client) et mettre à jour `site` dans `astro.config.mjs` et `site_url` dans `config.yml`.
4. Inviter le compte GitHub de la personne responsable chez IMAVAITA comme collaborateur (droit « Write »).
