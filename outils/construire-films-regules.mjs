/* =====================================================================
   construire-films-regules.mjs — les films « Les régules » hors ligne
   ---------------------------------------------------------------------
   POURQUOI
   Les films livrés par l'atelier Claude Design sont des pages `.dc.html`
   qui chargent React, ReactDOM et Babel depuis `unpkg.com`. Une station
   inerWeb doit fonctionner sans réseau : le paquet reste donc une source
   d'atelier, et ce script en tire une page autonome par film.

   COMMENT, SANS RIEN RÉÉCRIRE
   Le moteur `support.js` prévoit deux points d'entrée hors ligne :
     · `window.__resources[url]`      remplace une adresse de CDN ;
     · `window.__resourceBlobs[url]`  fournit une source déjà en mémoire,
                                      ce qui supprime tout `fetch`.
   Et il ne demande Babel que pour un fichier `.jsx`. On transpile donc le
   JSX en JS à la construction : plus de Babel, plus de réseau, et la page
   s'ouvre par un double-clic — y compris en `file://`.

   USAGE   node outils/construire-films-regules.mjs           tous les films
           node outils/construire-films-regules.mjs 08        un seul
   SORTIE  refonte/modules/_regules-commun/films/<nom>.html
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const SOURCES = resolve(RACINE, "refonte/modules/_regules-commun/assets/claude-regules");
const SORTIE = resolve(RACINE, "refonte/modules/_regules-commun/films");

/* React est déjà dans l'écosystème : on ne télécharge rien. */
const VENDOR = resolve(RACINE, "../pilote-fluides/moteur/vendor");
const REACT = {
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js": join(VENDOR, "react.production.min.js"),
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": join(VENDOR, "react-dom.production.min.js"),
};

/* esbuild n'est pas une dépendance de ce dépôt : on le cherche là où il est
   déjà installé, et on le dit franchement s'il manque. */
function trouverEsbuild() {
  /* On vise l'exécutable, pas le script `.cmd` : Node refuse de lancer un `.cmd`
     sans passer par un interpréteur (EINVAL). */
  const pistes = [
    resolve(RACINE, "node_modules/@esbuild/win32-x64/esbuild.exe"),
    resolve(RACINE, "../inerweb-immo/node_modules/@esbuild/win32-x64/esbuild.exe"),
    resolve(RACINE, "../regulfroid-simulateur/node_modules/@esbuild/win32-x64/esbuild.exe"),
  ];
  const trouve = pistes.find((p) => existsSync(p));
  if (!trouve) {
    console.error("esbuild introuvable. Cherché dans :");
    pistes.forEach((p) => console.error("  " + p));
    process.exit(1);
  }
  return trouve;
}
const ESBUILD = trouverEsbuild();

