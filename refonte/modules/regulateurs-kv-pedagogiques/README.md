# Les régulateurs KV — prototype inerWeb Édu

Parcours autonome et hors ligne pour comparer les régulateurs de pression
d’évaporation (KVP), de carter (KVL) et de condensation (KVR).

## Ouvrir

Ouvrir directement `index.html` dans Edge ou Chrome. Aucun serveur, compte,
CDN ou paquet JavaScript n’est requis à l’exécution.

## Parcours

1. Comparer les trois fonctions.
2. Reconnaître un produit réel en 3D.
3. Placer chaque organe sur le circuit.
4. Animer la chaîne pression → soufflet → tige → clapet → débit.
5. Relier vis, ressort et mesure au manomètre.
6. Étudier les usages professionnels.
7. Diagnostiquer sans régler à l’aveugle.
8. Vérifier les acquis avec six questions mélangées.

Sur téléphone : boutons tactiles renforcés, balayage horizontal sur la partie
texte pour changer d’écran, zoom dédié de la 3D et mode « Agrandir le visuel ».
Le mode paysage bascule lui aussi sur la navigation mobile.

## Statut

Prototype de travail du 7 août 2026. Il n’est ni validé, ni livré, ni indexé
dans le RAG. La géométrie 3D dérivée du STEP fourni reste limitée au prototype
tant que ses conditions de diffusion ne sont pas arbitrées.

## Vérifier

```powershell
node --test tests/static.test.mjs
node --check app.js
```
