# Le modèle « capsule » — la doctrine de la refonte

> Tranché avec F. Henninot le **06/08/2026**. Tout ce qui est produit dans `refonte/`
> suit ce modèle. Ce qui ne le suit pas n'entre pas dans l'ensemble.

---

## 1. Le principe : un sujet, un fil court, des détours à la demande

L'écran d'accueil pose une seule question : **« Qu'est-ce que je veux réviser ? »**
On choisit **un sujet**. Pas un cours de quarante minutes : un sujet.

Ce sujet se déroule en **un fil principal court** — cinq à sept écrans, une idée par écran.
Le fil ne parle **que** du sujet choisi. Il ne part jamais de côté.

Et à chaque fois qu'une notion connexe apparaît, au lieu de la développer dans le fil,
un insert propose :

> ### Voulez-vous en savoir plus ?
> *Pourquoi le chlore n'apparaît-il pas dans le code ?*

Qui veut, ouvre. Qui ne veut pas, continue et **le fil ne s'allonge pas**.
Au bout du détour, un seul bouton : **« Revenir au fil »** — et l'on repart exactement
à l'écran d'où l'on était parti.

C'est l'esprit du *« Would you like to know more? »* de **Starship Troopers** (1997) :
le récit principal avance sans jamais s'alourdir, et l'approfondissement est **offert,
jamais imposé**. On garde le libellé, on ne garde pas le ton militaire.

**Pourquoi ce modèle plutôt que l'actuel.** Le tuto nomenclature d'aujourd'hui est bon,
mais il enchaîne dans un seul fil : les atomes, les prises du carbone, la règle ASHRAE,
les isomères, les mélanges, le glissement, le fractionnement, puis douze questions.
Celui qui voulait juste savoir lire « R-134a » a tout pris. Celui qui voulait comprendre
le glissement a dû traverser la chimie. Un seul fil pour deux besoins : les deux sont mal
servis. Le découpage règle cela sans jeter une ligne du contenu — **les détours accueillent
exactement ce qui encombrait le fil.**

### Les détours peuvent avoir des détours

Un détour est une capsule comme une autre : il peut lui-même proposer un « en savoir plus ».
On descend aussi loin qu'on veut, on remonte toujours d'un cran à la fois. C'est ce qui permet
**d'intercaler à l'avenir d'autres bricoles** sans rien casser : une notion nouvelle s'accroche
là où elle est appelée, elle n'oblige jamais à réécrire le fil.

---

## 2. Cohérent et progressif

**Cohérent** — toutes les capsules partagent le même moteur, la même charte, la même voix,
les mêmes commandes. On apprend l'outil une fois.

**Progressif** — trois niveaux, affichés sur chaque sujet :

| Niveau | Ce que ça veut dire |
|---|---|
| **Découverte** | Aucun prérequis. On part de ce qu'on voit sur le chantier. |
| **Métier** | Suppose la découverte acquise. Ce que ça change à l'intervention. |
| **Examen** | Ce qui est exigible, et sous quelle forme la question tombe. |

Un sujet déclare ce qu'il **suppose connu** (`suppose:`). L'accueil peut donc proposer un
ordre — et signaler à qui attaque « Le glissement » qu'il vaut mieux avoir vu « Lire le code »
avant. **Proposé, jamais bloqué** : un adulte en formation sait ce qu'il vient chercher.

---

## 3. Pour qui — stagiaires **et** élèves

Public élargi (décision du 06/08) : stagiaires habilitation A1/A2/D/E **et** élèves
CAP IFCA / Bac Pro MFER, dont une partie est FLE ou DYS. Conséquences **obligatoires** :

