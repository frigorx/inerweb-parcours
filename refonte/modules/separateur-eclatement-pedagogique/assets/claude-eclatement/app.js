(function () {
  "use strict";

  function defs() {
    return '<defs>' +
      '<marker id="hot-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c0392b"/></marker>' +
      '<marker id="oil-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#9a6500"/></marker>' +
      '<pattern id="mesh" width="11" height="11" patternUnits="userSpaceOnUse">' +
      '<path d="M0 11 L11 0" stroke="#7d8fa3" stroke-width="2"/><path d="M0 0 L11 11" stroke="#7d8fa3" stroke-width="2"/></pattern>' +
      '</defs>';
  }

  // Symbole normalisé repris de la bibliothèque technique inerWeb (engine.js).
  function librarySeparator(x, y, width, height, label) {
    return '<g role="img" aria-label="' + label + '">' +
      '<svg x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" viewBox="-14.0 -18.0 30 40" overflow="visible">' +
      '<polyline points="1,7 6,2 9,2" fill="none" stroke="#000" stroke-width="1"/>' +
      '<line x1="0" y1="-10" x2="0" y2="-2" stroke="#000" stroke-width="1"/>' +
      '<polyline points="-8,-13 8,-13 8,5 0,13 -8,5 -8,-13" fill="none" stroke="#000" stroke-width="1"/>' +
      '<ellipse cx="0.0" cy="8.0" rx="2.0" ry="1.0" fill="none" stroke="#000" stroke-width="1"/>' +
      '<circle cx="0" cy="14" r="1.5" fill="#000"/><circle cx="-9" cy="-10" r="1.5" fill="#000"/>' +
      '<circle cx="9" cy="-10" r="1.5" fill="#000"/><circle cx="9" cy="2" r="1.5" fill="#000"/>' +
      '</svg></g>';
  }

  // Compresseur de la bibliothèque technique inerWeb.
  function compressor(x, y, scale) {
    return '<g role="img" aria-label="Compresseur de la bibliothèque technique inerWeb" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' +
      '<circle cx="0" cy="0" r="15" fill="#fffdf8" stroke="#000"/><line x1="-15" y1="0" x2="-16" y2="0" stroke="#000"/><line x1="15" y1="0" x2="16" y2="0" stroke="#000"/>' +
      '<line x1="-7" y1="-13" x2="13" y2="-7" stroke="#000"/><line x1="-7" y1="13" x2="13" y2="7" stroke="#000"/>' +
      '<circle cx="-16" cy="0" r="1.5"/><circle cx="16" cy="0" r="1.5"/><circle cx="-10" cy="10" r="1.5"/><circle cx="2" cy="11" r="1.5"/><circle cx="-10" cy="-10" r="1.5"/></g>';
  }

  function wrap(title, description, body) {
    return '<svg viewBox="0 0 720 330" role="img" aria-label="' + title + '"><title>' + title + '</title><desc>' + description + '</desc>' + defs() + body + '</svg>';
  }

  // Chevrons statiques : leur espacement dit la vitesse, la légende la nomme aussi.
  function chevrons(x0, y, count, step, colour) {
    var out = "";
    for (var i = 0; i < count; i++) {
      var x = x0 + i * step;
      out += '<path d="M' + x + ' ' + (y - 9) + ' L' + (x + 9) + ' ' + y + ' L' + x + ' ' + (y + 9) + '" fill="none" stroke="' + colour + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    return out;
  }

  var scenes = [
    {
      name: "Ouverture", duration: 4,
      description: "Il existe deux familles de séparateurs d’huile. Celle-ci n’a pas d’élément filtrant : elle sépare par le choc.",
      draw: function () { return wrap("Le séparateur à éclatement", this.description,
        '<rect class="panel" x="70" y="48" width="580" height="234" rx="30"/>' +
        librarySeparator(316, 66, 88, 88, "Symbole normalisé du séparateur d’huile, bibliothèque technique inerWeb") +
        '<text class="hero" x="360" y="190" text-anchor="middle">LE SÉPARATEUR</text>' +
        '<text class="hero" x="360" y="234" text-anchor="middle">À ÉCLATEMENT</text>' +
        '<rect x="290" y="246" width="140" height="6" rx="3" fill="#c9451a"/>' +
        '<text class="small" x="360" y="274" text-anchor="middle">l’autre façon de récupérer l’huile · lecture commandée par l’élève</text>'); }
    },
    {
      name: "Deux familles", duration: 9,
      description: "À coalescence, le gaz traverse un élément filtrant. À éclatement, il est projeté sur un obstacle. Même but, deux moyens.",
      draw: function () { return wrap("Les deux familles de séparateurs d’huile", this.description,
        '<text class="heading" x="360" y="26" text-anchor="middle">1 · DEUX FAMILLES, UN MÊME BUT</text>' +
        '<line class="divider" x1="360" y1="44" x2="360" y2="268"/>' +
        // Colonne gauche : coalescence
        '<text class="label" x="180" y="62" text-anchor="middle">À COALESCENCE</text>' +
        '<rect class="panel" x="108" y="76" width="144" height="150" rx="18"/>' +
        '<rect x="122" y="128" width="116" height="34" fill="url(#mesh)"/>' +
        '<rect x="122" y="128" width="116" height="34" fill="none" stroke="#7d8fa3" stroke-width="3"/>' +
        '<path class="pipe hot thin" d="M62 104 H108"/><path class="pipe hot thin" d="M180 76 V44"/>' +
        '<rect class="film-oil" x="114" y="196" width="132" height="24" rx="8"/>' +
        '<text class="small" x="180" y="248" text-anchor="middle">un élément filtrant</text>' +
        '<text class="small" x="180" y="266" text-anchor="middle">rassemble les gouttelettes</text>' +
        // Colonne droite : éclatement
        '<text class="label" x="540" y="62" text-anchor="middle">À ÉCLATEMENT</text>' +
        '<rect class="panel" x="468" y="76" width="144" height="150" rx="18"/>' +
        '<rect class="metal" x="556" y="98" width="12" height="98" rx="4"/>' +
        '<path class="jet" d="M486 132 H548"/>' +
        '<path class="pipe hot thin" d="M422 132 H468"/><path class="pipe hot thin" d="M540 76 V44"/>' +
        '<rect class="film-oil" x="474" y="196" width="132" height="24" rx="8"/>' +
        '<text class="small" x="540" y="248" text-anchor="middle">une plaque de choc</text>' +
        '<text class="small" x="540" y="266" text-anchor="middle">arrête le jet</text>' +
        '<text class="label" x="360" y="298" text-anchor="middle">Même but : récupérer l’huile au refoulement</text>' +
        '<text class="small" x="360" y="320" text-anchor="middle">rouge : gaz refoulé · jaune : huile · le mot accompagne toujours la couleur</text>'); }
    },
    {
      name: "Le choc", duration: 13,
      description: "Le refoulement arrive par une buse à grande vitesse, le jet éclate sur la plaque de choc, et le gaz repart en changeant de direction.",
      draw: function () { return wrap("Le jet éclate sur la plaque de choc", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">2 · LE JET ÉCLATE SUR LA PLAQUE</text>' +
        // Corps du séparateur
        '<rect class="panel" x="150" y="62" width="336" height="212" rx="26"/>' +
        // Entrée refoulement + buse
        '<path class="pipe hot" d="M22 148 H150" marker-end="url(#hot-arrow)"/>' +
        '<rect class="metal" x="150" y="136" width="96" height="24" rx="5"/>' +
        '<path class="metal" d="M228 136 L246 142 L246 154 L228 160 Z"/>' +
        // Jet et plaque
        '<path class="jet" d="M250 148 H366"/>' +
        '<rect class="metal" x="372" y="82" width="16" height="156" rx="5"/>' +
        '<circle class="burst" cx="396" cy="148" r="6"/><circle class="burst d2" cx="396" cy="152" r="5"/><circle class="burst d3" cx="394" cy="144" r="4"/>' +
        // Gaz qui vire vers la sortie
        '<path class="gas-turn" d="M362 128 Q392 78 436 74 H486"/>' +
        '<path class="pipe hot" d="M486 74 H690" marker-end="url(#hot-arrow)"/>' +
        // Nappe au fond
        '<rect class="film-oil" x="158" y="238" width="320" height="28" rx="10"/>' +
        // Légendes, toutes hors des tracés
        '<text class="warn-text" x="22" y="132">refoulement (HP)</text>' +
        '<text class="small" x="196" y="182" text-anchor="middle">buse</text>' +
        '<text class="label" x="404" y="70">plaque de choc</text>' +
        '<text class="small" x="690" y="58" text-anchor="end">vers le condenseur</text>' +
        '<text class="small" x="142" y="252" text-anchor="end">l’huile tombe au fond</text>' +
        '<text class="small" x="360" y="304" text-anchor="middle">Les gouttes s’écrasent sur la plaque et se rassemblent ; le gaz, lui, change de direction.</text>' +
        '<text class="small" x="360" y="324" text-anchor="middle">Coupe de principe : la forme interne réelle est celle de la notice du constructeur.</text>'); }
    },
    {
      name: "La vitesse", duration: 10,
      description: "La buse a une petite section : le gaz y est rapide. Le corps a une grande section : la vitesse s’effondre, et l’huile ne suit plus.",
      draw: function () { return wrap("Chute de vitesse entre la buse et le corps", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">3 · LA SECTION S’OUVRE, LA VITESSE TOMBE</text>' +
        '<line class="divider" x1="360" y1="44" x2="360" y2="252"/>' +
        // Gauche : la buse
        '<text class="warn-text" x="180" y="62" text-anchor="middle">DANS LA BUSE</text>' +
        '<rect class="metal" x="86" y="104" width="188" height="26" rx="6"/>' +
        chevrons(102, 117, 6, 28, "#c0392b") +
        '<text class="label" x="180" y="158" text-anchor="middle">petite section</text>' +
        '<text class="small" x="180" y="180" text-anchor="middle">le gaz est rapide, l’huile suit</text>' +
        // Droite : le corps
        '<text class="good-text" x="540" y="62" text-anchor="middle">DANS LE CORPS</text>' +
        '<rect class="panel" x="440" y="80" width="200" height="112" rx="16"/>' +
        chevrons(468, 136, 3, 62, "#c0392b") +
        '<text class="label" x="540" y="212" text-anchor="middle">grande section</text>' +
        '<text class="small" x="540" y="234" text-anchor="middle">le gaz ralentit d’un coup</text>' +
        // Conséquence : l'inertie
        '<rect class="warn-panel" x="120" y="262" width="480" height="54" rx="16"/>' +
        '<text class="warn-text" x="360" y="286" text-anchor="middle">L’HUILE EST BIEN PLUS DENSE QUE LE GAZ</text>' +
        '<text class="small" x="360" y="308" text-anchor="middle">trop lourde pour suivre le virage, elle continue tout droit et frappe la plaque</text>' +
        '<text class="small" x="180" y="212" text-anchor="middle">Ordre de grandeur pédagogique :</text>' +
        '<text class="small" x="180" y="230" text-anchor="middle">la notice du constructeur fait foi.</text>'); }
    },
    {
      name: "La paroi", duration: 9,
      description: "L’huile séparée ruisselle le long de la plaque et de la paroi, forme un film, puis s’accumule au fond du corps.",
      draw: function () { return wrap("Film d’huile sur la plaque et la paroi", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">4 · L’HUILE RUISSELLE ET S’ACCUMULE</text>' +
        '<rect class="panel" x="188" y="52" width="344" height="220" rx="26"/>' +
        '<rect class="metal" x="346" y="70" width="16" height="140" rx="5"/>' +
        // Films d'huile : plaque, paroi droite, paroi gauche
        '<rect class="film-oil" x="362" y="86" width="10" height="126" rx="3"/>' +
        '<rect class="film-oil" x="508" y="96" width="12" height="132" rx="4"/>' +
        '<rect class="film-oil" x="200" y="112" width="9" height="116" rx="3"/>' +
        // Gouttes qui descendent
        '<circle class="drop down d1" cx="367" cy="150" r="6"/><circle class="drop down d2" cx="514" cy="160" r="6"/>' +
        '<circle class="drop down d3" cx="204" cy="170" r="5"/>' +
        // Nappe au fond
        '<rect class="film-oil" x="196" y="228" width="328" height="36" rx="12"/>' +
        '<path class="oil-flow" d="M240 246 H480"/>' +
        '<text class="label" x="392" y="82">film d’huile</text>' +
        '<text class="small" x="540" y="120" text-anchor="start">et sur la paroi</text>' +
        '<text class="warn-text" x="360" y="292" text-anchor="middle">LE CORPS SERT AUSSI DE PETITE RÉSERVE</text>' +
        '<text class="small" x="360" y="316" text-anchor="middle">Cette réserve ne remplace pas un réservoir d’huile : elle en tient lieu sur les petites installations.</text>'); }
    },
    {
      name: "Le retour", duration: 10,
      description: "Un flotteur commande un pointeau : le niveau monte, le pointeau s’ouvre ; le niveau baisse, il referme et le gaz chaud ne passe pas.",
      draw: function () { return wrap("Retour d’huile par flotteur et pointeau", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">5 · LE FLOTTEUR COMMANDE LE POINTEAU</text>' +
        '<rect class="panel" x="150" y="48" width="300" height="200" rx="24"/>' +
        '<rect class="film-oil" x="158" y="164" width="284" height="76" rx="12"/>' +
        // Flotteur, levier et pointeau
        '<circle cx="330" cy="150" r="24" fill="#dfe7ee" stroke="#1b3a63" stroke-width="4"/>' +
        '<line x1="306" y1="154" x2="240" y2="196" stroke="#1b3a63" stroke-width="6" stroke-linecap="round"/>' +
        '<path class="metal" d="M218 196 L262 196 L240 226 Z"/>' +
        '<line x1="146" y1="228" x2="214" y2="213" stroke="#637285" stroke-width="2"/>' +
        // Conduite de retour, gouttes en mouvement et voyant
        '<path class="pipe thin" d="M240 248 V292 H600" stroke="#9a6500" marker-end="url(#oil-arrow)"/>' +
        '<circle class="drop along d1" cx="380" cy="292" r="6"/><circle class="drop along d2" cx="380" cy="292" r="5"/>' +
        '<circle cx="520" cy="292" r="17" fill="#fff" stroke="#1b3a63" stroke-width="4"/>' +
        '<circle cx="520" cy="292" r="9" fill="#ffe100" opacity=".7"/>' +
        // Légendes, toutes posées hors des tracés et hors de la nappe
        '<text class="label" x="366" y="132">flotteur</text>' +
        '<text class="small" x="142" y="232" text-anchor="end">pointeau</text>' +
        '<text class="small" x="520" y="268" text-anchor="middle">voyant</text>' +
        '<text class="small" x="614" y="297" text-anchor="start">vers le carter</text>' +
        '<text class="warn-text" x="360" y="322" text-anchor="middle">LE RETOUR EST INTERMITTENT : OBSERVER UNE SÉQUENCE, PAS UN INSTANT</text>'); }
    },
    {
      name: "Ce qu’il sait faire", duration: 11,
      description: "Sans cartouche à remplacer et avec une faible perte de charge, mais le brouillard le plus fin traverse et poursuit sa route.",
      draw: function () { return wrap("Comparaison entre coalescence et éclatement", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">6 · CE QU’IL SAIT FAIRE, ET CE QU’IL NE SAIT PAS</text>' +
        '<rect class="panel" x="34" y="42" width="652" height="212" rx="20"/>' +
        '<text class="label" x="300" y="70">Coalescence</text>' +
        '<text class="warn-text" x="516" y="70">Éclatement</text>' +
        '<line x1="52" y1="82" x2="668" y2="82" stroke="#cbd5df" stroke-width="2"/>' +
        '<text class="small" x="52" y="110">Élément filtrant</text><text class="label" x="300" y="110">oui, à remplacer</text><text class="label" x="516" y="110">aucun</text>' +
        '<text class="small" x="52" y="148">Perte de charge</text><text class="label" x="300" y="148">plus élevée</text><text class="label" x="516" y="148">faible</text>' +
        '<text class="small" x="52" y="186">Brouillard fin</text><text class="label" x="300" y="186">retenu</text><text class="label" x="516" y="186">passe en partie</text>' +
        '<text class="small" x="52" y="224">Emploi courant</text><text class="label" x="300" y="224">centrales, longues lignes</text><text class="label" x="516" y="224">petites installations</text>' +
        '<line x1="52" y1="124" x2="668" y2="124" stroke="#eef2f6" stroke-width="2"/>' +
        '<line x1="52" y1="162" x2="668" y2="162" stroke="#eef2f6" stroke-width="2"/>' +
        '<line x1="52" y1="200" x2="668" y2="200" stroke="#eef2f6" stroke-width="2"/>' +
        '<circle class="mist" cx="60" cy="278" r="4"/><circle class="mist d2" cx="60" cy="286" r="3"/>' +
        '<text class="warn-text" x="360" y="284" text-anchor="middle">LE BROUILLARD LE PLUS FIN TRAVERSE</text>' +
        '<text class="small" x="360" y="308" text-anchor="middle">Le retour d’huile naturel des tuyauteries reste donc nécessaire : aucun séparateur ne récupère tout.</text>'); }
    },
    {
      name: "À retenir", duration: 8,
      description: "Le jet éclate sur une plaque, la vitesse s’écroule et l’huile ne suit plus, l’organe est simple et robuste mais moins fin.",
      draw: function () { return wrap("Récapitulatif du séparateur à éclatement", this.description,
        '<text class="heading" x="360" y="28" text-anchor="middle">7 · TROIS POINTS À RETENIR</text>' +
        '<rect class="panel" x="30" y="66" width="210" height="200" rx="22"/>' +
        '<circle cx="135" cy="110" r="25" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="135" y="116" text-anchor="middle">1</text>' +
        '<text class="heading" x="135" y="160" text-anchor="middle">LE CHOC</text>' +
        '<text class="small" x="135" y="192" text-anchor="middle">une plaque, pas</text><text class="small" x="135" y="212" text-anchor="middle">de cartouche</text>' +
        '<rect class="panel" x="255" y="66" width="210" height="200" rx="22"/>' +
        '<circle cx="360" cy="110" r="25" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="360" y="116" text-anchor="middle">2</text>' +
        '<text class="heading" x="360" y="160" text-anchor="middle">LA VITESSE</text>' +
        '<text class="small" x="360" y="192" text-anchor="middle">elle s’écroule :</text><text class="small" x="360" y="212" text-anchor="middle">l’huile ne suit plus</text>' +
        '<rect class="panel" x="480" y="66" width="210" height="200" rx="22"/>' +
        '<circle cx="585" cy="110" r="25" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="585" y="116" text-anchor="middle">3</text>' +
        '<text class="heading" x="585" y="160" text-anchor="middle">LA LIMITE</text>' +
        '<text class="small" x="585" y="192" text-anchor="middle">simple et robuste,</text><text class="small" x="585" y="212" text-anchor="middle">mais moins fin</text>' +
        '<text class="label" x="360" y="296" text-anchor="middle">Choisir la famille sur l’installation réelle, jamais sur le prix seul.</text>' +
        '<text class="small" x="360" y="320" text-anchor="middle">Sur une centrale ou une longue tuyauterie, on préfère un coalescent.</text>'); }
    }
  ];

  var root = document.getElementById("player");
  var host = document.getElementById("svg-host");
  var count = document.getElementById("scene-count");
  var name = document.getElementById("scene-name");
  var description = document.getElementById("scene-description");
  var live = document.getElementById("live-scene");
  var progress = document.getElementById("progress");
  var progressFill = document.getElementById("progress-fill");
  var previous = document.getElementById("previous-scene");
  var next = document.getElementById("next-scene");
  var toggle = document.getElementById("toggle-play");
  var state = { index:0, playing:false, finished:false, remaining:0, startedAt:0, frame:0 };

  function duration() { return scenes[state.index].duration * 1000; }
  function stopFrame() { if (state.frame) cancelAnimationFrame(state.frame); state.frame = 0; }
  function setProgress(value) { var p = Math.max(0,Math.min(100,value)); progressFill.style.width = p + "%"; progress.setAttribute("aria-valuenow",String(Math.round(p))); }
  function setPlaying(value) { state.playing=value; root.classList.toggle("is-playing",value); toggle.setAttribute("aria-pressed",value?"true":"false"); toggle.textContent=value?"Ⅱ Pause":(state.finished?"↻ Rejouer":"▶ Lire"); }
  function render(announce) {
    var scene=scenes[state.index]; host.innerHTML=scene.draw(); count.textContent=(state.index+1)+" / "+scenes.length; name.textContent=scene.name; description.textContent=scene.description;
    previous.disabled=state.index===0; next.disabled=state.index===scenes.length-1; if(announce) live.textContent=scene.name+". "+scene.description;
  }
  function select(index,announce,continuePlaying) {
    stopFrame(); state.index=Math.max(0,Math.min(scenes.length-1,index)); state.remaining=duration(); state.finished=false; setProgress(0); render(announce);
    if(continuePlaying){state.startedAt=performance.now();setPlaying(true);state.frame=requestAnimationFrame(tick);}else setPlaying(false);
  }
  function tick(now) {
    if(!state.playing)return; var left=Math.max(0,state.remaining-(now-state.startedAt)); setProgress(100*(1-left/duration()));
    if(left<=0){if(state.index<scenes.length-1)select(state.index+1,true,true);else{state.remaining=0;state.finished=true;setProgress(100);setPlaying(false);live.textContent="Animation terminée.";}return;}
    state.frame=requestAnimationFrame(tick);
  }
  function playPause() {
    if(state.playing){state.remaining=Math.max(0,state.remaining-(performance.now()-state.startedAt));stopFrame();setPlaying(false);live.textContent="Animation en pause.";return;}
    if(state.finished||state.remaining<=0){select(state.finished?0:state.index,false,true);live.textContent=state.finished?"Animation rejouée depuis le début.":"Animation lancée.";return;}
    state.startedAt=performance.now();setPlaying(true);state.frame=requestAnimationFrame(tick);live.textContent="Animation lancée.";
  }
  previous.addEventListener("click",function(){select(state.index-1,true,false);});
  next.addEventListener("click",function(){select(state.index+1,true,false);});
  toggle.addEventListener("click",playPause);
  document.addEventListener("visibilitychange",function(){if(document.hidden&&state.playing)playPause();});
  state.remaining=duration();setProgress(0);setPlaying(false);render(false);
})();
