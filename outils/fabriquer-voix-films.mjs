/* =====================================================================
   fabriquer-voix-films.mjs — la voix des films « Les régules »
   ---------------------------------------------------------------------
   POURQUOI UN TROISIÈME FABRICANT
   `fabriquer.mjs` lit les capsules, `fabriquer-stations.mjs` lit les
   modules. Un film n'est ni l'un ni l'autre : son unité n'est pas l'écran
   mais la **scène**, et la liste des scènes vit dans le `.dc.html`
   (`window.OM_SCENES`). Le texte dit à voix haute est écrit à part, dans
   `voix/narrations-films/<film>.js`, pour qu'une retouche de narration ne
   touche jamais au film.

   CE QU'IL FAIT EN PLUS
   Il mesure la durée réelle de chaque MP3 et la compare à la durée de la
   scène. Une scène plus courte que sa phrase coupe la voix : le contrôle
   le dit, scène par scène, avec la durée à écrire.

   PRÉALABLE   python -m pip install edge-tts        (gratuit, aucune clé)
   USAGE       node outils/fabriquer-voix-films.mjs             ce qui manque
               node outils/fabriquer-voix-films.mjs --tout      refait tout
               node outils/fabriquer-voix-films.mjs --controle  ne fabrique rien
               node outils/fabriquer-voix-films.mjs 08          un seul film

   ⚠️ CE SCRIPT ENVOIE LE TEXTE DES NARRATIONS À MICROSOFT — c'est là que
   se fait la synthèse. Ce sont des textes de cours, mais la règle reste :
   on ne le lance qu'avec un feu vert.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const FILMS = resolve(RACINE, "refonte/modules/_regules-commun/assets/claude-regules");
const NARRATIONS_DIR = resolve(RACINE, "refonte/voix/narrations-films");
const SORTIE = resolve(RACINE, "refonte/modules/_regules-commun/voix-films");

/* Les mêmes deux voix que les capsules et les stations : une seule voix
   parle dans tout l'ensemble. */
const VOIX = { masculine: "fr-FR-HenriNeural", feminine: "fr-FR-DeniseNeural" };

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const CONTROLE = args.includes("--controle");
const CIBLE = args.find((a) => !a.startsWith("--"));

/* --- 1. les narrations ---------------------------------------------- */
const NARRATIONS = {};
if (!existsSync(NARRATIONS_DIR)) {
  console.error("Aucun dossier voix/narrations-films : rien à dire.");
  process.exit(1);
}
for (const f of readdirSync(NARRATIONS_DIR)) {
  if (!f.endsWith(".js")) continue;
  const code = readFileSync(join(NARRATIONS_DIR, f), "utf8");
  new Function("NARRATION_FILM", code)((id, textes) => { NARRATIONS[id] = textes; });
}

/* --- 2. les scènes de chaque film ------------------------------------ */
function scenesDe(fichierDc) {
  const html = readFileSync(join(FILMS, fichierDc), "utf8");
  const m = /window\.OM_SCENES\s*=\s*'([^']*)'/.exec(html);
  return m ? JSON.parse(m[1]) : null;
}

/* le film `Regules 08 …` porte les narrations de `regules-08` */
function idDe(fichierDc) {
  const m = /^Regules\s+(\w+)/i.exec(fichierDc);
  return m ? "regules-" + m[1].toLowerCase() : null;
}

/* --- 3. le texte pour l'oreille --------------------------------------
   Un sigle s'épelle, un symbole se dit. Sans cette passe la synthèse
   prononce « kem-un » et « hp ». Règles : voix/narrations/LISEZ-MOI.md. */
const ORAL = [
  [/\bKM\s*1\b/g, "K M un"],
  [/\bKM\s*2\b/g, "K M deux"],
  [/\bKA\s*1\b/g, "K A un"],
  [/\bRFD\b/g, "R F D"],
  [/\bRD\b/g, "R D"],
  [/\bB\s*2\b/g, "B deux"],
  [/\bKT\b/g, "K T"],
  [/\bQ\s*1\b/g, "Q un"],
  [/\bY\s*1\b/g, "Y un"],
  [/\bB\s*1\b/g, "B un"],
  [/\bS\s*1\b/g, "S un"],
  [/\bBP\b/g, "B P"],
  [/\bHP\b/g, "H P"],
  [/°C/g, " degrés"],
  [/\s*%/g, " pour cent"],
  [/\s+/g, " "],
];
const pourLOreille = (t) => ORAL.reduce((s, [m, r]) => s.replace(m, r), String(t || "")).trim();

