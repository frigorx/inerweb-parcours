# Tutos guidés par les symboles — le contrat d'écriture

> Prototype du 14/08/2026. **Rien n'est poussé.** Le contenu métier vient des six
> fiches méthodes de F. Henninot mais la transposition n'a pas été relue.

## L'idée, en une phrase

On a déjà les symboles normalisés et on sait où passent les tuyaux : il suffit donc
d'écrire **où poser chaque symbole** et **dans quel ordre le montrer**. Le moteur fait
le reste.

## Les sept tutos, et d'où ils viennent

| Tuto | Source |
|---|---|
| Le circuit frigorifique | rédigé pour la démonstration (croix du frigoriste) |
| Pose des manomètres | fiche méthode 01 (F. Henninot, mai 2026) — 13 étapes |
| Dépose des manomètres (EVM) | fiche méthode 02 — 11 étapes |
| Mise sous pression azote | fiche méthode 03 — 7 étapes + remarques |
| Tirage au vide | fiche méthode 04 — 7 étapes |
| Charge en fluide frigorigène | fiche méthode 05 — méthode 1, avec l'étape 6 bis |
| Récupération de fluide | fiche méthode 06 — y compris le schéma à deux tés |

Les fiches sources portent l'en-tête académie d'Aix-Marseille → les six tutos méthodes
sont marqués `marque: 'lycee'`. NB : la fiche 06 numérote deux étapes « 4 » ;
repris ici en 4 et 5.

## Les gestes recyclables — la brique centrale

Beaucoup d'étapes reviennent d'une fiche à l'autre : desserrer les presse-étoupes,
vérifier les vannes du manifold, poser l'aimant sur l'électrovanne, peser la bouteille…
**Chacun de ces gestes est écrit UNE fois** dans `donnees/gestes.js`, et une fiche
l'appelle par :

```js
{ base: 'presse-etoupe-desserrer', focus: ['vbp', 'vhp'] }
```

La fiche ne fournit que la mise en scène (`pose` / `trace` / `retire` / `focus`) ; titre,
texte et encadrés viennent du geste. Tout champ écrit dans la fiche **l'emporte** sur le
geste générique — c'est ainsi que l'étape 9 de la pose précise « …pour tirer au vide les
flexibles et le manifold » sans dupliquer le geste.

Corriger un geste dans `gestes.js` corrige donc **toutes** les fiches qui l'utilisent.
19 gestes au 14/08 : préparation (EPI, capuchons, presse-étoupes, sièges), manifold et
flexibles, pompe à vide, électrovanne, pesée, CERFA, contrôles.

## Ce qui rend la chose simple

Le piège, quand on veut raccorder des symboles entre eux, c'est de vouloir calculer des
points d'accroche : chaque symbole a sa propre `viewBox`, ses propres cotes, et on passe
la journée à ajuster des coordonnées.

**On ne calcule rien.** Les tuyaux sont tracés sur la grille, d'un centre d'organe à
l'autre, et les symboles sont **posés par-dessus** avec un fond opaque qui perce le trait.
C'est exactement ce qu'on fait à la main sur un schéma : on tire le trait, on pose le
symbole dessus. Résultat toujours propre, quelle que soit la `viewBox` du symbole.

## Ajouter un tuto : un seul fichier

