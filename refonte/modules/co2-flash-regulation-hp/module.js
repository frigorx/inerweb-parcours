window.CO2_MODULE = {
  id: "co2-flash-regulation-hp",
  title: "Flash et régulation HP",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 6",
  codes: ["1.05", "11.06", "13.16"],
  nextStep: "Les organes sont en place. La gare suivante part des capteurs et construit une démarche de diagnostic à indices croisés.",
  nextUrl: "../co2-mesures-diagnostic/index.html",
  nextLabel: "Gare 7 · Mesures et diagnostic",
  summaryVisual: { kind: "flash", label: "Refroidisseur de gaz, vanne HP et réservoir flash séparant vapeur et liquide" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · le circuit", url: "../../capsule.html?sujet=le-circuit" }
  ],
  lessons: [
    {
      id: "chaine-hp",
      short: "Chaîne HP",
      kicker: "Gare 6 · Du rejet au stockage",
      recall: true,
      title: "Le fluide sort du refroidisseur de gaz puis traverse la vanne haute pression",
      lead: "Cette vanne fait chuter le fluide vers la pression intermédiaire du réservoir flash.",
      details: [
        "Elle module le débit pour maintenir la condition haute pression demandée par le régulateur.",
        "Après la détente, une partie du fluide devient vapeur instantanée tandis que l’autre reste liquide : le réservoir doit séparer les deux."
      ],
      box: { type: "key", text: "Ordre de lecture : refroidisseur de gaz → vanne HP → réservoir flash." },
      visual: { kind: "flash", title: "La chaîne haute pression", label: "Le fluide refroidi traverse la vanne HP puis entre dans le réservoir flash" }
    },
    {
      id: "reservoir-flash",
      short: "Séparer",
      kicker: "Gare 6 · Deux phases",
      title: "Le réservoir flash sépare la vapeur en haut et le liquide en bas",
      lead: "Le liquide alimente les postes froid ; la vapeur flash doit être gérée sans traverser inutilement les évaporateurs.",
      details: [
        "La séparation stabilise une réserve liquide à pression intermédiaire. Le niveau, la pression et les chemins de vapeur appartiennent tous au diagnostic.",
        "Selon l’architecture, la vapeur rejoint l’aspiration MT, un compresseur parallèle ou un autre dispositif d’optimisation."
      ],
      box: { type: "warning", text: "Un réservoir flash n’est pas une bouteille liquide classique posée au hasard : il appartient à une stratégie de pression." },
      visual: { kind: "flash", title: "Voir la séparation après détente", label: "Réservoir flash avec vapeur en partie haute, liquide en partie basse et deux sorties distinctes" }
    },
    {
      id: "boucle-hp",
      short: "Boucle HP",
      kicker: "Gare 6 · Première boucle",
      title: "La boucle haute pression commande la vanne placée avant le réservoir",
      lead: "Elle reçoit notamment la pression du refroidisseur de gaz et sa température de sortie.",
      details: [
        "Son objectif est de maintenir une condition de haute pression cohérente avec la performance et les limites de l’installation.",
        "Une vanne trop ouverte ou trop fermée n’a pas une signification fixe : il faut lire la mesure, la consigne, la commande et la réponse du système."
      ],
      box: { type: "key", text: "Boucle HP : capteurs haute pression → régulateur → vanne HP." },
      visual: { kind: "pressureControl", title: "Commander la condition haute pression", label: "Boucle reliant pression haute, régulateur et vanne HP" }
    },
    {
      id: "boucle-receiver",
      short: "Boucle flash",
      kicker: "Gare 6 · Deuxième boucle",
      title: "Une autre boucle maintient la pression du réservoir flash",
      lead: "La vanne de gaz flash règle le débit de vapeur quittant la partie haute du réservoir.",
      details: [
        "Cette boucle protège la pression intermédiaire et la disponibilité du liquide pour les postes froid.",
        "Confondre la vanne HP avec la vanne de gaz flash conduit à agir sur le mauvais niveau de pression."
      ],
      box: { type: "exam", text: "Nommer séparément pression du refroidisseur de gaz et pression du réservoir avant toute hypothèse." },
      visual: { kind: "regulation", title: "Deux boucles qui coopèrent", label: "Boucle haute pression et boucle de pression du réservoir avec deux actionneurs distincts" }
    },
    {
      id: "choisir-boucle",
      short: "Choisir",
      kicker: "Gare 6 · Manipulation",
      title: "La pression du réservoir flash dépasse sa consigne",
      lead: "La haute pression du refroidisseur est stable et sa commande répond normalement.",
      details: [
        "Quel organe appartient d’abord à l’hypothèse portant sur la pression intermédiaire ?",
        "La bonne réponse ne condamne pas l’organe : elle choisit le prochain contrôle de la boucle concernée."
      ],
      box: { type: "key", text: "Isoler la boucle fautive réduit les remplacements au hasard." },
      visual: { kind: "regulation", title: "Quelle boucle contrôler ?", label: "Deux boucles distinctes pour la haute pression et le réservoir flash" },
      activity: {
        prompt: "Contrôle prioritaire :",
        options: ["vanne de gaz flash", "détendeur d’évaporateur LT", "ventilateur du local"],
        correct: 0,
        why: "La vanne de gaz flash et sa commande appartiennent directement à la boucle de pression du réservoir."
      }
    }
  ],
  quiz: [
    { prompt: "Quel est l’ordre correct en haute pression ?", options: ["Réservoir, compresseur, évaporateur", "Refroidisseur de gaz, vanne HP, réservoir flash", "Vanne flash, condenseur, bouteille"], correct: 1, why: "La vanne HP détend le fluide refroidi vers la pression intermédiaire du réservoir.", code: "11.06 · 13.02", visual: "flash" },
    { prompt: "Que sépare le réservoir flash ?", options: ["Huile et eau", "Vapeur et liquide après la détente HP", "Air et azote"], correct: 1, why: "La détente produit un mélange ; le réservoir garde la vapeur en haut et le liquide en bas.", code: "1.05 · 11.06", visual: "flash" },
    { prompt: "Que commande la boucle haute pression ?", options: ["La vanne HP", "La porte du local", "Le voyant d’huile"], correct: 0, why: "La vanne HP module le passage du refroidisseur de gaz vers le réservoir.", code: "11.06", visual: "pressureControl" },
    { prompt: "Que commande la boucle de pression du réservoir ?", options: ["La vanne de gaz flash", "Le point critique", "La masse moléculaire"], correct: 0, why: "Elle module l’évacuation de la vapeur flash pour maintenir la pression intermédiaire.", code: "11.06", visual: "regulation" },
    { prompt: "Une vanne paraît très ouverte. Quelle conclusion est correcte ?", options: ["Elle est forcément défectueuse", "Il faut croiser mesure, consigne, commande et réponse", "Il faut la fermer manuellement"], correct: 1, why: "La position seule ne prouve pas la cause ; le diagnostic porte sur toute la boucle.", code: "13.16", visual: "diagnostic" }
  ],
  sources: window.CO2_SOURCES
};
