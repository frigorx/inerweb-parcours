# Sources — Condenseur interactif

Consultation éditoriale : 1er août 2026.

## Référentiel réglementaire

- `C:\git\pilote-fluides\packs\fluides\referentiel-2025.json` — transcription
  verbatim de l’annexe II de l’arrêté du 21 novembre 2025. Les codes `7.02`,
  `7.03`, `7.05`, `7.07`, `7.09` et `7.10` ont été relus dans cette source.
- [Légifrance — arrêté du 21 novembre 2025 relatif à l’attestation d’aptitude](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053004604)
  — texte officiel et annexe II.
- [EUR-Lex — règlement d’exécution (UE) 2024/2215](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2215)
  — compétences minimales européennes pour l’installation, la maintenance et
  le contrôle des équipements.

## Diagnostic et fonctionnement

- [Danfoss Ref Tools — Condensing pressure too high, air-cooled condensers](https://reftools.danfoss.com/tools/cooling/troubleshooter/system-areas/high-pressure/system/condensing-pressure-too-high/air-cooled-condensers/)
  — causes à vérifier : surface encrassée, ventilateur défectueux, débit d’air
  restreint, température ambiante, sens de l’air, recyclage d’air chaud et
  régulateur de pression.
- [Danfoss — Troubleshoot Cold Room Faults](https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/)
  — diagnostic structuré : conditions, débit d’air du condenseur, charge,
  restrictions, régulation et comparaison de mesures prises en contexte.

Ces deux sources vérifient le lien qualitatif entre mauvais rejet de chaleur et
hausse possible de la pression de condensation. Elles justifient aussi le
garde-fou du cours : une haute pression n’identifie jamais seule une cause.

## Source éditoriale locale

- `C:\git\pilote-fluides\packs\fluides\cartes.js`, fiches `g7` et `g7b` —
  vocabulaire, articulation avec la croix du frigoriste, consignation,
  inspection, rapport et efficacité énergétique.
- `C:\git\pilote-fluides\packs\fluides\res\evaporateur-interactif\` — contrat
  de navigation, d’extrait, de voix, d’impression et de couverture repris sans
  modifier le cours existant.

## Images et représentation technique

- Illustration de sommaire : `../bibliotheque/illu-g7b.webp`, ressource locale
  validée par inerWeb ; elle sert à l’ambiance et ne porte aucune donnée métier.
- Image de reconnaissance :
  `../tome-3-technologie-organes/images-organes/condenseur-air.webp`, déjà
  documentée dans le Tome 3. Elle montre un organe isolé et ne constitue pas un
  plan d’installation.
- Les schémas de cause à effet du cours sont des compositions HTML/CSS
  explicitement qualitatives. Aucun symbole frigorifique n’est redessiné et
  aucune image générative n’est utilisée pour enseigner un montage.

