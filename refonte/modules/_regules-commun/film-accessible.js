(function () {
  "use strict";

  var labels = {
    "Play/pause (space)": "Lecture ou pause",
    "Return to start (0)": "Revenir au début",
    "Export video": "Télécharger la vidéo"
  };

  function boutonVoix() {
    return Array.from(document.querySelectorAll("button")).find(function (button) {
      return /Écouter les explications|Couper la voix/.test(button.textContent || "");
    });
  }

  function ameliorer() {
    var buttons = Array.from(document.querySelectorAll("button"));
    buttons.forEach(function (button) {
      button.type = "button";
      if (labels[button.title]) {
        button.title = labels[button.title];
        button.setAttribute("aria-label", button.title);
      }
    });

    var replay = buttons.find(function (button) { return /Rejouer/.test(button.textContent || ""); });
    if (replay && replay.parentElement) {
      var barre = replay.parentElement;
      barre.classList.add("inerweb-film-controls");
      barre.setAttribute("role", "toolbar");
      barre.setAttribute("aria-label", "Commandes du film");
      replay.setAttribute("aria-label", "Rejouer le film depuis le début");
      var lecture = barre.querySelectorAll("button")[1];
      if (lecture) {
        lecture.setAttribute("aria-label", /⏸/.test(lecture.textContent || "") ? "Mettre le film en pause" : "Lire le film");
      }
      var piste = barre.querySelector("div");
      if (piste) {
        piste.setAttribute("role", "progressbar");
        piste.setAttribute("aria-label", "Progression du film");
      }
    }

    var voice = boutonVoix();
    if (voice) { voice.setAttribute("aria-label", voice.textContent.trim()); }
  }

  function arreter() {
    var voice = boutonVoix();
    if (voice && /Couper la voix/.test(voice.textContent || "")) { voice.click(); }
    if (window.__filmCtl && window.__filmCtl.pause) { window.__filmCtl.pause(); }
  }

  function classerContexte() {
    var largeParent = false;
    try { largeParent = window.self !== window.top && window.parent.innerWidth > 620; } catch (err) {}
    document.documentElement.classList.toggle("inerweb-film-parent-large", largeParent);
  }

  var note = document.createElement("p");
  note.className = "inerweb-film-orientation";
  note.setAttribute("role", "note");
  note.textContent = "Film technique au format 16:9 : passez le téléphone en paysage pour lire confortablement tous les repères.";
  document.body.appendChild(note);
  classerContexte();

  new MutationObserver(ameliorer).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", classerContexte);
  document.addEventListener("visibilitychange", function () { if (document.hidden) { arreter(); } });
  window.addEventListener("pagehide", arreter);
  ameliorer();
})();
