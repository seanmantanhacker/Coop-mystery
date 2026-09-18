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

### Step 2: Create Isolated Map Directory Structure (`src/maps/<mapId>/`)
Every map is completely self-contained in its own directory to guarantee that editing one map never impacts another:
```
src/maps/<mapId>/
├── <mapId>.css            # Map theme colors, HUD inspect panels, mobile responsive rules
├── <mapId>_config.js      # Map registration in window.ESCAPE_MAPS with timer, specs, victory
├── <mapId>_env.js         # 3D Three.js room geometry, lighting, camera presets, hotspot rings
├── <mapId>_manual.js      # Manual Specialist renderer (tabs, decoding tables, lore memos)
├── <mapId>_intel.js       # Intel Analyst renderer (CRT visualizer, telemetry dossier)
└── modules/               # 4 deterministic puzzle modules
    ├── module1.js
    ├── module2.js
    ├── module3.js
    └── module4.js
```

### Step 3: Implement 4 Deterministic Puzzle Modules (`src/maps/<mapId>/modules/`)
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

### Step 4: Build the 3D Room & Camera Director (`src/maps/<mapId>/<mapId>_env.js`)
1. Create class `<MapName>Environment`:
   - `constructor(scene)`: Initialize `this.group = new THREE.Group()`, `this.hotspots = []`.
   - `cameraPresets`: Define `OVERVIEW`, plus one inspect preset per module:
     ```javascript
     this.cameraPresets = {
       OVERVIEW: { pos: new THREE.Vector3(0, 2.5, 4.5), target: new THREE.Vector3(0, 1.1, 0), fov: 50, label: 'ROOM OVERVIEW' },
       INSPECT_MODULE1: { pos: new THREE.Vector3(-1.2, 1.4, 0.4), target: new THREE.Vector3(-1.2, 1.0, 0), fov: 38, label: 'MODULE 1' },
       // ...
     };
     ```
2. Build physical room geometry (walls, lighting, dynamic shadows).
3. Place interactive hotspot rings (`createHotspotRing(targetView, position, label)`).

### Step 5: Write Manual Specialist Pages (`src/maps/<mapId>/<mapId>_manual.js`)
Create `<MapName>ManualView` containing:
- `renderTabs()`: Tab bar with badge icons.
- `renderPage(pageKey)`: Clean, cryptic, unambiguous decryption tables and instructions.
- Follow the *Clue Brevity Invariant*: Zero dead rules, high communication clarity.
- Provide a `render(activePage)` entrypoint that injects into `#manual-content` and `#manual-tabs`.

### Step 6: Write Intel Analyst Console (`src/maps/<mapId>/<mapId>_intel.js`)
Create `<MapName>IntelView` containing:
- `render()`: Setup the dossier cards and visual sensor canvas (Oscilloscope, Ephemeris, Spectrophotometer, etc.).
- `update(specs, currentFreq)`: Refresh live sensor telemetry and canvas animation.
- Shared Emergency Override (+2m) is automatically hooked by the shared `IntelViewController`.

### Step 7: Register Map in `window.ESCAPE_MAPS` (`src/maps/<mapId>/<mapId>_config.js`)
Register the map object:
```javascript
window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};
window.ESCAPE_MAPS['my_map'] = {
  id: 'my_map',
  name: 'Operation Code Name',
  subtitle: 'Location / Threat Type',
  baseTimer: 480, // Base countdown in seconds
  getEnvClass: () => window.MyMapEnvironment,
  getManualRenderer: (controller) => new window.MyMapManualView(controller),
  getIntelRenderer: (controller) => new window.MyMapIntelView(controller),
  generateSpecs: (seed, game) => {
    // Generate mission specs & seed all 4 modules
    return { ... };
  },
  checkVictory: (game) => {
    // Return true if all 4 modules are disarmed
    return module1.disarmed && module2.disarmed && module3.disarmed && module4.disarmed;
  }
};
```

### Step 8: Load in `index.html`
1. Include `<link rel="stylesheet" href="src/maps/<mapId>/<mapId>.css">` in `<head>`.
2. Include the map scripts before shared controllers:
   ```html
   <!-- Map: My Map -->
   <script src="src/maps/<mapId>/modules/module1.js"></script>
   <script src="src/maps/<mapId>/modules/module2.js"></script>
   <script src="src/maps/<mapId>/modules/module3.js"></script>
   <script src="src/maps/<mapId>/modules/module4.js"></script>
   <script src="src/maps/<mapId>/<mapId>_env.js"></script>
   <script src="src/maps/<mapId>/<mapId>_manual.js"></script>
   <script src="src/maps/<mapId>/<mapId>_intel.js"></script>
   <script src="src/maps/<mapId>/<mapId>_config.js"></script>
   ```
3. Add the scenario card in the lobby scenario selector.

---

## 3. Communication & Co-op Rules Matrix

Every puzzle MUST require cross-role communication:
| Puzzle Type | Defuser (What they see) | Intel Analyst (What they see) | Manual Specialist (What they read) |
| :--- | :--- | :--- | :--- |
| **Observation** | Physical inputs, dials, wires | Telemetry values, serial number | Decryption tables, conditional logic |
| **Feedback** | Sound cues, LED status | Signal phase lock, waveform match | Step sequence and mistake warnings |
| **Emergency** | Active countdown timer | Math calculation & release lever | Lore memos & emergency protocol tips |
