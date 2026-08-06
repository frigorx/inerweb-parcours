/* =====================================================================
   paquet-beta.mjs — le produit bêta, prêt à mettre sur une clé
   ---------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE
   La bêta est relue par une dizaine de personnes — profs, techniciens,
   frigoristes — sur leurs machines. Il leur faut un dossier qui marche
   tout seul : rien à installer, rien à configurer, aucune connexion.

   CE QUE PRODUIT LE SCRIPT
   Un dossier BETA/ complet et refermé sur lui-même :
     · le moteur, la charte, la police DYS ;
     · les 7 capsules et LEURS planches (recopiées, pas pointées) ;
     · les narrations des deux voix ;
     · index.html avec le MODE RELECTURE actif ;
     · LANCER.cmd et LISEZ-MOI.txt.

   On recopie plutôt que de pointer vers fonds-origine/ : un dossier qui
   dépend de son voisin cesse de marcher dès qu'on le déplace, et il sera
   déplacé — clé, courriel, bureau d'un collègue.

   USAGE   node build/paquet-beta.mjs
   ===================================================================== */
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, copyFileSync, statSync,
} from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BETA = resolve(RACINE, "BETA");

/* ---- 1. Repartir propre ------------------------------------------- */
if (existsSync(BETA)) rmSync(BETA, { recursive: true, force: true });
mkdirSync(BETA, { recursive: true });

const copier = (de, vers) => {
  mkdirSync(dirname(vers), { recursive: true });
  copyFileSync(de, vers);
};
const poids = (d) => {
  let t = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    t += e.isDirectory() ? poids(p) : statSync(p).size;
  }
  return t;
};

/* ---- 2. Charger les capsules pour savoir ce dont elles ont besoin --- */
const CAPSULES = {};
global.CAPSULE = (c) => { CAPSULES[c.id] = c; };
const DOSSIER = resolve(RACINE, "refonte/capsules");
const FICHIERS = readdirSync(DOSSIER).filter((f) => f.endsWith(".js") && !f.startsWith("_")).sort();
for (const f of FICHIERS) new Function("CAPSULE", readFileSync(join(DOSSIER, f), "utf8"))(global.CAPSULE);

const ecransDe = (c) => {
  const l = [...c.fil];
  for (const d of Object.values(c.detours || {})) l.push(...d.ecrans);
  return l;
};

/* ---- 3. Le moteur et la charte ------------------------------------- */
copier(resolve(RACINE, "fonds-origine/moteur/charte-edu.css"), join(BETA, "moteur/charte-edu.css"));
copier(resolve(RACINE, "fonds-origine/moteur/impression.css"), join(BETA, "moteur/impression.css"));
copier(resolve(RACINE, "fonds-origine/moteur/lisibilite.js"), join(BETA, "moteur/lisibilite.js"));
copier(resolve(RACINE, "fonds-origine/moteur/polices/Lexend-variable.woff2"), join(BETA, "moteur/polices/Lexend-variable.woff2"));
copier(resolve(RACINE, "fonds-origine/moteur/polices/LICENCE-LEXEND.txt"), join(BETA, "moteur/polices/LICENCE-LEXEND.txt"));
copier(resolve(RACINE, "refonte/moteur/capsule.css"), join(BETA, "moteur/capsule.css"));
copier(resolve(RACINE, "refonte/moteur/capsule.js"), join(BETA, "moteur/capsule.js"));

/* ---- 4. Les capsules, planches recopiées et chemins réécrits -------- */
let nPlanches = 0;
mkdirSync(join(BETA, "capsules"), { recursive: true });
for (const f of FICHIERS) {
  let code = readFileSync(join(DOSSIER, f), "utf8");
  for (const cid in CAPSULES) {
    if (!code.includes('id: "' + cid + '"')) continue;
    for (const e of ecransDe(CAPSULES[cid])) {
      if (!e.planche) continue;
      const src = resolve(RACINE, "refonte", e.planche);
      if (!existsSync(src)) { console.warn("  ⚠ planche absente : " + e.planche); continue; }
      const nom = basename(e.planche);
      copier(src, join(BETA, "planches", nom));
      code = code.split(e.planche).join("planches/" + nom);
      nPlanches++;
    }
  }
  writeFileSync(join(BETA, "capsules", f), code, "utf8");
}

/* ---- 5. Les narrations --------------------------------------------- */
let nSons = 0;
for (const genre of ["masculine", "feminine"]) {
  const src = resolve(RACINE, "refonte/voix", genre);
  if (!existsSync(src)) continue;
  for (const capsule of readdirSync(src)) {
    for (const mp3 of readdirSync(join(src, capsule))) {
      copier(join(src, capsule, mp3), join(BETA, "voix", genre, capsule, mp3));
      nSons++;
    }
  }
}

/* ---- 6. La page ----------------------------------------------------- */
const scripts = FICHIERS.map((f) => '<script src="capsules/' + f + '"></script>').join("\n");

