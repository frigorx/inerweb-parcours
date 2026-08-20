/* Narration de la station « La chaîne de l’huile : mettre sous pression et régler ». */
NARRATION("elements-circuit-huile-regler", {

  "differentiel":
    "Pour que l’huile aille du réservoir vers le carter, il faut une différence de pression. " +
    "C’est le rôle du clapet taré. Dans un système basse pression, il évacue vers l’aspiration " +
    "l’excès de pression du réservoir, et il maintient ainsi la réserve à une pression réglée " +
    "un peu au-dessus de l’aspiration et du carter. Un petit écart, volontairement petit : " +
    "assez pour que l’huile circule vers le régulateur, pas assez pour l’y envoyer " +
    "brutalement. La valeur de ce tarage n’est pas universelle. Elle doit convenir au montage, " +
    "aux variations d’aspiration et aux organes réellement installés.",

  "mecanique":
    "Le régulateur mécanique, celui que l’atelier appelle le pot A C et R. Il se monte à la " +
    "place du voyant, sur le carter du compresseur — il doit voir le niveau qu’il alimente. " +
    "Son principe est purement mécanique. Le niveau baisse, le flotteur descend, il ouvre un " +
    "pointeau, l’huile entre. Le niveau remonte, le flotteur remonte, l’alimentation se " +
    "referme. Trois conditions pour qu’il fonctionne : il doit être horizontal, adapté au " +
    "compresseur, et alimenté avec le différentiel prévu. Et voici sa limite, qu’on oublie " +
    "souvent : il sait ajouter l’huile qui manque. Il ne sait pas retirer celle qui est en trop.",

  "traxoil":
    "Le TraxOil est la version électronique. Il remplace le voyant du compresseur et surveille " +
    "plusieurs zones de niveau au lieu d’une seule. Selon le modèle : un capteur détecte le " +
    "niveau, des voyants annoncent l’état, et une électrovanne intégrée admet l’huile qui " +
    "manque. Il fait une chose de plus que le mécanique : il compte le temps. Si le niveau ne " +
    "revient pas dans le délai prévu, un contact transmet une alarme, ou arrête le compresseur. " +
    "Attention aux références : O M trois, O M quatre et O M cinq n’ont pas le même domaine de " +
    "pression. Vérifiez le modèle, le fluide, l’adaptateur, l’alimentation, et la notice.",

  "diagnostic":
    "Terminons par une confusion qui coûte cher. Le niveau et la pression d’huile ne racontent " +
    "pas le même défaut. Le niveau décrit une réserve dans le carter. Le pressostat " +
    "différentiel, lui, décrit la pression nette que produit une pompe à huile. Ce sont deux " +
    "grandeurs différentes, sur deux organes différents. Pour un niveau bas, suivez la chaîne : " +
    "la réserve, les vannes, le filtre, le régulateur, la séparation, et le retour naturel. " +
    "Pour une sécurité d’huile sur compresseur à pompe, relevez P un côté huile, P deux côté " +
    "carter, faites la différence, et tenez compte de la temporisation. Ne confondez jamais " +
    "une alarme de niveau avec une sécurité de pression différentielle.",

});
