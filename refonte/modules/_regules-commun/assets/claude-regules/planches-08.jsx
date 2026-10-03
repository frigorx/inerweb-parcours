/* Les régules · Station 8 — planches pas à pas des écrans de cours (03/10/2026)
   8.1 Prise de main : l'horloge coupe la demande, RFD verrouille, puis RD chauffe ;
   8.2 Séquence : du froid aux ventilateurs différés, sept étapes ;
   8.3 Deux fins, un verrou : la BP remonte sans relancer, B2 termine, RFD retient,
   l'horloge borne la durée. Schéma et logique du film 8 refait sur la fiche 6.3
   (RK8 : relais calculés par le solveur du film), kit des planches (PK). */
(function () {
  var PK = window.PK, RK = window.RK, C = RK.C, clamp = window.clamp;
  var Pas = PK.Pas, Vanne = PK.Vanne, Compresseur = PK.Compresseur, Air = PK.Air, fr = PK.fr;
  var CUES = { Enceinte: 0, MiseEnService: 5, Circulation: 13, Horloge: 23, Degivrage: 35, Reprise: 50,
               Chronologie: 66, CycleComplet: 76, LaCle: 92 };
  var TOTAL = 104;
  function etat(t) { return window.RK8.etat(t, CUES, TOTAL); }

  /* la batterie : sa température (lue par B2) et son givre */
  function Batterie(p) {
    var v = p.bat, x = 2200, y = 1124;
    return (
      <g>
        <rect x={x} y={y} width="370" height="160" rx="14" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x={x + 20} y={y + 34} fill={C.orangeText} fontSize="24" fontWeight="900" letterSpacing="2">BATTERIE · SONDE B2</text>
        <text x={x + 20} y={y + 96} fill={v > 0 ? C.red : C.blue} fontSize="52" fontWeight="900">{(v >= 0 ? '+' : '') + fr(v, 1)} °C</text>
        <text x={x + 20} y={y + 140} fill={C.mute} fontSize="22" fontWeight="800">GIVRE</text>
        <rect x={x + 100} y={y + 122} width="250" height="22" rx="6" fill={C.blueSoft} stroke={C.line} strokeWidth="3" />
        <rect x={x + 100} y={y + 122} width={250 * clamp(p.givre, 0, 1)} height="22" rx="6" fill="#c9e0f2" stroke="#8fb8d8" strokeWidth="3" />
        {p.gouttes > 0.05 && <text x={x + 350} y={y + 96} textAnchor="end" fill="#2c6390" fontSize="24" fontWeight="900" opacity={p.gouttes}>EAU · BAC</text>}
      </g>
    );
  }

  function Ventilateurs(p) {
    var on = p.on;
    return (
      <g>
        <RK.Fan x={p.x} y={p.y} r="44" spin={on ? p.now * 300 : 0} flow={on ? 1 : 0} />
        <text x={p.x} y={p.y + 94} textAnchor="middle" fill={on ? C.orangeText : C.mute} fontSize="28" fontWeight="900">
          {on ? 'TOURNENT' : 'ARRÊTÉS'}
        </text>
      </g>
    );
  }

  function Armoire(p) {
    var e = etat(p.T);
    var Cab = window.RK8.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} e={e} />
        </g>
        <RK.Manometre x={740} y={470} r={100} val={e.s.bp} cutOut={0.3} cutIn={1.8} label="PRESSION BP" />
        <Air cx={1520} y={770} ly={770} temp={e.s.air} />
        <Compresseur x={440} y={1180} tourne={e.bob.KM1} now={p.now} />
        <Ventilateurs x={1100} y={1180} on={e.bob.KM3} now={p.now} />
        <Vanne x={1720} y={1205} ouverte={e.bob.Y1} />
        <Batterie bat={e.s.bat} givre={e.s.givre} gouttes={e.s.gouttes} />
      </g>
    );
  }

  var VB = '100 150 3300 1175';
  var Z = {
    colKM: [120, 320, 600, 990], prise: [620, 345, 240, 300], hold: [270, 705, 440, 230],
    colV: [870, 320, 330, 990], colKA1: [1140, 320, 500, 990], h12: [1140, 540, 340, 190],
    colY: [1645, 320, 330, 990], h34: [1960, 320, 360, 190], b2nf: [1960, 540, 420, 190],
    rfd12: [2110, 760, 260, 190], colRD: [1960, 320, 420, 800], colRFD: [2440, 490, 600, 620],
    colR: [3060, 320, 300, 990], batterie: [2190, 1114, 390, 180]
  };

  function Planche08PriseDeMain() {
    return (
      <Pas titre="L’horloge prend la main" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'En froid : l’horloge au repos', de: 20, a: 20, dur: 0.2, zones: [Z.h12, Z.h34],
               texte: 'h1 laisse passer la demande (son contact 1-2 est fermé) et n’alimente pas le dégivrage (son 3-4 est ouvert). B1 tient KA1, KM1 tourne.' },
             { titre: 'h1 bascule : KA1 retombe', de: 23.7, a: 24.25, dur: 1.4, zones: [Z.h12, Z.colY],
               texte: 'À l’heure du dégivrage, h1 ouvre 1-2 et ferme 3-4. KA1 retombe : l’électrovanne Y1 se ferme.' },
             { titre: 'RFD verrouille RD', de: 24.25, a: 26, dur: 1.8, zones: [Z.colRFD, Z.rfd12],
               texte: 'Le compresseur tourne encore : KM1 23-24 fait coller RFD, et le contact 1-2 de RFD empêche RD de coller.' },
             { titre: 'Le tirage au vide', de: 26, a: 29.55, dur: 3.2, zones: [Z.hold, Z.prise],
               texte: 'KM1 se tient par 13-14 et vide l’évaporateur. À 0,3 bar, la BP ouvre : KM1 tombe, les ventilateurs avec lui.' },
             { titre: 'RD colle, R1 chauffe', de: 29.55, a: 32.5, dur: 2.4, zones: [Z.colRD, Z.colR, Z.batterie],
               texte: 'KM1 23-24 s’ouvre : RFD retombe, RD colle. Son contact 3-4 alimente les résistances R1 : la batterie se réchauffe.' }
           ]} />
    );
  }

  function Planche08Sequence() {
    return (
      <Pas titre="La séquence du dégivrage" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: '1 · Froid', de: 5.8, a: 9, dur: 2.6, zones: [Z.colKA1, Z.colY, Z.colKM],
               texte: 'B1 ferme : KA1 colle, Y1 s’ouvre. La pression monte, la BP fait coller KM1.' },
             { titre: '2 · Les ventilateurs, temporisés', de: 9, a: 12.7, dur: 2.4, zones: [Z.colV],
               texte: 'Le contact 67-68 de KM1 se ferme après un délai : KM3 lance les ventilateurs.' },
             { titre: '3 · Tirage au vide', de: 23.8, a: 29.6, dur: 3.4, zones: [Z.colKA1, Z.colKM],
               texte: 'h1 coupe KA1 : Y1 se ferme. KM1 vide l’évaporateur puis tombe à 0,3 bar. Les ventilateurs s’arrêtent.' },
             { titre: '4 · Résistances', de: 29.6, a: 36, dur: 3, zones: [Z.colRD, Z.colR, Z.batterie],
               texte: 'RD colle et alimente R1. La batterie se réchauffe, le givre fond à 0 °C.' },
             { titre: '5 · Fin sur la sonde B2', de: 44.5, a: 45.4, dur: 1.4, zones: [Z.b2nf, Z.batterie],
               texte: 'À +10 °C, B2 ouvre son contact 1-2 : RD retombe, les résistances s’arrêtent.' },
             { titre: '6 · Égouttage', de: 45.4, a: 53.7, dur: 2.6, zones: [Z.colRFD, Z.batterie],
               texte: 'RFD retient la fin. Tout reste arrêté jusqu’à la fin de la plage d’horloge : l’eau s’écoule.' },
             { titre: '7 · Reprise, ventilateurs en dernier', de: 53.8, a: 59, dur: 3.4, zones: [Z.colKA1, Z.colKM, Z.colV],
               texte: 'h1 revient : KA1, Y1 puis KM1. Les ventilateurs attendent la temporisation : aucune goutte soufflée.' }
           ]} />
    );
  }

  function Planche08DeuxFins() {
    return (
      <Pas titre="Deux fins, un verrou" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'La pression remonte pendant la chauffe', de: 36, a: 41.3, dur: 2.8, zones: [Z.prise, Z.colKM],
               texte: 'La batterie se réchauffe : la pression BP remonte, et la BP se referme à 1,8 bar.' },
             { titre: 'Mais KM1 ne repart pas', de: 41.3, a: 41.3, dur: 0.2, zones: [Z.hold, Z.h12],
               texte: 'KA1 13-14 et KM1 13-14 sont ouverts : h1 coupe toujours KA1. C’est le verrou : pas de froid pendant la chauffe.' },
             { titre: 'Fin normale : la sonde B2', de: 44.4, a: 45.3, dur: 1.6, zones: [Z.b2nf, Z.batterie],
               texte: 'B2 mesure la batterie : à +10 °C, il coupe RD. Le givre est parti, on ne chauffe pas plus.' },
             { titre: 'RFD retient la fin', de: 45.3, a: 46.5, dur: 1.4, zones: [Z.colRFD, Z.rfd12],
               texte: 'Le contact NO de B2 fait coller RFD : son 1-2 garde RD ouvert jusqu’à la fin de la plage d’horloge.' },
             { titre: 'Le garde-fou : la plage d’horloge', de: 53.5, a: 54.4, dur: 1.4, zones: [Z.h34, Z.h12],
               texte: 'Si B2 ne basculait pas, h1 couperait quand même RD à la fin de sa plage : c’est le temps maximal.' },
             { titre: 'Contrôler, pas seulement régler', de: 55, a: 55, dur: 0.2, zones: [Z.b2nf, Z.colR, Z.batterie],
               texte: 'Givre restant ou chauffe trop longue : vérifier la sonde B2, l’intensité de R1 et l’écoulement — pas seulement la durée de la plage.' }
           ]} />
    );
  }

  window.Planche08PriseDeMain = Planche08PriseDeMain;
  window.Planche08Sequence = Planche08Sequence;
  window.Planche08DeuxFins = Planche08DeuxFins;
})();
