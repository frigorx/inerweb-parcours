# REPRISE — mettre la ligne « Régulation » en ligne sur inerweb.fr

> ✅ **CHANTIER SOLDÉ le 22 août 2026** — la ligne 🔌 LA RÉGULATION est en ligne et
> vérifiée sur https://inerweb.fr en contre-cache : 13 pages en 200, liste crawlable à
> 15 lignes / 108 stations, statut servi « Version en ligne — relecture métier en
> cours ». Trace : `REPRISE.md` de pilote-fluides (bloc 22/08), section « Les régules »
> du `REPRISE.md` de ce dépôt, et poste de pilotage (bloc pilote — les validations en
> attente y sont). Ce brief reste comme archive de la méthode.

> Brief écrit le **22 août 2026 au matin**, pour être repris par une session neuve.
> Tout ce qui suit a été vérifié sur la machine, pas supposé.

---

## 1. Ce qu'il faut obtenir

Sur **https://inerweb.fr**, le plan de formation doit porter une **nouvelle ligne
« Régulation »** avec ses **dix stations**, de la commande directe sans sécurité jusqu'aux
quatre dégivrages, et **deux correspondances** vers des stations qui existent déjà.

C'est fini quand, et seulement quand :

1. `https://inerweb.fr/index.html` affiche la ligne Régulation et ses dix gares ;
2. chaque gare s'ouvre et affiche sa station (pas un 404) ;
3. les deux correspondances portent leur anneau gris et mènent à la bonne station ;
4. la liste crawlable en bas de l'accueil cite la ligne (elle est générée, voir § 5) ;
5. tout cela est vérifié **sur le site avec un contre-cache**, pas seulement poussé.

---

## 2. Où en est le chantier, exactement

### Ce qui est fait

- La rame **existe et est complète** : dix stations, un catalogue, un moteur, un hub.
  Rien n'a été perdu — la peur du 22/08 venait d'un commit resté local.
- Elle est **poussée et en ligne sur l'atelier** :
  <https://frigorx.github.io/inerweb-parcours/refonte/modules/regules-interactif/index.html>
- Les six films Claude Design sont corrigés (symboles aux normes, contacts qui s'ouvrent,
  verrouillage du dégivrage) et le film de la station 8 porte sa voix.

### Ce qui reste — le travail de cette session

