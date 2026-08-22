(function () {
  "use strict";

  var catalog = window.REGULES_CATALOG;
  var app = document.getElementById("hub");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function card(module) {
    return '<a class="module-card" href="../' + escapeHtml(module.id) + '/index.html"><span class="module-number">' + module.number + '</span><span><h3>' + escapeHtml(module.title) + '</h3><p>' + escapeHtml(module.promise) + '</p></span><span class="arrow" aria-hidden="true">→</span></a>';
  }

  if (!catalog || !app) {
    document.body.innerHTML = '<main class="fatal"><h1>Carte indisponible</h1><p>Le catalogue des régules n’a pas été chargé.</p></main>';
    return;
  }

  var command = catalog.modules.filter(function (module) { return module.family === "Commander le froid"; });
  var defrost = catalog.modules.filter(function (module) { return module.family !== "Commander le froid"; });

  app.innerHTML = [
    '<header class="hub-head">',
    '  <a class="brand" href="../../../index.html"><span class="brand-name">inerWeb</span><span class="brand-edition">ÉDU</span></a>',
    '  <div class="hub-title"><p>' + escapeHtml(catalog.subtitle) + '</p><h1>' + escapeHtml(catalog.title) + '</h1></div>',
    '  <div class="hub-end"></div>',
    '</header>',
    '<section class="rails" aria-label="Parcours des dix stations">',
    '  <section class="rail-group"><h2>1 · Commander le froid</h2>' + command.map(card).join("") + '</section>',
    '  <section class="rail-group"><h2>2 · Organiser le dégivrage</h2>' + defrost.map(card).join("") + '</section>',
    '</section>',
    '<footer class="hub-foot"><span><strong>10 stations séparées</strong> · 3 écrans + 1 quiz par station</span><span>Hors ligne · clic et clavier · aucun autoplay</span></footer>'
  ].join("\n");

  window.addEventListener("load", function () {
    var accessibilityButton = document.getElementById("lisib-bouton");
    var target = document.querySelector(".hub-end");
    if (accessibilityButton && target) { target.appendChild(accessibilityButton); }
  });
})();
