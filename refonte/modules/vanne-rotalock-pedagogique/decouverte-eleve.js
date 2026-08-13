"use strict";

const slides = [
  ["01-voici-la-vanne", "Voici la vanne de service : tuyauterie, raccord Rotalock vers le compresseur et capuchon de tige.", "Je reconnais les trois côtés de la vanne."],
  ["02-deux-prises", "Deux raccordements : la voie de service P reçoit le flexible du manifold ; P1 reçoit le pressostat et se trouve plus loin du carré.", "P est la voie de service. P1 est la prise du pressostat."],
  ["03-clapet-mobile", "En tournant le carré, la tige et son pointeau avancent ou reculent dans le corps de vanne.", "Le carré fait glisser le pointeau."],
  ["04-position-arriere", "Fermée sur l’arrière : la grande cavité bleue relie T, C et P1. Le pointeau touche le siège arrière et isole la voie de service P, représentée en gris hachuré.", "Arrière : T-C ouverte, P isolée, P1 reliée à C."],
  ["05-position-intermediaire", "En position intermédiaire, toute la cavité est bleue : T, C, P et P1 communiquent autour du pointeau.", "Milieu : les quatre passages communiquent."],
  ["06-position-avant", "Fermée sur l’avant : le pointeau touche le siège avant. T est grise et isolée ; la cavité bleue relie C aux prises P et P1.", "Avant : T isolée, C relié à P et P1."],
  ["07-danger-p1", "P1 reste reliée au compresseur dans toutes les positions. Ne jamais défaire son bouchon sur une installation chargée.", "P1 peut toujours être sous pression."],
  ["08-sens-bp", "En basse pression, le fluide traverse la vanne de T vers C : le compresseur aspire.", "BP : tuyauterie vers compresseur, T vers C."],
  ["09-sens-hp", "En haute pression, le fluide traverse la vanne de C vers T : le compresseur refoule.", "HP : compresseur vers tuyauterie, C vers T."],
  ["10-raccordements", "Le flexible de service se branche sur P. Le pressostat se branche sur P1.", "Chaque raccord à sa place : flexible sur P, pressostat sur P1."]
];

const image = document.querySelector("#planche");
const takeaway = document.querySelector("#takeaway");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
let current = 0;

function render(index, focusImage = false) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  const [file, alt, summary] = slides[current];
  image.src = `images/simples/png/${file}.png`;
  image.alt = alt;
  takeaway.textContent = summary;
  previous.disabled = current === 0;
  next.textContent = current === slides.length - 1 ? "Recommencer ↺" : "Continuer →";
  progressLabel.textContent = `Image ${current + 1} sur ${slides.length}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  document.title = `${current + 1}/${slides.length} · Vanne de service Rotalock`;
  if (focusImage) image.focus({ preventScroll: true });
}

previous.addEventListener("click", () => render(current - 1));
next.addEventListener("click", () => render(current === slides.length - 1 ? 0 : current + 1));

document.addEventListener("keydown", (event) => {
  if (event.target.closest("button, a, input, select, textarea")) return;
  if (event.key === "ArrowRight" || event.key === "PageDown") render(current + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") render(current - 1);
  if (event.key === "Home") render(0);
  if (event.key === "End") render(slides.length - 1);
});

render(0);
