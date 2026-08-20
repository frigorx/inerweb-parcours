window.OIL_MODULE = {
  id: "technologie-huiles-frigorifiques",
  title: "Les familles d’huile",
  subtitle: "LE CIRCUIT D’HUILE · STATION 1",
  codes: ["1.05", "5.08", "6.01", "6.05"],
  voix: true,
  nextStep: "Poursuivre avec « Choisir et contrôler l’huile » : lire un grade, comprendre miscibilité et solubilité, repérer l’eau et l’acidité.",
  nextUrl: "../technologie-huiles-choix-controle/index.html",
  nextLabel: "Station 2 · Choisir et contrôler l’huile",
  summaryVisual: { kind: "oilCircuit", label: "Circuit frigorifique complet : l’huile entraînée suit le fluide puis revient au compresseur" },
  lessons: [
    {
      id: "circuit-reel",
      short: "Circuit",
      kicker: "Station 1 · Rappel spiralé",
      recall: true,
      title: "L’huile appartient au compresseur, mais elle circule dans le vrai circuit",
      lead: "Le circuit reste composé du compresseur, du condenseur, du détendeur et de l’évaporateur. L’huile est d’abord la réserve de lubrification du compresseur.",
      details: [
        "Une fraction de cette huile est entraînée par le gaz au refoulement. Elle suit alors le trajet réel du fluide : condenseur, ligne liquide, détendeur, évaporateur puis aspiration.",
        "Le dessin utilise les symboles du compresseur, des échangeurs et du détendeur thermostatique de la bibliothèque technique inerWeb."
      ],
      box: { type: "key", text: "L’huile ne remplace pas le fluide : elle doit protéger le compresseur tout en pouvant revenir à son carter." },
      visual: { kind: "oilCircuit", title: "Le circuit frigorifique complet", label: "Compresseur à droite, condenseur en haut, détendeur à gauche et évaporateur en bas ; le trajet d’huile suit la boucle du fluide" }
    },
    {
      id: "roles-huile",
      short: "Fonctions",
      kicker: "Station 2 · Dans le compresseur",
      title: "Le film d’huile sépare les pièces en mouvement",
      lead: "La fonction première est de limiter le contact métal contre métal, donc le frottement, l’échauffement et l’usure.",
      details: [
        "Selon la technologie du compresseur, l’huile peut aussi participer à l’étanchéité des jeux internes et à l’évacuation d’une partie de la chaleur.",
        "Elle protège seulement si sa viscosité réelle, sa propreté et sa compatibilité restent adaptées au compresseur et au fluide."
      ],
      box: { type: "warning", text: "Les rôles secondaires ne sont pas identiques sur un piston, une vis, un scroll ou un compresseur ouvert." },
      visual: { kind: "oilFunctions", title: "Ce que fait l’huile dans le compresseur", label: "Compresseur entouré de quatre fonctions : lubrifier, étancher selon la technologie, évacuer de la chaleur et protéger les surfaces" }
    },
    {
      id: "trajet-huile",
      short: "Trajet",
      kicker: "Station 3 · Dans le circuit",
      title: "L’huile entraînée suit le fluide jusqu’au retour d’aspiration",
      lead: "Le gaz chaud emporte un brouillard ou un film d’huile au refoulement. Cette huile traverse les organes avant de revenir avec le gaz d’aspiration.",
      details: [
        "Le parcours est continu : refoulement → condenseur → ligne liquide → détendeur → évaporateur → conduite d’aspiration → compresseur.",
        "Une mauvaise miscibilité, une vitesse trop faible ou un point bas défavorable peut retenir de l’huile dans un échangeur ou une tuyauterie."
      ],
      box: { type: "key", text: "Le bilan recherché est dynamique : la quantité qui quitte le compresseur doit pouvoir lui revenir pendant le fonctionnement." },
      visual: { kind: "oilJourney", title: "Le chemin réel de la fraction d’huile entraînée", label: "Trajet numéroté de l’huile du refoulement au condenseur, au détendeur, à l’évaporateur puis au retour d’aspiration" }
    },
    {
      id: "familles-hydrocarbonees",
      short: "MO · AB · PAO",
      kicker: "Station 4 · Familles 1 sur 2",
      title: "MO, AB et PAO : trois familles à base hydrocarbonée",
      lead: "Le sigle désigne une famille chimique. Il ne donne ni le grade, ni la référence approuvée, ni la quantité à charger.",
      details: [
        "MO signifie huile minérale, issue du raffinage pétrolier. AB signifie alkylbenzène, une huile synthétique hydrocarbonée. PAO signifie polyalphaoléfine, également synthétique.",
        "On les rencontre notamment sur des applications historiques au R22, avec des hydrocarbures ou avec l’ammoniac, mais les associations exactes dépendent de l’installation."
      ],
      box: { type: "exam", text: "À l’oral, développer chaque sigle puis citer un usage typique et la limite : « selon le compresseur et sa notice »." },
      visual: { kind: "oilFamiliesHydrocarbon", title: "Trois sigles, trois natures", label: "MO huile minérale, AB alkylbenzène et PAO polyalphaoléfine avec leurs usages typiques" }
    },
    {
      id: "familles-polaires",
      short: "POE · PAG · PVE",
      kicker: "Station 5 · Familles 2 sur 2",
      title: "POE, PAG et PVE : les familles synthétiques des applications modernes",
      lead: "POE signifie polyol ester, en français ester de polyol. Dire seulement « polyester » est trop vague pour identifier l’huile.",
      details: [
        "PAG signifie polyalkylène glycol. PVE signifie polyvinyl ether, ou éther polyvinylique. Les trois familles absorbent l’humidité de l’air et exigent une manipulation soignée.",
        "Le POE est très courant avec les HFC/HFO. Le PAG est présent en climatisation mobile et dans certaines applications CO₂ ou NH₃. Le PVE équipe certains systèmes hermétiques fabriqués en usine."
      ],
      box: { type: "warning", text: "POE, PAG et PVE ne sont pas interchangeables, même si deux bidons portent le même grade de viscosité." },
      visual: { kind: "oilFamiliesSynthetic", title: "Développer le sigle avant de choisir", label: "POE ester de polyol, PAG polyalkylène glycol et PVE éther polyvinylique avec propriétés et usages typiques" }
    },
    {
      id: "huile-et-fluide",
      short: "Fluide ↔ huile",
      kicker: "Station 6 · Associations usuelles",
      title: "Quel fluide avec quelle huile ? Voici les repères, pas une prescription",
      lead: "Une famille de fluide oriente le choix, mais le modèle du compresseur décide de la famille, du grade et de la référence réellement autorisés.",
      details: [
        "Repères courants : R22 ancien → MO ou AB ; HFC/HFO → surtout POE, parfois PVE ou PAG ; R717 → MO, PAO ou AB, et PAG dans certains systèmes conçus pour lui.",
        "Pour le R744, on rencontre des POE ou PAG spécialement formulés. Pour R290/R600a, MO, AB, POE ou PAO existent selon le compresseur : le fluide seul ne tranche donc pas."
      ],
      box: { type: "key", text: "Le tableau répond « quelles familles rencontre-t-on ? ». La liste d’approbation du fabricant répond « quelle huile dois-je mettre ici ? »." },
      visual: { kind: "oilCompatibility", title: "Carte de compatibilité pédagogique", label: "Tableau de repères reliant R22, HFC et HFO, ammoniac R717, CO2 R744 et hydrocarbures aux familles d’huiles couramment rencontrées" }
    }
  ],
  quiz: [
    {
      prompt: "Dans quel ordre la fraction d’huile entraînée parcourt-elle le circuit de base après le compresseur ?",
      options: ["Évaporateur, condenseur, détendeur, aspiration", "Détendeur, condenseur, aspiration, évaporateur", "Condenseur, détendeur, évaporateur, aspiration"],
      correct: 2,
      why: "L’huile entraînée suit le fluide : refoulement, condenseur, ligne liquide et détendeur, évaporateur, puis retour d’aspiration.",
      code: "6.01"
    },
    {
      prompt: "Que signifie le sigle POE ?",
      options: ["Un ester de polyol de synthèse", "Une polyoléfine émulsionnée", "Une pression d’huile estimée"],
      correct: 0,
      why: "POE désigne la famille chimique polyol ester. Ce n’est ni un grade ni une référence commerciale complète.",
      code: "1.05 · 6.01"
    },
    {
      prompt: "Quel repère est le plus courant pour de nombreux compresseurs aux HFC ou HFO ?",
      options: ["Une huile minérale, quel que soit le compresseur", "Une huile POE approuvée, avec des cas PVE ou PAG", "N’importe quelle huile de même nombre ISO VG"],
      correct: 1,
      why: "Le POE est très courant avec HFC et HFO, mais PVE et PAG existent dans des conceptions précises. La liste du constructeur tranche.",
      code: "1.05 · 6.01"
    },
    {
      prompt: "Avec R717 et un évaporateur noyé, quelles huiles sont courantes ?",
      options: ["POE de climatisation automobile", "PVE seul, sans dispositif de retour", "MO, PAO ou AB, avec un retour adapté"],
      correct: 2,
      why: "MO, PAO et AB sont courantes dans ces architectures. Leur retour demande une conception spécifique.",
      code: "6.01"
    },
    {
      prompt: "Pour un compresseur au R744, quelle affirmation est exacte ?",
      options: ["Une huile POE de climatisation automobile convient", "La formulation dépend du compresseur retenu", "Le nombre ISO VG suffit à trancher l’huile"],
      correct: 1,
      why: "Le R744 possède plusieurs architectures et technologies de compresseurs. La formulation et le grade suivent l’approbation du fabricant.",
      code: "1.05 · 6.01"
    }
  ],
  sources: [
    {
      title: "BITZER — Lubricants for compressors",
      url: "https://www.bitzer.de/shared_media/html/a-500-501/en-GB/681631627.html",
      use: "familles, couples usuels, miscibilité, CO₂, ammoniac et priorité à l’huile approuvée"
    },
    {
      title: "BITZER — Propriétés des huiles pour machines frigorifiques",
      url: "https://www.bitzer.de/shared_media/html/est-500/fr-FR/273336971275261451.html",
      use: "hygroscopicité, eau, corrosion, gel du détendeur et formation d’acides"
    },
    {
      title: "BITZER — Overview refrigeration compressor oils",
      url: "https://www.bitzer.de/shared_media/html/est-500/en-GB/11260422511126926347.html",
      use: "exemples de viscosité des BSE32 et BSE55 à 20, 40 et 100 °C"
    },
    {
      title: "BITZER — Oils and their influence on R717 system design",
      url: "https://www.bitzer.de/shared_media/html/at-640/en-GB/103613195103614987.html",
      use: "MO, PAO, AB et PAG dans les différentes architectures à l’ammoniac"
    },
    {
      title: "Copeland — Refrigerants and lubricants approved for compressors",
      url: "https://media.copeland.com/2745af55-8f10-4af3-a33d-b16d003644e8/93-11%20R37%20-%20Refrigerants%20and%20lubricants%20approved%20for%20use%20in%20Copeland%E2%84%A2%20compressors.pdf",
      use: "exemples d’approbations par modèle, fluide, famille et grade"
    },
    {
      title: "Copeland — Universal Acid Alert Test Kit",
      url: "https://media.copeland.com/c840dae6-cac3-47d8-a1a1-b16d0017e4e3/Flow-Controls-Catalog.pdf",
      use: "principe du contrôle d’acidité, volume d’échantillon et séparation de phases"
    },
    {
      title: "Légifrance — Arrêté du 21 novembre 2025, attestation d’aptitude",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646",
      use: "compétences 1.05, 5.08, 6.01 et 6.05"
    }
  ]
};
