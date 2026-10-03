/* Narration du film « Le dégivrage par gaz chauds » — station 9 des régules (03/10/2026).
   Sources : schéma de commande CAP « dégivrage par gaz chauds » et fiche 3 Électricité (principe).
   Une entrée par scène, dans l'ordre de la timeline. Règles : `refonte/voix/narrations/LISEZ-MOI.md`. */
NARRATION_FILM("regules-09", {

  "Enceinte":
    "Une chambre négative. Ici, c'est le gaz chaud qui dégivre.",

  "Marche":
    "B1 ouvre l'électrovanne liquide, et la BP fait tourner le compresseur.",

  "Circulation":
    "Repérez le piquage sur le refoulement, et la vanne Y3 : fermée tant qu'on fait du froid.",

  "Horloge":
    "L'horloge fait coller KA1. L'électrovanne liquide se ferme, les ventilateurs s'arrêtent, et Y3 s'ouvre. " +
    "Le compresseur, lui, continue : c'est lui qui fournit la chaleur.",

  "Fonte":
    "Le gaz chaud réchauffe la batterie de l'intérieur, et le givre fond. En se refroidissant, le gaz se " +
    "condense : ce liquide est réévaporé avant le compresseur. À plus dix degrés, B4 fait retomber KA1 : " +
    "le froid reprend.",

  "Reprise":
    "Les ventilateurs, eux, attendent : la batterie refroidit et l'eau finit de s'égoutter. Puis ils repartent.",

  "Chronologie":
    "Relisez la chronologie : pendant le dégivrage, le compresseur ne s'arrête jamais.",

  "LaCle":
    "Retenez-le : le gaz chaud dégivre de l'intérieur, le compresseur tourne, et le liquide qui revient " +
    "doit être réévaporé."

});
