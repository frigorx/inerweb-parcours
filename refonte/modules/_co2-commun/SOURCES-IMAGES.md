# Registre des images — « La Rame CO₂ »

Statut : **brouillon inerWeb à relire**. Deux illustrations éditoriales originales
ont été générées le 20 août 2026 à la demande explicite de Franck. Aucune image
photographique ni figure constructeur n’est embarquée.

## Illustrations générées

| Fichier | Outil | Usage | Statut |
|---|---|---|---|
| `assets/molecule-co2-editoriale-v1.png` | OpenAI ImageGen | molécule linéaire O=C=O, décor éditorial de la gare 1 et du hub | décor informatif ; le texte reste l’autorité |
| `assets/champ-moleculaire-co2-v1.png` | OpenAI ImageGen | champ discret de molécules sur le plan de ligne | purement décoratif |

Les deux fichiers sont locaux, sans appel réseau, et restent utilisables hors
ligne. Le premier dessin respecte la structure linéaire demandée : exactement un
atome de carbone central et deux atomes d’oxygène. Les couleurs ne servent jamais
seules à transmettre une information de sécurité ou de fonctionnement.

Les prompts complets sont conservés dans `PROMPTS-IMAGES.md`.

## Schémas techniques

Les diagrammes de phases, le diagramme log p-h, la cuve à l’arrêt, le plan du
local et les circuits frigorifiques sont des **SVG manuels originaux inerWeb**
produits dans `engine.js`. Les documentations Danfoss, BITZER et Copeland ont été
consultées comme références techniques. Leurs figures ne sont ni copiées, ni
décalquées, ni intégrées.

Le diagramme enthalpique réemploie le cheminement et des conventions du brouillon
interne `diagramme-enthalpique-modulaire-v7` : axes, cloche, zones, familles de
courbes et lecture progressive. Sa géométrie R744 est qualitative et ne doit pas
servir à relever une valeur.

Le logo `logo-inerweb.svg` est une composition textuelle originale inerWeb.
