(function () {
  "use strict";
  var root = document.getElementById("explainer");
  var word = document.getElementById("state-word");
  var description = document.getElementById("svg-state-description");
  var live = document.getElementById("live-state");
  var states = {
    start: {
      word: "DÉMARRAGE · DÉLAI EN COURS",
      description: "Au démarrage, le faible différentiel lance le délai. La pression doit s’établir avant son terme.",
      command: "MARCHE TEMPORAIRE"
    },
    ok: {
      word: "PRESSION SUFFISANTE · MARCHE AUTORISÉE",
      description: "Le différentiel devient suffisant : T1–T2 s’ouvre, la résistance cesse de chauffer et le délai s’arrête.",
      command: "MARCHE AUTORISÉE"
    },
    fault: {
      word: "DÉFAUT PERSISTANT · ARRÊT DE SÉCURITÉ",
      description: "Le défaut dure au-delà du délai : le bilame ouvre L–M et la commande arrête le compresseur.",
      command: "ARRÊT DE SÉCURITÉ"
    }
  };

  function selectState(name, announce) {
    var state = states[name] || states.start;
    root.className = "explainer state-" + name;
    word.textContent = state.word;
    description.textContent = state.description;
    document.querySelector(".command-text").textContent = state.command;
    Array.prototype.forEach.call(document.querySelectorAll("[data-state]"), function (button) {
      button.setAttribute("aria-pressed", button.dataset.state === name ? "true" : "false");
    });
    if (announce) live.textContent = state.word + ". " + state.description;
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-state]"), function (button) {
    button.addEventListener("click", function () { selectState(button.dataset.state, true); });
  });
  selectState("start", false);
})();
