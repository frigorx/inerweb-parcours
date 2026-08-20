/* UNE liste ordonnée décide de tout : le rang affiché dans chaque station,
   l'enchaînement d'une station à la suivante, la carte de la ligne et la
   branche du plan de formation. Ajouter une station = une ligne ici. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const BASE = "C:/git/atelier-animations/refonte/modules";
const PLAN = "C:/git/pilote-fluides/index.html";

const LIGNE = [
  { id: "technologie-huiles-frigorifiques", court: "Familles", titre: "Les familles d’huile",
    plan: ["Les familles d’huile", "rôles et familles"],
    resume: "Comprendre à quoi sert l’huile dans le compresseur, suivre la fraction entraînée dans le circuit et distinguer les six familles.",
    points: ["rôles de l’huile", "MO, AB, PAO", "POE, PAG, PVE"] },
  { id: "technologie-huiles-choix-controle", court: "Choisir", titre: "Choisir et contrôler l’huile",
    plan: ["Choisir et contrôler", "grade, humidité"],
    resume: "Passer de la famille à la référence exacte, lire un grade ISO VG, et reconnaître ce que l’eau et l’acidité font à une huile.",
    points: ["méthode de choix", "miscibilité et grade", "humidité et test acide"] },
  { id: "retour-huile-naturel", court: "Retour", titre: "Le retour d’huile naturel",
    plan: ["Le retour naturel", "vitesse, pente, siphons"],
    resume: "Comprendre ce qui met l’huile en mouvement dans les lignes de vapeur : la vitesse du gaz, la pente et les siphons de remontée.",
    points: ["vitesse d’entraînement", "pente et points bas", "siphon et contre-siphon"] },
  { id: "retour-huile-verifier", court: "Vérifier", titre: "Vérifier le retour d’huile",
    plan: ["Vérifier le retour", "charge réduite, calcul"],
    resume: "Éprouver le tracé aux régimes réels : calculer la vitesse du gaz, lire un plan d’aspiration et conclure sans se fier à une seule mesure.",
    points: ["charge réduite et double colonne", "calcul de vitesse", "lecture de plan et diagnostic"] },
  { id: "elements-circuit-huile", court: "Séparer", titre: "La chaîne de l’huile : séparer et stocker",
    plan: ["Séparer et stocker", "séparateur, réservoir"],
    resume: "Replacer les deux premiers organes de la chaîne : ce qui sépare l’huile du gaz refoulé, et ce qui la garde en réserve.",
    points: ["vue d’ensemble de la chaîne", "le séparateur", "le réservoir"] },
  { id: "elements-circuit-huile-regler", court: "Régler", titre: "La chaîne de l’huile : mettre sous pression et régler",
    plan: ["Sous pression", "clapet et régulateurs"],
    resume: "Suivre la seconde moitié de la chaîne : la pression qui pousse l’huile, les régulateurs de niveau et ce qui prouve que le retour se fait.",
    points: ["le clapet taré", "régulateur mécanique et électronique", "la chaîne de preuve"] },
  { id: "separateur-huile-pedagogique", court: "Séparateur", titre: "Le séparateur d’huile",
    plan: ["Le séparateur", "flotteur et retour"],
    resume: "Voir où il se place, comment il collecte l’huile entraînée et dans quelles conditions il la renvoie vers le compresseur ou le réservoir.",
    points: ["implantation au refoulement", "flotteur et pointeau", "limites d’efficacité"] },
  { id: "separateur-eclatement-pedagogique", court: "Éclatement", titre: "Le séparateur à éclatement",
    plan: ["Séparateur à choc", "plaque et vitesse"],
    resume: "Reconnaître la seconde famille de séparateurs : le jet frappe une plaque, la vitesse s’écroule et l’huile tombe, sans aucun élément filtrant.",
    points: ["les deux familles", "le choc et la chute de vitesse", "quand préférer un coalescent"] },
  { id: "reservoir-huile-pedagogique", court: "Réservoir", titre: "Le réservoir d’huile",
    plan: ["Le réservoir", "réserve tampon, niveaux"],
    resume: "Comprendre la réserve tampon : ce qu’elle absorbe, ce que ses voyants disent, et ce qu’il faut faire avant d’ouvrir quoi que ce soit.",
    points: ["réserve et variations", "lecture des voyants", "sécurité avant démontage"] },
  { id: "clapet-differentiel-huile-pedagogique", court: "Clapet", titre: "Le clapet différentiel d’huile",
    plan: ["Le clapet taré", "la branche de pression"],
    resume: "Distinguer la branche de pression de la conduite d’huile, et comprendre ce que le tarage règle vraiment.",
    points: ["rôle du tarage", "quelle conduite", "différentiel trop faible"] },
  { id: "regulateur-huile-mecanique-pedagogique", court: "AC&R", titre: "Le régulateur mécanique AC&R",
    plan: ["Régulateur AC&R", "flotteur et pointeau"],
    resume: "Lire un régulateur à flotteur : où il se monte, comment il admet l’huile, et ce qu’il ne sait pas faire.",
    points: ["montage au carter", "flotteur et admission", "limites de fonctionnement"] },
  { id: "traxoil-pedagogique", court: "TraxOil", titre: "TraxOil : comment il travaille",
    plan: ["TraxOil", "capteur, vanne, alarme"],
    resume: "Comprendre la régulation électronique de niveau : le capteur, l’électrovanne d’admission et ce que dit une alarme.",
    points: ["capteur à effet Hall", "électrovanne", "alarme de niveau"] },
  { id: "traxoil-installer", court: "Monter", titre: "TraxOil : monter et diagnostiquer",
    plan: ["Monter le TraxOil", "modèles, BP/HP, preuve"],
    resume: "Choisir le bon modèle, le monter juste, reconnaître les architectures BP et HP, puis diagnostiquer sans condamner le contrôleur.",
    points: ["OM3, OM4, OM5", "architectures BP et HP", "chaîne de preuve"] },
  { id: "pressostat-differentiel-huile-pedagogique", court: "Pression nette", titre: "Le pressostat d’huile : la pression nette",
    plan: ["Pressostat d’huile", "P1 − P2, seuils"],
    resume: "Comprendre ce que surveille un pressostat différentiel : la pression nette de lubrification, et non un niveau.",
    points: ["pompe et raccordements", "P1 moins P2", "lecture des seuils"] },
  { id: "pressostat-huile-securite", court: "Sécurité", titre: "Le pressostat d’huile : temporisation et sécurité",
    plan: ["Temporisation", "délai, coupure, relevé"],
    resume: "Suivre la séquence complète : le délai au démarrage, la surveillance en marche, la coupure de sécurité et ce qu’il faut relever.",
    points: ["temporisation au démarrage", "coupure et réarmement", "le relevé qui conclut"] },
  { id: "diagnostic-circuit-huile", court: "Lire", titre: "Diagnostic : lire l’architecture et le retour",
    plan: ["Diagnostic : lire", "architecture, symptôme"],
    resume: "Commencer un diagnostic par l’architecture réelle du circuit, puis remonter le retour naturel et la séparation avant toute conclusion.",
    points: ["identifier l’architecture", "que dit un niveau bas", "retour naturel et séparation"] },
  { id: "diagnostic-circuit-huile-conclure", court: "Conclure", titre: "Diagnostic : pression, distribution et conclusion",
    plan: ["Conclure", "croiser et décider"],
    resume: "Terminer le diagnostic : le différentiel, la ligne d’huile jusqu’au carter, le croisement des indices et une conclusion vérifiable.",
    points: ["différentiel et ligne d’huile", "croiser plusieurs indices", "conclure et décider la suite"] },
];

/* 1 — rang affiché et enchaînement */
let touches = 0;
LIGNE.forEach((s, i) => {
  const suivant = LIGNE[i + 1];
  for (const f of ["module.js", "index.html"]) {
    const p = path.join(BASE, s.id, f);
    if (!fs.existsSync(p)) { console.log("MANQUE : " + s.id + "/" + f); continue; }
    let t = fs.readFileSync(p, "utf8");
    const avant = t;
    t = t.replace(/LE CIRCUIT D’HUILE · STATION \d+/g, "LE CIRCUIT D’HUILE · STATION " + (i + 1));
    if (f === "module.js" && suivant) {
      t = t.replace(/nextUrl: "[^"]*"/, 'nextUrl: "../' + suivant.id + '/index.html"');
      t = t.replace(/nextLabel: "[^"]*"/, 'nextLabel: "Station ' + (i + 2) + " · " + suivant.titre + '"');
    }
    if (t !== avant) { fs.writeFileSync(p, t, "utf8"); touches++; }
  }
});
console.log("rangs et enchaînements : " + touches + " fichiers");

