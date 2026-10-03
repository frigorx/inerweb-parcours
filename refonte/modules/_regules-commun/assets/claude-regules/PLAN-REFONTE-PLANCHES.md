# Les régules — refonte film + planches pas à pas (chantier ouvert le 03/10/2026)

Demande de F. Henninot : « l'infographie n'est pas à la hauteur de ce que l'on sait faire maintenant ».
Méthode : chaque station = un film (schéma électrique + circuit + chronogramme) et trois planches pas à pas
sur le MÊME schéma (armoire exposée par le film : RK01, RK02, RK3, RK4, RK5 ; kit `planches-kit.jsx` = PK).
**Feu vert permanent du 03/10 : publier sur inerweb.fr chaque station terminée, sans redemander.**

| # | Station | Film | Planches | En ligne |
|---|---|---|---|---|
| 1 | commande directe | v2 existant | ✅ 01a/b/c | ✅ 03/10 |
| 2 | protection minimum | existant (+ 02b migration) | ✅ 02a/b/c | ✅ 03/10 |
| 3 | pump-down automatique | existant | ✅ 03a/b/c | ✅ 03/10 |
| 4 | pump-down amélioré | ✅ neuf | ✅ 04a/b/c | ✅ 03/10 |
| 5 | pump-down unique | ✅ refait sur l'annexe 3 EP2 CAP VAF 2016 | ✅ 05a/b/c | ✅ 03/10 |
| 6 | sans dégivrage commandé | aucun | à faire | — |
| 7 | dégivrage naturel | aucun | à faire | — |
| 8 | dégivrage électrique | 🔴 existant mais FAUX par endroits (voir plus bas) | à faire | film actuel en ligne |
| 9 | gaz chauds | aucun | à faire | — |
| 10 | inversion de cycle | aucun | à faire | — |

## Station 8 — défauts constatés le 03/10 dans le film en ligne (à 0:25, pendant le tirage)
- KM1 est dessiné ALIMENTÉ alors que son contact KT « verrouillage » est OUVERT (le verrouillage s'ouvre à
  tKT, KM1 reste dans `kmIvs` jusqu'à tKMo) : soit KM1 s'arrête tout de suite, soit le verrou n'existe pas.
- `colonne()` rend 'courant' quand aucun contact n'est ouvert, même bobine au repos (`courant ? 'courant' :
  'courant'`) : la colonne KM2 montre du courant de tKT à tKM2 alors que les résistances sont au repos.
- Source de Franck pour le refaire : `3-PROF-PEDAGO/profs cour Indexee/02_CAP-IFCA/C4-MettreEnService/
  6.3 Electricité (régulation pump down avec dégivrage électrique).pdf` (page 2) : single pump-down
  (B1 → KA1 → Y1 par KA1 23-24 ; KM1 = BP B2 · HP B3 · F1 · (KA1 // KM1 13-14)), horloge h1 → RD
  (par B2 θ fin de dégivrage NF et RFD NF), RFD par B2 θ NO // KM1 23-24, RD 3-4 → R1 R2, KM1 67-68
  temporisé → ventilateurs KM3 KM4. ⚠ C'est une fiche d'exercice (« bornes à placer ») : RD 1-2 est
  référencé colonne 7 sans être dessiné, et le rôle de B4 (NF dans la ligne KA1) est à confirmer.
  Le film 8 porte une voix validée : ses phrases sont dans `voix-films/regules-08`.

## Stations 6, 7, 9, 10 — sources (clés du catalogue)
`defrost` Les_degivrages.pdf · `natural` 6.1 Électricité (dégivrage naturel) · `hotgas` 3 Électricité
(dégivrages par gaz chauds) · `givre` planche inerWeb givre-degivrage.svg. Les lire AVANT de dessiner.

## Outillage
- Construire : `node outils/construire-films-regules.mjs <filtre>` (un nom « Planche … » = sans barre de lecture).
- Livrer : worktree détaché sur origin/main de pilote-fluides, puis
  `node outils/livrer-regules-planches.mjs <worktree> <stations…> [--refaire-films]`,
  `node build/animations.mjs`, `node build/retour-accueil.mjs`, commit, push `HEAD:main`.
- Vérifier : inerweb.fr refuse curl (Cloudflare) → sonde Playwright avec un vrai Chrome hors écran, clé
  aléatoire d'abord, vraie clé une seule fois le déploiement vu.
