/* Narration du film « Pump-down et dégivrage électrique » — station 8 des régules.
   Une entrée par scène du film, dans l'ordre de la timeline.
   Règles d'écriture : voir `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-08", {

  "Enceinte":
    "L'installation est à l'arrêt. La batterie est propre, sans givre, et l'air de la chambre " +
    "remonte doucement. Regardez la sonde : c'est elle qui va demander le froid. Rien n'est " +
    "encore alimenté.",

  "Fermeture":
    "Voici l'armoire. Quatre lignes de commande partent du même rail, protégé par le " +
    "disjoncteur Q un. Le thermostat B un ferme et ouvre l'électrovanne Y un. La pression " +
    "remonte à l'aspiration, le pressostat B P se referme, et le contacteur K M un colle. " +
    "Retenez l'ordre : la ligne liquide d'abord, le compresseur ensuite.",

  "Circulation":
    "Le froid est produit. Le fluide fait le tour complet : compresseur, condenseur, détendeur, " +
    "évaporateur. Et pendant qu'il travaille, le givre s'installe sur la batterie. C'est normal, " +
    "c'est même le signe que l'échange se fait. Le problème commence quand cette couche isole " +
    "la batterie.",

  "Consigne":
    "L'horloge K T prend la main. Elle ne coupe pas le compresseur : elle ferme l'électrovanne. " +
    "Le compresseur continue seul et tire au vide l'évaporateur, puis s'arrête sur la basse " +
    "pression. C'est tout l'intérêt du montage : on vide la batterie avant de la chauffer. Les " +
    "ventilateurs tombent, et K M deux alimente les résistances.",

  "Degivrage":
    "Le givre fond. Faites attention à un piège : les résistances font remonter la pression, " +
    "et le pressostat de régulation voudrait faire repartir le compresseur. C'est le contact " +
    "d'horloge, en série sur la ligne du compresseur, qui l'en empêche. Le dégivrage se termine " +
    "quand la sonde S un atteint plus dix degrés, pas quand le temps est écoulé.",

  "Chronologie":
    "Relisez la chronologie de haut en bas. La batterie se réchauffe, le thermostat et " +
    "l'électrovanne suivent, la basse pression descend au tirage au vide. Et regardez la " +
    "dernière ligne : les ventilateurs repartent après tout le monde. Ce retard, c'est " +
    "l'égouttage.",

  "LaCle":
    "Trois choses à retenir. Le dégivrage se termine sur une sonde. L'eau doit s'égoutter avant " +
    "la reprise. Et les ventilateurs redémarrent en dernier, sinon vous soufflez cette eau dans " +
    "la chambre."

});