/* --- 4. durée réelle d'un MP3 ----------------------------------------
   Les MP3 d'edge-tts sont à débit constant : la première trame donne le
   débit, la taille donne la durée. Pas besoin de ffprobe. */
function dureeMp3(chemin) {
  const data = readFileSync(chemin);
  const BR_V2L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const BR_V1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  let i = 0;
  if (data.slice(0, 3).toString() === "ID3") {
    let taille = 0;
    for (let k = 6; k < 10; k++) taille = (taille << 7) | (data[k] & 0x7f);
    i = 10 + taille;
  }
  for (; i < data.length - 4; i++) {
    if (data[i] === 0xff && (data[i + 1] & 0xe0) === 0xe0) {
      const version = (data[i + 1] >> 3) & 0x03;
      const br = (version === 3 ? BR_V1L3 : BR_V2L3)[(data[i + 2] >> 4) & 0x0f];
      if (br) return (statSync(chemin).size * 8) / (br * 1000);
    }
  }
  return null;
}

/* --- 5. fabrication --------------------------------------------------- */
const fichiers = readdirSync(FILMS)
  .filter((f) => f.endsWith(".dc.html"))
  .filter((f) => !CIBLE || f.toLowerCase().includes(CIBLE.toLowerCase()));

let faits = 0, sautes = 0, rates = 0, orphelines = 0;
const aRecaler = [];

for (const fichier of fichiers) {
  const id = idDe(fichier);
  const textes = NARRATIONS[id];
  if (!textes) { console.log("  " + fichier + " : aucune narration écrite, passé."); continue; }

  const scenes = scenesDe(fichier);
  if (!scenes) { console.error("  " + fichier + " : scènes illisibles."); rates++; continue; }

  /* Une narration orpheline signale un renommage de scène : on refuse de
     travailler plutôt que de fabriquer un fichier que personne ne joue. */
  const noms = scenes.map((s) => s.name);
  for (const cle of Object.keys(textes)) {
    if (!noms.includes(cle)) {
      console.error("  ✖ " + id + " : la narration « " + cle + " » ne correspond à aucune scène.");
      orphelines++;
    }
  }

  console.log("\n" + fichier);
  for (const scene of scenes) {
    const texte = textes[scene.name];
    if (!texte) { console.log("  · " + scene.name.padEnd(14) + " (muette)"); continue; }

    for (const [genre, voix] of Object.entries(VOIX)) {
      const dossier = join(SORTIE, id, genre);
      mkdirSync(dossier, { recursive: true });
      const sortie = join(dossier, scene.name + ".mp3");

      if (existsSync(sortie) && !TOUT) { sautes++; }
      else if (!CONTROLE) {
        const tmp = join(dossier, "_texte.tmp.txt");
        writeFileSync(tmp, pourLOreille(texte), "utf8");
        try {
          execFileSync("python", ["-m", "edge_tts", "--voice", voix, "--file", tmp, "--write-media", sortie], { stdio: "pipe" });
          faits++;
        } catch (err) {
          rates++;
          console.error("  ✖ " + genre + "/" + scene.name + " : " + String(err.message).split("\n")[0]);
        }
      }

      /* la mesure ne vaut que sur la voix de référence */
      if (genre === "masculine" && existsSync(sortie)) {
        const d = dureeMp3(sortie);
        if (d) {
          const vise = Math.ceil(d + 1);            // une seconde de respiration
          const etat = vise > scene.dur ? "À ALLONGER → " + vise + " s" : "tient";
          console.log("  · " + scene.name.padEnd(14) + d.toFixed(1) + " s de voix / " + scene.dur + " s de scène   " + etat);
          if (vise > scene.dur) aRecaler.push({ film: fichier, scene: scene.name, de: scene.dur, vers: vise });
        }
      }
    }
  }
}

console.log("\nfabriqués : " + faits + " · déjà là : " + sautes + " · ratés : " + rates + " · narrations orphelines : " + orphelines);
if (aRecaler.length) {
  const total = aRecaler.reduce((s, r) => s + (r.vers - r.de), 0);
  console.log("\n" + aRecaler.length + " scène(s) trop courtes pour leur phrase, " + total + " s à ajouter au total :");
  for (const r of aRecaler) console.log("  " + r.film.slice(0, 34).padEnd(34) + r.scene.padEnd(14) + r.de + " s → " + r.vers + " s");
  console.log("\nÀ reporter dans `window.OM_SCENES` du .dc.html, puis relancer construire-films-regules.mjs.");
}
process.exit(rates || orphelines ? 1 : 0);
