# Les régules — refonte film + planches pas à pas (chantier ouvert le 03/10/2026)

Demande de F. Henninot : « l'infographie n'est pas à la hauteur de ce que l'on sait faire maintenant ».
Méthode : chaque station = un film (schéma électrique + circuit + chronogramme) et trois planches pas à pas
sur le MÊME schéma (logique `etat()` exposée par le film, kit `planches-kit.jsx`). Feu vert permanent du 03/10 :
publier sur inerweb.fr chaque station terminée, sans redemander.

| # | Station | Film | Planches | En ligne |
|---|---|---|---|---|
| 1 | commande directe | v2 existant | à faire | — |
| 2 | protection minimum | existant (+ 02b migration) | à faire | — |
| 3 | pump-down automatique | existant | ✅ 03a/b/c | à livrer |
| 4 | pump-down amélioré | ✅ neuf | ✅ 04a/b/c | ✅ 03/10 |
| 5 | pump-down unique | 🔴 à refaire sur l'annexe 3 EP2 2016 (KA1 sécu + S1, KA2, H6) | à faire | — |
| 6 | sans dégivrage commandé | aucun | à faire | — |
| 7 | dégivrage naturel | aucun | à faire | — |
| 8 | dégivrage électrique | existant (avec voix) | à faire | — |
| 9 | gaz chauds | aucun | à faire | — |
| 10 | inversion de cycle | aucun | à faire | — |

Livraison site : worktree détaché sur origin/main, copie ciblée, `build/animations.mjs` +
`build/retour-accueil.mjs`, push `HEAD:main`, sonde avec un vrai Chrome (Cloudflare refuse curl).
