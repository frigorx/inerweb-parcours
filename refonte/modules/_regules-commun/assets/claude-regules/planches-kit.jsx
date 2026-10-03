/* Les régules — kit des planches pas à pas des écrans de cours (03/10/2026).
   Le lecteur (une étape = un évènement, cause → effet, organe surligné) et les
   effets côté fluide posés près de l'organe qui les commande. Chaque station
   apporte son armoire (RK3, RK4…, exposée par son film) et ses étapes. */
(function () {
  var clamp = window.clamp, Easing = window.Easing;
  var RK = window.RK, C = RK.C;
  var FONT = '"Trebuchet MS", Calibri, sans-serif';

  function fr(v, n) { return v.toFixed(n).replace('.', ',').replace('-', '−'); }

  function useHorloge() {
    var s = React.useState(function () { return performance.now() / 1000; });
    var set = s[1];
    React.useEffect(function () {
      var id;
      function f() { set(performance.now() / 1000); id = requestAnimationFrame(f); }
      id = requestAnimationFrame(f);
      return function () { cancelAnimationFrame(id); };
    }, []);
    return s[0];
  }

  /* Le surligneur : l'ambre du film, jamais rouge ni orange (phase, retour). */
  function Spots(p) {
    if (!p.zones || !p.zones.length) return null;
    return (
      <g pointerEvents="none" opacity={clamp(p.u * 4, 0, 1)}>
        {p.zones.map(function (z, i) {
          return <rect key={i} x={z[0]} y={z[1]} width={z[2]} height={z[3]} rx="22"
                       fill="#f5c84c" fillOpacity="0.13" stroke="#e6a817" strokeWidth="8"
                       strokeOpacity={0.75 + 0.2 * Math.sin(p.now * 2.4)} />;
        })}
      </g>
    );
  }

  /* Le lecteur pas à pas : texte de l'étape en haut, schéma au centre,
     commandes en bas. Chaque étape joue son mouvement puis s'arrête. */
  function Pas(p) {
    var now = useHorloge();
    var n = p.etapes.length;
    var st = React.useState({ k: 0, t0: performance.now() / 1000 });
    var k = st[0].k, t0 = st[0].t0, set = st[1];
    function aller(i) { set({ k: clamp(i, 0, n - 1), t0: performance.now() / 1000 }); }
    React.useEffect(function () {
      function clavier(ev) {
        if (ev.key === 'ArrowRight') aller(k + 1);
        else if (ev.key === 'ArrowLeft') aller(k - 1);
      }
      window.addEventListener('keydown', clavier);
      return function () { window.removeEventListener('keydown', clavier); };
    });
    var e = p.etapes[k];
    var u = clamp((now - t0 - 0.4) / (e.dur || 1.2), 0, 1);
    var T = e.de + (e.a - e.de) * Easing.easeInOutCubic(u);
    var vb = p.viewBox.split(/\s+/).map(Number);   /* rien ne déborde du cadre choisi */
    return (
      <div className="pl">
        <header className="pl-texte" aria-live="polite">
          <div className="pl-num">{p.titre} · étape {k + 1} / {n}</div>
          <h3>{e.titre}</h3>
          <p>{e.texte}</p>
        </header>
        <div className="pl-vue">
          <svg viewBox={p.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={e.titre}>
            <clipPath id="pl-cadre"><rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} /></clipPath>
            <g fontFamily={FONT} clipPath="url(#pl-cadre)">
              {p.vue(T, now, k)}
              <Spots zones={e.zones} u={u} now={now} />
            </g>
          </svg>
        </div>
        <nav className="pl-nav" aria-label="Étapes">
          <button type="button" onClick={function () { aller(k - 1); }} disabled={k === 0}>◀ Précédent</button>
          <div className="pl-points">
            {p.etapes.map(function (x, i) {
              return <button type="button" key={i} className={i === k ? 'actif' : ''}
                             aria-label={'Étape ' + (i + 1) + ' : ' + x.titre}
                             onClick={function () { aller(i); }}>{i + 1}</button>;
            })}
          </div>
          <button type="button" onClick={function () { aller(k); }}>↻ Revoir</button>
          <button type="button" className="principal" onClick={function () { aller(k + 1); }}
                  disabled={k === n - 1}>Suivant ▶</button>
        </nav>
      </div>
    );
  }

  /* L'électrovanne : le symbole du circuit du film (kit, Machine). */
  function Vanne(p) {
    var o = p.ouverte, col = o ? C.orangeText : C.blue;
    return (
      <g>
        <line x1={p.x} y1={p.y - 78} x2={p.x} y2={p.y - 46} stroke={o ? C.orangeText : C.line} strokeWidth="10" strokeLinecap="round" />
        <line x1={p.x} y1={p.y + 46} x2={p.x} y2={p.y + 78} stroke={o ? C.orangeText : C.line} strokeWidth="10" strokeLinecap="round" />
        <g transform={'translate(' + p.x + ',' + p.y + ') scale(0.85) translate(-500,-400)'}>
          <polygon points="458,348 542,348 500,400" fill={o ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
          <polygon points="458,452 542,452 500,400" fill={o ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
          <rect x="542" y="368" width="86" height="64" fill={o ? '#fff0e9' : C.card} stroke={col} strokeWidth="6" />
          <line x1="542" y1="432" x2="628" y2="368" stroke={col} strokeWidth="6" />
        </g>
        <text x={p.x + 125} y={p.y - 4} fill={C.blue} fontSize="30" fontWeight="900">Y1</text>
        <text x={p.x + 125} y={p.y + 32} fill={o ? C.orangeText : C.mute} fontSize="28" fontWeight="800">{o ? 'OUVERTE' : 'FERMÉE'}</text>
      </g>
    );
  }

  /* Le compresseur : le symbole normalisé du kit, coloré quand il tourne. */
  function Compresseur(p) {
    var on = p.tourne;
    return (
      <g>
        <circle cx={p.x} cy={p.y} r="50" fill={on ? '#fff0e9' : C.card} stroke="none" />
        <g opacity={on ? 1 : 0.8}><RK.SymCompresseur x={p.x} y={p.y} s={3.2} /></g>
        {on && <circle cx={p.x} cy={p.y} r="62" fill="none" stroke={C.orangeText} strokeWidth="5"
                       strokeDasharray="22 16" strokeDashoffset={-p.now * 60} />}
        <text x={p.x} y={p.y + 104} textAnchor="middle" fill={on ? C.orangeText : C.mute} fontSize="28" fontWeight="900">
          {on ? 'TOURNE' : 'ARRÊTÉ'}
        </text>
      </g>
    );
  }

  /* L'air de la chambre, que lit le bulbe du thermostat B1 (cx = centre du θ). */
  function Air(p) {
    var cx = p.cx;
    return (
      <g>
        <rect x={cx - 108} y="646" width="216" height="118" rx="12" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x={cx} y="680" textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="800" letterSpacing="2">AIR CHAMBRE</text>
        <text x={cx} y="740" textAnchor="middle" fill={C.blue} fontSize="44" fontWeight="900">{fr(p.temp, 1)} °C</text>
        <line x1={cx} y1="764" x2={cx} y2="825" stroke={C.mute} strokeWidth="4" strokeDasharray="10 8" />
      </g>
    );
  }

  /* La pression BP, branchée sur l'organe de commande du pressostat (tx, ty). */
  function PriseBP(p) {
    var x = p.x, y = p.y, r = p.r || 120, cx = p.tx - 38;
    return (
      <g>
        <RK.Manometre x={x} y={y} r={r} val={p.bp} cutOut={0.3} cutIn={1.8} label="PRESSION BP" />
        <path d={'M ' + (x + r) + ' ' + (y + 45) + ' L ' + cx + ' ' + (y + 45) + ' L ' + cx + ' ' + p.ty + ' L ' + p.tx + ' ' + p.ty}
              fill="none" stroke={C.mute} strokeWidth="4" strokeDasharray="10 8" />
      </g>
    );
  }

  /* La courbe de la BP et la marche de KM1, tracées jusqu'à l'instant présent.
     p.etat(t) rend { bp, kmLive } ; la carte fait 440 × 410 à partir de (x, y). */
  function Courbe(p) {
    var x = p.x, y = p.y, t0 = p.t0, t1 = p.t1, X0 = x + 65, X1 = x + 415;
    function X(t) { return X0 + (X1 - X0) * (t - t0) / (t1 - t0); }
    function Y(b) { return y + 290 - clamp(b / 3, 0, 1) * 200; }
    var tc = clamp(p.T, t0, t1);
    var d = '', dk = '', prec = null;
    for (var t = t0; t <= tc + 0.0001; t += 0.1) {
      var e = p.etat(t);
      d += (d ? ' L ' : 'M ') + X(t).toFixed(1) + ' ' + Y(e.bp).toFixed(1);
      var yk = e.kmLive ? y + 335 : y + 375;
      if (prec === null) dk = 'M ' + X(t).toFixed(1) + ' ' + yk;
      else if (yk !== prec) dk += ' L ' + X(t).toFixed(1) + ' ' + prec + ' L ' + X(t).toFixed(1) + ' ' + yk;
      prec = yk;
    }
    if (prec !== null) dk += ' L ' + X(tc).toFixed(1) + ' ' + prec;
    return (
      <g>
        <rect x={x} y={y} width="440" height="410" rx="16" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x={x + 23} y={y + 42} fill={C.orangeText} fontSize="26" fontWeight="900" letterSpacing="2">PRESSION BP · KM1</text>
        {[[1.8, '1,8', C.orangeText], [0.3, '0,3', C.blue]].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={X0} y1={Y(l[0])} x2={X1} y2={Y(l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="12 10" opacity="0.75" />
              <text x={X0 - 10} y={Y(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <path d={d} fill="none" stroke={C.red} strokeWidth="7" strokeLinejoin="round" />
        <text x={X0 - 10} y={y + 367} textAnchor="end" fill={C.blue} fontSize="24" fontWeight="800">KM1</text>
        <path d={dk} fill="none" stroke={C.orangeText} strokeWidth="7" strokeLinejoin="round" />
        <line x1={X(tc)} y1={y + 65} x2={X(tc)} y2={y + 390} stroke={C.orange} strokeWidth="4" />
      </g>
    );
  }

  window.PK = { fr: fr, useHorloge: useHorloge, Spots: Spots, Pas: Pas, Vanne: Vanne,
                Compresseur: Compresseur, Air: Air, PriseBP: PriseBP, Courbe: Courbe };
})();
