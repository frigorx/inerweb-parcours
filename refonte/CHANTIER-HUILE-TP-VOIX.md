# Chantier — habillage TP « retour d'huile », bande son et logo gravé

Ouvert le 19 août 2026, 22 h 30. Décidé avec F. Henninot en début de chantier.

## Ce qui a déclenché le chantier

Un projet Claude Design « Retour d'huile » (composition 9:16 animée, React + Babel
depuis `unpkg.com`) a été importé localement dans
`C:\Users\henni\OneDrive\Bureau\CLAUDE-ESPACE-TRAVAIL\import-design-retour-huile\`.
Il ne peut pas entrer tel quel dans un module inerWeb : dépendances distantes,
panneau d'auteur, fond hors charte.

## État trouvé au démarrage — à savoir

- La ligne « Le circuit d'huile » **existe déjà** : 10 stations, 88 écrans de cours
  et 88 de questions, QA locale du 19/08. Voir
  `modules/_circuit-huile-commun/PARCOURS-COMPLET.md`.
- La station 2 « Retour d'huile naturel » traite **déjà** vitesse, pente, siphons,
  charge partielle et double colonne — soit le sujet exact de l'animation.
- ⚠️ Le dépôt `atelier-animations` porte **181 fichiers non commités**, dont toute la
  ligne huile, dernière écriture le 19/08 à 20 h 04 par une session antérieure.
  Rien n'est perdu, mais rien n'est tracé non plus.
- Les modules de la ligne huile **n'ont aucun champ `lu`** : la voix est aujourd'hui
  celle du navigateur, reconstruite à l'écran par `visibleSpeechText()`.
  `voix/fabriquer.mjs` ne sait lire que `refonte/capsules/*.js`, pas
  `refonte/modules/*/module.js`.
- Le CSS commun `_circuit-huile-commun/styles.css` est **déjà** aux jetons exacts de la
  charte inerWeb (navy `#1b3a63`, crème `#f7f1e7`, papier `#fffdf8`, Calibri).

## Décisions prises

| Question | Décision |
| --- | --- |
| Périmètre de la bande son | Toute la ligne huile, 10 stations, deux voix |
| Destination « habilitation fluide » | Les deux dépôts : `inerweb-habilitation` **et** `habilitation-fluide` |
| Écarts de charte à corriger | Le logo « iW » des en-têtes → logo gravé ; l'animation Claude → crème/papier |
| Le TP | Enrichir la station 2 existante, pas de module en doublon |

## Étapes

1. **Import Design** — 5 fichiers rapatriés. ✅ fait
2. **Adaptation hors ligne de l'animation** — `retour-huile-naturel/assets/claude-retour-huile/`,
   sans React ni CDN, à la charte, états commandés explicitement, `PROVENANCE.md` avec
   empreintes. Patron : `claude-pressostat`.
3. **Calcul et questions** — la vitesse du gaz devient manipulable (diamètre, charge),
   le repère 4 / 8 m/s reste un repère constructeur, jamais une prescription.
4. **Logo gravé** — remplacer le carré « iW » par le logo de la charte sur les 10 stations.
5. **Narration** — écrire le texte lu de chaque écran, station par station, dans un
   fichier séparé relisible.
6. **Fabrication des voix** — étendre `voix/fabriquer.mjs` aux modules, puis fabriquer.
   ⚠️ Le texte part chez Microsoft : feu vert donné le 19/08 pour la ligne huile.
7. **Intégration habilitation** — ressource dans `habilitation-fluide`, référencée
   depuis `inerweb-habilitation`.
8. **Réindexation RAG** — après production, sans qu'on le demande.

## Garde-fous de ce chantier

- Croix du frigoriste : détendeur gauche · compresseur droite · condenseur haut ·
  évaporateur bas.
- Aucun seuil, tarage ni diamètre présenté comme universel : la notice du constructeur
  fait foi.
- La couleur ne porte jamais seule l'information : couleur **+** trait **+** mot.
- Jamais de thème sombre. Pas d'autoplay. Voix au clic.
- Aucune publication ni indexation RAG sans bon à tirer de Franck.

---

## ⚠️ ARRÊT CHANTIER — ligne du circuit d'huile (19/08, 22 h 45)

Une **autre session Claude Code travaille sur le même module au même moment**.
Constat, en lecture seule :

- `assets/claude-retour-huile-film/` créé à 22 h 42 min 54 s (je n'en suis pas l'auteur) ;
- `README.md`, `module.js`, `SOURCES-TECHNIQUES.md` réécrits à 22 h 43 min 28 s ;
- `index.html` réécrit à 22 h 43 min 41 s ;
- il était 22 h 44 min 29 s au moment du constat.

Conformément à la règle d'arrêt en cas de doublon, cette session cesse d'écrire dans
`atelier-animations`. Rien n'est perdu : la vérification montre que les deux travaux se
sont superposés sans s'écraser (voir plus bas).

