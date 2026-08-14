(function initialiseExpansionValveCourse() {
  "use strict";

  const STORAGE_RATE = "inerweb-detendeur-rate";
  const RATE_VALUES = [0.8, 0.95, 1.1, 1.25];
  const ui = {
    stepper: document.getElementById("stepper"),
    kicker: document.getElementById("lesson-kicker"),
    title: document.getElementById("lesson-title"),
    intro: document.getElementById("lesson-intro"),
    detail: document.getElementById("lesson-detail"),
    takeaway: document.getElementById("lesson-takeaway"),
    visualTitle: document.getElementById("visual-title"),
    visualHint: document.getElementById("visual-hint"),
    controls: document.getElementById("visual-controls"),
    root: document.getElementById("visual-root"),
    caption: document.getElementById("visual-caption"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    voiceButton: document.getElementById("voice-button"),
    voiceRate: document.getElementById("voice-rate"),
    sourceButton: document.getElementById("source-button"),
    sourcesDialog: document.getElementById("sources-dialog"),
    status: document.getElementById("app-status")
  };

  let current = 0;
  let furthest = 0;
  let speechRun = 0;
  let speaking = false;
  let paused = false;
  let selectedVoice = null;
  let voiceRate = readRate();
  let activeTimers = [];

  const quiz = { index: 0, score: 0, answered: false, complete: false, selected: null };
  const quizQuestions = [
    {
      prompt: "Que régule un détendeur thermostatique ?",
      answers: ["La vitesse du compresseur selon la demande", "La température du condenseur selon la saison", "L’injection de liquide selon la surchauffe"],
      correct: 2,
      why: "Le détendeur module le débit vers l’évaporateur à partir de la surchauffe mesurée en sortie."
    },
    {
      prompt: "Où se trouvent l’organe et son bulbe ?",
      answers: ["Détendeur sur le refoulement, bulbe sur la ligne liquide", "Détendeur à l’entrée de l’évaporateur, bulbe sur l’aspiration", "Détendeur sur la ligne liquide, bulbe à l’entrée du condenseur"],
      correct: 1,
      why: "Le détendeur alimente l’évaporateur. Le bulbe capte la température de la vapeur qui en sort."
    },
    {
      prompt: "La vapeur vaut 7 °C et la saturation 2 °C. Quelle est la surchauffe ?",
      answers: ["2 K", "5 K", "9 K"],
      correct: 1,
      why: "Surchauffe = température du tube - température de saturation = 7 - 2 = 5 K."
    },
    {
      prompt: "Quand l’égalisation externe est-elle indispensable sur l’exemple T 2 / TE 2 ?",
      answers: ["Avec un distributeur de liquide", "Quand le voyant est clair", "Uniquement pendant le tirage au vide"],
      correct: 0,
      why: "La fiche Danfoss demande la TE 2 avec un distributeur afin de prendre en compte la pression en sortie d’évaporateur. Elle compense l’effet de la perte de charge sans la supprimer."
    },
    {
      prompt: "Comment choisir une buse interchangeable ?",
      answers: ["Avec le fluide, la puissance et les conditions", "Avec le diamètre du corps et la place disponible", "Avec la plus grande capacité disponible au magasin"],
      correct: 0,
      why: "Une buse se sélectionne avec les données de l’installation et la documentation constructeur."
    },
    {
      prompt: "Que faire avant de toucher au réglage de surchauffe ?",
      answers: ["Stabiliser, mesurer et chercher les autres causes", "Faire un tour de vis et observer le résultat obtenu", "Ajouter du fluide jusqu’à voir le voyant se remplir"],
      correct: 0,
      why: "Un réglage ne corrige ni un manque de liquide, ni un filtre colmaté, ni un bulbe mal fixé, ni une mauvaise buse."
    }
  ];

  const lessons = [
    {
      short: "Placer",
      kicker: "Écran 1 · Circuit",
      title: "Lire le circuit dans le sens du fluide",
      intro: "Le liquide HP descend du condenseur, traverse le détendeur, puis entre dans l’évaporateur en BP.",
      detail: `<div class="key-box"><strong>Croix du frigoriste :</strong> détendeur à gauche, compresseur à droite, condenseur en haut, évaporateur en bas.</div>
        <div class="fact"><strong>Orientation :</strong> sur la branche verticale, le symbole est tourné d’un quart de tour : entrée HP en haut, sortie BP en bas.</div>
        <div class="fact"><strong>Commande :</strong> le bulbe est serré sur l’aspiration, en sortie d’évaporateur ; son capillaire rejoint réellement la tête thermostatique.</div>`,
      takeaway: "Corps à l’entrée, bulbe à la sortie, capillaire relié à la tête.",
      visualTitle: "Suivre condenseur → détendeur → évaporateur",
      visualHint: "Choisis l’emplacement, puis observe le sens des flèches.",
      caption: "Circuit explicatif construit avec les symboles internes Pilote Fluides.",
      render: renderPlacement
    },
    {
      short: "Reconnaître",
      kicker: "Écran 2 · Appareil",
      title: "Reconnaître un détendeur thermostatique",
      intro: "Un corps dose le fluide. Un bulbe et une membrane commandent le clapet.",
      detail: `<ul><li><strong>Entrée liquide HP :</strong> raccord inférieur sur le modèle de principe représenté.</li>
        <li><strong>Sortie BP :</strong> raccord latéral vers l’évaporateur.</li>
        <li><strong>Train thermostatique :</strong> bulbe, charge, capillaire et tête à membrane.</li></ul>`,
      takeaway: "Je reconnais le corps, ses deux raccords et le bulbe relié à la tête.",
      visualTitle: "Reconnaître, puis regarder à l’intérieur",
      visualHint: "Affiche une seule lecture à la fois.",
      caption: "Dessin vectoriel original : forme pédagogique représentative, sans géométrie constructeur.",
      render: renderRole
    },
    {
      short: "Nommer",
      kicker: "Écran 3 · Construction",
      title: "Découvrir les pièces une par une",
      intro: "Chaque pièce a une action simple dans la chaîne de commande.",
      detail: `<ul><li><strong>Le bulbe :</strong> transforme la température du tube en pression.</li>
        <li><strong>La membrane et la tige :</strong> transmettent le mouvement.</li>
        <li><strong>Le clapet et l’orifice :</strong> agrandissent ou réduisent le passage.</li>
        <li><strong>Le ressort :</strong> s’oppose à l’ouverture.</li></ul>`,
      takeaway: "Bulbe → membrane → tige → clapet.",
      visualTitle: "Une pièce, une fonction",
      visualHint: "Choisis un nom : lui seul est mis en évidence.",
      caption: "Coupe manuelle générique : architecture fonctionnelle, sans cote constructeur.",
      render: renderComponents
    },
    {
      short: "Détendre",
      kicker: "Écran 4 · Transformation",
      title: "Le clapet dose le passage",
      intro: "Le liquide HP franchit un orifice minuscule. Après ce passage, la pression chute.",
      detail: `<div class="fact"><strong>Avant l’orifice :</strong> liquide HP, souvent sous-refroidi, poussé vers le passage calibré.</div>
        <div class="key-box"><strong>Après l’orifice :</strong> la pression chute et une partie du liquide se vaporise immédiatement.</div>
        <div class="fact"><strong>Conservation :</strong> au régime permanent, le débit massique entrant est égal au débit massique sortant.</div>`,
      takeaway: "L’orifice crée la chute de pression ; le clapet règle la surface de passage.",
      visualTitle: "Faire bouger le clapet",
      visualHint: "Compare faible, moyenne et forte ouverture.",
      caption: "Écoulement qualitatif : les bulles indiquent la vaporisation partielle, pas un titre massique chiffré.",
      render: renderExpansion
    },
    {
      short: "Calculer",
      kicker: "Écran 5 · Surchauffe",
      title: "La surchauffe compare deux températures",
      intro: "Le bulbe donne la température du tube. La prise de pression permet de trouver la température de saturation du fluide.",
      detail: `<div class="key-box"><strong>Formule :</strong> surchauffe = température du tube au bulbe − température de saturation liée à la pression.</div>
        <ol><li>Mesurer la température au bulbe.</li><li>Lire la pression au même point de référence.</li><li>Convertir cette pression en température de saturation pour le fluide.</li><li>Faire la différence en kelvins.</li></ol>`,
      takeaway: "Deux mesures cohérentes donnent le signal que le détendeur cherche à stabiliser.",
      visualTitle: "Calculer un écart de température",
      visualHint: "Déplace les deux curseurs.",
      caption: "Laboratoire de calcul pédagogique, sans table pression-température intégrée.",
      render: renderSuperheat
    },
    {
      short: "Équilibrer",
      kicker: "Écran 6 · Forces",
      title: "Trois forces déplacent un seul axe",
      intro: "La membrane compare les forces. La tige transmet son mouvement au clapet.",
      detail: `<div class="fact"><strong>Vers l’ouverture :</strong> la pression du bulbe crée une force vers le bas.</div>
        <div class="fact"><strong>Vers la fermeture :</strong> la pression d’évaporation et le ressort poussent en sens inverse.</div>
        <div class="key-box"><strong>Vis de réglage :</strong> elle comprime plus ou moins le ressort et modifie sa force.</div>`,
      takeaway: "Bulbe → membrane → tige → clapet : la force dominante fixe le passage.",
      visualTitle: "Suivre les forces et la chaîne cinématique",
      visualHint: "Compare trois états simples.",
      caption: "Sur la même membrane, les pressions deviennent des forces opposées.",
      render: renderForces
    },
    {
      short: "Voir bouger",
      kicker: "Écran 7 · Boucle complète",
      title: "Le détendeur s’adapte à la charge",
      intro: "Une variation de température parcourt toute la chaîne jusqu’au débit de fluide.",
      detail: `<ol class="mechanism-list"><li><strong>La charge thermique monte :</strong> la vapeur sort plus chaude.</li>
        <li><strong>Le bulbe se réchauffe :</strong> la pression du train thermostatique augmente.</li>
        <li><strong>Le clapet se déplace :</strong> le passage s’agrandit et le débit augmente.</li>
        <li><strong>La surchauffe redescend :</strong> le détendeur revient vers un nouvel équilibre.</li></ol>`,
      takeaway: "Surchauffe ↑ → ouverture ↑ → débit ↑ → surchauffe ↓.",
      visualTitle: "Tester chaud puis froid",
      visualHint: "Choisis la température de sortie ou rejoue la séquence.",
      caption: "Animation SVG originale : l’état écrit reste lisible sans mouvement.",
      render: renderRegulationLoop
    },
    {
      short: "Poser bulbe",
      kicker: "Écran 8 · Capteur",
      title: "Fixer le bulbe sur le tube qu’il doit mesurer",
      intro: "Le bulbe n’est pas décoratif : son contact avec l’aspiration commande directement l’ouverture.",
      detail: `<div class="key-box"><strong>Bon contact :</strong> portion horizontale propre, fixation ferme et position conforme au diamètre et à la notice.</div>
        <div class="fact"><strong>Continuité :</strong> le capillaire part du bulbe et rejoint sans coupure la tête thermostatique.</div>
        <div class="warning-box"><strong>À éviter :</strong> contact lâche, dessous du tube, zone perturbée ou source de chaleur extérieure.</div>`,
      takeaway: "Le bulbe mesure le tube, pas l’air autour.",
      visualTitle: "Choisir une implantation fiable",
      visualHint: "Teste les trois positions.",
      caption: "Principe générique ; la notice du modèle fixe la position horaire exacte.",
      render: renderBulb
    },
    {
      short: "Égaliser",
      kicker: "Écran 9 · Pression",
      title: "Séparer prise interne et prise externe",
      intro: "L’égalisation transmet une pression sous la membrane. Elle ne détend pas le fluide.",
      detail: `<div class="fact"><strong>T 2 interne :</strong> pression prélevée dans le corps, après la buse, près de l’entrée de l’évaporateur.</div>
        <div class="key-box"><strong>TE 2 externe :</strong> un vrai tube dédié relie la prise située après le bulbe au détendeur.</div>
        <div class="warning-box"><strong>Attention :</strong> l’égalisation externe compense l’effet d’une perte de charge ; elle ne supprime pas cette perte.</div>`,
      takeaway: "Distributeur ou perte de charge notable : suivre la conception et la notice prévues.",
      visualTitle: "Comparer les deux trajets de pression",
      visualHint: "Passe de T 2 à TE 2.",
      caption: "Exemple T 2 / TE 2 ; la conception réelle de l’installation reste prioritaire.",
      render: renderEqualization
    },
    {
      short: "Choisir buse",
      kicker: "Écran 10 · Dimensionnement",
      title: "Adapter la buse avant de toucher au réglage",
      intro: "La buse fixe la capacité de base ; le clapet ne peut moduler correctement que dans une plage adaptée.",
      detail: `<div class="key-box"><strong>Sélection :</strong> fluide, puissance, températures, sous-refroidissement et pertes de charge. Exemple T 2 / TE 2 : 0X, 00, 01…06.</div>
        <div class="fact"><strong>Ensemble démontable :</strong> sur la gamme documentée, la buse est associée à un filtre.</div>
        <div class="warning-box"><strong>Le piège :</strong> essayer de corriger une buse trop petite ou trop grande avec la vis de surchauffe.</div>`,
      takeaway: "Dimensionner d’abord ; régler ensuite seulement si le diagnostic le justifie.",
      visualTitle: "Comparer trois surfaces de passage",
      visualHint: "Choisis une buse et lis la conséquence.",
      caption: "Les numéros et puissances réels se sélectionnent dans la documentation constructeur.",
      render: renderOrifice
    },
    {
      short: "Régler",
      kicker: "Écran 11 · Méthode",
      title: "Régler seulement après avoir prouvé la cause",
      intro: "La vis modifie la compression du ressort et déplace l’équilibre mécanique ; elle n’ajoute ni fluide ni capacité à la buse.",
      detail: `<div class="fact"><strong>Ordre :</strong> stabiliser → mesurer → diagnostiquer → ajuster si la notice et les mesures le justifient.</div>
        <div class="warning-box"><strong>Ne pas masquer :</strong> manque de liquide, filtre colmaté, mauvaise buse, bulbe mal fixé ou égalisation incorrecte.</div>`,
      takeaway: "Une petite correction exige une nouvelle stabilisation et une nouvelle mesure.",
      visualTitle: "Suivre l’ordre avant toute correction",
      visualHint: "Parcours les quatre contrôles.",
      caption: "Aucune consigne universelle de sens, d’amplitude ou de nombre de tours.",
      render: renderAdjustment
    },
    {
      short: "Installer",
      kicker: "Écran 12 · Montage",
      title: "Assembler et braser selon la notice",
      intro: "La propreté, la buse, le filtre, le serrage et la chaleur conditionnent le fonctionnement.",
      detail: `<div class="fact"><strong>T 2 / TE 2 fourni :</strong> ensemble buse-filtre démontable ; références, couples et ordre de montage figurent dans le guide.</div>
        <div class="warning-box"><strong>Brasage illustré :</strong> protection humide, chaleur loin de l’élément et brasure à 15 % d’argent pour cet exemple.</div>`,
      takeaway: "La fiche du modèle fixe raccords, couples, température et contrôle d’étanchéité.",
      visualTitle: "Préparer sans contaminer ni surchauffer",
      visualHint: "Parcours les trois phases.",
      caption: "Exemple constructeur limité au T 2 / TE 2 ; aucune image Danfoss n’est reproduite.",
      render: renderInstallation
    },
    {
      short: "Diagnostiquer",
      kicker: "Écran 13 · Symptômes",
      title: "Sous-alimentation ou risque de retour liquide",
      intro: "Une surchauffe anormale est un symptôme, pas encore une cause.",
      detail: `<div class="fact"><strong>Surchauffe élevée :</strong> vérifier arrivée de liquide, filtre, buse, bulbe, égalisation et réglage.</div>
        <div class="warning-box"><strong>Surchauffe trop faible :</strong> risque de liquide vers le compresseur ; contrôler bulbe, buse, charge thermique et stabilité.</div>`,
      takeaway: "Je recoupe surchauffe, pressions, températures et état du circuit avant d’agir.",
      visualTitle: "Construire un diagnostic prudent",
      visualHint: "Explore trois familles de symptômes.",
      caption: "Le module n’autorise aucun réglage sans mesures et procédure validée.",
      render: renderDiagnosis
    },
    {
      short: "Défi",
      kicker: "Écran 14 · Vérifier",
      title: "Décider sans dérégler l’installation",
      intro: "Six situations vérifient rôle, placement, surchauffe, égalisation, buse et méthode.",
      detail: `<div class="key-box"><strong>Objectif :</strong> obtenir au moins 5 bonnes réponses sur 6.</div>
        <p>Chaque réponse est expliquée immédiatement.</p>`,
      takeaway: "Je sais expliquer le détendeur et poser les mesures avant l’action.",
      visualTitle: "Défi final",
      visualHint: "Une seule réponse par situation.",
      caption: "Quiz formatif : il ne remplace ni l’habilitation ni une procédure constructeur.",
      render: renderQuiz
    }
  ];

  function setControls(html) { ui.controls.innerHTML = html; }

  function clearActiveTimers() {
    activeTimers.forEach((timer) => window.clearTimeout(timer));
    activeTimers = [];
  }

  function scheduleAction(callback, delay) {
    const timer = window.setTimeout(() => {
      activeTimers = activeTimers.filter((item) => item !== timer);
      callback();
    }, delay);
    activeTimers.push(timer);
  }

  function markActive(selector, activeButton) {
    ui.controls.querySelectorAll(selector).forEach((button) => {
      const selected = button === activeButton;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function announce(message) {
    ui.status.textContent = "";
    window.setTimeout(() => { ui.status.textContent = message; }, 10);
  }

  function setReadout(message) {
    const target = document.getElementById("visual-readout");
    if (target) target.innerHTML = message;
  }

  // Chaque activité reconstruit sa zone visuelle par innerHTML : l’observateur annonce le nouvel
  // état une seule fois, sans avoir à instrumenter chacune des fonctions de rendu.
  let announceTimer = 0;
  let lastAnnounced = "";
  function watchVisualChanges() {
    if (!window.MutationObserver) return;
    new MutationObserver(() => {
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(() => {
        const readout = document.getElementById("visual-readout");
        const message = (readout ? readout.textContent : "").replace(/\s+/g, " ").trim();
        if (!message || message === lastAnnounced) return;
        lastAnnounced = message;
        announce(message);
      }, 80);
    }).observe(ui.root, { childList: true, subtree: true, characterData: true });
  }

  function circuitSvg(highlight = "valve") {
    const focus = (name) => highlight === name ? "symbol-focus" : "";
    return `<div class="diagram circuit-cross" role="img" aria-label="Circuit frigorifique : liquide haute pression du condenseur vers le détendeur, symbole tourné d’un quart de tour, mélange basse pression vers l’évaporateur, bulbe fixé en sortie et relié par son capillaire à la tête thermostatique">
      <svg viewBox="0 0 900 520" aria-hidden="true">
        <path class="hp-circuit" d="M720 300 V210 Q720 128 635 128 H265 Q180 128 180 210 V242"/>
        <path class="bp-circuit" d="M180 324 V330 Q180 392 265 392 H635 Q720 392 720 310"/>
        <path class="hp-flow mobile" d="M700 180 H585 M320 128 H220 M180 174 V225"/>
        <path class="bp-flow mobile" d="M180 338 V370 M250 392 H370 M545 392 H650 M720 365 V325"/>
        <g class="library-symbol ${focus("condenser")}"><image href="assets/symboles/echangeur_a_air.svg" x="350" y="58" width="200" height="135"/><text class="symbol-name" x="450" y="42">CONDENSEUR</text></g>
        <g class="library-symbol ${focus("compressor")}"><image href="assets/symboles/compresseur_general.svg" x="655" y="220" width="132" height="105"/><text class="symbol-name" x="721" y="350">COMPRESSEUR</text></g>
        <g class="library-symbol evaporator ${focus("evaporator")}"><image href="assets/symboles/echangeur_a_air.svg" x="350" y="330" width="200" height="135"/><text class="symbol-name" x="450" y="495">ÉVAPORATEUR</text></g>
        <g class="library-symbol ${focus("valve")}" transform="rotate(-90 180 282)"><image href="assets/symboles/detendeur_thermo_int.svg" x="105" y="207" width="150" height="150"/></g>
        <text class="symbol-name" x="180" y="202">DÉTENDEUR</text>
        <text class="rotation-note" x="180" y="350"><tspan x="180">SYMBOLE TOURNÉ ¼</tspan><tspan x="180" dy="15">HP ↓ · BP</tspan></text>
        <path class="bulb-line" d="M136 282 C72 340 118 470 286 470 H520 C570 470 596 430 612 397"/>
        <rect class="bulb-body" x="590" y="378" width="92" height="28" rx="14" transform="rotate(5 636 392)"/>
        <path class="bulb-strap-circuit" d="M604 374 Q636 430 668 374"/>
        <text class="bulb-label" x="690" y="430" text-anchor="end">BULBE · SORTIE ÉVAPORATEUR</text>
        <g class="flow-key" transform="translate(344 246)"><rect width="212" height="58" rx="12"/><path class="flow-key-hp" d="M16 20 H54"/><text x="64" y="25">HP · liquide</text><path class="flow-key-bp" d="M16 42 H54"/><text x="64" y="47">BP · liquide + vapeur</text></g>
      </svg>
    </div>`;
  }

  function equipmentSvg(mode = "outside") {
    return valveSvg({ view: mode, opening: 52, selected: mode === "outside" ? "body" : "" });
  }

  function valveSvg(options = {}) {
    const opening = Math.max(0, Math.min(100, Number(options.opening ?? 52)));
    const selected = options.selected || "";
    const forceState = options.forceState || "balanced";
    const view = options.view || (options.forces ? "forces" : "components");
    const showFlow = ["flow", "components", "expansion", "forces", "regulation", "work"].includes(view);
    const showValve = ["control", "components", "expansion", "forces", "regulation", "work"].includes(view);
    const showControl = ["outside", "control", "components", "expansion", "forces", "regulation", "work"].includes(view);
    const showTrain = ["outside", "control", "components", "forces", "regulation", "work"].includes(view);
    const showSpring = ["components", "forces", "regulation", "work"].includes(view);
    const travel = Math.round((opening - 50) * .23);
    const membraneY = 145 + Math.round((opening - 50) * .11);
    const focus = (name) => selected === name ? "av-selected" : "";
    const componentText = {
      element: "MEMBRANE · transforme la pression en mouvement",
      bulb: "TRAIN THERMOSTATIQUE · bulbe + charge + capillaire",
      body: "CORPS · relie la ligne liquide à l’évaporateur",
      orifice: "CLAPET + ORIFICE · dosent le passage",
      spring: "RESSORT · s’oppose à l’ouverture"
    }[selected] || "";
    const dotCount = Math.max(1, Math.round(opening / 14));
    const flowDots = Array.from({ length: 7 }, (_, index) => `<circle cx="${382 + index * 42}" cy="${420 - Math.min(index, 3) * 24}" r="${index % 2 ? 5 : 6}" style="opacity:${index < dotCount ? 1 : .12}"/>`).join("");
    const recognitionLabels = view === "outside" ? `<g class="av-callouts">
        <path d="M285 202 195 166"/><text x="184" y="163" text-anchor="end">CORPS EN ÉQUERRE</text>
        <path d="M405 104 520 74"/><text x="532" y="72">TÊTE THERMOSTATIQUE</text>
        <path d="M790 373 850 340"/><text x="875" y="337" text-anchor="end">BULBE SUR LE TUBE</text>
      </g>` : "";
    const flowLabels = view === "flow" ? `<g class="av-flow-labels">
        <path class="av-arrow-hp" d="M382 512 V447" marker-end="url(#avArrowOrange)"/><text class="av-text-hp" x="382" y="532" text-anchor="middle">LIQUIDE HP</text>
        <path class="av-arrow-bp" d="M650 300 H807" marker-end="url(#avArrowBlue)"/><text x="730" y="284" text-anchor="middle">VERS L’ÉVAPORATEUR</text>
        <path class="av-leader" d="M400 354 298 317"/><text x="288" y="313" text-anchor="end">ORIFICE CALIBRÉ</text>
      </g>` : "";
    const controlLabel = view === "control" ? `<g class="av-gas-card"><rect x="286" y="101" width="238" height="54" rx="12"/><text x="405" y="123" text-anchor="middle">LE GAZ DU BULBE POUSSE</text><path d="M357 129 V158 M405 129 V166 M453 129 V158" marker-end="url(#avArrowOrange)"/></g>` : "";
    const openingBadge = view === "expansion" ? `<g class="av-opening-badge"><rect x="58" y="54" width="188" height="64" rx="14"/><text x="152" y="80" text-anchor="middle">PASSAGE RÉGLABLE</text><text x="152" y="105" text-anchor="middle">ouverture ${Math.round(opening)} %</text></g>` : "";
    const forceCards = options.forces ? `<g class="av-force-layer av-force-${forceState}">
        <g class="av-force-open"><rect x="50" y="48" width="218" height="70" rx="14"/><text x="159" y="76" text-anchor="middle">BULBE</text><text x="159" y="101" text-anchor="middle">POUSSE · OUVRE ↓</text></g>
        <g class="av-force-close"><rect x="565" y="50" width="326" height="92" rx="14"/><text x="728" y="78" text-anchor="middle">PRESSION INTERNE + RESSORT</text><text x="728" y="105" text-anchor="middle">S’OPPOSENT · REFERMENT ↑</text></g>
        <path class="av-down-force" d="M405 117 V169" marker-end="url(#avArrowOrange)"/><path class="av-up-force" d="M510 237 V181" marker-end="url(#avArrowBlue)"/>
      </g>` : "";
    const regulationBadge = view === "regulation" ? `<g class="av-regulation-badge"><rect x="48" y="48" width="236" height="70" rx="14"/><text x="166" y="76" text-anchor="middle">${opening >= 50 ? "LA SORTIE CHAUFFE" : "LA SORTIE REFROIDIT"}</text><text x="166" y="101" text-anchor="middle">${opening >= 50 ? "→ le clapet ouvre" : "→ le clapet referme"}</text></g>` : "";
    return `<div class="diagram thermal-valve approved-valve av-view-${view} av-force-${forceState}" role="img" aria-label="Détendeur thermostatique à prise de pression interne, ouverture qualitative ${Math.round(opening)} pour cent. Le liquide haute pression entre par le bas et le mélange basse pression sort vers l’évaporateur à droite. Le bulbe est fixé sur le tube de sortie et relié à la tête par un capillaire continu.">
      <svg viewBox="0 0 960 540" aria-hidden="true">
        <defs>
          <linearGradient id="avBrass" x1="0" x2="1"><stop offset="0" stop-color="#c78a29"/><stop offset=".45" stop-color="#f0c56b"/><stop offset="1" stop-color="#b87518"/></linearGradient>
          <linearGradient id="avBulbMetal" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f8d58a"/><stop offset="1" stop-color="#d79a3b"/></linearGradient>
          <pattern id="avMixture" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#dcebf3"/><circle cx="6" cy="7" r="2.7" fill="#2688b7"/><circle cx="15" cy="14" r="2" fill="#2688b7"/></pattern>
          <marker id="avArrowOrange" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#c9451a"/></marker>
          <marker id="avArrowBlue" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#1b3a63"/></marker>
        </defs>
        <g class="av-body ${focus("body")}"><path class="av-body-shell" d="M220 220 L275 165 H495 L545 215 V245 H705 V355 H545 V385 L495 435 H280 L220 380Z"/><path class="av-inlet-neck" d="M333 435 V505 H430 V435"/><path class="av-outlet-neck" d="M705 260 H865 V340 H705"/><circle class="av-body-mark" cx="300" cy="285" r="25"/><path class="av-body-mark" d="M285 285 H315 M300 270 V300"/></g>
        ${showFlow ? `<g class="av-flow-system"><path class="av-inner-chamber" d="M382 505 V394 Q382 360 411 354 H500 Q536 354 558 315 H850"/><path class="av-hp-fluid" d="M382 505 V393"/><path class="av-bp-fluid" d="M425 354 H500 Q536 354 558 315 H850"/><g class="av-orifice ${focus("orifice")}"><path d="M350 337 H422 L434 353 422 369 H350Z"/><rect x="397" y="344" width="20" height="18" rx="4"/></g></g>` : ""}
        ${showValve ? `<g class="av-valve-system ${focus("orifice")}" transform="translate(0 ${travel})"><path class="av-pushrod" d="M405 164 V335"/><path class="av-needle" d="M388 335 L405 365 422 335Z"/></g><path class="av-seat" d="M372 366 Q405 350 438 366"/>` : ""}
        ${showControl ? `<g class="av-control-system ${focus("element")}"><path class="av-head-shell" d="M250 165 Q258 97 405 83 Q552 97 560 165Z"/><path class="av-membrane" d="M270 148 Q405 ${membraneY} 540 148"/><rect class="av-hub" x="382" y="137" width="46" height="22" rx="8" transform="translate(0 ${Math.round(travel * .55)})"/></g>` : ""}
        ${showTrain ? `<g class="av-train ${focus("bulb")}"><path class="av-capillary" d="M405 91 C405 40 520 35 610 68 C760 122 915 205 848 382"/><path class="av-suction-pipe" d="M575 425 H902"/><path class="av-pipe-flow mobile" d="M595 425 H885" marker-end="url(#avArrowBlue)"/><rect class="av-bulb" x="704" y="369" width="145" height="53" rx="26"/><path class="av-bulb-charge" d="M724 391 H829"/><path class="av-clamp" d="M730 363 V433 M822 363 V433"/><text class="av-pipe-caption" x="738" y="467" text-anchor="middle">SORTIE DE L’ÉVAPORATEUR</text></g>` : ""}
        ${showSpring ? `<g class="av-spring-system ${focus("spring")}"><path class="av-spring" d="M445 178 l-26 11 52 13-52 13 52 13-52 13 52 13-26 10"/><path class="av-internal-channel" d="M560 297 H530 Q500 297 500 260 V176" marker-end="url(#avArrowBlue)"/></g>` : ""}
        ${view === "components" && componentText ? `<g class="av-component-name"><rect x="48" y="48" width="430" height="55" rx="13"/><text x="263" y="82" text-anchor="middle">${componentText}</text></g>` : ""}
        ${view === "expansion" || view === "regulation" ? `<g class="av-flow-dots mobile">${flowDots}</g>` : ""}
        ${recognitionLabels}${flowLabels}${controlLabel}${openingBadge}${forceCards}${regulationBadge}
      </svg>
    </div>`;
  }

  function forceChainSvg(state = "balanced") {
    const data = {
      balanced: {
        motion: 0,
        relation: "F bulbe = F évap. + F ressort",
        result: "ÉQUILIBRE · position stable",
        opening: "PASSAGE STABLE",
        alt: "Les forces sont équilibrées. La membrane, la tige et le clapet restent en position stable."
      },
      bulb: {
        motion: 16,
        relation: "F bulbe > F évap. + F ressort",
        result: "LE BULBE DOMINE · ouverture",
        opening: "PASSAGE AUGMENTE",
        alt: "Le bulbe plus chaud crée la force dominante vers le bas. La membrane et la tige descendent. Le clapet s’éloigne du siège et ouvre davantage."
      },
      spring: {
        motion: -10,
        relation: "F bulbe < F évap. + F ressort",
        result: "LE RESSORT DOMINE · fermeture",
        opening: "PASSAGE DIMINUE",
        alt: "La vis comprime davantage le ressort. La force de fermeture domine vers le haut. La membrane, la tige et le clapet remontent vers le siège."
      }
    }[state];
    const membraneY = 150 + data.motion;
    const clapetY = 356 + data.motion;
    const springY = membraneY + 28;
    const bulbClass = state === "bulb" ? "is-dominant" : "";
    const springClass = state === "spring" ? "is-dominant" : "";

    return `<div class="diagram force-chain force-state-${state}" role="img" aria-label="${data.alt}">
      <svg viewBox="0 0 960 520" aria-hidden="true">
        <defs>
          <linearGradient id="fcBrass" x1="0" x2="1"><stop offset="0" stop-color="#d59a3f"/><stop offset=".5" stop-color="#f2cb78"/><stop offset="1" stop-color="#c47c22"/></linearGradient>
          <marker id="fcArrowOrange" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#c9451a"/></marker>
          <marker id="fcArrowBlue" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#3d7fca"/></marker>
          <marker id="fcArrowNavy" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#1b3a63"/></marker>
        </defs>

        <g class="fc-mechanism">
          <text class="fc-panel-title" x="300" y="28" text-anchor="middle">DANS LE DÉTENDEUR</text>
          <rect class="fc-bulb" x="26" y="58" width="154" height="48" rx="24"/>
          <text class="fc-label" x="103" y="88" text-anchor="middle">BULBE</text>
          <path class="fc-capillary" d="M180 82 C232 82 239 42 305 55 C355 64 337 73 305 82"/>

          <path class="fc-head" d="M158 176 Q168 101 305 82 Q442 101 452 176Z"/>
          <path class="fc-membrane" d="M183 ${membraneY} Q305 ${membraneY + 14} 427 ${membraneY}"/>
          <rect class="fc-hub" x="284" y="${membraneY - 8}" width="42" height="20" rx="7"/>
          <path class="fc-bulb-action ${bulbClass}" d="M305 98 V${membraneY - 15}" marker-end="url(#fcArrowOrange)"/>

          <path class="fc-body" d="M118 211 L168 176 H407 L457 215 V270 H548 V350 H457 V392 L407 430 H168 L118 390Z"/>
          <path class="fc-inlet" d="M255 430 V492 H351 V430"/>
          <path class="fc-outlet" d="M548 286 H588 V338 H548"/>
          <path class="fc-channel" d="M303 492 V389 Q303 350 340 350 H570"/>
          <path class="fc-liquid-hp" d="M303 484 V392"/>
          <path class="fc-mixture-bp" d="M340 350 H565"/>

          <path class="fc-rod" d="M305 ${membraneY + 10} V${clapetY - 5}"/>
          <path class="fc-seat" d="M272 350 H291 M319 350 H338"/>
          <path class="fc-clapet" d="M286 ${clapetY + 13} H324 L305 ${clapetY - 6}Z"/>
          <path class="fc-spring ${springClass}" d="M365 ${springY} l-20 11 40 12-40 12 40 12-40 12 40 12-20 11"/>
          <rect class="fc-adjust-screw ${springClass}" x="339" y="283" width="52" height="25" rx="5"/>
          <path class="fc-adjust-thread" d="M346 289 H384 M346 296 H384 M346 303 H384"/>
          <path class="fc-evap-channel" d="M506 325 H455 V195 H420 V${membraneY + 20}" marker-end="url(#fcArrowBlue)"/>

          <g class="fc-callout"><path d="M431 145 H516"/><text x="524" y="150">MEMBRANE</text></g>
          <g class="fc-callout"><path d="M386 230 H482"/><text x="490" y="235">RESSORT</text></g>
          <g class="fc-callout"><path d="M391 296 H482"/><text x="490" y="301">VIS DE RÉGLAGE</text></g>
          <g class="fc-callout"><path d="M286 362 H194"/><text x="187" y="367" text-anchor="end">TIGE + CLAPET</text></g>
          <text class="fc-pressure-note" x="459" y="339" text-anchor="middle">pression d’évaporation</text>
          <text class="fc-opening-note" x="397" y="386">${data.opening}</text>
        </g>

        <g class="fc-balance">
          <rect class="fc-balance-frame" x="610" y="35" width="330" height="382" rx="18"/>
          <text class="fc-panel-title" x="775" y="68" text-anchor="middle">FORCES SUR LA MEMBRANE</text>

          <text class="fc-force-name fc-orange-text" x="775" y="101" text-anchor="middle">F BULBE · OUVRE</text>
          <path class="fc-force fc-force-bulb ${bulbClass}" d="M775 112 V205" marker-end="url(#fcArrowOrange)"/>
          <path class="fc-balance-membrane" d="M650 224 Q775 240 900 224"/>
          <text class="fc-membrane-word" x="775" y="218" text-anchor="middle">MEMBRANE</text>

          <path class="fc-force fc-force-evap" d="M691 313 V245" marker-end="url(#fcArrowBlue)"/>
          <path class="fc-force fc-force-spring ${springClass}" d="M859 313 V245" marker-end="url(#fcArrowNavy)"/>
          <text class="fc-force-name" x="691" y="338" text-anchor="middle">F ÉVAP.</text>
          <text class="fc-force-sub" x="691" y="357" text-anchor="middle">pression sous la membrane</text>
          <text class="fc-force-name" x="859" y="338" text-anchor="middle">F RESSORT</text>
          <text class="fc-force-sub" x="859" y="357" text-anchor="middle">réglée par la vis</text>

          <rect class="fc-relation-box" x="637" y="371" width="276" height="32" rx="10"/>
          <text class="fc-relation" x="775" y="393" text-anchor="middle">${data.relation}</text>
          <text class="fc-result" x="775" y="433" text-anchor="middle">${data.result}</text>
        </g>

        <g class="fc-chain">
          <text class="fc-panel-title" x="480" y="445" text-anchor="middle">CHAÎNE CINÉMATIQUE</text>
          <g transform="translate(48 458)"><rect width="140" height="42" rx="11"/><text x="70" y="27" text-anchor="middle">BULBE</text></g>
          <path d="M190 479 H222" marker-end="url(#fcArrowNavy)"/>
          <g transform="translate(228 458)"><rect width="140" height="42" rx="11"/><text x="70" y="27" text-anchor="middle">MEMBRANE</text></g>
          <path d="M370 479 H402" marker-end="url(#fcArrowNavy)"/>
          <g transform="translate(408 458)"><rect width="140" height="42" rx="11"/><text x="70" y="27" text-anchor="middle">TIGE</text></g>
          <path d="M550 479 H582" marker-end="url(#fcArrowNavy)"/>
          <g transform="translate(588 458)"><rect width="140" height="42" rx="11"/><text x="70" y="27" text-anchor="middle">CLAPET</text></g>
          <path d="M730 479 H762" marker-end="url(#fcArrowNavy)"/>
          <g transform="translate(768 458)"><rect width="144" height="42" rx="11"/><text x="72" y="27" text-anchor="middle">PASSAGE</text></g>
        </g>
      </svg>
    </div>`;
  }

  function bulbSvg(position = "correct") {
    const data = {
      correct: { x: 330, y: 128, rotate: -18, path: "M416 100 C500 78 548 74 624 78", title: "CONTACT FERME · POSITION CONFORME", status: "Le bulbe suit la température du tube." },
      loose: { x: 330, y: 83, rotate: -7, path: "M419 72 C500 64 548 70 624 78", title: "CONTACT LÂCHE · ERREUR", status: "L’air influence la mesure : refixer correctement." },
      bottom: { x: 330, y: 240, rotate: 18, path: "M416 268 C512 280 548 164 624 92", title: "DESSOUS DU TUBE · À ÉVITER", status: "Huile et stratification peuvent perturber la mesure." }
    }[position];
    return `<div class="diagram bulb-diagram" role="img" aria-label="${data.title}">
      <svg viewBox="0 0 760 360" aria-hidden="true">
        <path class="suction-pipe" d="M55 180 H705"/>
        <path class="vapour-flow mobile" d="M75 180 H685"/>
        <g transform="translate(${data.x} ${data.y}) rotate(${data.rotate})">
          <rect class="sensing-bulb ${position === "correct" ? "correct" : "wrong"}" x="-90" y="-24" width="180" height="48" rx="24"/>
          <path class="bulb-strap" d="M-64 -34 Q0 60 64 -34"/>
        </g>
        <path class="capillary-to-head" d="${data.path}"/>
        <g class="mini-power-head"><ellipse cx="660" cy="78" rx="46" ry="17"/><rect x="632" y="78" width="56" height="38" rx="8"/><path d="M636 90 Q660 102 684 90"/><text x="660" y="140" text-anchor="middle">vers la membrane</text></g>
        <text class="placement-title" x="380" y="42">${data.title}</text>
        <text class="placement-note" x="380" y="320">${data.status}</text>
      </svg>
    </div>`;
  }

  function equalizationSvg(kind = "internal") {
    const external = kind === "external";
    return `<div class="diagram equalization-diagram" role="img" aria-label="${external ? "TE 2 à égalisation externe : un tube dédié transmet la pression prise sur la conduite de sortie, après le bulbe, jusqu’au dessous de la membrane" : "T 2 à égalisation interne : un passage situé dans le corps transmet la pression après l’orifice jusqu’au dessous de la membrane"}">
      <svg viewBox="0 0 900 430" aria-hidden="true">
        <defs><marker id="eqArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" fill="#1b3a63"/></marker></defs>
        <g class="eq-valve"><path class="eq-body" d="M82 190 126 146 H248 L286 184 V292 L248 326 H126 L82 288Z"/><path class="eq-head" d="M84 146 Q184 88 284 146Z"/><path class="eq-membrane" d="M102 139 Q184 157 266 139"/><path class="eq-port" d="M286 216 H342"/><text x="184" y="78" text-anchor="middle">DÉTENDEUR</text></g>
        <g class="eq-evaporator"><rect x="365" y="144" width="238" height="142" rx="12"/><path d="M382 178 H568 Q588 178 588 198 Q588 218 568 218 H398 Q378 218 378 240 Q378 260 398 260 H588"/><text x="484" y="126" text-anchor="middle">ÉVAPORATEUR</text></g>
        <path class="eq-suction" d="M603 230 H850"/><path class="eq-vapour mobile" d="M620 230 H835" marker-end="url(#eqArrow)"/>
        <g class="eq-bulb"><rect x="668" y="191" width="126" height="42" rx="21"/><path d="M692 184 V242 M770 184 V242"/><text x="731" y="177" text-anchor="middle">BULBE</text></g>
        <path class="eq-capillary" d="M668 200 C590 62 292 44 184 112"/>
        ${external ? `<g class="eq-external"><circle class="eq-tap" cx="824" cy="230" r="9"/><path class="equal-pressure external mobile" d="M824 239 V352 H322 V238" marker-end="url(#eqArrow)"/><text x="590" y="383" text-anchor="middle">TUBE EXTERNE · PRESSION PRISE APRÈS LE BULBE</text></g>` : `<g class="eq-internal"><circle class="eq-tap" cx="286" cy="230" r="9"/><path class="equal-pressure internal mobile" d="M286 230 H314 V172 H244" marker-end="url(#eqArrow)"/><text x="240" y="374" text-anchor="middle">PASSAGE INTERNE · PRESSION PRISE DANS LE CORPS</text></g>`}
        <g class="eq-caption ${external ? "external" : "internal"}"><rect x="526" y="58" width="330" height="62" rx="13"/><text x="691" y="84" text-anchor="middle">${external ? "TE 2 · PRISE EXTERNE" : "T 2 · PRISE INTERNE"}</text><text x="691" y="107" text-anchor="middle">la pression agit sous la membrane</text></g>
      </svg>
    </div>`;
  }

  function renderPlacement() {
    setControls(`<button type="button" class="choice-button" data-place="valve">Entrée évaporateur</button><button type="button" class="choice-button" data-place="compressor">Compresseur</button><button type="button" class="choice-button" data-place="condenser">Condenseur</button>`);
    ui.root.innerHTML = `<img class="technical-illustration circuit-reference" src="assets/symboles/croix-frigoriste.svg" alt="Croix du frigoriste : détendeur à gauche, tourné sur la branche verticale entre le condenseur et l’évaporateur"><div class="readout" id="visual-readout">Où place-t-on le détendeur dans la Croix du frigoriste ?</div>`;
    ui.controls.querySelectorAll("[data-place]").forEach((button) => button.addEventListener("click", () => {
      ui.controls.querySelectorAll("[data-place]").forEach((item) => item.classList.remove("correct", "wrong"));
      const correct = button.dataset.place === "valve";
      button.classList.add(correct ? "correct" : "wrong");
      ui.root.innerHTML = `${circuitSvg(button.dataset.place)}<div class="readout" id="visual-readout"></div>`;
      setReadout(correct ? "<strong>Correct :</strong> juste avant l’évaporateur ; le bulbe se trouve à sa sortie." : "<strong>À revoir :</strong> le détendeur est à gauche, à l’entrée de l’évaporateur.");
    }));
  }

  function renderRole() {
    const views = {
      outside: { label: "Vue extérieure", text: "Le corps métallique porte les raccords. Le bulbe et son capillaire aboutissent à la tête à membrane." },
      flow: { label: "Trajet du fluide", text: "Le liquide HP entre par le bas ; après l’orifice, le mélange BP sort latéralement vers l’évaporateur." },
      control: { label: "Chaîne de commande", text: "La température du tube agit sur le bulbe ; la pression se transmet par le capillaire jusqu’à la membrane." }
    };
    setControls(Object.entries(views).map(([key, item]) => `<button type="button" class="choice-button" data-view="${key}">${item.label}</button>`).join(""));
    const activate = (key) => {
      const item = views[key];
      markActive("[data-view]", ui.controls.querySelector(`[data-view="${key}"]`));
      ui.root.innerHTML = `${equipmentSvg(key)}<div class="readout" id="visual-readout"><strong>${item.label} :</strong> ${item.text}</div>`;
      announce(`${item.label}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.view)));
    activate("outside");
  }

  function renderComponents() {
    const parts = {
      element: "La membrane reçoit l’action de la charge thermostatique et déplace la tige.",
      bulb: "Le bulbe, sa charge et le capillaire forment le train thermostatique qui transmet l’effet de la température de sortie.",
      body: "Le corps relie la ligne liquide à l’entrée de l’évaporateur.",
      orifice: "Le clapet et l’orifice forment le passage réglable du fluide.",
      spring: "Le ressort s’oppose à l’ouverture et porte le réglage de surchauffe statique."
    };
    setControls(Object.keys(parts).map((key) => `<button type="button" class="choice-button" data-part="${key}">${({ element: "Membrane", bulb: "Bulbe", body: "Corps", orifice: "Clapet + orifice", spring: "Ressort" })[key]}</button>`).join(""));
    const activate = (part) => {
      markActive("[data-part]", ui.controls.querySelector(`[data-part="${part}"]`));
      ui.root.innerHTML = `${valveSvg({ selected: part, opening: 50 })}<div class="readout" id="visual-readout">${parts[part]}</div>`;
      announce(parts[part]);
    };
    ui.controls.querySelectorAll("[data-part]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.part)));
    activate("element");
  }

  function renderExpansion() {
    const states = {
      small: { opening: 18, title: "Faible ouverture", text: "Petit passage : le débit massique est limité." },
      modulating: { opening: 52, title: "Modulation", text: "Le passage s’adapte ; le débit massique se conserve entre entrée et sortie au régime permanent." },
      large: { opening: 86, title: "Forte ouverture", text: "Grand passage : davantage de fluide peut être injecté, puis partiellement vaporisé." }
    };
    setControls(Object.entries(states).map(([key, item]) => `<button type="button" class="choice-button" data-opening="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      const item = states[key];
      markActive("[data-opening]", ui.controls.querySelector(`[data-opening="${key}"]`));
      ui.root.innerHTML = `${valveSvg({ view: "expansion", opening: item.opening })}<div class="readout" id="visual-readout"><strong>${item.title} :</strong> ${item.text}</div>`;
      announce(`${item.title}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-opening]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.opening)));
    activate("modulating");
  }

  function renderSuperheat() {
    setControls("");
    ui.root.innerHTML = `<div class="superheat-lab">
      <div class="temperature-controls">
        <label>Tube au bulbe <output id="tube-output">7 °C</output><input id="tube-temperature" type="range" min="-5" max="20" value="7" step="1"></label>
        <label>Saturation <output id="sat-output">2 °C</output><input id="sat-temperature" type="range" min="-10" max="15" value="2" step="1"></label>
      </div>
      <div class="formula-card" aria-live="polite"><span id="formula-line">7 °C - 2 °C</span><strong id="superheat-output">5 K</strong><small id="superheat-word">SURCHAUFFE POSITIVE</small></div>
      <div class="readout" id="visual-readout">La différence vaut 5 K.</div>
    </div>`;
    const tube = document.getElementById("tube-temperature");
    const saturation = document.getElementById("sat-temperature");
    const update = () => {
      const tubeValue = Number(tube.value);
      const satValue = Number(saturation.value);
      const superheat = tubeValue - satValue;
      document.getElementById("tube-output").textContent = `${tubeValue} °C`;
      document.getElementById("sat-output").textContent = `${satValue} °C`;
      document.getElementById("formula-line").textContent = `${tubeValue} °C - ${satValue} °C`;
      document.getElementById("superheat-output").textContent = `${superheat} K`;
      document.getElementById("superheat-word").textContent = superheat > 0 ? "VAPEUR SURCHAUFFÉE" : (superheat === 0 ? "À LA SATURATION" : "VALEURS À VÉRIFIER");
      setReadout(`Température du tube moins saturation : <strong>${superheat} K</strong>.`);
    };
    tube.addEventListener("input", update);
    saturation.addEventListener("input", update);
  }

  function renderForces() {
    const states = {
      balanced: { text: "<strong>Équilibre :</strong> F bulbe = F évaporation + F ressort. Le clapet garde sa position." },
      bulb: { text: "<strong>Bulbe plus chaud :</strong> la membrane et la tige descendent ; le clapet s’éloigne du siège et le passage augmente." },
      spring: { text: "<strong>Ressort plus comprimé :</strong> la force de fermeture augmente ; le clapet remonte vers le siège et le passage diminue." }
    };
    setControls(`<button type="button" class="choice-button" data-force="balanced">1 · Équilibre</button><button type="button" class="choice-button" data-force="bulb">2 · Bulbe plus chaud</button><button type="button" class="choice-button" data-force="spring">3 · Ressort plus comprimé</button>`);
    const activate = (key) => {
      const item = states[key];
      markActive("[data-force]", ui.controls.querySelector(`[data-force="${key}"]`));
      ui.root.innerHTML = `${forceChainSvg(key)}<div class="readout" id="visual-readout">${item.text}</div>`;
      announce(item.text.replace(/<[^>]+>/g, ""));
    };
    ui.controls.querySelectorAll("[data-force]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.force)));
    activate("balanced");
  }

  function renderRegulationLoop() {
    const states = {
      hot: { opening: 82, text: "La sortie chauffe : la pression du bulbe augmente, le clapet ouvre et le débit augmente." },
      cold: { opening: 24, text: "La sortie refroidit : la pression du bulbe baisse, le ressort referme et le débit diminue." }
    };
    setControls(`<button type="button" class="choice-button" data-regulation="hot">La sortie chauffe</button><button type="button" class="choice-button" data-regulation="cold">La sortie refroidit</button><button type="button" class="action-button" id="replay-regulation">↻ Rejouer</button>`);
    const activate = (key, message = true) => {
      const item = states[key];
      markActive("[data-regulation]", ui.controls.querySelector(`[data-regulation="${key}"]`));
      ui.root.innerHTML = `${valveSvg({ view: "regulation", opening: item.opening, forceState: key === "hot" ? "high" : "low" })}<div class="readout" id="visual-readout">${item.text}</div>`;
      if (message) announce(item.text);
    };
    ui.controls.querySelectorAll("[data-regulation]").forEach((button) => button.addEventListener("click", () => {
      clearActiveTimers();
      activate(button.dataset.regulation);
    }));
    document.getElementById("replay-regulation").addEventListener("click", () => {
      clearActiveTimers();
      activate("hot", false);
      setReadout("La boucle repart : sortie chaude → bulbe → membrane → clapet → débit.");
      scheduleAction(() => activate("cold", false), 1250);
      scheduleAction(() => activate("hot", false), 2500);
    });
    activate("hot", false);
  }

  function renderBulb() {
    const messages = {
      correct: "<strong>Correct :</strong> fixation ferme sur une portion horizontale, à la position prévue par la notice.",
      loose: "<strong>Erreur :</strong> un contact lâche mesure aussi l’air ambiant.",
      bottom: "<strong>À éviter :</strong> le dessous du tube peut accumuler de l’huile et fausser la réponse."
    };
    setControls(`<button type="button" class="choice-button" data-bulb="correct">Contact ferme</button><button type="button" class="choice-button" data-bulb="loose">Contact lâche</button><button type="button" class="choice-button" data-bulb="bottom">Sous le tube</button>`);
    const activate = (key) => {
      markActive("[data-bulb]", ui.controls.querySelector(`[data-bulb="${key}"]`));
      ui.root.innerHTML = `${bulbSvg(key)}<div class="readout" id="visual-readout">${messages[key]}</div>`;
      announce(messages[key].replace(/<[^>]+>/g, " "));
    };
    ui.controls.querySelectorAll("[data-bulb]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.bulb)));
    activate("correct");
  }

  function renderEqualization() {
    const states = {
      internal: { title: "T 2 · égalisation interne", text: "La pression de fermeture est prise dans le corps, après la buse, près de l’entrée de l’évaporateur." },
      external: { title: "TE 2 · égalisation externe", text: "Une conduite dédiée transmet sous la membrane la pression de sortie d’évaporateur. Elle compense l’effet de la perte de charge sans la supprimer." }
    };
    setControls(`<button type="button" class="choice-button" data-equal="internal">T 2 · interne</button><button type="button" class="choice-button" data-equal="external">TE 2 · externe</button>`);
    const activate = (key) => {
      const item = states[key];
      markActive("[data-equal]", ui.controls.querySelector(`[data-equal="${key}"]`));
      ui.root.innerHTML = `${equalizationSvg(key)}<div class="readout" id="visual-readout"><strong>${item.title} :</strong> ${item.text}</div>`;
      announce(`${item.title}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-equal]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.equal)));
    activate("internal");
  }

  function renderOrifice() {
    const states = {
      small: { size: 28, title: "Trop petite", text: "Risque de sous-alimentation si elle ne couvre pas le besoin calculé.", style: "warning" },
      matched: { size: 52, title: "Adaptée", text: "La capacité calculée correspond au fluide et aux conditions prévues.", style: "key" },
      large: { size: 82, title: "Trop grande", text: "Risque de modulation instable ou d’alimentation excessive.", style: "warning" }
    };
    setControls(Object.entries(states).map(([key, item]) => `<button type="button" class="choice-button" data-orifice="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      const item = states[key];
      markActive("[data-orifice]", ui.controls.querySelector(`[data-orifice="${key}"]`));
      ui.root.innerHTML = `<div class="orifice-lab"><div class="orifice-cartridge"><span class="filter-mesh" aria-hidden="true"></span><span class="orifice-hole" style="--hole:${item.size}px" aria-hidden="true"></span><strong>BUSE + FILTRE</strong></div><div class="selection-card ${item.style}"><strong>${item.title}</strong><p>${item.text}</p><small>Fluide · puissance · températures · pertes de charge</small></div></div><div class="readout" id="visual-readout">${item.text}</div>`;
      announce(`${item.title}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-orifice]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.orifice)));
    activate("matched");
  }

  function renderAdjustment() {
    const phases = {
      stabilise: { title: "1 · STABILISER", items: ["Régime durable", "Charge thermique connue", "Temps d’équilibrage respecté"] },
      measure: { title: "2 · MESURER", items: ["Température au bulbe", "Pression au même point", "Saturation du fluide"] },
      diagnose: { title: "3 · DIAGNOSTIQUER", items: ["Arrivée de liquide", "Buse et filtre", "Bulbe et égalisation"] },
      adjust: { title: "4 · AJUSTER SI JUSTIFIÉ", items: ["Petite correction", "Sens et amplitude de la notice", "Nouvelle stabilisation"] }
    };
    setControls(Object.entries(phases).map(([key, phase]) => `<button type="button" class="choice-button" data-adjust="${key}">${phase.title}</button>`).join(""));
    const activate = (key) => {
      const phase = phases[key];
      markActive("[data-adjust]", ui.controls.querySelector(`[data-adjust="${key}"]`));
      ui.root.innerHTML = `<div class="adjustment-scene">${valveSvg({ view: "work", opening: key === "adjust" ? 58 : 48 })}<section class="installation-card"><h3>${phase.title}</h3><ul>${phase.items.map((item) => `<li>${item}</li>`).join("")}</ul></section></div><div class="readout" id="visual-readout">Le réglage n’est que la quatrième étape.</div>`;
      announce(`${phase.title}. ${phase.items.join(". ")}`);
    };
    ui.controls.querySelectorAll("[data-adjust]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.adjust)));
    activate("stabilise");
  }

  function renderInstallation() {
    const phases = {
      prepare: { title: "1 · PRÉPARER", items: ["Identifier fluide et référence", "Vérifier buse et filtre", "Garder les pièces propres"] },
      assemble: { title: "2 · ASSEMBLER", items: ["Respecter l’ordre du guide", "Appliquer les couples indiqués", "Ne pas forcer les raccords"] },
      braze: { title: "3 · BRASER / CONTRÔLER", items: ["Exemple T 2 / TE 2 : 15 % Ag", "Protéger l’élément de la chaleur", "Contrôler l’étanchéité selon la procédure"] }
    };
    setControls(Object.entries(phases).map(([key, phase]) => `<button type="button" class="choice-button" data-install="${key}">${phase.title}</button>`).join(""));
    const activate = (key) => {
      const phase = phases[key];
      markActive("[data-install]", ui.controls.querySelector(`[data-install="${key}"]`));
      ui.root.innerHTML = `<div class="installation-scene">${valveSvg({ view: "work", opening: 0, selected: key === "assemble" ? "orifice" : (key === "braze" ? "element" : "body") })}<section class="installation-card"><h3>${phase.title}</h3><ul>${phase.items.map((item) => `<li>${item}</li>`).join("")}</ul></section></div><div class="readout" id="visual-readout">La notice du modèle reste prioritaire.</div>`;
      announce(`${phase.title}. ${phase.items.join(". ")}`);
    };
    ui.controls.querySelectorAll("[data-install]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.install)));
    activate("prepare");
  }

  function renderDiagnosis() {
    const cases = {
      starved: { title: "Surchauffe élevée", checks: ["Arrivée de liquide et sous-refroidissement", "Filtre, buse et restrictions", "Bulbe, égalisation et réglage"], result: "Sous-alimentation possible ; la cause reste à identifier." },
      flooding: { title: "Surchauffe trop faible", checks: ["Contact et position du bulbe", "Buse et charge thermique", "Stabilité avant mesure"], result: "Alimentation excessive possible ; protéger le compresseur du retour liquide." },
      hunting: { title: "Ouverture instable", checks: ["Dimensionnement de la buse", "Répartition dans l’évaporateur", "Charge et mesure de pression"], result: "Oscillation possible ; ne pas corriger la vis sans éliminer les autres causes." }
    };
    setControls(Object.entries(cases).map(([key, item]) => `<button type="button" class="choice-button" data-case="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      const item = cases[key];
      markActive("[data-case]", ui.controls.querySelector(`[data-case="${key}"]`));
      const opening = key === "starved" ? 22 : (key === "flooding" ? 86 : 56);
      ui.root.innerHTML = `<div class="diagnosis-layout">${valveSvg({ view: "work", opening })}<ol class="diagnosis-steps">${item.checks.map((check) => `<li>${check}</li>`).join("")}</ol></div><div class="readout" id="visual-readout"><strong>Conclusion :</strong> ${item.result}</div>`;
      announce(`${item.title}. ${item.checks.join(". ")}. ${item.result}`);
    };
    ui.controls.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.case)));
    activate("starved");
  }

  function renderQuiz() {
    if (quiz.complete) {
      setControls(`<button type="button" class="action-button primary" id="restart-quiz">Refaire le défi</button>`);
      const success = quiz.score >= 5;
      ui.root.innerHTML = `<div class="quiz-result"><span class="quiz-score">${quiz.score}/6</span><strong>${success ? "Objectif atteint" : "Encore un passage utile"}</strong><p>${success ? "Tu sais expliquer le détendeur sans passer trop vite au réglage." : "Relis les corrections puis recommence."}</p></div>`;
      document.getElementById("restart-quiz").addEventListener("click", resetQuiz);
      updateNavigation();
      return;
    }
    const question = quizQuestions[quiz.index];
    setControls(quiz.answered ? `<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>` : "");
    ui.root.innerHTML = `<div class="quiz-shell"><div class="quiz-meta"><span>Question ${quiz.index + 1} sur ${quizQuestions.length}</span><span>Score : ${quiz.score}</span></div><h3 class="quiz-prompt">${question.prompt}</h3><div class="quiz-answers">${question.answers.map((answer, index) => `<button type="button" class="quiz-choice" data-answer="${index}">${answer}</button>`).join("")}</div><div class="quiz-feedback" id="quiz-feedback">Choisis une réponse.</div></div>`;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuiz(Number(button.dataset.answer))));
    if (quiz.answered) restoreAnsweredQuiz(question);
  }

  function answerQuiz(answerIndex) {
    if (quiz.answered) return;
    quiz.answered = true;
    quiz.selected = answerIndex;
    const question = quizQuestions[quiz.index];
    if (answerIndex === question.correct) quiz.score += 1;
    ui.root.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      if (index === answerIndex && index !== question.correct) button.classList.add("bad");
    });
    const correct = answerIndex === question.correct;
    document.getElementById("quiz-feedback").innerHTML = `<strong>${correct ? "✓ Correct." : "✗ À revoir."}</strong> ${question.why}`;
    announce(`${correct ? "Correct." : "À revoir."} ${question.why}`);
    setControls(`<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>`);
    document.getElementById("next-question").addEventListener("click", nextQuizQuestion);
    // Les boutons de réponse viennent d’être désactivés : sans ce report, le clavier repart du haut du document.
    document.getElementById("next-question").focus();
  }

  function restoreAnsweredQuiz(question) {
    ui.root.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      if (index === quiz.selected && index !== question.correct) button.classList.add("bad");
    });
    document.getElementById("quiz-feedback").innerHTML = `<strong>Réponse enregistrée.</strong> ${question.why}`;
    const next = document.getElementById("next-question");
    if (next) next.addEventListener("click", nextQuizQuestion);
  }

  function nextQuizQuestion() {
    if (quiz.index >= quizQuestions.length - 1) quiz.complete = true;
    else { quiz.index += 1; quiz.answered = false; quiz.selected = null; }
    renderQuiz();
  }

  function resetQuiz() {
    quiz.index = 0;
    quiz.score = 0;
    quiz.answered = false;
    quiz.complete = false;
    quiz.selected = null;
    renderQuiz();
    updateNavigation();
  }

  function renderLesson(index, focusTitle = false) {
    clearActiveTimers();
    stopSpeech();
    ui.status.textContent = "";
    current = Math.max(0, Math.min(lessons.length - 1, index));
    furthest = Math.max(furthest, current);
    const lesson = lessons[current];
    ui.kicker.textContent = lesson.kicker;
    ui.title.textContent = lesson.title;
    ui.intro.textContent = lesson.intro;
    ui.detail.innerHTML = lesson.detail;
    ui.takeaway.textContent = lesson.takeaway;
    ui.visualTitle.textContent = lesson.visualTitle;
    ui.visualHint.textContent = lesson.visualHint;
    ui.caption.textContent = lesson.caption;
    setControls("");
    ui.root.innerHTML = "";
    lesson.render();
    updateStepper();
    updateNavigation();
    if (focusTitle) ui.title.focus({ preventScroll: true });
  }

  function buildStepper() {
    ui.stepper.style.setProperty("--step-count", lessons.length);
    ui.stepper.innerHTML = lessons.map((lesson, index) => `<button type="button" class="step-button" data-step="${index}" aria-label="Étape ${index + 1} : ${lesson.short}"><span class="step-number">${index + 1}</span><span class="step-name">${lesson.short}</span></button>`).join("");
    ui.stepper.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => renderLesson(Number(button.dataset.step))));
  }

  function updateStepper() {
    ui.stepper.querySelectorAll("[data-step]").forEach((button, index) => {
      button.classList.toggle("active", index === current);
      button.classList.toggle("reached", index <= furthest);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function updateNavigation() {
    ui.previous.disabled = current === 0;
    const finalStep = current === lessons.length - 1;
    ui.next.disabled = finalStep && !quiz.complete;
    ui.next.textContent = finalStep ? (quiz.complete ? "Recommencer →" : "Terminer le défi") : "Continuer →";
    ui.progressLabel.textContent = `Étape ${current + 1} sur ${lessons.length}`;
    ui.progressBar.style.width = `${((current + 1) / lessons.length) * 100}%`;
  }

  function nextLesson() {
    if (current === lessons.length - 1) {
      if (!quiz.complete) return;
      resetQuiz();
      furthest = 0;
      renderLesson(0);
      return;
    }
    renderLesson(current + 1);
  }

  function previousLesson() {
    if (current > 0) renderLesson(current - 1);
  }

  function readRate() {
    try {
      const stored = Number(localStorage.getItem(STORAGE_RATE));
      return RATE_VALUES.includes(stored) ? stored : 0.95;
    } catch (_) {
      return 0.95;
    }
  }

  function storeRate(value) {
    try { localStorage.setItem(STORAGE_RATE, String(value)); }
    catch (_) { /* fonctionnement complet sans stockage */ }
  }

  function chooseVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const quality = /(natural|naturel|neural|online|google|microsoft)/i;
    selectedVoice = voices.find((voice) => /^fr-FR$/i.test(voice.lang) && quality.test(voice.name))
      || voices.find((voice) => /^fr-FR$/i.test(voice.lang))
      || voices.find((voice) => /^fr/i.test(voice.lang) && quality.test(voice.name))
      || voices.find((voice) => /^fr/i.test(voice.lang))
      || null;
  }

  function spokenText() {
    const lesson = lessons[current];
    const temporary = document.createElement("div");
    temporary.innerHTML = lesson.detail;
    return `${lesson.title}. ${lesson.intro} ${temporary.textContent || ""} À retenir : ${lesson.takeaway}`.replace(/\s+/g, " ").trim();
  }

  function startSpeech() {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      announce("La lecture vocale n’est pas disponible sur cet appareil.");
      return;
    }
    if (speaking && paused) {
      window.speechSynthesis.resume();
      paused = false;
      updateVoiceButton();
      return;
    }
    if (speaking) {
      window.speechSynthesis.pause();
      paused = true;
      updateVoiceButton();
      return;
    }
    stopSpeech();
    const run = ++speechRun;
    const utterance = new SpeechSynthesisUtterance(spokenText());
    utterance.lang = "fr-FR";
    utterance.pitch = 1;
    utterance.rate = voiceRate;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => {
      if (run !== speechRun) return;
      speaking = true;
      paused = false;
      updateVoiceButton();
    };
    utterance.onend = () => {
      if (run !== speechRun) return;
      speaking = false;
      paused = false;
      updateVoiceButton();
    };
    utterance.onerror = (event) => {
      if (run !== speechRun || event.error === "canceled" || event.error === "interrupted") return;
      speaking = false;
      paused = false;
      updateVoiceButton();
      announce("La lecture vocale n’est pas disponible pour le moment.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    speechRun += 1;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    paused = false;
    updateVoiceButton();
  }

  function updateVoiceButton() {
    ui.voiceButton.classList.toggle("playing", speaking && !paused);
    ui.voiceButton.innerHTML = speaking && !paused ? "Ⅱ <span>Pause</span>" : (paused ? "▶ <span>Reprendre</span>" : "▶ <span>Écouter</span>");
    ui.voiceButton.setAttribute("aria-label", speaking && !paused ? "Mettre la lecture en pause" : (paused ? "Reprendre la lecture" : "Écouter l’écran"));
  }

  ui.previous.addEventListener("click", previousLesson);
  ui.next.addEventListener("click", nextLesson);
  ui.voiceButton.addEventListener("click", startSpeech);
  ui.voiceRate.value = String(voiceRate);
  ui.voiceRate.addEventListener("change", () => {
    const value = Number(ui.voiceRate.value);
    if (!RATE_VALUES.includes(value)) return;
    const wasReading = speaking || paused;
    voiceRate = value;
    storeRate(value);
    if (wasReading) {
      stopSpeech();
      startSpeech();
    }
  });
  ui.sourceButton.addEventListener("click", () => {
    if (typeof ui.sourcesDialog.showModal === "function") ui.sourcesDialog.showModal();
    else ui.sourcesDialog.setAttribute("open", "");
  });
  document.addEventListener("keydown", (event) => {
    if (ui.sourcesDialog.open) return;
    const target = event.target;
    if (target && /INPUT|SELECT|TEXTAREA|BUTTON/.test(target.tagName)) return;
    if (event.key === "ArrowRight") nextLesson();
    if (event.key === "ArrowLeft") previousLesson();
    if (event.key === " " && speaking) {
      event.preventDefault();
      startSpeech();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    clearActiveTimers();
    stopSpeech();
  });
  window.addEventListener("pagehide", () => {
    clearActiveTimers();
    stopSpeech();
  });
  if (window.speechSynthesis) {
    chooseVoice();
    window.speechSynthesis.addEventListener?.("voiceschanged", chooseVoice);
  } else {
    ui.voiceButton.disabled = true;
  }

  buildStepper();
  renderLesson(0);
  watchVisualChanges();
})();
