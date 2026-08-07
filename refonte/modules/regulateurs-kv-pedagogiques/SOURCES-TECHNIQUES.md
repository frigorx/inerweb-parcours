# Sources techniques

Consultation : août 2026. Les valeurs de consigne propres à une installation ne
sont volontairement pas généralisées dans le module.

## Danfoss

- KVP — *Evaporator pressure regulator, type KVP*,
  `AI249086497299en-001101` :
  https://assets.danfoss.com/documents/latest/405841/AI249086497299en-001101.pdf
- KVL — *Régulateur de pression du carter KVL*,
  `AI555531791071fr-000101` :
  https://assets.danfoss.com/documents/583205/AI555531791071fr-000101.pdf
- KVR — *Condensing pressure regulator, KVR*,
  `AI251086497566en-001101` :
  https://assets.danfoss.com/documents/latest/582513/AI251086497566en-001101.pdf
- Installation KVP/KVL/KVR/KVD/KVC,
  `AN22668643486000-000601` :
  https://assets.danfoss.com/documents/35498/AN22668643486000-000601.pdf
- *Fitters notes — Pressure regulators*,
  `AX266545601018en-000101` :
  https://assets.danfoss.com/documents/latest/50874/AX266545601018en-000101.pdf

## Fonds local canonique

- `C:\git\pilote-fluides\packs\fluides\res\svg\regulateurs-pression.svg`
- `C:\git\pilote-fluides\CONSIGNES-SOCLE-THEORIQUE.md`
- `C:\git\habilitation-fluide\cours\CONTENU-07-G7-condenseurs.md`
- `C:\git\habilitation-fluide\cours\CONTENU-08-G8-evaporateurs.md`

## Règles retenues

- KVP : régule la pression d’entrée ; il ouvre lorsque cette pression augmente.
- KVL : régule la pression de sortie côté compresseur ; il ouvre lorsque cette
  pression baisse et limite le passage lorsqu’elle devient trop haute.
- KVR : régule la pression d’entrée côté condenseur ; il ouvre lorsque cette
  pression augmente. Le montage KVR + NRD est le cas courant présenté.
- Famille KV : une rotation horaire augmente la pression réglée ; une rotation
  antihoraire la diminue. La mesure se fait au manomètre du côté régulé.
- Le corps KV est de conception angulaire : le schéma de principe montre donc
  une entrée basse, une sortie latérale et un changement de direction à 90°.
