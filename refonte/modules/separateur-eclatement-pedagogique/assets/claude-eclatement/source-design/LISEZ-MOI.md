# Séparateur à éclatement — import local du plan Claude Design

Source : projet Design « Réponses sur le projet »
(`8f9ffc06-3266-4569-b697-6a633e534517`), plan `Séparateur à éclatement.dc.html`.
Fichiers repris de l'export du 20/08/2026 12 h 18, sans retouche.

Bac Pro MFER · TP BE CVC — inerWeb Édu · F. Henninot

## Deux façons de le lancer

**1. Version autonome — pour la classe**

`export/3 - Séparateur à éclatement.html` : double-clic, ça part.
Aucune connexion, aucun serveur, rien à installer. Vérifié : la page ne
demande aucun fichier extérieur.

**2. Version de travail — pour modifier l'animation**

Le `.dc.html` charge ses `.jsx` par `fetch`, donc il lui faut un serveur
local (pas de double-clic) **et** une connexion (React et Babel viennent
de unpkg.com).

```bash
python -m http.server 8795 --directory "C:/Users/henni/OneDrive/Bureau/CLAUDE-ESPACE-TRAVAIL/import-design-separateur-eclatement"
```

Puis ouvrir `http://localhost:8795/Séparateur à éclatement.dc.html`.
Une entrée `separateur-eclatement` a aussi été ajoutée à
`.claude/launch.json` du dossier de travail.

## Ce que contient le dossier

| Fichier | Rôle |
|---|---|
| `Séparateur à éclatement.dc.html` | le cadre : liste des scènes (`OM_SCENES`), réglages par défaut |
| `eclatement.jsx` | le dessin et l'animation — **c'est le seul fichier à modifier** |
| `animations-v3.jsx`, `tweaks-panel.jsx`, `support.js` | moteur commun, ne pas modifier |
| `export/3 - Séparateur à éclatement.html` | le film autonome |

## Régler les durées

Dans le `.dc.html`, la ligne `window.OM_SCENES` liste les 8 scènes avec leur
durée en secondes. Modifier un `dur` allonge ou raccourcit la scène ; les
repères d'animation suivent.

Durées actuelles (74 s au total) : Ouverture 4 · DeuxFamilles 9 ·
Eclatement 13 · Vitesse 10 · Paroi 9 · Retour 10 · Limites 11 · Recap 8.

## Après modification du `.jsx`

Le fichier modifié n'est **pas** répercuté dans `export/`. Pour regénérer le
film autonome, il faut repasser par Claude Design (le plan y est toujours) et
réexporter.

## Valeurs affichées à vérifier avant projection

- buse : **≈ 12 m/s** — corps : **≈ 1 m/s**
- densité de l'huile : **≈ 700 ×** celle du gaz

## Les deux autres films du même projet

`Retour d'huile` et `Séparateur d'huile` sont dans le même projet Design.
`Retour d'huile` a déjà été importé dans `../import-design-retour-huile`.
`Séparateur d'huile` ne l'est pas encore.
