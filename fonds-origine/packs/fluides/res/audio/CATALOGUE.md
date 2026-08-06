# Catalogue sonore — pack habilitation fluides

Onze sons habillent les planches animées. **Sept sont calculés par le navigateur**, quatre
seulement sont des fichiers. Pack fourni par F. Henninot les 27 et 28 juillet 2026
(« Pilote Fluides » v1 puis v2), avec sa note d'intention.

---

## Sept sons ne sont plus des fichiers : ce sont du code

Constat de F. Henninot le 28/07 : *« ce ne sont que des bruits électroniques, ils n'auraient
pas pu être créés en code ? »* — si. Un clic, un bip, une alarme, un souffle, un cœur qui
ralentit sont des formes d'onde élémentaires, que la Web Audio API fabrique à la volée.

| Son | Recette | Coût |
|---|---|---:|
| `vanne` | impulsion de bruit filtré + note brève — un clic mécanique | **0 Ko** |
| `validation` | deux notes qui montent (880 → 1320 Hz) | **0 Ko** |
| `erreur` | les deux mêmes qui descendent, en triangle — jamais brutal | **0 Ko** |
| `transition` | souffle court dont le filtre s'ouvre | **0 Ko** |
| `alarme` | deux tons alternés, quatre fois — la sirène des locaux techniques | **0 Ko** |
| `fuite` | bruit large filtré, qui s'ouvre puis retombe | **0 Ko** |
| `coeur` | sept battements dont l'intervalle s'allonge, puis la note tenue | **0 Ko** |

**Ce que cela règle** : 1 396 Ko en moins ; plus aucune question d'origine sur ces sept-là
(c'est notre code, sous notre licence) ; et leur hauteur, leur durée et leur intensité se
règlent dans `moteur/sons.js` sans repasser par un fichier.

## Quatre restent des fichiers, et c'est assumé

| Fichier | Durée | Poids | Pourquoi pas de synthèse |
|---|---:|---:|---|
| `pas_escalier.wav` | 4,2 s | 362 Ko | des pas calculés sonnent « boîte à rythme » |
| `chute_choc.wav` | 1,4 s | 121 Ko | un impact crédible demande un enregistrement |
| `compresseur_ambiance.wav` | 5,0 s | 431 Ko | timbre complexe, riche en harmoniques |
| `musique_fond_legere.wav` | 12,0 s | 1 034 Ko | une musique ne se synthétise pas en trois oscillateurs |

**Total 1 947 Ko** (contre 3 342 Ko avant la synthèse), **WAV PCM mono 44,1 kHz 16 bits**.

**Origine déclarée par F. Henninot : générés par ChatGPT.** Cohérent avec la règle du dépôt —
*génératif interdit sur les schémas techniques, autorisé sur l'ambiance*. Si l'un de ces
fichiers se révélait reprendre une œuvre protégée, il serait retiré, comme pour les photos
d'atelier dont l'origine reste à confirmer.

⏭️ Conversion OGG (÷10 sur ces quatre-là) le jour où `ffmpeg` sera installé :

```bash
for f in packs/fluides/res/audio/*.wav; do ffmpeg -i "$f" -c:a libvorbis -q:a 3 -ac 1 "${f%.wav}.ogg"; done
```

---

## ⚠️ Ce que ces sons NE sont pas

> **Ni un son généré, ni un son calculé ne représente fidèlement un phénomène réel.**
> Une fuite de fluide ne fait pas *ce* bruit-là. Un compresseur non plus.

Conséquence pédagogique, non négociable : ces sons **habillent une animation**, ils
n'enseignent **jamais** un diagnostic à l'oreille. Aucune question, aucune fiche, aucune
consigne ne doit demander de reconnaître une anomalie à son bruit sur cette base. Sur le
plateau, l'oreille se forme sur le matériel réel, sous la conduite du formateur.

Le son `coeur` est une **convention dramatique** — la note d'intention d'origine le dit
elle-même —, pas une représentation médicale.

---

## Poids : pourquoi rien de tout cela ne pèse sur le pack

Le pack élève tient à 674 Ko et doit s'ouvrir en 4G. Ces 1 947 Ko **n'y entrent pas** :

- les sept sons calculés ne se téléchargent **jamais** : ils n'existent pas en fichier ;
- les quatre fichiers ne sont chargés **que** si le lecteur a activé le son **et** atteint une
  planche qui les demande ;
- le son est **coupé par défaut**, et le choix est mémorisé sur l'appareil.

Vérifié : **zéro requête audio** à l'ouverture d'une page.

---

## L'horloge : pourquoi pas `setTimeout`

`setTimeout` dérive (mesuré : 2 à 15 ms sur 5 s) et surtout le navigateur le **bride à un
réveil par seconde** dès que l'onglet passe en arrière-plan — en salle, changer d'onglet
suffisait à disloquer la bande-son.

Tout est donc programmé sur `AudioContext.currentTime`, l'horloge du fil audio, qui place un
événement **à l'échantillon près** (0,02 ms) quoi que fasse la page. Les quatre fichiers sont
décodés en mémoire et joués par cette même horloge : une seule référence de temps pour tout.

**Ce que cela ne résout pas** : l'animation SVG est insérée en `<img>`, son horloge SMIL n'est
ni lisible ni pilotable. On lance donc deux horloges côte à côte au même instant. Sur nos
durées (moins de 20 s) l'écart reste inaudible, mais ce n'est **pas** une synchronisation
asservie. La faire vraiment supposerait de piloter l'image depuis le son
(`svg.setCurrentTime`), donc d'injecter le SVG dans la page — ce qui exige d'abord le filet
« valeurs de base = état final » (§ 6 du REPRISE). Autre chantier.

---

## L'API — celle du pack V2, pour que tout s'y branche

```js
PiloteAudio.play("vanne");
PiloteAudio.play("fuite", { volume: 0.5 });
PiloteAudio.setVolume(0.6);
PiloteAudio.toggleMute();
PiloteAudio.playTimeline([{ t: 0, son: "pas" }, { t: 3200, son: "chute" }]);
```

Les séquences par planche vivent dans **`packs/fluides/sons.js`**, avec les instants relevés
dans les SVG eux-mêmes. `node build/sons.mjs` compare les deux à chaque build et refuse en
silence de laisser passer un son programmé après la fin de son animation, un nom absent du
catalogue, ou un fichier manquant.

---

## Règles tenues, reprises de la note d'intention

1. **Jamais de son au chargement.** On ne surprend pas quelqu'un qui ouvre une fiche en salle.
2. **Un contrôle Son / Silence**, mémorisé (`pilote_son`), respecté partout. À l'activation,
   un bip de validation confirme — on entend immédiatement ce qu'on vient d'allumer.
3. La musique de fond reste **très basse** sous les explications — et n'est pas utilisée
   aujourd'hui : elle attend les voix off.
4. Les scènes de sécurité peuvent porter une **dramaturgie plus forte**, sans gore ni effet
   comique.
5. Sur les planches techniques, les bruitages sont **rares et synchronisés** avec l'action.
6. **Voix off** : à prévoir plus tard, scripts fournis avec le pack. ⚠️ Même règle que pour les
   capsules vidéo : **aucune voix enregistrée avant la relecture métier**. Une voix est figée,
   et une erreur enregistrée s'enseigne longtemps.

---

*F. Henninot · inerWeb Édu — pack sonore fourni le 27/07/2026, passé en synthèse le 28/07.*
