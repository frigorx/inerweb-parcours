# Proposition globale — le site des animations du froid

*Rédigée le 06/08/2026 à la demande de F. Henninot. **Statut : proposition, rien n'est engagé.***
*La doctrine d'écriture des capsules reste `refonte/MODELE-CAPSULE.md` — ce document dit
ce qu'on bâtit AUTOUR, et le sort de chaque pièce existante.*

---

## 1. La commande, en clair

Ce que Franck a dit le 06/08 au soir, et ce que la proposition en fait :

| Sa critique / sa demande | La réponse dans ce document |
|---|---|
| « Certaines animations sont trop longues, on a dit trop de choses » | Le modèle capsule : fil court de 5-7 écrans, l'excédent part en **détours** « Voulez-vous en savoir plus ? ». Rien n'est jeté : ce qui encombrait le fil devient un détour. |
| « Le bilan thermique et compagnie pourraient être recoupées » | **Recoupage** des gros modules en plusieurs capsules courtes — tableau § 4. |
| « Certaines améliorées, certaines renforcées » | Cinq sorts possibles par pièce : garder · recouper · renforcer · fusionner · écarter — décidés pièce par pièce, § 4. |
| « À la fin ça ne doit faire qu'un tout » | **Un** site, **un** moteur, **une** charte, **une** voix, **un** ordre. C'est le § 2. |
| « La partie électrovanne n'a pas été intégrée » | Vérifié : rien dans le fonds. Case prête au palier Organes, § 5. |
| « Je réalise KVP-KVL-KVR ; viendront détendeur électronique, sous-refroidissement/surchauffe, lecture de mano » | Un palier **Régulation** entier leur est réservé, § 3 et § 5. Le modèle des détours permet d'intercaler sans rien casser. |
| « À la fin, des tutos vidéos : pose et dépose des manomètres, vannes de service… » | Nouveau type de pièce : la **vidéo filmée**, avec ses règles (sous-titres, poids), § 6. |
| « L'ordre n'est pas forcément intelligent » | Un **parcours guidé en paliers**, avec prérequis déclarés (`suppose:`) — proposé, jamais imposé. § 3. |
| « On ne casse rien, on travaille dans une coquille indépendante » | La coquille existe : ce dépôt. `pilote-fluides` n'est jamais modifié d'ici. Ce qui évolue : la coquille ne vise plus un report vers le pack — **elle devient le produit**. § 8. |
| « Un véritable site internet, utile pour l'autoapprentissage ET pour un enseignant » | Trois portes d'entrée dont un **espace enseignant** complet. § 2 et § 7. |

---

## 2. Ce que devient l'ensemble : un site, deux publics, trois portes

**Le site** (adresse actuelle : `frigorx.github.io/inerweb-parcours`, nom d'usage à choisir —
proposition : **« Les parcours du froid »**) est la maison unique de toutes les pièces :
capsules, planches animées, et bientôt vidéos filmées. Tout statique, tout hors-ligne
possible, aucune dépendance extérieure.

**L'accueil propose trois portes :**

| Porte | Pour qui | Ce qu'on y trouve |
|---|---|---|
| **« Qu'est-ce que je veux réviser ? »** | l'élève, le stagiaire, seul | l'accès direct par sujet — l'existant d'aujourd'hui |
| **« Je suis le parcours »** | celui qui découvre, ou qui prépare l'examen | les paliers dans l'ordre, § 3, avec « vu / pas vu » |
| **« Espace enseignant »** | Franck et les collègues | projection, planches en grand, téléchargements, vidéos, licence — § 7 |

Ce qui fait « un tout » : le même moteur (`refonte/moteur/`), la même charte
(`capsule.css`, zéro feuille par capsule), la même voix fabriquée (masculine ou féminine au
choix du lecteur), les mêmes commandes partout. On apprend l'outil une fois.

---

## 3. L'ordre intelligent : six paliers

✅ = capsule déjà produite · 🔨 = à recouper du fonds · ⏳ = pièce à venir (Franck ou à écrire)

