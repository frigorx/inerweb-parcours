"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const icon = (id, label = "") =>
  `<svg role="${label ? "img" : "presentation"}" ${label ? `aria-label="${label}"` : "aria-hidden=\"true\""}><use href="#${id}"></use></svg>`;

const symbolBox = (id, label, extra = "") =>
  `<span class="symbol-wrap ${extra}">${icon(id, label)}</span>`;

const circuitMarkup = ({ active = "", states = true } = {}) => `
  <div class="circuit-map" aria-label="Circuit frigorifique animé : vapeur haute pression chaude en rouge, liquide haute pression en orange, mélange basse pression en bleu et vapeur basse pression en bleu ciel">
    <div class="pipe-loop" aria-hidden="true"></div>
    <div class="flow-track flow-h flow-west flow-hot segment-top-right" aria-hidden="true"><span>←</span><span>←</span></div>
    <div class="flow-track flow-v flow-north flow-hot segment-right-upper" aria-hidden="true"><span>↑</span><span>↑</span></div>
    <div class="flow-track flow-h flow-west flow-liquid segment-top-left" aria-hidden="true"><span>←</span><span>←</span></div>
    <div class="flow-track flow-v flow-south flow-liquid segment-left-upper" aria-hidden="true"><span>↓</span><span>↓</span></div>
    <div class="flow-track flow-v flow-south flow-mixture segment-left-lower" aria-hidden="true"><span>↓</span><span>↓</span></div>
    <div class="flow-track flow-h flow-east flow-mixture segment-bottom-left" aria-hidden="true"><span>→</span><span>→</span></div>
    <div class="flow-track flow-h flow-east flow-suction segment-bottom-right" aria-hidden="true"><span>→</span><span>→</span></div>
    <div class="flow-track flow-v flow-north flow-suction segment-right-lower" aria-hidden="true"><span>↑</span><span>↑</span></div>
    <div class="circuit-organ top ${active === "condenseur" ? "active" : ""}" data-organ="condenseur">
      ${icon("sym-echangeur-air", "Symbole du condenseur à air")}
      <strong>CONDENSEUR</strong>
    </div>
    <div class="circuit-organ right ${active === "compresseur" ? "active" : ""}" data-organ="compresseur">
      ${icon("sym-compresseur-general", "Symbole du compresseur")}
      <strong>COMPRESSEUR</strong>
    </div>
    <div class="circuit-organ bottom ${active === "evaporateur" ? "active" : ""}" data-organ="evaporateur">
      ${icon("sym-echangeur-air", "Symbole de l’évaporateur à air")}
      <strong>ÉVAPORATEUR</strong>
    </div>
    <div class="circuit-organ left ${active === "detendeur" ? "active" : ""}" data-organ="detendeur">
      ${icon("sym-detendeur-thermo", "Symbole du détendeur thermostatique à égalisation externe")}
      <strong>DÉTENDEUR</strong>
    </div>
    ${states ? `
      <span class="state-tag state-ne state-hot"><b>Vapeur HP</b>TRÈS CHAUDE</span>
      <span class="state-tag state-nw state-liquid"><b>Liquide HP</b>CHAUD À TIÈDE</span>
      <span class="state-tag state-sw state-mixture"><b>Mélange BP</b>TRÈS FROID</span>
      <span class="state-tag state-se state-suction"><b>Vapeur BP</b>FROIDE</span>
    ` : ""}
  </div>`;

const flowLegendMarkup = () => `
  <div class="flow-legend" aria-label="Légende des couleurs du fluide frigorigène">
    <span class="legend-hot"><i aria-hidden="true">1</i><b>Rouge · très chaud</b> Vapeur HP après le compresseur</span>
    <span class="legend-liquid"><i aria-hidden="true">2</i><b>Orange · chaud à tiède</b> Liquide HP après le condenseur</span>
    <span class="legend-mixture"><i aria-hidden="true">3</i><b>Bleu · très froid</b> Mélange BP après le détendeur</span>
    <span class="legend-suction"><i aria-hidden="true">4</i><b>Bleu ciel · froid</b> Vapeur BP après l’évaporateur</span>
  </div>`;

const massRuleMarkup = () => `
  <div class="mass-rule">
    <span class="mass-rule-icon" aria-hidden="true">m</span>
    <div>
      <b>On suit une masse, pas un volume</b>
      <p>Exemple : on peut suivre <strong>100 g de fluide frigorigène</strong>. Cette même masse occupe un volume différent selon qu’elle est liquide, vapeur ou mélange.</p>
      <small>En régime établi, le débit massique se conserve. La masse volumique et le volume massique, eux, varient avec l’état du fluide.</small>
    </div>
  </div>`;

const professionalDefinitions = {
  compresseur: {
    name: "Compresseur",
    transition: "Vapeur BP → vapeur HP",
    text: "Le compresseur aspire le fluide frigorigène à l’état vapeur en basse pression (BP), le comprime et le refoule à l’état vapeur en haute pression (HP). Il met le fluide frigorigène en mouvement et assure sa circulation dans le circuit frigorifique."
  },
  condenseur: {
    name: "Condenseur",
    transition: "Vapeur HP → liquide HP",
    text: "Le condenseur assure la liquéfaction du fluide frigorigène par échange de chaleur avec l’air extérieur. Le fluide frigorigène entre à l’état vapeur HP, se liquéfie, puis ressort à l’état liquide HP sous-refroidi."
  },
  detendeur: {
    name: "Détendeur",
    transition: "Liquide HP → mélange BP",
    text: "Le détendeur fait chuter la pression du fluide frigorigène de la haute pression (HP) vers la basse pression (BP). Il dose le débit massique de fluide frigorigène admis dans l’évaporateur."
  },
  evaporateur: {
    name: "Évaporateur",
    transition: "Mélange BP → vapeur BP",
    text: "L’évaporateur permet l’évaporation du fluide frigorigène par échange de chaleur avec le milieu à refroidir. Les deux milieux sont à des températures différentes : le fluide frigorigène absorbe la chaleur et passe du mélange BP à l’état de vapeur BP."
  }
};

const definitionMarkup = key => {
  const definition = professionalDefinitions[key];
  return `
    <div class="professional-definition">
      <span>À CONNAÎTRE PAR CŒUR</span>
      <div><b>${definition.name}</b><strong>${definition.transition}</strong></div>
      <p>${definition.text}</p>
    </div>`;
};

const stages = [
  {
    short: "Mission",
    kicker: "ÉTAPE 1 · OUVRIR LE CAISSON",
    title: "Les quatre définitions métier",
    intro: "Cliquez sur chaque symbole, puis lisez sa définition à voix haute. Ces formulations doivent être connues par cœur.",
    narration: `Bienvenue dans le caisson technique. Les quatre définitions suivantes sont à connaître par cœur. ${professionalDefinitions.compresseur.text} ${professionalDefinitions.condenseur.text} ${professionalDefinitions.detendeur.text} ${professionalDefinitions.evaporateur.text}`,
    render: renderMission,
    wire: wireMission
  },
  {
    short: "La croix",
    kicker: "ÉTAPE 2 · VUE D’ENSEMBLE",
    title: "La croix et les niveaux thermiques",
    intro: "Mémorisez la place des quatre organes, le sens de circulation et les zones très chaude, chaude, très froide et froide.",
    narration: "Mémorisez la croix du frigoriste. Le condenseur est en haut. Le détendeur est à gauche. Le compresseur est à droite. L’évaporateur est en bas. Après le compresseur, le fluide frigorigène est à l’état vapeur haute pression et très chaud : le trajet est rouge. Après le condenseur, il est liquide haute pression, chaud à tiède : le trajet est orange. Après le détendeur, il est sous forme de mélange basse pression et très froid : le trajet est bleu. Après l’évaporateur, il est à l’état vapeur basse pression, encore froid : le trajet est bleu ciel. Les flèches se déplacent en permanence dans le sens de circulation. Le même débit massique traverse les quatre organes.",
    render: renderCross
  },
  {
    short: "Compression",
    kicker: "ÉTAPE 3 · ORGANE ACTIF",
    title: "Le compresseur met le cycle en mouvement",
    intro: "Il aspire le fluide frigorigène à l’état vapeur en BP, le comprime, le refoule en HP et assure sa circulation.",
    narration: `${professionalDefinitions.compresseur.text} C’est le seul organe actif du cycle. Les autres organes sont passifs. Le compresseur est lubrifié par de l’huile. Une partie de cette huile peut être entraînée et circuler avec le fluide frigorigène ; elle doit revenir au compresseur pour maintenir la lubrification.`,
    render: renderCompressor
  },
  {
    short: "Technologies",
    kicker: "ÉTAPE 4 · VOIR LE MOUVEMENT",
    title: "Piston, scroll ou vis : cliquez pour comprendre",
    intro: "Les trois technologies compriment le fluide frigorigène, mais leur mécanisme n’est pas le même.",
    narration: "Choisissez une technologie. Dans un compresseur à piston, le va-et-vient augmente puis réduit le volume du cylindre : le fluide frigorigène est aspiré puis refoulé. Dans un scroll, une spirale orbite dans une spirale fixe ; les poches se déplacent vers le centre et leur volume diminue. Dans un compresseur à vis, deux rotors hélicoïdaux emprisonnent des poches de fluide frigorigène, les déplacent vers le refoulement et réduisent progressivement leur volume. Dans les trois cas, le fluide frigorigène entre en vapeur BP et ressort en vapeur HP.",
    render: renderCompressorTechnologies,
    wire: wireCompressorTechnologies
  },
  {
    short: "Condenseur",
    kicker: "ÉTAPE 5 · ÉCHANGE AVEC L’AIR",
    title: "Au condenseur, l’air ressort plus chaud",
    intro: "Le fluide frigorigène rejette de la chaleur dans l’air qui traverse la batterie.",
    narration: `${professionalDefinitions.condenseur.text} Les ventilateurs forcent l’air à travers la batterie. L’air entre à une température plus basse, reçoit la chaleur rejetée par le fluide frigorigène et ressort plus chaud. Le condenseur rejette la chaleur prise à l’évaporateur, plus la chaleur apportée par la compression.`,
    render: renderCondenserAir
  },
  {
    short: "Liquéfaction",
    kicker: "ÉTAPE 6 · DANS LE SERPENTIN",
    title: "Désurchauffe, liquéfaction, sous-refroidissement",
    intro: "Suivez automatiquement une même masse de fluide frigorigène dans le condenseur.",
    narration: "Dans le condenseur, la vapeur haute pression se refroidit d’abord par chaleur sensible. Ensuite, le fluide frigorigène se liquéfie en rejetant de la chaleur latente : sa température reste presque stable pendant le changement d’état. Après la disparition de la dernière bulle de vapeur, le liquide continue de se refroidir par chaleur sensible : cette zone est le sous-refroidissement.",
    render: () => renderPhaseSlide("condenser"),
    wire: () => wirePhaseLab("condenser")
  },
  {
    short: "Détente",
    kicker: "ÉTAPE 7 · CHUTER ET DOSER",
    title: "Le détendeur prépare l’évaporation",
    intro: "Il fait chuter la pression de HP vers BP et dose le débit massique admis dans l’évaporateur.",
    narration: `${professionalDefinitions.detendeur.text} Le détendeur thermostatique à égalisation externe utilise un bulbe et une prise de pression en sortie d’évaporateur. Le détendeur électronique utilise une sonde et un régulateur. Le tube capillaire est fixe et sans réglage. Sur la ligne liquide, le filtre déshydrateur se place avant le voyant et le détendeur.`,
    render: renderExpansionBasics
  },
  {
    short: "Régulation",
    kicker: "ÉTAPE 8 · MAINTENIR LA SURCHAUFFE",
    title: "Le détendeur thermostatique se corrige en permanence",
    intro: "Le bulbe, la membrane, le ressort et l’égalisation externe forment une boucle de régulation.",
    narration: "Le détendeur thermostatique régule la surchauffe. Si la surchauffe augmente, le bulbe se réchauffe, sa pression augmente, la membrane pousse le pointeau et le détendeur s’ouvre davantage. Le débit massique admis dans l’évaporateur augmente et la surchauffe redescend. Quand elle diminue, le détendeur se referme. La prise d’égalisation externe transmet sous la membrane la pression réelle en sortie d’évaporateur et tient compte des pertes de charge.",
    render: renderExpansionRegulation
  },
  {
    short: "Évaporateur",
    kicker: "ÉTAPE 9 · ÉCHANGE AVEC L’AIR",
    title: "À l’évaporateur, l’air ressort plus froid",
    intro: "L’air cède sa chaleur au fluide frigorigène lorsqu’il traverse la batterie.",
    narration: `${professionalDefinitions.evaporateur.text} Les ventilateurs forcent l’air à travers la batterie. L’air entre plus chaud, cède de la chaleur au fluide frigorigène et ressort plus froid. C’est cet échange qui refroidit le local ou le produit.`,
    render: renderEvaporatorAir
  },
  {
    short: "Évaporation",
    kicker: "ÉTAPE 10 · DANS LE SERPENTIN",
    title: "Évaporation puis surchauffe",
    intro: "Suivez automatiquement une même masse de fluide frigorigène dans l’évaporateur.",
    narration: "Dans la première zone, le mélange basse pression absorbe de la chaleur latente. Le fluide frigorigène s’évapore à température presque stable jusqu’à la disparition de la dernière goutte de liquide. Ensuite, la vapeur continue d’absorber de la chaleur sensible : sa température augmente. Cette zone, entièrement à l’état vapeur, est la surchauffe.",
    render: () => renderPhaseSlide("evaporator"),
    wire: () => wirePhaseLab("evaporator")
  },
  {
    short: "Suivre",
    kicker: "ÉTAPE 11 · MÉMORISER LE CYCLE",
    title: "Suivez le fluide frigorigène et la température",
    intro: "Cliquez les quatre organes dans l’ordre et observez l’état, la pression et le niveau thermique.",
    narration: "À vous de suivre une même masse de fluide frigorigène, et non un même volume. Commencez par le compresseur. Après chaque bon choix, observez la pression, la phase et le niveau thermique. L’ordre complet est compresseur, condenseur, détendeur, évaporateur.",
    render: renderFollowFluid,
    wire: wireFollowFluid
  },
  {
    short: "Défi final",
    kicker: "ÉTAPE 12 · VALIDATION",
    title: "Questions sur ce que vous venez de voir",
    intro: "10 questions, uniquement sur le fonctionnement présenté dans ce parcours.",
    narration: "Dernière étape. Répondez à dix questions portant uniquement sur les notions observées dans les animations et les slides précédentes. Le seuil de réussite est fixé à huit bonnes réponses sur dix.",
    render: renderQuiz,
    wire: wireQuiz
  }
];

