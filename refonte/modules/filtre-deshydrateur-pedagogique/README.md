# Filtre-déshydrateur — parcours pédagogique inerWeb Édu

Module autonome consacré au filtre-déshydrateur frigorifique. Il fonctionne hors ligne, sans
serveur, sans CDN et sans média tiers non autorisé. La V3 associe photos réelles, vues réalistes,
rendus 3D pédagogiques et schémas techniques selon le rôle de chaque écran.

## Ouvrir le module

Double-cliquer sur `index.html`.

## Parcours

Le module comporte quinze écrans :

1. reconnaître l’organe et sa flèche ;
2. distinguer raccord flare et raccord à braser ;
3. placer le filtre-déshydrateur sur la ligne liquide ;
4. séparer ses deux missions : filtrer et déshydrater ;
5. ouvrir le corps et nommer ses composants ;
6. comparer noyau solide et billes dessiccantes ;
7. suivre la capture des particules ;
8. comprendre l’adsorption de l’eau ;
9. distinguer capacité de séchage et capacité antiacide ;
10. comprendre la saturation et le remplacement ;
11. comparer modèle hermétique et enveloppe à cartouches ;
12. reconnaître le petit modèle pour circuit capillaire ;
13. comprendre le fonctionnement bi-flow ;
14. identifier le filtre-déshydrateur burn-out d’aspiration ;
15. vérifier les acquis avec six situations corrigées.

## Contrat du module

- une idée principale par écran ;
- écran entier dans `100dvh`, sans défilement ;
- navigation au clavier avec `←` et `→` ;
- lecture vocale facultative, jamais automatique ;
- vitesses `0,80 · 0,95 · 1,10 · 1,25`, défaut `0,95` ;
- clé locale de vitesse : `inerweb-filtre-deshydrateur-rate` ;
- arrêt de la voix au changement d’écran, à la sortie et lorsque la page devient cachée ;
- six questions finales, seuil pédagogique proposé `5/6` ;
- fonctionnement complet sans voix et sans stockage ;
- version imprimable en A4 paysage.

## Images et droits

Le fichier `SOURCES-IMAGES.md` est obligatoire. Aucun média tiers n’entre dans le module sans
licence compatible ou autorisation explicite. Les documentations constructeur servent ici de
références techniques ; leurs photographies et leurs coupes ne sont pas copiées. Trois médias
sources Wikimedia Commons sous licence Creative Commons sont conservés avec attribution et preuves
locales ; deux sont affichés sous forme originale ou dérivée dans le parcours.

Principe visuel de la V3 :

- photo réelle pour repérer l’organe sur une installation ;
- vue réaliste isolée pour reconnaître sa forme et ses raccords ;
- rendu 3D explicitement annoncé comme pédagogique pour voir l’intérieur ;
- symbole SVG de la bibliothèque inerWeb pour la représentation frigorifique exacte.

## Fichiers principaux

- `index.html` : structure accessible du module ;
- `styles.css` : projection, téléphone et animations ;
- `app.js` : parcours, activités, voix et quiz ;
- `lisibilite.js` : réglage de taille du texte ;
- `impression.css` : sortie papier sobre ;
- `assets/svg/` : dessins techniques originaux ;
- `assets/images/` : vues réalistes et rendus 3D pédagogiques ;
- `assets/photos/` : médias réels sous licence vérifiée ;
- `assets/preuves-droits/` : copies locales des pages de licence ;
- `assets/symboles/` : copies locales des symboles validés inerWeb ;
- `STORYBOARD.md` : intention détaillée des quinze écrans ;
- `SOURCES-TECHNIQUES.md` : références métier ;
- `SOURCES-IMAGES.md` : registre des médias et preuves de droits.

## État

Troisième version visuelle du 4 août 2026. Les écrans 4 à 7, 11, 13, 14 et 15 ont été reconstruits
pour mieux relier chaque explication à une photographie, une coupe légendée ou une situation
illustrée. Le contenu demande encore une validation métier humaine et
le choix éventuel d’un modèle constructeur précis avant d’être présenté comme représentation
d’un produit particulier.
