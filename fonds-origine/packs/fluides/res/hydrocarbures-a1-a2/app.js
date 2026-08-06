"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const dossiers = [
  { id: "comprendre", titre: "Comprendre", court: "Pourquoi", resume: "Origine, retour du propane et rappel A3.", icon: "ico-prp.png" },
  { id: "risques", titre: "Voir le risque", court: "Risques", resume: "Famille A3, nuage gaz-air, point bas et alarme.", icon: "ico-inflammable.png" },
  { id: "mission", titre: "Analyser la zone", court: "Mission", resume: "Dossier machine, calcul, inspection et décision.", icon: "ico-espace-clos.png" },
  { id: "outillage", titre: "Équiper le poste", court: "Outillage", resume: "Matériel exigé et preuve de compatibilité.", icon: "ico-manifold.png" },
  { id: "conduite", titre: "Conduite à tenir", court: "Conduite", resume: "Avant d’ouvrir, récupérer, azote et charge exacte.", icon: "ico-station-recup.png" },
  { id: "controle", titre: "Contrôle", court: "Contrôle", resume: "Cinq décisions professionnelles corrigées.", icon: "role-question.png" }
];

const screenVisuals = {
  "mission-290": ["role-experience.png", "Entrer dans la mission"],
  "origine-propane": ["ico-bouteille-fluide.png", "Identifier le propane"],
  "pourquoi-r290": ["ico-prp.png", "Relier climat et performance"],
  "rappel-a3": ["ico-inflammable.png", "Reconnaître la famille A3"],
  "triangle-inflammation": ["ico-inflammable.png", "Voir l’accident se construire"],
  "nuage-inflammable": ["ico-detecteur-fuite.png", "Comprendre le mélange gaz-air"],
  "points-bas": ["ico-espace-clos.png", "Suivre une fuite vers le sol"],
  "conduite-fuite": ["ico-detecteur-fuite.png", "Réagir sans créer d’étincelle"],
  "dossier-machine": ["ico-registre.png", "Lire le dossier de la machine"],
  "calcul-surface": ["ico-balance.png", "Calculer l’exigence documentée"],
  "choisir-zone": ["ico-espace-clos.png", "Comparer les zones"],
  "inspection-zone": ["ico-torche.png", "Inspecter la zone"],
  "corriger-zone": ["ico-balisage.png", "Corriger les dangers"],
  "decision-chantier": ["ico-cadenas.png", "Autoriser ou suspendre"],
  "liste-outillage": ["ico-cles.png", "Préparer l’outillage"],
  "preuve-compatibilite": ["ico-registre.png", "Vérifier la preuve de compatibilité"],
  "tri-outillage": ["ico-tournevis.png", "Trier l’outillage"],
  "poste-pompe": ["ico-pompe-vide.png", "Installer la pompe à vide"],
  "avant-ouvrir": ["ico-cadenas.png", "Verrouiller la préparation"],
  "recuperer-puis-azote": ["ico-station-recup.png", "Récupérer le fluide"],
  "vide-et-air-exterieur": ["ico-pompe-vide.png", "Conduire le refoulement"],
  "charge-exacte": ["ico-balance.png", "Peser la charge exacte"],
  "quiz-pourquoi": ["ico-prp.png", "Contrôler l’intérêt du R-290"],
  "quiz-risque": ["ico-inflammable.png", "Contrôler le risque"],
  "quiz-surface": ["ico-espace-clos.png", "Contrôler la surface"],
  "quiz-outillage": ["ico-detecteur-fuite.png", "Contrôler l’outillage"],
  "quiz-sequence": ["ico-azote.png", "Contrôler la séquence"],
  "bilan": ["role-juste.png", "Faire le bilan de la mission"]
};

function renderScreenVisual(item) {
  const visual = screenVisuals[item.id] || [dossiers.find(dossier => dossier.id === item.dossier)?.icon || "role-retenir.png", "Illustration pédagogique"];
  return `<span class="visual-halo" aria-hidden="true"></span><img src="../bibliotheque/icones/${visual[0]}" alt=""><figcaption>${esc(visual[1])}</figcaption>`;
}

const quizAnswers = {};
const missionState = {
  hazards: new Set(),
  corrections: new Set(),
  siteCorrected: false,
  toolVerdicts: {}
};

let current = 0;
let furthest = 0;
let extractMode = false;
let activeScreens = [];
let speechRun = 0;
let speaking = false;
let paused = false;
let autoplay = false;
let statusTimer = 0;
const voiceRates = [0.8, 0.95, 1.1, 1.25];
let rateIndex = safeStoredRateIndex();

function safeStoredRateIndex() {
  try {
    const raw = localStorage.getItem("hydrocarbures-voice-rate");
    if (raw === null) return 1;
    const stored = Number(raw);
    return Number.isInteger(stored) && stored >= 0 && stored < voiceRates.length ? stored : 1;
  } catch (_) { return 1; }
}

function saveRate() {
  try { localStorage.setItem("hydrocarbures-voice-rate", String(rateIndex)); } catch (_) { /* préférence locale facultative */ }
}

