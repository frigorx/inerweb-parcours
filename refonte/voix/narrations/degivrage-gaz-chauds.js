/* Narration de la station « Le dégivrage par gaz chauds ». */
NARRATION("degivrage-gaz-chauds", {

  "derive":
    "Ici, la chaleur vient du circuit lui-même. Une électrovanne ouvre une dérivation qui " +
    "envoie une partie du refoulement, du gaz chaud comprimé, directement vers l'évaporateur. " +
    "Le gaz cède sa chaleur au givre et, ce faisant, se condense partiellement dans la " +
    "batterie. Un clapet et le tracé prévu par le constructeur empêchent ce gaz de migrer vers " +
    "les mauvaises branches. Attention au vocabulaire : c'est un by-pass de refoulement, le " +
    "circuit n'est pas inversé. Retenez : on dérive le refoulement vers la batterie, on " +
    "n'inverse rien du tout.",

  "sequence":
    "Le point de vigilance de ce montage, c'est le liquide. Le gaz chaud qui se condense dans " +
    "la batterie forme du fluide liquide, et ce liquide devra bien retourner vers le " +
    "compresseur au redémarrage. Un coup de liquide casse un compresseur. La séquence reste " +
    "donc rigoureuse : ligne liquide isolée, ventilateurs arrêtés, voie gaz chauds ouverte, " +
    "fin sur sonde, égouttage, puis retour au froid — avec la protection anti coup de liquide " +
    "que l'architecture du constructeur prévoit. Retenez : dans un dégivrage par gaz chauds, " +
    "la vraie question est toujours : où va le liquide formé, et qui protège le compresseur.",

  "diagnostic":
    "Une batterie qui ne chauffe pas pendant le dégivrage, cela ne se conclut pas sur un seul " +
    "indice. Contrôlez dans l'ordre : la voie gaz chauds s'ouvre-t-elle vraiment, le sens des " +
    "clapets, la température de batterie, et le retour d'aspiration. Sur une centrale " +
    "multi-postes, ajoutez deux questions : quelle machine fournit le gaz chaud, et dans quel " +
    "ordre les postes dégivrent — un dégivrage ne peut pas se servir si personne ne produit du " +
    "gaz chaud à ce moment-là. Retenez la méthode : vérifier d'abord que le gaz chaud atteint " +
    "réellement la branche visée, puis croiser les indices avant de conclure."
});
