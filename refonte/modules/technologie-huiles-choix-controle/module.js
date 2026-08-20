window.OIL_MODULE = {
  id: "technologie-huiles-choix-controle",
  title: "Choisir et contrôler l’huile",
  subtitle: "LE CIRCUIT D’HUILE · STATION 2",
  codes: ["1.05", "5.08", "6.01", "6.05"],
  voix: true,
  nextStep: "Poursuivre avec « Le retour d’huile naturel » : après avoir identifié l’huile, il faut comprendre comment la tuyauterie permet son retour au compresseur.",
  nextUrl: "../retour-huile-naturel/index.html",
  nextLabel: "Station 3 · Le retour d’huile naturel",
  summaryVisual: { kind: "oilCircuit", label: "Circuit frigorifique complet : l’huile entraînée suit le fluide puis revient au compresseur" },
  lessons: [
    {
      id: "methode-choix",
      short: "Choisir",
      kicker: "Station 1 · Méthode terrain",
      title: "Quatre vérifications avant d’ouvrir un bidon",
      lead: "Le choix part de la machine réelle. Une couleur, une habitude d’atelier ou le seul nom du fluide ne suffisent jamais.",
      details: [
        "1. Relever le modèle exact du compresseur et le fluide. 2. Consulter la notice ou la liste d’huiles approuvées. 3. Relever famille, grade et référence. 4. Contrôler le bidon, le lot et son état.",
        "Si l’huile présente est inconnue, si un mélange est suspecté ou si la référence manque, on suspend l’ajout et on applique la procédure du fabricant."
      ],
      box: { type: "exam", text: "La bonne réponse n’est pas « je choisis une POE » mais « je vérifie le modèle, le fluide, la liste approuvée, le grade et la référence »." },
      visual: { kind: "oilSelection", title: "La chaîne de décision complète", label: "Quatre étapes : plaque du compresseur, fluide, tableau du fabricant, puis famille grade et référence du bidon" }
    },
    {
      id: "miscibilite-solubilite",
      short: "Mélanges",
      kicker: "Station 2 · Deux propriétés",
      title: "Miscibilité et solubilité ne veulent pas dire la même chose",
      lead: "La miscibilité décrit la capacité de l’huile et du fluide liquide à former une phase homogène. La solubilité décrit la quantité de fluide qui se dissout dans l’huile.",
      details: [
        "Une miscibilité favorable peut aider le transport et le retour. Une séparation de phases peut créer une accumulation dans un évaporateur ou un réservoir.",
        "Le fluide dissous fluidifie l’huile : la viscosité du mélange en fonctionnement peut être bien plus faible que celle de l’huile pure annoncée sur le bidon."
      ],
      box: { type: "warning", text: "« Très miscible » ne veut pas automatiquement dire « meilleure lubrification » : une forte dilution peut réduire le film d’huile." },
      visual: { kind: "oilMixing", title: "Transport, séparation et dilution", label: "Trois éprouvettes montrent un mélange miscible, deux phases séparées et du fluide dissous qui réduit la viscosité" }
    },
    {
      id: "grade-iso-vg",
      short: "ISO VG",
      kicker: "Station 3 · Lire le grade",
      title: "ISO VG 32, 46 ou 68 indique une viscosité à 40 °C",
      lead: "Le nombre du grade est proche de la viscosité cinématique nominale de l’huile pure à 40 °C, exprimée en mm²/s, aussi appelée cSt.",
      details: [
        "ISO VG 32 ≈ 32 mm²/s, ISO VG 46 ≈ 46 mm²/s et ISO VG 68 ≈ 68 mm²/s à 40 °C. Plus le nombre est élevé, plus l’huile pure est visqueuse à cette température de référence.",
        "Le grade n’est pas une plage de température : « 32 » ne signifie ni −32 °C, ni une limite à 32 °C, ni l’autorisation d’utiliser cette huile sur toute machine."
      ],
      box: { type: "key", text: "Famille chimique + grade ISO VG + référence approuvée sont trois informations différentes et toutes nécessaires." },
      visual: { kind: "oilIsoVg", title: "Ce que signifie réellement le nombre", label: "Comparaison des grades ISO VG 32, 46 et 68 à la température de référence de 40 degrés Celsius" }
    },
    {
      id: "viscosite-temperature",
      short: "Température",
      kicker: "Station 4 · Comportement réel",
      title: "Quand la température monte, l’huile devient beaucoup plus fluide",
      lead: "La viscosité n’est pas constante. Il faut garantir un film suffisant dans le compresseur et une bonne circulation dans les zones froides.",
      details: [
        "Exemple fabricant sur huile POE pure : BSE32 vaut environ 74 cSt à 20 °C, 32 cSt à 40 °C et 6 cSt à 100 °C. Une BSE55 vaut environ 147, 55 puis 9 cSt aux mêmes températures.",
        "Ces chiffres montrent la tendance, pas une plage d’emploi. Le fluide dissous peut encore réduire la viscosité ; l’enveloppe autorisée reste celle du compresseur et de l’huile approuvée."
      ],
      box: { type: "exam", text: "Le grade est mesuré à 40 °C ; le fonctionnement se juge sur toute la plage de température et avec le fluide dissous." },
      visual: { kind: "oilViscosityTemperature", title: "Deux huiles POE à trois températures", label: "Tableau des viscosités BITZER BSE32 et BSE55 à 20, 40 et 100 degrés Celsius montrant la forte diminution avec la température" }
    },
    {
      id: "hygroscopicite",
      short: "Humidité",
      kicker: "Station 5 · Hygroscopicité",
      title: "POE, PAG et PVE absorbent une eau qui peut rester invisible",
      lead: "Hygroscopique signifie que l’huile capte l’humidité de l’air ambiant. Cette eau se dissout dans l’huile : on ne peut pas conclure à l’œil qu’elle est sèche.",
      details: [
        "Préparer le matériel, utiliser un bidon d’origine fermé, limiter le temps d’ouverture, refermer immédiatement et ne jamais reverser une huile prélevée dans le bidon propre.",
        "L’eau peut favoriser corrosion, gel au détendeur et dégradation de l’huile. Avec un ester POE, l’hydrolyse peut former des acides ; un tirage au vide ne retire pas facilement l’eau déjà liée à l’huile."
      ],
      box: { type: "warning", text: "Un voyant d’humidité renseigne le circuit selon sa notice ; il ne certifie pas à lui seul la teneur en eau d’un échantillon d’huile." },
      visual: { kind: "oilMoisture", title: "De l’air humide aux dégradations", label: "L’air humide introduit de l’eau invisible dans les huiles hygroscopiques, pouvant entraîner corrosion, gel et formation d’acides" }
    },
    {
      id: "acidite-test",
      short: "Test acide",
      kicker: "Station 6 · Contrôler et décider",
      title: "Le test d’acidité n’est pas un test de pH ni un test d’humidité",
      lead: "Un kit d’acidité utilise un prélèvement d’huile et des réactifs pour révéler si le niveau d’acide dépasse le seuil prévu par sa notice.",
      details: [
        "Méthode : prélever un échantillon représentatif en sécurité, doser le volume prévu pour la famille d’huile et le seuil recherché, ajouter les réactifs dans l’ordre, agiter, laisser séparer les phases puis comparer l’indicateur à la notice.",
        "Un résultat positif conduit à rechercher la cause et à appliquer la procédure de nettoyage, de filtration, de remplacement et de nouveau contrôle. La teneur en eau demande un essai distinct."
      ],
      box: { type: "warning", text: "Les kits contiennent des produits chimiques : EPI, fiche de données de sécurité, volumes, couleurs et élimination sont ceux de la notice exacte." },
      visual: { kind: "oilAcidTest", title: "La méthode en quatre opérations", label: "Prélever, doser selon la notice, mélanger et séparer les phases, puis lire le résultat d’acidité et décider sans parler de pH" }
    }
  ],
  quiz: [
    {
      prompt: "Que signifie principalement ISO VG 46 ?",
      options: ["Une température limite d’emploi de 46 °C", "Une compatibilité avec 46 fluides listés", "Une viscosité proche de 46 mm²/s à 40 °C"],
      correct: 2,
      why: "Le nombre ISO VG caractérise la viscosité de référence à 40 °C. Il ne décrit pas une plage de température.",
      code: "6.01"
    },
    {
      prompt: "Que devient généralement la viscosité de l’huile quand sa température augmente ?",
      options: ["Elle augmente avec la température", "Elle diminue : l’huile se fluidifie", "Elle reste égale au nombre ISO VG"],
      correct: 1,
      why: "Les données fabricant montrent une forte diminution de viscosité avec la température. Le fluide dissous peut encore fluidifier le mélange.",
      code: "6.01"
    },
    {
      prompt: "Pourquoi un bidon de POE, PAG ou PVE doit-il rester fermé ?",
      options: ["Ces huiles captent l’humidité de l’air", "Ces huiles s’oxydent sous l’effet de la lumière", "Ces huiles s’évaporent en quelques heures"],
      correct: 0,
      why: "Ces familles sont hygroscopiques. L’eau absorbée peut rester invisible et dégrader le circuit comme l’huile.",
      code: "5.08 · 6.01"
    },
    {
      prompt: "Que mesure un kit de test acide pour huile frigorifique ?",
      options: ["Un pH, comme sur un prélèvement d’eau", "La teneur en eau de l’huile, en ppm", "Une indication d’acidité, selon la notice"],
      correct: 2,
      why: "Le kit révèle l’acidité selon son protocole. La teneur en eau demande un contrôle distinct ; parler de pH est inadapté ici.",
      code: "5.08 · 6.05"
    },
    {
      prompt: "Quelle est la bonne méthode avant d’ajouter de l’huile ?",
      options: ["Choisir la famille la plus récente du marché", "Relever modèle et fluide, puis lire l’approbation", "Reprendre l’huile déjà ouverte dans l’atelier"],
      correct: 1,
      why: "Cette chaîne relie la machine réelle à la référence exacte : modèle, fluide, approbation, puis famille, grade et référence.",
      code: "1.05 · 6.01 · 6.05"
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