/* 2 — la carte de la ligne */
const carte = path.join(BASE, "circuit-huile-interactif", "app.js");
let a = fs.readFileSync(carte, "utf8");
const debut = a.indexOf("var stations = [");
const fin = a.indexOf("\n  ];", debut);
if (debut < 0 || fin < 0) throw new Error("tableau stations introuvable dans la carte");
const corps = LIGNE.map((s) =>
  "    {\n" +
  '      short: "' + s.court + '",\n' +
  '      title: "' + s.titre + '",\n' +
  '      url: "../' + s.id + '/index.html",\n' +
  '      summary: "' + s.resume + '",\n' +
  "      topics: [" + s.points.map((p) => '"' + p + '"').join(", ") + "]\n" +
  "    }").join(",\n");
a = a.slice(0, debut) + "var stations = [\n" + corps + a.slice(fin);
fs.writeFileSync(carte, a, "utf8");
console.log("carte de la ligne : " + LIGNE.length + " stations");

/* 3 — la branche du plan de formation */
let h = fs.readFileSync(PLAN, "utf8");
const d2 = h.indexOf("    stations: [", h.indexOf("var HUILE = {"));
const f2 = h.indexOf("\n    ]", d2);
if (d2 < 0 || f2 < 0) throw new Error("stations de la branche introuvables");
const larg = Math.max(...LIGNE.map((s) => s.id.length)) + 3;
const corps2 = LIGNE.map((s) =>
  '      cours(' + ('"' + s.id + '",').padEnd(larg) + ' "' + s.plan[0] + '", "' + s.plan[1] + '")').join(",\n");
h = h.slice(0, d2) + "    stations: [\n" + corps2 + h.slice(f2);
fs.writeFileSync(PLAN, h, "utf8");
console.log("branche du plan : " + LIGNE.length + " stations");

/* 4 — contrôle : chaque module se charge et annonce le bon rang */
let ko = 0;
LIGNE.forEach((s, i) => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  try { vm.runInContext(fs.readFileSync(path.join(BASE, s.id, "module.js"), "utf8"), ctx); }
  catch (e) { console.log("JS CASSÉ : " + s.id + " — " + e.message); ko++; return; }
  const m = ctx.window.OIL_MODULE;
  // Le terminus ajoute « · TERMINUS » après son rang : on lit le numéro, on ne compare pas la fin.
  const rang = Number(String(m.subtitle.split("STATION ")[1] || "").trim().split(" ")[0]);
  if (rang !== i + 1) { console.log("rang faux : " + s.id + " → " + m.subtitle); ko++; }
});
console.log(ko ? ko + " anomalie(s)" : "les " + LIGNE.length + " stations se chargent, rangs cohérents");