function renderMission() {
  return `
    <div class="mission-grid">
      <button class="reveal-card" type="button" data-reveal="compresseur">
        ${symbolBox("sym-compresseur-general", "Compresseur")}
        <span class="organ-name">Compresseur</span>
        <span class="definition-label">À retenir par cœur</span>
        <span class="organ-action">${professionalDefinitions.compresseur.text}</span>
        <span class="organ-transition">${professionalDefinitions.compresseur.transition}</span>
      </button>
      <button class="reveal-card" type="button" data-reveal="condenseur">
        ${symbolBox("sym-echangeur-air", "Condenseur à air")}
        <span class="organ-name">Condenseur</span>
        <span class="definition-label">À retenir par cœur</span>
        <span class="organ-action">${professionalDefinitions.condenseur.text}</span>
        <span class="organ-transition">${professionalDefinitions.condenseur.transition}</span>
      </button>
      <button class="reveal-card" type="button" data-reveal="detendeur">
        ${symbolBox("sym-detendeur-thermo", "Détendeur thermostatique à égalisation externe")}
        <span class="organ-name">Détendeur</span>
        <span class="definition-label">À retenir par cœur</span>
        <span class="organ-action">${professionalDefinitions.detendeur.text}</span>
        <span class="organ-transition">${professionalDefinitions.detendeur.transition}</span>
      </button>
      <button class="reveal-card" type="button" data-reveal="evaporateur">
        ${symbolBox("sym-echangeur-air", "Évaporateur à air")}
        <span class="organ-name">Évaporateur</span>
        <span class="definition-label">À retenir par cœur</span>
        <span class="organ-action">${professionalDefinitions.evaporateur.text}</span>
        <span class="organ-transition">${professionalDefinitions.evaporateur.transition}</span>
      </button>
    </div>
    <p class="mission-feedback" id="mission-feedback" role="status">0 définition métier révélée sur 4.</p>`;
}

function renderCross() {
  return `
    <div class="circuit-layout">
      ${circuitMarkup()}
      <aside class="cross-panel compact-cross-panel">
        <span class="role-badge">À SAVOIR PAR CŒUR</span>
        <h3>Quatre zones thermiques qualitatives</h3>
        <div class="temperature-memory">
          <span class="temp-very-hot"><i>1</i><b>TRÈS CHAUD</b>Après le compresseur · vapeur HP</span>
          <span class="temp-warm"><i>2</i><b>CHAUD À TIÈDE</b>Après le condenseur · liquide HP</span>
          <span class="temp-very-cold"><i>3</i><b>TRÈS FROID</b>Après le détendeur · mélange BP</span>
          <span class="temp-cold"><i>4</i><b>FROID</b>Après l’évaporateur · vapeur BP</span>
        </div>
        ${massRuleMarkup()}
      </aside>
    </div>`;
}

const compressorTechnologyData = {
  piston: {
    title: "Compresseur à piston",
    symbol: "sym-compresseur-piston",
    label: "Piston",
    subtitle: "Un volume qui augmente puis diminue",
    bullets: [
      "Le piston descend : le volume du cylindre augmente.",
      "Le clapet d’aspiration s’ouvre et la vapeur BP entre.",
      "Le piston remonte : le volume diminue et la pression augmente.",
      "Le clapet de refoulement s’ouvre quand la pression devient suffisante.",
      "La vapeur HP est chassée ; la répétition crée le débit massique."
    ]
  },
  scroll: {
    title: "Compresseur scroll",
    symbol: "sym-compresseur-scroll",
    label: "Scroll",
    subtitle: "Des poches déplacées vers le centre",
    bullets: [
      "Une spirale est fixe ; l’autre effectue un mouvement orbital.",
      "La vapeur BP est emprisonnée dans des poches à la périphérie.",
      "Le mouvement orbital pousse ces poches vers le centre.",
      "Leur volume diminue progressivement : la pression augmente.",
      "La vapeur HP est refoulée au centre avec un débit presque continu."
    ]
  },
  vis: {
    title: "Compresseur à vis",
    symbol: "sym-compresseur-vis",
    label: "Vis",
    subtitle: "Deux rotors hélicoïdaux",
    bullets: [
      "Deux rotors hélicoïdaux engrènent et tournent en sens opposés.",
      "La vapeur BP est emprisonnée entre les rotors et le carter.",
      "Les poches se déplacent de l’aspiration vers le refoulement.",
      "Le volume emprisonné diminue le long des rotors.",
      "La vapeur ressort en HP avec une circulation continue."
    ]
  }
};

function compressorMechanismMarkup(type) {
  if (type === "piston") {
    return `
      <div class="mechanism mechanism-piston" role="img" aria-label="Animation d’un piston qui aspire la vapeur basse pression en descendant et refoule la vapeur haute pression en remontant">
        <span class="mechanism-port mech-bp">VAPEUR BP <i>→</i></span>
        <span class="mechanism-port mech-hp"><i>→</i> VAPEUR HP</span>
        <div class="piston-cylinder">
          <span class="piston-valve valve-in"></span><span class="piston-valve valve-out"></span>
          <div class="piston-head"></div><div class="piston-rod"></div>
        </div>
        <span class="cycle-label cycle-aspire">ASPIRE</span>
        <span class="cycle-label cycle-refoule">REFOULE</span>
      </div>`;
  }
  if (type === "scroll") {
    return `
      <div class="mechanism mechanism-scroll" role="img" aria-label="Animation de deux spirales scroll formant des poches qui se déplacent vers le centre et diminuent de volume">
        <span class="mechanism-port mech-bp">VAPEUR BP <i>→</i></span>
        <span class="mechanism-port mech-hp">CENTRE <i>→</i> HP</span>
        <div class="scroll-shell">
          <div class="scroll-fixed"><i></i><i></i><i></i></div>
          <div class="scroll-orbit"><i></i><i></i><i></i></div>
          <span class="scroll-pocket pocket-one"></span>
          <span class="scroll-pocket pocket-two"></span>
          <span class="scroll-pocket pocket-three"></span>
          <b class="scroll-outlet"></b>
        </div>
        <span class="mechanism-caption">Les poches vont vers le centre et rétrécissent.</span>
      </div>`;
  }
  return `
    <div class="mechanism mechanism-screw" role="img" aria-label="Animation de deux rotors à vis qui déplacent et réduisent des poches de fluide frigorigène">
      <span class="mechanism-port mech-bp">VAPEUR BP <i>→</i></span>
      <span class="mechanism-port mech-hp"><i>→</i> VAPEUR HP</span>
      <div class="screw-shell">
        <div class="screw-rotor rotor-top"></div>
        <div class="screw-rotor rotor-bottom"></div>
        <span class="screw-pocket screw-pocket-one"></span>
        <span class="screw-pocket screw-pocket-two"></span>
        <span class="screw-pocket screw-pocket-three"></span>
      </div>
      <span class="mechanism-caption">Les poches avancent et leur volume diminue.</span>
    </div>`;
}

