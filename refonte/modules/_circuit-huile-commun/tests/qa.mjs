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
const artifactRoot = path.join(os.tmpdir(), "inerweb-circuit-huile-qa");
const modules = [
  { id: "technologie-huiles-frigorifiques", lessons: 12, quiz: 10, next: "../retour-huile-naturel/index.html" },
  { id: "retour-huile-naturel", lessons: 10, quiz: 12, next: "../elements-circuit-huile/index.html" },
  { id: "elements-circuit-huile", lessons: 8, quiz: 9, next: "../separateur-huile-pedagogique/index.html" },
  { id: "separateur-huile-pedagogique", lessons: 8, quiz: 8, next: "../reservoir-huile-pedagogique/index.html" },
  { id: "reservoir-huile-pedagogique", lessons: 8, quiz: 8, next: "../clapet-differentiel-huile-pedagogique/index.html" },
  { id: "clapet-differentiel-huile-pedagogique", lessons: 7, quiz: 7, next: "../regulateur-huile-mecanique-pedagogique/index.html" },
  { id: "regulateur-huile-mecanique-pedagogique", lessons: 8, quiz: 8, next: "../traxoil-pedagogique/index.html" },
  { id: "traxoil-pedagogique", lessons: 9, quiz: 9, next: "../pressostat-differentiel-huile-pedagogique/index.html" },
  { id: "pressostat-differentiel-huile-pedagogique", lessons: 10, quiz: 10, next: "../diagnostic-circuit-huile/index.html" },
  { id: "diagnostic-circuit-huile", lessons: 9, quiz: 10, next: "../circuit-huile-interactif/index.html" }
];
const lineHub = "circuit-huile-interactif";
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

async function layoutMetrics(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const selectors = [".app-shell", ".topbar", ".work-area", ".station-list", ".lesson-card", ".copy-panel", ".visual-panel", ".visual-stage", ".bottom-bar"];
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, scrollHeight: root.scrollHeight, clientHeight: root.clientHeight },
      boxes: selectors.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          selector,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight
        };
      }).filter(Boolean)
    };
  });
}

function inspectLayout(metrics, label) {
  const d = metrics.document;
  record(d.scrollWidth <= d.clientWidth + 1 && d.scrollHeight <= d.clientHeight + 1, `${label}: document débordant ${JSON.stringify(d)}`);
  for (const box of metrics.boxes) {
    record(box.left >= -1 && box.top >= -1 && box.right <= metrics.viewport.width + 1 && box.bottom <= metrics.viewport.height + 1,
      `${label}: ${box.selector} hors écran ${JSON.stringify(box)}`);
    record(box.scrollWidth <= box.clientWidth + 1 && box.scrollHeight <= box.clientHeight + 1,
      `${label}: ${box.selector} tronqué ${JSON.stringify(box)}`);
    record(box.scrollLeft === 0 && box.scrollTop === 0,
      `${label}: ${box.selector} décalé dans sa zone ${JSON.stringify(box)}`);
  }
}

