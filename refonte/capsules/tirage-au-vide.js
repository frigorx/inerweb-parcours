/* =====================================================================
   tirage-au-vide.js — « Le tirage au vide : pourquoi, et jusqu'où »
   ---------------------------------------------------------------------
   Redécoupage du fonds : tirage-au-vide.svg, balayage-azote.svg,
   epreuve-azote.svg.

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
      titre: "L'eau : elle gèle d'un côté, elle ronge de l'autre.",
      texte: [
        "Au **détendeur**, l'eau restante rencontre le point le plus froid du circuit. Elle **gèle** et forme un bouchon. La machine se met à fonctionner par à-coups, puis plus du tout.",
        "Dans l'**huile**, c'est pire et c'est plus lent : l'eau et l'huile de synthèse réagissent et produisent des **acides**.",
        "Ces acides attaquent les vernis du moteur et finissent par le faire **claquer** — six mois plus tard, sans que personne fasse le lien."
      ],
      lu: "Commençons par l'eau, la plus sournoise des deux. Au détendeur, l'eau restante rencontre le point le plus froid de tout le circuit. Elle gèle, et elle forme un bouchon. La machine se met alors à fonctionner par à-coups, puis plus du tout. Mais il y a pire, et c'est beaucoup plus lent. Dans l'huile, l'eau et l'huile de synthèse réagissent ensemble et produisent des acides. Ces acides attaquent les vernis du moteur, et ils finissent par le faire claquer. Six mois plus tard, sans que personne fasse le lien avec le jour du montage.",
      plus: ["huile-acide"],
      codes: ["3.02"]
    },

    {
      id: "03-l-air",
      titre: "L'air : il ne se condense pas. Il encombre.",
      texte: [
        "L'air est un **[[incondensable|un gaz qui ne se liquéfie pas dans les conditions de la machine. Il traverse tout le circuit sans jamais changer d'état]]**.",
        "Il va donc s'accumuler **en haut du condenseur** et occuper la place réservée au fluide qui, lui, doit s'y liquéfier.",
        "Résultat : la **haute pression monte**, la température de refoulement monte, le rendement chute et le compresseur souffre.",
        "Un circuit avec de l'air, ça se voit : **la HP est anormalement haute pour la température qu'il fait dehors**."
      ],
      lu: "Passons à l'air. L'air est un incondensable : un gaz qui ne se liquéfie pas dans les conditions de la machine. Il traverse donc tout le circuit sans jamais changer d'état. Il va s'accumuler en haut du condenseur, et occuper la place réservée au fluide, qui lui doit s'y liquéfier. Le résultat est immédiat : la haute pression monte, la température de refoulement monte, le rendement chute et le compresseur souffre. Et cela se voit sur les manomètres : la haute pression est anormalement élevée pour la température qu'il fait dehors.",
      codes: ["3.02"]
    },

    {
      id: "04-le-principe",
      titre: "Le principe : sous vide, l'eau bout à froid.",
      texte: [
        "On ne peut pas « aspirer » de l'eau liquide restée dans un tube. Il faut la faire **passer en vapeur** pour que la pompe l'emporte.",
        "Or la température d'ébullition **dépend de la pression**. À la pression atmosphérique, l'eau bout à 100 °C. **Plus la pression baisse, plus elle bout froid.**",
        "En descendant assez bas, **l'eau se met à bouillir à la température de l'atelier** — et part avec l'air.",
        "**Voilà pourquoi le vide doit être profond, et pas seulement long.** Un vide médiocre n'évapore rien : il déplace de l'air, c'est tout."
      ],
      lu: "Voici le principe, et c'est le cœur du sujet. On ne peut pas aspirer de l'eau liquide restée au fond d'un tube. Il faut d'abord la faire passer en vapeur, pour que la pompe puisse l'emporter. Or la température d'ébullition dépend de la pression. À la pression atmosphérique, l'eau bout à cent degrés. Plus la pression baisse, plus elle bout froid. Et en descendant assez bas, l'eau finit par bouillir à la température même de l'atelier, et elle part avec l'air. Voilà pourquoi le vide doit être profond, et pas seulement long. Un vide médiocre n'évapore rien du tout : il déplace de l'air, c'est tout.",
      plus: ["unites"],
      codes: ["3.02"]
    },

    {
      id: "05-la-valeur",
      titre: "Ce n'est pas une durée. C'est une valeur mesurée.",
      texte: [
        "« J'ai tiré une heure » ne prouve rien : une heure sur un circuit qui fuit donne un circuit qui fuit.",
        "La cible se lit sur un **[[vacuomètre|un appareil qui mesure le vide poussé, en microns. Le manomètre basse pression de votre manifold en est incapable]]** : **en dessous de 500 microns**.",
        "Et l'on tire **par les deux côtés**, haute et basse pression, vannes du manifold ouvertes — sinon on ne fait le vide que d'une moitié du circuit.",
        "Flexibles **courts** et de **gros diamètre** : un flexible fin et long étrangle la pompe et double le temps."
      ],
      lu: "Et maintenant le point qui fait la différence entre un travail fait et un travail cru fait. Le tirage au vide ne se mesure pas en durée. J'ai tiré une heure ne prouve rien : une heure sur un circuit qui fuit vous donne un circuit qui fuit. La cible se lit sur un vacuomètre, en microns, et elle est en dessous de cinq cents microns. On tire par les deux côtés, haute et basse pression, avec les vannes du manifold ouvertes, sinon on ne fait le vide que d'une moitié du circuit. Et un dernier détail qui compte beaucoup : des flexibles courts et de gros diamètre. Un flexible fin et long étrangle la pompe et double le temps de travail.",
      plus: ["pourquoi-pas-bp", "combien-de-temps"],
      codes: ["3.02"]
    },

    {
      id: "06-remontee",
      titre: "Le vrai contrôle : on arrête la pompe et on regarde.",
      texte: [
        "Une fois la valeur atteinte, **on isole la pompe** et on laisse le circuit tranquille.",
        "**Rien ne bouge** → le circuit est sec et étanche. Vous pouvez charger.",
        "**Ça remonte puis ça se stabilise** → il reste de l'humidité qui continue de s'évaporer. On retire.",
        "**Ça remonte sans jamais s'arrêter** → ce n'est pas de l'humidité, **c'est une fuite**. Inutile de tirer plus longtemps : il faut la chercher.",
        "**Ce test-là, à lui seul, vaut toutes les durées du monde.**"
      ],
      lu: "Terminons par le geste qui décide de tout, et que trop de gens sautent. Une fois la valeur atteinte, on isole la pompe, et on laisse le circuit tranquille en regardant le vacuomètre. Trois cas. Premier cas : rien ne bouge. Le circuit est sec et étanche, vous pouvez charger. Deuxième cas : ça remonte, puis ça se stabilise à un palier. Il reste de l'humidité qui continue de s'évaporer : on retire. Troisième cas : ça remonte, et ça ne s'arrête jamais. Alors ce n'est pas de l'humidité, c'est une fuite. Inutile de tirer plus longtemps : il faut aller la chercher. Ce test à lui seul vaut toutes les durées du monde.",
      plus: ["humidite-ou-fuite", "compresseur-jamais", "azote"],
      codes: ["3.02", "3.03"]
    }
  ],

  retenir: [
    "Le vide sort **deux** intrus : l'**air** (incondensable) et l'**eau**.",
    "Sous vide, **l'eau bout à froid** : c'est ainsi qu'elle sort. D'où un vide **profond**, pas seulement long.",
    "**Cible : sous 500 microns**, au vacuomètre — jamais au manomètre BP.",
    "**Le test de remontée décide** : stable = bon · palier = humidité · montée continue = **fuite**.",
    "**Jamais** de tirage au vide avec le compresseur de la machine."
  ],

  detours: {

    "huile-acide": {
      question: "L'eau qui attaque l'huile : comment ça marche ?",
      ecrans: [
        {
          id: "d-huile-1",
          titre: "Les huiles modernes boivent l'eau.",
          texte: [
            "Les fluides sans chlore imposent des huiles de synthèse, les **[[POE|polyolesters : les huiles utilisées avec les HFC et les HFO. Elles remplacent les huiles minérales des anciens fluides]]**.",
            "Ces huiles sont **hygroscopiques** : elles **attirent et retiennent** l'humidité, bien plus que les anciennes huiles minérales.",
            "Un bidon ouvert une journée dans un atelier a déjà pris l'eau. C'est pourquoi on referme aussitôt, et qu'on ne réutilise pas un fond de bidon."
          ],
          lu: "Les fluides sans chlore ont imposé des huiles de synthèse, qu'on appelle les P O E, les polyolesters. Ces huiles ont un défaut majeur : elles sont hygroscopiques, c'est-à-dire qu'elles attirent et retiennent l'humidité, bien plus que les anciennes huiles minérales. Un bidon laissé ouvert une journée dans un atelier a déjà pris l'eau. C'est la raison pour laquelle on referme aussitôt, et qu'on ne réutilise jamais un fond de bidon qui traîne.",
          codes: ["3.02"]
        },
        {
          id: "d-huile-2",
          titre: "Eau + huile = acide. Et l'acide ne s'en va plus.",
          texte: [
            "L'eau et l'huile POE réagissent : c'est une **[[hydrolyse|la molécule d'huile est coupée par l'eau. La réaction est lente et ne s'inverse pas]]**, et elle produit des **acides organiques**.",
            "Ces acides restent dans le circuit. Ils attaquent les vernis d'isolation du bobinage.",
            "Le jour où le moteur claque, on trouve une huile brune et acide — et il faut alors **remplacer le déshydrateur, rincer, parfois tout changer**.",
            "**Le tirage au vide correct coûte une demi-heure. Cette panne-là coûte la machine.**"
          ],
          lu: "L'eau et l'huile P O E réagissent ensemble : c'est ce qu'on appelle une hydrolyse. La molécule d'huile est coupée par l'eau, la réaction est lente, et elle ne s'inverse pas. Elle produit des acides organiques, qui restent dans le circuit et attaquent les vernis d'isolation du bobinage. Le jour où le moteur claque, on retrouve une huile brune et acide, et il faut alors remplacer le déshydrateur, rincer, parfois tout changer. Faites le compte : un tirage au vide correct coûte une demi-heure. Cette panne-là coûte la machine.",
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
          texte: [
            "**1 torr = 1 mmHg = 1000 microns.** Le micron est simplement un millième de torr : on l'utilise parce que le vide utile se joue **dans les décimales du torr**.",
            "**1 mbar ≈ 750 microns.**",
            "Donc la cible de **500 microns ≈ 0,5 torr ≈ 0,67 mbar**.",
            "Et l'atmosphère, pour comparer : **760 000 microns**. On descend donc à **un millième et demi** de la pression ambiante."
          ],
          lu: "Trois échelles circulent, mais elles disent la même chose. Un torr égale un millimètre de mercure, égale mille microns. Le micron est simplement un millième de torr : on l'emploie parce que le vide utile se joue dans les décimales du torr, et qu'il est plus commode de dire cinq cents que zéro virgule cinq. Un millibar vaut environ sept cent cinquante microns. Notre cible de cinq cents microns vaut donc environ zéro virgule cinq torr, ou zéro virgule six sept millibar. Et pour vous donner l'échelle : l'atmosphère, c'est sept cent soixante mille microns. On descend donc à un millième et demi de la pression ambiante.",
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
          texte: [
            "Le manomètre basse pression du manifold descend jusqu'à **−1 bar**, et là il est **au bout de sa course**.",
            "Or **−1 bar au manomètre, c'est encore très loin du vide utile.** Toute la zone qui nous intéresse — de 5000 à 250 microns — se situe **après** cette butée.",
            "L'aiguille est donc collée en bas, immobile, aussi bien pour un circuit sec que pour un circuit trempé.",
            "**Un manomètre BP ne peut pas mentir : il n'est simplement pas fait pour ça.** Il faut un vacuomètre."
          ],
          lu: "La réponse tient en une phrase : tout le vide utile tient dans l'épaisseur de son aiguille. Le manomètre basse pression de votre manifold descend jusqu'à moins un bar, et là il est au bout de sa course. Or moins un bar au manomètre, c'est encore très loin du vide utile. Toute la zone qui nous intéresse, de cinq mille à deux cent cinquante microns, se situe après cette butée. L'aiguille est donc collée en bas, parfaitement immobile, aussi bien pour un circuit parfaitement sec que pour un circuit trempé. Le manomètre ne ment pas : il n'est simplement pas fait pour cela. Il faut un vacuomètre.",
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
          texte: [
            "La durée **dépend de tout** : longueur des lignes, volume, température de l'atelier, débit de la pompe, section des flexibles, quantité d'eau présente.",
            "Sur une petite installation propre, la valeur tombe en **quinze à vingt minutes**. Sur un circuit qui a pris l'eau, **plusieurs heures** peuvent ne pas suffire.",
            "**Une durée annoncée à l'avance ne peut donc être qu'un hasard.**",
            "*S'il fait froid dans l'atelier, l'eau s'évapore moins bien : réchauffer doucement les zones basses aide beaucoup — jamais à la flamme.*"
          ],
          lu: "La bonne réponse, c'est : jusqu'à la valeur, puis on vérifie. La durée dépend de tout : la longueur des lignes, le volume du circuit, la température de l'atelier, le débit de la pompe, la section des flexibles, et la quantité d'eau réellement présente. Sur une petite installation propre, la valeur tombe en quinze à vingt minutes. Sur un circuit qui a pris l'eau, plusieurs heures peuvent ne pas suffire. Une durée annoncée à l'avance ne peut donc être qu'un hasard. Un conseil pour finir : s'il fait froid dans l'atelier, l'eau s'évapore moins bien. Réchauffer doucement les zones basses aide beaucoup. Jamais à la flamme, bien sûr.",
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
          texte: [
            "**L'humidité** produit de la vapeur tant qu'il reste de l'eau. La pression monte, puis **ralentit et se stabilise** sur un palier : l'eau et sa vapeur se sont équilibrées.",
            "**Une fuite** fait entrer de l'atmosphère, et l'atmosphère est inépuisable. La pression monte **régulièrement, sans palier**, jusqu'à revenir à zéro relatif.",
            "D'où le geste : **ne regardez pas cinq minutes, regardez la forme de la courbe.** C'est le palier qui vous renseigne, pas la vitesse."
          ],
          lu: "La distinction est simple une fois qu'on la connaît : l'humidité s'essouffle, la fuite jamais. L'humidité produit de la vapeur tant qu'il reste de l'eau. La pression monte, puis elle ralentit, et elle se stabilise sur un palier : l'eau et sa vapeur se sont mises en équilibre. Une fuite, elle, fait entrer de l'atmosphère, et l'atmosphère est inépuisable. La pression monte alors régulièrement, sans jamais faire de palier, jusqu'à revenir à zéro. D'où le geste juste : ne regardez pas pendant cinq minutes, regardez la forme de la courbe. C'est le palier qui vous renseigne, pas la vitesse de montée.",
          codes: ["3.02", "3.03"]
        }
      ]
    },

    "compresseur-jamais": {
      question: "Peut-on faire le vide avec le compresseur de la machine ?",
      ecrans: [
        {
          id: "d-compresseur-1",
          titre: "Non. Jamais. Et voici les deux raisons.",
          texte: [
            "**Première raison, électrique.** Le moteur d'un compresseur hermétique est **refroidi par le fluide** qui le traverse. Sous vide, il n'y a plus rien pour le refroidir : il chauffe et le bobinage claque.",
            "**Seconde raison, physique.** Sous vide, un gaz devient conducteur bien plus facilement. Les bornes du moteur peuvent **amorcer un arc** à des tensions qu'elles supportent normalement sans problème.",
            "**Un compresseur n'est pas une pompe à vide.** Il n'y a pas de cas particulier, pas de « juste un peu »."
          ],
          lu: "Non. Jamais, et il y a deux raisons, l'une et l'autre suffisantes. Première raison, électrique : le moteur d'un compresseur hermétique est refroidi par le fluide qui le traverse. Sous vide, il n'y a plus rien pour le refroidir. Il chauffe, et le bobinage claque. Seconde raison, physique : sous vide, un gaz devient conducteur beaucoup plus facilement. Les bornes du moteur peuvent alors amorcer un arc électrique à des tensions qu'elles supportent normalement sans le moindre problème. Retenez la formule : un compresseur n'est pas une pompe à vide. Il n'y a pas de cas particulier, et pas de juste un peu.",
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
          codes: ["3.01", "3.02"]
        }
      ]
    }
  }
});
