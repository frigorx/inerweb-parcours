/* Narration de la station « Le réservoir d’huile ». */
NARRATION("reservoir-huile-pedagogique", {

  "rappel":
    "Retenez la différence en une phrase : le séparateur récupère, le réservoir rend " +
    "disponible. Dans une centrale, l’huile séparée n’est pas envoyée au hasard vers le " +
    "premier compresseur venu. Elle rejoint une réserve commune, placée entre le séparateur et " +
    "les régulateurs de niveau. Pourquoi ? Parce que les compresseurs n’entraînent pas la même " +
    "quantité d’huile au même moment, et ne la récupèrent pas au même rythme. Le réservoir " +
    "absorbe ces écarts.",

  "fonction":
    "On l’appelle souvent le bouteillon. Sa fonction, c’est de compenser : la quantité d’huile " +
    "qui revient n’est jamais identique d’un instant à l’autre. Il reçoit l’huile du " +
    "séparateur et constitue un volume tampon avant les carters. Il fait aussi autre chose, " +
    "qu’on oublie : dans un montage basse pression, il laisse une partie du fluide dissous " +
    "s’échapper de l’huile avant la distribution. C’est du dégazage. L’huile qui repart vers " +
    "les carters est donc un peu plus proche de sa vraie viscosité.",

  "raccordements":
    "Faites le tour de ses raccordements, un par un, chacun a sa mission. L’huile entre depuis " +
    "le séparateur. Elle ressort vers la ligne qui alimente les régulateurs. La partie haute " +
    "peut porter une branche de pression, ou de dégazage, vers l’aspiration — cela dépend de " +
    "l’architecture. Et autour, vous trouverez des vannes pour isoler, des prises de pression " +
    "pour mesurer, et des voyants pour suivre la réserve. Isoler, mesurer, suivre : trois " +
    "usages, et la notice dit lesquels sur votre machine.",

  "pression":
    "Question simple, et qui décide de tout : qu’est-ce qui fait sortir l’huile du réservoir ? " +
    "Une différence de pression. L’huile ne part que si la pression disponible dépasse celle du " +
    "carter, plus les pertes de charge du chemin. Cette différence vient de deux sources " +
    "possibles. Une hauteur, quand le réservoir est placé au-dessus des carters, comme le " +
    "prescrit l’étude. Ou une branche de pression, contrôlée par un clapet différentiel. La " +
    "solution retenue et la valeur utile dépendent du montage, des pressions d’aspiration et " +
    "des régulateurs installés.",

  "niveau":
    "Les voyants du réservoir montrent une réserve. Ils ne donnent pas un verdict. Le niveau " +
    "varie normalement : avec les régimes, avec les dégivrages, avec le retour progressif de " +
    "l’huile partie dans l’installation. Alors observez-les sur une durée suffisante, et notez " +
    "quels compresseurs tournent pendant ce temps. Un voyant regardé une fois, sans le régime " +
    "et sans l’heure, ne vous apprend rien. Les limites d’ajout et de vidange, elles, se " +
    "prennent dans la notice du réservoir et dans la procédure de mise en service.",

  "mise-en-service":
    "La première charge se fait avec l’huile approuvée, et avec la même référence que celle des " +
    "compresseurs. Pas une huile voisine, pas une huile de même grade : la même référence. " +
    "Suivez la procédure de remplissage de la documentation du système. Et pendant les premiers " +
    "régimes, surveillez le retour avant tout nouvel ajout. C’est une erreur classique : " +
    "l’huile répartie dans l’installation revient progressivement, et si vous avez rechargé " +
    "trop tôt, vous vous retrouvez en surremplissage quand tout est revenu.",

  "securite":
    "Un rappel de sécurité, parce que ce n’est pas un bidon posé au sol : le réservoir est un " +
    "appareil sous pression. Voyants, vannes et raccords sont autant de points de fuite " +
    "possibles. Avant toute intervention : consignation, isolement, contrôle de pression, et la " +
    "procédure adaptée au fluide. Et après un démontage, ne remontez pas les anciens joints : " +
    "remplacez-les par ceux qui sont prévus, et appliquez le couple prescrit par le fabricant.",

  "diagnostic":
    "Le niveau du réservoir raconte l’état de toute la chaîne, pas seulement le sien. Un niveau " +
    "durablement bas peut révéler un manque de séparation, une fuite, ou de l’huile retenue " +
    "quelque part dans le circuit. Un niveau trop haut raconte autre chose : un retour massif " +
    "après dégivrage, un surremplissage, ou des carters qui n’acceptent plus l’huile qu’on leur " +
    "envoie. Dans les deux cas, recoupez avant d’agir : les niveaux de carter, la pression du " +
    "réservoir, l’état des vannes, les filtres et les régulateurs.",

});
