(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const rates = [0.75, 0.85, 0.95, 1.05, 1.15, 1.25];
  let rateIndex = 2;
  let current = 0;
  let furthest = 0;
  let voiceEnabled = true;
  let speaking = false;
  let paused = false;
  let autoplay = false;
  let selectedVoice = null;
  let speechRun = 0;
  let quizIndex = 0;
  let score = 0;
  let answered = false;

  try {
    const storedRate = Number(localStorage.getItem("chaleur-rate"));
    const storedIndex = rates.indexOf(storedRate);
    if (storedIndex >= 0) rateIndex = storedIndex;
  } catch (_) {}

  function bestFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = speechSynthesis.getVoices();
    return (
      voices.find((voice) => voice.lang.toLowerCase() === "fr-fr" && /natural|online|neural|google/i.test(voice.name)) ||
      voices.find((voice) => voice.lang.toLowerCase() === "fr-fr") ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("fr")) ||
      voices[0] ||
      null
    );
  }

  function loadVoices() {
    selectedVoice = bestFrenchVoice();
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  const lessons = [
    {
      short: "Observer",
      kicker: "Étape 1 · Partir du quotidien",
      title: "Trois scènes que vous connaissez déjà.",
      text: "Touchez chaque scène. Avant les mots techniques, cherchez simplement qui reçoit l’énergie et ce qui change.",
      speak:
        "Nous partons de zéro, avec trois scènes familières. Un glaçon posé dans une pièce fond parce qu'il reçoit de l'énergie de ce qui l'entoure. Une casserole placée sur une plaque reçoit de l'énergie et l'eau se réchauffe, puis bout. Enfin, de la vapeur qui touche un couvercle froid lui cède de l'énergie et redevient liquide : ce sont les gouttes de buée. Chauffer, c'est transférer de l'énergie vers la matière. Refroidir, c'est lui retirer de l'énergie pour la transmettre ailleurs.",
      render: discoveryMarkup,
    },
    {
      short: "Comparer",
      kicker: "Étape 2 · Température ou énergie ?",
      title: "Une température n’est pas une quantité d’énergie.",
      text: "Faites progresser l’énergie. La petite casserole doit bouillir la première ; la grande n’atteindra son palier qu’après avoir reçu davantage d’énergie.",
      speak:
        "Voici une distinction essentielle. La température indique si un corps est plus chaud ou plus froid. L'énergie transférée est une quantité. Faites avancer le curseur. La petite quantité d'eau se réchauffe plus vite et atteint la première son seuil d'ébullition : les bulles apparaissent, puis sa température reste stable pendant que l'énergie suivante vaporise l'eau. La grande casserole, elle, est encore en train de se réchauffer. Elle ne se mettra à bouillir qu'à la fin, après avoir reçu davantage d'énergie. Les deux repères sous les casseroles rendent cette différence visible. Le frigoriste doit donc suivre à la fois la température, la masse de fluide et l'énergie échangée.",
      voiceSteps: [
        {
          control: "#quantity-slider",
          value: 0,
          text: "La température indique si un corps est plus chaud ou plus froid. L’énergie transférée est une quantité. Les deux casseroles vont recevoir exactement la même progression d’énergie.",
        },
        {
          control: "#quantity-slider",
          value: 60,
          text: "La petite quantité d’eau atteint la première son seuil d’ébullition. Les bulles apparaissent. À partir de ce moment, l’énergie supplémentaire sert surtout à vaporiser l’eau.",
        },
        {
          control: "#quantity-slider",
          value: 82,
          text: "La grande quantité d’eau, elle, est encore en train de se réchauffer. Elle demande davantage d’énergie parce qu’il y a plus de matière.",
        },
        {
          control: "#quantity-slider",
          value: 100,
          text: "La grande casserole finit par bouillir à son tour. Retenez ceci : une même température ne signifie pas une même quantité d’énergie. La masse compte.",
        },
      ],
      render: quantityMarkup,
    },
    {
      short: "Parcourir",
      kicker: "Étape 3 · La première carte du frigoriste",
      title: "La courbe en escalier : du glaçon à la vapeur.",
      text: "Cette courbe est le fil rouge du chapitre. Faites avancer le curseur : le bocal, le thermomètre chiffré et le point orange doivent toujours raconter la même transformation.",
      speak:
        "Faisons le voyage complet de l’eau, à pression atmosphérique, depuis la glace à moins vingt degrés jusqu’à la vapeur. Regardez toujours les trois mêmes informations : ce qu’il y a dans le bocal, la température chiffrée et le point orange sur la courbe. De moins vingt à zéro degré, le glaçon se réchauffe : la courbe monte, c’est de la chaleur sensible. À zéro degré, la glace fond. L’énergie entre toujours mais la température reste à zéro : la courbe avance horizontalement, c’est le premier palier de chaleur latente. Une fois liquide, l’eau se réchauffe de zéro à cent degrés et la courbe remonte. À cent degrés, elle bout. Les bulles se forment, le niveau liquide diminue et l’énergie continue d’entrer, mais la température reste à cent degrés : c’est le grand palier de vaporisation. Après la dernière goutte, la vapeur seule peut dépasser cent degrés et la courbe repart vers le haut.",
      voiceSteps: [
        {
          control: "#journey-slider",
          value: 0,
          text: "Regardons ensemble le contenu du bocal, la température chiffrée et le point orange. Au départ, la glace est à moins vingt degrés.",
        },
        {
          control: "#journey-slider",
          value: 12,
          text: "La glace reçoit de l’énergie. Sa température monte vers zéro degré : le point orange suit une pente de chaleur sensible.",
        },
        {
          control: "#journey-slider",
          value: 26,
          text: "À zéro degré, la fusion commence. Le point avance vers la droite car l’énergie entre, mais il reste sur un palier : la température reste exactement à zéro pendant que la glace devient liquide.",
        },
        {
          control: "#journey-slider",
          value: 49,
          text: "Toute la glace a fondu. L’eau liquide reçoit encore de l’énergie et sa température monte maintenant de zéro vers cent degrés.",
        },
        {
          control: "#journey-slider",
          value: 70,
          text: "À cent degrés, l’ébullition commence. Des bulles apparaissent, le niveau de liquide diminue et le grand palier de vaporisation se dessine. L’énergie entre toujours, mais la température reste à cent degrés.",
        },
        {
          control: "#journey-slider",
          value: 100,
          text: "Après la dernière goutte, il ne reste que de la vapeur. Si elle reçoit encore de l’énergie, sa température dépasse cent degrés et la courbe monte de nouveau.",
        },
      ],
      render: journeyMarkup,
    },
    {
      short: "Lire la courbe",
      kicker: "Étape 4 · Construire un réflexe de lecture",
      title: "Nommer les axes. Suivre le point. Interpréter la forme.",
      text: "Un frigoriste rencontrera des graphiques pendant toute sa carrière. Ici, on apprend le réflexe fondamental : une pente change la température ; un palier change l’état.",
      speak:
        "Cette courbe n’est pas une décoration et il ne faut pas la traverser trop vite. Elle installe une méthode que le frigoriste utilisera ensuite sur des courbes pression-température, des tables et le diagramme log p h. Première question : que représentent les axes ? Ici, l’axe horizontal représente l’énergie apportée et l’axe vertical la température. Deuxième question : que fait le point ? Il suit l’état réel de la matière. Troisième question : quelle est la forme de la courbe ? Quand elle monte, l’énergie augmente la température : c’est de la chaleur sensible. Quand elle devient plate, l’énergie continue d’entrer mais la température reste stable : c’est de la chaleur latente. Le premier palier correspond à la fusion, solide plus liquide. Le second correspond à la vaporisation, liquide plus vapeur. La largeur d’un palier représente une quantité d’énergie nécessaire au changement d’état, pas un temps d’attente sans activité.",
      voiceSteps: [
        {
          control: "#heat-curve-slider",
          value: 8,
          text: "Premier réflexe de métier : nommer les axes. L’axe horizontal représente l’énergie apportée et l’axe vertical représente la température. Ensuite seulement, nous suivons le point.",
        },
        {
          control: "#heat-curve-slider",
          value: 27,
          text: "Le premier palier correspond à la fusion. Solide et liquide coexistent. L’énergie continue d’entrer sans hausse de température : c’est de la chaleur latente.",
        },
        {
          control: "#heat-curve-slider",
          value: 45,
          text: "Une fois le changement d’état terminé, le liquide seul se réchauffe. La courbe monte de nouveau.",
        },
        {
          control: "#heat-curve-slider",
          value: 68,
          text: "Le second palier correspond à la vaporisation. Liquide et vapeur coexistent pendant que l’énergie transforme l’état.",
        },
        {
          control: "#heat-curve-slider",
          value: 100,
          text: "La largeur d’un palier représente une quantité d’énergie nécessaire au changement d’état. Ce n’est pas un temps d’attente sans activité. Gardez cette méthode : lire les axes, suivre le point, puis interpréter la forme.",
        },
      ],
      render: heatingCurveMarkup,
    },
    {
      short: "Nommer",
      kicker: "Étape 5 · Poser les deux mots",
      title: "La chaleur sensible et la chaleur latente.",
      text: "Les mots arrivent seulement maintenant, après l’observation. Ils décrivent ce que l’énergie fait à la matière.",
      speak:
        "Nous pouvons maintenant poser les deux mots. La chaleur sensible modifie la température sans modifier l'état. Le thermomètre la sent. La chaleur latente transforme l'état sans hausse de température pendant le changement d'état de notre modèle. Elle est cachée au thermomètre, mais l'énergie continue bien d'être transférée. La fusion du glaçon et la vaporisation de l'eau reposent sur cette même idée. Un palier n'est donc pas une pause : c'est un changement d'état en cours.",
      render: conceptsMarkup,
    },
    {
      short: "Repérer",
      kicker: "Étape 6 · Préparer le cours de calcul",
      title: "Deux formules à reconnaître, pas encore à calculer.",
      text: "La courbe reste prioritaire. Ces expressions donnent seulement une première culture : une pente et un palier ne se quantifient pas de la même manière.",
      speak:
        "Nous ne faisons pas encore le cours de calcul. Nous installons seulement deux repères scientifiques que vous devez reconnaître. Sur une pente, la température change : la chaleur sensible se quantifie avec Q sensible égale m fois c fois delta T. Sur un palier, l’état change sans variation de température : la chaleur latente se quantifie avec Q latente égale m fois L. Le cours suivant donnera les unités, les valeurs et les exercices. Aujourd’hui, la priorité reste de regarder la courbe et de savoir pourquoi delta T apparaît sur une pente mais disparaît sur un palier.",
      voiceSteps: [
        {
          control: "#mass-slider",
          value: 1,
          text: "Nous ne calculons pas encore. Retenez d’abord l’idée simple : plus il y a de matière, plus il faut transférer d’énergie.",
        },
        {
          control: "#mass-slider",
          value: 2,
          text: "Pour faire varier la température, Q sensible égale m fois c fois delta T. La masse, la nature du fluide et l’écart de température interviennent.",
        },
        {
          control: "#mass-slider",
          value: 3,
          text: "Pour changer d’état, Q latente égale m fois L. Il n’y a pas de delta T parce que la température reste stable sur le palier. Les calculs et les unités viendront dans le cours suivant.",
        },
      ],
      render: energyFormulaMarkup,
    },
    {
      short: "Évaporer",
      kicker: "Étape 7 · Produire l’effet frigorifique",
      title: "Le fluide s’évapore en prenant l’énergie du local.",
      text: "Faites avancer l’évaporation. Le local cède de l’énergie et se refroidit ; le fluide reçoit cette énergie et passe de liquide à vapeur.",
      speak:
        "Commençons par l'effet recherché : refroidir un local. Le froid n'est pas une substance que la machine envoie dans la pièce. Dans l'évaporateur, le fluide liquide reçoit l'énergie de l'air, des aliments ou du produit à refroidir. Cette énergie le fait bouillir. Pendant le palier, le fluide devient progressivement vapeur tandis que sa température reste stable dans notre modèle. Le local, lui, a perdu de l'énergie : sa température diminue. C'est l'effet frigorifique. Faites avancer le curseur et regardez l'énergie passer du local vers le fluide, le niveau de liquide diminuer et le point progresser sur le palier d'évaporation. Une fois la vapeur formée, il faudra la liquéfier dehors pour recommencer : ce sera l'étape suivante.",
      voiceSteps: [
        {
          control: "#evap-slider",
          value: 0,
          text: "Commençons par l’effet recherché : refroidir un local. Le froid n’est pas une substance envoyée dans la pièce. Au départ, le fluide de l’évaporateur contient encore beaucoup de liquide.",
        },
        {
          control: "#evap-slider",
          value: 35,
          text: "Le fluide reçoit l’énergie de l’air, des aliments ou du produit à refroidir. Cette énergie le fait bouillir. Le local perd donc de l’énergie et commence à se refroidir.",
        },
        {
          control: "#evap-slider",
          value: 72,
          text: "Pendant le palier, le liquide devient progressivement vapeur. Le niveau baisse et les bulles se forment. La température du fluide reste stable dans notre modèle.",
        },
        {
          control: "#evap-slider",
          value: 100,
          text: "Le fluide est maintenant vapeur. Il a transporté l’énergie prise au local. Pour recommencer, il faudra restituer cette énergie dehors et redevenir liquide.",
        },
      ],
      render: evaporationMarkup,
    },
    {
      short: "Condenser",
      kicker: "Étape 8 · Lire la courbe de refroidissement",
      title: "Après avoir absorbé dedans, il faut restituer dehors.",
      text: "La vapeur formée dans l’évaporateur doit maintenant céder son énergie : refroidissement, palier de liquéfaction, puis refroidissement du liquide.",
      speak:
        "Maintenant seulement, suivons la condensation. La vapeur produite dans l'évaporateur a transporté l'énergie prise au local. Pour recommencer le cycle, elle doit céder cette énergie à l'air ou à l'eau extérieurs. La vapeur commence par se refroidir : la courbe descend, c'est de la chaleur sensible cédée. Au point de rosée, la première goutte apparaît et commence le palier de liquéfaction. Pendant toute cette partie plate, vapeur et liquide coexistent et le fluide rejette sa chaleur latente. Au point de bulle, la dernière bulle de vapeur disparaît. Le liquide seul peut ensuite se refroidir. L'évaporateur absorbe donc en premier ; le condenseur restitue ensuite.",
      voiceSteps: [
        {
          control: "#cool-curve-slider",
          value: 0,
          text: "La vapeur produite dans l’évaporateur transporte l’énergie prise au local. Pour recommencer le cycle, elle doit maintenant céder cette énergie dehors.",
        },
        {
          control: "#cool-curve-slider",
          value: 24,
          text: "La vapeur commence par se refroidir. La courbe descend : elle cède de la chaleur sensible.",
        },
        {
          control: "#cool-curve-slider",
          value: 43,
          text: "Au point de rosée, la première goutte apparaît. Le palier de liquéfaction commence.",
        },
        {
          control: "#cool-curve-slider",
          value: 70,
          text: "Pendant le palier, vapeur et liquide coexistent. Le fluide rejette sa chaleur latente tandis que sa température reste stable dans notre modèle.",
        },
        {
          control: "#cool-curve-slider",
          value: 100,
          text: "Au point de bulle, la dernière bulle disparaît. Il ne reste que du liquide, qui peut encore se refroidir. L’évaporateur absorbe dedans ; le condenseur restitue dehors.",
        },
      ],
      render: coolingCurveMarkup,
    },
    {
      short: "Frigo",
      kicker: "Étape 9 · Partir d’un appareil connu",
      title: "Dedans, il absorbe. Derrière, il restitue.",
      text: "Explorez les quatre zones dans l’ordre. Le réfrigérateur permet de voir le trajet de l’énergie avant de passer au schéma professionnel.",
      speak:
        "Prenons un réfrigérateur domestique. À l'intérieur, l'évaporateur absorbe de l'énergie aux aliments et à l'air : le fluide y bout à basse température. Le compresseur reçoit de l'énergie électrique et met le fluide en circulation dans les conditions nécessaires. Derrière l'appareil, la grille du condenseur est chaude parce qu'elle restitue à la pièce l'énergie prise dans le réfrigérateur, plus l'énergie fournie au compresseur. Enfin, le détendeur prépare le retour vers l'évaporateur. Voilà pourquoi laisser la porte ouverte ne refroidit pas la pièce : le condenseur y rejette plus d'énergie que l'évaporateur n'en retire.",
      voiceSteps: [
        {
          fridge: "evap",
          text: "Commençons par un appareil connu. À l’intérieur du réfrigérateur, l’évaporateur reçoit l’énergie de l’air et des aliments. Le fluide y bout et l’intérieur se refroidit.",
        },
        {
          fridge: "comp",
          text: "Le compresseur reçoit de l’énergie électrique et fournit l’effort nécessaire pour faire circuler le fluide.",
        },
        {
          fridge: "cond",
          text: "Derrière l’appareil, le condenseur rejette dans la pièce l’énergie prise à l’intérieur, plus l’énergie fournie au compresseur. C’est pourquoi la grille arrière est chaude.",
        },
        {
          fridge: "det",
          text: "Le détendeur prépare ensuite le retour du fluide vers l’évaporateur. La pression expliquera précisément son rôle dans le prochain module.",
        },
      ],
      render: fridgeMarkup,
    },
    {
      short: "Généraliser",
      kicker: "Étape 10 · Passer à l’installation frigorifique",
      title: "L’installation déplace l’énergie d’un endroit à un autre.",
      text: "Retrouvez maintenant, dans une installation, ce que vous venez d’observer dans le réfrigérateur : absorber dedans puis restituer dehors.",
      speak:
        "Nous pouvons maintenant généraliser à l'installation frigorifique. Dans l'évaporateur, le fluide reçoit de l'énergie de l'air du local ou du produit à refroidir. Il se vaporise : le local perd de l'énergie et se refroidit. Dans le condenseur, la vapeur cède son énergie à l'air extérieur ou à de l'eau. Elle se liquéfie. La chaleur n'a pas disparu : elle a été prise dedans et rendue dehors. Le condenseur rejette aussi l'énergie fournie au compresseur. Le détendeur prépare ensuite le retour vers l'évaporateur.",
      voiceSteps: [
        {
          machine: "evap",
          text: "Dans l’évaporateur, le fluide reçoit l’énergie du local ou du produit à refroidir. Il se vaporise : le milieu perd de l’énergie et se refroidit.",
        },
        {
          machine: "cond",
          text: "Dans le condenseur, la vapeur restitue l’énergie à l’air ou à l’eau extérieurs et redevient liquide. Le condenseur rejette aussi l’énergie fournie au compresseur.",
        },
        {
          machine: "evap",
          text: "La chaleur n’a donc pas disparu. La machine la prend dedans, la transporte, puis la rend dehors. Le cycle peut recommencer.",
        },
      ],
      render: machineMarkup,
    },
    {
      short: "Préparer",
      kicker: "Étape 11 · Les deux briques du métier",
      title: "Surchauffe et sous-refroidissement : les mots ont maintenant un sens.",
      text: "Complétez les deux situations. Vous ne calculez encore rien : vous placez simplement les phénomènes dans le bon ordre.",
      speak:
        "Nous pouvons enfin préparer deux mots que vous retrouverez partout en froid et climatisation. Dans l'évaporateur, la dernière goutte de liquide vient de disparaître. Si le fluide reçoit encore de l'énergie, la vapeur seule se réchauffe : c'est la surchauffe. Dans le condenseur, la dernière bulle de vapeur vient de disparaître. Si le liquide cède encore de l'énergie, il se refroidit sous sa température de changement d'état : c'est le sous-refroidissement. Pour mesurer ces écarts, il faudra relier pression et température. Ce sera précisément l'étape suivante de la formation.",
      render: foundationsMarkup,
    },
    {
      short: "Valider",
      kicker: "Étape 12 · Défi découverte",
      title: "Racontez maintenant le voyage de l’énergie.",
      text: "Neuf situations courtes vérifient les briques essentielles, depuis la casserole jusqu’au circuit frigorifique.",
      speak:
        "Dernière étape. Vous allez repartir du glaçon, de la casserole et de la buée, puis suivre l'énergie dans l'évaporateur et le condenseur. Le but n'est pas de réciter un vocabulaire. Le but est de pouvoir raconter ce qui change, où va l'énergie et pourquoi la vapeur peut redevenir liquide.",
      zoneClass: "quiz-zone",
      render: quizMarkup,
    },
  ];

  const questions = [
    {
      q: "Un glaçon fond dans une pièce. Que se passe-t-il ?",
      answers: ["Le glaçon reçoit de l’énergie de son environnement", "Le froid entre dans la pièce", "L’énergie disparaît"],
      correct: 0,
      why: "Le glaçon reçoit de l’énergie ; cette énergie permet sa fusion.",
    },
    {
      q: "Deux quantités d’eau différentes reçoivent la même énergie. Leur température évolue-t-elle forcément de la même façon ?",
      answers: ["Oui, toujours", "Non, la quantité de matière compte", "Seulement si l’eau est colorée"],
      correct: 1,
      why: "Une plus grande quantité de matière demande davantage d’énergie pour une évolution comparable.",
    },
    {
      q: "L’eau bout et reçoit toujours de l’énergie, mais sa température reste stable dans notre modèle. L’énergie sert à…",
      answers: ["transformer le liquide en vapeur", "arrêter la plaque", "refroidir la casserole"],
      correct: 0,
      why: "Elle sert au changement d’état : c’est la chaleur latente de vaporisation.",
    },
    {
      q: "Sur une courbe température–énergie, que représente une partie plate ?",
      answers: ["Un arrêt de tout échange", "Un changement d’état avec transfert d’énergie", "Une panne du thermomètre"],
      correct: 1,
      why: "L’énergie continue d’être transférée, mais sert au changement d’état : c’est le palier de chaleur latente.",
    },
    {
      q: "Que faut-il faire pour liquéfier une vapeur ?",
      answers: ["Lui retirer de l’énergie", "Lui ajouter toujours plus d’énergie", "Supprimer toute matière"],
      correct: 0,
      why: "La vapeur doit céder de l’énergie à un environnement plus froid pour se condenser.",
    },
    {
      q: "Dans l’évaporateur, d’où vient l’énergie reçue par le fluide ?",
      answers: ["Du local ou du produit à refroidir", "Uniquement du condenseur", "De nulle part"],
      correct: 0,
      why: "Le fluide absorbe l’énergie du milieu à refroidir et se vaporise.",
    },
    {
      q: "Pourquoi la grille arrière d’un réfrigérateur rejette-t-elle plus d’énergie que l’évaporateur n’en a absorbé ?",
      answers: ["Elle ajoute l’énergie fournie au compresseur", "Elle crée de l’énergie gratuitement", "Elle reçoit du froid de la pièce"],
      correct: 0,
      why: "Le condenseur rejette l’énergie prise dedans plus le travail fourni au compresseur : Qcond = Qevap + Wcomp.",
    },
    {
      q: "Après la disparition de la dernière goutte, la vapeur reçoit encore de l’énergie. On prépare la notion de…",
      answers: ["surchauffe", "sous-refroidissement", "fusion"],
      correct: 0,
      why: "Après évaporation complète, chauffer encore la vapeur crée la surchauffe.",
    },
    {
      q: "Après la disparition de la dernière bulle dans le condenseur, le liquide cède encore de l’énergie. On prépare la notion de…",
      answers: ["surchauffe", "sous-refroidissement", "ébullition"],
      correct: 1,
      why: "Après condensation complète, refroidir encore le liquide crée le sous-refroidissement.",
    },
  ];

  function discoveryMarkup() {
    return `
      <div class="discovery-grid">
        <button class="discovery-card" data-discovery="ice" type="button">
          <span class="scene-art ice-art" aria-hidden="true"><i></i><i></i><i></i></span>
          <small>SCÈNE 1</small><strong>Le glaçon fond</strong><span>Que reçoit-il ?</span>
        </button>
        <button class="discovery-card" data-discovery="pot" type="button">
          <span class="scene-art pot-art" aria-hidden="true"><i></i><i></i><i></i></span>
          <small>SCÈNE 2</small><strong>L’eau chauffe puis bout</strong><span>Que change l’énergie ?</span>
        </button>
        <button class="discovery-card" data-discovery="lid" type="button">
          <span class="scene-art lid-art" aria-hidden="true"><i></i><i></i><i></i></span>
          <small>SCÈNE 3</small><strong>La buée devient gouttes</strong><span>Où part l’énergie ?</span>
        </button>
      </div>
      <p class="feedback discovery-feedback" id="discovery-feedback" role="status">Touchez une scène pour la faire parler.</p>`;
  }

  function energyBricks(id, count = 10) {
    return `<div class="energy-bricks" id="${id}" aria-label="Quantité d’énergie transférée">${Array.from({ length: count }, () => "<i></i>").join("")}</div>`;
  }

  function quantityMarkup() {
    return `
      <div class="quantity-lab">
        <div class="energy-control-card">
          <small>LA MÊME ÉNERGIE POUR LES DEUX</small>
          ${energyBricks("quantity-energy")}
          <label for="quantity-slider">Énergie envoyée : <b id="quantity-energy-label">très peu</b></label>
          <input id="quantity-slider" type="range" min="0" max="100" value="0">
          <p>La plaque chauffe pendant la même durée et avec la même intensité.</p>
        </div>
        <div class="water-comparison">
          <article class="water-cup small-cup">
            <div class="cup" id="small-cup"><span class="water"></span><span class="cup-bubbles"><i></i><i></i><i></i><i></i></span></div>
            <strong>Petite quantité d’eau</strong>
            <div class="temperature-track"><i id="small-temp"></i></div>
            <b id="small-label">froide</b>
            <div class="pot-energy">
              <span><i id="small-energy-fill"></i><b style="left:58%">ébullition</b></span>
              <small id="small-energy-status">Énergie reçue : départ</small>
            </div>
          </article>
          <article class="water-cup large-cup">
            <div class="cup" id="large-cup"><span class="water"></span><span class="cup-bubbles"><i></i><i></i><i></i><i></i></span></div>
            <strong>Grande quantité d’eau</strong>
            <div class="temperature-track"><i id="large-temp"></i></div>
            <b id="large-label">froide</b>
            <div class="pot-energy">
              <span><i id="large-energy-fill"></i><b style="left:92%">ébullition</b></span>
              <small id="large-energy-status">Énergie reçue : départ</small>
            </div>
          </article>
        </div>
      </div>
      <p class="pressure-note" id="quantity-conclusion"><strong>Idée clé :</strong> les deux casseroles reçoivent la même énergie, mais la petite quantité atteindra l’ébullition plus tôt.</p>
      <p class="simulation-note">Simulation qualitative : les seuils montrent l’ordre des phénomènes, pas des valeurs mesurées.</p>`;
  }

  function journeyMarkup() {
    return `
      <div class="journey-lab">
        <div class="journey-visual">
          <div class="temperature-scale" aria-hidden="true">
            <span>120 °C</span><span>100 °C</span><span>0 °C</span><span>−20 °C</span>
          </div>
          <div class="temperature-column" aria-label="Thermomètre synchronisé avec la courbe">
            <span class="temperature-fill" id="journey-temperature"></span>
          </div>
          <div class="journey-vessel stage-ice" id="journey-vessel" aria-hidden="true">
            <div class="ice-cubes"><i></i><i></i><i></i></div>
            <div class="journey-liquid" id="journey-liquid"></div>
            <div class="journey-bubbles"><i></i><i></i><i></i><i></i></div>
            <div class="journey-vapor"><i></i><i></i><i></i></div>
            <div class="vessel-temperature rising" id="journey-vessel-temperature">
              <small>TEMPÉRATURE DE L’EAU</small>
              <b id="journey-vessel-temp-value">−20 °C</b>
              <span id="journey-vessel-temp-trend">monte ↗</span>
            </div>
          </div>
          <div class="journey-flame" aria-hidden="true"></div>
          <p class="journey-pressure">Modèle : eau pure · pression atmosphérique</p>
        </div>
        <div class="journey-panel">
          <div class="journey-live-graph">
            <div class="journey-graph-heading">
              <span>LA COURBE EN ESCALIER DU FRIGORISTE</span>
              <b>Axes · point mobile · pentes · paliers</b>
            </div>
            <svg viewBox="0 0 760 330" role="img" aria-label="Courbe de chauffe de l’eau : pentes de chaleur sensible, palier de fusion à zéro degré et palier de vaporisation à cent degrés">
              <rect class="journey-zone sensible" x="68" y="28" width="107" height="250"></rect>
              <rect class="journey-zone latent" x="175" y="28" width="117" height="250"></rect>
              <rect class="journey-zone sensible" x="292" y="28" width="138" height="250"></rect>
              <rect class="journey-zone latent" x="430" y="28" width="195" height="250"></rect>
              <rect class="journey-zone sensible" x="625" y="28" width="105" height="250"></rect>
              <path class="journey-graph-grid" d="M68 250H730M68 215H730M68 80H730M68 42H730"></path>
              <path class="journey-graph-axis" d="M68 25V278H738"></path>
              <path class="journey-graph-curve" d="M88 250L175 215L292 215L430 80L625 80L710 42"></path>
              <path class="journey-graph-guides" d="M175 215V282M292 215V282M430 80V282M625 80V282"></path>
              <line class="journey-graph-marker-line" id="journey-graph-line" x1="88" y1="250" x2="88" y2="278"></line>
              <circle class="journey-graph-marker" id="journey-graph-marker" cx="88" cy="250" r="9"></circle>

              <text class="journey-graph-axis-label axis-title" x="16" y="24">TEMPÉRATURE</text>
              <text class="journey-graph-tick" x="58" y="254" text-anchor="end">−20 °C</text>
              <text class="journey-graph-tick strong" x="58" y="219" text-anchor="end">0 °C</text>
              <text class="journey-graph-tick strong" x="58" y="84" text-anchor="end">100 °C</text>
              <text class="journey-graph-tick" x="58" y="46" text-anchor="end">120 °C</text>
              <text class="journey-graph-axis-label" x="738" y="318" text-anchor="end">ÉNERGIE APPORTÉE →</text>

              <text class="journey-heat-label sensible" x="121" y="55" text-anchor="middle">SENSIBLE</text>
              <text class="journey-heat-label latent" x="233" y="55" text-anchor="middle">LATENTE</text>
              <text class="journey-heat-label sensible" x="361" y="55" text-anchor="middle">SENSIBLE</text>
              <text class="journey-heat-label latent" x="527" y="55" text-anchor="middle">LATENTE</text>
              <text class="journey-heat-label sensible" x="677" y="55" text-anchor="middle">SENSIBLE</text>

              <text class="journey-graph-label" x="233" y="201" text-anchor="middle">FUSION · T = 0 °C</text>
              <text class="journey-graph-label" x="527" y="66" text-anchor="middle">ÉBULLITION · T = 100 °C</text>
              <text class="journey-phase-label" x="121" y="299" text-anchor="middle">GLACE</text>
              <text class="journey-phase-label latent" x="233" y="299" text-anchor="middle">GLACE + EAU</text>
              <text class="journey-phase-label" x="361" y="299" text-anchor="middle">EAU</text>
              <text class="journey-phase-label latent" x="527" y="299" text-anchor="middle">EAU + VAPEUR</text>
              <text class="journey-phase-label" x="677" y="299" text-anchor="middle">VAPEUR</text>
            </svg>
            <div class="journey-graph-reading">
              <span class="graph-type sensible" id="journey-graph-type">CHALEUR SENSIBLE</span>
              <p id="journey-graph-note"><strong>La courbe monte :</strong> l’énergie reçue fait monter la température du glaçon.</p>
            </div>
          </div>
          <div class="journey-phase-copy">
            <span class="state-badge" id="journey-badge">Solide</span>
            <div><h3 id="journey-title">Le glaçon se réchauffe</h3><p id="journey-copy">L’énergie reçue fait monter sa température.</p></div>
          </div>
          <div class="observation-pair">
            <span>Énergie reçue<b id="journey-energy-state">augmente toujours</b></span>
            <span>Température mesurée<b id="journey-temp-value">−20 °C</b><small id="journey-temp-state">monte</small></span>
            <span>L’énergie sert à<b id="journey-energy-effect">réchauffer la glace</b></span>
          </div>
          <div class="journey-energy-meter">
            <span>Compteur d’énergie ajouté</span>
            ${energyBricks("journey-energy")}
          </div>
          <label for="journey-slider">Ajouter de l’énergie : <b id="journey-label">départ</b></label>
          <input id="journey-slider" type="range" min="0" max="100" value="0">
        </div>
      </div>`;
  }

  function heatingCurveMarkup() {
    return `
      <div class="graph-lesson">
        <p class="graph-professional-banner"><strong>Réflexe professionnel :</strong> avant toute interprétation, je nomme les axes, je repère le sens de lecture et je suis le point sur la courbe.</p>
        <div class="technical-graph">
          <svg viewBox="0 0 760 360" role="img" aria-label="Courbe de chauffe complète avec deux pentes de chaleur sensible et deux paliers de chaleur latente">
            <rect class="graph-sensible-zone" x="60" y="42" width="125" height="258"></rect>
            <rect class="graph-latent-zone" x="185" y="42" width="115" height="258"></rect>
            <rect class="graph-sensible-zone" x="300" y="42" width="110" height="258"></rect>
            <rect class="graph-latent-zone" x="410" y="42" width="180" height="258"></rect>
            <rect class="graph-sensible-zone" x="590" y="42" width="120" height="258"></rect>
            <path class="graph-axis" d="M60 30V300H725"></path>
            <path class="graph-curve" d="M80 280L185 230L300 230L410 150L590 150L700 75"></path>
            <path class="graph-guide" d="M185 230V305M300 230V305M410 150V305M590 150V305"></path>
            <line class="graph-marker-line" id="heat-curve-line" x1="80" y1="280" x2="80" y2="300"></line>
            <circle class="graph-marker" id="heat-curve-marker" cx="80" cy="280" r="9"></circle>
            <text class="graph-axis-label" x="18" y="32">TEMPÉRATURE T (°C)</text>
            <text class="graph-axis-label" x="724" y="330" text-anchor="end">ÉNERGIE APPORTÉE Q →</text>
            <text class="graph-tick strong" x="52" y="234" text-anchor="end">0 °C</text>
            <text class="graph-tick strong" x="52" y="154" text-anchor="end">100 °C</text>
            <text class="graph-zone-title" x="122" y="325" text-anchor="middle">SOLIDE</text>
            <text class="graph-zone-title latent" x="242" y="325" text-anchor="middle">FUSION</text>
            <text class="graph-zone-title" x="355" y="325" text-anchor="middle">LIQUIDE</text>
            <text class="graph-zone-title latent" x="500" y="325" text-anchor="middle">VAPORISATION</text>
            <text class="graph-zone-title" x="650" y="325" text-anchor="middle">VAPEUR</text>
            <text class="graph-note" x="242" y="214" text-anchor="middle">palier latent</text>
            <text class="graph-note" x="500" y="134" text-anchor="middle">palier latent</text>
            <text class="graph-sensible-note" x="122" y="269" text-anchor="middle">pente sensible</text>
            <text class="graph-sensible-note" x="355" y="190" text-anchor="middle">pente sensible</text>
            <text class="graph-sensible-note" x="650" y="113" text-anchor="middle">pente sensible</text>
          </svg>
          <label for="heat-curve-slider">Parcourir la courbe : <b id="heat-curve-label">solide qui se réchauffe</b></label>
          <input id="heat-curve-slider" type="range" min="0" max="100" value="0">
        </div>
        <aside class="graph-explanation">
          <span class="graph-type sensible" id="heat-curve-type">CHALEUR SENSIBLE</span>
          <h3 id="heat-curve-title">La température monte</h3>
          <p id="heat-curve-copy">L’énergie augmente l’agitation de la matière sans changer son état.</p>
          <div class="graph-reading">
            <span>Énergie apportée<b>augmente toujours →</b></span>
            <span>Température<b id="heat-curve-temp">monte ↗</b></span>
            <span>État<b id="heat-curve-state">solide</b></span>
          </div>
          <p class="flat-rule"><strong>Une partie plate n’est pas vide :</strong> sa largeur représente l’énergie absorbée pendant le changement d’état.</p>
        </aside>
      </div>`;
  }

  function conceptsMarkup() {
    return `
      <div class="concept-grid">
        <article class="concept-card" style="--card:var(--blue)">
          <span>LE THERMOMÈTRE LA SENT</span>
          <h3>Chaleur sensible</h3>
          <p>L’état reste le même. <strong>La température change.</strong></p>
          <div class="example-chain"><b>glace qui se réchauffe</b><i>·</i><b>eau qui se réchauffe</b><i>·</i><b>vapeur qui se réchauffe</b></div>
        </article>
        <article class="concept-card" style="--card:var(--orange)">
          <span>ELLE CHANGE L’ÉTAT</span>
          <h3>Chaleur latente</h3>
          <p>La température reste stable dans le modèle. <strong>L’état change.</strong></p>
          <div class="example-chain"><b>glace qui fond</b><i>·</i><b>eau qui bout</b><i>·</i><b>vapeur qui se liquéfie</b></div>
        </article>
      </div>
      <p class="pressure-note"><strong>Le piège :</strong> température stable ne signifie pas énergie nulle. Le changement d’état consomme ou libère de l’énergie.</p>`;
  }

  function energyFormulaMarkup() {
    return `
      <div class="formula-lesson">
        <p class="formula-preview-note"><strong>Aujourd’hui : reconnaître.</strong> Les unités, les valeurs numériques et les exercices de calcul appartiennent au cours suivant. La courbe reste le repère principal.</p>
        <article class="formula-card sensible-formula">
          <span>LA TEMPÉRATURE CHANGE</span>
          <h3>Q<sub>sensible</sub> = m × c × ΔT</h3>
          <ul>
            <li><b>m</b> : masse de matière</li>
            <li><b>c</b> : capacité thermique massique</li>
            <li><b>ΔT</b> : écart de température</li>
          </ul>
          <p>Plus la masse ou l’écart de température augmente, plus il faut transférer d’énergie.</p>
        </article>
        <article class="formula-card latent-formula">
          <span>L’ÉTAT CHANGE</span>
          <h3>Q<sub>latente</sub> = m × L</h3>
          <ul>
            <li><b>m</b> : masse de matière</li>
            <li><b>L</b> : énergie massique du changement d’état</li>
            <li><b>ΔT absent</b> : le palier reste plat</li>
          </ul>
          <p>La nature du fluide et le changement d’état déterminent la valeur de L.</p>
        </article>
      </div>
      <div class="mass-lab">
        <div>
          <label for="mass-slider">Quantité de matière : <b id="mass-label">petite</b></label>
          <input id="mass-slider" type="range" min="1" max="3" step="1" value="1">
          <p>Sans changer les autres conditions, augmentez la masse.</p>
        </div>
        <div class="energy-bars">
          <span>Chaleur sensible<i id="sensible-energy-bar"></i></span>
          <span>Chaleur latente<i id="latent-energy-bar"></i></span>
          <strong id="mass-conclusion">Petite masse : petite quantité d’énergie à transférer.</strong>
          <small>Les deux barres montrent seulement l’effet de la masse. Leur longueur ne compare pas la chaleur sensible à la chaleur latente.</small>
        </div>
      </div>`;
  }

  function evaporationMarkup() {
    return `
      <div class="evaporation-lab">
        <div class="evaporation-scene">
          <article class="local-card">
            <small>MILIEU À REFROIDIR</small>
            <h3>Air du local</h3>
            <div class="local-temperature"><i id="local-temperature-fill"></i><b id="local-temperature-label">température de départ</b></div>
            <p>Il cède son énergie au fluide.</p>
            <div class="local-energy" id="local-energy" aria-label="Énergie restant dans le local">${Array.from({ length: 8 }, () => "<i></i>").join("")}</div>
          </article>
          <div class="evaporation-transfer" aria-hidden="true"><span>ÉNERGIE</span><b>→</b><small>quitte le local</small></div>
          <div class="evaporator-vessel" id="evaporator-vessel" aria-hidden="true">
            <div class="evaporator-liquid" id="evaporator-liquid"></div>
            <div class="evaporator-bubbles"><i></i><i></i><i></i><i></i></div>
            <div class="evaporator-vapor"><i></i><i></i><i></i></div>
            <div class="evaporator-temperature"><small>TEMPÉRATURE DU FLUIDE</small><b>stable →</b></div>
          </div>
        </div>
        <div class="evaporation-control">
          <span class="graph-type latent">CHALEUR LATENTE ABSORBÉE</span>
          <h3 id="evaporation-title">La première bulle apparaît</h3>
          <p id="evaporation-copy">Le fluide commence à prendre de l’énergie au local et à se vaporiser.</p>
          <div class="evaporation-graph">
            <svg viewBox="0 0 500 175" role="img" aria-label="Palier d’évaporation : l’énergie absorbée augmente tandis que la température du fluide reste stable">
              <path class="evap-graph-axis" d="M28 16V142H485"></path>
              <path class="evap-graph-curve" d="M45 126L105 75L420 75L475 34"></path>
              <path class="evap-graph-guides" d="M105 75V146M420 75V146"></path>
              <line class="evap-graph-marker-line" id="evap-graph-line" x1="105" y1="75" x2="105" y2="142"></line>
              <circle class="evap-graph-marker" id="evap-graph-marker" cx="105" cy="75" r="7"></circle>
              <text class="evap-graph-axis-label" x="4" y="16">T°</text>
              <text class="evap-graph-axis-label" x="485" y="168" text-anchor="end">énergie absorbée →</text>
              <text class="evap-graph-label" x="262" y="62" text-anchor="middle">PALIER D’ÉVAPORATION · TEMPÉRATURE STABLE</text>
              <text class="evap-graph-point" x="105" y="157" text-anchor="middle">1re bulle</text>
              <text class="evap-graph-point" x="420" y="157" text-anchor="middle">dernière goutte</text>
            </svg>
          </div>
          <label for="evap-slider">Faire avancer l’évaporation : <b id="evap-label">début</b></label>
          <input id="evap-slider" type="range" min="0" max="100" value="0">
          <div class="evaporation-balance">
            <span>Énergie du local<b id="local-energy-state">diminue</b></span>
            <i>→</i>
            <span>Énergie reçue par le fluide<b id="fluid-energy-state">augmente</b></span>
          </div>
          <p class="effect-frigorifique" id="effect-frigorifique"><strong>Effet frigorifique :</strong> le local perd de l’énergie, donc il commence à se refroidir.</p>
        </div>
      </div>`;
  }

  function coolingMarkup() {
    return `
      <div class="cooling-lab">
        <div class="cooling-scene">
          <div class="cold-source" aria-hidden="true">air ou eau<br>plus froids</div>
          <div class="energy-arrow" aria-hidden="true"><span>énergie retirée</span><b>→</b></div>
          <div class="cooling-vessel stage-hot-vapor" id="cooling-vessel" aria-hidden="true">
            <div class="cooling-liquid" id="cooling-liquid"></div>
            <div class="cooling-drops"><i></i><i></i><i></i><i></i></div>
            <div class="cooling-vapor"><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
        <div class="cooling-panel">
          <span class="state-badge" id="cooling-badge">Vapeur</span>
          <h3 id="cooling-title">La vapeur se refroidit</h3>
          <p id="cooling-copy">Elle cède de l’énergie, mais reste encore entièrement vapeur.</p>
          <div class="observation-pair">
            <span>Énergie du fluide <b>diminue</b></span>
            <span>Température <b id="cooling-temp-state">baisse</b></span>
          </div>
          ${energyBricks("cooling-energy")}
          <label for="cooling-slider">Retirer de l’énergie : <b id="cooling-label">départ</b></label>
          <input id="cooling-slider" type="range" min="0" max="100" value="0">
        </div>
      </div>`;
  }

  function coolingCurveMarkup() {
    return `
      <div class="graph-lesson cooling-graph-lesson">
        <div class="technical-graph">
          <svg viewBox="0 0 760 360" role="img" aria-label="Courbe de refroidissement avec pente de refroidissement de la vapeur, palier de liquéfaction et pente de refroidissement du liquide">
            <rect class="graph-sensible-zone" x="60" y="42" width="170" height="258"></rect>
            <rect class="graph-latent-zone" x="230" y="42" width="280" height="258"></rect>
            <rect class="graph-sensible-zone" x="510" y="42" width="200" height="258"></rect>
            <path class="graph-axis" d="M60 30V300H725"></path>
            <path class="graph-curve cooling" d="M80 75L230 150L510 150L690 250"></path>
            <path class="graph-guide" d="M230 150V305M510 150V305"></path>
            <line class="graph-marker-line" id="cool-curve-line" x1="80" y1="75" x2="80" y2="300"></line>
            <circle class="graph-marker" id="cool-curve-marker" cx="80" cy="75" r="9"></circle>
            <text class="graph-axis-label" x="24" y="32">température</text>
            <text class="graph-axis-label" x="724" y="330" text-anchor="end">énergie retirée →</text>
            <text class="graph-zone-title" x="145" y="325" text-anchor="middle">VAPEUR</text>
            <text class="graph-zone-title latent" x="370" y="325" text-anchor="middle">LIQUÉFACTION</text>
            <text class="graph-zone-title" x="610" y="325" text-anchor="middle">LIQUIDE</text>
            <text class="graph-note" x="370" y="134" text-anchor="middle">palier latent : chaleur rejetée</text>
            <text class="graph-point" x="230" y="128" text-anchor="middle">point de rosée</text>
            <text class="graph-point" x="510" y="128" text-anchor="middle">point de bulle</text>
          </svg>
          <label for="cool-curve-slider">Parcourir la courbe : <b id="cool-curve-label">vapeur qui se refroidit</b></label>
          <input id="cool-curve-slider" type="range" min="0" max="100" value="0">
        </div>
        <aside class="graph-explanation">
          <span class="graph-type sensible" id="cool-curve-type">CHALEUR SENSIBLE CÉDÉE</span>
          <h3 id="cool-curve-title">La vapeur se refroidit</h3>
          <p id="cool-curve-copy">Elle cède de l’énergie et sa température baisse avant la première goutte.</p>
          <div class="graph-reading">
            <span>Énergie du fluide<b>diminue toujours →</b></span>
            <span>Température<b id="cool-curve-temp">baisse ↘</b></span>
            <span>État<b id="cool-curve-state">vapeur</b></span>
          </div>
          <p class="flat-rule"><strong>Dans le condenseur :</strong> la grande partie utile est le palier où la vapeur restitue sa chaleur latente en devenant liquide.</p>
        </aside>
      </div>`;
  }

  function machineMarkup() {
    return `
      <div class="machine-toggle" role="group" aria-label="Choisir un échangeur">
        <button class="active" data-machine="evap" type="button">1 · Évaporateur : prendre dedans</button>
        <button data-machine="cond" type="button">2 · Condenseur : rendre dehors</button>
      </div>
      <div class="circuit-stage mode-evap" id="circuit-stage">
        <article class="environment-card indoor">
          <small>DEDANS</small><strong>Air du local</strong>
          <span>Il cède de l’énergie et se refroidit.</span>
        </article>
        <div class="circuit-transfer">
          <span class="energy-token">ÉNERGIE</span><b id="circuit-arrow">→</b>
        </div>
        <article class="exchange-card">
          <div class="coil" aria-hidden="true"></div>
          <small id="exchange-kicker">LE FLUIDE REÇOIT</small>
          <h3 id="exchange-title">Évaporateur</h3>
          <p id="exchange-copy">Le liquide devient vapeur en absorbant l’énergie du local.</p>
        </article>
        <div class="cycle-link" aria-hidden="true"><b>machine</b><span>transporte</span></div>
        <article class="environment-card outdoor">
          <small>DEHORS</small><strong>Air ou eau extérieurs</strong>
          <span>Ils recevront l’énergie transportée.</span>
        </article>
      </div>
      <p class="feedback" id="machine-feedback">Le local ne reçoit pas du « froid » : il perd de l’énergie au profit du fluide.</p>
      <div class="energy-balance"><span>Énergie absorbée dedans<br><b>Q<sub>évap</sub></b></span><i>+</i><span>Énergie du compresseur<br><b>W<sub>comp</sub></b></span><i>=</i><strong>Énergie rejetée dehors<br>Q<sub>cond</sub></strong></div>`;
  }

  function fridgeMarkup() {
    return `
      <div class="fridge-lesson">
        <div class="fridge-diagram">
          <p class="fridge-instruction"><b>1 → 4</b> Cliquez dans l’ordre pour suivre l’énergie.</p>
          <div class="fridge-body">
            <button class="fridge-zone inside-zone active" data-fridge="evap" type="button">
              <b class="fridge-step">1</b>
              <small>DEDANS</small><strong>Évaporateur</strong><span>absorbe l’énergie</span>
            </button>
            <div class="fridge-shelf" aria-hidden="true"></div>
            <div class="fridge-food" aria-hidden="true"><i></i><i></i><i></i></div>
            <button class="fridge-zone compressor-zone" data-fridge="comp" type="button">
              <b class="fridge-step">2</b>
              <small>EN BAS</small><strong>Compresseur</strong>
            </button>
          </div>
          <div class="rear-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <button class="fridge-zone condenser-zone" data-fridge="cond" type="button">
            <b class="fridge-step">3</b>
            <small>DERRIÈRE</small><strong>Condenseur</strong><span>rejette l’énergie</span>
          </button>
          <button class="fridge-zone expansion-zone" data-fridge="det" type="button">
            <b class="fridge-step">4</b>
            <small>AVANT LE RETOUR</small><strong>Détendeur</strong>
          </button>
          <span class="room-label">PIÈCE</span>
          <span class="fridge-energy-flow" aria-hidden="true">énergie prise dedans → transportée → rejetée dans la pièce</span>
        </div>
        <aside class="fridge-explanation">
          <span class="graph-type sensible" id="fridge-type">1 · ABSORBER</span>
          <h3 id="fridge-title">L’intérieur se refroidit</h3>
          <p id="fridge-copy">L’évaporateur reçoit l’énergie de l’air et des aliments. Le fluide y passe principalement par son palier de vaporisation.</p>
          <div class="fridge-truth">
            <b>Porte ouverte ?</b>
            <span>Le réfrigérateur ne refroidit pas la pièce : son condenseur y rejette l’énergie prise dedans, plus celle du compresseur.</span>
          </div>
        </aside>
      </div>`;
  }

  function foundationsMarkup() {
    return `
      <div class="foundation-grid">
        <article class="foundation-card superheat-card">
          <small>À LA FIN DE L’ÉVAPORATEUR</small>
          <div class="foundation-path" aria-label="Fin de l’évaporation">
            <span>liquide + vapeur</span><i>→</i><b>dernière goutte</b><i>→</i><strong>vapeur seule</strong>
          </div>
          <div class="foundation-question">
            <span>SI LA VAPEUR REÇOIT ENCORE DE L’ÉNERGIE</span>
            <h3>La température va…</h3>
          </div>
          <div class="foundation-answers">
            <button data-foundation="superheat" data-correct="true" type="button">Elle monte : c’est la surchauffe</button>
            <button data-foundation="superheat" type="button">Elle reste sur le palier</button>
          </div>
          <p class="feedback" id="superheat-feedback">Repérez d’abord la dernière goutte, puis choisissez la suite.</p>
        </article>
        <article class="foundation-card subcool-card">
          <small>À LA FIN DU CONDENSEUR</small>
          <div class="foundation-path" aria-label="Fin de la liquéfaction">
            <span>vapeur + liquide</span><i>→</i><b>dernière bulle</b><i>→</i><strong>liquide seul</strong>
          </div>
          <div class="foundation-question">
            <span>SI LE LIQUIDE CÈDE ENCORE DE L’ÉNERGIE</span>
            <h3>La température va…</h3>
          </div>
          <div class="foundation-answers">
            <button data-foundation="subcool" type="button">Elle reste sur le palier</button>
            <button data-foundation="subcool" data-correct="true" type="button">Elle baisse : c’est le sous-refroidissement</button>
          </div>
          <p class="feedback" id="subcool-feedback">Repérez d’abord la dernière bulle, puis choisissez la suite.</p>
        </article>
      </div>
      <p class="next-lesson-note"><strong>Le repère commun :</strong> surchauffe et sous-refroidissement commencent seulement après la disparition complète de l’un des deux états. La relation pression–température permettra ensuite de mesurer ces écarts.</p>`;
  }

  function quizMarkup() {
    if (quizIndex >= questions.length) {
      const success = score >= 7;
      return `
        <div class="quiz-result">
          <h3>${success ? "Vous savez raconter le voyage de l’énergie." : "Certaines briques demandent encore un passage."}</h3>
          <b>${score}/${questions.length}</b>
          <span class="result-rule">${success ? "Bases acquises" : "Objectif : au moins 7 réponses justes sur 9"}</span>
          <p>${success
            ? "Vous distinguez température et énergie, vous expliquez les paliers et vous savez suivre l’énergie de l’évaporateur au condenseur."
            : "Reprenez surtout les paliers, le sens du transfert d’énergie et le passage évaporateur–condenseur, puis rejouez le défi."}</p>
          <button class="nav" id="quiz-restart" type="button">Refaire le défi</button>
        </div>`;
    }

    const question = questions[quizIndex];
    return `
      <div class="quiz-wrap">
        <div class="quiz-head"><strong>Question ${quizIndex + 1} sur ${questions.length}</strong><span>Score : ${score}</span></div>
        <div class="quiz-progress" aria-label="Progression : question ${quizIndex + 1} sur ${questions.length}">
          ${questions.map((_, index) => `<i class="${index < quizIndex ? "done" : index === quizIndex ? "current" : ""}"></i>`).join("")}
        </div>
        <p class="quiz-question">${question.q}</p>
        <div class="quiz-options">
          ${question.answers.map((answer, index) => `<button class="quiz-option" data-answer="${index}" type="button">${answer}</button>`).join("")}
        </div>
        <p class="quiz-feedback" id="quiz-feedback" role="status">Choisissez une réponse.</p>
      </div>`;
  }

  function buildStepper() {
    $("#stepper").innerHTML = lessons
      .map((lesson, index) => `<button type="button" data-step="${index}"><b>${String(index + 1).padStart(2, "0")}</b><span>${lesson.short}</span></button>`)
      .join("");

    document.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => goTo(Number(button.dataset.step), false));
    });
  }

  function updateStepper() {
    document.querySelectorAll("#stepper button").forEach((button, index) => {
      button.classList.toggle("active", index === current);
      button.classList.toggle("done", index < furthest);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function render() {
    const lesson = lessons[current];
    $("#kicker").textContent = lesson.kicker;
    $("#title").textContent = lesson.title;
    $("#lesson-text").textContent = lesson.text;
    $("#zone").className = `interactive-zone${lesson.zoneClass ? ` ${lesson.zoneClass}` : ""}`;
    $("#zone").innerHTML = lesson.render();
    $("#status").textContent = `Étape ${current + 1} sur ${lessons.length}${autoplay ? " · parcours raconté" : ""}`;
    $("#prev").disabled = current === 0;
    updateCourseNavigation();
    updateStepper();
    wireCurrentActivity();
    updateListenButton();
  }

  function updateCourseNavigation() {
    const onQuiz = current === lessons.length - 1;
    const quizComplete = quizIndex >= questions.length;
    $("#next").disabled = onQuiz && !quizComplete;
    $("#next").textContent = onQuiz ? (quizComplete ? "Voir le bilan ↓" : "Terminez le défi") : "Continuer →";
  }

  function wireCurrentActivity() {
    document.querySelectorAll("[data-discovery]").forEach((button) => {
      button.addEventListener("click", () => updateDiscovery(button));
    });

    if ($("#quantity-slider")) {
      $("#quantity-slider").addEventListener("input", updateQuantity);
      updateQuantity();
    }

    if ($("#journey-slider")) {
      $("#journey-slider").addEventListener("input", updateJourney);
      updateJourney();
    }

    if ($("#heat-curve-slider")) {
      $("#heat-curve-slider").addEventListener("input", updateHeatingCurve);
      updateHeatingCurve();
    }

    if ($("#mass-slider")) {
      $("#mass-slider").addEventListener("input", updateEnergyFormula);
      updateEnergyFormula();
    }

    if ($("#evap-slider")) {
      $("#evap-slider").addEventListener("input", updateEvaporation);
      updateEvaporation();
    }

    if ($("#cooling-slider")) {
      $("#cooling-slider").addEventListener("input", updateCooling);
      updateCooling();
    }

    if ($("#cool-curve-slider")) {
      $("#cool-curve-slider").addEventListener("input", updateCoolingCurve);
      updateCoolingCurve();
    }

    document.querySelectorAll("[data-machine]").forEach((button) => {
      button.addEventListener("click", () => updateMachine(button.dataset.machine));
    });

    document.querySelectorAll("[data-fridge]").forEach((button) => {
      button.addEventListener("click", () => updateFridge(button.dataset.fridge));
    });

    document.querySelectorAll("[data-foundation]").forEach((button) => {
      button.addEventListener("click", () => updateFoundation(button));
    });

    document.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer)));
    });

    if ($("#quiz-restart")) {
      $("#quiz-restart").addEventListener("click", () => {
        quizIndex = 0;
        score = 0;
        answered = false;
        $("#zone").innerHTML = quizMarkup();
        wireCurrentActivity();
        updateCourseNavigation();
      });
    }
  }

  function updateDiscovery(button) {
    const messages = {
      ice: "Le glaçon reçoit de l’énergie de la pièce. Cette énergie lui permet de fondre.",
      pot: "La plaque transfère de l’énergie à la casserole, puis à l’eau : sa température monte, puis son état change.",
      lid: "La vapeur cède de l’énergie au couvercle froid. Elle se liquéfie et forme des gouttes.",
    };
    document.querySelectorAll("[data-discovery]").forEach((item) => item.classList.toggle("active", item === button));
    $("#discovery-feedback").textContent = messages[button.dataset.discovery];
  }

  function setEnergyBricks(selector, value, inverse) {
    const bricks = document.querySelectorAll(`${selector} i`);
    const activeCount = Math.round((value / 100) * bricks.length);
    bricks.forEach((brick, index) => brick.classList.toggle("on", inverse ? index >= bricks.length - activeCount : index < activeCount));
  }

  function qualitativeTemperature(value) {
    if (value < 25) return "froide";
    if (value < 60) return "tiède";
    return "chaude";
  }

  function updateQuantity() {
    const energy = Number($("#quantity-slider").value);
    const smallThreshold = 58;
    const largeThreshold = 92;
    const smallProgress = Math.min(100, (energy / smallThreshold) * 100);
    const largeProgress = Math.min(100, (energy / largeThreshold) * 100);
    const smallBoiling = energy >= smallThreshold;
    const largeBoiling = energy >= largeThreshold;

    $("#small-temp").style.height = `${8 + Math.min(92, smallProgress * 0.84)}%`;
    $("#large-temp").style.height = `${8 + Math.min(92, largeProgress * 0.84)}%`;
    $("#small-label").textContent = smallBoiling ? "bout déjà : température stable" : qualitativeTemperature(smallProgress);
    $("#large-label").textContent = largeBoiling ? "bout à son tour : température stable" : qualitativeTemperature(largeProgress);
    $("#small-cup").classList.toggle("boiling", smallBoiling);
    $("#large-cup").classList.toggle("boiling", largeBoiling);
    $("#small-energy-fill").style.width = `${energy}%`;
    $("#large-energy-fill").style.width = `${energy}%`;

    if (smallBoiling) {
      $("#small-energy-status").textContent = "Seuil atteint tôt : l’énergie suivante vaporise l’eau.";
    } else {
      $("#small-energy-status").textContent = "Énergie reçue : la petite quantité se réchauffe vite.";
    }
    if (largeBoiling) {
      $("#large-energy-status").textContent = "Seuil atteint après davantage d’énergie.";
    } else {
      $("#large-energy-status").textContent = "Énergie reçue : la grande quantité demande encore de l’énergie.";
    }

    if (largeBoiling) {
      $("#quantity-conclusion").innerHTML = "<strong>Comparaison terminée :</strong> les deux casseroles bouillent, mais la grande quantité a dû recevoir beaucoup plus d’énergie avant d’atteindre son palier.";
    } else if (smallBoiling) {
      $("#quantity-conclusion").innerHTML = "<strong>Regardez la différence :</strong> la petite casserole bout déjà et utilise l’énergie pour vaporiser l’eau ; la grande est encore en train de monter en température.";
    } else {
      $("#quantity-conclusion").innerHTML = "<strong>Avant l’ébullition :</strong> les deux reçoivent la même énergie, mais la température de la petite quantité monte plus vite.";
    }
    $("#quantity-energy-label").textContent = energy < 20 ? "très peu" : energy < 55 ? "augmente" : energy < 90 ? "beaucoup" : "maximum de la simulation";
    setEnergyBricks("#quantity-energy", energy, false);
  }

  function updateJourney() {
    const energy = Number($("#journey-slider").value);
    let stage;
    let badge;
    let title;
    let copy;
    let temperatureState;
    let temperatureHeight;
    let temperatureValue;
    let energyEffect;
    let heatType;
    let label;
    let liquidHeight;
    let graphX;
    let graphY;
    let graphNote;

    if (energy < 15) {
      const ratio = energy / 15;
      stage = "stage-ice";
      badge = "Solide";
      title = "Le glaçon se réchauffe";
      copy = "L’énergie reçue fait monter sa température. Il reste solide.";
      temperatureState = "monte";
      temperatureValue = -20 + 20 * ratio;
      energyEffect = "réchauffer la glace";
      heatType = "sensible";
      label = "glace qui se réchauffe";
      liquidHeight = 0;
      graphX = 88 + 87 * ratio;
      graphY = 250 - 35 * ratio;
      graphNote = "<strong>De −20 à 0 °C :</strong> l’énergie augmente la température de la glace. C’est de la chaleur sensible.";
    } else if (energy < 33) {
      const ratio = (energy - 15) / 18;
      stage = "stage-melting";
      badge = "Solide + liquide";
      title = "Le glaçon fond";
      copy = "L’énergie transforme la glace en eau. Le thermomètre reste bloqué à 0 °C.";
      temperatureState = "stable";
      temperatureValue = 0;
      energyEffect = "faire fondre la glace";
      heatType = "latent";
      label = "fusion en cours";
      liquidHeight = 18 + ratio * 34;
      graphX = 175 + 117 * ratio;
      graphY = 215;
      graphNote = "<strong>Palier à 0 °C :</strong> l’énergie entre toujours, mais elle sert à faire fondre la glace. La température ne change pas.";
    } else if (energy < 56) {
      const ratio = (energy - 33) / 23;
      stage = "stage-liquid";
      badge = "Liquide";
      title = "L’eau liquide se réchauffe";
      copy = "Toute la glace a fondu. L’énergie fait maintenant monter l’eau de 0 vers 100 °C.";
      temperatureState = "monte";
      temperatureValue = 100 * ratio;
      energyEffect = "réchauffer l’eau liquide";
      heatType = "sensible";
      label = "eau qui se réchauffe";
      liquidHeight = 55;
      graphX = 292 + 138 * ratio;
      graphY = 215 - 135 * ratio;
      graphNote = "<strong>De 0 à 100 °C :</strong> l’eau reste liquide et sa température augmente. La courbe remonte.";
    } else if (energy < 83) {
      const ratio = (energy - 56) / 27;
      stage = "stage-boiling";
      badge = "Liquide + vapeur";
      title = "L’eau bout et devient vapeur";
      copy = "Les bulles se forment et le niveau baisse. L’énergie entre toujours, mais le thermomètre reste à 100 °C.";
      temperatureState = "stable";
      temperatureValue = 100;
      energyEffect = "vaporiser l’eau";
      heatType = "latent";
      label = "vaporisation en cours";
      liquidHeight = 55 * (1 - ratio);
      graphX = 430 + 195 * ratio;
      graphY = 80;
      graphNote = "<strong>Grand palier à 100 °C :</strong> l’énergie continue d’entrer et transforme l’eau liquide en vapeur. La température ne monte plus.";
    } else {
      const ratio = (energy - 83) / 17;
      stage = "stage-vapor";
      badge = "Vapeur";
      title = "La vapeur se réchauffe";
      copy = "La dernière goutte a disparu. L’énergie ajoutée peut maintenant faire dépasser 100 °C à la vapeur.";
      temperatureState = "monte";
      temperatureValue = 100 + 20 * ratio;
      energyEffect = "réchauffer la vapeur";
      heatType = "sensible";
      label = "vapeur qui se réchauffe";
      liquidHeight = 0;
      graphX = 625 + 85 * ratio;
      graphY = 80 - 38 * ratio;
      graphNote = "<strong>Au-delà de 100 °C :</strong> il ne reste que de la vapeur. L’énergie augmente de nouveau sa température.";
    }

    temperatureHeight = 5 + ((temperatureValue + 20) / 140) * 90;
    const roundedTemperature = Math.round(temperatureValue);
    const temperatureLabel = `${roundedTemperature < 0 ? "−" : ""}${Math.abs(roundedTemperature)} °C`;
    $("#journey-vessel").className = `journey-vessel ${stage}`;
    $("#journey-liquid").style.height = `${liquidHeight}%`;
    $("#journey-badge").textContent = badge;
    $("#journey-title").textContent = title;
    $("#journey-copy").textContent = copy;
    $("#journey-temp-state").textContent = temperatureState;
    $("#journey-temp-value").textContent = temperatureLabel;
    $("#journey-energy-state").textContent = temperatureState === "stable" ? "augmente encore" : "augmente";
    $("#journey-energy-effect").textContent = energyEffect;
    $("#journey-temperature").style.height = `${temperatureHeight}%`;
    $("#journey-label").textContent = label;
    $("#journey-vessel-temperature").className = `vessel-temperature ${temperatureState === "stable" ? "stable" : "rising"}`;
    $("#journey-vessel-temp-value").textContent = temperatureLabel;
    $("#journey-vessel-temp-trend").textContent = temperatureState === "stable" ? "reste stable →" : "monte ↗";
    $("#journey-graph-type").className = `graph-type ${heatType}`;
    $("#journey-graph-type").textContent = heatType === "latent" ? "CHALEUR LATENTE" : "CHALEUR SENSIBLE";
    $("#journey-graph-marker").setAttribute("cx", graphX.toFixed(1));
    $("#journey-graph-marker").setAttribute("cy", graphY.toFixed(1));
    $("#journey-graph-line").setAttribute("x1", graphX.toFixed(1));
    $("#journey-graph-line").setAttribute("x2", graphX.toFixed(1));
    $("#journey-graph-line").setAttribute("y1", graphY.toFixed(1));
    $("#journey-graph-note").innerHTML = graphNote;
    setEnergyBricks("#journey-energy", energy, false);
  }

  function updateHeatingCurve() {
    const energy = Number($("#heat-curve-slider").value);
    let x;
    let y;
    let type;
    let typeClass;
    let title;
    let copy;
    let temperature;
    let state;
    let label;

    if (energy < 17) {
      const ratio = energy / 17;
      x = 80 + 105 * ratio;
      y = 280 - 50 * ratio;
      type = "CHALEUR SENSIBLE";
      typeClass = "sensible";
      title = "Le solide se réchauffe";
      copy = "La courbe monte : l’énergie reçue augmente la température du solide.";
      temperature = "monte ↗";
      state = "solide";
      label = "solide qui se réchauffe";
    } else if (energy < 35) {
      const ratio = (energy - 17) / 18;
      x = 185 + 115 * ratio;
      y = 230;
      type = "CHALEUR LATENTE DE FUSION";
      typeClass = "latent";
      title = "Le solide fond";
      copy = "La courbe est plate : l’énergie transforme le solide en liquide.";
      temperature = "stable →";
      state = "solide + liquide";
      label = "palier de fusion";
    } else if (energy < 52) {
      const ratio = (energy - 35) / 17;
      x = 300 + 110 * ratio;
      y = 230 - 80 * ratio;
      type = "CHALEUR SENSIBLE";
      typeClass = "sensible";
      title = "Le liquide se réchauffe";
      copy = "La courbe remonte : l’état reste liquide et la température augmente.";
      temperature = "monte ↗";
      state = "liquide";
      label = "liquide qui se réchauffe";
    } else if (energy < 81) {
      const ratio = (energy - 52) / 29;
      x = 410 + 180 * ratio;
      y = 150;
      type = "CHALEUR LATENTE DE VAPORISATION";
      typeClass = "latent";
      title = "Le liquide devient vapeur";
      copy = "La longue partie plate représente l’énergie absorbée pendant la vaporisation.";
      temperature = "stable →";
      state = "liquide + vapeur";
      label = "palier de vaporisation";
    } else {
      const ratio = (energy - 81) / 19;
      x = 590 + 110 * ratio;
      y = 150 - 75 * ratio;
      type = "CHALEUR SENSIBLE";
      typeClass = "sensible";
      title = "La vapeur se réchauffe";
      copy = "Après la dernière goutte, l’énergie reçue augmente la température de la vapeur.";
      temperature = "monte ↗";
      state = "vapeur";
      label = "vapeur qui se réchauffe";
    }

    $("#heat-curve-marker").setAttribute("cx", x.toFixed(1));
    $("#heat-curve-marker").setAttribute("cy", y.toFixed(1));
    $("#heat-curve-line").setAttribute("x1", x.toFixed(1));
    $("#heat-curve-line").setAttribute("x2", x.toFixed(1));
    $("#heat-curve-line").setAttribute("y1", y.toFixed(1));
    $("#heat-curve-type").className = `graph-type ${typeClass}`;
    $("#heat-curve-type").textContent = type;
    $("#heat-curve-title").textContent = title;
    $("#heat-curve-copy").textContent = copy;
    $("#heat-curve-temp").textContent = temperature;
    $("#heat-curve-state").textContent = state;
    $("#heat-curve-label").textContent = label;
  }

  function updateEnergyFormula() {
    const mass = Number($("#mass-slider").value);
    const labels = ["petite", "moyenne", "grande"];
    const conclusions = [
      "Petite masse : petite quantité d’énergie à transférer.",
      "Masse doublée : énergie nécessaire doublée, toutes choses égales par ailleurs.",
      "Masse triplée : énergie nécessaire triplée, toutes choses égales par ailleurs.",
    ];
    $("#mass-label").textContent = labels[mass - 1];
    $("#sensible-energy-bar").style.width = `${mass * 30}%`;
    $("#latent-energy-bar").style.width = `${mass * 30}%`;
    $("#mass-conclusion").textContent = conclusions[mass - 1];
  }

  function updateEvaporation() {
    const progress = Number($("#evap-slider").value);
    const ratio = progress / 100;
    const graphX = 105 + 315 * ratio;
    const liquidHeight = 68 * (1 - ratio);
    const localTempHeight = 86 - 42 * ratio;
    const remainingEnergy = Math.round(8 * (1 - ratio));

    $("#evaporator-liquid").style.height = `${liquidHeight}%`;
    $("#evaporator-vessel").classList.toggle("nearly-vapor", progress >= 88);
    $("#local-temperature-fill").style.height = `${localTempHeight}%`;
    $("#evap-graph-marker").setAttribute("cx", graphX.toFixed(1));
    $("#evap-graph-line").setAttribute("x1", graphX.toFixed(1));
    $("#evap-graph-line").setAttribute("x2", graphX.toFixed(1));
    $("#local-energy").querySelectorAll("i").forEach((brick, index) => brick.classList.toggle("transferred", index >= remainingEnergy));

    if (progress < 8) {
      $("#evaporation-title").textContent = "La première bulle apparaît";
      $("#evaporation-copy").textContent = "Le fluide commence à prendre de l’énergie au local et à se vaporiser.";
      $("#evap-label").textContent = "point de bulle";
      $("#local-temperature-label").textContent = "commence à diminuer";
      $("#effect-frigorifique").innerHTML = "<strong>Effet frigorifique :</strong> dès que l’énergie quitte le local, celui-ci commence à se refroidir.";
    } else if (progress < 90) {
      $("#evaporation-title").textContent = "Liquide et vapeur coexistent";
      $("#evaporation-copy").textContent = "Le point avance sur le palier : l’énergie absorbée augmente, la température du fluide reste stable.";
      $("#evap-label").textContent = "vaporisation en cours";
      $("#local-temperature-label").textContent = "le local se refroidit";
      $("#effect-frigorifique").innerHTML = "<strong>Effet frigorifique visible :</strong> le niveau de liquide baisse pendant que le local cède de plus en plus d’énergie.";
    } else {
      $("#evaporation-title").textContent = "La dernière goutte disparaît";
      $("#evaporation-copy").textContent = "Toute l’énergie du palier a été absorbée : le fluide est maintenant entièrement vapeur.";
      $("#evap-label").textContent = "point de rosée atteint";
      $("#local-temperature-label").textContent = "a cédé beaucoup d’énergie";
      $("#effect-frigorifique").innerHTML = "<strong>Étape suivante :</strong> cette vapeur transporte l’énergie prise dedans ; il faudra la liquéfier dehors pour recommencer.";
    }
  }

  function updateCooling() {
    const removed = Number($("#cooling-slider").value);
    let stage;
    let badge;
    let title;
    let copy;
    let temperatureState;
    let label;
    let liquidHeight;

    if (removed < 22) {
      stage = "stage-hot-vapor";
      badge = "Vapeur";
      title = "La vapeur se refroidit";
      copy = "Elle cède de l’énergie, mais reste encore entièrement vapeur.";
      temperatureState = "baisse";
      label = "vapeur qui se refroidit";
      liquidHeight = 0;
    } else if (removed < 74) {
      const ratio = (removed - 22) / 52;
      stage = "stage-condensing";
      badge = "Vapeur + liquide";
      title = "La vapeur se liquéfie";
      copy = "Elle cède de l’énergie à l’extérieur. La température reste stable dans le modèle.";
      temperatureState = "stable";
      label = "liquéfaction en cours";
      liquidHeight = 15 + ratio * 55;
    } else {
      const ratio = (removed - 74) / 26;
      stage = "stage-cold-liquid";
      badge = "Liquide";
      title = "Le liquide se sous-refroidit";
      copy = "La liquéfaction est terminée. En cédant encore de l’énergie, le liquide se refroidit.";
      temperatureState = "baisse";
      label = "liquide qui se refroidit";
      liquidHeight = 70;
      $("#cooling-vessel").style.setProperty("--cool", String(ratio));
    }

    $("#cooling-vessel").className = `cooling-vessel ${stage}`;
    $("#cooling-liquid").style.height = `${liquidHeight}%`;
    $("#cooling-badge").textContent = badge;
    $("#cooling-title").textContent = title;
    $("#cooling-copy").textContent = copy;
    $("#cooling-temp-state").textContent = temperatureState;
    $("#cooling-label").textContent = label;
    setEnergyBricks("#cooling-energy", removed, true);
  }

  function updateCoolingCurve() {
    const removed = Number($("#cool-curve-slider").value);
    let x;
    let y;
    let type;
    let typeClass;
    let title;
    let copy;
    let temperature;
    let state;
    let label;

    if (removed < 25) {
      const ratio = removed / 25;
      x = 80 + 150 * ratio;
      y = 75 + 75 * ratio;
      type = "CHALEUR SENSIBLE CÉDÉE";
      typeClass = "sensible";
      title = "La vapeur se refroidit";
      copy = "Avant la première goutte, la vapeur cède de l’énergie et sa température baisse.";
      temperature = "baisse ↘";
      state = "vapeur";
      label = "désurchauffe de la vapeur";
    } else if (removed < 75) {
      const ratio = (removed - 25) / 50;
      x = 230 + 280 * ratio;
      y = 150;
      type = "CHALEUR LATENTE DE LIQUÉFACTION";
      typeClass = "latent";
      title = "La vapeur devient liquide";
      copy = "La partie plate représente l’énergie rejetée pendant toute la liquéfaction.";
      temperature = "stable →";
      state = "vapeur + liquide";
      label = "palier de liquéfaction";
    } else {
      const ratio = (removed - 75) / 25;
      x = 510 + 180 * ratio;
      y = 150 + 100 * ratio;
      type = "CHALEUR SENSIBLE CÉDÉE";
      typeClass = "sensible";
      title = "Le liquide se refroidit";
      copy = "Après la dernière bulle, le liquide cède encore de l’énergie : il se sous-refroidit.";
      temperature = "baisse ↘";
      state = "liquide";
      label = "sous-refroidissement du liquide";
    }

    $("#cool-curve-marker").setAttribute("cx", x.toFixed(1));
    $("#cool-curve-marker").setAttribute("cy", y.toFixed(1));
    $("#cool-curve-line").setAttribute("x1", x.toFixed(1));
    $("#cool-curve-line").setAttribute("x2", x.toFixed(1));
    $("#cool-curve-line").setAttribute("y1", y.toFixed(1));
    $("#cool-curve-type").className = `graph-type ${typeClass}`;
    $("#cool-curve-type").textContent = type;
    $("#cool-curve-title").textContent = title;
    $("#cool-curve-copy").textContent = copy;
    $("#cool-curve-temp").textContent = temperature;
    $("#cool-curve-state").textContent = state;
    $("#cool-curve-label").textContent = label;
  }

  function updateMachine(mode) {
    document.querySelectorAll("[data-machine]").forEach((button) => button.classList.toggle("active", button.dataset.machine === mode));
    $("#circuit-stage").className = `circuit-stage mode-${mode}`;

    if (mode === "evap") {
      $("#exchange-kicker").textContent = "LE FLUIDE REÇOIT";
      $("#exchange-title").textContent = "Évaporateur";
      $("#exchange-copy").textContent = "Le liquide devient vapeur en absorbant l’énergie du local.";
      $("#circuit-arrow").textContent = "→";
      $("#machine-feedback").textContent = "Le local ne reçoit pas du « froid » : il perd de l’énergie au profit du fluide.";
    } else {
      $("#exchange-kicker").textContent = "LE FLUIDE CÈDE";
      $("#exchange-title").textContent = "Condenseur";
      $("#exchange-copy").textContent = "La vapeur devient liquide en cédant l’énergie vers l’extérieur.";
      $("#circuit-arrow").textContent = "→";
      $("#machine-feedback").textContent = "L’air ou l’eau extérieurs emportent l’énergie : c’est ainsi que la vapeur peut se liquéfier.";
    }
  }

  function updateFridge(zone) {
    const content = {
      evap: {
        type: "1 · ABSORBER",
        title: "L’intérieur se refroidit",
        copy: "L’évaporateur reçoit l’énergie de l’air et des aliments. Le fluide y passe principalement par son palier de vaporisation.",
      },
      comp: {
        type: "2 · AJOUTER DU TRAVAIL",
        title: "Le compresseur fournit l’effort",
        copy: "Il reçoit de l’énergie électrique et la transmet au fluide. Cette énergie devra aussi être rejetée par le condenseur.",
      },
      cond: {
        type: "3 · RESTITUER",
        title: "La grille arrière chauffe la pièce",
        copy: "Le condenseur rejette l’énergie prise dans le réfrigérateur plus celle reçue par le compresseur. La vapeur s’y liquéfie.",
      },
      det: {
        type: "4 · PRÉPARER LE RETOUR",
        title: "Le détendeur ferme la boucle",
        copy: "Il prépare le fluide à retourner dans l’évaporateur. La relation pression–température expliquera précisément comment dans le module suivant.",
      },
    };
    document.querySelectorAll("[data-fridge]").forEach((button) => button.classList.toggle("active", button.dataset.fridge === zone));
    $("#fridge-type").textContent = content[zone].type;
    $("#fridge-title").textContent = content[zone].title;
    $("#fridge-copy").textContent = content[zone].copy;
  }

  function updateFoundation(button) {
    const group = button.dataset.foundation;
    const correct = button.dataset.correct === "true";
    document.querySelectorAll(`[data-foundation="${group}"]`).forEach((item) => {
      item.disabled = true;
      if (item.dataset.correct === "true") item.classList.add("good");
      else if (item === button) item.classList.add("bad");
    });
    const feedback = group === "superheat" ? $("#superheat-feedback") : $("#subcool-feedback");
    feedback.textContent = correct
      ? group === "superheat"
        ? "✓ Exact : il ne reste que de la vapeur. L’énergie supplémentaire augmente sa température : c’est la surchauffe."
        : "✓ Exact : il ne reste que du liquide. En cédant encore de l’énergie, sa température baisse : c’est le sous-refroidissement."
      : group === "superheat"
        ? "Le palier est terminé : la dernière goutte a disparu. La vapeur seule recommence donc à changer de température."
        : "Le palier est terminé : la dernière bulle a disparu. Le liquide seul recommence donc à changer de température.";
  }

  function answerQuestion(choice) {
    if (answered) return;
    answered = true;
    const question = questions[quizIndex];
    const correct = choice === question.correct;

    document.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      else if (index === choice) button.classList.add("bad");
    });

    if (correct) score += 1;
    $("#quiz-feedback").innerHTML = `${correct ? "✓" : "✗"} ${question.why} <button class="nav" id="quiz-next" type="button">${quizIndex === questions.length - 1 ? "Voir le résultat" : "Question suivante"}</button>`;
    $("#quiz-next").addEventListener("click", () => {
      quizIndex += 1;
      answered = false;
      $("#zone").innerHTML = quizMarkup();
      wireCurrentActivity();
      updateCourseNavigation();
    });
  }

  function updateListenButton() {
    const icon = $("#listen span");
    const label = $("#listen b");
    if (speaking && !paused) {
      icon.textContent = "Ⅱ";
      label.textContent = " Pause";
    } else if (paused) {
      icon.textContent = "▶";
      label.textContent = " Reprendre";
    } else {
      icon.textContent = "▶";
      label.textContent = " Écouter";
    }
  }

  function stopSpeech() {
    speechRun += 1;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    speaking = false;
    paused = false;
    updateListenButton();
  }

  function applyVoiceCue(cue) {
    if (cue.control) {
      const control = $(cue.control);
      if (control) {
        control.value = String(cue.value);
        control.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (cue.fridge && $("[data-fridge]")) updateFridge(cue.fridge);
    if (cue.machine && $("[data-machine]")) updateMachine(cue.machine);
  }

  function speakCurrent() {
    if (!voiceEnabled) return;
    if (!("speechSynthesis" in window)) {
      $("#speech-warning").hidden = false;
      return;
    }

    stopSpeech();
    loadVoices();
    const run = speechRun;
    const lesson = lessons[current];
    const steps = lesson.voiceSteps || [{ text: lesson.speak }];
    let stepIndex = 0;

    const speakStep = () => {
      if (run !== speechRun) return;
      if (stepIndex >= steps.length) {
        speaking = false;
        paused = false;
        updateListenButton();
        return;
      }

      const cue = steps[stepIndex];
      stepIndex += 1;
      applyVoiceCue(cue);

      const utterance = new SpeechSynthesisUtterance(cue.text);
      utterance.lang = selectedVoice ? selectedVoice.lang : "fr-FR";
      utterance.voice = selectedVoice;
      utterance.rate = rates[rateIndex];
      utterance.pitch = 1;
      utterance.onstart = () => {
        if (run !== speechRun) return;
        speaking = true;
        paused = false;
        updateListenButton();
      };
      utterance.onend = () => speakStep();
      utterance.onerror = (event) => {
        if (event.error === "canceled" || event.error === "interrupted" || run !== speechRun) return;
        speaking = false;
        paused = false;
        updateListenButton();
        $("#speech-warning").hidden = false;
      };
      speechSynthesis.speak(utterance);
    };

    speakStep();
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window)) {
      $("#speech-warning").hidden = false;
      return;
    }
    if (speaking && !paused) {
      speechSynthesis.pause();
      paused = true;
      updateListenButton();
      return;
    }
    if (paused) {
      speechSynthesis.resume();
      paused = false;
      updateListenButton();
      return;
    }
    speakCurrent();
  }

  function saveRate() {
    $("#speed-value").textContent = `${rates[rateIndex].toFixed(2).replace(".", ",")}×`;
    try {
      localStorage.setItem("chaleur-rate", String(rates[rateIndex]));
    } catch (_) {}
    if (speaking || paused) speakCurrent();
  }

  function goTo(index, continueNarration) {
    stopSpeech();
    current = Math.max(0, Math.min(lessons.length - 1, index));
    furthest = Math.max(furthest, current);
    render();
    if (continueNarration && voiceEnabled) setTimeout(speakCurrent, 300);
  }

  function startCourse() {
    autoplay = true;
    $("#module").scrollIntoView({ behavior: "smooth" });
    goTo(0, true);
  }

  buildStepper();
  saveRate();
  render();

  $("#start").addEventListener("click", startCourse);
  $("#prev").addEventListener("click", () => goTo(current - 1, autoplay));
  $("#next").addEventListener("click", () => {
    if (current === lessons.length - 1) {
      $(".final-message").scrollIntoView({ behavior: "smooth" });
      return;
    }
    goTo(current + 1, autoplay);
  });
  $("#listen").addEventListener("click", toggleSpeech);
  $("#slower").addEventListener("click", () => {
    rateIndex = Math.max(0, rateIndex - 1);
    saveRate();
  });
  $("#faster").addEventListener("click", () => {
    rateIndex = Math.min(rates.length - 1, rateIndex + 1);
    saveRate();
  });
  $("#voice-toggle").addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    $("#voice-toggle").setAttribute("aria-pressed", String(voiceEnabled));
    $("#voice-toggle").textContent = voiceEnabled ? "🔊 Voix active" : "🔇 Voix coupée";
    if (!voiceEnabled) stopSpeech();
  });
  $("#refs-toggle").addEventListener("click", () => {
    const open = $("#refs").hidden;
    $("#refs").hidden = !open;
    $("#refs-toggle").setAttribute("aria-expanded", String(open));
    if (open) $("#refs").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#restart").addEventListener("click", () => {
    autoplay = false;
    current = 0;
    furthest = 0;
    quizIndex = 0;
    score = 0;
    answered = false;
    goTo(0, false);
    scrollTo({ top: 0, behavior: "smooth" });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && !/INPUT|BUTTON/.test(document.activeElement.tagName)) goTo(Math.min(current + 1, lessons.length - 1), false);
    if (event.key === "ArrowLeft" && !/INPUT|BUTTON/.test(document.activeElement.tagName)) goTo(Math.max(current - 1, 0), false);
  });
  window.addEventListener("beforeunload", stopSpeech);
})();