| Palier | Sujets | État |
|---|---|---|
| **1. Les bases** | Le circuit : 4 organes, 2 pressions ✅ · La chaleur, sensible et latente 🔨 · Pression et température, le couple 🔨 | fonds riche |
| **2. Le fluide** | Lire le code d'un fluide ✅ · A1, A2L, A3 : lire l'étiquette ✅ · Familles et PRP 🔨 · Les bouteilles 🔨 (Mission Bouteilles) | fonds riche |
| **3. Les organes** | Compresseur 🔨 · Condenseur 🔨 · Détendeur 🔨 · Évaporateur 🔨 · Vanne de service ✔ (récente, à raccorder) · **Électrovanne ⏳** | gisement : tome 3 + organe-par-organe |
| **4. Les gestes** | Lecture de mano ⏳ · Tirage au vide ✅ · Récupérer le fluide ✅ · Balayage et épreuve d'azote 🔨 · Pesée et charge 🔨 | planches déjà là |
| **5. La régulation** | Surchauffe ✅ · **Sous-refroidissement ⏳** · **KVP-KVL-KVR ✅ (livré et intégré au pack le 18/08 — 8 écrans, vue 3D, 3 questions)** · **Détendeur électronique ⏳** · Pressostats ⏳ | le grand absent du fonds — une seule planche existe |
| **6. La règle et l'examen** | Contrôle d'étanchéité ✅ · Intervenir sur A3 (hydrocarbures) 🔨 · Aptitude et capacité 🔨 · Bilan thermique et performance 🔨 · **La chaîne de l'intervention** ✔ (parcours de synthèse, en clôture) | fonds riche |

**La sécurité n'est pas un palier : elle est partout** (règle établie — récurrente, jamais un
bloc unique). Chaque capsule de geste porte son écran « ce qui peut vous blesser » et ses
détours (CO₂, espace clos, flamme, projection…). Les planches sécurité restent en plus
exposées à l'espace enseignant.

Chaque sujet déclare son niveau (découverte / métier / examen) et ses prérequis. Le parcours
**propose** l'ordre, il ne verrouille jamais.

---

## 4. Le sort de chaque pièce du fonds

### Les 20 tutos guidés

| Pièce | Sort proposé | Vers où |
|---|---|---|
| `nomenclature-interactive` | **absorbée** (fait) | capsule Lire le code ✅ |
| `cours-classes-securite` | **absorbée** (fait) | capsule A1-A2L-A3 ✅ |
| `etancheite-interactive` | **absorbée** | détours de Contrôle d'étanchéité ✅ |
| `chaleur-interactive` + `chaleur-circuit-interactif` + `pression-temperature-interactive` | **fusionnées et recoupées** (3 → 2) | capsules La chaleur · Pression-température (palier 1) |
| `bilan-thermique-performance-interactif` | **recoupée** (1 → 2) | Bilan thermique · Performance-COP (palier 6) |
| `tome-3-technologie-organes` (52 fichiers) | **recoupée** — le plus gros gisement | 4-5 capsules du palier Organes |
| `circuit-organe-par-organe` | **recoupée** | nourrit les capsules Organes ; ses écrans « où ça fuit » nourrissent l'étanchéité |
| `condenseur-interactif` · `evaporateur-interactif` | **fusionnées** avec le contenu tome 3 | une seule capsule par organe — jamais deux sources concurrentes |
| `hydrocarbures-a1-a2` + `intervention-hydrocarbures-interactive` | **fusionnées** (2 → 1) | capsule Intervenir sur A3 + détours |
| `mission-bouteilles` | **renforcée** | capsule Les bouteilles (palier 2), l'activité devient un détour « essayez » |
| `froid-clim-academie` (simulateur) | **raccordée** | le détour interactif de Surchauffe / Sous-refroidissement |
| `vanne-service-interactive` | **gardée** (récente, déjà au niveau) | palier Organes ; la vidéo filmée à venir s'y accroche |
| `chaine-intervention-interactive` | **gardée** | parcours de synthèse en clôture du palier 6 — c'est le liant |
| `frise-vivante` | **gardée telle quelle** | pièce d'appel : détour « d'où viennent les fluides » + espace enseignant |

