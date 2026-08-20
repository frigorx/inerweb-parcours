# Pressostat différentiel d’huile — module interactif inerWeb

Station 9 de la ligne **Le circuit d’huile** : 10 leçons et 10 questions.

Le dossier est autonome dans l’architecture inerWeb : `index.html`, données
pédagogiques `module.js`, moteur et styles communs chargés localement. Il couvre
le rôle de sécurité, les prises P1/OIL et P2/LP, la pression nette `P1 − P2`, le
seuil, le différentiel de contact, la temporisation, le câblage, le test, le
réarmement et le diagnostic à indices croisés.

Le mécanisme interne n’est volontairement pas dessiné dans cette version.
L’écran 5 contient une baie réservée au futur SVG de Claude. Le contrat à lui
transmettre se trouve dans `INTEGRATION-SVG-CLAUDE.md`.

Sources locales relues :

- `03_BAC-MFER/S2-Systemes/4 Electricité (pressostat huile).pdf` ;
- `03_BAC-MFER/S2-Systemes/les-pressostats.pdf`, pages consacrées au
  pressostat différentiel d’huile.

Source fabricant de référence : fiche Danfoss MP54/MP55/MP55A, version 2025.
Les seuils, délais, bornes et procédures restent ceux de la notice exacte du
matériel installé.

Statut : production locale complète pour intégration inerWeb, non validée métier,
non publiée et non indexée dans le RAG actif.
