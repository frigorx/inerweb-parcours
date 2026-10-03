/* Les régules · Station 6 — planches pas à pas des écrans de cours (03/10/2026)
   6.1 Constat : aucun organe de dégivrage, et pourtant une fonte à l'arrêt ;
   6.2 Limites : des arrêts trop courts, le givre s'accumule ;
   6.3 Décider : observer avant d'ajouter une régulation.
   Schéma, batterie en gros plan et logique du film 6 (RK6), kit des planches (PK). */
(function () {
  var PK = window.PK, Pas = PK.Pas;
  var CUES = { Enceinte: 0, Marche: 5, Circulation: 13, Arret: 23, Limite: 37, Chronologie: 53, CycleComplet: 62, LaCle: 78 };
  var TOTAL = 88;
  function etat(t) { return window.RK6.etat(t, CUES, TOTAL); }

  function Vue(p) {
    var e = etat(p.T);
    var Cab = window.RK6.Cabinet, Gros = window.RK6.GrosPlan;
    return (
      <g transform="translate(-2520,-100)">
        <Cab T={p.now} e={e} />
        <Gros T={p.now} s={e.s} marche={e.bob.M1} porte={e.s.porte} />
      </g>
    );
  }

  var VB = '-20 -10 3440 1460';
  var Z = {
    armoire: [10, 10, 1480, 1420], b1: [150, 320, 340, 190], m2: [1080, 380, 380, 900], m1y1: [230, 960, 720, 300],
    gros: [1550, 10, 1840, 1420], bac: [1820, 1030, 1100, 150], fan: [1580, 560, 180, 340], mesures: [1560, 1150, 1820, 270]
  };

  function Planche06Constat() {
    return (
      <Pas titre="Rien pour dégivrer… et pourtant" viewBox={VB}
           vue={function (T, now) { return <Vue T={T} now={now} />; }}
           etapes={[
             { titre: 'Aucun organe de dégivrage', de: 4, a: 4, dur: 0.2, zones: [Z.armoire],
               texte: 'B1, la BP et la HP commandent le groupe M1 et l’électrovanne Y1. Ni horloge, ni résistance.' },
             { titre: 'M2 tourne toujours', de: 4, a: 4, dur: 0.2, zones: [Z.m2, Z.fan],
               texte: 'Le ventilateur M2 n’a aucun contact : il brasse l’air de la chambre en permanence.' },
             { titre: 'En marche, le givre se dépose', de: 5.5, a: 23.5, dur: 3.6, zones: [Z.b1, Z.gros],
               texte: 'B1 ferme : M1 et Y1 démarrent. La batterie passe sous 0 °C : l’humidité de l’air s’y dépose en givre.' },
             { titre: 'À l’arrêt, l’air fait fondre', de: 24, a: 31, dur: 3.6, zones: [Z.b1, Z.gros],
               texte: 'B1 ouvre : M1 et Y1 s’arrêtent, M2 continue. L’air à +2 °C réchauffe la batterie : le givre fond, l’eau s’écoule.' },
             { titre: 'Une fonte sans commande', de: 35, a: 35, dur: 0.2, zones: [Z.mesures],
               texte: 'La batterie est propre au redémarrage. Pas de dégivrage commandé ne veut pas dire : aucune fonte.' }
           ]} />
    );
  }

  function Planche06Limites() {
    return (
      <Pas titre="Le givre décide" viewBox={VB}
           vue={function (T, now) { return <Vue T={T} now={now} />; }}
           etapes={[
             { titre: 'Une chambre très sollicitée', de: 36.8, a: 37.6, dur: 1, zones: [Z.gros],
               texte: 'Portes ouvertes, produits chauds : l’air remonte vite à +4 °C, B1 relance le froid.' },
             { titre: 'Un arrêt trop court', de: 39.5, a: 42.2, dur: 3, zones: [Z.b1, Z.mesures],
               texte: 'B1 ouvre… et referme presque aussitôt. La batterie n’a pas le temps de dépasser 0 °C : le givre reste.' },
             { titre: 'Le givre s’accumule', de: 42.2, a: 47.5, dur: 3.6, zones: [Z.gros],
               texte: 'Cycle après cycle, la couche épaissit. Les ailettes se bouchent, l’air passe mal.' },
             { titre: 'L’échange s’effondre', de: 47.5, a: 52, dur: 3, zones: [Z.mesures, Z.b1],
               texte: 'La chambre ne descend plus à la consigne : B1 reste fermé, le groupe tourne sans s’arrêter.' },
             { titre: 'Ne pas copier un réglage', de: 52, a: 52, dur: 0.2, zones: [Z.gros],
               texte: 'La fréquence de dégivrage d’une autre installation ne vaut rien ici : charge, ouvertures et humidité changent tout.' }
           ]} />
    );
  }

  function Planche06Decider() {
    return (
      <Pas titre="Observer avant de décider" viewBox={VB}
           vue={function (T, now) { return <Vue T={T} now={now} />; }}
           etapes={[
             { titre: 'Observer le givre', de: 49, a: 49, dur: 0.2, zones: [Z.gros],
               texte: 'Où est le givre ? Sur toute la batterie ou à l’entrée d’air seulement ? Depuis quand ?' },
             { titre: 'Vérifier l’air', de: 49, a: 49, dur: 0.2, zones: [Z.fan, Z.m2],
               texte: 'M2 tourne-t-il ? L’air traverse-t-il encore les ailettes ?' },
             { titre: 'Contrôler l’écoulement', de: 26, a: 30.5, dur: 3, zones: [Z.bac],
               texte: 'Pendant l’arrêt, l’eau de fonte s’évacue-t-elle ? Un bac ou un tube gelé fait regeler la batterie.' },
             { titre: 'Lire les marches et les arrêts', de: 39.5, a: 42.2, dur: 3, zones: [Z.b1, Z.m1y1],
               texte: 'Les arrêts laissent-ils le temps de fondre ? Relever les temps de marche et d’arrêt du groupe.' },
             { titre: 'Décider', de: 52, a: 52, dur: 0.2, zones: [Z.armoire],
               texte: 'Si les arrêts ne suffisent pas : un dégivrage commandé, choisi avec la notice et le cahier des charges.' }
           ]} />
    );
  }

  window.Planche06Constat = Planche06Constat;
  window.Planche06Limites = Planche06Limites;
  window.Planche06Decider = Planche06Decider;
})();
