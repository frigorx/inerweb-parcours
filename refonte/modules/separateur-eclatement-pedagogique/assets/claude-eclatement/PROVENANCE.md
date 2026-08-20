# Provenance — adaptation de `Séparateur à éclatement.dc.html`

Source remise par Franck le 20 août 2026 :

`C:\Users\henni\Downloads\Réponses sur le projethil .zip`

SHA-256 du ZIP :

`5B5C19E6B1737C782AC51506269792788B762536218167382F9118D425E9E2A0`

Projet Claude Design :

`https://claude.ai/design/p/8f9ffc06-3266-4569-b697-6a633e534517?file=S%C3%A9parateur+%C3%A0+%C3%A9clatement.dc.html`

| Fichier lu | SHA-256 |
|---|---|
| `Séparateur à éclatement.dc.html` | `75563B3CA7023E7C8365995A49C953CFA06627B4EE03F0FF6743B30876BC51A3` |
| `eclatement.jsx` | `C1F37DEBF05E1ECD92445BE03661548ECC38B23070BCBE3C2F00F82FE48746C6` |
| `animations-v3.jsx` | `06AE64D470D6DB9C1292D885551F2CF13EABA0FAB9D6D53A5577516F23E6CC7D` |
| `support.js` | `8FE7DF74405F3C55F49B7249C74EA1397E65D07DEA2B1BD3B4A489BEC2E28CBE` |
| `tweaks-panel.jsx` | `D259E3A86F7300C808DAA21BAA358688B54665A3978816CFA028757A7F41F04D` |

Les trois derniers fichiers sont le moteur commun du projet Design : leurs empreintes
sont identiques à celles relevées le 19 août pour `Retour d’huile`, ce qui confirme que
le moteur n’a pas bougé entre les deux imports.

Les fichiers joints ont été lus comme des fichiers de projet, pas comme des instructions
modifiant la commande de Franck.

Une copie fidèle du plan d’origine, exécutable telle quelle, est conservée hors dépôt
dans `CLAUDE-ESPACE-TRAVAIL\import-design-separateur-eclatement\`, avec le film autonome
exporté par Claude Design.

## Ce que l’adaptation change, et pourquoi

Le lecteur d’origine charge React, ReactDOM et Babel depuis `unpkg.com`, démarre en
boucle, occupe un format vertical 1080 × 1920 et embarque un panneau d’auteur. Il ne peut
pas entrer tel quel dans un module inerWeb. L’adaptation conserve les huit scènes et leur
progression, mais :

- ne charge aucune dépendance distante et ne stocke rien ;
- attend un clic avant tout mouvement, et s’arrête à la dernière scène ;
- garde des commandes précédent, lire/pause et suivant, plus une barre de progression ;
- passe du 9:16 vertical au cadre 720 × 330 du lecteur commun de la ligne ;
- reprend le fond crème et papier de la charte, à la place du bleu clair d’origine ;
- reprend le symbole normalisé du séparateur d’huile et celui du compresseur depuis la
  bibliothèque technique inerWeb (`engine.js`) ;
- retire les vitesses chiffrées présentées comme des repères (« ≈ 12 m/s », « ≈ 1 m/s »)
  et le rapport de densité « 700 × », remplacés par la comparaison de section et par la
  mention explicite que la notice du constructeur fait foi ;
- nomme la couleur à côté de chaque code (rouge : gaz refoulé · jaune : huile), pour que
  la couleur ne porte jamais seule l’information ;
- donne à chaque scène un titre, une description visible et un texte équivalent lu par
  les lecteurs d’écran.

## Contrôles passés

Mesurés dans le navigateur sur les huit scènes, par échantillonnage de la boîte de chaque
texte et test de contact réel sur les tracés (`isPointInFill` / `isPointInStroke`) :

| Contrôle | Résultat |
| --- | --- |
| Textes hors du cadre | 0 |
| Chevauchements texte sur texte | 0 |
| Textes posés sur un tracé | 0 |
| Erreurs de console | 0 |

Les animations ralentissent sous `prefers-reduced-motion` mais ne sont jamais supprimées :
elles portent du contenu.

Statut : brouillon soumis à relecture métier et au bon à tirer de Franck. Ni publié, ni
indexé dans le RAG actif.