- Les stations vivent dans **l'atelier** (`C:\git\atelier-animations`), pas dans le **pack du
  site** (`C:\git\pilote-fluides\packs\fluides\res\`). Il faut les y recopier.
- La ligne n'existe pas sur le plan : il faut la déclarer.
- Les deux correspondances demandées par Franck ne sont pas posées.

---

## 3. Décisions déjà prises — ne pas les rediscuter

| Décision | Détail |
|---|---|
| **Correspondance 1** | La ligne Régulation reprend **`regulateur-electronique-interactif`** (« Le régulateur électronique »), déjà sur la ligne « 🎛 Ce qui se règle ». |
| **Correspondance 2** | Elle reprend **`pressostat-bp-kp1`** (« Le pressostat BP », KP1) au niveau des stations **pump-down** : c'est ce pressostat qui arrête le compresseur en fin de tirage au vide. Franck a précisé le 22/08 que « branche » voulait dire **correspondance**. |
| **Forme de la ligne** | Une **bande horizontale**, comme l'huile, le CO₂ et l'électrotech — pas une colonne. |
| **Les films restent à l'atelier** | Les six films (3,5 Mo) et leurs voix (1,5 Mo) ne partent **pas** dans le pack public pour l'instant : les stations ne les appellent pas encore, et **personne n'a écouté les sept narrations**. La ligne se publie avec ses stations ; les films suivront quand Franck aura écouté. |

---

## 4. L'ordre des dix stations

Il est déjà fixé dans `refonte/modules/_regules-commun/catalog.js`, ligne « les-regules » :

    1  commande-directe-thermostat    la commande directe, aucune sécurité
    2  protection-minimum-serie       thermostat + HP/BP en série, KM1 et Y1 en parallèle
    3  pump-down-automatique          deux commandes séparées, tirage au vide, court cycle
    4  pump-down-ameliore             un relais mémorise la demande
    5  pump-down-unique               BP de régulation ≠ BP de sécurité
    6  sans-degivrage-commande        aucun organe dédié
    7  degivrage-naturel              froid arrêté, ventilation maintenue
    8  degivrage-electrique           résistances, sonde de fin, égouttage
    9  degivrage-gaz-chauds           dérivation du refoulement
    10 degivrage-inversion-cycle      vanne quatre voies

La correspondance **pressostat BP** se place entre les stations 2 et 3 — au moment où le
pump-down entre en scène. La correspondance **régulateur électronique** se place en fin de
ligne : c'est là que la régulation électronique remplace la logique câblée.

---

## 5. Comment faire, concrètement

### 5.1 Recopier la rame dans le pack du site

L'outil existe mais il est **câblé sur la seule ligne de l'huile** :
`outils/copier-ligne-vers-pack.mjs`. Il lit `outils/ordonner-ligne.js` et recolle **deux liens
sortants** — le logo d'une station doit renvoyer à la carte de SA ligne, pas au parcours de
l'atelier, et une station servie depuis le pack est quatre niveaux plus bas.

Deux voies possibles, au choix de la session :

- décliner l'outil en `copier-ligne-regules-vers-pack.mjs` (le plus sûr : on ne touche pas à
  la rame de l'huile, qui est publiée) ;
- ou généraliser l'outil existant en lui passant la ligne en argument.

Dans les deux cas, **ne pas copier** `_regules-commun/films/`, `voix-films/`, `tests/` ni
`assets/claude-regules/` : ce sont l'atelier, pas le produit. Le nécessaire, c'est
`catalog.js`, `engine.js`, `hub.js`, `styles.css` et les onze `index.html` des modules.
Poids attendu dans le pack : moins de 700 Ko.

⚠️ Le hub porte `<meta name="robots" content="noindex, nofollow">`. Sur l'atelier c'est
voulu. Sur **inerweb.fr, qui est référencé**, décider explicitement : soit on le retire pour
que la ligne soit indexée, soit on l'assume. Demander à Franck si le doute persiste.

### 5.2 Déclarer la ligne sur le plan

La donnée du plan est **dans `C:\git\pilote-fluides\index.html`**, entre les sentinelles
`DONNEES-PLAN — DEBUT` et `DONNEES-PLAN — FIN` (autour des lignes 865 à 1206). Une seule
source : ne jamais écrire une seconde liste à la main.

- Les cinq branches verticales portent un `x` (130, 360, 590, 820, 1050).
- Les rames thématiques sont des **bandes horizontales** avec un `Y` :
  `CEINTURE_Y = 1160, HUILE_Y = 1370, HUILE_CIRCUIT_Y = 1590, CO2_Y = 1810,
  CENTRALES_Y = 2030, OUTILS_Y = 2240, ELECTROTECH_Y = 2400, CORR_Y = 2560, H = 2680`.
  Ajouter une bande décale les suivantes **et** la hauteur `H` : le commentaire au-dessus de
  ces variables explique les écarts (210, 220, 220, 220, 210, 160, 160, 120) — les respecter.
- Une ligne se déclare comme `HUILE` ou `CO2` : `{ slug, nom, sous, couleur, stations: [...] }`.
- Une station se construit avec `cours(dossier, nom, sous)`.
- **Une correspondance, c'est la même station posée sur deux lignes**, marquée
  `Object.assign(cours(...), { corr: true })`. Le moteur dessine alors un anneau gris autour
  de la pastille. Il n'y a **aucun couloir à tracer** : ne pas chercher à en dessiner un.
  Mettre en sous-titre `"correspondance ↔ Réglages"`, comme le fait déjà le détendeur.

Couleur suggérée pour la ligne : elle doit se distinguer des existantes (#1b3a63, #0e7490,
#1e7e54, #ff6b35, #7a4fa0). Un ocre ou un bordeaux ferait l'affaire — au choix.

### 5.3 Régénérer ce qui est généré

    node build/plan-liste.mjs     la liste crawlable + le JSON-LD, depuis DONNEES-PLAN
    node build/build.mjs          la chaîne complète (lance plan-liste avant version)

La liste HTML en bas de l'accueil et le JSON-LD sont **extraits** du bloc de données : les
écrire à la main les ferait diverger au premier cours ajouté.

---

## 6. Les pièges — tous vécus, aucun théorique

1. **`git status` ne dit rien du retard sur le distant.** Le 21/08, la page métier a été
   refaite sur une base périmée ; seul le refus du push l'a révélé. **Avant de toucher un
   fichier : `git fetch` puis `git log HEAD..origin/main -- <fichier>`.** Si le push est
   refusé, ne jamais forcer : lire d'abord `git show origin/main:<fichier>`.
2. **Ne jamais faire `git add -A`** dans ces dépôts : d'autres sessions y laissent des
   fichiers. Ajouter ses propres fichiers, nommément.
3. **Un push réussi n'est pas une page publiée.** Attendre le déploiement
   (`gh run list`, `gh run watch <id>`) puis vérifier **le site** avec un contre-cache :
   `curl -s "https://inerweb.fr/index.html?nc=$(date +%s)" | grep -c "Régulation"`.
4. **Le panneau d'aperçu de Claude Code sert un instantané figé** d'un fichier local : ni
   `reload()` ni un paramètre d'URL ne le rafraîchissent, et il refuse au-delà d'environ
   450 Ko. Copier sous un **nom neuf** à chaque essai.
5. **Les serveurs de prévisualisation sont plafonnés à cinq par dossier** ; d'autres sessions
   en occupent souvent la totalité. Prévoir la vérification par contrôle statique quand le
   serveur est indisponible.

---

## 7. Ce qu'il ne faut pas faire

- Ne pas toucher à la rame de l'huile ni à ses outils : elle est publiée et elle sert.
- Ne pas republier la page `metier.html` : elle vient d'être refaite et mise en ligne le 21/08.
- Ne pas embarquer les films ni les voix dans le pack public (voir § 3).
- Ne pas inventer de contenu pédagogique : les dix stations sont écrites, le catalogue fait foi.

---

## 8. Où se trouve quoi

| Quoi | Où |
|---|---|
| La rame, sa source | `C:\git\atelier-animations\refonte\modules\_regules-commun\` |
| Les onze modules | `C:\git\atelier-animations\refonte\modules\` (dix stations + `regules-interactif`) |
| Le parcours rédigé | `_regules-commun\PARCOURS-COMPLET.md` |
| Les films et leur relecture | `_regules-commun\assets\claude-regules\` (`RELECTURE-SCHEMAS.md`, `VOIX-DES-FILMS.md`) |
| Le site | `C:\git\pilote-fluides` — branche `main`, GitHub Pages → inerweb.fr |
| L'atelier | `C:\git\atelier-animations` — branche `master`, Pages → frigorx.github.io/inerweb-parcours |
| Le plan | `C:\git\pilote-fluides\index.html`, bloc `DONNEES-PLAN` |
| Outil de copie à décliner | `C:\git\atelier-animations\outils\copier-ligne-vers-pack.mjs` |

---

## 9. Le compte rendu attendu

À la fin, dire à Franck :

- l'URL exacte à ouvrir pour voir la ligne ;
- le nombre de gares posées et où tombent les deux correspondances ;
- ce qui a été vérifié **sur le site** et comment ;
- ce qui reste ouvert — au minimum : les narrations des cinq autres films et le fait que
  personne n'a encore écouté celles de la station 8.
