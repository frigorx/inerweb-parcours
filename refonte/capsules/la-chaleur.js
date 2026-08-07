/* =====================================================================
   la-chaleur.js — « La chaleur, sensible et latente »
   ---------------------------------------------------------------------
   Redécoupage du fonds : chaleur-interactive (le « voyage de l'eau »,
   les deux mots, le frigo) + chaleur-circuit-interactif (les grandeurs,
   les valeurs de c, le bilan Qcond = Qévap + Wcomp),
   planche chaleur-sensible-latente.svg.

   Toutes les valeurs viennent des deux tutos sources (relevé du 07/08).
   Le modèle est celui qu'ils énoncent : eau pure, pression
   atmosphérique, palier d'un corps pur — le glissement des zéotropes
   est renvoyé à « Pression et température ».
   ===================================================================== */
CAPSULE({
  id: "la-chaleur",
  ordre: 2,
  titre: "La chaleur, sensible et latente",
  question: "Pourquoi la température peut-elle rester stable pendant qu'on chauffe ?",
  niveau: "découverte",
  minutes: 7,
  suppose: null,
  voixFabriquee: true,   /* Henri + Denise, 07/08/2026 */

  fil: [
    {
      id: "01-energie",
      titre: "Chauffer, c'est transférer de l'énergie. Et température n'est pas énergie.",
      planche: "planches/deux-casseroles.svg",
      texte: [
        "**Chauffer**, c'est transférer de l'énergie vers la matière. **Refroidir**, c'est lui en retirer pour la transmettre ailleurs.",
        "Et attention : **une température n'est pas une quantité d'énergie.** Deux casseroles à la même température ne contiennent pas la même énergie si l'une est pleine et l'autre presque vide.",
        "**La masse compte.** Masse doublée : énergie nécessaire doublée, toutes choses égales par ailleurs."
      ],
      lu: "Commençons par remettre deux mots à leur place. Chauffer, c'est transférer de l'énergie vers la matière. Refroidir, c'est lui en retirer, pour la transmettre ailleurs. Et attention à l'idée fausse la plus répandue : une température n'est pas une quantité d'énergie. Deux casseroles à la même température ne contiennent pas la même énergie, si l'une est pleine et l'autre presque vide. La masse compte. Masse doublée : énergie nécessaire doublée, toutes choses égales par ailleurs.",
      plus: ["la-masse"],
      codes: ["1.02"]
    },

    {
      id: "02-escalier",
      titre: "La courbe en escalier : du glaçon à la vapeur.",
      planche: "../fonds-origine/packs/fluides/res/svg/chaleur-sensible-latente.svg",
      texte: [
        "Suivez de l'eau pure, à pression atmosphérique, du glaçon à **−20 °C** jusqu'à la vapeur au-delà de **100 °C**.",
        "La courbe monte, **s'arrête à 0 °C** le temps de fondre, remonte, **s'arrête à 100 °C** le temps de bouillir, puis remonte encore.",
        "Le réflexe de lecture tient en une phrase : **une pente change la température ; un palier change l'état.**"
      ],
      lu: "Voici la première carte du frigoriste : la courbe en escalier. Suivez de l'eau pure, à pression atmosphérique, depuis un glaçon à moins vingt degrés jusqu'à la vapeur au-delà de cent degrés. La courbe monte, puis s'arrête à zéro degré, le temps de fondre. Elle remonte, puis s'arrête à cent degrés, le temps de bouillir. Puis elle remonte encore. Le réflexe de lecture tient en une phrase : une pente change la température ; un palier change l'état.",
      codes: ["1.02"]
    },

    {
      id: "03-sensible",
      titre: "La pente, c'est la chaleur sensible. Le thermomètre la sent.",
      planche: "planches/pente-chaleur-sensible.svg",
      texte: [
        "La **chaleur sensible** modifie la température **sans changer l'état**. C'est elle que le thermomètre voit.",
        "Sa formule : **Q = m × c × ΔT** — la masse, la [[capacité thermique|ce que coûte, en énergie, le fait d'élever de 1 degré 1 kilogramme de cette matière. Chaque matière a la sienne : l'eau 4 180, l'air 1 005, le cuivre 385 joules]] de la matière, l'écart de température.",
        "À ce stade, on la **reconnaît** : température qui change = chaleur sensible."
      ],
      lu: "La pente de la courbe, c'est la chaleur sensible. Elle modifie la température, sans changer l'état. C'est elle que le thermomètre voit. Sa formule s'écrit Q égale m fois c fois delta T : la masse, la capacité thermique de la matière, et l'écart de température. À ce stade, contentez-vous de la reconnaître : température qui change, égale chaleur sensible.",
      plus: ["les-grandeurs"],
      codes: ["1.02"]
    },

    {
      id: "04-latente",
      titre: "Le palier, c'est la chaleur latente. Cachée au thermomètre.",
      planche: "planches/palier-chaleur-latente.svg",
      texte: [
        "Pendant le palier, on chauffe toujours — et la température **ne bouge pas**. L'énergie sert à **changer l'état** : c'est la **chaleur latente**.",
        "**Un palier n'est pas une pause : c'est un changement d'état en cours.** Sa formule : **Q = m × L**.",
        "Et elle transporte **énormément** d'énergie — c'est le secret de toute la machine frigorifique."
      ],
      lu: "Pendant le palier, on chauffe toujours, et pourtant la température ne bouge pas. Toute l'énergie sert à changer l'état : c'est la chaleur latente, cachée au thermomètre. Retenez bien ceci : un palier n'est pas une pause. C'est un changement d'état en cours. Sa formule s'écrit Q égale m fois L. Et cette chaleur latente transporte énormément d'énergie. C'est le secret de toute la machine frigorifique.",
      codes: ["1.02"]
    },

    {
      id: "05-le-frigo",
      titre: "Le froid n'est pas une substance : la machine déplace l'énergie.",
      planche: "planches/frigo-domestique.svg",
      texte: [
        "Dans le réfrigérateur : **dedans, l'évaporateur absorbe** l'énergie — c'est l'effet frigorifique. **Derrière, le condenseur la restitue.**",
        "**Le froid n'est pas une substance** que la machine envoie dans la pièce : le local **perd** de l'énergie, voilà tout.",
        "La preuve : porte ouverte, la pièce ne refroidit pas — le condenseur y rejette **plus** que l'évaporateur n'en retire.",
        "Le bilan s'écrit : **Q̇ condenseur = Q̇ évaporateur + le travail du compresseur transmis au fluide.**"
      ],
      lu: "Regardez maintenant un appareil que vous connaissez : le réfrigérateur. Dedans, l'évaporateur absorbe l'énergie : c'est l'effet frigorifique. Derrière, la grille du condenseur la restitue à la pièce. Comprenez bien : le froid n'est pas une substance que la machine envoie. Le local perd de l'énergie, voilà tout. Et la preuve est amusante : laisser la porte ouverte ne refroidit pas la pièce. Le condenseur y rejette plus d'énergie que l'évaporateur n'en retire. D'où le bilan, à retenir : Q point condenseur égale Q point évaporateur, plus le travail du compresseur transmis au fluide.",
      plus: ["le-bilan"],
      codes: ["1.02", "1.04"]
    },

    {
      id: "06-deux-briques",
      titre: "Les deux briques du métier : surchauffe et sous-refroidissement.",
      planche: "../fonds-origine/packs/fluides/res/svg/mesure-surchauffe.svg",
      texte: [
        "Dans l'évaporateur, **la dernière goutte disparaît**. Si la vapeur seule reçoit encore de l'énergie, elle se réchauffe : **c'est la surchauffe**.",
        "Dans le condenseur, **la dernière bulle disparaît**. Si le liquide seul cède encore de l'énergie, il se refroidit : **c'est le sous-refroidissement**.",
        "Pour **mesurer** ces écarts, il faudra relier pression et température — c'est la capsule suivante."
      ],
      lu: "Terminons par les deux briques du métier. Dans l'évaporateur, la dernière goutte de liquide vient de disparaître. Si le fluide reçoit encore de l'énergie, la vapeur seule se réchauffe : c'est la surchauffe. Dans le condenseur, la dernière bulle de vapeur vient de disparaître. Si le liquide cède encore de l'énergie, il se refroidit sous sa température de changement d'état : c'est le sous-refroidissement. Les mots ont maintenant un sens. Pour mesurer ces écarts, il faudra relier pression et température. C'est exactement l'objet de la capsule suivante.",
      codes: ["1.02"]
    }
  ],

  retenir: [
    "**Température qui change = chaleur sensible · état qui change = chaleur latente.**",
    "**Q = m × c × ΔT** (sensible) · **Q = m × L** (latente) — la masse compte dans les deux.",
    "**Un palier n'est pas une pause** : c'est un changement d'état en cours.",
    "**Le froid n'est pas une substance** : l'évaporateur prend l'énergie, le condenseur la rend.",
    "**Q̇ condenseur = Q̇ évaporateur + le travail du compresseur transmis au fluide.**"
  ],

  detours: {

    "la-masse": {
      question: "Deux casseroles, même plaque : pourquoi la grande met-elle plus longtemps ?",
      ecrans: [
        {
          id: "d-masse-1",
          titre: "Une même température ne signifie pas une même quantité d'énergie.",
          planche: "planches/deux-casseroles.svg",
          texte: [
            "Petite et grande casserole reçoivent **la même énergie** par la plaque. La petite bout la première : **moins de matière à faire évoluer**.",
            "Masse doublée : énergie doublée. Masse triplée : énergie triplée — toutes choses égales par ailleurs.",
            "Et un corps **ne contient pas de la chaleur comme un réservoir** : il possède une énergie interne, et il peut en recevoir ou en céder."
          ],
          lu: "Mettez une petite et une grande casserole sur deux plaques identiques. Elles reçoivent la même énergie. La petite bout la première : il y a moins de matière à faire évoluer. Masse doublée : énergie nécessaire doublée. Masse triplée : énergie triplée, toutes choses égales par ailleurs. Et corrigeons une image trompeuse : un corps ne contient pas de la chaleur comme un réservoir. Il possède une énergie interne, et il peut recevoir ou céder de la chaleur.",
          codes: ["1.02"]
        }
      ]
    },

    "les-grandeurs": {
      question: "T, Q, Q̇ : trois grandeurs qui se ressemblent — comment les tenir ?",
      ecrans: [
        {
          id: "d-grandeurs-1",
          titre: "T décrit l'état · Q compte l'énergie · Q̇ mesure la puissance.",
          planche: "planches/trois-grandeurs.svg",
          texte: [
            "**T**, la température : elle situe le niveau thermique. En **°C ou en K**.",
            "**Q**, la chaleur : une énergie transférée. En **joules**. Exemple du tuto : chauffer 1 kg d'eau de 20 à 60 °C = 1 × 4 180 × 40 = **167 200 J**, soit 167,2 kJ.",
            "**Q̇**, la puissance : un débit d'énergie. En **watts**. Dans un échangeur traversé en permanence, la grandeur utile est le **kilowatt**.",
            "Repères de capacité thermique : eau **4 180** · air sec **1 005** · cuivre **385** J/(kg·K)."
          ],
          lu: "Trois grandeurs, trois rôles. T, la température : elle situe le niveau thermique du corps, en degrés ou en kelvins. Q, la chaleur : une énergie transférée, en joules. Un exemple : chauffer un kilogramme d'eau de vingt à soixante degrés demande un fois quatre mille cent quatre-vingts fois quarante, soit cent soixante-sept mille deux cents joules — cent soixante-sept virgule deux kilojoules. Q point, enfin, la puissance thermique : un débit d'énergie, en watts. Dans un échangeur traversé en permanence, la grandeur utile est le kilowatt. Et trois repères de capacité thermique : l'eau, quatre mille cent quatre-vingts ; l'air sec, mille cinq joules, à peine plus de mille ; le cuivre, trois cent quatre-vingt-cinq joules par kilogramme et par kelvin.",
          codes: ["1.01"]
        }
      ]
    },

    "le-bilan": {
      question: "La grille arrière rejette PLUS que ce qui a été pris dedans. D'où vient le surplus ?",
      ecrans: [
        {
          id: "d-bilan-1",
          titre: "Du compresseur. Rien ne se perd : tout s'additionne.",
          planche: "planches/bilan-energie.svg",
          texte: [
            "Le condenseur rejette l'énergie prise dans le local **plus** le travail fourni au compresseur.",
            "**Q̇ condenseur = Q̇ évaporateur + puissance transmise au fluide.**",
            "L'exemple du tuto : évaporateur **5,0 kW**, compresseur **1,2 kW** → condenseur **6,2 kW**. La balance tombe juste, toujours."
          ],
          lu: "Le surplus vient du compresseur. Rien ne se perd : tout s'additionne. Le condenseur rejette l'énergie prise dans le local, plus le travail fourni au compresseur. Q point condenseur égale Q point évaporateur, plus la puissance transmise au fluide. Un exemple chiffré : cinq kilowatts à l'évaporateur, un virgule deux kilowatts au compresseur : le condenseur rejette six virgule deux kilowatts. La balance tombe juste, toujours.",
          codes: ["1.02", "1.04"]
        }
      ]
    }
  }
});
