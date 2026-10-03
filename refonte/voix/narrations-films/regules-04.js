/* Narration du film « Pump-down amélioré » — station 4 des régules (03/10/2026).
   Calée sur les sous-titres du film (regules-04.jsx). Une entrée par scène,
   dans l'ordre de la timeline. Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-04", {

  "Enceinte":
    "La même chambre négative, avec trois colonnes. Le thermostat commande un relais, KA. Et ce " +
    "relais commande l'électrovanne et autorise le compresseur.",

  "Fermeture":
    "Le thermostat ferme : le relais KA colle. Il ouvre l'électrovanne, et la pression monte. À 1,8 " +
    "bar, la BP fait coller KM1, qui se tient aussitôt par son propre contact : c'est l'auto-maintien.",

  "Circulation":
    "Le froid est produit. Comme à la station précédente, le pressostat BP est piqué sur " +
    "l'aspiration : il suit la pression de l'évaporateur.",

  "Consigne":
    "À la consigne, le thermostat ouvre et KA retombe. L'électrovanne se ferme. Mais KM1 se tient par " +
    "son auto-maintien : le compresseur tire au vide. À 0,3 bar, la BP ouvre, et KM1 tombe.",

  "SansCourtCycle":
    "À l'arrêt, la pression remonte doucement. À 1,8 bar, la BP referme. Mais cette fois, KA et " +
    "l'auto-maintien sont ouverts : KM1 reste au repos. Sans demande du thermostat, pas de " +
    "redémarrage.",

  "Chronologie":
    "Sur le chronogramme : le thermostat, le relais et l'électrovanne bougent ensemble. KM1 tient " +
    "jusqu'au bout du tirage, puis ne bouge plus quand la BP remonte.",

  "CycleComplet":
    "Revoyez le cycle avec le curseur orange. Le relais garde la demande, le fluide obéit. À la " +
    "consigne, KM1 se tient seul le temps du tirage au vide.",

  "LaCle":
    "Retenez-le : le relais KA garde la demande, et KM1 se tient seul jusqu'au bout du tirage. Une " +
    "remontée de pression ne suffit plus à faire repartir le compresseur."

});
