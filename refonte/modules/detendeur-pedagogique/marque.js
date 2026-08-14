/* =====================================================================
   MARQUE — logo inerWeb Pilote + filigrane de propriété intellectuelle.
   ---------------------------------------------------------------------
   CONTRAT : script autonome, aucune dépendance au moteur. Il s'ajoute
   sur n'importe quelle page, à côté de lisibilite.js :
     <script src=".../moteur/marque.js"></script>
   Il pose le logo compact inerWeb Pilote (spécification figée, charte
   § 3.4 — orange DU LOGO #e8914a, distinct de l'orange du contenu) suivi
   de « © inerWeb <année> ». Décision F. Henninot 10/08/2026 (charte R8) :
   présent sur chaque page, chaque diapositive, chaque impression — sans
   nom personnel.

   TROIS MODES, et la raison de chacun — c'est mesuré, pas prudentiel :
     · `hote`     — la page marque un conteneur avec `data-marque-hote`
                    (la projection : son bas est pris par la barre de
                    pilotage). La marque entre DANS la diapositive, donc
                    dans toute capture d'écran.
     · `fixe`     — la page ne défile pas (cours en 100dvh, écrans
                    d'application) : filigrane fixe en bas à gauche.
     · `document` — la page défile. Un filigrane fixe passerait SUR le
                    texte : sur une page de 2 500 px, six chevauchements
                    comptés. La marque se range donc en FIN DE FLUX, et
                    redevient `fixed` À L'IMPRESSION, où elle se répète
                    en pied de chaque feuille — c'est là que la preuve
                    compte.
   Le mode est recalculé au redimensionnement (le zoom du bouton « Aa »
   rend une page fixe défilante).

   PIÈGES : le coin bas-DROIT est pris (boutons « Aa » et son), d'où la
   gauche. `moteur/impression.css` ne doit JAMAIS lister #marque-inerweb
   dans ce qu'elle masque.
   ===================================================================== */
(function () {
  "use strict";
  if (window.__marqueInerweb) return; // double inclusion : inoffensive
  window.__marqueInerweb = true;

  var ANNEE = "2026";

  /* Logo compact, cotes de la charte § 3.4 (viewBox 400×50 ramené à
     l'utile) : ❄️ + iner (Trebuchet gras) + Web (Segoe Script) #1b3a63,
     ligne et cartouche « Pilote » orange #e8914a, texte blanc. */
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 50" ' +
    'width="115" height="24" role="img" aria-label="inerWeb Pilote">' +
    '<text fill="#1b3a63" font-size="28px" x="4" y="34">❄️</text>' +
    '<text fill="#1b3a63" font-family="Trebuchet MS, Trebuchet, sans-serif" ' +
    'font-size="26px" font-weight="bold" x="44" y="32">iner</text>' +
    '<text fill="#1b3a63" font-family="Segoe Script, Brush Script MT, cursive" ' +
    'font-size="26px" x="94" y="32">Web</text>' +
    '<line stroke="#e8914a" stroke-width="2" x1="44" x2="150" y1="35" y2="35"/>' +
    '<rect fill="#e8914a" x="155" y="10" rx="5" ry="5" width="80" height="24"/>' +
    '<text fill="#ffffff" font-family="Segoe UI, Helvetica, Arial, sans-serif" ' +
    'font-size="14px" font-weight="bold" x="195" y="27" text-anchor="middle">Pilote</text>' +
    "</svg>";

  var css =
    "#marque-inerweb{display:flex;align-items:center;gap:7px;opacity:.55;" +
    "user-select:none;font-family:'Segoe UI',Calibri,Arial,sans-serif;" +
    "font-size:11px;color:#637285;background:none;border:0}" +
    "#marque-inerweb svg{display:block;flex:none}" +
    /* mode fixe : la page ne défile pas, rien à recouvrir */
    "#marque-inerweb.marque-fixe{position:fixed;left:12px;bottom:8px;z-index:40;" +
    "pointer-events:none}" +
    /* mode hôte : la page décide du placement (voir sa feuille) */
    "#marque-inerweb.marque-hebergee{position:absolute;pointer-events:none}" +
    /* mode document : en fin de flux, sous un filet — ne recouvre rien */
    "#marque-inerweb.marque-document{position:static;margin:2.4em auto .6em;" +
    "padding-top:.7em;border-top:1px solid rgba(27,58,99,.16);max-width:1100px;" +
    "opacity:.62}" +
    "@media (max-width:560px){#marque-inerweb{font-size:0;gap:0}" +
    "#marque-inerweb svg{width:86px;height:18px}}" +
    /* à l'impression : fixe, donc répétée en pied de chaque feuille */
    "@media print{#marque-inerweb{display:flex!important;position:fixed;" +
    "left:0;bottom:0;margin:0;padding:0;border:0;opacity:.8;color:#444}}";

  var el = null;

  /* PIÈGE MESURÉ (10/08) : la marque en flux AJOUTE ~80 px au document.
     Sur un cours calibré en 100dvh, elle crée donc elle-même le défilement
     qu'elle croit détecter — puis se range sous la ligne de flottaison,
     invisible. On mesure donc TOUJOURS en mode fixe (hors flux, aucun
     effet sur la hauteur), et on ne bascule en flux qu'ensuite. */
  function modeVoulu() {
    if (document.querySelector("[data-marque-hote]")) return "marque-hebergee";
    var avant = el ? el.className : "";
    if (el) el.className = "marque-fixe";
    var docH = document.documentElement.scrollHeight;
    var vueH = window.innerHeight || document.documentElement.clientHeight;
    if (el) el.className = avant;
    return docH > vueH + 4 ? "marque-document" : "marque-fixe";
  }

  function appliquerMode() {
    if (!el) return;
    var m = modeVoulu();
    if (el.className === m) return;
    el.className = m;
    // En mode document la marque doit être le DERNIER élément du flux ;
    // en mode fixe sa place dans le DOM n'a aucune importance.
    if (m !== "marque-hebergee" && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
  }

  function poser() {
    if (document.getElementById("marque-inerweb")) return;
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    el = document.createElement("div");
    el.id = "marque-inerweb";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = svg + "<span>© inerWeb " + ANNEE + "</span>";

    var hote = document.querySelector("[data-marque-hote]");
    el.className = hote ? "marque-hebergee" : "marque-fixe"; // hors flux d'abord
    (hote || document.body).appendChild(el);
    appliquerMode();

    // Le zoom du bouton « Aa » rend une page fixe défilante : on suit.
    var minuteur = null;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(appliquerMode, 150);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", poser);
  } else {
    poser();
  }
})();
