/* ==========================================================================
   OPERATION: ZERO HOUR - THREE.JS POINT-AND-CLICK REALISTIC BOMB ENGINE
   Features: 
   - 3D Bunker Room & Metal Workbench
   - Realistic Pelican Bomb Case with Catenary Curved Wires & Severing
   - Point-and-Click Inspection Camera Director (Overview vs Inspect Views)
   ========================================================================== */

class Bomb3DEngine {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Camera Director Targets
    this.currentView = 'OVERVIEW'; // 'OVERVIEW', 'INSPECT_BOMB', 'INSPECT_RADIO', 'INSPECT_SIDE'
    this.cameraPos = new THREE.Vector3(0, 9, 12);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.targetCameraPos = new THREE.Vector3(0, 9, 12);
    this.targetCameraTarget = new THREE.Vector3(0, 0, 0);

    // Interactive Objects
    this.hotspots = [];
    this.clickableWires = [];
    this.clickableKeypad = [];
    this.simonPads = [];
    this.frequencyKnob = null;
    this.currentBombQuadrant = 'ALL'; // 'ALL', 'WIRES', 'KEYPAD', 'RADIO', 'SIMON'
    this.severedWires = [];

    // Animation Ticks
    this.clock = new THREE.Clock();
  }

  init(mapId = 'silo44') {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;
    container.innerHTML = '';

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1117);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 54);
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.camera.position.copy(this.cameraPos);
    this.camera.lookAt(this.cameraTarget);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Fill Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    const mainDirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    mainDirLight.position.set(5, 15, 10);
    mainDirLight.castShadow = true;
    this.scene.add(mainDirLight);

    // 5. Environment Manager & Bomb Hierarchy
    this.envManager = new EscapeRoomEnvironmentManager(this);
    this.bombGroup = new THREE.Group();
    this.bombGroup.position.set(0, 0.89, 0); // Position on top of bunker steel workbench
    this.bombGroup.scale.set(0.24, 0.24, 0.24); // Scale to realistic ordnance suitcase size
    this.scene.add(this.bombGroup);

    this.currentMap = mapId;
    this.buildRealisticBomb();
    this.switchMap(mapId);

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('click', (e) => this.onPointerClick(e));
    this.renderer.domElement.addEventListener('touchend', (e) => {
      if (e.cancelable) e.preventDefault();
      this.onPointerClick(e);
    }, { passive: false });
    this.renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (e.button === 2) this.onPointerClick(e);
    });
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onPointerMove(e));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.handleStepBack();
    });

    const backBtn = document.getElementById('btn-step-back');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleStepBack();
      });
    }

    // 7. Start Loop
    this.setView('OVERVIEW');
    this.animate();
  }

  switchMap(mapId) {
    this.currentMap = mapId;
    if (this.envManager) {
      this.envManager.loadMap(mapId);
    }
    if (this.bombGroup) {
      this.bombGroup.visible = (mapId === 'silo44');
    }

    // Update Level Indicator in Defuser HUD
    const titleEl = document.getElementById('defuser-level-title');
    const badgeEl = document.getElementById('defuser-level-badge');
    if (titleEl) {
      if (mapId === 'silo44') {
        titleEl.innerText = 'MAP 1: SILO 44 (BUNKER)';
        if (badgeEl) { badgeEl.classList.remove('gold'); badgeEl.classList.remove('cyan'); }
      } else if (mapId === 'alchemist') {
        titleEl.innerText = "MAP 2: THE ALCHEMIST'S STUDY";
        if (badgeEl) { badgeEl.classList.add('gold'); badgeEl.classList.remove('cyan'); }
      } else if (mapId === 'morgue') {
        titleEl.innerText = "MAP 3: THE LOCKED MORGUE";
        if (badgeEl) { badgeEl.classList.remove('gold'); badgeEl.classList.add('cyan'); }
      }
    }
    this.setView('OVERVIEW');
  }

  buildRealisticBomb() {
    this.hotspots = [];
    this.clickableWires = [];
    this.clickableKeypad = [];
    this.simonPads = [];

    // ================= 1. PELICAN MILITARY CASE =================
    const caseGeo = new THREE.BoxGeometry(7.2, 1.4, 5.2);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1a212b,
      roughness: 0.5,
      metalness: 0.5
    });
    const bombCase = new THREE.Mesh(caseGeo, caseMat);
    bombCase.position.set(0, 0.7, 0);
    bombCase.castShadow = true;
    bombCase.receiveShadow = true;
    this.bombGroup.add(bombCase);

    // Case Corner Protectors & Rivets
    const cornerGeo = new THREE.BoxGeometry(0.35, 1.45, 0.35);
    const cornerMat = new THREE.MeshStandardMaterial({ color: 0x3d4956, metalness: 0.8 });
    [[-3.6, -2.6], [3.6, -2.6], [-3.6, 2.6], [3.6, 2.6]].forEach(([cx, cz]) => {
      const corner = new THREE.Mesh(cornerGeo, cornerMat);
      corner.position.set(cx, 0.7, cz);
      this.bombGroup.add(corner);
    });

    // Stamped Aluminum Serial Plate (Back Face)
    const plateTexture = textureGen.createSerialPlateTexture(game.serialNumber);
    const plateGeo = new THREE.PlaneGeometry(1.8, 0.9);
    const plateMat = new THREE.MeshStandardMaterial({ map: plateTexture, roughness: 0.4 });
    const serialPlate = new THREE.Mesh(plateGeo, plateMat);
    serialPlate.position.set(-1.2, 0.7, -2.61);
    serialPlate.rotation.y = Math.PI;
    this.bombGroup.add(serialPlate);

    // Battery Bay Compartment (Side Face - Left)
    const battFrameGeo = new THREE.BoxGeometry(0.2, 0.8, 2.2);
    const battFrameMat = new THREE.MeshStandardMaterial({ color: 0x11161d });
    const battFrame = new THREE.Mesh(battFrameGeo, battFrameMat);
    battFrame.position.set(-3.61, 0.7, 0);
    this.bombGroup.add(battFrame);

    // Copper Battery Cells
    for (let b = 0; b < game.batteries; b++) {
      const cellGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 16);
      const cellMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 });
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(-3.7, 0.7, -0.6 + (b * 0.6));
      this.bombGroup.add(cell);
    }

    // Top Module Deck Plate
    const deckGeo = new THREE.PlaneGeometry(6.8, 4.8);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x10151c, roughness: 0.6, metalness: 0.3 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, 1.41, 0);
    deck.receiveShadow = true;
    this.bombGroup.add(deck);

    // Hazard Caution Strip
    const hazardTex = textureGen.createHazardTexture();
    const hazardGeo = new THREE.PlaneGeometry(6.8, 0.3);
    const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTex });
    const hazardStrip = new THREE.Mesh(hazardGeo, hazardMat);
    hazardStrip.rotation.x = -Math.PI / 2;
    hazardStrip.position.set(0, 1.42, -2.25);
    this.bombGroup.add(hazardStrip);

    // ================= 2. 3D MODULES ON DECK =================

    // --- MODULE 1: CATENARY CURVED WIRES (Top Left) ---
    this.buildCatenaryWires(-1.8, -1.1);

    // --- MODULE 2: MECHANICAL KEYPAD (Top Right) ---
    this.buildMechanicalKeypad(1.8, -1.1);

    // --- MODULE 3: FREQUENCY RADIO TUNER (Bottom Left) ---
    this.buildRadioModule(-1.8, 1.1);

    // --- MODULE 4: SIMON GLASS DOMES (Bottom Right) ---
    this.buildSimonDomes(1.8, 1.1);

    // ================= 3. POINT-AND-CLICK HOTSPOT RINGS =================
    // Room-level hotspots are managed by Silo44Environment
  }

  createHotspotRing(targetView, position, label) {
    const ringGeo = new THREE.RingGeometry(0.4, 0.48, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position);
    ring.userData = { isHotspot: true, targetView: targetView, label: label };
    this.bombGroup.add(ring);
    this.hotspots.push(ring);
  }

  // --- Catenary 3D Wires (Realistic S-Curve Splines) ---
  buildCatenaryWires(originX, originZ) {
    const colorHex = { red: 0xff2a4b, blue: 0x00f0ff, yellow: 0xffb700, black: 0x111111, white: 0xdddddd };

    wiresModule.wires.forEach((colorName, idx) => {
      const zOffset = -0.7 + (idx * 0.35);
      const start = new THREE.Vector3(originX - 0.9, 1.43, originZ + zOffset);
      const control1 = new THREE.Vector3(originX - 0.4, 1.7, originZ + zOffset + 0.1);
      const control2 = new THREE.Vector3(originX + 0.4, 1.7, originZ + zOffset - 0.1);
      const end = new THREE.Vector3(originX + 0.9, 1.43, originZ + zOffset);

      const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.045, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: colorHex[colorName] || 0xffffff,
        roughness: 0.3,
        metalness: 0.1
      });
      const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
      wireMesh.castShadow = true;
      wireMesh.userData = { isWire: true, wireIndex: idx, start: start, end: end, color: colorName };

      this.bombGroup.add(wireMesh);
      this.clickableWires.push(wireMesh);

      // Terminal Screws at endpoints
      [start, end].forEach(pos => {
        const screwGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12);
        const screwMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
        const screw = new THREE.Mesh(screwGeo, screwMat);
        screw.position.copy(pos);
        this.bombGroup.add(screw);
      });
    });
  }

  cutWireIn3D(wireMesh) {
    if (!wireMesh || wireMesh.userData.cut) return;
    wireMesh.userData.cut = true;

    // Visual Severing: Hide intact wire and spawn two drooping cut ends!
    wireMesh.visible = false;
    const { start, end, color } = wireMesh.userData;
    const midCut1 = new THREE.Vector3((start.x + end.x) / 2 - 0.08, 1.48, start.z);
    const midCut2 = new THREE.Vector3((start.x + end.x) / 2 + 0.08, 1.48, end.z);

    const colorHex = { red: 0xff2a4b, blue: 0x00f0ff, yellow: 0xffb700, black: 0x111111, white: 0xdddddd };
    const mat = new THREE.MeshStandardMaterial({ color: colorHex[color] || 0xffffff });

    const c1 = new THREE.CubicBezierCurve3(start, new THREE.Vector3(start.x + 0.3, 1.6, start.z), midCut1, midCut1);
    const c2 = new THREE.CubicBezierCurve3(end, new THREE.Vector3(end.x - 0.3, 1.6, end.z), midCut2, midCut2);

    const tube1 = new THREE.Mesh(new THREE.TubeGeometry(c1, 10, 0.045, 8, false), mat);
    const tube2 = new THREE.Mesh(new THREE.TubeGeometry(c2, 10, 0.045, 8, false), mat);
    this.bombGroup.add(tube1);
    this.bombGroup.add(tube2);

    const res = wiresModule.cutWire(wireMesh.userData.wireIndex);
    if (res.status === 'STRIKE') game.addStrike();
    else if (res.status === 'DISARMED') game.checkAllModulesDisarmed();
  }

  // --- Mechanical Keypad Buttons (Top Right Quadrant) ---
  buildMechanicalKeypad(originX, originZ) {
    // Sub-chassis mounting faceplate
    const plateGeo = new THREE.BoxGeometry(2.0, 0.06, 1.6);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x181f2a,
      metalness: 0.8,
      roughness: 0.4
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(originX, 1.43, originZ);
    plate.receiveShadow = true;
    this.bombGroup.add(plate);

    // Keypad Status LED (top right corner of module)
    const ledGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const ledMat = new THREE.MeshStandardMaterial({
      color: keypadModule.disarmed ? 0x00ff88 : 0x223322,
      emissive: keypadModule.disarmed ? 0x00ff88 : 0x002200,
      emissiveIntensity: keypadModule.disarmed ? 0.9 : 0.2,
      roughness: 0.2
    });
    this.keypadStatusLed = new THREE.Mesh(ledGeo, ledMat);
    this.keypadStatusLed.position.set(originX + 0.8, 1.47, originZ - 0.65);
    this.bombGroup.add(this.keypadStatusLed);

    const btnCoords = [[-0.45, -0.38], [0.45, -0.38], [-0.45, 0.38], [0.45, 0.38]];

    btnCoords.forEach(([bx, bz], idx) => {
      const sym = (keypadModule.buttons && keypadModule.buttons[idx]) || '?';
      const btnGeo = new THREE.BoxGeometry(0.72, 0.14, 0.58);
      
      const sideMat = new THREE.MeshStandardMaterial({
        color: 0x16202c,
        metalness: 0.6,
        roughness: 0.4
      });

      const topTex = textureGen.createKeypadGlyphTexture(sym);
      const topMat = new THREE.MeshStandardMaterial({
        map: topTex,
        roughness: 0.25,
        metalness: 0.2,
        emissive: 0x001522,
        emissiveIntensity: 0.4
      });

      // BoxGeometry faces: [+X, -X, +Y, -Y, +Z, -Z]
      const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
      const btnMesh = new THREE.Mesh(btnGeo, materials);
      btnMesh.position.set(originX + bx, 1.49, originZ + bz);
      btnMesh.castShadow = true;
      btnMesh.receiveShadow = true;
      btnMesh.userData = { isKeypad: true, symbol: sym, basePosY: 1.49, topMat: topMat };

      this.bombGroup.add(btnMesh);
      this.clickableKeypad.push(btnMesh);
    });
  }

  pressKeypadIn3D(btnMesh) {
    if (!btnMesh) return;
    btnMesh.position.y = btnMesh.userData.basePosY - 0.05; // Physical press down
    setTimeout(() => { btnMesh.position.y = btnMesh.userData.basePosY; }, 120);

    const res = keypadModule.pressButton(btnMesh.userData.symbol);
    if (res.status === 'STRIKE') {
      game.addStrike();
      // Flash red on all buttons
      this.clickableKeypad.forEach(b => {
        if (b.userData.topMat) {
          b.userData.topMat.emissive.setHex(0xff0033);
          b.userData.topMat.emissiveIntensity = 1.0;
        }
      });
      setTimeout(() => {
        this.clickableKeypad.forEach(b => {
          if (b.userData.topMat) {
            b.userData.topMat.emissive.setHex(0x001522);
            b.userData.topMat.emissiveIntensity = 0.4;
          }
        });
      }, 400);
    } else if (res.status === 'PROGRESS') {
      // Glow green on the successfully pressed button
      if (btnMesh.userData.topMat) {
        btnMesh.userData.topMat.emissive.setHex(0x00ff88);
        btnMesh.userData.topMat.emissiveIntensity = 0.9;
      }
    } else if (res.status === 'DISARMED') {
      // All buttons glow steady green
      this.clickableKeypad.forEach(b => {
        if (b.userData.topMat) {
          b.userData.topMat.emissive.setHex(0x00ff88);
          b.userData.topMat.emissiveIntensity = 0.9;
        }
      });
      if (this.keypadStatusLed) {
        this.keypadStatusLed.material.color.setHex(0x00ff88);
        this.keypadStatusLed.material.emissive.setHex(0x00ff88);
        this.keypadStatusLed.material.emissiveIntensity = 1.0;
      }
      game.checkAllModulesDisarmed();
    }
  }

  // --- Module 3: Frequency Radio Tuner / Jammer (Bottom Left Quadrant) ---
  buildRadioModule(originX, originZ) {
    this.rfModuleGroup = new THREE.Group();
    this.rfModuleGroup.position.set(originX, 1.42, originZ);

    // Shielded RF Receiver Junction Box
    const boxGeo = new THREE.BoxGeometry(2.4, 0.22, 1.9);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x181f28,
      metalness: 0.85,
      roughness: 0.35
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.11;
    box.castShadow = true;
    this.rfModuleGroup.add(box);

    // Brass RF Induction Coil
    const coilGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.42, 16);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xc88b32,
      metalness: 0.9,
      roughness: 0.2
    });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.set(-0.65, 0.36, -0.4);
    this.rfModuleGroup.add(coil);

    // Glass Radio Valve / Vacuum Tube
    const tubeGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.42, 16);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xffeedd,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(-0.25, 0.36, -0.4);
    this.rfModuleGroup.add(tube);

    // Glowing Orange Cathode Filament
    const filGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.26, 8);
    const filMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
    const fil = new THREE.Mesh(filGeo, filMat);
    fil.position.set(-0.25, 0.36, -0.4);
    this.rfModuleGroup.add(fil);

    // Heavy Knurled Metal Tuning Knob (Directly on bomb deck)
    const knobGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.28, 32);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.92, roughness: 0.22 });
    this.frequencyKnob = new THREE.Mesh(knobGeo, knobMat);
    this.frequencyKnob.position.set(0.45, 0.30, 0.05);
    this.frequencyKnob.userData = { isKnob: true, isRadioKnob: true };
    this.rfModuleGroup.add(this.frequencyKnob);

    // Indicator Notch on Knob
    const notchGeo = new THREE.BoxGeometry(0.08, 0.30, 0.40);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, 0, 0.18);
    this.frequencyKnob.add(notch);

    // Status Indicator LED (Amber = Jammer Active, Green = Carrier Disarmed)
    const ledGeo = new THREE.SphereGeometry(0.09, 16, 16);
    this.rfStatusLedMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    this.rfStatusLed = new THREE.Mesh(ledGeo, this.rfStatusLedMat);
    this.rfStatusLed.position.set(-0.65, 0.28, 0.4);
    this.rfModuleGroup.add(this.rfStatusLed);

    // Top Stencil / Frequency Plate
    const labelGeo = new THREE.PlaneGeometry(1.6, 0.28);
    const labelMat = new THREE.MeshStandardMaterial({ color: 0x0a0e14, roughness: 0.8 });
    const labelPlate = new THREE.Mesh(labelGeo, labelMat);
    labelPlate.rotation.x = -Math.PI / 2;
    labelPlate.position.set(-0.1, 0.23, 0.0);
    this.rfModuleGroup.add(labelPlate);

    this.rfModuleGroup.userData = {
      isRfReceiver: true,
      label: 'FREQUENCY JAMMER TUNER'
    };

    this.bombGroup.add(this.rfModuleGroup);
  }

  tuneFrequencyDelta(step) {
    if (this.frequencyKnob) {
      this.frequencyKnob.rotation.y += (step > 0 ? 0.25 : -0.25);
    }
    if (this.envManager?.activeEnv?.shelfKnob) {
      this.envManager.activeEnv.shelfKnob.rotation.z += (step > 0 ? 0.25 : -0.25);
    }
    if (typeof audio !== 'undefined' && audio.playDialClick) audio.playDialClick();

    if (!window.frequencyModule) return;
    let freq = parseFloat((frequencyModule.currentFreq + step).toFixed(1));
    if (freq < 100.0) freq = 200.0;
    if (freq > 200.0) freq = 100.0;
    const isLocked = frequencyModule.tune(freq);

    if (typeof network !== 'undefined' && network.broadcast) {
      network.broadcast({ type: 'FREQ_TUNE_UPDATE', freq: freq });
    }

    const readout = document.getElementById('radio-inspect-freq');
    const radioHud = document.getElementById('radio-inspect-hud');
    if (radioHud) radioHud.classList.remove('hidden');
    if (readout) {
      if (isLocked) {
        readout.className = 'glow-green';
        readout.innerText = `${freq.toFixed(1)} MHz (SIGNAL LOCKED ✓)`;
      } else {
        readout.className = 'glow-yellow';
        readout.innerText = `${freq.toFixed(1)} MHz`;
      }
    }

    if (isLocked && !frequencyModule.disarmed) {
      frequencyModule.disarmed = true;
      if (this.rfStatusLedMat) {
        this.rfStatusLedMat.color.setHex(0x00ff66);
      }
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();
      if (typeof game !== 'undefined' && game.checkAllModulesDisarmed) game.checkAllModulesDisarmed();
    }
  }

  rotateRadioKnob(delta) {
    this.tuneFrequencyDelta(delta > 0 ? 0.5 : -0.5);
  }

  // --- Simon Glass Light Domes ---
  buildSimonDomes(originX, originZ) {
    const colors = [
      { name: 'red', hex: 0xff2a4b, pos: [-0.5, -0.4] },
      { name: 'blue', hex: 0x00f0ff, pos: [0.5, -0.4] },
      { name: 'green', hex: 0x00ff66, pos: [-0.5, 0.4] },
      { name: 'yellow', hex: 0xffb700, pos: [0.5, 0.4] }
    ];

    colors.forEach(item => {
      const domeGeo = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({
        color: item.hex,
        roughness: 0.15,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.set(originX + item.pos[0], 1.45, originZ + item.pos[1]);
      dome.userData = { isSimon: true, color: item.name, hex: item.hex };

      this.bombGroup.add(dome);
      this.simonPads.push(dome);
    });

    this.startSimonFlashLoop();
  }

  startSimonFlashLoop() {
    if (this.simonInterval) clearInterval(this.simonInterval);

    let step = 0;
    this.simonInterval = setInterval(() => {
      // Only flash if game is active, Simon is not disarmed, and map is silo44
      if (this.currentMap !== 'silo44') return;
      if (!window.simonModule || window.simonModule.disarmed) return;
      if (window.game && window.game.gameEnded) return;

      const seq = window.simonModule.sequence;
      if (!seq || seq.length === 0) return;

      // Sequence steps plus a 2-tick pause before repeating
      const totalSteps = seq.length + 2;
      const currentIdx = step % totalSteps;

      if (currentIdx < seq.length) {
        const colorToFlash = seq[currentIdx];
        this.flashSimonDome(colorToFlash, 500);
      }
      step++;
    }, 950);
  }

  flashSimonDome(colorName, durationMs = 400) {
    const dome = this.simonPads.find(d => d.userData.color === colorName);
    if (!dome) return;

    // Light up dome with vibrant emissive glow
    dome.material.emissive.setHex(dome.userData.hex);
    dome.material.emissiveIntensity = 2.5;

    if (window.audio && window.audio.playSimonTone) {
      window.audio.playSimonTone(colorName);
    }

    setTimeout(() => {
      if (dome.material) {
        dome.material.emissive.setHex(0x000000);
        dome.material.emissiveIntensity = 0;
      }
    }, durationMs);
  }

  pressSimonIn3D(dome) {
    if (!dome) return;
    this.flashSimonDome(dome.userData.color, 180);

    const res = simonModule.pressColor(dome.userData.color, game.serialNumber, game.strikes);
    if (res.status === 'STRIKE') {
      // Visual feedback: Flash all domes red
      this.simonPads.forEach(d => {
        d.material.emissive.setHex(0xff0000);
        d.material.emissiveIntensity = 2.5;
        setTimeout(() => {
          if (d.material) {
            d.material.emissive.setHex(0x000000);
            d.material.emissiveIntensity = 0;
          }
        }, 350);
      });
      game.addStrike();
    } else if (res.status === 'DISARMED') {
      // Visual feedback: Flash all domes green
      this.simonPads.forEach(d => {
        d.material.emissive.setHex(0x00ff66);
        d.material.emissiveIntensity = 2.5;
        setTimeout(() => {
          if (d.material) {
            d.material.emissive.setHex(0x000000);
            d.material.emissiveIntensity = 0;
          }
        }, 800);
      });
      game.checkAllModulesDisarmed();
    }
  }

  // ================= CAMERA POINT-AND-CLICK DIRECTOR =================
  setView(viewMode) {
    this.currentView = viewMode;
    if (typeof audio !== 'undefined' && audio.playZoom) audio.playZoom();

    // Ensure step-back button visibility is updated immediately
    const backBtn = document.getElementById('btn-step-back');
    if (backBtn) {
      if (viewMode === 'OVERVIEW' || this.currentMap === 'alchemist' || this.currentMap === 'morgue') {
        backBtn.classList.add('hidden');
      } else {
        backBtn.classList.remove('hidden');
        if (viewMode === 'INSPECT_BOMB' && this.currentBombQuadrant && this.currentBombQuadrant !== 'ALL') {
          backBtn.innerText = '← BACK TO FULL BOMB';
        } else {
          backBtn.innerText = '← STEP BACK TO ROOM';
        }
      }
    }

    const quadBar = document.getElementById('bomb-quadrant-bar');
    const radioHud = document.getElementById('radio-inspect-hud');

    if (this.currentMap === 'silo44') {
      if (viewMode === 'INSPECT_BOMB') {
        this.currentBombQuadrant = 'ALL';
        if (quadBar) {
          quadBar.classList.remove('hidden');
          quadBar.querySelectorAll('.btn-quadrant').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.quadrant === 'ALL');
          });
        }
        if (radioHud) radioHud.classList.add('hidden');
      } else if (viewMode === 'INSPECT_RADIO') {
        this.currentBombQuadrant = 'RADIO';
        if (quadBar) {
          quadBar.classList.remove('hidden');
          quadBar.querySelectorAll('.btn-quadrant').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.quadrant === 'RADIO');
          });
        }
        if (radioHud) {
          radioHud.classList.remove('hidden');
          const freq = window.frequencyModule ? window.frequencyModule.currentFreq : 100.0;
          const isLocked = window.frequencyModule ? window.frequencyModule.isSignalLocked() : false;
          const readout = document.getElementById('radio-inspect-freq');
          if (readout) {
            readout.className = isLocked ? 'glow-green' : 'glow-yellow';
            readout.innerText = isLocked ? `${freq.toFixed(1)} MHz (SIGNAL LOCKED ✓)` : `${freq.toFixed(1)} MHz`;
          }
        }
      } else {
        this.currentBombQuadrant = null;
        if (quadBar) quadBar.classList.add('hidden');
        if (radioHud) radioHud.classList.add('hidden');
      }
    } else {
      if (quadBar) quadBar.classList.add('hidden');
      if (radioHud) radioHud.classList.add('hidden');
    }

    // Alchemist Apparatus Navigation Bar
    const alchemistBar = document.getElementById('alchemist-apparatus-bar');
    if (alchemistBar) {
      if (this.currentMap === 'alchemist') {
        // On mobile, hide apparatus bar during module inspection to give full height to puzzle controls
        if (window.innerWidth <= 860 && viewMode !== 'OVERVIEW') {
          alchemistBar.classList.add('hidden');
        } else {
          alchemistBar.classList.remove('hidden');
          alchemistBar.querySelectorAll('.btn-apparatus').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewMode);
          });
        }
      } else {
        alchemistBar.classList.add('hidden');
      }
    }

    // Morgue Apparatus Navigation Bar
    const morgueBar = document.getElementById('morgue-apparatus-bar');
    if (morgueBar) {
      if (this.currentMap === 'morgue') {
        if (window.innerWidth <= 860 && viewMode !== 'OVERVIEW') {
          morgueBar.classList.add('hidden');
        } else {
          morgueBar.classList.remove('hidden');
          morgueBar.querySelectorAll('.btn-apparatus').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewMode);
          });
        }
      } else {
        morgueBar.classList.add('hidden');
      }
    }

    if (this.envManager) {
      this.envManager.setView(viewMode);
      if (this.envManager.activeEnv && this.envManager.activeEnv.cameraPresets[viewMode]) {
        const preset = this.envManager.activeEnv.cameraPresets[viewMode];
        this.targetCameraTarget.copy(preset.target);

        // Responsive Aspect-Ratio Framing:
        // On narrow/portrait screens (phones & tablets), adapt framing safely:
        const container = document.getElementById('three-canvas-container');
        const aspect = (container && container.clientHeight > 0)
          ? (container.clientWidth / container.clientHeight)
          : ((this.camera && this.camera.aspect) ? this.camera.aspect : 1.777);

        if (viewMode === 'OVERVIEW') {
          // In room overview, do NOT push camera through the concrete back wall!
          // Keep camera safely positioned inside the room bounds:
          this.targetCameraPos.copy(preset.pos);

          // On tall/narrow mobile viewports, adapt vertical FOV so the room is fully visible:
          if (this.camera) {
            let fov = preset.fov || 52;
            if (aspect < 1.25) {
              fov = Math.min(74, Math.round(fov * (1.18 / Math.max(0.48, aspect))));
            }
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
          }
        } else {
          // For inspect modes, prevent pushing camera through walls on narrow portrait mobile screens
          let distFactor = 1.0;
          if (aspect < 1.25) {
            distFactor = Math.min(1.28, Math.max(1.0, 1.10 / aspect));
          }

          const offset = new THREE.Vector3().subVectors(preset.pos, preset.target);
          offset.multiplyScalar(distFactor);
          this.targetCameraPos.copy(preset.target).add(offset);

          if (preset.fov && this.camera) {
            let fov = preset.fov;
            if (aspect < 1.25) {
              fov = Math.min(58, Math.round(fov * (1.08 / Math.max(0.68, aspect))));
            }
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
          }
        }
      }
    }
  }

  // 4-Quadrant Mobile/Desktop Zoom System for Bomb Deck
  setBombQuadrant(quadrant) {
    if (this.currentView !== 'INSPECT_BOMB') {
      this.setView('INSPECT_BOMB');
    }
    this.currentBombQuadrant = quadrant;

    // Update active class on toolbar buttons
    const quadBar = document.getElementById('bomb-quadrant-bar');
    if (quadBar) {
      quadBar.querySelectorAll('.btn-quadrant').forEach(btn => {
        if (btn.dataset.quadrant === quadrant) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update Step Back Button text
    const backBtn = document.getElementById('btn-step-back');
    if (backBtn) {
      if (quadrant === 'ALL') {
        backBtn.innerText = '← STEP BACK TO ROOM';
      } else {
        backBtn.innerText = '← BACK TO FULL BOMB';
      }
    }

    if (typeof audio !== 'undefined' && audio.playZoom) audio.playZoom();

    // Radio Inspect HUD visibility
    const radioHud = document.getElementById('radio-inspect-hud');
    if (radioHud) {
      if (quadrant === 'RADIO') {
        radioHud.classList.remove('hidden');
        const freq = window.frequencyModule ? window.frequencyModule.currentFreq : 100.0;
        const isLocked = window.frequencyModule ? window.frequencyModule.isSignalLocked() : false;
        const readout = document.getElementById('radio-inspect-freq');
        if (readout) {
          readout.className = isLocked ? 'glow-green' : 'glow-yellow';
          readout.innerText = isLocked ? `${freq.toFixed(1)} MHz (SIGNAL LOCKED ✓)` : `${freq.toFixed(1)} MHz`;
        }
      } else {
        radioHud.classList.add('hidden');
      }
    }

    const container = document.getElementById('three-canvas-container');
    const aspect = (container && container.clientHeight > 0)
      ? (container.clientWidth / container.clientHeight)
      : ((this.camera && this.camera.aspect) ? this.camera.aspect : 1.777);

    let distFactor = 1.0;
    if (aspect < 1.25) {
      distFactor = Math.max(1.0, 1.15 / aspect);
    }

    // Module definitions in local bomb coordinates:
    // Wires: Top-Left (-1.8, -1.1), Keypad: Top-Right (1.8, -1.1)
    // Radio: Bottom-Left (-1.8, 1.1), Simon: Bottom-Right (1.8, 1.1)
    const quadrantLocalCoords = {
      WIRES:  new THREE.Vector3(-1.8, 1.45, -1.1),
      KEYPAD: new THREE.Vector3(1.8, 1.45, -1.1),
      RADIO:  new THREE.Vector3(-1.8, 1.45, 1.1),
      SIMON:  new THREE.Vector3(1.8, 1.45, 1.1)
    };

    if (quadrantLocalCoords[quadrant]) {
      const localTarget = quadrantLocalCoords[quadrant].clone();
      const worldTarget = this.bombGroup.localToWorld(localTarget.clone());

      this.targetCameraTarget.copy(worldTarget);

      // Downward inspection camera angle (~49°)
      const baseOffset = new THREE.Vector3(0, 0.48, 0.42);
      baseOffset.multiplyScalar(distFactor);

      if (quadrant === 'RADIO' && aspect < 1.25) {
        this.targetCameraTarget.y -= 0.03;
      }

      this.targetCameraPos.copy(this.targetCameraTarget).add(baseOffset);

      if (this.camera) {
        this.camera.fov = (aspect < 1.25) ? 38 : 36;
        this.camera.updateProjectionMatrix();
      }
    } else {
      // Full Bomb View
      const preset = this.envManager?.activeEnv?.cameraPresets?.INSPECT_BOMB || {
        pos: new THREE.Vector3(0.0, 1.95, 0.95),
        target: new THREE.Vector3(0.0, 1.15, 0.0),
        fov: 40
      };
      this.targetCameraTarget.copy(preset.target);

      const offset = new THREE.Vector3().subVectors(preset.pos, preset.target);
      offset.multiplyScalar(distFactor);
      this.targetCameraPos.copy(preset.target).add(offset);

      if (preset.fov && this.camera) {
        this.camera.fov = preset.fov;
        this.camera.updateProjectionMatrix();
      }
    }
  }

  handleStepBack() {
    const hudIds = [
      'radio-inspect-hud', 'zodiac-inspect-hud', 'mercury-inspect-hud', 'prism-inspect-hud', 'escapement-inspect-hud',
      'toxicology-inspect-hud', 'autopsy-inspect-hud', 'morgue-keypad-inspect-hud', 'life-support-inspect-hud'
    ];
    hudIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    if (this.currentView === 'INSPECT_BOMB' && this.currentBombQuadrant && this.currentBombQuadrant !== 'ALL') {
      this.setBombQuadrant('ALL');
    } else {
      this.setView('OVERVIEW');
    }
  }

  onPointerClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    let cx = event.clientX;
    let cy = event.clientY;
    if (cx === undefined && event.touches && event.touches.length > 0) {
      cx = event.touches[0].clientX;
      cy = event.touches[0].clientY;
    } else if (cx === undefined && event.changedTouches && event.changedTouches.length > 0) {
      cx = event.changedTouches[0].clientX;
      cy = event.changedTouches[0].clientY;
    }
    if (cx === undefined || cy === undefined) return;

    this.mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // If in OVERVIEW, test environment & bomb hotspots AND prop meshes
    if (this.currentView === 'OVERVIEW') {
      if (this.envManager && this.envManager.activeEnv) {
        // 1. Direct Hotspot Rings & Hit Discs
        const envHits = this.raycaster.intersectObjects(this.envManager.activeEnv.hotspots, true);
        if (envHits.length > 0) {
          let targetView = envHits[0].object.userData.targetView;
          if (!targetView && envHits[0].object.parent) targetView = envHits[0].object.parent.userData.targetView;
          if (targetView) {
            this.setView(targetView);
            return;
          }
        }

        // 2. Direct click on environment 3D props
        const propHits = this.raycaster.intersectObjects(this.envManager.activeEnv.group.children, true);
        for (let hit of propHits) {
          let curr = hit.object;
          while (curr && curr !== this.envManager.activeEnv.group) {
            if (curr.userData && curr.userData.targetView) {
              this.setView(curr.userData.targetView);
              return;
            }
            curr = curr.parent;
          }
        }
      }

      const hits = this.raycaster.intersectObjects(this.hotspots, true);
      if (hits.length > 0) {
        const targetView = hits[0].object.userData.targetView;
        if (targetView) {
          this.setView(targetView);
          return;
        }
      }

      // 3. Direct click on bomb casing in bunker
      if (this.currentMap === 'silo44' && this.bombGroup) {
        const bombHits = this.raycaster.intersectObjects(this.bombGroup.children, true);
        if (bombHits.length > 0) {
          this.setView('INSPECT_BOMB');
          return;
        }
      }
      return;
    }

    // ================= INSPECTION VIEWS =================
    // If in INSPECT_BOMB, test Wires, Keypads, Simon, Radio Knob
    if (this.currentView === 'INSPECT_BOMB') {
      // 1. Interactive Wires
      const wireHits = this.raycaster.intersectObjects(this.clickableWires);
      if (wireHits.length > 0) {
        this.cutWireIn3D(wireHits[0].object);
        return;
      }

      // 2. Keypad Buttons
      const keyHits = this.raycaster.intersectObjects(this.clickableKeypad);
      if (keyHits.length > 0) {
        this.pressKeypadIn3D(keyHits[0].object);
        return;
      }

      // 3. Simon Light Domes
      const simonHits = this.raycaster.intersectObjects(this.simonPads);
      if (simonHits.length > 0) {
        this.pressSimonIn3D(simonHits[0].object);
        return;
      }

      // 4. Radio Frequency Tuning Knob directly on bomb casing
      if (this.frequencyKnob) {
        const knobHits = this.raycaster.intersectObject(this.frequencyKnob, true);
        if (knobHits.length > 0) {
          const delta = (event.button === 2 || event.shiftKey) ? -0.3 : 0.3;
          this.rotateRadioKnob(delta);
          return;
        }
      }

      // 5. Radio Frequency Module group click
      if (this.rfModuleGroup) {
        const rfHits = this.raycaster.intersectObjects(this.rfModuleGroup.children, true);
        if (rfHits.length > 0) {
          if (this.currentBombQuadrant === 'ALL' && window.innerWidth <= 860) {
            this.setBombQuadrant('RADIO');
          } else {
            const delta = (event.button === 2 || event.shiftKey) ? -0.3 : 0.3;
            this.rotateRadioKnob(delta);
          }
          return;
        }
      }

      // 6. Mobile Tap-to-Zoom Quadrant on Bomb Deck (when in full bomb view)
      if (this.currentBombQuadrant === 'ALL' && window.innerWidth <= 860) {
        const bombHits = this.raycaster.intersectObjects(this.bombGroup.children, true);
        if (bombHits.length > 0) {
          const pt = bombHits[0].point;
          if (pt.x < 0 && pt.z <= 0) {
            this.setBombQuadrant('WIRES');
            return;
          } else if (pt.x >= 0 && pt.z <= 0) {
            this.setBombQuadrant('KEYPAD');
            return;
          } else if (pt.x < 0 && pt.z > 0) {
            this.setBombQuadrant('RADIO');
            return;
          } else {
            this.setBombQuadrant('SIMON');
            return;
          }
        }
      }

      // 7. Clicked outside bomb case -> step back
      const bombHits = this.raycaster.intersectObjects(this.bombGroup.children, true);
      if (bombHits.length === 0) {
        this.handleStepBack();
        return;
      }
    }

    // Direct 3D interaction in INSPECT_FIREPLACE (clicking Prism 1, Prism 2, or Filter)
    if (this.currentView === 'INSPECT_FIREPLACE') {
      const hits = this.raycaster.intersectObjects(this.envManager?.activeEnv?.group?.children || [], true);
      for (let h of hits) {
        let obj = h.object;
        while (obj && obj !== this.envManager?.activeEnv?.group) {
          if (obj.userData) {
            if (obj.userData.isPrism1) {
              const delta = (event.button === 2 || event.shiftKey) ? -5 : 5;
              if (window.prismModule) window.prismModule.adjustPrism1(delta);
              return;
            }
            if (obj.userData.isPrism2) {
              const delta = (event.button === 2 || event.shiftKey) ? -5 : 5;
              if (window.prismModule) window.prismModule.adjustPrism2(delta);
              return;
            }
            if (obj.userData.isFilter) {
              if (window.prismModule) {
                const filters = ['none', 'amber', 'blue', 'green', 'red'];
                const curIdx = filters.indexOf(window.prismModule.activeFilter);
                const nextF = filters[(curIdx + 1) % filters.length];
                window.prismModule.setFilter(nextF);
              }
              return;
            }
          }
          obj = obj.parent;
        }
      }
    }

    // For other inspect modes (Schematic, Keypad, Clock, Astrolabe), clicking the background steps back
    if (this.currentView !== 'OVERVIEW') {
      const hits = this.raycaster.intersectObjects(this.envManager?.activeEnv?.group?.children || [], true);
      let hitInspected = false;
      for (let h of hits) {
        let c = h.object;
        while (c) {
          if (c.userData && c.userData.targetView === this.currentView) {
            hitInspected = true;
            break;
          }
          c = c.parent;
        }
        if (hitInspected) break;
      }
      if (!hitInspected) {
        this.setView('OVERVIEW');
      }
    }
  }

  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Hover feedback on Hotspots & Interactive Props
    let hovering = false;
    if (this.currentView === 'OVERVIEW') {
      if (this.envManager && this.envManager.activeEnv) {
        const envHits = this.raycaster.intersectObjects(this.envManager.activeEnv.hotspots, true);
        if (envHits.length > 0) hovering = true;

        if (!hovering) {
          const propHits = this.raycaster.intersectObjects(this.envManager.activeEnv.group.children, true);
          for (let hit of propHits) {
            let curr = hit.object;
            while (curr && curr !== this.envManager.activeEnv.group) {
              if (curr.userData && curr.userData.targetView) {
                hovering = true;
                break;
              }
              curr = curr.parent;
            }
            if (hovering) break;
          }
        }
      }
      if (!hovering && this.currentMap === 'silo44' && this.bombGroup) {
        const bombHits = this.raycaster.intersectObjects(this.bombGroup.children, true);
        if (bombHits.length > 0) hovering = true;
      }
    } else if (this.currentView === 'INSPECT_BOMB') {
      const hits = this.raycaster.intersectObjects([...this.clickableWires, ...this.clickableKeypad, ...this.simonPads]);
      if (hits.length > 0) hovering = true;
      if (!hovering && this.frequencyKnob) {
        const knobHits = this.raycaster.intersectObject(this.frequencyKnob, true);
        if (knobHits.length > 0) hovering = true;
      }
      if (!hovering && this.rfModuleGroup) {
        const rfHits = this.raycaster.intersectObjects(this.rfModuleGroup.children, true);
        if (rfHits.length > 0) hovering = true;
      }
    }
    this.renderer.domElement.style.cursor = hovering ? 'pointer' : 'default';
  }

  onWindowResize() {
    const container = document.getElementById('three-canvas-container');
    if (!container || !this.renderer) return;

    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    if (this.currentView) {
      this.setView(this.currentView);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Update active environment animations (pendulum, flicker, fire particles, lightning)
    if (this.envManager && this.envManager.activeEnv) {
      this.envManager.activeEnv.update(time, delta);
    }

    // Smooth Camera Lerp
    this.cameraPos.lerp(this.targetCameraPos, 0.08);
    this.cameraTarget.lerp(this.targetCameraTarget, 0.08);
    this.camera.position.copy(this.cameraPos);
    this.camera.lookAt(this.cameraTarget);

    // Pulse Hotspot Rings
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.12;
    this.hotspots.forEach(ring => ring.scale.set(pulse, pulse, 1));

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

const bomb3D = new Bomb3DEngine();
window.bomb3D = bomb3D;