async function inspectEmbeddedLayout(frame, rootSelector, label) {
  const metrics = await frame.locator(rootSelector).evaluate((element) => {
    const doc = document.documentElement;
    const rect = element.getBoundingClientRect();
    const children = [".controls", ".stage", ".readout", ".description"].map((selector) => {
      const child = document.querySelector(selector);
      if (!child) return null;
      const childRect = child.getBoundingClientRect();
      return { selector, left: childRect.left, top: childRect.top, right: childRect.right, bottom: childRect.bottom, scrollWidth: child.scrollWidth, clientWidth: child.clientWidth, scrollHeight: child.scrollHeight, clientHeight: child.clientHeight };
    }).filter(Boolean);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, scrollHeight: doc.scrollHeight, clientHeight: doc.clientHeight },
      root: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight },
      children
    };
  });
  record(metrics.document.scrollWidth <= metrics.document.clientWidth + 1 && metrics.document.scrollHeight <= metrics.document.clientHeight + 1,
    `${label}: document embarqué débordant ${JSON.stringify(metrics.document)}`);
  record(metrics.root.left >= -1 && metrics.root.top >= -1 && metrics.root.right <= metrics.viewport.width + 1 && metrics.root.bottom <= metrics.viewport.height + 1,
    `${label}: racine embarquée hors écran ${JSON.stringify(metrics.root)}`);
  record(metrics.root.scrollWidth <= metrics.root.clientWidth + 1 && metrics.root.scrollHeight <= metrics.root.clientHeight + 1,
    `${label}: racine embarquée tronquée ${JSON.stringify(metrics.root)}`);
  for (const child of metrics.children) {
    record(child.left >= -1 && child.top >= -1 && child.right <= metrics.viewport.width + 1 && child.bottom <= metrics.viewport.height + 1,
      `${label}: ${child.selector} embarqué hors écran ${JSON.stringify(child)}`);
    record(child.scrollWidth <= child.clientWidth + 1 && child.scrollHeight <= child.clientHeight + 1,
      `${label}: ${child.selector} embarqué tronqué ${JSON.stringify(child)}`);
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
      Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
      Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: undefined });
      Storage.prototype.getItem = () => { throw new Error("stockage bloqué pour le test"); };
      Storage.prototype.setItem = () => { throw new Error("stockage bloqué pour le test"); };
    });

    const target = pathToFileURL(path.join(modulesRoot, module.id, "index.html")).href;
    await page.goto(target, { waitUntil: "load" });
    record(await page.locator("#voice-button").isDisabled(), `${label}: voix active malgré l’absence de l’API`);
    record((await page.locator(".station-button").count()) === module.lessons + 1, `${label}: nombre de stations incorrect`);
    record((await page.locator("img").count()) === (await page.locator('img.brand-logo[src*="logo-inerweb.svg"]').count()), `${label}: image matricielle ou tierce inattendue hors logo inerWeb`);
    record((await page.locator('.brand').getAttribute("href")) === "../circuit-huile-interactif/index.html", `${label}: retour vers la ligne complète absent`);

    for (let lesson = 0; lesson < module.lessons; lesson += 1) {
      await page.locator(`[data-lesson="${lesson}"]`).click();
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const usesClaudeOilCalculator = module.id === "retour-huile-naturel" && lesson === 6;
      const usesClaudeOilFilm = module.id === "retour-huile-naturel" && lesson === 7;
      const usesClaudePressostat = module.id === "pressostat-differentiel-huile-pedagogique" && lesson === 4;
      if (usesClaudeOilCalculator) {
        record((await page.locator(".claude-retour-huile-frame").count()) === 1, `${label} station ${lesson + 1}: calcul Claude retour d’huile absent`);
        const calculatorFrame = page.frameLocator(".claude-retour-huile-frame");
        record((await calculatorFrame.locator("svg[role=img]").count()) === 1, `${label} station ${lesson + 1}: SVG du calcul non accessible`);
        record((await calculatorFrame.locator("#toggle-motion").getAttribute("aria-pressed")) === "false", `${label} station ${lesson + 1}: mouvement du calcul lancé sans clic`);
        await calculatorFrame.locator("#toggle-motion").click();
        record((await calculatorFrame.locator("#toggle-motion").getAttribute("aria-pressed")) === "true", `${label} station ${lesson + 1}: mouvement du calcul inactif au clic`);
        await calculatorFrame.locator("#toggle-motion").click();
        record((await calculatorFrame.locator("#toggle-motion").getAttribute("aria-pressed")) === "false", `${label} station ${lesson + 1}: pause du calcul inactive`);
        await inspectEmbeddedLayout(calculatorFrame, ".sim", `${label} station ${lesson + 1} calcul Claude`);
      } else if (usesClaudeOilFilm) {
        record((await page.locator(".claude-retour-huile-film-frame").count()) === 1, `${label} station ${lesson + 1}: adaptation complète Claude absente`);
        const filmFrame = page.frameLocator(".claude-retour-huile-film-frame");
        record((await filmFrame.locator("#player").getAttribute("data-scene-count")) === "11", `${label} station ${lesson + 1}: les onze scènes Claude ne sont pas déclarées`);
        record((await filmFrame.locator("svg[role=img]").count()) === 1, `${label} station ${lesson + 1}: SVG du film non accessible`);
        record(!(await filmFrame.locator("#player").evaluate((element) => element.classList.contains("is-playing"))), `${label} station ${lesson + 1}: film lancé sans clic`);
        await filmFrame.locator("#next-scene").click();
        record((await filmFrame.locator("#scene-count").textContent())?.trim() === "2 / 11", `${label} station ${lesson + 1}: navigation du film inactive`);
        await filmFrame.locator("#toggle-play").click();
        record(await filmFrame.locator("#player").evaluate((element) => element.classList.contains("is-playing")), `${label} station ${lesson + 1}: lecture du film inactive au clic`);
        await filmFrame.locator("#toggle-play").click();
        record(!(await filmFrame.locator("#player").evaluate((element) => element.classList.contains("is-playing"))), `${label} station ${lesson + 1}: pause du film inactive`);
        await inspectEmbeddedLayout(filmFrame, ".player", `${label} station ${lesson + 1} film Claude`);
      } else if (usesClaudePressostat) {
        record((await page.locator(".claude-pressostat-frame").count()) === 1, `${label} station ${lesson + 1}: adaptation Claude absente`);
        const claudeFrame = page.frameLocator(".claude-pressostat-frame");
        record((await claudeFrame.locator("svg[role=img]").count()) === 1, `${label} station ${lesson + 1}: SVG Claude non accessible`);
        record((await claudeFrame.locator("[data-state]").count()) === 3, `${label} station ${lesson + 1}: trois états Claude absents`);
        await claudeFrame.locator('[data-state="fault"]').click();
        record((await claudeFrame.locator("#state-word").textContent())?.includes("ARRÊT DE SÉCURITÉ"), `${label} station ${lesson + 1}: état défaut Claude inactif`);
      } else {
        record((await page.locator(".visual-stage svg[role=img]").count()) === 1, `${label} station ${lesson + 1}: SVG accessible absent`);
      }
      inspectLayout(await layoutMetrics(page), `${label} station ${lesson + 1}`);
      const isCriticalOilDiagram =
        (module.id === "technologie-huiles-frigorifiques" && [0, 2, 5, 8, 9, 10, 11].includes(lesson)) ||
        (module.id === "retour-huile-naturel" && [4, 5, 6, 7].includes(lesson)) ||
        (module.id === "elements-circuit-huile" && [1, 2].includes(lesson)) ||
        (module.id === "separateur-huile-pedagogique" && [1, 2].includes(lesson)) ||
        (module.id === "reservoir-huile-pedagogique" && [1, 2].includes(lesson)) ||
        (module.id === "clapet-differentiel-huile-pedagogique" && lesson === 1) ||
        (module.id === "regulateur-huile-mecanique-pedagogique" && [1, 4].includes(lesson)) ||
        (module.id === "traxoil-pedagogique" && [1, 5, 6].includes(lesson)) ||
        (module.id === "pressostat-differentiel-huile-pedagogique" && [2, 4, 5, 7, 8].includes(lesson)) ||
        (module.id === "diagnostic-circuit-huile" && [0, 6].includes(lesson));
      if (isCriticalOilDiagram && ["1366x768", "360x640"].includes(viewport.name)) {
        await page.screenshot({ path: path.join(artifactRoot, `${module.id}-station-${lesson + 1}-${viewport.name}.png`), fullPage: false });
      }
      screensChecked += 1;
    }

    if (viewport.name === "1366x768" || viewport.name === "360x640") {
      await page.screenshot({ path: path.join(artifactRoot, `${module.id}-${viewport.name}.png`), fullPage: false });
    }

    await page.locator("[data-quiz]").click();
    for (let question = 0; question < module.quiz; question += 1) {
      const correct = await page.evaluate((index) => window.OIL_MODULE.quiz[index].correct, question);
      await page.locator(`[data-answer="${correct}"]`).click();
      record((await page.locator(".option-button.correct").count()) === 1, `${label} question ${question + 1}: correction non matérialisée`);
      record(!(await page.locator("#next-button").isDisabled()), `${label} question ${question + 1}: suite verrouillée`);
      inspectLayout(await layoutMetrics(page), `${label} question ${question + 1}`);
      questionsChecked += 1;
      await page.locator("#next-button").click();
    }
    record((await page.locator(".score-number").textContent())?.trim() === `${module.quiz} / ${module.quiz}`, `${label}: score final incorrect`);
    record((await page.locator(".module-next-link").count()) === 1, `${label}: lien vers la station suivante absent ou dupliqué`);
    record((await page.locator(".module-next-link").getAttribute("href")) === module.next, `${label}: mauvaise station suivante`);
    inspectLayout(await layoutMetrics(page), `${label} bilan relié`);

    await page.locator("#previous-button").click();
    record((await page.locator(".option-button.correct").count()) === 1, `${label}: réponse perdue en revenant en arrière`);
    record(!(await page.locator("#next-button").isDisabled()), `${label}: question déjà répondue reverrouillée`);
    await page.locator("#next-button").click();
    await page.locator("#next-button").click();
    record((await page.locator(".module-status").textContent())?.includes("score 0"), `${label}: nouvelle tentative non remise à zéro`);

    await page.locator("#sources-button").click();
    record(await page.locator("#sources-dialog").evaluate((element) => element.open), `${label}: dialogue Sources fermé`);
    await page.locator("#sources-close").click();

    await page.locator('[data-lesson="0"]').click();
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press("ArrowRight");
    record((await page.locator(".module-status").textContent())?.includes("Station 2"), `${label}: navigation clavier droite absente`);
    await page.keyboard.press("ArrowLeft");
    record((await page.locator(".module-status").textContent())?.includes("Station 1"), `${label}: navigation clavier gauche absente`);

    if (viewport.name === "360x640") {
      await page.locator("#lisib-bouton").click();
      await page.locator("#lisib-dys").check();
      await page.evaluate(() => document.fonts?.ready);
      await page.locator("#lisib-bouton").click();
      record(await page.locator("html").evaluate((element) => element.classList.contains("police-dys")), `${label}: mode DYS non appliqué`);
      inspectLayout(await layoutMetrics(page), `${label} mode DYS`);
    }

    if (viewport.name === "1024x768") {
      await page.emulateMedia({ media: "print" });
      const printState = await page.evaluate(() => ({
        topbar: getComputedStyle(document.querySelector(".topbar")).display,
        bodyOverflow: getComputedStyle(document.body).overflow,
        cardDisplay: getComputedStyle(document.querySelector(".lesson-card")).display,
        cardOverflow: getComputedStyle(document.querySelector(".lesson-card")).overflow
      }));
      record(printState.topbar === "none" && printState.bodyOverflow === "visible" && printState.cardDisplay === "block" && printState.cardOverflow === "visible", `${label}: mode impression incorrect ${JSON.stringify(printState)}`);
      await page.emulateMedia({ media: "screen" });
    }

    record(remoteRequests.length === 0, `${label}: requêtes distantes ${remoteRequests.join(", ")}`);
    record(errors.length === 0, `${label}: ${errors.join(" | ")}`);
    await page.close();
  }

  const voicePage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await voicePage.addInitScript(() => {
    window.__speakCalls = 0;
    window.__cancelCalls = 0;
    window.SpeechSynthesisUtterance = function (text) { this.text = text; };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [{ lang: "fr-FR", name: "Voix de test" }],
        speak: (utterance) => { window.__speakCalls += 1; utterance.onstart?.(); },
        cancel: () => { window.__cancelCalls += 1; },
        pause: () => {},
        resume: () => {},
        addEventListener: () => {}
      }
    });
  });
  await voicePage.goto(pathToFileURL(path.join(modulesRoot, module.id, "index.html")).href, { waitUntil: "load" });
  record((await voicePage.evaluate(() => window.__speakCalls)) === 0, `${module.id}: lecture vocale lancée sans clic`);
  await voicePage.locator("#voice-button").click();
  record((await voicePage.evaluate(() => window.__speakCalls)) === 1, `${module.id}: lecture vocale non déclenchée au clic`);
  await voicePage.locator("#stop-voice").click();
  record((await voicePage.evaluate(() => window.__cancelCalls)) > 0, `${module.id}: arrêt vocal inactif`);
  await voicePage.close();
}

