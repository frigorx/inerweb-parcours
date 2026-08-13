# Reprise — Voyant liquide pédagogique

## Copie concernée

`C:\Users\henni\Desktop\inerweb full ia\voyant-liquide-pedagogique`

Ne pas reporter automatiquement les changements dans une autre copie de Pilote Fluides.

## Contrat actuel

- 14 étapes ;
- 6 questions ;
- réussite pédagogique à partir de 5/6 ;
- vitesses vocales `0.80 · 0.95 · 1.10 · 1.25`, défaut `0.95` ;
- clé locale `inerweb-voyant-liquide-rate` ;
- aucune voix ni aucun son au chargement ;
- navigation `ArrowLeft` / `ArrowRight` hors contrôles ;
- `100dvh` sans défilement ;
- aucune dépendance distante ;
- schémas techniques manuels et symboles internes validés.

## Cycle de rendu

`renderLesson()` arrête la voix, injecte le contenu éditorial, appelle la fonction `render` de
l’étape, puis actualise progression et navigation. Toute activité reconstruite par `innerHTML`
rebranche immédiatement ses propres écouteurs.

## Points métier à préserver

- distinguer strictement voyant simple et voyant avec indicateur d’humidité ;
- conserver la pastille comme un petit élément distinct de la fenêtre : le fluide reste visible autour ;
- ne jamais présenter une couleur comme universelle ;
- ne jamais généraliser un tableau de seuils en ppm à un autre voyant, fluide ou régime thermique ;
- conserver la distinction entre un jaune transitoire au démarrage et un jaune persistant après stabilisation pour l’exemple SG/SGP ;
- présenter l’horizontale comme la convention du montage étudié, jamais comme une orientation universelle ;
- conserver l’ordre filtre-déshydrateur → voyant sur la ligne liquide de référence ;
- présenter les bulles en aval comme un indice de restriction possible à confirmer par température, pression et sous-refroidissement ;
- ne jamais déduire une sous-charge avec les bulles seules ;
- ne jamais valider la charge avec une fenêtre claire seule ;
- ne fournir aucune valeur universelle ni procédure de chantier ;
- ne jamais autoriser l’ouverture d’un circuit sous pression.

## Références ajoutées le 4 août 2026

Les deux captures fournies et le PDF Danfoss `AC290356803278en-000203` ont été consultés. Ils ne
sont pas intégrés au module : leurs droits de reproduction ne sont pas établis pour les captures,
et le PDF Danfoss porte la mention « All rights reserved ». Voir `SOURCES-IMAGES.md` et
`SOURCES-TECHNIQUES.md`.

Le fichier Danfoss `ID083186495454-0101.eps` et la capture produit
`codex-clipboard-f0e372af-43c1-4cae-932b-05a939537867.png` ont ensuite servi uniquement à vérifier
le volume général de l’organe. Ils ne sont ni intégrés ni décalqués.
La capture `codex-clipboard-d77bf2ca-3d85-46ff-bb05-4dda6cc78ec8.png` a uniquement confirmé
l’existence d’une variante à raccord fileté ; elle reste également hors du livrable.

Les notices Danfoss `AI556919029172en-000101` (fiche SG/SGP, avril 2026) et
`AN220886434888en-001001` (guide d’installation, juin 2020) ont ensuite été rendues et lues
intégralement. Elles confirment l’ordre filtre-déshydrateur → voyant → détente et documentent,
uniquement pour la gamme concernée, le jaune transitoire au démarrage, les précautions de brasage
et la gestion du papier indicateur endommagé. Leurs images, coupes, tableaux et logos ne sont pas
intégrés.

L’archive `OneDrive_1_04-08-2026.zip`, annoncée comme provenant de SolidWorks, contient deux STEP
Danfoss. `WEB032F1156` est une électrovanne EVR 3 à souder et reste hors sujet. `WEB014-9107` est
un voyant SGI 6 flare 1/4 : il a servi à mieux comprendre la famille de raccordement et à guider
un nouveau dessin manuel générique des épaulements, cônes et filetages. Les fichiers STEP eux-mêmes
restent hors du module : aucune géométrie n’a été convertie, décalquée ou intégrée.

## Vérifications attendues

Tester les 14 étapes, les activités et le quiz en `1024 × 768`, `1280 × 720`, `1366 × 768`,
`390 × 844` et `360 × 640`, avec voix indisponible et stockage bloqué. Vérifier aussi le dialogue Sources,
l’impression et l’absence de requête réseau distante.
