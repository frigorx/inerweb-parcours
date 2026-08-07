# Registre des visuels

| Élément | Origine | Traitement | Statut |
|---|---|---|---|
| Vue extérieure KVL | STEP `ID542975703082-0101.stp` fourni par Franck | conversion locale, réduction à 7 056 triangles, rendu WebGL original | prototype interne ; diffusion à arbitrer |
| Silhouette KV des cartes | dessin SVG original inerWeb établi à partir du STEP fourni et de la géométrie angulaire décrite par Danfoss | silhouette simplifiée : entrée basse, sortie latérale et tête de réglage supérieure ; aucune image constructeur intégrée | prototype interne à valider |
| Vignettes d’emplacement | dessins SVG originaux inerWeb et géométrie des échangeurs issue de la planche canonique `regulateurs-pression.svg` | échangeurs agrandis, compresseur hermétique figuratif, bouteille liquide nommée en entier et particules animées dans le sens du fluide | prototype interne à valider |
| Coupe cinématique | dessin SVG original inerWeb, grammaire de circulation reprise du module canonique `vanne-service-interactive/valve-diagram.js` et architecture angulaire vérifiée dans les notes Danfoss `AX266545601018en-000101` | cavité blanche en coude à 90°, clapet mobile et particules de fluide ; aucune reprise d’une planche constructeur | réutilisable avec le module après validation métier |
| Circuit frigorifique | planche canonique `C:\git\pilote-fluides\packs\fluides\res\svg\regulateurs-pression.svg` et bibliothèque `C:\git\usine-contenu\bibliotheque-symboles\svg\frigo_schema\` | Croix du frigoriste conservée ; ligne liquide complétée avec les SVG validés `bouteille_liquide`, `vanne_isolement`, `filtre_deshydrateur`, `voyant_liquide`, `electrovanne_frigo` et `detendeur_thermo_int` ; compresseur figuratif original à la place du symbole circulaire jugé trop abstrait ; conduite d’aspiration orthogonale | production interne inerWeb, réutilisable avec le module |
| Symbole angulaire de régulateur KV | SVG fourni directement par Franck depuis la bibliothèque de symboles inerWeb en cours de constitution | tracé conservé à l’identique ; ajout local d’un titre et d’une description textuelle ; fichier `assets/symboles/regulateur_pression_kv.svg` | conservé dans la bibliothèque locale ; classement canonique à reprendre lors de l’intégration de la bibliothèque au RAG |
| Symbole schématique de régulateur PC | SVG fourni directement par Franck depuis la bibliothèque de symboles inerWeb en cours de constitution | tracé conservé à l’identique ; ajout local d’un titre et d’une description textuelle ; fichier `assets/symboles/regulateur_pression_pc.svg` | utilisé dans le circuit du prototype ; classement canonique à reprendre lors de l’intégration de la bibliothèque au RAG |
| Manomètre et réglage | dessin SVG original inerWeb | animation qualitative | réutilisable avec le module |

Aucune photo, capture de PDF, texture distante, logo constructeur ou CDN n’est
chargé par la page.

La bibliothèque canonique antérieure ne contenait pas de symbole dédié aux
régulateurs de pression. Le symbole fonctionnel provisoire reste **retiré**.
Le circuit utilise maintenant le symbole PC fourni par Franck. Le symbole
angulaire reste disponible dans la bibliothèque locale et les cartes de
présentation conservent la silhouette réelle dérivée du STEP. Cette séparation
distingue le symbole schématique, le symbole angulaire et l’aspect physique du
produit.
