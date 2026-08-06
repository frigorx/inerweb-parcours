"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const dossiers = [
  { id: "observer", titre: "Observer", court: "Observer", resume: "Givre, débit d’air et signes utiles." },
  { id: "degivrer", titre: "Dégivrer", court: "Dégivrer", resume: "Méthodes, conduit et cycle." },
  { id: "regler", titre: "Régler", court: "Régler", resume: "Sécurité, régulateur et pressostat." },
  { id: "verifier", titre: "Vérifier", court: "Vérifier", resume: "Inspection, relevé et rapport." },
  { id: "controle", titre: "Contrôle", court: "Contrôle", resume: "Cinq décisions corrigées." }
];

const quizAnswers = {};
let current = 0;
let furthest = 0;
let extractMode = false;
let activeScreens = [];
let selectedSequence = [];
let speechRun = 0;
let speaking = false;
let paused = false;
let autoplay = false;
let statusTimer = 0;
const voiceRates = [0.8, 0.95, 1.1, 1.25];
let rateIndex = safeStoredRateIndex();

function safeStoredRateIndex() {
  try {
    const raw = localStorage.getItem("evaporateur-voice-rate");
    if (raw === null) return 1;
    const stored = Number(raw);
    return Number.isInteger(stored) && stored >= 0 && stored < voiceRates.length ? stored : 1;
  } catch (_) {
    return 1;
  }
}

function saveRate() {
  try { localStorage.setItem("evaporateur-voice-rate", String(rateIndex)); } catch (_) { /* réglage de session */ }
}

