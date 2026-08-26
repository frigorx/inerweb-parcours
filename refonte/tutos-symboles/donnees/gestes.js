/* =====================================================================
   LA BIBLIOTHÈQUE DES GESTES — écrits UNE fois, recyclés partout.

   Source : les six fiches méthodes de F. Henninot (mai 2026, en-tête
   académie d'Aix-Marseille) : pose des manomètres, dépose avec EVM,
   mise sous pression azote, tirage au vide, charge, récupération.

   Chaque fiche référence un geste par { base: 'nom-du-geste', … } et
   n'écrit que sa mise en scène (pose / trace / retire / focus).
   Ce que la fiche écrit l'emporte sur le geste générique.
   ===================================================================== */
/* Les VUES ANNOTÉES partagées : l'élément QElectroTech en grand, avec des
   flèches qui pointent chaque partie que les gestes nomment. Une vue est
   écrite UNE fois et sert tous les gestes qui la référencent. */
const VUE_ROTALOCK = {
  titre: 'La vanne rotalock, en situation',
  sym: 'qet-llave-rotalock', complement: true,
  boite: [-38, -19, 80, 40],
  cadre: [-126, -34, 252, 70],
  reperes: [
    { mot: 'Clé sur le carré de manœuvre', x: -26, y: -2.5, lx: -66, ly: -24 },
    { mot: 'Presse-étoupe', x: -14.5, y: -2.5, lx: -72, ly: 14 },
    { mot: 'Prise de service, sous bouchon', x: -3, y: -12.5, lx: 40, ly: -27 },
    { mot: 'Écrou rotalock', x: 25, y: -2, lx: 72, ly: -10 },
    { mot: 'Vers la tuyauterie', x: 9, y: 10, lx: 52, ly: 22 }
  ]
};

const VUE_EVM = {
  titre: 'L’électrovanne, en situation',
  sym: 'qet-solenoide-1', complement: true,
  boite: [-25, -28, 50, 40],
  cadre: [-92, -40, 184, 72],
  reperes: [
    { mot: 'Bobine — à retirer', x: 0, y: -13, lx: -58, ly: -30 },
    { mot: 'Écrou du dessus', x: 0, y: -21.5, lx: 48, ly: -33 },
    { mot: 'L’aimant se pose ici', x: 0, y: -5.8, lx: 55, ly: -6 },
    { mot: 'Raccords sur la ligne liquide', x: -17, y: 0, lx: -50, ly: 22 }
  ]
};