function esc(value) {
  return String(value).replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

function screen(data) {
  return { niveau: "comprendre", prompt: "", print: data.text, render: renderStatement, wire: null, ...data };
}

const screens = [
  screen({
    id: "mission-290", dossier: "comprendre", niveau: "decouvrir", short: "Mission",
    title: "Mission 290 · autoriser ou suspendre l’intervention",
    text: "Une armoire réfrigérée au R-290 doit être déplacée puis remise en service dans la réserve d’un commerce. Votre rôle n’est pas de réciter A3 : vous devez réunir les preuves qui permettent de travailler sans improviser.",
    prompt: "Choisissez la toute première action.", codes: ["12.04"],
    print: "Première action : identifier l’équipement et lire son dossier avant de sortir l’outillage.",
    choices: [
      { label: "Brancher le manifold", good: false, feedback: "Trop tôt. Vous ne connaissez encore ni le fluide, ni la charge, ni les conditions du site." },
      { label: "Lire la plaque et le dossier", good: true, feedback: "Oui. L’identification ouvre l’analyse de risques et détermine le matériel à préparer." },
      { label: "Mettre la machine en marche", good: false, feedback: "Non. Une mise sous tension peut créer une source d’ignition avant l’analyse." }
    ], render: renderChoice, wire: wireChoice
  }),
  screen({
    id: "origine-propane", dossier: "comprendre", niveau: "decouvrir", short: "Origine",
    title: "Le R-290 n’est pas un nouveau gaz",
    text: "R-290 est le code frigorifique du propane, C₃H₈. Il provient notamment du traitement du gaz naturel et du raffinage. Les hydrocarbures ont été essayés dès le début du XXᵉ siècle, puis délaissés au profit de fluides plus faciles à employer avec les techniques d’étanchéité de l’époque.",
    prompt: "Faites avancer la courte frise : deux idées suffisent.", codes: [],
    print: "Début du XXe siècle : premiers usages frigorifiques d’hydrocarbures. Années 1990 : retour dans les appareils hermétiques, notamment avec les réfrigérateurs à l’isobutane.",
    render: renderTimeline, wire: wireTimeline
  }),
  screen({
    id: "pourquoi-r290", dossier: "comprendre", niveau: "comprendre", short: "Pourquoi",
    title: "Pourquoi remettre du propane dans une machine frigorifique ?",
    text: "Le R-290 revient parce qu’il conjugue un très faible impact climatique direct et de bonnes propriétés thermodynamiques. Mais il ne rend pas une ancienne machine compatible par magie : l’équipement doit avoir été conçu et approuvé pour un fluide inflammable.",
    prompt: "Retenez les trois raisons justes et écartez les deux pièges.", codes: ["12.14"],
    print: "Atouts : impact climatique direct très faible, bonnes performances, disponibilité. Pièges : le R-290 n’est ni inoffensif ni un fluide de conversion universel.",
    render: renderReasons, wire: wireReasons
  }),
  screen({
    id: "rappel-a3", dossier: "comprendre", niveau: "comprendre", short: "Rappel A3",
    title: "Le R-290 n’est qu’un exemple de la famille A3",
    text: "Cette mission suit une machine au R-290. La même logique de prévention concerne d’autres hydrocarbures A3 courants : R-600, R-600a, R-1270… La liste n’est pas à réciter : avant toute intervention, la plaque et la FDS donnent le fluide et sa classe.",
    prompt: "Repérez la famille, puis choisissez le réflexe qui restera valable demain.", codes: ["12.01"],
    print: "Exemples d’hydrocarbures A3 : R-290 (propane), R-600 (butane), R-600a (isobutane), R-1270 (propylène), puis d’autres fluides ou mélanges classés A3. La classe se vérifie sur la plaque et la FDS.",
    render: renderA3Family, wire: wireA3Family
  }),

  screen({
    id: "triangle-inflammation", dossier: "risques", niveau: "comprendre", short: "Triangle",
    title: "Regardez comment une fuite A3 devient un accident",
    text: "Une fuite n’explose pas toute seule. L’accident se construit : le fluide A3 fuit, il forme un nuage avec l’air, puis ce nuage rencontre une étincelle ou une surface chaude. Selon le lieu, le résultat peut être une inflammation brutale ou une explosion.",
    prompt: "Déclenchez les trois moments dans l’ordre, puis coupez la chaîne.", codes: ["12.04"],
    print: "Scénario : fuite d’un fluide A3, mélange avec l’air, puis source d’ignition. Prévention : empêcher ou maîtriser la fuite, ventiler selon l’analyse et supprimer les sources d’ignition.",
    render: renderFireTriangle, wire: wireFireTriangle
  }),
  screen({
    id: "nuage-inflammable", dossier: "risques", niveau: "comprendre", short: "Concentration",
    title: "Le feu exige une certaine proportion de gaz et d’air",
    text: "Presque seulement de l’air : la flamme ne se propage pas. Dans la bonne proportion gaz-air, une ignition peut déclencher un feu ou une explosion. Avec beaucoup de gaz et trop peu d’air, pas de flamme ici — mais le nuage redevient dangereux en se diluant.",
    prompt: "Comparez les trois images, puis nommez les mélanges.", codes: ["12.04"],
    print: "Démonstration qualitative : trop peu de gaz = mélange pauvre ; proportion dangereuse gaz-air = domaine inflammable ; beaucoup de gaz et peu d’air = mélange riche, qui traversera le domaine inflammable en se diluant. Les limites exactes se lisent sur la FDS.",
    render: renderConcentration, wire: wireConcentration
  }),
  screen({
    id: "points-bas", dossier: "risques", niveau: "appliquer", short: "Point bas",
    title: "Ces hydrocarbures descendent vers les points bas",
    text: "Les vapeurs de R-290, R-600, R-600a et R-1270 sont plus lourdes que l’air : elles descendent vers le sol, une fosse ou un caniveau. A3 indique l’inflammabilité, pas la densité. Pour tout autre fluide, vérifiez la FDS.",
    prompt: "Lancez la fuite : repérez les deux dangers au sol.", codes: ["12.02", "12.04"],
    print: "Pour les hydrocarbures cités, examiner les points bas et volumes confinés. Deux dangers : nuage inflammable et, en forte concentration dans un espace mal ventilé, déplacement de l’oxygène avec risque d’asphyxie. La classe A n’indique pas un air respirable.",
    render: renderLowPoint, wire: wireLowPoint
  }),
  screen({
    id: "conduite-fuite", dossier: "risques", niveau: "evaluer", short: "Fuite",
    title: "L’alarme sonne : ne cherchez pas la fuite",
    text: "Une alarme ou une fuite suspectée arrête immédiatement la mission, quel que soit le fluide A3. On s’éloigne, on éloigne les autres, on alerte et on applique la consigne du site. Dans le nuage, un interrupteur, un moteur ou un appareil ordinaire peut fournir l’étincelle manquante.",
    prompt: "Choisissez votre action dans les dix premières secondes.", codes: ["12.04", "12.13"],
    print: "Conduite : STOP, ÉLOIGNER, ALERTER, appliquer la CONSIGNE DU SITE. Ne pas actionner d’interrupteur dans la zone, ne pas chercher à l’odeur et ne pas improviser une ventilation avec du matériel ordinaire.",
    render: renderLeakAlarm, wire: wireLeakAlarm
  }),

  screen({
    id: "dossier-machine", dossier: "mission", niveau: "appliquer", short: "Dossier",
    title: "La plaque transforme la machine en données",
    text: "Le dossier de la mission indique R-290, une charge de 153 g et une exigence de surface minimale issue de la documentation fabricant pour cet appareil commercial autonome. Ces trois informations ont trois usages différents.",
    prompt: "Ouvrez les repères de la plaque.", codes: ["12.01", "12.03"],
    print: "R-290 : famille de risque. 153 g : charge nominale. Référence IEC 60335-2-89 : périmètre du calcul fourni par le fabricant.",
    render: renderMachineDossier, wire: wireMachineDossier
  }),
  screen({
    id: "calcul-surface", dossier: "mission", niveau: "appliquer", short: "Calcul",
    title: "Calculer dans un cas documenté, jamais avec une formule universelle",
    text: "Dans l’exemple publié par Danfoss pour un appareil commercial autonome relevant de l’IEC 60335-2-89, la surface minimale dépend de la charge et de la limite inférieure d’inflammabilité. Le calcul ci-dessous vaut uniquement pour ce cas documenté.",
    prompt: "Calculez la surface minimale et saisissez le résultat au dixième.", codes: ["12.03"],
    print: "Cas publié : 0,153 kg ÷ [2,2 m × (0,25 × 0,038 kg/m³)] = 7,3 m². Ne pas réutiliser cette formule hors de son périmètre.",
    render: renderAreaCalculation, wire: wireAreaCalculation
  }),
  screen({
    id: "choisir-zone", dossier: "mission", niveau: "evaluer", short: "Implantation",
    title: "La réserve proposée est trop petite",
    text: "La première zone mesure 3 m × 2 m, soit 6 m². Le dossier de cette machine exige 7,3 m² minimum. Une seconde zone de 6 m × 4 m est disponible après mise à l’écart du public.",
    prompt: "Choisissez la seule décision défendable.", codes: ["12.03", "12.04"],
    print: "6 m² < 7,3 m² : suspendre dans la petite réserve. La zone de 24 m² peut être analysée ; sa surface suffisante ne constitue pas encore un GO global.",
    choices: [
      { label: "Travailler dans 6 m², la différence est faible", good: false, feedback: "Non. Une exigence documentée ne s’arrondit pas au jugé." },
      { label: "Choisir 24 m² puis analyser tous les autres risques", good: true, feedback: "Oui. La surface passe, mais la décision finale dépend encore de la zone et des moyens." },
      { label: "Additionner les deux surfaces", good: false, feedback: "Non. On évalue la pièce où l’appareil est réellement utilisé ou entretenu." }
    ], render: renderChoice, wire: wireChoice
  }),
  screen({
    id: "inspection-zone", dossier: "mission", niveau: "appliquer", short: "Inspection",
    title: "Entrez dans la zone avec les yeux d’un technicien",
    text: "La surface est suffisante, mais la zone n’est pas prête. Cherchez les sources d’ignition, l’évacuation, la ventilation, les personnes exposées et les points où le gaz pourrait s’accumuler.",
    prompt: "Trouvez les six repères de la scène.", codes: ["12.04", "12.13"],
    print: "Repères : issue encombrée, chargeur de batterie, outil électrique, ventilation non vérifiée, public présent et caniveau en point bas.",
    render: renderWorksiteInspection, wire: wireWorksiteInspection
  }),
  screen({
    id: "corriger-zone", dossier: "mission", niveau: "appliquer", short: "Corriger",
    title: "Chaque danger appelle une action vérifiable",
    text: "Une phrase comme « faire attention » ne corrige rien. Il faut une action observable : retirer une ignition, dégager l’issue, interdire l’accès, vérifier la ventilation et appliquer le dispositif prévu pour les points bas.",
    prompt: "Choisissez l’action correcte pour chaque défaut.", codes: ["12.04", "12.05", "12.13"],
    print: "Actions : retirer ou neutraliser les sources d’ignition selon la procédure, dégager l’issue, baliser et fermer l’accès, vérifier les moyens de ventilation et de détection prévus.",
    render: renderSiteCorrections, wire: wireSiteCorrections
  }),
  screen({
    id: "decision-chantier", dossier: "mission", niveau: "evaluer", short: "GO / STOP",
    title: "Le GO est une conclusion, jamais un réflexe",
    text: "La décision réunit quatre preuves : appareil identifié, surface conforme au dossier, zone maîtrisée et moyens adaptés disponibles. Si une preuve manque, l’intervention reste suspendue.",
    prompt: "Rétablissez les conditions si nécessaire, puis prononcez la décision.", codes: ["12.04", "12.05", "12.13"],
    print: "GO conditionnel uniquement après confirmation des quatre preuves. Sinon STOP, signalement et correction avant reprise.",
    render: renderMissionDecision, wire: wireMissionDecision
  }),

  screen({
    id: "liste-outillage", dossier: "outillage", niveau: "comprendre", short: "Exigé",
    title: "L’outillage hydrocarbures est nommé dans le texte",
    text: "Pour A1/A2, l’arrêté français distingue la station adaptée aux fluides inflammables, le détecteur adapté, les flexibles hydrocarbures avec obturateurs et le manifold hydrocarbures. S’ajoutent notamment bouteille par type de fluide, balance et thermomètre.",
    prompt: "Ouvrez chaque famille pour relier l’outil à sa fonction.", codes: ["12.02", "12.05"],
    print: "Liste réglementaire : station adaptée, détecteur adapté, flexibles hydrocarbures avec obturateurs, manifold hydrocarbures, bouteilles par type de fluide, balance et thermomètre.",
    render: renderRequiredTools, wire: wireRequiredTools
  }),
  screen({
    id: "preuve-compatibilite", dossier: "outillage", niveau: "appliquer", short: "Preuve",
    title: "La couleur de l’outil ne prouve rien",
    text: "Un appareil peut être dédié aux hydrocarbures ou compatible avec plusieurs familles. Dans les deux cas, la preuve est le marquage et la documentation du fabricant, pas l’habitude de l’atelier ni la couleur du carter.",
    prompt: "Choisissez la preuve qui autorise l’emploi.", codes: ["12.02"],
    print: "Preuve : notice, marquage et caractéristiques déclarant l’usage avec les hydrocarbures et la tâche prévue.",
    choices: [
      { label: "Il ressemble au modèle hydrocarbures", good: false, feedback: "Non. Une ressemblance ne prouve aucune compatibilité." },
      { label: "La notice cite R-290/R-600a et l’usage", good: true, feedback: "Oui. La compatibilité est documentée pour la famille et pour la fonction." },
      { label: "Un collègue l’a déjà utilisé", good: false, feedback: "Non. Une habitude ne remplace pas la déclaration du fabricant." }
    ], render: renderChoice, wire: wireChoice
  }),
  screen({
    id: "tri-outillage", dossier: "outillage", niveau: "appliquer", short: "Trier",
    title: "Constituez le poste R-290",
    text: "Le véhicule contient du matériel dédié, du matériel multi-compatible documenté et du matériel sans preuve. Pour chaque objet, décidez : prendre ou écarter. Le module explique chaque verdict.",
    prompt: "Classez les dix objets, puis contrôlez le poste.", codes: ["12.02", "12.05"],
    print: "Prendre uniquement le matériel dont la fonction et la compatibilité sont établies. Écarter le détecteur HFC seul, le manifold non marqué et le ventilateur ordinaire non évalué pour la zone.",
    render: renderToolSort, wire: wireToolSort
  }),
  screen({
    id: "poste-pompe", dossier: "outillage", niveau: "evaluer", short: "Pompe",
    title: "La pompe à vide ne doit pas rejeter dans la zone",
    text: "Pour le service R-290/R-600a, la documentation Danfoss demande une bonne ventilation et un refoulement de pompe à vide conduit vers l’air extérieur. Le matériel reste choisi selon sa notice et l’analyse de risques.",
    prompt: "Choisissez le montage qui éloigne le rejet de la zone de travail.", codes: ["12.02", "12.05"],
    print: "Montage attendu : pompe conforme à la procédure, refoulement conduit à l’extérieur, ventilation et détection selon l’analyse du site.",
    render: renderPumpSetup, wire: wirePumpSetup
  }),

  screen({
    id: "avant-ouvrir", dossier: "conduite", niveau: "appliquer", short: "Avant",
    title: "Avant d’ouvrir : quatre verrous",
    text: "Le travail fluidique ne commence qu’après l’identification, l’analyse, la préparation de la zone et la vérification du poste. Cette chronologie évite de découvrir le danger avec le circuit déjà ouvert.",
    prompt: "Remettez les quatre verrous dans l’ordre.", codes: ["12.04", "12.05"],
    print: "Ordre : identifier le fluide et le dossier → analyser les risques → préparer et baliser la zone → vérifier l’outillage et les EPI.",
    sequence: [
      { label: "Identifier le fluide et le dossier", rank: 1 },
      { label: "Analyser les risques", rank: 2 },
      { label: "Préparer et baliser la zone", rank: 3 },
      { label: "Vérifier outils et EPI", rank: 4 }
    ], render: renderSequence, wire: wireSequence
  }),
  screen({
    id: "recuperer-puis-azote", dossier: "conduite", niveau: "appliquer", short: "Récupérer",
    title: "Récupérer d’abord, remplir à l’azote ensuite",
    text: "Le référentiel exige de récupérer le réfrigérant inflammable en sécurité puis de remplir le système avec de l’azote. L’azote est le seul gaz de mise en pression du module : jamais d’oxygène, jamais d’air comprimé.",
    prompt: "Construisez la séquence qui permet de remettre le circuit à l’étape suivante.", codes: ["12.06"],
    print: "Séquence : récupérer avec le matériel adapté → confirmer la fin selon la procédure → remplir à l’azote → seulement ensuite transmettre à la suite pratique g12b.",
    sequence: [
      { label: "Récupérer avec le matériel adapté", rank: 1 },
      { label: "Confirmer la fin selon la procédure", rank: 2 },
      { label: "Remplir le système à l’azote", rank: 3 },
      { label: "Transmettre à la suite pratique", rank: 4 }
    ], render: renderSequence, wire: wireSequence
  }),
  screen({
    id: "vide-et-air-exterieur", dossier: "conduite", niveau: "evaluer", short: "Air extérieur",
    title: "Conduire le rejet de pompe dehors n’est pas rejeter la charge",
    text: "Le fluide du circuit a déjà été récupéré. Le conduit vers l’extérieur concerne le refoulement résiduel de la pompe à vide selon la procédure du fabricant. Il ne transforme pas une mise à l’air du réfrigérant en méthode normale de récupération.",
    prompt: "Distinguez les deux opérations.", codes: ["12.02", "12.06"],
    print: "Récupération : retirer et confiner le réfrigérant avec l’équipement adapté. Tirage au vide : après récupération, conduire le refoulement de la pompe selon la notice, hors de la zone.",
    choices: [
      { label: "La pompe à vide récupère toute la charge", good: false, feedback: "Non. La récupération du fluide précède le tirage au vide et emploie l’équipement adapté." },
      { label: "Récupération puis pompe, rejet de pompe conduit dehors", good: true, feedback: "Oui. Deux opérations, deux fonctions et un ordre précis." },
      { label: "On ouvre le flexible dehors et on appelle cela un vide", good: false, feedback: "Non. Ce geste ne constitue ni une récupération ni un tirage au vide maîtrisé." }
    ], render: renderChoice, wire: wireChoice
  }),
  screen({
    id: "charge-exacte", dossier: "conduite", niveau: "appliquer", short: "Peser",
    title: "La charge exacte protège aussi la performance",
    text: "Les petits circuits hydrocarbures sont sensibles à l’écart de charge. On pèse la masse prescrite par la plaque, on maintient les échangeurs propres et les réglages conformes. On ne convertit pas au R-290 une machine qui n’a pas été approuvée pour ce fluide.",
    prompt: "Réglez la balance sur la charge de la mission : 153 g.", codes: ["12.01", "12.14"],
    print: "Charge de l’exemple : 153 g, par pesée. La valeur appartient à cette machine ; elle n’est pas une charge type à mémoriser.",
    render: renderChargeScale, wire: wireChargeScale
  }),

  screen({
    id: "quiz-pourquoi", dossier: "controle", niveau: "evaluer", short: "Question 1",
    title: "Contrôle 1 · Pourquoi du R-290 ?",
    text: "Quelle phrase relie correctement l’intérêt du R-290 et sa limite majeure ?",
    prompt: "Choisissez, puis lisez la correction.", codes: ["12.14"],
    quiz: { answers: ["Faible impact direct et bonnes performances, mais risque A3", "Fluide sans danger utilisable dans toute machine", "Fluide choisi seulement parce qu’il coûte moins cher"], correct: 0, explanation: "Le R-290 présente un très faible impact climatique direct et de bonnes performances. Son inflammabilité A3 impose une conception et une intervention adaptées." }, render: renderQuiz, wire: wireQuiz
  }),
  screen({
    id: "quiz-risque", dossier: "controle", niveau: "evaluer", short: "Question 2",
    title: "Contrôle 2 · Le scénario d’inflammation",
    text: "Une fuite se dirige vers un caniveau. Quel danger faut-il intégrer ?",
    prompt: "Choisissez, puis lisez la correction.", codes: ["12.02", "12.04"],
    quiz: { answers: ["Aucun : le propane monte au plafond", "Accumulation en point bas et inflammation si une ignition est présente", "Seulement une baisse de performance"], correct: 1, explanation: "La vapeur de propane est plus lourde que l’air. Elle peut s’accumuler en point bas ; avec de l’air et une ignition, le mélange peut s’enflammer." }, render: renderQuiz, wire: wireQuiz
  }),
  screen({
    id: "quiz-surface", dossier: "controle", niveau: "evaluer", short: "Question 3",
    title: "Contrôle 3 · Surface documentée",
    text: "Le dossier de la machine demande 7,3 m². La réserve ne mesure que 6 m². Que faites-vous ?",
    prompt: "Choisissez, puis lisez la correction.", codes: ["12.03", "12.04"],
    quiz: { answers: ["Je commence : 1,3 m² d’écart est négligeable", "Je suspends dans cette pièce et recherche une zone conforme", "J’ouvre la porte et additionne le couloir"], correct: 1, explanation: "La limite vient du dossier applicable. On ne la corrige ni de mémoire ni en ajoutant un espace qui n’appartient pas à la pièce évaluée." }, render: renderQuiz, wire: wireQuiz
  }),
  screen({
    id: "quiz-outillage", dossier: "controle", niveau: "evaluer", short: "Question 4",
    title: "Contrôle 4 · Compatibilité de l’outillage",
    text: "Quel critère permet de retenir un détecteur pour la mission R-290 ?",
    prompt: "Choisissez, puis lisez la correction.", codes: ["12.02", "12.05"],
    quiz: { answers: ["Sa couleur et son prix", "La mention HFC sur le boîtier", "La documentation qui le déclare adapté aux fluides inflammables"], correct: 2, explanation: "L’arrêté exige un détecteur adapté aux fluides inflammables. Le marquage et la documentation établissent cette compatibilité." }, render: renderQuiz, wire: wireQuiz
  }),
  screen({
    id: "quiz-sequence", dossier: "controle", niveau: "evaluer", short: "Question 5",
    title: "Contrôle 5 · Avant la suite pratique",
    text: "Quel enchaînement respecte le référentiel avant la suite de l’intervention ?",
    prompt: "Choisissez, puis lisez la correction.", codes: ["12.06"],
    quiz: { answers: ["Air comprimé puis récupération", "Récupération sûre puis remplissage à l’azote", "Oxygène puis tirage au vide"], correct: 1, explanation: "Le réfrigérant inflammable est récupéré en sécurité, puis le système est rempli à l’azote. Ni l’air comprimé ni l’oxygène ne sont utilisés pour la mise en pression." }, render: renderQuiz, wire: wireQuiz
  }),
  screen({
    id: "bilan", dossier: "controle", niveau: "evaluer", short: "Bilan",
    title: "Bilan · le R-290 change le travail, pas seulement l’étiquette",
    text: "Vous avez relié le choix du propane à ses conséquences : risque d’inflammation, analyse de zone, calcul documenté, outillage spécifique et ordre récupération → azote. La suite g12b enseignera l’intervention sur le circuit.",
    prompt: "Consultez votre résultat ou recommencez le contrôle.", codes: [],
    print: "Seuil pédagogique : 4 réponses correctes sur 5. Cette réussite n’est ni une attestation ni une autorisation d’intervention.",
    render: renderScore, wire: wireScore
  })
];

function renderStatement(item) {
  return `<div class="activity-inner hero-statement"><strong>${esc(item.short)}</strong><span>${esc(item.print)}</span></div>`;
}

function renderChoice(item) {
  return `<div class="activity-inner decision-activity"><div class="choice-grid">${item.choices.map((choice, index) => `<button class="choice-button" type="button" data-decision="${index}"><span class="choice-index" aria-hidden="true">${index + 1}</span><span class="choice-label">${esc(choice.label)}</span></button>`).join("")}</div><div class="state-box pending" id="decision-feedback">En attente · prenez une décision.</div></div>`;
}

function wireChoice(item) {
  $$('[data-decision]').forEach(button => button.addEventListener("click", () => {
    const selected = Number(button.dataset.decision);
    $$('[data-decision]').forEach((candidate, index) => {
      candidate.disabled = true;
      if (item.choices[index].good) candidate.classList.add("correct");
      else if (index === selected) candidate.classList.add("wrong");
    });
    const choice = item.choices[selected];
    const box = $("#decision-feedback");
    box.className = `state-box ${choice.good ? "correct" : "error"}`;
    box.textContent = `${choice.good ? "Décision juste" : "Décision dangereuse"} · ${choice.feedback}`;
  }));
}

function renderTimeline() {
  return `<div class="activity-inner timeline-activity"><div class="timeline-track"><button type="button" data-era="ancien" aria-pressed="true"><b>1908–1950</b><span>premiers essais</span></button><i aria-hidden="true"></i><button type="button" data-era="retour" aria-pressed="false"><b>Années 1990</b><span>retour industriel</span></button></div><div class="state-box neutral" id="timeline-copy">Départ · les hydrocarbures sont connus depuis longtemps, mais l’étanchéité et les usages limitaient leur diffusion.</div><p class="source-chip">Histoire courte · source éditoriale ABC Clim, mise à jour 2026</p></div>`;
}

function wireTimeline() {
  const copy = {
    ancien: "Début du XXe siècle · éthylène, isobutane puis mélanges propane-butane sont expérimentés, sans diffusion massive.",
    retour: "Années 1990 · les appareils hermétiques et l’enjeu climatique rendent de nouveau les hydrocarbures attractifs."
  };
  $$('[data-era]').forEach(button => button.addEventListener("click", () => {
    $$('[data-era]').forEach(candidate => candidate.setAttribute("aria-pressed", String(candidate === button)));
    $("#timeline-copy").textContent = copy[button.dataset.era];
  }));
}

function renderReasons() {
  const reasons = [
    ["Impact direct très faible", true], ["Bonnes propriétés thermodynamiques", true], ["Disponible comme hydrocarbure", true],
    ["Ininflammable", false], ["Compatible avec toute ancienne machine", false]
  ];
  return `<div class="activity-inner reason-activity"><div class="reason-grid">${reasons.map((reason, index) => `<button type="button" data-reason="${index}" data-good="${reason[1]}" aria-pressed="false">${esc(reason[0])}</button>`).join("")}</div><div class="state-box pending" id="reason-feedback">En attente · trouvez les trois raisons justes.</div></div>`;
}

function wireReasons() {
  const chosen = new Set();
  $$('[data-reason]').forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.reason);
    if (chosen.has(index)) chosen.delete(index); else chosen.add(index);
    button.setAttribute("aria-pressed", String(chosen.has(index)));
    const goodChosen = [...chosen].filter(value => $(`[data-reason="${value}"]`).dataset.good === "true").length;
    const badChosen = [...chosen].filter(value => $(`[data-reason="${value}"]`).dataset.good === "false").length;
    const complete = goodChosen === 3 && badChosen === 0;
    const box = $("#reason-feedback");
    box.className = `state-box ${complete ? "correct" : badChosen ? "error" : "pending"}`;
    box.textContent = complete ? "Juste · trois avantages, sans effacer le risque A3." : badChosen ? "Piège · un atout environnemental ne rend pas le fluide ininflammable ni universel." : `En attente · ${goodChosen} / 3 raisons justes.`;
  }));
}