function esc(value) {
  return String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

function screen(data) {
  return {
    niveau: "comprendre",
    prompt: "",
    print: data.text,
    render: renderStatement,
    wire: null,
    ...data
  };
}

const screens = [
  screen({
    id: "evaporateur-role",
    dossier: "observer",
    niveau: "decouvrir",
    short: "Position",
    title: "L’évaporateur est le point bas de la Croix du Frigoriste",
    text: "Il reçoit le fluide après le détendeur et absorbe la chaleur du milieu à refroidir. Ici, nous observons surtout l’air, le givre, les sécurités et les traces à consigner.",
    prompt: "Repérez la position basse avant d’aller plus loin.",
    codes: [],
    print: "Repère de contexte : détendeur à gauche, compresseur à droite, condenseur en haut et évaporateur en bas. Cet écran n’est pas compté comme preuve de couverture.",
    render: renderCross
  }),
  screen({
    id: "batterie-reelle",
    dossier: "observer",
    niveau: "decouvrir",
    short: "Reconnaître",
    title: "Une batterie, des ventilateurs et un bac : trois zones à voir",
    text: "La batterie échange la chaleur. Les ventilateurs font passer l’air. Le bac et son évacuation reçoivent l’eau issue de la condensation et du dégivrage.",
    prompt: "Associez chaque zone à sa fonction visible.",
    codes: [],
    print: "Reconnaître l’ensemble réel : batterie à ailettes, ventilateurs, bac et évacuation. La vue isolée aide à reconnaître l’organe ; elle n’est pas un plan constructeur.",
    render: renderRealUnit
  }),
  screen({
    id: "givre-naissance",
    dossier: "observer",
    niveau: "comprendre",
    short: "Naissance du givre",
    title: "Sous 0 °C, l’eau déposée sur la surface peut devenir du givre",
    text: "L’air apporte de l’humidité. Au contact d’une surface suffisamment froide, l’eau se dépose puis gèle. La température seule ne suffit pas à diagnostiquer : humidité et circulation d’air comptent aussi.",
    prompt: "Déplacez la température de l’air au contact de la batterie.",
    codes: [],
    print: "Le givre naît lorsque de l’eau se dépose puis gèle sur une surface froide. Température, humidité et circulation d’air doivent être lues ensemble.",
    render: renderFrostTemperature,
    wire: wireFrostTemperature
  }),
  screen({
    id: "givre-debit-air",
    dossier: "observer",
    niveau: "comprendre",
    short: "Débit d’air",
    title: "Le givre épaissi réduit le passage de l’air",
    text: "La couche de givre isole les ailettes et rétrécit le passage. L’échange baisse, la température devient instable et l’équipement doit travailler davantage.",
    prompt: "Comparez un débit normal, faible puis arrêté.",
    codes: ["8.11"],
    print: "Un givre installé réduit le débit d’air et le transfert de chaleur. Le contrôle porte sur la batterie, les ventilateurs et le chemin de l’air.",
    render: renderAirflow,
    wire: wireAirflow
  }),
  screen({
    id: "diagnostic-givre",
    dossier: "observer",
    niveau: "appliquer",
    short: "Interpréter",
    title: "Une batterie prise en glace ne donne pas, à elle seule, la cause",
    text: "Un défaut de débit d’air, une infiltration d’air humide, un réglage de dégivrage, un écoulement ou une alimentation en fluide peuvent produire des signes proches.",
    prompt: "Choisissez la première conclusion professionnelle.",
    codes: ["8.11"],
    print: "Ne pas conclure sur l’aspect seul. Commencer par vérifier débit d’air et dégivrage, puis élargir vers infiltration, écoulement et alimentation frigorifique.",
    render: renderFrostDiagnostic,
    wire: wireSingleChoice
  }),
  screen({
    id: "releve-normal",
    dossier: "observer",
    niveau: "appliquer",
    short: "Relevé",
    title: "Un relevé utile croise ce que l’on voit et ce que l’on mesure",
    text: "Aspect de la batterie, débit d’air, évacuation des condensats et historique du régulateur se lisent ensemble. Aucun voyant isolé ne suffit.",
    prompt: "Cochez les quatre familles d’observations.",
    codes: ["8.10", "8.11"],
    print: "Relevé minimal : état de surface, débit d’air et ventilateurs, bac/évacuation, réglages et alarmes. Les mesures se comparent à la documentation du matériel.",
    render: () => renderChecklist([
      ["surface", "Surface", "givre, glace, encrassement, corrosion"],
      ["air", "Air", "ventilateurs et passage libre"],
      ["eau", "Eau", "bac, pente et évacuation"],
      ["commande", "Commande", "cycle, capteurs et alarmes"]
    ], "releve"),
    wire: () => wireChecklist("releve")
  }),

  screen({
    id: "degivrage-role",
    dossier: "degivrer",
    niveau: "comprendre",
    short: "Pourquoi",
    title: "Le dégivrage retire un obstacle, il ne produit pas du froid",
    text: "Il rend à la batterie son passage d’air et sa capacité d’échange. Trop tard, la glace étouffe l’évaporateur ; permanent ou excessif, il consomme et réchauffe inutilement.",
    prompt: "Comparez les trois états du cycle.",
    codes: ["8.11"],
    print: "Le dégivrage remet la batterie en état d’échanger. Il doit être suffisant, mais ni permanent ni inutilement long ou fréquent.",
    render: renderDefrostRole,
    wire: wireAirflow
  }),
  screen({
    id: "degivrage-methodes",
    dossier: "degivrer",
    niveau: "comprendre",
    short: "Méthodes",
    title: "Air, résistance ou gaz chaud : trois moyens, un même objectif",
    text: "La méthode dépend de l’installation et de son usage. Le technicien identifie celle qui existe, puis suit sa documentation au lieu d’appliquer une durée universelle.",
    prompt: "Ouvrez chaque méthode pour voir son principe.",
    codes: [],
    print: "Méthodes citées dans la fiche g8b : air, résistance électrique et gaz chaud. Le choix, la séquence et les valeurs suivent la conception et la notice de l’installation.",
    render: renderDefrostMethods,
    wire: wireDefrostMethods
  }),
  screen({
    id: "conduit-air-chaud",
    dossier: "degivrer",
    niveau: "appliquer",
    short: "Conduit",
    title: "Le conduit de dégivrage à l’air chaud s’inspecte, il ne se suppose pas",
    text: "Cherchez une perte d’étanchéité, une isolation abîmée et un écoulement des condensats dégradé. Une anomalie visible doit entrer dans le rapport.",
    prompt: "Marquez les trois contrôles à effectuer.",
    codes: ["8.06", "8.10"],
    print: "Inspection du conduit de dégivrage à l’air chaud : étanchéité, isolation et évacuation des condensats. Décrire toute dégradation dans le rapport d’état.",
    render: () => renderChecklist([
      ["etancheite", "Étanchéité", "jonctions, fissures, fuites d’air"],
      ["isolation", "Isolation", "décollement, humidité, écrasement"],
      ["condensats", "Condensats", "pente, bac et écoulement libre"]
    ], "conduit"),
    wire: () => wireChecklist("conduit")
  }),
  screen({
    id: "minuterie-reglage",
    dossier: "degivrer",
    niveau: "appliquer",
    short: "Minuterie",
    title: "Régler un cycle, c’est éviter deux excès",
    text: "Un cycle trop rare ou trop court laisse la glace. Un cycle trop fréquent ou trop long pénalise l’énergie et peut perturber la température. Les valeurs réelles restent propres à l’installation.",
    prompt: "Réglez la fréquence et la durée dans ce modèle qualitatif.",
    codes: ["8.11"],
    print: "Modèle qualitatif : trop rare/court = glace résiduelle ; trop fréquent/long = dépense et réchauffement inutiles. Régler selon la notice, les capteurs et les conditions d’usage.",
    render: renderTimer,
    wire: wireTimer
  }),
  screen({
    id: "egouttement-reprise",
    dossier: "degivrer",
    niveau: "appliquer",
    short: "Reprise",
    title: "La fonte doit avoir le temps de s’évacuer avant la reprise",
    text: "Dans ce modèle, on arrête la production de froid, on dégivre, on laisse l’eau partir, puis on relance. La séquence exacte et la commande des ventilateurs restent celles du constructeur.",
    prompt: "Remettez les quatre phases dans l’ordre.",
    codes: ["8.11"],
    print: "Ordre pédagogique : arrêt de la production de froid, dégivrage, évacuation de l’eau, reprise commandée. La logique réelle dépend du contrôleur et de la notice.",
    render: renderSequence,
    wire: wireSequence
  }),

  screen({
    id: "securite-avant",
    dossier: "regler",
    niveau: "appliquer",
    short: "Avant d’agir",
    title: "Avant toute intervention : consigner l’électricité et maîtriser la pression",
    text: "La mise en pression de contrôle se fait à l’azote seul. Jamais d’oxygène, jamais d’air comprimé. Toute intervention électrique commence par la consignation.",
    prompt: "Choisissez la préparation conforme.",
    codes: ["8.03", "8.04"],
    print: "Sécurité : consignation électrique avant intervention ; azote seul pour la mise en pression de contrôle ; jamais oxygène ni air comprimé.",
    render: renderSafetyChoice,
    wire: wireSingleChoice
  }),
  screen({
    id: "regulateur-role",
    dossier: "regler",
    niveau: "comprendre",
    short: "Régulateur",
    title: "Le régulateur maintient une pression d’évaporation minimale",
    text: "Placée en sortie d’évaporateur, cette soupape mécanique protège le produit ou équilibre plusieurs évaporateurs. Elle ne coupe pas l’alimentation électrique.",
    prompt: "Sélectionnez la cible fournie par la documentation.",
    codes: ["8.02", "8.07"],
    print: "Fonction officielle : mettre au point/régler le régulateur ou la soupape de pression d’évaporation. Il maintient une pression minimale ; la consigne vient du constructeur.",
    render: renderRegulator,
    wire: wireRegulator
  }),
  screen({
    id: "regulateur-vs-pressostat",
    dossier: "regler",
    niveau: "comprendre",
    short: "Ne pas confondre",
    title: "Le régulateur module ; le pressostat commute",
    text: "Le régulateur agit mécaniquement sur la pression d’évaporation. Le pressostat est un interrupteur de contrôle ou de sécurité : il agit sur la commande électrique.",
    prompt: "Lisez les deux fonctions côte à côte.",
    codes: ["8.04", "8.07"],
    print: "Régulateur : module la pression et ne coupe pas le courant. Pressostat : interrupteur de contrôle/sécurité qui agit sur la commande électrique.",
    render: renderRoles
  }),
  screen({
    id: "reglage-constructeur",
    dossier: "regler",
    niveau: "appliquer",
    short: "Méthode",
    title: "Un réglage professionnel suit une boucle vérifiable",
    text: "Identifier l’organe, lire sa notice, mesurer, ajuster puis contrôler à nouveau. Sans modèle ni documentation, on ne transforme pas une valeur habituelle en consigne universelle.",
    prompt: "Construisez la boucle de réglage.",
    codes: ["8.02", "8.04", "8.07"],
    print: "Boucle de réglage : identifier l’organe ; relever le modèle et la notice ; mesurer ; ajuster ; contrôler à nouveau ; consigner le résultat.",
    render: () => renderChecklist([
      ["identifier", "1 · Identifier", "fonction, modèle, emplacement"],
      ["documenter", "2 · Documenter", "notice et consigne attendue"],
      ["mesurer", "3 · Mesurer", "instrument et unité adaptés"],
      ["ajuster", "4 · Ajuster", "progressivement, sans estimation"],
      ["controler", "5 · Recontrôler", "état stable et résultat écrit"]
    ], "reglage"),
    wire: () => wireChecklist("reglage")
  }),
  screen({
    id: "mise-en-service",
    dossier: "regler",
    niveau: "appliquer",
    short: "Mise en service",
    title: "Installer correctement, c’est penser à l’organe et à ses sécurités",
    text: "Fixation, raccords, matériel de contrôle, sécurité et absence de fuite forment un seul ensemble. Une belle batterie avec un raccord ou un câble douteux n’est pas une installation finie.",
    prompt: "Validez tous les volets avant la mise en fonctionnement.",
    codes: ["8.03", "8.04"],
    print: "Mise en service : fixation et raccords, matériel de contrôle, sécurités, câblage consigné puis vérifié, contrôle d’absence de fuite et remise en fonctionnement conforme.",
    render: () => renderChecklist([
      ["fixation", "Fixation", "support stable et accès maintenable"],
      ["raccords", "Raccords", "position et étanchéité contrôlées"],
      ["securites", "Sécurités", "présentes, réglées selon la notice"],
      ["controle", "Contrôle final", "aucune fuite ni émission"]
    ], "mise-service"),
    wire: () => wireChecklist("mise-service")
  }),

  screen({
    id: "inspection-surface",
    dossier: "verifier",
    niveau: "appliquer",
    short: "Surface",
    title: "Inspecter la surface, les ventilateurs et le bac",
    text: "Une inspection visuelle cherche ce qui gêne l’échange ou prépare une fuite : givre installé, encrassement, corrosion, fixation, ventilateur, eau qui stagne.",
    prompt: "Touchez les trois repères de la vue.",
    codes: ["8.11"],
    print: "Inspection visuelle : surface/batterie, ventilateurs et passage d’air, bac/évacuation. Rechercher givre durable, encrassement, corrosion, fixation et stagnation d’eau.",
    render: renderHotspots,
    wire: wireHotspots
  }),
  screen({
    id: "inspection-conduit",
    dossier: "verifier",
    niveau: "appliquer",
    short: "Conduit",
    title: "Une anomalie de dégivrage se cherche sur tout le chemin de l’eau et de l’air",
    text: "Le contrôle ne s’arrête pas à la glace. Il suit le conduit, l’isolation, le bac, la pente, l’évacuation et les commandes qui terminent le cycle.",
    prompt: "Ouvrez chaque famille de causes avant de conclure.",
    codes: ["8.06", "8.10"],
    print: "Pour un défaut de dégivrage, inspecter conduit/isolation, bac/pente/évacuation, capteurs/commande et état des ventilateurs. Ne pas attribuer la cause à la seule glace visible.",
    render: renderInspectionFamilies,
    wire: wireInspectionFamilies
  }),
  screen({
    id: "interpretation-releve",
    dossier: "verifier",
    niveau: "appliquer",
    short: "Conclusion",
    title: "Le bon relevé mène à une action, pas à un diagnostic précipité",
    text: "Décrivez le signe, indiquez le risque, puis nommez le contrôle suivant. Le rapport sépare ainsi ce qui est observé de ce qui reste à confirmer.",
    prompt: "Choisissez un relevé et lisez la conclusion prudente.",
    codes: ["8.10", "8.11"],
    print: "Forme attendue : observation factuelle ; risque pour le fonctionnement ou l’étanchéité ; contrôle suivant ; action immédiate si la sécurité l’exige.",
    render: renderReadings,
    wire: wireReadings
  }),
  screen({
    id: "rapport-etat",
    dossier: "verifier",
    niveau: "evaluer",
    short: "Rapport",
    title: "Un rapport utile décrit, alerte et propose la suite",
    text: "Écrivez ce qui est vu, le risque associé et la mesure à prendre. Évitez « RAS » si aucun contrôle précis n’est nommé.",
    prompt: "Composez un constat à partir des observations proposées.",
    codes: ["8.10"],
    print: "Rapport d’état : identification de l’équipement, observations, mesures et unités, anomalies, risque de dommage/fuite/émission, action ou contrôle recommandé, date et intervenant selon la procédure de l’organisme.",
    render: renderReport,
    wire: wireReport
  }),

  screen({
    id: "quiz-givre",
    dossier: "controle",
    niveau: "evaluer",
    short: "Question 1",
    title: "Contrôle 1 · Givre et débit d’air",
    text: "Une batterie est prise en glace et l’air passe mal. Quelle conclusion est la plus professionnelle ?",
    prompt: "Choisissez une réponse, puis lisez la correction.",
    codes: ["8.11"],
    quiz: {
      answers: ["Ajouter immédiatement du fluide", "Vérifier d’abord le débit d’air et le dégivrage, puis élargir le diagnostic", "Laisser le dégivrage actif en permanence"],
      correct: 1,
      explanation: "Le signe ne donne pas une cause unique. Débit d’air et dégivrage se contrôlent d’abord ; infiltration, drainage et alimentation frigorifique restent possibles."
    },
    render: renderQuiz,
    wire: wireQuiz
  }),
  screen({
    id: "quiz-degivrage",
    dossier: "controle",
    niveau: "evaluer",
    short: "Question 2",
    title: "Contrôle 2 · Cycle de dégivrage",
    text: "Lors de l’inspection du conduit de dégivrage à l’air chaud, quel trio faut-il contrôler ?",
    prompt: "Choisissez une réponse, puis lisez la correction.",
    codes: ["8.06"],
    quiz: {
      answers: ["La couleur, le bruit et la marque", "L’étanchéité, l’isolation et l’écoulement des condensats", "Seulement la durée affichée sur le régulateur"],
      correct: 1,
      explanation: "Le conduit s’inspecte sur tout son trajet : étanchéité, isolation et évacuation des condensats. Toute anomalie visible entre dans le rapport."
    },
    render: renderQuiz,
    wire: wireQuiz
  }),
  screen({
    id: "quiz-regulation",
    dossier: "controle",
    niveau: "evaluer",
    short: "Question 3",
    title: "Contrôle 3 · Régulateur ou pressostat",
    text: "Quel organe maintient une pression d’évaporation minimale sans couper l’électricité ?",
    prompt: "Choisissez une réponse, puis lisez la correction.",
    codes: ["8.02", "8.04", "8.07"],
    quiz: {
      answers: ["Le pressostat BP", "Le régulateur de pression d’évaporation", "Le disjoncteur"],
      correct: 1,
      explanation: "Le régulateur module mécaniquement la pression. Le pressostat est un interrupteur de contrôle ou de sécurité."
    },
    render: renderQuiz,
    wire: wireQuiz
  }),
  screen({
    id: "quiz-installation",
    dossier: "controle",
    niveau: "evaluer",
    short: "Question 4",
    title: "Contrôle 4 · Avant d’intervenir",
    text: "Quelle préparation respecte les deux protections essentielles rappelées ici ?",
    prompt: "Choisissez une réponse, puis lisez la correction.",
    codes: ["8.03", "8.04"],
    quiz: {
      answers: ["Air comprimé et arrêt au bouton", "Oxygène et gants", "Azote seul pour la pression de contrôle et consignation électrique"],
      correct: 2,
      explanation: "Azote seul pour la mise en pression de contrôle ; consignation électrique avant intervention. Oxygène et air comprimé sont interdits."
    },
    render: renderQuiz,
    wire: wireQuiz
  }),
  screen({
    id: "quiz-rapport",
    dossier: "controle",
    niveau: "evaluer",
    short: "Question 5",
    title: "Contrôle 5 · Rapport d’état",
    text: "Quel constat aide réellement la maintenance suivante ?",
    prompt: "Choisissez une réponse, puis lisez la correction.",
    codes: ["8.10"],
    quiz: {
      answers: ["RAS", "Bac avec eau stagnante observée ; évacuation à contrôler avant remise en service", "Évaporateur probablement vieux"],
      correct: 1,
      explanation: "Le constat sépare l’observation de l’action à mener. Il évite le jugement vague et permet une reprise vérifiable."
    },
    render: renderQuiz,
    wire: wireQuiz
  }),
  screen({
    id: "bilan",
    dossier: "controle",
    niveau: "evaluer",
    short: "Bilan",
    title: "Bilan du contrôle",
    text: "Le seuil pédagogique est de 4 réponses justes sur 5. Ce contrôle entraîne et corrige ; il ne remplace pas l’épreuve officielle ni la validation sur matériel réel.",
    prompt: "Relisez les points fragiles ou recommencez le contrôle.",
    codes: [],
    print: "Synthèse hors preuve de couverture : observer avant de conclure ; régler selon la notice ; distinguer régulateur et pressostat ; inspecter le chemin du dégivrage ; rédiger un constat factuel.",
    render: renderScore,
    wire: wireScore
  })
];

const quizScreens = screens.filter(item => item.quiz);

function renderStatement(item) {
  return `<div class="activity-inner"><div class="hero-statement"><strong>${esc(item.short)}</strong><span>${esc(item.print)}</span></div></div>`;
}

function renderCross() {
  return `<div class="activity-inner">
    <div class="cross-placement" role="img" aria-label="Croix du Frigoriste : condenseur en haut, compresseur à droite, évaporateur en bas et détendeur à gauche.">
      <span class="cross-label top">Condenseur<br>EN HAUT</span>
      <span class="cross-label right">Compresseur<br>À DROITE</span>
      <span class="cross-label left">Détendeur<br>À GAUCHE</span>
      <img class="cross-symbol" src="symboles/echangeur_a_air.svg" alt="">
      <span class="cross-label bottom">Évaporateur<br>EN BAS</span>
    </div>
  </div>`;
}

function renderRealUnit() {
  return `<div class="activity-inner photo-layout">
    <figure class="equipment-photo"><img src="images/evaporateur-air.webp" alt="Évaporateur à air isolé, avec batterie, deux ventilateurs et bac inférieur."><figcaption>Vue isolée de reconnaissance · pas un plan constructeur.</figcaption></figure>
    <div class="feature-list"><span>Batterie · échange</span><span>Ventilateurs · débit d’air</span><span>Bac · eau et dégivrage</span></div>
  </div>`;
}

function coilMarkup(id = "coil", frost = 2, air = 1) {
  return `<div class="coil-stage" id="${id}" style="--frost:${frost};--air:${air}">
    <div class="airflow" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="coil"><span class="frost-layer"></span></div>
    <span class="coil-caption">modèle visuel qualitatif</span>
  </div>`;
}

function renderFrostTemperature() {
  return `<div class="activity-inner simulator-grid">
    ${coilMarkup("temperature-coil", 0, 1)}
    <div class="control-stack">
      <label for="air-temperature">Air au contact de la batterie</label>
      <span class="reading-value" id="air-temperature-value">+4 °C</span>
      <input id="air-temperature" type="range" min="-8" max="8" step="1" value="4" aria-describedby="temperature-feedback">
      <div class="scale-row"><span>−8 °C</span><span>0 °C</span><span>+8 °C</span></div>
      <div class="state-box neutral" id="temperature-feedback"><b>Observation</b> Déplacez le curseur.</div>
      <p class="qualifier">Cette animation n’est ni un calcul de charge ni un réglage chantier.</p>
    </div>
  </div>`;
}

function wireFrostTemperature() {
  const input = $("#air-temperature");
  const update = () => {
    const value = Number(input.value);
    $("#air-temperature-value").textContent = `${value > 0 ? "+" : ""}${value} °C`;
    const coil = $("#temperature-coil");
    const feedback = $("#temperature-feedback");
    const frost = value < 0 ? Math.min(4, Math.ceil(Math.abs(value) / 2)) : 0;
    coil.style.setProperty("--frost", frost);
    feedback.className = `state-box ${value < 0 ? "pending" : "neutral"}`;
    feedback.innerHTML = value < 0
      ? "<b>Vigilance · givre possible</b> Sous 0 °C, l’eau déposée peut geler. Il faut encore lire humidité et débit d’air."
      : value === 0
        ? "<b>En attente · point de bascule</b> Une seule température ne suffit pas à conclure."
        : "<b>Observation · pas de givre montré</b> Dans ce modèle, l’air au contact reste au-dessus de 0 °C.";
  };
  input.addEventListener("input", update);
  update();
}

function renderAirflow() {
  return `<div class="activity-inner simulator-grid">
    ${coilMarkup("airflow-coil", 1, 1)}
    <div class="control-stack">
      <label>État du passage d’air</label>
      <div class="segmented" role="group" aria-label="Choisir le débit d’air">
        <button type="button" data-air="normal" aria-pressed="true">Normal</button>
        <button type="button" data-air="faible" aria-pressed="false">Faible</button>
        <button type="button" data-air="arrete" aria-pressed="false">Arrêté</button>
      </div>
      <div class="state-box correct" id="airflow-feedback"><b>Correct · échange possible</b> Le passage reste libre et les ventilateurs déplacent l’air.</div>
    </div>
  </div>`;
}

function wireAirflow() {
  $$('[data-air]').forEach(button => button.addEventListener("click", () => {
    $$('[data-air]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    const state = button.dataset.air;
    const coil = $("#airflow-coil");
    const feedback = $("#airflow-feedback");
    const config = {
      normal: [1, 1, "correct", "Correct · passage libre", "L’échange peut se faire ; le reste des contrôles demeure nécessaire."],
      faible: [3, .45, "pending", "Fragile · débit réduit", "Le givre et les obstacles réduisent l’échange. Cherchez la cause avant de régler."],
      arrete: [4, .06, "error", "Erreur · air arrêté", "La batterie peut se couvrir de glace et la température devenir instable."]
    }[state];
    coil.style.setProperty("--frost", config[0]);
    coil.style.setProperty("--air", config[1]);
    feedback.className = `state-box ${config[2]}`;
    feedback.innerHTML = `<b>${config[3]}</b> ${config[4]}`;
  }));
}

function renderFrostDiagnostic() {
  return `<div class="activity-inner quiz-wrap">
    <p class="quiz-question">Batterie prise en glace + débit d’air faible : que faites-vous d’abord ?</p>
    <div class="choice-grid">
      <button class="choice-button" type="button" data-choice="wrong">Ajouter du fluide sans mesurer</button>
      <button class="choice-button" type="button" data-choice="correct">Contrôler débit d’air et dégivrage, puis élargir</button>
      <button class="choice-button" type="button" data-choice="wrong">Laisser dégivrer en permanence</button>
      <button class="choice-button" type="button" data-choice="wrong">Conclure que le compresseur est cassé</button>
    </div>
    <div class="state-box neutral quiz-feedback" data-choice-feedback><b>Observation</b> Un signe visible doit conduire à des contrôles, pas à une pièce remplacée au hasard.</div>
  </div>`;
}

function wireSingleChoice() {
  $$('[data-choice]').forEach(button => button.addEventListener("click", () => {
    const correct = button.dataset.choice === "correct";
    $$('[data-choice]').forEach(other => {
      other.disabled = true;
      if (other.dataset.choice === "correct") other.classList.add("correct");
      if (other === button && !correct) other.classList.add("wrong");
    });
    const feedback = $('[data-choice-feedback]');
    feedback.className = `state-box ${correct ? "correct" : "error"} quiz-feedback`;
    feedback.innerHTML = correct
      ? "<b>Correct</b> Vous partez des contrôles simples et observables avant d’élargir."
      : "<b>À revoir</b> L’aspect seul ne prouve ni une charge incorrecte ni une panne du compresseur.";
  }));
}

function renderChecklist(items, name) {
  return `<div class="activity-inner">
    <div class="inspection-grid">${items.map(([id, title, copy]) => `<button class="inspection-item" type="button" data-checklist="${name}" data-item="${id}" aria-pressed="false"><b>${title}</b><span>${copy}</span></button>`).join("")}</div>
    <div class="state-box pending" id="${name}-feedback"><b>En attente</b> Ouvrez chaque contrôle.</div>
  </div>`;
}

function wireChecklist(name) {
  const buttons = $$(`[data-checklist="${name}"]`);
  const feedback = $(`#${name}-feedback`);
  buttons.forEach(button => button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!pressed));
    const count = buttons.filter(item => item.getAttribute("aria-pressed") === "true").length;
    const complete = count === buttons.length;
    feedback.className = `state-box ${complete ? "correct" : "pending"}`;
    feedback.innerHTML = complete
      ? "<b>Correct · contrôle complet</b> Les familles d’observations sont toutes présentes."
      : `<b>En attente · ${count}/${buttons.length}</b> Il reste au moins un volet à examiner.`;
  }));
}

