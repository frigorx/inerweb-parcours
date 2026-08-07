import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFile(path.join(root, name), "utf8");

test("la page reste autonome et charge seulement des ressources locales", async () => {
  const html = await read("index.html");
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)=["']https?:/i);
  assert.match(html, /assets\/mesh-kvl\.js/);
  assert.match(html, /app\.js/);
  assert.match(html, /lisibilite\.js/);
});

test("les trois fonctions et le réglage sont explicitement couverts", async () => {
  const app = await read("app.js");
  for (const term of ["pression d’évaporation", "pression de carter", "pression de condensation", "rotation horaire", "manomètre", "NRD"]) {
    assert.ok(app.includes(term), `terme manquant : ${term}`);
  }
  assert.match(app, /kvl:[\s\S]*highOpens: false/);
  assert.match(app, /kvp:[\s\S]*highOpens: true/);
  assert.match(app, /kvr:[\s\S]*highOpens: true/);
});

test("l’utilité des trois régulateurs est expliquée dès le premier écran", async () => {
  const app = await read("app.js");
  const firstScreen = app.slice(app.indexOf('short: "Utilité"'), app.indexOf('short: "Reconnaître"'));
  assert.match(firstScreen, /À quoi servent KVP, KVL et KVR/);
  assert.match(firstScreen, /maintient une pression d’évaporation suffisamment élevée/i);
  assert.match(firstScreen, /limite la pression d’aspiration admise par le compresseur/i);
  assert.match(firstScreen, /maintient une pression de condensation — la HP — suffisante et stable/i);
  assert.match(app, /Écran 6 · Cas d’usage/);
});

test("le maillage extérieur possède une géométrie cohérente", async () => {
  const source = await read("assets/mesh-kvl.js");
  const json = source.slice(source.indexOf("=") + 1, source.lastIndexOf(";"));
  const mesh = JSON.parse(json);
  assert.equal(mesh.source, "ID542975703082-0101.stp");
  assert.ok(mesh.triangles >= 5000);
  assert.equal(mesh.vertices.length, mesh.triangles * 9);
  assert.equal(mesh.normals.length, mesh.vertices.length);
});

test("la page contient huit écrans et les aides d’accessibilité", async () => {
  const app = await read("app.js");
  const html = await read("index.html");
  const shortCount = (app.match(/short:\s*"/g) || []).length;
  assert.equal(shortCount, 8);
  assert.match(html, /Aller à l’explication/);
  assert.match(html, /Lecture vocale/);
  assert.match(html, /Taille du texte/);
  assert.match(html, /Sources, simplifications et droits/);
});

test("les interactions propres au téléphone restent disponibles", async () => {
  const app = await read("app.js");
  const html = await read("index.html");
  const css = await read("styles.css");
  assert.match(html, /visual-focus-button/);
  assert.match(app, /installSwipeNavigation/);
  assert.match(app, /zoom-in-model/);
  assert.match(css, /body\.visual-focus/);
  assert.match(css, /max-height:\s*500px/);
});

test("la lecture privilégie une voix française naturelle et évite Hortense Desktop", async () => {
  const app = await read("app.js");
  assert.match(app, /natural\|naturel\|neural\|online\|premium\|enhanced/);
  assert.match(app, /\["denise", "henri", "julie", "paul", "hortense"\]/);
  assert.match(app, /desktop\|compact\|legacy/);
  assert.match(app, /screenSpeechSegments/);
  assert.match(app, /utterance\.pitch = 1/);
  assert.match(app, /document\.hidden/);
  assert.match(app, /Mettre la lecture en pause/);
  assert.match(app, /Reprendre la lecture/);
  assert.doesNotMatch(app, /voices\.find\(\(voice\) => \/\^fr-FR/);
});

test("le circuit emploie la chaîne liquide et les symboles validés", async () => {
  const app = await read("app.js");
  assert.match(app, /assets\/symboles\/\$\{name\}\.svg/);
  for (const symbol of ["bouteille_liquide", "vanne_isolement", "filtre_deshydrateur", "voyant_liquide", "electrovanne_frigo", "detendeur_thermo_int"]) {
    assert.ok(app.includes(`symbol(\"${symbol}\"`), `symbole manquant : ${symbol}`);
  }
  assert.match(app, /Vanne départ liquide/);
  assert.doesNotMatch(app, /regulateur_pression\.svg/);
  assert.match(app, /circuit-real-compressor/);
  assert.match(app, /symbol\("regulateur_pression_pc"/);
  assert.match(app, /regulateur_pression_pc", -34, -45, 68, 62/);
  assert.match(app, /M660 420H870V355H880/);
  assert.doesNotMatch(app, /Q840 420/);
});

test("le symbole KV fourni conserve le passage à 90 degrés et sa description", async () => {
  const symbol = await read("assets/symboles/regulateur_pression_kv.svg");
  assert.match(symbol, /Régulateur de pression KV/);
  assert.match(symbol, /passage à 90 degrés/);
  assert.match(symbol, /M 14\.28 -14 L 4\.09 -14 L 4\.09 -16/);
  assert.match(symbol, /<rect x="-3" y="1" width="7" height="7"/);
});

test("le symbole PC fourni conserve la vanne en ligne et sa membrane", async () => {
  const symbol = await read("assets/symboles/regulateur_pression_pc.svg");
  assert.match(symbol, /Régulateur de pression PC/);
  assert.match(symbol, /vanne est montée en ligne/);
  assert.match(symbol, />PC<\/text>/);
  assert.match(symbol, /<ellipse cx="0" cy="-12" rx="5\.83" ry="5\.83"/);
  assert.match(symbol, /M 2 1 L 0 3 L -2 1/);
});

test("les cartes montrent la silhouette et l’emplacement des trois régulateurs", async () => {
  const app = await read("app.js");
  assert.match(app, /kvSilhouetteSvg/);
  assert.match(app, /familyMiniDiagram/);
  assert.match(app, /SORTIE ÉVAPORATEUR/);
  assert.match(app, /AVANT COMPRESSEUR/);
  assert.match(app, /SORTIE CONDENSEUR/);
  assert.match(app, /mini-real-compressor/);
  assert.match(app, /family-flow-dot/);
  assert.match(app, /animateMotion/);
});

test("la coupe montre un passage traversant et des organes mobiles", async () => {
  const app = await read("app.js");
  const css = await read("styles.css");
  assert.match(app, /PASSAGE DU FLUIDE/);
  assert.match(app, /COUDE À 90°/);
  assert.match(app, /M310 354V306Q310 270 350 250H560/);
  assert.match(app, /ENTRÉE : SORTIE ÉVAPORATEUR/);
  assert.match(app, /ENTRÉE : LIGNE D’ASPIRATION/);
  assert.match(app, /ENTRÉE : SORTIE CONDENSEUR/);
  assert.match(app, /animateMotion/);
  assert.match(app, /updateKinematicVisual/);
  assert.match(css, /--spring-scale/);
  assert.doesNotMatch(css, /animation-duration:\s*\.001ms[^}]*animation-iteration-count:\s*1/);
});

test("la feuille d’impression ne force pas les aplats", async () => {
  const printCss = await read("impression.css");
  assert.match(printCss, /margin:\s*15mm/);
  assert.doesNotMatch(printCss, /print-color-adjust:\s*exact/);
});
