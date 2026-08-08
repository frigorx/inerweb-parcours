/* =====================================================================
   la-surchauffe.js — « La surchauffe : la mesurer, la comprendre »
   ---------------------------------------------------------------------
   Redécoupage du fonds : evaporateur-interactif, mesure-surchauffe.svg,
   surchauffe-utile-totale.svg, lecture-table.svg.

   Refonte du 08/08/2026 (doctrine DOCTRINE-REFONTE-2026-08-08.md) :
   unités à chaque étape du calcul, « peut indiquer » sur les diagnostics,
   plus de « un tour est déjà beaucoup » ni de 5-8 K en norme, convention
   absolue/relative des tables, sous-refroidissement « contribue à
   vérifier ». Les planches du fonds qui portaient « +1 bar » machinal ou
   des plages en norme sont remplacées par des planches propres à la
   capsule (préfixe la-surchauffe_).

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
  ordre: 10,
  titre: "La surchauffe : la mesurer, la comprendre",
  question: "Deux lectures et une soustraction — mais lesquelles, et pourquoi ?",
  niveau: "métier",
  minutes: 8,
  suppose: "Pression et température, le couple",
  voixFabriquee: true,   /* Henri + Denise, 06/08/2026 */

  fil: [
    {
      id: "01-a-quoi-ca-sert",
      titre: "Une vapeur qui n'est plus en train de bouillir.",
      planche: "planches/la-surchauffe_derniere-goutte.svg",
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
      planche: "planches/la-surchauffe_calcul.svg",
      texte: [
        "**Première valeur** — la température du tube à la sortie de l'évaporateur, en **degrés Celsius (°C)**. Vous la **mesurez** avec une sonde de contact.",
        "**Deuxième valeur** — la température de [[saturation|la température à laquelle le fluide bout, à la pression qui règne à cet endroit]], en **degrés Celsius (°C)** elle aussi. Vous ne la mesurez pas : vous la **lisez** dans la table du fluide, à partir de la pression au manomètre.",
        "**Température du tube (°C) − température de saturation lue à la pression (°C) = surchauffe, en kelvins (K).**",
        "Le résultat s'exprime en **kelvins (K)**, parce que c'est un **écart** entre deux températures, et non une température."
      ],
      lu: "Passons au calcul. Il vous faut deux valeurs. Première valeur : la température du tube à la sortie de l'évaporateur, en degrés Celsius. Celle-là, vous la mesurez, avec une sonde de contact. Deuxième valeur : la température de saturation, c'est-à-dire la température à laquelle le fluide bout à la pression qui règne à cet endroit, en degrés Celsius elle aussi. Celle-là, vous ne la mesurez pas, vous la lisez dans la table du fluide, à partir de la pression indiquée par votre manomètre. La surchauffe, c'est la température du tube moins la température de saturation. Et le résultat s'exprime en kelvins, parce que c'est un écart entre deux températures, et non une température.",
      voixPerimee: true,
      plus: ["lire-la-table", "zeotrope"],
      codes: ["1.03", "1.04"]
    },

    {
      id: "03-un-exemple",
      titre: "Un exemple, en entier.",
      planche: "planches/la-surchauffe_exemple.svg",
      texte: [
        "Sortie d'évaporateur : la sonde indique **+2 °C**.",
        "Le manomètre BP donne une pression à laquelle la table du fluide indique une ébullition à **−5 °C**.",
        "**Surchauffe = +2 °C − (−5 °C) = 7 K.**",
        "Attention au signe : la température de saturation est souvent **négative**, et soustraire un nombre négatif **augmente** le résultat. C'est là que se font la plupart des erreurs."
      ],
      lu: "Prenons un exemple complet. À la sortie de l'évaporateur, votre sonde indique plus deux degrés. Votre manomètre basse pression, lui, donne une pression à laquelle la table du fluide indique une ébullition à moins cinq degrés. La surchauffe vaut donc deux moins moins cinq, c'est-à-dire sept kelvins. Attention au signe, c'est là que se font la plupart des erreurs : la température de saturation est souvent négative, et soustraire un nombre négatif augmente le résultat.",
      codes: ["1.03", "1.04"]
    },

    {
      id: "04-trop-peu",
      titre: "Trop peu de surchauffe : le compresseur est en danger.",
      planche: "planches/la-surchauffe_trop-peu.svg",
      texte: [
        "Une surchauffe **très faible ou nulle** **peut indiquer** que le fluide n'a pas fini de bouillir dans l'évaporateur — et donc qu'un **retour de liquide** vers le compresseur est possible.",
        "Or un liquide **ne se comprime pratiquement pas**. Les conséquences vont du **retour d'huile perturbé** à la **casse mécanique**.",
        "**On confirme avant de conclure** : mesures complètes, documentation de la machine.",
        "**Une surchauffe nulle n'est jamais un bon réglage.** C'est une alarme."
      ],
      lu: "Voyons maintenant ce que la valeur vous dit. Une surchauffe très faible, ou nulle, peut indiquer que le fluide n'a pas fini de bouillir dans l'évaporateur, et donc qu'un retour de liquide vers le compresseur est possible. Or un liquide ne se comprime pratiquement pas : les conséquences vont du retour d'huile perturbé jusqu'à la casse mécanique. Avant de conclure, on confirme : mesures complètes, documentation de la machine. Mais retenez bien ceci : une surchauffe nulle n'est jamais un bon réglage. C'est une alarme.",
      voixPerimee: true,
      plus: ["pourquoi-pas-liquide"],
      codes: ["1.03", "1.05"]
    },

    {
      id: "05-trop",
      titre: "Trop de surchauffe : vous perdez de la puissance.",
      planche: "planches/la-surchauffe_trop.svg",
      texte: [
        "Une surchauffe **élevée** **peut indiquer** un évaporateur **insuffisamment alimenté** : le fluide a fini de bouillir bien avant la sortie.",
        "Toute la fin de l'évaporateur ne contient alors plus que de la vapeur : elle **ne produit presque plus de froid**. La **puissance utile** de l'échangeur baisse.",
        "Et la vapeur arrive **plus chaude** au compresseur, qui refoule **plus chaud** encore. Là aussi, **on confirme avec les mesures et la documentation** avant de conclure.",
        "**Trop, c'est du rendement perdu. Trop peu, c'est un risque de casse.** Le réglage vit entre les deux."
      ],
      lu: "À l'inverse, une surchauffe élevée peut indiquer un évaporateur insuffisamment alimenté : le fluide a fini de bouillir bien avant la sortie. Toute la fin de l'évaporateur ne contient alors plus que de la vapeur, et elle ne produit presque plus de froid : la puissance utile de l'échangeur baisse. De plus, la vapeur arrive plus chaude au compresseur, qui refoule plus chaud encore. Là aussi, on confirme avec les mesures et la documentation avant de conclure. Résumons : trop de surchauffe, c'est du rendement perdu ; trop peu, c'est un risque de casse. Le bon réglage vit entre les deux.",
      voixPerimee: true,
      plus: ["quelle-valeur"],
      codes: ["1.03", "1.05"]
    },

    {
      id: "06-regler",
      titre: "Régler : un peu, puis attendre.",
      planche: "planches/la-surchauffe_regler.svg",
      texte: [
        "On agit sur la vis du détendeur [[thermostatique|détendeur piloté par la température de sortie de l'évaporateur]]. **Par petits pas** : le sens de réglage et le pas sont dans la **notice**.",
        "Après chaque retouche, **attendez que l'installation se stabilise** avant de relire : la boucle met du temps à répondre, et le **temps de stabilisation** est donné par le **constructeur**.",
        "**L'erreur classique** : retoucher, relire aussitôt, retoucher encore. On poursuit une valeur qui n'a pas fini de bouger, et on finit très loin du but.",
        "Notez la valeur de départ **avant** de toucher à quoi que ce soit. Elle vous permet de revenir en arrière."
      ],
      lu: "Terminons par le geste. On agit sur la vis du détendeur thermostatique, par petits pas : le sens de réglage et le pas sont donnés par la notice. Après chaque retouche, attendez que l'installation se stabilise avant de relire : la boucle met du temps à répondre, et le temps de stabilisation, c'est le constructeur qui le donne. L'erreur classique, c'est de retoucher, relire aussitôt, et retoucher encore. Vous poursuivez alors une valeur qui n'a pas fini de bouger, et vous finissez très loin du but. Un dernier conseil, tout simple : notez la valeur de départ avant de toucher à quoi que ce soit. Elle vous permettra de revenir en arrière.",
      voixPerimee: true,
      plus: ["quelle-valeur", "sous-refroidissement"],
      codes: ["1.03", "3.04"]
    }
  ],

  retenir: [
    "**Surchauffe = température mesurée à la sortie − température de saturation lue à la pression.**",
    "Elle **prouve qu'il n'y a plus de liquide** à la sortie de l'évaporateur.",
    "**Trop peu → risque de coup de liquide** · **trop → puissance perdue**.",
    "On règle **par petits pas**, et on **attend** avant de relire — la notice commande.",
    "Sur un **zéotrope**, la température de saturation se lit sur la **rosée**."
  ],

  detours: {

    "pourquoi-pas-liquide": {
      question: "Pourquoi le liquide est-il si dangereux pour le compresseur ?",
      ecrans: [
        {
          id: "d-liq-1",
          titre: "Parce qu'un liquide ne se laisse pas écraser.",
          planche: "planches/la-surchauffe_liquide.svg",
          texte: [
            "Un gaz se comprime : son volume diminue, et le piston peut finir sa course.",
            "Un liquide est **pratiquement incompressible** dans les conditions du compresseur. Si le cylindre en contient et que le piston monte, les **efforts montent brutalement** : le clapet, la bielle ou la culasse **peuvent rompre**.",
            "Même sans casse immédiate, le liquide **lave l'huile** des parois et **dilue le carter**. L'usure s'accélère, silencieusement.",
            "**C'est pour cela que la surchauffe existe** : elle est la marge de sécurité qui protège le compresseur du liquide."
          ],
          lu: "La raison est mécanique et elle est simple. Un gaz se comprime : son volume diminue, et le piston peut finir sa course sans problème. Un liquide, lui, est pratiquement incompressible dans les conditions du compresseur. Si le cylindre en contient et que le piston monte, les efforts montent brutalement : le clapet, la bielle ou la culasse peuvent rompre. Et même sans casse immédiate, le liquide lave l'huile des parois et dilue le carter. L'usure s'accélère alors, silencieusement. Voilà pourquoi la surchauffe existe : c'est la marge de sécurité qui protège le compresseur du liquide.",
          voixPerimee: true,
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
          planche: "planches/la-surchauffe_lecture-table.svg",
          texte: [
            "Chaque fluide a **sa** table : à une pression donnée correspond **une** température d'ébullition, et une seule.",
            "Vous lisez la pression sur le manomètre BP, vous entrez dans la table de **votre** fluide, vous sortez la température.",
            "**Deux pièges.** Utiliser la table d'un autre fluide donne un résultat faux mais crédible — c'est l'erreur qui ne se voit pas.",
            "Et certaines tables sont en pression **absolue**, d'autres en **relative** : **lisez l'en-tête** de la table. N'ajoutez jamais « +1 bar » machinalement — la conversion dépend de ce que la table attend."
          ],
          lu: "Chaque fluide possède sa propre table. À une pression donnée correspond une température d'ébullition, une seule. Le geste est donc simple : vous lisez la pression sur le manomètre basse pression, vous entrez dans la table de votre fluide, et vous sortez la température. Deux pièges, cependant. Premier piège : utiliser la table d'un autre fluide. Le résultat est faux, mais parfaitement crédible, et c'est l'erreur qui ne se voit pas. Second piège : certaines tables attendent une pression absolue, d'autres une pression relative. Alors lisez l'en-tête de la table, et n'ajoutez jamais un bar machinalement : la conversion dépend de ce que la table attend.",
          voixPerimee: true,
          verifier: [
            "Décision plateau attendue : quelle convention — pression **absolue** ou **relative** — utilisent les tables et les manomètres du plateau, et comment l'en-tête de chaque table est présenté aux candidats.",
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
          planche: "planches/la-surchauffe_deux-colonnes.svg",
          texte: [
            "Un mélange **zéotrope** (séries 400) n'a pas **une** température d'ébullition mais **deux** : celle du début, dite **bulle**, et celle de la fin, dite **rosée**.",
            "La surchauffe se mesure **après** la fin de l'ébullition. C'est donc la **rosée** qu'il faut prendre.",
            "Le **sous-refroidissement**, lui, se mesure après la fin de la condensation : c'est la **bulle**.",
            "**Se tromper de colonne fausse le réglage** de plusieurs kelvins — et ce sont justement les kelvins qui comptent."
          ],
          lu: "Un mélange zéotrope, c'est-à-dire de la série quatre cents, n'a pas une température d'ébullition mais deux : celle du début, qu'on appelle la bulle, et celle de la fin, qu'on appelle la rosée. Or la surchauffe se mesure après la fin de l'ébullition. C'est donc la rosée qu'il faut prendre. Le sous-refroidissement, lui, se mesure après la fin de la condensation : c'est alors la bulle. Et se tromper de colonne fausse le réglage de plusieurs kelvins. Or ce sont justement ces kelvins-là qui comptent.",
          renvoi: { sujet: "pression-temperature", libelle: "Bulle et rosée : la définition complète" },
          codes: ["1.06", "1.04"]
        }
      ]
    },

    "quelle-valeur": {
      question: "Quelle valeur viser, concrètement ?",
      ecrans: [
        {
          id: "d-valeur-1",
          titre: "La cible ? Celle que donne la documentation du matériel.",
          planche: "planches/la-surchauffe_cible.svg",
          texte: [
            "Il n'existe pas de **valeur unique** valable partout. L'ordre de grandeur **dépend du système** : type d'évaporateur, fluide, détendeur, régime, application.",
            "**La documentation du matériel donne la cible.** C'est elle qu'on cherche avant de régler.",
            "Un repère ne sert pas à régler : il sert à **voir l'aberrant**.",
            "*Une surchauffe **nulle**, par exemple, se repère immédiatement comme anormale.*",
            "*Une surchauffe très élevée par rapport à la cible de la documentation — 25 K sur beaucoup de systèmes à détente directe — se repère immédiatement comme anormale.*"
          ],
          lu: "Il n'existe pas de valeur unique, valable partout. L'ordre de grandeur dépend du système : le type d'évaporateur, le fluide, le détendeur, le régime de fonctionnement, l'application. La cible, c'est la documentation du matériel qui la donne : c'est elle qu'on cherche avant de régler. À quoi sert alors un repère ? Pas à régler : à voir l'aberrant. Une surchauffe nulle, par exemple, se repère immédiatement comme anormale. Et une surchauffe très élevée par rapport à la cible de la documentation — vingt-cinq kelvins sur beaucoup de systèmes à détente directe — se repère tout aussi immédiatement.",
          voixPerimee: true,
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
          planche: "planches/la-surchauffe_sous-refroidissement.svg",
          alt: "Circuit selon la croix du frigoriste — condenseur en haut, évaporateur en bas, détendeur à gauche, compresseur à droite : le sous-refroidissement se lit à la sortie du condenseur, sur le liquide ; la surchauffe à la sortie de l'évaporateur, sur la vapeur.",
          texte: [
            "Après le condenseur, le fluide est **liquide**. S'il continue de se refroidir au-delà de la condensation, il est **sous-refroidi**.",
            "**Sous-refroidissement = température de saturation lue − température mesurée.** L'ordre est inversé, puisqu'on descend au lieu de monter.",
            "À quoi ça sert : le sous-refroidissement **contribue à vérifier** que du **liquide franc** arrive au détendeur. De la vapeur au détendeur, et le débit s'effondre.",
            "**Surchauffe et sous-refroidissement sont les deux marges de sécurité du circuit** : l'une protège le compresseur, l'autre renseigne sur l'alimentation du détendeur."
          ],
          lu: "Oui, c'est exactement la même idée, mais à l'autre bout du circuit, et sur du liquide. Après le condenseur, le fluide est liquide. S'il continue de se refroidir au-delà de la condensation, on dit qu'il est sous-refroidi. Le calcul s'inverse : c'est la température de saturation lue, moins la température mesurée, puisqu'on descend au lieu de monter. Et à quoi cela sert-il ? Le sous-refroidissement contribue à vérifier qu'il arrive du liquide franc au détendeur. Car s'il arrive de la vapeur au détendeur, le débit s'effondre. Retenez donc que la surchauffe et le sous-refroidissement sont les deux marges de sécurité du circuit : l'une protège le compresseur, l'autre renseigne sur l'alimentation du détendeur.",
          voixPerimee: true,
          codes: ["1.03", "1.05"]
        }
      ]
    }
  }
});
