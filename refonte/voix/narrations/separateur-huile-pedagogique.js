/* Narration de la station « Le séparateur d’huile ». */
NARRATION("separateur-huile-pedagogique", {

  "rappel":
    "Une petite part de l’huile quitte toujours le compresseur avec le gaz de refoulement. " +
    "Toujours. Le séparateur ne supprime pas ce phénomène : il en réduit la part qui poursuit " +
    "sa route. Le retour naturel reste donc nécessaire dans les échangeurs et les tuyauteries. " +
    "Gardez cela en tête pendant toute la station : le séparateur ne corrige ni une mauvaise " +
    "pente, ni une vitesse insuffisante. Poser un séparateur sur une tuyauterie mal " +
    "dimensionnée ne règle rien.",

  "position":
    "Sa place est précise : sur le refoulement, après le compresseur et avant le condenseur. " +
    "C’est là qu’il reçoit le gaz le plus chargé en huile. Trois raccordements. L’entrée, qui " +
    "reçoit le mélange gaz et huile. La sortie principale, en haut, qui conduit le gaz vers le " +
    "condenseur. Et la sortie basse, qui collecte l’huile — soit pour un retour direct au " +
    "carter, soit pour alimenter un réservoir. Retenez l’ordre : compresseur, séparateur, " +
    "condenseur.",

  "technologies":
    "Comment sépare-t-on de l’huile d’un gaz ? De trois façons, souvent combinées. Le gaz " +
    "ralentit brusquement : les gouttelettes perdent leur vitesse et tombent. Le gaz change de " +
    "direction : les gouttelettes, plus lourdes, ne suivent pas le virage. Ou bien il traverse " +
    "un élément de coalescence, où les fines gouttelettes se rassemblent en gouttes assez " +
    "grosses pour tomber. L’efficacité de tout cela varie avec le débit, la taille des " +
    "gouttelettes, la viscosité et la technologie interne. Elle n’est jamais totale.",

  "flotteur":
    "Sur un séparateur à flotteur, l’huile s’accumule dans la partie basse. Le flotteur " +
    "monte avec elle. En montant, il déplace un levier et ouvre le pointeau de retour : " +
    "l’huile part. Le niveau redescend, le flotteur redescend, le pointeau se referme. " +
    "Pourquoi cette fermeture est-elle si importante ? Parce que si le pointeau restait " +
    "ouvert, ce n’est plus de l’huile qui passerait, mais du gaz chaud de refoulement, en " +
    "permanence, directement vers le carter. Un bipasse permanent que personne ne veut.",

  "retours":
    "Où repart l’huile collectée ? Cela dépend de l’installation. Sur une installation simple, " +
    "elle rejoint directement le carter du compresseur concerné. Sur une centrale, c’est " +
    "différent : un séparateur commun ne peut pas choisir quel compresseur servir. Il alimente " +
    "donc un réservoir, et c’est le réservoir qui distribue aux différents régulateurs. À " +
    "partir de là, les clapets, filtres, vannes et régulateurs dépendent de l’architecture, " +
    "basse ou haute pression.",

  "selection":
    "Un séparateur ne se choisit pas pour un débit, mais pour toute une plage. Rappelez-vous " +
    "qu’une centrale peut tourner avec un seul compresseur, ou avec tous. À faible débit, " +
    "certains principes de séparation deviennent inefficaces. À débit élevé, ce sont la " +
    "capacité et la perte de charge qui deviennent critiques. Alors vérifiez dans la notice : " +
    "le fluide, l’huile, la pression admissible, le débit minimal et maximal, l’orientation et " +
    "les raccordements. Le débit minimal est celui qu’on oublie.",

  "controle":
    "Comment savoir qu’un séparateur fait son travail ? Pas avec un seul indice. Un séparateur " +
    "efficace stabilise les niveaux sans laisser passer de gaz dans la ligne d’huile. " +
    "Observez donc plusieurs choses ensemble : le niveau du carter, le niveau du réservoir, la " +
    "température de la conduite de retour, le bruit, la fréquence des cycles de retour, et les " +
    "traces de fuite. Puis comparez tout cela aux compresseurs actifs et à l’historique. Une " +
    "température relevée seule ne prouve rien du tout.",

  "diagnostic":
    "Niveau bas : ne condamnez pas le séparateur tout de suite. Le défaut peut être avant lui, " +
    "en lui, ou après lui. Alors procédez dans l’ordre. D’abord le retour naturel, en amont. " +
    "Ensuite l’accumulation dans le séparateur lui-même. Puis l’ouverture de son retour. Puis " +
    "le réservoir. Puis la distribution. Et pendant ce parcours, cherchez aussi les quatre " +
    "causes qui n’ont rien à voir avec l’organe : une fuite d’huile, une charge initiale " +
    "incorrecte, un filtre colmaté, ou un régulateur qui n’est pas alimenté.",

});
