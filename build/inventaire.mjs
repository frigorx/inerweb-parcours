/* =====================================================================
   inventaire.mjs — la table de tri AVANT la refonte
   ---------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE
   L'atelier ne part pas d'une page blanche : il part de 44 planches
   animées et d'une vingtaine de tutos guidés déjà écrits, qui tournent,
   et qu'on ne veut surtout pas casser. Avant de refondre quoi que ce
   soit, il faut pouvoir REGARDER l'existant pièce par pièce et TRANCHER :
   celle-là on la garde telle quelle, celle-là on la refond, celle-là on
   l'abandonne.

   Une liste de noms de fichiers ne permet pas de trancher. Il faut voir
   la planche jouer. D'où cette page : chaque pièce est affichée, jouable,
   ouvrable seule, et porte un bouton de décision. Les décisions sont
   gardées dans le navigateur et s'exportent en Markdown — c'est ce texte
   exporté qui devient le cahier des charges de la refonte.

   ENTRÉE   fonds-origine/  (copie gelée, jamais modifiée)
   SORTIE   inventaire.html
   USAGE    node build/inventaire.mjs

   RELEVÉ, JAMAIS SAISI — on relit le dossier à chaque exécution. Un
   inventaire tenu à la main ment au bout de trois pièces.
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONDS = resolve(RACINE, "fonds-origine");
const RES = resolve(FONDS, "packs/fluides/res");

const esc = (s) =>
  String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ko = (o) => (o < 1024 ? o + " o" : o < 1024 * 1024 ? Math.round(o / 1024) + " Ko" : (o / 1048576).toFixed(1) + " Mo");

/* Poids d'un dossier entier : un tuto guidé, ce n'est pas un fichier,
   c'est un dossier avec ses images et ses sons. */
function poidsDossier(d) {
  let t = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    t += e.isDirectory() ? poidsDossier(p) : statSync(p).size;
  }
  return t;
}

/* ---------------------------------------------------------------------
   1. LES PLANCHES — SVG animés
   --------------------------------------------------------------------- */
