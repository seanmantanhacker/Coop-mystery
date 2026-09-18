---
name: create-escape-map
description: >-
  Comprehensive guide and architectural blueprint for creating and integrating
  new 3D co-op escape room maps and puzzle modules in Operation: Zero Hour.
  Covers Three.js environments, 4-module puzzle logic, 3-role asymmetric
  information splits, audio synthesizers, and PeerJS network synchronization.
---

# Operation: Zero Hour - Map Creation Architecture & Workflow

Use this skill whenever tasked with creating a new map/level, adding new puzzle modules, or expanding game scenarios in *Operation: Zero Hour*.

---

## 1. Core Architecture Anatomy

Every map requires coordinates across 5 interconnected layers:

```
                      ┌────────────────────────────────────────┐
                      │          GAME ENGINE (game.js)         │
                      │  Timer • Scenario ID • Victory State   │
                      └──────────────────┬─────────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     ▼                                   ▼                                   ▼
[OPERATIVE 1: DEFUSER]          [OPERATIVE 2: MANUAL]               [OPERATIVE 3: INTEL]
Three.js 3D Environment        Binder Detective Desk               Surveillance Console
- Environment Class             - Tabs in manual_view.js            - Dossier Telemetry
- 4 Module Props & Splines      - Cryptic Decoding Tables           - Live CRT Oscilloscope/Sensor
- Click/Touch Raycasting        - Step-by-Step Rules                - Single-Use Math Override (+2m)
```

---

## 2. Step-by-Step Map Creation Checklist

### Step 1: Define Map Lore, Palette, and Audio Signature
- **Theme**: Era, location, and stakes (e.g. Soviet Bunker, Victorian Crypt, Cyberpunk Submarine).
- **Aesthetic Palette**:
  - Primary UI colors (`--color-primary`, border glows).
  - 3D lighting atmosphere (e.g. Cold War green CRT + emergency amber, or Victorian brass + fireplace flickers).
- **Audio Synthesizer Signature** (`src/audio.js`):
  - Mechanical ticks (`playClockTick`), clicks, buzzers, and disarmed chimes.

### Step 2: Build the 3D Room & Camera Director (`src/<map>_env.js`)
1. Create a class `class MyNewEnvironment`:
   - `constructor(scene)`: Initialize `this.group = new THREE.Group()`, `this.hotspots = []`.
   - `cameraPresets`: Define `OVERVIEW`, plus one inspect preset per module:
     ```javascript
     this.cameraPresets = {
       OVERVIEW: { pos: new THREE.Vector3(0, 2.5, 4.5), target: new THREE.Vector3(0, 1.1, 0), fov: 50, label: 'ROOM OVERVIEW' },
       INSPECT_MODULE1: { pos: new THREE.Vector3(-1.2, 1.4, 0.4), target: new THREE.Vector3(-1.2, 1.0, 0), fov: 38, label: 'MODULE 1' },
       // ...
     };
     ```
2. Build physical room geometry (walls, floor grates, lighting fixtures, dynamic shadows).
3. Place interactive hotspot rings (`createHotspotRing(targetView, position, label)`).
4. Register the new environment inside `EscapeRoomEnvironmentManager.loadMap(mapId)` in `src/environment_manager.js`.

### Step 3: Implement 4 Deterministic Puzzle Modules (`src/modules/<puzzle>.js`)
Each module must be a standalone class stored on `window.<moduleName>`:
```javascript
class MyPuzzleModule {
  constructor() {
    this.id = 'my_puzzle';
    this.disarmed = false;
  }
  generate(seed, params) {
    this.disarmed = false;
    // 1. Procedurally generate state using seed
    // 2. Ensure deterministic solution matching the manual
  }
  interact(input) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };
    if (isCorrect) {
      this.disarmed = true;
      if (window.audio) window.audio.playDisarmed();
      game.checkVictory();
      return { status: 'DISARMED' };
    } else {
      if (window.audio) window.audio.playStrike();
      game.addStrike();
      return { status: 'STRIKE' };
    }
  }
}
```

### Step 4: Write Manual Specialist Binder Pages (`src/manual_view.js`)
1. Add tab button in `renderTabs()`.
2. Write concise, mysterious, yet unambiguous rule pages in `renderPage()`:
   - **Do not over-explain or spoil**: Follow the *Clue Brevity Invariant* (e.g. "Table 1: with vowel, Table 2: no vowel").
   - **Zero Dead Rules**: Every rule stated must genuinely affect a puzzle; never put fake rules for cosmetic features.

### Step 5: Update Intel Analyst Console (`src/intel_view.js`)
1. Configure live sensor readouts in `updateDossierData()`:
   - Target frequency, wavelength, atmospheric pressure, or rune telemetry.
2. Render visual signal canvas (Oscilloscope, Ephemeris, or Sonar grid).
3. Connect the **Emergency Override Math Terminal**:
   - Single-use per mission.
   - Procedural arithmetic equation (`generateMathProblem()`).
   - Entering correct answer unlocks the lever to add **+2:00 (+120s)** Detonation Clock extension.
   - Synchronized across players via PeerJS broadcast `OVERRIDE_ACTIVATED`.

### Step 6: Register in Central Game Engine (`src/game.js` & `index.html`)
1. Add scenario card in `index.html` under `#scenario-selection-box` with:
   - Title, badge, description, and base timer (e.g. `⏱️ 08:00 Base`).
2. Update `selectScenario(scenarioId)` and `generateMissionSpecs(seed)` in `src/game.js`:
   - Set starting timer seconds (`this.timerSeconds = ...`).
   - Trigger generation for all 4 modules.
3. Update `checkVictory()` in `src/game.js`:
   - Verify that all 4 modules return `disarmed === true`.
   - Broadcast `MISSION_VICTORY` and trigger end-game modal.

---

## 3. Communication & Co-op Rules Matrix

Every puzzle MUST require cross-role communication:
| Puzzle Type | Defuser (What they see) | Intel Analyst (What they see) | Manual Specialist (What they read) |
| :--- | :--- | :--- | :--- |
| **Observation** | Physical inputs, dials, wires | Telemetry values, serial number | Decryption tables, conditional logic |
| **Feedback** | Sound cues, LED status | Signal phase lock, waveform match | Step sequence and mistake warnings |
| **Emergency** | Active countdown timer | Math calculation & release lever | Lore memos & emergency protocol tips |
