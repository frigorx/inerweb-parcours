/* Les régules · Station 4 — Le pump-down amélioré
   Source : « Les types de régulation froid » (support prof F. Henninot),
   § tirage au vide unique — B1 → KA ; KA 13-14 → Y1 ;
   HP + BP B2 + (KA 43-44 // KM1 13-14) → KM1. Le relais KA garde la
   demande, l'auto-maintien KM1 13-14 finit le tirage, une remontée de BP
   seule ne relance plus rien. Même kit et même découpage que les films 3 et 5. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var Manometre = RK.Manometre;

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

  function Cabinet(p) {
    var RK2 = window.RK;
    /* Schéma VERTICAL, trois colonnes : B1 → KA ; KA 13-14 → Y1 ;
       HP, BP puis les deux contacts en parallèle (KA 43-44, KM1 13-14) → KM1.
       Rouge = phase, orange = retour neutre. Les potentiels se déduisent de
       l'état des contacts, tronçon par tronçon. */
    var ouvB1 = clamp(-p.arm / 30, 0, 1);
    var b1 = ouvB1 < 0.5;
    var bp = p.bpC, ka = p.kaC, kmc = p.kmC;
    var km = p.kmLive;
    /* le nœud entre la BP et les deux contacts en parallèle */
    var haut = km ? 'courant' : (bp ? 'phase' : ((ka || kmc) ? 'retour' : 'off'));
    var c3 = {
      amont: km ? 'courant' : 'phase',
      noeud: haut,
      versKA: km ? (ka ? 'courant' : 'phase') : haut,
      versKM: km ? (kmc ? 'courant' : 'phase') : haut,
      sousKA: km ? (ka ? 'courant' : 'phase') : 'retour',
      sousKM: km ? (kmc ? 'courant' : 'phase') : 'retour',
      bas: km ? 'courant' : 'retour'
    };
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="2200" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · PUMP-DOWN AMÉLIORÉ</text>
        <text x="2160" y="66" textAnchor="end" fill={C.blue} fontSize="26" fontWeight="900" letterSpacing="2">UN RELAIS GARDE LA DEMANDE</text>

        <line x1="170" y1="104" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="2030" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="1300" x2="2030" y2="1300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="1312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        {/* colonne 1 : le thermostat commande le relais de demande */}
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M 480 300 L 480 780" />
          <path d="M 480 930 L 480 1041" />
          <path d="M 480 1099 L 480 1300" />
        </g>
        <RK2.Potentiel d="M 480 300 L 480 780" mode={b1 ? 'courant' : 'phase'} t={p.T} />
        <RK2.Potentiel d="M 480 930 L 480 1041" mode={b1 ? 'courant' : 'retour'} t={p.T} />
        <RK2.Potentiel d="M 480 1099 L 480 1300" mode={b1 ? 'courant' : 'retour'} t={p.T} />
        <RK2.ContactV x={480} y={780} ouv={ouvB1} live={b1} glyph="θ" code="B1" sub="thermostat" />
        <RK2.BobineV x={480} y={1070} code="KA" sub="RELAIS DE DEMANDE" live={b1} />

        {/* colonne 2 : le contact KA 13-14 commande l'électrovanne */}
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M 1030 300 L 1030 780" />
          <path d="M 1030 930 L 1030 1041" />
          <path d="M 1030 1099 L 1030 1300" />
        </g>
        <RK2.Potentiel d="M 1030 300 L 1030 780" mode={ka ? 'courant' : 'phase'} t={p.T} />
        <RK2.Potentiel d="M 1030 930 L 1030 1041" mode={ka ? 'courant' : 'retour'} t={p.T} />
        <RK2.Potentiel d="M 1030 1099 L 1030 1300" mode={ka ? 'courant' : 'retour'} t={p.T} />
        <RK2.ContactV aux={true} x={1030} y={780} ouv={ka ? 0 : 1} live={ka} code="KA" sub="contact du relais" />
        <RK2.BobineV x={1030} y={1070} code="Y1" sub="ÉLECTROVANNE" live={ka} />

        {/* colonne 3 : le compresseur — HP, BP, puis demande OU auto-maintien */}
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M 1640 300 L 1640 360" />
          <path d="M 1640 510 L 1640 560" />
          <path d="M 1640 710 L 1640 745" />
          <path d="M 1640 745 L 1640 780" />
          <path d="M 1640 745 L 1940 745 L 1940 780" />
          <path d="M 1640 930 L 1640 960" />
          <path d="M 1940 930 L 1940 960 L 1640 960" />
          <path d="M 1640 960 L 1640 1041" />
          <path d="M 1640 1099 L 1640 1300" />
        </g>
        <RK2.Potentiel d="M 1640 300 L 1640 360" mode={c3.amont} t={p.T} />
        <RK2.Potentiel d="M 1640 510 L 1640 560" mode={c3.amont} t={p.T} />
        <RK2.Potentiel d="M 1640 710 L 1640 745" mode={c3.noeud} t={p.T} />
        <RK2.Potentiel d="M 1640 745 L 1640 780" mode={c3.versKA} t={p.T} />
        <RK2.Potentiel d="M 1640 745 L 1940 745 L 1940 780" mode={c3.versKM} t={p.T} />
        <RK2.Potentiel d="M 1640 930 L 1640 960" mode={c3.sousKA} t={p.T} />
        <RK2.Potentiel d="M 1940 930 L 1940 960 L 1640 960" mode={c3.sousKM} t={p.T} />
        <RK2.Potentiel d="M 1640 960 L 1640 1041" mode={c3.bas} t={p.T} />
        <RK2.Potentiel d="M 1640 1099 L 1640 1300" mode={c3.bas} t={p.T} />
        <RK2.ContactV nf={true} x={1640} y={360} ouv={0} live={km} glyph="p" code="HP" sub="sécurité · NF" />
        <RK2.ContactV x={1640} y={560} ouv={bp ? 0 : 1} live={km} glyph="p" code="BP" sub="régulation · NO" />
        <RK2.ContactV aux={true} x={1640} y={780} ouv={ka ? 0 : 1} live={km && ka} code="KA" sub="demande" b1="43" b2="44" />
        <RK2.ContactV aux={true} x={1940} y={780} ouv={kmc ? 0 : 1} live={km && kmc} code="KM1" sub="auto-maintien" />
        <RK2.BobineV x={1640} y={1070} code="KM1" sub="COMPRESSEUR" live={km} />
        {/* liaison mécanique : la bobine KM1 manœuvre son propre contact 13-14 */}
        <path d="M 1680 1099 L 1680 1150 L 2170 1150 L 2170 800 L 1952 800"
              fill="none" stroke={C.green} strokeWidth="5" strokeDasharray="18 12" opacity="0.85" />
        <text x="2160" y="1200" textAnchor="end" fill={C.green} fontSize="24" fontWeight="900" letterSpacing="1.5">
          KM1 SE TIENT LUI-MÊME
        </text>

        {!b1 && (
          <text x="516" y="1230" fill={C.orangeText} fontSize="26" fontWeight="800" opacity="0.9">retour neutre</text>
        )}
        {!km && (
          <text x="1676" y="1262" fill={C.orangeText} fontSize="26" fontWeight="800" opacity="0.9">retour neutre</text>
        )}
        <g opacity={p.tenue}>
          <rect x="1440" y="1350" width="720" height="62" rx="10" fill={C.card} stroke={C.green} strokeWidth="4" />
          <text x="1800" y="1392" textAnchor="middle" fill={C.green} fontSize="30" fontWeight="900">LA BP SEULE NE SUFFIT PLUS</text>
        </g>
      </g>
    );
  }

  var CH = { x0: 700, x1: 2420, tempTop: 1990, tempBot: 2180 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chTemp(v) { return CH.tempTop + ((-13 - v) / 6) * (CH.tempBot - CH.tempTop); }
  function chBp(v) { return 2490 - clamp(v / 3, 0, 1) * 120; }

  function Chrono(p) {
    var r = MOTION.draw(38.25, 4.6)(p.T);
    var tempPts = [[0, -15.4], [0.10, -14], [0.42, -18], [0.50, -17.6], [0.75, -16.2], [1, -14.8]];
    var bpPts = [[0, 1.55], [0.10, 1.6], [0.14, 1.8], [0.17, 2.6], [0.22, 2.35], [0.42, 2.25], [0.50, 0.30],
                 [0.62, 0.5], [0.80, 1.8], [1, 2.15]];
    var tempPath = tempPts.map(function (q, i) { return (i ? 'L ' : 'M ') + chx(q[0]) + ' ' + chTemp(q[1]); }).join(' ');
    var bpPath = bpPts.map(function (q, i) { return (i ? 'L ' : 'M ') + chx(q[0]) + ' ' + chBp(q[1]); }).join(' ');
    function square(hi, lo, spans) {
      var d = 'M ' + chx(0) + ' ' + lo;
      spans.forEach(function (sp) {
        d += ' L ' + chx(sp[0]) + ' ' + lo + ' L ' + chx(sp[0]) + ' ' + hi + ' L ' + chx(sp[1]) + ' ' + hi + ' L ' + chx(sp[1]) + ' ' + lo;
      });
      return d + ' L ' + chx(1) + ' ' + lo;
    }
    var note = clamp((p.T - 41.6) / 0.6, 0, 1);
    return (
      /* Le graphique vit SOUS les deux schémas (brief du 22/08). */
      <g transform="translate(200,-300)">
        <rect x="70" y="1860" width="2470" height="820" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · UN TIRAGE AU VIDE, PAS DE COURT CYCLE</text>
        {[['AIR DE LA', 2060], ['CHAMBRE', 2106], ['B1 · KA · Y1', 2296], ['PRESSION BP', 2440], ['KM1', 2586]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="38" fontWeight="800">{l[0]}</text>;
        })}
        <rect x={chx(0.58)} y="2230" width={chx(1) - chx(0.58)} height="400" fill={C.green} opacity="0.07" />
        {[[-14, '−14 · enclenchement'], [-18, '−18 · consigne']].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chTemp(l[0])} x2={CH.x1} y2={chTemp(l[0])} stroke={C.line} strokeWidth="3" strokeDasharray="14 12" />
              <text x={CH.x0} y={chTemp(l[0]) - 14} fill={C.mute} fontSize="28" fontWeight="700">{l[1]}</text>
            </g>
          );
        })}
        {[[1.8, '1,8 bar', C.orangeText], [0.3, '0,3 bar', C.blue]].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chBp(l[0])} x2={CH.x1} y2={chBp(l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={CH.x0 - 14} y={chBp(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="26" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip4">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="700" />
        </clipPath>
        <g clipPath="url(#chclip4)">
          <path d={tempPath} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2250, 2330, [[0.10, 0.42]])} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={bpPath} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          <path d={square(2540, 2620, [[0.14, 0.50]])} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2630" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        {/* Pendant la scène CycleComplet, le curseur suit le cycle rejoué. */}
        {p.replayF > 0 && (
          <g>
            <line x1={chx(p.replayF)} y1="1960" x2={chx(p.replayF)} y2="2630" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replayF)} cy="1960" r="16" fill={C.orange} />
          </g>
        )}
        <g opacity={note}>
          <text x={chx(0.30)} y="2662" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">KM1 TIENT JUSQU’AU BOUT DU TIRAGE</text>
          <text x={chx(0.80)} y="2662" textAnchor="middle" fill={C.green} fontSize="34" fontWeight="900">1,8 BAR DÉPASSÉ · KM1 NE RECOLLE PAS</text>
        </g>
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var tB1c = CUES.Fermeture + 1.2;      /* B1 ferme : la bobine KA est alimentée */
    var tKAc = tB1c + 0.4;                /* les contacts de KA se ferment : Y1 s'ouvre */
    var tBPc = CUES.Fermeture + 3.4;      /* 1,8 bar : la BP ferme, KM1 colle */
    var tB1o = CUES.Consigne + 1.4;       /* consigne : B1 ouvre, KA retombe */
    var tKMo = CUES.Consigne + 5.6;       /* 0,3 bar : la BP ouvre, KM1 tombe */
    var tBPr = CUES.SansCourtCycle + 4.4; /* 1,8 bar à l'arrêt : la BP referme */

    /* Scène CycleComplet : la séquence nominale se REJOUE en plan large.
       La remontée finale et l'habillage restent au temps réel, donc éteints. */
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var kRejeu = (tKMo + 3 - (tB1c - 1)) / 16;
    var Tm = enRejeu ? (tB1c - 1) + (T - CUES.CycleComplet) * kRejeu : T;

    var kaC = Tm >= tKAc && Tm < tB1o + 0.2;
    var bpC = (Tm >= tBPc && Tm < tKMo) || Tm >= tBPr;
    var kmC = Tm >= tBPc + 0.3 && Tm < tKMo + 0.2;
    var kmLive = bpC && (kaC || kmC);
    var y1Live = kaC;

    var flow = Tm < tBPc ? 0 : (Tm < tKMo ? clamp((Tm - tBPc) / 0.9, 0, 1) : clamp(1 - (Tm - tKMo) / 0.7, 0, 1));
    var phase = clamp(Tm, tBPc, tKMo) - tBPc;
    var energy = kmLive ? 1 : 0;

    var temp = pw(Tm, [[0, -15.4], [tB1c, -14.0], [tB1o, -18.0], [c.authoredTotal, -14.8]]);
    var bp = pw(Tm, [[0, 1.55], [tKAc, 1.58], [tBPc, 1.8], [tBPc + 0.8, 2.6], [tBPc + 2.2, 2.35], [tB1o, 2.25],
                    [tB1o + 1.6, 1.0], [tKMo, 0.30], [CUES.SansCourtCycle + 1.5, 0.5], [tBPr, 1.80],
                    [CUES.SansCourtCycle + 6.6, 2.05], [c.authoredTotal, 2.15]]);

    var charge = Tm < tKAc ? 0
      : (Tm < tB1o ? clamp((Tm - tKAc) / 1.2, 0, 1) * 0.34
        : 0.34 * clamp(1 - (Tm - tB1o) / (tKMo - tB1o), 0, 1));
    var frostU = clamp((clamp(Tm, tKAc, tB1o) - tKAc) / (tB1o - tKAc), 0, 1);
    var arm = Tm < tB1c ? -30
      : (Tm < tB1o ? -30 + 30 * clamp(MOTION.pop(tB1c)(Tm), 0, 1.08) : -30 * clamp((Tm - tB1o) / 0.18, 0, 1));
    var replayF = enRejeu
      ? pw(Tm, [[tB1c - 1, 0.08], [tB1c, 0.10], [tBPc, 0.14], [tB1o, 0.42], [tKMo, 0.50], [tKMo + 3, 0.52]])
      : 0;

    var cam = RK.camFixed(T, 4720); /* plan général permanent, le Spot guide l'œil */
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var propre = clamp((T - CUES.SansCourtCycle - 0.4) / 0.7, 0, 1) * clamp(1 - (T - CUES.SansCourtCycle - 3.6) / 0.6, 0, 1);
    var tenue = clamp((T - CUES.SansCourtCycle - 4.4) / 0.6, 0, 1) * clamp(1 - (T - CUES.Chronologie + 0.4) / 0.6, 0, 1);

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond />
            <Pipes phase={phase} flow={flow} />
            <Chambre T={T} temp={temp} spin={phase * 300} flow={flow} phase={phase} energy={energy}
                     frostU={frostU} liquid={charge} cid="s4" />
            <Machine T={T} carter={0} spin={phase * 300} flow={flow} phase={phase} live={y1Live} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <g opacity={clamp((T - 14.6) / 0.8, 0, 1)}>
              <Manometre x={2320} y={680} val={bp} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
              <rect x="2180" y="860" width="280" height="80" rx="10" fill={kaC ? '#e4f2ec' : C.blueSoft}
                    stroke={kaC ? C.green : C.blue} strokeWidth="6" />
              <text x="2320" y="914" textAnchor="middle" fill={kaC ? C.green : C.blue} fontSize="32" fontWeight="900">
                {kaC ? 'KA ALIMENTÉ' : 'KA AU REPOS'}
              </text>
              <rect x="2180" y="960" width="280" height="80" rx="10" fill={kmLive ? '#fff0e9' : C.blueSoft}
                    stroke={kmLive ? C.orangeText : C.blue} strokeWidth="6" />
              <text x="2320" y="1014" textAnchor="middle" fill={kmLive ? C.orangeText : C.blue} fontSize="32" fontWeight="900">
                {kmLive ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}
              </text>
            </g>
            <Cabinet T={T} arm={arm} bpC={bpC} kaC={kaC} kmC={kmC} kmLive={kmLive} tenue={tenue} />
            <Chrono T={T} replayF={replayF} />
            <RK.Spot T={T} V={RK.camPaliers(4720)} cam={cam} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '17%', opacity: propre * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 32px ' + font, letterSpacing: 2 }}>ÉVAPORATEUR VIDÉ · RIEN NE MIGRE</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>le tirage au vide a fait le travail avant l’arrêt</div>
        </div>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '17%', opacity: tenue * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 32px ' + font, letterSpacing: 2 }}>1,8 BAR DÉPASSÉ · KM1 RESTE AU REPOS</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>ni demande (KA), ni auto-maintien (KM1) : pas de court cycle</div>
        </div>

        <div style={{ position: 'absolute', inset: 0, background: C.paper, opacity: keyIn * 0.58, pointerEvents: 'none' }} />

        <div style={{
          position: 'absolute', left: '6%', right: '6%', top: '7%', opacity: keyIn,
          transform: 'translateY(' + (1 - keyIn) * -26 + 'px)', pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,253,248,0.95)', border: '3px solid ' + C.blue, borderLeft: '16px solid ' + C.orange,
            borderRadius: 18, padding: '26px 38px', boxShadow: '0 18px 50px rgba(27,58,99,0.18)'
          }}>
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 4 · LE PUMP-DOWN AMÉLIORÉ</div>
            <div style={{ color: C.blue, font: '900 54px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Le relais KA garde la demande ; KM1 se tient seul jusqu’au bout du tirage.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Une remontée de BP ne suffit plus : sans demande du thermostat, le compresseur ne repart pas.
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
              { at: 3.2, text: 'Trois colonnes : B1 commande le relais KA, KA commande Y1 et autorise KM1.' },
              { at: CUES.Fermeture + 0.4, text: 'Le thermostat ferme : le relais KA colle, la demande de froid est gardée.' },
              { at: CUES.Fermeture + 2.0, text: 'KA ferme son contact 13-14 : Y1 s’ouvre, la pression d’aspiration monte.' },
              { at: CUES.Fermeture + 3.6, text: 'À 1,8 bar, la BP ferme : KM1 colle à travers le contact KA 43-44.' },
              { at: CUES.Fermeture + 5.4, text: 'KM1 ferme son contact 13-14 : c’est l’auto-maintien.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Le pressostat BP est piqué sur l’aspiration : il suit l’évaporateur.' },
              { at: CUES.Circulation + 7.4, text: 'Le détendeur thermostatique fait tomber la pression.' },
              { at: CUES.Circulation + 9.0, text: 'Dans le serpentin, le liquide s’évapore : le givre se dépose.' },
              { at: CUES.Consigne + 0.4, text: 'L’air atteint la consigne : le thermostat ouvre, KA retombe.' },
              { at: CUES.Consigne + 2.0, text: 'Y1 se ferme, KA 43-44 s’ouvre — mais KM1 se tient par son auto-maintien.' },
              { at: CUES.Consigne + 3.8, text: 'Tirage au vide : le compresseur vide l’évaporateur, la pression chute.' },
              { at: CUES.Consigne + 5.8, text: 'À 0,3 bar, la BP ouvre : KM1 tombe et son auto-maintien s’ouvre.' },
              { at: CUES.SansCourtCycle + 0.4, text: 'Plus de liquide dans l’évaporateur : rien ne migre vers le carter.' },
              { at: CUES.SansCourtCycle + 2.6, text: 'Mais à l’arrêt, la pression remonte doucement.' },
              { at: CUES.SansCourtCycle + 4.4, text: 'À 1,8 bar, la BP referme… mais KA et l’auto-maintien sont ouverts.' },
              { at: CUES.SansCourtCycle + 6.0, text: 'KM1 reste au repos : sans demande du thermostat, pas de redémarrage.' },
              { at: CUES.Chronologie + 0.4, text: 'Le chronogramme : B1, KA et Y1 ensemble ; KM1 tient jusqu’au bout du tirage.' },
              { at: CUES.Chronologie + 3.4, until: CUES.CycleComplet, text: 'Après l’arrêt, la BP repasse 1,8 bar : KM1 ne bouge plus.' },
              { at: CUES.CycleComplet + 0.5, text: 'Le cycle complet, d’un seul regard : le relais commande, le fluide obéit.' },
              { at: CUES.CycleComplet + 4.5, text: 'B1 fait coller KA : Y1 s’ouvre, la pression monte, la BP fait coller KM1.' },
              { at: CUES.CycleComplet + 9.0, text: 'À la consigne, KA retombe : KM1 se tient seul pendant le tirage. Suivez le curseur orange.' },
              { at: CUES.CycleComplet + 13.0, until: CUES.LaCle, text: 'À 0,3 bar, la BP coupe : KM1 ne repartira qu’à la demande de B1.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesPumpDownAmeliore() {
    var tw = window.useTweaks(window.OM_TWEAKS || { motionEditor: true, legendes: true, dys: false });
    var t = tw[0], setTweak = tw[1];
    var TweaksPanel = window.TweaksPanel, TweakToggle = window.TweakToggle, TweakSection = window.TweakSection;
    return (
      <React.Fragment>
        <CompositionStage width={1920} height={1080} bg={C.paper}
                          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece captions={t.legendes !== false} dys={!!t.dys} fixedCam={t.zooms !== true} />
        </CompositionStage>
        <TweaksPanel>
          <TweakSection label="Diffusion" />
          <TweakToggle label="Légendes à l’écran" value={t.legendes !== false} onChange={function (v) { setTweak('legendes', v); }} />
          <TweakToggle label="Police Lexend (DYS)" value={!!t.dys} onChange={function (v) { setTweak('dys', v); }} />
          <TweakToggle label="Zooms de caméra" value={t.zooms === true} onChange={function (v) { setTweak('zooms', v); }} />
          <TweakSection label="Outils" />
          <TweakToggle label="Motion editor" value={t.motionEditor !== false} onChange={function (v) { setTweak('motionEditor', v); }} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  window.RegulesPumpDownAmeliore = RegulesPumpDownAmeliore;
})();
