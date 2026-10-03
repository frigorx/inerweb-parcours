/* Les régules · Station 8 — Le dégivrage électrique (pump-down unique + résistances)
   Refait le 03/10/2026 sur la source : fiche « 6.3 Électricité — régulation pump down
   avec dégivrage électrique » (CAP IFCA, C4), page 2, lue avec ses deux sœurs :
     KM1 = BP (1-4) · HP (1-2) · (KA1 13-14 // KM1 13-14)        tirage au vide unique
     KM3 = KM1 67-68 temporisé                                     ventilateurs différés
     KA1 = B1 (3-4) · h1 1-2 (NF)                                  demande de froid
     Y1  = KA1 23-24                                               électrovanne
     RD  = h1 3-4 · B2 1-2 (NF) · RFD 1-2 (NF)                     relais de dégivrage
     RFD = h1 3-4 · (B2 NO // KM1 23-24)                           fin de dégivrage, verrouillage
     R1  = RD 3-4                                                  résistances
   Deux lectures tranchées : le « B4 » NF de la ligne KA1 est le contact de l'horloge
   (fiche 6.1 : B4 = horloge électromécanique, 1-2 dans la ligne KA1, 1-4 sur la
   résistance) — il est nommé h1 1-2 ici ; le renvoi « RD 1-2 colonne 7 » est une
   recopie du tableau de la fiche 6.2 (où RD 1-2 est dessiné ailleurs) : non repris.
   Le BP garde son nom de pressostat (la fiche le nomme aussi B2, comme la sonde).
   Simplifié aux organes de la régulation : S1, F1 à F4, H1, KM2 et la seconde
   chambre (KM4, R2) ne sont pas repris.
   Les états ne sont plus écrits à la main : les capteurs suivent un scénario, les
   relais sont CALCULÉS pas à pas par un petit solveur de réseau (03/10 : l'ancien
   film montrait KM1 alimenté contact ouvert). Exposé en RK8 pour les planches. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var Manometre = RK.Manometre, Chip = RK.Chip;
  var D = 5940;   /* bord droit du canvas : l'armoire a sept colonnes */

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

  /* ---- le réseau de commande ------------------------------------------
     Chaque organe est un élément entre deux nœuds ; une charge (bobine,
     résistance) relie son nœud au neutre. Potentiel « phase » : relié à L par
     des contacts fermés ; « neutre » : relié à N par des contacts fermés et des
     charges, sans repasser par L. Un nœud qui a les deux est parcouru. */
  function reseau(c) {
    return [
      { id: 'BP', a: 'L', b: 'k1', f: c.BP }, { id: 'HP', a: 'k1', b: 'k2', f: true },
      { id: 'KA1_13', a: 'k2', b: 'k3', f: c.KA1 }, { id: 'KM1_13', a: 'k2', b: 'k3', f: c.KM1 },
      { id: 'KM1c', a: 'k3', charge: true },
      { id: 'KM1_67', a: 'L', b: 'm3', f: c.KM1_67 }, { id: 'KM3c', a: 'm3', charge: true },
      { id: 'B1', a: 'L', b: 'a1', f: c.B1 }, { id: 'H12', a: 'a1', b: 'a2', f: !c.h1 },
      { id: 'KA1c', a: 'a2', charge: true },
      { id: 'KA1_23', a: 'L', b: 'y1', f: c.KA1 }, { id: 'Y1c', a: 'y1', charge: true },
      { id: 'H34', a: 'L', b: 'd1', f: c.h1 }, { id: 'B2nf', a: 'd1', b: 'd2', f: !c.B2 },
      { id: 'RFD12', a: 'd2', b: 'd3', f: !c.RFD }, { id: 'RDc', a: 'd3', charge: true },
      { id: 'B2no', a: 'd1', b: 'f1', f: c.B2 }, { id: 'KM1_23', a: 'd1', b: 'f1', f: c.KM1 },
      { id: 'RFDc', a: 'f1', charge: true },
      { id: 'RD34', a: 'L', b: 'r1', f: c.RD }, { id: 'R1c', a: 'r1', charge: true }
    ];
  }
  var resoudre = RK.resoudre, mode = RK.modeFil;   /* le solveur du kit commun */

  /* ---- le scénario : les capteurs, l'horloge, la physique ---------------- */
  var TEMPO = 4.5;     /* KM1 67-68 : retard à la fermeture (≈ 30 s réelles) */
  var DELAI = 0.15;    /* un relais ferme ses contacts un instant après sa bobine */
  function evenements(CUES) {
    var M = CUES.MiseEnService, H = CUES.Horloge, Dg = CUES.Degivrage, R = CUES.Reprise;
    var e = { tB1: M + 1.0, tBPc: M + 3.0, tH: H + 1.0, tPD: H + 6.5,
              tFonte: Dg + 5.5, tBPc2: Dg + 6.0, tFin: Dg + 10.0, tH2: R + 4.0 };
    e.tChauffe = e.tPD + 0.3;
    e.tZero = e.tChauffe + 1.8;
    return e;
  }
  function capteurs(t, e, total) {
    return {
      air: pw(t, [[0, -15.4], [e.tB1, -14.0], [e.tBPc + 0.2, -13.9], [e.tH, -16.4], [e.tPD, -16.5], [e.tFin, -14.6],
                  [e.tH2, -14.0], [e.tH2 + 3.8, -14.2], [e.tH2 + 8.5, -15.2], [total, -17.2]]),
      bat: pw(t, [[0, -15.6], [e.tBPc, -15.5], [e.tBPc + 3, -24], [e.tH, -25.5], [e.tPD, -27], [e.tChauffe, -27],
                  [e.tZero, 0], [e.tFonte, 0.6], [e.tFin, 10], [e.tFin + 0.5, 10.3], [e.tH2, 7], [e.tH2 + 2.5, -10],
                  [e.tH2 + 5.5, -22], [e.tH2 + 8.5, -25], [total, -26]]),
      bp: pw(t, [[0, 1.5], [e.tB1 + DELAI, 1.52], [e.tBPc, 1.8], [e.tBPc + 0.8, 2.6], [e.tBPc + 2.5, 2.35],
                 [e.tH + DELAI, 2.3], [e.tPD, 0.3], [e.tChauffe, 0.26], [e.tZero, 0.9], [e.tBPc2, 1.8], [e.tFin, 3.0],
                 [e.tH2, 2.85], [e.tH2 + 1.5, 2.5], [e.tH2 + 4.5, 2.3], [total, 2.25]]),
      givre: pw(t, [[0, 0], [e.tBPc, 0], [e.tH, 1], [e.tZero, 1], [e.tFonte, 0], [total, 0]]),
      charge: pw(t, [[0, 0], [e.tB1 + DELAI, 0], [e.tB1 + 1.4, 0.3], [e.tH + DELAI, 0.3], [e.tPD, 0],
                     [e.tH2 + DELAI, 0], [e.tH2 + 1.5, 0.3], [total, 0.3]]),
      gouttes: t < e.tZero ? 0 : t < e.tFin ? 1 : clamp(1 - (t - e.tFin) / (e.tH2 - e.tFin), 0, 1),
      b1: t >= e.tB1,
      h1: t >= e.tH && t < e.tH2
    };
  }

  /* La simulation, faite une fois : pas de 0,02 s, les relais suivent leur
     bobine avec DELAI (RFD sans délai : il doit verrouiller RD au même instant
     où l'horloge les alimente tous les deux). */
  var memo = {};
  var DT = 0.02;
  function simuler(CUES, total) {
    var cle = JSON.stringify(CUES) + '|' + total;
    if (memo[cle]) return memo[cle];
    var e = evenements(CUES);
    var n = Math.ceil(total / DT) + 1, pas = [], bpF = false, b2 = false, km1Depuis = null;
    var cumKM = 0, cumV = 0, retard = Math.round(DELAI / DT);
    for (var i = 0; i < n; i++) {
      var t = i * DT, s = capteurs(t, e, total);
      if (s.bp >= 1.8) bpF = true; else if (s.bp <= 0.3) bpF = false;
      if (s.bat >= 10) b2 = true; else if (s.bat <= -5) b2 = false;
      var avant = i >= retard ? pas[i - retard].bob : {};
      var prec = i > 0 ? pas[i - 1].bob : {};
      var tempo = km1Depuis !== null && t - km1Depuis >= TEMPO - 1e-9;
      var c = { BP: bpF, B1: s.b1, h1: s.h1, B2: b2, KA1: !!avant.KA1, KM1: !!avant.KM1, RD: !!avant.RD,
                RFD: !!prec.RFD, KM1_67: tempo };
      var r, bob;
      for (var k = 0; k < 4; k++) {
        r = resoudre(reseau(c));
        bob = { KA1: r.conduit.KA1c, KM1: r.conduit.KM1c, KM3: r.conduit.KM3c, Y1: r.conduit.Y1c,
                RD: r.conduit.RDc, RFD: r.conduit.RFDc, R1: r.conduit.R1c };
        if (c.RFD === bob.RFD) break;
        c.RFD = bob.RFD;
      }
      if (bob.KM1) { if (km1Depuis === null) km1Depuis = t; } else km1Depuis = null;
      if (i > 0) { cumKM += pas[i - 1].bob.KM1 ? DT : 0; cumV += pas[i - 1].bob.KM3 ? DT : 0; }
      pas.push({ t: t, s: s, c: c, bob: bob, cumKM: cumKM, cumV: cumV });
    }
    memo[cle] = { pas: pas, ev: e };
    return memo[cle];
  }

  /* Les états de l'installation à l'instant T du film (et du rejeu). */
  function etat(T, CUES, total) {
    var sim = simuler(CUES, total), e = sim.ev;
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var t0 = e.tB1 - 1, t1 = e.tH2 + TEMPO + 2;
    var Tm = enRejeu ? t0 + (T - CUES.CycleComplet) * (t1 - t0) / (CUES.LaCle - CUES.CycleComplet) : T;
    function a(t) { return sim.pas[clamp(Math.round(t / DT), 0, sim.pas.length - 1)]; }
    var p = a(Tm);
    /* un contact s'ouvre ou se ferme en 0,2 s : moyenne sur l'instant qui précède */
    function lisse(f) {
      var m = 0;
      for (var k = 0; k < 5; k++) m += f(a(Tm - k * 0.05)) ? 0 : 1;
      return m / 5;
    }
    var phase = -1;
    if (p.bob.KM1 && !p.c.h1 && Tm < e.tH) phase = 0;
    if (p.c.h1 && Tm < e.tChauffe) phase = 1;
    if (p.c.h1 && Tm >= e.tChauffe - 0.2 && Tm < e.tFin + 0.2) phase = 2;
    if (p.c.h1 && Tm >= e.tFin + 0.2) phase = 3;
    if (!p.c.h1 && Tm >= e.tH2) phase = p.bob.KM3 ? 5 : 4;
    return {
      Tm: Tm, enRejeu: enRejeu, ev: e, c: p.c, bob: p.bob, s: p.s, phase: phase,
      ouv: function (id) { return lisse(function (q) { return reseau(q.c).filter(function (x) { return x.id === id; })[0].f; }); },
      flow: 1 - lisse(function (q) { return q.bob.KM1; }),
      fans: 1 - lisse(function (q) { return q.bob.KM3; }),
      cumKM: p.cumKM, cumV: p.cumV
    };
  }

  /* ---- l'armoire --------------------------------------------------------- */
  var X = { km: 300, kmh: 540, v: 940, a: 1320, y: 1680, rd: 2140, no: 2520, rfd: 2800, r: 3140 };
  var FILS = [
    ['M 300 300 L 300 340', 'L', ['BP']], ['M 300 490 L 300 540', 'k1', []], ['M 300 690 L 300 720', 'k2', []],
    ['M 300 720 L 300 740', 'k2', ['KA1_13']], ['M 300 720 L 540 720 L 540 740', 'k2', ['KM1_13']],
    ['M 300 890 L 300 925', 'k3', ['KA1_13']], ['M 540 890 L 540 925 L 300 925', 'k3', ['KM1_13']],
    ['M 300 925 L 300 1041', 'k3', []], ['M 300 1099 L 300 1300', 'N', ['KM1c']],
    ['M 940 300 L 940 340', 'L', ['KM1_67']], ['M 940 490 L 940 1041', 'm3', []], ['M 940 1099 L 940 1300', 'N', ['KM3c']],
    ['M 1320 300 L 1320 340', 'L', ['B1']], ['M 1320 490 L 1320 560', 'a1', []], ['M 1320 710 L 1320 1041', 'a2', []],
    ['M 1320 1099 L 1320 1300', 'N', ['KA1c']],
    ['M 1680 300 L 1680 340', 'L', ['KA1_23']], ['M 1680 490 L 1680 1041', 'y1', []], ['M 1680 1099 L 1680 1300', 'N', ['Y1c']],
    ['M 2140 300 L 2140 340', 'L', ['H34']], ['M 2140 490 L 2140 520', 'd1', []], ['M 2140 520 L 2140 560', 'd1', ['B2nf']],
    ['M 2140 520 L 2520 520', 'd1', ['B2no', 'KM1_23']], ['M 2520 520 L 2520 560', 'd1', ['B2no']],
    ['M 2520 520 L 2800 520 L 2800 560', 'd1', ['KM1_23']],
    ['M 2140 710 L 2140 780', 'd2', []], ['M 2140 930 L 2140 1041', 'd3', []], ['M 2140 1099 L 2140 1300', 'N', ['RDc']],
    ['M 2520 710 L 2520 760 L 2800 760', 'f1', ['B2no']], ['M 2800 710 L 2800 760', 'f1', ['KM1_23']],
    ['M 2800 760 L 2800 1041', 'f1', []], ['M 2800 1099 L 2800 1300', 'N', ['RFDc']],
    ['M 3140 300 L 3140 340', 'L', ['RD34']], ['M 3140 490 L 3140 1010', 'r1', []], ['M 3140 1130 L 3140 1300', 'N', ['R1c']]
  ];

  /* contact temporisé à la fermeture (EN 60617) : le « parachute » sur la lame */
  function Parachute(p) {
    var x = p.x, m = p.y + 75;
    return (
      <g stroke={C.wire} strokeWidth="5" fill="none" strokeLinecap="round">
        <line x1={x - 10} y1={m - 8} x2={x - 44} y2={m - 8} />
        <line x1={x - 10} y1={m + 8} x2={x - 44} y2={m + 8} />
        <path d={'M ' + (x - 44) + ' ' + (m - 24) + ' A 24 24 0 0 0 ' + (x - 44) + ' ' + (m + 24)} />
      </g>
    );
  }

  function Cabinet(p) {
    var RK2 = window.RK;
    var e = p.e, t = p.T;
    var r = resoudre(reseau(e.c));
    function V(id) { return r.conduit[id]; }
    var chauffe = e.bob.R1;
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="3400" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · PUMP-DOWN ET DÉGIVRAGE ÉLECTRIQUE</text>
        <text x="3360" y="66" textAnchor="end" fill={C.blue} fontSize="26" fontWeight="900" letterSpacing="2">D’APRÈS LA FICHE 6.3 · CAP IFCA</text>
        <g fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="3">
          <line x1="240" y1="196" x2="1900" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="1060" y="180" textAnchor="middle">LE FROID</text>
          <line x1="2020" y1="196" x2="3320" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="2670" y="180" textAnchor="middle">LE DÉGIVRAGE</text>
        </g>

        <line x1="170" y1="104" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="3320" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="1300" x2="3320" y2="1300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="1312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {FILS.map(function (f, i) { return <path key={i} d={f[0]} />; })}
        </g>
        {FILS.map(function (f, i) { return <RK2.Potentiel key={i} d={f[0]} mode={mode(r, f[1], f[2])} t={t} />; })}

        {/* le compresseur : la BP de régulation, la HP, la demande ou le maintien */}
        <RK2.ContactV x={X.km} y={340} ouv={e.ouv('BP')} live={V('BP')} glyph="p" code="BP" sub="régulation" b1="1" b2="4" />
        <RK2.ContactV nf={true} x={X.km} y={540} ouv={0} live={V('HP')} glyph="p" code="HP" sub="sécurité" b1="1" b2="2" />
        <RK2.ContactV aux={true} x={X.km} y={740} ouv={e.ouv('KA1_13')} live={V('KA1_13')} code="KA1" sub="demande" />
        <RK2.ContactV aux={true} x={X.kmh} y={740} ouv={e.ouv('KM1_13')} live={V('KM1_13')} code="KM1" sub="maintien" />
        <RK2.BobineV x={X.km} y={1070} code="KM1" sub="COMPRESSEUR" live={e.bob.KM1} />

        {/* les ventilateurs de l'évaporateur, retardés par le bloc temporisé de KM1 */}
        <RK2.ContactV aux={true} x={X.v} y={340} ouv={e.ouv('KM1_67')} live={V('KM1_67')} code="KM1" sub="temporisé" b1="67" b2="68" />
        <Parachute x={X.v} y={340} />
        <RK2.BobineV x={X.v} y={1070} code="KM3" sub="VENTILATEURS" live={e.bob.KM3} />

        {/* la demande : B1, à travers le contact d'horloge qui s'ouvre au dégivrage */}
        <RK2.ContactV x={X.a} y={340} ouv={e.ouv('B1')} live={V('B1')} glyph="θ" code="B1" sub="thermostat" b1="3" b2="4" />
        <RK2.ContactV nf={true} x={X.a} y={560} ouv={e.ouv('H12')} live={V('H12')} glyph="t" code="h1" sub="horloge" b1="1" b2="2" />
        <RK2.BobineV x={X.a} y={1070} code="KA1" sub="PUMP-DOWN" live={e.bob.KA1} />

        <RK2.ContactV aux={true} x={X.y} y={340} ouv={e.ouv('KA1_23')} live={V('KA1_23')} code="KA1" sub="demande" b1="23" b2="24" />
        <RK2.BobineV x={X.y} y={1070} code="Y1" sub="ÉLECTROVANNE" live={e.bob.Y1} />

        {/* le dégivrage : l'horloge, la sonde de fin B2, la mémoire RFD */}
        <RK2.ContactV x={X.rd} y={340} ouv={e.ouv('H34')} live={V('H34')} glyph="t" code="h1" sub="horloge" b1="3" b2="4" />
        <RK2.ContactV nf={true} x={X.rd} y={560} ouv={e.ouv('B2nf')} live={V('B2nf')} glyph="θ" code="B2" sub="fin de dégivrage" b1="1" b2="2" />
        <line x1={X.rd + 10} y1="585" x2={X.no - 10} y2="585" stroke={C.wire} strokeWidth="4" strokeDasharray="12 10" />
        <RK2.ContactV nf={true} aux={true} x={X.rd} y={780} ouv={e.ouv('RFD12')} live={V('RFD12')} code="RFD" sub="fin mémorisée" b1="1" b2="2" />
        <RK2.BobineV x={X.rd} y={1070} code="RD" sub="DÉGIVRAGE" live={e.bob.RD} />

        <RK2.ContactV aux={true} x={X.no} y={560} ouv={e.ouv('B2no')} live={V('B2no')} code="B2" sub="fin · NO" b1="1" b2="4" />
        <RK2.ContactV aux={true} x={X.rfd} y={560} ouv={e.ouv('KM1_23')} live={V('KM1_23')} code="KM1" sub="verrouillage" b1="23" b2="24" />
        <RK2.BobineV x={X.rfd} y={1070} code="RFD" sub="MÉMOIRE" live={e.bob.RFD} />

        <RK2.ContactV aux={true} x={X.r} y={340} ouv={e.ouv('RD34')} live={V('RD34')} code="RD" sub="résistances" b1="3" b2="4" />
        <g>
          {chauffe && <rect x={X.r - 40} y="996" width="80" height="148" rx="10" fill="#ff8b57" opacity={0.25 + 0.15 * Math.sin(t * 4)} />}
          <rect x={X.r - 26} y="1010" width="52" height="120" fill={chauffe ? '#fff0e9' : C.blueSoft}
                stroke={chauffe ? C.orangeText : C.blue} strokeWidth="7" />
          <text x={X.r + 50} y="1072" fill={chauffe ? C.orangeText : C.blue} fontSize="36" fontWeight="900">R1</text>
          <text x={X.r + 50} y="1102" fill={C.mute} fontSize="22" fontWeight="700">RÉSISTANCES</text>
        </g>
      </g>
    );
  }

  /* ---- côté fluide : les résistances posées sur la batterie, la sonde B2 ---- */
  function Resistances(p) {
    var rows = [920, 980, 1040, 1100];
    function zig(y) {
      var d = 'M 1130 ' + y;
      for (var x = 1130; x < 1530; x += 40) d += ' L ' + (x + 20) + ' ' + (y - 14) + ' L ' + (x + 40) + ' ' + y;
      return d;
    }
    var glow = clamp(p.heat, 0, 1);
    var drops = [];
    for (var i = 0; i < 7; i++) {
      var ph = (p.T * 1.5 + i * 0.37) % 1;
      drops.push([1160 + i * 58, 1150 + ph * 34, 1 - ph]);
    }
    return (
      <g>
        {rows.map(function (y) {
          return (
            <g key={y}>
              <path d={zig(y)} fill="none" stroke={C.red} strokeWidth="6" strokeLinecap="round" opacity={0.3 + 0.7 * glow} />
              {glow > 0.05 && <path d={zig(y)} fill="none" stroke="#ff8b57" strokeWidth={15 + 5 * Math.sin(p.T * 4)}
                                    strokeLinecap="round" opacity={0.3 * glow} />}
            </g>
          );
        })}
        <rect x="1110" y="1186" width="450" height="16" rx="6" fill="#dfe6ee" stroke={C.blue} strokeWidth="4" />
        <g opacity={clamp(p.melt, 0, 1)}>
          {drops.map(function (d, i) {
            return <ellipse key={i} cx={d[0]} cy={d[1]} rx="7" ry="11" fill="#5d9dcd" opacity={0.35 + 0.5 * d[2]} />;
          })}
        </g>
        <g>
          <rect x="1566" y="792" width="78" height="52" rx="8" fill={C.card} stroke={C.orangeText} strokeWidth="4" />
          <text x="1605" y="830" textAnchor="middle" fill={C.orangeText} fontSize="30" fontWeight="900">B2</text>
        </g>
      </g>
    );
  }

  function SondeB2(p) {
    var v = p.val, chaud = v > 0;
    return (
      <g opacity={p.o}>
        <rect x="1800" y="1268" width="560" height="160" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="1828" y="1308" fill={C.orangeText} fontSize="24" fontWeight="900" letterSpacing="2">SONDE B2 · BATTERIE</text>
        <text x="1828" y="1392" fill={chaud ? C.red : C.blue} fontSize="66" fontWeight="900">
          {(v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',')} °C
        </text>
        <text x="2340" y="1350" textAnchor="end" fill={C.mute} fontSize="22" fontWeight="800">FIN DE</text>
        <text x="2340" y="1378" textAnchor="end" fill={C.mute} fontSize="22" fontWeight="800">DÉGIVRAGE</text>
        <text x="2340" y="1410" textAnchor="end" fill={C.red} fontSize="26" fontWeight="900">+10 °C</text>
      </g>
    );
  }

  /* ---- la séquence, étape par étape (le « à réciter » qui s'allume) ---- */
  var PHASES = [
    ['FROID', 'B1 fait coller KA1 : Y1 s’ouvre, la BP fait coller KM1'],
    ['TIRAGE AU VIDE', 'h1 coupe KA1 : Y1 se ferme, KM1 vide la batterie'],
    ['RÉSISTANCES', 'compresseur arrêté : RFD retombe, RD colle'],
    ['ÉGOUTTAGE', 'B2 fait retomber RD, RFD retient la fin'],
    ['REPRISE DU FROID', 'fin de la plage h1 : KA1, Y1, puis KM1'],
    ['VENTILATEURS', 'KM1 67-68 temporisé : ils repartent en dernier']
  ];
  function Sequence(p) {
    return <RK.Etapes x={4400} y={1560} titre="LA SÉQUENCE" phases={PHASES} k={p.phase} />;
  }

  /* ---- le chronogramme, tracé au fil du film ---- */
  var CH = { x0: 900, x1: 4020, tFin: 61 };
  function chx(t) { return CH.x0 + (CH.x1 - CH.x0) * clamp(t / CH.tFin, 0, 1); }
  function chBat(v) { return 1840 - ((v + 28) / 40) * 160; }
  function chBp(v) { return 2180 - clamp(v / 3.2, 0, 1) * 120; }
  var CARRES = [['h1', 1880], ['KA1', 1975], ['KM1', 2215], ['RD', 2305], ['KM3', 2395]];

  function Chrono(p) {
    var CUES = p.CUES, total = p.total, sim = simuler(CUES, total), e = sim.ev;
    var bat = '', bp = '', sq = {}, prec = {};
    CARRES.forEach(function (q) { sq[q[0]] = ''; });
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var q = sim.pas[Math.min(Math.round(t / DT), sim.pas.length - 1)], x = chx(t).toFixed(1);
      bat += (bat ? ' L ' : 'M ') + x + ' ' + chBat(q.s.bat).toFixed(1);
      bp += (bp ? ' L ' : 'M ') + x + ' ' + chBp(q.s.bp).toFixed(1);
      CARRES.forEach(function (c) {
        var on = c[0] === 'h1' ? q.c.h1 : q.bob[c[0]];
        var y = on ? c[1] : c[1] + 50;
        if (prec[c[0]] === undefined) sq[c[0]] = 'M ' + x + ' ' + y;
        else if (prec[c[0]] !== y) sq[c[0]] += ' L ' + x + ' ' + prec[c[0]] + ' L ' + x + ' ' + y;
        prec[c[0]] = y;
      });
    }
    CARRES.forEach(function (c) { sq[c[0]] += ' L ' + chx(CH.tFin) + ' ' + prec[c[0]]; });
    /* le tracé suit le film ; à la scène Chronologie, il est complet */
    var r = p.T >= CUES.Chronologie ? 1 : clamp(p.T / CH.tFin, 0, 1);
    var xr = CH.x0 + (CH.x1 - CH.x0) * r;
    var couleurs = { h1: C.green, KA1: C.green, KM1: C.orangeText, RD: C.red, KM3: C.blue };
    return (
      <g transform="translate(270,0)">
        <rect x="0" y="1560" width="4090" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="48" y="1636" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · DU FROID, UN DÉGIVRAGE, LA REPRISE</text>
        <rect x={chx(e.tH)} y="1660" width={chx(e.tH2) - chx(e.tH)} height="840" fill="#e4f2ec" opacity="0.55" />
        <text x={(chx(e.tH) + chx(e.tH2)) / 2} y="1636" textAnchor="middle" fill={C.green} fontSize="30" fontWeight="900" letterSpacing="3">PLAGE DE L’HORLOGE h1</text>
        {[['BATTERIE B2', 1770], ['HORLOGE h1', 1915], ['KA1 · Y1', 2010], ['PRESSION BP', 2130], ['KM1', 2250], ['RD · R1', 2340], ['KM3 · VENTIL.', 2430]].map(function (l) {
          return <text key={l[1]} x="48" y={l[1]} fill={C.blue} fontSize="36" fontWeight="800">{l[0]}</text>;
        })}
        {[[10, '+10 · fin', C.red], [0, '0 °C', C.mute]].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chBat(l[0])} x2={CH.x1} y2={chBat(l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={CH.x0 - 14} y={chBat(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        {[[1.8, '1,8 bar', C.orangeText], [0.3, '0,3 bar', C.blue]].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chBp(l[0])} x2={CH.x1} y2={chBp(l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={CH.x0 - 14} y={chBp(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip8"><rect x={CH.x0 - 20} y="1650" width={xr - CH.x0 + 20} height="860" /></clipPath>
        <g clipPath="url(#chclip8)">
          <path d={bat} fill="none" stroke={C.blue} strokeWidth="9" strokeLinejoin="round" />
          <path d={bp} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          {CARRES.map(function (c) {
            return <path key={c[0]} d={sq[c[0]]} fill="none" stroke={couleurs[c[0]]} strokeWidth="9" strokeLinejoin="round" />;
          })}
        </g>
        {r < 1 && <line x1={xr} y1="1660" x2={xr} y2="2490" stroke={C.orange} strokeWidth="6" opacity="0.85" />}
        {p.replay !== null && (
          <g>
            <line x1={chx(p.replay)} y1="1660" x2={chx(p.replay)} y2="2490" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replay)} cy="1660" r="16" fill={C.orange} />
          </g>
        )}
      </g>
    );
  }

  /* ---- le surligneur : un cadre ambre sur la zone dont on parle ---- */
  function zones(CUES) {
    var chambre = [930, 470, 1560, 1010], armoire = [2540, 120, 3360, 1400];
    return [
      { t: 0, r: chambre }, { t: CUES.MiseEnService, r: [2540, 120, 1940, 1400] },
      { t: CUES.Circulation, r: [330, 30, 2150, 1420] }, { t: CUES.Horloge, r: armoire },
      { t: CUES.Degivrage, r: chambre }, { t: CUES.Reprise, r: armoire },
      { t: CUES.Chronologie, r: [250, 1540, 5690, 1000] }, { t: CUES.CycleComplet, r: null }
    ];
  }
  function Surligneur(p) {
    return <RK.Surligneur T={p.T} zones={zones(p.CUES)} />;
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal), ev = e.ev;
    var z = 1920 / (D - 260), cam = { cx: (300 + D) / 2, cy: 1420, z: z };
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var H = CUES.Horloge, Dg = CUES.Degivrage, R = CUES.Reprise, M = CUES.MiseEnService, Ch = CUES.Chronologie, CC = CUES.CycleComplet;

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond />
            <Pipes phase={e.cumKM} flow={e.flow} />
            <Chambre T={T} temp={e.s.air} spin={e.cumV * 300} flow={e.fans} phase={e.cumV} energy={e.bob.KM1 ? 1 : 0}
                     frostU={e.s.givre} liquid={e.s.charge} cid="s8" />
            <Resistances T={T} heat={e.bob.R1 ? 1 : 0} melt={e.s.gouttes} />
            <Machine T={T} carter={0} spin={e.cumKM * 300} flow={e.flow} phase={e.cumKM} live={e.bob.Y1} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <Chip T={T} at={ev.tChauffe} hold={6} x="700" y="1060" text="RÉSISTANCES DE BATTERIE" sub="elles chauffent, compresseur arrêté" fs="32" tone={C.red} />
            <Manometre x={2320} y={680} val={e.s.bp} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
            <rect x="2180" y="860" width="280" height="80" rx="10" fill={e.bob.KM1 ? '#fff0e9' : C.blueSoft}
                  stroke={e.bob.KM1 ? C.orangeText : C.blue} strokeWidth="6" />
            <text x="2320" y="914" textAnchor="middle" fill={e.bob.KM1 ? C.orangeText : C.blue} fontSize="32" fontWeight="900">
              {e.bob.KM1 ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}
            </text>
            <rect x="2180" y="960" width="280" height="62" rx="10" fill={e.bob.R1 ? '#fdecea' : C.card}
                  stroke={e.bob.R1 ? C.red : C.line} strokeWidth="6" />
            <text x="2320" y="1003" textAnchor="middle" fill={e.bob.R1 ? C.red : C.mute} fontSize="30" fontWeight="900">
              {e.bob.R1 ? 'R1 CHAUFFE' : 'R1 À L’ARRÊT'}
            </text>
            <SondeB2 val={e.s.bat} o={clamp((T - H + 0.4) / 0.8, 0, 1)} />
            <Cabinet T={T} e={e} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replay={e.enRejeu ? e.Tm : null} />
            <Sequence phase={e.phase} />
            <Surligneur T={T} CUES={CUES} />
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 8 · LE DÉGIVRAGE ÉLECTRIQUE</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              L’horloge coupe la demande : le compresseur tire au vide et s’arrête, puis seulement les résistances chauffent.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              La sonde B2 termine le dégivrage et RFD le retient ; égouttage, reprise du froid, ventilateurs en dernier.
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
              { at: 0.4, text: 'Une chambre froide NÉGATIVE : l’air y est maintenu sous zéro degré — ici, consigne −18 °C.' },
              { at: 3.2, text: 'L’armoire : à gauche le froid, à droite le dégivrage — sept colonnes.' },
              { at: M + 0.4, text: 'B1 ferme : le relais KA1 colle, son contact 23-24 ouvre l’électrovanne Y1.' },
              { at: M + 2.6, text: 'La pression monte : à 1,8 bar la BP ferme, KM1 colle et se tient par 13-14.' },
              { at: M + 5.2, text: 'KM1 67-68 est temporisé : les ventilateurs KM3 démarrent après un délai.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Le condenseur rend la chaleur à l’extérieur : la vapeur redevient liquide.' },
              { at: CUES.Circulation + 7.4, text: 'Le détendeur thermostatique fait tomber la pression.' },
              { at: CUES.Circulation + 9.0, text: 'Dans le serpentin, le liquide s’évapore : le givre se dépose.' },
              { at: H + 0.4, text: 'L’horloge h1 bascule : son contact 1-2 coupe KA1, son contact 3-4 alimente le dégivrage.' },
              { at: H + 2.2, text: 'KA1 retombe : Y1 se ferme. KM1 se tient par 13-14 : c’est le tirage au vide.' },
              { at: H + 3.8, text: 'Tant que KM1 tourne, son contact 23-24 tient RFD : RD ne peut pas coller.' },
              { at: H + 6.6, text: 'À 0,3 bar la BP ouvre : KM1 tombe, les ventilateurs s’arrêtent avec lui.' },
              { at: H + 8.0, text: 'RFD retombe, RD colle : son contact 3-4 alimente les résistances R1.' },
              { at: H + 10.0, text: 'Le compresseur s’est arrêté AVANT la chauffe : c’est le verrouillage.' },
              { at: Dg + 0.4, text: 'Les résistances chauffent la batterie : le givre fond, l’eau tombe dans le bac.' },
              { at: Dg + 3.0, text: 'Tant qu’il reste de la glace, la batterie reste à 0 °C : la chaleur sert à fondre.' },
              { at: Dg + 6.0, text: 'La pression remonte, la BP se referme… mais KA1 est coupé : KM1 ne repart pas.' },
              { at: Dg + 10.0, text: 'À +10 °C, la sonde B2 bascule : RD retombe, les résistances s’arrêtent.' },
              { at: Dg + 11.6, text: 'Son contact NO fait coller RFD : le dégivrage reste terminé.' },
              { at: R + 0.4, text: 'Égouttage : tout est arrêté, l’eau finit de s’écouler.' },
              { at: R + 4.1, text: 'Fin de la plage d’horloge : KA1 recolle, Y1 s’ouvre, KM1 repart.' },
              { at: R + 6.2, text: 'La batterie refroidit, les ventilateurs attendent encore.' },
              { at: R + 8.7, text: 'KM1 67-68 ferme enfin : les ventilateurs repartent, sans souffler d’eau.' },
              { at: R + 12.0, text: 'Le froid reprend : la séquence de dégivrage est bouclée.' },
              { at: Ch + 0.4, text: 'Le chronogramme : froid, tirage au vide, résistances, égouttage, reprise.' },
              { at: Ch + 3.4, until: CC, text: 'Les ventilateurs repartent en dernier : regardez la dernière ligne.' },
              { at: CC + 0.5, text: 'La séquence entière, d’un seul regard : suivez le curseur orange.' },
              { at: CC + 4.0, text: 'L’horloge coupe KA1 : tirage au vide, puis arrêt du compresseur.' },
              { at: CC + 8.0, text: 'Résistances, fonte du givre, fin sur la sonde B2.' },
              { at: CC + 12.0, until: CUES.LaCle, text: 'Égouttage, reprise du froid, et les ventilateurs en dernier.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesPumpDownDegivrage() {
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

  window.RegulesPumpDownDegivrage = RegulesPumpDownDegivrage;
  window.RK8 = { Cabinet: Cabinet, etat: etat, simuler: simuler, PHASES: PHASES, Sequence: Sequence };
})();