function renderDefrostRole() {
  return `<div class="activity-inner simulator-grid">
    ${coilMarkup("airflow-coil", 3, .45)}
    <div class="control-stack">
      <label>État de la batterie</label>
      <div class="segmented" role="group" aria-label="Choisir un état de batterie">
        <button type="button" data-air="faible" aria-pressed="true">Givre installé</button>
        <button type="button" data-air="normal" aria-pressed="false">Après dégivrage</button>
        <button type="button" data-air="arrete" aria-pressed="false">Sans reprise</button>
      </div>
      <div class="state-box pending" id="airflow-feedback"><b>Fragile · échange réduit</b> Le givre limite l’air et l’évaporateur travaille moins bien.</div>
    </div>
  </div>`;
}

function renderDefrostMethods() {
  return `<div class="activity-inner">
    <div class="symbol-row">
      <span class="symbol-card"><img src="symboles/echangeur_a_air.svg" alt=""><b>Air</b></span>
      <span class="symbol-card"><img src="symboles/resistance_evaporation.svg" alt=""><b>Résistance</b></span>
      <span class="symbol-card"><img src="symboles/echangeur_a_air.svg" alt=""><b>Gaz chaud</b></span>
    </div>
    <div class="method-tabs" role="group" aria-label="Méthodes de dégivrage">
      <button type="button" data-method="air" aria-pressed="true">Air</button>
      <button type="button" data-method="electric" aria-pressed="false">Résistance</button>
      <button type="button" data-method="gas" aria-pressed="false">Gaz chaud</button>
    </div>
    <div class="method-copy" id="method-copy"><b>Air</b> La production de froid s’arrête et l’air disponible fournit la chaleur, lorsque l’application le permet.</div>
  </div>`;
}

