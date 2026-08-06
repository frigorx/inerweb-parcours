/* =====================================================================
   la-recuperation.js — « Récupérer le fluide : le geste et la règle »
   ---------------------------------------------------------------------
   Redécoupage du fonds : recuperation.svg, secu-bouteille.svg,
   pesee-charge.svg, mission-bouteilles.

   POURQUOI CE SUJET FERME LA MAQUETTE
   C'est le geste où se rejoignent la technique, la sécurité et le droit :
   une purge à l'atmosphère est à la fois une faute professionnelle, un
   danger et une infraction. Le fil tient donc les trois ensemble, sans
   les séparer — parce que c'est ainsi qu'ils se présentent sur un
   chantier.
   ===================================================================== */
CAPSULE({
  id: "la-recuperation",
  ordre: 7,
  titre: "Récupérer le fluide : le geste et la règle",
  question: "Où va le fluide quand on vide une machine ?",
  niveau: "examen",
  minutes: 7,
  suppose: "A1, A2L, A3 : lire l'étiquette",
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
      verifier: [
        "**La nature exacte de la sanction** en cas de rejet volontaire. Faut-il la citer aux stagiaires, et sous quelle forme ?",
      ],
      codes: ["4.04"]
    },

    {
      id: "02-c-est-quoi",
      titre: "Récupérer, c'est transférer — pas détruire.",
      texte: [
        "Le fluide passe du circuit vers une **bouteille de récupération**, au moyen d'un **groupe de récupération**.",
        "Il n'est ni détruit ni transformé : il est **mis de côté**, pour être ensuite réemployé, retraité, ou éliminé par une filière.",
        "La bouteille de récupération n'est **pas** une bouteille de charge : elle est **identifiée comme telle**, et elle a sa propre vie."
      ],
      lu: "Voyons maintenant ce que veut dire récupérer. Le fluide passe du circuit vers une bouteille de récupération, au moyen d'un groupe de récupération. Il n'est ni détruit ni transformé : il est simplement mis de côté, pour être ensuite réemployé, retraité, ou éliminé par une filière agréée. Et retenez ceci : une bouteille de récupération n'est pas une bouteille de charge. Elle est identifiée comme telle, et elle a sa propre vie.",
      plus: ["recycle-regenere"],
      codes: ["4.04"]
    },

    {
      id: "03-jamais-melanger",
      titre: "Jamais deux fluides dans la même bouteille.",
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
      texte: [
        "Le liquide se **dilate** quand la température monte. Une bouteille pleine de liquide n'a **plus de place** pour cette dilatation.",
        "La pression monte alors très vite — un camion au soleil suffit — et l'on va vers l'**éclatement**.",
        "D'où le **taux de remplissage** à ne jamais dépasser : il laisse volontairement un **ciel de vapeur** au-dessus du liquide.",
        "**On ne remplit donc pas au jugé : on pèse.** La balance n'est pas un accessoire de confort."
      ],
      lu: "Passons à un point de sécurité pure. Une bouteille ne se remplit jamais à ras bord, et voici pourquoi. Le liquide se dilate quand la température monte. Or une bouteille entièrement pleine de liquide n'a plus aucune place pour cette dilatation. La pression y monte alors très vite, un camion resté au soleil suffit, et l'on va droit vers l'éclatement. D'où le taux de remplissage à ne jamais dépasser : il laisse volontairement un ciel de vapeur au-dessus du liquide. Et cela veut dire qu'on ne remplit pas au jugé : on pèse. La balance n'est pas un accessoire de confort.",
      verifier: [
        "🔴 **LE TAUX DE REMPLISSAGE MAXIMAL.** Quelle valeur enseignez-vous, et dépend-elle du fluide ou du type de bouteille ?",
        "**La tare de la bouteille** : où se lit-elle, et faut-il apprendre à la retrouver ?",
      ],
      plus: ["peser"],
      codes: ["4.04", "2.02"]
    },

    {
      id: "05-comment",
      titre: "Le geste : liquide d'abord, vapeur ensuite.",
      texte: [
        "On récupère d'abord **en phase liquide** : c'est beaucoup plus rapide, et la plus grande partie de la charge y passe.",
        "On termine **en phase vapeur**, pour aller chercher ce qui reste.",
        "**On surveille la bouteille pendant tout le transfert** — pesée et pression — et on s'arrête au taux, pas quand le circuit est vide.",
        "*S'il faut une deuxième bouteille, on en prend une deuxième. On ne « force » jamais la première.*"
      ],
      lu: "Voyons le geste lui-même. On récupère d'abord en phase liquide : c'est beaucoup plus rapide, et la plus grande partie de la charge y passe. Puis on termine en phase vapeur, pour aller chercher ce qui reste dans le circuit. Pendant tout le transfert, on surveille la bouteille : sa pesée et sa pression. Et on s'arrête au taux de remplissage, pas quand le circuit est vide. S'il faut une deuxième bouteille, eh bien on en prend une deuxième. On ne force jamais la première.",
      verifier: [
        "🔴 **L'ordre liquide puis vapeur** comme méthode enseignée. À confirmer, et faut-il détailler le branchement ?",
      ],
      plus: ["peser", "et-apres"],
      codes: ["4.04", "3.05"]
    },

    {
      id: "06-la-trace",
      titre: "Et on écrit : quoi, combien, d'où, vers où.",
      texte: [
        "**Quel fluide**, **quelle masse**, **de quelle machine**, **vers quelle bouteille**.",
        "Cette écriture n'est pas de la paperasse : c'est ce qui permet de **suivre la matière**, du circuit jusqu'à sa destination finale.",
        "Le fluide récupéré reste **sous votre responsabilité** tant qu'il n'est pas remis à qui de droit.",
        "**Une bouteille sans étiquette et sans écrit est un problème que vous laissez au suivant.**"
      ],
      lu: "Terminons par la trace. On écrit quel fluide, quelle masse, de quelle machine il vient, et vers quelle bouteille il va. Cette écriture n'est pas de la paperasse : c'est ce qui permet de suivre la matière, depuis le circuit jusqu'à sa destination finale. Et sachez que le fluide récupéré reste sous votre responsabilité tant qu'il n'a pas été remis à qui de droit. Une bouteille sans étiquette et sans écrit, c'est un problème que vous laissez au suivant.",
      plus: ["et-apres"],
      codes: ["4.03", "4.04"]
    }
  ],

  retenir: [
    "**Le rejet à l'atmosphère est interdit et sanctionné.**",
    "Récupérer, c'est **transférer** vers une bouteille de récupération identifiée.",
    "**Une bouteille = un fluide.** Jamais de mélange.",
    "**On ne dépasse jamais le taux de remplissage** — on pèse, on ne juge pas à l'œil.",
    "**Liquide d'abord, vapeur ensuite**, et on écrit ce qu'on a fait."
  ],

  detours: {

    "recycle-regenere": {
      question: "Récupéré, recyclé, régénéré : ce n'est pas pareil ?",
      ecrans: [
        {
          id: "d-mots-1",
          titre: "Trois mots, trois niveaux de traitement.",
          texte: [
            "**Récupéré** — sorti d'une machine et mis en bouteille. On n'a **rien fait d'autre**.",
            "**Recyclé** — nettoyé sommairement sur site ou en atelier : filtration, séchage. Il reste **du même niveau** qu'avant.",
            "**Régénéré** — retraité en usine jusqu'à retrouver les **caractéristiques d'un fluide neuf**, avec un contrôle à la clé.",
            "**Ce qui compte en pratique** : régénéré et recyclé **s'achètent** auprès d'une filière. On ne les produit pas dans son camion."
          ],
          lu: "Trois mots que l'on confond souvent, et qui désignent trois niveaux de traitement bien distincts. Récupéré : le fluide a été sorti d'une machine et mis en bouteille, et on n'a rien fait d'autre. Recyclé : il a été nettoyé sommairement, sur site ou en atelier, par filtration et séchage, mais il reste du même niveau qu'avant. Régénéré : il a été retraité en usine jusqu'à retrouver les caractéristiques d'un fluide neuf, avec un contrôle à la clé. Et voici ce qui compte en pratique : le régénéré et le recyclé s'achètent auprès d'une filière. On ne les produit pas dans son camion.",
          verifier: [
            "🔴 **Les définitions de récupéré / recyclé / régénéré.** À caler sur la terminologie réglementaire exacte.",
            "**« Le régénéré s'achète, il ne se produit pas en interne »** — règle de la maison. À confirmer comme message aux stagiaires.",
          ],
          codes: ["4.04"]
        },
        {
          id: "d-mots-2",
          titre: "Et le fluide qu'on remet dans SA machine ?",
          texte: [
            "Un fluide récupéré sur une machine et **remis dans la même machine**, lors de la même intervention, n'a pas besoin d'être retraité.",
            "**Il n'a pas changé de propriétaire ni de circuit** : on le conserve par origine, on le remet.",
            "En revanche, dès qu'il **change de machine**, on ne peut plus faire ça : il faut passer par la filière.",
            "*C'est le cas le plus fréquent en atelier — et celui qu'on explique le plus mal.*"
          ],
          lu: "Voici un cas très fréquent, et souvent mal expliqué. Un fluide récupéré sur une machine, puis remis dans cette même machine au cours de la même intervention, n'a pas besoin d'être retraité. Il n'a changé ni de propriétaire ni de circuit : on le conserve par origine, et on le remet. En revanche, dès qu'il change de machine, on ne peut plus procéder ainsi : il faut passer par la filière.",
          verifier: [
            "🔴 **Le réemploi sur SA propre machine sans retraitement.** Règle appliquée dans nos outils — à confirmer comme enseignable telle quelle.",
          ],
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
          titre: "Vers une filière, avec son papier.",
          texte: [
            "Une bouteille de récupération pleine **n'est pas un déchet ordinaire** : elle part vers un **repreneur** ou un **centre de traitement** identifié.",
            "Elle voyage **étiquetée** : fluide, masse, provenance. Une bouteille anonyme est refusée — ou pire, acceptée et mélangée.",
            "Le **bordereau** qui l'accompagne ferme la boucle : il prouve que le fluide sorti d'une machine est bien arrivé quelque part.",
            "**Tant que ce papier n'existe pas, la traçabilité est incomplète** — et c'est vous qui la portez."
          ],
          lu: "Une bouteille de récupération pleine n'est pas un déchet ordinaire. Elle part vers un repreneur, ou vers un centre de traitement identifié. Elle voyage étiquetée : le fluide, la masse, la provenance. Car une bouteille anonyme est refusée, ou pire, acceptée et mélangée avec autre chose. Le bordereau qui l'accompagne ferme la boucle : il prouve que le fluide sorti d'une machine est bien arrivé quelque part. Et tant que ce papier n'existe pas, la traçabilité reste incomplète. Or c'est vous qui la portez.",
          verifier: [
            "**Le document exact qui accompagne une bouteille de récupération** (nom, mentions obligatoires, qui le conserve). À préciser.",
          ],
          codes: ["4.03", "4.04"]
        }
      ]
    }
  }
});
