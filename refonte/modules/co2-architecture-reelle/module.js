window.CO2_MODULE = {
  id: "co2-architecture-reelle",
  title: "Lire une installation réelle",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 8",
  codes: ["11.06", "13.02", "13.16"],
  nextStep: "Terminus de la ligne. Revenez à la carte ou poursuivez vers les capsules Habilitation Fluides avant un futur parcours pratique catégorie B.",
  nextUrl: "../co2-r744-interactif/index.html",
  nextLabel: "Revenir à la ligne CO₂",
  summaryVisual: { kind: "handoff", label: "Passerelle entre découverte théorique et préparation réglementaire catégorie B" },
  relatedLinks: [
    { label: "Habilitation Fluides · classes de sécurité", url: "../../capsule.html?sujet=classes-de-securite" },
    { label: "Habilitation Fluides · familles et PRP", url: "../../capsule.html?sujet=familles-et-prp" },
    { label: "Parcours général inerWeb", url: "../../parcours.html" }
  ],
  lessons: [
    {
      id: "pid",
      short: "P&ID",
      kicker: "Gare 8 · Entrer par le plan",
      recall: true,
      title: "Une installation réelle se lit d’abord sur son P&ID et ses repères",
      lead: "Suivez une ligne depuis un organe connu, notez chaque repère, chaque sens et chaque changement de pression.",
      details: [
        "Le schéma de principe pédagogique aide à reconnaître les fonctions, mais le P&ID réel porte les vannes, sécurités, capteurs, dérivations et repères d’instrumentation.",
        "Ne nommez pas une pièce par sa forme seule : reliez son repère à la légende, à la nomenclature et à la plaque."
      ],
      box: { type: "key", text: "Méthode : repère → fonction → zone de pression → sens → signal associé." },
      visual: { kind: "pid", title: "Suivre une ligne sans deviner", label: "Extrait pédagogique de P&ID avec repères de refroidisseur, vanne HP, réservoir et poste froid" }
    },
    {
      id: "booster",
      short: "Booster",
      kicker: "Gare 8 · Architecture représentative",
      title: "Une centrale booster réunit froid positif et froid négatif avec le même R744",
      lead: "Les compresseurs LT refoulent vers le niveau d’aspiration des compresseurs MT, qui portent ensuite le fluide vers le refroidisseur de gaz.",
      details: [
        "Le réservoir flash alimente les postes en liquide. Sa vapeur rejoint l’aspiration MT ou une voie d’optimisation dédiée.",
        "La représentation est volontairement simplifiée : le P&ID réel ajoute séparateurs, huile, soupapes, vannes d’isolement, échangeurs, capteurs et automatismes."
      ],
      box: { type: "key", text: "Booster décrit l’enchaînement des niveaux de compression, pas seulement la présence de plusieurs compresseurs." },
      visual: { kind: "booster", title: "Relier les deux niveaux de froid", label: "Architecture booster simplifiée avec compresseurs MT et LT, postes froid, flash et refroidisseur de gaz" }
    },
    {
      id: "inventaire-securite",
      short: "Sécurité",
      kicker: "Gare 8 · Contrôle documentaire",
      title: "Chaque zone doit rester cohérente du tube jusqu’au capteur",
      lead: "Matériaux, pression admissible, vannes, raccords, instruments et soupapes doivent correspondre au R744 et à leur emplacement.",
      details: [
        "Vérifiez aussi étiquetage, sens des décharges, détecteurs, alarmes, ventilation, signalisation, issues et consignes du site.",
        "La présence d’un composant ne prouve pas son réglage ni son bon fonctionnement : plaque, certificat, contrôle périodique et essai documenté complètent l’inventaire."
      ],
      box: { type: "warning", text: "Ne jamais neutraliser une sécurité pour « confirmer » un diagnostic." },
      visual: { kind: "safety", title: "Lire les barrières autour de la machine", label: "Chaîne de sécurité du capteur à l’évacuation et au personnel autorisé" }
    },
    {
      id: "tour-installation",
      short: "Relever",
      kicker: "Gare 8 · Visite guidée",
      title: "Le tour d’installation produit une fiche de preuves, pas une collection de photos",
      lead: "Relevez architecture, repères, pressions admissibles, capteurs, consignes visibles, états de commande et protections.",
      details: [
        "Associez chaque photo à un repère du P&ID et à une question précise. Séparez les observations, les mesures et les hypothèses.",
        "Terminez par le prochain contrôle autorisé et par la personne compétente attendue pour le réaliser."
      ],
      box: { type: "exam", text: "Une vraie préparation catégorie B ajoutera la pratique sur matériel R744, les outils adaptés et l’évaluation conforme." },
      visual: { kind: "diagnostic", title: "Transformer la visite en raisonnement", label: "Chaîne de preuves allant de l’observation au prochain contrôle" }
    },
    {
      id: "limite-parcours",
      short: "Passerelle",
      kicker: "Gare 8 · Manipulation finale",
      title: "Décidez ce que ce parcours autorise réellement",
      lead: "L’apprenant reconnaît maintenant une architecture, lit des mesures et prépare une décision argumentée.",
      details: [
        "Il n’a pas pour autant réalisé l’analyse de risques, l’épreuve de pression, le tirage au vide, la charge, le contrôle d’étanchéité ni le rapport pratique exigés.",
        "La formulation honnête reste donc : **Découvrir le CO₂ — vers la catégorie B**."
      ],
      box: { type: "key", text: "Connaître n’autorise pas à intervenir. L’attestation catégorie B repose sur une évaluation théorique et pratique." },
      visual: { kind: "handoff", title: "Où s’arrête la découverte ?", label: "Comparaison entre les acquis théoriques du parcours et les exigences pratiques de la catégorie B" },
      activity: {
        prompt: "Après ce parcours, l’apprenant peut :",
        options: ["intervenir seul sur R744", "reconnaître et préparer l’analyse", "signer une attestation"],
        correct: 1,
        why: "Le parcours installe des repères ; l’intervention et la certification exigent pratique, matériel, évaluation et validation humaine."
      }
    }
  ],
  quiz: [
    { prompt: "Par quoi commencer la lecture d’une installation réelle ?", options: ["Le P&ID, les repères et la nomenclature", "La couleur des tuyaux", "La plus grosse vanne"], correct: 0, why: "Le plan et les repères relient chaque organe à sa fonction et à sa zone.", code: "13.02", visual: "pid" },
    { prompt: "Dans un booster, où refoulent les compresseurs LT ?", options: ["Vers le niveau d’aspiration MT", "Directement dans l’évaporateur", "Vers la bouteille d’azote"], correct: 0, why: "L’étage MT reprend le débit LT puis comprime l’ensemble vers le refroidisseur de gaz.", code: "11.06", visual: "booster" },
    { prompt: "Que doit-on vérifier pour une zone de pression ?", options: ["Seulement le tube", "Cohérence des matériaux, composants, instruments et protections", "Seulement la soupape"], correct: 1, why: "La chaîne complète doit être compatible avec le R744 et la pression admissible de la zone.", code: "11.06 · 13.16", visual: "safety" },
    { prompt: "Quelle forme prend un relevé utile pendant la visite ?", options: ["Photo sans repère", "Observation séparée de la mesure et de l’hypothèse", "Conclusion certaine avant mesure"], correct: 1, why: "Cette séparation permet de justifier le prochain contrôle et d’éviter les certitudes prématurées. Elle ne remplace pas le rapport pratique exigé en catégorie B.", code: "3.05 · préparation à la traçabilité", visual: "diagnostic" },
    { prompt: "Ce parcours délivre-t-il une préparation certifiante complète catégorie B ?", options: ["Oui", "Non, il manque pratique, matériel adapté et évaluation conforme", "Oui si le quiz est réussi"], correct: 1, why: "La catégorie B comprend des compétences théoriques et pratiques évaluées par un organisme compétent.", code: "Annexe II · groupe 13", visual: "handoff" }
  ],
  sources: window.CO2_SOURCES
};
