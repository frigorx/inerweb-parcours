/* =====================================================================
   exporter-films-video.mjs — les films d'inerWeb Studio en MP4 (YouTube)
   ---------------------------------------------------------------------
   POURQUOI
   Les films « Les régules » et ceux de Législation sont des pages HTML
   (pile Claude Design : support.js). Pour une chaîne YouTube ou TikTok, il
   faut un fichier vidéo : image, voix, filigrane inerWeb (charte R9).

   COMMENT
   · Chrome sans écran (celui du poste), page servie en local.
   · On capte la scène seule — l'élément
     [data-om-exportable-video-with-duration-secs] — image par image, en la
     pilotant par l'événement `data-om-seek-to-time-frame` : ni barre de
     lecture, ni bouton.
   · Le MP4 reproduit le site. Régules : chaque scène joue sa durée, puis
     l'image se fige tant que sa phrase n'est pas finie (comme le lecteur en
     ligne). Législation : le film s'étire sur la fenêtre utile du MP3
     (VOIX_DEBUT → VOIX_FIN, lus dans la page).
   · Son normalisé à −14 LUFS. Chapitres = frontières de scène, écrits dans
     un fichier de description (ce sont aussi les points de coupe TikTok).

   USAGE   node outils/exporter-films-video.mjs <sortie> <film.html>… [--fps 30]
                [--essai 12] [--studio <studio/index.html>]
   SORTIE  <sortie>/<titre> — film complet (16-9).mp4
           <sortie>/<titre> — description YouTube et TikTok.txt
   PRÉALABLE  ffmpeg et ffprobe dans le PATH ; Playwright emprunté à
              C:/git/hydrometro (voir mémoire « Playwright et Chrome du poste »).
   ===================================================================== */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve, relative, join, extname, sep } from "node:path";
import { spawn, execFileSync } from "node:child_process";
import http from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/git/hydrometro/node_modules/playwright");
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => existsSync(p));

const args = process.argv.slice(2);
const opt = (nom, def) => { const i = args.indexOf(nom); return i < 0 ? def : args.splice(i, 2)[1]; };
const FPS = +opt("--fps", 30);
const ESSAI = +opt("--essai", 0);            /* secondes : un essai court avant la série */
const STUDIO = opt("--studio", null);
const [SORTIE, ...FILMS] = args.map((a) => resolve(a));
if (!SORTIE || !FILMS.length) { console.error("Usage : <sortie> <film.html>… [--fps 30] [--essai 12] [--studio …]"); process.exit(1); }
mkdirSync(SORTIE, { recursive: true });

/* --- les fiches du Studio : numéro, titre, lien vers la station ------- */
const FICHES = {};
if (STUDIO) {
  const h = readFileSync(STUDIO, "utf8");
  for (const li of h.split('<li class="film">').slice(1)) {
    const film = /href="\.\.\/([^"]+)"/.exec(li)?.[1];
    const station = /class="btn sec" href="\.\.\/([^"]+)"/.exec(li)?.[1];
    if (film) FICHES[film.split("/").slice(-2).join("/")] = {
      num: /<p class="num">([^<]*)/.exec(li)?.[1] || "",
      titre: (/<h3>([^<]*)/.exec(li)?.[1] || "").replace(/&amp;/g, "&"),
      film: "https://inerweb.fr/" + film,
      station: station ? "https://inerweb.fr/" + station.replace(/index\.html$/, "") : null,
    };
  }
}

/* --- un petit serveur local : les pages chargent leurs scripts voisins */
/* la racine du dépôt de chaque film (une page du site charge ../../../../moteur/) */
const depot = (f) => { let d = dirname(f); while (!existsSync(join(d, ".git")) && dirname(d) !== d) d = dirname(d); return d; };
const RACINE = FILMS.map(depot).reduce((a, b) => { while (!(b + sep).startsWith(a.endsWith(sep) ? a : a + sep)) a = dirname(a); return a; });
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".jsx": "text/javascript",
  ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp3": "audio/mpeg",
  ".json": "application/json", ".woff2": "font/woff2" };