window.GESTES = {

  /* ---- préparation -------------------------------------------------- */

  'epi': {
    titre: 'Porter ses EPI',
    texte: 'Avant tout geste sur le circuit : gants adaptés au fluide, lunettes de protection, ' +
           'chaussures de sécurité. Le fluide qui se détend gèle ce qu’il touche.',
    danger: 'Il est important de bien porter tous ses EPI lors de cette opération.'
  },

  'capuchons-retirer': {
    titre: 'Retirer les capuchons des vannes de service',
    texte: 'Sur chaque vanne de service, deux capuchons noirs vissés à la main : celui de la TIGE ' +
           '(dans l’axe de la vanne, il cache le carré de manœuvre) et celui de la PRISE DE SERVICE ' +
           '(sur le côté, il protège le raccord fileté où viendra le flexible). On les dévisse à la ' +
           'main et on les garde dans la poche : ils seront remis en fin d’intervention.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-rotalock-pedagogique/index.html', titre: 'La vanne rotalock en détail' }
  },

  'capuchons-remettre': {
    titre: 'Remettre les capuchons',
    texte: 'On revisse à la main les capuchons de tige et de prise de service sur les deux vannes, ' +
           'BP et HP. Ils sont la DERNIÈRE barrière d’étanchéité : une vanne sans capuchon fuit ' +
           'un jour ou l’autre par sa tige ou sa prise.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-rotalock-pedagogique/index.html', titre: 'La vanne rotalock en détail' }
  },

  'presse-etoupe-desserrer': {
    titre: 'Desserrer les presse-étoupes',
    texte: 'Le presse-étoupe est l’écrou situé À LA BASE DE LA TIGE de la vanne rotalock — celui ' +
           'que le capuchon de tige recouvrait. Un quart de tour en dévissant, avec une clef plate ' +
           'de 10 ou 11, sur les vannes BP et HP. Sans ce desserrage, la tige ne tourne pas librement.',
    geste: 'Un quart de tour suffit : le presse-étoupe assure l’étanchéité autour de la tige, ' +
           'il n’est pas fait pour être démonté.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-rotalock-pedagogique/index.html', titre: 'La vanne rotalock en détail' }
  },

  'presse-etoupe-resserrer': {
    titre: 'Resserrer les presse-étoupes',
    texte: 'Un quart de tour en sens inverse, à la clef plate, sur l’écrou de presse-étoupe de ' +
           'chaque vanne, BP et HP. C’est lui qui referme l’étanchéité autour de la tige.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-rotalock-pedagogique/index.html', titre: 'La vanne rotalock en détail' }
  },

  'verifier-siege-arriere': {
    titre: 'Vérifier le siège arrière',
    texte: 'Avec la clef à vanne (clef à cliquet à carré), engagée sur le CARRÉ DE MANŒUVRE au bout ' +
           'de la tige : on vérifie que la tige est dévissée à fond en sens anti-horaire. ' +
           'C’est le siège arrière : la prise de service est isolée, on peut raccorder sans rien libérer.',
    geste: 'Siège arrière = tige dévissée à fond en sens anti-horaire. La prise de pression est fermée, ' +
           'le circuit passe en direct.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-de-service/index.html?ecran=positions', titre: 'La vanne de service — les 3 positions en coupe' }
  },

  'siege-intermediaire': {
    titre: 'Mettre les vannes en siège intermédiaire',
    texte: 'À la clef à vanne, un quart de tour en sens horaire sur la tige de chaque vanne de ' +
           'service : c’est la position de lecture, tout communique — le circuit, la prise de ' +
           'service, le manomètre.',
    geste: 'Un quart de tour seulement. Visser à fond mettrait la vanne en siège avant et isolerait le circuit.',
    vue: VUE_ROTALOCK,
    module: { page: 'vanne-de-service/index.html?ecran=positions', titre: 'La vanne de service — les 3 positions en coupe' }
  },

  'ecrous-arriere-retirer': {
    titre: 'Retirer les écrous des prises de service',
    texte: 'On retire les écrous qui obturent les prises de service des deux vannes, HP et BP. ' +
           'Les raccords sont maintenant prêts à recevoir les flexibles.'
  },

  /* ---- manifold et flexibles ---------------------------------------- */

  'flexibles-brancher': {
    titre: 'Brancher les flexibles bleu et rouge',
    texte: 'Le flexible bleu du manifold sur la vanne BP, le flexible rouge sur la vanne HP. ' +
           'On vérifie que les vannettes en bout des flexibles bleu et rouge sont bien ouvertes.',
    geste: 'La couleur aide, mais c’est le point de raccordement qui décide : bleu côté aspiration, ' +
           'rouge côté refoulement.',
    module: { page: 'vanne-de-service/index.html?ecran=geste', titre: 'Où brancher le flexible — en coupe' }
  },

  'flexible-jaune-pompe': {
    titre: 'Brancher la pompe à vide sur le flexible jaune',
    texte: 'Le flexible jaune, celui du milieu, part vers la pompe à vide. ' +
           'On vérifie que la vannette en bout du flexible jaune est bien ouverte.'
  },

  'vannes-manifold-verifier-fermees': {
    titre: 'Vérifier que les vannes du manifold sont fermées',
    texte: 'Avant de raccorder quoi que ce soit : toutes les vannes du manifold fermées. ' +
           'Tant qu’elles le sont, le manifold ne met rien en communication.'
  },

  'vannes-manifold-ouvrir': {
    titre: 'Ouvrir les vannes du manifold',
    texte: 'On ouvre les vannes du manifold : les voies communiquent maintenant à travers lui.'
  },

  'vannes-manifold-fermer': {
    titre: 'Fermer les vannes du manifold',
    texte: 'On referme les vannes du manifold : chaque voie est à nouveau isolée des autres.'
  },

  /* ---- pompe à vide -------------------------------------------------- */

  'pompe-vide-allumer': {
    titre: 'Mettre en route la pompe à vide',
    texte: 'La pompe à vide démarre. Elle extrait l’air, l’humidité et les incondensables ' +
           'de ce qui lui est raccordé.'
  },

  'pompe-vide-eteindre': {
    titre: 'Éteindre la pompe à vide',
    texte: 'On éteint la pompe à vide — toujours APRÈS avoir refermé les vannes : ' +
           'une pompe arrêtée sur un circuit ouvert laisse remonter son huile et l’air.',
    danger: 'Fermer les vannes d’abord, éteindre ensuite. Jamais l’inverse.'
  },

  /* ---- électrovanne --------------------------------------------------- */

  'aimant-electrovanne': {
    titre: 'Poser un aimant permanent sur chaque électrovanne',
    texte: 'Si l’installation est équipée d’électrovannes : on dévisse l’écrou du dessus de la ' +
           'bobine, on retire la bobine de son tube, et on glisse l’AIMANT PERMANENT à sa place. ' +
           'L’aimant tient le noyau levé : l’électrovanne reste ouverte, le vide ou le fluide passe ' +
           'dans TOUT le circuit, pas seulement jusqu’à la première électrovanne fermée.',
    vue: VUE_EVM,
    module: { page: 'electrovanne-pedagogique/index.html', titre: 'L’électrovanne en détail' }
  },

  /* ---- pesée ---------------------------------------------------------- */

  'peser-bouteille': {
    titre: 'Peser la bouteille et noter le poids',
    texte: 'On pèse la bouteille et on note le poids. C’est la référence : c’est par différence de ' +
           'pesée qu’on connaîtra la masse réellement transférée — celle qui va sur le CERFA.'
  },

  'cerfa': {
    titre: 'Rédiger le CERFA',
    texte: 'Chaque mouvement de fluide se trace : la masse pesée, le fluide, l’installation, la date. ' +
           'Le CERFA n’est pas de la paperasse après coup, c’est la preuve du geste bien fait.'
  },

  /* ---- contrôles ------------------------------------------------------ */

  'controle-etancheite-detecteur': {
    titre: 'Vérifier l’étanchéité au détecteur de fuites',
    texte: 'On passe le détecteur de fuites sur les presse-étoupes : un presse-étoupe resserré ' +
           'n’est étanche que s’il est vérifié.'
  }
};
