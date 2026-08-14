/* =====================================================================
   paliers.js — L'ORDRE du parcours guidé. Six paliers, du premier
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
