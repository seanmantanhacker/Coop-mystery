/* ==========================================================================
   THREE.JS ESCAPE ROOM ENVIRONMENT MANAGER & CAMERA DIRECTOR
   Orchestrates Map 1 ('Silo 44') and Map 2 ('The Alchemist's Study')
   ========================================================================== */

class EscapeRoomEnvironmentManager {
  constructor(engine) {
    this.engine = engine;
    this.activeMapId = 'silo44'; // 'silo44' or 'alchemist'
    this.activeEnv = null;

    // Camera Director State
    this.currentView = 'OVERVIEW';
    this.cameraPos = new THREE.Vector3();
    this.cameraTarget = new THREE.Vector3();
    this.targetCameraPos = new THREE.Vector3();
    this.targetCameraTarget = new THREE.Vector3();
    this.targetFOV = 48;

    // Micro-Orbit / Inspection Interaction State
    this.isDragging = false;
    this.dragStart = new THREE.Vector2();
    this.orbitAngles = { azimuth: 0, elevation: 0 };
    this.baseOrbitAngles = { azimuth: 0, elevation: 0 };

    this.clock = new THREE.Clock();
  }

  loadMap(mapId) {
    if (this.activeEnv) {
      this.activeEnv.destroy();
      this.activeEnv = null;
    }

    this.activeMapId = mapId;

    let EnvClass = null;
    if (window.ESCAPE_MAPS && window.ESCAPE_MAPS[mapId]) {
      EnvClass = window.ESCAPE_MAPS[mapId].getEnvClass();
    }
    if (!EnvClass) {
      if (mapId === 'silo44') EnvClass = window.Silo44Environment;
      else if (mapId === 'alchemist') EnvClass = window.AlchemistStudyEnvironment;
      else if (mapId === 'morgue') EnvClass = window.MorgueEnvironment;
    }

    if (EnvClass) {
      this.activeEnv = new EnvClass(this.engine.scene);
      this.activeEnv.build();
    }
    this.setView('OVERVIEW', true);
  }

