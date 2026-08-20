# La voix des films « Les régules »

Demande de Franck, 20 août 2026 : *« Bien évidemment il faut un vocal de bonne qualité.
C'est important et impératif. »* Ce document dit ce que cela impose, avec des mesures.

---

## 1. La règle de qualité est déjà écrite, et elle a coûté cher

`refonte/CHANTIER-HUILE-TP-VOIX.md`, § « Sur la qualité » :

> La mauvaise qualité entendue était celle de la synthèse du navigateur, pas de la voix
> fabriquée.

**Conséquence, sans exception : la voix des films est faite de MP3 fabriqués.**
Jamais `speechSynthesis`, même en repli, même « en attendant ». Un écran sans MP3 reste
muet plutôt que de parler mal.

État actuel des films, vérifié : aucune trace d'audio et aucune trace de synthèse
navigateur dans `support.js` ni dans les `.jsx`. Rien de mauvais n'est en place — il n'y a
rien du tout.

---

## 2. La chaîne existe déjà dans ce dépôt

| Élément | Où |
|---|---|
| Moteur de synthèse | `edge-tts` (Microsoft), gratuit, sans clé |
| Voix retenues | **Henri** (masculine) et **Denise** (féminine), voix neuronales |
| Textes lus | `refonte/voix/narrations/<station>.js`, séparés des modules |
| Fabricant | `refonte/voix/fabriquer-stations.mjs` |
| Sortie | `modules/<station>/voix/<genre>/<écran>.mp3` |
| Doctrine d'écriture | `refonte/voix/narrations/LISEZ-MOI.md` |

Rien de tout cela n'est à réinventer. Une seule chose manque : **le fabricant lit des
stations, pas des films.** Les films ont des scènes, pas des écrans, et les modules régules
n'ont pas de `module.js`. Il faudra donc décliner un `fabriquer-films.mjs` — même moteur,
mêmes voix, autre source de texte.

⚠️ La fabrication **envoie le texte des narrations à Microsoft**. C'est du texte de cours,
et la rame huile est déjà passée par là, mais la règle du dépôt reste : on ne lance
qu'avec un feu vert.

---

## 3. Ce que la voix impose à la durée des films — mesuré, pas estimé

Débit réel relevé sur cinq narrations déjà fabriquées de la station
« pressostat d'huile », voix Henri, MP3 à 48 kbit/s :

| Écran | Mots | Durée | Mots par seconde |
|---|---|---|---|
| démarrage | 81 | 28,0 s | 2,89 |
| fonctionnement | 82 | 27,5 s | 2,98 |
| électrique | 86 | 29,4 s | 2,92 |
| mesurer | 83 | 28,6 s | 2,90 |
| conclure | 89 | 32,3 s | 2,76 |

**Moyenne : 2,89 mots par seconde, soit 173 mots par minute.**

Appliqué aux films, qui durent 47 secondes en sept scènes :

| Durée du film | Mots que la voix peut dire | Par scène |
|---|---|---|
| 47 s (aujourd'hui) | 136 | 19 mots |
| 60 s | 173 | 25 mots |
| 75 s | 217 | 31 mots |
| 90 s | 260 | 37 mots |
| 105 s | 303 | 43 mots |

Dix-neuf mots par scène, et sans une seule respiration. À titre de comparaison, la
description que le film 02 donne lui-même de sa scène « Fermeture » en fait déjà vingt :
*« B1 ferme, le courant traverse les pressostats HP et BP en série puis alimente KM1 et Y1
en parallèle. »* Autrement dit, à 47 secondes, la voix ne peut que **lire l'étiquette
affichée** — jamais ajouter le geste d'atelier, le piège fréquent ou la raison de métier,
qui sont précisément ce que la doctrine du dépôt exige d'une narration.

### Ce que cela veut dire

**Les films doivent à peu près doubler : de 47 s à 1 min 30 – 1 min 45.**

Et cela règle du même coup la densité jugée trop lourde le 20/08. Le défaut n'était pas
« trop de choses à l'écran », c'était **trop vite** : 6,7 secondes par scène pour lire un
contact, un bornier et une chronologie. En donnant à chaque scène le temps d'une phrase
dite, on obtient les deux à la fois — une voix qui explique, et un film qui respire.

Une station reste sous les dix minutes, doctrine du dépôt : un film d'une minute quarante
n'y change rien.

---

## 4. Comment la voix se cale sur les scènes

Chaque film porte sa liste de scènes avec leur durée, dans son `.dc.html` :

    window.OM_SCENES = '[{"name":"Enceinte","dur":6, ...

La méthode est donc mécanique, et vérifiable :

1. écrire une narration par scène ;
2. fabriquer le MP3 de chaque scène ;
3. **lire la durée réelle du MP3 et écrire cette durée dans `dur`**, plus une seconde de
   respiration ;
4. la scène ne peut plus finir avant sa phrase — la synchronisation cesse d'être un
   réglage à l'œil.

Sur la lecture, la règle de la QA du dépôt s'applique : **pas d'autoplay**. Le film démarre
au clic de l'élève, la voix avec lui.

---

## 5. Ordre de travail

La narration reste en dernier, mais pour une raison précise : **une voix enregistrée sur un
schéma faux est une voix à refaire.** Les corrections de schéma sont chiffrées dans
`RELECTURE-SCHEMAS.md`, et l'une d'elles change ce que la voix devra dire — le sort du
compresseur pendant le dégivrage, au film 08, n'est pas tranché.

1. Corriger les schémas (contact qui s'ouvre, symboles, chaîne réordonnée, Q1).
2. Écrire les narrations, une par scène, calibrées sur 2,89 mots par seconde.
3. Décliner `fabriquer-films.mjs` depuis `fabriquer-stations.mjs`.
4. Fabriquer, **après feu vert** (envoi du texte à Microsoft).
5. Recaler les `dur` sur les durées mesurées des MP3.
6. Écouter. Les 94 narrations de la rame huile et les 194 des questions n'ont toujours été
   écoutées par personne : ne pas ajouter six films à cette pile.
