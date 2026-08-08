(function initialiseKvCourse() {
  "use strict";

  const ui = {
    stepper: document.getElementById("stepper"),
    kicker: document.getElementById("lesson-kicker"),
    title: document.getElementById("lesson-title"),
    intro: document.getElementById("lesson-intro"),
    detail: document.getElementById("lesson-detail"),
    takeaway: document.getElementById("lesson-takeaway"),
    visualTitle: document.getElementById("visual-title"),
    visualHint: document.getElementById("visual-hint"),
    controls: document.getElementById("visual-controls"),
    root: document.getElementById("visual-root"),
    caption: document.getElementById("visual-caption"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    voice: document.getElementById("voice-button"),
    rate: document.getElementById("voice-rate"),
    sources: document.getElementById("sources-dialog"),
    sourceButton: document.getElementById("source-button"),
    focusButton: document.getElementById("visual-focus-button"),
    lessonCopy: document.querySelector(".lesson-copy"),
    status: document.getElementById("app-status")
  };

  const RATE_KEY = "inerweb-kv-rate";
  const RATE_VALUES = [0.8, 0.95, 1.1, 1.25];
  const valves = {
    kvp: {
      code: "KVP",
      generic: "Régulateur de pression d’évaporation",
      shortGeneric: "pression d’évaporation",
      location: "Sortie d’évaporateur",
      side: "amont",
      measure: "pression de l’évaporateur, avant la vanne",
      purpose: "Maintenir la pression d’évaporation au-dessus de la valeur réglée.",
      action: "Une pression amont qui monte ouvre davantage la vanne.",
      highOpens: true,
      usage: "Évaporateurs à températures différentes sur un même compresseur, maintien d’une température de produit ou protection antigel.",
      setting: "Le réglage fin se contrôle à charge minimale si la fonction recherchée est la protection antigel.",
      color: "#236da7"
    },
    kvl: {
      code: "KVL",
      generic: "Régulateur de pression de carter",
      shortGeneric: "pression de carter",
      location: "Aspiration, juste avant le compresseur",
      side: "aval",
      measure: "pression d’aspiration du compresseur, après la vanne",
      purpose: "Limiter la pression maximale admise à l’aspiration du compresseur.",
      action: "Une pression aval qui monte fait étrangler le passage.",
      highOpens: false,
      usage: "Redémarrage après arrêt prolongé, dégivrage ou remontée rapide de charge lorsque le moteur risque une surcharge.",
      setting: "La consigne correspond à la pression d’aspiration maximale admissible du compresseur.",
      color: "#c4542d"
    },
    kvr: {
      code: "KVR",
      generic: "Régulateur de pression de condensation",
      shortGeneric: "pression de condensation",
      location: "Sortie du condenseur, avant le réservoir",
      side: "amont",
      measure: "pression du condenseur, avant la vanne",
      purpose: "Maintenir une pression de condensation suffisante quand l’ambiance refroidit.",
      action: "Une pression amont qui monte ouvre davantage la vanne.",
      highOpens: true,
      usage: "Groupes à condenseur à air fonctionnant par temps froid ; montage courant avec une NRD et un réservoir liquide.",
      setting: "Le contrôle est le plus parlant en conditions froides, avec lecture conjointe condenseur et réservoir.",
      color: "#26715b"
    }
  };

  let current = 0;
  let furthest = 0;
  let selectedValve = "kvp";
  let pressureRatio = 1;
  let visualFocus = false;
  let cleanupVisual = null;
  let voiceRun = 0;
  let speaking = false;
  let paused = false;
  let voiceRate = readRate();
  let preferredVoice = null;
  const adjustmentTurns = { kvp: 0, kvl: 0, kvr: 0 };
  const adjustmentChecks = { kvp: new Set(), kvl: new Set(), kvr: new Set() };
  let diagnosisKey = "product";
  const quiz = { index: 0, score: 0, answered: false, selected: null, complete: false };

  const quizQuestions = [
    {
      prompt: "Quelle information distingue d’abord KVP, KVL et KVR ?",
      answers: ["La couleur du cuivre", "La pression régulée et l’emplacement", "Le diamètre du raccord"],
      correct: 1,
      why: "La silhouette est proche. La fonction, le côté régulé et la position dans le circuit font la différence."
    },
    {
      prompt: "Une chambre doit rester moins froide que les autres évaporateurs raccordés au même compresseur. Quel organe étudier ?",
      answers: ["KVP", "KVL", "KVR"],
      correct: 0,
      why: "Le KVP maintient la pression d’évaporation de la branche concernée."
    },
    {
      prompt: "Après un dégivrage, la pression d’aspiration risque de surcharger le compresseur. Quel organe limite cette pression ?",
      answers: ["KVR", "KVL", "KVP"],
      correct: 1,
      why: "Le KVL régule la pression de sortie côté compresseur et protège le moteur contre une charge excessive."
    },
    {
      prompt: "En hiver, la pression de condensation devient trop basse. Quel montage est couramment recherché ?",
      answers: ["KVR avec NRD", "KVL avec voyant liquide", "KVP avec pressostat BP"],
      correct: 0,
      why: "Le KVR maintient la pression de condensation ; le montage KVR + NRD est un cas courant documenté."
    },
    {
      prompt: "Que produit une rotation horaire de la vis sur cette famille KV ?",
      answers: ["Une consigne de pression plus élevée", "Une coupure électrique", "Une consigne toujours divisée par deux"],
      correct: 0,
      why: "Visser comprime davantage le ressort et augmente la pression réglée. La valeur réelle dépend du modèle."
    },
    {
      prompt: "Quelle est la bonne démarche avant une correction de réglage ?",
      answers: ["Tourner jusqu’à entendre le débit", "Identifier, mesurer, stabiliser, corriger puis vérifier", "Choisir une valeur générique sur Internet"],
      correct: 1,
      why: "Le réglage vient après l’identification et la mesure au bon endroit, avec la notice du produit posé."
    }
  ];

  const lessons = [
    {
      short: "Utilité",
      kicker: "Écran 1 · Pourquoi ces vannes ?",
      title: "À quoi servent KVP, KVL et KVR ?",
      intro: "Chaque vanne maintient ou limite une pression. Elle répond à un besoin précis de l’installation.",
      detail: `<div class="fact"><strong>KVP :</strong> maintient une pression d’évaporation suffisamment élevée dans l’évaporateur.</div>
        <div class="fact"><strong>KVL :</strong> limite la pression d’aspiration admise par le compresseur pour éviter sa surcharge.</div>
        <div class="fact"><strong>KVR :</strong> maintient une pression de condensation — la HP — suffisante et stable, notamment par temps froid.</div>
        <div class="neutral-box"><strong>Ordre du parcours :</strong> d’abord l’utilité, puis l’emplacement, le fonctionnement et le réglage.</div>`,
      takeaway: "KVP tient l’évaporation · KVL protège le compresseur · KVR tient la HP.",
      visualTitle: "À quoi sert chaque régulateur ?",
      visualHint: "Lis la fonction technique, puis suis le fluide jusqu’à la vanne.",
      caption: "Synthèse issue du fonds pédagogique canonique et des fiches Danfoss KVP, KVL et KVR.",
      render: renderOverview
    },
    {
      short: "Reconnaître",
      kicker: "Écran 2 · Objet réel",
      title: "La vanne doit ressembler à une vanne",
      intro: "La vue extérieure vient du fichier STEP fourni. Elle sert à reconnaître un corps réel avant de passer à la coupe fonctionnelle.",
      detail: `<ul><li><strong>Corps métallique :</strong> il contient le siège et le passage du fluide.</li><li><strong>Tête de réglage :</strong> protégée par un capuchon.</li><li><strong>Raccords :</strong> le sens réel se confirme avec la flèche du corps.</li></ul>
        <div class="warning-box"><strong>Attention :</strong> les trois familles sont proches. Toujours lire le marquage et la référence.</div>`,
      takeaway: "Reconnaître la forme, puis confirmer le code et la flèche.",
      visualTitle: "Tourner autour du produit réel",
      visualHint: "Fais glisser la vanne ou laisse la rotation automatique.",
      caption: "Maillage local allégé du STEP KVL 28 fourni ; la diffusion publique du dérivé reste à valider.",
      render: renderRecognition
    },
    {
      short: "Placer",
      kicker: "Écran 3 · Circuit",
      title: "Le circuit donne la première réponse",
      intro: "Suis d’abord la ligne liquide complète. KVR travaille côté condensation ; KVP et KVL sont tous deux sur l’aspiration, mais ils ne regardent pas la même pression.",
      detail: `<div class="fact"><strong>KVR :</strong> sortie condenseur, avant le réservoir.</div>
        <div class="fact"><strong>KVP :</strong> sortie de l’évaporateur dont on maintient la pression.</div>
        <div class="fact"><strong>KVL :</strong> juste avant le compresseur qu’il protège.</div>
        <div class="neutral-box"><strong>Ligne liquide :</strong> bouteille → vanne départ liquide → filtre → voyant → électrovanne → détendeur.</div>`,
      takeaway: "KVR en HP ; KVP après l’évaporateur ; KVL avant le compresseur.",
      visualTitle: "Situer chaque régulateur",
      visualHint: "Choisis KVP, KVL ou KVR : son symbole normalisé s’allume au bon emplacement.",
      caption: "Croix du frigoriste et symboles de la bibliothèque inerWeb. Le symbole PC fourni repère les régulateurs ; KVP et KVL sont séparés sur l’aspiration.",
      render: renderPlacement
    },
    {
      short: "Animer",
      kicker: "Écran 4 · Chaîne cinématique",
      title: "La pression devient un mouvement",
      intro: "La vanne compare une pression à la force du ressort. Le soufflet déplace la tige, puis le clapet modifie le passage.",
      detail: `<ol><li>La pression régulée agit sur le mécanisme.</li><li>Le ressort porte la consigne donnée par la vis.</li><li>Le soufflet et la tige transmettent le déplacement.</li><li>Le clapet change la surface de passage.</li><li>Le débit modifié ramène la pression vers l’équilibre.</li></ol>`,
      takeaway: "Pression → soufflet → tige → clapet → débit.",
      visualTitle: "Faire varier la pression régulée",
      visualHint: "Le fluide entre par le bas, franchit le clapet puis tourne à 90° vers la sortie latérale.",
      caption: "Schéma de principe original inerWeb fondé sur le corps angulaire KV. Le blanc montre la cavité ; les mouvements sont amplifiés.",
      render: renderKinematic
    },
    {
      short: "Régler",
      kicker: "Écran 5 · Méthode terrain",
      title: "Régler avec un manomètre, jamais à l’aveugle",
      intro: "La vis modifie la compression du ressort. Une rotation horaire demande une pression plus élevée ; une rotation antihoraire la diminue.",
      detail: `<div class="key-box"><strong>Ordre obligatoire :</strong> identifier → mesurer → stabiliser → corriger → vérifier.</div>
        <div class="warning-box"><strong>Pas de valeur universelle :</strong> la consigne et la variation par tour dépendent du modèle et de l’installation.</div>`,
      takeaway: "Visser augmente la consigne ; dévisser la diminue.",
      visualTitle: "Relier vis, ressort et manomètre",
      visualHint: "Déplace la vis puis complète les cinq contrôles.",
      caption: "Le curseur montre une tendance, pas une valeur de réglage transposable au terrain.",
      render: renderAdjustment
    },
    {
      short: "Appliquer",
      kicker: "Écran 6 · Cas d’usage",
      title: "Retrouver ces fonctions sur le terrain",
      intro: "Tu connais maintenant leur utilité. Voici les situations techniques qui justifient leur présence sur une installation.",
      detail: `<div class="neutral-box"><strong>Fréquence d’usage :</strong> on les rencontre souvent en froid commercial et sur des installations particulières, mais ils ne sont pas obligatoires sur chaque circuit.</div>
        <p>Le technicien part du problème à résoudre, pas du stock de vannes disponible.</p>`,
      takeaway: "Un besoin de pression précis justifie l’organe.",
      visualTitle: "Trois situations professionnelles",
      visualHint: "Compare le besoin, l’action et le résultat attendu.",
      caption: "Applications génériques ; le dimensionnement relève de la documentation du constructeur.",
      render: renderUses
    },
    {
      short: "Diagnostiquer",
      kicker: "Écran 7 · Décision",
      title: "Un symptôme ne suffit pas pour tourner la vis",
      intro: "Le régulateur peut être mal réglé, mal sélectionné ou simplement innocent. La mesure doit confirmer son rôle.",
      detail: `<ul><li>Vérifier la référence et le sens du fluide.</li><li>Mesurer du côté réellement régulé.</li><li>Comparer au besoin de l’installation et à la notice.</li><li>Écarter les autres causes avant de corriger.</li></ul>`,
      takeaway: "Diagnostiquer d’abord ; régler seulement si la mesure le justifie.",
      visualTitle: "Choisir une situation",
      visualHint: "Chaque cas ouvre une chaîne de contrôle, pas une réponse magique.",
      caption: "Situations de formation ; aucune ne remplace une procédure d’intervention réelle.",
      render: renderDiagnosis
    },
    {
      short: "Vérifier",
      kicker: "Écran 8 · Défi",
      title: "Choisir la bonne vanne et le bon geste",
      intro: "Le défi mélange emplacement, fonction, cinématique et réglage.",
      detail: `<div class="key-box"><strong>Objectif :</strong> expliquer la décision, pas seulement mémoriser trois lettres.</div>
        <p>Une réponse correcte doit pouvoir être reliée à la pression observée dans le circuit.</p>`,
      takeaway: "Je sais dire où, pourquoi, comment elle réagit et comment je la règle.",
      visualTitle: "Défi KVP · KVL · KVR",
      visualHint: "Six questions mélangées.",
      caption: "Résultat local et anonyme ; aucune donnée d’apprenant n’est enregistrée.",
      render: renderQuiz
    }
  ];

  function readRate() {
    try {
      const value = Number(localStorage.getItem(RATE_KEY));
      return RATE_VALUES.includes(value) ? value : 0.95;
    } catch (_) { return 0.95; }
  }

  function saveRate(value) {
    try { localStorage.setItem(RATE_KEY, String(value)); } catch (_) { /* facultatif */ }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }

  function clamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }

  function familyButtons(active) {
    return Object.keys(valves).map((key) => `<button type="button" class="family-button${active === key ? " active" : ""}" data-valve="${key}" aria-pressed="${active === key}">${valves[key].code}</button>`).join("");
  }

  function bindFamilyButtons(callback) {
    ui.controls.querySelectorAll("[data-valve]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedValve = button.dataset.valve;
        pressureRatio = 1;
        callback();
      });
    });
  }

  function disposeCurrentVisual() {
    if (cleanupVisual) cleanupVisual();
    cleanupVisual = null;
  }

  function kvSilhouetteSvg(transform = "translate(10 7)") {
    return `<g class="kv-silhouette" transform="${transform}">
      <path class="kv-silhouette-cap" d="M39 2H65V38H39ZM34 12H70M34 24H70"/>
      <path class="kv-silhouette-body" d="M27 38H77Q88 38 88 49V55H112V75H82V82Q82 94 70 94H65V119H39V94H32Q19 94 19 81V52Q19 38 27 38Z"/>
      <path class="kv-silhouette-detail" d="M39 94H65M88 55V75M24 65H80"/>
      <path class="kv-silhouette-flow" d="M52 111V69H102"/>
      <path class="kv-silhouette-arrow" d="m96 64 9 5-9 5Z"/>
    </g>`;
  }

  function familyMiniDiagram(key) {
    const details = {
      kvp: {
        tone: "bp",
        color: "#236da7",
        label: "KVP · APRÈS L’ÉVAPORATEUR",
        aria: "Le fluide traverse le grand évaporateur, rejoint le KVP puis repart vers la ligne d’aspiration.",
        pipe: "M155 73H174V116H225V74H291",
        organs: `<g class="mini-heat-exchanger" transform="translate(12 37)"><rect width="143" height="72" rx="8"/><path class="mini-fins" d="M29 0V72M57 0V72M86 0V72M114 0V72"/><path class="mini-coil-line" d="M10 20H122Q134 20 134 29H21Q10 29 10 38H123Q134 38 134 48H10"/><text x="71" y="90">ÉVAPORATEUR</text></g>${kvSilhouetteSvg("translate(195 35) scale(.58)")}<text class="mini-valve-name" x="225" y="28">KVP</text><text class="mini-destination" x="273" y="103">VERS ASPIRATION</text>`
      },
      kvl: {
        tone: "bp",
        color: "#236da7",
        label: "KVL · JUSTE AVANT LE COMPRESSEUR",
        aria: "Le fluide arrive par la ligne d’aspiration, traverse le KVL puis entre dans un compresseur figuratif.",
        pipe: "M10 116H150V74H215",
        organs: `<text class="mini-source" x="54" y="136">LIGNE D’ASPIRATION</text>${kvSilhouetteSvg("translate(120 35) scale(.58)")}<text class="mini-valve-name" x="150" y="28">KVL</text><g class="mini-real-compressor" transform="translate(218 34)"><path class="compressor-shell" d="M18 18Q44 2 67 19Q76 26 76 42V82Q76 99 60 103H25Q8 100 8 83V40Q8 25 18 18Z"/><path class="compressor-base" d="M3 103H81M13 103V112M70 103V112"/><path class="compressor-pipe" d="M8 52H-3M64 15V3H78"/><circle class="compressor-detail" cx="42" cy="64" r="17"/><path class="compressor-detail" d="M32 68Q42 45 53 64Q57 74 49 81"/><text x="42" y="126">COMPRESSEUR</text></g>`
      },
      kvr: {
        tone: "hp",
        color: "#c9451a",
        label: "KVR · APRÈS LE CONDENSEUR",
        aria: "Le fluide quitte le grand condenseur, traverse le KVR puis entre dans la bouteille liquide.",
        pipe: "M150 73H170V116H221V74H252",
        organs: `<g class="mini-heat-exchanger condenser" transform="translate(8 37)"><rect width="142" height="72" rx="8"/><path class="mini-fins" d="M28 0V72M57 0V72M85 0V72M113 0V72"/><path class="mini-coil-line" d="M10 20H121Q133 20 133 29H21Q10 29 10 38H122Q133 38 133 48H10"/><text x="71" y="90">CONDENSEUR</text></g>${kvSilhouetteSvg("translate(191 35) scale(.58)")}<text class="mini-valve-name" x="221" y="28">KVR</text><g class="mini-liquid-receiver" transform="translate(254 38)"><path d="M12 2Q32 2 32 21V72Q32 91 12 91Q-8 91-8 72V21Q-8 2 12 2Z"/><path d="M-7 61H31"/><path d="M12 2V-6M12 91V99"/><text x="12" y="116">BOUTEILLE LIQUIDE</text></g>`
      }
    };
    const item = details[key];
    const arrowId = `family-flow-${key}`;
    return `<svg class="family-drawing" viewBox="0 0 300 155" role="img" aria-label="${item.aria}">
      <defs><marker id="${arrowId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="${item.color}"/></marker></defs>
      <text class="mini-location" x="150" y="12">${item.label}</text>
      <path class="mini-pipe ${item.tone}" d="${item.pipe}" marker-end="url(#${arrowId})"/>
      ${item.organs}
      ${[0, 1, 2].map((index) => `<circle class="mobile family-flow-dot ${item.tone}" r="4"><animateMotion begin="-${(index * .7).toFixed(1)}s" dur="2.1s" repeatCount="indefinite" path="${item.pipe}"/></circle>`).join("")}
    </svg>`;
  }

  function familyCard(key, title, position, purpose, pressure) {
    return `<article class="family-card ${key}"><div class="family-card-title"><span class="family-code"><span>${valves[key].code}</span></span><div><h3>${title}</h3><p>${position}</p></div></div>${familyMiniDiagram(key)}<p class="family-purpose">${purpose}</p><p class="family-pressure">${pressure}</p></article>`;
  }

  function renderOverview() {
    ui.controls.innerHTML = `<span class="neutral-box" style="margin:0;padding:.45rem .7rem">À quoi ça sert ? · pression tenue · intérêt</span>`;
    ui.root.innerHTML = `<div class="family-overview">
      ${familyCard("kvp", "Pression d’évaporation", "Après l’évaporateur.", "Maintient une pression d’évaporation suffisamment élevée.", "Intérêt : tenir le régime de l’évaporateur.")}
      ${familyCard("kvl", "Pression d’aspiration", "Juste avant le compresseur.", "Limite la pression d’aspiration admise par le compresseur.", "Intérêt : éviter la surcharge du moteur.")}
      ${familyCard("kvr", "Pression de condensation", "Après le condenseur.", "Maintient une pression de condensation (HP) suffisante et stable.", "Intérêt : conserver une alimentation correcte du détendeur.")}
      <p class="family-motto">KVP tient l’évaporation · KVL protège le compresseur · KVR tient la HP.</p>
    </div>`;
  }

  function renderRecognition() {
    ui.controls.innerHTML = `<button type="button" class="action-button active" id="spin-model" aria-pressed="true">⏸ Rotation</button><button type="button" class="action-button" id="zoom-out-model" aria-label="Éloigner la vue 3D">− Zoom</button><button type="button" class="action-button" id="zoom-in-model" aria-label="Rapprocher la vue 3D">+ Zoom</button><button type="button" class="action-button" id="reset-model">Vue initiale</button><button type="button" class="action-button" id="label-model" aria-pressed="false">Afficher les repères</button>`;
    ui.root.innerHTML = `<div class="product-viewer" id="product-viewer">
      <canvas id="product-canvas" aria-label="Vue tridimensionnelle interactive du régulateur KVL 28 fourni" role="img"></canvas>
      <div class="viewer-badge"><strong>Corps réel de référence</strong><span>KVL 28 · STEP fourni</span></div>
      <span class="viewer-label cap">capuchon de réglage</span><span class="viewer-label body">corps du régulateur</span><span class="viewer-label branch">raccord du fluide</span>
      <p class="viewer-note">La 3D sert à reconnaître l’objet. La fonction se confirme par le marquage, la flèche et l’emplacement.</p>
    </div>`;
    cleanupVisual = initialiseProductViewer();
  }

  function initialiseProductViewer() {
    const canvas = document.getElementById("product-canvas");
    const viewer = document.getElementById("product-viewer");
    const spinButton = document.getElementById("spin-model");
    const zoomOutButton = document.getElementById("zoom-out-model");
    const zoomInButton = document.getElementById("zoom-in-model");
    const resetButton = document.getElementById("reset-model");
    const labelButton = document.getElementById("label-model");
    const mesh = window.KV_PRODUCT_MESH;
    if (!canvas || !mesh || !mesh.vertices || !mesh.normals) {
      if (viewer) viewer.innerHTML = `<div class="warning-box" style="margin:20px">La géométrie 3D locale n’a pas pu être chargée.</div>`;
      return null;
    }

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) {
      viewer.innerHTML = `<div class="warning-box" style="margin:20px">WebGL n’est pas disponible sur cet appareil.</div>`;
      return null;
    }

    const vertexSource = `attribute vec3 aPosition; attribute vec3 aNormal; uniform float uYaw; uniform float uPitch; uniform float uCamera; uniform mat4 uProjection; varying vec3 vNormal; varying vec3 vPosition; vec3 rotateY(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);} vec3 rotateX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);} void main(){vec3 p=rotateX(rotateY(aPosition,uYaw),uPitch);vec3 n=normalize(rotateX(rotateY(aNormal,uYaw),uPitch));p.z-=uCamera;vNormal=n;vPosition=p;gl_Position=uProjection*vec4(p,1.0);}`;
    const fragmentSource = `precision mediump float; varying vec3 vNormal; varying vec3 vPosition; void main(){vec3 n=normalize(vNormal);vec3 key=normalize(vec3(-0.45,0.72,0.55));vec3 fill=normalize(vec3(0.7,0.1,0.5));float light=0.36+0.48*max(dot(n,key),0.0)+0.18*max(dot(n,fill),0.0);float rim=pow(1.0-max(dot(n,normalize(-vPosition)),0.0),2.2);vec3 copper=vec3(0.70,0.39,0.16);vec3 color=copper*light+vec3(0.23,0.32,0.38)*rim*0.45;gl_FragColor=vec4(color,1.0);}`;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (_) {
      viewer.innerHTML = `<div class="warning-box" style="margin:20px">Le rendu 3D n’a pas pu être initialisé.</div>`;
      return null;
    }
    gl.useProgram(program);

    const bindAttribute = (name, values) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      return buffer;
    };
    bindAttribute("aPosition", mesh.vertices);
    bindAttribute("aNormal", mesh.normals);
    const yawLocation = gl.getUniformLocation(program, "uYaw");
    const pitchLocation = gl.getUniformLocation(program, "uPitch");
    const cameraLocation = gl.getUniformLocation(program, "uCamera");
    const projectionLocation = gl.getUniformLocation(program, "uProjection");
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    let yaw = -0.65;
    let pitch = -0.18;
    let cameraDistance = 3.35;
    let autoRotate = true;
    let frame = 0;
    let lastTime = performance.now();
    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;

    function perspective(fieldOfView, aspect, near, far) {
      const f = 1 / Math.tan(fieldOfView / 2);
      const nf = 1 / (near - far);
      return new Float32Array([f / aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(2, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(2, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniformMatrix4fv(projectionLocation, false, perspective(Math.PI / 4.5, width / height, .1, 20));
    }

    function draw(time) {
      resize();
      if (autoRotate) yaw += Math.min((time - lastTime) / 1000, .05) * .22;
      lastTime = time;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(yawLocation, yaw);
      gl.uniform1f(pitchLocation, pitch);
      gl.uniform1f(cameraLocation, cameraDistance);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.vertices.length / 3);
      frame = requestAnimationFrame(draw);
    }

    function pointerDown(event) {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    }
    function pointerMove(event) {
      if (!dragging) return;
      yaw += (event.clientX - pointerX) * .009;
      pitch = clamp(pitch + (event.clientY - pointerY) * .007, -1.2, 1.2);
      pointerX = event.clientX;
      pointerY = event.clientY;
    }
    function pointerUp(event) {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }
    function wheel(event) {
      event.preventDefault();
      cameraDistance = clamp(cameraDistance + event.deltaY * .002, 2.65, 4.8);
    }

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("wheel", wheel, { passive: false });
    spinButton.addEventListener("click", () => {
      autoRotate = !autoRotate;
      spinButton.classList.toggle("active", autoRotate);
      spinButton.setAttribute("aria-pressed", String(autoRotate));
      spinButton.textContent = autoRotate ? "⏸ Rotation" : "▶ Rotation";
    });
    zoomOutButton.addEventListener("click", () => { cameraDistance = clamp(cameraDistance + .32, 2.65, 4.8); });
    zoomInButton.addEventListener("click", () => { cameraDistance = clamp(cameraDistance - .32, 2.65, 4.8); });
    resetButton.addEventListener("click", () => { yaw = -.65; pitch = -.18; cameraDistance = 3.35; });
    labelButton.addEventListener("click", () => {
      const enabled = viewer.classList.toggle("labels-on");
      labelButton.classList.toggle("active", enabled);
      labelButton.setAttribute("aria-pressed", String(enabled));
      labelButton.textContent = enabled ? "Masquer les repères" : "Afficher les repères";
    });
    if (!autoRotate) {
      spinButton.classList.remove("active");
      spinButton.textContent = "▶ Rotation";
      spinButton.setAttribute("aria-pressed", "false");
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }

  function circuitSvg(active) {
    const valve = valves[active];
    const activeClass = (key) => key === active ? " is-active" : "";
    const symbol = (name, x, y, width, height, transform = "") => `<image href="assets/symboles/${name}.svg" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"${transform ? ` transform="${transform}"` : ""}/>`;
    const flowDots = (path, tone, duration) => [0, 1, 2].map((index) => `<circle class="mobile circuit-flow-dot ${tone}" r="7"><animateMotion begin="-${(index * duration / 3).toFixed(1)}s" dur="${duration}s" repeatCount="indefinite" path="${path}"/></circle>`).join("");
    return `<div class="placement-layout" role="img" aria-label="Circuit frigorifique complet. ${valve.code} est repéré à ${valve.location.toLowerCase()}. La ligne liquide comprend la bouteille liquide, la vanne départ liquide, le filtre déshydrateur, le voyant liquide, l’électrovanne et le détendeur.">
      <div class="diagram placement-circuit">
        <p class="placement-status"><strong>${valve.code}</strong><span>${escapeHtml(valve.location)} · pression ${valve.side}</span></p>
        <svg viewBox="0 0 1100 520" aria-hidden="true">
          <defs>
            <marker id="circuit-arrow-hp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#c9451a"/></marker>
            <marker id="circuit-arrow-bp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#236da7"/></marker>
          </defs>

          <!-- Croix du frigoriste : détente à gauche, compression à droite. -->
          <path class="circuit-pipe hp-pipe" d="M930 275V80H730M490 80H330V235H85V300"/>
          <path class="circuit-pipe bp-pipe" d="M85 300V420H440M660 420H870V355H880"/>

          <path class="circuit-direction hp-direction" d="M915 235V96H760" marker-end="url(#circuit-arrow-hp)"/>
          <path class="circuit-direction hp-direction" d="M475 80H345V218H110" marker-end="url(#circuit-arrow-hp)"/>
          <path class="circuit-direction bp-direction" d="M100 320V402H410" marker-end="url(#circuit-arrow-bp)"/>
          <path class="circuit-direction bp-direction" d="M680 405H850V365H875" marker-end="url(#circuit-arrow-bp)"/>
          ${flowDots("M930 275 V80 H85 V300", "hp-dot", 9)}
          ${flowDots("M85 300 V420 H870 V355 H880", "bp-dot", 7)}

          <!-- Échangeurs : géométrie validée de la planche canonique regulateurs-pression.svg. -->
          <g class="coil" transform="translate(610 80)">
            <rect x="-120" y="-35" width="240" height="70" rx="5"/>
            <path class="coil-fins" d="M-80-35V35M-40-35V35M0-35V35M40-35V35M80-35V35"/>
            <path class="coil-line" d="M-120 0V-19H94Q108-19 108 0H-94Q-108 0-108 19H120V0"/>
            <text class="organ-label" y="-49">CONDENSEUR À AIR</text>
          </g>
          <g class="coil" transform="translate(550 420)">
            <rect x="-110" y="-35" width="220" height="70" rx="5"/>
            <path class="coil-fins" d="M-73-35V35M-37-35V35M0-35V35M37-35V35M73-35V35"/>
            <path class="coil-line" d="M-110 0V-19H84Q98-19 98 0H-84Q-98 0-98 19H110V0"/>
            <text class="organ-label" y="60">ÉVAPORATEUR</text>
          </g>

          <!-- Symboles exacts de la bibliothèque inerWeb. -->
          ${symbol("bouteille_liquide", 326, 45, 72, 70)}
          <text class="component-label" x="362" y="128">BOUTEILLE LIQUIDE</text>
          ${symbol("vanne_isolement", 276, 218, 58, 34)}
          ${symbol("filtre_deshydrateur", 216, 216, 70, 38)}
          ${symbol("voyant_liquide", 153, 217, 68, 36)}
          ${symbol("electrovanne_frigo", 96, 207, 60, 48)}
          <g transform="translate(85 300) rotate(90)">${symbol("detendeur_thermo_int", -38, -28, 76, 56)}</g>
          <g class="circuit-real-compressor" transform="translate(880 265)">
            <path class="compressor-shell" d="M18 26Q49 8 78 28Q91 38 91 58V91Q91 108 75 112H25Q8 108 8 91V48Q8 34 18 26Z"/>
            <path class="compressor-base" d="M2 112H97M17 112V122M82 112V122"/>
            <path class="compressor-pipe" d="M8 90H0M50 26V10"/>
            <circle class="compressor-detail" cx="50" cy="70" r="19"/>
            <path class="compressor-detail" d="M39 75Q50 48 62 69Q67 81 57 89"/>
          </g>

          <g class="component-index" transform="translate(304 198)"><circle r="13"/><text>1</text></g>
          <g class="component-index" transform="translate(250 198)"><circle r="13"/><text>2</text></g>
          <g class="component-index" transform="translate(188 198)"><circle r="13"/><text>3</text></g>
          <g class="component-index" transform="translate(125 198)"><circle r="13"/><text>4</text></g>
          <g class="component-index" transform="translate(55 300)"><circle r="13"/><text>5</text></g>
          <text class="organ-label" x="58" y="360">DÉTENDEUR</text>
          <text class="organ-label" x="930" y="405">COMPRESSEUR</text>

          <!-- Symbole PC fourni : vanne en ligne et membrane de commande. -->
          <g class="regulator-location kvr${activeClass("kvr")}" transform="translate(445 80)"><rect x="-44" y="-42" width="88" height="82" rx="12"/>${symbol("regulateur_pression_pc", -34, -45, 68, 62)}<text class="valve-code" y="-47">KVR</text><text class="location-word" y="52">APRÈS CONDENSEUR</text></g>
          <g class="regulator-location kvp${activeClass("kvp")}" transform="translate(725 420)"><rect x="-44" y="-42" width="88" height="82" rx="12"/>${symbol("regulateur_pression_pc", -34, -45, 68, 62)}<text class="valve-code" y="-47">KVP</text><text class="location-word" y="52">SORTIE ÉVAPORATEUR</text></g>
          <g class="regulator-location kvl${activeClass("kvl")}" transform="translate(825 420)"><rect x="-44" y="-42" width="88" height="82" rx="12"/>${symbol("regulateur_pression_pc", -34, -45, 68, 62)}<text class="valve-code" y="-47">KVL</text><text class="location-word" y="52">AVANT COMPRESSEUR</text></g>
        </svg>
      </div>
      <ol class="liquid-sequence" aria-label="Ordre des organes de la ligne liquide">
        <li><span>0</span><strong>Bouteille liquide</strong></li>
        <li><span>1</span><strong>Vanne départ liquide</strong></li>
        <li><span>2</span><strong>Filtre déshydrateur</strong></li>
        <li><span>3</span><strong>Voyant liquide</strong></li>
        <li><span>4</span><strong>Électrovanne</strong></li>
        <li><span>5</span><strong>Détendeur</strong></li>
      </ol>
    </div>`;
  }

  function renderPlacement() {
    ui.controls.innerHTML = familyButtons(selectedValve);
    ui.root.innerHTML = circuitSvg(selectedValve);
    bindFamilyButtons(renderPlacement);
  }

  function valveOpening(valve, ratio) {
    const direction = valve.highOpens ? 1 : -1;
    return clamp(.5 + direction * (ratio - 1) * 2.4, .08, .94);
  }

  function stateFor(valve, ratio, opening) {
    const delta = ratio - 1;
    if (Math.abs(delta) < .035) return { title: "Équilibre", text: "La pression est proche de la consigne : le clapet module le passage." };
    if (opening > .7) return { title: "Ouverture plus grande", text: valve.highOpens ? "La pression régulée dépasse la consigne : la vanne laisse passer davantage." : "La pression aval est sous la consigne : le KVL s’ouvre davantage." };
    return { title: "Passage limité", text: valve.highOpens ? "La pression régulée est sous la consigne : la vanne étrangle le passage." : "La pression aval dépasse la limite : le KVL étrangle le passage." };
  }

  function cutawaySvg(key, opening) {
    const valve = valves[key];
    const lift = 3 + opening * 35;
    const springScale = (1 - lift / 105).toFixed(3);
    const flowWidth = (2.5 + opening * 9).toFixed(1);
    const flowOpacity = (.22 + opening * .78).toFixed(2);
    const signal = valve.side === "amont" ? "M265 342H195V205H267" : "M525 250V205H353";
    const signalX = valve.side === "amont" ? 185 : 505;
    const signalAnchor = valve.side === "amont" ? "start" : "end";
    const flowPath = "M310 354V306Q310 270 350 250H560";
    const portNames = {
      kvp: ["ENTRÉE : SORTIE ÉVAPORATEUR", "SORTIE : VERS ASPIRATION"],
      kvl: ["ENTRÉE : LIGNE D’ASPIRATION", "SORTIE : VERS COMPRESSEUR"],
      kvr: ["ENTRÉE : SORTIE CONDENSEUR", "SORTIE : VERS BOUTEILLE"]
    }[key];
    return `<div class="diagram cutaway"><svg class="kv-cutaway" viewBox="0 0 620 400" aria-hidden="true" style="--lift:${lift.toFixed(1)}px;--spring-scale:${springScale};--flow-width:${flowWidth};--flow-opacity:${flowOpacity}">
      <defs>
        <marker id="pressure-arrow-${key}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="${valve.color}"/></marker>
        <marker id="flow-arrow-${key}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#236da7"/></marker>
      </defs>

      <!-- Corps angulaire KV : entrée basse, sortie latérale, passage réel à 90 degrés. -->
      <rect class="cut-body" x="215" y="180" width="190" height="190" rx="32"/>
      <rect class="cut-body" x="340" y="205" width="255" height="105" rx="28"/>
      <rect class="cut-bonnet" x="215" y="25" width="190" height="215" rx="30"/>
      <path class="cut-cavity" d="M270 370V305H250V242H346V215H570V285H350V305H330V370Z"/>
      <path class="cut-control-cavity" d="M245 47H375V215H245Z"/>

      <g aria-label="Vis et ressort de réglage">
        <path class="cut-screw" d="M292 38H328V88H292ZM280 52H340M280 68H340"/>
        <path class="cut-spring" d="M310 82L274 94 346 108 274 122 346 136 274 150 346 164 310 178"/>
      </g>

      <g class="cut-moving mobile" aria-label="Soufflet, tige et clapet mobiles">
        <path class="cut-bellows" d="M258 172Q271 160 284 172Q297 160 310 172Q323 160 336 172Q349 160 362 172L354 204H266Z"/>
        <path class="cut-stem" d="M310 202V258"/>
        <path class="cut-valve" d="M278 272Q310 247 342 272L327 287H293Z"/>
      </g>
      <g class="cut-moving-static" aria-hidden="true">
        <path class="cut-bellows" d="M258 172Q271 160 284 172Q297 160 310 172Q323 160 336 172Q349 160 362 172L354 204H266Z"/>
        <path class="cut-stem" d="M310 202V258"/>
        <path class="cut-valve" d="M278 272Q310 247 342 272L327 287H293Z"/>
      </g>
      <path class="cut-seat" d="M250 305V290H285L294 281M370 305V290H335L326 281"/>

      <!-- Deux informations séparées : le débit principal et la pression qui pilote le soufflet. -->
      <path class="flow-channel" d="${flowPath}" marker-end="url(#flow-arrow-${key})"/>
      ${[0, 1, 2].map((index) => `<circle class="mobile flow-particle" r="6"><animateMotion begin="-${(index * .75).toFixed(2)}s" dur="2.25s" repeatCount="indefinite" path="${flowPath}"/></circle>`).join("")}
      <path class="pressure-signal ${key}" d="${signal}" marker-end="url(#pressure-arrow-${key})"/>

      <text class="cut-label" x="310" y="18">VIS</text>
      <text class="cut-label" x="385" y="118">RESSORT</text>
      <text class="cut-label" x="405" y="188">SOUFFLET</text>
      <text class="cut-label" x="405" y="272">TIGE + CLAPET</text>
      <text class="pressure-word" x="${signalX}" y="198" style="text-anchor:${signalAnchor}" fill="${valve.color}">PRESSION ${valve.side.toUpperCase()} QUI AGIT</text>
      <text class="port-word" x="310" y="395" text-anchor="middle">${portNames[0]}</text>
      <text class="port-word" x="580" y="330" text-anchor="end">${portNames[1]}</text>
      <text class="flow-word" x="455" y="348">PASSAGE DU FLUIDE : COUDE À 90°</text>
      <g class="opening-badge" transform="translate(430 44)"><rect width="160" height="48" rx="12"/><text x="80" y="20">OUVERTURE</text><text data-opening-label x="80" y="40">${Math.round(opening * 100)} %</text></g>
    </svg></div>`;
  }

  function updateKinematicVisual() {
    const valve = valves[selectedValve];
    const opening = valveOpening(valve, pressureRatio);
    const state = stateFor(valve, pressureRatio, opening);
    const lift = 3 + opening * 35;
    const svg = ui.root.querySelector(".kv-cutaway");
    if (svg) {
      svg.style.setProperty("--lift", `${lift.toFixed(1)}px`);
      svg.style.setProperty("--spring-scale", (1 - lift / 105).toFixed(3));
      svg.style.setProperty("--flow-width", (2.5 + opening * 9).toFixed(1));
      svg.style.setProperty("--flow-opacity", (.22 + opening * .78).toFixed(2));
      const openingLabel = svg.querySelector("[data-opening-label]");
      if (openingLabel) openingLabel.textContent = `${Math.round(opening * 100)} %`;
    }
    const output = ui.root.querySelector("#pressure-output");
    if (output) output.textContent = `${Math.round(pressureRatio * 100)} % de la consigne`;
    const pressureWord = pressureRatio < .97 ? "Sous la consigne" : pressureRatio > 1.03 ? "Au-dessus de la consigne" : "À la consigne";
    const pressureTitle = ui.root.querySelector("[data-kinematic-pressure]");
    const actionText = ui.root.querySelector("[data-kinematic-action]");
    const resultTitle = ui.root.querySelector("[data-kinematic-result]");
    const resultText = ui.root.querySelector("[data-kinematic-result-text]");
    if (pressureTitle) pressureTitle.textContent = pressureWord;
    if (actionText) actionText.textContent = valve.action;
    if (resultTitle) resultTitle.textContent = `${state.title} · ouverture ${Math.round(opening * 100)} %`;
    if (resultText) resultText.textContent = state.text;
  }

  function renderKinematic() {
    const valve = valves[selectedValve];
    const opening = valveOpening(valve, pressureRatio);
    const state = stateFor(valve, pressureRatio, opening);
    const pressureWord = pressureRatio < .97 ? "Sous la consigne" : pressureRatio > 1.03 ? "Au-dessus de la consigne" : "À la consigne";
    ui.controls.innerHTML = `${familyButtons(selectedValve)}<button type="button" class="choice-button" data-pressure="0.82">Pression basse</button><button type="button" class="choice-button" data-pressure="1">Équilibre</button><button type="button" class="choice-button" data-pressure="1.18">Pression haute</button>`;
    ui.root.innerHTML = `<div class="kinematic-layout"><div class="kinematic-main">${cutawaySvg(selectedValve, opening)}<div class="state-column">
      <label class="pressure-control" for="pressure-range"><span>Pression ${valve.side}</span><output id="pressure-output">${Math.round(pressureRatio * 100)} % de la consigne</output><input id="pressure-range" type="range" min="75" max="125" step="1" value="${Math.round(pressureRatio * 100)}"></label>
      <div class="state-panel"><strong data-kinematic-pressure>${pressureWord}</strong><p data-kinematic-action>${valve.action}</p></div>
      <div class="state-panel state-result"><strong data-kinematic-result>${state.title} · ouverture ${Math.round(opening * 100)} %</strong><p data-kinematic-result-text>${state.text}</p></div>
    </div></div><div class="kinematic-chain"><div class="chain-node"><span>1</span><strong>Pression ${valve.side}</strong></div><span class="chain-arrow">→</span><div class="chain-node"><span>2</span><strong>Soufflet</strong></div><span class="chain-arrow">→</span><div class="chain-node"><span>3</span><strong>Tige</strong></div><span class="chain-arrow">→</span><div class="chain-node"><span>4</span><strong>Clapet</strong></div><span class="chain-arrow">→</span><div class="chain-node"><span>5</span><strong>Débit</strong></div></div></div>`;
    bindFamilyButtons(renderKinematic);
    ui.controls.querySelectorAll("[data-pressure]").forEach((button) => button.addEventListener("click", () => {
      pressureRatio = Number(button.dataset.pressure);
      const range = document.getElementById("pressure-range");
      if (range) range.value = String(Math.round(pressureRatio * 100));
      updateKinematicVisual();
    }));
    document.getElementById("pressure-range").addEventListener("input", (event) => {
      pressureRatio = Number(event.target.value) / 100;
      updateKinematicVisual();
    });
  }

  function adjustmentScene(key) {
    const valve = valves[key];
    const turns = adjustmentTurns[key];
    const checked = adjustmentChecks[key];
    const needle = -48 + (turns + 2) * 24;
    const steps = [
      ["identify", "Identifier", "code, flèche et notice"],
      ["connect", "Brancher", `manomètre côté ${valve.side}`],
      ["stabilise", "Stabiliser", "régime adapté au contrôle"],
      ["adjust", "Corriger", "petite touche, bonne direction"],
      ["verify", "Vérifier", "effet réel puis capuchon"]
    ];
    return `<div class="adjust-layout"><section class="adjust-visual">
      <svg viewBox="0 0 620 350" role="img" aria-label="Vis de réglage reliée au ressort et manomètre sur le côté ${valve.side}">
        <defs><marker id="adjust-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#c4542d"/></marker></defs>
        <path class="adjust-body" d="M170 95H320V205H410V305H320V345H170V305H70V205H170Z"/>
        <g class="adjust-screw" style="transform:rotate(${turns * 45}deg)"><path d="M225 25H265V145H225Z"/><path d="M215 42H275M215 58H275M215 74H275"/></g>
        <path d="M193 45Q245 12 298 46" fill="none" stroke="#c4542d" stroke-width="5" marker-end="url(#adjust-arrow)"/>
        <text x="112" y="57" text-anchor="middle" font-size="15" font-weight="900">VISSE = P ↑</text>
        <path d="M205 145 285 160 205 175 285 190 205 205" fill="none" stroke="#354c60" stroke-width="8"/>
        <text x="245" y="230" text-anchor="middle" font-size="14" font-weight="800">RESSORT</text>
        <circle class="gauge-face" cx="505" cy="150" r="78"/><path class="gauge-needle" style="transform:rotate(${needle}deg)" d="M505 150 552 116"/><circle cx="505" cy="150" r="8" fill="#17324f"/>
        <text x="505" y="195" text-anchor="middle" font-size="15" font-weight="800">P ${valve.side.toUpperCase()}</text>
        <path d="M472 220Q425 287 365 271" fill="none" stroke="#236da7" stroke-width="5"/>
      </svg>
      <label class="adjust-control" for="adjust-range"><span>Rotation pédagogique</span><output id="adjust-output">${turns > 0 ? "+" : ""}${turns.toFixed(1).replace(".", ",")} tour</output><input id="adjust-range" type="range" min="-2" max="2" step="0.5" value="${turns}"></label>
    </section><section class="method-panel"><h3>Contrôle ${valve.code}</h3>${steps.map(([id,title,note], index) => `<button type="button" class="method-card${checked.has(id) ? " checked" : ""}" data-method="${id}" aria-pressed="${checked.has(id)}" title="${escapeHtml(note)}"><span>${checked.has(id) ? "✓" : index + 1}</span><span><strong>${title}</strong><small class="sr-only">${note}</small></span></button>`).join("")}<p class="direction-rule"><strong>Spécificité :</strong> ${valve.setting}</p></section></div>`;
  }

  function renderAdjustment() {
    ui.controls.innerHTML = familyButtons(selectedValve);
    ui.root.innerHTML = adjustmentScene(selectedValve);
    bindFamilyButtons(renderAdjustment);
    document.getElementById("adjust-range").addEventListener("input", (event) => {
      adjustmentTurns[selectedValve] = Number(event.target.value);
      renderAdjustment();
    });
    ui.root.querySelectorAll("[data-method]").forEach((button) => button.addEventListener("click", () => {
      const checked = adjustmentChecks[selectedValve];
      const key = button.dataset.method;
      if (checked.has(key)) checked.delete(key); else checked.add(key);
      renderAdjustment();
    }));
  }

  function renderUses() {
    ui.controls.innerHTML = `<span class="neutral-box" style="margin:0;padding:.45rem .7rem">Besoin → organe → résultat attendu</span>`;
    ui.root.innerHTML = `<div class="use-grid">
      <article class="use-card kvp"><h3>KVP</h3><span class="use-name">Pression d’évaporation</span><p class="use-scene">Plusieurs évaporateurs, températures différentes</p><ul><li>posé sur la sortie de l’évaporateur concerné ;</li><li>maintient sa pression minimale ;</li><li>évite une température de produit trop basse.</li></ul><p class="use-result">Résultat : l’évaporateur travaille au régime voulu.</p></article>
      <article class="use-card kvl"><h3>KVL</h3><span class="use-name">Pression de carter</span><p class="use-scene">Redémarrage après dégivrage ou arrêt long</p><ul><li>posé juste avant le compresseur ;</li><li>limite sa pression d’aspiration ;</li><li>réduit le risque de surcharge moteur.</li></ul><p class="use-result">Résultat : le compresseur reprend sa charge progressivement.</p></article>
      <article class="use-card kvr"><h3>KVR</h3><span class="use-name">Pression de condensation</span><p class="use-scene">Condenseur à air par temps froid</p><ul><li>posé après le condenseur ;</li><li>maintient une HP suffisante ;</li><li>souvent associé à une NRD et au réservoir.</li></ul><p class="use-result">Résultat : alimentation du détendeur plus stable.</p></article>
    </div>`;
  }

  const diagnoses = {
    product: {
      button: "Produit trop froid",
      note: "une branche d’évaporation descend trop bas",
      code: "KVP",
      title: "Contrôler la pression d’évaporation de la branche",
      steps: ["Identifier le KVP et son sens.", "Mesurer la pression avant la vanne.", "Comparer à la température de produit recherchée.", "Vérifier charge, débit d’air et détendeur avant de corriger."],
      caution: "Le KVP peut maintenir une pression ; il ne corrige pas un évaporateur encrassé."
    },
    restart: {
      button: "Surcharge au démarrage",
      note: "le compresseur force après un dégivrage",
      code: "KVL",
      title: "Contrôler la pression vue par le compresseur",
      steps: ["Lire la pression après le KVL.", "Comparer à la limite admissible du compresseur.", "Vérifier sélection, sens et bande de régulation.", "Observer un nouveau redémarrage après correction."],
      caution: "Le KVL ne remplace ni la protection électrique ni le bon dimensionnement du compresseur."
    },
    winter: {
      button: "HP trop basse en hiver",
      note: "l’alimentation du détendeur devient instable",
      code: "KVR",
      title: "Contrôler condensation, réservoir et NRD",
      steps: ["Mesurer la pression avant le KVR.", "Contrôler la pression du réservoir.", "Vérifier le montage KVR + NRD et le sens.", "Régler en conditions représentatives, selon la notice."],
      caution: "Une HP basse peut aussi venir de la charge, du débit d’air ou de la commande des ventilateurs."
    },
    electrical: {
      button: "Le compresseur doit couper",
      note: "on cherche une commande tout ou rien",
      code: "PRESSOSTAT",
      title: "Ne pas demander au régulateur une coupure électrique",
      steps: ["Distinguer modulation hydraulique et commande électrique.", "Identifier le pressostat de régulation ou de sécurité.", "Contrôler son schéma et son réarmement.", "Ne pas dérégler KVP, KVL ou KVR pour obtenir une coupure."],
      caution: "Un régulateur KV déplace un clapet. Un pressostat déplace un contact électrique."
    }
  };

  function renderDiagnosis() {
    const answer = diagnoses[diagnosisKey];
    ui.controls.innerHTML = `<span class="neutral-box" style="margin:0;padding:.45rem .7rem">Symptôme → mesures → décision</span>`;
    ui.root.innerHTML = `<div class="diagnosis-layout"><div class="symptom-list">${Object.entries(diagnoses).map(([key,item]) => `<button type="button" class="symptom-button${diagnosisKey === key ? " active" : ""}" data-diagnosis="${key}"><strong>${item.button}</strong><span>${item.note}</span></button>`).join("")}</div><article class="diagnosis-answer"><span class="answer-code">${answer.code}</span><h3>${answer.title}</h3><ol>${answer.steps.map((step) => `<li>${step}</li>`).join("")}</ol><p class="diagnosis-caution"><strong>Vigilance :</strong> ${answer.caution}</p></article></div>`;
    ui.root.querySelectorAll("[data-diagnosis]").forEach((button) => button.addEventListener("click", () => { diagnosisKey = button.dataset.diagnosis; renderDiagnosis(); }));
  }

  function renderQuiz() {
    ui.controls.innerHTML = quiz.complete ? `<button type="button" class="action-button" id="restart-quiz">Recommencer</button>` : `<span class="neutral-box" style="margin:0;padding:.45rem .7rem">Une seule réponse par question</span>`;
    if (quiz.complete) {
      ui.root.innerHTML = `<div class="quiz-shell"><div class="quiz-card quiz-result"><p class="kicker">Parcours terminé</p><strong>${quiz.score} / ${quizQuestions.length}</strong><h3>${quiz.score >= 5 ? "La logique des trois vannes est acquise." : quiz.score >= 3 ? "La base est là ; revois le côté régulé." : "Repars du circuit et de la pression régulée."}</h3><p>Le résultat n’est pas enregistré.</p></div></div>`;
      document.getElementById("restart-quiz").addEventListener("click", () => { Object.assign(quiz, { index: 0, score: 0, answered: false, selected: null, complete: false }); renderQuiz(); });
      return;
    }
    const question = quizQuestions[quiz.index];
    ui.root.innerHTML = `<div class="quiz-shell"><div class="quiz-card"><div class="quiz-meta"><span>Question ${quiz.index + 1} / ${quizQuestions.length}</span><span>Score ${quiz.score}</span></div><h3>${question.prompt}</h3><div class="quiz-answers">${question.answers.map((answer,index) => { let state = ""; if (quiz.answered && index === question.correct) state = " correct"; else if (quiz.answered && index === quiz.selected) state = " wrong"; return `<button type="button" class="quiz-answer${state}" data-answer="${index}" ${quiz.answered ? "disabled" : ""}>${answer}</button>`; }).join("")}</div>${quiz.answered ? `<p class="quiz-feedback"><strong>${quiz.selected === question.correct ? "Correct." : "À revoir."}</strong> ${question.why}</p><button type="button" class="action-button active quiz-next" id="quiz-next">${quiz.index === quizQuestions.length - 1 ? "Voir le résultat" : "Question suivante"}</button>` : ""}</div></div>`;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
      quiz.selected = Number(button.dataset.answer);
      quiz.answered = true;
      if (quiz.selected === question.correct) quiz.score += 1;
      renderQuiz();
    }));
    const nextQuestion = document.getElementById("quiz-next");
    if (nextQuestion) nextQuestion.addEventListener("click", () => {
      if (quiz.index === quizQuestions.length - 1) quiz.complete = true;
      else { quiz.index += 1; quiz.answered = false; quiz.selected = null; }
      renderQuiz();
    });
  }

  function renderStepper() {
    ui.stepper.innerHTML = lessons.map((lesson, index) => `<button type="button" class="step-button${index === current ? " active" : ""}${index <= furthest ? " visited" : ""}" data-step="${index}" ${index === current ? 'aria-current="step"' : ""}><span class="step-index">${index + 1}</span><span class="step-label">${lesson.short}</span></button>`).join("");
    ui.stepper.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => goTo(Number(button.dataset.step), true)));
  }

  function renderLesson(focusTitle) {
    setVisualFocus(false);
    disposeCurrentVisual();
    stopVoice();
    const lesson = lessons[current];
    ui.kicker.textContent = lesson.kicker;
    ui.title.textContent = lesson.title;
    ui.intro.textContent = lesson.intro;
    ui.detail.innerHTML = lesson.detail;
    ui.takeaway.textContent = lesson.takeaway;
    ui.visualTitle.textContent = lesson.visualTitle;
    ui.visualHint.textContent = lesson.visualHint;
    ui.caption.textContent = lesson.caption;
    ui.controls.innerHTML = "";
    ui.root.innerHTML = "";
    lesson.render();
    renderStepper();
    ui.previous.disabled = current === 0;
    ui.next.textContent = current === lessons.length - 1 ? "Revenir au début ↺" : "Continuer →";
    ui.progressLabel.textContent = `Étape ${current + 1} sur ${lessons.length} · ${lesson.short}`;
    ui.progressBar.style.width = `${((current + 1) / lessons.length) * 100}%`;
    if (focusTitle) ui.title.focus({ preventScroll: true });
  }

  function goTo(index, focusTitle) {
    current = clamp(index, 0, lessons.length - 1);
    furthest = Math.max(furthest, current);
    renderLesson(focusTitle);
  }

  function setVisualFocus(enabled) {
    visualFocus = Boolean(enabled);
    document.body.classList.toggle("visual-focus", visualFocus);
    ui.focusButton.setAttribute("aria-pressed", String(visualFocus));
    ui.focusButton.innerHTML = visualFocus ? "✕ <span>Réduire</span>" : "⛶ <span>Agrandir</span>";
    ui.focusButton.setAttribute("aria-label", visualFocus ? "Quitter le visuel agrandi" : "Agrandir le visuel");
    if (visualFocus) {
      ui.focusButton.focus({ preventScroll: true });
      ui.status.textContent = "Visuel agrandi. Appuyez sur Échap ou sur Réduire pour revenir au parcours.";
    }
  }

  function installSwipeNavigation() {
    let start = null;
    ui.lessonCopy.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      start = { x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId };
    });
    const finish = (event) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const elapsed = performance.now() - start.time;
      start = null;
      if (elapsed > 900 || Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      if (dx < 0 && current < lessons.length - 1) goTo(current + 1, true);
      if (dx > 0 && current > 0) goTo(current - 1, true);
    };
    ui.lessonCopy.addEventListener("pointerup", finish);
    ui.lessonCopy.addEventListener("pointercancel", () => { start = null; });
  }

  function chooseVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    preferredVoice = voices.slice().sort((left, right) => voiceScore(right) - voiceScore(left))[0] || null;
    ui.voice.title = preferredVoice
      ? `Voix sélectionnée automatiquement : ${preferredVoice.name}`
      : "La meilleure voix française disponible sera utilisée.";
  }

  function voiceScore(voice) {
    const language = String(voice.lang || "").replace("_", "-").toLowerCase();
    const name = String(voice.name || "").toLowerCase();
    let score = 0;
    if (language === "fr-fr") score += 1000;
    else if (language.startsWith("fr-")) score += 650;
    else if (language.startsWith("fr")) score += 500;
    if (/natural|naturel|neural|online|premium|enhanced/.test(name)) score += 450;
    if (/google/.test(name)) score += 160;
    if (/microsoft/.test(name)) score += 100;
    const preferredNames = ["denise", "henri", "julie", "paul", "hortense"];
    const preferredIndex = preferredNames.findIndex((candidate) => name.includes(candidate));
    if (preferredIndex >= 0) score += 120 - preferredIndex * 15;
    if (/desktop|compact|legacy/.test(name)) score -= 220;
    if (voice.localService === false) score += 30;
    if (voice.default) score += 5;
    return score;
  }

  function naturaliseSpeech(text) {
    return String(text || "")
      .replace(/\bKVP\b/g, "K V P")
      .replace(/\bKVL\b/g, "K V L")
      .replace(/\bKVR\b/g, "K V R")
      .replace(/\bNRD\b/g, "N R D")
      .replace(/\bHP\b/g, "haute pression")
      .replace(/\bBP\b/g, "basse pression")
      .replace(/[→➜]/g, ", puis ")
      .replace(/\s*·\s*/g, ", ")
      .replace(/\s*\n+\s*/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function screenSpeechSegments() {
    const detailBlocks = Array.from(ui.detail.children).map((element) => element.innerText);
    const visibleApplication = current >= 5 ? ui.root.innerText : "";
    return [ui.title.textContent, ui.intro.textContent, ...detailBlocks, ui.takeaway.textContent, visibleApplication]
      .map(naturaliseSpeech)
      .filter(Boolean);
  }

  function createUtterance(text, isTitle) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferredVoice && preferredVoice.lang ? preferredVoice.lang : "fr-FR";
    utterance.rate = isTitle ? Math.max(0.75, voiceRate - 0.04) : voiceRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (preferredVoice) utterance.voice = preferredVoice;
    return utterance;
  }

  function stopVoice() {
    voiceRun += 1;
    speaking = false;
    paused = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    ui.voice.innerHTML = "▶ <span>Écouter</span>";
    ui.voice.setAttribute("aria-label", "Écouter l’écran");
  }

  function toggleVoice() {
    if (!("speechSynthesis" in window)) {
      ui.status.textContent = "La lecture vocale n’est pas disponible sur cet appareil.";
      return;
    }
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      paused = true;
      ui.voice.innerHTML = "▶ <span>Reprendre</span>";
      ui.voice.setAttribute("aria-label", "Reprendre la lecture");
      return;
    }
    if (speaking && paused) {
      window.speechSynthesis.resume();
      paused = false;
      ui.voice.innerHTML = "⏸ <span>Pause</span>";
      ui.voice.setAttribute("aria-label", "Mettre la lecture en pause");
      return;
    }
    stopVoice();
    chooseVoice();
    const run = ++voiceRun;
    const segments = screenSpeechSegments();
    speaking = true;
    ui.voice.innerHTML = "⏸ <span>Pause</span>";
    ui.voice.setAttribute("aria-label", "Mettre la lecture en pause");
    segments.forEach((segment, index) => {
      const utterance = createUtterance(segment, index === 0);
      const isLast = index === segments.length - 1;
      utterance.onend = () => { if (isLast && run === voiceRun) stopVoice(); };
      utterance.onerror = (event) => {
        if (run !== voiceRun) return;
        if (!/canceled|interrupted/i.test(event.error || "")) ui.status.textContent = "La lecture vocale est indisponible. Le texte reste affiché à l’écran.";
        stopVoice();
      };
      window.speechSynthesis.speak(utterance);
    });
  }

  ui.previous.addEventListener("click", () => goTo(current - 1, true));
  ui.next.addEventListener("click", () => goTo(current === lessons.length - 1 ? 0 : current + 1, true));
  ui.voice.addEventListener("click", toggleVoice);
  ui.rate.value = String(voiceRate);
  ui.rate.addEventListener("change", () => { voiceRate = Number(ui.rate.value); saveRate(voiceRate); if (speaking) { stopVoice(); toggleVoice(); } });
  ui.sourceButton.addEventListener("click", () => ui.sources.showModal());
  ui.focusButton.addEventListener("click", () => setVisualFocus(!visualFocus));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visualFocus) { setVisualFocus(false); return; }
    if (event.defaultPrevented || ui.sources.open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) return;
    if (event.key === "ArrowRight") goTo(current === lessons.length - 1 ? current : current + 1, true);
    if (event.key === "ArrowLeft") goTo(current - 1, true);
  });
  installSwipeNavigation();
  if (window.speechSynthesis) { chooseVoice(); window.speechSynthesis.addEventListener("voiceschanged", chooseVoice); }
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopVoice(); });
  window.addEventListener("beforeunload", stopVoice);
  renderLesson(false);
})();
