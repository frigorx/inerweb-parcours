/* =====================================================================
   page-atelier.mjs — l'atelier en fichiers autonomes
   ---------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE
   Franck relit souvent depuis son téléphone, où il ne peut ni déplier un
   dossier ni lancer un serveur. Une page qui dépend de fichiers voisins
   n'est pas relisible dans ces conditions. Ce script assemble donc tout
   dans un seul .html : charte, moteur, capsules, planches animées, police
   DYS — et, si on le demande, les narrations elles-mêmes.

   DEUX SORTIES, ET C'EST VOULU
   Le son pèse : embarquer les trois capsules avec leurs narrations
   donnerait un fichier de plus de dix mégaoctets, pénible à ouvrir sur un
   téléphone. On produit donc :
     · DECOUPAGE-3-CAPSULES.html   les 3 sujets, sans son — pour juger le
                                    découpage, quelques centaines de Ko ;
     · CAPSULE-AVEC-LA-VOIX.html   un seul sujet AVEC sa vraie voix — pour
                                    juger la voix, quelques Mo.

   Ce n'est PAS la forme de production : en production, un moteur partagé
   et des capsules séparées valent bien mieux. C'est une forme de
   RELECTURE.

   USAGE   node build/page-atelier.mjs
   ===================================================================== */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (p) => readFileSync(resolve(RACINE, p), "utf8");
const b64 = (p) => readFileSync(resolve(RACINE, p)).toString("base64");

/* PIÈGE : du JavaScript mis EN LIGNE dans un <script> ne doit contenir
   nulle part la suite « </script> » — même dans un commentaire. Le
   navigateur ferme le bloc à cet endroit et interprète le reste comme du
   HTML. Pour JavaScript, "<\\/script>" vaut exactement "</script>". */
const enLigne = (code) => code.replace(/<\/(script)/gi, "<\\/$1");

/* ---------------------------------------------------------------------
   1. Charger les capsules — pour connaître leurs écrans et leurs planches
   --------------------------------------------------------------------- */
const CAPSULES = {};
global.CAPSULE = (c) => { CAPSULES[c.id] = c; };
const DOSSIER_CAPSULES = resolve(RACINE, "refonte/capsules");
const FICHIERS = readdirSync(DOSSIER_CAPSULES).filter((f) => f.endsWith(".js") && !f.startsWith("_"));
for (const f of FICHIERS) new Function("CAPSULE", readFileSync(join(DOSSIER_CAPSULES, f), "utf8"))(global.CAPSULE);

const tousLesEcrans = (c) => {
  const l = [...c.fil];
  for (const d of Object.values(c.detours || {})) l.push(...d.ecrans);
  return l;
};

/* ---------------------------------------------------------------------
   2. Le code des capsules, planches remplacées par leur contenu
   --------------------------------------------------------------------- */
function codeCapsules(ids) {
  return ids.map((id) => {
    const fichier = FICHIERS.find((f) => readFileSync(join(DOSSIER_CAPSULES, f), "utf8").includes(`id: "${id}"`));
    let code = readFileSync(join(DOSSIER_CAPSULES, fichier), "utf8");
    for (const e of tousLesEcrans(CAPSULES[id])) {
      if (!e.planche) continue;
      const rel = e.planche.replace(/^\.\.\//, "");
      if (!existsSync(resolve(RACINE, rel))) continue;
      code = code.split(e.planche).join("data:image/svg+xml;base64," + b64(rel));
    }
    return code;
  }).join("\n");
}

/* ---------------------------------------------------------------------
   3. La police DYS entre dans la page
   lisibilite.js déduit normalement le chemin de la police du src de son
   propre <script>. En ligne, ce src est vide : on met la police à la place.
   --------------------------------------------------------------------- */
const POLICE = "data:font/woff2;base64," + b64("fonds-origine/moteur/polices/Lexend-variable.woff2");
let LISIBILITE = lire("fonds-origine/moteur/lisibilite.js").replace(
  `url('" + racine + "polices/Lexend-variable.woff2')`, `url('${POLICE}')`
);
if (!LISIBILITE.includes(POLICE)) console.warn("⚠ police non intégrée — le bouton Aa gardera la police du système");

/* ---------------------------------------------------------------------
   4. Les narrations, quand on les demande
   --------------------------------------------------------------------- */
function sonsEmbarques(id, genre) {
  const dossier = resolve(RACINE, "refonte/voix", genre, id);
  if (!existsSync(dossier)) return null;
  const sons = {};
  let octets = 0;
  for (const e of tousLesEcrans(CAPSULES[id])) {
    const f = join(dossier, e.id + ".mp3");
    if (!existsSync(f)) { console.warn(`  ⚠ narration manquante : ${id}/${e.id}`); continue; }
    const d = readFileSync(f).toString("base64");
    octets += d.length;
    sons[e.id] = "data:audio/mpeg;base64," + d;
  }
  return { sons, octets };
}

/* ---------------------------------------------------------------------
   5. Assembler
   --------------------------------------------------------------------- */
function page({ ids, bandeau, avecSon, relecture }) {
  let blocSons = "";
  if (avecSon) {
    const r = sonsEmbarques(avecSon, "masculine");
    if (r) blocSons = `<script>window.SONS_EMBARQUES = ${JSON.stringify({ nom: "Henri", [avecSon]: r.sons })};</script>`;
  }

  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bandeau.titre)}</title>

