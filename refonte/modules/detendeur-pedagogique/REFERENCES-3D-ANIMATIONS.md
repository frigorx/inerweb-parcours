# Dossier de recherche — 3D et animations du détendeur

Vérification effectuée le 5 août 2026. Le TP principal reste gelé : aucune ressource tierce
recensée ci-dessous n’a été copiée ni intégrée dans le module.

## Décision rapide

| Ressource | Intérêt pour le prototype | Statut retenu |
|---|---|---|
| DWG GrabCAD « Válvula de Expansão Danfoss TE 2 Rosca » | Silhouette extérieure, raccords et proportions générales | Consultation locale seulement ; pas d’intégration publique sans vérifier l’usage et obtenir l’autorisation nécessaire |
| Animations Canal-U / Marine nationale | Cinématique d’assemblage, fonctionnement et réglage | Référence de mise en scène seulement ; réemploi interdit sans accord de la Marine nationale |
| Page historique « La page du frigoriste » | Égalisation interne/externe, montage du bulbe et réglage | Référence technique à recouper ; textes et GIF sous copyright, donc non intégrés |
| Danfoss Design Center | Identification officielle du TE 2 et caractéristiques produit | Source technique prioritaire ; visuel PNG non intégré |
| Outil BIM Danfoss | Bibliothèques RFA/DWG constructeur | À explorer avec un profil Danfoss ; aucune géométrie intégrée tant que les conditions de réemploi ne sont pas établies |

## Archive GrabCAD fournie

- Archive : `C:\Users\henni\Downloads\valvula-de-expansao-dwg-1.snapshot.1.zip`
- Page d’origine : <https://grabcad.com/library/valvula-de-expansao-dwg-1>
- Auteur / déposant affiché : Adriano Aquino
- Mise en ligne affichée : 17 novembre 2020
- Description affichée : « Válvula de Expansão Danfoss TE 2 Rosca »
- Logiciel déclaré : AutoCAD
- Contenu : `Valvula Expansão TE 2 Rosca.dwg`, 918 661 octets
- Signature du DWG : `AC1027`, format AutoCAD 2013
- SHA-256 de l’archive : `BCB847D9C998B4232117DF757F81AF0F7A2BBFFFF2C9DD845DC1842A984CA158`
- Provenance confirmée par le flux `Zone.Identifier` de Windows : téléchargement du fichier
  `original.zip` de la même page GrabCAD.

Le visualiseur GrabCAD présente un dessin filaire extérieur du TE 2 : tête circulaire, corps
angulaire, raccord supérieur, sortie latérale, raccord inférieur et liaison capillaire. Le fichier
ne constitue pas une coupe fonctionnelle exploitable pour montrer le déplacement de la membrane,
de la tige et du clapet.

### Rendu local utilisé pour le prototype 03

Le poste ne possède aucun lecteur ou convertisseur DWG local. Le DWG a donc servi à confirmer la
famille et la disposition extérieure, mais il n’a pas été converti. Pour obtenir de vrais volumes,
le fichier STEP fourni `ID542934671055-0101.stp` a été lu avec Open CASCADE dans un environnement
temporaire. Il contient un solide, 475 faces et une emprise approximative de
`73,9 × 87,2 × 78,9 mm` dans son repère CAO.

Quatre rendus de contrôle ont été produits dans `_reference-3d-locale/` : isométrique, face, côté
et dessus. Ils alimentent uniquement `prototype-detendeur.html` pour la validation humaine des
volumes. Ils sont explicitement hors du TP final et devront être remplacés par un SVG original
après validation.

La règle GrabCAD publiée dans « How can models be used and shared? » distingue l’usage privé,
l’usage public non commercial avec attribution et lien vers le créateur, et l’usage commercial
qui exige une autorisation explicite du concepteur. Comme le futur mode de diffusion d’inerWeb
n’est pas verrouillé et que le modèle reproduit un produit Danfoss, le DWG reste hors du livrable.

## Animations Canal-U / Marine nationale

Trois séquences courtes sont directement pertinentes :

