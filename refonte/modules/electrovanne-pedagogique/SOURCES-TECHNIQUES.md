# Sources techniques — Électrovanne

Vérification effectuée le 4 août 2026, puis périmètre pédagogique généralisé le 5 août 2026.
Ce fichier est un registre de traçabilité : les marques, références et valeurs ci-dessous identifient
les documents consultés, mais ne sont plus affichées dans le parcours apprenant. Le module ne reprend
ni leurs illustrations, ni leur nomenclature commerciale, ni leurs valeurs propres.

## Documents primaires fournis

| Document | Identification interne | Périmètre retenu |
|---|---|---|
| `C:\Users\henni\Downloads\AX228786439982fr-000404.pdf` | Danfoss, *Guide d’entretien — Électrovanne, types EVR 2–EVR 22 (version 2)*, `DKRCC.PI.BB0.2D.04`, 2018 | Démontage de la pièce supérieure, serrage croisé, couples propres aux tailles, joints et matériaux |
| `C:\Users\henni\Downloads\AN238486497127fr-000404.pdf` | Danfoss, *Guide d’installation — Électrovanne, types EVR 2–EVR 22 (version 2)*, `DKRCC.PI.BB0.Y4.04`, 2018 | Types NF/NO, limites d’installation, orientation, protection au brasage, danger de la bobine déposée, fonctionnement manuel limité |
| `C:\Users\henni\Downloads\EVR3 (10 mm).STEP` | STEP AP214, SolidWorks 2018, produit `EVR3 (10 mm)` | Reconnaissance de l’enveloppe et contrôle de proportions uniquement |
| `C:\Users\henni\Downloads\OneDrive_1_04-08-2026.zip` → `vem a souder.STP` | STEP AP214, métadonnées Danfoss A/S, produit `WEB032F1156`, Autodesk Inventor 2012 | Seconde référence CAO EVR 3 à souder ; reconnaissance uniquement |
| Capture `codex-clipboard-04c20309-8d8e-4290-a893-ec626d19234f.png` | Vue produit portant le marquage Danfoss | Différencier corps, tube d’induit, couvercle et raccords ; aucune intégration |

Les étendues de coordonnées calculées dans les STEP ne sont pas présentées comme des dimensions
constructeur. Elles ont uniquement permis de vérifier que les SVG pédagogiques gardent une silhouette
cohérente.

## Documents primaires Danfoss consultés en ligne

### Fiche de données EVR 2–40

- Titre : *Data sheet — Solenoid valve, EVR 2–EVR 40, Version 2*.
- État consulté : septembre 2025, `AI249086497583en-001401`.
- Adresse directe : <https://assets.danfoss.com/documents/latest/433558/AI249086497583en-001302.pdf>
- Notes de lecture propres à cette gamme, conservées uniquement pour l’historique :
  - les EVR 2–3 NF sont à action directe ;
  - l’induit porte directement la plaque ;
  - la bobine alimentée attire l’induit et ouvre l’orifice principal ;
  - hors tension, pression d’entrée et ressort ferment la vanne ;
  - pression différentielle minimale documentée : `0 bar` pour EVR 2–3 ;
  - les EVR 4–22 NF sont servo-commandées avec diaphragme flottant ;
  - hors tension, les trous d’équilibrage ramènent la pression au-dessus du diaphragme à la
    pression d’entrée et le diaphragme ferme l’orifice principal ;
  - sous tension, l’ouverture du pilote décharge la chambre supérieure vers l’aval et la différence
    de pression soulève le diaphragme ;
  - leur pression différentielle minimale de fonctionnement documentée dans cette version est `0,03 bar` ;
  - une EVR NO possède la fonction opposée et est ouverte bobine hors tension.

### Page de gamme EVR

- Titre : *EVR solenoid valves, direct or servo operated*.
- Adresse : <https://www.danfoss.com/en-us/products/dcs/valves/solenoid-valves/solenoid-valves-for-hvac-r/evr-solenoid-valves/>
- Notes de lecture propres à cette gamme : la famille peut être utilisée sur lignes liquide, aspiration et gaz chaud ;
  des versions NF et NO ainsi que des bobines AC et DC existent.

### Fiche produit EVR 3 032F1157

- Titre : *Solenoid valve, EVR 3, 3/8 in, 0.27 m³/h, Function: NC*.
- Adresse : <https://designcenter.danfoss.com/products/climate-solutions-for-cooling/valves/solenoid-valves/solenoid-valves%2C-fluorinated-refrigerants-and-hydrocarbons/evr/p/032F1157>
- Notes de lecture propres à ce produit : fonction NF, action directe, pression différentielle minimale `0 bar`, option
  de fonctionnement manuel `non`.

### Guides de diagnostic recoupés

- Danfoss, *How to use solenoid valves - Making it easy to be efficient*,
  `BC410633397063en-000202`, 2023 : saletés au siège, dans le tube du noyau, dans le pilote ou
  l’équilibrage ; membrane, siège ou plaque défectueux ; pression différentielle trop faible ;
  défaut de bobine ou de commande.
  <https://assets.danfoss.com/documents/latest/231758/BC410633397063en-000202.pdf>
- Copeland, *50RB Solenoid Valves*, `PA-00264001`, 2024 : corps déformé par brasage incorrect,
  matière étrangère dans la vanne, siège endommagé et inadéquation tension/fréquence de bobine.
  <https://media.copeland.com/1f70df76-babb-472b-8e71-b16b01059349/50RB-Solenoid-Valves-%28PA-00264%29.pdf>

## Faits d’installation retenus de la notice 2018

| Fait du document | Portée dans le module général |
|---|---|
| Suivre le sens, l’orientation et le marquage du modèle | Règle générale de préparation, sans reproduire le dessin Danfoss |
| Exemple de brasage : `700 °C` maximum au raccord et `100 °C` maximum au corps protégé | Non affiché ; le parcours renvoie à la notice du modèle réel |
| Chiffon humide dessiné autour du corps pendant le brasage | Présenté comme protection courante lorsque la notice du modèle la prévoit |
| Procédures de démontage de la pièce supérieure pour plusieurs tailles | Le module ne relie pas automatiquement ce démontage au brasage ni à la seule taille du corps |
| Débrancher la bobine lorsqu’elle est démontée ; sinon risque d’endommagement, de blessure et de brûlure | Écran de sécurité dédié |
| Tige manuelle EVR NF réservée au test de pression ou à la maintenance, environ six tours, MOPD `5 bar`, refermer et remettre le capuchon | Non affiché ; aucune commande manuelle n’est supposée dans le parcours général |
| Testeur magnétique mentionné pour certaines opérations | Non affiché dans le parcours général |

## Limites

- Aucun tableau de capacité, de MOPD de bobine ou de fluide compatible n’est reproduit.
- Aucun couple de serrage n’est transformé en consigne universelle.
- Le module ne fournit aucun schéma de câblage ni procédure de mesure sous tension.
- Les références 2018 et 2025 ne sont pas fusionnées silencieusement : les valeurs sont datées et
  limitées à leur document.
- Toute diffusion institutionnelle demande une validation métier humaine.
