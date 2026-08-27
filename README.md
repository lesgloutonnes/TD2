# TD2 Gear Builder

Planificateur de builds pour **Tom Clancy's The Division 2**.

Outil fan-made, 100 % dans le navigateur : marques, gear sets, pièces nommées, exotiques, armes, compétences, spécialisation, calcul des bonus et partage par URL.

## Lancer sans npm (Windows)

Double-cliquez sur **`lancer-builder.bat`**.

Ça ouvre http://localhost:3000 dans le navigateur. Aucun Node/npm à installer : Windows PowerShell sert le site déjà généré dans `www/`. Laissez la fenêtre noire ouverte tant que vous jouez avec le builder, puis fermez-la pour arrêter.

Si le navigateur affiche une **erreur 500**, mettez à jour `lancer-builder.ps1` (le premier serveur plantait en envoyant les fichiers). Relancez le `.bat` et regardez les lignes `ERREUR` dans la fenêtre noire.

Si Windows bloque le script : clic droit sur `lancer-builder.ps1` → Propriétés → Débloquer, ou :

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Lancer avec npm (développement)

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Fonctions

- 6 emplacements d'équipement + silhouette d'agent
- 37 marques et 28 gear sets (**live Y8S3 Red Horizon**, 27 août 2026)
- Nommés par marque (sheet 22/03/26 + Y8S3) : Chainkiller, Vigil, Backbone, The Setup, Bober, Equalizer…
- Exotiques (Vile, BTSU, Collector, Nurse's Kneepads, Investor, Blacklisters, Caduceus, Ouroboros…)
- Caps : CHC 60 %, paliers de compétence 6
- NinjaBike : +1 pièce pour chaque marque/set déjà équipé
- Presets : Striker, All Red, Heartbreaker, Skill DPS, Foundry, Hunter's Fury
- Sauvegarde locale et lien de partage

Non affilié à Ubisoft.