function wireDefrostMethods() {
  const copy = {
    air: ["Air", "La production de froid s’arrête et l’air disponible fournit la chaleur, lorsque l’application le permet."],
    electric: ["Résistance électrique", "Une source de chaleur intégrée fait fondre le givre. La commande, la terminaison et la sécurité suivent la notice."],
    gas: ["Gaz chaud", "Le circuit prévu envoie un gaz chaud dans l’évaporateur. Le montage et la séquence sont propres à l’installation."]
  };
  $$('[data-method]').forEach(button => button.addEventListener("click", () => {
    $$('[data-method]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    const [title, text] = copy[button.dataset.method];
    $("#method-copy").innerHTML = `<b>${title}</b> ${text}`;
  }));
}

function renderTimer() {
  return `<div class="activity-inner timer-grid">
    <div class="timer-control"><b>Fréquence</b><div class="segmented" role="group" aria-label="Fréquence qualitative"><button type="button" data-frequency="rare" aria-pressed="false">Rare</button><button type="button" data-frequency="balanced" aria-pressed="true">Adaptée</button><button type="button" data-frequency="frequent" aria-pressed="false">Fréquente</button></div></div>
    <div class="timer-control"><b>Durée</b><div class="segmented" role="group" aria-label="Durée qualitative"><button type="button" data-duration="short" aria-pressed="false">Courte</button><button type="button" data-duration="balanced" aria-pressed="true">Suffisante</button><button type="button" data-duration="long" aria-pressed="false">Longue</button></div></div>
    <div class="state-box correct timer-result" id="timer-feedback"><b>Correct · équilibre pédagogique</b> La glace disparaît sans prolonger inutilement le dégivrage.</div>
    <p class="source-note">Les mots « adaptée » et « suffisante » ne sont pas des valeurs chantier. La notice, les capteurs et les conditions d’usage fixent les réglages réels.</p>
  </div>`;
}

function wireTimer() {
  let frequency = "balanced";
  let duration = "balanced";
  const update = () => {
    const feedback = $("#timer-feedback");
    if (frequency === "balanced" && duration === "balanced") {
      feedback.className = "state-box correct timer-result";
      feedback.innerHTML = "<b>Correct · équilibre pédagogique</b> La glace disparaît sans prolonger inutilement le dégivrage.";
    } else if (frequency === "rare" || duration === "short") {
      feedback.className = "state-box error timer-result";
      feedback.innerHTML = "<b>À revoir · glace résiduelle possible</b> Un cycle trop rare ou trop court peut laisser la batterie obstruée.";
    } else {
      feedback.className = "state-box pending timer-result";
      feedback.innerHTML = "<b>Fragile · excès possible</b> Trop fréquent ou trop long, le cycle consomme et réchauffe inutilement.";
    }
  };
  $$('[data-frequency]').forEach(button => button.addEventListener("click", () => {
    frequency = button.dataset.frequency;
    $$('[data-frequency]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    update();
  }));
  $$('[data-duration]').forEach(button => button.addEventListener("click", () => {
    duration = button.dataset.duration;
    $$('[data-duration]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    update();
  }));
}

function renderSequence() {
  selectedSequence = [];
  return `<div class="activity-inner">
    <div class="sequence-row">
      <button class="sequence-button" type="button" data-sequence="drain"><b>?</b>Évacuer l’eau</button>
      <button class="sequence-button" type="button" data-sequence="stop"><b>?</b>Arrêter le froid</button>
      <button class="sequence-button" type="button" data-sequence="restart"><b>?</b>Reprendre</button>
      <button class="sequence-button" type="button" data-sequence="defrost"><b>?</b>Dégivrer</button>
    </div>
    <div class="state-box pending" id="sequence-feedback"><b>En attente</b> Sélectionnez les phases dans l’ordre du modèle.</div>
  </div>`;
}

function wireSequence() {
  const expected = ["stop", "defrost", "drain", "restart"];
  const buttons = $$('[data-sequence]');
  const feedback = $("#sequence-feedback");
  buttons.forEach(button => button.addEventListener("click", () => {
    if (button.classList.contains("selected")) return;
    selectedSequence.push(button.dataset.sequence);
    button.classList.add("selected");
    $("b", button).textContent = selectedSequence.length;
    const index = selectedSequence.length - 1;
    if (selectedSequence[index] !== expected[index]) {
      feedback.className = "state-box error";
      feedback.innerHTML = "<b>À revoir</b> Dans ce modèle, on arrête le froid avant de dégivrer, puis l’eau s’évacue avant la reprise.";
      setTimeout(() => {
        selectedSequence = [];
        buttons.forEach(item => { item.classList.remove("selected"); $("b", item).textContent = "?"; });
        feedback.className = "state-box pending";
        feedback.innerHTML = "<b>En attente</b> Recommencez la séquence.";
      }, 900);
      return;
    }
    if (selectedSequence.length === expected.length) {
      feedback.className = "state-box correct";
      feedback.innerHTML = "<b>Correct</b> L’eau a le temps de partir avant la reprise commandée.";
    }
  }));
}

function renderSafetyChoice() {
  return `<div class="activity-inner quiz-wrap">
    <p class="quiz-question">Quelle préparation ouvre le travail en sécurité ?</p>
    <div class="choice-grid">
      <button class="choice-button" type="button" data-choice="wrong">Arrêt au bouton + air comprimé</button>
      <button class="choice-button" type="button" data-choice="correct">Consignation électrique + azote seul</button>
      <button class="choice-button" type="button" data-choice="wrong">Gants + oxygène</button>
      <button class="choice-button" type="button" data-choice="wrong">Aucune, si l’évaporateur est froid</button>
    </div>
    <div class="state-box neutral quiz-feedback" data-choice-feedback><b>Observation</b> Deux énergies sont à maîtriser : l’électricité et la pression.</div>
  </div>`;
}

function renderRegulator() {
  return `<div class="activity-inner">
    <div class="symbol-row"><span class="symbol-card"><img src="symboles/echangeur_a_air.svg" alt=""><b>Évaporateur</b></span><span aria-hidden="true">→</span><span class="symbol-card"><b style="font-size:2.6rem">↕</b><b>Régulateur</b></span></div>
    <div class="segmented" role="group" aria-label="Choisir une cible de réglage">
      <button type="button" data-regulator="low" aria-pressed="false">Au plus bas</button>
      <button type="button" data-regulator="doc" aria-pressed="false">Cible de la notice</button>
      <button type="button" data-regulator="guess" aria-pressed="false">À l’habitude</button>
    </div>
    <div class="state-box pending" id="regulator-feedback"><b>En attente</b> Un réglage doit avoir une cible vérifiable.</div>
  </div>`;
}

function wireRegulator() {
  $$('[data-regulator]').forEach(button => button.addEventListener("click", () => {
    $$('[data-regulator]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    const correct = button.dataset.regulator === "doc";
    const feedback = $("#regulator-feedback");
    feedback.className = `state-box ${correct ? "correct" : "error"}`;
    feedback.innerHTML = correct
      ? "<b>Correct · cible documentée</b> On mesure, on ajuste, puis on vérifie l’état stabilisé."
      : "<b>À revoir · aucune valeur universelle</b> Ni le minimum absolu ni l’habitude ne remplacent la notice du modèle installé.";
  }));
}

function renderRoles() {
  return `<div class="activity-inner role-grid">
    <article class="role-card regulator"><img src="symboles/echangeur_a_air.svg" alt="" width="54" height="54"><b>Régulateur de pression d’évaporation</b><span>Soupape mécanique · maintient une pression minimale · protège le produit ou équilibre les évaporateurs · ne coupe pas le courant.</span></article>
    <article class="role-card switch"><img src="symboles/pressostat_bp.svg" alt="" width="54" height="54"><b>Pressostat BP</b><span>Interrupteur de contrôle/sécurité · agit sur la commande électrique · protège la machine selon sa fonction et son réglage.</span></article>
  </div>`;
}

function renderHotspots() {
  return `<div class="activity-inner equipment-inspection">
    <div class="hotspot-photo">
      <img src="images/evaporateur-air.webp" alt="Évaporateur à air avec trois repères interactifs.">
      <button class="hotspot" type="button" data-hotspot="battery" aria-label="Inspecter la batterie">1</button>
      <button class="hotspot" type="button" data-hotspot="fans" aria-label="Inspecter les ventilateurs">2</button>
      <button class="hotspot" type="button" data-hotspot="tray" aria-label="Inspecter le bac">3</button>
    </div>
    <div class="hotspot-copy">
      <div class="state-box pending" id="hotspot-feedback"><b>En attente · 0/3</b> Ouvrez les trois repères.</div>
      <p>1 · surface et ailettes<br>2 · ventilateurs et passage d’air<br>3 · bac et évacuation</p>
    </div>
  </div>`;
}

function wireHotspots() {
  const buttons = $$('[data-hotspot]');
  const descriptions = {
    battery: "Surface : cherchez givre durable, encrassement, corrosion et ailettes endommagées.",
    fans: "Ventilateurs : contrôlez rotation, obstacle et passage libre de l’air.",
    tray: "Bac : cherchez eau stagnante, salissure, corrosion et évacuation bouchée."
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    button.classList.add("active");
    const count = buttons.filter(item => item.classList.contains("active")).length;
    const feedback = $("#hotspot-feedback");
    feedback.className = `state-box ${count === buttons.length ? "correct" : "pending"}`;
    feedback.innerHTML = `<b>${count === buttons.length ? "Correct" : "En attente"} · ${count}/3</b> ${descriptions[button.dataset.hotspot]}`;
  }));
}

function renderInspectionFamilies() {
  return `<div class="activity-inner">
    <div class="method-tabs" role="group" aria-label="Familles de contrôle">
      <button type="button" data-inspection="conduit" aria-pressed="true">Conduit</button>
      <button type="button" data-inspection="water" aria-pressed="false">Eau</button>
      <button type="button" data-inspection="control" aria-pressed="false">Commande</button>
      <button type="button" data-inspection="air" aria-pressed="false">Air</button>
    </div>
    <div class="method-copy" id="inspection-copy"><b>Conduit et isolation</b> Chercher fuite d’air, jonction ouverte, écrasement ou isolation humide.</div>
    ${coilMarkup("inspection-coil", 3, .45)}
  </div>`;
}

function wireInspectionFamilies() {
  const copy = {
    conduit: ["Conduit et isolation", "Chercher fuite d’air, jonction ouverte, écrasement ou isolation humide."],
    water: ["Bac et évacuation", "Chercher eau stagnante, pente dégradée, bouchon ou regel après dégivrage."],
    control: ["Capteurs et commande", "Lire l’historique, la terminaison du cycle et les alarmes ; comparer à la notice."],
    air: ["Ventilateurs et chemin de l’air", "Chercher moteur arrêté, obstacle, produits trop proches ou glace qui ferme le passage."]
  };
  $$('[data-inspection]').forEach(button => button.addEventListener("click", () => {
    $$('[data-inspection]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    const [title, text] = copy[button.dataset.inspection];
    $("#inspection-copy").innerHTML = `<b>${title}</b> ${text}`;
  }));
}

function renderReadings() {
  return `<div class="activity-inner">
    <div class="method-tabs" role="group" aria-label="Choisir un relevé">
      <button type="button" data-reading="ice" aria-pressed="true">Glace + air faible</button>
      <button type="button" data-reading="water" aria-pressed="false">Eau dans le bac</button>
      <button type="button" data-reading="trip" aria-pressed="false">Sécurité déclenchée</button>
    </div>
    <div class="method-copy" id="reading-copy"><b>Observation</b> Batterie prise en glace, débit d’air faible.<br><b>Conclusion prudente</b> Échange dégradé ; vérifier ventilateurs et cycle de dégivrage avant d’élargir le diagnostic.</div>
    <div class="source-note"><b>Structure :</b> fait observé → risque → contrôle suivant. La cause n’est écrite que lorsqu’elle est confirmée.</div>
  </div>`;
}

function wireReadings() {
  const copy = {
    ice: ["Batterie prise en glace, débit d’air faible.", "Échange dégradé ; vérifier ventilateurs et cycle de dégivrage avant d’élargir le diagnostic."],
    water: ["Eau stagnante dans le bac après dégivrage.", "Risque de regel et de débordement ; contrôler pente, évacuation et chauffage prévu par l’installation."],
    trip: ["Interrupteur de sécurité déclenché.", "Ne pas réarmer au hasard ; identifier le déclenchement, consigner si nécessaire et contrôler selon la notice."]
  };
  $$('[data-reading]').forEach(button => button.addEventListener("click", () => {
    $$('[data-reading]').forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    const [observation, conclusion] = copy[button.dataset.reading];
    $("#reading-copy").innerHTML = `<b>Observation</b> ${observation}<br><b>Conclusion prudente</b> ${conclusion}`;
  }));
}

function renderReport() {
  return `<div class="activity-inner report-grid">
    <button class="report-item" type="button" data-report="ice" aria-pressed="false"><b>Givre installé</b><span>air réduit sur la batterie</span></button>
    <button class="report-item" type="button" data-report="water" aria-pressed="false"><b>Eau stagnante</b><span>bac non évacué</span></button>
    <button class="report-item" type="button" data-report="corrosion" aria-pressed="false"><b>Corrosion visible</b><span>zone à contrôler</span></button>
    <button class="report-item" type="button" data-report="normal" aria-pressed="false"><b>Débit d’air présent</b><span>ventilateurs en fonctionnement</span></button>
    <div class="report-output" id="report-output"><b>Rapport d’état</b><br>Sélectionnez une ou plusieurs observations.</div>
  </div>`;
}

function wireReport() {
  const phrases = {
    ice: "Givre installé observé avec passage d’air réduit ; cycle de dégivrage et ventilateurs à contrôler.",
    water: "Eau stagnante observée dans le bac ; pente et évacuation à contrôler avant remise en service.",
    corrosion: "Corrosion visible sur une zone de l’ensemble ; intégrité et risque de fuite à vérifier.",
    normal: "Ventilateurs en fonctionnement et débit d’air présent au moment du relevé."
  };
  const buttons = $$('[data-report]');
  const update = () => {
    const selected = buttons.filter(button => button.getAttribute("aria-pressed") === "true").map(button => phrases[button.dataset.report]);
    $("#report-output").innerHTML = selected.length
      ? `<b>Rapport d’état · observations</b><br>${selected.map(esc).join(" ")}`
      : "<b>Rapport d’état</b><br>Sélectionnez une ou plusieurs observations.";
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
    update();
  }));
}

function renderQuiz(item) {
  const answered = quizAnswers[item.id];
  return `<div class="activity-inner quiz-wrap" data-quiz="${item.id}">
    <p class="quiz-question">${esc(item.text)}</p>
    <div class="choice-grid">${item.quiz.answers.map((answer, index) => {
      let classes = "choice-button";
      if (answered && index === item.quiz.correct) classes += " correct";
      if (answered && index === answered.choice && !answered.correct) classes += " wrong";
      return `<button class="${classes}" type="button" data-quiz-choice="${index}" ${answered ? "disabled" : ""}>${esc(answer)}</button>`;
    }).join("")}</div>
    <div class="state-box ${answered ? (answered.correct ? "correct" : "error") : "neutral"} quiz-feedback" id="quiz-feedback">${answered
      ? `<b>${answered.correct ? "Correct" : "À revoir"}</b> ${esc(item.quiz.explanation)}`
      : "<b>En attente</b> Une seule réponse est attendue."}</div>
  </div>`;
}

function wireQuiz(item) {
  $$('[data-quiz-choice]').forEach(button => button.addEventListener("click", () => {
    if (quizAnswers[item.id]) return;
    const choice = Number(button.dataset.quizChoice);
    quizAnswers[item.id] = { choice, correct: choice === item.quiz.correct };
    renderCurrent(false);
  }));
}

function quizStats() {
  const answered = quizScreens.filter(item => quizAnswers[item.id]).length;
  const score = quizScreens.filter(item => quizAnswers[item.id]?.correct).length;
  return { answered, score };
}

function renderScore() {
  const { answered, score } = quizStats();
  if (answered < quizScreens.length) {
    return `<div class="activity-inner score-panel"><span class="score-value">${answered}/5</span><h3>Contrôle à terminer</h3><p>Répondez aux ${quizScreens.length - answered} question(s) restante(s) avant le bilan.</p><div class="score-actions"><button class="nav-button" id="first-unanswered" type="button">Reprendre le contrôle</button></div></div>`;
  }
  const success = score >= 4;
  return `<div class="activity-inner score-panel"><span class="score-value">${score}/5</span><h3>${success ? "Acquis pour ce contrôle" : "À reprendre"}</h3><div class="state-box ${success ? "correct" : "error"}"><b>${success ? "Seuil atteint" : "Seuil non atteint"} · 4/5</b> ${success ? "Vous reliez observation, réglage et rapport sans confondre les organes." : "Relisez les corrections : elles indiquent le dossier à reprendre."}</div><p>Entraînement pédagogique uniquement : ce résultat ne vaut pas attestation ni examen officiel.</p><div class="score-actions"><button class="nav-button secondary" id="restart-quiz" type="button">Refaire le contrôle</button><button class="nav-button" id="restart-module" type="button">Revoir depuis le début</button></div></div>`;
}

function wireScore() {
  $("#first-unanswered")?.addEventListener("click", () => {
    const item = quizScreens.find(question => !quizAnswers[question.id]);
    goToId(item.id);
  });
  $("#restart-quiz")?.addEventListener("click", () => {
    Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]);
    goToId(quizScreens[0].id);
  });
  $("#restart-module")?.addEventListener("click", () => {
    Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]);
    goToId(screens[0].id);
  });
}