function renderA3Family() {
  const fluids = [
    ["R-290", "propane"], ["R-600", "butane"], ["R-600a", "isobutane"], ["R-1270", "propylène"]
  ];
  return `<div class="activity-inner a3-family-activity"><div class="a3-family-strip" aria-label="Exemples courants d’hydrocarbures classés A3">${fluids.map(fluid => `<span class="a3-fluid"><img src="../bibliotheque/icones/ico-bouteille-fluide.png" alt=""><b>${fluid[0]}</b><small>${fluid[1]}</small><em>A3</em></span>`).join("")}<span class="a3-fluid more"><b>…</b><small>autres fluides ou mélanges classés A3</small></span></div><div class="a3-family-rule"><strong>A3</strong><span><b>Même famille de risque</b> · forte inflammabilité, prévention et outillage adaptés.</span></div><div class="a3-reflexes"><button type="button" data-a3-choice="memory">Je mémorise seulement le R-290</button><button type="button" data-a3-choice="verify">Je lis la plaque et la FDS</button></div><div class="state-box pending" id="a3-feedback">En attente · la liste d’exemples ne remplace jamais l’identification du fluide.</div></div>`;
}

function wireA3Family() {
  $$('[data-a3-choice]').forEach(button => button.addEventListener("click", () => {
    const good = button.dataset.a3Choice === "verify";
    const box = $("#a3-feedback");
    if (good) {
      $$('[data-a3-choice]').forEach(candidate => {
        candidate.disabled = true;
        if (candidate.dataset.a3Choice === "verify") candidate.classList.add("correct");
      });
      box.className = "state-box correct";
      box.textContent = "Juste · le R-290 est le cas de la mission ; la plaque et la FDS donnent la règle pour chaque machine.";
    } else {
      button.classList.add("wrong");
      box.className = "state-box error";
      box.textContent = "À revoir · de nouveaux fluides ou mélanges A3 peuvent apparaître. Une liste apprise par cœur sera toujours incomplète.";
    }
  }));
}

