/* Les régules · Station 9 — Le dégivrage par gaz chauds (03/10/2026)
   Commande : « Schéma de commande — dégivrage par gaz chauds » (CAP IFCA, C4) :
     Y1  = B1 θ · KA1 11-12 (NF)                    pump-down : B1 sur l'électrovanne liquide
     KM1 = HP (NF) · BP (NO)                          le compresseur suit la BP
     KM2 = KA1 25-26 (NF temporisé au repos)          ventilateurs évaporateur
     KA1 = P 13-14 · B4 θ (NF)                        relais de dégivrage (horloge P, fin B4)
     Y3  = P 13-14 · KA1 43-44                        électrovanne gaz chauds
   Principe fluidique : fiche « 3 Électricité — dégivrages par gaz chauds » (Bac Pro
   MFER, S2) : piquage sur le refoulement, électrovanne, clapet anti-retour vers le
   condenseur, té entre détendeur et évaporateur, sonde de fin, réévaporation du
   liquide à l'aspiration (bain-marie, bouteille anti-coup de liquide).
   La fiche 3 porte son propre schéma de commande, mais tel qu'il est dessiné il ne
   peut pas dégivrer compresseur en marche (KM1 23-24 tient RFD, qui bloque RD) et
   ne coupe pas les ventilateurs : la commande suit donc le schéma CAP. Le contact
   Y2 « froid » (normalement ouvert) du schéma CAP, propre à l'installation à deux
   évaporateurs du TP, n'est pas repris ; S1 à S3, Q2, Q3 et F1 à F6 non plus.
   États calculés par le solveur du kit (RK.resoudre) ; exposé en RK9. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var Chip = RK.Chip;
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
      { id: 'B1', a: 'L', b: 'a1', f: c.B1 }, { id: 'KA1_11', a: 'a1', b: 'a2', f: !c.KA1 }, { id: 'Y1c', a: 'a2', charge: true },
      { id: 'HP', a: 'L', b: 'g1', f: true }, { id: 'BP', a: 'g1', b: 'g2', f: c.BP }, { id: 'KM1c', a: 'g2', charge: true },
      { id: 'KA1_25', a: 'L', b: 'v1', f: !c.KA1_25 }, { id: 'KM2c', a: 'v1', charge: true },
      { id: 'P', a: 'L', b: 'd1', f: c.P }, { id: 'B4', a: 'd1', b: 'd2', f: !c.B4 }, { id: 'KA1c', a: 'd2', charge: true },
      { id: 'KA1_43', a: 'd1', b: 'y3', f: c.KA1 }, { id: 'Y3c', a: 'y3', charge: true }
    ];
  }

  var DELAI = 0.15, TEMPO_V = 12;   /* KA1 25-26 : se referme 12 s (film) après la retombée de KA1 */
  function evenements(CUES) {
    var M = CUES.Marche, H = CUES.Horloge, F = CUES.Fonte, R = CUES.Reprise;
    return { tB1: M + 1, tBPc: M + 3, tH: H + 1, tZero: H + 4, tFonte: F + 5, tFin: F + 9, tP2: F + 11, tR: R };
  }
  function scenario(t, e, total) {
    return {
      air: pw(t, [[0, -15.4], [e.tB1, -14.0], [e.tBPc + 0.2, -13.9], [e.tH, -16.5], [e.tFin, -15.4], [e.tFin + 6, -15.6],
                  [total, -17.8]]),
      bat: pw(t, [[0, -15.6], [e.tBPc, -15.5], [e.tBPc + 3, -24], [e.tH, -25.5], [e.tZero, 0], [e.tFonte, 0.5], [e.tFin, 10],
                  [e.tFin + 0.4, 10.2], [e.tFin + 3, -12], [e.tFin + 6, -22], [total, -25]]),
      bp: pw(t, [[0, 1.5], [e.tB1 + DELAI, 1.52], [e.tBPc, 1.8], [e.tBPc + 0.8, 2.6], [e.tBPc + 2.5, 2.35], [e.tH + DELAI, 2.3],
                 [e.tH + 1.2, 2.0], [e.tZero, 3.0], [e.tFin, 3.4], [e.tFin + 1.5, 2.5], [total, 2.3]]),
      givre: pw(t, [[0, 0], [e.tBPc, 0], [e.tH, 1], [e.tZero, 1], [e.tFonte, 0], [total, 0]]),
      gouttes: t < e.tZero ? 0 : t < e.tFin ? 1 : clamp(1 - (t - e.tFin) / 5, 0, 1),
      /* le gaz se condense dans la batterie froide : du liquide revient vers l'aspiration */
      liquide: t < e.tH + DELAI ? 0 : t < e.tFin ? clamp((t - e.tH) / 3, 0, 1) * (1 - 0.6 * clamp((t - e.tFonte) / 4, 0, 1)) : clamp(0.4 - (t - e.tFin) / 3, 0, 1),
      b1: t >= e.tB1, p: t >= e.tH && t < e.tP2
    };
  }

  var memo = {}, DT = 0.02;
  function simuler(CUES, total) {
    var cle = JSON.stringify(CUES) + '|' + total;
    if (memo[cle]) return memo[cle];
    var e = evenements(CUES), pas = [], bpF = false, b4 = false, cumK = 0, cumV = 0, ka1Lache = -1e9;
    var retard = Math.round(DELAI / DT);
    for (var i = 0, n = Math.ceil(total / DT) + 1; i < n; i++) {
      var t = i * DT, s = scenario(t, e, total);
      if (s.bp >= 1.8 - 1e-6) bpF = true; else if (s.bp <= 0.3) bpF = false;
      if (s.bat >= 10 - 1e-6) b4 = true; else if (s.bat <= -10) b4 = false;
      var avant = i >= retard ? pas[i - retard].bob : {};
      /* KA1 25-26 : s'ouvre avec KA1, ne se referme que TEMPO_V après sa retombée */
      var ka25 = !!avant.KA1 || (t - ka1Lache < TEMPO_V);
      var c = { B1: s.b1, BP: bpF, P: s.p, B4: b4, KA1: !!avant.KA1, KA1_25: ka25 };
      var r = RK.resoudre(reseau(c));
      var bob = { Y1: r.conduit.Y1c, KM1: r.conduit.KM1c, KM2: r.conduit.KM2c, KA1: r.conduit.KA1c, Y3: r.conduit.Y3c };
      if (i > 0 && pas[i - 1].bob.KA1 && !bob.KA1) ka1Lache = t + DELAI;
      if (i > 0) { cumK += pas[i - 1].bob.KM1 ? DT : 0; cumV += pas[i - 1].bob.KM2 ? DT : 0; }
      pas.push({ t: t, s: s, c: c, bob: bob, cumK: cumK, cumV: cumV });
    }
    memo[cle] = { pas: pas, ev: e };
    return memo[cle];
  }

  function etat(T, CUES, total) {
    var sim = simuler(CUES, total), e = sim.ev;
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var t0 = e.tB1 - 1, t1 = e.tFin + TEMPO_V + 3;
    var Tm = enRejeu ? t0 + (T - CUES.CycleComplet) * (t1 - t0) / (CUES.LaCle - CUES.CycleComplet) : T;
    function a(t) { return sim.pas[clamp(Math.round(t / DT), 0, sim.pas.length - 1)]; }
    var p = a(Tm);
    function lisse(f) { var m = 0; for (var k = 0; k < 5; k++) m += f(a(Tm - k * 0.05)) ? 0 : 1; return m / 5; }
    var phase = -1;
    if (p.bob.KM1 && Tm < e.tH) phase = 0;
    if (Tm >= e.tH) phase = 1;
    if (Tm >= e.tH + 1.2) phase = 2;
    if (Tm >= e.tFin) phase = 3;
    if (Tm >= e.tFin + 2.5) phase = 4;
    return {
      Tm: Tm, enRejeu: enRejeu, ev: e, c: p.c, bob: p.bob, s: p.s, phase: phase, cumK: p.cumK, cumV: p.cumV,
      ouv: function (id) { return lisse(function (q) { return reseau(q.c).filter(function (x) { return x.id === id; })[0].f; }); },
      flow: 1 - lisse(function (q) { return q.bob.KM1; }), fans: 1 - lisse(function (q) { return q.bob.KM2; }),
      gaz: 1 - lisse(function (q) { return q.bob.Y3 && q.bob.KM1; })
    };
  }

  /* ---- l'armoire ---- */
  var FILS = [
    ['M 330 300 L 330 340', 'L', ['B1']], ['M 330 490 L 330 560', 'a1', []], ['M 330 710 L 330 1121', 'a2', []], ['M 330 1179 L 330 1300', 'N', ['Y1c']],
    ['M 760 300 L 760 340', 'L', ['HP']], ['M 760 490 L 760 560', 'g1', []], ['M 760 710 L 760 1121', 'g2', []], ['M 760 1179 L 760 1300', 'N', ['KM1c']],
    ['M 1190 300 L 1190 340', 'L', ['KA1_25']], ['M 1190 490 L 1190 1121', 'v1', []], ['M 1190 1179 L 1190 1300', 'N', ['KM2c']],
    ['M 1620 300 L 1620 340', 'L', ['P']], ['M 1620 490 L 1620 520', 'd1', []], ['M 1620 520 L 1620 560', 'd1', ['B4']],
    ['M 1620 520 L 2020 520 L 2020 560', 'd1', ['KA1_43']], ['M 1620 710 L 1620 1121', 'd2', []], ['M 1620 1179 L 1620 1300', 'N', ['KA1c']],
    ['M 2020 710 L 2020 1121', 'y3', []], ['M 2020 1179 L 2020 1300', 'N', ['Y3c']]
  ];
  function Parachute(p) {
    var x = p.x, m = p.y + 75;
    return (
      <g stroke={C.wire} strokeWidth="5" fill="none" strokeLinecap="round">
        <line x1={x - 10} y1={m - 8} x2={x - 44} y2={m - 8} />
        <line x1={x - 10} y1={m + 8} x2={x - 44} y2={m + 8} />
        <path d={'M ' + (x - 44) + ' ' + (m - 24) + ' A 24 24 0 0 1 ' + (x - 44) + ' ' + (m + 24)} />
      </g>
    );
  }
  function Cabinet(p) {
    var RK2 = window.RK, e = p.e, t = p.T;
    var r = RK2.resoudre(reseau(e.c));
    function V(id) { return r.conduit[id]; }
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="2480" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · DÉGIVRAGE PAR GAZ CHAUDS</text>
        <text x="2440" y="66" textAnchor="end" fill={C.blue} fontSize="24" fontWeight="900" letterSpacing="2">D’APRÈS LE SCHÉMA DE COMMANDE CAP · C4</text>
        <g fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="3">
          <line x1="240" y1="196" x2="1400" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="820" y="180" textAnchor="middle">LE FROID</text>
          <line x1="1460" y1="196" x2="2400" y2="196" stroke={C.line} strokeWidth="4" />
          <text x="1930" y="180" textAnchor="middle">LE DÉGIVRAGE</text>
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

        <RK2.ContactV x={330} y={340} ouv={e.ouv('B1')} live={V('B1')} glyph="θ" code="B1" sub="thermostat" b1=" " b2=" " />
        <RK2.ContactV nf={true} aux={true} x={330} y={560} ouv={e.ouv('KA1_11')} live={V('KA1_11')} code="KA1" sub="coupe Y1" b1="11" b2="12" />
        <RK2.BobineV x={330} y={1150} code="Y1" sub="LIQUIDE" live={e.bob.Y1} />

        <RK2.ContactV nf={true} x={760} y={340} ouv={0} live={V('HP')} glyph="p" code="HP" sub="sécurité" b1=" " b2=" " />
        <RK2.ContactV x={760} y={560} ouv={e.ouv('BP')} live={V('BP')} glyph="p" code="BP" sub="régulation" b1=" " b2=" " />
        <RK2.BobineV x={760} y={1150} code="KM1" sub="COMPRESSEUR" live={e.bob.KM1} />

        <RK2.ContactV nf={true} aux={true} x={1190} y={340} ouv={e.ouv('KA1_25')} live={V('KA1_25')} code="KA1" sub="temporisé" b1="25" b2="26" />
        <Parachute x={1190} y={340} />
        <RK2.BobineV x={1190} y={1150} code="KM2" sub="VENTILATEURS" live={e.bob.KM2} />

        <RK2.ContactV x={1620} y={340} ouv={e.ouv('P')} live={V('P')} glyph="t" code="P" sub="horloge" />
        <RK2.ContactV nf={true} x={1620} y={560} ouv={e.ouv('B4')} live={V('B4')} glyph="θ" code="B4" sub="fin de dégivrage" b1=" " b2=" " />
        <RK2.BobineV x={1620} y={1150} code="KA1" sub="DÉGIVRAGE" live={e.bob.KA1} />
        <RK2.ContactV aux={true} x={2020} y={560} ouv={e.ouv('KA1_43')} live={V('KA1_43')} code="KA1" sub="gaz chauds" b1="43" b2="44" />
        <RK2.BobineV x={2020} y={1150} code="Y3" sub="GAZ CHAUDS" live={e.bob.Y3} />
      </g>
    );
  }

  /* ---- côté fluide : la voie de gaz chauds, le clapet, la bouteille anti-coup de liquide ---- */
  var VOIE = 'M 1900 410 L 1900 470 L 820 470 L 820 840 L 770 840';
  function GazChauds(p) {
    var g = p.gaz, T = p.T, o = p.ouverte;
    return (
      <g>
        <path d={VOIE} fill="none" stroke={C.pipe} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        <path d={VOIE} fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="30 26" strokeDashoffset={-T * 240} opacity={0.12 + 0.88 * g} />
        <circle cx="1900" cy="410" r="14" fill={C.card} stroke={C.red} strokeWidth="6" />
        <circle cx="770" cy="840" r="12" fill={C.card} stroke={C.red} strokeWidth="6" />
        <g transform="translate(1350,470)">
          <polygon points="-42,-26 -42,26 0,0" fill={o ? '#fdecea' : C.card} stroke={C.red} strokeWidth="6" />
          <polygon points="42,-26 42,26 0,0" fill={o ? '#fdecea' : C.card} stroke={C.red} strokeWidth="6" />
          <rect x="-28" y="-92" width="56" height="44" fill={o ? '#fdecea' : C.card} stroke={o ? C.red : C.blue} strokeWidth="6" />
          <line x1="0" y1="-48" x2="0" y2="-4" stroke={C.wire} strokeWidth="5" />
          <text x="0" y="68" textAnchor="middle" fill={C.red} fontSize="32" fontWeight="900">Y3</text>
          <text x="0" y="100" textAnchor="middle" fill={o ? C.red : C.mute} fontSize="24" fontWeight="800">{o ? 'GAZ CHAUDS' : 'FERMÉE'}</text>
        </g>
        <g>
          <polygon points="1775,392 1775,428 1741,410" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <line x1="1736" y1="390" x2="1736" y2="430" stroke={C.blue} strokeWidth="6" />
        </g>
        <g>
          <rect x="1668" y="636" width="64" height="124" rx="30" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <clipPath id="bacl9"><rect x="1668" y="636" width="64" height="124" rx="30" /></clipPath>
          <rect x="1668" y={760 - 90 * clamp(p.liquide, 0, 1)} width="64" height="124" fill="#5d9dcd" opacity="0.8" clipPath="url(#bacl9)" />
        </g>
        {p.chaud > 0.02 && <rect x="1092" y="852" width="552" height="316" rx="14" fill={C.red} opacity={0.12 * p.chaud} />}
      </g>
    );
  }

  /* la croix, la voie de gaz chauds et les voyants : partagé par le film et ses planches
     (planche = sans les étiquettes qui se montrent aux instants du film) */
  function Fluide(p) {
    var T = p.T, e = p.e, film = !p.planche;
    var chaud = clamp((e.s.bat + 5) / 10, 0, 1) * (e.bob.Y3 ? 1 : 0);
    return (
      <g>
        {film && <Croix T={T} />}
        <ChambreFond />
        <Pipes phase={e.cumK} flow={e.flow} flowLiquide={e.flow * (e.bob.Y1 ? 1 : 0)} />
        <GazChauds T={p.now === undefined ? T : p.now} gaz={e.gaz} ouverte={e.bob.Y3} liquide={e.s.liquide} chaud={chaud} />
        <Chambre T={film ? T : 29} temp={e.s.air} spin={e.cumV * 300} flow={e.fans} phase={e.cumV} energy={e.bob.KM1 ? 1 : 0}
                 frostU={clamp(e.s.givre, 0, 1)} liquid={e.bob.Y3 ? 0.45 * e.s.liquide + 0.1 : (e.bob.Y1 ? 0.3 : 0)} cid={film ? 's9' : 'p9'} />
        <Machine T={film ? T : 29} carter={0} spin={e.cumK * 300} flow={e.flow} phase={e.cumK} live={e.bob.Y1} />
        {film && <PipeChips T={T} />}
        {film && <CroixLabels T={T} />}
        <RK.Manometre x={2320} y={680} val={e.s.bp} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
        <rect x="2180" y="860" width="280" height="80" rx="10" fill={e.bob.KM1 ? '#fff0e9' : C.blueSoft}
              stroke={e.bob.KM1 ? C.orangeText : C.blue} strokeWidth="6" />
        <text x="2320" y="914" textAnchor="middle" fill={e.bob.KM1 ? C.orangeText : C.blue} fontSize="32" fontWeight="900">
          {e.bob.KM1 ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}
        </text>
        <rect x="2180" y="960" width="280" height="62" rx="10" fill={e.bob.Y3 ? '#fdecea' : C.card}
              stroke={e.bob.Y3 ? C.red : C.line} strokeWidth="6" />
        <text x="2320" y="1003" textAnchor="middle" fill={e.bob.Y3 ? C.red : C.mute} fontSize="28" fontWeight="900">
          {e.bob.Y3 ? 'Y3 OUVERTE' : 'Y3 FERMÉE'}
        </text>
      </g>
    );
  }

  function SondeB4(p) {
    var v = p.val;
    return (
      <g opacity={p.o}>
        <rect x="1800" y="1268" width="560" height="160" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="1828" y="1308" fill={C.orangeText} fontSize="24" fontWeight="900" letterSpacing="2">SONDE B4 · BATTERIE</text>
        <text x="1828" y="1392" fill={v > 0 ? C.red : C.blue} fontSize="66" fontWeight="900">
          {(v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',')} °C
        </text>
        <text x="2340" y="1350" textAnchor="end" fill={C.mute} fontSize="22" fontWeight="800">FIN DE</text>
        <text x="2340" y="1378" textAnchor="end" fill={C.mute} fontSize="22" fontWeight="800">DÉGIVRAGE</text>
        <text x="2340" y="1410" textAnchor="end" fill={C.red} fontSize="26" fontWeight="900">+10 °C</text>
      </g>
    );
  }

  var PHASES = [
    ['FROID', 'B1 ouvre Y1 ; la BP fait tourner KM1'],
    ['L’HORLOGE LANCE', 'P fait coller KA1'],
    ['GAZ CHAUDS', 'Y1 fermée, ventilateurs arrêtés, Y3 ouverte'],
    ['FIN SUR B4', 'KA1 retombe : Y3 se ferme, Y1 rouvre'],
    ['VENTILATEURS RETARDÉS', 'KA1 25-26 : la batterie refroidit d’abord']
  ];

  var CH = { x0: 900, x1: 3980, tFin: 60 };
  function chx(t) { return CH.x0 + (CH.x1 - CH.x0) * clamp(t / CH.tFin, 0, 1); }
  function chAir(v) { return 1780 - ((v + 19) / 6) * 110; }
  function chBat(v) { return 2290 - ((v + 28) / 40) * 130; }
  var CARRES = [['P', 1810], ['KA1', 1880], ['Y1', 1950], ['Y3', 2020], ['KM1', 2090], ['KM2', 2330]];
  function Chrono(p) {
    var CUES = p.CUES, sim = simuler(CUES, p.total), e = sim.ev;
    var air = '', bat = '', sq = {}, prec = {};
    CARRES.forEach(function (q) { sq[q[0]] = ''; });
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var q = sim.pas[Math.min(Math.round(t / DT), sim.pas.length - 1)], x = chx(t).toFixed(1);
      air += (air ? ' L ' : 'M ') + x + ' ' + chAir(q.s.air).toFixed(1);
      bat += (bat ? ' L ' : 'M ') + x + ' ' + chBat(q.s.bat).toFixed(1);
      CARRES.forEach(function (c) {
        var on = c[0] === 'P' ? q.c.P : q.bob[c[0]];
        var y = on ? c[1] : c[1] + 35;
        if (prec[c[0]] === undefined) sq[c[0]] = 'M ' + x + ' ' + y;
        else if (prec[c[0]] !== y) sq[c[0]] += ' L ' + x + ' ' + prec[c[0]] + ' L ' + x + ' ' + y;
        prec[c[0]] = y;
      });
    }
    CARRES.forEach(function (c) { sq[c[0]] += ' L ' + chx(CH.tFin) + ' ' + prec[c[0]]; });
    var r = p.T >= CUES.Chronologie ? 1 : clamp(p.T / CH.tFin, 0, 1);
    var xr = CH.x0 + (CH.x1 - CH.x0) * r;
    var couleurs = { P: C.green, KA1: C.green, Y1: C.orangeText, Y3: C.red, KM1: C.orangeText, KM2: C.blue };
    return (
      <g transform="translate(270,0)">
        <rect x="0" y="1560" width="4030" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="48" y="1636" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · LE COMPRESSEUR CHAUFFE LA BATTERIE</text>
        <rect x={chx(e.tH)} y="1660" width={chx(e.tFin) - chx(e.tH)} height="740" fill="#fdecea" opacity="0.6" />
        {[['AIR · B1', 1745], ['HORLOGE P', 1838], ['KA1', 1908], ['Y1 LIQUIDE', 1978], ['Y3 GAZ CH.', 2048], ['KM1', 2118], ['BATTERIE B4', 2240], ['KM2 VENTIL.', 2358]].map(function (l) {
          return <text key={l[1]} x="48" y={l[1]} fill={C.blue} fontSize="32" fontWeight="800">{l[0]}</text>;
        })}
        {[[-14, '−14', C.orangeText, chAir], [-18, '−18', C.blue, chAir], [10, '+10 · B4', C.red, chBat], [0, '0 °C', C.mute, chBat, true]].map(function (l, i) {
          return (
            <g key={i}>
              <line x1={CH.x0} y1={l[3](l[0])} x2={CH.x1} y2={l[3](l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={l[4] ? CH.x1 + 14 : CH.x0 - 14} y={l[3](l[0]) + 9} textAnchor={l[4] ? 'start' : 'end'} fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip9"><rect x={CH.x0 - 20} y="1650" width={xr - CH.x0 + 20} height="760" /></clipPath>
        <g clipPath="url(#chclip9)">
          <path d={air} fill="none" stroke={C.blue} strokeWidth="9" strokeLinejoin="round" />
          <path d={bat} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          {CARRES.map(function (c) {
            return <path key={c[0]} d={sq[c[0]]} fill="none" stroke={couleurs[c[0]]} strokeWidth="9" strokeLinejoin="round" />;
          })}
        </g>
        {r < 1 && <line x1={xr} y1="1660" x2={xr} y2="2400" stroke={C.orange} strokeWidth="6" opacity="0.85" />}
        {p.replay !== null && (
          <g>
            <line x1={chx(p.replay)} y1="1660" x2={chx(p.replay)} y2="2400" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replay)} cy="1660" r="16" fill={C.orange} />
          </g>
        )}
      </g>
    );
  }

  function legende(e) {
    if (e.bob.Y3 && e.bob.KM1) return 'Gaz chauds dans la batterie : le givre fond, le gaz se condense.';
    if (e.bob.KM1 && !e.bob.KM2) return 'Froid repris, ventilateurs retenus : la batterie refroidit.';
    if (e.bob.KM1) return e.s.givre > 0.3 ? 'Marche : sous 0 °C, le givre se dépose.' : 'Marche : batterie propre.';
    return 'Arrêt.';
  }

  function zones(CUES) {
    var armoire = [2540, 110, 2440, 1420], degiv = [3960, 110, 1020, 1420];
    return [
      { t: 0, r: [930, 470, 1560, 1010] }, { t: CUES.Marche, r: [2540, 110, 1420, 1420] },
      { t: CUES.Circulation, r: [330, 30, 2150, 1420] }, { t: CUES.Horloge, r: armoire },
      { t: CUES.Fonte, r: [650, 330, 1360, 880] }, { t: CUES.Fonte + 8.6, r: degiv }, { t: CUES.Reprise, r: [2540, 110, 1420, 1420] },
      { t: CUES.Chronologie, r: [250, 1540, 4080, 1000] }, { t: CUES.CycleComplet, r: null }
    ];
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal), ev = e.ev;
    var z = 1920 / (D - 260), cam = { cx: (300 + D) / 2, cy: 1420, z: z };
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var M = CUES.Marche, H = CUES.Horloge, F = CUES.Fonte, R = CUES.Reprise, Ch = CUES.Chronologie, CC = CUES.CycleComplet;
    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Fluide T={T} e={e} />
            <Chip T={T} at={ev.tH + 1.4} hold={6} x="2050" y="330" text="PIQUAGE SUR LE REFOULEMENT" sub="le gaz le plus chaud, vers la batterie" fs="30" tone={C.red} />
            <Chip T={T} at={ev.tH + 4} hold={6} x="1380" y="700" text="BOUTEILLE ANTI-COUP DE LIQUIDE" sub="le liquide condensé y est réévaporé" fs="28" tone={C.blue} />
            <SondeB4 val={e.s.bat} o={clamp((T - H + 0.4) / 0.8, 0, 1)} />
            <Cabinet T={T} e={e} />
            <RK.Etapes x={5040} y={100} w={880} h={1440} titre="LA SÉQUENCE" phases={PHASES} k={e.phase} pas={250} haut={220} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replay={e.enRejeu ? e.Tm : null} />
            <g transform="translate(4510,1560) scale(0.6667)">
              <RK.GrosPlan T={T} s={e.s} marche={e.bob.KM1 && !e.bob.Y3} chaud={e.bob.Y3} souffle={e.fans} fan="KM2"
                           legende={legende(e)} sonde="BATTERIE · SONDE B4" />
            </g>
            <RK.Surligneur T={T} zones={zones(CUES)} />
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 9 · LE DÉGIVRAGE PAR GAZ CHAUDS</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Le compresseur continue : une partie du refoulement est envoyée dans la batterie, qui dégivre de l’intérieur.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Ce n’est pas une inversion de cycle. Le gaz se condense : le liquide qui revient doit être réévaporé avant le compresseur.
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
              { at: 0.4, text: 'Une chambre froide NÉGATIVE : consigne −18 °C.' },
              { at: 2.6, text: 'L’armoire : le froid à gauche ; à droite l’horloge P, le relais KA1 et la vanne Y3.' },
              { at: M + 0.4, text: 'B1 ferme : à travers KA1 11-12, il ouvre l’électrovanne liquide Y1.' },
              { at: M + 2.6, text: 'La pression monte : la BP fait coller KM1. C’est un pump-down.' },
              { at: M + 5.0, text: 'Les ventilateurs KM2 tournent, à travers le contact 25-26 de KA1.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Repérez le piquage sur le refoulement et la vanne Y3 : fermée en froid.' },
              { at: CUES.Circulation + 7.4, text: 'Dans la batterie, le liquide s’évapore : le givre se dépose.' },
              { at: H + 0.4, text: 'L’horloge P ferme 13-14 : KA1 colle (B4 est fermé, la batterie est froide).' },
              { at: H + 2.2, text: 'KA1 11-12 s’ouvre : Y1 se ferme. KA1 25-26 s’ouvre : les ventilateurs s’arrêtent.' },
              { at: H + 4.4, text: 'KA1 43-44 ouvre Y3 : le gaz chaud du refoulement entre dans la batterie.' },
              { at: H + 7.0, text: 'Le compresseur CONTINUE : c’est lui qui fournit la chaleur. La BP reste haute.' },
              { at: H + 9.4, text: 'Le clapet empêche le retour du condenseur vers la batterie.' },
              { at: F + 0.4, text: 'La batterie est chauffée de l’intérieur : à 0 °C, le givre fond.' },
              { at: F + 3.4, text: 'Le gaz se condense dans la batterie froide : du liquide part vers l’aspiration.' },
              { at: F + 6.0, text: 'La bouteille anti-coup de liquide le réévapore : le compresseur ne reçoit que de la vapeur.' },
              { at: F + 9.0, text: 'À +10 °C, la sonde B4 ouvre : KA1 retombe.' },
              { at: F + 10.6, text: 'Y3 se ferme, Y1 se rouvre : le froid reprend aussitôt.' },
              { at: R + 0.4, text: 'KA1 25-26 est temporisé : les ventilateurs attendent encore.' },
              { at: R + 3.6, text: 'La batterie refroidit, l’eau finit de s’égoutter : rien n’est soufflé dans la chambre.' },
              { at: R + 6.4, text: 'Le délai écoulé, KA1 25-26 se referme : les ventilateurs repartent.' },
              { at: Ch + 0.4, text: 'Le chronogramme : pendant les gaz chauds, KM1 ne s’arrête pas.' },
              { at: Ch + 4.0, until: CC, text: 'Y1 et Y3 ne sont jamais ouvertes ensemble ; KM2 repart en dernier.' },
              { at: CC + 0.5, text: 'Toute la séquence, d’un seul regard : suivez le curseur orange.' },
              { at: CC + 5.0, text: 'L’horloge lance : Y1 fermée, ventilateurs arrêtés, Y3 ouverte.' },
              { at: CC + 10.0, until: CUES.LaCle, text: 'B4 termine : Y3 se ferme, le froid reprend, les ventilateurs suivent.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesGazChauds() {
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

  window.RegulesGazChauds = RegulesGazChauds;
  window.RK9 = { Cabinet: Cabinet, Fluide: Fluide, SondeB4: SondeB4, etat: etat, legende: legende, PHASES: PHASES };
})();
