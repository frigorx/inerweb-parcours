/* =====================================================================
   page-capsule.mjs — la capsule pilote en UN SEUL fichier
   ---------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE
   Même raison que page-ecoute.mjs : une page qui dépend de fichiers
   voisins n'est pas testable simplement. Il faut trouver le bon dossier,
   ne rien déplacer, et parfois passer par un serveur local.

   Ce script assemble TOUT dans un seul .html : la charte, le moteur, la
   capsule, les planches animées (en data URI) et la police DYS. On
   double-clique, ça marche. On peut le copier sur une clé ou l'envoyer
   par courriel : il marchera encore.

   Ce n'est PAS la forme de production — en production, un moteur partagé
   et des capsules séparées valent bien mieux qu'un fichier par sujet.
   C'est une forme de RELECTURE, pour juger le modèle sans rien installer.

   USAGE   node build/page-capsule.mjs
   ===================================================================== */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (p) => readFileSync(resolve(RACINE, p), "utf8");
const b64 = (p) => readFileSync(resolve(RACINE, p)).toString("base64");

/* PIÈGE : du JavaScript mis EN LIGNE dans un <script> ne doit contenir
   nulle part la suite « </script> » — même dans un commentaire. Le
   navigateur ferme le bloc à cet endroit et interprète tout le reste du
   fichier comme du HTML. C'est ce qui déversait le panneau du bouton « Aa »
   au milieu de la page : lisibilite.js montre en commentaire la ligne
   <script src="...lisibilite.js"></script>. On neutralise la barre oblique :
   pour JavaScript, "<\\/script>" vaut exactement "</script>". */
const enLigne = (code) => code.replace(/<\/(script)/gi, "<\\/$1");

/* ---- 1. Les planches animées deviennent des data URI ---------------- */
const PLANCHES = ["nomenclature.svg", "familles-fluides.svg"];
let capsule = lire("refonte/capsules/lire-le-code.js");
for (const p of PLANCHES) {
  const chemin = "fonds-origine/packs/fluides/res/svg/" + p;
  const uri = "data:image/svg+xml;base64," + b64(chemin);
  capsule = capsule.split("../" + chemin).join(uri);
}

/* ---- 2. La police DYS entre dans la page ---------------------------
   lisibilite.js déduit normalement le chemin de la police du src de son
   propre <script>. En ligne dans la page, ce src est vide : on remplace
   donc l'URL par la police elle-même. */
let lisibilite = lire("fonds-origine/moteur/lisibilite.js");
const police = "data:font/woff2;base64," + b64("fonds-origine/moteur/polices/Lexend-variable.woff2");
lisibilite = lisibilite.replace(
  `url('" + racine + "polices/Lexend-variable.woff2')`,
  `url('${police}')`
);
if (!lisibilite.includes(police)) {
  console.warn("⚠ la police n'a pas pu être intégrée — le bouton Aa gardera la police du système");
}

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lire le code d'un fluide — capsule à relire</title>

<style>
${lire("fonds-origine/moteur/charte-edu.css")}
${lire("refonte/moteur/capsule.css")}

/* Le bandeau de relecture : il n'existe QUE dans cette version-ci, pour
   dire au relecteur ce qu'il regarde et ce qu'on attend de lui. */
.bandeau-relecture{background:#fff3cd;border-bottom:3px solid var(--orange);
  padding:12px 20px;font-size:15px;color:#7a4a00}
.bandeau-relecture b{color:#a8410f}
.bandeau-relecture p{margin:0;max-width:90ch}
</style>

<body>

<div class="bandeau-relecture">
  <p><b>Version de relecture, tout est dans ce seul fichier.</b>
  Le fil principal fait <b>6 écrans</b>. À chaque notion voisine, un encadré violet
  <b>« Voulez-vous en savoir plus ? »</b> ouvre un détour et vous ramène ensuite exactement
  ici. Il y a <b>7 détours</b>, dont un qui a lui-même son propre détour (écran 6 →
  « les séries 400 et 500 » → « le glissement »).
  La barre d'avancement ne recule jamais quand vous êtes curieux.
  <b>La voix ne part pas toute seule</b> : cliquez sur « 🔊 Écouter ». Elle sera de mauvaise
  qualité ici — c'est la voix du navigateur, celle qu'on veut justement remplacer.</p>
</div>

<script>
${enLigne(lire("refonte/moteur/capsule.js"))}
</script>

<script>
${enLigne(capsule)}
</script>

<script>
${enLigne(lisibilite)}
</script>

<script>jouerCapsule("");</script>
`;

const sorties = [
  resolve(RACINE, "TESTER-LA-CAPSULE.html"),
  "C:/Users/henni/Desktop/TESTER-LA-CAPSULE.html",
  "C:/Users/henni/OneDrive/Bureau/TESTER-LA-CAPSULE.html",
];
for (const s of sorties) {
  try { writeFileSync(s, html, "utf8"); console.log("écrit : " + s); }
  catch (e) { console.warn("non écrit : " + s + " (" + e.code + ")"); }
}
console.log(`${Math.round(html.length / 1024)} Ko — ${PLANCHES.length} planches et la police incluses`);
