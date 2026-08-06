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
      { avenir: "La chaleur, sensible et latente", note: "à recouper du fonds" },
      { avenir: "Pression et température, le couple", note: "à recouper du fonds" },
    ],
  },
  {
    titre: "Le fluide",
    pour: "Lire un code, une étiquette, une bouteille — savoir à quoi on a affaire.",
    entrees: [
      { sujet: "lire-le-code" },
      { sujet: "classes-de-securite" },
      { avenir: "Familles et PRP", note: "à recouper du fonds" },
      { avenir: "Les bouteilles", note: "à recouper du fonds (Mission Bouteilles)" },
    ],
  },
  {
    titre: "Les organes",
    pour: "Chaque organe en détail : à quoi il sert, comment il est fait, où il lâche.",
    entrees: [
      { avenir: "Le compresseur", note: "à recouper du fonds (tome 3)" },
      { avenir: "Le condenseur", note: "à recouper du fonds (tome 3)" },
      { avenir: "Le détendeur", note: "à recouper du fonds (tome 3)" },
      { avenir: "L'évaporateur", note: "à recouper du fonds (tome 3)" },
      { avenir: "La vanne de service", note: "existe, à raccorder au moteur" },
      { avenir: "L'électrovanne", note: "à écrire — absente du fonds" },
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
      { avenir: "KVP · KVL · KVR", note: "en préparation chez F. Henninot" },
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
