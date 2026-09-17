# Automated Integration Tests

This directory contains automated end-to-end integration tests using Google Chrome DevTools Protocol (CDP) and WebSocket to verify the game logic, 3D rendering, asymmetric co-op, and WebRTC peer synchronization.

## Prerequisites
1. Ensure the local HTTP server is running in the project root:
   ```bash
   python -m http.server 8000
   ```
2. Google Chrome installed at standard path (`C:\Program Files\Google\Chrome\Application\chrome.exe`).
3. Node.js v18+ (with native `fetch` and `WebSocket` support).

## Test Suites

### 1. Multi-Tab P2P Role Locking & Roster Synchronization
```bash
node tests/network_roles.test.js
```
- Spawns 3 concurrent, isolated headless Chrome instances simulating:
  - **Host (Tab 1)**: Creates room, locks scenario, claims Field Defuser.
  - **Client 1 (Tab 2)**: Joins room, verifies locked scenario, verifies Defuser claimed by Host, claims Manual Specialist.
  - **Client 2 (Tab 3)**: Joins room, verifies Defuser & Manual claimed, claims Intel Analyst.
- Tests station relinquishment, slot re-opening, readiness badge transitions (`3 / 3 OPERATIVES READY`), and synchronized mission deployment.

### 2. Camera Framing & Navigation Director
```bash
node tests/navigation_framing.test.js
```
- Verifies Silo 44 far-right inspection views (`INSPECT_RADIO`, `INSPECT_KEYPAD`) camera presets, ensuring no occlusion by HUD elements.
- Verifies all 4 return methods for Operative 2 (Manual Specialist) and Operative 3 (Intel Analyst):
  1. Floating top-right step back button.
  2. Dedicated internal modal close buttons.
  3. Modal backdrop click dismissal.
  4. Keyboard <kbd>Escape</kbd> key.

### 3. Level Selection & Session Isolation
```bash
node tests/map_levels.test.js
```
- Verifies that selecting Map 1 (Silo 44) or Map 2 (The Alchemist's Study) launches the game session exclusively into the chosen level.
- Confirms zero in-game map switching buttons exist during gameplay, with static read-only level indicator badges in the HUD and top session bar.
