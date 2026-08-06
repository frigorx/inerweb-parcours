# Manifeste — Bibliothèque d’images « Habilitation fluides A1 »

Livraison produite le 31 juillet 2026 à partir du brief fourni dans `pasted-text.txt`.

## Contenu livré

- 43 illustrations de thème `illu-*.webp`, 1024 × 1024 px.
- 4 planches transparentes de 12 icônes, grille 4 × 3, 2048 × 1536 px : rôles, sécurité, outillage, fluides.
- 7 ambiances `amb-*.webp`, 1792 × 1024 px.
- Total : 54 fichiers image, représentant 98 visuels ou cellules (43 illustrations + 48 icônes + 7 ambiances).

`amb-plateau.webp` n’a volontairement pas été générée : le brief demande une vraie photographie du plateau technique.

## Arbitrages appliqués

- Le catalogue B annonce 40 illustrations, mais nomme 43 fichiers distincts : les 43 noms explicites ont été produits.
- Le total général « 83 » ne correspond pas à l’addition du catalogue détaillé. La livraison suit les lignes nommées, sans inventer de fichier.
- La planche 4 reste supprimée. Ses deux exceptions, condenseur et évaporateur, occupent les deux cases de réserve de la planche 3, conformément à l’instruction la plus spécifique ; le mètre ruban et la caisse à outils ne sont donc pas repris.
- Style retenu : vectoriel plat, lisible en projection et compatible FLE/DYS, sans schéma frigorifique complet, sans symbole normalisé à régénérer, sans texte, lettre, chiffre ou logo.

## Palette et formats

Palette finale exacte :

- marine `#1b3a63`
- orange `#ff6b35`
- crème `#f7f1e7`
- blanc cassé `#fffdf8`
- bleu-gris pâle `#dce5ee`

Les illustrations et ambiances sont en WebP lossless. Les planches sont en PNG RGBA avec fond transparent.

## Gabarits de prompts finaux

### Illustrations carrées

> Square 1:1 educational vector illustration for a French refrigeration technician training course. Clean flat vector style, thick rounded navy outlines, simple geometric shapes, large readable subject, centered composition, generous 6 percent safety margin. Strict palette only: navy #1b3a63, orange #ff6b35, cream #f7f1e7 background, off-white #fffdf8, pale blue-gray #dce5ee. No gradients, no shadows, no texture, no photorealism. No text, no letters, no numbers, no logos, no watermark. No complete refrigeration circuit, no technical schematic, no normalized symbols. No identifiable face. Safe professional context and correct PPE when hands appear.

À ce gabarit a été ajoutée, pour chaque fichier, la clause « Sujet » de la ligne correspondante du catalogue B. Les objets ont été demandés isolés lorsqu’un raccordement aurait pu produire un schéma technique.

### Planches d’icônes

> One coherent 4 columns by 3 rows icon sheet. Exactly twelve isolated flat vector icons, one centered icon per cell, no dividers, no text, no letters, no numbers, no logos. Thick rounded navy outlines, simple geometric silhouettes, strict inerWeb palette, large empty margin around every icon. Flat chroma-green background used only for deterministic removal, then exported as transparent PNG.

Les sujets de chaque cellule suivent les listes des planches 1, 2, 3 et 5 du catalogue C. La planche 3 utilise condenseur et évaporateur dans les deux dernières cases.

### Ambiances

> Wide horizontal 16:9 educational ambience illustration for a projected French refrigeration training course. Calm clean flat vector style with simplified realistic perspective, thick but restrained navy outlines, uncluttered composition and large readable shapes. Strict palette only: navy #1b3a63, orange #ff6b35, cream #f7f1e7, off-white #fffdf8, pale blue-gray #dce5ee. No gradients, no photographic texture, no text, no letters, no numbers, no logos, no watermark, no complete refrigeration schematic, no normalized technical symbols. Keep all important objects away from the outer 6 percent. No identifiable faces.

À ce gabarit ont été ajoutées les scènes du catalogue D : atelier du jour 1, établi organisé, machine ouverte, poste de brasage, salle d’examen, espace de pause et rangement final.

## Retouches et normalisation

- orientation de la clé de rôle corrigée ;
- séquence des trois volants de `illu-p5.webp` clarifiée ;
- cadrans de `amb-jour4.webp` rendus entièrement vierges ;
- fond chroma supprimé et cellules des planches recentrées ;
- planche 5 reconstruite depuis sa source détourée pour supprimer des bandes transparentes indésirables ;
- toutes les illustrations replacées dans une zone sûre uniforme de 64 px.

## Contrôle final

- 54 médias attendus et 54 présents ; aucun manquant, aucun supplémentaire.
- Illustrations : 1024 × 1024 px, marge minimale 64 px, fond crème, palette stricte.
- Ambiances : 1792 × 1024 px, palette stricte.
- Planches : 2048 × 1536 px, transparence valide, marge minimale par cellule de 31 px.
- Tous les WebP sont sous 180 Ko ; poids maximal observé : 33 294 octets.
- Aucun fichier `amb-plateau.webp`, conformément au choix photographique du brief.
