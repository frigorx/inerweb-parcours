"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fr = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

let currentStage = 0;
let stageCleanup = null;
let selectedVoice = null;
let selectedVoiceKey = "";
let voiceChoiceIsManual = false;
let rateIndex = 1;
let speechRun = 0;
let speechTimer = null;
let speechChunks = [];
let speechChunkIndex = 0;
let speechActive = false;
let speechPaused = false;
const voiceRates = [0.8, 0.95, 1.1, 1.25];

const organSymbols = {
  compresseur: "symboles/compresseur_general.svg",
  condenseur: "symboles/echangeur_a_air.svg",
  detendeur: "symboles/detendeur_thermo_ext.svg",
  evaporateur: "symboles/echangeur_a_air.svg"
};

const circuitMarkup = (interactive = false) => `
  <div class="circuit-board ${interactive ? "interactive" : ""}" aria-label="Croix du frigoriste correctement raccordée. Le fluide frigorigène circule du compresseur vers le condenseur, puis le détendeur, l’évaporateur et revient au compresseur.">
    <svg class="circuit-lines" viewBox="0 0 900 560" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#df4438"></path>
        </marker>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#f28a16"></path>
        </marker>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#1769aa"></path>
        </marker>
        <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#52b9e9"></path>
        </marker>
      </defs>
      <path class="circuit-path circuit-red" d="M810 225V105H545" marker-end="url(#arrow-red)"></path>
      <path class="circuit-path circuit-orange" d="M355 105H90V225" marker-end="url(#arrow-orange)"></path>
      <path class="circuit-path circuit-blue" d="M90 335V455H355" marker-end="url(#arrow-blue)"></path>
      <path class="circuit-path circuit-cyan" d="M545 455H810V335" marker-end="url(#arrow-cyan)"></path>
      <path class="circuit-flow" d="M810 225V105H545"></path>
      <path class="circuit-flow" d="M355 105H90V225"></path>
      <path class="circuit-flow" d="M90 335V455H355"></path>
      <path class="circuit-flow" d="M545 455H810V335"></path>
    </svg>
    ${circuitOrgan("condenseur", "CONDENSEUR", "Liquéfie · rejette la chaleur", "top", interactive)}
    ${circuitOrgan("compresseur", "COMPRESSEUR", "Aspire BP · refoule HP", "right", interactive)}
    ${circuitOrgan("evaporateur", "ÉVAPORATEUR", "Évapore · absorbe la chaleur", "bottom", interactive)}
    ${circuitOrgan("detendeur", "DÉTENDEUR", "HP → BP · dose le débit", "left", interactive)}
    <span class="thermal-tag tag-red"><b>TRÈS CHAUD</b>Vapeur HP refoulée</span>
    <span class="thermal-tag tag-orange"><b>CHAUD À TIÈDE</b>Liquide HP sous-refroidi</span>
    <span class="thermal-tag tag-blue"><b>TRÈS FROID</b>Mélange liquide + vapeur BP</span>
    <span class="thermal-tag tag-cyan"><b>FROID</b>Vapeur BP surchauffée</span>
  </div>`;

function circuitOrgan(id, label, copy, position, interactive) {
  const tag = interactive ? "button" : "div";
  const type = interactive ? ' type="button" data-circuit-organ="' + id + '"' : "";
  return `<${tag} class="circuit-organ organ-${position}"${type}>
    <img src="${organSymbols[id]}" alt="">
    <b>${label}</b><small>${copy}</small>
  </${tag}>`;
}

