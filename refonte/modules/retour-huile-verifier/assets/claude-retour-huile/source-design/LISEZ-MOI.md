# Source d'origine Claude Design — retour d'huile

Export brut du projet Claude Design « Retour d'huile »
(`8f9ffc06-3266-4569-b697-6a633e534517`), du 19/08/2026.

Ces fichiers sont **la source**, pas le module. Le module utilisable est
l'adaptation qui se trouve un niveau au-dessus (`app.js`, `index.html`,
`styles.css`) — voir `../PROVENANCE.md` pour ce qui a été retenu et changé.

Ils dormaient dans le fourre-tout `CLAUDE-ESPACE-TRAVAIL` sans sauvegarde ;
rapatriés ici le 26/08/2026 pour que la trace d'origine vive avec l'adaptation.

## Contrôle des empreintes

Quatre fichiers sur cinq correspondent exactement aux empreintes SHA-256
consignées dans `../PROVENANCE.md` : `animations-v3.jsx`, `oil-return.jsx`,
`support.js`, `tweaks-panel.jsx`.

**Écart sur `Retour d'huile.dc.html`** — empreinte constatée
`D7DEB57FE8E60AEABF14E1164E08DDD866F29691AF89D050623AC4DE342C7EE5`, alors que
la provenance note
`297413F946411FDD8B514D31C7942F505C679A549D06766EA08EDEB5F5001E04`.

Le fichier a donc été modifié après l'import, dans la même session (horodaté
22 h 21, entre les autres fichiers datés de 22 h 19 à 22 h 25) — vraisemblablement
rouvert puis réenregistré côté Claude Design. Le contenu technique repris dans
l'adaptation vient des `.jsx`, qui sont intacts.

## À ne pas faire

Ces fichiers chargent React et Babel depuis `unpkg.com`. Ils ne peuvent pas
servir de module inerWeb tel quel : pas de réseau, pas de CDN. C'est la raison
même de l'adaptation.
