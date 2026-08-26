/* =====================================================================
   FICHE MÉTHODE 06 — Récupération de fluide frigorigène
   Source : « 06 Fiche méthode récupération de fluide frigorigène.docx »
   (F. Henninot, mai 2026), y compris son schéma de branchement.
   Schéma REFAIT le 14/08 après relecture : tracés sans superposition,
   les deux tés marqués, vannettes posées sur les lignes.
   NB : la fiche source numérote deux étapes « 4 » — repris en 4 et 5.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-06-recuperation'] = {

  titre: 'Récupération de fluide frigorigène',
  sousTitre: 'Avec station de transfert et bouteille de récupération — installation à l’arrêt',
  cartouche: 'Méthode',
  marque: 'lycee',
  grille: [1150, 700],

  elements: [
    { id: 'mano',    sym: 'manometres',           x: 150, y: 140, taille: 140, nom: 'Manifold', nomDessus: true },
    { id: 'inst',    sym: 'ventilateur',          x: 150, y: 560, taille: 120, nom: 'Installation' },
    { id: 'vIN',     sym: 'vanne_isolement',      x: 530, y: 140, taille: 64, nom: 'Vanne d’entrée' },
    { id: 'vByPass', sym: 'vanne_isolement',      x: 430, y: 230, taille: 62, rot: 90, nom: 'By-pass', nomDecalage: [72, 4] },
    { id: 'station', sym: 'station_recuperation', x: 760, y: 140, taille: 150, nom: 'Station de récupération', nomDessus: true, complement: true },
    { id: 'vPompe',  sym: 'vanne_isolement',      x: 1010, y: 475, taille: 58, rot: 90, nom: 'Vannette', nomDecalage: [-72, 4] },
    { id: 'pompe',   sym: 'pompe_a_vide',         x: 1010, y: 590, taille: 90, nom: 'Pompe à vide', nomDecalage: [-105, 5], complement: true },
    { id: 'boutRec', sym: 'bouteille_fluide',     x: 700, y: 515, taille: 105, nom: 'Bouteille de récupération', nomDecalage: [-155, 0], complement: true },
    { id: 'balance', sym: 'balance',              x: 700, y: 585, taille: 88, nom: 'Balance', nomDecalage: [95, 5], complement: true }
  ],

  tuyaux: [
    { id: 'flexBPHP',  points: '150,205 150,500', nature: 'flex_bp',
      mot: 'flexibles BP · HP', decalage: [4, -150] },
    { id: 'flexJaune', points: '150,140 430,140', nature: 'flex_jaune',
      mot: 'flexible central jaune', decalage: [-90, -22] },
    { id: 'ligneIN',   points: '430,140 760,140', nature: 'service', mot: false },
    { id: 'byPass',    points: '430,140 430,320 1010,320', nature: 'service',
      mot: 'by-pass', decalage: [-56, 60] },
    { id: 'ligneOUT',  points: '760,140 1010,140 1010,320', nature: 'service', mot: false },
    { id: 'tronc',     points: '1010,320 1010,440', nature: 'service', mot: false },
    { id: 'flexPompe', points: '1010,440 1010,590', nature: 'flex_jaune', mot: false },
    { id: 'flexBout',  points: '1010,440 700,440 700,480', nature: 'flex_jaune', mot: false }
  ],

  jonctions: [
    { x: 430, y: 140, tuyau: 'byPass' },
    { x: 1010, y: 320, tuyau: 'byPass' },
    { x: 1010, y: 440, tuyau: 'flexBout' }
  ],

  etapes: [
    {
      titre: 'Le montage : deux tés, un by-pass',
      texte: 'Les manifolds sont posés sur l’installation (sinon : fiche méthode pose des ' +
             'manomètres) et l’installation est à l’arrêt. La station de récupération est équipée ' +
             'de deux tés — un à l’entrée, un à la sortie. Le flexible central jaune du manifold ' +
             'arrive au té d’entrée ; de là, une ligne rejoint la vanne IN de la station, et le ' +
             'by-pass avec sa vannette relie l’entrée à la ligne de sortie.',
      pose: ['mano', 'inst', 'vIN', 'vByPass', 'station'],
      trace: ['flexBPHP', 'flexJaune', 'ligneIN', 'byPass', 'ligneOUT', 'tronc'],
      verifier: 'Schéma redessiné d’après la fiche source ; disposition des tés et des vannettes à valider.'
    },
    { base: 'peser-bouteille',
      texte: 'On pèse la bouteille de récupération (ou bouteille de transfert) et on note le poids. ' +
             'C’est par différence qu’on connaîtra la masse récupérée.',
      pose: ['boutRec', 'balance'], focus: ['boutRec', 'balance'] },
    {
      titre: 'Tirer au vide les flexibles et le by-pass',
      texte: 'Vannes IN et OUT de la station sur « close ». La pompe à vide, raccordée en bout de ' +
             'ligne par sa vannette, tire au vide le flexible de la pompe, le by-pass et le ' +
             'flexible central jaune des manomètres. Aucun air ne doit partir dans la bouteille.',
      pose: ['pompe', 'vPompe'], trace: ['flexPompe'],
      focus: ['pompe', 'vByPass', 'flexJaune'],
      geste: 'On récupère du fluide, pas de l’air : tout ce qui sera traversé par le fluide est d’abord vidé.'
    },
    {
      titre: 'Basculer le flexible de la pompe sur la bouteille',
      texte: 'On ferme la vannette en bout du flexible de la pompe à vide, on éteint la pompe, ' +
             'et on raccorde ce flexible sur la bouteille de récupération.',
      retire: ['flexPompe', 'vPompe', 'pompe'], trace: ['flexBout'],
      focus: ['boutRec']
    },
    {
      titre: 'Régler la station pour la récupération',
      texte: 'On ferme la vannette du by-pass. Sur la station : vanne centrale sur ' +
             '« récupération », vanne IN sur « liquide », vanne OUT sur « open ». ' +
             'On ouvre la vannette du flexible de la bouteille, puis la bouteille.',
      focus: ['station', 'vByPass', 'boutRec']
    },
    {
      titre: 'Récupérer',
      texte: 'On ouvre les deux vannes des manifolds et on met en route la station de ' +
             'récupération : le fluide de l’installation part vers la bouteille.',
      focus: ['mano', 'station'],
      danger: 'Si l’installation est équipée d’une électrovanne, placer un aimant permanent ' +
              'à la place de la bobine.',
      module: { page: 'electrovanne-pedagogique/index.html', titre: 'L’électrovanne en détail' }
    },
    {
      titre: 'À 0 bar : purger la station',
      texte: 'Une fois la pression à l’intérieur de l’installation à 0 bar, on procède à la purge ' +
             'de la station de récupération — en suivant la notice de la station.',
      focus: ['station'],
      geste: 'La purge vide le fluide resté dans la station elle-même : sans elle, il y resterait ' +
             'du fluide de cette intervention dans la suivante.'
    },
    {
      titre: 'Récupérer le liquide du flexible',
      texte: 'Après la purge : fermer la vannette du flexible central jaune, fermer la bouteille, ' +
             'vanne OUT sur « close », vanne centrale sur « récupération » et vanne IN sur ' +
             '« liquide », ouvrir le by-pass, remettre la station en route : elle récupère le ' +
             'liquide contenu dans le flexible de la bouteille.',
      focus: ['station', 'vByPass'],
      verifier: 'Cette étape enchaîne six actions dans la fiche source : découpage plus fin possible si besoin.'
    },
    {
      titre: 'Fermer, débrancher, peser',
      texte: 'Une fois la récupération du liquide du flexible terminée : vanne IN sur « close », ' +
             'on débranche et on pèse la bouteille de récupération.',
      retire: ['flexBout'],
      focus: ['boutRec', 'balance'],
      controle: {
        question: 'Pourquoi tire-t-on au vide les flexibles et le by-pass AVANT la récupération ?',
        choix: [
          'Pour vérifier l’étanchéité de la station',
          'Pour ne pas envoyer d’air dans la bouteille de récupération',
          'Pour accélérer le transfert du fluide'
        ],
        bonne: 1,
        explication: 'Tout ce que contiennent les flexibles part dans la bouteille avec le fluide. ' +
                     'De l’air dans une bouteille de récupération, ce sont des incondensables : ' +
                     'la bouteille monte en pression et le fluide récupéré est pollué.'
      }
    }
  ]
};
