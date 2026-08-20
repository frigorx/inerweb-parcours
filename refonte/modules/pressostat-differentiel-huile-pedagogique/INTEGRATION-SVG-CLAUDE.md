# Contrat d’intégration — SVG Claude du pressostat différentiel d’huile

## Mission du visuel

Montrer le fonctionnement d’un pressostat différentiel d’huile mécanique sans
copier une coupe constructeur :

1. prise `P1 / OIL` reliée à la sortie de pompe à huile ;
2. prise `P2 / LP` reliée au carter ou à l’aspiration prévue ;
3. deux éléments sensibles travaillant en opposition ;
4. différence `Δp huile = P1 − P2` ;
5. contact de temporisation actif lorsque le différentiel est trop faible ;
6. temporisation arrêtée lorsque la pression nette redevient suffisante ;
7. arrêt de sécurité si le défaut persiste au-delà du délai.

Le dessin doit distinguer visuellement et textuellement trois états :

- `DÉMARRAGE — délai en cours` ;
- `PRESSION SUFFISANTE — marche autorisée` ;
- `DÉFAUT PERSISTANT — arrêt de sécurité`.

## Intégration réalisée le 19 août 2026

Franck a fourni l’archive `Animation project details needPRESO HUILed.zip`. La version v2
`pressostat-mecanisme.jsx` a été retenue pour sa chaîne explicite : deux soufflets opposés,
contact T1–T2, résistance, bilame temporisé et ouverture L–M.

Le lecteur Claude Design original dépend de React et Babel chargés depuis `unpkg.com`. Il
n’est donc pas embarqué tel quel. Une adaptation HTML/SVG/JavaScript sans dépendance se
trouve dans `assets/claude-pressostat/`. Sa provenance et l’empreinte du ZIP sont consignées
dans `assets/claude-pressostat/PROVENANCE.md`.

Le moteur commun conserve la fonction :

```text
visualOilPressureClaudeSlot(v)
```

dans `../_circuit-huile-commun/engine.js`. Le module appelle toujours le type visuel :

```text
oilPressureClaudeSlot
```

à la station 5 de `module.js`. La fonction charge l’adaptation locale dans une iframe
autonome afin de conserver sa commande à trois états sans modifier la navigation du cours.

## Contraintes d’intégration

- SVG manuel original, aucun raster et aucune dépendance distante ;
- `viewBox="0 0 720 300"` dans l’adaptation embarquée ;
- fond transparent ou `#FFFDF8` ;
- traits et titres `#1B3A63` ; accent `#FF6B35` ; texte orange `#C9451A` ;
- police de titre `Trebuchet MS`, corps `Calibri` ou `Segoe UI` ;
- information portée par un mot et une forme, jamais par la couleur seule ;
- état au repos déjà complet et correct ; l’animation ne fait qu’expliquer ;
- aucun clignotement rapide ;
- tous les textes restent lisibles à `360 × 640` ;
- conserver `role="img"`, un `<title>` et l’`aria-label` fourni par le moteur ;
- ne pas intégrer une photographie, une coupe ou un logo Danfoss ;
- ne pas inventer de seuil, de délai, de borne ou de tension.

## Animation recommandée

Une commande explicite interne au SVG peut faire défiler les trois états. Si le
SVG reste purement animé sans bouton, le dessin au repos doit montrer les trois
états côte à côte. Le texte de la leçon doit rester suffisant lorsque le SVG ne
s’anime pas ou à l’impression.

## Contrôle après remplacement

Relancer `tests/qa.mjs` depuis
`../_circuit-huile-commun/`, puis inspecter les captures de la station 5 en
`1366×768` et `360×640`. Vérifier aussi la version imprimée et la voix coupée.
