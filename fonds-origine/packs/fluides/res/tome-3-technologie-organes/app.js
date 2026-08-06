"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* « Où ça fuit » est un écran à part entière, et pas une ligne ajoutée sous le
   montage : les codes 6.01, 7.01, 8.01, 9.01 et 1.05 du référentiel exigent le
   principe de fonctionnement ET les risques de fuite associés. Un écran nommé,
   adressable par `?ecran=6`, est ce qui rend cette exigence vérifiable. */
const SCREEN_NAMES = ["Reconnaître", "Fonction professionnelle", "Entrée et sortie", "Fonctionnement interne", "Situer et monter", "Où ça fuit", "Mémoriser"];
const NB_ECRANS = SCREEN_NAMES.length;
const FLOW = {
  red: { color: "#e33d32", label: "Vapeur HP très chaude", detail: "Haute pression · vapeur" },
  orange: { color: "#f28a16", label: "Liquide HP chaud à tiède", detail: "Haute pression · liquide" },
  darkblue: { color: "#1769aa", label: "Mélange BP très froid", detail: "Basse pression · liquide + vapeur" },
  lightblue: { color: "#52b9e9", label: "Vapeur BP froide", detail: "Basse pression · vapeur" },
  variable: { color: "#637285", label: "État selon l’emplacement", detail: "Repérer la ligne avant d’interpréter" },
  signal: { color: "#3d7fca", label: "Information mesurée", detail: "Pas de débit de fluide à travers le capteur" }
};

const families = [
  { id: "cycle", title: "Cycle principal", subtitle: "6 dossiers" },
  { id: "liquid", title: "Ligne liquide", subtitle: "5 dossiers" },
  { id: "protection", title: "Protection mécanique", subtitle: "2 dossiers" },
  { id: "control", title: "Régulation et sécurité", subtitle: "3 dossiers" }
];

