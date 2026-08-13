import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:8765/";

const viewports = [
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x640", width: 360, height: 640 }
];

const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const stepCount = await page.locator(".step-button").count();
  if (stepCount !== 15) failures.push(`${viewport.name}: ${stepCount} étapes au lieu de 15`);

  for (let step = 0; step < stepCount; step += 1) {
    await page.locator(`.step-button[data-step="${step}"]`).click();
    await page.waitForTimeout(35);
    const brokenImages = await page.locator("img").evaluateAll((images) => images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")));
    if (brokenImages.length) {
      failures.push(`${viewport.name} étape ${step + 1}: images non chargées ${brokenImages.join(", ")}`);
    }
    const metrics = await page.evaluate(() => {
      const box = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          selector,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          clientWidth: element.clientWidth,
          clientHeight: element.clientHeight,
          scrollWidth: element.scrollWidth,
          scrollHeight: element.scrollHeight
        };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight
        },
        boxes: [
          box(".app-shell"),
          box(".course-grid"),
          box(".lesson"),
          box(".lesson-copy"),
          box(".visual-card"),
          box(".visual-root"),
          box(".bottom-nav")
        ].filter(Boolean)
      };
    });

    if (metrics.document.scrollWidth > metrics.document.clientWidth + 1 || metrics.document.scrollHeight > metrics.document.clientHeight + 1) {
      failures.push(`${viewport.name} étape ${step + 1}: document déborde ${JSON.stringify(metrics.document)}`);
    }

    for (const item of metrics.boxes) {
      if (item.left < -1 || item.top < -1 || item.right > metrics.viewport.width + 1 || item.bottom > metrics.viewport.height + 1) {
        failures.push(`${viewport.name} étape ${step + 1}: ${item.selector} hors écran ${JSON.stringify(item)}`);
      }
    }
  }

  await page.locator('.step-button[data-step="0"]').click();
  await page.locator("#reveal-arrow").click();
  if (!(await page.locator("#arrow-callout").evaluate((element) => element.classList.contains("visible")))) {
    failures.push(`${viewport.name}: la flèche ne se révèle pas`);
  }

  await page.locator('.step-button[data-step="2"]').click();
  await page.locator('[data-placement-view="line"]').click();
  await page.locator('[data-place="before-sight"]').click();
  if (!(await page.locator('[data-place="before-sight"]').evaluate((element) => element.classList.contains("correct")))) {
    failures.push(`${viewport.name}: le placement correct n’est pas validé`);
  }

  await page.locator('.step-button[data-step="3"]').click();
  for (const view of ["humidity", "nitrogen", "filter"]) {
    await page.locator(`[data-function-view="${view}"]`).click();
    if (!(await page.locator(`[data-function-view="${view}"]`).evaluate((element) => element.classList.contains("active")))) {
      failures.push(`${viewport.name}: la vue fonction ${view} ne s’active pas`);
    }
  }

  await page.locator('.step-button[data-step="4"]').click();
  await page.locator('[data-component="core"]').click();
  if (!((await page.locator("#component-readout").textContent()) || "").includes("Noyau dessiccant")) {
    failures.push(`${viewport.name}: la légende du noyau n’est pas reliée à la coupe`);
  }

  await page.locator('.step-button[data-step="6"]').click();
  await page.locator("#run-filtration").click();
  if (!(await page.locator("#flow-lab").evaluate((element) => element.classList.contains("running")))) {
    failures.push(`${viewport.name}: l’animation de filtration ne démarre pas`);
  }

  await page.locator('.step-button[data-step="10"]').click();
  await page.locator('[data-cartridge-view="symbols"]').click();
  if (await page.locator(".symbol-card").count() !== 2) {
    failures.push(`${viewport.name}: les deux symboles de filtre ne sont pas comparés`);
  }
  await page.locator('[data-cartridge-view="open"]').click();
  await page.waitForTimeout(30);
  if (!(await page.locator("#cartridge-lab").evaluate((element) => element.classList.contains("open")))) {
    failures.push(`${viewport.name}: l’enveloppe à cartouche ne s’ouvre pas`);
  }

  await page.locator('.step-button[data-step="12"]').click();
  await page.locator('[data-flow="reverse"]').click();
  if (!(await page.locator("#biflow-lab").evaluate((element) => element.classList.contains("reverse")))) {
    failures.push(`${viewport.name}: le sens bi-flow ne s’inverse pas`);
  }


  await page.locator('.step-button[data-step="13"]').click();
  await page.locator('[data-burnout-view="protect"]').click();
  if (!(await page.locator('[data-burnout-view="protect"]').evaluate((element) => element.classList.contains("active")))) {
    failures.push(`${viewport.name}: la protection burn-out ne s’affiche pas`);
  }

  await page.locator('.step-button[data-step="14"]').click();
  for (const correctAnswer of [1, 1, 1, 0, 2, 1]) {
    await page.locator(`[data-answer="${correctAnswer}"]`).click();
    await page.locator("#next-question").click();
  }
  if ((await page.locator(".quiz-score").textContent())?.trim() !== "6/6") {
    failures.push(`${viewport.name}: le défi complet ne produit pas le score 6/6`);
  }
  if (await page.locator("#next-button").isDisabled()) {
    failures.push(`${viewport.name}: la fin du défi ne déverrouille pas la reprise`);
  }
  await page.locator("#restart-quiz").click();

  await page.locator("#source-button").click();
  if (!(await page.locator("#sources-dialog").evaluate((element) => element.open))) {
    failures.push(`${viewport.name}: le dialogue des sources ne s’ouvre pas`);
  }
  await page.locator(".close-button").click();

  if (errors.length) failures.push(`${viewport.name}: ${errors.join(" | ")}`);

  for (const step of [0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14]) {
    await page.locator(`.step-button[data-step="${step}"]`).click();
    await page.waitForTimeout(60);
    await page.screenshot({
      path: path.join(projectRoot, "qa", `${viewport.name}-etape-${String(step + 1).padStart(2, "0")}.png`),
      fullPage: false
    });

    if (step === 3) {
      await page.locator('[data-function-view="nitrogen"]').click();
      await page.screenshot({ path: path.join(projectRoot, "qa", `${viewport.name}-etape-04-azote.png`), fullPage: false });
    }
    if (step === 13) {
      await page.locator('[data-burnout-view="protect"]').click();
      await page.screenshot({ path: path.join(projectRoot, "qa", `${viewport.name}-etape-14-protection.png`), fullPage: false });
    }
  }

  await page.close();
}

