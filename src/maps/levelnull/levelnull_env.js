/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (THE SHIFTING BACKROOMS)
   3D Connected Multi-Room Traversal, Unlocking Doors & Dynamic Camera Dolly
   ========================================================================== */

class LevelNullEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.hotspots = [];
    this.currentRoom = 1;

    // Door meshes & animation states
    this.door1Mesh = null;
    this.door1Frame = null;
    this.door1Led = null;
    this.door1Open = false;
    this.door1TargetAngle = 0;

    this.door2Mesh = null;
    this.door2Wheel = null;
    this.door2Lugs = [];
    this.door2Open = false;
    this.door2TargetAngle = 0;

    this.quantumRing = null;
    this.portalVortex = null;
    this.portalOpen = false;
    this.prismMeshes = [];
    this.waterMesh = null;

    // Camera Presets for Seamless Navigation
    this.cameraPresets = {
      OVERVIEW: { pos: new THREE.Vector3(0, 1.6, 1.0), target: new THREE.Vector3(0, 1.2, -4.5), fov: 60, label: 'SECTOR 1: LIMINAL OFFICE' },
      ROOM_1: { pos: new THREE.Vector3(0, 1.6, 1.0), target: new THREE.Vector3(0, 1.2, -4.5), fov: 60, label: 'SECTOR 1: LIMINAL OFFICE' },
      INSPECT_BREAKER: { pos: new THREE.Vector3(-1.3, 1.4, -1.0), target: new THREE.Vector3(-2.3, 1.4, -1.0), fov: 42, label: 'BREAKER TERMINAL' },

      ROOM_2: { pos: new THREE.Vector3(0, 1.6, -10.5), target: new THREE.Vector3(0, 1.2, -18.0), fov: 56, label: 'SECTOR 2: HYDRO-SUBSTATION' },
      INSPECT_HYDRO: { pos: new THREE.Vector3(1.3, 1.3, -14.5), target: new THREE.Vector3(2.1, 1.3, -14.5), fov: 40, label: 'HYDROSTATIC MANIFOLD' },

      ROOM_3: { pos: new THREE.Vector3(0, 1.6, -24.0), target: new THREE.Vector3(0, 1.4, -31.5), fov: 58, label: 'SECTOR 3: QUANTUM CORE' },
      INSPECT_CORE: { pos: new THREE.Vector3(0, 1.35, -27.2), target: new THREE.Vector3(0, 1.3, -29.2), fov: 44, label: 'PRISM CALIBRATION' }
    };

    this.built = false;
    this.build();
    window.levelNullEnv = this;
  }

  build() {
    if (!this.built) {
      this.buildMultiRoomFacility();
      if (this.scene && this.group) {
        this.scene.add(this.group);
      }
      this.built = true;
    }
  }

  destroy() {
    this.cleanup();
  }

  buildMultiRoomFacility() {
    this.buildLighting();
    this.buildSector1_Office();
    this.buildCorridor1();
    this.buildSector2_Hydro();
    this.buildCorridor2();
    this.buildSector3_QuantumCore();
  }

  buildLighting() {
    // Ambient baseline
    const amb = new THREE.AmbientLight(0x222018, 0.7);
    this.group.add(amb);

    // Sector 1: Eerie fluorescent flicker light
    this.fluroLight = new THREE.PointLight(0xf5d76e, 1.4, 8);
    this.fluroLight.position.set(0, 2.7, -1.5);
    this.group.add(this.fluroLight);

    // Sector 2: Hydrostation deep cyan/teal water light
    this.hydroLight = new THREE.PointLight(0x00f0ff, 1.8, 12);
    this.hydroLight.position.set(0, 2.6, -14.0);
    this.group.add(this.hydroLight);

    // Sector 2 amber beacon
    this.beaconLight = new THREE.PointLight(0xffaa00, 1.2, 8);
    this.beaconLight.position.set(-1.8, 2.2, -16.0);
    this.group.add(this.beaconLight);

    // Sector 3: Quantum plasma glow
    this.quantumLight = new THREE.PointLight(0xc084fc, 2.2, 14);
    this.quantumLight.position.set(0, 2.4, -27.0);
    this.group.add(this.quantumLight);
  }

  // =========================================================================
  // SECTOR 1: LIMINAL DAMP OFFICE & INDUSTRIAL FIRE DOOR (Z: +2 to -4.5)
  // =========================================================================
  buildSector1_Office() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x5a5035, roughness: 0.85 }); // Damp tan/yellow
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x3d3522, roughness: 0.9 }); // Damp carpet
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x66604e, roughness: 0.95 });

    // Floor & Ceiling (Room: 5m wide, 6.5m deep)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 6.5), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -1.25);
    this.group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(5, 6.5), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 2.8, -1.25);
    this.group.add(ceiling);

    // Side Walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 2.8), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-2.5, 1.4, -1.25);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 2.8), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(2.5, 1.4, -1.25);
    this.group.add(rightWall);

    // Open Entry Threshold (No blocking back wall so entire room is in full panoramic view)
    const thresholdMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const thresholdBar = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.05, 0.1), thresholdMat);
    thresholdBar.position.set(0, 0.02, 2.0);
    this.group.add(thresholdBar);

    // Front Wall with Doorway Arch (leading to Door 1)
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.2), wallMat);
    wallLeft.position.set(-1.7, 1.4, -4.5);
    this.group.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.2), wallMat);
    wallRight.position.set(1.7, 1.4, -4.5);
    this.group.add(wallRight);

    const wallTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.2), wallMat);
    wallTop.position.set(0, 2.5, -4.5);
    this.group.add(wallTop);

    // Fluorescent Light Fixture
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffae6 });
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 2.2), fixtureMat);
    fixture.position.set(0, 2.76, -1.5);
    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 2.0), bulbMat);
    bulb.position.set(0, 2.72, -1.5);
    this.group.add(fixture);
    this.group.add(bulb);

    // Breaker Box Terminal (Mounted on Left Wall)
    const breakerBoxMat = new THREE.MeshStandardMaterial({ color: 0x333a30, metalness: 0.6, roughness: 0.4 });
    const breakerBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 1.2), breakerBoxMat);
    breakerBox.position.set(-2.3, 1.4, -1.0);
    breakerBox.userData = { targetView: 'INSPECT_BREAKER' };
    this.group.add(breakerBox);

    // Hotspot for Breaker Box
    this.createHotspotRing('INSPECT_BREAKER', new THREE.Vector3(-2.0, 1.4, -1.0), 'BREAKER CONSOLE');

    // DOOR 1: HEAVY INDUSTRIAL FIRE EXIT DOOR
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a1818, metalness: 0.5, roughness: 0.6 }); // Deep red steel fire door
    const barMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    // Pivot group for smooth door opening
    this.door1Pivot = new THREE.Group();
    this.door1Pivot.position.set(-0.85, 0, -4.5); // Pivot at left hinge

    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 0.08), doorMat);
    doorMesh.position.set(0.85, 1.1, 0); // Offset from hinge
    doorMesh.userData = { targetView: 'INSPECT_BREAKER' };

    // Cross-brace & push bar
    const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), barMat);
    pushBar.rotation.z = Math.PI / 2;
    pushBar.position.set(0.85, 1.0, 0.06);
    pushBar.userData = { targetView: 'INSPECT_BREAKER' };
    doorMesh.add(pushBar);

    // Mag-lock indicator LED
    this.door1LedMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    this.door1Led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), this.door1LedMat);
    this.door1Led.position.set(1.55, 1.9, 0.06);
    doorMesh.add(this.door1Led);

    this.door1Pivot.add(doorMesh);
    this.group.add(this.door1Pivot);

    // Hotspot for Door 1
    this.createHotspotRing('INSPECT_BREAKER', new THREE.Vector3(0, 1.2, -4.2), 'FIRE DOOR 1 (LOCKED)');
  }

  buildCorridor1() {
    // Dark concrete transit corridor (Z: -4.5 to -9.0)
    const concMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.5), concMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -6.75);
    this.group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.5), concMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 2.5, -6.75);
    this.group.add(ceiling);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.5), concMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-1.1, 1.25, -6.75);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.5), concMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(1.1, 1.25, -6.75);
    this.group.add(rightWall);
  }

  // =========================================================================
  // SECTOR 2: FLOODED HYDRO-SUBSTATION & SUB VAULT HATCH (Z: -9.0 to -18.0)
  // =========================================================================
  buildSector2_Hydro() {
    const hydroWallMat = new THREE.MeshStandardMaterial({ color: 0x0f2b33, roughness: 0.7, metalness: 0.3 }); // Dark industrial teal
    const metalGratingMat = new THREE.MeshStandardMaterial({ color: 0x223035, metalness: 0.8, roughness: 0.4 });

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 9), hydroWallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.0, -13.5);
    this.group.add(ceiling);

    // Walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.0), hydroWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.0, 1.5, -13.5);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.0), hydroWallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(3.0, 1.5, -13.5);
    this.group.add(rightWall);

    // Catwalk floor
    const catwalk = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 9.0), metalGratingMat);
    catwalk.position.set(0, 0.1, -13.5);
    this.group.add(catwalk);

    // DYNAMIC WATER PLANE (Flooded chamber)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x053540,
      metalness: 0.85,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82
    });
    this.waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 9.0), waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(0, 0.04, -13.5);
    this.group.add(this.waterMesh);

    // Industrial Pipes along the walls
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1d5440, metalness: 0.7, roughness: 0.3 });
    for (let i = 0; i < 3; i++) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9.0), pipeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(2.85, 0.6 + (i * 0.5), -13.5);
      this.group.add(pipe);
    }

    // Hydrostatic Manifold Console on Right Wall
    const manifoldBoxMat = new THREE.MeshStandardMaterial({ color: 0x0e3a40, metalness: 0.7, roughness: 0.3 });
    const manifoldBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.2, 1.4), manifoldBoxMat);
    manifoldBox.position.set(2.1, 1.3, -14.5);
    manifoldBox.userData = { targetView: 'INSPECT_HYDRO' };
    this.group.add(manifoldBox);

    this.createHotspotRing('INSPECT_HYDRO', new THREE.Vector3(1.8, 1.3, -14.5), 'HYDRO MANIFOLD');

    // Back partition wall with round aperture for Door 2
    const partWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.3), hydroWallMat);
    partWallLeft.position.set(-2.0, 1.5, -18.0);
    this.group.add(partWallLeft);

    const partWallRight = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.3), hydroWallMat);
    partWallRight.position.set(2.0, 1.5, -18.0);
    this.group.add(partWallRight);

    const partWallTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.3), hydroWallMat);
    partWallTop.position.set(0, 2.6, -18.0);
    this.group.add(partWallTop);

    // DOOR 2: HEAVY CIRCULAR SUBMARINE VAULT HATCH
    const subHatchMat = new THREE.MeshStandardMaterial({ color: 0x3d4e52, metalness: 0.85, roughness: 0.3 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

    // Pivot group at left hinge
    this.door2Pivot = new THREE.Group();
    this.door2Pivot.position.set(-0.95, 0, -18.0);

    // Circular hatch door
    const hatchMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.12, 32), subHatchMat);
    hatchMesh.rotation.x = Math.PI / 2;
    hatchMesh.position.set(0.95, 1.2, 0);
    hatchMesh.userData = { targetView: 'INSPECT_HYDRO' };

    // Central brass hand-wheel
    this.door2Wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 12, 24), brassMat);
    this.door2Wheel.position.set(0, 0.08, 0);
    this.door2Wheel.userData = { targetView: 'INSPECT_HYDRO' };
    hatchMesh.add(this.door2Wheel);

    // 6 Radial Locking Lugs
    this.door2Lugs = [];
    for (let l = 0; l < 6; l++) {
      const angle = (l / 6) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.06), brassMat);
      lug.position.set(Math.cos(angle) * 0.82, 0.04, Math.sin(angle) * 0.82);
      lug.rotation.y = angle;
      lug.userData = { targetView: 'INSPECT_HYDRO' };
      hatchMesh.add(lug);
      this.door2Lugs.push(lug);
    }

    this.door2Pivot.add(hatchMesh);
    this.group.add(this.door2Pivot);

    this.createHotspotRing('INSPECT_HYDRO', new THREE.Vector3(0, 1.2, -17.5), 'SUB HATCH (SEALED)');
  }

  buildCorridor2() {
    // Conduit passage to Quantum Core (Z: -18.0 to -22.5)
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.85 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.5), conduitMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -20.25);
    this.group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.5), conduitMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 2.5, -20.25);
    this.group.add(ceiling);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.5), conduitMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-1.1, 1.25, -20.25);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.5), conduitMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(1.1, 1.25, -20.25);
    this.group.add(rightWall);
  }

  // =========================================================================
  // SECTOR 3: QUANTUM RESONANCE CORE & REALITY ANCHOR PORTAL (Z: -22.5 to -32.0)
  // =========================================================================
  buildSector3_QuantumCore() {
    const titaniumMat = new THREE.MeshStandardMaterial({ color: 0x140e1f, metalness: 0.8, roughness: 0.3 }); // Dark alien obsidian/titanium
    const hexFloorMat = new THREE.MeshStandardMaterial({ color: 0x090510, metalness: 0.85, roughness: 0.2 });

    // Floor & Ceiling
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 9.5), hexFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -27.25);
    this.group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8, 9.5), titaniumMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.5, -27.25);
    this.group.add(ceiling);

    // Walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 3.5), titaniumMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-4.0, 1.75, -27.25);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 3.5), titaniumMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(4.0, 1.75, -27.25);
    this.group.add(rightWall);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.5), titaniumMat);
    backWall.position.set(0, 1.75, -32.0);
    this.group.add(backWall);

    // FLOATING QUANTUM RESONANCE RING (Centerpiece)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x9933ff,
      emissive: 0x7700ee,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1
    });
    this.quantumRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.08, 16, 48), ringMat);
    this.quantumRing.position.set(0, 1.7, -27.0);
    this.quantumRing.userData = { targetView: 'INSPECT_CORE' };
    this.group.add(this.quantumRing);

    // Inner secondary counter-rotating ring
    this.quantumInnerRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 16, 36), ringMat);
    this.quantumInnerRing.position.set(0, 1.7, -27.0);
    this.quantumInnerRing.userData = { targetView: 'INSPECT_CORE' };
    this.group.add(this.quantumInnerRing);

    this.createHotspotRing('INSPECT_CORE', new THREE.Vector3(0, 1.3, -25.5), 'PRISM CALIBRATION CLUSTER');

    // 3 OPTICAL PRISMS ON PEDESTALS
    this.prismMeshes = [];
    const prismPositions = [
      new THREE.Vector3(-1.8, 0, -26.0),
      new THREE.Vector3(1.8, 0, -26.0),
      new THREE.Vector3(0, 0, -24.5)
    ];

    const pedMat = new THREE.MeshStandardMaterial({ color: 0x222030, metalness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xdfb4ff,
      emissive: 0x441166,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    prismPositions.forEach((pos, idx) => {
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.9), pedMat);
      ped.position.set(pos.x, 0.45, pos.z);
      ped.userData = { targetView: 'INSPECT_CORE' };
      this.group.add(ped);

      const prism = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.55, 3), glassMat);
      prism.position.set(pos.x, 1.15, pos.z);
      prism.userData = { targetView: 'INSPECT_CORE' };
      this.group.add(prism);
      this.prismMeshes.push(prism);
    });

    // Calibration Console
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x1f1430, metalness: 0.7, roughness: 0.3 });
    const calibConsole = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 0.6), consoleMat);
    calibConsole.position.set(0, 0.8, -29.2);
    calibConsole.userData = { targetView: 'INSPECT_CORE' };
    this.group.add(calibConsole);

    this.createHotspotRing('INSPECT_CORE', new THREE.Vector3(0, 1.2, -28.8), 'REALITY ANCHOR TERMINAL');

    // FINAL EXTRACTION REALITY PORTAL GATEWAY (At back wall: Z: -31.8)
    const portalArchMat = new THREE.MeshStandardMaterial({ color: 0x2d1a45, metalness: 0.9, roughness: 0.1 });
    const portalArch = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.15, 16, 32, Math.PI), portalArchMat);
    portalArch.position.set(0, 1.2, -31.7);
    portalArch.userData = { targetView: 'INSPECT_CORE' };
    this.group.add(portalArch);

    // Portal vortex disc
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    this.portalVortex = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), vortexMat);
    this.portalVortex.position.set(0, 1.2, -31.75);
    this.portalVortex.userData = { targetView: 'INSPECT_CORE' };
    this.group.add(this.portalVortex);
  }

  // =========================================================================
  // DOOR UNLOCKING & PHYSICAL OPENING ANIMATIONS
  // =========================================================================
  openDoor1() {
    this.door1Open = true;
    this.door1TargetAngle = Math.PI / 2; // Swing 90 degrees open
    if (this.door1LedMat) {
      this.door1LedMat.color.setHex(0x00ff88); // Turn green!
    }
  }

  openDoor2() {
    this.door2Open = true;
    this.door2TargetAngle = -Math.PI / 2.2; // Swing submarine door open
  }

  openPortal() {
    this.portalOpen = true;
    if (this.portalVortex) {
      this.portalVortex.material.opacity = 0.95;
      this.portalVortex.material.color.setHex(0xffffff);
    }
  }

  updatePrismMesh(index, angleDeg) {
    if (this.prismMeshes[index]) {
      this.prismMeshes[index].rotation.y = (angleDeg * Math.PI) / 180;
    }
  }

  // =========================================================================
  // SMOOTH ROOM TRANSITION & DOLLY CONTROLLER
  // =========================================================================
  transitionToRoom(roomNum) {
    this.currentRoom = roomNum;

    // Update apparatus bar active states
    document.querySelectorAll('.levelnull-room-step').forEach(step => step.classList.remove('active'));
    const currentStep = document.getElementById(`step-room-${roomNum}`);
    if (currentStep) currentStep.classList.add('active');

    // Hide any previous advance overlays
    const adv1 = document.getElementById('levelnull-advance-room1');
    const adv2 = document.getElementById('levelnull-advance-room2');
    if (adv1) adv1.classList.add('hidden');
    if (adv2) adv2.classList.add('hidden');

    // Trigger bomb3d camera director
    const viewKey = `ROOM_${roomNum}`;
    if (window.bomb3D && window.bomb3D.setView) {
      window.bomb3D.setView(viewKey);
    }

    // Broadcast room advance to multiplayer peers
    if (window.game && window.game.network) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM_TRANSITION',
        room: roomNum
      });
    }

    // Refresh Intel Radar & Dossier
    if (window.LevelNullIntelView && window.LevelNullIntelView.setCurrentRoom) {
      window.LevelNullIntelView.setCurrentRoom(roomNum);
    }
    if (window.levelNullIntelView && window.levelNullIntelView.setCurrentRoom) {
      window.levelNullIntelView.setCurrentRoom(roomNum);
    }
  }

  createHotspotRing(targetView, position, label) {
    // 1. Visible pulsing glowing ring
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf5d76e, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.45, 32), ringMat);
    ring.position.copy(position);
    ring.lookAt(position.x, position.y + 1, position.z + 1);
    ring.userData = { targetView, label };

    // 2. Solid invisible hit target disc (1.2m radius) for effortless raycasting clicks!
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide });
    const hitDisc = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), hitMat);
    hitDisc.position.copy(position);
    hitDisc.lookAt(position.x, position.y + 1, position.z + 1);
    hitDisc.userData = { targetView, label };

    this.group.add(ring);
    this.group.add(hitDisc);
    this.hotspots.push(ring);
    this.hotspots.push(hitDisc);
  }

  update() {
    const time = performance.now() * 0.001;

    // Fluorescent subtle light hum & flicker
    if (this.fluroLight) {
      this.fluroLight.intensity = 1.35 + Math.sin(time * 30) * 0.08 + (Math.random() < 0.02 ? -0.4 : 0);
    }

    // Amber beacon rotation in hydrostation
    if (this.beaconLight) {
      this.beaconLight.intensity = 1.0 + Math.sin(time * 6) * 0.5;
    }

    // Door 1 Smooth Swing Animation
    if (this.door1Pivot) {
      this.door1Pivot.rotation.y = THREE.MathUtils.lerp(this.door1Pivot.rotation.y, this.door1TargetAngle, 0.05);
    }

    // Door 2 Submarine Hatch & Wheel Animation
    if (this.door2Pivot) {
      this.door2Pivot.rotation.y = THREE.MathUtils.lerp(this.door2Pivot.rotation.y, this.door2TargetAngle, 0.04);
      if (this.door2Wheel && this.door2Open) {
        this.door2Wheel.rotation.z += 0.05;
      }
    }

    // Quantum Ring Rotation
    if (this.quantumRing) {
      this.quantumRing.rotation.x = time * 0.4;
      this.quantumRing.rotation.y = time * 0.6;
    }
    if (this.quantumInnerRing) {
      this.quantumInnerRing.rotation.x = -time * 0.8;
      this.quantumInnerRing.rotation.z = time * 0.5;
    }

    // Portal Vortex Pulsing
    if (this.portalVortex) {
      this.portalVortex.rotation.z = time * (this.portalOpen ? 2.5 : 0.5);
    }

    // Gentle Water Ripple
    if (this.waterMesh) {
      this.waterMesh.position.y = 0.04 + Math.sin(time * 2.5) * 0.006;
    }
  }

  cleanup() {
    if (this.group && this.scene) {
      this.scene.remove(this.group);
    }
    window.levelNullEnv = null;
  }
}

window.LevelNullEnvironment = LevelNullEnvironment;