const dossiers = [
  {
    id: "compresseurs", family: "cycle", title: "Compresseurs", short: "Piston, scroll, vis et rotatif",
    images: [{ src: "images-organes/compresseurs.webp", label: "Famille de compresseurs", alt: "Quatre compresseurs frigorifiques isolés représentant les technologies piston, scroll, vis et rotative" }],
    symbols: [
      ["compresseur_piston", "Piston"], ["compresseur_scroll", "Scroll"], ["compresseur_vis", "Vis"], ["compresseur_rotatif", "Rotatif"]
    ],
    functionTitle: "Créer le débit massique et élever la pression",
    functionText: "Le compresseur aspire le fluide frigorigène à l’état de vapeur BP, réduit le volume occupé par cette vapeur, la refoule en vapeur HP et met le fluide en circulation dans le circuit.",
    keys: ["Même fonction frigorifique pour les quatre technologies.", "Le fluide doit arriver à l’état vapeur.", "L’huile assure la lubrification et doit revenir au compresseur."],
    inlet: "lightblue", outlet: "red",
    connectionNotes: ["Aspiration : conduite BP de plus grand diamètre dans de nombreux montages.", "Refoulement : conduite HP chaude vers le condenseur.", "Les raccords et le sens réel se vérifient sur le constructeur."],
    extraConnection: "Selon la technologie : retour d’huile, prise de pression, injection ou régulation de capacité peuvent compléter les deux raccords principaux.",
    animation: "compressor",
    mechanismTitle: "Le volume diminue, la pression augmente",
    mechanismSteps: ["Le fluide frigorigène en vapeur BP est admis.", "Un volume est fermé puis réduit par un piston, des spirales, des vis ou un rotor.", "La vapeur comprimée est refoulée en HP.", "La répétition du mouvement crée le débit massique."],
    location: { x: 81, y: 50, text: "À droite · entre aspiration BP et refoulement HP" },
    mounting: ["Respecter la position, les couples et les raccordements du constructeur.", "Limiter la transmission des vibrations et laisser les tuyauteries sans contrainte.", "Garantir le retour d’huile et empêcher tout retour de liquide.", "Vérifier les protections électriques et la ventilation du moteur."],
    leaks: {"title":"Où ça fuit sur un compresseur","points":["Les <b>raccords d’aspiration et de refoulement</b> : brasures et raccords mécaniques, les deux points les plus courants.","Les <b>vannes de service</b> et leurs bouchons, ainsi que le presse-étoupe de leur tige.","Les <b>traversées électriques</b> (bornes) sur un compresseur hermétique, et le <b>joint de carter</b> sur un semi-hermétique.","Le <b>presse-étoupe d’arbre</b> sur un compresseur ouvert : un joint tournant est un point de fuite par nature.","Ce qui aggrave tout le reste : une tuyauterie montée <b>en contrainte</b> ou qui vibre finit par fissurer — d’où les plots antivibratiles et les lyres."]},
    trap: "Un compresseur ne doit pas aspirer du liquide : le coup de liquide peut provoquer une casse mécanique.",
    memory: "Aspiration vapeur BP → compression → refoulement vapeur HP → circulation.",
    question: { prompt: "Quelle description est complète ?", answers: ["Il transforme directement le liquide HP en vapeur BP.", "Il aspire une vapeur BP, la comprime, la refoule en vapeur HP et crée le débit massique.", "Il stocke le liquide avant le détendeur."], correct: 1, why: "Le compresseur agit sur une vapeur et met le fluide frigorigène en circulation." }
  },
  {
    id: "condenseurs", family: "cycle", title: "Condenseurs à air et à eau", short: "Rejeter la chaleur",
    images: [
      { src: "images-organes/condenseur-air.webp", label: "Condenseur à air", alt: "Condenseur frigorifique à air isolé avec batterie et ventilateur" },
      { src: "images-organes/echangeur-plaques.webp", label: "Échangeur à plaques pour circuit à eau", alt: "Échangeur à plaques brasées isolé avec quatre raccords" }
    ],
    symbols: [["echangeur_a_air", "Échangeur à air"], ["echangeur_a_plaques", "Échangeur à plaques"]],
    functionTitle: "Rejeter la chaleur et liquéfier le fluide",
    functionText: "Le condenseur reçoit une vapeur HP chaude. Il rejette de la chaleur vers l’air ou vers un circuit d’eau distinct. Le fluide se désurchauffe, se liquéfie, puis peut être sous-refroidi avant de sortir en liquide HP.",
    keys: ["Le fluide frigorigène et l’eau ne se mélangent pas.", "La liquéfaction rejette de la chaleur latente.", "Après la dernière bulle commence le sous-refroidissement."],
    inlet: "red", outlet: "orange",
    connectionNotes: ["Entrée frigorifique : vapeur HP chaude venant du compresseur.", "Sortie frigorifique : liquide HP vers la ligne liquide.", "À eau : deux raccords supplémentaires forment un second circuit séparé."],
    extraConnection: "À air, le ventilateur impose le débit d’air. À eau, la pompe et les organes hydrauliques appartiennent au circuit secondaire.",
    animation: "condenser",
    mechanismTitle: "Trois zones thermiques successives",
    mechanismSteps: ["Désurchauffe : la vapeur HP perd de la chaleur sensible.", "Liquéfaction : le mélange vapeur-liquide rejette de la chaleur latente.", "Sous-refroidissement : le liquide HP perd encore de la chaleur sensible.", "L’air ou l’eau ressort à une température plus élevée."],
    location: { x: 50, y: 10, text: "En haut · entre refoulement et ligne liquide" },
    mounting: ["Garantir le débit d’air ou d’eau prévu par le constructeur.", "Maintenir propres la batterie, les ailettes ou les plaques.", "Prévoir purge, vidange et protection contre le gel sur le circuit d’eau.", "Respecter le sens et le montage hydraulique indiqués par le fabricant."],
    leaks: {"title":"Où ça fuit sur un condenseur","points":["Les <b>raccords et brasures</b> d’entrée et de sortie, côté vapeur chaude comme côté liquide.","La <b>batterie</b> elle-même : ailettes et tubes exposés aux chocs, et à la corrosion en atmosphère agressive (bord de mer, cuisine, toiture polluée).","Les <b>vibrations du ventilateur</b> transmises aux tubes et aux fixations.","Les <b>prises de pression</b>, purges et bouchons ajoutés sur l’appareil.","Sur un échangeur à plaques : les <b>joints et brasures</b> — une fuite interne y mélange les deux circuits sans rien laisser voir à l’extérieur."]},
    trap: "Une HP élevée invite d’abord à contrôler les échanges : propreté, ventilateurs, pompe et débit du milieu de refroidissement.",
    memory: "Vapeur HP chaude → rejet de chaleur → liquide HP.",
    question: { prompt: "Que devient le milieu extérieur au condenseur ?", answers: ["Il reçoit de la chaleur et ressort plus chaud.", "Il cède toujours de la chaleur et ressort plus froid.", "Il se mélange au fluide frigorigène."], correct: 0, why: "Le condenseur rejette vers l’air ou l’eau la chaleur transportée par le fluide frigorigène." }
  },
  {
    id: "evaporateurs", family: "cycle", title: "Évaporateurs à air et à eau", short: "Absorber la chaleur",
    images: [
      { src: "images-organes/evaporateur-air.webp", label: "Évaporateur à air", alt: "Évaporateur frigorifique à air isolé avec batterie et ventilateur" },
      { src: "images-organes/echangeur-plaques.webp", label: "Échangeur à plaques pour eau ou eau glycolée", alt: "Échangeur à plaques brasées isolé avec quatre raccords" }
    ],
    symbols: [["echangeur_a_air", "Échangeur à air"], ["echangeur_a_plaques", "Échangeur à plaques"]],
    functionTitle: "Absorber la chaleur et vaporiser le fluide",
    functionText: "L’évaporateur reçoit un mélange liquide-vapeur BP. Le fluide absorbe de la chaleur provenant de l’air, de l’eau ou de l’eau glycolée. Le liquide s’évapore puis la vapeur peut se surchauffer avant la sortie.",
    keys: ["L’évaporation absorbe de la chaleur latente.", "Après la dernière goutte commence la surchauffe.", "La vapeur en sortie protège le compresseur du retour de liquide."],
    inlet: "darkblue", outlet: "lightblue",
    connectionNotes: ["Entrée : mélange liquide-vapeur BP venant de l’organe de détente.", "Sortie : vapeur BP vers la ligne d’aspiration.", "À eau : deux autres raccords forment le circuit secondaire sans mélange."],
    extraConnection: "Un distributeur peut partager le débit entre plusieurs circuits frigorifiques de la batterie.",
    animation: "evaporator",
    mechanismTitle: "Évaporation puis surchauffe",
    mechanismSteps: ["Le mélange BP absorbe de la chaleur.", "Le liquide s’évapore à température presque stable.", "Après la dernière goutte, la vapeur absorbe de la chaleur sensible.", "L’air ou l’eau ressort à une température plus basse."],
    location: { x: 50, y: 90, text: "En bas · entre détente et aspiration" },
    mounting: ["Garantir le débit d’air ou d’eau prévu.", "Prévoir l’évacuation des condensats et le dégivrage lorsqu’ils sont nécessaires.", "Répartir correctement le fluide entre les circuits de la batterie.", "Protéger un échangeur à eau contre le gel selon la conception."],
    leaks: {"title":"Sur l’évaporateur, deux ennemis : le dégivrage brutal et l’eau qui stagne","points":["<b>On ne casse JAMAIS la glace à l’outil.</b> Un tube percé sous le givre ne se voit pas tout de suite : la machine perd son fluide en silence, et on le découvre bien plus tard.","Le <b>dégivrage</b> doit finir son travail : un givre qui revient toujours au même endroit se questionne (résistance morte, sonde déplacée, écoulement bouché) — avant d’accuser la charge.","Les <b>condensats qui stagnent</b> rongent la batterie et le bac : écoulement pentu, siphon et bac propre se contrôlent à chaque visite.","La <b>batterie</b> est fragile : chocs de manutention en chambre froide, ailettes pliées, nettoyage au jet trop près.","Les <b>raccords et brasures</b> restent des points à contrôler — comme sur tout organe, le registre d’abord."]},
    trap: "Du givre n’indique pas à lui seul une panne. Il faut observer sa répartition, le débit d’air et le fonctionnement du dégivrage.",
    memory: "Mélange BP très froid → absorption de chaleur → vapeur BP.",
    question: { prompt: "Où commence la zone de surchauffe ?", answers: ["Après la disparition de la dernière goutte de liquide.", "Dès l’entrée du mélange BP.", "Après la dernière bulle de vapeur au condenseur."], correct: 0, why: "La surchauffe appartient à la zone où le fluide est entièrement à l’état vapeur." }
  },
  {
    id: "detendeur-thermostatique", family: "cycle", title: "Détendeur thermostatique", short: "Égalisation interne et externe",
    images: [{ src: "images-organes/detendeur-thermostatique.webp", label: "Détendeur thermostatique", alt: "Détendeur thermostatique isolé avec bulbe et capillaire de commande" }],
    symbols: [["detendeur_thermo_int", "Égalisation interne"], ["detendeur_thermo_ext", "Égalisation externe"]],
    functionTitle: "Détendre, doser et réguler la surchauffe",
    functionText: "Le détendeur thermostatique fait chuter la pression du liquide HP, dose le débit massique admis dans l’évaporateur et module son ouverture afin de maintenir une surchauffe adaptée en sortie d’évaporateur.",
    keys: ["Le bulbe mesure indirectement la température de sortie.", "La membrane compare des forces de pression et de ressort.", "L’égalisation externe tient compte de la pression réelle en sortie d’évaporateur."],
    inlet: "orange", outlet: "darkblue",
    connectionNotes: ["Entrée : liquide HP provenant de la ligne liquide.", "Sortie : mélange liquide-vapeur BP vers l’évaporateur.", "Bulbe : fixé sur la ligne d’aspiration.", "Égalisation externe : prise de pression raccordée en sortie d’évaporateur."],
    extraConnection: "Avec égalisation interne, la pression sous membrane est prélevée dans le corps du détendeur. Avec égalisation externe, elle vient d’une conduite dédiée.",
    animation: "thermostatic",
    mechanismTitle: "Une boucle mécanique de surchauffe",
    mechanismSteps: ["La surchauffe augmente et le bulbe se réchauffe.", "La pression du bulbe augmente sur la membrane.", "Le pointeau s’ouvre davantage et le débit augmente.", "L’évaporateur est mieux alimenté et la surchauffe redescend."],
    location: { x: 10, y: 50, text: "À gauche · juste avant l’évaporateur" },
    mounting: ["Respecter la flèche de circulation et le sens du distributeur.", "Fixer le bulbe avec un contact thermique ferme, à la position prescrite.", "Isoler le bulbe lorsque le constructeur le demande.", "Raccorder correctement l’égalisation externe et vérifier l’étanchéité."],
    leaks: {"title":"Où ça fuit sur un détendeur thermostatique","points":["Les <b>raccords</b> d’entrée et de sortie : brasures, ou raccords à visser dont l’étanchéité dépend de la portée et du couple.","Le <b>capillaire du bulbe</b> : pincé, plié ou frotté, il se rompt — et l’élément thermostatique se vide.","La <b>prise d’égalisation externe</b> et son raccordement sur la ligne d’aspiration.","La <b>tige de réglage</b> et son bouchon : un bouchon laissé desserré après réglage est une fuite lente.","Le corps du détendeur si l’appareil travaille en <b>contrainte mécanique</b> ou sous vibration."]},
    trap: "Le détendeur thermostatique régule la surchauffe, pas directement la température du local.",
    memory: "Bulbe + membrane + ressort + pointeau = dosage mécanique de la surchauffe.",
    question: { prompt: "Pourquoi employer une égalisation externe ?", answers: ["Pour alimenter électriquement le détendeur.", "Pour transmettre sous la membrane la pression réelle en sortie d’évaporateur.", "Pour remplacer le bulbe thermostatique."], correct: 1, why: "La prise externe compense notamment les pertes de charge entre l’entrée et la sortie de l’évaporateur." }
  },
  {
    id: "detendeur-electronique", family: "cycle", title: "Détendeur électronique", short: "Mesure, calcul et actionneur",
    images: [{ src: "images-organes/detendeur-electronique.webp", label: "Détendeur électronique", alt: "Détendeur électronique frigorifique isolé avec son actionneur" }],
    symbols: [["detendeur_electronique", "Détendeur électronique"]],
    functionTitle: "Détendre et moduler le débit par commande électronique",
    functionText: "Le détendeur électronique fait chuter la pression et dose le débit admis dans l’évaporateur. Un régulateur calcule la commande à partir de mesures, puis l’actionneur déplace précisément le pointeau.",
    keys: ["La vanne seule ne peut pas réguler.", "La chaîne comprend capteurs, régulateur, actionneur et corps de vanne.", "La commande peut suivre finement les variations de charge."],
    inlet: "orange", outlet: "darkblue",
    connectionNotes: ["Entrée : liquide HP.", "Sortie : mélange liquide-vapeur BP.", "Connexions électriques : alimentation et commande de l’actionneur.", "Capteurs associés : température et souvent pression selon la régulation."],
    extraConnection: "Le schéma électrique et le paramétrage font partie du fonctionnement : une mesure erronée entraîne une mauvaise commande.",
    animation: "electronic",
    mechanismTitle: "Mesurer, calculer, positionner",
    mechanismSteps: ["Les capteurs transmettent leurs mesures.", "Le régulateur calcule l’écart par rapport à la consigne.", "L’actionneur déplace le pointeau par pas ou en continu selon la technologie.", "La nouvelle ouverture modifie le débit massique."],
    location: { x: 10, y: 50, text: "À gauche · en amont de l’évaporateur" },
    mounting: ["Respecter le sens de circulation et la position autorisée.", "Installer une filtration adaptée en amont.", "Placer et câbler correctement les capteurs associés.", "Effectuer l’initialisation et le paramétrage prévus par le fabricant."],
    leaks: {"title":"Où ça fuit sur un détendeur électronique","points":["Les <b>raccords</b> fluidiques d’entrée et de sortie, comme sur tout organe de ligne.","Le <b>passage de l’actionneur</b> vers le corps de vanne : c’est là que la partie électrique rejoint le circuit sous pression.","Les <b>capteurs</b> associés et leurs prises de pression, quand la régulation en comporte.","Les <b>vibrations</b> et la contrainte sur un appareil tenu seulement par sa tuyauterie.","Un défaut électrique ne fait pas fuir, mais il peut laisser la vanne dans une position qui met le circuit en <b>surpression</b> : les deux se surveillent ensemble."]},
    trap: "Une vanne électronique mécaniquement correcte peut mal réguler si le capteur, le câblage ou le paramètre est faux.",
    memory: "Capteur → régulateur → actionneur → pointeau → débit.",
    question: { prompt: "Quel élément décide de l’ouverture ?", answers: ["Le voyant liquide.", "Le régulateur, à partir des mesures reçues.", "Le ressort du pressostat HP."], correct: 1, why: "Le régulateur traite les mesures et envoie une commande à l’actionneur du détendeur." }
  },
  {
    id: "tube-capillaire", family: "cycle", title: "Tube capillaire", short: "Détente fixe calibrée",
    images: [{ src: "images-organes/tube-capillaire.webp", label: "Tube capillaire", alt: "Tube capillaire frigorifique isolé enroulé en bobine" }],
    symbols: [["tube_capillaire", "Tube capillaire"]],
    functionTitle: "Créer une perte de charge fixe",
    functionText: "Le tube capillaire est un tube de très faible diamètre et de longueur déterminée. Sa résistance à l’écoulement provoque la chute de pression entre la ligne liquide et l’évaporateur, sans commande mobile.",
    keys: ["Aucun bulbe, moteur ou réglage en fonctionnement.", "Diamètre et longueur sont calculés pour l’appareil.", "La charge et les conditions de fonctionnement influencent fortement l’alimentation."],
    inlet: "orange", outlet: "darkblue",
    connectionNotes: ["Entrée : liquide HP filtré.", "Sortie : mélange BP vers l’évaporateur.", "Le tube lui-même constitue le passage calibré."],
    extraConnection: "Le capillaire de détente ne doit pas être confondu avec le capillaire de commande reliant un bulbe à un détendeur thermostatique.",
    animation: "capillary",
    mechanismTitle: "Une restriction longue et immobile",
    mechanismSteps: ["Le liquide HP entre dans un passage très étroit.", "Les frottements et la longueur créent une perte de charge.", "La pression chute progressivement.", "Un mélange liquide-vapeur BP alimente l’évaporateur."],
    location: { x: 10, y: 50, text: "À gauche · entre ligne liquide et évaporateur" },
    mounting: ["Ne pas modifier la longueur ni le diamètre prévus.", "Éviter écrasement, pincement et coude trop serré.", "Maintenir une filtration propre en amont.", "Reproduire le cheminement et les contacts thermiques définis par le constructeur."],
    leaks: {"title":"Où ça fuit sur un tube capillaire","points":["Les <b>brasures</b> à ses deux extrémités : la section est fine, la reprise de brasure y est délicate.","Les <b>points de fixation et de frottement</b> : un capillaire qui vibre contre une tôle finit par s’user et percer.","Le <b>pincement</b> du tube, à la pose ou lors d’une intervention voisine.","La liaison capillaire–ligne d’aspiration (échangeur), quand elle existe.","Un capillaire <b>bouché</b> ne fuit pas, mais il fait monter la pression en amont : ne pas confondre le symptôme et la cause."]},
    trap: "Chercher une vis de réglage est une erreur : le tube capillaire est une détente fixe.",
    memory: "Petit diamètre + longueur calculée = perte de charge fixe.",
    question: { prompt: "Qu’est-ce qui règle le débit du capillaire ?", answers: ["Un moteur pas à pas.", "Son diamètre, sa longueur et les conditions de pression.", "Un bulbe fixé sur l’aspiration."], correct: 1, why: "Le capillaire ne comporte aucun organe mobile de régulation." }
  },
  {
    id: "reservoir-liquide", family: "liquid", title: "Réservoir liquide", short: "Stocker et alimenter la ligne liquide",
    images: [{ src: "images-organes/reservoir-liquide.webp", label: "Réservoir liquide vertical", alt: "Réservoir liquide frigorifique vertical isolé avec ses raccords" }],
    symbols: [["bouteille_liquide", "Bouteille liquide"]],
    functionTitle: "Constituer une réserve de liquide HP",
    functionText: "Le réservoir liquide reçoit le fluide condensé, absorbe les variations de quantité présentes dans le circuit et alimente la ligne liquide avec du fluide à l’état liquide lorsque son montage le permet.",
    keys: ["Il se place du côté haute pression.", "La sortie liquide peut utiliser un tube plongeur interne.", "Il ne remplace ni le condenseur ni le séparateur d’huile."],
    inlet: "orange", outlet: "orange",
    connectionNotes: ["Entrée : liquide HP venant du condenseur.", "Sortie : liquide HP vers les accessoires de ligne.", "Des raccords de service ou de sécurité peuvent compléter l’équipement."],
    extraConnection: "Le nombre de raccords, le sens et la position dépendent du modèle. La documentation constructeur reste la référence.",
    animation: "receiver",
    mechanismTitle: "Séparer l’espace vapeur et la réserve liquide",
    mechanismSteps: ["Le fluide condensé entre dans le récipient.", "Le niveau liquide varie avec la charge et le fonctionnement.", "La phase vapeur occupe l’espace supérieur.", "La sortie prélève la phase liquide selon la conception du réservoir."],
    location: { x: 37, y: 10, text: "Après le condenseur · avant la ligne liquide" },
    mounting: ["Respecter la position prévue et fixer le récipient sans contrainte.", "Identifier avec certitude l’entrée, la sortie liquide et les raccords de service.", "Préserver les organes de sécurité associés.", "Ne jamais inventer un taux de remplissage : appliquer les règles et la documentation en vigueur."],
    leaks: {"title":"Où ça fuit sur un réservoir de liquide","points":["Les <b>raccords</b> d’entrée et de sortie et leurs brasures.","Les <b>accessoires vissés</b> : vanne de service, bouchon de purge, voyant de niveau, raccord de soupape.","La <b>soupape de sécurité</b> : après une ouverture, elle peut ne pas se refermer parfaitement.","La <b>corrosion externe</b> de la virole, surtout en extérieur ou sur un appareil ancien.","Un réservoir contient une <b>réserve de liquide</b> : une fuite y est plus lourde de conséquences qu’ailleurs sur la ligne."]},
    trap: "Un réservoir liquide et une bouteille anti-coup de liquide se ressemblent parfois, mais ils ne sont ni au même endroit ni au même état de fluide.",
    memory: "Côté HP : recevoir le liquide et alimenter la ligne liquide.",
    question: { prompt: "Sur quelle partie du circuit se trouve habituellement le réservoir liquide ?", answers: ["Sur la ligne liquide HP, après le condenseur.", "Sur l’aspiration BP, juste avant le compresseur.", "Dans le circuit d’eau de l’évaporateur."], correct: 0, why: "Le réservoir liquide appartient au côté haute pression et alimente la ligne liquide." }
  },
  {
    id: "filtre-deshydrateur", family: "liquid", title: "Filtre déshydrateur", short: "Filtrer et retenir l’humidité",
    images: [{ src: "images-organes/filtre-deshydrateur.webp", label: "Filtre déshydrateur", alt: "Filtre déshydrateur frigorifique cylindrique isolé" }],
    symbols: [["filtre_deshydrateur", "Filtre déshydrateur"]],
    functionTitle: "Protéger le circuit contre particules et humidité",
    functionText: "Le filtre déshydrateur retient des particules et fixe l’humidité grâce à son média interne. Il protège notamment l’organe de détente contre l’obstruction et limite les réactions indésirables liées à l’eau.",
    keys: ["Installé habituellement sur la ligne liquide.", "Un modèle unidirectionnel impose le respect de la flèche.", "Un élément saturé ou pollué doit être remplacé selon la procédure."],
    inlet: "orange", outlet: "orange",
    connectionNotes: ["Entrée : liquide HP contenant éventuellement particules ou traces d’humidité.", "Sortie : liquide HP filtré vers le voyant et la détente.", "Le média interne n’est pas un simple tamis métallique."],
    extraConnection: "Certains filtres sont conçus pour d’autres lignes ou pour un fonctionnement réversible. Ne pas transposer sans vérifier leur référence.",
    animation: "filter",
    mechanismTitle: "Le média retient deux familles de polluants",
    mechanismSteps: ["Le fluide traverse le corps du filtre.", "Les particules solides sont retenues.", "Le dessiccant fixe l’humidité.", "Le fluide poursuit son trajet vers les organes sensibles."],
    location: { x: 28, y: 23, text: "Ligne liquide · en amont du voyant et du détendeur" },
    mounting: ["Respecter la flèche et la position du fabricant.", "Garder les bouchons jusqu’au dernier moment pour limiter l’exposition à l’air.", "Limiter l’échauffement du corps lors du brasage selon la notice.", "Remplacer le filtre après une ouverture ou une pollution lorsque la procédure l’exige."],
    leaks: {"title":"Où ça fuit sur un filtre déshydrateur","points":["Les <b>brasures</b> d’entrée et de sortie, refaites à chaque remplacement — donc à contrôler à chaque fois.","Sur les modèles démontables, le <b>joint de couvercle</b> et les boulons de serrage.","Les <b>prises de pression</b> quand l’appareil en porte une de chaque côté.","La <b>surchauffe au brasage</b>, qui abîme le média interne et fragilise la liaison : filtre protégé, chiffon humide, azote circulant.","Un filtre <b>encrassé</b> ne fuit pas : il fait chuter la pression et givre en sortie. Autre symptôme, autre cause."]},
    trap: "Le filtre peut être froid ou présenter une chute de température lorsqu’il est très obstrué, mais le diagnostic doit être confirmé par des mesures.",
    memory: "Filtrer les particules + retenir l’humidité.",
    question: { prompt: "Pourquoi respecter la flèche d’un filtre unidirectionnel ?", answers: ["Parce que son média et sa construction imposent un sens de circulation.", "Uniquement pour rendre l’étiquette lisible.", "Pour transformer le liquide en vapeur."], correct: 0, why: "Le sens fait partie de la conception du composant et doit être vérifié sur le corps réel." }
  },
  {
    id: "voyant-liquide", family: "liquid", title: "Voyant liquide", short: "Observer bulles et humidité",
    images: [{ src: "images-organes/voyant-liquide.webp", label: "Voyant liquide", alt: "Voyant liquide frigorifique isolé avec fenêtre circulaire" }],
    symbols: [["voyant_liquide", "Voyant liquide"]],
    functionTitle: "Donner une observation locale de la ligne liquide",
    functionText: "Le voyant permet d’observer l’aspect du fluide dans la ligne et, lorsqu’il possède une pastille indicatrice, l’état d’humidité correspondant aux repères du fabricant.",
    keys: ["Les bulles sont un indice, pas un diagnostic unique.", "La couleur de la pastille se lit avec la légende du fabricant.", "Le voyant est habituellement placé après le filtre déshydrateur."],
    inlet: "orange", outlet: "orange",
    connectionNotes: ["Le liquide HP traverse une fenêtre d’observation.", "L’entrée et la sortie restent sur la même ligne.", "Le voyant ne dose pas le débit et ne crée pas la détente."],
    extraConnection: "Un voyant sans pastille ne donne pas d’indication d’humidité. Toujours identifier le modèle réel.",
    animation: "sight",
    mechanismTitle: "Une fenêtre, deux observations possibles",
    mechanismSteps: ["Le fluide traverse le corps transparent.", "La fenêtre rend visibles d’éventuelles bulles.", "La pastille réagit à l’humidité selon sa technologie.", "Le technicien confronte l’observation aux autres mesures."],
    location: { x: 23, y: 33, text: "Ligne liquide · souvent après le filtre" },
    mounting: ["Installer la fenêtre dans une position lisible.", "Respecter un éventuel sens de circulation.", "Protéger le voyant contre les contraintes de tuyauterie et les chocs.", "Lire la pastille uniquement avec la légende du fabricant."],
    leaks: {"title":"Où ça fuit sur un voyant liquide","points":["Le <b>hublot</b> et son joint : c’est le point faible propre à cet organe.","Les <b>raccords</b> à visser ou les brasures selon le modèle.","La <b>surchauffe au brasage</b>, qui détruit le joint du hublot et la pastille d’humidité.","Les <b>chocs</b> : un voyant est en saillie sur la ligne, il se prend tout ce qui passe.","Le voyant sert à voir l’état du fluide et l’humidité : un voyant opaque ne dit plus rien, il se remplace."]},
    trap: "Des bulles ne prouvent pas automatiquement un manque de charge : perte de charge, variation de charge ou conditions transitoires sont aussi à examiner.",
    memory: "Observer le liquide et, selon le modèle, l’indicateur d’humidité.",
    question: { prompt: "Que faut-il conclure devant des bulles ?", answers: ["Le manque de charge est certain.", "C’est un indice à confronter aux pressions, températures et conditions de fonctionnement.", "Le compresseur est forcément hors service."], correct: 1, why: "Une observation isolée ne suffit pas pour poser un diagnostic fiable." }
  },
  {
    id: "electrovanne", family: "liquid", title: "Électrovanne", short: "Ouvrir ou fermer par commande électrique",
    images: [{ src: "images-organes/electrovanne.webp", label: "Électrovanne frigorifique", alt: "Électrovanne frigorifique isolée avec corps en laiton et bobine électrique" }],
    symbols: [["electrovanne_frigo", "Électrovanne"]],
    functionTitle: "Commander électriquement le passage du fluide",
    functionText: "L’électrovanne autorise ou interrompt le passage du fluide en réponse à une commande électrique. Une version normalement fermée se ferme sans alimentation ; son usage fréquent sur la ligne liquide permet notamment des séquences de pump-down.",
    keys: ["Normalement ouverte ou fermée décrit l’état sans alimentation.", "La bobine crée un champ magnétique.", "L’électrovanne n’est pas un détendeur de régulation."],
    inlet: "orange", outlet: "orange",
    connectionNotes: ["Deux raccords fluidiques en ligne.", "Une bobine et son raccordement électrique.", "Certains modèles utilisent la pression du fluide pour assister l’ouverture."],
    extraConnection: "L’emplacement habituel est la ligne liquide, mais d’autres applications existent. Vérifier le fluide, la pression différentielle et le sens autorisé.",
    animation: "solenoid",
    mechanismTitle: "Le champ magnétique déplace un noyau",
    mechanismSteps: ["La commande alimente la bobine.", "Le champ magnétique attire le noyau mobile.", "L’orifice pilote ou principal s’ouvre selon la conception.", "À la coupure, le ressort ramène une vanne normalement fermée."],
    location: { x: 18, y: 42, text: "Souvent sur la ligne liquide · avant la détente" },
    mounting: ["Respecter la flèche de circulation et la position de la bobine.", "Vérifier tension, fréquence et puissance de la bobine.", "Ne jamais alimenter une bobine déposée de son noyau lorsque le fabricant l’interdit.", "Protéger le corps et retirer la bobine pendant le brasage si la procédure le demande."],
    leaks: {"title":"Où ça fuit sur une électrovanne","points":["Les <b>raccords</b> fluidiques et leurs brasures.","Le <b>tube de l’équipage mobile</b> sous la bobine : c’est la partie sous pression que traverse la commande.","Le <b>joint de siège</b> : usé, il laisse passer le fluide vanne fermée — fuite interne, invisible de l’extérieur, qui se voit aux pressions.","La <b>surchauffe au brasage</b> : bobine déposée et corps protégé, sinon le siège est cuit.","La bobine elle-même ne contient pas de fluide : un défaut électrique n’est pas une fuite."]},
    trap: "Une bobine alimentée ne prouve pas que l’orifice est ouvert : noyau bloqué, pression différentielle ou défaut mécanique restent possibles.",
    memory: "Commande électrique → noyau mobile → passage autorisé ou fermé.",
    question: { prompt: "Une électrovanne normalement fermée est comment sans alimentation ?", answers: ["Ouverte.", "Fermée.", "Toujours à moitié ouverte."], correct: 1, why: "Le mot normalement décrit la position de repos, sans énergie électrique." }
  },
  {
    id: "clapet-vannes", family: "liquid", title: "Clapet anti-retour et vannes de service", short: "Imposer un sens, isoler et accéder",
    images: [{ src: "images-organes/clapet-vannes-service.webp", label: "Clapet et vannes de service", alt: "Trois composants frigorifiques isolés : clapet anti-retour et vannes de service" }],
    symbols: [["clapet_anti_retour", "Clapet anti-retour"], ["vanne_isolement", "Vanne d’isolement"]],
    functionTitle: "Contrôler le sens et permettre une intervention",
    functionText: "Le clapet anti-retour autorise le passage dans un seul sens. Une vanne de service permet, selon sa conception, d’isoler une partie du circuit et d’accéder à une prise de service pour mesurer, récupérer ou charger.",
    keys: ["Le clapet agit automatiquement par différence de pression.", "Les positions d’une vanne de service dépendent de sa construction.", "Les bouchons participent souvent à l’étanchéité finale."],
    inlet: "variable", outlet: "variable",
    connectionNotes: ["Clapet : une entrée, une sortie et un sens imposé.", "Vanne de service : passage principal, tige et parfois prise latérale.", "L’état du fluide dépend de la ligne où le composant est installé."],
    extraConnection: "La bibliothèque fournit le symbole d’une vanne d’isolement. Le symbole spécifique d’une vanne de service n’est pas inventé : la lecture du plan constructeur reste nécessaire.",
    animation: "check",
    mechanismTitle: "Ouverture dans un sens, fermeture dans l’autre",
    mechanismSteps: ["La pression amont pousse l’obturateur du clapet.", "Le passage s’ouvre dans le sens autorisé.", "Une inversion de pression ramène l’obturateur sur son siège.", "La vanne de service, elle, est positionnée volontairement par le technicien."],
    location: { x: 58, y: 18, text: "Emplacement variable · selon la fonction recherchée" },
    mounting: ["Respecter la flèche du clapet anti-retour.", "Identifier les positions de tige d’une vanne de service avant de manœuvrer.", "Ne jamais forcer la tige en butée.", "Remettre les bouchons avec le joint et le couple prévus, puis contrôler l’étanchéité."],
    leaks: {"title":"Où ça fuit sur un clapet ou une vanne de service","points":["Le <b>presse-étoupe</b> de la tige : il assure l’étanchéité autour d’une pièce qui tourne et se déplace.","Les <b>bouchons</b> des prises de pression : en fonctionnement, ils se remettent et se serrent — ce sont eux qui étanchent, pas le clapet interne.","Les <b>raccords</b> et brasures du passage principal.","Le <b>siège</b> d’un clapet anti-retour usé : il laisse passer à contresens, fuite interne qu’on lit sur les pressions.","Rappel de sécurité : la prise permanente d’une vanne de service reste reliée au compresseur dans <b>toutes</b> les positions — son bouchon ne se défait jamais sur une installation chargée."]},
    trap: "Une prise de service n’est pas forcément isolée dans toutes les positions de tige. Vérifier le schéma de la vanne utilisée.",
    memory: "Clapet : un seul sens. Vanne de service : isoler et accéder selon sa position.",
    question: { prompt: "Quel organe empêche automatiquement un retour de fluide ?", answers: ["Le clapet anti-retour.", "Le voyant liquide.", "Le réservoir liquide."], correct: 0, why: "Le clapet se ferme lorsque la différence de pression tend à inverser l’écoulement." }
  },
  {
    id: "bouteille-anti-coup", family: "protection", title: "Bouteille anti-coup de liquide", short: "Protéger l’aspiration du compresseur",
    images: [{ src: "images-organes/bouteille-anti-coup-liquide.webp", label: "Bouteille d’aspiration", alt: "Bouteille anti-coup de liquide frigorifique verticale isolée avec deux raccords supérieurs" }],
    symbols: [[null, "Symbole spécifique à valider"]],
    functionTitle: "Retenir un excès de liquide avant le compresseur",
    functionText: "Placée sur l’aspiration, la bouteille anti-coup de liquide sépare et retient temporairement du liquide qui ne doit pas entrer brutalement dans le compresseur. Elle laisse repartir la vapeur et organise un retour contrôlé du liquide et de l’huile selon sa conception.",
    keys: ["Elle appartient au côté BP.", "La sortie doit favoriser la vapeur vers le compresseur.", "Elle ne remplace pas une correction de la cause du retour de liquide."],
    inlet: "lightblue", outlet: "lightblue",
    connectionNotes: ["Entrée BP : vapeur pouvant entraîner des gouttelettes de liquide.", "Sortie BP : vapeur vers le compresseur.", "Un orifice interne peut assurer un retour dosé d’huile et de liquide."],
    extraConnection: "Aucun symbole spécifique n’existe actuellement dans la bibliothèque inerWeb. Le module le signale au lieu d’utiliser le symbole du réservoir liquide, qui serait faux.",
    animation: "accumulator",
    mechanismTitle: "Séparer les gouttelettes de la vapeur",
    mechanismSteps: ["Le mélange entre dans le volume de la bouteille.", "La vitesse diminue et les gouttelettes tombent au fond.", "La vapeur est prélevée par le tube interne.", "L’huile et une petite quantité de liquide reviennent de façon contrôlée selon la conception."],
    location: { x: 73, y: 82, text: "Aspiration BP · juste avant le compresseur" },
    mounting: ["Monter le récipient dans la position prévue, généralement verticale selon le modèle.", "Identifier entrée, sortie et éventuel orifice de retour.", "Dimensionner et sélectionner l’organe selon l’application, pas selon son apparence.", "Rechercher et corriger la cause d’un retour de liquide répété."],
    leaks: {"title":"Où ça fuit sur une bouteille anti-coup de liquide","points":["Les <b>raccords</b> d’entrée et de sortie et leurs brasures.","La <b>corrosion externe</b> de la virole, en particulier sur un appareil froid qui condense en permanence à sa surface.","Les <b>fixations</b> : une bouteille lourde tenue par sa seule tuyauterie met les raccords en contrainte.","L’<b>orifice de retour d’huile</b> et les prises éventuelles.","L’isolation thermique cache la surface : une fuite peut s’y développer sans trace visible."]},
    trap: "Ne pas confondre cette bouteille BP avec le réservoir liquide HP : leur ressemblance extérieure ne dit pas leur fonction.",
    memory: "Sur l’aspiration : retenir le liquide, laisser repartir la vapeur.",
    question: { prompt: "Quel fluide doit ressortir vers le compresseur ?", answers: ["Principalement de la vapeur BP.", "Uniquement du liquide HP.", "De l’eau du circuit secondaire."], correct: 0, why: "La bouteille protège le compresseur en empêchant l’arrivée brutale de liquide." }
  },
  {
    id: "separateur-huile", family: "protection", title: "Séparateur d’huile", short: "Récupérer l’huile au refoulement",
    images: [{ src: "images-organes/separateur-huile.webp", label: "Séparateur d’huile", alt: "Séparateur d’huile frigorifique vertical isolé avec deux raccords de gaz et un retour d’huile" }],
    symbols: [["separateur_huile", "Séparateur d’huile"]],
    functionTitle: "Séparer l’huile de la vapeur de refoulement",
    functionText: "Le séparateur d’huile reçoit la vapeur HP chaude chargée de fines gouttelettes d’huile. Il sépare une grande partie de l’huile, laisse repartir la vapeur vers le condenseur et renvoie l’huile vers le compresseur par une conduite dédiée.",
    keys: ["Installé sur le refoulement, près du compresseur selon la conception.", "Il possède un troisième trajet : le retour d’huile.", "Il améliore la gestion d’huile mais ne dispense pas d’une tuyauterie favorisant le retour."],
    inlet: "red", outlet: "red",
    connectionNotes: ["Entrée : vapeur HP chaude contenant de l’huile entraînée.", "Sortie principale : vapeur HP vers le condenseur.", "Sortie d’huile : retour séparé vers le carter ou le système de gestion d’huile."],
    extraConnection: "Le dispositif interne de retour peut utiliser un flotteur ou une autre commande. La conduite d’huile doit rester identifiable.",
    animation: "separator",
    mechanismTitle: "Ralentir, dévier et collecter les gouttelettes",
    mechanismSteps: ["Le gaz chargé d’huile entre à grande vitesse.", "Une déviation, un effet centrifuge ou un média coalescent sépare les gouttelettes.", "L’huile collectée descend dans le réservoir inférieur.", "Le gaz poursuit vers le condenseur et l’huile retourne au compresseur."],
    location: { x: 80, y: 28, text: "Refoulement HP · entre compresseur et condenseur" },
    mounting: ["Monter verticalement lorsque le modèle l’impose.", "Respecter entrée, sortie gaz et retour d’huile.", "Vérifier le fonctionnement du flotteur ou du dispositif de retour.", "Contrôler l’étanchéité et éviter les contraintes de tuyauterie."],
    leaks: {"title":"Où ça fuit sur un séparateur d’huile","points":["Les <b>raccords</b> d’entrée et de sortie, côté vapeur chaude — donc soumis à des cycles de température.","La <b>ligne de retour d’huile</b> vers le carter, son raccord et son éventuel filtre.","Les <b>flotteurs et bouchons</b> de visite sur les modèles démontables.","La <b>corrosion</b> et les vibrations, l’appareil étant situé juste au refoulement du compresseur.","Une trace d’huile n’est pas seulement salissante : <b>l’huile marque l’endroit où le fluide s’échappe</b>. C’est un indice de fuite, pas un désordre esthétique."]},
    trap: "Un séparateur mal raccordé peut priver le compresseur d’huile ou envoyer du liquide vers un emplacement non prévu.",
    memory: "Gaz HP avec huile → séparation → gaz vers condenseur + huile vers compresseur.",
    question: { prompt: "Quelle connexion distingue le séparateur d’huile d’un simple récipient en ligne ?", answers: ["Le retour d’huile vers le compresseur.", "Une arrivée d’eau potable.", "Un bulbe thermostatique."], correct: 0, why: "Le séparateur possède un trajet spécifique pour rendre l’huile au système de lubrification." }
  },
  {
    id: "pressostats", family: "control", title: "Pressostats HP et BP", short: "Transformer une pression en contact électrique",
    images: [{ src: "images-organes/pressostats.webp", label: "Pressostats HP et BP", alt: "Deux pressostats frigorifiques HP et BP isolés" }],
    symbols: [["pressostat_hp", "Pressostat HP"], ["pressostat_bp", "Pressostat BP"]],
    functionTitle: "Surveiller une pression et commuter un contact",
    functionText: "Un pressostat transforme la pression reçue par un raccord de mesure en action électrique. Le pressostat HP peut protéger contre une pression excessive. Le pressostat BP peut participer à la protection, à la commande ou à une séquence de pump-down selon le montage.",
    keys: ["Le fluide ne traverse pas le pressostat.", "HP et BP ne sont pas interchangeables.", "Seuil, différentiel et réarmement dépendent de l’application et du modèle."],
    noThrough: true,
    connectionNotes: ["Une prise de pression relie le pressostat à la ligne surveillée.", "Un mécanisme déplace un contact électrique.", "Les bornes appartiennent au circuit de commande, pas au circuit frigorifique."],
    extraConnection: "Un pressostat de sécurité peut exiger un réarmement manuel. Ne jamais modifier un réglage de sécurité sans procédure et valeur validées.",
    animation: "pressostat",
    mechanismTitle: "Pression → membrane → contact",
    mechanismSteps: ["La pression agit sur un soufflet ou une membrane.", "Le déplacement s’oppose à un ressort réglé.", "Au seuil, le mécanisme bascule le contact.", "La commande arrête, autorise ou signale selon le câblage."],
    location: { x: 82, y: 50, text: "Prises HP et BP · selon la pression surveillée" },
    mounting: ["Raccorder le bon pressostat au bon niveau de pression.", "Protéger la prise de pression contre vibration et pulsations selon la notice.", "Câbler le contact correspondant à la fonction attendue.", "Valider seuil, différentiel et type de réarmement sans inventer de valeur."],
    leaks: {"title":"Où ça fuit sur un pressostat","points":["La <b>prise de pression</b> et son raccord : c’est le seul endroit où l’appareil touche le circuit.","Le <b>capillaire</b> de liaison quand le pressostat est déporté : pincement, frottement, rupture.","Le <b>soufflet interne</b> percé par fatigue : le fluide s’échappe alors par le corps de l’appareil.","Les bornes et le boîtier appartiennent au circuit de commande : un défaut électrique n’est <b>pas</b> une fuite.","Un pressostat déclenché à répétition signale souvent autre chose : chercher la cause avant de réarmer."]},
    trap: "Shunter un pressostat de sécurité supprime une protection essentielle et ne constitue jamais une réparation.",
    memory: "Mesurer une pression et changer l’état d’un contact électrique.",
    question: { prompt: "Le fluide frigorigène traverse-t-il un pressostat ?", answers: ["Oui, comme dans un filtre.", "Non. La pression agit sur une partie sensible raccordée à la ligne.", "Seulement quand le compresseur est arrêté."], correct: 1, why: "Le pressostat reçoit une information de pression ; il n’est pas un organe traversé par le débit principal." }
  },
  {
    id: "sondes-capteurs", family: "control", title: "Sondes et capteurs de pression", short: "Mesurer et transmettre une information",
    images: [
      { src: "images-organes/sonde-temperature.webp", label: "Sonde de température", alt: "Sonde de température frigorifique isolée avec son câble" },
      { src: "images-organes/capteur-pression.webp", label: "Capteur de pression", alt: "Capteur électronique de pression isolé avec raccord fileté et connecteur" }
    ],
    symbols: [["sonde_temperature", "Sonde de température"], [null, "Capteur de pression à valider"]],
    functionTitle: "Convertir une grandeur physique en signal",
    functionText: "La sonde de température réagit à la température du point mesuré. Le capteur de pression reçoit la pression par un raccord. Tous deux transmettent une information exploitable par un régulateur, un afficheur ou une supervision.",
    keys: ["Un capteur mesure ; un actionneur agit.", "La qualité du montage conditionne la qualité de la mesure.", "Le type de signal et la plage doivent être compatibles avec le régulateur."],
    noThrough: true,
    connectionNotes: ["Sonde : contact de surface, doigt de gant ou insertion selon le modèle.", "Capteur de pression : un seul raccord de pression et un connecteur électrique.", "Le débit principal ne traverse pas ces capteurs."],
    extraConnection: "La bibliothèque contient la sonde de température. Aucun symbole frigorifique spécifique de transmetteur de pression n’est encore validé ; il n’est pas inventé dans ce cours.",
    animation: "sensor",
    mechanismTitle: "Grandeur mesurée → signal → décision",
    mechanismSteps: ["La partie sensible reçoit une température ou une pression.", "Sa caractéristique électrique varie.", "Le signal est transmis au régulateur.", "Le régulateur l’interprète avant de commander un autre organe."],
    location: { x: 58, y: 52, text: "Emplacement choisi selon la mesure nécessaire" },
    mounting: ["Assurer un bon contact thermique et isoler la sonde lorsque nécessaire.", "Choisir une plage de pression compatible avec le circuit.", "Éviter les contraintes sur câble, connecteur et raccord.", "Vérifier la correspondance du signal, du câblage et du paramétrage."],
    leaks: {"title":"Où ça fuit sur une sonde ou un capteur de pression","points":["Le <b>raccord de pression</b> d’un capteur : unique point en contact avec le fluide.","Le <b>doigt de gant</b> d’une sonde de température monté sur le circuit, et son joint.","Une sonde de <b>contact</b> ne touche pas le fluide : elle ne peut pas fuir, mais un collier mal serré fausse la mesure.","Le <b>câblage</b> ne fuit pas ; une mesure fausse peut en revanche masquer une fuite en cours.","Point de méthode : la méthode indirecte de contrôle d’étanchéité repose sur ces mesures — une sonde mal posée, et le contrôle ne vaut rien."]},
    trap: "Une valeur affichée plausible peut être fausse si la sonde est mal fixée, mal isolée, mal étalonnée ou affectée au mauvais canal.",
    memory: "Mesurer correctement avant de réguler correctement.",
    question: { prompt: "Quelle différence fondamentale sépare un capteur d’un actionneur ?", answers: ["Le capteur fournit une information ; l’actionneur modifie le procédé.", "Le capteur ouvre toujours un passage de fluide.", "Il n’existe aucune différence."], correct: 0, why: "La chaîne de régulation distingue mesure, décision et action." }
  },
  {
    id: "regulateurs-securite", family: "control", title: "Régulateurs de pression et organes de sécurité", short: "Moduler ou protéger",
    images: [{ src: "images-organes/regulateurs-securite.webp", label: "Régulateurs et soupape", alt: "Trois organes frigorifiques isolés : régulateurs de pression et soupape de sécurité" }],
    symbols: [["vanne_securite", "Vanne de sécurité"], [null, "Régulateurs spécifiques à valider"]],
    functionTitle: "Tenir une pression utile ou protéger une enveloppe",
    functionText: "Un régulateur de pression module un passage pour maintenir, limiter ou différencier une pression selon sa fonction et son emplacement. Un organe de sécurité, comme une soupape, s’ouvre exceptionnellement lorsque sa pression de tarage est atteinte afin de protéger une enveloppe.",
    keys: ["Régulation et sécurité ne sont pas la même fonction.", "Le sens, la prise de pression et la position varient selon le régulateur.", "Une soupape n’est ni une vanne de service ni un réglage d’exploitation."],
    inlet: "variable", outlet: "variable",
    connectionNotes: ["Régulateur : entrée, sortie et parfois ligne pilote ou prise de pression.", "Soupape : entrée reliée au volume protégé et sortie dirigée vers un rejet prévu.", "L’état du fluide dépend de la zone du circuit."],
    extraConnection: "La bibliothèque fournit le symbole de sécurité, mais pas chaque famille de régulateur frigorifique. Les symboles manquants restent signalés en attente de validation humaine.",
    animation: "regulator",
    mechanismTitle: "Modulation normale ou ouverture de secours",
    mechanismSteps: ["La pression agit sur une membrane ou un clapet.", "Le ressort établit l’équilibre correspondant à la fonction.", "Le régulateur module son ouverture pendant le fonctionnement normal.", "La soupape de sécurité reste fermée et ne s’ouvre qu’au seuil prévu."],
    location: { x: 52, y: 50, text: "Emplacement variable · défini par la fonction" },
    mounting: ["Identifier précisément la fonction et le sens du régulateur.", "Raccorder correctement toute prise pilote ou égalisation.", "Ne jamais modifier le tarage d’un organe de sécurité hors procédure autorisée.", "Diriger le rejet de sécurité vers la destination prévue par la conception et les règles applicables."],
    leaks: {"title":"Où ça fuit sur un régulateur ou une soupape","points":["Les <b>raccords</b> d’entrée et de sortie et la ligne pilote quand elle existe.","La <b>tige de réglage</b> et son bouchon d’origine, à remettre après tout réglage.","La <b>soupape de sécurité</b> après une ouverture : elle peut rester non étanche, et son rejet doit aller là où c’est prévu.","Le <b>siège</b> d’un régulateur usé : fuite interne, lisible aux pressions et non à l’extérieur.","Une soupape ne se bouchonne jamais et ne se règle pas au jugé : c’est un organe de sécurité, réglé et plombé selon la documentation."]},
    trap: "Utiliser une soupape comme régulateur normal ou isoler une protection sans dispositif prévu détruit la logique de sécurité.",
    memory: "Régulateur : moduler. Sécurité : protéger en dernier recours.",
    question: { prompt: "Quel énoncé distingue correctement les deux fonctions ?", answers: ["Le régulateur module en service ; la soupape protège exceptionnellement au seuil prévu.", "La soupape règle normalement la température du local.", "Le régulateur remplace toujours tous les pressostats."], correct: 0, why: "La régulation agit pendant le service normal ; la soupape constitue une protection mécanique de dernier recours." }
  }
];