function renderFireTriangle() {
  return `<div class="activity-inner fire-story-activity"><div class="fire-story-scene" id="fire-story-scene" data-phase="0"><div class="risk-family-ribbon"><b>A3</b><span>R-290 · R-600 · R-600a · R-1270 · …</span></div><div class="fire-room"><div class="fire-unit"><b>FLUIDE A3</b><span>équipement</span></div><span class="leak-label">FUITE</span><div class="gas-cloud" aria-hidden="true">${"<i></i>".repeat(8)}</div><div class="air-zone"><b>AIR</b><span>présent dans le local</span></div><div class="mix-zone"><b>NUAGE GAZ + AIR</b></div><div class="spark-source"><b>⚡</b><span>étincelle</span></div><div class="ignition-burst"><b>INFLAMMATION<br>OU EXPLOSION POSSIBLE</b></div></div></div><div class="fire-story-controls"><button type="button" data-fire-step="1"><span>1</span><b>La fuite démarre</b></button><button type="button" data-fire-step="2" disabled><span>2</span><b>Le gaz rencontre l’air</b></button><button type="button" data-fire-step="3" disabled><span>3</span><b>Une étincelle arrive</b></button><button type="button" id="break-fire-chain" disabled>Couper la chaîne : supprimer l’étincelle</button></div><div class="state-box pending" id="fire-feedback">Étape 1 · faites apparaître la fuite.</div></div>`;
}

function wireFireTriangle() {
  const scene = $("#fire-story-scene");
  const steps = $$('[data-fire-step]');
  const breaker = $("#break-fire-chain");
  const box = $("#fire-feedback");
  const messages = {
    1: "Moment 1 · le fluide sort du circuit et forme un nuage.",
    2: "Moment 2 · le nuage se mélange à l’air du local.",
    3: "DANGER · le mélange gaz-air rencontre une ignition : l’accident devient possible."
  };
  let phase = 0;
  let broken = false;
  steps.forEach(button => button.addEventListener("click", () => {
    phase = Number(button.dataset.fireStep);
    scene.dataset.phase = String(phase);
    steps.forEach((candidate, index) => {
      candidate.setAttribute("aria-pressed", String(index < phase));
      candidate.disabled = index > phase;
    });
    breaker.disabled = phase < 3;
    box.className = `state-box ${phase === 3 ? "error" : "neutral"}`;
    box.textContent = messages[phase];
  }));
  breaker.addEventListener("click", () => {
    if (broken) {
      broken = false; phase = 0;
      scene.classList.remove("broken"); scene.dataset.phase = "0";
      steps.forEach((button, index) => { button.disabled = index !== 0; button.setAttribute("aria-pressed", "false"); });
      breaker.disabled = true; breaker.textContent = "Couper la chaîne : supprimer l’étincelle";
      box.className = "state-box pending"; box.textContent = "Étape 1 · faites apparaître la fuite.";
      return;
    }
    broken = true;
    scene.classList.add("broken");
    breaker.textContent = "↻ Rejouer le scénario";
    box.className = "state-box correct";
    box.textContent = "Chaîne coupée · sans ignition, pas d’inflammation. La fuite reste à récupérer et la zone à sécuriser.";
  });
}

function renderConcentration() {
  const dots = Array.from({ length: 12 }, (_, index) => `<i class="${index < 2 ? "gas-dot" : "air-dot"}"></i>`).join("");
  return `<div class="activity-inner mixture-activity"><div class="mixture-visual"><div class="mixture-chamber lean" id="mixture-chamber"><div class="mixture-dots" aria-hidden="true">${dots}</div><div class="mixture-key"><span><i class="gas-dot"></i>gaz A3</span><span><i class="air-dot"></i>air</span></div><img class="mixture-flame" src="../bibliotheque/icones/ico-inflammable.png" alt=""><div class="mixture-result"><b id="mixture-result-title">PAS DE FLAMME</b><span id="mixture-result-copy">presque seulement de l’air</span></div></div><div class="mixture-plain"><b id="mixture-plain-title">1. Presque pas de gaz</b><span id="mixture-term">Mot métier : mélange pauvre</span></div></div><div class="mixture-choices"><button type="button" data-mixture="lean" aria-pressed="true"><b>1</b><span>Presque pas de gaz</span></button><button type="button" data-mixture="danger" aria-pressed="false"><b>2</b><span>Gaz + air : zone dangereuse</span></button><button type="button" data-mixture="rich" aria-pressed="false"><b>3</b><span>Beaucoup de gaz, peu d’air</span></button></div><div class="state-box neutral" id="cloud-feedback">Pas de flamme ici · il y a trop peu de gaz pour propager la flamme.</div><p class="source-chip">Démonstration qualitative · les limites exactes se lisent sur la FDS.</p></div>`;
}

function wireConcentration() {
  const recipes = {
    lean: { gas: 2, state: "neutral", title: "PAS DE FLAMME", copy: "presque seulement de l’air", plain: "1. Presque pas de gaz", term: "Mot métier : mélange pauvre", feedback: "Pas de flamme ici · il y a trop peu de gaz pour propager la flamme." },
    danger: { gas: 6, state: "error", title: "INFLAMMATION POSSIBLE", copy: "gaz + air dans la zone dangereuse", plain: "2. Gaz et air dans la bonne proportion pour brûler", term: "Mot métier : domaine inflammable", feedback: "DANGER · une étincelle ou une surface chaude peut déclencher un feu ou une explosion." },
    rich: { gas: 10, state: "pending", title: "PAS DE FLAMME ICI", copy: "beaucoup de gaz, pas assez d’air", plain: "3. Beaucoup de gaz, trop peu d’air", term: "Mot métier : mélange riche", feedback: "Toujours dangereux · en se diluant dans l’air, ce nuage traversera la zone inflammable." }
  };
  $$('[data-mixture]').forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.mixture;
    const recipe = recipes[key];
    const chamber = $("#mixture-chamber");
    chamber.className = `mixture-chamber ${key}`;
    $$(".mixture-dots i", chamber).forEach((dot, index) => { dot.className = index < recipe.gas ? "gas-dot" : "air-dot"; });
    $$('[data-mixture]').forEach(candidate => candidate.setAttribute("aria-pressed", String(candidate === button)));
    $("#mixture-result-title").textContent = recipe.title;
    $("#mixture-result-copy").textContent = recipe.copy;
    $("#mixture-plain-title").textContent = recipe.plain;
    $("#mixture-term").textContent = recipe.term;
    const box = $("#cloud-feedback");
    box.className = `state-box ${recipe.state}`;
    box.textContent = recipe.feedback;
  }));
}