const serveur = http.createServer((req, res) => {
  const f = join(RACINE, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!f.startsWith(RACINE) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  try { res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
const PORT = serveur.address().port;

const duree = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim();

/* --- le filigrane (charte R9, modèle jouerezo/moteur/voyage-dessin.js D.filigrane) */
function filigraneSvg() {
  const BLEU = "#1b3a63", l = 560, k = l / 400;
  const marque = (x, y) => `<g transform="translate(${x} ${y}) rotate(-12) scale(${k}) translate(-200 -66)">
    <text x="0" y="80" font-size="56">❄️</text>
    <text x="76" y="75" font-size="52" font-weight="700" fill="${BLEU}" font-family="Trebuchet MS, Trebuchet, sans-serif">iner</text>
    <text x="171" y="75" font-size="52" fill="${BLEU}" font-family="Segoe Script, Brush Script MT, cursive">Web</text>
    <line x1="76" x2="276" y1="80" y2="80" stroke="#e8914a" stroke-width="4"/>
    <rect x="281" y="8" rx="7" width="120" height="38" fill="#e8914a"/>
    <text x="341" y="34" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="Segoe UI, Helvetica, Arial, sans-serif">Studio</text>
    <text x="76" y="122" font-size="30" font-weight="700" fill="${BLEU}" font-family="Trebuchet MS, Trebuchet, sans-serif">by inerweb.fr</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%" opacity="0.1">
    ${marque(960, 560)}${marque(380, 230)}${marque(1540, 880)}</svg>`;
}

/* --- noms de scène → titres de chapitre --------------------------------- */
const TITRES = { Arret: "Arrêt", Redemarrage: "Redémarrage", LaCle: "La clé", Degivrage: "Dégivrage",
  CycleComplet: "Cycle complet", MiseEnService: "Mise en service", CourtCycle: "Le court cycle",
  SansCourtCycle: "Sans court cycle", PriseDeMain: "Prise de main" };
const titreScene = (n) => TITRES[n] || n.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
const horodatage = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

const navigateur = await chromium.launch({ headless: true, executablePath: CHROME });

for (const fichier of FILMS) {
  const html = readFileSync(fichier, "utf8");
  const travail = join(SORTIE, "_travail", fichier.split(sep).slice(-2).join("_").replace(/\.html$/, ""));
  rmSync(travail, { recursive: true, force: true });
  mkdirSync(travail, { recursive: true });

  /* 1. la frise : pour chaque image du MP4, le temps du film à montrer */
  const SCENES = JSON.parse(/window\.OM_SCENES\s*=\s*'([^']*)'/.exec(html)[1].replace(/\\u0027/g, "'"));
  const temps = [], voix = [], chapitres = [];
  const pistesVoix = /var PISTES = (\[.*?\]);/.exec(html);
  const legis = /var SRC = "([^"]+\.mp3)";\s*var VOIX_DEBUT = ([\d.]+), VOIX_FIN = ([\d.]+);/.exec(html);
  if (pistesVoix) {
    /* régules : une phrase par scène, embarquée dans la page */
    const PISTES = JSON.parse(pistesVoix[1]);
    const sons = [...html.matchAll(/<script type="text\/plain" id="voix(\d+)">([^<]*)<\/script>/g)];
    let debutFilm = 0;
    for (const s of SCENES) {
      const fin = debutFilm + s.dur, i = PISTES.findIndex((p) => p.nom === s.name);
      chapitres.push({ t: temps.length / FPS, titre: titreScene(s.name) });
      let attente = 0;
      if (i >= 0) {
        const mp3 = join(travail, "voix-" + i + ".mp3");
        writeFileSync(mp3, Buffer.from(sons[i][2].trim(), "base64"));
        voix.push({ mp3, decalage: temps.length / FPS });
        attente = Math.max(0, duree(mp3) + 0.5 - s.dur);
      }
      const gel = fin - 0.15;
      for (let t = debutFilm; t < gel; t += 1 / FPS) temps.push(t);
      for (let k = 0; k < Math.round(attente * FPS); k++) temps.push(gel);
      for (let t = gel; t < fin; t += 1 / FPS) temps.push(t);
      debutFilm = fin;
    }
  } else if (legis) {
    /* Législation : une seule voix, le film s'étire sur sa fenêtre utile */
    const [, src, vd, vf] = legis, total = SCENES.reduce((a, s) => a + s.dur, 0), fen = vf - vd;
    voix.push({ mp3: resolve(dirname(fichier), src), decalage: 0, debut: +vd, fin: +vf });
    for (let k = 0; k < Math.round(fen * FPS); k++) temps.push((k / FPS) / fen * total);
    let c = 0;
    for (const s of SCENES) { chapitres.push({ t: c / total * fen, titre: titreScene(s.name) }); c += s.dur; }
  } else { console.error("✖ " + fichier + " : ni voix par scène, ni voix unique — passé."); continue; }
  for (let k = 0; k < FPS; k++) temps.push(temps[temps.length - 1]);       /* une seconde de fin */
  const frise = ESSAI ? temps.slice(0, ESSAI * FPS) : temps;

  /* 2. la page : la scène seule, à 1920 de large, filigrane posé dessus */
  const page = await navigateur.newPage({ viewport: { width: 1920, height: 1140 } });
  await page.goto("http://127.0.0.1:" + PORT + "/" + relative(RACINE, fichier).split(sep).map(encodeURIComponent).join("/"));
  await page.waitForSelector("[data-om-exportable-video-with-duration-secs]", { timeout: 60000 });
  /* ce qui sert à l'écran et pas dans une vidéo : boutons, barre de voix, transcription repliable */
  await page.addStyleTag({ content: "button, .inerweb-film-controls, details.transcription { visibility: hidden !important; }" });
  await page.evaluate(() => { const b = document.getElementById("voix-bouton"); if (b) b.parentElement.style.setProperty("visibility", "hidden", "important"); });
  const aller = (t) => page.evaluate((t) => new Promise((ok) => {
    document.querySelector("[data-om-exportable-video-with-duration-secs]")
      .dispatchEvent(new CustomEvent("data-om-seek-to-time-frame", { detail: { time: t, playing: false } }));
    requestAnimationFrame(() => requestAnimationFrame(ok));
  }), t);
  let rect;
  for (let essai = 0; essai < 5; essai++) {        /* on agrandit la fenêtre jusqu'à 1920 de large */
    await aller(0);
    rect = await page.evaluate(() => { const r = document.querySelector("[data-om-exportable-video-with-duration-secs]").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    if (rect.width >= 1919 && rect.y >= 0) break;
    const v = page.viewportSize();
    await page.setViewportSize({ width: 1920, height: Math.ceil(v.height + Math.max(1920 - rect.width, -rect.y * 2, 8) * 1080 / 1920) + 2 });
  }
  const clip = { x: Math.max(0, Math.round(rect.x)), y: Math.max(0, Math.round(rect.y)), width: Math.round(rect.width), height: Math.round(rect.height) };
  await page.evaluate(({ clip, svg }) => {
    const d = document.createElement("div");
    d.setAttribute("style", `position:fixed;left:${clip.x}px;top:${clip.y}px;width:${clip.width}px;height:${clip.height}px;` +
      "pointer-events:none;z-index:2147483647;mix-blend-mode:multiply");
    d.innerHTML = svg;
    document.body.appendChild(d);
  }, { clip, svg: filigraneSvg() });

  /* 3. l'image : capture image par image, envoyée à ffmpeg */
  const video = join(travail, "image.mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-vf", "scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "18", video],
    { stdio: ["pipe", "inherit", "inherit"] });
  const fini = new Promise((ok, ko) => ff.on("close", (c) => (c ? ko(new Error("ffmpeg image : " + c)) : ok())));
  let derniere = null, image = null;
  const t0 = Date.now();
  for (let k = 0; k < frise.length; k++) {
    if (frise[k] !== derniere) {
      await aller(frise[k]);
      image = await page.screenshot({ type: "jpeg", quality: 92, clip });
      derniere = frise[k];
    }
    if (!ff.stdin.write(image)) await new Promise((ok) => ff.stdin.once("drain", ok));
    if (k % (FPS * 10) === 0) process.stdout.write("\r  " + (k / FPS).toFixed(0) + " s / " + (frise.length / FPS).toFixed(0) + " s");
  }
  ff.stdin.end();
  await fini;
  await page.close();

  /* 4. le son : chaque voix à sa place, niveau YouTube */
  const titre = (html.match(/<title>([^<]*)/)?.[1] || "").replace(/\s+—\s+inerWeb.*$/, "").trim();
  const fiche = FICHES[fichier.split(sep).slice(-2).join("/")] || FICHES[fichier.split(sep).slice(-3).join("/")] || {};
  const nom = (fiche.titre ? (fiche.num ? fiche.num + " — " : "") + fiche.titre : titre).replace(/[\\/:*?"<>|]/g, "-");
  const final = join(SORTIE, nom + " — film complet (16-9)" + (ESSAI ? " — ESSAI" : "") + ".mp4");
  const entrees = [], filtres = [];
  voix.forEach((v, i) => {
    if (v.debut !== undefined) entrees.push("-ss", String(v.debut), "-to", String(v.fin));
    entrees.push("-i", v.mp3);
    const ms = Math.round(v.decalage * 1000);
    filtres.push(`[${i + 1}:a]aresample=48000,adelay=${ms}|${ms}[a${i}]`);
  });
  const mix = voix.map((_, i) => `[a${i}]`).join("") + `amix=inputs=${voix.length}:normalize=0:dropout_transition=0,apad,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[son]`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, ...entrees, "-filter_complex", filtres.concat(mix).join(";"),
    "-map", "0:v", "-map", "[son]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final]);

  /* 5. la description : chapitres + liens + crédits */
  const lignes = ["inerWeb Studio — tout le froid en accès libre sur https://inerweb.fr", "",
    fiche.titre ? (fiche.num ? fiche.num + " — " : "") + fiche.titre : titre, "",
    pistesVoix ? "La régulation d'une chambre froide : le schéma électrique et le circuit frigorifique s'animent ensemble, expliqués pas à pas." : "", "",
    "Chapitres", ...chapitres.filter((c) => c.t < frise.length / FPS).map((c) => horodatage(c.t) + " " + c.titre), ""];
  if (fiche.film) lignes.push("Le film sur le site : " + fiche.film);
  if (fiche.station) lignes.push("La station de cours : " + fiche.station);
  lignes.push("Tous les films : https://inerweb.fr/studio/", "", "Crédits",
    "Conception pédagogique : F. Henninot — inerWeb. Texte, dessins et animation réalisés avec l'assistance d'une intelligence artificielle ; voix de synthèse. Symboles d'après la planche Éduscol et la collection QElectroTech (CC BY 3.0). Licence CC BY-NC-ND.");
  writeFileSync(join(SORTIE, nom + " — description YouTube et TikTok" + (ESSAI ? " — ESSAI" : "") + ".txt"), lignes.join("\r\n").replace(/\r\n\r\n\r\n/g, "\r\n\r\n"), "utf8");
  rmSync(travail, { recursive: true, force: true });
  console.log("\r  ✔ " + nom + " — " + horodatage(frise.length / FPS) + " — " + ((Date.now() - t0) / 60000).toFixed(1) + " min de rendu");
}
await navigateur.close();
serveur.close();
rmSync(join(SORTIE, "_travail"), { recursive: true, force: true });