const revisionSets = {
  "17": { label: "Séance 17 · Compression et protections", ids: ["compresseurs", "bouteille-anti-coup", "separateur-huile", "pressostats"] },
  "18": { label: "Séance 18 · Échangeurs et capteurs", ids: ["condenseurs", "evaporateurs", "sondes-capteurs", "regulateurs-securite"] },
  "19": { label: "Séance 19 · Détente et ligne liquide", ids: ["detendeur-thermostatique", "detendeur-electronique", "tube-capillaire", "reservoir-liquide", "filtre-deshydrateur", "voyant-liquide", "electrovanne", "clapet-vannes"] }
};

let activeFamily = "cycle";
let currentDossier = null;
let currentScreen = 0;
let currentAnswer = null;
let questionAnswered = false;
let revisionMode = null;
let revisionIndex = 0;
let acquired = loadJson("inerweb-tome3-acquis-v1", {});

let speechState = "idle";
let speechRun = 0;
let selectedVoice = null;
const rates = [0.75, 0.85, 0.95, 1, 1.1, 1.25];
let rateIndex = 2;

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
  catch { return fallback; }
}

function saveJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* Le stockage reste facultatif. */ }
}

function familyById(id) { return families.find(family => family.id === id); }
function dossierById(id) { return dossiers.find(dossier => dossier.id === id); }

