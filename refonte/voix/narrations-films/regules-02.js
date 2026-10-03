/* Narration du film « Protection minimum » — station 2 des régules (03/10/2026).
   Calée sur les sous-titres du film (regules-02.jsx). Une entrée par scène,
   dans l'ordre de la timeline. Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-02", {

  "Enceinte":
    "Toujours notre chambre négative à moins dix-huit degrés. L'air se réchauffe, le thermostat " +
    "surveille. Mais cette fois, deux sécurités sont en série sur la commande.",

  "Fermeture":
    "Le thermostat ferme son contact. Le courant doit encore traverser le pressostat haute pression, " +
    "puis le pressostat basse pression. Les deux sont fermés : KM1 et l'électrovanne Y1 sont " +
    "alimentés en même temps.",

  "Circulation":
    "L'électrovanne ouvre la ligne liquide, et le compresseur aspire en basse pression pour refouler " +
    "en haute pression. Repérez les deux prises : la HP au refoulement, la BP à l'aspiration. C'est " +
    "là que les pressostats lisent la pression.",

  "Consigne":
    "L'air atteint la consigne : le thermostat ouvre. KM1 et Y1 tombent au même instant. Avec une " +
    "seule chaîne en série, aucune charge ne reste seule sous tension.",

  "Migration":
    "À l'arrêt, l'électrovanne se referme et coupe la ligne liquide. Le liquide reste piégé en haute " +
    "pression. Il n'en migre qu'un peu : le carter reste propre, et le risque de coup de liquide est " +
    "limité.",

  "Chronologie":
    "Le chronogramme montre deux cycles normaux, puis un défaut de haute pression. La sécurité coupe " +
    "tout, même si la chambre demande encore du froid.",

  "CycleComplet":
    "Revoyez le cycle complet avec le curseur orange. L'électrique commande, le fluide obéit : le " +
    "chronogramme dit exactement la même chose que les schémas.",

  "LaCle":
    "Retenez-le : thermostat et pressostats autorisent ensemble le compresseur et l'électrovanne. " +
    "Si l'un d'eux s'ouvre, tout s'arrête."

});
