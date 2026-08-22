/* Narration de la station « La protection minimum ». */
NARRATION("protection-minimum-serie", {

  "serie":
    "Ici, tout passe par la même autorisation. Le pressostat H P, le pressostat B P et le " +
    "thermostat B un sont câblés en série, l'un derrière l'autre, avant la bobine K M un. Si un " +
    "seul de ces contacts s'ouvre, la chaîne est coupée et le compresseur s'arrête. Et regardez " +
    "la deuxième ligne du schéma : un contact auxiliaire de K M un alimente l'électrovanne " +
    "Y un. Quand le compresseur tombe, l'auxiliaire s'ouvre, et Y un ferme la ligne liquide. " +
    "Retenez : dans une chaîne en série, une seule ouverture arrête le froid et ferme la ligne " +
    "liquide en même temps.",

  "arret":
    "Que ce soit le thermostat qui ouvre à la consigne, ou un pressostat qui ouvre sur défaut, " +
    "le résultat électrique est le même : K M un retombe, puis Y un se ferme. Mais sur le " +
    "terrain, ne confondez pas les deux causes. Un arrêt de régulation est normal et se " +
    "réenclenche seul. Un arrêt de sécurité signale un problème : cherchez la cause avant de " +
    "remettre en route, et regardez si le pressostat est à réarmement manuel. Retenez : même " +
    "résultat électrique, mais deux significations très différentes pour le dépanneur.",

  "pas-pumpdown":
    "Voici le piège classique : il y a une électrovanne sur ce schéma, et pourtant ce n'est pas " +
    "un pump-down. La présence d'une électrovanne ne prouve rien. Le critère, c'est l'ordre des " +
    "arrêts : dans un pump-down, Y un ferme d'abord, et le compresseur continue d'aspirer pour " +
    "vider l'évaporateur avant de s'arrêter. Ici, K M un et Y un tombent pratiquement ensemble : " +
    "l'évaporateur n'est pas vidé, le fluide reste où il est. Retenez : pour reconnaître un " +
    "pump-down, ne cherchez pas l'électrovanne, cherchez le décalage entre sa fermeture et " +
    "l'arrêt du compresseur."
});
