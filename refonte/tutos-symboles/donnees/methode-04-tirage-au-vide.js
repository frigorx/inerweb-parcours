/* =====================================================================
   FICHE MÉTHODE 04 — Tirage au vide
   Source : « 04 Fiche métode Tirage au vide.docx » (F. Henninot, mai 2026).
   Décor : circuit réaliste commun.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-04-tirage-au-vide'] = {

  titre: 'Tirage au vide',
  sousTitre: 'Ni azote, ni incondensables, ni humidité — avant toute charge',
  cartouche: 'Méthode',
  marque: 'lycee',
  decor: 'circuit-complet',

  elements: [
    { id: 'mano',  sym: 'manometres',   x: 520, y: 330, taille: 150, nom: 'Manifold' },
    { id: 'vacuo', sym: 'vacuometre',   x: 610, y: 205, taille: 78, nom: 'Vacuomètre', complement: true },
    { id: 'pompe', sym: 'pompe_a_vide', x: 750, y: 205, taille: 92, nom: 'Pompe à vide', nomDessus: true, complement: true }
  ],

  tuyaux: [
    { id: 'flexBP',    points: '520,330 919,330 919,404', nature: 'flex_bp', dessus: true, decalage: [-2, -24] },
    { id: 'flexHP',    points: '520,330 250,330 250,120', nature: 'flex_hp', decalage: [0, -20] },
    { id: 'flexJaune', points: '520,330 520,205 750,205', nature: 'flex_jaune', decalage: [-52, -20] }
  ],

  etapes: [
    {
      titre: 'Pourquoi tirer au vide',
      texte: 'Afin de remplir correctement en fluide frigorigène sans risquer de laisser des résidus ' +
             'd’azote, d’autres incondensables ou des traces d’humidité, il est nécessaire de tirer ' +
             'au vide l’installation. Le manifold est posé : flexible bleu sur l’aspiration, ' +
             'flexible rouge sur le départ liquide.',
      pose: ['comp', 'vhp', 'cd', 'bout', 'vdl', 'evm', 'det', 'ev', 'vbp', 'mano'],
      trace: ['refoul', 'liquide', 'detente', 'asp', 'flexBP', 'flexHP']
    },
    { base: 'vannes-manifold-verifier-fermees', focus: ['mano'] },
    {
      titre: 'Raccorder vacuomètre et pompe à vide',
      texte: 'On raccorde le flexible jaune sur le vacuomètre et sur la pompe à vide. ' +
             'C’est le vacuomètre — pas le manomètre — qui mesurera la qualité du vide.',
      pose: ['vacuo', 'pompe'], trace: ['flexJaune'],
      focus: ['vacuo', 'pompe', 'flexJaune']
    },
    {
      titre: 'Déterminer la pression de vide à atteindre',
      texte: 'On mesure la température de la pièce et on en déduit, d’après la courbe de saturation ' +
             'de l’eau, la pression absolue minimale de vide à atteindre : celle qui fait bouillir ' +
             'l’eau à la température ambiante, pour l’extraire du circuit.',
      focus: ['vacuo'],
      geste: 'Le vide ne sert pas qu’à retirer l’air : sous vide, l’eau bout à froid et sort en vapeur.'
    },
    { base: 'aimant-electrovanne', focus: ['evm'] },
    { base: 'pompe-vide-allumer',
      titre: 'Allumer la pompe, tout ouvrir',
      texte: 'On allume la pompe à vide, puis on ouvre toutes les vannes des manifolds ainsi que ' +
             'la vannette en bout de flexible jaune : le circuit entier est en communication avec la pompe.',
      focus: ['pompe', 'mano'] },
    { base: 'vannes-manifold-fermer',
      titre: 'Au vide désiré : tout fermer',
      texte: 'Une fois que le vacuomètre indique la pression de vide désirée, on ferme toutes les ' +
             'vannes des manifolds ainsi que la vannette en bout du flexible jaune.',
      focus: ['vacuo', 'mano'] },
    { base: 'pompe-vide-eteindre',
      focus: ['pompe'],
      controle: {
        question: 'Sur quel appareil lit-on que le vide est atteint ?',
        choix: [
          'Sur le manomètre BP du manifold',
          'Sur le vacuomètre',
          'Sur le voyant liquide'
        ],
        bonne: 1,
        explication: 'Le manomètre BP indique tout au plus –1 bar relatif : il est incapable de ' +
                     'distinguer un vide grossier d’un vide poussé. Seul le vacuomètre mesure ' +
                     'la pression absolue résiduelle.'
      }
    }
  ]
};
