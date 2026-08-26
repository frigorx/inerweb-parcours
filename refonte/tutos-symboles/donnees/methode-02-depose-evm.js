/* =====================================================================
   FICHE MÉTHODE 02 — Dépose des manomètres (méthode avec électrovanne
   sur ligne liquide)
   Source : « 02 Fiche méthode dépose des manifolds avec EVM.docx »
   (F. Henninot, mai 2026). Décor : circuit réaliste commun — l'EVM y est
   à sa vraie place, sur la ligne liquide (relecture du 14/08).
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-02-depose-evm'] = {

  titre: 'Dépose des manomètres',
  sousTitre: 'Méthode avec électrovanne sur ligne liquide — installation en fonctionnement',
  cartouche: 'Méthode',
  marque: 'lycee',
  decor: 'circuit-complet',

  elements: [
    { id: 'mano', sym: 'manometres', x: 520, y: 330, taille: 150, nom: 'Manifold' }
  ],

  tuyaux: [
    { id: 'flexBP', points: '520,330 919,330 919,404', nature: 'flex_bp', dessus: true, decalage: [-2, -24] },
    { id: 'flexHP', points: '520,330 250,330 250,120', nature: 'flex_hp', decalage: [0, -20] }
  ],

  etapes: [
    {
      titre: 'Pourquoi cette méthode',
      texte: 'S’ils ne sont pas déposés dans les règles de l’art, le fluide contenu dans les ' +
             'flexibles et les manomètres est rejeté dans l’air — conséquences directes sur ' +
             'l’environnement, et à long terme sur la machine. Pour cette procédure, ' +
             'l’installation doit être équipée d’une électrovanne (EVM) sur la ligne liquide, ' +
             'et elle doit être en fonctionnement. Le manifold est en place : flexible bleu sur ' +
             'l’aspiration, flexible rouge sur le départ liquide.',
      pose: ['comp', 'vhp', 'cd', 'bout', 'vdl', 'evm', 'det', 'ev', 'vbp', 'mano'],
      trace: ['refoul', 'liquide', 'detente', 'asp', 'flexBP', 'flexHP']
    },
    { base: 'presse-etoupe-desserrer', focus: ['vbp', 'vdl'] },
    {
      titre: 'Vanne côté HP en siège arrière',
      texte: 'On met la vanne de service côté haute pression — ici le départ liquide, où le ' +
             'flexible rouge est branché — en siège arrière : sa prise de service est isolée. ' +
             'Le fluide des flexibles ne pourra plus repartir par là.',
      focus: ['vdl'],
      verifier: 'La fiche source écrit « vanne de service HP » ; transposé au départ liquide ' +
                'puisque c’est là que le flexible est branché. À confirmer.'
    },
    {
      titre: 'Vannette du flexible jaune fermée',
      texte: 'On vérifie que la vannette en bout du flexible jaune est bien fermée : ' +
             'c’est la seule sortie du manifold vers l’extérieur.',
      focus: ['mano']
    },
    { base: 'vannes-manifold-ouvrir',
      texte: 'On ouvre les vannes HP et BP du manomètre : le fluide des flexibles peut ' +
             'maintenant être aspiré par l’installation.',
      focus: ['mano'] },
    {
      titre: 'Neutraliser l’électrovanne',
      texte: 'On retire la bobine de l’électrovanne de la ligne liquide et on y insère un ' +
             'tournevis, afin de ne pas la faire fondre. L’électrovanne se ferme : le compresseur ' +
             'aspire tout ce qui reste en aval — flexibles compris.',
      focus: ['evm'],
      danger: 'Une bobine alimentée sans noyau chauffe et grille : le tournevis fait office de noyau.',
      vue: VUE_EVM,
      module: { page: 'electrovanne-pedagogique/index.html', titre: 'L’électrovanne en détail' }
    },
    {
      titre: 'Attendre 0 bar sur les manomètres',
      texte: 'On attend que la pression indiquée sur les manomètres HP et BP descende à 0 bar. ' +
             'Si le pressostat BP coupe avant zéro, on force le fonctionnement de l’installation ' +
             'jusqu’à atteindre 0 bar.',
      focus: ['mano']
    },
    {
      titre: 'Vanne BP en siège arrière',
      texte: 'Les flexibles sont vides : on met la vanne de service BP en siège arrière. ' +
             'Les deux prises de service sont isolées, plus rien ne peut sortir.',
      focus: ['vbp'],
      module: { page: 'vanne-de-service/index.html?ecran=positions', titre: 'La vanne de service — les 3 positions en coupe' }
    },
    {
      titre: 'Retirer les flexibles, remettre les bouchons',
      texte: 'On retire les flexibles de l’installation et on revisse les bouchons ' +
             'sur les prises de service des deux vannes.',
      retire: ['flexBP', 'flexHP', 'mano'],
      focus: ['vbp', 'vdl']
    },
    { base: 'presse-etoupe-resserrer', focus: ['vbp', 'vdl'] },
    { base: 'controle-etancheite-detecteur', focus: ['vbp', 'vdl'] },
    { base: 'capuchons-remettre',
      focus: ['vbp', 'vdl'],
      controle: {
        question: 'À quoi sert le tournevis inséré dans la bobine de l’électrovanne ?',
        choix: [
          'À maintenir l’électrovanne ouverte',
          'À servir de noyau pour que la bobine ne fonde pas',
          'À couper l’alimentation électrique'
        ],
        bonne: 1,
        explication: 'La bobine reste alimentée mais privée de son noyau : sans masse métallique ' +
                     'dedans, elle chauffe et grille. Le tournevis remplace le noyau le temps ' +
                     'de l’opération — pendant que l’électrovanne, elle, se ferme.'
      }
    }
  ]
};
