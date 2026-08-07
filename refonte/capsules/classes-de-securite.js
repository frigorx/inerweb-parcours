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
      texte: [
        "**A** — toxicité **faible**. C'est le cas de la très grande majorité des fluides que vous rencontrerez.",
        "**B** — toxicité **plus élevée**. Le plus connu est l'ammoniac, le **R-717**.",
        "Attention au mot « faible ». **A ne veut pas dire inoffensif** : un fluide A remplit un local et chasse l'oxygène tout aussi bien qu'un autre."
      ],
      lu: "Commençons par la lettre. Il n'y en a que deux. A : toxicité faible. C'est le cas de la très grande majorité des fluides que vous rencontrerez en atelier. B : toxicité plus élevée. Le plus connu est l'ammoniac, le R sept cent dix-sept. Mais attention au mot faible. A ne veut pas dire inoffensif. Un fluide classé A remplit un local et chasse l'oxygène tout aussi bien qu'un autre.",
      plus: ["a-inoffensif"],
      codes: ["1.09"]
    },

    {
      id: "03-le-chiffre",
      verifier: [
        "Les quatre niveaux **1 / 2L / 2 / 3** et leur libellé. À confirmer.",
      ],
      titre: "Le chiffre : 1, 2L, 2 ou 3. C'est le feu.",
      texte: [
        "**1** — **pas de propagation de flamme** dans l'air. Le fluide ne brûle pas.",
        "**2L** — **faiblement** inflammable. Il brûle, mais la flamme se propage lentement.",
        "**2** — inflammable.",
        "**3** — **hautement** inflammable. Là, on est dans le domaine du gaz de camping."
      ],
      lu: "Passons au chiffre. Il y a quatre niveaux. Un : pas de propagation de flamme dans l'air. Le fluide ne brûle pas. Deux L : faiblement inflammable. Il brûle, mais la flamme se propage lentement. Le L veut dire faible, en anglais low. Deux, tout court : inflammable. Et trois : hautement inflammable. Là, on est dans le domaine du gaz de camping.",
      plus: ["le-2l-exactement", "lie"],
      codes: ["1.09"]
    },

    {
      id: "04-on-lit",
      verifier: [
        "Les classes citées : **R-134a A1 · R-744 A1 · R-32 A2L · R-717 B2L**. À vérifier une par une.",
      ],
      titre: "On lit ensemble.",
      texte: [
        "**R-134a = A1** — peu toxique, ne brûle pas. Le fluide « tranquille ».",
        "**R-744 (CO₂) = A1** — même classe. Et pourtant il travaille à 100 bar.",
        "**R-32 = A2L** — peu toxique, brûle lentement. C'est la classe de la plupart des fluides récents.",
        "**R-717 (ammoniac) = B2L** — **les deux à la fois** : plus toxique, et faiblement inflammable."
      ],
      lu: "Lisons-en quelques-unes ensemble. R cent trente-quatre a : A un. Peu toxique, ne brûle pas. C'est le fluide tranquille. R sept cent quarante-quatre, le C O deux : A un également. Et pourtant il travaille à cent bars. R trente-deux : A deux L. Peu toxique, brûle lentement. C'est la classe de la plupart des fluides récents. Et l'ammoniac, R sept cent dix-sept : B deux L. Les deux à la fois, plus toxique et faiblement inflammable.",
      plus: ["co2-a1", "ammoniac"],
      codes: ["1.09", "1.07"]
    },

    {
      id: "05-le-piege",
      verifier: [
        "🔴 **R-290 = A3 et R-600a = A3.** Point central de la capsule.",
      ],
      titre: "Le piège : le R-290 n'est PAS A2L. Il est A3.",
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
      texte: [
        "La classe décide de **combien** vous pouvez mettre dans un local.",
        "Elle décide de **quel outillage** vous avez le droit de sortir : point chaud, détecteur, appareil électrique.",
        "Elle décide de **comment vous ventilez** et de ce que vous faites en cas de fuite.",
        "**Lire la classe est le premier geste de sécurité**, avant même d'ouvrir la mallette."
      ],
      lu: "Terminons par l'essentiel. La classe de sécurité n'est pas une information administrative. Elle décide de combien de fluide vous pouvez mettre dans un local donné. Elle décide de l'outillage que vous avez le droit de sortir : un point chaud, un détecteur, un appareil électrique. Elle décide de la façon dont vous ventilez, et de ce que vous faites en cas de fuite. Lire la classe, c'est le premier geste de sécurité, avant même d'ouvrir la mallette.",
      plus: ["charge-limite", "geste-a3"],
      codes: ["1.09", "2.03"]
    }
  ],

  retenir: [
    "**La lettre = le poison** (A faible, B plus élevée) · **le chiffre = le feu** (1, 2L, 2, 3).",
    "**R-290 et R-600a sont A3**, hautement inflammables. Jamais A2L.",
    "**A ne veut pas dire inoffensif** : tout fluide chasse l'oxygène d'un local.",
    "La classe commande la **charge maximale**, l'**outillage** et la **ventilation**."
  ],

  detours: {

    "qui-decide": {
      question: "Qui décide de la classe, et peut-elle changer ?",
      ecrans: [
        {
          id: "d-qui-1",
          titre: "Un classement mesuré, pas négocié.",
          texte: [
            "La classe est attribuée par la norme **ASHRAE 34** à partir de deux mesures : la **concentration à partir de laquelle le fluide devient dangereux à respirer**, et son **comportement au feu**.",
            "La norme européenne **NF EN 378** reprend ce classement et en tire les règles d'installation.",
            "Elle **peut** évoluer quand un fluide est remesuré — c'est ce qui a donné naissance à la classe **2L**, qui n'existait pas avant l'arrivée des fluides à faible effet de serre."
          ],
          lu: "La classe n'est pas une opinion du fabricant. Elle est attribuée par la norme ASHRAE trente-quatre, à partir de deux mesures : la concentration à partir de laquelle le fluide devient dangereux à respirer, et son comportement au feu. La norme européenne NF E N trois cent soixante-dix-huit reprend ce classement et en tire les règles d'installation. Et oui, elle peut évoluer : c'est ainsi qu'est née la classe deux L, qui n'existait pas avant l'arrivée des fluides à faible effet de serre.",
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
          planche: "../fonds-origine/packs/fluides/res/svg/secu-espace-clos.svg",
          texte: [
            "Les fluides frigorigènes sont **plus lourds que l'air**. Ils s'accumulent **en bas** : fosse, cave, local technique, sous une machine.",
            "Ils ne sentent rien et ne se voient pas. Ils **prennent la place de l'oxygène**.",
            "L'accident type n'est pas un empoisonnement : c'est une **asphyxie**, souvent doublée d'une chute. Et le sauveteur qui descend sans protection devient la deuxième victime."
          ],
          lu: "Non, et c'est un contresens qui tue. Les fluides frigorigènes sont plus lourds que l'air. Ils s'accumulent en bas : dans une fosse, une cave, un local technique, sous une machine. Ils ne sentent rien, ils ne se voient pas, et ils prennent tout simplement la place de l'oxygène. L'accident type n'est donc pas un empoisonnement, c'est une asphyxie, souvent doublée d'une chute. Et celui qui descend porter secours sans protection devient la deuxième victime.",
          codes: ["2.03"]
        },
        {
          id: "d-tox-2",
          verifier: [
            "🔴 **Décomposition thermique produisant de l'acide fluorhydrique**, et la règle « on ne braze jamais sur un circuit sous fluide ». Formulation à valider.",
          ],
          titre: "Et à la chaleur, un fluide « A » devient autre chose.",
          texte: [
            "Chauffé par une flamme ou une surface très chaude, un fluide fluoré **se décompose**.",
            "Il produit alors des composés **franchement agressifs**, dont de l'**[[acide fluorhydrique|un acide qui attaque les voies respiratoires et les yeux. Son odeur piquante est le signal d'alerte — mais elle arrive après l'exposition]]**.",
            "C'est la raison pour laquelle **on ne braze jamais sur un circuit sous fluide**, quelle que soit sa classe."
          ],
          lu: "Il y a un second point, moins connu. Chauffé par une flamme ou une surface très chaude, un fluide fluoré se décompose. Il produit alors des composés franchement agressifs, dont de l'acide fluorhydrique, qui attaque les voies respiratoires et les yeux. Vous sentirez une odeur piquante, mais elle arrive après l'exposition. C'est exactement pour cette raison qu'on ne braze jamais sur un circuit contenant du fluide, quelle que soit sa classe de sécurité.",
          codes: ["2.03"]
        }
      ]
    },

    "le-2l-exactement": {
      question: "Le « 2L », c'est vraiment moins dangereux que le « 2 » ?",
      ecrans: [
        {
          id: "d-2l-1",
          verifier: [
            "**Vitesse de propagation de flamme inférieure à 10 cm/s** pour la classe 2L. Valeur à confirmer.",
          ],
          titre: "La flamme avance lentement. Voilà tout ce que dit le L.",
          texte: [
            "Un fluide **2L** a une **vitesse de propagation de flamme inférieure à 10 cm par seconde**. C'est la définition, et c'est une mesure.",
            "Concrètement : il faut une source d'allumage **franche et entretenue** pour que ça prenne, et le front de flamme progresse lentement.",
            "**Mais 2L brûle.** Ce n'est pas « presque 1 ». C'est un fluide inflammable dont on a mesuré qu'il est le moins vif de sa catégorie."
          ],
          lu: "Le L veut dire faible, et il correspond à une mesure précise : un fluide deux L a une vitesse de propagation de flamme inférieure à dix centimètres par seconde. Concrètement, il faut une source d'allumage franche et entretenue pour que ça prenne, et le front de flamme progresse lentement. Mais retenez bien ceci : deux L brûle. Ce n'est pas presque un. C'est un fluide inflammable dont on a mesuré qu'il est le moins vif de sa catégorie.",
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
          verifier: [
            "**« Sur un fluide A3, on ne branche ni ne débranche rien d'électrique dans le local »** — formulation absolue. Trop raide, ou juste ?",
          ],
          titre: "D'où vient le danger : une fuite traverse la fourchette.",
          texte: [
            "Au moment de la fuite, la concentration part de zéro et **monte**. Elle **traverse forcément la zone dangereuse**.",
            "Plus tard, en ventilant, elle redescend — et **la retraverse**.",
            "C'est pourquoi on **ventile avant** d'intervenir et pourquoi le détecteur se promène **en bas**, là où le fluide s'accumule.",
            "Et c'est pourquoi, sur un fluide A3, **on ne branche ni ne débranche rien d'électrique** dans le local."
          ],
          lu: "Et voici d'où vient le danger réel. Au moment d'une fuite, la concentration part de zéro et elle monte. Elle traverse donc forcément la zone dangereuse. Plus tard, quand vous ventilez, elle redescend, et elle la retraverse. C'est pour cela qu'on ventile avant d'intervenir, et que le détecteur se promène en bas, là où le fluide s'accumule. Et c'est pour cela que sur un fluide A trois, on ne branche ni ne débranche rien d'électrique dans le local.",
          codes: ["2.03"]
        }
      ]
    },

    "charge-limite": {
      question: "Pourquoi limite-t-on la charge dans un local ?",
      ecrans: [
        {
          id: "d-charge-1",
          verifier: [
            "🔴 **Le calcul de charge limite** : masse rapportée au volume du local, comparée à un seuil d'asphyxie (A1) ou à une **fraction de la LIE** (inflammables). Méthode à valider — faut-il donner les valeurs chiffrées ?",
          ],
          titre: "Parce que la question est : « et si tout sortait d'un coup ? »",
          planche: "../fonds-origine/packs/fluides/res/svg/charge-limite-local.svg",
          texte: [
            "La règle raisonne sur le **pire cas** : la totalité de la charge se répand dans le local.",
            "On compare alors la masse de fluide au **volume de la pièce**. Cela donne une concentration.",
            "Cette concentration doit rester **sous le seuil** propre au fluide — seuil d'asphyxie pour un A1, **fraction de la LIE** pour un fluide inflammable.",
            "**Conséquence pratique : le même appareil peut être autorisé dans un grand atelier et interdit dans un petit local technique.**"
          ],
          lu: "La règle raisonne toujours sur le pire cas : la totalité de la charge se répand d'un coup dans le local. On compare alors la masse de fluide au volume de la pièce, ce qui donne une concentration. Et cette concentration doit rester sous le seuil propre au fluide : seuil d'asphyxie pour un A un, et une fraction seulement de la L I E pour un fluide inflammable. La conséquence pratique est importante : le même appareil peut être parfaitement autorisé dans un grand atelier, et interdit dans un petit local technique.",
          codes: ["1.09", "2.03"]
        }
      ]
    },

    "co2-a1": {
      question: "Le CO₂ est classé A1. Il est donc sans danger ?",
      ecrans: [
        {
          id: "d-co2-1",
          verifier: [
            "**Givre carbonique à −78 °C** et l'idée que le CO₂ est **asphyxiant à plus faible concentration** que les autres. À confirmer.",
          ],
          titre: "A1 ne dit rien de la pression. Et le CO₂ travaille très haut.",
          texte: [
            "Le **R-744** ne brûle pas et n'est pas très toxique : d'où le **A1**.",
            "Mais il travaille à des pressions **sans commune mesure** avec les autres fluides, et il peut faire du **[[givre carbonique|du CO₂ solide, à −78 °C. Une détente brutale en produit, et il brûle la peau au contact]]** en se détendant.",
            "Il est aussi **asphyxiant à faible concentration**, plus vite que la plupart des autres.",
            "**La classe de sécurité ne couvre que le poison et le feu.** La pression, le froid, l'asphyxie sont d'autres risques, à évaluer séparément."
          ],
          lu: "Voilà une bonne question, et sa réponse éclaire toute la logique du classement. Le R sept cent quarante-quatre ne brûle pas et n'est pas très toxique : c'est pour cela qu'il est A un. Mais il travaille à des pressions sans commune mesure avec les autres fluides, et une détente brutale produit du givre carbonique, du C O deux solide à moins soixante-dix-huit degrés, qui brûle la peau au contact. Il est aussi asphyxiant à faible concentration, plus vite que la plupart des autres. Retenez donc ceci : la classe de sécurité ne couvre que le poison et le feu. La pression, le froid et l'asphyxie sont d'autres risques, à évaluer séparément.",
          codes: ["1.07", "1.09"]
        }
      ]
    },

    "ammoniac": {
      question: "B2L : pourquoi l'ammoniac est-il à part ?",
      ecrans: [
        {
          id: "d-nh3-1",
          verifier: [
            "**Ammoniac : B2L, plus léger que l'air, odeur perceptible bien avant le seuil de danger.** À confirmer.",
          ],
          titre: "Toxique et inflammable — mais il prévient.",
          texte: [
            "Le **R-717** est le seul fluide courant classé **B** : sa toxicité est réelle, et à faible concentration.",
            "Il est aussi **2L** : il brûle, lentement.",
            "Sa particularité : **il se sent**. Son odeur est insupportable **bien avant** d'être dangereuse — c'est un avertisseur que les fluides fluorés n'ont pas.",
            "Il est **plus léger que l'air** : il monte, quand les autres descendent.",
            "*Vous n'interviendrez pas dessus en A1/A2 : il relève d'installations et d'habilitations spécifiques. Sachez le situer.*"
          ],
          lu: "L'ammoniac, le R sept cent dix-sept, est le seul fluide courant classé B : sa toxicité est réelle, et à faible concentration. Il est aussi deux L, donc il brûle lentement. Mais il a une particularité précieuse : il se sent. Son odeur est insupportable bien avant d'être dangereuse. C'est un avertisseur naturel que les fluides fluorés n'ont pas. Autre différence : il est plus léger que l'air, il monte, quand tous les autres descendent. Vous n'interviendrez pas dessus dans les catégories A un et A deux : il relève d'installations et d'habilitations spécifiques. Sachez simplement le situer.",
          codes: ["1.07", "1.09"]
        }
      ]
    },

    "geste-a3": {
      question: "Concrètement, qu'est-ce qui change devant une machine A3 ?",
      ecrans: [
        {
          id: "d-a3-1",
          verifier: [
            "🔴 **« Un détecteur pour fluides fluorés ne voit pas le R-290. »** Affirmation forte — exacte pour tous les types de détecteurs ?",
          ],
          titre: "Aucune source d'allumage. Aucune, pas « le moins possible ».",
          planche: "../fonds-origine/packs/fluides/res/svg/secu-flamme.svg",
          texte: [
            "**Pas de flamme.** Ni brasage, ni chalumeau, ni cigarette dehors devant la porte ouverte.",
            "**Pas d'étincelle.** On ne branche pas, on ne débranche pas, on ne coupe pas un disjoncteur dans le local pendant l'intervention.",
            "**Outillage prévu pour**, détecteur adapté aux hydrocarbures — un détecteur pour fluides fluorés **ne voit pas** le R-290.",
            "**Ventilation d'abord**, récupération ensuite, et jamais de purge à l'atmosphère dans un local."
          ],
          lu: "Devant une machine au R deux cent quatre-vingt-dix, la règle est simple à énoncer et absolue : aucune source d'allumage. Aucune, pas le moins possible. Pas de flamme : ni brasage, ni chalumeau, ni cigarette dehors devant la porte ouverte. Pas d'étincelle : on ne branche pas, on ne débranche pas, on ne coupe pas un disjoncteur dans le local pendant l'intervention. Un outillage prévu pour, et un détecteur adapté aux hydrocarbures : un détecteur pour fluides fluorés ne voit pas le R deux cent quatre-vingt-dix. Et enfin : ventilation d'abord, récupération ensuite, et jamais de purge à l'atmosphère dans un local.",
          codes: ["2.03", "1.09"]
        }
      ]
    }
  }
});