for (const viewport of viewports) {
  const label = `ligne-complete ${viewport.name}`;
  const page = await browser.newPage({ viewport });
  const errors = [];
  const remoteRequests = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("request", (request) => { if (/^https?:/i.test(request.url())) remoteRequests.push(request.url()); });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("stockage bloqué pour le test"); };
    Storage.prototype.setItem = () => { throw new Error("stockage bloqué pour le test"); };
  });
  await page.goto(pathToFileURL(path.join(modulesRoot, lineHub, "index.html")).href, { waitUntil: "load" });
  record((await page.locator(".metro-station").count()) === modules.length, `${label}: la carte n’affiche pas dix stations`);
  record((await page.locator(".metro-station.active").count()) === 1, `${label}: station active absente ou dupliquée`);
  record((await page.locator("#station-open").getAttribute("href")) === `../${modules[0].id}/index.html`, `${label}: la première station ne s’ouvre pas`);

  const hubMetrics = await page.evaluate(() => {
    const root = document.documentElement;
    const selectors = [".line-shell", ".line-header", ".line-main", ".map-card", ".metro-map", ".station-grid", ".detail-card", ".line-footer"];
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, scrollHeight: root.scrollHeight, clientHeight: root.clientHeight },
      boxes: selectors.map((selector) => {
        const element = document.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return { selector, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, scrollLeft: element.scrollLeft, scrollTop: element.scrollTop, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight };
      })
    };
  });
  inspectLayout(hubMetrics, `${label} accueil`);

  await page.locator('[data-station="9"]').click();
  record((await page.locator("#station-open").getAttribute("href")) === `../${modules[9].id}/index.html`, `${label}: le terminus ne s’ouvre pas`);
  record(await page.locator("#next-station").isDisabled(), `${label}: la station suivante reste active au terminus`);
  await page.locator('[data-station="9"]').press("Home");
  record((await page.locator("#station-position").textContent())?.includes("STATION 1"), `${label}: touche Home inactive`);
  await page.locator('[data-station="0"]').press("ArrowRight");
  record((await page.locator("#station-position").textContent())?.includes("STATION 2"), `${label}: navigation clavier droite absente`);

  if (viewport.name === "1366x768" || viewport.name === "360x640") {
    await page.screenshot({ path: path.join(artifactRoot, `${lineHub}-${viewport.name}.png`), fullPage: false });
  }

  if (viewport.name === "360x640") {
    await page.locator("#lisib-bouton").click();
    await page.locator("#lisib-dys").check();
    await page.locator("#lisib-bouton").click();
    record(await page.locator("html").evaluate((element) => element.classList.contains("police-dys")), `${label}: mode DYS non appliqué`);
  }

  if (viewport.name === "1024x768") {
    await page.emulateMedia({ media: "print" });
    const printState = await page.evaluate(() => ({
      shell: getComputedStyle(document.querySelector(".line-shell")).display,
      list: getComputedStyle(document.querySelector(".print-list")).display,
      count: document.querySelectorAll("#print-stations li").length,
      bodyOverflow: getComputedStyle(document.body).overflow
    }));
    record(printState.shell === "none" && printState.list === "block" && printState.count === modules.length && printState.bodyOverflow === "visible", `${label}: impression de la ligne incorrecte ${JSON.stringify(printState)}`);
    await page.emulateMedia({ media: "screen" });
  }

  record(remoteRequests.length === 0, `${label}: requêtes distantes ${remoteRequests.join(", ")}`);
  record(errors.length === 0, `${label}: ${errors.join(" | ")}`);
  await page.close();
}