function compressorTechnologyPanel(type) {
  const data = compressorTechnologyData[type];
  return `
    <div class="technology-explanation">
      <div>
        <span class="technology-kicker">PRINCIPE DE FONCTIONNEMENT</span>
        <h3>${data.title}</h3>
        <p>${data.subtitle}</p>
        <ol>${data.bullets.map(item => `<li>${item}</li>`).join("")}</ol>
      </div>
      ${compressorMechanismMarkup(type)}
    </div>`;
}

function renderCompressorTechnologies() {
  return `
    <div class="compressor-technology-slide">
      <div class="technology-picker" role="tablist" aria-label="Choisir une technologie de compresseur">
        ${Object.entries(compressorTechnologyData).map(([key, data], index) => `
          <button class="${index === 0 ? "active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-compressor-tech="${key}">
            ${icon(data.symbol, `Symbole du compresseur ${data.label}`)}
            <b>${data.label}</b><small>Voir le mouvement</small>
          </button>`).join("")}
      </div>
      <div class="compressor-tech-panel" id="compressor-tech-panel">${compressorTechnologyPanel("piston")}</div>
      <p class="technology-rule"><b>Point commun :</b> aspiration en vapeur BP → réduction de volume → refoulement en vapeur HP → mise en mouvement permanente du fluide frigorigène.</p>
    </div>`;
}

function airExchangeMarkup(mode) {
  const condenser = mode === "condenser";
  const inlet = condenser ? "Air extérieur · plus frais" : "Air du local · plus chaud";
  const outlet = condenser ? "Air rejeté · plus chaud" : "Air soufflé · plus froid";
  const transfer = condenser
    ? "Le fluide frigorigène cède sa chaleur à l’air."
    : "L’air cède sa chaleur au fluide frigorigène.";
  const arrows = Array.from({ length: 7 }, (_, index) => `<i class="air-arrow air-arrow-${index + 1}" aria-hidden="true">→</i>`).join("");
  return `
    <section class="air-exchange air-${mode}">
      <div class="air-state air-state-in"><span>ENTRÉE D’AIR</span><b>${inlet}</b></div>
      <div class="air-channel" role="img" aria-label="Animation continue de l’air qui traverse la batterie et change de température">
        <div class="air-flow incoming-air">${arrows}</div>
        <div class="air-exchanger">${icon("sym-echangeur-air", "Échangeur à air avec ventilateur")}<span>BATTERIE</span></div>
        <div class="air-flow outgoing-air">${arrows}</div>
      </div>
      <div class="air-state air-state-out"><span>SORTIE D’AIR</span><b>${outlet}</b></div>
      <p class="air-transfer-rule"><span aria-hidden="true">${condenser ? "↑" : "↓"}</span><b>${transfer}</b></p>
    </section>`;
}

function renderCondenserAir() {
  return `
    <div class="organ-layout">
      <section class="organ-focus">
        <span class="role-badge">EN HAUT DE LA CROIX</span>
        ${symbolBox("sym-echangeur-air", "Symbole du condenseur à air")}
        <h3>Rejeter la chaleur</h3>
        <p>Vapeur HP → liquide HP</p>
      </section>
      <section class="organ-content">
        ${definitionMarkup("condenseur")}
        ${airExchangeMarkup("condenser")}
        <div class="energy-formula compact-energy-formula" aria-label="Bilan de chaleur du condenseur">
          <span>Chaleur prise au local</span><i>+</i><span>Chaleur de compression</span><i>=</i><strong>Chaleur rejetée dans l’air</strong>
        </div>
      </section>
    </div>`;
}

function renderEvaporatorAir() {
  return `
    <div class="organ-layout">
      <section class="organ-focus">
        <span class="role-badge">EN BAS DE LA CROIX</span>
        ${symbolBox("sym-echangeur-air", "Symbole de l’évaporateur à air")}
        <h3>Prendre la chaleur</h3>
        <p>Mélange BP → vapeur BP</p>
      </section>
      <section class="organ-content">
        ${definitionMarkup("evaporateur")}
        ${airExchangeMarkup("evaporator")}
        <div class="temperature-conclusion"><b>Résultat visible</b><span>L’air du local ressort plus froid parce qu’il a cédé de la chaleur au fluide frigorigène.</span></div>
      </section>
    </div>`;
}

function renderPhaseSlide(mode) {
  const condenser = mode === "condenser";
  return `
    <div class="phase-slide">
      ${phaseChangeMarkup(mode)}
      <div class="phase-slide-reminder">
        <span><b>${condenser ? "Dernière bulle" : "Dernière goutte"}</b>${condenser ? "Le fluide est ensuite entièrement liquide." : "Le fluide est ensuite entièrement à l’état vapeur."}</span>
        <span><b>${condenser ? "Sous-refroidissement" : "Surchauffe"}</b>${condenser ? "Le liquide continue à perdre de la chaleur sensible." : "La vapeur continue à recevoir de la chaleur sensible."}</span>
      </div>
    </div>`;
}

function renderExpansionBasics() {
  return `
    <div class="organ-layout">
      <section class="organ-focus">
        <span class="role-badge">À GAUCHE DE LA CROIX</span>
        ${symbolBox("sym-detendeur-thermo", "Symbole du détendeur thermostatique à égalisation externe")}
        <h3>HP → BP</h3>
        <p>Chuter la pression<br>et doser le débit massique</p>
      </section>
      <section class="organ-content">
        ${definitionMarkup("detendeur")}
        <div class="device-grid expansion-device-grid">
          <div class="device-card">${icon("sym-detendeur-thermo")}<b>Thermostatique à égalisation externe</b><small>Bulbe + prise de pression en sortie d’évaporateur.</small></div>
          <div class="device-card">${icon("sym-detendeur-electronique")}<b>Électronique</b><small>Sonde + régulateur. Commande précise et rapide.</small></div>
          <div class="device-card">${icon("sym-tube-capillaire")}<b>Capillaire</b><small>Tube calibré fixe. Aucun réglage.</small></div>
        </div>
        <div class="liquid-line" aria-label="Ordre des éléments de la ligne liquide">
          <div class="line-device">${icon("sym-filtre-deshydrateur")}<b>Filtre déshydrateur</b><small>Sens de la flèche</small></div>
          <span class="line-arrow">→</span>
          <div class="line-device">${icon("sym-voyant-liquide")}<b>Voyant</b><small>Observation</small></div>
          <span class="line-arrow">→</span>
          <div class="line-device">${icon("sym-detendeur-thermo")}<b>Détendeur</b><small>Liquide HP → mélange BP</small></div>
        </div>
      </section>
    </div>`;
}

function renderExpansionRegulation() {
  return `
    <div class="regulation-slide">
      <div class="equalization-note">
        <div class="equalization-symbol">${icon("sym-detendeur-thermo", "Symbole normalisé du détendeur thermostatique à égalisation externe")}<span>ÉGALISATION<br>EXTERNE</span></div>
        <div>
          <h3>La membrane compare trois actions</h3>
          <p>La pression du bulbe tend à <strong>ouvrir</strong>. La pression réelle de sortie d’évaporateur, transmise par l’égalisation externe, et le ressort tendent à <strong>fermer</strong>.</p>
          <div class="force-balance">
            <span><b>Ouvre</b>pression du bulbe</span>
            <i>↔</i>
            <span><b>Ferment</b>pression de sortie + ressort</span>
          </div>
        </div>
      </div>
      <figure class="regulation-animation compact-regulation-animation">
        <img src="animations/detendeur-regulation.svg" alt="Animation de la régulation de surchauffe par le détendeur thermostatique avec évaporateur, bulbe, membrane et pointeau">
        <figcaption><b>La boucle se répète :</b> surchauffe ↑ → ouverture ↑ → débit massique ↑ → surchauffe ↓. Le détendeur régule la surchauffe, pas la température du local.</figcaption>
      </figure>
    </div>`;
}

function renderCompressor() {
  return `
    <div class="organ-layout">
      <section class="organ-focus">
        <span class="role-badge">SEUL ORGANE ACTIF</span>
        ${symbolBox("sym-compresseur-general", "Symbole général du compresseur")}
        <h3>BP → HP</h3>
        <p>Aspire · comprime · refoule<br><strong>et met en mouvement</strong></p>
      </section>
      <section class="organ-content">
        ${definitionMarkup("compresseur")}
        <div class="compressor-flow-card" aria-label="Animation continue de la mise en mouvement du fluide frigorigène par le compresseur">
          <span class="compressor-flow-state flow-state-bp"><b>ENTRÉE</b>Vapeur BP · froide</span>
          <div class="compressor-flow-track">
            <i></i><i></i><i></i><i></i><i></i>
            <span>${icon("sym-compresseur-general", "Compresseur")}</span>
          </div>
          <span class="compressor-flow-state flow-state-hp"><b>SORTIE</b>Vapeur HP · très chaude</span>
        </div>
        <div class="movement-principles">
          <div><b>1 · Aspirer</b><span>La vapeur BP entre dans le compresseur.</span></div>
          <div><b>2 · Comprimer</b><span>Le volume diminue et la pression augmente.</span></div>
          <div><b>3 · Refouler</b><span>La vapeur HP très chaude est poussée vers le condenseur.</span></div>
          <div><b>4 · Faire circuler</b><span>La répétition du mouvement crée le débit massique dans tout le circuit.</span></div>
        </div>
        <div class="method-note compact-method-note"><b>LUBRIFICATION</b><p>Une partie de l’huile peut circuler avec le fluide frigorigène ; elle doit revenir au compresseur.</p></div>
      </section>
    </div>`;
}

const coilRoute = "M45 34 H550 C580 34 580 82 550 82 H50 C20 82 20 130 50 130 H550 C580 130 580 178 550 178 H50 C20 178 20 226 50 226 H555";

