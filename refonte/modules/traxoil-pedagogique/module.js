window.OIL_MODULE = {
  id: "traxoil-pedagogique",
  title: "TraxOil : comment il travaille",
  subtitle: "LE CIRCUIT D’HUILE · STATION 11",
  codes: ["1.05", "6.05"],
  voix: true,
  nextStep: "Poursuivre avec le montage : les modèles, l’installation, les architectures BP et HP, puis la chaîne de preuve.",
  nextUrl: "../traxoil-installer/index.html",
  nextLabel: "Station 12 · TraxOil : monter et diagnostiquer",
  summaryVisual: { kind: "levelZones", label: "TraxOil avec zones de niveau, injection par électrovanne et contact d’alarme" },
  lessons: [
    { id: "rappel", short: "Rappel", kicker: "Station 1 · Retour spiralé", recall: true, title: "TraxOil mesure, alimente et protège", lead: "Le régulateur électronique reprend la fonction d’admission d’huile au carter.", details: ["Il ajoute une mesure électronique du niveau, une électrovanne pilotée et une sortie d’alarme.", "Le séparateur, le réservoir ou la réserve haute pression et la qualité du tracé restent indispensables."], box: { type: "key", text: "Électronique ne signifie pas autonome du reste du circuit." }, visual: { kind: "traxoil", title: "Replacer les trois fonctions", label: "TraxOil mesurant le niveau, alimentant le carter et déclenchant une alarme" } },
    { id: "capteur", short: "Mesurer", kicker: "Station 2 · Capteur", title: "Un flotteur magnétique déplace l’information de niveau", lead: "Sur les OM3, OM4 et OM5, un capteur à effet Hall suit la position du flotteur magnétique.", details: ["La mesure ne dépend pas d’un faisceau lumineux traversant directement l’huile.", "Le voyant reste visible et les zones de niveau sont traduites par des LED et par l’état de commande."], box: { type: "exam", text: "Le capteur mesure une position de flotteur ; il ne mesure ni la pression ni la viscosité." }, visual: { kind: "levelZones", title: "Lire les zones de niveau", label: "Zone normale, zone d’injection et zone d’alarme basse" } },
    { id: "injection", short: "Injecter", kicker: "Station 3 · Électrovanne", title: "L’électrovanne admet l’huile manquante", lead: "Quand le niveau passe dans la zone de commande, l’électronique ouvre l’électrovanne intégrée.", details: ["L’huile disponible en amont entre dans le carter pendant une séquence contrôlée.", "Le contrôleur ferme ensuite la vanne et vérifie si le niveau revient dans la zone attendue."], box: { type: "key", text: "La vanne ne crée pas le débit : il faut toujours une pression d’huile disponible." }, visual: { kind: "traxoil", title: "Mesurer puis agir", label: "Capteur commandant une électrovanne d’admission d’huile" } },
    { id: "alarme", short: "Alarme", kicker: "Station 4 · Temporisation", title: "Le manque persistant devient une alarme", lead: "Si l’injection ne rétablit pas le niveau dans le temps prévu, le contrôleur change d’état.", details: ["Le contact de sortie peut transmettre une alarme ou participer à l’arrêt du compresseur selon le câblage.", "Seuils, couleurs, délais et réarmement varient selon le modèle : les lire dans sa notice."], box: { type: "warning", text: "Ne jamais shunter une alarme de niveau pour maintenir le compresseur en marche." }, visual: { kind: "levelZones", title: "Distinguer commande et sécurité", label: "Niveau normal, injection temporisée puis alarme de niveau bas" } }
  ],
  quiz: [
    { prompt: "Quelles fonctions TraxOil réunit-il ?", options: ["Mesure, admission d’huile et alarme", "Condensation, détente et évaporation", "Pesée, tirage au vide et charge"], correct: 0, why: "Il surveille le niveau, commande une électrovanne et fournit un contact d’alarme.", code: "1.05" },
    { prompt: "Que suit le capteur à effet Hall ?", options: ["La température de l’huile au carter", "La position du flotteur magnétique", "La pression de condensation du poste"], correct: 1, why: "Le flotteur change le champ magnétique lu par le capteur.", code: "1.05" },
    { prompt: "Quel est le rôle de l’électrovanne du TraxOil ?", options: ["Ouvrir un passage alimenté en amont", "Créer la pression d’huile nécessaire", "Réguler la pression du réservoir"], correct: 0, why: "La circulation dépend du différentiel disponible en amont.", code: "1.05" },
    { prompt: "Que signifie une alarme de niveau bas persistante ?", options: ["Le condenseur est encrassé, à coup sûr", "Le contrôleur est en panne, à changer", "Le niveau n’est pas revenu à temps"], correct: 2, why: "L’alarme décrit un résultat ; la cause reste à diagnostiquer.", code: "6.05" }
  ],
  sources: [
    { title: "Copeland — OM3/OM4/OM5 TraxOil Technical Information", url: "https://media.copeland.com/d8f801b5-15db-4430-bbda-b16b01022eae/OM3_OM4_OM5_TB_EN_0820_R08.pdf", use: "capteur Hall, électrovanne, zones, alarme et domaines OM3/4/5" },
    { title: "BITZER — Parallel compounding with oil level controllers", url: "https://www.bitzer.de/shared_media/html/kt-600/en-GB/313846411313848587.html", use: "architectures basse et haute pression" },
    { title: "Parker Sporlan — Oil Level Control System", url: "https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-110/SD-129_-Oil-Level-Control-System-Installation.pdf", use: "filtration, réservoir et diagnostic de ligne" },
    { title: "Légifrance — Attestation d’aptitude fluides", url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646", use: "compétences 1.05 et 6.05" }
  ]
};