*(les dossiers `audio`, `bibliotheque`, `img`, `photos`, `svg`, `symboles`, `outils` sont des
ressources, pas des tutos — ils suivent les pièces qui les emploient)*

### Les 44 planches animées

Réemployables largement telles quelles (24 le sont déjà dans les 7 capsules). Elles servent
**deux fois** : comme écrans dans les capsules, et **en grand à l'espace enseignant**, chacune
téléchargeable. Familles : organes et circuit (10) · gestes (12) · fluides et classes (7) ·
sécurité (9) · physique (5) · repères (frise, flocon…).

Le tri fin pièce par pièce reste celui d'`inventaire.html` — ce tableau propose le sort des
familles, ton tri peut l'amender pièce par pièce.

---

## 5. Les cases prêtes pour ce qui arrive

Tes chantiers en cours ont leur place réservée — le modèle des détours permet d'intercaler
**sans réécrire un fil existant** :

| Pièce attendue | Où elle s'accroche |
|---|---|
| Électrovanne | palier Organes — et détour depuis la chaîne de l'intervention |
| KVP · KVL · KVR (en cours chez toi) | palier Régulation, une capsule chacune ou une à trois volets — ton choix de découpage |
| Détendeur électronique | palier Régulation, en face du détendeur thermostatique (palier Organes) |
| Sous-refroidissement | jumelle de Surchauffe ✅, même gabarit, le simulateur académie en détour commun |
| Lecture de mano | palier Gestes — planches `manifold-lecture` + `lecture-table` déjà prêtes |

**Règle d'import inchangée** pour toute pièce produite hors de ce dépôt : vérification sur
pièce des deux pièges récurrents (thème sombre interdit · aucune animation porteuse de contenu
conditionnée à `prefers-reduced-motion`), sur la version réellement installée, jamais sur la
notice du zip.

---

## 6. Les vidéos filmées — nouveau type de pièce

Pour la pose/dépose des manomètres, les vannes de service, et tout geste où la vraie main
vaut mieux que le dessin. Règles proposées :

1. **Sous-titres obligatoires** — public FLE/DYS, ateliers bruyants, et aucune information
   ne doit être portée uniquement par le son. Le texte des sous-titres suit la même règle
   que les narrations : phrases courtes, mot difficile expliqué où il tombe.
2. **La vidéo s'accroche à une capsule**, elle ne flotte jamais seule : le geste filmé
   arrive après les écrans qui le préparent (la vidéo montre, la capsule explique).
3. **Poids** : MP4 H.264, 720p suffit, viser quelques minutes par geste. Limite stricte
   de l'hébergement actuel : 100 Mo par fichier. Si le total dépasse ~500 Mo, décision
   d'hébergement à prendre (dossier de téléchargement séparé, ou dépôt dédié).
4. Une page **Galerie vidéos** à l'espace enseignant les liste toutes, téléchargeables.

---

## 7. L'espace enseignant

Ce qui rend le site utile **en salle**, pas seulement seul chez soi :

- **Projeter une capsule** : plein écran, texte calibré vidéoprojecteur, avancement au
  clavier — l'enseignant déroule le fil, ouvre un détour si la classe accroche.
- **Les 44 planches en grand** : une par page, rejouables, téléchargeables (SVG),
  imprimables — de quoi illustrer n'importe quel cours, même hors de ce site.
- **La galerie vidéos** (§ 6).
- **Le lien vers la version élève** de chaque pièce (pour l'écrire au tableau ou le
  donner en travail à la maison).
- **Licence et attribution** en clair (CC BY-NC-SA 4.0, moteur MIT — régime actuel).

---

## 8. Les frontières — ce qui change, ce qui n'entre pas

**Ce qui évolue (à acter par Franck).** La règle d'or reste : `pilote-fluides` n'est jamais
modifié depuis ici. Mais l'objectif de la coquille change : le report pièce-par-pièce vers le
pack n'est plus le but — **la coquille devient le produit**. Répartition proposée :

