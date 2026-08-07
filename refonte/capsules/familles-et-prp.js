/* =====================================================================
   familles-et-prp.js — « Familles et PRP : pourquoi les fluides changent »
   ---------------------------------------------------------------------
   Redécoupage du fonds : familles-fluides.svg, prp-echelle.svg,
   frise-vivante (l'histoire), frise-histoire.svg.

   RÈGLE TENUE — zéro invention : le fonds ne donne NI les seuils F-Gas
   chiffrés, NI les valeurs de PRP de la plupart des fluides, NI le lien
   explicite PRP/PRG. Ces trous sont FLAGUÉS « à vérifier », jamais
   comblés de tête. Les quatre valeurs de PRP citées viennent de
   prp-echelle.svg, qui les dit elle-même « indicatives (Mission F-GAZ) ».
   ===================================================================== */
CAPSULE({
  id: "familles-et-prp",
  ordre: 5,
  titre: "Familles et PRP : pourquoi les fluides changent",
  question: "CFC, HFC, HFO, naturels… pourquoi remplace-t-on sans cesse les fluides ?",
  niveau: "métier",
  minutes: 7,
  suppose: "Lire le code d'un fluide",
  voixFabriquee: true,   /* Henri + Denise, 07/08/2026 */

  fil: [
    {
      id: "01-cinq-familles",
      titre: "Cinq familles. Chacune corrige la précédente — et révèle un nouveau défaut.",
      planche: "../fonds-origine/packs/fluides/res/svg/familles-fluides.svg",
      texte: [
        "CFC, HCFC, HFC, HFO, naturels : **cinq familles**, et une histoire qui va de gauche à droite.",
        "**Trois atomes décident de tout** : le chlore détruit l'ozone, le fluor rend la molécule stable — donc durable dans l'atmosphère, où elle fait effet de serre —, l'hydrogène raccourcit sa vie.",
        "**Il n'y a pas de fluide parfait : il n'y a que des compromis maîtrisés.** Toute la suite tient dans cette phrase."
      ],
      lu: "CFC, HCFC, HFC, HFO, et les fluides naturels : cinq familles, et une histoire qui se lit de gauche à droite. Chaque famille corrige le défaut de la précédente, et en révèle un nouveau. Trois atomes décident de tout. Le chlore détruit l'ozone. Le fluor rend la molécule stable, donc durable dans l'atmosphère, où elle fait effet de serre. L'hydrogène raccourcit sa vie dans l'air. Retenez surtout la conclusion : il n'y a pas de fluide parfait. Il n'y a que des compromis maîtrisés.",
      plus: ["trois-atomes"],
      codes: ["2.01"]
    },

    {
      id: "02-les-interdits",
      titre: "CFC et HCFC : le chlore les a condamnés.",
      planche: "planches/interdits-cfc-hcfc.svg",
      texte: [
        "Les **CFC** (le R-12) : les « miracles » des années 1930 — stables, ni toxiques ni inflammables… **et tueurs d'ozone**. Interdits.",
        "Les **HCFC** (le R-22) : la transition. Un peu d'hydrogène, moins de chlore, vie plus courte — **mais du chlore quand même**. Interdits aussi.",
        "Vous croiserez encore ces machines en dépannage : savoir d'où elles viennent, c'est savoir pourquoi on ne les recharge plus."
      ],
      lu: "Les deux premières familles sont interdites, et c'est le chlore qui les a condamnées. Les CFC, comme le R douze, étaient les miracles des années mille neuf cent trente : stables, ni toxiques, ni inflammables… et tueurs d'ozone. Les HCFC, comme le R vingt-deux, ont fait la transition : un peu d'hydrogène, moins de chlore, une vie plus courte. Mais du chlore quand même. Vous croiserez encore ces machines en dépannage. Savoir d'où elles viennent, c'est savoir pourquoi on ne les recharge plus.",
      verifier: [
        "**« Interdits » sans nuance** — c'est le mot de la planche. Faut-il préciser ce qui reste permis sur une machine au R-22 encore en service (dépannage sans recharge, récupération) ? À trancher en relecture.",
      ],
      plus: ["histoire-ozone"],
      codes: ["2.01"]
    },

    {
      id: "03-les-hfc",
      titre: "Les HFC : l'ozone sauvé, le climat raté.",
      planche: "planches/hfc-ozone-climat.svg",
      texte: [
        "**Zéro chlore** : avec les HFC (R-134a, R-32), l'ozone est sauvé — [[ODP|le potentiel de destruction de l'ozone : 0 veut dire que le fluide, même relâché, n'attaque pas la couche d'ozone]] = 0.",
        "Mais leur **PRP est fort** : ils réchauffent le climat des centaines à des milliers de fois plus que le CO₂, kilo pour kilo.",
        "D'où leur statut : **en réduction**. C'est la réduction progressive des quotas (le « phase-down ») du règlement F-Gas, et l'amendement de Kigali."
      ],
      lu: "Troisième famille : les HFC, comme le R cent trente-quatre a ou le R trente-deux. Zéro chlore : l'ozone est sauvé. Leur potentiel de destruction de l'ozone, l'O D P, est nul. Mais leur PRP est fort : ils réchauffent le climat des centaines à des milliers de fois plus que le CO2, kilo pour kilo. D'où leur statut actuel : en réduction. C'est la réduction progressive des quotas du règlement F-Gas, et l'amendement de Kigali.",
      plus: ["histoire-climat"],
      codes: ["2.01"]
    },

    {
      id: "04-le-prp",
      titre: "Le PRP : un kilogramme n'égale pas un kilogramme.",
      planche: "../fonds-origine/packs/fluides/res/svg/prp-echelle.svg",
      texte: [
        "Le **PRP**, c'est l'effet de serre d'**1 kg de fluide**, comparé à **1 kg de CO₂** — l'étalon, PRP = 1.",
        "L'échelle parle d'elle-même : CO₂ **1** · R-32 **675** · R-410A **2088** · R-404A **3922**.",
        "Conséquence : **fuir 1 kg de R-404A ≈ relâcher 3,9 tonnes équivalent CO₂.**",
        "*En intervention, le PRP ne se devine pas : il se lit sur la fiche du fluide.*"
      ],
      lu: "Voici l'outil de mesure de toute cette histoire : le PRP. C'est l'effet de serre d'un kilogramme de fluide, comparé à un kilogramme de CO2, qui sert d'étalon avec un PRP de un. Regardez l'échelle. Le CO2 : un. Le R trente-deux : six cent soixante-quinze. Le R quatre cent dix A : deux mille quatre-vingt-huit. Le R quatre cent quatre A : trois mille neuf cent vingt-deux. La conséquence est concrète : fuir un kilogramme de R quatre cent quatre A, c'est relâcher environ trois virgule neuf tonnes équivalent CO2. Et retenez ce réflexe : en intervention, le PRP ne se devine pas. Il se lit sur la fiche du fluide.",
      verifier: [
        "**Les quatre valeurs de PRP (1 · 675 · 2088 · 3922)** — la planche les dit elle-même « indicatives ». Sont-elles celles que vous voulez enseigner (AR4 ? AR5 ?) — à valider.",
        "**PRP, PRG, GWP** : le fonds emploie « PRP » et « PRG » sans jamais dire que c'est la même grandeur (GWP en anglais). Faut-il le dire ici ? À valider.",
        "**L'horizon de temps manque** : la définition complète est « sur 100 ans », et c'est une question d'examen classique — le fonds ne le dit nulle part. L'ajouter ?",
      ],
      plus: ["teqco2"],
      codes: ["2.02"]
    },

    {
      id: "05-les-autorises",
      titre: "HFO et naturels : autorisés — chacun son revers.",
      planche: "planches/autorises-hfo-naturels.svg",
      texte: [
        "Les **HFO** (R-1234yf) : une **double liaison C = C** qui casse en quelques jours dans l'air — **PRP ≈ 1**. Souvent A2L. Et la question [[PFAS|le sigle des substances per- et polyfluoroalkylées : des composés fluorés très persistants dans l'environnement. Leur lien avec les HFO fait débat — le point est signalé « à vérifier »]] se pose.",
        "Les **naturels** : R-290 et R-600a (propane, isobutane), R-717 (ammoniac), R-744 (CO₂). **PRP minuscule.**",
        "Mais **chacun son revers : A3, B2L ou haute pression.** Le fluide qui ne réchauffe pas le climat vous demande, à vous, davantage de métier."
      ],
      lu: "Restent les deux familles autorisées. Les HFO, comme le R mille deux cent trente-quatre igrec èf : leur double liaison casse en quelques jours dans l'air, d'où un PRP proche de un. Ils sont souvent classés A deux L. Et la question des PFAS se pose. Puis les fluides naturels : le R deux cent quatre-vingt-dix et le R six cents a, propane et isobutane ; le R sept cent dix-sept, l'ammoniac ; le R sept cent quarante-quatre, le CO2. Leur PRP est minuscule. Mais chacun a son revers : A trois, B deux L, ou haute pression. Le fluide qui ne réchauffe pas le climat vous demande, à vous, davantage de métier.",
      verifier: [
        "**« La question PFAS se pose »** — le fonds n'en dit pas plus. Suffisant à ce niveau, ou faut-il un mot d'explication ? À trancher.",
      ],
      codes: ["2.01"]
    },

    {
      id: "06-la-regle",
      titre: "Ce que la règle en fait — et ce que ça vous demande.",
      planche: "planches/prp-regle-serre.svg",
      texte: [
        "Le règlement **F-Gas 2024/573** accélère la baisse des [[quotas|les quantités maximales de HFC que les producteurs ont le droit de mettre sur le marché chaque année — elles diminuent d'année en année]] de HFC et programme **l'interdiction** de certains fluides à fort PRP dans de nombreux équipements neufs.",
        "L'amendement de **Kigali** fait la même chose à l'échelle mondiale.",
        "La chaîne est simple : **plus le PRP est fort, plus la règle serre.** Et la conclusion de toute la frise : **il n'existe pas de fluide parfait. Il existe des professionnels bien formés.**"
      ],
      lu: "Terminons par ce que la règle en fait. Le règlement F-Gas deux mille vingt-quatre, cinq cent soixante-treize, accélère radicalement la baisse des quotas de HFC mis sur le marché, et programme l'interdiction pure et simple de certains fluides à fort PRP dans de nombreux équipements neufs. L'amendement de Kigali fait la même chose à l'échelle mondiale. La chaîne est simple : plus le PRP est fort, plus la règle serre. Et la conclusion de toute cette histoire tient en deux phrases : il n'existe pas de fluide parfait. Il existe des professionnels bien formés.",
      verifier: [
        "**Aucun seuil chiffré de la F-Gas n'est enseigné ici** (le fonds n'en donne pas). Faut-il ajouter les seuils et échéances qui tombent à l'examen ? Si oui, lesquels — à fournir.",
      ],
      codes: ["2.01"]
    }
  ],

  retenir: [
    "**Cinq familles** : CFC et HCFC **interdits** (chlore) · HFC **en réduction** (PRP fort) · HFO et naturels **autorisés**, chacun son revers.",
    "Le **PRP** compare 1 kg de fluide à 1 kg de CO₂ — l'étalon, PRP = 1.",
    "**R-404A : PRP 3922** — fuir 1 kg ≈ 3,9 tonnes équivalent CO₂.",
    "En intervention, **le PRP se lit sur la fiche du fluide**.",
    "**Pas de fluide parfait : des compromis maîtrisés.**"
  ],

  detours: {

    "trois-atomes": {
      question: "Chlore, fluor, hydrogène : pourquoi ces trois-là décident-ils de tout ?",
      ecrans: [
        {
          id: "d-atomes-1",
          titre: "Un rôle par atome.",
          planche: "../fonds-origine/packs/fluides/res/svg/familles-fluides.svg",
          texte: [
            "**Le chlore (Cl)** : monté dans la stratosphère, il **détruit l'ozone**. C'est lui qui a condamné CFC et HCFC.",
            "**Le fluor (F)** : il rend la molécule **stable** — et une molécule stable qui absorbe la chaleur fait un **gaz à effet de serre durable**.",
            "**L'hydrogène (H)** : il donne une **vie courte** à la molécule, qui se détruit dans l'air avant de s'accumuler.",
            "Lisez une famille comme un dosage de ces trois-là : c'est toute la planche."
          ],
          lu: "Un rôle par atome. Le chlore : une fois monté dans la stratosphère, il détruit l'ozone. C'est lui qui a condamné les CFC et les HCFC. Le fluor : il rend la molécule stable. Et une molécule stable qui absorbe la chaleur devient un gaz à effet de serre durable. L'hydrogène : il donne une vie courte à la molécule, qui se détruit dans l'air avant de s'accumuler. Lisez chaque famille comme un dosage de ces trois atomes : c'est toute la planche.",
          codes: ["2.01"]
        }
      ]
    },

    "histoire-ozone": {
      question: "Comment en est-on venu à interdire des fluides « miracles » ?",
      ecrans: [
        {
          id: "d-ozone-1",
          titre: "Soixante ans, en quatre dates.",
          planche: "../fonds-origine/packs/fluides/res/svg/frise-histoire.svg",
          texte: [
            "**1928-1930** — Thomas Midgley Jr. synthétise les CFC : stables, ininflammables, non toxiques. Ils remplacent des gaz dangereux comme l'ammoniac.",
            "**1974** — Molina et Rowland démontrent que les CFC, inertes en bas, libèrent dans la [[stratosphère|la couche haute de l'atmosphère, entre 10 et 50 km d'altitude environ — c'est là que vit la couche d'ozone]] un chlore qui **attaque la couche d'ozone**.",
            "**1985** — le trou d'ozone est **confirmé** au-dessus du pôle Sud, depuis la station Halley.",
            "**1987** — le **protocole de Montréal** planifie l'élimination des substances qui appauvrissent l'ozone. L'un des plus grands succès de la diplomatie environnementale."
          ],
          lu: "L'histoire tient en quatre dates. Mille neuf cent vingt-huit : Thomas Midgley junior synthétise les CFC. Stables, ininflammables, non toxiques, ils remplacent des gaz dangereux comme l'ammoniac. Mille neuf cent soixante-quatorze : deux chimistes, Molina et Rowland, démontrent que les CFC, inertes dans la basse atmosphère, libèrent dans la stratosphère un chlore qui attaque massivement la couche d'ozone. Mille neuf cent quatre-vingt-cinq : le trou d'ozone est confirmé au-dessus du pôle Sud. Mille neuf cent quatre-vingt-sept, enfin : le protocole de Montréal planifie l'élimination progressive des substances qui appauvrissent la couche d'ozone. C'est l'un des plus grands succès de la diplomatie environnementale.",
          codes: ["2.01"]
        }
      ]
    },

    "histoire-climat": {
      question: "Et après l'ozone, comment le climat est-il devenu le sujet ?",
      ecrans: [
        {
          id: "d-climat-1",
          titre: "Le problème résolu d'un côté en a créé un de l'autre.",
          planche: "../fonds-origine/packs/fluides/res/svg/frise-histoire.svg",
          texte: [
            "**Années 1990** — pour remplacer CFC et HCFC, l'industrie adopte massivement les **HFC**. L'ozone est sauvé… mais leur pouvoir de réchauffement est **des centaines à des milliers de fois** celui du CO₂.",
            "**2015** — l'**accord de Paris** fixe le cap : contenir le réchauffement bien en dessous de 2 degrés. Le froid est scruté comme tout le monde.",
            "**2016** — l'**amendement de Kigali** intègre les HFC au protocole de Montréal : réduction mondiale programmée.",
            "**2024** — le **règlement F-Gas 2024/573** accélère les quotas et programme des interdictions dans le neuf."
          ],
          lu: "Le problème résolu d'un côté en a créé un de l'autre. Dans les années mille neuf cent quatre-vingt-dix, pour remplacer les CFC et les HCFC, l'industrie adopte massivement les HFC. La couche d'ozone est sauvée. Mais on découvre rapidement que leur pouvoir de réchauffement est des centaines à des milliers de fois supérieur à celui du CO2. Deux mille quinze : l'accord de Paris fixe le cap, contenir le réchauffement bien en dessous de deux degrés. Deux mille seize : l'amendement de Kigali intègre officiellement les HFC au protocole de Montréal, avec un calendrier mondial de réduction. Et deux mille vingt-quatre : le règlement F-Gas accélère radicalement la baisse des quotas, et programme des interdictions dans les équipements neufs.",
          codes: ["2.01"]
        }
      ]
    },

    "teqco2": {
      question: "3,9 tonnes pour un kilo : d'où sort ce calcul ?",
      ecrans: [
        {
          id: "d-teq-1",
          titre: "La charge multipliée par le PRP.",
          planche: "planches/teqco2-calcul.svg",
          texte: [
            "L'exemple de la planche : **fuir 1 kg de R-404A ≈ relâcher 3,9 tonnes équivalent CO₂** — c'est le PRP (3922) qui fait la conversion.",
            "Ce chiffre en « tonnes équivalent CO₂ » est celui que la réglementation regarde : c'est lui qui **classe la sévérité** d'une installation.",
            "C'est aussi lui qui commande les obligations de contrôle — voyez la capsule **« Le contrôle d'étanchéité »**."
          ],
          lu: "Reprenons l'exemple de la planche. Fuir un kilogramme de R quatre cent quatre A, c'est relâcher environ trois virgule neuf tonnes équivalent CO2. C'est le PRP, trois mille neuf cent vingt-deux, qui fait la conversion. Ce chiffre en tonnes équivalent CO2 est celui que la réglementation regarde : c'est lui qui classe la sévérité d'une installation. Et c'est lui qui commande les obligations de contrôle. Pour la suite, voyez la capsule sur le contrôle d'étanchéité.",
          verifier: [
            "**La formule générale « charge × PRP » n'est écrite nulle part dans le fonds** (seul l'exemple du R-404A y figure). L'énoncer ainsi est-il exact et suffisant — et à quel écran du cursus la formule complète (unités, /1000) doit-elle être enseignée ?",
          ],
          codes: ["2.02"]
        }
      ]
    }
  }
});