const stages = [
  {
    short: "Rappel",
    kicker: "ÉTAPE 1 · REPARTIR DU CONNU",
    title: "Le circuit ne change pas",
    intro: "Les quatre organes restent les mêmes. Ce tome ajoute la lecture énergétique du cycle.",
    narration: "Le tome 1 a permis de reconnaître les quatre organes et de suivre le fluide frigorigène. Le compresseur aspire la vapeur basse pression, la comprime, la refoule en haute pression et met le fluide frigorigène en mouvement. Le condenseur rejette de la chaleur. Le détendeur fait chuter la pression et dose le débit massique. L’évaporateur absorbe de la chaleur. Dans ce tome, nous allons comprendre et quantifier ces échanges.",
    render: renderRecap
  },
  {
    short: "Deux mots",
    kicker: "ÉTAPE 2 · VOCABULAIRE THERMODYNAMIQUE",
    title: "Température, énergie et puissance : trois grandeurs",
    intro: "On ne parle correctement d’un échange thermique qu’en distinguant T, Q et Q̇.",
    narration: "La température T est une variable d’état, exprimée en degrés Celsius ou en kelvins. La chaleur Q désigne une énergie transférée à travers la frontière d’un système, exprimée en joules. La puissance thermique Q point est une énergie transférée par unité de temps, exprimée en watts. Un corps ne contient donc pas de la chaleur comme un réservoir : il possède une énergie interne et peut recevoir ou céder de la chaleur. La masse, la nature de la matière et l’écart de température déterminent la quantité échangée.",
    render: renderTemperatureHeat
  },
  {
    short: "Chaud → froid",
    kicker: "ÉTAPE 3 · BILAN D’ÉNERGIE",
    title: "Un transfert impose une source chaude et une source froide",
    intro: "Suivez le sens du transfert puis fermez le bilan énergétique du système.",
    narration: "Dans une enceinte parfaitement isolée, un kilogramme d’eau à soixante degrés échange de la chaleur avec un kilogramme d’eau à vingt degrés. La chaleur quitte la masse la plus chaude et entre dans la masse la plus froide. Avec des masses et une matière identiques, les températures convergent vers quarante degrés. Le bilan idéal s’écrit Q chaud plus Q froid égale zéro : ce qui est cédé par l’une est reçu par l’autre. Le froid ne se déplace pas ; il faut fournir un travail au circuit frigorifique pour déplacer la chaleur du milieu froid vers le milieu chaud.",
    render: renderWaterExchange,
    wire: wireWaterExchange
  },
  {
    short: "Sensible",
    kicker: "ÉTAPE 4 · FAIRE VARIER LA TEMPÉRATURE",
    title: "La chaleur sensible modifie la température",
    intro: "L’état physique reste identique : seul le niveau thermique évolue.",
    narration: "La chaleur sensible correspond à une variation de température sans changement d’état. Pour calculer l’énergie transférée, on multiplie la masse par la capacité thermique massique et par la variation de température. La formule est Q égale m fois c fois delta T. La masse s’exprime en kilogrammes, c en joules par kilogramme kelvin, et delta T en kelvins. Le résultat Q s’exprime en joules.",
    render: renderSensible
  },
  {
    short: "Calculer Q",
    kicker: "ÉTAPE 5 · MANIPULER LA FORMULE",
    title: "Q = m × c × ΔT",
    intro: "Modifiez la masse, la matière ou les températures et observez l’énergie nécessaire.",
    narration: "Dans cette formule, Q est une quantité d’énergie et non une puissance. Si la température finale est supérieure à la température initiale, le corps reçoit de la chaleur. Si elle est inférieure, le corps cède de la chaleur. Cette relation s’applique à une zone de chaleur sensible, sans changement d’état.",
    render: renderEnergyCalculator,
    wire: wireEnergyCalculator
  },
  {
    short: "Puissance",
    kicker: "ÉTAPE 6 · PASSER À UN FLUIDE EN MOUVEMENT",
    title: "Avec un débit massique, on calcule une puissance",
    intro: "Dans un échangeur traversé en permanence, la grandeur utile est le kilowatt.",
    narration: "Lorsque la matière circule, on utilise le débit massique. La puissance thermique est égale au débit massique multiplié par la capacité thermique massique et par l’écart de température. Elle s’écrit Q point égale m point fois c p fois delta T. Le résultat s’exprime en watts. On utilise la valeur absolue pour quantifier l’échange, puis on précise séparément si le milieu reçoit ou cède de la chaleur.",
    render: renderPowerCalculator,
    wire: wirePowerCalculator
  },
  {
    short: "Latente",
    kicker: "ÉTAPE 7 · CHANGEMENT D’ÉTAT ET SATURATION",
    title: "La chaleur latente transforme le fluide sans changer fortement sa température",
    intro: "Le palier relie énergie, point de bulle, point de rosée et état saturé.",
    narration: "Lors d’un changement d’état, la chaleur transférée est dite latente. La relation est Q égale m fois L. À pression constante, un corps pur change d’état à température presque stable. Le point de bulle marque l’apparition de la première bulle lors de la vaporisation. Le point de rosée marque la disparition de la dernière goutte. Entre les deux, liquide et vapeur coexistent : le fluide est saturé. Pour un mélange zéotrope, les températures de bulle et de rosée diffèrent ; la température glisse pendant le changement d’état. Pour un fluide frigorigène, ces températures dépendent directement de la pression.",
    render: renderLatent,
    wire: wireLatent
  },
  {
    short: "Évaporateur",
    kicker: "ÉTAPE 8 · ÉVAPORATION ET SURCHAUFFE",
    title: "L’évaporateur produit l’effet frigorifique",
    intro: "L’air se refroidit ; le fluide frigorigène s’évapore puis devient vapeur surchauffée.",
    narration: "Dans l’évaporateur, l’air du local arrive à une température supérieure à celle du fluide frigorigène. La chaleur passe de l’air vers le fluide frigorigène et l’air ressort plus froid. Le mélange basse pression absorbe de la chaleur latente jusqu’à la disparition de la dernière goutte, au point de rosée. La vapeur absorbe ensuite de la chaleur sensible. La surchauffe est la différence entre la température réelle de la vapeur et sa température de saturation à la même pression. Elle s’exprime en kelvins, jamais comme une température. Le repère usuel de cinq à dix kelvins doit toujours être confronté à la documentation du constructeur.",
    render: renderEvaporator
  },
  {
    short: "Condenseur",
    kicker: "ÉTAPE 9 · LIQUÉFACTION ET SOUS-REFROIDISSEMENT",
    title: "Le condenseur rejette la chaleur vers l’air extérieur",
    intro: "La vapeur HP se désurchauffe, se liquéfie puis devient liquide sous-refroidi.",
    narration: "Dans le condenseur, le fluide frigorigène est plus chaud que l’air extérieur. La chaleur passe du fluide frigorigène vers l’air et l’air ressort plus chaud. La vapeur haute pression se désurchauffe par chaleur sensible, se liquéfie en rejetant de la chaleur latente, puis le liquide se sous-refroidit après la disparition de la dernière bulle, au point de bulle. Le sous-refroidissement est la différence entre la température de saturation liquide et la température réelle du liquide à la même pression. Il s’exprime en kelvins. Le repère usuel de quatre à huit kelvins doit toujours être confronté à la documentation du constructeur.",
    render: renderCondenser
  },
  {
    short: "Bilan",
    kicker: "ÉTAPE 10 · NE PERDRE AUCUNE ÉNERGIE",
    title: "Effet frigorifique et chaleur de compression s’additionnent",
    intro: "Le condenseur rejette la chaleur prise au local plus l’énergie transmise par le compresseur.",
    narration: "L’énergie absorbée par un kilogramme de fluide frigorigène dans l’évaporateur constitue l’effet frigorifique massique. Le compresseur ajoute au fluide une chaleur de compression. En régime établi, la puissance thermique rejetée au condenseur est égale à la puissance frigorifique absorbée à l’évaporateur plus la puissance transmise au fluide frigorigène par le compresseur. Le condenseur rejette donc davantage de chaleur que l’évaporateur n’en absorbe.",
    render: renderEnergyBalance,
    wire: wireEnergyBalance
  },
  {
    short: "Synthèse",
    kicker: "ÉTAPE 11 · RELIRE LE CYCLE",
    title: "Chaque organe impose une transformation énergétique",
    intro: "Cliquez sur les organes pendant que le fluide frigorigène continue de circuler.",
    narration: "Le compresseur reçoit de l’énergie mécanique, augmente la pression et met le fluide frigorigène en mouvement. Le condenseur rejette de la chaleur vers l’air et assure la liquéfaction. Le détendeur provoque la chute de pression et dose le débit massique. L’évaporateur absorbe la chaleur du milieu à refroidir et assure l’évaporation. Le même débit massique traverse les quatre organes en régime établi.",
    render: renderSynthesis,
    wire: wireSynthesis
  },
  {
    short: "Validation",
    kicker: "ÉTAPE 12 · VÉRIFIER LA COMPRÉHENSION",
    title: "Quiz de thermodynamique appliquée",
    intro: "Douze questions techniques, uniquement sur les notions étudiées dans ce tome.",
    narration: "Répondez aux douze questions. L’objectif n’est pas de réciter une formule seule, mais de relier température, énergie, changement d’état, saturation, surchauffe, sous-refroidissement et fonctionnement du circuit frigorifique.",
    render: renderQuiz,
    wire: wireQuiz
  }
];

function renderRecap() {
  return `
    <div class="two-column recap-layout">
      ${circuitMarkup()}
      <div class="recap-cards">
        <div class="knowledge-card"><span>ACQUIS DU TOME 1</span><h3>Le fluide frigorigène circule</h3><p>Le compresseur aspire, comprime, refoule et maintient le mouvement de <strong>BP vers HP</strong>.</p></div>
        <div class="knowledge-card accent"><span>NOUVELLE LECTURE</span><h3>La chaleur est transférée</h3><p>Elle est <strong>absorbée à l’évaporateur</strong> puis <strong>rejetée au condenseur</strong>.</p></div>
        <div class="mass-reminder"><b>Une même masse, des volumes différents</b><small>Le débit massique se conserve en régime établi ; la masse volumique et le volume massique varient.</small></div>
      </div>
    </div>`;
}

