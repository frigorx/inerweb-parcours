/* Les régules · Stations 1 et 2 — planches pas à pas des écrans de cours (03/10/2026)
   Station 1, commande directe : qui commande, le cycle, ce qui manque.
   Station 2, protection minimum : une seule autorisation, thermostat ou pressostat,
   pas un pump-down. Armoires des films 1 et 2 (RK01, RK02), kit des planches (PK).
   Ces deux armoires déduisent leurs états des instants de fermeture et
   d'ouverture de B1 : les planches les pilotent par ces seuls instants. */
(function () {
  var clamp = window.clamp, MOTION = window.RK.MOTION;
  var PK = window.PK;
  var Pas = PK.Pas, Vanne = PK.Vanne, Compresseur = PK.Compresseur, Air = PK.Air, Courbe = PK.Courbe;

  function pw(T, pts) {
    if (T <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (T <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i];
        return a[1] + (b[1] - a[1]) * (T - a[0]) / Math.max(b[0] - a[0], 0.0001);
      }
    }
    return pts[pts.length - 1][1];
  }

  /* Deux cycles de thermostat : B1 fermé de 6 à 14, puis à partir de 22. */
  function cycle(t) {
    var c = t < 18 ? { tClose: 6, tOpen: 14 } : { tClose: 22, tOpen: 999 };
    var arm = t < c.tClose ? -30
      : t < c.tOpen ? -30 + 30 * clamp(MOTION.pop(c.tClose)(t), 0, 1.08)
      : -30 * clamp((t - c.tOpen) / 0.18, 0, 1);
    var km = (t >= 6.2 && t < 14) || t >= 22.2;
    return { tClose: c.tClose, tOpen: c.tOpen, arm: arm, kmLive: km,
             temp: pw(t, [[0, -15.4], [6, -14], [14, -18], [22, -14], [28, -16]]) };
  }

  /* ---- Station 1 ---- */
  function Armoire1(p) {
    var e = p.force || cycle(p.T);
    var Cab = window.RK01.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.Tcab === undefined ? p.T : p.Tcab} arm={e.arm} tClose={e.tClose} tOpen={e.tOpen} phaseAll={p.now} />
        </g>
        <Air cx={394} temp={e.temp} />
        <Compresseur x={900} y={1070} tourne={e.kmLive} now={p.now} />
        {p.courbe && <Courbe air={true} x={1270} y={330} t0={0} t1={28} T={p.T} etat={cycle} />}
      </g>
    );
  }
  var Z1 = { b1: [270, 630, 520, 320], km1: [420, 1000, 600, 250], col: [270, 290, 760, 1030],
             courbe: [1260, 320, 460, 430], hp: [800, 440, 220, 130], bp: [800, 600, 220, 130] };
  var MARCHE1 = { tClose: -1, tOpen: 999, arm: 0, kmLive: true, temp: -16 };

  function Planche01QuiCommande() {
    return (
      <Pas titre="Qui commande ?" viewBox="100 262 1180 1068"
           vue={function (T, now) { return <Armoire1 T={T} now={now} />; }}
           etapes={[
             { titre: 'À l’arrêt', de: 3, a: 3, dur: 0.2, zones: [],
               texte: 'B1 est ouvert : la bobine de KM1 n’est pas alimentée, le compresseur est arrêté.' },
             { titre: 'L’air se réchauffe : B1 ferme', de: 3, a: 6.15, dur: 2.4, zones: [Z1.b1],
               texte: 'L’air de la chambre remonte à −14 °C : le thermostat B1 ferme son contact.' },
             { titre: 'KM1 colle : le compresseur tourne', de: 6.15, a: 7, dur: 1.2, zones: [Z1.km1],
               texte: 'Le courant traverse B1 puis la bobine de KM1 : le contacteur colle, le compresseur démarre.' },
             { titre: 'Un seul contact décide', de: 8, a: 9, dur: 0.6, zones: [Z1.col],
               texte: 'Aucun autre organe n’intervient : la température seule décide de la marche et de l’arrêt.' }
           ]} />
    );
  }

  function Planche01Cycle() {
    return (
      <Pas titre="Le cycle" viewBox="100 262 1660 1068"
           vue={function (T, now) { return <Armoire1 T={T} now={now} courbe={true} />; }}
           etapes={[
             { titre: 'En marche, l’air refroidit', de: 8, a: 8, dur: 0.2, zones: [Z1.courbe],
               texte: 'B1 est fermé, KM1 est alimenté : le compresseur tourne et l’air de la chambre refroidit.' },
             { titre: 'Consigne atteinte : B1 ouvre', de: 8, a: 14.1, dur: 3, zones: [Z1.b1, Z1.km1],
               texte: 'L’air descend à −18 °C : B1 ouvre, KM1 retombe, le compresseur s’arrête.' },
             { titre: 'À l’arrêt, l’air se réchauffe', de: 14.1, a: 21.9, dur: 3, zones: [Z1.courbe],
               texte: 'Le compresseur est arrêté : l’air de la chambre remonte doucement.' },
             { titre: 'B1 referme : le cycle recommence', de: 21.9, a: 23, dur: 1.4, zones: [Z1.col],
               texte: 'À −14 °C, B1 se ferme de nouveau : KM1 colle. Le cycle ne suit que la température.' }
           ]} />
    );
  }

  function Planche01Limite() {
    return (
      <Pas titre="Ce qui manque" viewBox="100 262 1180 1160"
           vue={function (T, now) { return <Armoire1 T={T} Tcab={T} now={now} force={MARCHE1} />; }}
           etapes={[
             { titre: 'Une chaîne réduite à un contact', de: 20, a: 20, dur: 0.2, zones: [Z1.col],
               texte: 'Entre la phase et la bobine de KM1, il n’y a que B1. Rien d’autre ne peut arrêter le compresseur.' },
             { titre: 'Pas de sécurité HP', de: 28.4, a: 30, dur: 1.4, zones: [Z1.hp],
               texte: 'Si la haute pression monte trop, aucun pressostat HP ne vient couper KM1.' },
             { titre: 'Pas de sécurité BP', de: 30, a: 30, dur: 0.2, zones: [Z1.bp],
               texte: 'Une basse pression anormale, par manque de fluide, n’est pas détectée non plus.' },
             { titre: 'Pour comprendre, pas pour câbler', de: 38.2, a: 40, dur: 1.0, zones: [],
               texte: 'Ce schéma montre la régulation la plus simple. La station suivante ajoute les sécurités HP et BP, et une électrovanne.' }
           ]} />
    );
  }

  /* ---- Station 2 ---- */
  /* Un défaut HP apparaît dans l'armoire du film à partir de T = 41,6. */
  function etat2(t) {
    if (t >= 40) {
      var hp = t >= 41.8;
      return { T: t, tClose: -1, tOpen: 999, arm: 0, kmLive: !hp, temp: -15.2 };
    }
    var c = cycle(t);
    c.T = t;
    return c;
  }
  function Armoire2(p) {
    var e = etat2(p.T);
    var Cab = window.RK02.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={e.T} arm={e.arm} tClose={e.tClose} tOpen={e.tOpen} phaseAll={p.now} />
        </g>
        <Air cx={230} y={796} ly={796} temp={e.temp} />
        <Compresseur x={900} y={1070} tourne={e.kmLive} now={p.now} />
        <Vanne x={1270} y={1205} ouverte={e.kmLive} />
      </g>
    );
  }
  var Z2 = { col1: [300, 340, 520, 800], hp: [350, 360, 360, 190], b1: [300, 760, 520, 190],
             col2: [1000, 740, 560, 560], km1: [420, 1000, 620, 260] };

  function Planche02Serie() {
    return (
      <Pas titre="Une seule autorisation" viewBox="100 262 1600 1068"
           vue={function (T, now) { return <Armoire2 T={T} now={now} />; }}
           etapes={[
             { titre: 'À l’arrêt', de: 3, a: 3, dur: 0.2, zones: [],
               texte: 'Les pressions sont normales : HP et BP sont fermés. B1 est ouvert : KM1 et Y1 sont au repos.' },
             { titre: 'B1 ferme : la chaîne est complète', de: 3, a: 6.15, dur: 2.4, zones: [Z2.col1],
               texte: 'L’air remonte à −14 °C : B1 ferme. HP, BP et B1 sont en série : le courant atteint la bobine de KM1.' },
             { titre: 'KM1 colle, son auxiliaire ouvre Y1', de: 6.15, a: 7, dur: 1.4, zones: [Z2.km1, Z2.col2],
               texte: 'KM1 colle, le compresseur démarre. Son contact auxiliaire alimente Y1 : l’électrovanne s’ouvre.' },
             { titre: 'Un seul chemin pour tout', de: 8, a: 9, dur: 0.6, zones: [Z2.col1],
               texte: 'HP, BP et B1 sont sur le même fil : qu’un seul s’ouvre, et KM1 comme Y1 retombent.' }
           ]} />
    );
  }

  function Planche02Arret() {
    return (
      <Pas titre="Les deux charges tombent" viewBox="100 262 1600 1160"
           vue={function (T, now) { return <Armoire2 T={T} now={now} />; }}
           etapes={[
             { titre: 'En marche', de: 10, a: 10, dur: 0.2, zones: [],
               texte: 'B1 est fermé : KM1 tourne, Y1 est ouverte.' },
             { titre: 'Consigne : B1 ouvre', de: 13.8, a: 14.4, dur: 1.4, zones: [Z2.b1, Z2.col2],
               texte: 'L’air atteint −18 °C : B1 ouvre. KM1 retombe, son auxiliaire s’ouvre : Y1 se ferme en même temps.' },
             { titre: 'Défaut : le pressostat HP ouvre', de: 41, a: 42.3, dur: 1.6, zones: [Z2.hp, Z2.col2],
               texte: 'Le froid est demandé, B1 est fermé… mais la haute pression monte trop : le pressostat HP ouvre. KM1 et Y1 retombent.' },
             { titre: 'Même résultat, causes différentes', de: 43, a: 43, dur: 0.2, zones: [Z2.col1, Z2.col2],
               texte: 'Thermostat ou pressostat : la chaîne s’ouvre et les deux charges tombent. Après un défaut HP, il faut réarmer à la main.' }
           ]} />
    );
  }

  function Planche02PasPumpDown() {
    return (
      <Pas titre="Pas un pump-down" viewBox="100 262 1600 1068"
           vue={function (T, now) { return <Armoire2 T={T} now={now} />; }}
           etapes={[
             { titre: 'En marche', de: 10, a: 10, dur: 0.2, zones: [],
               texte: 'KM1 tourne, Y1 est ouverte : le liquide arrive à l’évaporateur.' },
             { titre: 'Consigne : tout s’arrête ensemble', de: 13.8, a: 14.4, dur: 1.4, zones: [Z2.km1, Z2.col2],
               texte: 'B1 ouvre : KM1 et Y1 retombent au même instant. Le compresseur n’aspire plus.' },
             { titre: 'L’évaporateur reste plein', de: 15, a: 15, dur: 0.2, zones: [Z2.col2],
               texte: 'Le liquide déjà passé dans l’évaporateur y reste : à l’arrêt, il peut migrer vers le compresseur (film « La migration »).' },
             { titre: 'Le pump-down fait autrement', de: 15, a: 15, dur: 0.2, zones: [],
               texte: 'À la station 3, Y1 se ferme d’abord et le compresseur continue d’aspirer : il vide l’évaporateur avant de s’arrêter.' }
           ]} />
    );
  }

  window.Planche01QuiCommande = Planche01QuiCommande;
  window.Planche01Cycle = Planche01Cycle;
  window.Planche01Limite = Planche01Limite;
  window.Planche02Serie = Planche02Serie;
  window.Planche02Arret = Planche02Arret;
  window.Planche02PasPumpDown = Planche02PasPumpDown;
})();
