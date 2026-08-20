# Relecture des schémas électriques — films 01, 02 et 08

Relecture demandée par Franck le 20 août 2026, avant toute intégration.
Portée : `Regules 01 Commande directe v2` (`regules-video-v2.jsx`),
`Regules 02 Protection minimum` (`regules-02.jsx`) et
`Regules 08 Pump-down et dégivrage électrique` (`regules-08.jsx`, remise de 21:18).
Le film 02b n'a pas de schéma électrique, il est hors de cette relecture.

Rien n'a été corrigé : ce document constate, Franck tranche.
Les symboles corrigés sont visibles, animés, dans `symboles-normalises.html`.

---

## Ce qui est juste, à ne pas toucher

1. **La croix du frigoriste est respectée** : détendeur à gauche (x 700), condenseur en
   haut (y 170), compresseur à droite (x 1780–2160), évaporateur en bas dans la chambre
   (y 760–1290). La frontière HP/BP tracée à y 620 traverse le corps du compresseur et
   passe sur le détendeur — les deux organes qui font changer la pression sont bien à
   cheval sur la frontière, ce qui est exact.
2. **Contact du thermostat B1** : contact à fermeture commandé par l'organe θ, il ferme
   quand l'air se réchauffe. Correct, et l'animation le fait bouger.
3. **Pressostats HP et BP en contacts à ouverture** (`ContactNF`, `regules-02.jsx:416`) :
   correct, les deux sont fermés tant que la pression reste dans la plage de travail.
   Le symbole — contact franchi par la barre fixe, glyphe `p` relié en pointillés à
   l'organe de commande — respecte le principe de représentation.
4. **La chaîne du film 02 est électriquement cohérente** : L → B1 → HP → BP → nœud, puis
   KM1 et Y1 en parallèle vers N. Les fils tracés (`regules-02.jsx:459-467`) correspondent
   au trajet du courant animé.

---

## Erreurs et manques

### 1. La sécurité ne s'ouvre jamais à l'écran — le plus gênant

`ContactNF` sait afficher un défaut : le repère passe au rouge et un cercle d'alerte
apparaît (`regules-02.jsx:427` et `:429`, paramètre `fault`). **Ce paramètre n'est jamais
passé** : les deux appels ligne 492 et 493 ne transmettent que `live`.

Résultat : dans un film intitulé « protection minimum », le pressostat HP reste figé du
début à la fin. Le défaut HP n'existe que sous la forme d'un trait rouge dans le
chronogramme (`regules-02.jsx:534-538`). L'élève lit un texte qui annonce une coupure
sans jamais voir le contact s'ouvrir.

C'est le même reproche que sur les modules pressostats du 19–20 août : quand l'organe
qui porte la leçon ne bouge pas, l'animation ne sert à rien.

### 2. Aucune protection du circuit de commande

Sur les deux films, le rail L attaque directement le premier contact. Ni fusible, ni
disjoncteur de commande en tête de ligne. Une armoire réelle en porte toujours un.

### 3. Aucune protection du moteur, et un texte qui va trop loin

Les deux films ne montrent que le circuit de commande : pas de sectionneur, pas de relais
thermique, pas de circuit de puissance, et donc jamais les contacts de puissance de KM1.

Conséquence directe sur le film 01, qui affiche en scène de synthèse :

> AUCUNE SÉCURITÉ EN SÉRIE : NI HP, NI BP

L'affirmation est exacte pour les pressions, mais telle qu'elle est écrite elle laisse
entendre qu'il n'y a **aucune** protection. La protection thermique du moteur — relais
thermique ou protection interne — existe toujours, même en commande directe.
Formulation à resserrer : « aucune sécurité **de pression** ».

### 4. Bobines et contacts sans repères de bornes

KM1 et Y1 sont des rectangles portant leur repère, sans **A1 / A2** (`regules-02.jsx:434`).
Les contacts n'ont pas non plus de repères de bornes. Pour une station qui prépare au
câblage sur bornier, c'est un manque de rigueur : l'élève lit un principe, il ne lit pas
un schéma qu'il pourrait suivre fil par fil.

### 5. Le film 02 n'explique pas pourquoi ça ne redémarre pas

Le chronogramme montre le défaut HP à 78 % du temps, puis tout reste tombé jusqu'à la fin,
alors que la demande de froid persiste (« LE FROID EST DEMANDÉ, MAIS LES DEUX CHARGES SONT
TOMBÉES ENSEMBLE »). La raison n'est jamais dite : un pressostat HP de sécurité est à
**réarmement manuel**. Sans cette phrase, l'élève peut croire à un défaut d'animation.

