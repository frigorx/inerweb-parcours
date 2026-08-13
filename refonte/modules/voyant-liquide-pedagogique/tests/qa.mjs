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
  await page.locator("#compare-variants").click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Voyant simple")) failures.push(`${viewport.name}: comparaison des variantes absente`);

  await page.locator('[data-step="1"]').click();
  if ((await page.locator('img.line-reference').count()) !== 1) failures.push(`${viewport.name}: image du montage horizontal absente`);
  await page.locator('[data-place="correct"]').click();
  if (!((await page.locator('[data-place="correct"]').getAttribute("class")) || "").includes("correct")) failures.push(`${viewport.name}: placement non validé`);

  await page.locator('[data-step="2"]').click();
  await page.locator('[data-variant="indicator"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Deux lectures")) failures.push(`${viewport.name}: double lecture absente`);

  await page.locator('[data-step="4"]').click();
  await page.locator('[data-flow="bubbles"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("gaz")) failures.push(`${viewport.name}: bulles non expliquées`);

  await page.locator('[data-step="5"]').click();
  await page.locator('[data-claim="local"]').click();
  if (!((await page.locator('[data-claim="local"]').getAttribute("class")) || "").includes("correct")) failures.push(`${viewport.name}: conclusion locale non validée`);

  await page.locator('[data-step="6"]').click();
  await page.locator('[data-cause="restriction"]').click();
  if ((await page.locator('img.restriction-reference').count()) !== 1) failures.push(`${viewport.name}: image du filtre colmaté absente`);
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Filtre à contrôler")) failures.push(`${viewport.name}: contrôle du filtre absent`);

  await page.locator('[data-step="7"]').click();
  await page.locator('[data-moisture="wet"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("HUMIDE")) failures.push(`${viewport.name}: état humide absent`);

  await page.locator('[data-step="8"]').click();
  if (!((await page.locator("#lesson-detail").textContent()) || "").includes("démarrage")) failures.push(`${viewport.name}: stabilisation de la pastille absente`);

  await page.locator('[data-step="9"]').click();
  await page.locator('[data-simple="flow"]').click();
  if (!((await page.locator('[data-simple="flow"]').getAttribute("class")) || "").includes("correct")) failures.push(`${viewport.name}: limite du voyant simple non validée`);

  await page.locator('[data-step="11"]').click();
  if ((await page.locator('img.connection-reference').count()) !== 1) failures.push(`${viewport.name}: image des raccordements absente`);
  if (!((await page.locator("#lesson-detail").textContent()) || "").includes("5 %")) failures.push(`${viewport.name}: valeur Danfoss lisible absente`);
  await page.locator('[data-phase="braze"]').click();
  if (!((await page.locator(".installation-card").textContent()) || "").includes("azote")) failures.push(`${viewport.name}: précaution de brasage absente`);
  if (!((await page.locator(".installation-card").textContent()) || "").includes("5 %")) failures.push(`${viewport.name}: exemple de brasure Danfoss absent`);

  await page.locator('[data-step="12"]').click();
  if (!((await page.locator("#lesson-detail").textContent()) || "").includes("déchet dangereux")) failures.push(`${viewport.name}: sécurité chimique lisible absente`);
  await page.locator('[data-decision="secure"]').click();
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("Avant toute ouverture")) failures.push(`${viewport.name}: mise en sécurité absente`);
  if (!((await page.locator("#visual-readout").textContent()) || "").includes("dichlorure de cobalt")) failures.push(`${viewport.name}: danger de la pastille endommagée absent`);

  await page.locator('[data-step="13"]').click();
  for (const answer of [0, 1, 2, 0, 1, 1]) {
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

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QA OK — 14 étapes × ${viewports.length} formats, activités, quiz et mode hors ligne.`);
