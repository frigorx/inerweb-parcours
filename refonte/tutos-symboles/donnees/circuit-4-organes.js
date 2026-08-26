/* =====================================================================
   TUTO — Le circuit frigorifique : quatre organes, deux pressions
   Voir ../LIRE-MOI.md pour le contrat d'écriture.
   Croix du frigoriste tenue : détendeur GAUCHE · compresseur DROITE ·
   condenseur HAUT · évaporateur BAS.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['circuit-4-organes'] = {

  titre: 'Le circuit frigorifique',
  sousTitre: 'Quatre organes, deux pressions — on le monte pièce par pièce',
  cartouche: 'Tuto',
  marque: 'inerweb',
  grille: [1000, 640],

  /* ---- les organes : un symbole, une place, un nom ------------------ */
  elements: [
    { id: 'comp', sym: 'compresseur_piston',   x: 820, y: 330, taille: 128, rot: -90, nom: 'Compresseur' },
    { id: 'cond', sym: 'echangeur_a_air',      x: 500, y: 120, taille: 120, nom: 'CD', nomDessus: true },
    { id: 'det',  sym: 'detendeur_thermo_ext', x: 180, y: 330, taille: 118, rot:  90, nom: 'Détendeur' },
    { id: 'evap', sym: 'echangeur_a_air',      x: 500, y: 545, taille: 120, nom: 'EV' },

    /* les organes de la ligne liquide, ajoutés à l'étape 5 */
    { id: 'bout', sym: 'bouteille_liquide',    x: 420, y: 120, taille: 62, nom: 'Bouteille' },
    { id: 'filt', sym: 'filtre_deshydrateur',  x: 330, y: 120, taille: 62, nom: 'Filtre', nomDessus: true },
    { id: 'voy',  sym: 'voyant_liquide',       x: 245, y: 120, taille: 62, nom: 'Voyant' }
  ],

  /* ---- les liaisons : une suite de points sur la grille ------------- */
  tuyaux: [
    { id: 'refoulement', points: '820,330 820,120 500,120', nature: 'hp_gaz',     decalage: [-60, -22] },
    { id: 'liquide',     points: '500,120 180,120 180,330', nature: 'hp_liquide', decalage: [-42, -24] },
    { id: 'detente',     points: '180,330 180,545 500,545', nature: 'bp_melange', decalage: [ 66, -20] },
    { id: 'aspiration',  points: '500,545 820,545 820,330', nature: 'bp_gaz',     decalage: [-58, -20] }
  ],

  /* ---- le déroulé --------------------------------------------------- */
  etapes: [
    {
      titre: 'La croix du frigoriste',
      texte: 'Avant de tracer le moindre tuyau, on place les quatre organes toujours au même endroit. ' +
             'Ce repère ne change jamais : détendeur à gauche, compresseur à droite, condenseur en haut, ' +
             'évaporateur en bas. Une fois qu’il est dans l’œil, n’importe quel schéma se lit d’un coup.',
      pose: ['comp', 'cond', 'det', 'evap'],
      focus: [],
      geste: 'Prenez l’habitude de redessiner cette croix à main levée avant chaque intervention : ' +
             'c’est elle qui vous dit où vous êtes dans le circuit.'
    },
    {
      titre: 'Le compresseur',
      texte: 'Il aspire le gaz froid à basse pression et le refoule chaud à haute pression. ' +
             'C’est lui qui met le fluide en mouvement : sans lui, rien ne circule. ' +
             'Il sépare le circuit en deux — tout ce qui le suit est en haute pression, tout ce qui le précède est en basse pression.',
      pose: [],
      focus: ['comp']
    },
    {
      titre: 'Le refoulement',
      texte: 'À la sortie du compresseur, le fluide est un gaz chaud sous haute pression. ' +
             'Il monte vers le condenseur. C’est la ligne la plus chaude du circuit.',
      trace: ['refoulement'],
      focus: ['refoulement'],
      danger: 'La ligne de refoulement peut dépasser 100 °C en fonctionnement. On ne la saisit jamais à main nue.'
    },
    {
      titre: 'Le condenseur',
      texte: 'Le gaz chaud y cède sa chaleur à l’air ambiant. En perdant cette chaleur, il change d’état : ' +
             'il devient liquide. La pression, elle, ne change pas — on est toujours en haute pression.',
      focus: ['cond'],
      geste: 'Un condenseur encrassé rejette moins bien la chaleur : la pression de condensation tend à monter. ' +
             'Une haute pression élevée n’est jamais un diagnostic à elle seule.'
    },
    {
      titre: 'La ligne liquide',
      texte: 'Entre le condenseur et le détendeur, le fluide est liquide et sous haute pression. ' +
             'C’est sur cette ligne que se placent les organes annexes : la bouteille qui fait réserve, ' +
             'le filtre déshydrateur qui retient l’humidité et les impuretés, le voyant qui laisse regarder le liquide.',
      pose: ['bout', 'filt', 'voy'],
      trace: ['liquide'],
      focus: ['bout', 'filt', 'voy'],
      geste: 'Des bulles au voyant en régime établi : on cherche d’abord un manque de charge ou une perte de charge ' +
             'en amont — on ne complète pas la charge par réflexe.'
    },
    {
      titre: 'Le détendeur',
      texte: 'Il fait chuter la pression d’un coup. Le liquide haute pression devient un mélange de liquide et de gaz, ' +
             'à basse pression et à basse température. C’est la frontière entre les deux pressions, ' +
             'de l’autre côté du compresseur.',
      trace: ['detente'],
      focus: ['det'],
      geste: 'Le bulbe du détendeur thermostatique se pose sur la ligne d’aspiration, jamais ailleurs : ' +
             'c’est la température qu’il y lit qui commande son ouverture.'
    },
    {
      titre: 'L’évaporateur',
      texte: 'C’est ici que le froid est produit. Le fluide s’évapore en prenant la chaleur du local ou du produit. ' +
             'Il entre en mélange liquide-gaz, il ressort entièrement en gaz.',
      focus: ['evap'],
      geste: 'Produire du froid, c’est prendre de la chaleur quelque part. L’évaporateur ne « fabrique » rien : ' +
             'il retire de la chaleur d’un côté, le condenseur la rejette de l’autre.'
    },
    {
      titre: 'L’aspiration ferme la boucle',
      texte: 'Le gaz basse pression retourne au compresseur, et tout recommence. ' +
             'Le circuit est fermé : la même quantité de fluide tourne indéfiniment. ' +
             'C’est pourquoi une fuite ne se « rattrape » pas en rajoutant du fluide — elle se cherche et se répare.',
      trace: ['aspiration'],
      focus: ['aspiration', 'comp'],
      controle: {
        question: 'Où se trouve exactement la frontière entre la haute et la basse pression ?',
        choix: [
          'Au condenseur et à l’évaporateur',
          'Au compresseur et au détendeur',
          'Sur la ligne liquide seulement'
        ],
        bonne: 1,
        explication: 'Ce sont les deux organes qui font varier la pression : le compresseur la fait monter, ' +
                     'le détendeur la fait chuter. Le condenseur et l’évaporateur, eux, changent l’état du fluide ' +
                     'sans changer sa pression.'
      }
    }
  ]
};