const offlinePage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
const offlineErrors = [];
offlinePage.on("pageerror", (error) => offlineErrors.push(`pageerror: ${error.message}`));
offlinePage.on("console", (message) => {
  if (message.type() === "error") offlineErrors.push(`console: ${message.text()}`);
});

await offlinePage.goto(pathToFileURL(path.join(projectRoot, "index.html")).href, { waitUntil: "load" });
if ((await offlinePage.locator(".step-button").count()) !== 15) {
  failures.push("hors connexion : les 15 étapes ne sont pas chargées");
}
const unloadedImages = await offlinePage.locator("img").evaluateAll((images) =>
  images
    .filter((element) => !element.complete || element.naturalWidth === 0)
    .map((element) => element.getAttribute("src"))
);
if (unloadedImages.length) {
  failures.push(`hors connexion : images non chargées ${unloadedImages.join(", ")}`);
}
if (offlineErrors.length) failures.push(`hors connexion : ${offlineErrors.join(" | ")}`);

await offlinePage.emulateMedia({ media: "print" });
await offlinePage.screenshot({
  path: path.join(projectRoot, "qa", "impression-etape-01.png"),
  fullPage: true
});
await offlinePage.close();

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("QA OK — 15 étapes × 4 formats, aucun débordement de page ni erreur JavaScript.");
