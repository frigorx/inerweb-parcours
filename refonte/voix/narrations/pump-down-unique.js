/* Narration de la station « Le pump-down unique ». */
NARRATION("pump-down-unique", {

  "deux-bp":
    "Sur ce schéma, il y a deux pressostats basse pression, et c'est le cœur de la station. Le " +
    "B P de régulation travaille à chaque cycle : il termine le tirage au vide et se " +
    "réenclenche tout seul, c'est son métier. Le B P de sécurité, lui, appartient à la chaîne " +
    "de défaut : il surveille la pression anormalement basse, il peut imposer un arrêt durable, " +
    "et il allume la signalisation H six. Ne déduisez jamais la fonction d'un pressostat de sa " +
    "seule position sur le schéma. Retenez le réflexe : lire le repère, lire le contact, lire " +
    "le mode de réarmement — c'est cela qui dit qui régule et qui protège.",

  "fuite":
    "Imaginez une fuite de fluide. Cycle après cycle, la pression descend de plus en plus bas, " +
    "et la boucle de régulation, elle, continuerait à enchaîner les courts cycles sans jamais " +
    "rien signaler. C'est là que le B P de sécurité intervient : pression anormalement basse, " +
    "la chaîne s'ouvre, le compresseur reste arrêté, H six s'allume. La signalisation oriente " +
    "le diagnostic, mais elle ne remplace ni la recherche de fuite ni la remise en service dans " +
    "les règles. Et jamais de shunt en intervention réelle sans procédure, sans schéma et sans " +
    "autorisation. Retenez : la sécurité fige la machine pour qu'une fuite ne se cache pas " +
    "derrière des courts cycles.",

  "nom":
    "Sur les documents que vous rencontrerez, ce montage porte plusieurs noms : single " +
    "pump-down, tirage au vide unique, unique amélioré. Ne vous battez pas sur le vocabulaire, " +
    "le schéma tranche toujours. La méthode tient en trois gestes : nommer les organes, suivre " +
    "les contacts un à un, puis raconter l'ordre des états à voix haute. Si votre récit tient " +
    "debout, vous avez compris le montage, quel que soit son nom. Retenez : face à un nom " +
    "ambigu, c'est le câblage qui fait foi, pas l'étiquette."
});
