/* Le retour d'huile — composition (9:16, 1080x1920)
   Schéma en croix du frigoriste, symboles normalisés. */
const { CompositionStage, useComposition, Captions, Easing, animate, clamp } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;

const W = 1080, H = 1920;
const C = {
  blue: '#1b3a63', blue2: '#2d5b96', orange: '#ff6b35',
  bg: '#f2f6fa', pipe: '#b9c8d6', pipeIn: '#e9f0f6', metal: '#8fa3b8',
  oil: '#d99a1f', oilDark: '#9c6a08',
  gas: '#6fa4d6', muted: '#5b7391', bad: '#d1462f', good: '#1e8a63',
};
const FT = 'Trebuchet MS, Verdana, sans-serif';
const FB = 'Calibri, Carlito, Segoe UI, sans-serif';

/* --- three motion helpers ------------------------------------------- */
const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  glide: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  pop:   (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};
const lerp = (a, b, f) => a + (b - a) * f;

/* --- polyline helper -------------------------------------------------- */
function poly(pts) {
  const segs = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, acc: tot }); tot += len;
  }
  return {
    tot,
    d: 'M' + pts.map((p) => p[0] + ' ' + p[1]).join(' L'),
    at(s) {
      s = clamp(s, 0, tot);
      for (const g of segs) {
        if (s <= g.acc + g.len) {
          const f = g.len ? (s - g.acc) / g.len : 0;
          return [lerp(g.a[0], g.b[0], f), lerp(g.a[1], g.b[1], f)];
        }
      }
      return pts[pts.length - 1];
    },
    loop(u) { return this.at(((u % 1) + 1) % 1 * tot); },
  };
}

/* croix du frigoriste : compresseur à droite, condenseur en haut,
   détendeur à gauche, évaporateur en bas. */
const AX = { L: 280, R: 800, T: 560, B: 1300, MY: 930, MX: 540 };
const PA = poly([[800, 868], [800, 560], [680, 560], [400, 560], [280, 560],
                 [280, 868], [280, 992], [280, 1300], [400, 1300], [680, 1300],
                 [800, 1300], [800, 992]]);
const PB = poly([[430, 1390], [500, 1390], [500, 1470], [700, 1470], [700, 650],
                 [740, 650], [740, 760], [790, 760]]);
const TRAP_L = 150, TRAP_R = 350;