writeFileSync(join(BETA, "index.html"), `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Habilitation fluides — capsules (bêta)</title>
<link rel="stylesheet" href="moteur/charte-edu.css">
<link rel="stylesheet" href="moteur/capsule.css">

<!-- Le produit et sa relecture dans la même page. Une seule ligne les
     sépare : celle qui suit. La retirer donne exactement ce que verra
     l'élève, sans une trace du dispositif de relecture. -->
<script>window.RELECTURE = true;</script>

<script src="moteur/capsule.js"></script>
${scripts}
<script src="moteur/lisibilite.js"></script>
<script>jouerAtelier("");</script>
`, "utf8");

/* ---- 7. Le lanceur et le mode d'emploi ------------------------------ */
writeFileSync(join(BETA, "LANCER.cmd"), `@echo off
REM Ouvre la beta. N'installe rien, n'envoie rien sur Internet.
REM Pour arreter : fermer cette fenetre.
setlocal
cd /d "%~dp0"
set PORT=8130
echo.
echo   Habilitation fluides - capsules (beta)
echo   --------------------------------------
echo.
where python >nul 2>&1
if errorlevel 1 (
  echo   Python est introuvable : ouvrez directement index.html en double-cliquant dessus.
  echo.
  pause
  exit /b 1
)
start "" http://localhost:%PORT%/index.html
echo   Le navigateur va s'ouvrir.
echo.
echo   ^>^> LAISSEZ CETTE FENETRE OUVERTE pendant que vous relisez.
echo.
python -m http.server %PORT% --bind 127.0.0.1
`, "utf8");

const inv = Object.values(CAPSULES).reduce((a, c) => {
  const t = ecransDe(c);
  a.ecrans += t.length;
  a.detours += Object.keys(c.detours || {}).length;
  a.verif += t.filter((e) => e.verifier && e.verifier.length).length;
  a.points += t.reduce((s, e) => s + (e.verifier ? e.verifier.length : 0), 0);
  return a;
}, { ecrans: 0, detours: 0, verif: 0, points: 0 });

writeFileSync(join(BETA, "LISEZ-MOI.txt"),
`CAPSULES HABILITATION FLUIDES — VERSION BETA
============================================

Merci de relire. Voici comment faire, en trois minutes de lecture.


OUVRIR
------
Double-cliquez sur LANCER.cmd, et laissez la fenetre noire ouverte
pendant toute la relecture. Fermez-la quand vous avez fini.

Si LANCER.cmd ne marche pas sur votre poste, double-cliquez
directement sur index.html.

Rien ne s'installe. Rien ne part sur Internet. Tout tourne chez vous.


CE QUE VOUS AVEZ SOUS LES YEUX
------------------------------
${Object.keys(CAPSULES).length} sujets, ${inv.ecrans} ecrans, ${inv.detours} approfondissements.

Chaque sujet suit le meme principe : un fil principal de 6 ecrans, et
a chaque notion voisine un encadre violet « Voulez-vous en savoir
plus ? » qui ouvre un detour et vous ramene ensuite exactement ou vous
etiez. Le compteur en haut ne compte que le fil principal : etre
curieux ne fait jamais reculer la barre.

La voix ne demarre jamais toute seule. Cliquez sur « Ecouter ».
Vous pouvez choisir une voix masculine ou feminine, et regler la
vitesse : elle ne monte pas dans les aigus quand on accelere.

Le bouton « Aa », en bas a droite, agrandit le texte et propose une
police adaptee aux lecteurs dyslexiques.


CE QU'ON VOUS DEMANDE
---------------------
1. LES ENCADRES ROUGES « A VERIFIER ».
   ${inv.verif} ecrans en portent un, pour ${inv.points} points au total. Ce sont les
   endroits ou l'auteur veut l'avis d'un professionnel : une valeur,
   un seuil, une formulation, une regle. Ce sont eux qui comptent le
   plus. La capsule sur le controle d'etancheite en concentre
   beaucoup : tout ce qui y est chiffre est reglementaire, donc date.

2. VOTRE AVIS, EN BAS DE CHAQUE ECRAN.
   Quatre boutons : Juste / A corriger / Question / Sensible.
   Plus une zone de texte libre. Servez-vous surtout de celle-la.

   « Sensible » sert a signaler ce qui pourrait mettre quelqu'un en
   danger, ou ce qui ne doit pas sortir en l'etat.

3. QUAND VOUS AVEZ FINI : le bouton « Enregistrer mon releve », en bas.
   Mettez votre nom, enregistrez le fichier, renvoyez-le.

Vos remarques restent sur VOTRE machine tant que vous n'envoyez pas le
fichier. Rien ne part ailleurs, il n'y a aucun serveur.

Vous pouvez vous arreter et reprendre plus tard : vos remarques sont
conservees.


CE QUE CE N'EST PAS ENCORE
--------------------------
Une beta. Le decoupage et la mecanique sont a juger, le contenu est a
verifier. Dites-le franchement : c'est exactement pour ca qu'on vous
la donne.
`, "utf8");

console.log(`BETA/ — ${Object.keys(CAPSULES).length} capsules · ${inv.ecrans} écrans · ${nPlanches} planches · ${nSons} narrations`);
console.log(`        ${inv.verif} écrans « à vérifier », ${inv.points} points`);
console.log(`        ${(poids(BETA) / 1048576).toFixed(1)} Mo`);