<style>
${lire("fonds-origine/moteur/charte-edu.css")}
${lire("refonte/moteur/capsule.css")}

/* Le bandeau de relecture n'existe QUE dans ces versions-ci : il dit au
   relecteur ce qu'il regarde et ce qu'on attend de lui. */
.bandeau-relecture{background:#fff3cd;border-bottom:3px solid var(--orange);
  padding:12px 18px;font-size:15px;color:#7a4a00}
.bandeau-relecture b{color:#a8410f}
.bandeau-relecture p{margin:0;max-width:92ch}
</style>

<body>

<div class="bandeau-relecture"><p>${bandeau.texte}</p></div>
${relecture ? "<script>window.RELECTURE = true;<\\/script>".replace("<\\/", "</") : ""}
<script>
${enLigne(lire("refonte/moteur/capsule.js"))}
</script>

<script>
${enLigne(codeCapsules(ids))}
</script>
${blocSons}
<script>
${enLigne(LISIBILITE)}
</script>

<script>jouerAtelier("");</script>
`;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SORTIES = [
  {
    nom: "MAQUETTE-BETA.html",
    ids: Object.keys(CAPSULES),
    avecSon: null,
    relecture: true,
    bandeau: {
      titre: "Maquette bêta — les capsules à relire",
      texte: "<b>Maquette complète, tout est dans ce seul fichier.</b> "
        + "Chaque fil fait <b>6 écrans</b>. À chaque notion voisine, l'encadré violet "
        + "<b>« Voulez-vous en savoir plus ? »</b> ouvre un détour et vous ramène ensuite "
        + "exactement où vous étiez. Les <b>encadrés rouges « À vérifier »</b> sont les points "
        + "où l'auteur attend l'avis d'un professionnel ; en bas de chaque écran, quatre boutons "
        + "recueillent le vôtre, et la barre du bas enregistre votre relevé. "
        + "<b>La voix est ici celle du navigateur</b> — mauvaise, c'est normal, ce fichier est "
        + "allégé pour le téléphone. La vraie voix est dans le dossier <b>BETA</b> et dans "
        + "<b>CAPSULE-AVEC-LA-VOIX.html</b>.",
    },
  },
  {
    nom: "CAPSULE-AVEC-LA-VOIX.html",
    ids: ["lire-le-code"],
    avecSon: "lire-le-code",
    bandeau: {
      titre: "Lire le code d'un fluide — avec la voix fabriquée",
      texte: "<b>Version avec la vraie voix — les 18 narrations sont dans ce fichier.</b> "
        + "Cliquez sur <b>🔊 Écouter</b> : la voix ne part jamais toute seule. C'est <b>Henri</b>, "
        + "voix neuronale, la même partout et sans Internet. Le curseur règle la vitesse sans que "
        + "la voix monte dans les aigus. Une fois « Écouter » cliqué, les écrans suivants "
        + "s'enchaînent à la voix. <b>Comparez avec ce que vous connaissez</b> : jusqu'ici, c'était "
        + "Hortense, la voix du système.",
    },
  },
];

for (const s of SORTIES) {
  const html = page(s);
  const cibles = [
    resolve(RACINE, s.nom),
    "C:/Users/henni/Desktop/" + s.nom,
    "C:/Users/henni/OneDrive/Bureau/" + s.nom,
  ];
  for (const c of cibles) {
    try { writeFileSync(c, html, "utf8"); } catch (e) { console.warn("non écrit : " + c); }
  }
  console.log(`${s.nom} — ${Math.round(html.length / 1024)} Ko · ${s.ids.length} capsule(s)${s.avecSon ? " · voix incluse" : ""}`);
}
