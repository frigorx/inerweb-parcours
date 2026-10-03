/* Les régules · Station 9 — planches pas à pas des écrans de cours (03/10/2026)
   9.1 La dérivation : piquage, Y3, clapet, té — un by-pass du refoulement ;
   9.2 La séquence : l'horloge, KA1 et ses trois contacts, B4, les ventilateurs retardés ;
   9.3 Diagnostic : la voie, le clapet, le retour de liquide, les ventilateurs.
   Schéma, circuit et logique du film 9 (RK9), kit des planches (PK). */
(function () {
  var PK = window.PK, RK = window.RK, C = RK.C, clamp = window.clamp, fr = PK.fr;
  var Pas = PK.Pas;
  var CUES = { Enceinte: 0, Marche: 6, Circulation: 13, Horloge: 23, Fonte: 36, Reprise: 51,
               Chronologie: 61, CycleComplet: 69, LaCle: 85 };
  var TOTAL = 95;
  function etat(t) { return window.RK9.etat(t, CUES, TOTAL); }
  /* repères du scénario (evenements du film 9) */
  var tH = CUES.Horloge + 1, tZero = CUES.Horloge + 4, tFonte = CUES.Fonte + 5, tFin = CUES.Fonte + 9;

  function VueFluide(p) {
    var e = etat(p.T);
    return (
      <g>
        <window.RK9.Fluide T={p.T} now={p.now} e={e} planche={true} />
        <window.RK9.SondeB4 val={e.s.bat} o={1} />
      </g>
    );
  }

  function Mesures(p) {
    var s = p.s, x = 820, y = 740;
    return (
      <g>
        <rect x={x} y={y} width="300" height="320" rx="14" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x={x + 20} y={y + 36} fill={C.mute} fontSize="22" fontWeight="900" letterSpacing="2">AIR · B1</text>
        <text x={x + 20} y={y + 84} fill={C.blue} fontSize="40" fontWeight="900">{fr(s.air, 1)} °C</text>
        <text x={x + 20} y={y + 136} fill={C.orangeText} fontSize="22" fontWeight="900" letterSpacing="2">BATTERIE · B4</text>
        <text x={x + 20} y={y + 184} fill={s.bat > 0 ? C.red : C.blue} fontSize="40" fontWeight="900">{(s.bat > 0 ? '+' : '') + fr(s.bat, 1)} °C</text>
        <text x={x + 20} y={y + 236} fill={C.mute} fontSize="22" fontWeight="800">GIVRE</text>
        <rect x={x + 20} y={y + 252} width="260" height="28" rx="8" fill={C.blueSoft} stroke={C.line} strokeWidth="3" />
        <rect x={x + 20} y={y + 252} width={260 * clamp(s.givre, 0, 1)} height="28" rx="8" fill="#c9e0f2" stroke="#8fb8d8" strokeWidth="3" />
        <text x={x + 20} y={y + 308} fill={C.mute} fontSize="22" fontWeight="800">{'BP ' + fr(s.bp, 1) + ' bar'}</text>
      </g>
    );
  }
  function VueArmoire(p) {
    var e = etat(p.T);
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <window.RK9.Cabinet T={p.now} e={e} />
        </g>
        <Mesures s={e.s} />
      </g>
    );
  }

  var VBF = '300 20 2200 1470', VBA = '100 150 2400 1175';
  var F = {
    y3: [1260, 360, 180, 270], piquage: [1830, 340, 140, 140], voie: [740, 370, 1240, 520], clapet: [1690, 350, 130, 110],
    te: [700, 780, 150, 130], batterie: [1070, 830, 600, 360], bouteille: [1630, 600, 140, 200], fan: [1230, 1180, 150, 140],
    croix: [330, 30, 2150, 1420], voyants: [2160, 570, 320, 470]
  };
  var A = {
    pd: [150, 300, 440, 920], groupe: [590, 300, 440, 920], v: [1020, 300, 400, 920], ka25: [1030, 320, 330, 190],
    p: [1440, 300, 380, 190], b4: [1440, 540, 470, 190], deg: [1440, 300, 920, 920], ka11: [150, 540, 380, 190],
    ka43: [1900, 540, 330, 190], mesures: [805, 725, 330, 350]
  };

  function Planche09Derivation() {
    return (
      <Pas titre="Une dérivation du refoulement" viewBox={VBF}
           vue={function (T, now) { return <VueFluide T={T} now={now} />; }}
           etapes={[
             { titre: 'En froid : Y3 fermée', de: 20, a: 20, dur: 0.2, zones: [F.piquage, F.y3],
               texte: 'Le refoulement va au condenseur. Sur ce tube, un piquage pris par le haut mène à l’électrovanne Y3, fermée.' },
             { titre: 'Y3 s’ouvre', de: tH - 0.2, a: tH + 0.6, dur: 1.4, zones: [F.y3, F.voie],
               texte: 'L’horloge fait coller KA1 : Y1 se ferme, Y3 s’ouvre. Le gaz chaud du refoulement part vers la batterie.' },
             { titre: 'Le clapet bloque le retour', de: tH + 3, a: tH + 3, dur: 0.2, zones: [F.clapet],
               texte: 'Le clapet anti-retour empêche le fluide du condenseur de revenir vers la batterie.' },
             { titre: 'Entrée par le té', de: tH + 0.6, a: tZero + 1, dur: 3, zones: [F.te, F.batterie],
               texte: 'Le gaz entre après le détendeur, par un té : la batterie chauffe de l’intérieur, le givre fond.' },
             { titre: 'Un by-pass, pas une inversion', de: tFonte, a: tFonte, dur: 0.2, zones: [F.croix],
               texte: 'Compresseur, condenseur et sens du fluide ne changent pas : seule une dérivation du refoulement est ouverte.' }
           ]} />
    );
  }

  function Planche09Sequence() {
    return (
      <Pas titre="La séquence des gaz chauds" viewBox={VBA}
           vue={function (T, now) { return <VueArmoire T={T} now={now} />; }}
           etapes={[
             { titre: 'Froid : B1, puis la BP', de: CUES.Marche + 0.8, a: CUES.Marche + 3.6, dur: 2.4, zones: [A.pd, A.groupe],
               texte: 'B1 ouvre Y1 à travers KA1 11-12 ; la pression monte et la BP fait coller KM1.' },
             { titre: 'L’horloge fait coller KA1', de: tH - 0.2, a: tH + 0.1, dur: 1, zones: [A.p, A.b4],
               texte: 'P ferme 13-14 : la batterie est froide, B4 est fermé, KA1 colle.' },
             { titre: 'Trois contacts, trois effets', de: tH + 0.1, a: tH + 1, dur: 1.4, zones: [A.ka11, A.ka25, A.ka43],
               texte: 'KA1 11-12 ferme Y1, KA1 25-26 arrête les ventilateurs, KA1 43-44 ouvre Y3.' },
             { titre: 'KM1 continue', de: tH + 1, a: tZero + 2, dur: 3, zones: [A.groupe, A.mesures],
               texte: 'Le gaz chaud tient la BP haute : KM1 continue. C’est le compresseur qui chauffe la batterie.' },
             { titre: 'Fin sur B4', de: tFin - 0.6, a: tFin + 0.4, dur: 1.6, zones: [A.b4, A.mesures],
               texte: 'À +10 °C, B4 ouvre : KA1 retombe. Y3 se ferme, Y1 se rouvre, le froid reprend.' },
             { titre: 'Les ventilateurs en dernier', de: tFin + 0.5, a: tFin + 12.5, dur: 3.6, zones: [A.ka25, A.v],
               texte: 'KA1 25-26 ne se referme qu’après un délai : la batterie refroidit et l’eau s’égoutte avant de souffler.' }
           ]} />
    );
  }

  function Planche09Diagnostic() {
    return (
      <Pas titre="Contrôler la voie de gaz chauds" viewBox={VBF}
           vue={function (T, now) { return <VueFluide T={T} now={now} />; }}
           etapes={[
             { titre: 'La batterie ne chauffe pas ?', de: tH + 3, a: tH + 3, dur: 0.2, zones: [F.y3, F.voie],
               texte: 'Vérifier d’abord que Y3 s’ouvre et que le gaz chaud atteint la batterie : le tube doit être chaud jusqu’au té.' },
             { titre: 'Le clapet', de: tH + 3, a: tH + 3, dur: 0.2, zones: [F.clapet],
               texte: 'Un clapet monté à l’envers ou qui fuit laisse le fluide du condenseur migrer vers la batterie.' },
             { titre: 'Le retour de liquide', de: tZero, a: tFonte, dur: 3.4, zones: [F.batterie, F.bouteille],
               texte: 'Le gaz se condense dans la batterie : la bouteille anti-coup de liquide doit réévaporer ce liquide avant le compresseur.' },
             { titre: 'Les ventilateurs', de: tH + 2, a: tH + 2, dur: 0.2, zones: [F.fan, F.voyants],
               texte: 'Pendant les gaz chauds, ils doivent être arrêtés : sinon la chaleur part dans la chambre et la fonte traîne.' },
             { titre: 'Plusieurs évaporateurs ?', de: tFonte, a: tFonte, dur: 0.2, zones: [F.croix],
               texte: 'Sur une installation à plusieurs postes, repérer quelle machine fournit le gaz chaud et l’ordre des dégivrages.' }
           ]} />
    );
  }

  window.Planche09Derivation = Planche09Derivation;
  window.Planche09Sequence = Planche09Sequence;
  window.Planche09Diagnostic = Planche09Diagnostic;
})();