function renderTemperatureHeat() {
  return `
    <div class="definition-grid">
      <article class="definition-card temperature-card">
        <span class="definition-icon">T</span>
        <div><p class="mini-kicker">TEMPÉRATURE · T</p><h3>Une variable d’état</h3></div>
        <p>Elle situe le niveau thermique du corps. Elle se mesure en <strong>°C</strong> ou en <strong>K</strong>.</p>
        <div class="thermometer" aria-hidden="true"><i></i><b>60 °C</b><small>20 °C</small></div>
      </article>
      <article class="definition-card heat-card">
        <span class="definition-icon">Q</span>
        <div><p class="mini-kicker">CHALEUR · Q</p><h3>Une énergie transférée</h3></div>
        <p>Elle franchit la frontière du système pendant l’échange. Elle s’exprime en <strong>joules · J</strong>.</p>
        <div class="energy-packets" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
      <article class="definition-card power-definition-card">
        <span class="definition-icon">Q̇</span>
        <div><p class="mini-kicker">PUISSANCE THERMIQUE · Q̇</p><h3>Un débit d’énergie</h3></div>
        <p>Elle indique la quantité d’énergie transférée par unité de temps. Elle s’exprime en <strong>watts · W</strong>.</p>
      </article>
      <div class="professional-rule">
        <b>REPÈRE HABILITATION</b>
        <p>Un corps possède une énergie interne ; il <strong>reçoit ou cède de la chaleur</strong> pendant un transfert.</p>
        <span>T décrit l’état · Q compte l’énergie · Q̇ mesure la puissance</span>
      </div>
    </div>`;
}

function renderWaterExchange() {
  return `
    <div class="water-lab">
      <div class="water-side hot-side">
        <p>1 kg d’eau</p>
        <div class="beaker"><span></span><i class="water-wave"></i></div>
        <strong id="hot-temperature">60,0 °C</strong>
        <small>Cède de la chaleur</small>
      </div>
      <div class="heat-bridge">
        <div class="heat-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <b>TRANSFERT DE CHALEUR</b>
        <span id="exchange-state">En cours vers l’équilibre</span>
        <button class="pause-button" id="exchange-control" type="button">Pause</button>
      </div>
      <div class="water-side cold-side">
        <p>1 kg d’eau</p>
        <div class="beaker"><span></span><i class="water-wave"></i></div>
        <strong id="cold-temperature">20,0 °C</strong>
        <small>Reçoit de la chaleur</small>
      </div>
      <div class="lab-rule"><b>Équilibre idéal : 40 °C</b><span>Mêmes masses · même matière · aucune perte vers l’extérieur</span></div>
      <div class="equilibrium-equation"><b>Q<sub>chaud</sub> + Q<sub>froid</sub> = 0</b><span>L’énergie cédée par la source chaude est reçue par la source froide.</span></div>
    </div>`;
}

function renderSensible() {
  return `
    <div class="formula-layout">
      <div class="formula-hero">
        <p>CHALEUR SENSIBLE</p>
        <div class="formula" aria-label="Q égale m fois c fois delta T">
          <strong>Q</strong><i>=</i><strong>m</strong><i>×</i><strong>c</strong><i>×</i><strong>ΔT</strong>
        </div>
        <small>Valable sans changement d’état</small>
      </div>
      <div class="variable-grid">
        <article><span>m</span><b>La masse</b><p>Plus la masse est importante, plus l’énergie nécessaire augmente.</p><small>kilogrammes · kg</small></article>
        <article><span>c</span><b>La matière</b><p>Chaque matière possède sa propre capacité thermique massique.</p><small>J/(kg·K)</small></article>
        <article><span>ΔT</span><b>L’écart thermique</b><p>ΔT correspond à la température finale moins la température initiale.</p><small>kelvins · K</small></article>
      </div>
      <div class="sensible-line">
        <span>LIQUIDE À 20 °C</span><i><b>+ Q</b></i><span>LIQUIDE À 60 °C</span>
        <small>Même état physique, température différente</small>
      </div>
    </div>`;
}

function renderEnergyCalculator() {
  return `
    <div class="calculator-layout">
      <form class="calculator-panel" id="energy-form">
        <label>Matière
          <select id="material">
            <option value="4180">Eau · c = 4 180 J/(kg·K)</option>
            <option value="1005">Air sec · cₚ = 1 005 J/(kg·K)</option>
            <option value="385">Cuivre · c = 385 J/(kg·K)</option>
          </select>
        </label>
        <label>Masse <span><input id="mass" type="number" min="0.01" step="0.1" value="1"> kg</span></label>
        <div class="input-pair">
          <label>Température initiale <span><input id="temperature-initial" type="number" step="1" value="20"> °C</span></label>
          <label>Température finale <span><input id="temperature-final" type="number" step="1" value="60"> °C</span></label>
        </div>
      </form>
      <div class="calculation-result" aria-live="polite">
        <p>RÉSULTAT</p>
        <strong id="energy-result">167,2 kJ</strong>
        <span id="energy-direction">Énergie reçue par l’eau</span>
        <div id="energy-steps">1 × 4 180 × 40 = 167 200 J</div>
      </div>
      <div class="calculation-warning"><b>Frontière de validité</b><span>Si la matière change d’état, cette formule seule ne suffit plus : il faut ajouter la chaleur latente.</span></div>
    </div>`;
}

function renderPowerCalculator() {
  return `
    <div class="power-layout">
      <div class="power-formula">
        <p>PUISSANCE THERMIQUE</p>
        <div class="formula compact"><strong>Q̇</strong><i>=</i><strong>ṁ</strong><i>×</i><strong>cₚ</strong><i>×</i><strong>|ΔT|</strong></div>
        <div class="unit-chain"><span>kg/s</span><i>×</i><span>J/(kg·K)</span><i>×</i><span>K</span><i>=</i><strong>W</strong></div>
      </div>
      <form class="power-panel" id="power-form">
        <label>Débit massique d’air <span><input id="mass-flow" type="number" min="0.01" step="0.05" value="0.25"> kg/s</span></label>
        <label>Capacité thermique de l’air <span><input id="air-cp" type="number" min="1" step="1" value="1005"> J/(kg·K)</span></label>
        <div class="input-pair">
          <label>Air entrant <span><input id="air-in" type="number" step="1" value="24"> °C</span></label>
          <label>Air sortant <span><input id="air-out" type="number" step="1" value="16"> °C</span></label>
        </div>
      </form>
      <div class="power-result" aria-live="polite">
        <span>L’air cède au fluide frigorigène</span>
        <strong id="power-result">2,01 kW</strong>
        <small id="power-steps">0,25 × 1 005 × 8 = 2 010 W</small>
      </div>
    </div>`;
}

