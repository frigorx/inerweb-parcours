/* =====================================================================
   controle-etancheite.js — « Le contrôle d'étanchéité : qui, quand, comment »
   ---------------------------------------------------------------------
   Redécoupage du fonds : etancheite-interactive, points-de-fuite.svg,
   balayage-detecteur.svg.

   Refonte du 08/08/2026 (doctrine § 2 « controle-etancheite ») :
   seuils et périodicités recalés sur le règlement (UE) 2024/573
   (annexe I en t éq. CO₂, annexe II section 1 en kg, article 5),
   recontrôle 24 h - 1 mois, conservation 5 ans, PRP de l'annexe qui
   fait foi. Les « À VÉRIFIER » réglementaires sont soldés ; il ne
   reste qu'une décision de plateau (liste des points sensibles).
   Voix Henri + Denise du 06/08 : périmée sur les écrans marqués.
   ===================================================================== */
CAPSULE({
  id: "controle-etancheite",
  ordre: 11,
  titre: "Le contrôle d'étanchéité : qui, quand, comment",
  question: "Pourquoi certaines machines se contrôlent tous les ans, et d'autres jamais ?",
  niveau: "examen",
  minutes: 8,
  suppose: "A1, A2L, A3 : lire l'étiquette",
  voixFabriquee: true,   /* Henri + Denise, 06/08/2026 */

  fil: [
    {
      id: "01-pas-une-recherche",
      titre: "Ce n'est pas « chercher une fuite ». C'est une obligation.",
      planche: "../fonds-origine/packs/fluides/res/svg/points-de-fuite.svg",
      alt: "Schéma d'une installation frigorifique : les endroits qui fuient le plus souvent sont marqués — raccords démontables, brasures, vannes, joints, passages de tôle.",
      texte: [
        "Chercher une fuite, c'est ce qu'on fait **quand la machine va mal**.",
        "Le **contrôle d'étanchéité**, c'est autre chose : une vérification **périodique et obligatoire**, faite sur une machine **qui fonctionne bien**.",
        "Elle est imposée par la réglementation sur les **gaz fluorés**, et elle se **prouve** : ce qui n'est pas écrit n'a pas été fait."
      ],
      lu: "Commençons par une distinction que beaucoup confondent. Chercher une fuite, c'est ce qu'on fait quand la machine va mal, quand elle manque de fluide. Le contrôle d'étanchéité, lui, c'est tout autre chose : c'est une vérification périodique et obligatoire, faite sur une machine qui fonctionne parfaitement bien. Elle est imposée par la réglementation sur les gaz fluorés. Et elle se prouve : ce qui n'est pas écrit n'a pas été fait.",
      codes: ["4.01"]
    },

    {
      id: "02-pourquoi-co2",
      titre: "La périodicité se mesure au dégât possible — pas seulement aux kilos.",
      planche: "planches/controle-etancheite_deux-unites.svg",
      texte: [
        "Un kilo de fluide n'a pas le même effet sur le climat selon le fluide. Chacun a son **[[PRP|potentiel de réchauffement planétaire : combien de fois ce gaz réchauffe plus que le CO₂, à masse égale et sur cent ans]]**.",
        "Pour la plupart des fluides — ceux de l'**annexe I** du règlement (UE) 2024/573 — la réglementation compte donc en **tonnes équivalent CO₂**.",
        "Pour certains gaz de l'**annexe II** (section 1), elle compte en **kilogrammes**.",
        "Deux machines contenant la même masse peuvent ainsi relever de **périodicités différentes** — parce qu'elles ne contiennent pas le même fluide."
      ],
      lu: "Voici l'idée centrale, et elle surprend souvent. Un kilo de fluide n'a pas du tout le même effet sur le climat selon le fluide dont il s'agit. Chacun possède son potentiel de réchauffement planétaire, son P R P : combien de fois ce gaz réchauffe plus que le C O deux, à masse égale. Pour la plupart des fluides, ceux de l'annexe une du règlement européen de deux mille vingt-quatre, la réglementation compte donc en tonnes équivalent C O deux. Mais pour certains gaz de l'annexe deux, dans sa première section, elle compte en kilogrammes. Conséquence directe : deux machines contenant exactement la même masse peuvent relever de périodicités différentes, simplement parce qu'elles ne contiennent pas le même fluide.",
      voixPerimee: true,
      plus: ["prp"],
      codes: ["4.01", "1.08"]
    },

    {
      id: "03-le-calcul",
      titre: "Le calcul : une multiplication, une division.",
      planche: "planches/teqco2-calcul.svg",
      alt: "Exemple chiffré de la planche : un kilogramme de R-404A qui fuit, PRP 3922, équivaut à environ 3,9 tonnes de CO₂ — c'est ce nombre que la règle regarde.",
      texte: [
        "**Tonnes équivalent CO₂ = masse de fluide (kg) × PRP ÷ 1000.**",
        "Exemple : **10 kg** d'un fluide de **PRP 2000** → 10 × 2000 = 20 000 **kg éq. CO₂** → **20 tonnes** équivalent CO₂.",
        "Le même calcul avec un fluide de **PRP 4** donnerait **0,04 tonne**. La même bouteille, un monde d'écart.",
        "Le PRP se lit dans l'**annexe du règlement (UE) 2024/573** ; il est compté sur **cent ans**.",
        "**C'est ce nombre-là, et lui seul, qui décide de la périodicité.**"
      ],
      lu: "Le calcul tient en une multiplication et une division. Les tonnes équivalent C O deux valent la masse de fluide en kilogrammes, multipliée par le P R P, divisée par mille. Prenons un exemple. Dix kilogrammes d'un fluide dont le P R P vaut deux mille : dix fois deux mille font vingt mille kilogrammes équivalent C O deux, soit vingt tonnes. Le même calcul avec un fluide de P R P quatre donnerait zéro virgule zéro quatre tonne. La même bouteille, et un monde d'écart. Le P R P, lui, se lit dans l'annexe du règlement européen de deux mille vingt-quatre, et il est compté sur cent ans. Retenez que c'est ce nombre-là, et lui seul, qui décide de la périodicité.",
      voixPerimee: true,
      plus: ["prp", "ou-trouver"],
      codes: ["4.01", "1.08"]
    },

    {
      id: "04-les-seuils",
      titre: "Les seuils : plus le dégât possible est grand, plus on regarde souvent.",
      planche: "planches/controle-etancheite_seuils.svg",
      alt: "Trois marches d'escalier : 5, 50 et 500 tonnes équivalent CO₂ pour l'annexe I — 1, 10 et 100 kg pour l'annexe II — donnent un contrôle tous les 12, 6 et 3 mois. Sous le premier seuil : pas de contrôle périodique obligatoire.",
      texte: [
        "Pour les fluides de l'**annexe I** : à partir de **5**, **50** et **500 tonnes équivalent CO₂**, le contrôle revient **tous les 12, 6 et 3 mois**.",
        "Pour les gaz concernés de l'**annexe II** (section 1) : mêmes fréquences, à partir de **1**, **10** et **100 kg**.",
        "Un **système de détection de fuite**, installé et vérifié, **double l'intervalle** entre deux contrôles.",
        "Les équipements **hermétiquement scellés** ont leurs seuils propres.",
        "*Source : règlement (UE) 2024/573, article 5.*"
      ],
      lu: "Passons aux seuils. La logique est simple : plus le dégât possible est grand, plus on regarde souvent. Pour les fluides de l'annexe une : à partir de cinq, cinquante et cinq cents tonnes équivalent C O deux, le contrôle revient tous les douze, six et trois mois. Pour les gaz concernés de l'annexe deux, première section, ce sont les mêmes fréquences, à partir de un, dix et cent kilogrammes. Et lorsqu'un système de détection de fuite est installé et vérifié, l'intervalle entre deux contrôles est doublé. Les équipements hermétiquement scellés, eux, ont leurs seuils propres. Tout cela se lit à l'article cinq du règlement européen de deux mille vingt-quatre.",
      voixPerimee: true,
      plus: ["detection"],
      codes: ["4.01"]
    },

    {
      id: "05-comment",
      titre: "Comment on contrôle : deux familles de méthodes.",
      planche: "../fonds-origine/packs/fluides/res/svg/balayage-detecteur.svg",
      alt: "Détecteur promené lentement, au contact des points sensibles du circuit ; une fuite repérée se confirme par un second passage.",
      texte: [
        "**Méthode directe** — on va voir : détecteur électronique promené sur les points sensibles, mousse, ou traceur.",
        "**Méthode indirecte** — on lit les paramètres de la machine (pressions, températures, niveaux, courant) et on **déduit** qu'il manque du fluide.",
        "L'indirecte repère qu'**il se passe quelque chose**. Elle **ne dit pas où**. Une anomalie relevée par l'indirecte impose un **contrôle direct**.",
        "**Les points à examiner sont toujours les mêmes** : raccords démontables, brasures, vannes, bouchons, joints, passages de tôle.",
        "Un **règlement d'exécution** européen détaille les méthodes ; au plateau, la méthode suit le **matériel réel**."
      ],
      lu: "Passons à la méthode. Il y en a deux familles. La méthode directe : on va voir. Détecteur électronique promené sur les points sensibles, mousse, ou traceur. La méthode indirecte : on lit les paramètres de la machine, pressions, températures, niveaux, courant, et on en déduit qu'il manque du fluide. Attention à bien comprendre la différence : l'indirecte repère qu'il se passe quelque chose, mais elle ne dit pas où. Une anomalie relevée par l'indirecte impose donc un contrôle direct. Sachez que les points à examiner sont toujours les mêmes : les raccords démontables, les brasures, les vannes, les bouchons, les joints et les passages de tôle. Et pour le détail des méthodes, c'est un règlement d'exécution européen qui les décrit ; au plateau, la méthode suit le matériel réel.",
      voixPerimee: true,
      verifier: [
        "Décision plateau attendue : compléter la liste des points sensibles selon les machines réellement présentes au plateau.",
      ],
      plus: ["detecteur"],
      codes: ["4.01", "4.02"]
    },

    {
      id: "06-la-preuve",
      titre: "Et surtout : ce qui n'est pas écrit n'a pas été fait.",
      planche: "planches/controle-etancheite_recontrole.svg",
      texte: [
        "Chaque contrôle est **consigné** : date, opérateur, méthode, résultat, suites données.",
        "Une **fuite trouvée** se répare, puis se **recontrôle** : au plus tôt après **24 heures de fonctionnement**, au plus tard **dans le mois**. Ce contrôle de suivi fait partie de l'obligation, il n'est pas facultatif.",
        "Les enregistrements se conservent **5 ans**. Le **registre** de l'installation suit la machine toute sa vie : c'est lui qu'on présente en cas de contrôle.",
        "**Votre travail ne vaut, juridiquement, que ce que votre écrit en dit.**"
      ],
      lu: "Terminons par ce qui reste quand vous êtes reparti. Chaque contrôle est consigné : la date, l'opérateur, la méthode employée, le résultat, et les suites données. Une fuite trouvée se répare, puis se recontrôle : au plus tôt après vingt-quatre heures de fonctionnement, au plus tard dans le mois. Ce contrôle de suivi fait partie de l'obligation, il n'est pas facultatif. Les enregistrements, eux, se conservent cinq ans. Le registre de l'installation suit la machine pendant toute sa vie, et c'est lui qu'on présente en cas de contrôle. Retenez cette phrase : votre travail ne vaut, juridiquement, que ce que votre écrit en dit.",
      voixPerimee: true,
      plus: ["registre"],
      codes: ["4.03"]
    }
  ],

  retenir: [
    "Le contrôle d'étanchéité est **périodique et obligatoire**, pas une recherche de panne.",
    "**Équivalent CO₂ = masse (kg) × PRP ÷ 1000.** Annexe I : seuils en t éq. CO₂ · annexe II (section 1) : seuils en kg.",
    "**Directe** = on va voir · **indirecte** = on déduit. Une anomalie à l'indirecte impose la directe.",
    "**Une fuite réparée se recontrôle** : après 24 h de fonctionnement, dans le mois.",
    "**Ce qui n'est pas écrit n'a pas été fait** — et l'écrit se garde 5 ans."
  ],

  detours: {

    "prp": {
      question: "Le PRP : d'où sort ce nombre ?",
      ecrans: [
        {
          id: "d-prp-1",
          titre: "Une comparaison avec le CO₂, sur cent ans.",
          planche: "../fonds-origine/packs/fluides/res/svg/prp-echelle.svg",
          texte: [
            "Le PRP répond à une question unique : **à masse égale, combien de fois ce gaz réchauffe-t-il plus que le CO₂ ?**",
            "Le **CO₂ vaut 1**, par définition. Un fluide de PRP 2000 réchauffe donc **2000 fois plus** à masse égale.",
            "La durée de référence est de **cent ans** : un gaz très actif mais qui disparaît vite n'est pas jugé comme un gaz qui reste des siècles.",
            "*Des documents peuvent donner **des PRP différents** pour un même fluide — éditions, arrondis, sources. Pour l'examen comme pour le registre : **la valeur de l'annexe du règlement (UE) 2024/573 fait foi.** Dans le doute, on va à la source — jamais au chiffre le plus commode.*"
          ],
          lu: "Le P R P répond à une question unique : à masse égale, combien de fois ce gaz réchauffe-t-il plus que le C O deux ? Le C O deux vaut un, par définition, et sert de mètre étalon. Un fluide de P R P deux mille réchauffe donc deux mille fois plus, à masse égale. La durée de référence est de cent ans, car un gaz très actif mais qui disparaît vite ne doit pas être jugé comme un gaz qui reste des siècles. Un dernier point utile : des documents peuvent donner des P R P différents pour un même fluide, selon les éditions, les arrondis, les sources. Pour l'examen comme pour le registre, c'est la valeur de l'annexe du règlement européen de deux mille vingt-quatre qui fait foi. Dans le doute, on va à la source, jamais au chiffre le plus commode.",
          voixPerimee: true,
          codes: ["1.08"]
        }
      ]
    },

    "ou-trouver": {
      question: "Où lit-on la charge et le PRP d'une machine ?",
      ecrans: [
        {
          id: "d-trouver-1",
          titre: "Sur la plaque, sur le registre — et on vérifie.",
          planche: "planches/controle-etancheite_ou-lire.svg",
          texte: [
            "La **plaque signalétique** porte normalement le fluide et la **charge nominale** — celle prévue par le constructeur. C'est le premier endroit à regarder.",
            "Le **registre** de l'installation donne l'historique : charges ajoutées, retirées, interventions. C'est lui qui dit ce que la machine contient **réellement** — si les écrits ont suivi.",
            "**Méfiance sur les machines anciennes** : une machine rechargée avec un autre fluide, une plaque effacée, une charge modifiée sans mise à jour.",
            "**Le PRP ne se lit pas sur la machine** : il se cherche dans l'**annexe du règlement (UE) 2024/573**, à partir du nom du fluide."
          ],
          lu: "La plaque signalétique porte normalement le fluide et la charge nominale, celle prévue par le constructeur : c'est le premier endroit à regarder. Le registre de l'installation, lui, donne l'historique : les charges ajoutées, celles retirées, et les interventions. C'est lui qui dit ce que la machine contient réellement, à condition que les écrits aient suivi. Mais soyez méfiant sur les machines anciennes. Vous rencontrerez des machines rechargées avec un autre fluide, des plaques effacées, ou des charges modifiées sans que personne l'ait noté. Enfin, sachez que le P R P ne se lit jamais sur la machine : il se cherche dans l'annexe du règlement européen de deux mille vingt-quatre, à partir du nom du fluide.",
          voixPerimee: true,
          codes: ["4.01"]
        }
      ]
    },

    "detection": {
      question: "Un système de détection de fuite : c'est quoi, au juste ?",
      ecrans: [
        {
          id: "d-detect-1",
          titre: "Un dispositif fixe, qui alerte tout seul.",
          planche: "planches/controle-etancheite_detection-fixe.svg",
          texte: [
            "Ce n'est pas votre détecteur portatif : c'est un dispositif **installé à demeure**, qui surveille en permanence et **alerte l'exploitant**.",
            "Comme il surveille en continu, la réglementation admet de **doubler l'intervalle** entre deux contrôles humains.",
            "Il devient **obligatoire** à partir de **500 tonnes équivalent CO₂** (annexe I) ou de **100 kg** (annexe II concernée).",
            "**Et il se vérifie lui-même au moins tous les 12 mois.** Un détecteur en panne ne surveille rien, et donne l'illusion inverse."
          ],
          lu: "Attention à ne pas confondre : ce n'est pas votre détecteur portatif. C'est un dispositif installé à demeure, qui surveille en permanence et qui alerte l'exploitant tout seul. Et comme il surveille en continu, la réglementation admet de doubler l'intervalle entre deux contrôles humains. Il devient obligatoire à partir de cinq cents tonnes équivalent C O deux pour l'annexe une, ou de cent kilogrammes pour l'annexe deux concernée. Mais retenez bien ceci : il se vérifie lui-même, au moins tous les douze mois. Un détecteur en panne ne surveille rien du tout, et il donne l'illusion exactement inverse.",
          voixPerimee: true,
          codes: ["4.01"]
        }
      ]
    },

    "detecteur": {
      question: "Le détecteur portatif : comment s'en sert-on vraiment ?",
      ecrans: [
        {
          id: "d-detecteur-1",
          titre: "Lentement, par en dessous, sans courant d'air.",
          planche: "planches/controle-etancheite_sonde.svg",
          texte: [
            "**Lentement.** Une sonde promenée vite passe à côté. La bonne vitesse ? **La notice du détecteur la donne — c'est elle qui commande.**",
            "**Par en dessous et tout autour.** La plupart des fluides fluorés sont plus lourds que l'air : ils tombent.",
            "**Sans courant d'air.** Un ventilateur en marche disperse la fuite et vous ne trouverez rien. On arrête, on attend.",
            "**Le détecteur doit correspondre au fluide** : un appareil pour fluides fluorés ne verra pas un hydrocarbure.",
            "Et il se **contrôle avant usage**, avec un **gaz de référence** — sinon vous promenez un objet muet."
          ],
          lu: "Quatre règles, et elles font toute la différence. Premièrement, lentement : une sonde promenée vite passe à côté de la fuite. La bonne vitesse, c'est la notice du détecteur qui la donne, et c'est elle qui commande. Deuxièmement, par en dessous et tout autour, parce que la plupart des fluides fluorés sont plus lourds que l'air et qu'ils tombent. Troisièmement, sans courant d'air : un ventilateur en marche disperse la fuite, et vous ne trouverez rien. On arrête, et on attend. Quatrièmement, le détecteur doit correspondre au fluide recherché : un appareil pour fluides fluorés ne verra pas un hydrocarbure. Et n'oubliez pas de le contrôler avant usage, avec un gaz de référence, sinon vous promenez un objet muet.",
          voixPerimee: true,
          codes: ["4.02"]
        }
      ]
    },

    "registre": {
      question: "Le registre : qu'est-ce qu'on y met exactement ?",
      ecrans: [
        {
          id: "d-registre-1",
          titre: "Tout ce qui entre, tout ce qui sort, tout ce qu'on a regardé.",
          planche: "planches/controle-etancheite_registre.svg",
          texte: [
            "**Les quantités** : fluide en place, fluide ajouté, fluide récupéré — avec leur nature (neuf, recyclé, régénéré), leur origine et leur destination.",
            "**Les contrôles d'étanchéité** : date, méthode, résultat, et l'identité de l'opérateur avec son attestation.",
            "**Les fuites** : localisation, réparation, date du contrôle de suivi.",
            "**La fin de vie** : mise à l'arrêt définitif, et ce qu'est devenu le fluide.",
            "Ces enregistrements se conservent **au moins 5 ans**. *Source : règlement (UE) 2024/573, article 7.*",
            "*C'est ce document qui fait de vous un professionnel traçable — et c'est le premier que demande un contrôleur.*"
          ],
          lu: "Le registre reçoit quatre familles d'informations. Les quantités, d'abord : le fluide en place, le fluide ajouté, le fluide récupéré, avec leur nature, neuf, recyclé ou régénéré, leur origine et leur destination. Les contrôles d'étanchéité ensuite : la date, la méthode, le résultat, et l'identité de l'opérateur avec son attestation. Les fuites : leur localisation, la réparation faite, et la date du contrôle de suivi. Et enfin la fin de vie : la mise à l'arrêt définitif, et ce qu'est devenu le fluide. Ces enregistrements se conservent au moins cinq ans, c'est l'article sept du règlement. C'est ce document qui fait de vous un professionnel traçable. Et c'est le premier que demande un contrôleur.",
          voixPerimee: true,
          codes: ["4.03"]
        }
      ]
    }
  }
});
