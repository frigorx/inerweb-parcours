/* Narration de la station « Le dégivrage électrique ». */
NARRATION("degivrage-electrique", {

  "organes":
    "Quand l'air de la chambre est trop froid pour faire fondre le givre, on apporte la chaleur " +
    "avec des résistances électriques placées dans la batterie. Mais faire fondre ne suffit " +
    "pas : l'eau doit s'évacuer sans regeler en chemin. C'est pourquoi le bac de récupération " +
    "et la conduite d'écoulement peuvent porter leurs propres résistances. Et une sonde de fin " +
    "de dégivrage mesure l'état thermique de l'évaporateur. Retenez l'ensemble : des " +
    "résistances pour fondre, un bac et un écoulement protégés pour évacuer, une sonde pour " +
    "conclure.",

  "chronologie":
    "L'ordre des phases protège les produits, récitez-le. Arrêt du froid. Arrêt des " +
    "ventilateurs — surtout pas d'air chaud soufflé dans la chambre. Résistances actives, le " +
    "givre fond. Fin sur la sonde de batterie. Égouttage : on laisse l'eau partir. Reprise du " +
    "froid. Et seulement quand la batterie est redevenue froide, redémarrage différé des " +
    "ventilateurs — sinon on projette dans l'enceinte l'humidité et la chaleur restantes. " +
    "Retenez la séquence : arrêt froid, ventilateurs arrêtés, résistances, fin sur sonde, " +
    "égouttage, reprise du froid, ventilateurs différés.",

  "securites":
    "Deux fins possibles, deux rôles différents. La fin normale vient de la sonde : la " +
    "batterie est chaude, le givre a fondu, on arrête de chauffer. Le temps maximal, lui, est " +
    "un garde-fou : il coupe les résistances si la sonde ou le cycle défaille. Une fin trop " +
    "précoce laisse du givre ; une fin trop tardive chauffe l'enceinte inutilement. En " +
    "dépannage, ne vous arrêtez pas au paramètre de durée : contrôlez la sonde, l'intensité " +
    "réellement absorbée par les résistances, et l'écoulement. Retenez : la sonde termine, le " +
    "temps protège, et le résultat se vérifie sur la batterie, pas à l'écran du régulateur."
});
