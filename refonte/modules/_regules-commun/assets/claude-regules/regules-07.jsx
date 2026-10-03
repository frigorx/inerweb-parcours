/* Les régules · Station 7 — Le dégivrage naturel commandé (03/10/2026)
   Source : fiche « 6.1 Électricité — dégivrage naturel » (Bac Pro MFER, S2),
   troisième principe, schéma page 6 :
     M1 (groupe) et Y1 (EVR) = B1 θ (1-4) · BP (1-4) · HP (1-2) · RD 21-22 (NF)
     M2 (ventilateur évaporateur) = permanent
     RD  = h1 3-4 · B2 θ 1-2 (NF) · RFD 21-22 (NF)        relais de dégivrage
     RFD = h1 3-4 · (B2 NO // RFD 13-14)                    fin de dégivrage, auto-maintien
   « L'horloge commande uniquement le début du dégivrage […] B2 coupe RD et
   enclenche RFD, celui-ci coupe par son contact RD et le compresseur démarre. »
   Le deuxième principe (h1 seul, en série) est rappelé en pointillé sur le
   chronogramme : sans sonde, le froid reste coupé jusqu'à la fin de la plage.
   (La fiche nomme le BP B3 et le HP B4 : ils gardent ici leur nom de pressostat.)
   États calculés par le solveur du kit (RK.resoudre) ; exposé en RK7. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var D = 5940;

  function pw(T, pts) {
    if (T <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (T <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i];
        var u = (T - a[0]) / Math.max(b[0] - a[0], 0.0001);
        return a[1] + (b[1] - a[1]) * u;
      }
    }
    return pts[pts.length - 1][1];
  }

  function reseau(c) {
    return [
      { id: 'B1', a: 'L', b: 'a1', f: c.B1 }, { id: 'BP', a: 'a1', b: 'a2', f: true }, { id: 'HP', a: 'a2', b: 'a3', f: true },
      { id: 'RD2122', a: 'a3', b: 'g', f: !c.RD }, { id: 'M1c', a: 'g', charge: true }, { id: 'Y1c', a: 'g', charge: true },
      { id: 'M2c', a: 'L', charge: true },
      { id: 'H34', a: 'L', b: 'd1', f: c.h1 }, { id: 'B2nf', a: 'd1', b: 'd2', f: !c.B2 },
      { id: 'RFD2122', a: 'd2', b: 'd3', f: !c.RFD }, { id: 'RDc', a: 'd3', charge: true },
      { id: 'B2no', a: 'd1', b: 'f1', f: c.B2 }, { id: 'RFD1314', a: 'd1', b: 'f1', f: c.RFD }, { id: 'RFDc', a: 'f1', charge: true }
    ];
  }

  var DELAI = 0.15, SEUIL_B2 = 2.0;
  function evenements(CUES) {
    var M = CUES.Marche, H = CUES.Horloge, F = CUES.Fonte, P = CUES.FinPlage;
    return { tB1: M + 1, tH: H + 1, tZero: H + 4, tFonte: F + 5, tFin: F + 9, tH2: P + 2 };
  }
  function scenario(t, e, total) {
    return {
      air: pw(t, [[0, 3.6], [e.tB1, 4.0], [e.tB1 + 2, 3.9], [e.tH, 2.6], [e.tFin, 4.3], [e.tFin + 2, 3.9], [e.tH2, 3.3],
                  [e.tH2 + 9, 2.5], [total, 2.4]]),
      /* sans sonde (2e principe), l'air aurait continué de monter jusqu'à la fin de la plage */
      airSeul: pw(t, [[e.tFin, 4.3], [e.tH2, 5.0], [e.tH2 + 9, 3.0], [total, 2.6]]),
      bat: pw(t, [[0, 3.0], [e.tB1, 3.0], [e.tB1 + 2, -7], [e.tH, -7.5], [e.tH + DELAI, -7.5], [e.tZero, 0], [e.tFonte, 0.3],
                  [e.tFin, SEUIL_B2], [e.tFin + DELAI, SEUIL_B2], [e.tFin + 1.5, -5], [e.tFin + 4, -7], [total, -7.5]]),
      givre: pw(t, [[0, 0], [e.tB1 + 2, 0], [e.tH, 1.0], [e.tZero, 1.0], [e.tFonte, 0], [e.tFin, 0], [total, 0.35]]),
      gouttes: t < e.tZero ? 0 : t < e.tFonte ? 1 : clamp(1 - (t - e.tFonte) / 2, 0, 1),
      b1: t >= e.tB1, h1: t >= e.tH && t < e.tH2
    };
  }

  var memo = {}, DT = 0.02;
  function simuler(CUES, total) {
    var cle = JSON.stringify(CUES) + '|' + total;
    if (memo[cle]) return memo[cle];
    var e = evenements(CUES), pas = [], b2 = false, cum = 0, retard = Math.round(DELAI / DT);
    for (var i = 0, n = Math.ceil(total / DT) + 1; i < n; i++) {
      var t = i * DT, s = scenario(t, e, total);
      if (s.bat >= SEUIL_B2 - 1e-6) b2 = true; else if (s.bat <= 0) b2 = false;
      var avant = i >= retard ? pas[i - retard].bob : {};
      var c = { B1: s.b1, h1: s.h1, B2: b2, RD: !!avant.RD, RFD: !!avant.RFD };
      var r = RK.resoudre(reseau(c));
      var bob = { M1: r.conduit.M1c, Y1: r.conduit.Y1c, M2: r.conduit.M2c, RD: r.conduit.RDc, RFD: r.conduit.RFDc };
      if (i > 0 && pas[i - 1].bob.M1) cum += DT;
      pas.push({ t: t, s: s, c: c, bob: bob, cum: cum });
    }
    memo[cle] = { pas: pas, ev: e };
    return memo[cle];
  }

  function etat(T, CUES, total) {
    var sim = simuler(CUES, total), e = sim.ev;
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var t0 = e.tB1 - 1, t1 = e.tH2 + 3;
    var Tm = enRejeu ? t0 + (T - CUES.CycleComplet) * (t1 - t0) / (CUES.LaCle - CUES.CycleComplet) : T;
    function a(t) { return sim.pas[clamp(Math.round(t / DT), 0, sim.pas.length - 1)]; }
    var p = a(Tm);
    function lisse(f) { var m = 0; for (var k = 0; k < 5; k++) m += f(a(Tm - k * 0.05)) ? 0 : 1; return m / 5; }
    var phase = -1;
    if (p.bob.M1 && Tm < e.tH) phase = 0;
    if (Tm >= e.tH) phase = 1;
    if (Tm >= e.tH + 1.5) phase = 2;
    if (Tm >= e.tFin) phase = 3;
    if (Tm >= e.tFin + 2.5) phase = 4;
    return {
      Tm: Tm, enRejeu: enRejeu, ev: e, c: p.c, bob: p.bob, s: p.s, phase: phase, cum: p.cum,
      ouv: function (id) { return lisse(function (q) { return reseau(q.c).filter(function (x) { return x.id === id; })[0].f; }); },
      flow: 1 - lisse(function (q) { return q.bob.M1; })
    };
  }

  /* ---- l'armoire ---- */
  var FILS = [
    ['M 330 300 L 330 320', 'L', ['B1']], ['M 330 470 L 330 500', 'a1', []], ['M 330 650 L 330 680', 'a2', []],
    ['M 330 830 L 330 860', 'a3', []], ['M 330 1010 L 330 1030', 'g', []], ['M 330 1030 L 330 1094', 'g', ['M1c']],
    ['M 330 1030 L 760 1030 L 760 1121', 'g', ['Y1c']], ['M 330 1206 L 330 1300', 'N', ['M1c']], ['M 760 1179 L 760 1300', 'N', ['Y1c']],
    ['M 1150 300 L 1150 1094', 'L', ['M2c']], ['M 1150 1206 L 1150 1300', 'N', ['M2c']],
    ['M 1560 300 L 1560 320', 'L', ['H34']], ['M 1560 470 L 1560 500', 'd1', []], ['M 1560 500 L 1560 540', 'd1', ['B2nf']],
    ['M 1560 500 L 1900 500', 'd1', ['B2no', 'RFD1314']], ['M 1900 500 L 1900 540', 'd1', ['B2no']],
    ['M 1900 500 L 2200 500 L 2200 540', 'd1', ['RFD1314']],
    ['M 1560 690 L 1560 760', 'd2', []], ['M 1560 910 L 1560 1121', 'd3', []], ['M 1560 1179 L 1560 1300', 'N', ['RDc']],
    ['M 1900 690 L 1900 740 L 2200 740', 'f1', ['B2no']], ['M 2200 690 L 2200 740', 'f1', ['RFD1314']],
    ['M 2200 740 L 2200 1121', 'f1', []], ['M 2200 1179 L 2200 1300', 'N', ['RFDc']]
  ];
  function Cabinet(p) {
    var RK2 = window.RK, e = p.e, t = p.T;
    var r = RK2.resoudre(reseau(e.c));
    function V(id) { return r.conduit[id]; }
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="2480" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · DÉGIVRAGE NATUREL COMMANDÉ</text>
        <text x="2440" y="66" textAnchor="end" fill={C.blue} fontSize="24" fontWeight="900" letterSpacing="2">D’APRÈS LA FICHE 6.1 · 3e PRINCIPE</text>
        <g fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="3">
          <line x1="240" y1="196" x2="1340" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="790" y="180" textAnchor="middle">LE FROID</text>
          <line x1="1400" y1="196" x2="2400" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="1900" y="180" textAnchor="middle">LE DÉGIVRAGE</text>
        </g>
        <line x1="170" y1="104" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="2400" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="1300" x2="2400" y2="1300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="1312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {FILS.map(function (f, i) { return <path key={i} d={f[0]} />; })}
        </g>
        {FILS.map(function (f, i) { return <RK2.Potentiel key={i} d={f[0]} mode={RK2.modeFil(r, f[1], f[2])} t={t} />; })}

        <RK2.ContactV x={330} y={320} ouv={e.ouv('B1')} live={V('B1')} glyph="θ" code="B1" sub="thermostat" b1="1" b2="4" />
        <RK2.ContactV x={330} y={500} ouv={0} live={V('BP')} glyph="p" code="BP" sub="sécurité" b1="1" b2="4" />
        <RK2.ContactV nf={true} x={330} y={680} ouv={0} live={V('HP')} glyph="p" code="HP" sub="sécurité" b1="1" b2="2" />
        <RK2.ContactV nf={true} aux={true} x={330} y={860} ouv={e.ouv('RD2122')} live={V('RD2122')} code="RD" sub="coupe le froid" b1="21" b2="22" />
        <RK2.MoteurV x={330} y={1150} code="M1" sub="GROUPE" live={e.bob.M1} />
        <RK2.BobineV x={760} y={1150} code="Y1" sub="ÉLECTROVANNE" live={e.bob.Y1} />
        <RK2.MoteurV x={1150} y={1150} code="M2" sub="VENTILATEUR" live={e.bob.M2} />
        <text x="1126" y="720" textAnchor="end" fill={C.green} fontSize="26" fontWeight="900">AUCUN CONTACT :</text>
        <text x="1126" y="754" textAnchor="end" fill={C.green} fontSize="26" fontWeight="900">M2 TOURNE</text>
        <text x="1126" y="788" textAnchor="end" fill={C.green} fontSize="26" fontWeight="900">EN PERMANENCE</text>

        <RK2.ContactV x={1560} y={320} ouv={e.ouv('H34')} live={V('H34')} glyph="t" code="h1" sub="horloge" b1="3" b2="4" />
        <RK2.ContactV nf={true} x={1560} y={540} ouv={e.ouv('B2nf')} live={V('B2nf')} glyph="θ" code="B2" sub="fin de dégivrage" b1="1" b2="2" />
        <line x1="1570" y1="565" x2="1890" y2="565" stroke={C.wire} strokeWidth="4" strokeDasharray="12 10" />
        <RK2.ContactV nf={true} aux={true} x={1560} y={760} ouv={e.ouv('RFD2122')} live={V('RFD2122')} code="RFD" sub="fin mémorisée" b1="21" b2="22" />
        <RK2.BobineV x={1560} y={1150} code="RD" sub="DÉGIVRAGE" live={e.bob.RD} />
        <RK2.ContactV aux={true} x={1900} y={540} ouv={e.ouv('B2no')} live={V('B2no')} code="B2" sub="fin · NO" b1="1" b2="4" />
        <RK2.ContactV aux={true} x={2200} y={540} ouv={e.ouv('RFD1314')} live={V('RFD1314')} code="RFD" sub="maintien" />
        <RK2.BobineV x={2200} y={1150} code="RFD" sub="FIN" live={e.bob.RFD} />
      </g>
    );
  }

  var PHASES = [
    ['FROID', 'B1 : M1 et Y1, M2 tourne'],
    ['L’HORLOGE LANCE', 'h1 fait coller RD : M1 et Y1 s’arrêtent'],
    ['L’AIR FAIT FONDRE', 'M2 souffle l’air à +3 °C sur la batterie'],
    ['FIN SUR B2', 'RD retombe ; RFD colle et se tient'],
    ['FROID RENDU TÔT', 'M1 repart avant la fin de la plage h1']
  ];

  var CH = { x0: 900, x1: 3980, tFin: 56 };
  function chx(t) { return CH.x0 + (CH.x1 - CH.x0) * clamp(t / CH.tFin, 0, 1); }
  function chAir(v) { return 1795 - ((v - 1) / 4.5) * 120; }
  function chBat(v) { return 2190 - ((v + 9) / 13) * 130; }
  function chGivre(v) { return 2320 - clamp(v / 1.2, 0, 1) * 100; }
  var CARRES = [['h1', 1830], ['RD', 1905], ['M1', 1980], ['RFD', 2360]];
  function Chrono(p) {
    var CUES = p.CUES, sim = simuler(CUES, p.total), e = sim.ev;
    var air = '', airSeul = '', bat = '', givre = '', sq = {}, prec = {};
    CARRES.forEach(function (q) { sq[q[0]] = ''; });
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var q = sim.pas[Math.min(Math.round(t / DT), sim.pas.length - 1)], x = chx(t).toFixed(1);
      air += (air ? ' L ' : 'M ') + x + ' ' + chAir(q.s.air).toFixed(1);
      if (t >= e.tFin) airSeul += (airSeul ? ' L ' : 'M ') + x + ' ' + chAir(q.s.airSeul).toFixed(1);
      bat += (bat ? ' L ' : 'M ') + x + ' ' + chBat(q.s.bat).toFixed(1);
      givre += (givre ? ' L ' : 'M ') + x + ' ' + chGivre(q.s.givre).toFixed(1);
      CARRES.forEach(function (c) {
        var on = c[0] === 'h1' ? q.c.h1 : q.bob[c[0]];
        var y = on ? c[1] : c[1] + 40;
        if (prec[c[0]] === undefined) sq[c[0]] = 'M ' + x + ' ' + y;
        else if (prec[c[0]] !== y) sq[c[0]] += ' L ' + x + ' ' + prec[c[0]] + ' L ' + x + ' ' + y;
        prec[c[0]] = y;
      });
    }
    CARRES.forEach(function (c) { sq[c[0]] += ' L ' + chx(CH.tFin) + ' ' + prec[c[0]]; });
    var r = p.T >= CUES.Chronologie ? 1 : clamp(p.T / CH.tFin, 0, 1);
    var xr = CH.x0 + (CH.x1 - CH.x0) * r;
    var couleurs = { h1: C.green, RD: C.red, M1: C.orangeText, RFD: C.blue };
    return (
      <g transform="translate(270,0)">
        <rect x="0" y="1560" width="4030" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="48" y="1636" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · L’HORLOGE LANCE, LA SONDE TERMINE</text>
        <rect x={chx(e.tH)} y="1660" width={chx(e.tH2) - chx(e.tH)} height="780" fill="#e4f2ec" opacity="0.55" />
        {[['AIR · B1', 1745], ['HORLOGE h1', 1862], ['RD', 1937], ['M1 · Y1', 2012], ['BATTERIE B2', 2135], ['GIVRE', 2285], ['RFD', 2392]].map(function (l) {
          return <text key={l[1]} x="48" y={l[1]} fill={C.blue} fontSize="34" fontWeight="800">{l[0]}</text>;
        })}
        {[[4, '+4', C.orangeText, chAir], [2, '+2', C.blue, chAir], [2, '+2 · B2', C.red, chBat], [0, '0 °C', C.mute, chBat, true]].map(function (l, i) {
          return (
            <g key={i}>
              <line x1={CH.x0} y1={l[3](l[0])} x2={CH.x1} y2={l[3](l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={l[4] ? CH.x1 + 14 : CH.x0 - 14} y={l[3](l[0]) + 9} textAnchor={l[4] ? 'start' : 'end'} fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip7"><rect x={CH.x0 - 20} y="1650" width={xr - CH.x0 + 20} height="800" /></clipPath>
        <g clipPath="url(#chclip7)">
          <path d={air} fill="none" stroke={C.blue} strokeWidth="9" strokeLinejoin="round" />
          <path d={bat} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          <path d={givre + ' L ' + chx(CH.tFin) + ' 2320 L ' + CH.x0 + ' 2320 Z'} fill="#c9e0f2" stroke="#7fa8cc" strokeWidth="6" />
          {CARRES.map(function (c) {
            return <path key={c[0]} d={sq[c[0]]} fill="none" stroke={couleurs[c[0]]} strokeWidth="9" strokeLinejoin="round" />;
          })}
          {/* le deuxième principe : sans sonde, le froid resterait coupé jusqu'à la fin de la plage */}
          <g opacity="0.85">
            <path d={airSeul} fill="none" stroke={C.blue} strokeWidth="6" strokeDasharray="16 12" />
            <path d={'M ' + chx(e.tFin) + ' 2020 L ' + chx(e.tH2) + ' 2020 L ' + chx(e.tH2) + ' 1980'} fill="none"
                  stroke={C.orangeText} strokeWidth="6" strokeDasharray="16 12" />
            <text x={(chx(e.tFin) + chx(e.tH2)) / 2} y="2058" textAnchor="middle" fill={C.orangeText} fontSize="24" fontWeight="900">SANS SONDE (2e PRINCIPE)</text>
          </g>
        </g>
        {r < 1 && <line x1={xr} y1="1660" x2={xr} y2="2440" stroke={C.orange} strokeWidth="6" opacity="0.85" />}
        {p.replay !== null && (
          <g>
            <line x1={chx(p.replay)} y1="1660" x2={chx(p.replay)} y2="2440" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replay)} cy="1660" r="16" fill={C.orange} />
          </g>
        )}
      </g>
    );
  }

  function legende(e) {
    var s = e.s;
    if (e.bob.RD) return s.gouttes > 0.3 ? 'Dégivrage : M2 souffle l’air de la chambre, le givre fond.' : 'Dégivrage : le froid est coupé, l’air réchauffe la batterie.';
    if (e.bob.M1) return s.givre > 0.3 ? 'Marche : sous 0 °C, le givre se dépose.' : 'Marche : batterie propre, l’échange est complet.';
    return 'Arrêt.';
  }

  function zones(CUES) {
    var armoire = [2540, 110, 2440, 1420], degiv = [3900, 110, 1080, 1420], gros = [4500, 1560, 1260, 960];
    return [
      { t: 0, r: [930, 470, 1560, 1010] }, { t: CUES.Marche, r: [2540, 110, 1330, 1420] },
      { t: CUES.Circulation, r: [330, 30, 2150, 1420] }, { t: CUES.Horloge, r: armoire },
      { t: CUES.Fonte, r: gros }, { t: CUES.FonteFin, r: degiv }, { t: CUES.FinPlage, r: [250, 1540, 4080, 1000] },
      { t: CUES.Chronologie, r: [250, 1540, 4080, 1000] }, { t: CUES.CycleComplet, r: null }
    ];
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal);
    var z = 1920 / (D - 260), cam = { cx: (300 + D) / 2, cy: 1420, z: z };
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var M = CUES.Marche, H = CUES.Horloge, F = CUES.Fonte, P = CUES.FinPlage, Ch = CUES.Chronologie, CC = CUES.CycleComplet;
    var Z = Object.assign({}, CUES, { FonteFin: F + 8.6 });
    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond titre="CHAMBRE POSITIVE · +3 °C" />
            <Pipes phase={e.cum} flow={e.flow} />
            <Chambre T={T} temp={e.s.air} spin={T * 300} flow={1} phase={T} energy={e.bob.M1 ? 1 : 0}
                     frostU={clamp(e.s.givre, 0, 1)} liquid={e.bob.M1 ? 0.3 : 0} cid="s7"
                     seuil={3.5} consigne="CONSIGNE +2 · ENCLENCHEMENT +4" />
            <Machine T={T} carter={0} spin={e.cum * 300} flow={e.flow} phase={e.cum} live={e.bob.Y1} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <Cabinet T={T} e={e} />
            <RK.Etapes x={5040} y={100} w={880} h={1440} titre="LA SÉQUENCE" phases={PHASES} k={e.phase} pas={250} haut={220} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replay={e.enRejeu ? e.Tm : null} />
            <g transform="translate(4510,1560) scale(0.6667)">
              <RK.GrosPlan T={T} s={e.s} marche={e.bob.M1} legende={legende(e)} sonde="BATTERIE · SONDE B2" />
            </g>
            <RK.Surligneur T={T} zones={zones(Z)} />
          </g>
        </svg>

        <div style={{ position: 'absolute', inset: 0, background: C.paper, opacity: keyIn * 0.58, pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', left: '6%', right: '6%', top: '7%', opacity: keyIn,
          transform: 'translateY(' + (1 - keyIn) * -26 + 'px)', pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,253,248,0.95)', border: '3px solid ' + C.blue, borderLeft: '16px solid ' + C.orange,
            borderRadius: 18, padding: '26px 38px', boxShadow: '0 18px 50px rgba(27,58,99,0.18)'
          }}>
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 7 · LE DÉGIVRAGE NATUREL</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              L’horloge arrête le froid, le ventilateur continue : c’est l’air de la chambre qui fait fondre le givre.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              La sonde B2 termine plus tôt et RFD le retient : le froid revient dès que la batterie est propre.
            </div>
          </div>
        </div>

        {props.captions && (
          <Captions
            style={{
              bottom: 0, left: 0, right: 0, padding: '30px 8% 28px',
              font: '800 40px ' + font, color: C.blue, textShadow: 'none',
              background: C.paper, borderTop: '3px solid ' + C.line
            }}
            items={[
              { at: 0.4, text: 'Une chambre froide POSITIVE à +3 °C : son air peut faire fondre le givre.' },
              { at: 3.0, text: 'Le froid à gauche ; à droite l’horloge h1, le relais RD et le relais de fin RFD.' },
              { at: M + 0.4, text: 'B1 ferme : M1 et Y1 sont alimentés à travers le contact 21-22 de RD.' },
              { at: M + 3.0, text: 'Le ventilateur M2 tourne en permanence.' },
              { at: M + 5.4, text: 'La batterie passe sous 0 °C : le givre commence à se déposer.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Le condenseur rend la chaleur à l’extérieur : la vapeur redevient liquide.' },
              { at: CUES.Circulation + 7.4, text: 'Le givre s’épaissit sur la batterie : il faut le faire fondre.' },
              { at: H + 0.4, text: 'L’horloge h1 ferme son contact 3-4 : RD colle.' },
              { at: H + 2.2, text: 'RD 21-22 s’ouvre : M1 et Y1 s’arrêtent, même si B1 demande du froid.' },
              { at: H + 4.4, text: 'M2 continue : l’air de la chambre, à +3 °C, réchauffe la batterie.' },
              { at: H + 7.0, text: 'Aucune résistance : c’est l’air qui apporte la chaleur.' },
              { at: F + 0.4, text: 'La batterie est à 0 °C : le givre fond, l’eau s’écoule.' },
              { at: F + 4.4, text: 'Pendant la fonte, l’air de la chambre remonte doucement.' },
              { at: F + 9.0, text: 'Batterie à +2 °C : la sonde B2 bascule, son contact 1-2 fait retomber RD.' },
              { at: F + 10.6, text: 'RD 21-22 se referme : M1 et Y1 repartent aussitôt.' },
              { at: F + 12.2, text: 'Le contact NO de B2 fait coller RFD, qui se tient par 13-14.' },
              { at: P + 0.4, text: 'B2 revient en refroidissant… RFD garde RD ouvert : pas de second dégivrage.' },
              { at: P + 2.4, text: 'Fin de la plage d’horloge : h1 s’ouvre, RFD retombe.' },
              { at: P + 5.0, text: 'Sans sonde (2e principe), le froid restait coupé jusqu’ici : l’air remonte pour rien.' },
              { at: Ch + 0.4, text: 'Le chronogramme : l’horloge lance, la sonde termine.' },
              { at: Ch + 4.0, until: CC, text: 'En pointillé : ce qu’aurait fait l’horloge seule.' },
              { at: CC + 0.5, text: 'Toute la séquence, d’un seul regard : suivez le curseur orange.' },
              { at: CC + 5.0, text: 'L’horloge coupe le froid, M2 souffle, le givre fond.' },
              { at: CC + 10.0, until: CUES.LaCle, text: 'B2 termine, RFD retient : le froid revient plus tôt.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesDegivrageNaturel() {
    var tw = window.useTweaks(window.OM_TWEAKS || { motionEditor: true, legendes: true, dys: false });
    var t = tw[0], setTweak = tw[1];
    var TweaksPanel = window.TweaksPanel, TweakToggle = window.TweakToggle, TweakSection = window.TweakSection;
    return (
      <React.Fragment>
        <CompositionStage width={1920} height={1080} bg={C.paper}
                          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece captions={t.legendes !== false} dys={!!t.dys} />
        </CompositionStage>
        <TweaksPanel>
          <TweakSection label="Diffusion" />
          <TweakToggle label="Légendes à l’écran" value={t.legendes !== false} onChange={function (v) { setTweak('legendes', v); }} />
          <TweakToggle label="Police Lexend (DYS)" value={!!t.dys} onChange={function (v) { setTweak('dys', v); }} />
          <TweakSection label="Outils" />
          <TweakToggle label="Motion editor" value={t.motionEditor !== false} onChange={function (v) { setTweak('motionEditor', v); }} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  window.RegulesDegivrageNaturel = RegulesDegivrageNaturel;
  window.RK7 = { Cabinet: Cabinet, etat: etat, legende: legende, PHASES: PHASES };
})();
