/* =====================================================================
   fabriquer.mjs — fabrique la voix de toutes les capsules
   ---------------------------------------------------------------------
   POURQUOI FABRIQUER PLUTÔT QUE LAISSER LE NAVIGATEUR LIRE
   La seule voix française installée sur le poste est Hortense, une vieille
   voix SAPI. C'est elle qui plafonne la qualité aujourd'hui, et le résultat
   change d'un poste à l'autre. En fabriquant les MP3 une fois à l'atelier :
   même voix partout, qualité neuronale, lecture hors ligne, et la voix ne
   dépend plus du navigateur du stagiaire.

   CE QUE FAIT CE SCRIPT
   Il lit les fichiers de capsule (la seule source de vérité), en extrait le
   champ `lu` de CHAQUE écran — fil principal ET détours, à toute profondeur —
   et produit deux fichiers par écran : une voix masculine, une voix féminine.

     voix/masculine/<capsule>/<ecran>.mp3
     voix/feminine/<capsule>/<ecran>.mp3

   Puis il rappelle de passer `voixFabriquee: true` dans la capsule.

   PRÉALABLE   python -m pip install edge-tts        (gratuit, aucune clé)
   USAGE       node voix/fabriquer.mjs               tout ce qui manque
               node voix/fabriquer.mjs --tout        refait tout
               node voix/fabriquer.mjs lire-le-code  une capsule

   ⚠️ CE SCRIPT ENVOIE LE TEXTE DES NARRATIONS À MICROSOFT — c'est là que se
   fait la synthèse. Ce sont des textes de cours, déjà publics sur le dépôt
   pilote-fluides, mais la règle reste : on ne le lance qu'avec un feu vert.
   Rien n'est envoyé tant que le script n'est pas exécuté.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const REFONTE = resolve(ICI, "..");

/* Les deux voix retenues. À changer ici, et ici seulement : c'est ce qui
   garantit qu'une seule voix parle dans tout l'ensemble. */
const VOIX = {
  masculine: "fr-FR-HenriNeural",
  feminine: "fr-FR-DeniseNeural",
};

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const CIBLE = args.find((a) => !a.startsWith("--"));

/* ---------------------------------------------------------------------
   1. CHARGER LES CAPSULES — on exécute le fichier tel quel, avec un faux
   window : la capsule reste un simple fichier de données, sans duplication.
   --------------------------------------------------------------------- */
const CAPSULES = {};
global.CAPSULE = (c) => { CAPSULES[c.id] = c; };

const dossierCapsules = resolve(REFONTE, "capsules");
for (const f of readdirSync(dossierCapsules)) {
  if (!f.endsWith(".js") || f.startsWith("_")) continue;
  const code = readFileSync(join(dossierCapsules, f), "utf8");
  new Function("CAPSULE", code)(global.CAPSULE);
}

/* ---------------------------------------------------------------------
   2. RELEVER TOUS LES ÉCRANS — fil et détours, à toute profondeur
   --------------------------------------------------------------------- */
function ecransDe(capsule) {
  const liste = [];
  const ajouter = (e) => {
    const texte = (e.lu || "").trim();
    if (!texte) {
      console.warn(`  ⚠ ${capsule.id}/${e.id} : aucun texte « lu », écran muet`);
      return;
    }
    liste.push({ id: e.id, texte });
  };
  capsule.fil.forEach(ajouter);
  for (const d of Object.values(capsule.detours || {})) d.ecrans.forEach(ajouter);
  return liste;
}

/* ---------------------------------------------------------------------
   3. FABRIQUER
   --------------------------------------------------------------------- */
const tmp = resolve(ICI, "_texte.tmp.txt");
let faits = 0, sautes = 0, rates = 0;

for (const capsule of Object.values(CAPSULES)) {
  if (CIBLE && capsule.id !== CIBLE) continue;
  const ecrans = ecransDe(capsule);
  console.log(`\n${capsule.titre} — ${ecrans.length} écrans à dire`);

  for (const [genre, voix] of Object.entries(VOIX)) {
    const dossier = resolve(ICI, genre, capsule.id);
    mkdirSync(dossier, { recursive: true });

    for (const e of ecrans) {
      const sortie = join(dossier, e.id + ".mp3");
      if (!TOUT && existsSync(sortie)) { sautes++; continue; }
      writeFileSync(tmp, e.texte, "utf8");
      try {
        execFileSync("python", ["-m", "edge_tts", "--voice", voix,
          "--file", tmp, "--write-media", sortie], { stdio: "pipe" });
        faits++;
        process.stdout.write(`  ${genre[0].toUpperCase()}·${e.id} `);
      } catch (err) {
        rates++;
        console.error(`\n  ✖ ${genre}/${e.id} : ${String(err.message).split("\n")[0]}`);
      }
    }
  }
  console.log("");
}

if (existsSync(tmp)) rmSync(tmp);

console.log(`\n${faits} fichiers fabriqués · ${sautes} déjà là · ${rates} en échec`);
if (faits && !rates) {
  console.log("→ Pensez à passer `voixFabriquee: true` dans la ou les capsules concernées.");
}