function renderHome() {
  $("#dossier-grid").innerHTML = dossiers.map((dossier, index) => `<button class="dossier-card" type="button" data-open-dossier="${dossier.id}"><b>${index + 1}. ${dossier.titre}</b><span>${dossier.resume}</span></button>`).join("");
  $$('[data-open-dossier]').forEach(button => button.addEventListener("click", () => startCourse(button.dataset.openDossier)));
}

function startCourse(dossierId = "observer", screenNumber = 1) {
  extractMode = false;
  activeScreens = screens;
  const list = screens.filter(item => item.dossier === dossierId);
  const selected = list[Math.max(0, Math.min(list.length - 1, Number(screenNumber || 1) - 1))] || screens[0];
  current = screens.indexOf(selected);
  furthest = Math.max(furthest, current);
  showCourse();
  renderCurrent(false);
}

function startExtract(ids) {
  const unique = [];
  ids.forEach(id => {
    const item = screens.find(candidate => candidate.id === id);
    if (item && !unique.includes(item)) unique.push(item);
  });
  if (!unique.length) {
    showStatus("Aucun écran nommé n’a été trouvé. Le sommaire complet est affiché.");
    showHome();
    return;
  }
  extractMode = true;
  activeScreens = unique;
  current = 0;
  furthest = 0;
  showCourse();
  renderCurrent(false);
}