1. [Conception d’un détendeur thermostatique](https://www.canal-u.tv/chaines/minesparis-psl/animations-de-la-marine-nationale/conception-d-un-detendeur-thermostatique) — les pièces sont assemblées progressivement ; DOI `10.60527/y51k-2z80`.
2. [Fonctionnement d’un détendeur thermostatique](https://www.canal-u.tv/chaines/minesparis-psl/animations-de-la-marine-nationale/fonctionnement-d-un-detendeur) — bulbe chaud, pression de saturation plus forte, ouverture, augmentation du débit, refroidissement puis retour vers l’équilibre ; DOI `10.60527/wa4k-9s68`.
3. [Réglage d’un détendeur thermostatique](https://www.canal-u.tv/chaines/minesparis-psl/animations-de-la-marine-nationale/reglage-d-un-detendeur-thermostatique) — action de la vis de réglage sur le débit et la température de sortie ; DOI `10.60527/x3a2-yn13`.

Les trois notices indiquent : média et animation Marine nationale, tous droits réservés ; toute
exploitation hors du MOOC concerné nécessite l’accord de la Marine nationale. Les flux vidéo ne
sont donc ni téléchargés ni incorporés. Seule l’idée pédagogique générale d’une animation par
causes et effets peut guider une nouvelle réalisation originale.

## Page historique « La page du frigoriste »

Source : <http://joho.p.free.fr/EC/ENERGIE/_Ressources/FROID%20et%20CLIM%20Phillipe%20Cretal/perso.wanadoo.fr/philippe.cretal/detendeur.htm>

La page contient trois GIF utiles à l’analyse :

- `detegint.gif` : égalisation interne ;
- `detegext.gif` : égalisation externe ;
- `montdet.gif` : montage du détendeur et du bulbe.

Elle décrit aussi les forces d’ouverture et de fermeture, le pompage, la position du bulbe, la
prise d’égalisation en aval du bulbe et l’attente nécessaire entre deux corrections. La page porte
la mention « Copyright © 2000 La page du frigoriste. Tous droits réservés ». Les GIF et le texte
ne doivent donc pas être repris. Le contenu doit être recoupé avec la documentation constructeur :
la page comporte notamment au moins une formule manifestement fautive dans le paragraphe sur
l’égalisation externe.

## Sources officielles Danfoss

La fiche officielle [TE 2, code 068Z3449](https://designcenter.danfoss.com/products/climate-solutions-for-cooling/valves/expansion-valves/thermostatic-expansion-valves/t-2---te-2/p/068Z3449)
confirme notamment : corps en laiton, capillaire de 1 500 mm, corps d’équerre, égalisation externe,
entrée flare 3/8 pouce, sortie à braser 12 mm et réglage de surchauffe ajustable. L’onglet
« Visuals » propose un rendu photoréaliste PNG de 1,1 Mo, pas un modèle 3D téléchargeable.

La page officielle [BIM tool and libraries](https://www.danfoss.com/en/service-and-support/downloads/dcs/bim-tool-and-libraries/)
annonce des assemblages BIM en RFA et DWG, en LOD 200 ou LOD 350. L’outil peut fonctionner seul
ou avec Revit, mais son utilisation demande un profil Danfoss gratuit. Il faudra ensuite vérifier
si un modèle TE 2 exact existe et lire ses conditions avant toute conversion ou publication.

## Traduction en prototype original inerWeb

Les références permettent de définir une animation neuve, sans recopier leur graphisme :

1. présenter d’abord une silhouette extérieure reconnaissable du détendeur, orientée d’un quart
   de tour dans le circuit frigorifique ;
2. passer en coupe simplifiée et nommer séparément bulbe, charge, capillaire, membrane, tige,
   ressort, vis, clapet, buse, entrée HP et sortie BP ;
3. animer la chaîne causale complète : bulbe plus chaud → pression du train thermostatique en
   hausse → membrane et tige se déplacent → clapet ouvre davantage → débit augmente ;
4. animer le retour à l’équilibre quand la sortie de l’évaporateur refroidit ;
5. afficher simultanément les trois forces sur la membrane, puis isoler l’égalisation interne et
   l’égalisation externe ;
6. faire tourner la vis par huitièmes ou quarts de tour, avec un temps de stabilisation visible,
   sans présenter le réglage comme une correction universelle ;
7. conserver une liaison continue et physiquement lisible entre le bulbe fixé sur l’aspiration et
   la tête thermostatique.

Cette séquence sera dessinée manuellement en SVG/HTML/CSS et restera indépendante des géométries,
GIF, PNG et vidéos tiers.
