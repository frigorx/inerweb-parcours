# Électrovanne — parcours pédagogique inerWeb Édu

Module autonome consacré aux principes généraux de l’électrovanne frigorifique. Le parcours ne
présente aucune marque ni référence commerciale. Il fonctionne hors ligne, sans serveur, CDN ni
média tiers.

## Ouvrir le module

Double-cliquer sur `index.html` ou servir le dossier avec un serveur HTTP local.

## Parcours

Le module comporte quatorze écrans :

1. distinguer corps, tube du noyau mobile et bobine ;
2. placer l’électrovanne sur la ligne liquide étudiée ;
3. suivre la chaîne de commande électrique ;
4. nommer bobine, tube, noyau mobile, ressort, obturateur, siège et corps ;
5. comprendre l’état fermé hors tension d’une vanne NF ;
6. voir comment le noyau agit directement sur l’orifice principal ;
7. distinguer action directe et commande assistée, puis suivre équilibrage, pilote et membrane ;
8. distinguer les fonctions normalement fermée et normalement ouverte ;
9. respecter le sens de la flèche et l’orientation autorisée ;
10. reconnaître la bobine et vérifier son marquage et sa compatibilité ;
11. retirer la bobine, protéger le corps avec la méthode prévue et contrôler un montage brasé ;
12. couper l’alimentation avant la dépose de la bobine ;
13. relier fuite interne, commande assistée bloquée et défaut de bobine à une méthode de contrôle ;
14. vérifier les acquis avec sept situations corrigées.

## Contrat du module

- une idée principale par écran ;
- écran entier dans `100dvh`, sans défilement ;
- navigation au clavier avec `←` et `→` ;
- lecture vocale facultative, jamais automatique ;
- vitesses `0,80 · 0,95 · 1,10 · 1,25`, défaut `0,95` ;
- clé locale de vitesse : `inerweb-electrovanne-rate` ;
- arrêt de la voix au changement d’écran, à la sortie et lorsque la page devient cachée ;
- sept questions finales, seuil pédagogique `6/7` ;
- fonctionnement complet sans voix et sans stockage ;
- version imprimable en A4 paysage.

## Images et droits

Les vues extérieures, coupes et animations sont des SVG originaux dessinés manuellement. Les
organes de la ligne liquide réemploient les SVG de la bibliothèque interne validée inerWeb. Aucun
média constructeur n’est intégré.

Les médias et notices fournis ont servi uniquement à reconnaître la famille d’organe et à recouper
les principes généraux. Ils ne sont ni convertis, ni publiés, ni décalqués. Leurs noms exacts et
leur statut sont conservés uniquement dans `SOURCES-IMAGES.md` et `SOURCES-TECHNIQUES.md`.

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

Version générale révisée le 5 août 2026. Le contenu demande une validation métier humaine avant diffusion
institutionnelle. Il ne remplace ni la notice de la vanne et de la bobine, ni le schéma électrique,
ni la procédure de consignation et d’intervention frigorifique.
