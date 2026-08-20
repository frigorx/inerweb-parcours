# Les régules — parcours complet

## Statut

- Version : `2026-08-20a`
- Statut : **brouillon local**
- Bon à tirer métier/pédagogique : **non donné**
- Publication / GitHub / RAG : **non effectués**
- Entrée locale : `../regules-interactif/index.html`

Cette rame rassemble dix stations autonomes dans un cheminement unique. Chaque station comporte trois écrans de cours et un quiz de quatre questions. L’élève doit suivre la causalité de commande avant de nommer la solution.

## Rame 1 — Commander le froid

1. **La commande directe** — thermostat → compresseur, sans sécurité représentée.
2. **La protection minimum** — thermostat et pressostat autorisent ensemble KM1 et Y1 ; toutes les charges tombent en même temps.
3. **Le pump-down automatique** — le thermostat ferme Y1, puis la baisse de BP arrête KM1 ; une remontée parasite de BP peut provoquer un court cycle.
4. **Le pump-down amélioré** — un relais mémorise la demande et interdit le redémarrage provoqué par la seule remontée de BP.
5. **Le pump-down unique** — la BP de régulation et la BP de sécurité ont deux missions distinctes ; la sécurité reste disponible lorsque la régulation est neutralisée dans la séquence étudiée.

## Rame 2 — Organiser le dégivrage

6. **Sans dégivrage commandé** — aucun organe dédié ; une fonte pendant l’arrêt est possible mais non garantie.
7. **Le dégivrage naturel** — froid arrêté, ventilation maintenue, fin possible sur température avec garde-fou temporel.
8. **Le dégivrage électrique** — résistances, sonde de fin, sécurité de durée, égouttage et redémarrage différé des ventilateurs.
9. **Le dégivrage par gaz chauds** — dérivation du refoulement, gestion du condensat et prévention du retour liquide.
10. **Le dégivrage par inversion de cycle** — vanne quatre voies, échange des rôles des échangeurs et compatibilité complète du circuit.

## Choix de vocabulaire à faire valider

Les supports locaux emploient plusieurs appellations proches : « pump-down amélioré », « single pump-down », « tirage au vide unique » et « tirage au vide unique amélioré ». Pour rendre les fonctions observables, le brouillon retient provisoirement :

- **amélioré** pour le relais ou l’auto-maintien qui empêche un redémarrage hors demande ;
- **unique** pour la variante améliorée avec BP de régulation distincte de la BP de sécurité.

Ces titres doivent être arbitrés par Franck avant toute intégration canonique. Les écrans expliquent toujours la fonction, même si le titre change.

## Contrats d’usage

- fonctionnement hors ligne, sans CDN ni appel réseau ;
- aucune animation, voix ou séquence automatique ;
- chaque séquence avance sur clic ;
- voix déclenchée et arrêtée par l’utilisateur, avec tout le texte déjà visible ;
- couleur doublée par un mot, une forme ou un type de trait ;
- clavier : tabulation, boutons, flèches gauche/droite hors contrôle interactif ;
- projection, tablette, téléphone et impression ;
- schémas fonctionnels originaux, à confronter aux notices constructeur avant câblage.

## Volumétrie

- 10 stations ;
- 30 écrans de cours ;
- 10 écrans de quiz ;
- 40 questions ;
- 5 familles de visuels : ladder, séquence, comparaison, circuit, chronologie.

