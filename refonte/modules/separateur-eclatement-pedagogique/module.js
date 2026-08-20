window.OIL_MODULE = {
  id: "separateur-eclatement-pedagogique",
  title: "Le séparateur à éclatement",
  subtitle: "LE CIRCUIT D’HUILE · STATION 8",
  codes: ["1.05", "6.05", "9.07"],
  voix: true,
  nextStep: "Poursuivre avec le réservoir d’huile : quelle que soit la famille de séparateur, l’huile récupérée doit être stockée et rendue disponible aux compresseurs.",
  nextUrl: "../reservoir-huile-pedagogique/index.html",
  nextLabel: "Station 9 · Le réservoir d’huile",
  summaryVisual: { kind: "separatorMethods", label: "Deux familles de séparateurs d’huile : par élément de coalescence, ou par choc du jet sur une plaque" },
  lessons: [
    {
      id: "rappel",
      short: "Rappel",
      kicker: "Station 1 · Rappel",
      recall: true,
      title: "La mission ne change pas, le moyen change",
      lead: "La station précédente a posé la place du séparateur : sur le refoulement, entre le compresseur et le condenseur.",
      details: [
        "Sa mission est toujours la même : retirer au gaz une partie de l’huile qu’il emporte, et la renvoyer vers le carter ou vers une réserve.",
        "Ce que la station précédente a nommé en une phrase — ralentir, changer de direction, traverser un élément de coalescence — recouvre en réalité deux familles d’appareils que l’on rencontre sur le terrain."
      ],
      box: { type: "key", text: "Aucune des deux familles ne récupère toute l’huile : le retour naturel des tuyauteries reste nécessaire dans les deux cas." },
      visual: { kind: "route", title: "Replacer l’organe dans la boucle", label: "Circuit frigorifique avec l’huile quittant le compresseur puis y revenant" }
    },
    {
      id: "familles",
      short: "Familles",
      kicker: "Station 2 · Les deux familles",
      title: "À coalescence, ou à éclatement",
      lead: "Dans un séparateur à coalescence, le gaz traverse un élément filtrant qui rassemble les fines gouttelettes jusqu’à ce qu’elles tombent.",
      details: [
        "Dans un séparateur à éclatement, il n’y a pas d’élément à traverser : le gaz est projeté par une buse sur une plaque de choc placée en face.",
        "Les deux familles se reconnaissent à ce détail : une cartouche à remplacer d’un côté, un obstacle fixe de l’autre. Le reste du raccordement est identique."
      ],
      box: { type: "exam", text: "À l’oral : nommer la famille avant de décrire le fonctionnement. « Séparateur d’huile » ne suffit pas à désigner l’appareil." },
      visual: { kind: "separatorMethods", title: "Comparer les principes", label: "Impact sur chicanes, effet centrifuge et coalescence : trois principes, souvent combinés" }
    },
    {
      id: "choc",
      short: "Le choc",
      kicker: "Station 3 · Animation guidée",
      title: "Suivre le jet, de la buse à la plaque",
      lead: "L’animation déroule huit scènes commandées par l’élève : la buse, le jet, la plaque de choc, la chute de vitesse, le film d’huile, le retour par flotteur et les limites de l’appareil.",
      details: [
        "Le gaz de refoulement entre par une buse de petite section, donc à grande vitesse, et frappe une plaque placée juste en face.",
        "Les gouttes s’écrasent sur la plaque et s’y rassemblent ; le gaz, lui, change brutalement de direction et repart vers la sortie haute."
      ],
      box: { type: "key", text: "L’huile ne tombe pas parce qu’elle est filtrée : elle tombe parce qu’elle a été arrêtée net par un obstacle." },
      visual: { kind: "eclatementFilmSlot", title: "Animation guidée : le choc et l’éclatement", label: "Animation inerWeb adaptée du projet Claude Design « Séparateur à éclatement », huit scènes commandées par l’élève", caption: "Adaptation complète et hors ligne du projet Claude fourni par Franck : lecture manuelle, texte visible et symboles de la bibliothèque technique inerWeb." }
    },
    {
      id: "vitesse",
      short: "Vitesse",
      kicker: "Station 4 · Ce qui sépare",
      title: "Ce qui sépare, c’est la chute de vitesse",
      lead: "La buse a une petite section de passage : le gaz y va vite. Le corps du séparateur a une section bien plus grande : la vitesse s’y effondre.",
      details: [
        "Le débit ne change pas d’un point à l’autre ; c’est la section qui change, et la vitesse avec elle.",
        "Beaucoup plus dense que le gaz, l’huile garde son élan quand le gaz ralentit et change de direction : elle continue tout droit, frappe la plaque, puis ruisselle vers le fond."
      ],
      box: { type: "warning", text: "Ne pas retenir de vitesse « normale » apprise par cœur : les valeurs de passage se lisent dans la notice de l’appareil et l’étude de l’installation." },
      visual: { kind: "floatReturn", title: "Suivre l’huile jusqu’au retour", label: "Coupe pédagogique d’un séparateur à flotteur commandant un pointeau de retour" }
    },
    {
      id: "choisir",
      short: "Choisir",
      kicker: "Station 5 · Décision",
      title: "Ce qu’il sait faire, et ce qu’il ne sait pas",
      lead: "L’éclatement est simple et robuste : aucun élément filtrant à remplacer, une perte de charge faible et un coût modeste.",
      details: [
        "En contrepartie, le brouillard le plus fin traverse : le rendement de séparation reste inférieur à celui d’un coalescent.",
        "Sur une centrale, ou dès que les tuyauteries s’allongent, l’huile qui échappe au séparateur devient un vrai problème : on préfère alors un coalescent, en acceptant sa cartouche et sa perte de charge."
      ],
      box: { type: "exam", text: "Le choix se fait sur l’installation complète — architecture, longueur des lignes, plage de débit — jamais sur le seul prix de l’appareil." },
      visual: { kind: "drivers", title: "Croiser les paramètres", label: "Débit, couple huile-fluide et technologie du séparateur" }
    }
  ],
  quiz: [
    {
      prompt: "Dans un séparateur à éclatement, qu’est-ce qui arrête l’huile ?",
      options: ["Un tamis magnétique en partie basse", "Une plaque de choc placée face au jet", "Une cartouche filtrante à remplacer"],
      correct: 1,
      why: "Le jet sort de la buse et vient frapper une plaque : les gouttes s’y écrasent et s’y rassemblent. La cartouche appartient à l’autre famille, la coalescence, et aucun séparateur d’huile n’utilise le magnétisme.",
      code: "1.05"
    },
    {
      prompt: "Pourquoi les gouttes d’huile ne suivent-elles pas le virage du gaz ?",
      options: ["Parce que le gaz se refroidit sur la paroi", "Parce que la plaque de choc est aimantée", "Parce que l’huile est bien plus dense"],
      correct: 2,
      why: "Beaucoup plus dense que le gaz, l’huile garde son élan quand le gaz change de direction : elle continue tout droit. Ni la température de la paroi ni un quelconque magnétisme n’interviennent.",
      code: "1.05 · 6.05"
    },
    {
      prompt: "Que devient la vitesse du gaz entre la buse et le corps ?",
      options: ["Elle chute, car la section s’ouvre", "Elle monte, car le gaz se détend", "Elle ne bouge pas, le débit est le même"],
      correct: 0,
      why: "Le débit est bien le même de part et d’autre, mais la section de passage du corps est très supérieure à celle de la buse : la vitesse s’effondre, et le gaz ne peut plus porter l’huile.",
      code: "6.05"
    },
    {
      prompt: "Quel avantage l’éclatement a-t-il sur la coalescence ?",
      options: ["Il retient le brouillard le plus fin", "Il rend le retour naturel inutile", "Il n’a pas d’élément à remplacer"],
      correct: 2,
      why: "Sans cartouche, l’entretien est réduit et la perte de charge reste faible. Le brouillard fin, lui, traverse en partie ; et le retour naturel des tuyauteries reste nécessaire quelle que soit la famille.",
      code: "1.05 · 9.07"
    },
    {
      prompt: "Sur une centrale à longues lignes, que choisit-on plutôt ?",
      options: ["Un éclatement, moins cher à installer", "Un coalescent, plus fin au brouillard", "Aucun séparateur, la pente suffira"],
      correct: 1,
      why: "Plus les lignes s’allongent et plus la centrale est importante, plus l’huile qui échappe au séparateur pose problème. Le coalescent est alors préféré, cartouche et perte de charge acceptées.",
      code: "6.05 · 9.07"
    }
  ],
  sources: [
    {
      title: "BITZER — Oil separators",
      url: "https://www.bitzer.de/shared_media/html/kt-600/en-GB/313843723313845515.html",
      use: "place du séparateur au refoulement, retours et emploi en centrale"
    },
    {
      title: "Parker Sporlan — Oil Level Control System, SD-129",
      url: "https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-110/SD-129_-Oil-Level-Control-System-Installation.pdf",
      use: "architecture séparateur, réservoir et régulateurs de niveau"
    },
    {
      title: "Danfoss — Industrial Refrigeration Application Handbook",
      url: "https://assets.danfoss.com/documents/latest/470491/AB137786416217en-000801.pdf",
      use: "principes de séparation de l’huile et limites de rendement"
    },
    {
      title: "Légifrance — Attestation d’aptitude fluides",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646",
      use: "compétences 1.05, 6.05 et 9.07"
    }
  ]
};