function renderFamilies() {
  $("#family-tabs").innerHTML = families.map(family => `
    <button class="family-tab" type="button" role="tab" data-family="${family.id}" aria-selected="${family.id === activeFamily}">
      ${family.title}<small>${family.subtitle}</small>
    </button>`).join("");
  $$("[data-family]").forEach(button => button.addEventListener("click", () => {
    activeFamily = button.dataset.family;
    renderHome();
  }));
}

function symbolPath(id) { return `symboles/${id}.svg`; }

function renderHome() {
  const list = dossiers.filter(dossier => dossier.family === activeFamily);
  $("#dossier-grid").innerHTML = list.map(dossier => {
    const firstSymbol = dossier.symbols.find(symbol => symbol[0]);
    return `
      <button class="dossier-card ${acquired[dossier.id] ? "acquired" : ""}" type="button" data-open-dossier="${dossier.id}">
        <span class="dossier-icon">${firstSymbol ? `<img src="${symbolPath(firstSymbol[0])}" alt="">` : "<b>?</b>"}</span>
        <span><h2>${dossier.title}</h2><p>${dossier.short}</p></span>
        <span class="card-state">${acquired[dossier.id] ? "✓ Acquis" : "À travailler"}</span>
      </button>`;
  }).join("");
  $$("[data-open-dossier]").forEach(button => button.addEventListener("click", () => openDossier(button.dataset.openDossier, 0)));
  renderFamilies();
  updateGlobalProgress();
}

