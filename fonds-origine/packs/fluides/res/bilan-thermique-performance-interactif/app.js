(function () {
  "use strict";

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const rates = [0.80, 0.95, 1.10, 1.25];
  const rateKey = "inerweb-bilan-thermique-rate";
  const model = {
    transmission: 490,
    products: 771,
    other: 1250,
    runtime: 18,
    heating: 2812,
    coolingSensible: 3600,
    coolingLatent: 700
  };
  const wallLayers = [
    { key: "lining", name: "Parement intérieur", short: "Parement", e: 13, lambda: 0.25, tone: "lining" },
    { key: "insulation", name: "Isolant", short: "Isolant", e: 120, lambda: 0.025, tone: "insulation" },
    { key: "structure", name: "Voile béton", short: "Béton", e: 160, lambda: 1.75, tone: "structure" }
  ];
  let wallMode = "layers";
  let wallLayerIndex = 1;
  let labelFocus = "cooling";
  let activeClimate = "average";

  let current = 0;
  let furthest = 0;
  let quizIndex = 0;
  let score = 0;
  let answered = false;
  let rateIndex = 1;
  let voiceEnabled = true;
  let autoplay = false;
  let speaking = false;
  let paused = false;
  let speechRun = 0;
  let selectedVoiceName = "";
  let availableVoices = [];
  let projectChecks = new Set();

  const fmt = (value, digits) => Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: digits || 0,
    maximumFractionDigits: digits == null ? 0 : digits
  });
  const value = (id) => {
    const element = $("#" + id);
    const number = element ? Number(String(element.value).replace(",", ".")) : 0;
    return Number.isFinite(number) ? number : 0;
  };
  const field = (id, label, unit, initial, step, min) => `
    <label class="field"><span>${label}</span>
      <input id="${id}" type="number" value="${initial}" step="${step || 1}" min="${min == null ? 0 : min}" inputmode="decimal">
      <small>${unit}</small>
    </label>`;
  const fictional = `<p class="callout trap fictional"><b>Cas fictif.</b> Remplacez chaque valeur par une donnée relevée, climatique, produit ou constructeur.</p>`;

  const lessons = [
    {
      short: "Le besoin",
      kicker: "CHAMBRE FROIDE · ÉTAPE 1",
      title: "Avant la machine, regarder la chaleur",
      text: "Avant de choisir la machine, repérez toute la chaleur qui entre ou qui est produite dans la chambre. Sélectionnez les quatre familles d’apports.",
      render: renderHeatSources,
      wire: wireHeatSources
    },
    {
      short: "W ou kWh",
      kicker: "CHAMBRE FROIDE · ÉTAPE 2",
      title: "Le watt n’est pas le kilowattheure",
      text: "La puissance décrit ce qui se passe maintenant : c’est un débit d’énergie, en W ou kW. L’énergie compte ce qui s’est accumulé pendant une durée, en Wh ou kWh. Donc E = P × t.",
      render: renderPowerEnergy,
      wire: wirePowerEnergy
    },
    {
      short: "Parois",
      kicker: "CHAMBRE FROIDE · ÉTAPE 3",
      title: "La chaleur traverse les parois",
      text: "Convertissez d’abord l’épaisseur e de mm en m. Pour chaque couche, calculez R = e ÷ λ. Le signe Σ veut dire « additionner ». Rsi et Rse sont les résistances des surfaces. Enfin U = 1 ÷ R total : plus U est petit, mieux la paroi isole.",
      render: renderTransmission,
      wire: wireTransmission
    },
    {
      short: "Produits",
      kicker: "CHAMBRE FROIDE · ÉTAPE 4",
      title: "Le produit apporte aussi sa chaleur",
      text: "Deux calculs peuvent être nécessaires. Le sensible refroidit le produit sans changer son état. Le latent retire l’énergie de congélation. Si le produit ne gèle pas, la masse à congeler vaut zéro.",
      render: renderProducts,
      wire: wireProducts
    },
    {
      short: "Air et usages",
      kicker: "CHAMBRE FROIDE · ÉTAPE 5",
      title: "Une porte ouverte change le bilan",
      text: "L’air extérieur apporte de la chaleur sensible et souvent de l’humidité. Les personnes, l’éclairage, les ventilateurs et le dégivrage ajoutent aussi des watts. Ces apports doivent être séparés pour savoir ensuite où agir.",
      render: renderOtherLoads,
      wire: wireOtherLoads
    },
    {
      short: "Total froid",
      kicker: "CHAMBRE FROIDE · ÉTAPE 6",
      title: "Additionner, puis tenir compte du temps de marche",
      text: "Les apports arrivent pendant 24 h. Si la machine ne dispose que de 18 h pour les retirer, elle doit travailler plus vite : puissance = bilan moyen × 24 ÷ 18. Ce facteur de temps n’est pas une marge de sécurité.",
      render: renderColdBalance,
      wire: wireColdBalance
    },
    {
      short: "Deux saisons",
      kicker: "CLIMATISATION · ÉTAPE 7",
      title: "En hiver on compense, en été on extrait",
      text: "En chauffage, le local perd de la chaleur vers l’extérieur. En refroidissement, il en reçoit par le bâtiment, le soleil, l’air neuf, les personnes et les appareils. La même enveloppe est étudiée avec deux conditions de calcul différentes.",
      render: renderTwoSeasons,
      wire: wireTwoSeasons
    },
    {
      short: "Chauffage",
      kicker: "CLIMATISATION · ÉTAPE 8",
      title: "Bilan chaud : enveloppe plus air neuf",
      text: "UA signifie ici la somme de U × A pour toutes les parois. La première partie calcule les pertes de l’enveloppe. La seconde estime les pertes sensibles de l’air neuf avec 0,34 et un débit en m³/h.",
      render: renderHeating,
      wire: wireHeating
    },
    {
      short: "Refroidissement",
      kicker: "CLIMATISATION · ÉTAPE 9",
      title: "Bilan froid : sensible plus latent",
      text: "Le sensible change la température : on le voit au thermomètre. Le latent retire de l’eau de l’air : on le voit aux condensats. La batterie froide traite les deux, donc la puissance totale est leur somme.",
      render: renderCooling,
      wire: wireCooling
    },
    {
      short: "Comparer",
      kicker: "CLIMATISATION · ÉTAPE 10",
      title: "Le même local n’a pas le même besoin toute l’année",
      text: "La puissance de chauffage et la puissance de refroidissement viennent de scénarios distincts. On ne choisit pas la machine sur une règle au mètre carré : on compare les deux bilans, les conditions de base et le fonctionnement attendu.",
      render: renderCompareLoads
    },
    {
      short: "COP et EER",
      kicker: "PERFORMANCE · ÉTAPE 11",
      title: "À un instant : COP en chaud, EER en froid",
      text: "Dans la convention courante de la climatisation, le COP compare la chaleur fournie à l’électricité absorbée en chauffage. L’EER compare la chaleur retirée à l’électricité absorbée en refroidissement. Dans le métier du froid, l’expression COP frigorifique peut aussi être rencontrée : il faut toujours lire la définition utilisée.",
      render: renderInstantPerformance,
      wire: wireInstantPerformance
    },
    {
      short: "SCOP et SEER",
      kicker: "PERFORMANCE · ÉTAPE 12",
      title: "Sur une saison, les conditions changent",
      text: "SCOP = chauffage sur une saison. SEER = refroidissement sur une saison. L’exercice montre le sens du rapport utile ÷ électrique. La valeur réglementaire d’une étiquette vient, elle, d’une méthode d’essai et de calcul normalisée.",
      render: renderSeasonalPerformance,
      wire: wireSeasonalPerformance
    },
    {
      short: "Consommation",
      kicker: "PERFORMANCE · ÉTAPE 13",
      title: "De l’énergie utile à l’électricité",
      text: "Pour une estimation de projet : électricité = besoin utile ÷ SCOP ou SEER. Attention : le kWh/an imprimé sur l’étiquette est déjà une consommation électrique conventionnelle. Ne le divisez pas une seconde fois.",
      render: renderConsumption,
      wire: wireConsumption
    },
    {
      short: "Étiquette",
      kicker: "PERFORMANCE · ÉTAPE 14",
      title: "Lire la vraie étiquette européenne",
      text: "La plaque ci-dessous est le visuel officiel de la Commission européenne. Les numéros 1 à 11 repèrent chaque information. Choisissez une famille pour la lire en grand, puis vérifiez toujours la colonne froid, la saison de chauffage et le bruit.",
      render: renderEnergyLabel,
      wire: wireEnergyLabel
    },
    {
      short: "Le projet",
      kicker: "SYNTHÈSE · ÉTAPE 15",
      title: "Un résultat doit pouvoir être défendu",
      text: "Le calcul final ne vaut que par ses entrées. Notez l’origine des dimensions, des températures, des données produit et des performances constructeur.",
      render: renderProject,
      wire: wireProject
    },
    {
      short: "Défi",
      kicker: "DÉFI FINAL · ÉTAPE 16",
      title: "Du bilan à l’étiquette",
      text: "Dix questions pour vérifier les unités, les postes du bilan et la lecture des performances. Chaque réponse est expliquée avant de passer à la suivante.",
      zoneClass: "quiz-zone",
      render: quizMarkup,
      wire: wireQuiz
    }
  ];

  const questions = [
    { q: "Que représente un bilan thermique de chambre froide ?", answers: ["La quantité de fluide à charger", "La somme des apports de chaleur à retirer", "La pression maximale du compresseur", "Le prix annuel de l’électricité"], good: 1, why: "Le bilan rassemble les apports thermiques. Il sert ensuite à déterminer la puissance frigorifique nécessaire." },
    { q: "Quelle unité mesure une puissance thermique ?", answers: ["Le kilowattheure", "Le kilogramme", "Le watt", "Le kelvin par heure"], good: 2, why: "Le watt mesure une puissance. Le kilowattheure mesure une énergie accumulée pendant une durée." },
    { q: "Après avoir additionné les résistances R de la paroi, comment obtient-on U ?", answers: ["U = R total × A", "U = 1 ÷ R total", "U = λ ÷ e pour tout le bâtiment", "U = Rsi + Rse seulement"], good: 1, why: "U est l’inverse de R total. Une grande résistance donne donc un petit U et une paroi plus isolante. La transmission vaut ensuite Φ = U × A × ΔT." },
    { q: "Un produit doit être congelé. Quel terme faut-il ajouter au refroidissement sensible ?", answers: ["La chaleur latente", "Le niveau sonore", "Le SCOP", "La pression relative"], good: 0, why: "Le changement d’état demande une énergie latente, calculée avec la masse et la chaleur latente du produit." },
    { q: "Pourquoi une ouverture de porte peut-elle augmenter deux charges ?", answers: ["Elle augmente le COP et le SCOP", "L’air apporte de la chaleur sensible et de l’humidité", "Elle réduit la surface des parois", "Elle arrête les ventilateurs"], good: 1, why: "L’air entrant peut être plus chaud et plus humide. Il crée alors une charge sensible et une charge latente." },
    { q: "En climatisation d’été, la puissance totale vaut :", answers: ["Sensible moins latente", "Sensible plus latente", "SEER multiplié par SCOP", "Puissance utile moins puissance électrique"], good: 1, why: "La batterie doit refroidir l’air et condenser l’humidité : les charges sensible et latente s’additionnent." },
    { q: "Dans la convention courante d’une clim réversible, quel indicateur concerne le refroidissement instantané ?", answers: ["COP", "SCOP", "EER", "Ubat"], good: 2, why: "EER concerne le froid instantané. COP concerne le chauffage instantané dans cette convention." },
    { q: "Pourquoi le SCOP est-il plus représentatif d’une saison qu’un COP nominal ?", answers: ["Il ne tient compte que du meilleur jour", "Il agrège différentes conditions et charges", "Il supprime la consommation électrique", "Il mesure uniquement le bruit"], good: 1, why: "Le SCOP est une valeur saisonnière, pondérée sur des conditions de fonctionnement variables." },
    { q: "Sur l’étiquette européenne d’un climatiseur réversible, quelle saison de chauffage doit obligatoirement être indiquée ?", answers: ["La saison moyenne", "La saison chaude seulement", "La saison froide seulement", "Aucune saison"], good: 0, why: "La saison moyenne est obligatoire. Les saisons chaude et froide peuvent aussi être indiquées. Il faut lire la classe, le SCOP, la charge et les kWh/an dans la même colonne." },
    { q: "Pour estimer l’électricité à partir d’un besoin saisonnier, on calcule :", answers: ["Énergie utile × SCOP", "Énergie utile ÷ SCOP", "SCOP ÷ énergie utile", "Énergie utile + SEER"], good: 1, why: "La performance est un rapport utile sur électrique. Donc l’énergie électrique estimée vaut l’énergie utile divisée par la performance saisonnière." }
  ];

  function renderHeatSources() {
    return `<div class="heat-intro-lab">
      <figure class="cold-room-visual" id="cold-room-visual" data-active-source="walls">
        <img src="assets/chambre-froide-3d.webp" width="1400" height="788" decoding="async" alt="Chambre froide professionnelle en coupe, avec panneaux isolants, porte ouverte, évaporateur et produits stockés.">
        <span class="heat-marker marker-walls" aria-hidden="true"><b>1</b><i>→</i></span>
        <span class="heat-marker marker-air" aria-hidden="true"><b>2</b><i>←</i></span>
        <span class="heat-marker marker-products" aria-hidden="true"><b>3</b><i>↑</i></span>
        <span class="heat-marker marker-internal" aria-hidden="true"><b>4</b><i>↓</i></span>
        <figcaption><strong>La chaleur entre.</strong><span>Le groupe frigorifique doit la retirer.</span></figcaption>
      </figure>
      <section class="heat-learning" aria-label="Les quatre familles d’apports thermiques">
        <p class="heat-prompt">Choisissez un apport</p>
        <div class="source-bricks">
          <button class="source-brick active" type="button" data-heat-source="walls" aria-pressed="true"><i>1</i><span><b>PAROIS</b><small>Murs · plafond · sol · porte</small></span></button>
          <button class="source-brick" type="button" data-heat-source="air" aria-pressed="false"><i>2</i><span><b>AIR ENTRANT</b><small>Porte ouverte · renouvellement</small></span></button>
          <button class="source-brick" type="button" data-heat-source="products" aria-pressed="false"><i>3</i><span><b>PRODUITS</b><small>Refroidir · congeler</small></span></button>
          <button class="source-brick" type="button" data-heat-source="internal" aria-pressed="false"><i>4</i><span><b>USAGES INTERNES</b><small>Personnes · lumière · moteurs</small></span></button>
        </div>
        <article class="heat-focus" aria-live="polite">
          <b id="heat-focus-title">1 · La chaleur traverse les parois</b>
          <p id="heat-focus-copy">Elle augmente avec la surface, l’écart de température et le coefficient U.</p>
        </article>
        <p class="heat-rule"><b>BILAN THERMIQUE</b><span>= somme de tous les apports à retirer.</span></p>
      </section>
    </div>`;
  }

  function wireHeatSources() {
    const details = {
      walls: ["1 · La chaleur traverse les parois", "Elle augmente avec la surface, l’écart de température et le coefficient U."],
      air: ["2 · L’air chaud entre par les ouvertures", "Il apporte de la chaleur sensible et, souvent, de l’humidité à condenser."],
      products: ["3 · Les produits arrivent avec leur chaleur", "Il faut les refroidir et parfois retirer aussi leur chaleur latente de congélation."],
      internal: ["4 · Des équipements chauffent à l’intérieur", "Personnes, éclairage, ventilateurs et dégivrage ajoutent des watts au bilan."]
    };
    $$('[data-heat-source]').forEach((button) => button.addEventListener('click', () => {
      const source = button.dataset.heatSource;
      $$('[data-heat-source]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      $('#cold-room-visual').dataset.activeSource = source;
      $('#heat-focus-title').textContent = details[source][0];
      $('#heat-focus-copy').textContent = details[source][1];
    }));
  }

  function renderPowerEnergy() {
    return `<div class="lab two-col"><div class="stack">
      <article class="formula-card"><span class="graph-type">RELATION</span><h3>Énergie = puissance × durée</h3><div class="equation">E <i>=</i> P <i>×</i> t</div></article>
      <div class="power-energy-visual" role="img" aria-label="Une puissance instantanée de 2,5 kilowatts agit pendant une durée pour produire une énergie en kilowattheures."><span class="power-pulse">P</span><i>× durée</i><span class="energy-cells" aria-hidden="true">${"<b></b>".repeat(8)}</span><strong>E</strong></div>
      <div class="field-grid">${field("pe-power", "Puissance", "kW", 2.5, 0.1, 0.1)}${field("pe-time", "Durée", "h", 8, 0.5, 0.5)}</div>
      ${fictional}
    </div><article class="result-card"><span class="graph-type">RÉSULTAT</span><h3 id="pe-title">2,5 kW pendant 8 h</h3><div class="readouts"><span>Puissance instantanée<b id="pe-p">2,5 kW</b></span><span class="total">Énergie transférée<b id="pe-e">20,0 kWh</b></span></div><p>Deux machines de même puissance peuvent consommer des énergies différentes si leurs durées de fonctionnement diffèrent.</p></article></div>`;
  }
  function wirePowerEnergy() { bindInputs(["pe-power", "pe-time"], calcPowerEnergy); calcPowerEnergy(); }
  function calcPowerEnergy() { const p = value("pe-power"), t = value("pe-time"), e = p * t; $("#pe-title").textContent = `${fmt(p,1)} kW pendant ${fmt(t,1)} h`; $("#pe-p").textContent = `${fmt(p,1)} kW`; $("#pe-e").textContent = `${fmt(e,1)} kWh`; }

  function renderTransmission() {
    const layers = wallLayers.map((layer, index) => {
      const size = Math.max(34, Math.min(96, 30 + Math.sqrt(layer.e) * 4));
      return `<button class="wall-slab ${layer.tone} ${index===wallLayerIndex?"active":""}" style="--slab:${size}px" data-wall-layer="${index}" type="button" aria-pressed="${index===wallLayerIndex}"><b>${layer.short}</b><span id="wall-e-${index}">${fmt(layer.e)} mm</span><small id="wall-l-${index}">λ ${fmt(layer.lambda,3)}</small></button>`;
    }).join("");
    const layer = wallLayers[wallLayerIndex];
    return `<div class="wall-lab">
      <section class="wall-visual-panel">
        <div class="wall-scene" role="img" aria-label="Coupe d’une paroi composée de trois couches d’épaisseurs et de conductivités thermiques différentes. La chaleur traverse la paroi de l’extérieur chaud vers l’intérieur froid.">
          <span class="wall-temp outdoor">EXTÉRIEUR <b id="wall-out-label">30 °C</b></span>
          <div class="wall-assembly">${layers}</div>
          <span class="wall-temp indoor">INTÉRIEUR <b id="wall-in-label">2 °C</b></span>
          <div class="wall-heat-arrow" aria-hidden="true"><i></i><b>flux de chaleur</b></div>
        </div>
        <div class="wall-formula-path" aria-label="Étapes du calcul">
          <span><b>1</b> R couche = e ÷ λ</span><i>→</i><span><b>2</b> R total = Rsi + ΣR + Rse</span><i>→</i><span><b>3</b> U = 1 ÷ R total</span><i>→</i><span><b>4</b> Φ = U × A × ΔT</span>
        </div>
      </section>
      <section class="wall-learning">
        <div class="mode-switch wall-mode-switch" aria-label="Méthode de calcul"><button class="mode-button ${wallMode==="layers"?"active":""}" data-wall-mode="layers" type="button" aria-pressed="${wallMode==="layers"}">Calcul par couches · Bac</button><button class="mode-button ${wallMode==="direct"?"active":""}" data-wall-mode="direct" type="button" aria-pressed="${wallMode==="direct"}">U déjà fourni</button></div>
        <article class="wall-editor" id="wall-layer-editor" ${wallMode==="direct"?"hidden":""}><span class="graph-type">COUCHE SÉLECTIONNÉE · CAS FICTIF</span><h3 id="wall-layer-name">${layer.name}</h3><div class="field-grid">${field("tr-e", "Épaisseur e", "mm — le calcul convertit en m", layer.e, 1, 1)}${field("tr-lambda", "Conductivité λ", "W/(m·K) — propriété du matériau", layer.lambda, 0.001, 0.001)}</div><div class="wall-glossary"><span><b>λ bas</b> matériau isolant</span><span><b>R haut</b> couche résistante</span><span><b>U bas</b> paroi isolante</span><span><b>Rsi + Rse</b> surfaces · 0,13 + 0,04 ici</span></div></article>
        <article class="wall-editor" id="wall-direct-editor" ${wallMode==="layers"?"hidden":""}><span class="graph-type">FICHE TECHNIQUE</span><h3>Le fabricant donne déjà U</h3>${field("tr-u-direct", "Coefficient U fourni", "W/(m²·K)", 0.25, 0.01, 0.01)}<p>Conservez la référence de la paroi, son épaisseur et la source de cette valeur.</p></article>
        <div class="field-grid wall-common-fields">${field("tr-a", "Surface A", "m²", 70, 1, 1)}${field("tr-out", "Température extérieure", "°C", 30, 1, -40)}${field("tr-in", "Température intérieure", "°C", 2, 1, -40)}</div>
        <article class="wall-result"><div class="readouts"><span>R de la couche<b id="tr-r-layer">—</b></span><span>R total<b id="tr-r-total">—</b></span><span>Coefficient U<b id="tr-u-result">—</b></span><span class="total">Transmission Φ<b id="tr-result">—</b></span></div><p id="tr-line">Calcul en cours</p></article>
        ${fictional}
      </section>
    </div>`;
  }
  function wireTransmission() {
    $$('[data-wall-mode]').forEach((button) => button.addEventListener('click', () => {
      wallMode = button.dataset.wallMode;
      $$('[data-wall-mode]').forEach((item) => { const active=item===button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
      $('#wall-layer-editor').hidden = wallMode !== 'layers';
      $('#wall-direct-editor').hidden = wallMode !== 'direct';
      calcTransmission();
    }));
    $$('[data-wall-layer]').forEach((button) => button.addEventListener('click', () => {
      wallLayerIndex = Number(button.dataset.wallLayer);
      $$('[data-wall-layer]').forEach((item) => { const active=item===button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
      const layer=wallLayers[wallLayerIndex];
      $('#wall-layer-name').textContent=layer.name;
      $('#tr-e').value=layer.e;
      $('#tr-lambda').value=layer.lambda;
      calcTransmission();
    }));
    bindInputs(["tr-a","tr-out","tr-in","tr-u-direct"], calcTransmission);
    bindInputs(["tr-e","tr-lambda"], () => {
      const layer=wallLayers[wallLayerIndex];
      layer.e=Math.max(value('tr-e'),1);
      layer.lambda=Math.max(value('tr-lambda'),.001);
      $('#wall-e-'+wallLayerIndex).textContent=`${fmt(layer.e)} mm`;
      $('#wall-l-'+wallLayerIndex).textContent=`λ ${fmt(layer.lambda,3)}`;
      const slab=$(`[data-wall-layer="${wallLayerIndex}"]`);
      if(slab)slab.style.setProperty('--slab',`${Math.max(34,Math.min(96,30+Math.sqrt(layer.e)*4))}px`);
      calcTransmission();
    });
    calcTransmission();
  }
  function calcTransmission() {
    const rLayers=wallLayers.reduce((sum,layer)=>sum+(layer.e/1000)/Math.max(layer.lambda,.001),0);
    const rTotal=.13+rLayers+.04;
    const calculatedU=1/Math.max(rTotal,.001);
    const u=wallMode==='direct'?Math.max(value('tr-u-direct'),.001):calculatedU;
    const a=value("tr-a"), out=value("tr-out"), inside=value("tr-in"), dt=Math.abs(out-inside), result=u*a*dt;
    const selected=wallLayers[wallLayerIndex], selectedR=(selected.e/1000)/Math.max(selected.lambda,.001);
    model.transmission=result;
    $('#wall-out-label').textContent=`${fmt(out,1)} °C`;
    $('#wall-in-label').textContent=`${fmt(inside,1)} °C`;
    $('#tr-r-layer').textContent=`${fmt(selectedR,3)} m²·K/W`;
    $('#tr-r-total').textContent=wallMode==='layers'?`${fmt(rTotal,3)} m²·K/W`:`${fmt(1/u,3)} m²·K/W`;
    $('#tr-u-result').textContent=`${fmt(u,3)} W/(m²·K)`;
    $('#tr-result').textContent=`${fmt(result)} W`;
    $('#tr-line').textContent=`${fmt(u,3)} × ${fmt(a)} × ${fmt(dt,1)} = ${fmt(result)} W`;
  }

  function renderProducts() {
    return `<div class="lab two-col products-lab"><div class="stack"><article class="formula-card product-formulas"><span><small>SANS CHANGEMENT D’ÉTAT</small><b>Φ sensible = m × c × ΔT ÷ durée</b></span><span><small>POUR CONGELER</small><b>Φ latente = m à congeler × L ÷ durée</b></span></article><div class="product-journey" role="img" aria-label="Le produit arrive chaud, se refroidit, puis peut se congeler avec un retrait de chaleur latente."><span class="crate hot"><i></i><b>ARRIVÉE</b><small>produit chaud</small></span><em>→</em><span class="crate cool"><i></i><b>REFROIDIR</b><small>chaleur sensible</small></span><em>→</em><span class="crate frozen"><i></i><b>CONGELER</b><small>chaleur latente</small></span></div><div class="field-grid">${field("pr-m", "Masse de produit", "kg", 500, 10, 0)}${field("pr-c", "Capacité thermique c", "kJ/(kg·K) — donnée produit", 3.7, 0.1, 0)}${field("pr-dt", "Refroidissement ΔT", "K", 18, 1, 0)}${field("pr-time", "Durée imposée", "h — utilisée dans les deux calculs", 12, 1, 0.1)}${field("pr-mf", "Masse à congeler", "kg — mettre 0 si le produit ne gèle pas", 0, 10, 0)}${field("pr-l", "Chaleur latente L", "kJ/kg — donnée produit", 0, 1, 0)}</div></div><article class="result-card"><span class="graph-type">RÉSULTAT · CAS FICTIF</span><h3>Le sensible et le latent restent séparés</h3><div class="readouts"><span>Refroidissement sensible<b id="pr-sensible">771 W</b></span><span>Congélation latente<b id="pr-latent">0 W</b></span><span class="total wide">Total produit<b id="pr-total">771 W</b></span></div><p><b>Lecture :</b> avec 0 kg à congeler, le latent vaut 0 W. Le produit est seulement refroidi.</p>${fictional}</article></div>`;
  }
  function wireProducts() { bindInputs(["pr-m","pr-c","pr-dt","pr-time","pr-mf","pr-l"], calcProducts); calcProducts(); }
  function calcProducts() { const seconds=Math.max(value("pr-time")*3600,1), sensible=value("pr-m")*value("pr-c")*value("pr-dt")*1000/seconds, latent=value("pr-mf")*value("pr-l")*1000/seconds, total=sensible+latent; model.products=total; $("#pr-sensible").textContent=`${fmt(sensible)} W`; $("#pr-latent").textContent=`${fmt(latent)} W`; $("#pr-total").textContent=`${fmt(total)} W`; }

  function renderOtherLoads() {
    return `<div class="lab two-col air-usages-lab"><div class="stack"><div class="field-grid">${field("ot-air", "Air entrant · résultat calculé", "W — chaleur sensible + humidité déjà calculées", 600, 50, 0)}${field("ot-people", "Personnes", "W", 200, 10, 0)}${field("ot-light", "Éclairage", "W", 150, 10, 0)}${field("ot-fans", "Ventilateurs", "W", 300, 10, 0)}${field("ot-defrost", "Dégivrage moyen", "W ramenés à la période étudiée", 0, 10, 0)}</div>${fictional}</div><article class="result-card"><span class="graph-type">POSTES COMPLÉMENTAIRES</span><h3>Ne rien cacher dans « divers »</h3><div class="bar-list" id="ot-bars"></div><div class="readouts"><span class="total wide">Total air et usages<b id="ot-total">1 250 W</b></span></div><p class="callout trap"><b>À comprendre.</b> Cette slide fait l’inventaire. Le champ « air entrant » reçoit un résultat calculé auparavant à partir de l’air chaud et humide.</p><p class="callout key"><b>La clé.</b> Un poste séparé peut être réduit : porte mieux gérée, éclairage adapté, ventilateurs efficaces.</p></article></div>`;
  }
  function wireOtherLoads() { bindInputs(["ot-air","ot-people","ot-light","ot-fans","ot-defrost"], calcOtherLoads); calcOtherLoads(); }
  function calcOtherLoads() { const items=[["Air entrant",value("ot-air")],["Personnes",value("ot-people")],["Éclairage",value("ot-light")],["Ventilateurs",value("ot-fans")],["Dégivrage",value("ot-defrost")]], total=items.reduce((sum,item)=>sum+item[1],0), max=Math.max(...items.map(x=>x[1]),1); model.other=total; $("#ot-bars").innerHTML=items.map(x=>`<div class="bar-row"><span>${x[0]}</span><span class="bar"><i style="width:${x[1]/max*100}%"></i></span><span>${fmt(x[1])} W</span></div>`).join(""); $("#ot-total").textContent=`${fmt(total)} W`; }

  function renderColdBalance() {
    return `<div class="lab two-col"><div class="stack"><article class="panel"><span class="graph-type">BILAN MOYEN SUR 24 H</span><h3>Somme des postes calculés</h3><div class="bar-list" id="cb-bars"></div></article><label class="field">Temps de marche réellement disponible<input id="cb-runtime" type="range" min="12" max="24" step="1" value="${model.runtime}"><small><b id="cb-runtime-label">${model.runtime} h</b> pour retirer les apports d’une journée</small></label><p class="callout trap"><b>Attention.</b> Temps de marche, marge justifiée et correction constructeur sont trois décisions différentes.</p></div><article class="result-card"><span class="graph-type">PUISSANCE À COUVRIR</span><h3 id="cb-formula"></h3><div class="readouts"><span>Bilan moyen<b id="cb-average"></b></span><span class="total">Puissance pendant la marche<b id="cb-required"></b></span></div><p id="cb-explain">Les apports de 24 h sont retirés pendant le temps disponible.</p>${fictional}</article></div>`;
  }
  function wireColdBalance() { bindInputs(["cb-runtime"], calcColdBalance); calcColdBalance(); }
  function calcColdBalance() { model.runtime=value("cb-runtime"); const parts=[["Parois",model.transmission],["Produits",model.products],["Air + usages",model.other]], average=parts.reduce((s,x)=>s+x[1],0), required=average*24/Math.max(model.runtime,1), max=Math.max(...parts.map(x=>x[1]),1); $("#cb-bars").innerHTML=parts.map(x=>`<div class="bar-row"><span>${x[0]}</span><span class="bar"><i style="width:${x[1]/max*100}%"></i></span><span>${fmt(x[1])} W</span></div>`).join(""); $("#cb-runtime-label").textContent=`${fmt(model.runtime)} h`; $("#cb-formula").textContent=`${fmt(average)} W × 24 h ÷ ${fmt(model.runtime)} h`; $("#cb-average").textContent=`${fmt(average)} W`; $("#cb-required").textContent=`${fmt(required)} W`; $("#cb-explain").textContent=`La chaleur reçue en 24 h doit être retirée pendant ${fmt(model.runtime)} h : facteur de temps = ${fmt(24/Math.max(model.runtime,1),2)}.`; }

  function renderTwoSeasons() {
    return `<div class="season-lab" data-season="winter">
      <figure class="clim-house-visual">
        <img src="assets/batiment-clim-3d.webp" width="1400" height="788" decoding="async" alt="Maison contemporaine en coupe avec un climatiseur mural intérieur et son groupe extérieur.">
        <span class="season-badge" id="season-badge">HIVER · CHAUFFAGE</span>
        <span class="season-flow flow-envelope" id="season-left"><i>→</i><b>PAROIS</b><small>la chaleur sort</small></span>
        <span class="season-flow flow-air" id="season-right"><i>→</i><b>AIR NEUF</b><small>perte sensible</small></span>
        <span class="season-flow flow-split" id="season-split"><i>↓</i><b>SPLIT</b><small>apporte la chaleur</small></span>
        <span class="season-flow flow-sun" id="season-sun"><i>☀</i><b>SOLEIL</b><small>faible en hiver</small></span>
      </figure>
      <section class="season-learning"><div class="mode-switch"><button class="mode-button active" data-mode="winter" type="button" aria-pressed="true">Hiver · chauffage</button><button class="mode-button" data-mode="summer" type="button" aria-pressed="false">Été · refroidissement</button></div><article class="result-card"><span class="graph-type">SENS DU TRANSFERT</span><h3 id="season-title">La chaleur quitte le local</h3><p id="season-copy">La machine compense les pertes par les parois et l’air renouvelé.</p><div class="season-equation" id="season-equation"><b>PERTES</b><i>→</i><strong>puissance chauffage</strong></div></article><p class="callout key"><b>La clé.</b> Même bâtiment, mais températures de base, soleil, humidité et usages différents.</p></section>
    </div>`;
  }
  function wireTwoSeasons() { $$(".mode-button[data-mode]").forEach(button=>button.addEventListener("click",()=>{ $$(".mode-button[data-mode]").forEach(b=>{ const active=b===button; b.classList.toggle("active",active); b.setAttribute('aria-pressed',String(active)); }); const summer=button.dataset.mode==="summer"; $(".season-lab").dataset.season=summer?'summer':'winter'; $("#season-badge").textContent=summer?"ÉTÉ · REFROIDISSEMENT":"HIVER · CHAUFFAGE"; $("#season-title").textContent=summer?"La chaleur entre dans le local":"La chaleur quitte le local"; $("#season-copy").textContent=summer?"La machine retire les apports des parois, du soleil, de l’air, des personnes et des appareils.":"La machine compense les pertes par les parois et l’air renouvelé."; $("#season-left").innerHTML=summer?"<i>←</i><b>PAROIS</b><small>la chaleur entre</small>":"<i>→</i><b>PAROIS</b><small>la chaleur sort</small>"; $("#season-right").innerHTML=summer?"<i>←</i><b>AIR CHAUD</b><small>apport sensible + latent</small>":"<i>→</i><b>AIR NEUF</b><small>perte sensible</small>"; $("#season-split").innerHTML=summer?"<i>↓</i><b>SPLIT</b><small>retire la chaleur</small>":"<i>↓</i><b>SPLIT</b><small>apporte la chaleur</small>"; $("#season-sun").innerHTML=summer?"<i>☀</i><b>SOLEIL</b><small>apport important</small>":"<i>☀</i><b>SOLEIL</b><small>faible en hiver</small>"; $("#season-equation").innerHTML=summer?"<b>APPORTS</b><i>→</i><strong>puissance refroidissement</strong>":"<b>PERTES</b><i>→</i><strong>puissance chauffage</strong>"; })); }

  function renderHeating() {
    return `<div class="lab two-col"><div class="stack heating-stack"><article class="formula-card"><span class="graph-type">ESTIMATION SENSIBLE · CAS FICTIF</span><div class="equation">Φ <i>=</i> UA × ΔT <i>+</i> 0,34 × qᵥ × ΔT</div><div class="formula-legend"><span><b>UA</b> = Σ(U × A) des parois</span><span><b>qᵥ</b> = débit d’air en m³/h</span></div></article><div class="heating-visual" role="img" aria-label="Deux chemins de perte thermique partent du local : la transmission à travers l’enveloppe et l’air neuf."><div class="mini-room"><span>20 °C</span><i class="loss-wall">→</i><i class="loss-air">→</i></div><span><b>1 · ENVELOPPE</b><small>UA × ΔT</small></span><span><b>2 · AIR NEUF</b><small>0,34 × qᵥ × ΔT</small></span></div><div class="field-grid">${field("ht-ua", "Somme U × A des parois", "W/K — coefficient global UA", 95, 1, 0)}${field("ht-dt", "Écart intérieur–extérieur", "K", 18, 1, 0)}${field("ht-air", "Débit d’air neuf qᵥ", "m³/h", 180, 10, 0)}</div>${fictional}</div><article class="result-card"><span class="graph-type">BILAN CHAUD SIMPLIFIÉ</span><h3>Deux pertes visibles</h3><div class="readouts"><span>Transmission<b id="ht-trans"></b></span><span>Air neuf sensible<b id="ht-air-result"></b></span><span class="total wide">Total chauffage<b id="ht-total"></b></span></div><p class="callout trap"><b>Limite.</b> 0,34 est un raccourci pour l’air avec qᵥ en m³/h. Il n’intègre ni récupération, ni humidité, ni ponts thermiques détaillés.</p></article></div>`;
  }
  function wireHeating() { bindInputs(["ht-ua","ht-dt","ht-air"],calcHeating); calcHeating(); }
  function calcHeating() { const dt=value("ht-dt"), trans=value("ht-ua")*dt, air=.34*value("ht-air")*dt, total=trans+air; model.heating=total; $("#ht-trans").textContent=`${fmt(trans)} W`; $("#ht-air-result").textContent=`${fmt(air)} W`; $("#ht-total").textContent=`${fmt(total)} W`; }

  function renderCooling() {
    return `<div class="lab two-col"><div class="stack"><div class="field-grid">${field("cl-envelope", "Parois et vitrages", "W sensibles", 900, 50, 0)}${field("cl-solar", "Apports solaires", "W sensibles", 1200, 50, 0)}${field("cl-air", "Air neuf", "W sensibles", 600, 50, 0)}${field("cl-people", "Occupants", "W sensibles", 400, 50, 0)}${field("cl-equipment", "Éclairage et appareils", "W sensibles", 500, 50, 0)}${field("cl-latent", "Humidité totale", "W latents", 700, 50, 0)}</div>${fictional}</div><article class="result-card"><span class="graph-type">BILAN FROID</span><h3>Sensible + latent</h3><div class="load-split" aria-label="Répartition entre charge sensible et charge latente"><span id="cl-sensible-bar" style="width:84%"><b>TEMPÉRATURE</b><small>sensible</small></span><span id="cl-latent-bar" style="width:16%"><b>H₂O</b><small>latent</small></span></div><div class="readouts"><span>Charge sensible<b id="cl-sensible"></b></span><span>Charge latente<b id="cl-latent-result"></b></span><span class="total wide">Charge totale<b id="cl-total"></b></span><span class="warning wide">Part sensible SHR<b id="cl-shr"></b></span></div><p>Le SHR est la part sensible divisée par le total. Il aide à voir si le besoin porte surtout sur la température ou aussi sur la déshumidification.</p></article></div>`;
  }
  function wireCooling() { bindInputs(["cl-envelope","cl-solar","cl-air","cl-people","cl-equipment","cl-latent"],calcCooling); calcCooling(); }
  function calcCooling() { const sensible=value("cl-envelope")+value("cl-solar")+value("cl-air")+value("cl-people")+value("cl-equipment"), latent=value("cl-latent"), total=sensible+latent, shr=total?sensible/total:0; model.coolingSensible=sensible; model.coolingLatent=latent; $("#cl-sensible").textContent=`${fmt(sensible)} W`; $("#cl-latent-result").textContent=`${fmt(latent)} W`; $("#cl-total").textContent=`${fmt(total)} W`; $("#cl-shr").textContent=`${fmt(shr,2)} · ${fmt(shr*100)} % sensible`; $("#cl-sensible-bar").style.width=`${Math.max(18,shr*100)}%`; $("#cl-latent-bar").style.width=`${Math.max(18,(1-shr)*100)}%`; }

  function renderCompareLoads() { const cooling=model.coolingSensible+model.coolingLatent, max=Math.max(model.heating,cooling,1); return `<div class="lab two-col"><article class="panel"><span class="graph-type">DEUX POINTS DE CALCUL</span><h3>Puissances utiles du cas fictif</h3><div class="bar-list"><div class="bar-row"><span>Chauffage</span><span class="bar"><i style="width:${model.heating/max*100}%"></i></span><span>${fmt(model.heating/1000,2)} kW</span></div><div class="bar-row"><span>Froid sensible</span><span class="bar"><i style="width:${model.coolingSensible/max*100}%"></i></span><span>${fmt(model.coolingSensible/1000,2)} kW</span></div><div class="bar-row"><span>Froid latent</span><span class="bar"><i style="width:${model.coolingLatent/max*100}%"></i></span><span>${fmt(model.coolingLatent/1000,2)} kW</span></div></div>${fictional}</article><div class="stack"><p class="callout key"><b>La clé.</b> La puissance la plus grande ne suffit pas à choisir. Il faut vérifier la capacité de la machine aux conditions du projet, la modulation, le traitement de l’humidité et les performances annoncées.</p><p class="callout trap"><b>Le piège.</b> Une règle du type « tant de watts par mètre carré » peut servir de contrôle grossier, jamais de bilan défendable.</p></div></div>`; }

  function renderInstantPerformance() {
    return `<div class="lab two-col"><div class="stack"><article class="formula-card"><span class="graph-type">BILAN ÉNERGÉTIQUE SIMPLIFIÉ</span><div class="balance"><span>Froid retiré<b id="ip-cold">3,0 kW</b></span><i>+</i><span>Électricité<b id="ip-power">1,0 kW</b></span><i>=</i><span>Chaud fourni<b id="ip-hot">4,0 kW</b></span></div></article><div class="field-grid">${field("ip-qcold", "Puissance retirée en froid", "kW", 3, 0.1, 0)}${field("ip-electric", "Puissance électrique", "kW", 1, 0.1, 0.1)}</div>${fictional}</div><article class="result-card"><span class="graph-type">À CET INSTANT</span><h3>Deux rapports, deux services</h3><div class="metric-grid"><div class="metric"><small>CHAUFFAGE</small><strong id="ip-cop">COP 4,0</strong><span>Chaleur fournie ÷ électricité · sans unité</span></div><div class="metric"><small>REFROIDISSEMENT</small><strong id="ip-eer">EER 3,0</strong><span>Chaleur retirée ÷ électricité · sans unité</span></div></div><p class="callout trap"><b>Vocabulaire.</b> Certains documents frigorifiques parlent de « COP froid ». Toujours vérifier le numérateur du rapport au lieu de se fier au sigle seul.</p></article></div>`;
  }
  function wireInstantPerformance() { bindInputs(["ip-qcold","ip-electric"],calcInstantPerformance); calcInstantPerformance(); }
  function calcInstantPerformance() { const cold=value("ip-qcold"), power=Math.max(value("ip-electric"),.001), hot=cold+power; $("#ip-cold").textContent=`${fmt(cold,1)} kW`; $("#ip-power").textContent=`${fmt(power,1)} kW`; $("#ip-hot").textContent=`${fmt(hot,1)} kW`; $("#ip-cop").textContent=`COP ${fmt(hot/power,2)}`; $("#ip-eer").textContent=`EER ${fmt(cold/power,2)}`; }

  function renderSeasonalPerformance() {
    return `<div class="lab two-col seasonal-lab"><div class="stack"><div class="season-wheel" role="img" aria-label="La performance saisonnière rassemble plusieurs conditions de fonctionnement au fil de l’année."><i class="winter">HIVER</i><i class="spring">PRINTEMPS</i><i class="summer">ÉTÉ</i><i class="autumn">AUTOMNE</i><b>PLUSIEURS<br>CHARGES</b></div><div class="field-grid">${field("sp-heat-useful", "Chaleur fournie sur la saison", "kWh utiles", 9000, 100, 0)}${field("sp-heat-electric", "Électricité chauffage", "kWh électriques", 2500, 100, 1)}${field("sp-cool-useful", "Froid fourni sur la saison", "kWh utiles", 3000, 100, 0)}${field("sp-cool-electric", "Électricité refroidissement", "kWh électriques", 1000, 100, 1)}</div>${fictional}</div><article class="result-card"><span class="graph-type">ILLUSTRATION DU RAPPORT</span><h3>Énergies utiles ÷ énergies électriques</h3><div class="metric-grid"><div class="metric"><small>CHAUFFAGE</small><strong id="sp-scop">SCOP 3,60</strong><span>Rapport saisonnier</span></div><div class="metric"><small>REFROIDISSEMENT</small><strong id="sp-seer">SEER 3,00</strong><span>Rapport saisonnier</span></div></div><p class="callout trap"><b>À ne pas confondre.</b> Cette manipulation explique le rapport. Elle ne fabrique pas une valeur d’étiquette : celle-ci provient d’essais et calculs normalisés.</p><p class="callout key"><b>La clé.</b> SCOP et SEER servent à comparer des produits dans le même cadre conventionnel. Ils ne promettent pas une facture exacte.</p></article></div>`;
  }
  function wireSeasonalPerformance() { bindInputs(["sp-heat-useful","sp-heat-electric","sp-cool-useful","sp-cool-electric"],calcSeasonalPerformance); calcSeasonalPerformance(); }
  function calcSeasonalPerformance() { const scop=value("sp-heat-useful")/Math.max(value("sp-heat-electric"),1), seer=value("sp-cool-useful")/Math.max(value("sp-cool-electric"),1); $("#sp-scop").textContent=`SCOP ${fmt(scop,2)}`; $("#sp-seer").textContent=`SEER ${fmt(seer,2)}`; }

  function renderConsumption() {
    return `<div class="lab two-col"><div class="stack"><label class="field"><span>Service étudié</span><select id="co-mode"><option value="heat">Chauffage · utiliser le SCOP</option><option value="cool">Refroidissement · utiliser le SEER</option></select><small>Choisir le rapport correspondant au service.</small></label><div class="field-grid">${field("co-useful", "Besoin saisonnier utile du projet", "kWh utiles — pas le kWh/an de l’étiquette", 9000, 100, 0)}${field("co-performance", "Performance saisonnière", "SCOP ou SEER", 3.6, 0.1, 0.1)}</div><article class="formula-card"><div class="equation">E électrique <i>=</i> E utile <i>÷</i> performance</div><div class="conversion-flow" aria-label="L’énergie utile est divisée par la performance saisonnière pour estimer l’électricité."><span>BESOIN UTILE</span><i>÷ SCOP / SEER</i><strong>ÉLECTRICITÉ</strong></div></article></div><article class="result-card"><span class="graph-type">ESTIMATION DE PROJET</span><h3 id="co-title">Chauffage avec un SCOP de 3,60</h3><div class="readouts"><span>Besoin utile saisi<b id="co-useful-result"></b></span><span class="total">Électricité estimée<b id="co-electric"></b></span></div><p class="callout trap"><b>Deux pièges.</b> On divise par la performance. Et on ne redécompose pas le kWh/an de l’étiquette : il s’agit déjà d’une consommation conventionnelle.</p>${fictional}</article></div>`;
  }
  function wireConsumption() { bindInputs(["co-mode","co-useful","co-performance"],calcConsumption); calcConsumption(); }
  function calcConsumption() { const heat=$("#co-mode").value==="heat", useful=value("co-useful"), performance=Math.max(value("co-performance"),.1), electric=useful/performance; $("#co-title").textContent=`${heat?"Chauffage":"Refroidissement"} avec un ${heat?"SCOP":"SEER"} de ${fmt(performance,2)}`; $("#co-useful-result").textContent=`${fmt(useful)} kWh`; $("#co-electric").textContent=`${fmt(electric)} kWh`; }

  const climates = {
    warm: { name:"Saison chaude", colour:"orange", p:"3,0 kW", scop:"5,2", energy:"823 kWh/an", grade:"A+++", threshold:"SCOP ≥ 5,10" },
    average: { name:"Saison moyenne", colour:"verte", p:"2,8 kW", scop:"4,1", energy:"957 kWh/an", grade:"A+", threshold:"4,00 ≤ SCOP < 4,60" },
    cold: { name:"Saison froide", colour:"bleue", p:"X", scop:"X", energy:"X", grade:"non indiquée", threshold:"valeurs facultatives non fournies sur cet exemple" }
  };
  function renderEnergyLabel() {
    return `<div class="eu-label-lab">
      <figure class="official-label-figure">
        <button class="official-label-open" id="official-label-open" type="button" aria-label="Agrandir l’étiquette officielle européenne du climatiseur">
          <img src="assets/etiquette-climatiseur-ue-officielle.png" width="579" height="811" decoding="async" alt="Étiquette officielle européenne annotée d’un climatiseur réversible : SEER et froid à gauche, SCOP et chauffage à droite, bruit en bas à gauche et carte des trois saisons de chauffage en bas à droite.">
          <span>⌕ Agrandir la plaque officielle</span>
        </button>
        <figcaption><b>Visuel officiel · règlement (UE) 626/2011</b><small>Commission européenne · valeurs d’exemple du document</small></figcaption>
      </figure>
      <section class="eu-label-guide">
        <span class="graph-type">LISEZ LES NUMÉROS IMPRIMÉS SUR LE DOCUMENT</span>
        <div class="label-focus-tabs"><button class="${labelFocus==="cooling"?"active":""}" data-label-focus-button="cooling" type="button">1–4 · Froid</button><button class="${labelFocus==="heating"?"active":""}" data-label-focus-button="heating" type="button">7–10 · Chauffage</button><button class="${labelFocus==="climates"?"active":""}" data-label-focus-button="climates" type="button">11 · Carte</button><button class="${labelFocus==="sound"?"active":""}" data-label-focus-button="sound" type="button">5–6 · Bruit</button></div>
        <div class="climate-switch" aria-label="Choisir une saison de chauffage"><button class="${activeClimate==="warm"?"active":""}" type="button" data-climate="warm">Orange · chaude</button><button class="${activeClimate==="average"?"active":""}" type="button" data-climate="average">Verte · moyenne</button><button class="${activeClimate==="cold"?"active":""}" type="button" data-climate="cold">Bleue · froide</button></div>
        <article class="label-detail" id="label-detail" aria-live="polite"></article>
        <p class="old-label-note"><b>Repère réglementaire.</b> La saison moyenne de chauffage est obligatoire. Les saisons chaude et froide sont facultatives. Un « X » signifie que la valeur n’est pas fournie sur cet exemple.</p>
      </section>
      <dialog class="official-label-dialog" id="official-label-dialog" aria-labelledby="official-label-dialog-title"><div><button id="official-label-close" type="button">Fermer ×</button><h3 id="official-label-dialog-title">Étiquette officielle en grand</h3><img src="assets/etiquette-climatiseur-ue-officielle.png" width="579" height="811" alt="Étiquette officielle européenne annotée d’un climatiseur réversible."><p>Document diffusé par la Commission européenne pour expliquer les repères 1 à 11.</p></div></dialog>
    </div>`;
  }
  function wireEnergyLabel() {
    $$('[data-label-focus-button]').forEach((button)=>button.addEventListener('click',()=>setLabelFocus(button.dataset.labelFocusButton)));
    $$('[data-climate]').forEach((button)=>button.addEventListener('click',()=>{
      activeClimate=button.dataset.climate;
      $$('[data-climate]').forEach((item)=>{ const active=item===button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
      labelFocus='heating';
      renderLabelDetail();
      syncLabelFocus();
    }));
    const dialog=$('#official-label-dialog'), open=$('#official-label-open'), close=$('#official-label-close');
    if(open&&dialog)open.addEventListener('click',()=>{ if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open',''); });
    if(close&&dialog)close.addEventListener('click',()=>{ if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open'); });
    renderLabelDetail();
    syncLabelFocus();
  }
  function setLabelFocus(focus){ labelFocus=focus; renderLabelDetail(); syncLabelFocus(); }
  function syncLabelFocus(){
    $$('[data-label-focus-button]').forEach((button)=>{ const active=button.dataset.labelFocusButton===labelFocus; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
    const switcher=$('.climate-switch'); if(switcher)switcher.hidden=labelFocus!=='heating'&&labelFocus!=='climates';
  }
  function renderLabelDetail(){
    const detail=$('#label-detail'); if(!detail)return;
    if(labelFocus==='cooling'){
      detail.innerHTML=`<span class="detail-kicker">REPÈRES 1 À 4 · REFROIDISSEMENT</span><h3>Lire toute la colonne bleue</h3><div class="label-number-list"><span><b>1</b> pictogramme SEER</span><span><b>2</b> classe A++</span><span><b>3</b> échelle A+++ à D</span><span><b>4</b> trois valeurs liées</span></div><div class="detail-values"><span>Charge de calcul<b>3,5 kW</b></span><span>SEER<b>6,5</b></span><span>Consommation<b>188 kWh/an</b></span></div><p>Un SEER de 6,5 place cet exemple en A++ : 6,10 ≤ SEER &lt; 8,50. Les 188 kWh/an sont une consommation électrique conventionnelle.</p>`;
      return;
    }
    if(labelFocus==='heating'){
      const c=climates[activeClimate];
      detail.innerHTML=`<span class="detail-kicker">REPÈRES 7 À 10 · CHAUFFAGE</span><h3>${c.name} · colonne ${c.colour}</h3><div class="label-number-list"><span><b>7</b> pictogramme SCOP</span><span><b>8</b> classe saison chaude</span><span><b>9</b> classe saison moyenne</span><span><b>10</b> valeurs par saison</span></div><div class="detail-values"><span>Charge de calcul<b>${c.p}</b></span><span>SCOP<b>${c.scop}</b></span><span>Consommation<b>${c.energy}</b></span></div><p>Classe ${c.grade}. ${c.threshold}. Ne mélangez jamais le SCOP d’une colonne avec les kWh/an d’une autre.</p>`;
      return;
    }
    if(labelFocus==='climates'){
      detail.innerHTML=`<span class="detail-kicker">REPÈRE 11 · CARTE OFFICIELLE</span><h3>La couleur relie la carte à la colonne</h3><div class="climate-cards"><span class="warm"><b>ORANGE · CHAUDE</b><small>valeurs facultatives</small></span><span class="average"><b>VERTE · MOYENNE</b><small>valeurs obligatoires</small></span><span class="cold"><b>BLEUE · FROIDE</b><small>valeurs facultatives</small></span></div><p>Repérez la couleur de la région sur la vraie carte d’Europe, puis lisez la charge, le SCOP et les kWh/an dans la colonne de même couleur.</p>`;
      return;
    }
    detail.innerHTML=`<span class="detail-kicker">REPÈRES 5 ET 6 · PUISSANCE ACOUSTIQUE</span><h3>Deux unités, deux valeurs</h3><div class="detail-values sound-values"><span><b>5</b> · unité intérieure<strong>54 dB</strong></span><span><b>6</b> · unité extérieure<strong>64 dB</strong></span></div><p>L’étiquette donne un niveau de puissance acoustique. Ce n’est pas le niveau mesuré à une distance choisie avec un téléphone.</p>`;
  }

  function renderProject() {
    const cards=[ ["releves","Relevés","Dimensions, surfaces, débits et usages."], ["conditions","Conditions","Températures de base, consignes et humidité."], ["donnees","Données","U des parois, produits et documents techniques."], ["selection","Sélection","Capacité, plage de fonctionnement et performances."] ];
    return `<div class="lab"><div class="project-chain">${cards.map((card,index)=>`<article><small>ÉTAPE ${index+1}</small><b>${card[1]}</b><span>${card[2]}</span><button class="check-source ${projectChecks.has(card[0])?"checked":""}" data-check="${card[0]}" type="button" aria-pressed="${projectChecks.has(card[0])}">${projectChecks.has(card[0])?"✓ Origine notée":"Origine à noter"}</button></article>`).join("")}</div><div class="readouts"><span class="total wide">Traçabilité du projet<b id="project-score">${projectChecks.size}/4 sources préparées</b></span></div><p class="callout key"><b>La clé.</b> Une hypothèse doit être identifiée, justifiée et remplaçable. Sans origine, une valeur reste une devinette.</p></div>`;
  }
  function wireProject() { $$(".check-source").forEach(button=>button.addEventListener("click",()=>{ const key=button.dataset.check; if(projectChecks.has(key))projectChecks.delete(key);else projectChecks.add(key); button.classList.toggle("checked",projectChecks.has(key)); button.setAttribute("aria-pressed",String(projectChecks.has(key))); button.textContent=projectChecks.has(key)?"✓ Origine notée":"Origine à noter"; $("#project-score").textContent=`${projectChecks.size}/4 sources préparées`; })); }

  function quizMarkup() {
    if (quizIndex >= questions.length) {
      const passed = score >= 8;
      return `<div class="quiz-result"><b>${score}/10</b><h3>${passed ? "Objectif atteint" : "Quelques notions sont à reprendre"}</h3><p>Seuil pédagogique proposé : 8/10. ${passed ? "Vous distinguez le besoin, la puissance et les performances." : "Relisez les explications, puis recommencez le défi. Ce score n’est pas une évaluation officielle."}</p><button class="nav" id="quiz-restart" type="button">Refaire le défi</button></div>`;
    }
    const q=questions[quizIndex];
    return `<div class="quiz-wrap"><div class="quiz-head"><strong>Question ${quizIndex+1} sur ${questions.length}</strong><span>Score : ${score}</span></div><div class="quiz-progress" aria-label="Progression : question ${quizIndex+1} sur ${questions.length}">${questions.map((_,i)=>`<i class="${i<quizIndex?"done":i===quizIndex?"current":""}"></i>`).join("")}</div><p class="quiz-question">${q.q}</p><div class="quiz-options">${q.answers.map((answer,i)=>`<button class="quiz-option" data-answer="${i}" type="button">${answer}</button>`).join("")}</div><p class="quiz-feedback" id="quiz-feedback" role="status">Choisissez une réponse.</p></div>`;
  }
  function wireQuiz() {
    $$(".quiz-option").forEach(button=>button.addEventListener("click",()=>answerQuiz(Number(button.dataset.answer))));
    const restart=$("#quiz-restart"); if(restart)restart.addEventListener("click",()=>{quizIndex=0;score=0;answered=false;rerenderZone();});
  }
  function answerQuiz(choice) {
    if(answered)return; answered=true; const q=questions[quizIndex], correct=choice===q.good; if(correct)score+=1;
    $$(".quiz-option").forEach((button,i)=>{button.disabled=true;if(i===q.good)button.classList.add("good");else if(i===choice)button.classList.add("bad");});
    $("#quiz-feedback").innerHTML=`${correct?"✓ Correct.":"✗ À revoir."} ${q.why} <button class="nav" id="quiz-next" type="button">${quizIndex===questions.length-1?"Voir le résultat":"Question suivante"}</button>`;
    $("#quiz-next").addEventListener("click",()=>{quizIndex+=1;answered=false;rerenderZone();updateNavigation();});
  }

  function bindInputs(ids, callback) { ids.forEach(id=>{ const element=$("#"+id); if(element){ element.addEventListener("input",callback); element.addEventListener("change",callback); }}); }
  function rerenderZone() { const lesson=lessons[current]; $("#zone").innerHTML=lesson.render(); $("#zone").className=`interactive-zone ${lesson.zoneClass||""}`.trim(); if(lesson.wire)lesson.wire(); }

  function buildStepper() {
    $("#stepper").innerHTML=lessons.map((lesson,index)=>`<button type="button" data-step="${index}"><b>${index+1}</b><span>${lesson.short}</span></button>`).join("");
    $$("#stepper button").forEach(button=>button.addEventListener("click",()=>showLesson(Number(button.dataset.step),true)));
  }
  function showLesson(index, userNavigation) {
    stopSpeech();
    current=Math.max(0,Math.min(index,lessons.length-1));
    furthest=Math.max(furthest,current);
    const lesson=lessons[current];
    $("#kicker").textContent=lesson.kicker;
    $("#title").textContent=lesson.title;
    $("#lesson-text").textContent=lesson.text;
    rerenderZone();
    $$("#stepper button").forEach((button,i)=>{ button.classList.toggle("active",i===current); button.classList.toggle("done",i<furthest); if(i===current)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current"); });
    updateNavigation();
    if(userNavigation && autoplay && voiceEnabled) window.setTimeout(()=>speakCurrent(),350);
  }
  function updateNavigation() {
    $("#prev").disabled=current===0;
    const onQuiz=current===lessons.length-1, complete=quizIndex>=questions.length;
    $("#next").disabled=onQuiz&&!complete;
    $("#next").textContent=onQuiz?(complete?"Voir le bilan ↓":"Terminez le défi"):(current===lessons.length-2?"Continuer vers le défi →":"Continuer →");
    $("#status").textContent=`Étape ${current+1} sur ${lessons.length}`;
  }

  function enterCourse() { document.body.classList.remove("summary-running");document.body.classList.add("course-running");window.scrollTo(0,0); }
  function exitCourse() { stopSpeech();autoplay=false;document.body.classList.remove("course-running","summary-running");$("#module").scrollIntoView(); }
  function showSummary() { stopSpeech();document.body.classList.remove("course-running");document.body.classList.add("summary-running");window.scrollTo(0,0); }

  function loadRate() { try { const saved=Number(localStorage.getItem(rateKey)); const index=rates.indexOf(saved); if(index>=0)rateIndex=index; } catch (_) {} updateRateLabel(); }
  function saveRate() { try { localStorage.setItem(rateKey,String(rates[rateIndex])); } catch (_) {} }
  function updateRateLabel() { $("#speed-value").textContent=rates[rateIndex].toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+"×"; }
  function changeRate(delta) { rateIndex=Math.max(0,Math.min(rates.length-1,rateIndex+delta));updateRateLabel();saveRate();if(speaking||paused){stopSpeech();window.setTimeout(speakCurrent,80);} }

  function rankVoice(voice) {
    const name=voice.name.toLowerCase(), lang=(voice.lang||"").toLowerCase(); let score=0;
    if(lang==="fr-fr")score+=100;else if(lang.startsWith("fr"))score+=50;
    if(/natural|naturel|neural|online|google|microsoft/.test(name))score+=20;
    if(/denise|henri|julie|paul|hortense/.test(name))score+=8;
    return score;
  }
  function loadVoices() {
    if(!("speechSynthesis" in window))return;
    availableVoices=speechSynthesis.getVoices().filter(v=>(v.lang||"").toLowerCase().startsWith("fr")).sort((a,b)=>rankVoice(b)-rankVoice(a));
    const select=$("#voice-choice"), previous=selectedVoiceName||select.value;
    select.innerHTML='<option value="">Voix française automatique</option>'+availableVoices.map(v=>`<option value="${escapeHtml(v.name)}">${escapeHtml(v.name)} · ${escapeHtml(v.lang)}</option>`).join("");
    if(availableVoices.some(v=>v.name===previous)){select.value=previous;selectedVoiceName=previous;}
  }
  function escapeHtml(text) { return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function chosenVoice() { return availableVoices.find(v=>v.name===selectedVoiceName)||availableVoices[0]||speechSynthesis.getVoices().find(v=>(v.lang||"").toLowerCase()==="fr-fr")||speechSynthesis.getVoices()[0]; }
  function setListenState(state) {
    speaking=state==="speaking";paused=state==="paused";const button=$("#listen");button.setAttribute("aria-pressed",String(state!=="idle"));
    if(state==="speaking")button.innerHTML='<span aria-hidden="true">Ⅱ</span><b> Pause</b>';
    else if(state==="paused")button.innerHTML='<span aria-hidden="true">▶</span><b> Reprendre</b>';
    else button.innerHTML='<span aria-hidden="true">▶</span><b> Écouter</b>';
  }
  function stopSpeech() { speechRun+=1;if("speechSynthesis" in window)speechSynthesis.cancel();setListenState("idle"); }
  function speakCurrent() {
    if(!voiceEnabled)return;
    if(!("speechSynthesis" in window)){ $("#speech-warning").hidden=false; return; }
    stopSpeech(); const run=++speechRun, utterance=new SpeechSynthesisUtterance(`${lessons[current].title}. ${lessons[current].text}`), voice=chosenVoice();
    utterance.lang="fr-FR";utterance.rate=rates[rateIndex];utterance.pitch=1;if(voice)utterance.voice=voice;
    utterance.onstart=()=>{if(run===speechRun)setListenState("speaking");};
    utterance.onend=()=>{if(run===speechRun)setListenState("idle");};
    utterance.onerror=(event)=>{if(run!==speechRun||event.error==="canceled"||event.error==="interrupted")return;setListenState("idle");$("#speech-warning").hidden=false;};
    speechSynthesis.speak(utterance);
  }
  function toggleListen() { if(paused){speechSynthesis.resume();setListenState("speaking");return;} if(speaking){speechSynthesis.pause();setListenState("paused");return;} autoplay=true;speakCurrent(); }

  function init() {
    buildStepper();loadRate();showLesson(0,false);loadVoices();
    if("speechSynthesis" in window){speechSynthesis.addEventListener("voiceschanged",loadVoices);}else{$("#speech-warning").hidden=false;}
    $("#start").addEventListener("click",()=>{enterCourse();autoplay=voiceEnabled;showLesson(0,false);if(autoplay)window.setTimeout(speakCurrent,350);});
    $("#prev").addEventListener("click",()=>showLesson(current-1,true));
    $("#next").addEventListener("click",()=>{if(current===lessons.length-1){if(quizIndex>=questions.length)showSummary();}else showLesson(current+1,true);});
    $("#exit-course").addEventListener("click",exitCourse);
    $("#listen").addEventListener("click",toggleListen);
    $("#slower").addEventListener("click",()=>changeRate(-1));$("#faster").addEventListener("click",()=>changeRate(1));
    $("#voice-choice").addEventListener("change",event=>{selectedVoiceName=event.target.value;if(speaking||paused){stopSpeech();window.setTimeout(speakCurrent,80);}});
    $("#voice-toggle").addEventListener("click",()=>{voiceEnabled=!voiceEnabled;$("#voice-toggle").setAttribute("aria-pressed",String(voiceEnabled));$("#voice-toggle").textContent=voiceEnabled?"Voix active":"Voix coupée";if(!voiceEnabled){autoplay=false;stopSpeech();}});
    $("#refs-toggle").addEventListener("click",()=>{const refs=$("#refs"),open=refs.hidden;refs.hidden=!open;$("#refs-toggle").setAttribute("aria-expanded",String(open));if(open)refs.scrollIntoView({block:"start"});});
    $("#restart").addEventListener("click",()=>{quizIndex=0;score=0;answered=false;furthest=0;projectChecks=new Set();document.body.classList.remove("summary-running");enterCourse();showLesson(0,false);});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)stopSpeech();});
    window.addEventListener("beforeunload",stopSpeech);
    document.addEventListener("keydown",event=>{
      const tag=(event.target.tagName||"").toLowerCase(), interactive=/input|select|textarea|button/.test(tag);
      if(event.key==="Escape"&&(document.body.classList.contains("course-running")||document.body.classList.contains("summary-running"))){event.preventDefault();exitCourse();return;}
      if(!document.body.classList.contains("course-running")||interactive)return;
      if(event.key==="ArrowRight"){event.preventDefault();if(current<lessons.length-1)showLesson(current+1,true);}
      if(event.key==="ArrowLeft"){event.preventDefault();if(current>0)showLesson(current-1,true);}
      if(event.code==="Space"){event.preventDefault();toggleListen();}
    });
  }

  init();
})();