function coilSvgMarkup(mode) {
  const evaporator = mode === "evaporator";
  const particles = Array.from({ length: 8 }, (_, index) => `
    <circle class="svg-phase-particle" r="${evaporator ? 5 : 7}" fill="#fff" stroke="#fff" stroke-width="2">
      <animateMotion dur="9s" begin="-${(index * 1.125).toFixed(3)}s" repeatCount="indefinite" path="${coilRoute}"/>
      <animate attributeName="r" dur="9s" repeatCount="indefinite" values="${evaporator ? "4;5;7;7" : "7;7;5;4"}"/>
      <animate attributeName="fill-opacity" dur="9s" repeatCount="indefinite" values="${evaporator ? ".9;.65;.18;.1" : ".1;.2;.72;.9"}"/>
    </circle>`).join("");
  return `
    <svg class="coil-svg" viewBox="0 0 600 260" role="img" aria-label="Serpentin continu avec circulation permanente du fluide frigorigène">
      <defs>
        <linearGradient id="coil-gradient-${mode}" x1="0" y1="0" x2="0" y2="1">
          ${evaporator
            ? `<stop offset="0" stop-color="#2269c7"/><stop offset=".62" stop-color="#4797df"/><stop offset="1" stop-color="#8bd8ef"/>`
            : `<stop offset="0" stop-color="#d94c35"/><stop offset=".55" stop-color="#ef7331"/><stop offset="1" stop-color="#f5a03b"/>`}
        </linearGradient>
      </defs>
      <path class="coil-shadow" d="${coilRoute}"/>
      <path class="coil-route" d="${coilRoute}" stroke="url(#coil-gradient-${mode})"/>
      <path class="coil-moving-flow" d="${coilRoute}" pathLength="100"/>
      ${particles}
      <circle class="mass-marker-svg" cx="45" cy="34" r="13"/>
    </svg>`;
}

function phaseChangeMarkup(mode) {
  const evaporator = mode === "evaporator";
  const title = evaporator ? "Dans l’évaporateur" : "Dans le condenseur";
  const inlet = evaporator ? "Mélange BP" : "Vapeur HP chaude";
  const outlet = evaporator ? "Vapeur BP surchauffée" : "Liquide HP sous-refroidi";
  const heat = evaporator ? "La chaleur entre dans le fluide frigorigène" : "La chaleur sort du fluide frigorigène";
  const initialZone = evaporator ? "Chaleur latente · évaporation" : "Chaleur sensible · désurchauffe";
  const initialText = evaporator
    ? "Le mélange liquide + vapeur BP absorbe de la chaleur. Le liquide s’évapore à température presque stable."
    : "La vapeur HP chaude rejette de la chaleur. Sa température diminue avant le début de la liquéfaction.";
  const zones = evaporator
    ? `
      <span class="chart-zone zone-latent"><b>LATENTE</b><small>évaporation</small></span>
      <span class="chart-zone zone-superheat"><b>SENSIBLE</b><small>surchauffe</small></span>`
    : `
      <span class="chart-zone zone-desuperheat"><b>SENSIBLE</b><small>désurchauffe</small></span>
      <span class="chart-zone zone-condense"><b>LATENTE</b><small>liquéfaction</small></span>
      <span class="chart-zone zone-subcool"><b>SENSIBLE</b><small>sous-refroidissement</small></span>`;
  const curvePoints = evaporator ? "8,50 70,50 93,21" : "8,21 26,50 72,50 93,75";

  return `
    <section class="phase-lab phase-${mode}" data-phase-lab="${mode}">
      <header class="phase-lab-heading">
        <div><span class="phase-eyebrow">ANIMATION CONTINUE · SUIVRE UNE MÊME MASSE</span><h3>${title}</h3></div>
        <span class="phase-direction">${inlet}<i>→</i>${outlet}</span>
      </header>
      <div class="phase-lab-grid">
        <div class="coil-card">
          <div class="heat-transfer ${evaporator ? "heat-in" : "heat-out"}"><span>${evaporator ? "↓ ↓ ↓" : "↑ ↑ ↑"}</span><b>${heat}</b></div>
          <div class="phase-coil" aria-label="Serpentin animé montrant le changement d’état du fluide frigorigène">
            <span class="coil-port port-in">ENTRÉE<br><b>${inlet}</b></span>
            ${coilSvgMarkup(mode)}
            <span class="coil-port port-out">SORTIE<br><b>${outlet}</b></span>
          </div>
          <div class="phase-auto-control">
            <label class="phase-slider-label" for="phase-slider-${mode}"><b>Lecture automatique</b><span>Le cercle suit une même masse</span></label>
            <button class="phase-play-toggle" type="button" aria-pressed="false">Pause</button>
          </div>
          <input class="phase-slider" id="phase-slider-${mode}" type="range" min="0" max="100" step="0.1" value="0" aria-label="Progression dans le ${evaporator ? "serpentin de l’évaporateur" : "serpentin du condenseur"}">
        </div>
        <div class="thermal-card">
          <div class="thermal-chart ${evaporator ? "evap-chart" : "cond-chart"}" role="img" aria-label="Courbe qualitative de température mettant en évidence chaleur sensible et chaleur latente">
            <span class="axis-label axis-temperature">TEMPÉRATURE</span>
            <span class="axis-label axis-progress">PROGRESSION DANS L’ÉCHANGEUR</span>
            ${zones}
            <svg class="thermal-curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="${curvePoints}"/>
              <circle class="chart-marker-svg" cx="8" cy="${evaporator ? "50" : "21"}" r="2.4"/>
            </svg>
            <span class="last-phase-marker"><b>${evaporator ? "dernière goutte" : "dernière bulle"}</b></span>
          </div>
          <div class="phase-reading" aria-live="polite">
            <span class="phase-reading-state">${evaporator ? "Mélange liquide + vapeur BP" : "Vapeur HP"}</span>
            <h4>${initialZone}</h4>
            <p>${initialText}</p>
          </div>
        </div>
      </div>
      <p class="phase-rule"><b>À retenir :</b> chaleur latente = changement d’état à température presque stable. Chaleur sensible = variation de température sans changement d’état.</p>
    </section>`;
}

function renderFollowFluid() {
  return `
    <div class="follow-layout">
      ${circuitMarkup({ states: false })}
      <section class="follow-panel">
        <h3>Quel est le premier organe ?</h3>
        <p>Départ : vapeur BP, juste avant son entrée dans le premier organe. Regardez la flèche <strong>bleu ciel</strong>.</p>
        ${flowLegendMarkup()}
        ${massRuleMarkup()}
        <div class="order-buttons">
          <button class="order-button" type="button" data-order-organ="evaporateur">${icon("sym-echangeur-air")} Évaporateur</button>
          <button class="order-button" type="button" data-order-organ="compresseur">${icon("sym-compresseur-general")} Compresseur</button>
          <button class="order-button" type="button" data-order-organ="detendeur">${icon("sym-detendeur-thermo")} Détendeur</button>
          <button class="order-button" type="button" data-order-organ="condenseur">${icon("sym-echangeur-air")} Condenseur</button>
        </div>
        <div class="fluid-history" id="fluid-history"></div>
        <p class="exercise-feedback" id="follow-feedback" role="status">0 étape sur 4.</p>
      </section>
    </div>`;
}

const quizQuestions = [
  { organ: "Compresseur", question: "Quelle proposition décrit complètement le rôle du compresseur ?", answers: ["Il comprime sans créer de circulation", "Il aspire en vapeur BP, comprime, refoule en vapeur HP et met le fluide frigorigène en mouvement", "Il fait passer le liquide HP en mélange BP"], correct: 1, why: "Le compresseur aspire, comprime, refoule et crée le débit massique qui met le fluide frigorigène en circulation." },
  { organ: "Compresseur à piston", question: "Que se passe-t-il lorsque le piston descend ?", answers: ["Le volume augmente et la vapeur BP est aspirée", "Le volume diminue et la vapeur HP est refoulée", "Le fluide frigorigène se liquéfie"], correct: 0, why: "La descente augmente le volume du cylindre : le clapet d’aspiration s’ouvre et la vapeur BP entre." },
  { organ: "Compresseurs", question: "Quelle association est correcte ?", answers: ["Scroll : deux rotors hélicoïdaux · Vis : deux spirales", "Scroll : spirale fixe + spirale orbitale · Vis : deux rotors hélicoïdaux", "Piston : deux spirales · Vis : un seul rotor"], correct: 1, why: "Le scroll comprime dans des poches formées par deux spirales ; le compresseur à vis utilise deux rotors hélicoïdaux." },
  { organ: "Repères thermiques", question: "Juste après le compresseur, quel est le bon repère ?", answers: ["Mélange BP très froid", "Vapeur HP très chaude", "Liquide HP froid"], correct: 1, why: "Le compresseur refoule une vapeur HP très chaude vers le condenseur ; cette zone est rouge." },
  { organ: "Condenseur", question: "Comment évolue l’air qui traverse le condenseur ?", answers: ["Il ressort plus chaud", "Il ressort plus froid", "Sa température ne change pas"], correct: 0, why: "L’air reçoit la chaleur rejetée par le fluide frigorigène et ressort plus chaud." },
  { organ: "Condenseur", question: "Quand commence le sous-refroidissement ?", answers: ["Après la disparition de la dernière bulle de vapeur", "Dès l’entrée de la vapeur HP", "Avant la liquéfaction"], correct: 0, why: "Après la dernière bulle, le fluide frigorigène est entièrement liquide et continue de perdre de la chaleur sensible." },
  { organ: "Détendeur", question: "Quelles sont les deux fonctions fondamentales du détendeur ?", answers: ["Chuter la pression et doser le débit massique", "Comprimer et refouler", "Liquéfier et réchauffer l’air"], correct: 0, why: "Le détendeur fait passer le fluide frigorigène de HP vers BP et dose le débit massique admis dans l’évaporateur." },
  { organ: "Détendeur thermostatique", question: "À quoi sert l’égalisation externe ?", answers: ["À transmettre sous la membrane la pression réelle en sortie d’évaporateur", "À remplacer le bulbe", "À mesurer la température de l’air soufflé"], correct: 0, why: "Elle permet à la régulation de tenir compte des pertes de charge du distributeur et de l’évaporateur." },
  { organ: "Évaporateur", question: "Comment évolue l’air qui traverse l’évaporateur ?", answers: ["Il cède de la chaleur et ressort plus froid", "Il reçoit de la chaleur et ressort plus chaud", "Il devient du fluide frigorigène"], correct: 0, why: "L’air du local cède de la chaleur au fluide frigorigène et ressort refroidi." },
  { organ: "Évaporateur", question: "Quand commence la surchauffe ?", answers: ["Après la disparition de la dernière goutte de liquide", "Pendant toute l’évaporation", "Après le condenseur"], correct: 0, why: "Après la dernière goutte, le fluide frigorigène est entièrement à l’état vapeur et sa température continue d’augmenter." }
];

