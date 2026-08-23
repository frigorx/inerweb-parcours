window.CO2_MODULE = {
  id: "co2-pourquoi-r744",
  title: "Pourquoi le R744 ?",
  subtitle: "DÉCOUVRIR LE CO₂ · GARE 1",
  codes: ["1.07", "2.02", "11.04", "11.06"],
  nextStep: "La gare suivante place les deux repères qui commandent toute la suite : le point triple et le point critique.",
  nextUrl: "../co2-etats-physiques/index.html",
  nextLabel: "Gare 2 · États physiques",
  summaryVisual: { kind: "benefits", label: "Le R744 associe un faible impact direct à une architecture et une régulation spécifiques" },
  relatedLinks: [
    { label: "Rappel Habilitation Fluides · familles et PRP", url: "../../capsule.html?sujet=familles-et-prp" }
  ],
  lessons: [
    {
      id: "identite",
      short: "Identifier",
      kicker: "Gare 1 · Premier repère",
      recall: true,
      title: "CO₂, dioxyde de carbone et R744 désignent le même fluide",
      lead: "R744 est le numéro de réfrigérant du dioxyde de carbone utilisé dans un circuit frigorifique.",
      details: [
        "Il appartient aux fluides dits naturels. Son potentiel de réchauffement planétaire de référence vaut **1** et son potentiel d’appauvrissement de l’ozone vaut **0**.",
        "Le classement de sécurité A1 décrit une toxicité plus faible et l’absence de propagation de flamme. Il ne décrit ni la pression, ni le risque de froid, ni l’accumulation dans un local."
      ],
      box: { type: "key", text: "Trois noms à relier : formule CO₂, nom R744, catégorie d’intervention B." },
      visual: { kind: "identity", title: "La carte d’identité du fluide", label: "Molécule CO₂ reliée aux repères fluide naturel, classe A1 et attestation catégorie B" }
    },
    {
      id: "impact",
      short: "Impact",
      kicker: "Gare 1 · Environnement",
      title: "Un PRP de 1 réduit fortement l’impact climatique direct d’une fuite",
      lead: "Le CO₂ sert d’étalon pour comparer l’effet de serre des autres fluides sur la durée réglementaire.",
      details: [
        "Cet avantage concerne l’impact **direct** du réfrigérant. L’électricité consommée par l’installation produit aussi un impact indirect.",
        "Une installation R744 n’est donc pas automatiquement performante : conception, climat, réglages, récupération de chaleur et maintenance comptent ensemble."
      ],
      box: { type: "warning", text: "Faible PRP ne signifie ni faible pression, ni machine simple, ni rendement garanti." },
      visual: { kind: "benefits", title: "L’intérêt se juge sur le système complet", label: "Trois colonnes croisent climat, application et conception" }
    },
    {
      id: "applications",
      short: "Usages",
      kicker: "Gare 1 · Applications",
      title: "Le R744 s’est installé dans le froid commercial, l’industrie et certaines pompes à chaleur",
      lead: "Sa forte capacité frigorifique volumétrique permet des compresseurs et des tuyauteries adaptés à des débits importants.",
      details: [
        "On le rencontre en cascade subcritique, en groupe dédié, en centrale transcritique booster et dans des systèmes avec récupération de chaleur.",
        "Ces architectures ne sont pas interchangeables. Pour comprendre une machine, il faut d’abord identifier ses niveaux de pression et son mode de rejet de chaleur."
      ],
      box: { type: "key", text: "La bonne question n’est pas seulement « quel fluide ? », mais « quelle architecture emploie ce fluide ? »." },
      visual: { kind: "booster", title: "Un exemple d’architecture R744", label: "Architecture booster simplifiée avec postes moyenne et basse température, réservoir flash et deux étages de compression" }
    },
    {
      id: "arbitrage",
      short: "Arbitrer",
      kicker: "Gare 1 · Choix technique",
      title: "Le CO₂ n’est ni la solution universelle, ni un fluide à écarter par principe",
      lead: "Un choix professionnel croise l’application, le climat, la température utile, la sécurité du site et l’efficacité annuelle.",
      details: [
        "Le cycle transcritique rend la régulation haute pression déterminante. Les compresseurs parallèles, éjecteurs ou stratégies de récupération de chaleur peuvent améliorer le système dans certains cas.",
        "Ces optimisations appartiennent à la conception réelle. Le parcours apprend d’abord à reconnaître leur rôle, pas à les dimensionner."
      ],
      box: { type: "exam", text: "Formulation attendue : « avantage environnemental, mais architecture, sécurité et performance à vérifier pour l’application »." },
      visual: { kind: "tradeoffs", title: "Mettre les atouts et les contraintes en balance", label: "Balance pédagogique opposant faible impact direct et contraintes de conception" }
    },
    {
      id: "decider",
      short: "Décider",
      kicker: "Gare 1 · Manipulation",
      title: "Choisissez la justification professionnelle",
      lead: "Une centrale doit être remplacée. L’objectif est de réduire l’impact direct sans promettre une performance non calculée.",
      details: [
        "L’élève doit conserver dans sa réponse l’avantage du R744 **et** les conditions de réussite.",
        "Cette façon de raisonner servira dans toutes les gares suivantes : observer, comparer, puis nommer ce qui reste à valider."
      ],
      box: { type: "key", text: "Une bonne décision contient aussi ses limites et le prochain contrôle." },
      visual: { kind: "tradeoffs", title: "Quelle réponse tient les deux côtés ?", label: "Balance entre atouts environnementaux et contraintes techniques" },
      activity: {
        prompt: "Quelle phrase gardez-vous ?",
        options: ["PRP 1 : le CO₂ est toujours meilleur", "R744 pertinent si système, climat et sécurité sont validés", "Haute pression : le CO₂ est toujours à éviter"],
        correct: 1,
        why: "Elle conserve l’avantage environnemental sans masquer l’architecture, l’efficacité et la sécurité à vérifier."
      }
    }
  ],
  quiz: [
    { prompt: "Que signifie R744 ?", options: ["Le numéro de réfrigérant du CO₂", "Une classe de pression", "Un type de compresseur"], correct: 0, why: "R744 est la désignation du dioxyde de carbone comme fluide frigorigène.", code: "1.07", visual: "identity" },
    { prompt: "Que permet d’affirmer le classement A1 du R744 ?", options: ["La pression est faible", "La toxicité est plus faible et il ne propage pas la flamme", "Le local n’a pas besoin de détection"], correct: 1, why: "La classe A1 ne couvre ni la pression, ni le froid, ni l’accumulation du gaz.", code: "1.07", visual: "safety" },
    { prompt: "Pourquoi le PRP = 1 ne suffit-il pas à conclure sur l’impact total ?", options: ["Parce que l’énergie consommée compte aussi", "Parce que le CO₂ détruit l’ozone", "Parce que le PRP ne concerne que les solides"], correct: 0, why: "L’impact direct du fluide et l’impact indirect lié à l’énergie doivent être distingués.", code: "2.02 · 11.04", visual: "benefits" },
    { prompt: "Quel premier réflexe aide à comprendre une machine R744 ?", options: ["Compter ses ventilateurs", "Identifier son architecture et ses niveaux de pression", "Chercher uniquement la masse de fluide"], correct: 1, why: "Subcritique, transcritique, cascade ou booster ne se lisent pas de la même manière.", code: "11.06", visual: "booster" },
    { prompt: "Quelle conclusion professionnelle est correcte ?", options: ["Le R744 est universel", "Le R744 est inutilisable", "Le R744 est une option à évaluer sur le système complet"], correct: 2, why: "Le choix croise application, climat, sécurité, architecture et efficacité annuelle.", code: "11.04", visual: "tradeoffs" }
  ],
  sources: window.CO2_SOURCES
};
