# DOCTRINE DE REFONTE — 8 août 2026 (soir)

*Document maître du chantier « prototype clé en main ». Écrit par Claude sur carte blanche
de F. Henninot. TOUT agent du chantier lit ce document EN PREMIER et s'y conforme.
En cas de conflit entre ce document et les relevés d'audit : **ce document prime.***

Les relevés d'audit (à lire pour le détail écran par écran) :
- `C:\Users\henni\Desktop\inerweb full ia\RELECTURE-CAPSULES-129-ECRANS.md` — 129 avis
- `C:\Users\henni\Desktop\inerweb full ia\ANALYSE-COMPLETE-CAPSULES-BETA-2026-08-08.md` — synthèse

---

## 0. Les décisions supérieures — elles priment sur les audits

**Contexte, fixé par F. Henninot le 08/08 au soir : ces capsules préparent à l'EXAMEN
d'habilitation fluides. Ce n'est pas le logiciel de traçabilité inerWeb Fluide (CERFA,
registre) — les règles internes de ce logiciel-là ne se transposent PAS ici.**

Les audits (GPT et Codex, 08/08) sont bons dans l'ensemble MAIS ils cassent une décision
métier de F. Henninot reconfirmée ce soir. On ne les suit PAS sur ce point :

### 0.1 Réemploi du fluide récupéré — l'audit a TORT

L'audit affirme : « un gaz récupéré ne peut servir au remplissage qu'après recyclage ou
régénération » et demande de supprimer l'écran. **Vérifié ce soir sur EUR-Lex : c'est faux.**
L'article 8(1) du règlement (UE) 2024/573 impose recyclage/régénération/destruction
**après la mise hors service de l'équipement** — ce n'est pas une interdiction de remettre
le fluide récupéré dans sa propre machine pendant une intervention. Aucune interdiction
générale de ce type n'existe dans le règlement.

La vraie limite est AILLEURS : les **restrictions d'entretien par PRP** (le R-404A, PRP 3922,
est sous restriction PRP ≥ 2500). Décision Franck (22/07, reconfirmée le 08/08) :
« du fluide interdit, genre 404, je ne peux pas le réintégrer ; du fluide encore
d'actualité, bien évidemment je peux le remettre. »

**Texte maître pour `la-recuperation`, détour `d-mots-2`** (à poser tel quel, adapter la
narration `lu` en conséquence) :

- « Le fluide que vous venez de récupérer **peut retourner dans sa machine** — celle d'où
  il sort — si ce fluide est **encore autorisé à l'entretien**. C'est le geste courant :
  on vide pour intervenir, on remet la même matière au même endroit. »
- « **Sauf si le fluide est sous restriction.** Le R-404A (PRP 3922) et les autres fluides
  à **PRP ≥ 2500** ne peuvent plus servir à l'entretien : récupérés, ils **ne retournent
  pas dans le circuit** — ils partent en filière, avec leur papier. »
- « Le réflexe : **avant de remettre, vérifier le statut du fluide.** L'étiquette et la
  documentation du fluide le disent. »

Le champ `verifier` de cet écran se retire : l'écran est désormais juste.

### 0.2 PRP : la valeur de l'ANNEXE fait foi — on suit l'audit

La règle « valeurs concurrentes → la plus élevée » appartient au logiciel de traçabilité
inerWeb Fluide ; elle n'a pas sa place dans une capsule d'examen (tranché par Franck le
08/08 au soir). **Formulation maître** (controle-etancheite, détour `d-prp-1`) :

- « Des documents peuvent donner **des PRP différents** pour un même fluide — éditions,
  arrondis, sources. Pour l'examen comme pour le registre : **la valeur de l'annexe du
  règlement (UE) 2024/573 fait foi.** Dans le doute, on va à la source — jamais au
  chiffre le plus commode. »

### 0.3 Les valeurs chiffrées ne se SUPPRIMENT pas : elles se REQUALIFIENT

