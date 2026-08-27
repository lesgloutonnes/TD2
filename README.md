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
- Prototype quality switch (non-exotic) + 9 Augments with levels and stacking
- Per-piece / per-weapon expertise
- Armor model: flat piece armor + blue cores + Total Armor %
- Armor Regeneration: flat HP/s on gear attributes (max 4,925) + brand/set % of total armor
- Health: flat on gear attributes (max 18,935) + Bonus Health % (SHD / sets)
- Armor on Kill: % → flat amount in analysis
- Assumed uptime for common chest/backpack talents and major 4pc set bonuses
- Soft exotic assumptions (Memento stacks, Investor Slotted by attribute color)
- Caps: CHC 60%, Skill Tier 6
- NinjaBike: +1 piece for each brand/set already equipped
- Offense score (relative estimate, not DPS)
- Presets: Striker, All Red, Heartbreaker, Skill DPS, Foundry, Hunter's Fury
- Local save and share link

Not affiliated with Ubisoft.
