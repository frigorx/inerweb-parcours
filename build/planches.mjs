/* =====================================================================
   build/planches.mjs — relève les 44 planches animées du fonds et
   fabrique refonte/moteur/planches-data.js (id, titre, famille, poids).
   ---------------------------------------------------------------------
   CONTRAT : à relancer après tout ajout/retrait de planche dans
   fonds-origine/packs/fluides/res/svg/. Le titre vient du <title> du
   SVG lui-même ; la famille vient de la table FAMILLES ci-dessous —
   une planche absente de la table part en « repères » et le script
   le signale, pour qu'on la range explicitement.
   Usage : node build/planches.mjs
   ===================================================================== */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG = join(RACINE, "fonds-origine", "packs", "fluides", "res", "svg");
const SVG_REFONTE = join(RACINE, "refonte", "planches");
const SORTIE = join(RACINE, "refonte", "moteur", "planches-data.js");

/* Une planche, une famille. L'ordre des familles est celui des paliers. */
const FAMILLES = {
  "physique": ["chaleur-sensible-latente", "pression-absolue-relative",
    "surchauffe-utile-totale", "mesure-surchauffe", "diagramme-logph"],
  "fluides et classes": ["nomenclature", "familles-fluides", "classes-securite",
    "prp-echelle", "lie-domaine", "charge-limite-local", "aptitude-capacite"],
  "organes et circuit": ["croix-frigoriste", "compresseurs", "detendeurs-ligne",
    "detendeur-regulation", "echangeur-air", "circuit-complet-manifold",
    "regulateurs-pression", "givre-degivrage"],
  "gestes": ["prepa-chantier", "manifold-lecture", "lecture-table", "ordre-vannes",
    "tirage-au-vide", "recuperation", "balayage-azote", "balayage-detecteur",
    "epreuve-azote", "pesee-charge", "points-de-fuite"],
  "sécurité": ["intro-securite", "s1-double-accident", "secu-espace-clos",
    "secu-consignation", "secu-flamme", "secu-projection", "secu-decomposition-ari",
    "secu-bouteille", "co2-protection", "co2-point-bas", "co2-nh3-compare"],
  "repères": ["frise-histoire", "motif-flocon"],
};

/* Les planches dessinées POUR les capsules (refonte/planches/), rangées
   dans les mêmes familles que celles du fonds. */
const FAMILLES_REFONTE = {
  "physique": ["cloche-a-vide", "courbe-saturation-eau", "saturation-deux-sens",
    "levier-pressions", "palier-vs-glissement", "equilibre-pression-vapeur",
    "bulle-rosee", "deux-casseroles", "pente-chaleur-sensible",
    "palier-chaleur-latente", "frigo-domestique", "trois-grandeurs", "bilan-energie"],
  "fluides et classes": ["interdits-cfc-hcfc", "hfc-ozone-climat",
    "autorises-hfo-naturels", "prp-regle-serre", "teqco2-calcul"],
  "gestes": ["trois-bouteilles", "bouteille-deux-robinets", "plaque-bouteille"],
  "sécurité": ["soupape-dernier-recours"],
};
const familleDe = {};
for (const [f, ids] of Object.entries(FAMILLES)) for (const id of ids) familleDe[id] = f;
for (const [f, ids] of Object.entries(FAMILLES_REFONTE)) for (const id of ids) familleDe[id] = f;

function releverDossier(dossier, prefixe) {
  return readdirSync(dossier).filter((f) => f.endsWith(".svg")).sort().map((fichier) => {
    const id = fichier.replace(/\.svg$/, "");
    const svg = readFileSync(join(dossier, fichier), "utf8");
    const titre = ((svg.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || id).trim();
    if (!familleDe[id]) console.warn(`⚠ planche hors table, rangée en « repères » : ${id}`);
    return {
      id,
      titre,
      famille: familleDe[id] || "repères",
      chemin: `${prefixe}${fichier}`,
      ko: Math.round(statSync(join(dossier, fichier)).size / 1024),
    };
  });
}
const planches = [
  ...releverDossier(SVG, "../fonds-origine/packs/fluides/res/svg/"),
  ...releverDossier(SVG_REFONTE, "planches/"),
];

const ordreFamilles = Object.keys(FAMILLES);
planches.sort((a, b) =>
  ordreFamilles.indexOf(a.famille) - ordreFamilles.indexOf(b.famille)
  || a.titre.localeCompare(b.titre, "fr"));

writeFileSync(SORTIE,
  `/* Généré par build/planches.mjs — NE PAS ÉDITER À LA MAIN.
   ${planches.length} planches, familles : ${ordreFamilles.join(" · ")}. */
window.PLANCHES = ${JSON.stringify(planches, null, 1)};
window.PLANCHES_FAMILLES = ${JSON.stringify(ordreFamilles)};
`, "utf8");
console.log(`✔ ${planches.length} planches → refonte/moteur/planches-data.js`);