  setView(viewKey, immediate = false) {
    if (!this.activeEnv || !this.activeEnv.cameraPresets[viewKey]) return;

    this.currentView = viewKey;
    const preset = this.activeEnv.cameraPresets[viewKey];

    this.targetCameraPos.copy(preset.pos);
    this.targetCameraTarget.copy(preset.target);
    this.targetFOV = preset.fov;

    // Show hotspots in OVERVIEW and Room exploration views, hide during inspection to keep clean view
    if (this.activeEnv && this.activeEnv.hotspots) {
      this.activeEnv.hotspots.forEach(h => {
        h.visible = (viewKey === 'OVERVIEW' || viewKey === 'ROOM_1' || viewKey === 'ROOM_2' || viewKey === 'ROOM_3');
      });
    }

    // Reset inspection micro-orbit offsets
    this.orbitAngles.azimuth = 0;
    this.orbitAngles.elevation = 0;

    if (immediate) {
      this.engine.camera.position.copy(preset.pos);
      this.cameraPos.copy(preset.pos);
      this.cameraTarget.copy(preset.target);
      this.engine.camera.fov = preset.fov;
      this.engine.camera.updateProjectionMatrix();
      this.engine.camera.lookAt(preset.target);
    }

    // Update HUD overlays
    const backBtn = document.getElementById('btn-step-back');
    if (backBtn) {
      if (viewKey === 'OVERVIEW' || viewKey === 'ROOM_1' || viewKey === 'ROOM_2' || viewKey === 'ROOM_3') {
        backBtn.classList.add('hidden');
      } else if (this.activeMapId === 'levelnull' && (viewKey === 'INSPECT_BREAKER' || viewKey === 'INSPECT_HYDRO' || viewKey === 'INSPECT_CORE')) {
        backBtn.classList.remove('hidden');
        backBtn.innerText = '← STEP BACK TO ROOM';
      } else if (this.activeMapId === 'alchemist' || this.activeMapId === 'morgue') {
        backBtn.classList.add('hidden');
      } else {
        backBtn.classList.remove('hidden');
      }
    }

    const radioHud = document.getElementById('radio-inspect-hud');
    const zodiacHud = document.getElementById('zodiac-inspect-hud');
    const mercuryHud = document.getElementById('mercury-inspect-hud');
    const prismHud = document.getElementById('prism-inspect-hud');
    const escapementHud = document.getElementById('escapement-inspect-hud');

    // Morgue HUDs
    const toxHud = document.getElementById('toxicology-inspect-hud');
    const autopsyHud = document.getElementById('autopsy-inspect-hud');
    const keypadHud = document.getElementById('morgue-keypad-inspect-hud');
    const lifeHud = document.getElementById('life-support-inspect-hud');

    // Level Null HUDs
    const room1Hud = document.getElementById('levelnull-inspect-room1');
    const room2Hud = document.getElementById('levelnull-inspect-room2');
    const room3Hud = document.getElementById('levelnull-inspect-room3');

    // Level Null In-Room Action Prompts
    const prompt1 = document.getElementById('levelnull-prompt-room1');
    const prompt2 = document.getElementById('levelnull-prompt-room2');
    const prompt3 = document.getElementById('levelnull-prompt-room3');

    [radioHud, zodiacHud, mercuryHud, prismHud, escapementHud, toxHud, autopsyHud, keypadHud, lifeHud, room1Hud, room2Hud, room3Hud].forEach(el => {
      if (el) el.classList.add('hidden');
    });

    if (this.activeMapId === 'levelnull') {
      if (prompt1) prompt1.classList.toggle('hidden', viewKey !== 'ROOM_1');
      if (prompt2) prompt2.classList.toggle('hidden', viewKey !== 'ROOM_2');
      if (prompt3) prompt3.classList.toggle('hidden', viewKey !== 'ROOM_3');
    } else {
      if (prompt1) prompt1.classList.add('hidden');
      if (prompt2) prompt2.classList.add('hidden');
      if (prompt3) prompt3.classList.add('hidden');
    }

    if (viewKey === 'INSPECT_RADIO' && radioHud) {
      radioHud.classList.remove('hidden');
      const freq = window.frequencyModule ? window.frequencyModule.currentFreq : 100.0;
      const isDisarmed = window.frequencyModule ? window.frequencyModule.disarmed : false;
      const readout = document.getElementById('radio-inspect-freq');
      if (readout) {
        readout.className = isDisarmed ? 'glow-green' : 'glow-yellow';
        readout.innerText = isDisarmed ? `${freq.toFixed(1)} MHz (SIGNAL LOCKED ✓)` : `${freq.toFixed(1)} MHz`;
      }
    }
    if (viewKey === 'INSPECT_ASTROLABE' && zodiacHud) zodiacHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_PUZZLE_BOX' && mercuryHud) mercuryHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_FIREPLACE' && prismHud) prismHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_CLOCK' && escapementHud) escapementHud.classList.remove('hidden');

    // Morgue Module Inspection HUDs
    if (viewKey === 'INSPECT_TOXICOLOGY' && toxHud) {
      toxHud.classList.remove('hidden');
      if (window.toxicologyModule) window.toxicologyModule.updateDOM();
    }
    if (viewKey === 'INSPECT_AUTOPSY' && autopsyHud) {
      autopsyHud.classList.remove('hidden');
      if (window.autopsyModule) window.autopsyModule.updateDOM();
    }
    if (viewKey === 'INSPECT_DOOR' && keypadHud) {
      keypadHud.classList.remove('hidden');
      if (window.morgueKeypadModule) window.morgueKeypadModule.updateDOM();
    }
    if (viewKey === 'INSPECT_VENT' && lifeHud) {
      lifeHud.classList.remove('hidden');
      if (window.lifeSupportModule) window.lifeSupportModule.updateDOM();
    }

