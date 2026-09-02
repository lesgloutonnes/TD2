# TD2 Gear Builder

Loadout planner for **Tom Clancy's The Division 2**.

Fan-made, 100% in the browser: brands, gear sets, named pieces, exotics, weapons, skills, specialization, bonus totals, and URL sharing.

## What this is (and is not)

**This is a gear builder.** Plan cores, attributes, talents, mods, Prototype, and expertise, then go farm the pieces in-game and validate feel at the **shooting range**.

**This is not a DPS calculator.** Live damage depends on enemy type, armor plates, cover, distance, talent uptime, skill interaction, directives, and much more. Those factors will not be simulated here on purpose — the range is the right place to compare damage.

The optional **build index** in Analysis is only a relative stack comparison (weapon damage × type × crit × headshot × DtA/DtH). It is not DPS and should not be treated as one.

The **Include maxed bonuses** toggle (off by default) adds stacks, procs, and conditional bonuses at their **maximum** so you can compare the flat sheet vs the fully stacked/procced sheet. Example: Striker 4pc at 100 stacks / +65% Weapon Damage (200 stacks with the chest talent, 1%/stack with the backpack). Hard rolls — cores, attributes, mods, brand 1–3pc, set 2–3pc, and always-on talents like Glass Cannon — always apply.

## Run without npm (Windows)

Double-click **`lancer-builder.bat`**.

That opens http://localhost:3000 in the browser. No Node/npm install: Windows PowerShell serves the **already-built snapshot** in `www/`. Source changes in `src/` only show up here after `npm run build` (that command refreshes `www/`). Leave the black window open while you use the builder, then close it to stop.

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
- Per-piece / per-weapon expertise (Prototype locks Expertise at 30)
- Per-skill expertise (this skill only)
- Gear mod slots on mask / chest / backpack (Chill Out: 2 mods + 1 random secondary attribute); gloves / holster / kneepads have none
- Weapon mods: optic / magazine / muzzle / underbarrel (pistols: optic + muzzle); Optimized ×1.3
- High-end weapons with a talent picker (named / exotic talents stay locked)
- Analysis uses the **active weapon** (primary / secondary / sidearm): expertise, mods, talent, Prototype Augment
- Skill attachment mods per skill family (Extra Ammo / Payload, Skill Health, Damage…) — skill-local, never character-wide
- Brand / named / gear-set cores recalibratable (Chill Out native blue, unlocked); most exotic cores locked (Investor flexible; Memento 3-core package locked; Sawyer's Kneepads blue locked)
- Named unique talents and special attributes stay locked; bonus cores shown as locked extras
- Weapons as tooltip-style tiles (named & exotic first; High-End filter): hover tooltip with talent, RPM, mag, mods
- Skills as tiles (phone-friendly picker)
- Gear mod pool includes Bleed / Burn / Shock / Disrupt / Blind / Ensnare resistances
- Augment curves: Quantum / Amalgam / Anomaly / Synesthesia from Ubisoft Y8S1.3 notes; others community approx.
- Armor model: flat piece armor + blue cores (editable roll, default max) + Total Armor %
- Main cores default to max but can be lowered; Prototype scales cores ×1.5 including Skill Tier (1 → 1.5)
- Armor Regeneration: flat HP/s on gear attributes (max 4,925) + brand/set % of total armor
- Health: flat on gear attributes (max 18,935) + Bonus Health % (SHD / sets)
- Armor on Kill / Incoming Repairs: gear **mods** and brand/set bonuses (not secondary attribute rolls)
- Include maxed bonuses (toggle, off by default): stacks / procs / conditionals at maximum for comparison
- SHD Watch panel (toggle, then scale each line 0–max)
- Y8S3 **Under Pressure** season modifier (toggle, 1 active + 3 passives, assumed pressure on the sheet)
- Specialization perks (sheet stats on by default; optional weapon-type +5% nodes off until checked)
- NinjaBike: 3 locked cores (red + blue + yellow) and +1 piece for each brand/set already equipped
- Build index (relative stack compare — **not DPS**)
- Local save (overwrite / save as / rename) and share link
- Saved builds pinned at the top
- Compare a saved build vs current — deltas in Analysis

Not affiliated with Ubisoft.
