// outils/livrer-regules-planches.mjs — livre dans une copie du site les stations « Les régules »
// refaites (film + planches pas à pas), sans toucher au reste du pack.
//
// Copie ciblée : catalog.js, engine.js, styles.css, toutes les planches, les films des stations
// nommées ; puis, dans l'index.html de CHAQUE station nommée, la clé ?v= de catalog/engine/styles
// passe à la version du catalogue (« 2026-10-03c » → « 20261003c »). Les index.html du site ne sont
// jamais remplacés : le site les enrichit (voix, retour à l'accueil, lisibilité).
// Ensuite, côté site : build/animations.mjs puis build/retour-accueil.mjs (voir PLAN-REFONTE-PLANCHES.md).
//
// Usage : node outils/livrer-regules-planches.mjs <racine d'une copie de pilote-fluides> <station>… [--refaire-films]

import { readFileSync, writeFileSync, copyFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ICI = dirname(fileURLToPath(import.meta.url));
const COMMUN = resolve(ICI, "..", "refonte", "modules", "_regules-commun");
const args = process.argv.slice(2);
const REFAIRE_FILMS = args.includes("--refaire-films");   /* sinon un film déjà publié n'est pas recopié */
const [cible, ...stations] = args.filter((a) => !a.startsWith("--"));
if (!cible || !stations.length) { console.error("Usage : <racine pilote-fluides> <station>…"); process.exit(1); }
const PACK = join(resolve(cible), "packs", "fluides", "res");
if (!existsSync(join(PACK, "_regules-commun"))) { console.error("Pas un pilote-fluides : " + cible); process.exit(1); }

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(COMMUN, "catalog.js"), "utf8"), ctx);
const catalogue = ctx.window.REGULES_CATALOG;
const cle = catalogue.version.replace(/-/g, "");

const poses = [];
function copier(source, relatif) {
  mkdirSync(dirname(join(PACK, relatif)), { recursive: true });
  copyFileSync(source, join(PACK, relatif));
  poses.push(relatif);
}

for (const f of ["catalog.js", "engine.js", "styles.css"]) copier(join(COMMUN, f), "_regules-commun/" + f);
for (const f of readdirSync(join(COMMUN, "planches")).filter((f) => f.endsWith(".html")))
  copier(join(COMMUN, "planches", f), "_regules-commun/planches/" + f);

for (const id of stations) {
  const module = catalogue.modules.find((m) => m.id === id);
  if (!module) { console.error("Station inconnue : " + id); process.exit(1); }
  for (const film of module.films || []) {
    const rel = "_regules-commun/films/" + film.fichier;
    if (REFAIRE_FILMS || !existsSync(join(PACK, rel))) copier(join(COMMUN, "films", film.fichier), rel);
  }
  const index = join(PACK, id, "index.html");
  const avant = readFileSync(index, "utf8");
  const apres = avant.replace(/(_regules-commun\/(?:catalog\.js|engine\.js|styles\.css)\?v=)[^"']+/g, "$1" + cle);
  if (apres !== avant) { writeFileSync(index, apres, "utf8"); poses.push(id + "/index.html (clés ?v=" + cle + ")"); }
}

console.log(poses.map((p) => "  " + p).join("\n"));
console.log(poses.length + " fichier(s) posé(s) — version " + catalogue.version);
