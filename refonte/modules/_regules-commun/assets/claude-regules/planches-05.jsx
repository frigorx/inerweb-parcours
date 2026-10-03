/* Les régules · Station 5 — planches pas à pas des écrans de cours (03/10/2026)
   2.1 Deux BP : mise en service, régulation shuntée en marche, sécurité qui veille ;
   2.2 Fuite : la sécurité arrête tout et le signale ; 2.3 Méthode : raconter l'arrêt
   normal en suivant les contacts. Schéma et logique du film 5 refait sur l'annexe 3
   EP2 CAP VAF 2016 (RK5), kit des planches (PK). */
(function () {
  var PK = window.PK;
  var Pas = PK.Pas, Vanne = PK.Vanne, Compresseur = PK.Compresseur, Air = PK.Air, PriseBP = PK.PriseBP;
  var CUES = { Enceinte: 0, MiseEnService: 6, Circulation: 13, Consigne: 23, Fuite: 31,
               Chronologie: 40, CycleComplet: 46, LaCle: 62 };
  var TOTAL = 66;
  function etat(t) { return window.RK5.etat(t, CUES, TOTAL); }

  function Armoire(p) {
    var e = etat(p.T);
    var Cab = window.RK5.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} e={e} alerte={p.alerte ? 1 : 0} />
        </g>
        <Air cx={1374} y={470} ly={445} temp={e.temp} />
        <PriseBP x={1985} y={470} r={110} tx={2144} ty={635} bp={e.bp} />
        <Vanne x={1560} y={1205} ouverte={e.y1Live} />
        <Compresseur x={2470} y={1170} tourne={e.km} now={p.now} />
      </g>
    );
  }

  var VB = '100 262 2640 1068';
  var Z = {
    colH6: [215, 515, 345, 650],
    colKA1: [665, 320, 655, 820],
    s1: [665, 720, 390, 190],
    bps: [665, 500, 390, 190],
    bpsH6: [215, 540, 345, 190],
    colB1: [1255, 320, 890, 980],
    prise: [1860, 345, 450, 330],
    colKM: [2125, 320, 600, 830],
    shunt: [2125, 540, 600, 400],
    km1: [2125, 1000, 600, 300]
  };

  function Planche05DeuxBP() {
    return (
      <Pas titre="La mise en service" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'À l’arrêt : la sécurité n’est pas armée', de: 3, a: 3, dur: 0.2, zones: [Z.colKA1],
               texte: 'KA1 est au repos : sans lui, ni Y1, ni KA2, ni KM1 ne peuvent être alimentés.' },
             { titre: 'S1 : KA1 colle et se tient', de: 6.2, a: 7.8, dur: 2.2, zones: [Z.s1],
               texte: 'On appuie sur le bouton Marche S1 : KA1 colle et se tient par son contact 13-14. On peut relâcher S1.' },
             { titre: 'B1 ferme : Y1 et KA2 collent', de: 7.8, a: 8.9, dur: 1.6, zones: [Z.colB1],
               texte: 'L’air remonte à −14 °C : B1 ferme. À travers KA1 23-24, il alimente l’électrovanne Y1 et le relais de tirage KA2.' },
             { titre: 'La BP de régulation fait coller KM1', de: 8.9, a: 10.6, dur: 2.4, zones: [Z.prise, Z.colKM],
               texte: 'Le liquide arrive, la pression monte. À 1,8 bar, la BP de régulation ferme : KM1 colle, le compresseur démarre.' },
             { titre: 'Deux BP, deux missions', de: 10.6, a: 12, dur: 1.4, zones: [Z.shunt, Z.bps, Z.bpsH6],
               texte: 'En marche, KA2 23-24 et KM1 43-44 shuntent la BP de régulation. La BP de sécurité, elle, veille sur KA1 et sur le voyant H6.' }
           ]} />
    );
  }

  function Planche05Fuite() {
    return (
      <Pas titre="La fuite" viewBox={VB}
           vue={function (T, now, k) { return <Armoire T={T} now={now} alerte={k >= 4} />; }}
           etapes={[
             { titre: 'Une fuite : B1 redemande le froid', de: 31, a: 32.3, dur: 1.6, zones: [Z.colB1],
               texte: 'L’installation a perdu du fluide. B1 ferme : Y1 et KA2 recollent, comme d’habitude.' },
             { titre: 'KM1 colle, mais la pression ne tient pas', de: 32.3, a: 34.2, dur: 2.4, zones: [Z.prise, Z.colKM],
               texte: 'La BP de régulation fait coller KM1. Le fluide manque : la pression d’aspiration retombe vite.' },
             { titre: 'Sous 0,3 bar, KM1 continue', de: 34.2, a: 35.9, dur: 2.2, zones: [Z.shunt],
               texte: 'La BP de régulation ouvre, mais elle est shuntée par KA2 et KM1 : le compresseur continue. Pas de court cycle.' },
             { titre: 'Le seuil de sécurité : KA1 retombe, H6 s’allume', de: 35.9, a: 36.75, dur: 1.6, zones: [Z.bps, Z.colH6],
               texte: 'La pression atteint le seuil de la BP de sécurité : son contact 1-4 coupe KA1, son contact 1-2 allume le voyant H6.' },
             { titre: 'Tout s’arrête', de: 36.75, a: 37.6, dur: 1.6, zones: [Z.colB1, Z.km1],
               texte: 'KA1 23-24 s’ouvre : Y1 et KA2 retombent. La BP de régulation est ouverte : KM1 tombe à son tour.' },
             { titre: 'Un arrêt définitif', de: 38, a: 39, dur: 0.6, zones: [Z.s1],
               texte: 'KA1 ne se réarme pas seul : il faut S1. Le technicien recherche la fuite et répare avant de relancer.' }
           ]} />
    );
  }

  function Planche05Methode() {
    return (
      <Pas titre="Raconter l’arrêt normal" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'En marche : nommer les organes', de: 20, a: 20, dur: 0.2, zones: [Z.colKA1, Z.colB1, Z.colKM],
               texte: 'KA1 la sécurité, B1 la demande, Y1 et KA2 la ligne liquide et le tirage, KM1 le compresseur, H6 le défaut.' },
             { titre: 'Consigne : Y1 et KA2 retombent', de: 24.2, a: 24.7, dur: 1.4, zones: [Z.colB1],
               texte: 'L’air atteint −18 °C : B1 ouvre. Y1 se ferme, le relais de tirage KA2 retombe.' },
             { titre: 'KM1 se tient, la BP de régulation reprend la main', de: 24.7, a: 25.0, dur: 1.4, zones: [Z.shunt],
               texte: 'Le shunt KA2 23-24 s’est ouvert : KM1 n’est plus tenu que par 33-34 et par la BP de régulation.' },
             { titre: 'Le tirage au vide', de: 25.0, a: 28.45, dur: 3.4, zones: [Z.prise],
               texte: 'Le compresseur vide l’évaporateur : la pression BP descend.' },
             { titre: '0,3 bar : KM1 tombe', de: 28.45, a: 29.0, dur: 1.2, zones: [Z.prise, Z.km1],
               texte: 'La BP de régulation ouvre : KM1 tombe. KA1 reste armé : la sécurité n’a pas eu à intervenir.' },
             { titre: 'Seul B1 relancera', de: 30, a: 30, dur: 0.2, zones: [Z.colKM],
               texte: 'KA2 et KM1 sont ouverts en haut de la colonne : une remontée de BP ne suffit pas. Le froid reviendra par B1.' }
           ]} />
    );
  }

  window.Planche05DeuxBP = Planche05DeuxBP;
  window.Planche05Fuite = Planche05Fuite;
  window.Planche05Methode = Planche05Methode;
})();