function renderLatent() {
  return `
    <div class="latent-layout">
      <figure class="latent-curve">
        <img src="symboles/chaleur-sensible-latente.svg" alt="Courbe de chauffe : zones de chaleur sensible, palier de chaleur latente, point de bulle, point de rosée et vapeur surchauffée.">
        <figcaption>Courbe d’un corps pur · pour un mélange zéotrope, le palier devient un glissement.</figcaption>
      </figure>
      <div class="phase-demonstrator">
        <div class="phase-vessel" id="phase-vessel" data-phase="liquid">
          <i class="phase-liquid"></i><i class="phase-bubbles"></i><i class="phase-vapor"></i>
          <strong id="phase-temperature">20 °C</strong>
        </div>
        <div class="heater"><i></i><span>CHALEUR ENTRANTE</span></div>
      </div>
      <div class="phase-explanation">
        <div class="phase-track" aria-label="Progression du chauffage de l’eau">
          <span class="track-sensible">SENSIBLE<br><small>liquide</small></span>
          <span class="track-latent">LATENTE<br><small>liquide + vapeur</small></span>
          <span class="track-superheat">SENSIBLE<br><small>vapeur</small></span>
          <i id="phase-marker"></i>
        </div>
        <input id="phase-slider" type="range" min="0" max="100" step="0.1" value="0" aria-label="Faire progresser le chauffage">
        <div class="phase-status">
          <p id="phase-title">Le liquide se réchauffe</p>
          <span id="phase-copy">La température augmente sans changement d’état.</span>
        </div>
        <button class="pause-button" id="phase-control" type="button">Pause</button>
      </div>
      <div class="latent-formula-strip">
        <div><small>CHALEUR LATENTE</small><b>Q = m × L</b><span>L : chaleur latente massique · J/kg</span></div>
        <div><small>ZONE SATURÉE</small><b>Liquide + vapeur</b><span>Du point de bulle au point de rosée</span></div>
        <div><small>MÉLANGE ZÉOTROPE</small><b>Glissement</b><span>Les températures de bulle et de rosée diffèrent</span></div>
      </div>
      <div class="pressure-note"><b>La pression fixe les températures de saturation</b><span>Pour un fluide frigorigène, on ne peut pas nommer une température d’évaporation ou de liquéfaction sans connaître la pression et le fluide.</span></div>
    </div>`;
}

function exchangerMarkup(mode) {
  const evaporator = mode === "evaporator";
  const title = evaporator ? "ÉVAPORATEUR" : "CONDENSEUR";
  const airIn = evaporator ? "Air plus chaud" : "Air extérieur plus frais";
  const airOut = evaporator ? "Air plus froid" : "Air rejeté plus chaud";
  const refrigerantIn = evaporator ? "Mélange BP très froid" : "Vapeur HP très chaude";
  const refrigerantOut = evaporator ? "Vapeur BP froide" : "Liquide HP chaud à tiède";
  const direction = evaporator ? "AIR → FLUIDE FRIGORIGÈNE" : "FLUIDE FRIGORIGÈNE → AIR";
  const technical = evaporator
    ? `<div class="exchange-technical">
        <div><small>FIN D’ÉVAPORATION</small><b>Point de rosée</b><span>La dernière goutte de liquide disparaît.</span></div>
        <div><small>SURCHAUFFE</small><b>T<sub>vapeur réelle</sub> − T<sub>saturation rosée</sub></b><span>Différence en K · repère usuel 5 à 10 K, à confirmer par le constructeur.</span></div>
        <div><small>ÉCHANGE CÔTÉ AIR</small><b>T<sub>entrée</sub> &gt; T<sub>sortie</sub></b><span>L’air cède de la chaleur sensible au fluide frigorigène.</span></div>
      </div>`
    : `<div class="exchange-technical">
        <div><small>FIN DE LIQUÉFACTION</small><b>Point de bulle</b><span>La dernière bulle de vapeur disparaît.</span></div>
        <div><small>SOUS-REFROIDISSEMENT</small><b>T<sub>saturation bulle</sub> − T<sub>liquide réel</sub></b><span>Différence en K · repère usuel 4 à 8 K, à confirmer par le constructeur.</span></div>
        <div><small>ÉCHANGE CÔTÉ AIR</small><b>T<sub>sortie</sub> &gt; T<sub>entrée</sub></b><span>L’air reçoit la chaleur rejetée par le fluide frigorigène.</span></div>
      </div>`;
  return `
    <div class="exchanger-layout ${mode}">
      <div class="air-stream">
        <span class="air-label in">${airIn}</span>
        <div class="air-arrows" aria-hidden="true"><i>→</i><i>→</i><i>→</i><i>→</i></div>
        <span class="air-label out">${airOut}</span>
      </div>
      <div class="exchanger">
        <div class="fan" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="battery" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
        <b>${title}</b>
      </div>
      <div class="refrigerant-stream">
        <span>${refrigerantIn}</span>
        <div class="refrigerant-line" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <span>${refrigerantOut}</span>
      </div>
      <div class="heat-direction"><b>${direction}</b><span>${evaporator ? "La chaleur est absorbée" : "La chaleur est rejetée"}</span></div>
      <div class="phase-zones">
        ${evaporator
          ? '<span class="latent-zone"><b>LATENTE</b>Évaporation jusqu’à la dernière goutte</span><span class="sensible-zone"><b>SENSIBLE</b>Surchauffe de la vapeur</span>'
          : '<span class="sensible-zone"><b>SENSIBLE</b>Désurchauffe</span><span class="latent-zone"><b>LATENTE</b>Liquéfaction jusqu’à la dernière bulle</span><span class="sensible-zone"><b>SENSIBLE</b>Sous-refroidissement</span>'}
      </div>
      ${technical}
    </div>`;
}

function renderEvaporator() {
  return exchangerMarkup("evaporator");
}

function renderCondenser() {
  return exchangerMarkup("condenser");
}

function renderEnergyBalance() {
  return `
    <div class="balance-layout">
      <div class="balance-equation">
        <article class="balance-card evap">
          <span>ÉVAPORATEUR</span><strong id="evap-value">5,0 kW</strong><small>Chaleur absorbée</small>
          <input id="evap-power" type="range" min="2" max="12" step="0.1" value="5" aria-label="Puissance frigorifique">
        </article>
        <i>+</i>
        <article class="balance-card comp">
          <span>COMPRESSEUR</span><strong id="comp-value">1,2 kW</strong><small>Énergie transmise</small>
          <input id="comp-power" type="range" min="0.5" max="4" step="0.1" value="1.2" aria-label="Puissance transmise par le compresseur">
        </article>
        <i>=</i>
        <article class="balance-card cond">
          <span>CONDENSEUR</span><strong id="cond-value">6,2 kW</strong><small>Chaleur rejetée</small>
        </article>
      </div>
      <div class="balance-bar">
        <span id="evap-bar"><b>Évaporateur</b></span><span id="comp-bar"><b>Compresseur</b></span>
      </div>
      <p class="balance-rule">Q̇<sub>condenseur</sub> = Q̇<sub>évaporateur</sub> + P<sub>transmise au fluide frigorigène</sub></p>
      <div class="balance-vocabulary">
        <span><b>Effet frigorifique</b>Énergie absorbée à l’évaporateur par kilogramme de fluide frigorigène.</span>
        <span><b>Chaleur de compression</b>Énergie ajoutée au fluide frigorigène par le compresseur.</span>
      </div>
    </div>`;
}

