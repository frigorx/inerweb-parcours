/* =====================================================================
   classes-de-securite.js — « A1, A2L, A3 : lire l'étiquette »
   ---------------------------------------------------------------------
   Redécoupage du fonds : cours-classes-securite + classes-securite.svg
   + lie-domaine.svg + charge-limite-local.svg.

   POURQUOI CE SUJET EN DEUXIÈME
   C'est le plus exigible et le plus dangereux à moitié savoir. Le tuto
   d'origine mélangeait la lecture de l'étiquette, la chimie de la
   combustion, les charges limites et l'ammoniac dans un seul fil. Ici le
   fil ne fait qu'une chose : apprendre à LIRE les deux caractères. Tout
   le reste — et notamment ce qui touche à la sécurité du geste — est en
   détour, ce qui permet de le développer vraiment au lieu de l'effleurer.

   LE PIÈGE CENTRAL, tenu dans le fil et non en détour : le R-290 est
   A3, pas A2L. C'est l'erreur la plus fréquente, et celle qui coûte le
   plus cher.

   Passe de correction du 08/08/2026 (doctrine + relevé Codex) :
   reformulations métier § 2, un visuel par écran, verifier soldés.
   ===================================================================== */
CAPSULE({
  id: "classes-de-securite",
  ordre: 6,
  titre: "A1, A2L, A3 : lire l'étiquette",
  question: "Deux caractères sur la bouteille — que disent-ils vraiment ?",
  niveau: "métier",
  minutes: 7,
  suppose: "Lire le code d'un fluide",
  voixFabriquee: true,   /* Henri + Denise, fabriquées le 06/08/2026 */

  fil: [
    {
      id: "01-etiquette",
      titre: "À côté du nom, deux caractères. Ils ne sont pas décoratifs.",
      planche: "../fonds-origine/packs/fluides/res/svg/classes-securite.svg",
      alt: "Tableau des classes en huit cases : deux lignes, A et B, pour la toxicité ; quatre colonnes, 1, 2L, 2 et 3, pour l'inflammabilité. Chaque fluide occupe une case du tableau.",
      texte: [
        "Sur l'étiquette : **R-134a — A1**. Sur une autre : **R-32 — A2L**. Sur une troisième : **R-290 — A3**.",
        "Ces deux caractères sont la **classe de sécurité**. Elle est donnée par la norme **[[NF EN 378|la norme européenne de sécurité des installations frigorifiques. Elle reprend le classement de la norme américaine ASHRAE 34]]**.",
        "Une lettre, puis un chiffre. **La lettre parle du poison. Le chiffre parle du feu.**"
      ],
      lu: "Regardez une étiquette de bouteille. À côté du nom, il y a deux caractères. R cent trente-quatre a, A un. R trente-deux, A deux L. R deux cent quatre-vingt-dix, A trois. Ces deux caractères, c'est la classe de sécurité, donnée par la norme NF E N trois cent soixante-dix-huit. Retenez tout de suite la logique : une lettre, puis un chiffre. La lettre parle du poison. Le chiffre parle du feu.",
      plus: ["qui-decide"],
      codes: ["1.09"]
    },

    {
      id: "02-la-lettre",
      titre: "La lettre : A ou B. C'est la toxicité.",
      planche: "planches/classes-de-securite_lettre-toxicite.svg",
      texte: [
        "**A** — toxicité **plus faible**. C'est le cas de la très grande majorité des fluides que vous rencontrerez.",
        "**B** — toxicité **plus élevée**. Le plus connu est l'ammoniac, le **R-717**.",
        "Ce qui sépare A de B : la **[[limite d'exposition|la concentration dans l'air au-dessous de laquelle on peut travailler sans effet sur la santé. Plus elle est basse, plus le fluide est toxique]]**. Jamais « A = sans danger », jamais « B = poison ».",
        "Attention au mot « plus faible ». **A ne veut pas dire inoffensif** : un fluide A remplit un local et chasse l'oxygène tout aussi bien qu'un autre."
      ],
      lu: "Commençons par la lettre. Il n'y en a que deux. A : toxicité plus faible. C'est le cas de la très grande majorité des fluides que vous rencontrerez en atelier. B : toxicité plus élevée. Le plus connu est l'ammoniac, le R sept cent dix-sept. Ce qui sépare A de B, c'est la limite d'exposition : la concentration dans l'air au-dessous de laquelle on peut travailler sans effet sur la santé. Jamais A égale sans danger, jamais B égale poison. Et attention au mot plus faible : A ne veut pas dire inoffensif. Un fluide classé A remplit un local et chasse l'oxygène tout aussi bien qu'un autre.",
      voixPerimee: true,
      plus: ["a-inoffensif"],
      codes: ["1.09"]
    },

    {
      id: "03-le-chiffre",
      titre: "Le chiffre : 1, 2L, 2 ou 3. C'est le feu.",
      planche: "planches/classes-de-securite_chiffre-feu.svg",
      texte: [
        "**1** — **pas de propagation de flamme** dans l'air. Le fluide ne brûle pas.",
        "**2L** — **faiblement** inflammable : vitesse de combustion **au plus 10 cm par seconde** (≤ 10 cm/s). **Il reste inflammable.**",
        "**2** — inflammable.",
        "**3** — **hautement** inflammable. Là, on est dans le domaine du gaz de camping."
      ],
      lu: "Passons au chiffre. Il y a quatre niveaux. Un : pas de propagation de flamme dans l'air. Le fluide ne brûle pas. Deux L : faiblement inflammable. Sa vitesse de combustion est d'au plus dix centimètres par seconde. Le L veut dire faible, en anglais low. Mais il reste inflammable. Deux, tout court : inflammable. Et trois : hautement inflammable. Là, on est dans le domaine du gaz de camping.",
      voixPerimee: true,
      plus: ["le-2l-exactement", "lie"],
      codes: ["1.09"]
    },

    {
      id: "04-on-lit",
      titre: "On lit ensemble.",
      planche: "planches/classes-de-securite_quatre-exemples.svg",
      texte: [
        "**R-134a = A1** — peu toxique, ne brûle pas. Le fluide « tranquille ».",
        "**R-744 (CO₂) = A1** — même classe. Et pourtant il travaille à des pressions de l'ordre de **100 bar**.",
        "**R-32 = A2L** — peu toxique, brûle lentement. C'est la classe de la plupart des fluides récents.",
        "**R-717 (ammoniac) = B2L** — **les deux à la fois** : plus toxique, et faiblement inflammable.",
        "**La classe ne résume pas tous les dangers** : la pression du R-744, par exemple, n'y figure pas."
      ],
      lu: "Lisons-en quelques-unes ensemble. R cent trente-quatre a : A un. Peu toxique, ne brûle pas. C'est le fluide tranquille. R sept cent quarante-quatre, le C O deux : A un également. Et pourtant il travaille à des pressions de l'ordre de cent bars. R trente-deux : A deux L. Peu toxique, brûle lentement. C'est la classe de la plupart des fluides récents. Et l'ammoniac, R sept cent dix-sept : B deux L. Les deux à la fois, plus toxique et faiblement inflammable. Retenez déjà ceci : la classe ne résume pas tous les dangers. La pression du C O deux, par exemple, n'y figure pas.",
      voixPerimee: true,
      plus: ["co2-a1", "ammoniac"],
      codes: ["1.09", "1.07"]
    },

    {
      id: "05-le-piege",
      titre: "Le piège : le R-290 n'est PAS A2L. Il est A3.",
      planche: "planches/classes-de-securite_piege-a3.svg",
      texte: [
        "Le **R-290, c'est du propane**. Le même gaz que la bouteille de camping.",
        "Beaucoup le classent A2L parce qu'il est « écologique » et « moderne ». **C'est faux, et c'est dangereux.** Il est **A3 : hautement inflammable.**",
        "Le **R-600a**, l'isobutane des réfrigérateurs, est **A3** lui aussi.",
        "**Un fluide naturel n'est pas un fluide doux.** Se tromper ici, c'est ouvrir un circuit au chalumeau à côté."
      ],
      lu: "Et maintenant le piège, celui qui revient le plus souvent, à l'examen comme sur le chantier. Le R deux cent quatre-vingt-dix, c'est du propane. Exactement le même gaz que la bouteille de camping. Beaucoup le classent A deux L parce qu'on le présente comme écologique et moderne. C'est faux, et c'est dangereux. Le R deux cent quatre-vingt-dix est A trois : hautement inflammable. Le R six cents a, l'isobutane des réfrigérateurs, est A trois lui aussi. Retenez la phrase : un fluide naturel n'est pas un fluide doux.",
      plus: ["lie", "charge-limite"],
      codes: ["1.09", "1.07"]
    },

    {
      id: "06-ce-que-ca-change",
      titre: "Ce n'est pas une étiquette. C'est votre méthode de travail.",
      planche: "planches/classes-de-securite_classe-methode.svg",
      texte: [
        "La classe pèse sur **combien** vous pouvez mettre dans un local.",
        "Elle pèse sur **quel outillage** vous avez le droit de sortir : point chaud, détecteur, appareil électrique.",
        "Elle pèse sur **comment vous ventilez** et sur ce que vous faites en cas de fuite.",
        "Mais la classe ne décide pas **seule** : la **notice** de l'appareil et les règles applicables au local précisent charge, outillage et ventilation.",
        "**Lire la classe est le premier geste de sécurité**, avant même d'ouvrir la mallette."
      ],
      lu: "Terminons par l'essentiel. La classe de sécurité n'est pas une information administrative. Elle pèse sur la quantité de fluide que vous pouvez mettre dans un local donné. Elle pèse sur l'outillage que vous avez le droit de sortir : un point chaud, un détecteur, un appareil électrique. Elle pèse sur la façon dont vous ventilez, et sur ce que vous faites en cas de fuite. Mais la classe ne décide pas seule : la notice de l'appareil et les règles applicables au local précisent la charge, l'outillage et la ventilation. Lire la classe, c'est le premier geste de sécurité, avant même d'ouvrir la mallette.",
      voixPerimee: true,
      plus: ["charge-limite", "geste-a3"],
      codes: ["1.09", "2.03"]
    }
  ],

  retenir: [
    "**La lettre = le poison** (A plus faible, B plus élevée, selon la limite d'exposition) · **le chiffre = le feu** (1, 2L, 2, 3).",
    "**R-290 et R-600a sont A3**, hautement inflammables. Jamais A2L.",
    "**A ne veut pas dire inoffensif** : tout fluide chasse l'oxygène d'un local.",
    "La classe pèse sur la **charge**, l'**outillage** et la **ventilation** — avec la notice et les règles du local."
  ],

  detours: {

    "qui-decide": {
      question: "Qui décide de la classe, et peut-elle changer ?",
      ecrans: [
        {
          id: "d-qui-1",
          titre: "Un classement mesuré, pas négocié.",
          planche: "planches/classes-de-securite_ashrae-en378.svg",
          texte: [
            "La classe est attribuée par la norme **ASHRAE 34** à partir de deux mesures : la **concentration à partir de laquelle le fluide devient dangereux à respirer**, et son **comportement au feu**.",
            "La norme européenne **NF EN 378** reprend ce classement et **encadre l'application** : c'est elle qui en tire les règles d'installation.",
            "Le classement **peut évoluer** quand un fluide est remesuré. La classe **2L**, plus récente que les trois autres, s'est ajoutée au tableau : les classes ne sont pas gravées pour toujours."
          ],
          lu: "La classe n'est pas une opinion du fabricant. Elle est attribuée par la norme ASHRAE trente-quatre, à partir de deux mesures : la concentration à partir de laquelle le fluide devient dangereux à respirer, et son comportement au feu. La norme européenne NF E N trois cent soixante-dix-huit reprend ce classement et encadre son application : c'est elle qui en tire les règles d'installation. Et le classement peut évoluer quand un fluide est remesuré. La classe deux L, plus récente que les trois autres, s'est ajoutée au tableau : les classes ne sont pas gravées pour toujours.",
          voixPerimee: true,
          codes: ["1.09"]
        }
      ]
    },

    "a-inoffensif": {
      question: "« Toxicité faible » : je peux donc respirer sans risque ?",
      ecrans: [
        {
          id: "d-tox-1",
          titre: "Non. Ce qui tue le plus souvent, ce n'est pas le poison.",
          planche: "../fonds-origine/packs/fluides/res/svg/s1-double-accident.svg",
          texte: [
            "**La plupart** des fluides fluorés sont **plus lourds que l'air**, invisibles et sans odeur. Ils s'accumulent **en bas** : fosse, cave, local technique, sous une machine.",
            "L'ammoniac, lui, est **plus léger** et **s'annonce à l'odeur** — c'est l'exception, pas la règle générale.",
            "Ces fluides **prennent la place de l'oxygène**. L'accident type n'est pas un empoisonnement : c'est une **asphyxie**, souvent doublée d'une chute. Et le sauveteur qui descend sans protection devient la deuxième victime.",
            "La règle, elle, ne change pas : **ventiler, mesurer l'atmosphère, ne jamais entrer seul.**"
          ],
          lu: "Non, et c'est un contresens qui tue. La plupart des fluides fluorés sont plus lourds que l'air, invisibles et sans odeur. Ils s'accumulent en bas : dans une fosse, une cave, un local technique, sous une machine. L'ammoniac, lui, est plus léger et s'annonce à l'odeur : c'est l'exception, pas la règle générale. Ces fluides prennent la place de l'oxygène. L'accident type n'est donc pas un empoisonnement, c'est une asphyxie, souvent doublée d'une chute. Et celui qui descend porter secours sans protection devient la deuxième victime. La règle, elle, ne change pas : ventiler, mesurer l'atmosphère, et ne jamais entrer seul.",
          voixPerimee: true,
          codes: ["2.03"]
        },
        {
          id: "d-tox-2",
          titre: "Et à la chaleur, un fluide « A » devient autre chose.",
          planche: "planches/classes-de-securite_decomposition-hf.svg",
          texte: [
            "Chauffé par une flamme ou une surface très chaude, un fluide fluoré **se décompose**.",
            "Il se forme alors des produits **très toxiques et corrosifs**, dont le **[[fluorure d'hydrogène|HF : un gaz qui attaque les voies respiratoires, les yeux et la peau]]** (HF).",
            "Son odeur piquante **n'est pas une protection** : quand vous la sentez, l'exposition a déjà commencé.",
            "C'est la raison pour laquelle **on ne brase jamais un circuit contenant du fluide**, quelle que soit sa classe."
          ],
          lu: "Il y a un second point, moins connu. Chauffé par une flamme ou une surface très chaude, un fluide fluoré se décompose. Il se forme alors des produits très toxiques et corrosifs, dont le fluorure d'hydrogène, le H F, qui attaque les voies respiratoires, les yeux et la peau. Son odeur piquante n'est pas une protection : quand vous la sentez, l'exposition a déjà commencé. C'est exactement pour cette raison qu'on ne brase jamais un circuit contenant du fluide, quelle que soit sa classe de sécurité.",
          voixPerimee: true,
          codes: ["2.03"]
        }
      ]
    },

    "le-2l-exactement": {
      question: "Le « 2L », c'est vraiment moins dangereux que le « 2 » ?",
      ecrans: [
        {
          id: "d-2l-1",
          titre: "La flamme avance lentement. Voilà tout ce que dit le L.",
          planche: "planches/classes-de-securite_vitesse-flamme.svg",
          texte: [
            "Un fluide **2L** a une **vitesse de combustion d'au plus 10 cm par seconde** (≤ 10 cm/s). C'est la définition, et c'est une mesure.",
            "Concrètement : le front de flamme **progresse lentement**. C'est ce qui distingue le 2L du 2 et du 3.",
            "**Mais 2L brûle.** Ce n'est pas « presque 1 ». C'est un fluide inflammable dont on a mesuré qu'il est le moins vif de sa catégorie."
          ],
          lu: "Le L veut dire faible, et il correspond à une mesure précise : un fluide deux L a une vitesse de combustion d'au plus dix centimètres par seconde. Concrètement, le front de flamme progresse lentement. C'est ce qui distingue le deux L du deux et du trois. Mais retenez bien ceci : deux L brûle. Ce n'est pas presque un. C'est un fluide inflammable dont on a mesuré qu'il est le moins vif de sa catégorie.",
          voixPerimee: true,
          codes: ["1.09"]
        }
      ]
    },

    "lie": {
      question: "La LIE, dont tout le monde parle : c'est quoi ?",
      ecrans: [
        {
          id: "d-lie-1",
          titre: "Ni trop peu, ni trop : le feu a besoin du bon dosage.",
          planche: "../fonds-origine/packs/fluides/res/svg/lie-domaine.svg",
          alt: "La planche montre aussi l'explosimètre : il affiche la concentration mesurée en pourcentage de la LIE, pas en pourcentage de gaz dans l'air.",
          texte: [
            "Un mélange gaz-air ne brûle que dans une **fourchette** de concentration.",
            "En dessous de la **LIE** — limite inférieure d'explosivité — il y a trop peu de gaz : ça ne prend pas.",
            "Au-dessus de la **LSE** — limite supérieure — il y a trop peu d'air : ça ne prend pas non plus.",
            "**Entre les deux, la moindre étincelle suffit.**"
          ],
          lu: "Voici une idée simple et qui sauve. Un mélange de gaz et d'air ne brûle que dans une fourchette de concentration. En dessous de la limite inférieure d'explosivité, la L I E, il y a trop peu de gaz : ça ne prend pas. Au-dessus de la limite supérieure, il y a trop peu d'air : ça ne prend pas non plus. Mais entre les deux, la moindre étincelle suffit.",
          codes: ["1.09", "2.03"]
        },
        {
          id: "d-lie-2",
          titre: "D'où vient le danger : une fuite traverse la fourchette.",
          planche: "planches/classes-de-securite_fuite-traverse.svg",
          texte: [
            "Au moment de la fuite, la concentration part de zéro et **monte**. Elle **traverse forcément la zone dangereuse**.",
            "Plus tard, en ventilant, elle redescend — et **la retraverse**.",
            "C'est pourquoi on **ventile avant** d'intervenir et pourquoi le détecteur se promène **en bas**, là où le fluide s'accumule.",
            "Face à un fluide inflammable, la méthode : **supprimer les sources d'inflammation, [[consigner|couper et condamner l'alimentation électrique, pour que personne ne puisse la remettre pendant l'intervention]], ventiler, évaluer la zone, utiliser le matériel adapté.**"
          ],
          lu: "Et voici d'où vient le danger réel. Au moment d'une fuite, la concentration part de zéro et elle monte. Elle traverse donc forcément la zone dangereuse. Plus tard, quand vous ventilez, elle redescend, et elle la retraverse. C'est pour cela qu'on ventile avant d'intervenir, et que le détecteur se promène en bas, là où le fluide s'accumule. Face à un fluide inflammable, la méthode tient en cinq gestes : supprimer les sources d'inflammation, consigner, ventiler, évaluer la zone, et utiliser le matériel adapté.",
          voixPerimee: true,
          codes: ["2.03"]
        }
      ]
    },

    "charge-limite": {
      question: "Pourquoi limite-t-on la charge dans un local ?",
      ecrans: [
        {
          id: "d-charge-1",
          titre: "Parce que la question est : « et si tout sortait d'un coup ? »",
          planche: "planches/classes-de-securite_charge-en378.svg",
          texte: [
            "La règle raisonne sur le **pire cas** : la totalité de la charge se répand dans le local.",
            "La **charge admissible** est encadrée par la norme **NF EN 378**. Elle dépend de **cinq choses à la fois** : le **fluide**, le **local**, son **occupation**, le **type de système** et les **mesures de réduction du risque**.",
            "Il n'y a **aucune formule simplifiée** à retenir en consigne : la réponse se lit sur la **plaque**, dans la **notice** et dans l'**étude applicable**, avec la **validation du responsable**.",
            "**Conséquence pratique : le même appareil peut être autorisé dans un grand atelier et interdit dans un petit local technique.**"
          ],
          lu: "La règle raisonne toujours sur le pire cas : la totalité de la charge se répand d'un coup dans le local. La charge admissible est encadrée par la norme NF E N trois cent soixante-dix-huit, et elle dépend de cinq choses à la fois : le fluide, le local, son occupation, le type de système, et les mesures de réduction du risque. Il n'y a donc aucune formule simplifiée à retenir : la réponse se lit sur la plaque, dans la notice et dans l'étude applicable, avec la validation du responsable. La conséquence pratique reste la même : le même appareil peut être parfaitement autorisé dans un grand atelier, et interdit dans un petit local technique.",
          voixPerimee: true,
          codes: ["1.09", "2.03"]
        }
      ]
    },

    "co2-a1": {
      question: "Le CO₂ est classé A1. Il est donc sans danger ?",
      ecrans: [
        {
          id: "d-co2-1",
          titre: "A1 ne dit rien de la pression. Et le CO₂ travaille très haut.",
          planche: "planches/classes-de-securite_co2-risques.svg",
          texte: [
            "Le **R-744** ne brûle pas et n'est pas très toxique : d'où le **A1**.",
            "Mais il travaille à des pressions **sans commune mesure** avec les autres fluides, et une détente brutale produit de la **[[neige carbonique|du CO₂ solide, vers −78,5 °C. Elle brûle la peau au contact]]**.",
            "Il est aussi **physiologiquement actif** : il ne se contente pas de chasser l'oxygène, il **agit lui-même sur l'organisme** dès que sa concentration monte.",
            "**La classe de sécurité ne couvre que le poison et le feu.** La pression, le froid, l'asphyxie sont d'autres risques, à évaluer séparément."
          ],
          lu: "Voilà une bonne question, et sa réponse éclaire toute la logique du classement. Le R sept cent quarante-quatre ne brûle pas et n'est pas très toxique : c'est pour cela qu'il est A un. Mais il travaille à des pressions sans commune mesure avec les autres fluides, et une détente brutale produit de la neige carbonique, du C O deux solide vers moins soixante-dix-huit virgule cinq degrés, qui brûle la peau au contact. Il est aussi physiologiquement actif : il ne se contente pas de chasser l'oxygène, il agit lui-même sur l'organisme dès que sa concentration monte. Retenez donc ceci : la classe de sécurité ne couvre que le poison et le feu. La pression, le froid et l'asphyxie sont d'autres risques, à évaluer séparément.",
          voixPerimee: true,
          codes: ["1.07", "1.09"]
        }
      ]
    },

    "ammoniac": {
      question: "B2L : pourquoi l'ammoniac est-il à part ?",
      ecrans: [
        {
          id: "d-nh3-1",
          titre: "Toxique et inflammable. Son odeur : un indice, pas une protection.",
          planche: "../fonds-origine/packs/fluides/res/svg/co2-nh3-compare.svg",
          alt: "Deux colonnes comparées : à gauche, le CO₂, plus lourd que l'air, descend et ne se sent pas ; à droite, l'ammoniac, plus léger, monte et se sent — l'odeur ne remplace aucune mesure d'atmosphère.",
          texte: [
            "Le **R-717** est le seul fluide courant classé **B** : sa toxicité est réelle, et à faible concentration.",
            "Il est aussi **2L** : il brûle, lentement.",
            "Sa particularité : **il se sent**. Son odeur est un **indice précoce** — jamais une **protection**, jamais un **moyen de mesure**. Seul un appareil mesure l'atmosphère.",
            "Il est **plus léger que l'air** : il monte, quand les autres descendent.",
            "*Vous n'interviendrez pas dessus en A1/A2 : il relève d'installations et d'habilitations spécifiques. Sachez le situer.*"
          ],
          lu: "L'ammoniac, le R sept cent dix-sept, est le seul fluide courant classé B : sa toxicité est réelle, et à faible concentration. Il est aussi deux L, donc il brûle lentement. Sa particularité : il se sent. Son odeur est un indice précoce, mais jamais une protection, et jamais un moyen de mesure : seul un appareil mesure l'atmosphère. Autre différence : il est plus léger que l'air, il monte, quand tous les autres descendent. Vous n'interviendrez pas dessus dans les catégories A un et A deux : il relève d'installations et d'habilitations spécifiques. Sachez simplement le situer.",
          voixPerimee: true,
          codes: ["1.07", "1.09"]
        }
      ]
    },

    "geste-a3": {
      question: "Concrètement, qu'est-ce qui change devant une machine A3 ?",
      ecrans: [
        {
          id: "d-a3-1",
          titre: "Aucune source d'allumage. Aucune, pas « le moins possible ».",
          planche: "../fonds-origine/packs/fluides/res/svg/secu-flamme.svg",
          alt: "La planche montre le cas voisin du brasage d'un circuit au fluide fluoré : gaz toxiques à la chaleur, balayage à l'azote. Pour un A3, le principe est le même : aucune flamme, aucune source d'allumage.",
          texte: [
            "**Pas de flamme.** Ni brasage, ni chalumeau, ni cigarette dehors devant la porte ouverte.",
            "**Pas d'étincelle.** On ne branche pas, on ne débranche pas, on ne coupe pas un disjoncteur dans le local pendant l'intervention.",
            "La consignation s'est faite **avant, hors du local** : pendant l'intervention, on ne manœuvre plus rien d'électrique dans le local.",
            "**Outillage prévu pour**, et le bon appareil de détection : un **[[détecteur halogène|le détecteur électronique classique du frigoriste, conçu pour repérer les fluides fluorés]]** est fait pour les fluides fluorés — pour le R-290, il faut un **détecteur de gaz combustibles adapté**.",
            "**Ventilation d'abord**, récupération ensuite, et jamais de purge à l'atmosphère dans un local."
          ],
          lu: "Devant une machine au R deux cent quatre-vingt-dix, la règle est simple à énoncer et absolue : aucune source d'allumage. Aucune, pas le moins possible. Pas de flamme : ni brasage, ni chalumeau, ni cigarette dehors devant la porte ouverte. Pas d'étincelle : on ne branche pas, on ne débranche pas, on ne coupe pas un disjoncteur dans le local pendant l'intervention. La consignation s'est faite avant, hors du local : pendant l'intervention, on ne manœuvre plus rien d'électrique dans le local. Un outillage prévu pour, et le bon appareil de détection : un détecteur halogène est fait pour les fluides fluorés. Pour le R deux cent quatre-vingt-dix, il faut un détecteur de gaz combustibles adapté. Et enfin : ventilation d'abord, récupération ensuite, et jamais de purge à l'atmosphère dans un local.",
          voixPerimee: true,
          codes: ["2.03", "1.09"]
        }
      ]
    }
  }
});
