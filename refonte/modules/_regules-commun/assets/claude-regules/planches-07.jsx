/* Les régules · Station 7 — planches pas à pas des écrans de cours (03/10/2026)
   7.1 L'air dégivre : l'horloge coupe le froid, le ventilateur continue ;
   7.2 L'horloge lance : forcer l'arrêt quand les arrêts naturels ne suffisent pas ;
   7.3 La sonde termine : B2 rend le froid, RFD empêche un second dégivrage.
   Schéma et logique du film 7 (RK7, fiche 6.1 troisième principe), kit des planches (PK). */
(function () {
  var PK = window.PK, RK = window.RK, C = RK.C, clamp = window.clamp, fr = PK.fr;
  var Pas = PK.Pas, Compresseur = PK.Compresseur;
  var CUES = { Enceinte: 0, Marche: 7, Circulation: 13, Horloge: 23, Fonte: 35, FinPlage: 49,
               Chronologie: 59, CycleComplet: 67, LaCle: 83 };
  var TOTAL = 93;
  function etat(t) { return window.RK7.etat(t, CUES, TOTAL); }

  /* l'air (lu par B1), la batterie (lue par B2) et son givre, dans la place libre de l'armoire */
  function Mesures(p) {
    var s = p.s, x = 560, y = 330;
    return (
      <g>
        <rect x={x} y={y} width="460" height="250" rx="14" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x={x + 22} y={y + 38} fill={C.mute} fontSize="22" fontWeight="900" letterSpacing="2">AIR · B1</text>
        <text x={x + 22} y={y + 90} fill={C.blue} fontSize="44" fontWeight="900">{(s.air > 0 ? '+' : '') + fr(s.air, 1)} °C</text>
        <text x={x + 250} y={y + 38} fill={C.orangeText} fontSize="22" fontWeight="900" letterSpacing="2">BATTERIE · B2</text>
        <text x={x + 250} y={y + 90} fill={s.bat > 0 ? C.red : C.blue} fontSize="44" fontWeight="900">{(s.bat > 0 ? '+' : '') + fr(s.bat, 1)} °C</text>
        <text x={x + 22} y={y + 150} fill={C.mute} fontSize="22" fontWeight="800">GIVRE</text>
        <rect x={x + 110} y={y + 128} width="320" height="30" rx="8" fill={C.blueSoft} stroke={C.line} strokeWidth="3" />
        <rect x={x + 110} y={y + 128} width={320 * clamp(s.givre / 1.2, 0, 1)} height="30" rx="8" fill="#c9e0f2" stroke="#8fb8d8" strokeWidth="3" />
        <text x={x + 22} y={y + 222} fill={s.gouttes > 0.3 ? '#2c6390' : C.ink} fontSize="26" fontWeight="900">
          {s.gouttes > 0.3 ? 'LE GIVRE FOND, L’EAU S’ÉCOULE' : (s.givre > 0.3 ? 'BATTERIE PRISE EN GIVRE' : 'BATTERIE PROPRE')}
        </text>
      </g>
    );
  }

  function Armoire(p) {
    var e = etat(p.T);
    var Cab = window.RK7.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} e={e} />
        </g>
        <Mesures s={e.s} />
        <Compresseur x={560} y={1170} tourne={e.bob.M1} now={p.now} />
      </g>
    );
  }

  var VB = '100 150 2400 1175';
  var Z = {
    colA: [130, 300, 420, 990], rd2122: [150, 840, 380, 190], m1y1: [230, 1020, 700, 290], m2: [1060, 1060, 360, 220],
    mesures: [545, 315, 490, 280], h34: [1380, 300, 380, 190], b2nf: [1380, 520, 440, 190], rfd2122: [1480, 740, 300, 190],
    colRD: [1380, 300, 460, 920], colRFD: [1840, 480, 560, 740]
  };

  function Planche07Air() {
    return (
      <Pas titre="L’air fait fondre le givre" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'En froid : M1, Y1 et M2', de: 20, a: 20, dur: 0.2, zones: [Z.colA, Z.m2],
               texte: 'B1 alimente M1 et Y1 à travers RD 21-22. M2 n’a aucun contact : il tourne toujours.' },
             { titre: 'h1 lance le dégivrage', de: 23.8, a: 24.1, dur: 1, zones: [Z.h34, Z.colRD],
               texte: 'L’horloge ferme son contact 3-4 : RD colle (B2 et RFD sont fermés).' },
             { titre: 'Le froid s’arrête', de: 24.1, a: 24.5, dur: 1, zones: [Z.rd2122, Z.m1y1],
               texte: 'RD 21-22 s’ouvre : M1 et Y1 s’arrêtent, même si B1 demande du froid.' },
             { titre: 'Le ventilateur continue', de: 24.5, a: 36, dur: 3.6, zones: [Z.m2, Z.mesures],
               texte: 'M2 souffle l’air de la chambre, à +3 °C, sur la batterie : à 0 °C, le givre fond. Aucune résistance.' }
           ]} />
    );
  }

  function Planche07Horloge() {
    return (
      <Pas titre="L’horloge impose le début" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'Les arrêts ne suffisent pas', de: 23, a: 23, dur: 0.2, zones: [Z.mesures],
               texte: 'Le givre s’épaissit pendant la marche : les arrêts de B1 sont trop courts pour le faire fondre.' },
             { titre: 'À heure fixe, h1 force l’arrêt', de: 23.8, a: 25, dur: 1.6, zones: [Z.h34, Z.rd2122],
               texte: 'L’horloge fait coller RD, qui coupe le froid. Le ventilateur continue.' },
             { titre: 'Le givre fond', de: 25, a: 40, dur: 3.6, zones: [Z.mesures, Z.m2],
               texte: 'Pendant la plage d’horloge, l’air de la chambre réchauffe la batterie.' },
             { titre: 'Programmer l’horloge', de: 40, a: 40, dur: 0.2, zones: [Z.h34],
               texte: 'Nombre et durée des plages se règlent sur l’horloge, aux heures où la chambre est peu ouverte.' },
             { titre: 'L’horloge seule finit au temps', de: 40, a: 40, dur: 0.2, zones: [Z.mesures, Z.rd2122],
               texte: 'Ici le givre est parti, mais avec l’horloge seule (2e principe) le froid attendrait la fin de la plage : l’air remonte pour rien.' }
           ]} />
    );
  }

  function Planche07Sonde() {
    return (
      <Pas titre="La sonde termine" viewBox={VB}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'B2 surveille la batterie', de: 40, a: 43.8, dur: 2.4, zones: [Z.b2nf, Z.mesures],
               texte: 'Le givre a fondu : la batterie remonte vers +2 °C.' },
             { titre: 'B2 bascule : le froid repart', de: 43.8, a: 44.4, dur: 1.4, zones: [Z.b2nf, Z.rd2122],
               texte: 'À +2 °C, B2 ouvre 1-2 : RD retombe. RD 21-22 se referme : M1 et Y1 repartent aussitôt.' },
             { titre: 'RFD se tient', de: 44.4, a: 45.2, dur: 1.2, zones: [Z.colRFD, Z.rfd2122],
               texte: 'Le contact NO de B2 fait coller RFD, qui se tient par 13-14 : son 21-22 garde RD ouvert.' },
             { titre: 'Pas de second dégivrage', de: 45.2, a: 50.5, dur: 3, zones: [Z.b2nf, Z.rfd2122],
               texte: 'La batterie refroidit, B2 revient au repos… mais RD ne recolle pas : RFD veille jusqu’à la fin de la plage.' },
             { titre: 'Fin de plage : RFD retombe', de: 50.5, a: 51.6, dur: 1.4, zones: [Z.h34, Z.colRFD],
               texte: 'h1 s’ouvre : RFD retombe. Tout est prêt pour le prochain dégivrage.' }
           ]} />
    );
  }

  window.Planche07Air = Planche07Air;
  window.Planche07Horloge = Planche07Horloge;
  window.Planche07Sonde = Planche07Sonde;
})();
