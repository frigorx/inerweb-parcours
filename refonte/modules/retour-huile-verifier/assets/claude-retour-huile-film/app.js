(function () {
  "use strict";

  function defs() {
    return '<defs>' +
      '<marker id="blue-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#1b3a63"/></marker>' +
      '<marker id="oil-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#9a6500"/></marker>' +
      '</defs>';
  }

  // Géométries reprises de la bibliothèque technique inerWeb.
  function compressor(x, y, scale) {
    return '<g role="img" aria-label="Compresseur de la bibliothèque technique inerWeb" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' +
      '<circle cx="0" cy="0" r="15" fill="#fffdf8" stroke="#000"/><line x1="-15" y1="0" x2="-16" y2="0" stroke="#000"/><line x1="15" y1="0" x2="16" y2="0" stroke="#000"/>' +
      '<line x1="-7" y1="-13" x2="13" y2="-7" stroke="#000"/><line x1="-7" y1="13" x2="13" y2="7" stroke="#000"/>' +
      '<circle cx="-16" cy="0" r="1.5"/><circle cx="16" cy="0" r="1.5"/><circle cx="-10" cy="10" r="1.5"/><circle cx="2" cy="11" r="1.5"/><circle cx="-10" cy="-10" r="1.5"/></g>';
  }

  function expansionValve(x, y, scale) {
    return '<g role="img" aria-label="Détendeur thermostatique de la bibliothèque technique inerWeb" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' +
      '<circle cx="0" cy="-12" r="5.83" fill="#fffdf8" stroke="#000"/><line x1="0" y1="-18" x2="0" y2="-20" stroke="#000"/>' +
      '<polygon points="2,1 0,3 -2,1 -10,5 -10,-5 10,5 10,-5 -2,1 0,0" fill="#fffdf8" stroke="#000"/><line x1="0" y1="0" x2="0" y2="-6" stroke="#000"/>' +
      '<line x1="10" y1="0" x2="11" y2="0" stroke="#000"/><line x1="-10" y1="0" x2="-11" y2="0" stroke="#000"/><circle cx="0" cy="-20" r="1.5"/><circle cx="11" cy="0" r="1.5"/><circle cx="-11" cy="0" r="1.5"/></g>';
  }

  function exchanger(x, y, scale, label) {
    return '<g role="img" aria-label="' + label + ', symbole d’échangeur à air de la bibliothèque technique inerWeb" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' +
      '<rect x="-18" y="-20" width="36" height="48" fill="none" stroke="#000"/><line x1="-19" y1="20" x2="19" y2="20" stroke="#000"/>' +
      '<line x1="-14" y1="16" x2="-14" y2="24" stroke="#000"/><line x1="-7" y1="16" x2="-7" y2="24" stroke="#000"/><line x1="0" y1="16" x2="0" y2="24" stroke="#000"/><line x1="7" y1="16" x2="7" y2="24" stroke="#000"/><line x1="14" y1="16" x2="14" y2="24" stroke="#000"/>' +
      '<circle cx="0" cy="-2" r="15" fill="none" stroke="#000"/><path d="M0 -2 C5 -15 13 -14 13 5 C2 5 -2 1 0 -2 C-5 10 -13 9 -13 5 C-5 -4 -2 -4 0 -2" fill="none" stroke="#000"/></g>';
  }

  function wrap(title, description, body) {
    return '<svg viewBox="0 0 720 330" role="img" aria-label="' + title + '"><title>' + title + '</title><desc>' + description + '</desc>' + defs() + body + '</svg>';
  }

  var scenes = [
    {
      name: "Ouverture", duration: 4,
      description: "Vue d’ensemble : l’huile quitte le compresseur, circule avec le fluide puis doit revenir au carter.",
      draw: function () { return wrap("Le retour d’huile", this.description,
        '<rect class="panel" x="80" y="55" width="560" height="220" rx="30"/><path class="oil-flow" d="M135 225 C235 125 485 125 585 225"/>' +
        '<path class="oil-fill" d="M360 65 C383 95 392 112 392 132 A32 32 0 1 1 328 132 C328 112 338 95 360 65 Z"/><text class="hero" x="360" y="183" text-anchor="middle">LE RETOUR D’HUILE</text><text class="warn-text" x="360" y="216" text-anchor="middle">suivre · comprendre · vérifier</text><text class="small" x="360" y="252" text-anchor="middle">Lecture commandée par l’élève</text>'); }
    },
    {
      name: "D’où vient l’huile ?", duration: 9,
      description: "Une petite fraction d’huile quitte le carter avec le gaz refoulé. Elle doit revenir sans vider le compresseur.",
      draw: function () { return wrap("L’huile quitte le carter", this.description,
        '<text class="heading" x="360" y="28" text-anchor="middle">1 · UNE PETITE PART D’HUILE QUITTE LE CARTER</text><rect class="panel" x="175" y="52" width="370" height="235" rx="26"/>' +
        '<rect class="panel" x="292" y="70" width="136" height="105" rx="10"/><rect x="305" y="111" width="110" height="34" rx="5" fill="#cbd5df" stroke="#1b3a63" stroke-width="3"/><path d="M360 145 L330 222" stroke="#1b3a63" stroke-width="10"/><circle cx="330" cy="222" r="29" fill="#fff" stroke="#1b3a63" stroke-width="5"/>' +
        '<rect class="oil-fill" x="205" y="238" width="310" height="29" rx="10"/><path class="pipe thin" d="M428 90 H595 V55" marker-end="url(#blue-arrow)"/><circle class="drop along d1" cx="455" cy="90" r="7"/><circle class="drop along d2" cx="455" cy="90" r="5"/><text class="label" x="470" y="80">gaz refoulé + traces d’huile</text><text class="small" x="360" y="312" text-anchor="middle">Le film d’huile protège les pièces mobiles.</text>'); }
    },
    {
      name: "Le trajet de l’huile", duration: 12,
      description: "Croix du frigoriste : compresseur à droite, condenseur en haut, détendeur à gauche et évaporateur en bas.",
      draw: function () { return wrap("Trajet de l’huile sur la croix du frigoriste", this.description,
        '<text class="heading" x="360" y="22" text-anchor="middle">2 · L’HUILE SUIT LA BOUCLE FRIGORIFIQUE</text><path class="pipe" d="M620 150 V74 H422" marker-end="url(#blue-arrow)"/><path class="pipe" d="M298 74 H108 V154" marker-end="url(#blue-arrow)"/><path class="pipe" d="M78 205 V280 H298" marker-end="url(#blue-arrow)"/><path class="pipe" d="M422 280 H505 V182 H555" marker-end="url(#blue-arrow)"/>' +
        exchanger(360,67,2.2,"Condenseur") + expansionValve(82,185,2.8) + exchanger(360,268,2.2,"Évaporateur") + '<rect class="accent-panel" x="545" y="112" width="145" height="125" rx="18"/>' + compressor(618,168,3.1) +
        '<text class="label" x="360" y="35" text-anchor="middle">CONDENSEUR</text><text class="label" x="105" y="238" text-anchor="middle">DÉTENDEUR</text><text class="label" x="360" y="325" text-anchor="middle">ÉVAPORATEUR</text><text class="label" x="618" y="254" text-anchor="middle">COMPRESSEUR</text>' +
        '<path class="oil-flow" d="M620 137 V87 H432 M288 87 H121 V151 M91 210 V267 H288 M432 267 H492 V176 H550" marker-end="url(#oil-arrow)"/><text class="small" x="360" y="177" text-anchor="middle">trait plein : fluide · pointillé : fraction d’huile</text>'); }
    },
    {
      name: "Là où elle s’accumule", duration: 9,
      description: "Les poches, contre-pentes et zones lentes peuvent retenir l’huile et faire baisser le niveau du carter.",
      draw: function () { return wrap("Accumulation d’huile dans un point bas", this.description,
        '<text class="heading" x="360" y="28" text-anchor="middle">3 · UN POINT BAS PEUT ROMPRE L’ÉQUILIBRE</text><path class="pipe" d="M60 205 H180 V258 Q180 292 215 292 H470 V120 H565" marker-end="url(#blue-arrow)"/><path class="oil-pool" d="M160 256 Q180 284 215 284 H310"/>' +
        '<circle class="drop down d1" cx="430" cy="170" r="7"/><circle class="drop down d2" cx="455" cy="205" r="6"/><rect class="accent-panel" x="565" y="68" width="130" height="120" rx="18"/>' + compressor(630,125,2.7) + '<text class="warn-text" x="315" y="228">ACCUMULATION</text><path d="M310 236 L270 270" stroke="#9a6500" stroke-width="4" marker-end="url(#oil-arrow)"/><text class="label" x="630" y="215" text-anchor="middle">niveau carter en baisse</text><text class="small" x="360" y="320" text-anchor="middle">Chercher la géométrie et le régime avant d’ajouter de l’huile.</text>'); }
    },
    {
      name: "La vitesse du gaz", duration: 11,
      description: "Dans une montée, le gaz doit garder une vitesse suffisante pour porter l’huile, avec une perte de charge acceptable.",
      draw: function () { return wrap("Influence de la vitesse du gaz", this.description,
        '<text class="heading" x="360" y="25" text-anchor="middle">4 · LA VITESSE DU GAZ PORTE L’HUILE</text><line class="divider" x1="360" y1="45" x2="360" y2="300"/><text class="good-text" x="180" y="60" text-anchor="middle">VITESSE SUFFISANTE</text><text class="warn-text" x="540" y="60" text-anchor="middle">VITESSE TROP FAIBLE</text>' +
        '<path class="pipe" d="M70 275 H145 V90 H315" marker-end="url(#blue-arrow)"/><path class="oil-flow" d="M82 264 H158 V104 H300"/><circle class="drop up d1" cx="158" cy="245" r="7"/><circle class="drop up d2" cx="158" cy="205" r="6"/>' +
        '<path class="pipe slow" d="M405 275 H480 V90 H670" marker-end="url(#blue-arrow)"/><path class="oil-pool" d="M460 267 Q480 286 500 267"/><circle class="drop down d1" cx="495" cy="140" r="7"/><circle class="drop down d2" cx="505" cy="195" r="6"/>' +
        '<text class="label" x="180" y="320" text-anchor="middle">huile entraînée</text><text class="label" x="540" y="320" text-anchor="middle">huile qui retombe</text><text class="small" x="360" y="82" text-anchor="middle">Repère à prendre dans le calcul et la notice applicables.</text>'); }
    },
    {
      name: "Le siphon en pied", duration: 11,
      description: "Le siphon prévu en pied de colonne rassemble l’huile afin que le gaz puisse l’entraîner par portions.",
      draw: function () { return wrap("Siphon en pied de colonne", this.description,
        '<text class="heading" x="360" y="27" text-anchor="middle">5 · LE SIPHON RASSEMBLE L’HUILE AU POINT BAS</text><path class="pipe" d="M60 210 H155 V255 Q155 290 190 290 Q225 290 225 255 V75 H625" marker-end="url(#blue-arrow)"/><path class="oil-pool" d="M155 255 Q155 282 190 282 Q225 282 225 255"/>' +
        '<path class="oil-flow" d="M213 246 V95 H605"/><circle class="drop up d1" cx="225" cy="230" r="7"/><circle class="drop up d2" cx="225" cy="185" r="6"/><text class="warn-text" x="110" y="306">SIPHON EN PIED</text><text class="label" x="405" y="125">l’huile est entraînée par portions</text><text class="small" x="360" y="324" text-anchor="middle">Sa présence et sa forme suivent le tracé du projet.</text>'); }
    },
    {
      name: "Le contre-siphon", duration: 9,
      description: "Selon le tracé prescrit, la boucle haute limite un drainage inverse lorsque l’installation s’arrête.",
      draw: function () { return wrap("Contre-siphon en tête de colonne", this.description,
        '<text class="heading" x="360" y="27" text-anchor="middle">6 · LA BOUCLE HAUTE LIMITE UN DRAINAGE INVERSE</text><path class="pipe" d="M105 290 H210 V105 Q210 70 245 70 Q280 70 280 105 V142 H585" marker-end="url(#blue-arrow)"/><path class="oil-flow" d="M117 280 H223 V108 Q223 82 245 82 Q267 82 267 108 V154 H570"/>' +
        '<path d="M395 136 H300 V108" fill="none" stroke="#9a6500" stroke-width="5" stroke-dasharray="8 6"/><path class="red-cross" d="M315 112 l24 24 M339 112 l-24 24"/><rect class="accent-panel" x="580" y="88" width="120" height="118" rx="18"/>' + compressor(640,145,2.6) + '<text class="warn-text" x="360" y="70">CONTRE-SIPHON / BOUCLE HAUTE</text><text class="label" x="360" y="94">si le plan ou la notice le prescrit</text><text class="small" x="360" y="322" text-anchor="middle">Ce n’est pas une boucle à ajouter systématiquement.</text>'); }
    },
    {
      name: "À charge réduite", duration: 9,
      description: "À charge réduite, débit et vitesse diminuent : le retour doit être vérifié au régime minimal.",
      draw: function () { return wrap("Retour d’huile à charge réduite", this.description,
        '<text class="heading" x="360" y="27" text-anchor="middle">7 · À CHARGE RÉDUITE, LA VITESSE DIMINUE</text><path class="pipe slow" d="M105 282 H210 V75 H620" marker-end="url(#blue-arrow)"/><path class="oil-pool" d="M185 275 Q210 296 235 275"/><circle class="drop down d1" cx="225" cy="112" r="7"/><circle class="drop down d2" cx="225" cy="170" r="7"/>' +
        '<rect class="warn-panel" x="355" y="105" width="295" height="112" rx="18"/><text class="warn-text" x="502" y="142" text-anchor="middle">POINT CRITIQUE</text><text class="label" x="502" y="172" text-anchor="middle">vérifier le retour au débit minimal</text><text class="small" x="502" y="198" text-anchor="middle">modulation · compresseurs arrêtés · cycles courts</text><text class="small" x="360" y="320" text-anchor="middle">Une colonne correcte au nominal peut devenir trop grande à faible puissance.</text>'); }
    },
    {
      name: "La double colonne", duration: 15,
      description: "La petite montée assure le retour à faible débit ; à pleine charge, les deux montées transportent le mélange.",
      draw: function () { return wrap("Fonctionnement d’une double colonne", this.description,
        '<text class="heading" x="360" y="24" text-anchor="middle">8 · LA DOUBLE COLONNE ADAPTE LA SECTION AU DÉBIT</text><line class="divider" x1="360" y1="45" x2="360" y2="302"/><text class="warn-text" x="180" y="60" text-anchor="middle">CHARGE RÉDUITE</text><text class="good-text" x="540" y="60" text-anchor="middle">PLEINE CHARGE</text>' +
        '<path class="pipe" d="M30 278 H100 V82 H320" marker-end="url(#blue-arrow)"/><path class="pipe" d="M100 278 H210 V300 Q210 318 230 318 Q250 318 250 300 V82"/><path class="oil-flow" d="M42 268 H113 V95 H305"/><path class="oil-pool" d="M212 299 Q230 314 248 299"/><text class="small" x="100" y="180" text-anchor="middle">petite active</text><text class="small" x="250" y="180" text-anchor="middle">grande fermée</text>' +
        '<path class="pipe" d="M390 278 H450 V82 H695" marker-end="url(#blue-arrow)"/><path class="pipe" d="M450 278 H550 V300 Q550 318 570 318 Q590 318 590 300 V82"/><path class="oil-flow" d="M402 268 H463 V95 H680 M470 268 H563 V298 Q563 306 570 306 Q577 306 577 298 V95 H680"/><text class="small" x="450" y="180" text-anchor="middle">petite active</text><text class="small" x="590" y="180" text-anchor="middle">grande active</text><text class="label" x="360" y="326" text-anchor="middle">Les deux diamètres se dimensionnent ensemble.</text>'); }
    },
    {
      name: "Le rétrécissement", duration: 8,
      description: "Réduire la section augmente la vitesse, mais aussi la perte de charge : les deux contraintes se calculent.",
      draw: function () { return wrap("Compromis entre section, vitesse et perte de charge", this.description,
        '<text class="heading" x="360" y="28" text-anchor="middle">9 · RÉDUIRE LA SECTION A DEUX EFFETS</text><path class="pipe thick" d="M90 245 H265 V85 H390"/><path class="pipe thin" d="M390 85 H620" marker-end="url(#blue-arrow)"/><path class="oil-flow" d="M103 232 H278 V98 H605"/><circle class="drop along d1" cx="305" cy="98" r="7"/><circle class="drop along d2" cx="375" cy="98" r="6"/>' +
        '<rect class="good-panel" x="90" y="270" width="240" height="46" rx="13"/><text class="good-text" x="210" y="298" text-anchor="middle">vitesse plus élevée</text><rect class="warn-panel" x="390" y="270" width="240" height="46" rx="13"/><text class="warn-text" x="510" y="298" text-anchor="middle">perte de charge plus élevée</text><text class="small" x="500" y="185" text-anchor="middle">dimensionner puis vérifier les deux contraintes</text>'); }
    },
    {
      name: "À retenir", duration: 8,
      description: "Suivre le trajet, vérifier les régimes minimal et maximal, puis observer le niveau dans le temps avant de décider.",
      draw: function () { return wrap("Récapitulatif du retour d’huile", this.description,
        '<text class="heading" x="360" y="30" text-anchor="middle">10 · À RETENIR AVANT DE DÉCIDER</text>' +
        '<rect class="panel" x="30" y="68" width="210" height="205" rx="22"/><circle cx="135" cy="112" r="26" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="135" y="118" text-anchor="middle">1</text><text class="heading" x="135" y="164" text-anchor="middle">SUIVRE</text><text class="small" x="135" y="197" text-anchor="middle">pente · points bas</text><text class="small" x="135" y="219" text-anchor="middle">siphons · montée</text>' +
        '<rect class="panel" x="255" y="68" width="210" height="205" rx="22"/><circle cx="360" cy="112" r="26" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="360" y="118" text-anchor="middle">2</text><text class="heading" x="360" y="164" text-anchor="middle">VÉRIFIER</text><text class="small" x="360" y="197" text-anchor="middle">débit minimal</text><text class="small" x="360" y="219" text-anchor="middle">et débit maximal</text>' +
        '<rect class="panel" x="480" y="68" width="210" height="205" rx="22"/><circle cx="585" cy="112" r="26" fill="#fff0e9" stroke="#c9451a" stroke-width="3"/><text class="warn-text" x="585" y="118" text-anchor="middle">3</text><text class="heading" x="585" y="164" text-anchor="middle">OBSERVER</text><text class="small" x="585" y="197" text-anchor="middle">niveau · durée</text><text class="small" x="585" y="219" text-anchor="middle">historique · mesures</text>' +
        '<path class="oil-flow" d="M100 300 H620" marker-end="url(#oil-arrow)"/><text class="label" x="360" y="324" text-anchor="middle">Ajouter de l’huile n’est jamais le premier diagnostic.</text>'); }
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
