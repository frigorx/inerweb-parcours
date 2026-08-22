/* Narration de la station « Le pump-down automatique ». */
NARRATION("pump-down-automatique", {

  "deux-commandes":
    "Le pump-down sépare ce que la station précédente mélangeait. Regardez les deux lignes du " +
    "schéma : le thermostat B un ne commande plus le compresseur, il commande l'électrovanne " +
    "Y un, sur la ligne liquide. Et le compresseur K M un, lui, obéit à un pressostat B P de " +
    "régulation, qui le démarre et l'arrête selon la pression d'aspiration. Deux chaînes, deux " +
    "décisions. C'est ce découplage qui permet de vider l'évaporateur à chaque arrêt. Retenez " +
    "la répartition : le thermostat pilote Y un, le B P de régulation pilote K M un.",

  "tirage":
    "Suivez l'arrêt dans l'ordre, c'est la séquence à savoir réciter. La consigne est atteinte, " +
    "B un s'ouvre, Y un ferme la ligne liquide. Mais le compresseur, lui, continue de tourner : " +
    "il aspire le fluide qui reste côté évaporateur, et la basse pression descend. Quand elle " +
    "atteint le seuil réglé, le pressostat B P de régulation s'ouvre, et K M un s'arrête. " +
    "L'évaporateur est vidé : au prochain arrêt prolongé, pas de fluide qui migre vers le " +
    "compresseur. Retenez la phrase : Y un ferme d'abord, le compresseur finit le tirage au " +
    "vide, la pression décide de l'arrêt.",

  "court-cycle":
    "Voici le défaut à connaître sur ce montage classique. À l'arrêt, si la basse pression " +
    "remonte, le pressostat de régulation se referme tout seul, et le compresseur redémarre " +
    "sans aucune demande du thermostat. Il aspire quelques instants, recoupe, et peut " +
    "recommencer : c'est le court cycle. La cause la plus fréquente : une électrovanne Y un qui " +
    "fuit et laisse passer du fluide. En atelier, restez devant la machine à l'arrêt et comptez " +
    "les redémarrages. Retenez : un compresseur qui repart sans demande de froid, c'est une " +
    "remontée de pression qu'il faut expliquer, souvent une Y un fuyarde."
});
