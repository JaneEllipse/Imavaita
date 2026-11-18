# Guide d'administration IMAVAITA

## Se connecter
**La première fois : créer votre jeton d'accès (5 minutes)**
1. Connecté à GitHub, ouvrir *Settings* → *Developer settings* → *Personal access tokens* → *Fine-grained tokens* → **Generate new token**.
2. Nom : « Admin site IMAVAITA ». Expiration : 1 an. *Repository access* : **Only select repositories** → `Imavaita`.
3. *Permissions* → *Repository permissions* → **Contents : Read and write**. Générer, puis copier le jeton (il ne s'affiche qu'une fois).

**Ensuite** : ouvrir `https://<votre-site>/admin/`, cliquer sur **Sign In Using Access Token** et coller le jeton. Le navigateur s'en souvient.
Ne jamais partager ce jeton. En cas de perte ou de départ d'une personne, le supprimer dans GitHub et en créer un nouveau.

> Les menus de l'outil sont en anglais (*Save*, *New*…), mais tous les champs des fiches sont en français.

## Ajouter un véhicule en vente
1. Menu **Véhicules en vente** → **Nouveau**.
2. Renseigner le modèle (ex. « Toyota RAV4 »), la marque, l'année, la catégorie et les caractéristiques du catalogue (énergie, moteur, puissance, boîte, consommation).
3. Ajouter la photo (de préférence en paysage).
4. Prix en FCFA : laisser vide pour afficher « Prix sur demande ».
5. Statut « Publié » pour l'afficher ; « Masqué » quand le véhicule est vendu.
6. **À la une** : l'accueil montre 2 véhicules en vente et 2 en location.

Le **catalogue PDF** (consultation et téléchargement) se remplace dans **Informations du site** → *Catalogue de ventes (PDF)*. Préférer un fichier de moins de 5 Mo.

## Ajouter un véhicule de location
1. Menu **Véhicules de location** → **Nouveau**.
2. Renseigner le nom, la catégorie, les places, la boîte.
3. Ajouter la **photo principale** (photo réelle, en paysage) et jusqu'à 3 photos secondaires. Elles sont compressées automatiquement.
4. Saisir les prix en FCFA (chiffres seulement). Laisser vide pour afficher « Tarif sur demande ».
5. Choisir le **statut** : « Brouillon » (invisible), « Publié » (visible) ou « Masqué » (gardé mais invisible, par exemple véhicule indisponible).
6. Pour un nouvel arrivage : cocher **Nouveau** et, si besoin, **À la une**.
7. Version anglaise : remplir **Résumé en anglais** et **Description en anglais**. Vides, le texte français est repris sur les pages anglaises.
8. **Enregistrer**. Le site est mis à jour en 2 à 3 minutes.

## Modifier un prix, une photo, retirer un véhicule
Ouvrir le véhicule, modifier, enregistrer. Pour le retirer sans le perdre : statut « Masqué ».

## Coordonnées, horaires, avis, FAQ
Menu **Informations du site**. Les champs « en anglais » alimentent la version anglaise du site (`/en/`). Le numéro WhatsApp s'écrit avec l'indicatif, sans « + » ni espaces (ex. `22890000000`). N'ajouter que des avis réels dont l'auteur a donné son accord.

## Carte de l'agence (page Contact et pied de page)
Dans **Réglages du site** :
- **Adresse** : affichée en pied de page et sur la page Contact.
- **Coordonnées GPS de l'agence** : dans Google Maps, clic droit sur l'entrée exacte de l'agence, puis clic sur les chiffres pour les copier (ex. `6.13…, 1.22…`). La carte interactive et le bouton « Itinéraire » apparaissent alors sur la page Contact. Sans GPS, l'adresse est utilisée.
- **Lien Google Maps** : lien « Partager » de la fiche Google de l'agence, utilisé pour « Nous trouver sur Google Maps ».
Tant que ces champs sont vides, aucune carte ni lien n'est affiché.
