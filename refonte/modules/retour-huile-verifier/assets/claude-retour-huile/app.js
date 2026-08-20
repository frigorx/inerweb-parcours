/* Colonne montante d'aspiration — adaptation hors ligne.
   Aucune dépendance : pas de React, pas de CDN, pas de réseau.
   Le mouvement attend un clic ; le verdict écrit donne la même information. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  /* Géométrie du tracé, en unités du viewBox 520 × 360.
     Évaporateur en bas à gauche, siphon en pied, colonne montante,
     contre-siphon en tête, compresseur en haut à droite. */
  var G = {
    sortieEvap: 122, yBas: 274,
    siphonG: 196, siphonBas: 308, siphonD: 260,
    xGrande: 260, xPetite: 352,
    yHaut: 48, xSommetD: 380, yCompresseur: 76, xCompresseur: 440
  };

  var DIAM_PETITE = 16;      // mm — petite montée de l'exercice

  var etat = { regime: 100, trace: "simple", d: 26, qvmax: 18, repere: 8 };

  var el = {
    pipes: document.getElementById("pipes"),
    oil: document.getElementById("oil-layer"),
    flow: document.getElementById("flow-layer"),
    annot: document.getElementById("annot-layer"),
    section: document.getElementById("out-section"),
    debit: document.getElementById("out-debit"),
    vitesse: document.getElementById("out-vitesse"),
    colonne: document.getElementById("out-colonne"),
    verdict: document.getElementById("verdict"),
    verdictText: document.getElementById("verdict-text"),
    equivalent: document.getElementById("equivalent"),
    motion: document.getElementById("toggle-motion")
  };

  /* ── calcul ────────────────────────────────────────────────────────── */

  function section(dmm) { return Math.PI * Math.pow(dmm / 1000, 2) / 4; }   // m²

  function calcule() {
    var qv = etat.qvmax * (etat.regime / 100) / 3600;            // m³/s
    var aGrande = section(etat.d);
    var aPetite = section(DIAM_PETITE);
    var r = { qv: qv, bouchon: false };

    if (etat.trace === "simple") {
      r.aire = aGrande;
      r.colonne = "Colonne unique";
    } else {
      var vEnsemble = qv / (aGrande + aPetite);
      // À faible vitesse l'huile s'accumule dans le siphon et scelle le pied
      // de la grande montée : tout le gaz emprunte alors la petite.
      if (etat.regime > 0 && vEnsemble < etat.repere) {
        r.aire = aPetite;
        r.bouchon = true;
        r.colonne = "Petite seule";
      } else {
        r.aire = aGrande + aPetite;
        r.colonne = "Les deux";
      }
    }
    r.v = r.aire > 0 ? qv / r.aire : 0;
    return r;
  }

  function verdictDe(r) {
    if (etat.regime === 0) {
      return {
        ton: "warn", mot: "À l’arrêt",
        texte: "Le gaz ne circule plus : plus rien n’entraîne l’huile. Dans les " +
               "configurations où il est prescrit, le contre-siphon limite un drainage " +
               "inverse pendant l’arrêt."
      };
    }
    if (r.v < etat.repere) {
      return {
        ton: "warn", mot: "Sous le repère choisi",
        texte: "Dans ce scénario d’exercice, l’huile est représentée en train de " +
               "retomber. Cela ne fixe pas un seuil universel : comparer la vitesse " +
               "calculée à la valeur prescrite pour l’installation réelle."
      };
    }
    return {
      ton: "good", mot: "Au-dessus du repère choisi",
      texte: r.bouchon
        ? "L’huile accumulée scelle le pied de la grande montée : tout le gaz passe par " +
          "la petite. La vitesse calculée remonte ; le dimensionnement réel reste à valider."
        : "Dans l’exercice, l’huile est montrée entraînée. Vérifier perte de charge, " +
          "régime minimal et notice du constructeur."
    };
  }

  /* ── dessin ────────────────────────────────────────────────────────── */

  function tube(d, largeur) {
    var mur = document.createElementNS(NS, "path");
    mur.setAttribute("class", "pipe-wall");
    mur.setAttribute("d", d);
    mur.setAttribute("stroke-width", largeur);
    var ame = document.createElementNS(NS, "path");
    ame.setAttribute("class", "pipe-bore");
    ame.setAttribute("d", d);
    ame.setAttribute("stroke-width", Math.max(2, largeur - 4));
    return [mur, ame];
  }

  function texte(x, y, contenu, classe, ancre) {
    var t = document.createElementNS(NS, "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("class", classe || "label");
    if (ancre) t.setAttribute("text-anchor", ancre);
    t.textContent = contenu;
    return t;
  }

  function vide(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  function largeurDe(dmm) { return Math.round(dmm / 2) + 2; }

  function dessinePipes() {
    vide(el.pipes);
    var lg = largeurDe(etat.d);

    var bas = "M" + G.sortieEvap + " " + G.yBas + " L" + G.siphonG + " " + G.yBas +
              " L" + G.siphonG + " " + G.siphonBas + " L" + G.siphonD + " " + G.siphonBas +
              " L" + G.siphonD + " " + G.yBas;
    var grande = "M" + G.xGrande + " " + G.yBas + " L" + G.xGrande + " " + G.yHaut;
    var tete = "M" + G.xGrande + " " + G.yHaut + " L" + G.xSommetD + " " + G.yHaut +
               " L" + G.xSommetD + " " + G.yCompresseur + " L" + G.xCompresseur + " " + G.yCompresseur;

    [bas, grande, tete].forEach(function (d) {
      tube(d, lg).forEach(function (n) { el.pipes.appendChild(n); });
    });

    if (etat.trace === "double") {
      var lien = "M" + G.xGrande + " " + G.yBas + " L" + G.xPetite + " " + G.yBas;
      var petite = "M" + G.xPetite + " " + G.yBas + " L" + G.xPetite + " " + G.yHaut;
      var lp = largeurDe(DIAM_PETITE);
      tube(lien, lg).forEach(function (n) { el.pipes.appendChild(n); });
      tube(petite, lp).forEach(function (n) { el.pipes.appendChild(n); });
    }
  }

  function dessineAnnotations(r) {
    vide(el.annot);
    el.annot.appendChild(texte(228, 336, "siphon en pied de colonne", "label-muted", "middle"));
    el.annot.appendChild(texte(G.xSommetD + 8, 34, "contre-siphon", "label-muted", "middle"));
    if (etat.trace === "double") {
      el.annot.appendChild(texte(G.xGrande - 12, 252, "grande", "label-muted", "end"));
      el.annot.appendChild(texte(G.xPetite + 12, 252, "petite", "label-muted", "start"));
    }
    if (r.bouchon) {
      el.annot.appendChild(texte(170, 200, "bouchon d’huile :", "label-strong", "middle"));
      el.annot.appendChild(texte(170, 216, "la grande est scellée", "label", "middle"));
    }
  }

  /* L'huile se dessine à l'intérieur du tube : même tracé, trait un peu plus
     mince que l'âme, de sorte qu'on lise le niveau et non une tache posée
     par-dessus la tuyauterie. */
  function veine(d, largeur) {
    var p = document.createElementNS(NS, "path");
    p.setAttribute("class", "oil-veine");
    p.setAttribute("stroke-width", largeur);
    p.setAttribute("stroke-linejoin", "round");
    p.setAttribute("d", d);
    return p;
  }

  function dessineHuile(r) {
    vide(el.oil);
    var interieur = Math.max(3, largeurDe(etat.d) - 4);

    // Réserve dans le siphon : d'autant plus haute que l'entraînement est faible.
    var remplissage = etat.regime === 0 ? 0.5
      : r.v >= etat.repere ? 0.22 : 0.72;
    var branche = remplissage * (G.siphonBas - G.yBas);
    el.oil.appendChild(veine(
      "M" + G.siphonG + " " + (G.siphonBas - branche) +
      " L" + G.siphonG + " " + G.siphonBas +
      " L" + G.siphonD + " " + G.siphonBas +
      " L" + G.siphonD + " " + (G.siphonBas - branche), interieur));

    // Bouchon qui obture le pied de la grande montée.
    if (r.bouchon) {
      el.oil.appendChild(veine(
        "M" + G.xGrande + " " + G.yBas + " L" + G.xGrande + " " + (G.yBas - 54), interieur));
    }

    // À l'arrêt, l'huile reste retenue derrière le point haut du contre-siphon.
    if (etat.regime === 0) {
      el.oil.appendChild(veine(
        "M" + (G.xSommetD - 34) + " " + G.yHaut +
        " L" + G.xSommetD + " " + G.yHaut +
        " L" + G.xSommetD + " " + G.yCompresseur, interieur));
    }
  }

  /* ── mouvement du gaz et de l'huile ────────────────────────────────── */

  var marqueurs = [];

  function prepareMouvement(r) {
    vide(el.flow);
    marqueurs = [];
    if (etat.regime === 0) return;

    var x = r.bouchon ? G.xPetite : G.xGrande;
    var monte = r.v >= etat.repere;
    var couleur = monte ? "gas" : "gas gas-slow";

    for (var i = 0; i < 6; i++) {
      var chevron = document.createElementNS(NS, "path");
      chevron.setAttribute("class", couleur + " marker");
      chevron.setAttribute("d", monte ? "M-9 7 L0 0 L9 7" : "M-9 0 L0 7 L9 0");
      el.flow.appendChild(chevron);
      marqueurs.push({ n: chevron, u: i / 6, x: x, monte: monte });
    }

    // En double colonne à pleine charge, les deux montées travaillent.
    if (etat.trace === "double" && !r.bouchon) {
      for (var j = 0; j < 5; j++) {
        var c2 = document.createElementNS(NS, "path");
        c2.setAttribute("class", couleur + " marker");
        c2.setAttribute("d", monte ? "M-7 6 L0 0 L7 6" : "M-7 0 L0 6 L7 0");
        el.flow.appendChild(c2);
        marqueurs.push({ n: c2, u: j / 5, x: G.xPetite, monte: monte });
      }
    }

    // Gouttes d'huile : elles suivent le gaz, ou retombent avec lui.
    for (var k = 0; k < 4; k++) {
      var goutte = document.createElementNS(NS, "ellipse");
      goutte.setAttribute("class", monte ? "oil marker" : "oil-soft marker");
      goutte.setAttribute("rx", 4.5);
      goutte.setAttribute("ry", 6);
      el.flow.appendChild(goutte);
      marqueurs.push({ n: goutte, u: (k + 0.5) / 4, x: x, monte: monte, goutte: true });
    }
    positionneMarqueurs();
  }

  var vitesseAnim = 0, derniere = 0, mouvement = false, animationFrame = 0;

  function positionneMarqueurs() {
    for (var i = 0; i < marqueurs.length; i++) {
      var m = marqueurs[i];
      var y = m.monte
        ? G.yBas - m.u * (G.yBas - G.yHaut)
        : G.yHaut + m.u * (G.yBas - G.yHaut);
      m.n.setAttribute("transform", "translate(" + m.x + " " + y + ")");
      var bord = Math.min(1, m.u * 8, (1 - m.u) * 8);
      m.n.setAttribute("opacity", m.goutte ? bord : bord * 0.9);
    }
  }

  function boucle(ts) {
    if (!mouvement) { derniere = 0; animationFrame = 0; return; }
    if (!derniere) derniere = ts;
    var dt = Math.min(0.05, (ts - derniere) / 1000);
    derniere = ts;

    for (var i = 0; i < marqueurs.length; i++) {
      var m = marqueurs[i];
      m.u = (m.u + dt * vitesseAnim + 1) % 1;
    }
    positionneMarqueurs();
    animationFrame = requestAnimationFrame(boucle);
  }

  /* ── mise à jour ───────────────────────────────────────────────────── */

  function rendu() {
    var r = calcule();
    var v = verdictDe(r);

    dessinePipes();
    dessineHuile(r);
    dessineAnnotations(r);
    prepareMouvement(r);

    // La vitesse calculée module seulement la représentation visuelle.
    vitesseAnim = etat.regime === 0 ? 0 : Math.max(0.05, Math.min(1.1, r.v / 20));

    el.section.innerHTML = (r.aire * 1e6).toFixed(0) + " <small>mm²</small>";
    el.debit.innerHTML = (r.qv * 3600).toFixed(1) + " <small>m³/h</small>";
    el.vitesse.innerHTML = r.v.toFixed(2) + " <small>m/s</small>";
    el.colonne.textContent = etat.regime === 0 ? "Aucune" : r.colonne;

    el.verdict.className = "verdict " + v.ton;
    el.verdict.firstElementChild.textContent = v.mot + " —";
    el.verdictText.textContent = v.texte;

    el.equivalent.textContent =
      "Régime " + etat.regime + " %, " +
      (etat.trace === "double" ? "double colonne" : "colonne simple") +
      ", diamètre intérieur " + etat.d + " mm, débit aspiré à pleine charge " +
      etat.qvmax + " mètres cubes par heure. Section de passage " +
      (r.aire * 1e6).toFixed(0) + " millimètres carrés, débit " +
      (r.qv * 3600).toFixed(1) + " mètres cubes par heure, vitesse du gaz " +
      r.v.toFixed(2) + " mètre par seconde, repère d'étude " + etat.repere +
      " mètres par seconde. " + v.mot + ". " + v.texte;
  }

  /* ── commandes ─────────────────────────────────────────────────────── */

  document.getElementById("regime").addEventListener("change", function (e) {
    etat.regime = Number(e.target.value); rendu();
  });
  document.getElementById("trace").addEventListener("change", function (e) {
    etat.trace = e.target.value; rendu();
  });

  document.getElementById("diam").addEventListener("change", function (e) {
    etat.d = Number(e.target.value); rendu();
  });
  document.getElementById("debit").addEventListener("change", function (e) {
    etat.qvmax = Number(e.target.value); rendu();
  });

  document.getElementById("repere").addEventListener("change", function (e) {
    etat.repere = Number(e.target.value); rendu();
  });

  el.motion.addEventListener("click", function () {
    mouvement = !mouvement;
    el.motion.setAttribute("aria-pressed", mouvement ? "true" : "false");
    el.motion.textContent = mouvement ? "Ⅱ Pause" : "▶ Animer";
    if (mouvement && !animationFrame) {
      derniere = 0;
      animationFrame = requestAnimationFrame(boucle);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && mouvement) el.motion.click();
  });

  rendu();
})();
