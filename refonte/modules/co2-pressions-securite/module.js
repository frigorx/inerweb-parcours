window.CO2_MODULE = {
  id: "co2-pressions-securite",
  title: "Pressions et sécurité à l’arrêt",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 3",
  codes: ["11.03", "11.06", "13.16"],
  nextStep: "Après la sécurité à l’arrêt, la gare suivante réemploie le cheminement du diagramme enthalpique V7 avant d’y poser le cycle subcritique.",
  nextUrl: "../co2-cycle-subcritique/index.html",
  nextLabel: "Gare 4 · Diagramme & cycle",
  summaryVisual: { kind: "safety", label: "Chaîne de sécurité combinant conception, détection, alarme, évacuation et personnel autorisé" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · classes de sécurité", url: "../../capsule.html?sujet=classes-de-securite" }
  ],
  lessons: [
    {
      id: "pression-reste",
      short: "À l’arrêt",
      kicker: "Gare 3 · Le piège de l’arrêt",
      recall: true,
      title: "Arrêter le compresseur n’annule pas la pression du R744",
      lead: "Le fluide enfermé se réchauffe vers la température ambiante et sa pression d’équilibre augmente.",
      details: [
        "Danfoss donne un exemple parlant : autour de **22 °C**, la pression de saturation du CO₂ est voisine de **60 bar absolus**.",
        "Une portion isolée, un réservoir ou un côté basse pression peut donc devenir critique pour sa pression admissible même si aucun compresseur ne tourne."
      ],
      box: { type: "key", text: "La sécurité à l’arrêt se conçoit pour l’échauffement du fluide enfermé, pas pour la seule pression en marche." },
      visual: { kind: "pressure", title: "La chaleur ambiante continue de travailler", label: "Réservoir arrêté réchauffé par l’ambiance avec pression montante et trois familles de protection" }
    },
    {
      id: "zones-pression",
      short: "Zones",
      kicker: "Gare 3 · Pressions admissibles",
      title: "Chaque zone possède sa pression de calcul et ses organes compatibles",
      lead: "Haute pression, pression intermédiaire, aspiration MT et aspiration LT n’ont pas la même fonction ni la même enveloppe admissible.",
      details: [
        "Les matériaux de tuyauterie, vannes, capteurs, raccords et outils sont choisis pour la zone exacte où ils travaillent.",
        "Le dessin pédagogique ne donne aucun tarage universel : plaque, P&ID, dossier constructeur et notice de chaque composant font foi."
      ],
      box: { type: "warning", text: "Un raccord qui se visse n’est pas forcément compatible avec la pression, le fluide ou la procédure." },
      visual: { kind: "booster", title: "Repérer plusieurs niveaux de pression", label: "Architecture booster simplifiée distinguant les postes MT et LT, la pression intermédiaire et la haute pression" }
    },
    {
      id: "limiter-pression",
      short: "Protéger",
      kicker: "Gare 3 · Conception de sécurité",
      title: "La machine doit supporter la pression d’arrêt ou disposer d’un moyen prévu pour la limiter",
      lead: "Les stratégies possibles relèvent de la conception : résistance de la zone, soupapes, refroidissement de maintien ou transfert contrôlé.",
      details: [
        "Une soupape protège contre une surpression, mais son ouverture entraîne une perte de fluide et ne remplace pas un concept d’arrêt correctement conçu.",
        "Le refroidissement de maintien ou de stagnation doit rester alimenté et surveillé selon le dossier de l’installation. On ne l’invente pas après la panne."
      ],
      box: { type: "exam", text: "La catégorie B demande de connaître les concepts limitant la pression d’arrêt et le refroidissement à stagnation." },
      visual: { kind: "pressure", title: "Trois barrières complémentaires", label: "Concevoir la résistance, protéger la surpression et maintenir le refroidissement lorsque le système le prévoit" }
    },
    {
      id: "risque-local",
      short: "Local",
      kicker: "Gare 3 · Atmosphère",
      title: "Le CO₂ ne brûle pas, mais une fuite peut rendre l’atmosphère dangereuse",
      lead: "Le gaz est sans odeur, plus dense que l’air et physiologiquement actif : il ne fait pas que remplacer l’oxygène.",
      details: [
        "Les concentrations les plus élevées peuvent se trouver en partie basse, dans une fosse, une cave ou au pied d’un escalier.",
        "Détection fixe, ventilation, alarmes intérieure et extérieure, signalisation, issues et consignes d’évacuation forment une chaîne à vérifier."
      ],
      box: { type: "warning", text: "Ne pas entrer pour « voir » une fuite. L’alarme extérieure doit prévenir avant l’ouverture du local." },
      visual: { kind: "safety", title: "Du capteur à la décision", label: "Chaîne détecter, alerter, évacuer puis sécuriser avec du personnel autorisé" }
    },
    {
      id: "panne-courant",
      short: "Décider",
      kicker: "Gare 3 · Manipulation",
      title: "Une panne générale survient pendant une journée chaude",
      lead: "Les compresseurs et ventilateurs s’arrêtent. Le dossier mentionne un refroidissement de maintien secouru et des soupapes par zone.",
      details: [
        "Votre rôle dans cette découverte est de reconnaître le scénario et de suivre le plan du site, pas d’ouvrir une vanne au hasard.",
        "La première décision doit préserver les personnes et laisser les dispositifs prévus accomplir leur fonction."
      ],
      box: { type: "key", text: "Consigner l’état, surveiller selon la procédure et appeler le titulaire de l’attestation catégorie B prévu par le site." },
      visual: { kind: "pressure", title: "Que faire pendant l’échauffement ?", label: "Réservoir arrêté avec pression montante et dispositifs de sécurité conçus pour la situation" },
      activity: {
        prompt: "Quel premier choix est défendable ?",
        options: ["Ouvrir une purge", "Suivre le plan d’arrêt et sécuriser la zone", "Court-circuiter l’alarme"],
        correct: 1,
        why: "La procédure, les protections prévues et la sécurité des personnes commandent ; une décharge improvisée ajoute des dangers."
      }
    }
  ],
  quiz: [
    { prompt: "Pourquoi la pression peut-elle monter après l’arrêt ?", options: ["Le fluide enfermé se réchauffe", "Le compresseur accélère", "La température ambiante disparaît"], correct: 0, why: "Le CO₂ enfermé tend vers la température ambiante et sa pression d’équilibre augmente.", code: "11.06 · 13.16", visual: "pressure" },
    { prompt: "Que prouve l’exemple 22 °C, environ 60 bar abs ?", options: ["Toutes les soupapes se règlent à 60 bar", "La basse pression devient nulle à l’arrêt", "La pression d’arrêt peut être élevée même sans compresseur"], correct: 2, why: "C’est un exemple thermodynamique, pas une consigne universelle de tarage.", code: "11.06", visual: "pressure" },
    { prompt: "Quelle source fixe la pression admissible d’une zone ?", options: ["La couleur du tube", "Le dossier de conception, la plaque et les composants", "Le nombre de ventilateurs"], correct: 1, why: "La pression admissible est une propriété documentée de la zone et de chaque composant.", code: "11.03 · 13.16", visual: "booster" },
    { prompt: "Quel ensemble forme une vraie chaîne de protection du local ?", options: ["Détection, alarmes, ventilation, issues et consignes", "Un masque à cartouche seul", "Une fenêtre entrouverte"], correct: 0, why: "La protection combine des barrières techniques et organisationnelles. Leur vérification sur site reste une compétence pratique.", code: "Repère avant vérification pratique", visual: "safety" },
    { prompt: "Lors d’une panne, quelle action est à proscrire ?", options: ["Appliquer le plan d’arrêt", "Sécuriser l’accès", "Purger au hasard pour faire baisser la pression"], correct: 2, why: "Une purge improvisée peut exposer au CO₂, au froid et à la formation de glace carbonique.", code: "13.16", visual: "pressure" }
  ],
  sources: window.CO2_SOURCES
};
