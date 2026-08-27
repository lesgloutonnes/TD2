# TD2 Gear Builder

Loadout planner for **Tom Clancy's The Division 2**.

Fan-made, 100% in the browser: brands, gear sets, named pieces, exotics, weapons, skills, specialization, bonus calculation, and URL sharing.

## Run without npm (Windows)

Double-click **`lancer-builder.bat`**.

That opens http://localhost:3000 in the browser. No Node/npm install: Windows PowerShell serves the site already built in `www/`. Leave the black window open while you use the builder, then close it to stop.

If the browser shows an **HTTP 500**, update `lancer-builder.ps1` (the first server crashed while sending files). Rerun the `.bat` and look for `ERREUR` lines in the black window.

If Windows blocks the script: right-click `lancer-builder.ps1` → Properties → Unblock, or:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Run with npm (development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- 6 gear slots + agent silhouette
- 37 brands and 28 gear sets (**live Y8S3 Red Horizon**, 27 Aug 2026)
- Named items per brand (sheet 22/03/26 + Y8S3): Chainkiller, Vigil, Backbone, The Setup, Bober, Equalizer…
- Exotics (Vile, BTSU, Collector, Nurse's Kneepads, Investor, Blacklisters, Caduceus, Ouroboros…)
- Caps: CHC 60%, Skill Tier 6
- NinjaBike: +1 piece for each brand/set already equipped
- Presets: Striker, All Red, Heartbreaker, Skill DPS, Foundry, Hunter's Fury
- Local save and share link

Not affiliated with Ubisoft.
