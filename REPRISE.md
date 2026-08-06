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

**PUBLIÉ le 06/08/2026**, sur feu vert de F. Henninot, au titre de l'exception « écosystème
habilitation fluides » de [[feedback_diffusion_gelee]].

- Dépôt : <https://github.com/frigorx/inerweb-parcours> — **public**
- Site : <https://frigorx.github.io/inerweb-parcours/>
- **Lien à envoyer aux relecteurs** :
  <https://frigorx.github.io/inerweb-parcours/refonte/relire.html>

**Public mais NON RÉFÉRENCÉ** (choix de F. Henninot) : chaque page porte
`<meta name="robots" content="noindex, nofollow">`, et `robots.txt` **laisse passer** les
robots — c'est volontaire. Un `Disallow` les empêcherait de *lire* la consigne `noindex`, et
l'adresse pourrait être indexée quand même : l'inverse du but recherché.

**Pages se déploie par GitHub Actions** (`.github/workflows/pages.yml`), pas par le mode
d'origine, qui échouait sans message exploitable. ⚠️ Le fichier de workflow **ne peut pas
être poussé par git** (le jeton du push n'a pas le droit `workflow`) : il se modifie par
l'API — `gh api -X PUT repos/frigorx/inerweb-parcours/contents/.github/workflows/pages.yml`.

Le premier déploiement a demandé trois tentatives et une réinitialisation de la configuration
Pages (`gh api -X DELETE …/pages` puis `POST … -f build_type=workflow`). Compter aussi
**plusieurs minutes de 503** après un déploiement réussi : c'est normal, ce n'est pas un échec.

### Avant de conclure qu'un déploiement échoue par notre faute

**Regarder d'abord si GitHub est en panne** :

```bash
curl -s https://www.githubstatus.com/api/v2/components.json
```

Le 06/08 après-midi, quatre déploiements de suite ont échoué — délais dépassés, puis
annulations immédiates — alors que **Actions et Pages étaient en panne majeure**. Rien
n'était cassé dans le site, et aucune des corrections tentées n'aurait pu y changer quoi que
ce soit. Une demi-heure perdue à chercher au mauvais endroit.

Autre chose apprise : le réglage `timeout` de `deploy-pages` est **plafonné à 600 000 ms**.
Écrire davantage ne sert à rien — GitHub ramène silencieusement à cette valeur et le note en
avertissement dans le journal.

**Distinguer les deux états**, ils n'ont rien à voir :
- **le dépôt** (`git push`) — c'est là que vit le travail, et il passe même pendant une panne ;
- **le site** (GitHub Pages) — une publication, qui peut rester en retard sur le dépôt.

Le fichier autonome déposé sur les bureaux de F. Henninot, lui, est toujours à jour
immédiatement : c'est le chemin de secours quand Pages traîne.

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

**⭐ 06/08 au soir — la commande s'élargit : un véritable SITE INTERNET.** Franck (dictée) :
animations trop longues à recouper, ordre à repenser, électrovanne absente, KVP-KVL-KVR /
détendeur électronique / sous-refroidissement / lecture de mano en préparation chez lui,
tutos **vidéos filmées** à venir (pose-dépose manos, vannes de service), le tout « ne doit
faire qu'un tout », mis en valeur pour l'autoapprentissage ET l'enseignant.
**→ La proposition globale est écrite : `PROPOSITION-SITE.md`** (racine). Rien n'est engagé
tant que Franck n'a pas tranché ses 6 décisions (§ 11 de la proposition).

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

### Les capsules produites — 7 sujets, 92 écrans

| # | Sujet | Niveau | Fil | Détours | Écrans | À vérifier |
|---|---|---|---|---|---|---|
| 1 | Le circuit : quatre organes, deux pressions | découverte | 6 | 5 | 12 | 3 |
| 2 | Lire le code d'un fluide | découverte | 6 | 7 | 18 | 8 |
| 3 | A1, A2L, A3 : lire l'étiquette | métier | 6 | 8 | 16 | 10 |
| 4 | La surchauffe : la mesurer, la comprendre | métier | 6 | 5 | 11 | 6 |
| 5 | Le tirage au vide : pourquoi, et jusqu'où | métier | 6 | 7 | 14 | 10 |
| 6 | Le contrôle d'étanchéité : qui, quand, comment | examen | 6 | 5 | 11 | 8 |
| 7 | Récupérer le fluide : le geste et la règle | examen | 6 | 3 | 10 | 6 |

**Total** : 40 détours · 24 planches du fonds réemployées · **63 points « À vérifier »**
sur 51 écrans · 184 narrations (33 Mo).

L'ordre ci-dessus est **déclaré** par chaque capsule (champ `ordre`) : sans lui, l'accueil
sortirait dans l'ordre alphabétique des fichiers et proposerait les classes de sécurité
avant d'avoir montré un circuit.

**Voix** : **Henri** (masculine) et **Denise** (féminine), voix neuronales `edge-tts`.
Elles se changent **à un seul endroit** : la constante `VOIX` de `refonte/voix/fabriquer.mjs`.

### Le mode relecture

Activé par **une seule ligne** — `window.RELECTURE = true` — et par rien d'autre. Le produit
normal ne porte pas une trace du dispositif.

- **Encadrés rouges « À VÉRIFIER »** : écrits dans les capsules (champ `verifier`), jamais
  générés. Couleur **+** trait **+** mot, jamais la couleur seule.
- **En bas de chaque écran** : Juste / À corriger / Question / Sensible, plus une remarque
  libre gardée à la frappe.
- **Barre du bas** : compteur, « Enregistrer mon relevé » (Markdown signé, téléchargé), et
  un **va-et-vient vers le produit nu** — ce que l'élève verra.
- Tout reste sur la machine du relecteur. **Aucun serveur, rien ne sort.**

### Les livrables

| Fichier | Poids | Pour qui |
|---|---|---|
| `CAPSULES-BETA.zip` · dossier `BETA/` | 28 Mo | **les 10 relecteurs** — produit complet, voix comprises, `LANCER.cmd` + `LISEZ-MOI.txt` |
| `MAQUETTE-BETA.html` | 471 Ko | **relire depuis un téléphone** — 7 capsules en un fichier, mode relecture actif, sans son |
| `CAPSULE-AVEC-LA-VOIX.html` | 3,9 Mo | juger la voix — une capsule, 18 narrations dedans |
| `ECOUTER-LES-VOIX.html` | 620 Ko | comparer les 4 voix candidates |

`BETA/` et le zip sont **hors dépôt** (`.gitignore`) : ce sont des produits, refaits d'une
commande — `node build/paquet-beta.mjs`.

### Ce qui reste en attente de F. Henninot

1. **Le découpage** — ouvrir `MAQUETTE-BETA.html` : le partage fil / détours est-il
   le bon ? C'est ce qui commande les 61 pièces restantes.
2. **La voix** — ouvrir `CAPSULE-AVEC-LA-VOIX.html`. Henri et Denise sont un choix par
   défaut, à confirmer ou à changer.
3. **La justesse métier** — les sept capsules n'ont **jamais été relues par un frigoriste**.
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