/* --- symboles normalisés ---------------------------------------------- */
function Pipe({ d, w = 26, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={C.pipe} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.pipeIn} strokeWidth={w - 10} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
/* échangeur : rectangle + serpentin + flèches de chaleur */
function Exch({ x, y, w, h, label, cold, labelBelow = true }) {
  const n = 5, seg = w / n, mid = y + h / 2, amp = h / 2 - 14;
  let d = 'M' + x + ' ' + mid;
  for (let i = 0; i < n; i++) {
    const x0 = x + seg * i, x1 = x0 + seg / 2, x2 = x0 + seg;
    d += ' L' + x1 + ' ' + (i % 2 ? mid + amp : mid - amp) + ' L' + x2 + ' ' + mid;
  }
  const col = cold ? C.blue2 : C.orange;
  const arrows = [];
  for (let i = 0; i < 3; i++) {
    const ax = x + w * (0.25 + i * 0.25);
    const ay = cold ? y + h + 16 : y - 16;
    const dir = cold ? -1 : -1; // chaleur : sortante (cond.) vers le haut, entrante (évap.) vers le haut
    arrows.push(
      <g key={i} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round">
        <line x1={ax} y1={ay} x2={ax} y2={ay + dir * 40} />
        <path d={'M' + (ax - 11) + ' ' + (ay + dir * 26) + ' L' + ax + ' ' + (ay + dir * 40) +
                 ' L' + (ax + 11) + ' ' + (ay + dir * 26)} />
      </g>
    );
  }
  return (
    <g>
      {arrows}
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#ffffff" stroke={col} strokeWidth={5} />
      <path d={d} fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round" />
      <text x={x + w / 2} y={labelBelow ? y + h + 58 : y - 54} textAnchor="middle" fill={C.blue}
            style={{ font: '600 34px ' + FB }}>{label}</text>
    </g>
  );
}
/* compresseur : cercle + triangle dans le sens du refoulement */
function CompSym({ cx, cy, r = 62, dir = 'up', label = 'Compresseur', o = 1, labelDy = 0 }) {
  const rot = { up: -90, right: 0, down: 90, left: 180 }[dir] || 0;
  return (
    <g opacity={o}>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={C.blue} strokeWidth={6} />
      <g transform={'rotate(' + rot + ' ' + cx + ' ' + cy + ')'}>
        <path d={'M' + (cx - r * 0.42) + ' ' + (cy - r * 0.55) + ' L' + (cx + r * 0.55) + ' ' + cy +
                 ' L' + (cx - r * 0.42) + ' ' + (cy + r * 0.55) + ' Z'} fill={C.blue} />
      </g>
      <text x={cx} y={cy + r + 46 + labelDy} textAnchor="middle" fill={C.blue}
            style={{ font: '600 34px ' + FB }}>{label}</text>
    </g>
  );
}
/* détendeur : nœud papillon + flèche de réglage (flux vertical) */
function DetSym({ cx, cy, o = 1 }) {
  return (
    <g opacity={o}>
      <path d={'M' + (cx - 32) + ' ' + (cy - 34) + ' L' + (cx + 32) + ' ' + (cy - 34) +
               ' L' + cx + ' ' + cy + ' Z'} fill="#fff" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" />
      <path d={'M' + (cx - 32) + ' ' + (cy + 34) + ' L' + (cx + 32) + ' ' + (cy + 34) +
               ' L' + cx + ' ' + cy + ' Z'} fill="#fff" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" />
      <line x1={cx - 46} y1={cy + 40} x2={cx + 46} y2={cy - 40} stroke={C.blue} strokeWidth={5} strokeLinecap="round" />
      <path d={'M' + (cx + 30) + ' ' + (cy - 44) + ' L' + (cx + 48) + ' ' + (cy - 42) +
               ' L' + (cx + 40) + ' ' + (cy - 26)} fill="none" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" />
      <text x={cx} y={cy + 96} textAnchor="middle" fill={C.blue} style={{ font: '600 34px ' + FB }}>Détendeur</text>
    </g>
  );
}
/* coupe du compresseur à piston */
function PistonComp({ cx, cy, o = 1, oilLevel = 1, T = 0, running = 1 }) {
  if (o <= 0.01) return null;
  const th = running ? T * 6.0 : 1.2;
  const crY = cy + 112, crR = 30;
  const pinX = cx + crR * Math.sin(th), pinY = crY - crR * Math.cos(th);
  const pistY = cy + 16 - crR * Math.cos(th);
  const sumpTop = cy + 174 - 52 * oilLevel;
  const id = 'pc' + Math.round(cx);
  return (
    <g opacity={o}>
      <defs><clipPath id={id}><rect x={cx - 110} y={cy - 92} width={220} height={272} rx={20} /></clipPath></defs>
      <rect x={cx - 110} y={cy - 92} width={220} height={272} rx={20} fill="#ffffff" stroke={C.blue} strokeWidth={6} />
      <g clipPath={'url(#' + id + ')'}>
        <rect x={cx - 110} y={sumpTop} width={220} height={200} fill={C.oil} opacity={0.9} />
        <rect x={cx - 110} y={sumpTop} width={220} height={5} fill={C.oilDark} />
        <line x1={cx - 48} y1={cy - 56} x2={cx - 48} y2={cy + 62} stroke={C.metal} strokeWidth={7} />
        <line x1={cx + 48} y1={cy - 56} x2={cx + 48} y2={cy + 62} stroke={C.metal} strokeWidth={7} />
        <line x1={cx - 52} y1={cy - 56} x2={cx + 52} y2={cy - 56} stroke={C.metal} strokeWidth={7} />
        {/* clapets aspiration / refoulement */}
        <line x1={cx - 34} y1={cy - 56} x2={cx - 10} y2={cy - 72} stroke={C.blue2} strokeWidth={5} strokeLinecap="round" />
        <line x1={cx + 34} y1={cy - 56} x2={cx + 10} y2={cy - 72} stroke={C.blue2} strokeWidth={5} strokeLinecap="round" />
        <path d={'M' + (cx - 96) + ' ' + (cy - 76) + ' L' + (cx - 56) + ' ' + (cy - 76)} stroke={C.gas}
              strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={'M' + (cx - 68) + ' ' + (cy - 86) + ' L' + (cx - 56) + ' ' + (cy - 76) + ' L' + (cx - 68) + ' ' + (cy - 66)}
              stroke={C.gas} strokeWidth={5} fill="none" strokeLinejoin="round" />
        <rect x={cx - 44} y={pistY - 19} width={88} height={38} rx={5} fill="#dfe7ee" stroke={C.metal} strokeWidth={4} />
        <line x1={cx - 44} y1={pistY - 7} x2={cx + 44} y2={pistY - 7} stroke={C.metal} strokeWidth={3} />
        <line x1={cx - 44} y1={pistY + 5} x2={cx + 44} y2={pistY + 5} stroke={C.metal} strokeWidth={3} />
        <line x1={cx} y1={pistY} x2={pinX} y2={pinY} stroke={C.metal} strokeWidth={10} strokeLinecap="round" />
        <circle cx={cx} cy={crY} r={crR} fill="none" stroke={C.metal} strokeWidth={6} />
        <circle cx={pinX} cy={pinY} r={8} fill={C.metal} />
      </g>
      <text x={cx} y={cy + 230} textAnchor="middle" fill={C.blue} style={{ font: '600 34px ' + FB }}>Compresseur</text>
    </g>
  );
}
function Drop({ x, y, s = 1, o = 1 }) {
  if (o <= 0.01) return null;
  return (
    <g transform={'translate(' + x + ' ' + y + ') scale(' + s + ')'} opacity={o}>
      <ellipse rx="9" ry="12" fill={C.oil} />
      <ellipse cx="-3" cy="-4" rx="3" ry="4" fill="#ffffff" opacity="0.5" />
    </g>
  );
}
function OilRange({ path, from, to, r = 11, o = 1 }) {
  if (to <= from || o <= 0.01) return null;
  const step = r * 0.9, out = [];
  for (let s = from; s <= to; s += step) {
    const p = path.at(s);
    out.push(<circle key={s} cx={p[0]} cy={p[1]} r={r} fill={C.oil} opacity={o} />);
  }
  const e = path.at(to);
  out.push(<circle key="e" cx={e[0]} cy={e[1]} r={r} fill={C.oil} opacity={o} />);
  return <g>{out}</g>;
}
function Chevrons({ x, yTop, yBot, phase, speed = 1, n = 7, o = 1, col = C.gas }) {
  if (o <= 0.01) return null;
  const span = yBot - yTop, out = [];
  for (let i = 0; i < n; i++) {
    const u = ((i / n + phase * speed) % 1 + 1) % 1;
    const y = yBot - u * span;
    const fade = Math.min(1, u * 6, (1 - u) * 6);
    out.push(<path key={i} d="M-14 12 L0 0 L14 12" fill="none" stroke={col} strokeWidth={5}
                   strokeLinecap="round" strokeLinejoin="round" opacity={o * fade}
                   transform={'translate(' + x + ' ' + y + ')'} />);
  }
  return <g>{out}</g>;
}
function Badge({ x, y, text, tone = C.blue, o = 1, sub }) {
  if (o <= 0.01) return null;
  const w = Math.max(230, text.length * 22);
  return (
    <g opacity={o} transform={'translate(' + x + ' ' + y + ')'}>
      <rect x={-w / 2} y={-34} width={w} height={sub ? 100 : 68} rx={18} fill="#fff" stroke={tone} strokeWidth={4} />
      <text x="0" y="12" textAnchor="middle" fill={tone} style={{ font: '700 38px ' + FT }}>{text}</text>
      {sub && <text x="0" y="50" textAnchor="middle" fill={C.muted} style={{ font: '400 26px ' + FB }}>{sub}</text>}
    </g>
  );
}
function Note({ x, y, text, tone = C.blue, o = 1, anchor = 'middle', size = 30 }) {
  if (o <= 0.01) return null;
  return <text x={x} y={y} textAnchor={anchor} fill={tone} opacity={o}
               style={{ font: '600 ' + size + 'px ' + FB }}>{text}</text>;
}

/* --- caméra ----------------------------------------------------------- */
function camAt(T, kfs) {
  if (T <= kfs[0].t) return kfs[0];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
    if (T <= b.t) {
      const f = MOTION.glide(0, 1, a.t, b.t)(T);
      return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), k: lerp(a.k, b.k, f) };
    }
  }
  return kfs[kfs.length - 1];
}

