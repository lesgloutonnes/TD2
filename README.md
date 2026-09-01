# TD2 Gear Builder

Loadout planner for **Tom Clancy's The Division 2**.

Fan-made, 100% in the browser: brands, gear sets, named pieces, exotics, weapons, skills, specialization, bonus totals, and URL sharing.

## What this is (and is not)

**This is a gear builder.** Plan cores, attributes, talents, mods, Prototype, and expertise, then go farm the pieces in-game and validate feel at the **shooting range**.

**This is not a DPS calculator.** Live damage depends on enemy type, armor plates, cover, distance, talent uptime, skill interaction, directives, and much more. Those factors will not be simulated here on purpose — the range is the right place to compare damage.

The optional **build index** in Analysis is only a relative stack comparison (weapon damage × type × crit × headshot × DtA/DtH). It is not DPS and should not be treated as one.

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
- Prototype purple tint on gear/weapons (reverts to gold / set green when off)
- Prototype + Augment on non-exotic weapons (primary Augment stacks with gear)
- Per-piece / per-weapon expertise
- Gear mod slots on mask / chest / backpack (Chill Out: 2 mods + 1 random secondary attribute); gloves / holster / kneepads have none
- Weapon mods: optic / magazine / muzzle / underbarrel (pistols: optic + muzzle); Optimized ×1.3
- Skill attachment mods per skill family (Extra Ammo / Payload, Skill Health, Damage…)
- Brand / named / gear-set cores recalibratable (Chill Out native blue, unlocked); most exotic cores locked (Investor flexible; Memento and NinjaBike 3-core packages locked; Sawyer's Kneepads blue locked)
- Named unique talents and special attributes stay locked; bonus cores shown as locked extras
- Weapons listed by type then name in optgroups
- Gear mod pool includes Bleed / Burn / Shock / Disrupt / Blind / Ensnare resistances
- Augment curves: Quantum / Amalgam / Anomaly / Synesthesia from Ubisoft Y8S1.3 notes; others community approx.
- Armor model: flat piece armor + blue cores + Total Armor %
- Armor Regeneration: flat HP/s on gear attributes (max 4,925) + brand/set % of total armor
- Health: flat on gear attributes (max 18,935) + Bonus Health % (SHD / sets)
- Armor on Kill / Incoming Repairs: gear **mods** and brand/set bonuses (not secondary attribute rolls)
- Soft assumed notes for common talents / 4pc (planning aid only)
- Caps: CHC 60%, Skill Tier 6
- NinjaBike: 3 locked cores (red + blue + yellow) and +1 piece for each brand/set already equipped
- Build index (relative stack compare — **not DPS**)
- Presets: Striker, All Red, Heartbreaker, Skill build, Foundry, Hunter's Fury
- Local save and share link

Not affiliated with Ubisoft.
