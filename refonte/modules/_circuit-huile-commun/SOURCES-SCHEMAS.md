# Sources et provenance des schémas — circuit d’huile

## Bibliothèque technique inerWeb

Source de vérité consultée :
`C:\git\usine-contenu\bibliotheque-symboles\catalogue.json`.

Symboles insérés en ligne dans `engine.js`, avec leur `viewBox` et leur
géométrie d’origine :

| Identifiant | Fichier canonique | SHA-256 |
| --- | --- | --- |
| `compresseur_general` | `svg/frigo_schema/compresseur_general.svg` | `C6B196175FDFE279A2D27E1F676CB7DB0B8D7ABDF9CA1B700CD7A6AB4D39E180` |
| `separateur_huile` | `svg/frigo_schema/separateur_huile.svg` | `DA0E08840DEA1CE649702E0B2A4A51C56993EBBF86C8A8DD934D701028213CE9` |
| `echangeur_a_air` | `svg/frigo_schema/echangeur_a_air.svg` | `3D6CA67FA6A7E313D554BDFCD35B1C2FE321F0F0CA15CFB51354C74047C169A7` |
| `detendeur_thermo_ext` | `svg/frigo_schema/detendeur_thermo_ext.svg` | `F24AFEA041C447163CBB4FEAC2A101FBCA8F22042A7D0D41A239DD16B39C47B2` |
| `pressostat` | `svg/capteurs_froid/pressostat.svg` | `C8C2B9C5BEB18350222C3EF5B9EF814A32C3A2CD67F1ECCDBED3BF4AACBD71ED` |

Le réservoir d’huile, le clapet différentiel et les régulateurs ne disposent
pas encore d’un symbole validé portant cette fonction exacte dans le
catalogue. Ils restent donc représentés par des enveloppes fonctionnelles
clairement légendées, sans détourner un symbole de bouteille liquide ou de
clapet anti-retour.

## Trame de tuyauterie réutilisée

Le tracé pente–siphon est dérivé du brouillon inerWeb existant :

`C:\Users\henni\Desktop\inerweb full ia\travail-reillustration-2026-08-12\assets\v2\aspiration-pente-siphon.svg`

SHA-256 :
`ED42861551BC0BDD207CA58A011508564C4516E6212C04DBA92E5097433BE7F2`.

La topologie pédagogique a été conservée puis complétée avec une boucle haute
et une double colonne. Les organes génériques du brouillon ont été remplacés
par les symboles validés ci-dessus.

## Attribution

Symboles issus de la collection QElectroTech (CC BY 3.0), adaptés par inerWeb
— F. Henninot.

Le module reste un brouillon jusqu’au bon à tirer métier et pédagogique. Il
n’est ni publié ni indexé dans le RAG actif à ce stade.

## Schémas fonctionnels ajoutés à la ligne complète

Les vues de séparation, flotteur-pointeau, réserve tampon, branche de pression,
niveau mécanique, zones électroniques et comparaison BP/HP sont dessinées par
le moteur commun. Elles expliquent un principe et ne remplacent ni le schéma du
constructeur ni son dimensionnement. Les raccordements sont décrits en texte et
la couleur n’est jamais le seul porteur d’information.

Sources techniques recoupées : cours locaux indexés, notice Parker Sporlan
SD-129, bulletin Copeland OM3/OM4/OM5 et documentation BITZER sur la régulation
du niveau d’huile et les collecteurs d’aspiration. Les liens sont consignés dans
`PARCOURS-COMPLET.md`.

Le mécanisme interne du pressostat différentiel n’est pas dessiné par le moteur.
Une baie est réservée au SVG que Claude produira, avec son contrat technique dans
`../pressostat-differentiel-huile-pedagogique/INTEGRATION-SVG-CLAUDE.md`.

## Reprise du 20 août 2026 — les organes prennent leurs symboles

Constat de départ : 71 emplois de la boîte rectangulaire `component()`. La plupart
sont légitimes — un bloc de raisonnement (« LUBRIFIER », « OUI / NON »,
« 2 · NOTICE ») n'a pas de symbole normalisé et n'en aura jamais. En revanche
**26 d'entre eux désignaient un organe réel**, ce qui n'est pas acceptable.

Sur ces 26 :

- **10** avaient déjà leur symbole dans `engine.js` sans l'utiliser — compresseur,
  condenseur, évaporateur, détendeur, séparateur d'huile. Ils l'utilisent désormais.
- **6** ont reçu un symbole nouvellement inséré depuis la bibliothèque validée.
- **10** restent des enveloppes fonctionnelles légendées, faute de symbole juste.

### Symboles insérés le 20/08

| Identifiant | Fichier canonique | SHA-256 |
| --- | --- | --- |
| `filtre_cartouche` | `svg/frigo_schema/filtre_cartouche.svg` | `A6714A06E5258A34A9F98E1D6128EF32EBE32EA2E068F23F27ADD1C0EFB34D3B` |
| `vanne_isolement` | `svg/frigo_schema/vanne_isolement.svg` | `D0AA3973B58D7086BB7AE56F8F8A5F9A5E488AFACA570C60EB570611831F10E9` |
| `electrovanne_frigo` | `svg/frigo_schema/electrovanne_frigo.svg` | `4DB2B7172F6A94A41A444C2DE30E46F5C4EB355A2D69E5C73A776C779A43BB8A` |
| `pompe` | `svg/frigo_schema/pompe.svg` | `2DDD564367FD1198F4F94507336B8821379582536FA753D6E37B6BA77AD24FE0` |
| `voyant_liquide` | `svg/frigo_schema/voyant_liquide.svg` | `C57EF8124B2608FD2955A46391E03A93551FDBC8FD3FFDD34D9A17E536DB73D4` |

Le dessin d'origine est repris tel quel ; seul le cadre change. La fonction
`organe()` pose le symbole et le nom dessous, à la place du rectangle à mot.

### Ce qui reste une enveloppe, et pourquoi

| Organe | emplois | Raison |
| --- | ---: | --- |
| Réservoir d'huile | 5 | `bouteille_liquide` existe, mais c'est un autre organe : la détourner tromperait. |
| Régulateur de niveau | 4 | Aucun symbole de régulateur à flotteur pour huile dans le catalogue validé. |
| Clapet taré différentiel | 1 | `clapet_anti_retour` ne dit pas la même fonction. |

Ces trois-là attendent qu'un symbole juste entre au catalogue. Aucun symbole voisin
n'a été détourné pour combler le vide.

### Contrôle

Planche de relecture `planche-visuels.html`, sur les 89 visuels de la ligne :
**73 symboles normalisés** rendus, **0 texte hors cadre**, **0 chevauchement**.
Un libellé du séparateur qui dépassait du cadre par le bas a été remonté.