function updateGlobalProgress() {
  const count = dossiers.filter(dossier => acquired[dossier.id]).length;
  $("#progress-count").textContent = String(count);
  $("#progress-message").textContent = count === 16 ? "Les 16 dossiers sont acquis." : count ? "Continuez avec un dossier à travailler." : "Commencez par le cycle principal.";
  $("#progress-ring").style.borderTopColor = count === 16 ? "#1e7e54" : "#ff6b35";
}

function openDossier(id, screen = 0) {
  const dossier = dossierById(id);
  if (!dossier) return;
  stopSpeech();
  currentDossier = dossier;
  currentScreen = Math.max(0, Math.min(NB_ECRANS - 1, screen));
  currentAnswer = null;
  questionAnswered = false;
  $("#home-view").hidden = true;
  $("#dossier-view").hidden = false;
  $("#exit-dossier").hidden = false;
  renderScreen();
}

function goHome() {
  stopSpeech();
  revisionMode = null;
  revisionIndex = 0;
  currentDossier = null;
  $("#dossier-view").hidden = true;
  $("#home-view").hidden = false;
  $("#exit-dossier").hidden = true;
  history.replaceState(null, "", location.pathname);
  renderHome();
}

function renderRail() {
  const family = familyById(currentDossier.family);
  $("#rail-family").textContent = revisionMode ? revisionSets[revisionMode].label : family.title;
  $("#rail-title").textContent = currentDossier.title;
  $("#rail-progress").innerHTML = SCREEN_NAMES.map((name, index) => `
    <button class="rail-step ${index === currentScreen ? "active" : ""}" type="button" data-rail-screen="${index}" aria-current="${index === currentScreen ? "step" : "false"}">
      <b>${index + 1}</b><span>${name}</span>
    </button>`).join("");
  $$("[data-rail-screen]").forEach(button => button.addEventListener("click", () => goToScreen(Number(button.dataset.railScreen))));
  $("#rail-context").innerHTML = revisionMode
    ? `<b>Révision guidée</b>Question ${revisionIndex + 1} sur ${revisionSets[revisionMode].ids.length}. Une erreur propose de revoir le dossier.`
    : `<b>Six écrans fixes</b>La structure reste identique pour chaque organe : reconnaître, comprendre, situer, monter et mémoriser.`;
}