const dossiers = [
  {
    id: "compresseurs",
    title: "Les compresseurs",
    short: "Compresseurs",
    image: "images-organes/compresseurs.webp",
    alt: "Quatre compresseurs frigorifiques isolés : piston, scroll, vis et rotatif",
    symbols: [
      ["sym-compresseur-general", "Général"],
      ["sym-compresseur-piston", "Piston"],
      ["sym-compresseur-scroll", "Scroll"],
      ["sym-compresseur-vis", "Vis"]
    ],
    definitionKey: "compresseur",
    intro: "Il aspire le fluide frigorigène à l’état vapeur en BP, le comprime, le refoule en HP et le met en mouvement dans le circuit.",
    narration: `Dossier compresseur. ${professionalDefinitions.compresseur.text} C’est le seul organe actif du cycle. Les technologies présentées sont le piston, le scroll, la vis et le rotatif. Le compresseur est lubrifié par de l’huile. Une partie de cette huile peut être entraînée et circuler avec le fluide frigorigène ; elle doit revenir au compresseur.`,
    sheets: [
      { label: "FICHE 1", title: "Reconnaître les technologies", items: ["<strong>Piston :</strong> mouvement de va-et-vient.", "<strong>Scroll :</strong> deux spirales imbriquées, très répandu en climatisation.", "<strong>Vis :</strong> deux rotors qui s’engrènent, pour les grosses puissances.", "<strong>Rotatif :</strong> quatrième technologie à connaître ; aucun symbole spécifique n’est représenté car il n’a pas été fourni."] },
      { label: "FICHE 2", title: "Distinguer les architectures", items: ["<strong>Hermétique :</strong> coque soudée, non réparable, pas de fuite possible côté arbre.", "<strong>Semi-hermétique :</strong> coque boulonnée, réparable.", "<strong>Ouvert :</strong> moteur séparé et arbre traversant ; la garniture est un point de fuite classique."] },
      { label: "FICHE 3", title: "Lubrification", items: ["Le compresseur est <strong>lubrifié par de l’huile</strong>.", "Une partie de l’huile peut être entraînée et circuler avec le fluide frigorigène.", "L’huile doit revenir au compresseur afin de maintenir la lubrification."] },
      { label: "FICHE 4", title: "Définition à répéter", items: ["Aspirer le fluide frigorigène à l’état vapeur BP.", "Le comprimer et le refouler à l’état vapeur HP.", "Le mettre en mouvement et assurer sa circulation dans le circuit."] }
    ],
    oral: "Le compresseur aspire le fluide frigorigène à l’état vapeur en BP, le comprime et le refoule en HP. Il met le fluide frigorigène en mouvement et assure sa circulation. C’est le seul organe actif du cycle. Il est lubrifié par de l’huile, dont une partie peut circuler avec le fluide frigorigène avant de revenir au compresseur."
  },
  {
    id: "condenseur",
    title: "Le condenseur à air",
    short: "Condenseur",
    image: "images-organes/condenseur-air.webp",
    alt: "Condenseur frigorifique à air isolé avec batterie et deux ventilateurs",
    symbols: [["sym-echangeur-air", "Échangeur à air"]],
    definitionKey: "condenseur",
    intro: "Il assure la liquéfaction du fluide frigorigène par échange de chaleur avec l’air extérieur.",
    narration: `Dossier condenseur à air. ${professionalDefinitions.condenseur.text} Il évacue la chaleur prise à l’évaporateur, plus celle apportée par la compression. La vapeur haute pression se refroidit d’abord par chaleur sensible. La liquéfaction rejette ensuite de la chaleur latente à température presque stable. Après la dernière bulle de vapeur, le liquide se refroidit encore par chaleur sensible : cette zone est le sous-refroidissement. Les valeurs seront mesurées plus tard. Une batterie encrassée ou un ventilateur arrêté fait monter la haute pression.`,
    sheets: [
      { label: "FICHE 1", title: "Identifier l’organe", items: ["Batterie d’échange à ailettes.", "Un ou plusieurs ventilateurs forcent l’air à travers la batterie.", "Dans la croix du frigoriste, le condenseur est <strong>en haut</strong>."] },
      { label: "FICHE 2", title: "Comprendre les trois zones", items: ["<strong>Désurchauffe :</strong> la vapeur HP rejette de la chaleur sensible et sa température diminue.", "<strong>Liquéfaction :</strong> le mélange vapeur + liquide rejette de la chaleur latente à température presque stable.", "<strong>Sous-refroidissement :</strong> après la dernière bulle, le liquide HP rejette encore de la chaleur sensible."] },
      { label: "FICHE 3", title: "Repérer le sous-refroidissement", items: ["La zone commence après la disparition de la <strong>dernière bulle de vapeur</strong>.", "Le fluide frigorigène est alors entièrement liquide.", "Les valeurs de contrôle seront étudiées et mesurées plus tard.", "Vérifier la propreté de la batterie et le fonctionnement des ventilateurs."] },
      { label: "FICHE 4", title: "Défauts et sécurité", items: ["Batterie encrassée ou ventilateur arrêté → HP qui monte → coupure possible par le pressostat HP.", "Les incondensables se purgent à l’arrêt, installation froide, avec récupération.", "Jamais de purge avec le fluide en mouvement."] }
    ],
    oral: "Le condenseur assure la liquéfaction du fluide frigorigène par échange de chaleur avec l’air extérieur. La vapeur HP se désurchauffe, se liquéfie en rejetant de la chaleur latente, puis le liquide se sous-refroidit après la disparition de la dernière bulle. En cas de HP élevée, je vérifie d’abord la batterie et les ventilateurs."
  },
  {
    id: "detendeur-thermostatique",
    title: "Le détendeur thermostatique à égalisation externe",
    short: "Détendeur thermo.",
    image: "images-organes/detendeur-thermostatique.webp",
    alt: "Détendeur thermostatique isolé avec son capillaire, son bulbe et sa prise d’égalisation externe",
    symbols: [["sym-detendeur-thermo", "Thermostatique à égalisation externe"]],
    definitionKey: "detendeur",
    intro: "Il fait chuter la pression de HP vers BP, dose le débit massique admis dans l’évaporateur et régule la surchauffe.",
    narration: `Dossier détendeur thermostatique à égalisation externe. ${professionalDefinitions.detendeur.text} Le bulbe est fixé sur la ligne d’aspiration, en sortie d’évaporateur. Sa pression agit sur la membrane et tend à ouvrir le détendeur. La pression d’évaporation et le ressort tendent à le fermer. La prise d’égalisation externe reprend la pression réelle en sortie d’évaporateur, au niveau du bulbe. Elle permet de tenir compte des pertes de charge dans le distributeur et l’évaporateur. Le détendeur module ainsi le débit massique pour maintenir la surchauffe.`,
    sheets: [
      { label: "FICHE 1", title: "Reconnaître l’ensemble", items: ["Un corps de vanne avec membrane, tige, pointeau, siège et ressort.", "Un capillaire de commande relié au bulbe.", "Un bulbe fixé sur la ligne d’aspiration, en sortie d’évaporateur.", "Une prise d’égalisation externe raccordée sur la ligne d’aspiration, généralement en aval du bulbe dans le sens de circulation."] },
      { label: "FICHE 2", title: "Ses fonctions", items: ["Faire chuter la pression du fluide frigorigène de <strong>HP vers BP</strong>.", "Doser le <strong>débit massique</strong> admis dans l’évaporateur.", "Réguler la <strong>surchauffe</strong> en sortie d’évaporateur.", "Dans la croix du frigoriste, le détendeur est <strong>à gauche</strong>."] },
      { label: "FICHE 3", title: "Comprendre la boucle", items: ["Surchauffe qui augmente → bulbe plus chaud → pression du bulbe qui augmente.", "La membrane pousse la tige : le pointeau quitte davantage son siège.", "Le débit massique augmente : l’évaporateur est mieux alimenté et la surchauffe redescend.", "Surchauffe qui diminue → le détendeur se referme."] },
      { label: "FICHE 4", title: "Égalisation externe", items: ["La prise est raccordée en sortie d’évaporateur, au niveau de la pression vue par le bulbe.", "Cette pression est transmise sous la membrane.", "Elle compense les pertes de charge du distributeur et de l’évaporateur.", "Elle évite de réguler sur une pression d’entrée qui ne représente pas la pression réelle en sortie."] },
      { label: "FICHE 5", title: "Point de vigilance", items: ["Le détendeur thermostatique régule la surchauffe, pas la température du local.", "Le réglage se contrôle après stabilisation de l’installation et selon la notice du constructeur.", "Ne pas confondre le capillaire de commande du bulbe avec le tube capillaire de détente.", "Ne pas confondre la prise d’égalisation avec le capillaire relié au bulbe."] }
    ],
    oral: "Le détendeur thermostatique fait chuter la pression de HP vers BP, dose le débit massique admis dans l’évaporateur et régule la surchauffe. Le bulbe agit sur l’ouverture par sa pression. L’égalisation externe reprend la pression réelle en sortie d’évaporateur et la transmet sous la membrane afin de tenir compte des pertes de charge."
  },
  {
    id: "detendeur-electronique",
    title: "Le détendeur électronique",
    short: "Détendeur élect.",
    image: "images-organes/detendeur-electronique.webp",
    alt: "Détendeur électronique isolé avec son actionneur et son câble",
    symbols: [["sym-detendeur-electronique", "Électronique"], ["sym-sonde-temperature", "Sonde"]],
    definitionKey: "detendeur",
    intro: "Il fait chuter la pression du fluide frigorigène de HP vers BP et dose le débit massique, avec une sonde et un régulateur.",
    narration: `Dossier détendeur électronique. ${professionalDefinitions.detendeur.text} La régulation utilise une sonde et un régulateur. Cette commande est plus précise et plus rapide.`,
    sheets: [
      { label: "FICHE 1", title: "Reconnaître les éléments", items: ["Un corps de vanne.", "Un actionneur électrique.", "Une sonde de température associée à un régulateur.", "Le symbole porte le repère électronique."] },
      { label: "FICHE 2", title: "Fonction dans le cycle", items: ["Faire chuter la pression du fluide frigorigène de <strong>HP vers BP</strong>.", "Doser le <strong>débit massique</strong> admis dans l’évaporateur.", "Réguler la surchauffe."] },
      { label: "FICHE 3", title: "Commande électronique", items: ["La sonde transmet une mesure au régulateur.", "Le régulateur commande l’ouverture du détendeur.", "La réponse est plus précise et plus rapide."] },
      { label: "FICHE 4", title: "À distinguer", items: ["Le détendeur électronique a besoin de sa chaîne de mesure et de commande.", "Ne pas le confondre avec le détendeur thermostatique et son bulbe."] }
    ],
    oral: "Le détendeur électronique fait chuter la pression du fluide frigorigène de HP vers BP et dose le débit massique admis dans l’évaporateur. Une sonde et un régulateur commandent son ouverture avec plus de précision et de rapidité."
  },
  {
    id: "capillaire",
    title: "Le tube capillaire",
    short: "Capillaire",
    image: "images-organes/tube-capillaire.webp",
    alt: "Tube capillaire frigorifique isolé sous forme de bobine de cuivre fin",
    symbols: [["sym-tube-capillaire", "Capillaire"]],
    intro: "C’est un tube calibré fixe, sans réglage, utilisé sur de petits appareils.",
    narration: "Dossier tube capillaire. Le capillaire est un tube calibré fixe. Il crée la détente sans organe de réglage. On le rencontre sur de petits appareils. Sa caractéristique essentielle à retenir est simple : il ne se règle pas.",
    sheets: [
      { label: "FICHE 1", title: "Identifier", items: ["Tube de cuivre de très faible diamètre.", "Longueur enroulée pour former une bobine compacte.", "Symbole spécifique en forme de succession de boucles."] },
      { label: "FICHE 2", title: "Principe", items: ["Le tube est <strong>calibré</strong>.", "La détente est obtenue par ce passage fixe.", "Il ne possède pas de commande de réglage."] },
      { label: "FICHE 3", title: "Domaine indiqué", items: ["Utilisé sur de <strong>petits appareils</strong>.", "Solution fixe, différente des détendeurs thermostatique et électronique."] },
      { label: "FICHE 4", title: "Piège fréquent", items: ["Chercher un réglage qui n’existe pas.", "Confondre ce tube de détente avec le capillaire relié au bulbe thermostatique."] }
    ],
    oral: "Le capillaire est un tube calibré fixe, sans réglage. Il assure la détente sur de petits appareils. Il ne possède ni bulbe ni commande électronique."
  },
  {
    id: "evaporateur",
    title: "L’évaporateur à air",
    short: "Évaporateur",
    image: "images-organes/evaporateur-air.webp",
    alt: "Évaporateur frigorifique à air isolé avec batterie, ventilateurs et bac",
    symbols: [["sym-echangeur-air", "Échangeur à air"]],
    definitionKey: "evaporateur",
    intro: "Il permet l’évaporation du fluide frigorigène par échange de chaleur avec le milieu à refroidir.",
    narration: `Dossier évaporateur à air. ${professionalDefinitions.evaporateur.text} Le mélange basse pression absorbe d’abord de la chaleur latente et s’évapore à température presque stable. Après la dernière goutte de liquide, la vapeur absorbe de la chaleur sensible et sa température augmente : cette zone est la surchauffe. Les valeurs seront mesurées plus tard. Cette surchauffe protège le compresseur du coup de liquide. Un givrage complet indique d’abord un problème de débit d’air.`,
    sheets: [
      { label: "FICHE 1", title: "Identifier l’organe", items: ["Batterie d’échange à ailettes.", "Ventilateurs pour le débit d’air.", "Dans la croix du frigoriste, l’évaporateur est <strong>en bas</strong>."] },
      { label: "FICHE 2", title: "Comprendre les deux zones", items: ["<strong>Évaporation :</strong> le mélange liquide + vapeur BP absorbe de la chaleur latente à température presque stable.", "Le liquide disparaît progressivement jusqu’à la dernière goutte.", "<strong>Surchauffe :</strong> la vapeur BP absorbe ensuite de la chaleur sensible et sa température augmente."] },
      { label: "FICHE 3", title: "Repérer la surchauffe", items: ["La zone commence après la disparition de la <strong>dernière goutte de liquide</strong>.", "Le fluide frigorigène est alors entièrement à l’état vapeur.", "Elle protège le compresseur du coup de liquide.", "Les valeurs de contrôle seront étudiées et mesurées plus tard."] },
      { label: "FICHE 4", title: "Givre et débit d’air", items: ["Le givre est normal en froid négatif.", "S’il reste durablement, il isole la batterie : d’où les cycles de dégivrage.", "Givrage complet : vérifier d’abord le filtre et le ventilateur."] }
    ],
    oral: "L’évaporateur permet l’évaporation du fluide frigorigène par échange de chaleur avec le milieu à refroidir. Le mélange BP absorbe de la chaleur latente à température presque stable. Après la dernière goutte, la vapeur absorbe de la chaleur sensible : sa température augmente dans la zone de surchauffe."
  },
  {
    id: "filtre",
    title: "Le filtre déshydrateur",
    short: "Filtre",
    image: "images-organes/filtre-deshydrateur.webp",
    alt: "Filtre déshydrateur frigorifique isolé avec deux raccords cuivre",
    symbols: [["sym-filtre-deshydrateur", "Filtre"]],
    intro: "Il se trouve sur la ligne liquide. Son sens de montage doit respecter la flèche du composant.",
    narration: "Dossier filtre déshydrateur. Cet élément est placé sur la ligne liquide. Il filtre et déshydrate le fluide qui le traverse. Le point de montage essentiel est le sens de sa flèche, qui doit être respecté.",
    sheets: [
      { label: "FICHE 1", title: "Identifier", items: ["Corps cylindrique monté en ligne.", "Une entrée et une sortie.", "Symbole rectangulaire spécifique de la bibliothèque."] },
      { label: "FICHE 2", title: "Place dans l’installation", items: ["Élément de la <strong>ligne liquide</strong>.", "Il est représenté en amont du voyant et du détendeur dans le parcours de cours."] },
      { label: "FICHE 3", title: "Fonction annoncée", items: ["La fonction de filtration est portée par son nom.", "La fonction de déshydratation est portée par son nom.", "L’observation du sens de circulation reste indispensable."] },
      { label: "FICHE 4", title: "Piège de montage", items: ["Montage dans le mauvais sens.", "Toujours repérer et respecter la flèche portée par le composant réel."] }
    ],
    oral: "Le filtre déshydrateur est placé sur la ligne liquide. Il filtre et déshydrate. Je vérifie toujours son sens de montage grâce à la flèche du composant."
  },
  {
    id: "voyant",
    title: "Le voyant liquide",
    short: "Voyant",
    image: "images-organes/voyant-liquide.webp",
    alt: "Voyant liquide frigorifique isolé avec corps en laiton et fenêtre en verre",
    symbols: [["sym-voyant-liquide", "Voyant"]],
    intro: "Monté sur la ligne liquide, il donne une observation visuelle : bulles et pastille d’humidité.",
    narration: "Dossier voyant liquide. Le voyant est monté sur la ligne liquide. Sa fenêtre permet d’observer la présence de bulles. Sa pastille donne une indication d’humidité. À l’épreuve, il faut citer ces deux informations.",
    sheets: [
      { label: "FICHE 1", title: "Identifier", items: ["Corps monté en ligne.", "Fenêtre circulaire d’observation.", "Le symbole fourni comporte la lettre V dans la fenêtre."] },
      { label: "FICHE 2", title: "Place dans la ligne", items: ["Élément de la <strong>ligne liquide</strong>.", "Associé au filtre déshydrateur et au détendeur dans le cours."] },
      { label: "FICHE 3", title: "Deux observations", items: ["Observer la présence éventuelle de <strong>bulles</strong>.", "Observer la <strong>pastille d’humidité</strong>."] },
      { label: "FICHE 4", title: "À l’oral", items: ["Ne pas dire seulement « il permet de voir le fluide ».", "Nommer précisément les bulles et l’indication d’humidité."] }
    ],
    oral: "Le voyant est placé sur la ligne liquide. Il permet d’observer les bulles et de lire la pastille d’humidité."
  },
  {
    id: "pressostats",
    title: "Les pressostats HP et BP",
    short: "Pressostats",
    /* Pas de photo : celle d'origine (deux boîtiers identiques, un gris, un
       bleu) ne montrait ni échelle de tarage, ni molette, ni différentiel —
       la seule différence lisible était la couleur, ce qui fabriquait un
       faux critère (« le bleu = BP »). Les symboles PA/PB suffisent ici. */
    image: null,
    alt: "",
    symbols: [["sym-pressostat-hp", "HP"], ["sym-pressostat-bp", "BP"]],
    intro: "Les deux symboles distinguent la surveillance haute pression et basse pression.",
    narration: "Dossier pressostats. Le symbole PA repère le pressostat haute pression et le symbole PB le pressostat basse pression. Ces organes surveillent la pression du circuit et peuvent agir sur la commande électrique lorsque leur seuil est atteint.",
    sheets: [
      { label: "FICHE 1", title: "Reconnaître les repères", items: ["Symbole <strong>PA</strong> pour le pressostat HP fourni.", "Symbole <strong>PB</strong> pour le pressostat BP fourni.", "Un raccord de pression et un contact électrique sur le composant réel."] },
      { label: "FICHE 2", title: "Ce qu’ils surveillent", items: ["Le pressostat HP est associé à la haute pression.", "Le pressostat BP est associé à la basse pression.", "Leur symbole permet de les distinguer sur un schéma."] },
      { label: "FICHE 3", title: "Action dans la commande", items: ["Le pressostat transforme une information de pression en action électrique.", "Lorsque le seuil réglé est atteint, son contact change d’état.", "Il peut ainsi autoriser ou interrompre le fonctionnement d’un équipement."] },
      { label: "FICHE 4", title: "À retenir", items: ["Le pressostat HP surveille la haute pression.", "Le pressostat BP surveille la basse pression.", "Ils ne créent ni la circulation du fluide frigorigène ni son changement d’état."] }
    ],
    oral: "Les pressostats surveillent la haute ou la basse pression et transmettent cette information à la commande électrique. Ils ne mettent pas le fluide frigorigène en mouvement."
  },
  {
    id: "sonde",
    title: "La sonde de température",
    short: "Sonde",
    image: "images-organes/sonde-temperature.webp",
    alt: "Sonde de température frigorifique isolée avec câble et connecteur",
    symbols: [["sym-sonde-temperature", "Sonde"]],
    intro: "Elle mesure une température et transmet cette information à la régulation électronique.",
    narration: "Dossier sonde de température. La sonde mesure une température et transmet cette information au régulateur. Dans le cours, elle participe à la commande du détendeur électronique, qui régule la surchauffe de façon plus précise et plus rapide.",
    sheets: [
      { label: "FICHE 1", title: "Identifier", items: ["Une partie sensible protégée.", "Un câble de liaison.", "Un raccordement vers la régulation.", "Un symbole spécifique fourni dans la famille des capteurs froid."] },
      { label: "FICHE 2", title: "Fonction", items: ["Mesurer une <strong>température</strong>.", "Transmettre cette mesure au régulateur.", "Fournir une information de commande."] },
      { label: "FICHE 3", title: "Lien avec le détendeur", items: ["La sonde est associée au détendeur électronique.", "Le régulateur utilise la mesure pour commander l’ouverture.", "La régulation agit sur la surchauffe."] },
      { label: "FICHE 4", title: "À distinguer", items: ["Une sonde fournit une information.", "Elle n’assure pas elle-même la détente.", "Ne pas la confondre avec le bulbe thermostatique."] }
    ],
    oral: "La sonde mesure une température et transmet cette valeur au régulateur. Dans ce cours, elle sert à la commande du détendeur électronique et à la régulation de surchauffe."
  }
];

