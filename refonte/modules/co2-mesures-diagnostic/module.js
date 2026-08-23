window.CO2_MODULE = {
  id: "co2-mesures-diagnostic",
  title: "Mesures et diagnostic CO₂",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 7",
  codes: ["1.03", "3.05", "4.01", "11.06", "13.16"],
  nextStep: "La dernière gare rassemble les organes, les capteurs et les sécurités dans la lecture d’une installation booster représentative.",
  nextUrl: "../co2-architecture-reelle/index.html",
  nextLabel: "Gare 8 · Installation réelle",
  summaryVisual: { kind: "diagnostic", label: "Chaîne de raisonnement allant du symptôme au prochain contrôle discriminant" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · contrôle d’étanchéité", url: "../../capsule.html?sujet=controle-etancheite" }
  ],
  lessons: [
    {
      id: "point-de-mesure",
      short: "Repérer",
      kicker: "Gare 7 · Avant le chiffre",
      recall: true,
      title: "Une valeur ne vaut que si son point, son unité et sa référence sont identifiés",
      lead: "Pgc, Tgc, Prec, aspiration MT et aspiration LT ne décrivent pas le même niveau du système.",
      details: [
        "Commencez par le P&ID, le nom du capteur et la zone de pression. Notez ensuite bar absolus ou relatifs, degrés Celsius, état de marche et heure du relevé.",
        "Une capture d’écran sans contexte perd la charge, les consignes, les alarmes actives et parfois l’échelle de la grandeur."
      ],
      box: { type: "key", text: "Point + grandeur + unité + référence + état de marche : le minimum d’un relevé exploitable." },
      visual: { kind: "measure", title: "Placer les capteurs sur le circuit", label: "Mesures de pression et de température placées aux points haute pression et aspiration" }
    },
    {
      id: "etat-machine",
      short: "Contexte",
      kicker: "Gare 7 · Stabiliser l’observation",
      title: "Le diagnostic commence par l’état de la machine et la demande de froid",
      lead: "Marche, arrêt, dégivrage, récupération de chaleur ou limitation de capacité produisent des mesures différentes.",
      details: [
        "Relevez l’ambiance au refroidisseur, les postes appelés, les compresseurs en service, la position commandée des vannes et les alarmes.",
        "Ne comparez pas deux captures prises dans des états différents comme si elles représentaient le même point de fonctionnement."
      ],
      box: { type: "warning", text: "Une valeur inhabituelle pendant une transition n’est pas automatiquement un défaut permanent." },
      visual: { kind: "diagnostic", title: "Donner un contexte au symptôme", label: "Chaîne symptôme, mesures, hypothèses et prochain test" }
    },
    {
      id: "croiser",
      short: "Croiser",
      kicker: "Gare 7 · Plusieurs indices",
      title: "Croisez haute pression, température de sortie, pression flash et aspirations",
      lead: "Aucune de ces mesures ne doit être interprétée isolément.",
      details: [
        "Une haute pression élevée peut accompagner un air entrant chaud, un échange thermique dégradé, une consigne de récupération de chaleur ou une boucle HP qui ne suit pas.",
        "La pression du réservoir dépend de sa propre boucle. Les aspirations MT et LT dépendent des charges, des détendeurs et de la capacité de compression."
      ],
      box: { type: "key", text: "Une hypothèse utile explique plusieurs indices et prédit le résultat d’un prochain contrôle." },
      visual: { kind: "measure", title: "Lire la carte complète des mesures", label: "Capteurs répartis autour du cycle transcritique pour éviter un diagnostic à valeur unique" }
    },
    {
      id: "cause-ou-consequence",
      short: "Tester",
      kicker: "Gare 7 · Cause ou conséquence",
      title: "Le prochain contrôle doit séparer au moins deux hypothèses",
      lead: "Si la haute pression est élevée, mesurez aussi l’air entrant, la température de sortie et la commande des ventilateurs.",
      details: [
        "Si la consigne et la mesure s’écartent, observez la commande envoyée à l’actionneur puis la réponse réelle de la vanne ou des ventilateurs.",
        "Si la commande est cohérente mais l’échange thermique reste faible, l’hypothèse se déplace vers le débit d’air, l’encrassement ou l’état de l’échangeur."
      ],
      box: { type: "exam", text: "Formuler : symptôme observé → indices concordants → hypothèses restantes → prochain contrôle." },
      visual: { kind: "diagnostic", title: "Construire un test discriminant", label: "Le prochain test est choisi pour éliminer une hypothèse sans remplacer un composant au hasard" }
    },
    {
      id: "scenario-hp",
      short: "Scénario",
      kicker: "Gare 7 · Manipulation",
      title: "Haute pression forte et température de sortie élevée par temps modéré",
      lead: "La consigne HP est cohérente, la vanne suit, mais les ventilateurs restent à faible commande malgré l’écart d’échange.",
      details: [
        "Le scénario pointe d’abord vers la chaîne de commande du refroidisseur de gaz, sans prouver encore quel composant est en cause.",
        "Choisissez le prochain contrôle qui apporte une preuve nouvelle."
      ],
      box: { type: "key", text: "Contrôler une commande et sa réponse avant de condamner l’échangeur ou la vanne HP." },
      visual: { kind: "diagnostic", title: "Quel contrôle distingue les hypothèses ?", label: "Chaîne de diagnostic reliant symptôme, mesures, hypothèses et prochain test" },
      activity: {
        prompt: "Prochain contrôle :",
        options: ["ajouter du fluide", "mesurer commande et fonctionnement des ventilateurs", "modifier la soupape"],
        correct: 1,
        why: "Le scénario montre un écart dans la réponse du refroidisseur ; vérifier commande et fonctionnement apporte une preuve directe."
      }
    }
  ],
  quiz: [
    { prompt: "Que doit contenir un relevé exploitable ?", options: ["Seulement le chiffre", "Point, grandeur, unité, référence et état", "Une photo sans légende"], correct: 1, why: "Le contexte rend les valeurs comparables et évite les confusions d’unités ou de zones.", code: "3.05", visual: "measure" },
    { prompt: "Pourquoi noter le mode de fonctionnement ?", options: ["Pour distinguer marche stable, transition, dégivrage ou récupération", "Pour décorer le rapport", "Parce que les pressions ne changent jamais"], correct: 0, why: "Le même système produit des mesures différentes selon sa demande et son mode actif.", code: "3.05 · 13.16", visual: "diagnostic" },
    { prompt: "Une haute pression élevée prouve-t-elle un manque de fluide ?", options: ["Oui, toujours", "Non, plusieurs causes et modes sont possibles", "Oui, si la machine est au CO₂"], correct: 1, why: "Ambiance, échange, récupération de chaleur, consigne et boucle HP peuvent tous influencer la mesure.", code: "11.06", visual: "measure" },
    { prompt: "Quel est le meilleur prochain contrôle ?", options: ["Celui qui sépare plusieurs hypothèses", "Celui qui remplace le plus gros composant", "Celui qui modifie toutes les consignes"], correct: 0, why: "Un test discriminant apporte une preuve nouvelle avec une action limitée. Ce raisonnement ne vaut pas réalisation d’un contrôle direct.", code: "4.01 · méthode de diagnostic", visual: "diagnostic" },
    { prompt: "Comment formuler une conclusion professionnelle ?", options: ["Cause certaine sans mesure", "Symptôme, indices, hypothèses et prochain contrôle", "Changer la vanne puis observer"], correct: 1, why: "La conclusion distingue ce qui est observé de ce qui reste à confirmer.", code: "3.05 · 13.16", visual: "diagnostic" }
  ],
  sources: window.CO2_SOURCES
};