function renderScreen() {
  if (!currentDossier) return;
  renderRail();
  $("#screen-kicker").textContent = `DOSSIER ${String(dossiers.indexOf(currentDossier) + 1).padStart(2, "0")} · ÉCRAN ${currentScreen + 1} SUR ${NB_ECRANS}`;
  $("#screen-title").textContent = SCREEN_NAMES[currentScreen];
  $("#screen-count").textContent = `${currentScreen + 1} / ${NB_ECRANS}`;
  $("#screen-state").innerHTML = revisionMode ? `<span class="revision-chip">${revisionSets[revisionMode].label} · ${revisionIndex + 1}/${revisionSets[revisionMode].ids.length}</span>` : currentDossier.short;

  const renderers = [renderRecognition, renderFunction, renderConnections, renderMechanism, renderLocation, renderLeaks, renderQuestion];
  $("#screen-content").innerHTML = renderers[currentScreen](currentDossier);
  wireScreen();
  updateNavigation();
  updateUrl();
}

function goToScreen(index) {
  stopSpeech();
  currentScreen = Math.max(0, Math.min(NB_ECRANS - 1, index));
  currentAnswer = null;
  questionAnswered = false;
  renderScreen();
}

function renderRecognition(dossier) {
  return `
    <div class="recognition-layout">
      <div class="visual-gallery" style="--visual-count:${dossier.images.length}">
        ${dossier.images.map(image => `<figure class="real-figure"><img src="${image.src}" alt="${image.alt}"><figcaption>${image.label} · vue isolée de reconnaissance</figcaption></figure>`).join("")}
      </div>
      <section class="symbol-panel">
        <h3>Symboles de la bibliothèque inerWeb</h3>
        <p>Le symbole porte la vérité schématique ; la vue réaliste aide seulement à reconnaître.</p>
        <div class="symbol-grid">
          ${dossier.symbols.map(([id, label]) => id
            ? `<div class="symbol-card"><img src="${symbolPath(id)}" alt="Symbole normalisé : ${label}"><b>${label}</b></div>`
            : `<div class="symbol-card symbol-pending"><span>SYMBOLE<br>À VALIDER</span><b>${label}</b></div>`).join("")}
        </div>
        <p class="source-note">Vues isolées : aide visuelle sans valeur de plan constructeur. Symboles : bibliothèque SVG inerWeb, copiés sans redessin.</p>
      </section>
    </div>`;
}

