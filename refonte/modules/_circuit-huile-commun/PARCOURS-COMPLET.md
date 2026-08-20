# Ligne pédagogique complète — Le circuit d’huile

Statut : brouillon technique et pédagogique du 19 août 2026. La ligne est
intégrée localement au parcours inerWeb et à l’espace enseignant. Elle n’est ni
validée par bon à tirer, ni publiée, ni importée dans le RAG actif.

Entrée interactive unique :

`../circuit-huile-interactif/index.html`

Cette carte de métro affiche les dix modules dans leur ordre pédagogique. Chaque bilan de
module contient aussi un lien direct vers la station suivante ; le terminus revient à la
carte complète.

## Cheminement

| Station | Module | Cours | Questions | Fonction pédagogique |
| ---: | --- | ---: | ---: | --- |
| 1 | Technologie des huiles frigorifiques | 12 | 10 | Suivre le circuit réel, développer les six familles, relier huiles et fluides, lire ISO VG, humidité et acidité |
| 2 | Retour d’huile naturel | 10 | 12 | Relier vitesse, pente, siphons, charge partielle et double colonne, et calculer la vitesse du gaz |
| 3 | Éléments du circuit d’huile | 8 | 9 | Lire la chaîne complète avant d’ouvrir chaque organe |
| 4 | Séparateur d’huile | 8 | 8 | Comprendre séparation, flotteur et chemins de retour |
| 5 | Réservoir d’huile | 8 | 8 | Comprendre réserve tampon, pression et niveaux visibles |
| 6 | Clapet différentiel d’huile | 7 | 7 | Distinguer la branche de pression de la conduite d’huile |
| 7 | Régulateur mécanique AC&R | 8 | 8 | Lire flotteur-pointeau, alimentation et limites de fonctionnement |
| 8 | Régulation électronique TraxOil | 9 | 9 | Lire capteur, électrovanne, zones, alarmes et architectures BP/HP |
| 9 | Pressostat différentiel d’huile | 10 | 10 | Protéger la pression nette de lubrification et diagnostiquer un déclenchement |
| 10 | Diagnostic du circuit d’huile | 9 | 10 | Croiser architecture, mesures et indices avant de conclure |
| **Total** | **10 modules** | **89** | **91** | **Progression spiralée complète** |

Chaque station réactive une notion antérieure. Le terminus ne propose jamais
« une valeur = une panne » : il demande d’identifier l’architecture, de relever
les faits, de croiser plusieurs indices, puis de choisir le prochain contrôle.

## Sources techniques principales

- Fonds local inerWeb : cours « Technologie séparateur d’huile », « Réservoir
  d’huile », « Clapet d’huile », « Régulateur d’huile mécanique » et
  « Régulateur d’huile électronique ».
- Parker Sporlan, *Oil Level Control System — SD-129* :
  <https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-110/SD-129_-Oil-Level-Control-System-Installation.pdf>
- Copeland, *OM3/OM4/OM5 TraxOil Oil Level Management System* :
  <https://media.copeland.com/d8f801b5-15db-4430-bbda-b16b01022eae/OM3_OM4_OM5_TB_EN_0820_R08.pdf>
- BITZER, *Oil level controllers* :
  <https://www.bitzer.de/shared_media/html/kt-600/en-GB/313846411313848587.html>
- BITZER, *Optimized suction header* :
  <https://www.bitzer.de/shared_media/html/kt-600/en-GB/313843723313845515.html>
- Danfoss, *Differential pressure switch MP54 / MP55 / MP55A* :
  <https://assets.danfoss.com/documents/latest/561042/AI545031222570en-000101.pdf>

Les valeurs de réglage, compatibilités et domaines d’emploi restent ceux de la
notice exacte du composant installé. Les modules n’inventent aucun tarage ni
dimensionnement.

## Provenance graphique et accessibilité

Les symboles validés, leurs empreintes et la provenance du tracé de tuyauterie
sont documentés dans `SOURCES-SCHEMAS.md`. Les organes non disponibles dans la
bibliothèque sont représentés par des enveloppes fonctionnelles légendées, pas
par un symbole détourné. Le moteur commun fournit un texte équivalent, une
navigation clavier et tactile, une voix déclenchée uniquement au clic, un mode
DYS, un mode impression et un fonctionnement hors ligne.

Les stations 7 et 8 de « Retour d’huile naturel » intègrent deux adaptations locales hors
ligne du projet Claude Design « Retour d’huile » : un calcul manipulable (diamètre, régime,
débit et repère d’étude → vitesse du gaz) puis les onze scènes complètes commandées par
l’élève. Provenance et empreintes dans les fichiers `PROVENANCE.md` de
`../retour-huile-naturel/assets/claude-retour-huile/` et
`../retour-huile-naturel/assets/claude-retour-huile-film/`.

La station 5 du pressostat intègre désormais une adaptation locale de l’animation Claude
fournie par Franck. Les trois états sont commandés explicitement et la provenance du ZIP est
consignée dans `../pressostat-differentiel-huile-pedagogique/assets/claude-pressostat/PROVENANCE.md`.

## Validation attendue

QA locale du 19 août 2026 : la ligne complète, 356 écrans de cours et 364 écrans de questions
contrôlés sur 10 modules × 4 formats (1366×768, 1024×768, 390×844 et 360×640).
Le contrôle couvre débordements, zones décalées, hors-ligne, clavier, sources,
mode DYS, impression, stockage indisponible, voix au clic, absence d’autoplay, liens de
station à station, les deux adaptations du retour d’huile avec contrôle de leurs cadres
internes et les trois états de l’adaptation Claude du pressostat.

La QA automatisée ne remplace pas :

1. la relecture métier de chaque schéma et formulation ;
2. l’écoute humaine de la voix ;
3. le bon à tirer pédagogique de Franck ;
4. l’autorisation séparée de publier et d’indexer dans le RAG.