function transpiler(chemin) {
  return execFileSync(ESBUILD, [chemin, "--loader:.jsx=jsx", "--format=iife"], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

/* Un bloc <script type="text/plain"> ne doit jamais contenir la séquence de
   fermeture, sans quoi le navigateur coupe la page en deux. */
const proteger = (s) => s.replace(/<\/script/gi, "<\\/script");

/* --- la voix ---------------------------------------------------------
   Les MP3 sont fabriqués par `fabriquer-voix-films.mjs`. On embarque la
   voix masculine, comme le pack du circuit d'huile : une seule voix parle
   dans tout l'ensemble. Pas d'autoplay — la lecture part au clic. */
const VOIX_DIR = resolve(RACINE, "refonte/modules/_regules-commun/voix-films");

function voixDe(fichierDc, html) {
  const m = /^Regules\s+(\w+)/i.exec(fichierDc);
  const id = m ? "regules-" + m[1].toLowerCase() : null;
  const dossier = id ? join(VOIX_DIR, id, "masculine") : null;
  if (!dossier || !existsSync(dossier)) return null;

  const scenes = JSON.parse(/window\.OM_SCENES\s*=\s*'([^']*)'/.exec(html)[1]);
  let debut = 0;
  const pistes = [];
  for (const s of scenes) {
    const mp3 = join(dossier, s.name + ".mp3");
    if (existsSync(mp3)) {
      pistes.push({
        nom: s.name,
        debut: debut,
        fin: debut + s.dur,
        son: readFileSync(mp3).toString("base64"),
      });
    }
    debut += s.dur;
  }
  return pistes.length ? pistes : null;
}

/* Le lecteur : une phrase par scène, et le film s'arrête à la fin de la
   scène tant que la phrase n'est pas dite. C'est ce qui évite d'allonger
   les scènes — et donc de décaler tous les repères calés en temps absolu. */
function lecteurVoix(pistes) {
  return [
    '<script>',
    '(function () {',
    '  var PISTES = ' + JSON.stringify(pistes.map((p) => ({ nom: p.nom, debut: p.debut, fin: p.fin }))) + ';',
    '  var sons = {};',
    '  PISTES.forEach(function (p, i) {',
    '    var a = new Audio("data:audio/mpeg;base64," + document.getElementById("voix" + i).textContent.trim());',
    '    a.preload = "auto";',
    '    sons[p.nom] = a;',
    '  });',
    '  var courante = null, enAttente = null;',
    '  var bouton = document.createElement("button");',
    '  bouton.textContent = "Écouter les explications";',
    '  bouton.setAttribute("style", "position:fixed;left:18px;bottom:18px;z-index:9999;' +
    'font:700 16px system-ui,sans-serif;color:#fffdf8;background:#c9451a;border:none;' +
    'border-radius:10px;padding:12px 18px;cursor:pointer");',
    '  document.body.appendChild(bouton);',
    '  var actif = false;',
    '  bouton.onclick = function () {',
    '    actif = !actif;',
    '    bouton.textContent = actif ? "Couper la voix" : "Écouter les explications";',
    '    if (!actif) { if (courante) { courante.pause(); courante.currentTime = 0; } enAttente = null;',
    '      if (window.__filmCtl) window.__filmCtl.lecture(); }',
    '    else if (window.__filmCtl) { window.__filmCtl.allerA(0); window.__filmCtl.lecture(); }',
    '  };',
    '  setInterval(function () {',
    '    if (!actif || !window.__filmCtl) return;',
    '    var t = window.__filmCtl.temps();',
    '    var p = PISTES.filter(function (x) { return t >= x.debut && t < x.fin; })[0];',
    '    if (p && sons[p.nom] !== courante) {',
    '      if (courante) { courante.pause(); courante.currentTime = 0; }',
    '      courante = sons[p.nom];',
    '      enAttente = p;',
    '      courante.play().catch(function () {});',
    '    }',
    '    /* fin de scène : on retient le film tant que la phrase court */',
    '    if (enAttente && t >= enAttente.fin - 0.15 && courante && !courante.ended) {',
    '      if (window.__filmCtl.enLecture()) window.__filmCtl.pause();',
    '    } else if (enAttente && courante && courante.ended) {',
    '      enAttente = null;',
    '      if (!window.__filmCtl.enLecture()) window.__filmCtl.lecture();',
    '    }',
    '  }, 120);',
    '})();',
    '</script>',
  ].join("\n");
}

/* La barre de lecture (22/08, retour F. Henninot : « ça ne se lance pas en
   intégralité ») : le film jouait UNE fois puis restait figé sur sa fin, sans
   aucune commande visible. Lecture/pause et progression passent par
   window.__filmCtl ; « Rejouer » recharge la page — le seul geste fiable une
   fois le mode « une seule fois » épuisé. */
function barreLecture() {
  return [
    '<script>',
    '(function () {',
    '  var barre = document.createElement("div");',
    '  barre.setAttribute("style", "position:fixed;top:14px;right:14px;z-index:9998;display:flex;align-items:center;gap:10px;background:rgba(255,253,248,0.95);border:2px solid #1b3a63;border-radius:12px;padding:8px 14px;font:700 15px system-ui,sans-serif;color:#1b3a63");',
    '  var rejouer = document.createElement("button");',
    '  rejouer.textContent = "⟲ Rejouer";',
    '  rejouer.setAttribute("style", "border:none;background:#1b3a63;color:#fffdf8;border-radius:8px;padding:6px 10px;cursor:pointer;font:700 14px system-ui,sans-serif");',
    '  rejouer.onclick = function () { location.reload(); };',
    '  var pl = document.createElement("button");',
    '  pl.textContent = "⏸";',
    '  pl.setAttribute("style", "border:none;background:#c9451a;color:#fffdf8;border-radius:8px;padding:6px 12px;cursor:pointer;font:700 14px system-ui,sans-serif");',
    '  pl.onclick = function () { if (!window.__filmCtl) return; if (window.__filmCtl.enLecture()) window.__filmCtl.pause(); else window.__filmCtl.lecture(); };',
    '  var piste = document.createElement("div");',
    '  piste.setAttribute("style", "width:150px;height:8px;background:#c9d2dc;border-radius:4px;overflow:hidden");',
    '  var rempli = document.createElement("div");',
    '  rempli.setAttribute("style", "width:0%;height:100%;background:#ff6b35");',
    '  piste.appendChild(rempli);',
    '  var lbl = document.createElement("span");',
    '  lbl.textContent = "0:00";',
    '  barre.appendChild(rejouer); barre.appendChild(pl); barre.appendChild(piste); barre.appendChild(lbl);',
    '  document.body.appendChild(barre);',
    '  function mmss(v) { return Math.floor(v / 60) + ":" + ("0" + Math.floor(v % 60)).slice(-2); }',
    '  setInterval(function () {',
    '    if (!window.__filmCtl) return;',
    '    var t = window.__filmCtl.temps(), d = window.__filmCtl.duree || 1;',
    '    rempli.style.width = Math.min(100, t / d * 100) + "%";',
    '    lbl.textContent = mmss(t) + " / " + mmss(d);',
    '    pl.textContent = window.__filmCtl.enLecture() ? "⏸" : "▶";',
    '  }, 300);',
    '})();',
    '</script>',
  ].join("\n");
}

function construire(fichierDc) {
  const html = readFileSync(join(SOURCES, fichierDc), "utf8");

  const from = /from="([^"]+)"/.exec(html);
  if (!from) throw new Error(fichierDc + " : aucun attribut from");
  const modules = from[1].trim().split(/\s+/);

  /* 1 · les sources du film, transpilées une fois pour toutes */
  const sources = modules.map((rel) => {
    const nomJs = rel.replace(/\.jsx$/i, ".js");
    return { cle: nomJs, code: transpiler(join(SOURCES, rel.replace(/^\.\//, ""))) };
  });

  /* 2 · la police, en clair dans la page */
  const police = readFileSync(join(SOURCES, "assets/Lexend-variable.woff2")).toString("base64");

  /* 3 · le corps du film : on pointe les sources transpilées */
  let corps = /<x-dc>[\s\S]*<\/x-dc>/.exec(html)[0];
  corps = corps.replace(from[0], 'from="' + modules.map((m) => m.replace(/\.jsx$/i, ".js")).join(" ") + '"');
  corps = corps.replace(
    /url\('assets\/Lexend-variable\.woff2'\)/g,
    "url('data:font/woff2;base64," + police + "')"
  );

  const blocs = sources
    .map((s, i) => '<script type="text/plain" id="src' + i + '">' + proteger(s.code) + "</script>")
    .join("\n");

  const reactBlocs = Object.entries(REACT)
    .map(([url, chemin], i) =>
      '<script type="text/plain" id="vendor' + i + '" data-url="' + url + '">' +
      proteger(readFileSync(chemin, "utf8")) + "</script>")
    .join("\n");

  const amorce = [
    "<script>",
    "(function () {",
    "  var blob = function (id) {",
    "    return new Blob([document.getElementById(id).textContent], { type: 'text/javascript' });",
    "  };",
    "  window.__resourceBlobs = window.__resourceBlobs || {};",
    sources.map((s, i) => "  window.__resourceBlobs[" + JSON.stringify(s.cle) + "] = blob('src" + i + "');").join("\n"),
    "  window.__resources = window.__resources || {};",
    Object.keys(REACT).map((url, i) =>
      "  window.__resources[" + JSON.stringify(url) + "] = URL.createObjectURL(blob('vendor" + i + "'));").join("\n"),
    "})();",
    "</script>",
  ].join("\n");

  const support = readFileSync(join(SOURCES, "support.js"), "utf8");
  const titre = basename(fichierDc, ".dc.html");

  /* 3 bis · la voix, si elle a été fabriquée pour ce film */
  const voix = voixDe(fichierDc, html);

  const page = [
    "<!DOCTYPE html>",
    '<html lang="fr">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="robots" content="noindex, nofollow">',
    "<title>" + titre + " — inerWeb</title>",
    "</head>",
    "<body>",
    reactBlocs,
    blocs,
    amorce,
    "<script>" + support + "</script>",
    corps,
    voix ? voix.map((p, i) => '<script type="text/plain" id="voix' + i + '">' + p.son + "</script>").join("\n") : "",
    voix ? lecteurVoix(voix) : "",
    barreLecture(),
    "</body>",
    "</html>",
  ].join("\n");

  mkdirSync(SORTIE, { recursive: true });
  const cible = join(SORTIE, titre.replace(/\s+/g, "-").toLowerCase() + ".html");
  writeFileSync(cible, page, "utf8");

  /* 4 · contrôle : une page autonome ne garde aucune adresse distante active */
  const restes = [...page.matchAll(/(?:src|href)="(https?:)?\/\/[^"]+"/g)].map((m) => m[0]);
  return { cible, taille: Math.round(page.length / 1024), restes };
}

const filtre = process.argv[2];
const films = readdirSync(SOURCES)
  .filter((f) => f.endsWith(".dc.html"))
  .filter((f) => !filtre || f.toLowerCase().includes(filtre.toLowerCase()));

if (!films.length) {
  console.error("Aucun film à construire" + (filtre ? " pour « " + filtre + " »" : "") + ".");
  process.exit(1);
}

console.log("CONSTRUCTION DES FILMS AUTONOMES");
console.log();
let faute = 0;
for (const f of films) {
  const r = construire(f);
  const etat = r.restes.length ? "ADRESSE DISTANTE : " + r.restes.join(", ") : "hors ligne";
  if (r.restes.length) faute++;
  console.log("  %s  %s Ko  %s", basename(r.cible).padEnd(46), String(r.taille).padStart(4), etat);
}
console.log();
console.log(faute ? faute + " film(s) gardent une adresse distante." : "Tous les films sont autonomes.");
process.exit(faute ? 1 : 0);
