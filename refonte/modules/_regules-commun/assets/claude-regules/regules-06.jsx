/* Les régules · Station 6 — Sans dégivrage commandé (03/10/2026)
   Source : fiche « 6.1 Électricité — dégivrage naturel » (Bac Pro MFER, S2),
   premier principe, schéma page 2 :
     M1 (groupe) et Y1 (EVR) = B1 θ (1-4) · BP (1-4) · HP (1-2)     commande directe
     M2 (ventilateur évaporateur) = permanent
   « Quand le compresseur est coupé par le thermostat B1, la ventilation de l'air
   ambiant à +3 °C sur l'évaporateur suffit le plus souvent à assurer le dégivrage » ;
   les phases de dégivrage dépendent directement du temps d'arrêt. Le film montre
   les deux cas : arrêt long, le givre fond ; arrêts trop courts, il s'accumule.
   (La fiche nomme le BP B2 et le HP B3 : ils gardent ici leur nom de pressostat.)
   États calculés par le solveur du kit (RK.resoudre) ; exposé en RK6. */
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
      { id: 'B1', a: 'L', b: 'a1', f: c.B1 }, { id: 'BP', a: 'a1', b: 'a2', f: true }, { id: 'HP', a: 'a2', b: 'g', f: true },
      { id: 'M1c', a: 'g', charge: true }, { id: 'Y1c', a: 'g', charge: true },
      { id: 'M2c', a: 'L', charge: true }
    ];
  }

  /* le scénario : l'air de la chambre décide de B1 (enclenche à +4, coupe à +2) */
  function evenements(CUES) {
    var M = CUES.Marche, A = CUES.Arret, L = CUES.Limite;
    return { tB1: M + 1, tArr: A + 1, tFonte0: A + 3, tFonte1: A + 7, tL: L,
             on1: [L, L + 3.5], on2: [L + 5, L + 9], on3: [L + 10.3, 1e9], tPrise: L + 12 };
  }
  function scenario(t, e, total) {
    var L = e.tL;
    return {
      air: pw(t, [[0, 3.6], [e.tB1, 4.0], [e.tB1 + 2, 3.9], [e.tArr, 2.0], [L, 4.0], [L + 3.5, 2.0], [L + 5, 4.0],
                  [L + 9, 2.0], [L + 10.3, 4.0], [L + 13, 2.9], [total, 2.9]]),
      bat: pw(t, [[0, 3.0], [e.tB1, 3.0], [e.tB1 + 2, -6], [e.tArr, -6.5], [e.tFonte0, 0], [e.tFonte1, 0.3], [L - 2, 2.0],
                  [L, 2.4], [L + 1.5, -6], [L + 3.5, -6.5], [L + 5, -1.0], [L + 6.5, -7], [L + 9, -7.5], [L + 10.3, -1.5],
                  [L + 12, -8.5], [L + 15, -9.5], [total, -9.5]]),
      givre: pw(t, [[0, 0], [e.tB1 + 2, 0], [e.tArr, 1.0], [e.tFonte0, 1.0], [e.tFonte1, 0], [L, 0], [L + 3.5, 0.45],
                    [L + 5, 0.45], [L + 9, 0.9], [L + 10.3, 0.9], [L + 15, 1.4], [total, 1.4]]),
      gouttes: t < e.tFonte0 ? 0 : t < e.tFonte1 ? 1 : clamp(1 - (t - e.tFonte1) / 1.5, 0, 1),
      porte: t >= L && t < L + 12 ? 1 : 0
    };
  }

  var memo = {}, DT = 0.02;
  function simuler(CUES, total) {
    var cle = JSON.stringify(CUES) + '|' + total;
    if (memo[cle]) return memo[cle];
    var e = evenements(CUES), pas = [], b1 = false, cum = 0;
    for (var i = 0, n = Math.ceil(total / DT) + 1; i < n; i++) {
      var t = i * DT, s = scenario(t, e, total);
      if (s.air >= 4.0 - 1e-6) b1 = true; else if (s.air <= 2.0 + 1e-6) b1 = false;
      var c = { B1: b1 };
      var r = RK.resoudre(reseau(c));
      var bob = { M1: r.conduit.M1c, Y1: r.conduit.Y1c, M2: r.conduit.M2c };
      if (i > 0 && pas[i - 1].bob.M1) cum += DT;
      pas.push({ t: t, s: s, c: c, bob: bob, cum: cum });
    }
    memo[cle] = { pas: pas, ev: e };
    return memo[cle];
  }

  function etat(T, CUES, total) {
    var sim = simuler(CUES, total), e = sim.ev;
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var t0 = e.tB1 - 1, t1 = e.tL + 15;
    var Tm = enRejeu ? t0 + (T - CUES.CycleComplet) * (t1 - t0) / (CUES.LaCle - CUES.CycleComplet) : T;
    function a(t) { return sim.pas[clamp(Math.round(t / DT), 0, sim.pas.length - 1)]; }
    var p = a(Tm);
    function lisse(f) { var m = 0; for (var k = 0; k < 5; k++) m += f(a(Tm - k * 0.05)) ? 0 : 1; return m / 5; }
    var phase = -1;
    if (Tm >= e.tB1 && Tm < e.tArr) phase = 0;
    if (Tm >= e.tArr && Tm < e.tL) phase = 1;
    if (Tm >= e.tL) phase = Tm < e.tPrise ? 2 : 3;
    return { Tm: Tm, enRejeu: enRejeu, ev: e, c: p.c, bob: p.bob, s: p.s, phase: phase, cum: p.cum,
             ouvB1: lisse(function (q) { return q.c.B1; }), flow: 1 - lisse(function (q) { return q.bob.M1; }) };
  }

  /* ---- l'armoire ---- */
  var FILS = [
    ['M 330 300 L 330 340', 'L', ['B1']], ['M 330 490 L 330 560', 'a1', []], ['M 330 710 L 330 780', 'a2', []],
    ['M 330 930 L 330 960', 'g', []], ['M 330 960 L 330 1044', 'g', ['M1c']], ['M 330 960 L 760 960 L 760 1071', 'g', ['Y1c']],
    ['M 330 1156 L 330 1300', 'N', ['M1c']], ['M 760 1129 L 760 1300', 'N', ['Y1c']],
    ['M 1180 300 L 1180 1044', 'L', ['M2c']], ['M 1180 1156 L 1180 1300', 'N', ['M2c']]
  ];
  function Cabinet(p) {
    var RK2 = window.RK, e = p.e, t = p.T;
    var r = RK2.resoudre(reseau(e.c));
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="1500" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · COMMANDE DIRECTE</text>
        <text x="40" y="108" fill={C.blue} fontSize="24" fontWeight="900" letterSpacing="2">D’APRÈS LA FICHE 6.1 · PREMIER PRINCIPE</text>
        <line x1="170" y1="128" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="1400" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="1300" x2="1400" y2="1300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="1312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {FILS.map(function (f, i) { return <path key={i} d={f[0]} />; })}
        </g>
        {FILS.map(function (f, i) { return <RK2.Potentiel key={i} d={f[0]} mode={RK2.modeFil(r, f[1], f[2])} t={t} />; })}
        <RK2.ContactV x={330} y={340} ouv={e.ouvB1} live={r.conduit.B1} glyph="θ" code="B1" sub="thermostat" b1="1" b2="4" />
        <RK2.ContactV x={330} y={560} ouv={0} live={r.conduit.BP} glyph="p" code="BP" sub="sécurité" b1="1" b2="4" />
        <RK2.ContactV nf={true} x={330} y={780} ouv={0} live={r.conduit.HP} glyph="p" code="HP" sub="sécurité" b1="1" b2="2" />
        <RK2.MoteurV x={330} y={1100} code="M1" sub="GROUPE" live={e.bob.M1} />
        <RK2.BobineV x={760} y={1100} code="Y1" sub="ÉLECTROVANNE" live={e.bob.Y1} />
        <RK2.MoteurV x={1180} y={1100} code="M2" sub="VENTILATEUR" live={e.bob.M2} />
        <text x="1214" y="420" fill={C.green} fontSize="26" fontWeight="900">AUCUN CONTACT :</text>
        <text x="1214" y="454" fill={C.green} fontSize="26" fontWeight="900">IL TOURNE</text>
        <text x="1214" y="488" fill={C.green} fontSize="26" fontWeight="900">EN PERMANENCE</text>
      </g>
    );
  }

  /* ---- la batterie en gros plan (kit), placée à droite de l'armoire ---- */
  function GrosPlan(p) {
    var s = p.s, g = s.givre, froid = p.marche;
    var legende = froid ? (g > 0.85 ? 'Batterie prise : l’air passe mal.' : 'Marche : sous 0 °C, le givre se dépose.')
                        : (s.gouttes > 0.3 ? 'Arrêt : l’air la réchauffe, le givre fond.' : (g > 0.3 ? 'Arrêt trop court : le givre reste.' : 'Batterie propre.'));
    return (
      <g transform="translate(4060,100)">
        <RK.GrosPlan T={p.T} s={s} marche={froid} porte={p.porte} legende={legende} />
      </g>
    );
  }

  var PHASES = [
    ['MARCHE', 'B1 alimente M1 et Y1 : sous 0 °C, le givre se dépose'],
    ['ARRÊT LONG', 'M2 tourne toujours : l’air à +3 °C fait fondre le givre'],
    ['ARRÊTS TROP COURTS', 'le givre n’a pas le temps de fondre : il s’accumule'],
    ['BATTERIE PRISE', 'l’air passe mal : il faut un dégivrage commandé']
  ];

  var CH = { x0: 900, x1: 4020, tFin: 53 };
  function chx(t) { return CH.x0 + (CH.x1 - CH.x0) * clamp(t / CH.tFin, 0, 1); }
  function chAir(v) { return 1820 - ((v - 1) / 4) * 140; }
  function chBat(v) { return 2140 - ((v + 10) / 15) * 150; }
  function chGivre(v) { return 2330 - clamp(v / 1.4, 0, 1) * 130; }
  function Chrono(p) {
    var CUES = p.CUES, sim = simuler(CUES, p.total), e = sim.ev;
    var air = '', bat = '', givre = '', m1 = '', prec = null;
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var q = sim.pas[Math.min(Math.round(t / DT), sim.pas.length - 1)], x = chx(t).toFixed(1);
      air += (air ? ' L ' : 'M ') + x + ' ' + chAir(q.s.air).toFixed(1);
      bat += (bat ? ' L ' : 'M ') + x + ' ' + chBat(q.s.bat).toFixed(1);
      givre += (givre ? ' L ' : 'M ') + x + ' ' + chGivre(q.s.givre).toFixed(1);
      var y = q.bob.M1 ? 1880 : 1930;
      if (prec === null) m1 = 'M ' + x + ' ' + y;
      else if (prec !== y) m1 += ' L ' + x + ' ' + prec + ' L ' + x + ' ' + y;
      prec = y;
    }
    m1 += ' L ' + chx(CH.tFin) + ' ' + prec;
    var r = p.T >= CUES.Chronologie ? 1 : clamp(p.T / CH.tFin, 0, 1);
    var xr = CH.x0 + (CH.x1 - CH.x0) * r;
    return (
      <g transform="translate(270,0)">
        <rect x="0" y="1560" width="4090" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="48" y="1636" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · UN ARRÊT LONG, PUIS DES ARRÊTS TROP COURTS</text>
        <rect x={chx(e.tL)} y="1660" width={chx(CH.tFin) - chx(e.tL)} height="840" fill={C.red} opacity="0.05" />
        {[['AIR · B1', 1770], ['M1 · Y1', 1915], ['BATTERIE', 2075], ['GIVRE', 2280], ['M2 · VENTIL.', 2440]].map(function (l) {
          return <text key={l[1]} x="48" y={l[1]} fill={C.blue} fontSize="36" fontWeight="800">{l[0]}</text>;
        })}
        {[[4, '+4 · enclenche', C.orangeText, chAir], [2, '+2 · coupe', C.blue, chAir], [0, '0 °C', C.red, chBat]].map(function (l, i) {
          return (
            <g key={i}>
              <line x1={CH.x0} y1={l[3](l[0])} x2={CH.x1} y2={l[3](l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={CH.x0 - 14} y={l[3](l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip6"><rect x={CH.x0 - 20} y="1650" width={xr - CH.x0 + 20} height="860" /></clipPath>
        <g clipPath="url(#chclip6)">
          <path d={air} fill="none" stroke={C.blue} strokeWidth="9" strokeLinejoin="round" />
          <path d={m1} fill="none" stroke={C.orangeText} strokeWidth="9" strokeLinejoin="round" />
          <path d={bat} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          <path d={givre + ' L ' + chx(CH.tFin) + ' 2330 L ' + CH.x0 + ' 2330 Z'} fill="#c9e0f2" stroke="#7fa8cc" strokeWidth="6" />
          <path d={'M ' + CH.x0 + ' 2420 L ' + CH.x1 + ' 2420'} fill="none" stroke={C.green} strokeWidth="9" />
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

  function zones(CUES) {
    var grosPlan = [4070, 110, 1840, 1420];
    return [
      { t: 0, r: [930, 470, 1560, 1010] }, { t: CUES.Marche, r: [2540, 110, 1480, 1420] },
      { t: CUES.Circulation, r: [330, 30, 2150, 1420] }, { t: CUES.Arret, r: grosPlan },
      { t: CUES.Limite, r: grosPlan }, { t: CUES.Chronologie, r: [250, 1540, 5690, 1000] },
      { t: CUES.CycleComplet, r: null }
    ];
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal), ev = e.ev;
    var z = 1920 / (D - 260), cam = { cx: (300 + D) / 2, cy: 1420, z: z };
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var M = CUES.Marche, A = CUES.Arret, L = CUES.Limite, Ch = CUES.Chronologie, CC = CUES.CycleComplet;
    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond titre="CHAMBRE POSITIVE · BOISSONS" />
            <Pipes phase={e.cum} flow={e.flow} />
            <Chambre T={T} temp={e.s.air} spin={T * 300} flow={1} phase={T} energy={e.bob.M1 ? 1 : 0}
                     frostU={clamp(e.s.givre, 0, 1)} liquid={e.bob.M1 ? 0.3 : 0} cid="s6"
                     seuil={3.5} consigne="CONSIGNE +2 · ENCLENCHEMENT +4" />
            <Machine T={T} carter={0} spin={e.cum * 300} flow={e.flow} phase={e.cum} live={e.bob.Y1} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <Cabinet T={T} e={e} />
            <GrosPlan T={T} s={e.s} marche={e.bob.M1} porte={e.s.porte} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replay={e.enRejeu ? e.Tm : null} />
            <RK.Etapes x={4400} y={1560} titre="CE QUI DÉCIDE" phases={PHASES} k={e.phase} pas={190} haut={160} />
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 6 · SANS DÉGIVRAGE COMMANDÉ</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Pas de dégivrage commandé ne veut pas dire pas de fonte : pendant l’arrêt, l’air de la chambre fait fondre le givre.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Si les arrêts sont trop courts, le givre s’accumule : il faut alors un dégivrage commandé (station 7).
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
              { at: 0.4, text: 'Une chambre froide POSITIVE : boissons emballées, air à +3 °C, peu d’humidité.' },
              { at: 3.0, text: 'Le schéma : B1, la BP et la HP commandent le groupe M1 et l’électrovanne Y1.' },
              { at: M + 0.4, text: 'B1 ferme : le groupe M1 et l’électrovanne Y1 sont alimentés ensemble.' },
              { at: M + 3.0, text: 'Le ventilateur M2 n’a aucun contact : il tourne en permanence.' },
              { at: M + 5.5, text: 'Ni horloge, ni résistance : rien n’est prévu pour le dégivrage.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Le condenseur rend la chaleur à l’extérieur : la vapeur redevient liquide.' },
              { at: CUES.Circulation + 7.4, text: 'La batterie descend sous 0 °C : l’humidité de l’air s’y dépose en givre.' },
              { at: A + 0.4, text: 'L’air atteint la consigne : B1 ouvre, M1 et Y1 s’arrêtent.' },
              { at: A + 2.4, text: 'M2 continue : l’air de la chambre, à +2 °C, passe sur la batterie.' },
              { at: A + 4.6, text: 'La batterie remonte à 0 °C : le givre fond, l’eau s’écoule.' },
              { at: A + 8.0, text: 'Arrêt assez long : batterie propre au redémarrage. C’est le dégivrage naturel.' },
              { at: L + 0.4, text: 'Une chambre très sollicitée : portes ouvertes, produits chauds.' },
              { at: L + 3.6, text: 'B1 ouvre… et referme presque aussitôt : l’arrêt est trop court.' },
              { at: L + 6.2, text: 'La batterie n’a pas le temps de dépasser 0 °C : le givre reste.' },
              { at: L + 9.4, text: 'Le givre s’accumule cycle après cycle : l’air passe mal, l’échange chute.' },
              { at: L + 12.2, text: 'La chambre ne descend plus à la consigne : il faut un dégivrage commandé.' },
              { at: Ch + 0.4, text: 'Le chronogramme : la courbe du givre retombe pendant l’arrêt long…' },
              { at: Ch + 4.0, until: CC, text: '… et monte en escalier quand les arrêts sont trop courts.' },
              { at: CC + 0.5, text: 'Toute l’histoire, d’un seul regard : suivez le curseur orange.' },
              { at: CC + 5.0, text: 'Marche : le givre se dépose. Arrêt long : l’air le fait fondre.' },
              { at: CC + 10.0, until: CUES.LaCle, text: 'Arrêts trop courts : le givre s’accumule, l’échange s’effondre.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesSansDegivrage() {
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

  window.RegulesSansDegivrage = RegulesSansDegivrage;
  window.RK6 = { Cabinet: Cabinet, GrosPlan: GrosPlan, etat: etat, PHASES: PHASES };
})();
