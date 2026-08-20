window.OIL_MODULE = {
  id: "retour-huile-naturel",
  title: "Le retour d’huile naturel",
  subtitle: "LE CIRCUIT D’HUILE · STATION 3",
  codes: ["1.05", "6.01", "6.05"],
  voix: true,
  nextStep: "Poursuivre avec « Vérifier le retour d’huile » : les régimes, le calcul de vitesse, la lecture du tracé et la méthode de diagnostic.",
  nextUrl: "../retour-huile-verifier/index.html",
  nextLabel: "Station 4 · Vérifier le retour d’huile",
  summaryVisual: { kind: "decision", label: "Observer le niveau, vérifier les régimes et contrôler le chemin de retour avant d’ajouter de l’huile" },
  lessons: [
    {
      id: "rappel-huile",
      short: "Rappel",
      kicker: "Station 1 · Rappel",
      recall: true,
      title: "L’huile partie du carter doit revenir",
      lead: "Une petite quantité d’huile quitte le compresseur avec le gaz de refoulement.",
      details: [
        "Elle traverse alors une partie du circuit frigorifique avant de retrouver le compresseur.",
        "Un bon retour maintient un niveau stable sans remplir les tuyauteries ou les échangeurs d’huile."
      ],
      box: { type: "key", text: "Ce qui part doit pouvoir revenir : le niveau du carter traduit un équilibre, pas seulement une quantité versée." },
      visual: { kind: "route", title: "Reprendre le trajet de l’huile", label: "Boucle frigorifique montrant l’huile entraînée puis ramenée vers le compresseur", caption: "Schéma inerWeb recomposé avec le symbole de compresseur validé de la bibliothèque technique." }
    },
    {
      id: "definition",
      short: "Principe",
      kicker: "Station 2 · Définition",
      title: "Naturel ne veut pas dire : par gravité seulement",
      lead: "Dans les lignes de vapeur, le gaz entraîne le film et les gouttelettes d’huile vers le compresseur.",
      details: [
        "La tuyauterie, les vitesses et les régimes de fonctionnement doivent permettre ce transport.",
        "Dans les zones où l’huile est miscible au fluide, son comportement reste lié au couple huile-fluide et à la température."
      ],
      box: { type: "warning", text: "Dire « l’huile redescend toute seule » est faux dès qu’il faut remonter une colonne ou fonctionner à charge réduite." },
      visual: { kind: "drivers", title: "Ce qui met l’huile en mouvement", label: "Débit de gaz, géométrie des tubes, température et propriétés du couple huile-fluide" }
    },
    {
      id: "vitesse",
      short: "Vitesse",
      kicker: "Station 3 · Entraînement",
      title: "La vitesse du gaz doit rester suffisante",
      lead: "Un diamètre se choisit pour concilier perte de charge acceptable et entraînement de l’huile.",
      details: [
        "Un tube surdimensionné peut donner une vitesse trop faible, surtout à charge minimale.",
        "Un tube trop petit augmente les pertes de charge. Le dimensionnement se vérifie aux régimes minimal et maximal."
      ],
      box: { type: "exam", text: "La bonne réponse n’est pas « le plus de vitesse possible », mais une plage compatible avec retour d’huile et pertes de charge." },
      visual: { kind: "drivers", title: "Un compromis à vérifier", label: "Balance entre vitesse suffisante pour l’huile et perte de charge maîtrisée" }
    },
    {
      id: "horizontales",
      short: "Pentes",
      kicker: "Station 4 · Tuyauterie",
      title: "Les lignes horizontales guident l’huile",
      lead: "Sur une ligne d’aspiration, la pente prévue par la conception accompagne l’huile dans le sens du retour vers le compresseur.",
      details: [
        "Les poches, contre-pentes et points bas non prévus peuvent retenir l’huile.",
        "La valeur de pente et les détails de montage se prennent dans les règles du constructeur et du projet."
      ],
      box: { type: "key", text: "Le trajet réel du tube compte : contrôler les niveaux, les points bas et le sens de la pente." },
      visual: { kind: "slope", title: "Une pente utile, sans poche parasite", label: "Tuyauterie inclinée dans le sens de l’écoulement vers le compresseur", caption: "Le sens est montré ; la valeur de pente reste celle du plan et de la notice applicables." }
    },
    {
      id: "colonnes",
      short: "Siphons",
      kicker: "Station 5 · Remontées",
      title: "Siphon et contre-siphon encadrent la remontée",
      lead: "Dans une remontée d’aspiration, l’huile doit être portée vers le haut par le gaz.",
      details: [
        "Le siphon prévu au pied de la colonne recueille l’huile au point bas afin que le débit de gaz puisse l’entraîner par portions.",
        "La boucle haute, souvent appelée contre-siphon, limite un drainage inverse dans certaines configurations. Sa présence et sa forme suivent le plan ou la notice."
      ],
      box: { type: "warning", text: "Siphon et contre-siphon ne sont pas des décorations systématiques : chaque boucle répond à une géométrie et à des régimes définis." },
      visual: { kind: "riser", title: "Lire la remontée complète", label: "Ligne d’aspiration avec siphon en pied, colonne montante, contre-siphon en tête et compresseur", caption: "Tracé inerWeb fondé sur le schéma d’aspiration existant ; compresseur repris de la bibliothèque technique validée." }
    }
  ],
  quiz: [
    {
      prompt: "Dans une colonne d’aspiration, qu’est-ce qui entraîne principalement l’huile vers le haut ?",
      options: ["La vitesse du gaz aspiré", "La pente de la colonne", "La gravité seule, en descente"],
      correct: 0,
      why: "Le gaz doit fournir l’entraînement nécessaire pour porter l’huile dans la colonne. La pente aide sur l’horizontale, pas dans une montée.",
      code: "6.05"
    },
    {
      prompt: "Quel défaut de tracé peut retenir l’huile ?",
      options: ["Un coude à grand rayon", "Une poche non prévue au tracé", "Une pente vers le compresseur"],
      correct: 1,
      why: "Les points bas parasites créent des zones d’accumulation. Une pente vers le compresseur, elle, accompagne le retour.",
      code: "1.05 · 6.05"
    },
    {
      prompt: "À quoi sert une double colonne correctement dimensionnée ?",
      options: ["Supprimer le contrôle de niveau", "Doubler le débit d’huile admis", "Garder une vitesse utile à bas débit"],
      correct: 2,
      why: "La petite section sert à faible débit ; les deux sections acceptent ensemble le débit élevé.",
      code: "1.05 · 6.05"
    },
    {
      prompt: "Quand faut-il prévoir un contre-siphon en tête de colonne ?",
      options: ["Quand le tracé et la notice le disent", "À chaque coude de la tuyauterie", "Dès que la colonne dépasse 2 m"],
      correct: 0,
      why: "Sa présence et sa forme suivent le plan et la notice. Ce n’est ni un réflexe de montage, ni une règle de hauteur.",
      code: "1.05"
    },
    {
      prompt: "Quelle affirmation est correcte ?",
      options: ["Un siphon va à chaque coude du tube", "Le retour dépend du tracé et des débits", "Le séparateur rend le retour inutile"],
      correct: 1,
      why: "Le retour naturel tient au tracé, aux débits et au couple huile-fluide. Un séparateur réduit l’huile entraînée, il ne la supprime pas.",
      code: "6.05 · 9.07"
    }
  ],
  sources: [
    {
      title: "BITZER — Causes of too low oil level and loss of oil",
      url: "https://www.bitzer.de/shared_media/html/est-600/en-GB/345371019345395723.html",
      use: "vitesse du gaz, tuyauteries, charge partielle et méthode de diagnostic"
    },
    {
      title: "BITZER — Oil level and oil return in refrigeration systems",
      url: "https://www.bitzer.de/shared_media/html/est-600/en-GB/339634059339636747.html",
      use: "équilibre du niveau et contrôle aux différents régimes"
    },
    {
      title: "Danfoss — Industrial Refrigeration Application Handbook",
      url: "https://assets.danfoss.com/documents/latest/470491/AB137786416217en-000801.pdf",
      use: "principes de gestion et de retour d’huile"
    },
    {
      title: "Copeland — Refrigeration Manual, System Design",
      url: "https://media.copeland.com/2c65d92c-bb4b-48e1-96e4-b1aa011847e5/AE104-System%20Design.pdf",
      use: "siphons, montées d’aspiration et fonctionnement d’une double colonne"
    },
    {
      title: "BITZER — Suction gas line",
      url: "https://www.bitzer.de/shared_media/html/st-600/en-GB/652371595652373387.html",
      use: "tracés d’aspiration, retour à charge partielle et montée dédoublée"
    },
    {
      title: "Légifrance — Arrêté du 21 novembre 2025, attestation d’aptitude",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646",
      use: "compétence pratique 6.05 : vérifier le retour d’huile"
    }
  ]
};
