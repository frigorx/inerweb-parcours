window.OIL_MODULE = {
  id: "pressostat-differentiel-huile-pedagogique",
  title: "Le pressostat d’huile : la pression nette",
  subtitle: "LE CIRCUIT D’HUILE · STATION 14",
  codes: ["1.05", "6.03", "6.05", "9.07"],
  voix: true,
  nextStep: "Poursuivre avec la séquence : la temporisation au démarrage, la surveillance en marche, la coupure de sécurité et le diagnostic.",
  nextUrl: "../pressostat-huile-securite/index.html",
  nextLabel: "Station 15 · Le pressostat d’huile : temporisation et sécurité",
  summaryVisual: { kind: "oilPressureDiagnostic", label: "Synthèse du pressostat différentiel d’huile : mesurer deux pressions, respecter le délai, diagnostiquer puis décider" },
  lessons: [
    {
      id: "distinguer",
      short: "Distinguer",
      kicker: "Station 1 · Retour spiralé",
      recall: true,
      title: "Trois organes parlent d’huile, mais trois missions diffèrent",
      lead: "Le régulateur maintient un niveau. Le clapet différentiel maintient la pression du réservoir. Le pressostat protège la lubrification du compresseur.",
      details: [
        "Le pressostat différentiel ne remet pas d’huile dans le carter et ne règle pas le niveau.",
        "Il surveille la pression nette produite par une pompe à huile et agit sur la chaîne de sécurité."
      ],
      box: { type: "key", text: "Niveau, alimentation d’huile et pression de lubrification sont trois preuves différentes." },
      visual: { kind: "oilPressureSafety", title: "Replacer la fonction de sécurité", label: "Compresseur, symbole de pressostat et chaîne de sécurité électrique" }
    },
    {
      id: "application",
      short: "Pompe",
      kicker: "Station 2 · Domaine",
      title: "Le contrôle concerne un compresseur lubrifié par pompe",
      lead: "La pompe mécanique, entraînée avec le compresseur, aspire l’huile du carter puis l’envoie vers les paliers.",
      details: [
        "À l’arrêt, la pompe ne produit pas encore de différence de pression utile.",
        "Le montage, les seuils et le délai doivent correspondre au compresseur et au modèle de contrôle."
      ],
      box: { type: "warning", text: "Ne pas appliquer ce diagnostic à un compresseur dépourvu de pompe à huile sans vérifier sa technologie." },
      visual: { kind: "oilPressurePrinciple", title: "Identifier la pression créée par la pompe", label: "Pression de sortie de pompe comparée à la pression du carter" }
    },
    {
      id: "prises",
      short: "P1 − P2",
      kicker: "Station 3 · Raccordements",
      title: "Deux prises de pression construisent une seule information",
      lead: "P1, côté OIL, reçoit la pression de sortie de pompe. P2, côté LP, reçoit la pression du carter ou de l’aspiration prévue.",
      details: [
        "La pression nette de lubrification se lit par la différence : Δp huile = P1 − P2.",
        "Une pression P1 apparemment élevée peut rester insuffisante si P2 est élevée elle aussi."
      ],
      box: { type: "exam", text: "Toujours nommer les deux prises avant de poser la soustraction." },
      visual: { kind: "oilPressurePrinciple", title: "Calculer la pression nette", label: "P1 sortie de pompe moins P2 pression de carter égale différentiel d’huile" }
    },
    {
      id: "seuils",
      short: "Seuils",
      kicker: "Station 4 · Lecture",
      title: "Le seuil réglé et le différentiel de contact ne désignent pas la même chose",
      lead: "Le seuil fixe la valeur basse qui lance la temporisation lorsque la pression nette chute.",
      details: [
        "Pour revenir à l’état normal, la pression doit remonter au-delà du seuil augmenté du différentiel de contact propre au modèle.",
        "Une échelle de boîtier reste un repère : le contrôle se fait avec des instruments et la notice exacte."
      ],
      box: { type: "key", text: "Seuil de sécurité, hystérésis de contact et délai sont trois données distinctes." },
      visual: { kind: "oilPressureTimer", title: "Distinguer pression et temps", label: "Temporisation démarrant sous le seuil et s’arrêtant après rétablissement suffisant" }
    },
    {
      id: "mecanisme",
      short: "Mécanisme",
      kicker: "Station 5 · Fonctionnement",
      title: "Deux pressions opposées commandent un contact",
      lead: "Dans un modèle mécanique, deux éléments sensibles reçoivent P1 et P2 en opposition.",
      details: [
        "Leur différence déplace le mécanisme qui commande le circuit de temporisation.",
        "L’adaptation du visuel Claude montre les deux côtés, le contact T1–T2, la résistance, le bilame et le contact L–M sans recopier une coupe constructeur."
      ],
      box: { type: "exam", text: "Le texte porte déjà toute l’explication ; l’interaction montre les états, sans ajouter une règle cachée." },
      visual: { kind: "oilPressureClaudeSlot", title: "Explorer les trois états du mécanisme", label: "Adaptation interactive du visuel Claude du pressostat différentiel d’huile", caption: "Choisir Démarrage, Pression suffisante ou Défaut persistant. Adaptation locale du projet Claude fourni par Franck." }
    }
  ],
  quiz: [
    { prompt: "Quelle est la mission du pressostat différentiel d’huile ?", options: ["Arrêter le compresseur si la pression manque", "Maintenir le niveau d’huile du réservoir", "Séparer l’huile du gaz de refoulement"], correct: 0, why: "Il protège le compresseur à pompe en surveillant la pression nette de lubrification.", code: "6.03" },
    { prompt: "En quoi diffère-t-il d’un régulateur de niveau TraxOil ?", options: ["Il agit plus vite sur le même niveau", "Il surveille une pression, pas un niveau", "Il remplit la même fonction, autrement"], correct: 1, why: "TraxOil gère le niveau ; le pressostat différentiel protège la lubrification sous pression.", code: "1.05 · 6.03" },
    { prompt: "Où se raccorde normalement P1 côté OIL ?", options: ["À la bouteille liquide du circuit", "Sur l’aspiration, avant le carter", "À la sortie de la pompe à huile"], correct: 2, why: "P1 reçoit la pression fournie par la pompe à huile.", code: "1.05" },
    { prompt: "Comment obtenir la pression nette d’huile ?", options: ["P1 moins P2", "P1 plus P2", "P2 divisée par P1"], correct: 0, why: "Le contrôle compare la sortie de pompe à la pression du carter ou de l’aspiration.", code: "6.03" },
    { prompt: "Pourquoi une temporisation existe-t-elle au démarrage ?", options: ["Pour éviter les à-coups sur le moteur", "Pour laisser chauffer l’huile du carter", "Pour laisser la pompe monter en pression"], correct: 2, why: "À l’arrêt, la pompe entraînée ne produit pas encore de pression nette.", code: "6.03" }
  ],
  sources: [
    { title: "Danfoss — MP54 / MP55 / MP55A, fiche technique", url: "https://assets.danfoss.com/documents/latest/561042/AI545031222570en-000101.pdf", use: "rôle, deux prises OIL/LP, seuil, différentiel de contact, temporisation, test et réarmement" },
    { title: "Danfoss — MP54 / MP55 / MP55A, guide d’installation", url: "https://assets.danfoss.com/documents/latest/459777/AN211986434504en-000403.pdf", use: "raccordements p1/p2, montage et schéma de câblage" },
    { title: "Danfoss — gamme MP", url: "https://designcenter.danfoss.com/products/climate-solutions-for-cooling/switches/differential-pressure-switches/mp54---mp55---mp55a?tab=products", use: "fonction de sécurité et variantes de la gamme" },
    { title: "Légifrance — attestation d’aptitude fluides", url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646", use: "ancrage des questions de préparation aux compétences" }
  ]
};
