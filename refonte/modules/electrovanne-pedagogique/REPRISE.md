# Reprise — Électrovanne pédagogique

## Copie concernée

`C:\Users\henni\Desktop\inerweb full ia\electrovanne-pedagogique`

Ne pas reporter automatiquement les changements dans une autre copie de Pilote Fluides.

## Contrat actuel

- 14 étapes ;
- 7 questions ;
- réussite pédagogique à partir de 6/7 ;
- vitesses vocales `0.80 · 0.95 · 1.10 · 1.25`, défaut `0.95` ;
- clé locale `inerweb-electrovanne-rate` ;
- aucune voix ni aucun son au chargement ;
- navigation `ArrowLeft` / `ArrowRight` hors contrôles ;
- `100dvh` sans défilement ;
- aucune dépendance distante ;
- schémas techniques manuels et symboles internes validés.
- convention des coupes : matière hachurée, cavité blanche, contour bleu marine et flux coloré ;

## Exigence de qualité des dessins

Cette exigence formulée par F. Henninot vaut pour les prochaines réalisations inerWeb :

- ne pas réduire un organe technique à un bloc opaque lorsque son fonctionnement interne est enseigné ;
- privilégier une vraie vue en coupe pédagogique, avec bord extérieur, matière, cavités, siège,
  pièce mobile et chemin du fluide immédiatement distinguables ;
- rester schématique et centré sur le principe : le dessin n'a pas à être exhaustif, mais il doit
  rendre la relation cause–effet compréhensible au premier regard ;
- soigner les proportions, les contours, les légendes et la composition afin d'éviter l'aspect
  générique ou provisoire d'un simple assemblage de formes ;
- produire des illustrations SVG manuelles originales pour les bobines, organes, gestes et pannes ;
- habiller une page trop textuelle par un dessin technique utile qui rappelle clairement le sujet,
  sans ajouter de décoration sans fonction pédagogique ;
- conserver un état fixe déjà complet et compréhensible : l'animation ne fait que raconter le
  fonctionnement et ne doit jamais être nécessaire pour comprendre le dessin.

## Cycle de rendu

`renderLesson()` arrête la voix, injecte le contenu éditorial, appelle la fonction `render` de
l’étape, puis actualise progression et navigation. Toute activité reconstruite par `innerHTML`
rebranche immédiatement ses écouteurs.

## Points métier à préserver

- le parcours reste général : aucune marque ni référence commerciale dans l’interface apprenant ;
- « normalement fermée » désigne l’état sans alimentation électrique ;
- « normalement ouverte » désigne une vanne ouverte sans alimentation électrique ;
- la bobine alimentée crée un champ magnétique qui attire le noyau mobile ;
- en action directe, le noyau commande l’obturateur principal ;
- en commande assistée, le noyau ouvre un pilote et la pression aide une membrane ou un piston ;
- sur une vanne assistée NF, l’orifice d’équilibrage amène la pression amont au-dessus de la
  membrane ; le pilote décharge cette chambre vers l’aval pour permettre l’ouverture ;
- sur la ligne liquide de référence, la pression amont est la HP, mais « pression amont » reste le
  terme à employer dans le parcours général ;
- une particule entre obturateur ou membrane et siège peut empêcher la fermeture complète ;
- ne jamais transposer une coupe générique à tous les modèles ;
- préserver la lecture en coupe simplifiée : le bord extérieur, la matière et le passage intérieur
  doivent rester distinguables même sans la couleur ;
- la ligne liquide n’est qu’un montage de référence ;
- ne jamais inventer une tension, une puissance, une compatibilité de bobine ou une logique de commande ;
- suivre la flèche et l’orientation de la notice réelle ;
- ne jamais inventer une limite de pression, une température de montage ou une procédure universelle ;
- montrer le chiffon humide comme méthode issue d’une notice, pas comme autorisation universelle ;
- ne pas affirmer qu’une grosse électrovanne doit être démontée du seul fait de sa taille : vérifier
  la procédure de dépose de la pièce supérieure dans la notice réelle ;
- couper et consigner avant de déposer la bobine ; ne jamais l’alimenter déposée ;
- ne jamais supposer la présence d’une commande manuelle ;
- ne jamais autoriser une ouverture sous pression ni une mesure improvisée sous tension.

## Références documentaires

Les documents et médias fournis ont été consultés uniquement comme références. Ils ne définissent
plus le scénario apprenant et aucun d’eux n’est intégré, converti ou décalqué. Les noms, modèles,
liens, droits et faits recoupés sont consignés dans `SOURCES-TECHNIQUES.md` et
`SOURCES-IMAGES.md`. Conserver les mentions fabricant dans ces registres de traçabilité seulement.

## Vérifications attendues

Tester les 14 étapes, les activités et le quiz en `1024 × 768`, `1280 × 720`, `1366 × 768`,
`390 × 844` et `360 × 640`, avec voix indisponible et stockage bloqué. Vérifier aussi le dialogue
Sources, l’impression, le clavier et l’absence de requête réseau distante.
