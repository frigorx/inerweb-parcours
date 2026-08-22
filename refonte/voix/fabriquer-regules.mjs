/* =====================================================================
   fabriquer-regules.mjs — la voix des stations de la rame « Les régules »
   ---------------------------------------------------------------------
   Décliné de fabriquer-stations.mjs (l'huile), qui reste câblé sur ses
   stations : les régules n'ont pas de module.js — leur contenu vit dans
   modules/_regules-commun/catalog.js (REGULES_CATALOG). Tout le reste est
   le régime commun : narrations écrites à part (voix/narrations/<station>.js),
   questions dérivées du quiz (énoncé sans la réponse, puis explication),
   deux voix Henri/Denise, MP3 dans modules/<station>/voix/<genre>/<id>.mp3.

   USAGE       node voix/fabriquer-regules.mjs                tout ce qui manque
               node voix/fabriquer-regules.mjs --tout         refait tout
               node voix/fabriquer-regules.mjs <station>      une seule
               node voix/fabriquer-regules.mjs --controle     ne fabrique rien

   ⚠️ CE SCRIPT ENVOIE LE TEXTE DES NARRATIONS À MICROSOFT — c'est là que
   se fait la synthèse. Ce sont des textes de cours, mais la règle reste :
   on ne le lance qu'avec un feu vert de Franck. --controle ne fait rien
   partir : il vérifie seulement narrations et écrans.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ICI = dirname(fileURLToPath(import.meta.url));
const REFONTE = resolve(ICI, "..");
const MODULES = resolve(REFONTE, "modules");

/* Les deux voix retenues — celles de l'huile et des capsules : une seule
   voix parle dans tout l'ensemble. */
const VOIX = {
  masculine: "fr-FR-HenriNeural",
  feminine: "fr-FR-DeniseNeural",
};

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const CONTROLE = args.includes("--controle");
const CIBLE = args.find((a) => !a.startsWith("--"));

/* --- 1. le catalogue : la liste des stations et de leurs écrans ------- */
const ctxCatalogue = { window: {} };
vm.createContext(ctxCatalogue);
vm.runInContext(
  readFileSync(join(MODULES, "_regules-commun", "catalog.js"), "utf8"),
  ctxCatalogue
);
const CATALOGUE = ctxCatalogue.window.REGULES_CATALOG.modules;
const STATIONS = new Set(CATALOGUE.map((m) => m.id));

/* --- 2. les narrations écrites (le dossier est partagé avec l'huile :
   on ne prend que les stations du catalogue des régules) ---------------- */
const NARRATIONS = {};
for (const f of readdirSync(resolve(ICI, "narrations"))) {
  if (!f.endsWith(".js")) continue;
  const code = readFileSync(join(ICI, "narrations", f), "utf8");
  new Function("NARRATION", code)((id, textes) => {
    if (STATIONS.has(id)) NARRATIONS[id] = textes;
  });
}

/* --- le texte pour l'oreille : les repères des schémas de commande.
   Les narrations sont déjà écrites orales ; ce filet sert surtout aux
   questions, dérivées du catalogue écrit pour l'œil. ------------------- */
const ORAL = [
  [/\bKM1\b/g, "K M un"],
  [/\bKM2\b/g, "K M deux"],
  [/\bKA1\b/g, "K A un"],
  [/\bKA2\b/g, "K A deux"],
  [/\bKA\b/g, "K A"],
  [/\bY1\b/g, "Y un"],
  [/\bB1\b/g, "B un"],
  [/\bH6\b/g, "H six"],
  [/\bBP-R\b/g, "B P de régulation"],
  [/\bBP-S\b/g, "B P de sécurité"],
  [/\bBP\b/g, "B P"],
  [/\bHP\b/g, "H P"],
  [/\bV4V\b/g, "V quatre V"],
  [/\b4 voies\b/g, "quatre voies"],
  [/R-?290\b/g, "R deux cent quatre-vingt-dix"],
  [/°C/g, " degrés"],
  [/→/g, ", puis "],
  [/[«»]/g, ""],
  [/\s+/g, " "],
];
function pourLOreille(texte) {
  let t = String(texte || "");
  for (const [motif, remplacement] of ORAL) t = t.replace(motif, remplacement);
  return t.trim();
}