L'audit veut retirer « 500 microns », « 5-8 K », etc. Un élève de CAP a besoin d'un chiffre
pour s'ancrer (charte pédagogique FrigorX). La règle de réécriture, partout :

> **On garde le chiffre comme « cible courante » / « ordre de grandeur », et on ajoute qui
> commande : la notice, la plaque, le constructeur.** On retire seulement le caractère de
> règle universelle. Exemple : « **500 microns** : c'est la cible courante. La notice de
> votre pompe ou de la machine peut dire autre chose — **c'est elle qui commande.** »

Exceptions — chiffres à retirer VRAIMENT (aucune source, contredits par les audits) :
« 250 microns », « 15 à 20 minutes » de tirage, « 5-8 K » comme norme, « 80 % » de
remplissage, « un tour est déjà beaucoup », « +1 bar » automatique relatif→absolu.

### 0.4 Ce qui ne bouge JAMAIS

- **Croix du frigoriste** : détendeur GAUCHE · compresseur DROITE · condenseur HAUT ·
  évaporateur BAS. Condenseur à air simple, jamais de tour aéroréfrigérante.
- **Jamais de thème sombre.** Jamais `prefers-color-scheme: dark`.
- Une animation qui porte du contenu ne se conditionne **jamais** à `prefers-reduced-motion`.
- Jamais `print-color-adjust: exact`.
- La couleur ne porte jamais seule : **couleur + trait + mot**.
- Zéro dépendance externe, zéro CDN, zéro image générée par IA (les SVG codés à la main
  sont la méthode normale).
- Charte complète : `C:\git\usine-contenu\00-charte\CHARTE-GRAPHIQUE-INERWEB.md` (§ 8).
- On ne touche à RIEN dans `fonds-origine/` ni dans `C:\git\pilote-fluides`.
- Aucun `git push` ce soir. Commits locaux seulement.

---

## 1. Format d'une capsule (rappel + champs NOUVEAUX)

```js
CAPSULE({
  id, ordre, titre, question, niveau, minutes, suppose, voixFabriquee,
  fil: [ { id, titre, planche, alt?, texte: [..], lu, plus?: [..], codes: [..],
           verifier?: [..], voixPerimee?: true, renvoi?: {sujet, libelle} } ],
  retenir: [..],
  detours: { cle: { question, ecrans: [ ..même format qu'un écran du fil.. ] } }
})
```

Champs NOUVEAUX introduits ce soir (le moteur les rend, voir § 4) :

- **`alt`** (chaîne, facultatif) : description de la planche pour lecteur d'écran, à poser
  seulement quand la planche porte une information que le texte voisin ne dit pas.
  Sans `alt`, le moteur émet `alt=""` (le titre est déjà lu juste au-dessus).
- **`voixPerimee: true`** : à poser sur TOUT écran dont le champ `lu` a changé
  substantiellement ce soir (reformulation de fond, pas une virgule). Le moteur affiche
  alors un badge honnête « voix : version antérieure du texte ».
- **`renvoi: {sujet: "id-capsule", libelle: "…"}`** : bouton de renvoi vers une autre
  capsule, rendu en fin d'écran. Sert au traitement des doublons (§ 3).

Règles d'écriture inchangées : `**gras**`, mots difficiles `[[mot|explication écrite]]`,
`texte[]` = ce qui s'affiche, `lu` = ce que la voix dit (registre parlé, nombres en toutes
lettres). JAMAIS de valeur inventée : un fait douteux non tranché ici → champ `verifier`.

---

## 2. Corrections métier — formulations maîtresses

Chaque agent applique le relevé Codex pour SA capsule, SAUF sur les points ci-dessous où
les formulations suivantes s'imposent. Le style des capsules (phrases courtes, tutoiement
exclu, « vous ») se conserve.