const planches = readdirSync(join(RES, "svg"))
  .filter((f) => f.endsWith(".svg"))
  .sort()
  .map((fichier) => {
    const svg = readFileSync(join(RES, "svg", fichier), "utf8");
    const titre = (svg.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || fichier.replace(/\.svg$/, "");
    const smil = (svg.match(/<animate(Motion|Transform)?[\s>]/g) || []).length;
    const css = (svg.match(/animation\s*:/g) || []).length;
    const cyclique = /repeatCount\s*=\s*"indefinite"/.test(svg) || /infinite/.test(svg);

    /* Durée : le plus tardif des begin + sa durée. Sert à dire combien de
       temps regarder — une planche de 16 s vue 3 s donne l'impression
       que « ça ne marche pas ». */
    let fin = 0;
    for (const m of svg.matchAll(/<animate[^>]*>/g)) {
      const b = parseFloat((m[0].match(/begin="([\d.]+)s"/) || [])[1] || 0);
      const d = parseFloat((m[0].match(/dur="([\d.]+)s"/) || [])[1] || 0);
      if (b + d > fin) fin = b + d;
    }
    if (fin === 0) {
      const base = parseFloat((svg.match(/animation\s*:\s*[\w-]+\s+([\d.]+)s/) || [])[1] || 0);
      let retard = 0;
      for (const m of svg.matchAll(/animation-delay\s*:\s*([\d.]+)s/g)) retard = Math.max(retard, parseFloat(m[1]));
      fin = base > 0 ? base + retard : 0;
    }

    const nature = smil + css === 0 ? "fixe" : cyclique ? "boucle" : "récit";
    /* Le texte porté par la planche : c'est lui qu'on relit pour juger du
       fond, pas le dessin. */
    const mots = (svg.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || [])
      .map((t) => t.replace(/<[^>]+>/g, " ").trim())
      .filter(Boolean);

    return {
      genre: "planche",
      id: fichier.replace(/\.svg$/, ""),
      fichier,
      chemin: `fonds-origine/packs/fluides/res/svg/${fichier}`,
      titre,
      nature,
      duree: fin ? Math.round(fin) : 0,
      poids: statSync(join(RES, "svg", fichier)).size,
      reperes: smil + css,
      textes: mots,
    };
  });

/* ---------------------------------------------------------------------
   2. LES TUTOS GUIDÉS — dossiers HTML autonomes
   Les pages de contrôle interne (préfixe « _ ») ne sont pas des tutos :
   on ne les inventorie pas, elles n'ont rien à refondre.
   --------------------------------------------------------------------- */
const HORS_TUTO = new Set(["svg", "img", "photos", "audio", "symboles", "bibliotheque"]);

const tutos = readdirSync(RES, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !HORS_TUTO.has(e.name))
  .map((e) => {
    const d = join(RES, e.name);
    const pages = readdirSync(d).filter((f) => f.endsWith(".html") && !f.startsWith("_"));
    if (!pages.length) return null;
    /* Une entrée par page : « outils » en porte deux, indépendantes. */
    return pages.map((page) => {
      const html = readFileSync(join(d, page), "utf8");
      const titre = ((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || page).split("|")[0].trim();
      /* Combien d'écrans ? Les tutos guidés avancent par étapes : on
         compte les marqueurs les plus courants plutôt que de deviner. */
      const etapes = Math.max(
        (html.match(/class="[^"]*\b(etape|scene|ecran|slide|carte)\b/g) || []).length,
        (html.match(/data-(etape|scene|ecran)=/g) || []).length
      );
      const sons = (html.match(/\.(mp3|ogg|wav)/g) || []).length;
      const voix = /speechSynthesis|SpeechSynthesisUtterance/.test(html);
      return {
        genre: "tuto",
        id: e.name + (pages.length > 1 ? "/" + page.replace(/\.html$/, "") : ""),
        fichier: page,
        chemin: `fonds-origine/packs/fluides/res/${e.name}/${page}`,
        titre,
        nature: voix ? "narré" : etapes > 3 ? "guidé" : "outil",
        etapes,
        sons,
        poids: poidsDossier(d),
        lignes: html.split("\n").length,
      };
    });
  })
  .filter(Boolean)
  .flat()
  .sort((a, b) => a.id.localeCompare(b.id, "fr"));

/* ---------------------------------------------------------------------
   3. LA PAGE
   --------------------------------------------------------------------- */
const carteP = (p) => `
<article class="piece" data-id="${esc(p.id)}" data-genre="planche" data-nature="${esc(p.nature)}">
  <div class="vue"><img src="${esc(p.chemin)}" alt="${esc(p.titre)}" loading="lazy"></div>
  <div class="infos">
    <h3>${esc(p.titre)}</h3>
    <p class="meta">
      <span class="et et-${esc(p.nature)}">${esc(p.nature)}</span>
      ${p.duree ? `<span class="et">${p.duree} s</span>` : ""}
      <span class="et">${ko(p.poids)}</span>
      <span class="fic">${esc(p.fichier)}</span>
    </p>
    ${p.textes.length ? `<details class="txt"><summary>Le texte de la planche (${p.textes.length})</summary><p>${esc(p.textes.join(" · "))}</p></details>` : `<p class="txt vide">Aucun texte dans la planche — elle ne parle que par le dessin.</p>`}
    <p class="actions">
      <button class="rejouer" type="button">↻ Rejouer</button>
      <a href="${esc(p.chemin)}" target="_blank" rel="noopener">⬇ Ouvrir seule</a>
    </p>
    ${boutonsDecision(p.id)}
  </div>
</article>`;

const carteT = (t) => `
<article class="piece large" data-id="${esc(t.id)}" data-genre="tuto" data-nature="${esc(t.nature)}">
  <div class="vue cadre"><iframe src="${esc(t.chemin)}" title="${esc(t.titre)}" loading="lazy"></iframe></div>
  <div class="infos">
    <h3>${esc(t.titre)}</h3>
    <p class="meta">
      <span class="et et-${esc(t.nature)}">${esc(t.nature)}</span>
      ${t.etapes ? `<span class="et">${t.etapes} écrans</span>` : ""}
      ${t.sons ? `<span class="et">${t.sons} sons</span>` : ""}
      <span class="et">${ko(t.poids)}</span>
      <span class="et">${t.lignes} lignes</span>
      <span class="fic">${esc(t.id)}</span>
    </p>
    <p class="actions">
      <button class="rejouer" type="button">↻ Recharger</button>
      <a href="${esc(t.chemin)}" target="_blank" rel="noopener">⬇ Ouvrir en grand</a>
    </p>
    ${boutonsDecision(t.id)}
  </div>
</article>`;

function boutonsDecision(id) {
  return `<div class="decision" data-pour="${esc(id)}">
    <button type="button" data-val="garder">✔ Garder telle quelle</button>
    <button type="button" data-val="refondre">✎ Refondre</button>
    <button type="button" data-val="abandonner">✖ Abandonner</button>
    <input type="text" class="note" placeholder="pourquoi / ce qu'il faut changer" aria-label="note sur ${esc(id)}">
  </div>`;
}

const html = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atelier animations — inventaire du fonds</title>
<link rel="stylesheet" href="fonds-origine/moteur/charte-edu.css">
<style>
  body{background:var(--fond)}
  .entete{background:var(--bleu);color:#fff;padding:18px 22px}
  .entete h1{color:#fff;margin:0 0 4px;font-size:24px}
  .entete p{margin:0;color:#cdd9e6;font-size:14px;max-width:70ch}
  .entete b{color:var(--orange)}
  .pilotage{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--ligne);
    padding:10px 22px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:14px}
  .pilotage button, .pilotage select{font:inherit;padding:6px 12px;border-radius:8px;
    border:2px solid var(--ligne);background:#fff;color:var(--txt);cursor:pointer}
  .pilotage button:hover{border-color:var(--bleu-clair);background:#f5f9fd}
  .pilotage .compte{color:var(--mut);margin-left:auto}
  .zone{max-width:1180px;margin:22px auto;padding:0 22px 80px}
  .zone > h2{border-bottom:3px solid var(--orange);padding-bottom:6px;margin-top:34px}
  .zone > h2 .n{color:var(--mut);font-weight:400;font-size:16px}
  .grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px;margin-top:16px}
  .piece{background:var(--carte);border:1px solid var(--ligne);border-radius:var(--r);
    box-shadow:var(--ombre);overflow:hidden;display:flex;flex-direction:column}
  .piece.large{grid-column:span 2}
  @media(max-width:820px){.piece.large{grid-column:span 1}}
  .vue{background:#f7fafd;border-bottom:1px solid var(--ligne);display:flex;align-items:center;
    justify-content:center;min-height:190px;padding:10px}
  .vue img{max-width:100%;max-height:280px;display:block}
  .vue.cadre{padding:0;min-height:330px}
  .vue.cadre iframe{width:100%;height:330px;border:0;background:#fff}
  .infos{padding:14px 16px;display:flex;flex-direction:column;gap:8px;flex:1}
  .infos h3{margin:0;font-size:17px;line-height:1.3}
  .meta{margin:0;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .et{font-size:12px;font-weight:700;background:#eef3f9;color:var(--bleu);
    border-radius:999px;padding:2px 9px}
  .et-récit{background:var(--orange-clair);color:#a8410f}
  .et-boucle{background:#e6f0ff;color:#1d4a8f}
  .et-fixe{background:#eceff2;color:var(--mut)}
  .et-narré{background:var(--ok-bg);color:var(--ok)}
  .et-guidé{background:var(--orange-clair);color:#a8410f}
  .fic{font-size:11px;color:var(--mut);font-family:Consolas,monospace}
  .txt{font-size:13px;color:var(--mut);margin:0}
  .txt summary{cursor:pointer;color:var(--bleu-clair)}
  .txt p{margin:6px 0 0;line-height:1.5}
  .txt.vide{font-style:italic}
  .actions{margin:0;display:flex;gap:10px;align-items:center;font-size:14px}
  .actions button{font:inherit;padding:5px 11px;border-radius:8px;border:2px solid var(--ligne);
    background:#fff;color:var(--bleu);cursor:pointer}
  .actions button:hover{border-color:var(--orange)}
  .actions a{color:var(--bleu-clair);text-decoration:none}
  .actions a:hover{text-decoration:underline}
  .decision{margin-top:auto;padding-top:10px;border-top:1px dashed var(--ligne);
    display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .decision button{font:inherit;font-size:13px;padding:5px 10px;border-radius:8px;
    border:2px solid var(--ligne);background:#fff;color:var(--mut);cursor:pointer}
  .decision button:hover{border-color:var(--bleu-clair)}
  .decision button[aria-pressed="true"][data-val="garder"]{background:var(--ok-bg);color:var(--ok);border-color:var(--ok)}
  .decision button[aria-pressed="true"][data-val="refondre"]{background:var(--orange-clair);color:#a8410f;border-color:var(--orange)}
  .decision button[aria-pressed="true"][data-val="abandonner"]{background:var(--ko-bg);color:var(--ko);border-color:var(--ko)}
  .decision .note{flex:1;min-width:150px;font:inherit;font-size:13px;padding:5px 9px;
    border:1px solid var(--ligne);border-radius:8px;background:#fff;color:var(--txt)}
  .piece[data-choix="abandonner"] .vue{opacity:.4}
  .sortie{margin-top:30px;background:#fff;border:1px solid var(--ligne);border-radius:var(--r);padding:16px}
  .sortie textarea{width:100%;min-height:200px;font-family:Consolas,monospace;font-size:13px;
    border:1px solid var(--ligne);border-radius:8px;padding:10px;background:#fbfdff;color:var(--txt)}
  @media print{.pilotage,.actions,.decision button{display:none}}
</style>

<header class="entete">
  <h1>Atelier animations — inventaire du fonds</h1>
  <p>Les <b>${planches.length} planches animées</b> et les <b>${tutos.length} tutos guidés</b> repris de
  <i>pilote-fluides</i>, tels qu'ils tournent aujourd'hui. Rien ici n'est modifié : c'est la
  <b>copie gelée</b>. On regarde, on tranche pièce par pièce, on exporte la liste — et c'est
  cette liste qui devient le cahier des charges de la refonte.</p>
</header>

<div class="pilotage">
  <button type="button" id="tout-rejouer">↻ Tout rejouer</button>
  <label>Montrer&nbsp;
    <select id="filtre">
      <option value="">tout</option>
      <option value="sans">pas encore tranché</option>
      <option value="garder">à garder</option>
      <option value="refondre">à refondre</option>
      <option value="abandonner">à abandonner</option>
    </select>
  </label>
  <button type="button" id="exporter">↧ Exporter les décisions</button>
  <button type="button" id="vider">Effacer mes décisions</button>
  <span class="compte" id="compte"></span>
</div>

<main class="zone">
  <h2>Planches animées <span class="n">— ${planches.length}, dessin seul, aucun texte lu</span></h2>
  <div class="grille">${planches.map(carteP).join("")}</div>

  <h2>Tutos guidés <span class="n">— ${tutos.length}, pages autonomes qui avancent par étapes</span></h2>
  <div class="grille">${tutos.map(carteT).join("")}</div>

  <section class="sortie" id="sortie" hidden>
    <h3>Les décisions, en Markdown</h3>
    <p class="txt">À coller dans <code>REPRISE.md</code> ou à me redonner tel quel : c'est le point de départ de la refonte.</p>
    <textarea id="md" readonly></textarea>
  </section>
</main>

<script>
/* Les décisions vivent dans le navigateur : aucun serveur, aucun compte,
   et on peut fermer la page sans rien perdre. */
const CLE = "atelier-animations-decisions";
const etat = JSON.parse(localStorage.getItem(CLE) || "{}");

function peindre(){
  for (const piece of document.querySelectorAll(".piece")){
    const id = piece.dataset.id, d = etat[id] || {};
    piece.dataset.choix = d.choix || "";
    for (const b of piece.querySelectorAll(".decision button"))
      b.setAttribute("aria-pressed", String(d.choix === b.dataset.val));
    const n = piece.querySelector(".note");
    if (document.activeElement !== n) n.value = d.note || "";
  }
  const total = document.querySelectorAll(".piece").length;
  const tranches = Object.values(etat).filter(d => d.choix).length;
  document.getElementById("compte").textContent = tranches + " / " + total + " tranchés";
  filtrer();
}

function filtrer(){
  const v = document.getElementById("filtre").value;
  for (const piece of document.querySelectorAll(".piece")){
    const c = (etat[piece.dataset.id] || {}).choix || "";
    piece.hidden = v === "" ? false : v === "sans" ? !!c : c !== v;
  }
}

function noter(id, champ, valeur){
  etat[id] = etat[id] || {};
  etat[id][champ] = valeur;
  if (!etat[id].choix && !etat[id].note) delete etat[id];
  localStorage.setItem(CLE, JSON.stringify(etat));
}

document.addEventListener("click", (e) => {
  const b = e.target.closest(".decision button");
  if (b){
    const id = b.closest(".decision").dataset.pour;
    const dejà = (etat[id] || {}).choix === b.dataset.val;
    noter(id, "choix", dejà ? "" : b.dataset.val);   /* re-cliquer annule */
    peindre();
    return;
  }
  const r = e.target.closest(".rejouer");
  if (r){
    /* Relancer une animation SVG = recharger la source. Il n'y a pas
       d'autre prise sur un SVG affiché en image. */
    const vue = r.closest(".piece").querySelector("img, iframe");
    const src = vue.src.split("#")[0];
    vue.src = src + "#r" + performance.now();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("note"))
    noter(e.target.closest(".decision").dataset.pour, "note", e.target.value);
});

document.getElementById("filtre").addEventListener("change", filtrer);

document.getElementById("tout-rejouer").addEventListener("click", () => {
  for (const v of document.querySelectorAll(".piece:not([hidden]) img, .piece:not([hidden]) iframe")){
    const src = v.src.split("#")[0];
    v.src = src + "#r" + performance.now();
  }
});

document.getElementById("vider").addEventListener("click", () => {
  if (!confirm("Effacer toutes les décisions prises sur cette page ?")) return;
  for (const k of Object.keys(etat)) delete etat[k];
  localStorage.removeItem(CLE);
  peindre();
});

document.getElementById("exporter").addEventListener("click", () => {
  const par = { refondre: [], garder: [], abandonner: [] };
  for (const piece of document.querySelectorAll(".piece")){
    const id = piece.dataset.id, d = etat[id] || {};
    if (!d.choix) continue;
    const titre = piece.querySelector("h3").textContent;
    par[d.choix].push("- **" + titre + "** (\`" + id + "\`)" + (d.note ? " — " + d.note : ""));
  }
  const sans = [...document.querySelectorAll(".piece")]
    .filter(p => !(etat[p.dataset.id] || {}).choix)
    .map(p => "- " + p.querySelector("h3").textContent + " (\`" + p.dataset.id + "\`)");
  let md = "# Décisions de refonte\\n\\n";
  md += "## À refondre (" + par.refondre.length + ")\\n" + (par.refondre.join("\\n") || "_rien_") + "\\n\\n";
  md += "## À garder telles quelles (" + par.garder.length + ")\\n" + (par.garder.join("\\n") || "_rien_") + "\\n\\n";
  md += "## À abandonner (" + par.abandonner.length + ")\\n" + (par.abandonner.join("\\n") || "_rien_") + "\\n\\n";
  md += "## Pas encore tranché (" + sans.length + ")\\n" + (sans.join("\\n") || "_rien_") + "\\n";
  document.getElementById("sortie").hidden = false;
  const z = document.getElementById("md");
  z.value = md;
  z.select();
  document.getElementById("sortie").scrollIntoView({ behavior:"smooth" });
});

peindre();
</script>
`;

writeFileSync(resolve(RACINE, "inventaire.html"), html, "utf8");
console.log(`inventaire.html — ${planches.length} planches, ${tutos.length} tutos guidés`);
