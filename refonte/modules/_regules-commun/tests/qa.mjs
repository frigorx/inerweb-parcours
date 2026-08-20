import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const common = path.resolve(here, "..");
const modulesRoot = path.resolve(common, "..");
const catalogPath = path.join(common, "catalog.js");
const screenshotRoot = path.join(here, "screenshots");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(catalogPath, "utf8"), sandbox, { filename: catalogPath });
const catalog = sandbox.window.REGULES_CATALOG;

const viewports = [
  { name: "projection", width: 1366, height: 768 },
  { name: "tablette", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
  { name: "petit-mobile", width: 360, height: 640 }
];

const failures = [];
let screenChecks = 0;
let questionChecks = 0;
let remoteRequests = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

function pageUrl(relativePath) {
  return pathToFileURL(path.join(modulesRoot, relativePath)).href;
}

function attachDiagnostics(page, label) {
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`${label} — console: ${message.text()}`);
  });
  page.on("pageerror", (error) => failures.push(`${label} — pageerror: ${error.message}`));
  page.on("request", (request) => {
    if (/^https?:/i.test(request.url())) {
      remoteRequests += 1;
      failures.push(`${label} — appel distant interdit: ${request.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    if (request.url().startsWith("file:")) failures.push(`${label} — ressource locale absente: ${request.url()}`);
  });
}

async function geometry(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const copy = document.querySelector(".copy-panel");
    const visual = document.querySelector(".visual-panel");
    const rects = Array.from(document.querySelectorAll("button, a, select"))
      .filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return !node.classList.contains("skip-link") && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((node) => ({ label: node.getAttribute("aria-label") || node.textContent.trim().slice(0, 35), rect: node.getBoundingClientRect().toJSON() }));
    return {
      viewportOverflow: root.scrollWidth > innerWidth + 1 || root.scrollHeight > innerHeight + 1 || body.scrollWidth > innerWidth + 1 || body.scrollHeight > innerHeight + 1,
      copyClipped: copy ? copy.scrollHeight > copy.clientHeight + 2 || copy.scrollWidth > copy.clientWidth + 2 : false,
      copySize: copy ? { scrollHeight: copy.scrollHeight, clientHeight: copy.clientHeight, scrollWidth: copy.scrollWidth, clientWidth: copy.clientWidth } : null,
      visualClipped: visual ? visual.scrollHeight > visual.clientHeight + 2 || visual.scrollWidth > visual.clientWidth + 2 : false,
      visualSize: visual ? { scrollHeight: visual.scrollHeight, clientHeight: visual.clientHeight, scrollWidth: visual.scrollWidth, clientWidth: visual.clientWidth } : null,
      outside: rects.filter((item) => item.rect.left < -2 || item.rect.top < -2 || item.rect.right > innerWidth + 2 || item.rect.bottom > innerHeight + 2)
    };
  });
}

async function checkHub(browser, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  attachDiagnostics(page, `carte/${viewport.name}`);
  await page.goto(pageUrl("regules-interactif/index.html"), { waitUntil: "load" });
  check(await page.locator(".module-card").count() === 10, `carte/${viewport.name} — 10 cartes attendues`);
  check(await page.locator(".rail-group").count() === 2, `carte/${viewport.name} — 2 familles attendues`);
  const g = await geometry(page);
  check(!g.viewportOverflow, `carte/${viewport.name} — débordement global`);
  check(g.outside.length === 0, `carte/${viewport.name} — contrôle hors écran: ${JSON.stringify(g.outside)}`);
  if (viewport.name === "projection" || viewport.name === "petit-mobile") {
    fs.mkdirSync(screenshotRoot, { recursive: true });
    await page.screenshot({ path: path.join(screenshotRoot, `carte-${viewport.name}.png`), fullPage: false });
  }
  await context.close();
}

async function checkStation(browser, viewport, module, moduleIndex) {
  const label = `${module.id}/${viewport.name}`;
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  attachDiagnostics(page, label);
  await page.goto(pageUrl(`${module.id}/index.html`), { waitUntil: "load" });

  check(await page.locator(".station-tab").count() === 4, `${label} — 4 onglets attendus`);
  check(await page.locator("#lisib-bouton").count() === 1, `${label} — outil de lisibilité absent`);
  check((await page.title()).includes(module.title), `${label} — titre document incorrect`);

  for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex += 1) {
    await page.locator(`[data-screen="${lessonIndex}"]`).click();
    const lesson = module.lessons[lessonIndex];
    check((await page.locator("#lesson-card h2").textContent()).trim() === lesson.title, `${label}/écran-${lessonIndex + 1} — mauvais titre`);
    check(await page.locator(".visual-panel [role=img]").count() === 1, `${label}/écran-${lessonIndex + 1} — visuel accessible absent`);
    const roleLabel = await page.locator(".visual-panel [role=img]").getAttribute("aria-label");
    check(Boolean(roleLabel && roleLabel.trim()), `${label}/écran-${lessonIndex + 1} — description du visuel vide`);
    const g = await geometry(page);
    check(!g.viewportOverflow, `${label}/écran-${lessonIndex + 1} — débordement global`);
    check(!g.copyClipped, `${label}/écran-${lessonIndex + 1} — texte masqué: ${JSON.stringify(g.copySize)}`);
    check(!g.visualClipped, `${label}/écran-${lessonIndex + 1} — visuel masqué: ${JSON.stringify(g.visualSize)}`);
    check(g.outside.length === 0, `${label}/écran-${lessonIndex + 1} — contrôle hors écran: ${JSON.stringify(g.outside)}`);

    const sequence = page.locator(".sequence-next");
    if (await sequence.count()) {
      const before = await page.locator(".sequence-step.active").getAttribute("data-sequence-step");
      await page.waitForTimeout(180);
      const afterWait = await page.locator(".sequence-step.active").getAttribute("data-sequence-step");
      check(before === afterWait, `${label}/écran-${lessonIndex + 1} — séquence en autoplay`);
      await sequence.click();
      const afterClick = await page.locator(".sequence-step.active").getAttribute("data-sequence-step");
      check(before !== afterClick, `${label}/écran-${lessonIndex + 1} — séquence ne répond pas au clic`);
    }
    screenChecks += 1;
  }

  await page.locator(`[data-screen="${module.lessons.length}"]`).click();
  for (let questionIndex = 0; questionIndex < module.quiz.length; questionIndex += 1) {
    const correct = await page.evaluate((index) => window.REGULE_MODULE.quiz[index].correct, questionIndex);
    await page.locator(`[data-option="${correct}"]`).click();
    check(await page.locator(".quiz-option.correct .answer-word").count() === 1, `${label}/quiz-${questionIndex + 1} — mot CORRECT absent`);
    check((await page.locator("#quiz-feedback").textContent()).trim().length > 8, `${label}/quiz-${questionIndex + 1} — rétroaction absente`);
    await page.locator("#quiz-next").click();
    questionChecks += 1;
  }
  check((await page.locator(".score-medal").innerText()).replace(/\s+/g, "").startsWith("4/4"), `${label} — score final différent de 4/4`);
  const nextHref = await page.locator(".quiz-summary a.nav-button.primary").getAttribute("href");
  check(nextHref === module.nextUrl, `${label} — lien de station suivante incorrect: ${nextHref}`);
  if (viewport.name === "petit-mobile" && module.id === "pump-down-unique") {
    fs.mkdirSync(screenshotRoot, { recursive: true });
    await page.screenshot({ path: path.join(screenshotRoot, "quiz-final-petit-mobile.png"), fullPage: false });
  }
  screenChecks += 1;

  if (moduleIndex === 0) {
    await page.locator('[data-screen="0"]').click();
    await page.locator("#lesson-card").focus();
    await page.keyboard.press("ArrowRight");
    check(await page.locator('[data-screen="1"].active').count() === 1, `${label} — navigation clavier droite inactive`);
    await page.keyboard.press("ArrowLeft");
    check(await page.locator('[data-screen="0"].active').count() === 1, `${label} — navigation clavier gauche inactive`);

    await page.locator("#sources-button").click();
    check(await page.locator("#sources-dialog[open]").count() === 1, `${label} — dialogue sources ne s’ouvre pas`);
    check(await page.locator(".source-item").count() >= 1, `${label} — provenance absente`);
    await page.locator("#close-sources").click();
  }

  if (viewport.name === "petit-mobile" && moduleIndex === 0) {
    await page.locator("#lisib-bouton").click();
    await page.locator("#lisib-dys").check();
    check(await page.locator("html.police-dys").count() === 1, `${label} — mode DYS non activé`);
  }

  if ((viewport.name === "projection" && module.id === "pump-down-automatique") ||
      (viewport.name === "petit-mobile" && module.id === "degivrage-electrique") ||
      (viewport.name === "tablette" && module.id === "degivrage-gaz-chauds")) {
    await page.locator('[data-screen="0"]').click();
    fs.mkdirSync(screenshotRoot, { recursive: true });
    await page.screenshot({ path: path.join(screenshotRoot, `${module.id}-${viewport.name}.png`), fullPage: false });
  }

  await page.emulateMedia({ media: "print" });
  check(await page.locator(".bottombar").evaluate((node) => getComputedStyle(node).display === "none"), `${label} — barre visible à l’impression`);
  check(await page.locator("#lisib-bouton").evaluate((node) => getComputedStyle(node).display === "none"), `${label} — lisibilité visible à l’impression`);

  await context.close();
}

async function checkVoice(browser) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__speechCalls = { speak: 0, cancel: 0, text: "" };
    class MockUtterance {
      constructor(text) { this.text = text; this.lang = ""; this.rate = 1; }
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockUtterance });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [{ lang: "fr-FR", name: "Voix locale" }],
        speak: (utterance) => { window.__speechCalls.speak += 1; window.__speechCalls.text = utterance.text; },
        cancel: () => { window.__speechCalls.cancel += 1; }
      }
    });
  });
  attachDiagnostics(page, "voix");
  await page.goto(pageUrl("commande-directe-thermostat/index.html"), { waitUntil: "load" });
  let calls = await page.evaluate(() => window.__speechCalls);
  check(calls.speak === 0, "voix — autoplay détecté");
  await page.locator("#voice-button").click();
  calls = await page.evaluate(() => window.__speechCalls);
  check(calls.speak === 1, "voix — clic sans lecture");
  check(calls.text.includes("Le thermostat commande le compresseur"), "voix — texte visible non repris");
  await page.locator("#stop-voice").click();
  calls = await page.evaluate(() => window.__speechCalls);
  check(calls.cancel >= 2, "voix — arrêt utilisateur non transmis");
  await context.close();
}

const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe"
];
const executablePath = edgeCandidates.find((candidate) => fs.existsSync(candidate));
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });

try {
  for (const viewport of viewports) {
    await checkHub(browser, viewport);
    for (let index = 0; index < catalog.modules.length; index += 1) {
      await checkStation(browser, viewport, catalog.modules[index], index);
    }
  }
  await checkVoice(browser);
} finally {
  await browser.close();
}

check(catalog.modules.length === 10, "catalogue — 10 stations attendues");
check(catalog.modules.reduce((sum, module) => sum + module.lessons.length, 0) === 30, "catalogue — 30 écrans de cours attendus");
check(catalog.modules.reduce((sum, module) => sum + module.quiz.length, 0) === 40, "catalogue — 40 questions attendues");
check(remoteRequests === 0, `réseau — ${remoteRequests} appel(s) distant(s)`);

if (failures.length) {
  console.error(`QA ÉCHEC — ${failures.length} anomalie(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`QA OK — 10 stations · 30 écrans de cours · 10 quiz · 40 questions`);
  console.log(`Contrôles rendus — ${screenChecks} écrans · ${questionChecks} réponses · 4 formats · hors ligne · clavier · voix · impression`);
  console.log(`Captures — ${screenshotRoot}`);
}
