(function initialiseRotalockModule() {
  "use strict";

  const diagrams = window.VanneRotalock;
  if (!diagrams) {
    document.getElementById("visual-root").textContent = "Le schéma n’a pas pu être chargé.";
    return;
  }

  const elements = {
    kicker: document.getElementById("lesson-kicker"),
    title: document.getElementById("lesson-title"),
    intro: document.getElementById("lesson-intro"),
    detail: document.getElementById("lesson-detail"),
    visualTitle: document.getElementById("visual-title"),
    visualHint: document.getElementById("visual-hint"),
    controls: document.getElementById("visual-controls"),
    root: document.getElementById("visual-root"),
    caption: document.getElementById("visual-caption"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    stepButtons: Array.from(document.querySelectorAll(".step-button"))
  };

  const state = {
    current: 0,
    furthest: 0,
    position: "back",
    circuit: "bp",
    playing: false,
    playToken: 0,
    games: createFreshGamesState()
  };

  const POSITION_ORDER = ["front", "mid", "back"];

  const POSITION_INFO = {
    front: {
      title: "Fermée sur l’avant",
      passage: "T est isolée de C.",
      service: "P et P1 restent reliées à C.",
      action: "Sens horaire : on visse la tige vers l’avant."
    },
    mid: {
      title: "Position intermédiaire",
      passage: "T communique avec C.",
      service: "P et P1 communiquent aussi avec C.",
      action: "Le pointeau ne touche aucun des deux sièges."
    },
    back: {
      title: "Fermée sur l’arrière",
      passage: "T communique avec C.",
      service: "P est isolée ; P1 reste reliée à C.",
      action: "Sens antihoraire : on dévisse la tige vers l’arrière."
    }
  };

  const LOCATE_QUESTIONS = [
    {
      target: "square",
      prompt: "Clique sur l’élément que la clé doit faire tourner.",
      answer: "Le carré de manœuvre",
      explanation: "Le carré, la tige et le pointeau forment un seul ensemble mobile."
    },
    {
      target: "gland",
      prompt: "Clique sur la pièce fixe qui assure l’étanchéité autour de la tige.",
      answer: "Le presse-étoupe",
      explanation: "Le presse-étoupe reste fixe pendant que la tige tourne et se déplace."
    },
    {
      target: "p",
      prompt: "Clique sur le raccord prévu pour le flexible du manifold.",
      answer: "P, la voie de service",
      explanation: "P est la prise la plus proche du carré de manœuvre."
    },
    {
      target: "p1",
      prompt: "Clique sur la prise permanente du pressostat.",
      answer: "P1, à l’opposé du carré",
      explanation: "P1 reste reliée à C. Son bouchon ne se défait jamais sur une installation chargée."
    }
  ];

  const SITUATION_QUESTIONS = [
    {
      prompt: "Où branches-tu temporairement le flexible du manifold ?",
      choices: [["p", "Sur P, près du carré"], ["p1", "Sur P1, à l’opposé"]],
      answer: "p",
      explanation: "Le flexible du manifold se branche sur P, la voie de service."
    },
    {
      prompt: "Quelle est la position de lecture, avec T, C, P et P1 en communication ?",
      choices: [["front", "Fermée sur l’avant"], ["mid", "Position intermédiaire"], ["back", "Fermée sur l’arrière"]],
      answer: "mid",
      explanation: "En position intermédiaire, le pointeau ne touche aucun siège : T, C, P et P1 communiquent."
    },
    {
      prompt: "Quelle position isole la voie de service P tout en laissant T communiquer avec C ?",
      choices: [["front", "Fermée sur l’avant"], ["mid", "Position intermédiaire"], ["back", "Fermée sur l’arrière"]],
      answer: "back",
      explanation: "Fermée sur l’arrière, la vanne maintient T–C ouvert et isole P. P1 reste reliée à C."
    },
    {
      prompt: "Quelle position isole la tuyauterie T du compresseur C ?",
      choices: [["front", "Fermée sur l’avant"], ["mid", "Position intermédiaire"], ["back", "Fermée sur l’arrière"]],
      answer: "front",
      explanation: "Fermée sur l’avant, le pointeau obture le passage entre T et C."
    },
    {
      prompt: "Installation chargée : peux-tu défaire le bouchon P1 sans risque ?",
      choices: [["yes", "Oui"], ["no", "Non"]],
      answer: "no",
      explanation: "Non. P1 peut rester sous pression dans toutes les positions. Ne jamais défaire ce bouchon sur une installation chargée."
    }
  ];

  function createFreshGamesState() {
    return {
      active: "locate",
      locate: { index: 0, score: 0, answered: false, done: false, selected: "", correct: false },
      situation: { index: 0, score: 0, answered: false, done: false, selected: "", correct: false }
    };
  }

  const LESSONS = [
    {
      kicker: "Écran 1 · Les trois positions",
      title: "Tourner la clé et suivre les passages",
      intro: "Le dessin reprend exactement la coupe validée. La clé, le carré, la tige et le pointeau se déplacent ensemble.",
      visualTitle: "Les trois positions de la vanne",
      hint: "Choisis une position ou clique sur la clé à cliquet.",
      render: renderPositions
    },
    {
      kicker: "Écran 2 · BP et HP",
      title: "Même vanne, sens de circulation opposé",
      intro: "La géométrie ne change pas. Seuls le côté du circuit et le sens du fluide changent.",
      visualTitle: "Comparer BP et HP",
      hint: "Passe de BP à HP pour inverser les flèches.",
      render: renderFlow
    },
    {
      kicker: "Écran 3 · Geste et sécurité",
      title: "Choisir le bon raccord avant d’intervenir",
      intro: "Repère d’abord le carré de manœuvre : il donne immédiatement la position de P et de P1.",
      visualTitle: "Clé, raccords et presse-étoupe",
      hint: "Utilise les deux sens de rotation.",
      render: renderSafety
    },
    {
      kicker: "Écran 4 · Mini-jeux",
      title: "À toi de manœuvrer et de décider",
      intro: "Deux entraînements courts : repérer les éléments, puis choisir le geste adapté à une situation terrain.",
      visualTitle: "Jeu 1 · Repérage sur la vanne",
      hint: "Une question à la fois. La correction est immédiate.",
      render: renderGames
    }
  ];

  function positionDetailMarkup(position) {
    const info = POSITION_INFO[position];
    return `
      <div class="state-summary" aria-label="État des passages">
        <div class="state-row"><strong>${info.title}</strong><small>${info.action}</small></div>
        <div class="state-row open"><strong>PASSAGE PRINCIPAL</strong><small>${info.passage}</small></div>
        <div class="state-row permanent"><strong>PRISES P ET P1</strong><small>${info.service}</small></div>
      </div>
      <div class="key-box"><strong>À observer :</strong> la tige orange garde toujours la même longueur. Le presse-étoupe reste fixe.</div>`;
  }

  function positionControlsMarkup(includeSequence) {
    return `
      <div class="control-group" role="group" aria-label="Position de la vanne">
        <span class="control-group-label">Position</span>
        <button type="button" class="control-button position-button" data-position="front">Avant</button>
        <button type="button" class="control-button position-button" data-position="mid"><span class="long-label">Intermédiaire</span><span class="short-label">Milieu</span></button>
        <button type="button" class="control-button position-button" data-position="back">Arrière</button>
      </div>
      <input class="position-range" id="position-range" type="range" min="0" max="2" step="1" value="${POSITION_ORDER.indexOf(state.position)}" aria-label="Déplacement de l’ensemble mobile" aria-valuetext="${POSITION_INFO[state.position].title}">
      ${includeSequence ? '<button type="button" class="sequence-button" id="sequence-button">▶ Tourner la clé : voir les 3 positions</button>' : ""}`;
  }

  function renderPositions() {
    elements.detail.innerHTML = positionDetailMarkup(state.position);
    elements.controls.innerHTML = positionControlsMarkup(true);
    elements.root.innerHTML = diagrams.createValveSvg({
      position: state.position,
      circuit: "bp",
      showKey: true,
      idPrefix: "validated-positions",
      title: POSITION_INFO[state.position].title
    });
    wirePositionControls("positions");
    wireKeyControl();
    updatePositionUi("positions");
  }

  function flowDetailMarkup() {
    const bpActive = state.circuit === "bp" ? " active-flow" : "";
    const hpActive = state.circuit === "hp" ? " active-flow" : "";
    return `
      <div class="state-summary flow-summary" aria-label="Comparaison BP et HP">
        <div class="state-row open${bpActive}"><strong>BP · ASPIRATION</strong><small>Trait bleu plein : T → C. Le fluide entre par la tuyauterie et rejoint le compresseur.</small></div>
        <div class="state-row closed${hpActive}"><strong>HP · REFOULEMENT</strong><small>Trait rouge tireté : C → T. Le fluide sort du compresseur et rejoint la tuyauterie.</small></div>
      </div>
      <div class="key-box"><strong>La différence à retenir :</strong> BP aspire vers C ; HP refoule depuis C.</div>`;
  }

  function flowControlsMarkup() {
    return `
      <div class="control-group flow-control-group" role="group" aria-label="Comparer la basse pression et la haute pression">
        <button type="button" class="control-button circuit-button circuit-bp" data-circuit="bp">BP · ASPIRATION · T → C · BLEU PLEIN</button>
        <button type="button" class="control-button circuit-button circuit-hp" data-circuit="hp">HP · REFOULEMENT · C → T · ROUGE TIRETÉ</button>
      </div>`;
  }

  function renderFlow() {
    state.position = "mid";
    elements.detail.innerHTML = flowDetailMarkup();
    elements.controls.innerHTML = flowControlsMarkup();
    elements.root.innerHTML = diagrams.createValveSvg({
      position: "mid",
      circuit: state.circuit,
      showKey: false,
      idPrefix: "validated-flow",
      title: state.circuit === "bp" ? "BP : T vers C" : "HP : C vers T"
    });
    wireCircuitControls();
    updateFlowUi();
  }

  function renderSafety() {
    state.position = "back";
    elements.detail.innerHTML = `
      <div class="state-summary">
        <div class="state-row open"><strong>P · PRÈS DU CARRÉ</strong><small>C’est la voie de service. Le flexible du manifold se branche ici.</small></div>
        <div class="state-row closed"><strong>P1 · À L’OPPOSÉ DU CARRÉ</strong><small>Cette prise reçoit le pressostat. Ne jamais défaire son bouchon sur une installation chargée.</small></div>
        <div class="state-row permanent"><strong>PRESSE-ÉTOUPE FIXE</strong><small>Il assure l’étanchéité autour de la tige pendant sa rotation et son déplacement.</small></div>
        <div class="state-row"><strong>SENS DE ROTATION</strong><small>↻ visser : vers l’avant, T–C fermé. ↺ dévisser : vers l’arrière, T–C ouvert et P isolée.</small></div>
      </div>`;
    elements.controls.innerHTML = `
      <div class="control-group rotation-controls" role="group" aria-label="Sens de rotation de la clé">
        <button type="button" class="control-button position-button" data-position="front">↻ VISSER · VERS L’AVANT</button>
        <button type="button" class="control-button position-button" data-position="back">↺ DÉVISSER · VERS L’ARRIÈRE</button>
      </div>`;
    elements.root.innerHTML = diagrams.createValveSvg({
      position: state.position,
      circuit: "bp",
      showKey: true,
      mode: "safety",
      idPrefix: "validated-safety",
      title: "Raccordements, presse-étoupe et clé à cliquet"
    });
    wirePositionControls("safety");
    updatePositionUi("safety");
  }

  function renderGames() {
    renderActiveGame();
  }

  function activeGameState() {
    return state.games[state.games.active];
  }

  function activeGameQuestions() {
    return state.games.active === "locate" ? LOCATE_QUESTIONS : SITUATION_QUESTIONS;
  }

  function gameTabsMarkup() {
    const locateDone = state.games.locate.done ? " · terminé" : "";
    const situationDone = state.games.situation.done ? " · terminé" : "";
    return `
      <div class="control-group quiz-tabs" role="group" aria-label="Choisir un mini-jeu">
        <button type="button" class="control-button game-tab${state.games.active === "locate" ? " active" : ""}" data-game="locate" aria-pressed="${state.games.active === "locate"}">1 · Repérage${locateDone}</button>
        <button type="button" class="control-button game-tab${state.games.active === "situation" ? " active" : ""}" data-game="situation" aria-pressed="${state.games.active === "situation"}">2 · Situations${situationDone}</button>
      </div>`;
  }

  function gameActionMarkup() {
    const game = activeGameState();
    if (game.done) {
      if (!state.games.locate.done || !state.games.situation.done) {
        const other = state.games.active === "locate" ? "situation" : "locate";
        return `<button type="button" class="control-button" data-game-action="restart">↺ Refaire ce jeu</button><button type="button" class="sequence-button" data-game-action="other" data-game-target="${other}">Passer à l’autre jeu →</button>`;
      }
      return `<button type="button" class="control-button" data-game-action="restart">↺ Refaire ce jeu</button><button type="button" class="sequence-button" data-game-action="restart-all">↺ Recommencer les deux jeux</button>`;
    }
    if (game.answered) {
      const last = game.index === activeGameQuestions().length - 1;
      return `<button type="button" class="sequence-button" data-game-action="next">${last ? "Voir le résultat" : "Question suivante →"}</button>`;
    }
    return "";
  }

  function gameDetailMarkup() {
    const game = activeGameState();
    const questions = activeGameQuestions();
    const gameName = state.games.active === "locate" ? "JEU 1 · REPÉRAGE" : "JEU 2 · SITUATIONS TERRAIN";

    if (game.done) {
      const bothDone = state.games.locate.done && state.games.situation.done;
      const total = state.games.locate.score + state.games.situation.score;
      const totalQuestions = LOCATE_QUESTIONS.length + SITUATION_QUESTIONS.length;
      return `
        <div class="quiz-scoreline"><strong>${gameName}</strong><span>${game.score}/${questions.length}</span></div>
        <div class="key-box quiz-feedback"><strong>✓ Jeu terminé.</strong> Tu peux le recommencer ou passer à l’autre jeu.</div>
        ${bothDone ? `<div class="neutral-box quiz-total"><strong>Bilan des deux jeux : ${total}/${totalQuestions}</strong><span>Ce résultat est un entraînement, pas un examen officiel.</span></div>` : ""}`;
    }

    const question = questions[game.index];
    let feedback = `<div class="neutral-box quiz-feedback"><strong>À toi :</strong> choisis une seule réponse.</div>`;
    if (game.answered) {
      const feedbackClass = game.correct ? "key-box" : "danger-box";
      const feedbackWord = game.correct ? "✓ CORRECT" : "✕ À REVOIR";
      const correctLabel = state.games.active === "locate"
        ? question.answer
        : question.choices.find(([value]) => value === question.answer)[1];
      feedback = `<div class="${feedbackClass} quiz-feedback"><strong>${feedbackWord} · ${correctLabel}</strong>${question.explanation}</div>`;
    }
    return `
      <div class="quiz-scoreline"><strong>${gameName}</strong><span>${game.score} point${game.score > 1 ? "s" : ""}</span></div>
      <div class="quiz-counter">Question ${game.index + 1} sur ${questions.length}</div>
      <div class="quiz-prompt"><strong>${question.prompt}</strong></div>
      ${feedback}`;
  }

  function updateGameChrome() {
    const game = activeGameState();
    elements.detail.innerHTML = gameDetailMarkup();
    elements.controls.innerHTML = `${gameTabsMarkup()}${gameActionMarkup()}`;
    elements.visualTitle.textContent = state.games.active === "locate" ? "Jeu 1 · Repérage sur la vanne" : "Jeu 2 · Décisions terrain";
    elements.visualHint.textContent = game.done ? "Jeu terminé : consulte ton résultat." : "Réponds, lis la correction, puis continue.";
    elements.caption.textContent = state.games.active === "locate"
      ? "Clique directement sur la coupe de la vanne."
      : "Une seule décision par situation.";
    wireGameNavigation();
  }

  function renderActiveGame() {
    const game = activeGameState();
    if (game.done) renderGameSummary();
    else if (state.games.active === "locate") renderLocateGame();
    else renderSituationGame();
    updateGameChrome();
  }

  function renderLocateGame() {
    const game = state.games.locate;
    const question = LOCATE_QUESTIONS[game.index];
    elements.root.innerHTML = diagrams.createValveSvg({
      position: "front",
      circuit: "bp",
      showKey: false,
      idPrefix: `quiz-locate-${game.index}`,
      title: "Vanne sans légendes : repérer les organes"
    });
    const svg = elements.root.querySelector(".vr-valve-svg");
    if (!svg) return;
    svg.classList.add("quiz-unlabelled");
    const hotspots = [
      ["p1", 995, 205, 130, 255, "Prise verticale à gauche"],
      ["p", 1285, 205, 130, 255, "Prise verticale à droite"],
      ["gland", 1425, 450, 86, 190, "Pièce fixe autour de la tige"],
      ["square", 1511, 476, 114, 138, "Carré extérieur de manœuvre"]
    ];
    svg.insertAdjacentHTML("beforeend", `
      <g class="quiz-hotspot-layer" aria-label="Zones cliquables de la vanne">
        ${hotspots.map(([id, x, y, width, height, label]) => {
          const correct = game.answered && id === question.target ? " is-correct" : "";
          const wrong = game.answered && id === game.selected && id !== question.target ? " is-wrong" : "";
          return `<rect class="quiz-hotspot${correct}${wrong}" data-quiz-target="${id}" x="${x}" y="${y}" width="${width}" height="${height}" rx="22" role="button" tabindex="0" aria-label="${label}" aria-disabled="${game.answered}" />`;
        }).join("")}
      </g>`);
    wireLocateTargets();
  }

  function wireLocateTargets() {
    elements.root.querySelectorAll("[data-quiz-target]").forEach((target) => {
      const choose = () => answerLocateQuestion(target.dataset.quizTarget);
      target.addEventListener("click", choose);
      target.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose();
        }
      });
    });
  }

  function answerLocateQuestion(choice) {
    const game = state.games.locate;
    if (game.answered || game.done) return;
    const question = LOCATE_QUESTIONS[game.index];
    game.answered = true;
    game.selected = choice;
    game.correct = choice === question.target;
    if (game.correct) game.score += 1;
    elements.root.querySelectorAll("[data-quiz-target]").forEach((target) => {
      target.setAttribute("aria-disabled", "true");
      target.classList.toggle("is-correct", target.dataset.quizTarget === question.target);
      target.classList.toggle("is-wrong", target.dataset.quizTarget === choice && !game.correct);
    });
    updateGameChrome();
  }

  function renderSituationGame() {
    const game = state.games.situation;
    const question = SITUATION_QUESTIONS[game.index];
    elements.root.innerHTML = `
      <div class="scenario-stage" role="group" aria-label="Réponses proposées">
        <div class="scenario-mark" aria-hidden="true">?</div>
        <div class="scenario-choice-grid">
          ${question.choices.map(([value, label]) => {
            const correct = game.answered && value === question.answer ? " is-correct" : "";
            const wrong = game.answered && value === game.selected && value !== question.answer ? " is-wrong" : "";
            const result = correct ? '<span>✓ CORRECT</span>' : wrong ? '<span>✕ À REVOIR</span>' : "";
            return `<button type="button" class="scenario-choice${correct}${wrong}" data-situation-choice="${value}" ${game.answered ? "disabled" : ""}><strong>${label}</strong>${result}</button>`;
          }).join("")}
        </div>
      </div>`;
    elements.root.querySelectorAll("[data-situation-choice]").forEach((button) => {
      button.addEventListener("click", () => answerSituationQuestion(button.dataset.situationChoice));
    });
  }

  function answerSituationQuestion(choice) {
    const game = state.games.situation;
    if (game.answered || game.done) return;
    const question = SITUATION_QUESTIONS[game.index];
    game.answered = true;
    game.selected = choice;
    game.correct = choice === question.answer;
    if (game.correct) game.score += 1;
    renderSituationGame();
    updateGameChrome();
  }

  function renderGameSummary() {
    const game = activeGameState();
    const questions = activeGameQuestions();
    const bothDone = state.games.locate.done && state.games.situation.done;
    const total = state.games.locate.score + state.games.situation.score;
    const totalQuestions = LOCATE_QUESTIONS.length + SITUATION_QUESTIONS.length;
    elements.root.innerHTML = `
      <div class="game-summary" role="status">
        <span class="game-summary-check" aria-hidden="true">✓</span>
        <strong>${state.games.active === "locate" ? "Repérage terminé" : "Situations terminées"}</strong>
        <span class="game-summary-score">${game.score}/${questions.length}</span>
        <small>${bothDone ? `Bilan général : ${total}/${totalQuestions}` : "Passe à l’autre jeu quand tu es prêt."}</small>
      </div>`;
  }

  function advanceGame() {
    const game = activeGameState();
    const questions = activeGameQuestions();
    if (!game.answered || game.done) return;
    if (game.index >= questions.length - 1) {
      game.done = true;
    } else {
      game.index += 1;
      game.answered = false;
      game.selected = "";
      game.correct = false;
    }
    renderActiveGame();
  }

  function restartActiveGame() {
    state.games[state.games.active] = { index: 0, score: 0, answered: false, done: false, selected: "", correct: false };
    renderActiveGame();
  }

  function restartAllGames() {
    state.games = createFreshGamesState();
    renderActiveGame();
  }

  function wireGameNavigation() {
    elements.controls.querySelectorAll("[data-game]").forEach((button) => {
      button.addEventListener("click", () => {
        state.games.active = button.dataset.game === "situation" ? "situation" : "locate";
        renderActiveGame();
      });
    });
    elements.controls.querySelectorAll("[data-game-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.gameAction;
        if (action === "next") advanceGame();
        if (action === "other") {
          state.games.active = button.dataset.gameTarget === "situation" ? "situation" : "locate";
          renderActiveGame();
        }
        if (action === "restart") restartActiveGame();
        if (action === "restart-all") restartAllGames();
      });
    });
  }

  function wirePositionControls(context) {
    elements.controls.querySelectorAll(".position-button").forEach((button) => {
      button.addEventListener("click", () => {
        stopSequence();
        setPosition(button.dataset.position, context);
      });
    });
    const range = document.getElementById("position-range");
    if (range) {
      range.addEventListener("input", () => {
        stopSequence();
        setPosition(POSITION_ORDER[Number(range.value)], context);
      });
    }
    const sequence = document.getElementById("sequence-button");
    if (sequence) sequence.addEventListener("click", toggleSequence);
  }

  function wireCircuitControls() {
    elements.controls.querySelectorAll(".circuit-button").forEach((button) => {
      button.addEventListener("click", () => {
        state.circuit = button.dataset.circuit === "hp" ? "hp" : "bp";
        const svg = elements.root.querySelector(".vr-valve-svg");
        if (svg) svg.dataset.circuit = state.circuit;
        updateFlowUi();
      });
    });
  }

  function wireKeyControl() {
    const key = elements.root.querySelector("[data-key-control]");
    if (!key) return;
    key.addEventListener("click", toggleSequence);
    key.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSequence();
      }
    });
  }

  function setPosition(position, context) {
    if (!POSITION_INFO[position]) return;
    state.position = position;
    const svg = elements.root.querySelector(".vr-valve-svg");
    if (svg) {
      svg.dataset.position = position;
      svg.setAttribute("aria-label", POSITION_INFO[position].title);
    }
    updatePositionUi(context);
  }

  function updatePositionUi(context) {
    elements.controls.querySelectorAll(".position-button").forEach((button) => {
      const active = button.dataset.position === state.position;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const range = document.getElementById("position-range");
    if (range) {
      range.value = String(POSITION_ORDER.indexOf(state.position));
      range.setAttribute("aria-valuetext", POSITION_INFO[state.position].title);
    }
    if (context === "positions") {
      elements.detail.innerHTML = positionDetailMarkup(state.position);
      elements.caption.textContent = `${POSITION_INFO[state.position].title} · ${POSITION_INFO[state.position].passage} ${POSITION_INFO[state.position].service}`;
    } else {
      elements.caption.textContent = `${POSITION_INFO[state.position].title} · ${POSITION_INFO[state.position].action}`;
    }
  }

  function updateFlowUi() {
    elements.controls.querySelectorAll(".circuit-button").forEach((button) => {
      const active = button.dataset.circuit === state.circuit;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    elements.detail.innerHTML = flowDetailMarkup();
    elements.caption.textContent = state.circuit === "bp"
      ? "BP · aspiration · trait bleu plein · T → C."
      : "HP · refoulement · trait rouge tireté · C → T.";
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function toggleSequence() {
    if (state.playing) {
      stopSequence();
      return;
    }
    state.playing = true;
    const token = ++state.playToken;
    updateSequenceButton();
    for (const position of ["front", "mid", "back"]) {
      if (token !== state.playToken || !state.playing) break;
      setPosition(position, "positions");
      await wait(position === "mid" ? 2200 : 2400);
    }
    if (token === state.playToken) {
      state.playing = false;
      updateSequenceButton();
    }
  }

  function stopSequence() {
    state.playToken += 1;
    state.playing = false;
    updateSequenceButton();
  }

  function updateSequenceButton() {
    const button = document.getElementById("sequence-button");
    if (!button) return;
    button.classList.toggle("playing", state.playing);
    button.textContent = state.playing ? "■ Arrêter la séquence" : "▶ Tourner la clé : voir les 3 positions";
    button.setAttribute("aria-pressed", String(state.playing));
  }

  function renderStep(index, moveFocus) {
    stopSequence();
    state.current = Math.max(0, Math.min(LESSONS.length - 1, index));
    state.furthest = Math.max(state.furthest, state.current);
    document.body.classList.toggle("screen-safety", state.current === 2);
    document.body.classList.toggle("screen-games", state.current === 3);
    const lesson = LESSONS[state.current];

    elements.kicker.textContent = lesson.kicker;
    elements.title.textContent = lesson.title;
    elements.intro.textContent = lesson.intro;
    elements.visualTitle.textContent = lesson.visualTitle;
    elements.visualHint.textContent = lesson.hint;
    elements.detail.innerHTML = "";
    elements.controls.innerHTML = "";
    elements.root.innerHTML = "";
    elements.caption.textContent = "";
    lesson.render();

    elements.stepButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === state.current;
      button.classList.toggle("active", active);
      button.classList.toggle("done", buttonIndex < state.current || buttonIndex < state.furthest);
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    elements.previous.disabled = state.current === 0;
    elements.next.textContent = state.current === LESSONS.length - 1 ? "Recommencer les jeux ↺" : "Continuer →";
    elements.progressLabel.textContent = `Écran ${state.current + 1} sur ${LESSONS.length}`;
    elements.progressBar.style.width = `${((state.current + 1) / LESSONS.length) * 100}%`;

    if (moveFocus) {
      elements.title.setAttribute("tabindex", "-1");
      elements.title.focus({ preventScroll: true });
    }
  }

  elements.previous.addEventListener("click", () => renderStep(state.current - 1, true));
  elements.next.addEventListener("click", () => {
    if (state.current === LESSONS.length - 1) {
      restartAllGames();
      elements.title.focus({ preventScroll: true });
      return;
    }
    renderStep(state.current + 1, true);
  });
  elements.stepButtons.forEach((button) => button.addEventListener("click", () => renderStep(Number(button.dataset.step), true)));

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("button, a, input, select, textarea, [role='button']")) return;
    if (event.key === "ArrowRight" && state.current < LESSONS.length - 1) renderStep(state.current + 1, true);
    if (event.key === "ArrowLeft" && state.current > 0) renderStep(state.current - 1, true);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSequence();
  });

  renderStep(0, false);
})();
