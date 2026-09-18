# Operation: Zero Hour - Escape Room Game Design Rules

These rules govern the game design, UI/UX feel, role separation, and puzzle balancing in *Operation: Zero Hour*. All future maps, modules, and modifications must strictly conform to these rules.

---

## 1. Clue Brevity Invariant (Do Not Over-Explain)
- **Give hints, not walkthroughs**: Manual and lore pages must deliver concise, enigmatic clues rather than spelling out the exact solution logic.
- **Avoid verbose captions**: Prefer short, punchy instructions (e.g. *"Check the bomb serial number. Table 1: contains vowel. Table 2: no vowel"* instead of explaining the entire deduction process).
- **Let players experience the "Aha!" moment**: Mystery and deduction between teammates are the core fun of co-op escape rooms.

---

## 2. Zero Dead Rules Invariant
- **Never publish fake rules for cosmetic features**: Every rule printed in the Manual Specialist's binder MUST have an active mechanical impact in the game code.
- If a prop or readout is purely cosmetic (such as decorative battery cells or serial prefixes that don't alter puzzle paths), **do not** write conditional rules in the manual claiming they modify puzzle answers.
- Telemetry descriptions should clearly specify baseline ratings without implying false puzzle shifts.

---

## 3. Strict Asymmetric Role Dependency
- **No Solitary Puzzles**: Every single module must require active, verbal communication between at least two different operative stations:
  - *Defuser* has the physical tactile controls and current feedback.
  - *Manual Specialist* has the decoding tables, matrices, and conditional rules.
  - *Intel Analyst* has the target telemetry, carrier waveforms, indicators, and environmental readings.
- A player sitting alone at any single station must NEVER have sufficient information on their screen to solve a puzzle by themselves.

---

## 4. Deterministic Solvability Guarantee
- **Unambiguous Subsets**: When generating randomized puzzles (e.g., Keypad symbols, Wires, Simon sequences, Astrolabe houses), the procedural generator MUST guarantee that:
  1. The generated combination matches exactly ONE valid solution in the manual.
  2. It never generates an impossible edge-case or a subset that matches zero columns.
- Always use algorithmic subset-checking during `module.generate(seed)` to guarantee solvability.

---

## 5. Single-Use Emergency Override Protocol
- **Locked behind an Active Challenge**: Emergency time bonuses (+2:00 to Detonation Clock) must not be free clicks; they must require the Intel Analyst to solve a real-time cryptographic or mathematical equation.
- **Strictly Single-Use**: Once triggered, the override lever is permanently discharged for that mission session (`overrideUsed = true`).
- **Global Synchronization**: Overrides must immediately broadcast `OVERRIDE_ACTIVATED` across PeerJS to update the countdown timers for all 3 players, trigger audio confirmation, and display toast alerts.

---

## 6. Atmosphere & Audio Integrity
- All sound effects must use client-side **Web Audio API** synthesizers (`SoundEngine` in `src/audio.js`) so the game remains zero-dependency and plays instantly offline.
- Every interactive element (clicks, dial turns, page flips, lever releases, wire cuts, buzzer errors, disarm chimes) MUST trigger tactile audio feedback.
