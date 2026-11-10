# Architecture et décisions

## Choix de la stack (validé le 10/11/2026)
**Astro statique + Sveltia CMS, hébergé chez Infomaniak**, à la place de WordPress envisagé dans le brief.

| Critère | Astro + Sveltia | WordPress |
|---|---|---|
| Vitesse sur réseau mobile | HTML statique, ~0 JS | PHP + thème + plugins |
| Hébergement | Simple dossier de fichiers sur l'hébergement Infomaniak existant, sans base de données ni PHP | Base de données + PHP à maintenir |
| Sécurité / maintenance | Aucune base de données ni plugin à mettre à jour | Mises à jour régulières obligatoires |
| Admin client | Formulaire « Véhicules » sur `/admin/`, connexion via un compte GitHub | Identifiant / mot de passe WordPress |
| Historique | Chaque modification est un commit (retour arrière possible) | Révisions partielles |

Contrepartie : la personne qui administre a besoin d'un compte GitHub (créé une fois, invité comme collaborateur), et une publication prend ~2 minutes (reconstruction puis envoi du site).

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
Aucun outil de statistiques activé par défaut. Recommandation si validé par le client : **Plausible** (sans cookie, hébergé en UE) pour compter les clics WhatsApp par véhicule (le script de `Base.astro` appelle déjà `plausible('WhatsApp', {source})` s'il est présent). Mettre à jour la page Confidentialité en conséquence.

## SEO
Titres et descriptions par page, URL canoniques, `sitemap.xml` (véhicules publiés uniquement), `robots.txt`, données structurées `AutoRental` (accueil) et `FAQPage` (tarifs). Fiches non publiées en `noindex`.

## Déploiement sur Infomaniak

Le site est un dossier de fichiers statiques (`dist/`). L'action GitHub `.github/workflows/build.yml` :
1. construit le site à chaque modification de `main` (y compris les enregistrements faits depuis l'admin) ;
2. l'envoie sur l'hébergement Infomaniak en **FTPS** (FTP chiffré) avec `SamKirkland/FTP-Deploy-Action`, qui n'envoie que les fichiers modifiés. Tant que les secrets ne sont pas configurés, l'envoi est simplement ignoré.

`public/.htaccess` gère sur Apache : HTTPS forcé, page 404, cache long des fichiers `/_astro/`, compression, en-têtes de sécurité.

### Mise en place (une seule fois, sans clé ni ligne de commande)
1. **Manager Infomaniak** → Hébergement web → *FTP / SSH* : créer un compte FTP dédié (ex. `deploy-imavaita`) avec un mot de passe fort, limité si possible au dossier du site. Noter le **serveur FTP** affiché sur cette page.
2. **Dossier du site** : Hébergement → *Sites* → le site → dossier racine (ex. `sites/imavaita.com/`). Il doit servir uniquement à ce site.
3. **GitHub** → dépôt → *Settings* → *Secrets and variables* → *Actions* → *New repository secret*, un par ligne :
   - `FTP_SERVER` : le serveur FTP
   - `FTP_USERNAME` : l'identifiant FTP
   - `FTP_PASSWORD` : le mot de passe FTP
   - `FTP_DIR` : le dossier du site **avec un « / » final** (ex. `sites/imavaita.com/`) ; si absent, `web/` est utilisé.
4. *Actions* → « Build et déploiement » → *Run workflow* pour le premier envoi.
5. Domaine : mettre le domaine définitif dans `astro.config.mjs` (`site`) et `public/admin/config.yml` (`site_url`), et activer le certificat SSL (Let's Encrypt) dans le Manager.

### Connexion à l'admin (sans serveur d'authentification)
Sveltia CMS propose « Sign In Using Access Token » : chaque administrateur crée un **jeton GitHub à granularité fine** limité au dépôt `JaneEllipse/Imavaita`, permission *Contents : Read and write*, avec une date d'expiration (voir `docs/GUIDE_ADMIN.md`). Aucun service tiers à héberger.
Option ultérieure si le client trouve le jeton contraignant : déployer le petit service OAuth `sveltia-cms-auth` pour un bouton « Se connecter avec GitHub ».

### Accès client
Inviter le compte GitHub de la personne responsable chez IMAVAITA comme collaborateur (droit « Write ») ; transférer le dépôt au client à la livraison si souhaité.
