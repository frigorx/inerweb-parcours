# La rame complète — Le circuit d’huile

Statut : brouillon technique et pédagogique, révisé le 20 août 2026. La rame est
intégrée localement au parcours inerWeb, à l’espace enseignant et au plan de
formation de `pilote-fluides`. Elle n’est ni validée par bon à tirer, ni indexée
dans le RAG actif.

Entrée unique, la carte de la rame :

`../circuit-huile-interactif/index.html`

Chaque bilan de station porte aussi un lien direct vers la suivante ; le terminus
revient à la carte.

## Ce qui décide de l’ordre

`outils/ordonner-ligne.js` porte **une seule liste ordonnée**. En découlent le rang
affiché dans chaque station, l’enchaînement d’une station à la suivante, la carte de
la rame et la branche du plan de formation. Ajouter une station, c’est une ligne dans
cette liste, puis relancer :

    node outils/ordonner-ligne.js          rangs, enchaînements, carte, plan
    node outils/copier-ligne-vers-pack.mjs recopie dans le pack public
    node outils/extraire-banque-huile.mjs  sort les QCM pour la mesure

## Les dix-sept stations

| # | Station | Écrans | Questions | Durée | Ce qu’elle installe |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | Les familles d’huile | 6 | 5 | 7,9 | à quoi sert l’huile, où elle passe, MO/AB/PAO et POE/PAG/PVE |
| 2 | Choisir et contrôler l’huile | 6 | 5 | 8,8 | méthode de choix, miscibilité, grade ISO VG, humidité, acidité |
| 3 | Le retour d’huile naturel | 5 | 5 | 6,1 | vitesse d’entraînement, pente, points bas, siphon et contre-siphon |
| 4 | Vérifier le retour d’huile | 5 | 7 | 7,4 | charge réduite, double colonne, calcul de vitesse, lecture de plan |
| 5 | La chaîne : séparer et stocker | 4 | 4 | 5,0 | vue d’ensemble de la chaîne, le séparateur, le réservoir |
| 6 | La chaîne : mettre sous pression | 4 | 5 | 5,5 | clapet taré, régulateurs de niveau, chaîne de preuve |
| 7 | Le séparateur d’huile | 8 | 8 | 9,1 | implantation au refoulement, flotteur et pointeau, limites |
| 8 | **Le séparateur à éclatement** | **5** | **5** | **7,3** | **les deux familles, le choc, la chute de vitesse, quand préférer un coalescent** |
| 9 | Le réservoir d’huile | 8 | 8 | 9,2 | réserve tampon, lecture des voyants, sécurité avant démontage |
| 10 | Le clapet différentiel d’huile | 7 | 7 | 8,1 | branche de pression contre conduite d’huile, rôle du tarage |
| 11 | Le régulateur mécanique AC&R | 8 | 8 | 8,7 | montage au carter, flotteur et admission, limites |
| 12 | TraxOil : comment il travaille | 4 | 4 | 4,5 | capteur, électrovanne d’admission, alarme de niveau |
| 13 | TraxOil : monter et diagnostiquer | 5 | 5 | 5,7 | OM3/OM4/OM5, architectures BP et HP, chaîne de preuve |
| 14 | Le pressostat : la pression nette | 5 | 5 | 6,0 | pompe et raccordements, P1 moins P2, lecture des seuils |
| 15 | Le pressostat : temporisation | 5 | 5 | 5,9 | délai au démarrage, coupure de sécurité, relevé |
| 16 | Diagnostic : lire l’architecture | 5 | 5 | 5,6 | identifier l’architecture avant de conclure |
| 17 | Diagnostic : conclure | 4 | 5 | 4,9 | croiser plusieurs indices, décider le prochain contrôle |
| **Total** | **17 stations** | **94** | **96** | **1 h 55** | progression spiralée complète |

Les durées sont mesurées sur le texte réellement affiché : 130 mots par minute en
lecture attentive, 8 secondes de pause par écran, 30 secondes par question. Le cap
retenu avec Franck est **moins de dix minutes par station** ; les dix-sept y sont.

## La bande son

94 narrations, une par écran, dans `refonte/voix/narrations/<station>.js` — jamais
dans les modules : un texte pour l’oreille et un texte pour l’œil ne sont pas le même
texte. Deux voix fabriquées à l’atelier, une seule (Henri) embarquée dans le pack.

**Personne n’a encore écouté ces narrations.** Le contrôle automatique vérifie
qu’aucun écran n’est muet et qu’aucune narration ne vise un écran disparu. Il ne dit
rien de la justesse métier, du rythme ni de la prononciation.

## Les questions

96 questions, mesurées par `inerweb-habilitation/outils/mesurer-banque.mjs` :

| | |
| --- | ---: |
| Note en cochant la proposition qui se détache | **6,5 / 20** |
| Hasard pur (référence basse) | 6,7 / 20 |
| Bonne réponse en position A | 34 % |

La banque est **sous le hasard** : aucune stratégie de forme ne paie.

## Sources techniques principales

- Fonds local inerWeb : cours « Technologie séparateur d’huile », « Réservoir
  d’huile », « Clapet d’huile », « Régulateur d’huile mécanique » et
  « Régulateur d’huile électronique ».
- Parker Sporlan, *Oil Level Control System — SD-129*.
- Copeland, *OM3/OM4/OM5 TraxOil Oil Level Management System*.
- BITZER, *Oil level controllers* et *Optimized suction header*.
- Danfoss, *Differential pressure switch MP54 / MP55 / MP55A*.

Les valeurs de réglage, compatibilités et domaines d’emploi restent ceux de la notice
exacte du composant installé. Les stations n’inventent aucun tarage ni dimensionnement.

## Provenance graphique et accessibilité

Les symboles validés, leurs empreintes et la provenance du tracé de tuyauterie sont
documentés dans `SOURCES-SCHEMAS.md`. Les organes non disponibles dans la bibliothèque
sont représentés par des enveloppes fonctionnelles légendées, jamais par un symbole
détourné. Le moteur commun fournit un texte équivalent pour chaque visuel.

Les trois animations issues de Claude Design sont adaptées hors ligne, sans dépendance
distante, avec lecture commandée par l’élève ; chacune porte son `PROVENANCE.md` avec
les empreintes de ses sources.
