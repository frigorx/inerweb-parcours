# Reprise — Détendeur thermostatique pédagogique

## Copie active

C:\Users\henni\Desktop\inerweb full ia\detendeur-pedagogique

Le projet voisin voyant-liquide-pedagogique a fourni l’architecture générale et n’a pas été
modifié. Ne pas répercuter automatiquement les changements dans une autre copie.

## État retenu

Le prototype 04 est intégré aux écrans 2, 3, 4, 6, 7, 11, 12 et 13. Il définit la géométrie
commune du détendeur :

- corps et raccords lisibles ;
- entrée liquide HP par le bas et sortie BP latérale sur le modèle de principe ;
- membrane, tige et clapet alignés ;
- bulbe serré sur un tube droit de sortie d’évaporateur ;
- capillaire continu du bulbe à la tête ;
- prise de pression interne visible dans la coupe ;
- égalisation externe expliquée séparément à l’écran 9 par un vrai tube dédié pris après le bulbe.

L’écran 6 est la vue de référence pour l’explication mécanique. Il juxtapose la coupe simplifiée,
le bilan `F bulbe ↔ F évaporation + F ressort` et la chaîne
`bulbe → membrane → tige → clapet → passage`. Ses trois boutons ne doivent pas être multipliés :
équilibre, bulbe plus chaud, ressort plus comprimé.

Les prototypes rejetés et le rendu CAO restent dans archives/. La CAO ne doit pas entrer dans
une livraison tant que ses droits de reproduction, conversion et diffusion ne sont pas établis.

## Contrat fonctionnel

- 14 étapes et 6 questions ;
- réussite pédagogique à partir de 5/6 ;
- vitesses vocales 0.80 · 0.95 · 1.10 · 1.25, défaut 0.95 ;
- clé locale inerweb-detendeur-rate ;
- aucune voix au chargement ;
- navigation ArrowLeft / ArrowRight hors contrôles ;
- 100dvh sans défilement ;
- aucune dépendance distante ;
- schémas techniques manuels et symboles internes validés.

## Points métier à préserver

- détendeur à gauche, compresseur à droite, condenseur en haut, évaporateur en bas ;
- sur la branche verticale, symbole du détendeur tourné d’un quart de tour ;
- corps à l’entrée de l’évaporateur et bulbe sur l’aspiration en sortie ;
- surchauffe = température du tube − température de saturation liée à la pression ;
- pression du bulbe vers l’ouverture ; pression d’évaporation et ressort vers la fermeture ;
- débit massique entrant égal au débit massique sortant au régime permanent ;
- prise interne T 2 distincte de la prise externe TE 2 ;
- l’égalisation externe compense l’effet d’une perte de charge, sans la supprimer ;
- sélection de la buse par fluide, puissance et conditions de calcul ;
- la vis de surchauffe n’est jamais une correction universelle ;
- valeurs et couples uniquement dans le périmètre documenté du modèle ;
- aucune ouverture d’un circuit chargé ou sous pression.

## Vérifications

Lancer tests/qa.mjs avec Playwright. Le test attendu couvre les 14 étapes en cinq formats,
les interactions, le quiz, le clavier, les sources, l’absence de requêtes distantes et les modes
dégradés sans stockage ni synthèse vocale.