function renderLowPoint() {
  return `<div class="activity-inner lowpoint-story-activity"><div class="leak-room" id="leak-room"><div class="leak-unit"><b>A3</b><span>R-290 · R-600<br>R-600a · R-1270</span></div><span class="leak-opening">FUITE</span><div class="falling-gas" aria-hidden="true">${"<i></i>".repeat(7)}</div><div class="floor-cloud" aria-hidden="true">${"<i></i>".repeat(9)}</div><div class="worker-figure" aria-hidden="true"><i></i><span></span></div><div class="floor-drain"><b>POINT BAS</b><span>fosse / caniveau</span></div><div class="air-layer">AIR</div><div class="leak-direction">LE GAZ DESCEND ↓</div></div><button type="button" class="play-leak" id="play-leak">▶ Voir la fuite descendre</button><div class="lowpoint-hazards"><div class="lowpoint-hazard fire"><b>1 · INFLAMMATION</b><span>Le nuage peut rencontrer l’air et une ignition.</span></div><div class="lowpoint-hazard breath"><b>2 · RESPIRATION</b><span>En forte concentration et sans ventilation, il peut chasser l’oxygène : risque d’asphyxie.</span></div></div><div class="state-box pending" id="level-feedback">A signifie « toxicité propre plus faible » · cela ne signifie jamais « air respirable ».</div></div>`;
}

function wireLowPoint() {
  const room = $("#leak-room");
  const button = $("#play-leak");
  button.addEventListener("click", () => {
    room.classList.remove("running");
    void room.offsetWidth;
    room.classList.add("running");
    button.textContent = "↻ Rejouer la fuite";
    const box = $("#level-feedback");
    box.className = "state-box neutral";
    box.textContent = "À examiner d’abord · le sol, la fosse et le caniveau. L’emplacement réel du détecteur vient de l’analyse et de sa notice.";
  });
}

function renderLeakAlarm() {
  return `<div class="activity-inner leak-alarm-activity"><div class="alarm-scene" id="alarm-scene"><div class="alarm-detector"><img src="../bibliotheque/icones/ico-detecteur-fuite.png" alt=""><span class="alarm-beacon" aria-hidden="true"></span><b>ALARME GAZ</b></div><div class="alarm-room"><span class="alarm-cloud" aria-hidden="true"></span><span class="alarm-switch"><b>⚡</b><small>interrupteur</small></span><span class="alarm-person" aria-hidden="true"><i></i></span><span class="exit-arrow">SORTIR →</span></div><div class="safe-response-path" aria-label="Conduite à tenir"><span><b>1</b>STOP</span><span><b>2</b>ÉLOIGNER</span><span><b>3</b>ALERTER</span><span><b>4</b>CONSIGNE DU SITE</span></div></div><div class="alarm-choices"><button type="button" data-alarm-choice="light"><b>1</b><span>J’allume et je cherche la fuite</span></button><button type="button" data-alarm-choice="leave"><b>2</b><span>Je m’éloigne, j’alerte et j’applique la consigne</span></button><button type="button" data-alarm-choice="smell"><b>3</b><span>Je reviens sentir pour confirmer</span></button></div><div class="state-box pending" id="alarm-feedback">En attente · quelle action évite d’ajouter l’étincelle manquante ?</div></div>`;
}

function wireLeakAlarm() {
  $$('[data-alarm-choice]').forEach(button => button.addEventListener("click", () => {
    const choice = button.dataset.alarmChoice;
    const good = choice === "leave";
    const box = $("#alarm-feedback");
    if (good) {
      $$('[data-alarm-choice]').forEach(candidate => {
        candidate.disabled = true;
        if (candidate.dataset.alarmChoice === "leave") candidate.classList.add("correct");
      });
      $("#alarm-scene").classList.add("safe");
      box.className = "state-box correct";
      box.textContent = "Conduite juste · STOP, ÉLOIGNER, ALERTER, puis appliquer la consigne du site.";
    } else {
      button.classList.add("wrong");
      box.className = "state-box error";
      box.textContent = choice === "light" ? "DANGER · l’interrupteur peut créer l’étincelle qui manquait au nuage gaz-air." : "DANGER · l’odorat n’est ni un détecteur ni une autorisation d’entrer dans le nuage.";
    }
  }));
}

function renderMachineDossier() {
  return `<div class="activity-inner dossier-activity"><div class="machine-plate"><span>ARMOIRE COMMERCIALE AUTONOME</span><b>R-290</b><strong>CHARGE · 153 g</strong><small>Dossier fabricant · cas IEC 60335-2-89</small></div><div class="plate-actions"><button type="button" data-plate="fluid"><b>R-290</b><span>famille de risque</span></button><button type="button" data-plate="charge"><b>153 g</b><span>masse nominale</span></button><button type="button" data-plate="scope"><b>IEC</b><span>périmètre du calcul</span></button></div><div class="state-box pending" id="plate-feedback">En attente · ouvrez les trois données.</div></div>`;
}

function wireMachineDossier() {
  const seen = new Set();
  const messages = {
    fluid: "Fluide · R-290 impose la prévention propre aux hydrocarbures A3.",
    charge: "Charge · 153 g est la masse de cette machine, pas une limite universelle.",
    scope: "Périmètre · la méthode utilisée concerne cet exemple d’appareil commercial autonome."
  };
  $$('[data-plate]').forEach(button => button.addEventListener("click", () => {
    seen.add(button.dataset.plate); button.setAttribute("aria-pressed", "true");
    const box = $("#plate-feedback");
    box.className = `state-box ${seen.size === 3 ? "correct" : "neutral"}`;
    box.textContent = messages[button.dataset.plate];
  }));
}

function renderAreaCalculation() {
  return `<div class="activity-inner calculation-activity"><div class="scope-banner"><b>CAS DOCUMENTÉ</b><span>appareil commercial autonome · exemple Danfoss / IEC 60335-2-89</span></div><div class="formula"><span>A<sub>min</sub> =</span><div><b>0,153 kg</b><i></i><b>2,2 m × (0,25 × 0,038 kg/m³)</b></div></div><div class="calculation-input"><label for="area-answer">Votre résultat</label><input id="area-answer" type="number" min="0" max="50" step="0.1" inputmode="decimal"><span>m²</span><button type="button" id="check-area">Vérifier</button></div><div class="state-box pending" id="area-feedback">En attente · effectuez d’abord la multiplication du dénominateur.</div></div>`;
}

function wireAreaCalculation() {
  $("#check-area").addEventListener("click", () => {
    const value = Number($("#area-answer").value);
    const good = value >= 7.2 && value <= 7.4;
    const box = $("#area-feedback");
    box.className = `state-box ${good ? "correct" : "error"}`;
    box.textContent = good ? "Calcul juste · 7,3 m² minimum pour cet exemple documenté." : "À reprendre · 0,153 ÷ [2,2 × (0,25 × 0,038)] = 7,3 m² au dixième.";
  });
}

const siteHazards = [
  { id: "exit", label: "Issue encombrée", why: "L’évacuation doit rester possible." },
  { id: "charger", label: "Batterie en charge", why: "Le chargeur et ses contacts sont une ignition possible." },
  { id: "tool", label: "Outil électrique", why: "Matériel ordinaire non évalué pour la zone." },
  { id: "fan", label: "Ventilation non vérifiée", why: "Présence ne signifie pas fonctionnement confirmé." },
  { id: "public", label: "Public dans la zone", why: "L’accès doit être maîtrisé et balisé." },
  { id: "drain", label: "Caniveau", why: "Point bas où une vapeur lourde peut s’accumuler." }
];

function renderWorksiteInspection() {
  return `<div class="activity-inner worksite-activity"><div class="worksite-map" aria-label="Plan pédagogique de la zone de travail">${siteHazards.map((hazard, index) => `<button type="button" class="hazard-pin pin-${hazard.id}" data-hazard="${hazard.id}" aria-label="Inspecter : ${esc(hazard.label)}">${index + 1}</button>`).join("")}<span class="map-cabinet">ARMOIRE<br><b>R-290</b></span><span class="map-exit">SORTIE</span><span class="map-drain" aria-hidden="true"></span><span class="map-copy">zone 6 m × 4 m</span></div><div class="state-box pending" id="hazard-feedback">En attente · ${missionState.hazards.size} / 6 repères examinés.</div></div>`;
}

function wireWorksiteInspection() {
  $$('[data-hazard]').forEach(button => {
    if (missionState.hazards.has(button.dataset.hazard)) button.classList.add("seen");
    button.addEventListener("click", () => {
      const hazard = siteHazards.find(item => item.id === button.dataset.hazard);
      missionState.hazards.add(hazard.id); button.classList.add("seen");
      const complete = missionState.hazards.size === siteHazards.length;
      const box = $("#hazard-feedback");
      box.className = `state-box ${complete ? "correct" : "pending"}`;
      box.textContent = `${complete ? "Inspection complète" : hazard.label} · ${hazard.why} (${missionState.hazards.size} / 6)`;
    });
  });
}

const correctionCases = [
  { id: "ignition", title: "Ignitions", options: ["Les laisser hors champ", "Les retirer ou les neutraliser selon la procédure"], correct: 1 },
  { id: "exit", title: "Issue", options: ["Dégager et maintenir libre", "Déplacer les cartons devant la porte"], correct: 0 },
  { id: "access", title: "Accès", options: ["Laisser circuler", "Balisage et accès maîtrisé"], correct: 1 },
  { id: "systems", title: "Ventilation / détection", options: ["Vérifier les moyens prévus", "Supposer qu’une porte suffit"], correct: 0 }
];

function renderSiteCorrections() {
  return `<div class="activity-inner correction-activity"><div class="correction-grid">${correctionCases.map(item => `<fieldset data-correction="${item.id}"><legend>${esc(item.title)}</legend>${item.options.map((option, index) => `<button type="button" data-correction-choice="${item.id}" data-index="${index}">${esc(option)}</button>`).join("")}</fieldset>`).join("")}</div><div class="state-box pending" id="correction-feedback">En attente · ${missionState.corrections.size} / 4 mesures confirmées.</div></div>`;
}