let currentStage = 0;
let highestStage = 0;
let speechState = "idle";
let currentUtterance = null;
let selectedVoice = null;
const rates = [0.75, 0.85, 0.95, 1, 1.1, 1.25];
let rateIndex = 2;
let followIndex = 0;
let quizIndex = 0;
let quizScore = 0;
let quizLocked = false;

/* Mélange l'ordre d'AFFICHAGE des propositions (Fisher-Yates). Sans lui, les
   bonnes réponses étaient en positions fixes (7 sur 10 en première place) :
   cliquer toujours la première case validait le défi sans rien lire. Le
   data-quiz-answer garde l'indice d'ORIGINE — la correction ne change pas. */
function ordreMelange(n) {
  const ordre = Array.from({ length: n }, (_, i) => i);
  for (let i = ordre.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
  }
  return ordre;
}
let currentDossier = 0;

function renderQuiz() {
  if (quizIndex >= quizQuestions.length) {
    const passed = quizScore >= 8;
    return `
      <div class="quiz-shell">
        ${quizMeter()}
        <section class="quiz-card result-panel ${passed ? "" : "retry"}">
          <span class="result-mark">${passed ? "✓" : "↻"}</span>
          <h3>${passed ? "Mission réussie" : "Encore un passage"}</h3>
          <p>Score : <b>${quizScore} / 10</b>. ${passed ? "Vous avez atteint le seuil de 80 %. Les quatre organes sont prêts pour le tirage au sort." : "Le seuil est de 8 / 10. Relisez les explications, puis recommencez le défi."}</p>
          <button class="primary-button quiz-restart" id="quiz-restart" type="button">Refaire les 10 questions</button>
        </section>
      </div>`;
  }
  const question = quizQuestions[quizIndex];
  return `
    <div class="quiz-shell">
      ${quizMeter()}
      <section class="quiz-card">
        <p class="quiz-kicker">${question.organ.toUpperCase()} · QUESTION ${quizIndex + 1} / ${quizQuestions.length}</p>
        <h3>${question.question}</h3>
        <div class="quiz-options">
          ${ordreMelange(question.answers.length).map(index => `<button class="quiz-option" type="button" data-quiz-answer="${index}">${question.answers[index]}</button>`).join("")}
        </div>
        <p class="quiz-feedback" id="quiz-feedback" role="status">Choisissez une réponse.</p>
      </section>
    </div>`;
}

