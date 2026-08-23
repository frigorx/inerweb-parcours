import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const modulesRoot = path.resolve(here, "..", "..");
const refonteRoot = path.resolve(modulesRoot, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactRoot = path.join(os.tmpdir(), "inerweb-co2-r744-qa");
const modules = [
  { id: "co2-pourquoi-r744", next: "../co2-etats-physiques/index.html" },
  { id: "co2-etats-physiques", next: "../co2-pressions-securite/index.html" },
  { id: "co2-pressions-securite", next: "../co2-cycle-subcritique/index.html" },
  { id: "co2-cycle-subcritique", next: "../co2-cycle-transcritique/index.html" },
  { id: "co2-cycle-transcritique", next: "../co2-flash-regulation-hp/index.html" },
  { id: "co2-flash-regulation-hp", next: "../co2-mesures-diagnostic/index.html" },
  { id: "co2-mesures-diagnostic", next: "../co2-architecture-reelle/index.html" },
  { id: "co2-architecture-reelle", next: "../co2-r744-interactif/index.html" }
];
const lineHub = "co2-r744-interactif";
const viewports = [
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x640", width: 360, height: 640 }
];

fs.mkdirSync(artifactRoot, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const failures = [];
let screensChecked = 0;
let questionsChecked = 0;

function record(condition, message) {
  if (!condition) failures.push(message);
}

async function settle(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function layoutMetrics(page, selectors) {
  return page.evaluate((targets) => {
    const root = document.documentElement;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, scrollHeight: root.scrollHeight, clientHeight: root.clientHeight },
      boxes: targets.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          selector,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight
        };
      }).filter(Boolean)
    };
  }, selectors);
}

function inspectLayout(metrics, label) {
  const d = metrics.document;
  record(d.scrollWidth <= d.clientWidth + 1 && d.scrollHeight <= d.clientHeight + 1, `${label}: document débordant ${JSON.stringify(d)}`);
  for (const box of metrics.boxes) {
    record(box.left >= -1 && box.top >= -1 && box.right <= metrics.viewport.width + 1 && box.bottom <= metrics.viewport.height + 1,
      `${label}: ${box.selector} hors écran ${JSON.stringify(box)}`);
    record(box.scrollWidth <= box.clientWidth + 1 && box.scrollHeight <= box.clientHeight + 1,
      `${label}: ${box.selector} tronqué ${JSON.stringify(box)}`);
  }
}

