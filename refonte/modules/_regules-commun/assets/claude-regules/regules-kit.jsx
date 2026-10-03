/* Les régules · kit commun (croix du frigoriste, symboles, appareillage)
   Chargé avant chaque station : expose window.RK. */
(function () {
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

  /* Refonte du 23/08 (F. Henninot : « une page qui reprend tout, et tu
     surlignes ») : la caméra NE BOUGE PLUS — les changements de vue donnaient
     mal au cœur. Plan général en permanence ; les anciens cadrages par étape
     (camPaliers) servent désormais de zones au SURLIGNEUR (Spot). */
  /* `droite` = bord droit du canvas du film (l'armoire VERTICALE du 22/08
     n'a pas la même largeur partout : 2 colonnes au 03, 4 au 08). */
  function camFixed(T, droite) {
    var D = droite || 4180;
    return { cx: (300 + D) / 2, cy: 1240, z: Math.min(1920 / (D - 260), 0.465) };
  }

  /* Les étapes du brief du 22/08 — la chambre, l'armoire, la croix, le duo,
     le chronogramme, le plan large — gardées telles quelles : ce sont elles
     que le surligneur parcourt, aux mêmes instants qu'avant. */
  function camPaliers(droite) {
    var D = droite || 4180;
    var croix = { cx: 1400, cy: 720, z: 0.74 };
    var duo = { cx: (300 + D) / 2, cy: 830, z: Math.min(1920 / (D - 260), 0.52) };
    var large = camFixed(0, D);
    return [
      { t: 0, v: { cx: 1420, cy: 1010, z: 0.90 } },
      { t: 6, v: { cx: 2520 + (D - 2520) / 2, cy: 820, z: 0.66 } },
      { t: 13, v: croix },
      { t: 23, v: duo },
      { t: 31, v: croix },
      { t: 38, v: { cx: 1505, cy: 1980, z: 0.70 } },
      { t: 44, v: large },
      { t: 60, v: large }
    ];
  }

  /* Le surligneur du 23/08 : il remplace les déplacements de caméra. Cadre
     ambre + voile jaune très léger sur la zone dont la voix parle — jamais
     rouge ni orange, qui disent déjà « phase » et « retour neutre ». Il
     glisse d'une zone à l'autre (0,9 s) ; l'image, elle, reste plein cadre,
     et il s'efface quand la zone est le plan entier. */
  function Spot(p) {
    var T = p.T, V = p.V, cam = p.cam, m = p.marge || 0.86;
    var idx = 0;
    for (var i = 0; i < V.length; i++) if (T >= V[i].t) idx = i;
    function zone(v) {
      var w = 1920 / v.z * m, h = 1080 / v.z * m;
      return { x: v.cx - w / 2, y: v.cy - h / 2, w: w, h: h };
    }
    var a = zone(V[idx > 0 ? idx - 1 : 0].v), b = zone(V[idx].v);
    var u = idx === 0 ? 1 : Easing.easeInOutCubic(clamp((T - V[idx].t) / 0.9, 0, 1));
    var r = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u,
              w: a.w + (b.w - a.w) * u, h: a.h + (b.h - a.h) * u };
    var vis = clamp((0.985 - r.w / (1920 / cam.z * m)) / 0.06, 0, 1);
    if (vis <= 0.002) return null;
    var ep = 9 / cam.z, rx = 24 / cam.z;
    return (
      <g opacity={vis} pointerEvents="none">
        <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={rx}
              fill="#f5c84c" fillOpacity="0.10"
              stroke="#e6a817" strokeWidth={ep}
              strokeOpacity={0.78 + 0.17 * Math.sin(T * 2.4)} />
      </g>
    );
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

  function ChambreFond(p) {
    return (
      <g>
        <rect x="1000" y="760" width="700" height="530" rx="18" fill="#eaf3f9" stroke={C.blue} strokeWidth="5" strokeDasharray="26 18" />
        <text x="1026" y="814" fill={C.blue} fontSize="32" fontWeight="800" letterSpacing="3">{(p && p.titre) || 'CHAMBRE NÉGATIVE'}</text>
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
             le pointillé passe SOUS la croix et s'arrête au flanc de l'armoire. */}
          <path d="M 1058 1281 L 1058 1445 L 2508 1445" fill="none" stroke="#93a3b4" strokeWidth="4" strokeDasharray="14 12" />
        </g>
        <Chip T={p.T} at={22.4} hold={5} x="1300" y="712" text="ÉVAPORATEUR" sub="le liquide s’évapore, il prend la chaleur" fs="34" />
        <g>
          <rect x="1800" y="1030" width="560" height="220" rx="16" fill={C.card} stroke={C.blue} strokeWidth="5" />
          <text x="1830" y="1082" fill={C.orangeText} fontSize="28" fontWeight="900" letterSpacing="2.5">AIR DE LA CHAMBRE</text>
          <text x="1830" y="1178" fill={p.temp > (p.seuil !== undefined ? p.seuil : -14.6) ? C.red : C.blue} fontSize="88" fontWeight="900">{(p.temp > 0 ? '+' : '') + p.temp.toFixed(1)} °C</text>
          <text x="1830" y="1226" fill={C.mute} fontSize="24" fontWeight="700">{p.consigne || 'CONSIGNE −18 · ENCLENCHEMENT −14'}</text>
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
            <text x="1700" y="944" textAnchor="middle" fill={C.blue} fontSize="30" fontWeight="900">BULBE</text>
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


  /* ---- appareillage de commande (repères NF EN 60617-7) ---- */

  /* L'organe de commande d'un contact automatique se dessine encadré : c'est le
     rectangle qui fait le symbole, pas la lettre. θ pour la température, p pour la
     pression, t pour l'horloge. La liaison mécanique le relie au contact en tirets.
     Voir `pressostat-nf.svg` et `actionne-par-un-dispositif-thermique-no.svg` dans la
     bibliothèque inerWeb. */
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

  /* Repères de bornes : 13-14 pour un contact de travail, 11-12 pour un contact de
     repos. Sans eux l'élève lit un principe, pas un schéma qu'il peut suivre au
     bornier. */
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
        <text x={p.compact ? x + 186 : x + 70} y={y + (p.compact ? -4 : 100)} textAnchor={p.compact ? 'start' : 'middle'}
              fill={C.blue} fontSize={p.compact ? 30 : 34} fontWeight="900">{p.code}</text>
        <text x={p.compact ? x + 186 : x + 70} y={y + (p.compact ? 32 : 140)} textAnchor={p.compact ? 'start' : 'middle'}
              fill={C.mute} fontSize={p.compact ? 23 : 24} fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  /* Contact à ouverture. Deux marques le distinguent d'un contact de travail : la
     barre du contact fixe, que la lame franchit au repos, et le fait qu'il soit
     fermé tant que la grandeur surveillée reste dans sa plage.
     `open` (0 fermé, 1 ouvert, ou un booléen) écarte la lame : une sécurité qui
     coupe doit se voir couper. */
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
        <OrganeCmd x={x + 76} y={y} glyph={p.glyph || 'p'} compact={p.compact} />
        <Bornes x={x} x2={x + 152} y={y} gauche="11" droite="12" />
        <text x={p.compact ? x + 198 : x + 76} y={y + (p.compact ? -4 : 100)} textAnchor={p.compact ? 'start' : 'middle'}
              fill={p.fault ? C.red : C.blue} fontSize={p.compact ? 30 : 34} fontWeight="900">{p.code}</text>
        <text x={p.compact ? x + 198 : x + 76} y={y + (p.compact ? 32 : 140)} textAnchor={p.compact ? 'start' : 'middle'}
              fill={C.mute} fontSize={p.compact ? 23 : 24} fontWeight="700">{p.sub}</text>
        {p.fault && <circle cx={x + 76} cy={y} r="98" fill="none" stroke={C.red} strokeWidth="6" strokeDasharray="18 14" opacity="0.8" />}
      </g>
    );
  }

  /* Protection du circuit de commande. La croix dit le déclenchement automatique,
     le crochet la position maintenue. Même longueur qu'un contact à ouverture,
     pour se poser sur la même chaîne. */
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
        {/* `above` : repère au-dessus et pas de sous-titre — pour une tête de rail,
            où la place manque sous le symbole. */}
        {p.above ? (
          <text x={x + 76} y={y - 62} textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">{p.code || 'Q1'}</text>
        ) : (
          <g>
            <text x={p.compact ? x + 198 : x + 76} y={y + (p.compact ? -4 : 100)} textAnchor={p.compact ? 'start' : 'middle'}
                  fill={C.blue} fontSize={p.compact ? 30 : 34} fontWeight="900">{p.code || 'Q1'}</text>
            <text x={p.compact ? x + 198 : x + 76} y={y + (p.compact ? 32 : 140)} textAnchor={p.compact ? 'start' : 'middle'}
                  fill={C.mute} fontSize={p.compact ? 23 : 24} fontWeight="700">{p.sub || 'disjoncteur de commande'}</text>
          </g>
        )}
      </g>
    );
  }

  /* Bobine : le rectangle reste vide et le repère se place à côté, jamais dedans.
     Les bornes A1 et A2 sont ce que l'élève retrouvera sur l'appareil. */
  function Bobine(p) {
    var x = +p.x, y = +p.y;
    return (
      <g>
        <line x1={x - 2} y1={y} x2={x + 6} y2={y} stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" />
        <line x1={x + 154} y1={y} x2={x + 162} y2={y} stroke={p.live ? C.orangeText : C.wire} strokeWidth="11" />
        <rect x={x + 6} y={y - 40} width="148" height="80" fill={p.live ? '#fff0e9' : C.card}
              stroke={p.live ? C.orangeText : C.wire} strokeWidth="7" />
        <text x={x + 12} y={y - 52} fill={C.mute} fontSize="26" fontWeight="700">A1</text>
        <text x={x + 148} y={y - 52} textAnchor="end" fill={C.mute} fontSize="26" fontWeight="700">A2</text>
        <text x={x + 80} y={y - 84} textAnchor="middle" fill={p.live ? C.orangeText : C.blue}
              fontSize="38" fontWeight="900">{p.code}</text>
        <text x={x + 80} y={y + (p.above ? -116 : 78)} textAnchor="middle" fill={C.mute} fontSize="26" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  function Manometre(p) {
    var x = +p.x, y = +p.y, r = +p.r || 92, max = +p.max || 6;
    var ang = function (v) { return -135 + 270 * clamp(v / max, 0, 1); };
    var ticks = [];
    for (var v = 0; v <= max; v++) ticks.push(v);
    function pol(rr, a) {
      var t = (a - 90) * Math.PI / 180;
      return [x + rr * Math.cos(t), y + rr * Math.sin(t)];
    }
    return (
      <g>
        <circle cx={x} cy={y} r={r} fill={C.card} stroke={C.blue} strokeWidth="6" />
        {ticks.map(function (v) {
          var A = pol(r - 8, ang(v)), B = pol(r - 24, ang(v)), L = pol(r - 44, ang(v));
          return (
            <g key={v}>
              <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={C.blue} strokeWidth="4" />
              <text x={L[0]} y={L[1] + 8} textAnchor="middle" fill={C.mute} fontSize="22" fontWeight="800">{v}</text>
            </g>
          );
        })}
        {[[+p.cutOut, C.blue, 'coupure'], [+p.cutIn, C.orangeText, 'enclenchement']].map(function (m, i) {
          var A = pol(r + 4, ang(m[0])), B = pol(r + 26, ang(m[0]));
          return <line key={i} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={m[1]} strokeWidth="8" strokeLinecap="round" />;
        })}
        <g transform={'translate(' + x + ',' + y + ') rotate(' + ang(+p.val) + ')'}>
          <line x1="0" y1="14" x2="0" y2={-(r - 30)} stroke={C.red} strokeWidth="8" strokeLinecap="round" />
        </g>
        <circle cx={x} cy={y} r="12" fill={C.blue} />
        <text x={x} y={y + r - 16} textAnchor="middle" fill={C.blue} fontSize="30" fontWeight="900">
          {(+p.val).toFixed(1).replace('.', ',')} bar
        </text>
        <text x={x} y={y + r + 48} textAnchor="middle" fill={C.blue} fontSize="28" fontWeight="900" letterSpacing="2">{p.label}</text>
      </g>
    );
  }

  /* ---- appareillage VERTICAL (retour F. Henninot du 22/08) ----------------
     Le schéma de commande se lit à la française : phase en haut, neutre en
     bas, circuits en colonnes. Les symboles suivent la page de référence
     `symboles-normalises.html` tournée d'un quart de tour : PIVOT DE LA LAME
     SUR LA BORNE BASSE, la lame s'écarte à GAUCHE en s'ouvrant, la butée du
     contact à ouverture marque la borne haute, l'organe de commande encadré
     vit à gauche, relié par la liaison mécanique en tirets. ---------------- */

  /* Porte-fusible (EN 60617) : le rectangle traversé par le conducteur. */
  function PorteFusible(p) {
    var x = +p.x, y = +p.y;
    return (
      <g>
        <line x1={x} y1={y} x2={x} y2={y + 96} stroke={C.wire} strokeWidth="9" />
        <rect x={x - 17} y={y + 10} width="34" height="76" fill={C.card} stroke={C.wire} strokeWidth="6" />
        <text x={x + 34} y={y + 58} fill={C.blue} fontSize="30" fontWeight="900">{p.code || 'F1'}</text>
      </g>
    );
  }

  /* Contact vertical. `nf` ajoute la butée (la marque « à ouverture ») ;
     `aux` retire l'organe de commande (contact d'un relais ou contacteur).
     `ouv` 0..1 : 0 fermé, 1 ouvert — la lame pivote sur la borne BASSE. */
  function ContactV(p) {
    var x = +p.x, y = +p.y, h = 150;
    var ouv = p.ouv === true ? 1 : (p.ouv === false ? 0 : clamp(+p.ouv || 0, 0, 1));
    var vif = p.live && ouv < 0.5;
    var mid = y + h / 2;
    return (
      <g>
        <circle cx={x} cy={y} r="8" fill={C.wire} />
        <circle cx={x} cy={y + h} r="8" fill={C.wire} />
        {p.nf && <line x1={x} y1={y} x2={x - 32} y2={y} stroke={C.wire} strokeWidth="7" strokeLinecap="round" />}
        <g transform={'rotate(' + (-24 * ouv) + ',' + x + ',' + (y + h) + ')'}>
          <line x1={x} y1={y + h} x2={x} y2={p.nf ? y - 8 : y}
                stroke={vif ? C.orangeText : C.wire} strokeWidth="10" strokeLinecap="round" />
        </g>
        {!p.aux && !p.poussoir && (
          <g>
            <line x1={x - 96} y1={mid} x2={x - 8} y2={mid} stroke={C.wire} strokeWidth="4" strokeDasharray="12 10" />
            <rect x={x - 156} y={mid - 30} width="60" height="60" fill={C.card} stroke={C.wire} strokeWidth="5" />
            <text x={x - 126} y={mid + 16} textAnchor="middle" fill={C.blue} fontSize="42" fontWeight="900">{p.glyph || 'θ'}</text>
          </g>
        )}
        {p.poussoir && (
          /* commande manuelle par poussoir (EN 60617) : le « E » au bout de la liaison */
          <g>
            <line x1={x - 104} y1={mid} x2={x - 8} y2={mid} stroke={C.wire} strokeWidth="4" strokeDasharray="12 10" />
            <path d={'M ' + (x - 86) + ' ' + (mid - 26) + ' L ' + (x - 104) + ' ' + (mid - 26) + ' L ' + (x - 104) + ' ' + (mid + 26) + ' L ' + (x - 86) + ' ' + (mid + 26)}
                  fill="none" stroke={C.wire} strokeWidth="6" strokeLinejoin="round" />
          </g>
        )}
        <text x={x - (p.nf ? 42 : 16)} y={y + 6} textAnchor="end" fill={C.mute} fontSize="22" fontWeight="700">{p.b1 || (p.nf ? '11' : '13')}</text>
        <text x={x + 16} y={y + h + 8} fill={C.mute} fontSize="22" fontWeight="700">{p.b2 || (p.nf ? '12' : '14')}</text>
        <text x={x + 34} y={mid - 2} fill={p.fault ? C.red : C.blue} fontSize="34" fontWeight="900">{p.code}</text>
        <text x={x + 34} y={mid + 30} fill={C.mute} fontSize="22" fontWeight="700">{p.sub}</text>
        {p.fault && <circle cx={x} cy={mid} r="96" fill="none" stroke={C.red} strokeWidth="6" strokeDasharray="18 14" opacity="0.85" />}
      </g>
    );
  }

  /* Bobine verticale : le rectangle traversé, A1 en haut, A2 en bas. */
  function BobineV(p) {
    var x = +p.x, y = +p.y;
    return (
      <g>
        <rect x={x - 62} y={y - 29} width="124" height="58" fill={p.live ? '#fff0e9' : C.blueSoft}
              stroke={p.live ? C.orangeText : C.blue} strokeWidth="7" />
        <text x={x - 74} y={y - 40} textAnchor="end" fill={C.mute} fontSize="22" fontWeight="700">A1</text>
        <text x={x - 74} y={y + 52} textAnchor="end" fill={C.mute} fontSize="22" fontWeight="700">A2</text>
        <text x={x + 80} y={y + 2} fill={p.live ? C.orangeText : C.blue} fontSize="36" fontWeight="900">{p.code}</text>
        <text x={x + 80} y={y + 32} fill={C.mute} fontSize="22" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  /* Voyant (EN 60617) : le cercle barré d'une croix, X1 en haut, X2 en bas ;
     allumé, il se remplit de jaune. */
  function VoyantV(p) {
    var x = +p.x, y = +p.y, r = 30, d = r * 0.707;
    return (
      <g>
        {p.live && <circle cx={x} cy={y} r={r + 16} fill="#ffd34d" opacity="0.45" />}
        <circle cx={x} cy={y} r={r} fill={p.live ? '#ffe27a' : C.card} stroke={p.live ? C.orangeText : C.blue} strokeWidth="6" />
        <line x1={x - d} y1={y - d} x2={x + d} y2={y + d} stroke={p.live ? C.orangeText : C.blue} strokeWidth="5" />
        <line x1={x - d} y1={y + d} x2={x + d} y2={y - d} stroke={p.live ? C.orangeText : C.blue} strokeWidth="5" />
        <text x={x - 42} y={y - 34} textAnchor="end" fill={C.mute} fontSize="22" fontWeight="700">X1</text>
        <text x={x - 42} y={y + 52} textAnchor="end" fill={C.mute} fontSize="22" fontWeight="700">X2</text>
        <text x={x + 52} y={y + 2} fill={p.live ? C.orangeText : C.blue} fontSize="36" fontWeight="900">{p.code}</text>
        <text x={x + 52} y={y + 32} fill={C.mute} fontSize="22" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  /* Le potentiel d'un tronçon, par-dessus le fil gris :
     « courant »  rouge animé (le circuit est fermé, le courant circule) ;
     « phase »    rouge statique (tension présente, circuit ouvert en aval) ;
     « retour »   orange statique — LE RETOUR NEUTRE : le potentiel du neutre
                  remonte à travers la bobine jusqu'au contact ouvert. */
  function Potentiel(p) {
    if (!p.mode || p.mode === 'off') return null;
    var couleur = p.mode === 'retour' ? C.orange : C.red;
    var anime = p.mode === 'courant';
    return (
      <path d={p.d} fill="none" stroke={couleur} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={anime ? '24 20' : 'none'} strokeDashoffset={anime ? -(+p.t || 0) * 200 : 0}
            opacity={anime ? 0.9 : 0.7} />
    );
  }

  /* ---- le réseau de commande, calculé (03/10/2026, films 6 à 10) ----------
     Chaque organe est un élément entre deux nœuds ; une charge (bobine, moteur,
     résistance) relie son nœud au neutre. Potentiel « phase » : relié à L par des
     contacts fermés ; « neutre » : relié à N par des contacts fermés et des
     charges, sans repasser par L. Un nœud qui a les deux est parcouru. Plus de
     potentiel écrit à la main : l'ancien film 8 montrait KM1 alimenté contact
     ouvert. */
  function resoudre(el) {
    function parcours(depart, passe, bloque) {
      var vu = {}; vu[depart] = true;
      var file = [depart];
      while (file.length) {
        var n = file.shift();
        if (n === bloque) continue;
        for (var i = 0; i < el.length; i++) {
          var e = el[i];
          if (!passe(e)) continue;
          var b = e.charge ? 'N' : e.b;
          var o = e.a === n ? b : (b === n ? e.a : null);
          if (o !== null && !vu[o]) { vu[o] = true; file.push(o); }
        }
      }
      return vu;
    }
    var L = parcours('L', function (e) { return !e.charge && e.f; }, null);
    var N = parcours('N', function (e) { return e.charge || e.f; }, 'L');
    function vif(n) { return n === 'N' || (!!L[n] && !!N[n]); }
    var conduit = {};
    el.forEach(function (e) {
      conduit[e.id] = e.charge ? vif(e.a) : (e.f && vif(e.a) && vif(e.b));
    });
    return { L: L, N: N, conduit: conduit };
  }
  /* le potentiel d'un fil : son nœud, et les organes qu'il dessert */
  function modeFil(r, noeud, organes) {
    if (noeud === 'N') return organes.some(function (o) { return r.conduit[o]; }) ? 'courant' : 'retour';
    var l = !!r.L[noeud], n = !!r.N[noeud];
    if (l && n) return (!organes.length || organes.some(function (o) { return r.conduit[o]; })) ? 'courant' : 'phase';
    if (l) return 'phase';
    if (n) return 'retour';
    return 'off';
  }

  /* Moteur (EN 60617) : le cercle et sa lettre M, vertical, bornes en haut et en bas. */
  function MoteurV(p) {
    var x = +p.x, y = +p.y, on = p.live;
    return (
      <g>
        <circle cx={x} cy={y} r="56" fill={on ? '#fff0e9' : C.blueSoft} stroke={on ? C.orangeText : C.blue} strokeWidth="7" />
        <text x={x} y={y + 6} textAnchor="middle" fill={on ? C.orangeText : C.blue} fontSize="44" fontWeight="900">M</text>
        <text x={x} y={y + 38} textAnchor="middle" fill={C.mute} fontSize="22" fontWeight="800">1~</text>
        <text x={x + 74} y={y + 2} fill={on ? C.orangeText : C.blue} fontSize="36" fontWeight="900">{p.code}</text>
        <text x={x + 74} y={y + 32} fill={C.mute} fontSize="22" fontWeight="700">{p.sub}</text>
      </g>
    );
  }

  /* La carte « séquence » : les étapes à réciter, celle en cours s'allume. */
  function Etapes(p) {
    var k = p.k, w = p.w || 1520, pas = p.pas || 140, haut = p.haut || 124;
    return (
      <g transform={'translate(' + p.x + ',' + p.y + ')'}>
        <rect x="0" y="0" width={w} height={p.h || 960} rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="44" y="76" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">{p.titre}</text>
        {p.phases.map(function (ph, i) {
          var y = 112 + i * pas, fait = i < k, ici = i === k;
          var fond = ici ? '#fff0e9' : (fait ? '#e4f2ec' : C.card);
          var bord = ici ? C.orangeText : (fait ? C.green : C.line);
          return (
            <g key={i}>
              <rect x="30" y={y} width={w - 60} height={haut} rx="16" fill={fond} stroke={bord} strokeWidth={ici ? 7 : 4} />
              <circle cx="100" cy={y + haut / 2} r="38" fill={ici ? C.orangeText : (fait ? C.green : C.card)} stroke={bord} strokeWidth="4" />
              <text x="100" y={y + haut / 2 + 14} textAnchor="middle" fill={ici || fait ? C.card : C.mute} fontSize="38" fontWeight="900">{fait ? '✓' : i + 1}</text>
              <text x="166" y={y + haut / 2 - 8} fill={ici ? C.orangeText : (fait ? C.green : C.mute)} fontSize="40" fontWeight="900" letterSpacing="1">{ph[0]}</text>
              <text x="166" y={y + haut / 2 + 36} fill={ici ? C.ink : C.mute} fontSize="28" fontWeight="700">{ph[1]}</text>
            </g>
          );
        })}
      </g>
    );
  }

  /* Le surligneur à zones : un cadre ambre sur la zone dont la voix parle,
     [x, y, largeur, hauteur] par instant ; null = le plan entier, il s'efface. */
  function Surligneur(p) {
    var V = p.zones, T = p.T, k = 0;
    for (var i = 0; i < V.length; i++) if (T >= V[i].t) k = i;
    var b = V[k].r, a = k > 0 ? V[k - 1].r : b;
    var u = Easing.easeInOutCubic(clamp((T - V[k].t) / 0.9, 0, 1));
    var o = b ? 1 : 1 - u;
    if (!b) b = a;
    if (!a) a = b;
    if (!b || o <= 0.01) return null;
    var q = [0, 1, 2, 3].map(function (j) { return a[j] + (b[j] - a[j]) * u; });
    return (
      <rect x={q[0]} y={q[1]} width={q[2]} height={q[3]} rx="60" fill="#f5c84c" fillOpacity="0.08" opacity={o}
            stroke="#e6a817" strokeWidth={p.ep || 26} strokeOpacity={0.78 + 0.17 * Math.sin(T * 2.4)} pointerEvents="none" />
    );
  }

  window.RK = {
    C: C, MOTION: MOTION, camAt: camAt, camFixed: camFixed, camPaliers: camPaliers, Spot: Spot, Chip: Chip, Coil: Coil, Fan: Fan,
    SymCompresseur: SymCompresseur, SymDetendeur: SymDetendeur, Compresseur: Compresseur,
    Pipes: Pipes, MigrationFlux: MigrationFlux, Croix: Croix, CroixLabels: CroixLabels,
    ChambreFond: ChambreFond, Chambre: Chambre, Machine: Machine, PipeChips: PipeChips,
    ContactNO: ContactNO, ContactNF: ContactNF, Disjoncteur: Disjoncteur, Bobine: Bobine, Manometre: Manometre,
    PorteFusible: PorteFusible, ContactV: ContactV, BobineV: BobineV, VoyantV: VoyantV, Potentiel: Potentiel,
    resoudre: resoudre, modeFil: modeFil, MoteurV: MoteurV, Etapes: Etapes, Surligneur: Surligneur
  };
})();
