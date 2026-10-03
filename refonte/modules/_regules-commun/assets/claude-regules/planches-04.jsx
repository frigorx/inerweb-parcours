/* Les régules · Station 4 — planches pas à pas des écrans de cours (03/10/2026)
   2.1 Mémoire : le démarrage ; 2.2 Séquence : l'arrêt sans redémarrage ;
   2.3 Diagnostic : KA 43-44 câblé contre un pont à sa place.
   Même schéma et même logique que le film (RK4.Cabinet, RK4.etat) ; le lecteur
   et les effets côté fluide viennent du kit des planches (PK). */
(function () {
  var RK = window.RK, C = RK.C, PK = window.PK;
  var Pas = PK.Pas, Vanne = PK.Vanne, Compresseur = PK.Compresseur, Air = PK.Air, PriseBP = PK.PriseBP, Courbe = PK.Courbe;
  var CUES = { Enceinte: 0, Fermeture: 6, Circulation: 13, Consigne: 23, SansCourtCycle: 31,
               Chronologie: 38, CycleComplet: 44, LaCle: 60 };
  var TOTAL = 64;
  function etat(t) { return window.RK4.etat(t, CUES, TOTAL); }

  /* L'armoire du film, recadrée, avec ses effets côté fluide. */
  function Armoire(p) {
    var e = etat(p.T);
    var Cab = window.RK4.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} arm={e.arm} bpC={e.bpC} kaC={e.kaC} kmC={e.kmC} kmLive={e.kmLive} tenue={0} />
        </g>
        <Air cx={354} temp={e.temp} />
        <PriseBP x={1290} y={545} tx={1484} ty={635} bp={e.bp} />
        <Vanne x={1120} y={1205} ouverte={e.y1Live} />
        <Compresseur x={1445} y={1040} tourne={e.kmLive} now={p.now} />
        {p.courbe && <Courbe x={545} y={330} t0={20} t1={37} T={p.T} etat={etat} />}
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
