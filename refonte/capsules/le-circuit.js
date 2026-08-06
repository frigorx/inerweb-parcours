/* =====================================================================
   le-circuit.js — « Le circuit : quatre organes, deux pressions »
   ---------------------------------------------------------------------
   Redécoupage du fonds : circuit-organe-par-organe, croix-frigoriste.svg.

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
        "Il **aspire** de la vapeur froide à basse pression, et il la **refoule** chaude à haute pression.",
        "Il ne fabrique pas de froid. **Il fait circuler**, et il crée la différence de pression sans laquelle rien ne se passerait.",
        "Ce qu'il aspire doit être de la **vapeur**, uniquement. Un liquide ne se comprime pas : c'est le [[coup de liquide|du liquide arrive à l'aspiration et se retrouve dans le cylindre. Comme il ne se comprime pas, quelque chose casse]]."
      ],
      lu: "Commençons par le compresseur, à droite. Il aspire de la vapeur froide à basse pression, et il la refoule chaude à haute pression. Attention à une idée fausse très répandue : le compresseur ne fabrique pas de froid. Il fait circuler le fluide, et il crée la différence de pression sans laquelle rien ne se passerait. Retenez aussi cette règle : ce qu'il aspire doit être de la vapeur, uniquement de la vapeur. Un liquide ne se comprime pas. S'il en arrive, c'est le coup de liquide, et quelque chose casse.",
      verifier: [
        "**« Le compresseur ne fabrique pas de froid, il fait circuler. »** Formulation à valider — est-ce ainsi que vous l'introduisez ?",
      ],
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
      texte: [
        "Le liquide arrive sous haute pression. Le détendeur le laisse passer par un **passage étroit** : la pression **chute**.",
        "En chutant, le fluide devient capable de bouillir à basse température. **C'est là que le froid devient possible.**",
        "Le détendeur ne se contente pas de laisser passer : il **dose**. Il donne à l'évaporateur exactement ce qu'il peut évaporer, ni plus ni moins."
      ],
      lu: "À gauche, le détendeur. Le liquide y arrive sous haute pression, et le détendeur le laisse passer par un passage très étroit. La pression chute alors d'un coup. Et en chutant, le fluide devient capable de bouillir à basse température. C'est exactement là que le froid devient possible. Mais retenez surtout ceci : le détendeur ne se contente pas de laisser passer, il dose. Il donne à l'évaporateur exactement la quantité que celui-ci peut évaporer, ni plus, ni moins.",
      plus: ["etats", "dosage"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "05-evaporateur",
      titre: "L'évaporateur, en bas : c'est ici qu'on fait du froid.",
      texte: [
        "Le fluide y arrive **froid et en partie liquide**. Il **bout** en prenant la chaleur du local.",
        "Prendre de la chaleur à un endroit, c'est **le refroidir**. Voilà tout le métier.",
        "À la sortie, il doit être **entièrement vapeur** — et même un peu réchauffé au-delà, pour la sécurité du compresseur."
      ],
      lu: "En bas, l'évaporateur, et c'est ici qu'on fait du froid. Le fluide y arrive froid et en partie liquide. Il bout en prenant la chaleur du local. Et prendre de la chaleur à un endroit, c'est tout simplement le refroidir. Voilà tout le métier, résumé en une phrase. À la sortie de l'évaporateur, le fluide doit être entièrement vapeur. Et même un peu réchauffé au-delà, pour la sécurité du compresseur.",
      plus: ["etats"],
      codes: ["1.01", "1.02"]
    },

    {
      id: "06-deux-pressions",
      titre: "Tout le circuit tient en deux pressions et deux changements d'état.",
      texte: [
        "**Deux pressions** : la haute, du compresseur au détendeur — la basse, du détendeur au compresseur.",
        "**Deux changements d'état** : au condenseur la vapeur devient liquide ; à l'évaporateur le liquide redevient vapeur.",
        "**Deux organes seulement font la frontière** entre haute et basse pression : le **compresseur** et le **détendeur**.",
        "Si vous tenez ces trois phrases, vous pouvez lire n'importe quelle machine."
      ],
      lu: "Terminons par ce qui fait tenir tout l'ensemble. Deux pressions : la haute pression, du compresseur au détendeur ; la basse pression, du détendeur au compresseur. Deux changements d'état : au condenseur la vapeur devient liquide, à l'évaporateur le liquide redevient vapeur. Et deux organes seulement font la frontière entre la haute et la basse pression : le compresseur et le détendeur. Si vous tenez ces trois phrases, vous pouvez lire n'importe quelle machine, quelle que soit sa taille.",
      plus: ["haute-basse", "diagramme"],
      codes: ["1.01", "1.02"]
    }
  ],

  retenir: [
    "**Détendeur à gauche · compresseur à droite · condenseur en haut · évaporateur en bas.**",
    "**Deux pressions**, séparées par le **compresseur** et le **détendeur**.",
    "**Le condenseur rejette** la chaleur · **l'évaporateur la prend**.",
    "Le compresseur **ne fabrique pas de froid** : il fait circuler et il comprime.",
    "À l'aspiration, **de la vapeur uniquement**."
  ],

  detours: {

    "pourquoi-la-croix": {
      question: "Pourquoi toujours la dessiner de la même façon ?",
      ecrans: [
        {
          id: "d-croix-1",
          titre: "Parce qu'un schéma qu'on redessine à chaque fois ne s'imprime jamais.",
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
          titre: "Deux points, et deux seulement.",
          planche: "../fonds-origine/packs/fluides/res/svg/pression-absolue-relative.svg",
          texte: [
            "La **haute pression** commence au **refoulement du compresseur** et finit à **l'entrée du détendeur**. Elle couvre donc le condenseur.",
            "La **basse pression** commence à **la sortie du détendeur** et finit à **l'aspiration du compresseur**. Elle couvre l'évaporateur.",
            "**Le compresseur et le détendeur sont les deux frontières.** Partout ailleurs, la pression ne change presque pas.",
            "*Sur un manomètre, on lit la pression **relative** : zéro correspond à la pression atmosphérique, pas au vide absolu.*"
          ],
          lu: "La frontière tient en deux points, et deux seulement. La haute pression commence au refoulement du compresseur et finit à l'entrée du détendeur : elle couvre donc tout le condenseur. La basse pression commence à la sortie du détendeur et finit à l'aspiration du compresseur : elle couvre l'évaporateur. Le compresseur et le détendeur sont les deux frontières, et partout ailleurs la pression ne change presque pas. Un dernier mot : sur un manomètre, vous lisez une pression relative. Le zéro correspond à la pression atmosphérique, pas au vide absolu.",
          verifier: [
            "**Les limites exactes de la HP et de la BP.** Faut-il préciser les pertes de charge dans les lignes, ou est-ce trop tôt à ce niveau ?",
          ],
          codes: ["1.02"]
        }
      ]
    },

    "etats": {
      question: "Le fluide est dans quel état, et à quel endroit ?",
      ecrans: [
        {
          id: "d-etats-1",
          titre: "Faites le tour : liquide en haut à gauche, vapeur en bas à droite.",
          texte: [
            "**Sortie condenseur → détendeur** : **liquide**, chaud, sous haute pression.",
            "**Sortie détendeur → évaporateur** : **mélange liquide + vapeur**, froid, sous basse pression.",
            "**Sortie évaporateur → compresseur** : **vapeur** froide, basse pression.",
            "**Sortie compresseur → condenseur** : **vapeur** très chaude, haute pression.",
            "Deux côtés liquides, deux côtés vapeur — et c'est en changeant d'état que le fluide transporte la chaleur."
          ],
          lu: "Faisons le tour du circuit en nommant l'état à chaque fois. Entre la sortie du condenseur et le détendeur : du liquide, chaud, sous haute pression. Entre la sortie du détendeur et l'évaporateur : un mélange de liquide et de vapeur, froid, sous basse pression. Entre la sortie de l'évaporateur et le compresseur : de la vapeur froide, sous basse pression. Et entre la sortie du compresseur et le condenseur : de la vapeur très chaude, sous haute pression. Retenez l'essentiel : c'est en changeant d'état, et seulement ainsi, que le fluide transporte la chaleur.",
          verifier: [
            "**L'état du fluide aux quatre points du circuit.** À vérifier terme à terme.",
          ],
          codes: ["1.02"]
        },
        {
          id: "d-etats-2",
          titre: "Pourquoi changer d'état, et pas simplement chauffer ?",
          planche: "../fonds-origine/packs/fluides/res/svg/chaleur-sensible-latente.svg",
          texte: [
            "Chauffer un liquide **sans le faire bouillir** transporte peu de chaleur : c'est la chaleur **sensible**, celle qui fait monter le thermomètre.",
            "Le faire **bouillir** en transporte énormément **sans que la température bouge** : c'est la chaleur **latente**.",
            "**Toute la machine est bâtie là-dessus.** On ne cherche pas à chauffer le fluide : on le fait changer d'état, deux fois par tour."
          ],
          lu: "Voici la raison profonde du fonctionnement, et elle mérite deux minutes. Chauffer un liquide sans le faire bouillir transporte assez peu de chaleur : c'est ce qu'on appelle la chaleur sensible, celle qui fait monter le thermomètre. En revanche, le faire bouillir en transporte énormément, et sans que la température bouge : c'est la chaleur latente. Toute la machine frigorifique est bâtie là-dessus. On ne cherche pas à chauffer le fluide, on le fait changer d'état, deux fois par tour.",
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
          planche: "../fonds-origine/packs/fluides/res/svg/diagramme-logph.svg",
          texte: [
            "Le diagramme place la **pression** en hauteur et l'**énergie contenue** en largeur.",
            "Le tour du circuit y dessine une figure fermée : on **monte** au compresseur, on **va à gauche** au condenseur, on **descend** au détendeur, on **revient à droite** à l'évaporateur.",
            "Son intérêt : il rend **visible** ce qu'on ne peut pas voir dans les tuyaux — où l'énergie entre, où elle sort, combien il en passe.",
            "*Il s'apprend plus tard. Sachez seulement qu'il raconte exactement la même histoire que la croix.*"
          ],
          lu: "Le diagramme place la pression en hauteur, et l'énergie contenue par le fluide en largeur. Le tour du circuit y dessine alors une figure fermée : on monte au compresseur, on va vers la gauche au condenseur, on descend au détendeur, et on revient vers la droite à l'évaporateur. Son intérêt est là : il rend visible ce que vous ne pouvez pas voir dans les tuyaux. Où l'énergie entre, où elle sort, et combien il en passe. Il s'apprend plus tard, et tranquillement. Sachez seulement, pour l'instant, qu'il raconte exactement la même histoire que la croix du frigoriste.",
          codes: ["1.02"]
        }
      ]
    }
  }
});