function showCourse() {
  $("#home").hidden = true;
  $("#course-shell").hidden = false;
  $("#exit-button").hidden = false;
  $("#home-button").hidden = false;
  $("#home-button").textContent = extractMode ? "Module entier" : "Sommaire";
  $("#mode-badge").textContent = extractMode ? `Extrait · ${activeScreens.length} écran${activeScreens.length > 1 ? "s" : ""}` : "Module complet";
  document.body.classList.add("course-running");
}

function showHome() {
  stopSpeech();
  extractMode = false;
  activeScreens = screens;
  $("#home").hidden = false;
  $("#course-shell").hidden = true;
  $("#exit-button").hidden = true;
  $("#home-button").hidden = true;
  $("#mode-badge").textContent = "Module complet";
  document.body.classList.remove("course-running", "summary-running");
  const url = new URL(location.href);
  url.search = "";
  history.replaceState({}, "", url);
}

function currentItem() { return activeScreens[current]; }

function renderCurrent(moveFocus = true) {
  stopSpeech(false);
  const item = currentItem();
  if (!item) return;
  furthest = Math.max(furthest, current);
  document.body.classList.toggle("summary-running", item.id === "bilan");
  $("#lesson-kicker").textContent = `${dossiers.find(dossier => dossier.id === item.dossier)?.titre || "Extrait"} · ${item.niveau}`;
  $("#lesson-title").textContent = item.title;
  $("#lesson-text").textContent = item.text;
  $("#action-prompt").textContent = item.prompt;
  $("#activity-zone").innerHTML = item.render(item);
  if (item.wire) item.wire(item);
  renderReference(item);
  renderStepper(item);
  renderNavigation(item);
  updateUrl(item);
  if (moveFocus) $("#lesson-title").focus({ preventScroll: true });
  if (autoplay) setTimeout(() => speakCurrent(), 350);
}

