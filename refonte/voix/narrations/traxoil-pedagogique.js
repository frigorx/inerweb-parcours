/* Narration de la station « TraxOil : comment il travaille ». */
NARRATION("traxoil-pedagogique", {

  "rappel":
    "Le TraxOil fait le même travail que le pot mécanique : admettre l’huile qui manque au " +
    "carter. Mais il y ajoute trois choses. Une mesure électronique du niveau. Une " +
    "électrovanne pilotée, au lieu d’un flotteur qui pousse un pointeau. Et une sortie " +
    "d’alarme, qui peut prévenir ou arrêter. Attention cependant : il ne remplace rien en " +
    "amont. Le séparateur, le réservoir ou la réserve haute pression, et la qualité du tracé " +
    "restent tout aussi indispensables qu’avant.",

  "capteur":
    "Comment mesure-t-il le niveau ? Sur les O M trois, O M quatre et O M cinq, un flotteur " +
    "magnétique monte et descend avec l’huile. Un capteur à effet Hall suit la position de " +
    "l’aimant, à travers la paroi. Notez bien ce point : la mesure ne dépend pas d’un faisceau " +
    "lumineux qui traverserait l’huile. Une huile foncée ou un verre encrassé ne la faussent " +
    "donc pas. Le voyant reste visible, et les zones de niveau sont traduites par des " +
    "diodes et par l’état de commande.",

  "injection":
    "L’injection, maintenant. Quand le niveau descend dans la zone de commande, l’électronique " +
    "ouvre l’électrovanne intégrée. L’huile disponible en amont entre dans le carter, pendant " +
    "une séquence contrôlée — pas en continu. Puis le contrôleur referme la vanne, et il " +
    "regarde : est-ce que le niveau est revenu dans la zone attendue ? C’est cette vérification " +
    "après coup qui distingue l’appareil électronique du flotteur mécanique. Il agit, puis il " +
    "contrôle le résultat de son action.",

  "alarme":
    "Et si le niveau ne revient pas ? Si l’injection ne rétablit rien dans le temps prévu, le " +
    "contrôleur change d’état. Son contact de sortie peut alors transmettre une alarme, ou " +
    "participer à l’arrêt du compresseur — cela dépend de votre câblage. Retenez la logique : " +
    "ce n’est pas le manque d’huile qui déclenche, c’est le manque qui persiste malgré " +
    "l’injection. Les seuils, les couleurs, les délais et le mode de réarmement changent d’un " +
    "modèle à l’autre : lisez-les dans la notice du vôtre.",

});
