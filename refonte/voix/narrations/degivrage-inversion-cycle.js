/* Narration de la station « Le dégivrage par inversion de cycle ». */
NARRATION("degivrage-inversion-cycle", {

  "roles":
    "L'inversion de cycle va plus loin que la dérivation : la vanne quatre voies redistribue " +
    "l'aspiration et le refoulement, et les deux échangeurs échangent leurs rôles. La batterie " +
    "à dégivrer reçoit le refoulement chaud : elle devient condenseur le temps du dégivrage, et " +
    "rejette sa chaleur dans le givre. L'autre échangeur devient l'évaporateur du cycle " +
    "inversé. C'est le principe de la pompe à chaleur réversible que vous retrouverez partout " +
    "en climatisation. Retenez la différence : l'inversion échange les rôles des deux " +
    "batteries, quand le gaz chaud ne faisait que dériver le refoulement.",

  "compatibilite":
    "Attention au raccourci de schéma : on ne transforme pas un circuit conventionnel en " +
    "machine réversible en retournant deux flèches. Tous les organes traversés comptent. Le " +
    "circuit de détente doit alimenter correctement l'échangeur qui devient évaporateur, dans " +
    "les deux modes. Les clapets, les accumulateurs, la régulation sont choisis par le " +
    "constructeur pour cette séquence-là. Sur le schéma de commande, notez aussi " +
    "l'interverrouillage : pendant le dégivrage, les ventilateurs sont arrêtés. Retenez : une " +
    "inversion de cycle est une architecture complète, pas une vanne posée sur un circuit " +
    "ordinaire.",

  "retour-froid":
    "La fin de dégivrage ne termine pas la séquence. La vanne quatre voies revient en position " +
    "froid, et il faut laisser la machine se stabiliser : les pressions s'équilibrent, l'eau " +
    "fondue finit de s'égoutter. Puis la production de froid reprend. Et les ventilateurs, " +
    "comme toujours, redémarrent en différé, quand la batterie est redevenue suffisamment " +
    "froide — pour ne pas souffler d'air chaud et de gouttelettes sur les produits. Retenez la " +
    "chronologie de sortie : fin sur sonde, retour de la vanne, égouttage et stabilisation, " +
    "froid, puis ventilateurs différés."
});