const synthesisData = {
  compresseur: {
    title: "Compresseur",
    badge: "ÉNERGIE MÉCANIQUE → FLUIDE FRIGORIGÈNE",
    copy: "Il aspire la vapeur BP, la comprime, la refoule en vapeur HP et maintient la circulation. La température augmente.",
    state: "Entrée : vapeur BP surchauffée · Sortie : vapeur HP très chaude"
  },
  condenseur: {
    title: "Condenseur",
    badge: "CHALEUR REJETÉE",
    copy: "Désurchauffe sensible, liquéfaction latente, puis sous-refroidissement sensible. L’air ressort plus chaud.",
    state: "Entrée : vapeur HP · Sortie : liquide HP sous-refroidi"
  },
  detendeur: {
    title: "Détendeur",
    badge: "CHUTE DE PRESSION",
    copy: "Il fait passer de HP vers BP et dose le débit massique. Il prépare le fluide frigorigène à absorber de la chaleur.",
    state: "Entrée : liquide HP · Sortie : mélange liquide + vapeur BP"
  },
  evaporateur: {
    title: "Évaporateur",
    badge: "CHALEUR ABSORBÉE",
    copy: "Évaporation latente jusqu’à la dernière goutte, puis surchauffe sensible. L’air ressort plus froid.",
    state: "Entrée : mélange BP · Sortie : vapeur BP surchauffée"
  }
};

function renderSynthesis() {
  return `
    <div class="synthesis-layout">
      ${circuitMarkup(true)}
      <article class="synthesis-panel" id="synthesis-panel">
        <span id="synthesis-badge">${synthesisData.compresseur.badge}</span>
        <h3 id="synthesis-title">${synthesisData.compresseur.title}</h3>
        <p id="synthesis-copy">${synthesisData.compresseur.copy}</p>
        <b class="synthesis-state" id="synthesis-state">${synthesisData.compresseur.state}</b>
        <small>Cliquez un organe ou laissez la lecture automatique suivre le cycle.</small>
      </article>
    </div>`;
}

const quizQuestions = [
  {
    question: "Quelle affirmation distingue correctement T, Q et Q̇ ?",
    answers: ["T est une énergie, Q une température et Q̇ une masse", "T décrit l’état, Q est une énergie transférée et Q̇ une puissance", "Les trois grandeurs s’expriment en watts"],
    correct: 1,
    why: "T s’exprime en °C ou K, Q en joules et Q̇ en watts."
  },
  {
    question: "À quoi sert la relation Q = m × c × ΔT ?",
    answers: ["Calculer une chaleur sensible", "Calculer une chaleur latente", "Calculer une pression de saturation"],
    correct: 0,
    why: "Elle calcule l’énergie sensible transférée lorsqu’il n’y a pas de changement d’état."
  },
  {
    question: "Quelle relation correspond à un changement d’état ?",
    answers: ["Q = m × L", "Q = m ÷ ΔT", "Q̇ = P × T"],
    correct: 0,
    why: "La chaleur latente se calcule avec Q = m × L, L étant la chaleur latente massique."
  },
  {
    question: "Pourquoi utilise-t-on le débit massique ṁ dans un échangeur traversé en permanence ?",
    answers: ["Parce que le volume est toujours constant", "Parce que l’on suit une masse de fluide par unité de temps", "Parce que la masse volumique ne varie jamais"],
    correct: 1,
    why: "ṁ s’exprime en kilogrammes par seconde. Le volume occupé dépend de l’état et de la masse volumique."
  },
  {
    question: "Entre le point de bulle et le point de rosée, dans quel état se trouve le fluide ?",
    answers: ["Liquide sous-refroidi uniquement", "Vapeur surchauffée uniquement", "Mélange liquide + vapeur à l’état saturé"],
    correct: 2,
    why: "Dans la zone saturée, les phases liquide et vapeur coexistent."
  },
  {
    question: "Que signifie le glissement d’un mélange zéotrope ?",
    answers: ["La pression devient nulle", "La température évolue entre le point de bulle et le point de rosée", "Le compresseur tourne moins vite"],
    correct: 1,
    why: "Dans un mélange zéotrope, les températures de bulle et de rosée sont différentes."
  },
  {
    question: "Dans l’évaporateur, quel échange produit l’effet frigorifique ?",
    answers: ["La chaleur passe de l’air vers le fluide frigorigène", "La chaleur passe du fluide frigorigène vers l’air", "La chaleur disparaît au détendeur"],
    correct: 0,
    why: "Le fluide frigorigène absorbe la chaleur de l’air, qui ressort plus froid."
  },
  {
    question: "Quand commence la surchauffe utile dans l’évaporateur ?",
    answers: ["Avant l’apparition de la première bulle", "Après la disparition de la dernière goutte, au point de rosée", "Après le sous-refroidissement"],
    correct: 1,
    why: "La surchauffe commence lorsque le fluide est entièrement vapeur."
  },
  {
    question: "La surchauffe est…",
    answers: ["Une température lue directement au thermomètre", "Une différence entre température réelle de vapeur et température de saturation à la même pression", "Une pression différentielle"],
    correct: 1,
    why: "Elle s’exprime en kelvins et nécessite la température réelle ainsi que la température de saturation."
  },
  {
    question: "Quand débute le sous-refroidissement dans le condenseur ?",
    answers: ["Après la disparition de la dernière bulle, au point de bulle", "Dès l’entrée de la vapeur HP", "Uniquement après le détendeur"],
    correct: 0,
    why: "Après le point de bulle, le fluide est entièrement liquide et peut être sous-refroidi."
  },
  {
    question: "Le sous-refroidissement est…",
    answers: ["T liquide réelle − T saturation rosée", "T saturation bulle − T liquide réelle, à la même pression", "La température de l’air sortant"],
    correct: 1,
    why: "C’est une différence de températures exprimée en kelvins, établie côté liquide."
  },
  {
    question: "Quel bilan est correct en régime établi ?",
    answers: ["Q̇ condenseur = Q̇ évaporateur − puissance du compresseur", "Q̇ condenseur = Q̇ évaporateur", "Q̇ condenseur = Q̇ évaporateur + puissance transmise par le compresseur"],
    correct: 2,
    why: "Le condenseur rejette la chaleur absorbée à l’évaporateur plus l’énergie transmise au fluide frigorigène par le compresseur."
  }
];

function renderQuiz() {
  return `<div class="quiz-shell" id="quiz-shell"></div>`;
}

