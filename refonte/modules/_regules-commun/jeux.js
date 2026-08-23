/* jeux.js — le moteur des mini-jeux « S'entraîner » de la rame des régules.
   TROIS gabarits, pas plus (décision F. Henninot 23/08 : « 3 fois le même,
   c'est logique ») :
     · sequence : remettre les étapes d'une séquence dans l'ordre — les étapes
       viennent du CATALOGUE (visual.steps d'un écran), jamais recopiées ;
     · cablage  : placer les organes dans les bonnes colonnes, au bon rang —
       le courant s'anime quand la chaîne est juste ;
     · panne    : lire les couleurs (rouge = phase, orange = retour neutre)
       et cliquer le contact ouvert — la lecture du dépannage.
   Tout est boutons (clic et clavier), aucun glisser-déposer, aucune animation
   automatique. Les retours passent par une zone aria-live. */
(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  /* Mélange qui garantit un ordre différent de l'original (sinon le jeu
     serait déjà gagné à l'ouverture). */
  function melanger(liste) {
    var copie = liste.slice();
    do {
      for (var i = copie.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = copie[i]; copie[i] = copie[j]; copie[j] = t;
      }
    } while (copie.join("¤") === liste.join("¤") && liste.length > 1);
    return copie;
  }

  function annoncer(zone, texte) { zone.textContent = texte; }

  /* ---- gabarit 1 · la séquence à remettre dans l'ordre ------------------ */
  function jeuSequence(bloc, jeu, module) {
    var lecon = null;
    module.lessons.forEach(function (l) { if (l.id === jeu.ecran) { lecon = l; } });
    var etapes = lecon && lecon.visual && lecon.visual.steps ? lecon.visual.steps : [];
    if (!etapes.length) { bloc.innerHTML = "<p>Séquence introuvable.</p>"; return; }

    var reserve = melanger(etapes);
    var reponse = [];

    function dessiner() {
      bloc.innerHTML =
        '<p class="jeu-consigne">' + escapeHtml(jeu.consigne || "Touche les étapes dans le bon ordre.") + '</p>' +
        '<div class="jeu-reponse" aria-label="Ta séquence">' +
        (reponse.length
          ? reponse.map(function (e, i) {
              return '<button type="button" class="jeu-etape posee" data-retire="' + i + '"><span>' + (i + 1) + '</span>' + escapeHtml(e) + '</button>';
            }).join("")
          : '<p class="jeu-vide">La séquence se construit ici — touche une étape pour la retirer.</p>') +
        '</div>' +
        '<div class="jeu-reserve" aria-label="Étapes disponibles">' +
        reserve.map(function (e, i) {
          return '<button type="button" class="jeu-etape" data-pose="' + i + '">' + escapeHtml(e) + '</button>';
        }).join("") +
        '</div>' +
        '<div class="jeu-retour" aria-live="polite"></div>';

      bloc.querySelectorAll("[data-pose]").forEach(function (b) {
        b.addEventListener("click", function () {
          reponse.push(reserve.splice(Number(b.getAttribute("data-pose")), 1)[0]);
          if (!reserve.length) { corriger(); } else { dessiner(); }
        });
      });
      bloc.querySelectorAll("[data-retire]").forEach(function (b) {
        b.addEventListener("click", function () {
          reserve.push(reponse.splice(Number(b.getAttribute("data-retire")), 1)[0]);
          dessiner();
        });
      });
    }

    function corriger() {
      var justes = 0;
      bloc.innerHTML =
        '<p class="jeu-consigne">' + escapeHtml(jeu.consigne || "") + '</p>' +
        '<div class="jeu-reponse">' +
        reponse.map(function (e, i) {
          var ok = e === etapes[i];
          if (ok) { justes++; }
          return '<div class="jeu-etape corrigee ' + (ok ? "juste" : "fausse") + '"><span>' + (i + 1) + '</span>' + escapeHtml(e) +
                 (ok ? "" : '<small>attendu : ' + escapeHtml(etapes[i]) + '</small>') + '</div>';
        }).join("") +
        '</div>' +
        '<div class="jeu-retour" aria-live="polite"><strong>' + justes + " / " + etapes.length + '</strong> — ' +
        (justes === etapes.length ? "la séquence est en place. C’est exactement l’ordre du schéma." : "relis les étapes en rouge, puis rejoue.") + '</div>' +
        '<button type="button" class="nav-button secondary jeu-rejouer">Rejouer</button>';
      bloc.querySelector(".jeu-rejouer").addEventListener("click", function () {
        reserve = melanger(etapes); reponse = []; dessiner();
      });
    }

    dessiner();
  }

  /* ---- gabarit 2 · câbler la chaîne ------------------------------------- */
  function jeuCablage(bloc, jeu) {
    var organes = melanger(jeu.organes.map(function (o) { return o.code; }));
    var placement = {};
    jeu.colonnes.forEach(function (c) { placement[c.nom] = c.ordre.map(function () { return null; }); });
    var enMain = null;

    function role(code) {
      var trouve = "";
      jeu.organes.forEach(function (o) { if (o.code === code) { trouve = o.role; } });
      return trouve;
    }

    function dessiner(verdict) {
      var html = '<p class="jeu-consigne">' + escapeHtml(jeu.consigne) + '</p><div class="jeu-colonnes">';
      jeu.colonnes.forEach(function (c) {
        var juste = verdict && placement[c.nom].join("¤") === c.ordre.join("¤");
        html += '<div class="jeu-colonne' + (juste ? " alimentee" : "") + '"><h4>' + escapeHtml(c.nom) + '</h4>' +
          '<div class="jeu-rail">L</div><div class="jeu-fil' + (juste ? " courant" : "") + '"></div>';
        placement[c.nom].forEach(function (code, i) {
          var etat = "";
          if (verdict) { etat = code === c.ordre[i] ? " juste" : " fausse"; }
          html += '<button type="button" class="jeu-case' + (code ? " pleine" : "") + etat + '" data-colonne="' + escapeHtml(c.nom) + '" data-rang="' + i + '">' +
            (code ? '<b>' + escapeHtml(code) + '</b><small>' + escapeHtml(role(code)) + '</small>' : '<span>' + (i + 1) + '</span>') +
            '</button><div class="jeu-fil' + (juste ? " courant" : "") + '"></div>';
        });
        html += '<div class="jeu-rail">N</div></div>';
      });
      html += '</div><div class="jeu-reserve" aria-label="Organes à placer">' +
        organes.map(function (code, i) {
          return '<button type="button" class="jeu-organe' + (enMain === i ? " enmain" : "") + '" data-organe="' + i + '"><b>' + escapeHtml(code) + '</b><small>' + escapeHtml(role(code)) + '</small></button>';
        }).join("") + '</div>' +
        '<div class="jeu-retour" aria-live="polite">' + (verdict || (enMain !== null ? "Choisis maintenant la case de « " + escapeHtml(organes[enMain]) + " »." : "Touche un organe, puis sa case dans la colonne.")) + '</div>' +
        (verdict ? '<button type="button" class="nav-button secondary jeu-rejouer">Rejouer</button>' : "");

      bloc.innerHTML = html;

      bloc.querySelectorAll("[data-organe]").forEach(function (b) {
        b.addEventListener("click", function () {
          enMain = enMain === Number(b.getAttribute("data-organe")) ? null : Number(b.getAttribute("data-organe"));
          dessiner();
        });
      });
      bloc.querySelectorAll("[data-colonne]").forEach(function (b) {
        b.addEventListener("click", function () {
          var nom = b.getAttribute("data-colonne"), rang = Number(b.getAttribute("data-rang"));
          if (placement[nom][rang]) {
            organes.push(placement[nom][rang]); placement[nom][rang] = null; dessiner();
          } else if (enMain !== null) {
            placement[nom][rang] = organes.splice(enMain, 1)[0]; enMain = null;
            if (!organes.length) { verifier(); } else { dessiner(); }
          }
        });
      });
      var rejouer = bloc.querySelector(".jeu-rejouer");
      if (rejouer) {
        rejouer.addEventListener("click", function () {
          organes = melanger(jeu.organes.map(function (o) { return o.code; }));
          jeu.colonnes.forEach(function (c) { placement[c.nom] = c.ordre.map(function () { return null; }); });
          enMain = null; dessiner();
        });
      }
    }

    function verifier() {
      var toutJuste = jeu.colonnes.every(function (c) { return placement[c.nom].join("¤") === c.ordre.join("¤"); });
      dessiner(toutJuste
        ? "Chaîne correcte : le courant passe. " + escapeHtml(jeu.bravo || "")
        : "Le courant ne passe pas partout : les cases en rouge ne sont pas au bon endroit.");
    }

    dessiner();
  }

  /* ---- gabarit 3 · trouve la panne (lecture rouge / retour neutre) ------- */
  function jeuPanne(bloc, jeu) {
    var contacts = jeu.scenario.contacts;
    var ouvert = -1;
    contacts.forEach(function (c, i) { if (c.ouvert) { ouvert = i; } });

    function colonneSvg(revele) {
      var h = 110 + contacts.length * 120 + 130;
      var s = '<svg viewBox="0 0 340 ' + h + '" role="img" aria-label="Colonne de commande, potentiels colorés">';
      s += '<line x1="60" y1="30" x2="280" y2="30" class="jsvg-rail"/><text x="40" y="38" class="jsvg-code">L</text>';
      s += '<line x1="60" y1="' + (h - 30) + '" x2="280" y2="' + (h - 30) + '" class="jsvg-rail"/><text x="40" y="' + (h - 22) + '" class="jsvg-code">N</text>';
      var y = 30;
      contacts.forEach(function (c, i) {
        /* Le tronçon AVANT le contact i : phase jusqu'au contact ouvert
           inclus, retour neutre au-delà, courant si tout est fermé. */
        var haut = ouvert === -1 ? "courant" : (i <= ouvert ? "phase" : "retour");
        s += '<line x1="170" y1="' + y + '" x2="170" y2="' + (y + 60) + '" class="jsvg-' + haut + '"/>';
        y += 60;
        s += '<rect x="120" y="' + y + '" width="100" height="60" rx="10" class="jsvg-boite' + (revele && i === ouvert ? " fautif" : "") + '"/>' +
             '<text x="170" y="' + (y + 27) + '" text-anchor="middle" class="jsvg-code">' + escapeHtml(c.code) + '</text>' +
             '<text x="170" y="' + (y + 48) + '" text-anchor="middle" class="jsvg-mini">' + escapeHtml(c.role) + '</text>';
        y += 60;
      });
      var basMode = ouvert === -1 ? "courant" : "retour";
      s += '<line x1="170" y1="' + y + '" x2="170" y2="' + (y + 40) + '" class="jsvg-' + basMode + '"/>';
      s += '<rect x="110" y="' + (y + 40) + '" width="120" height="50" class="jsvg-bobine"/>' +
           '<text x="170" y="' + (y + 72) + '" text-anchor="middle" class="jsvg-code">' + escapeHtml(jeu.scenario.bobine) + '</text>';
      s += '<line x1="170" y1="' + (y + 90) + '" x2="170" y2="' + (h - 30) + '" class="jsvg-' + basMode + '"/>';
      s += '</svg>';
      return s;
    }

    function dessiner(retour, revele) {
      bloc.innerHTML =
        '<p class="jeu-consigne">' + escapeHtml(jeu.consigne) + '</p>' +
        '<div class="jeu-panne"><div class="jeu-schema">' + colonneSvg(revele) + '</div>' +
        '<div class="jeu-choix"><p>Rouge = la phase est présente. Orange = le retour neutre, à travers la bobine. Quel contact est ouvert ?</p>' +
        contacts.map(function (c, i) {
          return '<button type="button" class="jeu-organe" data-choix="' + i + '"><b>' + escapeHtml(c.code) + '</b><small>' + escapeHtml(c.role) + '</small></button>';
        }).join("") +
        '</div></div>' +
        '<div class="jeu-retour" aria-live="polite">' + (retour || "") + '</div>' +
        (revele ? '<button type="button" class="nav-button secondary jeu-rejouer">Rejouer</button>' : "");

      bloc.querySelectorAll("[data-choix]").forEach(function (b) {
        b.addEventListener("click", function () {
          var choix = Number(b.getAttribute("data-choix"));
          if (choix === ouvert) {
            dessiner("Exact : entre le rouge et l’orange, c’est lui. " + escapeHtml(jeu.explication || ""), true);
          } else {
            dessiner("Pas lui : regarde où le rouge s’arrête et où l’orange commence.", false);
          }
        });
      });
      var rejouer = bloc.querySelector(".jeu-rejouer");
      if (rejouer) { rejouer.addEventListener("click", function () { dessiner("", false); }); }
    }

    dessiner("", false);
  }

  /* ---- l'écran « S'entraîner » ------------------------------------------ */
  window.REGULES_JEUX = {
    rendre: function (article, module) {
      var jeux = module.jeux || [];
      var courant = 0;

      function dessiner() {
        var jeu = jeux[courant];
        article.innerHTML =
          '<section class="jeux-panel">' +
          '<p class="kicker">S’entraîner · Jeu ' + (courant + 1) + " / " + jeux.length + '</p>' +
          '<h2>' + escapeHtml(jeu.titre) + '</h2>' +
          '<div class="jeux-onglets" aria-label="Choisir un jeu">' +
          jeux.map(function (j, i) {
            return '<button type="button" class="jeu-onglet' + (i === courant ? " active" : "") + '" data-jeu="' + i + '">' + (i + 1) + " · " + escapeHtml(j.court) + '</button>';
          }).join("") +
          '</div><div class="jeu-bloc"></div></section>';

        article.querySelectorAll("[data-jeu]").forEach(function (b) {
          b.addEventListener("click", function () { courant = Number(b.getAttribute("data-jeu")); dessiner(); });
        });

        var bloc = article.querySelector(".jeu-bloc");
        if (jeu.type === "sequence") { jeuSequence(bloc, jeu, module); }
        else if (jeu.type === "cablage") { jeuCablage(bloc, jeu); }
        else if (jeu.type === "panne") { jeuPanne(bloc, jeu); }
      }

      dessiner();
    }
  };
})();
