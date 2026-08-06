# Sources des assets — Tome 3

## Symboles

Les 22 fichiers de `symboles/` sont des copies sans redessin de :

`C:\git\usine-contenu\bibliotheque-symboles\svg\`

Catalogue source : `catalogue.json`, bibliothèque inerWeb validée par F. Henninot.

## Vues isolées reprises du Tome 1

Les dix fichiers WebP suivants proviennent de `module/images-organes/` :

- `compresseurs.webp` ;
- `condenseur-air.webp` ;
- `evaporateur-air.webp` ;
- `detendeur-thermostatique.webp` ;
- `detendeur-electronique.webp` ;
- `tube-capillaire.webp` ;
- `filtre-deshydrateur.webp` ;
- `voyant-liquide.webp` ;
- `pressostats.webp` ;
- `sonde-temperature.webp`.

Elles sont présentées comme des aides à la reconnaissance, jamais comme des plans constructeur.

## Vues isolées produites pour le Tome 3

Mode : outil ImageGen intégré. Date : 31 juillet 2026. Aucun circuit complet n’a été généré.

Contraintes communes à tous les prompts : fond studio chaud `#FFFDF8`, composant entièrement
visible, proportions techniquement plausibles, aucun raccordement d’installation, aucune marque,
aucun texte, aucun chiffre, aucun manomètre, aucun outil, aucun technicien et aucun filigrane.

| Fichier | Prompt final — sujet principal |
|---|---|
| `echangeur-plaques.webp` | Un échangeur à plaques brasées en acier inoxydable, quatre raccords propres au composant, vue produit isolée. |
| `reservoir-liquide.webp` | Un réservoir liquide frigorifique vertical en acier, deux raccords plausibles, fonds bombés et pieds de fixation. |
| `bouteille-anti-coup-liquide.webp` | Une bouteille d’aspiration verticale noire avec exactement deux gros raccords supérieurs et une patte de fixation. |
| `electrovanne.webp` | Une électrovanne frigorifique normalement fermée, corps laiton, deux raccords cuivre opposés et bobine électrique verticale. |
| `clapet-vannes-service.webp` | Trois composants séparés : clapet anti-retour, vanne de service à prise latérale et vanne d’isolement. |
| `separateur-huile.webp` | Un séparateur d’huile vertical, deux raccords de gaz HP et un petit raccord inférieur de retour d’huile. |
| `capteur-pression.webp` | Un capteur électronique de pression, un raccord fileté, méplat, corps compact et connecteur intégré. |
| `regulateurs-securite.webp` | Trois composants séparés : deux régulateurs de pression à ressort et une soupape de sécurité distincte. |

La vérité technique du cours est portée par le texte relu, les symboles SVG et les animations
manuelles. Les vues réalistes ne servent qu’à préparer la reconnaissance visuelle d’un organe isolé.


## Conversion à l'intégration — 31 juillet 2026

Les huit vues produites pour le Tome 3 sont arrivées en PNG, entre 1,1 et 1,8 Mo pièce, soit
**11,2 Mo à elles seules**. Converties en WebP à 1024 px sur le plus grand côté — la taille utile
en projection, au-delà aucun vidéoprojecteur n'en profite : **231 Ko au total, 98 % de moins**,
sans perte visible.

Le poids n'est pas un détail de confort : le pack doit s'ouvrir sur un téléphone en 4G, sur le
terrain, chez des stagiaires qui n'ont pas tous la fibre. C'est la même règle qui fait préférer
un SVG de 5 Ko à une image partout où c'est possible.

Les PNG d'origine restent dans la livraison `habilitation-fluide-rush-complet-v2.zip`, hors dépôt.