for (const module of modules) {
  for (const viewport of viewports) {
    const label = `${module.id} ${viewport.name}`;
    const page = await browser.newPage({ viewport });
    const errors = [];
    const remoteRequests = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    page.on("request", (request) => { if (/^https?:/i.test(request.url())) remoteRequests.push(request.url()); });
    await page.addInitScript(() => {
      window.__speechCalls = 0;
      window.__speechPauses = 0;
      window.__speechResumes = 0;
      class FakeUtterance { constructor(text) { this.text = text; } }
      Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: FakeUtterance });
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          getVoices: () => [{ lang: "fr-FR", name: "Voix locale de test" }],
          speak: (utterance) => {
            window.__speechCalls += 1;
            if (typeof utterance.onstart === "function") utterance.onstart();
          },
          cancel: () => {},
          pause: () => { window.__speechPauses += 1; },
          resume: () => { window.__speechResumes += 1; },
          addEventListener: () => {}
        }
      });
      Storage.prototype.getItem = () => { throw new Error("stockage bloqué pour le test"); };
      Storage.prototype.setItem = () => { throw new Error("stockage bloqué pour le test"); };
    });

    await page.goto(pathToFileURL(path.join(modulesRoot, module.id, "index.html")).href, { waitUntil: "load" });
    await settle(page);
    record((await page.locator(".station-button").count()) === 6, `${label}: cinq écrans + défi non rendus`);
    record((await page.locator("img").count()) === 1, `${label}: image inattendue hors logo inerWeb`);
    record((await page.locator(".brand").getAttribute("href")) === "../co2-r744-interactif/index.html", `${label}: retour vers la ligne absent`);
    record((await page.evaluate(() => window.__speechCalls)) === 0, `${label}: voix lancée sans clic`);
    if (viewport.name === "1366x768") {
      await page.locator("#voice-button").click();
      record((await page.evaluate(() => window.__speechCalls)) === 1, `${label}: voix non déclenchée au clic`);
      await page.locator("#voice-rate").selectOption("1.1");
      record((await page.evaluate(() => window.__speechCalls)) === 2, `${label}: changement de vitesse sans reprise de la lecture`);
      await page.locator("#stop-voice").click();
    }

    let activities = 0;
    for (let lesson = 0; lesson < 5; lesson += 1) {
      await page.locator(`[data-lesson="${lesson}"]`).click();
      await settle(page);
      record((await page.locator(".visual-stage svg[role=img]").count()) === 1, `${label}: écran ${lesson + 1} sans SVG textuellement décrit`);
      record((await page.locator(".copy-panel h1").textContent())?.trim().length > 5, `${label}: titre d’écran ${lesson + 1} vide`);
      activities += await page.locator("[data-activity]").count();
      inspectLayout(await layoutMetrics(page, [".app-shell", ".topbar", ".work-area", ".station-list", ".lesson-card", ".copy-panel", ".visual-panel", ".visual-stage", ".bottom-bar"]), `${label} écran ${lesson + 1}`);
      screensChecked += 1;
    }
    record(activities >= 1, `${label}: aucune manipulation dans la gare`);

    await page.locator("[data-quiz-home]").click();
    for (let question = 0; question < 5; question += 1) {
      record((await page.locator("[data-answer]").count()) === 3, `${label}: question ${question + 1} sans trois choix`);
      await page.locator("[data-answer]").first().click();
      record((await page.locator(".feedback.show").count()) === 1, `${label}: correction ${question + 1} absente`);
      record((await page.locator(".option-button.correct").count()) === 1, `${label}: bonne réponse ${question + 1} non signalée`);
      record((await page.locator(".option-button.wrong").count()) <= 1, `${label}: plusieurs réponses marquées fausses`);
      inspectLayout(await layoutMetrics(page, [".app-shell", ".work-area", ".lesson-card", ".copy-panel", ".visual-panel", ".visual-stage", ".bottom-bar"]), `${label} question ${question + 1}`);
      questionsChecked += 1;
      await page.locator("#next-button").click();
    }
    record((await page.locator(".score-number").count()) === 1, `${label}: bilan final absent`);
    record((await page.locator(".threshold-status").textContent())?.includes("Objectif : 4 / 5"), `${label}: seuil de réussite absent du bilan`);
    record((await page.locator(".module-next-link").getAttribute("href")) === module.next, `${label}: lien vers la gare suivante incorrect`);
    inspectLayout(await layoutMetrics(page, [".app-shell", ".work-area", ".lesson-card", ".copy-panel", ".visual-panel", ".visual-stage", ".bottom-bar"]), `${label} bilan`);

    if ((viewport.name === "1366x768" || viewport.name === "360x640") && (module.id === modules[0].id || module.id === modules.at(-1).id)) {
      await page.screenshot({ path: path.join(artifactRoot, `${module.id}-${viewport.name}.png`), fullPage: false });
    }
    if (viewport.name === "360x640") {
      await page.locator("#lisib-bouton").click();
      await page.locator("#lisib-dys").check();
      await page.locator("#lisib-bouton").click();
      record(await page.locator("html").evaluate((element) => element.classList.contains("police-dys")), `${label}: mode DYS non appliqué`);
    }
    if (viewport.name === "1024x768") {
      await page.emulateMedia({ media: "print" });
      const printState = await page.evaluate(() => ({ shell: getComputedStyle(document.querySelector(".app-shell")).display, bodyOverflow: getComputedStyle(document.body).overflow }));
      record(printState.shell === "block" && printState.bodyOverflow === "visible", `${label}: impression incorrecte ${JSON.stringify(printState)}`);
      await page.emulateMedia({ media: "screen" });
    }
    record(remoteRequests.length === 0, `${label}: requêtes distantes ${remoteRequests.join(", ")}`);
    record(errors.length === 0, `${label}: ${errors.join(" | ")}`);
    await page.close();
  }
}

