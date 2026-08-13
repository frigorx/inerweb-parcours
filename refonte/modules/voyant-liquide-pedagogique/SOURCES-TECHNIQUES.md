# Sources techniques — Voyant liquide

Références vérifiées le 4 août 2026. Les faits sont reformulés ; aucune illustration fabricant
n’est reproduite.

## Danfoss — article « Food safety » fourni par l’utilisateur

- Source primaire locale : `C:\Users\henni\Downloads\AC290356803278en-000203.pdf`.
- Identifiant du document : `AC290356803278en-000203`, Danfoss DCS (ACR), mars 2025.
- Vérification : les quatre pages ont été rendues et contrôlées ; les éléments utiles figurent en
  page 3.
- Faits retenus : le voyant aide à apprécier l’état du fluide ; des bulles peuvent, parmi d’autres
  causes possibles, signaler une quantité de fluide insuffisante ; les voyants comportent souvent
  un indicateur d’humidité. Le même article rappelle que le filtre-déshydrateur abaisse l’humidité
  vers le niveau prévu par la conception.
- Utilisation : écrans 2, 3, 7 et dialogue des sources.
- Limite : l’article ne fournit ni seuil de couleur ni règle de diagnostic complète. Le module
  conserve donc la formulation prudente « cause possible », jamais « preuve de sous-charge ».

## Danfoss — gamme SG / SGP

- Source primaire : https://designcenter.danfoss.com/en-bg/products/climate-solutions-for-cooling/sight-glasses/sight-glasses/sg---sgp
- Complément : https://www.danfoss.com/en-us/products/dcs/sight-glasses/sight-glasses/
- Faits retenus : les voyants de la gamme existent avec et sans indicateur d’humidité ; ils
  permettent d’observer les conditions de circulation et, lorsqu’ils en sont équipés, d’indiquer
  l’humidité par couleur.
- Utilisation : écrans 1, 3, 5, 8 et 10.

## Danfoss — fiche SG / SGP fournie, avril 2026

- Source primaire locale :
  `C:\Users\henni\OneDrive\Bureau\26-27\inventair 15-09\AI556919029172en-000101.pdf`.
- Identifiant : `AI556919029172en-000101`, *Data sheet — Sight glass SG / SGP*, Danfoss
  Climate Solutions, avril 2026.
- Vérification : les 17 pages ont été rendues et contrôlées ; pages utiles 2, 6 à 10 et 15.
- Faits retenus : le SG/SGP se place sur la ligne liquide entre le filtre-déshydrateur et le
  détendeur ; les versions avec et sans indicateur existent avec raccords flare, à braser et
  socket. Pour l’indicateur documenté, vert signifie sec et jaune humide, mais les seuils en ppm
  varient selon le fluide et la température.
- Stabilisation : un jaune au démarrage peut provenir de l’exposition à l’humidité de l’air ou de
  l’humidité du circuit. Si le jaune persiste, Danfoss demande d’éliminer l’humidité et indique que
  la capacité du filtre-déshydrateur est dépassée : il doit être remplacé aussi rapidement que
  possible. Le retour au vert atteste le rétablissement de l’équilibre pour cette gamme.
- Sécurité : le papier indicateur contient plus de 0,1 % en masse de dichlorure de cobalt. S’il est
  endommagé ou démonté, éviter le contact cutané et l’inhalation de poussière, puis l’éliminer comme
  déchet dangereux.
- Orientation : le texte impose l’emplacement entre filtre et détendeur mais aucune position
  horizontale universelle. La figure d’application montre même un voyant sur un tronçon vertical.
- Utilisation : écrans 2, 8, 9, 12 et 13, quiz et dialogue Sources.
- Droits : le document porte la mention « All rights reserved » ; photographies, coupes, tableaux,
  étiquettes et logos restent hors du module.

## Danfoss — guide d’installation SGP / SG fourni, juin 2020

- Source primaire locale : `C:\Users\henni\Downloads\AN220886434888en-001001.pdf`.
- Identifiant : `AN220886434888en-001001`, *Installation guide — Sight glass*, Danfoss DSC,
  juin 2020.
- Vérification : les 2 pages ont été rendues et contrôlées.
- Faits retenus : pour les modèles illustrés, le brasage est réalisé sous azote sec, avec une
  protection humide autour du corps et une brasure contenant au moins 5 % d’argent. La notice
  illustre une limite de 80 °C au niveau du composant et fournit des couples propres à chaque
  raccord ; le module ne transforme aucune de ces valeurs en règle universelle.
- Sécurité : le guide reprend les précautions liées au papier au dichlorure de cobalt lorsqu’un
  indicateur est endommagé ou démonté.
- Utilisation : écrans 12 et 13 et dialogue Sources.
- Droits : pictogrammes, dessins de gestes et mise en page ne sont pas reproduits.

## Danfoss — Filter driers and sight glasses

- Source primaire : https://www.danfoss.com/en-gb/service-and-support/case-stories/dcs/filter-driers-and-sight-glasses/
- Faits retenus : sur un circuit à détendeur, le voyant est habituellement placé sur la ligne
  liquide immédiatement après le filtre-déshydrateur et de préférence près de l’organe de détente ;
  la version avec indicateur assure une double lecture ; le brasage demande une attention
  particulière et un balayage d’azote sec pour limiter l’oxydation interne.
- Utilisation : écrans 2, 3, 11 et 12.

## Danfoss — chambre froide, filtre puis voyant

