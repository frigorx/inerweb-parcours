/* Narration de la station « Le pump-down amélioré ». */
NARRATION("pump-down-ameliore", {

  "memoire":
    "Pour tuer le court cycle, on ajoute une mémoire. Le relais K A s'enclenche quand le " +
    "thermostat demande du froid, et c'est lui qui autorise l'électrovanne Y un et le " +
    "démarrage. À la consigne, K A retombe : la demande est oubliée. Le compresseur, lui, " +
    "finit son tirage au vide grâce à son circuit de maintien, puis s'arrête sur le pressostat " +
    "B P. Et ensuite, même si la pression remonte, rien ne repart : la mémoire de demande est " +
    "tombée. Retenez : le relais K A retient la demande de froid, et sans demande, une " +
    "remontée de pression ne suffit plus à redémarrer.",

  "un-cycle":
    "Déroulez la séquence complète une fois, lentement. B un demande le froid, K A s'enclenche, " +
    "Y un s'ouvre, le compresseur démarre sur la pression. La consigne est atteinte : K A et " +
    "Y un retombent. Le maintien porte K M un juste le temps de finir le tirage au vide. Le " +
    "B P s'ouvre, K M un retombe, et son maintien disparaît avec lui. À partir de là, le B P " +
    "peut bien se refermer : tant que B un n'a pas rappelé K A, le compresseur reste à l'arrêt. " +
    "Retenez : le tirage au vide se fait une fois par demande, et une seule.",

  "preuve":
    "Sur le terrain, méfiez-vous du mot amélioré. Un relais dans l'armoire ne prouve pas cette " +
    "fonction : un relais câblé autrement peut servir à tout autre chose. La preuve se fait en " +
    "deux temps. D'abord lire le schéma : quels contacts de K A autorisent Y un et le " +
    "démarrage. Ensuite tester : machine à l'arrêt, faites remonter doucement la basse " +
    "pression, et vérifiez que le compresseur ne repart pas sans demande du thermostat. " +
    "Retenez : la fonction d'un relais se prouve par ses contacts et par un essai, jamais par " +
    "sa présence."
});
