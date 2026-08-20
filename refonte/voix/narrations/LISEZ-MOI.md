# Les narrations des stations du circuit d'huile

Un fichier par station. Chaque fichier appelle `NARRATION("<station>", { "<écran>": "texte" })`.

## Pourquoi le texte lu vit ici, et pas dans le module

Un texte écrit pour l'œil et un texte écrit pour l'oreille ne sont pas le même texte.
L'écran peut aligner trois puces ; la voix, elle, doit dire une idée à la fois. En
séparant les deux, on gagne trois choses : la narration se relit d'un bloc, une
retouche de voix ne touche jamais au module, et un écran renommé se signale tout
seul — le fabricant refuse de travailler tant qu'une narration est orpheline.

## Les règles d'écriture retenues

- **Vouvoiement**, comme les capsules déjà enregistrées.
- **Une idée par phrase.** Pas de subordonnées empilées.
- **Aucun symbole à lire** : ni flèche, ni tiret de liste, ni « Δp ». On écrit
  « P un moins P deux », « pi fois le diamètre au carré divisé par quatre ».
- **Sigles épelés** : « P O E », « I S O V G », « O M trois ». La synthèse lit
  « POE » comme un mot, ce qui ne s'entend pas.
- **Nombres en toutes lettres** quand la lecture chiffrée trébuche : « R vingt-deux »,
  « R sept cent quarante-quatre ».
- **Le texte ne recopie pas l'écran.** Il ajoute le geste d'atelier, le piège
  fréquent, ou la raison de métier — ce qu'un formateur dirait en passant derrière
  l'élève.
- **Fin utile.** Chaque narration se termine par ce qu'il faut retenir, pas par une
  formule de transition.

## Fabriquer

    node voix/fabriquer-stations.mjs --controle    ne produit rien, vérifie tout
    node voix/fabriquer-stations.mjs               ce qui manque
    node voix/fabriquer-stations.mjs --tout        refait tout
    node voix/fabriquer-stations.mjs <station>     une seule

Les MP3 se rangent dans `modules/<station>/voix/<genre>/<écran>.mp3` : ils suivent la
station quand on la copie vers un pack, sans chemin à recoller.

⚠️ La fabrication **envoie le texte à Microsoft** — c'est là que se fait la synthèse.
Rien ne part tant que le script ne tourne pas.

## Relire

Les 89 narrations n'ont pas encore été écoutées par un humain. La QA automatisée
vérifie qu'aucun écran n'est muet et qu'aucune narration ne vise un écran disparu.
Elle ne vérifie ni la justesse métier, ni le rythme, ni la prononciation.
