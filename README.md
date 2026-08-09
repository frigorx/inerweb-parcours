# inerWeb Parcours — habilitation fluides frigorigènes

> ⚑ **Version bêta, publiée pour être relue.** Le contenu **n'a pas été validé par un
> frigoriste** et porte lui-même **63 points signalés « À vérifier »**.
> **Ne pas s'en servir comme référence pour une intervention réelle.**

Une refonte des supports de formation en **capsules courtes** : un sujet, un fil de six
écrans, et à chaque notion voisine un insert **« Voulez-vous en savoir plus ? »** qui ouvre
un approfondissement et ramène exactement où l'on était.

**→ [Relire la bêta](https://frigorx.github.io/inerweb-parcours/refonte/relire.html)**
· [Voir le produit nu](https://frigorx.github.io/inerweb-parcours/refonte/index.html)

---

## Le principe

L'écran d'accueil pose une seule question : **« Qu'est-ce que je veux réviser ? »**

Le fil principal ne parle **que** du sujet choisi et ne s'allonge jamais. Tout ce qui
l'encombrerait — la chimie, les cas particuliers, les conséquences réglementaires — descend
dans des **détours** qu'on ouvre à la demande. Un détour peut lui-même en proposer un autre :
c'est ce qui permet d'intercaler une notion nouvelle sans jamais réécrire le fil.

C'est l'esprit du *« Would you like to know more? »* de **Starship Troopers** : le récit
avance sans s'alourdir, et l'approfondissement est **offert, jamais imposé**.

## Les sept sujets

| # | Sujet | Niveau | Fil | Détours | Écrans |
|---|---|---|---|---|---|
| 1 | Le circuit : quatre organes, deux pressions | découverte | 6 | 5 | 12 |
| 2 | La chaleur, sensible et latente | découverte | 6 | 3 | 9 |
| 3 | Pression et température, le couple | découverte | 6 | 3 | 9 |
| 4 | Lire le code d'un fluide | découverte | 6 | 7 | 18 |
| 5 | Familles et PRP | métier | 6 | 4 | 10 |
| 6 | A1, A2L, A3 : lire l'étiquette | métier | 6 | 8 | 16 |
| 7 | Les bouteilles | métier | 6 | 3 | 9 |
| 8 | Le tirage au vide : pourquoi, et jusqu'où | métier | 6 | 7 | 14 |
| 9 | Récupérer le fluide : le geste et la règle | examen | 6 | 3 | 10 |
| 10 | La surchauffe : la mesurer, la comprendre | métier | 6 | 5 | 11 |
| 11 | Le contrôle d'étanchéité : qui, quand, comment | examen | 6 | 5 | 11 |

**11 capsules · 129 écrans · 53 détours · 258 narrations · 132 planches au catalogue.**

## Pour qui

Stagiaires **habilitation fluides A1/A2/D/E** et élèves **CAP IFCA / Bac Pro MFER**, dont une
partie est allophone ou dyslexique. D'où : une idée par écran, des phrases courtes, le mot
difficile expliqué là où il tombe, la police **Lexend** au bouton « Aa », et jamais de thème
sombre.

## Relire

Ouvrez **[le lien de relecture](https://frigorx.github.io/inerweb-parcours/refonte/relire.html)**.
Sous chaque écran : **Juste · À corriger · Question · Sensible**, plus une remarque libre.
Le bouton **« Enregistrer mon relevé »**, en bas, produit un fichier à renvoyer.

Vos remarques restent **sur votre machine** : il n'y a aucun serveur, rien n'est collecté.
Vous pouvez vous arrêter et reprendre plus tard.

Les **encadrés rouges « À vérifier »** sont les endroits où l'avis d'un professionnel est
attendu. La capsule sur le contrôle d'étanchéité en concentre le plus : tout ce qui y est
chiffré est réglementaire, donc daté.

## Technique

Du HTML, du CSS et du JavaScript statiques. **Aucune dépendance, aucun réseau, aucun compte.**
Le tout fonctionne en ouvrant un fichier, sans serveur.

```
refonte/moteur/     le moteur unique et LA charte (zéro feuille par capsule)
refonte/capsules/   une capsule = un fichier de DONNÉES, pas de code
refonte/voix/       les narrations, deux voix, fabriquées une fois
fonds-origine/      copie gelée des planches et tutos d'origine, jamais modifiée
build/              les scripts de fabrication
```

Ajouter un sujet ou un détour ne demande pas d'écrire une ligne de JavaScript : gabarit
commenté dans `refonte/MODELE-CAPSULE.md`.

**La voix** est fabriquée à l'atelier avec un moteur neuronal, puis jouée depuis des fichiers :
même qualité sur tous les postes, hors ligne, sans dépendre du navigateur. Elle ne démarre
jamais toute seule. Vitesse réglable de 0,6 × à 1,6 ×, sans que la voix monte dans les aigus.

**Téléphone et ordinateur** : le même produit, vérifié en 375×812, 360×640, 768×1024 et
1280×800. Balayage horizontal pour changer d'écran, cibles tactiles d'au moins 44 px.

## Origine

Les planches animées et les schémas viennent du pack
**[pilote-fluides](https://frigorx.github.io/pilote-fluides/)**, qui reste en ligne et
**n'est pas modifié** par cette refonte. Le dossier `fonds-origine/` en est une copie gelée
(commit `b59b57f` du 05/08/2026), conservée comme témoin.

## Licence

Contenu pédagogique **CC BY-NC-SA 4.0** · moteur **MIT**. Voir [LICENCE.md](LICENCE.md).
