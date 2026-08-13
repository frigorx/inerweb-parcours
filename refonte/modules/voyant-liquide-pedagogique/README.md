# Voyant liquide — parcours pédagogique inerWeb Édu

Module autonome consacré au voyant liquide frigorifique, avec ou sans indicateur d’humidité. Il
fonctionne hors ligne, sans serveur, sans CDN et sans média tiers.

## Ouvrir le module

Double-cliquer sur `index.html` ou servir le dossier avec un serveur HTTP local.

## Parcours

Le module comporte quatorze écrans :

1. reconnaître les deux variantes ;
2. placer horizontalement le filtre et le voyant sur le montage étudié ;
3. distinguer une lecture de deux lectures ;
4. nommer le corps, la fenêtre, la liaison étanche et la pastille ;
5. comparer liquide continu, bulles et circuit arrêté ;
6. limiter la conclusion donnée par une fenêtre claire ;
7. voir comment un voyant en aval peut révéler un filtre possiblement colmaté ;
8. comprendre le principe de la pastille d’humidité ;
9. lire couleur, mot, fluide, température, stabilisation et légende ;
10. poser la frontière du voyant sans indicateur ;
11. recouper l’observation avec des mesures ;
12. préparer et monter le voyant selon sa notice, avec un exemple Danfoss clairement délimité ;
13. relier le constat à une intervention sûre, y compris si la pastille est endommagée ;
14. vérifier les acquis avec six situations corrigées.

## Contrat du module

- une idée principale par écran ;
- écran entier dans `100dvh`, sans défilement ;
- navigation au clavier avec `←` et `→` ;
- lecture vocale facultative, jamais automatique ;
- vitesses `0,80 · 0,95 · 1,10 · 1,25`, défaut `0,95` ;
- clé locale de vitesse : `inerweb-voyant-liquide-rate` ;
- arrêt de la voix au changement d’écran, à la sortie et lorsque la page devient cachée ;
- six questions finales, seuil pédagogique `5/6` ;
- fonctionnement complet sans voix et sans stockage ;
- version imprimable en A4 paysage.

## Images et droits

Les coupes, pastilles et animations sont originales. La pastille est représentée comme un petit
élément central distinct de la fenêtre, afin que la circulation reste visible autour. Les organes de la ligne liquide réemploient
les SVG de la bibliothèque interne validée inerWeb. Aucun média tiers n’est intégré. Les
documentations fabricants servent uniquement de références techniques.

Cinq illustrations SVG originales supplémentaires montrent les deux variantes, le montage
horizontal filtre → voyant, la comparaison état normal / restriction possible et deux familles
de raccordement. Les vues produit ont été redessinées en trois-quarts avec un corps en laiton,
une fenêtre surélevée et des raccords plus crédibles. Elles restent génériques et ont été dessinées
manuellement ; aucune photographie, aucun fichier vectoriel ni aucune géométrie CAO Danfoss n’est
intégré.

`SOURCES-IMAGES.md` consigne cette situation. `SOURCES-TECHNIQUES.md` répertorie les faits retenus
et leurs sources primaires.

## Fichiers principaux

- `index.html` : structure accessible du module ;
- `styles.css` : projection, téléphone et animations ;
- `app.js` : parcours, SVG, activités, voix et quiz ;
- `lisibilite.js` : réglage de taille du texte ;
- `impression.css` : sortie papier sobre ;
- `STORYBOARD.md` : intention détaillée des quatorze écrans ;
- `SOURCES-TECHNIQUES.md` : références métier ;
- `SOURCES-IMAGES.md` : registre des médias ;
- `REPRISE.md` : contrat technique pour une future modification ;
- `tests/qa.mjs` : contrôle de cinq formats, activités, quiz et mode hors ligne.

## État

Première version et révision documentaire du 4 août 2026, complétée avec les fiches Danfoss SG/SGP 2020 et 2026. Le contenu décrit des principes génériques. Il demande une
validation métier humaine avant diffusion institutionnelle et ne remplace ni la notice du voyant,
ni le schéma de l’installation, ni une procédure d’intervention.
