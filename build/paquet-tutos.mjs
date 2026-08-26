// Paquet autonome des TUTOS SYMBOLES — refait d'une commande :
//   node build/paquet-tutos.mjs
//
// Produit : un dossier _paquets/TUTOS-SYMBOLES/ qui marche SEUL
// (les symboles du fonds y sont copiés, le chemin du moteur réécrit),
// puis un zip daté posé sur le Bureau.
//
// Le dossier _paquets/ est un PRODUIT, hors dépôt (.gitignore).
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(racine, "refonte", "tutos-symboles");
const fonds = join(racine, "fonds-origine", "packs", "fluides", "res", "symboles");
const cible = join(racine, "_paquets", "TUTOS-SYMBOLES");

rmSync(cible, { recursive: true, force: true });
mkdirSync(cible, { recursive: true });

// 1) le produit lui-même
cpSync(source, cible, { recursive: true });

// 2) les symboles du fonds, copiés DANS le paquet (autonomie)
cpSync(fonds, join(cible, "symboles-fonds"), { recursive: true });

// 3) les modules du geste professionnel (popup « Voir le geste »)
const MODULES = [
  "vanne-rotalock-pedagogique",
  "electrovanne-pedagogique",
  "bouteille-liquide-pedagogique",
  "vanne-de-service",
];
for (const m of MODULES) {
  cpSync(join(racine, "refonte", "modules", m), join(cible, "modules", m), { recursive: true });
}

// 4) le moteur pointe sur les copies locales, plus sur le dépôt
const moteur = join(cible, "moteur", "tuto.js");
const js = readFileSync(moteur, "utf8");
const reecrit = js
  .replace("'../../fonds-origine/packs/fluides/res/symboles/'", "'symboles-fonds/'")
  .replace("'../modules/'", "'modules/'");
if (reecrit === js) throw new Error("Chemins du fonds/modules introuvables dans moteur/tuto.js — paquet NON produit.");
writeFileSync(moteur, reecrit);

// 5) le serveur Node pur + son lanceur (au cas où file:// serait bridé)
mkdirSync(join(cible, "outils"), { recursive: true });
cpSync(join(racine, "outils", "servir.mjs"), join(cible, "outils", "servir.mjs"));
writeFileSync(join(cible, "LANCER.cmd"),
  '@echo off\r\n' +
  'REM Tutos symboles - double-cliquez sur ce fichier.\r\n' +
  'REM Essayez d\'abord index.html en double-clic direct : si les symboles\r\n' +
  'REM s\'affichent, ce lanceur est inutile.\r\n' +
  'setlocal\r\n' +
  'cd /d "%~dp0"\r\n' +
  'start "" http://localhost:4195/index.html\r\n' +
  'node outils\\servir.mjs 4195\r\n');

// 6) le zip daté, sur le Bureau
const jour = process.argv[2];
if (!jour) throw new Error("Donner la date en argument : node build/paquet-tutos.mjs 2026-08-14");
const zip = join(process.env.USERPROFILE, "OneDrive", "Bureau", `TUTOS-SYMBOLES-FICHES-METHODES-${jour}.zip`);
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${cible}\\*' -DestinationPath '${zip}' -Force"`);
console.log("Paquet :", cible);
console.log("Zip    :", zip);
