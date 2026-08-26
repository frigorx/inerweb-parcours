/* =====================================================================
   TUTOS SYMBOLES — le moteur, unique.
   Il ne connaît aucun tuto : tout vient de donnees/<id>.js
   Voir LIRE-MOI.md pour le contrat d'écriture.
   ===================================================================== */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  /* le fonds gelé, jamais modifié — et nos compléments, à côté */
  var DOSSIER_SYMBOLES = '../../fonds-origine/packs/fluides/res/symboles/';
  var DOSSIER_COMPLEMENTS = 'symboles-complements/';
  /* les modules du geste professionnel (popup « Voir le geste ») */
  var RACINE_MODULES = '../modules/';

  /* Les natures de fluide.
     Doctrine : la couleur ne porte JAMAIS seule l'information.
     Chaque nature = une couleur + un style de trait + un mot écrit. */
  var NATURES = {
    hp_gaz:     { couleur: '#c62828', tirets: '11 7', mot: 'HP · gaz chaud' },
    hp_liquide: { couleur: '#c62828', tirets: '',     mot: 'HP · liquide' },
    bp_gaz:     { couleur: '#1565c0', tirets: '11 7', mot: 'BP · gaz' },
    bp_melange: { couleur: '#1565c0', tirets: '',     mot: 'BP · liquide + gaz' },
    service:    { couleur: '#5b6b7c', tirets: '3 5',  mot: 'flexible de service' },
    azote:      { couleur: '#2e7d32', tirets: '',     mot: 'azote' },
    /* les flexibles du manifold, nommés comme sur le chantier */
    flex_bp:    { couleur: '#1565c0', tirets: '2 5',  mot: 'flexible bleu — BP' },
    flex_hp:    { couleur: '#c62828', tirets: '2 5',  mot: 'flexible rouge — HP' },
    flex_jaune: { couleur: '#a67c00', tirets: '2 5',  mot: 'flexible jaune — service' }
  };

  var etat = { tuto: null, n: 0, projection: false };

  /* ---------- petits outils ---------------------------------------- */
  function el(nom, attrs) {
    var e = document.createElementNS(SVGNS, nom);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function points(chaine) {
    return chaine.trim().split(/\s+/).map(function (p) {
      var xy = p.split(',');
      return [parseFloat(xy[0]), parseFloat(xy[1])];
    });
  }
  function chemin(pts) {
    return 'M ' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ');
  }

  /* ---------- la scène --------------------------------------------- */

  /* Le principe qui rend tout simple : les tuyaux sont tracés sur la
     grille, les symboles sont POSÉS par-dessus avec un fond opaque.
     Aucun point d'accroche à calculer — comme sur un schéma dessiné. */
  function dessiner(svg, tuto, n) {
    var etape = tuto.etapes[n];
    var poses = {}, traces = {};
    for (var i = 0; i <= n; i++) {
      (tuto.etapes[i].pose || []).forEach(function (id) { poses[id] = i; });
      (tuto.etapes[i].trace || []).forEach(function (id) { traces[id] = i; });
      /* une dépose retire de la scène — flexibles débranchés, bouteille enlevée */
      (tuto.etapes[i].retire || []).forEach(function (id) { delete poses[id]; delete traces[id]; });
    }
    var focus = {};
    (etape.focus || []).forEach(function (id) { focus[id] = true; });

    svg.textContent = '';
    svg.setAttribute('viewBox', '0 0 ' + tuto.grille[0] + ' ' + tuto.grille[1]);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', etape.titre + ' — ' + etape.texte);

    var cHalo = el('g'), cTuyaux = el('g'), cMasques = el('g'),
        cFleches = el('g'), cOrganes = el('g'), cMots = el('g');
    [cHalo, cTuyaux, cMasques, cFleches, cOrganes, cMots].forEach(function (g) { svg.appendChild(g); });

    /* --- halos de mise en évidence (dessous, pour ne rien couvrir) --- */
    (tuto.elements || []).forEach(function (o) {
      if (!(o.id in poses) || !focus[o.id]) return;
      var t = o.taille;
      cHalo.appendChild(el('rect', {
        x: o.x - t * 0.62, y: o.y - t * 0.62, width: t * 1.24, height: t * 1.24,
        rx: 14, class: 'halo-fond'
      }));
      cHalo.appendChild(el('rect', {
        x: o.x - t * 0.62, y: o.y - t * 0.62, width: t * 1.24, height: t * 1.24,
        rx: 14, class: 'halo'
      }));
    });

    /* --- les tuyaux -------------------------------------------------- */
    (tuto.tuyaux || []).forEach(function (t) {
      if (!(t.id in traces)) return;
      var pts = points(t.points);
      var nat = NATURES[t.nature] || NATURES.service;
      var d = chemin(pts);
      var neuf = traces[t.id] === n;

      /* un tuyau `dessus: true` porte un liseré couleur fond : au croisement
         d'un autre tuyau, il le coupe proprement — le pont des schémas */
      if (t.dessus) cTuyaux.appendChild(el('path', {
        d: d, fill: 'none', stroke: '#fffdf8', 'stroke-width': 14,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }));
      var trait = el('path', {
        d: d, fill: 'none', stroke: nat.couleur, 'stroke-width': 6,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      });
      if (nat.tirets) trait.setAttribute('stroke-dasharray', nat.tirets);
      if (focus[t.id]) trait.setAttribute('stroke-width', 9);
      cTuyaux.appendChild(trait);

      /* le tracé qui se dessine : un masque couleur fond qui se retire.
         Il PORTE du contenu (le sens de circulation) : il n'est donc
         jamais conditionné à prefers-reduced-motion. */
      if (neuf) {
        var masque = el('path', {
          d: d, fill: 'none', stroke: '#fffdf8', 'stroke-width': 13,
          'stroke-linejoin': 'round', 'stroke-linecap': 'round'
        });
        cMasques.appendChild(masque);
        var L = masque.getTotalLength();
        masque.setAttribute('stroke-dasharray', L);
        masque.setAttribute('stroke-dashoffset', 0);
        var anim = el('animate', {
          attributeName: 'stroke-dashoffset', from: 0, to: L,
          dur: '0.9s', fill: 'freeze', begin: '0s'
        });
        masque.appendChild(anim);
      }

      /* flèches de sens, au milieu de chaque segment */
      for (var s = 0; s < pts.length - 1; s++) {
        var a = pts[s], b = pts[s + 1];
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        var ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
        cFleches.appendChild(el('polygon', {
          points: '-7,-6 9,0 -7,6', fill: nat.couleur,
          transform: 'translate(' + mx + ',' + my + ') rotate(' + ang + ')'
        }));
      }

      /* le MOT du fluide — jamais la couleur seule */
      if (t.mot !== false) {
        var m = pts[Math.floor(pts.length / 2)];
        var texte = t.mot || nat.mot;
        var largeur = texte.length * 7.4 + 16;
        var dx = t.decalage ? t.decalage[0] : 0, dy = t.decalage ? t.decalage[1] : -16;
        cMots.appendChild(el('rect', {
          x: m[0] + dx - largeur / 2, y: m[1] + dy - 13, width: largeur, height: 21,
          rx: 6, fill: '#fffdf8', stroke: nat.couleur, 'stroke-width': 1.5
        }));
        var tx = el('text', {
          x: m[0] + dx, y: m[1] + dy + 2, 'text-anchor': 'middle',
          class: 'mot-tuyau', fill: nat.couleur
        });
        tx.textContent = texte;
        cMots.appendChild(tx);
      }
    });

    /* --- les organes, posés par-dessus ------------------------------- */
    (tuto.elements || []).forEach(function (o) {
      if (!(o.id in poses)) return;
      var t = o.taille;

      /* une ZONE n'a pas de symbole : elle sert au halo et à l'étiquette
         (cibler une vanne DESSINÉE DANS un symbole riche, par exemple) */
      if (!o.zone) {
        /* le fond opaque : c'est lui qui « perce » le tuyau sous le symbole.
           `fond` règle sa taille (fraction du côté) — un symbole au corps
           déjà opaque peut le réduire pour laisser les tuyaux le rejoindre */
        var fr = (o.fond !== undefined ? o.fond : 0.40);
        if (fr > 0) cOrganes.appendChild(el('rect', {
          x: o.x - t * fr, y: o.y - t * fr, width: t * fr * 2, height: t * fr * 2,
          fill: focus[o.id] ? '#fff3ec' : '#fffdf8'
        }));
      }

      var g = el('g');
      if (o.rot) g.setAttribute('transform', 'rotate(' + o.rot + ',' + o.x + ',' + o.y + ')');
      /* en version monofichier (bon à tirer), les symboles sont embarqués
         dans la page : window.SYMBOLES_INLINE prime sur les fichiers */
      var refSym = (window.SYMBOLES_INLINE || {})[o.sym] ||
        ((o.complement ? DOSSIER_COMPLEMENTS : DOSSIER_SYMBOLES) + o.sym + '.svg');
      if (!o.zone) g.appendChild(el('image', {
        href: refSym,
        x: o.x - t / 2, y: o.y - t / 2, width: t, height: t
      }));
      /* ce qui vient d'arriver apparaît en fondu — l'animation porte le
         contenu (« ceci est nouveau »), donc jamais de reduced-motion */
      if (poses[o.id] === n && n > 0) {
        var fondu = el('animate', {
          attributeName: 'opacity', from: 0, to: 1, dur: '0.6s', fill: 'freeze', begin: '0s'
        });
        g.setAttribute('opacity', 1);
        g.appendChild(fondu);
      }
      cOrganes.appendChild(g);

      if (o.nom) {
        var nx = o.x, ny;
        if (o.nomDecalage) { nx = o.x + o.nomDecalage[0]; ny = o.y + o.nomDecalage[1]; }
        else ny = o.y + (o.nomDessus ? -(t * 0.52 + 12) : (t * 0.52 + 20));
        var lg = o.nom.length * 8.2 + 16;
        cMots.appendChild(el('rect', {
          x: nx - lg / 2, y: ny - 15, width: lg, height: 23, rx: 6,
          class: 'etiq-fond'
        }));
        var nt = el('text', {
          x: nx, y: ny + 2, 'text-anchor': 'middle', class: 'etiq'
        });
        nt.textContent = o.nom;
        cMots.appendChild(nt);
      }
    });

    /* --- les jonctions déclarées (les tés) : un point plein --------- */
    (tuto.jonctions || []).forEach(function (j) {
      if (!(j.tuyau in traces)) return;
      cOrganes.appendChild(el('circle', { cx: j.x, cy: j.y, r: 7, fill: j.couleur || '#5b6b7c' }));
    });
  }

  /* ---------- le panneau -------------------------------------------- */
  function encadre(classe, cle, texte) {
    var d = document.createElement('div');
    d.className = 'encadre ' + classe;
    var s = document.createElement('span');
    s.className = 'cle';
    s.textContent = cle;
    d.appendChild(s);
    d.appendChild(document.createTextNode(texte));
    return d;
  }

  function rendrePanneau(tuto, n) {
    var etape = tuto.etapes[n];

    document.getElementById('kicker').textContent =
      'Étape ' + (n + 1) + ' sur ' + tuto.etapes.length;
    document.getElementById('titre-etape').textContent = etape.titre;
    document.getElementById('texte-etape').textContent = etape.texte;

    var zone = document.getElementById('encadres');
    zone.textContent = '';
    if (etape.vue) zone.appendChild(construireVue(etape.vue));
    if (etape.geste) zone.appendChild(encadre('geste', 'Le geste', etape.geste));
    if (etape.danger) zone.appendChild(encadre('danger', 'Sécurité', etape.danger));
    if (etape.verifier) zone.appendChild(encadre('verif', 'À vérifier — relecture métier', etape.verifier));

    /* le geste professionnel EN IMAGES : un module déjà fabriqué, en popup
       (absent de la version monofichier, qui n'embarque pas les modules) */
    if (etape.module && !window.SANS_MODULES) {
      var bv = document.createElement('button');
      bv.type = 'button';
      bv.className = 'bouton voir-geste';
      bv.textContent = '👁 Voir le geste — ' + (etape.module.titre || 'démonstration');
      bv.addEventListener('click', function () { ouvrirModule(etape.module); });
      zone.appendChild(bv);
    }

    /* le contrôle de compréhension, s'il y en a un */
    var zc = document.getElementById('controle');
    zc.textContent = '';
    if (etape.controle) {
      zc.className = 'controle';
      var q = document.createElement('p');
      q.className = 'q';
      q.textContent = etape.controle.question;
      zc.appendChild(q);
      var liste = document.createElement('div');
      liste.className = 'choix';
      etape.controle.choix.forEach(function (txt, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = txt;
        b.addEventListener('click', function () {
          var juste = i === etape.controle.bonne;
          b.className = juste ? 'juste' : 'faux';
          if (juste) {
            Array.prototype.forEach.call(liste.children, function (x) { x.disabled = true; });
            var ex = document.createElement('div');
            ex.className = 'explication';
            ex.textContent = etape.controle.explication;
            zc.appendChild(ex);
          }
        });
        liste.appendChild(b);
      });
      zc.appendChild(liste);
    } else {
      zc.className = '';
    }

    /* rail + navigation */
    var rail = document.getElementById('rail');
    rail.textContent = '';
    tuto.etapes.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = i + 1;
      b.title = e.titre;
      b.setAttribute('aria-label', 'Étape ' + (i + 1) + ' : ' + e.titre);
      b.className = i === n ? 'ici' : (i < n ? 'vu' : '');
      b.addEventListener('click', function () { aller(i); });
      rail.appendChild(b);
    });

    document.getElementById('precedent').disabled = n === 0;
    var suiv = document.getElementById('suivant');
    suiv.disabled = n === tuto.etapes.length - 1;
    suiv.textContent = n === tuto.etapes.length - 1 ? 'Fin' : 'Suivant ›';
    document.getElementById('compteur').textContent =
      'Étape ' + (n + 1) + ' / ' + tuto.etapes.length;
  }

  function aller(n) {
    var tuto = etat.tuto;
    if (n < 0 || n >= tuto.etapes.length) return;
    etat.n = n;
    dessiner(document.getElementById('scene'), tuto, n);
    rendrePanneau(tuto, n);
    var u = new URL(window.location.href);
    u.searchParams.set('e', n + 1);
    history.replaceState(null, '', u);
  }

  /* ---------- la vue annotée : l'élément réel, fléché ----------------- */
  /* Quand un geste nomme une partie (« le carré de manœuvre », « le
     bouchon »), la vue montre l'élément schématisé — un symbole de la
     bibliothèque QElectroTech — avec des flèches qui pointent chaque
     partie. C'est la mise en situation demandée le 14/08. */
  function construireVue(vue) {
    var conteneur = document.createElement('figure');
    conteneur.className = 'vue';
    if (vue.titre) {
      var lg = document.createElement('figcaption');
      lg.textContent = vue.titre;
      conteneur.appendChild(lg);
    }
    var c = vue.cadre;
    var svg = el('svg', { viewBox: c.join(' ') });
    var b = vue.boite;
    svg.appendChild(el('image', {
      href: (window.SYMBOLES_INLINE || {})[vue.sym] ||
        ((vue.complement ? DOSSIER_COMPLEMENTS : DOSSIER_SYMBOLES) + vue.sym + '.svg'),
      x: b[0], y: b[1], width: b[2], height: b[3]
    }));
    (vue.reperes || []).forEach(function (r) {
      var dx = r.x - r.lx, dy = r.y - r.ly;
      /* la flèche part après le cartouche et s'arrête juste avant la pièce */
      svg.appendChild(el('line', {
        x1: r.lx + dx * 0.18, y1: r.ly + dy * 0.18,
        x2: r.x - dx * 0.06, y2: r.y - dy * 0.06,
        stroke: '#ff6b35', 'stroke-width': 1.1
      }));
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;
      svg.appendChild(el('polygon', {
        points: '-3.4,-2.4 2.2,0 -3.4,2.4', fill: '#ff6b35',
        transform: 'translate(' + (r.x - dx * 0.04) + ',' + (r.y - dy * 0.04) + ') rotate(' + ang + ')'
      }));
      /* cartouche à largeur estimée : la vue doit aussi se construire
         hors écran (le livret), où getBBox ne mesure rien */
      var lgr = r.mot.length * 3.9 + 10;
      svg.appendChild(el('rect', {
        x: r.lx - lgr / 2, y: r.ly - 6.4, width: lgr, height: 10, rx: 3,
        fill: '#fffdf8', stroke: 'rgba(27,58,99,.35)', 'stroke-width': 0.5
      }));
      var t = el('text', {
        x: r.lx, y: r.ly + 1.2, 'text-anchor': 'middle', class: 'vue-mot'
      });
      t.textContent = r.mot;
      svg.appendChild(t);
    });
    conteneur.appendChild(svg);
    return conteneur;
  }

  /* ---------- la légende des traits ---------------------------------- */
  /* La couleur ne porte jamais seule l'information : la légende rappelle
     couleur + style de trait + mot, pour les natures utilisées par le tuto. */
  function construireLegende(tuto) {
    var zone = document.getElementById('legende');
    if (!zone) return;
    zone.textContent = '';
    var vues = {};
    (tuto.tuyaux || []).forEach(function (t) {
      var cle = t.nature;
      if (!NATURES[cle] || vues[cle]) return;
      vues[cle] = true;
      var item = document.createElement('span');
      item.className = 'legende-item';
      var nat = NATURES[cle];
      var mini = el('svg', { viewBox: '0 0 46 12', width: 46, height: 12 });
      var l = el('line', {
        x1: 2, y1: 6, x2: 44, y2: 6, stroke: nat.couleur,
        'stroke-width': 5, 'stroke-linecap': 'round'
      });
      if (nat.tirets) l.setAttribute('stroke-dasharray', nat.tirets);
      mini.appendChild(l);
      item.appendChild(mini);
      item.appendChild(document.createTextNode(nat.mot));
      zone.appendChild(item);
    });
  }

  /* ---------- la popup du geste professionnel ------------------------ */
  /* Les modules réutilisés (vanne rotalock, vanne de service,
     électrovanne, bouteille liquide…) sont des pages autonomes :
     on les montre dans un panneau par-dessus le tuto, sans le quitter. */
  function urlModule(module) {
    return module.url || (RACINE_MODULES + module.page);
  }

  function ouvrirModule(module) {
    var fond = document.createElement('div');
    fond.className = 'popup-fond';
    var boite = document.createElement('div');
    boite.className = 'popup';
    var barre = document.createElement('div');
    barre.className = 'popup-barre';
    var titre = document.createElement('strong');
    titre.textContent = module.titre || 'Le geste professionnel';
    var grand = document.createElement('a');
    grand.className = 'bouton';
    grand.textContent = 'Ouvrir en grand';
    grand.href = urlModule(module);
    grand.target = '_blank';
    grand.rel = 'noopener';
    var fermer = document.createElement('button');
    fermer.type = 'button';
    fermer.className = 'bouton plein';
    fermer.textContent = '✕ Fermer';
    var clore = function () { fond.remove(); document.removeEventListener('keydown', surEchap); };
    var surEchap = function (ev) { if (ev.key === 'Escape') clore(); };
    fermer.addEventListener('click', clore);
    fond.addEventListener('click', function (ev) { if (ev.target === fond) clore(); });
    document.addEventListener('keydown', surEchap);
    barre.appendChild(titre); barre.appendChild(grand); barre.appendChild(fermer);
    var cadre = document.createElement('iframe');
    cadre.src = urlModule(module);
    cadre.title = module.titre || 'Le geste professionnel';
    boite.appendChild(barre); boite.appendChild(cadre);
    fond.appendChild(boite);
    document.body.appendChild(fond);
    fermer.focus();
  }

  /* ---------- le livret imprimable ---------------------------------- */
  /* Construit AU MOMENT d'imprimer, jamais au chargement : c'est ce qui
     évite les collisions entre plusieurs SVG dans un même document. */
  function construireLivret() {
    var tuto = etat.tuto;
    var l = document.getElementById('livret');
    l.textContent = '';

    var h = document.createElement('h1');
    h.textContent = tuto.titre;
    l.appendChild(h);
    var st = document.createElement('p');
    st.textContent = tuto.sousTitre + ' — ' + tuto.etapes.length + ' étapes';
    l.appendChild(st);

    tuto.etapes.forEach(function (e, i) {
      var f = document.createElement('div');
      f.className = 'fiche';
      var t = document.createElement('h3');
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = (i + 1) + '. ';
      t.appendChild(num);
      t.appendChild(document.createTextNode(e.titre));
      f.appendChild(t);

      var svg = el('svg', { xmlns: SVGNS });
      f.appendChild(svg);
      dessiner(svg, tuto, i);
      /* pas d'animation sur le papier */
      Array.prototype.forEach.call(svg.querySelectorAll('animate'), function (a) {
        a.parentNode.removeChild(a);
      });

      var p = document.createElement('p');
      p.textContent = e.texte;
      f.appendChild(p);
      if (e.vue) f.appendChild(construireVue(e.vue));
      if (e.geste) f.appendChild(encadre('geste', 'Le geste', e.geste));
      if (e.danger) f.appendChild(encadre('danger', 'Sécurité', e.danger));
      if (e.controle) {
        var c = document.createElement('p');
        c.innerHTML = '';
        c.textContent = 'Question : ' + e.controle.question +
          '  →  Réponse : ' + e.controle.choix[e.controle.bonne] +
          '. ' + e.controle.explication;
        f.appendChild(c);
      }
      l.appendChild(f);
    });
  }

  /* ---------- lisibilité (bouton Aa), mémorisée ---------------------- */
  function lisibilite(cran) {
    document.documentElement.classList.remove('lis-1', 'lis-2');
    if (cran > 0) document.documentElement.classList.add('lis-' + cran);
    try { localStorage.setItem('tuto_lisibilite', cran); } catch (e) {}
  }

  /* ---------- le bandeau : logo inerWeb ou lycée --------------------- */
  /* Logo inerWeb : cotes figées du § 3.4 de la charte (version compacte). */
  function bandeauMarque(marque, cartouche) {
    var z = document.getElementById('marque');
    if (marque === 'lycee') {
      z.className = 'marque marque-texte';
      z.innerHTML = 'Lycée Jacques Raynaud<small>Filière froid et climatisation</small>';
      return;
    }
    z.className = 'marque';
    var mot = cartouche || 'Tuto';
    var large = Math.max(70, mot.length * 9 + 26);
    z.innerHTML =
      '<svg xmlns="' + SVGNS + '" viewBox="0 0 ' + (160 + large) + ' 50" height="44">' +
      '<text fill="#1b3a63" font-size="28" x="4" y="34">❄️</text>' +
      '<text fill="#1b3a63" font-family="Trebuchet MS, Trebuchet, sans-serif" font-size="26" font-weight="bold" x="44" y="32">iner</text>' +
      '<text fill="#1b3a63" font-family="Segoe Script, Brush Script MT, cursive" font-size="26" x="94" y="32">Web</text>' +
      '<line stroke="#e8914a" stroke-width="2" x1="44" x2="150" y1="35" y2="35"/>' +
      '<rect fill="#e8914a" x="155" y="10" rx="5" ry="5" width="' + large + '" height="24"/>' +
      '<text fill="#ffffff" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="14" font-weight="bold" x="' +
        (155 + large / 2) + '" y="27" text-anchor="middle">' + mot + '</text>' +
      '</svg>';
  }

  /* ---------- les gestes recyclables --------------------------------- */
  /* Une étape peut se réduire à { base: 'nom-du-geste', pose: [...] } :
     titre, texte et encadrés viennent alors de la bibliothèque commune
     window.GESTES (donnees/gestes.js). Ce que la fiche écrit elle-même
     l'emporte toujours sur le geste générique. */
  /* Un tuto peut s'appuyer sur un décor partagé (donnees/decors.js) :
     ses éléments et tuyaux s'ajoutent à ceux du décor. */
  function resoudreDecor(tuto) {
    if (!tuto.decor || tuto._decorResolu) return;
    var d = (window.DECORS || {})[tuto.decor];
    if (!d) return;
    tuto.elements = (d.elements || []).concat(tuto.elements || []);
    tuto.tuyaux = (d.tuyaux || []).concat(tuto.tuyaux || []);
    tuto.jonctions = (d.jonctions || []).concat(tuto.jonctions || []);
    if (!tuto.grille) tuto.grille = d.grille;
    tuto._decorResolu = true;
  }

  function resoudreGestes(tuto) {
    tuto.etapes = tuto.etapes.map(function (e) {
      if (!e.base) return e;
      var g = (window.GESTES || {})[e.base];
      if (!g) {
        return { titre: '⚠ Geste inconnu : ' + e.base,
                 texte: 'Ce geste n’existe pas dans donnees/gestes.js.' };
      }
      var fusion = {};
      var k;
      for (k in g) if (g.hasOwnProperty(k)) fusion[k] = g[k];
      for (k in e) if (e.hasOwnProperty(k) && k !== 'base') fusion[k] = e[k];
      return fusion;
    });
  }

  /* ---------- démarrage --------------------------------------------- */
  window.demarrerTuto = function (id) {
    var tuto = (window.TUTOS || {})[id];
    if (!tuto) {
      document.body.innerHTML =
        '<p style="padding:40px">Tuto inconnu : <strong>' + id + '</strong>. ' +
        'Vérifiez que <code>donnees/' + id + '.js</code> est bien appelé par la page.</p>';
      return;
    }
    resoudreDecor(tuto);
    resoudreGestes(tuto);
    etat.tuto = tuto;

    var p = new URLSearchParams(window.location.search);
    if (p.get('projection') === '1') document.body.classList.add('projection');

    document.title = tuto.titre + ' — tuto guidé';
    document.getElementById('titre-tuto').textContent = tuto.titre;
    document.getElementById('sous-titre').textContent = tuto.sousTitre;
    bandeauMarque(p.get('marque') || tuto.marque || 'inerweb', tuto.cartouche);

    try {
      var cran = parseInt(localStorage.getItem('tuto_lisibilite') || '0', 10);
      if (cran) lisibilite(cran);
    } catch (e) {}

    document.getElementById('precedent').addEventListener('click', function () { aller(etat.n - 1); });
    document.getElementById('suivant').addEventListener('click', function () { aller(etat.n + 1); });
    document.getElementById('aa').addEventListener('click', function () {
      var h = document.documentElement;
      var cran = h.classList.contains('lis-2') ? 0 : (h.classList.contains('lis-1') ? 2 : 1);
      lisibilite(cran);
    });
    document.getElementById('imprimer').addEventListener('click', function () {
      construireLivret();
      window.print();
    });
    document.getElementById('lien').addEventListener('click', function (ev) {
      var b = ev.currentTarget;
      var avant = b.textContent;
      /* le presse-papiers n'est pas accordé en file:// : on ne laisse pas
         traîner une erreur de console pour un bouton secondaire */
      var fini = function (msg) {
        b.textContent = msg;
        setTimeout(function () { b.textContent = avant; }, 2200);
      };
      if (!navigator.clipboard) { fini('Copiez l’adresse de la page'); return; }
      navigator.clipboard.writeText(window.location.href)
        .then(function () { fini('✓ Lien copié'); })
        .catch(function () { fini('Copiez l’adresse de la page'); });
    });

    document.addEventListener('keydown', function (ev) {
      if (/^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
      if (ev.key === 'ArrowRight' || ev.key === 'PageDown') { aller(etat.n + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { aller(etat.n - 1); ev.preventDefault(); }
    });

    construireLegende(tuto);

    var depart = parseInt(p.get('e') || '1', 10) - 1;
    aller(isNaN(depart) || depart < 0 || depart >= tuto.etapes.length ? 0 : depart);
  };
})();
