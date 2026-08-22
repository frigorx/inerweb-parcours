(function () {
  "use strict";

  var sources = {
    types: {
      title: "Les types de régulation froid — support professeur",
      location: "03_BAC-MFER/S4-Electricite/Les types de régulation froid  prof.docx",
      use: "commande directe, électrovanne, protection minimum, pump-down automatique et tirage au vide unique"
    },
    pumpdown: {
      title: "Ressources Activité 9 — Pump Down",
      location: "02_CAP-IFCA/C4-MettreEnService/Ressources Activité 9 - Pump Down.pdf",
      use: "séquence du tirage au vide automatique et rôle du relais dans le single pump-down"
    },
    single: {
      title: "6.1 Électricité — régulation single pump-down",
      location: "02_CAP-IFCA/C4-MettreEnService/6.1 Electricité (régulation single pump down).pdf",
      use: "schéma de commande, relais KA1, auto-maintien et temporisation"
    },
    improved: {
      title: "Épreuve EP2 CAP VAF 2016 et annexe 3",
      location: "02_CAP-IFCA/C1-Communiquer/Epreuve EP2 CAP VAF 2016.pdf",
      use: "tirage au vide unique amélioré, BP de régulation distinct du BP de sécurité et signalisation du défaut"
    },
    defrost: {
      title: "Les dégivrages",
      location: "03_BAC-MFER/S2-Systemes/Les_degivrages.pdf",
      use: "dégivrage naturel, électrique, par gaz chauds et par inversion de cycle"
    },
    natural: {
      title: "6.1 Électricité — dégivrage naturel",
      location: "03_BAC-MFER/S2-Systemes/6.1 Electricité (dégivrage naturel).pdf",
      use: "trois niveaux : arrêt naturel, horloge, puis fin de dégivrage sur température"
    },
    electric: {
      title: "6.2 et 6.3 Électricité — pump-down avec dégivrage électrique",
      location: "02_CAP-IFCA/C4-MettreEnService/6.2 et 6.3 Electricité",
      use: "relais de dégivrage, fin de dégivrage, résistances et temporisations"
    },
    hotgas: {
      title: "3 Électricité — dégivrages par gaz chauds",
      location: "03_BAC-MFER/S2-Systemes/3 Electricité (dégivrages par gaz chauds).pdf",
      use: "piquage refoulement, électrovanne, clapet, fin de dégivrage et risque de retour liquide"
    },
    givre: {
      title: "Planche inerWeb — Le givre étouffe l’échange",
      location: "pilote-fluides/packs/fluides/res/svg/givre-degivrage.svg",
      use: "effet du givre, échange d’air, écoulement et contrôle de fin de dégivrage"
    }
  };

  window.REGULES_CATALOG = {
    id: "les-regules",
    title: "Les régules",
    subtitle: "COMMANDER LE FROID · ORGANISER LE DÉGIVRAGE",
    version: "2026-08-22b",
    status: "Version en ligne — relecture métier en cours",
    sources: sources,
    modules: [
      {
        id: "commande-directe-thermostat",
        number: 1,
        family: "Commander le froid",
        title: "La commande directe",
        shortTitle: "Thermostat direct",
        promise: "Voir le thermostat alimenter directement le compresseur, comme sur un froid ménager très simple.",
        sourceKeys: ["types"],
        lessons: [
          {
            id: "qui-commande",
            short: "Commande",
            kicker: "Écran 1 · Point de départ",
            title: "Le thermostat commande le compresseur",
            lead: "La température agit directement sur la marche ou l’arrêt du compresseur.",
            details: [
              "La consigne atteinte ouvre le thermostat : le compresseur s’arrête.",
              "La température remonte : le thermostat se referme et le compresseur repart."
            ],
            box: { type: "key", label: "La clé", text: "Une seule chaîne : température → thermostat → compresseur." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel de la commande directe du compresseur par thermostat",
              title: "Commande directe",
              rungs: [
                { label: "Production de froid", contacts: [{ code: "B1", label: "Thermostat" }], coil: { code: "KM1", label: "Compresseur" } }
              ]
            }
          },
          {
            id: "cycle",
            short: "Cycle",
            kicker: "Écran 2 · Marche et arrêt",
            title: "Le cycle suit seulement la température",
            lead: "L’élève peut réciter le cycle sans parler de pression.",
            details: [
              "Demande de froid : le contact se ferme, le compresseur tourne.",
              "Consigne atteinte : le contact s’ouvre, le compresseur s’arrête."
            ],
            box: { type: "exam", label: "À vérifier", text: "Le différentiel du thermostat évite des marches et arrêts trop rapprochés." },
            visual: {
              kind: "sequence",
              label: "Séquence manuelle de la commande directe",
              steps: ["La température remonte", "B1 se ferme", "KM1 est alimenté", "Le compresseur produit du froid", "La consigne est atteinte", "B1 ouvre et KM1 retombe"]
            }
          },
          {
            id: "limite",
            short: "Limite",
            kicker: "Écran 3 · Ce qui manque",
            title: "Ici, aucune sécurité n’est représentée",
            lead: "Ce schéma sert à comprendre la régulation la plus simple, pas à câbler une installation professionnelle.",
            details: [
              "Une surpression ou une basse pression anormale n’est pas détectée par ce montage pédagogique.",
              "La station suivante ajoute une chaîne minimale et une électrovanne."
            ],
            box: { type: "warning", label: "Le piège", text: "Simple ne veut pas dire acceptable partout : le matériel réel et sa notice imposent les protections." },
            visual: {
              kind: "compare",
              label: "Comparaison entre fonction présente et protections absentes",
              cards: [
                { state: "ok", title: "PRÉSENT", text: "Régulation de température" },
                { state: "danger", title: "ABSENT DU SCHÉMA", text: "Sécurité HP" },
                { state: "danger", title: "ABSENT DU SCHÉMA", text: "Sécurité BP" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Dans cette commande directe, quel organe décide la marche du compresseur ?", options: ["Le thermostat", "L’électrovanne", "Le pressostat HP"], correct: 0, why: "Le thermostat alimente directement la commande du compresseur." },
          { prompt: "Que se passe-t-il quand la consigne est atteinte ?", options: ["Le compresseur accélère", "Le thermostat ouvre et le compresseur s’arrête", "La pression HP commande seule"], correct: 1, why: "L’arrêt vient de l’ouverture du thermostat." },
          { prompt: "Que montre volontairement ce premier schéma ?", options: ["Une installation complète", "Un pump-down", "La fonction la plus simple, sans sécurité représentée"], correct: 2, why: "La station isole la commande de température pour poser le vocabulaire." },
          { prompt: "Pourquoi faut-il lire la notice du matériel réel ?", options: ["Pour supprimer le thermostat", "Pour choisir les protections et réglages applicables", "Pour remplacer le compresseur par une vanne"], correct: 1, why: "Les protections et réglages dépendent de l’installation réelle." }
        ]
      },
      {
        id: "protection-minimum-serie",
        number: 2,
        family: "Commander le froid",
        title: "La protection minimum",
        shortTitle: "Tout en série",
        promise: "Comprendre pourquoi le thermostat et les pressostats arrêtent ensemble le compresseur et l’électrovanne.",
        sourceKeys: ["types"],
        lessons: [
          {
            id: "serie",
            short: "Série",
            kicker: "Écran 1 · Chaîne commune",
            title: "Tout passe par la même autorisation",
            lead: "Thermostat et pressostats forment une chaîne en série avant la commande.",
            details: [
              "Si un seul contact ouvre, la bobine du contacteur retombe.",
              "Un contact auxiliaire de KM1 coupe alors aussi l’électrovanne Y1."
            ],
            box: { type: "key", label: "La clé", text: "Commande ou sécurité : toute ouverture arrête le froid et ferme la ligne liquide." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel de la protection minimum avec contacts en série",
              title: "Chaîne en série",
              rungs: [
                { label: "Compresseur", contacts: [{ code: "HP", label: "Sécurité" }, { code: "BP", label: "Sécurité" }, { code: "B1", label: "Thermostat" }], coil: { code: "KM1", label: "Compresseur" } },
                { label: "Ligne liquide", contacts: [{ code: "KM1", label: "Auxiliaire" }], coil: { code: "Y1", label: "Électrovanne" } }
              ]
            }
          },
          {
            id: "arret",
            short: "Arrêt",
            kicker: "Écran 2 · Même résultat",
            title: "Thermostat ou pressostat : les deux charges tombent",
            lead: "La cause change, mais le résultat électrique reste le même.",
            details: [
              "À la consigne, B1 ouvre : KM1 retombe, puis Y1 se ferme.",
              "Sur défaut de pression, le pressostat ouvre : KM1 et Y1 retombent également."
            ],
            box: { type: "exam", label: "À lire", text: "Le schéma ne distingue pas encore l’arrêt de régulation de l’arrêt de sécurité dans la séquence fluidique." },
            visual: {
              kind: "sequence",
              label: "Séquence d’arrêt commune par thermostat ou pressostat",
              steps: ["Un contact ouvre", "KM1 n’est plus alimenté", "Le compresseur s’arrête", "Le contact auxiliaire KM1 ouvre", "Y1 ferme la ligne liquide"]
            }
          },
          {
            id: "pas-pumpdown",
            short: "Limite",
            kicker: "Écran 3 · Différence essentielle",
            title: "Ce montage n’est pas un pump-down",
            lead: "Le compresseur et l’électrovanne s’arrêtent pratiquement ensemble.",
            details: [
              "Le compresseur ne continue pas à aspirer après la fermeture de Y1.",
              "L’évaporateur n’est donc pas vidé par une séquence dédiée."
            ],
            box: { type: "warning", label: "Le piège", text: "La présence d’une électrovanne ne suffit pas à prouver qu’il y a pump-down." },
            visual: {
              kind: "compare",
              label: "Comparaison entre protection minimum et pump-down",
              cards: [
                { state: "wait", title: "PROTECTION MINIMUM", text: "Y1 et KM1 s’arrêtent ensemble" },
                { state: "ok", title: "PUMP-DOWN", text: "Y1 ferme avant l’arrêt de KM1" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Dans une chaîne en série, que provoque l’ouverture d’un seul contact ?", options: ["Aucun effet", "L’arrêt de la bobine située après la chaîne", "L’ouverture du détendeur"], correct: 1, why: "Une seule ouverture interrompt toute la chaîne." },
          { prompt: "Pourquoi Y1 se ferme-t-elle quand KM1 retombe ?", options: ["Elle lit la pression", "Elle devient un thermostat", "Elle est commandée par un auxiliaire de KM1"], correct: 2, why: "Le contact auxiliaire suit l’état du contacteur." },
          { prompt: "Pourquoi ce montage n’est-il pas un pump-down ?", options: ["Le compresseur ne poursuit pas l’aspiration après la fermeture de Y1", "Il n’a pas de compresseur", "Il utilise un thermostat"], correct: 0, why: "Le décalage entre fermeture de Y1 et arrêt compresseur fait la séquence pump-down." },
          { prompt: "Un pressostat ouvre. Que doit faire la chaîne montrée ?", options: ["Maintenir Y1 ouverte", "Démarrer les résistances", "Arrêter KM1 et fermer Y1"], correct: 2, why: "La protection minimum arrête la production de froid et ferme la ligne liquide." }
        ]
      },
      {
        id: "pump-down-automatique",
        number: 3,
        family: "Commander le froid",
        title: "Le pump-down automatique",
        shortTitle: "Pump-down",
        promise: "Séparer la demande de froid et l’arrêt compresseur pour vider l’évaporateur à chaque arrêt.",
        sourceKeys: ["types", "pumpdown"],
        lessons: [
          {
            id: "deux-commandes",
            short: "Deux voies",
            kicker: "Écran 1 · Architecture",
            title: "Le thermostat commande Y1, la BP commande KM1",
            lead: "Les deux charges ne s’arrêtent plus au même instant.",
            details: [
              "B1 ouvre et ferme l’électrovanne de ligne liquide.",
              "Le pressostat BP de régulation arrête et redémarre le compresseur selon la pression d’aspiration."
            ],
            box: { type: "key", label: "La clé", text: "Thermostat → Y1 ; pressostat BP de régulation → KM1." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel du pump-down automatique en deux voies",
              title: "Deux commandes séparées",
              rungs: [
                { label: "Ligne liquide", contacts: [{ code: "B1", label: "Thermostat" }], coil: { code: "Y1", label: "Électrovanne" } },
                { label: "Compresseur", contacts: [{ code: "HP", label: "Sécurité" }, { code: "BP", label: "Régulation" }], coil: { code: "KM1", label: "Compresseur" } }
              ]
            }
          },
          {
            id: "tirage",
            short: "Tirage",
            kicker: "Écran 2 · Arrêt en température",
            title: "Y1 ferme avant que KM1 s’arrête",
            lead: "Le compresseur continue à aspirer le fluide restant côté évaporateur.",
            details: [
              "La BP diminue après la fermeture de la ligne liquide.",
              "Au seuil réglé pour l’installation, le pressostat BP ouvre et arrête KM1."
            ],
            box: { type: "exam", label: "À réciter", text: "Consigne → Y1 ferme → KM1 continue → BP baisse → pressostat ouvre → KM1 s’arrête." },
            visual: {
              kind: "sequence",
              label: "Séquence manuelle d’un arrêt par pump-down automatique",
              steps: ["La consigne est atteinte", "B1 ouvre", "Y1 ferme", "KM1 continue d’aspirer", "La BP diminue", "Le BP de régulation ouvre", "KM1 s’arrête"]
            }
          },
          {
            id: "court-cycle",
            short: "Défaut",
            kicker: "Écran 3 · Limite du classique",
            title: "Une remontée de BP peut relancer KM1",
            lead: "Une Y1 fuyarde ou une remontée de pression peut refermer le pressostat BP à l’arrêt.",
            details: [
              "Le compresseur redémarre alors sans nouvelle demande du thermostat.",
              "Il aspire quelques instants, recoupe en BP, puis peut recommencer : c’est le court cycle à rechercher."
            ],
            box: { type: "warning", label: "Le piège", text: "Le pressostat BP de la boucle est un organe de régulation à réenclenchement automatique, pas la sécurité BP." },
            visual: {
              kind: "compare",
              label: "Différence entre arrêt stable et court cycle du pump-down automatique",
              cards: [
                { state: "ok", title: "ARRÊT STABLE", text: "BP reste basse, KM1 reste arrêté" },
                { state: "danger", title: "COURT CYCLE", text: "BP remonte, KM1 repart sans demande" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Dans le pump-down automatique, que commande le thermostat ?", options: ["KM1 directement", "Le pressostat HP", "Y1, l’électrovanne"], correct: 2, why: "La demande de température agit sur la ligne liquide." },
          { prompt: "Pourquoi KM1 continue-t-il après la fermeture de Y1 ?", options: ["Pour vider le côté évaporateur", "Pour chauffer la chambre", "Pour ouvrir le détendeur"], correct: 0, why: "Il abaisse la BP jusqu’à l’ouverture du pressostat de régulation." },
          { prompt: "Qu’est-ce qui arrête finalement KM1 ?", options: ["Le voyant", "Le pressostat BP de régulation", "Le ventilateur"], correct: 1, why: "L’arrêt compresseur vient de la baisse de pression mesurée par le BP de régulation." },
          { prompt: "Quel défaut peut provoquer des courts cycles à l’arrêt ?", options: ["Une Y1 fuyarde", "Un titre trop long", "Une consigne écrite en degrés"], correct: 0, why: "Une fuite de la ligne liquide peut faire remonter la BP et réenclencher le pressostat." }
        ]
      },
      {
        id: "pump-down-ameliore",
        number: 4,
        family: "Commander le froid",
        title: "Le pump-down amélioré",
        shortTitle: "Anti-court cycle",
        promise: "Ajouter un relais de mémoire pour empêcher un redémarrage parasite hors demande de froid.",
        sourceKeys: ["types", "pumpdown", "single"],
        lessons: [
          {
            id: "memoire",
            short: "Mémoire",
            kicker: "Écran 1 · Relais KA",
            title: "Le relais mémorise la demande de froid",
            lead: "Le thermostat n’autorise la séquence que lorsqu’il existe une vraie demande.",
            details: [
              "KA s’enclenche avec la demande et autorise Y1 ainsi que le démarrage.",
              "À la consigne, KA retombe ; KM1 finit le tirage au vide grâce à son maintien, puis s’arrête."
            ],
            box: { type: "key", label: "La clé", text: "Après l’arrêt en BP, une remontée de pression ne suffit plus : la mémoire de demande est tombée." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel du pump-down amélioré avec relais de mémoire",
              title: "Relais de demande",
              rungs: [
                { label: "Mémoire de demande", contacts: [{ code: "B1", label: "Thermostat" }], coil: { code: "KA", label: "Relais" } },
                { label: "Ligne liquide", contacts: [{ code: "KA", label: "Autorisation" }], coil: { code: "Y1", label: "Électrovanne" } },
                { label: "Compresseur", contacts: [{ code: "BP", label: "Régulation" }, { code: "KA/KM1", label: "Maintien" }], coil: { code: "KM1", label: "Compresseur" } }
              ]
            }
          },
          {
            id: "un-cycle",
            short: "Séquence",
            kicker: "Écran 2 · Arrêt stable",
            title: "Le tirage se termine une fois",
            lead: "La fermeture de Y1 lance la baisse de BP ; le maintien ne sert que jusqu’à l’arrêt.",
            details: [
              "Quand le BP ouvre, KM1 retombe et son maintien disparaît.",
              "Le BP peut ensuite se refermer : KM1 reste arrêté tant que B1 n’a pas rappelé KA."
            ],
            box: { type: "exam", label: "Vocabulaire local", text: "Les supports locaux nomment aussi cette logique « pump-down unique » ou « single pump-down »." },
            visual: {
              kind: "sequence",
              label: "Séquence du pump-down avec anti-redémarrage parasite",
              steps: ["B1 demande le froid", "KA autorise Y1", "KM1 démarre sur BP", "B1 atteint la consigne", "KA et Y1 retombent", "KM1 finit le tirage", "BP ouvre, KM1 retombe", "Une BP parasite ne suffit plus à repartir"]
            }
          },
          {
            id: "preuve",
            short: "Diagnostic",
            kicker: "Écran 3 · Ce qu’il faut contrôler",
            title: "Le relais doit vraiment couper l’autorisation",
            lead: "Le mot « amélioré » ne se prouve pas à la présence d’un relais dans l’armoire.",
            details: [
              "Lire quels contacts KA autorisent Y1 et KM1.",
              "Simuler une remontée de BP après l’arrêt et vérifier que KM1 ne repart pas sans demande."
            ],
            box: { type: "warning", label: "Le piège", text: "Un relais câblé autrement peut assurer une autre fonction : toujours suivre les conducteurs et les repères." },
            visual: {
              kind: "compare",
              label: "Comparaison du résultat attendu avec une erreur de câblage",
              cards: [
                { state: "ok", title: "ATTENDU", text: "BP remonte, KM1 reste arrêté" },
                { state: "danger", title: "À REVOIR", text: "BP remonte, KM1 redémarre hors demande" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Quel organe mémorise la demande de froid ?", options: ["Le relais KA", "Le voyant H1", "Le moteur ventilateur"], correct: 0, why: "KA porte l’autorisation liée au thermostat." },
          { prompt: "Pourquoi KM1 peut-il finir le tirage après la retombée de KA ?", options: ["Grâce au voyant", "Grâce à son circuit de maintien", "Parce que Y1 reste ouverte"], correct: 1, why: "Le maintien conserve KM1 uniquement jusqu’à l’ouverture du BP." },
          { prompt: "Après l’arrêt, la BP remonte sans demande. Que doit faire KM1 ?", options: ["Redémarrer", "Inverser le cycle", "Rester arrêté"], correct: 2, why: "La mémoire de demande est tombée, donc la BP seule ne suffit pas." },
          { prompt: "Comment prouver la fonction du relais ?", options: ["Regarder sa couleur", "Lire le câblage et tester la séquence", "Compter ses vis uniquement"], correct: 1, why: "La fonction vient des contacts réellement utilisés et de leur séquence." }
        ]
      },
      {
        id: "pump-down-unique",
        number: 5,
        family: "Commander le froid",
        title: "Le pump-down unique",
        shortTitle: "Unique + sécurité",
        promise: "Distinguer le BP de régulation du BP de sécurité dans la variante unique améliorée.",
        sourceKeys: ["single", "improved"],
        lessons: [
          {
            id: "deux-bp",
            short: "Deux BP",
            kicker: "Écran 1 · Réguler ou protéger",
            title: "Deux pressostats BP, deux missions",
            lead: "Le BP de régulation termine normalement le tirage ; le BP de sécurité traite la pression anormalement basse.",
            details: [
              "Le BP de régulation travaille à chaque cycle et se réenclenche automatiquement.",
              "Le BP de sécurité appartient à la chaîne de défaut et peut imposer un arrêt durable avec signalisation."
            ],
            box: { type: "key", label: "La clé", text: "Ne jamais déduire la fonction d’un pressostat de sa seule position : lire repère, contact et réarmement." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel du pump-down unique avec BP de régulation et BP de sécurité distincts",
              title: "Régulation séparée de la sécurité",
              rungs: [
                { label: "Autorisation générale", contacts: [{ code: "HP", label: "Sécurité" }, { code: "BP-S", label: "Sécurité" }, { code: "KA1", label: "Marche maintenue" }], coil: { code: "KA1", label: "Sécurité" } },
                { label: "Demande de froid", contacts: [{ code: "B1", label: "Thermostat" }, { code: "KA1", label: "Autorisation" }], coil: { code: "KA2", label: "Tirage" } },
                { label: "Compresseur", contacts: [{ code: "BP-R", label: "Régulation" }, { code: "KA2/KM1", label: "Maintien" }], coil: { code: "KM1", label: "Compresseur" } },
                { label: "Signal défaut", contacts: [{ code: "BP-S", label: "Contact défaut" }], coil: { code: "H6", label: "Défaut BP" } }
              ]
            }
          },
          {
            id: "fuite",
            short: "Fuite",
            kicker: "Écran 2 · Cas anormal",
            title: "Une fuite ne doit pas devenir une suite de courts cycles",
            lead: "La variante améliorée laisse la sécurité BP arrêter définitivement la commande quand la pression devient anormale.",
            details: [
              "La boucle de régulation ne doit pas masquer la perte de fluide.",
              "La signalisation oriente le diagnostic ; elle ne remplace ni la recherche de fuite ni la remise en service réglementaire."
            ],
            box: { type: "warning", label: "Sécurité", text: "Aucun shunt n’est réalisé en intervention réelle sans procédure, schéma et autorisation adaptés." },
            visual: {
              kind: "sequence",
              label: "Séquence de défaut basse pression sur pump-down unique amélioré",
              steps: ["La pression devient anormalement basse", "La régulation ne suffit plus à expliquer l’état", "BP-S ouvre la chaîne", "KA1 retombe", "KM1 reste arrêté", "H6 signale le défaut", "Le technicien recherche la cause"]
            }
          },
          {
            id: "nom",
            short: "Nom",
            kicker: "Écran 3 · Repère de vocabulaire",
            title: "Le nom varie, le schéma tranche",
            lead: "Les supports locaux emploient « single pump-down », « tirage au vide unique » et « unique amélioré ».",
            details: [
              "Cette station retient le titre court demandé : pump-down unique.",
              "La présence d’un BP de sécurité distinct est écrite explicitement pour éviter toute confusion avec la station précédente."
            ],
            box: { type: "exam", label: "Méthode", text: "Nommer les organes, suivre les contacts, puis raconter l’ordre des états." },
            visual: {
              kind: "compare",
              label: "Comparaison des deux niveaux de pump-down à relais",
              cards: [
                { state: "wait", title: "RELAIS DE DEMANDE", text: "Bloque le redémarrage parasite" },
                { state: "ok", title: "+ BP SÉCURITÉ", text: "Traite et signale la basse pression anormale" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Quel pressostat termine le tirage au vide normal ?", options: ["Le BP de sécurité", "Le BP de régulation", "Le HP de sécurité"], correct: 1, why: "Le BP de régulation travaille dans la séquence normale." },
          { prompt: "Quel organe traite la basse pression anormale ?", options: ["Le thermostat d’ambiance", "Le ventilateur", "Le BP de sécurité"], correct: 2, why: "La sécurité BP est distincte de la régulation." },
          { prompt: "Pourquoi prévoir une signalisation H6 ?", options: ["Pour indiquer le défaut BP", "Pour chauffer l’évaporateur", "Pour ouvrir Y1"], correct: 0, why: "Le voyant rend visible l’arrêt dû à la chaîne BP de sécurité." },
          { prompt: "Face à un nom de montage ambigu, quelle méthode est fiable ?", options: ["Deviner d’après l’année", "Choisir le nom le plus long", "Suivre le schéma et raconter la séquence"], correct: 2, why: "Les fonctions viennent du câblage et de l’ordre des états." }
        ]
      },
      {
        id: "sans-degivrage-commande",
        number: 6,
        family: "Organiser le dégivrage",
        title: "Sans dégivrage commandé",
        shortTitle: "Aucun cycle dédié",
        promise: "Comprendre qu’une installation peut ne pas posséder de cycle de dégivrage dédié, sans conclure qu’elle ne fond jamais de givre.",
        sourceKeys: ["defrost", "natural", "givre"],
        lessons: [
          {
            id: "constat",
            short: "Constat",
            kicker: "Écran 1 · Aucun organe dédié",
            title: "Il n’y a ni horloge ni apport de chaleur",
            lead: "La production de froid s’arrête seulement quand la température atteint la consigne.",
            details: [
              "Pendant cet arrêt, un évaporateur en température positive peut se réchauffer au contact de l’air.",
              "Cette fonte éventuelle dépend du temps d’arrêt, de l’humidité et du régime réel."
            ],
            box: { type: "key", label: "La clé", text: "Pas de dégivrage commandé ne veut pas dire : aucune fonte possible." },
            visual: {
              kind: "circuit",
              mode: "offcycle",
              label: "Circuit frigorifique arrêté sans cycle de dégivrage commandé"
            }
          },
          {
            id: "limites",
            short: "Limites",
            kicker: "Écran 2 · Conditions",
            title: "Le givre décide si cette simplicité suffit",
            lead: "Une batterie chargée de givre échange moins bien et laisse moins passer l’air.",
            details: [
              "Contrôler les ailettes, le débit d’air et l’écoulement des condensats.",
              "Si les arrêts naturels sont trop courts, un cycle commandé devient nécessaire selon le projet."
            ],
            box: { type: "warning", label: "Le piège", text: "Ne pas copier une fréquence de dégivrage d’une autre installation : la charge, les ouvertures et l’humidité changent." },
            visual: {
              kind: "compare",
              label: "Comparaison d’une batterie libre et d’une batterie prise en givre",
              cards: [
                { state: "ok", title: "ÉCHANGE LIBRE", text: "Air traversant, écoulement dégagé" },
                { state: "danger", title: "GIVRE", text: "Air freiné, puissance réduite" }
              ]
            }
          },
          {
            id: "decision",
            short: "Décider",
            kicker: "Écran 3 · Contrôle terrain",
            title: "On observe avant d’ajouter une régulation",
            lead: "Le besoin se prouve par l’état de la batterie et l’histoire des cycles.",
            details: [
              "Relever quand le givre apparaît, si les arrêts permettent sa fonte et si l’eau s’évacue.",
              "Comparer ces constats au cahier des charges et à la notice du matériel."
            ],
            box: { type: "exam", label: "Prochain contrôle", text: "Regarder l’évaporateur et le chronogramme réel, pas seulement le paramètre affiché." },
            visual: {
              kind: "sequence",
              label: "Méthode de décision avant ajout d’un dégivrage commandé",
              steps: ["Observer le givre", "Vérifier le débit d’air", "Contrôler l’écoulement", "Lire les temps de marche et d’arrêt", "Comparer à la notice", "Choisir ou non un cycle dédié"]
            }
          }
        ],
        quiz: [
          { prompt: "Sans cycle dédié, quand une fonte peut-elle se produire ?", options: ["Uniquement pendant la marche du compresseur", "Jamais", "Pendant un arrêt si l’air et la température le permettent"], correct: 2, why: "Un arrêt naturel peut réchauffer une batterie positive." },
          { prompt: "Quel signe montre qu’il faut réexaminer la stratégie ?", options: ["Une batterie qui se charge de givre", "Un titre bleu", "Un voyant éteint au repos"], correct: 0, why: "Le givre qui persiste réduit l’échange et le débit d’air." },
          { prompt: "Quelle donnée faut-il éviter de copier aveuglément ?", options: ["Le repère du thermostat du même schéma", "La fréquence de dégivrage d’une autre installation", "Le sens de lecture"], correct: 1, why: "La fréquence dépend des conditions réelles et des prescriptions." },
          { prompt: "Quel est le premier geste de diagnostic ?", options: ["Observer batterie, air et écoulement", "Changer le compresseur", "Ajouter une résistance au hasard"], correct: 0, why: "Le besoin se fonde sur des observations croisées." }
        ]
      },
      {
        id: "degivrage-naturel",
        number: 7,
        family: "Organiser le dégivrage",
        title: "Le dégivrage naturel",
        shortTitle: "Air + arrêt froid",
        promise: "Utiliser l’air d’une enceinte positive pour dégivrer, d’abord naturellement puis avec une commande dédiée.",
        sourceKeys: ["natural", "defrost"],
        lessons: [
          {
            id: "air",
            short: "Air",
            kicker: "Écran 1 · Sans chaleur ajoutée",
            title: "Le compresseur s’arrête, la ventilation continue",
            lead: "Dans les conditions adaptées, l’air de l’enceinte apporte la chaleur qui fait fondre le givre.",
            details: [
              "Le froid est arrêté pendant que le ventilateur évaporateur maintient la circulation d’air.",
              "Cette technique concerne une application positive prévue pour ce fonctionnement."
            ],
            box: { type: "key", label: "La clé", text: "On coupe la production de froid sans couper nécessairement le brassage d’air." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel du dégivrage naturel avec ventilateur maintenu",
              title: "Deux commandes",
              rungs: [
                { label: "Production de froid", contacts: [{ code: "B1", label: "Thermostat" }, { code: "h1", label: "Autorisation froid" }], coil: { code: "KM1", label: "Compresseur" } },
                { label: "Circulation d’air", contacts: [{ code: "Q", label: "Marche générale" }], coil: { code: "KM2", label: "Ventilateur" } }
              ]
            }
          },
          {
            id: "horloge",
            short: "Horloge",
            kicker: "Écran 2 · Arrêt forcé",
            title: "L’horloge peut imposer le début",
            lead: "Si les arrêts thermostatiques sont trop courts, une commande de dégivrage force périodiquement l’arrêt du froid.",
            details: [
              "Le ventilateur continue à faire circuler l’air sur la batterie.",
              "Le nombre et la durée se règlent pour l’installation, jamais par une valeur universelle."
            ],
            box: { type: "exam", label: "À vérifier", text: "Programmer tient compte de l’usage de la chambre et de la remontée de température admise." },
            visual: {
              kind: "sequence",
              label: "Séquence du dégivrage naturel commandé par horloge",
              steps: ["L’horloge lance le dégivrage", "La production de froid s’arrête", "Le ventilateur continue", "L’air réchauffe la batterie", "Le givre fond", "Le froid est de nouveau autorisé"]
            }
          },
          {
            id: "fin",
            short: "Fin",
            kicker: "Écran 3 · Ne pas chauffer pour rien",
            title: "Une sonde peut terminer le dégivrage plus tôt",
            lead: "L’horloge lance le cycle ; la température de batterie confirme que la fonte est terminée.",
            details: [
              "Le relais de fin de dégivrage rend le froid disponible dès que la condition est atteinte.",
              "Une durée maximale reste une sécurité, pas la preuve que le givre a réellement fondu."
            ],
            box: { type: "warning", label: "Le piège", text: "Finir seulement au temps peut prolonger inutilement la remontée de température." },
            visual: {
              kind: "compare",
              label: "Comparaison de la fin au temps et de la fin sur température de batterie",
              cards: [
                { state: "wait", title: "TEMPS SEUL", text: "Cycle maintenu jusqu’à la durée prévue" },
                { state: "ok", title: "SONDE DE FIN", text: "Fin quand la batterie est dégivrée, avec sécurité maximale" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Quelle est la source de chaleur du dégivrage naturel ?", options: ["L’air de l’enceinte positive", "Une résistance électrique", "Le refoulement compresseur"], correct: 0, why: "Aucun apport de chaleur dédié n’est utilisé." },
          { prompt: "Que fait le ventilateur évaporateur pendant ce principe ?", options: ["Il inverse le cycle", "Il peut continuer à brasser l’air", "Il ferme Y1"], correct: 1, why: "La circulation d’air apporte la chaleur disponible à la batterie." },
          { prompt: "Quel organe peut forcer le début du dégivrage ?", options: ["Le voyant", "Le filtre déshydrateur", "Une horloge ou un régulateur"], correct: 2, why: "La commande périodique impose l’arrêt du froid." },
          { prompt: "Quel avantage apporte une sonde de fin ?", options: ["Augmenter toujours la durée", "Terminer selon l’état thermique de la batterie", "Supprimer l’écoulement"], correct: 1, why: "Elle évite de prolonger le cycle après la fonte." }
        ]
      },
      {
        id: "degivrage-electrique",
        number: 8,
        family: "Organiser le dégivrage",
        title: "Le dégivrage électrique",
        shortTitle: "Résistances",
        promise: "Lire toute la séquence : arrêt froid, résistances, fin, égouttage puis reprise différée des ventilateurs.",
        sourceKeys: ["defrost", "electric", "givre"],
        lessons: [
          {
            id: "organes",
            short: "Organes",
            kicker: "Écran 1 · Apport de chaleur",
            title: "La batterie reçoit des résistances dédiées",
            lead: "Le dégivrage électrique apporte de la chaleur lorsque l’air de la chambre négative ne suffit pas.",
            details: [
              "Les résistances de batterie fondent le givre ; le bac et l’écoulement peuvent aussi être protégés contre le regel.",
              "La sonde de fin de dégivrage mesure l’état thermique de l’évaporateur."
            ],
            box: { type: "key", label: "La clé", text: "Faire fondre ne suffit pas : il faut aussi évacuer l’eau sans qu’elle regèle." },
            visual: {
              kind: "circuit",
              mode: "electric",
              label: "Évaporateur avec résistances de batterie, de bac et d’écoulement"
            }
          },
          {
            id: "chronologie",
            short: "Chronologie",
            kicker: "Écran 2 · Une phase après l’autre",
            title: "Résistances, égouttage, froid, ventilateurs",
            lead: "L’ordre protège les produits et empêche le regel de l’eau sur la batterie.",
            details: [
              "Les ventilateurs s’arrêtent pendant le chauffage pour ne pas souffler l’air chaud dans la chambre.",
              "Ils redémarrent après la reprise du froid, lorsque la batterie est redevenue suffisamment froide."
            ],
            box: { type: "exam", label: "À réciter", text: "Arrêt froid → arrêt ventilateurs → résistances → fin → égouttage → reprise froid → ventilateurs différés." },
            visual: {
              kind: "timeline",
              label: "Chronogramme sans valeur universelle du dégivrage électrique",
              phases: ["Arrêt du froid", "Ventilateurs arrêtés", "Résistances actives", "Fin sur sonde", "Égouttage", "Reprise du froid", "Ventilateurs différés"]
            }
          },
          {
            id: "securites",
            short: "Sécurités",
            kicker: "Écran 3 · Deux fins possibles",
            title: "La sonde termine, le temps maximal protège",
            lead: "La fin normale vient de l’état de la batterie ; une limite de temps traite une sonde ou un cycle défaillant.",
            details: [
              "Une fin trop tôt laisse du givre ; une fin trop tard chauffe inutilement l’enceinte.",
              "Le contrôle porte aussi sur les contacteurs, l’intensité des résistances et l’écoulement."
            ],
            box: { type: "warning", label: "Le piège", text: "Le paramètre de durée n’est pas un diagnostic : vérifier la sonde et le résultat réel sur la batterie." },
            visual: {
              kind: "compare",
              label: "Comparaison entre fin normale sur sonde et sécurité de temps maximal",
              cards: [
                { state: "ok", title: "FIN NORMALE", text: "Sonde de batterie" },
                { state: "wait", title: "GARDE-FOU", text: "Temps maximal" },
                { state: "danger", title: "DÉFAUT", text: "Givre restant ou chauffage prolongé" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "Pourquoi arrêter les ventilateurs pendant les résistances ?", options: ["Pour augmenter la HP", "Pour ne pas souffler l’air chaud vers les produits", "Pour ouvrir le détendeur"], correct: 1, why: "Le chauffage doit rester concentré sur la batterie." },
          { prompt: "À quoi sert l’égouttage ?", options: ["Augmenter le givre", "Redémarrer immédiatement les ventilateurs", "Laisser l’eau s’évacuer avant la reprise du froid"], correct: 2, why: "L’eau doit quitter la batterie avant de pouvoir regeler." },
          { prompt: "Pourquoi retarder les ventilateurs après la reprise ?", options: ["Attendre que la batterie soit froide", "Faire monter la température", "Remplacer la sonde"], correct: 0, why: "On évite de projeter humidité et air chaud dans l’enceinte." },
          { prompt: "Quelle est la fin normale du dégivrage ?", options: ["Toujours le temps maximal", "Le pressostat HP", "La sonde de batterie"], correct: 2, why: "Le temps maximal reste un garde-fou." }
        ]
      },
      {
        id: "degivrage-gaz-chauds",
        number: 9,
        family: "Organiser le dégivrage",
        title: "Le dégivrage par gaz chauds",
        shortTitle: "Gaz chauds",
        promise: "Suivre la dérivation du refoulement vers l’évaporateur sans la confondre avec une inversion de cycle.",
        sourceKeys: ["defrost", "hotgas", "givre"],
        lessons: [
          {
            id: "derive",
            short: "Dérivation",
            kicker: "Écran 1 · Source de chaleur",
            title: "Une partie du refoulement est envoyée vers l’évaporateur",
            lead: "Le gaz chaud cède sa chaleur au givre et se condense partiellement dans la batterie.",
            details: [
              "Une électrovanne ouvre la voie de gaz chauds pendant le dégivrage.",
              "Un clapet et le tracé prévu empêchent les migrations vers les mauvaises branches."
            ],
            box: { type: "key", label: "La clé", text: "C’est un by-pass de refoulement : le circuit complet n’est pas inversé." },
            visual: {
              kind: "circuit",
              mode: "hotgas",
              label: "Circuit frigorifique avec dérivation de gaz chauds du refoulement vers l’évaporateur"
            }
          },
          {
            id: "sequence",
            short: "Séquence",
            kicker: "Écran 2 · Maîtriser les retours",
            title: "Le gaz se condense : le retour liquide doit être géré",
            lead: "Le redémarrage et la ligne d’aspiration doivent protéger le compresseur contre un retour de liquide.",
            details: [
              "Les ventilateurs restent arrêtés pendant le dégivrage.",
              "La fin sur sonde, l’égouttage et les temporisations restent nécessaires."
            ],
            box: { type: "warning", label: "Sécurité", text: "Le tracé, les organes de détente et la protection anti-coup de liquide dépendent de l’architecture constructeur." },
            visual: {
              kind: "sequence",
              label: "Séquence générale d’un dégivrage par gaz chauds",
              steps: ["Début du dégivrage", "Ligne liquide isolée", "Ventilateurs arrêtés", "Voie gaz chauds ouverte", "Le givre fond", "Fin sur sonde", "Voie gaz chauds fermée", "Égouttage", "Retour au froid"]
            }
          },
          {
            id: "diagnostic",
            short: "Diagnostic",
            kicker: "Écran 3 · Lire l’architecture",
            title: "Injection, clapets et source de gaz chaud se contrôlent ensemble",
            lead: "Un seul symptôme ne suffit pas pour conclure.",
            details: [
              "Vérifier l’ouverture de la voie, le sens des clapets, la température de batterie et le retour d’aspiration.",
              "Sur une installation multi-postes, vérifier aussi quelle machine fournit le gaz chaud et l’ordre des dégivrages."
            ],
            box: { type: "exam", label: "Prochain contrôle", text: "Après une batterie qui ne chauffe pas, contrôler d’abord que le gaz chaud atteint réellement la branche visée." },
            visual: {
              kind: "compare",
              label: "Indices croisés du dégivrage par gaz chauds",
              cards: [
                { state: "ok", title: "VOIE OUVERTE", text: "Refoulement chaud vers la batterie" },
                { state: "wait", title: "CLAPETS", text: "Sens et isolement des autres branches" },
                { state: "danger", title: "RETOUR LIQUIDE", text: "Protection et réévaporation à contrôler" }
              ]
            }
          }
        ],
        quiz: [
          { prompt: "D’où vient la chaleur du dégivrage par gaz chauds ?", options: ["De l’air extérieur seulement", "D’une résistance dans tous les cas", "Du refoulement du compresseur"], correct: 2, why: "Le montage dérive des gaz chauds de refoulement." },
          { prompt: "Quel organe automatise la voie de gaz chauds ?", options: ["Une électrovanne dédiée", "Le voyant", "Le filtre à huile"], correct: 0, why: "La vanne s’ouvre pour le dégivrage et se ferme en froid." },
          { prompt: "Pourquoi contrôler le retour vers le compresseur ?", options: ["Le thermostat devient liquide", "Le gaz chaud peut se condenser dans la batterie", "Le ventilateur crée de l’huile"], correct: 1, why: "Le liquide formé doit être géré pour éviter un coup de liquide." },
          { prompt: "Quelle différence avec l’inversion de cycle ?", options: ["Ici on dérive le refoulement sans retourner tout le circuit", "Il n’y en a aucune", "L’inversion utilise toujours des résistances"], correct: 0, why: "Le by-pass de gaz chauds et la vanne 4 voies sont deux architectures différentes." }
        ]
      },
      {
        id: "degivrage-inversion-cycle",
        number: 10,
        family: "Organiser le dégivrage",
        title: "Le dégivrage par inversion de cycle",
        shortTitle: "Inversion de cycle",
        promise: "Voir la vanne 4 voies échanger le rôle des deux batteries pendant le dégivrage.",
        sourceKeys: ["defrost", "givre"],
        lessons: [
          {
            id: "roles",
            short: "Rôles",
            kicker: "Écran 1 · Vanne 4 voies",
            title: "L’évaporateur devient temporairement condenseur",
            lead: "La vanne d’inversion dirige le refoulement vers la batterie à dégivrer.",
            details: [
              "Cette batterie reçoit le gaz chaud et rejette la chaleur dans le givre.",
              "L’autre échangeur devient l’évaporateur du cycle inversé."
            ],
            box: { type: "key", label: "La clé", text: "Inversion de cycle = échange complet des rôles, pas simple piquage de gaz chaud." },
            visual: {
              kind: "circuit",
              mode: "reverse",
              label: "Comparaison du sens de circulation en froid et en inversion de cycle"
            }
          },
          {
            id: "compatibilite",
            short: "Circuit",
            kicker: "Écran 2 · Circulation dans les deux sens",
            title: "La détente et les clapets doivent accepter les deux modes",
            lead: "Une vanne 4 voies seule ne transforme pas un circuit conventionnel en machine réversible.",
            details: [
              "Le circuit de détente doit alimenter correctement l’échangeur qui devient évaporateur.",
              "Les clapets, accumulateurs et régulation sont choisis pour la séquence réelle du constructeur."
            ],
            box: { type: "warning", label: "Le piège", text: "Ne jamais redessiner une inversion en retournant seulement deux flèches : tous les organes traversés comptent." },
            visual: {
              kind: "ladder",
              label: "Schéma fonctionnel simplifié de l’autorisation de la vanne 4 voies",
              title: "Commande d’inversion",
              rungs: [
                { label: "Demande de dégivrage", contacts: [{ code: "RD", label: "Dégivrage" }, { code: "SFD", label: "Fin non atteinte" }], coil: { code: "Y4V", label: "Vanne 4 voies" } },
                { label: "Ventilation", contacts: [{ code: "RD", label: "Interverrouillage" }], coil: { code: "KMV", label: "Ventilateurs arrêtés" } }
              ]
            }
          },
          {
            id: "retour-froid",
            short: "Retour",
            kicker: "Écran 3 · Stabiliser avant de souffler",
            title: "La fin de dégivrage ne termine pas toute la séquence",
            lead: "Après retour de la vanne 4 voies, les pressions et la batterie doivent se stabiliser.",
            details: [
              "La temporisation d’égouttage laisse partir l’eau fondue.",
              "Les ventilateurs redémarrent lorsque la batterie est redevenue suffisamment froide."
            ],
            box: { type: "exam", label: "À réciter", text: "Fin de dégivrage → retour de la vanne → égouttage/stabilisation → froid → ventilateurs différés." },
            visual: {
              kind: "timeline",
              label: "Chronologie du retour au froid après inversion de cycle",
              phases: ["Fin sur sonde", "Vanne 4 voies au repos froid", "Égouttage", "Stabilisation", "Production de froid", "Ventilateurs différés"]
            }
          }
        ],
        quiz: [
          { prompt: "Que devient la batterie intérieure pendant l’inversion ?", options: ["Un condenseur temporaire", "Un filtre", "Un réservoir d’huile"], correct: 0, why: "Elle reçoit le refoulement chaud et cède la chaleur au givre." },
          { prompt: "Quel organe change le sens fonctionnel du cycle ?", options: ["Le voyant liquide", "La vanne 4 voies", "Le pressostat d’huile"], correct: 1, why: "La vanne 4 voies redistribue aspiration et refoulement." },
          { prompt: "Pourquoi la vanne 4 voies ne suffit-elle pas seule ?", options: ["Elle n’a pas de couleur", "Elle remplace le compresseur", "La détente et les clapets doivent fonctionner dans les deux modes"], correct: 2, why: "Toute l’architecture fluidique doit accepter le cycle inversé." },
          { prompt: "Quand redémarrer les ventilateurs ?", options: ["Pendant le chauffage", "Après retour au froid et refroidissement suffisant de la batterie", "Avant la fin sur sonde"], correct: 1, why: "Le délai évite de souffler de l’air chaud et des gouttelettes." }
        ]
      }
    ]
  };

  window.REGULES_CATALOG.modules.forEach(function (module, index, modules) {
    module.nextId = modules[index + 1] ? modules[index + 1].id : "regules-interactif";
    module.nextLabel = modules[index + 1] ? "Station " + modules[index + 1].number + " · " + modules[index + 1].title : "Revenir à la carte des régules";
    module.nextUrl = modules[index + 1] ? "../" + modules[index + 1].id + "/index.html" : "../regules-interactif/index.html";
  });
})();
