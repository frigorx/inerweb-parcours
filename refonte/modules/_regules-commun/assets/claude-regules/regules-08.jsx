/* Les régules · Pump-down + dégivrage électrique (croix du frigoriste, kit commun) */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var Easing = window.Easing;
  var animate = window.animate;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Chip = RK.Chip, Coil = RK.Coil, Croix = RK.Croix, CroixLabels = RK.CroixLabels;
  var ChambreFond = RK.ChambreFond, Chambre = RK.Chambre, Machine = RK.Machine;
  var Pipes = RK.Pipes, PipeChips = RK.PipeChips, Manometre = RK.Manometre;
  var ContactNO = RK.ContactNO, ContactNF = RK.ContactNF, Disjoncteur = RK.Disjoncteur, Bobine = RK.Bobine;

  function lerpPts(pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i];
        var u = (x - a[0]) / Math.max(b[0] - a[0], 1e-6);
        return a[1] + (b[1] - a[1]) * u;
      }
    }
    return pts[pts.length - 1][1];
  }

  function accum(T, ivs) {
    var s = 0;
    for (var i = 0; i < ivs.length; i++) s += clamp(T, ivs[i][0], ivs[i][1]) - ivs[i][0];
    return s;
  }

  function onIvs(T, ivs, up, dn) {
    var m = 0;
    for (var i = 0; i < ivs.length; i++) {
      var a = ivs[i][0], b = ivs[i][1], v = 0;
      if (T >= a && T < b) v = clamp((T - a) / up, 0, 1);
      else if (T >= b) v = clamp(1 - (T - b) / dn, 0, 1);
      if (v > m) m = v;
    }
    return m;
  }

  /* résistances de dégivrage + bac d'égouttage, posés sur le serpentin du kit */
  function Resistances(p) {
    var rows = [920, 980, 1040, 1100];
    var zig = function (y) {
      var d = 'M 1130 ' + y;
      for (var x = 1130; x < 1530; x += 40) d += ' L ' + (x + 20) + ' ' + (y - 14) + ' L ' + (x + 40) + ' ' + y;
      return d;
    };
    var glow = clamp(p.heat, 0, 1);
    var drops = [];
    for (var i = 0; i < 7; i++) {
      var ph = (p.T * 1.5 + i * 0.37) % 1;
      drops.push([1160 + i * 62, 1160 + ph * 60, 1 - ph]);
    }
    return (
      <g>
        {rows.map(function (y) {
          return (
            <g key={y}>
              <path d={zig(y)} fill="none" stroke={C.red} strokeWidth="7" strokeLinecap="round"
                    opacity={0.35 + 0.65 * glow} />
              {glow > 0.05 && (
                <path d={zig(y)} fill="none" stroke="#ff8b57" strokeWidth={16 + 6 * Math.sin(p.T * 4)}
                      strokeLinecap="round" opacity={0.32 * glow} />
              )}
            </g>
          );
        })}
        <rect x="1110" y="1188" width="450" height="18" rx="6" fill="#dfe6ee" stroke={C.blue} strokeWidth="4" />
        <path d="M 1560 1197 L 1640 1197 L 1640 1268" fill="none" stroke={C.blue} strokeWidth="8" strokeLinecap="round" />
        <text x="1660" y="1276" fill={C.mute} fontSize="24" fontWeight="800">ÉCOULEMENT</text>
        <g opacity={clamp(p.melt, 0, 1)}>
          {drops.map(function (d, i) {
            return <ellipse key={i} cx={d[0]} cy={d[1]} rx="7" ry="11" fill="#5d9dcd" opacity={0.35 + 0.5 * d[2]} />;
          })}
        </g>
        <Chip T={p.T} at={27.4} x="740" y="1060" text="RÉSISTANCES DE BATTERIE" sub="elles apportent la chaleur, froid arrêté" fs="32" tone={C.red} />
      </g>
    );
  }

  function SondeS1(p) {
    return (
      <g>
        <rect x="2380" y="1030" width="310" height="140" rx="14" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="2402" y="1066" fill={C.orangeText} fontSize="22" fontWeight="900" letterSpacing="2">SONDE S1 · BATTERIE</text>
        <text x="2402" y="1120" fill={p.val > 4 ? C.red : C.blue} fontSize="46" fontWeight="900">
          {(p.val >= 0 ? '+' : '') + p.val.toFixed(1)} °C
        </text>
        <text x="2402" y="1152" fill={C.mute} fontSize="20" fontWeight="700">FIN DE DÉGIVRAGE +10 °C</text>
        <circle cx="2664" cy="1058" r="12" fill={p.heat > 0.4 ? C.red : '#d6dde5'} />
      </g>
    );
  }

  function Cabinet(p) {
    var RK2 = window.RK;
    /* Schéma VERTICAL (22/08) : quatre colonnes — Y1, le compresseur, les
       résistances, les ventilateurs différés. Rouge = phase, orange = retour
       neutre (l'aval d'un contact ouvert). */
    var ouvB1 = clamp(-p.armB1 / 30, 0, 1);
    var ouvBP = clamp(-p.armBP / 30, 0, 1);
    var ouvKT = clamp(-p.armKT / 30, 0, 1);
    function colonne(contactsOuverts, courant) {
      var premier = contactsOuverts.indexOf(true);
      return function (troncon) {
        if (premier === -1) return courant ? 'courant' : 'courant';
        return troncon <= premier ? 'phase' : 'retour';
      };
    }
    var m1 = colonne([ouvB1 >= 0.5, p.degLive > 0.5], p.y1Live > 0.5);
    var m2 = colonne([false, ouvBP >= 0.5, p.kt >= 0.5], p.kmLive > 0.5);
    var m3 = colonne([ouvKT >= 0.5, p.s1Ouvert >= 0.5], p.degLive > 0.5);
    var m4 = colonne([p.ventLive < 0.5], p.ventLive > 0.5);
    function fils(x, hauts) {
      return (
        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {hauts.map(function (d, i) { return <path key={i} d={d} />; })}
        </g>
      );
    }
    return (
      /* Retour F. Henninot (22/08 soir) : l'armoire se RESSERRE en largeur et
         s'ÉTEND sur toute la hauteur de la page — colonnes aérées, le
         chronogramme étant parti à gauche sous la croix. */
      <g transform="translate(2820,100)">
        <rect x="0" y="0" width="2240" height="2160" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · PUMP-DOWN ET DÉGIVRAGE ÉLECTRIQUE</text>
        <text x="40" y="108" fill={C.blue} fontSize="24" fontWeight="900" letterSpacing="2">LE DÉGIVRAGE PREND LA MAIN SUR LE FROID</text>

        <line x1="170" y1="104" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="2100" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="2040" x2="2100" y2="2040" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="2052" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        {/* colonne 1 : Y1 — le thermostat, puis l'horloge qui ouvre au dégivrage */}
        {fils(340, ['M 340 300 L 340 400', 'M 340 550 L 340 700', 'M 340 850 L 340 1691', 'M 340 1749 L 340 2040'])}
        <RK2.Potentiel d="M 340 300 L 340 400" mode={m1(0)} t={p.T} />
        <RK2.Potentiel d="M 340 550 L 340 700" mode={m1(1)} t={p.T} />
        <RK2.Potentiel d="M 340 850 L 340 1691" mode={m1(2)} t={p.T} />
        <RK2.Potentiel d="M 340 1749 L 340 2040" mode={m1(2)} t={p.T} />
        <RK2.ContactV x={340} y={400} ouv={ouvB1} live={p.y1Live > 0.5} glyph="θ" code="B1" sub="thermostat" />
        <RK2.ContactV nf={true} x={340} y={700} ouv={p.degLive > 0.5 ? 1 : 0} live={p.y1Live > 0.5} glyph="t" code="KT" sub="ouvre au dégivrage" />
        <RK2.BobineV x={340} y={1720} code="Y1" sub="ÉLECTROVANNE" live={p.y1Live > 0.5} />

        {/* colonne 2 : KM1 — sécurité, régulation, verrouillage au dégivrage */}
        {fils(900, ['M 900 300 L 900 400', 'M 900 550 L 900 700', 'M 900 850 L 900 1000', 'M 900 1150 L 900 1691', 'M 900 1749 L 900 2040'])}
        <RK2.Potentiel d="M 900 300 L 900 400" mode={m2(0)} t={p.T} />
        <RK2.Potentiel d="M 900 550 L 900 700" mode={m2(1)} t={p.T} />
        <RK2.Potentiel d="M 900 850 L 900 1000" mode={m2(2)} t={p.T} />
        <RK2.Potentiel d="M 900 1150 L 900 1691" mode={m2(3)} t={p.T} />
        <RK2.Potentiel d="M 900 1749 L 900 2040" mode={m2(3)} t={p.T} />
        <RK2.ContactV nf={true} x={900} y={400} ouv={0} live={p.kmLive > 0.5} glyph="p" code="HP" sub="sécurité HP" />
        <RK2.ContactV x={900} y={700} ouv={ouvBP} live={p.kmLive > 0.5} glyph="p" code="BP" sub="régulation · tirage" />
        <RK2.ContactV nf={true} x={900} y={1000} ouv={p.kt} live={p.kmLive > 0.5} glyph="t" code="KT" sub="verrouillage" />
        <RK2.BobineV x={900} y={1720} code="KM1" sub="COMPRESSEUR" live={p.kmLive > 0.5} />

        {/* colonne 3 : KM2 — l'horloge lance, la sonde de fin coupe */}
        {fils(1460, ['M 1460 300 L 1460 400', 'M 1460 550 L 1460 700', 'M 1460 850 L 1460 1691', 'M 1460 1749 L 1460 2040'])}
        <RK2.Potentiel d="M 1460 300 L 1460 400" mode={m3(0)} t={p.T} />
        <RK2.Potentiel d="M 1460 550 L 1460 700" mode={m3(1)} t={p.T} />
        <RK2.Potentiel d="M 1460 850 L 1460 1691" mode={m3(2)} t={p.T} />
        <RK2.Potentiel d="M 1460 1749 L 1460 2040" mode={m3(2)} t={p.T} />
        <RK2.ContactV x={1460} y={400} ouv={ouvKT} live={p.degLive > 0.5} glyph="t" code="KT" sub="horloge de dégivrage" />
        <RK2.ContactV nf={true} x={1460} y={700} ouv={p.s1Ouvert} live={p.degLive > 0.5} glyph="θ" code="S1" sub="fin · ouvre à +10 °C" />
        <RK2.BobineV x={1460} y={1720} code="KM2" sub="RÉSISTANCES" live={p.degLive > 0.5} />

        {/* colonne 4 : KM3 — la temporisation retient les ventilateurs */}
        {fils(2020, ['M 2020 300 L 2020 700', 'M 2020 850 L 2020 1691', 'M 2020 1749 L 2020 2040'])}
        <RK2.Potentiel d="M 2020 300 L 2020 700" mode={m4(0)} t={p.T} />
        <RK2.Potentiel d="M 2020 850 L 2020 1691" mode={m4(1)} t={p.T} />
        <RK2.Potentiel d="M 2020 1749 L 2020 2040" mode={m4(1)} t={p.T} />
        <RK2.ContactV aux={true} x={2020} y={700} ouv={p.ventLive > 0.5 ? 0 : 1} live={p.ventLive > 0.5} code="KT" sub="tempo · reprise différée" />
        <RK2.BobineV x={2020} y={1720} code="KM3" sub="VENTILATEURS" live={p.ventLive > 0.5} />

        {ouvB1 >= 0.5 && p.y1Live <= 0.5 && (
          <text x="376" y="1950" fill={C.orangeText} fontSize="26" fontWeight="800" opacity="0.9">retour neutre</text>
        )}
      </g>
    );
  }

  /* Caméra propre au 08 : son armoire étirée (2820→5060 × 100→2260) et son
     chronogramme parti à gauche demandent leurs propres cadrages. */
  function camFixed08(T) {
    var croix = { cx: 1400, cy: 720, z: 0.74 };
    var duo = { cx: 2680, cy: 1160, z: 0.40 };
    var large = { cx: 2665, cy: 1300, z: 0.40 };
    var V = [
      { t: 0, v: { cx: 1420, cy: 1010, z: 0.90 } },
      { t: 6, v: { cx: 3940, cy: 1000, z: 0.58 } },
      { t: 13, v: croix },
      { t: 23, v: duo },
      { t: 31, v: croix },
      { t: 38, v: { cx: 1505, cy: 2020, z: 0.70 } },
      { t: 44, v: large },
      { t: 60, v: large }
    ];
    var k = V[0].v;
    for (var i = 0; i < V.length; i++) if (T >= V[i].t) k = V[i].v;
    return k;
  }

  var CH = { x0: 700, x1: 2420 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chEvap(v) { return 2200 - ((v + 20) / 32) * 230; }
  function chBar(v) { return 2490 - clamp(v / 3, 0, 1) * 120; }

  function Chrono(p) {
    var r = MOTION.draw(38.25, 4.6)(p.T);
    var evap = [[0, -16], [0.08, -15], [0.10, -14], [0.44, -19], [0.50, -18], [0.52, -17], [0.74, 10], [0.80, 4], [0.86, -8], [1, -17]];
    var bar = [[0, 1.5], [0.08, 1.7], [0.11, 3.0], [0.18, 2.3], [0.44, 2.2], [0.50, 0.3], [0.62, 1.4], [0.74, 2.6], [0.80, 2.4], [1, 2.2]];
    function poly(pts, fy) {
      return pts.map(function (q, i) { return (i ? 'L ' : 'M ') + chx(q[0]) + ' ' + fy(q[1]); }).join(' ');
    }
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
      <g transform="translate(200,-260)">
        <rect x="70" y="1860" width="2470" height="940" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">
          CHRONOLOGIE · UN CYCLE DE FROID, UN DÉGIVRAGE, LA REPRISE
        </text>
        <rect x={chx(0.44)} y="1960" width={chx(0.86) - chx(0.44)} height="820" fill="#e4f2ec" opacity="0.55" />
        <text x={(chx(0.44) + chx(0.86)) / 2} y="1988" textAnchor="middle" fill={C.green} fontSize="32" fontWeight="900" letterSpacing="3">
          SÉQUENCE DE DÉGIVRAGE
        </text>
        {[['BATTERIE S1', 2070], ['B1 ET Y1', 2295], ['PRESSION BP', 2440], ['KM2 RÉSISTANCES', 2585], ['KM3 VENTILATEURS', 2705]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="36" fontWeight="800">{l[0]}</text>;
        })}
        {[[10, '+10 · fin de dégivrage'], [-18, '−18 · froid établi']].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chEvap(l[0])} x2={CH.x1} y2={chEvap(l[0])} stroke={C.line} strokeWidth="3" strokeDasharray="14 12" />
              <text x={CH.x0} y={chEvap(l[0]) - 12} fill={C.mute} fontSize="26" fontWeight="700">{l[1]}</text>
            </g>
          );
        })}
        {[[1.8, '1,8 bar'], [0.3, '0,3 bar']].map(function (l) {
          return (
            <g key={l[0]}>
              <line x1={CH.x0} y1={chBar(l[0])} x2={CH.x1} y2={chBar(l[0])} stroke={C.line} strokeWidth="3" strokeDasharray="14 12" />
              <text x={CH.x1 + 10} y={chBar(l[0]) + 8} fill={C.mute} fontSize="24" fontWeight="700">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip8">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="820" />
        </clipPath>
        <g clipPath="url(#chclip8)">
          <path d={poly(evap, chEvap)} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2250, 2320, [[0.08, 0.44], [0.80, 1]])} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={poly(bar, chBar)} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2540, 2610, [[0.52, 0.74]])} fill="none" stroke={C.red} strokeWidth="10" strokeLinejoin="round" />
          <path d={square(2660, 2730, [[0.10, 0.50], [0.86, 1]])} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2740" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        {/* Pendant la scène CycleComplet, le curseur suit le cycle rejoué. */}
        {p.replayF > 0 && (
          <g>
            <line x1={chx(p.replayF)} y1="1960" x2={chx(p.replayF)} y2="2740" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replayF)} cy="1960" r="16" fill={C.orange} />
          </g>
        )}
        <g opacity={note}>
          <line x1={chx(0.74)} y1="2520" x2={chx(0.74)} y2="2760" stroke={C.green} strokeWidth="6" strokeDasharray="18 14" />
          <line x1={chx(0.86)} y1="2640" x2={chx(0.86)} y2="2760" stroke={C.blue} strokeWidth="6" strokeDasharray="18 14" />
          <text x="1560" y="2780" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">
            FIN SUR SONDE, PUIS ÉGOUTTAGE, PUIS SEULEMENT LES VENTILATEURS
          </text>
        </g>
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var tB1 = CUES.Fermeture + 1.6;
    var tKMc = CUES.Fermeture + 2.05;
    var tKT = CUES.Consigne + 1.0;
    var tKMo = CUES.Consigne + 3.2;
    var tKM2 = CUES.Consigne + 4.0;
    var tFin = CUES.Degivrage + 3.0;
    var tReprise = CUES.Degivrage + 5.5;
    var tVent = CUES.Chronologie + 0.2;

    /* Scène CycleComplet (brief 22/08) : la séquence ENTIÈRE se rejoue en
       plan large — froid, dégivrage, égouttage, reprise, ventilateurs
       différés — les trois vues synchrones. L'habillage reste au temps réel. */
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var kRejeu = (tVent + 2 - (tB1 - 1)) / 16;
    var Tm = enRejeu ? (tB1 - 1) + (T - CUES.CycleComplet) * kRejeu : T;

    var b1 = (Tm >= tB1 && Tm < tKT) || Tm >= tReprise ? 1 : 0;
    var y1Ivs = [[tB1, tKT], [tReprise, c.authoredTotal]];
    var kmIvs = [[tKMc, tKMo], [tReprise + 0.4, c.authoredTotal]];
    var degIvs = [[tKM2, tFin]];
    var ventIvs = [[tKMc, tKMo + 0.2], [tVent, c.authoredTotal]];

    var y1Live = onIvs(Tm, y1Ivs, 0.25, 0.2);
    var kmLive = onIvs(Tm, kmIvs, 0.25, 0.2);
    var degLive = onIvs(Tm, degIvs, 0.3, 0.3);
    var ventLive = onIvs(Tm, ventIvs, 0.3, 0.2);
    var kt = (Tm >= tKT && Tm < tFin) ? 1 : 0;

    var flow = onIvs(Tm, kmIvs, 0.9, 0.7);
    var phase = accum(Tm, kmIvs);
    var spinFans = accum(Tm, ventIvs) * 300;

    var frost = clamp(accum(Tm, [[tKMc, tKT]]) / (tKT - tKMc), 0, 1) *
      clamp(1 - accum(Tm, [[tKM2, tFin]]) / ((tFin - tKM2) * 0.8), 0, 1);
    var melt = degLive * 0.9 + (Tm >= tFin && Tm < tReprise ? 0.8 : 0);

    var evapT = lerpPts([[0, -16], [tB1, -15], [tKMc, -14], [tKT, -19], [tKMo, -18], [tKM2, -17],
      [tFin, 10], [tReprise, 3], [tVent, -8], [c.authoredTotal, -17]], Tm);
    var airT = lerpPts([[0, -15.4], [tB1, -14], [tKT, -18], [tFin, -13.6], [tReprise, -13.2],
      [c.authoredTotal, -16.2]], Tm);
    var bp = lerpPts([[0, 1.5], [tB1, 1.7], [tB1 + 0.5, 3.0], [tB1 + 1.6, 2.3], [tKT, 2.2],
      [tKMo, 0.3], [tFin, 2.6], [tReprise, 2.4], [c.authoredTotal, 2.2]], Tm);

    /* La sonde de fin de dégivrage ouvre à +10 °C et se referme quand l'évaporateur
       est redescendu : c'est elle qui met fin au dégivrage, il faut la voir couper. */
    var s1Ouvert = clamp((Tm - tFin) / 0.3, 0, 1) * clamp(1 - (Tm - tReprise) / 0.3, 0, 1);

    var armB1 = b1 ? -30 + 30 * clamp((Tm - tB1) / 0.3, 0, 1) : (Tm < tB1 ? -30 : -30 * clamp((Tm - tKT) / 0.2, 0, 1));
    if (Tm >= tReprise) armB1 = 0;
    var armBP = kmLive > 0.5 ? 0 : -30;
    var armKT = kt ? 0 : -30;
    var replayF = enRejeu
      ? lerpPts([[tB1 - 1, 0.06], [tB1, 0.08], [tKMc, 0.10], [tKT, 0.44], [tKMo, 0.50],
                 [tKM2, 0.52], [tFin, 0.74], [tReprise, 0.80], [tVent, 0.86], [tVent + 2, 0.88]], Tm)
      : 0;

    var cam = props.fixedCam !== false ? camFixed08(T) : RK.camAt(T);
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var banniere = clamp((T - CUES.Consigne - 4.4) / 0.6, 0, 1) * clamp(1 - (T - tFin) / 0.6, 0, 1) * (1 - keyIn);
    var egout = clamp((T - tFin) / 0.6, 0, 1) * clamp(1 - (T - tReprise) / 0.6, 0, 1) * (1 - keyIn);

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond />
            <Pipes phase={phase} flow={flow} />
            <Chambre T={T} temp={airT} spin={spinFans} flow={ventLive} phase={phase} energy={kmLive}
                     frostU={frost} liquid={y1Live * 0.3} cid="d8" />
            <Resistances T={T} heat={degLive} melt={melt} />
            <Machine T={T} carter={0} spin={phase * 300} flow={flow} phase={phase} live={y1Live > 0.5} />
            <SondeS1 val={evapT} heat={degLive} />
            <Manometre x={2320} y={760} r={92} val={bp} max={6} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
            <g>
              <rect x="2400" y="912" width="300" height="76" rx="10" fill={C.card}
                    stroke={kmLive > 0.5 ? C.orangeText : C.blue} strokeWidth="5" />
              <text x="2550" y="962" textAnchor="middle" fill={kmLive > 0.5 ? C.orangeText : C.mute}
                    fontSize="30" fontWeight="900">{kmLive > 0.5 ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}</text>
            </g>
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <Cabinet T={T} b1={b1} kt={kt} armB1={armB1} armBP={armBP} armKT={armKT}
                     s1Ouvert={s1Ouvert}
                     y1Live={y1Live} kmLive={kmLive} degLive={degLive} ventLive={ventLive} />
            <Chrono T={T} replayF={replayF} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', right: '3%', width: '29%', top: '9%', opacity: banniere,
          background: 'rgba(255,253,248,0.96)', border: '4px solid ' + C.red, borderRadius: 14,
          padding: '14px 20px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: C.red, font: '900 30px ' + font, letterSpacing: 1 }}>DÉGIVRAGE EN COURS</div>
          <div style={{ color: C.mute, font: '700 22px ' + font, marginTop: 4 }}>froid arrêté, ventilateurs arrêtés, résistances alimentées</div>
        </div>

        <div style={{
          position: 'absolute', right: '3%', width: '29%', top: '9%', opacity: egout,
          background: 'rgba(255,253,248,0.96)', border: '4px solid #287a62', borderRadius: 14,
          padding: '14px 20px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: '#287a62', font: '900 30px ' + font, letterSpacing: 1 }}>ÉGOUTTAGE</div>
          <div style={{ color: C.mute, font: '700 22px ' + font, marginTop: 4 }}>l’eau s’évacue avant que les ventilateurs repartent</div>
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
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>PUMP-DOWN ET DÉGIVRAGE ÉLECTRIQUE</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              Le dégivrage ferme Y1, laisse le compresseur tirer au vide, puis chauffe la batterie.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Fin sur sonde, égouttage, et seulement ensuite les ventilateurs.
            </div>
          </div>
        </div>

        {props.captions && (
          <Captions
            style={{
              bottom: 0, left: 0, right: 0, padding: '18px 8% 16px',
              font: '800 36px ' + font, color: C.blue, textShadow: 'none',
              background: C.paper, borderTop: '3px solid ' + C.line
            }}
            items={[
              { at: 0.4, text: 'Une chambre froide NÉGATIVE : l’air y est maintenu sous zéro degré — ici, consigne −18 °C.' },
              { at: 3.2, text: 'À l’arrêt, batterie propre : l’air remonte vers −14 °C.' },
              { at: CUES.Fermeture + 0.4, text: 'Le thermostat ferme : Y1 s’ouvre, le liquide arrive.' },
              { at: CUES.Fermeture + 2.6, text: 'La pression monte : à 1,8 bar la BP ferme et KM1 colle.' },
              { at: CUES.Fermeture + 4.6, text: 'Les ventilateurs brassent l’air : le froid est produit.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 3.0, text: 'Le liquide s’évapore dans le serpentin et prend la chaleur.' },
              { at: CUES.Circulation + 6.0, text: 'Le givre s’installe sur la batterie : il faudra le faire fondre.' },
              { at: CUES.Circulation + 8.4, text: 'La glace isole les ailettes et fait chuter l’échange.' },
              { at: CUES.Consigne + 0.4, text: 'L’horloge de dégivrage prend la main sur le froid.' },
              { at: CUES.Consigne + 2.0, text: 'Son contact ouvre la ligne liquide : Y1 se ferme.' },
              { at: CUES.Consigne + 3.4, text: 'Tirage au vide : la BP tombe à 0,3 bar, KM1 lâche.' },
              { at: CUES.Consigne + 5.0, text: 'Ventilateurs arrêtés : on ne souffle pas la chaleur dans la chambre.' },
              { at: CUES.Consigne + 6.6, text: 'KM2 alimente les résistances de batterie.' },
              { at: CUES.Degivrage + 0.6, text: 'Le givre fond, l’eau tombe dans le bac et s’évacue.' },
              { at: CUES.Degivrage + 2.6, text: 'La sonde S1 monte : à +10 °C elle ouvre et coupe KM2.' },
              { at: CUES.Degivrage + 4.0, text: 'Égouttage : on laisse l’eau partir avant de reprendre.' },
              { at: CUES.Degivrage + 5.6, text: 'Reprise du froid : Y1 s’ouvre, la BP referme, KM1 colle.' },
              { at: CUES.Chronologie + 0.4, text: 'Les ventilateurs ne repartent qu’après, pour éviter le regel.' },
              { at: CUES.Chronologie + 3.4, until: CUES.CycleComplet, text: 'Fin sur sonde, égouttage, reprise différée : la séquence complète.' },
              { at: CUES.CycleComplet + 0.5, text: 'La séquence entière, d’un seul regard : froid, dégivrage, reprise.' },
              { at: CUES.CycleComplet + 4.0, text: 'Le froid s’installe, le givre aussi — puis l’horloge prend la main.' },
              { at: CUES.CycleComplet + 8.5, text: 'Tirage au vide, résistances, fin sur sonde : suivez le curseur orange.' },
              { at: CUES.CycleComplet + 12.5, until: CUES.LaCle, text: 'Égouttage, reprise du froid, et les ventilateurs en dernier.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesPumpDownDegivrage() {
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

  window.RegulesPumpDownDegivrage = RegulesPumpDownDegivrage;
})();
