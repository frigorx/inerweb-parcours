window.OIL_MODULE = {
  id: "diagnostic-circuit-huile-conclure",
  title: "Diagnostic : pression, distribution et conclusion",
  subtitle: "LE CIRCUIT D’HUILE · STATION 16 · TERMINUS",
  codes: ["1.05", "6.05", "9.07"],
  voix: true,
  nextStep: "La ligne est complète. Sur une installation réelle, reprendre le schéma constructeur, relever les mesures dans le temps et justifier le prochain contrôle avant toute correction.",
  nextUrl: "../circuit-huile-interactif/index.html",
  nextLabel: "Revenir à la carte complète",
  summaryVisual: { kind: "diagnostic", label: "Synthèse : observer, suivre l’huile, mesurer les pressions, interpréter puis décider" },
  lessons: [
    { id: "pression", short: "Pression", kicker: "Station 1 · Différentiel", title: "Mesurer la force disponible pour déplacer l’huile", lead: "Comparer la pression du réservoir à la pression de référence et au carter concerné.", details: ["Un différentiel trop faible n’alimente pas ; un différentiel trop fort peut perturber le régulateur.", "Contrôler valeur prescrite, sens du clapet, stabilité et variations d’aspiration."], box: { type: "exam", text: "Écrire les deux pressions et leur différence avant toute conclusion." }, visual: { kind: "differential", title: "Calculer le différentiel observé", label: "Pression du réservoir comparée à la pression d’aspiration" } },
    { id: "distribution", short: "Distribuer", kicker: "Station 2 · Ligne d’huile", title: "Suivre vanne, filtre et régulateur sans sauter d’étape", lead: "L’huile disponible peut encore être arrêtée par une vanne fermée ou un filtre colmaté.", details: ["Contrôler l’amont puis l’état mécanique ou électronique du régulateur.", "Sur TraxOil, vérifier alimentation, électrovanne, états et temporisations ; sur AC&R, horizontalité, flotteur et pointeau."], box: { type: "key", text: "Amont mesuré correct avant de condamner le dernier organe." }, visual: { kind: "oilLine", title: "Tester chaque maillon", label: "Réservoir, vanne, filtre, régulateur puis carter" } },
    { id: "croiser", short: "Croiser", kicker: "Station 3 · Scénarios", title: "Deux niveaux bas peuvent avoir deux causes opposées", lead: "Carter bas et réservoir bas : chercher séparation, retour naturel, fuite ou charge globale.", details: ["Carter bas et réservoir haut : chercher pression, vanne, filtre, ligne et régulateur.", "Carter haut : rechercher suralimentation, pointeau qui ferme mal, retour massif ou erreur de charge."], box: { type: "exam", text: "Le prochain contrôle découle de la combinaison des indices, jamais d’une valeur seule." }, visual: { kind: "decision", title: "Choisir le prochain contrôle", label: "Arbre de décision à partir du niveau stabilisé et de la réserve" } },
    { id: "rendre-compte", short: "Conclure", kicker: "Station 4 · Habilitation", title: "Une conclusion professionnelle reste vérifiable", lead: "Décrire le symptôme, les conditions, les mesures et le chemin contrôlé.", details: ["Formuler la cause probable comme une hypothèse et annoncer le contrôle qui permettra de la confirmer.", "Consigner toute fuite ou anomalie ; ne jamais masquer une alarme ni modifier un réglage de sécurité pour poursuivre."], box: { type: "warning", text: "Une bonne réponse d’évaluation explique : observation → interprétation → action sûre." }, visual: { kind: "diagnostic", title: "Mesurer, interpréter, décider", label: "Chaîne de preuve complète du circuit d’huile" } }
  ],
  quiz: [
    { prompt: "Comment vérifier le clapet différentiel ?", options: ["Comparer réservoir et pression de référence", "Mesurer la pression au carter, seule", "Ouvrir le réglage jusqu’au débit voulu"], correct: 0, why: "Son fonctionnement se juge par le différentiel obtenu.", code: "6.05" },
    { prompt: "Avant de condamner le régulateur, que vérifier ?", options: ["Le voyant du carter et sa propreté", "Vanne, filtre, pression d’arrivée", "Le ventilateur du condenseur à air"], correct: 1, why: "Un défaut d’amont produit le même niveau bas.", code: "6.05" },
    { prompt: "Que peut signaler une alarme TraxOil ?", options: ["Un défaut extérieur au contrôleur", "Une panne interne du contrôleur seul", "Un réservoir plein, sans autre cause"], correct: 0, why: "Le contrôleur peut correctement constater l’absence de remontée du niveau.", code: "6.05" },
    { prompt: "Carter trop haut : quelle hypothèse est cohérente ?", options: ["Manque de pression dans la réserve", "Double colonne de section trop petite", "Suralimentation ou pointeau qui ferme mal"], correct: 2, why: "Un excès demande d’examiner ce qui admet ou ramène trop d’huile.", code: "6.05" },
    { prompt: "Quelle conclusion est professionnelle ?", options: ["Annoncer la panne dès le premier indice", "Mesures, hypothèse et prochain contrôle", "Masquer l’alarme pour finir la journée"], correct: 1, why: "La conclusion doit pouvoir être vérifiée et conduire à une action sûre.", code: "1.05 · 6.05 · 9.07" }
  ],
  sources: [
    { title: "BITZER — Causes for oil loss", url: "https://www.bitzer.de/shared_media/html/est-600/en-GB/345371019345395723.html", use: "diagnostic, vitesse, charge partielle et pertes d’huile" },
    { title: "BITZER — Parallel compounding with oil level controllers", url: "https://www.bitzer.de/shared_media/html/kt-600/en-GB/313846411313848587.html", use: "architectures et chaîne active" },
    { title: "Parker Sporlan — Oil Level Control System", url: "https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-110/SD-129_-Oil-Level-Control-System-Installation.pdf", use: "méthode de diagnostic des contrôleurs et du réservoir" },
    { title: "Copeland — OM3/OM4/OM5 TraxOil Technical Information", url: "https://media.copeland.com/d8f801b5-15db-4430-bbda-b16b01022eae/OM3_OM4_OM5_TB_EN_0820_R08.pdf", use: "lecture des états et alarme électronique" },
    { title: "Légifrance — Attestation d’aptitude fluides", url: "https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000053004646", use: "préparation aux compétences 1.05, 6.05 et 9.07" }
  ]
};