const parcours = await browser.newPage({ viewport: { width: 1024, height: 768 } });
await parcours.goto(pathToFileURL(path.join(refonteRoot, "parcours.html")).href, { waitUntil: "load" });
record((await parcours.locator(".palier").count()) === 7, "parcours: sept paliers non rendus");
record((await parcours.locator(`a[href="modules/${lineHub}/index.html"]`).count()) === 1, "parcours: entrée de la ligne complète absente ou dupliquée");
for (const module of modules) {
  record((await parcours.locator(`a[href="modules/${module.id}/index.html"]`).count()) === 1, `parcours: lien ${module.id} absent ou dupliqué`);
}
await parcours.close();

const enseignant = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await enseignant.goto(pathToFileURL(path.join(refonteRoot, "enseignant.html")).href, { waitUntil: "load" });
record((await enseignant.locator(`a[href="modules/${lineHub}/index.html"]`).count()) === 1, "enseignant: entrée de la ligne complète absente ou dupliquée");
for (const module of modules) {
  record((await enseignant.locator(`a[href="modules/${module.id}/index.html"]`).count()) === 1, `enseignant: lien ${module.id} absent ou dupliqué`);
}
await enseignant.close();

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QA OK — ligne complète + ${screensChecked} écrans de cours et ${questionsChecked} questions contrôlés sur ${modules.length} modules × ${viewports.length} formats. Hors ligne, liens de station à station, clavier, sources, mode DYS, impression, stockage bloqué et voix sans autoplay vérifiés.`);
console.log(`Captures : ${artifactRoot}`);