### classes-de-securite
- `02-la-lettre` : « A = toxicité **plus faible**, B = toxicité **plus élevée** — selon la
  limite d'exposition. Jamais "A = sans danger", jamais "B = poison". »
- `03-le-chiffre` et `d-2l-1` : 2L = vitesse de combustion **au plus 10 cm/s** («&nbsp;≤&nbsp;»,
  pas « inférieure à ») ; le 2L **reste inflammable**.
- `d-tox-1` : remplacer la généralisation. « **La plupart** des fluides fluorés sont plus
  lourds que l'air, invisibles et sans odeur — l'ammoniac, lui, est plus léger et
  s'annonce à l'odeur. La règle ne change pas : **ventiler, mesurer l'atmosphère, ne
  jamais entrer seul.** » Planche : remplacer `secu-espace-clos.svg` (marquée « non
  utilisée ») par `s1-double-accident.svg` du fonds.
- `d-tox-2` : nommer le **fluorure d'hydrogène (HF)** parmi les produits très toxiques et
  corrosifs formés à la chaleur ; l'odeur piquante n'est **pas** une protection ; on ne
  brase **jamais** un circuit contenant du fluide.
- `d-lie-2` : remplacer « on ne branche ni ne débranche rien » par la méthode : **supprimer
  les sources d'inflammation, consigner, ventiler, évaluer la zone, matériel adapté.**
- `d-charge-1` : réécrire — la charge admissible (EN 378) dépend du **fluide, du local, de
  l'occupation, du type de système et des mesures de réduction du risque**. Aucune formule
  simplifiée en consigne : **plaque, notice, étude applicable, validation du responsable.**