function wireSiteCorrections() {
  $$('[data-correction-choice]').forEach(button => button.addEventListener("click", () => {
    const item = correctionCases.find(entry => entry.id === button.dataset.correctionChoice);
    const good = Number(button.dataset.index) === item.correct;
    $$(`[data-correction-choice="${item.id}"]`).forEach(candidate => {
      candidate.classList.remove("wrong");
      if (good) {
        candidate.disabled = true;
        if (Number(candidate.dataset.index) === item.correct) candidate.classList.add("correct");
      } else if (candidate === button) candidate.classList.add("wrong");
    });
    if (good) missionState.corrections.add(item.id);
    const complete = missionState.corrections.size === correctionCases.length;
    if (complete) missionState.siteCorrected = true;
    const box = $("#correction-feedback");
    box.className = `state-box ${complete ? "correct" : good ? "pending" : "error"}`;
    box.textContent = complete ? "Zone corrigée · les quatre familles de mesures sont vérifiables." : good ? `Mesure confirmée · ${missionState.corrections.size} / 4.` : "Action insuffisante · la correction doit supprimer ou maîtriser le danger.";
  }));
}

function renderMissionDecision() {
  const corrected = missionState.siteCorrected;
  return `<div class="activity-inner mission-decision"><div class="evidence-board"><div class="evidence ok"><b>IDENTIFICATION</b><span>R-290 · 153 g</span></div><div class="evidence ok"><b>SURFACE</b><span>24 m² ≥ 7,3 m²</span></div><div class="evidence ${corrected ? "ok" : "wait"}" id="zone-evidence"><b>ZONE</b><span>${corrected ? "mesures confirmées" : "corrections à confirmer"}</span></div><div class="evidence wait"><b>OUTILLAGE</b><span>à vérifier au dossier suivant</span></div></div><div class="decision-actions"><button type="button" id="confirm-zone">Confirmer les corrections du scénario</button><button type="button" data-final-decision="stop">STOP maintenant</button><button type="button" data-final-decision="go">GO définitif</button></div><div class="state-box pending" id="mission-feedback">En attente · le GO définitif est impossible tant que l’outillage n’est pas vérifié.</div></div>`;
}

function wireMissionDecision() {
  $("#confirm-zone").addEventListener("click", () => {
    missionState.siteCorrected = true;
    const node = $("#zone-evidence"); node.className = "evidence ok"; $("span", node).textContent = "mesures confirmées";
    $("#mission-feedback").className = "state-box pending";
    $("#mission-feedback").textContent = "Zone prête · il manque encore la preuve de l’outillage. Décision actuelle : STOP conditionnel.";
  });
  $$('[data-final-decision]').forEach(button => button.addEventListener("click", () => {
    const go = button.dataset.finalDecision === "go";
    const box = $("#mission-feedback");
    box.className = `state-box ${go ? "error" : "correct"}`;
    box.textContent = go ? "Trop tôt · l’outillage n’a pas encore été vérifié. Un GO sans toutes les preuves est un mauvais GO." : "Décision juste · STOP conditionnel jusqu’à validation du poste d’outillage.";
  }));
}

const requiredTools = [
  ["Station adaptée", "charge et récupération de fluides inflammables", "ico-station-recup.png"],
  ["Détecteur adapté", "détection de fuite sur fluide inflammable", "ico-detecteur-fuite.png"],
  ["Flexibles HC", "avec obturateurs pour hydrocarbures", "ico-cles.png"],
  ["Manifold HC", "jeu de manomètres prévu pour hydrocarbures", "ico-manifold.png"],
  ["Bouteille par type", "récupération et identification du fluide", "ico-bouteille-recup.png"],
  ["Balance + thermomètre", "masse précise et mesures de fonctionnement", "ico-balance.png"]
];

function renderRequiredTools() {
  return `<div class="activity-inner required-tools"><div class="tool-family-grid">${requiredTools.map((tool, index) => `<button type="button" data-required-tool="${index}"><img src="../bibliotheque/icones/${tool[2]}" alt=""><span><b>${esc(tool[0])}</b><small>${esc(tool[1])}</small></span></button>`).join("")}</div><div class="state-box pending" id="required-tool-feedback">En attente · ouvrez les six familles.</div><p class="source-chip">Arrêté du 21 novembre 2025 · annexe III</p></div>`;
}

function wireRequiredTools() {
  const seen = new Set();
  $$('[data-required-tool]').forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.requiredTool); seen.add(index); button.setAttribute("aria-pressed", "true");
    const box = $("#required-tool-feedback");
    box.className = `state-box ${seen.size === requiredTools.length ? "correct" : "neutral"}`;
    box.textContent = `${requiredTools[index][0]} · ${requiredTools[index][1]}. (${seen.size} / 6)`;
  }));
}

const toolItems = [
  { id: "station", label: "Station marquée fluides inflammables", icon: "ico-station-recup.png", keep: true, why: "adaptée à la charge et à la récupération" },
  { id: "detector-hfc", label: "Détecteur marqué HFC seulement", icon: "ico-detecteur-fuite.png", keep: false, why: "aucune compatibilité hydrocarbures établie" },
  { id: "detector-hc", label: "Détecteur déclaré hydrocarbures", icon: "ico-detecteur-fuite.png", keep: true, why: "adapté aux fluides inflammables" },
  { id: "hose", label: "Flexibles HC avec obturateurs", icon: "ico-cles.png", keep: true, why: "famille et dispositif exigés" },
  { id: "manifold-none", label: "Manifold sans marquage ni notice", icon: "ico-manifold.png", keep: false, why: "preuve de compatibilité absente" },
  { id: "manifold-hc", label: "Manifold déclaré hydrocarbures", icon: "ico-manifold.png", keep: true, why: "usage documenté" },
  { id: "cylinder", label: "Bouteille de récupération identifiée", icon: "ico-bouteille-recup.png", keep: true, why: "prévue par type de fluide" },
  { id: "scale", label: "Balance vérifiée", icon: "ico-balance.png", keep: true, why: "charge mesurée, jamais estimée" },
  { id: "pump", label: "Pompe conforme + conduit de rejet", icon: "ico-pompe-vide.png", keep: true, why: "qualité d’évacuation et rejet hors zone" },
  { id: "fan", label: "Ventilateur domestique quelconque", icon: "ico-interdit.png", keep: false, why: "matériel non évalué pour la zone" }
];

function renderToolSort() {
  return `<div class="activity-inner tool-sort-activity"><div class="tool-deck" id="tool-deck"></div><div class="tool-deck-nav"><button type="button" id="tool-prev">← Objet précédent</button><div class="tool-deck-dots" id="tool-deck-dots" aria-label="Progression dans les dix objets"></div><button type="button" id="tool-next">Objet suivant →</button></div><div class="state-box pending" id="tool-sort-feedback">En attente · 0 / ${toolItems.length} objets classés.</div></div>`;
}

function wireToolSort() {
  let position = 0;
  const deck = $("#tool-deck");
  const previous = $("#tool-prev");
  const next = $("#tool-next");
  const dots = $("#tool-deck-dots");
  const status = $("#tool-sort-feedback");

  const updateStatus = () => {
    const decisions = Object.values(missionState.toolVerdicts);
    const answered = decisions.length;
    const errors = decisions.filter(decision => !decision.good).length;
    status.className = `state-box ${answered === toolItems.length && !errors ? "correct" : errors ? "error" : "pending"}`;
    status.textContent = answered === toolItems.length && !errors
      ? "Poste validé · les dix décisions sont justifiées."
      : `${answered} / ${toolItems.length} classés · ${errors ? `${errors} erreur${errors > 1 ? "s" : ""} à corriger.` : "aucune erreur."}`;
  };

  const draw = () => {
    const item = toolItems[position];
    const decision = missionState.toolVerdicts[item.id];
    deck.innerHTML = `<article class="tool-focus-card ${decision ? (decision.good ? "correct" : "wrong") : ""}"><p>OBJET ${position + 1} / ${toolItems.length}</p><div class="tool-focus-main"><img src="../bibliotheque/icones/${item.icon}" alt=""><b>${esc(item.label)}</b></div><div class="tool-focus-actions"><button type="button" data-tool-decision="keep">PRENDRE</button><button type="button" data-tool-decision="remove">ÉCARTER</button></div><span>${decision ? `${decision.good ? "Juste" : "À corriger"} · ${esc(item.why)}.` : "Décidez à partir du marquage, de la notice et de la fonction attendue."}</span></article>`;
    previous.disabled = position === 0;
    next.disabled = !decision;
    next.textContent = position === toolItems.length - 1 ? "Terminer le contrôle" : "Objet suivant →";
    dots.innerHTML = toolItems.map((tool, index) => `<button type="button" data-tool-index="${index}" class="${index === position ? "current" : ""} ${missionState.toolVerdicts[tool.id] ? (missionState.toolVerdicts[tool.id].good ? "done" : "error") : ""}" aria-label="Objet ${index + 1}${index === position ? ", affiché" : ""}">${index + 1}</button>`).join("");
    $$('[data-tool-decision]', deck).forEach(button => {
      if (decision) button.setAttribute("aria-pressed", String(button.dataset.toolDecision === decision.verdict));
      button.addEventListener("click", () => {
        const verdict = button.dataset.toolDecision;
        missionState.toolVerdicts[item.id] = { verdict, good: (verdict === "keep") === item.keep };
        updateStatus();
        draw();
      });
    });
    $$('[data-tool-index]', dots).forEach(button => button.addEventListener("click", () => {
      position = Number(button.dataset.toolIndex);
      draw();
    }));
  };

  previous.addEventListener("click", () => { if (position > 0) { position -= 1; draw(); } });
  next.addEventListener("click", () => {
    if (position < toolItems.length - 1) { position += 1; draw(); }
    else updateStatus();
  });
  updateStatus();
  draw();
}

function renderPumpSetup() {
  return `<div class="activity-inner pump-activity"><div class="pump-diagram"><div class="pump-machine">CIRCUIT<br><b>déjà récupéré</b></div><span class="pump-line" aria-hidden="true">→</span><div class="pump-unit">POMPE<br>À VIDE</div><span class="pump-line" aria-hidden="true">→</span><div class="pump-outlet" id="pump-outlet">?</div></div><div class="choice-grid compact-choices"><button class="choice-button" type="button" data-pump="room">Rejet dans la zone</button><button class="choice-button" type="button" data-pump="outside">Conduit vers l’extérieur</button></div><div class="state-box pending" id="pump-feedback">En attente · choisissez le trajet du refoulement.</div></div>`;
}