function wireWaterExchange() {
  // Ne JAMAIS demarrer en pause sur prefers-reduced-motion : sur une machine aux
  // effets Windows desactives, la demonstration semblerait morte. Le bouton
  // pause/lecture reste le seul maitre.
  let paused = false;
  let origin = performance.now();
  let pauseAt = 0;
  const duration = 8000;
  const hold = 1800;
  const hot = $("#hot-temperature");
  const cold = $("#cold-temperature");
  const state = $("#exchange-state");
  const button = $("#exchange-control");
  let frame;

  const draw = now => {
    if (!paused) {
      const elapsed = (now - origin) % (duration + hold);
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      hot.textContent = `${(60 - 20 * eased).toFixed(1).replace(".", ",")} °C`;
      cold.textContent = `${(20 + 20 * eased).toFixed(1).replace(".", ",")} °C`;
      state.textContent = progress < 1 ? "En cours vers l’équilibre" : "Équilibre thermique atteint";
      $(".water-lab").classList.toggle("at-equilibrium", progress >= 1);
    }
    frame = requestAnimationFrame(draw);
  };

  button.textContent = paused ? "Reprendre" : "Pause";
  button.addEventListener("click", () => {
    paused = !paused;
    if (paused) pauseAt = performance.now();
    else origin += performance.now() - pauseAt;
    button.textContent = paused ? "Reprendre" : "Pause";
  });
  frame = requestAnimationFrame(draw);
  stageCleanup = () => cancelAnimationFrame(frame);
}

function wireEnergyCalculator() {
  const fields = ["#material", "#mass", "#temperature-initial", "#temperature-final"].map(selector => $(selector));
  const update = () => {
    const material = Number($("#material").value);
    const materialName = $("#material").selectedOptions[0].textContent.split("·")[0].trim().toLowerCase();
    const mass = Math.max(0, Number($("#mass").value) || 0);
    const initial = Number($("#temperature-initial").value) || 0;
    const final = Number($("#temperature-final").value) || 0;
    const delta = final - initial;
    const q = mass * material * delta;
    $("#energy-result").textContent = `${fr.format(Math.abs(q) / 1000)} kJ`;
    $("#energy-direction").textContent = delta >= 0 ? `Énergie reçue par ${articleFor(materialName)}` : `Énergie cédée par ${articleFor(materialName)}`;
    $("#energy-steps").textContent = `${fr.format(mass)} × ${fr.format(material)} × ${fr.format(Math.abs(delta))} = ${fr.format(Math.abs(q))} J`;
  };
  fields.forEach(field => field.addEventListener("input", update));
  update();
}

function articleFor(material) {
  if (material.startsWith("eau")) return "l’eau";
  if (material.startsWith("air")) return "l’air";
  return "le cuivre";
}

function wirePowerCalculator() {
  const fields = ["#mass-flow", "#air-cp", "#air-in", "#air-out"].map(selector => $(selector));
  const update = () => {
    const flow = Math.max(0, Number($("#mass-flow").value) || 0);
    const cp = Math.max(0, Number($("#air-cp").value) || 0);
    const input = Number($("#air-in").value) || 0;
    const output = Number($("#air-out").value) || 0;
    const delta = Math.abs(output - input);
    const power = flow * cp * delta;
    $("#power-result").textContent = `${fr.format(power / 1000)} kW`;
    $("#power-steps").textContent = `${fr.format(flow)} × ${fr.format(cp)} × ${fr.format(delta)} = ${fr.format(power)} W`;
    $(".power-result span").textContent = output < input ? "L’air cède au fluide frigorigène" : output > input ? "L’air reçoit du fluide frigorigène" : "Aucun échange sensible mesurable";
  };
  fields.forEach(field => field.addEventListener("input", update));
  update();
}

function wireLatent() {
  const slider = $("#phase-slider");
  const marker = $("#phase-marker");
  const vessel = $("#phase-vessel");
  const temperature = $("#phase-temperature");
  const title = $("#phase-title");
  const copy = $("#phase-copy");
  const control = $("#phase-control");
  // Ne JAMAIS demarrer en pause sur prefers-reduced-motion : sur une machine aux
  // effets Windows desactives, la demonstration semblerait morte. Le bouton
  // pause/lecture reste le seul maitre.
  let paused = false;
  let value = 0;
  let previous = performance.now();
  let frame;

  const update = next => {
    value = Math.max(0, Math.min(100, next));
    slider.value = String(value);
    marker.style.left = `${value}%`;
    if (value < 35) {
      const temp = 20 + (value / 35) * 80;
      vessel.dataset.phase = "liquid";
      temperature.textContent = `${Math.round(temp)} °C`;
      title.textContent = "Chaleur sensible · liquide";
      copy.textContent = "La température augmente sans changement d’état.";
    } else if (value < 75) {
      vessel.dataset.phase = "boiling";
      temperature.textContent = "100 °C";
      title.textContent = "Chaleur latente · vaporisation";
      copy.textContent = "L’énergie continue d’entrer ; le liquide devient vapeur à température presque stable.";
    } else {
      const temp = 100 + ((value - 75) / 25) * 20;
      vessel.dataset.phase = "vapor";
      temperature.textContent = `${Math.round(temp)} °C`;
      title.textContent = "Chaleur sensible · vapeur";
      copy.textContent = "La vapeur est entièrement formée et sa température augmente.";
    }
  };

  const draw = now => {
    if (!paused) {
      value += (now - previous) / 130;
      if (value > 100) value = 0;
      update(value);
    }
    previous = now;
    frame = requestAnimationFrame(draw);
  };

  slider.addEventListener("input", () => {
    paused = true;
    control.textContent = "Reprendre";
    update(Number(slider.value));
  });
  control.textContent = paused ? "Reprendre" : "Pause";
  control.addEventListener("click", () => {
    paused = !paused;
    control.textContent = paused ? "Reprendre" : "Pause";
  });
  update(0);
  frame = requestAnimationFrame(draw);
  stageCleanup = () => cancelAnimationFrame(frame);
}

function wireEnergyBalance() {
  const update = () => {
    const evap = Number($("#evap-power").value);
    const comp = Number($("#comp-power").value);
    const cond = evap + comp;
    $("#evap-value").textContent = `${fr.format(evap)} kW`;
    $("#comp-value").textContent = `${fr.format(comp)} kW`;
    $("#cond-value").textContent = `${fr.format(cond)} kW`;
    const evapShare = (evap / cond) * 100;
    $("#evap-bar").style.width = `${evapShare}%`;
    $("#comp-bar").style.width = `${100 - evapShare}%`;
  };
  $("#evap-power").addEventListener("input", update);
  $("#comp-power").addEventListener("input", update);
  update();
}

function wireSynthesis() {
  const order = ["compresseur", "condenseur", "detendeur", "evaporateur"];
  let index = 0;
  let timer;
  const activate = id => {
    const data = synthesisData[id];
    $$("[data-circuit-organ]").forEach(button => button.classList.toggle("active", button.dataset.circuitOrgan === id));
    $("#synthesis-badge").textContent = data.badge;
    $("#synthesis-title").textContent = data.title;
    $("#synthesis-copy").textContent = data.copy;
    $("#synthesis-state").textContent = data.state;
    index = order.indexOf(id);
  };
  $$("[data-circuit-organ]").forEach(button => button.addEventListener("click", () => {
    activate(button.dataset.circuitOrgan);
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index + 1) % order.length;
      activate(order[index]);
    }, 5000);
  }));
  activate(order[0]);
  timer = setInterval(() => {
    index = (index + 1) % order.length;
    activate(order[index]);
  }, 5000);
  stageCleanup = () => clearInterval(timer);
}