function renderReference(item) {
  $("#reference-box").innerHTML = item.codes.length
    ? `<b>référentiel</b> ${item.codes.map(code => `<span class="code-pill">${code}</span>`).join("")}`
    : "<b>contexte</b> · hors preuve de couverture";
}

function renderStepper(item) {
  const stepper = $("#stepper");
  if (extractMode) {
    stepper.innerHTML = activeScreens.map((screenItem, index) => `<button class="step-button ${index === current ? "active" : ""} ${index < furthest ? "done" : ""}" type="button" data-jump="${index}" ${index === current ? 'aria-current="step"' : ""}><b>${index + 1}. ${esc(screenItem.short)}</b><small>${esc(screenItem.dossier)}</small></button>`).join("");
  } else {
    stepper.innerHTML = dossiers.map(dossier => {
      const firstIndex = screens.findIndex(screenItem => screenItem.dossier === dossier.id);
      const lastIndex = screens.reduce((found, screenItem, index) => screenItem.dossier === dossier.id ? index : found, firstIndex);
      const active = item.dossier === dossier.id;
      const done = furthest > lastIndex;
      return `<button class="step-button ${active ? "active" : ""} ${done ? "done" : ""}" type="button" data-jump="${firstIndex}" ${active ? 'aria-current="step"' : ""}><b>${esc(dossier.court)}</b><small>${screens.filter(screenItem => screenItem.dossier === dossier.id).length} écrans</small></button>`;
    }).join("");
  }
  $$('[data-jump]').forEach(button => button.addEventListener("click", () => goTo(Number(button.dataset.jump))));
  $("#rail-mode").textContent = extractMode ? "EXTRAIT" : "PARCOURS";
  $("#rail-progress").textContent = `${current + 1} / ${activeScreens.length}`;
  $("#progress-bar").style.width = `${((current + 1) / activeScreens.length) * 100}%`;
  $("#progress-copy").textContent = extractMode ? "Navigation réduite" : dossiers.find(dossier => dossier.id === item.dossier)?.resume || "";
}

function renderNavigation(item) {
  const previous = $("#prev-button");
  const next = $("#next-button");
  previous.disabled = current === 0;
  next.disabled = false;
  if (current === activeScreens.length - 1) next.textContent = extractMode ? "Module entier →" : "Terminer";
  else if (activeScreens[current + 1]?.id === "bilan") next.textContent = "Voir le bilan →";
  else next.textContent = "Suivant →";
}

function goTo(index) {
  if (!Number.isInteger(index) || index < 0 || index >= activeScreens.length) return;
  current = index;
  renderCurrent();
}

function goToId(id) {
  const index = activeScreens.findIndex(item => item.id === id);
  if (index >= 0) goTo(index);
}

