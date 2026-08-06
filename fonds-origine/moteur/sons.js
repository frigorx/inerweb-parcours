/* =====================================================================
   sons.js — l'habillage sonore des planches animées
   ---------------------------------------------------------------------
   SEPT SONS SUR ONZE SONT CALCULÉS, PAS TÉLÉCHARGÉS
   Un clic de vanne, un bip de validation, une alarme, un souffle de fuite,
   un cœur qui ralentit : ce sont des formes d'onde élémentaires. Le
   navigateur sait les fabriquer (Web Audio API). Les produire en code
   plutôt qu'en fichier règle trois choses d'un coup :
     · le poids — 1,4 Mo de moins, et les sons les plus fréquents (le clic,
       la validation) ne coûtent plus un octet ;
     · les droits — c'est notre code, sous notre licence, plus d'origine à
       assumer ;
     · le réglage — hauteur, durée et intensité s'adaptent à la scène.
   Constat de F. Henninot, 28/07 : « ce ne sont que des bruits électroniques,
   ils n'auraient pas pu être créés en code ? ». Si.

   QUATRE RESTENT DES FICHIERS, et c'est assumé : des pas dans un escalier,
   un choc, une ambiance de compresseur et une musique ne se synthétisent
   pas honnêtement — un pas calculé sonne boîte à rythme. Ceux-là sont
   chargés à la demande, jamais à l'ouverture d'une page.

   L'HORLOGE — pourquoi pas setTimeout
   setTimeout dérive (mesuré : 2 à 15 ms sur 5 s) et surtout le navigateur
   le bride à un réveil par seconde dès que l'onglet passe en arrière-plan :
   en salle, changer d'onglet suffisait à disloquer la bande-son. Tout est
   donc programmé sur `AudioContext.currentTime`, l'horloge du fil audio,
   qui place un événement à l'échantillon près (0,02 ms) quoi que fasse la
   page. Les fichiers eux-mêmes sont décodés en mémoire et joués par cette
   même horloge : une seule référence de temps pour tout.

   CE QUE ÇA NE RÉSOUT PAS, ET QU'IL FAUT SAVOIR
   L'animation SVG, elle, est insérée en <img> : son horloge SMIL n'est ni
   lisible ni pilotable. On lance donc deux horloges côte à côte au même
   instant. Sur nos durées (< 20 s) l'écart reste inaudible, mais ce n'est
   pas une synchronisation asservie — ce serait un autre chantier.

   API — celle du « pack sonore V2 » de F. Henninot, pour que le code écrit
   ailleurs s'y branche sans adaptation :
     PiloteAudio.play("vanne")            PiloteAudio.stop("musique")
     PiloteAudio.setVolume(0.6)           PiloteAudio.toggleMute()
     PiloteAudio.playTimeline([{t:0, son:"pas"}, {t:3200, son:"chute"}])
   ===================================================================== */
