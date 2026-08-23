window.CO2_MODULE = {
  id: "co2-etats-physiques",
  title: "Point triple, point critique",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 2",
  codes: ["1.09", "13.15"],
  nextStep: "La gare suivante transforme ces repères thermodynamiques en décisions de sécurité pendant l’arrêt de la machine.",
  nextUrl: "../co2-pressions-securite/index.html",
  nextLabel: "Gare 3 · Pressions et sécurité",
  summaryVisual: { kind: "phase", label: "Diagramme qualitatif de phases du R744 avec points triple et critique" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · pression et température", url: "../../capsule.html?sujet=pression-temperature" }
  ],
  lessons: [
    {
      id: "lire-diagramme",
      short: "Axes",
      kicker: "Gare 2 · Lire avant de calculer",
      recall: true,
      title: "Le diagramme de phases relie température et pression absolue",
      lead: "Chaque zone correspond à un état possible : solide, liquide, vapeur ou fluide supercritique.",
      details: [
        "Une frontière sépare deux états en équilibre. La courbe liquide-vapeur porte la relation de saturation utilisée en régime subcritique.",
        "Les pressions des points remarquables sont des pressions **absolues**. Mélanger bar relatif et bar absolu déplacerait tous les repères."
      ],
      box: { type: "key", text: "Toujours lire le titre, les axes et les unités avant de chercher un état." },
      visual: { kind: "phase", title: "Le territoire thermodynamique du R744", label: "Diagramme qualitatif pression-température avec quatre zones et deux points remarquables" }
    },
    {
      id: "point-triple",
      short: "Triple",
      kicker: "Gare 2 · Trois états",
      title: "Au point triple, solide, liquide et vapeur peuvent coexister",
      lead: "Pour le R744, le point triple se situe à environ **−56,6 °C et 5,2 bar absolus**.",
      details: [
        "Sous cette pression, le CO₂ liquide n’est pas un état stable. Le trajet peut alors conduire directement entre vapeur et solide.",
        "Ce repère explique pourquoi une détente ou une mise en œuvre mal conduite peut former de la glace carbonique dans un circuit."
      ],
      box: { type: "warning", text: "Le point triple n’est pas une consigne d’intervention : c’est un seuil à respecter dans une procédure R744 dédiée." },
      visual: { kind: "phase", title: "Le point où trois phases se rencontrent", label: "Le point triple est repéré à moins 56,6 degrés Celsius et 5,2 bar absolus" }
    },
    {
      id: "glace-carbonique",
      short: "Glace",
      kicker: "Gare 2 · Risque de solide",
      title: "La glace carbonique peut brûler par le froid et bloquer un passage",
      lead: "À la pression atmosphérique, le CO₂ solide sublime vers **−78,4 °C** au lieu de fondre en liquide.",
      details: [
        "Dans un système, une chute rapide sous le point triple peut produire un solide qui obstrue un raccord, une vanne ou une portion de tuyauterie.",
        "La réponse sûre n’est pas d’improviser une purge : on arrête l’action, on sécurise la zone et on applique la procédure du matériel avec un titulaire de l’attestation catégorie B."
      ],
      box: { type: "warning", text: "Nuage blanc ne signifie pas « simple vapeur d’eau ». Le froid extrême et le CO₂ invisible restent présents." },
      visual: { kind: "dryIce", title: "Du gaz au solide quand la pression chute", label: "Chaîne vapeur, détente rapide, glace carbonique avec risques de brûlure et d’obstruction" }
    },
    {
      id: "point-critique",
      short: "Critique",
      kicker: "Gare 2 · Fin de la condensation",
      title: "Au-dessus de 31,0 °C et 73,8 bar absolus, liquide et vapeur ne se distinguent plus",
      lead: "Le point critique marque la limite supérieure d’un rejet de chaleur par condensation.",
      details: [
        "Au-dessus de ce point, le fluide est supercritique. Il peut être refroidi, mais il ne traverse pas une condensation classique à haute pression.",
        "Le mot « critique » décrit ici un état thermodynamique. Il ne signifie pas à lui seul « situation dangereuse »."
      ],
      box: { type: "key", text: "Cette limite explique le passage du condenseur au refroidisseur de gaz dans le cycle transcritique." },
      visual: { kind: "phase", title: "La frontière qui change le cycle", label: "Le point critique est repéré à 31 degrés Celsius et 73,8 bar absolus" }
    },
    {
      id: "classer-etat",
      short: "Classer",
      kicker: "Gare 2 · Manipulation",
      title: "Classez une situation sans confondre les deux points",
      lead: "On vous indique que la haute pression rejette sa chaleur au-dessus de 31 °C et au-dessus de la pression critique.",
      details: [
        "Cherchez d’abord la zone du diagramme, puis le type de rejet de chaleur possible.",
        "Cette démarche prépare la différence entre les cycles subcritique et transcritique."
      ],
      box: { type: "exam", text: "Dire « supercritique » décrit l’état HP ; dire « transcritique » décrit le cycle qui traverse la frontière." },
      visual: { kind: "phase", title: "Dans quelle zone se trouve la haute pression ?", label: "Diagramme de phases utilisé pour classer une condition haute pression" },
      activity: {
        prompt: "Au-dessus du point critique en HP :",
        options: ["condensation classique", "fluide supercritique", "glace carbonique certaine"],
        correct: 1,
        why: "La haute pression se trouve dans la zone supercritique ; la chaleur y est rejetée sans condensation classique."
      }
    }
  ],
  quiz: [
    { prompt: "Quelle paire correspond au point triple du R744 ?", options: ["−56,6 °C et 5,2 bar abs", "31,0 °C et 73,8 bar abs", "0 °C et 1 bar rel"], correct: 0, why: "Le point triple du R744 est environ −56,6 °C et 5,2 bar absolus.", code: "1.09 · 13.15", visual: "phase" },
    { prompt: "Que peut-il se produire sous la pression du point triple ?", options: ["Le liquide devient toujours stable", "Le CO₂ ne peut exister qu’en liquide", "La phase liquide n’est plus stable et du solide peut se former"], correct: 2, why: "Sous le point triple, le trajet entre vapeur et solide peut former de la glace carbonique.", code: "13.15", visual: "dryIce" },
    { prompt: "Quel risque direct apporte la glace carbonique ?", options: ["Brûlure par le froid et obstruction", "Inflammation spontanée", "Disparition de la pression"], correct: 0, why: "Le solide est extrêmement froid et peut bloquer un passage.", code: "13.15", visual: "dryIce" },
    { prompt: "Que marque le point critique ?", options: ["La limite de la condensation liquide-vapeur", "La mise à l’arrêt électrique", "La température minimale de l’évaporateur"], correct: 0, why: "Au-dessus, liquide et vapeur ne sont plus distinguables et la condensation classique n’a plus lieu.", code: "1.09", visual: "phase" },
    { prompt: "Pourquoi préciser bar absolus ?", options: ["Pour éviter de déplacer le repère en mélangeant les références", "Parce que le bar relatif est toujours interdit", "Parce que la température devient inutile"], correct: 0, why: "Un point thermodynamique se lit avec une référence de pression clairement définie.", code: "1.01 · 1.09", visual: "phase" }
  ],
  sources: window.CO2_SOURCES
};
