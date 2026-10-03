/* Narration du film « Pump-down automatique » — station 3 des régules (03/10/2026).
   Calée sur les sous-titres du film (regules-03.jsx). Une entrée par scène,
   dans l'ordre de la timeline. Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-03", {

  "Enceinte":
    "Une chambre négative à moins dix-huit degrés. Ici, deux commandes séparées : le thermostat " +
    "commande l'électrovanne, et le pressostat basse pression commande le compresseur.",

  "Fermeture":
    "Le thermostat ferme : seule l'électrovanne s'ouvre. La pression d'aspiration monte. À 1,8 bar, " +
    "la BP ferme, et KM1 colle. Le compresseur démarre après l'électrovanne, jamais avant.",

  "Circulation":
    "Le froid est produit. Regardez le pressostat BP : il est piqué sur l'aspiration. Il suit donc la " +
    "pression de l'évaporateur, et c'est elle qui décide de la marche du compresseur.",

  "Consigne":
    "La consigne est atteinte : le thermostat ouvre, l'électrovanne se ferme. Mais le compresseur " +
    "continue. Il vide l'évaporateur : c'est le tirage au vide. À 0,3 bar, la BP ouvre et KM1 tombe.",

  "CourtCycle":
    "L'évaporateur est vide : plus rien ne migre vers le carter. Mais à l'arrêt, la pression remonte " +
    "doucement. À 1,8 bar, la BP referme, et le compresseur repart sans aucune demande de froid. " +
    "C'est le court cycle.",

  "Chronologie":
    "Le chronogramme montre le décalage : l'électrovanne d'abord, le compresseur ensuite. Et à la " +
    "fin, deux redémarrages parasites, sans demande de froid.",

  "CycleComplet":
    "Revoyez le cycle avec le curseur orange. Le thermostat ouvre l'électrovanne, la pression monte, " +
    "la BP fait coller KM1. À la consigne, le compresseur tire au vide, puis s'arrête sur la BP.",

  "LaCle":
    "Retenez-le : le thermostat commande l'électrovanne, la basse pression commande le compresseur. " +
    "L'évaporateur est vidé à chaque arrêt, mais une simple remontée de pression fait recoller le " +
    "compresseur."

});