function renderFunction(dossier) {
  return `
    <div class="function-layout">
      <section class="professional-card">
        <span>FONCTION PROFESSIONNELLE COMPLÈTE</span>
        <h3>${dossier.functionTitle}</h3>
        <p>${dossier.functionText}</p>
      </section>
      <aside class="key-card">
        <h3>🔑 La clé</h3>
        <ul>${dossier.keys.map(key => `<li>${key}</li>`).join("")}</ul>
      </aside>
    </div>`;
}

function flowBox(flowName, title) {
  const flow = FLOW[flowName];
  return `<div class="port-box" style="--flow-color:${flow.color}"><b>${title} · ${flow.label}</b><span>${flow.detail}</span></div>`;
}

function renderConnections(dossier) {
  const main = dossier.noThrough
    ? `<div class="no-through"><div><b>Pas de débit principal à travers l’organe</b><p>Le raccord reçoit une pression ou la partie sensible reçoit une température. L’organe transmet ensuite une information électrique.</p></div></div>`
    : `<section class="ports-card"><div class="port-flow">${flowBox(dossier.inlet, "ENTRÉE")}<div class="flow-arrow" style="--flow-color:${FLOW[dossier.outlet].color}">→</div>${flowBox(dossier.outlet, "SORTIE")}</div><div class="connection-extra">${dossier.extraConnection}</div></section>`;
  return `
    <div class="connection-layout">
      ${main}
      <section class="text-card">
        <h3>Connexions à identifier</h3>
        <ul>${dossier.connectionNotes.map(note => `<li>${note}</li>`).join("")}</ul>
        ${dossier.noThrough ? `<div class="connection-extra">${dossier.extraConnection}</div>` : ""}
      </section>
    </div>`;
}

/* =====================================================================
   L'ÉVAPORATEUR — schéma animé plutôt que rectangle
   ---------------------------------------------------------------------
   L'animation précédente était un rectangle arrondi avec deux étiquettes
   qui se chevauchaient : elle ne montrait NI le serpentin, NI le sens de
   l'air, NI le changement d'état. Refaite le 3 août 2026 à la demande de
   F. Henninot, avec quatre choses qu'un dessin fixe ne dit pas :
     · l'air circule à CONTRE-COURANT du fluide — l'air le plus chaud
       rencontre la vapeur la plus chaude ;
     · la température du fluide fait un PALIER pendant l'évaporation, puis
       remonte : c'est la surchauffe, et elle commence après la dernière
       goutte ;
     · l'écart le plus serré entre les deux courbes porte un nom, le
       PINCEMENT — montré, pas défini ;
     · cette température d'évaporation se LIT AU MANOMÈTRE, par la relation
       pression-température (retour sur un acquis, pédagogie en spirale).
   Aucune valeur chiffrée : ni température, ni pression, ni écart. Ce sont
   des grandeurs de machine, elles viennent de la notice et du relevé.
   ===================================================================== */
/* Écran « Fonctionnement interne » — retour de F. Henninot (03-04/08) sur les
   animations abstraites : « je vois des petites billes dans des hachures, j'ai
   compris parce que je sais de quoi je parle, mais quelqu'un qui ne connaît
   pas ne comprend pas ce que c'est ». Deux réponses :
   1. quand une PLANCHE VALIDÉE du pack montre déjà l'organe pour de vrai
      (res/svg/), c'est ELLE qui s'affiche — jamais un dessin refait ;
   2. pour les autres, l'animation reste mais elle est IDENTIFIÉE : le symbole
      normalisé de l'organe et son nom au-dessus, l'entrée et la sortie
      nommées en dessous. On sait ce qu'on regarde. */
const PLANCHES_MECANISME = {
  compresseurs: ["compresseurs.svg", "La compression vue de l’intérieur — et les quatre technologies, chacune avec son symbole."],
  condenseurs: ["echangeur-air.svg", "La batterie ailetée : le fluide dans le serpentin, l’air qui la traverse et repart réchauffé."],
  evaporateurs: ["givre-degivrage.svg", "L’évaporateur vu de face : l’air du local traverse la batterie, le bac reçoit les condensats — et le givre se surveille."],
  "detendeur-thermostatique": ["detendeur-regulation.svg", "Bulbe, membrane, pointeau : comment le détendeur se corrige tout seul."],
  "regulateurs-securite": ["regulateurs-pression.svg", "Trois régulateurs, trois endroits du circuit, trois raisons."],
  "sondes-capteurs": ["mesure-surchauffe.svg", "À quoi servent ces capteurs : mesurer la surchauffe, en deux points."]
};

function machineMarkup(type, dossier) {
  const inColor = FLOW[dossier.inlet || "variable"].color;
  const outColor = FLOW[dossier.outlet || "variable"].color;
  if (type === "compressor") return `
    <div class="compressor-deck" aria-label="Quatre animations mécaniques : piston, scroll, vis et rotatif">
      <div class="mini-machine"><b>Piston</b><i class="mini-piston"></i></div>
      <div class="mini-machine"><b>Scroll</b><i class="mini-scroll"></i></div>
      <div class="mini-machine"><b>Vis</b><i class="mini-screw"></i></div>
      <div class="mini-machine"><b>Rotatif</b><i class="mini-rotary"></i></div>
    </div>`;
  const body = {
    condenser: `<div class="coil-piece"></div><span class="air-arrow">CHALEUR REJETÉE ↑</span><span class="water-arrow">VAPEUR → LIQUIDE</span>`,
    evaporator: `<div class="coil-piece"></div><span class="air-arrow">CHALEUR ABSORBÉE ↓</span><span class="water-arrow">MÉLANGE → VAPEUR</span>`,
    thermostatic: `<div class="spring"></div><div class="needle"></div><div class="seat"></div>`,
    electronic: `<div class="coil-box"></div><div class="plunger"></div><div class="seat"></div>`,
    capillary: `<div class="coil-piece" style="border-width:9px;border-radius:50%"></div>`,
    receiver: `<div class="vessel"><div class="vapor-cloud"></div><div class="liquid-level"></div></div>`,
    filter: `<div class="media-bed"></div><i class="particle p1"></i><i class="particle p2"></i><i class="particle p3"></i>`,
    sight: `<div class="glass-window"><i class="bubble b1"></i><i class="bubble b2"></i></div>`,
    solenoid: `<div class="coil-box"></div><div class="plunger"></div><div class="seat"></div>`,
    check: `<div class="check-disc"></div><div class="seat"></div>`,
    accumulator: `<div class="vessel"><div class="u-tube"></div><i class="drop"></i><div class="liquid-level"></div></div>`,
    separator: `<div class="vessel"><div class="swirl"></div><i class="oil-drop"></i><div class="liquid-level" style="height:22%"></div></div>`,
    pressostat: `<div class="diaphragm"></div><div class="spring"></div><div class="contact"></div>`,
    sensor: `<div class="vessel" style="inset:25% 39%"><div class="sensor-pulse"></div></div>`,
    regulator: `<div class="regulator-spring"></div><div class="needle"></div><div class="seat"></div>`
  }[type] || `<div class="needle"></div><div class="seat"></div>`;
  return `<div class="machine" style="--pipe-color:${outColor};color:${inColor}"><div class="pipe inlet"></div><div class="pipe outlet"></div><div class="body">${body}</div><i class="flow-dot"></i><i class="flow-dot"></i><i class="flow-dot"></i></div>`;
}

function renderMechanism(dossier) {
  const planche = PLANCHES_MECANISME[dossier.id];
  const symbole = (dossier.symbols || []).find(([id]) => id);
  const identite = `
    <div class="mecanisme-identite">
      ${symbole ? `<img src="${symbolPath(symbole[0])}" alt="Symbole normalisé : ${symbole[1]}">` : ""}
      <b>${dossier.title}</b>
      <span>${(dossier.connectionNotes || []).slice(0, 2).join(" · ")}</span>
    </div>`;
  const scene = planche
    ? `<figure class="mecanisme-planche">
         <img src="../svg/${planche[0]}" alt="${dossier.mechanismTitle}">
         <figcaption>${planche[1]}</figcaption>
       </figure>`
    : `<div class="mechanism-stage" role="img" aria-label="Animation interne de principe : ${dossier.mechanismTitle}">${machineMarkup(dossier.animation, dossier)}</div>
       ${identite}`;
  return `
    <div class="mechanism-layout${planche ? " avec-planche" : ""}">
      <div class="mecanisme-scene">${scene}</div>
      <section class="mechanism-copy">
        <h3>${dossier.mechanismTitle}</h3>
        <ol>${dossier.mechanismSteps.map(step => `<li>${step}</li>`).join("")}</ol>
        <p>${planche ? "Cette planche vient du cours : c’est la même image que le stagiaire retrouvera en fiche." : "L’animation montre un principe. Les formes exactes, jeux et séquences restent propres au constructeur."}</p>
      </section>
    </div>`;
}

function renderLocation(dossier) {
  return `
    <div class="location-layout">
      <section class="cross-card" aria-label="Emplacement habituel sur la Croix du Frigoriste">
        <div class="cross-map">
          <i class="cross-line top" style="--line-color:#f28a16"></i><i class="cross-line right" style="--line-color:#e33d32"></i><i class="cross-line bottom" style="--line-color:#52b9e9"></i><i class="cross-line left" style="--line-color:#1769aa"></i>
          <span class="cross-node top">CONDENSEUR<br>EN HAUT</span><span class="cross-node right">COMPRESSEUR<br>À DROITE</span><span class="cross-node bottom">ÉVAPORATEUR<br>EN BAS</span><span class="cross-node left">DÉTENDEUR<br>À GAUCHE</span>
          <span class="cross-marker" style="left:${Math.min(Math.max(dossier.location.x, 14), 86)}%;top:${Math.min(Math.max(dossier.location.y, 12), 82)}%;transform:translate(-50%,-50%)">${dossier.title}</span>
        </div>
      </section>
      <section class="mount-card">
        <p class="eyebrow">EMPLACEMENT HABITUEL</p>
        <h3>${dossier.location.text}</h3>
        <ul>${dossier.mounting.map(point => `<li>${point}</li>`).join("")}</ul>
        <p class="trap"><b>⚠ Le piège :</b> ${dossier.trap}</p>
      </section>
    </div>`;
}

