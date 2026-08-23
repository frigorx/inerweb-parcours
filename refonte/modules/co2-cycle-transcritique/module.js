window.CO2_MODULE = {
  id: "co2-cycle-transcritique",
  title: "Le cycle transcritique",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 5",
  codes: ["1.09", "11.06"],
  nextStep: "La gare suivante ouvre la partie haute pression : refroidisseur de gaz, vanne HP, réservoir flash et régulation de pression intermédiaire.",
  nextUrl: "../co2-flash-regulation-hp/index.html",
  nextLabel: "Gare 6 · Flash et régulation HP",
  summaryVisual: { kind: "transcritical", label: "Cycle R744 transcritique avec refroidisseur de gaz et vanne haute pression" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · pression et température", url: "../../capsule.html?sujet=pression-temperature" }
  ],
  lessons: [
    {
      id: "traverser",
      short: "Traverser",
      kicker: "Gare 5 · Changer de régime",
      recall: true,
      title: "Transcritique signifie que le cycle traverse la frontière critique",
      lead: "La compression porte le R744 au-dessus de 31 °C et de 73,8 bar absolus sur le côté haute pression.",
      details: [
        "Le fluide quitte ensuite la région supercritique pendant la détente et revient vers les états diphasiques de l’évaporation.",
        "Le cycle conserve compresseur, rejet de chaleur, détente et évaporation, mais la transformation haute pression n’est plus une condensation."
      ],
      box: { type: "key", text: "Le mot décrit un trajet qui passe d’un côté à l’autre du point critique, pas une machine continuellement supercritique partout." },
      visual: { kind: "transcritical", title: "La Croix du Frigoriste change en haute pression", label: "Compresseur à droite, refroidisseur de gaz en haut, vanne HP à gauche et évaporateur en bas" }
    },
    {
      id: "gas-cooler",
      short: "Gaz cooler",
      kicker: "Gare 5 · Rejeter la chaleur",
      title: "Le refroidisseur de gaz abaisse la température sans condenser en haute pression",
      lead: "Au-dessus du point critique, il n’existe plus de frontière liquide-vapeur à franchir.",
      details: [
        "Le terme français **refroidisseur de gaz** décrit la fonction. L’expression anglaise gas cooler reste courante sur les plans et les notices.",
        "La température de sortie dépend de l’air entrant, de l’échangeur et de la commande des ventilateurs. Elle devient une mesure majeure du fonctionnement."
      ],
      box: { type: "warning", text: "Appeler systématiquement cet organe « condenseur » masque le changement de physique du cycle." },
      visual: { kind: "transcritical", title: "Refroidir sans palier de condensation", label: "Le rejet de chaleur se fait dans un refroidisseur de gaz situé en haut du circuit" }
    },
    {
      id: "p-et-t",
      short: "P et T",
      kicker: "Gare 5 · Deux grandeurs à mesurer",
      title: "En supercritique, pression et température ne sont plus liées par une saturation unique",
      lead: "Pour connaître l’état à la sortie du refroidisseur de gaz, il faut au minimum une pression **et** une température.",
      details: [
        "Une même pression supercritique peut correspondre à plusieurs températures, et inversement. La table de saturation seule ne suffit plus.",
        "Le régulateur utilise donc la pression haute et la température de sortie pour rechercher une condition adaptée à la charge et à l’ambiance."
      ],
      box: { type: "key", text: "Dans la haute pression transcritique : mesurer P et T au bon endroit, puis lire la commande demandée." },
      visual: { kind: "pressureControl", title: "La régulation reçoit plusieurs informations", label: "Pression du refroidisseur et température de sortie alimentent la commande de la vanne haute pression" }
    },
    {
      id: "pression-optimale",
      short: "Optimiser",
      kicker: "Gare 5 · Performance",
      title: "La pression du refroidisseur de gaz influence capacité, puissance et COP",
      lead: "À conditions données, une pression trop basse ou trop haute peut réduire la performance.",
      details: [
        "La valeur optimale varie avec la température de sortie du refroidisseur, l’évaporation, la charge et la stratégie de récupération de chaleur.",
        "Il n’existe donc pas une consigne universelle à saisir dans toutes les centrales. Le régulateur et le dossier du système commandent."
      ],
      box: { type: "exam", text: "La pression HP transcritique n’est pas seulement une conséquence : c’est aussi une variable de régulation énergétique." },
      visual: { kind: "pressureControl", title: "Chercher une condition efficace", label: "Boucle de régulation entre mesure de haute pression, contrôleur et vanne HP" }
    },
    {
      id: "distinguer",
      short: "Distinguer",
      kicker: "Gare 5 · Manipulation",
      title: "Le rejet de chaleur se fait au-dessus du point critique",
      lead: "Choisissez le nom de l’organe et la mesure nécessaire pour interpréter sa sortie.",
      details: [
        "Le bon choix doit traduire l’absence de condensation classique et l’indépendance de la pression et de la température.",
        "Ce repère prépare la lecture de la vanne HP et du réservoir flash."
      ],
      box: { type: "key", text: "Au-dessus du point critique : refroidisseur de gaz, avec P et T mesurées séparément." },
      visual: { kind: "transcritical", title: "Quel langage employer ?", label: "Cycle transcritique montrant le refroidisseur de gaz en haute pression" },
      activity: {
        prompt: "Choisissez la bonne lecture :",
        options: ["condenseur + P seule", "refroidisseur de gaz + P et T", "évaporateur + T seule"],
        correct: 1,
        why: "Le rejet de chaleur supercritique demande une pression et une température pour définir le point de sortie."
      }
    }
  ],
  quiz: [
    { prompt: "Que signifie transcritique ?", options: ["Le cycle traverse le point critique", "Toute la machine est toujours solide", "La basse pression dépasse toujours la haute"], correct: 0, why: "Le trajet passe de la région subcritique à la région supercritique puis revient.", code: "1.09", visual: "transcritical" },
    { prompt: "Pourquoi parle-t-on de refroidisseur de gaz ?", options: ["Il n’y a pas de rejet de chaleur", "Le fluide HP est refroidi sans condensation classique", "Le compresseur est refroidi par de l’eau"], correct: 1, why: "Au-dessus du point critique, liquide et vapeur ne sont plus séparés par une condensation.", code: "1.09 · 11.06", visual: "transcritical" },
    { prompt: "Quelles mesures décrivent la sortie du refroidisseur en régime supercritique ?", options: ["Pression et température", "Masse seule", "Température de saturation seule"], correct: 0, why: "P et T doivent être connues séparément dans cette région.", code: "1.09", visual: "measure" },
    { prompt: "Quel effet a la pression haute sur le cycle ?", options: ["Aucun", "Elle influence capacité, puissance et COP", "Elle ne concerne que la couleur du tube"], correct: 1, why: "La pression du refroidisseur de gaz est une variable majeure de performance.", code: "11.06", visual: "pressureControl" },
    { prompt: "Existe-t-il une consigne HP unique pour toutes les installations ?", options: ["Oui, toujours 90 bar", "Oui, toujours la pression critique", "Non, elle dépend du système et des conditions"], correct: 2, why: "Le contrôleur adapte la référence selon le système, la charge, l’ambiance et la stratégie choisie.", code: "11.06", visual: "pressureControl" }
  ],
  sources: window.CO2_SOURCES
};
