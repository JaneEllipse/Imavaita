# Guide d'administration IMAVAITA

## Se connecter
**La première fois : créer votre jeton d'accès (5 minutes)**
1. Connecté à GitHub, ouvrir *Settings* → *Developer settings* → *Personal access tokens* → *Fine-grained tokens* → **Generate new token**.
2. Nom : « Admin site IMAVAITA ». Expiration : 1 an. *Repository access* : **Only select repositories** → `Imavaita`.
3. *Permissions* → *Repository permissions* → **Contents : Read and write**. Générer, puis copier le jeton (il ne s'affiche qu'une fois).

**Ensuite** : ouvrir `https://<votre-site>/admin/`, cliquer sur **Sign In Using Access Token** et coller le jeton. Le navigateur s'en souvient.
Ne jamais partager ce jeton. En cas de perte ou de départ d'une personne, le supprimer dans GitHub et en créer un nouveau.

> Les menus de l'outil sont en anglais (*Save*, *New*…), mais tous les champs des fiches sont en français.

## Ajouter un véhicule
1. Menu **Véhicules** → **Nouveau véhicule**.
2. Renseigner le nom, la catégorie, les places, la boîte.
3. Ajouter la **photo principale** (photo réelle, en paysage) et jusqu'à 3 photos secondaires. Elles sont compressées automatiquement.
4. Saisir les prix en FCFA (chiffres seulement). Laisser vide pour afficher « Tarif sur demande ».
5. Choisir le **statut** : « Brouillon » (invisible), « Publié » (visible) ou « Masqué » (gardé mais invisible, par exemple véhicule indisponible).
6. Pour un nouvel arrivage : cocher **Nouveau** et, si besoin, **À la une** (4 véhicules maximum sur l'accueil).
7. **Enregistrer**. Le site est mis à jour en 2 à 3 minutes.

## Modifier un prix, une photo, retirer un véhicule
Ouvrir le véhicule, modifier, enregistrer. Pour le retirer sans le perdre : statut « Masqué ».

## Coordonnées, horaires, avis, FAQ
Menu **Informations du site**. Le numéro WhatsApp s'écrit avec l'indicatif, sans « + » ni espaces (ex. `22890000000`). N'ajouter que des avis réels dont l'auteur a donné son accord.
