/* =====================================================================
   FICHE MÉTHODE 01 — Pose des manomètres dans les règles de l'art
   Source : « 01 Fiche méthode pose des manos.docx » (F. Henninot, mai 2026).
   Décor : le circuit réaliste commun (voir decors.js).
   Relecture 14/08 : le flexible HP se branche sur la vanne de DÉPART
   LIQUIDE (l'habitude du métier), la vanne HP du refoulement reste visible.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-01-pose-manos'] = {

  titre: 'Pose des manomètres',
  sousTitre: 'Dans les règles de l’art — sans introduire d’air dans le circuit',
  cartouche: 'Méthode',
  marque: 'lycee',
  decor: 'circuit-complet',

  elements: [
    { id: 'mano',  sym: 'manometres',   x: 520, y: 330, taille: 150, nom: 'Manifold' },
    { id: 'pompe', sym: 'pompe_a_vide', x: 740, y: 205, taille: 96, nom: 'Pompe à vide', nomDessus: true, complement: true }
  ],

  tuyaux: [
    { id: 'flexBP',    points: '520,330 919,330 919,404', nature: 'flex_bp', dessus: true, decalage: [-2, -24] },
    { id: 'flexHP',    points: '520,330 250,330 250,120', nature: 'flex_hp',    decalage: [0, -20] },
    { id: 'flexJaune', points: '520,330 520,205 740,205', nature: 'flex_jaune', decalage: [8, -20] }
  ],

  etapes: [
    {
      titre: 'Le circuit, et où l’on se branche',
      texte: 'La pose des manomètres dans les règles de l’art permet de ne pas introduire d’air ' +
             'ou tout autre fluide dans le circuit frigorifique. On repère d’abord le circuit : ' +
             'compresseur, condenseur (CD), bouteille liquide et sa vanne de départ liquide, ' +
             'électrovanne (EVM) sur la ligne liquide, détendeur, évaporateur (EV). ' +
             'Côté basse pression on se branche sur la vanne d’aspiration ; côté haute pression, ' +
             'l’habitude est de se brancher sur la vanne de départ liquide.',
      pose: ['comp', 'vhp', 'cd', 'bout', 'vdl', 'evm', 'det', 'ev', 'vbp'],
      trace: ['refoul', 'liquide', 'detente', 'asp'],
      danger: 'Il est important de bien porter tous ses EPI lors de cette opération.',
      verifier: 'Le choix « flexible HP sur la vanne de départ liquide » vient de la relecture du 14/08 ; ' +
                'la fiche source écrit « vanne HP ». À confirmer tel quel.'
    },
    { base: 'capuchons-retirer',       focus: ['vbp', 'vdl'] },
    { base: 'presse-etoupe-desserrer', focus: ['vbp', 'vdl'] },
    { base: 'verifier-siege-arriere',  focus: ['vbp', 'vdl'] },
    { base: 'ecrous-arriere-retirer',  focus: ['vbp', 'vdl'] },
    { base: 'flexibles-brancher',
      texte: 'Le flexible bleu du manifold sur la vanne BP de l’aspiration ; le flexible rouge ' +
             'sur la vanne de départ liquide — le point de branchement haute pression habituel. ' +
             'On vérifie que les vannettes en bout des flexibles bleu et rouge sont bien ouvertes.',
      pose: ['mano'], trace: ['flexBP', 'flexHP'], focus: ['mano', 'flexBP', 'flexHP'] },
    { base: 'flexible-jaune-pompe',
      pose: ['pompe'], trace: ['flexJaune'], focus: ['pompe', 'flexJaune'] },
    { base: 'pompe-vide-allumer', focus: ['pompe'] },
    { base: 'vannes-manifold-ouvrir',
      texte: 'On ouvre les vannes du manifold pour tirer au vide les flexibles et le manifold ' +
             'eux-mêmes : c’est l’air qu’ils contiennent qu’on refuse d’envoyer dans le circuit.',
      focus: ['mano'] },
    {
      titre: 'Vérifier le tirage au vide',
      texte: 'On vérifie sur les manomètres que le tirage au vide se passe bien : ' +
             'l’aiguille doit descendre à –1 bar relatif.',
      focus: ['mano'],
      geste: '–1 bar relatif, c’est le zéro absolu du manomètre : il n’y a plus d’air dans les flexibles.'
    },
    { base: 'vannes-manifold-fermer',
      texte: 'Une fois le vide effectué : on ferme les vannes des manomètres, ' +
             'puis la vannette en bout de flexible jaune.',
      focus: ['mano', 'flexJaune'] },
    { base: 'pompe-vide-eteindre', focus: ['pompe'] },
    { base: 'siege-intermediaire', focus: ['vbp', 'vdl'] },
    { base: 'presse-etoupe-resserrer',
      focus: ['vbp', 'vdl'],
      controle: {
        question: 'Pourquoi tire-t-on au vide les flexibles AVANT de mettre les vannes de service en siège intermédiaire ?',
        choix: [
          'Pour vérifier que la pompe à vide fonctionne',
          'Pour ne pas envoyer l’air des flexibles dans le circuit',
          'Pour faire monter la pression plus vite'
        ],
        bonne: 1,
        explication: 'Les flexibles et le manifold sont pleins d’air au moment du branchement. ' +
                     'Si on ouvrait les vannes de service d’abord, cet air — et son humidité — ' +
                     'entrerait dans le circuit frigorifique.'
      }
    }
  ]
};
