# Catalogue des visuels du pack

## Règle de tri — impérative

| Famille | Quoi | Production |
|---|---|---|
| **Schéma technique** | circuit frigorifique, croix du frigoriste, raccordement manifold, composants, symboles normalisés | **SVG à la main**, à partir de la bibliothèque de symboles inerWeb (348 symboles). **Jamais de génératif.** |
| **Illustration d'ambiance** | scène d'atelier, technicien en EPI, mise en situation | génératif autorisé, charte Édu, **sans texte dans l'image** |

**Pourquoi.** Aucun modèle d'image ne respecte la croix du frigoriste — détendeur à gauche,
compresseur à droite, condenseur en haut, évaporateur en bas, condenseur à air simple. Il produit
des tuyauteries impossibles et des composants inventés. Sur un support destiné à des
professionnels, c'est disqualifiant.

---

## Fait

| Fichier | Type | Carte | Source |
|---|---|---|---|
| `../svg/croix-frigoriste.svg` | schéma **animé** (flux + hélice) | `g1a` + ressource globale | SVG à la main ; symboles compresseur, détendeur thermo externe et ventilateur axial repris de `usine-contenu/bibliotheque-symboles/svg/frigo_schema/` |
| `../svg/points-de-fuite.svg` | schéma | `g4a` + ressource globale | SVG à la main, même disposition que la croix ; 6 familles de points de fuite numérotées |
| `../svg/compresseurs.svg` | schéma **animé** (piston) | `g6` | coupe animée aspiration/refoulement + les 4 symboles bibliothèque (piston, scroll, vis, rotatif) |
| `../svg/detendeurs-ligne.svg` | schéma animé (flux) | `g9` | 4 détendeurs (thermo int/ext, électronique, capillaire) + la ligne liquide : réserve, filtre, voyant, électrovanne — symboles bibliothèque |
| `../svg/prp-echelle.svg` | infographie animée | `g2` | barres comparées CO₂ 1 / R-32 675 / R-410A 2088 / R-404A 3922 (valeurs Mission F-GAZ, indicatives) |
| `../svg/classes-securite.svg` | infographie | `g11` + `g12` | matrice NF EN 378, uniquement les classements autorisés par la charte |
| `../svg/lecture-table.svg` | schéma | `g1b` + `g4b` | la lecture croisée : manomètre → +1 bar → table → sonde de contact |
| `../svg/epreuve-azote.svg` | schéma animé (flux) | `g3` | bouteille N₂, manifold, circuit + pictogrammes O₂/air barrés |
| `../svg/balayage-azote.svg` | schéma **animé** (flux + flamme) | `g10` | balayage pendant le brasage, sortie libre |
| `../svg/balayage-detecteur.svg` | schéma **animé** (sonde) | `g4c` | la sonde balaie le raccord, nuage de fuite pulsant |
| `../svg/recuperation.svg` | schéma animé (flux) | `g5a` + `g5b` | installation isolée → groupe → bouteille sur balance, niveau maxi marqué |
| `../svg/mesure-surchauffe.svg` | schéma animé (flux) | `g8` | les 2 points de mesure + formule + repère 5-10 K |
| `../svg/echangeur-air.svg` | schéma **animé** (air + hélice) | `g7` | batterie ailetée traversée par l'air, encart « batterie sale » |
| `illu-a1.jpg` | ambiance | `m-a1` (bandeau) | Gemini, 23/07/2026 — voir prompts ci-dessous |
| `illu-a2.jpg` | ambiance | `m-a2` (bandeau) | Gemini, 23/07/2026 |
| `illu-d.jpg` | ambiance | `m-d` (bandeau) | Gemini, 23/07/2026 |
| `illu-e.jpg` | ambiance | `m-e` (bandeau) | Gemini, 23/07/2026 |

## Outils interactifs embarqués (res/outils/)