function quizMeter() {
  const angle = quizIndex === 0 ? 0 : (quizScore / quizQuestions.length) * 360;
  return `
    <aside class="quiz-meter">
      <div class="score-ring" style="--score:${angle}deg"><b>${quizScore} / 10</b></div>
      <p><b>Objectif : 8 / 10</b><br>Seuil de réussite : 80 %</p>
  </aside>`;
}

function buildDossiers() {
  $("#dossier-list").innerHTML = dossiers.map((dossier, index) => `
    <button class="dossier-tab ${index === currentDossier ? "active" : ""}" type="button" data-dossier="${index}" aria-pressed="${index === currentDossier}">
      ${icon(dossier.symbols[0][0])}<span>${dossier.short}</span>
    </button>`).join("");
  $$("[data-dossier]").forEach(button => {
    button.addEventListener("click", () => {
      currentDossier = Number(button.dataset.dossier);
      renderDossier();
      $$("[data-dossier]").forEach((other, index) => {
        const active = index === currentDossier;
        other.classList.toggle("active", active);
        other.setAttribute("aria-pressed", String(active));
      });
    });
  });
  renderDossier();
}

function renderDossier() {
  stopSpeech();
  const dossier = dossiers[currentDossier];
  $("#dossier-view").innerHTML = `
    <div class="dossier-cover">
      ${dossier.image ? `<figure class="real-view">
        <img src="${dossier.image}" alt="${dossier.alt}">
      </figure>` : ""}
      <section class="schematic-view">
        <div class="schematic-symbols">
          ${dossier.symbols.map(([symbol, label]) => `
            <span class="schematic-symbol-card">${icon(symbol, `Symbole ${label}`)}<b>${label}</b></span>`).join("")}
        </div>
        <h3>Réel ↔ schématique</h3>
        <p>Le tracé SVG fourni reste la référence graphique du module.</p>
      </section>
    </div>
    <div class="dossier-body">
      <header class="dossier-title-row">
        <div>
          <span class="dossier-number">DOSSIER ${String(currentDossier + 1).padStart(2, "0")} · ${dossier.sheets.length + 1} FICHES</span>
          <h3>${dossier.title}</h3>
          <p>${dossier.intro}</p>
        </div>
        <div class="dossier-speech">
          <button class="dossier-listen" id="dossier-listen" type="button">Écouter le dossier</button>
          <button class="pause-button" id="dossier-pause" type="button" disabled>Pause</button>
        </div>
      </header>
      ${dossier.definitionKey ? definitionMarkup(dossier.definitionKey) : ""}
      <div class="dossier-sheet-grid">
        ${dossier.sheets.map(sheet => `
          <section class="dossier-sheet">
            <span class="sheet-label">${sheet.label}</span>
            <h4>${sheet.title}</h4>
            <ul>${sheet.items.map(item => `<li>${item}</li>`).join("")}</ul>
          </section>`).join("")}
        <section class="dossier-sheet oral-card">
          <span class="sheet-label">FICHE ORALE</span>
          <h4>Réponse courte pour l’épreuve</h4>
          <blockquote>« ${dossier.oral} »</blockquote>
        </section>
      </div>
      <p class="dossier-source-note">La vue réaliste sert uniquement à reconnaître l’organe isolé ; elle n’est pas une documentation constructeur. Aucun montage ni raccordement d’installation n’est représenté.</p>
    </div>`;
  $("#dossier-listen").addEventListener("click", () => speakText(dossier.narration));
  $("#dossier-pause").addEventListener("click", pauseSpeech);
}

function buildStepper() {
  $("#stepper").innerHTML = stages.map((stage, index) => `
    <button type="button" data-step="${index}" aria-label="Étape ${index + 1} : ${stage.short}">
      <b>${String(index + 1).padStart(2, "0")}</b><span>${stage.short}</span>
    </button>`).join("");
  $$("[data-step]").forEach(button => button.addEventListener("click", () => goToStage(Number(button.dataset.step))));
}

function goToStage(index, scroll = false) {
  stopSpeech();
  currentStage = Math.max(0, Math.min(stages.length - 1, index));
  highestStage = Math.max(highestStage, currentStage);
  const stage = stages[currentStage];
  $("#lesson-kicker").textContent = stage.kicker;
  $("#lesson-title").textContent = stage.title;
  $("#lesson-intro").textContent = stage.intro;
  $("#lesson-zone").innerHTML = stage.render();
  $("#step-count").textContent = `${currentStage + 1} / ${stages.length}`;
  $("#progress-label").textContent = `Étape ${currentStage + 1} sur ${stages.length}`;
  $("#progress-bar").style.width = `${((currentStage + 1) / stages.length) * 100}%`;
  $("#previous").disabled = currentStage === 0;
  $("#next").textContent = currentStage === stages.length - 1 ? "Voir le résumé ↓" : "Continuer →";
  $$("[data-step]").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === currentStage);
    button.classList.toggle("done", buttonIndex < highestStage);
    button.setAttribute("aria-current", buttonIndex === currentStage ? "step" : "false");
  });
  if (stage.wire) stage.wire();
  if (scroll) $("#module").scrollIntoView({ behavior: "smooth", block: "start" });
}

function wireMission() {
  const feedback = $("#mission-feedback");
  $$("[data-reveal]").forEach(card => {
    card.addEventListener("click", () => {
      card.classList.add("revealed");
      card.setAttribute("aria-pressed", "true");
      const count = $$(".reveal-card.revealed").length;
      feedback.textContent = count === 4
        ? "✓ Les quatre définitions métier sont révélées. Lisez-les maintenant à voix haute."
        : `${count} définition${count > 1 ? "s" : ""} métier révélée${count > 1 ? "s" : ""} sur 4.`;
      feedback.classList.toggle("success", count === 4);
    });
  });
}

function wireCompressorTechnologies() {
  $$("[data-compressor-tech]").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.compressorTech;
      $$("[data-compressor-tech]").forEach(other => {
        const active = other === button;
        other.classList.toggle("active", active);
        other.setAttribute("aria-selected", String(active));
      });
      $("#compressor-tech-panel").innerHTML = compressorTechnologyPanel(type);
    });
  });
}

