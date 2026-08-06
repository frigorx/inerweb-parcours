document.addEventListener('DOMContentLoaded', () => {
    const steps = [
        {
            number: "01",
            year: "1928 - 1930",
            kicker: "L’ère des premiers halocarbures",
            title: "L’invention des CFC",
            narration: "Thomas Midgley Jr. synthétise les chlorofluorocarbures, les fameux CFC. C’est une révolution industrielle majeure : ces fluides sont stables, ininflammables et non toxiques. Ils remplacent avantageusement des gaz dangereux comme l'ammoniac ou le chlorure de méthyle dans les premiers systèmes frigorifiques.",
            takeaway: "Une solution miracle pour l'époque, qui pose les bases de la climatisation moderne.",
            thread: "ozone",
            theme: "ozone"
        },
        {
            number: "02",
            year: "1974",
            kicker: "L’alerte scientifique",
            title: "L’hypothèse de Molina et Rowland",
            narration: "Deux chimistes, Mario Molina et Sherwood Rowland, publient une étude retentissante. Ils démontrent que les CFC, chimiquement inertes dans la basse atmosphère, s'accumulent dans la stratosphère où les ultraviolets solaires les détruisent, libérant du chlore qui attaque massivement la couche d'ozone.",
            takeaway: "La prise de conscience fondatrice de l'impact global de nos équipements sur l'atmosphère.",
            thread: "ozone",
            theme: "ozone"
        },
        {
            number: "03",
            year: "1985",
            kicker: "La preuve par les faits",
            title: "La découverte du trou d’ozone",
            narration: "Grâce aux relevés au sol menés depuis la station Halley en Antarctique, le British Antarctic Survey confirme l'existence d'un trou géant dans la couche d'ozone au-dessus du pôle Sud. L'alerte scientifique se transforme en urgence politique mondiale.",
            takeaway: "Le signal d'alarme ultime qui force les gouvernements à agir collectivement.",
            thread: "ozone",
            theme: "ozone"
        },
        {
            number: "04",
            year: "1987",
            kicker: "Le tournant diplomatique",
            title: "Le Protocole de Montréal",
            narration: "Ratifié par la quasi-totalité des nations de la planète, le Protocole de Montréal planifie l'élimination progressive des substances appauvrissant la couche d'ozone, en commençant par les CFC. C'est l'un des plus grands succès de la diplomatie environnementale.",
            takeaway: "La preuve irréfutable qu'une action environnementale globale et coordonnée est possible.",
            thread: "ozone",
            theme: "ozone"
        },
        {
            number: "05",
            year: "1990 - 1997",
            kicker: "La transition industrielle",
            title: "L’ère des HFC et Kyoto",
            narration: "Pour remplacer les CFC et HCFC nocifs pour l'ozone, l'industrie adopte massivement les hydrofluorocarbures, les HFC. Si la couche d'ozone est sauvée, on découvre rapidement qu'ils possèdent un pouvoir de réchauffement global des milliers de fois supérieur à celui du dioxyde de carbone.",
            takeaway: "Un problème majeur résolu d'un côté, mais un nouveau défi climatique créé de l'autre.",
            thread: "climate",
            theme: "climat"
        },
        {
            number: "06",
            year: "2015",
            kicker: "L'impératif climatique",
            title: "L’Accord de Paris",
            narration: "L'Accord de Paris fixe un cadre universel pour contenir le réchauffement climatique mondial bien en dessous de 2 degrés. Désormais, l'empreinte carbone et l'efficacité énergétique de chaque secteur d'activité, y compris le froid et la climatisation, sont scrutées à la loupe.",
            takeaway: "La réduction drastique des émissions de gaz à effet de serre devient la boussole réglementaire.",
            thread: "climate",
            theme: "climat"
        },
        {
            number: "07",
            year: "2016",
            kicker: "L'amendement de Kigali",
            title: "L’encadrement strict des HFC",
            narration: "L'amendement de Kigali au Protocole de Montréal intègre officiellement les HFC. Un calendrier mondial de réduction progressive de leur mise sur le marché est enclenché pour forcer l'industrie à basculer vers des fluides alternatifs.",
            takeaway: "L'étau réglementaire se resserre globalement sur les fluides à fort impact climatique.",
            thread: "climate",
            theme: "climat"
        },
        {
            number: "08",
            year: "2024",
            kicker: "Le nouveau cadre européen",
            title: "Le règlement F-Gas 2024/573",
            narration: "L'Union européenne adopte le nouveau règlement F-Gas. Il accélère radicalement la baisse des quotas de HFC mis sur le marché et programme l'interdiction pure et simple de certains fluides à fort PRG dans de nombreux équipements neufs.",
            takeaway: "L'obligation légale d'accélérer la transition vers des technologies bas carbone.",
            thread: "climate",
            theme: "climat"
        },
        {
            number: "09",
            year: "Demain",
            kicker: "Les alternatives durables",
            title: "Le choix des fluides naturels",
            narration: "Hydrocarbures comme le propane, dioxyde de carbone, ammoniac ou nouvelles générations de HFO... Les techniciens et frigoristes de demain doivent maîtriser des fluides souvent inflammables, toxiques ou fonctionnant sous très haute pression.",
            takeaway: "L'avenir appartient aux fluides écologiques, mais exige une technicité irréprochable.",
            thread: "climate",
            theme: "alternatives"
        },
        {
            number: "10",
            year: "Aujourd'hui et après",
            kicker: "Votre responsabilité",
            title: "L'art du confinement",
            narration: "Aucun fluide n'est parfait. Qu'il s'agisse de sécurité des biens et des personnes, de traçabilité des interventions ou de confinement rigoureux, c'est la compétence et la conscience du professionnel habilité qui garantissent la performance environnementale de toute installation.",
            takeaway: "Il n’existe pas de fluide parfait. Il existe des professionnels bien formés.",
            thread: "ozone",
            theme: "responsabilite"
        }
    ];

    let currentIndex = 0;
    let isPlaying = false;
    let isPaused = false;
    let synth = window.speechSynthesis;
    let currentUtterance = null;
    let bestFrenchVoice = null;

    function loadVoices() {
        if (!synth) return;
        const voices = synth.getVoices();
        // fr-FR d'abord, toujours : une voix fr-BE ou fr-CH prononce les
        // nombres à la belge/suisse (nonante, septante) au lieu du français
        // de France (quatre-vingt-dix), quel que soit utterance.lang.
        const isFrFR = v => v.lang.toLowerCase() === 'fr-fr';
        const isFr = v => v.lang.toLowerCase().startsWith('fr');
        const isQuality = v => /natural|google|online|neural/i.test(v.name);
        bestFrenchVoice = voices.find(v => isFrFR(v) && isQuality(v))
            || voices.find(isFrFR)
            || voices.find(v => isFr(v) && isQuality(v))
            || voices.find(isFr)
            || voices[0];
    }

    if (synth) {
        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }

    let audioCtx = null;
    let ambientGain = null;

    function toggleAmbientSound() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const bufferSize = audioCtx.sampleRate * 2;
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                let b0 = 0, b1 = 0, b2 = 0;

                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.03;
                }

                const whiteNoise = audioCtx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(180, audioCtx.currentTime);

                ambientGain = audioCtx.createGain();
                ambientGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

                whiteNoise.connect(filter);
                filter.connect(ambientGain);
                ambientGain.connect(audioCtx.destination);

                whiteNoise.start(0);
            } else if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            } else if (audioCtx.state === 'running') {
                audioCtx.suspend();
            }
        } catch (e) {
            console.log("Audio context bloqué par les politiques du navigateur.");
        }
    }

    const sceneNumber = document.getElementById('scene-number');
    const sceneKicker = document.getElementById('scene-kicker');
    const sceneYear = document.getElementById('scene-year');
    const sceneTitle = document.getElementById('scene-title');
    const sceneNarration = document.getElementById('scene-narration');
    const sceneTakeaway = document.getElementById('scene-takeaway');
    const stepStatus = document.getElementById('step-status');
    const playerProgress = document.getElementById('player-progress');
    const timelineProgress = document.getElementById('timeline-progress');
    const timeline = document.getElementById('timeline');
    const playButton = document.getElementById('play-button');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const replayButton = document.getElementById('replay-button');
    const restartButton = document.getElementById('restart-button');
    const sourceToggle = document.getElementById('source-toggle');
    const sourcesPanel = document.getElementById('sources-panel');
    const experience = document.getElementById('experience');
    const speechWarning = document.getElementById('speech-warning');
    const visualA = document.getElementById('scene-visual-a');
    const visualB = document.getElementById('scene-visual-b');

    if (!synth && speechWarning) {
        speechWarning.hidden = false;
    }

    let visualToken = 0;
    let visualInterval = null;

    function updateSceneVisual(step) {
        visualToken += 1;
        const token = visualToken;
        if (visualInterval) {
            clearInterval(visualInterval);
            visualInterval = null;
        }
        if (!visualA || !visualB) return;

        visualA.classList.remove('is-visible');
        visualB.classList.remove('is-visible');

        visualA.onload = () => {
            if (token !== visualToken) return;
            visualA.classList.add('is-visible');
        };
        visualA.onerror = () => {
            if (token !== visualToken) return;
            visualA.classList.remove('is-visible');
        };
        visualB.onload = () => {
            if (token !== visualToken) return;
        };
        visualB.onerror = () => {
            if (token !== visualToken) return;
        };

        visualA.src = `img/scene-${step.number}-a.jpg`;
        visualB.src = `img/scene-${step.number}-b.jpg`;

        let showingA = true;
        visualInterval = setInterval(() => {
            if (token !== visualToken) return;
            const bReady = visualB.complete && visualB.naturalWidth > 0;
            if (!bReady) return;
            showingA = !showingA;
            visualA.classList.toggle('is-visible', showingA);
            visualB.classList.toggle('is-visible', !showingA);
        }, 7000);
    }

    function buildTimeline() {
        if (!timeline) return;

        timeline.querySelectorAll('button[role="listitem"]').forEach(el => el.remove());

        steps.forEach((step, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'timeline-node';
            if (index === 0) button.classList.add('is-active');
            button.setAttribute('role', 'listitem');
            button.setAttribute('aria-label', `Étape ${step.number}: ${step.title}`);

            button.innerHTML = `
                <span class="node-badge">${step.number}</span>
                <span class="node-label">${step.title}</span>
            `;

            button.addEventListener('click', () => {
                updateScene(index);
                speakCurrentScene();
            });

            timeline.appendChild(button);
        });
    }

    function updateTimelineUI() {
        if (!timeline) return;
        const nodes = timeline.querySelectorAll('.timeline-node');
        nodes.forEach((node, index) => {
            if (index === currentIndex) {
                node.classList.add('is-active');
            } else {
                node.classList.remove('is-active');
            }
        });
    }

    function updateScene(index) {
        stopSpeech();
        currentIndex = index;
        const step = steps[currentIndex];

        if (sceneNumber) sceneNumber.textContent = step.number;
        if (sceneKicker) sceneKicker.textContent = step.kicker;
        if (sceneYear) sceneYear.textContent = step.year;
        if (sceneTitle) sceneTitle.textContent = step.title;
        if (sceneNarration) sceneNarration.textContent = step.narration;
        if (sceneTakeaway) sceneTakeaway.textContent = step.takeaway;
        if (stepStatus) stepStatus.textContent = `Étape ${currentIndex + 1} sur ${steps.length}`;

        const progressPercent = ((currentIndex + 1) / steps.length) * 100;
        if (playerProgress) playerProgress.style.width = `${progressPercent}%`;
        if (timelineProgress) timelineProgress.style.width = `${progressPercent}%`;

        if (experience) {
            experience.className = `experience theme-${step.theme}`;
        }

        updateSceneVisual(step);
        updateTimelineUI();
    }

    function spokenYearPrefix(year) {
        const range = year.match(/^(\d{4})\s*-\s*(\d{4})$/);
        if (range) return `Entre ${range[1]} et ${range[2]}, `;
        if (/^\d{4}$/.test(year)) return `En ${year}, `;
        return `${year}, `;
    }

    function speakCurrentScene() {
        if (!synth) return;

        if (isPaused && synth.paused) {
            synth.resume();
            isPaused = false;
            isPlaying = true;
            if (playButton) playButton.innerHTML = '<span aria-hidden="true">⏸</span><b>Pause</b>';
            return;
        }

        stopSpeech();

        if (!audioCtx || audioCtx.state === 'suspended') {
            toggleAmbientSound();
        }

        const step = steps[currentIndex];
        const fullText = `${spokenYearPrefix(step.year)}${step.title}. ${step.narration}`;

        currentUtterance = new SpeechSynthesisUtterance(fullText);
        currentUtterance.lang = 'fr-FR';
        currentUtterance.rate = 0.98;
        currentUtterance.pitch = 1.0;

        if (bestFrenchVoice) {
            currentUtterance.voice = bestFrenchVoice;
        }

        currentUtterance.onstart = () => {
            isPlaying = true;
            isPaused = false;
            if (playButton) playButton.innerHTML = '<span aria-hidden="true">⏸</span><b>Pause</b>';
        };

        currentUtterance.onend = () => {
            isPlaying = false;
            isPaused = false;
            if (playButton) playButton.innerHTML = '<span aria-hidden="true">▶</span><b>Écouter l’histoire</b>';

            if (currentIndex < steps.length - 1) {
                setTimeout(() => {
                    if (!isPlaying && !isPaused && currentIndex < steps.length - 1) {
                        updateScene(currentIndex + 1);
                        speakCurrentScene();
                    }
                }, 1200);
            }
        };

        currentUtterance.onerror = () => {
            isPlaying = false;
            isPaused = false;
            if (playButton) playButton.innerHTML = '<span aria-hidden="true">▶</span><b>Écouter l’histoire</b>';
        };

        synth.speak(currentUtterance);
    }

    function pauseSpeech() {
        if (synth && synth.speaking) {
            synth.pause();
            isPaused = true;
            isPlaying = false;
            if (playButton) playButton.innerHTML = '<span aria-hidden="true">▶</span><b>Reprendre</b>';
        }
    }

    function stopSpeech() {
        if (synth) {
            synth.cancel();
        }
        isPlaying = false;
        isPaused = false;
        if (playButton) playButton.innerHTML = '<span aria-hidden="true">▶</span><b>Écouter l’histoire</b>';
    }

    if (playButton) {
        playButton.addEventListener('click', () => {
            if (isPlaying) {
                pauseSpeech();
            } else if (isPaused) {
                speakCurrentScene();
            } else {
                speakCurrentScene();
            }
        });
    }

    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateScene(currentIndex - 1);
                speakCurrentScene();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < steps.length - 1) {
                updateScene(currentIndex + 1);
                speakCurrentScene();
            }
        });
    }

    if (replayButton) {
        replayButton.addEventListener('click', () => {
            speakCurrentScene();
        });
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            updateScene(0);
            speakCurrentScene();
        });
    }

    /* Le bouton de sortie de la frise, vers l'application. Il coupe la
       voix en cours (sinon elle continue de parler par-dessus la page
       suivante, le même défaut que celui corrigé le 27/07 dans le moteur
       principal) et pose le repère de premier passage, pour que la frise
       ne s'impose plus automatiquement aux visites suivantes — elle reste
       consultable à volonté depuis la tuile de l'accueil. */
    const commencerButton = document.getElementById('commencer-button');
    if (commencerButton) {
        commencerButton.addEventListener('click', () => {
            stopSpeech();
            try { sessionStorage.setItem('pilote_frise_vue', '1'); } catch (e) {}
            window.location.href = '../../../../index.html';
        });
    }

    if (sourceToggle && sourcesPanel) {
        sourceToggle.addEventListener('click', () => {
            const expanded = sourceToggle.getAttribute('aria-expanded') === 'true';
            sourceToggle.setAttribute('aria-expanded', !expanded);
            sourcesPanel.hidden = expanded;
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' && currentIndex < steps.length - 1) {
            updateScene(currentIndex + 1);
            speakCurrentScene();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            updateScene(currentIndex - 1);
            speakCurrentScene();
        } else if (e.key === ' ') {
            e.preventDefault();
            if (isPlaying) {
                pauseSpeech();
            } else {
                speakCurrentScene();
            }
        }
    });

    buildTimeline();
    updateScene(0);
});
