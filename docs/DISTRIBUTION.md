# Distribution guide

How to publish ZONE OUT beyond GitHub Pages. Everything below uses the build
zip at `dist/zoneout-web.zip` — regenerate it after any game change with:

```powershell
Compress-Archive -Force -Path index.html,manifest.webmanifest,sw.js,icons -DestinationPath dist/zoneout-web.zip
```

---

## 1. itch.io (~20 minutes, biggest arcade audience)

1. Create an account at itch.io → **Upload new project**.
2. **Title:** ZONE OUT · **Project URL:** zoneout (or similar)
3. **Kind of project:** HTML — upload `dist/zoneout-web.zip`, tick
   **"This file will be played in the browser"**.
4. **Embed options:** viewport **480 × 720**, tick **Mobile friendly** and
   **Fullscreen button**. Orientation: portrait.
5. **Pricing:** "No payments" (or "$0 or donate" if you want a tip jar).
6. **Cover image:** use `og.png` (itch wants 630×500 — crop the left game
   panel). Upload the four `screenshots/*.jpg` as screenshots and
   `screenshots/gameplay.gif` too — GIFs autoplay on itch pages.
7. **Tags:** arcade, shoot-em-up, top-down, retro, pixel-art, co-op,
   high-score, browser, mobile.
8. Paste the page copy below, save as **Public**.

### Ready-made page copy

> **ZONE OUT** is a free top-down arcade run & gun in the spirit of the
> 1990s coin-op greats — one HTML file, no install, plays on desktop and
> phones.
>
> Fight through **seven areas** — metalworks, rust belt, a blackout sector
> lit only by your lamp and enemy searchlights, flooded docks, wasteland,
> a prison stockade, and a final carrier assault — each ending in a boss
> with destructible parts and its own tricks: a barge that floods the
> arena, a burrowing sand wyrm only vulnerable at the tail, a warden that
> cages you in rising walls, and more.
>
> Your energy meter **always drains** — grab cells to stay alive while you
> stack weapon power, juggle the twin shot and 3-way spread, and burn
> bosses down with the piercing flamer.
>
> - **Daily challenge:** everyone worldwide fights the same battlefield
>   each day, with a global leaderboard.
> - **2-player local co-op** (keyboard + gamepad).
> - Normal and Arcade (one-hit) difficulty, twin-stick option,
>   accessibility toggles.
> - Chain scoring, end-of-area bonus tallies, hi-score table.
>
> **Controls:** WASD move · Z/Space fire · X bomb · P pause — or touch /
> gamepad. Facing locks while firing, classic style.

---

## 2. Web portals (CrazyGames, Poki)

Both accept HTML5 submissions and pay ad revenue share, but **both require
integrating their JavaScript SDK** (ad breaks at natural pauses, loading
events) before a game is approved:

- CrazyGames: developer.crazygames.com — submit a build, then integrate
  their SDK when accepted for review.
- Poki: developers.poki.com — same flow, stricter curation, bigger traffic.

Natural ad-break hooks already in the game: game over, area-clear tally,
and the pause menu. Integration is roughly a day of work per portal — do it
after picking one, not speculatively.

---

## 3. Google Play (PWA wrapper)

The PWA already qualifies (manifest with id/screenshots/categories, service
worker, offline support, icons). The no-code path:

1. Go to **pwabuilder.com**, enter `https://adriandonohoe.github.io/ZoneOut/`.
2. It validates the manifest and generates a signed **Android (TWA)**
   package.
3. Upload that to a Google Play Console account (one-time $25 fee).
   Store listing assets: reuse `og.png`, the screenshots, and the icons.

iOS has no equivalent free path — installing from Safari's
**Add to Home Screen** is the supported route there.
