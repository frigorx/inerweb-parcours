# REPRISE — atelier animations

> **À LIRE EN PREMIER** dans toute nouvelle session sur ce dépôt.
> Créé le **6 août 2026**.

---

## 1. Ce que c'est, et pourquoi il existe

Une **zone de travail séparée** pour refondre les planches animées et les tutos guidés
produits dans `pilote-fluides`, **sans jamais toucher à l'original**.

Demande de F. Henninot (06/08) : *« On a fait toutes ces animations, je ne voudrais pas les
casser, mais créer une autre zone de travail pour pouvoir faire une refonte en partie assez
importante de tout ce que l'on a déjà fait. »*

> ⚠️ **Vocabulaire.** Ce ne sont **pas des vidéos**. Ce sont :
> - des **planches animées** — des fichiers SVG dont l'animation est écrite dans le fichier
>   (SMIL ou CSS). Aucun rendu, aucun encodage : tout est du texte, tout est modifiable ligne
>   à ligne, et une correction coûte une minute et non un ré-export.
> - des **tutos guidés** — des pages HTML autonomes qui avancent par étapes, avec questions,
>   sons et parfois voix de synthèse.
>
> C'est la raison pour laquelle une refonte est possible : rien n'est figé dans un fichier
> vidéo. Il n'y a rien à « re-tourner ».

---

## 2. La règle d'or

**`C:\git\pilote-fluides` n'est jamais modifié depuis ce dépôt-ci.**
Il continue de tourner, il reste publié, la galerie en ligne reste intacte :
<https://frigorx.github.io/pilote-fluides/galerie.html>

Le jour où une pièce refondue est jugée bonne, elle est **reportée à la main** dans
`pilote-fluides` — décision par décision, jamais par une copie de dossier en bloc.

---

## 3. Ce qu'il y a dans le dossier

| Dossier | Rôle |
|---|---|
| `fonds-origine/` | **La copie gelée.** L'arborescence d'origine reproduite à l'identique (`moteur/` + `packs/fluides/res/`) pour que les chemins relatifs `../../../../moteur/` continuent de résoudre. **On ne modifie rien ici** : c'est le témoin, ce à quoi on compare. |
| `refonte/` | La zone de travail neuve. Vide au départ. |
| `build/inventaire.mjs` | Le script qui relève le fonds et fabrique la page de tri. |
| `inventaire.html` | **La page de tri** (générée). Voir § 5. |

### Le fonds, en chiffres

| | Nombre | Poids |
|---|---|---|
| Planches animées (`res/svg/*.svg`) | **44** | 444 Ko |
| Tutos guidés (pages HTML autonomes) | **20** | ~5 Mo |
| Sons, images, bibliothèque d'illustrations | — | ~6 Mo |
| **Total du fonds gelé** | | **12 Mo** |

