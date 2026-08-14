(function initialiseSolenoidValveCourse() {
  "use strict";

  const STORAGE_RATE = "inerweb-electrovanne-rate";
  const RATE_VALUES = [0.8, 0.95, 1.1, 1.25];
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
    voiceButton: document.getElementById("voice-button"),
    voiceRate: document.getElementById("voice-rate"),
    sourceButton: document.getElementById("source-button"),
    sourcesDialog: document.getElementById("sources-dialog"),
    status: document.getElementById("app-status")
  };

  let current = 0;
  let furthest = 0;
  let speechRun = 0;
  let speaking = false;
  let paused = false;
  let selectedVoice = null;
  let voiceRate = readRate();

  const quiz = { index: 0, score: 0, answered: false, complete: false };
  const quizQuestions = [
    {
      prompt: "Que signifie « normalement fermée » pour une électrovanne ?",
      answers: ["Elle est fermée quand la bobine n’est pas alimentée", "Elle reste toujours fermée", "Elle se ferme uniquement quand la bobine est alimentée"],
      correct: 0,
      why: "Le mot « normalement » décrit l’état de repos, bobine hors tension. NF signifie donc fermée hors tension."
    },
    {
      prompt: "Quel est le rôle de la bobine lorsqu’elle est alimentée ?",
      answers: ["Elle refroidit le fluide qui traverse le corps de la vanne", "Elle crée un champ magnétique qui déplace le noyau mobile", "Elle mesure le débit qui circule dans la ligne liquide"],
      correct: 1,
      why: "La bobine transforme l’ordre électrique en champ magnétique. Ce champ déplace le noyau mobile et commande l’obturateur ou un pilote."
    },
    {
      prompt: "Toutes les électrovannes utilisent-elles exactement le même mécanisme interne ?",
      answers: ["Oui, le mécanisme interne ne dépend que de la taille du corps", "Non, seul le diamètre de raccordement change d’un modèle à l’autre", "Non, il existe l’action directe et la commande assistée"],
      correct: 2,
      why: "En action directe, le noyau agit sur l’orifice principal. En commande assistée, le pilote modifie la pression au-dessus d’une membrane ou d’un piston."
    },
    {
      prompt: "Dans quel état se trouve une électrovanne normalement ouverte (NO) hors tension ?",
      answers: ["Fermée", "Ouverte", "Toujours dans une position intermédiaire"],
      correct: 1,
      why: "NO signifie normalement ouverte : son état de repos, sans alimentation de la bobine, est ouvert."
    },
    {
      prompt: "Avant de choisir une bobine, que faut-il vérifier ?",
      answers: ["La couleur du boîtier et la longueur du câble fourni", "Le diamètre du tube et la marque du détendeur voisin", "Le marquage électrique et la compatibilité mécanique"],
      correct: 2,
      why: "La tension, la fréquence ou le courant, la puissance et la compatibilité mécanique doivent correspondre à la commande et au corps de vanne."
    },
    {
      prompt: "Que faire de l’alimentation avant de déposer la bobine ?",
      answers: ["La couper et la consigner avant de toucher la bobine", "La laisser en service pour vérifier le champ magnétique", "La réduire le temps de sortir la bobine de son tube"],
      correct: 0,
      why: "Une bobine déposée ne travaille plus dans les conditions prévues. Il faut couper et consigner avant de la retirer."
    },
    {
      prompt: "Une vanne NF n’est plus étanche alors que la bobine est hors tension. Quelle cause mécanique est plausible ?",
      answers: ["Une bobine dont la tension d’alimentation est trop faible", "Une particule coincée entre l’obturateur et le siège", "Un détendeur mal réglé placé juste après la vanne"],
      correct: 1,
      why: "Un copeau ou une autre particule peut empêcher le contact complet avec le siège. Le passage reste alors légèrement ouvert. Toute ouverture du corps exige d’abord consignation, récupération et pression nulle."
    }
  ];

  const lessons = [
    {
      short: "Reconnaître",
      kicker: "Écran 1 · Observer",
      title: "Reconnaître l’électrovanne complète",
      intro: "Le corps conduit le fluide. La bobine électrique se place autour du tube du noyau mobile pour commander l’ouverture ou la fermeture.",
      detail: `<div class="fact"><strong>Corps nu :</strong> le grand tube métallique visible reçoit la bobine ; ce tube n’est pas la bobine.</div>
        <div class="key-box"><strong>Ensemble complet :</strong> corps + tube du noyau + bobine adaptée + raccordement électrique.</div>`,
      takeaway: "Je distingue la partie frigorifique de l’actionneur électrique.",
      visualTitle: "Du corps nu à l’ensemble commandé",
      visualHint: "Ajoute ou retire la bobine.",
      caption: "Vue extérieure générique en SVG original ; aucune géométrie de constructeur n’est reproduite.",
      render: renderRecognise
    },
    {
      short: "Placer",
      kicker: "Écran 2 · Circuit",
      title: "Dans le circuit étudié, elle autorise ou bloque le passage",
      intro: "Sur cette ligne liquide de référence, l’électrovanne se trouve avant le détendeur et peut interrompre à distance l’arrivée de fluide.",
      detail: `<div class="fact"><strong>Pourquoi on coupe ici :</strong> fermer l’arrivée de liquide avant d’arrêter le compresseur permet de vider la partie basse du circuit. C’est l’arrêt par tirage au vide. Une fois la machine à l’arrêt, le liquide ne peut plus rejoindre le compresseur.</div>
        <div class="warning-box"><strong>Frontière :</strong> ce placement est un exemple. La fonction, le fluide et la documentation du modèle déterminent l’implantation réelle.</div>`,
      takeaway: "Couper l’arrivée de liquide n’est pas un but : c’est ce qui protège le compresseur à l’arrêt.",
      visualTitle: "Repérer l’organe commandé",
      visualHint: "Sélectionne l’électrovanne.",
      caption: "Schéma de ligne liquide de référence ; il ne remplace pas le schéma de l’installation.",
      render: renderPlacement
    },
    {
      short: "Commander",
      kicker: "Écran 3 · Rôle",
      title: "Une commande électrique agit sur un passage fluidique",
      intro: "Un thermostat, un automate ou une chaîne de sécurité peut commander la bobine selon le schéma électrique de l’installation.",
      detail: `<div class="key-box"><strong>Deux mondes :</strong> le circuit de commande alimente la bobine ; la vanne agit sur le fluide.</div>
        <div class="warning-box"><strong>Ce qu’elle ne fait pas :</strong> l’électrovanne n’est ni un détendeur ni un organe de réglage continu.</div>`,
      takeaway: "La bobine reçoit un ordre tout ou rien ; la vanne ouvre ou ferme un passage.",
      visualTitle: "Suivre la chaîne de commande",
      visualHint: "Bascule l’ordre électrique.",
      caption: "Animation de principe : aucune tension ni logique d’automate n’est imposée.",
      render: renderCommand
    },
    {
      short: "Ouvrir",
      kicker: "Écran 4 · Construction",
      title: "Voir les pièces qui produisent le mouvement",
      intro: "La bobine crée le champ magnétique. Le noyau mobile transmet le mouvement à l’obturateur qui ferme le siège.",
      detail: `<ul><li><strong>Bobine :</strong> actionneur électrique amovible.</li>
        <li><strong>Tube et noyau mobile :</strong> guident le mouvement magnétique.</li>
        <li><strong>Ressort :</strong> participe au retour hors tension.</li>
        <li><strong>Obturateur et siège :</strong> ferment le passage dans le corps.</li></ul>`,
      takeaway: "Le noyau mobile transforme l’effet magnétique en mouvement mécanique.",
      visualTitle: "Coupe pédagogique d’une électrovanne directe NF",
      visualHint: "Clique une pièce pour lire sa fonction.",
      caption: "Hachures = matière coupée ; blanc = cavité et passage. Coupe de principe, sans cote constructeur.",
      render: renderConstruction
    },
    {
      short: "Hors tension",
      kicker: "Écran 5 · État normal",
      title: "NF : hors tension, la vanne est fermée",
      intro: "Sans courant dans la bobine, aucun champ magnétique ne maintient le noyau en position attirée.",
      detail: `<div class="fact"><strong>Exemple direct NF :</strong> le ressort ramène l’obturateur sur le siège. Les pressions peuvent aussi influencer l’effort selon la construction.</div>
        <div class="warning-box"><strong>Vocabulaire :</strong> « normalement fermée » décrit l’état hors tension, pas un ordre permanent.</div>`,
      takeaway: "Électrovanne NF + bobine hors tension = passage fermé.",
      visualTitle: "Observer l’état fermé",
      visualHint: "Compare le courant, la position et le débit.",
      caption: "Coupe de principe : la matière reste hachurée et le passage intérieur reste blanc.",
      render: renderClosed
    },
    {
      short: "Alimenter",
      kicker: "Écran 6 · Action directe",
      title: "En action directe, le noyau agit sur l’orifice principal",
      intro: "Sur l’exemple NF, le champ magnétique attire le noyau mobile. L’obturateur quitte le siège et le passage s’ouvre.",
      detail: `<div class="key-box"><strong>Action directe :</strong> le mouvement du noyau commande lui-même l’obturateur de l’orifice principal.</div>
        <div class="warning-box"><strong>À vérifier :</strong> les pressions admissibles et les conditions d’ouverture dépendent du modèle sélectionné.</div>`,
      takeaway: "Bobine alimentée → noyau attiré → siège dégagé → passage ouvert.",
      visualTitle: "Faire agir le champ magnétique",
      visualHint: "Alimente puis coupe la bobine.",
      caption: "Le mouvement est amplifié pour être lisible ; les hachures distinguent la matière de la cavité.",
      render: renderOpen
    },
    {
      short: "Comparer",
      kicker: "Écran 7 · Famille",
      title: "Action directe et commande assistée sont deux principes différents",
      intro: "Une électrovanne peut agir directement sur l’orifice principal ou utiliser la pression du fluide pour assister le mouvement.",
      detail: `<div class="fact"><strong>Action directe :</strong> le noyau mobile commande directement l’obturateur principal.</div>
        <div class="warning-box"><strong>Commande assistée :</strong> un petit orifice d’équilibrage amène la pression amont au-dessus de la membrane. Le pilote libère ensuite cette pression pour permettre l’ouverture.</div>`,
      takeaway: "Sur la ligne liquide étudiée, la pression amont est la HP. Sur une autre ligne, je garde le mot « amont ».",
      visualTitle: "Deux mécanismes, un même ordre électrique",
      visualHint: "Compare directe, assistée fermée et assistée ouverte.",
      caption: "Coupes fonctionnelles génériques : matière hachurée, passages blancs et flux coloré.",
      render: renderPrinciples
    },
    {
      short: "Distinguer NF/NO",
      kicker: "Écran 8 · État de repos",
      title: "NF et NO décrivent l’état hors tension",
      intro: "La lettre F ou O indique la position normale de la vanne lorsque la bobine n’est pas alimentée.",
      detail: `<div class="fact"><strong>NF :</strong> normalement fermée, donc fermée hors tension.</div>
        <div class="key-box"><strong>NO :</strong> normalement ouverte, donc ouverte hors tension.</div>`,
      takeaway: "Je lis toujours NF ou NO avant de déduire l’effet de l’alimentation.",
      visualTitle: "Comparer les deux fonctions",
      visualHint: "Affiche NF puis NO.",
      caption: "Les états sont écrits en toutes lettres : la couleur ne porte pas seule l’information.",
      render: renderNormalModes
    },
    {
      short: "Orienter",
      kicker: "Écran 9 · Sens",
      title: "Le sens et l’orientation viennent de la notice",
      intro: "La flèche portée par le corps indique le sens de circulation prévu pour la vanne étudiée.",
      detail: `<div class="key-box"><strong>Avant montage :</strong> identifier entrée, sortie, type NF ou NO et plage d’orientation autorisée.</div>
        <div class="warning-box"><strong>Le piège :</strong> retourner la vanne parce que les raccords semblent symétriques.</div>`,
      takeaway: "Je monte la vanne dans le sens de la flèche et dans l’orientation autorisée.",
      visualTitle: "Lire le sens avant de braser",
      visualHint: "Choisis le montage cohérent.",
      caption: "L’enveloppe angulaire exacte dépend du modèle ; la notice réelle reste prioritaire.",
      render: renderOrientation
    },
    {
      short: "Choisir bobine",
      kicker: "Écran 10 · Marquage",
      title: "La bobine doit correspondre à la commande et au corps",
      intro: "Une forme compatible ne suffit pas : le marquage électrique et la référence d’actionneur doivent être contrôlés.",
      detail: `<div class="fact"><strong>À lire :</strong> tension, fréquence ou courant continu, puissance et référence.</div>
        <div class="warning-box"><strong>À éviter :</strong> choisir « à l’œil » ou alimenter pour essayer.</div>`,
      takeaway: "Je compare le schéma, la plaque de la bobine et la compatibilité de la vanne.",
      visualTitle: "Contrôler les informations utiles",
      visualHint: "Active les trois contrôles nécessaires.",
      caption: "Aucune valeur universelle de bobine n’est fournie ; le marquage du matériel fait foi.",
      render: renderCoilChoice
    },
    {
      short: "Installer",
      kicker: "Écran 11 · Montage",
      title: "Protéger le corps et respecter la notice",
      intro: "Lorsqu’un brasage est prévu, la chaleur peut déformer une membrane ou détériorer des joints sensibles si elle atteint le corps.",
      detail: `<div class="fact"><strong>Protection courante :</strong> retirer la bobine et entourer le corps d’un chiffon humide lorsque la notice prévoit cette méthode.</div>
        <div class="warning-box"><strong>Démontage :</strong> certains corps permettent ou imposent la dépose de la pièce supérieure. La notice décide ; la taille seule ne suffit pas.</div>`,
      takeaway: "Je garde la flamme au raccord, je protège le corps et je suis la procédure du modèle.",
      visualTitle: "Trois phases d’un montage brasé",
      visualHint: "Parcours la préparation, la protection et le contrôle.",
      caption: "Séquence générale : la procédure et les limites du modèle restent prioritaires.",
      render: renderInstallation
    },
    {
      short: "Déposer bobine",
      kicker: "Écran 12 · Sécurité électrique",
      title: "Une bobine déposée ne doit jamais rester alimentée",
      intro: "Retirée du tube du noyau, la bobine perd les conditions prévues pour son fonctionnement.",
      detail: `<div class="warning-box"><strong>Règle de sécurité :</strong> couper l’alimentation avant la dépose. Une bobine déposée et alimentée peut être endommagée et provoquer une brûlure.</div>
        <p><strong>Avant contact :</strong> appliquer la consignation électrique prévue et tenir compte de l’échauffement.</p>`,
      takeaway: "Je coupe, je consigne, puis seulement je retire la bobine.",
      visualTitle: "Comparer la situation sûre et dangereuse",
      visualHint: "Retire la bobine puis mets la situation en sécurité.",
      caption: "Le module ne remplace pas une procédure de consignation électrique.",
      render: renderCoilSafety
    },
    {
      short: "Diagnostiquer",
      kicker: "Écran 13 · Méthode",
      title: "Relier le symptôme à une famille de défauts",
      intro: "Une particule, un pilote obstrué ou une bobine mal alimentée ne produisent pas le même symptôme.",
      detail: `<div class="key-box"><strong>Cas courant :</strong> un copeau entre le siège et l’obturateur ou la membrane empêche la fermeture complète et crée une fuite interne.</div>
        <div class="warning-box"><strong>Avant mécanique :</strong> couper et consigner l’électricité, isoler, récupérer le fluide et obtenir zéro pression selon la procédure.</div>`,
      takeaway: "Je diagnostique sans contourner la sécurité ni ouvrir sous pression.",
      visualTitle: "Suivre un chemin de contrôle",
      visualHint: "Choisis le symptôme observé.",
      caption: "Aucune mesure sous tension ni opération frigorifique n’est prescrite par ce module.",
      render: renderDiagnosis
    },
    {
      short: "Défi",
      kicker: "Écran 14 · Vérifier",
      title: "Relier commande, mouvement et sécurité",
      intro: "Sept situations vérifient NF/NO, le rôle de la bobine, les principes de fonctionnement, le montage et la sécurité.",
      detail: `<div class="key-box"><strong>Objectif :</strong> obtenir au moins 6 bonnes réponses sur 7.</div>
        <p>Chaque réponse est corrigée immédiatement.</p>`,
      takeaway: "Je distingue l’ordre électrique, l’état fluidique et les limites de l’intervention.",
      visualTitle: "Défi final",
      visualHint: "Une seule réponse par situation.",
      caption: "Quiz formatif : recommence autant de fois que nécessaire.",
      render: renderQuiz
    }
  ];

  function exteriorSvg(withCoil = true) {
    return `<div class="diagram ev-exterior" role="img" aria-label="Électrovanne ${withCoil ? "complète avec bobine" : "sans bobine, tube du noyau visible"}">
      <svg viewBox="0 0 760 410" aria-hidden="true">
        <defs>
          <linearGradient id="brass" x1="0" x2="1"><stop offset="0" stop-color="#d6aa45"/><stop offset=".5" stop-color="#f3d47c"/><stop offset="1" stop-color="#b78328"/></linearGradient>
          <linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#8e9aa5"/><stop offset=".45" stop-color="#edf2f4"/><stop offset="1" stop-color="#74828f"/></linearGradient>
        </defs>
        <path class="ev-pipe" d="M56 250 H222 M538 250 H704"/>
        <path class="ev-body" fill="url(#brass)" d="M205 196 H282 L318 166 H442 L478 196 H555 V304 H476 L440 334 H320 L284 304 H205 Z"/>
        <path class="ev-channel" d="M205 250 H555"/>
        <rect class="ev-cover" x="296" y="154" width="168" height="56" rx="17"/>
        <rect class="ev-neck" fill="url(#steel)" x="348" y="55" width="64" height="118" rx="24"/>
        <ellipse class="ev-neck-top" cx="380" cy="56" rx="32" ry="11"/>
        ${withCoil ? `<g class="ev-coil"><rect x="306" y="66" width="148" height="118" rx="22"/><path d="M326 91 H434 M326 111 H434 M326 131 H434 M326 151 H434"/><rect class="ev-plug" x="447" y="104" width="82" height="48" rx="10"/><path class="ev-wire" d="M529 128 H684"/></g>` : `<g class="ev-bare-note"><path d="M414 78 L548 49"/><text x="558" y="53">TUBE DU NOYAU</text></g>`}
        <path class="ev-flow-arrow" d="M111 228 L154 250 L111 272 Z"/>
        <text class="ev-label" x="380" y="384">${withCoil ? "ENSEMBLE COMPLET" : "CORPS NU · BOBINE RETIRÉE"}</text>
      </svg>
    </div>`;
  }

  function liquidLineSvg() {
    return `<div class="diagram library-line" role="img" aria-label="Ligne liquide : bouteille, filtre-déshydrateur, voyant liquide, électrovanne et détendeur">
      <svg viewBox="0 0 980 340" aria-hidden="true">
        <text class="svg-title" x="490" y="34" text-anchor="middle">Ligne liquide de référence</text>
        <rect class="liquid-line-zone" x="260" y="62" width="645" height="190" rx="22"/>
        <text class="liquid-line-title" x="275" y="90">LIGNE LIQUIDE</text>
        <path class="connector-pipe" d="M168 170 H300 M390 170 H448 M548 170 H618 M708 170 H832"/>
        <path class="connector-flow flow-pass mobile" d="M168 170 H300 M390 170 H448 M548 170 H618 M708 170 H832"/>
        <g class="library-symbol"><image href="assets/symboles/bouteille_liquide.svg" x="42" y="114" width="150" height="90"/><text class="symbol-name" x="117" y="234">BOUTEILLE</text></g>
        <g class="library-symbol"><image href="assets/symboles/filtre_deshydrateur.svg" x="292" y="141" width="110" height="58"/><text class="symbol-name" x="347" y="234">FILTRE</text></g>
        <g class="library-symbol"><image href="assets/symboles/voyant_liquide.svg" x="437" y="137" width="122" height="64"/><text class="symbol-name" x="498" y="234">VOYANT</text></g>
        <g class="library-symbol solenoid-location symbol-focus"><image href="assets/symboles/electrovanne_frigo.svg" x="604" y="118" width="112" height="88"/><text class="symbol-name" x="660" y="234">ÉLECTROVANNE</text></g>
        <g class="library-symbol"><image href="assets/symboles/detendeur_thermo_ext.svg" x="812" y="93" width="118" height="132"/><text class="symbol-name" x="871" y="245">DÉTENDEUR</text></g>
        <path class="zone-bracket" d="M606 263 V283 H715 V263"/>
        <text class="zone-bracket-label" x="660" y="309">ORGANE COMMANDÉ</text>
      </svg>
    </div>`;
  }

  function directValveSvg(energized = false, compact = false) {
    const stateWord = energized ? "ALIMENTÉE · OUVERTE" : "HORS TENSION · FERMÉE";
    const stateClass = energized ? "is-open" : "is-closed";
    const springBottom = energized ? 132 : 168;
    const movingOffset = energized ? -44 : 0;
    return `<div class="diagram direct-valve ${stateClass} ${compact ? "is-compact" : ""}" role="img" aria-label="Électrovanne directe normalement fermée, ${stateWord.toLowerCase()}">
      <svg viewBox="0 0 760 420" aria-hidden="true">
        <defs>
          <pattern id="dv-section-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#f5df9f"/><path d="M0 0 V12" stroke="#b78328" stroke-width="3" opacity=".62"/></pattern>
          <marker id="dv-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3d7fca"/></marker>
        </defs>
        <g class="section-legend" aria-hidden="true">
          <rect class="section-legend-bg" x="18" y="18" width="165" height="54" rx="12"/>
          <rect class="section-legend-matter" x="29" y="27" width="28" height="14" rx="2"/>
          <text x="66" y="39">MATIÈRE COUPÉE</text>
          <rect class="section-legend-cavity" x="29" y="48" width="28" height="14" rx="2"/>
          <text x="66" y="60">PASSAGE INTÉRIEUR</text>
        </g>
        <path class="dv-pipe" d="M42 300 H230 M530 260 H718"/>
        <path class="dv-body dv-body-section" d="M220 210 H304 L330 187 H430 L456 210 H540 V350 H454 L426 374 H334 L306 350 H220 Z"/>
        <path class="dv-cavity dv-inlet-cavity" d="M220 269 H338 Q358 269 364 286 L374 318 H220 Z"/>
        <path class="dv-cavity dv-outlet-cavity" d="M388 232 H540 V301 H420 Q402 301 398 284 L392 259 H388 Z"/>
        <path class="dv-cavity dv-core-cavity" d="M350 185 H410 V268 H394 L390 257 H370 L366 268 H350 Z"/>
        <path class="dv-seat-solid" d="M338 263 H369 L376 273 H368 L362 286 H338 Z M391 263 H422 V286 H398 L392 273 H384 Z"/>
        <g class="dv-coil"><rect x="289" y="43" width="182" height="154" rx="25"/><path d="M311 70 H449 M311 94 H449 M311 118 H449 M311 142 H449 M311 166 H449"/></g>
        <rect class="dv-tube" x="346" y="34" width="68" height="218" rx="26"/>
        <rect class="dv-tube-cavity" x="359" y="47" width="42" height="204" rx="18"/>
        <path class="dv-spring" d="M380 63 L366 75 L394 87 L366 99 L394 111 L366 123 L394 ${springBottom - 9} L380 ${springBottom}"/>
        <g class="dv-moving" transform="translate(0 ${movingOffset})">
          <rect class="dv-armature" x="363" y="120" width="34" height="105" rx="16"/>
          <path class="dv-stem" d="M380 216 V252"/>
          <ellipse class="dv-plate" cx="380" cy="259" rx="35" ry="12"/>
        </g>
        ${energized ? `<path class="dv-flow mobile" d="M88 300 H338 Q378 300 380 274 Q382 251 423 260 H672" marker-end="url(#dv-flow-arrow)"/><path class="dv-magnetic mobile" d="M315 58 Q270 120 315 184 M445 58 Q490 120 445 184"/>` : `<path class="dv-block" d="M359 273 H401"/>`}
        <g class="dv-state ${energized ? "state-open" : "state-closed"}"><rect x="236" y="382" width="288" height="31" rx="15"/><text x="380" y="404">${stateWord}</text></g>
        <text class="dv-small" x="68" y="330">ENTRÉE</text><text class="dv-small" x="633" y="290">SORTIE</text>
      </svg>
    </div>`;
  }

  function commandMarkup(on = false) {
    return `<div class="command-layout">
      <div class="command-chain" role="img" aria-label="Chaîne de commande ${on ? "active" : "inactive"}">
        <div class="command-node"><span class="node-icon">θ</span><strong>Commande</strong><small>${on ? "ordre envoyé" : "aucun ordre"}</small></div>
        <span class="chain-arrow ${on ? "active" : ""}">→</span>
        <div class="command-node ${on ? "active" : ""}"><span class="node-icon">⌁</span><strong>Bobine</strong><small>${on ? "champ magnétique" : "hors tension"}</small></div>
        <span class="chain-arrow ${on ? "active" : ""}">→</span>
        <div class="command-node ${on ? "active" : ""}"><span class="node-icon">↕</span><strong>Vanne NF</strong><small>${on ? "ouverte" : "fermée"}</small></div>
      </div>
      ${directValveSvg(on, true)}
    </div>`;
  }

  function cutawaySvg(selected = "armature") {
    const labels = {
      coil: "Bobine : alimentée avec les caractéristiques prévues, elle crée le champ magnétique.",
      tube: "Tube du noyau : enveloppe étanche autour du noyau mobile et support de la bobine.",
      armature: "Noyau mobile : pièce attirée lorsque la bobine est alimentée.",
      spring: "Ressort : il participe au retour du noyau lorsque la bobine n’est plus alimentée.",
      seat: "Obturateur et siège : leur contact ferme le passage sur cet exemple à action directe.",
      body: "Corps : il contient le passage du fluide, l’entrée, la sortie et le siège."
    };
    return `<div class="diagram ev-cutaway" role="img" aria-label="Coupe pédagogique générique avec bobine, tube, noyau mobile, ressort, siège et corps">
      <svg viewBox="0 0 760 420" aria-hidden="true">
        <defs><pattern id="cutaway-section-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#f5df9f"/><path d="M0 0 V12" stroke="#b78328" stroke-width="3" opacity=".62"/></pattern></defs>
        <g class="section-legend" aria-hidden="true">
          <rect class="section-legend-matter cutaway-matter" x="21" y="20" width="27" height="14" rx="2"/><text x="57" y="32">MATIÈRE</text>
          <rect class="section-legend-cavity" x="21" y="42" width="27" height="14" rx="2"/><text x="57" y="54">PASSAGE</text>
        </g>
        <path class="dv-pipe" d="M44 300 H225 M535 260 H716"/>
        <path class="dv-body dv-body-cutaway part ${selected === "body" ? "is-selected" : ""}" d="M215 210 H302 L330 187 H430 L458 210 H545 V350 H455 L427 374 H333 L305 350 H215 Z"/>
        <path class="dv-cavity" d="M215 269 H338 Q358 269 364 286 L374 318 H215 Z"/>
        <path class="dv-cavity" d="M388 232 H545 V301 H420 Q402 301 398 284 L392 259 H388 Z"/>
        <path class="dv-cavity" d="M350 185 H410 V268 H394 L390 257 H370 L366 268 H350 Z"/>
        <path class="dv-seat-solid part ${selected === "seat" ? "is-selected" : ""}" d="M338 263 H369 L376 273 H368 L362 286 H338 Z M391 263 H422 V286 H398 L392 273 H384 Z"/>
        <g class="dv-coil part ${selected === "coil" ? "is-selected" : ""}"><rect x="286" y="44" width="188" height="154" rx="25"/><path d="M309 70 H451 M309 94 H451 M309 118 H451 M309 142 H451 M309 166 H451"/></g>
        <g class="dv-tube-part part ${selected === "tube" ? "is-selected" : ""}"><rect class="dv-tube" x="346" y="34" width="68" height="218" rx="26"/><rect class="dv-tube-cavity" x="359" y="47" width="42" height="204" rx="18"/></g>
        <path class="dv-spring part ${selected === "spring" ? "is-selected" : ""}" d="M380 62 L366 76 L394 90 L366 104 L394 118 L366 132 L394 146 L380 160"/>
        <rect class="dv-armature part ${selected === "armature" ? "is-selected" : ""}" x="363" y="120" width="34" height="105" rx="16"/>
        <path class="dv-stem" d="M380 216 V252"/>
        <ellipse class="dv-plate part ${selected === "seat" ? "is-selected" : ""}" cx="380" cy="259" rx="35" ry="12"/>
        <path class="label-line" d="M288 93 L160 104"/><text class="svg-label" x="58" y="110">Bobine</text>
        <path class="label-line" d="M350 53 L270 28"/><text class="svg-label" x="202" y="29">Tube</text>
        <path class="label-line" d="M398 150 L574 81"/><text class="svg-label" x="584" y="85">Noyau mobile</text>
        <path class="label-line" d="M394 93 L590 132"/><text class="svg-label" x="600" y="137">Ressort</text>
        <path class="label-line" d="M410 273 L594 247"/><text class="svg-label" x="604" y="252">Siège</text>
        <path class="label-line" d="M270 334 L148 367"/><text class="svg-label" x="54" y="375">Corps</text>
      </svg>
      <div class="readout" id="visual-readout">${labels[selected]}</div>
    </div>`;
  }

  function principleMarkup(type = "direct") {
    if (type === "direct") {
      return `<div class="principle-card direct-principle"><span class="principle-badge">PRINCIPE DIRECT</span>${directValveSvg(true, true)}<div class="readout" id="visual-readout"><strong>ACTION DIRECTE.</strong> Le noyau mobile commande l’obturateur de l’orifice principal. Les limites de pression dépendent du modèle.</div></div>`;
    }
    const open = type === "assisted-open";
    return `<div class="principle-card assisted-principle ${open ? "is-assisted-open" : "is-assisted-closed"}" role="img" aria-label="Schéma simplifié d’une électrovanne à commande assistée ${open ? "ouverte" : "fermée"}">
      <span class="principle-badge">ASSISTÉE · ${open ? "OUVERTE" : "FERMÉE"}</span>
      <svg viewBox="0 0 760 390" aria-hidden="true">
        <defs>
          <pattern id="assisted-section-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#f5df9f"/><path d="M0 0 V12" stroke="#b78328" stroke-width="3" opacity=".62"/></pattern>
          <marker id="assisted-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3d7fca"/></marker>
          <marker id="assisted-pressure-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c9451a"/></marker>
        </defs>
        <path class="sv-pipe" d="M55 274 H242 M518 274 H705"/>
        <path class="sv-body sv-body-section" d="M215 198 H300 L326 176 H434 L460 198 H545 V338 H215 Z"/>
        <path class="sv-cavity" d="M215 244 H330 V310 H215 Z"/>
        <path class="sv-cavity" d="M430 244 H545 V310 H430 Z"/>
        <path class="sv-cavity sv-control-cavity" d="M320 207 H440 V288 Q380 262 320 288 Z"/>
        <path class="sv-diaphragm" d="${open ? "M298 252 Q380 214 462 252 L437 277 Q380 247 323 277 Z" : "M298 267 Q380 252 462 267 L437 302 Q380 282 323 302 Z"}"/>
        <path class="sv-seat" d="M332 300 Q380 264 428 300"/>
        <circle class="sv-equalizing-hole" cx="323" cy="265" r="7"/>
        <g class="sv-pilot"><rect x="352" y="48" width="56" height="151" rx="23"/><g class="sv-pilot-moving" transform="translate(0 ${open ? -24 : 0})"><rect x="363" y="96" width="34" height="83" rx="15"/><path d="M380 179 V235"/><circle cx="380" cy="239" r="10"/></g></g>
        <g class="sv-coil"><rect x="294" y="55" width="172" height="119" rx="24"/><path d="M318 80 H442 M318 104 H442 M318 128 H442 M318 152 H442"/></g>
        <path class="sv-equalizing-flow mobile" d="M100 274 H280 Q317 274 323 265 Q330 223 365 221" marker-end="url(#assisted-pressure-arrow)"/>
        ${open ? `<path class="sv-pilot-flow mobile" d="M364 222 Q380 209 396 226 Q425 250 486 258" marker-end="url(#assisted-flow-arrow)"/><path class="sv-flow mobile" d="M92 274 H320 Q380 225 440 274 H670" marker-end="url(#assisted-flow-arrow)"/>` : `<path class="sv-block" d="M337 286 H423"/>`}
        <g class="sv-pressure-label"><rect x="447" y="171" width="242" height="52" rx="11"/><text x="460" y="192">CHAMBRE À LA PRESSION AMONT</text><text x="460" y="213">HP sur la ligne liquide étudiée</text></g>
        <path class="label-line" d="M323 265 L246 218"/><text class="svg-label sv-hole-label" x="105" y="216">ÉQUILIBRAGE</text>
        <text class="svg-label" x="512" y="244">PILOTE ${open ? "OUVERT" : "FERMÉ"}</text><text class="svg-label" x="490" y="326">MEMBRANE ${open ? "LEVÉE" : "SUR LE SIÈGE"}</text>
      </svg>
      <div class="readout ${open ? "readout-key" : "readout-warning"}" id="visual-readout">${open ? "<strong>OUVERTE.</strong> Le pilote décharge la chambre supérieure vers la sortie. La différence de pression soulève la membrane." : "<strong>FERMÉE.</strong> L’orifice d’équilibrage amène la pression amont au-dessus de la membrane et participe à la plaquer sur le siège."}</div>
    </div>`;
  }

  function normalModeMarkup(type = "nc") {
    const normallyClosed = type === "nc";
    const offOpen = !normallyClosed;
    const onOpen = normallyClosed;
    const stateCard = (powered, open) => `<article class="normal-state ${open ? "state-open" : "state-closed"}">
      <span class="normal-state-order">${powered ? "BOBINE ALIMENTÉE" : "HORS TENSION"}</span>
      <svg viewBox="0 0 280 120" aria-hidden="true">
        <path class="normal-pipe" d="M18 71 H106 M174 71 H262"/>
        <path class="normal-seat" d="M106 84 Q140 60 174 84"/>
        <path class="normal-obturator" d="M140 ${open ? 24 : 43} V${open ? 47 : 66}"/>
        <ellipse class="normal-plate" cx="140" cy="${open ? 49 : 68}" rx="31" ry="9"/>
        ${open ? `<path class="normal-flow" d="M31 71 H99 Q140 34 181 71 H249"/>` : `<path class="normal-block" d="M116 71 H164"/>`}
      </svg>
      <strong>${open ? "OUVERTE" : "FERMÉE"}</strong>
      <small>${open ? "Passage autorisé" : "Passage bloqué"}</small>
    </article>`;
    return `<div class="normal-mode-layout" role="img" aria-label="Fonction ${normallyClosed ? "normalement fermée" : "normalement ouverte"}">
      <div class="normal-mode-heading"><span class="principle-badge">${normallyClosed ? "NF" : "NO"}</span><strong>${normallyClosed ? "NORMALEMENT FERMÉE" : "NORMALEMENT OUVERTE"}</strong><small>« Normalement » = bobine hors tension</small></div>
      <div class="normal-state-grid">${stateCard(false, offOpen)}${stateCard(true, onOpen)}</div>
      <div class="readout" id="visual-readout"><strong>${normallyClosed ? "NF" : "NO"}.</strong> Hors tension = ${offOpen ? "OUVERTE" : "FERMÉE"} ; bobine alimentée = ${onOpen ? "OUVERTE" : "FERMÉE"}.</div>
    </div>`;
  }

  function orientationMarkup(mode = "forward") {
    const correct = mode === "forward";
    return `<div class="orientation-scene ${correct ? "is-correct" : "is-wrong"}" role="img" aria-label="Montage ${correct ? "dans" : "à l’encontre du"} sens de la flèche">
      <svg viewBox="0 0 760 390" aria-hidden="true">
        <path class="orientation-pipe" d="M58 247 H702"/>
        <g transform="translate(380 232)"><image href="assets/symboles/electrovanne_frigo.svg" x="-92" y="-122" width="184" height="138"/></g>
        <path class="body-arrow" d="${correct ? "M235 294 H525" : "M525 294 H235"}"/><path class="body-arrow-head" d="${correct ? "M525 294 L492 276 M525 294 L492 312" : "M235 294 L268 276 M235 294 L268 312"}"/>
        <text class="orientation-label" x="380" y="341">${correct ? "FLUIDE ET FLÈCHE DANS LE MÊME SENS" : "SENS INVERSÉ · À CORRIGER"}</text>
        <path class="angle-arc" d="M285 142 A105 105 0 0 1 475 142"/><text class="angle-word" x="380" y="63">ORIENTATION : LIRE LA NOTICE</text>
      </svg>
      <div class="readout ${correct ? "readout-key" : "readout-warning"}" id="visual-readout">${correct ? "Montage cohérent : la circulation suit la flèche du corps." : "Montage à corriger : des raccords symétriques n’autorisent pas à inverser le sens."}</div>
    </div>`;
  }

  function coilIllustrationSvg() {
    return `<div class="coil-illustration" role="img" aria-label="Bobine électrique générique avec enroulement, passage central, connecteur et plaque de marquage">
      <svg viewBox="0 0 390 190" aria-hidden="true">
        <defs><linearGradient id="coil-shell" x1="0" x2="1"><stop offset="0" stop-color="#cbd7dc"/><stop offset=".5" stop-color="#f5f8fa"/><stop offset="1" stop-color="#aabac4"/></linearGradient></defs>
        <path class="coil-shadow" d="M45 158 H321 Q342 158 342 174 H63 Q45 174 45 158 Z"/>
        <rect class="coil-shell" x="47" y="24" width="226" height="138" rx="34"/>
        <rect class="coil-window" x="110" y="42" width="92" height="102" rx="31"/>
        <g class="coil-winding"><path d="M69 50 H105 M69 67 H105 M69 84 H105 M69 101 H105 M69 118 H105 M69 135 H105"/><path d="M208 50 H251 M208 67 H251 M208 84 H251 M208 101 H251 M208 118 H251 M208 135 H251"/></g>
        <rect class="coil-connector" x="265" y="64" width="82" height="64" rx="13"/>
        <circle class="coil-contact" cx="290" cy="96" r="9"/><circle class="coil-contact" cx="322" cy="96" r="9"/>
        <path class="coil-cable" d="M347 96 H382"/>
        <g class="coil-tag"><rect x="58" y="111" width="44" height="34" rx="5"/><text x="80" y="125">U</text><text x="80" y="138">Hz/W</text></g>
        <path class="label-line" d="M80 111 L34 87"/><text class="svg-label" x="6" y="78">PLAQUE</text><text class="svg-label" x="6" y="94">À LIRE</text>
      </svg>
    </div>`;
  }

  function installationMarkup(phase = "prepare") {
    const phases = {
      prepare: { title: "1 · PRÉPARER", items: ["Couper puis retirer la bobine", "Lire sens, orientation et méthode de brasage", "Vérifier si la pièce supérieure doit être déposée"] },
      braze: { title: "2 · PROTÉGER ET BRASER", items: ["Placer le chiffon humide prévu autour du corps", "Garder la flamme et la chaleur au raccord", "Protéger membrane, joints et pièces sensibles"] },
      verify: { title: "3 · CONTRÔLER", items: ["Laisser refroidir avant remontage", "Reposer pièces, joints et bobine selon la notice", "Contrôler étanchéité et fonctionnement"] }
    };
    const item = phases[phase];
    return `<div class="installation-layout"><div class="installation-visual" role="img" aria-label="Phase ${item.title.toLowerCase()}">
      <svg viewBox="50 0 420 270" aria-hidden="true">
        <path class="install-pipe" d="M42 202 H478"/><path class="install-body" d="M184 153 H231 L250 137 H302 L321 153 H368 V246 H184 Z"/>
        <rect class="install-neck" x="251" y="71" width="50" height="89" rx="18"/>
        ${phase === "prepare" ? `<g class="install-checks"><circle cx="95" cy="70" r="22"/><path d="M84 70 L92 79 L108 59"/><circle cx="425" cy="70" r="22"/><path d="M414 70 L422 79 L438 59"/></g><g class="install-removed-coil"><rect x="220" y="16" width="112" height="72" rx="17"/><path d="M239 34 H313 M239 48 H313 M239 62 H313"/><path class="lift-arrow" d="M276 111 V84 M264 96 L276 82 L288 96"/><text x="276" y="13">BOBINE RETIRÉE</text></g>` : ""}
        ${phase === "braze" ? `<g class="install-braze"><path class="flame" d="M116 176 Q84 128 128 101 Q111 140 148 145 Q170 162 143 191 Z"/><path class="wet-cloth" d="M211 145 Q276 109 343 145 L334 184 Q276 151 218 184 Z"/><path class="wet-fold" d="M222 158 Q276 132 333 158"/><g class="water-drops"><path d="M232 190 Q224 202 232 209 Q240 202 232 190"/><path d="M276 184 Q268 197 276 204 Q284 197 276 184"/><path d="M322 190 Q314 202 322 209 Q330 202 322 190"/></g><text x="276" y="103">CHIFFON HUMIDE</text></g>` : ""}
        ${phase === "verify" ? `<g class="install-verify"><circle cx="276" cy="112" r="47"/><path d="M250 112 L269 132 L307 87"/></g>` : ""}
      </svg>
    </div><div class="installation-card"><h3>${item.title}</h3><ul>${item.items.map((entry) => `<li>${entry}</li>`).join("")}</ul></div></div>`;
  }

  function coilSafetyMarkup(mode = "installed") {
    const removed = mode !== "installed";
    const secured = mode === "secured";
    return `<div class="coil-safety ${removed ? "is-removed" : ""} ${secured ? "is-secured" : ""}" role="img" aria-label="Bobine ${removed ? "retirée" : "installée"}, alimentation ${secured ? "coupée" : "présente"}">
      <svg viewBox="0 0 760 380" aria-hidden="true">
        <path class="cs-pipe" d="M44 275 H280 M480 275 H716"/><path class="cs-body" d="M255 228 H321 L342 208 H418 L439 228 H505 V326 H255 Z"/><rect class="cs-neck" x="355" y="90" width="50" height="141" rx="20"/>
        <g class="cs-coil" transform="translate(${removed ? 205 : 0} ${removed ? -35 : 0})"><rect x="311" y="95" width="138" height="116" rx="22"/><path d="M331 119 H429 M331 141 H429 M331 163 H429 M331 185 H429"/><path class="cs-wire" d="M449 153 H650"/></g>
        <g class="cs-power ${secured ? "power-off" : "power-on"}"><circle cx="655" cy="68" r="36"/><path d="M655 43 V68 M639 55 A25 25 0 1 0 671 55"/><text x="655" y="120">${secured ? "ALIMENTATION COUPÉE" : "ALIMENTATION PRÉSENTE"}</text></g>
        ${removed && !secured ? `<g class="cs-danger"><path d="M541 185 L572 131 L603 185 Z"/><text x="572" y="174">!</text><text x="572" y="221">DANGER · COUPER</text></g>` : ""}
        ${secured ? `<g class="cs-safe"><circle cx="565" cy="190" r="35"/><path d="M547 190 L560 204 L585 176"/><text x="565" y="244">SITUATION MISE EN SÉCURITÉ</text></g>` : ""}
      </svg>
      <div class="readout ${removed && !secured ? "readout-warning" : "readout-key"}" id="visual-readout">${removed ? (secured ? "Alimentation coupée et consignée : la dépose peut suivre la procédure prévue." : "Danger : une bobine déposée ne doit pas rester alimentée.") : "Bobine en place : couper et consigner avant de la retirer."}</div>
    </div>`;
  }

  function setControls(html) { ui.controls.innerHTML = html; }
  function markActive(selector, activeButton) {
    ui.controls.querySelectorAll(selector).forEach((button) => {
      const selected = button === activeButton;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  function announce(message) {
    ui.status.textContent = "";
    window.setTimeout(() => { ui.status.textContent = message; }, 10);
  }
  function setReadout(message) {
    const target = document.getElementById("visual-readout");
    if (target) target.innerHTML = message;
  }

  // Chaque activité reconstruit sa zone visuelle par innerHTML : l’observateur annonce le nouvel
  // état une seule fois, sans avoir à instrumenter chacune des fonctions de rendu.
  let announceTimer = 0;
  let lastAnnounced = "";
  function watchVisualChanges() {
    if (!window.MutationObserver) return;
    new MutationObserver(() => {
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(() => {
        const readout = document.getElementById("visual-readout");
        const message = (readout ? readout.textContent : "").replace(/\s+/g, " ").trim();
        if (!message || message === lastAnnounced) return;
        lastAnnounced = message;
        announce(message);
      }, 80);
    }).observe(ui.root, { childList: true, subtree: true, characterData: true });
  }

  function renderRecognise() {
    setControls(`<button type="button" class="action-button active" data-assembly="bare" aria-pressed="true">Corps nu</button><button type="button" class="action-button" data-assembly="complete" aria-pressed="false">Avec bobine</button>`);
    ui.root.innerHTML = `${exteriorSvg(false)}<div class="readout" id="visual-readout">Le tube métallique reçoit la bobine : il ne produit pas seul la commande électrique.</div>`;
    ui.controls.querySelectorAll("[data-assembly]").forEach((button) => button.addEventListener("click", () => {
      const complete = button.dataset.assembly === "complete";
      markActive("[data-assembly]", button);
      ui.root.innerHTML = `${exteriorSvg(complete)}<div class="readout" id="visual-readout">${complete ? "Ensemble complet : le corps frigorifique reçoit une bobine compatible et raccordée selon le schéma." : "Corps nu : le tube du noyau reste visible, mais la bobine est absente."}</div>`;
    }));
  }

  function renderPlacement() {
    setControls(`<button type="button" class="action-button primary" id="locate-solenoid">Montrer l’électrovanne</button>`);
    ui.root.innerHTML = `${liquidLineSvg()}<div class="readout" id="visual-readout">Cherche l’organe placé juste avant le détendeur sur cette ligne liquide.</div>`;
    document.getElementById("locate-solenoid").addEventListener("click", () => {
      ui.root.querySelector(".solenoid-location")?.classList.add("confirmed");
      setReadout("Électrovanne repérée : elle autorise ou bloque ici l’arrivée vers le détendeur.");
    });
  }

  function renderCommand() {
    setControls(`<button type="button" class="action-button active" data-command="off" aria-pressed="true">Ordre coupé</button><button type="button" class="action-button" data-command="on" aria-pressed="false">Ordre envoyé</button>`);
    ui.root.innerHTML = `${commandMarkup(false)}<div class="readout" id="visual-readout">Commande absente : sur la vanne NF étudiée, la bobine est hors tension et le passage est fermé.</div>`;
    ui.controls.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => {
      const on = button.dataset.command === "on";
      markActive("[data-command]", button);
      ui.root.innerHTML = `${commandMarkup(on)}<div class="readout" id="visual-readout">${on ? "Ordre envoyé : la bobine crée le champ magnétique et la vanne NF s’ouvre." : "Ordre coupé : la bobine est hors tension et la vanne NF revient fermée."}</div>`;
    }));
  }

  function renderConstruction() {
    const controls = ["coil", "tube", "armature", "spring", "seat", "body"].map((part) => {
      const labels = { coil: "Bobine", tube: "Tube", armature: "Noyau", spring: "Ressort", seat: "Siège", body: "Corps" };
      return `<button type="button" class="action-button ${part === "armature" ? "active" : ""}" data-part="${part}" aria-pressed="${part === "armature"}">${labels[part]}</button>`;
    }).join("");
    setControls(controls);
    ui.root.innerHTML = cutawaySvg("armature");
    ui.controls.querySelectorAll("[data-part]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-part]", button);
      ui.root.innerHTML = cutawaySvg(button.dataset.part);
    }));
  }

  function renderClosed() {
    setControls(`<span class="state-pill state-closed-label">HORS TENSION</span>`);
    ui.root.innerHTML = `${directValveSvg(false)}<div class="readout readout-warning" id="visual-readout"><strong>FERMÉE.</strong> Sur cet exemple direct NF, le ressort ramène l’obturateur sur le siège.</div>`;
  }

  function renderOpen() {
    setControls(`<button type="button" class="action-button active" data-power="off" aria-pressed="true">Couper</button><button type="button" class="action-button" data-power="on" aria-pressed="false">Alimenter</button>`);
    ui.root.innerHTML = `${directValveSvg(false)}<div class="readout" id="visual-readout">Hors tension : le noyau mobile est au repos et le siège est fermé.</div>`;
    ui.controls.querySelectorAll("[data-power]").forEach((button) => button.addEventListener("click", () => {
      const on = button.dataset.power === "on";
      markActive("[data-power]", button);
      ui.root.innerHTML = `${directValveSvg(on)}<div class="readout ${on ? "readout-key" : ""}" id="visual-readout">${on ? "ALIMENTÉE · OUVERTE : le champ magnétique attire le noyau mobile et l’obturateur." : "HORS TENSION · FERMÉE : le ressort ramène l’obturateur sur le siège."}</div>`;
    }));
  }

  function renderPrinciples() {
    setControls(`<button type="button" class="action-button active" data-principle="direct" aria-pressed="true">Action directe</button><button type="button" class="action-button" data-principle="assisted-closed" aria-pressed="false">Assistée fermée</button><button type="button" class="action-button" data-principle="assisted-open" aria-pressed="false">Assistée ouverte</button>`);
    ui.root.innerHTML = principleMarkup("direct");
    ui.controls.querySelectorAll("[data-principle]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-principle]", button);
      ui.root.innerHTML = principleMarkup(button.dataset.principle);
    }));
  }

  function renderNormalModes() {
    setControls(`<button type="button" class="action-button active" data-normal="nc" aria-pressed="true">NF · fermée au repos</button><button type="button" class="action-button" data-normal="no" aria-pressed="false">NO · ouverte au repos</button>`);
    ui.root.innerHTML = normalModeMarkup("nc");
    ui.controls.querySelectorAll("[data-normal]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-normal]", button);
      ui.root.innerHTML = normalModeMarkup(button.dataset.normal);
    }));
  }

  function renderOrientation() {
    setControls(`<button type="button" class="action-button active" data-direction="forward" aria-pressed="true">Dans la flèche</button><button type="button" class="action-button" data-direction="reverse" aria-pressed="false">À l’envers</button>`);
    ui.root.innerHTML = orientationMarkup("forward");
    ui.controls.querySelectorAll("[data-direction]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-direction]", button);
      ui.root.innerHTML = orientationMarkup(button.dataset.direction);
    }));
  }

  function renderCoilChoice() {
    const checks = { voltage: false, current: false, compatibility: false };
    setControls("");
    ui.root.innerHTML = `<div class="coil-match"><div class="coil-top">${coilIllustrationSvg()}<div class="coil-nameplate" aria-label="Informations d’une plaque de bobine générique"><span>MARQUAGE</span><strong>Pas de choix à l’œil</strong><small>Tension · AC ou DC · fréquence · puissance · référence</small></div></div><div class="check-grid">
      <button type="button" class="check-card" data-check="voltage" aria-pressed="false"><span>□</span><strong>Tension</strong><small>Conforme au schéma</small></button>
      <button type="button" class="check-card" data-check="current" aria-pressed="false"><span>□</span><strong>Courant / fréquence</strong><small>AC, DC et Hz vérifiés</small></button>
      <button type="button" class="check-card" data-check="compatibility" aria-pressed="false"><span>□</span><strong>Compatibilité</strong><small>Corps et bobine associés</small></button>
    </div><div class="readout" id="visual-readout">Active les trois contrôles avant de valider une bobine.</div></div>`;
    ui.root.querySelectorAll("[data-check]").forEach((button) => button.addEventListener("click", () => {
      const key = button.dataset.check;
      checks[key] = !checks[key];
      button.classList.toggle("checked", checks[key]);
      button.setAttribute("aria-pressed", String(checks[key]));
      button.querySelector("span").textContent = checks[key] ? "✓" : "□";
      const count = Object.values(checks).filter(Boolean).length;
      setReadout(count === 3 ? "Contrôle complet : commande électrique et compatibilité mécanique sont toutes vérifiées." : `${count}/3 contrôle${count > 1 ? "s" : ""} effectué${count > 1 ? "s" : ""}. Il reste des informations à confirmer.`);
    }));
  }

  function renderInstallation() {
    setControls(`<button type="button" class="action-button active" data-phase="prepare" aria-pressed="true">Préparer</button><button type="button" class="action-button" data-phase="braze" aria-pressed="false">Protéger</button><button type="button" class="action-button" data-phase="verify" aria-pressed="false">Contrôler</button>`);
    ui.root.innerHTML = installationMarkup("prepare");
    ui.controls.querySelectorAll("[data-phase]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-phase]", button);
      ui.root.innerHTML = installationMarkup(button.dataset.phase);
    }));
  }

  function renderCoilSafety() {
    setControls(`<button type="button" class="action-button active" data-coil-state="installed" aria-pressed="true">Bobine en place</button><button type="button" class="action-button" data-coil-state="removed" aria-pressed="false">Retirer alimentée</button><button type="button" class="action-button" data-coil-state="secured" aria-pressed="false">Couper et consigner</button>`);
    ui.root.innerHTML = coilSafetyMarkup("installed");
    ui.controls.querySelectorAll("[data-coil-state]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-coil-state]", button);
      ui.root.innerHTML = coilSafetyMarkup(button.dataset.coilState);
    }));
  }

  function diagnosisIllustrationSvg(kind = "leak") {
    if (kind === "coil") {
      return `<div class="diagnosis-illustration" role="img" aria-label="Électrovanne avec bobine et points d’interrogation sur la commande électrique">
        <svg viewBox="0 0 430 280" aria-hidden="true">
          <path class="diag-pipe" d="M24 207 H142 M302 207 H406"/>
          <path class="diag-body-solid" d="M126 161 H175 L194 143 H250 L269 161 H318 V244 H126 Z"/>
          <rect class="diag-neck" x="203" y="73" width="39" height="92" rx="16"/>
          <g class="diag-coil"><rect x="166" y="68" width="114" height="91" rx="20"/><path d="M183 88 H263 M183 106 H263 M183 124 H263 M183 142 H263"/><rect x="272" y="94" width="65" height="40" rx="9"/><path class="diag-wire" d="M337 114 H403"/></g>
          <g class="diag-question"><circle cx="358" cy="48" r="32"/><text x="358" y="60">?</text></g>
          <path class="label-line" d="M335 78 L288 102"/><text class="diag-label" x="24" y="34">ORDRE · MARQUAGE · BOBINE</text><text class="diag-sub" x="24" y="55">Contrôler avant de soupçonner la mécanique</text>
        </svg>
      </div>`;
    }
    const leak = kind === "leak";
    return `<div class="diagnosis-illustration" role="img" aria-label="${leak ? "Particule coincée sur le siège et fuite interne" : "Commande assistée avec orifice d’équilibrage et pilote à contrôler"}">
      <svg viewBox="0 0 430 280" aria-hidden="true">
        <defs><pattern id="diag-hatch" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="11" height="11" fill="#f5df9f"/><path d="M0 0 V11" stroke="#b78328" stroke-width="3" opacity=".62"/></pattern><marker id="diag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3d7fca"/></marker></defs>
        <path class="diag-pipe" d="M22 203 H120 M310 203 H408"/>
        <path class="diag-body" d="M104 112 H151 L172 94 H258 L279 112 H326 V246 H104 Z"/>
        <path class="diag-cavity" d="M104 172 H167 V226 H104 Z M263 172 H326 V226 H263 Z M160 132 H270 V206 Q215 186 160 206 Z"/>
        <path class="diag-diaphragm" d="M143 182 Q215 163 287 182 L267 218 Q215 198 163 218 Z"/>
        <path class="diag-seat" d="M166 226 Q215 188 264 226"/>
        <circle class="diag-equalizing" cx="164" cy="187" r="7"/>
        <g class="diag-pilot"><rect x="190" y="46" width="50" height="96" rx="19"/><path d="M215 96 V164"/><circle cx="215" cy="166" r="8"/></g>
        ${leak ? `<path class="diag-leak" d="M42 203 H169 Q210 203 221 214 Q240 226 290 203 H390" marker-end="url(#diag-arrow)"/><path class="diag-chip" d="M216 205 L232 194 L239 214 L221 221 Z"/><path class="diag-callout" d="M232 201 L330 72"/><g class="diag-callout-box"><rect x="278" y="28" width="132" height="47" rx="10"/><text x="290" y="47">COPEAU AU SIÈGE</text><text x="290" y="65">FERMETURE INCOMPLÈTE</text></g>` : `<path class="diag-pressure" d="M42 203 H139 Q160 203 164 187 Q170 145 204 145"/><circle class="diag-alert-ring" cx="164" cy="187" r="17"/><circle class="diag-alert-ring" cx="215" cy="166" r="17"/><text class="diag-help" x="164" y="193">?</text><text class="diag-help" x="215" y="172">?</text><g class="diag-callout-box"><rect x="271" y="32" width="139" height="51" rx="10"/><text x="284" y="51">ÉQUILIBRAGE / PILOTE</text><text x="284" y="69">À CONTRÔLER</text></g>`}
      </svg>
    </div>`;
  }

  function renderDiagnosis() {
    const cases = {
      leak: { title: "La vanne NF ne ferme plus complètement", steps: ["Couper l’ordre ; confirmer « fermé »", "Distinguer fuite interne / extérieure", "Suspecter particule, siège, membrane", "Isoler, récupérer, zéro pression"], readout: "Un copeau crée un entrebâillement : le fluide continue de passer malgré l’ordre de fermeture." },
      assisted: { title: "La vanne assistée ne s’ouvre pas correctement", steps: ["Vérifier la pression différentielle", "Contrôler pilote et équilibrage", "Examiner membrane et sens", "Isoler avant toute ouverture"], readout: "Un orifice obstrué ou une pression différentielle inadaptée est une piste, pas un diagnostic sans contrôle." },
      coil: { title: "Le noyau ne réagit pas", steps: ["Confirmer NF/NO et l’ordre", "Lire U, AC/DC, Hz, W et référence", "Contrôler la commande prévue", "Couper et consigner avant dépose"], readout: "On sépare d’abord ordre électrique, bobine et compatibilité avant d’ouvrir la vanne." }
    };
    setControls(`<button type="button" class="action-button active" data-diagnosis="leak" aria-pressed="true">Fuite interne</button><button type="button" class="action-button" data-diagnosis="assisted" aria-pressed="false">Assistée bloquée</button><button type="button" class="action-button" data-diagnosis="coil" aria-pressed="false">Bobine / commande</button>`);
    const draw = (key) => {
      const item = cases[key];
      ui.root.innerHTML = `<div class="diagnosis-flow"><h3>${item.title}</h3><div class="diagnosis-content">${diagnosisIllustrationSvg(key)}<ol>${item.steps.map((step, index) => `<li><span>${index + 1}</span><p>${step}</p></li>`).join("")}</ol></div><div class="readout ${key === "leak" ? "readout-warning" : ""}" id="visual-readout">${item.readout}</div></div>`;
    };
    draw("leak");
    ui.controls.querySelectorAll("[data-diagnosis]").forEach((button) => button.addEventListener("click", () => {
      markActive("[data-diagnosis]", button);
      draw(button.dataset.diagnosis);
    }));
  }

  function renderQuiz() {
    if (quiz.complete) {
      setControls(`<button type="button" class="action-button primary" id="restart-quiz">Refaire le défi</button>`);
      const success = quiz.score >= 6;
      ui.root.innerHTML = `<div class="quiz-result"><span class="quiz-score">${quiz.score}/7</span><strong>${success ? "Objectif atteint" : "Encore un passage utile"}</strong><p>${success ? "Tu relies correctement la commande, le mouvement et la sécurité de l’électrovanne." : "Relis les corrections puis recommence."}</p></div>`;
      document.getElementById("restart-quiz").addEventListener("click", resetQuiz);
      updateNavigation();
      return;
    }
    const question = quizQuestions[quiz.index];
    setControls(quiz.answered ? `<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>` : "");
    ui.root.innerHTML = `<div class="quiz-shell"><div class="quiz-meta"><span>Question ${quiz.index + 1} sur ${quizQuestions.length}</span><span>Score : ${quiz.score}</span></div><h3 class="quiz-prompt">${question.prompt}</h3><div class="quiz-answers">${question.answers.map((answer, index) => `<button type="button" class="quiz-choice" data-answer="${index}">${answer}</button>`).join("")}</div><div class="quiz-feedback" id="quiz-feedback">Choisis une réponse.</div></div>`;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuiz(Number(button.dataset.answer))));
    if (quiz.answered) restoreAnsweredQuiz(question);
    wireQuizAdvance();
  }

  function answerQuiz(answerIndex) {
    if (quiz.answered) return;
    quiz.answered = true;
    const question = quizQuestions[quiz.index];
    const correct = answerIndex === question.correct;
    if (correct) quiz.score += 1;
    ui.root.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      if (index === answerIndex && !correct) button.classList.add("bad");
    });
    document.getElementById("quiz-feedback").innerHTML = `<strong>${correct ? "✓ Correct." : "✗ À revoir."}</strong> ${question.why}`;
    setControls(`<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>`);
    wireQuizAdvance();
    // Les boutons de réponse viennent d’être désactivés : sans ce report, le clavier repart du haut du document.
    document.getElementById("next-question")?.focus();
  }

  function restoreAnsweredQuiz(question) {
    ui.root.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
    });
    document.getElementById("quiz-feedback").innerHTML = `<strong>Réponse enregistrée.</strong> ${question.why}`;
  }

  function wireQuizAdvance() {
    const button = document.getElementById("next-question");
    if (!button) return;
    button.addEventListener("click", () => {
      if (quiz.index >= quizQuestions.length - 1) quiz.complete = true;
      else { quiz.index += 1; quiz.answered = false; }
      renderQuiz();
      updateNavigation();
    });
  }

  function resetQuiz() {
    quiz.index = 0;
    quiz.score = 0;
    quiz.answered = false;
    quiz.complete = false;
    renderQuiz();
    updateNavigation();
  }

  function renderLesson(index, focusTitle = false) {
    stopSpeech();
    current = Math.max(0, Math.min(lessons.length - 1, index));
    furthest = Math.max(furthest, current);
    const lesson = lessons[current];
    ui.kicker.textContent = lesson.kicker;
    ui.title.textContent = lesson.title;
    ui.intro.textContent = lesson.intro;
    ui.detail.innerHTML = lesson.detail;
    ui.takeaway.textContent = lesson.takeaway;
    ui.visualTitle.textContent = lesson.visualTitle;
    ui.visualHint.textContent = lesson.visualHint;
    ui.caption.textContent = lesson.caption;
    setControls("");
    ui.root.innerHTML = "";
    lesson.render();
    updateStepper();
    updateNavigation();
    if (focusTitle) ui.title.focus?.({ preventScroll: true });
  }

  function buildStepper() {
    ui.stepper.style.setProperty("--step-count", lessons.length);
    ui.stepper.innerHTML = lessons.map((lesson, index) => `<button type="button" class="step-button" data-step="${index}" aria-label="Étape ${index + 1} : ${lesson.short}"><span class="step-number">${index + 1}</span><span class="step-name">${lesson.short}</span></button>`).join("");
    ui.stepper.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => renderLesson(Number(button.dataset.step))));
  }

  function updateStepper() {
    ui.stepper.querySelectorAll("[data-step]").forEach((button, index) => {
      button.classList.toggle("active", index === current);
      button.classList.toggle("reached", index <= furthest);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function updateNavigation() {
    ui.previous.disabled = current === 0;
    const finalStep = current === lessons.length - 1;
    ui.next.disabled = finalStep && !quiz.complete;
    ui.next.textContent = finalStep ? (quiz.complete ? "Recommencer →" : "Terminer le défi") : "Continuer →";
    ui.progressLabel.textContent = `Étape ${current + 1} sur ${lessons.length}`;
    ui.progressBar.style.width = `${((current + 1) / lessons.length) * 100}%`;
  }

  function nextLesson() {
    if (current === lessons.length - 1) {
      if (!quiz.complete) return;
      resetQuiz();
      furthest = 0;
      renderLesson(0);
      return;
    }
    renderLesson(current + 1);
  }

  function previousLesson() {
    if (current > 0) renderLesson(current - 1);
  }

  function readRate() {
    try {
      const stored = Number(localStorage.getItem(STORAGE_RATE));
      return RATE_VALUES.includes(stored) ? stored : 0.95;
    } catch (_) {
      return 0.95;
    }
  }

  function storeRate(value) {
    try { localStorage.setItem(STORAGE_RATE, String(value)); }
    catch (_) { /* fonctionnement sans stockage */ }
  }

  function chooseVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const quality = /(natural|naturel|neural|online|google|microsoft)/i;
    selectedVoice = voices.find((voice) => /^fr-FR$/i.test(voice.lang) && quality.test(voice.name))
      || voices.find((voice) => /^fr-FR$/i.test(voice.lang))
      || voices.find((voice) => /^fr/i.test(voice.lang) && quality.test(voice.name))
      || voices.find((voice) => /^fr/i.test(voice.lang))
      || null;
  }

  function spokenText() {
    const lesson = lessons[current];
    const temporary = document.createElement("div");
    temporary.innerHTML = lesson.detail;
    return `${lesson.title}. ${lesson.intro} ${temporary.textContent || ""} À retenir : ${lesson.takeaway}`.replace(/\s+/g, " ").trim();
  }

  function startSpeech() {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      announce("La lecture vocale n’est pas disponible sur cet appareil.");
      return;
    }
    if (speaking && paused) {
      window.speechSynthesis.resume();
      paused = false;
      updateVoiceButton();
      return;
    }
    if (speaking) {
      window.speechSynthesis.pause();
      paused = true;
      updateVoiceButton();
      return;
    }
    stopSpeech();
    const run = ++speechRun;
    const utterance = new SpeechSynthesisUtterance(spokenText());
    utterance.lang = "fr-FR";
    utterance.pitch = 1;
    utterance.rate = voiceRate;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => {
      if (run !== speechRun) return;
      speaking = true;
      paused = false;
      updateVoiceButton();
    };
    utterance.onend = () => {
      if (run !== speechRun) return;
      speaking = false;
      paused = false;
      updateVoiceButton();
    };
    utterance.onerror = (event) => {
      if (run !== speechRun || event.error === "canceled" || event.error === "interrupted") return;
      speaking = false;
      paused = false;
      updateVoiceButton();
      announce("La lecture vocale n’est pas disponible pour le moment.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    speechRun += 1;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    paused = false;
    updateVoiceButton();
  }

  function updateVoiceButton() {
    ui.voiceButton.classList.toggle("playing", speaking && !paused);
    ui.voiceButton.innerHTML = speaking && !paused ? "Ⅱ <span>Pause</span>" : (paused ? "▶ <span>Reprendre</span>" : "▶ <span>Écouter</span>");
    ui.voiceButton.setAttribute("aria-label", speaking && !paused ? "Mettre la lecture en pause" : (paused ? "Reprendre la lecture" : "Écouter l’écran"));
  }

  ui.previous.addEventListener("click", previousLesson);
  ui.next.addEventListener("click", nextLesson);
  ui.voiceButton.addEventListener("click", startSpeech);
  ui.voiceRate.value = String(voiceRate);
  ui.voiceRate.addEventListener("change", () => {
    const value = Number(ui.voiceRate.value);
    if (!RATE_VALUES.includes(value)) return;
    const wasReading = speaking || paused;
    voiceRate = value;
    storeRate(value);
    if (wasReading) {
      stopSpeech();
      startSpeech();
    }
  });
  ui.sourceButton.addEventListener("click", () => {
    if (typeof ui.sourcesDialog.showModal === "function") ui.sourcesDialog.showModal();
    else ui.sourcesDialog.setAttribute("open", "");
  });
  document.addEventListener("keydown", (event) => {
    if (ui.sourcesDialog.open) return;
    const target = event.target;
    if (target && /INPUT|SELECT|TEXTAREA|BUTTON/.test(target.tagName)) return;
    if (event.key === "ArrowRight") nextLesson();
    if (event.key === "ArrowLeft") previousLesson();
    if (event.key === " " && speaking) {
      event.preventDefault();
      startSpeech();
    }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
  window.addEventListener("pagehide", stopSpeech);
  if (window.speechSynthesis) {
    chooseVoice();
    window.speechSynthesis.addEventListener?.("voiceschanged", chooseVoice);
  } else {
    ui.voiceButton.disabled = true;
  }

  buildStepper();
  renderLesson(0);
  watchVisualChanges();
})();
