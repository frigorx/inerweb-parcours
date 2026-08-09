# PONT — Cahier global des conditions (livraison du 08/08, 22 h 26)

*Réponse au « Cahier global des conditions et harmonisation » (zip
`DOSSIER-GLOBAL-CONDITIONS-CAPSULES-BETA-2026-08-08`). Écrit le 09/08 au matin.
Le cahier a été contrôlé sur le commit `e019343` du 07/08 : il ne connaît PAS le
chantier de la nuit du 08 au 09 (commit `feea4d1`, 100 fichiers). Ce pont fait le tri :
ce qui est déjà fait, ce qui est contesté, ce qui reste — pour que personne ne refasse
ou ne défasse le travail.*

---

## A. Ce que le cahier demande et qui est DÉJÀ FAIT (commit `feea4d1` + suites)

| Condition du cahier | État réel au 09/08 |
|---|---|
| États voix Écouter / Pause / Reprendre / Arrêter, aria synchronisé | FAIT — moteur `capsule.js`, lecteur à états |
| Pas de relance vocale automatique au changement de voix | FAIT |
| Zoom 132 % banni, projection dans 100dvh sans défilement | FAIT — mise à l'échelle mesurée, vérifiée 768/768 à 1024×768 |
| Harmonisation charte v1.1 (crème, cartes, jetons, jamais de sombre) | FAIT — bandeaux clairs, violet des détours supprimé (bleu + tireté + mot) |
| 68 écrans sans visuel → un visuel par écran | FAIT — 0 écran sans planche (46 SVG neufs + réemplois, catalogue 132) |
| États jamais portés par la couleur seule | FAIT — trois canaux partout |
| Corrections métier : étanchéité 2024/573 (annexes I ET II), valeurs universelles requalifiées, catégories de sécurité, R-22, HF, CO₂… | FAIT — selon `DOCTRINE-REFONTE-2026-08-08.md`, vérification adversariale, 3 bloquants corrigés |
| 70 points « à vérifier » à traiter | FAIT à 66/70 — reste 4, tous « décision plateau attendue » |
| Ne régénérer les MP3 qu'après validation, écrans modifiés seulement | ACTÉ — 0 MP3 refabriqué, 78 écrans marqués « voix : texte antérieur », relevé `VOIX-A-REFAIRE.md` |
| Compteurs README (7 capsules / 92 écrans → réels) | FAIT ce matin — 11 · 129 · 53 · 258 |
| Identifiants d'écran stables | DÉJÀ LE CAS (ids inchangés par la refonte) |
| Hors ligne, zéro CDN, préférences locales tolérantes aux erreurs | DÉJÀ LE CAS |

## B. Droit de réponse — deux points où le cahier ne fait PAS foi

1. **Réemploi du fluide récupéré** (§ décision en une page : « à supprimer »). Le cahier
   recopie l'erreur des audits sources. **Vérifié sur EUR-Lex le 08/08 au soir** :
   l'article 8(1) du règlement (UE) 2024/573 impose recyclage/régénération/destruction
   *après mise hors service de l'équipement* — ce n'est pas une interdiction du geste
   d'intervention. Décision de F. Henninot (22/07, reconfirmée le 08/08) : fluide encore
   autorisé → retour dans SA machine ; fluide sous restriction d'entretien (PRP ≥ 2500,
   R-404A) → filière. L'écran `la-recuperation/d-mots-2` est corrigé dans CE sens
   (doctrine § 0.1) et n'est pas à « supprimer ».
2. **Mouvement réduit** (§ 4 : « le mouvement réduit peut supprimer la décoration ;
   l'explication reste disponible sous forme textuelle et en état final lisible »).
   La règle du projet est PLUS DURE que le cahier : sur le poste de F. Henninot,
   `prefers-reduced-motion` est actif en permanence (MinAnimate = 0) — une animation qui
   porte du contenu ne se conditionne JAMAIS à cette media query, état final lisible ou
   pas (charte R2). Le cahier ne doit pas servir à réintroduire cette conditionnalité.

## C. Ce qui RESTE du cahier — le vrai carnet de la prochaine session

### Chantiers scriptables (une session de codage)

1. **Recette formelle 4 formats × 129 écrans** (360×640 · 390×844 · 1024×768 · 1280×720,
   critère : `scrollWidth == clientWidth` et `scrollHeight == clientHeight` par étape,
   états après interaction compris). La nuit du 08 a vérifié un échantillon, pas les 129.
   → script de recette automatisée (serveur local + navigateur piloté, en gardant en
   tête que le rAF ne tire pas dans un onglet non affiché).
2. **`SOURCES-IMAGES.md` du module capsules** : registre des 132 planches (toutes SVG
   inerWeb faites main — auteur, date, licence interne ; les réemplois du fonds citent
   leur planche d'origine). Seul le module régulateurs-KV a le sien aujourd'hui.
3. **Descriptions textuelles métier indexables** des visuels : le cahier demande plus que
   l'`alt` sélectif posé (doctrine § 1). Arbitrage proposé : la description vit dans
   `planches-data.js` (catalogue) plutôt que dupliquée par écran — à valider avant de
   scripter le complément des entrées manquantes.

### Décisions et gestes de F. Henninot (personne d'autre)

4. **Écoute humaine des voix** (~2 min) — `CAPSULES-DEMONSTRATION.bat`, étape 6 de la
   visite, ou `ECOUTER-LES-VOIX.html` pour les 4 candidates.
5. **Relecture métier des textes corrigés** cette nuit (les corrections restent de l'IA
   tant qu'un frigoriste ne les a pas validées) + les 4 « décision plateau ».
6. **Tri du fonds** (64 pièces, `inventaire.html`) — le cahier propose 9 / 52 / 3, à
   confirmer ou amender pièce par pièce.
7. **Valider l'arbitrage des 5 doublons** appliqué cette nuit (rappel + renvoi vers la
   capsule propriétaire) — réversible par git si désaccord.
8. **Sécuriser la charte v1.1** : `usine-contenu/00-charte/CHARTE-GRAPHIQUE-INERWEB.md`
   porte des modifications locales non commitées (constaté le 09/08 — possiblement une
   autre session en cours : vérifier avant). Le cahier a raison : la cible d'harmonisation
   doit être une version commitée.
9. **Bon à tirer** — puis seulement : régénération des 156 MP3 périmés, push, indexation RAG.

### Explicitement PAS repris du cahier

- Les conditions déjà satisfaites (section A) — pas de second chantier.
- « Supprimer l'écran du réemploi » (section B-1).
- L'assouplissement mouvement réduit (section B-2).

---

*Le zip documentaire reste une remise : rien n'en a été copié dans le dépôt, et il ne
sera pas indexé au RAG (statut « pas de bon à tirer » du cahier lui-même).*
