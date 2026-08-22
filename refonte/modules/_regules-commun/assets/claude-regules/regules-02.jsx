/* Les régules · Station 2 — La protection minimum (croix du frigoriste)
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
    { t: 0.0, cx: 1570, cy: 1040, z: 1.00 },
    { t: 5.4, cx: 2020, cy: 1120, z: 1.12 },
    { t: 6.3, cx: 1060, cy: 1730, z: 1.02 },
    { t: 8.1, cx: 1010, cy: 1730, z: 1.10 },
    { t: 9.8, cx: 1560, cy: 1730, z: 0.92 },
    { t: 12.4, cx: 1960, cy: 1730, z: 0.96 },
    { t: 13.7, cx: 1350, cy: 710, z: 0.72 },
    { t: 16.3, cx: 1970, cy: 640, z: 0.98 },
    { t: 19.0, cx: 1300, cy: 300, z: 0.94 },
    { t: 21.0, cx: 600, cy: 500, z: 0.88 },
    { t: 22.7, cx: 1350, cy: 1040, z: 0.98 },
    { t: 23.9, cx: 2020, cy: 1120, z: 1.06 },
    { t: 26.1, cx: 2020, cy: 1110, z: 1.12 },
    { t: 27.0, cx: 1330, cy: 1050, z: 0.50 },
    { t: 30.6, cx: 1340, cy: 1070, z: 0.53 },
    { t: 31.6, cx: 1330, cy: 1030, z: 0.94 },
    { t: 34.6, cx: 1960, cy: 830, z: 1.16 },
    { t: 37.2, cx: 1440, cy: 1120, z: 0.50 },
    { t: 38.7, cx: 1300, cy: 2960, z: 0.76 },
    { t: 43.4, cx: 1320, cy: 2950, z: 0.77 },
    { t: 44.5, cx: 1330, cy: 1080, z: 0.52 },
    { t: 47.0, cx: 1340, cy: 1070, z: 0.55 }
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

  /* Refonte du 22/08 (brief F. Henninot) : une étape par plan — la chambre,
     l'armoire (désormais À DROITE de la croix), la croix, les deux ensemble,
     le chronogramme (dessous) — puis le PLAN LARGE total pour la scène
     CycleComplet : électrique, fluidique et graphique en même temps. */
  function camFixed(T) {
    var croix = { cx: 1400, cy: 720, z: 0.74 };
    var large = { cx: 2645, cy: 1210, z: 0.40 };
    var V = [
      { t: 0, v: { cx: 1420, cy: 1010, z: 0.90 } },
      { t: 6, v: { cx: 3755, cy: 1010, z: 0.70 } },
      { t: 13, v: croix },
      { t: 23, v: { cx: 2650, cy: 1000, z: 0.40 } },
      { t: 31, v: croix },
      { t: 38, v: { cx: 2235, cy: 1980, z: 0.70 } },
      { t: 44, v: large },
      { t: 60, v: large }
    ];
    var k = V[0].v;
    for (var i = 0; i < V.length; i++) if (T >= V[i].t) k = V[i].v;
    return k;
  }

  function Chip(p) {
    /* Brief du 22/08 : une étiquette se montre UNE fois puis se retire —
       l'image doit se nettoyer pour laisser lire l'action. `hold` = durée
       d'affichage ; sans hold, l'étiquette reste (cartes de synthèse). */
    var s = MOTION.pop(p.at)(p.T);
    var sortie = p.hold ? clamp(1 - (p.T - (+p.at + +p.hold)) / 0.8, 0, 1) : 1;
    s = s * sortie;
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
              <path d={d} fill="none" stroke="#5d9dcd" strokeWidth="22" strokeLinecap="round" />
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

  /* compresseur en coupe : vilebrequin, bielle, piston ---------------- */
  function Compresseur(p) {
    var cxk = 1300, cyk = 296, r = 38, L = 128;
    /* dessiné dans son repère d'origine, reporté à droite de la croix */
    var a = (p.spin - 90) * Math.PI / 180;
    var px = cxk + r * Math.cos(a), py = cyk + r * Math.sin(a);
    var pistonY = py - Math.sqrt(Math.max(L * L - (px - cxk) * (px - cxk), 1));
    var up = Math.sin(a) < 0;
    var live = p.flow > 0.05;
    return (
      <g transform="translate(660,400)">
        <rect x="1120" y="100" width="380" height="352" rx="18" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <rect x="1288" y="112" width="84" height="140" rx="6" fill={C.blueSoft} stroke={C.blue} strokeWidth="4" />
        <rect x="1290" y={pistonY - 20} width="80" height="40" rx="4" fill={C.blue} opacity="0.85" />
        <line x1="1330" y1={pistonY} x2={px} y2={py} stroke={C.orangeText} strokeWidth="10" strokeLinecap="round" />
        <circle cx={px} cy={py} r="10" fill={C.orangeText} />
        <circle cx={cxk} cy={cyk} r={r} fill="none" stroke={C.blue} strokeWidth="5" strokeDasharray="8 9" opacity="0.5" />
        <circle cx={cxk} cy={cyk} r="13" fill={C.blue} />
        <line x1="1120" y1="196" x2="1288" y2="196" stroke={C.blue} strokeWidth="6" />
        <line x1="1372" y1="164" x2="1500" y2="164" stroke={C.red} strokeWidth="6" />
        <path d={'M 1288 186 L 1312 ' + (live && !up ? 208 : 190)} stroke={C.blue} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d={'M 1372 154 L 1348 ' + (live && up ? 130 : 148)} stroke={C.red} strokeWidth="7" strokeLinecap="round" fill="none" />
        <rect x="1130" y="336" width="360" height="108" rx="8" fill="#f2f6f9" stroke={C.blue} strokeWidth="4" />
        <rect x="1134" y="424" width="352" height="16" fill="#b8912c" />
        {(+p.carter || 0) > 0.02 && (
          <g>
            <rect x="1134" y={424 - 46 * clamp(+p.carter, 0, 1)} width="352" height={46 * clamp(+p.carter, 0, 1)} fill="#5d9dcd" opacity="0.95" />
            <line x1="1134" y1={424 - 46 * clamp(+p.carter, 0, 1)} x2="1486" y2={424 - 46 * clamp(+p.carter, 0, 1)} stroke="#5c93bf" strokeWidth="4" />
          </g>
        )}
        <text x="1146" y="438" fill="#7a5f11" fontSize="22" fontWeight="900">HUILE</text>
        {(+p.carter || 0) > 0.3 && <text x="1246" y={410 - 46 * clamp(+p.carter, 0, 1)} fill="#2c6390" fontSize="24" fontWeight="900">LIQUIDE FRIGORIGÈNE</text>}
        <text x="1112" y="172" textAnchor="end" fill={C.blue} fontSize="30" fontWeight="800">ASPIRATION BP</text>
        <text x="1540" y="138" fill={C.red} fontSize="30" fontWeight="800">REFOULEMENT HP</text>
        <SymCompresseur x="1660" y="300" s={2.4} />
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
            <path key={i} d={d} fill="none" stroke="#5d9dcd" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="34 54" strokeDashoffset={(i === 2 ? 1 : -1) * p.T * 46} />
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
        <Coil cid={p.cid} x0={1120} y0={890} w={420} h={240} n={5} col={C.blue} dir={-1} phase={p.phase} flow={p.flow} frost={p.frostU} liquid={p.liquid} />
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
          {/* La sonde rejoint son contact dans l'armoire, désormais à droite :
             le pointillé passe SOUS la croix, sans traverser aucun tracé. */}
          <path d="M 1058 1281 L 1058 1450 L 2600 1450 L 2600 1320" fill="none" stroke="#93a3b4" strokeWidth="4" strokeDasharray="14 12" />
        </g>
        <Chip T={p.T} at={22.4} hold={5} x="1300" y="712" text="ÉVAPORATEUR" sub="le liquide s’évapore, il prend la chaleur" fs="34" />
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
        <Compresseur spin={p.spin} flow={p.flow} carter={p.carter} />
        <Coil cid={p.cid + '-c'} x0={1120} y0={170} w={420} h={240} n={5} col={C.red} dir={1} phase={p.phase} flow={p.flow} warm={true} />
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
        <g opacity={clamp((p.T - 14.6) / 0.8, 0, 1)}>
          <circle cx="1700" cy="410" r="15" fill={C.card} stroke={C.red} strokeWidth="6" />
          <line x1="1700" y1="425" x2="1700" y2="486" stroke={C.red} strokeWidth="5" strokeDasharray="14 10" />
          <circle cx="1700" cy="880" r="15" fill={C.card} stroke={C.blue} strokeWidth="6" />
          <line x1="1715" y1="880" x2="1786" y2="880" stroke={C.blue} strokeWidth="5" strokeDasharray="14 10" />
          {/* Les piquages restent (ils sont l'installation) ; leurs noms se
             retirent avec les autres étiquettes — brief du 22/08. */}
          <g opacity={clamp(1 - (p.T - 26) / 0.8, 0, 1)}>
            <text x="1726" y="496" fill={C.red} fontSize="28" fontWeight="800">PRISE HP</text>
            <text x="1798" y="890" fill={C.blue} fontSize="28" fontWeight="800">PRISE BP</text>
          </g>
        </g>
        <Chip T={p.T} at={13.9} hold={5} x="500" y="252" text="ÉLECTROVANNE Y1" sub="elle ouvre la ligne liquide" fs="34" tone={C.orangeText} />
        <g opacity={clamp((p.T - 20.2) / 0.8, 0, 1)}>
          <path d="M 1730 1050 L 1820 1050 L 1820 770 L 880 770 L 880 440 L 700 440 L 700 478"
                fill="none" stroke="#7d8b9a" strokeWidth="5" strokeDasharray="16 12" />
          <rect x="1674" y="1018" width="52" height="64" rx="22" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <line x1="1678" y1="1034" x2="1722" y2="1034" stroke={C.blue} strokeWidth="4" />
          <line x1="1678" y1="1066" x2="1722" y2="1066" stroke={C.blue} strokeWidth="4" />
          <g opacity={clamp(1 - (p.T - 26) / 0.8, 0, 1)}>
            <text x="1700" y="1002" textAnchor="middle" fill={C.blue} fontSize="30" fontWeight="900">BULBE</text>
            <text x="908" y="600" fill={C.mute} fontSize="26" fontWeight="700">capillaire</text>
          </g>
        </g>
        <Chip T={p.T} at={16.0} hold={5} x="1970" y="1000" text="COMPRESSEUR" sub="bielle-piston : la pression monte" fs="34" />
        <Chip T={p.T} at={18.6} hold={5} x="1300" y="520" text="CONDENSEUR" sub="la vapeur redevient liquide" fs="34" />
        <Chip T={p.T} at={20.8} hold={5} x="700" y="760" text="DÉTENDEUR THERMOSTATIQUE" sub="bulbe TC · la pression tombe" fs="34" tone={C.orangeText} />
      </g>
    );
  }

  function PipeChips(p) {
    return (
      <g>
        <Chip T={p.T} at={15.0} hold={5} x="1920" y="1322" text="BP · VAPEUR FROIDE" tone={C.blue} fs="30" />
        <Chip T={p.T} at={17.6} hold={5} x="1820" y="330" text="HP · GAZ CHAUD" tone={C.red} fs="30" />
        <Chip T={p.T} at={19.6} hold={5} x="920" y="108" text="HP · LIQUIDE" tone={C.orangeText} fs="30" />
        <Chip T={p.T} at={21.6} hold={5} x="600" y="920" text="BP · MÉLANGE FROID" tone={C.blue} fs="30" />
      </g>
    );
  }

  /* Appareillage de commande, repères NF EN 60617-7 — mêmes tracés que `regules-kit.jsx` :
     organe de commande encadré, barre du contact fixe, et un contact à ouverture qui sait
     s'ouvrir. */

  function OrganeCmd(p) {
    var x = +p.x, y = +p.y, cote = p.compact ? 58 : 88;
    var haut = y - (p.compact ? 68 : 128);
    return (
      <g>
        <line x1={x} y1={y} x2={x} y2={haut + cote} stroke={C.wire} strokeWidth="5" strokeDasharray="13 11" />
        <rect x={x - cote / 2} y={haut} width={cote} height={cote} fill="none" stroke={C.wire} strokeWidth="5" />
        <text x={x} y={haut + cote * 0.74} textAnchor="middle" fill={C.blue}
              fontSize={p.compact ? 40 : 60} fontWeight="900">{p.glyph}</text>
      </g>
    );
  }

  function Bornes(p) {
    var x = +p.x, y = +p.y;
    return (
      <g fill={C.mute} fontSize="26" fontWeight="700">
        <text x={x - 4} y={y - 18} textAnchor="end">{p.gauche}</text>
        <text x={+p.x2 + 4} y={y - 18}>{p.droite}</text>
      </g>
    );
  }

  function ContactNO(p) {
    var x = +p.x, y = +p.y, arm = +p.arm || 0;
    return (
      <g>
        <g transform={'translate(' + x + ',' + y + ') rotate(' + arm + ')'}>
          <line x1="0" y1="0" x2="140" y2="0" stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        </g>
        <circle cx={x} cy={y} r="10" fill={C.wire} />
        <circle cx={x + 140} cy={y} r="10" fill={C.wire} />
        <OrganeCmd x={x + 70} y={y} glyph={p.glyph || 'θ'} compact={p.compact} />
        <Bornes x={x} x2={x + 140} y={y} gauche="13" droite="14" />
        <text x={x + 70} y={y + 100} textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">{p.code}</text>
        <text x={x + 70} y={y + 140} textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  function Disjoncteur(p) {
    var x = +p.x, y = +p.y;
    return (
      <g>
        <circle cx={x} cy={y} r="10" fill={C.wire} />
        <circle cx={x + 152} cy={y} r="10" fill={C.wire} />
        <line x1={x} y1={y} x2={x + 28} y2={y} stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        <line x1={x + 28} y1={y} x2={x + 124} y2={y - 26} stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        <line x1={x + 124} y1={y} x2={x + 152} y2={y} stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        <line x1={x + 14} y1={y - 16} x2={x + 42} y2={y + 12} stroke={C.wire} strokeWidth="7" strokeLinecap="round" />
        <line x1={x + 42} y1={y - 16} x2={x + 14} y2={y + 12} stroke={C.wire} strokeWidth="7" strokeLinecap="round" />
        <path d={'M ' + (x + 124) + ' ' + y + ' A 22 18 0 0 0 ' + (x + 124) + ' ' + (y - 34)}
              fill="none" stroke={C.wire} strokeWidth="7" />
        <text x={x + 76} y={y + 100} textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">{p.code || 'Q1'}</text>
        <text x={x + 76} y={y + 140} textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="700">{p.sub || 'protection de la commande'}</text>
      </g>
    );
  }

  function ContactNF(p) {
    var x = +p.x, y = +p.y;
    var ouv = p.open === true ? 1 : (p.open === false ? 0 : clamp(+p.open || 0, 0, 1));
    var vif = p.live && ouv < 0.5;
    return (
      <g>
        <circle cx={x} cy={y} r="10" fill={C.wire} />
        <circle cx={x + 152} cy={y} r="10" fill={C.wire} />
        <line x1={x} y1={y} x2={x + 44} y2={y} stroke={vif ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        <line x1={x + 112} y1={y} x2={x + 152} y2={y} stroke={vif ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        <line x1={x + 44} y1={y + 6} x2={x + 44} y2={y - 32} stroke={C.wire} strokeWidth="9" strokeLinecap="round" />
        <g transform={'rotate(' + (18 * ouv) + ',' + (x + 112) + ',' + y + ')'}>
          <line x1={x + 112} y1={y} x2={x + 40} y2={y - 24}
                stroke={vif ? C.orangeText : C.wire} strokeWidth="11" strokeLinecap="round" />
        </g>
        <Bornes x={x} x2={x + 152} y={y} gauche="11" droite="12" />
        <OrganeCmd x={x + 76} y={y} glyph={p.glyph || 'p'} compact={p.compact} />
        <text x={x + 76} y={y + 100} textAnchor="middle" fill={p.fault ? C.red : C.blue} fontSize="34" fontWeight="900">{p.code}</text>
        <text x={x + 76} y={y + 140} textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="700">{p.sub}</text>
        {p.fault && <circle cx={x + 76} cy={y} r="98" fill="none" stroke={C.red} strokeWidth="6" strokeDasharray="18 14" opacity="0.8" />}
      </g>
    );
  }

  function Bobine(p) {
    return (
      <g>
        <rect x={p.x} y={p.y - 46} width="160" height="92" fill={p.live ? '#fff0e9' : C.blueSoft}
              stroke={p.live ? C.orangeText : C.blue} strokeWidth="8" />
        <text x={p.x + 80} y={p.y + 14} textAnchor="middle" fill={p.live ? C.orangeText : C.blue} fontSize="42" fontWeight="900">{p.code}</text>
        <text x={p.x + 80} y={p.y + (p.above ? -66 : 84)} textAnchor="middle" fill={C.mute} fontSize="28" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  function Cabinet(p) {
    var T = p.T;
    var reveal = clamp((T - p.tClose) / 0.45, 0, 1) * (T < p.tOpen ? 1 : clamp(1 - (T - p.tOpen) / 0.2, 0, 1));
    var live = reveal > 0.4;
    /* Le defaut haute pression que le chronogramme annonce : ici on le voit couper. */
    var hpDefaut = clamp((T - 41.6) / 0.4, 0, 1);
    var flux = function (d, on) {
      return (
        <path d={d} fill="none" stroke={C.orange} strokeWidth="13" strokeLinecap="round"
              strokeDasharray="26 22" strokeDashoffset={-p.phaseAll * 200} opacity={on} />
      );
    };
    return (
      /* Refonte 22/08 : l'armoire vit À DROITE de la croix — électrique et
         fluidique se lisent ensemble, sur la même page. */
      <g transform="translate(2450,-400)">
        <rect x="70" y="1100" width="2470" height="620" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1170" fill={C.orangeText} fontSize="34" fontWeight="900" letterSpacing="3">ARMOIRE · PROTECTION MINIMUM</text>

        <line x1="340" y1="1230" x2="340" y2="1650" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <line x1="2270" y1="1230" x2="2270" y2="1650" stroke={C.blue} strokeWidth="14" strokeLinecap="round" />
        <text x="340" y="1700" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="2270" y="1700" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        {/* La chaine se lit comme on la cable : protection, securites, puis regulation. */}
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M 340 1400 L 420 1400" />
          <path d="M 572 1400 L 760 1400" />
          <path d="M 912 1400 L 1100 1400" />
          <path d="M 1252 1400 L 1440 1400" />
          <path d="M 1580 1400 L 1700 1400 M 1700 1300 L 1700 1500 M 1700 1300 L 1820 1300 M 1700 1500 L 1820 1500" />
          <path d="M 1982 1300 L 2270 1300 M 1982 1500 L 2270 1500 M 2270 1300 L 2270 1500" />
        </g>

        {flux("M 340 1400 L 420 1400", 0.85)}
        {flux("M 572 1400 L 760 1400", 0.85 * (1 - hpDefaut))}
        <g opacity={reveal * (1 - hpDefaut)}>
          {flux("M 912 1400 L 1100 1400 M 1252 1400 L 1440 1400 M 1580 1400 L 1700 1400 M 1700 1300 L 1700 1500 M 1700 1300 L 1820 1300 M 1700 1500 L 1820 1500 M 1982 1300 L 2270 1300 M 1982 1500 L 2270 1500 M 2270 1300 L 2270 1650", 1)}
        </g>

        <Disjoncteur x={420} y={1400} live={true} code="Q1" sub="protection de la commande" />

        {/* Les deux securites, en tete : elles coupent quoi que demande le thermostat. */}
        <ContactNF x={760} y={1400} live={live} code="HP" sub="sécurité haute pression"
                   glyph="p" open={hpDefaut} fault={hpDefaut > 0.5} />
        <ContactNF x={1100} y={1400} live={live && hpDefaut < 0.5} code="BP" sub="sécurité basse pression" glyph="p" />

        {/* Le thermostat vient apres : il demande le froid, il ne protege rien. */}
        <ContactNO x={1440} y={1400} arm={p.arm} live={live && hpDefaut < 0.5} code="B1" sub="thermostat" glyph="θ" />

        {/* Les deux charges, en parallele : elles tombent ensemble. */}
        <Bobine x={1820} y={1300} code="KM1" sub="CONTACTEUR COMPRESSEUR" live={live && hpDefaut < 0.5} above={true} />
        <Bobine x={1820} y={1500} code="Y1" sub="ÉLECTROVANNE LIGNE LIQUIDE" live={live && hpDefaut < 0.5} />
        <text x="2100" y="1170" textAnchor="middle" fill={C.orangeText} fontSize="30" fontWeight="900" letterSpacing="2">
          LES DEUX CHARGES EN PARALLÈLE
        </text>
        <g opacity={clamp((T - 42.0) / 0.5, 0, 1)}>
          <text x="1300" y="1660" textAnchor="middle" fill={C.red} fontSize="32" fontWeight="900" letterSpacing="2">
            DÉFAUT HP · RÉARMEMENT MANUEL : RIEN NE REPART SEUL
          </text>
        </g>
      </g>
    );
  }

  var CH = { x0: 700, x1: 2420, tempTop: 1990, tempBot: 2180 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chTemp(v) { return CH.tempTop + ((-13 - v) / 6) * (CH.tempBot - CH.tempTop); }

  function Chrono(p) {
    var r = MOTION.draw(38.3, 4.6)(p.T);
    var pts = [[0, -15.4], [0.10, -14], [0.38, -18], [0.55, -14], [0.78, -16.4], [1, -13.2]];
    var tempPath = pts.map(function (q, i) { return (i ? 'L ' : 'M ') + chx(q[0]) + ' ' + chTemp(q[1]); }).join(' ');
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
        <rect x="70" y="1860" width="2470" height="800" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · DEUX CYCLES, PUIS UN DÉFAUT</text>
        {[['AIR DE LA', 2060], ['CHAMBRE', 2106], ['CONTACT B1', 2290], ['SÉCURITÉS HP·BP', 2400], ['KM1 ET Y1', 2510]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="38" fontWeight="800">{l[0]}</text>;
        })}
        {[[-14, '−14 · enclenchement'], [-18, '−18 · consigne']].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chTemp(l[0])} x2={CH.x1} y2={chTemp(l[0])} stroke={C.line} strokeWidth="3" strokeDasharray="14 12" />
              <text x={CH.x0} y={chTemp(l[0]) - 14} fill={C.mute} fontSize="28" fontWeight="700">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip2">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="700" />
        </clipPath>
        <g clipPath="url(#chclip2)">
          <path d={tempPath} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2250, 2320, [[0.10, 0.38], [0.55, 1]])} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2370, 2440, [[0, 0.78]])} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2480, 2550, [[0.10, 0.38], [0.55, 0.78]])} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
        </g>
        <g opacity={note}>
          <line x1={chx(0.78)} y1="1970" x2={chx(0.78)} y2="2560" stroke={C.red} strokeWidth="6" strokeDasharray="18 14" />
          <rect x={chx(0.78) - 300} y="2586" width="600" height="56" rx="8" fill={C.card} />
          <text x={chx(0.78)} y="2628" textAnchor="middle" fill={C.red} fontSize="34" fontWeight="900" letterSpacing="2">DÉFAUT HP · TOUT TOMBE</text>
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2560" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        {/* Pendant la scène CycleComplet, le curseur suit le cycle rejoué :
           les trois vues disent la même chose au même instant. */}
        {p.replayF > 0 && (
          <g>
            <line x1={chx(p.replayF)} y1="1960" x2={chx(p.replayF)} y2="2560" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replayF)} cy="1960" r="16" fill={C.orange} />
          </g>
        )}
        <text x="1560" y="2700" textAnchor="middle" fill={C.orangeText} fontSize="38" fontWeight="900" opacity={note}>
          LE FROID EST DEMANDÉ, MAIS LES DEUX CHARGES SONT TOMBÉES ENSEMBLE
        </text>
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var tClose = CUES.Fermeture + 1.6;
    var tOpen = CUES.Consigne + 3.4;

    /* Scène CycleComplet (brief 22/08) : la séquence se REJOUE en plan large,
       les trois vues ensemble — la confirmation du savoir. Le temps des
       organes (Tm) est remappé sur la plage du cycle nominal ; l'habillage
       (étiquettes, migration, défaut) reste au temps réel, donc éteint. */
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var kRejeu = (tOpen + 3 - (tClose - 1)) / 16;
    var Tm = enRejeu ? (tClose - 1) + (T - CUES.CycleComplet) * kRejeu : T;

    var rise = animate({ from: -15.4, to: -14.0, start: 0, end: tClose, ease: Easing.linear });
    var fall = animate({ from: -14.0, to: -18.0, start: tClose, end: tOpen, ease: Easing.easeInOutSine });
    var drift = animate({ from: -18.0, to: -17.1, start: tOpen, end: c.authoredTotal, ease: Easing.linear });
    var temp = Tm < tClose ? rise(Tm) : (Tm < tOpen ? fall(Tm) : drift(Tm));

    var energy = Tm < tClose ? 0 : (Tm < tOpen ? clamp((Tm - tClose) / 0.3, 0, 1) : clamp(1 - (Tm - tOpen) / 0.25, 0, 1));
    var flow = Tm < tClose ? 0 : (Tm < tOpen ? clamp((Tm - tClose) / 0.9, 0, 1) : clamp(1 - (Tm - tOpen) / 0.7, 0, 1));
    var phase = clamp(Tm, tClose, tOpen) - tClose;
    var frostU = clamp(phase / (tOpen - tClose), 0, 1);
    var arm = Tm < tClose ? -30
      : (Tm < tOpen ? -30 + 30 * clamp(MOTION.pop(tClose)(Tm), 0, 1.08) : -30 * clamp((Tm - tOpen) / 0.18, 0, 1));
    var replayF = enRejeu
      ? 0.10 + 0.28 * clamp((Tm - tClose) / (tOpen - tClose), 0, 1) + 0.02 * clamp((Tm - tOpen) / 3, 0, 1)
      : 0;

    var mig = animate({ from: 0, to: 1, start: CUES.Migration + 0.6, end: CUES.Migration + 5.5, ease: Easing.easeInOutSine })(T);
    var migO = clamp((T - CUES.Migration) / 0.8, 0, 1) * clamp(1 - (T - CUES.Migration - 6.4) / 0.8, 0, 1);
    var risque = clamp((T - CUES.Migration - 5.0) / 0.8, 0, 1) * clamp(1 - (T - CUES.Chronologie + 0.4) / 0.6, 0, 1);

    var cam = props.fixedCam !== false ? camFixed(T) : camAt(T);
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);

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
            <Chambre T={T} temp={temp} spin={phase * 300} flow={flow} phase={phase} energy={energy} frostU={frostU} liquid={mig * 0.34} cid="s" />
            <Machine T={T} carter={mig * 0.08} spin={phase * 300} flow={flow} phase={phase} live={energy > 0.5} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <Cabinet T={Tm} arm={arm} tClose={tClose} tOpen={tOpen} phaseAll={T} />
            <Chrono T={T} replayF={replayF} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', left: '8%', right: '8%', top: '9%', opacity: risque * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 38px ' + font, letterSpacing: 2 }}>RISQUE LIMITÉ · Y1 PIÈGE LE LIQUIDE EN HP</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>il reste un peu de liquide dans la partie la plus froide</div>
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 2 · LA PROTECTION MINIMUM</div>
            <div style={{ color: C.blue, font: '900 54px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Thermostat et pressostats autorisent ensemble KM1 et Y1.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Une seule chaîne en série : toutes les charges tombent au même instant.
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
              { at: CUES.Fermeture + 2.6, text: 'Mais le courant doit encore traverser les deux sécurités.' },
              { at: CUES.Fermeture + 4.4, text: 'HP et BP sont fermés : la chaîne série est complète.' },
              { at: CUES.Fermeture + 6.0, text: 'KM1 et Y1 sont alimentés en même temps.' },
              { at: CUES.Circulation + 0.5, text: 'L’électrovanne Y1 ouvre la ligne liquide.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Le pressostat HP est piqué au refoulement, le BP à l’aspiration.' },
              { at: CUES.Circulation + 7.4, text: 'Le détendeur thermostatique fait tomber la pression.' },
              { at: CUES.Circulation + 9.0, text: 'Dans le serpentin, le liquide s’évapore : le givre se dépose.' },
              { at: CUES.Consigne + 0.4, text: 'L’air atteint la consigne : −18 °C.' },
              { at: CUES.Consigne + 3.6, text: 'Le thermostat ouvre : KM1 et Y1 tombent au même instant.' },
              { at: CUES.Consigne + 6.0, text: 'Une seule chaîne en série : aucune charge ne reste seule.' },
              { at: CUES.Migration + 0.4, text: 'À l’arrêt, Y1 se referme : la ligne liquide est coupée.' },
              { at: CUES.Migration + 2.6, text: 'Le liquide reste piégé en haute pression, avant l’électrovanne.' },
              { at: CUES.Migration + 4.4, text: 'Il n’en migre qu’un peu, dans la partie la plus froide.' },
              { at: CUES.Migration + 6.2, text: 'Le carter reste propre : le risque de coup de liquide est limité.' },
              { at: CUES.Chronologie + 0.4, text: 'Deux cycles, puis un défaut de haute pression.' },
              { at: CUES.Chronologie + 3.4, until: CUES.CycleComplet, text: 'La sécurité coupe tout, même si le froid est encore demandé.' },
              { at: CUES.CycleComplet + 0.5, text: 'Le cycle complet, d’un seul regard : l’électrique commande, le fluide obéit.' },
              { at: CUES.CycleComplet + 4.5, text: 'B1 ferme : la chaîne série alimente KM1 et Y1 — le froid s’installe.' },
              { at: CUES.CycleComplet + 9.0, text: 'Suivez le curseur orange : le chronogramme dit la même chose que les schémas.' },
              { at: CUES.CycleComplet + 13.0, until: CUES.LaCle, text: 'Consigne atteinte : les deux charges tombent au même instant.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesProtectionMinimum() {
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

  window.RegulesProtectionMinimum = RegulesProtectionMinimum;
})();
