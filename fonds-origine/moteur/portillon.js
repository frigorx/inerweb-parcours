/* =====================================================================
   portillon.js — écran de code d'accès devant une page réservée
   ---------------------------------------------------------------------
   Sert `formateur.html` et `projection.html`, qui ne chargent leurs
   scripts qu'APRÈS validation du code : rien ne démarre avant.

   NIVEAU 1 — ce portillon porte le code court, celui de la direction et des
   collègues, le même qui ouvre les documents du projet. Les examens du pack
   relèvent du niveau 2 (la phrase), géré par `moteur.js`.

   CE QUE C'EST : un RIDEAU pédagogique, pas un coffre. Le code d'accès se
   donne en salle ; il écarte le visiteur de passage, pas quelqu'un de
   déterminé. Deux raisons de ne pas se raconter d'histoires :
     · l'empreinte comparée ici est un djb2 de 32 bits — on peut fabriquer
       une autre chaîne qui donne le même nombre. Allonger le code
       renforce le COFFRE (`documents.html`, vrai chiffrement), pas ce
       portillon-ci ;
     · surtout, les bonnes réponses des questions d'entraînement sont
       DÉJÀ en clair dans `pack.eleve.js` — elles doivent y être, c'est le
       navigateur qui corrige. Chiffrer ces pages ne cacherait donc rien
       qui ne soit accessible autrement.
   La vraie confidentialité est ailleurs, et elle est déjà en place : les
   85 questions officielles et les 10 sujets vivent dans le dépôt privé
   `habilitation-fluide`, hors ligne. Voir REPRISE § 4.

   Le code en clair n'est écrit NULLE PART dans le dépôt.

   API : Portillon.exiger("Titre", ["a.js", "b.js"], function () { … })
   L'écran se superpose à la page (il ne l'écrase pas : `projection.html`
   a besoin de son DOM intact).
   ===================================================================== */
(function () {
  "use strict";

  var EMPREINTE = 3069038059; // djb2 du code d'accès (donné en salle)
  var CLE = "pilote_acces_fluides-habilitation"; // partagée avec moteur.js

  function empreinte(txt) {
    var h = 5381;
    for (var i = 0; i < txt.length; i++) h = (h * 33 + txt.charCodeAt(i)) >>> 0;
    return h;
  }

  function deverrouille() {
    try { return localStorage.getItem(CLE) === "oui"; } catch (e) { return false; }
  }

  /* Charge les scripts dans l'ordre, puis appelle `fin`. */
  function charger(sources, fin) {
    if (!sources || !sources.length) return fin && fin();
    var s = document.createElement("script");
    s.src = sources[0];
    s.onload = function () { charger(sources.slice(1), fin); };
    s.onerror = function () {
      alert("Fichier introuvable : " + sources[0]);
    };
    document.head.appendChild(s);
  }

  function ecran(titre, ouvrir) {
    var v = document.createElement("div");
    v.id = "portillon";
    v.setAttribute("role", "dialog");
    v.setAttribute("aria-modal", "true");
    v.style.cssText =
      "position:fixed; inset:0; z-index:99999; background:#fff; overflow:auto; " +
      "font-family:system-ui,-apple-system,'Segoe UI',sans-serif; line-height:1.6; color:#1b2430";
    v.innerHTML =
      "<div style='max-width:32em; margin:12vh auto; padding:0 1.5em'>" +
      "<h1 style='font-size:1.4em; margin:0 0 .3em'>🔒 " + titre + "</h1>" +
      "<p style='color:#5b6472'>Cette page est réservée au formateur. Elle s'ouvre avec le " +
      "<b>code d'accès</b> — le même que celui des documents du projet.</p>" +
      // On ne force PAS `inputmode='numeric'` : le code de niveau 1 est
      // numérique aujourd'hui, mais s'il devenait une phrase, un clavier de
      // téléphone verrouillé sur les chiffres la rendrait intapable.
      // `autocapitalize`/`autocorrect` désactivés : une correction automatique
      // casse un code en silence, et l'utilisateur ne comprend pas pourquoi.
      "<p><input id='p-code' type='password' autocomplete='off' spellcheck='false' " +
      "autocapitalize='none' autocorrect='off' aria-label=\"Code d'accès\" " +
      "placeholder='Le code d&#39;accès…' style='font-size:1.05em; padding:.5em .7em; " +
      "width:min(100%, 18em); border:2px solid #1e5fa8; border-radius:8px'>" +
      "<button id='p-ok' style='font-size:1.05em; padding:.55em 1.1em; margin-left:.5em; border:0; border-radius:8px; background:#1e5fa8; color:#fff; cursor:pointer'>Ouvrir ▸</button></p>" +
      "<p id='p-err' style='display:none; color:#b0231f; font-weight:600'>Ce n'est pas le bon code.</p>" +
      "<p style='color:#5b6472; font-size:.92em'>Une fois le bon code saisi, cet appareil reste déverrouillé. " +
      "L'<a href='./' style='color:#1e5fa8'>application élève</a> reste accessible sans code.</p>" +
      "</div>";
    document.body.appendChild(v);

    var champ = document.getElementById("p-code");
    var valider = function () {
      if (empreinte(champ.value.trim()) === EMPREINTE) {
        try { localStorage.setItem(CLE, "oui"); } catch (e) {}
        v.parentNode.removeChild(v);
        ouvrir();
      } else {
        document.getElementById("p-err").style.display = "block";
        champ.select();
        champ.focus();
      }
    };
    document.getElementById("p-ok").onclick = valider;
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") valider(); });
    champ.focus();
  }

  window.Portillon = {
    exiger: function (titre, sources, fin) {
      var ouvrir = function () { charger(sources, fin); };
      if (deverrouille()) return ouvrir();
      if (document.body) ecran(titre, ouvrir);
      else document.addEventListener("DOMContentLoaded", function () { ecran(titre, ouvrir); });
    },
  };
})();
