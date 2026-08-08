/* =====================================================================
   pression-temperature.js — « Pression et température, le couple »
   ---------------------------------------------------------------------
   Redécoupage du fonds : pression-temperature-interactive (la cloche à
   vide, la courbe de saturation, la traduction manomètre→table, pur
   contre zéotrope), planches lecture-table.svg et
   pression-absolue-relative.svg.

   Toutes les valeurs (tables eau et R-134a, glissement R-407C 6,1 K)
   viennent du tuto source — vérifiées identiques à outils/fluides-data.js
   par l'agent d'extraction (relevé du 07/08).
   La lecture du bloc de manomètres de service n'est PAS traitée ici : c'est la capsule
   « Lire un manomètre », en préparation chez F. Henninot.

   Refonte 08/08 (doctrine DOCTRINE-REFONTE-2026-08-08.md) :
   - 05-le-manometre réécrit : « +1 bar » n'est plus automatique (§ 0.3),
     on lit l'en-tête de la table d'abord — voix périmée.
   - d-table-1 : convention de pression de la table rendue explicite
     (précision douce du relevé ; la voix disait déjà « absolues »).
   - Capsule PROPRIÉTAIRE de l'ébullition sous pression réduite et de
     bulle/rosée (§ 3) : ces écrans ne bougent pas.
   ===================================================================== */
