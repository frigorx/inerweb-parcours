# Sources — Évaporateur interactif

## Référentiel et contenu local

- `C:\git\pilote-fluides\packs\fluides\referentiel-2025.json` — transcription
  verbatim de l’annexe II de l’arrêté du 21 novembre 2025. Les codes 8.02,
  8.03, 8.04, 8.06, 8.07, 8.10 et 8.11 ont été relus dans cette source.
- [Légifrance — arrêté du 21 novembre 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053004604)
  — contrôle sur la publication officielle du groupe 8.
- `C:\git\pilote-fluides\packs\fluides\cartes.js` — fiches `g8` et `g8b`,
  source éditoriale du pack : givre, dégivrage, régulateur de pression
  d’évaporation, pressostat, inspection et rapport.

Les appellations commerciales KVP/KVL et leurs cas d’usage sont signalés
« À FAIRE VALIDER » dans `cartes.js`. Ils ne sont donc pas enseignés comme des
faits validés dans ce module. Les noms fonctionnels du référentiel officiel sont
employés.

## Vérification technique ciblée

- [Danfoss — The secret behind adaptive defrost](https://www.danfoss.com/en/about-danfoss/articles/dcs/the-secret-behind-danfoss-adaptive-defrost/)
  — accumulation de glace, restriction du débit d’air, excès de fréquence ou de
  durée, nécessité d’adapter les réglages à l’application.
- [Danfoss — Troubleshoot Cold Room Faults](https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/)
  — familles de causes à contrôler : débit d’air, dégivrage, infiltration,
  évacuation, alimentation en fluide, capteurs et historique.

Ces sources contrôlent les principes généraux. Elles ne remplacent jamais la
notice du matériel installé ni la validation par le frigoriste référent.

## Image de reconnaissance

- `images/evaporateur-air.webp` est une copie redimensionnée de
  `C:\git\pilote-fluides\packs\fluides\res\tome-3-technologie-organes\images-organes\evaporateur-air.webp`.
  Elle sert uniquement à reconnaître un évaporateur à air isolé. Elle n’est pas
  un plan constructeur et ne montre aucun raccordement d’installation.
- Conversion locale : WebP, 1024 px au plus grand côté, moins de 180 Ko.

## Symboles

Les fichiers du dossier `symboles/` sont des copies sans redessin de la
bibliothèque inerWeb validée :

- `echangeur_a_air.svg` ←
  `C:\git\usine-contenu\bibliotheque-symboles\svg\frigo_schema\echangeur_a_air.svg` ;
- `pressostat_bp.svg` ←
  `C:\git\usine-contenu\bibliotheque-symboles\svg\frigo_schema\pressostat_bp.svg` ;
- `resistance_evaporation.svg` ←
  `C:\git\usine-contenu\bibliotheque-symboles\svg\frigo_schema\resistance_evaporation.svg`.

Le module ne redessine aucun symbole technique et ne génère aucun schéma
frigorifique par modèle d’image.