1. Écrire `donnees/<mon-tuto>.js` (copier un existant, c'est le plus rapide).
2. Ajouter une ligne `<script src="donnees/<mon-tuto>.js"></script>` dans `index.html`.

C'est tout. Aucune feuille de style, aucun code à toucher.

## Le fichier de données

```js
window.TUTOS = window.TUTOS || {};
window.TUTOS['mon-tuto'] = {
  titre: '…',
  sousTitre: '…',
  cartouche: 'Tuto',        // le mot du cartouche orange du logo
  marque: 'inerweb',        // 'inerweb' ou 'lycee' — voir plus bas
  grille: [1000, 640],      // la surface de dessin

  elements: [ … ],          // les organes
  tuyaux:   [ … ],          // les liaisons
  etapes:   [ … ]           // le déroulé
};
```

### Un organe

```js
{ id: 'comp', sym: 'compresseur_piston', x: 820, y: 330, taille: 128,
  rot: -90, nom: 'Compresseur', nomDessus: false }
```

| Champ | Rôle |
|---|---|
| `id` | le nom court, c'est lui qu'on cite dans les étapes |
| `sym` | le nom du fichier dans `fonds-origine/packs/fluides/res/symboles/`, **sans `.svg`** |
| `x`, `y` | le centre, sur la grille |
| `taille` | la boîte carrée qui contient le symbole (il n'est jamais déformé) |
| `rot` | rotation en degrés, pour orienter les raccords (voir ci-dessous) |
| `nom` | l'étiquette affichée ; `nomDessus: true` la met au-dessus |

**Orienter un symbole.** La plupart des symboles ont leurs raccords à gauche et à droite.
Rotation horaire : `rot: 90` amène le côté gauche **en haut** et le côté droit **en bas** ;
`rot: -90` fait l'inverse. C'est tout ce qu'il y a à savoir pour monter une croix du
frigoriste.

### Une liaison

```js
{ id: 'refoulement', points: '820,330 820,120 500,120',
  nature: 'hp_gaz', mot: '…', decalage: [-60, -22] }
```

`points` est une suite de sommets sur la grille — les coudes sont arrondis tout seuls.
Les flèches de sens sont posées automatiquement au milieu de chaque segment.

Natures disponibles, **chacune = une couleur + un style de trait + un mot écrit**
(la couleur ne porte jamais seule l'information) :

| `nature` | rendu |
|---|---|
| `hp_gaz` | rouge tireté — « HP · gaz chaud » |
| `hp_liquide` | rouge plein — « HP · liquide » |
| `bp_gaz` | bleu tireté — « BP · gaz » |
| `bp_melange` | bleu plein — « BP · liquide + gaz » |
| `service` | gris pointillé — « flexible de service » |
| `azote` | vert plein — « azote » |

`mot` remplace le libellé par défaut, `mot: false` le supprime, `decalage: [dx, dy]`
déplace l'étiquette si elle gêne.

### Une étape

```js
{
  titre: '…',
  texte: '…',
  pose:   ['comp', 'cond'],  // les organes qui APPARAISSENT à cette étape
  trace:  ['refoulement'],   // les tuyaux qui SE DESSINENT à cette étape
  retire: ['flexBP'],        // ce qui QUITTE la scène (dépose, débranchement)
  focus:  ['comp'],          // ce qui est mis en évidence maintenant
  geste: '…',                // encadré bleu
  danger: '…',               // encadré rouge
  verifier: '…',             // encadré orange « à relire par un frigoriste »
  controle: { question: '…', choix: ['…','…','…'], bonne: 1, explication: '…' }
}
```

Ou, pour un geste recyclable : `{ base: 'nom-du-geste', pose: […], focus: […] }`.

Tout ce qui a été posé ou tracé aux étapes précédentes **reste affiché** : le schéma se
construit sous les yeux. Seul ce qui est dans `focus` est mis en évidence, et `retire`
fait disparaître ce qui est débranché.

### Les symboles complémentaires

Le fonds n'a pas tout : `symboles-complements/` ajoute pompe à vide, vacuomètre,
bouteille de fluide, bouteille d'azote avec détendeur, balance et station de
récupération (vannes IN / OUT) — dessinés au trait `#1b3a63` du fonds. Un élément les
appelle avec `complement: true`.

### Les éléments QElectroTech (préfixe `qet-`)

`build/elmt-vers-svg.mjs` convertit n'importe quel `.elmt` de la bibliothèque QET en
SVG à la charte (trait recoloré, bornes → points de raccordement) :

```
node build/elmt-vers-svg.mjs C:\git\tp-qelectrotech\bibliotheque\qet\90-frigorifique\...\element.elmt
```

13 éléments convertis le 14/08 (rotalock, solenoide, semi-hermétique, groupes de
condensation, pompe à vide, manifold, station, bouteille, vannes de service…) —
la planche de choix : `_paquets/PLANCHE-SYMBOLES-QET.html`. Déjà en place dans le
décor : `qet-llave-rotalock` (vanne de départ liquide) et `qet-solenoide-1` (EVM).

Deux gisements à connaître :
- `C:\git\tp-qelectrotech\bibliotheque\qet` — 891 `.elmt` classés, LA source pour
  convertir à la charte ;
- `C:\git\bibliotheque-symboles-energie` — **8 592 SVG** (toute la collection QET,
  catalogue.json cherchable, dont 324 en réfrigération). Style BRUT (trait noir,
  fond blanc plein) : réservoir et catalogue, pas une source directe des tutos —
  et ⚠ 1 260 noms traduits automatiquement, parfois faux (« recuperador-refrig »
  y est nommé « Pompe à vide »).

## Les adresses

| Adresse | Effet |
|---|---|
| `tuto.html?t=circuit-4-organes` | le tuto |
| `…&e=5` | ouvre directement à l'étape 5 (bouton « Copier le lien exact ») |
| `…&projection=1` | mode salle : texte grossi, schéma agrandi, sans défilement |
| `…&marque=lycee` | logo du lycée au lieu du logo inerWeb |

## Le logo : inerWeb ou scolaire

Même mise en page, logo différent. `marque: 'inerweb'` pose le logo inerWeb (cotes figées
du § 3.4 de la charte). `marque: 'lycee'` pose un cartouche « Lycée Jacques Raynaud ».

⚠️ **Le logo du lycée est pour l'instant un cartouche texte** : le fichier image n'existe
nulle part dans les dépôts. À fournir pour les documents scolaires.

## Le paquet autonome

```
node build/paquet-tutos.mjs 2026-08-14
```

produit `_paquets/TUTOS-SYMBOLES/` (les symboles du fonds copiés dedans, chemin du
moteur réécrit) et pose le zip daté sur le Bureau. Dans le paquet : `index.html` en
double-clic, ou `LANCER.cmd` (serveur Node pur, port 4195) si le navigateur bride
les fichiers locaux.

## Relecture de F. Henninot du 14/08 — ce qui a été corrigé dans la foulée

1. **L'EVM remise à sa place** : sur la LIGNE LIQUIDE (entre bouteille et détendeur),
   plus jamais à la sortie du compresseur. C'était la grosse erreur.
2. **Le circuit rendu réaliste** (`donnees/decors.js`, décor partagé par les fiches
   01 à 05) : compresseur, vanne HP au refoulement, CD, bouteille liquide, **vanne de
   départ liquide** — le point de branchement HP habituel du flexible rouge —, EVM,
   détendeur, EV, vanne BP à l'aspiration.
3. **Les échangeurs remis dans le sens de leur flèche** (quart de tour à gauche) et
   étiquetés **CD** / **EV**.
4. **La fiche 06 redessinée** : tracés sans superposition, les deux tés marqués d'un
   point, vannettes posées sur les lignes (entrée, by-pass, flexible de pompe).
5. **Le geste professionnel montré** : bouton « 👁 Voir le geste » (popup) sur les
   étapes concernées — vanne rotalock (capuchons, presse-étoupe), électrovanne
   (aimant, bobine), réutilisés depuis `refonte/modules/`. Les textes des gestes
   disent désormais OÙ est chaque chose (le capuchon de tige, celui de la prise de
   service, l'écrou de presse-étoupe, le carré de manœuvre).
6. **Le cours « La vanne de service » récupéré** (demande de Franck, dépôt
   `frigorx/vanne-de-service` copié dans `refonte/modules/vanne-de-service/`) :
   ses écrans s'ouvrent directement dans les popups — `?ecran=positions` pour les
   sièges (fiches 01 et 02), `?ecran=geste` pour le branchement des flexibles.
7. **Le compresseur stylisé avec ses vannes de service** (2e passe du 14/08) :
   aucun symbole de ce type n'existait dans les bibliothèques — dessiné en
   complément (`compresseur_vannes_service.svg`, style de la rotalock stylisée de
   la bouteille-liquide : corps semi-hermétique, culasse, deux vannes rotalock à
   capuchon et prise de service protégée). Les zones « Vanne HP » / « Vanne BP »
   se posent SUR les vannes du dessin (halo et étiquette ciblés), le flexible
   bleu rejoint la prise de service de l'aspiration en passant DEVANT le
   refoulement (pont de schéma au croisement), et une **légende des traits**
   (couleur + style + mot) s'affiche sous chaque schéma.

## Ce qui a été vérifié le 14/08/2026

Servi en local, sur les SEPT tutos (70 étapes) :

- chaque étape de chaque tuto parcourue — **zéro chevauchement d'étiquettes, zéro texte
  hors cadre** (mesuré par `getBBox()`, pas regardé). Deux défauts trouvés ainsi et
  corrigés : l'étiquette azote de la fiche 03 sur celle du flexible BP, l'étiquette
  du compresseur de la fiche 05 sous le bord de la grille ;
- toutes les références `pose`/`trace`/`retire`/`focus` résolues, tous les gestes
  `base` connus, tous les fichiers de symboles servis ;
- le retrait vérifié : dépose des flexibles (fiche 02) et débranchement de la pompe
  (fiche 05) font bien disparaître les pièces de la scène ;
- formats 1366 × 768, 1024 × 768, 768 × 1024 et 375 × 812 : aucun débordement
  horizontal ; mode projection à 1024 × 768 : schéma entier, sans défilement ;
- contrôles de compréhension : mauvaise réponse signalée sans révéler la bonne,
  bonne réponse verrouillée et expliquée ;
- **le paquet autonome vérifié servi depuis `_paquets/`** : les symboles se chargent
  depuis sa copie locale `symboles-fonds/` ;
- **zéro erreur console.**

**Pas vérifié par un œil humain** : le déroulé des animations (tracé, fondu) et le
rendu papier du livret (bouton « 🖨 Livret »).

### Les vues annotées — l'élément réel, fléché

Précision de F. Henninot (14/08 soir) : les symboles QET ne remplacent pas les schémas,
ils **montrent la pièce** pour que l'utilisateur la reconnaisse — « tu peux pointer avec
une flèche le carré de manœuvre, le bouchon ». Le champ `vue` d'un geste ou d'une étape
affiche l'élément en grand avec des flèches nommant chaque partie :

```js
vue: { titre: '…', sym: 'qet-llave-rotalock', complement: true,
       boite: [-38,-19,80,40],        // le viewBox natif du symbole
       cadre: [-126,-34,252,70],      // la surface avec les libellés
       reperes: [{ mot: 'Presse-étoupe', x: -14.5, y: -2.5, lx: -72, ly: 14 }] }
```

Deux vues partagées vivent dans `gestes.js` : `VUE_ROTALOCK` (clé sur le carré,
presse-étoupe, prise de service, écrou, tuyauterie) sur les 6 gestes de vannes, et
`VUE_EVM` (bobine, écrou, place de l'aimant, raccords) sur l'aimant et la dépose.
⚠ **La position des repères est mon interprétation du dessin — à valider.**

## Ce qui reste à trancher

1. **Valider la version corrigée** — la v2 applique la relecture du 14/08 mais n'a
   pas encore reçu le bon à tirer : place exacte de la vanne de départ liquide,
   transposition « vanne HP → départ liquide » dans les fiches 01 et 02 (encadrés
   « à vérifier »), schéma redessiné de la fiche 06.
2. **Enrichir les popups de gestes** avec les archives d'inerweb-habilitation et la
   bibliothèque d'illustrations (photos de gestes réels). Règle : contrôle à l'œil
   de chaque image avant de la poser — jamais sur la seule description du modèle.
3. **Le logo du lycée** — cartouche texte en attendant le fichier.
4. **Où ça vit** — ce prototype est dans `atelier-animations`. Si la formule est
   retenue, décider s'il rejoint le pack `pilote-fluides` ou s'il reste ici.
5. **Le groupe de condensation en circuit complet** (piste ouverte par Franck le
   14/08 soir) : le dessin QET `unidad-condensadora` porte un bon schéma fluidique —
   le compléter avec détendeur, évaporateur et électrovanne pour en faire le décor
   d'une vraie chambre froide. Pas commencé.
