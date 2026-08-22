// outils/copier-ligne-regules-vers-pack.mjs — recopie la rame « Les régules » dans le pack
// public pilote-fluides, en recollant les liens sortants qui changent de dépôt.
//
// Décliné de copier-ligne-vers-pack.mjs (l'huile), qui reste câblé sur sa ligne : la rame
// de l'huile est publiée et on ne touche pas à son outil. Ici la composition vient du
// catalogue (catalog.js, la source unique), et les recollages sont CEUX DES RÉGULES :
//   · index.html : ../../moteur/ devient ../../../../moteur/ (le moteur vit à la racine
//     du site, une station du pack est quatre niveaux plus bas) ;
//   · engine.js  : les symboles fluidiques viennent du pack (res/symboles/), plus du
//     fonds de l'atelier ;
//   · hub.js     : le logo du hub revient au plan de formation, pas à l'accueil atelier.
// Films, voix, tests et assets restent à l'atelier (décision F. Henninot 22/08 :
// personne n'a encore écouté les narrations) : copie par LISTE BLANCHE, rien d'autre.
//
// Lancer :  node outils/copier-ligne-regules-vers-pack.mjs [--controle]

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ICI = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(ICI, "..", "refonte", "modules");
const PACK = resolve("C:/git/pilote-fluides/packs/fluides/res");
const CONTROLE = process.argv.includes("--controle");

// La composition de la rame : le catalogue fait foi — on l'exécute au lieu de le parser.
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(SOURCE, "_regules-commun", "catalog.js"), "utf8"), ctx);
const stations = ctx.window.REGULES_CATALOG.modules.map((m) => m.id);
if (stations.length !== 10)
  throw new Error("catalogue inattendu : " + stations.length + " stations au lieu de 10");

function recollerIndex(t) {
  return t.replace(/"\.\.\/\.\.\/moteur\//g, '"../../../../moteur/');
}
function recollerEngine(t) {
  return t.replace(/\.\.\/\.\.\/\.\.\/fonds-origine\/packs\/fluides\/res\/symboles\//g, "../symboles/");
}
function recollerHub(t) {
  return t.replace('href="../../../index.html"', 'href="../../../../index.html#ligne=regules"');
}

let ecrits = 0, inchanges = 0;
const journal = [];

function poser(relatif, contenu) {
  const destination = join(PACK, relatif);
  if (existsSync(destination) && readFileSync(destination, "utf8") === contenu) { inchanges++; return; }
  if (!CONTROLE) { mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, contenu, "utf8"); }
  ecrits++;
  journal.push("  maj  " + relatif);
}

function poserBinaire(source, relatif) {
  const destination = join(PACK, relatif);
  if (existsSync(destination) && statSync(destination).size === statSync(source).size) { inchanges++; return; }
  if (!CONTROLE) { mkdirSync(dirname(destination), { recursive: true }); copyFileSync(source, destination); }
  ecrits++;
  journal.push("  maj  " + relatif);
}

for (const id of [...stations, "regules-interactif"]) {
  poser(id + "/index.html", recollerIndex(readFileSync(join(SOURCE, id, "index.html"), "utf8")));
}

// La voix masculine suit chaque station ; la féminine reste à l'atelier, comme
// pour l'huile (le pack est publié, aucun bouton ne permet encore d'en changer).
for (const id of stations) {
  const dossierVoix = join(SOURCE, id, "voix", "masculine");
  if (!existsSync(dossierVoix)) continue;
  for (const f of readdirSync(dossierVoix)) {
    if (f.endsWith(".mp3")) poserBinaire(join(dossierVoix, f), id + "/voix/masculine/" + f);
  }
}
poser("_regules-commun/catalog.js", readFileSync(join(SOURCE, "_regules-commun", "catalog.js"), "utf8"));
poser("_regules-commun/engine.js", recollerEngine(readFileSync(join(SOURCE, "_regules-commun", "engine.js"), "utf8")));
poser("_regules-commun/hub.js", recollerHub(readFileSync(join(SOURCE, "_regules-commun", "hub.js"), "utf8")));
poser("_regules-commun/styles.css", readFileSync(join(SOURCE, "_regules-commun", "styles.css"), "utf8"));

// Garde : rien de ce qui vient d'être posé ne doit plus regarder vers l'atelier.
const fautes = [];
const poses = [...stations.map((s) => s + "/index.html"), "regules-interactif/index.html",
               "_regules-commun/catalog.js", "_regules-commun/engine.js",
               "_regules-commun/hub.js", "_regules-commun/styles.css"];
for (const relatif of poses) {
  const p = join(PACK, relatif);
  if (!existsSync(p)) { if (!CONTROLE) fautes.push("ABSENT " + relatif); continue; }
  const t = readFileSync(p, "utf8");
  if (t.includes("fonds-origine") || t.includes('"../../moteur/'))
    fautes.push("lien d'atelier survivant dans " + relatif);
}
if (!CONTROLE && existsSync(join(PACK, "_regules-commun/hub.js")) &&
    !readFileSync(join(PACK, "_regules-commun/hub.js"), "utf8").includes("#ligne=regules"))
  fautes.push("hub.js : le logo ne revient pas au plan (#ligne=regules absent)");
if (fautes.length) { console.error(fautes.join("\n")); process.exit(1); }

console.log(journal.join("\n"));
console.log((CONTROLE ? "--controle : rien n'a été écrit. " : "") +
  ecrits + " fichier(s) à jour · " + inchanges + " déjà identique(s) · " +
  stations.length + " stations + hub + commun");
