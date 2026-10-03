/* Les régules · Station 10 — Le dégivrage par inversion de cycle (03/10/2026)
   Sources : « Les dégivrages » (Bac Pro MFER, S2), pages 3-4 : schéma fluidique d'une
   installation de réfrigération conventionnelle avec vanne 4 voies (un détendeur et
   son clapet de part et d'autre de la ligne liquide), vanne 4 voies non alimentée
   (refoulement vers le condenseur) et alimentée (refoulement vers l'évaporateur) ;
   chronologie de retour au froid (égouttage, statique sans ventilation, ventilation).
   La vanne en coupe reprend le dessin de la station CartoClim 2.6 (déjà en ligne),
   lui-même tiré de V4V.docx (CAP IFCA, collègues) : tiroir, pistons, vanne pilote.
   PAS D'ARMOIRE : aucune source ne donne le schéma électrique d'une chambre froide à
   dégivrage par inversion ; il n'est pas inventé. Les états suivent le scénario
   (bobine, compresseur, ventilateurs), sans solveur. Exposé en RK10. */
(function () {
  var useComposition = window.useComposition;
  var CompositionStage = window.CompositionStage;
  var Captions = window.Captions;
  var clamp = window.clamp;
  var RK = window.RK;
  var C = RK.C, MOTION = RK.MOTION;
  var D = 5940;
  var HP = '#c0392b', BP = '#3d7fca', LIQ = C.orangeText;
  function teinte(p) { return p === 'HP' ? '#efd2c9' : p === 'BP' ? '#c8def5' : C.paper; }
  function couleur(p) { return p === 'HP' ? HP : p === 'BP' ? BP : p === 'LIQ' ? LIQ : '#9aa6b2'; }

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
  function dans(T, ivs) { for (var i = 0; i < ivs.length; i++) if (T >= ivs[i][0] && T < ivs[i][1]) return true; return false; }

  /* ---- le scénario ---- */
  function evenements(CUES) {
    var I = CUES.Inversion, F = CUES.Fonte, R = CUES.Retour;
    var e = { tVentOff: I + 0.5, tB: I + 3.5, tZero: I + 7, tFonte: F + 3.5, tFin: F + 6.5 };
    e.tRetour = e.tFin + 0.8;          /* le tiroir est revenu (le compresseur tourne encore) */
    e.tStop = e.tFin + 1.6;            /* arrêt pour l'égouttage */
    e.tRe = R + 3.5;                   /* reprise du froid, sans ventilation */
    e.tVent = R + 8;                   /* les ventilateurs, en dernier */
    return e;
  }
  function etat(T, CUES, total) {
    var e = evenements(CUES);
    var enRejeu = CUES.CycleComplet !== undefined && T >= CUES.CycleComplet && T < CUES.LaCle;
    var t0 = CUES.Froid, t1 = e.tVent + 2;
    var Tm = enRejeu ? t0 + (T - CUES.CycleComplet) * (t1 - t0) / (CUES.LaCle - CUES.CycleComplet) : T;
    var bobine = Tm >= e.tB && Tm < e.tFin;
    var s = Tm < e.tB + 0.3 ? 1 : Tm < e.tB + 1.1 ? 1 - (Tm - e.tB - 0.3) / 0.8 : Tm < e.tFin + 0.2 ? 0 : Tm < e.tRetour ? (Tm - e.tFin - 0.2) / 0.6 : 1;
    s = clamp(s, 0, 1);
    var mode = s > 0.95 ? 'froid' : s < 0.05 ? 'inverse' : 'transit';
    var comp = !dans(Tm, [[e.tStop, e.tRe]]);
    var vent = Tm < e.tVentOff || Tm >= e.tVent;
    var phase = -1;
    if (Tm >= CUES.Froid) phase = 0;
    if (Tm >= e.tVentOff) phase = 1;
    if (Tm >= e.tZero) phase = 2;
    if (Tm >= e.tFin) phase = 3;
    if (Tm >= e.tRe) phase = 4;
    if (Tm >= e.tVent) phase = 5;
    return {
      Tm: Tm, enRejeu: enRejeu, ev: e, bobine: bobine, s: s, mode: mode, comp: comp, vent: vent, phase: phase,
      pilote: bobine ? 'B' : 'A',
      bouts: Tm < e.tB + 0.3 ? ['HP', 'BP'] : Tm < e.tFin ? ['BP', 'HP'] : Tm < e.tFin + 0.2 ? ['HP', 'BP'] : ['HP', 'BP'],
      air: pw(Tm, [[0, -17.6], [CUES.Froid, -17.8], [e.tB, -18.2], [e.tFin, -16.2], [e.tRe, -15.8], [e.tVent, -16.4], [total, -18]]),
      bat: pw(Tm, [[0, -25], [e.tB, -26], [e.tB + 1.2, -25], [e.tZero, 0], [e.tFonte, 0.6], [e.tFin, 10], [e.tStop, 9], [e.tRe, 6],
                   [e.tRe + 2.5, -12], [e.tVent, -22], [total, -25]]),
      givre: pw(Tm, [[0, 0.75], [e.tB, 1], [e.tZero, 1], [e.tFonte, 0], [total, 0]]),
      gouttes: Tm < e.tZero ? 0 : Tm < e.tRe ? 1 : clamp(1 - (Tm - e.tRe) / 2, 0, 1)
    };
  }

  /* ---- le circuit : d'après le schéma fluidique de « Les dégivrages », page 4 ---- */
  var P = {
    refoul: 'M 1310 930 L 1310 330', aspi: 'M 1370 330 L 1370 930',
    gazCh: 'M 1250 250 L 530 250 L 530 470', gazCo: 'M 1430 250 L 1670 250 L 1670 470',
    liqCh: 'M 530 710 L 530 1360 L 700 1360', liqMid: 'M 820 1360 L 1500 1360', liqCo: 'M 1620 1360 L 1670 1360 L 1670 710'
  };
  function roles(mode) {
    if (mode === 'froid') return { gazCh: 'BP', gazCo: 'HP', liqCh: 'BP', liqMid: 'LIQ', liqCo: 'LIQ' };
    if (mode === 'inverse') return { gazCh: 'HP', gazCo: 'BP', liqCh: 'LIQ', liqMid: 'LIQ', liqCo: 'BP' };
    return { gazCh: null, gazCo: null, liqCh: null, liqMid: null, liqCo: null };
  }
  /* sens du fluide sur chaque tube (+1 : dans le sens du tracé) */
  function sens(mode) {
    return mode === 'inverse' ? { gazCh: 1, gazCo: -1, liqCh: 1, liqMid: 1, liqCo: 1 } : { gazCh: -1, gazCo: 1, liqCh: -1, liqMid: -1, liqCo: -1 };
  }
  function Detendeur(p) {
    var x = p.x, y = 1360, actif = p.actif, o = p.ouvert;
    return (
      <g>
        <path d={'M ' + (x - 60) + ' ' + y + ' L ' + (x - 60) + ' ' + (y + 90) + ' L ' + (x + 60) + ' ' + (y + 90) + ' L ' + (x + 60) + ' ' + y}
              fill="none" stroke={o ? LIQ : '#9aa6b2'} strokeWidth="12" strokeLinejoin="round" />
        <g transform={'translate(' + x + ',' + (y + 90) + ')'}>
          <polygon points={p.clapetVers > 0 ? '-16,-18 -16,18 16,0' : '16,-18 16,18 -16,0'} fill={o ? '#fff0e9' : C.card} stroke={C.blue} strokeWidth="5" />
          <line x1={p.clapetVers > 0 ? 20 : -20} y1="-20" x2={p.clapetVers > 0 ? 20 : -20} y2="20" stroke={C.blue} strokeWidth="6" />
        </g>
        <polygon points={(x - 40) + ',' + (y - 30) + ' ' + (x - 40) + ',' + (y + 30) + ' ' + x + ',' + y} fill={actif ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
        <polygon points={(x + 40) + ',' + (y - 30) + ' ' + (x + 40) + ',' + (y + 30) + ' ' + x + ',' + y} fill={actif ? '#fff0e9' : C.card} stroke={C.orangeText} strokeWidth="6" />
        <line x1={x} y1={y - 30} x2={x} y2={y - 70} stroke={C.orangeText} strokeWidth="5" />
        <circle cx={x} cy={y - 92} r="22" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x={x} y={y - 83} textAnchor="middle" fill={C.blue} fontSize="22" fontWeight="900">TC</text>
        <text x={x} y={y - 128} textAnchor="middle" fill={actif ? C.orangeText : C.mute} fontSize="26" fontWeight="900">{p.nom}</text>
        <text x={x} y={y + 150} textAnchor="middle" fill={o ? C.orangeText : C.mute} fontSize="24" fontWeight="800">{o ? 'CLAPET OUVERT' : 'clapet fermé'}</text>
      </g>
    );
  }
  function Circuit(p) {
    var e = p.e, T = p.T, r = roles(e.mode), sg = sens(e.mode), roule = e.comp ? 1 : 0;
    var inv = e.mode === 'inverse';
    function tube(k, nom) {
      var pr = nom === 'refoul' ? 'HP' : nom === 'aspi' ? 'BP' : r[nom];
      var sd = nom === 'refoul' ? -1 : nom === 'aspi' ? 1 : sg[nom];
      return (
        <g key={nom}>
          <path d={P[nom]} fill="none" stroke={C.pipe} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          <path d={P[nom]} fill="none" stroke={couleur(pr)} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="34 30" strokeDashoffset={-sd * T * 200 * roule} opacity={pr ? 0.25 + 0.75 * roule : 0.35} />
        </g>
      );
    }
    var bat = e.bat, chaudCh = inv ? 1 : 0;
    return (
      <g>
        <rect x="340" y="320" width="840" height="880" rx="18" fill="#eaf3f9" stroke={C.blue} strokeWidth="5" strokeDasharray="26 18" />
        <text x="580" y="372" fill={C.blue} fontSize="32" fontWeight="800" letterSpacing="3">CHAMBRE NÉGATIVE</text>
        <text x="2420" y="372" textAnchor="end" fill={C.mute} fontSize="30" fontWeight="800" letterSpacing="3">EXTÉRIEUR</text>
        {['refoul', 'aspi', 'gazCh', 'gazCo', 'liqCh', 'liqMid', 'liqCo'].map(function (n, i) { return tube(i, n); })}
        <RK.Coil cid={p.cid + 'c'} x0={560} y0={470} w={480} h={240} n={4} col={inv ? HP : BP} dir={inv ? 1 : -1}
                 phase={T * roule} flow={roule} frost={e.givre} warm={inv} liquid={0} />
        <RK.Coil cid={p.cid + 'k'} x0={1700} y0={470} w={480} h={240} n={4} col={inv ? BP : HP} dir={inv ? -1 : 1}
                 phase={T * roule} flow={roule} frost={0} warm={!inv} liquid={0} />
        {chaudCh > 0 && <rect x="532" y="432" width="590" height="318" rx="14" fill={HP} opacity={0.1} />}
        <RK.Fan x={800} y={880} r={52} spin={e.vent ? T * 300 : 0} flow={e.vent ? 1 : 0} />
        <text x="800" y="972" textAnchor="middle" fill={e.vent ? C.orangeText : C.mute} fontSize="26" fontWeight="900">{e.vent ? 'VENTILATEURS' : 'VENTILATEURS ARRÊTÉS'}</text>
        <RK.Fan x={1940} y={880} r={52} spin={roule ? T * 300 : 0} flow={roule} />
        <g opacity={clamp(e.gouttes, 0, 1)}>
          {[0, 1, 2, 3, 4, 5].map(function (i) {
            var ph = (T * 1.4 + i * 0.31) % 1;
            return <ellipse key={i} cx={600 + i * 80} cy={760 + ph * 50} rx="8" ry="12" fill="#5d9dcd" opacity={0.35 + 0.5 * (1 - ph)} />;
          })}
        </g>
        <text x="800" y="420" textAnchor="middle" fill={inv ? HP : BP} fontSize="34" fontWeight="900">
          {e.mode === 'transit' ? 'BATTERIE · EN CHANGEMENT' : inv ? 'BATTERIE · CONDENSEUR' : 'BATTERIE · ÉVAPORATEUR'}
        </text>
        <text x="1940" y="420" textAnchor="middle" fill={inv ? BP : HP} fontSize="34" fontWeight="900">
          {e.mode === 'transit' ? 'EN CHANGEMENT' : inv ? 'ÉVAPORATEUR' : 'CONDENSEUR'}
        </text>
        {/* la vanne 4 voies, vue de loin */}
        <rect x="1240" y="190" width="200" height="140" rx="14" fill={C.card} stroke={e.bobine ? C.orange : C.blue} strokeWidth="6" />
        {e.mode === 'froid' && <g fill="none" strokeWidth="9" strokeLinejoin="round">
          <path d="M 1310 330 L 1310 270 L 1430 250" stroke={HP} /><path d="M 1250 250 L 1370 270 L 1370 330" stroke={BP} /></g>}
        {e.mode === 'inverse' && <g fill="none" strokeWidth="9" strokeLinejoin="round">
          <path d="M 1310 330 L 1310 270 L 1250 250" stroke={HP} /><path d="M 1430 250 L 1370 270 L 1370 330" stroke={BP} /></g>}
        <text x="1340" y="166" textAnchor="middle" fill={C.blue} fontSize="30" fontWeight="900">VANNE 4 VOIES</text>
        {/* le compresseur, toujours dans le même sens */}
        <circle cx="1340" cy="1000" r="74" fill={e.comp ? '#fff0e9' : C.card} stroke="none" />
        <RK.SymCompresseur x={1340} y={1000} s={4.4} />
        {e.comp && <circle cx="1340" cy="1000" r="86" fill="none" stroke={C.orangeText} strokeWidth="5" strokeDasharray="22 16" strokeDashoffset={-T * 60} />}
        <text x="1340" y="1124" textAnchor="middle" fill={e.comp ? C.orangeText : C.mute} fontSize="28" fontWeight="900">{e.comp ? 'COMPRESSEUR' : 'COMPRESSEUR ARRÊTÉ'}</text>
        <text x="1286" y="560" transform="rotate(-90 1286 560)" textAnchor="middle" fill={HP} fontSize="26" fontWeight="800">refoulement</text>
        <text x="1412" y="560" transform="rotate(-90 1412 560)" textAnchor="middle" fill={BP} fontSize="26" fontWeight="800">aspiration</text>
        <Detendeur x={760} nom="DÉTENDEUR 1" actif={e.comp && e.mode === 'froid'} ouvert={e.comp && inv} clapetVers={1} />
        <Detendeur x={1560} nom="DÉTENDEUR 2" actif={e.comp && inv} ouvert={e.comp && e.mode === 'froid'} clapetVers={-1} />
        <rect x="1110" y="1338" width="90" height="44" rx="8" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="1155" y="1420" textAnchor="middle" fill={C.mute} fontSize="22" fontWeight="800">filtre</text>
      </g>
    );
  }

  /* ---- la vanne en coupe : dessin de CartoClim 2.6, repris à l'échelle du film ---- */
  function VanneCoupe(p) {
    var e = p.e, s = e.s, mode = e.mode;
    var pL = 135 + 80 * s, pR = pL + 280, xc = pL + 145;
    var gauche = e.bouts[0], droite = e.bouts[1];
    var pExt = mode === 'froid' ? 'HP' : mode === 'inverse' ? 'BP' : null;
    var pInt = mode === 'froid' ? 'BP' : mode === 'inverse' ? 'HP' : null;
    var roleExt = mode === 'froid' ? 'condenseur' : mode === 'inverse' ? 'évaporateur' : 'en changement';
    var roleInt = mode === 'froid' ? 'évaporateur' : mode === 'inverse' ? 'condenseur' : 'en changement';
    var bob = e.bobine;
    var capG = e.pilote === 'B' ? 'BP' : 'HP', capD = e.pilote === 'A' ? 'BP' : 'HP';
    var largG = pL - 124, largD = 228 - pL;
    function tube(d, pr) { return <path d={d} fill="none" stroke={couleur(pr)} strokeWidth="12" strokeLinejoin="round" strokeDasharray={pr ? 'none' : '9 7'} />; }
    function piston(x) { return <g><rect x={x} y="256" width="8" height="36" fill={C.blue} /><rect x={x} y="304" width="8" height="44" fill={C.blue} /></g>; }
    function coupe(xm) { return 'M' + (xm - 58) + ' 348 V322 H' + (xm + 58) + ' V348'; }
    return (
      <g transform="translate(2444,40) scale(2.6)" fontFamily={p.font}>
        <rect x="90" y="56" width="150" height="44" rx="8" fill={bob ? 'rgba(255,107,53,.22)' : C.card} stroke={bob ? C.orange : C.blue} strokeWidth={bob ? 5 : 3} />
        <g stroke={bob ? C.orange : C.blue} strokeWidth="2">{[0, 1, 2, 3, 4, 5, 6].map(function (i) { return <line key={i} x1={110 + i * 20} y1="66" x2={110 + i * 20} y2="90" />; })}</g>
        <text x="252" y="76" fontSize="15" fontWeight="700" fill={bob ? C.orangeText : C.blue}>{'bobine : ' + (bob ? 'alimentée' : 'sans courant')}</text>
        <text x="252" y="96" fontSize="14" fill={C.mute}>vanne pilote</text>
        <rect x="85" y="104" width="150" height="30" rx="6" fill={C.paper} stroke={C.blue} strokeWidth="3" />
        <path d={'M100 134 V122 H' + (e.pilote === 'A' ? 220 : 160) + ' V134'} fill="none" stroke={BP} strokeWidth="4" strokeLinejoin="round" />
        <rect x={(e.pilote === 'A' ? 160 : 220) - 12} y="129" width="24" height="6" fill={C.blue} />
        <path d="M100 134 V440 H320" fill="none" stroke={BP} strokeWidth="3" />
        <path d="M160 134 V224 H127 V252" fill="none" stroke={couleur(capG)} strokeWidth="3" />
        <path d="M220 134 V165 H513 V252" fill="none" stroke={couleur(capD)} strokeWidth="3" />
        <rect x="120" y="252" width="400" height="100" rx="12" fill={C.paper} stroke={C.blue} strokeWidth="3" />
        <rect x="124" y="256" width="392" height="92" rx="9" fill={teinte('HP')} />
        <rect x="124" y="256" width={Math.max(largG, 0)} height="92" fill={teinte(gauche)} />
        <rect x={pR + 8} y="256" width={Math.max(largD, 0)} height="92" fill={teinte(droite)} />
        <rect x={xc - 55} y="325" width="110" height="23" fill={teinte('BP')} />
        <rect x={pL + 8} y="282" width={pR - pL - 8} height="10" fill={C.blue} />
        <rect x={xc - 5} y="292" width="10" height="30" fill={C.blue} />
        <path d={coupe(xc)} fill="none" stroke={mode === 'transit' ? C.orange : C.blue} strokeWidth="5" strokeLinejoin="round" />
        {piston(pL)}{piston(pR)}
        <text x="400" y="240" textAnchor="middle" fontSize="15" fontWeight="700" fill={C.blue}>tiroir</text>
        <line x1="400" y1="247" x2="400" y2="283" stroke={C.blue} strokeWidth="2" />
        {tube('M470 192 H320 V262', 'HP')}
        {tube('M240 346 V382 H152', pExt)}
        {tube('M400 346 V382 H488', pInt)}
        {tube('M320 346 V472', 'BP')}
        <text x="306" y="221" textAnchor="end" fontSize="15" fontWeight="700" fill={HP}>refoulement</text>
        <text x="306" y="239" textAnchor="end" fontSize="14" fill={C.mute}>du compresseur</text>
        <text x="252" y="404" textAnchor="end" fontSize="14" fill={C.mute}>vers l’extérieur</text>
        <text x="252" y="423" textAnchor="end" fontSize="15" fontWeight="700" fill={couleur(pExt)}>{roleExt}</text>
        <text x="392" y="404" fontSize="14" fill={C.mute}>vers la batterie de la chambre</text>
        <text x="392" y="423" fontSize="15" fontWeight="700" fill={couleur(pInt)}>{roleInt}</text>
        <text x="320" y="496" textAnchor="middle" fontSize="15" fontWeight="700" fill={BP}>aspiration</text>
        <text x="320" y="514" textAnchor="middle" fontSize="14" fill={C.mute}>retour au compresseur</text>
      </g>
    );
  }

  function Panneau(p) {
    var e = p.e;
    var lignes = e.mode === 'froid'
      ? ['Bobine sans courant : le tiroir est', 'à droite. Le refoulement va au', 'condenseur, la batterie de la', 'chambre est reliée à l’aspiration.']
      : e.mode === 'inverse'
      ? ['Bobine alimentée : le tiroir est', 'passé à gauche. Le refoulement va', 'à la batterie de la chambre : elle', 'condense et fait fondre le givre.']
      : ['Le tiroir glisse, poussé par la', 'différence de pression : il faut', 'que le compresseur tourne.', ''];
    return (
      <g>
        <rect x="2520" y="100" width="2480" height="1440" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="2560" y="166" fill={C.orangeText} fontSize="32" fontWeight="900" letterSpacing="2">LA VANNE 4 VOIES, EN COUPE</text>
        <text x="4960" y="166" textAnchor="end" fill={C.blue} fontSize="24" fontWeight="900" letterSpacing="2">DESSIN DE CARTOCLIM 2.6</text>
        <g>
          <rect x="3980" y="380" width="980" height="420" rx="16" fill={e.mode === 'inverse' ? '#fdecea' : C.blueSoft} stroke={e.mode === 'inverse' ? HP : BP} strokeWidth="5" />
          <text x="4010" y="440" fill={e.mode === 'inverse' ? HP : BP} fontSize="36" fontWeight="900">
            {e.mode === 'froid' ? 'POSITION FROID' : e.mode === 'inverse' ? 'POSITION DÉGIVRAGE' : 'EN CHANGEMENT'}
          </text>
          {lignes.map(function (l, i) { return <text key={i} x="4010" y={500 + i * 50} fill={C.ink} fontSize="30" fontWeight="700">{l}</text>; })}
        </g>
        <g>
          <line x1="4010" y1="900" x2="4090" y2="900" stroke={HP} strokeWidth="14" />
          <text x="4110" y="912" fill={C.ink} fontSize="30" fontWeight="700">haute pression (HP)</text>
          <line x1="4010" y1="960" x2="4090" y2="960" stroke={BP} strokeWidth="14" />
          <text x="4110" y="972" fill={C.ink} fontSize="30" fontWeight="700">basse pression (BP)</text>
          <line x1="4010" y1="1020" x2="4090" y2="1020" stroke={LIQ} strokeWidth="14" />
          <text x="4110" y="1032" fill={C.ink} fontSize="30" fontWeight="700">liquide haute pression</text>
        </g>
        <text x="4010" y="1160" fill={C.mute} fontSize="26" fontWeight="800">Le compresseur tourne toujours</text>
        <text x="4010" y="1196" fill={C.mute} fontSize="26" fontWeight="800">dans le même sens : seuls les</text>
        <text x="4010" y="1232" fill={C.mute} fontSize="26" fontWeight="800">deux échangeurs changent de rôle.</text>
        <VanneCoupe e={e} font={p.font} />
      </g>
    );
  }

  var PHASES = [
    ['FROID', 'bobine sans courant : la batterie évapore'],
    ['INVERSION', 'ventilateurs arrêtés, bobine alimentée'],
    ['LA BATTERIE CONDENSE', 'le gaz chaud fait fondre le givre'],
    ['FIN SUR SONDE', 'bobine coupée, puis égouttage'],
    ['FROID SANS VENTILATION', 'la batterie refroidit, l’eau est partie'],
    ['VENTILATEURS', 'en dernier']
  ];

  var CH = { x0: 900, x1: 3980, tFin: 54 };
  function chx(t) { return CH.x0 + (CH.x1 - CH.x0) * clamp(t / CH.tFin, 0, 1); }
  function chAir(v) { return 1790 - ((v + 19) / 4) * 110; }
  function chBat(v) { return 2190 - ((v + 28) / 40) * 140; }
  var CARRES = [['bobine', 1830], ['comp', 1915], ['vent', 2290]];
  function Chrono(p) {
    var CUES = p.CUES, e = evenements(CUES);
    var air = '', bat = '', sq = {}, prec = {};
    CARRES.forEach(function (q) { sq[q[0]] = ''; });
    for (var t = 0; t <= CH.tFin + 0.001; t += 0.1) {
      var q = etat(t, CUES, p.total), x = chx(t).toFixed(1);
      air += (air ? ' L ' : 'M ') + x + ' ' + chAir(q.air).toFixed(1);
      bat += (bat ? ' L ' : 'M ') + x + ' ' + chBat(q.bat).toFixed(1);
      CARRES.forEach(function (c) {
        var on = q[c[0]];
        var y = on ? c[1] : c[1] + 40;
        if (prec[c[0]] === undefined) sq[c[0]] = 'M ' + x + ' ' + y;
        else if (prec[c[0]] !== y) sq[c[0]] += ' L ' + x + ' ' + prec[c[0]] + ' L ' + x + ' ' + y;
        prec[c[0]] = y;
      });
    }
    CARRES.forEach(function (c) { sq[c[0]] += ' L ' + chx(CH.tFin) + ' ' + prec[c[0]]; });
    var r = p.T >= CUES.Chronologie ? 1 : clamp(p.T / CH.tFin, 0, 1);
    var xr = CH.x0 + (CH.x1 - CH.x0) * r;
    var couleurs = { bobine: C.orange, comp: C.orangeText, vent: C.blue };
    return (
      <g transform="translate(270,0)">
        <rect x="0" y="1560" width="4030" height="960" rx="20" fill={C.card} stroke={C.blue} strokeWidth="5" />
        <text x="48" y="1636" fill={C.orangeText} fontSize="40" fontWeight="900" letterSpacing="3">CHRONOLOGIE · INVERSER, FONDRE, REVENIR</text>
        <rect x={chx(e.tB)} y="1660" width={chx(e.tFin) - chx(e.tB)} height="700" fill="#fdecea" opacity="0.6" />
        <rect x={chx(e.tFin)} y="1660" width={chx(e.tVent) - chx(e.tFin)} height="700" fill="#e4f2ec" opacity="0.6" />
        {[['AIR CHAMBRE', 1750], ['BOBINE V4V', 1862], ['COMPRESSEUR', 1947], ['BATTERIE', 2120], ['VENTILATEURS', 2322]].map(function (l) {
          return <text key={l[1]} x="48" y={l[1]} fill={C.blue} fontSize="34" fontWeight="800">{l[0]}</text>;
        })}
        {[[-18, '−18', C.blue, chAir], [10, '+10 · fin', C.red, chBat], [0, '0 °C', C.mute, chBat, true]].map(function (l, i) {
          return (
            <g key={i}>
              <line x1={CH.x0} y1={l[3](l[0])} x2={CH.x1} y2={l[3](l[0])} stroke={l[2]} strokeWidth="3" strokeDasharray="14 12" opacity="0.7" />
              <text x={l[4] ? CH.x1 + 14 : CH.x0 - 14} y={l[3](l[0]) + 9} textAnchor={l[4] ? 'start' : 'end'} fill={l[2]} fontSize="24" fontWeight="800">{l[1]}</text>
            </g>
          );
        })}
        <clipPath id="chclip10"><rect x={CH.x0 - 20} y="1650" width={xr - CH.x0 + 20} height="720" /></clipPath>
        <g clipPath="url(#chclip10)">
          <path d={air} fill="none" stroke={C.blue} strokeWidth="9" strokeLinejoin="round" />
          <path d={bat} fill="none" stroke={C.red} strokeWidth="9" strokeLinejoin="round" />
          {CARRES.map(function (c) {
            return <path key={c[0]} d={sq[c[0]]} fill="none" stroke={couleurs[c[0]]} strokeWidth="9" strokeLinejoin="round" />;
          })}
        </g>
        <text x={(chx(e.tB) + chx(e.tFin)) / 2} y="2410" textAnchor="middle" fill={HP} fontSize="28" fontWeight="900">INVERSION</text>
        <text x={(chx(e.tFin) + chx(e.tVent)) / 2} y="2410" textAnchor="middle" fill={C.green} fontSize="28" fontWeight="900">ÉGOUTTAGE · STATIQUE</text>
        {r < 1 && <line x1={xr} y1="1660" x2={xr} y2="2370" stroke={C.orange} strokeWidth="6" opacity="0.85" />}
        {p.replay !== null && (
          <g>
            <line x1={chx(p.replay)} y1="1660" x2={chx(p.replay)} y2="2370" stroke={C.orange} strokeWidth="9" />
            <circle cx={chx(p.replay)} cy="1660" r="16" fill={C.orange} />
          </g>
        )}
      </g>
    );
  }

  function zones(CUES) {
    var circuit = [330, 120, 2150, 1420], vanne = [2540, 110, 2440, 1420];
    return [
      { t: 0, r: [330, 290, 920, 980] }, { t: CUES.Froid, r: circuit }, { t: CUES.Inversion, r: vanne },
      { t: CUES.Inversion + 7, r: circuit }, { t: CUES.Fonte, r: [330, 290, 920, 980] }, { t: CUES.Retour, r: [250, 1540, 4080, 1000] },
      { t: CUES.Chronologie, r: [250, 1540, 5690, 1000] }, { t: CUES.CycleComplet, r: null }
    ];
  }

  function Piece(props) {
    var c = useComposition();
    var T = c.T, CUES = c.CUES;
    var e = etat(T, CUES, c.authoredTotal);
    var z = 1920 / (D - 260), cam = { cx: (300 + D) / 2, cy: 1420, z: z };
    var font = props.dys ? 'LexendLocal, "Trebuchet MS", sans-serif' : '"Trebuchet MS", Calibri, sans-serif';
    var keyIn = MOTION.enter(0, 1, CUES.LaCle + 0.3, 0.9)(T);
    var F0 = CUES.Froid, I = CUES.Inversion, F = CUES.Fonte, R = CUES.Retour, Ch = CUES.Chronologie, CC = CUES.CycleComplet;
    var leg = e.mode === 'inverse' ? (e.gouttes > 0.3 ? 'La batterie condense : le givre fond de l’intérieur.' : 'La batterie reçoit le refoulement.')
      : (!e.comp ? 'Égouttage : tout est arrêté.' : (!e.vent ? 'Froid sans ventilation : la batterie refroidit.' : 'Marche : la batterie évapore.'));
    return (
      <div data-screen-label={'t=' + Math.floor(T) + 's'}
           style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: font }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g fontFamily={font}
             transform={'translate(' + (960 - cam.cx * cam.z) + ',' + (540 - cam.cy * cam.z) + ') scale(' + cam.z + ')'}>
            <Circuit T={T} e={e} cid="s10" />
            <Panneau e={e} font={font} />
            <RK.Etapes x={5040} y={100} w={880} h={1440} titre="LA SÉQUENCE" phases={PHASES} k={e.phase} pas={215} haut={190} />
            <Chrono T={T} CUES={CUES} total={c.authoredTotal} replay={e.enRejeu ? e.Tm : null} />
            <g transform="translate(4510,1560) scale(0.6667)">
              <RK.GrosPlan T={T} s={{ bat: e.bat, givre: e.givre, gouttes: e.gouttes }} marche={e.comp && e.mode === 'froid'}
                           chaud={e.mode === 'inverse'} souffle={e.vent ? 1 : 0} fan="VENTIL." legende={leg} sonde="BATTERIE · SONDE DE FIN" />
            </g>
            <RK.Surligneur T={T} zones={zones(CUES)} />
          </g>
        </svg>

        <div style={{ position: 'absolute', inset: 0, background: C.paper, opacity: keyIn * 0.58, pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', left: '6%', right: '6%', top: '7%', opacity: keyIn,
          transform: 'translateY(' + (1 - keyIn) * -26 + 'px)', pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,253,248,0.95)', border: '3px solid ' + C.blue, borderLeft: '16px solid ' + C.orange,
            borderRadius: 18, padding: '26px 38px', boxShadow: '0 18px 50px rgba(27,58,99,0.18)'
          }}>
            <div style={{ color: C.orangeText, font: '900 24px ' + font, letterSpacing: 3 }}>STATION 10 · LE DÉGIVRAGE PAR INVERSION DE CYCLE</div>
            <div style={{ color: C.blue, font: '900 52px ' + font, lineHeight: 1.1, marginTop: 8 }}>
              La vanne 4 voies échange les rôles : la batterie de la chambre devient condenseur et fond son givre.
            </div>
            <div style={{ color: C.ink, font: '700 30px ' + font, marginTop: 12 }}>
              Les deux détendeurs et leurs clapets font passer le liquide dans les deux sens. Retour : égouttage, froid, ventilateurs en dernier.
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
              { at: 0.4, text: 'Une chambre froide NÉGATIVE : sa batterie est prise en givre.' },
              { at: 3.0, text: 'Ici, ni résistance, ni électrovanne de gaz chauds : une vanne 4 voies.' },
              { at: F0 + 0.4, text: 'En froid : le refoulement va au condenseur, à l’extérieur.' },
              { at: F0 + 3.0, text: 'Le liquide passe le clapet du détendeur 2, puis se détend dans le détendeur 1.' },
              { at: F0 + 5.8, text: 'La batterie de la chambre évapore : c’est elle qui givre.' },
              { at: I + 0.4, text: 'Début du dégivrage : les ventilateurs de la chambre s’arrêtent.' },
              { at: I + 3.2, text: 'La bobine de la vanne pilote est alimentée : le tiroir glisse.' },
              { at: I + 6.4, text: 'Le refoulement part vers la batterie de la chambre : elle devient condenseur.' },
              { at: I + 9.4, text: 'Le liquide passe le clapet du détendeur 1 et se détend dans le détendeur 2.' },
              { at: I + 12.2, text: 'L’échangeur extérieur évapore : il prend la chaleur dehors.' },
              { at: F + 0.4, text: 'Le gaz chaud se condense dans la batterie : le givre fond de l’intérieur.' },
              { at: F + 3.0, text: 'Tant qu’il reste de la glace, la batterie reste vers 0 °C.' },
              { at: F + 6.6, text: 'À +10 °C, la sonde de fin coupe la bobine : le tiroir revient en position froid.' },
              { at: R + 0.4, text: 'Le compresseur s’arrête : égouttage, l’eau s’écoule et les pressions s’équilibrent.' },
              { at: R + 3.6, text: 'Le froid reprend, sans ventilation : la batterie redescend sous zéro.' },
              { at: R + 8.1, text: 'Les ventilateurs repartent en dernier : ni air chaud, ni gouttes soufflées.' },
              { at: Ch + 0.4, text: 'Le chronogramme : la bobine ne dure que le temps de la fonte.' },
              { at: Ch + 4.0, until: CC, text: 'Après la fin : égouttage, froid statique, puis ventilateurs.' },
              { at: CC + 0.5, text: 'Toute la séquence, d’un seul regard : suivez le curseur orange.' },
              { at: CC + 5.0, text: 'La vanne bascule : la batterie condense, le givre fond.' },
              { at: CC + 10.0, until: CUES.LaCle, text: 'La vanne revient : égouttage, froid, ventilateurs.' }
            ]}
          />
        )}
      </div>
    );
  }

  function RegulesInversion() {
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

  window.RegulesInversion = RegulesInversion;
  window.RK10 = { Circuit: Circuit, Panneau: Panneau, VanneCoupe: VanneCoupe, etat: etat, PHASES: PHASES };
})();