function wirePhaseLab(mode) {
  const lab = $(`[data-phase-lab="${mode}"]`);
  if (!lab) return;
  const slider = $(".phase-slider", lab);
  const marker = $(".chart-marker-svg", lab);
  const massMarker = $(".mass-marker-svg", lab);
  const route = $(".coil-route", lab);
  const toggle = $(".phase-play-toggle", lab);
  const state = $(".phase-reading-state", lab);
  const title = $(".phase-reading h4", lab);
  const copy = $(".phase-reading p", lab);
  let progress = Number(slider.value);
  let playing = true;
  let previousTime = null;

  const readings = mode === "evaporator"
    ? [
        {
          limit: 72,
          state: "Mélange liquide + vapeur BP",
          title: "Chaleur latente · évaporation",
          copy: "Le mélange BP absorbe de la chaleur. Le liquide s’évapore à température presque stable jusqu’à la dernière goutte."
        },
        {
          limit: 101,
          state: "Vapeur BP uniquement",
          title: "Chaleur sensible · surchauffe",
          copy: "Après la dernière goutte, la vapeur continue d’absorber de la chaleur et sa température augmente : c’est la zone de surchauffe."
        }
      ]
    : [
        {
          limit: 22,
          state: "Vapeur HP chaude",
          title: "Chaleur sensible · désurchauffe",
          copy: "La vapeur HP rejette de la chaleur. Sa température diminue sans changement d’état."
        },
        {
          limit: 80,
          state: "Mélange vapeur + liquide HP",
          title: "Chaleur latente · liquéfaction",
          copy: "Le fluide frigorigène se liquéfie en rejetant de la chaleur. Sa température reste presque stable jusqu’à la dernière bulle."
        },
        {
          limit: 101,
          state: "Liquide HP uniquement",
          title: "Chaleur sensible · sous-refroidissement",
          copy: "Après la dernière bulle, le liquide continue de rejeter de la chaleur et sa température diminue : c’est la zone de sous-refroidissement."
        }
      ];

  function updatePhaseLab() {
    progress = Number(slider.value);
    const routeLength = route.getTotalLength();
    const routePoint = route.getPointAtLength((progress / 100) * routeLength);
    massMarker.setAttribute("cx", routePoint.x.toFixed(2));
    massMarker.setAttribute("cy", routePoint.y.toFixed(2));

    let x;
    let y;
    if (mode === "evaporator") {
      if (progress <= 72) {
        x = 8 + (progress / 72) * 62;
        y = 50;
      } else {
        x = 70 + ((progress - 72) / 28) * 23;
        y = 50 + ((progress - 72) / 28) * 29;
      }
    } else if (progress <= 22) {
      x = 8 + (progress / 22) * 18;
      y = 79 - (progress / 22) * 29;
    } else if (progress <= 80) {
      x = 26 + ((progress - 22) / 58) * 46;
      y = 50;
    } else {
      x = 72 + ((progress - 80) / 20) * 21;
      y = 50 - ((progress - 80) / 20) * 25;
    }
    marker.setAttribute("cx", x.toFixed(2));
    marker.setAttribute("cy", (100 - y).toFixed(2));

    const reading = readings.find(item => progress < item.limit) || readings[readings.length - 1];
    state.textContent = reading.state;
    title.textContent = reading.title;
    copy.textContent = reading.copy;
  }

  function animationFrame(time) {
    if (!document.body.contains(lab)) return;
    if (previousTime === null) previousTime = time;
    if (playing) {
      progress = (progress + ((time - previousTime) * 100) / 12000) % 100;
      slider.value = progress.toFixed(2);
      updatePhaseLab();
    }
    previousTime = time;
    window.requestAnimationFrame(animationFrame);
  }

  slider.addEventListener("input", () => {
    progress = Number(slider.value);
    updatePhaseLab();
  });
  toggle.addEventListener("click", () => {
    playing = !playing;
    toggle.textContent = playing ? "Pause" : "Reprendre";
    toggle.setAttribute("aria-pressed", String(!playing));
  });
  toggle.textContent = playing ? "Pause" : "Reprendre";
  updatePhaseLab();
  window.requestAnimationFrame(animationFrame);
}

function wireFollowFluid() {
  followIndex = 0;
  const order = ["compresseur", "condenseur", "detendeur", "evaporateur"];
  const states = {
    compresseur: ["Compresseur", "Pression : HP · Niveau thermique : très chaud · Phase : vapeur."],
    condenseur: ["Condenseur", "Pression : HP · Niveau thermique : chaud à tiède · Phase : liquide."],
    detendeur: ["Détendeur", "Pression : BP · Niveau thermique : très froid · Phase : mélange liquide + vapeur."],
    evaporateur: ["Évaporateur", "Pression : BP · Niveau thermique : froid · Phase : vapeur."]
  };
  $$("[data-order-organ]").forEach(button => {
    button.addEventListener("click", () => {
      const choice = button.dataset.orderOrgan;
      const feedback = $("#follow-feedback");
      if (choice !== order[followIndex]) {
        button.classList.add("wrong");
        feedback.textContent = followIndex === 0 ? "Pas encore. Suivez la flèche bleu ciel : la vapeur BP arrive au compresseur." : "Pas encore. Suivez la flèche colorée depuis le dernier organe validé.";
        feedback.className = "exercise-feedback error";
        window.setTimeout(() => button.classList.remove("wrong"), 600);
        return;
      }
      button.classList.add("correct");
      button.disabled = true;
      const [name, state] = states[choice];
      $("#fluid-history").insertAdjacentHTML("beforeend", `<div class="fluid-step fluid-step-${choice}"><b>${followIndex + 1}</b><span><strong>${name}</strong>${state}</span></div>`);
      $$(".circuit-organ").forEach(organ => organ.classList.toggle("active", organ.dataset.organ === choice));
      $(".circuit-map").dataset.flowStep = choice;
      followIndex += 1;
      feedback.textContent = followIndex === 4 ? "✓ Cycle complet : la vapeur BP surchauffée retourne au compresseur." : `${followIndex} étape${followIndex > 1 ? "s" : ""} sur 4. Continuez.`;
      feedback.className = `exercise-feedback ${followIndex === 4 ? "success" : ""}`;
    });
  });
}

function wireQuiz() {
  const restart = $("#quiz-restart");
  if (restart) {
    restart.addEventListener("click", () => {
      quizIndex = 0;
      quizScore = 0;
      quizLocked = false;
      $("#lesson-zone").innerHTML = renderQuiz();
      wireQuiz();
    });
    return;
  }
  $$("[data-quiz-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (quizLocked) return;
      quizLocked = true;
      const question = quizQuestions[quizIndex];
      const answerIndex = Number(button.dataset.quizAnswer);
      const correct = answerIndex === question.correct;
      if (correct) quizScore += 1;
      $$("[data-quiz-answer]").forEach((option) => {
        option.disabled = true;
        // l'indice d'ORIGINE, jamais la position DOM : les propositions sont mélangées
        if (Number(option.dataset.quizAnswer) === question.correct) option.classList.add("good");
        if (option === button && !correct) option.classList.add("bad");
      });
      const feedback = $("#quiz-feedback");
      feedback.innerHTML = `${correct ? "✓ Bonne réponse." : "✗ À corriger."} ${question.why}<br><button class="primary-button quiz-next" id="quiz-next" type="button">${quizIndex === quizQuestions.length - 1 ? "Voir mon résultat" : "Question suivante →"}</button>`;
      feedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
      $("#quiz-next").addEventListener("click", () => {
        quizIndex += 1;
        quizLocked = false;
        $("#lesson-zone").innerHTML = renderQuiz();
        wireQuiz();
      });
    });
  });
}

function loadRate() {
  try {
    const saved = Number(localStorage.getItem("inerweb-circuit-voice-rate"));
    const index = rates.indexOf(saved);
    if (index >= 0) rateIndex = index;
  } catch {
    rateIndex = 2;
  }
  updateRateLabel();
}

function saveRate() {
  try {
    localStorage.setItem("inerweb-circuit-voice-rate", String(rates[rateIndex]));
  } catch {
    // La mémorisation est facultative si le stockage local est bloqué.
  }
  updateRateLabel();
  if (speechState !== "idle") speakCurrent();
}

function updateRateLabel() {
  $("#rate-label").textContent = `${rates[rateIndex].toFixed(2).replace(".", ",")}×`;
}

function chooseVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const french = voices.filter(voice => /^fr(-|_)/i.test(voice.lang));
  const ranked = french.sort((a, b) => voiceScore(b) - voiceScore(a));
  selectedVoice = ranked[0] || voices.find(voice => /^fr/i.test(voice.lang)) || null;
}

function voiceScore(voice) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = voice.lang.toLowerCase() === "fr-fr" ? 8 : 4;
  ["natural", "neural", "online", "google"].forEach(word => {
    if (name.includes(word)) score += 3;
  });
  if (voice.localService === false) score += 1;
  return score;
}

function speakCurrent() {
  speakText(stages[currentStage].narration);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    $("#speech-warning").hidden = false;
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = rates[rateIndex];
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => setSpeechState("speaking");
  utterance.onend = () => setSpeechState("idle");
  utterance.onerror = event => {
    if (event.error !== "canceled" && event.error !== "interrupted") $("#speech-warning").hidden = false;
    setSpeechState("idle");
  };
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function pauseSpeech() {
  if (!("speechSynthesis" in window)) return;
  if (speechState === "speaking") {
    window.speechSynthesis.pause();
    setSpeechState("paused");
  } else if (speechState === "paused") {
    window.speechSynthesis.resume();
    setSpeechState("speaking");
  }
}

function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  currentUtterance = null;
  setSpeechState("idle");
}

function setSpeechState(state) {
  speechState = state;
  $("#listen").textContent = state === "speaking" || state === "paused" ? "Relire" : "Écouter";
  $("#pause").disabled = state === "idle";
  $("#pause").textContent = state === "paused" ? "Reprendre" : "Pause";
  if ($("#dossier-listen")) $("#dossier-listen").textContent = state === "speaking" || state === "paused" ? "Relire le dossier" : "Écouter le dossier";
  if ($("#dossier-pause")) {
    $("#dossier-pause").disabled = state === "idle";
    $("#dossier-pause").textContent = state === "paused" ? "Reprendre" : "Pause";
  }
}

$("#start-course").addEventListener("click", () => {
  $("#module").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(speakCurrent, 450);
});
$("#previous").addEventListener("click", () => goToStage(currentStage - 1));
$("#next").addEventListener("click", () => {
  if (currentStage === stages.length - 1) {
    $(".takeaway").scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    goToStage(currentStage + 1, true);
  }
});
$("#listen").addEventListener("click", speakCurrent);
$("#pause").addEventListener("click", pauseSpeech);
$("#slower").addEventListener("click", () => {
  rateIndex = Math.max(0, rateIndex - 1);
  saveRate();
});
$("#faster").addEventListener("click", () => {
  rateIndex = Math.min(rates.length - 1, rateIndex + 1);
  saveRate();
});

function restartCourse() {
  followIndex = 0;
  quizIndex = 0;
  quizScore = 0;
  quizLocked = false;
  highestStage = 0;
  goToStage(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("#restart-top").addEventListener("click", restartCourse);
$("#restart-bottom").addEventListener("click", restartCourse);

if ("speechSynthesis" in window) {
  chooseVoice();
  window.speechSynthesis.addEventListener("voiceschanged", chooseVoice);
} else {
  $("#speech-warning").hidden = false;
  $("#listen").disabled = true;
  $("#pause").disabled = true;
}

buildStepper();
buildDossiers();
loadRate();
goToStage(0);
