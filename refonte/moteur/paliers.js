/* =====================================================================
   paliers.js — L'ORDRE du parcours guidé. Sept paliers, du premier
   contact jusqu'à l'examen. C'est la réponse à la critique de
   F. Henninot (06/08/2026) : « l'ordre n'est pas forcément intelligent ».
   ---------------------------------------------------------------------
   Deux sortes d'entrées :
     { sujet: "id" }                → une capsule existante (refonte/capsules/)
     { avenir: "Titre", note: "" } → une place réservée, affichée grisée.
   La page parcours.html résout les capsules et calcule vu / en cours.
   L'ordre PROPOSE, il n'impose jamais : tout reste cliquable.
   ===================================================================== */
window.PALIERS = [
  {
    titre: "Les bases",
    pour: "Aucun prérequis. Ce qu'on voit sur toute machine, avant de parler métier.",
    entrees: [
      { sujet: "le-circuit" },
      { sujet: "la-chaleur" },
      { sujet: "pression-temperature" },
    ],
  },
  {
    titre: "Le fluide",
    pour: "Lire un code, une étiquette, une bouteille — savoir à quoi on a affaire.",
    entrees: [
      { sujet: "lire-le-code" },
      { sujet: "familles-et-prp" },
      { sujet: "classes-de-securite" },
      { avenir: "La Rame CO₂ — vers la catégorie B", note: "projet unique : 8 gares liées, 40 écrans, 40 questions et passage explicite vers Habilitation Fluides ; brouillon à valider en relecture",
        essai: "modules/co2-r744-interactif/index.html" },
      { sujet: "les-bouteilles" },
    ],
  },
  {
    titre: "Les organes",
    pour: "Chaque organe en détail : à quoi il sert, comment il est fait, où il lâche.",
    entrees: [
      { avenir: "Le compresseur", note: "à recouper du fonds (tome 3)" },
      { avenir: "Le condenseur", note: "à recouper du fonds (tome 3)" },
      { avenir: "Le détendeur", note: "module rangé le 13/08 au soir (14 écrans, version du 07/08) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/detendeur-pedagogique/index.html" },
      { avenir: "L'évaporateur", note: "à recouper du fonds (tome 3)" },
      { avenir: "La vanne de service", note: "module Rotalock v5 (mini-jeux) rangé le 13/08 — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/vanne-rotalock-pedagogique/index.html" },
      { avenir: "L'électrovanne", note: "module rangé le 13/08 au soir (14 écrans) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/electrovanne-pedagogique/index.html" },
      { avenir: "La bouteille liquide", note: "module rangé le 13/08 (14 écrans) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/bouteille-liquide-pedagogique/index.html" },
      { avenir: "Le filtre déshydrateur", note: "module rangé le 13/08 (15 écrans) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/filtre-deshydrateur-pedagogique/index.html" },
      { avenir: "Le voyant liquide", note: "module rangé le 13/08 (18 écrans) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/voyant-liquide-pedagogique/index.html" },
    ],
  },
  {
    titre: "Le circuit d’huile",
    pour: "Comprendre l’huile, suivre son retour, puis lire la chaîne qui protège le niveau et la lubrification des compresseurs.",
    entrees: [
      { avenir: "Ouvrir la ligne complète — Le circuit d’huile", note: "entrée interactive unique : carte de métro, 10 stations liées et navigation continue ; brouillon à valider en relecture",
        essai: "modules/circuit-huile-interactif/index.html" },
      { avenir: "Technologie des huiles frigorifiques", note: "brouillon repris du 19/08 : 12 stations sur circuit réel, six familles, associations fluide-huile, ISO VG, température, humidité et acidité, puis 10 questions — à valider en relecture",
        essai: "modules/technologie-huiles-frigorifiques/index.html" },
      { avenir: "Le retour d’huile naturel", note: "brouillon du 19/08 : 9 stations sur vitesse, pente, siphon, contre-siphon, double colonne et méthode de vérification, puis 9 questions — à valider en relecture",
        essai: "modules/retour-huile-naturel/index.html" },
      { avenir: "Les éléments du circuit d’huile", note: "brouillon du 19/08 : séparateur, réservoir, clapet taré, régulateur mécanique AC&R, TraxOil et pressostat différentiel, puis 9 questions — à valider en relecture",
        essai: "modules/elements-circuit-huile/index.html" },
      { avenir: "Le séparateur d’huile", note: "brouillon du 19/08 : implantation, séparation, flotteur, retour direct ou par réservoir, contrôle et diagnostic — 8 stations et 8 questions",
        essai: "modules/separateur-huile-pedagogique/index.html" },
      { avenir: "Le réservoir d’huile", note: "brouillon du 19/08 : réserve tampon, raccordements, pression, voyants, mise en service et diagnostic — 8 stations et 8 questions",
        essai: "modules/reservoir-huile-pedagogique/index.html" },
      { avenir: "Le clapet différentiel d’huile", note: "brouillon du 19/08 : branche de pression, tarage, choix, pressions d’aspiration multiples et mesures — 7 stations et 7 questions",
        essai: "modules/clapet-differentiel-huile-pedagogique/index.html" },
      { avenir: "Le régulateur d’huile mécanique AC&R", note: "brouillon du 19/08 : flotteur, pointeau, montage horizontal, filtre, pression disponible et diagnostic — 8 stations et 8 questions",
        essai: "modules/regulateur-huile-mecanique-pedagogique/index.html" },
      { avenir: "La régulation électronique TraxOil", note: "brouillon du 19/08 : capteur, électrovanne, zones de niveau, alarme, OM3/OM4/OM5 et architectures BP/HP — 9 stations et 9 questions",
        essai: "modules/traxoil-pedagogique/index.html" },
      { avenir: "Le pressostat différentiel d’huile", note: "brouillon du 19/08 : pression nette P1−P2, seuil, temporisation, chaîne de sécurité, mesures et diagnostic — 10 stations et 10 questions ; baie SVG Claude préparée",
        essai: "modules/pressostat-differentiel-huile-pedagogique/index.html" },
      { avenir: "Diagnostic du circuit d’huile", note: "terminus de la ligne : lecture d’architecture, indices croisés, mesures, décision et formulation professionnelle — 9 stations et 10 questions",
        essai: "modules/diagnostic-circuit-huile/index.html" },
    ],
  },
  {
    titre: "Les gestes",
    pour: "Ce qu'on fait avec les mains, dans l'ordre, et pourquoi dans cet ordre.",
    entrees: [
      { avenir: "Lire un manomètre", note: "en préparation chez F. Henninot" },
      { sujet: "tirage-au-vide" },
      { sujet: "la-recuperation" },
      { avenir: "Balayage et épreuve d'azote", note: "à recouper du fonds" },
      { avenir: "Pesée et charge", note: "à recouper du fonds" },
    ],
  },
  {
    titre: "La régulation",
    pour: "Faire tenir la bonne température : mesurer, régler, comprendre ce qui pilote.",
    entrees: [
      { sujet: "la-surchauffe" },
      { avenir: "Le sous-refroidissement", note: "jumelle de la surchauffe, à écrire" },
      { avenir: "KVP · KVL · KVR", note: "module publié le 07/08 (8 écrans, 3D, coupe animée) — à valider en relecture ; la capsule qui l'introduit reste à écrire",
        essai: "modules/regulateurs-kv-pedagogiques/index.html" },
      { avenir: "Le détendeur électronique", note: "en préparation chez F. Henninot" },
      { avenir: "Les pressostats", note: "à écrire" },
    ],
  },
  {
    titre: "La règle et l'examen",
    pour: "Ce que la réglementation exige, et sous quelle forme la question tombe.",
    entrees: [
      { sujet: "controle-etancheite" },
      { avenir: "Intervenir sur A3 (hydrocarbures)", note: "à recouper du fonds" },
      { avenir: "Aptitude et capacité", note: "à recouper du fonds" },
      { avenir: "Bilan thermique et performance", note: "à recouper du fonds" },
      { avenir: "La chaîne de l'intervention", note: "parcours de synthèse, en clôture" },
    ],
  },
];
