/* =====================================================================
   la-recuperation.js — « Récupérer le fluide : le geste et la règle »
   ---------------------------------------------------------------------
   Redécoupage du fonds : recuperation.svg, secu-bouteille.svg,
   pesee-charge.svg, mission-bouteilles.
   Refonte 08/08/2026 : doctrine DOCTRINE-REFONTE-2026-08-08.md
   (§ 0.1 texte maître d-mots-2, § 2 la-recuperation, § 3 doublons).

   POURQUOI CE SUJET FERME LA MAQUETTE
   C'est le geste où se rejoignent la technique, la sécurité et le droit :
   une purge à l'atmosphère est à la fois une faute professionnelle, un
   danger et une infraction. Le fil tient donc les trois ensemble, sans
   les séparer — parce que c'est ainsi qu'ils se présentent sur un
   chantier.
   ===================================================================== */
CAPSULE({
  id: "la-recuperation",
  ordre: 9,
  titre: "Récupérer le fluide : le geste et la règle",
  question: "Où va le fluide quand on vide une machine ?",
  niveau: "examen",
  minutes: 7,
  suppose: "Les bouteilles : choisir, peser, ne jamais gaver",
  voixFabriquee: true,   /* Henri + Denise, 06/08/2026 */

  fil: [
    {
      id: "01-jamais-atmosphere",
      titre: "On ne relâche jamais. Ce n'est pas une consigne : c'est la loi.",
      planche: "../fonds-origine/packs/fluides/res/svg/recuperation.svg",
      texte: [
        "Ouvrir un circuit et laisser partir le fluide dans l'air est **interdit**, et c'est **sanctionné**.",
        "Ce n'est pas une question de bonne volonté ni de conscience écologique : c'est un **fait juridique**.",
        "**Toute** intervention qui ouvre le circuit commence donc par la même question : *où va le fluide qui est dedans ?*"
      ],
      lu: "Commençons par le point qui ne se négocie pas. Ouvrir un circuit et laisser partir le fluide dans l'air est interdit, et c'est sanctionné. Ce n'est pas une question de bonne volonté, ni de conscience écologique personnelle : c'est un fait juridique. Toute intervention qui ouvre le circuit commence donc par la même question, toujours la même : où va le fluide qui est dedans ?",
      codes: ["4.04"]
    },

    {
      id: "02-c-est-quoi",
      titre: "Récupérer, c'est transférer — pas détruire.",
      planche: "planches/la-recuperation_transfert.svg",
      texte: [
        "Le fluide passe du circuit vers une **bouteille de récupération**, au moyen d'un **groupe de récupération**.",
        "C'est le sens réglementaire du mot : **récupérer, c'est collecter le fluide et le stocker** — rien de plus.",
        "Il n'est ni détruit ni transformé : il est **mis de côté**, pour être ensuite réemployé, retraité, ou éliminé par une filière.",
        "La bouteille de récupération n'est **pas** une bouteille de charge : elle est **identifiée comme telle**, et elle a sa propre vie."
      ],
      lu: "Voyons maintenant ce que veut dire récupérer. Le fluide passe du circuit vers une bouteille de récupération, au moyen d'un groupe de récupération. C'est d'ailleurs le sens réglementaire du mot : récupérer, c'est collecter le fluide et le stocker, rien de plus. Il n'est ni détruit ni transformé : il est simplement mis de côté, pour être ensuite réemployé, retraité, ou éliminé par une filière. Et retenez ceci : une bouteille de récupération n'est pas une bouteille de charge. Elle est identifiée comme telle, et elle a sa propre vie.",
      voixPerimee: true,
      plus: ["recycle-regenere"],
      codes: ["4.04"]
    },

    {
      id: "03-jamais-melanger",
      titre: "Jamais deux fluides dans la même bouteille.",
      planche: "planches/la-recuperation_une-bouteille-un-fluide.svg",
      texte: [
        "Un mélange de deux fluides récupérés **n'est plus rien d'identifiable**. Il ne peut plus être réemployé, et son retraitement coûte cher.",
        "**Une bouteille = un fluide.** On le vérifie avant de brancher, pas après.",
        "Un doute sur ce qu'elle contient ? **On ne complète pas.** On prend une autre bouteille.",
        "*Le mélange accidentel est l'une des fautes les plus coûteuses du métier — et l'une des plus faciles à éviter.*"
      ],
      lu: "Voici la règle qui coûte le plus cher quand on l'oublie. Jamais deux fluides dans la même bouteille. Un mélange de deux fluides récupérés n'est plus rien d'identifiable : il ne peut plus être réemployé, et son retraitement coûte très cher. Une bouteille égale un fluide, et on le vérifie avant de brancher, pas après. Vous avez un doute sur ce qu'elle contient ? Alors vous ne complétez pas : vous prenez une autre bouteille. Le mélange accidentel est l'une des fautes les plus coûteuses du métier, et l'une des plus faciles à éviter.",
      codes: ["4.04"]
    },

    {
      id: "04-taux-remplissage",
      titre: "Une bouteille ne se remplit jamais à ras bord.",
      planche: "../fonds-origine/packs/fluides/res/svg/secu-bouteille.svg",
      alt: "Bouteille de récupération : jamais remplie à ras bord, jamais chauffée.",
      texte: [
        "Rappel : le liquide se **dilate** quand la température monte. On laisse donc un **ciel de vapeur** au-dessus, et l'on s'arrête au **taux de remplissage** — jamais à ras bord.",
        "**On ne remplit pas au jugé : on pèse.** [[Tare|la masse de la bouteille vide, gravée sur elle]], volume en eau, masse maximale : c'est la **plaque de la bouteille** qui commande."
      ],
      lu: "Rappel rapide, car tout le détail est dans la capsule sur les bouteilles. Le liquide se dilate quand la température monte : on laisse donc un ciel de vapeur au-dessus, et l'on s'arrête au taux de remplissage, jamais à ras bord. Et l'on ne remplit pas au jugé : on pèse. Tare, volume en eau, masse maximale : c'est la plaque de la bouteille qui commande.",
      voixPerimee: true,
      renvoi: { sujet: "les-bouteilles", libelle: "Tout le détail : « Les bouteilles : choisir, peser, ne jamais gaver »" },
      plus: ["peser"],
      codes: ["4.04", "2.02"]
    },

    {
      id: "05-comment",
      titre: "Le geste : liquide d'abord, vapeur ensuite.",
      planche: "planches/la-recuperation_liquide-vapeur.svg",
      texte: [
        "On récupère d'abord **en phase liquide** : c'est beaucoup plus rapide, et la plus grande partie de la charge y passe.",
        "On termine **en phase vapeur**, pour aller chercher ce qui reste.",
        "C'est la **procédure courante** — pas une loi universelle : la station de récupération et **sa notice** commandent l'ordre exact et les branchements.",
        "**On surveille la bouteille pendant tout le transfert** — pesée et pression — et on s'arrête au taux, pas quand le circuit est vide.",
        "*S'il faut une deuxième bouteille, on en prend une deuxième. On ne « force » jamais la première.*"
      ],
      lu: "Voyons le geste lui-même. On récupère d'abord en phase liquide : c'est beaucoup plus rapide, et la plus grande partie de la charge y passe. Puis on termine en phase vapeur, pour aller chercher ce qui reste dans le circuit. C'est la procédure courante, pas une loi universelle : la station de récupération et sa notice commandent l'ordre exact et les branchements. Pendant tout le transfert, on surveille la bouteille : sa pesée et sa pression. Et on s'arrête au taux de remplissage, pas quand le circuit est vide. S'il faut une deuxième bouteille, eh bien on en prend une deuxième. On ne force jamais la première.",
      voixPerimee: true,
      verifier: [
        "Décision plateau attendue : jusqu'où détailler le branchement de la station de récupération — selon le matériel réel du plateau et sa notice.",
      ],
      plus: ["peser", "et-apres"],
      codes: ["4.04", "3.05"]
    },

    {
      id: "06-la-trace",
      titre: "Et on écrit : quoi, combien, d'où, vers où.",
      planche: "planches/la-recuperation_la-trace.svg",
      texte: [
        "**Quel fluide**, **quelle masse**, **de quelle machine**, **vers quelle bouteille** — et **par qui**, **quel jour**.",
        "Cette écriture n'est pas de la paperasse : c'est ce qui permet de **suivre la matière**, du circuit jusqu'à sa destination finale.",
        "Le fluide récupéré reste **sous votre responsabilité** tant qu'il n'est pas remis à qui de droit.",
        "**Une bouteille sans étiquette et sans écrit est un problème que vous laissez au suivant.**"
      ],
      lu: "Terminons par la trace. On écrit quel fluide, quelle masse, de quelle machine il vient, vers quelle bouteille il va, et aussi qui l'a fait, et quel jour. Cette écriture n'est pas de la paperasse : c'est ce qui permet de suivre la matière, depuis le circuit jusqu'à sa destination finale. Et sachez que le fluide récupéré reste sous votre responsabilité tant qu'il n'a pas été remis à qui de droit. Une bouteille sans étiquette et sans écrit, c'est un problème que vous laissez au suivant.",
      voixPerimee: true,
      plus: ["et-apres"],
      codes: ["4.03", "4.04"]
    }
  ],

  retenir: [
    "**Le rejet à l'atmosphère est interdit et sanctionné.**",
    "Récupérer, c'est **collecter et stocker** : transférer vers une bouteille de récupération identifiée.",
    "**Une bouteille = un fluide.** Jamais de mélange.",
    "**On ne dépasse jamais le taux de remplissage** — on pèse, et la plaque de la bouteille commande.",
    "**Liquide d'abord, vapeur ensuite** — l'ordre courant, la notice de la station commande — et on écrit ce qu'on a fait."
  ],

  detours: {

    "recycle-regenere": {
      question: "Récupéré, recyclé, régénéré : ce n'est pas pareil ?",
      ecrans: [
        {
          id: "d-mots-1",
          titre: "Trois mots, trois niveaux de traitement.",
          planche: "planches/la-recuperation_trois-mots.svg",
          texte: [
            "**Récupéré** — collecté à la sortie d'une machine et stocké en bouteille. On n'a **rien fait d'autre**.",
            "**Recyclé** — nettoyage de base : filtration, séchage. Il reste **du même niveau** qu'avant.",
            "**Régénéré** — retraité en **centre spécialisé** jusqu'à une **qualité équivalente au fluide neuf**, avec un contrôle à la clé.",
            "Ce fluide régénéré **revient sur le marché** comme un produit contrôlé."
          ],
          lu: "Trois mots que l'on confond souvent, et qui désignent trois niveaux de traitement bien distincts. Récupéré : le fluide a été collecté à la sortie d'une machine et stocké en bouteille, et on n'a rien fait d'autre. Recyclé : il a reçu un nettoyage de base, filtration et séchage, mais il reste du même niveau qu'avant. Régénéré : il a été retraité en centre spécialisé jusqu'à une qualité équivalente au fluide neuf, avec un contrôle à la clé. Et ce fluide régénéré revient sur le marché comme un produit contrôlé.",
          voixPerimee: true,
          codes: ["4.04"]
        },
        {
          id: "d-mots-2",
          titre: "Et le fluide qu'on remet dans SA machine ?",
          planche: "planches/la-recuperation_retour-machine.svg",
          texte: [
            "Le fluide que vous venez de récupérer **peut retourner dans sa machine** — celle d'où il sort — si ce fluide est **encore autorisé à l'entretien**. C'est le geste courant : on vide pour intervenir, on remet la même matière au même endroit.",
            "**Sauf si le fluide est sous restriction.** Le R-404A ([[PRP|potentiel de réchauffement planétaire : l'effet de serre d'un kilogramme de fluide, comparé au CO₂]] 3922) et les autres fluides à **PRP ≥ 2500** ne peuvent plus servir à l'entretien : récupérés, ils **ne retournent pas dans le circuit** — ils partent en filière, avec leur papier.",
            "Le réflexe : **avant de remettre, vérifier le statut du fluide.** L'étiquette et la documentation du fluide le disent."
          ],
          lu: "Voici un cas très fréquent, et la règle est plus simple qu'on ne le croit. Le fluide que vous venez de récupérer peut retourner dans sa machine, celle d'où il sort, si ce fluide est encore autorisé à l'entretien. C'est le geste courant : on vide pour intervenir, on remet la même matière au même endroit. Sauf si le fluide est sous restriction. Le R quatre cent quatre A, dont le potentiel de réchauffement vaut trois mille neuf cent vingt-deux, et les autres fluides dont le P R P atteint ou dépasse deux mille cinq cents, ne peuvent plus servir à l'entretien. Récupérés, ils ne retournent pas dans le circuit : ils partent en filière, avec leur papier. D'où le réflexe : avant de remettre, vérifier le statut du fluide. L'étiquette et la documentation du fluide le disent.",
          voixPerimee: true,
          codes: ["4.04"]
        }
      ]
    },

    "peser": {
      question: "Peser : quelle balance, et comment ne pas se tromper ?",
      ecrans: [
        {
          id: "d-peser-1",
          titre: "La balance décide. Pas le manomètre, pas l'oreille.",
          planche: "../fonds-origine/packs/fluides/res/svg/pesee-charge.svg",
          texte: [
            "On pèse **la bouteille**, pas le fluide : la masse lue comprend la bouteille elle-même, sa **tare**.",
            "**Masse de fluide = masse totale − tare.** La tare est gravée sur la bouteille.",
            "On pose la balance **à plat et au calme** : un flexible tendu ou un pied de travers fausse la lecture de plusieurs centaines de grammes.",
            "**On note la valeur de départ** avant de commencer. Sinon on ne saura pas combien on a transféré."
          ],
          lu: "Quatre points, et ils suffisent. Premièrement, on pèse la bouteille, et non le fluide : la masse lue comprend la bouteille elle-même, ce qu'on appelle sa tare. Deuxièmement, la masse de fluide vaut donc la masse totale moins la tare, et cette tare est gravée sur la bouteille. Troisièmement, on pose la balance à plat et au calme : un flexible tendu, ou un pied de travers, fausse la lecture de plusieurs centaines de grammes. Et quatrièmement, on note la valeur de départ avant de commencer. Sans elle, vous ne saurez pas combien vous avez transféré.",
          codes: ["3.05"]
        }
      ]
    },

    "et-apres": {
      question: "La bouteille pleine : elle part où ?",
      ecrans: [
        {
          id: "d-apres-1",
          titre: "Vers une filière, avec ses papiers.",
          planche: "planches/la-recuperation_deux-papiers.svg",
          texte: [
            "Une bouteille de récupération pleine **n'est pas un déchet ordinaire** : elle part vers un **repreneur** ou un **centre de traitement** identifié.",
            "Elle voyage **étiquetée** : fluide, masse, provenance. Une bouteille anonyme est refusée — ou pire, acceptée et mélangée.",
            "**Deux papiers, deux rôles.** La **fiche d'intervention** — le **CERFA 15497** — trace l'intervention : quel équipement, quel fluide, quelles quantités.",
            "Quand le fluide récupéré prend le **statut de déchet**, il voyage avec un [[BSFF|bordereau de suivi de déchets de fluides frigorigènes]] **dématérialisé**, sur la plateforme **Trackdéchets** : c'est lui qui prouve que le fluide est bien arrivé en filière.",
            "**Tant que ces papiers n'existent pas, la traçabilité est incomplète** — et c'est vous qui la portez."
          ],
          lu: "Une bouteille de récupération pleine n'est pas un déchet ordinaire. Elle part vers un repreneur, ou vers un centre de traitement identifié. Elle voyage étiquetée : le fluide, la masse, la provenance. Car une bouteille anonyme est refusée, ou pire, acceptée et mélangée avec autre chose. Retenez qu'il y a deux papiers, pour deux rôles. La fiche d'intervention, le CERFA quinze mille quatre cent quatre-vingt-dix-sept, trace l'intervention : quel équipement, quel fluide, quelles quantités. Et quand le fluide récupéré prend le statut de déchet, il voyage avec un bordereau de suivi dématérialisé, sur la plateforme Trackdéchets : c'est lui qui prouve que le fluide est bien arrivé en filière. Tant que ces papiers n'existent pas, la traçabilité reste incomplète. Or c'est vous qui la portez.",
          voixPerimee: true,
          codes: ["4.03", "4.04"]
        }
      ]
    }
  }
});
