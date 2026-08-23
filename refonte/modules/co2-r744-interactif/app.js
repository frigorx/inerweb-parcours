(function () {
  "use strict";

  var stations = [
    { short: "R744", tag: "IDENTITÉ", x: 8, y: 27, title: "Pourquoi le R744 ?", url: "../co2-pourquoi-r744/index.html", summary: "Relier la molécule CO₂, le nom R744 et les usages du fluide, sans effacer les choix de conception qu’il impose.", topics: ["CO₂ = R744", "PRP de référence : 1", "atouts confrontés aux contraintes"] },
    { short: "États", tag: "MATIÈRE", x: 30, y: 27, title: "Point triple, point critique", url: "../co2-etats-physiques/index.html", summary: "Voir le CO₂ changer d’état et comprendre les deux frontières qui commandent toute l’architecture frigorifique.", topics: ["point triple", "glace carbonique", "point critique"] },
    { short: "Sécurité", tag: "BARRIÈRES", x: 52, y: 27, title: "Pressions et sécurité à l’arrêt", url: "../co2-pressions-securite/index.html", summary: "Suivre la montée en pression d’un volume isolé et lire une chaîne de protection complète, de l’équipement jusqu’au local.", topics: ["pression d’arrêt", "liquide piégé", "détection, alarme, évacuation"] },
    { short: "Diagramme", tag: "LOG P–H", x: 74, y: 27, title: "Diagramme et cycle subcritique", url: "../co2-cycle-subcritique/index.html", summary: "Réutiliser la méthode du diagramme enthalpique V7 : axes, cloche, zones, puis inscrire un cycle sous le point critique.", topics: ["axes pression–enthalpie", "cloche et zones", "cycle avec condensation"] },
    { short: "Transcritique", tag: "FRONTIÈRE", x: 90, y: 52, title: "Le cycle transcritique", url: "../co2-cycle-transcritique/index.html", summary: "Franchir le point critique et découvrir pourquoi le condenseur devient refroidisseur de gaz.", topics: ["rejet sans condensation", "pression et température indépendantes", "haute pression optimale"] },
    { short: "Flash & HP", tag: "RÉGULATION", x: 75, y: 78, title: "Flash et régulation HP", url: "../co2-flash-regulation-hp/index.html", summary: "Suivre la vanne HP, la séparation vapeur–liquide et les deux boucles qui stabilisent la centrale.", topics: ["vanne haute pression", "réservoir flash", "gaz flash et pression intermédiaire"] },
    { short: "Diagnostic", tag: "MESURES", x: 53, y: 78, title: "Mesures et diagnostic CO₂", url: "../co2-mesures-diagnostic/index.html", summary: "Partir de mesures situées, croiser les indices et choisir le contrôle qui départage réellement les hypothèses.", topics: ["état de marche documenté", "indices croisés", "prochain contrôle discriminant"] },
    { short: "Booster", tag: "SYSTÈME", x: 31, y: 78, title: "Lire une installation réelle", url: "../co2-architecture-reelle/index.html", summary: "Lire une architecture booster comme un système : niveaux de pression, organes, sens des flux et barrières de sécurité.", topics: ["P&ID et repères", "architecture booster", "passerelle vers la catégorie B"] }
  ];

  var current = 0;
  var grid = document.getElementById("station-grid");
  var position = document.getElementById("station-position");
  var title = document.getElementById("station-title");
  var summary = document.getElementById("station-summary");
  var topics = document.getElementById("station-topics");
  var open = document.getElementById("station-open");
  var previous = document.getElementById("previous-station");
  var next = document.getElementById("next-station");
  var status = document.getElementById("line-status");
  var live = document.getElementById("live-status");
  var printStations = document.getElementById("print-stations");
  var detailNumber = document.getElementById("detail-number");
  var detailTag = document.getElementById("detail-tag");

  function esc(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  }

  function renderMap() {
    grid.innerHTML = stations.map(function (station, index) {
      return '<button class="metro-station" style="--x:' + station.x + '%;--y:' + station.y + '%" type="button" data-station="' + index + '" aria-label="Gare ' + (index + 1) + " sur " + stations.length + " : " + esc(station.title) + '"><span class="station-dot">' + String(index + 1).padStart(2, "0") + '</span><span class="station-label">' + esc(station.short) + '</span><span class="station-tag">' + esc(station.tag) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(grid.querySelectorAll("[data-station]"), function (button) {
      button.addEventListener("click", function () { selectStation(Number(button.dataset.station), false, true); });
      button.addEventListener("keydown", function (event) {
        var index = Number(button.dataset.station);
        var target = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") target = Math.min(stations.length - 1, index + 1);
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = Math.max(0, index - 1);
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = stations.length - 1;
        if (target === null) return;
        event.preventDefault();
        selectStation(target, true, true);
      });
    });
  }

  function selectStation(index, focusButton, announce) {
    current = Math.max(0, Math.min(stations.length - 1, index));
    var station = stations[current];
    Array.prototype.forEach.call(grid.querySelectorAll("[data-station]"), function (button) {
      var active = Number(button.dataset.station) === current;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    position.textContent = "GARE " + (current + 1) + " SUR " + stations.length;
    title.textContent = station.title;
    detailNumber.textContent = String(current + 1).padStart(2, "0");
    detailTag.textContent = station.tag;
    summary.textContent = station.summary;
    topics.innerHTML = station.topics.map(function (topic) { return "<li>" + esc(topic) + "</li>"; }).join("");
    open.href = station.url;
    open.setAttribute("aria-label", "Entrer dans la gare " + (current + 1) + " : " + station.title);
    previous.disabled = current === 0;
    next.disabled = current === stations.length - 1;
    status.textContent = "Gare " + (current + 1) + " sur " + stations.length + " · " + station.short;
    if (announce) live.textContent = "Gare " + (current + 1) + " sélectionnée : " + station.title;
    if (focusButton) grid.querySelector('[data-station="' + current + '"]').focus();
  }

  previous.addEventListener("click", function () { selectStation(current - 1, true, true); });
  next.addEventListener("click", function () { selectStation(current + 1, true, true); });
  renderMap();
  document.getElementById("station-count").textContent = stations.length;
  printStations.innerHTML = stations.map(function (station) { return "<li><strong>" + esc(station.title) + "</strong> — " + esc(station.summary) + "</li>"; }).join("");
  selectStation(0, false, false);
})();
