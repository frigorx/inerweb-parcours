# Provenance de l’adaptation Claude — colonne montante d’aspiration

Source : projet Claude Design **« Retour d’huile »**, remis par Franck le 19 août
2026 dans `C:\Users\henni\Downloads\Réponses sur le projet.zip`.

Identifiant du projet : `8f9ffc06-3266-4569-b697-6a633e534517`
Pièce d’entrée : `Retour d’huile.dc.html`

SHA-256 du ZIP :
`9BE6A6D97007F25ABBBCEF1CE67F691EDEAA42EEC4101DFA8F13673E3B7874E0`

Empreintes SHA-256 des cinq fichiers importés :

| Fichier | SHA-256 |
| --- | --- |
| `Retour d'huile.dc.html` | `297413F946411FDD8B514D31C7942F505C679A549D06766EA08EDEB5F5001E04` |
| `animations-v3.jsx` | `06AE64D470D6DB9C1292D885551F2CF13EABA0FAB9D6D53A5577516F23E6CC7D` |
| `oil-return.jsx` | `7C235DB931F28E9EB6C5906B305FA8F4DFEB9B7244F717357ABF0CF0E3731D31` |
| `support.js` | `8FE7DF74405F3C55F49B7249C74EA1397E65D07DEA2B1BD3B4A489BEC2E28CBE` |
| `tweaks-panel.jsx` | `D259E3A86F7300C808DAA21BAA358688B54665A3978816CFA028757A7F41F04D` |

## Ce que la source contenait

Une composition animée verticale de 105 secondes en onze scènes (ouverture, origine
de l’huile dans le carter, tour du circuit, accumulation aux points bas, vitesse du
gaz, siphon, contre-siphon, charge réduite, double colonne, rétrécissement de section,
récapitulatif), écrite en React avec un moteur d’animation d’atelier, un panneau de
réglage d’auteur et un sous-titrage synchronisé.

## Pourquoi elle n’a pas été reprise telle quelle

Le paquet d’origine charge React et Babel depuis `unpkg.com`. Un module inerWeb doit
fonctionner sans réseau, sans compte et sans CDN. La composition est de plus une vidéo
qui se déroule seule : le parcours du circuit d’huile ne joue rien en autoplay et
commande chaque état explicitement.

## Ce que l’adaptation retient et ce qu’elle change

Retenu — la chaîne technique : évaporateur, ligne d’aspiration, siphon en pied de
colonne, colonne montante, contre-siphon en tête, compresseur ; le mécanisme du
bouchon d’huile qui scelle la grande montée d’une double colonne.

Changé :

- aucune dépendance distante, aucun appel réseau, aucune trace d’exécution ;
- palette de la charte inerWeb (crème `#f7f1e7`, papier `#fffdf8`, navy `#1b3a63`)
  à la place du fond bleu froid `#f2f6fa` et du blanc pur de la source ;
- la vidéo devient un **calcul manipulable** : diamètre intérieur, régime et débit
  aspiré se règlent, la vitesse `v = q_v / S` s’affiche et le verdict suit ;
- les états sont commandés par l’élève, jamais joués automatiquement ;
- le panneau de réglage d’auteur n’est pas repris ;
- le verdict est écrit en toutes lettres : le mouvement n’est jamais le seul porteur
  de l’information, et la couleur ne va jamais sans le trait et le mot ;
- le repère de comparaison devient un paramètre explicite de l’exercice ; il ne vaut
  jamais seuil universel et doit être remplacé par la donnée validée du projet réel ;
- le mouvement attend le clic « Animer » et peut être mis en pause.

## Statut

Brouillon, soumis à relecture métier et au bon à tirer de F. Henninot. Ni publié,
ni indexé dans le RAG actif.
