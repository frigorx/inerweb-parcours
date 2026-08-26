// Bon à tirer MONOFICHIER des tutos symboles — refait d'une commande :
//   node build/bon-a-tirer.mjs methode-01-pose-manos methode-06-recuperation
//
// Produit, pour chaque tuto demandé, un HTML AUTONOME dans _paquets/ :
// moteur, charte, gestes, décors, données et TOUS les symboles embarqués
// (data:). Aucun fichier annexe : la page se montre telle quelle, dans un
// panneau de rendu, un mail ou un téléphone. Les popups de modules sont
// désactivées (elles vivent dans le produit complet, pas dans le BAT).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(racine, "refonte", "tutos-symboles");
const sortie = join(racine, "_paquets");
mkdirSync(sortie, { recursive: true });

const lire = (p) => readFileSync(p, "utf8");

// tous les symboles (fonds + compléments), encodés dans la page
const inline = {};
for (const [dossier] of [
  [join(racine, "fonds-origine", "packs", "fluides", "res", "symboles")],
  [join(src, "symboles-complements")],
]) {
  for (const f of readdirSync(dossier).filter((x) => x.endsWith(".svg"))) {
    inline[basename(f, ".svg")] =
      "data:image/svg+xml;base64," + readFileSync(join(dossier, f)).toString("base64");
  }
}

const css = lire(join(src, "moteur", "tuto.css"));
const moteur = lire(join(src, "moteur", "tuto.js"));
const gestes = lire(join(src, "donnees", "gestes.js"));
const decors = lire(join(src, "donnees", "decors.js"));

const ids = process.argv.slice(2);
if (!ids.length) throw new Error("Donner les ids : node build/bon-a-tirer.mjs methode-01-pose-manos …");

for (const id of ids) {
  const donnees = lire(join(src, "donnees", id + ".js"));
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Bon à tirer — ${id}</title>
<style>${css}
.bat-bande{background:#fff6ec;border-bottom:3px solid #ff6b35;color:#8a4a12;
  padding:8px 20px;font-size:.92em;font-weight:600}
</style>
</head>
<body>
<div class="bat-bande">BON À TIRER — version du 14/08/2026, tout est dans cette page.
Avancez avec les flèches ← → ou les boutons. Les encadrés orange attendent votre décision.</div>
<header class="bandeau">
  <div id="marque" class="marque"></div>
  <div class="titres">
    <h1 id="titre-tuto">…</h1>
    <p class="sous" id="sous-titre"></p>
  </div>
  <div class="outils">
    <button type="button" class="bouton" id="aa" title="Changer la taille du texte">Aa</button>
    <button type="button" class="bouton" id="imprimer" title="Imprimer le livret complet">🖨 Livret</button>
  </div>
</header>
<main>
  <section class="scene">
    <svg id="scene" viewBox="0 0 1000 640"></svg>
    <div class="legende" id="legende"></div>
  </section>
  <aside class="panneau">
    <div class="rail" id="rail"></div>
    <p class="kicker" id="kicker"></p>
    <h2 id="titre-etape"></h2>
    <p id="texte-etape"></p>
    <div id="encadres"></div>
    <div id="controle"></div>
    <nav class="pas">
      <button type="button" class="bouton" id="precedent">‹ Précédent</button>
      <button type="button" class="bouton plein" id="suivant">Suivant ›</button>
    </nav>
  </aside>
</main>
<footer class="pied">
  <span class="compteur" id="compteur"></span>
  <span>Flèches ← → au clavier</span>
  <span class="grandir">
    <button type="button" class="bouton" id="lien">🔗 Copier le lien exact</button>
  </span>
</footer>
<div class="livret" id="livret"></div>
<script>
window.SANS_MODULES = true;
window.SYMBOLES_INLINE = ${JSON.stringify(inline)};
</script>
<script>${moteur}</script>
<script>${gestes}</script>
<script>${decors}</script>
<script>${donnees}</script>
<script>window.demarrerTuto('${id}');</script>
</body>
</html>
`;
  const cible = join(sortie, "BAT-" + id + ".html");
  writeFileSync(cible, html);
  console.log(cible, Math.round(html.length / 1024) + " Ko");
}
