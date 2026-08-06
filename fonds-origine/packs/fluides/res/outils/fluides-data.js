/* Base fluides — extraite de FRIGOLO « réglette fluides » (frigorx/inerweb-frigolo,
   données interpolées, sources publiques). GWP de R-32, R-134a, R-404A et R-410A
   alignés sur les valeurs Mission F-GAZ déjà citées dans les fiches du pack.
   Valeurs PÉDAGOGIQUES — en intervention : fiche du fluide + doc constructeur. */
window.FLUIDES = {
 "R22": {
  "nom": "R-22",
  "cat": "HCFC",
  "gwp": 1760,
  "classe": "A1",
  "glide": 0,
  "statut": "interdit (UE)",
  "compo": "CHClF2",
  "desc": "Historique universel",
  "table": [
   {
    "t": -40,
    "p": 1.052
   },
   {
    "t": -30,
    "p": 1.639
   },
   {
    "t": -20,
    "p": 2.453
   },
   {
    "t": -10,
    "p": 3.548
   },
   {
    "t": 0,
    "p": 4.98
   },
   {
    "t": 10,
    "p": 6.809
   },
   {
    "t": 20,
    "p": 9.1
   },
   {
    "t": 30,
    "p": 11.919
   },
   {
    "t": 40,
    "p": 15.336
   },
   {
    "t": 50,
    "p": 19.427
   }
  ]
 },
 "R32": {
  "nom": "R-32",
  "cat": "HFC",
  "gwp": 675,
  "classe": "A2L",
  "glide": 0,
  "statut": "phase-down en cours",
  "compo": "CH2F2",
  "desc": "PAC nouvelle gen",
  "table": [
   {
    "t": -40,
    "p": 1.774
   },
   {
    "t": -30,
    "p": 2.734
   },
   {
    "t": -20,
    "p": 4.058
   },
   {
    "t": -10,
    "p": 5.826
   },
   {
    "t": 0,
    "p": 8.131
   },
   {
    "t": 10,
    "p": 11.069
   },
   {
    "t": 20,
    "p": 14.746
   },
   {
    "t": 30,
    "p": 19.275
   },
   {
    "t": 40,
    "p": 24.783
   },
   {
    "t": 50,
    "p": 31.412
   }
  ]
 },
 "R134a": {
  "nom": "R-134a",
  "cat": "HFC",
  "gwp": 1430,
  "classe": "A1",
  "glide": 0,
  "statut": "phase-down en cours",
  "compo": "CH2FCF3",
  "desc": "Standard actuel",
  "table": [
   {
    "t": -40,
    "p": 0.512
   },
   {
    "t": -30,
    "p": 0.844
   },
   {
    "t": -20,
    "p": 1.327
   },
   {
    "t": -10,
    "p": 2.006
   },
   {
    "t": 0,
    "p": 2.928
   },
   {
    "t": 10,
    "p": 4.146
   },
   {
    "t": 20,
    "p": 5.717
   },
   {
    "t": 30,
    "p": 7.702
   },
   {
    "t": 40,
    "p": 10.166
   },
   {
    "t": 50,
    "p": 13.179
   }
  ]
 },
 "R404A": {
  "nom": "R-404A",
  "cat": "Mélange",
  "gwp": 3922,
  "classe": "A1",
  "glide": 0.5,
  "statut": "restreint F-Gas",
  "compo": "R125/R143a/R134a",
  "desc": "Froid negatif EN RESTRICTION",
  "table": [
   {
    "t": -40,
    "p": 1.353
   },
   {
    "t": -30,
    "p": 2.078
   },
   {
    "t": -20,
    "p": 3.071
   },
   {
    "t": -10,
    "p": 4.391
   },
   {
    "t": 0,
    "p": 6.102
   },
   {
    "t": 10,
    "p": 8.271
   },
   {
    "t": 20,
    "p": 10.971
   },
   {
    "t": 30,
    "p": 14.284
   },
   {
    "t": 40,
    "p": 18.295
   },
   {
    "t": 50,
    "p": 23.109
   }
  ]
 },
 "R407C": {
  "nom": "R-407C",
  "cat": "Mélange",
  "gwp": 1624,
  "classe": "A1",
  "glide": 6.1,
  "statut": "phase-down en cours",
  "compo": "R32/R125/R134a",
  "desc": "Retrofit R22",
  "table": [
   {
    "t": -40,
    "p": 1.203
   },
   {
    "t": -30,
    "p": 1.871
   },
   {
    "t": -20,
    "p": 2.799
   },
   {
    "t": -10,
    "p": 4.047
   },
   {
    "t": 0,
    "p": 5.679
   },
   {
    "t": 10,
    "p": 7.764
   },
   {
    "t": 20,
    "p": 10.376
   },
   {
    "t": 30,
    "p": 13.59
   },
   {
    "t": 40,
    "p": 17.489
   },
   {
    "t": 50,
    "p": 22.159
   }
  ]
 },
 "R410A": {
  "nom": "R-410A",
  "cat": "Mélange",
  "gwp": 2088,
  "classe": "A1",
  "glide": 0.1,
  "statut": "phase-down en cours",
  "compo": "R32/R125",
  "desc": "PAC/Clim RESTRICTION FUTURE",
  "table": [
   {
    "t": -40,
    "p": 1.755
   },
   {
    "t": -30,
    "p": 2.703
   },
   {
    "t": -20,
    "p": 4.007
   },
   {
    "t": -10,
    "p": 5.746
   },
   {
    "t": 0,
    "p": 8.007
   },
   {
    "t": 10,
    "p": 10.883
   },
   {
    "t": 20,
    "p": 14.475
   },
   {
    "t": 30,
    "p": 18.891
   },
   {
    "t": 40,
    "p": 24.256
   },
   {
    "t": 50,
    "p": 30.711
   }
  ]
 },
 "R448A": {
  "nom": "R-448A",
  "cat": "Mélange",
  "gwp": 1273,
  "classe": "A1",
  "glide": 5.5,
  "statut": "phase-down en cours",
  "compo": "R32/R125/R1234yf/R134a/R1234ze",
  "desc": "Rempl. R404A",
  "table": [
   {
    "t": -40,
    "p": 1.24
   },
   {
    "t": -30,
    "p": 1.91
   },
   {
    "t": -20,
    "p": 2.83
   },
   {
    "t": -10,
    "p": 4.05
   },
   {
    "t": 0,
    "p": 5.63
   },
   {
    "t": 10,
    "p": 7.62
   },
   {
    "t": 20,
    "p": 10.1
   },
   {
    "t": 30,
    "p": 13.12
   },
   {
    "t": 40,
    "p": 16.78
   }
  ]
 },
 "R449A": {
  "nom": "R-449A",
  "cat": "Mélange",
  "gwp": 1282,
  "classe": "A1",
  "glide": 5.3,
  "statut": "phase-down en cours",
  "compo": "R32/R125/R1234yf/R134a",
  "desc": "Rempl. R404A",
  "table": [
   {
    "t": -40,
    "p": 1.252
   },
   {
    "t": -30,
    "p": 1.928
   },
   {
    "t": -20,
    "p": 2.855
   },
   {
    "t": -10,
    "p": 4.083
   },
   {
    "t": 0,
    "p": 5.674
   },
   {
    "t": 10,
    "p": 7.688
   },
   {
    "t": 20,
    "p": 10.19
   },
   {
    "t": 30,
    "p": 13.25
   },
   {
    "t": 40,
    "p": 16.94
   }
  ]
 },
 "R454B": {
  "nom": "R-454B",
  "cat": "Mélange",
  "gwp": 467,
  "classe": "A2L",
  "glide": 1.3,
  "statut": "autorisé",
  "compo": "R32/R1234yf",
  "desc": "Rempl. R410A",
  "table": [
   {
    "t": -40,
    "p": 1.5
   },
   {
    "t": -20,
    "p": 3.6
   },
   {
    "t": 0,
    "p": 7.3
   },
   {
    "t": 20,
    "p": 13.2
   },
   {
    "t": 40,
    "p": 22
   }
  ]
 },
 "R454C": {
  "nom": "R-454C",
  "cat": "Mélange",
  "gwp": 148,
  "classe": "A2L",
  "glide": 5.8,
  "statut": "autorisé",
  "compo": "R32/R1234yf",
  "desc": "Bas GWP",
  "table": [
   {
    "t": -40,
    "p": 1.05
   },
   {
    "t": -20,
    "p": 2.55
   },
   {
    "t": 0,
    "p": 5.35
   },
   {
    "t": 20,
    "p": 9.85
   },
   {
    "t": 40,
    "p": 16.5
   }
  ]
 },
 "R513A": {
  "nom": "R-513A",
  "cat": "Mélange",
  "gwp": 573,
  "classe": "A1",
  "glide": 0,
  "statut": "autorisé",
  "compo": "R1234yf/R134a",
  "desc": "Rempl. R134a",
  "table": [
   {
    "t": -40,
    "p": 0.458
   },
   {
    "t": -20,
    "p": 1.15
   },
   {
    "t": 0,
    "p": 2.475
   },
   {
    "t": 20,
    "p": 4.768
   },
   {
    "t": 40,
    "p": 8.43
   }
  ]
 },
 "R1234yf": {
  "nom": "R-1234yf",
  "cat": "HFO",
  "gwp": 1,
  "classe": "A2L",
  "glide": 0,
  "statut": "autorisé",
  "compo": "CF3CF=CH2",
  "desc": "Auto rempl. R134a",
  "table": [
   {
    "t": -40,
    "p": 0.565
   },
   {
    "t": -30,
    "p": 0.9
   },
   {
    "t": -20,
    "p": 1.377
   },
   {
    "t": -10,
    "p": 2.034
   },
   {
    "t": 0,
    "p": 2.914
   },
   {
    "t": 10,
    "p": 4.062
   },
   {
    "t": 20,
    "p": 5.527
   },
   {
    "t": 30,
    "p": 7.362
   },
   {
    "t": 40,
    "p": 9.622
   },
   {
    "t": 50,
    "p": 12.367
   }
  ]
 },
 "R1234ze": {
  "nom": "R-1234ze",
  "cat": "HFO",
  "gwp": 1,
  "classe": "A2L",
  "glide": 0,
  "statut": "autorisé",
  "compo": "CF3CH=CHF",
  "desc": "Chillers",
  "table": [
   {
    "t": -40,
    "p": 0.367
   },
   {
    "t": -30,
    "p": 0.611
   },
   {
    "t": -20,
    "p": 0.969
   },
   {
    "t": -10,
    "p": 1.474
   },
   {
    "t": 0,
    "p": 2.166
   },
   {
    "t": 10,
    "p": 3.084
   },
   {
    "t": 20,
    "p": 4.273
   },
   {
    "t": 30,
    "p": 5.783
   },
   {
    "t": 40,
    "p": 7.665
   },
   {
    "t": 50,
    "p": 9.972
   }
  ]
 },
 "R290": {
  "nom": "R-290",
  "cat": "Naturel",
  "gwp": 3,
  "classe": "A3",
  "glide": 0,
  "statut": "autorisé",
  "compo": "Propane",
  "desc": "INFLAMMABLE",
  "table": [
   {
    "t": -40,
    "p": 1.111
   },
   {
    "t": -30,
    "p": 1.678
   },
   {
    "t": -20,
    "p": 2.445
   },
   {
    "t": -10,
    "p": 3.453
   },
   {
    "t": 0,
    "p": 4.745
   },
   {
    "t": 10,
    "p": 6.366
   },
   {
    "t": 20,
    "p": 8.365
   },
   {
    "t": 30,
    "p": 10.79
   },
   {
    "t": 40,
    "p": 13.694
   },
   {
    "t": 50,
    "p": 17.133
   }
  ]
 },
 "R600a": {
  "nom": "R-600a",
  "cat": "Naturel",
  "gwp": 3,
  "classe": "A3",
  "glide": 0,
  "statut": "autorisé",
  "compo": "Isobutane",
  "desc": "INFLAMMABLE",
  "table": [
   {
    "t": -40,
    "p": 0.287
   },
   {
    "t": -30,
    "p": 0.466
   },
   {
    "t": -20,
    "p": 0.725
   },
   {
    "t": -10,
    "p": 1.085
   },
   {
    "t": 0,
    "p": 1.57
   },
   {
    "t": 10,
    "p": 2.206
   },
   {
    "t": 20,
    "p": 3.022
   },
   {
    "t": 30,
    "p": 4.047
   },
   {
    "t": 40,
    "p": 5.312
   }
  ]
 },
 "R717": {
  "nom": "R-717",
  "cat": "Naturel",
  "gwp": 0,
  "classe": "B2L",
  "glide": 0,
  "statut": "autorisé",
  "compo": "NH3",
  "desc": "TOXIQUE",
  "table": [
   {
    "t": -40,
    "p": 0.716
   },
   {
    "t": -30,
    "p": 1.194
   },
   {
    "t": -20,
    "p": 1.9
   },
   {
    "t": -10,
    "p": 2.906
   },
   {
    "t": 0,
    "p": 4.292
   },
   {
    "t": 10,
    "p": 6.148
   },
   {
    "t": 20,
    "p": 8.57
   },
   {
    "t": 30,
    "p": 11.665
   },
   {
    "t": 40,
    "p": 15.545
   },
   {
    "t": 50,
    "p": 20.33
   }
  ]
 },
 "R744": {
  "nom": "R-744",
  "cat": "Naturel",
  "gwp": 1,
  "classe": "A1",
  "glide": 0,
  "statut": "autorisé",
  "compo": "CO2",
  "desc": "Transcritique",
  "table": [
   {
    "t": -56,
    "p": 5.306
   },
   {
    "t": -46,
    "p": 8.002
   },
   {
    "t": -36,
    "p": 11.607
   },
   {
    "t": -26,
    "p": 16.293
   },
   {
    "t": -16,
    "p": 22.237
   },
   {
    "t": -6,
    "p": 29.632
   },
   {
    "t": 4,
    "p": 38.688
   },
   {
    "t": 14,
    "p": 49.658
   },
   {
    "t": 24,
    "p": 62.877
   }
  ]
 }
};