- **Une idée par écran.** Si un écran a besoin de « et aussi », c'est un détour.
- **UN VISUEL PAR ÉCRAN, SANS EXCEPTION** (F. Henninot, 07/08/2026 : *« on ne doit pas
  avoir une explication sans image, sans animation — j'ai écouté, j'ai rien compris »*).
  Une capsule sans planche est un diaporama : ça ne cause pas. Planche du fonds si elle
  colle, planche neuve sinon (SVG bibliothèque, jamais d'IA) — le champ `planche:` de
  chaque écran, fil ET détours, doit être rempli.
- **Phrases courtes**, voix active, présent. Pas de subordonnée qui traîne.
- **Le mot difficile est expliqué là où il tombe**, pas dans un glossaire à la fin.
  Concrètement : la syntaxe `[[mot|explication]]` le rend **gras et cliquable**, et
  l'explication s'affiche PAR ÉCRIT sous le paragraphe — elle n'est jamais dite par la
  voix (F. Henninot, 07/08/2026 : lire et comprendre, sans alourdir la narration).
- **Le texte lu et le texte affiché sont deux textes.** Le texte affiché est court —
  ce qu'on lit ; le texte lu est plus parlé, et les nombres y sont **écrits en toutes
  lettres** (« R cent trente-quatre a », jamais « R-134a » que la voix massacre).
- **La couleur ne porte jamais seule** : couleur **+** trait **+** mot.
- **Jamais de thème sombre**, y compris sur les écrans « expérience ».
- Le bouton **Aa** (taille du texte, police Lexend pour DYS) est sur toutes les pages.

---

## 4. La voix

**Une seule voix pour tout l'ensemble** — c'est ce qui la rend harmonisée. Le lecteur choisit
seulement **masculine ou féminine** ; les deux disent le même texte, mot pour mot.

**Fabriquée, pas improvisée.** Les narrations sont produites une fois à l'atelier par un moteur
**neuronal** et rangées en MP3 à côté de la capsule. À la lecture, la page joue un fichier :
même qualité sur tous les postes, sans Internet, sans dépendre du navigateur.

> **Pourquoi pas la voix du navigateur.** C'est ce qui est utilisé aujourd'hui. Sur ce poste,
> la seule voix française installée est **Hortense**, une vieille voix SAPI : c'est elle qui
> plafonne la qualité, et le résultat change d'un poste à l'autre. Le fichier fabriqué retire
> ce plafond **et** cette loterie.

**Le réglage de vitesse reste au lecteur** — 0,6 × à 1,6 ×, hauteur de voix conservée
(`preservesPitch`), choix retenu d'une capsule à l'autre. Une capsule s'écoute en marchant
à 1,4 × la deuxième fois.

**Repli** : si un MP3 manque, la page bascule sur la voix du navigateur plutôt que de rester
muette — mais un MP3 manquant est un défaut à corriger, pas un mode de fonctionnement.

**Voix retenues** : à choisir dans `voix/choisir-la-voix.html` (Henri · Rémy · Denise · Vivienne).

---

## 5. Ce que chaque capsule déclare

Au-delà du contenu, chaque écran et chaque détour peut porter les **codes du référentiel**
qu'il tient. C'est ce qui permet de mesurer la couverture code par code, et de prouver aussi
ce qui est **hors référentiel** — utile en atelier, exigé par personne.

Une capsule est **un fichier de données**, pas du code. Personne n'a besoin d'écrire de
JavaScript pour ajouter un sujet ou un détour : c'est le sens du mot « mécanique » dans la
refonte. Gabarit commenté : `capsules/_MODELE.js`.

---

## 6. La charte, harmonisée

Une seule feuille pour tout l'ensemble : `moteur/capsule.css`, posée sur la charte inerWeb
(`C:\git\usine-contenu\00-charte\CHARTE-GRAPHIQUE-INERWEB.md`, § 8 = bloc de consigne).
Bleu `#1B3A63` · orange `#FF6B35` · fonds clairs.

Aujourd'hui les vingt tutos ont chacun leur `styles.css` — vingt interprétations de la même
charte. Après refonte : **zéro `styles.css` par capsule**. Une capsule qui a besoin d'un style
à elle est le signe qu'il manque un composant au moteur ; on ajoute le composant au moteur.

---

## 7. Ce qu'on fait du fonds existant

Rien n'est jeté sans décision. `inventaire.html` sert à trancher pièce par pièce :
**garder / refondre / abandonner**. Les **44 planches animées** sont largement réemployables
telles quelles — ce sont de bons visuels d'écran ; ce qui change, c'est ce qu'il y a autour.
Ce sont les **20 tutos** qui se redécoupent en capsules et détours.

Et `C:\git\pilote-fluides` n'est jamais modifié : le report se fait à la main, pièce validée
par pièce validée.
