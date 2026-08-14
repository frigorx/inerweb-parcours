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
  page.on("request", (request) => {
    if (/^https?:/i.test(request.url())) remoteRequests.push(request.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
    Storage.prototype.getItem = () => { throw new Error("stockage bloqué pour le test"); };
    Storage.prototype.setItem = () => { throw new Error("stockage bloqué pour le test"); };
  });
  await page.goto(targetUrl, { waitUntil: "load" });

  const visibleCourseText = (await page.locator("body").innerText()) || "";
  if (/\bEVR\b|Danfoss|032F\d+/i.test(visibleCourseText)) failures.push(`${viewport.name}: marque ou référence commerciale encore visible`);

  const stepCount = await page.locator(".step-button").count();
  if (stepCount !== 14) failures.push(`${viewport.name}: ${stepCount} étapes au lieu de 14`);
  if (!(await page.locator("#voice-button").isDisabled())) failures.push(`${viewport.name}: commande vocale active sans API vocale`);

  for (let step = 0; step < stepCount; step += 1) {
    await page.locator(`[data-step="${step}"]`).click();
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const boxes = [".app-shell", ".course-grid", ".lesson", ".lesson-copy", ".visual-card", ".visual-root", ".bottom-nav"]
        .map((selector) => {
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
      if (box.scrollWidth > box.clientWidth + 1 || box.scrollHeight > box.clientHeight + 1) {
        failures.push(`${viewport.name} étape ${step + 1}: ${box.selector} contenu tronqué ${JSON.stringify(box)}`);
      }
    }
  }

  await page.locator('[data-step="0"]').click();
  await page.locator('[data-assembly="complete"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Ensemble complet")) failures.push(`${viewport.name}: ensemble avec bobine absent`);

  await page.locator('[data-step="1"]').click();
  await page.locator("#locate-solenoid").click();
  if (!((await page.locator(".solenoid-location").getAttribute("class")) || "").includes("confirmed")) failures.push(`${viewport.name}: électrovanne non repérée`);

  await page.locator('[data-step="2"]').click();
  await page.locator('[data-command="on"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Ordre envoyé")) failures.push(`${viewport.name}: chaîne de commande inactive`);

  await page.locator('[data-step="3"]').click();
  if (await page.locator(".dv-body-cutaway").count() !== 1 || await page.locator(".dv-cavity").count() < 3) failures.push(`${viewport.name}: convention de coupe matière/cavités absente`);
  if (await page.locator(".section-legend").count() !== 1) failures.push(`${viewport.name}: légende de coupe absente`);
  await page.locator('[data-part="seat"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Obturateur et siège")) failures.push(`${viewport.name}: siège non expliqué`);

  await page.locator('[data-step="4"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("FERMÉE")) failures.push(`${viewport.name}: état NF hors tension absent`);

  await page.locator('[data-step="5"]').click();
  await page.locator('[data-power="on"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("OUVERTE")) failures.push(`${viewport.name}: ouverture directe absente`);
  if (await page.locator(".dv-body-section").count() !== 1 || await page.locator(".dv-flow").count() !== 1) failures.push(`${viewport.name}: coupe animée ou flux absent`);

  await page.locator('[data-step="6"]').click();
  await page.locator('[data-principle="assisted-closed"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("orifice d’équilibrage")) failures.push(`${viewport.name}: fermeture assistée absente`);
  await page.locator('[data-principle="assisted-open"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("différence de pression")) failures.push(`${viewport.name}: ouverture assistée absente`);

  await page.locator('[data-step="7"]').click();
  await page.locator('[data-normal="no"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Hors tension = OUVERTE")) failures.push(`${viewport.name}: fonction NO absente`);

  await page.locator('[data-step="8"]').click();
  await page.locator('[data-direction="reverse"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("à corriger")) failures.push(`${viewport.name}: inversion du sens non signalée`);

  await page.locator('[data-step="9"]').click();
  if (await page.locator(".coil-illustration").count() !== 1) failures.push(`${viewport.name}: illustration de bobine absente`);
  for (const key of ["voltage", "current", "compatibility"]) await page.locator(`[data-check="${key}"]`).click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Contrôle complet")) failures.push(`${viewport.name}: choix de bobine incomplet`);

  await page.locator('[data-step="10"]').click();
  await page.locator('[data-phase="braze"]').click();
  const installText = (await page.locator(".installation-card").textContent()) || "";
  if (!installText.includes("chiffon humide") || !installText.includes("membrane")) failures.push(`${viewport.name}: protection thermique explicite absente`);

  await page.locator('[data-step="11"]').click();
  await page.locator('[data-coil-state="removed"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Danger")) failures.push(`${viewport.name}: bobine déposée alimentée non signalée`);
  await page.locator('[data-coil-state="secured"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("consignée")) failures.push(`${viewport.name}: mise en sécurité bobine absente`);

  await page.locator('[data-step="12"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("copeau")) failures.push(`${viewport.name}: défaut par copeau absent`);
  if (await page.locator(".diag-chip").count() !== 1 || await page.locator(".diag-leak").count() !== 1) failures.push(`${viewport.name}: illustration de fuite interne absente`);
  await page.locator('[data-diagnosis="assisted"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("orifice obstrué")) failures.push(`${viewport.name}: défaut de commande assistée absent`);
  await page.locator('[data-diagnosis="coil"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("ordre électrique")) failures.push(`${viewport.name}: diagnostic bobine absent`);

  await page.locator('[data-step="13"]').click();
  for (const answer of [0, 1, 2, 1, 2, 0, 1]) {
    await page.locator(`[data-answer="${answer}"]`).click();
    await page.locator("#next-question").click();
  }
  if ((await page.locator(".quiz-score").textContent())?.trim() !== "7/7") failures.push(`${viewport.name}: score final incorrect`);
  if (await page.locator("#next-button").isDisabled()) failures.push(`${viewport.name}: reprise finale verrouillée`);

  await page.locator("#source-button").click();
  if (!(await page.locator("#sources-dialog").evaluate((element) => element.open))) failures.push(`${viewport.name}: dialogue Sources fermé`);
  await page.locator(".close-button").click();

  await page.locator('[data-step="0"]').click();
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press("ArrowRight");
  if ((await page.locator("#lesson-kicker").textContent())?.includes("Écran 2") !== true) failures.push(`${viewport.name}: navigation clavier droite absente`);
  await page.keyboard.press("ArrowLeft");
  if ((await page.locator("#lesson-kicker").textContent())?.includes("Écran 1") !== true) failures.push(`${viewport.name}: navigation clavier gauche absente`);

  if (remoteRequests.length) failures.push(`${viewport.name}: requêtes distantes ${remoteRequests.join(", ")}`);
  if (errors.length) failures.push(`${viewport.name}: ${errors.join(" | ")}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QA OK — 14 étapes × ${viewports.length} formats, activités, quiz, clavier, voix absente, stockage bloqué et mode hors ligne.`);