function wireQuiz() {
  let questionIndex = 0;
  let score = 0;
  const shell = $("#quiz-shell");

  const draw = () => {
    if (questionIndex >= quizQuestions.length) {
      const success = score >= 9;
      shell.innerHTML = `
        <div class="quiz-finish ${success ? "success" : ""}">
          <span>${success ? "SEUIL DE MAÎTRISE ATTEINT" : "SEUIL : 9 BONNES RÉPONSES SUR 12"}</span>
          <strong>${score} / ${quizQuestions.length}</strong>
          <h3>${success ? "Les échanges thermiques sont compris." : "Reprenez les écrans signalés par les corrections."}</h3>
          <button class="primary-button" id="quiz-restart" type="button">Recommencer le quiz</button>
        </div>`;
      $("#quiz-restart").addEventListener("click", () => {
        questionIndex = 0;
        score = 0;
        draw();
      });
      return;
    }

    const item = quizQuestions[questionIndex];
    shell.innerHTML = `
      <div class="quiz-progress"><span>Question ${questionIndex + 1} / ${quizQuestions.length}</span><b>${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""}</b></div>
      <h3>${item.question}</h3>
      <div class="quiz-answers">
        ${item.answers.map((answer, index) => `<button type="button" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join("")}
      </div>
      <div class="quiz-feedback" id="quiz-feedback" hidden></div>
      <button class="primary-button quiz-next" id="quiz-next" type="button" hidden>Question suivante →</button>`;

    $$("[data-answer]", shell).forEach(button => button.addEventListener("click", () => {
      const choice = Number(button.dataset.answer);
      const correct = choice === item.correct;
      if (correct) score += 1;
      $$("[data-answer]", shell).forEach(answerButton => {
        answerButton.disabled = true;
        const answerIndex = Number(answerButton.dataset.answer);
        answerButton.classList.toggle("correct", answerIndex === item.correct);
        answerButton.classList.toggle("wrong", answerIndex === choice && !correct);
      });
      const feedback = $("#quiz-feedback");
      feedback.hidden = false;
      feedback.className = `quiz-feedback ${correct ? "correct" : "wrong"}`;
      feedback.innerHTML = `<b>${correct ? "Correct." : "À corriger."}</b> ${item.why}`;
      $("#quiz-next").hidden = false;
    }));

    $("#quiz-next").addEventListener("click", () => {
      questionIndex += 1;
      draw();
    });
  };
  draw();
}

function buildStepper() {
  $("#stepper").innerHTML = stages.map((stage, index) => `
    <button type="button" data-step="${index}" aria-label="Étape ${index + 1} : ${stage.short}">
      <span>${index + 1}</span><b>${stage.short}</b>
    </button>`).join("");
  $$("[data-step]").forEach(button => button.addEventListener("click", () => goToStage(Number(button.dataset.step), true)));
}

function goToStage(index, scroll = false) {
  if (stageCleanup) {
    stageCleanup();
    stageCleanup = null;
  }
  stopSpeech();
  currentStage = Math.max(0, Math.min(stages.length - 1, index));
  const stage = stages[currentStage];
  $("#lesson-kicker").textContent = stage.kicker;
  $("#lesson-title").textContent = stage.title;
  $("#lesson-intro").textContent = stage.intro;
  $("#lesson-zone").innerHTML = stage.render();
  if (stage.wire) stage.wire();
  $("#progress-label").textContent = `Étape ${currentStage + 1} sur ${stages.length}`;
  $("#step-count").textContent = `${currentStage + 1} / ${stages.length}`;
  $("#progress-bar").style.width = `${((currentStage + 1) / stages.length) * 100}%`;
  $("#previous").disabled = currentStage === 0;
  $("#next").textContent = currentStage === stages.length - 1 ? "Voir la synthèse ↓" : "Continuer →";
  $$("[data-step]").forEach(button => {
    const step = Number(button.dataset.step);
    button.classList.toggle("active", step === currentStage);
    button.classList.toggle("done", step < currentStage);
    button.setAttribute("aria-current", step === currentStage ? "step" : "false");
  });
  safeStorageSet("inerweb-thermo-stage", String(currentStage));
  if (scroll && !document.body.classList.contains("course-running")) {
    $("#module").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Le stockage local reste facultatif.
  }
}

function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Le stockage local reste facultatif.
  }
}

function voiceKey(voice) {
  return `${voice.voiceURI || ""}|${voice.name}|${voice.lang}`;
}

function voiceQuality(voice) {
  const label = `${voice.name} ${voice.voiceURI || ""}`.toLowerCase();
  const lang = String(voice.lang || "").replace("_", "-").toLowerCase();
  const isFrench = lang.startsWith("fr");
  const isFrance = lang === "fr-fr" || /french\s*\(france\)|français\s*\(france\)/i.test(label);
  const isNatural = /natural|naturel|neural/.test(label);
  const isOnline = /online|google/.test(label);
  const isLegacyDesktop = /desktop/.test(label) && !isNatural;
  const namePreference = /julie/.test(label) ? 45
    : /paul/.test(label) ? 40
      : /denise/.test(label) ? 35
        : /henri/.test(label) ? 30
          : /hortense/.test(label) ? 5
            : 0;

  let family = 0;
  if (isFrance && (isNatural || isOnline)) family = 4;
  else if (isFrance) family = 3;
  else if (isFrench && (isNatural || isOnline)) family = 2;
  else if (isFrench) family = 1;

  return family * 1000
    + (isNatural ? 180 : 0)
    + (isOnline ? 90 : 0)
    + (/microsoft/.test(label) ? 40 : 0)
    + namePreference
    + (voice.default ? 5 : 0)
    - (isLegacyDesktop ? 60 : 0);
}

function voiceDisplayName(voice) {
  return `${voice.name.replace(/\s*-\s*French\s*\(France\)\s*/i, "").trim()} · ${voice.lang}`;
}

function chooseVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const ranked = [...voices]
    .filter(voice => /^fr(?:-|_)/i.test(voice.lang))
    .sort((a, b) => voiceQuality(b) - voiceQuality(a) || a.name.localeCompare(b.name, "fr"));
  const previousKey = selectedVoiceKey;
  const manualMatch = voiceChoiceIsManual && previousKey
    ? ranked.find(voice => voiceKey(voice) === previousKey)
    : null;

  selectedVoice = manualMatch || ranked[0] || voices[0] || null;
  selectedVoiceKey = selectedVoice ? voiceKey(selectedVoice) : "";

  const select = $("#voice-choice");
  if (!select) return;
  if (!ranked.length) {
    select.innerHTML = '<option value="">Voix française indisponible</option>';
    select.disabled = true;
    $("#speech-warning").textContent = "Aucune voix française n’est disponible dans ce navigateur. Le contenu écrit reste complet.";
    $("#speech-warning").hidden = false;
    return;
  }

  select.disabled = false;
  select.innerHTML = ranked.map(voice => {
    const key = voiceKey(voice);
    return `<option value="${escapeAttribute(key)}">${escapeHtml(voiceDisplayName(voice))}</option>`;
  }).join("");
  select.value = selectedVoiceKey;
  select.title = selectedVoice ? `Voix utilisée : ${voiceDisplayName(selectedVoice)}` : "";
  $("#speech-warning").hidden = true;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function prepareSpeechText(text) {
  return String(text)
    .replace(/\bHP\b/g, "haute pression")
    .replace(/\bBP\b/g, "basse pression")
    .replace(/\bQ̇\b/g, "Q point")
    .replace(/\bṁ\b/g, "m point")
    .replace(/\bΔT\b/g, "delta T")
    .replace(/\bc\s*p\b/gi, "cé pé")
    .replace(/\bkW\b/g, "kilowatts")
    .replace(/\bW\b/g, "watts")
    .replace(/\bkg\b/g, "kilogrammes")
    .replace(/°C/g, "degrés Celsius")
    .replace(/→/g, "vers")
    .replace(/\s+/g, " ")
    .trim();
}

function narrationChunks(text) {
  return prepareSpeechText(text)
    .split(/(?<=[.!?;])\s+/)
    .map(chunk => chunk.trim())
    .filter(Boolean);
}

function updateSpeechControls(hasBeenRead = false) {
  $("#listen").textContent = speechActive || hasBeenRead ? "Réécouter" : "Écouter";
  $("#pause").disabled = !speechActive;
  $("#pause").textContent = speechPaused ? "Reprendre" : "Pause";
}

function finishSpeech(run) {
  if (run !== speechRun) return;
  speechActive = false;
  speechPaused = false;
  speechChunks = [];
  speechChunkIndex = 0;
  updateSpeechControls(true);
}

function speakNextChunk(run) {
  if (run !== speechRun || !speechActive) return;
  if (speechChunkIndex >= speechChunks.length) {
    finishSpeech(run);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(speechChunks[speechChunkIndex]);
  utterance.lang = selectedVoice?.lang || "fr-FR";
  utterance.pitch = 1;
  utterance.rate = voiceRates[rateIndex];
  utterance.volume = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => {
    if (run !== speechRun) return;
    speechPaused = false;
    updateSpeechControls(true);
  };
  utterance.onend = () => {
    if (run !== speechRun || !speechActive) return;
    speechChunkIndex += 1;
    speechTimer = window.setTimeout(() => speakNextChunk(run), 120);
  };
  utterance.onerror = event => {
    if (run !== speechRun) return;
    if (event.error === "canceled" || event.error === "interrupted") return;
    $("#speech-warning").textContent = "La voix du navigateur a rencontré un problème. Le contenu écrit reste complet.";
    $("#speech-warning").hidden = false;
    finishSpeech(run);
  };
  window.speechSynthesis.speak(utterance);
}

function speakCurrent() {
  if (!("speechSynthesis" in window)) {
    $("#speech-warning").hidden = false;
    return;
  }
  stopSpeech();
  chooseVoice();
  speechChunks = narrationChunks(stages[currentStage].narration);
  speechChunkIndex = 0;
  speechActive = speechChunks.length > 0;
  speechPaused = false;
  const run = speechRun;
  updateSpeechControls(true);
  speakNextChunk(run);
}

function stopSpeech() {
  speechRun += 1;
  speechActive = false;
  speechPaused = false;
  speechChunks = [];
  speechChunkIndex = 0;
  if (speechTimer !== null) {
    window.clearTimeout(speechTimer);
    speechTimer = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
  }
  updateSpeechControls(false);
}

function resetCourse() {
  safeStorageRemove("inerweb-thermo-stage");
  document.body.classList.add("course-running");
  goToStage(0, false);
}

function enterCourse() {
  document.body.classList.add("course-running");
  goToStage(currentStage, false);
}

function leaveCourseForSummary() {
  stopSpeech();
  document.body.classList.remove("course-running");
  $(".takeaway").scrollIntoView({ behavior: "smooth", block: "start" });
}

buildStepper();
if ("speechSynthesis" in window) {
  chooseVoice();
  window.speechSynthesis.addEventListener("voiceschanged", chooseVoice);
} else {
  $("#voice-choice").disabled = true;
  $("#listen").disabled = true;
  $("#speech-warning").hidden = false;
}

const savedRateValue = safeStorageGet("inerweb-thermo-voice-rate");
const savedRate = savedRateValue === null ? Number.NaN : Number(savedRateValue);
if (Number.isInteger(savedRate) && savedRate >= 0 && savedRate < voiceRates.length) rateIndex = savedRate;
$("#rate-label").textContent = `${String(voiceRates[rateIndex]).replace(".", ",")}×`;

$("#listen").addEventListener("click", speakCurrent);
$("#pause").addEventListener("click", () => {
  if (!speechActive || !("speechSynthesis" in window)) return;
  if (speechPaused) {
    window.speechSynthesis.resume();
    speechPaused = false;
  } else {
    window.speechSynthesis.pause();
    speechPaused = true;
  }
  updateSpeechControls(true);
});
$("#voice-choice").addEventListener("change", event => {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices.find(voice => voiceKey(voice) === event.target.value) || selectedVoice;
  selectedVoiceKey = selectedVoice ? voiceKey(selectedVoice) : "";
  voiceChoiceIsManual = true;
  if (speechActive) speakCurrent();
});
$("#slower").addEventListener("click", () => {
  rateIndex = Math.max(0, rateIndex - 1);
  $("#rate-label").textContent = `${String(voiceRates[rateIndex]).replace(".", ",")}×`;
  safeStorageSet("inerweb-thermo-voice-rate", String(rateIndex));
  if (speechActive) speakCurrent();
});
$("#faster").addEventListener("click", () => {
  rateIndex = Math.min(voiceRates.length - 1, rateIndex + 1);
  $("#rate-label").textContent = `${String(voiceRates[rateIndex]).replace(".", ",")}×`;
  safeStorageSet("inerweb-thermo-voice-rate", String(rateIndex));
  if (speechActive) speakCurrent();
});
$("#previous").addEventListener("click", () => goToStage(currentStage - 1, false));
$("#next").addEventListener("click", () => {
  if (currentStage === stages.length - 1) leaveCourseForSummary();
  else goToStage(currentStage + 1, false);
});
$("#start-course").addEventListener("click", enterCourse);
$("#restart-top").addEventListener("click", resetCourse);
$("#restart-bottom").addEventListener("click", resetCourse);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopSpeech();
});
window.addEventListener("pagehide", stopSpeech);

goToStage(0);
