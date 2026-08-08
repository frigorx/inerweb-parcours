/* =====================================================================
   familles-et-prp.js — « Familles et PRP : pourquoi les fluides changent »
   ---------------------------------------------------------------------
   Redécoupage du fonds : familles-fluides.svg, prp-echelle.svg,
   frise-vivante (l'histoire), frise-histoire.svg.

   RÈGLE TENUE — zéro invention. Mise à jour du 08/08 au soir (doctrine
   § 2) : les 7 points « à vérifier » sont soldés — statut R-22 exact,
   PRP = PRG = GWP sur 100 ans, valeurs sourcées « annexe du règlement
   (UE) 2024/573 », R-1234yf PRP < 1 (0,501), PFAS nuancé, Kigali (2016),
   F-Gas III (2024), vie courte des HFO liée à l'insaturation. Les seuils
   chiffrés restent enseignés dans la capsule « controle-etancheite »
   (renvoi posé) pour éviter le doublon.
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
        "**Trois atomes donnent le fil de l'histoire** : le chlore détruit l'ozone ; le fluor **contribue** à rendre la molécule stable — donc durable dans l'atmosphère, où elle fait effet de serre ; l'hydrogène **tend à raccourcir** sa vie. Mais c'est la molécule entière qui décide, pas un atome seul.",
        "Les **HFO** cassent vite pour une autre raison : leur molécule est [[insaturée|elle contient une double liaison entre deux atomes de carbone — un point fragile, que l'air attaque en quelques jours]].",
        "**Il n'y a pas de fluide parfait : il n'y a que des compromis maîtrisés.** Toute la suite tient dans cette phrase."
      ],
      lu: "CFC, HCFC, HFC, HFO, et les fluides naturels : cinq familles, et une histoire qui se lit de gauche à droite. Chaque famille corrige le défaut de la précédente, et en révèle un nouveau. Trois atomes donnent le fil de l'histoire. Le chlore détruit l'ozone. Le fluor contribue à rendre la molécule stable, donc durable dans l'atmosphère, où elle fait effet de serre. L'hydrogène tend à raccourcir sa vie dans l'air. Mais c'est la molécule entière qui décide, pas un atome seul. Les HFO, par exemple, cassent vite pour une autre raison : leur molécule porte une double liaison, un point fragile que l'air attaque en quelques jours. Retenez surtout la conclusion : il n'y a pas de fluide parfait. Il n'y a que des compromis maîtrisés.",
      voixPerimee: true,
      plus: ["trois-atomes"],
      codes: ["2.01"]
    },

    {
      id: "02-les-interdits",
      titre: "CFC et HCFC : le chlore les a condamnés.",
      planche: "planches/interdits-cfc-hcfc.svg",
      texte: [
        "Les **CFC** (le R-12) : les « miracles » des années 1930 — stables, ni toxiques ni inflammables… **et tueurs d'ozone**. Interdits depuis longtemps.",
        "Les **HCFC** (le R-22) : la transition. Un peu d'hydrogène, moins de chlore, vie plus courte — **mais du chlore quand même**.",
        "Le statut exact du R-22 : **mise sur le marché et recharge interdites ; récupération obligatoire.** Une machine au R-22 peut **continuer de tourner sans appoint** — on ne la recharge plus.",
        "Vous croiserez encore ces machines en dépannage : savoir leur statut, c'est savoir ce que vous avez le droit d'y faire."
      ],
      lu: "Les deux premières familles sont condamnées, et c'est le chlore qui l'a fait. Les CFC, comme le R douze, étaient les miracles des années mille neuf cent trente : stables, ni toxiques, ni inflammables… et tueurs d'ozone. Interdits depuis longtemps. Les HCFC, comme le R vingt-deux, ont fait la transition : un peu d'hydrogène, moins de chlore, une vie plus courte. Mais du chlore quand même. Retenez le statut exact du R vingt-deux : mise sur le marché et recharge interdites, récupération obligatoire. Une machine au R vingt-deux peut continuer de tourner sans appoint, mais on ne la recharge plus. Vous croiserez encore ces machines en dépannage. Savoir leur statut, c'est savoir ce que vous avez le droit d'y faire.",
      voixPerimee: true,
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
        "D'où leur statut : **en réduction**. C'est la réduction progressive des quotas du règlement F-Gas, et l'amendement de Kigali."
      ],
      lu: "Troisième famille : les HFC, comme le R cent trente-quatre a ou le R trente-deux. Zéro chlore : l'ozone est sauvé. Leur potentiel de destruction de l'ozone, l'O D P, est nul. Mais leur PRP est fort : ils réchauffent le climat des centaines à des milliers de fois plus que le CO2, kilo pour kilo. D'où leur statut actuel : en réduction. C'est la réduction progressive des quotas du règlement F-Gas, et l'amendement de Kigali.",
      plus: ["histoire-climat"],
      codes: ["2.01"]
    },

    {
      id: "04-le-prp",
      titre: "Le PRP : un kilogramme n'égale pas un kilogramme.",
      planche: "planches/familles-et-prp_prp-echelle.svg",
      texte: [
        "Le **PRP**, c'est l'effet de serre d'**1 kg de fluide**, comparé à **1 kg de CO₂** — l'étalon, PRP = 1.",
        "**PRP, PRG, [[GWP|le sigle anglais de la même grandeur — c'est lui que vous verrez sur beaucoup de documents]] : trois noms pour la même grandeur**, comptée sur **100 ans**.",
        "L'échelle parle d'elle-même : CO₂ **1** · R-32 **675** · R-410A **2088** · R-404A **3922** — valeurs de l'**annexe du règlement (UE) 2024/573**.",
        "Conséquence : **fuir 1 kg de R-404A ≈ relâcher 3,9 tonnes équivalent CO₂.**",
        "*En intervention, le PRP ne se devine pas : il se lit sur la fiche du fluide.*"
      ],
      lu: "Voici l'outil de mesure de toute cette histoire : le PRP. C'est l'effet de serre d'un kilogramme de fluide, comparé à un kilogramme de CO2, qui sert d'étalon avec un PRP de un. Trois noms circulent pour cette même grandeur : PRP, PRG, et son sigle anglais que vous verrez sur beaucoup de documents. Elle se compte toujours sur cent ans. Regardez l'échelle. Le CO2 : un. Le R trente-deux : six cent soixante-quinze. Le R quatre cent dix A : deux mille quatre-vingt-huit. Le R quatre cent quatre A : trois mille neuf cent vingt-deux. Ce sont les valeurs de l'annexe du règlement européen de deux mille vingt-quatre. La conséquence est concrète : fuir un kilogramme de R quatre cent quatre A, c'est relâcher environ trois virgule neuf tonnes équivalent CO2. Et retenez ce réflexe : en intervention, le PRP ne se devine pas. Il se lit sur la fiche du fluide.",
      voixPerimee: true,
      plus: ["teqco2"],
      codes: ["2.02"]
    },

    {
      id: "05-les-autorises",
      titre: "HFO et naturels : des alternatives possibles — chacun son revers.",
      planche: "planches/autorises-hfo-naturels.svg",
      texte: [
        "Les **HFO** (R-1234yf) : une **double liaison C = C** qui casse en quelques jours dans l'air — **PRP inférieur à 1** (0,501 dans l'annexe du règlement (UE) 2024/573). Souvent A2L.",
        "La question [[PFAS|le sigle des substances per- et polyfluoroalkylées : des composés fluorés très persistants dans l'environnement]] : certains fluorés et leurs produits de dégradation sont **au cœur d'un débat réglementaire** — un dossier à suivre, pas un verdict.",
        "Les **naturels** : R-290 et R-600a (propane, isobutane), R-717 (ammoniac), R-744 (CO₂). **PRP minuscule.**",
        "Ce sont des **alternatives possibles** — selon l'application, l'équipement et le calendrier. Et **chacun son revers : A3, B2L ou haute pression.** Le fluide qui ne réchauffe pas le climat vous demande, à vous, davantage de métier."
      ],
      lu: "Restent deux familles qui offrent des alternatives possibles, selon l'application, l'équipement et le calendrier. Les HFO, comme le R mille deux cent trente-quatre igrec èf : leur double liaison casse en quelques jours dans l'air, d'où un PRP inférieur à un — zéro virgule cinq cent un dans l'annexe du règlement européen. Ils sont souvent classés A deux L. Et la question des PFAS ? Certains fluorés et leurs produits de dégradation sont au cœur d'un débat réglementaire. C'est un dossier à suivre, pas un verdict. Puis les fluides naturels : le R deux cent quatre-vingt-dix et le R six cents a, propane et isobutane ; le R sept cent dix-sept, l'ammoniac ; le R sept cent quarante-quatre, le CO2. Leur PRP est minuscule. Mais chacun a son revers : A trois, B deux L, ou haute pression. Le fluide qui ne réchauffe pas le climat vous demande, à vous, davantage de métier.",
      voixPerimee: true,
      codes: ["2.01"]
    },

    {
      id: "06-la-regle",
      titre: "Ce que la règle en fait — et ce que ça vous demande.",
      planche: "planches/prp-regle-serre.svg",
      texte: [
        "Le règlement **F-Gas III (UE) 2024/573**, adopté en **2024**, accélère la baisse des [[quotas|les quantités maximales de HFC que les producteurs ont le droit de mettre sur le marché chaque année — elles diminuent d'année en année]] de HFC et programme **l'interdiction** de certains fluides à fort PRP dans de nombreux équipements neufs.",
        "L'amendement de **Kigali (2016)** fait la même chose à l'échelle mondiale.",
        "Les **seuils chiffrés** — à partir de quelle charge on contrôle, à quelle fréquence — se travaillent dans la capsule du **contrôle d'étanchéité** : c'est là qu'ils servent.",
        "La chaîne est simple : **plus le PRP est fort, plus la règle serre.** Et la conclusion de toute la frise : **il n'existe pas de fluide parfait. Il existe des professionnels bien formés.**"
      ],
      lu: "Terminons par ce que la règle en fait. Le règlement F-Gas trois, adopté en deux mille vingt-quatre, accélère la baisse des quotas de HFC mis sur le marché, et programme l'interdiction de certains fluides à fort PRP dans de nombreux équipements neufs. L'amendement de Kigali, adopté en deux mille seize, fait la même chose à l'échelle mondiale. Les seuils chiffrés, à partir de quelle charge on contrôle et à quelle fréquence, vous les travaillerez dans la capsule sur le contrôle d'étanchéité : c'est là qu'ils servent. La chaîne est simple : plus le PRP est fort, plus la règle serre. Et la conclusion de toute cette histoire tient en deux phrases : il n'existe pas de fluide parfait. Il existe des professionnels bien formés.",
      voixPerimee: true,
      renvoi: { sujet: "controle-etancheite", libelle: "Les seuils et les fréquences : « Le contrôle d'étanchéité »" },
      codes: ["2.01"]
    }
  ],

  retenir: [
    "**Cinq familles** : CFC et HCFC **condamnés par le chlore** (R-22 : plus de recharge, récupération obligatoire) · HFC **en réduction** (PRP fort) · HFO et naturels : **des alternatives possibles**, chacun son revers.",
    "Le **PRP** — même grandeur que **PRG** et **GWP**, comptée sur **100 ans** — compare 1 kg de fluide à 1 kg de CO₂ ; l'étalon, PRP = 1.",
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
            "**Le fluor (F)** : il **contribue** à rendre la molécule **stable** — et une molécule stable qui absorbe la chaleur fait un **gaz à effet de serre durable**. Mais la stabilité ne tient pas au fluor seul : c'est la molécule entière qui la fait.",
            "**L'hydrogène (H)** : il **tend à donner** une vie plus courte à la molécule, qui se détruit dans l'air avant de s'accumuler.",
            "**Le cas des HFO** : leur vie très courte vient surtout de leur **double liaison C = C** — une molécule [[insaturée|elle contient une double liaison entre deux atomes de carbone, un point fragile que l'air attaque vite]], que l'air casse en quelques jours.",
            "Lisez une famille comme un dosage de ces trois-là — en gardant la nuance : c'est la molécule entière qui décide."
          ],
          lu: "Un rôle par atome. Le chlore : une fois monté dans la stratosphère, il détruit l'ozone. C'est lui qui a condamné les CFC et les HCFC. Le fluor : il contribue à rendre la molécule stable. Et une molécule stable qui absorbe la chaleur devient un gaz à effet de serre durable. Mais la stabilité ne tient pas au fluor seul : c'est la molécule entière qui la fait. L'hydrogène : il tend à donner une vie plus courte à la molécule, qui se détruit dans l'air avant de s'accumuler. Et le cas des HFO : leur vie très courte vient surtout de leur double liaison, un point fragile que l'air casse en quelques jours. Lisez chaque famille comme un dosage de ces trois atomes, en gardant la nuance : c'est la molécule entière qui décide.",
          voixPerimee: true,
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
            "**Années 1990** — pour remplacer CFC et HCFC, l'industrie adopte massivement les **HFC**. L'ozone est sauvé… mais **beaucoup d'entre eux** ont un pouvoir de réchauffement **des centaines à des milliers de fois** celui du CO₂.",
            "**2015** — l'**accord de Paris** fixe le cap : contenir le réchauffement bien en dessous de 2 degrés. Le froid est scruté comme tout le monde.",
            "**2016** — l'**amendement de Kigali** intègre les HFC au protocole de Montréal : réduction mondiale programmée.",
            "**2024** — le **règlement F-Gas III (UE) 2024/573** accélère les quotas et programme des interdictions dans le neuf."
          ],
          lu: "Le problème résolu d'un côté en a créé un de l'autre. Dans les années mille neuf cent quatre-vingt-dix, pour remplacer les CFC et les HCFC, l'industrie adopte massivement les HFC. La couche d'ozone est sauvée. Mais beaucoup de ces fluides ont un pouvoir de réchauffement des centaines à des milliers de fois supérieur à celui du CO2. Deux mille quinze : l'accord de Paris fixe le cap, contenir le réchauffement bien en dessous de deux degrés. Deux mille seize : l'amendement de Kigali intègre officiellement les HFC au protocole de Montréal, avec un calendrier mondial de réduction. Et deux mille vingt-quatre : le règlement F-Gas trois accélère la baisse des quotas, et programme des interdictions dans les équipements neufs.",
          voixPerimee: true,
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
            "La règle, avec ses unités à chaque étape : **masse fuie (en kg) × PRP = kilogrammes équivalent CO₂** — puis **÷ 1000** pour passer en **tonnes équivalent CO₂ (t éq. CO₂)**.",
            "L'exemple de la planche : **1 kg de R-404A × 3922 = 3922 kg éq. CO₂ ≈ 3,9 t éq. CO₂.**",
            "Ce chiffre en « tonnes équivalent CO₂ » est celui que la réglementation regarde : c'est lui qui **classe la sévérité** d'une installation.",
            "C'est aussi lui qui commande les obligations de contrôle — voyez la capsule **« Le contrôle d'étanchéité »**."
          ],
          lu: "Voici la règle, avec ses unités à chaque étape. La masse fuie, en kilogrammes, multipliée par le PRP, donne des kilogrammes équivalent CO2. On divise ensuite par mille pour passer en tonnes équivalent CO2. Reprenons l'exemple de la planche. Un kilogramme de R quatre cent quatre A, multiplié par trois mille neuf cent vingt-deux, donne trois mille neuf cent vingt-deux kilogrammes équivalent CO2, soit environ trois virgule neuf tonnes. Ce chiffre en tonnes équivalent CO2 est celui que la réglementation regarde : c'est lui qui classe la sévérité d'une installation. Et c'est lui qui commande les obligations de contrôle. Pour la suite, voyez la capsule sur le contrôle d'étanchéité.",
          voixPerimee: true,
          renvoi: { sujet: "controle-etancheite", libelle: "Le contrôle d'étanchéité" },
          codes: ["2.02"]
        }
      ]
    }
  }
});
