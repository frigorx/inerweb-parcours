/* =====================================================================
   capsule.js — LE moteur, unique, de toutes les capsules
   ---------------------------------------------------------------------
   CE QU'IL FAIT
   Lit un objet de données (une capsule) et le joue : un fil principal
   court, et à chaque écran, les inserts « Voulez-vous en savoir plus ? »
   qui ouvrent un détour et ramènent EXACTEMENT là où l'on était.

   POURQUOI UN MOTEUR ET PAS VINGT PAGES
   Le fonds actuel compte vingt tutos, chacun avec son app.js et son
   styles.css. Vingt fois la même mécanique réécrite, qui diverge un peu
   plus à chaque ajout, et une correction à porter vingt fois. Ici : une
   capsule est un FICHIER DE DONNÉES. On ajoute un sujet ou un détour sans
   écrire une ligne de JavaScript, et une amélioration du moteur profite
   à tout l'ensemble le jour même.

   LA PILE DE RETOUR
   Un détour peut lui-même proposer un détour. On empile en descendant, on
   dépile d'un cran en remontant. C'est ce qui permet d'intercaler plus
   tard une notion là où elle est appelée, sans toucher au fil.

   LA VOIX
   Un MP3 fabriqué à l'atelier d'abord (qualité constante, hors ligne) ;
   la voix du navigateur seulement en repli, et signalée comme tel. La
   vitesse est au lecteur (0,6 × à 1,6 ×, hauteur conservée), son choix
   est retenu d'une capsule à l'autre.

   FONCTIONNE EN file:// — pas de module ES, pas de fetch : la page
   s'ouvre en double-clic, sans serveur.
   ===================================================================== */