function wirePumpSetup() {
  $$('[data-pump]').forEach(button => button.addEventListener("click", () => {
    const good = button.dataset.pump === "outside";
    $$('[data-pump]').forEach(candidate => { candidate.disabled = true; if (candidate.dataset.pump === "outside") candidate.classList.add("correct"); else if (candidate === button) candidate.classList.add("wrong"); });
    $("#pump-outlet").textContent = good ? "AIR EXTÉRIEUR" : "ZONE";
    const box = $("#pump-feedback"); box.className = `state-box ${good ? "correct" : "error"}`;
    box.textContent = good ? "Montage juste · le refoulement est éloigné de la zone de travail, selon la procédure." : "Montage dangereux · le refoulement ne doit pas enrichir l’atmosphère de la zone.";
  }));
}

function renderSequence(item) {
  const display = [item.sequence[2], item.sequence[0], item.sequence[3], item.sequence[1]];
  return `<div class="activity-inner sequence-activity"><div class="sequence-row">${display.map(entry => `<button class="sequence-button" type="button" data-rank="${entry.rank}"><b>·</b>${esc(entry.label)}</button>`).join("")}</div><div class="state-box pending" id="sequence-feedback">En attente · choisissez la première action.</div><button class="reset-sequence" id="reset-sequence" type="button">Recommencer l’ordre</button></div>`;
}

function wireSequence(item) {
  let chosen = [];
  const reset = () => {
    chosen = [];
    $$('[data-rank]').forEach(button => { button.disabled = false; button.classList.remove("selected", "wrong"); $("b", button).textContent = "·"; });
    $("#sequence-feedback").className = "state-box pending"; $("#sequence-feedback").textContent = "En attente · choisissez la première action.";
  };
  $$('[data-rank]').forEach(button => button.addEventListener("click", () => {
    const expected = chosen.length + 1;
    const rank = Number(button.dataset.rank);
    if (rank !== expected) {
      button.classList.add("wrong");
      $("#sequence-feedback").className = "state-box error";
      $("#sequence-feedback").textContent = `Ordre interrompu · l’action attendue porte le verrou n° ${expected}. Recommencez.`;
      $$('[data-rank]').forEach(candidate => candidate.disabled = true);
      return;
    }
    chosen.push(rank); button.disabled = true; button.classList.add("selected"); $("b", button).textContent = chosen.length;
    const complete = chosen.length === item.sequence.length;
    $("#sequence-feedback").className = `state-box ${complete ? "correct" : "pending"}`;
    $("#sequence-feedback").textContent = complete ? "Séquence juste · chaque verrou prépare le suivant." : `Juste · choisissez maintenant l’action n° ${chosen.length + 1}.`;
  }));
  $("#reset-sequence").addEventListener("click", reset);
}

function renderChargeScale() {
  return `<div class="activity-inner charge-activity"><div class="scale-display"><span>CHARGE MESURÉE</span><output id="charge-value">148 g</output><i></i><b>PLAQUE · 153 g</b></div><label for="charge-range">Ajouter le R-290 par pesée</label><input id="charge-range" type="range" min="145" max="160" step="1" value="148"><div class="state-box pending" id="charge-feedback">En attente · écart de −5 g pour cette machine.</div><p class="source-chip">Valeur de mission, pas valeur type.</p></div>`;
}

function wireChargeScale() {
  const input = $("#charge-range");
  const update = () => {
    const value = Number(input.value), delta = value - 153;
    $("#charge-value").textContent = `${value} g`;
    const box = $("#charge-feedback");
    if (delta === 0) { box.className = "state-box correct"; box.textContent = "Charge juste · 153 g, valeur prescrite sur la plaque de cette machine."; }
    else { box.className = `state-box ${Math.abs(delta) <= 2 ? "pending" : "error"}`; box.textContent = `${delta > 0 ? "Surcharge" : "Sous-charge"} · écart de ${delta > 0 ? "+" : "−"}${Math.abs(delta)} g. Ajustez par pesée.`; }
  };
  input.addEventListener("input", update); update();
}

function renderQuiz(item) {
  const prior = quizAnswers[item.id];
  return `<div class="activity-inner quiz-wrap"><div class="quiz-question">${esc(item.text)}</div><div class="choice-grid">${item.quiz.answers.map((answer, index) => `<button class="choice-button ${prior !== undefined && index === item.quiz.correct ? "correct" : ""} ${prior !== undefined && index === prior && prior !== item.quiz.correct ? "wrong" : ""}" type="button" data-quiz-answer="${index}" ${prior !== undefined ? "disabled" : ""}><span class="choice-index" aria-hidden="true">${index + 1}</span><span class="choice-label">${esc(answer)}</span></button>`).join("")}</div><div class="state-box ${prior === undefined ? "pending" : prior === item.quiz.correct ? "correct" : "error"} quiz-feedback" id="quiz-feedback">${prior === undefined ? "En attente · une seule réponse est juste." : `${prior === item.quiz.correct ? "Correct" : "À revoir"} · ${esc(item.quiz.explanation)}`}</div></div>`;
}

function wireQuiz(item) {
  $$('[data-quiz-answer]').forEach(button => button.addEventListener("click", () => {
    const choice = Number(button.dataset.quizAnswer); quizAnswers[item.id] = choice;
    $$('[data-quiz-answer]').forEach((candidate, index) => { candidate.disabled = true; if (index === item.quiz.correct) candidate.classList.add("correct"); else if (index === choice) candidate.classList.add("wrong"); });
    const good = choice === item.quiz.correct;
    $("#quiz-feedback").className = `state-box ${good ? "correct" : "error"} quiz-feedback`;
    $("#quiz-feedback").textContent = `${good ? "Correct" : "À revoir"} · ${item.quiz.explanation}`;
  }));
}

function quizStats() {
  const quizScreens = screens.filter(item => item.quiz);
  const answered = quizScreens.filter(item => quizAnswers[item.id] !== undefined).length;
  const score = quizScreens.filter(item => quizAnswers[item.id] === item.quiz.correct).length;
  return { total: quizScreens.length, answered, score };
}

function renderScore() {
  const stats = quizStats(), achieved = stats.answered === stats.total && stats.score >= 4;
  const state = stats.answered < stats.total ? "pending" : achieved ? "correct" : "error";
  return `<div class="activity-inner score-panel"><span class="score-value">${stats.score} / ${stats.total}</span><h3>${achieved ? "Décisions solides" : stats.answered < stats.total ? "Contrôle incomplet" : "À reprendre"}</h3><p>${stats.answered} / ${stats.total} réponses enregistrées · seuil pédagogique 4/5.</p><div class="state-box ${state}">${stats.answered < stats.total ? "Terminez les cinq questions." : achieved ? "Vous reliez le risque aux gestes et à l’outillage." : "Relisez les corrections et recommencez."}</div><div class="handoff-card"><b>SUITE DU PARCOURS</b><span>g12b · intervenir sur le circuit hydrocarbure, étape par étape</span></div><div class="score-actions"><button class="nav-button secondary" id="restart-quiz" type="button">Recommencer le contrôle</button><button class="nav-button" id="restart-module" type="button">Reprendre la mission</button></div></div>`;
}

function wireScore() {
  $("#restart-quiz").addEventListener("click", () => { Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]); goToId("quiz-pourquoi"); });
  $("#restart-module").addEventListener("click", () => { Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]); resetMission(); goToId("mission-290"); });
}

function resetMission() {
  missionState.hazards.clear(); missionState.corrections.clear(); missionState.siteCorrected = false; missionState.toolVerdicts = {};
}

function renderHome() {
  $("#dossier-grid").innerHTML = dossiers.map((dossier, index) => `<button class="dossier-card" type="button" data-open-dossier="${dossier.id}"><img src="../bibliotheque/icones/${dossier.icon}" alt=""><span><b>${index + 1}. ${dossier.titre}</b><small>${dossier.resume}</small></span></button>`).join("");
  $$('[data-open-dossier]').forEach(button => button.addEventListener("click", () => startCourse(button.dataset.openDossier)));
}

function startCourse(dossierId = "comprendre", screenNumber = 1) {
  extractMode = false; activeScreens = screens;
  const list = screens.filter(item => item.dossier === dossierId);
  const selected = list[Math.max(0, Math.min(list.length - 1, Number(screenNumber || 1) - 1))] || screens[0];
  current = screens.indexOf(selected); furthest = Math.max(furthest, current); showCourse(); renderCurrent(false);
}

function startExtract(ids) {
  const unique = [];
  ids.forEach(id => { const item = screens.find(candidate => candidate.id === id); if (item && !unique.includes(item)) unique.push(item); });
  if (!unique.length) { showStatus("Aucun écran nommé n’a été trouvé. Le sommaire complet est affiché."); showHome(); return; }
  extractMode = true; activeScreens = unique; current = 0; furthest = 0; showCourse(); renderCurrent(false);
}

function showCourse() {
  $("#home").hidden = true; $("#course-shell").hidden = false; $("#exit-button").hidden = false; $("#home-button").hidden = false;
  $("#home-button").textContent = extractMode ? "Module entier" : "Sommaire";
  $("#mode-badge").textContent = extractMode ? `Extrait · ${activeScreens.length} écran${activeScreens.length > 1 ? "s" : ""}` : "Mission complète";
  document.body.classList.add("course-running");
}

function showHome() {
  stopSpeech(); extractMode = false; activeScreens = screens;
  $("#home").hidden = false; $("#course-shell").hidden = true; $("#exit-button").hidden = true; $("#home-button").hidden = true;
  $("#mode-badge").textContent = "Mission complète"; document.body.classList.remove("course-running", "summary-running");
  const url = new URL(location.href); url.search = ""; history.replaceState({}, "", url);
}

function currentItem() { return activeScreens[current]; }

function renderCurrent(moveFocus = true) {
  stopSpeech(false); const item = currentItem(); if (!item) return; furthest = Math.max(furthest, current);
  document.body.classList.toggle("summary-running", item.id === "bilan");
  $("#lesson-kicker").textContent = `${dossiers.find(dossier => dossier.id === item.dossier)?.titre || "Extrait"} · ${item.niveau}`;
  $("#lesson-title").textContent = item.title; $("#lesson-text").textContent = item.text; $("#action-prompt").textContent = item.prompt; $("#screen-visual").innerHTML = renderScreenVisual(item);
  $("#activity-zone").innerHTML = item.render(item); if (item.wire) item.wire(item);
  renderReference(item); renderStepper(item); renderNavigation(); updateUrl(item);
  if (moveFocus) $("#lesson-title").focus({ preventScroll: true });
  if (autoplay) setTimeout(() => speakCurrent(), 350);
}

