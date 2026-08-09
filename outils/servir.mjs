// Serveur statique local — Node pur, ZÉRO dépendance, aucun accès réseau sortant.
//
// POURQUOI CE FICHIER EXISTE
// Le lanceur d'origine s'appuyait sur `python -m http.server`, et les autres essais sur
// `npx http-server`. Les deux ont le même défaut le jour d'une démonstration : ils
// dépendent de quelque chose qui peut manquer — Python non installé, ou npx qui veut
// télécharger un paquet alors qu'il n'y a pas de réseau dans la salle.
// Node est déjà exigé par le logiciel du centre : on ne dépend donc de rien de plus.
//
// Lancer : node outils/servir.mjs [port] [dossier]
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const port = Number(process.argv[2]) || 4190;
const racine = resolve(process.argv[3] || ".");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

createServer((req, res) => {
  // La chaîne de requête est CONSERVÉE par l'URL mais ne participe jamais au chemin :
  // c'est elle qui porte ?sujet=… , et un serveur qui la perd casse les capsules.
  let chemin;
  try {
    chemin = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    res.writeHead(400).end("Requête illisible");
    return;
  }
  if (chemin.endsWith("/")) chemin += "index.html";

  // Garde de traversée : on résout, puis on exige que le résultat reste SOUS la racine.
  const cible = resolve(join(racine, normalize(chemin)));
  if (cible !== racine && !cible.startsWith(racine + sep)) {
    res.writeHead(403).end("Hors du dossier servi");
    return;
  }
  if (!existsSync(cible) || !statSync(cible).isFile()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
      .end(`<!doctype html><html lang="fr"><meta charset="utf-8">
        <title>Introuvable</title><body style="font-family:Calibri,sans-serif;background:#f7f1e7;
        color:#10233c;padding:2em"><h1 style="color:#1b3a63">Page introuvable</h1>
        <p>${chemin}</p><p><a href="/">Revenir à l'accueil</a></p>`);
    return;
  }

  res.writeHead(200, {
    "Content-Type": TYPES[extname(cible).toLowerCase()] || "application/octet-stream",
    // Aucun cache : pendant une démonstration, on veut toujours la version du disque.
    "Cache-Control": "no-store",
  });
  createReadStream(cible).pipe(res);
})
  .listen(port, "127.0.0.1", () => {
    console.log(`  Capsules servies sur  http://localhost:${port}`);
    console.log(`  Dossier               ${racine}`);
    console.log(`  Pour arrêter : fermez cette fenêtre.`);
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.error(`\n  [!] Le port ${port} est déjà pris — le serveur tourne probablement déjà.`);
      console.error(`      Ouvrez simplement http://localhost:${port}\n`);
      process.exit(0);
    }
    console.error(`\n  [!] ${e.message}\n`);
    process.exit(1);
  });
