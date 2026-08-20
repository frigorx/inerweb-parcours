(function () {
  "use strict";

  var moduleData = window.OIL_MODULE;
  if (!moduleData) throw new Error("Données du module d'huile absentes.");

  var state = {
    phase: "lesson",
    lesson: 0,
    quiz: 0,
    score: 0,
    answered: false,
    answers: [],
    done: new Set(),
    speechRun: 0,
    speaking: false,
    paused: false
  };

  var ui = {
    title: document.getElementById("module-title"),
    subtitle: document.getElementById("module-subtitle"),
    stations: document.getElementById("stations"),
    lessonCard: document.getElementById("lesson-card"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    status: document.getElementById("module-status"),
    voice: document.getElementById("voice-button"),
    stopVoice: document.getElementById("stop-voice"),
    rate: document.getElementById("voice-rate"),
    sources: document.getElementById("sources-button"),
    dialog: document.getElementById("sources-dialog"),
    dialogBody: document.getElementById("sources-body"),
    dialogClose: document.getElementById("sources-close"),
    live: document.getElementById("live-status"),
    lineHome: document.querySelector(".brand")
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function inline(text) {
    var value = esc(text);
    value = value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    value = value.replace(/\[\[(.+?)\|(.+?)\]\]/g, function (_, word, definition) {
      return '<abbr title="' + definition + '">' + word + "</abbr>";
    });
    return value;
  }

  function svg(label, body, viewBox) {
    return '<svg viewBox="' + (viewBox || "0 0 720 390") + '" role="img" aria-label="' + esc(label) + '">' +
      '<title>' + esc(label) + "</title>" + body + "</svg>";
  }

  function arrowMarker() {
    return '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#c9451a"/></marker></defs>';
  }

  function circuitMarkers() {
    return '<defs>' +
      '<marker id="fluid-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#1b3a63"/></marker>' +
      '<marker id="oil-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#b06a00"/></marker>' +
      '</defs>';
  }

  function oilDrop(x, y, size, extraClass) {
    var s = size || 1;
    return '<path class="oil-drop ' + (extraClass || "") + '" transform="translate(' + x + " " + y + ") scale(" + s + ')" d="M0 -13 C9 -2 13 4 13 11 A13 13 0 1 1 -13 11 C-13 4 -9 -2 0 -13 Z"/>';
  }

  // Géométrie reprise à l'identique de la bibliothèque technique inerWeb.
  // Les SVG sont imbriqués afin de conserver leurs viewBox et leurs tracés.
  function libraryCompressor(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé du compresseur") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-24.0 -20.0 50 40" overflow="visible">' +
      '<circle cx="0.0" cy="0.0" r="15.0" fill="white" stroke="#000" stroke-width="1"/>' +
      '<line x1="-15" y1="0" x2="-16" y2="0" stroke="#000" stroke-width="1"/>' +
      '<line x1="15" y1="0" x2="16" y2="0" stroke="#000" stroke-width="1"/>' +
      '<line x1="-7" y1="-13" x2="13" y2="-7" stroke="#000" stroke-width="1"/>' +
      '<line x1="-7" y1="13" x2="13" y2="7" stroke="#000" stroke-width="1"/>' +
      '<circle cx="-16" cy="0" r="1.5" fill="#000"/>' +
      '<circle cx="16" cy="0" r="1.5" fill="#000"/>' +
      '<circle cx="-10" cy="10" r="1.5" fill="#000"/>' +
      '<circle cx="2" cy="11" r="1.5" fill="#000"/>' +
      '<circle cx="2" cy="11" r="1.5" fill="#000"/>' +
      '<circle cx="-10" cy="-10" r="1.5" fill="#000"/>' +
      '</svg></g>';
  }

  function libraryExpansionValve(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole du détendeur thermostatique à égalisation externe") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-19.0 -28.0 40 40" overflow="visible">' +
      '<circle cx="0.0" cy="-12.00005" r="5.83095" fill="white" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="-18" x2="0" y2="-20" stroke="#000" stroke-width="1"/>' +
      '<polygon points="2,1 0,3 -2,1 -10,5 -10,-5 10,5 10,-5 -2,1 0,0 0,0" fill="white" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="0" x2="0" y2="-6" stroke="#000" stroke-width="1"/>' +
      '<line x1="10" y1="0" x2="11" y2="0" stroke="#000" stroke-width="1"/>' +
      '<line x1="-10" y1="0" x2="-11" y2="0" stroke="#000" stroke-width="1"/>' +
      '<circle cx="0" cy="-20" r="1.5" fill="#000"/>' +
      '<circle cx="11" cy="0" r="1.5" fill="#000"/>' +
      '<circle cx="-11" cy="0" r="1.5" fill="#000"/>' +
      '<text x="-5" y="-9.66667" font-family="sans-serif" font-size="6" fill="#333">TC</text>' +
      '</svg></g>';
  }

  function libraryOilSeparator(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé du séparateur d’huile") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-14.0 -18.0 30 40" overflow="visible">' +
      '<polyline points="1,7 6,2 9,2" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="-10" x2="0" y2="-2" stroke="#000" stroke-width="1"/>' +
      '<polyline points="-8,-13 8,-13 8,5 0,13 -8,5 -8,-13" fill="none" stroke="#000" stroke-width="1"/>' +
      '<ellipse cx="0.0" cy="8.0" rx="2.0" ry="1.0" fill="none" stroke="#000" stroke-width="1"/>' +
      '<circle cx="0" cy="14" r="1.5" fill="#000"/>' +
      '<circle cx="-9" cy="-10" r="1.5" fill="#000"/>' +
      '<circle cx="9" cy="-10" r="1.5" fill="#000"/>' +
      '<circle cx="9" cy="2" r="1.5" fill="#000"/>' +
      '</svg></g>';
  }

  function libraryAirExchanger(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé de l’échangeur à air") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-25.0 -25.0 60 60" overflow="visible">' +
      '<rect x="-18" y="-20" width="36" height="48" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="-14" y1="16" x2="-14" y2="24" stroke="#000" stroke-width="1"/>' +
      '<line x1="7" y1="16" x2="7" y2="24" stroke="#000" stroke-width="1"/>' +
      '<line x1="14" y1="16" x2="14" y2="24" stroke="#000" stroke-width="1"/>' +
      '<line x1="-7" y1="16" x2="-7" y2="24" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="16" x2="0" y2="24" stroke="#000" stroke-width="1"/>' +
      '<line x1="-19" y1="20" x2="19" y2="20" stroke="#000" stroke-width="1"/>' +
      '<circle cx="0.0" cy="-2.0" r="15.0" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="7" y1="-15" x2="13" y2="5" stroke="#000" stroke-width="1"/>' +
      '<path d="M -1.00 -2.00 A 1.00 1.00 0 0 1 0.00 -1.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="-7" y1="-15" x2="-13" y2="5" stroke="#000" stroke-width="1"/>' +
      '<path d="M 6.00 5.00 A 6.00 6.00 0 0 1 0.00 -1.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M -7.00 4.00 A 6.00 6.00 0 0 1 -1.00 -2.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M 0.00 -1.00 A 6.00 6.00 0 0 1 -6.00 5.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M -6.00 5.00 A 1.00 1.00 0 0 1 -7.00 4.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M 1.00 -2.00 A 6.00 6.00 0 0 1 7.00 4.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M 0.00 -1.00 A 1.00 1.00 0 0 1 1.00 -2.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<path d="M 7.00 4.00 A 1.00 1.00 0 0 1 6.00 5.00" fill="none" stroke="#000" stroke-width="1"/>' +
      '<ellipse cx="0.0" cy="-7.0" rx="2.5" ry="4.5" fill="none" stroke="#000" stroke-width="1"/>' +
      '<circle cx="-19" cy="20" r="1.5" fill="#000"/>' +
      '<circle cx="19" cy="20" r="1.5" fill="#000"/>' +
      '</svg></g>';
  }

  function libraryCartridgeFilter(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé du filtre à cartouche") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height +
      '" viewBox="-26.0 -14.0 40 30" overflow="visible">' +
      "<rect x=\"-19\" y=\"-8\" width=\"25\" height=\"16\" fill=\"none\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-15\" y1=\"-8\" x2=\"-15\" y2=\"7\" stroke=\"#000\" stroke-width=\"0.5\" stroke-dasharray=\"4,2\"/><polyline points=\"2,-8 2,-5 -10,-5 -10,5 2,5 2,8\" fill=\"none\" stroke=\"#000\" stroke-width=\"0.5\" stroke-dasharray=\"4,2\"/><circle cx=\"0\" cy=\"9\" r=\"1.5\" fill=\"#000\"/><circle cx=\"7\" cy=\"0\" r=\"1.5\" fill=\"#000\"/><circle cx=\"0\" cy=\"-9\" r=\"1.5\" fill=\"#000\"/><circle cx=\"-20\" cy=\"0\" r=\"1.5\" fill=\"#000\"/>" +
      '</svg></g>';
  }

  function libraryShutoffValve(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé de la vanne d’isolement") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height +
      '" viewBox="-19.0 -10.0 40 20" overflow="visible">' +
      "<line x1=\"10\" y1=\"0\" x2=\"11\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-10\" y1=\"0\" x2=\"-11\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><polygon points=\"-10,-5 10,5 10,-5 -10,5 -10,-4\" fill=\"white\" stroke=\"#000\" stroke-width=\"1\"/><circle cx=\"0.0\" cy=\"0.0\" r=\"2.0\" fill=\"black\" stroke=\"#000\" stroke-width=\"1\"/><circle cx=\"11\" cy=\"0\" r=\"1.5\" fill=\"#000\"/><circle cx=\"-11\" cy=\"0\" r=\"1.5\" fill=\"#000\"/>" +
      '</svg></g>';
  }

  function librarySolenoidValve(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé de l’électrovanne") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height +
      '" viewBox="-19.0 -21.0 40 30" overflow="visible">' +
      "<line x1=\"-3\" y1=\"-13\" x2=\"3\" y2=\"-9\" stroke=\"#000\" stroke-width=\"1\"/><path d=\"M 3.00 -7.00 A 3.00 3.00 0 0 1 -3.00 -7.00\" fill=\"none\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-3\" y1=\"-8\" x2=\"-3\" y2=\"-15\" stroke=\"#000\" stroke-width=\"1\"/><path d=\"M -3.00 -15.00 A 3.00 3.00 0 0 1 3.00 -15.00\" fill=\"none\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"3\" y1=\"-8\" x2=\"3\" y2=\"-15\" stroke=\"#000\" stroke-width=\"1\"/><polygon points=\"2,1 0,3 -2,1 -10,5 -10,-5 10,5 10,-5 -2,1 0,0 0,0\" fill=\"white\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-4\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"10\" y1=\"0\" x2=\"11\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-10\" y1=\"0\" x2=\"-11\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><circle cx=\"-11\" cy=\"0\" r=\"1.5\" fill=\"#000\"/><circle cx=\"11\" cy=\"0\" r=\"1.5\" fill=\"#000\"/>" +
      '</svg></g>';
  }

  function libraryPump(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé de la pompe") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height +
      '" viewBox="-24.0 -20.0 50 40" overflow="visible">' +
      "<circle cx=\"0.0\" cy=\"0.0\" r=\"15.0\" fill=\"white\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"15\" y1=\"0\" x2=\"0\" y2=\"15\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"15\" y1=\"0\" x2=\"0\" y2=\"-15\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-15\" y1=\"0\" x2=\"-16\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"15\" y1=\"0\" x2=\"16\" y2=\"0\" stroke=\"#000\" stroke-width=\"1\"/><circle cx=\"-16\" cy=\"0\" r=\"1.5\" fill=\"#000\"/><circle cx=\"16\" cy=\"0\" r=\"1.5\" fill=\"#000\"/>" +
      '</svg></g>';
  }

  function librarySightGlass(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole normalisé du voyant liquide") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height +
      '" viewBox="-15.0 -10.0 50 20" overflow="visible">' +
      "<line x1=\"21.7269\" y1=\"-0.0538826\" x2=\"27.65\" y2=\"-0.0538826\" stroke=\"#000\" stroke-width=\"1\"/><rect x=\"-0.7\" y=\"-5.79239\" width=\"22.75\" height=\"11.7924\" fill=\"none\" stroke=\"#000\" stroke-width=\"1\"/><ellipse cx=\"10.7\" cy=\"0.1\" rx=\"6.1\" ry=\"5.9\" fill=\"none\" stroke=\"#000\" stroke-width=\"1\"/><line x1=\"-7.7\" y1=\"-0.0538826\" x2=\"-0.7\" y2=\"-0.0538826\" stroke=\"#000\" stroke-width=\"1\"/><circle cx=\"27.3\" cy=\"-0.0538826\" r=\"1.5\" fill=\"#000\"/><circle cx=\"-7.7\" cy=\"-0.0538826\" r=\"1.5\" fill=\"#000\"/><text x=\"8\" y=\"3\" font-family=\"sans-serif\" font-size=\"6\" fill=\"#333\">V</text>" +
      '</svg></g>';
  }

  function libraryPressureSwitch(x, y, width, height, label) {
    return '<g role="img" aria-label="' + esc(label || "Symbole de pressostat de la bibliothèque technique inerWeb") + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-37 -30 50 60" overflow="visible">' +
      '<line x1="-3" y1="0" x2="-17" y2="0" stroke="#000" stroke-width="1" stroke-dasharray="4,2"/>' +
      '<circle cx="-17" cy="0" r="2.5" fill="none" stroke="#000" stroke-width="1"/>' +
      '<polyline points="-5,-10 0,10 0,20" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="-20" x2="0" y2="-10" stroke="#000" stroke-width="1"/>' +
      '<circle cx="0" cy="-20" r="1.5" fill="#000"/><circle cx="0" cy="20" r="1.5" fill="#000"/>' +
      '<text x="2" y="20" font-family="sans-serif" font-size="4" fill="#333">14</text>' +
      '<text x="2" y="-18" font-family="sans-serif" font-size="4" fill="#333">13</text>' +
      '<text x="-27" y="2.5" font-family="sans-serif" font-size="8" fill="#333">P</text>' +
      '<text x="6" y="-0.7" font-family="sans-serif" font-size="4" fill="#555">bar</text>' +
      '</svg></g>';
  }

  /* Un organe se dessine avec son symbole normalisé, jamais avec un rectangle
     nu : le cadre porte le symbole, le nom passe dessous. Réservé aux organes
     réels — un bloc de raisonnement (« LUBRIFIER », « OUI / NON ») reste une
     boîte, et c'est très bien ainsi. */
  function organe(x, y, w, h, symbole, titre, sous, cls) {
    var basTexte = sous ? 40 : 24;
    return '<g><rect class="' + (cls || "component") + '" x="' + x + '" y="' + y +
      '" width="' + w + '" height="' + h + '" rx="14"/>' +
      symbole(x + 10, y + 6, w - 20, h - basTexte - 8, titre) +
      '<text class="svg-label" x="' + (x + w / 2) + '" y="' + (y + h - (sous ? 24 : 9)) +
      '" text-anchor="middle">' + esc(titre) + '</text>' +
      (sous ? '<text class="svg-small" x="' + (x + w / 2) + '" y="' + (y + h - 7) +
        '" text-anchor="middle">' + esc(sous) + '</text>' : '') + '</g>';
  }

  function component(x, y, w, h, title, sub, cls) {
    return '<g><rect class="' + (cls || "component") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14"/>' +
      '<text class="svg-label" x="' + (x + w / 2) + '" y="' + (y + h / 2 - 2) + '" text-anchor="middle">' + esc(title) + "</text>" +
      (sub ? '<text class="svg-small" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 18) + '" text-anchor="middle">' + esc(sub) + "</text>" : "") + "</g>";
  }

  function visualLoop(v) {
    var body = arrowMarker();
    body += '<path class="pipe-thin" d="M180 85 H540 V300 H180 Z"/>';
    body += organe(505, 132, 165, 124, libraryCompressor, "COMPRESSEUR", "huile dans le carter", "accent");
    body += organe(270, 14, 180, 116, libraryAirExchanger, "CONDENSEUR", "rejette la chaleur");
    body += organe(45, 132, 160, 124, libraryExpansionValve, "DÉTENDEUR", "fait chuter la pression");
    body += organe(270, 258, 180, 116, libraryAirExchanger, "ÉVAPORATEUR", "absorbe la chaleur");
    body += '<path d="M515 196 C470 130 455 110 440 100" fill="none" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += oilDrop(560, 212, .9, "pulse") + oilDrop(500, 125, .55, "bob");
    body += '<text class="svg-title" x="360" y="205" text-anchor="middle">L’huile protège le compresseur</text>';
    body += '<text class="svg-label" x="360" y="230" text-anchor="middle">Une petite part circule avec le fluide</text>';
    return svg(v.label, body);
  }

  function visualRoles(v) {
    var body = component(45, 55, 285, 115, "LUBRIFIER", "réduire frottement et usure", "good-shape");
    body += component(390, 55, 285, 115, "ÉTANCHER", "certains jeux internes", "component");
    body += component(45, 220, 285, 115, "ÉVACUER", "une part de la chaleur selon le compresseur", "component");
    body += component(390, 220, 285, 115, "PROTÉGER", "surfaces et mécanismes", "warn-shape");
    body += oilDrop(360, 195, 1.2, "pulse");
    return svg(v.label, body);
  }

  function visualFamilies(v) {
    var families = [
      ["MINÉRALE", "origine pétrolière"],
      ["AB", "alkylbenzène"],
      ["POE", "polyolester"],
      ["PAG", "polyglycol"],
      ["PVE", "polyvinyléther"]
    ];
    var body = '<text class="svg-title" x="360" y="40" text-anchor="middle">Des familles, pas une huile universelle</text>';
    families.forEach(function (f, i) {
      var x = 28 + i * 138;
      body += '<g><path class="vessel" d="M' + (x + 30) + ' 85 H' + (x + 80) + ' L' + (x + 92) + ' 115 V305 Q' + (x + 92) + ' 330 ' + (x + 65) + ' 330 H' + (x + 45) + ' Q' + (x + 18) + ' 330 ' + (x + 18) + ' 305 V115 Z"/>';
      body += '<rect x="' + (x + 24) + '" y="205" width="62" height="105" rx="8" fill="#e1a62a" opacity="' + (.62 + i * .06) + '"/>';
      body += '<text class="svg-code" x="' + (x + 55) + '" y="165" text-anchor="middle">' + f[0] + "</text>";
      body += '<text class="svg-small" x="' + (x + 55) + '" y="350" text-anchor="middle">' + f[1] + "</text></g>";
    });
    return svg(v.label, body);
  }

  function visualTriple(v) {
    var body = arrowMarker();
    body += '<circle cx="250" cy="160" r="108" fill="#eaf2fb" stroke="#1b3a63" stroke-width="4"/>';
    body += '<circle cx="470" cy="160" r="108" fill="#fff0e9" stroke="#c9451a" stroke-width="4" stroke-dasharray="10 6"/>';
    body += '<circle cx="360" cy="285" r="88" fill="#e8f6ee" stroke="#1e7e54" stroke-width="6" stroke-dasharray="2 7"/>';
    body += '<text class="svg-title" x="250" y="145" text-anchor="middle">FLUIDE</text><text class="svg-small" x="250" y="170" text-anchor="middle">solubilité · miscibilité</text>';
    body += '<text class="svg-title" x="470" y="145" text-anchor="middle">COMPRESSEUR</text><text class="svg-small" x="470" y="170" text-anchor="middle">technologie · matériaux</text>';
    body += '<text class="svg-title" x="360" y="280" text-anchor="middle">HUILE</text><text class="svg-small" x="360" y="305" text-anchor="middle">famille · viscosité</text>';
    body += '<rect class="accent" x="282" y="190" width="156" height="48" rx="24"/><text class="svg-label" x="360" y="220" text-anchor="middle">NOTICE FABRICANT</text>';
    return svg(v.label, body);
  }

  function visualViscosity(v) {
    var body = '<text class="svg-title" x="360" y="40" text-anchor="middle">La viscosité change avec les conditions</text>';
    body += '<path d="M90 285 H630" stroke="#1b3a63" stroke-width="8" stroke-linecap="round"/>';
    body += '<path d="M100 285 L100 210 M620 285 L620 210" stroke="#1b3a63" stroke-width="4"/>';
    body += '<text class="svg-label" x="100" y="320" text-anchor="middle">PLUS FLUIDE</text><text class="svg-label" x="620" y="320" text-anchor="middle">PLUS VISQUEUSE</text>';
    body += '<circle class="accent pulse" cx="360" cy="285" r="29"/><text class="svg-code" x="360" y="291" text-anchor="middle">VG</text>';
    body += component(75, 75, 170, 78, "TEMPÉRATURE", "modifie la viscosité");
    body += component(275, 75, 170, 78, "FLUIDE DISSOUS", "peut fluidifier l’huile", "warn-shape");
    body += component(475, 75, 170, 78, "APPLICATION", "charge et technologie");
    body += '<text class="svg-small" x="360" y="365" text-anchor="middle">Le grade seul ne suffit pas : la référence approuvée commande.</text>';
    return svg(v.label, body);
  }

  function visualMoisture(v) {
    var body = arrowMarker();
    body += '<path class="vessel" d="M250 78 H470 V330 H250 Z"/>';
    body += '<rect x="268" y="178" width="184" height="134" rx="8" fill="#d9a12a"/>';
    body += '<rect class="component" x="235" y="48" width="250" height="42" rx="10"/>';
    body += '<text class="svg-label" x="360" y="75" text-anchor="middle">BIDON REFERMÉ</text>';
    body += oilDrop(360, 235, 1.55, "pulse");
    body += '<path d="M115 115 C160 105 190 112 235 130" fill="none" stroke="#3d7fca" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#arrow)"/>';
    body += '<circle cx="90" cy="95" r="12" fill="#84b7ec"/><circle cx="125" cy="72" r="8" fill="#84b7ec"/><circle cx="150" cy="110" r="10" fill="#84b7ec"/>';
    body += '<text class="svg-title" x="118" y="170" text-anchor="middle">AIR HUMIDE</text>';
    body += '<path d="M485 130 C545 112 585 115 625 90" fill="none" stroke="#1e7e54" stroke-width="4" marker-end="url(#arrow)"/>';
    body += '<text class="svg-title" x="580" y="165" text-anchor="middle">FERMER VITE</text>';
    body += '<text class="svg-label" x="580" y="192" text-anchor="middle">limiter l’exposition</text>';
    return svg(v.label, body);
  }

  function visualLabel(v) {
    var body = '<rect class="vessel" x="75" y="55" width="230" height="285" rx="25"/><rect class="accent" x="105" y="110" width="170" height="145" rx="12"/>';
    body += '<text class="svg-title" x="190" y="150" text-anchor="middle">HUILE</text><text class="svg-code" x="190" y="185" text-anchor="middle">FAMILLE</text><text class="svg-code" x="190" y="218" text-anchor="middle">GRADE</text>';
    body += component(365, 55, 285, 72, "1 · PLAQUE / MODÈLE", "identifier le compresseur", "component");
    body += component(365, 157, 285, 72, "2 · NOTICE", "huile approuvée et quantité", "good-shape");
    body += component(365, 259, 285, 72, "3 · BIDON", "référence, lot, état", "warn-shape");
    return svg(v.label, body);
  }

  function oilCircuitBody(journey) {
    var body = circuitMarkers();
    body += '<path d="M648 180 V93 H401" fill="none" stroke="#1b3a63" stroke-width="7" stroke-linejoin="round" marker-end="url(#fluid-arrow)"/>';
    body += '<path d="M296 93 H140 V180" fill="none" stroke="#1b3a63" stroke-width="7" stroke-linejoin="round" marker-end="url(#fluid-arrow)"/>';
    body += '<path d="M74 202 V340 H296" fill="none" stroke="#1b3a63" stroke-width="7" stroke-linejoin="round" marker-end="url(#fluid-arrow)"/>';
    body += '<path d="M401 340 H520 V180 H560" fill="none" stroke="#1b3a63" stroke-width="7" stroke-linejoin="round" marker-end="url(#fluid-arrow)"/>';
    body += libraryAirExchanger(290, 18, 140, 100, "Symbole de l’échangeur à air utilisé comme condenseur");
    body += libraryExpansionValve(50, 120, 120, 100, "Détendeur thermostatique de la bibliothèque technique inerWeb");
    body += libraryAirExchanger(290, 260, 140, 100, "Symbole de l’échangeur à air utilisé comme évaporateur");
    body += '<rect x="548" y="125" width="132" height="120" rx="18" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/>';
    body += libraryCompressor(552, 137, 124, 92, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="360" y="18" text-anchor="middle">CONDENSEUR</text>';
    body += '<text class="svg-label" x="110" y="244" text-anchor="middle">DÉTENDEUR</text>';
    body += '<text class="svg-label" x="360" y="378" text-anchor="middle">ÉVAPORATEUR</text>';
    body += '<text class="svg-label" x="614" y="263" text-anchor="middle">COMPRESSEUR</text>';
    body += '<text class="svg-small" x="520" y="68" text-anchor="middle">HP · refoulement</text>';
    body += '<text class="svg-small" x="515" y="365" text-anchor="middle">BP · aspiration</text>';
    body += '<path d="M638 170 V104 H406" fill="none" stroke="#b06a00" stroke-width="4" stroke-dasharray="11 7" marker-end="url(#oil-arrow)"/>';
    body += '<path d="M289 104 H151 V176" fill="none" stroke="#b06a00" stroke-width="4" stroke-dasharray="11 7" marker-end="url(#oil-arrow)"/>';
    body += '<path d="M84 205 V329 H289" fill="none" stroke="#b06a00" stroke-width="4" stroke-dasharray="11 7" marker-end="url(#oil-arrow)"/>';
    body += '<path d="M406 329 H509 V190 H558" fill="none" stroke="#b06a00" stroke-width="4" stroke-dasharray="11 7" marker-end="url(#oil-arrow)"/>';
    body += oilDrop(625, 122, .42, "") + oilDrop(230, 103, .42, "") + oilDrop(84, 285, .42, "") + oilDrop(470, 329, .42, "");
    if (journey) {
      [[620, 75, "1"], [180, 75, "2"], [130, 300, "3"], [520, 300, "4"]].forEach(function (p) {
        body += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" fill="#fffdf8" stroke="#b06a00" stroke-width="3"/><text class="svg-code" x="' + p[0] + '" y="' + (p[1] + 6) + '" text-anchor="middle">' + p[2] + '</text>';
      });
      body += '<text class="svg-small" x="360" y="218" text-anchor="middle">trait plein : fluide · pointillé : fraction d’huile entraînée</text>';
    } else {
      body += '<rect x="238" y="177" width="244" height="62" rx="15" fill="#fffdf8" stroke="#b06a00" stroke-width="2"/>';
      body += '<text class="svg-title" x="360" y="202" text-anchor="middle">L’HUILE SUIT LA BOUCLE</text><text class="svg-small" x="360" y="224" text-anchor="middle">et doit revenir au carter</text>';
    }
    return body;
  }

  function visualOilCircuit(v) {
    return svg(v.label, oilCircuitBody(false));
  }

  function visualOilJourney(v) {
    return svg(v.label, oilCircuitBody(true));
  }

  function visualOilFunctions(v) {
    var body = '<rect x="255" y="105" width="210" height="180" rx="24" fill="#fff0e9" stroke="#c9451a" stroke-width="4"/>';
    body += libraryCompressor(285, 125, 150, 110, "Compresseur protégé par le film d’huile");
    body += oilDrop(360, 250, .72, "");
    body += component(35, 45, 225, 78, "LUBRIFIER", "séparer les surfaces", "good-shape");
    body += component(460, 45, 225, 78, "ÉTANCHER", "selon la technologie", "component");
    body += component(35, 275, 225, 78, "ÉVACUER", "une part de la chaleur", "component");
    body += component(460, 275, 225, 78, "PROTÉGER", "limiter l’usure", "warn-shape");
    body += '<text class="svg-title" x="360" y="88" text-anchor="middle">FILM D’HUILE</text>';
    body += '<text class="svg-small" x="360" y="330" text-anchor="middle">importance différente selon piston · vis · scroll · ouvert</text>';
    return svg(v.label, body);
  }

  function oilFamilyCard(x, code, name, nature, uses, cls) {
    return '<g><rect class="' + cls + '" x="' + x + '" y="45" width="210" height="300" rx="18"/>' +
      '<circle cx="' + (x + 105) + '" cy="100" r="38" fill="#fffdf8" stroke="#1b3a63" stroke-width="3"/>' +
      '<text class="svg-code" x="' + (x + 105) + '" y="109" text-anchor="middle">' + code + '</text>' +
      '<text class="svg-title" x="' + (x + 105) + '" y="164" text-anchor="middle">' + name + '</text>' +
      '<line x1="' + (x + 35) + '" y1="184" x2="' + (x + 175) + '" y2="184" stroke="#1b3a63" stroke-width="2"/>' +
      '<text class="svg-small" x="' + (x + 105) + '" y="215" text-anchor="middle">' + nature + '</text>' +
      '<text class="svg-label" x="' + (x + 105) + '" y="260" text-anchor="middle">USAGES TYPIQUES</text>' +
      '<text class="svg-small" x="' + (x + 105) + '" y="287" text-anchor="middle">' + uses + '</text>' +
      '<text class="svg-small" x="' + (x + 105) + '" y="313" text-anchor="middle">selon notice fabricant</text></g>';
  }

  function visualOilFamiliesHydrocarbon(v) {
    var body = oilFamilyCard(18, "MO", "HUILE MINÉRALE", "raffinage pétrolier", "R22 · HC · R717", "component");
    body += oilFamilyCard(255, "AB", "ALKYLBENZÈNE", "synthèse hydrocarbonée", "R22 · HC · R717", "good-shape");
    body += oilFamilyCard(492, "PAO", "POLYALPHAOLÉFINE", "synthèse hydrocarbonée", "R717 · HC · cas CO₂", "warn-shape");
    body += '<text class="svg-small" x="360" y="375" text-anchor="middle">Le sigle nomme la famille ; le grade et la référence restent à lire séparément.</text>';
    return svg(v.label, body);
  }

  function visualOilFamiliesSynthetic(v) {
    var body = oilFamilyCard(18, "POE", "ESTER DE POLYOL", "famille polaire · hydrolysable", "HFC/HFO · CO₂ formulé", "good-shape");
    body += oilFamilyCard(255, "PAG", "POLYALKYLÈNE GLYCOL", "très hygroscopique", "clim mobile · CO₂ · cas NH₃", "warn-shape");
    body += oilFamilyCard(492, "PVE", "ÉTHER POLYVINYLIQUE", "stable à l’hydrolyse", "systèmes hermétiques dédiés", "component");
    body += '<text class="svg-small" x="360" y="375" text-anchor="middle">Toutes trois absorbent l’humidité : bidon fermé et référence exacte obligatoires.</text>';
    return svg(v.label, body);
  }

  function visualOilCompatibility(v) {
    var rows = [
      ["R22 / (H)CFC", "MO · AB", "historiquement ; POE possible sur cas approuvés"],
      ["HFC / HFO", "POE surtout", "PVE ou PAG sur conceptions précises"],
      ["R717 · NH₃", "MO · PAO · AB", "PAG possible sur systèmes conçus pour lui"],
      ["R744 · CO₂", "POE · PAG", "formulations et grades dédiés"],
      ["R290 / R600a", "MO · AB · POE · PAO", "la technologie du compresseur tranche"]
    ];
    var body = '<text class="svg-title" x="360" y="30" text-anchor="middle">ASSOCIATIONS COURAMMENT RENCONTRÉES</text>';
    rows.forEach(function (row, i) {
      var y = 48 + i * 61;
      body += '<rect x="18" y="' + y + '" width="684" height="52" rx="12" fill="' + (i % 2 ? "#f3f7fb" : "#fffdf8") + '" stroke="#1b3a63" stroke-width="2"/>';
      body += '<text class="svg-code" x="112" y="' + (y + 32) + '" text-anchor="middle">' + row[0] + '</text>';
      body += '<line x1="205" y1="' + (y + 8) + '" x2="205" y2="' + (y + 44) + '" stroke="#1b3a63" stroke-width="2"/>';
      body += '<text class="svg-label" x="325" y="' + (y + 25) + '" text-anchor="middle">' + row[1] + '</text>';
      body += '<text class="svg-small" x="470" y="' + (y + 41) + '">' + row[2] + '</text>';
    });
    body += '<text class="svg-small" x="360" y="374" text-anchor="middle">Repères de cours ≠ autorisation : vérifier modèle, grade et référence fabricant.</text>';
    return svg(v.label, body);
  }

  function visualOilSelection(v) {
    var items = [
      ["1", "PLAQUE", "modèle exact", "component"],
      ["2", "FLUIDE", "charge réelle", "component"],
      ["3", "FABRICANT", "liste approuvée", "good-shape"],
      ["4", "BIDON", "famille · VG · référence", "warn-shape"]
    ];
    var body = circuitMarkers() + '<text class="svg-title" x="360" y="50" text-anchor="middle">ON NE CHOISIT PAS UNE HUILE SEULE</text>';
    items.forEach(function (item, i) {
      var x = 22 + i * 174;
      body += '<rect class="' + item[3] + '" x="' + x + '" y="92" width="154" height="215" rx="18"/>';
      body += '<circle cx="' + (x + 77) + '" cy="135" r="24" fill="#fffdf8" stroke="#c9451a" stroke-width="3"/><text class="svg-code" x="' + (x + 77) + '" y="143" text-anchor="middle">' + item[0] + '</text>';
      body += '<text class="svg-title" x="' + (x + 77) + '" y="200" text-anchor="middle">' + item[1] + '</text>';
      body += '<text class="svg-small" x="' + (x + 77) + '" y="232" text-anchor="middle">' + item[2] + '</text>';
      if (i < items.length - 1) body += '<path d="M' + (x + 154) + ' 200 H' + (x + 171) + '" stroke="#1b3a63" stroke-width="4" marker-end="url(#fluid-arrow)"/>';
    });
    body += '<text class="svg-label" x="360" y="350" text-anchor="middle">inconnue ou mélange suspecté → suspendre l’ajout</text>';
    return svg(v.label, body);
  }

  function visualOilMixing(v) {
    var body = '<text class="svg-title" x="360" y="34" text-anchor="middle">DEUX PROPRIÉTÉS · TROIS CONSÉQUENCES</text>';
    var panels = [[18, "MISCIBLE", "une phase", "transport facilité"], [258, "NON MISCIBLE", "deux phases", "huile qui peut s’accumuler"], [498, "SOLUBILITÉ", "fluide dans l’huile", "viscosité réduite"]];
    panels.forEach(function (p, i) {
      body += '<rect x="' + p[0] + '" y="58" width="204" height="286" rx="18" fill="#fffdf8" stroke="#1b3a63" stroke-width="3"/>';
      body += '<text class="svg-title" x="' + (p[0] + 102) + '" y="92" text-anchor="middle">' + p[1] + '</text>';
      body += '<path d="M' + (p[0] + 62) + ' 120 H' + (p[0] + 142) + ' V260 Q' + (p[0] + 142) + ' 285 ' + (p[0] + 102) + ' 285 Q' + (p[0] + 62) + ' 285 ' + (p[0] + 62) + ' 260 Z" fill="#eaf2fb" stroke="#1b3a63" stroke-width="3"/>';
      if (i === 0) body += '<rect x="' + (p[0] + 68) + '" y="185" width="68" height="91" fill="#d9a12a" opacity=".78"/>';
      if (i === 1) body += '<rect x="' + (p[0] + 68) + '" y="185" width="68" height="45" fill="#84b7ec"/><rect x="' + (p[0] + 68) + '" y="230" width="68" height="46" fill="#d9a12a"/>';
      if (i === 2) body += '<rect x="' + (p[0] + 68) + '" y="185" width="68" height="91" fill="#d9a12a" opacity=".62"/><circle cx="' + (p[0] + 86) + '" cy="215" r="8" fill="#3d7fca"/><circle cx="' + (p[0] + 118) + '" cy="240" r="8" fill="#3d7fca"/>';
      body += '<text class="svg-label" x="' + (p[0] + 102) + '" y="312" text-anchor="middle">' + p[2] + '</text>';
      body += '<text class="svg-small" x="' + (p[0] + 102) + '" y="334" text-anchor="middle">' + p[3] + '</text>';
    });
    return svg(v.label, body);
  }

  function visualOilIsoVg(v) {
    var grades = [[35, "32", "≈ 32 mm²/s"], [265, "46", "≈ 46 mm²/s"], [495, "68", "≈ 68 mm²/s"]];
    var body = '<text class="svg-title" x="360" y="38" text-anchor="middle">VISCOSITÉ CINÉMATIQUE DE L’HUILE PURE</text>';
    body += '<rect x="275" y="54" width="170" height="38" rx="19" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="svg-label" x="360" y="79" text-anchor="middle">RÉFÉRENCE : 40 °C</text>';
    grades.forEach(function (g, i) {
      body += '<rect x="' + g[0] + '" y="118" width="190" height="192" rx="20" fill="' + (i === 1 ? "#e8f6ee" : "#f3f7fb") + '" stroke="#1b3a63" stroke-width="3"/>';
      body += '<text class="svg-label" x="' + (g[0] + 95) + '" y="155" text-anchor="middle">ISO VG</text>';
      body += '<text x="' + (g[0] + 95) + '" y="232" text-anchor="middle" fill="#c9451a" font-family="Trebuchet MS, sans-serif" font-size="72" font-weight="900">' + g[1] + '</text>';
      body += '<text class="svg-title" x="' + (g[0] + 95) + '" y="277" text-anchor="middle">' + g[2] + '</text>';
    });
    body += '<text class="svg-label" x="360" y="350" text-anchor="middle">Ce nombre n’est PAS une température ni une plage d’emploi.</text>';
    return svg(v.label, body);
  }

  function visualOilViscosityTemperature(v) {
    var body = '<text class="svg-title" x="360" y="34" text-anchor="middle">EXEMPLE FABRICANT · HUILES POE PURES</text>';
    body += '<rect x="30" y="62" width="660" height="250" rx="18" fill="#fffdf8" stroke="#1b3a63" stroke-width="3"/>';
    body += '<line x1="30" y1="122" x2="690" y2="122" stroke="#1b3a63" stroke-width="3"/><line x1="190" y1="62" x2="190" y2="312" stroke="#1b3a63" stroke-width="3"/>';
    body += '<line x1="356" y1="62" x2="356" y2="312" stroke="#1b3a63" stroke-width="2"/><line x1="522" y1="62" x2="522" y2="312" stroke="#1b3a63" stroke-width="2"/>';
    body += '<line x1="30" y1="217" x2="690" y2="217" stroke="#1b3a63" stroke-width="2"/>';
    body += '<text class="svg-label" x="110" y="98" text-anchor="middle">HUILE</text><text class="svg-code" x="273" y="99" text-anchor="middle">20 °C</text><text class="svg-code" x="439" y="99" text-anchor="middle">40 °C</text><text class="svg-code" x="606" y="99" text-anchor="middle">100 °C</text>';
    body += '<text class="svg-title" x="110" y="175" text-anchor="middle">BSE32</text><text class="svg-code" x="273" y="178" text-anchor="middle">74 cSt</text><text class="svg-code" x="439" y="178" text-anchor="middle">32 cSt</text><text class="svg-code" x="606" y="178" text-anchor="middle">6 cSt</text>';
    body += '<text class="svg-title" x="110" y="270" text-anchor="middle">BSE55</text><text class="svg-code" x="273" y="273" text-anchor="middle">147 cSt</text><text class="svg-code" x="439" y="273" text-anchor="middle">55 cSt</text><text class="svg-code" x="606" y="273" text-anchor="middle">9 cSt</text>';
    body += '<path d="M170 347 H550" stroke="#c9451a" stroke-width="5" marker-end="url(#oil-arrow)"/>' + circuitMarkers();
    body += '<text class="svg-label" x="360" y="342" text-anchor="middle">température augmente</text><text class="svg-small" x="360" y="375" text-anchor="middle">viscosité diminue · le fluide dissous peut encore fluidifier le mélange</text>';
    return svg(v.label, body);
  }

  function visualOilMoisture(v) {
    var body = circuitMarkers();
    body += '<rect x="28" y="72" width="190" height="238" rx="18" fill="#f3f7fb" stroke="#1b3a63" stroke-width="3"/>';
    body += '<text class="svg-title" x="123" y="105" text-anchor="middle">AIR HUMIDE</text>';
    [80, 125, 168].forEach(function (x, i) { body += '<circle cx="' + x + '" cy="' + (155 + i * 35) + '" r="20" fill="#eaf2fb" stroke="#3d7fca" stroke-width="3"/><text class="svg-small" x="' + x + '" y="' + (160 + i * 35) + '" text-anchor="middle">H₂O</text>'; });
    body += '<path d="M218 190 H270" stroke="#1b3a63" stroke-width="5" marker-end="url(#fluid-arrow)"/>';
    body += '<rect x="275" y="72" width="190" height="238" rx="18" fill="#fffdf8" stroke="#b06a00" stroke-width="3"/>';
    body += '<text class="svg-title" x="370" y="105" text-anchor="middle">HUILE</text><text class="svg-label" x="370" y="132" text-anchor="middle">POE · PAG · PVE</text>';
    body += '<rect x="315" y="176" width="110" height="98" rx="12" fill="#d9a12a" opacity=".7"/>';
    body += '<text class="svg-label" x="370" y="215" text-anchor="middle">EAU DISSOUTE</text><text class="svg-small" x="370" y="242" text-anchor="middle">invisible à l’œil</text>';
    body += '<path d="M465 190 H517" stroke="#1b3a63" stroke-width="5" marker-end="url(#fluid-arrow)"/>';
    body += '<rect x="522" y="52" width="170" height="278" rx="18" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/>';
    body += '<text class="svg-title" x="607" y="89" text-anchor="middle">RISQUES</text>';
    body += '<text class="svg-label" x="607" y="145" text-anchor="middle">CORROSION</text><text class="svg-label" x="607" y="195" text-anchor="middle">GEL AU DÉTENDEUR</text><text class="svg-label" x="607" y="245" text-anchor="middle">ACIDES AVEC POE</text><text class="svg-small" x="607" y="290" text-anchor="middle">selon eau · huile · fluide</text>';
    body += '<text class="svg-label" x="360" y="365" text-anchor="middle">préparer → ouvrir brièvement → refermer immédiatement</text>';
    return svg(v.label, body);
  }

  function visualOilAcidTest(v) {
    var steps = [
      ["1", "PRÉLEVER", "échantillon représentatif"],
      ["2", "DOSER", "volume selon kit et huile"],
      ["3", "MÉLANGER", "réactifs puis phases"],
      ["4", "LIRE", "comparer à la notice"]
    ];
    var body = circuitMarkers() + '<text class="svg-title" x="360" y="38" text-anchor="middle">TEST D’ACIDITÉ · SUIVRE LA NOTICE DU KIT</text>';
    steps.forEach(function (step, i) {
      var x = 18 + i * 174;
      body += '<rect x="' + x + '" y="70" width="154" height="220" rx="18" fill="' + (i === 3 ? "#e8f6ee" : "#fffdf8") + '" stroke="#1b3a63" stroke-width="3"/>';
      body += '<circle cx="' + (x + 77) + '" cy="112" r="23" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="svg-code" x="' + (x + 77) + '" y="120" text-anchor="middle">' + step[0] + '</text>';
      body += '<text class="svg-title" x="' + (x + 77) + '" y="172" text-anchor="middle">' + step[1] + '</text><text class="svg-small" x="' + (x + 77) + '" y="205" text-anchor="middle">' + step[2] + '</text>';
      if (i === 0) body += oilDrop(x + 77, 246, .62, "");
      if (i === 1) body += '<path d="M' + (x + 60) + ' 232 H' + (x + 94) + ' V268 H' + (x + 60) + ' Z" fill="#d9a12a" stroke="#1b3a63" stroke-width="2"/>';
      if (i === 2) body += '<rect x="' + (x + 54) + '" y="226" width="46" height="52" rx="7" fill="#eaf2fb" stroke="#1b3a63" stroke-width="2"/><line x1="' + (x + 54) + '" y1="252" x2="' + (x + 100) + '" y2="252" stroke="#b06a00" stroke-width="4"/>';
      if (i === 3) body += '<text class="svg-code" x="' + (x + 77) + '" y="258" text-anchor="middle">DÉCIDER</text>';
      if (i < 3) body += '<path d="M' + (x + 154) + ' 180 H' + (x + 171) + '" stroke="#1b3a63" stroke-width="4" marker-end="url(#fluid-arrow)"/>';
    });
    body += '<rect x="90" y="320" width="540" height="48" rx="15" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/>';
    body += '<text class="svg-label" x="360" y="342" text-anchor="middle">ACIDITÉ ≠ pH D’UNE EAU · HUMIDITÉ ≠ ACIDITÉ</text><text class="svg-small" x="360" y="360" text-anchor="middle">résultat positif : chercher la cause, traiter, puis contrôler de nouveau</text>';
    return svg(v.label, body);
  }

  function visualRoute(v) {
    var body = arrowMarker();
    body += '<path class="pipe" d="M560 210 C565 92 475 55 360 55 C245 55 155 92 160 210 C165 325 260 348 360 348 C470 348 555 310 560 210"/>';
    body += '<rect class="accent" x="505" y="145" width="160" height="118" rx="16"/>';
    body += libraryCompressor(530, 155, 110, 88, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="585" y="248" text-anchor="middle">COMPRESSEUR</text>';
    body += organe(275, 12, 170, 104, libraryAirExchanger, "CONDENSEUR", "HP");
    body += organe(52, 148, 156, 112, libraryExpansionValve, "DÉTENDEUR", "chute de pression");
    body += organe(275, 274, 170, 104, libraryAirExchanger, "ÉVAPORATEUR", "BP");
    body += '<path class="oil-line flowing" d="M535 165 C500 105 445 82 400 76 M225 310 C310 350 430 340 500 250"/>';
    body += oilDrop(525, 150, .65, "bob") + oilDrop(470, 300, .65, "bob") + oilDrop(315, 330, .55, "bob");
    body += '<text class="svg-title" x="360" y="195" text-anchor="middle">PARTIR</text><text class="svg-label" x="360" y="220" text-anchor="middle">puis revenir au carter</text>';
    return svg(v.label, body);
  }

  function visualDrivers(v) {
    var body = component(35, 75, 205, 220, "VITESSE DU GAZ", "entraîne le film d’huile", "good-shape");
    body += component(258, 75, 205, 220, "HUILE + FLUIDE", "viscosité et miscibilité", "component");
    body += component(480, 75, 205, 220, "TUYAUTERIE", "diamètre, pente, montée", "warn-shape");
    body += '<path class="oil-line flowing" d="M70 235 H205"/><path class="oil-line flowing" d="M293 235 H428"/><path class="oil-line flowing" d="M515 235 H650"/>';
    body += oilDrop(137, 222, .6, "bob") + oilDrop(360, 222, .6, "bob") + oilDrop(582, 222, .6, "bob");
    body += '<text class="svg-title" x="360" y="345" text-anchor="middle">Le retour naturel est un équilibre de conception</text>';
    return svg(v.label, body);
  }

  function visualSlope(v) {
    var body = arrowMarker();
    body += '<path class="pipe" d="M90 250 L560 175" marker-end="url(#arrow)"/>';
    body += '<path class="oil-line flowing" d="M105 252 L545 181"/>';
    body += oilDrop(235, 222, .65, "bob") + oilDrop(430, 190, .65, "bob");
    body += '<rect class="accent" x="550" y="118" width="135" height="118" rx="16"/>';
    body += libraryCompressor(568, 125, 102, 82, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="618" y="220" text-anchor="middle">COMPRESSEUR</text>';
    body += '<text class="svg-title" x="250" y="105" text-anchor="middle">PENTE PRÉVUE PAR LA CONCEPTION</text>';
    body += '<text class="svg-label" x="260" y="132" text-anchor="middle">éviter les poches et guider le film</text>';
    body += '<text class="svg-small" x="360" y="330" text-anchor="middle">La pente et les diamètres se lisent sur le plan : aucune valeur universelle.</text>';
    return svg(v.label, body);
  }

  function visualRiser(v) {
    var body = arrowMarker();
    body += '<path class="pipe" d="M70 280 L150 295 V320 Q150 350 180 350 Q210 350 210 320 V105 Q210 72 242 72 Q274 72 274 105 V135 H555" marker-end="url(#arrow)"/>';
    body += '<path class="oil-line flowing" d="M82 282 L150 297 V320 Q150 350 180 350 Q210 350 210 320 V110 Q210 76 242 76 Q274 76 274 110 V135 H540"/>';
    body += oilDrop(180, 330, .65, "bob") + oilDrop(212, 210, .58, "bob") + oilDrop(365, 127, .55, "bob");
    body += '<text class="svg-title" x="360" y="36" text-anchor="middle">SIPHON EN PIED · COLONNE · CONTRE-SIPHON EN TÊTE</text>';
    body += '<text class="svg-label" x="160" y="380" text-anchor="middle">siphon en pied</text>';
    body += '<text class="svg-label" x="315" y="87">contre-siphon</text>';
    body += '<text class="svg-small" x="315" y="107">si le plan ou la notice le prescrit</text>';
    body += '<rect class="accent" x="550" y="90" width="135" height="118" rx="16"/>';
    body += libraryCompressor(568, 97, 102, 82, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="618" y="192" text-anchor="middle">COMPRESSEUR</text>';
    return svg(v.label, body);
  }

  function visualPartLoad(v) {
    var body = arrowMarker();
    body += '<line x1="360" y1="48" x2="360" y2="350" stroke="#aab8c8" stroke-width="2" stroke-dasharray="8 8"/>';
    body += '<text class="svg-title" x="180" y="38" text-anchor="middle">CHARGE RÉDUITE</text>';
    body += '<path class="pipe" d="M42 325 H105 V82 H315" marker-end="url(#arrow)"/>';
    body += '<path class="pipe" d="M105 325 H205 V350 Q205 370 225 370 Q245 370 245 350 V82"/>';
    body += '<path class="oil-line flowing" d="M52 325 H105 V95 H300"/>';
    body += '<path d="M207 352 Q225 368 243 352" fill="none" stroke="#d69a16" stroke-width="12" stroke-linecap="round"/>';
    body += '<text class="svg-small" x="105" y="235" text-anchor="middle">petite colonne</text>';
    body += '<text class="svg-small" x="245" y="235" text-anchor="middle">grande colonne</text>';
    body += '<text class="svg-label" x="225" y="310" text-anchor="middle">bouchon d’huile</text>';
    body += '<text class="svg-title" x="540" y="38" text-anchor="middle">PLEINE CHARGE</text>';
    body += '<path class="pipe" d="M395 325 H455 V82 H675" marker-end="url(#arrow)"/>';
    body += '<path class="pipe" d="M455 325 H555 V350 Q555 370 575 370 Q595 370 595 350 V82"/>';
    body += '<path class="oil-line flowing" d="M405 325 H455 V95 H660 M470 325 H555 V350 Q555 370 575 370 Q595 370 595 350 V95 H660"/>';
    body += '<text class="svg-small" x="455" y="235" text-anchor="middle">petite colonne</text>';
    body += '<text class="svg-small" x="595" y="235" text-anchor="middle">grande colonne</text>';
    body += '<text class="svg-label" x="540" y="310" text-anchor="middle">les deux conduisent</text>';
    return svg(v.label, body);
  }

  function visualNaturalCircuit(v) {
    var body = arrowMarker();
    body += libraryAirExchanger(28, 188, 118, 118, "Évaporateur : symbole d’échangeur à air de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="87" y="322" text-anchor="middle">ÉVAPORATEUR</text>';
    body += '<path class="pipe" d="M135 267 L290 290 V318 Q290 350 320 350 Q350 350 350 318 V112 Q350 80 382 80 Q414 80 414 112 V142 H565" marker-end="url(#arrow)"/>';
    body += '<path class="oil-line flowing" d="M147 267 L290 292 V318 Q290 350 320 350 Q350 350 350 318 V116 Q350 84 382 84 Q414 84 414 116 V142 H550"/>';
    body += oilDrop(235, 280, .55, "bob") + oilDrop(320, 332, .58, "bob") + oilDrop(350, 220, .55, "bob") + oilDrop(470, 134, .55, "bob");
    body += '<path d="M168 238 L275 254" fill="none" stroke="#c9451a" stroke-width="3" marker-end="url(#arrow)"/>';
    body += '<text class="svg-label" x="220" y="218" text-anchor="middle">pente vers le retour</text>';
    body += '<text class="svg-label" x="320" y="382" text-anchor="middle">siphon en pied</text>';
    body += '<text class="svg-label" x="435" y="74">contre-siphon selon plan</text>';
    body += '<text class="svg-label" x="355" y="190">colonne</text>';
    body += '<rect class="accent" x="550" y="92" width="140" height="118" rx="16"/>';
    body += libraryCompressor(570, 99, 102, 82, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="620" y="194" text-anchor="middle">COMPRESSEUR</text>';
    body += '<text class="svg-title" x="360" y="36" text-anchor="middle">TRACÉ D’ASPIRATION : LIRE LE CHEMIN DE L’HUILE</text>';
    return svg(v.label, body);
  }

  function visualTimeline(v) {
    var body = '<path d="M80 205 H640" stroke="#1b3a63" stroke-width="6"/>';
    var points = [[120, "DÉMARRAGE", "l’huile quitte le carter"], [300, "RÉGIME STABLE", "départ et retour s’équilibrent"], [485, "CHARGE RÉDUITE", "vitesse plus faible"], [620, "DÉGIVRAGE", "retour transitoire possible"]];
    points.forEach(function (p, i) {
      body += '<circle class="' + (i === 1 ? "good-shape" : "warn-shape") + '" cx="' + p[0] + '" cy="205" r="19"/>';
      body += '<text class="svg-label" x="' + p[0] + '" y="' + (i % 2 ? 265 : 125) + '" text-anchor="middle">' + p[1] + "</text>";
      body += '<text class="svg-small" x="' + p[0] + '" y="' + (i % 2 ? 285 : 145) + '" text-anchor="middle">' + p[2] + "</text>";
    });
    body += oilDrop(80, 205, .58, "flow-dot") + oilDrop(640, 205, .58, "flow-dot");
    return svg(v.label, body);
  }

  function visualObserve(v) {
    var body = '<rect class="component" x="60" y="55" width="230" height="280" rx="42"/><circle cx="175" cy="210" r="75" fill="#fff" stroke="#1b3a63" stroke-width="6"/><path d="M110 230 Q175 270 240 230 V260 Q175 295 110 260 Z" fill="#d69a16"/>';
    body += '<text class="svg-title" x="175" y="100" text-anchor="middle">VOYANT CARTER</text>';
    body += component(350, 55, 310, 72, "1 · OBSERVER DANS LE TEMPS", "pas une photo instantanée", "good-shape");
    body += component(350, 159, 310, 72, "2 · CROISER LE RÉGIME", "charge minimale et maximale", "component");
    body += component(350, 263, 310, 72, "3 · LIRE LE CIRCUIT", "pentes, montées, pièges", "warn-shape");
    return svg(v.label, body);
  }

  function visualDecision(v) {
    var body = arrowMarker();
    body += component(235, 28, 250, 62, "NIVEAU BAS", "symptôme observé", "warn-shape");
    body += '<path d="M360 90 V125" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(235, 130, 250, 62, "RÉGIME STABILISÉ ?", "charge et durée suffisantes");
    body += '<path d="M235 160 H125 V230" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/><path d="M485 160 H595 V230" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(35, 235, 210, 95, "NON", "observer encore, contrôler les transitoires", "warn-shape");
    body += component(475, 235, 210, 95, "OUI", "chercher retour, fuite, charge d’huile", "good-shape");
    body += '<text class="svg-title" x="360" y="370" text-anchor="middle">Ajouter de l’huile n’est jamais le premier diagnostic</text>';
    return svg(v.label, body);
  }

  function visualActive(v) {
    var body = arrowMarker();
    body += '<rect class="accent" x="22" y="86" width="145" height="118" rx="16"/>';
    body += libraryCompressor(42, 94, 104, 83, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="95" y="191" text-anchor="middle">COMPRESSEUR</text>';
    body += '<path class="pipe-thin" d="M167 125 H250" marker-end="url(#arrow)"/>';
    body += '<rect class="component" x="250" y="62" width="142" height="176" rx="16"/>';
    body += libraryOilSeparator(275, 72, 92, 123, "Séparateur d’huile de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="321" y="222" text-anchor="middle">SÉPARATEUR</text>';
    body += '<path class="pipe-thin" d="M392 125 H640" marker-end="url(#arrow)"/>';
    body += '<text class="svg-small" x="510" y="108" text-anchor="middle">gaz vers condenseur</text>';
    body += '<path class="oil-line flowing" d="M321 232 V275 H440"/>';
    body += component(440, 248, 125, 82, "RÉSERVOIR", "réserve tampon", "vessel");
    body += '<path class="oil-line flowing" d="M440 305 H340" marker-end="url(#arrow)"/>';
    body += component(215, 270, 125, 70, "RÉGULATEUR", "niveau carter", "good-shape");
    body += '<path class="oil-line flowing" d="M215 305 H105 V205" marker-end="url(#arrow)"/>';
    body += '<path class="pipe-thin" d="M505 248 V208 H565"/>';
    body += component(565, 173, 122, 70, "CLAPET TARÉ", "Δp vers aspiration", "warn-shape");
    body += '<path class="pipe-thin" d="M687 208 H710" marker-end="url(#arrow)"/>';
    body += oilDrop(365, 264, .52, "bob") + oilDrop(390, 296, .52, "bob") + oilDrop(175, 296, .52, "bob");
    body += '<text class="svg-small" x="627" y="267" text-anchor="middle">branche de pression</text>';
    body += '<text class="svg-small" x="627" y="283" text-anchor="middle">vers l’aspiration</text>';
    body += '<text class="svg-title" x="360" y="34" text-anchor="middle">GESTION ACTIVE : DEUX BRANCHES APRÈS LE RÉSERVOIR</text>';
    body += '<text class="svg-small" x="360" y="370" text-anchor="middle">huile vers le régulateur · pression contrôlée vers l’aspiration</text>';
    return svg(v.label, body);
  }

  function visualSeparator(v) {
    var body = arrowMarker();
    body += '<rect class="component" x="238" y="45" width="244" height="300" rx="20"/>';
    body += libraryOilSeparator(270, 62, 180, 240, "Séparateur d’huile de la bibliothèque technique inerWeb");
    body += '<path d="M75 125 H238" stroke="#1b3a63" stroke-width="10" marker-end="url(#arrow)"/>';
    body += '<path d="M482 125 H645" stroke="#1b3a63" stroke-width="10" marker-end="url(#arrow)"/>';
    body += '<path class="oil-line" d="M360 315 V372" marker-end="url(#arrow)"/>';
    body += oilDrop(205, 108, .5, "bob") + oilDrop(360, 325, .6, "bob");
    body += '<text class="svg-label" x="80" y="95">gaz chaud + huile</text><text class="svg-label" x="510" y="95">gaz vers condenseur</text><text class="svg-title" x="360" y="378" text-anchor="middle">huile vers retour ou réservoir</text>';
    return svg(v.label, body);
  }

  function visualSeparatorMethods(v) {
    var body = '<text class="svg-title" x="360" y="38" text-anchor="middle">LA TECHNOLOGIE CHANGE, LA MISSION RESTE LA MÊME</text>';
    body += component(35, 82, 200, 205, "IMPACT · CHICANES", "changer la direction et ralentir", "component");
    body += component(260, 82, 200, 205, "CENTRIFUGE", "écarter les gouttelettes du gaz", "good-shape");
    body += component(485, 82, 200, 205, "COALESCENCE", "réunir les fines gouttelettes", "warn-shape");
    body += '<path d="M72 190 H195" stroke="#3d7fca" stroke-width="6" stroke-dasharray="10 7"/><path d="M110 155 L165 225" stroke="#1b3a63" stroke-width="7"/>';
    body += '<path d="M315 230 C400 225 405 140 335 145 C280 150 300 205 370 195" fill="none" stroke="#3d7fca" stroke-width="6"/>';
    body += oilDrop(360, 170, .48, "bob") + oilDrop(565, 175, .42, "bob") + oilDrop(610, 205, .62, "bob");
    body += '<path d="M530 145 H640 M530 165 H640 M530 185 H640 M530 205 H640 M530 225 H640" stroke="#1b3a63" stroke-width="2"/>';
    body += '<text class="svg-label" x="360" y="335" text-anchor="middle">Le rendement dépend du débit, de la taille des gouttes et de la technologie.</text>';
    body += '<text class="svg-small" x="360" y="360" text-anchor="middle">Toujours sélectionner et monter selon la notice.</text>';
    return svg(v.label, body);
  }

  function visualFloatReturn(v) {
    var body = arrowMarker();
    body += '<path class="vessel" d="M235 45 H485 Q510 45 510 70 V315 Q510 340 485 340 H235 Q210 340 210 315 V70 Q210 45 235 45 Z"/>';
    body += '<path class="pipe-thin" d="M55 105 H210" marker-end="url(#arrow)"/><path class="pipe-thin" d="M510 105 H665" marker-end="url(#arrow)"/>';
    body += '<rect x="230" y="245" width="260" height="75" rx="12" fill="#d69a16" opacity=".72"/>';
    body += '<circle cx="330" cy="246" r="31" fill="#fff" stroke="#1b3a63" stroke-width="5"/>';
    body += '<path d="M360 246 H430 L465 195" fill="none" stroke="#1b3a63" stroke-width="6"/>';
    body += '<circle cx="465" cy="195" r="13" fill="#ff6b35" stroke="#c9451a" stroke-width="4"/>';
    body += '<path class="oil-line" d="M465 210 V368" marker-end="url(#arrow)"/>';
    body += oilDrop(300, 150, .48, "bob") + oilDrop(410, 185, .48, "bob");
    body += '<text class="svg-label" x="55" y="82">gaz + huile</text><text class="svg-label" x="535" y="82">gaz séparé</text>';
    body += '<text class="svg-title" x="360" y="82" text-anchor="middle">FLOTTEUR → LEVIER → POINTEAU</text>';
    body += '<text class="svg-label" x="330" y="295" text-anchor="middle">flotteur</text><text class="svg-label" x="495" y="190">pointeau</text>';
    body += '<text class="svg-small" x="360" y="385" text-anchor="middle">Le retour s’ouvre par intermittence sans laisser passer le gaz de refoulement.</text>';
    return svg(v.label, body);
  }

  function visualReceiver(v) {
    var body = arrowMarker();
    body += '<path class="vessel" d="M245 45 H475 V345 H245 Z"/>';
    body += '<rect x="265" y="200" width="190" height="125" rx="12" fill="#d69a16" opacity=".78"/>';
    body += '<circle cx="475" cy="145" r="24" fill="#fff" stroke="#1b3a63" stroke-width="4"/><circle cx="475" cy="260" r="24" fill="#fff" stroke="#1b3a63" stroke-width="4"/>';
    body += '<path class="oil-line" d="M90 100 H245" marker-end="url(#arrow)"/><path class="oil-line" d="M475 320 H630" marker-end="url(#arrow)"/>';
    body += '<path class="pipe-thin" d="M360 45 V18 H600" marker-end="url(#arrow)"/>';
    body += '<text class="svg-title" x="360" y="90" text-anchor="middle">RÉSERVOIR D’HUILE</text><text class="svg-label" x="360" y="120" text-anchor="middle">« bouteillon » en atelier</text>';
    body += '<text class="svg-label" x="80" y="78">huile du séparateur</text><text class="svg-label" x="510" y="300">vers régulateurs</text><text class="svg-small" x="565" y="55">mise à pression contrôlée</text>';
    return svg(v.label, body);
  }

  function visualReservoirLevels(v) {
    var body = arrowMarker();
    body += '<path class="vessel" d="M245 35 H475 V345 H245 Z"/>';
    body += '<rect x="265" y="180" width="190" height="145" rx="12" fill="#d69a16" opacity=".72"/>';
    body += '<circle cx="475" cy="130" r="25" fill="#fff" stroke="#1b3a63" stroke-width="4"/><circle cx="475" cy="260" r="25" fill="#fff" stroke="#1b3a63" stroke-width="4"/>';
    body += '<line x1="500" y1="130" x2="620" y2="130" stroke="#1e7e54" stroke-width="4"/><text class="svg-label" x="630" y="135">voyant haut</text>';
    body += '<line x1="500" y1="260" x2="620" y2="260" stroke="#c9451a" stroke-width="4" stroke-dasharray="8 6"/><text class="svg-label" x="630" y="265">voyant bas</text>';
    body += '<path class="oil-line" d="M75 92 H245" marker-end="url(#arrow)"/><text class="svg-small" x="82" y="72">huile séparée</text>';
    body += '<path class="oil-line" d="M360 345 V378" marker-end="url(#arrow)"/><text class="svg-small" x="385" y="376">vers régulateurs</text>';
    body += '<path class="pipe-thin" d="M360 35 V15 H565" marker-end="url(#arrow)"/><text class="svg-small" x="505" y="38">pression contrôlée</text>';
    body += '<text class="svg-title" x="360" y="78" text-anchor="middle">RÉSERVE TAMPON</text>';
    body += '<text class="svg-label" x="360" y="108" text-anchor="middle">lire une évolution, pas une couleur</text>';
    return svg(v.label, body);
  }

  function visualDifferential(v) {
    var body = arrowMarker();
    body += component(35, 125, 190, 135, "RÉSERVOIR", "pression d’huile", "vessel");
    body += component(495, 125, 190, 135, "ASPIRATION", "pression carter", "component");
    body += '<path class="pipe-thin" d="M225 190 H295"/><path class="pipe-thin" d="M425 190 H495"/>';
    body += '<rect class="warn-shape" x="295" y="105" width="130" height="170" rx="18"/><path d="M320 150 H400 L320 230 H400" fill="none" stroke="#1b3a63" stroke-width="7"/><circle cx="360" cy="190" r="18" fill="#ff6b35" stroke="#c9451a" stroke-width="3"/>';
    body += '<text class="svg-title" x="360" y="75" text-anchor="middle">CLAPET TARÉ</text><text class="svg-label" x="360" y="315" text-anchor="middle">maintient un différentiel prévu</text><text class="svg-small" x="360" y="342" text-anchor="middle">la notice fixe le modèle et le réglage</text>';
    return svg(v.label, body);
  }

  function visualMechanical(v) {
    var body = arrowMarker();
    body += '<path class="vessel" d="M205 55 H515 V335 H205 Z"/>';
    body += '<rect x="225" y="220" width="270" height="95" rx="10" fill="#d69a16" opacity=".76"/>';
    body += '<circle cx="350" cy="225" r="38" fill="#fff" stroke="#1b3a63" stroke-width="5"/><path d="M388 225 H445 V145" fill="none" stroke="#1b3a63" stroke-width="6"/>';
    body += '<path class="oil-line" d="M80 145 H300" marker-end="url(#arrow)"/><circle cx="445" cy="145" r="16" fill="#ff6b35" stroke="#c9451a" stroke-width="4"/>';
    body += '<text class="svg-title" x="360" y="95" text-anchor="middle">RÉGULATEUR MÉCANIQUE AC&amp;R</text><text class="svg-label" x="360" y="125" text-anchor="middle">le flotteur commande un pointeau</text>';
    body += '<text class="svg-small" x="360" y="365" text-anchor="middle">Fonction : ajouter l’huile manquante au carter, pas retirer un excès.</text>';
    return svg(v.label, body);
  }

  function visualOilLine(v) {
    var body = arrowMarker();
    body += component(18, 135, 135, 100, "RÉSERVOIR", "huile disponible", "vessel");
    body += '<path class="oil-line" d="M153 185 H205" marker-end="url(#arrow)"/>';
    body += organe(205, 140, 96, 92, libraryShutoffValve, "VANNE", "ouverte");
    body += '<path class="oil-line" d="M300 185 H350" marker-end="url(#arrow)"/>';
    body += organe(350, 140, 96, 92, libraryCartridgeFilter, "FILTRE", "propre", "warn-shape");
    body += '<path class="oil-line" d="M445 185 H495" marker-end="url(#arrow)"/>';
    body += component(495, 135, 120, 100, "RÉGULATEUR", "niveau demandé", "good-shape");
    body += '<path class="oil-line" d="M615 185 H690" marker-end="url(#arrow)"/>';
    body += '<text class="svg-title" x="360" y="65" text-anchor="middle">SUIVRE L’HUILE DE L’AMONT VERS L’AVAL</text>';
    body += '<text class="svg-label" x="360" y="95" text-anchor="middle">niveau · pression · ouverture · filtration · commande</text>';
    body += '<text class="svg-title" x="360" y="310" text-anchor="middle">UN SEUL MAILLON BLOQUÉ = CARTER MAL ALIMENTÉ</text>';
    body += '<text class="svg-small" x="360" y="340" text-anchor="middle">Mesurer avant de remplacer le régulateur.</text>';
    return svg(v.label, body);
  }

  function visualTraxOil(v) {
    var body = arrowMarker();
    body += '<rect class="component" x="175" y="55" width="370" height="280" rx="44"/><circle cx="325" cy="220" r="78" fill="#fff" stroke="#1b3a63" stroke-width="6"/><path d="M260 238 Q325 275 390 238 V278 Q325 310 260 278 Z" fill="#d69a16"/>';
    body += '<rect class="accent" x="405" y="85" width="105" height="105" rx="16"/><circle cx="432" cy="115" r="9" fill="#1e7e54"/><circle cx="458" cy="115" r="9" fill="#b06a00"/><circle cx="484" cy="115" r="9" fill="#c0392b"/>';
    body += '<path class="oil-line" d="M60 165 H175" marker-end="url(#arrow)"/><rect x="115" y="135" width="46" height="60" rx="8" fill="#f3f7fb" stroke="#1b3a63" stroke-width="4"/>';
    body += '<text class="svg-title" x="360" y="45" text-anchor="middle">TRAXOIL : MESURER · ALIMENTER · ALARMER</text>';
    body += '<text class="svg-label" x="457" y="145" text-anchor="middle">capteur</text><text class="svg-small" x="457" y="165" text-anchor="middle">+ commande</text><text class="svg-label" x="110" y="225" text-anchor="middle">électrovanne</text>';
    body += '<text class="svg-small" x="360" y="365" text-anchor="middle">Les états lumineux et temporisations se lisent dans la notice du modèle.</text>';
    return svg(v.label, body);
  }

  function visualLevelZones(v) {
    var body = arrowMarker();
    body += '<rect class="component" x="60" y="45" width="270" height="300" rx="38"/>';
    body += '<circle cx="195" cy="195" r="100" fill="#fff" stroke="#1b3a63" stroke-width="6"/>';
    body += '<path d="M110 165 H280" stroke="#1e7e54" stroke-width="38" opacity=".35"/><path d="M110 215 H280" stroke="#b06a00" stroke-width="38" opacity=".35" stroke-dasharray="7 5"/><path d="M120 265 H270" stroke="#c0392b" stroke-width="38" opacity=".28" stroke-dasharray="15 7"/>';
    body += '<text class="svg-label" x="195" y="170" text-anchor="middle">NIVEAU NORMAL</text><text class="svg-label" x="195" y="220" text-anchor="middle">INJECTION</text><text class="svg-label" x="195" y="270" text-anchor="middle">ALARME BASSE</text>';
    body += component(405, 65, 250, 70, "1 · MESURER", "capteur + flotteur magnétique", "component");
    body += component(405, 160, 250, 70, "2 · ALIMENTER", "électrovanne intégrée", "good-shape");
    body += component(405, 255, 250, 70, "3 · PROTÉGER", "contact d’alarme ou arrêt", "warn-shape");
    body += '<text class="svg-small" x="360" y="380" text-anchor="middle">Seuils, couleurs et temporisations dépendent du modèle : lire sa notice.</text>';
    return svg(v.label, body);
  }

  function visualBpHp(v) {
    var body = arrowMarker();
    body += '<line x1="360" y1="45" x2="360" y2="352" stroke="#aab8c8" stroke-width="2" stroke-dasharray="8 8"/>';
    body += '<text class="svg-title" x="180" y="38" text-anchor="middle">RÉSERVOIR BASSE PRESSION</text>';
    body += organe(35, 78, 112, 96, libraryOilSeparator, "SÉPARATEUR", "refoulement");
    body += '<path class="oil-line" d="M90 163 V215 H165" marker-end="url(#arrow)"/>';
    body += component(165, 180, 115, 78, "RÉSERVOIR", "dégazage", "vessel");
    body += '<path class="oil-line" d="M222 258 V315 H305" marker-end="url(#arrow)"/>';
    body += component(250, 285, 92, 62, "RÉGUL.", "carter", "good-shape");
    body += '<path class="pipe-thin" d="M280 200 H330 V125" marker-end="url(#arrow)"/><text class="svg-small" x="265" y="110">Δp vers aspiration</text>';
    body += '<text class="svg-title" x="540" y="38" text-anchor="middle">RÉSERVOIR HAUTE PRESSION</text>';
    body += organe(405, 78, 122, 108, libraryOilSeparator, "SÉPARATEUR", "+ réserve HP");
    body += '<path class="oil-line" d="M465 180 V220 H545" marker-end="url(#arrow)"/>';
    body += organe(545, 184, 82, 78, libraryCartridgeFilter, "FILTRE", "huile", "warn-shape");
    body += '<path class="oil-line" d="M585 252 V300 H675" marker-end="url(#arrow)"/>';
    body += organe(610, 264, 96, 90, librarySolenoidValve, "ÉLECTRO.", "compatible Δp", "good-shape");
    body += '<text class="svg-small" x="540" y="370" text-anchor="middle">Détente au carter : risque d’émulsion, débit limité selon la notice.</text>';
    return svg(v.label, body);
  }

  function visualDiagnostic(v) {
    var body = arrowMarker();
    body += organe(20, 140, 146, 100, librarySightGlass, "VOYANT", "niveau observé");
    body += '<path d="M165 190 H205" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += organe(205, 138, 146, 104, libraryOilSeparator, "SÉPARATEUR", "retour et fuites");
    body += '<path d="M350 190 H390" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(390, 145, 145, 90, "RÉSERVOIR", "niveau + pression", "component");
    body += '<path d="M535 190 H575" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(575, 145, 125, 90, "RÉGULATEUR", "état + alimentation", "good-shape");
    body += '<text class="svg-title" x="360" y="80" text-anchor="middle">UN INDICE NE SUFFIT PAS</text><text class="svg-label" x="360" y="110" text-anchor="middle">croiser niveau, régime, pressions et état des organes</text>';
    body += '<text class="svg-title" x="360" y="315" text-anchor="middle">MESURER → INTERPRÉTER → DÉCIDER</text>';
    return svg(v.label, body);
  }

  function visualOilPressurePrinciple(v) {
    var body = arrowMarker();
    body += component(30, 105, 210, 135, "P1 · OIL", "sortie de pompe à huile", "good-shape");
    body += component(480, 105, 210, 135, "P2 · LP", "carter ou aspiration", "component");
    body += '<path d="M240 172 H300" stroke="#1e7e54" stroke-width="5" marker-end="url(#arrow)"/><path d="M480 172 H420" stroke="#3d7fca" stroke-width="5" marker-end="url(#arrow)"/>';
    body += '<rect class="warn-shape" x="300" y="112" width="120" height="120" rx="20"/>';
    body += '<text class="svg-title" x="360" y="158" text-anchor="middle">Δp HUILE</text><text class="svg-title" x="360" y="195" text-anchor="middle">P1 − P2</text>';
    body += '<text class="svg-title" x="360" y="55" text-anchor="middle">LA PRESSION NETTE DE LUBRIFICATION EST UNE DIFFÉRENCE</text>';
    body += '<text class="svg-label" x="360" y="292" text-anchor="middle">Mesurer les deux pressions au même régime.</text>';
    body += '<text class="svg-small" x="360" y="326" text-anchor="middle">Comparer ensuite le résultat au seuil de la notice du compresseur et du contrôle.</text>';
    return svg(v.label, body);
  }

  function visualOilPressureTimer(v) {
    var body = arrowMarker();
    body += component(20, 130, 145, 105, "DÉMARRAGE", "pompe entraînée", "component");
    body += '<path d="M165 182 H215" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(215, 130, 145, 105, "TEMPORISER", "délai de la notice", "warn-shape");
    body += '<path d="M360 182 H410" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(410, 65, 285, 92, "Δp SUFFISANT", "la temporisation s’arrête", "good-shape");
    body += component(410, 220, 285, 92, "Δp TROP FAIBLE", "le défaut persiste : arrêt", "warn-shape");
    body += '<path d="M385 182 V111 H410" fill="none" stroke="#1e7e54" stroke-width="4" marker-end="url(#arrow)"/><path d="M385 182 V266 H410" fill="none" stroke="#c9451a" stroke-width="4" stroke-dasharray="9 6" marker-end="url(#arrow)"/>';
    body += '<text class="svg-title" x="360" y="38" text-anchor="middle">LE DÉLAI AUTORISE LA MONTÉE EN PRESSION, PAS LE DÉFAUT PERMANENT</text>';
    body += '<text class="svg-small" x="360" y="355" text-anchor="middle">La durée et le mode de réarmement dépendent du modèle : ne pas les improviser.</text>';
    return svg(v.label, body);
  }

  function visualOilPressureSafety(v) {
    var body = arrowMarker();
    body += '<rect class="accent" x="28" y="118" width="145" height="125" rx="16"/>';
    body += libraryCompressor(50, 135, 100, 78, "Compresseur de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="100" y="228" text-anchor="middle">COMPRESSEUR</text>';
    body += '<path d="M173 180 H250" stroke="#1b3a63" stroke-width="5" marker-end="url(#arrow)"/>';
    body += '<rect class="component" x="250" y="95" width="190" height="175" rx="18"/>';
    body += libraryPressureSwitch(292, 118, 110, 118, "Pressostat validé de la bibliothèque technique inerWeb");
    body += '<text class="svg-label" x="345" y="252" text-anchor="middle">PRESSOSTAT</text>';
    body += '<path d="M440 180 H500" stroke="#1b3a63" stroke-width="5" marker-end="url(#arrow)"/>';
    body += component(500, 118, 175, 125, "CHAÎNE DE SÉCURITÉ", "contacteur ou automate", "warn-shape");
    body += '<text class="svg-title" x="360" y="55" text-anchor="middle">LE CONTACT DE SÉCURITÉ AGIT SUR LA COMMANDE DU COMPRESSEUR</text>';
    body += '<text class="svg-small" x="360" y="325" text-anchor="middle">Bornes, tension, signalisation et réarmement : suivre le schéma exact du modèle.</text>';
    return svg(v.label, body);
  }

  function visualOilPressureDiagnostic(v) {
    var body = arrowMarker();
    body += component(15, 135, 125, 100, "NIVEAU", "huile visible", "component");
    body += '<path d="M140 185 H170" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(170, 135, 125, 100, "P1 / P2", "mesures simultanées", "component");
    body += '<path d="M295 185 H325" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += organe(325, 130, 126, 110, libraryPump, "POMPE", "entraînement · usure");
    body += '<path d="M450 185 H480" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(480, 135, 105, 100, "HUILE", "mousse · dilution", "warn-shape");
    body += '<path d="M585 185 H615" stroke="#c9451a" stroke-width="4" marker-end="url(#arrow)"/>';
    body += component(615, 135, 90, 100, "DÉCIDER", "notice", "good-shape");
    body += '<text class="svg-title" x="360" y="62" text-anchor="middle">UN DÉCLENCHEMENT EST UN FAIT À EXPLIQUER</text>';
    body += '<text class="svg-label" x="360" y="95" text-anchor="middle">niveau + pressions + temps + état mécanique + huile</text>';
    body += '<text class="svg-title" x="360" y="300" text-anchor="middle">NE PAS RÉARMER EN BOUCLE</text>';
    body += '<text class="svg-small" x="360" y="332" text-anchor="middle">Identifier la cause avant de rendre la marche au compresseur.</text>';
    return svg(v.label, body);
  }

  function visualOilPressureClaudeSlot(v) {
    return '<iframe class="claude-pressostat-frame" src="assets/claude-pressostat/index.html?v=20260819a" title="' + esc(v.label) + '"></iframe>' +
      '<p class="sr-only">Deux soufflets opposent la pression de sortie de pompe à la pression du carter. Si le différentiel reste trop faible, T1–T2 alimente une résistance. Après la temporisation du modèle, le bilame ouvre L–M et arrête le compresseur.</p>';
  }

  function visualOilRiserClaudeSlot(v) {
    return '<iframe class="claude-retour-huile-frame" src="assets/claude-retour-huile/index.html?v=20260819b" title="' + esc(v.label) + '"></iframe>' +
      '<p class="sr-only">Le gaz aspiré entraîne l’huile depuis l’évaporateur, franchit le siphon en pied de colonne, monte la colonne verticale puis passe le contre-siphon avant le compresseur. La vitesse se calcule en divisant le débit aspiré par la section de passage. Sous le repère d’entraînement, l’huile retombe et s’accumule au point bas.</p>';
  }

  function visualOilReturnFilmSlot(v) {
    return '<iframe class="claude-retour-huile-film-frame" src="assets/claude-retour-huile-film/index.html?v=20260819b" title="' + esc(v.label) + '"></iframe>' +
      '<p class="sr-only">Onze scènes commandées par l’élève suivent l’huile depuis le carter dans le circuit frigorifique, puis expliquent les points bas, la vitesse du gaz, le siphon, le contre-siphon, la charge réduite, la double colonne et le compromis entre section et perte de charge.</p>';
  }

  function visualEclatementFilmSlot(v) {
    return '<iframe class="claude-eclatement-frame" src="assets/claude-eclatement/index.html?v=20260820b" title="' + esc(v.label) + '"></iframe>' +
      '<p class="sr-only">Huit scènes commandées par l’élève. Le gaz de refoulement entre par une buse de petite section, à grande vitesse, et frappe une plaque de choc placée en face. Les gouttes d’huile s’y écrasent et s’y rassemblent pendant que le gaz change de direction vers la sortie haute. Dans le corps, la section s’ouvre et la vitesse s’effondre : l’huile, bien plus dense, ne suit plus. Elle ruisselle sur la plaque et la paroi, s’accumule au fond, puis un flotteur commande un pointeau qui la renvoie vers le carter. Le brouillard le plus fin traverse : le rendement reste inférieur à celui d’un séparateur à coalescence.</p>';
  }
  function visualQuiz(v, question) {
    var code = question && question.code ? question.code : moduleData.codes.join(" · ");
    var body = '<circle class="accent pulse" cx="150" cy="190" r="92"/><text x="150" y="225" text-anchor="middle" fill="#c9451a" font-family="Trebuchet MS, sans-serif" font-size="104" font-weight="900">?</text>';
    body += component(300, 70, 355, 78, "ENTRAÎNEMENT", "question possible, jamais sujet officiel", "warn-shape");
    body += component(300, 175, 355, 78, "RÉFÉRENTIEL", code, "component");
    body += component(300, 280, 355, 62, "MÉTHODE", "observer · expliquer · vérifier", "good-shape");
    return svg(v.label || "Entraînement de fin de module", body);
  }

  function renderVisual(v, question) {
    var visual = v || { kind: "quiz", label: "Schéma pédagogique" };
    var map = {
      loop: visualLoop,
      roles: visualRoles,
      families: visualFamilies,
      triple: visualTriple,
      viscosity: visualViscosity,
      moisture: visualMoisture,
      label: visualLabel,
      oilCircuit: visualOilCircuit,
      oilFunctions: visualOilFunctions,
      oilJourney: visualOilJourney,
      oilFamiliesHydrocarbon: visualOilFamiliesHydrocarbon,
      oilFamiliesSynthetic: visualOilFamiliesSynthetic,
      oilCompatibility: visualOilCompatibility,
      oilSelection: visualOilSelection,
      oilMixing: visualOilMixing,
      oilIsoVg: visualOilIsoVg,
      oilViscosityTemperature: visualOilViscosityTemperature,
      oilMoisture: visualOilMoisture,
      oilAcidTest: visualOilAcidTest,
      route: visualRoute,
      drivers: visualDrivers,
      slope: visualSlope,
      riser: visualRiser,
      partload: visualPartLoad,
      natural: visualNaturalCircuit,
      timeline: visualTimeline,
      observe: visualObserve,
      decision: visualDecision,
      active: visualActive,
      separator: visualSeparator,
      separatorMethods: visualSeparatorMethods,
      floatReturn: visualFloatReturn,
      receiver: visualReceiver,
      reservoirLevels: visualReservoirLevels,
      differential: visualDifferential,
      mechanical: visualMechanical,
      oilLine: visualOilLine,
      traxoil: visualTraxOil,
      levelZones: visualLevelZones,
      bpHp: visualBpHp,
      diagnostic: visualDiagnostic,
      oilPressurePrinciple: visualOilPressurePrinciple,
      oilPressureTimer: visualOilPressureTimer,
      oilPressureSafety: visualOilPressureSafety,
      oilPressureDiagnostic: visualOilPressureDiagnostic,
      oilPressureClaudeSlot: visualOilPressureClaudeSlot,
      oilRiserClaudeSlot: visualOilRiserClaudeSlot,
      oilReturnFilmSlot: visualOilReturnFilmSlot,
      eclatementFilmSlot: visualEclatementFilmSlot,
      quiz: function (item) { return visualQuiz(item, question); }
    };
    return (map[visual.kind] || visualQuiz)(visual);
  }

  function takeawayBox(lesson) {
    var box = lesson.box || { type: "key", text: lesson.takeaway || "" };
    var cls = box.type === "warning" ? "warning-box" : box.type === "exam" ? "exam-box" : "key-box";
    var label = box.type === "warning" ? "LE PIÈGE" : box.type === "exam" ? "POUR L’HABILITATION" : "LA CLÉ";
    return '<div class="' + cls + '"><strong>' + label + " · </strong>" + inline(box.text) + "</div>";
  }

  function renderStations() {
    var lessonButtons = moduleData.lessons.map(function (lesson, index) {
      var active = state.phase === "lesson" && state.lesson === index;
      var done = state.done.has("l" + index);
      return '<button type="button" class="station-button ' + (active ? "active " : "") + (done ? "done" : "") + '" data-lesson="' + index + '" aria-label="Station ' + (index + 1) + " : " + esc(lesson.short) + '"' + (active ? ' aria-current="step"' : "") + '><span>' + (index + 1) + "</span><strong>" + esc(lesson.short) + "</strong></button>";
    }).join("");
    var quizActive = state.phase === "quiz" || state.phase === "summary";
    ui.stations.innerHTML = lessonButtons + '<button type="button" class="station-button quiz ' + (quizActive ? "active" : "") + '" data-quiz="1" aria-label="Station finale : questions d’habilitation"' + (quizActive ? ' aria-current="step"' : "") + '><span>Q</span><strong>Questions</strong></button>';
    Array.prototype.forEach.call(ui.stations.querySelectorAll("[data-lesson]"), function (button) {
      button.addEventListener("click", function () {
        stopSpeech();
        state.phase = "lesson";
        state.lesson = Number(button.dataset.lesson);
        render();
      });
    });
    var quizButton = ui.stations.querySelector("[data-quiz]");
    quizButton.addEventListener("click", function () {
      stopSpeech();
      state.phase = state.phase === "summary" ? "summary" : "quiz";
      render();
    });
  }

  function renderLesson() {
    var lesson = moduleData.lessons[state.lesson];
    ui.lessonCard.classList.remove("quiz-mode", "summary-mode");
    var details = (lesson.details || []).map(function (item) { return "<p>" + inline(item) + "</p>"; }).join("");
    ui.lessonCard.innerHTML = '<section class="copy-panel"><div class="kicker">' + esc(lesson.kicker || ("Station " + (state.lesson + 1))) + "</div>" +
      (lesson.recall ? '<span class="recall-badge">↶ Rappel spiralé</span>' : "") +
      '<h1>' + esc(lesson.title) + '</h1><p class="lead">' + inline(lesson.lead) + '</p><div class="details">' + details + "</div>" + takeawayBox(lesson) + "</section>" +
      '<section class="visual-panel"><h2>' + esc(lesson.visual.title) + '</h2><div class="visual-stage">' + renderVisual(lesson.visual) + '</div><p class="visual-caption">' + esc(lesson.visual.caption || "Schéma original inerWeb. Le texte de gauche porte la même information.") + "</p></section>";
    ui.previous.disabled = state.lesson === 0;
    ui.next.disabled = false;
    ui.next.textContent = state.lesson === moduleData.lessons.length - 1 ? "Passer aux questions →" : "Continuer →";
    ui.status.textContent = "Station " + (state.lesson + 1) + " sur " + moduleData.lessons.length;
  }

  function renderQuiz() {
    var q = moduleData.quiz[state.quiz];
    ui.lessonCard.classList.remove("summary-mode");
    ui.lessonCard.classList.add("quiz-mode");
    var savedAnswer = state.answers[state.quiz];
    state.answered = savedAnswer !== undefined;
    var options = q.options.map(function (option, index) {
      return '<button type="button" class="option-button" data-answer="' + index + '"><span>' + String.fromCharCode(65 + index) + "</span>" + esc(option) + "</button>";
    }).join("");
    ui.lessonCard.innerHTML = '<section class="copy-panel"><div class="kicker">Questions d’habilitation · ' + (state.quiz + 1) + " / " + moduleData.quiz.length + '</div><span class="recall-badge">Entraînement — jamais un sujet officiel</span><h1>' + esc(q.prompt) + '</h1><div class="option-list">' + options + '</div><div class="feedback" id="quiz-feedback" aria-live="polite"></div><div class="exam-box"><strong>COMPÉTENCE · </strong>' + esc(q.code || moduleData.codes.join(" · ")) + "</div></section>" +
      '<section class="visual-panel"><h2>Question possible à l’évaluation</h2><div class="visual-stage">' + renderVisual({ kind: "quiz", label: "Question d’entraînement reliée au référentiel" }, q) + '</div><p class="visual-caption">La formulation est pédagogique. Seul le référentiel officiel fixe la compétence évaluée.</p></section>';
    ui.previous.disabled = state.quiz === 0;
    ui.next.disabled = true;
    ui.next.textContent = state.quiz === moduleData.quiz.length - 1 ? "Voir le bilan →" : "Question suivante →";
    ui.status.textContent = "Question " + (state.quiz + 1) + " sur " + moduleData.quiz.length + " · score " + state.score;
    Array.prototype.forEach.call(ui.lessonCard.querySelectorAll("[data-answer]"), function (button) {
      button.addEventListener("click", answerQuiz);
    });
    if (state.answered) showQuizAnswer(q, savedAnswer, false);
  }

  function showQuizAnswer(q, picked, shouldAnnounce) {
    var good = picked === q.correct;
    Array.prototype.forEach.call(ui.lessonCard.querySelectorAll("[data-answer]"), function (button) {
      button.disabled = true;
      var index = Number(button.dataset.answer);
      if (index === q.correct) {
        button.classList.add("correct");
        button.setAttribute("aria-label", "Réponse correcte : " + button.textContent);
      } else if (index === picked) {
        button.classList.add("wrong");
        button.setAttribute("aria-label", "Réponse à revoir : " + button.textContent);
      }
    });
    var feedback = document.getElementById("quiz-feedback");
    feedback.className = "feedback show " + (good ? "good" : "bad");
    feedback.innerHTML = "<strong>" + (good ? "Correct." : "À revoir.") + "</strong> " + inline(q.why);
    ui.next.disabled = false;
    ui.status.textContent = "Question " + (state.quiz + 1) + " sur " + moduleData.quiz.length + " · score " + state.score;
    if (shouldAnnounce) announce(good ? "Réponse correcte." : "Réponse à revoir.");
  }

  function answerQuiz(event) {
    if (state.answered) return;
    state.answered = true;
    var q = moduleData.quiz[state.quiz];
    var picked = Number(event.currentTarget.dataset.answer);
    state.answers[state.quiz] = picked;
    state.score = state.answers.reduce(function (total, answer, index) {
      return total + (answer === moduleData.quiz[index].correct ? 1 : 0);
    }, 0);
    showQuizAnswer(q, picked, true);
  }

  function renderSummary() {
    var total = moduleData.quiz.length;
    var strong = state.score >= Math.ceil(total * .7);
    ui.lessonCard.classList.remove("quiz-mode");
    ui.lessonCard.classList.add("summary-mode");
    var nextLink = moduleData.nextUrl ? '<a class="module-next-link" href="' + esc(moduleData.nextUrl) + '">' + esc(moduleData.nextLabel || "Ouvrir la station suivante") + ' <span aria-hidden="true">→</span></a>' : "";
    ui.lessonCard.innerHTML = '<section class="copy-panel"><div class="kicker">Bilan du module</div><div class="score-card"><div class="score-number">' + state.score + " / " + total + "</div><h1>" + (strong ? "Les repères essentiels sont en place." : "Une reprise ciblée sera utile.") + '</h1><p class="lead">Ce score est un entraînement. Il ne remplace ni l’épreuve officielle ni l’observation pratique.</p><div class="' + (strong ? "key-box" : "warning-box") + '"><strong>PROCHAINE ACTION · </strong>' + inline(moduleData.nextStep) + "</div>" + nextLink + '</div></section><section class="visual-panel"><h2>La ligne « Circuit d’huile » continue</h2><div class="visual-stage">' + renderVisual(moduleData.summaryVisual || { kind: "route", label: "Synthèse du module" }) + '</div><p class="visual-caption">Le module reste un brouillon jusqu’au bon à tirer métier et pédagogique.</p></section>';
    ui.previous.disabled = false;
    ui.next.disabled = false;
    ui.next.textContent = "Recommencer les questions";
    ui.status.textContent = "Bilan · " + state.score + " réponse(s) correcte(s) sur " + total;
  }

  function render() {
    stopSpeech();
    renderStations();
    if (state.phase === "lesson") renderLesson();
    else if (state.phase === "quiz") renderQuiz();
    else renderSummary();
  }

  function next() {
    stopSpeech();
    if (state.phase === "lesson") {
      state.done.add("l" + state.lesson);
      if (state.lesson < moduleData.lessons.length - 1) state.lesson++;
      else { state.phase = "quiz"; state.quiz = 0; state.score = 0; state.answers = []; }
    } else if (state.phase === "quiz") {
      if (!state.answered) return;
      if (state.quiz < moduleData.quiz.length - 1) state.quiz++;
      else state.phase = "summary";
    } else {
      state.phase = "quiz";
      state.quiz = 0;
      state.score = 0;
      state.answers = [];
    }
    render();
  }

  function previous() {
    stopSpeech();
    if (state.phase === "lesson") {
      if (state.lesson > 0) state.lesson--;
    } else if (state.phase === "quiz") {
      if (state.quiz > 0) state.quiz--;
      else { state.phase = "lesson"; state.lesson = moduleData.lessons.length - 1; }
    } else {
      state.phase = "quiz";
      state.quiz = moduleData.quiz.length - 1;
    }
    render();
  }

  function visibleSpeechText() {
    var copy = ui.lessonCard.querySelector(".copy-panel");
    return copy ? copy.innerText.replace(/\s+/g, " ").trim() : "";
  }

  function bestFrenchVoice() {
    var voices = hasSpeech() ? window.speechSynthesis.getVoices() : [];
    var french = voices.filter(function (voice) { return /^fr(-|_)/i.test(voice.lang || ""); });
    french.sort(function (a, b) {
      var aFr = /^fr-FR$/i.test(a.lang || "") ? 2 : 0;
      var bFr = /^fr-FR$/i.test(b.lang || "") ? 2 : 0;
      var aQuality = /(natural|neural|online|microsoft|google)/i.test(a.name || "") ? 1 : 0;
      var bQuality = /(natural|neural|online|microsoft|google)/i.test(b.name || "") ? 1 : 0;
      return (bFr + bQuality) - (aFr + aQuality);
    });
    return french[0] || voices[0] || null;
  }

  function hasSpeech() {
    return !!(window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function");
  }

  /* ── la voix fabriquée ──────────────────────────────────────────────
     Une station qui porte `voix: true` a ses MP3 dans voix/<genre>/<écran>.mp3.
     On les joue plutôt que de faire lire l'écran au navigateur : même voix
     partout, qualité constante, et rien à télécharger au vol. Si le fichier
     manque ou refuse de se lire, on retombe sur la voix du navigateur — le
     stagiaire n'est jamais laissé sans son. */
  var lecteur = null;

  function genreVoix() {
    try { return localStorage.getItem("huile_voix") === "feminine" ? "feminine" : "masculine"; }
    catch (err) { return "masculine"; }
  }

  function voixFabriquee() {
    if (!moduleData.voix || state.phase !== "lesson") return null;
    var lecon = moduleData.lessons[state.lesson];
    return lecon ? "voix/" + genreVoix() + "/" + lecon.id + ".mp3" : null;
  }

  function jouerFichier(src) {
    var run = ++state.speechRun;
    lecteur = new Audio(src);
    lecteur.playbackRate = Number(ui.rate.value || 0.95);
    lecteur.addEventListener("playing", function () {
      if (run !== state.speechRun) return;
      state.speaking = true; state.paused = false;
      ui.voice.textContent = "Ⅱ Pause";
    });
    lecteur.addEventListener("ended", function () {
      if (run !== state.speechRun) return;
      state.speaking = false; state.paused = false;
      ui.voice.textContent = "▶ Écouter";
    });
    lecteur.addEventListener("error", function () {
      if (run !== state.speechRun) return;
      /* Le fichier manque : on ne laisse pas l'écran muet. */
      lecteur = null;
      parlerNavigateur();
    });
    var promesse = lecteur.play();
    if (promesse && promesse.catch) promesse.catch(function () {
      if (run !== state.speechRun) return;
      lecteur = null;
      parlerNavigateur();
    });
  }

  function toggleSpeech() {
    if (state.speaking && !state.paused) {
      if (lecteur) { lecteur.pause(); state.paused = true; ui.voice.textContent = "▶ Reprendre"; return; }
    }
    if (state.speaking && state.paused && lecteur) {
      lecteur.play(); state.paused = false; ui.voice.textContent = "Ⅱ Pause"; return;
    }
    var fichier = voixFabriquee();
    if (fichier && !state.speaking) { stopSpeech(); jouerFichier(fichier); return; }
    parlerNavigateur();
  }

  function parlerNavigateur() {
    if (!hasSpeech()) {
      announce("La voix n’est pas disponible. Le texte écrit reste complet.");
      ui.voice.disabled = true;
      return;
    }
    if (state.speaking && !state.paused) {
      window.speechSynthesis.pause();
      state.paused = true;
      ui.voice.textContent = "▶ Reprendre";
      return;
    }
    if (state.speaking && state.paused) {
      window.speechSynthesis.resume();
      state.paused = false;
      ui.voice.textContent = "Ⅱ Pause";
      return;
    }
    stopSpeech();
    var run = ++state.speechRun;
    var utterance = new SpeechSynthesisUtterance(visibleSpeechText());
    utterance.lang = "fr-FR";
    utterance.rate = Number(ui.rate.value || .95);
    utterance.pitch = 1;
    var voice = bestFrenchVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = function () {
      if (run !== state.speechRun) return;
      state.speaking = true;
      state.paused = false;
      ui.voice.textContent = "Ⅱ Pause";
    };
    utterance.onend = function () {
      if (run !== state.speechRun) return;
      state.speaking = false;
      state.paused = false;
      ui.voice.textContent = "▶ Écouter";
    };
    utterance.onerror = function (event) {
      if (run !== state.speechRun || event.error === "canceled" || event.error === "interrupted") return;
      state.speaking = false;
      state.paused = false;
      ui.voice.textContent = "▶ Écouter";
      announce("Lecture vocale indisponible. Le texte écrit reste complet.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    state.speechRun++;
    state.speaking = false;
    state.paused = false;
    if (hasSpeech()) window.speechSynthesis.cancel();
    if (lecteur) { lecteur.pause(); lecteur = null; }
    if (ui.voice) ui.voice.textContent = "▶ Écouter";
  }

  function announce(message) {
    ui.live.textContent = "";
    window.setTimeout(function () { ui.live.textContent = message; }, 20);
  }

  function renderSources() {
    ui.dialogBody.innerHTML = '<p><strong>Statut :</strong> sources consultées pour construire un brouillon pédagogique. Les notices du matériel réel restent prioritaires.</p><ul>' + moduleData.sources.map(function (source) {
      return '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener">' + esc(source.title) + "</a> — " + esc(source.use) + "</li>";
    }).join("") + '</ul><p>Les tracés pédagogiques sont recomposés par inerWeb. Les organes disponibles utilisent les symboles de la bibliothèque technique : <a href="https://github.com/qelectrotech/qelectrotech-elements" target="_blank" rel="noopener">collection QElectroTech</a> (CC BY 3.0), adaptés par inerWeb — F. Henninot.</p>';
  }

  ui.title.textContent = moduleData.title;
  ui.subtitle.textContent = moduleData.subtitle;
  if (ui.lineHome) {
    ui.lineHome.href = "../circuit-huile-interactif/index.html";
    ui.lineHome.setAttribute("aria-label", "Retour à la ligne interactive Le circuit d’huile");
  }
  document.title = moduleData.title + " — inerWeb";
  renderSources();
  ui.previous.addEventListener("click", previous);
  ui.next.addEventListener("click", next);
  ui.voice.addEventListener("click", toggleSpeech);
  ui.stopVoice.addEventListener("click", stopSpeech);
  ui.rate.addEventListener("change", function () {
    if (lecteur) lecteur.playbackRate = Number(ui.rate.value || 0.95);
  });
  ui.sources.addEventListener("click", function () { ui.dialog.showModal(); });
  ui.dialogClose.addEventListener("click", function () { ui.dialog.close(); });
  document.addEventListener("keydown", function (event) {
    var interactive = /^(INPUT|SELECT|TEXTAREA|BUTTON|A)$/.test(document.activeElement && document.activeElement.tagName);
    if (interactive) return;
    if (event.key === "ArrowRight" && !ui.next.disabled) next();
    if (event.key === "ArrowLeft" && !ui.previous.disabled) previous();
    if (event.key === "Escape") stopSpeech();
  });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopSpeech(); });
  window.addEventListener("beforeunload", stopSpeech);
  if (hasSpeech()) window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener("voiceschanged", bestFrenchVoice);
  else if (!moduleData.voix) ui.voice.disabled = true;
  render();
})();
