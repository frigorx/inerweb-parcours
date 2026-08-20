/* Les régules · Station 1 — La commande directe
   Composition continue : un seul arbre, une caméra pilotée par T. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var Easing = window.Easing;
  var animate = window.animate;
  var clamp = window.clamp;

  var C = {
    paper: '#f7f1e7', card: '#fffdf8', ink: '#233044', blue: '#1b3a63',
    blueSoft: '#e8f0f7', orange: '#ff6b35', orangeText: '#c9451a',
    green: '#287a62', red: '#b73535', yellow: '#efb83f', line: '#c9d2dc',
    pipe: '#8697a7', wire: '#35495f', mute: '#52657a'
  };

  var MOTION = {
    enter: function (from, to, start, dur) {
      return animate({ from: from, to: to, start: start, end: start + dur, ease: Easing.easeOutCubic });
    },
    draw: function (start, dur) {
      return animate({ from: 0, to: 1, start: start, end: start + dur, ease: Easing.easeInOutQuad });
    },
    pop: function (start) {
      return animate({ from: 0, to: 1, start: start, end: start + 0.5, ease: Easing.easeOutBack });
    }
  };

  function mix(a, b, u) {
    function h(s) { return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]; }
    var x = h(a), y = h(b), o = '#';
    for (var i = 0; i < 3; i++) {
      var v = Math.round(x[i] + (y[i] - x[i]) * clamp(u, 0, 1)).toString(16);
      o += v.length < 2 ? '0' + v : v;
    }
    return o;
  }

  var CAM = [
    { t: 0.0, cx: 520, cy: 570, z: 1.00 },
    { t: 5.4, cx: 400, cy: 630, z: 1.16 },
    { t: 6.3, cx: 1060, cy: 1400, z: 1.02 },
    { t: 8.1, cx: 1010, cy: 1400, z: 1.10 },
    { t: 9.8, cx: 1480, cy: 1400, z: 1.04 },
    { t: 12.4, cx: 1790, cy: 1410, z: 1.14 },
    { t: 13.7, cx: 1480, cy: 700, z: 0.60 },
    { t: 16.3, cx: 2170, cy: 780, z: 0.86 },
    { t: 19.0, cx: 2180, cy: 320, z: 0.80 },
    { t: 21.0, cx: 1330, cy: 480, z: 0.76 },
    { t: 22.7, cx: 700, cy: 430, z: 0.80 },
    { t: 23.9, cx: 400, cy: 630, z: 1.08 },
    { t: 26.1, cx: 400, cy: 620, z: 1.15 },
    { t: 27.0, cx: 1300, cy: 860, z: 0.56 },
    { t: 30.6, cx: 1310, cy: 880, z: 0.60 },
    { t: 31.7, cx: 1300, cy: 2240, z: 0.78 },
    { t: 36.4, cx: 1320, cy: 2220, z: 0.79 },
    { t: 37.5, cx: 1300, cy: 900, z: 0.60 },
    { t: 40.0, cx: 1310, cy: 890, z: 0.64 }
  ];

  function camAt(T) {
    if (T <= CAM[0].t) return CAM[0];
    for (var i = 1; i < CAM.length; i++) {
      if (T <= CAM[i].t) {
        var a = CAM[i - 1], b = CAM[i];
        var u = Easing.easeInOutCubic((T - a.t) / (b.t - a.t));
        return {
          cx: a.cx + (b.cx - a.cx) * u,
          cy: a.cy + (b.cy - a.cy) * u,
          z: a.z * Math.pow(b.z / a.z, u)
        };
      }
    }
    return CAM[CAM.length - 1];
  }

  /* ---------- pièces du monde (toujours montées) ---------- */

  function Chip(p) {
    var s = MOTION.pop(p.at)(p.T);
    if (s <= 0.001) return null;
    var fs = p.fs || 34;
    var w = Math.max(
      String(p.text).length * fs * 0.62,
      p.sub ? String(p.sub).length * fs * 0.7 * 0.56 : 0
    ) + 40;
    w = Math.max(w, 120);
    var h = p.sub ? fs * 2.5 : fs * 1.85;
    var tone = p.tone || C.blue;
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ') scale(' + clamp(s, 0, 1.06) + ')'} opacity={clamp(s * 1.4, 0, 1)}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={C.card} stroke={tone} strokeWidth="3" />
        <text x="0" y={p.sub ? -fs * 0.12 : fs * 0.35} textAnchor="middle" fill={tone}
              fontSize={fs} fontWeight="800" letterSpacing="1.5">{p.text}</text>
        {p.sub && (
          <text x="0" y={fs * 0.95} textAnchor="middle" fill={C.mute} fontSize={fs * 0.7} fontWeight="700">{p.sub}</text>
        )}
      </g>
    );
  }

  function Fan(p) {
    var a = p.spin;
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ')'}>
        <circle r={p.r} fill={C.card} stroke={C.blue} strokeWidth="4" />
        <g transform={'rotate(' + a + ')'} opacity={0.55 + 0.45 * p.flow}>
          {[0, 120, 240].map(function (d) {
            return (
              <path key={d} transform={'rotate(' + d + ')'}
                    d={'M 0 0 Q ' + (p.r * 0.75) + ' ' + (-p.r * 0.5) + ' ' + (p.r * 0.86) + ' 0'}
                    fill="none" stroke={C.blue} strokeWidth="7" strokeLinecap="round" />
            );
          })}
        </g>
        <circle r={p.r * 0.16} fill={C.blue} />
      </g>
    );
  }

  function Room(p) {
    var T = p.T;
    var inner = mix('#eaf1f7', '#d3e4f3', (p.temp + 14) / -4);
    var fins = [];
    for (var x = 442; x < 815; x += 26) fins.push(x);
    var arrows = [];
    for (var i = 0; i < 5; i++) arrows.push(472 + i * 87);
    return (
      <g>
        <rect x="70" y="110" width="940" height="900" rx="18" fill="#e3ded4" stroke={C.blue} strokeWidth="5" />
        <rect x="96" y="136" width="888" height="848" rx="8" fill={inner} stroke={C.line} strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
          return <line key={i} x1={96} y1={150 + i * 121} x2={70} y2={124 + i * 121} stroke="#c3bcae" strokeWidth="3" />;
        })}
        <text x="118" y="196" fill={C.blue} fontSize="34" fontWeight="800" letterSpacing="3">CHAMBRE NÉGATIVE</text>

        {/* évaporateur */}
        <g>
          <rect x="420" y="230" width="400" height="140" rx="10" fill={C.card} stroke={C.blue} strokeWidth="4" />
          {fins.map(function (fx) {
            return <line key={fx} x1={fx} y1="244" x2={fx} y2="356" stroke="#a9bccd" strokeWidth="4" />;
          })}
          <Fan x="620" y="180" r="48" spin={p.spin} flow={p.flow} />
        </g>
        {arrows.map(function (ax, i) {
          var o = p.flow * (0.35 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase * 3 - i)));
          var d = (p.phase * 70 + i * 33) % 90;
          return (
            <g key={ax} opacity={o}>
              <line x1={ax} y1={508 + d} x2={ax} y2={568 + d} stroke={C.blue} strokeWidth="7" strokeLinecap="round" />
              <path d={'M ' + (ax - 13) + ' ' + (562 + d) + ' L ' + ax + ' ' + (582 + d) + ' L ' + (ax + 13) + ' ' + (562 + d) + ' Z'} fill={C.blue} />
            </g>
          );
        })}

        {/* denrées */}
        {[600, 760].map(function (bx, i) {
          return (
            <g key={bx}>
              <rect x={bx} y={840 - i * 6} width="150" height={120 + i * 6} rx="6" fill="#e8dfcd" stroke="#b9ac93" strokeWidth="4" />
              <line x1={bx} y1={880 - i * 6} x2={bx + 150} y2={880 - i * 6} stroke="#b9ac93" strokeWidth="4" />
            </g>
          );
        })}

        {/* sonde B1 + liaison vers l'armoire */}
        <g>
          <rect x="205" y="424" width="96" height="66" rx="8" fill={C.card} stroke={C.orangeText} strokeWidth="4" />
          <text x="253" y="470" textAnchor="middle" fill={C.orangeText} fontSize="34" fontWeight="900">B1</text>
          <text x="205" y="404" fill={C.orangeText} fontSize="26" fontWeight="800" letterSpacing="2">SONDE D'AMBIANCE</text>
          <path d="M 253 490 L 253 1240 L 760 1240 L 760 1330" fill="none" stroke="#93a3b4"
                strokeWidth="4" strokeDasharray="14 12" />
        </g>

        {/* afficheur */}
        <g>
          <rect x="120" y="540" width="380" height="230" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <text x="150" y="586" fill={C.orangeText} fontSize="28" fontWeight="900" letterSpacing="2.5">AIR DE LA CHAMBRE</text>
          <text x="150" y="690" fill={p.temp > -14.6 ? C.red : C.blue} fontSize="94" fontWeight="900">
            {p.temp.toFixed(1)} °C
          </text>
          <text x="150" y="740" fill={C.mute} fontSize="27" fontWeight="700">CONSIGNE −18 · ENCLENCHEMENT −14</text>
          <circle cx="466" cy="574" r="13" fill={p.energy > 0.5 ? C.orange : '#d6dde5'} />
        </g>

        <Chip T={T} at={21.3} x="716" y="452" text="ÉVAPORATEUR" sub="il prend la chaleur de l'air" tone={C.blue} fs="34" />
      </g>
    );
  }

  function Machine(p) {
    var fins = [];
    for (var x = 2004; x < 2465; x += 30) fins.push(x);
    var hot = [];
    for (var i = 0; i < 4; i++) hot.push(2060 + i * 115);
    return (
      <g>
        <text x="1120" y="176" fill={C.mute} fontSize="32" fontWeight="800" letterSpacing="3">HORS DE LA CHAMBRE</text>

        {/* condenseur */}
        <g>
          <rect x="1980" y="180" width="490" height="200" rx="10" fill={C.card} stroke={C.blue} strokeWidth="4" />
          {fins.map(function (fx) {
            return <line key={fx} x1={fx} y1="196" x2={fx} y2="364" stroke="#c4a79c" strokeWidth="4" />;
          })}
          <Fan x="2225" y="112" r="56" spin={-p.spin * 0.8} flow={p.flow} />
        </g>
        {hot.map(function (hx, i) {
          var o = p.flow * (0.3 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase * 2.6 - i * 1.2)));
          var d = (p.phase * 60 + i * 30) % 80;
          return (
            <g key={hx} opacity={o}>
              <line x1={hx} y1={190 - d} x2={hx} y2={130 - d} stroke={C.red} strokeWidth="7" strokeLinecap="round" />
              <path d={'M ' + (hx - 13) + ' ' + (140 - d) + ' L ' + hx + ' ' + (118 - d) + ' L ' + (hx + 13) + ' ' + (140 - d) + ' Z'} fill={C.red} />
            </g>
          );
        })}

        {/* compresseur */}
        <g>
          <rect x="2080" y="700" width="340" height="200" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <circle cx="2250" cy="800" r="58" fill={C.blueSoft} stroke={C.blue} strokeWidth="5" />
          <g transform={'translate(2250,800) rotate(' + p.spin * 1.4 + ')'}>
            <line x1="-40" y1="0" x2="40" y2="0" stroke={C.blue} strokeWidth="9" strokeLinecap="round" />
            <line x1="0" y1="-40" x2="0" y2="40" stroke={C.blue} strokeWidth="9" strokeLinecap="round" opacity="0.45" />
          </g>
          <circle cx="2250" cy="800" r={62 + 10 * Math.sin(p.phase * 6)} fill="none" stroke={C.orange}
                  strokeWidth="5" opacity={0.5 * p.flow} />
        </g>

        {/* détendeur */}
        <g>
          <path d="M 1140 566 L 1140 634 L 1188 600 Z" fill={C.orangeText} />
          <path d="M 1260 566 L 1260 634 L 1212 600 Z" fill={C.orangeText} />
          <rect x="1186" y="576" width="28" height="48" fill={C.card} stroke={C.orangeText} strokeWidth="4" />
        </g>

        <Chip T={p.T} at={13.9} x="2250" y="1000" text="COMPRESSEUR" sub="il aspire et refoule" fs="34" />
        <Chip T={p.T} at={16.9} x="2225" y="470" text="CONDENSEUR" sub="il rend la chaleur dehors" fs="34" />
        <Chip T={p.T} at={19.6} x="1200" y="716" text="DÉTENDEUR" sub="HP → BP" fs="34" tone={C.orangeText} />
      </g>
    );
  }

  var P_SUCTION = 'M 450 370 L 450 940 L 2000 940 L 2000 830 L 2080 830';
  var P_DISCHARGE = 'M 2250 700 L 2250 380';
  var P_LIQUID = 'M 1980 280 L 1420 280 L 1420 600 L 1264 600';
  var P_LOWP = 'M 1136 600 L 900 600 L 900 340 L 820 340';

  function Pipes(p) {
    var lines = [
      { d: P_SUCTION, col: C.blue, at: 13.9, chip: { x: 1180, y: 1030, text: 'BP · VAPEUR FROIDE', at: 14.6, tone: C.blue } },
      { d: P_DISCHARGE, col: C.red, at: 16.0, chip: { x: 2010, y: 620, text: 'HP · GAZ CHAUD', at: 16.4, tone: C.red } },
      { d: P_LIQUID, col: C.orangeText, at: 18.8, chip: { x: 1620, y: 220, text: 'HP · LIQUIDE', at: 19.2, tone: C.orangeText } },
      { d: P_LOWP, col: C.blue, at: 20.4, chip: { x: 1250, y: 452, text: 'BP · MÉLANGE FROID', at: 20.8, tone: C.blue } }
    ];
    return (
      <g>
        {lines.map(function (l, i) {
          return <path key={'b' + i} d={l.d} fill="none" stroke={C.pipe} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {lines.map(function (l, i) {
          return (
            <path key={'f' + i} d={l.d} fill="none" stroke={l.col} strokeWidth="10" strokeLinecap="round"
                  strokeLinejoin="round" strokeDasharray="34 30" strokeDashoffset={-p.phase * 240}
                  opacity={0.15 + 0.85 * p.flow} />
          );
        })}
        {/* traversées de paroi */}
        {[[1010, 940], [1010, 600]].map(function (w) {
          return <rect key={w[1]} x={w[0] - 18} y={w[1] - 22} width="36" height="44" fill="#e3ded4" stroke={C.blue} strokeWidth="3" />;
        })}
      </g>
    );
  }

  function PipeChips(p) {
    return (
      <g>
        <Chip T={p.T} at={14.6} x="1180" y="1030" text="BP · VAPEUR FROIDE" tone={C.blue} fs="30" />
        <Chip T={p.T} at={16.4} x="2010" y="620" text="HP · GAZ CHAUD" tone={C.red} fs="30" />
        <Chip T={p.T} at={19.2} x="1620" y="220" text="HP · LIQUIDE" tone={C.orangeText} fs="30" />
        <Chip T={p.T} at={20.8} x="1010" y="694" text="BP · MÉLANGE FROID" tone={C.blue} fs="30" />
      </g>
    );
  }

  function Cabinet(p) {
    var T = p.T;
    var arm = p.arm;
    var reveal = clamp((T - p.tClose) / 0.45, 0, 1) * (T < p.tOpen ? 1 : clamp(1 - (T - p.tOpen) / 0.2, 0, 1));
    var liveLen = 1730;
    var ghost = clamp(clamp((T - 28.8) / 0.7, 0, 1) - clamp((T - 31.2) / 0.5, 0, 1) + clamp((T - 37.6) / 0.5, 0, 1), 0, 1);
    return (
      <g>
        <rect x="70" y="1100" width="2470" height="620" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1170" fill={C.orangeText} fontSize="34" fontWeight="900" letterSpacing="3">ARMOIRE · COMMANDE DIRECTE</text>

        <line x1="340" y1="1230" x2="340" y2="1650" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <line x1="2270" y1="1230" x2="2270" y2="1650" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <text x="340" y="1700" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="2270" y="1700" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        {/* rung de base */}
        <path d="M 340 1400 L 760 1400" fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <path d="M 900 1400 L 1746 1400" fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <path d="M 1854 1400 L 2270 1400" fill="none" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />

        {/* courant */}
        <path d="M 340 1400 L 760 1400" fill="none" stroke={C.orange} strokeWidth="13" strokeLinecap="round"
              strokeDasharray="26 22" strokeDashoffset={-p.phaseAll * 200} opacity="0.85" />
        <g opacity={reveal}>
          <path d="M 900 1400 L 1746 1400" fill="none" stroke={C.orange} strokeWidth="13" strokeLinecap="round"
                strokeDasharray={liveLen} strokeDashoffset={(1 - reveal) * 846} />
          <path d="M 1854 1400 L 2270 1400 L 2270 1650" fill="none" stroke={C.orange} strokeWidth="13"
                strokeLinecap="round" strokeDasharray="26 22" strokeDashoffset={-p.phaseAll * 200} />
        </g>

        {/* contact B1 */}
        <g>
          <line x1="760" y1="1330" x2="760" y2="1470" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
          <line x1="900" y1="1330" x2="900" y2="1470" stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
          <g transform={'translate(760,1400) rotate(' + arm + ')'}>
            <line x1="0" y1="0" x2="150" y2="0" stroke={reveal > 0.4 ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
          </g>
          <circle cx="760" cy="1400" r="10" fill={C.wire} />
          <text x="830" y="1300" textAnchor="middle" fill={C.blue} fontSize="40" fontWeight="900" letterSpacing="1.5">B1 · THERMOSTAT</text>
          <text x="830" y="1520" textAnchor="middle" fill={C.mute} fontSize="30" fontWeight="700">ferme si l'air est trop chaud</text>
        </g>

        {/* bobine KM1 */}
        <g>
          <circle cx="1800" cy="1400" r="54" fill={reveal > 0.5 ? '#fff0e9' : C.blueSoft}
                  stroke={reveal > 0.5 ? C.orangeText : C.blue} strokeWidth="8" />
          <circle cx="1800" cy="1400" r={54 + 16 * (0.5 + 0.5 * Math.sin(p.phaseAll * 5))} fill="none"
                  stroke={C.orange} strokeWidth="6" opacity={0.55 * reveal} />
          <text x="1800" y="1414" textAnchor="middle" fill={reveal > 0.5 ? C.orangeText : C.blue}
                fontSize="38" fontWeight="900">KM1</text>
          <text x="1800" y="1520" textAnchor="middle" fill={C.mute} fontSize="30" fontWeight="700">CONTACTEUR COMPRESSEUR</text>
        </g>

        {/* absence de sécurité */}
        <g opacity={ghost}>
          <path d="M 340 1592 L 2270 1592" fill="none" stroke={C.red} strokeWidth="6" strokeDasharray="20 18" opacity="0.55" />
          {[1000, 1300].map(function (gx) {
            return <rect key={gx} x={gx} y="1552" width="150" height="80" rx="8" fill="none" stroke={C.red} strokeWidth="5" strokeDasharray="16 12" />;
          })}
          <text x="1075" y="1605" textAnchor="middle" fill={C.red} fontSize="30" fontWeight="900">HP ?</text>
          <text x="1375" y="1605" textAnchor="middle" fill={C.red} fontSize="30" fontWeight="900">BP ?</text>
          <rect x="1560" y="1568" width="660" height="52" rx="8" fill={C.card} />
          <text x="1590" y="1606" fill={C.red} fontSize="32" fontWeight="900" letterSpacing="2">AUCUNE SÉCURITÉ REPRÉSENTÉE</text>
        </g>
      </g>
    );
  }

  var CH = { x0: 640, x1: 2420, tempTop: 1990, tempBot: 2210 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chTemp(v) { return CH.tempTop + ((-13 - v) / 6) * (CH.tempBot - CH.tempTop); }

  function Chrono(p) {
    var r = MOTION.draw(31.25, 4.6)(p.T);
    var pts = [[0, -15.4], [0.13, -14], [0.44, -18], [0.62, -14], [0.90, -18], [1, -16.6]];
    var tempPath = pts.map(function (q, i) {
      return (i ? 'L ' : 'M ') + chx(q[0]) + ' ' + chTemp(q[1]);
    }).join(' ');
    var closed = [[0.13, 0.44], [0.62, 0.90]];
    function square(hi, lo) {
      var d = 'M ' + chx(0) + ' ' + lo;
      closed.forEach(function (s) {
        d += ' L ' + chx(s[0]) + ' ' + lo + ' L ' + chx(s[0]) + ' ' + hi + ' L ' + chx(s[1]) + ' ' + hi + ' L ' + chx(s[1]) + ' ' + lo;
      });
      return d + ' L ' + chx(1) + ' ' + lo;
    }
    var note = clamp((p.T - 34.9) / 0.6, 0, 1);
    return (
      <g>
        <rect x="70" y="1860" width="2470" height="740" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · DEUX CYCLES</text>
        {[['AIR DE LA', 2090], ['CHAMBRE', 2140], ['CONTACT B1', 2330], ['COMPRESSEUR', 2455], ['KM1', 2505]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="40" fontWeight="800">{l[0]}</text>;
        })}
        {[[-14, '−14 · enclenchement'], [-18, '−18 · consigne']].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chTemp(l[0])} x2={CH.x1} y2={chTemp(l[0])} stroke={C.line} strokeWidth="3" strokeDasharray="14 12" />
              <text x={CH.x0} y={chTemp(l[0]) - 14} fill={C.mute} fontSize="30" fontWeight="700">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="600" />
        </clipPath>
        <g clipPath="url(#chclip)">
          <path d={tempPath} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2280, 2360)} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2430, 2510)} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2545" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        <text x="1530" y="2578" textAnchor="middle" fill={C.orangeText} fontSize="40" fontWeight="900"
              opacity={note}>CONTACT B1 ET KM1 · EXACTEMENT LE MÊME PROFIL</text>
      </g>
    );
  }

  /* ---------- la composition ---------- */

  function Piece(props) {
    var c = useComposition();
    var T = c.T;
    var CUES = c.CUES;
    var tClose = CUES.Fermeture + 1.6;
    var tOpen = CUES.Consigne + 3.4;

    var rise = animate({ from: -15.4, to: -14.0, start: 0, end: tClose, ease: Easing.linear });
    var fall = animate({ from: -14.0, to: -18.0, start: tClose, end: tOpen, ease: Easing.easeInOutSine });
    var drift = animate({ from: -18.0, to: -17.1, start: tOpen, end: c.authoredTotal, ease: Easing.linear });
    var temp = T < tClose ? rise(T) : (T < tOpen ? fall(T) : drift(T));

    var energy = T < tClose ? 0
      : (T < tOpen ? clamp((T - tClose) / 0.3, 0, 1) : clamp(1 - (T - tOpen) / 0.25, 0, 1));
    var flow = T < tClose ? 0
      : (T < tOpen ? clamp((T - tClose) / 0.9, 0, 1) : clamp(1 - (T - tOpen) / 0.7, 0, 1));
    var phase = clamp(T, tClose, tOpen) - tClose;
    var arm = T < tClose ? -30
      : (T < tOpen ? -30 + 30 * clamp(MOTION.pop(tClose)(T), 0, 1.08) : -30 * clamp((T - tOpen) / 0.18, 0, 1));

    var cam = camAt(T);
    var tx = 960 - cam.cx * cam.z;
    var ty = 540 - cam.cy * cam.z;
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font} transform={'translate(' + tx + ',' + ty + ') scale(' + cam.z + ')'}>
            <Pipes T={T} phase={phase} flow={flow} />
            <Room T={T} temp={temp} spin={phase * 300} flow={flow} phase={phase} energy={energy} />
            <Machine T={T} spin={phase * 300} flow={flow} phase={phase} />
            <PipeChips T={T} />
            <Cabinet T={T} arm={arm} tClose={tClose} tOpen={tOpen} phaseAll={T} />
            <Chrono T={T} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', inset: 0, background: C.paper, opacity: keyIn * 0.58, pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute', left: '6%', right: '6%', top: '7%', opacity: keyIn,
          transform: 'translateY(' + (1 - keyIn) * -26 + 'px)', pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,253,248,0.95)', border: '3px solid ' + C.blue, borderLeft: '16px solid ' + C.orange,
            borderRadius: 18, padding: '26px 38px', boxShadow: '0 18px 50px rgba(27,58,99,0.18)'
          }}>
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 1 · LA COMMANDE DIRECTE</div>
            <div style={{ color: C.blue, font: '900 54px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Le thermostat alimente directement le compresseur.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Une seule cause, un seul effet — et aucune sécurité représentée.
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
              { at: 0.4, text: 'Chambre négative : l’air se réchauffe, le thermostat surveille.' },
              { at: 3.2, text: 'Trop chaud pour la consigne : l’enclenchement approche.' },
              { at: CUES.Fermeture + 0.4, text: 'Le thermostat ferme son contact.' },
              { at: CUES.Fermeture + 3.2, text: 'Le courant traverse B1 et excite la bobine KM1.' },
              { at: CUES.Fermeture + 5.6, text: 'Le contacteur colle : le compresseur démarre.' },
              { at: CUES.Circulation + 0.5, text: 'Le compresseur aspire les vapeurs froides de l’évaporateur.' },
              { at: CUES.Circulation + 3.4, text: 'Refoulement chaud : le condenseur évacue la chaleur dehors.' },
              { at: CUES.Circulation + 6.2, text: 'Le détendeur abaisse la pression, l’évaporateur reprend le froid.' },
              { at: CUES.Consigne + 0.4, text: 'L’air atteint la consigne : −18 °C.' },
              { at: CUES.Consigne + 3.6, text: 'Le thermostat ouvre : tout tombe au même instant.' },
              { at: CUES.Consigne + 6.0, text: 'Aucune temporisation, aucun pressostat dans cette commande.' },
              { at: CUES.Chronologie + 0.4, text: 'Contact B1 et compresseur ont exactement le même profil.' },
              { at: CUES.Chronologie + 3.4, until: CUES.LaCle, text: 'Le cycle repart dès que l’air remonte à −14 °C.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesCommandeDirecte() {
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

  window.RegulesCommandeDirecte = RegulesCommandeDirecte;
})();
