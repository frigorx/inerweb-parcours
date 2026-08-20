# Provenance de l’adaptation Claude

Source fournie par Franck le 19 août 2026 :

`C:\Users\henni\Downloads\Animation project details needPRESO HUILed.zip`

SHA-256 :

`B4436AE7314C470511049BBF5ED5B066B2BF0E2653BC2F06B4B57B767A6CE212`

Pièce de référence retenue : `pressostat-mecanisme.jsx`, version v2, accompagnée de
`Pressostat huile MP v2.dc.html`. La chaîne fonctionnelle conservée est : deux soufflets
opposés → contact T1–T2 → résistance → bilame temporisé → ouverture L–M.

Le paquet original est une source d’atelier Claude Design. Il charge React et Babel depuis
`unpkg.com`, contient un panneau de réglage d’auteur et ne peut donc pas être intégré tel quel
à un module inerWeb hors ligne. La présente adaptation :

- ne charge aucune dépendance distante ;
- ne recopie aucune photographie ni marque constructeur ;
- conserve les trois états fonctionnels sous commande explicite ;
- ne fixe ni seuil, ni délai, ni tension universels ;
- garde un texte complet lorsque les transitions sont réduites.

Cette adaptation reste un brouillon soumis à relecture métier et au bon à tirer de Franck.
