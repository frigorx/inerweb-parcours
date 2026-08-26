/* Le séparateur d'huile à éclatement (9:16, 1080x1920) */
const { CompositionStage, useComposition, Captions, Easing, animate, clamp } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;

const W = 1080, H = 1920;
const C = {
  blue: '#1b3a63', blue2: '#2d5b96', orange: '#ff6b35',
  bg: '#f2f6fa', pipe: '#b9c8d6', pipeIn: '#e9f0f6', metal: '#8fa3b8',
  oil: '#d99a1f', oilDark: '#9c6a08',
  gas: '#6fa4d6', muted: '#5b7391', bad: '#d1462f', good: '#1e8a63',
  hot: '#e30613', hotIn: '#fbd5d7',
  cold: '#2b3990', coldIn: '#dcdff4',
  oilPipe: '#b8860b', oilIn: '#ffe100',
  mesh: '#7d8fa3',
};
const FT = 'Trebuchet MS, Verdana, sans-serif';
const FB = 'Calibri, Carlito, Segoe UI, sans-serif';

const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  glide: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  pop:   (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};
const lerp = (a, b, f) => a + (b - a) * f;

function poly(pts) {
  const segs = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, acc: tot }); tot += len;
  }
  return {
    tot, d: 'M' + pts.map((p) => p[0] + ' ' + p[1]).join(' L'),
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
  };
}

/* --- géométrie : le corps du séparateur en gros plan ------------------- */
const B = { x: 300, y: 480, w: 420, h: 860 };            // corps
const NOZ = { x: 300, y: 600, tip: 470 };                 // buse d'entrée
const PL = { x: 552, y: 540, w: 20, h: 260 };             // plaque de choc
const OUT = { x: 640, y: 480 };                            // sortie gaz

const P_IN = poly([[60, NOZ.y], [NOZ.tip, NOZ.y]]);
const P_JET = poly([[NOZ.tip, NOZ.y], [PL.x - 6, NOZ.y]]);
const P_SPLAT = poly([[PL.x + PL.w + 12, NOZ.y + 20], [PL.x + PL.w + 12, 1230]]);
const P_WALL = poly([[B.x + B.w - 26, 700], [B.x + B.w - 26, 1240]]);
const P_TURN = poly([[PL.x - 10, NOZ.y - 20], [596, 546], [OUT.x, 512]]);
const P_OUT = poly([[OUT.x, B.y], [OUT.x, 372], [1030, 372]]);
const P_RET = poly([[510, B.y + B.h], [510, 1440], [180, 1440], [180, 1560]]);

