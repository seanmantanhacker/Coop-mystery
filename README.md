# Operation: Zero Hour

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![Multiplayer](https://img.shields.io/badge/WebRTC-PeerJS%20P2P-orange.svg)](https://peerjs.com/)
[![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

An atmospheric, 3D point-and-click cooperative escape room game built entirely in client-side JavaScript. Inspired by *The Room*, *Rusty Lake*, and *Keep Talking and Nobody Explodes*.

---

## 🎯 Overview

In **Operation: Zero Hour**, three operatives must communicate and collaborate in real time to disarm high-stakes countdown mechanisms across two distinct, richly detailed 3D levels.

The game is **100% serverless and client-side**:
- **3D Graphics**: Built using [Three.js](https://threejs.org/) r128 with procedural textures, dynamic lighting, voltage flicker, and cinematic inspection camera transitions. Zero external 3D asset downloads required.
- **P2P Multiplayer**: Powered by [PeerJS](https://peerjs.com/) WebRTC star topology with an automatic `BroadcastChannel` local fallback for instant zero-config multi-tab testing.
- **Synthesized Audio**: Real-time sound effects and atmospheric drones generated on the fly via the browser's native **Web Audio API** (relay clicks, geiger ticks, voltage hum, clockwork escapement bells, wire cutters, warning klaxons).

---

## 🕹️ Asymmetric Operative Roles

Three players take on unique, complementary responsibilities with asymmetric information:

| Role | Station & View | Responsibilities |
| :--- | :--- | :--- |
| 💣 **Operative 1: Field Defuser** | Interactive 3D Room Environment | Physically trapped in the sealed chamber. Inspects 3D contraptions, clips physical catenary wires, presses Soviet keypad glyphs, turns dials, balances quicksilver vials, and disengages clockwork brakes. |
| 📜 **Operative 2: Manual Specialist** | Warm-lit Detective Desk | Inspects classified technical binders (*Silo 44 Ordnance Spec 4.2*) or Lord Blackwood's occult folios (*Liber Hermeticus*). Translates complex puzzle rules and guides the Defuser through conditional matrices. |
| 📡 **Operative 3: Intel Analyst** | SIGINT Surveillance Console | Monitors CRT telemetry and live carrier oscilloscopes. Relays crucial serial numbers, battery counts, and frequency targets to the Specialist. Controls an emergency spring-loaded missile toggle switch / steam release valve (+30s boost). |

---

## 🗺️ Operation Levels & Puzzles

Before deployment, the Mission Commander (Host) selects the target operation level in the lobby:

### Level 1: "Silo 44: The Cold War Thermobaric Incident" (1983)
- **Setting**: A subterranean Soviet nuclear bunker in the Kola Peninsula. Operative 1 is locked in Chamber 4-B with the *Iskra-7* aerosolized thermobaric warhead failsafe countdown.
- **Atmosphere**: Concrete walls, reinforced blast door with locking wheel, corrugated galvanized steel ceiling, HVAC ventilation ducts, heavy steel workbench, toolbox, overhead cage pendant lamp with brownout voltage flicker, wall clipboard, and radio shelf.
- **Puzzles**:
  1. **Catenary 3D Wires**: 5 curved 3D wires severed via interactive raycasting conditioned on serial parity, battery count, and color distribution.
  2. **Soviet Cyrillic Keypad**: Mechanical keypad requiring buttons to be pressed in exact decrypt matrix order.
  3. **Radio Carrier Sweeper**: Analog knurled dial requiring frequency matching with the Analyst's carrier oscilloscope.
  4. **Simon Says Light Array**: Flashing colored glass domes conditioned on strikes incurred and vowel presence.
  5. **Emergency Coolant Switch**: Flip-guarded missile toggle switch operated by the Intel Analyst (+30s stabilization).

### Level 2: "The Alchemist's Study: Lord Blackwood's Clockwork Crypt" (1888)
- **Setting**: A Gothic Victorian manor scriptorium sealed by an occult brotherhood with phosgene nerve gas and the ticking *Athanor Horologium*.
- **Atmosphere**: Dark oak wainscoting and damask wallpaper, coffered ceiling, Gothic lancet arched window overlooking dynamic storm lightning, carved stone fireplace with flickering firelight, antique grandfather clock with animated brass pendulum, 3-bay bookshelves with over 400 books, mahogany desk, banker's lamp, tufted armchair, and grimoire lectern.
- **Puzzles**:
  1. **Astrological Zodiac Rings**: 3 concentric brass rings aligning astrological Houses, Planetary Rulers (direct/retrograde), and Triplicity Elements.
  2. **Quicksilver Manometer**: 3 glass vials balanced to a 3:2:1 hydrostatic ratio with temperature thermal corrections.
  3. **Optical Prism Array**: Refraction of celestial arc beams through rotating crystal gimbals to hit target wavelength sensors.
  4. **Clockwork Escapement**: Deadman brake disengaged precisely during the designated grandfather clock chime harmonic.
  5. **Valve of Hermes**: Emergency counterweight seal release lever operated by the Intel Analyst (+30s neutralizer).

---

## 🚀 Quickstart & Local Play

### 1. Start Local HTTP Server
Clone the repository and start any standard local HTTP server from the project directory:

```bash
# Using Python 3:
python -m http.server 8000

# OR using Node.js:
npx serve -p 8000
```

### 2. Connect Players
Open **3 browser tabs or windows** to [`http://localhost:8000`](http://localhost:8000):

1. **Tab 1 (Mission Commander / Host)**:
   - Enter Room Code (e.g., `ALPHA`).
   - Select desired level (**Silo 44** or **The Alchemist's Study**).
   - Click **CREATE ROOM (HOST)**.
   - Click **SELECT DEFUSER** (Operative 1).
2. **Tab 2 (Client 1)**:
   - Enter Room Code `ALPHA`.
   - Click **JOIN ROOM**.
   - Note that map selection is automatically locked to the Host's choice and the Defuser station is marked `CLAIMED: HOST`.
   - Click **SELECT MANUAL** (Operative 2).
3. **Tab 3 (Client 2)**:
   - Enter Room Code `ALPHA`.
   - Click **JOIN ROOM**.
   - Click **SELECT INTEL** (Operative 3).
4. When all 3 stations are manned, the live readiness badge turns green (`3 / 3 OPERATIVES READY`).
5. The Host clicks **🚀 LAUNCH OPERATION (3/3 READY)** to deploy all 3 players synchronously!

---

## ⌨️ Controls & Navigation

- **Mouse Left-Click**:
  - Click objects in the 3D room to inspect (Bomb, Schematic Clipboard, Radio Shelf, Blast Door Keypad, Astrolabe, Clock, Grimoire).
  - Click wires to cut, dials to rotate, keypad buttons to depress.
  - Click binder tabs and dossier monitors to open specialized views.
- **Step Back Navigation** (4 redundant options):
  - Click the floating **← STEP BACK** button at the top-right of any inspection view.
  - Click the dedicated red **[ ✕ CLOSE ]** button inside any modal window.
  - Click anywhere on the dark backdrop outside the modal card.
  - Press the <kbd>Escape</kbd> key on your keyboard.
- **Sound Toggle**:
  - Click the **🔊 SOUND ON / MUTE** button in the top navigation bar anytime.

---

## 📁 Project Structure

```text
├── index.html                   # Main entrypoint and UI screens (Lobby, Defuser, Manual, Intel)
├── style.css                    # Retro cyber/steampunk stylesheets, CRT scanlines, and layouts
├── README.md                    # Project documentation
├── .gitignore                   # Git hygiene rules
├── docs/
│   └── narrative_scenarios.md   # Complete narrative lore, scenario briefs, and environmental story docs
├── src/
│   ├── audio.js                 # Web Audio API procedural synthesizer
│   ├── bomb3d.js                # Three.js main 3D engine, camera director, and raycasting
│   ├── environment_manager.js   # Dynamic scene manager for switching 3D level environments
│   ├── game.js                  # Authoritative state machine, timer, strikes, and mission logic
│   ├── intel_view.js            # Operative 3 CRT surveillance console & live oscilloscope
│   ├── manual_view.js           # Operative 2 visual classified binder & grimoire folios
│   ├── network.js               # PeerJS WebRTC P2P mesh & BroadcastChannel fallback
│   ├── silo44_env.js            # Map 1: Cold War bunker 3D architecture, props, and lighting
│   ├── alchemist_env.js         # Map 2: Victorian manor library 3D architecture, props, and lighting
│   ├── textures.js              # Procedural canvas textures (hazard stripes, metal, parchment, wood)
│   └── modules/                 # Puzzle mechanics and logic
│       ├── wires.js             # Catenary 3D wire severing logic
│       ├── keypad.js            # Soviet Cyrillic keypad glyph decryption
│       ├── frequency.js         # Analog radio carrier frequency matcher
│       ├── simon.js             # 4-stage blinking light array sequence
│       ├── zodiac.js            # Concentric astrological zodiac rings
│       ├── mercury.js           # Quicksilver hydrostatic ratio balancing
│       ├── prism.js             # Optical Snell dispersion crystal refractors
│       └── escapement.js        # Grandfather clock chime harmonic escapement
└── tests/
    ├── README.md                # Automated test execution guide
    ├── network_roles.test.js    # Multi-tab P2P role locking & roster sync tests (Chrome CDP)
    ├── navigation_framing.test.js # Camera framing & 4-way step-back navigation tests
    └── map_levels.test.js       # Level isolation & HUD verification tests
```

---

## 🧪 Automated Testing

The project includes an end-to-end integration test suite using Chrome DevTools Protocol (CDP):

```bash
# Run multi-tab P2P networking & role locking test:
node tests/network_roles.test.js

# Run camera framing & navigation return test:
node tests/navigation_framing.test.js

# Run level isolation & HUD badge test:
node tests/map_levels.test.js
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.