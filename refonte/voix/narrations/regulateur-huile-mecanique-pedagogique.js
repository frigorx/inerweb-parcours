/* Narration de la station « Le régulateur mécanique AC&R ». */
NARRATION("regulateur-huile-mecanique-pedagogique", {

  "rappel":
    "La chaîne se termine ici, au plus près du compresseur. Le réservoir et le clapet " +
    "différentiel rendent l’huile disponible : ils la mettent à portée, sous la bonne pression. " +
    "Mais ils ne savent pas de combien chaque carter a besoin. C’est le rôle du régulateur, " +
    "que l’atelier appelle le pot A C et R. Lui ne regarde qu’une seule chose : le niveau de " +
    "son carter. Et il n’admet de l’huile que lorsque son flotteur le trouve trop bas.",

  "montage":
    "Il se fixe au raccord de voyant prévu par le compresseur — il prend littéralement la place " +
    "du voyant. Une bride ou un adaptateur assure la liaison mécanique et l’étanchéité. Sur les " +
    "modèles qui le permettent, un voyant reste visible sur le régulateur lui-même : vous " +
    "continuez donc à voir le niveau. Et une exigence à ne jamais négliger : l’ensemble doit " +
    "être parfaitement horizontal, selon la notice. Un appareil posé de travers mesure de " +
    "travers.",

  "mecanisme":
    "Le mécanisme est purement mécanique, et c’est sa force. Le niveau baisse. Le flotteur " +
    "descend avec lui. En descendant, il ouvre une vanne-pointeau. L’huile entre — poussée par " +
    "le différentiel entre la ligne d’alimentation et le carter. Le niveau remonte, le " +
    "flotteur remonte, et le pointeau se referme progressivement. Progressivement, pas d’un " +
    "coup : c’est ce qui évite les à-coups. Aucune électronique là-dedans, aucune alimentation " +
    "électrique.",

  "niveau":
    "Quel niveau vise-t-il ? Cela dépend du modèle. Certains maintiennent un niveau défini en " +
    "usine. D’autres autorisent une plage d’ajustement. Mais dans les deux cas, la cible ne " +
    "vient ni de vous, ni de l’habitude : elle vient de la documentation du compresseur et de " +
    "celle du régulateur. Et si le modèle est réglable, ne devinez ni le sens, ni le nombre de " +
    "tours. Cela change d’un produit à l’autre.",

  "differentiel":
    "Un pointeau conçu pour une faible différence de pression ne se comporte pas comme un " +
    "organe haute pression. Chaque régulateur a donc une plage de différentiel admissible, et " +
    "il faut y rester. Vérifiez quatre valeurs : la pression amont, la pression du carter, les " +
    "pertes de charge du chemin, et la plage du modèle. Trop peu de différentiel, et le carter " +
    "reste bas. Trop, et l’admission devient brutale : instabilité, et excès d’huile.",

  "proteger":
    "Le pointeau est la pièce fragile de l’ensemble. Une seule particule peut l’empêcher de se " +
    "refermer, ou réduire le débit d’admission. C’est pourquoi la notice demande un filtre et " +
    "des vannes en amont. Installez-les. Et le jour où le carter reste bas, avant de mettre en " +
    "cause le régulateur, contrôlez ce qui le précède : le colmatage du filtre, le sens de " +
    "montage, l’ouverture des vannes, la perte de charge. Le régulateur est souvent " +
    "l’accusé, rarement le coupable.",

  "limites":
    "Connaissez ses limites, elles sont nettes. Le pot mécanique ajoute de l’huile ; il n’en " +
    "retire pas. Si le carter est déjà trop rempli, fermer le pointeau n’évacue rien du tout. " +
    "Il ne produit pas non plus d’alarme électrique : il ne prévient personne. Et son mouvement " +
    "peut être perturbé par quatre choses ordinaires : les vibrations, un défaut " +
    "d’horizontalité, une pression instable, ou une huile dégradée.",

  "diagnostic":
    "Voyant bas ne veut pas dire flotteur en panne. Commencez par une question simple : " +
    "est-ce qu’une huile correcte arrive réellement à l’entrée du régulateur ? Pour le savoir, " +
    "remontez la chaîne : la réserve, le différentiel, les vannes, le filtre, les raccords. " +
    "Ensuite seulement, observez le mouvement et le niveau. Et recoupez avec le retour naturel, " +
    "les régimes et la présence de fuites. Tout cela avant de démonter quoi que ce soit.",

});