### 6. Symboles redessinés au lieu d'être repris de la bibliothèque

Les symboles des deux films sont redessinés à la main dans le `.jsx`, alors que le
dépôt dispose d'une bibliothèque validée (`pilote-fluides/symboles/svg/`, qui contient
notamment plusieurs variantes de pressostat avec contact). Risque : deux représentations
différentes du même organe entre la station et son film.

---

---

## Le film 08, qui rend le défaut n° 1 indiscutable

Le film livré à 21:18 monte quatre lignes de commande en parallèle entre L et N :

| Ligne | Chaîne | Charge |
|---|---|---|
| Ligne liquide | B1 (θ, à fermeture) → KT (t, à ouverture, ouvre au dégivrage) | Y1 |
| Compresseur | HP (p, sécurité) → BP (p, régulation, à fermeture) | KM1 |
| Dégivrage | KT (t, à fermeture) → S1 (θ, ouvre à +10 °C) | KM2, résistances |
| Ventilateurs | arrêtés au dégivrage, redémarrage différé après égouttage | — |

### Ce qui est bien vu

- **Le couplage pump-down / dégivrage est juste.** L'horloge ne coupe pas le compresseur :
  elle coupe l'électrovanne. Le compresseur tire au vide, puis s'arrête seul sur la BP.
  C'est exactement l'intérêt du montage, et le film le montre dans le bon ordre.
- **L'horloge KT porte deux contacts**, un à ouverture sur la ligne liquide et un à fermeture
  sur la ligne de dégivrage. C'est la bonne pratique : un appareil, deux contacts. Raison de
  plus pour les repères de bornes — 11-12 pour l'un, 13-14 pour l'autre.
- **S1 qui ouvre à +10 °C** pour terminer le dégivrage : conforme à l'usage.

### Le bug, visible dans le code

Ligne 129 de `regules-08.jsx`, le film commande l'ouverture du contact d'horloge :

    <ContactNF ... code="KT" sub="horloge · ouvre au dégivrage" glyph="t" open={p.degLive > 0.5} />

**`ContactNF` n'accepte pas de paramètre `open`** (`regules-kit.jsx:437`). Il ne connaît que
`live`, qui change la couleur, et `fault`, qui n'est jamais passé nulle part. Le paramètre est
donc écrit, transmis, et ignoré.

Conséquence sur les six contacts du film 08 : seuls B1 et BP bougent, parce qu'ils reçoivent
un angle `arm`. **HP, KT et S1 ne s'ouvrent jamais.** Or c'est S1 qui met fin au dégivrage :
le film raconte une fin de dégivrage que l'élève ne voit pas se produire.

C'est le même défaut que sur le film 02, mais ici il touche le cœur du scénario. Le correctif
est unique et sert les cinq films : donner à `ContactNF` un angle d'ouverture, comme
`ContactNO` en a déjà un.

### Une question de conception à trancher

Pendant le dégivrage électrique, rien n'interdit au compresseur de repartir. Les résistances
réchauffent l'évaporateur, la pression BP remonte, et le pressostat BP de régulation — qui
ferme à la montée de pression — recolle KM1. L'installation tire au vide, s'arrête, recolle :
court cycle pendant tout le dégivrage.

Deux réponses possibles, toutes deux défendables :

1. **Verrouiller** : un contact d'horloge à ouverture en série sur la ligne compresseur. C'est
   ce que font les schémas d'installation.
2. **Montrer le défaut** : garder le schéma tel quel et en faire la leçon, puisque la station 3
   a déjà installé la notion de court cycle.

Le film ne fait ni l'un ni l'autre aujourd'hui : il ne verrouille pas et n'en parle pas.

### Manque

Le **BP de sécurité** est absent : la ligne compresseur ne porte que HP et le BP de régulation.
La station 5 distingue pourtant les deux. Sur une station qui s'annonce « complète », l'écart
se remarque.

---

## Choix à assumer, qui ne sont pas des fautes

### A. L'ordre des organes dans la chaîne série

Le film 02 place le thermostat **avant** les deux sécurités : L → B1 → HP → BP → charges.
En série, l'ordre est électriquement indifférent. Mais dans une armoire, les sécurités se
câblent en tête de chaîne, en amont des organes de régulation.

Deux lectures défendables : suivre le raisonnement (« je demande du froid, puis je vérifie
que je peux »), ou coller à la pratique d'armoire. À trancher une fois pour toute la rame,
parce que les stations 3 à 5 reprendront la même chaîne.

