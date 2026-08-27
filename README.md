# TD2 Gear Builder

Planificateur de builds pour **Tom Clancy's The Division 2**.

Outil fan-made, 100 % dans le navigateur : marques, gear sets, pièces nommées, exotiques, armes, compétences, spécialisation, calcul des bonus et partage par URL.

## Lancer sans npm (Windows)

Double-cliquez sur **`lancer-builder.bat`**.

Ça ouvre http://localhost:3000 dans le navigateur. Aucun Node/npm à installer : Windows PowerShell sert le site déjà généré dans `www/`. Laissez la fenêtre noire ouverte tant que vous jouez avec le builder, puis fermez-la pour arrêter.

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
- 37 marques et 27 gear sets (valeurs live 2026)
- Nommés (The Gift, The Sacrifice, Contractor's Gloves, Fox's Prayer, Picaro's…)
- Exotiques (Coyote's Mask, Memento, NinjaBike, Catharsis…)
- Caps : CHC 60 %, paliers de compétence 6
- NinjaBike : +1 pièce pour chaque marque/set déjà équipé
- Presets : Striker, All Red, Heartbreaker, Skill DPS, Foundry, Hunter's Fury
- Sauvegarde locale et lien de partage

Non affilié à Ubisoft.