    // Level Null Inspection HUDs
    if (viewKey === 'INSPECT_BREAKER' && room1Hud) {
      room1Hud.classList.remove('hidden');
      if (window.room1BreakerModule) window.room1BreakerModule.renderInspectUI();
    }
    if (viewKey === 'INSPECT_HYDRO' && room2Hud) {
      room2Hud.classList.remove('hidden');
      if (window.room2HydroModule) window.room2HydroModule.renderInspectUI();
    }
    if (viewKey === 'INSPECT_CORE' && room3Hud) {
      room3Hud.classList.remove('hidden');
      if (window.room3CoreModule) window.room3CoreModule.renderInspectUI();
    }

    // Trigger Lore Document Modals
    if (viewKey === 'INSPECT_GRIMOIRE' && window.game) {
      window.game.openLoreModal('journal');
    } else if (viewKey === 'INSPECT_SCHEMATIC' && window.game) {
      window.game.openLoreModal('logbook');
    } else if (viewKey === 'INSPECT_LOGBOOK' && window.game) {
      window.game.openLoreModal('logbook');
    } else if (viewKey === 'INSPECT_DICTAPHONE' && window.game) {
      window.game.openLoreModal('dictaphone');
    } else if (viewKey === 'INSPECT_PHONOGRAPH' && window.game) {
      window.game.openLoreModal('phonograph');
    } else if (viewKey === 'INSPECT_LOG' && window.game) {
      window.game.openLoreModal('morgue_dictaphone');
    }
  }

  stepBack() {
    this.setView('OVERVIEW');
  }

  onPointerClick(raycaster) {
    if (!this.activeEnv) return false;

    // If currently in OVERVIEW, test intersection with hotspot rings
    if (this.currentView === 'OVERVIEW') {
      const hits = raycaster.intersectObjects(this.activeEnv.hotspots, false);
      if (hits.length > 0) {
        const targetView = hits[0].object.userData.targetView;
        if (targetView) {
          this.setView(targetView);
          return true;
        }
      }
    }
    return false;
  }

  onPointerHover(raycaster) {
    if (!this.activeEnv) return false;

    if (this.currentView === 'OVERVIEW') {
      const hits = raycaster.intersectObjects(this.activeEnv.hotspots, false);
      return hits.length > 0;
    }
    return false;
  }

  // Micro-Orbit interaction while inspecting
  onPointerDrag(deltaX, deltaY) {
    if (this.currentView === 'OVERVIEW') return;

    // Clamp micro-orbit azimuth within +- 22 deg and elevation within +- 15 deg
    const maxAzimuth = 0.38; // ~22 degrees
    const maxElevation = 0.26; // ~15 degrees

    this.orbitAngles.azimuth = THREE.MathUtils.clamp(
      this.orbitAngles.azimuth + deltaX * 0.005,
      -maxAzimuth,
      maxAzimuth
    );
    this.orbitAngles.elevation = THREE.MathUtils.clamp(
      this.orbitAngles.elevation + deltaY * 0.005,
      -maxElevation,
      maxElevation
    );
  }

  update() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.activeEnv) {
      this.activeEnv.update(time, delta);
    }

    // Camera Lerp
    const lerpRate = 0.08;
    this.cameraPos.lerp(this.targetCameraPos, lerpRate);
    this.cameraTarget.lerp(this.targetCameraTarget, lerpRate);

    // Apply micro-orbit offsets in Inspect modes
    const finalCameraPos = this.cameraPos.clone();
    if (this.currentView !== 'OVERVIEW') {
      const offset = finalCameraPos.clone().sub(this.cameraTarget);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.orbitAngles.azimuth);
      offset.y += Math.sin(this.orbitAngles.elevation) * 0.4;
      finalCameraPos.copy(this.cameraTarget).add(offset);
    }

    this.engine.camera.position.copy(finalCameraPos);
    this.engine.camera.lookAt(this.cameraTarget);

    // FOV Lerp
    if (Math.abs(this.engine.camera.fov - this.targetFOV) > 0.1) {
      this.engine.camera.fov += (this.targetFOV - this.engine.camera.fov) * lerpRate;
      this.engine.camera.updateProjectionMatrix();
    }
  }
}
