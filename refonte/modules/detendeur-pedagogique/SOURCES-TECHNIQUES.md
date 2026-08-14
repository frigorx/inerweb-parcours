# Sources techniques — détendeur thermostatique

## Principe

Les documents ci-dessous ont été consultés comme références techniques. Leurs images, coupes,
tableaux, logos et géométries ne sont pas reproduits. Les schémas livrés sont originaux et
croisent plusieurs informations fonctionnelles.

## Documents primaires fournis

### Danfoss — fiche T 2 / TE 2

- Fichier local : `AI556829249127en-000101.pdf`.
- Titre : *Data sheet — Thermostatic expansion valve T 2 / TE 2*.
- Édition : mars 2026, 18 pages.
- Titulaire : Danfoss A/S, Climate Solutions.
- Droit : « All rights reserved » en page 18 ; consultation technique seulement.
- Faits retenus :
  - p. 2 : injection de liquide réglée par la surchauffe pour évaporateurs secs ;
  - p. 2 et 8-10 : buse interchangeable, filtre et accessoires ;
  - p. 11 : éléments fonctionnels, T 2 interne, TE 2 externe et égalisation externe avec
    distributeur de liquide ;
  - p. 12 : identification de l’élément, du fluide, de la plage, du point MOP et de la buse ;
  - p. 13-14 : sélection selon puissance, fluide et conditions de calcul ;
  - p. 15 : surchauffe statique, surchauffe d’ouverture et relation `SH = SS + OS` ; exemple
    standard limité à la gamme : `SS = 4 K`, `OS = 6 K` à la puissance nominale ;
  - p. 2 et 15 : fonction MOP et données de pression/température propres au produit.

### Danfoss — guide d’installation T 2 / TE 2

- Fichier local : `AN234186441562en-000502.pdf`.
- Titre : *Installation guide — Thermostatic expansion valve Type T 2 / TE 2*.
- Édition : septembre 2025, 2 pages.
- Titulaire : Danfoss A/S, Climate Solutions.
- Droit : « All rights reserved » en page 2 ; consultation technique seulement.
- Faits retenus :
  - p. 1 : identification du fluide, ordre d’assemblage, couples propres aux raccords,
    protection pendant le brasage et exemple de brasure `15 % Ag` ;
  - p. 1-2 : fixation du bulbe sur la conduite horizontale et positions dictées par le diamètre ;
  - p. 2 : définition graphique de la surchauffe, implantation T 2 / TE 2, égalisation externe,
    point MOP et réglage propre aux plages de charge.

## Fichiers CAO fournis

| Fichier | Information vérifiée | Usage dans le module |
|---|---|---|
| `ID542934671055-0101.stp` | En-tête STEP : `T2 Flare/Flare`, Autodesk Inventor 2022, modèle `WEB068-9334` | Référence de volume uniquement ; non copié, non converti, non décalqué |
| `ID542934635053-0101.dwf` | Signature `(DWF V06.20)` | Référence documentaire uniquement ; non intégré |
| `detendeur danfoss T2.STP` | Produit STEP `WEB068-9334`, Autodesk Inventor 2012 | Référence de volume uniquement ; non intégré |
| `BUZE ORIFICE DANFOSS.STP` | Produit STEP `WEB068-9005`, buse/orifice | Confirmation d’une pièce séparée ; non intégré |

Les deux derniers fichiers proviennent de l’archive `OneDrive_3_04-08-2026.zip`. Aucun droit de
modification ou de diffusion de ces géométries n’a été établi. Ils restent donc hors du livrable.

## Ressources pédagogiques secondaires fournies

### AREA Academy — « Détendeur »

- Adresse directe : `https://areacooling.com/areacademy/fr/detendeur/`.
- Auteur affiché : Adriana Aguirre ; AREA Cooling Solutions.
- État consulté : 4 août 2026 ; page indiquant une création en novembre 2023 et une mise à jour
  en novembre 2025.
- Faits recoupés et retenus : modulation du débit selon la charge, bulbe en contact avec
  l’aspiration en sortie d’évaporateur, effet de la pression du bulbe sur la membrane et intérêt
  de l’égalisation externe.
- Réserve : la formulation selon laquelle la membrane « compare la température en amont et en
  aval » n’est pas reprise. Le module conserve le bilan de forces confirmé par la fiche Danfoss.
- Images : non intégrées ; aucune licence de reproduction/modification n’a été établie.

### ABCClim — « Le détendeur thermostatique type et fonctionnement ! »

- Adresse directe : `https://www.abcclim.net/detendeur.html`.
- Création affichée : 9 novembre 2008 ; mise à jour affichée : 19 juin 2022.
- Faits recoupés et retenus : liquide sous-refroidi en amont, vaporisation partielle en aval,
  forces d’ouverture et de fermeture, différence entre égalisations interne et externe et gamme
  de buses croissante `00` à `06`.
- Valeurs non généralisées : passage inférieur au millimètre, exemple `0,5 kg/h`, chute
  `15 → 5 bar`, mélange `80 % liquide / 20 % vapeur` et cible de surchauffe `5 à 8 K`. Elles ne
  précisent pas ensemble le fluide, les enthalpies, les conditions et la référence nécessaires.
- Quatre captures fournies : consultation documentaire seulement ; filigrane ABCClim sur trois
  images et origine/licence de la quatrième non établies.

## Arbitrages éditoriaux ajoutés

- Employer « train thermostatique » comme terme pédagogique, avec la définition visible
  `bulbe + charge + capillaire + membrane`.
- Expliquer qu’au régime permanent le débit massique entrant ressort du détendeur, tandis que
  la pression, la température et la fraction vaporisée changent.
- Pour l’égalisation interne, nommer la pression après la buse à l’entrée de l’évaporateur.
- Pour l’égalisation externe, nommer la pression de sortie près du bulbe et rappeler qu’elle
  compense l’effet de la perte de charge sans supprimer cette perte.
- Limiter la suite de buses `0X, 00, 01…06` à l’exemple T 2 / TE 2 documenté.

## Références graphiques internes réemployées

- `croix-frigoriste.svg` : planche Pilote Fluides fournie par le porteur du projet pour conserver
  la représentation déjà validée du circuit et le sens des organes ; copie locale hors ligne.
- `detendeur-regulation.svg` : animation Pilote Fluides déjà réalisée, réemployée pour montrer la
  continuité bulbe–capillaire–tête et la boucle complète de modulation ; la cible chiffrée finale a
  été remplacée par une consigne de comparaison à la notice constructeur.
- Les symboles complémentaires proposés (`regulateurs-pression.svg`) ont servi de repère de
  cohérence graphique, sans être intégrés à ce module consacré au détendeur thermostatique.

## Portée et validation

Le module décrit le principe générique d’un détendeur thermostatique et utilise T 2 / TE 2 comme
exemple explicitement nommé. Toute sélection de buse, valeur MOP, position horaire du bulbe,
couple, température ou réglage doit être reprise dans la notice de la référence réellement
installée. Validation métier humaine requise avant diffusion institutionnelle.
