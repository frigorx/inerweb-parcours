/* Narration de la station « Sans dégivrage commandé ». */
NARRATION("sans-degivrage-commande", {

  "constat":
    "Sur cette installation, cherchez l'organe de dégivrage : il n'y en a pas. Pas d'horloge, " +
    "pas de résistance, pas de sonde de fin. La production de froid s'arrête simplement quand " +
    "la température atteint la consigne. Et pendant cet arrêt, si l'enceinte est en température " +
    "positive, l'air ambiant peut réchauffer la batterie et faire fondre le givre. Mais ne " +
    "concluez pas trop vite : cette fonte dépend du temps d'arrêt, de l'humidité, du régime " +
    "réel. Retenez la nuance : pas de dégivrage commandé ne veut pas dire aucune fonte — cela " +
    "veut dire que personne ne la pilote.",

  "limites":
    "C'est le givre qui décide si cette simplicité suffit. Une batterie prise en givre échange " +
    "moins bien, et laisse moins passer l'air : la puissance chute, le froid se fait mal. En " +
    "atelier, trois contrôles : l'état des ailettes, le débit d'air ressenti, et l'écoulement " +
    "des condensats. Et surtout, ne copiez jamais la fréquence de dégivrage d'une autre " +
    "installation : la charge, les ouvertures de porte et l'humidité changent tout d'une " +
    "chambre à l'autre. Retenez : c'est l'état réel de la batterie qui juge, pas l'habitude.",

  "decision":
    "Avant d'ajouter une régulation de dégivrage, on observe. Relevez quand le givre apparaît, " +
    "si les arrêts naturels suffisent à le faire fondre, et si l'eau s'évacue correctement. " +
    "Regardez le chronogramme réel de la machine, pas seulement le paramètre affiché au " +
    "régulateur. Puis comparez ces constats au cahier des charges et à la notice du matériel. " +
    "Si les arrêts sont trop courts pour la fonte, alors un cycle commandé se justifie — c'est " +
    "l'objet des stations suivantes. Retenez la méthode : observer d'abord, décider ensuite, " +
    "et prouver le besoin avant d'ajouter un organe."
});
