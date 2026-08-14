import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const targetUrl = pathToFileURL(path.join(projectRoot, "index.html")).href;
const viewports = [
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x640", width: 360, height: 640 }
];

const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const remoteRequests = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("request", (request) => { if (/^https?:/i.test(request.url())) remoteRequests.push(request.url()); });
  await page.goto(targetUrl, { waitUntil: "load" });

  const stepCount = await page.locator(".step-button").count();
  if (stepCount !== 14) failures.push(`${viewport.name}: ${stepCount} étapes au lieu de 14`);

  for (let step = 0; step < stepCount; step += 1) {
    await page.locator(`[data-step="${step}"]`).click();
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const boxes = [".app-shell", ".course-grid", ".lesson", ".lesson-copy", ".visual-card", ".visual-root", ".bottom-nav"]
        .map((selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { selector, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
        }).filter(Boolean);
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, scrollHeight: root.scrollHeight, clientHeight: root.clientHeight },
        boxes
      };
    });
    if (metrics.document.scrollWidth > metrics.document.clientWidth + 1 || metrics.document.scrollHeight > metrics.document.clientHeight + 1) {
      failures.push(`${viewport.name} étape ${step + 1}: document déborde ${JSON.stringify(metrics.document)}`);
    }
    for (const box of metrics.boxes) {
      if (box.left < -1 || box.top < -1 || box.right > metrics.viewport.width + 1 || box.bottom > metrics.viewport.height + 1) {
        failures.push(`${viewport.name} étape ${step + 1}: ${box.selector} hors écran ${JSON.stringify(box)}`);
      }
    }
  }

  await page.locator('[data-step="0"]').click();
  await page.locator('[data-place="valve"]').click();
  if (!((await page.locator('[data-place="valve"]').getAttribute("class")) || "").includes("correct")) failures.push(`${viewport.name}: emplacement du détendeur non validé`);

  await page.locator('[data-step="1"]').click();
  if (!((await page.locator("#lesson-detail").textContent()) || "").includes("Train thermostatique")) failures.push(`${viewport.name}: train thermostatique non défini`);
  await page.locator('[data-view="flow"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("liquide HP entre par le bas")) failures.push(`${viewport.name}: raccordement du détendeur absent`);

  await page.locator('[data-step="2"]').click();
  await page.locator('[data-part="orifice"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("passage réglable")) failures.push(`${viewport.name}: buse non expliquée`);

  await page.locator('[data-step="3"]').click();
  await page.locator('[data-opening="modulating"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("débit massique se conserve")) failures.push(`${viewport.name}: conservation du débit massique absente`);

  await page.locator('[data-step="4"]').click();
  await page.locator("#tube-temperature").fill("7");
  await page.locator("#sat-temperature").fill("2");
  if ((await page.locator("#superheat-output").textContent())?.trim() !== "5 K") failures.push(`${viewport.name}: calcul de surchauffe incorrect`);

  await page.locator('[data-step="5"]').click();
  if ((await page.locator(".force-chain").count()) !== 1) failures.push(`${viewport.name}: chaîne cinématique absente`);
  await page.locator('[data-force="bulb"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("passage augmente")) failures.push(`${viewport.name}: action d’ouverture du bulbe absente`);
  await page.locator('[data-force="spring"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("passage diminue")) failures.push(`${viewport.name}: action de fermeture du ressort absente`);

  await page.locator('[data-step="6"]').click();
  if ((await page.locator(".approved-valve").count()) !== 1) failures.push(`${viewport.name}: boucle vectorielle absente`);
  await page.locator('[data-regulation="cold"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("débit diminue")) failures.push(`${viewport.name}: état froid absent`);
  await page.locator("#replay-regulation").click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("La boucle repart")) failures.push(`${viewport.name}: rejeu de la boucle absent`);

  await page.locator('[data-step="7"]').click();
  await page.locator('[data-bulb="loose"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("contact lâche")) failures.push(`${viewport.name}: pose du bulbe non corrigée`);

  await page.locator('[data-step="8"]').click();
  await page.locator('[data-equal="external"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("sans la supprimer")) failures.push(`${viewport.name}: limite de l’égalisation externe absente`);
  if ((await page.locator(".equal-pressure.external").count()) !== 1) failures.push(`${viewport.name}: conduite d’égalisation externe absente`);

  await page.locator('[data-step="9"]').click();
  if (!((await page.locator("#lesson-detail").textContent()) || "").includes("0X")) failures.push(`${viewport.name}: série de buses T 2 / TE 2 absente`);
  await page.locator('[data-orifice="matched"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("capacité calculée")) failures.push(`${viewport.name}: sélection de buse absente`);

  await page.locator('[data-step="10"]').click();
  await page.locator('[data-adjust="adjust"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("quatrième étape")) failures.push(`${viewport.name}: méthode de réglage absente`);

  await page.locator('[data-step="11"]').click();
  await page.locator('[data-install="braze"]').click();
  if (!((await page.locator(".installation-card").textContent()) || "").includes("15 %")) failures.push(`${viewport.name}: exemple de brasage absent`);

  await page.locator('[data-step="12"]').click();
  await page.locator('[data-case="flooding"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("retour liquide")) failures.push(`${viewport.name}: risque de retour liquide absent`);

  await page.locator('[data-step="13"]').click();
  for (const answer of [2, 1, 1, 0, 0, 0]) {
    await page.locator(`[data-answer="${answer}"]`).click();
    await page.locator("#next-question").click();
  }
  if ((await page.locator(".quiz-score").textContent())?.trim() !== "6/6") failures.push(`${viewport.name}: score final incorrect`);
  if (await page.locator("#next-button").isDisabled()) failures.push(`${viewport.name}: reprise finale verrouillée`);

  await page.locator("#source-button").click();
  if (!(await page.locator("#sources-dialog").evaluate((element) => element.open))) failures.push(`${viewport.name}: dialogue Sources fermé`);
  await page.locator(".close-button").click();
  if (remoteRequests.length) failures.push(`${viewport.name}: requêtes distantes ${remoteRequests.join(", ")}`);
  if (errors.length) failures.push(`${viewport.name}: ${errors.join(" | ")}`);
  await page.close();
}

const degradedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await degradedContext.addInitScript(() => {
  Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("stockage bloqué pour le test"); } });
  Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
});
const degradedPage = await degradedContext.newPage();
const degradedErrors = [];
degradedPage.on("pageerror", (error) => degradedErrors.push(error.message));
await degradedPage.goto(targetUrl, { waitUntil: "load" });
if ((await degradedPage.locator(".step-button").count()) !== 14) failures.push("mode dégradé: parcours indisponible");
if (!(await degradedPage.locator("#voice-button").isDisabled())) failures.push("mode dégradé: bouton vocal non désactivé");
if (degradedErrors.length) failures.push(`mode dégradé: ${degradedErrors.join(" | ")}`);
await degradedContext.close();

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QA OK — 14 étapes × ${viewports.length} formats, activités, quiz, hors ligne et mode dégradé.`);
