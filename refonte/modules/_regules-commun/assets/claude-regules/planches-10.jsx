/* Les régules · Station 10 — planches pas à pas des écrans de cours (03/10/2026)
   10.1 La vanne 4 voies : la bobine, la pilote, le tiroir, les rôles échangés ;
   10.2 Détente et clapets : le liquide dans les deux sens ;
   10.3 Revenir au froid : fin sur sonde, égouttage, froid sans ventilation, ventilateurs.
   Circuit, vanne en coupe (dessin de CartoClim 2.6) et scénario du film 10 (RK10), kit des planches (PK).
   Pas d'armoire : aucune source ne donne le schéma électrique (voir regules-10.jsx). */
(function () {
  var PK = window.PK, Pas = PK.Pas;
  var CUES = { Enceinte: 0, Froid: 8, Inversion: 18, Fonte: 33, Retour: 43, Chronologie: 55, CycleComplet: 63, LaCle: 79 };
  var TOTAL = 89;
  var I = CUES.Inversion, F = CUES.Fonte, R = CUES.Retour;
  function etat(t) { return window.RK10.etat(t, CUES, TOTAL); }

  function VueCircuit(p) { return <window.RK10.Circuit T={p.now} e={etat(p.T)} cid="p10" />; }
  function VueVanne(p) { return <window.RK10.Panneau e={etat(p.T)} font={'"Trebuchet MS", Calibri, sans-serif'} />; }

  var VBC = '330 90 2160 1450', VBV = '2520 100 2480 1440';
  var Z = {
    batterie: [440, 400, 720, 380], condenseur: [1580, 400, 720, 380], fan: [690, 790, 230, 220], v4v: [1220, 120, 240, 230],
    comp: [1230, 890, 220, 280], ligne: [440, 1180, 1300, 300], te1: [650, 1190, 240, 300], te2: [1450, 1190, 240, 300],
    circuit: [340, 100, 2140, 1420],
    pilote: [2650, 170, 900, 240], corps: [2730, 670, 1100, 310], tubes: [2780, 930, 1120, 470], texte: [3965, 365, 1010, 450]
  };

  function Planche10Vanne() {
    return (
      <Pas titre="La vanne 4 voies" viewBox={VBV}
           vue={function (T, now) { return <VueVanne T={T} now={now} />; }}
           etapes={[
             { titre: 'Bobine sans courant : position froid', de: 14, a: 14, dur: 0.2, zones: [Z.pilote, Z.texte],
               texte: 'Le tiroir est à droite : le refoulement va au condenseur, la batterie de la chambre est reliée à l’aspiration.' },
             { titre: 'La bobine est alimentée', de: I + 3.4, a: I + 3.7, dur: 1, zones: [Z.pilote],
               texte: 'Le noyau de la vanne pilote bascule : un bout de la vanne est relié à l’aspiration, il se vide.' },
             { titre: 'Le tiroir glisse', de: I + 3.7, a: I + 4.7, dur: 2.4, zones: [Z.corps],
               texte: 'Poussé par la différence de pression, il passe à gauche. Il faut que le compresseur tourne.' },
             { titre: 'Position dégivrage', de: I + 6, a: I + 6, dur: 0.2, zones: [Z.tubes],
               texte: 'Le refoulement va vers la batterie de la chambre : condenseur. L’aspiration est reliée à l’extérieur : évaporateur.' },
             { titre: 'Les rôles sont échangés', de: I + 6, a: I + 6, dur: 0.2, zones: [Z.texte],
               texte: 'Le compresseur garde son sens : refoulement sur le tube seul, aspiration sur celui du milieu.' }
           ]} />
    );
  }

  function Planche10Detente() {
    return (
      <Pas titre="Détente et clapets" viewBox={VBC}
           vue={function (T, now) { return <VueCircuit T={T} now={now} />; }}
           etapes={[
             { titre: 'En froid : vers la chambre', de: 13, a: 14, dur: 1.2, zones: [Z.te2, Z.te1],
               texte: 'Le liquide passe le clapet du détendeur 2, puis se détend dans le détendeur 1, devant la batterie de la chambre.' },
             { titre: 'En dégivrage : vers l’extérieur', de: I + 5, a: I + 9, dur: 2.4, zones: [Z.te1, Z.te2],
               texte: 'Le liquide repart dans l’autre sens : il passe le clapet du détendeur 1 et se détend dans le détendeur 2.' },
             { titre: 'Chaque détendeur a son clapet', de: I + 9, a: I + 9, dur: 0.2, zones: [Z.ligne],
               texte: 'Un détendeur détend dans un seul sens : dans l’autre, le liquide le contourne par son clapet.' },
             { titre: 'Une vanne seule ne suffit pas', de: I + 9, a: I + 9, dur: 0.2, zones: [Z.circuit],
               texte: 'Une vanne 4 voies ne rend pas réversible un circuit conventionnel : tous les organes traversés comptent.' }
           ]} />
    );
  }

  function Planche10Retour() {
    return (
      <Pas titre="Revenir au froid" viewBox={VBC}
           vue={function (T, now) { return <VueCircuit T={T} now={now} />; }}
           etapes={[
             { titre: 'Fin sur sonde', de: F + 6, a: F + 7.4, dur: 1.6, zones: [Z.batterie, Z.v4v],
               texte: 'À +10 °C, la sonde coupe la bobine : le tiroir revient, le refoulement retourne au condenseur.' },
             { titre: 'Égouttage', de: F + 8.2, a: R + 3, dur: 2.4, zones: [Z.comp, Z.batterie],
               texte: 'Le compresseur s’arrête : l’eau fondue s’écoule, les pressions s’équilibrent.' },
             { titre: 'Froid sans ventilation', de: R + 3.6, a: R + 7, dur: 2.4, zones: [Z.batterie, Z.fan],
               texte: 'Le froid reprend, ventilateurs arrêtés : la batterie redescend sous zéro.' },
             { titre: 'Les ventilateurs en dernier', de: R + 7.6, a: R + 9, dur: 1.6, zones: [Z.fan],
               texte: 'Ils repartent quand la batterie est froide : ni air chaud, ni gouttes soufflées dans la chambre.' }
           ]} />
    );
  }

  window.Planche10Vanne = Planche10Vanne;
  window.Planche10Detente = Planche10Detente;
  window.Planche10Retour = Planche10Retour;
})();
