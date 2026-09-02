<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TD2 Gear Builder — agent playbook

Fan-made in-browser loadout planner for **The Division 2**. Live season: **Y8S3 Red Horizon** (TU 2.34, 27 Aug 2026). This is a **sheet planner**, not a DPS calculator.

Domain rules live in `.cursor/rules/td2-*.mdc` (glob-attached). Read this file before dispatching sub-bots or editing `src/lib/data/`.

## Product constraints

- English in-game names. Keep existing `id` slugs.
- Always-on sheet stats go in brand/set bonuses, `extraStats`, or talent `passive`. Stacks/procs/conditionals go in `assumed` + `assumedNote` (gated by Include maxed bonuses).
- Combat-only effects (burn aura, mag refill, DR while sprinting) stay in notes. Do not invent DPS or uptime fudge as Weapon Damage unless the live talent is a flat WD buff.
- PvE numbers only. Conflict / PvP Dark Zone / Global PvP Balance tables are out of scope.
- Live official tables beat PTS. If a number is unpublished, leave the catalog as-is and say so — do not guess RPM/mag/caps.
- Meme seasonal gear (Oh Carol, Sleigher, Bell Ringer, Festive Delivery…) stays omitted.
- Do not edit `www/` or `README.md` unless the user asked for a launcher/docs refresh.

## Live sources (prefer in this order)

1. [The Division 2: Red Horizon](https://www.ubisoft.com/en-gb/game/the-division/the-division-2/news-updates/4mrYiFPIyKpzpoqshDQk80/the-division-2-red-horizon) — follow every HERE / PDF link.
2. Live gear/brand/talent PDF: https://ubi.li/4Yvr2 (*Red Horizon Gear Updates*, 24 Aug 2026).
3. [PTS patch notes](https://www.ubisoft.com/en-gb/game/the-division/the-division-2/news-updates/hdUs80E1Fc9nHAhckksLw/red-horizon-pts-patch-notes) and PTS PDF https://ubi.li/zdyhH — direction only; **do not ship PTS numbers that the live PDF omitted or changed**.
4. [PTS developer notes](https://www.ubisoft.com/en-gb/game/the-division/the-division-2/news-updates/1bxX2xFH9oRij6ylkyY1yZ/red-horizon-pts-developer-notes).
5. Community (Namu Gear 2.0 lvl 40, itemlevel) only to fill slots Ubisoft skipped. Cite them in the PR.

Search Ubisoft news for hotfixes after 27 Aug 2026 before assuming launch notes are still current.

## Parallel specialists (file ownership)

Dispatch **one bot per row**. Do not let two bots edit the same file. `calc.test.ts` is the exception: **append-only** (new `test…` function + one line in the `tests` array at the bottom). Never rewrite shared helpers.

| Specialist | Owns | Must not touch |
|---|---|---|
| Weapons | `src/lib/data/weapons.ts`, `he-weapons.ts`, `weapon-talents.ts`, `weapon-mods.ts` | brands, catalog, gear-sets, talents (gear), skills, season |
| Gear | `brands.ts`, `gear-sets.ts`, `catalog.ts`, `talents.ts`, `attributes.ts`, `core-lock.ts`, `augments.ts` | weapons, skills, season |
| Skills | `skills.ts`, `skill-mods.ts` | everything else in `data/` |
| Season | `season-modifiers.ts`; `SeasonActiveId` / `SeasonPassiveId` / `SeasonModifier` in `types.ts`; `SeasonPanel.tsx` only if a **new id** needs UI | weapon/gear/skill data |

Parent/lead: open PRs if a child cannot (this environment’s `gh` is read-only; `ManagePullRequest` is the write path). Do not merge specialist PRs unless the user asks. Land them **one after another** because all four append to `calc.test.ts`.

## After a catalog edit

1. `npm test` (`tsx src/lib/calc.test.ts`). Fix only assertions your data made obsolete.
2. Commit on a feature branch. Push `git push -u origin <branch>`.
3. Draft PR vs `main`, French title/body, old→new + sources. If `ManagePullRequest` is missing, push and return the compare URL — do not use `gh pr create`.
