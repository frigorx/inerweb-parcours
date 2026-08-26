/* =====================================================================
   FICHE MÉTHODE 03 — Mise sous pression azote (MSP)
   Source : « 03 Fiche métode MSP.docx » (F. Henninot, mai 2026).
   Décor : circuit réaliste commun.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-03-msp-azote'] = {

  titre: 'Mise sous pression azote',
  sousTitre: 'Le test d’étanchéité après intervention — installation tirée au vide',
  cartouche: 'Méthode',
  marque: 'lycee',
  decor: 'circuit-complet',

  elements: [
    { id: 'mano',  sym: 'manometres',      x: 520, y: 330, taille: 150, nom: 'Manifold' },
    { id: 'azote', sym: 'bouteille_azote', x: 740, y: 200, taille: 116, nom: 'Azote', nomDecalage: [82, 5], complement: true }
  ],

  tuyaux: [
    { id: 'flexBP',    points: '520,330 919,330 919,404', nature: 'flex_bp', dessus: true, decalage: [-2, -24] },
    { id: 'flexHP',    points: '520,330 250,330 250,120', nature: 'flex_hp', decalage: [0, -20] },
    { id: 'flexAzote', points: '520,330 520,205 740,205', nature: 'azote',
      mot: 'flexible jaune — azote', decalage: [8, -20] }
  ],

  etapes: [
    {
      titre: 'Pourquoi une mise sous pression azote',
      texte: 'Après toute opération sur le circuit frigorifique, une mise sous pression azote est ' +
             'nécessaire afin de réaliser un test d’étanchéité. L’installation doit être tirée au ' +
             'vide avant cette opération. Le manifold est posé : flexible bleu sur l’aspiration, ' +
             'flexible rouge sur le départ liquide.',
      pose: ['comp', 'vhp', 'cd', 'bout', 'vdl', 'evm', 'det', 'ev', 'vbp', 'mano'],
      trace: ['refoul', 'liquide', 'detente', 'asp', 'flexBP', 'flexHP'],
      danger: 'Bien porter ses EPI lors de cette opération. L’azote est un gaz sous très haute pression.'
    },
    { base: 'vannes-manifold-verifier-fermees',
      titre: 'Raccorder le flexible jaune à la bouteille d’azote',
      texte: 'On raccorde le flexible jaune sur le détendeur de la bouteille d’azote, et on vérifie ' +
             'que toutes les vannes HP et BP des manifolds sont fermées.',
      pose: ['azote'], trace: ['flexAzote'], focus: ['azote', 'flexAzote'] },
    { base: 'aimant-electrovanne', focus: ['evm'] },
    {
      titre: 'Vis de réglage dévissée, puis ouvrir la bouteille',
      texte: 'On vérifie que la vis de réglage du détendeur de la bouteille d’azote est dévissée — ' +
             'détendeur au repos, aucune pression ne passe — puis on ouvre la bouteille d’azote.',
      focus: ['azote'],
      geste: 'Ouvrir une bouteille sur un détendeur réglé enverrait la pression d’un coup dans les flexibles.'
    },
    {
      titre: 'Régler le détendeur sur la pression d’épreuve',
      texte: 'On règle le détendeur de la bouteille d’azote sur la pression souhaitée pour l’épreuve. ' +
             'Pour la déterminer : on relève la pression d’épreuve de tous les éléments du circuit, ' +
             'et on éprouve l’installation à la pression du composant qui a la plus basse.',
      focus: ['azote'],
      danger: 'Vérifier aussi la pression maximale supportée par le manomètre BP du manifold — ' +
              'ne pas la dépasser, au risque de l’endommager.'
    },
    { base: 'vannes-manifold-ouvrir',
      titre: 'Ouvrir délicatement, contrôler le remplissage',
      texte: 'On ouvre délicatement les vannes des manifolds et on contrôle le bon remplissage ' +
             'de l’installation en azote.',
      focus: ['mano'] },
    {
      titre: 'Fermer, noter la pression et la température',
      texte: 'Une fois la pression souhaitée atteinte dans l’installation : on ferme les vannes des ' +
             'manifolds et la bouteille d’azote. On note la pression de remplissage ainsi que la ' +
             'température du local.',
      focus: ['mano', 'azote'],
      geste: 'La température notée avec la pression : c’est elle qui permettra de juger, plus tard, ' +
             'si une baisse de pression est une fuite ou un refroidissement.'
    },
    {
      titre: 'Recherche de fuite par méthode directe',
      texte: 'On réalise une recherche de fuite avec un révélateur moussant (type Prestobul) ' +
             'sur les raccords et les zones d’intervention : une fuite fait des bulles.',
      focus: ['vbp', 'vdl', 'evm']
    },
    {
      titre: 'Vider l’azote du circuit',
      texte: 'Une fois la recherche de fuites ou la durée d’épreuve terminée : on débranche le ' +
             'flexible jaune du détendeur de la bouteille, et on ouvre les vannes des manifolds ' +
             'afin de vider l’azote du circuit frigorifique.',
      retire: ['flexAzote', 'azote'],
      focus: ['mano'],
      danger: 'Bien tenir le flexible jaune dans sa main : sous pression, un flexible libre fouette.',
      controle: {
        question: 'À quelle pression éprouve-t-on une installation dont les composants ont des pressions d’épreuve différentes ?',
        choix: [
          'À la pression d’épreuve la plus haute',
          'À la moyenne des pressions d’épreuve',
          'À la pression d’épreuve la plus basse'
        ],
        bonne: 2,
        explication: 'On éprouve à la pression du composant le plus fragile : au-delà, ' +
                     'c’est l’épreuve elle-même qui endommagerait ce composant.'
      }
    }
  ]
};