function renderLeaks(dossier) {
  const bloc = dossier.leaks;
  if (!bloc) {
    return `<div class="leak-layout"><section class="leak-card"><p class="eyebrow">OÙ ÇA FUIT</p><h3>À compléter</h3><p>Les points de fuite de cet organe n’ont pas encore été écrits.</p></section></div>`;
  }
  return `
    <div class="leak-layout">
      <section class="leak-card">
        <p class="eyebrow">OÙ ÇA FUIT, CE QU’ON CONTRÔLE</p>
        <h3>${bloc.title}</h3>
        <ul class="leak-list">${bloc.points.map(point => `<li>${point}</li>`).join("")}</ul>
      </section>
      <section class="leak-method">
        <p class="eyebrow">LA MÉTHODE, ELLE, NE CHANGE PAS</p>
        <ol>
          <li><b>Le registre d’abord</b> : ce qui a déjà fui sur cette machine se refuit souvent au même endroit.</li>
          <li><b>Les yeux et la main</b> : traces d’huile, corrosion, givre anormal, raccord desserré. L’huile marque l’endroit où le fluide s’échappe.</li>
          <li><b>La méthode indirecte</b> : des mesures qui s’écartent de ce qu’on attend, sans ouvrir le circuit.</li>
          <li><b>La méthode directe</b> : détecteur électronique, mousse ou traceur, selon la procédure du site et l’appareil.</li>
          <li><b>La trace écrite</b> : ce qui a été trouvé, ce qui a été réparé, ce qui reste à surveiller.</li>
        </ol>
        <p class="leak-warning"><b>⚠ Avant de toucher :</b> installation consignée électriquement, et mise en pression à l’<b>azote</b> uniquement — jamais d’oxygène, jamais d’air comprimé.</p>
      </section>
    </div>`;
}

function renderQuestion(dossier) {
  const chosen = currentAnswer;
  const question = dossier.question;
  const feedback = chosen === null ? "" : chosen === question.correct
    ? `<p class="feedback success"><b>✓ Correct.</b> ${question.why}</p>`
    : `<p class="feedback error"><b>✗ À revoir.</b> ${question.why}<button type="button" id="review-dossier">Revoir le dossier</button></p>`;
  return `
    <div class="question-layout">
      <section class="memory-summary">
        <span>À DIRE SANS REGARDER</span>
        <h3>${dossier.title}</h3>
        <p>${dossier.memory}</p>
      </section>
      <section class="question-card">
        <p class="eyebrow">MINI-QUESTION DE MÉMORISATION</p>
        <h3>${question.prompt}</h3>
        <div class="answer-list">
          ${question.answers.map((answer, index) => `<button class="answer-button ${chosen === null ? "" : index === question.correct ? "correct" : chosen === index ? "incorrect" : ""}" type="button" data-answer="${index}" ${chosen === null ? "" : "disabled"}>${answer}</button>`).join("")}
        </div>
        ${feedback}
      </section>
    </div>`;
}

function wireScreen() {
  $$("[data-answer]").forEach(button => button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer))));
  const review = $("#review-dossier");
  if (review) review.addEventListener("click", () => {
    revisionMode = null;
    goToScreen(0);
  });
}

function answerQuestion(index) {
  currentAnswer = index;
  questionAnswered = true;
  if (index === currentDossier.question.correct) {
    acquired[currentDossier.id] = true;
    saveJson("inerweb-tome3-acquis-v1", acquired);
  }
  renderScreen();
}

function updateNavigation() {
  const previous = $("#previous");
  const next = $("#next");
  if (revisionMode) {
    previous.textContent = revisionIndex === 0 ? "← Tous les dossiers" : "← Question précédente";
    next.textContent = revisionIndex === revisionSets[revisionMode].ids.length - 1 ? "Terminer la révision ✓" : "Question suivante →";
    next.disabled = !questionAnswered;
    return;
  }
  previous.textContent = currentScreen === 0 ? "← Tous les dossiers" : "← Retour";
  next.textContent = currentScreen === NB_ECRANS - 1 ? "Dossier suivant →" : "Continuer →";
  next.disabled = false;
}

function previousAction() {
  if (revisionMode) {
    if (revisionIndex === 0) return goHome();
    revisionIndex -= 1;
    return openDossier(revisionSets[revisionMode].ids[revisionIndex], 5);
  }
  if (currentScreen === 0) return goHome();
  goToScreen(currentScreen - 1);
}

function nextAction() {
  if (revisionMode) {
    if (!questionAnswered) return;
    if (revisionIndex === revisionSets[revisionMode].ids.length - 1) return goHome();
    revisionIndex += 1;
    return openDossier(revisionSets[revisionMode].ids[revisionIndex], 5);
  }
  if (currentScreen < 5) return goToScreen(currentScreen + 1);
  const index = dossiers.indexOf(currentDossier);
  openDossier(dossiers[(index + 1) % dossiers.length].id, 0);
}

function updateUrl() {
  if (!currentDossier) return;
  const url = new URL(location.href);
  url.search = "";
  if (revisionMode) url.searchParams.set("revision", revisionMode);
  else {
    url.searchParams.set("dossier", currentDossier.id);
    url.searchParams.set("ecran", String(currentScreen + 1));
  }
  history.replaceState(null, "", url);
}

function loadRate() {
  try {
    const saved = Number(localStorage.getItem("inerweb-tome3-voice-rate"));
    const index = rates.indexOf(saved);
    if (index >= 0) rateIndex = index;
  } catch { rateIndex = 2; }
  updateRateLabel();
}

function saveRate() {
  try { localStorage.setItem("inerweb-tome3-voice-rate", String(rates[rateIndex])); }
  catch { /* Préférence facultative. */ }
  updateRateLabel();
  if (speechState !== "idle") speakCurrent();
}

function updateRateLabel() { $("#rate-label").textContent = `${rates[rateIndex].toFixed(2).replace(".", ",")}×`; }

function chooseVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const ranked = voices.filter(voice => /^fr(?:-|_)/i.test(voice.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  selectedVoice = ranked[0] || voices.find(voice => /^fr/i.test(voice.lang)) || voices[0] || null;
}

function voiceScore(voice) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = voice.lang.toLowerCase() === "fr-fr" ? 10 : 4;
  ["natural", "naturel", "neural", "online", "google", "microsoft", "denise", "henri", "julie", "paul", "hortense"].forEach(word => { if (name.includes(word)) score += 3; });
  return score;
}

function currentVisibleText() {
  if ($("#home-view").hidden === false) return "Tome 3. Technologie des organes frigorifiques. Choisissez une famille puis un dossier.";
  return `${currentDossier.title}. ${SCREEN_NAMES[currentScreen]}. ${$("#screen-content").innerText.replace(/\s+/g, " ").trim()}`;
}

function speakCurrent() {
  if (!("speechSynthesis" in window)) {
    $("#speech-warning").hidden = false;
    return;
  }
  stopSpeech();
  const run = ++speechRun;
  const utterance = new SpeechSynthesisUtterance(currentVisibleText());
  utterance.lang = "fr-FR";
  utterance.rate = rates[rateIndex];
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => { if (run === speechRun) setSpeechState("speaking"); };
  utterance.onend = () => { if (run === speechRun) setSpeechState("idle"); };
  utterance.onerror = event => {
    if (run !== speechRun) return;
    if (event.error !== "canceled" && event.error !== "interrupted") $("#speech-warning").hidden = false;
    setSpeechState("idle");
  };
  window.speechSynthesis.speak(utterance);
}

function pauseSpeech() {
  if (!("speechSynthesis" in window)) return;
  if (speechState === "speaking") { window.speechSynthesis.pause(); setSpeechState("paused"); }
  else if (speechState === "paused") { window.speechSynthesis.resume(); setSpeechState("speaking"); }
}

function stopSpeech() {
  speechRun += 1;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setSpeechState("idle");
}

function setSpeechState(state) {
  speechState = state;
  $("#listen").innerHTML = state === "idle" ? "▶ <span>Écouter</span>" : "↻ <span>Relire</span>";
  $("#pause").disabled = state === "idle";
  $("#pause").innerHTML = state === "paused" ? "▶ <span>Reprendre</span>" : "Ⅱ <span>Pause</span>";
}

function toggleReadability() {
  const active = document.body.classList.toggle("font-large");
  $("#readability").setAttribute("aria-pressed", String(active));
  try { localStorage.setItem("inerweb-tome3-large-text", active ? "1" : "0"); }
  catch { /* Préférence facultative. */ }
}

function loadReadability() {
  let active = false;
  try { active = localStorage.getItem("inerweb-tome3-large-text") === "1"; }
  catch { active = false; }
  document.body.classList.toggle("font-large", active);
  $("#readability").setAttribute("aria-pressed", String(active));
}

function initializeRoute() {
  const params = new URLSearchParams(location.search);
  const revision = params.get("revision");
  if (revisionSets[revision]) {
    revisionMode = revision;
    revisionIndex = 0;
    openDossier(revisionSets[revision].ids[0], 5);
    return;
  }
  const dossier = dossierById(params.get("dossier"));
  if (dossier) {
    const screen = Math.max(0, Math.min(NB_ECRANS - 1, Number(params.get("ecran") || 1) - 1));
    openDossier(dossier.id, screen);
  }
}

$("#previous").addEventListener("click", previousAction);
$("#next").addEventListener("click", nextAction);
$("#rail-home").addEventListener("click", goHome);
$("#exit-dossier").addEventListener("click", goHome);
$("#listen").addEventListener("click", speakCurrent);
$("#pause").addEventListener("click", pauseSpeech);
$("#slower").addEventListener("click", () => { rateIndex = Math.max(0, rateIndex - 1); saveRate(); });
$("#faster").addEventListener("click", () => { rateIndex = Math.min(rates.length - 1, rateIndex + 1); saveRate(); });
$("#readability").addEventListener("click", toggleReadability);

document.addEventListener("keydown", event => {
  const tag = event.target && event.target.tagName;
  if (["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"].includes(tag)) return;
  if ($("#dossier-view").hidden) return;
  if (event.key === "ArrowRight") nextAction();
  if (event.key === "ArrowLeft") previousAction();
  if (event.key === "Escape") goHome();
  if (event.key === " " && speechState !== "idle") { event.preventDefault(); pauseSpeech(); }
});

document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
window.addEventListener("beforeunload", stopSpeech);

if ("speechSynthesis" in window) {
  chooseVoice();
  window.speechSynthesis.addEventListener("voiceschanged", chooseVoice);
} else {
  $("#listen").disabled = true;
  $("#pause").disabled = true;
}

loadRate();
loadReadability();
renderHome();
initializeRoute();
