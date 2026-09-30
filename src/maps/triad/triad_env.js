/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX (CASE 005)
   OPERATIVE 1: 1979 THE ARCHITECT - 3D PROMETHEUS TEMPORAL FACILITY
   Three.js 5-Node Environmental Traversal, Hydraulic Valves & Ripple Controls
   ========================================================================== */

class TriadEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.hotspots = [];
    this.currentNode = 5; // Start in Security Hub (Node 5)

    // Interactive 3D Objects
    this.valveWheel = null;
    this.cisternGrate = null;
    this.safeDoor = null;
    this.vaultBulkhead = null;
    this.tachyonRing = null;
    this.tapeReels = [];
    this.lights = {};

    // Camera Presets for 5 Nodes & Close-Up Inspections
    this.cameraPresets = {
      OVERVIEW: {
        pos: new THREE.Vector3(0, 14, 18),
        target: new THREE.Vector3(0, 0, -2),
        fov: 52,
        label: '1979: PROMETHEUS FACILITY OVERVIEW'
      },
      NODE_1_LAB: {
        pos: new THREE.Vector3(-6, 2.5, -4),
        target: new THREE.Vector3(-6, 1.2, -8),
        fov: 48,
        label: 'NODE 1: RESEARCH LABORATORY'
      },
      NODE_2_OFFICE: {
        pos: new THREE.Vector3(6, 2.5, -4),
        target: new THREE.Vector3(6, 1.2, -8),
        fov: 48,
        label: "NODE 2: DIRECTOR'S OFFICE"
      },
      NODE_3_VAULT: {
        pos: new THREE.Vector3(0, 2.8, -8),
        target: new THREE.Vector3(0, 1.5, -14),
        fov: 52,
        label: 'NODE 3: TEMPORAL VAULT BULKHEAD'
      },
      NODE_4_COURTYARD: {
        pos: new THREE.Vector3(-5, 3.2, 5),
        target: new THREE.Vector3(-5, 0.5, 0),
        fov: 50,
        label: 'NODE 4: CENTRAL DRAINAGE COURTYARD'
      },
      NODE_5_SECURITY: {
        pos: new THREE.Vector3(5, 2.6, 5),
        target: new THREE.Vector3(5, 1.2, 0),
        fov: 48,
        label: 'NODE 5: SECURITY MAIN HUB'
      },
      INSPECT_VALVE: {
        pos: new THREE.Vector3(-6.2, 1.8, -6.8),
        target: new THREE.Vector3(-6.2, 1.5, -8.0),
        fov: 36,
        label: 'COOLANT PRESSURE MANIFOLD'
      },
      INSPECT_CISTERN: {
        pos: new THREE.Vector3(-5.0, 1.8, 0.8),
        target: new THREE.Vector3(-5.0, 0.05, 0.0),
        fov: 38,
        label: 'SUBTERRANEAN CISTERN GRATE'
      },
      INSPECT_SAFE: {
        pos: new THREE.Vector3(5.8, 1.8, -7.5),
        target: new THREE.Vector3(7.8, 1.8, -7.5),
        fov: 36,
        label: 'BIOMETRIC WALL SAFE'
      }
    };

    this.built = false;
    this.build();
    window.triadEnv = this;
    window.triadEnvInstance = this;
  }

  build() {
    if (!this.built) {
      this.buildLighting();
      this.buildFacilityFloor();
      this.buildNode1_Laboratory();
      this.buildNode2_DirectorOffice();
      this.buildNode3_TemporalVault();
      this.buildNode4_Courtyard();
      this.buildNode5_SecurityHub();
      this.buildHotspots();
      this.inject1979HUD();

      if (this.scene && this.group) {
        this.scene.add(this.group);
      }
      this.built = true;
    }
  }

  destroy() {
    this.cleanup();
  }

  cleanup() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
    const hud = document.getElementById('triad-1979-hud');
    if (hud) hud.remove();

    // Restore legacy defuser hud
    const defHud = document.querySelector('.defuser-hud');
    const quadBar = document.getElementById('bomb-quadrant-bar');
    if (defHud) defHud.classList.remove('hidden');
    if (quadBar) quadBar.classList.remove('hidden');
  }

  // =========================================================================
  // 1. LIGHTING
  // =========================================================================
  buildLighting() {
    // Ambient fill
    const amb = new THREE.AmbientLight(0x222834, 0.75);
    this.group.add(amb);

    // Node 1: Lab cool cyan/green fluorescent
    const labLight = new THREE.PointLight(0x6ee7b7, 1.6, 12);
    labLight.position.set(-6, 3.2, -6);
    this.group.add(labLight);
    this.lights.lab = labLight;

    // Node 2: Office warm amber incandescent
    const officeLight = new THREE.PointLight(0xfcd34d, 1.5, 11);
    officeLight.position.set(6, 2.8, -6);
    this.group.add(officeLight);
    this.lights.office = officeLight;

    // Node 3: Vault ominous violet tachyon glow
    const vaultLight = new THREE.PointLight(0xc084fc, 2.2, 16);
    vaultLight.position.set(0, 3.0, -11.5);
    this.group.add(vaultLight);
    this.lights.vault = vaultLight;

    // Node 4: Courtyard cool exterior night blue
    const courtyardLight = new THREE.PointLight(0x93c5fd, 1.4, 12);
    courtyardLight.position.set(-5, 3.5, 3.5);
    this.group.add(courtyardLight);
    this.lights.courtyard = courtyardLight;

    // Node 5: Security phosphor green terminal glow
    const securityLight = new THREE.PointLight(0x34d399, 1.4, 12);
    securityLight.position.set(5, 2.8, 3.5);
    this.group.add(securityLight);
    this.lights.security = securityLight;
  }

  // =========================================================================
  // 2. FACILITY FLOOR, WALLS & ATRIUM
  // =========================================================================
  buildFacilityFloor() {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.85, metalness: 0.2 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2b3340, roughness: 0.9 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });

    // Main facility floor (30m wide x 32m deep)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 32), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -2);
    this.group.add(floor);

    // North wall (behind Lab, Vault, Office)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(30, 4.5, 0.5), wallMat);
    northWall.position.set(0, 2.25, -16);
    this.group.add(northWall);

    // East wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 32), wallMat);
    eastWall.position.set(15, 2.25, -2);
    this.group.add(eastWall);

    // West wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 32), wallMat);
    westWall.position.set(-15, 2.25, -2);
    this.group.add(westWall);

    // South perimeter fence/barrier
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(30, 1.2, 0.4), metalMat);
    southWall.position.set(0, 0.6, 13);
    this.group.add(southWall);

    // Hazard guide stripes connecting nodes on floor
    const stripe1 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 20), stripeMat);
    stripe1.rotation.x = -Math.PI / 2;
    stripe1.position.set(0, 0.01, -2);
    this.group.add(stripe1);

    const stripe2 = new THREE.Mesh(new THREE.PlaneGeometry(24, 0.3), stripeMat);
    stripe2.rotation.x = -Math.PI / 2;
    stripe2.position.set(0, 0.01, -1);
    this.group.add(stripe2);

    // Support pillars
    const pillarGeo = new THREE.BoxGeometry(0.8, 4.5, 0.8);
    const pillarPositions = [
      [-3, 2.25, -5], [3, 2.25, -5],
      [-3, 2.25, 2], [3, 2.25, 2]
    ];
    pillarPositions.forEach(([px, py, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, metalMat);
      pillar.position.set(px, py, pz);
      this.group.add(pillar);
    });
  }

  // =========================================================================
  // 3. NODE 1: RESEARCH LABORATORY (X: -6, Z: -6)
  // =========================================================================
  buildNode1_Laboratory() {
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.3 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });

    // Lab Counter
    const bench = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.9, 1.4), benchMat);
    bench.position.set(-6, 0.45, -7);
    this.group.add(bench);

    // Mass Spectrometer / Centrifuge on Bench
    const spectro = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.9), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    spectro.position.set(-7, 1.3, -7);
    this.group.add(spectro);

    // Oscilloscope Screen
    const oscScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    oscScreen.position.set(-7, 1.4, -6.54);
    this.group.add(oscScreen);

    // Coolant Pressure Manifold Pipe
    const coolantPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), pipeMat);
    coolantPipe.rotation.z = Math.PI / 2;
    coolantPipe.position.set(-6, 1.8, -8.2);
    this.group.add(coolantPipe);

    // Pressure Gauge Dial
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), brassMat);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(-5.5, 2.1, -8.1);
    this.group.add(gauge);

    // Large Red Hydraulic Valve Wheel (Interactive Ripple Control)
    const valveGroup = new THREE.Group();
    valveGroup.position.set(-6.2, 1.8, -8.1);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 24), redMat);
    valveGroup.add(rim);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12), brassMat);
    hub.rotation.x = Math.PI / 2;
    valveGroup.add(hub);

    const spoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), brassMat);
    valveGroup.add(spoke1);

    const spoke2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), brassMat);
    spoke2.rotation.z = Math.PI / 2;
    valveGroup.add(spoke2);

    this.group.add(valveGroup);
    this.valveWheel = valveGroup;
  }

  // =========================================================================
  // 4. NODE 2: DIRECTOR'S OFFICE (X: +6, Z: -6)
  // =========================================================================
  buildNode2_DirectorOffice() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    // Julian Vance's Executive Mahogany Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.85, 1.8), woodMat);
    desk.position.set(6, 0.42, -6.5);
    this.group.add(desk);

    // Desk blotter & lamp
    const blotter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 1.0), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    blotter.position.set(6, 0.86, -6.5);
    this.group.add(blotter);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 16), goldMat);
    lampBase.position.set(7.2, 0.87, -6.8);
    this.group.add(lampBase);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    lampShade.position.set(7.2, 1.15, -6.8);
    this.group.add(lampShade);

    // Bookcase on East Wall
    const bookcase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 3.0), woodMat);
    bookcase.position.set(14.5, 1.6, -6.5);
    this.group.add(bookcase);

    // Biometric Wall Safe embedded in wall
    const safeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, 1.4), steelMat);
    safeFrame.position.set(7.6, 1.8, -7.5);
    this.group.add(safeFrame);

    const safeDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.2), steelMat);
    safeDoorMesh.position.set(7.66, 1.8, -7.5);

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16), goldMat);
    dial.rotation.z = Math.PI / 2;
    dial.position.set(-0.06, 0, 0);
    safeDoorMesh.add(dial);

    this.group.add(safeDoorMesh);
    this.safeDoor = safeDoorMesh;
  }

  // =========================================================================
  // 5. NODE 3: TEMPORAL VAULT (X: 0, Z: -12)
  // =========================================================================
  buildNode3_TemporalVault() {
    const vaultMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7c3aed, emissiveIntensity: 0.8, roughness: 0.1 });

    // Blast Archway
    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.0), vaultMat);
    archLeft.position.set(-3.2, 2.0, -13.5);
    this.group.add(archLeft);

    const archRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.0), vaultMat);
    archRight.position.set(3.2, 2.0, -13.5);
    this.group.add(archRight);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.0, 1.0), vaultMat);
    archTop.position.set(0, 3.8, -13.5);
    this.group.add(archTop);

    // Massive Circular Titanium Bulkhead Door
    const door = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.4, 32), vaultMat);
    door.rotation.x = Math.PI / 2;
    door.position.set(0, 2.0, -13.6);

    // Radial locking lugs
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.5), hazardMat);
      lug.position.set(Math.cos(angle) * 1.9, Math.sin(angle) * 1.9, 0);
      door.add(lug);
    }
    this.group.add(door);
    this.vaultBulkhead = door;

    // Tachyon Resonance Core Plinth
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.6, 8), vaultMat);
    plinth.position.set(0, 0.3, -11.0);
    this.group.add(plinth);

    // Floating Glowing Tachyon Ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 16, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 1.4, -11.0);
    this.group.add(ring);
    this.tachyonRing = ring;
  }

  // =========================================================================
  // 6. NODE 4: CENTRAL DRAINAGE COURTYARD (X: -5, Z: +4)
  // =========================================================================
  buildNode4_Courtyard() {
    const wetStoneMat = new THREE.MeshStandardMaterial({ color: 0x1e2631, roughness: 0.95 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 });

    // Recessed Courtyard Pit
    const pit = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.4, 6.0), wetStoneMat);
    pit.position.set(-5, 0.05, 4);
    this.group.add(pit);

    // Heavy Subterranean Iron Cistern Grate (Interactive Ripple Control)
    const grateGroup = new THREE.Group();
    grateGroup.position.set(-5, 0.26, 4);

    const grateFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 2.2), grateMat);
    grateGroup.add(grateFrame);

    for (let i = -0.9; i <= 0.9; i += 0.2) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 1.9), grateMat);
      bar.position.set(i, 0, 0);
      grateGroup.add(bar);
    }

    this.group.add(grateGroup);
    this.cisternGrate = grateGroup;
  }

  // =========================================================================
  // 7. NODE 5: SECURITY MAIN HUB (X: +5, Z: +4)
  // =========================================================================
  buildNode5_SecurityHub() {
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.4 });
    const crtMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

    // Mainframe Rack Cabinets
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 4.0), rackMat);
    rack.position.set(13.8, 1.6, 4.0);
    this.group.add(rack);

    // Reel-to-Reel Tape Drives
    for (let y = 1.4; y <= 2.4; y += 0.8) {
      for (let z = 3.2; z <= 4.8; z += 1.2) {
        const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 24), tapeMat);
        reel.rotation.z = Math.PI / 2;
        reel.position.set(13.18, y, z);
        this.group.add(reel);
        this.tapeReels.push(reel);
      }
    }

    // Security Operator Workstation Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 1.6), rackMat);
    desk.position.set(5.0, 0.42, 4.0);
    this.group.add(desk);

    // Bank of 3 CRT Surveillance Monitors
    const monOffsets = [-0.9, 0, 0.9];
    monOffsets.forEach((ox) => {
      const monBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.5), rackMat);
      monBox.position.set(5.0 + ox, 1.2, 3.8);
      this.group.add(monBox);

      const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.45), crtMat);
      monScreen.position.set(5.0 + ox, 1.2, 4.06);
      this.group.add(monScreen);
    });
  }

  // =========================================================================
  // 8. HOTSPOTS & CAMERA INTERACTION TARGETS
  // =========================================================================
  buildHotspots() {
    this.addHotspot(new THREE.Vector3(-6, 1.8, -7.5), 'INSPECT_VALVE', 'COOLANT PRESSURE MANIFOLD', 1);
    this.addHotspot(new THREE.Vector3(6.8, 1.8, -7.0), 'INSPECT_SAFE', 'BIOMETRIC WALL SAFE', 2);
    this.addHotspot(new THREE.Vector3(0, 2.0, -12.5), 'NODE_3_VAULT', 'TEMPORAL VAULT BULKHEAD', 3);
    this.addHotspot(new THREE.Vector3(-5, 0.5, 3.0), 'INSPECT_CISTERN', 'DRAINAGE CISTERN GRATE', 4);
    this.addHotspot(new THREE.Vector3(5, 1.5, 4.0), 'NODE_5_SECURITY', 'SECURITY SURVEILLANCE HUB', 5);
  }

  addHotspot(position, targetView, label, nodeNum) {
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 16), ringMat);
    ring.position.copy(position);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { targetView, label, node: nodeNum };

    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
    const hitDisc = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16), hitMat);
    hitDisc.position.copy(position);
    hitDisc.rotation.x = Math.PI / 2;
    hitDisc.userData = { targetView, label, node: nodeNum };

    this.group.add(ring);
    this.group.add(hitDisc);
    this.hotspots.push(ring);
    this.hotspots.push(hitDisc);
  }

  // =========================================================================
  // 9. ANIMATION LOOP & TICKS
  // =========================================================================
  update(time = 0, delta = 0.016) {
    // 1. Spin reel-to-reel tape drives in Node 5
    if (this.tapeReels && this.tapeReels.length > 0) {
      this.tapeReels.forEach((reel, idx) => {
        reel.rotation.x += delta * (idx % 2 === 0 ? 3.0 : -2.5);
      });
    }

    // 2. Rotate tachyon core ring in Node 3
    if (this.tachyonRing) {
      this.tachyonRing.rotation.z += delta * 1.5;
      this.tachyonRing.rotation.y += delta * 0.8;
    }

    // 3. Subtle pulsation of tachyon light
    if (this.lights.vault) {
      this.lights.vault.intensity = 2.0 + Math.sin(time * 3.5) * 0.4;
    }

    // 4. Subtle fluorescent flicker in lab
    if (this.lights.lab && Math.random() < 0.03) {
      this.lights.lab.intensity = 1.3 + (Math.random() * 0.5);
    }
  }

  // =========================================================================
  // 10. 1979 ARCHITECT HUD INJECTION
  // =========================================================================
  inject1979HUD() {
    // Hide legacy defuser hud & bomb quadrant bar
    const defHud = document.querySelector('.defuser-hud');
    const quadBar = document.getElementById('bomb-quadrant-bar');
    if (defHud) defHud.classList.add('hidden');
    if (quadBar) quadBar.classList.add('hidden');

    const existing = document.getElementById('triad-1979-hud');
    if (existing) existing.remove();

    const state = window.triadState;
    const currentNode = state ? state.meepleNodes['1979'] : 5;
    const currentNodeName = state ? state.nodeNames[currentNode - 1] : 'Security Hub';
    const stab = state ? state.chronalStability : 18;
    const ap = state ? state.ap['1979'] : 3;

    const hud = document.createElement('div');
    hud.id = 'triad-1979-hud';
    hud.className = 'triad-architect-hud';
    hud.innerHTML = `
      <div class="hud-top-bar glass-panel">
        <div class="station-identity">
          <span class="station-era-badge badge-1979">1979: THE ARCHITECT</span>
          <span class="station-sub-title">PRISTINE TEMPORAL RESEARCH FACILITY</span>
        </div>
        <div class="station-metrics">
          <div class="metric-chip">
            <span class="m-label">STABILITY:</span>
            <strong id="hud-1979-stab" class="m-val" style="color:${stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff')};">${stab}</strong>
          </div>
          <div class="metric-chip">
            <span class="m-label">ACTION POINTS:</span>
            <strong id="hud-1979-ap" class="m-val ap-val">${ap} / 3</strong>
          </div>
          <div class="metric-chip">
            <span class="m-label">LOCATION:</span>
            <strong id="hud-1979-loc" class="m-val">N${currentNode}: ${currentNodeName}</strong>
          </div>
          <button class="btn btn-primary btn-sm btn-matrix-toggle" onclick="triadRippleUI.openModal()">
            🌀 RIPPLE MATRIX
          </button>
        </div>
      </div>

      <!-- NODE MOVEMENT BAR -->
      <div class="triad-nodes-navbar glass-panel" style="margin-top: 6px;">
        <span class="nav-label">1979 MOVEMENT (1 AP):</span>
        <div class="nodes-nav-grid" id="hud-1979-nodes-grid">
          ${[1, 2, 3, 4, 5].map(n => `
            <button class="btn-node-nav ${currentNode === n ? 'active' : ''}" onclick="triadEnv.onMoveNode(${n})">
              <span class="node-num-tag">NODE ${n}</span>
              <span class="node-title-tag">${state ? state.nodeNames[n - 1] : ''}</span>
              ${currentNode === n ? '<span class="meeple-here-badge">YOU ARE HERE</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ARCHITECT ACTIONS & HAND DRAWER -->
      <div class="hud-actions-and-hand" style="display:flex; gap:12px; margin-top:8px;">
        <div class="hud-action-btns glass-panel" style="display:flex; flex-direction:column; gap:8px; padding:12px; min-width:200px;">
          <button class="btn btn-hud-action" onclick="triadEnv.onSearchClick()">🔍 SEARCH NODE (1 AP)</button>
          <button class="btn btn-hud-action" onclick="triadRippleUI.openModal()">🌀 TEMPORAL RIPPLE (2 AP)</button>
          <button class="btn btn-hud-action" onclick="triadRippleUI.openModal()">⚖️ CONSENSUS NOTEBOOK</button>
        </div>

        <div class="hud-hand-drawer glass-panel" id="hud-1979-hand-drawer" style="flex:1;">
          <div class="hand-drawer-header">
            <span>ARCHITECT PRIVATE HAND (WHISPER RULE APPLIES)</span>
          </div>
          <div class="hand-cards-list" id="hud-1979-cards-container">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    const container = document.getElementById('screen-defuser');
    if (container) {
      container.appendChild(hud);
      this.render1979Hand();
    }
  }

  renderHUD() {
    this.inject1979HUD();
  }

  onMoveNode(nodeNum) {
    if (!window.triadState) return;
    window.triadState.moveMeeple('1979', nodeNum);
    this.inject1979HUD();
    const viewKeys = ['', 'NODE_1_LAB', 'NODE_2_OFFICE', 'NODE_3_VAULT', 'NODE_4_COURTYARD', 'NODE_5_SECURITY'];
    if (window.bomb3D && viewKeys[nodeNum]) {
      window.bomb3D.setView(viewKeys[nodeNum]);
    }
  }

  render1979Hand() {
    const container = document.getElementById('hud-1979-cards-container');
    const apEl = document.getElementById('hud-1979-ap');
    if (!container || !window.triadState) return;

    if (apEl) apEl.innerText = `${window.triadState.ap['1979']} / 3`;

    const hand = window.triadState.hands['1979'];
    if (!hand || hand.length === 0) {
      container.innerHTML = '<div class="empty-hand" style="padding:10px; color:#888;">No cards in hand. Click SEARCH NODE (1 AP) to gather 1979 blueprints and items!</div>';
      return;
    }

    container.innerHTML = hand.map(card => {
      const canPlant = card.canPlant ? `<button class="btn btn-sm btn-plant" onclick="triadEnv.onPlantClick('${card.id}')">PLANT (1 AP)</button>` : '';
      return `
        <div class="hand-card-chip glass-panel">
          <div class="card-chip-top">
            <strong class="card-chip-title">${card.title}</strong>
            <span class="card-chip-type">${card.type}</span>
          </div>
          <p class="card-chip-desc">${card.text}</p>
          <div class="card-chip-actions">
            <button class="btn btn-sm btn-analyze" onclick="triadEnv.onAnalyzeClick('${card.id}')">ANALYZE (1 AP)</button>
            ${canPlant}
          </div>
        </div>
      `;
    }).join('');
  }

  onSearchClick() {
    if (!window.triadState) return;
    const ok = window.triadState.searchCurrentNode('1979');
    if (ok) this.render1979Hand();
  }

  onAnalyzeClick(cardId) {
    if (!window.triadState) return;
    const ok = window.triadState.analyzeCard('1979', cardId);
    if (ok) this.render1979Hand();
  }

  onPlantClick(cardId) {
    if (!window.triadState) return;
    const currentNode = window.triadState.meepleNodes['1979'];
    const ok = window.triadState.plantItem(cardId, currentNode);
    if (ok) this.render1979Hand();
  }
}

window.TriadEnvironment = TriadEnvironment;
