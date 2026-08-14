# Détendeur thermostatique — parcours pédagogique inerWeb Édu

Module autonome en quatorze écrans consacré au détendeur thermostatique. Il part de la place de
l’organe dans le circuit, montre son fonctionnement pièce par pièce, puis aborde la surchauffe,
le bulbe, les égalisations, le choix de la buse, l’installation et le diagnostic.

Le prototype 04 retenu est intégré au parcours. Tous les dessins du détendeur utilisent maintenant
la même géométrie vectorielle originale. Le bulbe est serré sur le tube de sortie, son capillaire
rejoint la tête et le clapet se déplace dans l’axe de l’orifice. L’égalisation externe est isolée
sur l’écran 9 afin de ne pas surcharger les premières explications.

## Ouvrir

Double-cliquer sur index.html. Aucun serveur, CDN, compte ou accès internet n’est requis.

## Parcours

1. placer le détendeur, tourné d’un quart de tour, dans la Croix du frigoriste ;
2. reconnaître le corps, les raccords et le train thermostatique ;
3. découvrir bulbe, membrane, tige, clapet, orifice et ressort ;
4. observer l’ouverture, la chute de pression et la conservation du débit massique ;
5. calculer la surchauffe ;
6. lire les trois forces et suivre la chaîne bulbe → membrane → tige → clapet ;
7. tester la réponse à une sortie plus chaude ou plus froide ;
8. poser correctement le bulbe et suivre son capillaire ;
9. comparer prise interne T 2 et prise externe TE 2 ;
10. choisir une buse à partir des données de calcul ;
11. placer le réglage après stabilisation, mesure et diagnostic ;
12. préparer, assembler et braser selon la notice ;
13. diagnostiquer trois familles de symptômes ;
14. vérifier les acquis avec six situations corrigées.

## Contrat

- une idée principale par écran ;
- écran entier dans 100dvh, sans défilement ;
- navigation au clavier avec ← et → hors des contrôles ;
- lecture vocale facultative, jamais automatique ;
- vitesses 0,80 · 0,95 · 1,10 · 1,25, défaut 0,95 ;
- clé locale inerweb-detendeur-rate ;
- six questions finales, réussite à partir de 5/6 ;
- fonctionnement complet sans voix et sans stockage ;
- impression A4 paysage sobre ;
- aucune dépendance distante.

## Dessins et droits

La coupe progressive, le bulbe, l’égalisation et les activités sont des SVG manuels originaux
écrits dans app.js. Le circuit utilise quatre symboles de la bibliothèque interne inerWeb :
compresseur, échangeur, détendeur interne et Croix du frigoriste.

Les PDF, STEP, DWF, DWG, captures web et rendus CAO fournis ont servi de références de conception.
Leurs droits de rediffusion ne sont pas établis : ils restent dans les archives de travail et sont
exclus de la livraison. Voir SOURCES-IMAGES.md et SOURCES-TECHNIQUES.md.

## Fichiers principaux

- index.html : structure accessible ;
- styles.css : projection, téléphone et animations ;
- app.js : parcours, SVG, activités, voix et quiz ;
- lisibilite.js : taille du texte ;
- impression.css : sortie papier ;
- STORYBOARD.md : intention des quatorze écrans ;
- REPRISE.md : contrat de maintenance ;
- tests/qa.mjs : contrôle automatique.

## Vérification

Le contrôle automatique couvre les 14 écrans en 1024 × 768, 1280 × 720, 1366 × 768,
390 × 844 et 360 × 640, ainsi que les activités, le quiz, le clavier, les sources, le mode
hors ligne et les modes dégradés sans voix ni stockage.

Une validation métier humaine reste recommandée avant diffusion institutionnelle. Le module ne
remplace ni la notice constructeur, ni le calcul de sélection, ni une procédure d’intervention.
