/* =====================================================================
   FICHE MÉTHODE 05 — Charge en fluide frigorigène
   Source : « 05 Fiche métode charge installation.docx » (F. Henninot,
   mai 2026). Méthode 1 (charge notée sur la plaque signalétique),
   étapes 1 à 8 + l'étape 6 bis. Décor : circuit réaliste commun.
   ===================================================================== */
window.TUTOS = window.TUTOS || {};
window.TUTOS['methode-05-charge'] = {

  titre: 'Charge en fluide frigorigène',
  sousTitre: 'Méthode 1 : la charge est notée sur la plaque signalétique',
  cartouche: 'Méthode',
  marque: 'lycee',
  decor: 'circuit-complet',

  elements: [
    { id: 'mano',       sym: 'manometres',       x: 520, y: 330, taille: 150, nom: 'Manifold' },
    { id: 'vacuo',      sym: 'vacuometre',       x: 610, y: 205, taille: 78, nom: 'Vacuomètre', complement: true },
    { id: 'pompe',      sym: 'pompe_a_vide',     x: 750, y: 205, taille: 92, nom: 'Pompe à vide', nomDessus: true, complement: true },
    { id: 'boutCharge', sym: 'bouteille_fluide', x: 740, y: 195, taille: 108, nom: 'Bouteille de fluide', nomDessus: true, complement: true },
    { id: 'balance',    sym: 'balance',          x: 740, y: 264, taille: 88, nom: 'Balance', complement: true }
  ],

  tuyaux: [
    { id: 'flexBP',     points: '520,330 919,330 919,404', nature: 'flex_bp', dessus: true, decalage: [-2, -24] },
    { id: 'flexHP',     points: '520,330 250,330 250,120', nature: 'flex_hp', decalage: [0, -20] },
    { id: 'flexVide',   points: '520,330 520,205 750,205', nature: 'flex_jaune', decalage: [-52, -20] },
    { id: 'flexCharge', points: '520,330 520,205 740,205', nature: 'flex_jaune', decalage: [-52, -20] }
  ],

  etapes: [
    {
      titre: 'Deux méthodes, on suit la première',
      texte: 'L’installation vient d’être tirée au vide — pompe et vacuomètre sont encore sur le ' +
             'flexible jaune. Si la charge est notée sur la plaque signalétique, il suffit de ' +
             'charger cette quantité : c’est la méthode 1, celle de cette fiche. Sinon, on charge ' +
             'progressivement en contrôlant surchauffe et sous-refroidissement — c’est la méthode 2.',
      pose: ['comp', 'vhp', 'cd', 'bout', 'vdl', 'evm', 'det', 'ev', 'vbp', 'mano', 'vacuo', 'pompe'],
      trace: ['refoul', 'liquide', 'detente', 'asp', 'flexBP', 'flexHP', 'flexVide']
    },
    { base: 'peser-bouteille', focus: [] },
    { base: 'vannes-manifold-verifier-fermees',
      titre: 'Tout fermer, débrancher pompe et vacuomètre',
      texte: 'On vérifie que toutes les vannes des manifolds et les vannettes en bout de flexible ' +
             'sont fermées, puis on débranche la pompe à vide et le vacuomètre du flexible jaune.',
      retire: ['flexVide', 'vacuo', 'pompe'],
      focus: ['mano'] },
    {
      titre: 'Brancher la bouteille, tarer la balance',
      texte: 'On branche la bouteille de fluide frigorigène sur le flexible jaune. ' +
             'On pose la bouteille sur la balance, on allume la balance, et on fait la tare.',
      pose: ['boutCharge', 'balance'], trace: ['flexCharge'],
      focus: ['boutCharge', 'balance', 'flexCharge'],
      geste: 'La tare faite, la balance affichera directement la masse transférée dans l’installation.'
    },
    {
      titre: 'Ouvrir la vanne liquide de la bouteille',
      texte: 'On ouvre la vanne liquide de la bouteille : du fluide liquide se présente ' +
             'dans le flexible jaune, jusqu’aux vannes fermées du manifold.',
      focus: ['boutCharge']
    },
    {
      titre: 'Ouvrir la vanne HP du manifold, contrôler sur la balance',
      texte: 'On ouvre la vanne HP des manomètres et on contrôle que l’installation se remplit ' +
             'bien : la balance doit montrer que la bouteille se vide. Le liquide entre par le ' +
             'départ liquide, installation à l’arrêt.',
      focus: ['mano', 'balance']
    },
    {
      titre: 'Charge atteinte : refermer',
      texte: 'Une fois la charge en fluide frigorigène bonne, on ferme la vanne liquide de la ' +
             'bouteille ainsi que la vanne HP des manomètres.',
      focus: ['boutCharge', 'mano'],
      danger: 'Du fluide liquide reste dans le flexible jaune : il sera inséré dans l’installation ' +
              'au moment de la dépose des manifolds.'
    },
    {
      titre: 'Si le fluide ne rentre plus (étape 6 bis)',
      texte: 'Si la charge n’est pas encore complète et que le fluide ne rentre plus : on ferme la ' +
             'vanne HP, on met l’installation en route, et on ouvre délicatement la vanne BP des ' +
             'manomètres jusqu’à la charge complète. Puis on ferme la vanne liquide de la bouteille.',
      focus: ['mano', 'comp'],
      danger: 'Avec cette méthode, on envoie du liquide directement à l’aspiration du compresseur : ' +
              'ouvrir la vanne BP délicatement, et veiller à ce que le compresseur soit en fonctionnement.'
    },
    { base: 'peser-bouteille',
      titre: 'Peser, calculer la masse chargée',
      texte: 'Une fois le pump-down réalisé et la bouteille retirée du flexible jaune : on pèse la ' +
             'bouteille et on calcule le poids exact inséré dans l’installation.',
      retire: ['flexCharge'],
      focus: ['boutCharge', 'balance'] },
    { base: 'cerfa',
      focus: ['boutCharge'],
      controle: {
        question: 'Pourquoi la charge en liquide par la voie HP se fait-elle installation À L’ARRÊT ?',
        choix: [
          'Pour que le compresseur ne risque pas d’aspirer du liquide',
          'Parce que la balance serait faussée par les vibrations',
          'Pour économiser l’électricité'
        ],
        bonne: 0,
        explication: 'Côté HP à l’arrêt, le liquide se loge dans le condenseur et la ligne liquide. ' +
                     'C’est la méthode 6 bis — machine en route, par la BP — qui présente le risque ' +
                     'de coup de liquide, et c’est pourquoi elle exige une ouverture délicate.'
      }
    }
  ]
};