/* Deux enregistrements par question : l'énoncé avec ses propositions —
   joué AVANT la réponse, il ne doit jamais la livrer — puis l'explication. */
const LETTRES = ["A", "B", "C", "D", "E"];
function questionsDe(m) {
  const out = [];
  m.quiz.forEach((q, i) => {
    const n = i + 1;
    const props = q.options.map((o, k) => "Proposition " + LETTRES[k] + " : " + o + ".").join(" ");
    out.push({
      id: "q" + n,
      texte: pourLOreille("Question " + n + " sur " + m.quiz.length + ". " + q.prompt + " " + props),
    });
    out.push({
      id: "q" + n + "-reponse",
      texte: pourLOreille("La bonne réponse est la proposition " + LETTRES[q.correct] + " : " +
        q.options[q.correct] + ". " + (q.why || "")),
    });
  });
  return out;
}

/* --- 3. confronter narrations et écrans ------------------------------- */
const travail = [];
let muets = 0, orphelins = 0;

for (const m of CATALOGUE) {
  if (CIBLE && m.id !== CIBLE) continue;
  const textes = NARRATIONS[m.id] || {};
  const ecrans = m.lessons.map((l) => l.id);
  for (const id of ecrans) {
    const texte = (textes[id] || "").trim();
    if (!texte) { console.warn("  ⚠ " + m.id + "/" + id + " : aucune narration, écran muet"); muets++; continue; }
    travail.push({ station: m.id, id, texte: pourLOreille(texte) });
  }
  for (const q of questionsDe(m)) travail.push({ station: m.id, id: q.id, texte: q.texte });
  for (const id of Object.keys(textes)) {
    if (!ecrans.includes(id)) { console.error("  ✖ " + m.id + "/" + id + " : narration orpheline, aucun écran de ce nom"); orphelins++; }
  }
}

const mots = travail.reduce((s, t) => s + t.texte.split(/\s+/).length, 0);
const nQuiz = travail.filter((t) => /^q\d+(-reponse)?$/.test(t.id)).length;
console.log("\n" + travail.length + " enregistrements à dire (" + (travail.length - nQuiz) +
  " écrans de cours, " + nQuiz + " de questions) · " + mots + " mots · " +
  (travail.length * 2) + " fichiers à produire (deux voix)");
console.log("écrans muets : " + muets + " · narrations orphelines : " + orphelins);
if (CONTROLE) { console.log("\n--controle : rien n'a été envoyé."); process.exit(orphelins ? 1 : 0); }
if (orphelins) { console.error("\nOn ne fabrique pas tant qu'une narration est orpheline."); process.exit(1); }

/* --- 4. fabriquer ----------------------------------------------------- */
const tmp = resolve(ICI, "_texte-regules.tmp.txt");
let faits = 0, sautes = 0, rates = 0;

for (const [genre, voix] of Object.entries(VOIX)) {
  console.log("\n— voix " + genre + " (" + voix + ")");
  let stationCourante = "";
  for (const t of travail) {
    const dossier = join(MODULES, t.station, "voix", genre);
    mkdirSync(dossier, { recursive: true });
    const sortie = join(dossier, t.id + ".mp3");
    if (!TOUT && existsSync(sortie)) { sautes++; continue; }
    if (t.station !== stationCourante) { stationCourante = t.station; process.stdout.write("\n  " + t.station + " : "); }
    writeFileSync(tmp, t.texte, "utf8");
    try {
      execFileSync("python", ["-m", "edge_tts", "--voice", voix, "--file", tmp, "--write-media", sortie], { stdio: "pipe" });
      faits++;
      process.stdout.write(t.id + " ");
    } catch (err) {
      rates++;
      console.error("\n  ✖ " + genre + "/" + t.station + "/" + t.id + " : " + String(err.message).split("\n")[0]);
    }
  }
}

console.log("\n\nfabriqués : " + faits + " · déjà là : " + sautes + " · ratés : " + rates);
if (faits) console.log("Les MP3 sont dans modules/<station>/voix/<genre>/ — la copie vers le pack emporte la voix masculine.");
