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

  function filmCard(module) {
    var count = (module.films || []).length;
    return '<a class="film-card" href="../' + escapeHtml(module.id) + '/index.html"><span class="film-icon" aria-hidden="true">▶</span><span><strong>Station ' + module.number + ' · ' + escapeHtml(module.shortTitle) + '</strong><small>' + (count > 1 ? count + ' films · vue complète' : 'Film · vue complète') + '</small></span><span aria-hidden="true">→</span></a>';
  }

  if (!catalog || !app) {
    document.body.innerHTML = '<main class="fatal"><h1>Carte indisponible</h1><p>Le catalogue des régules n’a pas été chargé.</p></main>';
    return;
  }

  var command = catalog.modules.filter(function (module) { return module.family === "Commander le froid"; });
  var defrost = catalog.modules.filter(function (module) { return module.family !== "Commander le froid"; });
  var filmed = catalog.modules.filter(function (module) { return (module.films || []).length; });

  app.innerHTML = [
    '<header class="hub-head">',
    '  <a class="brand" href="../../../index.html"><img class="brand-logo" src="../_regules-commun/logo-inerweb-edu.svg" alt="inerWeb Édu"></a>',
    '  <div class="hub-title"><p>' + escapeHtml(catalog.subtitle) + '</p><h1>' + escapeHtml(catalog.title) + '</h1></div>',
    '  <div class="hub-end"></div>',
    '</header>',
    '<main class="hub-main">',
    '  <section class="film-first" aria-labelledby="films-title"><div class="section-heading"><p>ÉTAPE 1</p><h2 id="films-title">Commencer par les films</h2><span>Caméra fixe · vue d’ensemble</span></div><div class="film-grid">' + filmed.map(filmCard).join("") + '</div></section>',
    '  <section class="course-section" aria-labelledby="course-title"><div class="section-heading compact"><p>ÉTAPE 2</p><h2 id="course-title">Passer au cours</h2><span>Questionnaire seulement à la fin</span></div><div class="rails" aria-label="Parcours des dix stations">',
    '    <section class="rail-group"><h3>Commander le froid</h3>' + command.map(card).join("") + '</section>',
    '    <section class="rail-group"><h3>Organiser le dégivrage</h3>' + defrost.map(card).join("") + '</section>',
    '  </div></section>',
    '</main>',
    '<footer class="hub-foot"><span><strong>Film → cours → questionnaire</strong></span><span>Hors ligne · clic et clavier · aucun autoplay</span></footer>'
  ].join("\n");

  window.addEventListener("load", function () {
    var accessibilityButton = document.getElementById("lisib-bouton");
    var target = document.querySelector(".hub-end");
    if (accessibilityButton && target) { target.appendChild(accessibilityButton); }
  });
})();
