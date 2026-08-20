/* Narration de la station « TraxOil : monter et diagnostiquer ». */
NARRATION("traxoil-installer", {

  "modeles":
    "Trois références, et elles ne sont pas interchangeables. Leur domaine de pression, leurs " +
    "fluides et leurs joints correspondent à des applications différentes. La gamme O M trois " +
    "et O M quatre couvre des applications H F C et H F O sélectionnées ; l’O M quatre a aussi " +
    "des usages en R sept cent quarante-quatre subcritique. L’O M cinq, lui, vise le R sept " +
    "cent quarante-quatre transcritique. Et pour un fluide A deux L ou A trois, n’employez que " +
    "la version, l’adaptateur et le câblage approuvés. Rien d’approchant.",

  "montage":
    "Le montage conditionne la mesure. Le régulateur se pose sur le raccord de voyant, avec " +
    "l’adaptateur prévu — pas un autre. Respectez l’orientation, les joints, l’alimentation " +
    "électrique, le contact d’alarme et la mise à la terre, selon la notice. Installez les " +
    "vannes et le filtre demandés en amont : ils protègent l’électrovanne exactement comme ils " +
    "protégeaient le pointeau mécanique. Et faites le contrôle d’étanchéité avant la mise en " +
    "service, pas après.",

  "bp":
    "Première architecture : la basse pression. Le séparateur envoie l’huile vers un réservoir, " +
    "maintenu au-dessus de la pression des carters. Une branche de dégazage contrôlée rejoint " +
    "l’aspiration. Et la ligne d’huile liquide passe par les vannes et le filtre, puis arrive " +
    "au TraxOil. L’intérêt de ce montage tient en une phrase : il découple la haute pression " +
    "de refoulement de l’alimentation des carters. Les carters ne reçoivent jamais l’huile à " +
    "la pression du refoulement.",

  "hp":
    "Deuxième architecture : la haute pression. Ici, une réserve intégrée au séparateur peut " +
    "alimenter directement un régulateur électronique compatible. Plus simple en apparence, " +
    "mais il y a une difficulté. L’huile sous haute pression contient beaucoup plus de fluide " +
    "dissous. Quand elle se détend en arrivant au carter, ce fluide se vaporise brutalement : " +
    "cela dégaze, et cela mousse. C’est pourquoi le débit, l’orifice, le modèle et la stratégie " +
    "d’injection ne sont pas laissés au choix de l’installateur : le fabricant les impose.",

  "diagnostic":
    "Une diode rouge ne veut pas dire TraxOil défectueux. Elle dit une seule chose : le niveau " +
    "n’est pas revenu comme attendu. La cause est presque toujours ailleurs. Vérifiez donc " +
    "d’abord la réserve, la pression amont, les vannes, le filtre, l’alimentation électrique, " +
    "l’électrovanne, l’adaptateur, et l’historique de l’installation. Puis remontez encore : le " +
    "séparateur, le retour naturel, les fuites, les régimes. Le contrôleur peut très bien " +
    "signaler correctement un défaut qui lui est parfaitement extérieur.",

});
