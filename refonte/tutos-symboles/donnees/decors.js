/* =====================================================================
   LES DÉCORS PARTAGÉS — le circuit frigorifique réaliste, écrit UNE fois.

   Relecture de F. Henninot (14/08/2026) :
   - l'électrovanne (EVM) est sur la LIGNE LIQUIDE, jamais au refoulement ;
   - la vanne HP de service existe à la sortie du compresseur, mais on a
     l'habitude de se brancher à la VANNE DE DÉPART LIQUIDE ;
   - les échangeurs se posent dans le sens de leur flèche interne,
     étiquetés CD (condenseur) et EV (évaporateur).

   Croix du frigoriste : détendeur GAUCHE · compresseur DROITE ·
   condenseur HAUT · évaporateur BAS.

   Un tuto s'en sert avec `decor: 'circuit-complet'` et ajoute ses
   propres éléments (manifold, pompe, bouteilles…) par-dessus.
   ===================================================================== */
window.DECORS = window.DECORS || {};
window.DECORS['circuit-complet'] = {

  grille: [1040, 680],

  elements: [
    /* le compresseur stylisé porte SES DEUX vannes de service rotalock
       (demande du 14/08) ; vhp et vbp sont des ZONES posées sur elles,
       pour que les étapes puissent les viser (halo + étiquette) */
    { id: 'comp', sym: 'compresseur_vannes_service', x: 845, y: 430, taille: 170,
      fond: 0, complement: true, nom: 'Compresseur', nomDecalage: [0, 82] },
    { id: 'vhp', zone: true, x: 800, y: 390, taille: 46,
      nom: 'Vanne HP', nomDecalage: [-92, -24] },
    { id: 'vbp', zone: true, x: 882, y: 398, taille: 46,
      nom: 'Vanne BP', nomDecalage: [94, -22] },
    { id: 'cd',   sym: 'echangeur_a_air',    x: 560, y: 120, taille: 120, nom: 'CD', nomDessus: true },
    { id: 'bout', sym: 'bouteille_liquide',  x: 400, y: 120, taille: 62, nom: 'Bouteille', nomDessus: true },
    /* la vanne rotalock et l'électrovanne : les éléments QElectroTech de
       la bibliothèque de F. Henninot, convertis par build/elmt-vers-svg.mjs */
    { id: 'vdl',  sym: 'qet-llave-rotalock', x: 250, y: 120, taille: 95, complement: true,
      nom: 'Départ liquide', nomDessus: true },
    { id: 'evm',  sym: 'qet-solenoide-1',    x: 140, y: 265, taille: 86, rot: 90, complement: true,
      nom: 'EVM', nomDecalage: [66, 4] },
    { id: 'det',  sym: 'detendeur_thermo_ext', x: 140, y: 410, taille: 100, rot: 90,
      nom: 'Détendeur', nomDecalage: [92, 4] },
    { id: 'ev',   sym: 'echangeur_a_air',    x: 440, y: 560, taille: 120, nom: 'EV' }
  ],

  tuyaux: [
    { id: 'refoul',  points: '800,385 800,120 560,120', nature: 'hp_gaz',
      decalage: [-95, -20] },
    { id: 'liquide', points: '560,120 140,120 140,410', nature: 'hp_liquide',
      decalage: [110, -20] },
    { id: 'detente', points: '140,410 140,560 440,560', nature: 'bp_melange',
      decalage: [95, -20] },
    { id: 'asp',     points: '440,560 882,560 882,412', nature: 'bp_gaz',
      decalage: [-70, -20] }
  ]
};
