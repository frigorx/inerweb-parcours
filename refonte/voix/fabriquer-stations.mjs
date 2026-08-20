/* =====================================================================
   fabriquer-stations.mjs — la voix des stations du circuit d'huile
   ---------------------------------------------------------------------
   POURQUOI UN SECOND FABRICANT
   `fabriquer.mjs` lit les capsules (`refonte/capsules/*.js`, champ `lu`).
   Les stations sont d'une autre génération : leur contenu vit dans
   `modules/<station>/module.js` et n'a pas de champ `lu`. Le texte dit à
   voix haute est écrit à part, dans `voix/narrations/<station>.js` — pour
   qu'il se relise d'un bloc, et pour qu'une retouche de narration ne
   touche jamais au module lui-même.

   OÙ VONT LES MP3
   Dans la station : `modules/<station>/voix/<genre>/<ecran>.mp3`. Ainsi
   la copie d'une station vers le pack emporte sa voix, sans chemin à
   recoller.

   PRÉALABLE   python -m pip install edge-tts        (gratuit, aucune clé)
   USAGE       node voix/fabriquer-stations.mjs                tout ce qui manque
               node voix/fabriquer-stations.mjs --tout         refait tout
               node voix/fabriquer-stations.mjs <station>      une seule
               node voix/fabriquer-stations.mjs --controle     ne fabrique rien

   ⚠️ CE SCRIPT ENVOIE LE TEXTE DES NARRATIONS À MICROSOFT — c'est là que
   se fait la synthèse. Ce sont des textes de cours, mais la règle reste :
   on ne le lance qu'avec un feu vert. Rien ne part tant qu'il ne tourne pas.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ICI = dirname(fileURLToPath(import.meta.url));
const REFONTE = resolve(ICI, "..");
const MODULES = resolve(REFONTE, "modules");

/* Les deux voix retenues — les mêmes que pour les capsules, pour qu'une
   seule voix parle dans tout l'ensemble. */
const VOIX = {
  masculine: "fr-FR-HenriNeural",
  feminine: "fr-FR-DeniseNeural",
};

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const CONTROLE = args.includes("--controle");
const CIBLE = args.find((a) => !a.startsWith("--"));

/* --- 1. charger les narrations -------------------------------------- */
const NARRATIONS = {};
const dossierNarrations = resolve(ICI, "narrations");
if (!existsSync(dossierNarrations)) {
  console.error("Aucun dossier voix/narrations : rien à dire.");
  process.exit(1);
}
for (const f of readdirSync(dossierNarrations)) {
  if (!f.endsWith(".js")) continue;
  const code = readFileSync(join(dossierNarrations, f), "utf8");
  new Function("NARRATION", code)((id, textes) => { NARRATIONS[id] = textes; });
}

/* --- 2. relire chaque station et confronter -------------------------- */
function moduleDe(station) {
  const p = join(MODULES, station, "module.js");
  if (!existsSync(p)) return null;
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(p, "utf8"), ctx);
  return ctx.window.OIL_MODULE;
}

function ecransDe(station) {
  const m = moduleDe(station);
  return m ? m.lessons.map((l) => l.id) : null;
}

/* --- le texte pour l'oreille ----------------------------------------
   Un écrit se lit, un sigle s'épelle, un symbole se dit. Sans cette passe
   la synthèse prononce « co-deux » et « pé-un moins pé-deux ». Les règles
   sont celles de voix/narrations/LISEZ-MOI.md. */