/* --- primitives ------------------------------------------------------- */
const FLUID = {
  hot:  { c: C.hot,  i: C.hotIn },
  cold: { c: C.cold, i: C.coldIn },
  oil:  { c: C.oilPipe, i: C.oilIn },
  none: { c: C.pipe, i: C.pipeIn },
};
function Pipe({ d, w = 26, opacity = 1, fluid = 'none' }) {
  const f = FLUID[fluid] || FLUID.none;
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={f.c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={f.i} strokeWidth={Math.max(3, w - 10)} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
function Arrow({ x, y, dir = 'right', col, s = 1, o = 1 }) {
  if (o <= 0.01) return null;
  const rot = { right: 0, down: 90, left: 180, up: -90 }[dir] || 0;
  return (
    <g opacity={o} transform={'translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + s + ')'}>
      <path d="M-22 -20 L18 0 L-22 20 Z" fill={col} />
    </g>
  );
}
function Note({ x, y, text, tone = C.blue, o = 1, anchor = 'middle', size = 30, halo = false }) {
  if (o <= 0.01) return null;
  const st = { font: '600 ' + size + 'px ' + FB };
  if (halo) {
    st.paintOrder = 'stroke';
    st.stroke = C.bg;
    st.strokeWidth = Math.max(6, size * 0.3);
    st.strokeLinejoin = 'round';
  }
  return <text x={x} y={y} textAnchor={anchor} fill={tone} opacity={o} style={st}>{text}</text>;
}
function Badge({ x, y, text, tone = C.blue, o = 1, sub }) {
  if (o <= 0.01) return null;
  const w = Math.max(280, text.length * 21);
  return (
    <g opacity={o} transform={'translate(' + x + ' ' + y + ')'}>
      <rect x={-w / 2} y={-34} width={w} height={sub ? 100 : 68} rx={18} fill="#fff" stroke={tone} strokeWidth={4} />
      <text x="0" y="12" textAnchor="middle" fill={tone} style={{ font: '700 38px ' + FT }}>{text}</text>
      {sub && <text x="0" y="50" textAnchor="middle" fill={C.muted} style={{ font: '400 26px ' + FB }}>{sub}</text>}
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
function Flow({ path, T, speed = 0.08, n = 10, o = 1, size = 1, phase0 = 0 }) {
  if (o <= 0.01) return null;
  const out = [];
  for (let i = 0; i < n; i++) {
    const u = (((T * speed) + phase0 + i / n) % 1 + 1) % 1;
    const p = path.at(u * path.tot);
    out.push(<Drop key={i} x={p[0]} y={p[1]} s={size} o={o * Math.min(1, u * 8, (1 - u) * 8)} />);
  }
  return <g>{out}</g>;
}
function Chevrons({ path, T, speed = 0.16, n = 6, o = 1, col = C.gas, sz = 1 }) {
  if (o <= 0.01) return null;
  const out = [];
  for (let i = 0; i < n; i++) {
    const u = (((T * speed) + i / n) % 1 + 1) % 1;
    const s = u * path.tot;
    const p = path.at(s), q = path.at(Math.min(path.tot, s + 6));
    const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
    out.push(<path key={i} d="M-12 -10 L0 0 L-12 10" fill="none" stroke={col} strokeWidth={5}
                   strokeLinecap="round" strokeLinejoin="round" opacity={o * Math.min(1, u * 8, (1 - u) * 8)}
                   transform={'translate(' + p[0] + ' ' + p[1] + ') rotate(' + a + ') scale(' + sz + ')'} />);
  }
  return <g>{out}</g>;
}
function SightGlass({ cx, cy, T, flow = 0, o = 1 }) {
  if (o <= 0.01) return null;
  const r = 27, u = ((T * 0.9) % 1 + 1) % 1;
  return (
    <g opacity={o}>
      <rect x={cx - r - 14} y={cy - 18} width={12} height={36} rx={3} fill={C.metal} />
      <rect x={cx + r + 2} y={cy - 18} width={12} height={36} rx={3} fill={C.metal} />
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={C.blue} strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r - 9} fill={C.oilIn} opacity={0.25 + 0.6 * flow} />
      {flow > 0.2 && <Drop x={lerp(cx - 14, cx + 14, u)} y={cy} s={0.55} o={flow} />}
      <circle cx={cx} cy={cy} r={5} fill={C.blue} />
    </g>
  );
}
/* mini-schémas de comparaison (espace écran) */
function MiniSep({ x, y, kind, o = 1 }) {
  if (o <= 0.01) return null;
  const w = 200, h = 300;
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#fff" stroke={C.blue} strokeWidth={5} />
      <rect x={x - 54} y={y + 52} width={58} height={16} rx={4} fill={C.hot} />
      <rect x={x + w / 2 - 8} y={y - 46} width={16} height={50} rx={4} fill={C.hot} />
      {kind === 'coal' ? (
        <g>
          <rect x={x + 14} y={y + 120} width={w - 28} height={54} fill="url(#mp2)" opacity={0.9} />
          <rect x={x + 14} y={y + 120} width={w - 28} height={54} fill="none" stroke={C.mesh} strokeWidth={4} />
        </g>
      ) : (
        <g>
          <rect x={x + 128} y={y + 30} width={14} height={130} rx={5} fill={C.metal} />
          <path d={'M' + (x + 40) + ' ' + (y + 76) + ' L' + (x + 120) + ' ' + (y + 76)}
                stroke={C.hot} strokeWidth={7} fill="none" />
        </g>
      )}
      <rect x={x + 6} y={y + h - 66} width={w - 12} height={60} rx={20} fill={C.oil} opacity={0.85} />
    </g>
  );
}
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
  const showVals = t.valeurs !== false;
  const Q = CUES;

  const ORDER = [
    ['Ouverture', ''],
    ['DeuxFamilles', 'Deux familles de séparateurs'],
    ['Eclatement', "Le choc et l'éclatement"],
    ['Vitesse', 'La chute de vitesse'],
    ['Paroi', "L'huile ruisselle à la paroi"],
    ['Retour', "Le retour d'huile"],
    ['Limites', 'Ce qu\u2019il sait faire, et pas'],
    ['Recap', 'À retenir'],
  ];
  let sect = '', sectStart = 0;
  ORDER.forEach(([n, label]) => { if (T >= Q[n]) { sect = label; sectStart = Q[n]; } });
  const sectO = Math.min(1, Math.max(0, (T - sectStart) / 0.5));

  const OV = { x: 540, y: 900, k: 0.9 };
  const cam = camAt(T, [
    { t: 0, ...OV },
    { t: Q.Eclatement + 1.6, x: 500, y: 640, k: 1.55 },
    { t: Q.Eclatement + 12, x: 510, y: 660, k: 1.5 },
    { t: Q.Vitesse + 1.6, x: 470, y: 620, k: 1.4 },
    { t: Q.Vitesse + 9, x: 490, y: 700, k: 1.3 },
    { t: Q.Paroi + 1.6, x: 600, y: 1020, k: 1.4 },
    { t: Q.Paroi + 8, x: 580, y: 1060, k: 1.35 },
    { t: Q.Retour + 1.6, x: 470, y: 1300, k: 1.4 },
    { t: Q.Retour + 9, x: 460, y: 1320, k: 1.35 },
    { t: Q.Limites + 1.0, ...OV },
    { t: Q.Limites + 7.4, x: 580, y: 600, k: 1.45 },
    { t: Q.Limites + 10.8, x: 580, y: 620, k: 1.4 },
    { t: Q.Recap, ...OV },
  ]);
  const camT = 'translate(' + (540 - cam.x * cam.k) + ' ' + (960 - cam.y * cam.k) + ') scale(' + cam.k + ')';

  const slideO = MOTION.enter(0, 1, Q.DeuxFamilles + 0.4, Q.DeuxFamilles + 1.4)(T)
               * MOTION.glide(1, 0, Q.Eclatement - 0.8, Q.Eclatement - 0.1)(T);
  const limO = MOTION.enter(0, 1, Q.Limites + 0.6, Q.Limites + 1.6)(T)
             * MOTION.glide(1, 0, Q.Limites + 5.8, Q.Limites + 6.6)(T);
  const diagO = MOTION.glide(0.16, 1, Q.DeuxFamilles - 1.0, Q.DeuxFamilles + 0.4)(T)
              * lerp(1, 0.1, Math.max(slideO, limO))
              * MOTION.glide(1, 0.06, Q.Recap - 0.6, Q.Recap + 0.8)(T);

  const inO = MOTION.enter(0, 1, Q.Eclatement + 0.6, Q.Eclatement + 1.8)(T);
  const jetO = MOTION.enter(0, 1, Q.Eclatement + 2.6, Q.Eclatement + 3.6)(T);
  const plateO = MOTION.enter(0, 1, Q.Eclatement + 4.6, Q.Eclatement + 5.6)(T);
  const burstO = MOTION.enter(0, 1, Q.Eclatement + 6.6, Q.Eclatement + 7.6)(T);
  const turnO = MOTION.enter(0, 1, Q.Eclatement + 9.4, Q.Eclatement + 10.4)(T);
  const vFast = MOTION.enter(0, 1, Q.Vitesse + 1.4, Q.Vitesse + 2.4)(T);
  const vSlow = MOTION.enter(0, 1, Q.Vitesse + 4.2, Q.Vitesse + 5.2)(T);
  const inertO = MOTION.enter(0, 1, Q.Vitesse + 7.0, Q.Vitesse + 8.0)(T)
               * MOTION.glide(1, 0, Q.Paroi + 0.6, Q.Paroi + 1.2)(T);
  const wallO = MOTION.enter(0, 1, Q.Paroi + 1.2, Q.Paroi + 2.6)(T);
  const poolLvl = MOTION.glide(0.05, 1, Q.Paroi + 2.0, Q.Retour + 3.0)(T);
  const floatO = MOTION.enter(0, 1, Q.Retour + 1.2, Q.Retour + 2.4)(T);
  const retO = MOTION.enter(0, 1, Q.Retour + 4.0, Q.Retour + 5.2)(T);
  const vgO = MOTION.enter(0, 1, Q.Retour + 6.6, Q.Retour + 7.6)(T);
  const mistO = MOTION.enter(0, 1, Q.Limites + 7.2, Q.Limites + 8.2)(T)
              * MOTION.glide(1, 0, Q.Recap - 0.8, Q.Recap - 0.2)(T);

  /* flotteur : monte avec le niveau, ouvre le pointeau */
  const cyc = ((T - Q.Retour - 2.0) % 6 + 6) % 6;
  const inRet = T > Q.Retour && T < Q.Limites;
  const fLvl = inRet ? (cyc < 2.6 ? lerp(0.2, 1, cyc / 2.6) : lerp(1, 0.2, clamp((cyc - 3.2) / 2.4, 0, 1))) : 0.6;
  const needle = inRet ? clamp((fLvl - 0.55) * 2.6, 0, 1) : 0;

  const poolTop = lerp(B.y + B.h - 40, B.y + B.h - 190, poolLvl * lerp(0.5, 1, fLvl));
  const floatY = poolTop - 34;

  const titleIn = MOTION.enter(0, 1, 0.15, 1.1)(T);
  const titleUp = MOTION.glide(0, 1, Q.DeuxFamilles - 1.0, Q.DeuxFamilles + 0.3)(T);
  const titleY = lerp(860, 196, titleUp);
  const titleK = lerp(1, 0.44, titleUp);
  const subO = titleIn * (1 - titleUp);

  const caps = [
    { at: Q.DeuxFamilles + 0.4, text: "En France, deux familles de séparateurs d'huile équipent les installations." },
    { at: Q.DeuxFamilles + 3.2, text: "À coalescence : le gaz traverse un élément filtrant qui rassemble les gouttelettes." },
    { at: Q.DeuxFamilles + 6.0, text: "À éclatement : pas d'élément. Le gaz est projeté sur un obstacle." },
    { at: Q.Eclatement + 0.4, text: "Le refoulement arrive par une buse, à grande vitesse." },
    { at: Q.Eclatement + 2.6, text: "Gaz et gouttes d'huile filent ensemble vers l'intérieur du corps." },
    { at: Q.Eclatement + 4.6, text: "En face de la buse : une plaque de choc." },
    { at: Q.Eclatement + 6.6, text: "Le jet éclate sur la plaque. Les gouttes s'y écrasent et s'y rassemblent." },
    { at: Q.Eclatement + 9.4, text: "Le gaz, lui, change brutalement de direction et repart vers le haut." },
    { at: Q.Vitesse + 0.4, text: "Pourquoi les gouttes ne suivent-elles pas le gaz ?" },
    { at: Q.Vitesse + 2.2, text: "Dans la buse, le gaz est rapide : la section est petite." },
    { at: Q.Vitesse + 4.4, text: "Dans le corps, la section est très grande : la vitesse s'écroule." },
    { at: Q.Vitesse + 7.0, text: "L'huile est 700 fois plus dense que le gaz : trop lourde pour suivre le virage." },
    { at: Q.Paroi + 0.4, text: "L'huile séparée ruisselle le long de la plaque et de la paroi." },
    { at: Q.Paroi + 3.2, text: "Elle forme un film, puis s'accumule au fond du corps." },
    { at: Q.Paroi + 6.2, text: "Le corps sert donc aussi de petite réserve d'huile." },
    { at: Q.Retour + 0.4, text: "Au fond, un flotteur commande un pointeau." },
    { at: Q.Retour + 2.6, text: "Le niveau monte, le flotteur monte, le pointeau s'ouvre." },
    { at: Q.Retour + 4.8, text: "L'huile repart vers le carter, poussée par l'écart HP – carter." },
    { at: Q.Retour + 7.0, text: "Le niveau baisse, le pointeau referme : le gaz HP ne passe pas à l'aspiration." },
    { at: Q.Limites + 0.4, text: "L'éclatement est simple, robuste, sans cartouche à remplacer." },
    { at: Q.Limites + 3.0, text: "Sa perte de charge est faible et son prix modeste." },
    { at: Q.Limites + 7.0, text: "Mais le brouillard le plus fin traverse : le rendement reste inférieur à la coalescence." },
    { at: Q.Limites + 9.4, text: "Sur une centrale ou en longue tuyauterie, on préfère un coalescent." },
    { at: Q.Recap + 0.3, until: Q.Recap + 0.4, text: '' },
  ];

  const recap = [
    ['Le jet éclate sur une plaque de choc', 0],
    ["La vitesse s'écroule : l'huile ne suit plus", 1],
    ['Simple et robuste, mais moins fin', 2],
  ];
  const recapOut = MOTION.glide(1, 0, Q.Recap + 6.4, Q.Recap + 7.9)(T);

  const cmp = [
    ['Élément filtrant', 'oui, à remplacer', 'aucun'],
    ['Perte de charge', 'plus élevée', 'faible'],
    ['Brouillard fin', 'retenu', 'passe en partie'],
    ['Emploi', 'centrales, longues lignes', 'petites installations'],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden' }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width={W} height={H} style={{ display: 'block' }}>
        <defs>
          <clipPath id="vp"><rect x="0" y="292" width={W} height="1330" /></clipPath>
          <clipPath id="bodyClip"><rect x={B.x} y={B.y} width={B.w} height={B.h} rx={40} /></clipPath>
          <pattern id="mp2" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 14 L14 0" stroke={C.mesh} strokeWidth="3" />
            <path d="M0 0 L14 14" stroke={C.mesh} strokeWidth="3" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill={C.bg} />

        <g clipPath="url(#vp)"><g transform={camT}><g opacity={diagO}>
          {/* tuyauteries */}
          <Pipe d={P_IN.d} fluid="hot" opacity={inO} />
          <Pipe d={P_OUT.d} fluid="hot" opacity={turnO} />
          <Pipe d={P_RET.d} w={18} fluid="oil" opacity={retO} />
          <Arrow x={1036} y={372} dir="right" col={C.hot} s={0.85} o={turnO} />
          <Arrow x={180} y={1554} dir="down" col={C.oilPipe} s={0.75} o={retO} />

          {/* corps */}
          <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={40}
                fill="#ffffff" stroke={C.blue} strokeWidth={7} />
          <g clipPath="url(#bodyClip)">
            {/* buse d'entrée */}
            <g opacity={inO}>
              <rect x={B.x} y={NOZ.y - 15} width={NOZ.tip - B.x} height={30} rx={6}
                    fill="#eef4f9" stroke={C.metal} strokeWidth={5} />
              <path d={'M' + (NOZ.tip - 30) + ' ' + (NOZ.y - 15) + ' L' + NOZ.tip + ' ' + (NOZ.y - 9) +
                       ' L' + NOZ.tip + ' ' + (NOZ.y + 9) + ' L' + (NOZ.tip - 30) + ' ' + (NOZ.y + 15) + ' Z'}
                    fill={C.metal} opacity={0.5} />
            </g>
            {/* plaque de choc */}
            <g opacity={plateO}>
              <rect x={PL.x} y={PL.y} width={PL.w} height={PL.h} rx={6} fill={C.metal} />
              <rect x={PL.x - 4} y={PL.y} width={PL.w + 8} height={14} rx={6} fill={C.metal} />
            </g>
            {/* film d'huile sur la plaque et la paroi */}
            <rect x={PL.x + PL.w} y={PL.y + 20} width={10} height={PL.h - 20} fill={C.oil}
                  opacity={0.8 * wallO} />
            <rect x={B.x + B.w - 34} y={700} width={16} height={560} fill={C.oil} opacity={0.7 * wallO} />
            <rect x={B.x + 16} y={760} width={12} height={500} fill={C.oil} opacity={0.45 * wallO} />
            {/* nappe d'huile au fond */}
            <rect x={B.x} y={poolTop} width={B.w} height={300} fill={C.oil} opacity={0.9} />
            <rect x={B.x} y={poolTop} width={B.w} height={6} fill={C.oilDark} />

            {/* jet : gaz + huile à grande vitesse */}
            <Chevrons path={P_JET} T={T} speed={0.9} n={4} col={C.hot} o={jetO} />
            <Flow path={P_JET} T={T} speed={0.85} n={4} o={jetO} size={0.55} />
            {/* éclatement sur la plaque */}
            {burstO > 0.05 && [0, 1, 2, 3, 4, 5].map((i) => {
              const u = (((T * 1.15) + i / 6) % 1 + 1) % 1;
              const ang = -1.1 + (i % 3) * 1.1;
              return <Drop key={'b' + i}
                           x={PL.x + PL.w + 6 + Math.cos(ang) * 26 * u}
                           y={NOZ.y + Math.sin(ang) * 130 * u}
                           s={0.55 + u * 0.6} o={burstO * Math.min(1, u * 6, (1 - u) * 4)} />;
            })}
            {/* ruissellement */}
            <Flow path={P_SPLAT} T={T} speed={0.2} n={4} o={wallO} size={1.15} />
            <Flow path={P_WALL} T={T} speed={0.16} n={3} o={wallO} size={1.0} phase0={0.4} />
            {/* gaz qui tourne et ralentit */}
            <Chevrons path={P_TURN} T={T} speed={0.16} n={4} col={C.hot} o={turnO} sz={0.9} />
            {/* brouillard résiduel qui s'échappe */}
            <Flow path={P_TURN} T={T} speed={0.14} n={3} o={mistO} size={0.34} />

            {/* flotteur + pointeau */}
            <g opacity={floatO}>
              <circle cx={620} cy={floatY} r={34} fill="#dfe7ee" stroke={C.metal} strokeWidth={5} />
              <line x1={588} y1={floatY} x2={520} y2={B.y + B.h - 54} stroke={C.metal} strokeWidth={8}
                    strokeLinecap="round" />
              <path d={'M' + (510 - 22) + ' ' + (B.y + B.h - 44) + ' L' + (510 + 22) + ' ' + (B.y + B.h - 44) +
                       ' L510 ' + (B.y + B.h - 44 + 34 - needle * 16) + ' Z'}
                    fill={needle > 0.4 ? C.good : C.metal} />
            </g>
          </g>

          {/* étiquettes du corps */}
          <Note x={500} y={B.y - 84} text="Séparateur à éclatement" anchor="end" size={34} halo />
          <Note x={70} y={NOZ.y - 32} text="refoulement (HP)" tone={C.hot} anchor="start" size={28} halo o={inO} />
          <Note x={1030} y={330} text="vers le condenseur" tone={C.hot} anchor="end" size={28} halo o={turnO} />
          <Note x={930} y={470} text="le brouillard fin passe" tone={C.bad}
                anchor="end" size={28} halo o={mistO} />
          <Flow path={P_OUT} T={T} speed={0.12} n={4} o={mistO} size={0.34} />
          <Note x={700} y={PL.y - 16} text="plaque de choc" tone={C.blue}
                anchor="end" size={30} halo o={plateO} />
          <Note x={B.x + B.w + 24} y={980} text="film d'huile" tone={C.oilDark}
                anchor="start" size={28} halo o={wallO} />
          <Note x={330} y={B.y + B.h + 60} text="réserve d'huile" tone={C.oilDark} anchor="end" size={28}
                halo o={wallO} />
          <g opacity={floatO}>
            <line x1={752} y1={1174} x2={656} y2={1188} stroke={C.blue2} strokeWidth={3} opacity={0.7} />
            <Note x={760} y={1182} text="flotteur" tone={C.blue} anchor="start" size={28} halo />
          </g>
          <Note x={470} y={1414} text="pointeau" tone={C.blue} anchor="end" size={28} halo o={floatO} />
          <Note x={150} y={1500} text="vers le carter" tone={C.oilDark} anchor="end" size={28} halo o={retO} />

          {/* vitesses */}
          <g opacity={vFast}>
            <Note x={350} y={NOZ.y + 68} text="≈ 12 m/s" tone={C.hot} anchor="end" size={32} halo />
            <Note x={350} y={NOZ.y + 104} text="buse : petite section" tone={C.muted} anchor="end" size={24} halo />
          </g>
          <g opacity={vSlow}>
            <Note x={B.x + 40} y={1000} text="≈ 1 m/s" tone={C.blue} anchor="start" size={32} halo />
            <Note x={B.x + 40} y={1036} text="corps : grande section" tone={C.muted} anchor="start" size={24} halo />
          </g>
          <g opacity={inertO}>
            <path d={'M' + (PL.x - 40) + ' ' + (NOZ.y + 40) + ' q 60 60 -10 150'} fill="none"
                  stroke={C.bad} strokeWidth={6} strokeDasharray="14 10" />
            <Note x={PL.x - 46} y={NOZ.y + 230} text="l'huile continue tout droit" tone={C.bad}
                  anchor="middle" size={28} halo />
          </g>
        </g></g></g>

        {/* ---------- bandeau ---------- */}
        <rect x="0" y="0" width={W} height="150" fill="#ffffff" />
        <rect x="0" y="148" width={W} height="4" fill="#dde6ef" />
        <text x="56" y="96" fill={C.blue} style={{ font: '700 44px ' + FT }}>❄ inerWeb</text>
        <rect x="288" y="56" width="104" height="52" rx="12" fill={C.orange} />
        <text x="340" y="94" textAnchor="middle" fill="#fff" style={{ font: '700 32px ' + FT }}>Édu</text>
        <text x={W - 56} y="92" textAnchor="end" fill={C.muted} style={{ font: '400 26px ' + FB }}>par F. Henninot</text>
        <rect x="0" y="152" width={W} height="140" fill={C.bg} />
        <text x="540" y="276" textAnchor="middle" fill={C.orange} opacity={sectO}
              style={{ font: '700 40px ' + FT, letterSpacing: '1px' }}>{sect}</text>

        {/* ---------- planche : les deux familles ---------- */}
        <g opacity={slideO}>
          <MiniSep x={120} y={520} kind="coal" />
          <MiniSep x={760} y={520} kind="burst" />
          <text x="220" y="900" textAnchor="middle" fill={C.blue}
                style={{ font: '700 40px ' + FT }}>à coalescence</text>
          <text x="860" y="900" textAnchor="middle" fill={C.blue}
                style={{ font: '700 40px ' + FT }}>à éclatement</text>
          <text x="220" y="954" textAnchor="middle" fill={C.muted}
                style={{ font: '400 30px ' + FB }}>élément filtrant</text>
          <text x="860" y="954" textAnchor="middle" fill={C.muted}
                style={{ font: '400 30px ' + FB }}>plaque de choc</text>
          <rect x="530" y="520" width="4" height="440" fill="#dde6ef" />
          <text x="540" y="1076" textAnchor="middle" fill={C.blue2}
                style={{ font: '600 34px ' + FB }}>Même but : récupérer l'huile au refoulement</text>
          <text x="540" y="1132" textAnchor="middle" fill={C.muted}
                style={{ font: '400 32px ' + FB }}>Deux façons de la faire tomber</text>
        </g>

        {/* ---------- planche : comparaison ---------- */}
        <g opacity={limO}>
          <rect x="70" y="470" width="940" height="640" rx="24" fill="#fff" stroke="#dde6ef" strokeWidth="3" />
          <text x="110" y="546" fill={C.blue} style={{ font: '700 36px ' + FT }}>Coalescence</text>
          <text x="700" y="546" fill={C.orange} style={{ font: '700 36px ' + FT }}>Éclatement</text>
          <rect x="110" y="570" width="860" height="3" fill="#dde6ef" />
          {cmp.map((row, i) => (
            <g key={row[0]}>
              <text x="110" y={640 + i * 110} fill={C.muted} style={{ font: '600 28px ' + FB }}>{row[0]}</text>
              <text x="110" y={684 + i * 110} fill={C.blue} style={{ font: '400 30px ' + FB }}>{row[1]}</text>
              <text x="700" y={684 + i * 110} fill={C.blue} style={{ font: '400 30px ' + FB }}>{row[2]}</text>
              {i < 3 && <rect x="110" y={710 + i * 110} width="860" height="2" fill="#eef2f6" />}
            </g>
          ))}
        </g>

        {showVals && (
          <g>
            <Badge x={540} y={1470} text="≈ 12 m/s → ≈ 1 m/s" tone={C.blue} sub="la section s'ouvre, la vitesse tombe"
                   o={vSlow * MOTION.glide(1, 0, Q.Vitesse + 6.6, Q.Vitesse + 7.2)(T)} />
            <Badge x={540} y={1470} text="huile ≈ 700 × plus dense" tone={C.good} sub="ordre de grandeur — elle ne suit pas le virage"
                   o={inertO} />
          </g>
        )}

        {/* ---------- titre ---------- */}
        <g opacity={titleIn} transform={'translate(540 ' + titleY + ') scale(' + titleK + ')'}>
          <text x="0" y="0" textAnchor="middle" fill={C.blue} style={{ font: '700 76px ' + FT }}>LE SÉPARATEUR</text>
          <text x="0" y="86" textAnchor="middle" fill={C.blue} style={{ font: '700 76px ' + FT }}>À ÉCLATEMENT</text>
          <rect x="-180" y="122" width="360" height="8" rx="4" fill={C.orange} />
        </g>
        <text x="540" y="1050" textAnchor="middle" fill={C.muted} opacity={subO}
              style={{ font: '400 42px ' + FB }}>L'autre façon de récupérer l'huile</text>
        <text x="540" y="1118" textAnchor="middle" fill={C.blue2} opacity={subO}
              style={{ font: '600 34px ' + FB }}>Bac Pro MFER · TP BE CVC</text>

        <g opacity={recapOut}>
          {recap.map(([txt, i]) => {
            const o = clamp(MOTION.pop(0, 1, Q.Recap + 0.8 + i * 1.5, Q.Recap + 1.6 + i * 1.5)(T), 0, 1);
            const y = 700 + i * 190;
            return (
              <g key={i} opacity={o} transform={'translate(0 ' + lerp(28, 0, o) + ')'}>
                <rect x="70" y={y - 66} width="940" height="132" rx="22" fill="#fff" stroke="#dde6ef" strokeWidth="3" />
                <rect x="70" y={y - 66} width="14" height="132" rx="7" fill={C.orange} />
                <text x="130" y={y + 14} fill={C.blue} style={{ font: '600 36px ' + FB }}>{txt}</text>
              </g>
            );
          })}
        </g>

        <g opacity={vgO * MOTION.glide(1, 0, Q.Limites - 0.6, Q.Limites - 0.1)(T)}>
          <SightGlass cx={310} cy={1560} T={T} flow={retO} />
          <Note x={352} y={1568} text="voyant : on voit l'huile revenir" tone={C.blue}
                anchor="start" size={26} halo />
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

function EclatementVideo() {
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
        <TweakToggle label="Valeurs chiffrées" value={tw.valeurs !== false}
                     onChange={(v) => setTweak('valeurs', v)} />
        <TweakSection label="Édition" />
        <TweakToggle label="Motion editor" value={tw.motionEditor !== false}
                     onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EclatementVideo = EclatementVideo;
