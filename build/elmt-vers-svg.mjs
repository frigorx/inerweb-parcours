// Convertisseur QElectroTech (.elmt) → SVG à la charte — refait d'une commande :
//   node build/elmt-vers-svg.mjs <fichier.elmt> [...]        → un SVG par élément
//
// Sortie : refonte/tutos-symboles/symboles-complements/qet-<nom>.svg
// Règles : trait recolorisé #1b3a63 (bibliothèque du pack), fonds blancs gardés
// (ils percent les tuyaux), bornes (terminal) → petits disques pleins, textes
// dynamiques ignorés. Primitives couvertes : line, rect, ellipse, circle, arc,
// polygon. Le viewBox reprend le hotspot QET : le (0,0) reste le point de pose.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const sortie = join(racine, "refonte", "tutos-symboles", "symboles-complements");

const COULEUR = "#1b3a63";

function attrs(balise) {
  const a = {};
  for (const m of balise.matchAll(/([\w:-]+)="([^"]*)"/g)) a[m[1]] = m[2];
  return a;
}
function style(a) {
  const s = a.style || "";
  const poids = /line-weight:thin/.test(s) ? 0.6 : /line-weight:(hight|eleve)/.test(s) ? 2 : 1;
  const tirets = /line-style:dashed/.test(s) ? ' stroke-dasharray="3 3"'
    : /line-style:dotted/.test(s) ? ' stroke-dasharray="1 2"' : "";
  const remplit = /filling:white/.test(s) ? "white" : /filling:(none|$)/.test(s) || !/filling:/.test(s) ? "none" : COULEUR;
  return `fill="${remplit}" stroke="${COULEUR}" stroke-width="${poids}"${tirets}`;
}
const n = (v) => String(Math.round(parseFloat(v) * 100) / 100);

function convertir(chemin) {
  const xml = readFileSync(chemin, "utf8");
  const def = attrs(xml.match(/<definition[^>]*>/)[0]);
  const vb = `${-def.hotspot_x} ${-def.hotspot_y} ${def.width} ${def.height}`;
  const formes = [];

  for (const m of xml.matchAll(/<(line|rect|ellipse|circle|arc|polygon)\b[^>]*>/g)) {
    const a = attrs(m[0]);
    const st = style(a);
    switch (m[1]) {
      case "line":
        formes.push(`<line x1="${n(a.x1)}" y1="${n(a.y1)}" x2="${n(a.x2)}" y2="${n(a.y2)}" ${st}/>`);
        break;
      case "rect":
        formes.push(`<rect x="${n(a.x)}" y="${n(a.y)}" width="${n(a.width)}" height="${n(a.height)}" rx="${n(a.rx || 0)}" ${st}/>`);
        break;
      case "ellipse":
        formes.push(`<ellipse cx="${n(parseFloat(a.x) + parseFloat(a.width) / 2)}" cy="${n(parseFloat(a.y) + parseFloat(a.height) / 2)}" rx="${n(parseFloat(a.width) / 2)}" ry="${n(parseFloat(a.height) / 2)}" ${st}/>`);
        break;
      case "circle":
        formes.push(`<circle cx="${n(parseFloat(a.x) + parseFloat(a.diameter) / 2)}" cy="${n(parseFloat(a.y) + parseFloat(a.diameter) / 2)}" r="${n(parseFloat(a.diameter) / 2)}" ${st}/>`);
        break;
      case "arc": {
        // QET : boîte englobante (x,y,w,h), start en degrés (0 = 3 h),
        // étendue anti-horaire. Écran y vers le bas → sin soustrait.
        const w = parseFloat(a.width), h = parseFloat(a.height);
        const cx = parseFloat(a.x) + w / 2, cy = parseFloat(a.y) + h / 2;
        const rx = w / 2, ry = h / 2;
        const t1 = (parseFloat(a.start) * Math.PI) / 180;
        const t2 = ((parseFloat(a.start) + parseFloat(a.angle)) * Math.PI) / 180;
        const p1 = [cx + rx * Math.cos(t1), cy - ry * Math.sin(t1)];
        const p2 = [cx + rx * Math.cos(t2), cy - ry * Math.sin(t2)];
        const grand = Math.abs(parseFloat(a.angle)) > 180 ? 1 : 0;
        const sens = parseFloat(a.angle) > 0 ? 0 : 1;
        formes.push(`<path d="M ${n(p1[0])} ${n(p1[1])} A ${n(rx)} ${n(ry)} 0 ${grand} ${sens} ${n(p2[0])} ${n(p2[1])}" ${st}/>`);
        break;
      }
      case "polygon": {
        const pts = [];
        for (let i = 1; a["x" + i] !== undefined; i++) pts.push(`${n(a["x" + i])},${n(a["y" + i])}`);
        const balise = a.closed === "false" ? "polyline" : "polygon";
        formes.push(`<${balise} points="${pts.join(" ")}" ${st}/>`);
        break;
      }
    }
  }
  // les bornes deviennent les points de raccordement de la bibliothèque
  for (const m of xml.matchAll(/<terminal\b[^>]*>/g)) {
    const a = attrs(m[0]);
    formes.push(`<circle cx="${n(a.x)}" cy="${n(a.y)}" r="1.5" fill="${COULEUR}"/>`);
  }

  const nom = "qet-" + basename(chemin, ".elmt");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" overflow="visible">\n${formes.join("\n")}\n</svg>\n`;
  const cible = join(sortie, nom + ".svg");
  writeFileSync(cible, svg);
  console.log(nom + ".svg", "—", formes.length, "formes, viewBox", vb);
}

const fichiers = process.argv.slice(2);
if (!fichiers.length) throw new Error("Donner des .elmt : node build/elmt-vers-svg.mjs chemin/element.elmt …");
fichiers.forEach(convertir);