(function () {
  "use strict";

  /* Les capsules se déclarent ici en s'ajoutant elles-mêmes. */
  window.CAPSULES = window.CAPSULES || {};
  window.CAPSULE = function (c) { window.CAPSULES[c.id] = c; };

  var CLE = "capsule_reglages";
  var reglages = lireReglages();

  function lireReglages() {
    try {
      var r = JSON.parse(localStorage.getItem(CLE) || "{}");
      return { voix: r.voix || "h", vitesse: r.vitesse || 0.95 };
    } catch (e) { return { voix: "h", vitesse: 0.95 }; }
  }
  function ecrireReglages() {
    try { localStorage.setItem(CLE, JSON.stringify(reglages)); } catch (e) {}
  }

  /* Ce qui a déjà été vu — pour marquer les détours parcourus. Rien de
     nominatif, rien qui sorte du navigateur. */
  function cleVus(id) { return "capsule_vus_" + id; }
  function lireVus(id) {
    try { return new Set(JSON.parse(localStorage.getItem(cleVus(id)) || "[]")); }
    catch (e) { return new Set(); }
  }

  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  /* -------------------------------------------------------------------
     LE LECTEUR
     ------------------------------------------------------------------- */
  function Lecteur(capsule, racine) {
    this.c = capsule;
    this.racine = racine;
    this.i = 0;                 /* où l'on en est dans le fil courant   */
    this.fil = capsule.fil;     /* le fil affiché (principal ou détour)  */
    this.pile = [];             /* d'où l'on vient, cran par cran        */
    this.vus = lireVus(capsule.id);
    this.audio = null;
    this.repli = false;         /* vrai = on parle avec la voix du navigateur */

    /* AUCUNE voix au chargement. Une page qui se met à parler toute seule
       est ingérable en salle, et insupportable pour qui ouvre le lien dans
       le train. La voix ne part qu'après un clic sur « Écouter » — et cette
       autorisation vaut ensuite pour tout le parcours en cours, sinon il
       faudrait recliquer à chaque écran. */
    this.autorise = false;
  }

  Lecteur.prototype.demarrer = function () {
    document.title = this.c.titre + " — inerWeb";
    this.brancherUneFois();
    this.peindre();
  };

  Lecteur.prototype.dansDetour = function () { return this.pile.length > 0; };
  Lecteur.prototype.ecran = function () { return this.fil[this.i]; };

  /* ---- Ouvrir / fermer un détour ---------------------------------- */
  Lecteur.prototype.ouvrirDetour = function (idDetour) {
    var d = this.c.detours && this.c.detours[idDetour];
    if (!d) return;
    /* On empile AUSSI le détour d'où l'on part. Sans lui, en remontant d'un
       sous-détour, le fil d'Ariane continuerait d'afficher le titre du
       sous-détour qu'on vient de quitter. */
    this.pile.push({ fil: this.fil, i: this.i, detour: this.detourCourant || null });
    this.fil = d.ecrans;
    this.i = 0;
    this.detourCourant = d;
    this.marquerVu(idDetour);
    this.peindre(true);
  };

  Lecteur.prototype.revenir = function () {
    var d = this.pile.pop();
    if (!d) return;
    this.fil = d.fil;
    this.i = d.i;
    this.detourCourant = d.detour;   /* le détour parent, ou null si on rentre dans le fil */
    this.peindre(true);
  };

  Lecteur.prototype.titreCourant = function () {
    return this.dansDetour() && this.detourCourant
      ? this.detourCourant.question
      : this.c.titre;
  };

  Lecteur.prototype.marquerVu = function (id) {
    this.vus.add(id);
    try { localStorage.setItem(cleVus(this.c.id), JSON.stringify([].concat(Array.from(this.vus)))); }
    catch (e) {}
  };

  /* ---- Avancer / reculer ------------------------------------------ */
  Lecteur.prototype.suivant = function () {
    if (this.i < this.fil.length - 1) { this.i++; this.peindre(true); }
    else if (this.dansDetour()) this.revenir();
    else this.peindre(true);       /* dernier écran du fil : on y reste */
  };
  Lecteur.prototype.precedent = function () {
    if (this.i > 0) { this.i--; this.peindre(true); }
    else if (this.dansDetour()) this.revenir();
  };

  /* -------------------------------------------------------------------
     PEINDRE
     ------------------------------------------------------------------- */
  Lecteur.prototype.peindre = function (parler) {
    var e = this.ecran();
    var dernier = this.i === this.fil.length - 1;
    var detour = this.dansDetour();
    document.body.classList.toggle("dans-detour", detour);

    var h = "";

    /* Barre du haut */
    h += '<header class="tete">'
      + '<a class="retour" href="index.html">← Choisir un autre sujet</a>'
      + '<span class="sujet">' + esc(this.c.titre) + "</span>"
      + '<span class="spacer"></span>'
      + '<span class="niveau">' + esc(this.c.niveau || "découverte") + "</span>"
      + "</header>";

    /* Où suis-je : fil ou détour */
    if (detour) {
      h += '<div class="fil-ariane">En savoir plus : ' + esc(this.titreCourant())
        + ' <span class="petit">— vous reviendrez au fil juste après</span></div>';
    }

    /* Avancement du FIL PRINCIPAL seul : la curiosité ne fait pas reculer */
    var iFil = detour ? this.pile[0].i : this.i;
    var nFil = this.c.fil.length;
    h += '<div class="avance">'
      + '<span class="compte">' + (iFil + 1) + " / " + nFil + "</span>"
      + '<span class="rail"><span class="jauge" style="width:'
      + Math.round(((iFil + 1) / nFil) * 100) + '%"></span></span>'
      + "</div>";

    /* L'écran */
    h += '<main class="scene"><article class="ecran">';
    if (e.planche) {
      h += '<div class="porte-visuel"><div class="visuel">'
        + '<img src="' + esc(this.racine + e.planche) + '" alt="' + esc(e.titre) + '">'
        + '</div><button class="rejouer" type="button" data-agir="rejouer">↻ Rejouer</button></div>';
    }
    h += '<div class="corps"><h1>' + esc(e.titre) + "</h1>";
    h += '<div class="texte">' + rendreTexte(e.texte, e.mots) + "</div>";
    if (dernier && !detour && this.c.retenir) {
      h += '<div class="retenir"><h2>Ce qu\'il faut retenir</h2><ul>'
        + this.c.retenir.map(function (r) { return "<li>" + rendreTexte(r) + "</li>"; }).join("")
        + "</ul></div>";
    }
    h += "</div>";

    /* Les inserts « Voulez-vous en savoir plus ? » */
    var self = this;
    if (e.plus && e.plus.length) {
      h += '<div class="plus"><div class="t">Voulez-vous en savoir plus ?</div><div class="liste">';
      e.plus.forEach(function (id) {
        var d = self.c.detours && self.c.detours[id];
        if (!d) return;
        h += '<button type="button" data-detour="' + esc(id) + '">'
          + '<span class="fleche">▸</span>' + esc(d.question)
          + (self.vus.has(id) ? '<span class="vu">✔ vu</span>' : "")
          + "</button>";
      });
      h += "</div></div>";
    }

    /* Les codes du référentiel tenus par cet écran */
    if (e.codes || e.hors) {
      h += '<div class="codes">';
      (e.codes || []).forEach(function (c) { h += '<span class="c">' + esc(c) + "</span>"; });
      if (e.hors) h += '<span class="c hors">hors référentiel</span>';
      h += "</div>";
    }

    h += "</article></main>";

    /* Les commandes */
    h += '<div class="commandes">'
      + '<button type="button" data-agir="prec"' + (this.i === 0 && !detour ? " disabled" : "") + ">← Retour</button>";
    if (detour && dernier) {
      h += '<button class="revenir" type="button" data-agir="revenir">↩ Revenir au fil</button>';
    } else if (!dernier) {
      h += '<button class="suite" type="button" data-agir="suiv">Continuer →</button>';
    } else {
      h += '<a class="retour-accueil" href="index.html"><button class="suite" type="button">Choisir un autre sujet →</button></a>';
    }
    h += '<span class="spacer"></span>' + this.commandesVoix() + "</div>";

    /* On peint DANS un conteneur, jamais dans <body> : le bouton « Aa »
       (taille du texte, police DYS) est posé par lisibilite.js directement
       sur le body, et écraser le body le ferait disparaître au premier
       changement d'écran. */
    this.zone().innerHTML = h;
    this.brancher();
    if (parler !== false && this.autorise) this.lire();
  };

  Lecteur.prototype.zone = function () {
    var z = document.getElementById("capsule");
    if (!z) {
      z = document.createElement("div");
      z.id = "capsule";
      document.body.appendChild(z);
    }
    return z;
  };

  Lecteur.prototype.commandesVoix = function () {
    return '<div class="voix">'
      + '<button class="ecouter" type="button" data-agir="ecouter">🔊 Écouter</button>'
      + '<select data-agir="genre" aria-label="voix">'
      + '<option value="h"' + (reglages.voix === "h" ? " selected" : "") + ">voix masculine</option>"
      + '<option value="f"' + (reglages.voix === "f" ? " selected" : "") + ">voix féminine</option>"
      + "</select>"
      + '<input type="range" data-agir="vitesse" min="0.6" max="1.6" step="0.05" value="'
      + reglages.vitesse + '" aria-label="vitesse de lecture">'
      + '<span class="vitesse-val">' + reglages.vitesse.toFixed(2).replace(".", ",") + " ×</span>"
      + (this.repli ? '<span class="repli" title="Le fichier audio manque : la page parle avec la voix du navigateur">voix de secours</span>' : "")
      + "</div>";
  };

  /* -------------------------------------------------------------------
     LA VOIX
     ------------------------------------------------------------------- */
  Lecteur.prototype.lire = function () {
    this.taire();
    var e = this.ecran();
    var texte = e.lu || textePlat(e.texte);
    if (!texte) return;

    var self = this;

    /* Une capsule déclare `voixFabriquee: true` quand ses MP3 existent. Tant
       qu'elle ne le déclare pas, on ne va pas les chercher : sinon chaque
       écran tire un 404 et la console se remplit de bruit qui masquerait un
       vrai défaut. */
    if (!this.c.voixFabriquee) { this.parlerAvecLeNavigateur(texte); return; }

    var dossier = this.racine + "voix/" + (reglages.voix === "f" ? "feminine" : "masculine")
      + "/" + this.c.id + "/";
    var a = new Audio(dossier + e.id + ".mp3");
    a.preservesPitch = true;      /* accélérer sans monter dans les aigus */
    a.playbackRate = reglages.vitesse;
    this.audio = a;

    var b = document.querySelector(".ecouter");
    a.addEventListener("playing", function () { if (b) b.classList.add("parle"); });
    a.addEventListener("ended", function () { if (b) b.classList.remove("parle"); });

    a.play().catch(function () {
      /* Pas de MP3 (pas encore fabriqué, ou fichier manquant) : plutôt que
         de rester muet, on parle avec la voix du navigateur — et on le dit,
         parce qu'un fichier manquant est un défaut à corriger, pas un mode
         de fonctionnement normal. */
      self.audio = null;
      self.parlerAvecLeNavigateur(texte);
    });
  };

  Lecteur.prototype.parlerAvecLeNavigateur = function (texte) {
    if (!("speechSynthesis" in window)) return;
    this.repli = true;
    var d = document.querySelector(".voix");
    if (d && !d.querySelector(".repli")) {
      var s = document.createElement("span");
      s.className = "repli";
      s.title = "Le fichier audio manque : la page parle avec la voix du navigateur";
      s.textContent = "voix de secours";
      d.appendChild(s);
    }
    var u = new SpeechSynthesisUtterance(texte);
    u.lang = "fr-FR";
    u.rate = reglages.vitesse;
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^fr/i.test(v.lang); });
    if (vs.length) u.voice = vs[0];
    var b = document.querySelector(".ecouter");
    u.onstart = function () { if (b) b.classList.add("parle"); };
    u.onend = function () { if (b) b.classList.remove("parle"); };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  Lecteur.prototype.taire = function () {
    if (this.audio) { this.audio.pause(); this.audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    var b = document.querySelector(".ecouter");
    if (b) b.classList.remove("parle");
  };

  /* -------------------------------------------------------------------
     BRANCHEMENTS
     ------------------------------------------------------------------- */
  /* Deux branchements, et c'est volontaire :
     · brancherUneFois — la délégation de clic et le clavier, posés sur le
       document. Une seule fois pour toute la capsule : les rebrancher à
       chaque écran empilerait les écouteurs, et au sixième écran un clic
       compterait six fois.
     · brancher — les commandes recréées à chaque peinture (le choix de
       voix, le curseur de vitesse), qui n'existent plus après un innerHTML. */
  Lecteur.prototype.brancherUneFois = function () {
    var self = this;

    document.body.addEventListener("click", function (ev) {
      var d = ev.target.closest("[data-detour]");
      if (d) { self.taire(); self.ouvrirDetour(d.dataset.detour); return; }

      var m = ev.target.closest(".mot");
      if (m) { montrerMot(m); return; }

      var b = ev.target.closest("[data-agir]");
      if (!b) return;
      switch (b.dataset.agir) {
        case "suiv":    self.taire(); self.suivant(); break;
        case "prec":    self.taire(); self.precedent(); break;
        case "revenir": self.taire(); self.revenir(); break;
        case "ecouter":
          if (self.audio || (window.speechSynthesis && speechSynthesis.speaking)) {
            self.taire();
            self.autorise = false;   /* couper, c'est aussi dire « ne repars pas tout seul » */
          } else {
            self.autorise = true;
            self.lire();
          }
          break;
        case "rejouer": {
          /* Relancer une planche animée = recharger sa source. Il n'y a pas
             d'autre prise sur un SVG affiché en image. */
          var img = document.querySelector(".visuel img");
          if (img) img.src = img.src.split("#")[0] + "#r" + performance.now();
          break;
        }
      }
    });

    /* Onglet caché, page quittée : on se tait. Sinon une voix continue de
       parler dans un onglet que plus personne ne regarde. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self.taire();
    });
    window.addEventListener("pagehide", function () { self.taire(); });

    /* Clavier : on avance au clavier comme on avance au clic. */
    document.onkeydown = function (ev) {
      if (/input|select|textarea/i.test(ev.target.tagName)) return;
      if (ev.key === "ArrowRight" || ev.key === " ") { ev.preventDefault(); self.taire(); self.suivant(); }
      if (ev.key === "ArrowLeft") { ev.preventDefault(); self.taire(); self.precedent(); }
      if (ev.key === "Escape" && self.dansDetour()) { self.taire(); self.revenir(); }
    };
  };

  Lecteur.prototype.brancher = function () {
    var self = this;

    var sel = document.querySelector('[data-agir="genre"]');
    if (sel) sel.addEventListener("change", function () {
      reglages.voix = sel.value; ecrireReglages();
      self.repli = false;
      self.taire(); self.lire();
    });

    var vit = document.querySelector('[data-agir="vitesse"]');
    if (vit) vit.addEventListener("input", function () {
      reglages.vitesse = parseFloat(vit.value); ecrireReglages();
      var v = document.querySelector(".vitesse-val");
      if (v) v.textContent = reglages.vitesse.toFixed(2).replace(".", ",") + " ×";
      if (self.audio) self.audio.playbackRate = reglages.vitesse;
    });
  };

  /* -------------------------------------------------------------------
     TEXTE
     Le mot difficile s'écrit [[mot]] dans le texte. Il est expliqué là où
     il tombe, jamais dans un glossaire à la fin que personne n'ouvre.
     ------------------------------------------------------------------- */
  function rendreTexte(texte, mots) {
    var lignes = Array.isArray(texte) ? texte : [texte];
    return lignes.map(function (l) {
      var s = esc(l).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, mot, exp) {
        var e = exp || (mots && mots[mot]) || "";
        return '<button class="mot" type="button" data-explique="' + esc(e) + '">' + esc(mot) + "</button>";
      });
      s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
      return "<p>" + s + "</p>";
    }).join("");
  }

  function textePlat(texte) {
    var lignes = Array.isArray(texte) ? texte : [texte];
    return lignes.join(" ")
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1");
  }

  function montrerMot(bouton) {
    var suivant = bouton.parentElement.nextElementSibling;
    if (suivant && suivant.classList && suivant.classList.contains("explique")) {
      suivant.remove(); return;
    }
    var d = document.createElement("span");
    d.className = "explique";
    d.innerHTML = "<b>" + esc(bouton.textContent) + "</b> — " + esc(bouton.dataset.explique);
    bouton.parentElement.insertAdjacentElement("afterend", d);
  }

  /* -------------------------------------------------------------------
     DÉMARRAGE
     ------------------------------------------------------------------- */
  window.jouerCapsule = function (racine) {
    /* Les pages n'ont pas de <body> écrit : tant que le document n'est pas
       prêt, document.body est null. On attend plutôt que de planter. */
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () { window.jouerCapsule(racine); });
      return;
    }
    racine = racine || "";
    var id = new URLSearchParams(location.search).get("sujet");
    var c = window.CAPSULES[id] || window.CAPSULES[Object.keys(window.CAPSULES)[0]];
    if (!c) {
      var z = document.createElement("div");
      z.innerHTML = '<main class="scene"><article class="ecran"><div class="corps">'
        + "<h1>Aucun sujet à jouer</h1><p class=\"texte\">La capsule demandée n'est pas déclarée. "
        + '<a href="index.html">Revenir à la liste des sujets</a>.</p></div></article></main>';
      document.body.appendChild(z);
      return;
    }
    new Lecteur(c, racine).demarrer();
  };
})();