function renderReference(item) {
  $("#reference-box").innerHTML = item.codes.length ? `<b>référentiel</b> ${item.codes.map(code => `<span class="code-pill">${code}</span>`).join("")}` : "<b>contexte</b> · hors preuve de couverture";
}

function renderStepper(item) {
  const stepper = $("#stepper");
  if (extractMode) {
    stepper.innerHTML = activeScreens.map((screenItem, index) => `<button class="step-button ${index === current ? "active" : ""} ${index < furthest ? "done" : ""}" type="button" data-jump="${index}" ${index === current ? 'aria-current="step"' : ""}><b>${index + 1}. ${esc(screenItem.short)}</b><small>${esc(screenItem.dossier)}</small></button>`).join("");
  } else {
    stepper.innerHTML = dossiers.map(dossier => {
      const firstIndex = screens.findIndex(screenItem => screenItem.dossier === dossier.id);
      const lastIndex = screens.reduce((found, screenItem, index) => screenItem.dossier === dossier.id ? index : found, firstIndex);
      const active = item.dossier === dossier.id, done = furthest > lastIndex;
      return `<button class="step-button ${active ? "active" : ""} ${done ? "done" : ""}" type="button" data-jump="${firstIndex}" ${active ? 'aria-current="step"' : ""}><span class="step-number" aria-hidden="true">${dossiers.indexOf(dossier) + 1}</span><span><b>${esc(dossier.court)}</b><small>${screens.filter(screenItem => screenItem.dossier === dossier.id).length} écrans</small></span></button>`;
    }).join("");
  }
  $$('[data-jump]').forEach(button => button.addEventListener("click", () => goTo(Number(button.dataset.jump))));
  $("#rail-mode").textContent = extractMode ? "EXTRAIT" : "MISSION 290"; $("#rail-progress").textContent = `${current + 1} / ${activeScreens.length}`;
  $("#progress-bar").style.width = `${((current + 1) / activeScreens.length) * 100}%`;
  $("#progress-copy").textContent = extractMode ? "Navigation réduite" : dossiers.find(dossier => dossier.id === item.dossier)?.resume || "";
}

function renderNavigation() {
  const previousButton = $("#prev-button"), nextButton = $("#next-button"); previousButton.disabled = current === 0; nextButton.disabled = false;
  if (current === activeScreens.length - 1) nextButton.textContent = extractMode ? "Module entier →" : "Terminer";
  else if (activeScreens[current + 1]?.id === "bilan") nextButton.textContent = "Voir le bilan →";
  else nextButton.textContent = "Suivant →";
}

function goTo(index) { if (Number.isInteger(index) && index >= 0 && index < activeScreens.length) { current = index; renderCurrent(); } }
function goToId(id) { const index = activeScreens.findIndex(item => item.id === id); if (index >= 0) goTo(index); }
function next() { if (current < activeScreens.length - 1) goTo(current + 1); else if (extractMode) location.href = location.pathname; else showHome(); }
function previous() { if (current > 0) goTo(current - 1); }

function updateUrl(item) {
  if (extractMode) return;
  const url = new URL(location.href), inDossier = screens.filter(candidate => candidate.dossier === item.dossier);
  url.search = `?dossier=${encodeURIComponent(item.dossier)}&ecran=${inDossier.indexOf(item) + 1}`; history.replaceState({}, "", url);
}

function copyCurrentLink() {
  const url = new URL(location.href); url.search = `?extrait=${encodeURIComponent(currentItem().id)}`; const value = url.href;
  const fallback = () => { const area = document.createElement("textarea"); area.value = value; area.setAttribute("readonly", ""); area.style.position = "fixed"; area.style.opacity = "0"; document.body.appendChild(area); area.select(); const copied = document.execCommand("copy"); area.remove(); if (!copied) throw new Error("copy failed"); };
  const operation = navigator.clipboard?.writeText ? navigator.clipboard.writeText(value) : Promise.resolve().then(fallback);
  operation.then(() => showStatus("Lien de cet écran copié.")).catch(() => showStatus(`Copie impossible. Adresse : ${value}`));
}

function showStatus(message) {
  const node = $("#status-message"); if (!node) return; clearTimeout(statusTimer); node.textContent = message; node.classList.add("show");
  statusTimer = setTimeout(() => node.classList.remove("show"), 3200);
}

function bestFrenchVoice() {
  const voices = speechSynthesis.getVoices(), quality = /natural|naturel|neural|online|google|microsoft/i;
  return voices.find(voice => voice.lang?.toLowerCase() === "fr-fr" && quality.test(voice.name)) || voices.find(voice => voice.lang?.toLowerCase() === "fr-fr") || voices.find(voice => voice.lang?.toLowerCase().startsWith("fr") && quality.test(voice.name)) || voices.find(voice => voice.lang?.toLowerCase().startsWith("fr")) || voices[0];
}

function speechSupported() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }

function speakCurrent() {
  if (!speechSupported()) { showStatus("La voix de synthèse n’est pas disponible. Tout le texte reste visible."); return; }
  const item = currentItem(); stopSpeech(false); autoplay = true; const run = speechRun;
  const utterance = new SpeechSynthesisUtterance(`${item.title}. ${item.text} ${item.prompt}`); utterance.lang = "fr-FR"; utterance.pitch = 1; utterance.rate = voiceRates[rateIndex];
  const voice = bestFrenchVoice(); if (voice) utterance.voice = voice;
  utterance.onstart = () => { if (run !== speechRun) return; speaking = true; paused = false; updateVoiceButtons(); };
  utterance.onend = () => { if (run !== speechRun) return; speaking = false; paused = false; updateVoiceButtons(); };
  utterance.onerror = event => { if (run !== speechRun || event.error === "canceled" || event.error === "interrupted") return; speaking = false; paused = false; updateVoiceButtons(); showStatus("Lecture indisponible. Le contenu écrit reste complet."); };
  speechSynthesis.speak(utterance);
}

function toggleSpeech() {
  if (!speechSupported()) return speakCurrent();
  if (speaking && !paused) { speechSynthesis.pause(); paused = true; updateVoiceButtons(); }
  else if (speaking && paused) { speechSynthesis.resume(); paused = false; updateVoiceButtons(); }
  else speakCurrent();
}

function stopSpeech(disableAutoplay = true) {
  speechRun += 1; if (speechSupported()) speechSynthesis.cancel(); speaking = false; paused = false; if (disableAutoplay) autoplay = false; updateVoiceButtons();
}

function updateVoiceButtons() {
  const listen = $("#listen"), stop = $("#stop-voice"); if (!listen || !stop) return;
  const label = speaking ? (paused ? "Reprendre" : "Pause") : "Écouter"; listen.setAttribute("aria-pressed", String(speaking && !paused)); listen.setAttribute("aria-label", label);
  $("span:last-child", listen).textContent = label; $("span:first-child", listen).textContent = speaking && !paused ? "Ⅱ" : "▶"; stop.disabled = !speaking;
}

function changeRate(direction) {
  rateIndex = Math.max(0, Math.min(voiceRates.length - 1, rateIndex + direction)); saveRate(); $("#speed-value").textContent = `${voiceRates[rateIndex].toFixed(2).replace(".", ",")}×`; if (speaking) speakCurrent();
}

function buildPrintBook() {
  $("#print-book").innerHTML = `<section class="print-cover"><p>inerWeb Édu · Pilote Fluides · Habilitation A1/A2</p><h1>Mission 290 — travailler en sécurité avec un hydrocarbure</h1><p class="print-purpose">Version papier du module interactif. Le cas de calcul à 153 g est strictement limité à l’exemple documenté d’un appareil commercial autonome ; la norme et la notice de l’équipement réel restent prioritaires.</p></section>${screens.map((item, index) => {
    const quiz = item.quiz ? `<h3>Question</h3><ul>${item.quiz.answers.map(answer => `<li>${esc(answer)}</li>`).join("")}</ul><div class="print-correction"><strong>Correction :</strong> ${esc(item.quiz.answers[item.quiz.correct])}. ${esc(item.quiz.explanation)}</div>` : "";
    return `<article class="print-screen"><p class="print-meta">Écran ${index + 1} · ${esc(item.id)} · ${esc(item.niveau)}</p><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p><p><strong>À faire :</strong> ${esc(item.prompt || "Lire et retenir le point clé.")}</p><p>${esc(item.print)}</p>${quiz}<p class="print-codes">${item.codes.length ? `référentiel · ${item.codes.join(" · ")}` : "contexte · hors preuve de couverture"}</p></article>`;
  }).join("")}`;
}

function handleInitialUrl() {
  const params = new URLSearchParams(location.search), extract = params.get("extrait");
  if (extract) { startExtract(extract.split(",").map(id => id.trim()).filter(Boolean)); return; }
  const dossier = params.get("dossier"); if (dossier && dossiers.some(item => item.id === dossier)) { startCourse(dossier, params.get("ecran") || 1); return; }
  activeScreens = screens; showHome();
}

function bindGlobalEvents() {
  $("#start-button").addEventListener("click", () => startCourse("comprendre", 1)); $("#prev-button").addEventListener("click", previous); $("#next-button").addEventListener("click", next);
  $("#exit-button").addEventListener("click", showHome); $("#home-button").addEventListener("click", () => extractMode ? (location.href = location.pathname) : showHome());
  $("#copy-link").addEventListener("click", copyCurrentLink); $("#listen").addEventListener("click", toggleSpeech); $("#stop-voice").addEventListener("click", () => stopSpeech());
  $("#slower").addEventListener("click", () => changeRate(-1)); $("#faster").addEventListener("click", () => changeRate(1));
  document.addEventListener("keydown", event => {
    if ($("#course-shell").hidden) return; const tag = event.target?.tagName; if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(tag)) return;
    if (event.key === "ArrowRight") next(); if (event.key === "ArrowLeft") previous(); if (event.key === "Escape") showHome(); if (event.key === " " && speaking) { event.preventDefault(); toggleSpeech(); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); }); window.addEventListener("beforeunload", () => stopSpeech()); window.addEventListener("popstate", () => location.reload());
  if (speechSupported()) speechSynthesis.addEventListener?.("voiceschanged", bestFrenchVoice);
}

renderHome(); buildPrintBook(); bindGlobalEvents(); $("#speed-value").textContent = `${voiceRates[rateIndex].toFixed(2).replace(".", ",")}×`;
if (!speechSupported()) { $("#listen").disabled = true; $("#stop-voice").disabled = true; }
handleInitialUrl();
