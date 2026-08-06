(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const lessons = [
    {
      short: "Pourquoi ?",
      theme: "decouverte",
      kicker: "Étape 1 · Partir du métier",
      title: "R‑22, R‑134a… ces chiffres ne sont pas choisis au hasard.",
      text: "Sur une bouteille, une machine ou une fiche d’intervention, vous rencontrez un code commençant par R. Cette désignation permet d’identifier le fluide. Pour certains fluides purs, les chiffres donnent aussi des renseignements sur les atomes qui composent la molécule.",
      speak: "Regardez ces trois codes : R vingt-deux, R cent-trente-quatre a et R quatre-cent-quatre A. Vous les rencontrerez sur les bouteilles, les machines et les fiches d'intervention. Le R signifie réfrigérant. Ce qui nous intéresse aujourd'hui, ce sont les chiffres. Pour certains fluides purs, ils permettent de retrouver le nombre d'atomes de carbone, d'hydrogène et de fluor. Le chlore, lui, se calcule ensuite. Nous allons commencer par le R vingt-deux, tranquillement, sans lettres compliquées.",
      render() {
        return `<div class="comparison-grid">
          <article class="family-card" style="--card-color:#3d7fca"><b>R‑22</b><strong>Un code très court</strong><p>Nous allons le compléter pour comprendre sa construction.</p><em>Exemple guidé</em></article>
          <article class="family-card" style="--card-color:#ff6b35"><b>R‑134a</b><strong>Trois chiffres</strong><p>Nous l’utiliserons ensuite pour vérifier la méthode.</p><em>Deuxième exemple</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>R‑404A</b><strong>Attention : mélange</strong><p>La même règle ne fonctionne pas pour tous les codes.</p><em>Cas particulier</em></article>
        </div><p class="note"><strong>Objectif :</strong> regarder un code et retrouver combien la molécule possède d’atomes C, H, F et Cl.</p>`;
      }
    },
    {
      short: "Les boules",
      theme: "decouverte",
      kicker: "Étape 2 · Comprendre les mots",
      title: "Un atome est une boule. Une molécule est un assemblage de boules.",
      text: "Nous n’avons besoin que de quatre sortes de boules. Chaque sorte possède un nom, une couleur et un symbole. C signifie carbone, H hydrogène, F fluor et Cl chlore. Quand ces boules s’accrochent ensemble, l’ensemble obtenu s’appelle une molécule.",
      speak: "Avant de toucher aux chiffres, oublions la chimie compliquée. Imaginez simplement quatre sortes de boules. La boule noire porte la lettre C : c'est le carbone. La boule bleu clair porte H : c'est l'hydrogène. La boule bleue porte F : c'est le fluor. La boule verte porte C L : c'est le chlore. Une boule seule s'appelle un atome. Plusieurs boules accrochées ensemble forment un assemblage que l'on appelle une molécule. Pour la suite, vous n'avez besoin de rien savoir de plus.",
      render() {
        return `<div class="atom-intro-grid">
          <div class="atom-intro-card"><span class="intro-atom mol-c">C</span><strong>Carbone</strong><small>la boule centrale</small></div>
          <div class="atom-intro-card"><span class="intro-atom mol-h">H</span><strong>Hydrogène</strong><small>une petite boule</small></div>
          <div class="atom-intro-card"><span class="intro-atom mol-f">F</span><strong>Fluor</strong><small>une petite boule</small></div>
          <div class="atom-intro-card"><span class="intro-atom mol-cl">Cl</span><strong>Chlore</strong><small>une petite boule</small></div>
        </div><p class="note"><strong>Deux mots seulement :</strong> une boule = un atome ; plusieurs boules accrochées = une molécule.</p>`;
      }
    },
    {
      short: "Les prises",
      theme: "decouverte",
      kicker: "Étape 3 · Comprendre l’assemblage",
      title: "Le carbone possède quatre prises. Les autres boules n’en occupent qu’une.",
      text: "Pour construire notre modèle, la boule C dispose de quatre points d’accrochage. Une boule H, F ou Cl se branche sur un seul point. Nous allons simplement remplir les quatre prises du carbone, comme les quatre places d’une multiprise.",
      speak: "Maintenant, regardez comment les boules s'assemblent. La boule carbone possède quatre prises autour d'elle. Ce n'est pas un calcul : c'est sa règle de construction. Une boule hydrogène, fluor ou chlore se branche sur une seule prise. Imaginez donc une multiprise de quatre places. Pour fabriquer la molécule, nous allons remplir ces quatre places, une par une. Quand toutes les prises sont occupées, l'assemblage est terminé.",
      render() {
        return `<div class="socket-grid">
          <div class="socket-card carbon-sockets"><strong>Carbone C</strong><div class="socket-atom mol-c">C<i class="socket top"></i><i class="socket right"></i><i class="socket bottom"></i><i class="socket left"></i></div><span>4 prises à remplir</span></div>
          <div class="socket-card single-socket"><strong>Hydrogène H</strong><div class="socket-atom mol-h">H<i class="socket right"></i></div><span>occupe 1 prise</span></div>
          <div class="socket-card single-socket"><strong>Fluor F</strong><div class="socket-atom mol-f">F<i class="socket right"></i></div><span>occupe 1 prise</span></div>
          <div class="socket-card single-socket"><strong>Chlore Cl</strong><div class="socket-atom mol-cl">Cl<i class="socket right"></i></div><span>occupe 1 prise</span></div>
        </div><p class="note"><strong>Notre seul travail :</strong> trouver combien de boules de chaque couleur viennent remplir les prises.</p>`;
      }
    },
    {
      short: "R‑022",
      theme: "composition",
      kicker: "Étape 2 · Mettre le code en trois cases",
      title: "R‑22, c’est comme si l’on avait écrit R‑022.",
      text: "Pour appliquer la méthode, nous avons besoin de trois emplacements. Lorsque le code ne comporte que deux chiffres, nous ajoutons simplement un zéro devant. Nous ne changeons pas le fluide : R‑22 et R‑022 représentent ici le même code mis en forme pour apprendre à le lire.",
      speak: "Première chose à comprendre. Le R vingt-deux ne montre que deux chiffres. Pour travailler, nous allons faire comme si le code était écrit R zéro vingt-deux, donc R zéro, deux, deux. Le zéro manquant est placé devant. Il ne change pas le fluide. Il nous permet simplement d'avoir trois cases bien visibles : première case zéro, deuxième case deux, troisième case deux.",
      render() {
        return `<div class="code-board"><div class="code-line">
          <span class="token">R‑</span><span class="token focus">0<small>case ajoutée</small></span><span class="token">2<small>deuxième case</small></span><span class="token">2<small>troisième case</small></span>
        </div><div class="decode-detail">
          <div><strong>Code vu</strong><span>R‑22</span></div>
          <div><strong>Code complété</strong><span>R‑022</span></div>
          <div><strong>Trois cases</strong><span>0 · 2 · 2</span></div>
        </div><p class="note"><strong>Astuce :</strong> pour un code à deux chiffres, placez toujours un zéro devant avant de commencer.</p></div>`;
      }
    },
    {
      short: "+1 / −1",
      theme: "composition",
      kicker: "Étape 3 · Lire les trois cases",
      title: "Le code ne donne pas directement les quantités : il faut utiliser la règle ASHRAE.",
      text: "Les chiffres ne sont pas l’inventaire direct des boules. Par convention, ASHRAE écrit un chiffre trop petit dans la première case, un chiffre trop grand dans la deuxième et la quantité exacte dans la troisième. C’est une règle de lecture à apprendre, pas une opération chimique à comprendre.",
      speak: "Attention : zéro, deux, deux ne veut pas dire zéro carbone, deux hydrogènes et deux fluors. ASHRAE a choisi un code décalé. C'est une convention, comme un indicatif téléphonique. Dans la première case, le chiffre écrit est toujours un de moins que le vrai nombre de carbones. Je dois donc ajouter un. Dans la deuxième case, le chiffre écrit est toujours un de plus que le vrai nombre d'hydrogènes. Je dois donc retirer un. La troisième case donne directement le fluor. Ne cherchez pas une raison chimique : c'est simplement la règle choisie pour lire le code.",
      render() {
        return `<div class="code-board"><div class="code-line">
          <span class="token focus">0<small>+ 1</small></span><span class="token">2<small>− 1</small></span><span class="token">2<small>inchangé</small></span>
        </div><div class="formula-grid">
          <div class="formula-piece"><b>0 + 1 = 1 C</b><span>un atome de carbone</span></div>
          <div class="formula-piece"><b>2 − 1 = 1 H</b><span>un atome d’hydrogène</span></div>
          <div class="formula-piece"><b>2 = 2 F</b><span>deux atomes de fluor</span></div>
        </div><p class="note"><strong>Phrase-mémoire :</strong> « À gauche, j’ajoute un ; au milieu, j’enlève un ; à droite, je garde le chiffre. »</p></div>`;
      }
    },
    {
      short: "Le chlore",
      theme: "composition",
      kicker: "Étape 4 · Trouver l’atome manquant",
      title: "Le chlore n’est pas écrit : il vient remplir la prise restée vide.",
      text: "Le calcul précédent nous donne une boule C, une boule H et deux boules F. La boule C offre quatre prises. H en occupe une et les deux F en occupent deux autres : trois prises sont remplies. La quatrième reçoit une boule Cl.",
      speak: "Nous allons maintenant construire réellement le R vingt-deux. Le code nous a donné une boule carbone, une boule hydrogène et deux boules fluor. La boule carbone possède quatre prises. J'accroche d'abord l'hydrogène sur la première prise. J'accroche un fluor sur la deuxième. Puis le deuxième fluor sur la troisième. Trois prises sont occupées. Il en reste une seule, vide. Cette dernière prise reçoit une boule chlore. Voilà pourquoi le R vingt-deux contient un chlore, même si aucun chiffre du code ne l'indique directement.",
      render() {
        return `<div class="code-board"><div class="molecule-stage mol-r22" aria-label="Construction animée de la molécule de R-22">
          <span class="mol-atom mol-c central" data-name="carbone">C</span>
          <span class="mol-bond bond-h"></span><span class="mol-atom mol-h atom-h" data-name="1er atome ajouté">H</span>
          <span class="mol-bond bond-f1"></span><span class="mol-atom mol-f atom-f1" data-name="2e atome ajouté">F</span>
          <span class="mol-bond bond-f2"></span><span class="mol-atom mol-f atom-f2" data-name="3e atome ajouté">F</span>
          <span class="mol-bond bond-cl"></span><span class="mol-atom mol-cl atom-cl" data-name="place restante">Cl</span>
          <strong class="mol-result">1 C + 1 H + 2 F + 1 Cl = CHClF₂</strong>
        </div><div class="formula-grid reveal-cascade">
          <div class="formula-piece"><b>4 places</b><span>autour d’un carbone</span></div>
          <div class="formula-piece"><b>3 occupées</b><span>1 H + 2 F</span></div>
          <div class="formula-piece"><b>1 place = 1 Cl</b><span>le chlore complète</span></div>
        </div><div class="decode-detail">
          <div><strong>1 C</strong><span>carbone</span></div><div><strong>1 H</strong><span>hydrogène</span></div><div><strong>2 F + 1 Cl</strong><span>fluor et chlore</span></div>
        </div><p class="note"><strong>Résultat :</strong> R‑22 = CHClF₂. Le chlore est bien présent, même si aucun chiffre du code ne le donne directement.</p></div>`;
      }
    },
    {
      short: "À vous",
      theme: "composition",
      kind: "moleculeLab",
      pauseForActivity: true,
      kicker: "Étape 7 · Atelier de construction",
      title: "À vous : accrochez les bonnes boules sur le carbone.",
      text: "Le code R‑022 vous donne une boule C, une boule H et deux boules F. Faites-les glisser sur les quatre prises. Plusieurs boules supplémentaires sont proposées : à vous de découvrir quelle boule doit remplir la dernière place.",
      speak: "Cette fois, c'est vous qui construisez la molécule. Le code R zéro vingt-deux vous impose une boule hydrogène et deux boules fluor autour du carbone. Faites glisser ces boules sur les prises. Ensuite, observez la place encore vide et choisissez, dans la réserve, la boule qui termine correctement l'assemblage. Le cours vous attendra ici jusqu'à ce que vous trouviez.",
      render() { return moleculeLabMarkup(); }
    },
    {
      short: "Les lettres",
      theme: "melange",
      kicker: "Étape 5 · Donner un nom aux cases",
      title: "Maintenant seulement, appelons les cases x, y et z.",
      text: "Les lettres ne sont pas une nouvelle difficulté : elles servent seulement à nommer les trois cases. x est la première case, y la deuxième et z la troisième. La méthode que nous venons d’utiliser devient alors une règle courte.",
      speak: "Vous savez déjà appliquer la méthode. Nous allons simplement donner un nom aux trois cases. La première s'appelle x. La deuxième s'appelle y. La troisième s'appelle z. N'ayez pas peur de ces lettres : elles remplacent seulement les chiffres que nous venons de manipuler. Pour le carbone, je prends x et j'ajoute un. Pour l'hydrogène, je prends y et je retire un. Pour le fluor, je garde z. Voilà toute la règle.",
      render() {
        return `<div class="code-board"><div class="code-line">
          <span class="token focus">x<small>première case</small></span><span class="token">y<small>deuxième case</small></span><span class="token">z<small>troisième case</small></span>
        </div><div class="formula-grid">
          <div class="formula-piece"><b>C = x + 1</b><span>carbone</span></div>
          <div class="formula-piece"><b>H = y − 1</b><span>hydrogène</span></div>
          <div class="formula-piece"><b>F = z</b><span>fluor</span></div>
        </div><p class="note"><strong>Pour le chlore :</strong> on compte les places disponibles, puis on retire celles déjà occupées par H et F.</p></div>`;
      }
    },
    {
      short: "2 carbones",
      theme: "melange",
      kicker: "Étape 8 · Passer à deux carbones",
      title: "Quand deux carbones s’accrochent, deux prises sont déjà utilisées.",
      text: "Un carbone seul possède quatre prises extérieures. Avec deux carbones, une prise de chaque carbone sert à les accrocher ensemble. Il reste donc trois prises sur le premier et trois sur le second : six places pour H, F ou Cl.",
      speak: "Avant de décoder le R cent-trente-quatre a, regardons ce qui change avec deux carbones. Chaque carbone possède quatre prises. Mais pour accrocher les deux carbones entre eux, chacun utilise déjà une prise. Sur le premier carbone, il reste trois prises libres. Sur le deuxième, il reste également trois prises libres. Trois plus trois donnent six places extérieures. C'est pour cela qu'un assemblage de deux carbones peut recevoir six petites boules autour de lui.",
      render() {
        return `<div class="chain-grid">
          <div class="chain-card"><strong>1 carbone</strong><div class="mini-chain"><span class="mini-carbon">C</span></div><b>4 places autour</b></div>
          <div class="chain-card active"><strong>2 carbones</strong><div class="mini-chain"><span class="mini-carbon">C</span><i></i><span class="mini-carbon">C</span></div><b>3 + 3 = 6 places</b></div>
          <div class="chain-card"><strong>3 carbones</strong><div class="mini-chain"><span class="mini-carbon">C</span><i></i><span class="mini-carbon">C</span><i></i><span class="mini-carbon">C</span></div><b>8 places autour</b></div>
        </div><p class="note"><strong>Pas besoin de formule :</strong> dessinez les carbones, accrochez-les entre eux, puis comptez les prises encore libres.</p>`;
      }
    },
    {
      short: "R‑134a",
      theme: "melange",
      kicker: "Étape 6 · Vérifier avec un deuxième fluide",
      title: "Appliquons exactement la même méthode au R‑134a.",
      text: "Le code comporte déjà trois cases : 1, 3 et 4. La règle donne deux boules C, deux boules H et quatre boules F. Les deux carbones laissent six prises autour d’eux. Les deux H et les quatre F remplissent exactement les six prises : aucune ne reste disponible pour Cl.",
      speak: "Essayons maintenant avec le R cent-trente-quatre a. Trois cases sont déjà visibles : un, trois, quatre. Première case, j'ajoute un : cela donne deux boules carbone. Deuxième case, je retire un : cela donne deux boules hydrogène. Troisième case, je garde le chiffre : quatre boules fluor. Nous savons que deux carbones accrochés laissent six prises autour d'eux. Deux hydrogènes plus quatre fluors donnent exactement six petites boules. Elles remplissent toutes les prises. Il n'en reste aucune pour le chlore. Regardez l'assemblage se construire : sur le premier carbone, deux H et un F ; sur le second, trois F.",
      render() {
        return `<div class="code-board"><div class="code-line">
          <span class="token focus">1<small>+ 1 = 2 C</small></span><span class="token">3<small>− 1 = 2 H</small></span><span class="token">4<small>= 4 F</small></span><span class="token">a<small>isomère</small></span>
        </div><div class="molecule-stage mol-r134a" aria-label="Construction animée simplifiée de la molécule de R-134a">
          <span class="mol-atom mol-c carbon-left" data-name="carbone 1">C</span><span class="mol-bond bond-cc"></span><span class="mol-atom mol-c carbon-right" data-name="carbone 2">C</span>
          <span class="mol-bond bond-a1"></span><span class="mol-atom mol-h atom-a1" data-name="hydrogène">H</span>
          <span class="mol-bond bond-a2"></span><span class="mol-atom mol-h atom-a2" data-name="hydrogène">H</span>
          <span class="mol-bond bond-a3"></span><span class="mol-atom mol-f atom-a3" data-name="fluor">F</span>
          <span class="mol-bond bond-b1"></span><span class="mol-atom mol-f atom-b1" data-name="fluor">F</span>
          <span class="mol-bond bond-b2"></span><span class="mol-atom mol-f atom-b2" data-name="fluor">F</span>
          <span class="mol-bond bond-b3"></span><span class="mol-atom mol-f atom-b3" data-name="fluor">F</span>
          <strong class="mol-result">2 C + 2 H + 4 F = C₂H₂F₄ · aucun chlore</strong>
        </div><div class="formula-grid reveal-cascade">
          <div class="formula-piece"><b>2 C</b><span>deux carbones</span></div><div class="formula-piece"><b>2 H</b><span>deux hydrogènes</span></div><div class="formula-piece"><b>4 F · 0 Cl</b><span>aucun chlore</span></div>
        </div><p class="note"><strong>Résultat :</strong> R‑134a = C₂H₂F₄. La lettre « a » précise l’isomère ; elle ne se calcule pas.</p></div>`;
      }
    },
    {
      short: "Les séries",
      theme: "naturel",
      kicker: "Étape 7 · Ranger les numéros",
      title: "Chaque tranche de numéros possède sa propre règle.",
      text: "Il ne faut pas appliquer « +1, −1, rien » à tous les codes. Les tranches 0xx, 1xx et 2xx décrivent des molécules saturées à un, deux ou trois carbones. Un composé cyclique porte un C devant son numéro, par exemple R‑C318 : le C est indispensable. Les tranches 400 à 700 et 1000+ ont d’autres significations.",
      speak: "Mettons maintenant les séries dans le bon ordre. De zéro à quatre-vingt-dix-neuf, nous sommes dans la famille du méthane : un carbone. De cent à cent-quatre-vingt-dix-neuf, famille de l'éthane : deux carbones. De deux-cents à deux-cent-quatre-vingt-dix-neuf, famille du propane : trois carbones. Pour un composé cyclique, ASHRAE ajoute une lettre C devant le numéro, par exemple R C trois-cent-dix-huit. Ce n'est donc pas une série trois-cents à mémoriser seule : c'est le C placé devant qui signale le cycle. Ensuite, quatre-cents signifie mélange zéotropique. Cinq-cents signifie mélange azéotropique. Six-cents signifie composés organiques divers. Sept-cents signifie composés inorganiques. Enfin, mille et plus concerne les composés organiques insaturés. Le point important : six-cents et sept-cents contiennent plusieurs fluides naturels connus, mais ces numéros ne veulent pas dire naturel.",
      render() { return seriesMapMarkup(); }
    },
    {
      short: "a ou A ?",
      theme: "melange",
      kicker: "Étape 8 · Lire la lettre finale",
      title: "Une petite lettre et une grande lettre ne racontent pas la même chose.",
      text: "Après un fluide pur, une lettre minuscule comme a, b ou c distingue des isomères : les mêmes nombres d’atomes sont rangés autrement. Après un mélange des séries 400 ou 500, une lettre majuscule A, B ou C distingue des compositions différentes.",
      speak: "Regardons maintenant la lettre placée à la fin. Sa taille est importante. Dans R cent-trente-quatre a, le petit a est une minuscule. Il indique un isomère : le nombre d'atomes ne change pas, mais ils sont rangés autrement. Dans R quatre-cent-sept A, B ou C, la lettre est une majuscule. Elle distingue plusieurs mélanges fabriqués avec les mêmes composants, mais dans des proportions différentes. Retenez : petite lettre, organisation des atomes. Grande lettre, composition du mélange.",
      render() {
        return `<div class="comparison-grid">
          <article class="family-card" style="--card-color:#3d7fca"><b>R‑134a</b><strong>« a » minuscule</strong><p>Même formule brute que l’isomère voisin, mais atomes disposés autrement.</p><em>Isomère</em></article>
          <article class="family-card" style="--card-color:#ff6b35"><b>R‑407A / B / C</b><strong>Majuscules</strong><p>Mêmes composants de base, mais proportions différentes.</p><em>Versions du mélange</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>R‑600a</b><strong>« a » minuscule</strong><p>Isobutane, différent arrangement du butane R‑600.</p><em>Hydrocarbure</em></article>
        </div><p class="note"><strong>Attention :</strong> le A final de R‑404A appartient au nom du mélange. Ce n’est pas la classe de sécurité A1 ou A2L.</p>`;
      }
    },
    {
      short: "Isomères",
      theme: "melange",
      kind: "isomerDemo",
      kicker: "Étape 9 · Voir la minuscule",
      title: "R‑134 et R‑134a : le même stock d’atomes, rangé autrement.",
      text: "Les deux molécules possèdent exactement 2 carbones, 2 hydrogènes et 4 fluors. Dans R‑134, chaque carbone porte un H et deux F. Dans R‑134a, un carbone porte deux H et un F, l’autre porte trois F. Appuyez sur le bouton pour voir un H et un F échanger leur place.",
      speak: "Voici ce que signifie vraiment la petite lettre a. À gauche, nous avons toujours le même stock : deux carbones, deux hydrogènes et quatre fluors. Dans R cent-trente-quatre sans lettre, chaque carbone reçoit un hydrogène et deux fluors. Regardez maintenant un hydrogène et un fluor échanger leur place. Nous obtenons R cent-trente-quatre a : un carbone porte deux hydrogènes et un fluor, l'autre porte trois fluors. Aucun atome n'a été ajouté ou retiré. Seul le rangement change. C'est cela, un isomère.",
      render() { return isomerDemoMarkup(); }
    },
    {
      short: "R‑407 A/B/C",
      theme: "melange",
      kicker: "Étape 10 · Voir la majuscule",
      title: "Trois bouteilles, les mêmes gaz… mais pas les mêmes proportions.",
      text: "R‑407A, R‑407B et R‑407C sont tous fabriqués avec R‑32, R‑125 et R‑134a. La lettre majuscule indique la recette exacte. Les bouteilles ci-dessous se remplissent selon les pourcentages massiques réels.",
      speak: "Passons à la grande lettre. Les R quatre-cent-sept A, B et C utilisent exactement les trois mêmes composants : R trente-deux, R cent-vingt-cinq et R cent-trente-quatre a. Mais leur recette change. R quatre-cent-sept A contient vingt pour cent de R trente-deux, quarante pour cent de R cent-vingt-cinq et quarante pour cent de R cent-trente-quatre a. R quatre-cent-sept B contient dix, soixante-dix et vingt pour cent. R quatre-cent-sept C contient vingt-trois, vingt-cinq et cinquante-deux pour cent. La majuscule ne déplace pas des atomes dans une molécule : elle change la quantité de chaque fluide versée dans la bouteille.",
      render() { return blendBottlesMarkup(); }
    },
    {
      short: "400 / 500",
      theme: "melange",
      kicker: "Étape 9 · Comprendre les mélanges",
      title: "Série 400 : zéotrope. Série 500 : azéotrope.",
      text: "Un mélange zéotropique ne change pas d’état à une seule température : à pression constante, il existe une température de bulle et une température de rosée. Leur écart est le glissement de température. Un mélange azéotropique se comporte presque comme un fluide pur et présente très peu, voire pas, de glissement.",
      speak: "Les mélanges sont rangés dans deux grandes séries. La série quatre-cents correspond aux mélanges zéotropiques. Leurs composants ne s'évaporent pas exactement à la même température. Entre le début et la fin du changement d'état, la température glisse. On parle de température de bulle, de température de rosée et de glissement. La série cinq-cents correspond aux mélanges azéotropiques. Leurs composants changent d'état ensemble, presque comme un fluide pur. Le glissement est nul ou très faible.",
      render() {
        return `<div class="comparison-grid">
          <article class="family-card" style="--card-color:#ff6b35"><b>Série 400</b><strong>Zéotropique</strong><p>Température de bulle différente de la température de rosée.</p><em>Glissement</em></article>
          <article class="family-card" style="--card-color:#3d7fca"><b>R‑407C</b><strong>Exemple zéotrope</strong><p>Le changement d’état se fait sur une plage de températures.</p><em>Bulle → rosée</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>Série 500</b><strong>Azéotropique</strong><p>Comportement proche d’un corps pur, sans glissement significatif.</p><em>Exemple : R‑507A</em></article>
        </div><p class="note"><strong>Image simple :</strong> un zéotrope emprunte une rampe de température ; un azéotrope reste presque sur un palier.</p>`;
      }
    },
    {
      short: "Glissement",
      theme: "melange",
      kicker: "Étape 10 · Relier la série au geste professionnel",
      title: "Le glissement et le fractionnement changent votre manière d’intervenir.",
      text: "Dans un mélange zéotropique, les composants n’ont pas tous la même volatilité. Une fuite, surtout en phase vapeur, peut donc modifier les proportions du mélange : c’est le fractionnement. Pour préserver sa composition, on prélève et on charge généralement le fluide de la série 400 en phase liquide.",
      speak: "Pourquoi faut-il connaître tout cela sur le terrain ? Dans un zéotrope, certains composants partent plus facilement que d'autres. Lors d'une fuite, la composition restante peut changer. C'est le fractionnement. Pour introduire le mélange dans l'installation sans séparer ses composants, on prélève donc le fluide en phase liquide. Et pour calculer une surchauffe ou un sous-refroidissement, on doit distinguer la température de rosée de la température de bulle.",
      render() {
        return `<div class="formula-grid">
          <div class="formula-piece"><b>Fuite vapeur</b><span>composition susceptible d’évoluer</span></div>
          <div class="formula-piece"><b>Charge liquide</b><span>préserver les bonnes proportions</span></div>
          <div class="formula-piece"><b>Bulle / rosée</b><span>choisir la bonne température</span></div>
        </div><div class="decode-detail">
          <div><strong>Surchauffe</strong><span>référence rosée</span></div><div><strong>Sous-refroidissement</strong><span>référence bulle</span></div><div><strong>Glissement</strong><span>rosée − bulle</span></div>
        </div><p class="note"><strong>À retenir :</strong> « série 400 » doit déclencher trois réflexes : glissement, risque de fractionnement et charge en liquide.</p>`;
      }
    },
    {
      short: "Naturels",
      theme: "naturel",
      kicker: "Étape 11 · Ranger les fluides naturels",
      title: "600 et 700 contiennent des naturels… sans être « les séries naturelles ».",
      text: "La série 600 rassemble des composés organiques divers et la série 700 des composés inorganiques. Beaucoup de naturels très connus s’y trouvent, mais d’autres sont codés dans les séries 0xx, 1xx, 2xx ou 1000+. « Naturel » ne correspond donc pas à une tranche unique.",
      speak: "Revenons précisément sur les naturels. Votre souvenir des six-cents et sept-cents vient d'une réalité : beaucoup de naturels connus sont dans ces tranches. R six-cents et R six-cents a sont le butane et l'isobutane. R sept-cent-dix-sept est l'ammoniac. R sept-cent-dix-huit est l'eau. R sept-cent-quarante-quatre est le CO deux. Mais le sens officiel des tranches est différent : six-cents signifie composés organiques divers ; sept-cents signifie composés inorganiques. Et des naturels se trouvent ailleurs : R cinquante pour le méthane, R cent-soixante-dix pour l'éthane, R deux-cent-quatre-vingt-dix pour le propane, ou R douze-cent-soixante-dix pour le propylène. Conclusion : naturel est une famille d'usage, pas une série de numéros.",
      render() {
        return `<div class="comparison-grid">
          <article class="family-card" style="--card-color:#4fb887"><b>R‑50 · R‑170</b><strong>Méthane · éthane</strong><p>Naturels dans les séries 0xx et 1xx.</p><em>A3</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>R‑290</b><strong>Propane</strong><p>Naturel dans la série 2xx.</p><em>A3</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>R‑600 · R‑600a</b><strong>Butane · isobutane</strong><p>Naturels parmi les organiques divers de la série 600.</p><em>A3</em></article>
          <article class="family-card" style="--card-color:#3d7fca"><b>R‑717 · R‑718 · R‑744</b><strong>NH₃ · eau · CO₂</strong><p>Naturels parmi les inorganiques de la série 700.</p><em>Trois exemples connus</em></article>
          <article class="family-card" style="--card-color:#4fb887"><b>R‑1270</b><strong>Propylène</strong><p>Naturel dans la série 1000+ des organiques insaturés.</p><em>A3</em></article>
          <article class="family-card" style="--card-color:#ff6b35"><b>Conclusion</b><strong>Pas une seule tranche</strong><p>Le mot « naturel » ne se déduit jamais du premier chiffre seul.</p><em>Vérifier le fluide</em></article>
        </div><p class="note"><strong>Phrase-mémoire :</strong> « 600 = organiques divers ; 700 = inorganiques. Naturel peut se trouver dans plusieurs séries. »</p>`;
      }
    },
    {
      short: "Mini‑jeu",
      theme: "naturel",
      kicker: "Étape 12 · À vous de jouer",
      title: "Décoder le code, la lettre et la série.",
      text: "Douze questions permettent maintenant de vérifier l’ensemble : l’assemblage des atomes, la lecture des chiffres, les lettres finales, la composition du R‑407C, les séries 400 à 700 et les fluides naturels. Le cours automatique s’arrête ici.",
      speak: "Nous arrivons au mini-jeu. Vous devrez décoder les atomes, distinguer petite et grande lettre, reconnaître les séries, retrouver la recette du R quatre-cent-sept C et ranger correctement les fluides naturels. Le défilement automatique s'arrête ici. À vous de jouer.",
      render() { return quizMarkup(); }
    }
  ];

  const questions = [
    { q:"Dans notre modèle, qu’est-ce qu’une molécule ?", a:["Une seule boule","Plusieurs boules-atome accrochées ensemble","Un numéro ASHRAE","Une bouteille de fluide"], correct:1, why:"Une boule représente un atome ; plusieurs boules accrochées forment une molécule." },
    { q:"Combien de prises possède la boule carbone C ?", a:["1","2","3","4"], correct:3, why:"Dans notre modèle, le carbone possède quatre points d’accrochage." },
    { q:"Pour commencer le R‑22, comment faut-il l’écrire dans les trois cases ?", a:["R‑220","R‑022","R‑202","R‑222"], correct:1, why:"Exact : on place un zéro devant. R‑22 se travaille comme R‑022." },
    { q:"Avec R‑032, combien trouve-t-on d’atomes d’hydrogène ?", a:["0","1","2","3"], correct:2, why:"Deuxième case : 3 − 1 = 2 hydrogènes." },
    { q:"R‑011 possède 1 carbone, 0 hydrogène et 1 fluor. Combien reste-t-il de chlores ?", a:["1","2","3","4"], correct:2, why:"Un carbone offre 4 places. Une est prise par F ; il en reste 3 pour le chlore : CCl₃F." },
    { q:"Que signifie le petit « a » dans R‑134a ?", a:["Un atome supplémentaire","Un isomère","Un mélange azéotrope","La classe A1"], correct:1, why:"La minuscule distingue un isomère : même formule brute, organisation différente des atomes." },
    { q:"Que signifie la majuscule dans R‑407A, R‑407B ou R‑407C ?", a:["Le nombre de carbones","La classe de toxicité","Une composition différente du mélange","La présence d’ammoniac"], correct:2, why:"Les majuscules distinguent des mélanges de mêmes composants dans des proportions différentes." },
    { q:"Quelle association est correcte ?", a:["400 = azéotrope ; 500 = zéotrope","400 = zéotrope ; 500 = azéotrope","400 = naturel ; 500 = HFC pur","400 = liquide ; 500 = vapeur"], correct:1, why:"Série 400 : mélanges zéotropiques. Série 500 : mélanges azéotropiques." },
    { q:"Quel trio de réflexes correspond à un zéotrope de série 400 ?", a:["Glissement, fractionnement, charge liquide","Vide, azote, charge vapeur","Aucun glissement, aucune précaution","Fluide pur, formule unique, charge vapeur"], correct:0, why:"Exact : glissement de température, risque de fractionnement et prélèvement en phase liquide." },
    { q:"Lequel est un fluide naturel ?", a:["R‑404A uniquement","R‑407C uniquement","R‑744, le CO₂","Tous les fluides de la série 400"], correct:2, why:"R‑744 est le CO₂. Les fluides naturels ne forment pas une série unique." },
    { q:"Quelle phrase décrit correctement les séries 600 et 700 ?", a:["600 = naturels ; 700 = synthétiques","600 = organiques divers ; 700 = inorganiques","600 = zéotropes ; 700 = azéotropes","600 = liquides ; 700 = vapeurs"], correct:1, why:"600 rassemble des organiques divers et 700 des inorganiques. Plusieurs naturels s’y trouvent, mais le numéro ne signifie pas « naturel »." },
    { q:"Quelle est la recette massique du R‑407C ?", a:["R‑32 23 % · R‑125 25 % · R‑134a 52 %","R‑32 20 % · R‑125 40 % · R‑134a 40 %","R‑32 10 % · R‑125 70 % · R‑134a 20 %","R‑125 50 % · R‑143a 50 %"], correct:0, why:"R‑407C = 23 % de R‑32, 25 % de R‑125 et 52 % de R‑134a. Les trois variantes utilisent les mêmes composants dans d’autres proportions." }
  ];

  let current = 0;
  let soundEnabled = true;
  let autoplay = false;
  let speaking = false;
  let paused = false;
  let speechRun = 0;
  let selectedVoice = null;
  let audioContext = null;
  let masterGain = null;
  let quizIndex = 0;
  let score = 0;
  let answered = false;
  let labPlacements = [null, null, null, null];
  let selectedLabToken = null;
  let labCompleted = false;
  let isomerTimer = null;

  function cleanText(text) {
    return text.replace(/<[^>]*>/g, " ").replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
  }

  function meilleureVoixFrancaise() {
    const voices = speechSynthesis.getVoices();
    const frFR = (voice) => voice.lang.toLowerCase() === "fr-fr";
    const fr = (voice) => voice.lang.toLowerCase().startsWith("fr");
    const quality = (voice) => /natural|google|online|neural/i.test(voice.name);
    return voices.find((voice) => frFR(voice) && quality(voice))
      || voices.find(frFR)
      || voices.find((voice) => fr(voice) && quality(voice))
      || voices.find(fr)
      || voices[0]
      || null;
  }

  function loadVoices() { selectedVoice = meilleureVoixFrancaise(); }
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function buildStepper() {
    $("#stepper").innerHTML = lessons.map((lesson, index) =>
      `<button data-step="${index}" type="button"><b>${String(index + 1).padStart(2, "0")}</b><span>${lesson.short}</span></button>`
    ).join("");
    document.querySelectorAll("#stepper button").forEach((button) => {
      button.addEventListener("click", () => goTo(+button.dataset.step, autoplay));
    });
  }

  function seriesMapMarkup() {
    const series = [
      ["R‑0xx", "Méthane", "1 carbone", "R‑22 · R‑32 · R‑50"],
      ["R‑1xx", "Éthane", "2 carbones", "R‑125 · R‑134a · R‑170"],
      ["R‑2xx", "Propane", "3 carbones", "R‑245fa · R‑290"],
      ["R‑Cxxx", "Composés cycliques", "C placé devant", "exemple : R‑C318"],
      ["R‑4xx", "Mélanges zéotropiques", "glissement possible", "R‑404A · R‑407C"],
      ["R‑5xx", "Mélanges azéotropiques", "comportement proche d’un pur", "R‑507A"],
      ["R‑6xx", "Organiques divers", "pas « série naturelle »", "R‑600 · R‑600a"],
      ["R‑7xx", "Inorganiques", "pas « série naturelle »", "R‑717 · R‑718 · R‑744"],
      ["R‑1000+", "Organiques insaturés", "double liaison", "R‑1234yf · R‑1270"]
    ];
    return `<div class="series-roadmap" aria-label="Carte des séries de désignation des fluides">
      ${series.map((item, index) => `<article class="series-stop" style="--series-order:${index}">
        <b>${item[0]}</b><strong>${item[1]}</strong><span>${item[2]}</span><small>${item[3]}</small>
      </article>`).join("")}
    </div>
    <p class="note"><strong>Correction importante :</strong> les séries 600 et 700 accueillent plusieurs fluides naturels connus, mais « 600 » signifie <em>organique divers</em> et « 700 » signifie <em>inorganique</em>. Le propane naturel R‑290 et le propylène naturel R‑1270 prouvent qu’il n’existe pas une seule « série des naturels ».</p>`;
  }

  function isomerDemoMarkup() {
    return `<div class="isomer-demo" id="isomer-demo" data-state="r134">
      <div class="same-stock" aria-label="Même quantité d’atomes"><span>2 C</span><span>2 H</span><span>4 F</span><strong>même stock</strong></div>
      <div class="isomer-stage" role="img" aria-label="Deux carbones et six atomes périphériques ; un hydrogène et un fluor changent de place">
        <span class="iso-bond bond-center"></span>
        <span class="iso-bond bond-l1"></span><span class="iso-bond bond-l2"></span><span class="iso-bond bond-l3"></span>
        <span class="iso-bond bond-r1"></span><span class="iso-bond bond-r2"></span><span class="iso-bond bond-r3"></span>
        <span class="iso-atom iso-carbon carbon-one">C</span><span class="iso-atom iso-carbon carbon-two">C</span>
        <span class="iso-atom iso-h atom-l1">H</span>
        <span class="iso-atom iso-f swap-f">F</span>
        <span class="iso-atom iso-f atom-l3">F</span>
        <span class="iso-atom iso-f atom-r1">F</span>
        <span class="iso-atom iso-f atom-r2">F</span>
        <span class="iso-atom iso-h swap-h">H</span>
        <div class="isomer-name"><b id="isomer-code">R‑134</b><span id="isomer-formula">CHF₂ — CHF₂</span></div>
      </div>
      <div class="isomer-actions"><button class="nav-button" id="isomer-toggle" type="button">Réorganiser en R‑134a</button><p id="isomer-explain">Chaque carbone porte 1 H et 2 F.</p></div>
    </div>`;
  }

  function bindIsomerDemo() {
    const button = $("#isomer-toggle");
    if (!button) return;
    button.addEventListener("click", () => {
      const demo = $("#isomer-demo");
      setIsomerState(demo.dataset.state === "r134" ? "r134a" : "r134");
      chime(demo.dataset.state === "r134a" ? 523 : 392);
    });
    isomerTimer = setTimeout(() => {
      if ($("#isomer-demo")) setIsomerState("r134a");
    }, 4300);
  }

  function setIsomerState(state) {
    const demo = $("#isomer-demo");
    if (!demo) return;
    const isA = state === "r134a";
    demo.dataset.state = state;
    $("#isomer-code").textContent = isA ? "R‑134a" : "R‑134";
    $("#isomer-formula").textContent = isA ? "CH₂F — CF₃" : "CHF₂ — CHF₂";
    $("#isomer-toggle").textContent = isA ? "Revenir au R‑134" : "Réorganiser en R‑134a";
    $("#isomer-explain").textContent = isA
      ? "Le premier carbone porte 2 H et 1 F ; le second porte 3 F."
      : "Chaque carbone porte 1 H et 2 F.";
  }

  function blendBottlesMarkup() {
    const bottles = [
      { code:"R‑407A", parts:[["R‑32",20,"r32"],["R‑125",40,"r125"],["R‑134a",40,"r134a"]] },
      { code:"R‑407B", parts:[["R‑32",10,"r32"],["R‑125",70,"r125"],["R‑134a",20,"r134a"]] },
      { code:"R‑407C", parts:[["R‑32",23,"r32"],["R‑125",25,"r125"],["R‑134a",52,"r134a"]] }
    ];
    return `<div class="blend-demo">
      <div class="blend-legend" aria-label="Légende des composants"><span class="r32">R‑32</span><span class="r125">R‑125</span><span class="r134a">R‑134a</span></div>
      <div class="bottle-row" aria-label="Comparaison des compositions massiques de R-407A, R-407B et R-407C">
        ${bottles.map((bottle, bottleIndex) => `<article class="blend-bottle-card">
          <div class="bottle-neck"></div>
          <div class="blend-bottle">
            ${bottle.parts.map((part, partIndex) => `<div class="blend-layer ${part[2]}" style="--pct:${part[1]};--fill-order:${partIndex + bottleIndex}" aria-label="${part[0]} ${part[1]} pour cent"><span>${part[0]}</span><b>${part[1]} %</b></div>`).join("")}
          </div>
          <strong>${bottle.code}</strong>
        </article>`).join("")}
      </div>
      <p class="blend-equation"><span>mêmes 3 composants</span><i>+</i><span>pourcentages différents</span><i>=</i><strong>lettre majuscule différente</strong></p>
    </div>`;
  }

  function moleculeLabMarkup() {
    return `<div class="molecule-lab" id="molecule-lab">
      <div class="lab-code"><span>R‑022</span><b>1 C</b><i>+</i><b>1 H</b><i>+</i><b>2 F</b><i>+</i><strong>? Cl</strong></div>
      <div class="lab-layout">
        <div class="lab-board" id="lab-board" aria-label="Carbone et ses quatre prises">
          <svg class="lab-svg" viewBox="0 0 520 360" role="img" aria-label="Schéma interactif d’un carbone à quatre connecteurs">
            <defs><filter id="labGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <line class="lab-wire" data-line="0" x1="260" y1="180" x2="260" y2="57"/>
            <line class="lab-wire" data-line="1" x1="260" y1="180" x2="440" y2="180"/>
            <line class="lab-wire" data-line="2" x1="260" y1="180" x2="260" y2="303"/>
            <line class="lab-wire" data-line="3" x1="260" y1="180" x2="80" y2="180"/>
            <circle class="lab-carbon" cx="260" cy="180" r="49"/><text class="lab-carbon-text" x="260" y="192">C</text>
            <circle class="lab-socket-dot" cx="260" cy="57" r="11"/><circle class="lab-socket-dot" cx="440" cy="180" r="11"/><circle class="lab-socket-dot" cx="260" cy="303" r="11"/><circle class="lab-socket-dot" cx="80" cy="180" r="11"/>
          </svg>
          <button class="lab-slot slot-top" data-slot="0" type="button" aria-label="Prise du haut, vide">+</button>
          <button class="lab-slot slot-right" data-slot="1" type="button" aria-label="Prise de droite, vide">+</button>
          <button class="lab-slot slot-bottom" data-slot="2" type="button" aria-label="Prise du bas, vide">+</button>
          <button class="lab-slot slot-left" data-slot="3" type="button" aria-label="Prise de gauche, vide">+</button>
        </div>
        <aside class="lab-tray" aria-label="Réserve d’atomes"><p>Faites glisser une boule<br><small>ou cliquez sur une boule puis sur une prise</small></p>
          <div class="lab-token-grid">
            <button class="lab-token mol-h" data-token="h1" data-type="H" type="button">H</button>
            <button class="lab-token mol-h" data-token="h2" data-type="H" type="button">H</button>
            <button class="lab-token mol-f" data-token="f1" data-type="F" type="button">F</button>
            <button class="lab-token mol-f" data-token="f2" data-type="F" type="button">F</button>
            <button class="lab-token mol-f" data-token="f3" data-type="F" type="button">F</button>
            <button class="lab-token mol-cl" data-token="cl1" data-type="Cl" type="button">Cl</button>
            <button class="lab-token mol-cl" data-token="cl2" data-type="Cl" type="button">Cl</button>
          </div>
        </aside>
      </div>
      <p class="lab-feedback" id="lab-feedback" role="status">Commencez par placer 1 H et 2 F donnés par le code.</p>
      <div class="lab-actions"><button class="nav-button subtle" id="lab-reset" type="button">↻ Vider les prises</button><button class="nav-button" id="lab-check" type="button">Vérifier la molécule</button></div>
    </div>`;
  }

  function bindMoleculeLab() {
    labPlacements = [null, null, null, null];
    selectedLabToken = null;
    labCompleted = false;
    document.querySelectorAll(".lab-token").forEach((token) => {
      token.addEventListener("click", () => selectLabToken(token.dataset.token));
      token.addEventListener("pointerdown", startLabDrag);
    });
    document.querySelectorAll(".lab-slot").forEach((slot) => slot.addEventListener("click", () => handleLabSlot(+slot.dataset.slot)));
    $("#lab-reset").addEventListener("click", resetMoleculeLab);
    $("#lab-check").addEventListener("click", checkMoleculeLab);
  }

  function selectLabToken(tokenId) {
    const token = document.querySelector(`.lab-token[data-token="${tokenId}"]`);
    if (!token || token.disabled || labCompleted) return;
    selectedLabToken = tokenId;
    document.querySelectorAll(".lab-token").forEach((item) => item.classList.toggle("selected", item.dataset.token === tokenId));
    $("#lab-feedback").textContent = `Boule ${token.dataset.type} sélectionnée : choisissez une prise vide.`;
  }

  function startLabDrag(event) {
    const token = event.currentTarget;
    if (token.disabled || labCompleted || event.button > 0) return;
    event.preventDefault();
    const ghost = token.cloneNode(true);
    ghost.classList.add("lab-drag-ghost");
    ghost.removeAttribute("data-token");
    document.body.append(ghost);
    let moved = false;
    const moveGhost = (x, y) => { ghost.style.left = `${x}px`; ghost.style.top = `${y}px`; };
    moveGhost(event.clientX, event.clientY);
    token.setPointerCapture(event.pointerId);
    token.onpointermove = (move) => { moved = true; moveGhost(move.clientX, move.clientY); document.querySelectorAll(".lab-slot").forEach((slot) => slot.classList.toggle("drop-ready", pointInside(move.clientX, move.clientY, slot))); };
    token.onpointerup = (up) => {
      token.onpointermove = null; token.onpointerup = null; ghost.remove();
      document.querySelectorAll(".lab-slot").forEach((slot) => slot.classList.remove("drop-ready"));
      const target = [...document.querySelectorAll(".lab-slot")].find((slot) => pointInside(up.clientX, up.clientY, slot));
      if (target) placeLabToken(token.dataset.token, +target.dataset.slot);
      else if (!moved) selectLabToken(token.dataset.token);
    };
  }

  function pointInside(x, y, element) {
    const rect = element.getBoundingClientRect();
    const margin = 24;
    return x >= rect.left - margin && x <= rect.right + margin && y >= rect.top - margin && y <= rect.bottom + margin;
  }

  function handleLabSlot(slotIndex) {
    if (labCompleted) return;
    if (labPlacements[slotIndex]) { returnLabToken(slotIndex); return; }
    if (selectedLabToken) placeLabToken(selectedLabToken, slotIndex);
    else $("#lab-feedback").textContent = "Choisissez d’abord une boule dans la réserve.";
  }

  function placeLabToken(tokenId, slotIndex) {
    if (labPlacements[slotIndex] || labCompleted) return;
    const token = document.querySelector(`.lab-token[data-token="${tokenId}"]`);
    if (!token || token.disabled) return;
    labPlacements[slotIndex] = { tokenId, type:token.dataset.type };
    token.disabled = true;
    token.classList.remove("selected");
    selectedLabToken = null;
    const slot = document.querySelector(`.lab-slot[data-slot="${slotIndex}"]`);
    slot.textContent = token.dataset.type;
    slot.className = `lab-slot filled lab-${token.dataset.type.toLowerCase()} ${["slot-top","slot-right","slot-bottom","slot-left"][slotIndex]}`;
    slot.setAttribute("aria-label", `Prise occupée par ${token.dataset.type}. Cliquez pour retirer.`);
    document.querySelector(`.lab-wire[data-line="${slotIndex}"]`).classList.add("connected");
    chime(token.dataset.type === "Cl" ? 440 : token.dataset.type === "F" ? 523 : 659);
    const remaining = labPlacements.filter((item) => !item).length;
    $("#lab-feedback").textContent = remaining ? `Bien enclenché. Il reste ${remaining} prise${remaining > 1 ? "s" : ""} vide${remaining > 1 ? "s" : ""}.` : "Les quatre prises sont remplies. Vérifions la composition…";
    if (remaining === 0) setTimeout(checkMoleculeLab, 500);
  }

  function returnLabToken(slotIndex) {
    const placement = labPlacements[slotIndex];
    if (!placement) return;
    const token = document.querySelector(`.lab-token[data-token="${placement.tokenId}"]`);
    if (token) token.disabled = false;
    labPlacements[slotIndex] = null;
    const slot = document.querySelector(`.lab-slot[data-slot="${slotIndex}"]`);
    slot.textContent = "+";
    slot.className = `lab-slot ${["slot-top","slot-right","slot-bottom","slot-left"][slotIndex]}`;
    slot.setAttribute("aria-label", "Prise vide");
    document.querySelector(`.lab-wire[data-line="${slotIndex}"]`).classList.remove("connected");
    $("#lab-feedback").textContent = `${placement.type} remis dans la réserve. Choisissez une autre boule.`;
  }

  function resetMoleculeLab() {
    if (labCompleted) return;
    labPlacements.forEach((placement, index) => { if (placement) returnLabToken(index); });
    $("#molecule-lab").classList.remove("wrong");
    $("#lab-feedback").textContent = "Prises vidées. Placez 1 H, 2 F, puis trouvez la boule manquante.";
  }

  function checkMoleculeLab() {
    if (labCompleted) return;
    const filled = labPlacements.filter(Boolean);
    if (filled.length < 4) { $("#lab-feedback").textContent = `La molécule n’est pas terminée : il reste ${4 - filled.length} prise${4 - filled.length > 1 ? "s" : ""} vide${4 - filled.length > 1 ? "s" : ""}.`; chime(180); return; }
    const counts = filled.reduce((total, item) => { total[item.type] = (total[item.type] || 0) + 1; return total; }, {});
    const correct = counts.H === 1 && counts.F === 2 && counts.Cl === 1;
    if (!correct) {
      $("#molecule-lab").classList.remove("wrong"); void $("#molecule-lab").offsetWidth; $("#molecule-lab").classList.add("wrong");
      $("#lab-feedback").innerHTML = `<strong>Les quatre prises sont occupées, mais le code R‑022 impose 1 H et 2 F.</strong> Retirez les boules en trop : quelle famille doit remplir la place restante ?`;
      chime(155);
      return;
    }
    labCompleted = true;
    $("#molecule-lab").classList.add("success");
    $("#lab-feedback").innerHTML = `<strong>Molécule réussie : CHClF₂.</strong> Vous venez de découvrir vous-même que la quatrième prise devait recevoir Cl.`;
    document.querySelectorAll(".lab-token").forEach((token) => token.disabled = true);
    $("#lab-check").disabled = true;
    chime(659); setTimeout(() => chime(784), 170);
    const completedLesson = current;
    if (autoplay) setTimeout(() => { if (current === completedLesson) goTo(current + 1, true); }, 1800);
  }

  function quizMarkup() {
    if (quizIndex >= questions.length) {
      const passScore = Math.ceil(questions.length * 0.7);
      const success = score >= passScore;
      return `<div class="quiz-result"><h3>${success ? "Méthode comprise." : "Encore un passage."}</h3><p>${score}/${questions.length} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""}. ${success ? "Vous savez construire la molécule, décoder les chiffres, les lettres finales, les séries de mélanges et les principaux fluides naturels." : `Reprenez les étapes signalées, puis rejouez : la validation demande ${passScore} bonnes réponses sur ${questions.length}.`}</p><button class="nav-button" id="restart-quiz" type="button">Rejouer</button></div>`;
    }
    const question = questions[quizIndex];
    return `<div class="quiz"><div class="quiz-top"><strong>Défi ${quizIndex + 1} / ${questions.length}</strong><span class="score-pill">Score : ${score}</span></div><div class="question"><p>${question.q}</p><div class="answers">${question.a.map((answer, index) => `<button class="answer" data-answer="${index}" type="button">${answer}</button>`).join("")}</div></div><p class="feedback" id="feedback">Posez les trois cases avant de répondre.</p></div>`;
  }

  function bindQuiz() {
    const retry = $("#restart-quiz");
    if (retry) {
      retry.addEventListener("click", () => { quizIndex = 0; score = 0; answered = false; $("#interactive-zone").innerHTML = quizMarkup(); bindQuiz(); });
      return;
    }
    document.querySelectorAll(".answer").forEach((button) => button.addEventListener("click", () => answerQuestion(+button.dataset.answer)));
  }

  function answerQuestion(choice) {
    if (answered) return;
    answered = true;
    const question = questions[quizIndex];
    const correct = choice === question.correct;
    document.querySelectorAll(".answer").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("correct");
      else if (index === choice) button.classList.add("wrong");
    });
    $("#feedback").textContent = question.why;
    if (correct) { score += 1; chime(523); } else chime(165);
    setTimeout(() => { quizIndex += 1; answered = false; $("#interactive-zone").innerHTML = quizMarkup(); bindQuiz(); }, 2100);
  }

  function render() {
    if (isomerTimer) { clearTimeout(isomerTimer); isomerTimer = null; }
    const lesson = lessons[current];
    $("#experience").className = `experience theme-${lesson.theme}`;
    $("#lesson-kicker").textContent = lesson.kicker.replace(/^Étape \d+/, `Étape ${current + 1}`);
    $("#lesson-title").textContent = lesson.title;
    $("#lesson-text").textContent = lesson.text;
    $("#interactive-zone").innerHTML = lesson.render();
    $("#step-status").textContent = `Étape ${current + 1} sur ${lessons.length}${autoplay ? " · cours automatique" : ""}`;
    $("#previous-button").disabled = current === 0;
    $("#next-button").textContent = current === lessons.length - 1 ? "Recommencer →" : "Étape suivante →";
    document.querySelectorAll("#stepper button").forEach((button, index) => {
      button.classList.toggle("active", index === current);
      if (index === current) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
    });
    if (lesson.kind === "moleculeLab") bindMoleculeLab();
    if (lesson.kind === "isomerDemo") bindIsomerDemo();
    if (current === lessons.length - 1) bindQuiz();
    updateListenButton();
  }

  function updateListenButton() {
    const icon = $("#listen-button span");
    const label = $("#listen-button b");
    if (speaking && !paused) { icon.textContent = "Ⅱ"; label.textContent = " Pause"; }
    else if (paused) { icon.textContent = "▶"; label.textContent = " Reprendre"; }
    else { icon.textContent = "▶"; label.textContent = autoplay ? " Continuer le cours" : " Écouter"; }
  }

  function stopSpeech() {
    speechRun += 1;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    speaking = false;
    paused = false;
    updateListenButton();
  }

  function speakCurrent() {
    if (!("speechSynthesis" in window)) { $("#speech-warning").hidden = false; return; }
    stopSpeech();
    loadVoices();
    const localRun = speechRun;
    const utterance = new SpeechSynthesisUtterance(cleanText(lessons[current].speak));
    utterance.lang = selectedVoice?.lang || "fr-FR";
    utterance.voice = selectedVoice;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onstart = () => { if (localRun !== speechRun) return; speaking = true; paused = false; updateListenButton(); };
    utterance.onend = () => {
      if (localRun !== speechRun) return;
      speaking = false; paused = false; updateListenButton();
      if (lessons[current].pauseForActivity) {
        $("#step-status").textContent = `Étape ${current + 1} sur ${lessons.length} · à vous de construire la molécule`;
        return;
      }
      if (autoplay && current < lessons.length - 1) {
        setTimeout(() => { if (localRun !== speechRun) return; goTo(current + 1, true); }, 1100);
      }
    };
    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted" || localRun !== speechRun) return;
      speaking = false; paused = false; updateListenButton();
    };
    speechSynthesis.speak(utterance);
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window)) { $("#speech-warning").hidden = false; return; }
    if (speaking && !paused) { speechSynthesis.pause(); paused = true; updateListenButton(); return; }
    if (paused) { speechSynthesis.resume(); paused = false; updateListenButton(); return; }
    autoplay = true;
    render();
    speakCurrent();
  }

  function ensureAudio() {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    if (!audioContext) { audioContext = new AudioClass(); masterGain = audioContext.createGain(); masterGain.gain.value = soundEnabled ? 0.05 : 0; masterGain.connect(audioContext.destination); }
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function chime(frequency = 350) {
    // Le son se pilote par son propre bouton (topbar), jamais par le réglage
    // Windows « effets d'animation » — une machine qui le désactive (courant
    // en salle de formation) n'exprime aucune préférence sur le son.
    if (!soundEnabled) return;
    ensureAudio();
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    oscillator.connect(gain); gain.connect(masterGain); oscillator.start(now); oscillator.stop(now + 0.5);
  }

  function goTo(index, continueNarration = false) {
    stopSpeech();
    current = Math.max(0, Math.min(lessons.length - 1, index));
    render();
    chime();
    if (continueNarration) setTimeout(speakCurrent, 350);
  }

  function startCourse() {
    autoplay = true;
    ensureAudio();
    $("#module").scrollIntoView({ behavior:"smooth" });
    goTo(0, true);
  }

  buildStepper();
  $("#start-button").addEventListener("click", startCourse);
  $("#previous-button").addEventListener("click", () => goTo(current - 1, autoplay));
  $("#next-button").addEventListener("click", () => current === lessons.length - 1 ? goTo(0, autoplay) : goTo(current + 1, autoplay));
  $("#listen-button").addEventListener("click", toggleSpeech);
  $("#restart-button").addEventListener("click", () => { autoplay = false; goTo(0, false); scrollTo({ top:0, behavior:"smooth" }); });
  $("#source-toggle").addEventListener("click", () => { const panel = $("#sources-panel"); const open = panel.hidden; panel.hidden = !open; $("#source-toggle").setAttribute("aria-expanded", String(open)); if (open) panel.scrollIntoView({ behavior:"smooth", block:"nearest" }); });
  $("#sound-toggle").addEventListener("click", () => { soundEnabled = !soundEnabled; if (masterGain) masterGain.gain.value = soundEnabled ? 0.05 : 0; $("#sound-toggle").setAttribute("aria-pressed", String(soundEnabled)); $("#sound-toggle b").textContent = soundEnabled ? "Ambiance active" : "Ambiance coupée"; });
  document.addEventListener("keydown", (event) => { if (event.key === "ArrowRight") $("#next-button").click(); if (event.key === "ArrowLeft") $("#previous-button").click(); if (event.key === " " && document.activeElement === document.body) { event.preventDefault(); toggleSpeech(); } });
  render();
})();
