/* Narration de la station « Le pressostat d’huile : temporisation et sécurité ». */
NARRATION("pressostat-huile-securite", {

  "demarrage":
    "Au démarrage, il y a un moment où tout semble en défaut — et c’est normal. La pompe doit " +
    "d’abord tourner avant qu’une pression nette puisse s’établir. Si le pressostat coupait " +
    "immédiatement, aucun compresseur ne démarrerait jamais. C’est le rôle de la temporisation : " +
    "elle autorise cette phase de montée en pression. Et si le différentiel devient suffisant " +
    "avant la fin du délai, la temporisation s’arrête d’elle-même et le compresseur continue. " +
    "Le défaut n’a été toléré que le temps de s’établir.",

  "fonctionnement":
    "En marche, la logique est la même, mais elle raconte autre chose. Une pression nette qui " +
    "passe sous le seuil relance la temporisation. Si elle remonte assez vite, la marche " +
    "normale reprend : c’était une chute passagère, un changement de régime, une bulle. Mais " +
    "si elle reste trop faible pendant tout le délai, le contact de sécurité coupe la commande " +
    "et signale le défaut. Retenez la nuance : ce n’est pas la chute qui arrête le compresseur, " +
    "c’est la chute qui dure.",

  "electrique":
    "Côté électrique, le pressostat prend place dans la chaîne de sécurité — celle qui autorise " +
    "le contacteur ou l’automate du compresseur. Les bornes, la tension, le voyant, la fonction " +
    "test, le délai, et le réarmement manuel ou automatique changent d’un composant à l’autre : " +
    "suivez le schéma de celui qui est installé. Et une règle qui ne souffre aucune exception : " +
    "après un déclenchement, on cherche la cause avant de réarmer. Un test fonctionnel se fait " +
    "selon la procédure du constructeur, pas en pontant le contact.",

  "mesurer":
    "Le diagnostic demande deux pressions prises au même instant, pas l’une puis l’autre. " +
    "Relevez P un et P deux pendant le même régime, calculez la différence, et suivez comment " +
    "elle évolue dans le temps. Comparez ensuite à la notice. Puis contrôlez tout ce qui peut " +
    "faire chuter cette pression nette : le niveau d’huile, sa température, une dilution ou de " +
    "la mousse, la crépine, la pompe elle-même, son entraînement, et les prises de pression. Un " +
    "contact défectueux n’est une hypothèse qu’après tout cela.",

  "conclure":
    "Dernier point, et c’est le plus important pour votre sécurité comme pour la machine. Un " +
    "réarmement qui réussit ne prouve rien. Le défaut peut disparaître quelques instants, puis " +
    "revenir quand l’huile chauffe, quand elle mousse, ou quand le régime change. Alors rendez " +
    "compte : décrivez le déclenchement, les pressions relevées, la durée, et les contrôles " +
    "que vous avez faits. Concluez par une hypothèse vérifiable et par l’action sûre suivante. " +
    "Et ne modifiez jamais le seuil pour faire tenir la marche : ce seuil protège le " +
    "compresseur, pas votre planning.",

});
