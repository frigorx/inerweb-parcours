/* =====================================================================
   le-circuit.js — « Le circuit : quatre organes, deux pressions »
   ---------------------------------------------------------------------
   Redécoupage du fonds : circuit-organe-par-organe, croix-frigoriste.svg.
   Refonte 08/08/2026 : relevé Codex + doctrine § 2 « le-circuit » —
   compresseur/détendeur/évaporateur reformulés, modèle élémentaire
   annoncé, états présentés en zones, planche log p-h refaite (dôme +
   quatre transformations), plus un visuel par écran (0 écran sans
   planche). Doublon sensible/latente réduit en rappel + renvoi vers
   « la-chaleur » (doctrine § 3).

   CONVENTION ABSOLUE (F. Henninot) — la croix du frigoriste :
     détendeur À GAUCHE · compresseur À DROITE
     condenseur EN HAUT · évaporateur EN BAS
   Le condenseur est représenté par un échangeur à air simple, JAMAIS par
   une tour aéroréfrigérante. Aucune capsule ne s'écarte de cette
   disposition : c'est l'image mentale que les élèves gardent, et deux
   représentations concurrentes valent moins qu'une seule tenue partout.
   ===================================================================== */
CAPSULE({
  id: "le-circuit",
  ordre: 1,
  titre: "Le circuit : quatre organes, deux pressions",
  question: "Qu'est-ce qui se passe, et où, dans une machine frigorifique ?",
  niveau: "découverte",
  minutes: 7,
  suppose: null,
  voixFabriquee: true,   /* Henri + Denise, 06/08/2026 */

  fil: [
    {
      id: "01-la-croix",
      titre: "Quatre organes. Toujours les mêmes, toujours à la même place.",
      planche: "../fonds-origine/packs/fluides/res/svg/croix-frigoriste.svg",
      texte: [
        "Une machine frigorifique, quelle que soit sa taille, tient en **quatre organes** reliés en boucle.",
        "**Le compresseur à droite. Le condenseur en haut. Le détendeur à gauche. L'évaporateur en bas.**",
        "C'est la **croix du frigoriste**. Dessinez-la toujours ainsi : quand vous aurez une panne à analyser, c'est ce dessin-là qui vous reviendra."
      ],
      lu: "Une machine frigorifique, quelle que soit sa taille, tient en quatre organes reliés en boucle. Retenez leur place, et retenez-la une fois pour toutes. Le compresseur à droite. Le condenseur en haut. Le détendeur à gauche. L'évaporateur en bas. C'est ce qu'on appelle la croix du frigoriste. Dessinez-la toujours de cette façon : le jour où vous aurez une panne à analyser, c'est ce dessin-là qui vous reviendra en tête.",
      plus: ["pourquoi-la-croix"],
      codes: ["1.01"]
    },

    {
      id: "02-compresseur",
      titre: "Le compresseur, à droite : il fait monter la pression.",
      planche: "../fonds-origine/packs/fluides/res/svg/compresseurs.svg",
      texte: [
        "Il **aspire** de la vapeur froide à basse pression, il la **comprime**, et il la **refoule** chaude à haute pression : la pression **et** la température montent ensemble.",
        "Il **ne produit pas directement le froid** : il entretient la circulation, et il crée la différence de pression sans laquelle rien ne se passerait.",
        "Ce qu'il aspire doit être de la **vapeur**, uniquement. Un liquide ne se comprime pas : c'est le [[coup de liquide|du liquide arrive à l'aspiration et se retrouve dans le cylindre. Comme il ne se comprime pas, quelque chose casse]]."
      ],
      lu: "Commençons par le compresseur, à droite. Il aspire de la vapeur froide à basse pression, il la comprime, et il la refoule chaude à haute pression. En le traversant, la pression et la température montent ensemble. Attention à une idée fausse très répandue : le compresseur ne produit pas directement le froid. Il entretient la circulation, et il crée la différence de pression sans laquelle rien ne se passerait. Retenez aussi cette règle : ce qu'il aspire doit être de la vapeur, uniquement de la vapeur. Un liquide ne se comprime pas. S'il en arrive, c'est le coup de liquide, et quelque chose casse.",
      voixPerimee: true,
      plus: ["haute-basse"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "03-condenseur",
      titre: "Le condenseur, en haut : la chaleur sort de la machine.",
      planche: "../fonds-origine/packs/fluides/res/svg/echangeur-air.svg",
      texte: [
        "La vapeur chaude arrive. Elle cède sa chaleur à l'air extérieur et **se liquéfie**.",
        "C'est ici que **sort** toute la chaleur : celle prise dans le local, **plus** celle apportée par le compresseur.",
        "Un condenseur encrassé, et la haute pression monte aussitôt. **C'est le premier endroit qu'on regarde** quand une machine va mal."
      ],
      lu: "En haut, le condenseur. La vapeur chaude y arrive, elle cède sa chaleur à l'air extérieur, et elle se liquéfie. C'est donc ici que sort toute la chaleur de l'installation : celle qui a été prise dans le local, plus celle qu'a apportée le compresseur lui-même. Un point pratique, et il vaut de l'or : un condenseur encrassé fait monter la haute pression immédiatement. C'est le premier endroit qu'on regarde quand une machine va mal.",
      plus: ["etats"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "04-detendeur",
      titre: "Le détendeur, à gauche : la pression tombe d'un coup.",
      planche: "planches/le-circuit_detendeur.svg",
      texte: [
        "Le liquide arrive sous haute pression. Le détendeur lui impose un **passage étroit** : une forte [[perte de charge|chute de pression provoquée par le rétrécissement du passage]]. La pression **chute**.",
        "En chutant, le fluide devient capable de bouillir à basse température. Le détendeur **rend le froid possible** — il ne le fabrique pas à lui seul.",
        "Il ne se contente pas de laisser passer : il **dose le débit**. Il donne à l'évaporateur exactement ce qu'il peut évaporer, ni plus ni moins."
      ],
      lu: "À gauche, le détendeur. Le liquide y arrive sous haute pression, et le détendeur lui impose un passage très étroit : une forte perte de charge. La pression chute alors d'un coup. Et en chutant, le fluide devient capable de bouillir à basse température. Le détendeur rend donc le froid possible, mais il ne le fabrique pas à lui seul. Retenez surtout ceci : il ne se contente pas de laisser passer, il dose le débit. Il donne à l'évaporateur exactement la quantité que celui-ci peut évaporer, ni plus, ni moins.",
      voixPerimee: true,
      plus: ["etats", "dosage"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "05-evaporateur",
      titre: "L'évaporateur, en bas : le fluide y absorbe la chaleur.",
      planche: "planches/le-circuit_evaporateur.svg",
      texte: [
        "Le fluide y arrive **froid et en partie liquide**. Il **bout** en **absorbant la chaleur** du milieu à refroidir.",
        "Absorber la chaleur d'un endroit, c'est **le refroidir**. Voilà tout le métier.",
        "À la sortie, il doit être **entièrement vapeur** — et même un peu réchauffé au-delà, pour la sécurité du compresseur."
      ],
      lu: "En bas, l'évaporateur. Le fluide y arrive froid et en partie liquide, et il bout en absorbant la chaleur du milieu à refroidir. Absorber la chaleur d'un endroit, c'est tout simplement le refroidir. Voilà tout le métier, résumé en une phrase. À la sortie de l'évaporateur, le fluide doit être entièrement vapeur. Et même un peu réchauffé au-delà, pour la sécurité du compresseur.",
      voixPerimee: true,
      plus: ["etats"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "06-deux-pressions",
      titre: "Tout le circuit tient en deux pressions et deux changements d'état.",
      planche: "planches/le-circuit_deux-pressions.svg",
      texte: [
        "**Deux pressions** : la haute, du compresseur au détendeur — la basse, du détendeur au compresseur.",
        "**Deux changements d'état** : au condenseur la vapeur devient liquide ; à l'évaporateur le liquide redevient vapeur.",
        "**Deux organes seulement font la frontière** entre haute et basse pression : le **compresseur** et le **détendeur**.",
        "C'est le **modèle élémentaire**, et il suffit pour lire n'importe quelle machine. Le réel y ajoutera ensuite des [[pertes de charge|petites chutes de pression dans les tuyaux et les échangeurs]] et des zones de surchauffe et de sous-refroidissement — elles s'apprennent plus tard."
      ],
      lu: "Terminons par ce qui fait tenir tout l'ensemble. Deux pressions : la haute pression, du compresseur au détendeur ; la basse pression, du détendeur au compresseur. Deux changements d'état : au condenseur la vapeur devient liquide, à l'évaporateur le liquide redevient vapeur. Et deux organes seulement font la frontière entre la haute et la basse pression : le compresseur et le détendeur. C'est le modèle élémentaire, et il suffit pour lire n'importe quelle machine. Le réel y ajoutera ensuite des pertes de charge, et des zones de surchauffe et de sous-refroidissement. Elles s'apprennent plus tard.",
      voixPerimee: true,
      plus: ["haute-basse", "diagramme"],
      codes: ["1.01", "1.02"]
    }
  ],

  retenir: [
    "**Détendeur à gauche · compresseur à droite · condenseur en haut · évaporateur en bas.**",
    "**Deux pressions**, séparées par le **compresseur** et le **détendeur**.",
    "**Le condenseur rejette** la chaleur · **l'évaporateur l'absorbe**.",
    "Le compresseur **ne produit pas directement le froid** : il comprime et il entretient la circulation.",
    "À l'aspiration, **de la vapeur uniquement**."
  ],

  detours: {

    "pourquoi-la-croix": {
      question: "Pourquoi toujours la dessiner de la même façon ?",
      ecrans: [
        {
          id: "d-croix-1",
          titre: "Parce qu'un schéma qu'on redessine à chaque fois ne s'imprime jamais.",
          planche: "planches/le-circuit_croix-stable.svg",
          texte: [
            "La disposition n'a rien d'obligatoire physiquement : la boucle fonctionne dans n'importe quel sens.",
            "Mais **une image mentale ne se forme que si elle est toujours la même**. Le jour de la panne, vous ne réfléchissez pas : vous voyez.",
            "D'où la convention tenue partout : **détendeur à gauche, compresseur à droite, condenseur en haut, évaporateur en bas**. Sans exception, dans tous les documents."
          ],
          lu: "La disposition n'a rien d'obligatoire physiquement : la boucle fonctionne parfaitement dans n'importe quel sens de dessin. Mais une image mentale ne se forme que si elle est toujours la même. Le jour de la panne, vous ne réfléchissez pas : vous voyez le schéma. D'où la convention, tenue partout et sans exception : détendeur à gauche, compresseur à droite, condenseur en haut, évaporateur en bas.",
          codes: ["1.01"]
        }
      ]
    },

    "haute-basse": {
      question: "Haute pression, basse pression : où est exactement la frontière ?",
      ecrans: [
        {
          id: "d-hp-1",
          titre: "Deux frontières : le compresseur et le détendeur.",
          planche: "planches/le-circuit_deux-pressions.svg",
          texte: [
            "La **haute pression** commence au **refoulement du compresseur** et finit à **l'entrée du détendeur**. Elle couvre donc le condenseur.",
            "La **basse pression** commence à **la sortie du détendeur** et finit à **l'aspiration du compresseur**. Elle couvre l'évaporateur.",
            "**Le compresseur et le détendeur sont les deux frontières.** C'est le **modèle** : dans le circuit réel, les tuyaux et les échangeurs ajoutent de petites [[pertes de charge|chutes de pression dues au passage du fluide]] — mais la lecture en deux pressions reste la bonne.",
            "*Sur un manomètre, on lit la pression **relative** : zéro correspond à la pression atmosphérique, pas au vide absolu.*"
          ],
          lu: "La frontière tient en deux organes. La haute pression commence au refoulement du compresseur et finit à l'entrée du détendeur : elle couvre donc tout le condenseur. La basse pression commence à la sortie du détendeur et finit à l'aspiration du compresseur : elle couvre l'évaporateur. Le compresseur et le détendeur sont les deux frontières. C'est le modèle : dans le circuit réel, les tuyaux et les échangeurs ajoutent de petites pertes de charge, mais la lecture en deux pressions reste la bonne. Un dernier mot : sur un manomètre, vous lisez une pression relative. Le zéro correspond à la pression atmosphérique, pas au vide absolu.",
          voixPerimee: true,
          codes: ["1.02"]
        }
      ]
    },

    "etats": {
      question: "Le fluide est dans quel état, et à quel endroit ?",
      ecrans: [
        {
          id: "d-etats-1",
          titre: "Faites le tour : des zones, pas des points.",
          planche: "planches/le-circuit_etats.svg",
          texte: [
            "**Du compresseur au condenseur** : **vapeur** chaude, haute pression, [[surchauffée|plus chaude que sa température de changement d'état]].",
            "**Dans le condenseur** : zone [[diphasique|liquide et vapeur cohabitent]] de condensation, puis **liquide**, haute pression, jusqu'au détendeur.",
            "**Dans le détendeur** : la détente donne un **mélange liquide + vapeur**, froid, basse pression.",
            "**Dans l'évaporateur** : zone diphasique d'évaporation, puis **vapeur** un peu surchauffée, basse pression, jusqu'au compresseur.",
            "Des **zones**, pas des points — et c'est en changeant d'état que le fluide transporte la chaleur."
          ],
          lu: "Faisons le tour du circuit, en parlant de zones plutôt que de points. Du refoulement du compresseur jusqu'au condenseur : de la vapeur chaude, surchauffée, sous haute pression. Dans le condenseur, la vapeur se condense : liquide et vapeur cohabitent, puis le fluide sort entièrement liquide, toujours sous haute pression, jusqu'au détendeur. Dans le détendeur, la détente transforme ce liquide en un mélange de liquide et de vapeur, froid, sous basse pression. Dans l'évaporateur, ce mélange s'évapore : liquide et vapeur cohabitent à nouveau, puis le fluide sort en vapeur, un peu surchauffée, sous basse pression, jusqu'au compresseur. Retenez l'essentiel : des zones, pas des points — et c'est en changeant d'état que le fluide transporte la chaleur.",
          voixPerimee: true,
          codes: ["1.02"]
        },
        {
          id: "d-etats-2",
          titre: "Pourquoi changer d'état, et pas simplement chauffer ?",
          planche: "../fonds-origine/packs/fluides/res/svg/chaleur-sensible-latente.svg",
          texte: [
            "**Rappel** : chauffer sans changer d'état transporte peu de chaleur — c'est la chaleur **sensible**. Faire **bouillir** ou **condenser** en transporte énormément, sans que la température bouge — c'est la chaleur **latente**.",
            "**Toute la machine est bâtie là-dessus** : on ne cherche pas à chauffer le fluide, on le fait changer d'état, deux fois par tour."
          ],
          lu: "Un simple rappel ici. Chauffer un fluide sans le faire changer d'état transporte peu de chaleur : c'est la chaleur sensible. Le faire bouillir, ou le faire condenser, en transporte énormément, sans que la température bouge : c'est la chaleur latente. Toute la machine est bâtie là-dessus : on ne cherche pas à chauffer le fluide, on le fait changer d'état, deux fois par tour. Pour reprendre cette notion en entier, passez par la capsule sur la chaleur.",
          voixPerimee: true,
          renvoi: { sujet: "la-chaleur", libelle: "Revoir en entier : chaleur sensible et chaleur latente" },
          codes: ["1.02"]
        }
      ]
    },

    "dosage": {
      question: "« Le détendeur dose » : comment sait-il combien envoyer ?",
      ecrans: [
        {
          id: "d-dosage-1",
          titre: "Il écoute la sortie de l'évaporateur.",
          planche: "../fonds-origine/packs/fluides/res/svg/detendeur-regulation.svg",
          texte: [
            "Un détendeur thermostatique porte un **bulbe** posé sur la sortie de l'évaporateur.",
            "Si le fluide ressort **trop chaud**, c'est qu'il a fini de bouillir trop tôt : l'évaporateur manque de fluide. Le détendeur **ouvre**.",
            "S'il ressort **à peine réchauffé**, c'est qu'il y a trop de liquide : danger pour le compresseur. Le détendeur **ferme**.",
            "**C'est une boucle**, et elle se règle sur une grandeur précise : la **surchauffe**."
          ],
          lu: "Un détendeur thermostatique porte un bulbe, posé sur la sortie de l'évaporateur. C'est lui qui l'informe. Si le fluide ressort trop chaud, c'est qu'il a fini de bouillir trop tôt : l'évaporateur manque de fluide, et le détendeur ouvre. Si au contraire il ressort à peine réchauffé, c'est qu'il y a trop de liquide, et c'est dangereux pour le compresseur : le détendeur ferme. C'est donc une boucle de régulation, et elle se règle sur une grandeur précise, qui porte un nom : la surchauffe.",
          codes: ["1.03"]
        }
      ]
    },

    "diagramme": {
      question: "Et le fameux diagramme, il sert à quoi ?",
      ecrans: [
        {
          id: "d-diag-1",
          titre: "À voir le tour du circuit sur une seule image.",
          planche: "planches/le-circuit_logph.svg",
          texte: [
            "Le diagramme place la **pression** en hauteur et l'**énergie contenue** en largeur. Au milieu, une cloche : le [[dôme de saturation|sous le dôme, liquide et vapeur cohabitent ; à gauche du dôme tout est liquide, à droite tout est vapeur]].",
            "Le tour du circuit y dessine une figure fermée en **quatre transformations** : on **monte en oblique** au compresseur, on **va à gauche à l'horizontale** au condenseur, on **descend tout droit** au détendeur, on **revient à droite à l'horizontale** à l'évaporateur.",
            "Son intérêt : il rend **visible** ce qu'on ne peut pas voir dans les tuyaux — où l'énergie entre, où elle sort, combien il en passe.",
            "*Il s'apprend plus tard. Sachez seulement qu'il raconte exactement la même histoire que la croix.*"
          ],
          lu: "Le diagramme place la pression en hauteur, et l'énergie contenue par le fluide en largeur. Au milieu se dresse une cloche : le dôme de saturation. À sa gauche, tout est liquide. À sa droite, tout est vapeur. Et dessous, les deux cohabitent. Le tour du circuit y dessine une figure fermée, en quatre transformations. On monte en oblique au compresseur. On va vers la gauche, à l'horizontale, au condenseur. On descend tout droit au détendeur. Et on revient vers la droite, à l'horizontale, à l'évaporateur. Son intérêt est là : il rend visible ce que vous ne pouvez pas voir dans les tuyaux. Où l'énergie entre, où elle sort, et combien il en passe. Il s'apprend plus tard, et tranquillement. Sachez seulement, pour l'instant, qu'il raconte exactement la même histoire que la croix du frigoriste.",
          voixPerimee: true,
          codes: ["1.02"]
        }
      ]
    }
  }
});