function Piece(props) {
  const { T, CUES } = useComposition();
  const t = props.tw || {};
  const showSpeed = t.vitesses !== false;
  const Q = CUES;

  const ORDER = [
    ['Ouverture', ''],
    ['Huile', "D'où vient l'huile ?"],
    ['Circuit', "Le trajet de l'huile"],
    ['Blocage', "Là où elle s'accumule"],
    ['Vitesse', 'La vitesse du gaz'],
    ['Siphon', 'Le siphon en pied de colonne'],
    ['ContreSiphon', 'Le contre-siphon'],
    ['ChargeReduite', 'À charge réduite'],
    ['DoubleColonne', 'La double colonne'],
    ['Retrecissement', 'Le rétrécissement de section'],
    ['Recap', 'À retenir'],
  ];
  let sect = '', sectStart = 0;
  ORDER.forEach(([n, label]) => { if (T >= Q[n]) { sect = label; sectStart = Q[n]; } });
  const sectO = Math.min(1, Math.max(0, (T - sectStart) / 0.5));

  const cam = camAt(T, [
    { t: 0, x: 540, y: 930, k: 0.92 },
    { t: Q.Huile - 0.5, x: 540, y: 930, k: 0.92 },
    { t: Q.Huile + 1.3, x: 800, y: 950, k: 1.85 },
    { t: Q.Huile + 6.5, x: 800, y: 920, k: 1.75 },
    { t: Q.Circuit + 1.0, x: 540, y: 930, k: 0.9 },
    { t: Q.Blocage - 0.4, x: 540, y: 930, k: 0.9 },
    { t: Q.Blocage + 1.4, x: 680, y: 1180, k: 1.3 },
    { t: Q.Vitesse - 0.6, x: 620, y: 1120, k: 1.05 },
    { t: Q.Vitesse + 1.2, x: 640, y: 1100, k: 1.25 },
    { t: Q.Siphon + 1.0, x: 600, y: 1420, k: 1.75 },
    { t: Q.Siphon + 8.0, x: 660, y: 1120, k: 1.3 },
    { t: Q.ContreSiphon + 1.2, x: 690, y: 740, k: 1.7 },
    { t: Q.ChargeReduite + 1.0, x: 660, y: 1150, k: 1.2 },
    { t: Q.DoubleColonne + 1.4, x: 630, y: 1180, k: 1.15 },
    { t: Q.DoubleColonne + 6.0, x: 630, y: 1420, k: 1.5 },
    { t: Q.DoubleColonne + 11.0, x: 630, y: 1050, k: 1.05 },
    { t: Q.Retrecissement + 1.5, x: 700, y: 1080, k: 1.2 },
    { t: Q.Recap, x: 560, y: 1000, k: 0.95 },
  ]);
  const camT = 'translate(' + (540 - cam.x * cam.k) + ' ' + (980 - cam.y * cam.k) + ') scale(' + cam.k + ')';

  const oA = MOTION.glide(1, 0, Q.Vitesse - 1.4, Q.Vitesse - 0.4)(T)
           * MOTION.glide(0.18, 1, Q.Huile - 1.2, Q.Huile + 0.4)(T);
  const oB = MOTION.glide(0, 1, Q.Vitesse - 1.2, Q.Vitesse - 0.1)(T)
           * MOTION.glide(1, 0.08, Q.Recap - 0.6, Q.Recap + 0.8)(T);

  /* --- A : croix du frigoriste ---------------------------------------- */
  const lapU = (T - Q.Circuit) * 0.085;
  const dropsA = [];
  for (let i = 0; i < 16; i++) {
    const p = PA.loop(i / 16 + lapU);
    const o = MOTION.enter(0, 1, Q.Circuit + i * 0.1, Q.Circuit + 0.8 + i * 0.1)(T);
    dropsA.push(<Drop key={i} x={p[0]} y={p[1]} o={o * 0.95} />);
  }
  const escape = [];
  for (let i = 0; i < 4; i++) {
    const st = Q.Huile + 4.4 + i * 0.7;
    const f = MOTION.enter(0, 1, st, st + 2.4)(T);
    if (f > 0.01 && f < 1) {
      const p = PA.at(40 + f * 280);
      escape.push(<Drop key={i} x={p[0]} y={p[1]} o={Math.min(1, f * 5)} s={0.9} />);
    }
  }
  const cutIn = MOTION.enter(0, 1, Q.Huile + 0.9, Q.Huile + 1.9)(T)
              * MOTION.glide(1, 0, Q.Circuit - 1.0, Q.Circuit - 0.2)(T);
  const cutBack = MOTION.enter(0, 1, Q.Blocage + 2.0, Q.Blocage + 2.9)(T)
                * MOTION.glide(1, 0, Q.Vitesse - 1.6, Q.Vitesse - 1.0)(T);
  const cutO = Math.max(cutIn, cutBack);
  const sumpA = MOTION.glide(1, 0.25, Q.Blocage + 3.2, Q.Blocage + 7.4)(T);
  const poolEvap = MOTION.glide(0, 1, Q.Blocage + 1.4, Q.Blocage + 4.2)(T);
  const crossO = MOTION.enter(0.35, 1, Q.Circuit + 0.2, Q.Circuit + 1.4)(T);
  const quadO = MOTION.enter(0, 1, Q.Circuit + 4.0, Q.Circuit + 5.4)(T)
              * MOTION.glide(1, 0.35, Q.Blocage - 0.6, Q.Blocage + 0.4)(T);

  /* --- B : colonne montante ------------------------------------------- */
  const fastPhase = (T - Q.Vitesse) * 0.55;
  const slowPhase = (T - Q.Vitesse) * 0.22;
  const vFast = MOTION.glide(1, 0, Q.ContreSiphon + 3.2, Q.ContreSiphon + 4.4)(T)
              * MOTION.glide(0, 1, Q.Vitesse - 0.4, Q.Vitesse + 0.6)(T);
  const vRestart = MOTION.glide(0, 1, Q.ChargeReduite - 0.6, Q.ChargeReduite + 0.4)(T);
  const slowOn = vRestart * MOTION.glide(1, 0, Q.DoubleColonne + 6.4, Q.DoubleColonne + 7.4)(T);
  const smallOn = MOTION.enter(0, 1, Q.DoubleColonne + 0.6, Q.DoubleColonne + 2.2)(T);
  const plug = MOTION.glide(0, 1, Q.DoubleColonne + 3.2, Q.DoubleColonne + 5.6)(T)
             * MOTION.glide(1, 0, Q.DoubleColonne + 11.2, Q.DoubleColonne + 12.2)(T);
  const smallFlow = MOTION.glide(0, 1, Q.DoubleColonne + 6.4, Q.DoubleColonne + 7.6)(T);
  const bigFlow = MOTION.glide(0, 1, Q.DoubleColonne + 11.4, Q.DoubleColonne + 12.4)(T)
                * MOTION.glide(1, 0, Q.Retrecissement - 0.6, Q.Retrecissement + 0.4)(T);
  const shrink = MOTION.glide(0, 1, Q.Retrecissement + 1.2, Q.Retrecissement + 3.2)(T);
  const smallOut = MOTION.glide(1, 0, Q.Retrecissement + 0.2, Q.Retrecissement + 1.4)(T);
  const bigW = lerp(26, 17, shrink);

  const fill = MOTION.glide(0, 1, Q.Siphon + 1.2, Q.Siphon + 4.6)(T);
  const slugStart = Q.Siphon + 5.4, slugEnd = Q.Siphon + 9.6;
  const slugF = MOTION.glide(0, 1, slugStart, slugEnd)(T);
  const slugOn = T > slugStart - 0.05 && T < Q.ContreSiphon + 0.6;
  const slugS = TRAP_R + slugF * (PB.tot - TRAP_R - 40);
  const trapKeep = slugOn ? (1 - slugF) * 0.5 : 1;
  const trapFill = fill * trapKeep
    + MOTION.glide(0, 0.8, Q.ChargeReduite + 2.4, Q.ChargeReduite + 6.5)(T)
    + plug * 0.9;

  const filmO = MOTION.glide(0, 1, Q.Vitesse + 1.4, Q.Vitesse + 3.2)(T)
              * MOTION.glide(1, 0, Q.Siphon - 0.4, Q.Siphon + 0.6)(T);
  const upBig = [];
  for (let i = 0; i < 5; i++) {
    const u = (((T - Q.Vitesse) * 0.38 + i / 5) % 1 + 1) % 1;
    upBig.push(<Drop key={i} x={700} y={lerp(1430, 760, u)} s={0.85}
                     o={filmO * Math.min(1, u * 5, (1 - u) * 5)} />);
  }
  const fallOn = MOTION.glide(0, 1, Q.ChargeReduite + 1.6, Q.ChargeReduite + 2.6)(T)
               * MOTION.glide(1, 0, Q.DoubleColonne + 2.4, Q.DoubleColonne + 3.4)(T);
  const fallB = [];
  for (let i = 0; i < 5; i++) {
    const u = (((T - Q.ChargeReduite) * 0.34 + i / 5) % 1 + 1) % 1;
    fallB.push(<Drop key={i} x={700} y={lerp(760, 1440, u)} o={fallOn * Math.min(1, u * 5, (1 - u) * 5)} />);
  }
  const upS = [];
  for (let i = 0; i < 5; i++) {
    const u = (((T - Q.DoubleColonne) * 0.42 + i / 5) % 1 + 1) % 1;
    upS.push(<Drop key={i} x={560} y={lerp(1440, 700, u)} o={smallFlow * smallOut * Math.min(1, u * 5, (1 - u) * 5)} />);
  }
  const holdO = MOTION.glide(0, 1, Q.ContreSiphon + 4.4, Q.ContreSiphon + 5.6)(T)
              * MOTION.glide(1, 0, Q.ChargeReduite - 0.8, Q.ChargeReduite)(T);

  const titleIn = MOTION.enter(0, 1, 0.15, 1.1)(T);
  const titleUp = MOTION.glide(0, 1, Q.Huile - 1.0, Q.Huile + 0.3)(T);
  const titleY = lerp(880, 196, titleUp);
  const titleK = lerp(1, 0.42, titleUp);
  const subO = titleIn * (1 - titleUp);

  const recap = [
    ["L'huile doit revenir au compresseur", 0],
    ['Tout tient à la vitesse du gaz', 1],
    ['Siphon, contre-siphon, double colonne', 2],
  ];
  const recapOut = MOTION.glide(1, 0, Q.Recap + 6.4, Q.Recap + 7.9)(T);

  const caps = [
    { at: Q.Huile + 0.4, text: "Le compresseur à pistons contient de l'huile. Elle lubrifie bielle, vilebrequin et pistons." },
    { at: Q.Huile + 4.4, text: "À chaque refoulement, une partie de cette huile part avec le gaz." },
    { at: Q.Circuit + 0.3, text: "L'huile parcourt alors toute l'installation." },
    { at: Q.Circuit + 4.2, text: "Croix du frigoriste : HP en haut, BP en bas, compresseur et détendeur sur l'axe." },
    { at: Q.Circuit + 8.4, text: "Elle doit revenir au carter. Sinon, le compresseur se dégrade." },
    { at: Q.Blocage + 0.4, text: "Elle s'accumule aux points bas et dans les lignes trop lentes." },
    { at: Q.Blocage + 4.0, text: "Le niveau du carter baisse : c'est le manque de retour d'huile." },
    { at: Q.Vitesse + 0.4, text: "Seule la vitesse du gaz aspiré entraîne l'huile vers le haut." },
    { at: Q.Vitesse + 4.4, text: "Valeurs usuelles : ≈ 4 m/s à l'horizontale, ≈ 8 m/s en colonne montante." },
    { at: Q.Vitesse + 8.2, text: "À vérifier dans la documentation du constructeur." },
    { at: Q.Siphon + 0.4, text: "En pied de colonne, le siphon rassemble l'huile." },
    { at: Q.Siphon + 5.0, text: "Le gaz forme un bouchon d'huile et le pousse vers le haut." },
    { at: Q.ContreSiphon + 0.4, text: "En haut, la colonne redescend vers le compresseur." },
    { at: Q.ContreSiphon + 3.4, text: "À l'arrêt, l'huile pourrait redescendre dans la colonne." },
    { at: Q.ContreSiphon + 5.6, text: "Le contre-siphon la retient : rien ne retourne à l'évaporateur." },
    { at: Q.ChargeReduite + 0.4, text: "À charge réduite, le débit chute. La vitesse aussi." },
    { at: Q.ChargeReduite + 4.0, text: "L'huile n'est plus entraînée : elle retombe et s'accumule." },
    { at: Q.DoubleColonne + 0.4, text: "Solution : deux colonnes montantes en parallèle." },
    { at: Q.DoubleColonne + 3.4, text: "À charge réduite, l'huile bouche le pied de la grande colonne." },
    { at: Q.DoubleColonne + 7.0, text: "Tout le gaz passe par la petite : la vitesse remonte." },
    { at: Q.DoubleColonne + 11.4, text: "À pleine charge, le bouchon est chassé : les deux colonnes travaillent." },
    { at: Q.Retrecissement + 0.4, text: "Autre solution : réduire la section de la colonne montante." },
    { at: Q.Retrecissement + 3.6, text: "Attention : plus de vitesse, c'est aussi plus de perte de charge." },
    { at: Q.Recap + 0.3, until: Q.Recap + 0.4, text: '' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden' }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width={W} height={H} style={{ display: 'block' }}>
        <defs>
          <clipPath id="vp"><rect x="0" y="292" width={W} height="1330" /></clipPath>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill={C.bg} />

        <g clipPath="url(#vp)"><g transform={camT}>
          {/* ---- A : croix du frigoriste ---- */}
          <g opacity={oA}>
            {/* axes de la croix */}
            <g opacity={crossO}>
              <line x1={150} y1={AX.MY} x2={930} y2={AX.MY} stroke={C.orange} strokeWidth={4}
                    strokeDasharray="18 14" />
              <line x1={AX.MX} y1={430} x2={AX.MX} y2={1430} stroke={C.orange} strokeWidth={4}
                    strokeDasharray="18 14" />
              <text x={150} y={AX.MY - 22} fill={C.orange} style={{ font: '700 40px ' + FT }}>HP</text>
              <text x={150} y={AX.MY + 56} fill={C.blue2} style={{ font: '700 40px ' + FT }}>BP</text>
            </g>
            <g opacity={quadO}>
              <Note x={400} y={730} text="liquide HP" tone={C.muted} size={28} />
              <Note x={400} y={1150} text="liquide + vapeur" tone={C.muted} size={28} />
              <Note x={646} y={1148} text="vapeur BP" tone={C.muted} size={28} />
              <Note x={646} y={730} text="vapeur HP" tone={C.muted} size={28} />
            </g>

            <Pipe d={PA.d} />
            <Exch x={400} y={505} w={280} h={110} label="Condenseur" labelBelow={false} />
            <Exch x={400} y={1245} w={280} h={110} label="Évaporateur" cold />
            <DetSym cx={280} cy={930} o={1} />
            {/* accumulations */}
            <g opacity={poolEvap}>
              <rect x={420} y={1288} width={370} height={24} rx={12} fill={C.oil} />
              <Note x={540} y={1500} text="huile piégée au point bas" tone={C.bad} o={poolEvap} />
            </g>
            {dropsA}
            {escape}
            <CompSym cx={800} cy={930} dir="up" o={1 - cutO} />
            <PistonComp cx={800} cy={930} o={cutO} oilLevel={sumpA} T={T} />
            <Note x={666} y={1046} text="le carter se vide" tone={C.bad} anchor="end"
                  o={MOTION.enter(0, 1, Q.Blocage + 3.4, Q.Blocage + 4.2)(T)
                     * MOTION.glide(1, 0, Q.Vitesse - 1.6, Q.Vitesse - 1.0)(T)} />
          </g>

          {/* ---- B : colonne montante ---- */}
          <g opacity={oB}>
            <Exch x={130} y={1330} w={300} h={120} label="Évaporateur" cold />
            <Pipe d="M430 1390 L500 1390 L500 1470 L700 1470" />
            <Pipe d={riserPath()} w={bigW} />
            <g opacity={smallOn * smallOut}>
              <Pipe d="M560 1470 L560 650" w={17} />
              <Pipe d="M560 650 L700 650" w={17} />
            </g>
            <Pipe d="M700 650 L740 650 L740 760 L790 760" />
            <OilRange path={PB} from={TRAP_L - trapFill * 78} to={TRAP_R + trapFill * 95} r={11} />
            {slugOn && <OilRange path={PB} from={slugS} to={slugS + 90} r={11} />}
            <g opacity={filmO * 0.8}>
              <rect x={700 - bigW / 2 + 1} y={780} width={3} height={640} fill={C.oil} />
              <rect x={700 + bigW / 2 - 4} y={780} width={3} height={640} fill={C.oil} />
              <Note x={250} y={1000} text="film d'huile sur la paroi" tone={C.oilDark} anchor="start" />
            </g>
            <Chevrons x={700} yTop={720} yBot={1430} phase={fastPhase} o={vFast * (1 - plug)} />
            <Chevrons x={700} yTop={720} yBot={1430} phase={slowPhase} o={slowOn * (1 - plug)} col={C.bad} />
            <Chevrons x={700} yTop={720} yBot={1430} phase={fastPhase} o={bigFlow} />
            <Chevrons x={560} yTop={720} yBot={1430} phase={fastPhase} o={smallFlow * smallOut} n={6} />            {upBig}
            {fallB}
            {upS}
            <g opacity={plug}>
              <rect x={678} y={1380} width={44} height={92} rx={16} fill={C.oil} />
              <Note x={790} y={1420} text="bouchon d'huile" tone={C.oilDark} anchor="start" />
            </g>
            <g opacity={holdO}>
              <OilRange path={PB} from={PB.tot - 150} to={PB.tot - 62} r={11} />
              <Note x={430} y={548} text="l'huile ne redescend pas" tone={C.good} anchor="start" />
            </g>
            <CompSym cx={880} cy={760} dir="right" labelDy={4} />
            <Note x={430} y={1580} text="siphon (pied de colonne)" tone={C.blue} anchor="start"
                  o={MOTION.enter(0, 1, Q.Siphon + 0.6, Q.Siphon + 1.4)(T)
                     * MOTION.glide(1, 0, Q.DoubleColonne + 0.4, Q.DoubleColonne + 1.2)(T)}
                  size={28} />
            <Note x={430} y={606} text="contre-siphon" tone={C.blue} anchor="start"
                  o={MOTION.enter(0, 1, Q.ContreSiphon + 4.6, Q.ContreSiphon + 5.4)(T)} />
            <g opacity={smallOn * smallOut}>
              <line x1={530} y1={1548} x2={560} y2={1492} stroke={C.blue2} strokeWidth={3} />
              <line x1={760} y1={1566} x2={712} y2={1492} stroke={C.blue2} strokeWidth={3} />
            </g>
            <Note x={520} y={1560} text="petite colonne" tone={C.blue2} anchor="end"
                  o={smallOn * smallOut * MOTION.enter(0, 1, Q.DoubleColonne + 1.6, Q.DoubleColonne + 2.4)(T)} />
            <Note x={760} y={1596} text="grande colonne" tone={C.blue2} o={smallOn * smallOut} />
            <Note x={780} y={1080} text="section réduite" tone={C.orange} anchor="start"
                  o={MOTION.enter(0, 1, Q.Retrecissement + 1.4, Q.Retrecissement + 2.2)(T)} />
            <Note x={780} y={1124} text="perte de charge ↑" tone={C.bad} anchor="start"
                  o={MOTION.enter(0, 1, Q.Retrecissement + 3.8, Q.Retrecissement + 4.6)(T)} />
          </g>
        </g></g>

        {/* bandeau */}
        <rect x="0" y="0" width={W} height="150" fill="#ffffff" />
        <rect x="0" y="148" width={W} height="4" fill="#dde6ef" />
        <text x="56" y="96" fill={C.blue} style={{ font: '700 44px ' + FT }}>❄ inerWeb</text>
        <rect x="288" y="56" width="104" height="52" rx="12" fill={C.orange} />
        <text x="340" y="94" textAnchor="middle" fill="#fff" style={{ font: '700 32px ' + FT }}>Édu</text>
        <text x={W - 56} y="92" textAnchor="end" fill={C.muted} style={{ font: '400 26px ' + FB }}>par F. Henninot</text>
        <rect x="0" y="152" width={W} height="140" fill={C.bg} />
        <text x="540" y="276" textAnchor="middle" fill={C.orange} opacity={sectO}
              style={{ font: '700 40px ' + FT, letterSpacing: '1px' }}>{sect}</text>

        {showSpeed && (
          <g>
            <Badge x={540} y={1462} text="≈ 8 m/s" tone={C.good} sub="vitesse en colonne montante"
                   o={MOTION.enter(0, 1, Q.Vitesse + 3.8, Q.Vitesse + 4.6)(T) * vFast
                      * MOTION.glide(1, 0, Q.ChargeReduite - 0.6, Q.ChargeReduite + 0.2)(T)} />
            <Badge x={540} y={1462} text="≈ 4 m/s" tone={C.bad} sub="huile non entraînée"
                   o={MOTION.enter(0, 1, Q.ChargeReduite + 1.0, Q.ChargeReduite + 1.8)(T)
                      * MOTION.glide(1, 0, Q.DoubleColonne + 6.4, Q.DoubleColonne + 7.2)(T)} />
            <Badge x={540} y={1462} text="vitesse rétablie" tone={C.good} sub="tout le gaz dans la petite colonne"
                   o={MOTION.enter(0, 1, Q.DoubleColonne + 7.6, Q.DoubleColonne + 8.4)(T)
                      * MOTION.glide(1, 0, Q.DoubleColonne + 11.0, Q.DoubleColonne + 11.8)(T)} />
          </g>
        )}

        {/* titre */}
        <g opacity={titleIn} transform={'translate(540 ' + titleY + ') scale(' + titleK + ')'}>
          <text x="0" y="0" textAnchor="middle" fill={C.blue} style={{ font: '700 96px ' + FT }}>LE RETOUR D'HUILE</text>
          <rect x="-160" y="34" width="320" height="8" rx="4" fill={C.orange} />
        </g>
        <text x="540" y="990" textAnchor="middle" fill={C.muted} opacity={subO}
              style={{ font: '400 42px ' + FB }}>Pourquoi l'huile doit revenir au compresseur</text>
        <text x="540" y="1060" textAnchor="middle" fill={C.blue2} opacity={subO}
              style={{ font: '600 34px ' + FB }}>Bac Pro MFER · TP BE CVC</text>

        {/* à retenir */}
        <g opacity={recapOut}>
          {recap.map(([txt, i]) => {
            const o = clamp(MOTION.pop(0, 1, Q.Recap + 0.8 + i * 1.5, Q.Recap + 1.6 + i * 1.5)(T), 0, 1);
            const y = 700 + i * 190;
            return (
              <g key={i} opacity={o} transform={'translate(0 ' + lerp(28, 0, o) + ')'}>
                <rect x="90" y={y - 66} width="900" height="132" rx="22" fill="#fff" stroke="#dde6ef" strokeWidth="3" />
                <rect x="90" y={y - 66} width="14" height="132" rx="7" fill={C.orange} />
                <text x="150" y={y + 14} fill={C.blue} style={{ font: '600 40px ' + FB }}>{txt}</text>
              </g>
            );
          })}
        </g>
      </svg>
      {t.sousTitres !== false && (
        <Captions items={caps} style={{
          bottom: '5%', left: '6%', right: '6%',
          background: 'rgba(255,255,255,0.94)', border: '3px solid #dde6ef',
          borderRadius: '20px', padding: '22px 26px',
          font: '600 40px ' + FB, color: C.blue, textShadow: 'none',
          lineHeight: 1.35, textWrap: 'pretty',
        }} />
      )}
    </div>
  );
}
function riserPath() { return 'M700 1470 L700 650'; }

function OilReturnVideo() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS || {});
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={W} height={H} bg={C.bg}
                        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece tw={tw} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Affichage" />
        <TweakToggle label="Sous-titres" value={tw.sousTitres !== false}
                     onChange={(v) => setTweak('sousTitres', v)} />
        <TweakToggle label="Repères de vitesse" value={tw.vitesses !== false}
                     onChange={(v) => setTweak('vitesses', v)} />
        <TweakSection label="Édition" />
        <TweakToggle label="Motion editor" value={tw.motionEditor !== false}
                     onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.OilReturnVideo = OilReturnVideo;