const ORAL = [
  [/CO₂|CO2/g, "C O deux"],
  [/H₂O/g, "H deux O"],
  [/R-?744/g, "R sept cent quarante-quatre"],
  [/R-?407C/g, "R quatre cent sept C"],
  [/R-?404A/g, "R quatre cent quatre A"],
  [/R-?410A/g, "R quatre cent dix A"],
  [/R-?22\b/g, "R vingt-deux"],
  [/P\s*1\s*[−–-]\s*P\s*2/g, "P un moins P deux"],
  [/\bISO VG\b/g, "I S O V G"],
  [/\bOM3\b/g, "O M trois"],
  [/\bOM4\b/g, "O M quatre"],
  [/\bOM5\b/g, "O M cinq"],
  [/\bPOE\b/g, "P O E"],
  [/\bPAG\b/g, "P A G"],
  [/\bPVE\b/g, "P V E"],
  [/\bPAO\b/g, "P A O"],
  [/\bMO\b/g, "M O"],
  [/\bAB\b/g, "A B"],
  [/AC&R/g, "A C et R"],
  [/\bKV([PLR])\b/g, "K V $1"],
  [/\bBP\b/g, "B P"],
  [/\bHP\b/g, "H P"],
  [/°C/g, " degrés"],
  [/mm²\/s/g, "millimètres carrés par seconde"],
  [/m²\/s/g, "mètres carrés par seconde"],
  [/m³\/h/g, "mètres cubes par heure"],
  [/m³\/s/g, "mètres cubes par seconde"],
  [/mm²/g, "millimètres carrés"],
  [/mm³/g, "millimètres cubes"],
  [/\bm²/g, "mètres carrés"],
  [/\bm³/g, "mètres cubes"],
  [/π/g, "pi"],
  [/×/g, " fois "],
  [/÷/g, " divisé par "],
  [/([\d)])\s*\/\s*(\d)/g, "$1 divisé par $2"],
  /* barre isolée entre deux termes : dans ces textes, c'est toujours une fraction */
  [/\s\/\s*(\d)/g, " divisé par $1"],
  [/\b([A-Za-z])\s*=\s*/g, "$1 égale "],
  [/\bd²/g, "d au carré"],
  [/²/g, " au carré"],
  [/³/g, " au cube"],
  [/\bm\/s\b/g, "mètres par seconde"],
  [/≈/g, "environ "],
  [/Δp/g, "delta P"],
  [/\s*%/g, " pour cent"],
  [/\s+/g, " "],
];

function pourLOreille(texte) {
  let t = String(texte || "");
  for (const [motif, remplacement] of ORAL) t = t.replace(motif, remplacement);
  return t.trim();
}

/* Deux enregistrements par question : l'énoncé avec ses propositions, et
   l'explication. Jamais dans le même fichier — le premier est joué AVANT
   que l'élève réponde, il ne doit pas livrer la réponse. */
const LETTRES = ["A", "B", "C", "D", "E"];

function questionsDe(station) {
  const m = moduleDe(station);
  if (!m || !Array.isArray(m.quiz)) return [];
  const out = [];
  m.quiz.forEach((q, i) => {
    const n = i + 1;
    const props = q.options.map((o, k) => "Proposition " + LETTRES[k] + " : " + o + ".").join(" ");
    out.push({
      id: "q" + n,
      texte: pourLOreille("Question " + n + " sur " + m.quiz.length + ". " + q.prompt + " " + props),
    });
    const bonne = q.options[q.correct];
    out.push({
      id: "q" + n + "-reponse",
      texte: pourLOreille("La bonne réponse est la proposition " + LETTRES[q.correct] + " : " + bonne + ". " + (q.why || "")),
    });
  });
  return out;
}

const travail = [];
let muets = 0, orphelins = 0;

for (const [station, textes] of Object.entries(NARRATIONS)) {
  if (CIBLE && station !== CIBLE) continue;
  const ecrans = ecransDe(station);
  if (!ecrans) { console.error("station introuvable : " + station); continue; }

  /* Un écran sans texte reste muet — on le dit, on ne l'invente pas. */
  for (const id of ecrans) {
    const texte = (textes[id] || "").trim();
    if (!texte) { console.warn("  ⚠ " + station + "/" + id + " : aucune narration, écran muet"); muets++; continue; }
    travail.push({ station, id, texte });
  }
  /* Les questions n'ont pas de narration écrite à la main : leur texte se
     dérive de l'énoncé, des propositions et de l'explication du module. */
  for (const q of questionsDe(station)) travail.push({ station, id: q.id, texte: q.texte });

  /* Un texte qui ne correspond à aucun écran est une erreur : il ne sera
     jamais joué et signale presque toujours un écran renommé ou déplacé. */
  for (const id of Object.keys(textes)) {
    if (!ecrans.includes(id)) { console.error("  ✖ " + station + "/" + id + " : narration orpheline, aucun écran de ce nom"); orphelins++; }
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

/* --- 3. fabriquer ---------------------------------------------------- */
const tmp = resolve(ICI, "_texte-station.tmp.txt");
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
if (faits) console.log("Les MP3 sont dans modules/<station>/voix/<genre>/ — ils suivent la station à la copie.");
