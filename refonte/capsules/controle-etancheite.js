/* =====================================================================
   controle-etancheite.js — « Le contrôle d'étanchéité : qui, quand, comment »
   ---------------------------------------------------------------------
   Redécoupage du fonds : etancheite-interactive, points-de-fuite.svg,
   balayage-detecteur.svg.

   ⚠️ CAPSULE LA PLUS EXPOSÉE DE L'ENSEMBLE
   Tout ce qui est chiffré ici est RÉGLEMENTAIRE, donc daté et susceptible
   d'avoir changé. La capsule est donc bâtie sur la LOGIQUE — pourquoi une
   périodicité, pourquoi l'équivalent CO₂ — et CHAQUE valeur numérique
   porte un « À VÉRIFIER ». C'est exactement l'usage du mode relecture :
   faire trancher par ceux qui appliquent le texte tous les jours.
   ===================================================================== */
CAPSULE({
  id: "controle-etancheite",
  ordre: 6,
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
      titre: "La périodicité ne dépend pas des kilos. Elle dépend du dégât.",
      texte: [
        "Un kilo de fluide n'a pas le même effet sur le climat selon le fluide. Chacun a son **[[PRP|potentiel de réchauffement planétaire : combien de fois ce gaz réchauffe plus que le CO₂, à masse égale et sur cent ans]]**.",
        "La réglementation ne raisonne donc **pas en kilogrammes**, mais en **tonnes équivalent CO₂**.",
        "Deux machines contenant la même masse peuvent ainsi relever de **périodicités différentes** — parce qu'elles ne contiennent pas le même fluide."
      ],
      lu: "Voici l'idée centrale, et elle surprend souvent. Un kilo de fluide n'a pas du tout le même effet sur le climat selon le fluide dont il s'agit. Chacun possède son potentiel de réchauffement planétaire, son P R P : combien de fois ce gaz réchauffe plus que le C O deux, à masse égale. La réglementation ne raisonne donc pas en kilogrammes, mais en tonnes équivalent C O deux. Conséquence directe : deux machines contenant exactement la même masse peuvent relever de périodicités différentes, simplement parce qu'elles ne contiennent pas le même fluide.",
      plus: ["prp"],
      codes: ["4.01", "1.08"]
    },

    {
      id: "03-le-calcul",
      titre: "Le calcul : une multiplication, une division.",
      texte: [
        "**Tonnes équivalent CO₂ = masse de fluide (kg) × PRP ÷ 1000.**",
        "Exemple : **10 kg** d'un fluide de **PRP 2000** → 10 × 2000 = 20 000 kg éq. CO₂ → **20 tonnes** équivalent CO₂.",
        "Le même calcul avec un fluide de **PRP 4** donnerait **0,04 tonne**. La même bouteille, un monde d'écart.",
        "**C'est ce nombre-là, et lui seul, qui décide de la périodicité.**"
      ],
      lu: "Le calcul tient en une multiplication et une division. Les tonnes équivalent C O deux valent la masse de fluide en kilogrammes, multipliée par le P R P, divisée par mille. Prenons un exemple. Dix kilogrammes d'un fluide dont le P R P vaut deux mille : dix fois deux mille font vingt mille kilogrammes équivalent C O deux, soit vingt tonnes. Le même calcul avec un fluide de P R P quatre donnerait zéro virgule zéro quatre tonne. La même bouteille, et un monde d'écart. Retenez que c'est ce nombre-là, et lui seul, qui décide de la périodicité.",
      verifier: [
        "🔴 **La formule : masse × PRP ÷ 1000.** À confirmer, ainsi que la façon de la présenter aux stagiaires.",
      ],
      plus: ["prp", "ou-trouver"],
      codes: ["4.01", "1.08"]
    },

    {
      id: "04-les-seuils",
      titre: "Les seuils : plus le dégât possible est grand, plus on regarde souvent.",
      texte: [
        "En dessous d'un premier seuil : **pas de contrôle périodique obligatoire**.",
        "Au-dessus : **une fois par an**. Puis, pour les charges plus lourdes : **tous les six mois**. Puis **tous les trois mois**.",
        "Les seuils couramment cités sont **5**, **50** et **500 tonnes équivalent CO₂**.",
        "Et lorsqu'un **système de détection de fuite** est installé et vérifié, les périodicités sont **allongées**."
      ],
      lu: "Passons aux seuils. La logique est simple : plus le dégât possible est grand, plus on regarde souvent. En dessous d'un premier seuil, il n'y a pas de contrôle périodique obligatoire. Au-dessus, c'est une fois par an. Puis, pour les charges plus lourdes, tous les six mois. Puis tous les trois mois. Les seuils couramment cités sont cinq, cinquante et cinq cents tonnes équivalent C O deux. Et lorsqu'un système de détection de fuite est installé et vérifié, les périodicités sont allongées.",
      verifier: [
        "🔴 **LES SEUILS ET LES PÉRIODICITÉS — le point le plus exposé de tout l'ensemble.** 5 / 50 / 500 t éq. CO₂ pour 12 / 6 / 3 mois : à confirmer sur le texte en vigueur.",
        "🔴 **L'allongement des périodicités en présence d'un système de détection de fuite.** Dans quelle proportion exactement ?",
        "**Les équipements hermétiquement scellés** bénéficient-ils toujours d'une exemption, et à quel seuil ?",
        "Le règlement applicable a changé récemment. **Quelle référence citer aux stagiaires** ?",
      ],
      plus: ["detection"],
      codes: ["4.01"]
    },

    {
      id: "05-comment",
      titre: "Comment on contrôle : deux familles de méthodes.",
      planche: "../fonds-origine/packs/fluides/res/svg/balayage-detecteur.svg",
      texte: [
        "**Méthode directe** — on va voir : détecteur électronique promené sur les points sensibles, mousse, ou traceur.",
        "**Méthode indirecte** — on lit les paramètres de la machine (pressions, températures, niveaux, courant) et on **déduit** qu'il manque du fluide.",
        "L'indirecte repère qu'**il se passe quelque chose**. Elle **ne dit pas où**. Une anomalie relevée par l'indirecte impose un **contrôle direct**.",
        "**Les points à examiner sont toujours les mêmes** : raccords démontables, brasures, vannes, bouchons, joints, passages de tôle."
      ],
      lu: "Passons à la méthode. Il y en a deux familles. La méthode directe : on va voir. Détecteur électronique promené sur les points sensibles, mousse, ou traceur. La méthode indirecte : on lit les paramètres de la machine, pressions, températures, niveaux, courant, et on en déduit qu'il manque du fluide. Attention à bien comprendre la différence : l'indirecte repère qu'il se passe quelque chose, mais elle ne dit pas où. Une anomalie relevée par l'indirecte impose donc un contrôle direct. Et sachez que les points à examiner sont toujours les mêmes : les raccords démontables, les brasures, les vannes, les bouchons, les joints et les passages de tôle.",
      verifier: [
        "**La distinction directe / indirecte** et la règle « anomalie à l'indirecte → contrôle direct ». À confirmer.",
        "**La liste des points sensibles** est-elle complète pour les machines de votre plateau ?",
      ],
      plus: ["detecteur"],
      codes: ["4.01", "4.02"]
    },

    {
      id: "06-la-preuve",
      titre: "Et surtout : ce qui n'est pas écrit n'a pas été fait.",
      texte: [
        "Chaque contrôle est **consigné** : date, opérateur, méthode, résultat, suites données.",
        "Une **fuite trouvée** se répare, puis se **recontrôle** — le recontrôle fait partie de l'obligation, il n'est pas facultatif.",
        "Le **registre** de l'installation suit la machine toute sa vie. C'est lui qu'on présente en cas de contrôle.",
        "**Votre travail ne vaut, juridiquement, que ce que votre écrit en dit.**"
      ],
      lu: "Terminons par ce qui reste quand vous êtes reparti. Chaque contrôle est consigné : la date, l'opérateur, la méthode employée, le résultat, et les suites données. Une fuite trouvée se répare, puis se recontrôle. Et ce recontrôle fait partie de l'obligation, il n'est pas facultatif. Le registre de l'installation, lui, suit la machine pendant toute sa vie, et c'est lui qu'on présente en cas de contrôle. Retenez cette phrase : votre travail ne vaut, juridiquement, que ce que votre écrit en dit.",
      verifier: [
        "**Le délai de recontrôle après réparation.** Faut-il donner un nombre de jours précis ?",
        "**Le contenu exact du registre** et sa durée de conservation. À confirmer.",
      ],
      plus: ["registre"],
      codes: ["4.03"]
    }
  ],

  retenir: [
    "Le contrôle d'étanchéité est **périodique et obligatoire**, pas une recherche de panne.",
    "**Équivalent CO₂ = masse (kg) × PRP ÷ 1000.** C'est ce nombre qui commande la périodicité.",
    "**Directe** = on va voir · **indirecte** = on déduit. Une anomalie à l'indirecte impose la directe.",
    "**Une fuite réparée se recontrôle.**",
    "**Ce qui n'est pas écrit n'a pas été fait.**"
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
            "*Les valeurs sont révisées périodiquement. Quand deux sources diffèrent, **on retient la plus élevée** — c'est le sens de la précaution.*"
          ],
          lu: "Le P R P répond à une question unique : à masse égale, combien de fois ce gaz réchauffe-t-il plus que le C O deux ? Le C O deux vaut un, par définition, et sert de mètre étalon. Un fluide de P R P deux mille réchauffe donc deux mille fois plus, à masse égale. La durée de référence est de cent ans, car un gaz très actif mais qui disparaît vite ne doit pas être jugé comme un gaz qui reste des siècles. Un dernier point utile : ces valeurs sont révisées périodiquement. Quand deux sources donnent des chiffres différents, on retient la plus élevée. C'est le sens même de la précaution.",
          verifier: [
            "**La règle « valeurs concurrentes → on retient le PRP le plus élevé ».** C'est la règle interne de la maison — faut-il l'enseigner comme telle aux stagiaires ?",
          ],
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
          texte: [
            "La **plaque signalétique** porte normalement le fluide et la charge. C'est le premier endroit à regarder.",
            "Le **registre** de l'installation donne l'historique : charges ajoutées, retirées, interventions.",
            "**Méfiance sur les machines anciennes** : une machine rechargée avec un autre fluide, une plaque effacée, une charge modifiée sans mise à jour.",
            "**Le PRP ne se lit pas sur la machine** : il se cherche dans les tables réglementaires, à partir du fluide."
          ],
          lu: "La plaque signalétique porte normalement le fluide et la charge : c'est le premier endroit à regarder. Le registre de l'installation, lui, donne l'historique : les charges ajoutées, celles retirées, et les interventions. Mais soyez méfiant sur les machines anciennes. Vous rencontrerez des machines rechargées avec un autre fluide, des plaques effacées, ou des charges modifiées sans que personne l'ait noté. Enfin, sachez que le P R P ne se lit jamais sur la machine : il se cherche dans les tables réglementaires, à partir du nom du fluide.",
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
          texte: [
            "Ce n'est pas votre détecteur portatif : c'est un dispositif **installé à demeure**, qui surveille en permanence et **alerte l'exploitant**.",
            "Comme il surveille en continu, la réglementation admet **d'espacer** les contrôles humains.",
            "**Mais il doit lui-même être vérifié périodiquement.** Un détecteur en panne ne surveille rien, et donne l'illusion inverse.",
            "*Au-delà d'une certaine charge, ce dispositif devient obligatoire.*"
          ],
          lu: "Attention à ne pas confondre : ce n'est pas votre détecteur portatif. C'est un dispositif installé à demeure, qui surveille en permanence et qui alerte l'exploitant tout seul. Et comme il surveille en continu, la réglementation admet d'espacer les contrôles humains. Mais retenez bien ceci : il doit lui-même être vérifié périodiquement. Un détecteur en panne ne surveille rien du tout, et il donne l'illusion exactement inverse. Sachez enfin qu'au-delà d'une certaine charge, ce dispositif devient obligatoire.",
          verifier: [
            "🔴 **Le seuil de charge à partir duquel un système de détection fixe devient obligatoire**, et **la périodicité de vérification du détecteur lui-même**.",
          ],
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
          texte: [
            "**Lentement.** Une sonde promenée vite passe à côté : on avance de quelques centimètres par seconde, pas plus.",
            "**Par en dessous et tout autour.** Les fluides sont plus lourds que l'air : ils tombent.",
            "**Sans courant d'air.** Un ventilateur en marche disperse la fuite et vous ne trouverez rien. On arrête, on attend.",
            "**Le détecteur doit correspondre au fluide** : un appareil pour fluides fluorés ne verra pas un hydrocarbure.",
            "Et il se **vérifie** : sensibilité contrôlée périodiquement, sinon vous promenez un objet muet."
          ],
          lu: "Quatre règles, et elles font toute la différence. Premièrement, lentement : une sonde promenée vite passe à côté de la fuite. On avance de quelques centimètres par seconde, pas davantage. Deuxièmement, par en dessous et tout autour, parce que les fluides sont plus lourds que l'air et qu'ils tombent. Troisièmement, sans courant d'air : un ventilateur en marche disperse la fuite, et vous ne trouverez rien. On arrête, et on attend. Quatrièmement, le détecteur doit correspondre au fluide recherché : un appareil pour fluides fluorés ne verra pas un hydrocarbure. Et n'oubliez pas qu'il se vérifie : sa sensibilité doit être contrôlée périodiquement, sinon vous promenez un objet muet.",
          verifier: [
            "**La vitesse de déplacement de la sonde** et **la périodicité de vérification du détecteur portatif**. Valeurs à préciser ?",
          ],
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
          texte: [
            "**Les quantités** : fluide ajouté, fluide récupéré, avec leur origine et leur destination.",
            "**Les contrôles** : date, méthode, résultat, nom et attestation de l'opérateur.",
            "**Les fuites** : localisation, réparation, date du recontrôle.",
            "**Les interventions** : remplacement d'organe, modification, mise à l'arrêt définitif.",
            "*C'est ce document qui fait de vous un professionnel traçable — et c'est le premier que demande un contrôleur.*"
          ],
          lu: "Le registre reçoit quatre familles d'informations. Les quantités, d'abord : le fluide ajouté, le fluide récupéré, avec leur origine et leur destination. Les contrôles ensuite : la date, la méthode, le résultat, le nom et l'attestation de l'opérateur. Les fuites : leur localisation, la réparation faite, et la date du recontrôle. Et enfin les interventions : remplacement d'un organe, modification, ou mise à l'arrêt définitif. C'est ce document qui fait de vous un professionnel traçable. Et c'est le premier que demande un contrôleur.",
          verifier: [
            "**Le contenu exact exigé du registre** et **sa durée de conservation**. À caler sur le texte en vigueur.",
          ],
          codes: ["4.03"]
        }
      ]
    }
  }
});
