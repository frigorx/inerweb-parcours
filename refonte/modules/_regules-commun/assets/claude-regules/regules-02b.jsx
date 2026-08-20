/* Les régules · Station 2 bis — Migration de liquide et coup de liquide
   Symboles repris des planches inerWeb : compresseur_general, detendeur_thermo_ext, echangeur_a_air. */
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
    pipe: '#8697a7', wire: '#35495f', mute: '#52657a', frost: '#eef7fd'
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

  var CAM = [
    { t: 0.0, cx: 1330, cy: 700, z: 0.70 },
    { t: 4.4, cx: 1330, cy: 720, z: 0.74 },
    { t: 5.6, cx: 1330, cy: 1030, z: 0.96 },
    { t: 10.5, cx: 1330, cy: 1010, z: 1.02 },
    { t: 13.0, cx: 1960, cy: 700, z: 0.90 },
    { t: 15.6, cx: 1960, cy: 800, z: 1.30 },
    { t: 19.0, cx: 1970, cy: 790, z: 1.40 },
    { t: 21.5, cx: 1970, cy: 660, z: 1.32 },
    { t: 25.0, cx: 1975, cy: 640, z: 1.48 },
    { t: 28.2, cx: 1970, cy: 660, z: 1.24 },
    { t: 31.0, cx: 1400, cy: 800, z: 0.58 },
    { t: 34.0, cx: 1410, cy: 790, z: 0.61 }
  ];

  function camAt(T) {
    if (T <= CAM[0].t) return CAM[0];
    for (var i = 1; i < CAM.length; i++) {
      if (T <= CAM[i].t) {
        var a = CAM[i - 1], b = CAM[i];
        var u = Easing.easeInOutCubic((T - a.t) / (b.t - a.t));
        return { cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, z: a.z * Math.pow(b.z / a.z, u) };
      }
    }
    return CAM[CAM.length - 1];
  }

  function Chip(p) {
    var s = MOTION.pop(p.at)(p.T);
    if (s <= 0.001) return null;
    var fs = +p.fs || 34;
    var w = Math.max(String(p.text).length * fs * 0.62, p.sub ? String(p.sub).length * fs * 0.7 * 0.56 : 0) + 40;
    w = Math.max(w, 120);
    var h = p.sub ? fs * 2.5 : fs * 1.85;
    var tone = p.tone || C.blue;
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ') scale(' + clamp(s, 0, 1.06) + ')'} opacity={clamp(s * 1.4, 0, 1)}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={C.card} stroke={tone} strokeWidth="3" />
        <text x="0" y={p.sub ? -fs * 0.12 : fs * 0.35} textAnchor="middle" fill={tone} fontSize={fs} fontWeight="800" letterSpacing="1.5">{p.text}</text>
        {p.sub && <text x="0" y={fs * 0.95} textAnchor="middle" fill={C.mute} fontSize={fs * 0.7} fontWeight="700">{p.sub}</text>}
      </g>
    );
  }

  /* serpentin : passes horizontales + coudes, départ haut-gauche, arrivée bas-gauche (n pair) */
  function coilPath(x0, y0, w, h, n) {
    var step = h / (n - 1), bulge = step * 0.9, d = 'M ' + x0 + ' ' + y0;
    for (var i = 0; i < n; i++) {
      var y = y0 + i * step;
      var endX = (i % 2 === 0) ? x0 + w : x0;
      d += ' L ' + endX + ' ' + y;
      if (i < n - 1) {
        var off = (i % 2 === 0) ? bulge : -bulge;
        d += ' Q ' + (endX + off) + ' ' + (y + step / 2) + ' ' + endX + ' ' + (y + step);
      }
    }
    return d;
  }

  function coilFrost(x0, y0, w, h, n, count) {
    var pts = [], step = h / (n - 1), k = 0;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < 5; j++) {
        pts.push([x0 + w * (0.08 + 0.21 * j), y0 + i * step, (k++ % 3)]);
      }
    }
    return pts.slice(0, count);
  }

  function Coil(p) {
    var n = +p.n || 6;
    var x0 = +p.x0, y0 = +p.y0, w = +p.w, h = +p.h;
    var step = h / (n - 1);
    var d = coilPath(x0, y0, w, h, n);
    var fins = [];
    for (var fx = x0 + 14; fx < x0 + w; fx += 26) fins.push(fx);
    var frost = p.frost ? coilFrost(x0, y0, w, h, n, Math.round(p.frost * 30)) : [];
    return (
      <g>
        <rect x={x0 - 30} y={y0 - 40} width={w + step * 0.9 + 52} height={h + 80} rx="14"
              fill={C.card} stroke={C.blue} strokeWidth="4" />
        {fins.map(function (x) {
          return <line key={x} x1={x} y1={y0 - 26} x2={x} y2={y0 + h + 26} stroke={p.warm ? '#e4cdc4' : '#cfe0ee'} strokeWidth="5" />;
        })}
        <path d={d} fill="none" stroke={C.pipe} strokeWidth="20" strokeLinecap="round" />
        <path d={d} fill="none" stroke={p.col} strokeWidth="11" strokeLinecap="round"
              strokeDasharray="30 26" strokeDashoffset={p.dir * p.phase * 240} opacity={0.18 + 0.82 * p.flow} />
        <line x1={x0 - 30} y1={y0} x2={x0} y2={y0} stroke={C.pipe} strokeWidth="20" strokeLinecap="round" />
        {n % 2 === 1
          ? <line x1={x0 + w} y1={y0 + h} x2={x0 + w + 30} y2={y0 + h} stroke={C.pipe} strokeWidth="20" strokeLinecap="round" />
          : <line x1={x0 - 30} y1={y0 + h} x2={x0} y2={y0 + h} stroke={C.pipe} strokeWidth="20" strokeLinecap="round" />}
        {p.liquid > 0 && (
          <g>
            <clipPath id={'liq-' + p.cid}>
              <rect x={x0 - 40} y={y0 + h + 40 - (h + 80) * p.liquid} width={w + 140} height={(h + 80) * p.liquid} />
            </clipPath>
            <g clipPath={'url(#liq-' + p.cid + ')'}>
              <path d={d} fill="none" stroke="#8fbde0" strokeWidth="13" strokeLinecap="round" />
            </g>
          </g>
        )}
        {frost.map(function (f, i) {
          return <circle key={i} cx={f[0]} cy={f[1]} r={7 + f[2] * 2.5} fill={C.frost} stroke="#c9e0f2" strokeWidth="2" />;
        })}
      </g>
    );
  }

  function Fan(p) {
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ')'}>
        <circle r={p.r} fill={C.card} stroke={C.blue} strokeWidth="4" />
        <g transform={'rotate(' + p.spin + ')'} opacity={0.55 + 0.45 * p.flow}>
          {[0, 120, 240].map(function (dd) {
            return (
              <path key={dd} transform={'rotate(' + dd + ')'}
                    d={'M 0 0 Q ' + (p.r * 0.75) + ' ' + (-p.r * 0.5) + ' ' + (p.r * 0.86) + ' 0'}
                    fill="none" stroke={C.blue} strokeWidth="7" strokeLinecap="round" />
            );
          })}
        </g>
        <circle r={p.r * 0.16} fill={C.blue} />
      </g>
    );
  }

  /* symboles d'archive ------------------------------------------------ */

  function SymCompresseur(p) {
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ') scale(' + p.s + ')'} fill="none" stroke={C.blue} strokeWidth={1.6 / p.s * 1.6}>
        <circle cx="0" cy="0" r="15" fill={C.card} />
        <line x1="-15" y1="0" x2="-17" y2="0" />
        <line x1="15" y1="0" x2="17" y2="0" />
        <line x1="-7" y1="-13" x2="13" y2="-7" />
        <line x1="-7" y1="13" x2="13" y2="7" />
      </g>
    );
  }

  function SymDetendeur(p) {
    var s = p.s;
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ') scale(' + s + ')'} stroke={C.blue} strokeWidth={1.4} fill="none">
        <circle cx="0" cy="-12" r="5.83" fill={C.card} />
        <text x="0" y="-10" textAnchor="middle" fill={C.blue} fontSize="5.2" fontWeight="800" stroke="none">TC</text>
        <line x1="0" y1="-18" x2="0" y2="-20" />
        <polygon points="2,1 0,3 -2,1 -10,5 -10,-5 10,5 10,-5 -2,1 0,0" fill={C.card} stroke={C.orangeText} strokeWidth="1.6" />
        <line x1="0" y1="0" x2="0" y2="-6" stroke={C.orangeText} strokeWidth="1.6" />
        <line x1="10" y1="0" x2="12" y2="0" />
        <line x1="-10" y1="0" x2="-12" y2="0" />
      </g>
    );
  }

  /* compresseur en coupe : carter, huile, liquide accumulé, coup de liquide */
  function Compresseur(p) {
    var cxk = 1300, cyk = 296, r = 38, L = 128;
    var a = (p.spin - 90) * Math.PI / 180;
    var px = cxk + r * Math.cos(a), py = cyk + r * Math.sin(a);
    var pistonY = py - Math.sqrt(Math.max(L * L - (px - cxk) * (px - cxk), 1));
    var up = Math.sin(a) < 0;
    var live = p.flow > 0.05;
    var liq = clamp(+p.carter || 0, 0, 1);
    var oilTop = 424, liqTop = oilTop - 46 * liq;
    var slug = clamp(+p.slug || 0, 0, 1);
    var broke = !!p.broke;
    return (
      <g transform="translate(660,400)">
        <rect x="1120" y="100" width="380" height="352" rx="18" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <rect x="1288" y="112" width="84" height="140" rx="6" fill={C.blueSoft} stroke={C.blue} strokeWidth="4" />
        {slug > 0 && <rect x="1290" y={252 - 130 * slug} width="80" height={130 * slug} fill="#8fbde0" opacity="0.95" />}
        <rect x="1290" y={pistonY - 20} width="80" height="40" rx="4" fill={C.blue} opacity="0.85" />
        <line x1="1330" y1={pistonY} x2={px} y2={py} stroke={broke ? C.red : C.orangeText} strokeWidth="10" strokeLinecap="round" />
        <circle cx={px} cy={py} r="10" fill={broke ? C.red : C.orangeText} />
        <circle cx={cxk} cy={cyk} r={r} fill="none" stroke={C.blue} strokeWidth="5" strokeDasharray="8 9" opacity="0.5" />
        <circle cx={cxk} cy={cyk} r="13" fill={C.blue} />
        <line x1="1120" y1="196" x2="1288" y2="196" stroke={C.blue} strokeWidth="6" />
        <line x1="1372" y1="164" x2="1500" y2="164" stroke={C.red} strokeWidth="6" />
        <path d={'M 1288 186 L 1312 ' + (live && !up ? 208 : 190)} stroke={C.blue} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d={'M 1372 154 L 1348 ' + (live && up ? 130 : 148)} stroke={broke ? C.red : C.red} strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* carter : huile en bas, liquide frigorigène au-dessus */}
        <rect x="1130" y="336" width="360" height="108" rx="8" fill="#f2f6f9" stroke={C.blue} strokeWidth="4" />
        <rect x="1134" y={oilTop} width="352" height="16" fill="#b8912c" />
        {liq > 0.02 && (
          <g>
            <rect x="1134" y={liqTop} width="352" height={oilTop - liqTop} fill="#8fbde0" opacity="0.9" />
            <line x1="1134" y1={liqTop} x2="1486" y2={liqTop} stroke="#5c93bf" strokeWidth="4" />
          </g>
        )}
        <text x="1146" y="438" fill="#7a5f11" fontSize="22" fontWeight="900">HUILE</text>
        {liq > 0.25 && <text x="1246" y={liqTop - 10} fill="#2c6390" fontSize="24" fontWeight="900">LIQUIDE FRIGORIGÈNE</text>}
        {broke && (
          <g>
            <path d="M 1272 118 L 1300 150 L 1276 158 L 1318 200 L 1300 168 L 1330 160 L 1290 112"
                  fill={C.red} stroke={C.red} strokeWidth="6" />
            <rect x="1180" y="60" width="300" height="52" rx="8" fill={C.card} />
            <text x="1330" y="100" textAnchor="middle" fill={C.red} fontSize="38" fontWeight="900" letterSpacing="2">CASSE</text>
          </g>
        )}
        <text x="1112" y="172" textAnchor="end" fill={C.blue} fontSize="30" fontWeight="800">ASPIRATION BP</text>
        <text x="1540" y="138" fill={C.red} fontSize="30" fontWeight="800">REFOULEMENT HP</text>
        <SymCompresseur x="1660" y="300" s={2.4} />
        <text x="1660" y="368" textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="800">SYMBOLE</text>
      </g>
    );
  }

  var P_SUCTION = 'M 1570 1130 L 1700 1130 L 1700 596 L 1780 596';
  var P_DISCHARGE = 'M 2160 564 L 2160 410 L 1570 410';
  var P_LIQUID = 'M 1090 170 L 500 170 L 500 620 L 630 620';
  var P_LOWP = 'M 770 620 L 770 890 L 1090 890';

  function Pipes(p) {
    var lines = [
      { d: P_SUCTION, col: C.blue },
      { d: P_DISCHARGE, col: C.red },
      { d: P_LIQUID, col: C.orangeText },
      { d: P_LOWP, col: C.blue }
    ];
    return (
      <g>
        {lines.map(function (l, i) {
          return <path key={'b' + i} d={l.d} fill="none" stroke={C.pipe} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {lines.map(function (l, i) {
          return (
            <path key={'f' + i} d={l.d} fill="none" stroke={l.col} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="34 30" strokeDashoffset={-p.phase * 240} opacity={0.18 + 0.82 * p.flow} />
          );
        })}
      </g>
    );
  }

  function MigrationFlux(p) {
    if (p.o <= 0.01) return null;
    return (
      <g opacity={p.o}>
        {[P_LIQUID, P_LOWP, P_SUCTION].map(function (d, i) {
          return (
            <path key={i} d={d} fill="none" stroke="#8fbde0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="18 46" strokeDashoffset={(i === 2 ? 1 : -1) * p.T * 46} />
          );
        })}
      </g>
    );
  }

  function Croix(p) {
    var o = clamp((p.T - 13.4) / 1.1, 0, 1);
    return (
      <g opacity={o}>
        <line x1="1300" y1="60" x2="1300" y2="1360" stroke={C.blue} strokeWidth="4" strokeDasharray="22 20" opacity="0.45" />
        <line x1="300" y1="620" x2="2400" y2="620" stroke={C.blue} strokeWidth="4" strokeDasharray="22 20" opacity="0.45" />
        <text x="330" y="118" fill={C.red} fontSize="34" fontWeight="900" letterSpacing="3" opacity="0.8">HAUTE PRESSION</text>
        <text x="330" y="1166" fill={C.blue} fontSize="34" fontWeight="900" letterSpacing="3" opacity="0.8">BASSE PRESSION</text>
      </g>
    );
  }

  function CroixLabels(p) {
    var o = clamp((p.T - 13.4) / 1.1, 0, 1);
    return (
      <g opacity={o}>
        <text x="1256" y="1372" textAnchor="end" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="3">← CÔTÉ LIQUIDE</text>
        <text x="1344" y="1372" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="3">CÔTÉ VAPEUR →</text>
      </g>
    );
  }

  function ChambreFond() {
    return (
      <g>
        <rect x="1000" y="760" width="700" height="530" rx="18" fill="#eaf3f9" stroke={C.blue} strokeWidth="5" strokeDasharray="26 18" />
        <text x="1026" y="814" fill={C.blue} fontSize="32" fontWeight="800" letterSpacing="3">CHAMBRE NÉGATIVE</text>
      </g>
    );
  }

  function Chambre(p) {
    var arrows = [0, 1, 2];
    return (
      <g>
        <Coil cid="evap" x0={1120} y0={890} w={420} h={240} n={5} col={C.blue} dir={-1} phase={p.phase} flow={p.flow} frost={p.frostU} liquid={p.liquid} />
        <Fan x="1300" y="1246" r="38" spin={p.spin} flow={p.flow} />
        {arrows.map(function (i) {
          var op = p.flow * (0.35 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase * 3 - i)));
          var d = (p.phase * 70 + i * 30) % 80;
          return (
            <g key={i} opacity={op}>
              <line x1={1380 + d + i * 96} y1="1246" x2={1430 + d + i * 96} y2="1246" stroke={C.blue} strokeWidth="7" strokeLinecap="round" />
              <path d={'M ' + (1424 + d + i * 96) + ' 1234 L ' + (1446 + d + i * 96) + ' 1246 L ' + (1424 + d + i * 96) + ' 1258 Z'} fill={C.blue} />
            </g>
          );
        })}
        <g>
          <rect x="1010" y="1215" width="96" height="66" rx="8" fill={C.card} stroke={C.orangeText} strokeWidth="4" />
          <text x="1058" y="1261" textAnchor="middle" fill={C.orangeText} fontSize="34" fontWeight="900">B1</text>
          <path d="M 1058 1281 L 1058 1360 L 836 1360 L 836 1520" fill="none" stroke="#93a3b4" strokeWidth="4" strokeDasharray="14 12" />
        </g>
        <Chip T={p.T} at={6.0} x="1300" y="712" text="ÉVAPORATEUR" sub="le liquide s’évapore, il prend la chaleur" fs="34" />
        <g>
          <rect x="1800" y="1030" width="560" height="220" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <text x="1830" y="1082" fill={C.orangeText} fontSize="28" fontWeight="900" letterSpacing="2.5">AIR DE LA CHAMBRE</text>
          <text x="1830" y="1178" fill={p.temp > -14.6 ? C.red : C.blue} fontSize="88" fontWeight="900">{p.temp.toFixed(1)} °C</text>
          <text x="1830" y="1226" fill={C.mute} fontSize="24" fontWeight="700">CONSIGNE −18 · ENCLENCHEMENT −14</text>
          <circle cx="2326" cy="1072" r="14" fill={p.energy > 0.5 ? C.orange : '#d6dde5'} />
        </g>
      </g>
    );
  }

  function Machine(p) {
    var hot = [0, 1, 2];
    return (
      <g>
        <Compresseur spin={p.spin} flow={p.flow} carter={p.carter} slug={p.slug} broke={p.broke} />
        <Coil cid="cond" x0={1120} y0={170} w={420} h={240} n={5} col={C.red} dir={1} phase={p.phase} flow={p.flow} warm={true} />
        <Fan x="1700" y="290" r="46" spin={-p.spin * 0.8} flow={p.flow} />
        {hot.map(function (i) {
          var op = p.flow * (0.3 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase * 2.6 - i * 1.2)));
          var d = (p.phase * 60 + i * 26) % 80;
          return (
            <g key={i} opacity={op}>
              <line x1={1160 + i * 150} y1={120 - d} x2={1160 + i * 150} y2={60 - d} stroke={C.red} strokeWidth="7" strokeLinecap="round" />
              <path d={'M ' + (1147 + i * 150) + ' ' + (72 - d) + ' L ' + (1160 + i * 150) + ' ' + (48 - d) + ' L ' + (1173 + i * 150) + ' ' + (72 - d) + ' Z'} fill={C.red} />
            </g>
          );
        })}
        <SymDetendeur x="700" y="620" s="7" />
        <g>
          <polygon points="458,348 542,348 500,400" fill={p.live ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
          <polygon points="458,452 542,452 500,400" fill={p.live ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
          <rect x="542" y="368" width="86" height="64" fill={p.live ? '#fff0e9' : C.card} stroke={p.live ? C.orangeText : C.blue} strokeWidth="6" />
          <line x1="542" y1="432" x2="628" y2="368" stroke={p.live ? C.orangeText : C.blue} strokeWidth="6" />
          <text x="648" y="392" fill={C.blue} fontSize="38" fontWeight="900">Y1</text>
          <text x="648" y="436" fill={p.live ? C.orangeText : C.mute} fontSize="28" fontWeight="800">{p.live ? 'OUVERTE' : 'FERMÉE'}</text>
        </g>
        <g opacity={clamp((p.T - 2.8) / 0.8, 0, 1)}>
          <circle cx="1700" cy="410" r="15" fill={C.card} stroke={C.red} strokeWidth="6" />
          <line x1="1700" y1="425" x2="1700" y2="486" stroke={C.red} strokeWidth="5" strokeDasharray="14 10" />
          <text x="1726" y="496" fill={C.red} fontSize="28" fontWeight="800">PRISE HP</text>
          <circle cx="1700" cy="880" r="15" fill={C.card} stroke={C.blue} strokeWidth="6" />
          <line x1="1715" y1="880" x2="1786" y2="880" stroke={C.blue} strokeWidth="5" strokeDasharray="14 10" />
          <text x="1798" y="890" fill={C.blue} fontSize="28" fontWeight="800">PRISE BP</text>
        </g>
        <Chip T={p.T} at={2.4} x="500" y="252" text="ÉLECTROVANNE Y1" sub="elle ouvre la ligne liquide" fs="34" tone={C.orangeText} />
        <g opacity={clamp((p.T - 20.2) / 0.8, 0, 1)}>
          <path d="M 1730 1050 L 1820 1050 L 1820 770 L 880 770 L 880 440 L 700 440 L 700 478"
                fill="none" stroke="#7d8b9a" strokeWidth="5" strokeDasharray="16 12" />
          <rect x="1674" y="1018" width="52" height="64" rx="22" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <line x1="1678" y1="1034" x2="1722" y2="1034" stroke={C.blue} strokeWidth="4" />
          <line x1="1678" y1="1066" x2="1722" y2="1066" stroke={C.blue} strokeWidth="4" />
          <text x="1700" y="1002" textAnchor="middle" fill={C.blue} fontSize="30" fontWeight="900">BULBE</text>
          <text x="908" y="600" fill={C.mute} fontSize="26" fontWeight="700">capillaire</text>
        </g>
        <Chip T={p.T} at={13.4} x="1970" y="960" text="COMPRESSEUR" sub="carter : huile et liquide" fs="34" />
        <Chip T={p.T} at={1.2} x="1300" y="520" text="CONDENSEUR" sub="la vapeur redevient liquide" fs="34" />
        <Chip T={p.T} at={1.8} x="700" y="760" text="DÉTENDEUR THERMOSTATIQUE" sub="bulbe TC · la pression tombe" fs="34" tone={C.orangeText} />
      </g>
    );
  }

  function PipeChips(p) {
    return (
      <g>
        <Chip T={p.T} at={15.0} x="1920" y="1322" text="BP · VAPEUR FROIDE" tone={C.blue} fs="30" />
        <Chip T={p.T} at={17.6} x="1820" y="330" text="HP · GAZ CHAUD" tone={C.red} fs="30" />
        <Chip T={p.T} at={19.6} x="920" y="108" text="HP · LIQUIDE" tone={C.orangeText} fs="30" />
        <Chip T={p.T} at={21.6} x="600" y="920" text="BP · MÉLANGE FROID" tone={C.blue} fs="30" />
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var tStart = CUES.Redemarrage + 1.2;
    var tBreak = CUES.Casse + 0.5;

    var drain = clamp((T - tStart) / 1.8, 0, 1);
    var evapLiq = animate({ from: 0, to: 1, start: CUES.Migration + 0.4, end: CUES.Migration + 8, ease: Easing.easeInOutSine })(T) * (1 - drain);
    var carterLiq = animate({ from: 0, to: 1, start: CUES.Migration + 6, end: CUES.Carter + 4.4, ease: Easing.easeInOutSine })(T) * (1 - drain);
    var slug = clamp((T - tStart - 0.8) / 1.0, 0, 1);
    var flow = T < tStart ? 0 : (T < tBreak ? clamp((T - tStart) / 0.8, 0, 1) : 0);
    var phase = clamp(T, tStart, tBreak) - tStart;
    var broke = T >= tBreak;
    var energy = T >= tStart && T < tBreak ? 1 : 0;
    var migO = clamp((T - CUES.Migration) / 0.8, 0, 1) * clamp(1 - (T - tStart) / 0.6, 0, 1);

    var riseA = animate({ from: -18, to: -7.5, start: 0, end: tStart, ease: Easing.linear });
    var post = animate({ from: -7.5, to: -5.4, start: tStart, end: c.authoredTotal, ease: Easing.linear });
    var temp = T < tStart ? riseA(T) : post(T);

    var cam = camAt(T);
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.Casse + 2.6, 0.9)(T);

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond />
            <Pipes phase={phase} flow={flow} />
            <MigrationFlux T={T} o={migO} />
            <Chambre T={T} temp={temp} spin={phase * 300} flow={flow} phase={phase} energy={energy}
                     frostU={0} liquid={evapLiq} />
            <Machine T={T} spin={phase * 300} flow={flow} phase={phase} live={energy > 0.5}
                     carter={carterLiq} slug={slug} broke={broke} />
            <CroixLabels T={T} />
          </g>
        </svg>

        <div style={{ position: 'absolute', inset: 0, background: C.paper, opacity: keyIn * 0.58, pointerEvents: 'none' }} />

        <div style={{
          position: 'absolute', left: '6%', right: '6%', top: '7%', opacity: keyIn,
          transform: 'translateY(' + (1 - keyIn) * -26 + 'px)', pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,253,248,0.95)', border: '3px solid ' + C.red, borderLeft: '16px solid ' + C.red,
            borderRadius: 18, padding: '26px 38px', boxShadow: '0 18px 50px rgba(27,58,99,0.18)'
          }}>
            <div style={{ color: C.red, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 2 · LE PROBLÈME À CONNAÎTRE</div>
            <div style={{ color: C.blue, font: '900 54px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Le fluide migre vers le point le plus froid.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Au redémarrage, le liquide arrive au compresseur : coup de liquide, puis casse.
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
              { at: 0.4, text: 'Installation à l’arrêt : le thermostat est satisfait.' },
              { at: 2.8, text: 'Mais le fluide, lui, ne dort pas.' },
              { at: CUES.Migration + 0.4, text: 'Le fluide migre toujours vers le point le plus froid.' },
              { at: CUES.Migration + 3.2, text: 'Ici l’évaporateur : la vapeur s’y condense et le liquide s’accumule.' },
              { at: CUES.Migration + 6.4, text: 'En hiver, le point le plus froid peut être le compresseur lui-même.' },
              { at: CUES.Carter + 0.4, text: 'Dans le carter, le liquide s’accumule au-dessus de l’huile.' },
              { at: CUES.Carter + 3.2, text: 'L’huile est diluée : le graissage n’est plus assuré.' },
              { at: CUES.Redemarrage + 0.3, text: 'Le thermostat redemande du froid : KM1 colle.' },
              { at: CUES.Redemarrage + 2.6, text: 'Le piston aspire du liquide — et un liquide ne se comprime pas.' },
              { at: CUES.Redemarrage + 5.2, text: 'La pression monte d’un coup dans le cylindre.' },
              { at: CUES.Casse + 0.6, text: 'Coup de liquide : clapets, bielle, joint de culasse.' },
              { at: CUES.Casse + 2.4, until: 99, text: '' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesMigrationLiquide() {
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

  window.RegulesMigrationLiquide = RegulesMigrationLiquide;
})();
