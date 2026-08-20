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
function ecransDe(station) {
  const p = join(MODULES, station, "module.js");
  if (!existsSync(p)) return null;
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(p, "utf8"), ctx);
  return ctx.window.OIL_MODULE.lessons.map((l) => l.id);
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
  /* Un texte qui ne correspond à aucun écran est une erreur : il ne sera
     jamais joué et signale presque toujours un écran renommé ou déplacé. */
  for (const id of Object.keys(textes)) {
    if (!ecrans.includes(id)) { console.error("  ✖ " + station + "/" + id + " : narration orpheline, aucun écran de ce nom"); orphelins++; }
  }
}

const mots = travail.reduce((s, t) => s + t.texte.split(/\s+/).length, 0);
console.log("\n" + travail.length + " écrans à dire · " + mots + " mots · " +
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
