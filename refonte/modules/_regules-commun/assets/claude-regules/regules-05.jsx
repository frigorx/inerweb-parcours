/* Les régules · Station 5 — Le pump-down unique
   Relais de mémoire KA1 : la demande est mémorisée, la BP de régulation l'efface.
   BP de régulation (ligne mémoire) distincte de la BP de sécurité (ligne compresseur). */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var Easing = window.Easing;
  var animate = window.animate;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Chip = RK.Chip, Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var ContactNO = RK.ContactNO, ContactNF = RK.ContactNF, Disjoncteur = RK.Disjoncteur, Bobine = RK.Bobine, Manometre = RK.Manometre;

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

  /* contact auxiliaire : liaison mécanique au relais, sans organe de commande */
  function ContactAux(p) {
    var x = +p.x, y = +p.y, arm = p.live ? 0 : -30;
    return (
      <g>
        <g transform={'translate(' + x + ',' + y + ') rotate(' + arm + ')'}>
          <line x1="0" y1="0" x2="140" y2="0" stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        </g>
        <circle cx={x} cy={y} r="10" fill={C.wire} />
        <circle cx={x + 140} cy={y} r="10" fill={C.wire} />
        <text x={x + 70} y={y + 100} textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">{p.code}</text>
        <text x={x + 70} y={y + 140} textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  function Cabinet(p) {
    var flux = function (d, on) {
      return (
        <path d={d} fill="none" stroke={C.orange} strokeWidth="13" strokeLinecap="round"
              strokeDasharray="26 22" strokeDashoffset={-p.T * 200} opacity={on ? 0.9 : 0} />
      );
    };
    return (
      /* Refonte 22/08 : l'armoire vit À DROITE de la croix. */
      <g transform="translate(2450,-400)">
        <rect x="70" y="1030" width="2470" height="890" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="620" y="1106" fill={C.orangeText} fontSize="30" fontWeight="900" letterSpacing="2">ARMOIRE · PUMP-DOWN UNIQUE</text>
        <text x="2500" y="1106" textAnchor="end" fill={C.blue} fontSize="30" fontWeight="900" letterSpacing="2">TROIS LIGNES · UNE MÉMOIRE</text>

        <line x1="340" y1="1140" x2="340" y2="1860" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <line x1="90" y1="1140" x2="140" y2="1140" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <line x1="292" y1="1140" x2="340" y2="1140" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <Disjoncteur x={140} y={1140} live={true} above={true} code="Q1" />
        <line x1="2270" y1="1120" x2="2270" y2="1860" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <text x="340" y="1900" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="2270" y="1900" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        {/* ligne 1 · la demande de froid ouvre l'électrovanne */}
        <text x="392" y="1168" fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="2">1 · LIGNE LIQUIDE</text>
        <path d="M 340 1210 L 760 1210 M 900 1210 L 1780 1210 M 1940 1210 L 2270 1210"
              fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        {flux('M 340 1210 L 760 1210', true)}
        {flux('M 900 1210 L 1780 1210 M 1940 1210 L 2270 1210', p.y1Live)}
        <ContactNO x={760} y={1210} arm={p.arm} live={p.y1Live} glyph="θ" code="B1" sub="thermostat" />
        <Bobine x={1780} y={1210} code="Y1" sub="ÉLECTROVANNE LIGNE LIQUIDE" live={p.y1Live} above={true} />

        {/* ligne 2 · la mémoire de la demande */}
        <text x="392" y="1438" fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="2">2 · MÉMOIRE DE LA DEMANDE</text>
        <path d="M 900 1210 L 900 1380 L 700 1380 L 700 1480 L 1040 1480 M 1180 1480 L 1780 1480 M 1940 1480 L 2270 1480"
              fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <path d="M 340 1480 L 400 1480 M 540 1480 L 700 1480" fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        {flux('M 900 1210 L 900 1380 L 700 1380 L 700 1480 L 1040 1480', p.y1Live)}
        {flux('M 340 1480 L 400 1480', true)}
        {flux('M 540 1480 L 700 1480 L 1040 1480', p.kaLive && !p.y1Live)}
        {flux('M 1180 1480 L 1780 1480 M 1940 1480 L 2270 1480', p.kaLive)}
        <ContactAux x={400} y={1480} live={p.kaLive} code="KA1" sub="auto-maintien" />
        <ContactNO x={1040} y={1480} arm={p.bprArm} live={p.kaLive} glyph="p" code="BPr" sub="BP de régulation · NO" />
        <Bobine x={1780} y={1480} code="KA1" sub="RELAIS DE MÉMOIRE" live={p.kaLive} />
        <path d="M 1780 1424 L 1700 1424 L 1700 1398 L 470 1398 L 470 1424"
              fill="none" stroke={C.green} strokeWidth="5" strokeDasharray="18 12" opacity="0.85" />
        <text x="1420" y="1388" textAnchor="middle" fill={C.green} fontSize="28" fontWeight="900" letterSpacing="2">
          LE RELAIS SE TIENT LUI-MÊME
        </text>

        {/* ligne 3 · le compresseur, protégé par ses sécurités */}
        <text x="392" y="1698" fill={C.mute} fontSize="26" fontWeight="900" letterSpacing="2">3 · COMPRESSEUR</text>
        <path d="M 340 1740 L 760 1740 M 912 1740 L 1360 1740 M 1512 1740 L 1600 1740 M 1740 1740 L 1840 1740 M 2000 1740 L 2270 1740"
              fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        {flux('M 340 1740 L 760 1740 M 912 1740 L 1360 1740 M 1512 1740 L 1600 1740', true)}
        {flux('M 1740 1740 L 1840 1740 M 2000 1740 L 2270 1740 L 2270 1860', p.kmLive)}
        <ContactNF x={760} y={1740} live={true} code="HP" sub="sécurité · NF" />
        <ContactNF x={1360} y={1740} live={true} code="BPs" sub="BP de sécurité · NF" />
        <ContactAux x={1600} y={1740} live={p.kmLive} code="KA1" sub="contact du relais" />
        <Bobine x={1840} y={1740} code="KM1" sub="CONTACTEUR COMPRESSEUR" live={p.kmLive} />
        <g opacity={p.secu}>
          <rect x="1180" y="1830" width="620" height="56" rx="10" fill={C.card} stroke={C.green} strokeWidth="4" />
          <text x="1490" y="1868" textAnchor="middle" fill={C.green} fontSize="30" fontWeight="900">LA SÉCURITÉ RESTE DISPONIBLE</text>
        </g>
      </g>
    );
  }

  var CH = { x0: 700, x1: 2420, tempTop: 1990, tempBot: 2180 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chTemp(v) { return CH.tempTop + ((-13 - v) / 6) * (CH.tempBot - CH.tempTop); }
  function chBp(v) { return 2500 - clamp(v / 3, 0, 1) * 150; }

  function Chrono(p) {
    var r = MOTION.draw(38.25, 4.6)(p.T);
    var tempPts = [[0, -15.4], [0.10, -14], [0.42, -18], [0.50, -17.6], [0.75, -16.2], [1, -14.6]];
    var bpPts = [[0, 1.55], [0.10, 1.75], [0.13, 3.0], [0.20, 2.35], [0.42, 2.25], [0.50, 0.30], [0.75, 1.80], [1, 2.15]];
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
      /* Refonte 22/08 : le graphique vit SOUS les deux schémas. */
      <g transform="translate(930,-300)">
        <rect x="70" y="1860" width="2470" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · UN SEUL TIRAGE AU VIDE</text>
        {[['AIR DE LA', 2060], ['CHAMBRE', 2106], ['B1 ET Y1', 2296], ['PRESSION BP', 2440], ['KA1 MÉMOIRE', 2590], ['KM1', 2704]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="38" fontWeight="800">{l[0]}</text>;
        })}
        <rect x={chx(0.58)} y="2230" width={chx(1) - chx(0.58)} height="510" fill={C.green} opacity="0.07" />
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
              <text x={CH.x1 + 14} y={chBp(l[0]) + 10} fill={l[2]} fontSize="26" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip5">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="800" />
        </clipPath>
        <g clipPath="url(#chclip5)">
          <path d={tempPath} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2250, 2330, [[0.10, 0.42]])} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={bpPath} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          <path d={square(2544, 2624, [[0.10, 0.50]])} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2658, 2738, [[0.11, 0.50]])} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2748" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        {/* Pendant la scène CycleComplet, le curseur suit le cycle rejoué. */}
        {p.replayF > 0 && (
          <g>
            <line x1={chx(p.replayF)} y1="1960" x2={chx(p.replayF)} y2="2748" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replayF)} cy="1960" r="16" fill={C.orange} />
          </g>
        )}
        <g opacity={note}>
          <text x={chx(0.26)} y="2790" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">Y1, PUIS LE TIRAGE AU VIDE</text>
          <text x={chx(0.78)} y="2790" textAnchor="middle" fill={C.green} fontSize="34" fontWeight="900">1,8 BAR DÉPASSÉ · RIEN NE RECOLLE</text>
        </g>
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var tB1c = CUES.Fermeture + 1.6;
    var tKMc = CUES.Fermeture + 2.1;
    var tB1o = CUES.Consigne + 3.4;
    var tKAo = CUES.Consigne + 5.6;

    /* Scène CycleComplet (brief 22/08) : la séquence nominale se REJOUE en
       plan large — la mémoire s'arme, le tirage au vide, l'effacement. La
       remontée finale et l'habillage restent au temps réel, donc éteints. */
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var kRejeu = (tKAo + 3 - (tB1c - 1)) / 16;
    var Tm = enRejeu ? (tB1c - 1) + (T - CUES.CycleComplet) * kRejeu : T;

    var y1Live = Tm >= tB1c && Tm < tB1o;
    var kaLive = Tm >= tB1c && Tm < tKAo;
    var kmLive = Tm >= tKMc && Tm < tKAo;
    var flow = kmLive ? clamp((Tm - tKMc) / 0.9, 0, 1) : clamp(1 - (Tm - tKAo) / 0.7, 0, 1);
    flow = Tm < tKMc ? 0 : clamp(flow, 0, 1);
    var phase = clamp(Tm, tKMc, tKAo) - tKMc;
    var energy = kmLive ? 1 : 0;

    var temp = pw(Tm, [[0, -15.4], [tB1c, -14.0], [tB1o, -18.0], [c.authoredTotal, -14.8]]);
    var bp = pw(Tm, [[0, 1.55], [tB1c, 1.72], [tB1c + 0.6, 3.0], [tB1c + 1.8, 2.35], [tB1o, 2.25],
                    [tB1o + 1.1, 1.0], [tKAo, 0.30], [CUES.ArretUnique + 4.4, 1.80],
                    [CUES.ArretUnique + 6.6, 2.05], [c.authoredTotal, 2.15]]);

    var charge = Tm < tB1c ? 0
      : (Tm < tB1o ? clamp((Tm - tB1c) / 1.2, 0, 1) * 0.34
        : 0.34 * clamp(1 - (Tm - tB1o) / (tKAo - tB1o), 0, 1));
    var frostU = clamp((clamp(Tm, tB1c, tB1o) - tB1c) / (tB1o - tB1c), 0, 1);
    var arm = Tm < tB1c ? -30
      : (Tm < tB1o ? -30 + 30 * clamp(MOTION.pop(tB1c)(Tm), 0, 1.08) : -30 * clamp((Tm - tB1o) / 0.18, 0, 1));
    var replayF = enRejeu
      ? pw(Tm, [[tB1c - 1, 0.08], [tB1c, 0.10], [tKMc, 0.11], [tB1o, 0.42], [tKAo, 0.50], [tKAo + 3, 0.53]])
      : 0;
    var bprArm = bp > 0.34 ? 0 : -30;
    var secu = clamp((T - CUES.ArretUnique - 6.0) / 0.7, 0, 1) * clamp(1 - (T - CUES.Chronologie + 0.4) / 0.6, 0, 1);

    var cam = props.fixedCam !== false ? RK.camFixed(T) : RK.camAt(T);
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var propre = clamp((T - CUES.ArretUnique - 0.4) / 0.7, 0, 1) * clamp(1 - (T - CUES.ArretUnique - 3.6) / 0.6, 0, 1);
    var tenue = clamp((T - CUES.ArretUnique - 4.4) / 0.6, 0, 1) * clamp(1 - (T - CUES.Chronologie + 0.4) / 0.6, 0, 1);

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
                     frostU={frostU} liquid={charge} cid="s5" />
            <Machine T={T} carter={0} spin={phase * 300} flow={flow} phase={phase} live={y1Live} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <g opacity={clamp((T - 14.6) / 0.8, 0, 1)}>
              <Manometre x={2320} y={680} val={bp} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
              <rect x="2180" y="860" width="280" height="80" rx="10" fill={kaLive ? '#e4f2ec' : C.blueSoft}
                    stroke={kaLive ? C.green : C.blue} strokeWidth="6" />
              <text x="2320" y="914" textAnchor="middle" fill={kaLive ? C.green : C.blue} fontSize="32" fontWeight="900">
                {kaLive ? 'KA1 ARMÉE' : 'KA1 EFFACÉE'}
              </text>
              <rect x="2180" y="960" width="280" height="80" rx="10" fill={kmLive ? '#fff0e9' : C.blueSoft}
                    stroke={kmLive ? C.orangeText : C.blue} strokeWidth="6" />
              <text x="2320" y="1014" textAnchor="middle" fill={kmLive ? C.orangeText : C.blue} fontSize="32" fontWeight="900">
                {kmLive ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}
              </text>
            </g>
            <Cabinet T={T} arm={arm} bprArm={bprArm} y1Live={y1Live} kaLive={kaLive} kmLive={kmLive} secu={secu} />
            <Chrono T={T} replayF={replayF} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '17%', opacity: propre * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 32px ' + font, letterSpacing: 2 }}>MÉMOIRE EFFACÉE</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>seul le thermostat pourra relancer le cycle</div>
        </div>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '13%', opacity: tenue * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 32px ' + font, letterSpacing: 2 }}>1,8 BAR DÉPASSÉ · KM1 RESTE AU REPOS</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>la BP de régulation ne commande plus rien : un seul tirage au vide</div>
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 5 · LE PUMP-DOWN UNIQUE</div>
            <div style={{ color: C.blue, font: '900 54px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Un relais garde la demande ; la BP de régulation l’efface.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Un seul tirage au vide par arrêt — et la BP de sécurité, elle, reste disponible.
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
              { at: 0.4, text: 'Installation à l’arrêt : Y1 est fermée, le compresseur ne tourne pas.' },
              { at: 3.2, text: 'L’air de la chambre se réchauffe et remonte vers −14 °C.' },
              { at: CUES.Fermeture + 0.4, text: 'Le thermostat ferme : Y1 s’ouvre et le relais KA1 s’excite.' },
              { at: CUES.Fermeture + 2.4, text: 'KA1 se tient lui-même : la demande est mémorisée.' },
              { at: CUES.Fermeture + 4.2, text: 'Son contact ferme la ligne 3 : KM1 colle derrière les deux sécurités.' },
              { at: CUES.Fermeture + 5.8, text: 'Le compresseur démarre après l’électrovanne, jamais avant.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'La BP de régulation suit l’aspiration, la BP de sécurité veille.' },
              { at: CUES.Circulation + 7.4, text: 'Le détendeur thermostatique fait tomber la pression.' },
              { at: CUES.Circulation + 9.0, text: 'Dans le serpentin, le liquide s’évapore : le givre se dépose.' },
              { at: CUES.Consigne + 0.4, text: 'L’air atteint la consigne : le thermostat ouvre.' },
              { at: CUES.Consigne + 2.0, text: 'Y1 se ferme, mais KA1 reste collé par son auto-maintien.' },
              { at: CUES.Consigne + 3.8, text: 'Tirage au vide : le compresseur vide l’évaporateur.' },
              { at: CUES.Consigne + 5.8, text: 'À 0,3 bar, la BP de régulation ouvre : KA1 tombe, KM1 avec lui.' },
              { at: CUES.ArretUnique + 0.4, text: 'La mémoire est effacée : la demande de froid n’existe plus.' },
              { at: CUES.ArretUnique + 2.6, text: 'À l’arrêt, la pression remonte, comme toujours.' },
              { at: CUES.ArretUnique + 4.6, text: 'Elle dépasse 1,8 bar — et pourtant rien ne recolle.' },
              { at: CUES.ArretUnique + 6.2, text: 'Un seul tirage au vide par arrêt : le court cycle a disparu.' },
              { at: CUES.Chronologie + 0.4, text: 'Le chronogramme : Y1, puis le tirage au vide, puis plus rien.' },
              { at: CUES.Chronologie + 3.4, until: CUES.CycleComplet, text: 'Seul le thermostat pourra relancer le cycle.' },
              { at: CUES.CycleComplet + 0.5, text: 'Le cycle complet, d’un seul regard : la mémoire commande, le fluide obéit.' },
              { at: CUES.CycleComplet + 4.5, text: 'B1 arme KA1 : Y1 s’ouvre, KM1 colle derrière ses deux sécurités.' },
              { at: CUES.CycleComplet + 9.0, text: 'À la consigne, KA1 tient seul le tirage au vide : suivez le curseur orange.' },
              { at: CUES.CycleComplet + 13.0, until: CUES.LaCle, text: 'À 0,3 bar, tout tombe — et la mémoire est effacée.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesPumpDownUnique() {
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

  window.RegulesPumpDownUnique = RegulesPumpDownUnique;
})();