for (const viewport of viewports) {
  const label = `${lineHub} ${viewport.name}`;
  const page = await browser.newPage({ viewport });
  const errors = [];
  const remoteRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("request", (request) => { if (/^https?:/i.test(request.url())) remoteRequests.push(request.url()); });
  await page.goto(pathToFileURL(path.join(modulesRoot, lineHub, "index.html")).href, { waitUntil: "load" });
  await settle(page);
  record((await page.locator("[data-station]").count()) === modules.length, `${label}: nombre de gares incorrect`);
  inspectLayout(await layoutMetrics(page, [".line-shell", ".line-header", ".line-main", ".map-card", ".metro-map", ".detail-card", ".line-footer"]), `${label} accueil`);
  await page.locator('[data-station="7"]').click();
  record((await page.locator("#station-open").getAttribute("href")) === `../${modules[7].id}/index.html`, `${label}: terminus incorrect`);
  record(await page.locator("#next-station").isDisabled(), `${label}: suivant actif au terminus`);
  await page.locator('[data-station="7"]').press("Home");
  record((await page.locator("#station-position").textContent())?.includes("GARE 1"), `${label}: touche Home inactive`);
  await page.locator('[data-station="0"]').press("ArrowRight");
  record((await page.locator("#station-position").textContent())?.includes("GARE 2"), `${label}: navigation droite inactive`);
  if (viewport.name === "1366x768" || viewport.name === "360x640") await page.screenshot({ path: path.join(artifactRoot, `${lineHub}-${viewport.name}.png`), fullPage: false });
  if (viewport.name === "1024x768") {
    await page.emulateMedia({ media: "print" });
    const printState = await page.evaluate(() => ({ shell: getComputedStyle(document.querySelector(".line-shell")).display, list: getComputedStyle(document.querySelector(".print-list")).display, count: document.querySelectorAll("#print-stations li").length }));
    record(printState.shell === "none" && printState.list === "block" && printState.count === modules.length, `${label}: impression ligne incorrecte ${JSON.stringify(printState)}`);
  }
  record(remoteRequests.length === 0, `${label}: requêtes distantes ${remoteRequests.join(", ")}`);
  record(errors.length === 0, `${label}: ${errors.join(" | ")}`);
  await page.close();
}

const parcours = await browser.newPage({ viewport: { width: 1024, height: 768 } });
await parcours.goto(pathToFileURL(path.join(refonteRoot, "parcours.html")).href, { waitUntil: "load" });
record((await parcours.locator(`a[href="modules/${lineHub}/index.html"]`).count()) === 1, "parcours: entrée CO₂ absente ou dupliquée");
await parcours.close();

const enseignant = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await enseignant.goto(pathToFileURL(path.join(refonteRoot, "enseignant.html")).href, { waitUntil: "load" });
record((await enseignant.locator(`a[href="modules/${lineHub}/index.html"]`).count()) === 1, "enseignant: entrée CO₂ absente ou dupliquée");
await enseignant.close();

const engine = fs.readFileSync(path.join(modulesRoot, "_co2-commun", "engine.js"), "utf8");
const styles = fs.readFileSync(path.join(modulesRoot, "_co2-commun", "styles.css"), "utf8");
record(!/print-color-adjust/i.test(styles), "styles: impression forcée interdite");
record(!/https?:\/\//i.test(engine), "engine: dépendance distante détectée");
record(!/prefers-reduced-motion/i.test(styles), "styles: le mouvement pédagogique ne doit pas disparaître selon le réglage système");
for (const module of modules) {
  const data = fs.readFileSync(path.join(modulesRoot, module.id, "module.js"), "utf8");
  record(!/13\.(?:0[6-9]|1[0-4])/.test(data), `${module.id}: compétence pratique revendiquée dans un module de découverte`);
  record(/relatedLinks:\s*\[/.test(data), `${module.id}: passerelle Habilitation Fluides absente`);
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QA OK — ligne CO₂ + ${screensChecked} écrans de cours et ${questionsChecked} questions contrôlés sur ${modules.length} modules × ${viewports.length} formats.`);
console.log("Hors ligne, liens, clavier, activités, sources, mode DYS, impression, stockage bloqué et voix sans autoplay vérifiés.");
console.log(`Captures : ${artifactRoot}`);
