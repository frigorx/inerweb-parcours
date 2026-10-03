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
| 6 | sans dégivrage commandé | ✅ neuf, fiche 6.1 1er principe | ✅ 06a/b/c | ✅ 03/10 |
| 7 | dégivrage naturel | ✅ neuf, fiche 6.1 2e et 3e principes | ✅ 07a/b/c | ✅ 03/10 |
| 8 | dégivrage électrique | ✅ refait sur la fiche 6.3 (relais calculés) | ✅ 08a/b/c | ✅ 03/10 |
| 9 | gaz chauds | ✅ neuf, commande du schéma CAP C4 (voir plus bas) | ✅ 09a/b/c | ✅ 03/10 |
| 10 | inversion de cycle | ✅ neuf, SANS armoire (voir plus bas) | ✅ 10a/b/c | ✅ 03/10 |

## Station 8 — FAIT le 03/10 (voir le bloc d'en-tête de regules-08.jsx : lectures tranchées de la fiche)
### Défauts constatés le 03/10 avant réfection dans le film en ligne (à 0:25, pendant le tirage)
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

## Méthode des films 6 à 10 (03/10, à garder)
- Les relais ne s'écrivent plus à la main : `RK.resoudre(reseau)` (kit) calcule bobines et potentiels
  à partir des contacts ; le scénario ne fixe que les capteurs (air, batterie, pression, horloge).
  Chaque film expose `RKn.etat(T, CUES, TOTAL)` ; les planches recopient les CUES du `.dc.html`.
- Narration : `refonte/voix/narrations-films/regules-0n.js`, puis `node outils/fabriquer-voix-films.mjs 0n`
  (mesure les MP3 et dit quelles scènes allonger). Enceinte + 1re scène = 13 s (repères du kit à 13 s).
- Station 8 : « B4 » de la fiche 6.3 = contact NF de l'horloge (fiche 6.1) ; « RD 1-2 colonne 7 » =
  renvoi recopié de la 6.2, non repris.

## Stations 9 et 10 — choix à faire valider par Franck (03/10)
- **9 gaz chauds** : la commande de la fiche « 3 Électricité » ne peut pas dégivrer compresseur en marche
  (KM1 23-24 tient RFD qui bloque RD) et ne coupe pas les ventilateurs. Le film suit donc le
  « SCHEMA DE COMMANDE DEGIVRAGE GAZ CHAUDS.doc » (CAP IFCA, C4) — P, B4, KA1 (11-12 sur Y1, 25-26 temporisé
  sur les ventilateurs, 43-44 sur Y3) — et la fiche 3 pour le fluidique. La vanne Y2 « froid » N.O. du
  schéma CAP (installation à deux évaporateurs du TP) n'est pas reprise. Nouvelle source `hotgasCap`.
- **10 inversion** : aucune source ne donne le schéma électrique ⇒ pas d'armoire (règle : pas de schéma
  inventé). Circuit d'après « Les dégivrages » p. 4, vanne en coupe reprise de CartoClim 2.6. Si Franck a
  un schéma de commande, l'ajouter comme armoire calculée (même méthode que 6 à 9).
