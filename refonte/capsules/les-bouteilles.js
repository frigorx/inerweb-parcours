/* =====================================================================
   les-bouteilles.js — « Les bouteilles : choisir, peser, ne jamais gaver »
   ---------------------------------------------------------------------
   Redécoupage du fonds : mission-bouteilles (contenants, vannes, plaque,
   pesée, surremplissage, « boum »), planches secu-bouteille.svg et
   pesee-charge.svg.

   RÈGLE DU FONDS, tenue ici : AUCUN taux de remplissage chiffré n'est
   enseigné — « le remplissage maximal ne se déduit pas d'un simple
   80 % du poids : il dépend du volume en eau, du fluide, de sa densité
   et des indications du fabricant ». La plaque et la procédure font foi.
   Les valeurs TW/WC/PS et la pesée sont celles de la bouteille-exemple
   du tuto (R-449A de récupération).
   ===================================================================== */
CAPSULE({
  id: "les-bouteilles",
  ordre: 7,
  titre: "Les bouteilles : choisir, peser, ne jamais gaver",
  question: "Deux robinets, une plaque, une balance — que faut-il maîtriser avant d'ouvrir ?",
  niveau: "métier",
  minutes: 7,
  suppose: "A1, A2L, A3 : lire l'étiquette",
  voixFabriquee: true,   /* Henri + Denise, 07/08/2026 */

  fil: [
    {
      id: "01-le-contenant",
      titre: "Je choisis le bon contenant avant de brancher.",
      planche: "planches/trois-bouteilles.svg",
      texte: [
        "Trois bouteilles, trois usages : **transfert** (fluide neuf), **récupération**, et bouteille **dédiée aux fluides inflammables** — A2L comme A3.",
        "Le fluide extrait d'une installation peut être **contaminé** (huile, humidité) : il va dans un contenant de **récupération compatible et identifié** — jamais dans « une bouteille quelconque ».",
        "C'est le premier réflexe, avant tout branchement."
      ],
      plus: ["les-trois-bouteilles"],
      lu: "Premier réflexe, avant tout branchement : je choisis le bon contenant. Trois bouteilles, trois usages. La bouteille de transfert, pour le fluide neuf. La bouteille de récupération. Et la bouteille dédiée aux fluides inflammables, A deux L comme A trois, compatible et clairement identifiée. Le fluide que l'on retire d'une installation peut contenir de l'huile, de l'humidité, d'autres contaminants : il va dans un contenant de récupération compatible et identifié. Jamais dans une bouteille quelconque.",
      codes: ["5.02"]
    },

    {
      id: "02-deux-robinets",
      titre: "Deux robinets ? Deux phases — pas deux pressions.",
      planche: "planches/bouteille-deux-robinets.svg",
      texte: [
        "Dans la bouteille au repos, **les deux phases sont à la même pression** : celle d'[[équilibre|la pression que le fluide impose lui-même : à une température donnée, liquide et vapeur cohabitent à cette pression-là, ni plus ni moins — c'est le couple pression-température de la capsule du même nom]] du fluide. Il n'y a pas une vanne BP et une vanne HP.",
        "Le robinet **vapeur** prélève en haut. Le robinet **liquide** est relié au **tube plongeur** qui descend au fond : le liquide remonte dedans, **bouteille debout**.",
        "Sur certains récipients à un seul robinet, la procédure peut prévoir de retourner la bouteille — **mais jamais par habitude** : on respecte la conception et la procédure du fabricant."
      ],
      lu: "Beaucoup croient que les deux robinets sont une vanne basse pression et une vanne haute pression. C'est faux : dans une bouteille au repos, les deux phases sont à la pression d'équilibre du fluide. Les deux robinets donnent deux phases. Le robinet vapeur prélève dans la partie haute, au-dessus du liquide. Le robinet liquide est relié à un tube plongeur qui descend jusqu'au fond : le liquide remonte dans ce tube, bouteille debout. Sur certains récipients à un seul robinet, la procédure peut prévoir de retourner la bouteille pour obtenir du liquide. Mais jamais par habitude : on respecte la conception, et la procédure du fabricant.",
      plus: ["quelle-phase"],
      codes: ["5.02", "5.05"]
    },

    {
      id: "03-la-plaque",
      titre: "La plaque dit tout. La couleur, presque rien.",
      planche: "planches/plaque-bouteille.svg",
      texte: [
        "Sur la plaque de la bouteille-exemple : **TW 6,2 kg** — la tare, masse de la bouteille vide · **WC 12 L** — la capacité en eau · **PS 45 bar** — la pression de service.",
        "**Les couleurs servent seulement de repère visuel.** Sur le terrain, on vérifie la conception, les marquages et la notice du récipient.",
        "Pour les A2L : matériel et emballages adaptés — repère courant : [[ogive|le chapeau bombé du haut de la bouteille, autour du robinet — c'est lui qui porte la couleur de repère]] **rouge, raccord à pas à gauche**."
      ],
      lu: "Tout ce qui compte est écrit sur la plaque. Sur notre bouteille-exemple : T W, six virgule deux kilogrammes — c'est la tare, la masse de la bouteille vide. W C, douze litres — la capacité en eau, le volume interne de référence. P S, quarante-cinq bars — la pression de service. Et méfiez-vous des couleurs : elles servent seulement de repère visuel. Sur le terrain, on vérifie toujours la conception, les marquages et la notice du récipient. Pour les A deux L, on emploie du matériel et des emballages adaptés — le repère courant, c'est l'ogive rouge et le raccord à pas à gauche.",
      codes: ["5.06"]
    },

    {
      id: "04-la-pesee",
      titre: "La balance : masse de fluide = brut − tare.",
      planche: "planches/les-bouteilles_brut-moins-tare.svg",
      /* pesee-charge.svg du fonds montre la pesée AVANT/PENDANT/APRÈS une
         charge d'installation (pesée 1 − pesée 2) : autre calcul, autre écran.
         Ici : brut − tare, sur la bouteille-exemple. */
      texte: [
        "La balance affiche **13,4 kg**. La tare est **6,2 kg**. Masse de fluide : **13,4 − 6,2 = 7,2 kg**.",
        "Ce calcul doit devenir **automatique** : c'est par la pesée, et par rien d'autre, que l'on connaît la masse de fluide.",
        "Ni le manomètre, ni le niveau apparent, ni la couleur ne la donnent."
      ],
      lu: "Le geste central du module : la pesée. La balance affiche treize virgule quatre kilogrammes. La tare, lue sur la plaque, est de six virgule deux kilogrammes. La masse de fluide vaut donc treize virgule quatre moins six virgule deux : sept virgule deux kilogrammes. Ce calcul doit devenir automatique. C'est par la pesée, et par rien d'autre, que l'on connaît la masse de fluide dans une bouteille. Ni le manomètre, ni le niveau apparent, ni la couleur ne la donnent.",
      codes: ["5.06"]
    },

    {
      id: "05-le-volume-libre",
      titre: "Le volume libre n'est pas du vide perdu : c'est la marge de dilatation.",
      planche: "../fonds-origine/packs/fluides/res/svg/secu-bouteille.svg",
      alt: "Deux bouteilles comparées : remplie à ras, le liquide n'a pas de place pour se dilater et la pression grimpe très vite ; avec le volume libre respecté, le liquide a où se dilater. La planche ajoute l'interdit : ne jamais chauffer une bouteille — ni flamme, ni eau chaude, ni radiateur — ni la laisser au soleil ou dans un véhicule fermé.",
      texte: [
        "Au-dessus du liquide, le volume de vapeur fournit la **marge de dilatation**. Le liquide est pratiquement [[incompressible|impossible à comprimer : son volume ne diminue presque pas, même sous une très forte pression — contrairement à une vapeur, qui se comprime facilement]] : s'il se dilate sans marge, la pression monte **très vite**.",
        "Démonstration du tuto : deux bouteilles chauffées de 20 à 52 °C. À **75 %** de niveau, tout va bien. À **98 %**, la marge disparaît — la pression devient **critique**.",
        "**Le remplissage maximal ne se déduit pas d'un simple « 80 % du poids »** : il dépend du volume en eau, du fluide, de sa densité et des indications du fabricant."
      ],
      lu: "Regardez le haut de la bouteille. Ce volume de vapeur au-dessus du liquide n'est pas du vide perdu : c'est la marge de dilatation. Le liquide est pratiquement incompressible. S'il se dilate et qu'il n'a plus de place, la pression monte très vite. La démonstration du tuto met deux bouteilles côte à côte, chauffées de vingt à cinquante-deux degrés. À soixante-quinze pour cent de niveau, tout va bien. À quatre-vingt-dix-huit pour cent, la marge disparaît : la pression devient critique. Et retenez ceci : le remplissage maximal ne se déduit pas d'un simple quatre-vingts pour cent du poids. Il dépend du volume en eau, du fluide, de sa densité, et des indications du fabricant.",
      plus: ["le-boum"],
      codes: ["5.02"]
    },

    {
      id: "06-la-soupape",
      titre: "La soupape est un dernier recours — jamais une autorisation.",
      planche: "planches/soupape-dernier-recours.svg",
      texte: [
        "**La soupape ou le [[disque de rupture|une membrane calibrée qui se déchire à une pression donnée pour éviter l'éclatement du récipient — contrairement à la soupape, il ne se referme pas : une fois rompu, tout sort]] ne transforme jamais un surremplissage en bonne pratique.**",
        "S'y fier, c'est accepter d'avoir **déjà créé** une situation dangereuse. La bonne sécurité, c'est d'**empêcher** le surremplissage — par la pesée.",
        "**La sécurité commence avant d'ouvrir les vannes.** Identifier + peser + surveiller : voilà le professionnel."
      ],
      lu: "Un dernier mot, et il est grave. La soupape, ou le disque de rupture, ne transforme jamais un surremplissage en bonne pratique. Se fier à cette protection, c'est accepter d'avoir déjà créé une situation dangereuse. La bonne sécurité, c'est d'empêcher le surremplissage — et on l'empêche par la pesée. La sécurité commence avant d'ouvrir les vannes. Identifier, peser, surveiller : voilà ce qui fait le professionnel.",
      codes: ["5.02"]
    }
  ],

  retenir: [
    "**Le bon contenant avant de brancher** — le fluide extrait va en bouteille de récupération identifiée.",
    "**Deux robinets = deux phases** (vapeur en haut, liquide par le tube plongeur), pas deux pressions.",
    "**Masse de fluide = brut − tare.** La plaque : TW · WC · PS.",
    "**Le volume libre est la marge de dilatation** — le surremplissage la supprime.",
    "**La soupape est un dernier recours**, jamais une autorisation."
  ],

  detours: {

    "quelle-phase": {
      question: "Liquide ou vapeur : comment choisit-on la phase à prélever ?",
      ecrans: [
        {
          id: "d-phase-1",
          titre: "C'est une décision, pas une habitude.",
          planche: "planches/bouteille-deux-robinets.svg",
          texte: [
            "Le tuto fait prendre la décision **phase par phase** : déterminer l'état du fluide avant remplissage, puis choisir la méthode et le robinet.",
            "Prélèvement **vapeur** et prélèvement **liquide** sont deux gestes distincts, chacun avec sa procédure.",
            "Et pour les **mélanges zéotropes**, la capsule « Lire le code d'un fluide » l'explique : le glissement impose de **charger en phase liquide** — sinon la composition part de travers."
          ],
          lu: "Choisir la phase, c'est une décision, pas une habitude. On détermine d'abord l'état du fluide, puis on choisit la méthode et le robinet. Le prélèvement vapeur et le prélèvement liquide sont deux gestes distincts, chacun avec sa procédure. Et pour les mélanges zéotropes, la capsule sur la lecture des codes l'explique : le glissement impose de charger en phase liquide. Sinon, la composition du mélange part de travers.",
          renvoi: { sujet: "lire-le-code", libelle: "Lire le code d'un fluide — pourquoi les zéotropes se chargent en liquide" },
          codes: ["5.05"]
        }
      ]
    },

    "le-boum": {
      question: "Et si on va vraiment trop loin — que se passe-t-il ?",
      ecrans: [
        {
          id: "d-boum-1",
          titre: "On va volontairement trop loin, pour mémoriser le risque.",
          planche: "../fonds-origine/packs/fluides/res/svg/secu-bouteille.svg",
          alt: "Deux bouteilles comparées, remplie à ras contre volume libre respecté, et l'interdit de chauffe : jamais de flamme, d'eau chaude ni de radiateur sur une bouteille — ni soleil, ni véhicule fermé.",
          texte: [
            "Le scénario du tuto pousse **un cran plus loin** que l'écran précédent — **en simulation, à l'écran** : cet essai ne se fait **jamais** en vrai. Bouteille à **99 %**, température **52 °C**. Le liquide n'a plus aucune place. La pression s'emballe — **éclatement**.",
            "Le volume vapeur **n'empêche pas** toute montée de pression : il fournit une marge. Supprimez la marge, et la moindre chauffe devient une bombe.",
            "Une bouteille au soleil derrière un pare-brise, un local surchauffé : le scénario n'a rien de théorique."
          ],
          lu: "Le tuto va volontairement trop loin, pour graver le risque — un cran encore au-delà de l'écran précédent. Attention : c'est une simulation, à l'écran. Cet essai ne se fait jamais en vrai. Une bouteille remplie à quatre-vingt-dix-neuf pour cent, chauffée à cinquante-deux degrés. Le liquide n'a plus aucune place. La pression s'emballe, et la bouteille éclate. Comprenez le mécanisme : le volume vapeur n'empêche pas toute montée en pression, il fournit une marge. Supprimez la marge, et la moindre chauffe devient une bombe. Une bouteille au soleil derrière un pare-brise, un local surchauffé : le scénario n'a rien de théorique.",
          voixPerimee: true,
          codes: ["5.02"]
        }
      ]
    },

    "les-trois-bouteilles": {
      question: "Transfert, récupération, A2L : qu'est-ce qui les distingue, au juste ?",
      ecrans: [
        {
          id: "d-trois-1",
          titre: "Trois usages, trois identifications.",
          planche: "planches/trois-bouteilles.svg",
          texte: [
            "**Transfert** : le fluide neuf, propre, qui va vers l'installation.",
            "**Récupération** : reçoit le fluide retiré d'une installation — huile, humidité, contaminants possibles. Compatible et identifiée.",
            "**Dédiée aux inflammables** : A2L (le R-32) **comme A3** (le R-290 — qui n'est pas A2L, sa capsule sœur le martèle). Matériel adapté ; pour les A2L, repère courant : ogive rouge et raccord à pas à gauche. Voir « A1, A2L, A3 : lire l'étiquette »."
          ],
          lu: "Trois usages, trois identifications. La bouteille de transfert porte le fluide neuf, propre, qui va vers l'installation. La bouteille de récupération reçoit le fluide que l'on retire : il peut contenir de l'huile, de l'humidité, d'autres contaminants — elle est compatible et identifiée pour cela. Et la bouteille dédiée aux fluides inflammables : A deux L, comme le R trente-deux, mais aussi A trois, comme le R deux cent quatre-vingt-dix — qui n'est pas un A deux L, sa capsule sœur le martèle. Matériel adapté ; pour les A deux L, le repère courant, c'est l'ogive rouge et le raccord à pas à gauche. Pour la classe elle-même, voyez la capsule sur les étiquettes : A un, A deux L, A trois.",
          renvoi: { sujet: "classes-de-securite", libelle: "A1, A2L, A3 : lire l'étiquette" },
          codes: ["5.02"]
        }
      ]
    }
  }
});
