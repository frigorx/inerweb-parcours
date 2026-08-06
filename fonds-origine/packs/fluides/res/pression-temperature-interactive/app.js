(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  let current = 0;
  let furthest = 0;
  let autoplay = false;
  let voiceEnabled = true;
  let speaking = false;
  let paused = false;
  let speechRun = 0;
  let speechTimer = null;
  let selectedVoice = null;
  let selectedVoiceKey = "";
  let voiceChoiceIsManual = false;
  let rateIndex = 1;
  let quizIndex = 0;
  let score = 0;
  let answered = false;
  let reverseMode = "evap";
  let reversePressure = 0.199;
  let directionMode = "evap";
  let measureMode = "superheat";

  const rates = [0.8, 0.95, 1.1, 1.25];
  const WATER = [
    { p: 0.0123, t: 10 },
    { p: 0.0234, t: 20 },
    { p: 0.0317, t: 25 },
    { p: 0.0738, t: 40 },
    { p: 0.199, t: 60 },
    { p: 0.474, t: 80 },
    { p: 1.013, t: 100 },
  ];
  const R134A =
    window.FLUIDES && window.FLUIDES.R134a
      ? window.FLUIDES.R134a.table
      : [
          { t: -20, p: 1.327 },
          { t: -10, p: 2.006 },
          { t: 0, p: 2.928 },
          { t: 10, p: 4.146 },
          { t: 20, p: 5.717 },
          { t: 30, p: 7.702 },
          { t: 40, p: 10.166 },
          { t: 50, p: 13.179 },
        ];
  const R407C_GLIDE = window.FLUIDES && window.FLUIDES.R407C ? window.FLUIDES.R407C.glide : 6.1;

  const lessons = [
    {
      short: "Prévoir",
      kicker: "Étape 1 · Commencer par une surprise",
      title: "De l’eau à 25 °C, sans flamme… peut-elle bouillir ?",
      text: "Placez-vous avant l’expérience. Une pompe va seulement retirer de l’air sous la cloche. Choisissez votre hypothèse.",
      speak:
        "Nous plaçons de l’eau à vingt-cinq degrés sous une cloche transparente. Il n’y a ni flamme, ni résistance. La pompe va seulement retirer de l’air. Avant de regarder, faites une prévision. L’eau doit-elle forcément atteindre cent degrés, ou la pression peut-elle déplacer sa température d’ébullition ?",
      render: predictionMarkup,
    },
    {
      short: "Faire le vide",
      kicker: "Étape 2 · Faire bouillir sans chauffage extérieur",
      title: "La pression chute. Vers 0,032 bar absolu, les bulles apparaissent.",
      text: "Actionnez la pompe. La cloche, la courbe et les mesures évoluent ensemble : pression, température, état et énergie restent visibles.",
      speak:
        "Au départ, l’eau est à vingt-cinq degrés et la pression approche un bar absolu. La pompe retire de l’air. Vers zéro virgule zéro trois deux bar absolu, le point rejoint la courbe de saturation et les premières bulles apparaissent. Si nous tirons davantage au vide, l’eau doit encore fournir la chaleur latente de vaporisation. Elle prélève cette énergie dans sa propre réserve et dans son environnement, donc elle se refroidit. Sans chauffage extérieur ne signifie jamais sans énergie.",
      voiceSteps: [
        { control: "#vacuum-slider", value: 0, text: "Au départ : environ un bar absolu, vingt-cinq degrés, eau liquide. Le point est loin de la condition d’ébullition." },
        { control: "#vacuum-slider", value: 72, text: "La pompe retire de l’air. La pression extérieure baisse, mais elle est encore trop forte pour cette eau à vingt-cinq degrés." },
        { control: "#vacuum-slider", value: 89, text: "Vers zéro virgule zéro trois deux bar absolu, les premières bulles apparaissent à vingt-cinq degrés." },
        { control: "#vacuum-slider", value: 100, text: "En tirant davantage au vide, la vaporisation prélève de l’énergie. L’eau se refroidit : sans chauffage extérieur ne signifie pas sans énergie." },
      ],
      render: vacuumMarkup,
    },
    {
      short: "Équilibrer",
      kicker: "Étape 3 · Comprendre la condition d’ébullition",
      title: "La vapeur pousse de l’intérieur. La pression extérieure s’oppose.",
      text: "Déroulez les trois moments. L’ébullition commence lorsque la pression de vapeur du liquide atteint la pression qui s’exerce sur lui.",
      speak:
        "Même avant de bouillir, le liquide produit de la vapeur. Cette vapeur exerce une pression appelée pression de vapeur. La pression extérieure s’oppose au développement des bulles. La pompe affaiblit cette opposition. À vingt-cinq degrés, la pression de vapeur de l’eau vaut environ zéro virgule zéro trois deux bar absolu. Quand la pression extérieure atteint cette même valeur, les bulles peuvent grandir dans tout le liquide : l’ébullition commence.",
      render: causeMarkup,
    },
    {
      short: "Lire la carte",
      kicker: "Étape 4 · Construire la carte pression–température",
      title: "Chaque pression possède sa température de saturation.",
      text: "Déplacez le point sur la grande courbe de l’eau. Lisez les deux axes et les valeurs : cette carte scientifique deviendra un outil quotidien.",
      speak:
        "Voici la carte pression-température de saturation. L’axe horizontal porte la pression absolue en bar. L’axe vertical porte la température en degrés Celsius. À environ un bar absolu, l’eau sature vers cent degrés. À zéro virgule quarante-sept bar, vers quatre-vingts degrés. À zéro virgule vingt bar, vers soixante degrés. Et à zéro virgule zéro deux bar, vers vingt degrés. La courbe n’est pas une règle de trois, mais elle monte toujours : baisser la pression abaisse la température de saturation.",
      voiceSteps: [
        { control: "#water-pressure-slider", value: 100, text: "À environ un bar absolu, l’eau sature vers cent degrés." },
        { control: "#water-pressure-slider", value: 80, text: "À environ zéro virgule quarante-sept bar absolu, elle sature vers quatre-vingts degrés." },
        { control: "#water-pressure-slider", value: 55, text: "Vers zéro virgule vingt bar absolu, elle sature près de soixante degrés." },
        { control: "#water-pressure-slider", value: 0, text: "Près de zéro virgule zéro deux bar absolu, elle sature vers vingt degrés. La pression choisit la hauteur du palier vu au chapitre précédent." },
      ],
      render: ptCurveMarkup,
    },
    {
      short: "Inverser",
      kicker: "Étape 5 · Parcourir une frontière dans deux sens",
      title: "Fluide pur : évaporer et condenser suivent la même courbe.",
      text: "Choisissez une pression puis inversez le transfert d’énergie. La température limite reste identique ; seul le sens du changement d’état s’inverse.",
      speak:
        "Pour un fluide pur à une pression donnée, il existe une seule température de saturation. Si le liquide reçoit de l’énergie, il se vaporise. Si la vapeur cède de l’énergie, elle se condense. Même pression, même température, même point sur la courbe. L’évaporation et la condensation parcourent simplement la même frontière dans deux sens opposés.",
      render: reverseMarkup,
    },
    {
      short: "Évaporer",
      kicker: "Étape 6 · Commencer par l’évaporateur",
      title: "La basse pression rend le fluide plus froid que le local.",
      text: "Réglez la basse pression du R‑134a. Sur la courbe, la saturation doit passer sous +4 °C pour que l’énergie aille du local vers le fluide.",
      speak:
        "Commençons impérativement par l’évaporateur. Le local est à plus quatre degrés. La machine maintient une basse pression dans l’échangeur. À environ deux bars absolus pour cet exemple au R cent-trente-quatre a, la température de saturation est proche de moins dix degrés. Le local est donc plus chaud que le fluide. L’énergie va du local vers le fluide, qui se vaporise. C’est l’effet frigorifique.",
      voiceSteps: [
        { control: "#evap-slider", value: 30, text: "À trois bars absolus, la saturation est proche de zéro degré : déjà sous les quatre degrés du local." },
        { control: "#evap-slider", value: 20, text: "En abaissant la pression vers deux bars absolus, la saturation descend près de moins dix degrés. L’énergie va du local vers le fluide." },
      ],
      render: evaporatorMarkup,
    },
    {
      short: "Condenser",
      kicker: "Étape 7 · Passer ensuite au condenseur",
      title: "La haute pression rend le fluide plus chaud que l’air extérieur.",
      text: "Réglez la haute pression du R‑134a. La saturation doit dépasser +30 °C pour que l’énergie aille du fluide vers l’extérieur.",
      speak:
        "Passons maintenant au condenseur. L’air extérieur est à plus trente degrés. La haute pression élève la température de saturation du fluide. Vers dix virgule deux bars absolus dans cet exemple, elle approche plus quarante degrés. Le fluide est plus chaud que l’air. L’énergie quitte donc le fluide vers l’extérieur, tandis que la vapeur se liquéfie.",
      voiceSteps: [
        { control: "#cond-slider", value: 85, text: "Vers huit virgule cinq bars absolus, la saturation dépasse légèrement trente degrés." },
        { control: "#cond-slider", value: 102, text: "Vers dix virgule deux bars absolus, elle approche quarante degrés. L’énergie va du fluide vers l’extérieur." },
      ],
      render: condenserMarkup,
    },
    {
      short: "Traduire",
      kicker: "Étape 8 · Du manomètre à la température",
      title: "Une pression n’a de sens qu’avec le fluide, l’unité et la référence.",
      text: "Déplacez le manomètre. Convertissez la pression relative en pression absolue, puis lisez la saturation du R‑134a dans la table et sur la courbe.",
      speak:
        "Le manomètre de service indique généralement une pression relative : zéro signifie la pression atmosphérique. Une pression absolue part du vide parfait. Dans cette simulation, nous ajoutons environ un bar à la pression relative pour obtenir l’absolue demandée par la table. Mais certaines réglettes acceptent directement la pression relative. Il faut donc toujours annoncer quatre choses : le fluide, la valeur, l’unité et le type de pression.",
      voiceSteps: [
        { control: "#translator-slider", value: 1, text: "R cent-trente-quatre a, un bar relatif. Ajoutons environ un bar atmosphérique : nous obtenons près de deux bars absolus et une saturation proche de moins dix degrés." },
        { control: "#translator-slider", value: 9.2, text: "Neuf virgule deux bars relatifs donnent près de dix virgule deux bars absolus et une saturation proche de quarante degrés." },
      ],
      render: translatorMarkup,
    },
    {
      short: "Comparer",
      kicker: "Étape 9 · Fluide pur ou mélange zéotrope",
      title: "À pression constante, le pur reste stable. Le zéotrope glisse.",
      text: "Faites avancer la vaporisation côte à côte. Pression, température, état et transfert d’énergie restent visibles sur les deux graphiques.",
      speak:
        "Un fluide pur garde une température constante pendant son changement d’état à pression constante : bulle et rosée coïncident. Dans un mélange zéotrope, les composants ne se vaporisent pas exactement ensemble. À la même pression constante, la première bulle apparaît à la température de bulle, puis la température monte jusqu’à la rosée, lorsque la dernière goutte disparaît. Cet écart est le glissement de température.",
      voiceSteps: [
        { control: "#glide-slider", value: 0, text: "Au départ : première bulle. Le pur et le zéotrope commencent leur vaporisation." },
        { control: "#glide-slider", value: 50, text: "À pression constante, le pur reste à moins dix degrés. Le zéotrope monte progressivement en température." },
        { control: "#glide-slider", value: 100, text: "À la dernière goutte, le zéotrope atteint sa température de rosée. L’écart entre bulle et rosée est le glissement." },
      ],
      render: glideMarkup,
    },
    {
      short: "Parcourir",
      kicker: "Étape 10 · Faire le voyage dans les deux sens",
      title: "Bulle et rosée gardent leur nom. L’ordre dépend du sens.",
      text: "Basculez entre évaporation et condensation. Faites voyager le point et observez l’état du fluide, la température et le sens de l’énergie.",
      speak:
        "En évaporation, la première bulle apparaît au point de bulle. La température monte pendant la zone liquide plus vapeur. À la rosée, la dernière goutte disparaît. En condensation, le voyage s’inverse. La première goutte apparaît à la rosée, puis la température descend. Au point de bulle, la dernière bulle disparaît. Les noms décrivent les frontières ; ils ne décrivent pas l’ordre du voyage.",
      voiceSteps: [
        { direction: "evap", control: "#direction-slider", value: 0, text: "Évaporation : nous partons du liquide. Le fluide va recevoir de l’énergie." },
        { direction: "evap", control: "#direction-slider", value: 25, text: "Point de bulle : la première bulle apparaît." },
        { direction: "evap", control: "#direction-slider", value: 75, text: "Point de rosée : la dernière goutte disparaît." },
        { direction: "cond", control: "#direction-slider", value: 25, text: "Condensation : à la rosée, la première goutte apparaît. Le fluide cède de l’énergie." },
        { direction: "cond", control: "#direction-slider", value: 75, text: "Au point de bulle, la dernière bulle disparaît : le fluide est entièrement liquide." },
      ],
      render: directionMarkup,
    },
    {
      short: "Référencer",
      kicker: "Étape 11 · Préparer les mesures métier",
      title: "Surchauffe : rosée. Sous-refroidissement : bulle.",
      text: "Choisissez une mesure puis sa bonne référence. Avec un zéotrope, utiliser la mauvaise colonne crée une erreur égale à une partie du glissement.",
      speak:
        "La surchauffe concerne une vapeur seule, juste après la disparition de la dernière goutte. Sa référence est donc la température de rosée. Le sous-refroidissement concerne un liquide seul, après la disparition de la dernière bulle. Sa référence est la température de bulle. Sur un fluide pur, ces deux températures coïncident. Sur un zéotrope, la bonne colonne est indispensable.",
      render: measureMarkup,
    },
    {
      short: "Régler",
      kicker: "Étape 12 · Mission frigoriste",
      title: "Placez les deux points de saturation du bon côté des milieux.",
      text: "Réglez les pressions de l’exemple R‑134a. La courbe doit montrer l’évaporation au moins 5 K sous le local et la condensation au moins 5 K au-dessus de l’extérieur.",
      speak:
        "Voici une mission de raisonnement, pas une consigne universelle de réglage. Le local est à quatre degrés et l’air extérieur à trente degrés. Placez le point basse pression au moins cinq kelvins sous le local. Placez le point haute pression au moins cinq kelvins au-dessus de l’extérieur. Vérifiez à la fois les nombres, les deux points sur la courbe et les flèches d’énergie.",
      render: missionMarkup,
    },
    {
      short: "Valider",
      kicker: "Étape 13 · Défi pression–température",
      title: "Expliquez maintenant ce que la pression change réellement.",
      text: "Dix situations vérifient l’expérience sous vide, la courbe de saturation, le circuit, les types de pression et les zéotropes.",
      speak:
        "Dernière étape. Vous n’avez pas à mémoriser toutes les tables. Vous devez savoir raisonner : pourquoi l’eau bout sous vide, comment la basse et la haute pression donnent leurs températures aux échangeurs, comment traduire une pression, et pourquoi un zéotrope possède une bulle et une rosée.",
      zoneClass: "quiz-zone",
      render: quizMarkup,
    },
  ];

  const questions = [
    {
      q: "Pourquoi de l’eau tiède peut-elle bouillir sous une cloche à vide ?",
      answers: ["La baisse de pression abaisse sa température d’ébullition", "La pompe fabrique de la chaleur", "Le vide supprime le besoin d’énergie"],
      correct: 0,
      why: "La pompe déplace la condition de saturation : à pression plus basse, l’eau peut bouillir à plus basse température.",
    },
    {
      q: "Sans résistance chauffante, d’où vient l’énergie nécessaire à la vaporisation ?",
      answers: ["Uniquement de la pompe", "De l’eau elle-même et de son environnement", "De nulle part"],
      correct: 1,
      why: "La chaleur latente est prélevée dans l’eau et son environnement ; l’eau se refroidit.",
    },
    {
      q: "Si la pression d’un fluide pur diminue, sa température de saturation…",
      answers: ["augmente toujours", "ne dépend jamais de la pression", "diminue"],
      correct: 2,
      why: "Pression plus basse signifie température de saturation plus basse.",
    },
    {
      q: "À une pression donnée, un fluide pur bout et condense…",
      answers: ["à deux températures sans rapport", "à la même température de saturation", "uniquement à 100 °C"],
      correct: 1,
      why: "Évaporation et condensation parcourent la même frontière liquide-vapeur dans des sens opposés.",
    },
    {
      q: "Pourquoi maintient-on une basse pression dans l’évaporateur ?",
      answers: ["Pour saturer plus froid que le local", "Pour chauffer le local", "Pour empêcher toute vaporisation"],
      correct: 0,
      why: "La saturation doit être plus froide que le milieu afin que l’énergie entre dans le fluide.",
    },
    {
      q: "Pourquoi le condenseur fonctionne-t-il à une pression plus élevée ?",
      answers: ["Pour produire du vide dehors", "Pour saturer plus chaud que l’extérieur", "Pour supprimer le transfert d’énergie"],
      correct: 1,
      why: "Le fluide doit être plus chaud que le milieu extérieur pour lui céder son énergie.",
    },
    {
      q: "Que fait une table pression–température ?",
      answers: ["Elle remplace le manomètre", "Elle mesure directement la température du tube", "Elle traduit une pression en température de saturation"],
      correct: 2,
      why: "Le manomètre mesure la pression ; la table du fluide donne la température de saturation correspondante.",
    },
    {
      q: "Un manomètre indique 1,0 bar relatif. Quelle information faut-il vérifier avant de lire une table ?",
      answers: ["La couleur du flexible seulement", "Le fluide, l’unité et si la table attend une pression relative ou absolue", "La température de la pièce uniquement"],
      correct: 1,
      why: "Une pression n’est exploitable qu’avec le fluide, l’unité et sa référence. Ici, 1 bar relatif vaut environ 2 bars absolus.",
    },
    {
      q: "À pression constante, que fait la température d’un zéotrope pendant son changement d’état ?",
      answers: ["Elle est toujours strictement constante", "Elle glisse entre bulle et rosée", "Elle disparaît"],
      correct: 1,
      why: "Les composants ne changent pas d’état ensemble : la température évolue pendant la zone diphasique.",
    },
    {
      q: "Quelles références utilise-t-on avec un zéotrope ?",
      answers: ["Rosée pour la surchauffe, bulle pour le sous-refroidissement", "Bulle pour les deux", "Rosée pour les deux"],
      correct: 0,
      why: "La vapeur seule se réfère à la rosée ; le liquide seul se réfère à la bulle.",
    },
  ];

  function predictionMarkup() {
    return `
      <div class="prediction-lab">
        <div class="prediction-scene" aria-label="Verre d’eau sous une cloche reliée à une pompe">
          <div class="prediction-bell"><div class="prediction-cup"></div></div>
          <div class="prediction-pump">POMPE À VIDE</div>
        </div>
        <div class="prediction-copy">
          <h3>Que va faire l’eau lorsque la pression baissera ?</h3>
          <div class="prediction-options">
            <button class="choice-button" data-prediction="warm" type="button">Elle va chauffer jusqu’à 100 °C.</button>
            <button class="choice-button" data-prediction="boil" type="button">Elle va se mettre à bouillir sans atteindre 100 °C.</button>
            <button class="choice-button" data-prediction="nothing" type="button">Rien : sans flamme, bouillir est impossible.</button>
          </div>
          <p class="feedback" id="prediction-feedback" role="status">Choisissez avant de lancer l’expérience.</p>
        </div>
      </div>`;
  }

  function vacuumMarkup() {
    return `
      <div class="vacuum-lab">
        <div class="bell-chamber" id="bell-chamber">
          <span class="chamber-pressure" id="chamber-pressure">1,013 bar abs</span>
          <span class="chamber-temp" id="chamber-temp">25,0 °C</span>
          <div class="lab-bell">
            <div class="lab-cup">
              <div class="lab-water"></div>
              <div class="lab-bubbles"><i></i><i></i><i></i><i></i><i></i></div>
            </div>
          </div>
          <div class="pump-hose"></div><div class="pump-box">POMPE</div>
        </div>
        <div class="vacuum-panel">
          <span class="graph-type sensible" id="vacuum-type">AVANT L’ÉBULLITION</span>
          <h3 id="vacuum-title">La pression baisse, l’eau reste calme</h3>
          <div class="readout-grid">
            <span>Pression absolue<b id="vacuum-pressure">1,013 bar</b></span>
            <span>Température de l’eau<b id="vacuum-temperature">25,0 °C</b></span>
          </div>
          <label for="vacuum-slider">Actionner la pompe : <b id="vacuum-label">0 % de vide pédagogique</b></label>
          <input id="vacuum-slider" type="range" min="0" max="100" value="0">
          <span>Réserve d’énergie thermique de l’eau</span>
          <div class="vacuum-energy"><i id="vacuum-energy"></i></div>
          <p class="energy-caption" id="vacuum-copy">La pression est encore trop élevée pour une eau à 25 °C.</p>
        </div>
        <div class="scientific-map vacuum-map">
          <div class="map-heading">
            <div><small>CARTE DE SATURATION DE L’EAU</small><strong>Le point de la cloche, au même instant</strong></div>
            <span class="map-legend"><i></i> état réel</span>
          </div>
          <canvas id="vacuum-pt-canvas" width="760" height="360" role="img" aria-label="Pression absolue et température de l’eau synchronisées avec la cloche à vide"></canvas>
          <div class="science-ribbon">
            <span>Pression<b id="vacuum-map-pressure">1,013 bar abs</b></span>
            <span>Température<b id="vacuum-map-temperature">25,0 °C</b></span>
            <span>État<b id="vacuum-state">liquide</b></span>
            <span class="energy-readout">Énergie<b id="vacuum-energy-direction">pas de vaporisation</b></span>
          </div>
        </div>
      </div>`;
  }

  function causeMarkup() {
    return `
      <div class="cause-lab">
        <div class="molecule-stage" id="molecule-stage" aria-label="Équilibre entre pression de vapeur et pression extérieure">
          <div class="external-pressure"><b>↓</b><b>↓</b><b>↓</b><b>↓</b></div>
          <div class="molecule-vapor"><i></i><i></i><i></i></div>
          <div class="molecule-liquid"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="cause-panel">
          <span class="graph-type sensible" id="cause-type">1 · DANS LE LIQUIDE</span>
          <h3 id="cause-title">Les molécules sont déjà en mouvement</h3>
          <p id="cause-copy">Même sans bouillir, certaines molécules quittent la surface et créent une pression de vapeur.</p>
          <button class="cause-step active" data-cause="move" type="button">1 · Le liquide pousse de l’intérieur</button>
          <button class="cause-step" data-cause="release" type="button">2 · La pompe affaiblit la pression extérieure</button>
          <button class="cause-step" data-cause="boil" type="button">3 · Les bulles peuvent se développer</button>
        </div>
        <div class="equilibrium-card">
          <div class="equation-big">
            <span>Pression de vapeur de l’eau<br><b id="vapor-pressure-value">0,032 bar abs</b></span>
            <i id="equilibrium-sign">≠</i>
            <span>Pression extérieure<br><b id="external-pressure-value">1,013 bar abs</b></span>
          </div>
          <canvas id="cause-pt-canvas" width="760" height="330" role="img" aria-label="Point d’équilibre de l’eau à 25 degrés sur la courbe de saturation"></canvas>
          <div class="science-ribbon">
            <span>Température<b>25,0 °C</b></span>
            <span>État<b id="cause-state">liquide + vapeur en surface</b></span>
            <span class="energy-readout">À l’ébullition<b>énergie → vapeur</b></span>
          </div>
        </div>
      </div>`;
  }

  function ptCurveMarkup() {
    return `
      <div class="pt-lab">
        <div class="pt-chart-card">
          <div class="map-heading">
            <div><small>LA CARTE PROFESSIONNELLE DU FRIGORISTE</small><strong>Courbe de saturation de l’eau</strong></div>
            <span class="map-legend"><i></i> point mobile</span>
          </div>
          <canvas id="pt-canvas" width="760" height="410" role="img" aria-label="Grande courbe de saturation de l’eau avec pression absolue en bar et température en degrés Celsius"></canvas>
          <div class="pt-control">
            <label for="water-pressure-slider">Choisir la pression absolue : <b id="water-pressure-label">1,013 bar</b></label>
            <input id="water-pressure-slider" type="range" min="0" max="100" value="100">
          </div>
        </div>
        <aside class="pt-panel">
          <span class="graph-type sensible">UNE PAIRE INDISSOCIABLE</span>
          <h3>Pression ↔ température de saturation</h3>
          <div class="pt-pair">
            <span>Pression absolue<b id="pt-pressure">1,013 bar</b></span>
            <span>Température de saturation<b id="pt-temperature">100,0 °C</b></span>
          </div>
          <div class="state-focus">
            <small>À CE POINT DE LA COURBE</small>
            <b>liquide + vapeur peuvent coexister</b>
            <span><i>énergie → fluide</i> : vaporisation</span>
            <span><i>fluide → extérieur</i> : condensation</span>
          </div>
          <div class="water-landmarks">
            <span>≈ 1,013 bar abs<b>≈ 100 °C</b></span>
            <span>≈ 0,474 bar abs<b>≈ 80 °C</b></span>
            <span>≈ 0,199 bar abs<b>≈ 60 °C</b></span>
            <span>≈ 0,032 bar abs<b>≈ 25 °C</b></span>
            <span>≈ 0,023 bar abs<b>≈ 20 °C</b></span>
          </div>
          <p class="simulation-note">Valeurs arrondies issues des tables de saturation de l’eau.</p>
        </aside>
      </div>`;
  }

  function reverseMarkup() {
    return `
      <div class="reverse-lab">
        <div class="mode-switch" role="group" aria-label="Sens du changement d’état">
          <button class="mode-button active" data-reverse-mode="evap" type="button">Évaporation · le fluide reçoit</button>
          <button class="mode-button" data-reverse-mode="cond" type="button">Condensation · le fluide cède</button>
        </div>
        <div class="mode-switch" role="group" aria-label="Pression absolue choisie">
          <button class="mode-button" data-reverse-pressure="1.013" type="button">1,013 bar</button>
          <button class="mode-button" data-reverse-pressure="0.474" type="button">0,474 bar</button>
          <button class="mode-button active" data-reverse-pressure="0.199" type="button">0,199 bar</button>
        </div>
        <div class="reverse-stage reverse-stage-map">
          <div class="scientific-map compact-map">
            <div class="map-heading"><div><small>EAU · FLUIDE PUR</small><strong>Même point sur la courbe</strong></div><span class="map-legend"><i></i> saturation</span></div>
            <canvas id="reverse-pt-canvas" width="640" height="350" role="img" aria-label="Point de saturation identique pour l’évaporation et la condensation de l’eau"></canvas>
          </div>
          <div class="reverse-vessel" id="reverse-vessel">
            <div class="reverse-liquid"></div>
            <div class="reverse-particles"><i></i><i></i><i></i></div>
          </div>
          <div class="reverse-arrow" id="reverse-arrow">→</div>
          <div class="reverse-copy">
            <span class="graph-type latent" id="reverse-type">VAPORISATION</span>
            <h3 id="reverse-title">À 0,199 bar : environ 60 °C</h3>
            <p id="reverse-copy">Le liquide reçoit de l’énergie et devient vapeur à sa température de saturation.</p>
            <p class="same-boundary"><strong>Même frontière :</strong> <span id="reverse-rule">la vapeur condenserait aussi vers 60 °C à cette pression.</span></p>
            <div class="science-ribbon vertical-ribbon">
              <span>État<b>liquide + vapeur</b></span>
              <span class="energy-readout">Transfert<b id="reverse-energy">extérieur → fluide</b></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  function evaporatorMarkup() {
    return `
      <div class="exchanger-lab">
        <div class="scientific-map exchanger-map">
          <div class="map-heading"><div><small>R‑134a · BASSE PRESSION</small><strong>Le point de l’évaporateur</strong></div><span class="map-legend cold"><i></i> évaporation</span></div>
          <canvas id="evap-pt-canvas" width="760" height="390" role="img" aria-label="Courbe pression température du R-134a avec point de l’évaporateur"></canvas>
          <label for="evap-slider">Régler la pression absolue : <b id="evap-pressure-label">2,0 bar abs</b></label>
          <input id="evap-slider" type="range" min="13" max="33" value="20">
        </div>
        <div class="exchanger-story cold-story">
          <span class="graph-type sensible">ÉVAPORATEUR · DEDANS</span>
          <div class="temperature-compare">
            <article><small>MILIEU À REFROIDIR</small><b>Local +4 °C</b></article>
            <div class="energy-arrow right"><span>ÉNERGIE</span>→</div>
            <article><small>FLUIDE À SATURATION</small><b id="evap-temperature">−10,0 °C</b></article>
          </div>
          <div class="science-ribbon vertical-ribbon">
            <span>Pression<b id="evap-pressure">2,0 bar abs</b></span>
            <span>Température<b id="evap-saturation">−10,0 °C</b></span>
            <span>État<b>liquide + vapeur</b></span>
            <span class="energy-readout">Transfert<b>local → fluide</b></span>
          </div>
          <p class="pressure-note" id="evap-conclusion"><strong>Effet frigorifique :</strong> le fluide reçoit l’énergie du local et se vaporise.</p>
        </div>
      </div>`;
  }

  function condenserMarkup() {
    return `
      <div class="exchanger-lab">
        <div class="scientific-map exchanger-map">
          <div class="map-heading"><div><small>R‑134a · HAUTE PRESSION</small><strong>Le point du condenseur</strong></div><span class="map-legend hot"><i></i> condensation</span></div>
          <canvas id="cond-pt-canvas" width="760" height="390" role="img" aria-label="Courbe pression température du R-134a avec point du condenseur"></canvas>
          <label for="cond-slider">Régler la pression absolue : <b id="cond-pressure-label">10,2 bar abs</b></label>
          <input id="cond-slider" type="range" min="80" max="132" value="102">
        </div>
        <div class="exchanger-story hot-story">
          <span class="graph-type latent">CONDENSEUR · DEHORS</span>
          <div class="temperature-compare reverse-energy">
            <article><small>FLUIDE À SATURATION</small><b id="cond-temperature">+40,0 °C</b></article>
            <div class="energy-arrow right"><span>ÉNERGIE</span>→</div>
            <article><small>ENVIRONNEMENT</small><b>Air +30 °C</b></article>
          </div>
          <div class="science-ribbon vertical-ribbon">
            <span>Pression<b id="cond-pressure">10,2 bar abs</b></span>
            <span>Température<b id="cond-saturation">+40,0 °C</b></span>
            <span>État<b>vapeur + liquide</b></span>
            <span class="energy-readout">Transfert<b>fluide → extérieur</b></span>
          </div>
          <p class="pressure-note" id="cond-conclusion"><strong>Liquéfaction :</strong> le fluide cède son énergie à l’air extérieur.</p>
        </div>
      </div>`;
  }

  function translatorMarkup() {
    return `
      <div class="translator-lab">
        <div class="translator-control">
          <span class="graph-type sensible">EXEMPLE R‑134a</span>
          <h3>Faites bouger le manomètre</h3>
          <label for="translator-slider">Pression lue au manomètre : <b id="translator-relative">1,0 bar relatif</b></label>
          <input id="translator-slider" type="range" min="0" max="12.1" step="0.1" value="1">
          <div class="translator-chain">
            <span>manomètre<br><b id="chain-relative">1,0 bar rel.</b></span><i>+</i>
            <span>atmosphère<br><b>≈ 1,0 bar</b></span><i>→</i>
            <strong>table<br><b id="chain-absolute">≈ 2,0 bar abs.</b></strong>
          </div>
          <p class="simulation-note">Toujours vérifier si la table utilisée demande une pression relative ou absolue.</p>
        </div>
        <div class="translator-result">
          <span class="graph-type latent">LA TABLE TRADUIT</span>
          <h3 id="translator-title">Environ 2,0 bar absolus → −10 °C</h3>
          <div class="table-window" aria-label="Extrait simplifié de table pression température R-134a">
            <span>Pression absolue</span><span>Température de saturation</span>
            <span>1,327 bar</span><span>−20 °C</span>
            <span class="selected" id="table-pressure">≈ 2,0 bar</span><span class="selected" id="table-temperature">≈ −10,0 °C</span>
            <span>10,166 bar</span><span>40 °C</span>
          </div>
          <p id="translator-copy">La température de saturation n’est pas mesurée par le manomètre : elle est déduite grâce aux propriétés du fluide présent.</p>
        </div>
        <div class="scientific-map translator-map">
          <div class="map-heading"><div><small>R‑134a · TABLE ET COURBE DISENT LA MÊME CHOSE</small><strong>La lecture devient un point scientifique</strong></div><span class="map-legend"><i></i> valeur traduite</span></div>
          <canvas id="translator-pt-canvas" width="760" height="380" role="img" aria-label="Point de saturation du R-134a obtenu à partir de la pression relative du manomètre"></canvas>
          <div class="science-ribbon">
            <span>Fluide<b>R‑134a</b></span>
            <span>Pression lue<b id="translator-ribbon-relative">1,0 bar rel.</b></span>
            <span>Pression table<b id="translator-ribbon-absolute">≈ 2,0 bar abs.</b></span>
            <span>État à saturation<b>liquide + vapeur</b></span>
          </div>
        </div>
      </div>`;
  }

  function glideMarkup() {
    return `
      <div class="glide-lab">
        <div class="glide-comparison">
          <article class="glide-card pure">
            <small>FLUIDE PUR · PRESSION CONSTANTE</small>
            <h3>Un palier horizontal</h3>
            <p>La température de bulle et la température de rosée coïncident.</p>
            <div class="phase-temperature">
              <i class="pure-line"></i><i class="phase-marker" id="pure-marker"></i>
            </div>
            <div class="phase-points"><span>première bulle</span><span>dernière goutte</span></div>
            <div class="glide-readout"><span>Pression<b>constante</b></span><span>Température<b id="pure-temperature">−10,0 °C</b></span><span>Glissement<b>0 K</b></span></div>
          </article>
          <article class="glide-card zeotrope">
            <small>ZÉOTROPE · PRESSION CONSTANTE</small>
            <h3>Une rampe de température</h3>
            <p>Les composants ne se vaporisent pas exactement au même moment.</p>
            <div class="phase-temperature">
              <i class="glide-line"></i><i class="phase-marker" id="zeotrope-marker"></i>
            </div>
            <div class="phase-points"><span>bulle : −10 °C</span><span>rosée : −3,9 °C</span></div>
            <div class="glide-readout"><span>Pression<b>constante</b></span><span>Température<b id="zeotrope-temperature">−10,0 °C</b></span><span>Glissement<b>≈ ${formatNumber(R407C_GLIDE, 1)} K</b></span></div>
          </article>
        </div>
        <div class="glide-control">
          <label for="glide-slider">Faire avancer la vaporisation : <b id="glide-label">première bulle</b></label>
          <input id="glide-slider" type="range" min="0" max="100" value="0">
          <div class="science-ribbon">
            <span>État zéotrope<b id="glide-state">première bulle</b></span>
            <span class="energy-readout">Transfert<b>extérieur → fluide</b></span>
            <span>Conséquence<b id="glide-temperature-rise">la température va monter</b></span>
          </div>
          <p class="pressure-note" id="glide-conclusion"><strong>Au départ :</strong> les deux fluides sont au point de bulle. La différence apparaîtra pendant la transformation.</p>
        </div>
      </div>`;
  }

  function directionMarkup() {
    return `
      <div class="direction-lab">
        <div class="mode-switch" role="group" aria-label="Choisir le sens du changement d’état">
          <button class="mode-button active" data-direction="evap" type="button">Évaporation →</button>
          <button class="mode-button" data-direction="cond" type="button">← Condensation</button>
        </div>
        <div class="direction-track" id="direction-track">
          ${Array.from({ length: 5 }, (_, index) => `<article id="direction-step-${index}"><small></small><strong></strong><span></span></article>`).join("")}
        </div>
        <div class="direction-control">
          <div>
            <label for="direction-slider">Parcourir la transformation : <b id="direction-label">départ liquide</b></label>
            <input id="direction-slider" type="range" min="0" max="100" value="0">
          </div>
          <p class="direction-copy" id="direction-copy"><strong>Évaporation :</strong> bulle ouvre la transformation ; rosée la ferme.</p>
        </div>
        <div class="science-ribbon direction-ribbon">
          <span>Pression<b>constante</b></span>
          <span>Température<b id="direction-temperature">−10,0 °C</b></span>
          <span>État<b id="direction-state">liquide</b></span>
          <span class="energy-readout">Transfert<b id="direction-energy">extérieur → fluide</b></span>
        </div>
      </div>`;
  }

  function measureMarkup() {
    return `
      <div class="measure-lab">
        <div class="measure-question">
          <div class="mode-switch" role="group" aria-label="Choisir la mesure">
            <button class="mode-button active" data-measure-mode="superheat" type="button">Surchauffe</button>
            <button class="mode-button" data-measure-mode="subcool" type="button">Sous-refroidissement</button>
          </div>
          <h3 id="measure-question">Quelle température de saturation faut-il utiliser ?</h3>
          <p id="measure-context">Nous mesurons une vapeur seule après la disparition de la dernière goutte.</p>
          <div class="measure-options">
            <button class="choice-button" data-measure-answer="dew" type="button">Température de rosée</button>
            <button class="choice-button" data-measure-answer="bubble" type="button">Température de bulle</button>
          </div>
          <p class="feedback" id="measure-feedback" role="status">Choisissez la frontière correspondant à l’état mesuré.</p>
        </div>
        <div class="measure-diagram">
          <span class="graph-type sensible" id="measure-type">VAPEUR SEULE</span>
          <h3 id="measure-title">Surchauffe = température réelle − rosée</h3>
          <div class="measure-equation">
            <span>Température du tube<br><b>réelle</b></span><i>−</i>
            <span>Température de saturation<br><b id="measure-reference">rosée</b></span><i>=</i>
            <strong id="measure-result-name">surchauffe</strong>
          </div>
          <p class="same-boundary" id="measure-rule"><strong>Pourquoi ?</strong> La rosée est la frontière de la vapeur saturée, juste avant la vapeur surchauffée.</p>
        </div>
      </div>`;
  }

  function missionMarkup() {
    return `
      <div class="mission-lab">
        <div class="scientific-map mission-map">
          <div class="map-heading"><div><small>R‑134a · DEUX PRESSIONS, DEUX TEMPÉRATURES</small><strong>Placez les deux points du circuit</strong></div><span class="dual-legend"><i class="low"></i> évaporateur <i class="high"></i> condenseur</span></div>
          <canvas id="mission-pt-canvas" width="760" height="390" role="img" aria-label="Courbe du R-134a avec points basse pression et haute pression de la mission"></canvas>
        </div>
        <article class="mission-card" id="low-mission">
          <span class="graph-type sensible">ÉVAPORATEUR · LOCAL À +4 °C</span>
          <h3>Créer une saturation suffisamment froide</h3>
          <p>Objectif pédagogique : température de saturation ≤ −1 °C.</p>
          <div class="mission-readout">
            <span>Pression absolue<b id="low-pressure-value">3,0 bar</b></span>
            <span>Saturation R‑134a<b id="low-temperature-value">0,6 °C</b></span>
          </div>
          <div class="mission-control">
            <label for="low-pressure-slider">Régler la basse pression</label>
            <input id="low-pressure-slider" type="range" min="13" max="41" value="30">
          </div>
          <p class="flow-rule">Énergie : <b>local → fluide</b></p>
        </article>
        <article class="mission-card" id="high-mission">
          <span class="graph-type latent">CONDENSEUR · EXTÉRIEUR À +30 °C</span>
          <h3>Créer une saturation suffisamment chaude</h3>
          <p>Objectif pédagogique : température de saturation ≥ +35 °C.</p>
          <div class="mission-readout">
            <span>Pression absolue<b id="high-pressure-value">8,5 bar</b></span>
            <span>Saturation R‑134a<b id="high-temperature-value">33,2 °C</b></span>
          </div>
          <div class="mission-control">
            <label for="high-pressure-slider">Régler la haute pression</label>
            <input id="high-pressure-slider" type="range" min="77" max="132" value="85">
          </div>
          <p class="flow-rule">Énergie : <b>fluide → extérieur</b></p>
        </article>
        <p class="mission-result" id="mission-result"><strong>Mission en cours :</strong> créez un écart suffisant des deux côtés pour permettre les transferts d’énergie.</p>
      </div>`;
  }

  function quizMarkup() {
    if (quizIndex >= questions.length) {
      const success = score >= 8;
      return `
        <div class="quiz-result">
          <h3>${success ? "Vous savez donner une température à une pression." : "La relation mérite encore un passage."}</h3>
          <b>${score}/${questions.length}</b>
          <span class="result-rule">${success ? "Bases acquises" : "Objectif : au moins 8 réponses justes sur 10"}</span>
          <p>${success
            ? "Vous savez expliquer l’ébullition sous vide, placer les saturations du circuit et distinguer bulle, rosée et glissement."
            : "Reprenez la cloche à vide, les deux côtés du circuit et le sens bulle–rosée, puis rejouez le défi."}</p>
          <button class="nav" id="quiz-restart" type="button">Refaire le défi</button>
        </div>`;
    }

    const question = questions[quizIndex];
    return `
      <div class="quiz-wrap">
        <div class="quiz-head"><strong>Question ${quizIndex + 1} sur ${questions.length}</strong><span>Score : ${score}</span></div>
        <div class="quiz-progress" aria-label="Progression : question ${quizIndex + 1} sur ${questions.length}">
          ${questions.map((_, index) => `<i class="${index < quizIndex ? "done" : index === quizIndex ? "current" : ""}"></i>`).join("")}
        </div>
        <p class="quiz-question">${question.q}</p>
        <div class="quiz-options">
          ${question.answers.map((answer, index) => `<button class="quiz-option" data-answer="${index}" type="button">${answer}</button>`).join("")}
        </div>
        <p class="quiz-feedback" id="quiz-feedback" role="status">Choisissez une réponse.</p>
      </div>`;
  }

  function formatNumber(value, digits = 1) {
    return Number(value).toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  function interpolateByPressure(table, pressure) {
    if (pressure <= table[0].p) return table[0].t;
    if (pressure >= table[table.length - 1].p) return table[table.length - 1].t;
    for (let index = 0; index < table.length - 1; index += 1) {
      const a = table[index];
      const b = table[index + 1];
      if (pressure >= a.p && pressure <= b.p) {
        const ratio = (pressure - a.p) / (b.p - a.p);
        return a.t + ratio * (b.t - a.t);
      }
    }
    return table[0].t;
  }

  function waterSaturation(pressure) {
    if (pressure <= WATER[0].p) return WATER[0].t;
    if (pressure >= WATER[WATER.length - 1].p) return WATER[WATER.length - 1].t;
    for (let index = 0; index < WATER.length - 1; index += 1) {
      const a = WATER[index];
      const b = WATER[index + 1];
      if (pressure >= a.p && pressure <= b.p) {
        const ratio = (Math.log(pressure) - Math.log(a.p)) / (Math.log(b.p) - Math.log(a.p));
        return a.t + ratio * (b.t - a.t);
      }
    }
    return 25;
  }

  function pressureFromPercent(percent) {
    const min = Math.log(0.0234);
    const max = Math.log(1.013);
    return Math.exp(min + (max - min) * (percent / 100));
  }

  function vacuumPressure(level) {
    if (level <= 89) {
      return Math.exp(Math.log(1.013) + (Math.log(0.0317) - Math.log(1.013)) * (level / 89));
    }
    return Math.exp(Math.log(0.0317) + (Math.log(0.02) - Math.log(0.0317)) * ((level - 89) / 11));
  }

  function buildStepper() {
    $("#stepper").innerHTML = lessons
      .map((lesson, index) => `<button type="button" data-step="${index}"><b>${String(index + 1).padStart(2, "0")}</b><span>${lesson.short}</span></button>`)
      .join("");
    document.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        enterCourseMode();
        goTo(Number(button.dataset.step), false);
      });
    });
  }

  function updateStepper() {
    document.querySelectorAll("[data-step]").forEach((button, index) => {
      button.classList.toggle("active", index === current);
      button.classList.toggle("done", index < furthest);
    });
  }

  function render() {
    const lesson = lessons[current];
    $("#kicker").textContent = lesson.kicker;
    $("#title").textContent = lesson.title;
    $("#lesson-text").textContent = lesson.text;
    $("#zone").className = `interactive-zone pressure-zone${lesson.zoneClass ? ` ${lesson.zoneClass}` : ""}`;
    $("#zone").innerHTML = lesson.render();
    $("#status").textContent = `Étape ${current + 1} sur ${lessons.length}${autoplay ? " · parcours raconté" : ""}`;
    $("#prev").disabled = current === 0;
    updateCourseNavigation();
    updateStepper();
    wireCurrentActivity();
    updateListenButton();
  }

  function updateCourseNavigation() {
    const onQuiz = current === lessons.length - 1;
    const quizComplete = quizIndex >= questions.length;
    $("#next").disabled = onQuiz && !quizComplete;
    $("#next").textContent = onQuiz ? (quizComplete ? "Voir le bilan ↓" : "Terminez le défi") : "Continuer →";
  }

  function wireCurrentActivity() {
    document.querySelectorAll("[data-prediction]").forEach((button) => button.addEventListener("click", () => updatePrediction(button)));
    if ($("#vacuum-slider")) {
      $("#vacuum-slider").addEventListener("input", updateVacuum);
      updateVacuum();
    }
    document.querySelectorAll("[data-cause]").forEach((button) => button.addEventListener("click", () => updateCause(button.dataset.cause)));
    if ($("#cause-pt-canvas")) updateCause("move");
    if ($("#water-pressure-slider")) {
      $("#water-pressure-slider").addEventListener("input", updatePTCurve);
      updatePTCurve();
    }
    document.querySelectorAll("[data-reverse-mode]").forEach((button) => button.addEventListener("click", () => {
      reverseMode = button.dataset.reverseMode;
      updateReverse();
    }));
    document.querySelectorAll("[data-reverse-pressure]").forEach((button) => button.addEventListener("click", () => {
      reversePressure = Number(button.dataset.reversePressure);
      updateReverse();
    }));
    if ($("#reverse-vessel")) updateReverse();
    if ($("#evap-slider")) {
      $("#evap-slider").addEventListener("input", updateEvaporator);
      updateEvaporator();
    }
    if ($("#cond-slider")) {
      $("#cond-slider").addEventListener("input", updateCondenser);
      updateCondenser();
    }
    if ($("#translator-slider")) {
      $("#translator-slider").addEventListener("input", updateTranslator);
      updateTranslator();
    }
    if ($("#glide-slider")) {
      $("#glide-slider").addEventListener("input", updateGlide);
      updateGlide();
    }
    document.querySelectorAll("[data-direction]").forEach((button) => button.addEventListener("click", () => {
      directionMode = button.dataset.direction;
      $("#direction-slider").value = "0";
      updateDirection();
    }));
    if ($("#direction-slider")) {
      $("#direction-slider").addEventListener("input", updateDirection);
      updateDirection();
    }
    document.querySelectorAll("[data-measure-mode]").forEach((button) => button.addEventListener("click", () => updateMeasureMode(button.dataset.measureMode)));
    document.querySelectorAll("[data-measure-answer]").forEach((button) => button.addEventListener("click", () => answerMeasure(button)));
    if ($("#measure-question")) updateMeasureMode(measureMode);
    if ($("#low-pressure-slider")) {
      $("#low-pressure-slider").addEventListener("input", updateMission);
      $("#high-pressure-slider").addEventListener("input", updateMission);
      updateMission();
    }
    document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer))));
    if ($("#quiz-restart")) {
      $("#quiz-restart").addEventListener("click", () => {
        quizIndex = 0;
        score = 0;
        answered = false;
        $("#zone").innerHTML = quizMarkup();
        wireCurrentActivity();
        updateCourseNavigation();
      });
    }
  }

  function updatePrediction(button) {
    const correct = button.dataset.prediction === "boil";
    document.querySelectorAll("[data-prediction]").forEach((item) => {
      item.disabled = true;
      if (item.dataset.prediction === "boil") item.classList.add("good");
      else if (item === button) item.classList.add("bad");
    });
    $("#prediction-feedback").textContent = correct
      ? "✓ Bonne prévision : l’eau peut bouillir bien avant 100 °C si la pression devient assez basse."
      : "La surprise est justement là : 100 °C n’est vrai qu’autour de la pression atmosphérique. Baissez la pression à l’étape suivante.";
  }

  function updateVacuum() {
    const level = Number($("#vacuum-slider").value);
    const pressure = vacuumPressure(level);
    const boiling = pressure <= 0.03171;
    const temperature = boiling ? waterSaturation(pressure) : 25;
    const energy = boiling ? Math.max(48, 100 - (25 - temperature) * 7) : 100;
    $("#bell-chamber").classList.toggle("boiling", boiling);
    $("#chamber-pressure").textContent = `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar abs`;
    $("#chamber-temp").textContent = `${formatNumber(temperature, 1)} °C`;
    $("#vacuum-pressure").textContent = `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar`;
    $("#vacuum-temperature").textContent = `${formatNumber(temperature, 1)} °C`;
    $("#vacuum-map-pressure").textContent = `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar abs`;
    $("#vacuum-map-temperature").textContent = `${formatNumber(temperature, 1)} °C`;
    $("#vacuum-state").textContent = boiling ? "liquide + vapeur" : "liquide";
    $("#vacuum-energy-direction").textContent = boiling ? "eau + milieu → vapeur" : "pas de vaporisation";
    $("#vacuum-label").textContent = `${Math.round(level)} % de vide pédagogique`;
    $("#vacuum-energy").style.width = `${energy}%`;
    $("#vacuum-type").className = `graph-type ${boiling ? "latent" : "sensible"}`;
    $("#vacuum-type").textContent = boiling ? "ÉBULLITION SOUS VIDE" : "AVANT L’ÉBULLITION";
    $("#vacuum-title").textContent = boiling ? "L’eau bout… et se refroidit" : "La pression baisse, l’eau reste calme";
    $("#vacuum-copy").innerHTML = boiling
      ? "<strong>L’énergie n’a pas disparu :</strong> la vaporisation la prélève dans l’eau, dont la température baisse."
      : "La pression est encore trop élevée pour une eau à 25 °C.";
    drawSaturationCurve("#vacuum-pt-canvas", WATER, [{
      pressure,
      temperature,
      label: boiling ? "sur la courbe : ébullition" : "eau liquide : hors saturation",
    }], {
      logarithmic: true,
      pMin: 0.0123,
      pMax: 1.013,
      tMin: 10,
      tMax: 100,
      pressureTicks: [0.0123, 0.0317, 0.1, 0.199, 0.474, 1.013],
      temperatureTicks: [20, 40, 60, 80, 100],
    });
  }

  function updateCause(mode) {
    const content = {
      move: {
        type: "1 · DANS LE LIQUIDE",
        title: "Les molécules sont déjà en mouvement",
        copy: "Même sans bouillir, certaines molécules quittent la surface et créent une pression de vapeur.",
        className: "",
        pressure: 1.013,
        sign: "≠",
        state: "liquide + vapeur en surface",
      },
      release: {
        type: "2 · AU-DESSUS DU LIQUIDE",
        title: "La pompe retire une partie de l’opposition",
        copy: "En diminuant la pression extérieure, elle facilite le développement des bulles dans le liquide.",
        className: "release",
        pressure: 0.199,
        sign: "≠",
        state: "liquide, proche de l’ébullition",
      },
      boil: {
        type: "3 · À L’ÉQUILIBRE",
        title: "La pression de vapeur atteint la pression extérieure",
        copy: "Les bulles ne sont plus écrasées : elles grandissent dans tout le volume. L’ébullition commence.",
        className: "release boil",
        pressure: 0.0317,
        sign: "=",
        state: "liquide + vapeur",
      },
    };
    document.querySelectorAll("[data-cause]").forEach((button) => button.classList.toggle("active", button.dataset.cause === mode));
    $("#molecule-stage").className = `molecule-stage ${content[mode].className}`.trim();
    $("#cause-type").textContent = content[mode].type;
    $("#cause-title").textContent = content[mode].title;
    $("#cause-copy").textContent = content[mode].copy;
    $("#external-pressure-value").textContent = `${formatNumber(content[mode].pressure, content[mode].pressure < 0.1 ? 3 : 2)} bar abs`;
    $("#equilibrium-sign").textContent = content[mode].sign;
    $("#cause-state").textContent = content[mode].state;
    drawSaturationCurve("#cause-pt-canvas", WATER, [{
      pressure: content[mode].pressure,
      temperature: 25,
      label: mode === "boil" ? "équilibre : ébullition" : "état réel à 25 °C",
    }], {
      logarithmic: true,
      pMin: 0.0123,
      pMax: 1.013,
      tMin: 10,
      tMax: 100,
      pressureTicks: [0.0123, 0.0317, 0.1, 0.199, 0.474, 1.013],
      temperatureTicks: [20, 40, 60, 80, 100],
    });
  }

  function drawSaturationCurve(canvasSelector, table, markers, options = {}) {
    const canvas = $(canvasSelector);
    if (!canvas) return;
    const compact = document.body.classList.contains("course-running") && window.innerWidth <= 650;
    if (compact) {
      canvas.width = 420;
      canvas.height = 245;
    }
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const left = compact ? 52 : 82;
    const right = width - (compact ? 12 : 28);
    const top = compact ? 20 : 34;
    const bottom = height - (compact ? 45 : 70);
    const logarithmic = Boolean(options.logarithmic);
    const pMinValue = options.pMin ?? table[0].p;
    const pMaxValue = options.pMax ?? table[table.length - 1].p;
    const tMin = options.tMin ?? table[0].t;
    const tMax = options.tMax ?? table[table.length - 1].t;
    const transformPressure = (value) => logarithmic ? Math.log(value) : value;
    const pMin = transformPressure(pMinValue);
    const pMax = transformPressure(pMaxValue);
    const xFor = (pressure) => left + ((transformPressure(pressure) - pMin) / (pMax - pMin)) * (right - left);
    const yFor = (temperature) => bottom - ((temperature - tMin) / (tMax - tMin)) * (bottom - top);
    const allPressureTicks = options.pressureTicks || table.map((point) => point.p);
    const allTemperatureTicks = options.temperatureTicks || table.map((point) => point.t);
    const pressureTicks = compact
      ? allPressureTicks.filter((_, index) => index % 2 === 0 || index === allPressureTicks.length - 1)
      : allPressureTicks;
    const temperatureTicks = compact
      ? allTemperatureTicks.filter((_, index) => index % 2 === 0 || index === allTemperatureTicks.length - 1)
      : allTemperatureTicks;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#dfe6ec";
    context.lineWidth = 1;
    context.font = `${compact ? 9 : 12}px Segoe UI, sans-serif`;
    context.fillStyle = "#637285";
    temperatureTicks.forEach((value) => {
      const y = yFor(value);
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(right, y);
      context.stroke();
      context.textAlign = "right";
      context.fillText(`${formatNumber(value, 0)}°`, left - (compact ? 6 : 12), y + 4);
    });
    pressureTicks.forEach((value) => {
      if (value < pMinValue || value > pMaxValue) return;
      const x = xFor(value);
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, bottom);
      context.stroke();
      context.textAlign = "center";
      const digits = value < 0.1 ? 3 : value < 1 ? 2 : 1;
      context.fillText(formatNumber(value, digits), x, bottom + (compact ? 14 : 22));
    });
    context.strokeStyle = "#10233c";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(left, bottom);
    context.lineTo(right, bottom);
    context.stroke();

    context.fillStyle = "#10233c";
    context.font = `700 ${compact ? 9 : 12}px Segoe UI, sans-serif`;
    context.textAlign = "center";
    context.fillText(compact
      ? `Pression abs. (bar)${logarithmic ? " · log" : ""}`
      : `Pression absolue (bar)${logarithmic ? " · échelle logarithmique" : ""}`,
    (left + right) / 2, height - (compact ? 5 : 18));
    context.save();
    context.translate(compact ? 10 : 20, (top + bottom) / 2);
    context.rotate(-Math.PI / 2);
    context.fillText(compact ? "Saturation (°C)" : "Température de saturation (°C)", 0, 0);
    context.restore();

    context.strokeStyle = "#5d65c9";
    context.lineWidth = compact ? 4 : 6;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    table.forEach((point, index) => {
      const x = xFor(point.p);
      const y = yFor(point.t);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();

    table.forEach((point) => {
      const x = xFor(point.p);
      const y = yFor(point.t);
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(x, y, compact ? 2.5 : 3.5, 0, Math.PI * 2);
      context.fill();
    });

    markers.forEach((marker, index) => {
      const markerX = xFor(marker.pressure);
      const markerY = yFor(marker.temperature);
      const color = marker.color || (index === 0 ? "#ff6b35" : "#3d7fca");
      context.fillStyle = color;
      context.beginPath();
      context.arc(markerX, markerY, marker.radius || (compact ? 7 : 10), 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#fff";
      context.lineWidth = 4;
      context.stroke();
      if (marker.label) {
        const markerLabel = compact && marker.label.length > 28 ? `${marker.label.slice(0, 26)}…` : marker.label;
        context.font = `800 ${compact ? 9 : 12}px Segoe UI, sans-serif`;
        const labelWidth = context.measureText(markerLabel).width + (compact ? 10 : 18);
        const labelX = Math.min(right - labelWidth, Math.max(left, markerX + (compact ? 8 : 13)));
        const labelY = Math.max(top + 2, markerY - (compact ? 25 : 34));
        context.fillStyle = color;
        context.beginPath();
        const labelHeight = compact ? 19 : 25;
        if (context.roundRect) context.roundRect(labelX, labelY, labelWidth, labelHeight, compact ? 6 : 8);
        else context.rect(labelX, labelY, labelWidth, labelHeight);
        context.fill();
        context.fillStyle = "#fff";
        context.textAlign = "center";
        context.fillText(markerLabel, labelX + labelWidth / 2, labelY + (compact ? 13 : 17));
      }
    });
  }

  function updatePTCurve() {
    const percent = Number($("#water-pressure-slider").value);
    const pressure = pressureFromPercent(percent);
    const temperature = waterSaturation(pressure);
    $("#water-pressure-label").textContent = `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar`;
    $("#pt-pressure").textContent = `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar`;
    $("#pt-temperature").textContent = `${formatNumber(temperature, 1)} °C`;
    drawSaturationCurve("#pt-canvas", WATER, [{ pressure, temperature, label: `${formatNumber(pressure, pressure < 0.1 ? 3 : 2)} bar · ${formatNumber(temperature, 0)} °C` }], {
      logarithmic: true,
      pMin: 0.0123,
      pMax: 1.013,
      tMin: 10,
      tMax: 100,
      pressureTicks: [0.0123, 0.0234, 0.0317, 0.1, 0.199, 0.474, 1.013],
      temperatureTicks: [20, 40, 60, 80, 100],
    });
  }

  function updateReverse() {
    document.querySelectorAll("[data-reverse-mode]").forEach((button) => button.classList.toggle("active", button.dataset.reverseMode === reverseMode));
    document.querySelectorAll("[data-reverse-pressure]").forEach((button) => button.classList.toggle("active", Number(button.dataset.reversePressure) === reversePressure));
    const temperature = waterSaturation(reversePressure);
    const condensing = reverseMode === "cond";
    $("#reverse-vessel").classList.toggle("condense", condensing);
    $("#reverse-arrow").textContent = condensing ? "←" : "→";
    $("#reverse-type").textContent = condensing ? "LIQUÉFACTION" : "VAPORISATION";
    $("#reverse-title").textContent = `À ${formatNumber(reversePressure, reversePressure < 1 ? 3 : 3)} bar : environ ${formatNumber(temperature, 0)} °C`;
    $("#reverse-copy").textContent = condensing
      ? "La vapeur cède de l’énergie et devient liquide à cette température de saturation."
      : "Le liquide reçoit de l’énergie et devient vapeur à cette température de saturation.";
    $("#reverse-rule").textContent = condensing
      ? `le liquide bouillirait aussi vers ${formatNumber(temperature, 0)} °C à cette pression.`
      : `la vapeur condenserait aussi vers ${formatNumber(temperature, 0)} °C à cette pression.`;
    $("#reverse-energy").textContent = condensing ? "fluide → extérieur" : "extérieur → fluide";
    drawSaturationCurve("#reverse-pt-canvas", WATER, [{
      pressure: reversePressure,
      temperature,
      label: `${formatNumber(reversePressure, reversePressure < 1 ? 3 : 2)} bar · ${formatNumber(temperature, 0)} °C`,
    }], {
      logarithmic: true,
      pMin: 0.0123,
      pMax: 1.013,
      tMin: 10,
      tMax: 100,
      pressureTicks: [0.0123, 0.0317, 0.1, 0.199, 0.474, 1.013],
      temperatureTicks: [20, 40, 60, 80, 100],
    });
  }

  function r134aCurveOptions() {
    return {
      pMin: 1.3,
      pMax: 13.2,
      tMin: -20,
      tMax: 50,
      pressureTicks: [1.3, 2, 4, 6, 8, 10, 13.2],
      temperatureTicks: [-20, -10, 0, 10, 20, 30, 40, 50],
    };
  }

  function updateEvaporator() {
    const pressure = Number($("#evap-slider").value) / 10;
    const temperature = interpolateByPressure(R134A, pressure);
    const delta = 4 - temperature;
    $("#evap-pressure-label").textContent = `${formatNumber(pressure, 1)} bar abs`;
    $("#evap-pressure").textContent = `${formatNumber(pressure, 1)} bar abs`;
    $("#evap-temperature").textContent = `${temperature >= 0 ? "+" : "−"}${formatNumber(Math.abs(temperature), 1)} °C`;
    $("#evap-saturation").textContent = `${temperature >= 0 ? "+" : "−"}${formatNumber(Math.abs(temperature), 1)} °C`;
    $("#evap-conclusion").innerHTML = delta >= 5
      ? `<strong>✓ Effet frigorifique :</strong> le local est plus chaud de ${formatNumber(delta, 1)} K ; son énergie va vers le fluide, qui se vaporise.`
      : `<strong>Transfert possible mais faible :</strong> seulement ${formatNumber(delta, 1)} K d’écart. Baissez la pression pour éloigner la saturation du local.`;
    drawSaturationCurve("#evap-pt-canvas", R134A, [{
      pressure,
      temperature,
      label: `BP · ${formatNumber(pressure, 1)} bar · ${formatNumber(temperature, 0)} °C`,
      color: "#3d7fca",
    }], r134aCurveOptions());
  }

  function updateCondenser() {
    const pressure = Number($("#cond-slider").value) / 10;
    const temperature = interpolateByPressure(R134A, pressure);
    const delta = temperature - 30;
    $("#cond-pressure-label").textContent = `${formatNumber(pressure, 1)} bar abs`;
    $("#cond-pressure").textContent = `${formatNumber(pressure, 1)} bar abs`;
    $("#cond-temperature").textContent = `+${formatNumber(temperature, 1)} °C`;
    $("#cond-saturation").textContent = `+${formatNumber(temperature, 1)} °C`;
    $("#cond-conclusion").innerHTML = delta >= 5
      ? `<strong>✓ Liquéfaction :</strong> le fluide est plus chaud de ${formatNumber(delta, 1)} K ; son énergie va vers l’air extérieur.`
      : `<strong>Transfert possible mais faible :</strong> seulement ${formatNumber(delta, 1)} K d’écart. Augmentez la pression pour élever la saturation.`;
    drawSaturationCurve("#cond-pt-canvas", R134A, [{
      pressure,
      temperature,
      label: `HP · ${formatNumber(pressure, 1)} bar · ${formatNumber(temperature, 0)} °C`,
      color: "#ff6b35",
    }], r134aCurveOptions());
  }

  function updateTranslator() {
    const relative = Number($("#translator-slider").value);
    const absolute = relative + 1.013;
    const temperature = interpolateByPressure(R134A, absolute);
    $("#translator-relative").textContent = `${formatNumber(relative, 1)} bar relatif`;
    $("#chain-relative").textContent = `${formatNumber(relative, 1)} bar rel.`;
    $("#chain-absolute").textContent = `≈ ${formatNumber(absolute, 1)} bar abs.`;
    $("#translator-ribbon-relative").textContent = `${formatNumber(relative, 1)} bar rel.`;
    $("#translator-ribbon-absolute").textContent = `≈ ${formatNumber(absolute, 1)} bar abs.`;
    $("#translator-title").textContent = `Environ ${formatNumber(absolute, 1)} bar absolus → ${formatNumber(temperature, 1)} °C`;
    $("#table-pressure").textContent = `≈ ${formatNumber(absolute, 1)} bar`;
    $("#table-temperature").textContent = `≈ ${formatNumber(temperature, 1)} °C`;
    drawSaturationCurve("#translator-pt-canvas", R134A, [{
      pressure: absolute,
      temperature,
      label: `${formatNumber(relative, 1)} bar rel. → ${formatNumber(temperature, 0)} °C`,
    }], r134aCurveOptions());
  }

  function updateGlide() {
    const progress = Number($("#glide-slider").value);
    const ratio = progress / 100;
    const pureTemperature = -10;
    const zeotropeTemperature = -10 + R407C_GLIDE * ratio;
    const left = 10 + 82 * ratio;
    $("#pure-marker").style.left = `${left}%`;
    $("#pure-marker").style.bottom = "calc(48% - 6px)";
    $("#zeotrope-marker").style.left = `${left}%`;
    $("#zeotrope-marker").style.bottom = `calc(${28 + 22 * ratio}% - 6px)`;
    $("#pure-temperature").textContent = `${formatNumber(pureTemperature, 1)} °C`;
    $("#zeotrope-temperature").textContent = `${formatNumber(zeotropeTemperature, 1)} °C`;
    $("#glide-label").textContent = progress < 15 ? "première bulle" : progress > 85 ? "dernière goutte" : `${Math.round(progress)} % vaporisé`;
    $("#glide-state").textContent = progress < 5 ? "première bulle" : progress > 95 ? "dernière goutte disparaît" : "liquide + vapeur";
    $("#glide-temperature-rise").textContent = progress > 95 ? "rosée atteinte" : "température croissante";
    $("#glide-conclusion").innerHTML =
      progress < 15
        ? "<strong>Au départ :</strong> les deux fluides sont au point de bulle. La différence apparaîtra pendant la transformation."
        : progress > 85
          ? `<strong>À l’arrivée :</strong> le pur est resté à −10 °C ; le zéotrope atteint sa rosée vers ${formatNumber(-10 + R407C_GLIDE, 1)} °C.`
          : `<strong>Pendant la transformation :</strong> pression constante pour les deux, mais le zéotrope a déjà glissé jusqu’à ${formatNumber(zeotropeTemperature, 1)} °C.`;
  }

  function updateDirection() {
    const progress = Number($("#direction-slider").value);
    const index = Math.min(4, Math.floor((progress + 12.5) / 25));
    const evaporation = directionMode === "evap";
    const steps = evaporation
      ? [
          ["DÉPART", "Liquide", "sous-refroidi"],
          ["BULLE", "Première bulle", "−10 °C · début"],
          ["DIPHASIQUE", "Liquide + vapeur", "température qui monte"],
          ["ROSÉE", "Dernière goutte", "−3,9 °C · fin"],
          ["ARRIVÉE", "Vapeur", "surchauffable"],
        ]
      : [
          ["DÉPART", "Vapeur", "désurchauffée"],
          ["ROSÉE", "Première goutte", "−3,9 °C · début"],
          ["DIPHASIQUE", "Vapeur + liquide", "température qui descend"],
          ["BULLE", "Dernière bulle", "−10 °C · fin"],
          ["ARRIVÉE", "Liquide", "sous-refroidissable"],
        ];
    document.querySelectorAll("[data-direction]").forEach((button) => button.classList.toggle("active", button.dataset.direction === directionMode));
    $("#direction-track").classList.toggle("reverse", !evaporation);
    steps.forEach((step, stepIndex) => {
      const card = $(`#direction-step-${stepIndex}`);
      card.querySelector("small").textContent = step[0];
      card.querySelector("strong").textContent = step[1];
      card.querySelector("span").textContent = step[2];
      card.classList.toggle("active", stepIndex === index);
    });
    $("#direction-label").textContent = steps[index][1].toLowerCase();
    const ratio = progress / 100;
    const temperature = evaporation ? -10 + R407C_GLIDE * ratio : -10 + R407C_GLIDE * (1 - ratio);
    $("#direction-temperature").textContent = `${formatNumber(temperature, 1)} °C`;
    $("#direction-state").textContent = steps[index][1].toLowerCase();
    $("#direction-energy").textContent = evaporation ? "extérieur → fluide" : "fluide → extérieur";
    $("#direction-copy").innerHTML = evaporation
      ? "<strong>Évaporation :</strong> bulle ouvre, la température monte, rosée ferme."
      : "<strong>Condensation :</strong> rosée ouvre, la température descend, bulle ferme.";
  }

  function updateMeasureMode(mode) {
    measureMode = mode;
    const superheat = mode === "superheat";
    document.querySelectorAll("[data-measure-mode]").forEach((button) => button.classList.toggle("active", button.dataset.measureMode === mode));
    document.querySelectorAll("[data-measure-answer]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("good", "bad");
    });
    $("#measure-context").textContent = superheat
      ? "Nous mesurons une vapeur seule après la disparition de la dernière goutte."
      : "Nous mesurons un liquide seul après la disparition de la dernière bulle.";
    $("#measure-type").textContent = superheat ? "VAPEUR SEULE" : "LIQUIDE SEUL";
    $("#measure-title").textContent = superheat
      ? "Surchauffe = température réelle − rosée"
      : "Sous-refroidissement = bulle − température réelle";
    $("#measure-reference").textContent = superheat ? "rosée" : "bulle";
    $("#measure-result-name").textContent = superheat ? "surchauffe" : "sous-refroidissement";
    $("#measure-rule").innerHTML = superheat
      ? "<strong>Pourquoi ?</strong> La rosée est la frontière de la vapeur saturée, juste avant la vapeur surchauffée."
      : "<strong>Pourquoi ?</strong> La bulle est la frontière du liquide saturé, juste avant le liquide sous-refroidi.";
    $("#measure-feedback").textContent = "Choisissez la frontière correspondant à l’état mesuré.";
  }

  function answerMeasure(button) {
    const correctAnswer = measureMode === "superheat" ? "dew" : "bubble";
    const correct = button.dataset.measureAnswer === correctAnswer;
    document.querySelectorAll("[data-measure-answer]").forEach((item) => {
      item.disabled = true;
      if (item.dataset.measureAnswer === correctAnswer) item.classList.add("good");
      else if (item === button) item.classList.add("bad");
    });
    $("#measure-feedback").textContent = correct
      ? measureMode === "superheat"
        ? "✓ Exact : vapeur seule, donc référence rosée."
        : "✓ Exact : liquide seul, donc référence bulle."
      : measureMode === "superheat"
        ? "La surchauffe concerne la vapeur : sa frontière est la rosée."
        : "Le sous-refroidissement concerne le liquide : sa frontière est la bulle.";
  }

  function updateMission() {
    const lowPressure = Number($("#low-pressure-slider").value) / 10;
    const highPressure = Number($("#high-pressure-slider").value) / 10;
    const lowTemperature = interpolateByPressure(R134A, lowPressure);
    const highTemperature = interpolateByPressure(R134A, highPressure);
    const lowOk = lowTemperature <= -1;
    const highOk = highTemperature >= 35;
    $("#low-pressure-value").textContent = `${formatNumber(lowPressure, 1)} bar`;
    $("#low-temperature-value").textContent = `${formatNumber(lowTemperature, 1)} °C`;
    $("#high-pressure-value").textContent = `${formatNumber(highPressure, 1)} bar`;
    $("#high-temperature-value").textContent = `${formatNumber(highTemperature, 1)} °C`;
    $("#low-mission").classList.toggle("ok", lowOk);
    $("#high-mission").classList.toggle("ok", highOk);
    drawSaturationCurve("#mission-pt-canvas", R134A, [
      {
        pressure: lowPressure,
        temperature: lowTemperature,
        label: `BP · ${formatNumber(lowTemperature, 0)} °C`,
        color: "#3d7fca",
      },
      {
        pressure: highPressure,
        temperature: highTemperature,
        label: `HP · ${formatNumber(highTemperature, 0)} °C`,
        color: "#ff6b35",
      },
    ], r134aCurveOptions());
    if (lowOk && highOk) {
      $("#mission-result").innerHTML = "<strong>✓ Mission réussie :</strong> la basse pression place l’évaporation assez froid pour absorber dedans, et la haute pression place la condensation assez chaud pour restituer dehors.";
    } else if (!lowOk && !highOk) {
      $("#mission-result").innerHTML = "<strong>Deux actions :</strong> baissez encore la basse pression et augmentez la haute pression.";
    } else if (!lowOk) {
      $("#mission-result").innerHTML = "<strong>Côté froid à corriger :</strong> baissez la pression d’évaporation pour abaisser la température de saturation.";
    } else {
      $("#mission-result").innerHTML = "<strong>Côté chaud à corriger :</strong> augmentez la pression de condensation pour élever la température de saturation.";
    }
  }

  function answerQuestion(choice) {
    if (answered) return;
    answered = true;
    const question = questions[quizIndex];
    const correct = choice === question.correct;
    document.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      else if (index === choice) button.classList.add("bad");
    });
    if (correct) score += 1;
    $("#quiz-feedback").innerHTML = `${correct ? "✓" : "✗"} ${question.why} <button class="nav" id="quiz-next" type="button">${quizIndex === questions.length - 1 ? "Voir le résultat" : "Question suivante"}</button>`;
    $("#quiz-next").addEventListener("click", () => {
      quizIndex += 1;
      answered = false;
      $("#zone").innerHTML = quizMarkup();
      wireCurrentActivity();
      updateCourseNavigation();
    });
  }

  function voiceKey(voice) {
    return `${voice.voiceURI || ""}|${voice.name}|${voice.lang}`;
  }

  function voiceQuality(voice) {
    const label = `${voice.name} ${voice.voiceURI || ""}`.toLowerCase();
    const lang = String(voice.lang || "").replace("_", "-").toLowerCase();
    const isFrench = lang.startsWith("fr");
    const isFrance = lang === "fr-fr" || /french\s*\(france\)|français\s*\(france\)/i.test(label);
    const isNatural = /natural|naturel|neural/.test(label);
    const isOnline = /online|google/.test(label);
    const isLegacyDesktop = /desktop/.test(label) && !isNatural;
    const namePreference = /julie/.test(label) ? 45
      : /paul/.test(label) ? 40
        : /denise/.test(label) ? 35
          : /henri/.test(label) ? 30
            : /hortense/.test(label) ? 5
              : 0;
    let family = 0;
    if (isFrance && (isNatural || isOnline)) family = 4;
    else if (isFrance) family = 3;
    else if (isFrench && (isNatural || isOnline)) family = 2;
    else if (isFrench) family = 1;
    return family * 1000
      + (isNatural ? 180 : 0)
      + (isOnline ? 90 : 0)
      + (/microsoft/.test(label) ? 40 : 0)
      + namePreference
      + (voice.default ? 5 : 0)
      - (isLegacyDesktop ? 60 : 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function voiceDisplayName(voice) {
    return `${voice.name.replace(/\s*-\s*French\s*\(France\)\s*/i, "").trim()} · ${voice.lang}`;
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    const ranked = [...voices]
      .filter((voice) => /^fr(?:-|_)/i.test(voice.lang))
      .sort((a, b) => voiceQuality(b) - voiceQuality(a) || a.name.localeCompare(b.name, "fr"));
    const manualMatch = voiceChoiceIsManual && selectedVoiceKey
      ? ranked.find((voice) => voiceKey(voice) === selectedVoiceKey)
      : null;
    selectedVoice = manualMatch || ranked[0] || voices[0] || null;
    selectedVoiceKey = selectedVoice ? voiceKey(selectedVoice) : "";

    const select = $("#voice-choice");
    if (!select) return;
    if (!ranked.length) {
      select.innerHTML = '<option value="">Voix française indisponible</option>';
      select.disabled = true;
      $("#speech-warning").textContent = "Aucune voix française n’est disponible dans ce navigateur. Le contenu écrit reste complet.";
      $("#speech-warning").hidden = false;
      return;
    }
    select.disabled = false;
    select.innerHTML = ranked.map((voice) => {
      const key = voiceKey(voice);
      return `<option value="${escapeHtml(key)}">${escapeHtml(voiceDisplayName(voice))}</option>`;
    }).join("");
    select.value = selectedVoiceKey;
    select.title = selectedVoice ? `Voix utilisée : ${voiceDisplayName(selectedVoice)}` : "";
    $("#speech-warning").hidden = true;
  }

  function prepareSpeechText(text) {
    return String(text)
      .replace(/\bHP\b/g, "haute pression")
      .replace(/\bBP\b/g, "basse pression")
      .replace(/R[\u2011\u2010-]?134a/gi, "R cent trente-quatre a")
      .replace(/R[\u2011\u2010-]?407C/gi, "R quatre-cent-sept cé")
      .replace(/°C/g, " degrés Celsius")
      .replace(/\bbar\b/g, "bar")
      .replace(/→/g, "vers")
      .replace(/\s+/g, " ")
      .trim();
  }

  function narrationChunks(text) {
    return prepareSpeechText(text)
      .split(/(?<=[.!?;])\s+/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }

  function updateListenButton() {
    const icon = $("#listen span");
    const label = $("#listen b");
    if (speaking && !paused) {
      icon.textContent = "Ⅱ";
      label.textContent = " Pause";
    } else if (paused) {
      icon.textContent = "▶";
      label.textContent = " Reprendre";
    } else {
      icon.textContent = "▶";
      label.textContent = " Écouter";
    }
  }

  function stopSpeech() {
    speechRun += 1;
    if (speechTimer !== null) {
      window.clearTimeout(speechTimer);
      speechTimer = null;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.resume();
      speechSynthesis.cancel();
    }
    speaking = false;
    paused = false;
    updateListenButton();
  }

  function applyVoiceCue(cue) {
    if (cue.control) {
      const control = $(cue.control);
      if (control) {
        control.value = String(cue.value);
        control.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (cue.direction && $("[data-direction]")) {
      directionMode = cue.direction;
      updateDirection();
    }
  }

  function speakCurrent() {
    if (!voiceEnabled) return;
    if (!("speechSynthesis" in window)) {
      $("#speech-warning").hidden = false;
      return;
    }
    stopSpeech();
    loadVoices();
    const run = speechRun;
    const lesson = lessons[current];
    const steps = lesson.voiceSteps || narrationChunks(lesson.speak).map((text) => ({ text }));
    let stepIndex = 0;

    const speakStep = () => {
      if (run !== speechRun) return;
      if (stepIndex >= steps.length) {
        speaking = false;
        paused = false;
        updateListenButton();
        return;
      }
      const cue = steps[stepIndex];
      stepIndex += 1;
      applyVoiceCue(cue);
      const utterance = new SpeechSynthesisUtterance(prepareSpeechText(cue.text));
      utterance.lang = selectedVoice ? selectedVoice.lang : "fr-FR";
      utterance.voice = selectedVoice;
      utterance.rate = rates[rateIndex];
      utterance.pitch = 1;
      utterance.onstart = () => {
        if (run !== speechRun) return;
        speaking = true;
        paused = false;
        updateListenButton();
      };
      utterance.onend = () => {
        if (run !== speechRun) return;
        speechTimer = window.setTimeout(speakStep, 120);
      };
      utterance.onerror = (event) => {
        if (event.error === "canceled" || event.error === "interrupted" || run !== speechRun) return;
        speaking = false;
        paused = false;
        updateListenButton();
        $("#speech-warning").hidden = false;
      };
      speechSynthesis.speak(utterance);
    };
    speakStep();
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window)) {
      $("#speech-warning").hidden = false;
      return;
    }
    if (speaking && !paused) {
      speechSynthesis.pause();
      paused = true;
      updateListenButton();
      return;
    }
    if (paused) {
      speechSynthesis.resume();
      paused = false;
      updateListenButton();
      return;
    }
    speakCurrent();
  }

  function saveRate() {
    $("#speed-value").textContent = `${rates[rateIndex].toFixed(2).replace(".", ",")}×`;
    try {
      localStorage.setItem("pression-temperature-rate", String(rates[rateIndex]));
    } catch (_) {}
    if (speaking || paused) speakCurrent();
  }

  function goTo(index, continueNarration) {
    stopSpeech();
    current = Math.max(0, Math.min(lessons.length - 1, index));
    furthest = Math.max(furthest, current);
    render();
    if (continueNarration && voiceEnabled) setTimeout(speakCurrent, 300);
  }

  function enterCourseMode() {
    document.body.classList.remove("summary-running");
    document.body.classList.add("course-running");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function exitCourseMode() {
    stopSpeech();
    document.body.classList.remove("course-running", "summary-running");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function showSummary() {
    stopSpeech();
    document.body.classList.remove("course-running");
    document.body.classList.add("summary-running");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function startCourse() {
    autoplay = true;
    enterCourseMode();
    goTo(0, true);
  }

  buildStepper();
  try {
    const savedRate = Number(localStorage.getItem("pression-temperature-rate"));
    const savedIndex = rates.indexOf(savedRate);
    if (savedIndex >= 0) rateIndex = savedIndex;
  } catch (_) {}
  loadVoices();
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = loadVoices;
  else {
    $("#voice-choice").disabled = true;
    $("#listen").disabled = true;
    $("#speech-warning").hidden = false;
  }
  saveRate();
  render();

  $("#start").addEventListener("click", startCourse);
  $("#prev").addEventListener("click", () => goTo(current - 1, autoplay));
  $("#next").addEventListener("click", () => {
    if (current === lessons.length - 1) {
      showSummary();
      return;
    }
    goTo(current + 1, autoplay);
  });
  $("#exit-course").addEventListener("click", exitCourseMode);
  $("#listen").addEventListener("click", toggleSpeech);
  $("#voice-choice").addEventListener("change", (event) => {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    selectedVoice = voices.find((voice) => voiceKey(voice) === event.target.value) || selectedVoice;
    selectedVoiceKey = selectedVoice ? voiceKey(selectedVoice) : "";
    voiceChoiceIsManual = true;
    if (speaking || paused) speakCurrent();
  });
  $("#slower").addEventListener("click", () => {
    rateIndex = Math.max(0, rateIndex - 1);
    saveRate();
  });
  $("#faster").addEventListener("click", () => {
    rateIndex = Math.min(rates.length - 1, rateIndex + 1);
    saveRate();
  });
  $("#voice-toggle").addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    $("#voice-toggle").setAttribute("aria-pressed", String(voiceEnabled));
    $("#voice-toggle").textContent = voiceEnabled ? "🔊 Voix active" : "🔇 Voix coupée";
    if (!voiceEnabled) stopSpeech();
  });
  $("#refs-toggle").addEventListener("click", () => {
    const expanded = $("#refs-toggle").getAttribute("aria-expanded") === "true";
    $("#refs-toggle").setAttribute("aria-expanded", String(!expanded));
    $("#refs").hidden = expanded;
    if (!expanded) $("#refs").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#restart").addEventListener("click", () => {
    stopSpeech();
    current = 0;
    furthest = 0;
    autoplay = true;
    quizIndex = 0;
    score = 0;
    answered = false;
    enterCourseMode();
    render();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (document.body.classList.contains("course-running") || document.body.classList.contains("summary-running"))) {
      exitCourseMode();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSpeech();
  });
  window.addEventListener("pagehide", stopSpeech);
})();