function next() {
  if (current < activeScreens.length - 1) goTo(current + 1);
  else if (extractMode) location.href = location.pathname;
  else showHome();
}

function previous() { if (current > 0) goTo(current - 1); }

function updateUrl(item) {
  if (extractMode) return;
  const url = new URL(location.href);
  const inDossier = screens.filter(candidate => candidate.dossier === item.dossier);
  url.search = `?dossier=${encodeURIComponent(item.dossier)}&ecran=${inDossier.indexOf(item) + 1}`;
  history.replaceState({}, "", url);
}

function copyCurrentLink() {
  const url = new URL(location.href);
  url.search = `?extrait=${encodeURIComponent(currentItem().id)}`;
  const text = url.href;
  const fallback = () => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    if (!copied) throw new Error("copy failed");
  };
  const operation = navigator.clipboard?.writeText ? navigator.clipboard.writeText(text) : Promise.resolve().then(fallback);
  operation.then(() => showStatus("Lien de cet écran copié.")).catch(() => showStatus(`Copie impossible. Adresse : ${text}`));
}

function showStatus(message) {
  const node = $("#status-message");
  if (!node) return;
  clearTimeout(statusTimer);
  node.textContent = message;
  node.classList.add("show");
  statusTimer = setTimeout(() => node.classList.remove("show"), 3200);
}

function bestFrenchVoice() {
  const voices = speechSynthesis.getVoices();
  const quality = /natural|naturel|neural|online|google|microsoft/i;
  return voices.find(voice => voice.lang?.toLowerCase() === "fr-fr" && quality.test(voice.name))
    || voices.find(voice => voice.lang?.toLowerCase() === "fr-fr")
    || voices.find(voice => voice.lang?.toLowerCase().startsWith("fr") && quality.test(voice.name))
    || voices.find(voice => voice.lang?.toLowerCase().startsWith("fr"))
    || voices[0];
}

function speechSupported() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }

function speakCurrent() {
  if (!speechSupported()) {
    showStatus("La voix de synthèse n’est pas disponible. Tout le texte reste visible.");
    return;
  }
  const item = currentItem();
  stopSpeech(false);
  autoplay = true;
  const run = speechRun;
  const utterance = new SpeechSynthesisUtterance(`${item.title}. ${item.text} ${item.prompt}`);
  utterance.lang = "fr-FR";
  utterance.pitch = 1;
  utterance.rate = voiceRates[rateIndex];
  const voice = bestFrenchVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    if (run !== speechRun) return;
    speaking = true;
    paused = false;
    updateVoiceButtons();
  };
  utterance.onend = () => {
    if (run !== speechRun) return;
    speaking = false;
    paused = false;
    updateVoiceButtons();
  };
  utterance.onerror = event => {
    if (run !== speechRun || event.error === "canceled" || event.error === "interrupted") return;
    speaking = false;
    paused = false;
    updateVoiceButtons();
    showStatus("Lecture indisponible. Le contenu écrit reste complet.");
  };
  speechSynthesis.speak(utterance);
}

function toggleSpeech() {
  if (!speechSupported()) return speakCurrent();
  if (speaking && !paused) {
    speechSynthesis.pause();
    paused = true;
    updateVoiceButtons();
  } else if (speaking && paused) {
    speechSynthesis.resume();
    paused = false;
    updateVoiceButtons();
  } else {
    speakCurrent();
  }
}

function stopSpeech(disableAutoplay = true) {
  speechRun += 1;
  if (speechSupported()) speechSynthesis.cancel();
  speaking = false;
  paused = false;
  if (disableAutoplay) autoplay = false;
  updateVoiceButtons();
}

function updateVoiceButtons() {
  const listen = $("#listen");
  const stop = $("#stop-voice");
  if (!listen || !stop) return;
  const label = speaking ? (paused ? "Reprendre" : "Pause") : "Écouter";
  listen.setAttribute("aria-pressed", String(speaking && !paused));
  listen.setAttribute("aria-label", label);
  $("span:last-child", listen).textContent = label;
  $("span:first-child", listen).textContent = speaking && !paused ? "Ⅱ" : "▶";
  stop.disabled = !speaking;
}

function changeRate(direction) {
  rateIndex = Math.max(0, Math.min(voiceRates.length - 1, rateIndex + direction));
  saveRate();
  $("#speed-value").textContent = `${voiceRates[rateIndex].toFixed(2).replace(".", ",")}×`;
  if (speaking) speakCurrent();
}

function buildPrintBook() {
  $("#print-book").innerHTML = `<section class="print-cover"><p>inerWeb Édu · Pilote Fluides · Habilitation A1</p><h1>Évaporateur — installer, régler, vérifier</h1><p class="print-purpose">Version papier du module interactif. Elle conserve les explications, les consignes, les questions, les corrections et les codes du référentiel. Les réglages réels restent ceux de la documentation du matériel installé.</p></section>${screens.map((item, index) => {
    const quiz = item.quiz ? `<h3>Question</h3><ul>${item.quiz.answers.map(answer => `<li>${esc(answer)}</li>`).join("")}</ul><div class="print-correction"><strong>Correction :</strong> ${esc(item.quiz.answers[item.quiz.correct])}. ${esc(item.quiz.explanation)}</div>` : "";
    const safety = item.id === "securite-avant" ? '<div class="print-warning"><strong>Le piège :</strong> azote seul pour la mise en pression de contrôle ; consignation électrique avant intervention.</div>' : "";
    return `<article class="print-screen"><p class="print-meta">Écran ${index + 1} · ${esc(item.id)} · ${esc(item.niveau)}</p><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p><p><strong>À faire :</strong> ${esc(item.prompt || "Lire et retenir le point clé.")}</p><p>${esc(item.print)}</p>${quiz}${safety}<p class="print-codes">${item.codes.length ? `référentiel · ${item.codes.join(" · ")}` : "contexte · hors preuve de couverture"}</p></article>`;
  }).join("")}`;
}

function handleInitialUrl() {
  const params = new URLSearchParams(location.search);
  const extract = params.get("extrait");
  if (extract) {
    startExtract(extract.split(",").map(id => id.trim()).filter(Boolean));
    return;
  }
  const dossier = params.get("dossier");
  if (dossier && dossiers.some(item => item.id === dossier)) {
    startCourse(dossier, params.get("ecran") || 1);
    return;
  }
  activeScreens = screens;
  showHome();
}

function bindGlobalEvents() {
  $("#start-button").addEventListener("click", () => startCourse("observer", 1));
  $("#prev-button").addEventListener("click", previous);
  $("#next-button").addEventListener("click", next);
  $("#exit-button").addEventListener("click", showHome);
  $("#home-button").addEventListener("click", () => extractMode ? (location.href = location.pathname) : showHome());
  $("#copy-link").addEventListener("click", copyCurrentLink);
  $("#listen").addEventListener("click", toggleSpeech);
  $("#stop-voice").addEventListener("click", () => stopSpeech());
  $("#slower").addEventListener("click", () => changeRate(-1));
  $("#faster").addEventListener("click", () => changeRate(1));
  document.addEventListener("keydown", event => {
    if ($("#course-shell").hidden) return;
    const tag = event.target?.tagName;
    if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(tag)) return;
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") previous();
    if (event.key === "Escape") showHome();
    if (event.key === " " && speaking) { event.preventDefault(); toggleSpeech(); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
  window.addEventListener("beforeunload", () => stopSpeech());
  window.addEventListener("popstate", () => location.reload());
  if (speechSupported()) speechSynthesis.addEventListener?.("voiceschanged", bestFrenchVoice);
}

renderHome();
buildPrintBook();
bindGlobalEvents();
$("#speed-value").textContent = `${voiceRates[rateIndex].toFixed(2).replace(".", ",")}×`;
if (!speechSupported()) {
  $("#listen").disabled = true;
  $("#stop-voice").disabled = true;
}
handleInitialUrl();
