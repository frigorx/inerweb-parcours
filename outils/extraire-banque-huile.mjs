// outils/extraire-banque-huile.mjs — sort les QCM de la ligne « Le circuit d'huile »
// au format attendu par inerweb-habilitation/outils/mesurer-banque.mjs.
//
// RÔLE : permettre de MESURER la devinabilité de la banque après chaque écriture de station.
// N'écrit jamais dans les modules : il lit et recopie, la rédaction des distracteurs reste
// un acte pédagogique validé à la main.
//
// Lancer :  node outils/extraire-banque-huile.mjs [chemin-de-sortie.json]
// Puis   :  node ../inerweb-habilitation/outils/mesurer-banque.mjs --banque <chemin>

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ICI = dirname(fileURLToPath(import.meta.url));
const MODULES = resolve(ICI, "..", "refonte", "modules");
const ORDRE = resolve(ICI, "ordonner-ligne.js");

// L'ordre de la ligne a UNE source : ordonner-ligne.js. On la relit plutôt que de
// tenir une seconde liste qui divergerait au premier ajout de station.
function stationsDeLaLigne() {
  const src = readFileSync(ORDRE, "utf8");
  const ids = [...src.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (!ids.length) throw new Error("aucune station lue dans ordonner-ligne.js");
  return ids;
}

function lireModule(id) {
  const chemin = join(MODULES, id, "module.js");
  if (!existsSync(chemin)) throw new Error("module absent : " + chemin);
  const bac = { window: {} };
  vm.createContext(bac);
  vm.runInContext(readFileSync(chemin, "utf8"), bac, { filename: chemin });
  const m = bac.window.OIL_MODULE;
  if (!m) throw new Error("window.OIL_MODULE absent dans " + chemin);
  return m;
}

const sortie = resolve(process.argv[2] || join(ICI, "..", "build", "banque-huile.json"));
const questions = [];
const parStation = [];

for (const id of stationsDeLaLigne()) {
  const m = lireModule(id);
  const quiz = Array.isArray(m.quiz) ? m.quiz : [];
  quiz.forEach((q, i) => {
    questions.push({
      id: id + "-q" + (i + 1),
      dc: m.title,
      code: q.code || (m.codes || []).join(" · "),
      niveau: "ligne-huile",
      type: "qcm",
      enonce: q.prompt,
      choix: q.options,
      bonne: q.correct,
    });
  });
  parStation.push({ station: m.title, questions: quiz.length });
}

writeFileSync(sortie, JSON.stringify(questions, null, 1), "utf8");
console.log(parStation.map((s) => s.questions + "  " + s.station).join("\n"));
console.log("\n" + questions.length + " questions écrites dans " + sortie);
