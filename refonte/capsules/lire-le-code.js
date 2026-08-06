/* =====================================================================
   lire-le-code.js — capsule pilote : « Lire le code d'un fluide »
   ---------------------------------------------------------------------
   DÉMONSTRATION DU MODÈLE (voir refonte/MODELE-CAPSULE.md).

   Le contenu vient du tuto « nomenclature-interactive » du fonds. Rien
   n'est jeté — mais ce qui encombrait le fil est descendu dans les
   détours. Le tuto d'origine enchaînait dans un seul fil : les atomes,
   les prises du carbone, la règle ASHRAE, les isomères, les mélanges, le
   glissement, le fractionnement, puis douze questions. Celui qui voulait
   juste savoir lire « R-134a » prenait tout.

   Ici, le fil principal fait SIX écrans et répond à une seule question :
   comment lire le code. Tout le reste est offert en « Voulez-vous en
   savoir plus ? », y compris ce qui est le plus exigible à l'examen —
   les mélanges et le glissement (code 1.06), qui ont leur propre détour
   avec son sous-détour.

   ÉCRITURE — rappels du modèle :
   · texte : ce qui est AFFICHÉ. Court. Une idée. [[mot]] = mot expliqué
     là où il tombe.
   · lu    : ce qui est DIT. Plus parlé, et les nombres EN TOUTES LETTRES
     (« R cent trente-quatre a »), sinon la voix massacre le code.
   ===================================================================== */