| | `pilote-fluides` (existant, en ligne) | **Le site des animations** (ce dépôt) |
|---|---|---|
| Mission | la **préparation à l'examen** : cours, quiz, examens blancs, matrice 94/94 | la **médiathèque pédagogique** : réviser un sujet, projeter, montrer un geste |
| Public | le stagiaire inscrit | tout élève/stagiaire + tout enseignant |
| Lien entre les deux | sa galerie pointera vers le site quand il sera mûr | chaque capsule « niveau examen » pointe vers le pack pour s'entraîner |

Les deux se **lient**, ils ne se copient pas — aucune pièce en double à maintenir.

**Ce qui n'entre pas dans le site** (public) : Régul'Froid et le tuto Coolselector (matériel
Danfoss, jamais publiables) · la banque officielle et tout ce qui touche à l'examen réel
(dépôt privé `habilitation-fluide`) · toute donnée nominative.

**Le chantier voix de l'autre coquille** (`pilote-fluides-codex-travail`, refonte
`speechSynthesis` du pack) reste un chantier du PACK, gelé en attente de ton écoute. Le site,
lui, a déjà sa doctrine : MP3 fabriqués. À terme une seule doctrine vocale devrait gagner
partout — décision à prendre plus tard, pas maintenant.

---

## 9. La technique, en bref

**Déjà en place** (construit le 06/08) : le moteur capsule (fil + détours + retour exact),
la charte unique, le mode relecture (`RELECTURE = true`), la fabrique de voix
(`refonte/voix/fabriquer.mjs`, Henri/Denise), 7 capsules (92 écrans), la maquette autonome,
le paquet bêta pour 10 relecteurs, le dépôt public non référencé (`noindex`), le site Pages.

**À bâtir** : l'accueil à trois portes · les paliers avec « vu/pas vu » (dans le navigateur,
rien ne sort de la machine) · l'espace enseignant (projection + planches en grand +
téléchargements) · le gabarit vidéo sous-titrée · puis les capsules du § 4, palier par palier.

---

## 10. L'ordre de réalisation

| Lot | Contenu | Réglage conseillé |
|---|---|---|
| **1. Tes validations** | le découpage (MAQUETTE-BETA) · la voix (CAPSULE-AVEC-LA-VOIX) · ce document | — c'est toi |
| **2. Le site** | accueil 3 portes, paliers, espace enseignant, gabarit vidéo | Opus, effort élevé |
| **3. Palier 1 + 2 complets** | recoupage bases physiques (3→2) + fluide (bouteilles, familles-PRP) | Opus, effort élevé ; vérification adversariale sur la seule justesse métier |
| **4. Palier 3 Organes** | le gros recoupage (tome 3 + organe-par-organe + condenseur/évapo) | idem, en plusieurs séances |
| **5. Paliers 4-6** | gestes, régulation (tes pièces arrivent au fil de l'eau), règle et examen | idem |
| **6. Vidéos + publication** | gabarit vidéo, intégration de tes tournages, relecture collègues, mise en ligne | Opus, effort moyen |

Un chat par lot, prompt de reprise à chaque fin de séance — la REPRISE de ce dépôt reste le
point d'entrée unique.

---

## 11. Les décisions attendues de toi

1. **Le découpage fil/détours** — ouvrir `MAQUETTE-BETA.html` (sur tes deux bureaux). C'est
   la décision qui commande tout le reste.
2. **La voix** — `CAPSULE-AVEC-LA-VOIX.html` : Henri et Denise, on garde ou on change ?
3. **La répartition pack / site** du § 8 — c'est la seule vraie évolution de doctrine.
4. **Les fusions du § 4** — amender librement le tableau (c'est une proposition, pas un tri).
5. **Les vidéos** — d'accord avec les règles du § 6 (sous-titres obligatoires, 100 Mo max) ?
6. **Le nom du site** — « Les parcours du froid » ou autre chose de ton cru.