**Origine exacte** : `frigorx/pilote-fluides`, commit `b59b57f` du 05/08/2026
(*« Positionnement d'entrée : la carte ex-pos et son extension moteur »*), dépôt propre au
moment de la copie. C'est la référence à citer si l'on doit un jour prouver ce qui a été repris.

---

## 4. État de diffusion

**Local uniquement.** Aucun dépôt distant, aucune publication.
Doctrine [[feedback_diffusion_gelee]] : rien ne sort sans feu vert au cas par cas.

---

## 5. La marche à suivre — trancher avant de coder

Ouvrir **`inventaire.html`** dans le navigateur (double-clic suffit, aucun serveur).
La page affiche les 64 pièces, chacune jouable sur place :

1. **Regarder** — chaque planche se rejoue d'un clic, chaque tuto se recharge dans son cadre ;
   le texte porté par chaque planche est dépliable, c'est lui qu'on relit pour juger du fond.
2. **Trancher** — trois boutons par pièce : **garder telle quelle / refondre / abandonner**,
   plus une note libre (« pourquoi », « ce qu'il faut changer »).
3. **Exporter** — le bouton *↧ Exporter les décisions* produit un Markdown prêt à coller ici.

Les décisions sont gardées dans le navigateur (`localStorage`), donc on peut fermer la page
et reprendre plus tard. Le tri peut se faire en plusieurs fois.

**C'est ce Markdown exporté qui devient le cahier des charges de la refonte.** Tant qu'il
n'existe pas, refondre revient à deviner.

Pour régénérer la page après un changement du fonds :

```bash
node build/inventaire.mjs
```

---

## 6. Le cap — tranché le 06/08/2026

**Doctrine complète : `refonte/MODELE-CAPSULE.md`.** En résumé :

- **Découpage en capsules.** L'accueil demande « Qu'est-ce que je veux réviser ? ». On choisit
  **un** sujet, qui se déroule en **un fil court** (5 à 7 écrans, une idée par écran).
- **« Voulez-vous en savoir plus ? »** À chaque notion connexe, un insert propose le détour —
  dans l'esprit du *« Would you like to know more? »* de **Starship Troopers**. Qui veut, ouvre ;
  qui ne veut pas, continue, et **le fil ne s'allonge pas**. Retour exactement où l'on était.
  Un détour peut avoir ses propres détours : c'est ce qui permet **d'intercaler plus tard
  d'autres notions** sans toucher au fil.
- **Les quatre volets** demandés : la forme, le fond, la mécanique, le parcours.
- **Public élargi** : stagiaires habilitation **et** élèves CAP/Bac Pro (donc FLE/DYS).
- **Une voix unique fabriquée**, masculine ou féminine au choix du lecteur, vitesse réglable
  de 0,6 × à 1,6 ×.
- **Une seule charte** pour tout l'ensemble : `refonte/moteur/capsule.css`. Zéro feuille de
  style par capsule.

### Ce qui est construit

| | |
|---|---|
| `refonte/index.html` | l'accueil « Qu'est-ce que je veux réviser ? » |
| `refonte/capsule.html` | le lecteur (`?sujet=…`) |
| `refonte/moteur/capsule.js` · `capsule.css` | **le** moteur et **la** charte, uniques |
| `refonte/capsules/*.js` | **3 capsules** — voir le tableau ci-dessous |
| `refonte/voix/fabriquer.mjs` | fabrique les MP3. **Lancé le 06/08** : 96 fichiers, 17 Mo |
| `ECOUTER-LES-VOIX.html` | les 4 voix neuronales, **son inclus dans la page** |
| `DECOUPAGE-3-CAPSULES.html` | **les 3 capsules en un seul fichier**, sans son (257 Ko) |
| `CAPSULE-AVEC-LA-VOIX.html` | une capsule **avec ses 18 narrations dedans** (3,9 Mo) |

### Les capsules produites

| Sujet | Niveau | Fil | Détours | Écrans | Voix |
|---|---|---|---|---|---|
| Lire le code d'un fluide | découverte | 6 | 7 | 18 | ✅ |
| A1, A2L, A3 : lire l'étiquette | métier | 6 | 8 | 16 | ✅ |
| Le tirage au vide : pourquoi, et jusqu'où | métier | 6 | 7 | 14 | ✅ |

**Voix retenues** : **Henri** (masculine) et **Denise** (féminine), voix neuronales `edge-tts`.
Elles se changent **à un seul endroit** : la constante `VOIX` de `refonte/voix/fabriquer.mjs`.
Les fichiers vivent dans `refonte/voix/masculine|feminine/<capsule>/<ecran>.mp3`.

Une capsule est **un fichier de données** : on ajoute un sujet ou un détour sans écrire
une ligne de JavaScript.

### Ce qui reste en attente de F. Henninot

1. **Le découpage** — ouvrir `DECOUPAGE-3-CAPSULES.html` : le partage fil / détours est-il
   le bon ? C'est ce qui commande les 61 pièces restantes.
2. **La voix** — ouvrir `CAPSULE-AVEC-LA-VOIX.html`. Henri et Denise sont un choix par
   défaut, à confirmer ou à changer.
3. **La justesse métier** — les trois capsules n'ont **jamais été relues par un frigoriste**.
   Le contenu vient du fonds, mais il a été réécrit et complété.
4. **Le tri du fonds** — `inventaire.html`, pièce par pièce.

---

## 7. Rappels de charte

- Charte inerWeb par défaut : `C:\git\usine-contenu\00-charte\CHARTE-GRAPHIQUE-INERWEB.md`
  (son § 8 est le bloc à coller en consigne).
- **Jamais de thème sombre**, même sur une page « expérience » — tranché deux fois
  [[feedback_theme_sombre_interdit]].
- Une animation qui **porte du contenu** ne se conditionne jamais à `prefers-reduced-motion`
  [[feedback_animations_svg]].
- Croix du frigoriste : détendeur gauche · compresseur droite · condenseur haut ·
  évaporateur bas [[feedback_croix_frigoriste]].
- La couleur ne porte jamais seule l'information : couleur **+** trait **+** mot.
