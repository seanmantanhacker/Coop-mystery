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

    if (mapId === 'silo44') {
      this.activeEnv = new Silo44Environment(this.engine.scene);
    } else if (mapId === 'alchemist') {
      this.activeEnv = new AlchemistStudyEnvironment(this.engine.scene);
    }

    this.activeEnv.build();
    this.setView('OVERVIEW', true);
  }

  setView(viewKey, immediate = false) {
    if (!this.activeEnv || !this.activeEnv.cameraPresets[viewKey]) return;

    this.currentView = viewKey;
    const preset = this.activeEnv.cameraPresets[viewKey];

    this.targetCameraPos.copy(preset.pos);
    this.targetCameraTarget.copy(preset.target);
    this.targetFOV = preset.fov;

    // Show hotspots in OVERVIEW, hide during inspection to keep clean view
    if (this.activeEnv && this.activeEnv.hotspots) {
      this.activeEnv.hotspots.forEach(h => {
        h.visible = (viewKey === 'OVERVIEW');
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
      if (viewKey === 'OVERVIEW') {
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

    [radioHud, zodiacHud, mercuryHud, prismHud, escapementHud].forEach(el => {
      if (el) el.classList.add('hidden');
    });

    if ((viewKey === 'INSPECT_RADIO' || (viewKey === 'INSPECT_BOMB' && this.currentScenario === 'silo44')) && radioHud) {
      radioHud.classList.remove('hidden');
      const freq = window.frequencyModule ? window.frequencyModule.currentFreq : 100.0;
      const isLocked = window.frequencyModule ? window.frequencyModule.isSignalLocked() : false;
      const readout = document.getElementById('radio-inspect-freq');
      if (readout) {
        readout.className = isLocked ? 'glow-green' : 'glow-yellow';
        readout.innerText = isLocked ? `${freq.toFixed(1)} MHz (SIGNAL LOCKED ✓)` : `${freq.toFixed(1)} MHz`;
      }
    }
    if (viewKey === 'INSPECT_PUZZLE_BOX' && zodiacHud) zodiacHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_ASTROLABE' && mercuryHud) mercuryHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_FIREPLACE' && prismHud) prismHud.classList.remove('hidden');
    if (viewKey === 'INSPECT_CLOCK' && escapementHud) escapementHud.classList.remove('hidden');

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
