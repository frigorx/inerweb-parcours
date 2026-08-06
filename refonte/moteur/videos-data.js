/* =====================================================================
   videos-data.js — le registre des tutos VIDÉO (gestes filmés).
   ---------------------------------------------------------------------
   Aucune vidéo n'est encore tournée : ce fichier est le GABARIT prêt
   pour les tournages annoncés (pose et dépose des manomètres, vannes de
   service…). Les règles, tranchées dans PROPOSITION-SITE.md § 6 :

   1. SOUS-TITRES OBLIGATOIRES — fichier .vtt du même nom que le .mp4,
      dans le même dossier. Aucune information portée par le son seul.
   2. MP4 (H.264 + AAC), 720p suffit, MOINS DE 100 Mo par fichier
      (limite stricte de l'hébergement).
   3. Les fichiers vivent dans videos/ à la racine du dépôt.
   4. Une vidéo s'accroche à une capsule (champ `capsule`) : le geste
      filmé arrive après les écrans qui le préparent.

   Une entrée se déclare ainsi (exemple complet, à décommenter puis
   adapter quand la première vidéo arrive) :

   {
     id: "pose-depose-manos",
     titre: "Poser et déposer les manomètres",
     fichier: "../videos/pose-depose-manos.mp4",
     sousTitres: "../videos/pose-depose-manos.vtt",
     minutes: 4,
     capsule: "tirage-au-vide",        // la capsule qui prépare ce geste
     chapitres: [                       // secondes, du début du geste
       { t: 0,   titre: "Le matériel et les EPI" },
       { t: 45,  titre: "La pose, vanne par vanne" },
       { t: 150, titre: "La dépose sans perte de fluide" },
     ],
   },
   ===================================================================== */
window.VIDEOS = [];