(function () {
  "use strict";

  var CLE = "pilote_son";
  var CLE_VOLUME = "pilote_son_volume";
  var T = window.PILOTE_SONS || {};
  var DOSSIER = T.dossier || "packs/fluides/res/audio/";

  /* Retour de F. Henninot, 28/07 : « c'est pas toujours bien placé, c'est
     pas toujours intelligent, mais c'est pas grave. On devrait avoir un
     petit curseur volume, des fois c'est difficilement audible. »
     Le réglage compense un mixage jamais parfait entre sept sons calculés
     et quatre fichiers d'origines différentes — plus simple qu'un
     re-mixage fin de chaque recette, et l'utilisateur sait mieux que
     nous ce qui est audible sur SON matériel. Mémorisé comme le son
     coupé/actif, sur l'appareil, jamais envoyé nulle part. */
  function volumeMemorise() {
    try {
      var v = localStorage.getItem(CLE_VOLUME);
      return v === null ? 0.7 : Math.max(0, Math.min(1, Number(v)));
    } catch (e) { return 0.7; }
  }

  /* Le catalogue : soit une recette (calculé), soit un fichier. Les noms
     courts sont ceux du pack V2 — ils servent d'interface publique. */
  var CATALOGUE = {
    vanne:       { calcule: "clic" },
    validation:  { calcule: "validation" },
    erreur:      { calcule: "erreur" },
    transition:  { calcule: "transition" },
    alarme:      { calcule: "alarme" },
    fuite:       { calcule: "souffle" },
    coeur:       { calcule: "coeur" },
    pas:         { fichier: "pas_escalier.wav" },
    chute:       { fichier: "chute_choc.wav" },
    compresseur: { fichier: "compresseur_ambiance.wav" },
    musique:     { fichier: "musique_fond_legere.wav" },
  };

  var ctx = null, maitre = null, volumeGlobal = volumeMemorise(), coupe = null;
  var buffers = {}, enCours = [], sources = [];

  /* --------------------------------------------------------------------
     Le contexte n'est créé qu'au premier son : ouvrir une page ne doit
     rien allumer. Il est aussi « réveillé » à la demande — les navigateurs
     le suspendent tant que l'utilisateur n'a pas agi.
     -------------------------------------------------------------------- */
  function contexte() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      maitre = ctx.createGain();
      maitre.gain.value = volumeGlobal;
      maitre.connect(ctx.destination);
    }
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }

  function actif() {
    if (coupe === null) {
      try {
        var v = localStorage.getItem(CLE);
        coupe = v === null ? !T.actif_par_defaut : v !== "1";
      } catch (e) { coupe = true; }
    }
    return !coupe;
  }

  /* ====================================================================
     LES RECETTES — chaque son est une enveloppe posée sur une source.
     `t` est un instant de l'horloge audio, `v` le volume de la scène.
     ==================================================================== */

  function sortie(v) {
    var g = ctx.createGain();
    g.connect(maitre);
    g.gain.value = 0;
    g._v = typeof v === "number" ? v : 1;
    return g;
  }

  /* Une note : oscillateur + attaque courte + extinction exponentielle.
     L'extinction ne descend jamais à 0 (exponentialRamp l'interdit), d'où
     le 0.0001 — sinon le son se coupe net avec un claquement. */
  function note(t, freq, duree, v, forme) {
    var o = ctx.createOscillator(), g = sortie(v);
    o.type = forme || "sine";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(g._v, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g);
    o.start(t); o.stop(t + duree + 0.02);
    sources.push(o);
    return o;
  }

  /* Du bruit : un tampon d'échantillons aléatoires, passé dans un filtre.
     C'est la matière première de tout ce qui souffle, siffle ou claque. */
  function bruit(t, duree, v, filtre, freq, q) {
    var n = Math.max(1, Math.floor(ctx.sampleRate * duree));
    var b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = ctx.createBufferSource(); s.buffer = b;
    var f = ctx.createBiquadFilter();
    f.type = filtre || "bandpass";
    f.frequency.setValueAtTime(freq || 1200, t);
    if (q) f.Q.value = q;
    var g = sortie(v);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(g._v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    s.connect(f); f.connect(g);
    s.start(t); s.stop(t + duree + 0.02);
    sources.push(s);
    return { s: s, f: f, g: g };
  }

  var RECETTES = {
    /* Le clic d'une vanne : un choc sec et un peu de matière métallique. */
    clic: function (t, v) {
      bruit(t, 0.035, 0.5 * v, "highpass", 2200);
      note(t, 2400, 0.03, 0.25 * v, "square");
    },
    /* Validation : deux notes qui montent — la convention de l'accord. */
    validation: function (t, v) {
      note(t, 880, 0.12, 0.4 * v);
      note(t + 0.09, 1320, 0.22, 0.4 * v);
    },
    /* Erreur : les deux mêmes notes, mais qui descendent. Rien de brutal :
       une erreur pédagogique n'est pas une faute, on ne punit pas au son. */
    erreur: function (t, v) {
      note(t, 620, 0.14, 0.38 * v, "triangle");
      note(t + 0.11, 440, 0.26, 0.38 * v, "triangle");
    },
    /* Transition : un souffle court, discret, qui tourne la page. */
    transition: function (t, v) {
      var b = bruit(t, 0.34, 0.28 * v, "bandpass", 700, 1.2);
      b.f.frequency.exponentialRampToValueAtTime(2600, t + 0.3);
    },
    /* Alarme : deux tons alternés, quatre fois. C'est la sirène des locaux
       techniques — reconnaissable, et volontairement pas agréable. */
    alarme: function (t, v) {
      for (var i = 0; i < 4; i++) {
        note(t + i * 0.42, 880, 0.18, 0.34 * v, "square");
        note(t + i * 0.42 + 0.2, 660, 0.18, 0.34 * v, "square");
      }
    },
    /* Souffle de fuite : du bruit large, qui s'ouvre puis retombe.
       ⚠ Ce n'est pas le bruit d'une vraie fuite — voir le catalogue. */
    souffle: function (t, v) {
      var b = bruit(t, 2.6, 0.3 * v, "bandpass", 900, 0.8);
      b.f.frequency.setValueAtTime(500, t);
      b.f.frequency.exponentialRampToValueAtTime(2200, t + 0.6);
      b.f.frequency.exponentialRampToValueAtTime(700, t + 2.5);
    },
    /* Le cœur qui ralentit, puis le signal continu. Convention dramatique
       assumée : elle marque la scène, elle ne décrit aucune réalité
       médicale. Sept battements dont l'intervalle s'allonge, puis la note
       tenue. */
    coeur: function (t, v) {
      var d = 0, ecart = 0.62;
      for (var i = 0; i < 7; i++) {
        note(t + d, 62, 0.16, 0.55 * v, "sine");          // « lub »
        note(t + d + 0.19, 48, 0.2, 0.4 * v, "sine");     // « dub »
        d += ecart;
        ecart *= 1.28;                                     // il ralentit
      }
      var o = ctx.createOscillator(), g = sortie(0.3 * v);
      o.type = "sine"; o.frequency.value = 1000;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(g._v, t + d + 0.05);
      g.gain.setValueAtTime(g._v, t + d + 2.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 3.2);
      o.connect(g); o.start(t + d); o.stop(t + d + 3.3);
      sources.push(o);
    },
  };

  /* ====================================================================
     LES FICHIERS — décodés une fois, puis joués par la même horloge.
     ==================================================================== */
  /* On mémorise la PROMESSE en cours, pas seulement le buffer une fois
     décodé : sans cela, deux demandes rapprochées du même son partaient en
     deux téléchargements. Mesuré sur s1 (pas + chute, joués deux fois) :
     8 requêtes pour 2 fichiers, soit 1,4 Mo au lieu de 480 Ko. */
  var enChargement = {};
  function charger(nom) {
    if (buffers[nom]) return Promise.resolve(buffers[nom]);
    if (enChargement[nom]) return enChargement[nom];
    var f = CATALOGUE[nom] && CATALOGUE[nom].fichier;
    if (!f) return Promise.resolve(null);
    enChargement[nom] = fetch(DOSSIER + f)
      .then(function (r) { return r.ok ? r.arrayBuffer() : null; })
      .then(function (a) { return a ? ctx.decodeAudioData(a) : null; })
      .then(function (b) { if (b) buffers[nom] = b; enChargement[nom] = null; return b; })
      .catch(function () { enChargement[nom] = null; return null; }); // absent : silence
    return enChargement[nom];
  }

  function jouerBuffer(nom, t, v, boucle) {
    var b = buffers[nom];
    if (!b) return;
    var s = ctx.createBufferSource(), g = sortie(v);
    s.buffer = b; s.loop = !!boucle;
    g.gain.setValueAtTime(v, t);
    s.connect(g); s.start(t);
    sources.push(s);
    enCours.push({ nom: nom, source: s });
  }

  /* ====================================================================
     API PUBLIQUE
     ==================================================================== */
  function play(nom, o) {
    o = o || {};
    if (!actif() || !CATALOGUE[nom]) return;
    if (!contexte()) return;
    var v = Math.max(0, Math.min(1, typeof o.volume === "number" ? o.volume : 1));
    var t = ctx.currentTime + (o.delai || 0);
    if (CATALOGUE[nom].calcule) {
      try { RECETTES[CATALOGUE[nom].calcule](t, v); } catch (e) {}
    } else {
      charger(nom).then(function (b) {
        if (!b || !actif()) return;
        // le fichier arrive après coup : on le place à partir de maintenant
        jouerBuffer(nom, Math.max(ctx.currentTime, t), v, o.loop);
      });
    }
  }

  function stop(nom) {
    enCours = enCours.filter(function (e) {
      if (e.nom !== nom) return true;
      try { e.source.stop(); } catch (x) {}
      return false;
    });
  }

  function stopAll() {
    sources.forEach(function (s) { try { s.stop(); } catch (e) {} });
    sources = []; enCours = [];
  }

  function setVolume(x) {
    volumeGlobal = Math.max(0, Math.min(1, Number(x)));
    if (maitre) maitre.gain.value = volumeGlobal;
    try { localStorage.setItem(CLE_VOLUME, String(volumeGlobal)); } catch (e) {}
    majCurseurs();
  }
  function setMuted(x) {
    coupe = !!x;
    try { localStorage.setItem(CLE, coupe ? "0" : "1"); } catch (e) {}
    if (coupe) stopAll(); else contexte();
    majBoutons();
  }
  function toggleMute() { setMuted(actif()); return !actif(); }

  /* Une timeline : tout est programmé d'un coup sur l'horloge audio.
     Les sons calculés tombent à l'échantillon près ; les fichiers sont
     préchargés en parallèle pour être prêts à leur instant. */
  function playTimeline(evts, o) {
    o = o || {};
    if (!actif() || !Array.isArray(evts) || !evts.length) return;
    if (!contexte()) return;
    stopAll();
    var t0 = ctx.currentTime + 0.06; // marge de mise en route du graphe
    var liste = evts.slice().sort(function (a, b) { return a.t - b.t; });
    liste.forEach(function (e) {
      var t = t0 + Math.max(0, e.t) / 1000;
      var v = typeof e.volume === "number" ? e.volume : 1;
      if (e.action === "stop") return;
      var c = CATALOGUE[e.son];
      if (!c) return;
      if (c.calcule) { try { RECETTES[c.calcule](t, v); } catch (x) {} }
      else charger(e.son).then(function (b) {
        if (b && actif()) jouerBuffer(e.son, Math.max(ctx.currentTime, t), v, e.loop);
      });
    });
  }

  /* La bande-son d'une planche, depuis la table du pack. */
  function jouerPlanche(fichierSvg) {
    var seq = (T.planches || {})[fichierSvg];
    if (seq && seq.length) playTimeline(seq);
  }

  /* ---- le bouton ---- */
  function majBoutons() {
    var on = actif(), l = document.querySelectorAll("[data-son-bouton]");
    for (var i = 0; i < l.length; i++) {
      l[i].textContent = on ? "🔊 Son" : "🔇 Son coupé";
      l[i].setAttribute("aria-pressed", on ? "true" : "false");
      l[i].title = on ? "Couper l'habillage sonore"
                      : "Activer l'habillage sonore (rien n'est joué sans votre accord)";
    }
  }
  function majCurseurs() {
    var pct = Math.round(volumeGlobal * 100);
    var l = document.querySelectorAll("[data-son-volume]");
    for (var i = 0; i < l.length; i++) if (l[i].value != pct) l[i].value = pct;
  }
  function brancher(racine) {
    var l = (racine || document).querySelectorAll("[data-son-bouton]:not([data-son-branche])");
    for (var i = 0; i < l.length; i++) {
      (function (b) {
        b.setAttribute("data-son-branche", "1");
        b.addEventListener("click", function () {
          setMuted(actif());
          // un aperçu à l'activation : on entend tout de suite ce qu'on a activé
          if (actif()) play("validation", { volume: 0.5 });
        });
      })(l[i]);
    }
    var v = (racine || document).querySelectorAll("[data-son-volume]:not([data-son-branche])");
    for (var j = 0; j < v.length; j++) {
      (function (curseur) {
        curseur.setAttribute("data-son-branche", "1");
        curseur.value = Math.round(volumeGlobal * 100);
        // "change" seul attend qu'on relâche : on veut l'effet PENDANT le
        // glisser, pour entendre le réglage se faire.
        curseur.addEventListener("input", function () { setVolume(curseur.value / 100); });
      })(v[j]);
    }
    majBoutons();
    majCurseurs();
  }
  function html(classe) {
    return '<span class="son-reglage">' +
      '<button type="button" data-son-bouton class="' + (classe || "") +
      '" aria-pressed="false">🔇 Son coupé</button>' +
      '<input type="range" data-son-volume min="0" max="100" value="' + Math.round(volumeGlobal * 100) +
      '" aria-label="Volume de l\'habillage sonore" title="Volume">' +
      '</span>';
  }

  /* API du pack V2 de F. Henninot */
  window.PiloteAudio = {
    catalogue: CATALOGUE,
    play: play, stop: stop, stopAll: stopAll,
    setVolume: setVolume, getVolume: function () { return volumeGlobal; },
    setMuted: setMuted, isMuted: function () { return !actif(); }, toggleMute: toggleMute,
    playTimeline: playTimeline, clearTimeline: stopAll,
    /* combien de sons ne coûtent aucun téléchargement */
    calcules: Object.keys(CATALOGUE).filter(function (n) { return !!CATALOGUE[n].calcule; }),
    fichiers: Object.keys(CATALOGUE).filter(function (n) { return !!CATALOGUE[n].fichier; }),
  };

  /* Points d'accroche du moteur et de la galerie */
  window.PiloteSons = {
    disponible: function () { return !!(T.planches && Object.keys(T.planches).length); },
    actif: actif, jouerPlanche: jouerPlanche, jouer: function (n, v) { play(n, { volume: v }); },
    stop: stopAll, brancher: brancher, html: html,
    nom: function (src) { return String(src || "").split("?")[0].split("/").pop(); },
  };

  if (document.readyState !== "loading") brancher();
  else document.addEventListener("DOMContentLoaded", function () { brancher(); });
})();
