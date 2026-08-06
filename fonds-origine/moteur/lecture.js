/* =====================================================================
   lecture.js — « Écouter cette fiche » : lecture à voix haute du contenu
   ---------------------------------------------------------------------
   POURQUOI CETTE APPROCHE, ET PAS DES FICHIERS ENREGISTRÉS
   Les capsules de sécurité (CAPSULES-SECURITE.md) dramatisent quelques
   scènes fixes et se figent une fois enregistrées — c'est voulu, elles
   racontent un scénario écrit une fois pour toutes. Ici il faut lire
   N'IMPORTE QUELLE fiche, TOUJOURS À JOUR : les 81 cartes changent à
   chaque session, et la relecture métier n'est pas terminée (REPRISE
   § 6, priorité 1). Enregistrer aujourd'hui figerait une voix sur du
   contenu qui n'a pas fini d'être validé.

   La lecture EN DIRECT, via l'API du navigateur — déjà éprouvée dans
   HAL (fonction halParler) — n'a pas ce défaut : elle lit le texte
   affiché à l'instant T, donc jamais périmée, et coûte 0 Ko : aucun
   fichier à committer, aucune régénération à chaque correction.

   CE QUE ÇA SERT — une aide à la lecture pour le public FLE / DYS visé
   par le pack ([[feedback_accessibilite_cap]]), en complément de la
   future police adaptable (REPRISE § 6, non codée). Un bouton, jamais
   un déclenchement automatique — même règle que le son des planches.

   CE QUE ÇA NE GARANTIT PAS — la voix dépend de l'appareil du lecteur.
   Assumé : c'est un outil d'aide, pas la narration officielle du pack.
   Sur la machine de F. Henninot, la meilleure voix disponible est la
   même que celle triée par HAL (Denise/Henri si Edge, sinon la
   meilleure voix française du système).
   ===================================================================== */
(function () {
  "use strict";
  if (!window.speechSynthesis) return; // navigateur trop ancien : rien ne se propose

  var RANG = ["google", "natural", "naturel", "denise", "henri", "julie", "paul", "hortense"];
  var enLecture = null; // le bouton actuellement en lecture, ou null

  function meilleureVoixFr() {
    var toutes = window.speechSynthesis.getVoices() || [];
    var fr = toutes.filter(function (v) { return /^fr/i.test(v.lang); });
    for (var i = 0; i < RANG.length; i++) {
      var cle = RANG[i];
      var v = fr.find(function (x) { return x.name.toLowerCase().indexOf(cle) !== -1; });
      if (v) return v;
    }
    return fr[0] || null;
  }

  /* Le texte à lire : titre puis corps puis blocs, HTML retiré. Les notes
     formateur ne sont de toute façon jamais dans le build élève, mais on
     les exclut explicitement ici aussi — cette fonction ne doit jamais
     dépendre de ce qui a été purgé ailleurs.

     `textContent` ne respecte PAS les limites de blocs : "<p>A</p><p>B</p>"
     donne "AB" collés, pas "A B". Les fiches sont écrites en `<p>` sans
     espace entre eux (concaténation de chaînes dans cartes.js) — sans ce
     correctif, la voix enchaînait « ce module.C'est le scénario » sans
     pause. On force un espace après chaque fermeture de bloc AVANT de
     parser, pendant que c'est encore du texte et non du DOM. */
  function espaceLesBlocs(html) {
    return String(html).replace(/<\/(p|li|div|h[1-6]|blockquote|td|tr)>/gi, "</$1> ");
  }
  function texteDe(carte) {
    var brut = espaceLesBlocs(
      (carte.titre || "") + ". " +
      (carte.corps || "") + " " +
      (carte.blocs || []).map(function (b) {
        return (b.t ? b.t + ". " : "") + (b.html || "");
      }).join(" ")
    );
    var d = document.createElement("div");
    d.innerHTML = brut;
    return d.textContent.replace(/\s+/g, " ").trim();
  }

  function arreter() {
    window.speechSynthesis.cancel();
    if (enLecture) { enLecture.classList.remove("actif"); enLecture.textContent = "🔊 Écouter cette fiche"; }
    enLecture = null;
  }

  function lire(bouton, carte) {
    if (enLecture === bouton) { arreter(); return; } // un second clic arrête
    arreter(); // jamais deux lectures en même temps
    var texte = texteDe(carte);
    if (!texte) return;
    var u = new SpeechSynthesisUtterance(texte);
    u.lang = "fr-FR";
    var v = meilleureVoixFr();
    if (v) u.voice = v;
    u.onend = arreter;
    u.onerror = arreter;
    enLecture = bouton;
    bouton.textContent = "⏸ Arrêter la lecture";
    bouton.classList.add("actif");
    window.speechSynthesis.speak(u);
  }

  window.PiloteLecture = {
    disponible: function () { return !!window.speechSynthesis; },
    html: function () {
      return '<button type="button" class="ecouter" data-lecture>🔊 Écouter cette fiche</button>';
    },
    brancher: function (racine, carte) {
      var b = (racine || document).querySelector("[data-lecture]");
      if (b) b.addEventListener("click", function () { lire(b, carte); });
    },
    arreter: arreter,
  };

  // On ne laisse jamais une lecture continuer sur une page qu'on a quittée.
  document.addEventListener("visibilitychange", function () { if (document.hidden) arreter(); });
})();
