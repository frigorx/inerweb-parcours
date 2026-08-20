// outils/copier-ligne-vers-pack.mjs — recopie la rame « Le circuit d'huile » dans le pack
// public pilote-fluides, en recollant les deux liens sortants qui changent de profondeur.
//
// POURQUOI un outil : la copie n'est pas brute. Une station servie depuis le pack est quatre
// niveaux plus bas, et son logo ne doit plus renvoyer au parcours de l'atelier mais à la carte
// de la ligne. Fait à la main, cela se rate une fois sur deux et ne se voit qu'au clic.
//
// La voix féminine reste à l'atelier : le pack est déjà lourd et publié, et aucun bouton ne
// permet aujourd'hui de changer de voix — les 24 Mo seraient inatteignables.
//
// Lancer :  node outils/copier-ligne-vers-pack.mjs [--controle]

import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(ICI, "..", "refonte", "modules");
const PACK = resolve("C:/git/pilote-fluides/packs/fluides/res");
const ORDRE = resolve(ICI, "ordonner-ligne.js");
const CONTROLE = process.argv.includes("--controle");

// Une seule source pour la composition de la rame : la liste ordonnée.
const stations = [...readFileSync(ORDRE, "utf8").matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
if (!stations.length) throw new Error("aucune station lue dans ordonner-ligne.js");

// Les deux recollages. La cible du logo diffère selon qu'on sert une station ou la carte.
const RETOUR_STATION = '<a class="brand" href="../circuit-huile-interactif/index.html" aria-label="Retour à la carte du circuit d’huile">';
const RETOUR_CARTE = '<a class="brand" href="../../../../index.html#ligne=huile" aria-label="Retour au plan de formation">';

function recoller(html, cible) {
  let t = html.replace(/<a class="brand" href="[^"]*" aria-label="[^"]*">/, cible);
  t = t.replace(/"\.\.\/\.\.\/moteur\//g, '"../../../../moteur/');
  return t;
}

let ecrits = 0, inchanges = 0;
const journal = [];

function poser(destination, contenu) {
  if (existsSync(destination) && readFileSync(destination, "utf8") === contenu) { inchanges++; return false; }
  if (!CONTROLE) { mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, contenu, "utf8"); }
  ecrits++;
  return true;
}

function poserBinaire(source, destination) {
  if (existsSync(destination) && statSync(destination).size === statSync(source).size) { inchanges++; return false; }
  if (!CONTROLE) { mkdirSync(dirname(destination), { recursive: true }); copyFileSync(source, destination); }
  ecrits++;
  return true;
}

// Un dossier entier, sauf la voix féminine, avec recollage des index.html rencontrés.
function copierDossier(src, dst, cibleRetour, racine) {
  for (const entree of readdirSync(src, { withFileTypes: true })) {
    if (entree.name === "feminine") continue;          // la voix féminine reste à l'atelier
    const s = join(src, entree.name), d = join(dst, entree.name);
    if (entree.isDirectory()) { copierDossier(s, d, cibleRetour, false); continue; }
    if (entree.name.endsWith(".mp3")) { poserBinaire(s, d); continue; }
    let contenu = readFileSync(s, "utf8");
    // Seul l'index.html de la racine du module porte le lien du logo ; les index.html des
    // assets sont des lecteurs autonomes et ne doivent jamais être touchés.
    if (racine && entree.name === "index.html" && cibleRetour) contenu = recoller(contenu, cibleRetour);
    poser(d, contenu);
  }
}

const aCopier = [
  ...stations.map((id) => ({ id, retour: RETOUR_STATION })),
  { id: "circuit-huile-interactif", retour: RETOUR_CARTE },
  { id: "_circuit-huile-commun", retour: null },
];

for (const { id, retour } of aCopier) {
  const src = join(SOURCE, id);
  if (!existsSync(src)) { journal.push("ABSENT  " + id); continue; }
  const avant = ecrits;
  copierDossier(src, join(PACK, id), retour, true);
  journal.push((ecrits - avant ? String(ecrits - avant).padStart(3) + " maj" : "      =") + "  " + id);
}

console.log(journal.join("\n"));
console.log("\n" + (CONTROLE ? "--controle : rien n'a été écrit. " : "") +
  ecrits + " fichier(s) à jour · " + inchanges + " déjà identique(s) · " + stations.length + " stations");