CAPSULE({
  id: "lire-le-code",
  ordre: 2,
  titre: "Lire le code d'un fluide",
  question: "R-22, R-134a, R-404A : que veulent dire ces chiffres ?",
  niveau: "découverte",
  minutes: 6,
  suppose: null,

  /* Passe à true le jour où les MP3 sont fabriqués (voir voix/fabriquer.mjs).
     Tant que c'est false, la page parle avec la voix du navigateur et le dit.
     Fabriquée le 06/08/2026 : Henri (masculine) et Denise (féminine). */
  voixFabriquee: true,

  fil: [
    {
      id: "01-bouteille",
      titre: "Sur la bouteille, il y a un code. Il se lit.",
      planche: "../fonds-origine/packs/fluides/res/svg/nomenclature.svg",
      texte: [
        "R-22, R-134a, R-404A. Vous voyez ces codes sur les bouteilles, sur les plaques des machines, sur les fiches d'intervention.",
        "Le **R** veut dire réfrigérant. C'est le même pour tous.",
        "Ce sont les **chiffres** qui parlent. Pour beaucoup de fluides, ils décrivent la [[molécule|un assemblage d'atomes accrochés entre eux]]."
      ],
      lu: "R vingt-deux. R cent trente-quatre a. R quatre cent quatre A. Vous voyez ces codes partout : sur les bouteilles, sur les plaques des machines, sur les fiches d'intervention. Le R veut dire réfrigérant, il est le même pour tous. Ce qui nous intéresse, ce sont les chiffres. Pour beaucoup de fluides, ils décrivent la molécule. En six écrans, vous saurez les lire.",
      plus: ["boules-et-prises"],
      hors: true
    },

    {
      id: "02-trois-cases",
      titre: "D'abord, trois cases. Toujours trois.",
      texte: [
        "La méthode a besoin de **trois** chiffres.",
        "Quand le code n'en montre que deux, on ajoute un zéro devant : R-22 se lit **R-022**.",
        "Ce zéro ne change pas le fluide. Il sert juste à avoir trois cases : **0 · 2 · 2**."
      ],
      lu: "Première chose. La méthode a besoin de trois chiffres, toujours trois. Or R vingt-deux n'en montre que deux. Alors on ajoute un zéro devant, et on lit R zéro vingt-deux. Ce zéro ne change pas le fluide, il ne change rien du tout. Il sert seulement à nous donner trois cases bien nettes : zéro, deux, deux.",
      hors: true
    },

    {
      id: "03-la-regle",
      verifier: [
        "La règle **+1 sur la première case, −1 sur la deuxième, la troisième telle quelle**. Formulation à valider : est-ce ainsi que vous l'enseignez ?",
      ],
      titre: "La règle : plus un, moins un, tel quel.",
      texte: [
        "Les chiffres ne comptent pas directement les atomes. Il y a un décalage, et il faut le connaître.",
        "**Première case + 1** → le nombre de carbones (C).",
        "**Deuxième case − 1** → le nombre d'hydrogènes (H).",
        "**Troisième case, telle quelle** → le nombre de fluors (F)."
      ],
      lu: "Voici la règle, et c'est la seule chose à retenir de cette capsule. Attention : les chiffres ne comptent pas directement les atomes, il y a un décalage. Première case, j'ajoute un : j'obtiens le nombre de carbones. Deuxième case, je retire un : j'obtiens le nombre d'hydrogènes. Troisième case, je ne touche à rien : c'est le nombre de fluors. Plus un, moins un, tel quel.",
      plus: ["pourquoi-cette-regle", "et-le-chlore"],
      hors: true
    },

    {
      id: "04-essai-r22",
      titre: "On essaie : R-22.",
      texte: [
        "R-022, donc **0 · 2 · 2**.",
        "0 + 1 = **1 carbone**. 2 − 1 = **1 hydrogène**. 2 tel quel = **2 fluors**.",
        "Le R-22 est donc bâti sur un carbone, un hydrogène et deux fluors. Et il reste une place libre sur le carbone."
      ],
      lu: "On essaie tout de suite, sur le R vingt-deux. Je l'écris R zéro vingt-deux : zéro, deux, deux. Première case, zéro, plus un : un carbone. Deuxième case, deux, moins un : un hydrogène. Troisième case, deux, sans rien changer : deux fluors. Un carbone, un hydrogène, deux fluors. Et vous allez voir qu'il reste une place libre sur le carbone. Elle n'est pas vide.",
      plus: ["et-le-chlore"],
      hors: true
    },

    {
      id: "05-verif-r134a",
      verifier: [
        "**R-134a = 2 carbones, 2 hydrogènes, 4 fluors, aucun chlore.** À confirmer.",
      ],
      titre: "On vérifie : R-134a.",
      texte: [
        "Trois chiffres déjà là : **1 · 3 · 4**.",
        "1 + 1 = **2 carbones**. 3 − 1 = **2 hydrogènes**. 4 tel quel = **4 fluors**.",
        "Deux carbones, deux hydrogènes, quatre fluors : toutes les places sont prises. **Aucun chlore.** C'est un [[HFC|hydrofluorocarbure : il n'y a que du carbone, de l'hydrogène et du fluor. Sans chlore, il n'attaque pas la couche d'ozone]].",
        "Reste la lettre **a** à la fin. Elle n'est pas décorative."
      ],
      lu: "On vérifie sur le R cent trente-quatre a. Cette fois les trois chiffres sont déjà là : un, trois, quatre. Un plus un : deux carbones. Trois moins un : deux hydrogènes. Quatre, tel quel : quatre fluors. Deux carbones, deux hydrogènes, quatre fluors, et cette fois toutes les places sont prises : il n'y a aucun chlore. C'est ce qu'on appelle un H F C. Reste la petite lettre a, à la fin. Elle n'est pas là pour décorer.",
      plus: ["la-lettre-a", "familles"],
      hors: true
    },

    {
      id: "06-limite",
      titre: "Attention : cette règle ne marche pas sur tout.",
      texte: [
        "Essayez sur **R-404A** : la règle donne n'importe quoi.",
        "C'est normal. Les codes des séries **400** et **500** ne décrivent pas une molécule : ce sont des **[[mélanges|plusieurs fluides différents dans la même bouteille]]**, et leur numéro est un simple numéro d'ordre.",
        "Savoir lire un code, c'est donc aussi savoir **quand il ne se lit pas**."
      ],
      lu: "Un dernier point, et c'est le plus important. Essayez la règle sur le R quatre cent quatre A : elle donne n'importe quoi. C'est normal. Les codes des séries quatre cents et cinq cents ne décrivent pas une molécule. Ce sont des mélanges, plusieurs fluides différents dans la même bouteille, et leur numéro est un simple numéro d'ordre, comme un numéro de dossier. Savoir lire un code, c'est donc aussi savoir reconnaître ceux qui ne se lisent pas. Et pour ceux-là, il y a beaucoup à dire.",
      plus: ["melanges", "familles"],
      hors: true
    }
  ],

  retenir: [
    "Trois cases : on complète avec un zéro devant si besoin.",
    "**Première + 1** = carbones · **deuxième − 1** = hydrogènes · **troisième telle quelle** = fluors.",
    "Les places qui restent sur les carbones sont **du chlore**.",
    "**Séries 400 et 500 : la règle ne s'applique pas**, ce sont des mélanges."
  ],

  /* =====================================================================
     LES DÉTOURS — tout ce qui alourdissait le fil
     ===================================================================== */
  detours: {

    "boules-et-prises": {
      question: "Atome, molécule : de quoi parle-t-on au juste ?",
      ecrans: [
        {
          id: "d-boules-1",
          titre: "Un atome est une boule. Une molécule, un assemblage de boules.",
          texte: [
            "Pas besoin de chimie. Quatre sortes de boules suffisent.",
            "**C** le carbone · **H** l'hydrogène · **F** le fluor · **Cl** le chlore.",
            "Une boule seule : un **atome**. Plusieurs boules accrochées : une **molécule**."
          ],
          lu: "Oublions la chimie compliquée. Imaginez quatre sortes de boules seulement. La boule C, le carbone. La boule H, l'hydrogène. La boule F, le fluor. La boule C L, le chlore. Une boule toute seule s'appelle un atome. Plusieurs boules accrochées ensemble forment une molécule. Vous n'avez besoin de rien savoir de plus.",
          hors: true
        },
        {
          id: "d-boules-2",
          titre: "Le carbone a quatre prises. Les autres, une seule.",
          texte: [
            "Le carbone se branche sur **quatre** points. Comme une multiprise à quatre places.",
            "L'hydrogène, le fluor et le chlore n'occupent **qu'une seule** place chacun.",
            "Décoder un code, c'est donc répondre à une question simple : **qui occupe les quatre places ?**"
          ],
          lu: "Voici la seule règle de construction à connaître. Le carbone possède quatre prises autour de lui. Imaginez une multiprise à quatre places. L'hydrogène, le fluor et le chlore, eux, n'occupent qu'une seule place chacun. Décoder un code, c'est donc répondre à une question toute simple : qui occupe les quatre places ?",
          hors: true
        }
      ]
    },

    "pourquoi-cette-regle": {
      question: "Pourquoi ce décalage bizarre, plus un et moins un ?",
      ecrans: [
        {
          id: "d-regle-1",
          titre: "Parce que c'est une convention. Pas une loi de la nature.",
          texte: [
            "Il n'y a **aucune raison chimique** à chercher. C'est un choix d'écriture, fait par la norme [[ASHRAE 34|la norme américaine qui nomme et classe les fluides frigorigènes. C'est elle qui attribue les numéros R-xxx]].",
            "Un peu comme un indicatif téléphonique : personne ne demande pourquoi la France est le 33.",
            "Ne cherchez pas à comprendre le décalage. **Apprenez-le**, c'est tout."
          ],
          lu: "Beaucoup de stagiaires butent ici, et perdent du temps à chercher une explication. Il n'y en a pas. Aucune raison chimique. C'est simplement un choix d'écriture, fait par la norme ASHRAE trente-quatre. C'est comme un indicatif téléphonique : personne ne demande pourquoi la France porte le trente-trois. Alors ne cherchez pas à comprendre le décalage. Apprenez-le, et passez à la suite.",
          hors: true
        }
      ]
    },

    "et-le-chlore": {
      question: "Le chlore n'est pas dans le code. Où est-il passé ?",
      ecrans: [
        {
          id: "d-chlore-1",
          verifier: [
            "Le chlore **déduit des places restantes** sur les carbones. La méthode par comptage de places vous paraît-elle plus claire que la formule ?",
          ],
          titre: "Le chlore ne se lit pas : il se déduit.",
          texte: [
            "Aucune case ne donne le chlore. Il occupe simplement **les places qui restent**.",
            "Sur le R-22 : un carbone, donc quatre places. Un hydrogène et deux fluors en occupent trois.",
            "Il reste **une place** : c'est **un chlore**. Le R-22 est donc CHClF₂."
          ],
          lu: "Vous avez peut-être remarqué qu'aucune case ne donne le chlore. C'est normal : le chlore ne se lit pas, il se déduit. Il occupe simplement les places qui restent. Reprenons le R vingt-deux. Un carbone, donc quatre places. Un hydrogène et deux fluors en occupent trois. Il reste une place, et cette place, c'est un chlore.",
          hors: true
        },
        {
          id: "d-chlore-2",
          titre: "Et ce chlore, il change tout.",
          texte: [
            "Un fluide **avec** chlore attaque la couche d'ozone. C'est ce qui a fait interdire les [[CFC|chlorofluorocarbures : du chlore et du fluor, pas d'hydrogène. Interdits depuis le protocole de Montréal]] puis les **HCFC** comme le R-22.",
            "Un fluide **sans** chlore ne l'attaque pas. C'est le cas des HFC, comme le R-134a.",
            "Compter les places libres, ce n'est donc pas un exercice d'école : **ça dit à quelle génération appartient le fluide que vous avez en main.**"
          ],
          lu: "Et cette place libre change tout. Un fluide qui contient du chlore attaque la couche d'ozone. C'est exactement ce qui a fait interdire les C F C, puis les H C F C comme le R vingt-deux. Un fluide sans chlore, lui, ne l'attaque pas : c'est le cas du R cent trente-quatre a. Alors compter les places libres n'est pas un exercice d'école. C'est ce qui vous dit à quelle génération appartient la bouteille que vous tenez.",
          plus: ["familles"],
          hors: true
        }
      ]
    },

    "la-lettre-a": {
      question: "Et le petit « a » de R-134a, il sert à quoi ?",
      ecrans: [
        {
          id: "d-lettre-1",
          titre: "Mêmes atomes, rangés autrement.",
          texte: [
            "R-134 et R-134a ont **exactement** les mêmes atomes : deux carbones, deux hydrogènes, quatre fluors.",
            "Mais ils ne sont pas répartis pareil sur les deux carbones. On appelle ça des **[[isomères|mêmes atomes, arrangement différent — donc propriétés différentes]]**.",
            "R-134 : deux fluors d'un côté, deux de l'autre. R-134a : **trois** d'un côté, **un** de l'autre."
          ],
          lu: "Voilà une lettre qui n'a l'air de rien. R cent trente-quatre et R cent trente-quatre a possèdent exactement les mêmes atomes : deux carbones, deux hydrogènes, quatre fluors. Mais ils ne sont pas rangés pareil sur les deux carbones. On appelle cela des isomères. Dans le R cent trente-quatre, les fluors sont répartis deux d'un côté et deux de l'autre. Dans le R cent trente-quatre a, ils sont trois d'un côté et un seul de l'autre.",
          codes: ["1.06"]
        },
        {
          id: "d-lettre-2",
          verifier: [
            "**L'isomère le plus équilibré ne porte pas de lettre**, les suivants prennent a puis b. Règle exacte à confirmer.",
            "**« Deux isomères n'ont pas les mêmes pressions ni les mêmes températures »** — formulation à valider.",
          ],
          titre: "La lettre marque le déséquilibre.",
          texte: [
            "Le plus **équilibré** ne porte pas de lettre : c'est R-134.",
            "Les suivants prennent **a**, puis **b**, à mesure que la répartition devient déséquilibrée.",
            "Ce n'est pas un détail d'écriture. **Deux isomères n'ont pas les mêmes pressions ni les mêmes températures** : ce sont deux fluides différents.",
            "En atelier, retenez ceci : **le « a » fait partie du nom**. Un R-134 n'est pas un R-134a."
          ],
          lu: "La lettre marque ce déséquilibre. Le plus équilibré ne porte aucune lettre : c'est le R cent trente-quatre. Les suivants prennent a, puis b, à mesure que la répartition devient plus déséquilibrée. Et ce n'est pas un détail d'écriture : deux isomères n'ont pas les mêmes pressions ni les mêmes températures. Ce sont deux fluides différents. En atelier, retenez une seule chose : la lettre fait partie du nom. Un R cent trente-quatre n'est pas un R cent trente-quatre a.",
          codes: ["1.06"]
        }
      ]
    },

    "melanges": {
      question: "Les séries 400 et 500 : pourquoi la règle ne marche pas ?",
      ecrans: [
        {
          id: "d-melange-1",
          verifier: [
            "**Le R-404A contient trois fluides.** À confirmer, ainsi que l'idée que la majuscule finale désigne une variante de proportions.",
          ],
          titre: "Parce qu'il n'y a pas une molécule, mais plusieurs.",
          texte: [
            "Dans une bouteille de R-404A, il y a **trois** fluides différents mélangés.",
            "Le numéro 404 ne décrit donc aucune molécule : c'est un **numéro d'ordre**, attribué au fur et à mesure des mélanges déposés.",
            "La **majuscule finale** (le A de R-404A) désigne la version : mêmes composants, proportions différentes."
          ],
          lu: "La réponse est simple : dans la bouteille, il n'y a pas une molécule, il y en a plusieurs. Une bouteille de R quatre cent quatre A contient trois fluides différents mélangés ensemble. Le numéro quatre cent quatre ne décrit donc aucune molécule : c'est un numéro d'ordre, attribué au fur et à mesure des mélanges déposés. Quant à la majuscule à la fin, elle désigne la version : mêmes composants, mais proportions différentes.",
          codes: ["1.06"]
        },
        {
          id: "d-melange-2",
          titre: "400 et 500 ne se comportent pas pareil.",
          texte: [
            "**Série 500** — mélange **[[azéotrope|le mélange se comporte comme un fluide unique : il change d'état à température constante]]**. Il bout et il se condense à une seule température, comme un corps pur.",
            "**Série 400** — mélange **[[zéotrope|chaque composant change d'état à sa propre température : la température varie pendant le changement d'état]]**. Il commence à bouillir à une température et finit à une autre.",
            "Cet écart porte un nom : le **glissement**. Et il se voit sur le manomètre."
          ],
          lu: "Et les deux séries ne se comportent pas du tout pareil. La série cinq cents, ce sont les mélanges azéotropes : ils se comportent comme un fluide unique, ils bouillent et se condensent à une seule température, exactement comme un corps pur. La série quatre cents, ce sont les mélanges zéotropes : chaque composant change d'état à sa propre température. Le mélange commence donc à bouillir à une température, et il finit à une autre. Cet écart porte un nom : le glissement. Et il se voit sur le manomètre.",
          plus: ["glissement"],
          codes: ["1.06"]
        }
      ]
    },

    "glissement": {
      question: "Le glissement : qu'est-ce que ça change pour moi, sur le chantier ?",
      ecrans: [
        {
          id: "d-glide-1",
          verifier: [
            "🔴 **POINT CENTRAL — surchauffe lue sur la ROSÉE, sous-refroidissement sur la BULLE.** C'est l'affirmation la plus lourde de conséquence de toute la capsule.",
          ],
          titre: "La température n'est plus un point. C'est une plage.",
          texte: [
            "Avec un corps pur, une pression donne **une** température. Avec un zéotrope, elle en donne **deux** : au début et à la fin du changement d'état.",
            "C'est pourquoi les tables de ces fluides affichent **deux colonnes** : bulle et rosée.",
            "**Conséquence directe** : pour une surchauffe, on lit la température de **rosée**. Pour un sous-refroidissement, celle de **bulle**. Se tromper de colonne, c'est régler le détendeur de travers."
          ],
          lu: "Voilà ce que ça change concrètement. Avec un corps pur, une pression vous donne une température, une seule. Avec un mélange zéotrope, la même pression vous en donne deux : celle du début du changement d'état, et celle de la fin. C'est pour cela que les tables de ces fluides affichent deux colonnes : bulle et rosée. Et la conséquence est directe. Pour calculer une surchauffe, vous lisez la température de rosée. Pour un sous-refroidissement, celle de bulle. Vous trompez de colonne, vous réglez le détendeur de travers.",
          codes: ["1.06"]
        },
        {
          id: "d-glide-2",
          verifier: [
            "🔴 **« Un mélange zéotrope se charge en phase liquide »** — donné ici comme règle absolue.",
            "**« Même après une fuite, on ne complète pas : on récupère et on recharge. »** Est-ce la règle que vous appliquez, ou tolérez-vous l'appoint dans certains cas ?",
          ],
          titre: "Et surtout : on charge en phase liquide.",
          texte: [
            "Si vous chargez un zéotrope **en phase vapeur**, vous ne prenez pas le mélange : vous prenez surtout le composant le plus volatil.",
            "La bouteille change de composition, la machine reçoit autre chose que ce qui est écrit dessus. Ce défaut porte un nom : le **[[fractionnement|le mélange se sépare : ce qui sort de la bouteille n'a plus les proportions d'origine]]**.",
            "**La règle qui en découle est absolue : un mélange zéotrope se charge en phase liquide.** Même après une fuite : on ne complète pas, on récupère et on recharge."
          ],
          lu: "Et il y a plus grave. Si vous chargez un mélange zéotrope en phase vapeur, vous ne prenez pas le mélange : vous prenez surtout le composant le plus volatil, celui qui s'évapore le plus facilement. La bouteille change alors de composition, et la machine reçoit autre chose que ce qui est écrit sur l'étiquette. Ce défaut porte un nom : le fractionnement. D'où une règle absolue, et c'est celle qui tombe à l'examen : un mélange zéotrope se charge en phase liquide. Et même après une fuite, on ne complète pas : on récupère, et on recharge.",
          codes: ["1.06"]
        }
      ]
    },

    "familles": {
      question: "CFC, HCFC, HFC, HFO : comment je les situe ?",
      ecrans: [
        {
          id: "d-familles-1",
          verifier: [
            "Les quatre familles et leur statut réglementaire (**HCFC interdits, HFC en réduction programmée**). Formulation à valider.",
          ],
          titre: "Quatre familles, et une histoire d'interdictions.",
          planche: "../fonds-origine/packs/fluides/res/svg/familles-fluides.svg",
          texte: [
            "**CFC** — chlore, fluor, pas d'hydrogène. Détruisent l'ozone. **Interdits.**",
            "**HCFC** — on ajoute de l'hydrogène, il reste du chlore. Moins nocifs, mais nocifs. **Interdits** (le R-22 en était).",
            "**HFC** — plus de chlore du tout. L'ozone est sauve, mais l'effet de serre est fort. **En réduction programmée.**",
            "**HFO** — les derniers arrivés, effet de serre très faible. Souvent **inflammables** : c'est le nouveau sujet de sécurité."
          ],
          lu: "Quatre familles, et une histoire faite d'interdictions successives. Les C F C : chlore et fluor, pas d'hydrogène. Ils détruisent l'ozone, ils sont interdits. Les H C F C : on ajoute de l'hydrogène, mais il reste du chlore. Moins nocifs, mais nocifs quand même, et interdits eux aussi : le R vingt-deux en faisait partie. Les H F C : plus de chlore du tout, l'ozone est sauve, mais leur effet de serre est fort, et leurs quantités sont désormais réduites d'année en année. Enfin les H F O, les derniers arrivés : effet de serre très faible, mais souvent inflammables. C'est le nouveau sujet de sécurité.",
          codes: ["1.07"]
        }
      ]
    }
  }
});