### Ce que cette session a livré et vérifié au navigateur

| Étape | État |
| --- | --- |
| 1 · Import du projet Design (5 fichiers) | ✅ dans `CLAUDE-ESPACE-TRAVAIL\import-design-retour-huile\` |
| 2 · Adaptation hors ligne à la charte | ✅ `retour-huile-naturel/assets/claude-retour-huile/` + `PROVENANCE.md` |
| 3 · Calcul et questions | ✅ écran « Station 7 · Calcul » + 3 questions de calcul |
| 4 · Logo gravé | ✅ `logo-inerweb.svg` compact, posé sur les 10 stations |
| 5 · Narration écrite | ⛔ non commencée |
| 6 · Fabrication des voix | ⛔ non commencée — `fabriquer.mjs` ne lit que `capsules/*.js` |
| 7 · Intégration habilitation ×2 | ⛔ non commencée |
| 8 · Réindexation RAG | ⛔ non commencée |
| 9 · Tableau de bord inerWeb | ⛔ non commencée (demandé par Franck en cours de chantier) |

### Vérification de non-écrasement

`calcul-vitesse`, `oilRiserClaudeSlot`, la question « 2 124 mm² » et `brand-logo` sont
tous présents après la réécriture de l'autre session ; le logo est en place sur les
10 `index.html`. L'autre session a ajouté un second emplacement, `claude-retour-huile-film`,
qui rejoue l'animation complète — les deux coexistent dans `engine.js`.

### À trancher par Franck avant de reprendre

1. Laquelle des deux sessions poursuit la ligne huile.
2. Faut-il garder **les deux** adaptations (le calcul manipulable **et** le film en
   11 scènes), ou une seule ?
3. Le doublon des questions existantes : les 9 questions d'origine ont toutes la bonne
   réponse en première position, et c'est toujours la plus longue. Les 3 questions
   ajoutées ne suivent pas ce motif ; les 9 autres restent à reprendre.

---

## Reprise après arbitrage de Franck (19/08, 23 h)

Franck : ce ne sont pas des doublons, ce sont deux stations d'une même ligne. Le chantier
reprend. Consigne ajoutée : **mélanger les questions** pour qu'elles ne soient pas
devinables.

### Mesure avant

Banque des 91 questions de la ligne extraite et passée à
`inerweb-habilitation/outils/mesurer-banque.mjs` :

- un élève qui coche **la proposition la plus longue**, sans rien lire : **16,3 / 20** ;
- la bonne réponse est la plus longue dans **81 questions sur 91** ;
- la bonne réponse est en **position A dans 78 questions sur 91** (86 %) ;
- référence basse, le hasard pur : 6,7 / 20.

### Ce qui a été repris

Les 79 questions des neuf stations suivantes ont été réécrites : distracteurs crédibles
(des erreurs réellement commises, pas des absurdités du type « la couleur du tube »),
longueurs rapprochées à quelques caractères, position de la bonne réponse répartie.
Les énoncés en « oui / non » ont été reformulés : deux « oui » contre un « non » désignent
la réponse sans qu'on lise.

| Station | Avant | Après |
| --- | ---: | ---: |
| Technologie des huiles | 16,0 | 6,7 |
| Éléments du circuit | 17,0 | 6,7 |
| Séparateur | 15,0 | 6,7 |
| Réservoir | 15,0 | 6,7 |
| Clapet différentiel | 18,1 | 6,7 |
| Régulateur mécanique | 16,7 | 5,8 |
| TraxOil | 14,8 | 6,7 |
| Pressostat différentiel | 18,0 | 6,0 |
| Diagnostic | 17,3 | 6,7 |
| **Retour d'huile naturel** | 15,6 | **15,6 — non repris** |

Position de la bonne réponse sur la ligne : de 86 · 13 · 1 % à **36 · 35 · 29 %**.

`retour-huile-naturel` n'a pas été repris : une autre session y écrivait encore à 23 h 05.
Ses 12 questions restent à traiter de la même façon.

---

## 20 août 2026 — la branche est posée, les illustrations sont en cause

### La ligne L'HUILE existe sur le plan de formation

`pilote-fluides/index.html` : la déviation part du **compresseur**, longe le bord et
devient une ligne horizontale complète sous la ceinture S'ÉVALUER, avec ses dix stations
cliquables, son cartouche et son jalon. Les lignes suivantes (boîte à outils,
électrotechnique, correspondances) ont été décalées de 210 px, le plan mesure 1820 px.

Pour ajouter une station : **une ligne dans `HUILE.stations`**, rien d'autre — les
abscisses se recalculent seules. C'était la demande : une branche qui s'étend, pas une
pastille figée.

Les douze dossiers de la ligne ont été copiés dans `packs/fluides/res/`, et leurs deux
liens sortants recollés (`../../moteur/` → `../../../../moteur/`, retour parcours →
carte de la ligne). Vérifié : plan → carte → station, toutes requêtes en 200.

### Audit des illustrations — le défaut est réel et il est de fond

Une planche de relecture a été fabriquée :
`modules/_circuit-huile-commun/planche-visuels.html`. Elle sort les 89 schémas de leurs
modules et les pose côte à côte, chacun avec sa station, son écran et son nom interne.

Ce qu'elle mesure, sur les 89 :

- **aucun chevauchement** de texte sur texte ;
- **6 débordements** hors cadre : `oilCircuit` (station 1 écran 1), `oilJourney`
  (station 1 écran 3), `separator` (stations 3 et 4), `oilPressureSafety`
  (station 9, écrans 1 et 8, trois textes chacun).

Ce qu'un contrôle du code révèle, et qui est le vrai sujet :

| | nombre |
| --- | ---: |
| Symboles issus de la bibliothèque technique | **5** (compresseur, séparateur d'huile, échangeur à air, détendeur thermostatique, pressostat), 20 emplois |
| Organes dessinés en **boîte rectangulaire légendée** | **72 emplois de `component()`** |

Autrement dit : les trois quarts des organes de la branche ne sont pas des symboles, ce
sont des rectangles avec un mot dedans. `SOURCES-SCHEMAS.md` l'assume — « les organes non
disponibles dans la bibliothèque sont représentés par des enveloppes fonctionnelles » —
mais le catalogue consulté n'était que celui de `usine-contenu` (348 entrées).

**Le catalogue `bibliotheque-symboles-energie` en contient 8 597**, et il a ce qui
manquait : clapet (25), régulateur (38), détecteur de niveau (16), vanne à flotteur (3),
réservoir (8), pressostat (31).

### Découpage proposé

1. Reprendre les 6 débordements de texte — mécanique, sans décision.
2. Station par station, remplacer les enveloppes par un symbole du catalogue **quand il
   dit exactement la même chose** ; là où aucun symbole ne convient, garder l'enveloppe et
   l'écrire dans `SOURCES-SCHEMAS.md` avec la raison.
3. Faire valider une station complète avant de dérouler les neuf autres.

### 20/08 — des stations courtes : la mesure, puis la première coupe

Consigne de Franck : une petite station vaut mieux qu'une grosse, viser **moins de
10 minutes** par station. Ce n'est pas une règle d'or, mais c'est le cap.

Durées mesurées sur le texte réellement affiché (130 mots/minute en lecture attentive,
8 s de pause par écran, 30 s par question) :

| Station | écrans | questions | durée |
| --- | ---: | ---: | ---: |
| Technologie des huiles | 12 | 10 | 18,9 min |
| Retour d'huile naturel | 10 | 12 | 17,1 min |
| Le pressostat d'huile | 10 | 10 | 13,5 min |
| Les éléments du circuit | 8 | 9 | 12,4 min |
| Le diagnostic | 9 | 10 | 11,8 min |
| TraxOil | 9 | 9 | 11,4 min |
| Le séparateur | 8 | 8 | 10,3 min |
| Le réservoir | 8 | 8 | 10,3 min |
| Le régulateur AC&R | 8 | 8 | 9,7 min |
| Le clapet différentiel | 7 | 7 | 9,0 min |
| **La ligne entière** | **89** | **91** | **2 h 05** |

Deux stations sur dix tenaient sous le seuil. Découpée à 10 minutes, la branche
compterait environ **18 stations**.

**Première coupe faite**, sur la plus longue. « Technologie des huiles » (18,9 min) se
partage après l'écran « Fluide ↔ huile », là où le sujet change de nature :

- **Les familles d'huile** — 6 écrans, 5 questions, **9,0 min** : à quoi sert l'huile,
  où elle passe, MO/AB/PAO, POE/PAG/PVE, quel fluide avec quelle huile ;
- **Choisir et contrôler l'huile** — 6 écrans, 5 questions, **9,9 min** : la méthode de
  choix, miscibilité et solubilité, le grade ISO VG, la température, l'humidité, le
  test acide.

Le contenu n'a pas été réécrit : les blocs ont été déplacés tels quels. Carte de la
ligne, numérotation des stations suivantes (3 à 11), branche du plan de formation et
copie du pack suivent. Vérifié à l'écran : les deux stations s'ouvrent, s'enchaînent
et rendent leurs visuels.

Les huit autres coupes attendent le feu vert : ce sont huit décisions pédagogiques,
pas huit manipulations de fichiers.

### 20/08 — les cinq autres coupes : la branche passe à 16 stations

| Station | écrans | quest. | durée |
| --- | ---: | ---: | ---: |
| 1 · Les familles d'huile | 6 | 5 | 9,0 min |
| 2 · Choisir et contrôler l'huile | 6 | 5 | 9,9 min |
| 3 · Le retour d'huile naturel | 5 | 5 | 7,3 min |
| 4 · Vérifier le retour d'huile | 5 | 7 | 9,8 min |
| 5 · Séparer et stocker | 4 | 4 | 5,8 min |
| 6 · Mettre sous pression et régler | 4 | 5 | 6,5 min |
| 7 · Le séparateur d'huile | 8 | 8 | 10,3 min |
| 8 · Le réservoir d'huile | 8 | 8 | 10,3 min |
| 9 · Le clapet différentiel | 7 | 7 | 9,0 min |
| 10 · Le régulateur AC&R | 8 | 8 | 9,7 min |
| 11 · TraxOil : comment il travaille | 4 | 4 | 5,0 min |
| 12 · TraxOil : monter et diagnostiquer | 5 | 5 | 6,4 min |
| 13 · Le pressostat : la pression nette | 5 | 5 | 6,9 min |
| 14 · Le pressostat : temporisation et sécurité | 5 | 5 | 6,7 min |
| 15 · Diagnostic : lire l'architecture | 5 | 5 | 6,3 min |
| 16 · Diagnostic : conclure | 4 | 5 | 5,5 min |

**14 stations sur 16 sous le seuil de 10 minutes.** Le séparateur et le réservoir
restent à 10,3 min : les couper donnerait deux moitiés de cinq minutes, ce qui hache
sans rien gagner. La ligne fait toujours 2 h 05 au total — le contenu n'a pas bougé,
seule sa découpe a changé.

### Ce qui tient la ligne ensemble

`scratchpad/ordonner-ligne.js` porte **une seule liste ordonnée** dont découlent :
le rang affiché dans chaque station, l'enchaînement d'une station à la suivante, la
carte de la ligne et la branche du plan. Ajouter une station, c'est une ligne dans
cette liste — puis relancer.

Sur le plan, seize stations se partagent 950 px : six libellés se chevauchaient.
Les libellés du plan ont été raccourcis (20 caractères au plus) ; les titres complets
restent dans les modules. Contrôle géométrique : **0 collision sur les 158 libellés**
du plan entier.

Les dossiers `assets/` orphelins ont été retirés des stations dont les écrans à iframe
sont partis. Vérifié dans le pack : la station 4 sert bien le calcul manipulable, en 200.

### 20/08 — les illustrations reprises, et un compte rectifié

**Le chiffre annoncé hier était faux.** J'avais dit « 72 organes dessinés en rectangle ».
En dépouillant les 71 emplois de `component()` un par un, la plupart ne sont pas des
organes : « LUBRIFIER », « OUI / NON », « 2 · NOTICE », « COALESCENCE » sont des blocs
de raisonnement, et une boîte est la bonne forme pour eux.

**Les vrais organes en boîte étaient 26.** Sur ces 26 :

| | |
| --- | ---: |
| avaient déjà leur symbole dans `engine.js` sans l'utiliser | **10** |
| ont reçu un symbole inséré depuis la bibliothèque validée | **6** |
| restent une enveloppe légendée, faute de symbole juste | **10** |

Les six symboles nouveaux — filtre à cartouche, vanne d'isolement, électrovanne, pompe,
voyant liquide — viennent de `usine-contenu/bibliotheque-symboles`, avec leurs empreintes
consignées dans `SOURCES-SCHEMAS.md`. Le dessin d'origine est repris tel quel.

Les dix qui restent sont le réservoir d'huile (5), le régulateur de niveau (4) et le
clapet taré (1). `bouteille_liquide` et `clapet_anti_retour` existent au catalogue mais
disent **une autre fonction** : les détourner tromperait. Ils attendent un symbole juste.

Une fonction `organe()` a été ajoutée : elle pose le symbole dans le cadre et le nom
dessous, là où `component()` ne mettait qu'un mot.

### Contrôles

Sur les 89 visuels de la ligne, mesurés par la planche de relecture :

| | avant | après |
| --- | ---: | ---: |
| Symboles normalisés rendus | 20 | **73** |
| Textes hors cadre | 1 | **0** |
| Chevauchements de texte | 0 | **0** |

Sur les 91 questions, mesurées par `mesurer-banque.mjs` :

| | avant | après |
| --- | ---: | ---: |
| Note en cochant la plus longue | 16,3 / 20 | **6,5 / 20** |
| Hasard pur (référence) | 6,7 / 20 | 6,7 / 20 |
| Bonne réponse en position A | 86 % | **34 %** |

La banque est descendue **sous le hasard** : aucune stratégie de forme ne paie plus.

Deux pièges rencontrés, à retenir : le premier contrôle géométrique comparait des
coordonnées locales au cadre global et signalait six faux débordements ; et la planche
servait des iframes en cache, montrant les anciens modules — d'où le jeton `?planche=`
et la reprise du `?v=` des dix-huit pages, qui aurait de toute façon touché les élèves
ayant déjà ouvert un module.

### 20/08 — la bande son : 89 narrations, 178 fichiers

**Écrit.** 89 narrations, 7 638 mots, une par écran de la ligne. Elles vivent dans
`voix/narrations/<station>.js`, pas dans les modules : un texte pour l'oreille et un
texte pour l'œil ne sont pas le même texte, et les séparer permet de relire la voix
d'un bloc sans toucher au cours.

Règles d'écriture, consignées dans `voix/narrations/LISEZ-MOI.md` : vouvoiement comme
les capsules déjà enregistrées, une idée par phrase, sigles épelés (« P O E »,
« I S O V G », « O M trois »), aucun symbole à lire (« P un moins P deux », jamais
« Δp »), et une fin utile — le geste d'atelier ou le piège, pas une transition.

**Fabriqué.** `voix/fabriquer-stations.mjs`, second fabricant : celui des capsules ne
sait lire que leur champ `lu`. Deux garde-fous : il refuse de travailler si une
narration vise un écran disparu, et il nomme tout écran resté muet.

| | |
| --- | ---: |
| Fichiers produits | **178** (89 écrans × 2 voix) |
| Ratés | **0** |
| Poids à l'atelier | 47 Mo |
| Poids embarqué dans le pack | **16 Mo** (une seule voix) |

Les MP3 se rangent dans `modules/<station>/voix/<genre>/` : ils suivent la station à la
copie, sans chemin à recoller.

**Pourquoi une seule voix dans le pack.** `pilote-fluides` pèse déjà 235 Mo et il est
publié. Les deux voix y ajouteraient 47 Mo, dont la moitié serait inatteignable :
aucun bouton ne permet aujourd'hui de changer de voix. Henri part dans le pack, Denise
reste à l'atelier. Le jour où un sélecteur existe, une ligne de copie suffit.

**Branché.** Le moteur joue le fichier s'il existe, et retombe sur la voix du navigateur
sinon — vérifié en demandant la voix absente du pack : erreur du fichier, puis synthèse,
sans que le bouton perde le fil. La vitesse du sélecteur s'applique aussi au fichier.

### Ce qui n'est pas fait

**Personne n'a écouté ces 89 narrations.** Le contrôle automatique vérifie qu'aucun
écran n'est muet et qu'aucune narration ne vise un écran disparu. Il ne dit rien de la
justesse métier, du rythme, ni de la prononciation — notamment des sigles et des
références de fluides, là où la synthèse trébuche le plus souvent.

---

## 20/08, après-midi — le séparateur à éclatement entre dans la rame

Franck a validé les trois animations Claude Design et donné carte blanche pour
compléter la rame. Marque retenue : **inerWeb Édu**, comme les seize stations déjà
gravées.

### Le manque était réel, il a été mesuré

`grep -ri "éclatement"` sur les seize stations : **zéro occurrence**. La station
« Le séparateur d’huile » traitait les principes de séparation en une seule phrase
— « ralentir, changer de direction, traverser un élément de coalescence » — sans
jamais nommer les deux familles ni montrer la plaque de choc. L’animation ne double
donc rien : elle comble un trou.

### Ce qui a été posé

| Élément | État |
| --- | --- |
| Film adapté hors ligne, 8 scènes | `separateur-eclatement-pedagogique/assets/claude-eclatement/` |
| Provenance et empreintes SHA-256 | `assets/claude-eclatement/PROVENANCE.md` |
| Station : 5 écrans, 5 questions, 7,3 min | `separateur-eclatement-pedagogique/module.js` |
| Emplacement `eclatementFilmSlot` | `engine.js` + `styles.css` du commun |
| Narration des 5 écrans | `voix/narrations/separateur-eclatement-pedagogique.js` |
| Voix fabriquées | 10 fichiers, 0 raté |
| Rang, enchaînement, carte, plan | rame passée de 16 à **17 stations** |
| Recopie dans le pack public | 34 fichiers |

L’adaptation retire les vitesses chiffrées du film d’origine (« ≈ 12 m/s »,
« ≈ 1 m/s ») et le rapport de densité « 700 × » : ils deviennent une comparaison de
section, avec mention explicite que la notice du constructeur fait foi. La couleur
est toujours doublée par le mot.

### Trois outils rapatriés ou écrits, parce qu’ils manquaient

- `outils/ordonner-ligne.js` — **il vivait dans un dossier temporaire de session** et
  aurait disparu à la première purge. C’est pourtant lui qui tient la rame : rang,
  enchaînement, carte et branche du plan. Rapatrié au dépôt. Son contrôle de rang a
  été corrigé : il criait « rang faux » sur le terminus, qui ajoute « · TERMINUS »
  après son numéro.
- `outils/extraire-banque-huile.mjs` — sort les 96 QCM au format attendu par
  `mesurer-banque.mjs`. La mesure était refaite à la main à chaque station.
- `outils/copier-ligne-vers-pack.mjs` — la copie vers le pack n’est pas brute : deux
  liens sortants changent de profondeur et la voix féminine reste à l’atelier. Fait à
  la main, cela se rate et ne se voit qu’au clic.

### Ce que les contrôles ont trouvé, et qui a été corrigé

**Le film.** Quatre défauts au premier passage : deux lignes de titre qui se
touchaient, une légende posée au milieu de la nappe d’huile, un libellé « voyant »
sous un autre texte, un libellé « pointeau » noyé dans la nappe. Le contrôle par
boîtes englobantes signalait aussi un faux positif — la boîte d’un tracé en L couvre
tout le coude. Il a été remplacé par un test de contact réel, `isPointInFill` et
`isPointInStroke`, échantillonné sur la boîte de chaque texte. Résultat après
correction : **0 texte hors cadre, 0 texte sur texte, 0 texte sur tracé, 0 erreur de
console** sur les huit scènes.

**Le plan de formation.** Passer de 16 à 17 stations resserre le pas de 63,3 px à
59,4 px. Neuf collisions de libellés sont apparues sur la branche huile — et la
mesure montre que la branche débordait **déjà** avant cet ajout : « Temporisation et
sécurité » faisait 159 px pour 117 disponibles, « rôles, MO/AB/PAO, POE/PAG/PVE »
164 px. Dix libellés du plan ont été recalibrés à la source, dans la liste ordonnée ;
les titres complets restent dans les modules. **0 collision** sur la branche après
correction.

**Le cache.** `engine.js` et `styles.css` du commun ont changé. Sans reprise du
jeton `?v=`, un élève ayant déjà ouvert une station aurait reçu l’ancien moteur, qui
ignore le nouvel emplacement de film : l’écran 3 serait retombé sur le visuel de
secours. Les 20 fichiers de la rame sont passés en `v=20260820b`.

### La rame après cette passe

17 stations · 94 écrans · 96 questions · **1 h 55** · toutes les stations sous
10 minutes. Banque mesurée à **6,5 / 20** en cochant la proposition qui se détache,
contre 6,7 pour le hasard pur : la nouvelle station tombe exactement au hasard.

### Deux choses qui restent, et qui ne sont pas de cette passe

- **Deux collisions subsistent sur le plan**, hors branche huile : « s’entraîner
  seul, KP1 et KP5 » avec « 🔒 Échauffement niv. 1 », et « 🏁 Réglages maîtrisés »
  avec « groupe par groupe ». Elles sont sur la ligne des pressostats et
  préexistaient.
- **Les 94 narrations n’ont toujours pas été écoutées par un humain.**

---

## 20/08 — audit de la rame : le défaut n'est pas où on le croyait

Franck : « certaines animations ne sont pas conformes, des anciennes animations sont
pourries, audit complet et remise à plat de toute la rame ». Audit mené sur les
**94 visuels des 17 stations**, par la planche de relecture.

### D'abord, la planche mentait

Elle portait sa **propre liste de stations, en dur**. Elle rassemblait 89 visuels et
16 stations alors que la rame en compte 94 et 17 : elle ignorait purement et
simplement la station ajoutée le matin même. Une planche qui ignore une station ne
peut pas servir de contrôle. Elle lit désormais la carte de la rame, elle-même
engendrée par la liste ordonnée.

### Ensuite, mon propre contrôle mentait

Premier passage : **14 visuels signalés avec du texte hors cadre**. Vérification :
les textes fautifs faisaient 5 à 9 pixels de large — « TC », « V », « bar ». Ce sont
des libellés situés **à l'intérieur de symboles de bibliothèque imbriqués**, dont
`getBBox()` renvoie les coordonnées dans le repère local du sous-SVG, pas dans celui
du cadre.

C'est exactement le piège déjà rencontré sur ce chantier, et il a été retendu.
Remesuré en coordonnées écran (`getBoundingClientRect`), qui est insensible aux
repères imbriqués :

| Contrôle, sur les 94 visuels | Résultat |
| --- | ---: |
| Textes hors du cadre | **0** |
| Chevauchements texte sur texte | **0** |

**La rame n'a aucun défaut de géométrie.** Le contrôle du matin disait vrai.

### Le vrai défaut, lui, est massif

| | |
| --- | ---: |
| Écrans de la rame | 94 |
| **Dessins distincts** | **43** |
| Écrans qui réaffichent un dessin déjà vu ailleurs | **51, soit 54 %** |

Les réemplois les plus lourds :

| Dessin | Emplois | Formes | Stations |
| --- | ---: | ---: | --- |
| `differential` | 7 | 7 | 6, 9, 10 ×3, 11, 17 |
| `diagnostic` | 7 | 21 | 6, 7, 9, 10, 11, 13, 17 |
| `active` | 6 | 34 | 5, 7, 9, 10 ×2, 11 |
| `drivers` | 4 | 9 | 3 ×2, 7, 8 |
| `observe` | 4 | 6 | 4, 7, 11, 16 |
| `decision` | 4 | 7 | 5, 10, 11, 17 |

Et **14 dessins portent plus de mots que de traits** — ce ne sont pas des schémas,
ce sont des tableaux de texte dans un cadre :

`oilFamiliesHydrocarbon` 19 textes pour 9 formes · `oilFamiliesSynthetic` 19/9 ·
`oilCompatibility` 17/10 · `oilViscosityTemperature` 15/7 · `oilMoisture` 14/9 ·
`oilSelection` 14/11 · `oilIsoVg` **12 textes pour 4 formes**.

C'est cela que Franck voit : un élève qui traverse la rame revoit sept fois le même
cadre à sept propos différents, et lit des mots là où il attend un schéma.

### Ce qui a été corrigé tout de suite : la station du matin

**Elle aggravait le défaut.** Sur ses cinq écrans, quatre réutilisaient un dessin déjà
vu, et l'un d'eux était franchement faux : l'écran « la chute de vitesse » affichait
`floatReturn`, c'est-à-dire **un flotteur**, alors qu'il parle de section et d'inertie.

Deux dessins lui ont été écrits :

- `burstVelocity` — la buse, le jet, la plaque, et surtout **deux disques à l'échelle**
  qui comparent la section de la buse à celle du corps. C'est le point que le texte
  porte mal et que le dessin donne d'un coup d'œil. 14 formes pour 10 textes.
- `separatorChoice` — deux installations dessinées, un poste à lignes courtes et une
  centrale à lignes longues, chacune avec la famille qu'elle appelle. 63 formes pour
  13 textes.

`route` et `separatorMethods` restent partagés : sur un écran de rappel spiralé, revoir
le même repère est voulu, pas subi.

### Ce qui reste à décider

La remise à plat des 47 autres écrans est un travail de fond, et surtout **une suite de
décisions pédagogiques** : pour chacun, soit le dessin partagé est légitime (rappel,
même propos), soit il faut un dessin propre. Ce n'est pas une manipulation de fichiers.
Découpage proposé, par ordre de gain :

1. Les **14 dessins bavards** — les six de la station des huiles en premier : ce sont
   les plus lus, et les plus pauvres.
2. `differential` ×7 et `decision` ×4 — sept et quatre propos différents sous le même
   cadre à sept formes.
3. `diagnostic` ×7 et `observe` ×4 — à différencier station par station.
4. `active` ×6 et `drivers` ×4.

Une station complète à valider avant de dérouler les suivantes, comme au premier tour.

---

## 20/08 — clôture : bon à tirer donné, la rame est poussée

Franck, après relecture à l'écran : « là on est bon, touche plus à rien, on met à jour et
c'est réglé ». C'est le bon à tirer, et il lève le gel de diffusion pour cette rame.

### Sa doctrine, à garder pour la suite de la ligne

> « C'est une ligne avec beaucoup beaucoup beaucoup de stations, mais c'est un domaine très
> complexe qui nécessite énormément d'escales pour comprendre comment ça marche. Et
> malheureusement j'ai très peu de temps à lui consacrer. D'où le volume important : une
> mini-station porte de l'autoapprentissage. »

Le nombre de stations n'est donc pas un défaut à corriger, c'est le **moyen** : le temps de
classe manque, l'élève avance seul, et une station courte est une escale qu'il peut faire
entre deux séances. Ne jamais chercher à « regrouper pour faire moins de stations ».

### État livré

| | |
| --- | ---: |
| Stations | 17 |
| Écrans de cours | 94 |
| Questions | 97 |
| Durée totale | 1 h 55 |
| Stations sous 10 min | 17 / 17 |
| Narrations écrites | 94 |
| Fichiers de voix | 188 à l'atelier, 94 dans le pack |
| Banque, note en cochant la plus longue | 6,5 / 20 pour 6,7 au hasard |
| Textes hors cadre, sur texte, sur tracé (station 8 et film) | 0 |
| Gouttes hors de leur schéma, sur les 94 visuels | 0 |

### Ce qui reste, et qui n'a pas été fait

1. **Six dessins portent encore un texte barré par un trait**, relevés et localisés au
   pixel : `route` (« ÉVAPORATEUR » 67 %), `levelZones` (« NIVEAU NORMAL » 100 %,
   « INJECTION » 71 %, « ALARME BASSE » 43 %), `partload` (4 libellés à 14 %),
   `bpHp` (2), `floatReturn` (1), `oilJourney` (« 4 » à 71 %). Le détail — coordonnées du
   texte et tracé coupable — est dans le commit « Les deux appareils ouverts ».
   Arrêté sur consigne de Franck en cours de correction.
2. **47 écrans partagent leur dessin** avec un autre écran, et **14 dessins portent plus de
   mots que de traits**. La planche de relecture les nomme un par un et les filtre.
   Chaque cas est une décision pédagogique : un rappel spiralé doit revoir le même repère,
   `differential` sept fois pour sept propos ne le doit pas.
3. **Personne n'a écouté les 94 narrations.** Le contrôle vérifie qu'aucun écran n'est muet
   et qu'aucune narration ne vise un écran disparu. Il ne dit rien de la justesse métier, du
   rythme ni de la prononciation.
4. **La phrase « en France l'éclatement, ailleurs en Europe le coalescent »** vient de Franck
   et n'a pas de source écrite. Elle est formulée comme un constat d'usage, pas comme une
   statistique. À sourcer ou à retirer.
5. **Claude Design** : `BRIEF-coupes-separateurs.md` est déposé dans le projet Design pour
   un rendu plus fin des deux coupes. Non lancé — une itération Design se paie sur le même
   quota, et la version Code passe tous les contrôles.

### Le piège technique de la journée, à ne pas retendre

En SVG, la **propriété CSS `transform` écrase l'attribut `transform`**. Un élément placé par
attribut et animé par une classe CSS perd sa position dès la première image et saute à
l'origine du dessin. C'est ce qui vidait toutes les animations de la rame. Règle :
**le placement sur un groupe, l'animation sur l'enfant** — ou `transform-box: fill-box`.

Corollaire pour les contrôles : `getBBox()` rend des coordonnées **locales** dès qu'il y a un
SVG imbriqué, et la boîte d'un tracé en L couvre tout le coude. Un contrôle géométrique
honnête passe par `getBoundingClientRect()` et `getScreenCTM()`, et ne teste le contact que
sur le **trait**, jamais sur un aplat clair.

---

## 20/08, fin d'après-midi — la voix gagne les questions

Franck teste une question et signale deux choses : « elle m'a rappelé toutes les règles »
et « le vocal est de très mauvaise qualité ». **Les deux avaient la même cause, et ce
n'était pas la voix fabriquée.**

### Le constat, mesuré avant de corriger

Sur inerweb.fr : `choc.mp3` (écran de cours) répond **200**, `q1.mp3` (question) répond
**404**. La voix fabriquée n'était servie que si `state.phase === "lesson"`. Sur une
question, le moteur retombait sur la synthèse du navigateur — d'où la qualité — et
celle-ci lisait **tout le panneau** : le compteur « 1 / 6 » dit « un slash six », le
rappel « Entraînement — jamais un sujet officiel », et le code de compétence. Les règles
du module avant la question.

### Ce qui a été posé

| | |
| --- | ---: |
| Enregistrements de questions | **194** (97 × 2) |
| Fichiers produits, deux voix | 388 · 0 raté |
| Poids ajouté au pack, une voix | **15,6 Mo** |
| Symboles imprononçables restants sur 194 textes | **0** |

**Deux fichiers par question, jamais un seul.** `q<N>.mp3` dit l'énoncé et les
propositions ; `q<N>-reponse.mp3` dit la bonne réponse puis l'explication. Le premier est
joué **avant** que l'élève réponde : il ne doit pas livrer la réponse. Le moteur choisit
sur `state.answered`. Vérifié au navigateur, puis en ligne.

**Le texte se dérive des données du module** — aucune rédaction. Mais il passe par une
normalisation pour l'oreille, reprise **quatre fois** : `m³/s`, `m²`, `mm²/s`, la barre de
fraction et le signe égal manquaient au premier jet. « S = π × d² / 4 » se dit désormais
« S égale pi fois d au carré divisé par 4 ».

**Le repli est corrigé lui aussi**, car un fichier peut toujours manquer : le badge, le
code de compétence et le compteur ne sont plus dits, les propositions sont remises en
phrase, les blocs séparés par un point.

**Le bilan reste dit par le navigateur, volontairement** : il annonce le score réel et une
phrase qui en dépend. Un enregistrement figé dirait « les repères sont en place » à un
élève qui a 2 sur 6.

### Sur la qualité

L'en-tête d'encodage d'une question et celle d'un écran de cours sont **identiques**
(`fff364c4`) : même voix Henri, même réglage. La mauvaise qualité entendue était celle de
la synthèse du navigateur, pas de la voix fabriquée.

### La leçon de méthode

Franck a testé **en ligne** un travail qui n'était **ni copié dans le pack ni poussé**.
Le réflexe qui a permis de trancher en deux minutes : mesurer ce que le serveur répond
(`curl` sur les deux fichiers) au lieu de discuter du ressenti.

### Ce qui reste

Les 94 narrations de cours **et maintenant les 194 des questions** n'ont été écoutées par
personne. Le contrôle vérifie qu'aucun écran n'est muet et qu'aucun symbole ne reste ; il
ne dit rien du rythme ni de la prononciation.
