/* =====================================================================
   ILLUSTRATION — quelle image va sur quel écran.
   ---------------------------------------------------------------------
   Le support compte 581 écrans. On n'a pas 581 images, et il n'en faut
   pas : une image sert une FAMILLE de contenu. Trois gisements, trois
   usages qui ne se marchent pas dessus :

     1. l'ILLUSTRATION DE THÈME — `res/bibliotheque/illu-<fiche>.webp`.
        Une par fiche, elle accompagne toutes les diapositives de la
        séquence. C'est le fil visuel : le stagiaire reconnaît d'un coup
        d'œil qu'il est toujours dans la même fiche.

     2. l'ICÔNE DE RÔLE — `res/bibliotheque/icones/role-*.png`.
        Elle dit la NATURE de l'écran (à retenir, le piège, la question),
        pas son sujet. Elle revient donc partout, et c'est voulu : un
        repère qui change de forme à chaque écran n'est plus un repère.

     3. le SYMBOLE NORMALISÉ — `res/symboles/*.svg`, repris de la
        bibliothèque de symboles de l'usine et recoloré.
        Posé à côté du texte quand le paragraphe nomme un organe, il
        apprend au stagiaire, sans y penser, le symbole qu'il devra
        reconnaître sur un schéma le jour de l'épreuve. Une illustration,
        aussi jolie soit-elle, ne lui apprend rien de tel.

   PIÈGE CONNU, assumé : la norme emploie le MÊME symbole pour le
   condenseur et pour l'évaporateur (sur un schéma, la position dans le
   circuit lève l'ambiguïté). Isolé, il ne distingue plus rien : on ne
   l'affiche donc jamais sans sa légende, et les deux organes gardent en
   plus leur icône propre.

   Les motifs sont cherchés dans l'ORDRE de la liste : le plus spécifique
   d'abord (« pressostat haute pression » avant « pressostat »), sinon le
   général gagnerait toujours.
   ===================================================================== */
