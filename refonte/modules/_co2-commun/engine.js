(function () {
  "use strict";

  var moduleData = window.CO2_MODULE;
  if (!moduleData) throw new Error("Données du module CO₂ absentes.");

  var state = {
    phase: "lesson",
    lesson: 0,
    quiz: 0,
    score: 0,
    answered: false,
    answers: [],
    done: new Set(),
    speechRun: 0,
    speaking: false,
    paused: false
  };

  var ui = {
    title: document.getElementById("module-title"),
    subtitle: document.getElementById("module-subtitle"),
    stations: document.getElementById("stations"),
    lessonCard: document.getElementById("lesson-card"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    status: document.getElementById("module-status"),
    voice: document.getElementById("voice-button"),
    stopVoice: document.getElementById("stop-voice"),
    rate: document.getElementById("voice-rate"),
    sources: document.getElementById("sources-button"),
    dialog: document.getElementById("sources-dialog"),
    dialogBody: document.getElementById("sources-body"),
    dialogClose: document.getElementById("sources-close"),
    live: document.getElementById("live-status"),
    lineHome: document.querySelector(".brand")
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function inline(text) {
    var value = esc(text);
    value = value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    value = value.replace(/\[\[(.+?)\|(.+?)\]\]/g, function (_, word, definition) {
      return '<abbr title="' + definition + '">' + word + "</abbr>";
    });
    return value;
  }

  function svg(label, body, viewBox) {
    return '<svg viewBox="' + (viewBox || "0 0 720 390") + '" role="img" aria-label="' + esc(label) + '">' +
      "<title>" + esc(label) + "</title>" + body + "</svg>";
  }

  function defs() {
    return '<defs><marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#1b3a63"/></marker>' +
      '<marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c9451a"/></marker></defs>';
  }

  function card(x, y, w, h, title, sub, cls) {
    return '<g><rect class="' + (cls || "component") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14"/>' +
      '<text class="svg-label" x="' + (x + w / 2) + '" y="' + (y + h / 2 - (sub ? 8 : -4)) + '" text-anchor="middle">' + esc(title) + "</text>" +
      (sub ? '<text class="svg-small" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 16) + '" text-anchor="middle">' + esc(sub) + "</text>" : "") + "</g>";
  }

  function wrapLines(lines, x, y, anchor, cls, gap) {
    return lines.map(function (line, index) {
      return '<text class="' + (cls || "svg-small") + '" x="' + x + '" y="' + (y + index * (gap || 16)) + '" text-anchor="' + (anchor || "middle") + '">' + esc(line) + "</text>";
    }).join("");
  }

  function circuitBase(mode) {
    var topName = mode === "transcritical" ? "REFROIDISSEUR DE GAZ" : "CONDENSEUR";
    var topSub = mode === "transcritical" ? "refroidissement sensible en HP" : "condensation sous le point critique";
    var body = defs() + '<defs><pattern id="circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#3d7fca" stroke-opacity=".08"/></pattern></defs>';
    body += '<rect x="10" y="10" width="700" height="370" rx="20" class="plate-bg"/><rect x="10" y="10" width="700" height="370" rx="20" fill="url(#circuit-grid)"/>';
    body += '<path class="pipe" d="M175 92 H545 V296 H175 Z"/>';
    body += '<g class="machine-symbol"><path d="M548 139 h92 q20 0 20 20 v72 q0 20-20 20 h-92z"/><circle cx="590" cy="194" r="31"/><path d="M573 210 l18-44 18 44z"/><path d="M660 171h15v46h-15"/></g>';
    body += '<text class="svg-label" x="603" y="276" text-anchor="middle">COMPRESSEUR</text><text class="svg-small" x="603" y="292" text-anchor="middle">P et T augmentent</text>';
    body += '<g class="exchanger-symbol ' + (mode === "transcritical" ? "transcritical-hx" : "") + '"><rect x="250" y="35" width="230" height="92" rx="18"/><path d="M275 74 q18-30 36 0t36 0t36 0t36 0t36 0"/><path d="M275 93 q18-30 36 0t36 0t36 0t36 0t36 0"/></g>';
    body += '<text class="svg-label" x="365" y="24" text-anchor="middle">' + topName + '</text><text class="svg-small" x="365" y="119" text-anchor="middle">' + topSub + '</text>';
    body += '<g class="valve-symbol"><path d="M112 166 l43 28-43 28z M198 166 l-43 28 43 28z"/><circle cx="155" cy="194" r="8"/></g>';
    body += '<text class="svg-label" x="155" y="248" text-anchor="middle">' + (mode === "transcritical" ? "VANNE HP" : "DÉTENDEUR") + '</text><text class="svg-small" x="155" y="264" text-anchor="middle">chute de pression</text>';
    body += '<g class="evaporator-symbol"><rect x="250" y="282" width="230" height="74" rx="18"/><path d="M275 319 q18-26 36 0t36 0t36 0t36 0t36 0"/></g>';
    body += '<text class="svg-label" x="365" y="374" text-anchor="middle">ÉVAPORATEUR · absorbe la chaleur</text>';
    body += '<path class="hot-line flowing" d="M548 154 C505 115 468 92 438 92" marker-end="url(#arrow-orange)"/>';
    body += '<path class="cold-line flowing" d="M175 218 C190 265 235 295 276 296" marker-end="url(#arrow-blue)"/>';
    body += '<g class="state-pills"><text x="505" y="82">gaz HP</text><text x="494" y="320">vapeur BP</text><text x="188" y="111">liquide HP</text><text x="188" y="284">mélange BP</text></g>';
    return body;
  }

  function visualIdentity(v) {
    var body = '<defs><linearGradient id="identity-paper" x1="0" x2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#edf5fb"/></linearGradient></defs>' +
      '<rect x="10" y="10" width="700" height="370" rx="22" fill="url(#identity-paper)" stroke="#1b3a63" stroke-opacity=".15"/>' +
      '<image href="../_co2-commun/assets/molecule-co2-editoriale-v1.png" x="18" y="78" width="390" height="196" preserveAspectRatio="xMidYMid meet"/>' +
      '<text class="svg-title identity-title" x="42" y="54">UNE MOLÉCULE LINÉAIRE</text><text class="svg-small" x="43" y="72">O=C=O · dessin éditorial original</text>' +
      '<g class="identity-facts"><rect x="430" y="56" width="244" height="82" rx="16"/><text x="452" y="85">NOM FRIGORIFIQUE</text><text class="big" x="452" y="119">R744</text></g>' +
      '<g class="identity-facts"><rect x="430" y="153" width="244" height="82" rx="16"/><text x="452" y="182">IMPACT DIRECT DE RÉFÉRENCE</text><text class="big" x="452" y="216">PRP = 1</text></g>' +
      '<g class="identity-facts"><rect x="430" y="250" width="244" height="82" rx="16"/><text x="452" y="279">SÉCURITÉ DU FLUIDE</text><text class="big" x="452" y="313">A1 · mais HP</text></g>' +
      '<text class="svg-label" x="360" y="360" text-anchor="middle">La classe A1 ne décrit ni la pression, ni l’architecture, ni l’autorisation d’intervenir.</text>';
    return svg(v.label, body);
  }

  function visualBenefits(v) {
    var body = '<text class="svg-title" x="360" y="45" text-anchor="middle">Trois raisons, une décision d’ingénierie</text>' +
      card(35, 85, 200, 220, "CLIMAT", "PRP = 1 · ODP = 0", "good-shape") +
      card(260, 85, 200, 220, "APPLICATION", "froid commercial et industriel", "component") +
      card(485, 85, 200, 220, "CONCEPTION", "pressions et organes dédiés", "warn-shape") +
      '<text class="svg-label" x="360" y="350" text-anchor="middle">Le meilleur fluide est celui que l’installation sait employer correctement.</text>';
    return svg(v.label, body);
  }

  function visualTradeoffs(v) {
    var body = defs() + '<path d="M360 78 V320" stroke="#1b3a63" stroke-width="5"/><path d="M180 170 H540" stroke="#1b3a63" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M180 170 L120 265 H240 Z" fill="#e3f5ec" stroke="#1e7e54" stroke-width="3"/>' +
      '<path d="M540 170 L480 265 H600 Z" fill="#fff4e0" stroke="#b06a00" stroke-width="3" stroke-dasharray="8 5"/>' +
      '<circle cx="360" cy="170" r="18" fill="#ff6b35" stroke="#1b3a63" stroke-width="3"/>' +
      '<text class="svg-title" x="180" y="65" text-anchor="middle">ATOUTS</text>' +
      '<text class="svg-title" x="540" y="65" text-anchor="middle">CONTRAINTES</text>' +
      wrapLines(["faible impact direct", "forte capacité volumétrique", "chaleur récupérable"], 180, 110, "middle", "svg-small", 20) +
      wrapLines(["hautes pressions", "architecture spécifique", "régulation HP décisive"], 540, 110, "middle", "svg-small", 20) +
      '<text class="svg-label" x="360" y="355" text-anchor="middle">On compare l’application complète, jamais un seul avantage.</text>';
    return svg(v.label, body);
  }

  function visualPhase(v) {
    var body = '<defs><pattern id="phase-grid" width="42" height="38" patternUnits="userSpaceOnUse"><path d="M42 0H0V38" fill="none" stroke="#3d7fca" stroke-opacity=".11"/></pattern></defs>' +
      '<rect x="10" y="10" width="700" height="370" rx="20" class="plate-bg"/><rect x="82" y="42" width="576" height="286" fill="url(#phase-grid)"/>' +
      '<path class="phase-solid" d="M84 327V44H300L238 263L182 327Z" opacity=".55"/><path class="phase-liquid" d="M238 263L300 44H658V83C535 86 443 127 394 176Z" opacity=".55"/><path class="phase-vapour" d="M84 327H658V83C535 86 443 127 394 176L238 263L182 327Z" opacity=".55"/>' +
      '<path class="phase-super" d="M394 176C456 140 536 104 658 83V44H300L394 176Z" opacity=".45"/>' +
      '<path class="axis-strong" d="M84 328V37M84 328H671"/>' +
      '<path class="phase-boundary solid-gas" d="M103 324C145 309 188 288 238 263"/><path class="phase-boundary solid-liquid" d="M238 263C254 198 273 121 300 46"/><path class="phase-boundary liquid-gas" d="M238 263C281 221 331 194 394 176"/>' +
      '<path class="one-bar" d="M84 308H238"/><text class="svg-small" x="91" y="301">≈ 1 bar abs</text><text class="svg-code" x="127" y="324">−78,5 °C</text>' +
      '<circle class="critical-point" cx="394" cy="176" r="9"/><path class="callout" d="M401 169L457 112H575"/><text class="svg-code" x="468" y="103">POINT CRITIQUE</text><text class="svg-small" x="468" y="119">31,0 °C · 73,8 bar abs</text>' +
      '<circle class="triple-point" cx="238" cy="263" r="9"/><path class="callout" d="M231 270L190 288H142"/><text class="svg-code" x="283" y="262">POINT TRIPLE</text><text class="svg-small" x="283" y="278">−56,6 °C · 5,2 bar abs</text>' +
      '<text class="phase-name" x="142" y="145">SOLIDE</text><text class="phase-name" x="332" y="89">LIQUIDE</text><text class="phase-name" x="493" y="279">VAPEUR</text><text class="phase-name" x="512" y="68">SUPERCRITIQUE</text>' +
      '<text class="svg-small" x="42" y="194" transform="rotate(-90 42 194)" text-anchor="middle">pression absolue p ↑</text><text class="svg-small" x="400" y="365" text-anchor="middle">température T →</text><text class="diagram-note" x="649" y="350" text-anchor="end">SCHÉMA QUALITATIF · R744</text>';
    return svg(v.label, body);
  }

  function visualDryIce(v) {
    var body = defs() + card(40, 110, 160, 160, "VAPEUR", "pression sous le point triple", "component") +
      card(280, 110, 160, 160, "DÉTENTE RAPIDE", "température et pression chutent", "warn-shape") +
      card(520, 110, 160, 160, "SOLIDE", "glace carbonique possible", "bad-shape") +
      '<path d="M200 190 H275" class="pipe-thin flowing" marker-end="url(#arrow-blue)"/><path d="M440 190 H515" class="pipe-thin flowing" marker-end="url(#arrow-blue)"/>' +
      '<path d="M580 150 l12 22 25 3-18 18 5 25-24-12-23 12 5-25-18-18 25-3z" fill="#fff" stroke="#3d7fca" stroke-width="3"/>' +
      '<text class="svg-title" x="360" y="60" text-anchor="middle">Sous le point triple, pas de phase liquide stable</text>' +
      '<text class="svg-label" x="360" y="330" text-anchor="middle">Risque : brûlure par le froid et obstruction — procédure dédiée catégorie B.</text>';
    return svg(v.label, body);
  }

  function visualPressure(v) {
    var body = defs() + '<defs><linearGradient id="liquid-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#84b7ec"/><stop offset="1" stop-color="#3277bb"/></linearGradient></defs>' +
      '<rect x="10" y="10" width="700" height="370" rx="20" class="plate-bg"/>' +
      '<g class="heat-source"><circle cx="102" cy="95" r="27"/><path d="M102 49V32M102 158v-17M56 95H39M165 95h-17M70 63L57 50M147 140l-13-13M70 127l-13 13M147 50l-13 13"/></g>' +
      '<text class="svg-label" x="101" y="190" text-anchor="middle">apport de chaleur</text><text class="svg-small" x="101" y="207" text-anchor="middle">même à l’arrêt</text>' +
      '<path class="heat-wave" d="M142 85C192 58 199 125 247 96M142 118C190 96 202 157 247 130" marker-end="url(#arrow-orange)"/>' +
      '<g class="pressure-vessel"><path d="M285 68h150q28 0 28 28v190q0 28-28 28H285q-28 0-28-28V96q0-28 28-28z"/><path class="vessel-liquid" d="M270 205C307 190 332 221 367 201C398 184 421 206 450 190V287Q450 300 435 300H285Q270 300 270 287Z"/><path d="M360 68V45h70"/></g>' +
      '<g class="gauge"><circle cx="360" cy="130" r="45"/><path d="M360 130L395 103"/><text x="360" y="155" text-anchor="middle">P ↑</text></g>' +
      '<g class="relief"><path d="M430 45h62v-18h35v55"/><path d="M512 82l15 25 15-25z"/></g><text class="svg-small" x="531" y="124" text-anchor="middle">soupape vers</text><text class="svg-small" x="531" y="138" text-anchor="middle">rejet prévu</text>' +
      '<g class="causal-chain"><rect x="52" y="304" width="176" height="50" rx="12"/><rect x="272" y="304" width="176" height="50" rx="12"/><rect x="492" y="304" width="176" height="50" rx="12"/><text x="140" y="326" text-anchor="middle">1 · T augmente</text><text x="140" y="343" text-anchor="middle">dans un volume isolé</text><text x="360" y="326" text-anchor="middle">2 · le liquide se dilate</text><text x="360" y="343" text-anchor="middle">et occupe le volume libre</text><text x="580" y="326" text-anchor="middle">3 · P peut grimper</text><text x="580" y="343" text-anchor="middle">très rapidement</text><path d="M228 329h39M448 329h39" marker-end="url(#arrow-orange)"/></g>' +
      '<text class="diagram-note" x="674" y="28" text-anchor="end">ARRÊT ≠ ABSENCE DE RISQUE</text>';
    return svg(v.label, body);
  }

  function visualSafety(v) {
    var body = defs() + '<rect x="10" y="10" width="700" height="370" rx="20" class="plate-bg"/>' +
      '<path class="room-shell" d="M85 73H565V292H85Z"/><path class="door" d="M565 212h55v80h-55M565 212q55 3 55 55"/>' +
      '<g class="rack-symbol"><rect x="237" y="122" width="180" height="105" rx="12"/><path d="M260 201v-50h37v50M318 201v-50h37v50M376 201v-50h20v50"/><circle cx="279" cy="174" r="11"/><circle cx="337" cy="174" r="11"/></g><text class="svg-small" x="327" y="244" text-anchor="middle">centrale R744</text>' +
      '<g class="gas-cloud"><circle cx="176" cy="252" r="34"/><circle cx="221" cy="260" r="42"/><circle cx="266" cy="254" r="29"/></g><text class="svg-code" x="216" y="262" text-anchor="middle">CO₂</text>' +
      '<g class="sensor"><rect x="116" y="225" width="38" height="48" rx="7"/><circle cx="135" cy="239" r="5"/><path d="M124 254h22M124 262h22"/></g><text class="svg-small" x="135" y="287" text-anchor="middle">détecteur</text>' +
      '<g class="alarm"><path d="M587 86h52l-8 36h-36z"/><path d="M576 103h-18M650 103h18M587 76l-12-12M640 76l12-12"/></g><text class="svg-small" x="613" y="141" text-anchor="middle">alarme dehors</text>' +
      '<g class="vent"><rect x="438" y="47" width="82" height="52" rx="8"/><circle cx="479" cy="73" r="19"/><path d="M479 54c15 8 12 22 0 19M498 73c-8 15-22 12-19 0M479 92c-15-8-12-22 0-19M460 73c8-15 22-12 19 0"/></g><path class="air-arrow" d="M480 47V26" marker-end="url(#arrow-blue)"/><text class="svg-small" x="479" y="20" text-anchor="middle">ventilation prévue</text>' +
      '<path class="escape-route" d="M377 270H603" marker-end="url(#arrow-orange)"/><text class="svg-label" x="485" y="286" text-anchor="middle">sortir · interdire l’accès · alerter</text>' +
      '<g class="barrier-strip"><rect x="70" y="326" width="580" height="38" rx="12"/><text x="360" y="350" text-anchor="middle">DÉTECTER  →  ALERTER  →  ÉVACUER  →  SÉCURISER</text></g>' +
      '<text class="diagram-note" x="109" y="54">PLAN PÉDAGOGIQUE DU LOCAL</text>';
    return svg(v.label, body);
  }

  function visualSubcritical(v) {
    var body = circuitBase("subcritical") + '<text class="svg-title" x="360" y="205" text-anchor="middle">Cycle sous le point critique</text>' +
      '<text class="svg-label" x="360" y="232" text-anchor="middle">La haute pression rejette la chaleur par condensation.</text>';
    return svg(v.label, body);
  }

  function visualLogph(v) {
    var focusLabels = { axes: "1 · LIRE LES AXES", zones: "2 · REPÉRER LA CLOCHE ET LES ZONES", cycle: "3 · POSER LE CYCLE" };
    var focus = v.focus || "cycle";
    var focusLabel = focusLabels[focus] || focusLabels.cycle;
    var zoneOpacity = focus === "axes" ? ".08" : "1";
    var domeOpacity = focus === "axes" ? ".22" : "1";
    var familyOpacity = focus === "axes" ? ".08" : (focus === "zones" ? ".20" : ".62");
    var cycleOpacity = focus === "cycle" ? "1" : ".08";
    var body = defs() + '<defs><pattern id="ph-grid" width="47" height="38" patternUnits="userSpaceOnUse"><path d="M47 0H0V38" fill="none" stroke="#3d7fca" stroke-opacity=".10"/></pattern></defs>' +
      '<rect x="10" y="10" width="700" height="370" rx="20" class="plate-bg"/><rect x="72" y="45" width="575" height="286" fill="url(#ph-grid)"/>' +
      '<g opacity="' + zoneOpacity + '"><path class="ph-zone liquid-zone" d="M73 331V45H350C281 92 218 198 190 331Z"/><path class="ph-zone mix-zone" d="M190 331C218 198 281 92 350 72C426 91 486 204 515 331Z"/><path class="ph-zone vapour-zone" d="M350 72C426 91 486 204 515 331H647V45H350Z"/></g>' +
      '<path class="axis-strong" d="M72 331V37M72 331H662"/><text class="svg-small" x="36" y="194" transform="rotate(-90 36 194)" text-anchor="middle">log pression absolue p ↑</text><text class="svg-small" x="404" y="366" text-anchor="middle">enthalpie massique h →</text>' +
      '<g opacity="' + domeOpacity + '"><path class="saturation-dome" d="M190 331C218 198 281 92 350 72C426 91 486 204 515 331"/><circle class="critical-point" cx="350" cy="72" r="7"/><text class="svg-code" x="350" y="54" text-anchor="middle">point critique R744</text><text class="ph-zone-name" x="125" y="115">LIQUIDE</text><text class="ph-zone-name" x="350" y="257" text-anchor="middle">LIQUIDE + VAPEUR</text><text class="ph-zone-name" x="540" y="112">VAPEUR</text></g>' +
      '<g opacity="' + familyOpacity + '"><path class="ph-isobar" d="M121 151H606M126 289H616"/><path class="ph-isotherm" d="M220 137C250 151 278 151 307 151H505C548 168 575 214 588 265M186 252C230 280 265 289 316 289H520C566 297 592 316 607 327"/><path class="ph-isenthalp" d="M238 91V316"/></g>' +
      '<g opacity="' + cycleOpacity + '"><path class="cycle-path" d="M238 289H478L548 151H238V289" marker-end="url(#arrow-orange)"/><path class="cycle-arrow" d="M335 289h78M498 251l30-58M455 151h-87M238 221v47" marker-end="url(#arrow-orange)"/><g class="cycle-points"><circle cx="478" cy="289" r="9"/><text x="478" y="276">1</text><circle cx="548" cy="151" r="9"/><text x="561" y="146">2</text><circle cx="238" cy="151" r="9"/><text x="222" y="144">3</text><circle cx="238" cy="289" r="9"/><text x="220" y="307">4</text></g><g class="ph-legend"><rect x="530" y="203" width="112" height="76" rx="10"/><text x="542" y="222">1 → 2  comprimer</text><text x="542" y="239">2 → 3  condenser</text><text x="542" y="256">3 → 4  détendre</text><text x="542" y="273">4 → 1  évaporer</text></g></g>' +
      '<g class="focus-banner"><rect x="82" y="17" width="250" height="25" rx="12"/><text x="207" y="34" text-anchor="middle">' + focusLabel + '</text></g>' +
      '<text class="diagram-note" x="638" y="27" text-anchor="end">MÉTHODE V7 ADAPTÉE AU R744 · QUALITATIF</text>';
    return svg(v.label, body);
  }

  function visualTranscritical(v) {
    var body = circuitBase("transcritical") + '<text class="svg-title" x="360" y="205" text-anchor="middle">Le cycle traverse le point critique</text>' +
      '<text class="svg-label" x="360" y="232" text-anchor="middle">En haute pression, température et pression se règlent séparément.</text>';
    return svg(v.label, body);
  }

  function visualPressureControl(v) {
    var body = defs() + card(35, 125, 170, 130, "Pgc", "pression sortie compresseur", "component") +
      card(275, 85, 170, 210, "RÉGULATEUR HP", "cherche une consigne adaptée", "accent") +
      card(515, 125, 170, 130, "VANNE HP", "module le débit vers le flash", "warn-shape") +
      '<path d="M205 180 H270 M445 180 H510" class="pipe-thin" marker-end="url(#arrow-blue)"/>' +
      '<path d="M600 260 C600 330 355 340 355 300" fill="none" stroke="#c9451a" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#arrow-orange)"/>' +
      '<text class="svg-title" x="360" y="55" text-anchor="middle">La pression HP devient une variable de performance</text>' +
      '<text class="svg-label" x="360" y="365" text-anchor="middle">Une HP trop basse ou trop haute peut dégrader le COP : la régulation arbitre.</text>';
    return svg(v.label, body);
  }

  function visualFlash(v) {
    var body = defs() + card(250, 18, 220, 82, "REFROIDISSEUR DE GAZ", "rejet de chaleur", "warn-shape") +
      card(55, 125, 145, 95, "VANNE HP", "détente contrôlée", "component") +
      '<path d="M200 172 H275" class="hot-line flowing" marker-end="url(#arrow-orange)"/>' +
      '<rect x="275" y="105" width="190" height="190" rx="46" fill="#fffdf8" stroke="#1b3a63" stroke-width="4"/>' +
      '<path d="M295 225 H445 V270 Q445 280 430 280 H310 Q295 280 295 270 Z" fill="#84b7ec" opacity=".65"/>' +
      '<text class="svg-title" x="370" y="155" text-anchor="middle">RÉSERVOIR FLASH</text><text class="svg-small" x="370" y="185" text-anchor="middle">vapeur en haut</text><text class="svg-small" x="370" y="255" text-anchor="middle">liquide en bas</text>' +
      card(510, 65, 170, 85, "GAZ FLASH", "vers aspiration ou compresseur parallèle", "component") +
      card(510, 245, 170, 85, "LIQUIDE", "vers les postes froid", "good-shape") +
      '<path d="M465 145 C485 125 495 110 505 107" class="pipe-thin" marker-end="url(#arrow-blue)"/><path d="M465 260 H505" class="cold-line" marker-end="url(#arrow-blue)"/>';
    return svg(v.label, body);
  }

  function visualRegulation(v) {
    var body = defs() + card(35, 75, 285, 230, "BOUCLE HAUTE PRESSION", "Pgc + T sortie → vanne HP", "accent") +
      card(400, 75, 285, 230, "BOUCLE RÉSERVOIR", "Prec → vanne de gaz flash", "component") +
      '<circle cx="178" cy="190" r="55" fill="#fff" stroke="#c9451a" stroke-width="4"/><path d="M145 190 H205" stroke="#c9451a" stroke-width="6"/><path d="M178 158 V222" stroke="#c9451a" stroke-width="6"/>' +
      '<circle cx="542" cy="190" r="55" fill="#fff" stroke="#3d7fca" stroke-width="4"/><path d="M509 190 H575" stroke="#3d7fca" stroke-width="6"/><path d="M542 158 V222" stroke="#3d7fca" stroke-width="6"/>' +
      '<text class="svg-title" x="360" y="45" text-anchor="middle">Deux pressions, deux actionneurs, deux objectifs</text>' +
      '<text class="svg-label" x="360" y="350" text-anchor="middle">Confondre les deux boucles conduit à un mauvais diagnostic.</text>';
    return svg(v.label, body);
  }

  function visualMeasure(v) {
    var body = circuitBase("transcritical") +
      '<g><circle cx="485" cy="116" r="22" fill="#fff" stroke="#c9451a" stroke-width="4"/><text class="svg-code" x="485" y="121" text-anchor="middle">Pgc</text></g>' +
      '<g><circle cx="400" cy="130" r="22" fill="#fff" stroke="#c9451a" stroke-width="4"/><text class="svg-code" x="400" y="135" text-anchor="middle">Tgc</text></g>' +
      '<g><circle cx="515" cy="285" r="22" fill="#fff" stroke="#3d7fca" stroke-width="4"/><text class="svg-code" x="515" y="290" text-anchor="middle">Pasp</text></g>' +
      '<g><circle cx="225" cy="285" r="22" fill="#fff" stroke="#3d7fca" stroke-width="4"/><text class="svg-code" x="225" y="290" text-anchor="middle">Tasp</text></g>' +
      '<text class="svg-title" x="360" y="205" text-anchor="middle">Mesurer à un point identifié</text><text class="svg-label" x="360" y="232" text-anchor="middle">Puis croiser état, charge, pression, température et commande.</text>';
    return svg(v.label, body);
  }

  function visualDiagnostic(v) {
    var body = defs() + card(22, 125, 150, 120, "SYMPTÔME", "ce qui est observé", "component") +
      card(202, 125, 150, 120, "MESURES", "P, T, état et consigne", "component") +
      card(382, 125, 150, 120, "HYPOTHÈSES", "plusieurs causes possibles", "warn-shape") +
      card(562, 125, 135, 120, "PROCHAIN TEST", "discriminer sans agir au hasard", "good-shape") +
      '<path d="M172 185 H197 M352 185 H377 M532 185 H557" class="pipe-thin" marker-end="url(#arrow-blue)"/>' +
      '<text class="svg-title" x="360" y="55" text-anchor="middle">Une mesure isolée n’est jamais un diagnostic</text>' +
      '<text class="svg-label" x="360" y="325" text-anchor="middle">La conclusion nomme aussi ce qui reste à vérifier.</text>';
    return svg(v.label, body);
  }

  function visualBooster(v) {
    var body = defs() + card(250, 15, 220, 75, "REFROIDISSEUR DE GAZ", "rejet de chaleur", "warn-shape") +
      card(525, 105, 150, 80, "COMPRESSEURS MT", "compression principale", "accent") +
      card(525, 255, 150, 80, "COMPRESSEURS LT", "refoulent vers MT", "accent") +
      '<rect x="285" y="120" width="150" height="150" rx="40" fill="#fffdf8" stroke="#1b3a63" stroke-width="4"/><path d="M300 215 H420 V252 H300 Z" fill="#84b7ec" opacity=".65"/>' +
      '<text class="svg-label" x="360" y="175" text-anchor="middle">RÉSERVOIR FLASH</text>' +
      card(45, 115, 150, 80, "POSTES MT", "froid positif", "good-shape") +
      card(45, 255, 150, 80, "POSTES LT", "froid négatif", "good-shape") +
      '<path d="M435 145 H520 M600 105 C550 70 470 55 445 70 M285 235 H200 M195 155 H280 M195 295 H280 M195 295 C330 360 465 330 520 295 M675 295 C700 245 690 195 645 180" class="pipe-thin" marker-end="url(#arrow-blue)"/>' +
      '<text class="svg-title" x="360" y="375" text-anchor="middle">Architecture booster simplifiée — le P&amp;ID réel reste l’autorité.</text>';
    return svg(v.label, body);
  }

  function visualPid(v) {
    var body = defs() + '<path class="pipe-thin" d="M80 190 H640" marker-end="url(#arrow-blue)"/>' +
      card(55, 95, 135, 90, "GC-01", "rejet de chaleur", "warn-shape") +
      card(225, 200, 135, 90, "PCV-HP", "vanne haute pression", "component") +
      card(395, 95, 135, 90, "REC-01", "réservoir flash", "component") +
      card(565, 200, 120, 90, "EV-MT", "poste froid", "good-shape") +
      '<text class="svg-title" x="360" y="50" text-anchor="middle">Lire : repère → fonction → pression → sens</text>' +
      '<text class="svg-label" x="360" y="340" text-anchor="middle">Une ligne suivie jusqu’au bout vaut mieux qu’un nom deviné.</text>';
    return svg(v.label, body);
  }

  function visualHandoff(v) {
    var body = card(35, 70, 300, 245, "ICI : DÉCOUVRIR", "repères théoriques et décisions", "good-shape") +
      card(385, 70, 300, 245, "CATÉGORIE B", "théorie + gestes + évaluation", "warn-shape") +
      wrapLines(["identifier l’architecture", "lire des mesures", "nommer le prochain contrôle", "refuser une intervention non autorisée"], 185, 145, "middle", "svg-small", 27) +
      wrapLines(["matériel R744 adapté", "analyse de risques", "mise en œuvre pratique", "évaluation par organisme compétent"], 535, 145, "middle", "svg-small", 27) +
      '<text class="svg-title" x="360" y="355" text-anchor="middle">Une passerelle honnête, pas une promesse de certification.</text>';
    return svg(v.label, body);
  }

  function renderVisual(v) {
    var kind = (v && v.kind) || "identity";
    var renderers = {
      identity: visualIdentity,
      benefits: visualBenefits,
      tradeoffs: visualTradeoffs,
      phase: visualPhase,
      dryIce: visualDryIce,
      pressure: visualPressure,
      safety: visualSafety,
      subcritical: visualSubcritical,
      logph: visualLogph,
      transcritical: visualTranscritical,
      pressureControl: visualPressureControl,
      flash: visualFlash,
      regulation: visualRegulation,
      measure: visualMeasure,
      diagnostic: visualDiagnostic,
      booster: visualBooster,
      pid: visualPid,
      handoff: visualHandoff
    };
    return (renderers[kind] || visualIdentity)(v || { label: "Repère CO₂" });
  }

  function boxHtml(box) {
    if (!box) return "";
    var cls = box.type === "warning" ? "warning-box" : box.type === "exam" ? "exam-box" : "key-box";
    var prefix = box.type === "warning" ? "⚠ Le piège — " : box.type === "exam" ? "À retenir — " : "La clé — ";
    return '<div class="' + cls + '"><strong>' + prefix + "</strong>" + inline(box.text) + "</div>";
  }

  function activityHtml(activity) {
    if (!activity) return "";
    return '<div class="activity-card" data-activity><p class="activity-prompt">' + inline(activity.prompt) + '</p><div class="activity-options">' +
      activity.options.map(function (option, index) {
        return '<button class="activity-option" type="button" data-activity-option="' + index + '">' + inline(option) + "</button>";
      }).join("") + '</div><p class="activity-feedback" aria-live="polite">Choisissez une réponse puis lisez le retour.</p></div>';
  }

  function wireActivity(activity) {
    if (!activity) return;
    var root = ui.lessonCard.querySelector("[data-activity]");
    if (!root) return;
    var feedback = root.querySelector(".activity-feedback");
    Array.prototype.forEach.call(root.querySelectorAll("[data-activity-option]"), function (button) {
      button.addEventListener("click", function () {
        var selected = Number(button.dataset.activityOption);
        Array.prototype.forEach.call(root.querySelectorAll("[data-activity-option]"), function (item) {
          var index = Number(item.dataset.activityOption);
          item.classList.toggle("correct", index === activity.correct);
          item.classList.toggle("wrong", index === selected && selected !== activity.correct);
          item.disabled = true;
        });
        feedback.textContent = (selected === activity.correct ? "Correct. " : "À revoir. ") + activity.why;
        announce(feedback.textContent);
      });
    });
  }

  function navHtml() {
    var items = moduleData.lessons.map(function (lesson, index) {
      var active = state.phase === "lesson" && state.lesson === index;
      return '<button class="station-button' + (active ? " active" : "") + (state.done.has(index) ? " done" : "") + '" type="button" data-lesson="' + index + '"' + (active ? ' aria-current="step"' : "") + '><span>' + (index + 1) + '</span><strong>' + esc(lesson.short) + "</strong></button>";
    }).join("");
    var quizActive = state.phase === "quiz" || state.phase === "summary";
    items += '<button class="station-button quiz' + (quizActive ? " active" : "") + '" type="button" data-quiz-home' + (quizActive ? ' aria-current="step"' : "") + '><span>Q</span><strong>Défi</strong></button>';
    return items;
  }

  function renderNav() {
    ui.stations.innerHTML = navHtml();
    Array.prototype.forEach.call(ui.stations.querySelectorAll("[data-lesson]"), function (button) {
      button.addEventListener("click", function () {
        stopSpeech();
        state.phase = "lesson";
        state.lesson = Number(button.dataset.lesson);
        render();
      });
    });
    ui.stations.querySelector("[data-quiz-home]").addEventListener("click", function () {
      stopSpeech();
      state.phase = "quiz";
      state.quiz = 0;
      state.answered = state.answers[0] != null;
      render();
    });
  }

  function lessonHtml(lesson) {
    var visual = lesson.visual || { kind: "identity", title: "Repère CO₂", label: "Repère CO₂" };
    return '<section class="copy-panel"><div class="kicker">' + esc(lesson.kicker) + "</div>" +
      (lesson.recall ? '<span class="recall-badge">Rappel de prérequis</span>' : "") +
      "<h1>" + inline(lesson.title) + '</h1><p class="lead">' + inline(lesson.lead) + '</p><div class="details">' +
      (lesson.details || []).map(function (detail) { return "<p>" + inline(detail) + "</p>"; }).join("") +
      "</div>" + boxHtml(lesson.box) + '</section><section class="visual-panel"><h2>' + esc(visual.title || "Repère visuel") + '</h2><div class="visual-stage' + (lesson.activity ? " has-activity" : "") + '">' + renderVisual(visual) + activityHtml(lesson.activity) + '</div><p class="visual-caption">' + esc(visual.label) + "</p></section>";
  }

  function quizHtml(question) {
    var selected = state.answers[state.quiz];
    var options = question.options.map(function (option, index) {
      var cls = "";
      if (selected != null && index === question.correct) cls = " correct";
      if (selected != null && index === selected && index !== question.correct) cls = " wrong";
      return '<button class="option-button' + cls + '" type="button" data-answer="' + index + '"' + (selected != null ? " disabled" : "") + '><span>' + String.fromCharCode(65 + index) + "</span>" + inline(option) + "</button>";
    }).join("");
    var good = selected === question.correct;
    return '<section class="copy-panel"><div class="kicker">Défi final · question ' + (state.quiz + 1) + " sur " + moduleData.quiz.length + '</div><h1>' + inline(question.prompt) + '</h1><div class="option-list">' + options + '</div><div class="feedback' + (selected != null ? " show " + (good ? "good" : "bad") : "") + '" aria-live="polite">' + (selected != null ? (good ? "✓ Correct. " : "✗ À revoir. ") + inline(question.why) : "") + '</div></section><section class="visual-panel"><h2>Construire la décision</h2><div class="visual-stage">' + renderVisual({ kind: question.visual || "diagnostic", label: "Observer, mesurer, interpréter puis décider" }) + '</div><p class="visual-caption">Code de repérage : ' + esc(question.code || "parcours de découverte") + ". Ce quiz ne vaut pas l’évaluation officielle.</p></section>";
  }

  function summaryHtml() {
    var threshold = Math.max(1, Math.min(moduleData.quiz.length, Number(moduleData.threshold) || Math.ceil(moduleData.quiz.length * .8)));
    var reached = state.score >= threshold;
    var related = (moduleData.relatedLinks || []).map(function (link) {
      return '<a class="related-link" href="' + esc(link.url) + '">' + esc(link.label) + "</a>";
    }).join("");
    return '<section class="copy-panel"><div class="kicker">Bilan de la gare</div><div class="score-card"><h1>' + esc(moduleData.title) + '</h1><div class="score-number">' + state.score + " / " + moduleData.quiz.length + '</div><p class="threshold-status ' + (reached ? "achieved" : "review") + '"><strong>Objectif : ' + threshold + " / " + moduleData.quiz.length + ".</strong> " + (reached ? "Seuil atteint pour ce quiz local." : "Seuil non atteint : reprenez les écrans associés aux réponses fragiles.") + '</p><p>Ce résultat mesure un entraînement théorique local. Il ne constitue ni une attestation, ni une autorisation d’intervention sur R744.</p><div class="summary-links"><a class="module-next-link" href="' + esc(moduleData.nextUrl) + '">' + esc(moduleData.nextLabel) + " →</a>" + related + '</div></div></section><section class="visual-panel"><h2>Ce que vous emportez</h2><div class="visual-stage">' + renderVisual(moduleData.summaryVisual || { kind: "handoff", label: "Du parcours de découverte vers la catégorie B" }) + '</div><p class="visual-caption">' + esc(moduleData.nextStep) + "</p></section>";
  }

  function saveProgress() {
    try {
      localStorage.setItem("inerweb_co2_" + moduleData.id, JSON.stringify({ done: Array.from(state.done), score: state.score }));
    } catch (_) { /* Le parcours reste complet sans stockage. */ }
  }

  function loadProgress() {
    try {
      var saved = JSON.parse(localStorage.getItem("inerweb_co2_" + moduleData.id) || "null");
      if (saved && Array.isArray(saved.done)) state.done = new Set(saved.done);
    } catch (_) { /* stockage indisponible ou valeur invalide */ }
  }

  function render() {
    renderNav();
    ui.lessonCard.className = "lesson-card";
    if (state.phase === "lesson") {
      var lesson = moduleData.lessons[state.lesson];
      ui.lessonCard.innerHTML = lessonHtml(lesson);
      wireActivity(lesson.activity);
      ui.previous.disabled = state.lesson === 0;
      ui.next.disabled = false;
      ui.next.textContent = state.lesson === moduleData.lessons.length - 1 ? "Passer au défi →" : "Continuer →";
      ui.status.textContent = "Écran " + (state.lesson + 1) + " sur " + moduleData.lessons.length + " · " + lesson.short;
    } else if (state.phase === "quiz") {
      ui.lessonCard.classList.add("quiz-mode");
      ui.lessonCard.innerHTML = quizHtml(moduleData.quiz[state.quiz]);
      ui.previous.disabled = false;
      ui.next.disabled = !state.answered;
      ui.next.textContent = state.quiz === moduleData.quiz.length - 1 ? "Voir le bilan →" : "Question suivante →";
      ui.status.textContent = "Question " + (state.quiz + 1) + " sur " + moduleData.quiz.length + " · score " + state.score;
      Array.prototype.forEach.call(ui.lessonCard.querySelectorAll("[data-answer]"), function (button) {
        button.addEventListener("click", function () { answer(Number(button.dataset.answer)); });
      });
    } else {
      ui.lessonCard.classList.add("summary-mode");
      ui.lessonCard.innerHTML = summaryHtml();
      ui.previous.disabled = false;
      ui.next.disabled = false;
      ui.next.textContent = "Refaire le défi";
      ui.status.textContent = "Bilan · " + state.score + " sur " + moduleData.quiz.length;
    }
    ui.lessonCard.focus({ preventScroll: true });
    saveProgress();
  }

  function answer(index) {
    if (state.answered) return;
    state.answered = true;
    state.answers[state.quiz] = index;
    if (index === moduleData.quiz[state.quiz].correct) state.score += 1;
    render();
    announce(index === moduleData.quiz[state.quiz].correct ? "Réponse correcte." : "Réponse à revoir.");
  }

  function next() {
    stopSpeech();
    if (state.phase === "lesson") {
      state.done.add(state.lesson);
      if (state.lesson < moduleData.lessons.length - 1) state.lesson += 1;
      else {
        state.phase = "quiz";
        state.quiz = 0;
        state.answered = state.answers[0] != null;
      }
    } else if (state.phase === "quiz") {
      if (!state.answered) return;
      if (state.quiz < moduleData.quiz.length - 1) {
        state.quiz += 1;
        state.answered = state.answers[state.quiz] != null;
      } else state.phase = "summary";
    } else {
      state.phase = "quiz";
      state.quiz = 0;
      state.score = 0;
      state.answers = [];
      state.answered = false;
    }
    render();
  }

  function previous() {
    stopSpeech();
    if (state.phase === "lesson") state.lesson = Math.max(0, state.lesson - 1);
    else if (state.phase === "quiz") {
      if (state.quiz > 0) {
        state.quiz -= 1;
        state.answered = state.answers[state.quiz] != null;
      } else {
        state.phase = "lesson";
        state.lesson = moduleData.lessons.length - 1;
      }
    } else {
      state.phase = "quiz";
      state.quiz = moduleData.quiz.length - 1;
      state.answered = true;
    }
    render();
  }

  function hasSpeech() {
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function" && window.speechSynthesis;
  }

  function bestFrenchVoice() {
    if (!hasSpeech()) return null;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    var french = voices.filter(function (voice) { return /^fr(?:-|$)/i.test(voice.lang || ""); });
    french.sort(function (a, b) {
      function score(voice) {
        var points = /^fr-FR$/i.test(voice.lang || "") ? 20 : 8;
        if (/natural|naturel|neural|microsoft|google|denise|henri|julie|paul|hortense/i.test(voice.name || "")) points += 5;
        return points;
      }
      return score(b) - score(a);
    });
    return french[0] || voices[0] || null;
  }

  function visibleSpeechText() {
    var copy = ui.lessonCard.querySelector(".copy-panel");
    return copy ? copy.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function toggleSpeech() {
    if (!hasSpeech()) {
      announce("La voix n’est pas disponible. Le texte écrit reste complet.");
      ui.voice.disabled = true;
      return;
    }
    if (state.speaking && !state.paused) {
      window.speechSynthesis.pause();
      state.paused = true;
      ui.voice.textContent = "▶ Reprendre";
      return;
    }
    if (state.speaking && state.paused) {
      window.speechSynthesis.resume();
      state.paused = false;
      ui.voice.textContent = "Ⅱ Pause";
      return;
    }
    stopSpeech();
    var run = ++state.speechRun;
    var utterance = new SpeechSynthesisUtterance(visibleSpeechText());
    utterance.lang = "fr-FR";
    utterance.rate = Number(ui.rate.value || .95);
    utterance.pitch = 1;
    var voice = bestFrenchVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = function () {
      if (run !== state.speechRun) return;
      state.speaking = true;
      state.paused = false;
      ui.voice.textContent = "Ⅱ Pause";
    };
    utterance.onend = function () {
      if (run !== state.speechRun) return;
      state.speaking = false;
      state.paused = false;
      ui.voice.textContent = "▶ Écouter";
    };
    utterance.onerror = function (event) {
      if (run !== state.speechRun || event.error === "canceled" || event.error === "interrupted") return;
      state.speaking = false;
      state.paused = false;
      ui.voice.textContent = "▶ Écouter";
      announce("Lecture vocale indisponible. Le texte écrit reste complet.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    state.speechRun += 1;
    state.speaking = false;
    state.paused = false;
    if (hasSpeech()) window.speechSynthesis.cancel();
    if (ui.voice) ui.voice.textContent = "▶ Écouter";
  }

  function announce(message) {
    ui.live.textContent = "";
    window.setTimeout(function () { ui.live.textContent = message; }, 20);
  }

  function renderSources() {
    var sources = moduleData.sources || window.CO2_SOURCES || [];
    ui.dialogBody.innerHTML = '<p><strong>Statut :</strong> brouillon pédagogique de découverte. Les notices du matériel réel et les procédures de l’organisme compétent restent prioritaires.</p><ul>' + sources.map(function (source) {
      return '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener">' + esc(source.title) + "</a> — " + esc(source.use) + "</li>";
    }).join("") + '</ul><p><strong>Visuels :</strong> SVG originaux inerWeb, sans reprise d’image constructeur. Voir <a href="../_co2-commun/SOURCES-TECHNIQUES.md">la traçabilité technique locale</a>.</p>';
  }

  ui.title.textContent = moduleData.title;
  ui.subtitle.textContent = moduleData.subtitle;
  document.title = moduleData.title + " — inerWeb";
  if (ui.lineHome) {
    ui.lineHome.href = moduleData.lineHome || "../co2-r744-interactif/index.html";
    ui.lineHome.setAttribute("aria-label", "Retour à La Rame CO₂");
  }
  renderSources();
  loadProgress();
  ui.previous.addEventListener("click", previous);
  ui.next.addEventListener("click", next);
  ui.voice.addEventListener("click", toggleSpeech);
  ui.stopVoice.addEventListener("click", stopSpeech);
  ui.rate.addEventListener("change", function () {
    if (!state.speaking) return;
    stopSpeech();
    toggleSpeech();
    announce("Vitesse modifiée. La lecture reprend depuis le début de l’écran.");
  });
  ui.sources.addEventListener("click", function () { ui.dialog.showModal(); });
  ui.dialogClose.addEventListener("click", function () { ui.dialog.close(); });
  document.addEventListener("keydown", function (event) {
    var interactive = /^(INPUT|SELECT|TEXTAREA|BUTTON|A)$/.test(document.activeElement && document.activeElement.tagName);
    if (interactive) return;
    if (event.key === "ArrowRight" && !ui.next.disabled) next();
    if (event.key === "ArrowLeft" && !ui.previous.disabled) previous();
    if (event.key === " ") {
      event.preventDefault();
      toggleSpeech();
    }
    if (event.key === "Escape") stopSpeech();
  });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopSpeech(); });
  window.addEventListener("beforeunload", stopSpeech);
  if (hasSpeech() && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener("voiceschanged", bestFrenchVoice);
  else ui.voice.disabled = true;
  render();
})();