| Fichier | Rôle | Cartes |
|---|---|---|
| `fluides-data.js` | base de 17 fluides (tables P/T, PRP, classe, glide, statut) extraite de la réglette FRIGOLO `frigorx/inerweb-frigolo` ; GWP de R-32/R-134a/R-404A/R-410A alignés sur Mission F-GAZ pour la cohérence du pack | — |
| `reglette.html` | réglette P ↔ T : fluide + pression relative → P abs, T° sat, puis surchauffe ou sous-refroidissement avec verdict (5-10 K / 4-8 K) | `g1b`, `g4b` (iframe dans un bloc « À toi ») |
| — iframe externe | **Diagramme Enthalpique+ v3.2** (`frigorx/diagramme-enthalpique`) embarqué dans l'exercice `x2` : l'élève entre les relevés de la panne et voit le cycle | `x2` |
| `fiche-fluide.html` | carte d'identité : famille, classe NF EN 378, PRP, glide, statut + calcul charge → t éq. CO₂ | `g2`, `g11` (iframe) |

> ℹ️ **Animations** : CSS pur embarqué dans le SVG (`stroke-dashoffset` pour les flux, `transform`
> pour piston/hélice/sonde) — fonctionne dans une balise `<img>`, sans JavaScript, et respecte
> `prefers-reduced-motion`. Bilan : 16 des 17 fiches de cours portent au moins un visuel.

> ⚠️ **Un schéma ne se met pas en `illus`** : la charte recadre l'illustration de tête
> (`object-fit: cover`, hauteur max 340 px) et tronquerait le dessin. Les schémas passent par
> l'assistant `schema()` de `cartes.js`, qui les insère dans le corps en largeur pleine.
> Les images d'ambiance, elles, sont faites pour le bandeau — elles sont recadrées en **1400 × 520**
> (rapport du bandeau, en gardant le haut) et exportées en JPEG qualité 85, ≈ 120 Ko pièce.

### Prompts utilisés (à réutiliser tels quels pour rester homogène)

Préfixe commun, posé sur la première image et rappelé ensuite par « même style, même palette,
16:9, sans texte » :

> *Illustration technique éditoriale, dessin plat en aplats, sobre, fond clair, palette bleu marine
> `#1b3a63` et orange `#ff6b35`, lumière d'atelier neutre, aucun texte ni logo ni chiffre dans
> l'image. Cadrage large, ambiance calme et professionnelle.*

| Image | Sujet demandé |
|---|---|
| `illu-a1.jpg` | atelier de formation en froid et climatisation, deux techniciens adultes en tenue de travail avec lunettes et gants devant un banc d'essai frigorifique, l'un tenant un manifold à deux manomètres relié par des flexibles |
| `illu-a2.jpg` | local technique avec du petit équipement — monosplit mural, vitrine réfrigérée, meuble monobloc — et un technicien accroupi, balance électronique et bouteille de fluide au sol |
| `illu-d.jpg` | poste de récupération : groupe de récupération portable relié par deux flexibles à une bouteille grise posée sur une balance, bidon d'huile usagée à côté |
| `illu-e.jpg` | contrôle d'étanchéité en extérieur : technicien devant un groupe de condensation, manifold branché d'une main, détecteur électronique à sonde souple de l'autre |

---

## Reste à produire

### Schémas (SVG)

| Cible | Contenu attendu | Carte |
|---|---|---|
| `manifold.svg` | raccordement d'un manifold : BP à gauche, HP à droite, flexible de service | `g4b`, `g5b` |

### Ambiance (génératif)

| Cible | Sujet | Carte |
|---|---|---|
| `illu-securite.jpg` | poste de brasage : lunettes, gants, bouteille d'azote, extincteur | `g10`, `g12` |
| `illu-hc.jpg` | intervention sur un monobloc au R-290 : ventilation, détecteur de gaz, outillage dédié | `g12` |

**Tenir à jour** : une ligne par image produite, avec sa source et le prompt exact utilisé.
