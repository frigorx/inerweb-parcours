/* Narration du film « Commande directe » (v2) — station 1 des régules (03/10/2026).
   Calée sur les sous-titres du film (regules-video-v2.jsx). Une entrée par scène,
   dans l'ordre de la timeline. Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-01", {

  "Enceinte":
    "Une chambre froide négative, réglée à moins dix-huit degrés. L'air se réchauffe doucement : " +
    "le thermostat B1 surveille.",

  "Fermeture":
    "À moins quatorze degrés, le thermostat ferme son contact. Le courant passe directement par B1 " +
    "et alimente la bobine de KM1. Le contacteur colle : le compresseur démarre.",

  "Circulation":
    "Suivez le fluide sur la croix du frigoriste. Le compresseur aspire en basse pression et refoule " +
    "en haute pression. Le condenseur rend le liquide, le détendeur fait chuter la pression, et " +
    "l'évaporateur prend la chaleur de l'air.",

  "Consigne":
    "L'air atteint moins dix-huit degrés : le thermostat ouvre. Tout s'arrête au même instant. " +
    "Aucun pressostat, aucune temporisation : rien d'autre ne décide.",

  "Migration":
    "Voici le piège de cette commande. À l'arrêt, le fluide migre vers le point le plus froid. " +
    "Le liquide remplit l'évaporateur, puis le carter du compresseur. Au redémarrage, c'est le " +
    "coup de liquide.",

  "Chronologie":
    "Sur le chronogramme, le contact du thermostat et le compresseur ont exactement le même profil. " +
    "Le cycle repart dès que l'air remonte à moins quatorze degrés.",

  "CycleComplet":
    "Revoyez le cycle d'un seul regard, en suivant le curseur orange : B1 ferme, KM1 colle, le froid " +
    "s'installe. Et notez bien : aucun pressostat ne surveille les pressions.",

  "LaCle":
    "Retenez-le : en commande directe, le thermostat alimente le compresseur. Une seule cause, un " +
    "seul effet. C'est simple, mais rien ne protège le compresseur."

});
