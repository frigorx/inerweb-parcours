(function initialiseFilterDrierCourse() {
  "use strict";

  const STORAGE_RATE = "inerweb-filtre-deshydrateur-rate";
  const RATE_VALUES = [0.8, 0.95, 1.1, 1.25];

  const ui = {
    stepper: document.getElementById("stepper"),
    kicker: document.getElementById("lesson-kicker"),
    title: document.getElementById("lesson-title"),
    intro: document.getElementById("lesson-intro"),
    detail: document.getElementById("lesson-detail"),
    takeaway: document.getElementById("lesson-takeaway"),
    visualTitle: document.getElementById("visual-title"),
    visualHint: document.getElementById("visual-hint"),
    controls: document.getElementById("visual-controls"),
    root: document.getElementById("visual-root"),
    caption: document.getElementById("visual-caption"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    progressLabel: document.getElementById("progress-label"),
    progressBar: document.getElementById("progress-bar"),
    voiceButton: document.getElementById("voice-button"),
    voiceRate: document.getElementById("voice-rate"),
    sourceButton: document.getElementById("source-button"),
    sourcesDialog: document.getElementById("sources-dialog"),
    status: document.getElementById("app-status")
  };

  let current = 0;
  let furthest = 0;
  let speechRun = 0;
  let speaking = false;
  let paused = false;
  let selectedVoice = null;
  let voiceRate = readRate();

  const quiz = {
    index: 0,
    score: 0,
    answered: false,
    complete: false
  };

  const quizQuestions = [
    {
      prompt: "Que faut-il vérifier avant de monter un filtre-déshydrateur unidirectionnel ?",
      answers: ["La couleur de la peinture", "La flèche de circulation", "La longueur du câble électrique"],
      correct: 1,
      why: "La flèche indique le sens imposé par la construction du modèle.",
      visual: "direction"
    },
    {
      prompt: "Quelle phrase décrit correctement ses deux fonctions principales ?",
      answers: ["Il comprime et refroidit", "Il filtre les solides et adsorbe l’humidité", "Il mesure et détend"],
      correct: 1,
      why: "La filtration concerne les particules ; la déshydratation concerne l’eau.",
      visual: "missions"
    },
    {
      prompt: "Tous les filtres-déshydrateurs contiennent-ils les mêmes billes libres ?",
      answers: ["Oui, toujours", "Non, il existe notamment des noyaux solides et des billes libres", "Seulement sur la ligne d’aspiration"],
      correct: 1,
      why: "La technologie interne dépend du modèle et de l’application.",
      visual: "technologies"
    },
    {
      prompt: "Quel modèle convient à un circuit réversible où le liquide circule dans les deux sens ?",
      answers: ["Un modèle bi-flow prévu pour cet usage", "N’importe quel modèle monté sans regarder la flèche", "Un filtre à huile"],
      correct: 0,
      why: "Le bi-flow possède une architecture interne conçue pour les deux sens de circulation.",
      visual: "biflow"
    },
    {
      prompt: "Que fait-on d’un modèle hermétique saturé ou pollué ?",
      answers: ["On le secoue", "On le chauffe pour le régénérer sur place", "On le remplace selon la procédure"],
      correct: 2,
      why: "Un modèle hermétique n’est pas ouvert ni régénéré sur le chantier.",
      visual: "replace"
    },
    {
      prompt: "Le filtre burn-out d’aspiration est-il un filtre liquide ordinaire posé au hasard ?",
      answers: ["Oui", "Non, c’est un composant spécialisé de dépollution", "Oui, si sa peinture est noire"],
      correct: 1,
      why: "La dépollution après burn-out exige un modèle, un dimensionnement et un suivi adaptés.",
      visual: "burnout"
    }
  ];

  const lessons = [
    {
      short: "Observer",
      kicker: "Écran 1 · Reconnaître",
      title: "Reconnaître le vrai composant",
      intro: "C’est ce petit cylindre posé directement sur la tuyauterie frigorifique.",
      detail: `<div class="fact"><strong>À voir :</strong> un corps fermé, une entrée, une sortie et une flèche.</div>
        <div class="warning-box"><strong>Avant le montage :</strong> je lis la flèche et la référence inscrites sur le corps.</div>`,
      takeaway: "Je reconnais d’abord le composant réel. Ensuite, je lis son sens.",
      visualTitle: "À quoi ressemble-t-il vraiment ?",
      visualHint: "Révèle la zone où se trouve la flèche sur un vrai modèle.",
      caption: "Vue réaliste inerWeb pour la reconnaissance — aucune référence commerciale précise.",
      render: renderObserve
    },
    {
      short: "Raccorder",
      kicker: "Écran 2 · Raccordements",
      title: "Vissé ou brasé : regarde l’embout",
      intro: "Le filtre travaille de la même façon. Seule sa liaison au tube change.",
      detail: `<div class="fact"><strong>Flare, donc vissé :</strong> un écrou serre l’extrémité évasée du tube. La liaison est démontable.</div>
        <div class="fact"><strong>À braser, souvent dit « à souder » :</strong> le tube entre dans l’embout cuivre. La brasure ferme la liaison.</div>`,
      takeaway: "Filetage et écrou = flare. Embout cuivre lisse = à braser.",
      visualTitle: "La différence se voit à l’extrémité",
      visualHint: "Affiche chaque raccord en grand.",
      caption: "Flare : LaurensvanLieshout · Wikimedia Commons · CC BY-SA 3.0 · recadrage inerWeb.",
      render: renderConnections
    },
    {
      short: "Placer",
      kicker: "Écran 3 · Ligne liquide",
      title: "Le retrouver, puis le placer",
      intro: "Observe le filtre réel sur une installation, puis replace-le sur la ligne liquide.",
      detail: `<div class="fact"><strong>Dans ce parcours :</strong> réservoir liquide → filtre-déshydrateur → voyant → détendeur.</div>
        <p>Sur le chantier, le schéma et la notice de l’installation restent prioritaires.</p>`,
      takeaway: "Je sais reconnaître le filtre dans la machine et sur le schéma.",
      visualTitle: "Du matériel réel au schéma",
      visualHint: "Commence par la photo, puis fais le placement.",
      caption: "Photo : AnyNameWillExpire · Wikimedia Commons · CC BY-SA 4.0.",
      render: renderPlacement
    },
    {
      short: "2 missions",
      kicker: "Écran 4 · Fonction",
      title: "Deux fonctions, deux barrières",
      intro: "Le filtre-déshydrateur protège le circuit contre les solides et contre l’eau résiduelle.",
      detail: `<div class="fact"><strong>FILTRER :</strong> le noyau poreux et les médias filtrants retiennent calamine, copeaux, boues et autres particules.</div>
        <div class="fact"><strong>DÉSHYDRATER :</strong> le tamis moléculaire adsorbe l’humidité restée après le tirage au vide ou entrée lors d’une intervention.</div>
        <div class="warning-box"><strong>À retenir :</strong> le filtre ne remplace jamais un bon tirage au vide.</div>`,
      takeaway: "Tamis moléculaire = eau. Média filtrant = particules.",
      visualTitle: "Voir chaque fonction",
      visualHint: "Avance de la pollution vers la prévention.",
      caption: "Billes 4A : GOKLuLe · Wikimedia Commons · CC BY-SA 3.0 ; autres vues inerWeb.",
      render: renderMissions
    },
    {
      short: "Ouvrir",
      kicker: "Écran 5 · Coupe",
      title: "Chaque pièce a une fonction",
      intro: "Les éléments sont maintenus serrés pour obliger le fluide à traverser les zones prévues.",
      detail: `<ul><li><strong>Corps acier :</strong> enveloppe hermétique soudée.</li>
        <li><strong>Ressort :</strong> maintient l’empilage en pression.</li>
        <li><strong>Noyau :</strong> adsorbe l’eau et, selon sa formule, des acides.</li>
        <li><strong>Feutre ou tamis :</strong> retient les particules.</li>
        <li><strong>Plaque :</strong> soutient et répartit le passage du fluide.</li></ul>`,
      takeaway: "Clique une étiquette : la flèche montre la pièce et le texte explique son rôle.",
      visualTitle: "Repérer les cinq éléments",
      visualHint: "Clique directement sur les étiquettes de la coupe.",
      caption: "Rendu 3D manuel inerWeb — construction générique, pas un plan constructeur.",
      render: renderInside
    },
    {
      short: "Technologies",
      kicker: "Écran 6 · Construction",
      title: "Noyau solide ou billes libres",
      intro: "Le mot « pierres » ne décrit pas correctement tous les modèles.",
      detail: `<div class="fact"><strong>Noyau solide :</strong> le matériau dessiccant forme un bloc poreux maintenu dans le corps.</div>
        <div class="fact"><strong>Billes libres :</strong> certains petits corps en cuivre renferment des grains avec un tamis ou un mat filtrant.</div>`,
      takeaway: "Je nomme la technologie du modèle observé.",
      visualTitle: "Deux familles internes",
      visualHint: "Compare un noyau moulé avec de vraies billes dessiccantes.",
      caption: "Billes 4A : GOKLuLe · Wikimedia Commons · CC BY-SA 3.0 ; noyau 3D inerWeb.",
      render: renderTechnologies
    },
    {
      short: "Filtrer",
      kicker: "Écran 7 · Particules",
      title: "Les solides restent prisonniers",
      intro: "Le fluide poursuit son trajet. Les particules sont retenues dans le média filtrant.",
      detail: `<p>Cette retenue protège notamment les passages étroits situés en aval.</p>
        <div class="warning-box"><strong>Diagnostic :</strong> un filtre très encrassé peut créer une perte de charge, mais une observation seule ne suffit pas.</div>`,
      takeaway: "Le média laisse passer le fluide et retient les solides.",
      visualTitle: "Suivre les particules",
      visualHint: "Observe le média réel de principe, puis lance le flux.",
      caption: "Rendu 3D original : calamine et particules arrêtées avant la sortie.",
      render: renderFiltration
    },
    {
      short: "Adsorber",
      kicker: "Écran 8 · Humidité",
      title: "L’eau se fixe au dessiccant",
      intro: "Le tamis moléculaire retient l’eau dans sa structure poreuse.",
      detail: `<div class="key-box"><strong>Mot juste : adsorption.</strong> Les molécules se fixent sur les sites du matériau.</div>
        <p>Ce mécanisme est différent d’un simple tamis mécanique.</p>`,
      takeaway: "L’humidité est adsorbée ; elle n’est pas seulement filtrée.",
      visualTitle: "Fixer les molécules d’eau",
      visualHint: "Lance l’adsorption.",
      caption: "H₂O rejoint les sites disponibles du noyau dessiccant.",
      render: renderAdsorption
    },
    {
      short: "Acides",
      kicker: "Écran 9 · Formulation",
      title: "La capacité antiacide varie",
      intro: "Tous les noyaux n’utilisent pas la même formulation ni la même priorité.",
      detail: `<div class="fact"><strong>Tamis moléculaire :</strong> priorité à la capture de l’humidité.</div>
        <div class="fact"><strong>Mélange avec alumine activée :</strong> capacité antiacide renforcée selon la gamme.</div>`,
      takeaway: "Je vérifie la composition et l’application annoncées par le fabricant.",
      visualTitle: "Comparer deux priorités",
      visualHint: "Choisis une composition de principe.",
      caption: "Les barres sont qualitatives : aucune capacité chiffrée n’est inventée.",
      render: renderAcidCapacity
    },
    {
      short: "Saturation",
      kicker: "Écran 10 · Limite",
      title: "Le média n’est pas infini",
      intro: "À mesure qu’il retient des contaminants, sa capacité disponible diminue.",
      detail: `<div class="warning-box"><strong>Montage :</strong> garder les bouchons jusqu’au dernier moment limite l’exposition à l’air ambiant.</div>
        <p>Un modèle hermétique saturé ou pollué se remplace selon la procédure.</p>`,
      takeaway: "Un filtre-déshydrateur hermétique n’est pas régénéré sur le chantier.",
      visualTitle: "Une capacité qui se charge",
      visualHint: "Déplace la simulation pédagogique.",
      caption: "La jauge illustre un principe ; elle n’est pas une mesure terrain.",
      render: renderSaturation
    },
    {
      short: "Cartouches",
      kicker: "Écran 11 · Maintenance",
      title: "Le porte-cartouche s’ouvre dans l’axe",
      intro: "Les noyaux sont empilés dans l’enveloppe autour d’une tige de maintien.",
      detail: `<div class="fact"><strong>Ouverture :</strong> on dépose le couvercle boulonné et son joint.</div>
        <div class="fact"><strong>À l’intérieur :</strong> noyaux, joints feutre, plaques, tamis et ressort restent alignés dans le sens du fluide.</div>`,
      takeaway: "On remplace les noyaux et les joints prévus ; l’enveloppe reste en place.",
      visualTitle: "Un véritable porte-cartouche",
      visualHint: "Observe l’empilage axial ou compare les symboles.",
      caption: "Coupe 3D originale de principe, vérifiée sur des notices de montage DCR et Catch-All.",
      render: renderCartridge
    },
    {
      short: "Le cigare",
      kicker: "Écran 12 · Petit circuit",
      title: "Le petit modèle en cuivre",
      intro: "Le « cigare » est un petit filtre-déshydrateur utilisé avec un tube capillaire.",
      detail: `<div class="fact"><strong>Aspect :</strong> un petit corps cuivre avec deux tubes fins.</div>
        <div class="warning-box"><strong>Attention :</strong> il ne possède pas la capacité d’un gros filtre de ligne.</div>`,
      takeaway: "Même famille d’organe, application et dimensionnement différents.",
      visualTitle: "Reconnaître le « cigare »",
      visualHint: "Compare sa forme avec le filtre hermétique courant.",
      caption: "Rendu 3D original inerWeb — proportions pédagogiques.",
      render: renderCigar
    },
    {
      short: "Bi-flow",
      kicker: "Écran 13 · Réversibilité",
      title: "Une double flèche, deux sens permis",
      intro: "Le bi-flow est prévu pour la ligne liquide d’un circuit réversible, par exemple une pompe à chaleur.",
      detail: `<div class="fact"><strong>Sur le corps :</strong> deux flèches opposées indiquent que le passage est autorisé dans les deux sens.</div>
        <div class="fact"><strong>À l’intérieur :</strong> tamis des deux côtés et clapets dirigent toujours le fluide de l’extérieur du noyau vers son centre.</div>`,
      takeaway: "Le sens s’inverse, mais les particules restent retenues.",
      visualTitle: "Le même filtre, dans les deux sens",
      visualHint: "Inverse le flux et regarde les deux médias filtrants.",
      caption: "Coupe 3D de principe fondée sur la construction bi-flow documentée par Danfoss.",
      render: renderBiFlow
    },
    {
      short: "Burn-out",
      kicker: "Écran 14 · Dépollution",
      title: "Le burn-out rend l’huile acide",
      intro: "La chaleur, l’humidité et la décomposition de l’huile et du fluide créent une pollution agressive.",
      detail: `<div class="fact"><strong>Origine :</strong> défaut électrique ou surchauffe → isolants brûlés → huile noircie, acides, carbone et boues.</div>
        <div class="warning-box"><strong>Risque :</strong> les acides attaquent les métaux et les isolants du nouveau compresseur.</div>
        <p>Le filtre burn-out d’aspiration se place juste avant le compresseur et sa perte de charge doit être suivie.</p>`,
      takeaway: "On contrôle l’acidité de l’huile et on remplace les filtres selon la procédure de dépollution.",
      visualTitle: "De l’acide à la protection",
      visualHint: "Comprends l’origine, puis regarde le filtre spécialisé.",
      caption: "Chimie volontairement légère ; aucune valeur de pression ou de durée n’est inventée.",
      render: renderBurnout
    },
    {
      short: "S’entraîner",
      kicker: "Écran 15 · Vérifier",
      title: "Choisir sans confondre",
      intro: "Six situations permettent de vérifier les idées essentielles du parcours.",
      detail: `<div class="fact"><strong>Objectif proposé :</strong> 5 bonnes réponses sur 6.</div>
        <p>Chaque réponse est expliquée avant de passer à la suivante. Ce défi est un entraînement, pas un examen officiel.</p>`,
      takeaway: "J’identifie l’organe par sa fonction, sa ligne et son sens.",
      visualTitle: "Défi final",
      visualHint: "Une situation illustrée à la fois.",
      caption: "Tu peux recommencer le défi autant de fois que nécessaire.",
      render: renderQuiz
    }
  ];

  function readRate() {
    try {
      const stored = Number(localStorage.getItem(STORAGE_RATE));
      return RATE_VALUES.includes(stored) ? stored : 0.95;
    } catch (_error) {
      return 0.95;
    }
  }

  function saveRate(value) {
    try {
      localStorage.setItem(STORAGE_RATE, String(value));
    } catch (_error) {
      // Le parcours reste complet lorsque le stockage est indisponible.
    }
  }

  function announce(message) {
    ui.status.textContent = "";
    window.requestAnimationFrame(() => {
      ui.status.textContent = message;
    });
  }

  function setControls(html) {
    ui.controls.innerHTML = html || "";
  }

  function renderObserve() {
    setControls(`<button type="button" class="action-button primary" id="reveal-arrow">Révéler la flèche</button>`);
    ui.root.innerHTML = `<figure class="asset-figure realistic-asset">
      <img src="assets/images/filtre-hermetique-studio.webp" alt="Vue réaliste d’un filtre-déshydrateur hermétique noir avec deux embouts cuivre à braser.">
      <span class="asset-kind">VUE RÉALISTE</span>
      <figcaption class="arrow-callout" id="arrow-callout"><strong>ICI SUR LE CORPS</strong><span>la flèche impose le sens</span></figcaption>
    </figure>`;
    document.getElementById("reveal-arrow").addEventListener("click", (event) => {
      const callout = document.getElementById("arrow-callout");
      const visible = callout.classList.toggle("visible");
      event.currentTarget.textContent = visible ? "Masquer le repère" : "Révéler la flèche";
      announce(visible ? "Flèche de circulation révélée." : "Flèche de circulation masquée.");
    });
  }

  function renderConnections() {
    setControls(`<button type="button" class="choice-button active" data-connection="flare">Flare · vissé</button>
      <button type="button" class="choice-button" data-connection="solder">À braser · tube lisse</button>`);
    ui.root.innerHTML = `<div class="connection-gallery">
      <article class="connection-photo-panel active" data-card="flare">
        <div class="photo-frame flare-detail"><img src="assets/images/raccord-flare-detail.webp" alt="Coupe 3D d’un raccord flare montrant le filetage, l’écrou et l’extrémité évasée du tube."></div>
        <div class="connection-steps"><span><b>1</b> tube évasé</span><span><b>2</b> écrou</span><span><b>3</b> serrage mécanique</span></div>
        <p><strong>FLARE = VISSÉ ET DÉMONTABLE</strong></p>
      </article>
      <article class="connection-photo-panel" data-card="solder" hidden>
        <div class="photo-frame solder-detail"><img src="assets/images/filtre-hermetique-studio.webp" alt="Filtre-déshydrateur hermétique noir possédant deux embouts cuivre lisses à braser."><span class="solder-target left">EMBOUT LISSE</span><span class="solder-target right">EMBOUT LISSE</span></div>
        <div class="connection-steps"><span><b>1</b> tube inséré</span><span><b>2</b> chauffe maîtrisée</span><span><b>3</b> brasure</span></div>
        <p><strong>À BRASER = PAS D’ÉCROU</strong></p>
      </article>
    </div>`;
    ui.controls.querySelectorAll("[data-connection]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.connection;
        ui.controls.querySelectorAll("[data-connection]").forEach((item) => item.classList.toggle("active", item === button));
        ui.root.querySelectorAll("[data-card]").forEach((card) => {
          const active = card.dataset.card === value;
          card.classList.toggle("active", active);
          card.hidden = !active;
        });
        announce(value === "flare" ? "Raccord flare sélectionné." : "Raccord à braser sélectionné.");
      });
    });
  }

  function renderPlacement() {
    setControls(`<button type="button" class="choice-button active" data-placement-view="photo">1 · Le retrouver</button>
      <button type="button" class="choice-button" data-placement-view="line">2 · Le placer</button>`);

    function showPhoto() {
      ui.root.innerHTML = `<figure class="installation-photo">
        <img src="assets/photos/groupe-condensation-reel.jpg" alt="Groupe frigorifique réel. Le filtre-déshydrateur blanc est monté verticalement sur la droite.">
        <span class="photo-hotspot" aria-label="Filtre-déshydrateur repéré dans l’installation"><i></i><b>FILTRE-DÉSHYDRATEUR</b></span>
        <figcaption>Il est ici : le cylindre blanc monté sur la tuyauterie.</figcaption>
      </figure>`;
    }

    function showLine() {
      ui.root.innerHTML = `<div class="circuit-line" aria-label="Ordre des organes de la ligne liquide">
        <div class="line-device">Réservoir liquide</div>
        <button type="button" class="line-device target" data-place="before-sight">Placer avant le voyant</button>
        <div class="line-device">Voyant liquide</div>
        <button type="button" class="line-device target" data-place="after-sight">Placer après le voyant</button>
        <div class="line-device">Détendeur</div>
      </div>`;
      ui.root.querySelectorAll("[data-place]").forEach((button) => {
        button.addEventListener("click", () => {
          const correct = button.dataset.place === "before-sight";
          ui.root.querySelectorAll("[data-place]").forEach((item) => {
            item.classList.remove("correct");
            item.textContent = item.dataset.place === "before-sight" ? "Placer avant le voyant" : "Placer après le voyant";
          });
          if (correct) {
            button.classList.add("correct");
            button.textContent = "✓ Filtre-déshydrateur";
            announce("Correct. Le filtre est placé avant le voyant dans ce parcours.");
          } else {
            button.textContent = "✗ Pas ici dans ce parcours";
            announce("À revoir. Place le filtre avant le voyant.");
          }
        });
      });
    }

    showPhoto();
    ui.controls.querySelectorAll("[data-placement-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.placementView;
        ui.controls.querySelectorAll("[data-placement-view]").forEach((item) => item.classList.toggle("active", item === button));
        if (view === "photo") showPhoto(); else showLine();
        announce(view === "photo" ? "Filtre réel repéré sur l’installation." : "Place maintenant le filtre sur la ligne liquide.");
      });
    });
  }

  function renderMissions() {
    setControls(`<button type="button" class="choice-button active" data-function-view="filter">1 · Filtrer</button>
      <button type="button" class="choice-button" data-function-view="humidity">2 · Déshydrater</button>
      <button type="button" class="choice-button" data-function-view="nitrogen">3 · Pourquoi l’azote ?</button>`);

    function show(view) {
      if (view === "filter") {
        ui.root.innerHTML = `<div class="function-scene"><figure class="function-image"><img src="assets/images/filtration-tamis-3d.webp" alt="Coupe 3D montrant calamine, copeaux et particules arrêtés par le média filtrant."><span class="pollutant-tag scale">CALAMINE</span><span class="pollutant-tag chips">COPEAUX</span><span class="pollutant-tag sludge">BOUES</span></figure><article class="function-note"><strong>FILTRER LES SOLIDES</strong><p>Le noyau poreux, le feutre ou le tamis mécanique retiennent les corps étrangers avant les passages étroits.</p><b>Le fluide passe. Les particules restent.</b></article></div>`;
      } else if (view === "humidity") {
        ui.root.innerHTML = `<div class="function-scene"><figure class="function-image beads-photo"><img src="assets/images/tamis-moleculaire-billes.webp" alt="Photographie de billes de tamis moléculaire 4A utilisées comme dessiccant."><span class="water-drop w1">H₂O</span><span class="water-drop w2">H₂O</span><span class="water-drop w3">H₂O</span></figure><article class="function-note"><strong>DÉSHYDRATER LE CIRCUIT</strong><p>Le tamis moléculaire <em>adsorbe</em> l’eau résiduelle après évacuation ou entrée pendant une ouverture, une fuite sous vide ou un remplissage humide.</p><b>Il protège ; il ne remplace pas le tirage au vide.</b></article></div>`;
      } else {
        ui.root.innerHTML = `<div class="nitrogen-lesson"><div class="pipe-compare"><article><span class="pipe-section dirty"><i></i><i></i><i></i><i></i></span><strong>Sans azote sec</strong><small>Oxydes et calamine se forment à l’intérieur du cuivre.</small></article><article><span class="pipe-section clean"><b>N₂</b></span><strong>Avec balayage d’azote</strong><small>L’intérieur reste beaucoup plus propre pendant la brasure.</small></article></div><div class="warning-box"><strong>Le lien avec le filtre :</strong> moins de calamine créée, donc moins de particules à retenir. L’azote ne dispense ni du filtre ni du tirage au vide.</div></div>`;
      }
    }

    show("filter");
    ui.controls.querySelectorAll("[data-function-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.functionView;
        ui.controls.querySelectorAll("[data-function-view]").forEach((item) => item.classList.toggle("active", item === button));
        show(view);
        announce(view === "filter" ? "Le média retient les particules solides." : view === "humidity" ? "Le tamis moléculaire adsorbe l’humidité résiduelle." : "Le balayage d’azote limite la formation de calamine pendant la brasure.");
      });
    });
  }

  function renderInside() {
    const components = {
      shell: "Corps acier : enveloppe soudée et hermétique. Elle contient le fluide sous pression et protège l’empilage interne.",
      spring: "Ressort : il comprime l’empilage, maintient les contacts et limite les passages préférentiels autour du noyau.",
      core: "Noyau dessiccant poreux : le tamis moléculaire adsorbe l’eau ; certaines formulations ajoutent de l’alumine activée pour les acides.",
      mat: "Média filtrant : feutre polyester ou tamis selon la construction. Il retient les particules que le fluide transporte.",
      plate: "Plaque perforée : elle soutient le noyau et le média, répartit le flux et laisse le fluide traverser."
    };
    setControls(`<span class="fact">Les étiquettes sont cliquables directement sur la coupe.</span>`);
    ui.root.innerHTML = `<div class="cutaway-stage"><div class="cutaway-media"><img src="assets/images/coupe-filtre-3d.webp" alt="Rendu 3D en coupe avec cinq étiquettes pointant l’enveloppe, le ressort, le noyau, le média filtrant et la plaque perforée."><svg class="cutaway-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="part-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs><polyline data-line="shell" points="29,13 39,13 43,27"></polyline><polyline data-line="spring" points="17,82 25,66 34,50"></polyline><polyline data-line="core" points="48,84 53,66 58,50"></polyline><polyline data-line="mat" points="77,14 75,32 72,50"></polyline><polyline data-line="plate" points="88,82 83,66 76,50"></polyline></svg><button type="button" class="part-label shell" data-component="shell">Corps acier</button><button type="button" class="part-label spring" data-component="spring">Ressort</button><button type="button" class="part-label core" data-component="core">Noyau</button><button type="button" class="part-label mat" data-component="mat">Média filtrant</button><button type="button" class="part-label plate" data-component="plate">Plaque</button><span class="asset-kind">COUPE DE PRINCIPE</span></div><div class="component-readout" id="component-readout"><strong>Corps acier :</strong> enveloppe soudée et hermétique. Clique une autre étiquette pour suivre la construction.</div></div>`;
    ui.root.querySelectorAll("[data-component]").forEach((button) => {
      button.addEventListener("click", () => {
        const component = button.dataset.component;
        ui.root.querySelectorAll("[data-component]").forEach((item) => item.classList.toggle("active", item === button));
        ui.root.querySelectorAll("[data-line]").forEach((line) => line.classList.toggle("active", line.dataset.line === component));
        document.getElementById("component-readout").textContent = components[component];
        announce(`${button.textContent}. ${components[button.dataset.component]}`);
      });
    });
    ui.root.querySelector('[data-component="shell"]').classList.add("active");
    ui.root.querySelector('[data-line="shell"]').classList.add("active");
  }

  function renderTechnologies() {
    setControls(`<button type="button" class="choice-button active" data-core="solid">Noyau solide</button>
      <button type="button" class="choice-button" data-core="beads">Billes libres</button>`);
    ui.root.innerHTML = `<div class="technology-grid">
      <article class="technology-card active" data-core-card="solid"><img src="assets/images/noyau-solide-3d.webp" alt="Rendu 3D d’un noyau dessiccant solide, poreux et traversé par un canal central."><div><strong>Noyau solide poreux</strong><small>Bloc moulé et maintenu dans l’enveloppe. Grande surface interne pour adsorber l’eau.</small></div></article>
      <article class="technology-card" data-core-card="beads"><img src="assets/images/tamis-moleculaire-billes.webp" alt="Photographie de billes libres de tamis moléculaire 4A."><div><strong>Billes dessiccantes libres</strong><small>Grains retenus par un tamis ou un mat filtrant, notamment dans certains petits corps cuivre.</small></div></article>
    </div>`;
    ui.controls.querySelectorAll("[data-core]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.core;
        ui.controls.querySelectorAll("[data-core]").forEach((item) => item.classList.toggle("active", item === button));
        ui.root.querySelectorAll("[data-core-card]").forEach((card) => card.classList.toggle("active", card.dataset.coreCard === value));
        announce(value === "solid" ? "Noyau solide sélectionné." : "Billes dessiccantes libres sélectionnées.");
      });
    });
  }

  function renderFiltration() {
    setControls(`<button type="button" class="action-button primary" id="run-filtration">Lancer la filtration</button>`);
    ui.root.innerHTML = `<div class="filtration-split"><figure class="filtration-real"><img src="assets/images/filtration-tamis-3d.webp" alt="Vue 3D de particules et de calamine retenues par le média filtrant."><figcaption>Vue intérieure réaliste de principe</figcaption></figure><div class="flow-lab" id="flow-lab" aria-label="Animation de particules arrêtées par un média filtrant"><div class="flow-pipe"></div><div class="fluid-arrow"></div><div class="filter-mat" aria-label="Média filtrant"></div><span class="particle p1">1</span><span class="particle p2">2</span><span class="particle p3">3</span><span class="particle p4">4</span><span class="flow-label inlet">PARTICULES</span><span class="flow-label outlet">FLUIDE FILTRÉ</span></div></div>`;
    document.getElementById("run-filtration").addEventListener("click", () => {
      const lab = document.getElementById("flow-lab");
      lab.classList.remove("running");
      void lab.offsetWidth;
      lab.classList.add("running");
      announce("Les particules avancent puis restent retenues par le média filtrant.");
    });
  }

  function renderAdsorption() {
    setControls(`<button type="button" class="action-button primary" id="run-adsorption">Lancer l’adsorption</button>`);
    ui.root.innerHTML = `<div class="adsorption-lab" id="adsorption-lab" aria-label="Animation de molécules d’eau fixées sur un noyau dessiccant">
      <div class="core-block"></div><span class="water-molecule w1">H₂O</span><span class="water-molecule w2">H₂O</span><span class="water-molecule w3">H₂O</span>
    </div>`;
    document.getElementById("run-adsorption").addEventListener("click", () => {
      const lab = document.getElementById("adsorption-lab");
      lab.classList.remove("running");
      void lab.offsetWidth;
      lab.classList.add("running");
      announce("Les molécules d’eau se fixent sur des sites du noyau dessiccant.");
    });
  }

  function renderAcidCapacity() {
    setControls(`<button type="button" class="choice-button active" data-blend="dry">Priorité séchage</button>
      <button type="button" class="choice-button" data-blend="acid">Séchage + antiacide</button>`);
    ui.root.innerHTML = `<div class="composition-grid">
      <article class="composition-card active" data-blend-card="dry"><strong>Tamis moléculaire</strong><small>Priorité : forte adsorption de l’eau.</small><span>Séchage</span><div class="capacity-bar"><span style="width:88%"></span></div><span>Acides : vérifier la gamme</span><div class="capacity-bar acid"><span style="width:28%"></span></div></article>
      <article class="composition-card" data-blend-card="acid"><strong>Mélange de dessiccants</strong><small>Tamis moléculaire et alumine activée selon la gamme.</small><span>Séchage</span><div class="capacity-bar"><span style="width:76%"></span></div><span>Capacité antiacide renforcée</span><div class="capacity-bar acid"><span style="width:78%"></span></div></article>
    </div>`;
    ui.controls.querySelectorAll("[data-blend]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.blend;
        ui.controls.querySelectorAll("[data-blend]").forEach((item) => item.classList.toggle("active", item === button));
        ui.root.querySelectorAll("[data-blend-card]").forEach((card) => card.classList.toggle("active", card.dataset.blendCard === value));
        announce(value === "dry" ? "Composition orientée séchage." : "Composition avec capacité antiacide renforcée selon la gamme.");
      });
    });
  }

  function renderSaturation() {
    setControls(`<span class="fact">Simulation qualitative — pas un instrument de diagnostic.</span>`);
    ui.root.innerHTML = `<div class="saturation-lab">
      <div class="saturation-gauge" aria-hidden="true"><span id="gauge-fill"></span></div>
      <div class="saturation-control"><label for="saturation-range"><strong>Charge du média</strong></label><input id="saturation-range" type="range" min="0" max="100" value="20"><output class="saturation-state" id="saturation-state" for="saturation-range">Capacité largement disponible</output></div>
    </div>`;
    const range = document.getElementById("saturation-range");
    const fill = document.getElementById("gauge-fill");
    const state = document.getElementById("saturation-state");
    function update() {
      const value = Number(range.value);
      fill.style.height = `${value}%`;
      if (value < 45) {
        fill.style.background = "#3d7fca";
        state.textContent = "Capacité largement disponible";
      } else if (value < 80) {
        fill.style.background = "#b06a00";
        state.textContent = "Média fortement chargé";
      } else {
        fill.style.background = "#c0392b";
        state.textContent = "Saturation pédagogique : remplacement à prévoir";
      }
      announce(state.textContent);
    }
    range.addEventListener("input", update);
    update();
  }

  function renderCartridge() {
    setControls(`<button type="button" class="choice-button active" data-cartridge-view="open">Voir l’enveloppe ouverte</button>
      <button type="button" class="choice-button" data-cartridge-view="symbols">Comparer les symboles</button>`);
    function showSymbols() {
      ui.root.innerHTML = `<div class="symbol-grid"><article class="symbol-card"><img src="assets/symboles/filtre_deshydrateur.svg" alt="Symbole du filtre-déshydrateur hermétique"><strong>Filtre-déshydrateur</strong><small>Corps hermétique monté en ligne.</small></article><article class="symbol-card"><img src="assets/symboles/filtre_cartouche.svg" alt="Symbole du filtre à cartouche remplaçable"><strong>Filtre à cartouche</strong><small>Enveloppe démontable et noyaux remplaçables.</small></article></div>`;
    }
    function showOpen() {
      ui.root.innerHTML = `<figure class="cartridge-lab realistic-asset" id="cartridge-lab"><img src="assets/images/filtre-cartouche-3d.webp" alt="Coupe 3D d’un porte-cartouche avec deux noyaux coaxiaux, tige centrale, joints, tamis, ressort, bride et couvercle boulonné."><span class="asset-kind">PORTE-CARTOUCHE · COUPE DE PRINCIPE</span><span class="cartridge-point cores"><b>1</b>Noyaux alignés</span><span class="cartridge-point mesh"><b>2</b>Tamis et maintien</span><span class="cartridge-point cover"><b>3</b>Joint + couvercle</span><figcaption>Le couvercle se dépose dans l’axe ; les noyaux et les joints prévus se remplacent.</figcaption></figure>`;
      window.requestAnimationFrame(() => document.getElementById("cartridge-lab").classList.add("open"));
    }
    showOpen();
    ui.controls.querySelectorAll("[data-cartridge-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.cartridgeView;
        ui.controls.querySelectorAll("[data-cartridge-view]").forEach((item) => item.classList.toggle("active", item === button));
        if (view === "symbols") showSymbols(); else showOpen();
        announce(view === "symbols" ? "Comparaison des deux symboles." : "L’enveloppe s’ouvre et le noyau sort.");
      });
    });
  }

  function renderCigar() {
    setControls(`<span class="fact">Deux formes réelles à ne pas confondre.</span>`);
    ui.root.innerHTML = `<div class="real-image-compare"><figure><img src="assets/images/filtre-hermetique-studio.webp" alt="Filtre-déshydrateur hermétique noir de ligne liquide."><figcaption><strong>Filtre hermétique courant</strong><span>Corps acier · raccords plus importants</span></figcaption></figure><figure><img src="assets/images/filtre-cigare-3d.webp" alt="Rendu 3D d’un petit filtre-déshydrateur en cuivre pour tube capillaire."><figcaption><strong>Le « cigare »</strong><span>Petit corps cuivre · tubes fins</span></figcaption></figure></div>`;
  }

  function renderBiFlow() {
    setControls(`<button type="button" class="choice-button active" data-flow="forward">Mode froid →</button>
      <button type="button" class="choice-button" data-flow="reverse">← Mode chaud</button>`);
    ui.root.innerHTML = `<div class="biflow-product-lab" id="biflow-lab"><figure><img src="assets/images/biflow-coupe-3d.webp" alt="Coupe 3D d’un filtre-déshydrateur bi-flow avec un média filtrant de chaque côté du noyau."><span class="double-flow forward">FLUX →</span><span class="double-flow reverse">← FLUX</span><span class="mesh-callout left">TAMIS 1</span><span class="mesh-callout right">TAMIS 2</span></figure><div class="biflow-rule"><span>↔ <b>Deux flèches sur le corps</b></span><span>▥ <b>Un média de chaque côté</b></span><span>✓ <b>Particules toujours retenues</b></span></div></div>`;
    ui.controls.querySelectorAll("[data-flow]").forEach((button) => {
      button.addEventListener("click", () => {
        const reverse = button.dataset.flow === "reverse";
        ui.controls.querySelectorAll("[data-flow]").forEach((item) => item.classList.toggle("active", item === button));
        const lab = document.getElementById("biflow-lab");
        lab.classList.toggle("reverse", reverse);
        announce(reverse ? "Le flux traverse le bi-flow de droite à gauche." : "Le flux traverse le bi-flow de gauche à droite.");
      });
    });
  }

  function renderBurnout() {
    setControls(`<button type="button" class="choice-button active" data-burnout-view="origin">1 · D’où vient l’acidité ?</button><button type="button" class="choice-button" data-burnout-view="protect">2 · Comment protéger ?</button>`);

    function show(view) {
      if (view === "origin") {
        ui.root.innerHTML = `<div class="chemistry-story"><article><span class="chem-icon winding">ϟ</span><strong>Défaut ou surchauffe</strong><small>Les isolants et l’huile subissent une température anormale.</small></article><span class="process-arrow">→</span><article><span class="chem-icon oil">HUILE</span><strong>Décomposition</strong><small>Huile + fluide + humidité + chaleur produisent des composés agressifs.</small></article><span class="process-arrow">→</span><article class="acid-card"><span class="chem-icon acid">H⁺</span><strong>Acides, boues, carbone</strong><small>L’huile noircit et transporte la pollution dans le circuit.</small></article><span class="process-arrow">→</span><article class="damage-card"><span class="chem-icon coil">∿∿</span><strong>Nouveau moteur menacé</strong><small>Acides et dépôts attaquent métaux, isolants et passages fins.</small></article></div>`;
      } else {
        ui.root.innerHTML = `<div class="burnout-protection"><figure><img src="assets/images/filtre-burnout-3d.webp" alt="Rendu 3D d’un filtre burn-out d’aspiration avec une prise de pression près de chaque extrémité."><span class="pressure-tap left">PRISE AMONT</span><span class="pressure-tap right">PRISE AVAL</span></figure><div class="burnout-checks"><strong>Juste avant le nouveau compresseur</strong><span>1 · retenir acides, boues et particules</span><span>2 · mesurer la chute de pression</span><span>3 · contrôler l’acidité de l’huile</span><span>4 · remplacer selon la procédure</span></div></div>`;
      }
    }

    show("origin");
    ui.controls.querySelectorAll("[data-burnout-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.burnoutView;
        ui.controls.querySelectorAll("[data-burnout-view]").forEach((item) => item.classList.toggle("active", item === button));
        show(view);
        announce(view === "origin" ? "La chaleur et la décomposition créent acides, boues et carbone." : "Le filtre spécialisé protège le nouveau compresseur et sa chute de pression doit être suivie.");
      });
    });
  }

  function quizIllustration(kind) {
    const illustrations = {
      direction: `<div class="quiz-mini-product"><img src="assets/images/filtre-hermetique-studio.webp" alt=""><span class="quiz-mini-arrow">→</span></div><b>LIRE LA FLÈCHE</b>`,
      missions: `<div class="quiz-mini-product"><span class="mini-pollutants">◆ ◆</span><img src="assets/images/filtre-hermetique-studio.webp" alt=""><span class="mini-water">H₂O</span></div><b>SOLIDES + EAU</b>`,
      technologies: `<div class="quiz-mini-duo"><img src="assets/images/noyau-solide-3d.webp" alt=""><img src="assets/images/tamis-moleculaire-billes.webp" alt=""></div><b>DEUX CONSTRUCTIONS</b>`,
      biflow: `<div class="quiz-mini-product"><img src="assets/images/biflow-coupe-3d.webp" alt=""><span class="quiz-mini-double">↔</span></div><b>DOUBLE SENS</b>`,
      replace: `<div class="quiz-mini-product replace"><img src="assets/images/filtre-hermetique-studio.webp" alt=""><span>USÉ</span><i>→</i><img src="assets/images/filtre-hermetique-studio.webp" alt=""><span>NEUF</span></div><b>REMPLACER LE CORPS</b>`,
      burnout: `<div class="quiz-mini-product"><span class="mini-acid">H⁺</span><img src="assets/images/filtre-burnout-3d.webp" alt=""><span class="mini-coil">∿</span></div><b>DÉPOLLUTION</b>`
    };
    return illustrations[kind] || "";
  }

  function renderQuiz() {
    if (quiz.complete) {
      setControls(`<button type="button" class="action-button primary" id="restart-quiz">Refaire le défi</button>`);
      const success = quiz.score >= 5;
      ui.root.innerHTML = `<div class="quiz-result"><span class="quiz-score">${quiz.score}/6</span><strong>${success ? "Objectif atteint" : "Encore un passage utile"}</strong><p>${success ? "Tu distingues les principales familles et fonctions." : "Relis les écrans signalés par les corrections, puis recommence."}</p></div>`;
      document.getElementById("restart-quiz").addEventListener("click", resetQuiz);
      updateNavigation();
      return;
    }

    const question = quizQuestions[quiz.index];
    setControls(quiz.answered ? `<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>` : "");
    ui.root.innerHTML = `<div class="quiz-shell"><div class="quiz-meta"><span>Question ${quiz.index + 1} sur ${quizQuestions.length}</span><span>Score : ${quiz.score}</span></div><div class="quiz-question-grid"><figure class="quiz-illustration" aria-hidden="true">${quizIllustration(question.visual)}</figure><div class="quiz-question-body"><h3 class="quiz-prompt">${question.prompt}</h3><div class="quiz-answers">${question.answers.map((answer, index) => `<button type="button" class="quiz-choice" data-answer="${index}">${answer}</button>`).join("")}</div></div></div><div class="quiz-feedback" id="quiz-feedback">Choisis une réponse.</div></div>`;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuiz(Number(button.dataset.answer))));
    if (quiz.answered) restoreAnsweredQuiz(question);
  }

  function answerQuiz(answerIndex) {
    if (quiz.answered) return;
    quiz.answered = true;
    const question = quizQuestions[quiz.index];
    if (answerIndex === question.correct) quiz.score += 1;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => {
      const index = Number(button.dataset.answer);
      button.disabled = true;
      if (index === question.correct) button.classList.add("good");
      if (index === answerIndex && index !== question.correct) button.classList.add("bad");
    });
    const correct = answerIndex === question.correct;
    document.getElementById("quiz-feedback").innerHTML = `<strong>${correct ? "✓ Correct." : "✗ À revoir."}</strong> ${question.why}`;
    announce(`${correct ? "Correct." : "À revoir."} ${question.why}`);
    setControls(`<button type="button" class="action-button primary" id="next-question">${quiz.index === quizQuestions.length - 1 ? "Voir le bilan" : "Question suivante"}</button>`);
    document.getElementById("next-question").addEventListener("click", nextQuizQuestion);
  }

  function restoreAnsweredQuiz(question) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.innerHTML = `<strong>Réponse enregistrée.</strong> ${question.why}`;
    ui.root.querySelectorAll("[data-answer]").forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.answer) === question.correct) button.classList.add("good");
    });
    const nextQuestion = document.getElementById("next-question");
    if (nextQuestion) nextQuestion.addEventListener("click", nextQuizQuestion);
  }

  function nextQuizQuestion() {
    if (quiz.index >= quizQuestions.length - 1) {
      quiz.complete = true;
    } else {
      quiz.index += 1;
      quiz.answered = false;
    }
    renderQuiz();
  }

  function resetQuiz() {
    quiz.index = 0;
    quiz.score = 0;
    quiz.answered = false;
    quiz.complete = false;
    renderQuiz();
    updateNavigation();
    announce("Défi recommencé.");
  }

  function buildStepper() {
    ui.stepper.innerHTML = lessons.map((lesson, index) => `<button type="button" class="step-button" data-step="${index}" title="${lesson.short}"><span>${index + 1}</span><strong>${lesson.short}</strong></button>`).join("");
    ui.stepper.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => goTo(Number(button.dataset.step)));
    });
  }

  function renderCurrent() {
    stopSpeech();
    const lesson = lessons[current];
    ui.kicker.textContent = lesson.kicker;
    ui.title.textContent = lesson.title;
    ui.intro.textContent = lesson.intro;
    ui.detail.innerHTML = lesson.detail;
    ui.takeaway.textContent = lesson.takeaway;
    ui.visualTitle.textContent = lesson.visualTitle;
    ui.visualHint.textContent = lesson.visualHint;
    ui.caption.textContent = lesson.caption;
    lesson.render();
    updateNavigation();
    announce(`Écran ${current + 1} sur ${lessons.length}. ${lesson.title}`);
  }

  function updateNavigation() {
    furthest = Math.max(furthest, current);
    ui.stepper.querySelectorAll("[data-step]").forEach((button) => {
      const index = Number(button.dataset.step);
      button.classList.toggle("active", index === current);
      button.classList.toggle("done", index < current || index < furthest);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    ui.previous.disabled = current === 0;
    if (current === lessons.length - 1) {
      ui.next.disabled = !quiz.complete;
      ui.next.textContent = quiz.complete ? "Recommencer →" : "Terminer le défi";
    } else {
      ui.next.disabled = false;
      ui.next.textContent = current === lessons.length - 2 ? "Voir le défi →" : "Continuer →";
    }
    ui.progressLabel.textContent = `Écran ${current + 1} sur ${lessons.length}`;
    ui.progressBar.style.width = `${((current + 1) / lessons.length) * 100}%`;
  }

  function goTo(index) {
    const nextIndex = Math.max(0, Math.min(lessons.length - 1, index));
    if (nextIndex === current) return;
    current = nextIndex;
    renderCurrent();
  }

  function stripHtml(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    return (container.textContent || "").replace(/\s+/g, " ").trim();
  }

  function chooseVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const quality = /(natural|naturel|neural|online|google|microsoft|denise|henri|julie|paul|hortense)/i;
    return voices.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;

    function scoreVoice(voice) {
      let score = 0;
      const lang = (voice.lang || "").toLowerCase();
      if (lang === "fr-fr") score += 100;
      else if (lang.startsWith("fr")) score += 60;
      if (quality.test(voice.name || "")) score += 25;
      if (voice.localService) score += 2;
      return score;
    }
  }

  function updateVoiceButton() {
    if (!("speechSynthesis" in window)) {
      ui.voiceButton.disabled = true;
      ui.voiceButton.innerHTML = `▶ <span>Voix indisponible</span>`;
      return;
    }
    if (paused) {
      ui.voiceButton.innerHTML = `▶ <span>Reprendre</span>`;
      ui.voiceButton.setAttribute("aria-label", "Reprendre la lecture");
    } else if (speaking) {
      ui.voiceButton.innerHTML = `Ⅱ <span>Pause</span>`;
      ui.voiceButton.setAttribute("aria-label", "Mettre la lecture en pause");
    } else {
      ui.voiceButton.innerHTML = `▶ <span>Écouter</span>`;
      ui.voiceButton.setAttribute("aria-label", "Écouter l’écran");
    }
  }

  function startSpeech() {
    if (!("speechSynthesis" in window)) return;
    stopSpeech();
    const run = speechRun;
    const lesson = lessons[current];
    const text = `${lesson.title}. ${lesson.intro} ${stripHtml(lesson.detail)} À retenir : ${lesson.takeaway}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.pitch = 1;
    utterance.rate = voiceRate;
    selectedVoice = selectedVoice || chooseVoice();
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => {
      if (run !== speechRun) return;
      speaking = true;
      paused = false;
      updateVoiceButton();
    };
    utterance.onend = () => {
      if (run !== speechRun) return;
      speaking = false;
      paused = false;
      updateVoiceButton();
    };
    utterance.onerror = (event) => {
      if (run !== speechRun || event.error === "canceled" || event.error === "interrupted") return;
      speaking = false;
      paused = false;
      updateVoiceButton();
      announce("La lecture vocale n’est pas disponible. Le texte reste entièrement visible.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    speechRun += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speaking = false;
    paused = false;
    updateVoiceButton();
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window)) return;
    if (paused) {
      window.speechSynthesis.resume();
      paused = false;
      speaking = true;
      updateVoiceButton();
      return;
    }
    if (speaking) {
      window.speechSynthesis.pause();
      paused = true;
      updateVoiceButton();
      return;
    }
    startSpeech();
  }

  function isInteractiveTarget(target) {
    return Boolean(target.closest("button, input, select, textarea, a, [contenteditable='true']"));
  }

  ui.previous.addEventListener("click", () => goTo(current - 1));
  ui.next.addEventListener("click", () => {
    if (current === lessons.length - 1 && quiz.complete) {
      current = 0;
      furthest = 0;
      resetQuiz();
      renderCurrent();
      return;
    }
    goTo(current + 1);
  });

  ui.voiceButton.addEventListener("click", toggleSpeech);
  ui.voiceRate.value = String(voiceRate);
  ui.voiceRate.addEventListener("change", () => {
    voiceRate = Number(ui.voiceRate.value);
    saveRate(voiceRate);
    if (speaking || paused) startSpeech();
    announce(`Vitesse de lecture : ${ui.voiceRate.options[ui.voiceRate.selectedIndex].text}.`);
  });

  ui.sourceButton.addEventListener("click", () => {
    stopSpeech();
    ui.sourcesDialog.showModal();
  });

  document.addEventListener("keydown", (event) => {
    if (ui.sourcesDialog.open) return;
    if (isInteractiveTarget(event.target)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (current < lessons.length - 1) goTo(current + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (current > 0) goTo(current - 1);
    }
    if (event.code === "Space") {
      event.preventDefault();
      toggleSpeech();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSpeech();
  });
  window.addEventListener("beforeunload", stopSpeech);

  if ("speechSynthesis" in window) {
    selectedVoice = chooseVoice();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      selectedVoice = chooseVoice();
    });
  }

  buildStepper();
  updateVoiceButton();
  renderCurrent();
})();