CAPSULE({
  id: "pression-temperature",
  ordre: 3,
  titre: "Pression et température, le couple",
  question: "Pourquoi le frigoriste lit-il des températures sur un manomètre ?",
  niveau: "découverte",
  minutes: 7,
  suppose: "La chaleur, sensible et latente",
  voixFabriquee: true,   /* Henri + Denise, 07/08/2026 */

  fil: [
    {
      id: "01-la-cloche",
      titre: "De l'eau à 25 °C peut bouillir. Sans flamme, sans résistance.",
      planche: "planches/cloche-a-vide.svg",
      texte: [
        "Un verre d'eau tiède sous une cloche. Une pompe retire **seulement l'air**. Vers **0,032 bar absolu**, l'eau **bout** — à 25 °C.",
        "**100 °C n'est vrai qu'autour de la pression atmosphérique.** La pression déplace la température d'ébullition.",
        "Et « sans chauffage » ne veut pas dire « sans énergie » : la vaporisation prélève la [[chaleur latente|l'énergie que demande le changement d'état — elle ne se voit pas au thermomètre ; c'est le sujet de la capsule « La chaleur, sensible et latente »]] **dans l'eau elle-même**, qui se refroidit."
      ],
      lu: "Commençons par une expérience qui surprend tout le monde. Un verre d'eau tiède, à vingt-cinq degrés, sous une cloche transparente. Une pompe retire seulement l'air. Il n'y a ni flamme, ni résistance. Et pourtant, vers zéro virgule zéro trente-deux bar absolu, l'eau se met à bouillir. À vingt-cinq degrés. Cent degrés n'est vrai qu'autour de la pression atmosphérique : la pression déplace la température d'ébullition. Et attention : sans chauffage extérieur ne signifie jamais sans énergie. La vaporisation prélève la chaleur latente dans l'eau elle-même, qui se refroidit.",
      plus: ["la-cloche-en-detail"],
      codes: ["1.02"]
    },

    {
      id: "02-la-carte",
      titre: "La courbe de saturation : la carte professionnelle du frigoriste.",
      planche: "planches/courbe-saturation-eau.svg",
      texte: [
        "À chaque pression, **sa** température d'ébullition. Pour l'eau : **1,013 bar → 100 °C** · **0,474 → 80 °C** · **0,199 → 60 °C** · **0,032 → 25 °C**.",
        "**La courbe n'est pas une règle de trois — mais elle monte toujours** : baisser la pression abaisse la température de saturation.",
        "La condition physique : l'ébullition commence quand la [[pression de vapeur|la pression que la vapeur d'un liquide exerce au-dessus de lui. Chaque liquide a la sienne, et elle grandit avec la température]] du liquide atteint la pression qui s'exerce sur lui."
      ],
      lu: "Cette relation se dessine : c'est la courbe de saturation, la carte professionnelle du frigoriste. À chaque pression, sa température d'ébullition. Pour l'eau : un virgule zéro treize bar, cent degrés. Zéro virgule quatre cent soixante-quatorze bar, quatre-vingts degrés. Zéro virgule cent quatre-vingt-dix-neuf bar, soixante degrés. Zéro virgule zéro trente-deux bar, vingt-cinq degrés. La courbe n'est pas une règle de trois, mais elle monte toujours : baisser la pression abaisse la température de saturation. Et la condition physique tient en une phrase : l'ébullition commence lorsque la pression de vapeur du liquide atteint la pression qui s'exerce sur lui.",
      codes: ["1.02", "1.03"]
    },

    {
      id: "03-deux-sens",
      titre: "Une seule frontière, deux sens de passage.",
      planche: "planches/saturation-deux-sens.svg",
      texte: [
        "À pression donnée, un fluide pur **bout et condense à la même température** : sa température de saturation.",
        "**Évaporation et condensation parcourent la même frontière dans deux sens opposés.**",
        "Si le liquide reçoit de l'énergie, il se vaporise. Si la vapeur cède de l'énergie, elle se condense. La température de saturation, elle, ne bouge pas."
      ],
      lu: "Voici maintenant l'idée qui simplifie tout. À une pression donnée, un fluide pur bout et condense à la même température : sa température de saturation. L'évaporation et la condensation parcourent simplement la même frontière, dans deux sens opposés. Si le liquide reçoit de l'énergie, il se vaporise. Si la vapeur cède de l'énergie, elle se condense. La température de saturation, elle, ne bouge pas.",
      codes: ["1.02"]
    },

    {
      id: "04-le-levier",
      titre: "Le levier du frigoriste : choisir la pression, c'est choisir la température.",
      planche: "planches/levier-pressions.svg",
      texte: [
        "Local à **+4 °C**. En tenant le R-134a à **2,0 bar absolus**, il [[sature|il atteint sa température de changement d'état : à cette pression, il bout précisément à cette température-là]] à **−10 °C** : plus froid que le local, l'énergie **entre** dans le fluide. **C'est l'effet frigorifique.**",
        "Extérieur à **+30 °C**. À **10,2 bar absolus**, il sature à **+40 °C** : plus chaud que dehors, le fluide **cède** son énergie.",
        "**La pression ne fabrique pas le froid. Elle choisit la température du changement d'état.**"
      ],
      lu: "Et voilà le levier du frigoriste. Un local à plus quatre degrés. En tenant le R cent trente-quatre a à deux bars absolus, il sature à moins dix degrés : plus froid que le local, donc l'énergie entre dans le fluide. C'est l'effet frigorifique. Dehors, trente degrés. À dix virgule deux bars absolus, le même fluide sature à quarante degrés : plus chaud que l'extérieur, donc il cède son énergie. Retenez la phrase de clôture du cours : la pression ne fabrique pas le froid. Elle choisit la température du changement d'état.",
      plus: ["la-table-r134a"],
      codes: ["1.02", "1.03"]
    },

    {
      id: "05-le-manometre",
      titre: "Le manomètre dit « relatif ». La table attend souvent de l'absolu.",
      planche: "../fonds-origine/packs/fluides/res/svg/pression-absolue-relative.svg",
      texte: [
        "Le manomètre de service indique une pression **relative** : son zéro, c'est la pression atmosphérique. La pression **absolue** part du vide parfait.",
        "**Lisez d'abord l'en-tête de la table** : certaines tables comptent en absolu, d'autres en relatif. Le « +1 bar » n'est **jamais automatique**. Si la table est en absolu, on ajoute la **pression atmosphérique du lieu** — environ 1 bar au niveau de la mer : lu **1,0 bar relatif** sur du R-134a, table en absolu → **≈ 2,0 bar absolus** → saturation **≈ −10 °C**.",
        "Avant de lire une table, **annoncez quatre choses : le fluide, la valeur, l'unité, et le type de pression.**"
      ],
      lu: "Un piège classique maintenant. Le manomètre de service indique une pression relative : son zéro correspond à la pression atmosphérique. La pression absolue, elle, part du vide parfait. Alors, avant toute conversion, lisez l'en-tête de la table : certaines tables comptent en pression absolue, d'autres en pression relative. Le plus un bar n'est jamais automatique. Si la table est en absolu, on ajoute la pression atmosphérique du lieu — environ un bar au niveau de la mer. Vous lisez un bar relatif sur du R cent trente-quatre a, et la table est en absolu ? Cela fait environ deux bars absolus, donc une saturation d'environ moins dix degrés. D'où la règle du métier : avant de lire une table, annoncez toujours quatre choses. Le fluide. La valeur. L'unité. Et le type de pression.",
      voixPerimee: true,
      codes: ["1.03"]
    },

    {
      id: "06-pur-ou-melange",
      titre: "Corps pur : un palier. Zéotrope : un glissement.",
      planche: "planches/palier-vs-glissement.svg",
      texte: [
        "Le corps pur change d'état à température **constante** : bulle et rosée coïncident.",
        "Le [[mélange zéotrope|un fluide fait de plusieurs composants qui ne changent pas d'état exactement ensemble — les séries R-400, voir la capsule « Lire le code d'un fluide »]], non : ses composants ne changent pas d'état ensemble. La température **glisse** — pour le R-407C, de **−10 °C (bulle)** à **−3,9 °C (rosée)**, soit **6,1 K** de glissement.",
        "Les références du métier : **surchauffe → rosée · sous-refroidissement → bulle.** La capsule « La surchauffe » s'en sert."
      ],
      lu: "Dernière distinction, et elle compte à l'examen. Un corps pur change d'état à température constante : le point de bulle et le point de rosée coïncident. Un mélange zéotrope, non : ses composants ne changent pas d'état exactement ensemble, et la température glisse pendant le changement d'état. Pour le R quatre cent sept C : de moins dix degrés au point de bulle, à moins trois virgule neuf degrés au point de rosée. Six virgule un kelvins de glissement. D'où les références du métier : la surchauffe se mesure par rapport à la rosée ; le sous-refroidissement, par rapport à la bulle. La capsule sur la surchauffe s'en sert directement.",
      plus: ["bulle-rosee"],
      codes: ["1.02", "1.03"]
    }
  ],

  retenir: [
    "**À chaque pression sa température de saturation** — et la courbe monte toujours.",
    "**La pression ne fabrique pas le froid : elle choisit la température du changement d'état.**",
    "Manomètre = pression **relative** ; absolue = relative + pression atmosphérique du lieu. **Lire l'en-tête de la table — jamais de « +1 bar » automatique.** Annoncer fluide, valeur, unité, type de pression.",
    "Corps pur : **palier** · zéotrope : **glissement** entre bulle et rosée (R-407C : 6,1 K).",
    "**Surchauffe → rosée · sous-refroidissement → bulle.**"
  ],

  detours: {

    "la-cloche-en-detail": {
      question: "Que se passe-t-il exactement sous la cloche, étape par étape ?",
      ecrans: [
        {
          id: "d-cloche-1",
          titre: "L'équilibre : quand la pression de vapeur rejoint la pression extérieure.",
          planche: "planches/equilibre-pression-vapeur.svg",
          texte: [
            "À 25 °C, l'eau a une pression de vapeur de **0,032 bar**. Sous 1,013 bar d'air, elle reste liquide : **0,032 ≠ 1,013**.",
            "La pompe descend la pression : à **0,199 bar**, toujours pas égalité. À **0,032 bar : égalité** — les bulles naissent dans la masse.",
            "Si la pompe continue encore, la pression passe sous 0,032 : l'eau continue de bouillir… **en se refroidissant**, car elle paie elle-même la chaleur latente."
          ],
          lu: "Reprenons la cloche au ralenti. À vingt-cinq degrés, l'eau possède une pression de vapeur de zéro virgule zéro trente-deux bar. Sous un virgule zéro treize bar d'air, elle reste liquide : les deux pressions ne sont pas égales. La pompe descend la pression extérieure. À zéro virgule cent quatre-vingt-dix-neuf bar, toujours pas d'égalité. À zéro virgule zéro trente-deux bar : égalité. Les bulles naissent dans toute la masse, l'ébullition commence. Et si la pompe continue encore ? La pression passe sous ce seuil, et l'eau continue de bouillir… en se refroidissant. Car c'est elle qui paie la chaleur latente.",
          codes: ["1.02"]
        }
      ]
    },

    "la-table-r134a": {
      question: "La table du R-134a, en entier : comment on s'en sert ?",
      ecrans: [
        {
          id: "d-table-1",
          titre: "Huit lignes qui traduisent toute la machine.",
          planche: "../fonds-origine/packs/fluides/res/svg/lecture-table.svg",
          texte: [
            "R-134a — **son en-tête l'annonce : pression absolue** : **−20 °C → 1,327 bar** · **−10 → 2,006** · **0 → 2,928** · **+10 → 4,146**.",
            "**+20 → 5,717** · **+30 → 7,702** · **+40 → 10,166** · **+50 → 13,179 bar**.",
            "La table **traduit une pression en température de saturation** — elle ne remplace pas le manomètre, elle lui donne un sens."
          ],
          lu: "Voici la table du R cent trente-quatre a, en pressions absolues. Moins vingt degrés : un virgule trois cent vingt-sept bar. Moins dix : deux virgule zéro zéro six. Zéro degré : deux virgule neuf cent vingt-huit. Plus dix : quatre virgule cent quarante-six. Plus vingt : cinq virgule sept cent dix-sept. Plus trente : sept virgule sept cent deux. Plus quarante : dix virgule cent soixante-six. Plus cinquante : treize virgule cent soixante-dix-neuf. Ce que fait une table, ni plus ni moins : elle traduit une pression en température de saturation. Elle ne remplace pas le manomètre. Elle lui donne un sens.",
          codes: ["1.03"]
        }
      ]
    },

    "bulle-rosee": {
      question: "Bulle, rosée : comment ne plus jamais les confondre ?",
      ecrans: [
        {
          id: "d-bulle-1",
          titre: "Les noms décrivent les frontières — pas l'ordre du voyage.",
          planche: "planches/bulle-rosee.svg",
          texte: [
            "**Point de bulle** : la frontière côté **liquide**. En évaporation, la première bulle y apparaît ; en condensation, la dernière bulle y disparaît.",
            "**Point de rosée** : la frontière côté **vapeur**. En évaporation, la dernière goutte y disparaît ; en condensation, la première goutte y apparaît.",
            "L'ordre s'inverse selon le sens du voyage — les noms, eux, ne bougent pas. **Vapeur seule → rosée. Liquide seul → bulle.**"
          ],
          lu: "Le moyen de ne plus les confondre : les noms décrivent les frontières, ils ne décrivent pas l'ordre du voyage. Le point de bulle, c'est la frontière côté liquide. En évaporation, la première bulle y apparaît. En condensation, la dernière bulle y disparaît. Le point de rosée, c'est la frontière côté vapeur. En évaporation, la dernière goutte y disparaît. En condensation, la première goutte y apparaît. L'ordre s'inverse selon le sens du voyage, mais les noms ne bougent pas. La vapeur seule se réfère à la rosée. Le liquide seul se réfère à la bulle.",
          codes: ["1.02"]
        }
      ]
    }
  }
});
