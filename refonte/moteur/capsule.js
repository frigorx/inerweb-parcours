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
  function Lecteur(capsule, racine, integre) {
    this.c = capsule;
    this.racine = racine;
    this.integre = !!integre;   /* accueil dans la même page, pas index.html */
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
    if (window.RELECTURE && !document.getElementById("barre-relecture")) barreRelecture();
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
      + (this.integre
        ? '<a class="retour" href="#" data-agir="accueil">← Choisir un autre sujet</a>'
        : '<a class="retour" href="index.html">← Choisir un autre sujet</a>')
      + '<span class="sujet">' + esc(this.c.titre) + "</span>"
      + '<span class="spacer"></span>'
      + (window.RELECTURE && e.verifier && e.verifier.length
        ? '<span class="compte-verif">' + e.verifier.length + " à vérifier</span>" : "")
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

    /* ---- MODE RELECTURE : ce que NOUS signalons, puis ce que le
       relecteur nous dit. Les deux blocs n'existent que dans la bêta. ---- */
    if (window.RELECTURE) {
      if (e.verifier && e.verifier.length) {
        h += '<div class="a-verifier"><div class="t">À vérifier</div><ul>'
          + e.verifier.map(function (v) { return "<li>" + rendreLigne(v) + "</li>"; }).join("")
          + "</ul></div>";
      }
      h += blocAvis(this.c.id + "/" + e.id);
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
    } else if (this.integre) {
      h += '<button class="suite" type="button" data-agir="accueil">Choisir un autre sujet →</button>';
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
    /* Dans la version « un seul fichier », une seule voix est embarquée :
       proposer le choix afficherait un bouton qui ne peut pas tenir sa
       promesse. On annonce alors simplement quelle voix parle. */
    var embarque = !!(window.SONS_EMBARQUES && window.SONS_EMBARQUES[this.c.id]);
    return '<div class="voix">'
      + '<button class="ecouter" type="button" data-agir="ecouter">🔊 Écouter</button>'
      + (embarque
        ? '<span class="et-voix">voix ' + esc(window.SONS_EMBARQUES.nom || "Henri") + "</span>"
        : '<select data-agir="genre" aria-label="voix">'
          + '<option value="h"' + (reglages.voix === "h" ? " selected" : "") + ">voix masculine</option>"
          + '<option value="f"' + (reglages.voix === "f" ? " selected" : "") + ">voix féminine</option>"
          + "</select>")
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

    /* Deux provenances possibles pour le son, dans cet ordre :
       1. SONS_EMBARQUES — la version « un seul fichier », où les narrations
          sont dans la page elle-même. C'est ce qui permet de tester sur un
          téléphone sans rien installer ni télécharger à côté.
       2. le dossier voix/ — la forme de production, un MP3 par écran. */
    var source = null;
    if (window.SONS_EMBARQUES && window.SONS_EMBARQUES[this.c.id]) {
      source = window.SONS_EMBARQUES[this.c.id][e.id] || null;
    }
    if (!source) {
      source = this.racine + "voix/" + (reglages.voix === "f" ? "feminine" : "masculine")
        + "/" + this.c.id + "/" + e.id + ".mp3";
    }
    var a = new Audio(source);
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
    /* UNE seule fois pour toute la PAGE, pas une fois par lecteur : avec
       l'accueil intégré, on crée un lecteur neuf à chaque sujet ouvert, et
       un écouteur par lecteur finirait par compter un clic autant de fois
       qu'on a changé de sujet. Les écouteurs s'adressent donc au lecteur
       COURANT, désigné par window.__lecteur. */
    window.__lecteur = this;
    if (window.__capsuleBranchee) return;
    window.__capsuleBranchee = true;

    var self = { };
    Object.defineProperty(self, "taire", { get: function () { return window.__lecteur.taire.bind(window.__lecteur); } });
    Object.defineProperty(self, "suivant", { get: function () { return window.__lecteur.suivant.bind(window.__lecteur); } });
    Object.defineProperty(self, "precedent", { get: function () { return window.__lecteur.precedent.bind(window.__lecteur); } });
    Object.defineProperty(self, "revenir", { get: function () { return window.__lecteur.revenir.bind(window.__lecteur); } });
    Object.defineProperty(self, "lire", { get: function () { return window.__lecteur.lire.bind(window.__lecteur); } });
    Object.defineProperty(self, "ouvrirDetour", { get: function () { return window.__lecteur.ouvrirDetour.bind(window.__lecteur); } });
    Object.defineProperty(self, "dansDetour", { get: function () { return window.__lecteur.dansDetour.bind(window.__lecteur); } });
    Object.defineProperty(self, "audio", { get: function () { return window.__lecteur.audio; } });
    Object.defineProperty(self, "autorise", {
      get: function () { return window.__lecteur.autorise; },
      set: function (v) { window.__lecteur.autorise = v; },
    });

    document.body.addEventListener("click", function (ev) {
      var d = ev.target.closest("[data-detour]");
      if (d) { self.taire(); self.ouvrirDetour(d.dataset.detour); return; }

      var m = ev.target.closest(".mot");
      if (m) { montrerMot(m); return; }

      /* Mode relecture : l'avis du relecteur sur l'écran courant. */
      var av = ev.target.closest("[data-avis]");
      if (av) {
        var cle = av.closest(".avis").dataset.cle;
        var deja = av.getAttribute("aria-pressed") === "true";
        noterAvis(cle, "avis", deja ? "" : av.dataset.avis);
        var freres = av.closest(".choix-relecture").querySelectorAll("[data-avis]");
        for (var i = 0; i < freres.length; i++) {
          freres[i].setAttribute("aria-pressed",
            String(!deja && freres[i] === av));
        }
        return;
      }

      var b = ev.target.closest("[data-agir]");
      if (!b) return;
      if (b.dataset.agir === "releve") { montrerReleve(); return; }
      if (b.dataset.agir === "sans-relecture" || b.dataset.agir === "avec-relecture") {
        /* Va-et-vient entre le produit nu — ce que l'élève verra — et la
           bêta annotée. Les avis déjà donnés restent : on ne perd rien en
           basculant, et l'on peut basculer autant de fois qu'on veut. */
        window.RELECTURE = b.dataset.agir === "avec-relecture";
        var barre = document.getElementById("barre-relecture");
        if (barre) barre.remove();
        if (window.RELECTURE) {
          barreRelecture();
        } else {
          var mini = document.createElement("div");
          mini.className = "barre-relecture";
          mini.id = "barre-relecture";
          mini.innerHTML = "<span>Vous voyez le produit <b>tel que l'élève l'aura</b> — "
            + "sans un mot du dispositif de relecture.</span>"
            + '<span class="spacer"></span>'
            + '<button type="button" data-agir="avec-relecture">↩ Revenir au mode relecture</button>';
          document.body.appendChild(mini);
          document.body.classList.add("avec-relecture");
        }
        if (window.__lecteur && window.__lecteur.fil) window.__lecteur.peindre(false);
        else if (window.__retourAccueil) window.__retourAccueil();
        return;
      }
      if (b.dataset.agir === "accueil") {
        ev.preventDefault();
        self.taire();
        if (window.__retourAccueil) window.__retourAccueil();
        return;
      }
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

    /* La remarque écrite du relecteur, gardée à la frappe : personne ne
       doit perdre trois lignes parce qu'il a cliqué « Continuer ». */
    document.body.addEventListener("input", function (ev) {
      if (!ev.target.classList.contains("note-avis")) return;
      noterAvis(ev.target.closest(".avis").dataset.cle, "note", ev.target.value);
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
    return lignes.map(function (l) { return "<p>" + rendreLigne(l, mots) + "</p>"; }).join("");
  }

  /* La même mise en forme, mais sans paragraphe autour : pour un élément
     de liste, où un <p> casserait la puce. */
  function rendreLigne(l, mots) {
    return esc(l)
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, mot, exp) {
        var e = exp || (mots && mots[mot]) || "";
        return '<button class="mot" type="button" data-explique="' + esc(e) + '">' + esc(mot) + "</button>";
      })
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
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
  /* =====================================================================
     MODE RELECTURE
     ---------------------------------------------------------------------
     Activé par `window.RELECTURE = true`, et par rien d'autre : le produit
     normal ne porte pas une ligne de ce dispositif.

     Dix relecteurs, dix postes, aucun serveur (rien ne sort d'ici). Chacun
     annote sur sa machine, puis enregistre son relevé dans un fichier
     texte qu'il renvoie. C'est rustique et c'est le seul moyen de ne
     dépendre de rien.
     ===================================================================== */
  var CLE_RELECTURE = "capsule_relecture";

  function lireAvis() {
    try { return JSON.parse(localStorage.getItem(CLE_RELECTURE) || "{}"); }
    catch (e) { return {}; }
  }
  function ecrireAvis(a) {
    try { localStorage.setItem(CLE_RELECTURE, JSON.stringify(a)); } catch (e) {}
  }

  var LIBELLES = {
    juste: "✔ Juste",
    corriger: "✎ À corriger",
    question: "？ Question",
    sensible: "⚠ Sensible",
  };

  function blocAvis(cle) {
    var tout = lireAvis();
    var d = tout[cle] || {};
    var h = '<div class="avis" data-cle="' + esc(cle) + '">'
      + '<p class="q">Cet écran vous paraît-il juste ?</p>'
      + '<div class="choix-relecture">';
    for (var k in LIBELLES) {
      h += '<button type="button" data-avis="' + k + '" aria-pressed="'
        + (d.avis === k ? "true" : "false") + '">' + LIBELLES[k] + "</button>";
    }
    h += "</div>"
      + '<textarea class="note-avis" placeholder="Ce qui est faux, ce qui manque, ce qu\'il faut dire autrement…"'
      + ' aria-label="votre remarque sur cet écran">' + esc(d.note || "") + "</textarea>"
      + '<p class="ou">Votre remarque est gardée sur <b>votre</b> machine. Rien ne part ailleurs. '
      + "Le bouton <b>« Enregistrer mon relevé »</b>, en bas, produit le fichier à renvoyer.</p>"
      + "</div>";
    return h;
  }

  function noterAvis(cle, champ, valeur) {
    var tout = lireAvis();
    tout[cle] = tout[cle] || {};
    tout[cle][champ] = valeur;
    if (!tout[cle].avis && !tout[cle].note) delete tout[cle];
    ecrireAvis(tout);
    majBarreRelecture();
  }

  function comptesRelecture() {
    var tout = lireAvis();
    var c = { juste: 0, corriger: 0, question: 0, sensible: 0, notes: 0, total: 0 };
    for (var k in tout) {
      if (k.charAt(0) === "_") continue;
      if (tout[k].avis) { c[tout[k].avis]++; c.total++; }
      if (tout[k].note) c.notes++;
    }
    return c;
  }

  /* Combien d'écrans en tout, et combien portent un « À VÉRIFIER » ? On les
     compte, on ne les déclare pas : un chiffre saisi à la main se périme. */
  function inventaireEcrans() {
    var n = 0, verif = 0;
    for (var id in window.CAPSULES) {
      var c = window.CAPSULES[id];
      var tous = c.fil.slice();
      for (var d in c.detours || {}) tous = tous.concat(c.detours[d].ecrans);
      n += tous.length;
      verif += tous.filter(function (e) { return e.verifier && e.verifier.length; }).length;
    }
    return { ecrans: n, aVerifier: verif };
  }

  function barreRelecture() {
    var inv = inventaireEcrans();
    var d = document.createElement("div");
    d.className = "barre-relecture";
    d.id = "barre-relecture";
    d.innerHTML =
      '<span id="compte-relecture"></span>'
      + '<span class="spacer"></span>'
      + '<span>' + inv.aVerifier + " écran" + (inv.aVerifier > 1 ? "s" : "")
      + ' <b>à vérifier</b> sur ' + inv.ecrans + "</span>"
      + '<button type="button" data-agir="releve">↧ Enregistrer mon relevé</button>'
      + '<button type="button" class="fantome" data-agir="sans-relecture">Voir sans les annotations</button>';
    document.body.appendChild(d);
    document.body.classList.add("avec-relecture");
    majBarreRelecture();
  }

  function majBarreRelecture() {
    var z = document.getElementById("compte-relecture");
    if (!z) return;
    var c = comptesRelecture();
    z.innerHTML = c.total === 0
      ? "Aucun avis donné pour l'instant"
      : "<b>" + c.total + "</b> avis · " + c.juste + " juste · " + c.corriger
        + " à corriger · " + c.question + " question · " + c.sensible + " sensible";
  }

  function releveMarkdown() {
    var tout = lireAvis();
    var nom = tout.__nom || "";
    var lignes = ["# Relevé de relecture — capsules inerWeb", ""];
    if (nom) lignes.push("**Relecteur : " + nom + "**", "");
    var c = comptesRelecture();
    lignes.push("Avis donnés : **" + c.total + "** — " + c.juste + " juste · " + c.corriger
      + " à corriger · " + c.question + " question · " + c.sensible + " sensible.", "");

    for (var id in window.CAPSULES) {
      var cap = window.CAPSULES[id];
      var tous = cap.fil.map(function (e) { return { e: e, ou: "fil" }; });
      for (var d in cap.detours || {}) {
        (function (dd) {
          cap.detours[dd].ecrans.forEach(function (e) {
            tous.push({ e: e, ou: "détour « " + cap.detours[dd].question + " »" });
          });
        })(d);
      }
      var pris = tous.filter(function (x) { return tout[id + "/" + x.e.id]; });
      if (!pris.length) continue;
      lignes.push("## " + cap.titre, "");
      pris.forEach(function (x) {
        var a = tout[id + "/" + x.e.id];
        lignes.push("### " + (LIBELLES[a.avis] || "(sans avis)") + " — " + x.e.titre);
        lignes.push("*" + x.ou + " · `" + id + "/" + x.e.id + "`*");
        if (x.e.verifier && x.e.verifier.length) {
          lignes.push("", "Points signalés par l'auteur :");
          x.e.verifier.forEach(function (v) { lignes.push("- " + v.replace(/\*\*/g, "")); });
        }
        if (a.note) lignes.push("", "> " + a.note.split("\n").join("\n> "));
        lignes.push("");
      });
    }
    if (c.total === 0) lignes.push("_Aucun avis n'a encore été donné._");
    return lignes.join("\n");
  }

  function montrerReleve() {
    var tout = lireAvis();
    var fond = document.createElement("div");
    fond.className = "releve-fond";
    fond.innerHTML = '<div class="releve">'
      + "<h2>Votre relevé de relecture</h2>"
      + '<p>Mettez votre nom, puis enregistrez le fichier et renvoyez-le. '
      + "Vous pouvez aussi tout sélectionner et le coller dans un message.</p>"
      + '<p><input type="text" id="nom-relecteur" placeholder="votre nom" '
      + 'style="font:inherit;padding:8px 12px;border:2px solid #d6dee7;border-radius:8px;width:260px" '
      + 'value="' + esc(tout.__nom || "") + '"></p>'
      + '<textarea id="texte-releve" readonly></textarea>'
      + '<div class="actions-releve">'
      + '<button type="button" data-agir="telecharger">↧ Enregistrer le fichier</button>'
      + '<button type="button" class="second" data-agir="copier">Tout sélectionner</button>'
      + '<button type="button" class="second" data-agir="fermer-releve">Fermer</button>'
      + "</div></div>";
    document.body.appendChild(fond);

    var zone = fond.querySelector("#texte-releve");
    var champNom = fond.querySelector("#nom-relecteur");
    var refaire = function () { zone.value = releveMarkdown(); };
    refaire();

    champNom.addEventListener("input", function () {
      var t = lireAvis();
      t.__nom = champNom.value;
      ecrireAvis(t);
      refaire();
    });

    fond.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-agir]");
      if (!b) { if (ev.target === fond) fond.remove(); return; }
      if (b.dataset.agir === "fermer-releve") fond.remove();
      if (b.dataset.agir === "copier") { zone.select(); }
      if (b.dataset.agir === "telecharger") {
        var t = lireAvis();
        var qui = (t.__nom || "relecteur").replace(/[^\w\- ]+/g, "").replace(/\s+/g, "-");
        var lien = document.createElement("a");
        lien.href = URL.createObjectURL(new Blob([zone.value], { type: "text/markdown;charset=utf-8" }));
        lien.download = "relecture-" + qui + ".md";
        lien.click();
        URL.revokeObjectURL(lien.href);
      }
    });
  }

  /* -------------------------------------------------------------------
     L'ACCUEIL, DANS LE MÊME MOTEUR
     « Qu'est-ce que je veux réviser ? » n'a pas besoin d'être une page à
     part. Le garder ici permet à la version « un seul fichier » de passer
     d'un sujet à l'autre — et évite d'écrire deux fois la même liste.
     ------------------------------------------------------------------- */
  function peindreAccueil(racine) {
    /* Ordre PÉDAGOGIQUE, déclaré par chaque capsule. Sans lui, la liste
       sort dans l'ordre alphabétique des fichiers et l'on propose les
       classes de sécurité avant d'avoir montré un circuit. */
    var ids = Object.keys(window.CAPSULES).sort(function (a, b) {
      var oa = window.CAPSULES[a].ordre, ob = window.CAPSULES[b].ordre;
      if (oa == null && ob == null) return a.localeCompare(b, "fr");
      if (oa == null) return 1;
      if (ob == null) return -1;
      return oa - ob;
    });

    if (window.RELECTURE && !document.getElementById("barre-relecture")) barreRelecture();
    var h = '<header class="accueil-tete"><h1>Qu\'est-ce que je veux réviser ?</h1>'
      + "<p>Un sujet, <b>un seul</b>. Cinq à sept écrans, pas davantage. Et à chaque fois "
      + "qu'une notion voisine apparaît, on vous propose d'en <b>savoir plus</b> — vous ouvrez "
      + "si vous voulez, le fil ne s'allonge pas si vous ne voulez pas.</p></header>"
      + '<main class="sujets">';

    h += ids.map(function (id) {
      var c = window.CAPSULES[id];
      var nd = c.detours ? Object.keys(c.detours).length : 0;
      var niv = (c.niveau || "découverte").replace(/é/g, "e").replace(/è/g, "e");
      return '<a class="sujet-carte" href="#" data-sujet="' + esc(id) + '">'
        + "<h2>" + esc(c.titre) + "</h2>"
        + '<p class="q">' + esc(c.question || "") + "</p>"
        + '<div class="pied">'
        + '<span class="et ' + esc(niv) + '">' + esc(c.niveau || "découverte") + "</span>"
        + '<span class="et">' + c.fil.length + " écrans</span>"
        + (c.minutes ? '<span class="et">' + c.minutes + " min</span>" : "")
        + (nd ? '<span class="et">+ ' + nd + " en savoir plus</span>" : "")
        + (c.suppose ? '<span class="suppose">après « ' + esc(c.suppose) + " »</span>" : "")
        + "</div></a>";
    }).join("");

    h += "</main>";

    var z = document.getElementById("capsule");
    if (!z) {
      z = document.createElement("div");
      z.id = "capsule";
      document.body.appendChild(z);
    }
    document.body.classList.remove("dans-detour");
    z.innerHTML = h;

    /* Une seule fois : on revient à l'accueil autant de fois qu'on veut,
       et un écouteur par retour ouvrirait le sujet en double. */
    if (!window.__accueilBranche) {
      window.__accueilBranche = true;
      document.body.addEventListener("click", function (ev) {
        var a = ev.target.closest("[data-sujet]");
        if (!a) return;
        ev.preventDefault();
        var c = window.CAPSULES[a.dataset.sujet];
        if (c) new Lecteur(c, racine, true).demarrer();
      });
    }
  }

  /* Un atelier complet dans une seule page : la liste, puis les capsules,
     et le retour à la liste. C'est la forme utilisée par le fichier
     autonome, et elle vaut aussi en production. */
  window.jouerAtelier = function (racine) {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () { window.jouerAtelier(racine); });
      return;
    }
    racine = racine || "";
    window.__retourAccueil = function () { peindreAccueil(racine); };
    var ids = Object.keys(window.CAPSULES);
    var id = new URLSearchParams(location.search).get("sujet");
    var c = id ? window.CAPSULES[id] : null;

    /* Un accueil qui ne propose qu'un seul sujet est un écran perdu :
       on ouvre directement. */
    if (!c && ids.length === 1) c = window.CAPSULES[ids[0]];

    if (c) new Lecteur(c, racine, ids.length > 1).demarrer();
    else peindreAccueil(racine);
  };

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
