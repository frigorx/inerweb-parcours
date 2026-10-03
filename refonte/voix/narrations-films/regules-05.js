/* Narration du film « Pump-down unique » — station 5 des régules (03/10/2026),
   refait sur l'annexe 3 EP2 CAP VAF 2016. Calée sur les sous-titres du film
   (regules-05.jsx). Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-05", {

  "Enceinte":
    "Quatre colonnes cette fois : la sécurité KA1, la demande de froid, le compresseur, et le voyant " +
    "H6 qui signale un défaut.",

  "MiseEnService":
    "On appuie sur S1 : KA1 colle et se tient. Le thermostat ferme : il alimente l'électrovanne et le " +
    "relais KA2. La pression monte, la BP de régulation fait coller KM1. Puis KA2 et KM1 " +
    "court-circuitent cette BP.",

  "Circulation":
    "Le froid est produit. Deux pressostats BP sont piqués sur l'aspiration : l'un régule, l'autre " +
    "protège.",

  "Consigne":
    "À la consigne, le thermostat ouvre : l'électrovanne et KA2 retombent. La BP de régulation " +
    "reprend la main. Le compresseur tire au vide, et à 0,3 bar, KM1 tombe. Un seul tirage au vide " +
    "par arrêt.",

  "Fuite":
    "Plus tard, une fuite. Le froid est redemandé, KM1 colle, mais le fluide manque. La BP de " +
    "régulation est shuntée : le compresseur continue. Au seuil de sécurité, la BP de sécurité coupe " +
    "KA1 et allume H6. Tout s'arrête : c'est un arrêt définitif.",

  "Chronologie":
    "Le chronogramme montre un tirage au vide normal, puis la fuite. Après elle, KA1 reste au repos : " +
    "seul S1 relancera, une fois la fuite réparée.",

  "CycleComplet":
    "Revoyez le cycle normal avec le curseur orange : S1, le thermostat, puis la BP de régulation. " +
    "À la consigne, KA2 retombe et la BP de régulation reprend la main pour le tirage.",

  "LaCle":
    "Retenez-le : la BP de régulation fait le tirage au vide, la BP de sécurité arrête tout et le " +
    "signale. Une fuite ne devient pas une suite de courts cycles."

});
