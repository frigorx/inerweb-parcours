/* Les régules · Station 5 — Le pump-down unique (tirage au vide unique amélioré)
   Refait le 03/10/2026 sur la source : annexe 3 de l'épreuve EP2 CAP VAF 2016
   (« schéma électrique de commande après modification »), simplifiée aux organes
   de la régulation (ATU, F1, H1 et les ventilateurs ne sont pas repris) :
     KA1 = HP · BP sécurité (NO 1-4) · (S1 // KA1 13-14)       sécurité, réarmement manuel
     Y1 et KA2 = B1 · KA1 23-24                                demande de froid
     KM1 = (KM1 33-34 // KA2 13-14) · (BP régulation // KA2 23-24 · KM1 43-44)
     H6 = BP sécurité (NF 1-2)                                 voyant défaut
   En marche, KA2 et KM1 shuntent la BP de régulation ; en cas de fuite, la BP de
   sécurité fait retomber KA1 : arrêt définitif, H6 allumé, seul S1 relance. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var Croix = RK.Croix, CroixLabels = RK.CroixLabels, ChambreFond = RK.ChambreFond;
  var Pipes = RK.Pipes, Chambre = RK.Chambre, Machine = RK.Machine, PipeChips = RK.PipeChips;
  var Manometre = RK.Manometre;
  var D = 5240;   /* bord droit du canvas : l'armoire a quatre colonnes */

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
  function dans(T, ivs) {
    for (var i = 0; i < ivs.length; i++) if (T >= ivs[i][0] && T < ivs[i][1]) return true;
    return false;
  }
  function rampe(T, ivs, up, down) {
    var m = 0;
    for (var i = 0; i < ivs.length; i++) {
      var a = ivs[i][0], b = ivs[i][1], v = 0;
      if (T >= a && T < b) v = clamp((T - a) / up, 0, 1);
      else if (T >= b) v = clamp(1 - (T - b) / down, 0, 1);
      m = Math.max(m, v);
    }
    return m;
  }
  function cumul(T, ivs) {
    var s = 0;
    for (var i = 0; i < ivs.length; i++) s += Math.max(0, clamp(T, ivs[i][0], ivs[i][1]) - ivs[i][0]);
    return s;
  }

  /* Les états de l'installation à l'instant T du film. Exposé (RK5.etat)
     pour les planches pas à pas : une seule logique. */
  function etat(T, CUES, total) {
    var M = CUES.MiseEnService, Co = CUES.Consigne, F = CUES.Fuite;
    var tS1 = M + 0.8, tS1r = M + 1.6, tKA1c = tS1 + 0.3;
    var tB1c = M + 2.4, tKA2c = tB1c + 0.3, tBPc = M + 4.0, tKMc = tBPc + 0.3;
    var tB1o = Co + 1.4, tKA2o = tB1o + 0.2, tKMo = Co + 5.6, tKMco = tKMo + 0.2;
    var tB1c2 = F + 0.8, tKA2c2 = tB1c2 + 0.3, tBPc2 = F + 2.4, tKMc2 = tBPc2 + 0.3;
    var tBPo2 = F + 4.4, tTrip = F + 5.6, tKA1o = tTrip + 0.2, tKA2o2 = tKA1o + 0.2, tKMco2 = tKA2o2 + 0.2;

    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var kRejeu = (tKMo + 2 - (tS1 - 0.8)) / 16;
    var Tm = enRejeu ? (tS1 - 0.8) + (T - CUES.CycleComplet) * kRejeu : T;

    var s1 = dans(Tm, [[tS1, tS1r]]);
    var trip = Tm >= tTrip;
    var ka1 = dans(Tm, [[tS1, tTrip]]);
    var ka1c = dans(Tm, [[tKA1c, tKA1o]]);
    var b1 = dans(Tm, [[tB1c, tB1o], [tB1c2, 1e9]]);
    var ka2 = b1 && ka1c;
    var ka2c = dans(Tm, [[tKA2c, tKA2o], [tKA2c2, tKA2o2]]);
    var bpr = dans(Tm, [[tBPc, tKMo], [tBPc2, tBPo2]]);
    var kmc = dans(Tm, [[tKMc, tKMco], [tKMc2, tKMco2]]);
    var km = (kmc || ka2c) && (bpr || (ka2c && kmc));
    var kmIvs = [[tBPc, tKMo], [tBPc2, tKA2o2]];

    var flow = rampe(Tm, kmIvs, 0.9, 0.7);
    var phase = cumul(Tm, kmIvs);
    var temp = pw(Tm, [[0, -15.4], [tB1c, -14.0], [tB1o, -18.0], [tB1c2, -14.0], [tTrip, -13.6], [total, -12.8]]);
    var bp = pw(Tm, [[0, 1.55], [tKA2c, 1.58], [tBPc, 1.8], [tBPc + 0.8, 2.6], [tBPc + 2.2, 2.35], [tB1o, 2.25],
                    [tB1o + 1.6, 1.0], [tKMo, 0.30], [tB1c2, 0.45], [tKA2c2, 0.5], [tBPc2, 1.8], [tBPc2 + 0.5, 1.95],
                    [tBPo2, 0.30], [tTrip, 0.02], [tKA2o2, 0.0], [total, 0.0]]);
    var charge = Tm < tKA2c ? 0
      : Tm < tB1o ? clamp((Tm - tKA2c) / 1.2, 0, 1) * 0.34
      : Tm < tKMo ? 0.34 * clamp(1 - (Tm - tB1o) / (tKMo - tB1o), 0, 1)
      : Tm < tKA2c2 ? 0
      : Tm < tBPo2 ? clamp((Tm - tKA2c2) / 1.2, 0, 1) * 0.12
      : 0.12 * clamp(1 - (Tm - tBPo2) / (tKA2o2 - tBPo2), 0, 1);
    var frostU = clamp((clamp(Tm, tKA2c, tB1o) - tKA2c) / (tB1o - tKA2c), 0, 1);
    var arm = Tm < tB1c ? -30
      : Tm < tB1o ? -30 + 30 * clamp(MOTION.pop(tB1c)(Tm), 0, 1.08)
      : Tm < tB1c2 ? -30 * clamp((Tm - tB1o) / 0.18, 0, 1)
      : -30 + 30 * clamp(MOTION.pop(tB1c2)(Tm), 0, 1.08);
    return { Tm: Tm, enRejeu: enRejeu, s1: s1, trip: trip, ka1: ka1, ka1c: ka1c, b1: b1, ka2: ka2, ka2c: ka2c,
             bpr: bpr, kmc: kmc, km: km, flow: flow, phase: phase, temp: temp, bp: bp, charge: charge,
             frostU: frostU, arm: arm, y1Live: ka2 };
  }

  function Cabinet(p) {
    var RK2 = window.RK;
    var e = p.e, t = p.T;
    var b1 = clamp(-e.arm / 30, 0, 1) < 0.5;
    /* colonne KA1 : L, HP, BP sécurité, puis S1 // KA1 13-14 */
    var n1 = e.ka1 ? 'courant' : (!e.trip ? 'phase' : ((e.s1 || e.ka1c) ? 'retour' : 'off'));
    var k1 = {
      amont: e.ka1 ? 'courant' : 'phase',
      noeud: n1,
      versS1: e.ka1 ? (e.s1 ? 'courant' : 'phase') : n1,
      versAux: e.ka1 ? (e.ka1c ? 'courant' : 'phase') : n1,
      sousS1: e.ka1 ? (e.s1 ? 'courant' : 'phase') : 'retour',
      sousAux: e.ka1 ? (e.ka1c ? 'courant' : 'phase') : 'retour',
      bas: e.ka1 ? 'courant' : 'retour'
    };
    /* colonne B1 : B1, KA1 23-24, puis Y1 et KA2 */
    var d2 = e.ka2 ? 'courant' : (b1 ? 'phase' : (e.ka1c ? 'retour' : 'off'));
    var dBas = e.ka2 ? 'courant' : 'retour';
    /* colonne KM1 */
    var km = e.km;
    var j1 = km ? 'courant' : ((e.kmc || e.ka2c) ? 'phase' : (e.bpr ? 'retour' : 'off'));
    var r = km ? ((e.ka2c && e.kmc) ? 'courant' : 'phase') : (e.ka2c ? j1 : (e.kmc ? 'retour' : 'off'));
    var m4 = {
      hautKM: km ? (e.kmc ? 'courant' : 'phase') : 'phase',
      hautKA2: km ? (e.ka2c ? 'courant' : 'phase') : 'phase',
      j1: j1,
      versBP: km ? (e.bpr ? 'courant' : 'phase') : j1,
      versDroite: km ? ((e.ka2c && e.kmc) ? 'courant' : 'phase') : j1,
      r: r,
      sousBP: km ? (e.bpr ? 'courant' : 'phase') : 'retour',
      sousDroite: km ? ((e.ka2c && e.kmc) ? 'courant' : 'phase') : 'retour',
      bas: km ? 'courant' : 'retour'
    };
    var fils = [
      /* H6 */
      ['M 400 300 L 400 560', e.trip ? 'courant' : 'phase'], ['M 400 710 L 400 1040', e.trip ? 'courant' : 'retour'],
      ['M 400 1100 L 400 1300', e.trip ? 'courant' : 'retour'],
      /* KA1 */
      ['M 850 300 L 850 340', k1.amont], ['M 850 490 L 850 520', k1.amont], ['M 850 670 L 850 705', k1.noeud],
      ['M 850 705 L 850 740', k1.versS1], ['M 850 705 L 1100 705 L 1100 740', k1.versAux],
      ['M 850 890 L 850 925', k1.sousS1], ['M 1100 890 L 1100 925 L 850 925', k1.sousAux],
      ['M 850 925 L 850 1041', k1.bas], ['M 850 1099 L 850 1300', k1.bas],
      /* B1 → Y1 et KA2 */
      ['M 1500 300 L 1500 340', e.ka2 ? 'courant' : 'phase'], ['M 1500 490 L 1500 560', d2],
      ['M 1500 710 L 1500 760', dBas], ['M 1500 760 L 1500 1041', dBas], ['M 1500 760 L 1840 760 L 1840 1041', dBas],
      ['M 1500 1099 L 1500 1300', dBas], ['M 1840 1099 L 1840 1300', dBas],
      /* KM1 */
      ['M 2300 300 L 2300 340', m4.hautKM], ['M 2540 300 L 2540 340', m4.hautKA2],
      ['M 2300 490 L 2300 520 L 2540 520 L 2540 490', m4.j1],
      ['M 2300 520 L 2300 560', m4.versBP], ['M 2540 520 L 2540 560', m4.versDroite],
      ['M 2540 710 L 2540 750', m4.r],
      ['M 2300 710 L 2300 935', m4.sousBP], ['M 2540 900 L 2540 935 L 2300 935', m4.sousDroite],
      ['M 2300 935 L 2300 1041', m4.bas], ['M 2300 1099 L 2300 1300', m4.bas]
    ];
    return (
      <g transform="translate(2520,100)">
        <rect x="0" y="0" width="2720" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="40" y="66" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">ARMOIRE · PUMP-DOWN UNIQUE AMÉLIORÉ</text>
        <text x="2680" y="66" textAnchor="end" fill={C.blue} fontSize="26" fontWeight="900" letterSpacing="2">D’APRÈS L’ANNEXE 3 · EP2 CAP 2016</text>

        <line x1="170" y1="104" x2="170" y2="150" stroke={C.wire} strokeWidth="9" />
        <RK2.PorteFusible x={170} y={150} />
        <line x1="170" y1="246" x2="170" y2="300" stroke={C.wire} strokeWidth="9" />
        <line x1="170" y1="300" x2="2640" y2="300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="1300" x2="2640" y2="1300" stroke={C.blue} strokeWidth="12" strokeLinecap="round" />
        <text x="132" y="312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">L</text>
        <text x="132" y="1312" textAnchor="end" fill={C.blue} fontSize="34" fontWeight="900">N</text>

        <g stroke={C.wire} strokeWidth="9" fill="none" strokeLinecap="round">
          {fils.map(function (f, i) { return <path key={i} d={f[0]} />; })}
        </g>
        {fils.map(function (f, i) { return <RK2.Potentiel key={i} d={f[0]} mode={f[1]} t={t} />; })}

        {/* le voyant de défaut, sur le contact NF de la BP de sécurité */}
        <RK2.ContactV nf={true} x={400} y={560} ouv={e.trip ? 0 : 1} live={e.trip} glyph="p" code="BPs" sub="sécurité · NF" b1="1" b2="2" />
        <RK2.VoyantV x={400} y={1070} code="H6" sub="DÉFAUT BP" live={e.trip} />

        {/* la sécurité : KA1 ne colle qu'avec S1, puis se tient */}
        <RK2.ContactV nf={true} x={850} y={340} ouv={0} live={e.ka1} glyph="p" code="HP" sub="sécurité · NF" b1="1" b2="2" />
        <RK2.ContactV x={850} y={520} ouv={e.trip ? 1 : 0} live={e.ka1} glyph="p" code="BPs" sub="sécurité · NO" b1="1" b2="4" />
        <RK2.ContactV poussoir={true} x={850} y={740} ouv={e.s1 ? 0 : 1} live={e.ka1 && e.s1} code="S1" sub="marche" b1="3" b2="4" />
        <RK2.ContactV aux={true} x={1100} y={740} ouv={e.ka1c ? 0 : 1} live={e.ka1 && e.ka1c} code="KA1" sub="auto-maintien" />
        <RK2.BobineV x={850} y={1070} code="KA1" sub="SÉCURITÉ" live={e.ka1} />

        {/* la demande : B1, à travers KA1, commande Y1 et KA2 */}
        <RK2.ContactV x={1500} y={340} ouv={clamp(-e.arm / 30, 0, 1)} live={e.ka2} glyph="θ" code="B1" sub="thermostat" />
        <RK2.ContactV aux={true} x={1500} y={560} ouv={e.ka1c ? 0 : 1} live={e.ka2} code="KA1" sub="autorisation" b1="23" b2="24" />
        <RK2.BobineV x={1500} y={1070} code="Y1" sub="ÉLECTROVANNE" live={e.ka2} />
        <RK2.BobineV x={1840} y={1070} code="KA2" sub="RELAIS DE TIRAGE" live={e.ka2} />

        {/* le compresseur : KA2 et KM1 shuntent la BP de régulation */}
        <RK2.ContactV aux={true} x={2300} y={340} ouv={e.kmc ? 0 : 1} live={km && e.kmc} code="KM1" sub="maintien" b1="33" b2="34" />
        <RK2.ContactV aux={true} x={2540} y={340} ouv={e.ka2c ? 0 : 1} live={km && e.ka2c} code="KA2" sub="demande" />
        <RK2.ContactV x={2300} y={560} ouv={e.bpr ? 0 : 1} live={km && e.bpr} glyph="p" code="BPr" sub="régulation" b1="1" b2="4" />
        <RK2.ContactV aux={true} x={2540} y={560} ouv={e.ka2c ? 0 : 1} live={km && e.ka2c && e.kmc} code="KA2" sub="shunt" b1="23" b2="24" />
        <RK2.ContactV aux={true} x={2540} y={750} ouv={e.kmc ? 0 : 1} live={km && e.ka2c && e.kmc} code="KM1" sub="shunt" b1="43" b2="44" />
        <RK2.BobineV x={2300} y={1070} code="KM1" sub="COMPRESSEUR" live={km} />

        <g opacity={p.alerte}>
          <rect x="1640" y="1350" width="1020" height="62" rx="10" fill="#fdecea" stroke={C.red} strokeWidth="4" />
          <text x="2150" y="1392" textAnchor="middle" fill={C.red} fontSize="30" fontWeight="900">ARRÊT DÉFINITIF · RÉARMEMENT PAR S1</text>
        </g>
      </g>
    );
  }

  var CH = { x0: 700, x1: 2420, tempTop: 1990, tempBot: 2180, tFin: 40 };
  function chx(f) { return CH.x0 + (CH.x1 - CH.x0) * f; }
  function chTemp(v) { return CH.tempTop + ((-13 - v) / 6) * (CH.tempBot - CH.tempTop); }
  function chBp(v) { return 2500 - clamp(v / 3, 0, 1) * 150; }

  function Chrono(p) {
    var r = MOTION.draw(p.CUES.Chronologie + 0.25, 4.6)(p.T);
    var temp = '', bp = '', ka2 = '', km = '', ka1 = '', prec = {};
    function marche(nom, on, x, hi, lo) {
      var y = on ? hi : lo;
      if (prec[nom] === undefined) return 'M ' + x + ' ' + y;
      var s = prec[nom] !== y ? ' L ' + x + ' ' + prec[nom] + ' L ' + x + ' ' + y : '';
      return s;
    }
    var tTrip = null;
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var e = etat(t, p.CUES, p.total), x = chx(t / CH.tFin).toFixed(1);
      temp += (temp ? ' L ' : 'M ') + x + ' ' + chTemp(e.temp).toFixed(1);
      bp += (bp ? ' L ' : 'M ') + x + ' ' + chBp(e.bp).toFixed(1);
      ka2 += marche('ka2', e.ka2, x, 2250, 2330); prec.ka2 = e.ka2 ? 2250 : 2330;
      km += marche('km', e.km, x, 2544, 2624); prec.km = e.km ? 2544 : 2624;
      ka1 += marche('ka1', e.ka1, x, 2658, 2738); prec.ka1 = e.ka1 ? 2658 : 2738;
      if (e.trip && tTrip === null) tTrip = t;
    }
    var xf = chx(1);
    ka2 += ' L ' + xf + ' ' + prec.ka2; km += ' L ' + xf + ' ' + prec.km; ka1 += ' L ' + xf + ' ' + prec.ka1;
    var note = clamp((p.T - p.CUES.Chronologie - 3.6) / 0.6, 0, 1);
    var fuite = chx((p.CUES.Fuite) / CH.tFin);
    return (
      <g transform="translate(200,-300)">
        <rect x="70" y="1860" width="2470" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="118" y="1936" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · UN TIRAGE AU VIDE, PUIS LA FUITE</text>
        {[['AIR DE LA', 2060], ['CHAMBRE', 2106], ['B1 · Y1 · KA2', 2296], ['PRESSION BP', 2440], ['KM1', 2590], ['KA1', 2704]].map(function (l) {
          return <text key={l[1]} x="118" y={l[1]} fill={C.blue} fontSize="38" fontWeight="800">{l[0]}</text>;
        })}
        <rect x={fuite} y="2230" width={chx(1) - fuite} height="520" fill={C.red} opacity="0.06" />
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
              <text x={CH.x0 - 14} y={chBp(l[0]) + 9} textAnchor="end" fill={l[2]} fontSize="26" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip5b">
          <rect x={CH.x0 - 40} y="1960" width={(chx(r) - CH.x0) + 40} height="820" />
        </clipPath>
        <g clipPath="url(#chclip5b)">
          <path d={temp} fill="none" stroke={C.blue} strokeWidth="10" strokeLinejoin="round" />
          <path d={ka2} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          <path d={bp} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          <path d={km} fill="none" stroke={C.orangeText} strokeWidth="10" strokeLinejoin="round" />
          <path d={ka1} fill="none" stroke={C.green} strokeWidth="10" strokeLinejoin="round" />
          {tTrip !== null && <text x={chx(tTrip / CH.tFin) + 16} y="2700" fill={C.red} fontSize="30" fontWeight="900">H6</text>}
        </g>
        {r > 0.02 && r < 0.995 && (
          <line x1={chx(r)} y1="1960" x2={chx(r)} y2="2760" stroke={C.orange} strokeWidth="6" opacity="0.85" />
        )}
        {p.replayF > 0 && (
          <g>
            <line x1={chx(p.replayF)} y1="1960" x2={chx(p.replayF)} y2="2760" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replayF)} cy="1960" r="16" fill={C.orange} />
          </g>
        )}
        <g opacity={note}>
          <text x={chx(0.42)} y="2795" textAnchor="middle" fill={C.blue} fontSize="34" fontWeight="900">UN SEUL TIRAGE AU VIDE PAR ARRÊT</text>
          <text x={chx(0.89)} y="2795" textAnchor="middle" fill={C.red} fontSize="34" fontWeight="900">FUITE · ARRÊT DÉFINITIF</text>
        </g>
      </g>
    );
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal);
    var replayF = e.enRejeu ? e.Tm / CH.tFin : 0;
    var energy = e.km ? 1 : 0;
    var cam = RK.camFixed(T, D);
    /* le surligneur reprend les zones du kit, recalées sur les scènes de ce film */
    var temps = [0, CUES.MiseEnService, CUES.Circulation, CUES.Consigne, CUES.Fuite, CUES.Chronologie, CUES.CycleComplet, CUES.LaCle];
    var V = RK.camPaliers(D).map(function (z, i) { return { t: temps[i], v: z.v }; });
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var F = CUES.Fuite;
    var shunt = clamp((T - F - 4.4) / 0.5, 0, 1) * clamp(1 - (T - F - 5.5) / 0.4, 0, 1);
    var alerte = clamp((T - F - 5.8) / 0.6, 0, 1) * clamp(1 - (T - CUES.Chronologie + 0.4) / 0.6, 0, 1);

    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Croix T={T} />
            <ChambreFond />
            <Pipes phase={e.phase} flow={e.flow} />
            <Chambre T={T} temp={e.temp} spin={e.phase * 300} flow={e.flow} phase={e.phase} energy={energy}
                     frostU={e.frostU} liquid={e.charge} cid="s5" />
            <Machine T={T} carter={0} spin={e.phase * 300} flow={e.flow} phase={e.phase} live={e.y1Live} />
            <PipeChips T={T} />
            <CroixLabels T={T} />
            <g opacity={clamp((T - 14.6) / 0.8, 0, 1)}>
              <Manometre x={2320} y={680} val={e.bp} cutOut={0.3} cutIn={1.8} label="BP · ASPIRATION" />
              <rect x="2180" y="860" width="280" height="80" rx="10" fill={e.ka1 ? '#e4f2ec' : '#fdecea'}
                    stroke={e.ka1 ? C.green : C.red} strokeWidth="6" />
              <text x="2320" y="914" textAnchor="middle" fill={e.ka1 ? C.green : C.red} fontSize="32" fontWeight="900">
                {e.ka1 ? 'KA1 ARMÉ' : 'KA1 AU REPOS'}
              </text>
              <rect x="2180" y="960" width="280" height="80" rx="10" fill={e.km ? '#fff0e9' : C.blueSoft}
                    stroke={e.km ? C.orangeText : C.blue} strokeWidth="6" />
              <text x="2320" y="1014" textAnchor="middle" fill={e.km ? C.orangeText : C.blue} fontSize="32" fontWeight="900">
                {e.km ? 'KM1 ALIMENTÉ' : 'KM1 AU REPOS'}
              </text>
            </g>
            <Cabinet T={T} e={e} alerte={alerte} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replayF={replayF} />
            <RK.Spot T={T} V={V} cam={cam} />
          </g>
        </svg>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '17%', opacity: shunt * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid ' + C.orangeText, borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: C.orangeText, font: '900 32px ' + font, letterSpacing: 2 }}>BP DE RÉGULATION SHUNTÉE</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>KA2 et KM1 la court-circuitent : le compresseur continue</div>
        </div>

        <div style={{
          position: 'absolute', left: '3%', width: '29%', bottom: '17%', opacity: alerte * (1 - keyIn),
          background: 'rgba(255,253,248,0.96)', border: '4px solid ' + C.red, borderRadius: 14,
          padding: '16px 26px', textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ color: C.red, font: '900 32px ' + font, letterSpacing: 2 }}>ARRÊT DÉFINITIF · H6 ALLUMÉ</div>
          <div style={{ color: C.mute, font: '700 26px ' + font, marginTop: 6 }}>seul S1 relancera, après la recherche de fuite</div>
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
              La BP de régulation fait le tirage au vide ; la BP de sécurité arrête tout et le signale.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Une fuite ne devient pas une suite de courts cycles : KA1 retombe, H6 s’allume, seul S1 relance — après réparation.
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
              { at: 0.4, text: 'Une chambre froide NÉGATIVE : l’air y est maintenu sous zéro degré — ici, consigne −18 °C.' },
              { at: 3.2, text: 'Quatre colonnes : la sécurité KA1, la demande B1 (Y1 et KA2), le compresseur KM1, le voyant H6.' },
              { at: CUES.MiseEnService + 0.4, text: 'On appuie sur S1 : KA1 colle et se tient par son contact 13-14.' },
              { at: CUES.MiseEnService + 2.0, text: 'B1 ferme : à travers KA1, il alimente Y1 et le relais de tirage KA2.' },
              { at: CUES.MiseEnService + 3.6, text: 'La BP monte : à 1,8 bar, la BP de régulation ferme et KM1 colle.' },
              { at: CUES.MiseEnService + 5.2, text: 'KA2 et KM1 collés court-circuitent la BP de régulation.' },
              { at: CUES.Circulation + 0.5, text: 'La croix du frigoriste : BP en bas, HP en haut.' },
              { at: CUES.Circulation + 2.6, text: 'Bielle et piston : le compresseur aspire en BP et refoule en HP.' },
              { at: CUES.Circulation + 5.2, text: 'Les deux pressostats BP sont piqués sur l’aspiration.' },
              { at: CUES.Circulation + 7.4, text: 'Le détendeur thermostatique fait tomber la pression.' },
              { at: CUES.Circulation + 9.0, text: 'Dans le serpentin, le liquide s’évapore : le givre se dépose.' },
              { at: CUES.Consigne + 0.4, text: 'L’air atteint la consigne : B1 ouvre, Y1 et KA2 retombent.' },
              { at: CUES.Consigne + 2.0, text: 'KM1 se tient par 33-34 et la BP de régulation, de nouveau en service.' },
              { at: CUES.Consigne + 3.8, text: 'Tirage au vide : le compresseur vide l’évaporateur, la pression chute.' },
              { at: CUES.Consigne + 5.8, text: 'À 0,3 bar, la BP de régulation ouvre : KM1 tombe. Un seul tirage au vide.' },
              { at: CUES.Fuite + 0.4, text: 'Plus tard, une fuite : B1 redemande le froid, Y1 et KA2 recollent.' },
              { at: CUES.Fuite + 2.4, text: 'KM1 colle… mais le fluide manque : la pression ne tient pas.' },
              { at: CUES.Fuite + 4.4, text: 'Sous 0,3 bar, la BP de régulation ouvre — elle est shuntée : KM1 continue.' },
              { at: CUES.Fuite + 5.6, text: 'La pression atteint le seuil de sécurité : la BP de sécurité coupe KA1 et allume H6.' },
              { at: CUES.Fuite + 7.0, text: 'KA1 retombe : Y1, KA2 puis KM1 s’arrêtent. C’est un arrêt définitif.' },
              { at: CUES.Chronologie + 0.4, text: 'Le chronogramme : un tirage au vide normal, puis la fuite.' },
              { at: CUES.Chronologie + 3.4, until: CUES.CycleComplet, text: 'Après la fuite, KA1 reste au repos : seul S1 relancera, après réparation.' },
              { at: CUES.CycleComplet + 0.5, text: 'Le cycle normal, d’un seul regard : S1, B1, puis la BP de régulation.' },
              { at: CUES.CycleComplet + 4.5, text: 'B1 commande Y1 et KA2 ; KA2 et KM1 shuntent la BP de régulation.' },
              { at: CUES.CycleComplet + 9.0, text: 'À la consigne, KA2 retombe : la BP de régulation reprend la main pour le tirage.' },
              { at: CUES.CycleComplet + 13.0, until: CUES.LaCle, text: 'À 0,3 bar, KM1 tombe : un seul tirage au vide par arrêt.' }
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
  window.RK5 = { Cabinet: Cabinet, etat: etat };
})();
