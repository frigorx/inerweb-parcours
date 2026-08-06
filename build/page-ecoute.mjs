/* =====================================================================
   page-ecoute.mjs — une page d'écoute AUTONOME, son compris
   ---------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE
   Les MP3 remis séparément n'étaient pas écoutables : il fallait les
   télécharger, les retrouver, trouver un lecteur. Une page qui pointe vers
   des fichiers voisins a le même défaut dès qu'elle est déplacée ou
   envoyée seule.

   Ici, les sons sont ENCODÉS DANS LA PAGE (base64). Le fichier produit est
   autonome : on le double-clique, il joue. On peut le déplacer, le copier
   sur une clé, l'envoyer — il marchera toujours. Aucun réseau, aucun
   fichier voisin, aucun lecteur à installer.

   ENTRÉE   refonte/voix/echantillons/*.mp3
   SORTIE   ECOUTER-LES-VOIX.html  (racine, + copie sur le bureau)
   USAGE    node build/page-ecoute.mjs
   ===================================================================== */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ECH = resolve(RACINE, "refonte/voix/echantillons");

const VOIX = [
  { f: "fr-FR-HenriNeural.mp3", nom: "Henri", genre: "masculine",
    mot: "Posée, articulée, un peu grave. La plus proche d'un formateur qui explique au tableau." },
  { f: "fr-FR-RemyMultilingualNeural.mp3", nom: "Rémy", genre: "masculine",
    mot: "Plus jeune, débit plus vif. Tient aussi les mots étrangers sans accent bizarre." },
  { f: "fr-FR-DeniseNeural.mp3", nom: "Denise", genre: "féminine",
    mot: "Claire et neutre, très bonne tenue sur les nombres et les sigles." },
  { f: "fr-FR-VivienneMultilingualNeural.mp3", nom: "Vivienne", genre: "féminine",
    mot: "Plus chaleureuse, intonation plus marquée. Tient aussi les mots étrangers." },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let poids = 0;
const blocs = VOIX.map((v, i) => {
  const chemin = join(ECH, v.f);
  if (!existsSync(chemin)) throw new Error("échantillon manquant : " + v.f);
  const b64 = readFileSync(chemin).toString("base64");
  poids += b64.length;
  return `
  <section class="voix ${v.genre === "masculine" ? "h" : "f"}">
    <div class="haut">
      <h2>${esc(v.nom)}</h2>
      <span class="genre">voix ${esc(v.genre)}</span>
      <span class="num">${i + 1}</span>
    </div>
    <p class="mot">${esc(v.mot)}</p>
    <audio controls preload="auto" src="data:audio/mpeg;base64,${b64}"></audio>
  </section>`;
}).join("");

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Écouter les 4 voix — inerWeb</title>
<style>
  :root{
    --bleu:#1B3A63; --bleu-clair:#2f5689; --orange:#FF6B35; --orange-clair:#ffe2d6;
    --txt:#1d2a38; --mut:#5a6b7d; --fond:#eef2f6; --carte:#fff; --ligne:#d6dee7;
    --r:14px; --ombre:0 2px 10px rgba(27,58,99,.10);
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--fond);color:var(--txt);
    font-family:Calibri,"Segoe UI",system-ui,Arial,sans-serif;font-size:17px;line-height:1.6}
  h1,h2{font-family:"Trebuchet MS",Calibri,Arial,sans-serif;color:var(--bleu);margin:0}
  header{background:var(--bleu);color:#fff;padding:24px 26px}
  header h1{color:#fff;font-size:29px;margin-bottom:8px}
  header p{margin:0;color:#cdd9e6;max-width:74ch}
  header b{color:var(--orange)}
  main{max-width:800px;margin:22px auto;padding:0 22px 70px}
  .phrase{background:#fff;border:1px solid var(--ligne);border-left:5px solid var(--orange);
    border-radius:var(--r);padding:16px 20px;margin-bottom:20px}
  .phrase .t{font-weight:700;color:var(--bleu);margin-bottom:6px}
  .phrase p{margin:0;font-style:italic;color:var(--mut)}
  .reglage{position:sticky;top:0;z-index:5;background:#fff;border:1px solid var(--ligne);
    border-radius:var(--r);box-shadow:var(--ombre);padding:16px 20px;margin-bottom:20px}
  .reglage .ligne{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  .reglage label{font-weight:700;color:var(--bleu);white-space:nowrap}
  .reglage input[type=range]{flex:1;min-width:190px;accent-color:var(--orange);height:26px}
  .reglage .val{font-weight:700;color:var(--orange);min-width:60px;text-align:right;
    font-family:Consolas,monospace;font-size:18px}
  .reglage .aide{margin:8px 0 0;font-size:14px;color:var(--mut)}
  .voix{background:var(--carte);border:1px solid var(--ligne);border-radius:var(--r);
    box-shadow:var(--ombre);padding:18px 20px;margin-bottom:16px;border-left:5px solid var(--bleu-clair)}
  .voix.f{border-left-color:var(--orange)}
  .haut{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
  .haut h2{font-size:23px}
  .genre{font-size:13px;font-weight:700;border-radius:999px;padding:3px 12px;
    background:#e6f0ff;color:#1d4a8f}
  .voix.f .genre{background:var(--orange-clair);color:#a8410f}
  .num{margin-left:auto;font-weight:700;color:#fff;background:var(--bleu);border-radius:999px;
    width:30px;height:30px;line-height:30px;text-align:center;font-size:15px}
  .mot{margin:0 0 12px;color:var(--mut);font-size:15px}
  audio{width:100%;height:44px}
  .bilan{background:#fff;border:1px solid var(--ligne);border-left:5px solid var(--bleu);
    border-radius:var(--r);padding:18px 22px;margin-top:26px}
  .bilan h2{font-size:20px;margin-bottom:10px}
  .bilan ul{margin:0;padding-left:22px}
  .bilan li{margin:8px 0}
  .autonome{margin-top:20px;font-size:14px;color:var(--mut);text-align:center}
</style>

<header>
  <h1>Les 4 voix — écoutez, choisissez</h1>
  <p>Le son est <b>dans cette page</b> : rien à télécharger, rien à installer, aucune
  connexion nécessaire. Cliquez sur ▶ dans chaque bloc.
  Il faut retenir <b>une voix masculine</b> et <b>une voix féminine</b>.</p>
</header>

<main>

  <div class="phrase">
    <div class="t">La même phrase pour les quatre</div>
    <p>« Sur la bouteille, vous lisez R cent trente-quatre a. Le R signifie réfrigérant.
    Les trois chiffres décrivent la molécule : un atome de carbone, deux atomes d'hydrogène,
    quatre atomes de fluor. La lettre a, à la fin, n'est pas un détail. Elle désigne l'isomère.
    Voulez-vous en savoir plus ? »</p>
  </div>

  <div class="reglage">
    <div class="ligne">
      <label for="vit">Vitesse</label>
      <input type="range" id="vit" min="0.6" max="1.6" step="0.05" value="0.95">
      <span class="val" id="valv">0,95 ×</span>
    </div>
    <p class="aide">Agit sur les quatre lecteurs. La voix ne devient pas aiguë quand on
    accélère : elle parle plus vite, c'est tout. C'est ce réglage que le stagiaire ou l'élève
    aura sous la main.</p>
  </div>
${blocs}

  <div class="bilan">
    <h2>Ce que ce choix engage</h2>
    <ul>
      <li>Les fichiers sont <b>fabriqués une fois</b> et rangés à côté du cours. À la lecture,
      la page joue un MP3 : <b>même qualité sur tous les postes, sans Internet</b>, sans dépendre
      du navigateur.</li>
      <li>Aujourd'hui, la seule voix française installée sur votre poste est <b>Hortense</b>.
      C'est elle qui plafonne la qualité, et c'est ce plafond qu'on retire.</li>
      <li><b>Une seule voix pour tout l'ensemble</b> : c'est ce qui la rend harmonisée. Le choix
      masculin / féminin reste offert au lecteur, les deux disent le même texte.</li>
      <li><b>Coût : zéro.</b> Aucune clé d'interface payante.</li>
      <li>La fabrication fait passer le texte des narrations chez Microsoft, qui produit le son.
      Ce sont des textes de cours déjà publics — mais <b>rien n'est envoyé sans votre accord</b>.</li>
    </ul>
  </div>

  <p class="autonome">Page autonome — ${Math.round(poids / 1024)} Ko de son inclus.
  Vous pouvez la copier, la déplacer ou l'envoyer : elle marchera toujours.</p>

</main>

<script>
  var vit = document.getElementById("vit");
  var val = document.getElementById("valv");
  var lecteurs = document.querySelectorAll("audio");

  function appliquer() {
    var v = parseFloat(vit.value);
    val.textContent = v.toFixed(2).replace(".", ",") + " ×";
    for (var i = 0; i < lecteurs.length; i++) {
      /* preservesPitch : on accélère le débit sans monter la voix dans les
         aigus. Sans lui, 1,4 × donne un dessin animé, pas un formateur. */
      lecteurs[i].preservesPitch = true;
      lecteurs[i].playbackRate = v;
    }
  }
  vit.addEventListener("input", appliquer);
  appliquer();

  /* Une seule voix à la fois : sinon on compare deux voix qui parlent ensemble. */
  for (var i = 0; i < lecteurs.length; i++) {
    lecteurs[i].addEventListener("play", function (e) {
      for (var j = 0; j < lecteurs.length; j++) {
        if (lecteurs[j] !== e.target) lecteurs[j].pause();
      }
      e.target.playbackRate = parseFloat(vit.value);
    });
  }
</script>
`;

const sorties = [
  resolve(RACINE, "ECOUTER-LES-VOIX.html"),
  "C:/Users/henni/Desktop/ECOUTER-LES-VOIX.html",
  "C:/Users/henni/OneDrive/Bureau/ECOUTER-LES-VOIX.html",
];
for (const s of sorties) {
  try { writeFileSync(s, html, "utf8"); console.log("écrit : " + s); }
  catch (e) { console.warn("non écrit : " + s + " (" + e.code + ")"); }
}
console.log(`${VOIX.length} voix · ${Math.round(html.length / 1024)} Ko au total`);
