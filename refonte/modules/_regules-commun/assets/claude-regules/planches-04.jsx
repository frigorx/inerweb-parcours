/* Les régules · Station 4 — planches pas à pas des écrans de cours (03/10/2026)
   2.1 Mémoire : le démarrage ; 2.2 Séquence : l'arrêt sans redémarrage ;
   2.3 Diagnostic : KA 43-44 câblé contre un pont à sa place.
   Même schéma et même logique que le film (RK4.Cabinet, RK4.etat). Une étape =
   un seul évènement, cause → effet, l'organe qui agit surligné (règle du
   01/10 : « dans chaque station on doit comprendre le mouvement »). */
(function () {
  var clamp = window.clamp, Easing = window.Easing;
  var RK = window.RK, C = RK.C;
  var CUES = { Enceinte: 0, Fermeture: 6, Circulation: 13, Consigne: 23, SansCourtCycle: 31,
               Chronologie: 38, CycleComplet: 44, LaCle: 60 };
  var TOTAL = 64;
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
    return (
      <div className="pl">
        <header className="pl-texte" aria-live="polite">
          <div className="pl-num">{p.titre} · étape {k + 1} / {n}</div>
          <h3>{e.titre}</h3>
          <p>{e.texte}</p>
        </header>
        <div className="pl-vue">
          <svg viewBox={p.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={e.titre}>
            <g fontFamily={FONT}>
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

  /* ---- les effets, posés à côté de l'organe qui les commande ---- */

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

  /* L'air de la chambre, que lit le bulbe du thermostat B1. */
  function Air(p) {
    return (
      <g>
        <rect x="246" y="672" width="216" height="118" rx="12" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x="354" y="706" textAnchor="middle" fill={C.mute} fontSize="24" fontWeight="800" letterSpacing="2">AIR CHAMBRE</text>
        <text x="354" y="766" textAnchor="middle" fill={C.blue} fontSize="44" fontWeight="900">{fr(p.temp, 1)} °C</text>
        <line x1="354" y1="790" x2="354" y2="825" stroke={C.mute} strokeWidth="4" strokeDasharray="10 8" />
      </g>
    );
  }

  /* La pression BP, branchée sur l'organe de commande du pressostat. */
  function PriseBP(p) {
    return (
      <g>
        <RK.Manometre x={1290} y={545} r={120} val={p.bp} cutOut={0.3} cutIn={1.8} label="PRESSION BP" />
        <path d="M 1410 590 L 1446 590 L 1446 635 L 1484 635" fill="none" stroke={C.mute} strokeWidth="4" strokeDasharray="10 8" />
      </g>
    );
  }

  /* La courbe de la BP et la marche de KM1, tracées jusqu'à l'instant présent. */
  function Courbe(p) {
    var t0 = 20, t1 = 37, X0 = 610, X1 = 960;
    function X(t) { return X0 + (X1 - X0) * (t - t0) / (t1 - t0); }
    function Y(b) { return 620 - clamp(b / 3, 0, 1) * 200; }
    var tc = clamp(p.T, t0, t1);
    var d = '', dk = '', prec = null;
    for (var t = t0; t <= tc + 0.0001; t += 0.1) {
      var e = window.RK4.etat(t, CUES, TOTAL);
      d += (d ? ' L ' : 'M ') + X(t).toFixed(1) + ' ' + Y(e.bp).toFixed(1);
      var yk = e.kmLive ? 665 : 705;
      if (prec === null) dk = 'M ' + X(t).toFixed(1) + ' ' + yk;
      else if (yk !== prec) dk += ' L ' + X(t).toFixed(1) + ' ' + prec + ' L ' + X(t).toFixed(1) + ' ' + yk;
      prec = yk;
    }
    if (prec !== null) dk += ' L ' + X(tc).toFixed(1) + ' ' + prec;
    return (
      <g>
        <rect x="545" y="330" width="440" height="410" rx="16" fill={C.card} stroke={C.blue} strokeWidth="4" />
        <text x="568" y="372" fill={C.orangeText} fontSize="26" fontWeight="900" letterSpacing="2">PRESSION BP · KM1</text>
        {[[1.8, '1,8', C.orangeText], [0.3, '0,3', C.blue]].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={X0} y1={Y(l[0])} x2={X1} y2={Y(l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="12 10" opacity="0.75" />
              <text x={X0 - 10} y={Y(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <path d={d} fill="none" stroke={C.red} strokeWidth="7" strokeLinejoin="round" />
        <text x={X0 - 10} y="697" textAnchor="end" fill={C.blue} fontSize="24" fontWeight="800">KM1</text>
        <path d={dk} fill="none" stroke={C.orangeText} strokeWidth="7" strokeLinejoin="round" />
        <line x1={X(tc)} y1="395" x2={X(tc)} y2="720" stroke={C.orange} strokeWidth="4" />
      </g>
    );
  }

  /* L'armoire du film, recadrée, avec ses effets côté fluide. */
  function Armoire(p) {
    var e = window.RK4.etat(p.T, CUES, TOTAL);
    var Cab = window.RK4.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} arm={e.arm} bpC={e.bpC} kaC={e.kaC} kmC={e.kmC} kmLive={e.kmLive} tenue={0} />
        </g>
        <Air temp={e.temp} />
        <PriseBP bp={e.bp} />
        <Vanne x={1120} y={1205} ouverte={e.y1Live} />
        <Compresseur x={1445} y={1040} tourne={e.kmLive} now={p.now} />
        {p.courbe && <Courbe T={p.T} />}
      </g>
    );
  }

  var VB_ARMOIRE = '100 262 2120 1068';
  var Z = {
    col1: [290, 660, 540, 470],
    col2: [975, 760, 400, 540],
    ka43: [1585, 765, 230, 180],
    prise: [1150, 405, 740, 335],
    km1: [1370, 960, 550, 260],
    branches: [1585, 725, 615, 255],
    courbe: [535, 320, 460, 430]
  };

  function Planche04Memoire() {
    return (
      <Pas titre="Le démarrage" viewBox={VB_ARMOIRE}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'À l’arrêt, rien ne demande le froid', de: 3, a: 3, dur: 0.2, zones: [],
               texte: 'B1 est ouvert : KA, Y1 et KM1 sont au repos. Y1 est fermée, le compresseur est arrêté, la BP est sous 1,8 bar.' },
             { titre: 'B1 ferme : le relais KA colle', de: 5.2, a: 7.55, dur: 2.2, zones: [Z.col1],
               texte: 'L’air remonte à −14 °C : le thermostat B1 ferme. La bobine KA est alimentée : la demande de froid est gardée en mémoire.' },
             { titre: 'KA ferme ses deux contacts', de: 7.55, a: 8.0, dur: 1.2, zones: [Z.col2, Z.ka43],
               texte: 'KA 13-14 alimente Y1 : l’électrovanne s’ouvre, le liquide part vers l’évaporateur. KA 43-44 prépare le chemin de KM1.' },
             { titre: 'La BP monte : KM1 colle', de: 8.0, a: 9.55, dur: 2.6, zones: [Z.prise, Z.km1],
               texte: 'Le liquide s’évapore, la pression BP monte. À 1,8 bar, le pressostat BP ferme : KM1 colle, le compresseur démarre.' },
             { titre: 'KM1 se tient lui-même', de: 9.55, a: 10.2, dur: 1.2, zones: [Z.branches],
               texte: 'KM1 ferme son contact 13-14. Il a maintenant deux chemins : la demande (KA 43-44) et lui-même (auto-maintien).' }
           ]} />
    );
  }

  function Planche04Sequence() {
    return (
      <Pas titre="L’arrêt" viewBox={VB_ARMOIRE}
           vue={function (T, now) { return <Armoire T={T} now={now} courbe={true} />; }}
           etapes={[
             { titre: 'En marche : deux chemins pour KM1', de: 20, a: 20, dur: 0.2, zones: [Z.branches],
               texte: 'B1 demande le froid, KA est collé, Y1 est ouverte. KM1 est alimenté par la demande (KA 43-44) et par son auto-maintien.' },
             { titre: 'Consigne atteinte : KA retombe', de: 24.0, a: 24.55, dur: 1.4, zones: [Z.col1],
               texte: 'L’air atteint −18 °C : B1 ouvre. La bobine KA n’est plus alimentée, le relais retombe.' },
             { titre: 'Y1 se ferme, KM1 se tient', de: 24.55, a: 25.0, dur: 1.4, zones: [Z.col2, Z.branches],
               texte: 'KA 13-14 coupe Y1 : le liquide n’arrive plus. KA 43-44 s’ouvre aussi, mais KM1 reste alimenté par son contact 13-14.' },
             { titre: 'Le tirage au vide', de: 25.0, a: 28.5, dur: 3.6, zones: [Z.prise, Z.courbe],
               texte: 'Le compresseur aspire le fluide resté dans l’évaporateur : la pression BP descend vers 0,3 bar.' },
             { titre: '0,3 bar : KM1 tombe', de: 28.5, a: 29.0, dur: 1.2, zones: [Z.prise, Z.branches],
               texte: 'Le pressostat BP ouvre : KM1 tombe, son contact 13-14 s’ouvre avec lui. Les deux chemins de KM1 sont coupés.' },
             { titre: 'La BP remonte, KM1 ne repart pas', de: 31.0, a: 36.0, dur: 3.6, zones: [Z.prise, Z.branches, Z.courbe],
               texte: 'À l’arrêt, la pression remonte et repasse 1,8 bar : le pressostat BP ferme. Mais KA 43-44 et KM1 13-14 sont ouverts : pas de court cycle.' }
           ]} />
    );
  }

  /* ---- 2.3 : deux montages côte à côte, la même pression ---- */
  function Essai(p) {
    var ox = p.ox, cx = ox + 330, RK2 = RK;
    var bp = p.bp >= 1.8;
    var pont = p.pont;
    var km = bp && pont;                   /* B1 ouvert : KA est au repos */
    var kmc = km && p.bp >= 1.86;          /* le 13-14 suit la bobine */
    var haut = km ? 'courant' : (bp ? 'phase' : (pont ? 'retour' : 'off'));
    var m = {
      amont: km ? 'courant' : 'phase',
      noeud: haut,
      versKA: km ? 'courant' : haut,
      versKM: km ? (kmc ? 'courant' : 'phase') : haut,
      sousKA: km ? 'courant' : 'retour',
      sousKM: km ? (kmc ? 'courant' : 'phase') : 'retour',
      bas: km ? 'courant' : 'retour'
    };
    var cadre = pont ? C.red : C.green;
    var tr = function (d) { return d.replace(/X(\d+)/g, function (s, n) { return String(ox + +n); }); };
    var fils = [
      ['X330 140 L X330 175', m.amont], ['X330 325 L X330 365', m.amont], ['X330 515 L X330 550', m.noeud],
      ['X330 550 L X330 585', m.versKA], ['X330 550 L X630 550 L X630 585', m.versKM],
      ['X330 735 L X330 770', m.sousKA], ['X630 735 L X630 770 L X330 770', m.sousKM],
      ['X330 770 L X330 831', m.bas], ['X330 889 L X330 980', m.bas]
    ];
    if (pont) fils.push(['X330 585 L X330 735', m.sousKA]);
    return (
      <g>
        <rect x={ox} y="0" width="880" height="1110" rx="20" fill={C.card} stroke={cadre} strokeWidth="5" />
        <text x={ox + 30} y="56" fill={cadre} fontSize="30" fontWeight="900" letterSpacing="1.5">{p.titre}</text>
        <text x={ox + 30} y="96" fill={C.mute} fontSize="24" fontWeight="700">B1 ouvert · KA au repos : pas de demande</text>
        <line x1={ox + 120} y1="140" x2={ox + 760} y2="140" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1={ox + 120} y1="980" x2={ox + 760} y2="980" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x={ox + 92} y="152" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x={ox + 92} y="992" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {fils.map(function (f, i) { return <path key={i} d={'M ' + tr(f[0])} />; })}
        </g>
        {fils.map(function (f, i) { return <RK2.Potentiel key={i} d={'M ' + tr(f[0])} mode={f[1]} t={p.now} />; })}
        <RK2.ContactV nf={true} x={cx} y={175} ouv={0} live={km} glyph="p" code="HP" sub="sécurité · NF" />
        <RK2.ContactV x={cx} y={365} ouv={bp ? 0 : 1} live={km} glyph="p" code="BP" sub="régulation · NO" />
        {pont
          ? <g>
              <circle cx={cx} cy="660" r="92" fill="none" stroke={C.red} strokeWidth="6" strokeDasharray="18 14" />
              <text x={cx + 110} y="650" fill={C.red} fontSize="34" fontWeight="900">PONT</text>
              <text x={cx + 110} y="682" fill={C.red} fontSize="22" fontWeight="800">à la place</text>
              <text x={cx + 110} y="708" fill={C.red} fontSize="22" fontWeight="800">de KA 43-44</text>
            </g>
          : <RK2.ContactV aux={true} x={cx} y={585} ouv={1} live={false} code="KA" sub="demande" b1="43" b2="44" />}
        <RK2.ContactV aux={true} x={ox + 630} y={585} ouv={kmc ? 0 : 1} live={kmc} code="KM1" sub="auto-maintien" />
        <RK2.BobineV x={cx} y={860} code="KM1" sub="COMPRESSEUR" live={km} />
        <RK.Manometre x={ox + 690} y={330} r={120} val={p.bp} cutOut={0.3} cutIn={1.8} label="PRESSION BP" />
        <Compresseur x={ox + 690} y={850} tourne={km} now={p.now} />
        <g opacity={p.verdict}>
          <rect x={ox + 40} y="1010" width="800" height="72" rx="14" fill={pont ? '#fdecea' : '#e4f2ec'} stroke={cadre} strokeWidth="5" />
          <text x={ox + 440} y="1058" textAnchor="middle" fill={cadre} fontSize="32" fontWeight="900">
            {pont ? '✗ KM1 RECOLLE SANS DEMANDE' : '✓ KM1 RESTE AU REPOS'}
          </text>
        </g>
      </g>
    );
  }

  function Planche04Diagnostic() {
    var gauche = [270, 530, 560, 250], droite = [1270, 530, 560, 250];
    return (
      <Pas titre="Le test" viewBox="0 0 1880 1110"
           vue={function (bp, now, k) {
             return (
               <g>
                 <Essai ox={0} pont={false} bp={bp} now={now} titre="MONTAGE A · KA 43-44 CÂBLÉ" verdict={k >= 3 ? 1 : 0} />
                 <Essai ox={1000} pont={true} bp={bp} now={now} titre="MONTAGE B · UN PONT" verdict={k >= 4 ? 1 : 0} />
               </g>
             );
           }}
           etapes={[
             { titre: 'Juste après le tirage au vide', de: 0.3, a: 0.3, dur: 0.2, zones: [],
               texte: 'Les deux installations viennent de s’arrêter. B1 est ouvert : pas de demande de froid. La BP est à 0,3 bar.' },
             { titre: 'À l’arrêt, la BP remonte', de: 0.3, a: 1.7, dur: 3.0, zones: [[555, 195, 275, 330], [1555, 195, 275, 330]],
               texte: 'La pression d’aspiration remonte doucement, plus vite si Y1 fuit. Les deux pressostats BP sont encore ouverts.' },
             { titre: '1,8 bar : les deux BP ferment', de: 1.7, a: 1.95, dur: 1.2, zones: [[150, 355, 430, 175], [1150, 355, 430, 175]],
               texte: 'Les deux pressostats BP ferment au même instant. Regardez KM1 dans chaque montage.' },
             { titre: 'Montage A : KM1 reste au repos', de: 1.95, a: 1.95, dur: 0.2, zones: [gauche],
               texte: 'Le courant bute sur KA 43-44 et KM1 13-14, tous deux ouverts. Seul B1 pourra relancer le froid.' },
             { titre: 'Montage B : KM1 recolle', de: 1.95, a: 1.95, dur: 0.2, zones: [droite],
               texte: 'Le pont laisse passer : KM1 recolle sans demande de froid. Il tire au vide, coupe, recolle : c’est le court cycle de la station 3.' },
             { titre: 'Comment le prouver sur une installation', de: 1.95, a: 1.95, dur: 0.2, zones: [],
               texte: 'Un relais dans l’armoire ne prouve rien. Lire les repères KA 43-44 sur le schéma et au bornier, suivre le conducteur, puis observer un arrêt : la BP remonte, KM1 ne doit pas repartir.' }
           ]} />
    );
  }

  window.Planche04Memoire = Planche04Memoire;
  window.Planche04Sequence = Planche04Sequence;
  window.Planche04Diagnostic = Planche04Diagnostic;
})();