### B. Y1 en parallèle sur KM1

Intentionnel et juste : les deux charges tombent au même instant, la ligne liquide se
ferme quand le compresseur s'arrête, donc l'évaporateur reste plein et le fluide migre.
C'est exactement la limite que la station 3 vient lever avec le pump-down. Rien à changer.

---

## Densité, mesurée

| Film | Scènes | Durée | Moyenne par scène |
|---|---|---|---|
| 01 Commande directe | 7 | 47 s | 6,7 s |
| 02 Protection minimum | 7 | 47 s | 6,7 s |
| 02b Migration de liquide | 5 | 34 s | 6,8 s |
| 03 Pump-down automatique | 7 | 47 s | 6,7 s |
| 05 Pump-down unique | 7 | 47 s | 6,7 s |
| 08 Pump-down et dégivrage électrique | 7 | 47 s | 6,7 s |

Moins de sept secondes par scène pour lire un contact, un bornier et une chronologie.
La scène `Circulation` (10 s) fait à elle seule le tour complet de la croix du frigoriste
avec quatre repères de pression qui apparaissent l'un après l'autre.

---

## Décisions de Franck, 20 août

- **Sécurités en tête de chaîne**, comme en armoire : L → Q1 → HP → BP → B1 → charges.
- **Commande complète, sans puissance** : disjoncteur de commande et repères de bornes.
- **Symboles gardés dans le film** pour qu'ils bougent, mais remis aux normes.
- **Film 08 : on verrouille**, et on montrera d'abord pourquoi — la rame progresse partout
  par « voici la limite, voici comment on la lève ».

---

## Ce qui est fait, et comment on le sait

| Correction | État | Preuve |
|---|---|---|
| `ContactNF` sait s'ouvrir (`open`) | fait | relevé à l'écran, ci-dessous |
| Organes de commande encadrés (θ, p, t) | fait | 6 organes dans le film 08 |
| Barre du contact fixe conservée | fait | tracé repris de `pressostat-nf.svg` |
| Bobines vidées, repère à côté, bornes A1/A2 | fait | 4 bobines dans le film 08 |
| Repères de bornes 11-12 et 13-14 | fait | 3 contacts de chaque sorte |
| Composant `Disjoncteur` (Q1) | fait | dans le kit, les films 01 et 02 |
| Chaîne réordonnée, sécurités en tête | films 01 et 02 | ordre lu : Q1 · HP · BP · B1 · KM1 · Y1 |
| « aucune sécurité **de pression** » | fait | film 01 |
| Réarmement manuel dit à l'écran | fait | film 02, défaut HP |
| Défaut HP visible dans l'armoire | fait | film 02, le contact s'ouvre |
| Verrouillage du compresseur au dégivrage | fait | film 08 |
| Sonde de fin S1 qui coupe | fait | film 08 |

**Relevé du film 08, pris pendant la lecture**, pivot des lames qui s'écartent :

    t=28 à 33 s   deux contacts ouverts : KT ligne liquide (x1232) et KT verrouillage (x1532)
    t=34 s        KT liquide encore ouvert, et S1 s'ouvre : fin de dégivrage
    t=35 à 36 s   un contact encore ouvert, puis reprise

Avant correction, aucun de ces trois contacts ne bougeait jamais.

**Contrôle de chevauchement des textes**, en coordonnées écran : aucun sur le film 02 ;
sur le film 08 il reste `SYMBOLE // 1` et `SYMBOLE // 5` — le mot « SYMBOLE » sous le
compresseur touche des graduations. Défaut d'origine, pas encore repris.

Les films tournent maintenant hors ligne : `node outils/construire-films-regules.mjs`.

---

## Ce qui reste

1. **Q1 sur les films 03, 05 et 08.** Leurs quatre à six lignes partent directement du rail L ;
   poser la protection demande d'insérer un tronçon d'alimentation avant le rail, donc de
   toucher à leur géométrie. Non fait pour ne pas casser une mise en page sans la revoir.
2. **Le film 01 v1** (`regules-video.jsx`) n'a pas été repris : seule la v2 l'a été.
3. **La scène pédagogique du film 08** — montrer le court cycle avant de poser le verrouillage.
   Elle viendra avec le rallongement imposé par la voix.
4. **La densité et la narration**, dans cet ordre, une fois le schéma stabilisé.
   Voir `VOIX-DES-FILMS.md` : la voix impose de passer d'environ 47 s à 1 min 30 – 1 min 45.
5. **`SYMBOLE` qui touche les graduations** sur le film 08.
