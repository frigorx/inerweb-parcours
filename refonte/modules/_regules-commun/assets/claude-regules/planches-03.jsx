/* Les régules · Station 3 — planches pas à pas des écrans de cours (03/10/2026)
   2.1 Deux voies : B1 commande Y1, la BP commande KM1 ; 2.2 Tirage : Y1 ferme
   avant que KM1 s'arrête ; 2.3 Défaut : la BP remonte et KM1 recolle sans
   demande (court cycle). Schéma et logique du film 3 (RK3), kit des planches (PK). */
(function () {
  var PK = window.PK;
  var Pas = PK.Pas, Vanne = PK.Vanne, Compresseur = PK.Compresseur, Air = PK.Air, PriseBP = PK.PriseBP, Courbe = PK.Courbe;
  var CUES = { Enceinte: 0, Fermeture: 6, Circulation: 13, Consigne: 23, CourtCycle: 31,
               Chronologie: 38, CycleComplet: 44, LaCle: 60 };
  var TOTAL = 64;
  function etat(t) { return window.RK3.etat(t, CUES, TOTAL); }

  /* L'armoire du film 3, recadrée, avec ses effets côté fluide. */
  function Armoire(p) {
    var e = etat(p.T);
    var Cab = window.RK3.Cabinet;
    return (
      <g>
        <g transform="translate(-2520,-100)">
          <Cab T={p.now} arm={e.arm} bpArm={e.bpArm} y1Live={e.y1Live} kmLive={e.kmLive} fault={p.defaut && e.fault} />
        </g>
        <Air cx={394} temp={e.temp} />
        <PriseBP x={830} y={560} tx={1024} ty={655} bp={e.bp} />
        <Vanne x={610} y={1205} ouverte={e.y1Live} />
        <Compresseur x={990} y={1040} tourne={e.kmLive} now={p.now} />
        {p.courbe && <Courbe x={1700} y={330} t0={p.courbe[0]} t1={p.courbe[1]} T={p.T} etat={etat} />}
      </g>
    );
  }

  var VB_SEUL = '100 262 1600 1068', VB_COURBE = '100 262 2120 1068';
  var Z = {
    col1: [270, 655, 620, 640],
    prise: [695, 415, 730, 350],
    colKM: [995, 345, 460, 800],
    km1: [905, 960, 530, 250],
    courbe: [1690, 320, 460, 430]
  };

  function Planche03DeuxVoies() {
    return (
      <Pas titre="Deux commandes" viewBox={VB_SEUL}
           vue={function (T, now) { return <Armoire T={T} now={now} />; }}
           etapes={[
             { titre: 'À l’arrêt : deux colonnes, deux commandes', de: 3, a: 3, dur: 0.2, zones: [],
               texte: 'B1 est ouvert : Y1 est fermée. La BP est sous 1,8 bar : KM1 est au repos.' },
             { titre: 'B1 ferme : Y1 s’ouvre', de: 5.5, a: 7.9, dur: 2.2, zones: [Z.col1],
               texte: 'L’air remonte à −14 °C : le thermostat B1 ferme et alimente l’électrovanne Y1. Le liquide part vers l’évaporateur.' },
             { titre: 'La BP monte : KM1 colle', de: 7.9, a: 8.6, dur: 2.2, zones: [Z.prise, Z.km1],
               texte: 'Le liquide s’évapore, la pression BP monte. Au-dessus de 1,8 bar, le pressostat BP ferme : KM1 colle, le compresseur démarre.' },
             { titre: 'Deux commandes, un seul fluide', de: 8.6, a: 12, dur: 2.0, zones: [Z.prise],
               texte: 'B1 ne commande jamais KM1 : aucun fil ne relie les deux colonnes. C’est le fluide qui fait le lien, par la pression BP.' }
           ]} />
    );
  }

  function Planche03Tirage() {
    return (
      <Pas titre="Le tirage au vide" viewBox={VB_COURBE}
           vue={function (T, now) { return <Armoire T={T} now={now} courbe={[20, 31]} />; }}
           etapes={[
             { titre: 'En marche', de: 20, a: 20, dur: 0.2, zones: [],
               texte: 'B1 est fermé : Y1 est ouverte. La BP est haute : KM1 tourne.' },
             { titre: 'Consigne atteinte : Y1 se ferme', de: 25.9, a: 26.6, dur: 1.4, zones: [Z.col1],
               texte: 'L’air atteint −18 °C : B1 ouvre, Y1 se ferme, le liquide n’arrive plus. KM1, lui, n’a reçu aucun ordre d’arrêt.' },
             { titre: 'Le tirage au vide', de: 26.6, a: 28.45, dur: 3.4, zones: [Z.prise, Z.courbe],
               texte: 'Le compresseur continue d’aspirer : il vide l’évaporateur, la pression BP chute.' },
             { titre: '0,3 bar : KM1 s’arrête', de: 28.45, a: 29.0, dur: 1.2, zones: [Z.prise, Z.colKM],
               texte: 'Le pressostat BP ouvre : KM1 tombe. L’évaporateur est vide : rien ne pourra migrer vers le compresseur à l’arrêt.' }
           ]} />
    );
  }

  function Planche03Defaut() {
    return (
      <Pas titre="Le court cycle" viewBox={VB_COURBE}
           vue={function (T, now, k) { return <Armoire T={T} now={now} courbe={[29, 38.5]} defaut={k >= 2 && k <= 3} />; }}
           etapes={[
             { titre: 'À l’arrêt, évaporateur vide', de: 30, a: 30, dur: 0.2, zones: [],
               texte: 'B1 est ouvert, Y1 est fermée, KM1 est au repos. La BP est à 0,3 bar.' },
             { titre: 'La BP remonte', de: 30, a: 35.3, dur: 3.2, zones: [Z.prise],
               texte: 'À l’arrêt, la pression remonte : une Y1 qui fuit laisse passer du liquide. B1 n’a rien demandé.' },
             { titre: '1,8 bar : KM1 recolle', de: 35.3, a: 35.9, dur: 1.2, zones: [Z.colKM],
               texte: 'Le pressostat BP ferme : KM1 recolle sans demande de froid. Rien dans la colonne de KM1 ne sait que B1 est ouvert.' },
             { titre: 'Le court cycle', de: 35.9, a: 38.0, dur: 3.6, zones: [Z.courbe, Z.prise],
               texte: 'KM1 tire au vide, recoupe à 0,3 bar, la BP remonte, il recolle… Ces démarrages sans demande de froid fatiguent le compresseur.' },
             { titre: 'Le remède : la station 4', de: 38.0, a: 38.0, dur: 0.2, zones: [],
               texte: 'Le pump-down amélioré ajoute un relais KA qui garde la demande de B1 : sans elle, la BP seule ne peut plus faire coller KM1.' }
           ]} />
    );
  }

  window.Planche03DeuxVoies = Planche03DeuxVoies;
  window.Planche03Tirage = Planche03Tirage;
  window.Planche03Defaut = Planche03Defaut;
})();
