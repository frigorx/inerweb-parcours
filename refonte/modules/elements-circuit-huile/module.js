window.OIL_MODULE = {
  id: "elements-circuit-huile",
  title: "La chaîne de l’huile : séparer et stocker",
  subtitle: "LE CIRCUIT D’HUILE · STATION 5",
  codes: ["1.05", "6.05", "9.07"],
  voix: true,
  nextStep: "Poursuivre avec la seconde moitié de la chaîne : le clapet taré, le régulateur mécanique, la régulation électronique et la chaîne de preuve.",
  nextUrl: "../elements-circuit-huile-regler/index.html",
  nextLabel: "Station 6 · La chaîne de l’huile : mettre sous pression et régler",
  summaryVisual: { kind: "active", label: "Refoulement vers séparateur et réserve, puis deux branches : huile vers le régulateur de niveau et pression contrôlée vers l’aspiration" },
  lessons: [
    {
      id: "rappel-retour",
      short: "Rappel",
      kicker: "Station 1 · Rappel spiralé",
      recall: true,
      title: "Le circuit actif complète le retour naturel",
      lead: "Le tracé et la vitesse du gaz restent indispensables, même lorsqu’on ajoute des organes de gestion d’huile.",
      details: [
        "Sur une installation simple, l’huile peut revenir directement au compresseur par le circuit frigorifique.",
        "Sur une centrale ou une installation exigeante, on sépare une partie de l’huile puis on organise sa distribution."
      ],
      box: { type: "key", text: "Les organes améliorent la gestion. Ils ne corrigent pas une tuyauterie mal dimensionnée." },
      visual: { kind: "decision", title: "Du retour naturel à la gestion active", label: "Deux voies complémentaires : tuyauterie correcte et organes de gestion d’huile" }
    },
    {
      id: "chaine",
      short: "Chaîne",
      kicker: "Station 2 · Vue d’ensemble",
      title: "Chaque organe a une place et une seule mission principale",
      lead: "La chaîne type va du refoulement vers le séparateur puis la réserve. Deux branches remplissent ensuite deux missions différentes.",
      details: [
        "La conduite d’huile part du réservoir vers le régulateur mécanique ou électronique qui gère le niveau du carter.",
        "Une autre conduite relie la partie pression du réservoir à l’aspiration par le clapet taré : elle établit le différentiel utile sans être le trajet normal de l’huile liquide."
      ],
      box: { type: "warning", text: "Le schéma exact dépend du système : retour direct, basse pression ou haute pression. Toujours lire la notice." },
      visual: { kind: "active", title: "Distinguer les deux branches", label: "Compresseur, séparateur et réservoir, puis conduite d’huile vers le régulateur et branche de pression par clapet différentiel vers l’aspiration", caption: "Compresseur et séparateur repris de la bibliothèque technique validée ; enveloppes fonctionnelles pour les autres organes." }
    },
    {
      id: "separateur",
      short: "Séparer",
      kicker: "Station 3 · Séparateur d’huile",
      title: "Le séparateur agit sur la ligne de refoulement",
      lead: "Le mélange gaz chaud-huile entre dans le séparateur. Le ralentissement et la séparation interne font tomber une partie de l’huile.",
      details: [
        "Le gaz poursuit vers le condenseur. L’huile collectée repart selon le montage : vers le compresseur ou vers une réserve.",
        "Un séparateur limite l’huile en circulation, mais n’annonce jamais une séparation absolue de 100 %."
      ],
      box: { type: "exam", text: "Pour vérifier son fonctionnement, recouper niveaux, températures, conduite de retour et stabilité ; un seul indice ne suffit pas." },
      visual: { kind: "separator", title: "Séparer sans arrêter le gaz", label: "Symbole de séparateur d’huile : mélange entrant, gaz sortant et huile collectée vers le retour", caption: "Symbole exact « separateur_huile.svg » de la bibliothèque technique inerWeb, intégré sans redessiner l’organe." }
    },
    {
      id: "reservoir",
      short: "Réserver",
      kicker: "Station 4 · Réservoir d’huile",
      title: "Le « bouteillon » est une réserve tampon",
      lead: "Le réservoir d’huile stocke l’huile séparée et la rend disponible pour plusieurs compresseurs.",
      details: [
        "Ses voyants permettent de suivre la réserve selon les limites prévues par le fabricant.",
        "Il ne faut pas le confondre avec le réservoir de liquide : fonction, raccordements et domaine de pression diffèrent."
      ],
      box: { type: "key", text: "Le réservoir fournit une réserve commune ; il ne décide pas, à lui seul, du niveau de chaque carter." },
      visual: { kind: "receiver", title: "Stocker puis distribuer", label: "Réservoir vertical avec voyants de niveau, entrée d’huile et sortie vers les compresseurs" }
    }
  ],
  quiz: [
    {
      prompt: "Où place-t-on le séparateur d’huile dans la chaîne frigorifique ?",
      options: ["Sur la ligne liquide, après le condenseur", "Sur la ligne d’aspiration, avant le carter", "Sur le refoulement, en sortie compresseur"],
      correct: 2,
      why: "Il reçoit le mélange gaz chaud-huile qui quitte le compresseur.",
      code: "1.05 · 9.07"
    },
    {
      prompt: "Quelle est la fonction principale du réservoir d’huile ?",
      options: ["Détendre le fluide frigorigène", "Constituer une réserve tampon d’huile", "Mesurer la surchauffe à l’aspiration"],
      correct: 1,
      why: "Il stocke l’huile séparée avant sa distribution aux compresseurs.",
      code: "1.05"
    },
    {
      prompt: "Pourquoi utilise-t-on un clapet différentiel sur un réservoir basse pression ?",
      options: ["Pour tenir une pression au-dessus du carter", "Pour équilibrer le réservoir sur le refoulement", "Pour vidanger le réservoir vers l’aspiration"],
      correct: 0,
      why: "Le différentiel maîtrisé permet l’écoulement vers le régulateur de niveau.",
      code: "1.05"
    },
    {
      prompt: "Comment agit un régulateur mécanique de type AC&R ?",
      options: ["Une électrovanne s’ouvre à intervalle fixe", "Un thermostat mesure la température d’huile", "Un flotteur commande un pointeau d’admission"],
      correct: 2,
      why: "La baisse du flotteur ouvre l’admission ; la remontée du niveau la referme.",
      code: "1.05"
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
