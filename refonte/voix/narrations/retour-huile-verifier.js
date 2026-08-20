/* Narration de la station « Vérifier le retour d’huile ». Écrit pour l’oreille. */
NARRATION("retour-huile-verifier", {

  "charge-variable":
    "Voici le moment où les défauts se révèlent : la charge minimale. Quand des compresseurs " +
    "s’arrêtent, ou quand un compresseur module, le débit de gaz s’effondre. Et une colonne " +
    "parfaitement correcte à pleine charge devient tout à coup trop large : la vitesse n’y " +
    "suffit plus. C’est là qu’intervient la double colonne. À faible charge, l’huile s’accumule " +
    "et bouche le pied de la grande montée. Tout le gaz est forcé dans la petite, et la vitesse " +
    "remonte. À pleine charge, le bouchon est chassé, et les deux montées travaillent. Posez-vous " +
    "toujours la question : est-ce que ça revient encore au régime le plus bas ?",

  "calcul-vitesse":
    "Cette vitesse, ne la devinez pas : calculez-la. Le débit aspiré, divisé par la section de " +
    "passage. C’est tout. Et la section, c’est pi, fois le diamètre au carré, divisé par quatre. " +
    "Sur l’écran, réglez le diamètre, le régime, le débit. Regardez la vitesse s’afficher, et " +
    "regardez l’huile monter ou retomber. Essayez ceci : mettez un diamètre correct à pleine " +
    "charge, puis passez à quarante pour cent. Vous verrez le tracé cesser d’entraîner l’huile " +
    "sans qu’un seul tube ait bougé. Le calcul donne une vitesse. Le repère auquel vous la " +
    "comparez, lui, vient de la notice du constructeur et de l’étude de l’installation.",

  "circuit-complet":
    "Un retour d’huile se lit comme un chemin continu. Partez de la sortie de l’évaporateur, et " +
    "suivez la conduite jusqu’au carter, sans sauter d’étape. Dans l’ordre : la pente, les " +
    "points bas, le siphon en pied, la section de la montée, et la boucle haute s’il y en a " +
    "une. Puis, une fois le chemin lu, confrontez-le aux débits : le minimal et le maximal. Un " +
    "tracé juste au régime nominal peut devenir insuffisant à charge réduite. Un schéma " +
    "fluidique se lit toujours ainsi : la géométrie, plus le débit, plus le temps de " +
    "fonctionnement.",

  "transitoires":
    "Le retour d’huile ne se juge pas sur un instant. Il se juge sur une durée, et sur plusieurs " +
    "états de la machine. Des cycles trop courts envoient de l’huile sans laisser le temps à " +
    "l’équilibre de se rétablir. Après un dégivrage, après une longue réduction de puissance, " +
    "après un redémarrage, le niveau bouge avant de se stabiliser. Alors un coup d’œil au " +
    "voyant ne vous dira rien. Notez le régime. Notez l’heure. Et notez comment le niveau " +
    "évolue. C’est cette évolution qui parle, pas la photo d’un instant.",

  "methode":
    "Dernier écran, et le plus important : avant d’ajouter de l’huile, cherchez où elle est " +
    "partie. Un niveau bas, cela peut être un défaut de retour. Une fuite. Un simple régime " +
    "transitoire. Ou une charge initiale qui n’était pas la bonne. Ce ne sont pas les mêmes " +
    "causes, et surtout ce ne sont pas les mêmes remèdes. Observez le niveau dans les " +
    "conditions prévues. Relevez quels compresseurs tournent. Examinez le tracé. Recoupez la " +
    "température, la pression, la stabilité et l’historique. Et n’ajoutez l’huile approuvée " +
    "qu’après avoir identifié le vrai besoin. Une valeur isolée ne désigne jamais une panne.",

});