- Source primaire : https://www.danfoss.com/en-us/service-and-support/case-stories/dcs/walk-in-coolers-filter-driers-and-sight-glasses/
- Faits retenus : dans l’application décrite, le voyant est placé directement après le
  filtre-déshydrateur. Des bulles en aval peuvent signaler une chute de pression à travers le
  filtre, mais aussi une quantité de fluide insuffisante ou un manque de sous-refroidissement.
- Utilisation : écrans 2 et 7, illustration `diagnostic-filtre-colmate.svg`.

## Danfoss — orientation du filtre-déshydrateur

- Source primaire : https://assets.danfoss.com/documents/latest/50904/AX268746791624en-000101.pdf
- Document : *Fitters notes — Filter driers & sight glasses*, section Installation.
- Faits retenus : le sens de la flèche doit être respecté ; les filtres décrits peuvent être
  montés dans plusieurs orientations. Le montage vertical influence l’évacuation du fluide ; le
  DCR demande une entrée vers le haut ou une position horizontale.
- Utilisation : écran 2 et écran 12.
- Limite : cette source interdit de transformer « horizontal sur le montage étudié » en règle
  universelle pour tous les produits.

## Parker Sporlan — position et diagnostic en aval du filtre

- Notice See-All SD-21 : https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-070/SD-21-See-All-Installation.pdf
- Notice Catch-All SD-214 : https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-040/SD-214-RC-CatchAll.pdf
- Faits retenus : la notice See-All autorise plusieurs emplacements sur la ligne liquide et
  indique qu’entre filtre et organe de détente les bulles peuvent révéler une restriction telle
  qu’un filtre bouché. La notice du filtre à cartouches autorise plusieurs positions et qualifie
  l’horizontale de généralement plus pratique, non d’obligatoire.
- Utilisation : écrans 2, 7 et 12.

## Danfoss Ref Tools — bulles avant le détendeur

- Source primaire : https://reftools.danfoss.com/tools/cooling/troubleshooter/system-areas/liquid-line/sight-glass/vapour-bubbles-in-sight-glass-ahead-of-thermostatic-expansion-valve/
- Faits retenus : des bulles peuvent être liées à une pression de condensation trop basse, une
  vanne insuffisamment ouverte, une chute de pression hydrostatique, une régulation de condensation,
  une quantité de liquide insuffisante ou un sous-refroidissement insuffisant.
- Utilisation : écrans 6, 7 et 11.

## Danfoss Ref Tools — bulles juste après le filtre

- Source primaire : https://reftools.danfoss.com/tools/cooling/troubleshooter/system-areas/liquid-line/sight-glass/bubbles-in-sight-glass-after-filter/
- Faits retenus : les causes proposées comprennent une chute de pression excessive, un filtre
  colmaté ou sous-dimensionné, un sous-refroidissement insuffisant et une quantité de fluide
  insuffisante. Danfoss recommande aussi de comparer la température à l’entrée et à la sortie du
  filtre et, lorsque des prises sont disponibles, la chute de pression.
- Utilisation : écran 7 et illustration `diagnostic-filtre-colmate.svg`.

## Parker Sporlan — See-All Moisture and Liquid Indicator, Bulletin 70-10

- Source primaire : https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-070/70-10-See-Alls.pdf
- Faits retenus : l’indicateur combine lecture du fluide et de l’humidité ; un papier poreux
  imprégné d’un sel sensible change de couleur selon l’humidité relative dans le réfrigérant ; pour
  cette gamme, vert foncé signifie sec, une teinte intermédiaire appelle la vigilance et jaune
  signifie humide. Les seuils dépendent du fluide et de la température. Le bulletin recommande un
  fonctionnement suffisamment long pour atteindre l’équilibre complet avant de conclure. Il demande
  aussi de diriger la flamme loin du corps pendant le brasage.
- Utilisation : écrans 4, 8, 9 et 12.

## Danfoss — diagnostic de charge en chambre froide

- Source primaire : https://www.danfoss.com/en/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Faits retenus : le contrôle de charge combine sous-refroidissement, surchauffe, comportement du
  voyant, pressions, températures et conception du système ; une restriction peut imiter une
  sous-charge.
- Utilisation : écrans 6, 7 et 11.

## Modèles STEP fournis via SolidWorks — contrôle de pertinence

- Archive locale : `C:\Users\henni\Downloads\OneDrive_1_04-08-2026.zip`.
- `vem a souder.STP` : l’en-tête identifie `WEB032F1156` et Danfoss A/S. Le code produit officiel
  `032F1156` désigne une électrovanne EVR 3 à raccords à souder ; ce modèle n’appartient donc pas
  au sujet du voyant liquide.
- `VOYANT 1 4 FLARS.STP` : l’en-tête décrit un `SGI 6 Flare Ext. x Ext.` et le produit interne
  `WEB014-9107`. Ce fichier confirme une variante SGI 6 à raccords flare 1/4 avec indicateur.
- Usage : vérification documentaire uniquement. Aucun modèle STEP ni rendu dérivé n’est intégré,
  car aucune autorisation de reproduction, modification ou diffusion publique n’a été fournie.

## Limite de validation

Le module décrit une architecture générique. Avant de l’associer à un produit précis, vérifier le
fluide, la température, la plage de pression, la compatibilité des matériaux, le sens éventuel, la
position, la légende de couleur, la méthode de brasage et la notice de l’installation.
