(function () {
  "use strict";

  var stations = [
    {
      short: "Familles",
      title: "Les familles d’huile",
      url: "../technologie-huiles-frigorifiques/index.html",
      summary: "Comprendre à quoi sert l’huile dans le compresseur, suivre la fraction entraînée dans le circuit et distinguer les six familles.",
      topics: ["rôles de l’huile", "MO, AB, PAO", "POE, PAG, PVE"]
    },
    {
      short: "Choisir",
      title: "Choisir et contrôler l’huile",
      url: "../technologie-huiles-choix-controle/index.html",
      summary: "Passer de la famille à la référence exacte, lire un grade ISO VG, et reconnaître ce que l’eau et l’acidité font à une huile.",
      topics: ["méthode de choix", "miscibilité et grade", "humidité et test acide"]
    },
    {
      short: "Retour",
      title: "Le retour d’huile naturel",
      url: "../retour-huile-naturel/index.html",
      summary: "Comprendre ce qui met l’huile en mouvement dans les lignes de vapeur : la vitesse du gaz, la pente et les siphons de remontée.",
      topics: ["vitesse d’entraînement", "pente et points bas", "siphon et contre-siphon"]
    },
    {
      short: "Vérifier",
      title: "Vérifier le retour d’huile",
      url: "../retour-huile-verifier/index.html",
      summary: "Éprouver le tracé aux régimes réels : calculer la vitesse du gaz, lire un plan d’aspiration et conclure sans se fier à une seule mesure.",
      topics: ["charge réduite et double colonne", "calcul de vitesse", "lecture de plan et diagnostic"]
    },
    {
      short: "Séparer",
      title: "La chaîne de l’huile : séparer et stocker",
      url: "../elements-circuit-huile/index.html",
      summary: "Replacer les deux premiers organes de la chaîne : ce qui sépare l’huile du gaz refoulé, et ce qui la garde en réserve.",
      topics: ["vue d’ensemble de la chaîne", "le séparateur", "le réservoir"]
    },
    {
      short: "Régler",
      title: "La chaîne de l’huile : mettre sous pression et régler",
      url: "../elements-circuit-huile-regler/index.html",
      summary: "Suivre la seconde moitié de la chaîne : la pression qui pousse l’huile, les régulateurs de niveau et ce qui prouve que le retour se fait.",
      topics: ["le clapet taré", "régulateur mécanique et électronique", "la chaîne de preuve"]
    },
    {
      short: "Séparateur",
      title: "Le séparateur d’huile",
      url: "../separateur-huile-pedagogique/index.html",
      summary: "Voir où il se place, comment il collecte l’huile entraînée et dans quelles conditions il la renvoie vers le compresseur ou le réservoir.",
      topics: ["implantation au refoulement", "flotteur et pointeau", "limites d’efficacité"]
    },
    {
      short: "Réservoir",
      title: "Le réservoir d’huile",
      url: "../reservoir-huile-pedagogique/index.html",
      summary: "Comprendre la réserve tampon : ce qu’elle absorbe, ce que ses voyants disent, et ce qu’il faut faire avant d’ouvrir quoi que ce soit.",
      topics: ["réserve et variations", "lecture des voyants", "sécurité avant démontage"]
    },
    {
      short: "Clapet",
      title: "Le clapet différentiel d’huile",
      url: "../clapet-differentiel-huile-pedagogique/index.html",
      summary: "Distinguer la branche de pression de la conduite d’huile, et comprendre ce que le tarage règle vraiment.",
      topics: ["rôle du tarage", "quelle conduite", "différentiel trop faible"]
    },
    {
      short: "AC&R",
      title: "Le régulateur mécanique AC&R",
      url: "../regulateur-huile-mecanique-pedagogique/index.html",
      summary: "Lire un régulateur à flotteur : où il se monte, comment il admet l’huile, et ce qu’il ne sait pas faire.",
      topics: ["montage au carter", "flotteur et admission", "limites de fonctionnement"]
    },
    {
      short: "TraxOil",
      title: "TraxOil : comment il travaille",
      url: "../traxoil-pedagogique/index.html",
      summary: "Comprendre la régulation électronique de niveau : le capteur, l’électrovanne d’admission et ce que dit une alarme.",
      topics: ["capteur à effet Hall", "électrovanne", "alarme de niveau"]
    },
    {
      short: "Monter",
      title: "TraxOil : monter et diagnostiquer",
      url: "../traxoil-installer/index.html",
      summary: "Choisir le bon modèle, le monter juste, reconnaître les architectures BP et HP, puis diagnostiquer sans condamner le contrôleur.",
      topics: ["OM3, OM4, OM5", "architectures BP et HP", "chaîne de preuve"]
    },
    {
      short: "Pression nette",
      title: "Le pressostat d’huile : la pression nette",
      url: "../pressostat-differentiel-huile-pedagogique/index.html",
      summary: "Comprendre ce que surveille un pressostat différentiel : la pression nette de lubrification, et non un niveau.",
      topics: ["pompe et raccordements", "P1 moins P2", "lecture des seuils"]
    },
    {
      short: "Sécurité",
      title: "Le pressostat d’huile : temporisation et sécurité",
      url: "../pressostat-huile-securite/index.html",
      summary: "Suivre la séquence complète : le délai au démarrage, la surveillance en marche, la coupure de sécurité et ce qu’il faut relever.",
      topics: ["temporisation au démarrage", "coupure et réarmement", "le relevé qui conclut"]
    },
    {
      short: "Lire",
      title: "Diagnostic : lire l’architecture et le retour",
      url: "../diagnostic-circuit-huile/index.html",
      summary: "Commencer un diagnostic par l’architecture réelle du circuit, puis remonter le retour naturel et la séparation avant toute conclusion.",
      topics: ["identifier l’architecture", "que dit un niveau bas", "retour naturel et séparation"]
    },
    {
      short: "Conclure",
      title: "Diagnostic : pression, distribution et conclusion",
      url: "../diagnostic-circuit-huile-conclure/index.html",
      summary: "Terminer le diagnostic : le différentiel, la ligne d’huile jusqu’au carter, le croisement des indices et une conclusion vérifiable.",
      topics: ["différentiel et ligne d’huile", "croiser plusieurs indices", "conclure et décider la suite"]
    }
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

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function renderMap() {
    grid.innerHTML = stations.map(function (station, index) {
      return '<button class="metro-station station-' + (index + 1) + '" type="button" data-station="' + index + '" aria-label="Station ' + (index + 1) + ' sur ' + stations.length + ' : ' + esc(station.title) + '">' +
        '<span class="station-dot">' + (index + 1) + '</span><span class="station-label">' + esc(station.short) + "</span></button>";
    }).join("");

    Array.prototype.forEach.call(grid.querySelectorAll("[data-station]"), function (button) {
      button.addEventListener("click", function () {
        selectStation(Number(button.dataset.station), false, true);
      });
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
    position.textContent = "STATION " + (current + 1) + " SUR " + stations.length;
    title.textContent = station.title;
    summary.textContent = station.summary;
    topics.innerHTML = station.topics.map(function (topic) { return "<li>" + esc(topic) + "</li>"; }).join("");
    open.href = station.url;
    open.setAttribute("aria-label", "Entrer dans la station " + (current + 1) + " : " + station.title);
    previous.disabled = current === 0;
    next.disabled = current === stations.length - 1;
    status.textContent = "Station " + (current + 1) + " sur " + stations.length + " · " + station.short;
    if (announce) live.textContent = "Station " + (current + 1) + " sélectionnée : " + station.title;
    if (focusButton) grid.querySelector('[data-station="' + current + '"]').focus();
  }

  previous.addEventListener("click", function () { selectStation(current - 1, true, true); });
  next.addEventListener("click", function () { selectStation(current + 1, true, true); });

  renderMap();
  document.getElementById("station-count").textContent = stations.length;
  printStations.innerHTML = stations.map(function (station) {
    return "<li><strong>" + esc(station.title) + "</strong> — " + esc(station.summary) + "</li>";
  }).join("");
  selectStation(0, false, false);
})();