- `d-co2-1` : le CO₂ est **physiologiquement actif** (il ne fait pas que déplacer
  l'oxygène) ; garder haute pression et neige carbonique vers −78,5 °C.
- `d-nh3-1` : l'odeur de l'ammoniac est un **indice précoce**, jamais une protection ni un
  moyen de mesure.
- `d-a3-1` : préciser « **détecteur halogène** » (pour fluides fluorés) ; pour le R-290, un
  **détecteur de gaz combustibles adapté** convient.
- `d-qui-1` : **ASHRAE 34** classe ; **EN 378** encadre l'application. Pas de cause
  historique unique pour la naissance du 2L.

### controle-etancheite
- `02-pourquoi-co2` : titre et fond — « La périodicité se mesure au **dégât possible** —
  pas seulement aux kilos. » Pour la plupart des fluides (annexe I) on compte en
  **t éq. CO₂** ; pour certains gaz de l'annexe II (section 1), en **kilogrammes**.
- `04-les-seuils` (réécriture complète) : annexe I : **5 · 50 · 500 t éq. CO₂** → tous les
  **12 · 6 · 3 mois** ; annexe II section 1 : **1 · 10 · 100 kg**, mêmes fréquences ;
  un **système de détection** de fuite **double l'intervalle** ; les équipements
  hermétiquement scellés ont leurs seuils propres. Source à citer : règlement (UE)
  2024/573, article 5.
- `05-comment` : retirer la référence 1516/2007 (abrogée) ; « un règlement d'exécution
  européen détaille les méthodes ; au plateau, la méthode suit le matériel réel ».
- `06-la-preuve` : après réparation, contrôle de suivi **au plus tôt après 24 h de
  fonctionnement et au plus tard dans le mois** ; enregistrements conservés **5 ans**.
- `d-prp-1` : formulation maître § 0.2.
- `d-detect-1` : détection fixe obligatoire à **500 t éq. CO₂** (annexe I) ou **100 kg**
  (annexe II concernée) ; le détecteur se vérifie **au moins tous les 12 mois**.
- `d-detecteur-1` : pas de vitesse universelle de passage — **notice du détecteur**, gaz de
  référence, contrôle avant usage, sans courant d'air.
- `d-registre-1` : liste des données et conservation 5 ans alignées sur l'article 7.

### familles-et-prp
- `01` + `d-atomes-1` : nuancer la causalité chimique — la stabilité ne tient pas au fluor
  seul ; les HFO ont une vie courte **parce qu'ils sont insaturés (double liaison)**.
- `02-les-interdits` : statut R-22 exact — « **mise sur le marché et recharge interdites ;
  récupération obligatoire** ; une machine au R-22 peut continuer de tourner sans appoint. »
  Jamais « interdits » sec.
- `04-le-prp` : « PRP, PRG, GWP : **trois noms pour la même grandeur**, comptée sur
  **100 ans**. » Valeurs 1 (CO₂), 675 (R-32), 2088 (R-410A), 3922 (R-404A) : conservées,
  sourcées « annexe du règlement (UE) 2024/573 ».
- `05-les-autorises` : remplacer « autorisés » par « **alternatives possibles** selon
  l'application, l'équipement et le calendrier » ; R-1234yf : **PRP < 1** (0,501 dans
  l'annexe) — ne pas écrire « environ 1 ». PFAS : « certains fluorés et leurs produits de
  dégradation sont **au cœur d'un débat réglementaire** — un dossier à suivre, pas un
  verdict. » Pas d'égalité « HFO = PFAS ».
- `d-climat-1` : dater — amendement de **Kigali (2016)**, règlement **F-Gas III (2024)**.

### le-circuit
- `02-compresseur` : « il **ne produit pas directement le froid** : il aspire, comprime —
  la pression ET la température montent — et il entretient la circulation. »
- `04-detendeur` : le détendeur crée une **forte perte de charge** et **dose le débit** ;
  il ne « fabrique » pas le froid à lui seul.
- `05-evaporateur` : « le fluide y **absorbe la chaleur** du milieu à refroidir en
  s'évaporant » — pas « fabriquer du froid ».
- `06-deux-pressions` : ajouter que c'est le **modèle élémentaire** ; les pertes de charge
  et les zones de surchauffe/sous-refroidissement viennent ensuite.
- `d-hp-1` : garder la convention pédagogique (frontières au compresseur et au détendeur),
  en l'annonçant comme le **modèle** ; le réel a des pertes de charge.
- `d-etats-1` : présenter des **zones** : vapeur HP surchauffée · condensation diphasique
  puis liquide HP · détente en mélange · évaporation diphasique puis vapeur BP surchauffée.
- `d-diag-1` : la planche `diagramme-logph.svg` du fonds montre un rectangle — ne PAS la
  réemployer telle quelle. Créer `le-circuit_logph.svg` : dôme de saturation + cycle à
  4 transformations (compression oblique vers la droite, condensation horizontale,
  détente verticale, évaporation horizontale). Croix du frigoriste respectée dans tout
  schéma de circuit.

### la-surchauffe
- `02`/`03` : formule affichée avec **unités à chaque étape** : « température du tube −
  température de saturation lue à la pression = surchauffe, en **kelvins (K)** ».
- `04-trop-peu` / `05-trop` : « **peut indiquer** … — on confirme avec les mesures et la
  documentation avant de conclure. » Jamais de diagnostic automatique.
- `06-regler` : retirer « un tour est déjà beaucoup » et tout délai fixe → « **petits pas,
  notice, temps de stabilisation du constructeur.** »
- `d-table-1` : ajouter — certaines tables sont en pression **absolue**, d'autres en
  **relative** : **lire l'en-tête**, ne jamais appliquer « +1 bar » machinalement.
- `d-valeur-1` : retirer 5-8 K comme norme ; « l'ordre de grandeur dépend du système ;
  **la documentation du matériel donne la cible**. »
- `d-sr-1` : le sous-refroidissement « **contribue à vérifier** l'alimentation en liquide »
  — pas « garantit ».

### tirage-au-vide
- `02`/`03` : « **peut** boucher au point froid / **peuvent** dégrader huile et échange » —
  risques possibles, pas mécanique garantie.
- `05-la-valeur` : « **500 microns : la cible courante.** La notice de la machine ou de la
  pompe peut dire autre chose — c'est elle qui commande. » Retirer « 250 microns ».
  Tirer **HP et BP** quand les accès le permettent.
- `06-remontee` + `d-remontee-1` : montée **rapide et continue → fuite probable** ; montée
  qui **ralentit et fait un palier → humidité ou dégazage probable**. Ce sont des
  **indices** ; durée et critère : **constructeur**.
- `d-duree-1` : retirer « 15 à 20 minutes ». Jamais de flamme, pas de chauffe improvisée.
- `d-huile-1`/`2` : « les huiles **POE sont fortement hygroscopiques** » ; après un moteur
  claqué : **procédure** (diagnostic, huile, déshydrateur, nettoyage, fabricant).
- `d-compresseur-1` : garder « **jamais** ». Raisons : le compresseur **n'est pas une pompe
  à vide** et, sous vide, il sort de ses conditions de refroidissement, de lubrification
  et d'isolation. L'arc électrique n'est pas LA raison universelle.
- `d-unites-1` : 1 torr = 1000 microns ; 1 mbar ≈ 750 microns ; atmosphère ≈ 760 000 microns.

### la-recuperation
- `01` : garder l'interdit absolu de rejet ; **aucun montant d'amende chiffré** sans base
  juridique sourcée — écrire « sanctionné » sans chiffre.
- `04-taux-remplissage` : aucun « 80 % » ; **tare, volume en eau, masse maximale, plaque**
  — et renvoi vers `les-bouteilles` (§ 3 doublons).
- `05-comment` : « liquide d'abord, vapeur ensuite » = **procédure courante, selon la
  station et sa notice** — pas une loi universelle.
- `d-mots-1` : définitions réglementaires : récupération = collecter et stocker ;
  recyclage = nettoyage de base ; régénération = retraitement en **qualité équivalente au
  neuf**, réalisé en **centre spécialisé** — ce fluide-là revient sur le marché comme un
  produit contrôlé. Pas de règle de gestion interne ici (c'est l'affaire du logiciel de
  traçabilité, pas de l'examen).
- `d-mots-2` : texte maître § 0.1.
- `d-apres-1` : distinguer **CERFA 15497** (fiche d'intervention) et **BSFF dématérialisé
  (Trackdéchets)** quand le fluide récupéré devient un déchet.

### lire-le-code
- `02-trois-cases` : « toujours trois » borné dès l'écran : « pour la famille que nous
  décodons ici — les halocarbures les plus courants ».
- `03-la-regle` : la règle +1/−1/tel quel vaut pour les **halocarbures saturés
  acycliques** ; l'écrire SUR l'écran, pas seulement à la fin.
- `d-boules-2` : « une seule prise » limité à **H, F, Cl — les atomes de nos exemples**.
- `d-lettre-2` : le suffixe distingue des **isomères** ; retirer la promesse que chaque
  isomère a forcément des propriétés très différentes.
- `d-melange-1`/`2` : R-404A = R-125/R-143a/R-134a, composition **attribuée**, pas
  déductible ; 4xx = zéotropes, 5xx = azéotropes ; comportement « **proche** d'un corps
  pur » avec prudence.
- `d-glide-2` : charge en phase liquide : oui. « Après une fuite, jamais d'appoint » →
  « l'appoint après fuite dépend de **l'importance de la perte et de la procédure du
  fabricant** ».
- `d-familles-1` : réduire à « où se place le code » + renvoi `familles-et-prp` (§ 3).

### la-chaleur · pression-temperature · les-bouteilles
Fond solide (0 point à vérifier). Appliquer seulement : les précisions douces du relevé
(corps pur/pression maintenue déjà présentes pour la plupart), les visuels manquants s'il
y en a, et les règles transversales (§ 3, § 4). Ne pas réécrire ce qui est juste.

---

## 3. Doublons — arbitrage (carte blanche, réversible par git)

Principe : **une capsule propriétaire enseigne en entier ; l'autre garde un rappel d'une
carte + un champ `renvoi`.** Les écrans réduits prennent `voixPerimee: true`.

| Contenu | Propriétaire (ne bouge pas) | À réduire en rappel + renvoi |
|---|---|---|
| sensible / latente | `la-chaleur` | le détour concerné de `le-circuit` |
| familles de fluides | `familles-et-prp` | `lire-le-code` détour `d-familles-1` |
| pesée / surremplissage | `les-bouteilles` | `la-recuperation` `04-taux-remplissage` |
| ébullition sous pression réduite | `pression-temperature` | `tirage-au-vide` `04-le-principe` (garde SON application au vide, renvoie pour le pourquoi) |
| bulle / rosée | définition : `pression-temperature` | application surchauffe : `la-surchauffe` (garde) ; `lire-le-code` `d-glide-1` réduit + renvoi |

Un rappel = 1 à 2 phrases qui suffisent à suivre l'écran courant, jamais zéro contenu.

---

## 4. Moteur — spécifications (agents moteur uniquement)

Noms et classes FIGÉS ici pour que CSS et JS convergent :

1. **Détours rechartés** : `--detour:#3d7fca` · `--detour-bg:#eaf2fb` · `--detour-ligne:#c7dcf5`
   (le violet disparaît). Inserts et écrans de détour : bordure **tiretée** + le mot
   « Détour » écrit (fil d'ariane et `.plus > .t::before{content:"▸ Détour — "}`).
   Couleur + trait + mot.
2. **Bandeaux clairs** : `.tete`, `.accueil-tete`, `.barre-relecture` passent en fond clair
   (`var(--carte)` / crème), texte bleu marine, filet bas 3 px plein bleu (tireté bleu vif
   en mode détour). Les petits boutons/badges foncés à texte blanc restent permis (accents).
3. **Lecteur voix à états** : bouton principal `data-agir="ecouter"` : « 🔊 Écouter » →
   en lecture « ⏸ Pause » → en pause « ▶ Reprendre » ; un bouton « ⏹ Arrêter »
   (`data-agir="arreter"`) n'apparaît que pendant lecture ou pause. `aria-label` et
   libellé changent ensemble. Pas de relance automatique au changement de voix si
   l'utilisateur n'écoutait pas.
4. **Badge voix périmée** : si `ecran.voixPerimee`, badge `.voix-perimee` près du bouton
   (ambre `#b06a00`, bordure pointillée, mot « voix : texte antérieur », `title`
   explicatif). Visible aussi hors relecture : honnêteté avant tout.
5. **Jauge** : `role="progressbar"` + `aria-valuemin/max/now` + `aria-label="avancement du
   fil principal"`.
6. **Focus** : `:focus-visible{outline:3px solid var(--orange); outline-offset:2px}` global.
7. **`<button>` dans `<a>` interdit** : le lien « Choisir un autre sujet » de fin devient
   un `<a>` stylé en bouton (classe existante).
8. **`alt`** : `alt="' + esc(e.alt || "") + '"` — jamais le titre en doublon.
9. **`renvoi`** : rendu en fin de corps d'écran : lien-bouton vers
   `capsule.html?sujet=<sujet>`, libellé fourni, flèche « → ».
10. **Projection sans défilement** : remplacer `zoom:1.32` par : `html.projection`
    grossit la typo (facteur 1,32 via variable) ET `capsule.js` mesure après chaque rendu
    (`requestAnimationFrame`) la hauteur de `.ecran` contre `100dvh` moins les barres ;
    si ça déborde, réduire proportionnellement (`transform: scale`) jusqu'à tenir —
    **aucune étape ne défile en projection**. Recalcul sur `resize`.
11. **Impression** : copier `C:\git\usine-contenu\00-charte\impression.css` vers
    `refonte/moteur/impression.css` et la lier `media="print"` dans TOUTES les pages de
    `refonte/` après la feuille principale. Garder le bloc `@media print` local. Jamais
    `print-color-adjust: exact`.
12. **Lisibilité** : copier `fonds-origine/moteur/lisibilite.js` vers
    `refonte/moteur/lisibilite.js` et l'inclure avant `</body>` sur toutes les pages
    de `refonte/` qui ne l'ont pas.
13. **`<html lang="fr">`** sur toutes les pages de `refonte/`.
14. **Aucune animation conditionnée à `prefers-reduced-motion`** — vérifier qu'on n'en
    introduit pas.

## 5. Visuels — règles de création et de réemploi

Objectif : **0 écran sans `planche`** dans les 7 capsules d'origine (68 manquants).

Ordre de préférence :
1. **Réemployer** une planche existante — catalogue : `refonte/moteur/planches-data.js`
   (66 entrées, chemins inclus). Elle doit illustrer **exactement** le propos de l'écran.
2. **Créer** un SVG neuf dans `refonte/planches/`, nom préfixé par la capsule
   (`<id-capsule>_<motif>.svg`) pour éviter toute collision entre agents.
3. Jamais de bitmap, jamais d'image générée par IA, jamais de décalque d'une image tierce.

Gabarit de création (lire UNE planche du lot 3 comme modèle de style, p. ex.
`refonte/planches/deux-casseroles.svg`) :
- `viewBox="0 0 700 400"`, fond transparent ou crème très léger ;
- palette de la charte UNIQUEMENT (§ 8 de la charte) ; texte ≥ 16 px équivalent, Trebuchet/
  Calibri ; couleur + trait + mot sur toute information ;
- schéma sobre : formes simples, flèches, étiquettes — plutôt un bon schéma statique
  qu'une animation approximative. Si animation SMIL : `.mobile` sur les éléments animés,
  et **le dessin au repos est déjà l'image finale** ;
- tout circuit frigorifique respecte la **Croix du Frigoriste** ;
- pas de valeurs chiffrées non présentes dans l'écran qu'elle illustre.

**Tranché en fin de chantier (08/08 soir)** : les teintes CLAIRES du gabarit lot 3
(#cfe6f5, #eef3f9, #e3f5ec, #fdeee8, #fff4e0, #eaf2fb, gris #8fa3b8/#4a5b6e) sont
ADMISES dans les planches comme fonds et filets décoratifs — elles sont l'usage de fait
du lot 3, cohérentes entre toutes les planches, et aucune ne porte une information seule.
Les tailles de texte du gabarit lot 3 (12-14 px dans le viewBox 700×400) sont ADMISES :
rendues à la largeur réelle d'affichage, elles dépassent l'équivalent 16 px. La palette
STRICTE § 8 reste la règle pour tout le reste (moteur, pages, textes).

## 6. Voix

- On ne régénère AUCUN MP3 ce soir (textes non validés par Franck).
- Tout écran dont `lu` change substantiellement → `voixPerimee: true`.
- Un changement de pure forme (virgule, gras) ne périme pas la voix.
- En fin de chantier, un relevé `VOIX-A-REFAIRE.md` liste les écrans périmés.

## 7. Champs `verifier`

- La correction résout le point → le `verifier` se **retire**.
- Le point exige une décision de plateau (convention de table, procédure locale, matériel)
  → le `verifier` **reste**, reformulé : « Décision plateau attendue : … ».
- Objectif : passer de 70 points à un reliquat court, exclusivement « décision plateau ».

## 8. Ce qu'on ne fait PAS ce soir

- Toucher à `fonds-origine/`, à `C:\git\pilote-fluides`, aux MP3 existants.
- `git push` (commits locaux seulement — Franck pousse quand il veut).
- Supprimer un fichier du fonds (le tri des 64 pièces reste la décision de Franck).
- Créer un thème, une option ou une préférence non demandés.
