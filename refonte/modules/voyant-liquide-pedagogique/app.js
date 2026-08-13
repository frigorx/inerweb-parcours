(function initialiseSightGlassCourse() {
  "use strict";

  const STORAGE_RATE = "inerweb-voyant-liquide-rate";
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

  const quiz = { index: 0, score: 0, answered: false, complete: false };
  const quizQuestions = [
    {
      prompt: "Que renseigne un voyant liquide sans indicateur d’humidité ?",
      answers: ["L’état visible du fluide à cet endroit", "La quantité exacte de fluide dans l’installation", "La teneur en eau du fluide"],
      correct: 0,
      why: "La fenêtre simple montre un état de circulation. Elle ne mesure ni l’humidité ni la charge totale."
    },
    {
      prompt: "Où place-t-on habituellement le voyant étudié ?",
      answers: ["Sur la ligne d’aspiration", "Après le filtre-déshydrateur, sur la ligne liquide horizontale étudiée", "Dans le carter du compresseur"],
      correct: 1,
      why: "Le voyant placé en aval du filtre peut révéler des bulles liées à une restriction. L’orientation réellement autorisée reste celle de la notice."
    },
    {
      prompt: "Des bulles apparaissent. Quelle conclusion est correcte ?",
      answers: ["Il manque forcément du fluide", "Le voyant est forcément cassé", "Il faut rechercher plusieurs causes et faire des mesures"],
      correct: 2,
      why: "Manque de sous-refroidissement, chute de pression, restriction, régime transitoire ou charge insuffisante peuvent produire des bulles."
    },
    {
      prompt: "Comment lire la pastille d’humidité ?",
      answers: ["Avec la légende du modèle, le fluide et la température", "Avec une couleur universelle valable pour tous les voyants", "Sans attendre la stabilisation du circuit"],
      correct: 0,
      why: "La couleur et ses seuils dépendent du produit, du fluide et de la température. Sur l’exemple Danfoss SG/SGP, un jaune au démarrage peut être transitoire : on conclut après stabilisation."
    },
    {
      prompt: "Une fenêtre claire prouve-t-elle que la charge est exacte ?",
      answers: ["Oui, toujours", "Non, elle doit être reliée au régime et aux mesures", "Oui, si le compresseur est arrêté"],
      correct: 1,
      why: "Une observation claire est un indice local. Le sous-refroidissement, les pressions, les températures et le fonctionnement complètent le diagnostic."
    },
    {
      prompt: "Avant de braser un voyant, que faut-il faire ?",
      answers: ["Chauffer directement le corps pour aller plus vite", "Suivre la notice, protéger le corps et employer la procédure sous azote prévue", "Retirer la vitre sur tous les modèles"],
      correct: 1,
      why: "La construction varie. La notice fixe le sens éventuel, la préparation et la protection thermique du modèle réel."
    }
  ];

  const lessons = [
    {
      short: "Reconnaître",
      kicker: "Écran 1 · Observer",
      title: "Reconnaître les deux voyants liquides",
      intro: "Les deux modèles possèdent une fenêtre. Un seul ajoute une pastille sensible à l’humidité.",
      detail: `<div class="fact"><strong>Voyant simple :</strong> il permet d’observer le fluide à l’endroit où il est monté.</div>
        <div class="key-box"><strong>Voyant avec indicateur :</strong> il ajoute une petite pastille d’humidité, placée au centre dans ce schéma, à lire avec la légende.</div>`,
      takeaway: "Je regarde la fenêtre, puis je vérifie si une pastille d’humidité est présente.",
      visualTitle: "Deux corps proches, deux lectures différentes",
      visualHint: "Compare les deux versions.",
      caption: "Schémas génériques originaux inerWeb — aucune marque ni dimension constructeur.",
      render: renderRecognise
    },
    {
      short: "Placer",
      kicker: "Écran 2 · Circuit",
      title: "Horizontal ici, et juste après le filtre",
      intro: "Dans le montage étudié, le filtre-déshydrateur et le voyant sont horizontaux. Le voyant vient directement après le filtre.",
      detail: `<div class="key-box"><strong>Pourquoi en aval :</strong> des bulles après le filtre peuvent signaler une chute de pression ou une restriction du déshydrateur.</div>
        <div class="warning-box"><strong>Orientation :</strong> l’horizontale vaut pour ce montage. La fiche SG/SGP montre aussi un tronçon vertical : suivre la notice.</div>`,
      takeaway: "Sur ce montage : filtre horizontal → voyant horizontal → organe de détente.",
      visualTitle: "Voir l’ordre et le positionnement",
      visualHint: "Choisis l’emplacement du voyant.",
      caption: "Illustration SVG originale ; montage horizontal de référence, pas règle universelle.",
      render: renderPlacement
    },
    {
      short: "Comparer",
      kicker: "Écran 3 · Fonctions",
      title: "Une lecture ou deux lectures",
      intro: "La fenêtre et la pastille ne répondent pas à la même question.",
      detail: `<div class="fact"><strong>Fenêtre :</strong> le fluide paraît-il continu, chargé de bulles ou difficile à interpréter ?</div>
        <div class="key-box"><strong>Pastille :</strong> l’humidité se situe-t-elle dans la zone annoncée par le fabricant ?</div>`,
      takeaway: "Avec indicateur : j’observe le fluide et l’humidité. Sans indicateur : j’observe seulement le fluide.",
      visualTitle: "Séparer les deux informations",
      visualHint: "Sélectionne une version.",
      caption: "La pastille n’est pas un débitmètre et la fenêtre n’est pas un hygromètre.",
      render: renderCompare
    },
    {
      short: "Ouvrir",
      kicker: "Écran 4 · Construction",
      title: "Voir les éléments du voyant",
      intro: "Le corps assure le raccordement. La vitre isole le fluide tout en permettant l’observation.",
      detail: `<ul><li><strong>Corps :</strong> pièce raccordée à la tuyauterie.</li>
        <li><strong>Fenêtre :</strong> zone transparente résistante et étanche.</li>
        <li><strong>Joint ou liaison :</strong> conception propre au fabricant.</li>
        <li><strong>Pastille éventuelle :</strong> élément sensible à l’humidité.</li></ul>`,
      takeaway: "La pastille est un élément ajouté ; elle n’existe pas sur le voyant simple.",
      visualTitle: "Coupe pédagogique",
      visualHint: "Clique un élément pour lire sa fonction.",
      caption: "Coupe de principe originale ; ne pas démonter un organe sous pression.",
      render: renderConstruction
    },
    {
      short: "Observer",
      kicker: "Écran 5 · Circulation",
      title: "La fenêtre montre un état local",
      intro: "Le voyant permet de regarder ce qui passe à cet endroit et à cet instant.",
      detail: `<div class="fact"><strong>Régime stable :</strong> une fenêtre pleine et sans bulles est compatible avec une arrivée de liquide continu.</div>
        <div class="warning-box"><strong>Limite :</strong> à l’arrêt ou dans une fenêtre vide, l’aspect clair peut être trompeur.</div>`,
      takeaway: "J’observe pendant un régime identifié, pas sur une image isolée.",
      visualTitle: "Comparer trois états visibles",
      visualHint: "Fais circuler, buller ou arrêter le fluide.",
      caption: "Animation qualitative : elle ne représente ni une vitesse ni une concentration mesurée.",
      render: renderFlowStates
    },
    {
      short: "Liquide plein",
      kicker: "Écran 6 · Lecture",
      title: "Clair ne signifie pas « charge exacte »",
      intro: "Un voyant plein sans bulles est un bon indice de liquide continu, mais ce n’est pas une preuve complète.",
      detail: `<div class="key-box"><strong>Ce que je peux dire :</strong> dans ce régime, aucun flash-gaz visible ne traverse la fenêtre.</div>
        <div class="warning-box"><strong>Ce que je ne peux pas dire seul :</strong> la masse exacte de fluide, le réglage du détendeur ou l’état de tout le circuit.</div>`,
      takeaway: "Je formule une observation locale, puis je la relie aux mesures.",
      visualTitle: "Observation et conclusion",
      visualHint: "Choisis la phrase rigoureuse.",
      caption: "Le voyant oriente le diagnostic ; il ne valide pas seul la charge.",
      render: renderClearReading
    },
    {
      short: "Bulles",
      kicker: "Écran 7 · Diagnostic",
      title: "Après le filtre, les bulles donnent un indice",
      intro: "Des bulles signalent que le fluide n’est pas entièrement liquide à cet endroit.",
      detail: `<div class="fact"><strong>Filtre à contrôler :</strong> si le voyant placé juste après présente des bulles, rechercher aussi un filtre colmaté, sous-dimensionné ou trop restrictif. Comparer les températures et, si possible, la pression avant et après.</div>
        <div class="warning-box"><strong>Le piège :</strong> ajouter du fluide uniquement parce que des bulles sont visibles.</div>`,
      takeaway: "Bulles = chercher la cause ; bulles ≠ manque de charge certain.",
      visualTitle: "Voir les causes possibles",
      visualHint: "Explore les quatre familles.",
      caption: "Le schéma « filtre colmaté » montre un indice à confirmer, jamais une preuve isolée.",
      render: renderBubbles
    },
    {
      short: "Humidité",
      kicker: "Écran 8 · Principe",
      title: "La pastille réagit à l’humidité",
      intro: "Sur un voyant équipé, un élément sensible change de couleur selon l’humidité du fluide.",
      detail: `<div class="fact"><strong>Principe :</strong> selon le produit, un support poreux imprégné d’un sel sensible change de teinte. Il est calibré pour des fluides et des températures définis.</div>
        <div class="warning-box"><strong>Limite :</strong> elle ne mesure pas une valeur universelle et ne remplace pas la légende du modèle.</div>`,
      takeaway: "Je vérifie le fluide, la température et la légende avant de nommer l’état.",
      visualTitle: "Faire varier l’état de la pastille",
      visualHint: "Observe les mots avec les couleurs.",
      caption: "Schéma original : la petite pastille reste distincte de la fenêtre où circule le fluide.",
      render: renderMoisturePrinciple
    },
    {
      short: "Lire couleur",
      kicker: "Écran 9 · Méthode",
      title: "Lire une couleur avec sa légende",
      intro: "La couleur ne travaille jamais seule : le mot, le contour et la référence produit complètent la lecture.",
      detail: `<div class="key-box"><strong>Exemple documenté :</strong> vert = sec, teinte intermédiaire = vigilance, jaune = humide.</div>
        <p><strong>Exemple SG/SGP :</strong> un jaune au démarrage peut être transitoire. S’il persiste, Danfoss demande d’éliminer l’humidité et de remplacer le déshydrateur au plus vite ; le retour au vert confirme l’effet.</p>`,
      takeaway: "Je lis la légende, puis j’attends l’équilibre avant de conclure.",
      visualTitle: "Relier couleur, mot et action",
      visualHint: "Sélectionne un état.",
      caption: "Les seuils en ppm varient avec le produit, le fluide et la température : la notice réelle fait foi.",
      render: renderMoistureReading
    },
    {
      short: "Sans indicateur",
      kicker: "Écran 10 · Frontière",
      title: "Le voyant simple ne dit rien sur l’humidité",
      intro: "Sans pastille, aucune couleur d’humidité n’est disponible.",
      detail: `<div class="fact"><strong>Possible :</strong> observer liquide continu, bulles, mousse ou circulation difficile à lire.</div>
        <div class="warning-box"><strong>Impossible avec ce seul organe :</strong> classer le circuit comme sec ou humide.</div>`,
      takeaway: "L’absence de pastille est une absence d’information, pas un état « sec ».",
      visualTitle: "Écarter les fausses conclusions",
      visualHint: "Choisis ce que le voyant simple permet d’affirmer.",
      caption: "Le diagnostic d’humidité nécessite un moyen adapté et la procédure prévue.",
      render: renderWithoutIndicator
    },
    {
      short: "Mesurer",
      kicker: "Écran 11 · Recouper",
      title: "Observer, puis mesurer",
      intro: "Le voyant devient utile lorsqu’il est relié au régime du circuit et à des mesures cohérentes.",
      detail: `<div class="key-box"><strong>Recoupements :</strong> sous-refroidissement, pressions, températures, écart au filtre et état des organes.</div>
        <div class="warning-box"><strong>Méthode :</strong> ne jamais modifier la charge avant d’avoir identifié le fluide, le régime et les causes possibles.</div>`,
      takeaway: "Un diagnostic solide combine observation, mesures et documentation.",
      visualTitle: "Construire le diagnostic",
      visualHint: "Choisis une situation et lis les contrôles utiles.",
      caption: "Aucune valeur universelle n’est fournie : les données du système réel sont nécessaires.",
      render: renderDiagnosis
    },
    {
      short: "Installer",
      kicker: "Écran 12 · Montage",
      title: "Protéger le voyant pendant le montage",
      intro: "Un voyant à braser peut être endommagé par une mauvaise préparation ou une chaleur dirigée vers son corps.",
      detail: `<div class="fact"><strong>Avant montage :</strong> vérifier compatibilité, pression admissible, raccords, sens éventuel et position de lecture.</div>
        <div class="warning-box"><strong>Exemple SGP/SG :</strong> azote sec, protection humide, brasure avec au moins 5 % d’argent et flamme loin du corps.</div>`,
      takeaway: "La notice du modèle fixe la bonne méthode de montage.",
      visualTitle: "Trois contrôles avant remise en service",
      visualHint: "Parcours la préparation, le brasage et le contrôle.",
      caption: "Aucune température ni procédure universelle n’est inventée dans ce module.",
      render: renderInstallation
    },
    {
      short: "Intervenir",
      kicker: "Écran 13 · Sécurité",
      title: "Ne jamais ouvrir un circuit sous pression",
      intro: "Le voyant est raccordé au fluide frigorigène et doit être traité comme un composant sous pression.",
      detail: `<div class="warning-box"><strong>Avant toute ouverture :</strong> appliquer la procédure de récupération, d’isolement et de mise en sécurité prévue pour l’installation.</div>
        <p>Après ouverture : suivre la procédure. <strong>Pastille SG/SGP cassée :</strong> éviter contact/poussière ; papier = déchet dangereux.</p>`,
      takeaway: "J’observe sans démonter ; toute intervention suit une procédure professionnelle validée.",
      visualTitle: "Du constat à l’action sûre",
      visualHint: "Sélectionne une étape de décision.",
      caption: "Le module n’autorise aucune intervention et ne remplace pas l’habilitation requise.",
      render: renderSafety
    },
    {
      short: "Défi",
      kicker: "Écran 14 · Vérifier",
      title: "Décider sans surinterpréter le voyant",
      intro: "Six situations vérifient la place, les deux variantes, les bulles, l’humidité et le montage.",
      detail: `<div class="key-box"><strong>Objectif :</strong> obtenir au moins 5 bonnes réponses sur 6.</div>
        <p>Chaque réponse est corrigée immédiatement.</p>`,
      takeaway: "Je distingue observation du fluide, indication d’humidité et diagnostic complet.",
      visualTitle: "Défi final",
      visualHint: "Une seule réponse par situation.",
      caption: "Quiz formatif : recommence autant de fois que nécessaire.",
      render: renderQuiz
    }
  ];

  function indicatorVisual(state) {
    const states = {
      dry: { fill: "#1e7e54", stroke: "#1e7e54", dash: "", word: "SEC" },
      caution: { fill: "#fff4e0", stroke: "#b06a00", dash: "3 7", word: "VIGILANCE" },
      wet: { fill: "#f5cc43", stroke: "#c0392b", dash: "11 7", word: "HUMIDE" }
    };
    return states[state] || states.dry;
  }

  function sightGlassSvg(options = {}) {
    const indicator = options.indicator !== false;
    const flow = options.flow || "clear";
    const state = indicatorVisual(options.moisture || "dry");
    const bubbles = flow === "bubbles" ? `
      <g class="sg-bubbles mobile" aria-hidden="true">
        <circle cx="333" cy="184" r="13"/><circle cx="371" cy="232" r="10"/><circle cx="410" cy="177" r="12"/>
        <circle cx="427" cy="213" r="8"/><circle cx="345" cy="221" r="7"/>
      </g>` : "";
    const stopped = flow === "stopped" ? `<g class="sg-stop"><circle cx="380" cy="205" r="66"/><path d="M338 163 L422 247"/><text x="380" y="300">ARRÊT · ÉTAT À IDENTIFIER</text></g>` : "";
    const flowTrace = flow === "clear" ? `<path class="sg-flow mobile" d="M84 205 H676"/>` : (flow === "bubbles" ? `<path class="sg-flow sg-flow-bubbles mobile" d="M84 205 H676"/>` : "");
    const windowMarkup = `<g class="sg-window">
        <circle cx="380" cy="205" r="76"/>
        <circle cx="380" cy="205" r="60"/>
      </g>`;
    const indicatorMarkup = indicator ? `<g class="sg-indicator" transform="translate(380 205)">
        <circle class="sg-indicator-reference" r="34"/>
        <circle class="sg-indicator-disc" r="20" fill="${state.fill}" stroke="${state.stroke}" stroke-width="7" stroke-dasharray="${state.dash}"/>
        <rect x="-58" y="34" width="116" height="32" rx="16" fill="#fffdf8" stroke="${state.stroke}" stroke-width="4" stroke-dasharray="${state.dash}"/>
        <text class="sg-indicator-word" x="0" y="56">${state.word}</text>
      </g>` : `<g class="sg-simple-window"><rect x="318" y="238" width="124" height="31" rx="15"/><text x="380" y="259">FENÊTRE SEULE</text></g>`;
    const label = indicator ? `Voyant liquide avec indicateur d’humidité, pastille ${state.word.toLowerCase()}` : "Voyant liquide sans indicateur d’humidité";
    const flowWords = { clear: "liquide continu", bubbles: "bulles visibles", stopped: "circuit arrêté" };
    return `<div class="diagram sight-glass-diagram ${flow === "bubbles" ? "is-bubbling" : ""}" role="img" aria-label="${label}, ${flowWords[flow]}">
      <svg viewBox="0 0 760 410" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <path class="sg-pipe" d="M42 205 H165 M595 205 H718"/>
        <polygon class="sg-arrow" points="112,183 151,205 112,227"/>
        <path class="sg-body" d="M165 142 H235 L270 108 H490 L525 142 H595 V268 H525 L490 302 H270 L235 268 H165 Z"/>
        <path class="sg-channel" d="M165 205 H595"/>
        ${windowMarkup}${flowTrace}${bubbles}${indicatorMarkup}${stopped}
        <text class="svg-small" x="43" y="251">sens observé</text>
        <text class="sg-model-label" x="380" y="355">${indicator ? "AVEC INDICATEUR D’HUMIDITÉ" : "SANS INDICATEUR D’HUMIDITÉ"}</text>
      </svg>
    </div>`;
  }

  function compareMarkup() {
    return `<div class="glass-comparison">
      <article class="glass-card simple-card"><h3>Sans indicateur d’humidité</h3><img class="equipment-image" src="assets/illustrations/voyant-sans-indicateur.svg?v=20260804-9" alt="Voyant liquide horizontal sans pastille d’humidité ; des bulles sont visibles dans la fenêtre"><p><strong>1 lecture :</strong> état visible du fluide.</p></article>
      <article class="glass-card indicator-card"><h3>Avec indicateur d’humidité</h3><img class="equipment-image" src="assets/illustrations/voyant-avec-indicateur.svg?v=20260804-9" alt="Voyant liquide horizontal avec petite pastille d’humidité verte au centre de la fenêtre"><p><strong>2 lectures :</strong> fluide autour + pastille centrale.</p></article>
    </div>`;
  }

  function liquidLineSvg(highlight = "sight") {
    return `<div class="diagram library-line" role="img" aria-label="Ligne liquide : bouteille, filtre-déshydrateur, voyant liquide, électrovanne et détendeur">
      <svg viewBox="0 0 980 340" aria-hidden="true">
        <text class="svg-title" x="490" y="34" text-anchor="middle">Ligne liquide de référence</text>
        <rect class="liquid-line-zone" x="260" y="62" width="645" height="190" rx="22"/>
        <text class="liquid-line-title" x="275" y="90">LIGNE LIQUIDE</text>
        <path class="connector-pipe" d="M168 170 H300 M390 170 H448 M548 170 H618 M708 170 H832"/>
        <path class="connector-flow flow-pass mobile" d="M168 170 H300 M390 170 H448 M548 170 H618 M708 170 H832"/>
        <g class="library-symbol"><image href="assets/symboles/bouteille_liquide.svg" x="42" y="114" width="150" height="90"/><text class="symbol-name" x="117" y="234">BOUTEILLE</text></g>
        <g class="library-symbol ${highlight === "filter" ? "symbol-focus" : ""}"><image href="assets/symboles/filtre_deshydrateur.svg" x="292" y="141" width="110" height="58"/><text class="symbol-name" x="347" y="234">FILTRE</text></g>
        <g class="library-symbol sight-location ${highlight === "sight" ? "symbol-focus" : ""}"><image href="assets/symboles/voyant_liquide.svg" x="437" y="137" width="122" height="64"/><text class="symbol-name" x="498" y="234">VOYANT</text></g>
        <g class="library-symbol"><image href="assets/symboles/electrovanne_frigo.svg" x="604" y="118" width="112" height="88"/><text class="symbol-name" x="660" y="234">ÉLECTROVANNE</text></g>
        <g class="library-symbol"><image href="assets/symboles/detendeur_thermo_ext.svg" x="812" y="93" width="118" height="132"/><text class="symbol-name" x="871" y="245">DÉTENDEUR</text></g>
        <path class="zone-bracket" d="M260 263 V283 H905 V263"/>
        <text class="zone-bracket-label" x="582" y="309">APRÈS LE FILTRE · AVANT L’ORGANE DE DÉTENTE</text>
      </svg>
    </div>`;
  }

  function cutawaySvg(selected = "window") {
    const labels = {
      body: "Corps raccordé à la tuyauterie et dimensionné pour le service prévu.",
      window: "Fenêtre transparente : elle permet l’observation sans ouvrir le circuit.",
      seal: "Liaison étanche : sa construction dépend du fabricant et ne se démonte jamais sous pression.",
      indicator: "Pastille sensible : présente seulement sur la version avec indicateur d’humidité."
    };
    return `<div class="diagram cutaway-diagram" role="img" aria-label="Coupe pédagogique d’un voyant liquide avec corps, fenêtre, liaison étanche et pastille">
      <svg viewBox="0 0 760 410" aria-hidden="true">
        <path class="sg-pipe" d="M55 226 H220 M540 226 H705"/>
        <path class="sg-body ${selected === "body" ? "is-selected" : ""}" d="M215 146 H298 L330 112 H430 L462 146 H545 V306 H462 L430 340 H330 L298 306 H215 Z"/>
        <path class="sg-channel" d="M215 226 H545"/>
        <rect class="cutaway-seal ${selected === "seal" ? "is-selected" : ""}" x="307" y="105" width="146" height="56" rx="22"/>
        <ellipse class="cutaway-window ${selected === "window" ? "is-selected" : ""}" cx="380" cy="136" rx="56" ry="34"/>
        <circle class="cutaway-indicator ${selected === "indicator" ? "is-selected" : ""}" cx="380" cy="136" r="21"/>
        <path class="label-line" d="M260 169 L136 93"/><text class="svg-label" x="32" y="87">Corps</text>
        <path class="label-line" d="M350 112 L304 49"/><text class="svg-label" x="218" y="38">Liaison étanche</text>
        <path class="label-line" d="M412 105 L502 51"/><text class="svg-label" x="510" y="47">Fenêtre</text>
        <path class="label-line" d="M400 136 L590 112"/><text class="svg-label" x="598" y="116">Pastille</text>
      </svg>
      <div class="readout" id="visual-readout">${labels[selected]}</div>
    </div>`;
  }

  function setControls(html) { ui.controls.innerHTML = html; }
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
    announce(message.replace(/<[^>]+>/g, " "));
  }

  function renderRecognise() {
    setControls(`<button type="button" class="action-button primary" id="compare-variants">Nommer les différences</button>`);
    ui.root.innerHTML = `${compareMarkup()}<div class="readout" id="visual-readout">Cherche la pastille colorée : elle distingue la version avec indicateur.</div>`;
    document.getElementById("compare-variants").addEventListener("click", () => {
      ui.root.querySelector(".simple-card")?.classList.add("identified-simple");
      ui.root.querySelector(".indicator-card")?.classList.add("identified-indicator");
      setReadout("<strong>Voyant simple :</strong> fenêtre seule. <strong>Avec indicateur :</strong> fenêtre et pastille d’humidité.");
    });
  }

  function renderPlacement() {
    setControls(`<button type="button" class="choice-button" data-place="before">Avant le filtre</button><button type="button" class="choice-button" data-place="correct">Après le filtre</button><button type="button" class="choice-button" data-place="suction">Sur l’aspiration</button>`);
    ui.root.innerHTML = `<img class="technical-illustration line-reference" src="assets/illustrations/ligne-liquide-horizontale.svg" alt="Montage horizontal de référence : le filtre-déshydrateur est suivi directement par le voyant liquide"><div class="readout" id="visual-readout">Où place-t-on le voyant sur le montage étudié ?</div>`;
    ui.controls.querySelectorAll("[data-place]").forEach((button) => button.addEventListener("click", () => {
      ui.controls.querySelectorAll("[data-place]").forEach((item) => item.classList.remove("correct", "wrong"));
      const correct = button.dataset.place === "correct";
      button.classList.add(correct ? "correct" : "wrong");
      setReadout(correct ? "<strong>Correct :</strong> filtre puis voyant, tous deux horizontaux sur ce montage. Le voyant placé en aval aide à repérer une restriction possible." : "<strong>À revoir :</strong> sur le montage étudié, le voyant est horizontal et directement après le filtre.");
    }));
  }

  function renderCompare() {
    setControls(`<button type="button" class="choice-button" data-variant="simple">Sans indicateur</button><button type="button" class="choice-button" data-variant="indicator">Avec indicateur</button>`);
    const activate = (variant) => {
      const active = ui.controls.querySelector(`[data-variant="${variant}"]`);
      markActive("[data-variant]", active);
      const hasIndicator = variant === "indicator";
      ui.root.innerHTML = `${sightGlassSvg({ indicator: hasIndicator, flow: "bubbles", moisture: "dry" })}<div class="readout" id="visual-readout">${hasIndicator ? "<strong>Deux lectures :</strong> bulles dans la fenêtre et état SEC annoncé par la pastille de cet exemple." : "<strong>Une seule lecture :</strong> des bulles sont visibles ; aucune information d’humidité n’est disponible."}</div>`;
      announce(hasIndicator ? "Voyant avec indicateur : lecture du fluide et de l’humidité." : "Voyant simple : lecture du fluide uniquement.");
    };
    ui.controls.querySelectorAll("[data-variant]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.variant)));
    activate("simple");
  }

  function renderConstruction() {
    setControls(`<button type="button" class="choice-button" data-part="body">Corps</button><button type="button" class="choice-button" data-part="window">Fenêtre</button><button type="button" class="choice-button" data-part="seal">Liaison étanche</button><button type="button" class="choice-button" data-part="indicator">Pastille</button>`);
    const activate = (part) => {
      markActive("[data-part]", ui.controls.querySelector(`[data-part="${part}"]`));
      ui.root.innerHTML = cutawaySvg(part);
      announce(document.getElementById("visual-readout")?.textContent || "Élément sélectionné.");
    };
    ui.controls.querySelectorAll("[data-part]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.part)));
    activate("window");
  }

  function renderFlowStates() {
    setControls(`<button type="button" class="choice-button" data-flow="clear">Liquide continu</button><button type="button" class="choice-button" data-flow="bubbles">Bulles visibles</button><button type="button" class="choice-button" data-flow="stopped">Circuit arrêté</button>`);
    const readouts = {
      clear: "<strong>Régime stable :</strong> le fluide paraît continu dans la fenêtre ; aucun flash-gaz n’est visible.",
      bubbles: "<strong>Observation :</strong> du gaz ou un mélange traverse la fenêtre. Il faut rechercher pourquoi.",
      stopped: "<strong>À l’arrêt :</strong> l’aspect de la fenêtre ne doit pas être interprété comme en fonctionnement stable."
    };
    const activate = (flow) => {
      markActive("[data-flow]", ui.controls.querySelector(`[data-flow="${flow}"]`));
      ui.root.innerHTML = `${sightGlassSvg({ indicator: false, flow })}<div class="readout" id="visual-readout">${readouts[flow]}</div>`;
      announce(readouts[flow].replace(/<[^>]+>/g, " "));
    };
    ui.controls.querySelectorAll("[data-flow]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.flow)));
    activate("clear");
  }

  function renderClearReading() {
    setControls(`<button type="button" class="choice-button" data-claim="exact">La charge est exacte</button><button type="button" class="choice-button" data-claim="local">Liquide continu ici</button><button type="button" class="choice-button" data-claim="dry">Le circuit est sec</button>`);
    ui.root.innerHTML = `${sightGlassSvg({ indicator: false, flow: "clear" })}<div class="readout" id="visual-readout">Quelle phrase reste vraie sans inventer une information ?</div>`;
    ui.controls.querySelectorAll("[data-claim]").forEach((button) => button.addEventListener("click", () => {
      ui.controls.querySelectorAll("[data-claim]").forEach((item) => item.classList.remove("correct", "wrong"));
      const correct = button.dataset.claim === "local";
      button.classList.add(correct ? "correct" : "wrong");
      setReadout(correct ? "<strong>Correct :</strong> dans ce régime, du liquide paraît continu à cet endroit." : "<strong>Conclusion trop large :</strong> la fenêtre seule ne prouve ni la charge exacte ni l’humidité.");
    }));
  }

  function renderBubbles() {
    const causes = {
      subcooling: { title: "Sous-refroidissement insuffisant", text: "Le liquide peut commencer à flasher avant d’atteindre le détendeur." },
      drop: { title: "Chute de pression", text: "Une vanne, une hauteur de colonne, une conduite ou un organe peut faire chuter la pression." },
      restriction: { title: "Filtre colmaté", text: "Des bulles juste après le filtre peuvent signaler une chute de pression excessive. Confirmer par l’écart de température ou la pression différentielle, puis vérifier le dimensionnement et le sous-refroidissement." },
      charge: { title: "Quantité insuffisante", text: "Une charge insuffisante est possible, mais elle doit être confirmée avec les autres symptômes et mesures." }
    };
    setControls(Object.entries(causes).map(([key, item]) => `<button type="button" class="choice-button" data-cause="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      markActive("[data-cause]", ui.controls.querySelector(`[data-cause="${key}"]`));
      const item = causes[key];
      const visual = key === "restriction"
        ? `<img class="technical-illustration restriction-reference" src="assets/illustrations/diagnostic-filtre-colmate.svg" alt="Comparaison entre un filtre traversé normalement et une restriction possible avec bulles dans le voyant placé en aval">`
        : `${sightGlassSvg({ indicator: false, flow: "bubbles" })}<div class="cause-card"><strong>${item.title}</strong><p>${item.text}</p></div>`;
      ui.root.innerHTML = `${visual}<div class="readout" id="visual-readout">${key === "restriction" ? "<strong>Filtre à contrôler :</strong> confirmer avec température, pression et sous-refroidissement." : "Une cause possible parmi plusieurs : mesure avant d’agir."}</div>`;
      announce(`${item.title}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-cause]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.cause)));
    activate("subcooling");
  }

  function renderMoisturePrinciple() {
    setControls(`<button type="button" class="choice-button" data-moisture="dry">Sec</button><button type="button" class="choice-button" data-moisture="caution">Vigilance</button><button type="button" class="choice-button" data-moisture="wet">Humide</button>`);
    const activate = (state) => {
      markActive("[data-moisture]", ui.controls.querySelector(`[data-moisture="${state}"]`));
      const words = { dry: "La pastille de cet exemple annonce SEC.", caution: "La teinte intermédiaire annonce VIGILANCE.", wet: "La pastille de cet exemple annonce HUMIDE." };
      ui.root.innerHTML = `${sightGlassSvg({ indicator: true, flow: "clear", moisture: state })}<div class="readout" id="visual-readout"><strong>${words[state]}</strong> Vérifie toujours la légende réelle.</div>`;
      announce(`${words[state]} Vérifier la légende réelle.`);
    };
    ui.controls.querySelectorAll("[data-moisture]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.moisture)));
    activate("dry");
  }

  function renderMoistureReading() {
    const states = {
      dry: { title: "SEC · zone acceptable", note: "Dans l’exemple documenté, le vert correspond à la zone sèche. Après traitement, son retour confirme l’équilibre rétabli." },
      caution: { title: "VIGILANCE · zone intermédiaire", note: "L’état intermédiaire demande de suivre la légende, de stabiliser le fonctionnement et de contrôler le système." },
      wet: { title: "HUMIDE · action à planifier", note: "Sur l’exemple SG/SGP, un jaune persistant demande d’éliminer l’humidité et de remplacer le déshydrateur au plus vite selon la procédure ; ajouter du fluide ne corrige pas ce défaut." }
    };
    setControls(Object.entries(states).map(([key, item]) => `<button type="button" class="choice-button" data-reading="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      markActive("[data-reading]", ui.controls.querySelector(`[data-reading="${key}"]`));
      const item = states[key];
      ui.root.innerHTML = `${sightGlassSvg({ indicator: true, flow: "clear", moisture: key })}<div class="reading-rule"><strong>${item.title}</strong><p>${item.note}</p><small>Fluide + température + légende + temps de stabilisation</small></div><div class="readout" id="visual-readout">La couleur devient une information seulement avec son mot et sa référence.</div>`;
      announce(`${item.title}. ${item.note}`);
    };
    ui.controls.querySelectorAll("[data-reading]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.reading)));
    activate("dry");
  }

  function renderWithoutIndicator() {
    setControls(`<button type="button" class="choice-button" data-simple="flow">Il y a des bulles</button><button type="button" class="choice-button" data-simple="dry">Le circuit est sec</button><button type="button" class="choice-button" data-simple="ppm">L’humidité est mesurée</button>`);
    ui.root.innerHTML = `${sightGlassSvg({ indicator: false, flow: "bubbles" })}<div class="readout" id="visual-readout">Que peux-tu affirmer avec ce voyant simple ?</div>`;
    ui.controls.querySelectorAll("[data-simple]").forEach((button) => button.addEventListener("click", () => {
      ui.controls.querySelectorAll("[data-simple]").forEach((item) => item.classList.remove("correct", "wrong"));
      const correct = button.dataset.simple === "flow";
      button.classList.add(correct ? "correct" : "wrong");
      setReadout(correct ? "<strong>Correct :</strong> des bulles sont visibles dans la fenêtre." : "<strong>Impossible :</strong> sans pastille, ce voyant ne classe pas l’humidité.");
    }));
  }

  function renderDiagnosis() {
    const cases = {
      stable: { title: "Fenêtre claire · régime stable", checks: ["Identifier le régime", "Contrôler le sous-refroidissement", "Comparer aux données attendues"], result: "Indice compatible avec du liquide continu ; aucune validation globale de charge." },
      bubbles: { title: "Bulles persistantes", checks: ["Mesurer le sous-refroidissement", "Contrôler pressions et températures", "Rechercher chute de pression ou restriction"], result: "Plusieurs causes restent ouvertes ; ne pas charger sur ce seul signe." },
      wet: { title: "Pastille en zone humide", checks: ["Lire la légende du modèle", "Vérifier fluide, température et stabilité", "Planifier le diagnostic d’humidité"], result: "Traiter la contamination selon la procédure ; ne pas confondre avec la charge." }
    };
    setControls(Object.entries(cases).map(([key, item]) => `<button type="button" class="choice-button" data-case="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      markActive("[data-case]", ui.controls.querySelector(`[data-case="${key}"]`));
      const item = cases[key];
      const sight = key === "wet" ? sightGlassSvg({ indicator: true, flow: "clear", moisture: "wet" }) : sightGlassSvg({ indicator: false, flow: key === "bubbles" ? "bubbles" : "clear" });
      ui.root.innerHTML = `<div class="diagnosis-layout">${sight}<ol class="diagnosis-steps">${item.checks.map((check) => `<li>${check}</li>`).join("")}</ol></div><div class="readout" id="visual-readout"><strong>Conclusion :</strong> ${item.result}</div>`;
      announce(`${item.title}. ${item.checks.join(". ")}. Conclusion : ${item.result}`);
    };
    ui.controls.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.case)));
    activate("stable");
  }

  function renderInstallation() {
    const phases = {
      prepare: { title: "1 · PRÉPARER", items: ["Identifier le fluide et le modèle", "Choisir la méthode adaptée au raccord", "Sur ce montage, placer horizontal et fenêtre accessible"] },
      braze: { title: "2 · BRASER SELON LA NOTICE", items: ["SGP/SG : azote sec + protection humide", "Brasure : au moins 5 % d’argent", "Corps protégé ; flamme loin du voyant"] },
      verify: { title: "3 · VÉRIFIER", items: ["Contrôler l’étanchéité selon la procédure", "Vérifier la propreté de la fenêtre", "Confirmer le sens et la lecture en service"] }
    };
    setControls(Object.entries(phases).map(([key, phase]) => `<button type="button" class="choice-button" data-phase="${key}">${phase.title}</button>`).join(""));
    const activate = (key) => {
      markActive("[data-phase]", ui.controls.querySelector(`[data-phase="${key}"]`));
      const phase = phases[key];
      const visual = key === "prepare"
        ? `<img class="technical-illustration connection-reference" src="assets/illustrations/raccords-voyant.svg?v=20260804-9" alt="Comparaison entre un voyant avec raccords à braser et un voyant générique avec raccords filetés ou flare">`
        : sightGlassSvg({ indicator: true, flow: "stopped", moisture: "dry" });
      ui.root.innerHTML = `<div class="installation-scene">${visual}<section class="installation-card"><h3>${phase.title}</h3><ul>${phase.items.map((item) => `<li>${item}</li>`).join("")}</ul></section></div><div class="readout" id="visual-readout">La notice du fabricant reste la règle de montage.</div>`;
      announce(`${phase.title}. ${phase.items.join(". ")}`);
    };
    ui.controls.querySelectorAll("[data-phase]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.phase)));
    activate("prepare");
  }

  function renderSafety() {
    const decisions = {
      observe: { title: "OBSERVER", text: "Identifier la variante, le régime, les bulles et la légende sans démonter l’organe.", style: "key" },
      secure: { title: "METTRE EN SÉCURITÉ", text: "Avant toute ouverture : zéro pression. Pastille SG/SGP endommagée : éviter contact et poussière ; papier au dichlorure de cobalt = déchet dangereux.", style: "warning" },
      restore: { title: "REMETTRE EN SERVICE", text: "Traiter l’humidité, le filtre, l’étanchéité, le vide et la charge avec les méthodes validées.", style: "" }
    };
    setControls(Object.entries(decisions).map(([key, item]) => `<button type="button" class="choice-button" data-decision="${key}">${item.title}</button>`).join(""));
    const activate = (key) => {
      markActive("[data-decision]", ui.controls.querySelector(`[data-decision="${key}"]`));
      const item = decisions[key];
      ui.root.innerHTML = `<div class="safety-grid"><article class="mini-card key"><strong>1 · OBSERVER</strong><small>Sans ouvrir le circuit</small></article><article class="mini-card warning"><strong>2 · SÉCURISER</strong><small>Avant toute intervention</small></article><article class="mini-card"><strong>3 · CONTRÔLER</strong><small>Avant remise en service</small></article></div><div class="decision-card ${item.style}"><strong>${item.title}</strong><p>${item.text}</p></div><div class="readout" id="visual-readout">${item.text}</div>`;
      announce(`${item.title}. ${item.text}`);
    };
    ui.controls.querySelectorAll("[data-decision]").forEach((button) => button.addEventListener("click", () => activate(button.dataset.decision)));
    activate("observe");
  }

  function renderQuiz() {
    if (quiz.complete) {
      setControls(`<button type="button" class="action-button primary" id="restart-quiz">Refaire le défi</button>`);
      const success = quiz.score >= 5;
      ui.root.innerHTML = `<div class="quiz-result"><span class="quiz-score">${quiz.score}/6</span><strong>${success ? "Objectif atteint" : "Encore un passage utile"}</strong><p>${success ? "Tu distingues les deux voyants et tu sais limiter tes conclusions." : "Relis les corrections puis recommence."}</p></div>`;
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
  }

  function restoreAnsweredQuiz(question) {
    ui.root.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
    });
    document.getElementById("quiz-feedback").innerHTML = `<strong>Réponse enregistrée.</strong> ${question.why}`;
    const next = document.getElementById("next-question");
    if (next) next.addEventListener("click", nextQuizQuestion);
  }

  function nextQuizQuestion() {
    if (quiz.index >= quizQuestions.length - 1) quiz.complete = true;
    else { quiz.index += 1; quiz.answered = false; }
    renderQuiz();
  }

  function resetQuiz() {
    quiz.index = 0;
    quiz.score = 0;
    quiz.answered = false;
    quiz.complete = false;
    renderQuiz();
    updateNavigation();
  }

  function renderLesson(index, focusTitle = false) {
    stopSpeech();
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
    if (focusTitle) ui.title.focus?.({ preventScroll: true });
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
    catch (_) { /* fonctionnement sans stockage */ }
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
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
  window.addEventListener("pagehide", stopSpeech);
  if (window.speechSynthesis) {
    chooseVoice();
    window.speechSynthesis.addEventListener?.("voiceschanged", chooseVoice);
  } else {
    ui.voiceButton.disabled = true;
  }

  buildStepper();
  renderLesson(0);
})();