(function () {
  "use strict";

  var BASE = "packs/fluides/res/";

  /* Le recyclage voulu par le cahier de commande : une image pour plusieurs
     fiches, quand elles partagent le même propos. Les quatre mises en
     situation « Détective » se ressemblent par nature, les trois bilans
     aussi — leur donner quatre puis trois images distinctes n'aurait rien
     apporté qu'un travail de fabrication en plus. */
  var ALIAS = {
    x2:"x-detective", x3:"x-detective", x4:"x-detective", x5:"x-detective",
    "ex-ech":"examen", "ex-a1":"examen", "ex-defi":"examen"
  };

  /* ---- Icônes de rôle : la nature de l'écran ---- */
  var ROLES = {
    cle:        "role-retenir",
    piege:      "role-piege",
    question:   "role-question",
    juste:      "role-juste",
    competence: "role-competence",
    plateau:    "role-plateau",
    examen:     "role-examen",
    experience: "role-experience",
    nouveau:    "role-nouveau",
    remediation:"role-remediation",
    duree:      "role-duree"
  };

  /* ---- Symboles normalisés : motif → fichier + nom affiché ----
     Le nom affiché est celui de la norme, pas celui du langage courant :
     c'est lui qui sera lu sur un schéma d'examen. */
  var SYMBOLES = [
    [/compresseur\s+(à\s+)?vis/i,              "compresseur_vis",        "Compresseur à vis"],
    [/compresseur\s+scroll|scroll/i,           "compresseur_scroll",     "Compresseur scroll"],
    [/compresseur\s+(à\s+)?piston/i,           "compresseur_piston",     "Compresseur à piston"],
    [/compresseur\s+rotatif/i,                 "compresseur_rotatif",    "Compresseur rotatif"],
    [/compresseur/i,                           "compresseur_general",    "Compresseur"],
    [/détendeur\s+électronique/i,              "detendeur_electronique", "Détendeur électronique"],
    [/détendeur\s+thermostatique\s+à\s+égalisation\s+interne/i, "detendeur_thermo_int", "Détendeur thermostatique, égalisation interne"],
    [/détendeur/i,                             "detendeur_thermo_ext",   "Détendeur thermostatique"],
    [/tube\s+capillaire|capillaire/i,          "tube_capillaire",        "Tube capillaire"],
    [/condenseur\s+évaporatif/i,               "condenseur_evaporatif",  "Condenseur évaporatif"],
    [/échangeur\s+à\s+plaques/i,               "echangeur_a_plaques",    "Échangeur à plaques"],
    [/condenseur|évaporateur|échangeur/i,      "echangeur_a_air",        "Échangeur à air — le même symbole sert au condenseur et à l'évaporateur"],
    [/bouteille\s+(de\s+)?liquide|réservoir\s+de\s+liquide/i, "bouteille_liquide", "Bouteille de liquide"],
    [/filtre\s+déshydrateur|déshydrateur/i,    "filtre_deshydrateur",    "Filtre déshydrateur"],
    [/voyant/i,                                "voyant_liquide",         "Voyant liquide"],
    [/séparateur\s+d['’]huile/i,               "separateur_huile",       "Séparateur d'huile"],
    [/clapet/i,                                "clapet_anti_retour",     "Clapet anti-retour"],
    [/électrovanne/i,                          "electrovanne_frigo",     "Électrovanne"],
    [/vanne\s+de\s+sécurité|soupape/i,         "vanne_securite",         "Vanne de sécurité"],
    [/vanne/i,                                 "vanne_isolement",        "Vanne d'isolement"],
    [/pressostat\s+(haute\s+pression|HP)/i,    "pressostat_hp",          "Pressostat haute pression"],
    [/pressostat\s+(basse\s+pression|BP)/i,    "pressostat_bp",          "Pressostat basse pression"],
    [/pressostat/i,                            "pressostat",             "Pressostat"],
    [/thermostat/i,                            "thermostat_froid",       "Thermostat"],
    [/thermocouple/i,                          "thermocouple",           "Thermocouple"],
    [/sonde/i,                                 "sonde_temperature",      "Sonde de température"],
    [/manomètre/i,                             "manometres",             "Manomètres"],
    [/ventilateur/i,                           "ventilateur",            "Ventilateur"],
    [/relais\s+thermique/i,                    "relais_thermique",       "Relais thermique"],
    [/différentiel/i,                          "differentiel_4p",        "Différentiel"],
    [/sectionneur|consigner|consignation/i,    "sectionneur_3p",         "Sectionneur"],
    [/disjoncteur/i,                           "disjoncteur_3p",         "Disjoncteur"]
  ];

  /* ---- Icônes de notion : motif → fichier.
     Elles servent en PUCE des listes de gestes, là où chaque ligne est une
     action distincte. Ailleurs, l'illustration de thème suffit — deux
     images sur un même écran se concurrencent au lieu de s'aider. */
  var NOTIONS = [
    [/ventil|aér(er|ation)/i,                  "ico-espace-clos"],
    [/détecteur\s+d['’]oxygène|oxygène/i,      "ico-ari"],
    [/espace\s+clos|local\s+ferm|fosse|trappe/i,"ico-espace-clos"],
    [/gants?/i,                                "ico-gants"],
    [/lunettes?|visière/i,                     "ico-lunettes"],
    [/chaussures?/i,                           "ico-chaussures"],
    [/appareil\s+respiratoire|ARI\b/i,         "ico-ari"],
    [/extincteur/i,                            "ico-extincteur"],
    [/balis|périmètre|zone\s+de\s+travail/i,   "ico-balisage"],
    [/cadenas|consign/i,                       "ico-cadenas"],
    [/secours|premiers\s+soins/i,              "ico-secours"],
    [/issue\s+de\s+secours|évacuation/i,       "ico-issue"],
    [/lampe|éclairage/i,                       "ico-torche"],
    [/miroir/i,                                "ico-miroir"],
    [/manifold/i,                              "ico-manifold"],
    [/pompe\s+à\s+vide|tirage\s+au\s+vide|tirer\s+au\s+vide/i, "ico-pompe-vide"],
    [/vacuomètre|micron/i,                     "ico-vacuometre"],
    [/balance|pes(er|ée)/i,                    "ico-balance"],
    [/station\s+de\s+récupération/i,           "ico-station-recup"],
    [/détecteur\s+de\s+fuite|détection\s+de\s+fuite/i, "ico-detecteur-fuite"],
    [/eau\s+savonneuse|mousse|bulles?/i,       "ico-eau-savonneuse"],
    [/clé\s+plate|serrer|desserrer/i,          "ico-cles"],
    [/tournevis|vis\s+de\s+réglage/i,          "ico-tournevis"],
    [/chalumeau|braser|brasage|flamme/i,       "ico-chalumeau"],
    [/condenseur/i,                            "ico-condenseur"],
    [/évaporateur|givr/i,                      "ico-evaporateur"],
    [/bouteille\s+de\s+récupération/i,         "ico-bouteille-recup"],
    [/azote/i,                                 "ico-azote"],
    [/CO₂|CO2|R-?744/i,                        "ico-co2"],
    [/inflammable|hydrocarbure|R-?290|propane/i,"ico-inflammable"],
    [/PRP|réchauffement|GWP/i,                 "ico-prp"],
    [/ozone/i,                                 "ico-ozone"],
    [/registre|traçab|consigner\s+par\s+écrit/i,"ico-registre"],
    [/CERFA|formulaire/i,                      "ico-cerfa"],
    [/attestation|certificat/i,                "ico-attestation"],
    [/recycl|régénér|valoris/i,                "ico-recyclage"],
    [/interdit|jamais|ne\s+pas/i,              "ico-interdit"],
    [/bouteille|charge/i,                      "ico-bouteille-fluide"]
  ];

  function chercher(table, texte) {
    if (!texte) return null;
    for (var i = 0; i < table.length; i++) if (table[i][0].test(texte)) return table[i];
    return null;
  }

  window.Illustration = {
    /* Chemin de l'illustration de la fiche. Renvoie null si la fiche n'en a
       pas encore : l'appelant décide alors quoi montrer, il n'y a pas de
       « case vide » silencieuse. */
    theme: function (fiche) {
      if (!fiche) return null;
      return BASE + "bibliotheque/illu-" + (ALIAS[fiche] || fiche) + ".webp";
    },
    role: function (nom) {
      return ROLES[nom] ? BASE + "bibliotheque/icones/" + ROLES[nom] + ".png" : null;
    },
    ambiance: function (nom) {
      return BASE + "bibliotheque/amb-" + nom + ".webp";
    },
    /* Le symbole normalisé qui correspond au texte, avec son nom de norme. */
    symbole: function (texte) {
      var t = chercher(SYMBOLES, texte);
      return t ? { src: BASE + "symboles/" + t[1] + ".svg", nom: t[2] } : null;
    },
    /* L'icône de notion d'une ligne de liste. */
    notion: function (texte) {
      var t = chercher(NOTIONS, texte);
      return t ? BASE + "bibliotheque/icones/" + t[1] + ".png" : null;
    }
  };
})();
