/* Narration de la station « Le pressostat d’huile : la pression nette ». */
NARRATION("pressostat-differentiel-huile-pedagogique", {

  "distinguer":
    "Trois organes parlent d’huile, et on les confond sans arrêt. Alors mettons-les en ordre. " +
    "Le régulateur maintient un niveau. Le clapet différentiel maintient la pression du " +
    "réservoir. Le pressostat, lui, protège la lubrification du compresseur. Ce sont trois " +
    "missions différentes. Et retenez surtout ce que le pressostat ne fait pas : il ne remet " +
    "pas d’huile dans le carter, et il ne règle aucun niveau. Il surveille la pression nette " +
    "produite par une pompe à huile, et il agit sur la chaîne de sécurité. C’est tout, et " +
    "c’est déjà beaucoup.",

  "application":
    "Ce contrôle ne concerne pas tous les compresseurs : seulement ceux qui sont lubrifiés par " +
    "pompe. Une pompe mécanique, entraînée avec le compresseur, aspire l’huile du carter et " +
    "l’envoie vers les paliers. Cela change tout, et notamment ceci : à l’arrêt, la pompe ne " +
    "tourne pas, donc elle ne produit aucune différence de pression utile. Souvenez-vous de ce " +
    "détail, il expliquera la temporisation. Le montage, les seuils et le délai doivent " +
    "correspondre au compresseur et au modèle de contrôle.",

  "prises":
    "Deux prises de pression, mais une seule information. P un, côté huile, reçoit la pression " +
    "de sortie de pompe. P deux, côté basse pression, reçoit la pression du carter, ou " +
    "l’aspiration prévue. La pression nette de lubrification, c’est la différence : P un moins " +
    "P deux. Voilà le piège classique. Vous lisez une pression P un élevée et vous concluez " +
    "que tout va bien. Mais si P deux est élevée elle aussi, la différence peut être " +
    "insuffisante. Une seule pression ne dit rien. C’est l’écart qui lubrifie.",

  "seuils":
    "Deux réglages à ne pas mélanger. Le seuil, c’est la valeur basse : quand la pression nette " +
    "passe dessous, la temporisation démarre. Le différentiel de contact, lui, c’est autre " +
    "chose : pour revenir à l’état normal, la pression doit remonter au-delà du seuil, plus ce " +
    "différentiel propre au modèle. Il faut donc remonter plus haut qu’on n’est descendu. Et " +
    "une mise en garde : l’échelle imprimée sur le boîtier est un repère, pas une mesure. Le " +
    "contrôle se fait avec des instruments et avec la notice exacte.",

  "mecanisme":
    "Regardons le mécanisme d’un modèle mécanique. Deux éléments sensibles reçoivent P un et " +
    "P deux, montés en opposition : ils poussent l’un contre l’autre. C’est leur différence qui " +
    "déplace le mécanisme, et ce mécanisme commande le circuit de temporisation. Sur l’écran, " +
    "vous verrez les deux côtés, le contact T un T deux, la résistance, le bilame, puis le " +
    "contact L M. Suivez cette chaîne dans l’ordre : chaque élément commande le suivant, et " +
    "c’est ainsi que la pression finit par couper un moteur.",

});
