/* =====================================================================
   inerWeb Pilote — MOTEUR générique (vanilla JS, autonome / hors-ligne)
   Lit window.PILOTE_PACK et applique le MODE actif (matrice §3 du CDC).
   Options : window.PILOTE_MODE (mode forcé) · window.PILOTE_CONFIG.scoring_url
   Ne connaît ni le froid ni Fallout : tout le contenu vient du pack.
   ===================================================================== */
(function () {
  "use strict";
  var PACK = window.PILOTE_PACK;
  var CONFIG = window.PILOTE_CONFIG || {};
  if (!PACK) { document.body.innerHTML = "<p style='padding:24px'>Aucun pack chargé.</p>"; return; }

  /* --- Matrice de visibilité par mode (cf. cahier des charges) --- */
  var MODES = {
    auto:       { nom: "Auto-apprentissage", pilote:false, feedback:true,  remediation:true,  notation:false },
    pilotage:   { nom: "Pilotage formateur", pilote:true,  feedback:true,  remediation:false, notation:true  },
    test:       { nom: "Test blanc",         pilote:false, feedback:true,  remediation:true,  notation:false },
    evaluation: { nom: "Évaluation",         pilote:false, feedback:false, remediation:false, notation:true  }
  };
  /* Le mode Pilotage formateur s'ouvre avec le même code d'accès que les
     examens (empreinte djb2 portée par le pack — jamais de mot de passe en
     clair dans le dépôt). Vraie protection = build élève séparé, inchangé. */

  /* --- Index --- */
  var idxCartes = {}; PACK.cartes.forEach(function (c) { idxCartes[c.id] = c; });
  var idxRes = {}; (PACK.ressources || []).forEach(function (r) { idxRes[r.id] = r; });
  var BANQUE = PACK.banque || [];
  /* Extension pack fluides : dictionnaire des compétences du référentiel
     (injecté au build). Permet de NOMMER une compétence non acquise. */
  var COMP = PACK.competences || {};

  /* --- État de session --- */
  var forced = window.PILOTE_MODE && MODES[window.PILOTE_MODE] ? window.PILOTE_MODE : null;
  var S = {
    modeId: forced || (new URLSearchParams(location.search).get("mode")) || "auto",
    verrouMode: !!forced,            // formateur.html verrouille le mode
    carteId: PACK.pack.carte_initiale,
    historique: [], criteres: {}, reponses: {},
    categorie: null,                 // catégorie d'aptitude visée (A1, A2, D, E)
    examen: null,                    // état d'un examen blanc en cours
    debut: nowSec(), chrono: null
  };
  if (!MODES[S.modeId]) S.modeId = "auto";

  var app = document.getElementById("app");
  render();

  /* ====================================================================
     RENDU
     ==================================================================== */
  function render() {
    // Une lecture à voix haute en cours ne doit jamais continuer sur la
    // carte suivante : on l'arrête avant même de savoir ce qu'on affiche.
    if (window.PiloteLecture) window.PiloteLecture.arreter();
    var m = MODES[S.modeId];
    var c = idxCartes[S.carteId];
    if (!c) { app.innerHTML = "<p style='padding:24px'>Carte introuvable.</p>"; return; }
    // Extension pack fluides : entrer par un menu de catégorie (A1, A2, D, E)
    // fixe le champ visé. Le référentiel n'exige pas les mêmes compétences
    // selon la catégorie — un candidat D n'a pas à réviser les compresseurs.
    if (c.categorie) S.categorie = c.categorie;
    if (c.type === "progression") return renderProgression(c, m);
    if (c.examen) return renderExamen(c, m);
    if (c.type === "accueil" || c.type === "menu") return renderAccueil(c, m);

    var html = barre(m) + fil() + "<div class='scene'><div class='carte'>";
    if (c.illus) html += img(c.illus);
    html += "<div class='corps'>";
    if (c.dc) html += "<span class='dc'>" + esc(c.dc) + "</span>";
    html += "<h1>" + esc(c.titre) + "</h1>";
    // Le bouton d'écoute : seulement si la carte a du texte à lire, et si
    // le navigateur sait parler (feature-detect dans lecture.js).
    if (c.corps && window.PiloteLecture && window.PiloteLecture.disponible())
      html += window.PiloteLecture.html();
    html += zoneCompetences(c); // l'objectif d'examen, annoncé avant le contenu
    if (c.corps) html += c.corps;
    (c.blocs || []).forEach(function (b) {
      html += "<div class='bloc " + (b.type || "") + "'><div class='t'>" + esc(b.t || "") + "</div>" + (b.html || "") + "</div>";
    });
    if (c.question) html += zoneQuestion(c.question, S.reponses[c.id], m, "rep");
    if (m.notation && c.criteres && c.criteres.length) html += zoneCriteres(c);
    if (m.pilote && c.notes_pilote) html += "<div class='pilote'><div class='t'>👁 NOTE PILOTE (formateur)</div>" + esc(c.notes_pilote) + "</div>";
    if (c.ressources && c.ressources.length) { html += "<div class='ressources'>"; c.ressources.forEach(function (rid) { html += lienRes(idxRes[rid]); }); html += "</div>"; }
    html += zoneLiens(c);
    html += "</div></div></div>" + pied(c) + voiles();

    app.innerHTML = html;
    brancher(c, m);
    if (window.PiloteLecture) window.PiloteLecture.brancher(app, c);
    lancerChrono(c);
    if (S.historique[S.historique.length - 1] !== c.id) S.historique.push(c.id);
  }

  /* ---- Page d'ACCUEIL / MENU (portail à tuiles) ---- */
  function renderAccueil(c, m) {
    var h = barre(m) + "<div class='accueil'>";
    h += "<div class='hero'>";
    if (c.illus) h += img(c.illus);
    h += "<div class='cap'><h1>" + esc(c.titre === "Accueil" ? PACK.pack.titre : c.titre) + "</h1>" + (c.corps || "") + "</div></div>";
    h += "<div class='sct'>" + esc(c.menu_titre || "Choisir une partie") + "</div><div class='tuiles'>";
    (c.liens || []).forEach(function (l) {
      if (!conditionVraie(l.condition)) return;
      var t = esc(l.titre || l.libelle), d = l.desc ? "<p>" + esc(l.desc) + "</p>" : "", ic = l.icone ? "<span class='ic'>" + esc(l.icone) + "</span>" : "";
      // une tuile mène soit à une carte du pack (`vers`), soit à une page du
      // site (`url`) — la galerie des planches, par exemple
      var cible = l.url ? "data-url='" + esc(l.url) + "'" : "data-go='" + l.vers + "'";
      if (l.primaire) h += "<div class='tuile primaire' role='button' tabindex='0' " + cible + ">" + ic + "<span class='txt'><h3>" + t + "</h3>" + d + "</span><span class='go'>Commencer ▸</span></div>";
      else h += "<div class='tuile' role='button' tabindex='0' " + cible + ">" + ic + "<h3>" + t + "</h3>" + d + "<span class='go'>" + (l.url ? "Ouvrir la page ▸" : "Ouvrir ▸") + "</span></div>";
    });
    h += "</div>";
    if (m.pilote && c.notes_pilote) h += "<div class='pilote' style='margin-top:18px'><div class='t'>👁 NOTE PILOTE</div>" + esc(c.notes_pilote) + "</div>";
    var globs = (PACK.ressources || []).filter(function (r) { return r.global; });
    if (globs.length) { h += "<div class='sct'>Ressources utiles</div><div class='ressources'>"; globs.forEach(function (r) { h += lienRes(r); }); h += "</div>"; }
    h += "</div>" + pied({}) + voiles();
    app.innerHTML = h; nav(); commun();
    if (S.historique[S.historique.length - 1] !== c.id) S.historique.push(c.id);
  }

  /* ---- Carte PROGRESSION (extension pack fluides) ----
     « Où j'en suis, compétence par compétence » — la vue qui manque à tout
     outil de préparation qui ne sait afficher qu'un score. Les états sont
     déduits des réponses données aux questions de la banque, qui portent
     chacune son code du référentiel. */
  function renderProgression(c, m) {
    var suivi = lireComp();
    var cat = S.categorie;
    var codes = Object.keys(COMP).filter(function (k) {
      if (!cat) return true;
      return COMP[k].cat && COMP[k].cat.indexOf(cat) >= 0;
    });
    codes.sort(function (a, b) {
      var na = parseFloat(a), nb = parseFloat(b);
      return na - nb || a.localeCompare(b);
    });

    var cpt = { acquis: 0, fragile: 0, revoir: 0, vierge: 0 };
    codes.forEach(function (k) { cpt[etatComp(suivi[k])]++; });
    var teste = cpt.acquis + cpt.fragile + cpt.revoir;

    var h = barre(m) + fil() + "<div class='scene'><div class='carte'><div class='corps'>";
    h += "<span class='dc'>" + esc(cat ? "Catégorie " + cat : "Toutes catégories") + "</span>";
    h += "<h1>" + esc(c.titre) + "</h1>";
    h += "<p>Voici où vous en êtes sur les <b>" + codes.length + " compétences</b> que l'examen peut " +
         "vous demander" + (cat ? " en catégorie <b>" + esc(cat) + "</b>" : "") + ". " +
         "Chaque question à laquelle vous répondez met cette page à jour. " +
         "<b>Tout reste dans votre navigateur</b> : rien n'est envoyé nulle part.</p>";

    h += "<div class='prog-resume'>" +
      pastille("acquis", cpt.acquis, "acquises") +
      pastille("fragile", cpt.fragile, "fragiles") +
      pastille("revoir", cpt.revoir, "à revoir") +
      pastille("vierge", cpt.vierge, "jamais testées") + "</div>";

    if (!teste)
      h += "<div class='bloc'><div class='t'>Par où commencer</div>Répondez à une série de " +
           "révision ou à un examen blanc : les compétences se coloreront au fur et à mesure.</div>";

    // regroupées par groupe du référentiel, dans l'ordre du programme
    var parGroupe = {}, ordre = [];
    codes.forEach(function (k) {
      var g = COMP[k].groupe || "?";
      if (!parGroupe[g]) { parGroupe[g] = []; ordre.push(g); }
      parGroupe[g].push(k);
    });
    ordre.sort(function (a, b) { return (parseInt(a.slice(1), 10) || 99) - (parseInt(b.slice(1), 10) || 99); });

    ordre.forEach(function (g) {
      h += "<div class='prog-groupe'><div class='gt'>" + esc(g) + " — " + esc(COMP[parGroupe[g][0]].groupe_titre || "") + "</div>";
      parGroupe[g].forEach(function (k) {
        var e = suivi[k], et = etatComp(e);
        var lib = COMP[k].libelle || COMP[k].officiel || k;
        h += "<div class='pc " + et + "'><span class='cd'>" + esc(k) + "</span>" +
             "<span class='lb'>" + esc(lib) + "</span>" +
             "<span class='st'>" + libelleEtat(et, e) + "</span></div>";
      });
      h += "</div>";
    });

    h += "<div class='liens'><button data-go='c00' class='sec'>↺ Sommaire</button>" +
         "<button id='prog-raz' class='sec'>Effacer ma progression</button></div>";
    h += "</div></div></div>" + pied({}) + voiles();

    app.innerHTML = h;
    nav(); commun();
    var b = document.getElementById("prog-raz");
    if (b) b.onclick = function () {
      if (confirm("Effacer votre progression ? Les compétences repasseront toutes en « jamais testée ».")) {
        effacerComp(); render();
      }
    };
    if (S.historique[S.historique.length - 1] !== c.id) S.historique.push(c.id);
  }
  function pastille(cls, n, lib) {
    return "<span class='pst " + cls + "'><b>" + n + "</b> " + esc(lib) + "</span>";
  }
  function libelleEtat(et, e) {
    if (et === "acquis") return "✅ acquise";
    if (et === "fragile") return "⚠️ fragile";
    if (et === "revoir") return "❌ à revoir";
    return "· jamais testée";
  }

  /* ---- Carte EXAMEN BLANC (séquence de questions tirées de la banque) ---- */
  /* Extension pack fluides n° 5 : portillon d'accès par code — un RIDEAU
     pédagogique assumé, pas un secret (le contenu reste dans la page pour
     qui lit le code source ; l'empreinte djb2 se force par essais).
     Une carte examen portant `acces.code_empreinte` demande le code une
     fois ; le déverrouillage est mémorisé sur l'appareil. Le code en clair
     n'existe nulle part dans le dépôt. Carte sans `acces` : comportement
     d'origine (r408 intact). */
  function empreinteCode(txt) {
    var h = 5381;
    for (var i = 0; i < txt.length; i++) h = (h * 33 + txt.charCodeAt(i)) >>> 0;
    return h;
  }
  /* DEUX NIVEAUX, DEUX SERRURES DISTINCTES (25/07)
     niveau 1 — code court : la console formateur, la projection, les documents.
                Public : direction et collègues. « Confidentiel sans être secret. »
     niveau 2 — la phrase : les examens. Public : le formateur, qui ouvre la
                porte en salle. Les séries de révision restent libres, pour
                qu'un stagiaire puisse réviser seul sans passer l'épreuve.
     Chaque niveau a sa propre clé de mémoire : déverrouiller les documents
     n'ouvre PAS les examens, et inversement. */
  function cleAcces(niveau) {
    return "pilote_acces" + (niveau === 2 ? "2" : "") + "_" + PACK.pack.id;
  }
  function accesOuvert(c) {
    if (!c.acces || !c.acces.code_empreinte) return true;
    try { return localStorage.getItem(cleAcces(c.acces.niveau)) === "oui"; }
    catch (e) { return false; }
  }
  function renderAcces(c, m) {
    var html = barre(m) + fil() + "<div class='scene'><div class='carte'><div class='corps'>";
    html += "<span class='dc'>" + esc(c.dc || "Examen") + "</span>";
    html += "<h1>" + esc(c.titre) + "</h1>";
    html += "<p>🔒 Cet examen s'ouvre avec la <b>phrase d'accès</b> donnée par le formateur.</p>";
    html += "<p style='color:var(--mut)'>Pour réviser seul, les séries « Réviser par thème » sont " +
            "libres : elles posent les mêmes questions, sans note.</p>";
    // Champ en saisie de texte libre, sans clavier numérique forcé ni
    // correction automatique : le code est une phrase en minuscules.
    html += "<p><input id='acces-code' type='text' autocomplete='off' spellcheck='false' ";
    html += "autocapitalize='none' autocorrect='off' ";
    html += "placeholder='La phrase d&#39;accès…' aria-label='Code d&#39;accès' ";
    html += "style='font-size:1.05em; padding:.5em .7em; width:min(100%, 24em); border:2px solid var(--bleu); border-radius:8px'> ";
    html += "<button id='acces-ok'>Ouvrir ▸</button></p>";
    html += "<p id='acces-err' style='display:none; font-weight:600'>Ce n'est pas le bon code. Vérifiez auprès du formateur.</p>";
    html += "<p style='color:var(--mut)'>Une fois le bon code saisi, cet appareil reste déverrouillé.</p>";
    html += "</div></div></div>" + pied({}) + voiles();
    app.innerHTML = html;
    nav();
    var champ = document.getElementById("acces-code");
    var verifier = function () {
      if (empreinteCode(champ.value.trim()) === c.acces.code_empreinte) {
        try { localStorage.setItem(cleAcces(c.acces.niveau), "oui"); } catch (e) {}
        render();
      } else {
        var err = document.getElementById("acces-err");
        err.style.display = "block";
        champ.select(); champ.focus();
      }
    };
    document.getElementById("acces-ok").onclick = verifier;
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") verifier(); });
    champ.focus();
  }

  function renderExamen(c, m) {
    if (!accesOuvert(c)) return renderAcces(c, m);
    if (!S.examen || S.examen.carteId !== c.id) initExamen(c);
    var ex = S.examen;
    var html = barre(m) + fil() + "<div class='scene'><div class='carte'><div class='corps'>";
    html += "<span class='dc'>" + esc(c.dc || "Examen blanc") + "</span>";
    html += "<h1>" + esc(c.titre) + "</h1>";

    // Extension pack fluides : une carte examen peut porter un `corps` de
    // présentation — le positionnement d'entrée s'annonce avant d'interroger
    // (« ce test ne compte pas »). Visible tant que la première question
    // n'est pas répondue, puis il s'efface devant les questions.
    if (c.corps && !ex.fini && ex.i === 0 && !ex.rep[0]) html += c.corps;

    if (!ex.fini) {
      var q = ex.items[ex.i];
      var rep = ex.rep[ex.i];
      html += "<p style='color:var(--mut)'>Question " + (ex.i + 1) + " / " + ex.items.length + "</p>";
      html += zoneQuestion(q, rep, m, "exr");
      if (rep) {
        var dernier = (ex.i === ex.items.length - 1);
        html += "<div class='liens'><button id='ex-next'>" + (dernier ? "Voir mon résultat ▸" : "Question suivante ▸") + "</button></div>";
      }
    } else {
      html += renderResultat(c, ex, m);
    }
    html += "</div></div></div>" + pied({}) + voiles();
    app.innerHTML = html;
    brancherExamen(c, m);
  }

  function initExamen(c) {
    // Extension pack fluides : composition FIXE par identifiants. Le
    // positionnement d'entrée pose à tous les stagiaires les MÊMES questions,
    // dans l'ordre écrit (les thèmes se suivent) — un tirage aléatoire ne
    // garantirait ni la répartition par thème, ni la comparabilité des
    // résultats. `examen.ids` absent → tirage d'origine, rien ne change.
    if (c.examen.ids) {
      var parId = {};
      BANQUE.forEach(function (q) { parId[q.id] = q; });
      var choisies = c.examen.ids.map(function (id) { return parId[id]; }).filter(Boolean);
      S.examen = { carteId: c.id, items: choisies, i: 0, rep: [], fini: false, score: null };
      return;
    }
    // Extension pack fluides : filtrage optionnel par niveau de difficulté.
    // `examen.niveau` absent → comportement d'origine ; question sans
    // `niveau` → éligible à tous les tirages. (Écart documenté avec r408.)
    var pool = BANQUE.filter(function (q) {
      if ((c.examen.dc || []).indexOf(q.dc) < 0) return false;
      if (c.examen.niveau && q.niveau && q.niveau !== c.examen.niveau) return false;
      return true;
    });
    // Extension pack fluides : filtrage par catégorie d'aptitude. Une question
    // sans `categories` reste servie à tous — c'est le cas des questions de
    // socle et de celles sur le CO₂ / NH₃, imposées en A1 et A2 par l'annexe
    // II.C alors même que leurs codes n'y sont pas évalués.
    if (S.categorie) {
      var cible = pool.filter(function (q) {
        return !q.categories || q.categories.indexOf(S.categorie) >= 0;
      });
      // Repli : mieux vaut un entraînement large qu'un examen tronqué.
      if (cible.length >= Math.min(c.examen.n || 6, pool.length)) pool = cible;
    }
    melange(pool);
    var n = Math.min(c.examen.n || 6, pool.length);
    S.examen = { carteId: c.id, items: pool.slice(0, n), i: 0, rep: [], fini: false, score: null };
  }

  function renderResultat(c, ex, m) {
    var bons = 0; ex.rep.forEach(function (r, i) { if (r && r.choix === ex.items[i].bonne) bons++; });
    var sur = ex.items.length;
    var pct = Math.round(100 * bons / sur);
    var seuil = c.examen.seuil || 70;
    var reussi = pct >= seuil;
    var h = "<div id='ex-result'>";
    if (m.feedback) {
      // Extension pack fluides (auto-formation) : mémoire du score précédent.
      if (ex.prevLu === undefined) { ex.prevLu = lireHist(c.id); ecrireHist(c.id, pct); }
      var evol = "";
      if (ex.prevLu !== null && ex.prevLu !== undefined) {
        var d = pct - ex.prevLu;
        evol = " <span style='color:var(--mut);font-weight:400'>· précédent : " + ex.prevLu + "%" +
               (d > 0 ? " — +" + d + " 📈" : d < 0 ? " — " + d : " — stable") + "</span>";
      }
      h += "<div class='retour " + (reussi ? "ok" : "ko") + "'><b>Score : " + bons + " / " + sur + " (" + pct + "%)</b> — seuil " + seuil + "%. " + (reussi ? "Réussi ✅" : "À retravailler.") + evol + "</div>";
      // Extension pack fluides : les COMPÉTENCES non acquises, nommées, puis
      // les fiches où les retravailler. Dire « revoyez la fiche G4 » n'apprend
      // rien ; dire quelle compétence de l'arrêté n'est pas tenue, si.
      var ratees = {}, aRevoir = {}, ratesHorsRef = 0;
      ex.rep.forEach(function (r, i) {
        var q = ex.items[i];
        if (!r || r.choix === q.bonne) return;
        if (q.code) ratees[q.code] = (ratees[q.code] || 0) + 1;
        else ratesHorsRef++;
        if (q.remediation_vers && idxCartes[q.remediation_vers]) aRevoir[q.remediation_vers] = true;
      });
      var codes = Object.keys(ratees).sort();
      if (codes.length) {
        h += "<div class='bilan-comp'><div class='t'>🎯 Compétences à retravailler</div>";
        codes.forEach(function (code) {
          var d = COMP[code] || {};
          h += "<div class='bc'><span class='code'>" + esc(code) + "</span>" +
               "<span class='lib'>" + esc(d.libelle || d.officiel || code) + "</span>" +
               (ratees[code] > 1 ? "<span class='n'>" + ratees[code] + " erreurs</span>" : "") + "</div>";
        });
        if (ratesHorsRef)
          h += "<div class='hr'>+ " + ratesHorsRef + " question(s) de culture métier, hors référentiel d'examen.</div>";
        h += "</div>";
      }
      var fiches = Object.keys(aRevoir);
      if (fiches.length) {
        h += "<div style='margin-top:12px;font-weight:700;color:var(--bleu)'>À revoir en priorité :</div><div class='liens'>";
        fiches.forEach(function (fid) { h += "<button class='sec' data-go='" + fid + "'>↩ " + esc(idxCartes[fid].titre) + "</button>"; });
        h += "</div>";
      }
    } else {
      // évaluation : on n'affiche pas le détail des bonnes réponses
      h += "<div class='retour ok'>Examen terminé. Tes réponses sont enregistrées.</div>";
      if (CONFIG.scoring_url) h += "<div id='srv' style='margin-top:10px;color:var(--mut);font-size:13px'>Correction côté serveur…</div>";
    }
    h += "<div class='liens'><button data-go='c00' class='sec'>↺ Retour au sommaire</button>" +
         "<button id='ex-trace'>⬇ Exporter ma trace</button></div></div>";
    ex.score = { bons: bons, sur: sur, pct: pct, reussi: reussi };
    return h;
  }

  /* ====================================================================
     COMPOSANTS
     ==================================================================== */
  function barre(m) {
    return "<div class='barre'><span class='logo'>inerWeb <b>Pilote</b></span>" +
      "<span class='pack-titre'>" + esc(PACK.pack.titre) + "</span><span class='spacer'></span>" +
      // Extension pack fluides : la catégorie visée, toujours visible et modifiable.
      (S.categorie ? "<button class='mode-tag' id='btn-cat' title='Catégorie d’aptitude visée'>Catégorie : " + esc(S.categorie) + " ▾</button>" : "") +
      "<button class='mode-tag' id='btn-mode'" + (S.verrouMode ? " disabled title='mode verrouillé'" : "") + ">Mode : " + esc(m.nom) + (S.verrouMode ? " 🔒" : " ▾") + "</button></div>";
  }

  /* Extension pack fluides : changer ou effacer la catégorie visée. */
  function menuCategorie() {
    var liste = PACK.pack.categories || [];
    var h = "<h3>Catégorie d'aptitude visée</h3><p style='color:var(--mut);font-size:13.5px'>" +
      "Les tirages ne vous serviront que les compétences exigées pour cette catégorie. " +
      "Les questions de socle et celles sur le CO₂ et l'ammoniac restent posées à tous.</p><div class='liens'>";
    liste.forEach(function (id) {
      h += "<button data-cat='" + id + "'" + (id === S.categorie ? " class='sec'" : "") + ">" + esc(id) + "</button>";
    });
    h += "<button class='sec' data-cat=''>Toutes catégories</button></div>";
    ouvrirVoile(h);
    onAll("[data-cat]", function (el) {
      el.addEventListener("click", function () {
        S.categorie = el.getAttribute("data-cat") || null;
        S.examen = null; fermerVoile(); render();
      });
    });
  }
  function fil() {
    if (!S.historique.length) return "<div class='fil'>Début du parcours</div>";
    var h = "<div class='fil'>";
    S.historique.slice(-5).forEach(function (id, i) {
      var c = idxCartes[id]; if (i) h += "<span class='sep'>›</span>";
      h += "<a data-go='" + id + "'>" + esc(c ? c.titre : id) + "</a>";
    });
    return h + "</div>";
  }
  function zoneQuestion(q, rep, m, ns) {
    var h = "<div class='question'><div class='enonce'>❓ " + esc(q.enonce) + "</div><div class='choix'>";
    q.choix.forEach(function (txt, i) {
      var cls = "";
      if (rep && m.feedback) { if (i === q.bonne) cls = "bon"; else if (i === rep.choix) cls = "mauvais"; }
      h += "<button class='" + cls + "' " + (rep ? "disabled" : "") + " data-" + ns + "='" + i + "'>" + esc(txt) + "</button>";
    });
    h += "</div>";
    // Extension pack fluides : la feuille d'aide, AVANT de répondre
    // (auto-formation : un indice guide, il ne donne pas la réponse).
    if (!rep && m.feedback && q.aide) {
      h += "<div class='liens' style='margin-top:4px'><button class='sec' data-aide='1'>💡 Un indice</button></div>" +
           "<div class='bloc' style='display:none'>" + esc(q.aide) + "</div>";
    }
    if (rep) {
      if (m.feedback) {
        var ok = rep.choix === q.bonne;
        h += "<div class='retour " + (ok ? "ok" : "ko") + "'>" + (ok ? "✅ Bonne réponse." : "❌ Réponse incorrecte.") +
             (q.remed ? "" : " " + esc(q.explication || "")) + "</div>";
        // Extension pack fluides : la remédiation complète — apprendre et
        // comprendre, pas seulement corriger.
        if (q.remed) {
          h += "<div class='bloc'><div class='t'>📚 Comprendre</div>";
          if (q.remed.texte) h += "<p style='margin:0'>" + esc(q.remed.texte) + "</p>";
          [["regle", "📏 La règle"], ["pourquoi", "🎯 Pourquoi"], ["exemple", "🧮 Exemple"], ["piege", "⚠️ Le piège"]]
            .forEach(function (p) {
              if (q.remed[p[0]]) h += "<p style='margin:4px 0 0'><b>" + p[1] + " :</b> " + esc(q.remed[p[0]]) + "</p>";
            });
          h += "</div>";
        }
        if (!ok && m.remediation && q.remediation_vers) h += "<div class='liens'><button class='sec' data-go='" + q.remediation_vers + "'>↩ Revoir la fiche</button></div>";
      } else {
        h += "<div class='retour ok'>Réponse enregistrée.</div>";
      }
    }
    return h + "</div>";
  }
  /* Extension pack fluides : LES COMPÉTENCES VISÉES, côté élève.
     Ces libellés existaient déjà mais n'étaient rendus qu'en mode notation :
     le stagiaire ne lisait qu'une ligne de numéros de codes, jamais ce que
     l'examen allait lui demander. `libelle` est la reformulation
     accessible, `officiel` le texte de l'arrêté (injecté au build depuis
     referentiel-2025.json, donc jamais recopié à la main). */
  function zoneCompetences(c) {
    var crs = c.criteres || [];
    if (!crs.length) return "";
    var h = "<div class='competences'><div class='t'>🎯 Ce que l'examen attend de vous</div>";
    crs.forEach(function (cr, i) {
      var ep = cr.epreuve || {}, cats = Object.keys(ep);
      // Si une catégorie est visée, c'est SON épreuve qui compte : le même
      // code peut être théorique ici et pratique là.
      var mien = S.categorie ? ep[S.categorie] : null;
      var pratique = mien ? mien === "P" : cats.some(function (k) { return ep[k] === "P"; });
      var horsChamp = S.categorie && !cr.information && !mien;
      var cls = cr.information || horsChamp ? "i" : pratique ? "p" : "t";
      var tag = cr.information ? "ℹ information"
              : horsChamp ? "○ hors de votre catégorie"
              : pratique ? "🛠 pratique" : "📖 théorique";
      h += "<div class='comp" + (i ? "" : " prem") + "'><span class='tp " + cls + "'>" + tag + "</span>" +
           "<span class='lib'>" + esc(cr.libelle) + "</span>";
      h += cr.information
        ? "<span class='cat'>évalué en " + esc((cr.evalue_en || []).join(" · ")) + "</span>"
        : mien ? "<span class='cat'>votre catégorie : " + esc(S.categorie) + "</span>"
        : "<span class='cat'>" + esc(cats.join(" · ")) + "</span>";
      if (cr.nouveau) h += "<span class='neuf'>★ nouveau 2025</span>";
      h += "</div>";
    });
    // Groupes 6 à 9 : le candidat ignore lequel tombera. Le lui dire, c'est
    // lui éviter de faire l'impasse sur trois quarts des composants.
    if (crs.some(function (cr) { return cr.tirage_au_sort; }))
      h += "<div class='avert'>⚠️ Ce groupe est tiré au sort le jour de l'épreuve : vous ne saurez pas à l'avance si c'est celui-ci qui tombe.</div>";
    h += "<div class='plus'><button data-deplie='1'>📜 Voir le texte officiel de l'arrêté</button></div>" +
         "<div class='officiel' style='display:none'>";
    crs.forEach(function (cr) {
      h += "<p><b>" + esc(cr.code) + "</b> — " + esc(cr.officiel || cr.libelle) + "</p>";
    });
    var grp = [];
    crs.forEach(function (cr) {
      var g = cr.groupe ? cr.groupe + " · " + cr.groupe_titre : null;
      if (g && grp.indexOf(g) < 0) grp.push(g);
    });
    h += "<p class='src'>Arrêté du 21 novembre 2025, annexe II.B" +
         (grp.length ? " — " + esc(grp.join(" ; ")) : "") + "</p>";
    return h + "</div></div>";
  }

  function zoneCriteres(c) {
    var h = "<div class='criteres'><div style='font-weight:700;color:var(--bleu);margin-bottom:6px'>Critères à positionner</div>";
    c.criteres.forEach(function (cr) {
      var etat = S.criteres[cr.code] || cr.etat || "a_evaluer";
      h += "<div class='crit'><span class='code'>" + esc(cr.code) + "</span><span class='lib'>" + esc(cr.libelle) + "</span><span class='etats'>" +
        btnEtat(cr.code, "acquis", "Acquis", etat) + btnEtat(cr.code, "cours", "En cours", etat) + btnEtat(cr.code, "non", "Non acquis", etat) + "</span></div>";
    });
    return h + "</div>";
  }
  function btnEtat(code, val, lib, etat) {
    var sel = (etat === val) ? "sel " + (val === "acquis" ? "acquis" : val === "non" ? "non" : "cours") : "";
    return "<button class='" + sel + "' data-crit='" + code + "' data-etat='" + val + "'>" + lib + "</button>";
  }
  function zoneLiens(c) {
    var liens = (c.liens || []).filter(function (l) { return conditionVraie(l.condition); });
    if (!liens.length) return "";
    var h = "<div class='liens'>";
    liens.forEach(function (l) { h += "<button class='" + (l.sec ? "sec" : "") + "' data-go='" + l.vers + "'>" + esc(l.libelle) + "</button>"; });
    return h + "</div>";
  }
  function pied(c) {
    var h = "<div class='pied'>";
    h += "<span class='chrono' id='chrono'>" + (c && c.minuteur_s ? "⏱ " + fmt(c.minuteur_s) : "") + "</span><span class='spacer'></span>";
    if (S.historique.length > 1) h += "<button id='btn-retour'>◂ Retour</button>";
    h += "<button class='docs-btn' id='btn-docs'>📂 Mes documents</button><button id='btn-secours'>Accès direct</button><button id='btn-trace'>⬇ Exporter ma trace</button></div>";
    return h;
  }
  function voiles() { return "<div class='voile' id='voile'><div class='modale'><button class='x' id='voile-x'>✕</button><div id='voile-contenu'></div></div></div>"; }
  function img(src) { return "<img class='illus' alt='' src='" + (PACK.pack.base_img || "") + src + "'>"; }

  /* ====================================================================
     REVOIR UNE PLANCHE ANIMÉE
     --------------------------------------------------------------------
     Un SVG inséré en <img> lance son animation au CHARGEMENT DE L'IMAGE,
     pas quand le lecteur arrive dessus. Et les planches narratives ne se
     déroulent qu'une seule fois : `begin` décalés, aucun `repeatCount`.
     Qui fait défiler la fiche jusqu'au schéma arrive donc après la fin et
     ne voit que l'image finale — deux personnes au sol, sans la descente.

     LE SEUL MOYEN FIABLE de relancer l'horloge SMIL d'un <img> est de
     RECHARGER SA SOURCE. On ne touche ni au SVG, ni à son CSS, ni au DOM
     du dessin : la tentative du 27/07 qui injectait le SVG en ligne après
     avoir retiré une règle CSS a vidé les planches, et a été annulée.

     La liste des planches animées est relevée au build
     (`PACK_META.svg_animes`) : le bouton n'apparaît jamais sous un dessin
     fixe, et personne n'a de liste à tenir à la main.
     ==================================================================== */
  var nRejeu = 0;
  function planchesAnimees() {
    var animes = (PACK.pack && PACK.pack.svg_animes) || [];
    if (!animes.length) return;
    onAll("img[src*='res/svg/']", function (im) {
      if (im.getAttribute("data-rejeu")) return;
      var base = im.getAttribute("src").split("?")[0];
      if (animes.indexOf(base.split("/").pop()) < 0) return; // dessin fixe
      im.setAttribute("data-rejeu", "1");
      var nom = base.split("/").pop();
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rejeu";
      b.textContent = "↻ Revoir l'animation depuis le début";
      b.addEventListener("click", function () {
        im.setAttribute("src", base + "?r=" + ++nRejeu);
        // la bande-son repart du même instant que l'image : c'est la seule
        // synchronisation possible avec un SVG inséré en <img>
        if (window.PiloteSons) window.PiloteSons.jouerPlanche(nom);
      });
      im.parentNode.insertBefore(b, im.nextSibling);

      /* Bouton + curseur de volume, une seule fois par page et seulement si
         cette planche a une bande-son : inutile de proposer le son là où il
         n'y en a pas. `PiloteSons.html()` construit les deux ensemble — un
         seul endroit qui sait ce qu'un contrôle de son doit contenir, la
         galerie et les fiches en profitent toutes les deux sans dupliquer
         le balisage. */
      if (window.PiloteSons && window.PiloteSons.disponible() &&
          (window.PILOTE_SONS.planches[nom] || []).length &&
          !document.querySelector("[data-son-bouton]")) {
        b.insertAdjacentHTML("afterend", window.PiloteSons.html("rejeu son"));
        window.PiloteSons.brancher();
      }
    });
  }

  /* ====================================================================
     INTERACTIONS
     ==================================================================== */
  function brancher(c, m) {
    nav();
    onAll("[data-rep]", function (el) { el.addEventListener("click", function () { repondre(c, +el.getAttribute("data-rep")); }); });
    onAll("[data-crit]", function (el) { el.addEventListener("click", function () { S.criteres[el.getAttribute("data-crit")] = el.getAttribute("data-etat"); render(); }); });
    commun();
  }
  function brancherExamen(c, m) {
    nav();
    onAll("[data-exr]", function (el) { el.addEventListener("click", function () { repondreExamen(+el.getAttribute("data-exr")); }); });
    var nx = document.getElementById("ex-next"); if (nx) nx.onclick = function () {
      if (S.examen.i >= S.examen.items.length - 1) S.examen.fini = true; else S.examen.i++; render(); };
    var tr = document.getElementById("ex-trace"); if (tr) tr.onclick = exporterTrace;
    if (S.examen && S.examen.fini && !MODES[S.modeId].feedback && CONFIG.scoring_url) soumettreServeur(c);
    commun();
  }
  /* `data-go` mène à une CARTE du pack ; `data-url` mène à une PAGE du site
     (la galerie des planches, par exemple). Extension rétrocompatible : une
     tuile sans `url` se comporte exactement comme avant. La page s'ouvre dans
     un onglet à part — on ne fait pas perdre à l'élève l'endroit où il en
     était dans sa progression. */
  function nav() {
    onAll("[data-go]", function (el) { el.addEventListener("click", function () { aller(el.getAttribute("data-go")); }); });
    onAll("[data-url]", function (el) {
      el.addEventListener("click", function () { window.open(el.getAttribute("data-url"), "_blank", "noopener"); });
    });
  }
  function commun() {
    planchesAnimees(); // le bouton « revoir » sous les planches animées
    // Extension pack fluides : indice de question et texte officiel de
    // l'arrêté — même mécanique, le bouton révèle le bloc qui suit son parent.
    onAll("[data-aide],[data-deplie]", function (el) {
      el.addEventListener("click", function () {
        var d = el.parentNode.nextElementSibling;
        if (d) d.style.display = d.style.display === "none" ? "" : "none";
      });
    });
    var b;
    if ((b = document.getElementById("btn-mode")) && !S.verrouMode) b.onclick = menuMode;
    if ((b = document.getElementById("btn-cat"))) b.onclick = menuCategorie;
    if ((b = document.getElementById("btn-retour"))) b.onclick = retour;
    if ((b = document.getElementById("btn-docs"))) b.onclick = ouvrirDocs;
    if ((b = document.getElementById("btn-secours"))) b.onclick = ouvrirSecours;
    if ((b = document.getElementById("btn-trace"))) b.onclick = exporterTrace;
    if ((b = document.getElementById("voile-x"))) b.onclick = fermerVoile;
    var v = document.getElementById("voile"); if (v) v.addEventListener("click", function (e) { if (e.target.id === "voile") fermerVoile(); });
  }
  function onAll(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function aller(id) { if (idxCartes[id]) { S.carteId = id; if (!idxCartes[id].examen) S.examen = null; window.scrollTo(0, 0); render(); } }
  function retour() { if (S.historique.length > 1) { S.historique.pop(); S.carteId = S.historique.pop(); S.examen = null; window.scrollTo(0, 0); render(); } }
  function repondre(c, choix) { if (S.reponses[c.id]) return; S.reponses[c.id] = { choix: choix, bonne: choix === c.question.bonne }; render(); }
  function repondreExamen(choix) {
    var ex = S.examen; if (ex.rep[ex.i]) return;
    ex.rep[ex.i] = { choix: choix };
    // chaque réponse alimente le suivi par compétence (extension pack fluides)
    var q = ex.items[ex.i];
    if (q && q.code) noterComp(q.code, choix === q.bonne);
    if (!MODES[S.modeId].feedback && ex.i >= ex.items.length - 1) ex.fini = true;
    render();
  }

  function menuMode() {
    var liste = (PACK.pack.modes_actifs || Object.keys(MODES));
    var h = "<h3>Choisir le mode</h3><div class='liens'>";
    liste.forEach(function (id) { if (MODES[id]) h += "<button data-mode='" + id + "'>" + esc(MODES[id].nom) + (id === "pilotage" ? " 🔒" : "") + "</button>"; });
    h += "</div><p style='color:var(--mut);font-size:13px;margin-top:10px'>Le mode <b>Pilotage formateur</b> affiche la couche pilote : réservé au formateur.</p>";
    ouvrirVoile(h);
    onAll("[data-mode]", function (el) { el.addEventListener("click", function () {
      var id = el.getAttribute("data-mode");
      if (id === "pilotage") {
        var saisie = prompt("Code d'accès formateur :");
        if (saisie === null) return; // annulation : pas de message d'erreur
        if (empreinteCode(String(saisie).trim()) !== (PACK.pack.code_empreinte || 0)) { alert("Ce n'est pas le bon code."); return; }
      }
      S.modeId = id; S.examen = null; fermerVoile(); window.scrollTo(0, 0); render();
    }); });
  }

  function ouvrirDocs() {
    var globs = (PACK.ressources || []).filter(function (r) { return r.global; });
    var carte = idxCartes[S.carteId];
    var loc = ((carte && carte.ressources) || []).map(function (id) { return idxRes[id]; }).filter(Boolean);
    var h = "<h3>📂 Mes documents</h3>";
    if (loc.length) { h += "<p style='color:var(--mut);font-size:13px'>Liés à cette étape</p><div class='ressources'>"; loc.forEach(function (r) { h += lienRes(r); }); h += "</div>"; }
    h += "<p style='color:var(--mut);font-size:13px;margin-top:12px'>Toujours accessibles</p><div class='ressources'>";
    globs.forEach(function (r) { h += lienRes(r); }); h += "</div>";
    ouvrirVoile(h);
  }
  function ouvrirSecours() {
    var h = "<h3>Accès direct</h3><div class='liens'>";
    PACK.cartes.forEach(function (c) { h += "<button class='sec' data-go2='" + c.id + "'>" + esc(c.titre) + "</button>"; });
    ouvrirVoile(h + "</div>");
    onAll("[data-go2]", function (el) { el.addEventListener("click", function () { fermerVoile(); aller(el.getAttribute("data-go2")); }); });
  }
  function lienRes(r) { if (!r) return ""; return "<a href='" + (r.url || r.src || "#") + "' target='_blank' rel='noopener'>" + esc(r.titre) + "</a>"; }
  function ouvrirVoile(h) { document.getElementById("voile-contenu").innerHTML = h; document.getElementById("voile").classList.add("on"); }
  function fermerVoile() { var v = document.getElementById("voile"); if (v) v.classList.remove("on"); }

  /* --- Trace --- */
  function traceObj() {
    return { pack: PACK.pack.id, version: PACK.pack.version, mode: S.modeId,
      debut: S.debut, fin: nowSec(), duree_s: nowSec() - S.debut,
      cartes_vues: S.historique.slice(), reponses: S.reponses, criteres: S.criteres,
      examen: S.examen ? { carte: S.examen.carteId, score: S.examen.score } : null };
  }
  function exporterTrace() {
    var blob = new Blob([JSON.stringify(traceObj(), null, 2)], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "trace_" + PACK.pack.id + ".json"; document.body.appendChild(a); a.click(); a.remove();
  }

  /* --- Scoring serveur (phase 2 : correction côté serveur, corrigé jamais livré) --- */
  function soumettreServeur(c) {
    var ex = S.examen;
    var payload = { pack: PACK.pack.id, exam: c.id, mode: S.modeId,
      reponses: ex.items.map(function (q, i) { return { qid: q.id, choix: ex.rep[i] ? ex.rep[i].choix : null }; }) };
    fetch(CONFIG.scoring_url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        var el = document.getElementById("srv");
        if (el) el.innerHTML = "<b style='color:var(--bleu)'>Résultat officiel : " + res.score + " / " + res.sur + " (" + res.pct + "%)</b>";
        ex.score = res;
      })
      .catch(function () { var el = document.getElementById("srv"); if (el) el.textContent = "Serveur de correction indisponible (score non officiel)."; });
  }

  /* --- Minuteur --- */
  function lancerChrono(c) {
    if (S.chrono) { clearInterval(S.chrono); S.chrono = null; }
    if (!c.minuteur_s) return;
    var reste = c.minuteur_s, el = document.getElementById("chrono");
    S.chrono = setInterval(function () { reste--; if (!el) return;
      el.textContent = "⏱ " + fmt(Math.max(0, reste));
      if (reste <= 0) { clearInterval(S.chrono); S.chrono = null; el.textContent = "⏱ temps indicatif écoulé"; } }, 1000);
  }

  /* --- auto-hauteur des outils embarqués (extension pack fluides) ---
     Les pages outils postent {piloteOutilH: hauteur} ; on ajuste l'iframe
     émettrice. Indispensable sur téléphone, où le contenu wrappe. */
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data.piloteOutilH !== "number") return;
    onAll("iframe", function (f) {
      if (f.contentWindow === e.source) f.style.height = Math.min(1400, Math.max(200, e.data.piloteOutilH)) + "px";
    });
  });

  /* --- suivi par COMPÉTENCE (extension pack fluides, auto-formation) ---
     Un score d'examen dit « 14/20 ». Il ne dit pas ce qu'il faut réviser.
     Comme chaque question porte son code du référentiel, on peut tenir un
     compte par compétence : combien de fois juste, combien de fois faux, et
     le résultat de la dernière tentative. C'est ce qui transforme le pack en
     outil de préparation — le stagiaire voit où il en est, code par code.
     Tout reste dans SON navigateur : rien ne remonte. */
  function lireComp() {
    try { return JSON.parse(localStorage.getItem("pilote_comp_" + PACK.pack.id) || "{}"); }
    catch (e) { return {}; }
  }
  function noterComp(code, ok) {
    if (!code) return;
    try {
      var o = lireComp();
      var e = o[code] || { ok: 0, ko: 0 };
      if (ok) e.ok++; else e.ko++;
      e.dernier = ok ? 1 : 0;
      o[code] = e;
      localStorage.setItem("pilote_comp_" + PACK.pack.id, JSON.stringify(o));
    } catch (e) { /* navigation privée : pas de suivi, tant pis */ }
  }
  function effacerComp() {
    try { localStorage.removeItem("pilote_comp_" + PACK.pack.id); } catch (e) {}
  }
  /* Quatre états lisibles, sans jargon : jamais testée · acquise · fragile · à revoir. */
  function etatComp(e) {
    if (!e || (!e.ok && !e.ko)) return "vierge";
    if (e.dernier === 1 && e.ko === 0) return "acquis";
    if (e.dernier === 1) return "fragile";
    return "revoir";
  }

  /* --- historique local (extension pack fluides, auto-formation) --- */
  function lireHist(id) {
    try { var o = JSON.parse(localStorage.getItem("pilote_hist_" + PACK.pack.id) || "{}"); return o[id] != null ? o[id] : null; }
    catch (e) { return null; }
  }
  function ecrireHist(id, pct) {
    try {
      var k = "pilote_hist_" + PACK.pack.id, o = JSON.parse(localStorage.getItem(k) || "{}");
      o[id] = pct; localStorage.setItem(k, JSON.stringify(o));
    } catch (e) { /* mode privé : tant pis, pas d'historique */ }
  }

  /* --- utilitaires --- */
  function conditionVraie(cond) { if (!cond) return true; var m = /^critere:([\w.]+)=(\w+)$/.exec(cond); if (!m) return true; return (S.criteres[m[1]] || "") === m[2]; }
  function melange(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } }
  function nowSec() { return Math.floor(Date.now() / 1000); }
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
})();
