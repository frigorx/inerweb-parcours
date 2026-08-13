# Vanne de service Rotalock — parcours élève et vue technique

Module autonome inerWeb Édu consacré au fonctionnement d’une vanne de service à deux prises. Il fonctionne hors ligne, sans serveur et sans ressource externe.

## Commencer avec un élève

Double-cliquer sur `index.html`.

Le parcours de découverte montre une seule idée par image :

1. reconnaître la vanne réelle ;
2. distinguer P et P1 ;
3. comprendre que le carré déplace le pointeau ;
4. position fermée sur l’arrière ;
5. position intermédiaire de lecture ;
6. position fermée sur l’avant ;
7. danger permanent de P1 ;
8. sens BP, de T vers C ;
9. sens HP, de C vers T ;
10. raccorder flexible et pressostat au bon endroit.

La navigation se fait avec les boutons ou les flèches gauche et droite du clavier.

## Vue technique

Double-cliquer sur `animation-3-positions.html` pour ouvrir directement la séquence animée :

- la clé et le carré tournent ;
- le carré, la tige orange et le pointeau se déplacent comme un ensemble de longueur constante ;
- le presse-étoupe reste fixe ;
- les trois positions peuvent être choisies séparément ou lues automatiquement ;
- le sens BP est T vers C et le sens HP est C vers T.

Le parcours technique tient désormais en quatre écrans :

1. les trois positions sur la coupe validée ;
2. la comparaison BP / HP ;
3. le geste et la sécurité : clé à cliquet, sens de rotation, presse-étoupe, P et P1.
4. deux mini-jeux corrigés : repérage cliquable sur la vanne et décisions en situation terrain.

Les mini-jeux comprennent neuf questions au total : quatre repérages directs sur la coupe, puis cinq décisions sur le manifold, la position de lecture, les positions d’isolement et le bouchon P1. Chaque réponse est verrouillée et expliquée avant la question suivante. Le résultat est présenté comme un entraînement, jamais comme un examen officiel.

`animation-technique.html` contient ce parcours complet.

## Logique technique représentée

- **Fermée sur l’arrière** : T communique avec C ; P est isolée par le siège arrière ; P1 reste reliée à C.
- **Position intermédiaire** : T, C, P et P1 communiquent.
- **Fermée sur l’avant** : T est isolée de C ; P et P1 restent reliées à C.
- **BP / aspiration** : T vers C.
- **HP / refoulement** : C vers T.
- **P** : voie de service recevant temporairement le flexible du manifold.
- **P1** : prise permanente du pressostat, jamais isolée de C par le carré de manœuvre.

Dans les trois coupes, le bleu plein représente les volumes qui communiquent avec C. Le gris hachuré représente un volume isolé par le pointeau. Une zone isolée n’est pas nécessairement vide ni sans pression.

## Avertissement métier

Les dessins sont des schémas de principe pédagogiques, pas une notice d’intervention. La forme, les filetages et les procédures varient selon le constructeur.

P1 peut rester sous pression dans toutes les positions. Ne jamais défaire son bouchon sur une installation chargée.

## Images livrées

- `images/simples/png/` : dix planches 1920 × 1080 px prêtes à projeter ;
- `images/simples/svg/` : les dix mêmes planches en version vectorielle ;
- `images/png/` et `images/svg/` : les neuf vues techniques détaillées de la première version.

## Principaux fichiers

- `index.html` et `decouverte-eleve.html` : visionneuse élève T0 ;
- `decouverte-eleve.css` et `decouverte-eleve.js` : affichage et navigation ;
- `simple-diagrams.js` : source des dix planches simples ;
- `build/build-simple-stills.cjs` : export reproductible des planches ;
- `animation-3-positions.html` : accès direct à l’animation demandée ;
- `animation-technique.html`, `app.js` et `valve-diagram.js` : version animée détaillée.

## Sources de construction

- `4655-serie-7-activite-3-vanne-de-service.pdf` : nomenclature, trois positions et communication permanente P1–C ;
- `ID448462306916-0101.pdf` : implantation de la vanne, prises 1/4 SAE et carré de manœuvre ;
- `ID447759029458-0101.stp` et `ID360741599858-0101.png` : géométrie extérieure de référence ;
- `WhatsApp Image 2026-08-02 at 09.49.05.jpeg` : position du pointeau, des deux sièges et des deux prises de pression ;
- captures et pages produit fournies : reconnaissance du raccord Rotalock et des prises.
