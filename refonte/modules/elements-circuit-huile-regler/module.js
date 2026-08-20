window.OIL_MODULE = {
  id: "elements-circuit-huile-regler",
  title: "La chaîne de l’huile : mettre sous pression et régler",
  subtitle: "LE CIRCUIT D’HUILE · STATION 6",
  codes: ["1.05", "6.05", "9.07"],
  voix: true,
  nextStep: "Poursuivre avec « Le séparateur d’huile » : première station détaillée de la chaîne active.",
  nextUrl: "../separateur-huile-pedagogique/index.html",
  nextLabel: "Station 7 · Le séparateur d’huile",
  summaryVisual: { kind: "active", label: "Refoulement vers séparateur et réserve, puis deux branches : huile vers le régulateur de niveau et pression contrôlée vers l’aspiration" },
  lessons: [
    {
      id: "differentiel",
      short: "Pousser",
      kicker: "Station 1 · Clapet taré",
      title: "Le clapet taré crée le différentiel utile",
      lead: "Dans un système basse pression, le clapet différentiel évacue vers l’aspiration l’excès de pression du réservoir.",
      details: [
        "Il maintient ainsi le réservoir à une pression réglée ou tarée au-dessus de l’aspiration et du carter.",
        "Ce petit écart de pression permet à l’huile de circuler vers le régulateur sans l’alimenter brutalement."
      ],
      box: { type: "warning", text: "La valeur de tarage n’est pas universelle : elle doit convenir au montage, aux variations d’aspiration et aux organes installés." },
      visual: { kind: "differential", title: "Maîtriser ΔP", label: "Réservoir légèrement au-dessus de la pression du carter grâce à un clapet relié à l’aspiration" }
    },
    {
      id: "mecanique",
      short: "AC&R",
      kicker: "Station 2 · Régulateur mécanique",
      title: "Le « pot AC&R » régule par flotteur et pointeau",
      lead: "Le nom d’atelier désigne ici un régulateur mécanique de niveau monté au voyant du carter.",
      details: [
        "Quand le niveau baisse, le flotteur ouvre le pointeau et laisse entrer l’huile. Quand le niveau remonte, il referme l’alimentation.",
        "L’appareil doit être horizontal, adapté au compresseur et alimenté avec le différentiel prévu."
      ],
      box: { type: "exam", text: "Le régulateur mécanique ajoute l’huile manquante. Il ne sait pas retirer un excès déjà présent dans le carter." },
      visual: { kind: "mechanical", title: "Un niveau commande un pointeau", label: "Voyant, flotteur et pointeau d’admission d’huile d’un régulateur mécanique" }
    },
    {
      id: "traxoil",
      short: "TraxOil",
      kicker: "Station 3 · Régulation électronique",
      title: "TraxOil mesure, alimente et peut mettre en sécurité",
      lead: "Le régulateur électronique remplace le voyant du compresseur et surveille plusieurs zones de niveau.",
      details: [
        "Selon le modèle, un capteur détecte le niveau, des voyants indiquent l’état et une électrovanne intégrée admet l’huile manquante.",
        "Si le niveau ne revient pas dans le temps prévu, un contact peut transmettre une alarme ou arrêter le compresseur."
      ],
      box: { type: "warning", text: "OM3, OM4 et OM5 n’ont pas le même domaine de pression. Vérifier modèle, fluide, adaptateur, alimentation et notice." },
      visual: { kind: "traxoil", title: "Mesurer puis agir", label: "Capteur de niveau à trois zones, voyants, électrovanne et contact d’alarme" }
    },
    {
      id: "diagnostic",
      short: "Diagnostiquer",
      kicker: "Station 4 · Chaîne de preuve",
      title: "Niveau bas et pression d’huile ne racontent pas le même défaut",
      lead: "Le niveau décrit une réserve dans le carter. Le pressostat différentiel décrit la pression nette produite par une pompe à huile.",
      details: [
        "Pour un niveau bas, suivre réserve, vannes, filtre, régulateur, séparation et retour naturel.",
        "Pour une sécurité d’huile sur compresseur à pompe, relever P1 côté OIL et P2 côté carter, calculer P1 − P2 et tenir compte de la temporisation."
      ],
      box: { type: "exam", text: "Ne pas confondre une alarme de niveau TraxOil avec une sécurité de pression différentielle d’huile." },
      visual: { kind: "diagnostic", title: "Contrôler sans confondre les fonctions", label: "Chaîne de contrôle du niveau complétée par la mesure de pression nette de lubrification" }
    }
  ],
  quiz: [
    {
      prompt: "Que peut faire un TraxOil équipé pour la régulation ?",
      options: ["Mesurer le niveau, commander l’admission, alerter", "Remplacer le séparateur et le réservoir d’huile", "Choisir la famille d’huile selon le fluide"],
      correct: 0,
      why: "Le dispositif surveille le niveau et pilote son électrovanne ; il ne remplace pas le reste de la chaîne.",
      code: "1.05 · 6.05"
    },
    {
      prompt: "Le carter reste bas alors que la réserve contient de l’huile. Quel contrôle est pertinent ?",
      options: ["Température extérieure et hygrométrie du local", "Différentiel, vannes, filtre et régulateur", "Couleur de l’huile et propreté du carter"],
      correct: 1,
      why: "Il faut suivre le chemin de l’huile entre la réserve et le carter.",
      code: "6.05"
    },
    {
      prompt: "Comment vérifier le fonctionnement du séparateur ?",
      options: ["En touchant le tube de retour une seule fois", "En ajoutant de l’huile jusqu’au bon niveau", "En croisant niveaux, températures, régimes"],
      correct: 2,
      why: "La compétence demande une vérification : plusieurs indices cohérents évitent le diagnostic par valeur unique.",
      code: "9.07"
    },
    {
      prompt: "Après le réservoir d’un circuit actif basse pression, quelles sont les deux branches ?",
      options: ["Toute l’huile traverse le clapet taré d’abord", "Huile vers le régulateur ; pression à l’aspiration", "Deux conduites identiques vers le condenseur"],
      correct: 1,
      why: "Le régulateur reçoit l’huile ; le clapet taré agit sur la branche de pression reliée à l’aspiration.",
      code: "1.05 · 6.05 · 9.07"
    },
    {
      prompt: "Que surveille le pressostat différentiel d’huile sur un compresseur à pompe ?",
      options: ["Le niveau d’huile dans le réservoir tampon", "La pression de condensation du circuit", "L’écart entre pression de pompe et de carter"],
      correct: 2,
      why: "Il protège la lubrification en surveillant la pression nette P1 − P2 avec la temporisation prévue.",
      code: "1.05 · 6.03 · 6.05"
    }
  ],
  sources: [
    {
      title: "Parker Sporlan — Oil Level Control System",
      url: "https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-110/SD-129_-Oil-Level-Control-System-Installation.pdf",
      use: "réservoir, clapet différentiel et régulation de niveau"
    },
    {
      title: "Henry Group — Mechanical Oil Level Regulator",
      url: "https://www.henry-group.net/product/pressure-vessels/oil-level-regulators/mechanical-oil-level-regulator/",
      use: "flotteur, pointeau, voyant et réglage des modèles mécaniques AC&R"
    },
    {
      title: "Copeland — TraxOil electronic oil level control",
      url: "https://media.copeland.com/fa41ffc5-c1f8-4ea9-9c19-b16b010253ee/EN_DMC149_TraxOil.pdf",
      use: "capteur Hall, zones de niveau, électrovanne, voyants et alarme"
    },
    {
      title: "Légifrance — Arrêté du 21 novembre 2025, attestation d’aptitude",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646",
      use: "compétences 1.05, 6.05 et 9.07"
    },
    {
      title: "Danfoss — pressostats différentiels d’huile MP54/MP55/MP55A",
      url: "https://assets.danfoss.com/documents/latest/561042/AI545031222570en-000101.pdf",
      use: "pression nette P1−P2, temporisation et fonction de sécurité"
    }
  ]
};
