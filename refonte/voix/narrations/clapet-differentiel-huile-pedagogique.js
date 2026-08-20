/* Narration de la station « Le clapet différentiel d’huile ». */
NARRATION("clapet-differentiel-huile-pedagogique", {

  "rappel":
    "Repartons du problème. Pour que l’huile aille du réservoir jusqu’au carter, il faut que " +
    "la pression disponible au réservoir dépasse celle du carter. Et pas seulement de justesse : " +
    "cette différence doit aussi vaincre toutes les pertes de charge du chemin — la conduite, " +
    "la vanne, le filtre, le régulateur. Dans un système basse pression, c’est le clapet taré " +
    "qui contrôle cette pression du réservoir, par rapport à l’aspiration. Voilà sa raison " +
    "d’être : fabriquer l’écart qui met l’huile en mouvement.",

  "branche":
    "Attention, c’est ici que beaucoup se trompent. Le clapet ne travaille pas sur la conduite " +
    "d’huile. Il travaille sur la branche de pression : il relie la partie haute du réservoir à " +
    "une pression de référence, en général l’aspiration prévue par le concepteur. Son geste " +
    "est simple : il évacue l’excès de pression, pour conserver un écart déterminé au-dessus de " +
    "cette référence. L’huile liquide, elle, suit un autre chemin, vers le filtre et les " +
    "régulateurs. Elle ne traverse pas ce clapet. Deux conduites, deux missions.",

  "fonctionnement":
    "Ce qui fixe l’écart, c’est un ressort. Tant que la pression du réservoir reste sous la " +
    "condition d’ouverture, le clapet demeure fermé : la pression monte. Dès qu’elle dépasse la " +
    "référence de la valeur prévue, il s’ouvre vers l’aspiration, et l’excès s’échappe. C’est " +
    "un régulateur d’écart, pas un régulateur de pression absolue. Le tarage choisi dépend " +
    "des régulateurs installés, des pertes de charge du circuit, et des variations de pression " +
    "du système.",

  "modeles":
    "Deux familles. Un clapet fixe, dont le ressort est étalonné en usine. Ou un modèle " +
    "réglable, qu’on ajuste dans sa plage autorisée. Avant de monter l’un ou l’autre, vérifiez " +
    "cinq points : le sens de passage, les raccordements, la pression admissible, la plage " +
    "différentielle, et la compatibilité avec le fluide et l’huile. Et une règle ferme sur le " +
    "réglage : on ne règle jamais pour essayer. Un tarage répond à un calcul et à la " +
    "documentation de l’installation. Tourner la vis pour voir, c’est perdre la référence.",

  "pressions-multiples":
    "Voici un cas qui piège. Une centrale peut alimenter des compresseurs qui ne travaillent " +
    "pas à la même pression d’aspiration. Or le réservoir n’a qu’une seule pression. Elle doit " +
    "donc rester suffisamment au-dessus du carter le plus défavorable — celui qui est soumis à " +
    "la pression de référence la plus haute. Si vous réglez pour le cas moyen, un carter sera " +
    "mal alimenté. Le point de raccordement et le clapet se choisissent donc sur " +
    "l’architecture réelle, en particulier sur les systèmes à étages.",

  "defauts":
    "Deux défauts opposés, à ne pas confondre. Écart insuffisant : l’huile circule mal vers les " +
    "régulateurs, les carters se remplissent lentement ou pas du tout. Écart excessif : le " +
    "régulateur est alimenté trop brutalement, et le carter s’en trouve perturbé. Le piège, " +
    "c’est que plusieurs causes très différentes produisent les mêmes symptômes : une flèche " +
    "montée à l’envers, un ressort inadapté, une conduite obstruée, ou tout simplement une " +
    "aspiration très variable. Le symptôme ne désigne pas la cause.",

  "verification":
    "Comment contrôler un clapet ? En comparant deux pressions, pas une. Relevez la pression du " +
    "réservoir et la pression de référence, dans un régime stabilisé, et notez quels " +
    "compresseurs tournent à ce moment-là. Faites la différence, puis comparez-la à la valeur " +
    "prescrite pour le clapet et pour les régulateurs. Ensuite seulement, contrôlez le sens de " +
    "montage, le raccordement, la stabilité et l’absence de fuite. Tout cela vient avant tout " +
    "réglage, et bien avant tout remplacement.",

});
