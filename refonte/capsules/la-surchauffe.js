/* =====================================================================
   la-surchauffe.js — « La surchauffe : la mesurer, la comprendre »
   ---------------------------------------------------------------------
   Redécoupage du fonds : evaporateur-interactif, mesure-surchauffe.svg,
   surchauffe-utile-totale.svg, lecture-table.svg.

   POURQUOI CE SUJET
   C'est la grandeur que tout le monde mesure et que beaucoup calculent
   de travers — parce qu'elle demande DEUX lectures et une soustraction,
   et que l'une des deux lectures se fait dans une table, pas sur un
   appareil.

   Le fil ne fait qu'une chose : poser le calcul et ce qu'il veut dire.
   La distinction utile / totale, le placement de la sonde et le cas des
   zéotropes sont en détour — ce sont de vraies questions de praticien,
   mais elles noient le débutant si elles arrivent trop tôt.
   ===================================================================== */
CAPSULE({
  id: "la-surchauffe",
  ordre: 4,
  titre: "La surchauffe : la mesurer, la comprendre",
  question: "Deux lectures et une soustraction — mais lesquelles, et pourquoi ?",
  niveau: "métier",
  minutes: 8,
  suppose: "Le circuit : quatre organes, deux pressions",
  voixFabriquee: true,   /* Henri + Denise, 06/08/2026 */

  fil: [
    {
      id: "01-a-quoi-ca-sert",
      titre: "Une vapeur qui n'est plus en train de bouillir.",
      planche: "../fonds-origine/packs/fluides/res/svg/mesure-surchauffe.svg",
      texte: [
        "Dans l'évaporateur, tant qu'il reste du liquide, la vapeur produite reste **exactement à la température d'ébullition**. Elle ne peut pas monter plus haut.",
        "Dès que **la dernière goutte** a disparu, la vapeur peut enfin **se réchauffer**.",
        "**Ce réchauffement au-delà de l'ébullition, c'est la surchauffe.** Sa seule présence prouve une chose capitale : **il n'y a plus de liquide**."
      ],
      lu: "Commençons par ce que la surchauffe veut dire, avant de la calculer. Dans l'évaporateur, tant qu'il reste du liquide, la vapeur produite reste exactement à la température d'ébullition. Elle ne peut pas monter plus haut, c'est physiquement impossible. Mais dès que la dernière goutte a disparu, la vapeur peut enfin se réchauffer. Ce réchauffement au-delà de l'ébullition, c'est la surchauffe. Et sa seule présence prouve une chose capitale : il n'y a plus de liquide.",
      plus: ["pourquoi-pas-liquide"],
      codes: ["1.03"]
    },

    {
      id: "02-le-calcul",
      titre: "Le calcul : une température mesurée moins une température lue.",
      texte: [
        "**Première valeur** — la température du tube à la sortie de l'évaporateur. Vous la **mesurez** avec une sonde de contact.",
        "**Deuxième valeur** — la température à laquelle le fluide bout **à la pression qui règne là**. Vous ne la mesurez pas : vous la **lisez** dans la table du fluide, à partir de la pression au manomètre.",
        "**Surchauffe = température mesurée − température lue.**",
        "Elle s'exprime en **kelvins (K)**, parce que c'est un **écart** et non une température."
      ],
      lu: "Passons au calcul. Il vous faut deux valeurs. Première valeur : la température du tube à la sortie de l'évaporateur. Celle-là, vous la mesurez, avec une sonde de contact. Deuxième valeur : la température à laquelle le fluide bout à la pression qui règne à cet endroit. Celle-là, vous ne la mesurez pas, vous la lisez dans la table du fluide, à partir de la pression indiquée par votre manomètre. La surchauffe, c'est la première moins la seconde. Et elle s'exprime en kelvins, parce que c'est un écart, et non une température.",
      verifier: [
        "🔴 **La méthode de calcul** : température mesurée à la sortie de l'évaporateur moins température de saturation lue à la pression. Est-ce bien ainsi que vous la posez en formation ?",
        "**L'unité en kelvins** parce qu'il s'agit d'un écart. Point pédagogique à valider.",
      ],
      plus: ["lire-la-table", "zeotrope"],
      codes: ["1.03", "1.04"]
    },

    {
      id: "03-un-exemple",
      titre: "Un exemple, en entier.",
      texte: [
        "Sortie d'évaporateur : la sonde indique **+2 °C**.",
        "Le manomètre BP donne une pression à laquelle la table du fluide indique une ébullition à **−5 °C**.",
        "**Surchauffe = 2 − (−5) = 7 K.**",
        "Attention au signe : la température de saturation est souvent **négative**, et soustraire un nombre négatif **augmente** le résultat. C'est là que se font la plupart des erreurs."
      ],
      lu: "Prenons un exemple complet. À la sortie de l'évaporateur, votre sonde indique plus deux degrés. Votre manomètre basse pression, lui, donne une pression à laquelle la table du fluide indique une ébullition à moins cinq degrés. La surchauffe vaut donc deux moins moins cinq, c'est-à-dire sept kelvins. Attention au signe, c'est là que se font la plupart des erreurs : la température de saturation est souvent négative, et soustraire un nombre négatif augmente le résultat.",
      codes: ["1.03", "1.04"]
    },

    {
      id: "04-trop-peu",
      titre: "Trop peu de surchauffe : le compresseur est en danger.",
      texte: [
        "Une surchauffe **très faible ou nulle** veut dire que le fluide **n'a pas fini de bouillir** dans l'évaporateur.",
        "Donc du **liquide continue vers le compresseur**. Et un liquide **ne se comprime pas**.",
        "Les conséquences vont du **retour d'huile perturbé** à la **casse mécanique franche**.",
        "**Une surchauffe nulle n'est jamais un bon réglage.** C'est une alarme."
      ],
      lu: "Voyons maintenant ce que la valeur vous dit. Une surchauffe très faible, ou nulle, signifie que le fluide n'a pas fini de bouillir dans l'évaporateur. Donc du liquide continue son chemin vers le compresseur. Et un liquide ne se comprime pas. Les conséquences vont du retour d'huile perturbé jusqu'à la casse mécanique franche. Retenez bien ceci : une surchauffe nulle n'est jamais un bon réglage. C'est une alarme.",
      plus: ["pourquoi-pas-liquide"],
      codes: ["1.03", "1.05"]
    },

    {
      id: "05-trop",
      titre: "Trop de surchauffe : vous perdez de la puissance.",
      texte: [
        "Une surchauffe **élevée** veut dire que le fluide a fini de bouillir **bien avant** la sortie.",
        "Toute la fin de l'évaporateur ne contient plus que de la vapeur : elle **ne produit plus de froid**, ou presque. Vous avez payé un échangeur que vous n'utilisez pas.",
        "Et la vapeur arrive **plus chaude** au compresseur, qui refoule **plus chaud** encore.",
        "**Trop, c'est du rendement perdu. Trop peu, c'est de la casse.** Le réglage vit entre les deux."
      ],
      lu: "À l'inverse, une surchauffe élevée signifie que le fluide a fini de bouillir bien avant la sortie. Toute la fin de l'évaporateur ne contient donc plus que de la vapeur, et elle ne produit plus de froid, ou presque : vous avez payé un échangeur que vous n'utilisez pas entièrement. De plus, la vapeur arrive plus chaude au compresseur, qui refoule plus chaud encore. Résumons : trop de surchauffe, c'est du rendement perdu ; trop peu, c'est de la casse. Le bon réglage vit entre les deux.",
      plus: ["quelle-valeur"],
      codes: ["1.03", "1.05"]
    },

    {
      id: "06-regler",
      titre: "Régler : un peu, puis attendre.",
      texte: [
        "On agit sur la vis du détendeur thermostatique. **Un tour est déjà beaucoup.**",
        "Après chaque retouche, **attendez que l'installation se stabilise** avant de relire : la boucle met plusieurs minutes à répondre.",
        "**L'erreur classique** : retoucher, relire aussitôt, retoucher encore. On poursuit une valeur qui n'a pas fini de bouger, et on finit très loin du but.",
        "Notez la valeur de départ **avant** de toucher à quoi que ce soit. Elle vous permet de revenir en arrière."
      ],
      lu: "Terminons par le geste. On agit sur la vis du détendeur thermostatique, et un tour est déjà beaucoup. Après chaque retouche, attendez que l'installation se stabilise avant de relire : la boucle met plusieurs minutes à répondre. L'erreur classique, c'est de retoucher, relire aussitôt, et retoucher encore. Vous poursuivez alors une valeur qui n'a pas fini de bouger, et vous finissez très loin du but. Un dernier conseil, tout simple : notez la valeur de départ avant de toucher à quoi que ce soit. Elle vous permettra de revenir en arrière.",
      verifier: [
        "**« Un tour est déjà beaucoup »** et **le temps de stabilisation** avant relecture. Faut-il donner un ordre de grandeur en minutes ?",
      ],
      plus: ["quelle-valeur", "sous-refroidissement"],
      codes: ["1.03", "3.04"]
    }
  ],

  retenir: [
    "**Surchauffe = température mesurée à la sortie − température de saturation lue à la pression.**",
    "Elle **prouve qu'il n'y a plus de liquide** à la sortie de l'évaporateur.",
    "**Trop peu → coup de liquide** · **trop → puissance perdue**.",
    "On règle **doucement**, et on **attend** avant de relire.",
    "Sur un **zéotrope**, la température de saturation se lit sur la **rosée**."
  ],

  detours: {

    "pourquoi-pas-liquide": {
      question: "Pourquoi le liquide est-il si dangereux pour le compresseur ?",
      ecrans: [
        {
          id: "d-liq-1",
          titre: "Parce qu'un liquide ne se laisse pas écraser.",
          texte: [
            "Un gaz se comprime : son volume diminue, et le piston peut finir sa course.",
            "Un liquide, non. **Il ne cède pas.** Si le cylindre en contient et que le piston monte, quelque chose doit rompre : le clapet, la bielle, la culasse.",
            "Même sans casse immédiate, le liquide **lave l'huile** des parois et **dilue le carter**. L'usure s'accélère, silencieusement.",
            "**C'est pour cela que la surchauffe existe** : elle est la marge de sécurité qui garantit qu'il n'arrive que de la vapeur."
          ],
          lu: "La raison est mécanique et elle est simple. Un gaz se comprime : son volume diminue, et le piston peut finir sa course sans problème. Un liquide, lui, ne cède pas. Si le cylindre en contient et que le piston monte, quelque chose doit rompre : le clapet, la bielle, ou la culasse. Et même sans casse immédiate, le liquide lave l'huile des parois et dilue le carter. L'usure s'accélère alors, silencieusement. Voilà pourquoi la surchauffe existe : elle est la marge de sécurité qui garantit qu'il n'arrive que de la vapeur au compresseur.",
          codes: ["1.05"]
        }
      ]
    },

    "lire-la-table": {
      question: "Lire une température de saturation : comment on fait ?",
      ecrans: [
        {
          id: "d-table-1",
          titre: "La pression sur une ligne, la température au bout.",
          planche: "../fonds-origine/packs/fluides/res/svg/lecture-table.svg",
          texte: [
            "Chaque fluide a **sa** table : à une pression donnée correspond **une** température d'ébullition, et une seule.",
            "Vous lisez la pression sur le manomètre BP, vous entrez dans la table de **votre** fluide, vous sortez la température.",
            "**Deux pièges.** Utiliser la table d'un autre fluide donne un résultat faux mais crédible — c'est l'erreur qui ne se voit pas.",
            "Et vérifier que la table et le manomètre parlent de la **même** pression : relative ou absolue, pas l'une pour l'autre."
          ],
          lu: "Chaque fluide possède sa propre table. À une pression donnée correspond une température d'ébullition, une seule. Le geste est donc simple : vous lisez la pression sur le manomètre basse pression, vous entrez dans la table de votre fluide, et vous sortez la température. Deux pièges, cependant. Premier piège : utiliser la table d'un autre fluide. Le résultat est faux, mais parfaitement crédible, et c'est l'erreur qui ne se voit pas. Second piège : vérifiez que la table et le manomètre parlent bien de la même pression, relative ou absolue, et pas l'une pour l'autre.",
          verifier: [
            "**Le risque de confondre pression relative et absolue** entre le manomètre et la table. Est-ce un piège réel sur le matériel que vous utilisez ?",
          ],
          codes: ["1.04"]
        }
      ]
    },

    "zeotrope": {
      question: "Et si le fluide est un mélange à glissement ?",
      ecrans: [
        {
          id: "d-zeo-1",
          titre: "Deux colonnes dans la table : prenez la rosée.",
          texte: [
            "Un mélange **zéotrope** (séries 400) n'a pas **une** température d'ébullition mais **deux** : celle du début, dite **bulle**, et celle de la fin, dite **rosée**.",
            "La surchauffe se mesure **après** la fin de l'ébullition. C'est donc la **rosée** qu'il faut prendre.",
            "Le **sous-refroidissement**, lui, se mesure après la fin de la condensation : c'est la **bulle**.",
            "**Se tromper de colonne fausse le réglage** de plusieurs kelvins — et ce sont justement les kelvins qui comptent."
          ],
          lu: "Un mélange zéotrope, c'est-à-dire de la série quatre cents, n'a pas une température d'ébullition mais deux : celle du début, qu'on appelle la bulle, et celle de la fin, qu'on appelle la rosée. Or la surchauffe se mesure après la fin de l'ébullition. C'est donc la rosée qu'il faut prendre. Le sous-refroidissement, lui, se mesure après la fin de la condensation : c'est alors la bulle. Et se tromper de colonne fausse le réglage de plusieurs kelvins. Or ce sont justement ces kelvins-là qui comptent.",
          verifier: [
            "🔴 **Surchauffe sur la ROSÉE, sous-refroidissement sur la BULLE.** Même affirmation que dans la capsule « Lire le code » — à confirmer une fois pour les deux.",
          ],
          codes: ["1.06", "1.04"]
        }
      ]
    },

    "quelle-valeur": {
      question: "Quelle valeur viser, concrètement ?",
      ecrans: [
        {
          id: "d-valeur-1",
          titre: "Un ordre de grandeur, et surtout : ce que dit le constructeur.",
          texte: [
            "Sur un évaporateur à détente directe, on rencontre couramment une surchauffe de l'ordre de **5 à 8 K**.",
            "Mais cette fourchette n'est **qu'un repère**. Elle dépend du type d'évaporateur, du fluide, du régime, de l'application.",
            "**La référence, c'est la documentation de la machine.** Un ordre de grandeur sert à repérer une valeur aberrante, pas à régler.",
            "*Une surchauffe de 25 K ou de 0 K se voit immédiatement comme anormale : c'est à cela que sert le repère.*"
          ],
          lu: "Sur un évaporateur à détente directe, on rencontre couramment une surchauffe de l'ordre de cinq à huit kelvins. Mais attention, cette fourchette n'est qu'un repère. Elle dépend du type d'évaporateur, du fluide, du régime de fonctionnement et de l'application. La véritable référence, c'est la documentation de la machine. Un ordre de grandeur ne sert pas à régler, il sert à repérer une valeur aberrante. Une surchauffe de vingt-cinq kelvins, ou de zéro, se voit immédiatement comme anormale : c'est exactement à cela qu'il sert.",
          verifier: [
            "🔴 **La fourchette 5 à 8 K.** Est-ce l'ordre de grandeur que vous enseignez ? Faut-il la garder, l'élargir, ou la retirer et ne renvoyer qu'à la documentation ?",
          ],
          codes: ["1.03", "3.04"]
        }
      ]
    },

    "sous-refroidissement": {
      question: "Le sous-refroidissement, c'est la même idée à l'envers ?",
      ecrans: [
        {
          id: "d-sr-1",
          titre: "Oui — mais au condenseur, et sur du liquide.",
          texte: [
            "Après le condenseur, le fluide est **liquide**. S'il continue de se refroidir au-delà de la condensation, il est **sous-refroidi**.",
            "**Sous-refroidissement = température de saturation lue − température mesurée.** L'ordre est inversé, puisqu'on descend au lieu de monter.",
            "À quoi ça sert : garantir qu'il arrive **du liquide franc** au détendeur. De la vapeur au détendeur, et le débit s'effondre.",
            "**Surchauffe et sous-refroidissement sont les deux marges de sécurité du circuit** : l'une protège le compresseur, l'autre alimente le détendeur."
          ],
          lu: "Oui, c'est exactement la même idée, mais à l'autre bout du circuit, et sur du liquide. Après le condenseur, le fluide est liquide. S'il continue de se refroidir au-delà de la condensation, on dit qu'il est sous-refroidi. Le calcul s'inverse : c'est la température de saturation lue, moins la température mesurée, puisqu'on descend au lieu de monter. Et à quoi cela sert-il ? À garantir qu'il arrive du liquide franc au détendeur. Car s'il arrive de la vapeur au détendeur, le débit s'effondre. Retenez donc que la surchauffe et le sous-refroidissement sont les deux marges de sécurité du circuit : l'une protège le compresseur, l'autre alimente le détendeur.",
          verifier: [
            "**Sous-refroidissement = saturation − mesurée**, et son rôle (garantir du liquide franc au détendeur). À confirmer.",
          ],
          codes: ["1.03", "1.05"]
        }
      ]
    }
  }
});
