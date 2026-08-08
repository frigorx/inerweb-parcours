/* =====================================================================
   tirage-au-vide.js — « Le tirage au vide : pourquoi, et jusqu'où »
   ---------------------------------------------------------------------
   Redécoupage du fonds : tirage-au-vide.svg, balayage-azote.svg,
   epreuve-azote.svg. Refonte du 08/08/2026 (doctrine § 2) : chiffres
   requalifiés en cibles courantes, remontée lue comme des indices,
   planches ajoutées sur tous les écrans.

   POURQUOI CE SUJET
   C'est le geste que tout le monde fait et que peu savent JUSTIFIER. La
   faute la plus répandue tient en une phrase : « j'ai tiré une heure ».
   Une heure n'est pas une valeur — c'est une durée, et elle ne prouve
   rien. Le fil principal remplace donc la durée par la mesure, et le
   test de remontée devient le cœur du sujet.

   Ce qui relève de la chimie de l'huile, des unités et de l'azote est
   descendu en détour : ce sont de vraies questions, mais elles ne
   doivent pas retarder celui qui veut juste savoir jusqu'où tirer.
   ===================================================================== */
CAPSULE({
  id: "tirage-au-vide",
  ordre: 8,
  titre: "Le tirage au vide : pourquoi, et jusqu'où",
  question: "« J'ai tiré une heure » — est-ce que ça veut dire quelque chose ?",
  niveau: "métier",
  minutes: 7,
  suppose: null,
  voixFabriquee: true,   /* Henri + Denise, fabriquées le 06/08/2026 */

  fil: [
    {
      id: "01-deux-ennemis",
      titre: "Après un montage, il reste deux intrus dans le circuit.",
      planche: "../fonds-origine/packs/fluides/res/svg/tirage-au-vide.svg",
      texte: [
        "Vous avez brasé, raccordé, serré. Le circuit est propre — **et il est plein d'air**.",
        "Dans cet air, il y a deux choses dont le circuit ne veut pas : l'**air lui-même** et l'**eau** qu'il transporte.",
        "Le tirage au vide ne sert pas à « faire le vide ». Il sert à **sortir ces deux-là**."
      ],
      lu: "Vous venez de braser, de raccorder, de serrer. Le circuit est propre, et il est plein d'air. Or dans cet air, il y a deux choses dont le circuit ne veut absolument pas : l'air lui-même, et l'eau qu'il transporte sous forme d'humidité. Retenez donc dès maintenant que le tirage au vide ne sert pas à faire le vide pour faire le vide. Il sert à sortir ces deux intrus.",
      codes: ["3.02"]
    },

    {
      id: "02-l-eau",
      titre: "L'eau : elle peut geler d'un côté, ronger de l'autre.",
      planche: "planches/tirage-au-vide_deux-degats-eau.svg",
      texte: [
        "Au **détendeur**, l'eau restante rencontre le point le plus froid du circuit. Elle **peut y geler** et former un bouchon de glace : la machine se met à fonctionner par à-coups, puis plus du tout.",
        "Dans l'**huile**, c'est plus lent : l'eau et l'huile de synthèse **peuvent réagir** et produire des **acides**.",
        "Ces acides attaquent les vernis du moteur et peuvent finir par le faire **claquer** — des mois plus tard, sans que personne fasse le lien."
      ],
      lu: "Commençons par l'eau, la plus sournoise des deux. Au détendeur, l'eau restante rencontre le point le plus froid du circuit. Elle peut y geler, et former un bouchon de glace. La machine se met alors à fonctionner par à-coups, puis plus du tout. Et il y a un second dégât possible, beaucoup plus lent. Dans l'huile, l'eau et l'huile de synthèse peuvent réagir ensemble et produire des acides. Ces acides attaquent les vernis du moteur, et ils peuvent finir par le faire claquer. Des mois plus tard, sans que personne fasse le lien avec le jour du montage.",
      voixPerimee: true,
      plus: ["huile-acide"],
      codes: ["3.02"]
    },

    {
      id: "03-l-air",
      titre: "L'air : il ne se condense pas. Il encombre.",
      planche: "planches/tirage-au-vide_air-condenseur.svg",
      texte: [
        "L'air est un **[[incondensable|un gaz qui ne se liquéfie pas dans les conditions de la machine. Il traverse tout le circuit sans jamais changer d'état]]**.",
        "Il **peut s'accumuler dans le condenseur** et occuper une partie de la place réservée au fluide qui, lui, doit s'y liquéfier.",
        "Effets possibles : la **pression de condensation monte**, l'échange se dégrade, le rendement chute et le compresseur souffre.",
        "Un indice au manomètre : **une HP anormalement haute pour la température qu'il fait dehors** peut trahir des incondensables."
      ],
      lu: "Passons à l'air. L'air est un incondensable : un gaz qui ne se liquéfie pas dans les conditions de la machine. Il traverse donc tout le circuit sans jamais changer d'état. Il peut s'accumuler dans le condenseur, et occuper une partie de la place réservée au fluide, qui lui doit s'y liquéfier. Les effets possibles : la pression de condensation monte, l'échange se dégrade, le rendement chute et le compresseur souffre. Et il y a un indice au manomètre : une haute pression anormalement élevée pour la température qu'il fait dehors peut trahir des incondensables.",
      voixPerimee: true,
      codes: ["3.02"]
    },

    {
      id: "04-le-principe",
      titre: "Le principe : sous vide, l'eau bout à froid.",
      planche: "planches/cloche-a-vide.svg",
      alt: "Expérience de la cloche à vide : une pompe abaisse la pression sous la cloche, et l'eau du bécher se met à bouillir à la température de la pièce, sans aucun chauffage.",
      texte: [
        "On ne peut pas « aspirer » de l'eau liquide restée dans un tube. Il faut la faire **passer en vapeur** pour que la pompe l'emporte.",
        "Rappel : la température d'ébullition **dépend de la pression** — plus la pression baisse, plus l'eau bout froid. Le pourquoi complet est dans la capsule « Pression et température ».",
        "En descendant assez bas, **l'eau se met à bouillir à la température de l'atelier** — et part avec l'air.",
        "**Voilà pourquoi le vide doit être profond, et pas seulement long.** Un vide médiocre n'évapore rien : il déplace de l'air, c'est tout."
      ],
      lu: "Voici le principe, et c'est le cœur du sujet. On ne peut pas aspirer de l'eau liquide restée au fond d'un tube. Il faut d'abord la faire passer en vapeur, pour que la pompe puisse l'emporter. Rappelez-vous : la température d'ébullition dépend de la pression. Plus la pression baisse, plus l'eau bout froid. En descendant assez bas, l'eau se met à bouillir à la température même de l'atelier, et elle part avec l'air. Voilà pourquoi le vide doit être profond, et pas seulement long. Un vide médiocre n'évapore rien du tout : il déplace de l'air, c'est tout.",
      voixPerimee: true,
      renvoi: { sujet: "pression-temperature", libelle: "Le pourquoi complet : la capsule « Pression et température »" },
      plus: ["unites"],
      codes: ["3.02"]
    },

    {
      id: "05-la-valeur",
      titre: "Ce n'est pas une durée. C'est une valeur mesurée.",
      planche: "planches/tirage-au-vide_vacuometre-cible.svg",
      texte: [
        "« J'ai tiré une heure » ne prouve rien : une heure sur un circuit qui fuit donne un circuit qui fuit.",
        "La cible se lit sur un **[[vacuomètre|un appareil qui mesure le vide poussé, en microns. Le manomètre basse pression de votre bloc de manomètres (le « manifold » de l'atelier) en est incapable]]**. **500 microns : c'est la cible courante.** La notice de la machine ou de la pompe peut dire autre chose — **c'est elle qui commande.**",
        "On tire **par les deux côtés**, haute et basse pression, **quand les accès le permettent** — sinon on ne fait le vide que d'une partie du circuit.",
        "Flexibles **courts** et de **gros diamètre** : un flexible fin et long étrangle la pompe et allonge beaucoup le temps."
      ],
      lu: "Et maintenant le point qui fait la différence. Le tirage au vide ne se mesure pas en durée. J'ai tiré une heure ne prouve rien : une heure sur un circuit qui fuit vous donne un circuit qui fuit. La cible se lit sur un vacuomètre, en microns. Cinq cents microns, c'est la cible courante. Mais la notice de la machine ou de la pompe peut dire autre chose, et dans ce cas, c'est elle qui commande. On tire par les deux côtés, haute et basse pression, quand les accès le permettent, sinon on ne fait le vide que d'une partie du circuit. Et un dernier détail qui compte beaucoup : des flexibles courts et de gros diamètre. Un flexible fin et long étrangle la pompe et allonge beaucoup le temps de travail.",
      voixPerimee: true,
      plus: ["pourquoi-pas-bp", "combien-de-temps"],
      codes: ["3.02"]
    },

    {
      id: "06-remontee",
      titre: "Le vrai contrôle : on arrête la pompe et on regarde.",
      planche: "../fonds-origine/packs/fluides/res/svg/tirage-au-vide.svg",
      alt: "Courbe du vacuomètre pendant le tirage : elle descend, atteint la valeur visée, puis, pompe isolée, elle révèle l'état du circuit selon qu'elle reste stable, fait un palier ou remonte sans s'arrêter.",
      texte: [
        "Une fois la valeur atteinte, **on isole la pompe** — selon le montage, pour éviter tout retour d'huile — et on laisse le circuit tranquille, l'œil sur le vacuomètre.",
        "**Rien ne bouge** → le circuit est sec et étanche. Vous pouvez passer à la suite.",
        "**Ça remonte, ralentit, puis fait un palier** → **humidité ou dégazage probable** : il reste de quoi s'évaporer. On tire à nouveau.",
        "**Ça remonte vite et sans s'arrêter** → **fuite probable**. Inutile de tirer plus longtemps : il faut la chercher.",
        "Ces lectures sont des **indices**. La durée d'attente et le critère d'acceptation viennent de **la documentation du constructeur**."
      ],
      lu: "Terminons par le geste qui décide de tout, et que trop de gens sautent. Une fois la valeur atteinte, on isole la pompe, selon le montage, pour éviter tout retour d'huile, et on laisse le circuit tranquille en regardant le vacuomètre. Trois cas. Premier cas : rien ne bouge. Le circuit est sec et étanche, vous pouvez passer à la suite. Deuxième cas : ça remonte, ça ralentit, puis ça fait un palier. Humidité ou dégazage probable : il reste de quoi s'évaporer, on tire à nouveau. Troisième cas : ça remonte vite, et ça ne s'arrête pas. Fuite probable. Inutile de tirer plus longtemps : il faut aller la chercher. Retenez bien : ces lectures sont des indices. La durée d'attente et le critère d'acceptation viennent de la documentation du constructeur.",
      voixPerimee: true,
      plus: ["humidite-ou-fuite", "compresseur-jamais", "azote"],
      codes: ["3.02", "3.03"]
    }
  ],

  retenir: [
    "Le vide sort **deux** intrus : l'**air** (incondensable) et l'**eau**.",
    "Sous vide, **l'eau bout à froid** : c'est ainsi qu'elle sort. D'où un vide **profond**, pas seulement long.",
    "**500 microns : la cible courante**, au vacuomètre — jamais au manomètre BP. **La notice commande.**",
    "**Le test de remontée renseigne** : stable = bon · palier = humidité probable · montée continue = **fuite probable**. Des indices ; le critère vient du constructeur.",
    "**Jamais** de tirage au vide avec le compresseur de la machine."
  ],

  detours: {

    "huile-acide": {
      question: "L'eau qui attaque l'huile : comment ça marche ?",
      ecrans: [
        {
          id: "d-huile-1",
          titre: "Les huiles POE sont fortement hygroscopiques.",
          planche: "planches/tirage-au-vide_huile-hygroscopique.svg",
          texte: [
            "Les fluides sans chlore imposent des huiles de synthèse, les **[[POE|polyolesters : les huiles utilisées avec les HFC et les HFO. Elles remplacent les huiles minérales des anciens fluides]]**.",
            "Ces huiles sont **fortement [[hygroscopiques|elles attirent et retiennent l'humidité de l'air ambiant]]** — bien plus que les anciennes huiles minérales.",
            "Un bidon resté ouvert dans un atelier se charge en humidité. C'est pourquoi on referme aussitôt, et qu'on ne réutilise pas un fond de bidon."
          ],
          lu: "Les fluides sans chlore ont imposé des huiles de synthèse, qu'on appelle les P O E, les polyolesters. Ces huiles sont fortement hygroscopiques : elles attirent et retiennent l'humidité de l'air ambiant, bien plus que les anciennes huiles minérales. Un bidon resté ouvert dans un atelier se charge en humidité. C'est la raison pour laquelle on referme aussitôt, et qu'on ne réutilise pas un fond de bidon qui traîne.",
          voixPerimee: true,
          codes: ["3.02"]
        },
        {
          id: "d-huile-2",
          titre: "Eau + huile = acide. Et l'acide ne s'en va plus.",
          planche: "planches/tirage-au-vide_hydrolyse-acides.svg",
          texte: [
            "L'eau et l'huile POE peuvent réagir : c'est une **[[hydrolyse|la molécule d'huile est coupée par l'eau. La réaction est lente et difficile à inverser]]**, qui produit des **acides organiques**.",
            "Ces acides restent dans le circuit. Ils attaquent les vernis d'isolation du bobinage.",
            "Après un moteur claqué, pas d'improvisation : **une procédure** — diagnostic, remplacement de l'huile, changement du [[déshydrateur|la cartouche qui piège l'humidité et les acides dans le circuit]], nettoyage — **selon les préconisations du fabricant**.",
            "**Le tirage au vide correct coûte une demi-heure. Cette panne-là peut coûter la machine.**"
          ],
          lu: "L'eau et l'huile P O E peuvent réagir ensemble : c'est ce qu'on appelle une hydrolyse. La molécule d'huile est coupée par l'eau, la réaction est lente, et elle est difficile à inverser. Elle produit des acides organiques, qui restent dans le circuit et attaquent les vernis d'isolation du bobinage. Et si un jour le moteur claque, pas d'improvisation : on suit une procédure. Diagnostic, remplacement de l'huile, changement du déshydrateur, nettoyage, selon les préconisations du fabricant. Faites le compte : un tirage au vide correct coûte une demi-heure. Cette panne-là peut coûter la machine.",
          voixPerimee: true,
          codes: ["3.02"]
        }
      ]
    },

    "unites": {
      question: "Micron, millibar, torr : je m'y perds.",
      ecrans: [
        {
          id: "d-unites-1",
          titre: "Trois échelles, une seule idée : on descend vers zéro.",
          planche: "planches/tirage-au-vide_echelle-unites.svg",
          texte: [
            "**1 torr = 1 mmHg = 1000 microns.** Le micron est simplement un millième de torr : on l'utilise parce que le vide utile se joue **dans les décimales du torr**.",
            "**1 mbar ≈ 750 microns.**",
            "Donc la cible de **500 microns ≈ 0,5 torr ≈ 0,67 mbar**.",
            "Et l'atmosphère, pour comparer : **760 000 microns**. On descend donc à **moins d'un millième** de la pression ambiante — environ un mille-cinq-centième."
          ],
          lu: "Trois échelles circulent, mais elles disent la même chose. Un torr égale un millimètre de mercure, égale mille microns. Le micron est simplement un millième de torr : on l'emploie parce que le vide utile se joue dans les décimales du torr, et qu'il est plus commode de dire cinq cents que zéro virgule cinq. Un millibar vaut environ sept cent cinquante microns. Notre cible de cinq cents microns vaut donc environ zéro virgule cinq torr, ou zéro virgule six sept millibar. Et pour vous donner l'échelle : l'atmosphère, c'est sept cent soixante mille microns. On descend donc à moins d'un millième de la pression ambiante, environ un mille-cinq-centième.",
          voixPerimee: true,
          codes: ["3.02"]
        }
      ]
    },

    "pourquoi-pas-bp": {
      question: "Pourquoi mon manomètre BP ne suffit-il pas ?",
      ecrans: [
        {
          id: "d-bp-1",
          titre: "Parce que tout le vide utile tient dans l'épaisseur de son aiguille.",
          planche: "planches/tirage-au-vide_mano-vs-vacuometre.svg",
          texte: [
            "Le manomètre basse pression du bloc de manomètres (le « manifold » de l'atelier) descend jusqu'à **−1 bar**, et là il est **au bout de sa course**.",
            "Or quand l'aiguille touche **−1 bar**, la pression réelle peut encore valoir **plusieurs milliers de microns** : tout le vide utile est **écrasé contre la butée**, dans l'épaisseur du trait — l'aiguille ne distingue pas cinq mille microns de cinq cents.",
            "L'aiguille est donc collée en bas, immobile, aussi bien pour un circuit sec que pour un circuit trempé.",
            "**Un manomètre BP ne peut pas mentir : il n'est simplement pas fait pour ça.** Il faut un vacuomètre."
          ],
          lu: "La réponse tient en une phrase : tout le vide utile tient dans l'épaisseur de son aiguille. Le manomètre basse pression de votre bloc de manomètres descend jusqu'à moins un bar, et là il est au bout de sa course. Or quand l'aiguille touche moins un bar, la pression réelle peut encore valoir plusieurs milliers de microns. Tout le vide utile est écrasé contre la butée, dans l'épaisseur du trait : l'aiguille ne distingue pas cinq mille microns de cinq cents. Elle est donc collée en bas, parfaitement immobile, aussi bien pour un circuit parfaitement sec que pour un circuit trempé. Le manomètre ne ment pas : il n'est simplement pas fait pour cela. Il faut un vacuomètre.",
          voixPerimee: true,
          codes: ["3.02"]
        }
      ]
    },

    "combien-de-temps": {
      question: "Alors, combien de temps faut-il tirer ?",
      ecrans: [
        {
          id: "d-duree-1",
          titre: "La bonne réponse : jusqu'à la valeur, puis on vérifie.",
          planche: "planches/tirage-au-vide_vacuometre-cible.svg",
          texte: [
            "La durée **dépend de tout** : longueur des lignes, volume, température de l'atelier, débit de la pompe, section des flexibles, quantité d'eau présente.",
            "**Une durée annoncée à l'avance ne prouve donc rien.** Le seul critère : la valeur au vacuomètre, puis le test de remontée.",
            "*S'il fait froid dans l'atelier, l'eau s'évapore moins bien. Si un apport de chaleur aide, il suit **une méthode et des limites données par le constructeur** — **jamais de flamme, jamais de chauffe improvisée.***"
          ],
          lu: "La bonne réponse, c'est : jusqu'à la valeur, puis on vérifie. La durée dépend de tout : la longueur des lignes, le volume du circuit, la température de l'atelier, le débit de la pompe, la section des flexibles, et la quantité d'eau réellement présente. Une durée annoncée à l'avance ne prouve donc rien. Le seul critère, c'est la valeur au vacuomètre, puis le test de remontée. Un mot pour finir : s'il fait froid dans l'atelier, l'eau s'évapore moins bien. Si un apport de chaleur aide, il suit une méthode et des limites données par le constructeur. Jamais de flamme, jamais de chauffe improvisée.",
          voixPerimee: true,
          codes: ["3.02"]
        }
      ]
    },

    "humidite-ou-fuite": {
      question: "Ça remonte : comment distinguer l'humidité de la fuite ?",
      ecrans: [
        {
          id: "d-remontee-1",
          titre: "L'humidité s'essouffle. La fuite, jamais.",
          planche: "planches/tirage-au-vide_courbes-remontee.svg",
          texte: [
            "**L'humidité** produit de la vapeur tant qu'il reste de l'eau. La pression monte, **ralentit, puis fait un palier** : **humidité ou [[dégazage|l'huile et les parois relâchent lentement des gaz qu'elles avaient absorbés]] probable**.",
            "**Une fuite** fait entrer de l'atmosphère, et l'atmosphère est inépuisable. La pression monte **vite, régulièrement, sans palier** : **fuite probable**.",
            "La température et le volume du circuit **modifient la forme de la courbe**. D'où le geste : **regardez la forme, pas seulement la vitesse.**",
            "Ce sont des **indices** : la durée d'observation et le critère d'acceptation viennent **du constructeur**."
          ],
          lu: "La distinction est simple une fois qu'on la connaît : l'humidité s'essouffle, la fuite jamais. L'humidité produit de la vapeur tant qu'il reste de l'eau. La pression monte, ralentit, puis fait un palier : humidité ou dégazage probable. Une fuite, elle, fait entrer de l'atmosphère, et l'atmosphère est inépuisable. La pression monte vite, régulièrement, sans faire de palier : fuite probable. Attention, la température et le volume du circuit modifient la forme de la courbe. D'où le geste juste : regardez la forme, pas seulement la vitesse. Et retenez que ce sont des indices : la durée d'observation et le critère d'acceptation viennent du constructeur.",
          voixPerimee: true,
          codes: ["3.02", "3.03"]
        }
      ]
    },

    "compresseur-jamais": {
      question: "Peut-on faire le vide avec le compresseur de la machine ?",
      ecrans: [
        {
          id: "d-compresseur-1",
          titre: "Non. Jamais. Un compresseur n'est pas une pompe à vide.",
          planche: "planches/tirage-au-vide_compresseur-pas-pompe.svg",
          texte: [
            "**Un compresseur n'est pas conçu pour ce travail** : il est fait pour comprimer du fluide, pas pour atteindre et tenir un vide profond.",
            "**Sous vide, il sort de ses conditions de fonctionnement** : plus de fluide pour **refroidir** le moteur, une **lubrification** qui n'est plus assurée, une **isolation électrique** qui n'est plus dans les conditions prévues.",
            "**Il n'y a pas de cas particulier, pas de « juste un peu ».** Pour le vide, il y a la pompe à vide."
          ],
          lu: "Non. Jamais. Et la raison de fond tient en une phrase : un compresseur n'est pas une pompe à vide. Il est conçu pour comprimer du fluide, pas pour atteindre et tenir un vide profond. Et sous vide, il sort de toutes ses conditions de fonctionnement : il n'y a plus de fluide pour refroidir le moteur, la lubrification n'est plus assurée, et l'isolation électrique n'est plus dans les conditions prévues. Retenez la formule : il n'y a pas de cas particulier, et pas de juste un peu. Pour le vide, il y a la pompe à vide.",
          voixPerimee: true,
          codes: ["3.02", "2.03"]
        }
      ]
    },

    "azote": {
      question: "Et l'azote, dans tout ça ?",
      ecrans: [
        {
          id: "d-azote-1",
          titre: "L'azote travaille avant le vide, pas à sa place.",
          planche: "../fonds-origine/packs/fluides/res/svg/balayage-azote.svg",
          texte: [
            "**Pendant le brasage** : un filet d'azote dans le tube empêche la formation de **calamine** à l'intérieur. Cette calamine, sinon, part se loger dans le détendeur.",
            "**Après le brasage** : un balayage chasse une bonne partie de l'humidité **avant** de brancher la pompe. La pompe en a d'autant moins à faire.",
            "**Pour l'épreuve d'étanchéité** : on met le circuit en pression à l'azote pour chercher les fuites — **jamais à l'oxygène**, jamais au fluide.",
            "**Mais l'azote ne remplace pas le vide.** Il prépare le terrain ; c'est la pompe qui finit le travail."
          ],
          lu: "L'azote travaille avant le vide, jamais à sa place. Il intervient à trois moments. Pendant le brasage, d'abord : un filet d'azote circulant dans le tube empêche la formation de calamine à l'intérieur. Cette calamine, sinon, se détache et part se loger dans le détendeur. Après le brasage ensuite : un balayage à l'azote chasse une bonne partie de l'humidité avant même de brancher la pompe, qui en a d'autant moins à faire. Et pour l'épreuve d'étanchéité enfin : on met le circuit en pression à l'azote pour chercher les fuites. Jamais à l'oxygène, jamais au fluide. Mais retenez bien : l'azote ne remplace pas le vide. Il prépare le terrain, et c'est la pompe qui finit le travail.",
          verifier: ["Décision plateau attendue : donne-t-on une pression d'épreuve de référence (plaque/notice) sur cet écran ?"],
          codes: ["3.01", "3.02"]
        }
      ]
    }
  }
});
