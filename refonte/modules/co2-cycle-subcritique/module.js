window.CO2_MODULE = {
  id: "co2-cycle-subcritique",
  title: "Diagramme & cycle subcritique",
  subtitle: "LA RAME CO₂ · GARE 4",
  codes: ["1.03", "1.04", "1.09"],
  nextStep: "Les repères du diagramme sont installés. La gare suivante montre comment le trajet franchit le point critique et transforme le rejet de chaleur.",
  nextUrl: "../co2-cycle-transcritique/index.html",
  nextLabel: "Gare 5 · Cycle transcritique",
  summaryVisual: { kind: "logph", focus: "cycle", label: "Diagramme log p-h qualitatif du R744, méthode V7 adaptée, avec zones et cycle subcritique" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · le circuit", url: "../../capsule.html?sujet=le-circuit" }
  ],
  lessons: [
    {
      id: "axes",
      short: "Axes",
      kicker: "Gare 4 · Étape 1 du cheminement V7",
      recall: true,
      title: "On entre dans le diagramme par les axes, pas par le cycle",
      lead: "La pression absolue p se lit verticalement ; l’enthalpie massique h se lit horizontalement.",
      details: [
        "L’axe de pression est logarithmique : il garde lisibles sur une même planche les basses et les très hautes pressions du R744.",
        "Chaque point représente un état du fluide. Sa hauteur situe le niveau de pression ; son déplacement horizontal traduit une variation d’enthalpie."
      ],
      box: { type: "key", text: "Vertical : p en bar absolus. Horizontal : h en kJ/kg. Le dessin reste qualitatif : aucune valeur ne doit y être relevée." },
      visual: { kind: "logph", focus: "axes", title: "Première lecture : les deux axes", label: "Méthode du diagramme enthalpique V7 réemployée et adaptée au domaine R744" }
    },
    {
      id: "cloche-zones",
      short: "Zones",
      kicker: "Gare 4 · Étape 2 du cheminement V7",
      title: "La cloche sépare liquide, mélange et vapeur",
      lead: "Avant de suivre une transformation, on localise l’état probable du fluide.",
      details: [
        "À gauche de la cloche se trouve le liquide ; à l’intérieur, liquide et vapeur coexistent ; à droite se trouve la vapeur surchauffée.",
        "Le sommet est le point critique du R744. Au-dessus de lui, la frontière liquide-vapeur disparaît : cette lecture prépare directement le transcritique."
      ],
      box: { type: "exam", text: "Repérer d’abord la zone évite de parler de condensation dans un domaine où elle n’existe plus." },
      visual: { kind: "logph", focus: "zones", title: "Deuxième lecture : la cloche et les domaines", label: "Cloche de saturation qualitative, point critique et trois zones du diagramme pression-enthalpie" }
    },
    {
      id: "cycle-quatre-points",
      short: "Cycle",
      kicker: "Gare 4 · Étape 3 du cheminement V7",
      title: "Le cycle subcritique se pose ensuite en quatre points",
      lead: "Évaporer, comprimer, condenser puis détendre : chaque segment se lit avec sa fonction physique.",
      details: [
        "De 1 à 2, le compresseur élève pression et enthalpie. De 2 à 3, la haute pression rejette de la chaleur et condense sous le point critique.",
        "De 3 à 4, la détente est représentée verticalement à enthalpie approximativement constante. De 4 à 1, l’évaporateur absorbe la chaleur à basse pression."
      ],
      box: { type: "key", text: "Le diagramme et la Croix du Frigoriste racontent le même cycle avec deux langages complémentaires." },
      visual: { kind: "logph", focus: "cycle", title: "Troisième lecture : suivre le cycle", label: "Cycle subcritique à quatre points inscrit sur la cloche qualitative du R744" }
    },
    {
      id: "condenser-subcritique",
      short: "Condenser",
      kicker: "Gare 4 · Sous la frontière critique",
      title: "Sous le point critique, pression et température de saturation restent liées",
      lead: "La haute pression peut condenser si le milieu de rejet est suffisamment froid.",
      details: [
        "Une table R744 adaptée relie alors pression et température de saturation pour interpréter condensation, évaporation, surchauffe et sous-refroidissement.",
        "Le fonctionnement subcritique peut être autonome par temps froid ou maintenu dans une cascade, où un autre étage refroidit le condenseur CO₂."
      ],
      box: { type: "warning", text: "Une pression de saturation ne donne pas à elle seule la température réelle d’une vapeur surchauffée ou d’un liquide sous-refroidi." },
      visual: { kind: "subcritical", title: "Le même cycle vu dans l’installation", label: "Croix du Frigoriste R744 : compresseur, condenseur, détendeur et évaporateur" }
    },
    {
      id: "identifier-detente",
      short: "Manipuler",
      kicker: "Gare 4 · Lire avant de choisir",
      title: "Quel segment représente la chute de pression à enthalpie constante ?",
      lead: "Cherchez d’abord la direction de h, puis le segment qui conserve la même position horizontale.",
      details: [
        "Sur le diagramme p-h, conserver h revient à tracer un segment vertical.",
        "Dans le modèle simple, ce segment relie la sortie liquide haute pression au mélange basse pression qui alimente l’évaporateur."
      ],
      box: { type: "key", text: "ISenthalpique : même h. Dans ce cycle, le segment 3 → 4 représente la détente." },
      visual: { kind: "logph", focus: "cycle", title: "Repérez le segment vertical", label: "Diagramme qualitatif utilisé comme support de raisonnement, sans lecture numérique" },
      activity: {
        prompt: "Le segment vertical 3 → 4 correspond à :",
        options: ["la compression", "la détente", "l’évaporation"],
        correct: 1,
        why: "La détente fait chuter la pression à enthalpie approximativement constante dans le modèle frigorifique simple."
      }
    }
  ],
  quiz: [
    { prompt: "Quelle grandeur se lit sur l’axe horizontal du diagramme p-h ?", options: ["La pression", "L’enthalpie massique", "Le débit d’air"], correct: 1, why: "h se lit horizontalement ; p se lit verticalement sur une échelle logarithmique.", code: "1.03", visual: "logph" },
    { prompt: "Que trouve-t-on à l’intérieur de la cloche ?", options: ["Uniquement du liquide", "Un mélange liquide-vapeur", "Toujours un fluide supercritique"], correct: 1, why: "La cloche délimite le domaine où liquide et vapeur coexistent.", code: "1.09", visual: "logph" },
    { prompt: "Que signifie subcritique pour le rejet de chaleur HP ?", options: ["La condensation reste possible", "La haute pression n’existe plus", "Le CO₂ devient solide"], correct: 0, why: "Le trajet HP reste sous le point critique, dans un domaine où le changement liquide-vapeur existe.", code: "1.09", visual: "subcritical" },
    { prompt: "Pourquoi le segment 3 → 4 est-il vertical dans le modèle simple ?", options: ["La pression reste constante", "L’enthalpie reste constante", "La température reste toujours nulle"], correct: 1, why: "La détente idéale est représentée comme isenthalpique : h constante.", code: "1.04", visual: "logph" },
    { prompt: "Comment une cascade peut-elle garder le R744 subcritique ?", options: ["Un autre étage refroidit son condenseur", "Elle supprime le détendeur", "Elle interdit tout échange de chaleur"], correct: 0, why: "L’étage supérieur fournit un niveau de rejet suffisamment froid pour condenser le R744.", code: "11.06", visual: "subcritical" }
  ],
  sources: window.CO2_SOURCES
};
