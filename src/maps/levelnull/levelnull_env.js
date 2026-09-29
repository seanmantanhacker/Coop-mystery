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
      ROOM_1: { pos: new THREE.Vector3(0, 1.6, 1.0), target: new THREE.Vector3(0, 1.2, -4.5), fov: 60, label: 'SECTOR 1: CRIME SCENE' },
      INSPECT_FORENSICS: { pos: new THREE.Vector3(-1.3, 1.4, -1.0), target: new THREE.Vector3(-2.3, 1.4, -1.0), fov: 42, label: 'FORENSIC AUTOPSY' },
      INSPECT_BREAKER: { pos: new THREE.Vector3(-1.3, 1.4, -1.0), target: new THREE.Vector3(-2.3, 1.4, -1.0), fov: 42, label: 'BREAKER TERMINAL' },
      INSPECT_ARIS_TAPE: { pos: new THREE.Vector3(-0.8, 1.15, -0.9), target: new THREE.Vector3(-0.8, 0.82, -1.5), fov: 42, label: "DR. ARIS'S CASSETTE TAPE" },
      INSPECT_CRIME_LOG: { pos: new THREE.Vector3(1.3, 1.5, -2.0), target: new THREE.Vector3(1.95, 1.5, -2.0), fov: 40, label: 'PRELIMINARY AUTOPSY SLIP' },
      INSPECT_DOOR1: { pos: new THREE.Vector3(0, 1.4, -2.8), target: new THREE.Vector3(0, 1.2, -4.5), fov: 48, label: 'SECTOR 1 FIRE EXIT DOOR' },

      ROOM_2: { pos: new THREE.Vector3(0, 1.6, -10.5), target: new THREE.Vector3(0, 1.2, -18.0), fov: 56, label: 'SECTOR 2: HYDRO-SUBSTATION' },
      INSPECT_TIMELINE: { pos: new THREE.Vector3(1.3, 1.3, -14.5), target: new THREE.Vector3(2.1, 1.3, -14.5), fov: 40, label: 'KEYCARD MAINFRAME' },
      INSPECT_HYDRO: { pos: new THREE.Vector3(1.3, 1.3, -14.5), target: new THREE.Vector3(2.1, 1.3, -14.5), fov: 40, label: 'HYDROSTATIC MANIFOLD' },
      INSPECT_STOLEN_CARD: { pos: new THREE.Vector3(-0.8, 0.8, -12.4), target: new THREE.Vector3(-0.8, 0.15, -13.0), fov: 42, label: 'CLONED KEYCARD #04' },
      INSPECT_DOOR2: { pos: new THREE.Vector3(0, 1.35, -16.0), target: new THREE.Vector3(0, 1.2, -18.0), fov: 48, label: 'SUB VAULT HATCH' },

      ROOM_3: { pos: new THREE.Vector3(0, 1.6, -24.0), target: new THREE.Vector3(0, 1.4, -31.5), fov: 58, label: 'SECTOR 3: QUANTUM CORE' },
      INSPECT_INTERROGATION: { pos: new THREE.Vector3(-1.2, 1.4, -27.0), target: new THREE.Vector3(-2.2, 1.4, -27.0), fov: 42, label: 'WIRETAP SCANNER' },
      INSPECT_INDICTMENT: { pos: new THREE.Vector3(0, 1.35, -27.2), target: new THREE.Vector3(0, 1.3, -29.2), fov: 44, label: '8-PHOTO INVESTIGATION BOARD' },
      INSPECT_CORE: { pos: new THREE.Vector3(0, 1.35, -27.2), target: new THREE.Vector3(0, 1.3, -29.2), fov: 44, label: 'PRISM CALIBRATION' },
      INSPECT_WIRETAP_LORE: { pos: new THREE.Vector3(1.6, 1.25, -25.5), target: new THREE.Vector3(2.2, 0.88, -26.5), fov: 42, label: 'SIGINT TAPE INTERCEPT' }
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

    // =========================================================================
    // ROOM 1 DETAILS: ELECTRICAL CONDUITS, EXIT SIGN & DOORWAY HAZARD STRIPES
    // =========================================================================
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.3 });
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.5), conduitMat);
    pipe1.position.set(-2.28, 2.65, -2.75);
    pipe1.rotation.x = Math.PI / 2;
    this.group.add(pipe1);

    const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.2), conduitMat);
    pipe2.position.set(-2.28, 2.0, -1.0);
    this.group.add(pipe2);

    // Junction box
    const jBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), conduitMat);
    jBox.position.set(-2.28, 2.65, -1.0);
    this.group.add(jBox);

    // Glowing Green Emergency Exit Sign above Fire Door 1
    const exitSignMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const exitSignBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.08), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    exitSignBox.position.set(0, 2.32, -4.38);
    const exitFace = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.14), exitSignMat);
    exitFace.position.set(0, 2.32, -4.33);
    this.group.add(exitSignBox);
    this.group.add(exitFace);

    this.exitLight = new THREE.PointLight(0x00ff88, 0.7, 3.0);
    this.exitLight.position.set(0, 2.3, -4.2);
    this.group.add(this.exitLight);

    // Hazard Stripes framing the Fire Exit Archway
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xd4aa00 });
    [-0.95, 0.95].forEach(xP => {
      const stripeBar = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 2.3), hazardMat);
      stripeBar.position.set(xP, 1.15, -4.38);
      this.group.add(stripeBar);
    });

    // =========================================================================
    // ROOM 1 DETAILS: 4-DRAWER STEEL FILING CABINET (CORNER)
    // =========================================================================
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x2e352b, roughness: 0.6, metalness: 0.4 });
    const cabHandleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.2 });
    const cabGroup = new THREE.Group();
    cabGroup.position.set(-2.0, 0.68, -3.8);

    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.36, 0.65), cabMat);
    cabGroup.add(cabBody);

    for (let d = 0; d < 4; d++) {
      const dY = -0.48 + d * 0.32;
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.03), cabHandleMat);
      handle.position.set(0, dY, 0.34);
      cabGroup.add(handle);

      const labelTag = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.04), new THREE.MeshBasicMaterial({ color: 0xfffde8 }));
      labelTag.position.set(0, dY + 0.06, 0.33);
      cabGroup.add(labelTag);
    }
    this.group.add(cabGroup);

    // =========================================================================
    // ROOM 1 DETAILS: CRIME SCENE CHALK OUTLINE & EVIDENCE MARKERS
    // =========================================================================
    const chalkMat = new THREE.MeshBasicMaterial({ color: 0xe0e6ed, transparent: true, opacity: 0.75 });
    const chalkGroup = new THREE.Group();
    chalkGroup.position.set(0.65, 0.015, -1.75);

    // Torso, head, arms, legs chalk lines
    const chalkHead = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.15, 16), chalkMat);
    chalkHead.rotation.x = -Math.PI / 2;
    chalkHead.position.set(0, 0, -0.6);
    chalkGroup.add(chalkHead);

    const chalkTorso = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.7), chalkMat);
    chalkTorso.rotation.x = -Math.PI / 2;
    chalkTorso.position.set(0, 0, -0.15);
    chalkGroup.add(chalkTorso);

    // Dried dark crimson blood pool near head
    const bloodMat = new THREE.MeshStandardMaterial({ color: 0x4a0505, roughness: 0.3, metalness: 0.1 });
    const bloodPool = new THREE.Mesh(new THREE.CircleGeometry(0.24, 16), bloodMat);
    bloodPool.rotation.x = -Math.PI / 2;
    bloodPool.position.set(0.12, 0.005, -0.75);
    chalkGroup.add(bloodPool);

    // Forensic Evidence Markers [#1, #2, #3] (Yellow A-frame tents)
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4 });
    const markerOffsets = [
      { x: -0.35, z: -0.65 }, // Near head / blood
      { x: 0.38, z: -0.1 },   // Near torso
      { x: -0.25, z: 0.45 }   // Near feet
    ];
    markerOffsets.forEach(pos => {
      const tent = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 3), markerMat);
      tent.position.set(pos.x, 0.04, pos.z);
      chalkGroup.add(tent);
    });

    this.group.add(chalkGroup);

    // =========================================================================
    // ROOM 1 DETAILS: OPEN ALUMINUM FORENSIC EVIDENCE BRIEFCASE ON SIDE STAND
    // =========================================================================
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.65, 16), standMat);
    stand.position.set(1.65, 0.325, -0.6);
    this.group.add(stand);

    const aluCaseMat = new THREE.MeshStandardMaterial({ color: 0xb0b8c0, metalness: 0.9, roughness: 0.2 });
    const foamMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
    const caseGroup = new THREE.Group();
    caseGroup.position.set(1.65, 0.66, -0.6);
    caseGroup.rotation.y = -0.35;

    // Case bottom tray
    const caseBase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.26), aluCaseMat);
    caseGroup.add(caseBase);
    const foamInsert = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.035, 0.23), foamMat);
    foamInsert.position.set(0, 0.01, 0);
    caseGroup.add(foamInsert);

    // Case open lid (angled 100 degrees)
    const caseLid = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.26), aluCaseMat);
    caseLid.position.set(0, 0.12, -0.11);
    caseLid.rotation.x = -1.2;
    caseGroup.add(caseLid);

    // Sample vials inside foam insert (Glass test tubes with colored reagents)
    const vialGlassMat = new THREE.MeshStandardMaterial({ color: 0xaaccff, transparent: true, opacity: 0.7, roughness: 0.1 });
    const vialCapMat = new THREE.MeshStandardMaterial({ color: 0xdd2222, roughness: 0.5 });
    for (let v = 0; v < 4; v++) {
      const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 8), vialGlassMat);
      vial.rotation.x = Math.PI / 2;
      vial.position.set(-0.1 + v * 0.065, 0.025, 0.02);
      caseGroup.add(vial);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.016, 8), vialCapMat);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(-0.1 + v * 0.065, 0.025, -0.02);
      caseGroup.add(cap);
    }
    this.group.add(caseGroup);

    // =========================================================================
    // ROOM 1 DETAILS: WALL CORK NOTICE BOARD WITH OFFICIAL INCIDENT MEMOS
    // =========================================================================
    const boardWoodMat = new THREE.MeshStandardMaterial({ color: 0x7a4d28, roughness: 0.8 });
    const boardCorkMat = new THREE.MeshStandardMaterial({ color: 0xa87747, roughness: 0.9 });
    const noticeGroup = new THREE.Group();
    noticeGroup.position.set(-2.28, 1.7, -2.8);
    noticeGroup.rotation.y = Math.PI / 2;

    const nFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.03), boardWoodMat);
    noticeGroup.add(nFrame);
    const nCork = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.54), boardCorkMat);
    nCork.position.set(0, 0, 0.016);
    noticeGroup.add(nCork);

    // Pinned memo papers
    const memoMat1 = new THREE.MeshStandardMaterial({ color: 0xfffae8, roughness: 0.85 });
    const memoMat2 = new THREE.MeshStandardMaterial({ color: 0xffe0e0, roughness: 0.85 });
    const memo1 = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), memoMat1);
    memo1.position.set(-0.24, 0.06, 0.02);
    memo1.rotation.z = 0.05;
    noticeGroup.add(memo1);

    const memo2 = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.22), memoMat2);
    memo2.position.set(0.18, -0.05, 0.02);
    memo2.rotation.z = -0.08;
    noticeGroup.add(memo2);
    this.group.add(noticeGroup);

    // Ceiling Dual Fluorescent Light Fixture with Wire Suspension
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 });
    const tubeGlowMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
    const fixBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 1.6), fixtureMat);
    fixBox.position.set(0, 2.75, -2.0);
    this.group.add(fixBox);

    [-0.08, 0.08].forEach(tX => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.45, 12), tubeGlowMat);
      tube.rotation.x = Math.PI / 2;
      tube.position.set(tX, 2.7, -2.0);
      this.group.add(tube);
    });

    // =========================================================================
    // ROOM 1 DETAILS: 1980s VINTAGE STEEL OFFICE DESK & PROPS
    // =========================================================================
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-0.8, 0, -1.5);

    // Desktop Surface (Dark Walnut with Chrome Trim)
    const deskTopMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.65 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.92), deskTopMat);
    deskTop.position.set(0, 0.76, 0);
    deskGroup.add(deskTop);

    // Dark Green Vinyl Writing Blotter Pad
    const blotterMat = new THREE.MeshStandardMaterial({ color: 0x1a3328, roughness: 0.85 });
    const blotter = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.006, 0.58), blotterMat);
    blotter.position.set(0, 0.788, 0.02);
    deskGroup.add(blotter);

    // Left & Right Drawer Pedestals
    const pedMat1 = new THREE.MeshStandardMaterial({ color: 0x23272d, roughness: 0.6, metalness: 0.4 });
    [-0.56, 0.56].forEach(pX => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.72, 0.84), pedMat1);
      ped.position.set(pX, 0.36, 0);
      deskGroup.add(ped);

      for (let d = 0; d < 3; d++) {
        const dY = 0.15 + d * 0.22;
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.03), cabHandleMat);
        handle.position.set(pX, dY, 0.43);
        deskGroup.add(handle);
      }
    });

    // Modesty Panel between pedestals
    const modesty = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.48, 0.03), pedMat1);
    modesty.position.set(0, 0.48, -0.38);
    deskGroup.add(modesty);

    // Banker's Desk Lamp with Emerald Green Glass Shade
    const brassLampMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const greenShadeMat = new THREE.MeshStandardMaterial({ color: 0x085e3a, roughness: 0.2, metalness: 0.2 });

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.02, 16), brassLampMat);
    lampBase.position.set(-0.55, 0.795, -0.22);
    deskGroup.add(lampBase);

    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25), brassLampMat);
    lampArm.position.set(-0.55, 0.92, -0.22);
    deskGroup.add(lampArm);

    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.18, 16, 1, false, 0, Math.PI), greenShadeMat);
    lampShade.rotation.z = Math.PI / 2;
    lampShade.rotation.y = Math.PI / 2;
    lampShade.position.set(-0.55, 1.04, -0.2);
    deskGroup.add(lampShade);

    // Warm local cone of light over the desk documents
    this.deskLampLight = new THREE.PointLight(0xffeedd, 1.2, 2.5);
    this.deskLampLight.position.set(-0.55, 1.0, -0.2);
    deskGroup.add(this.deskLampLight);

    // Spilled White Porcelain Coffee Mug with dark puddle
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.3 });
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 16), mugMat);
    mug.rotation.z = Math.PI / 2;
    mug.position.set(0.35, 0.825, 0.2);
    deskGroup.add(mug);

    const coffeeSpillMat = new THREE.MeshStandardMaterial({ color: 0x221208, roughness: 0.4 });
    const coffeePuddle = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), coffeeSpillMat);
    coffeePuddle.rotation.x = -Math.PI / 2;
    coffeePuddle.position.set(0.28, 0.792, 0.2);
    deskGroup.add(coffeePuddle);

    // Vintage Olive Rotary Telephone
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x3b4235, roughness: 0.6 });
    const phoneBase = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.16), phoneMat);
    phoneBase.position.set(-0.52, 0.815, 0.18);
    deskGroup.add(phoneBase);

    const handset = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.05), phoneMat);
    handset.position.set(-0.52, 0.86, 0.18);
    deskGroup.add(handset);

    // Scattered Manila Folders & Classified Documents on Desk
    const folderMat = new THREE.MeshStandardMaterial({ color: 0xccb27f, roughness: 0.85 });
    const docMat = new THREE.MeshStandardMaterial({ color: 0xfffcf0, roughness: 0.9 });

    const folder1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.008, 0.32), folderMat);
    folder1.position.set(-0.25, 0.795, -0.15);
    folder1.rotation.y = 0.2;
    deskGroup.add(folder1);

    const folder2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.006, 0.3), docMat);
    folder2.position.set(0.25, 0.795, -0.12);
    folder2.rotation.y = -0.3;
    deskGroup.add(folder2);

    this.group.add(deskGroup);

    // Breaker Box Terminal (Mounted on Left Wall)
    const breakerBoxMat = new THREE.MeshStandardMaterial({ color: 0x333a30, metalness: 0.6, roughness: 0.4 });
    const breakerBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 1.2), breakerBoxMat);
    breakerBox.position.set(-2.3, 1.4, -1.0);
    breakerBox.userData = { targetView: 'INSPECT_BREAKER' };
    this.group.add(breakerBox);

    // Hotspot for Breaker Box & Forensics
    this.createHotspotRing('INSPECT_FORENSICS', new THREE.Vector3(-2.0, 1.4, -1.0), 'FORENSIC AUTOPSY', 1);

    // =========================================================================
    // Clickable Lore Prop: 1980s Portable Microcassette Recorder (Dr. Aris's Dictaphone)
    // =========================================================================
    const recorderGroup = new THREE.Group();
    recorderGroup.position.set(-0.8, 0.82, -1.5);
    recorderGroup.userData = { targetView: 'INSPECT_ARIS_TAPE', isLoreProp: true, loreId: 'levelnull_aris_tape' };

    // 1. Main Body Chassis (Vintage 1980s Dark Matte Plastic with Chamfered Edges)
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1f2226, roughness: 0.55, metalness: 0.3 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.17), chassisMat);
    chassis.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(chassis);

    // 2. Brushed Aluminum Face Plate
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x9ba2a8, metalness: 0.8, roughness: 0.25 });
    const trimPlate = new THREE.Mesh(new THREE.BoxGeometry(0.246, 0.004, 0.158), trimMat);
    trimPlate.position.set(0, 0.024, 0);
    trimPlate.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(trimPlate);

    // 3. Cassette Well Compartment with Transparent Smoked Acrylic Door
    const wellMat = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, roughness: 0.9 });
    const cassetteWell = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.008, 0.082), wellMat);
    cassetteWell.position.set(0.04, 0.026, 0.015);
    cassetteWell.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(cassetteWell);

    const glassLidMat = new THREE.MeshStandardMaterial({
      color: 0x445566,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9
    });
    const glassLid = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.003, 0.08), glassLidMat);
    glassLid.position.set(0.04, 0.031, 0.015);
    glassLid.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(glassLid);

    // 4. Compact Cassette Shell inside the window (Cream/Off-White Shell)
    const cassetteShellMat = new THREE.MeshStandardMaterial({ color: 0xded9cc, roughness: 0.65 });
    const cassetteShell = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.007, 0.068), cassetteShellMat);
    cassetteShell.position.set(0.04, 0.026, 0.015);
    cassetteShell.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(cassetteShell);

    // Cassette Center Label (Warm Cream Paper)
    const labelStickerMat = new THREE.MeshStandardMaterial({ color: 0xfffde8, roughness: 0.9 });
    const labelSticker = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.028), labelStickerMat);
    labelSticker.rotation.x = -Math.PI / 2;
    labelSticker.position.set(0.04, 0.0305, 0.015);
    labelSticker.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(labelSticker);

    // Two White Tape Hubs / Spools & Dark Magnetic Oxide Tape
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x3d231a, roughness: 0.8 }); // Ferric brown ribbon

    [-0.024, 0.024].forEach(xOff => {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.009, 16), hubMat);
      hub.position.set(0.04 + xOff, 0.027, 0.015);
      hub.userData = { targetView: 'INSPECT_ARIS_TAPE' };
      recorderGroup.add(hub);

      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.007, 16), ribbonMat);
      ribbon.position.set(0.04 + xOff, 0.026, 0.015);
      ribbon.userData = { targetView: 'INSPECT_ARIS_TAPE' };
      recorderGroup.add(ribbon);
    });

    // 5. Speaker Grille Slots on Left Side
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x111316, roughness: 0.8 });
    for (let s = -0.042; s <= 0.042; s += 0.014) {
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.002, 0.005), grilleMat);
      slit.position.set(-0.075, 0.026, s);
      slit.userData = { targetView: 'INSPECT_ARIS_TAPE' };
      recorderGroup.add(slit);
    }

    // 6. Mechanical Buttons along Front Edge ([REC], [PLAY], [REW], [STOP])
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.85, roughness: 0.25 });
    const recButtonMat = new THREE.MeshStandardMaterial({ color: 0xdd2222, metalness: 0.5, roughness: 0.35 });
    const btnPositions = [-0.07, -0.025, 0.02, 0.065];

    btnPositions.forEach((xPos, bIdx) => {
      const isRec = (bIdx === 0);
      const btn = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, 0.022), isRec ? recButtonMat : buttonMat);
      btn.position.set(xPos, 0.024, 0.075);
      btn.userData = { targetView: 'INSPECT_ARIS_TAPE' };
      recorderGroup.add(btn);
    });

    // 7. Active Recording Indicator LED (Glowing Red)
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 12), ledMat);
    recLed.position.set(-0.1, 0.028, 0.06);
    recLed.userData = { targetView: 'INSPECT_ARIS_TAPE' };
    recorderGroup.add(recLed);

    this.tapeLed = new THREE.PointLight(0xff2222, 0.6, 0.8);
    this.tapeLed.position.set(-0.8 - 0.1, 0.82 + 0.04, -1.5 + 0.06);
    this.group.add(this.tapeLed);

    this.group.add(recorderGroup);
    this.createHotspotRing('INSPECT_ARIS_TAPE', new THREE.Vector3(-0.8, 0.88, -1.45), 'DR. ARIS DYING CASSETTE', 1);

    // Clickable Lore Prop: Preliminary Autopsy Report Clipboard
    const clipGroup = new THREE.Group();
    clipGroup.position.set(1.95, 1.5, -2.0);
    clipGroup.userData = { targetView: 'INSPECT_CRIME_LOG', isLoreProp: true, loreId: 'levelnull_autopsy_slip' };

    // Wooden Board Base
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.75 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.26), boardMat);
    board.userData = { targetView: 'INSPECT_CRIME_LOG' };
    clipGroup.add(board);

    // Paper Sheet with Official Header
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfdfaf2, roughness: 0.9 });
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.34, 0.23), paperMat);
    paper.position.set(-0.016, -0.01, 0);
    paper.userData = { targetView: 'INSPECT_CRIME_LOG' };
    clipGroup.add(paper);

    // Silver Metal Fastener Clip at the top
    const metalClipMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const clipTop = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.12), metalClipMat);
    clipTop.position.set(-0.01, 0.17, 0);
    clipTop.userData = { targetView: 'INSPECT_CRIME_LOG' };
    clipGroup.add(clipTop);

    this.group.add(clipGroup);
    this.createHotspotRing('INSPECT_CRIME_LOG', new THREE.Vector3(1.7, 1.5, -2.0), 'PRELIMINARY AUTOPSY SLIP', 1);

    // DOOR 1: HEAVY INDUSTRIAL FIRE EXIT DOOR
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a1818, metalness: 0.5, roughness: 0.6 }); // Deep red steel fire door
    const barMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    // Pivot group for smooth door opening
    this.door1Pivot = new THREE.Group();
    this.door1Pivot.position.set(-0.85, 0, -4.5); // Pivot at left hinge

    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 0.08), doorMat);
    doorMesh.position.set(0.85, 1.1, 0); // Offset from hinge
    doorMesh.userData = { targetView: 'INSPECT_DOOR1' };

    // Cross-brace & push bar
    const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), barMat);
    pushBar.rotation.z = Math.PI / 2;
    pushBar.position.set(0.85, 1.0, 0.06);
    pushBar.userData = { targetView: 'INSPECT_DOOR1' };
    doorMesh.add(pushBar);

    // Mag-lock indicator LED
    this.door1LedMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    this.door1Led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), this.door1LedMat);
    this.door1Led.position.set(1.55, 1.9, 0.06);
    doorMesh.add(this.door1Led);

    this.door1Pivot.add(doorMesh);
    this.group.add(this.door1Pivot);

    // Hotspot for Door 1
    this.createHotspotRing('INSPECT_DOOR1', new THREE.Vector3(0, 1.2, -4.2), 'FIRE DOOR 1', 1);
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

    // =========================================================================
    // ROOM 2 DETAILS: OVERHEAD CATWALK, STEAM PIPES, VALVE WHEELS & GAUGES
    // =========================================================================
    // Overhead Heavy Catwalk with Railings
    const overCatwalk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 8.5), metalGratingMat);
    overCatwalk.position.set(0, 2.45, -13.5);
    this.group.add(overCatwalk);

    // Yellow Safety Railings
    const railMat = new THREE.MeshStandardMaterial({ color: 0xccaa00, metalness: 0.7, roughness: 0.3 });
    [-0.8, 0.8].forEach(rX => {
      const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 8.5), railMat);
      topRail.rotation.x = Math.PI / 2;
      topRail.position.set(rX, 2.85, -13.5);
      this.group.add(topRail);
    });

    // High Pressure Steam Pipes & Red Valves on Left Wall
    const leftPipeMat = new THREE.MeshStandardMaterial({ color: 0x25353d, metalness: 0.85, roughness: 0.25 });
    const redValveMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.6, roughness: 0.3 });
    const gaugeMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.3 });

    for (let p = 0; p < 2; p++) {
      const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 8.5), leftPipeMat);
      pipeL.rotation.x = Math.PI / 2;
      pipeL.position.set(-2.88, 1.1 + p * 0.6, -13.5);
      this.group.add(pipeL);

      // Red Valve Handwheel
      const vWheel = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 12, 20), redValveMat);
      vWheel.rotation.y = Math.PI / 2;
      vWheel.position.set(-2.75, 1.1 + p * 0.6, -12.5 - p * 2.0);
      this.group.add(vWheel);

      // Analog Pressure Gauge
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), gaugeMat);
      gauge.rotation.z = Math.PI / 2;
      gauge.position.set(-2.78, 1.25 + p * 0.6, -14.5);
      this.group.add(gauge);
    }

    // 55-Gallon Chemical Hazard Drums (Flooded Chamber Debris)
    const drumMatStanding = new THREE.MeshStandardMaterial({ color: 0x3d4a36, roughness: 0.6, metalness: 0.4 });
    const drumMatFloating = new THREE.MeshStandardMaterial({ color: 0x997722, roughness: 0.7, metalness: 0.5 }); // Rusted yellow drum

    const drumStanding = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 16), drumMatStanding);
    drumStanding.position.set(-2.2, 0.48, -10.5);
    this.group.add(drumStanding);

    const drumFloating = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 16), drumMatFloating);
    drumFloating.rotation.z = 0.55;
    drumFloating.rotation.x = 0.3;
    drumFloating.position.set(-1.4, 0.22, -12.5);
    this.group.add(drumFloating);

    // Floating Yellow Caution Tape Strip
    const cautionTapeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
    const tapeStrip = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.07), cautionTapeMat);
    tapeStrip.rotation.x = -Math.PI / 2.2;
    tapeStrip.position.set(0, 0.08, -11.0);
    this.group.add(tapeStrip);

    // =========================================================================
    // ROOM 2 DETAILS: SCUBA / EMERGENCY RESPIRATOR LOCKER (RIGHT WALL)
    // =========================================================================
    const lockerGroup = new THREE.Group();
    lockerGroup.position.set(2.88, 1.45, -11.5);
    lockerGroup.rotation.y = -Math.PI / 2;

    const lockerCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.25, 0.32), new THREE.MeshStandardMaterial({ color: 0x1f2e2b, roughness: 0.6 }));
    lockerGroup.add(lockerCabinet);

    // Glass inspection window
    const lWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.95), new THREE.MeshStandardMaterial({ color: 0x55ffff, transparent: true, opacity: 0.35, roughness: 0.1 }));
    lWindow.position.set(0, 0, 0.165);
    lockerGroup.add(lWindow);

    // Twin Yellow High-Pressure Scuba Tanks inside locker
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.6, roughness: 0.3 });
    [-0.14, 0.14].forEach(tX => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.72, 16), tankMat);
      tank.position.set(tX, -0.05, 0.04);
      lockerGroup.add(tank);
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      valve.position.set(tX, 0.35, 0.04);
      lockerGroup.add(valve);
    });
    this.group.add(lockerGroup);

    // =========================================================================
    // ROOM 2 DETAILS: STEAM LEAK JET & WALL FLOOD DEPTH RULER
    // =========================================================================
    // White enameled flood depth ruler on left wall
    const rulerGroup = new THREE.Group();
    rulerGroup.position.set(-2.95, 0.75, -11.5);
    rulerGroup.rotation.y = Math.PI / 2;
    const rulerPlank = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.4), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
    rulerGroup.add(rulerPlank);
    for (let cm = -0.6; cm <= 0.6; cm += 0.15) {
      const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.015), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      mark.position.set(0, cm, 0.002);
      rulerGroup.add(mark);
    }
    this.group.add(rulerGroup);

    // Pulsing steam leak plume cone on upper steam pipe
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xddeeff, transparent: true, opacity: 0.45 });
    this.steamPlume = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 8), steamMat);
    this.steamPlume.rotation.z = -Math.PI / 2.3;
    this.steamPlume.position.set(-2.7, 1.7, -13.0);
    this.group.add(this.steamPlume);

    // Hotspot for Hydro Manifold & Keycard Timeline
    this.createHotspotRing('INSPECT_TIMELINE', new THREE.Vector3(1.8, 1.3, -14.5), 'KEYCARD MAINFRAME TIMELINE', 2);

    // =========================================================================
    // ROOM 2 DETAILS: DETAILED DROPPED CLONED KEYCARD PROP (LANYARD & CHIP)
    // =========================================================================
    const keycardGroup = new THREE.Group();
    keycardGroup.position.set(-0.8, 0.15, -13.0);
    keycardGroup.rotation.y = 0.4;
    keycardGroup.userData = { targetView: 'INSPECT_STOLEN_CARD', isLoreProp: true, loreId: 'levelnull_stolen_keycard' };

    // Plastic ID Card Body
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.2 });
    const cardMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.008, 0.22), cardMat);
    cardMesh.userData = { targetView: 'INSPECT_STOLEN_CARD' };
    keycardGroup.add(cardMesh);

    // Photo Box & Barcode
    const photoMat = new THREE.MeshStandardMaterial({ color: 0x334466 });
    const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.08), photoMat);
    photoMesh.rotation.x = -Math.PI / 2;
    photoMesh.position.set(-0.02, 0.005, -0.04);
    photoMesh.userData = { targetView: 'INSPECT_STOLEN_CARD' };
    keycardGroup.add(photoMesh);

    // Black Magnetic Stripe on Back
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const magStripe = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.03), stripeMat);
    magStripe.rotation.x = -Math.PI / 2;
    magStripe.position.set(0, 0.005, 0.06);
    magStripe.userData = { targetView: 'INSPECT_STOLEN_CARD' };
    keycardGroup.add(magStripe);

    // Black Nylon Lanyard Ribbon extending out
    const lanyardMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const lanyard = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.003, 0.35), lanyardMat);
    lanyard.position.set(0.06, 0.002, 0.18);
    lanyard.rotation.y = -0.3;
    lanyard.userData = { targetView: 'INSPECT_STOLEN_CARD' };
    keycardGroup.add(lanyard);

    this.group.add(keycardGroup);
    this.createHotspotRing('INSPECT_STOLEN_CARD', new THREE.Vector3(-0.8, 0.3, -13.0), 'DROPPED CLONED KEYCARD', 2);

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
    hatchMesh.userData = { targetView: 'INSPECT_DOOR2' };

    // Central brass hand-wheel
    this.door2Wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 12, 24), brassMat);
    this.door2Wheel.position.set(0, 0.08, 0);
    this.door2Wheel.userData = { targetView: 'INSPECT_DOOR2' };
    hatchMesh.add(this.door2Wheel);

    // 6 Radial Locking Lugs
    this.door2Lugs = [];
    for (let l = 0; l < 6; l++) {
      const angle = (l / 6) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.06), brassMat);
      lug.position.set(Math.cos(angle) * 0.82, 0.04, Math.sin(angle) * 0.82);
      lug.rotation.y = angle;
      lug.userData = { targetView: 'INSPECT_DOOR2' };
      hatchMesh.add(lug);
      this.door2Lugs.push(lug);
    }

    this.door2Pivot.add(hatchMesh);
    this.group.add(this.door2Pivot);

    this.createHotspotRing('INSPECT_DOOR2', new THREE.Vector3(0, 1.2, -17.5), 'SUB HATCH (SEALED)', 2);
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
    this.quantumInnerRing.userData = { targetView: 'INSPECT_INDICTMENT' };
    this.group.add(this.quantumInnerRing);

    // Orbiting Plasma Spark Nodes on Quantum Ring
    this.quantumNodes = [];
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    for (let s = 0; s < 4; s++) {
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), sparkMat);
      this.group.add(spark);
      this.quantumNodes.push(spark);
    }

    // Glowing Floor Plasma Conduits converging on Central Platform
    const conduitGlowMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    for (let c = -1; c <= 1; c++) {
      const cLine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 5.0), conduitGlowMat);
      cLine.position.set(c * 1.5, 0.015, -27.0);
      this.group.add(cLine);
    }

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
      ped.userData = { targetView: 'INSPECT_INDICTMENT' };
      this.group.add(ped);

      const prism = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.55, 3), glassMat);
      prism.position.set(pos.x, 1.15, pos.z);
      prism.userData = { targetView: 'INSPECT_INDICTMENT' };
      this.group.add(prism);
      this.prismMeshes.push(prism);

      // Warning Trefoil Hazard Badge on Pedestal
      const hazardBadge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
      hazardBadge.position.set(pos.x, 0.55, pos.z + 0.22);
      this.group.add(hazardBadge);

      // Optical Laser Beam connecting Prism to Quantum Core Center
      const beamMat = new THREE.MeshBasicMaterial({
        color: (idx === 0) ? 0x00ffff : (idx === 1 ? 0xc084fc : 0xff33bb),
        transparent: true,
        opacity: 0.65
      });
      const coreCenter = new THREE.Vector3(0, 1.7, -27.0);
      const prismTip = new THREE.Vector3(pos.x, 1.35, pos.z);
      const beamDist = prismTip.distanceTo(coreCenter);
      const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, beamDist, 8);
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.copy(prismTip.clone().add(coreCenter).multiplyScalar(0.5));
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coreCenter.clone().sub(prismTip).normalize());
      this.group.add(beamMesh);
    });

    // =========================================================================
    // ROOM 3 DETAILS: ADVANCED MULTI-SCREEN MAINFRAME INDICTMENT CONSOLE
    // =========================================================================
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, 0, -28.8);
    consoleGroup.userData = { targetView: 'INSPECT_INDICTMENT' };

    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x160f24, metalness: 0.7, roughness: 0.35 });
    const calibConsole = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.75), consoleMat);
    calibConsole.position.set(0, 0.48, 0);
    calibConsole.userData = { targetView: 'INSPECT_INDICTMENT' };
    consoleGroup.add(calibConsole);

    // Angled Triple CRT Display Hood
    const hoodMat = new THREE.MeshStandardMaterial({ color: 0x0f0a18, metalness: 0.8 });
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.35), hoodMat);
    hood.position.set(0, 1.15, -0.12);
    hood.rotation.x = -0.15;
    hood.userData = { targetView: 'INSPECT_INDICTMENT' };
    consoleGroup.add(hood);

    // 3 Phosphor CRT Screens (Violet & Amber Phosphor)
    const crtScreenMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed });
    const crtAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    [-0.7, 0, 0.7].forEach((sX, i) => {
      const crt = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.4), (i === 1) ? crtScreenMat : crtAmberMat);
      crt.position.set(sX, 1.15, 0.06);
      crt.rotation.x = -0.15;
      crt.userData = { targetView: 'INSPECT_INDICTMENT' };
      consoleGroup.add(crt);
    });

    // Heavy Umbilical Cables spilling onto floor
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    for (let cb = -2; cb <= 2; cb++) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), cableMat);
      cable.rotation.x = Math.PI / 2.3;
      cable.rotation.z = cb * 0.15;
      cable.position.set(cb * 0.25, 0.08, 0.45);
      consoleGroup.add(cable);
    }
    this.group.add(consoleGroup);

    // =========================================================================
    // ROOM 3 HOTSPOTS: EXACTLY 3 DISTINCT, SEPARATED STATIONS (NO DUPLICATES)
    // 1. Left: Wiretap Scanner at (-2.2, 1.35, -26.5)
    // 2. Center: Grand Indictment 8-Photo Board at (0, 1.45, -28.5) (SOLITARY CENTER RING)
    // 3. Right: SIGINT Wiretap Audio Tape Prop at (2.2, 1.05, -26.5)
    // =========================================================================
    this.createHotspotRing('INSPECT_INTERROGATION', new THREE.Vector3(-2.2, 1.35, -26.5), 'WIRETAP DEMODULATOR', 3);
    this.createHotspotRing('INSPECT_INDICTMENT', new THREE.Vector3(0, 1.45, -28.5), '8-PHOTO INVESTIGATION BOARD', 3);

    // Clickable Lore Prop: SIGINT Wiretap Audio Tape on Right Pedestal Station
    const sigMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const sigPed = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.85, 16), new THREE.MeshStandardMaterial({ color: 0x222030, metalness: 0.8 }));
    sigPed.position.set(2.2, 0.425, -26.5);
    this.group.add(sigPed);

    const sigintTapeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 0.16), sigMat);
    sigintTapeMesh.position.set(2.2, 0.88, -26.5);
    sigintTapeMesh.userData = { targetView: 'INSPECT_WIRETAP_LORE' };
    this.group.add(sigintTapeMesh);
    this.createHotspotRing('INSPECT_WIRETAP_LORE', new THREE.Vector3(2.2, 1.05, -26.5), 'SIGINT WIRE-TAP REPORT', 3);

    // FINAL EXTRACTION REALITY PORTAL GATEWAY (At back wall: Z: -31.8)
    const portalArchMat = new THREE.MeshStandardMaterial({ color: 0x2d1a45, metalness: 0.9, roughness: 0.1 });
    const portalArch = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.15, 16, 32, Math.PI), portalArchMat);
    portalArch.position.set(0, 1.2, -31.7);
    portalArch.userData = { targetView: 'INSPECT_INDICTMENT' };
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
    this.portalVortex.userData = { targetView: 'INSPECT_INDICTMENT' };
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

  createHotspotRing(targetView, position, label, roomNum = 1) {
    // 1. Visible pulsing glowing ring
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf5d76e, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.28, 32), ringMat);
    ring.position.copy(position);
    ring.userData = { targetView, label, room: roomNum };

    // 2. Solid invisible hit target disc (0.35m radius) for effortless raycasting clicks!
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide });
    const hitDisc = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16), hitMat);
    hitDisc.position.copy(position);
    hitDisc.userData = { targetView, label, room: roomNum };

    // Orient facing the player's room camera overview
    const camPos = new THREE.Vector3(0, 1.6, roomNum === 1 ? 1.0 : (roomNum === 2 ? -10.5 : -24.0));
    ring.lookAt(camPos);
    hitDisc.lookAt(camPos);

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

    // Cassette Player Recording LED subtle pulse
    if (this.tapeLed) {
      this.tapeLed.intensity = 0.5 + Math.sin(time * 5) * 0.25;
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

    // High-Pressure Steam Leak Plume Pulse
    if (this.steamPlume) {
      const sScale = 0.9 + Math.sin(time * 12) * 0.18;
      this.steamPlume.scale.set(sScale, 1.0 + Math.sin(time * 15) * 0.25, sScale);
      if (this.steamPlume.material) {
        this.steamPlume.material.opacity = 0.35 + Math.sin(time * 14) * 0.15;
      }
    }

    // Orbiting Plasma Spark Nodes on Quantum Ring
    if (this.quantumNodes && this.quantumNodes.length) {
      this.quantumNodes.forEach((node, i) => {
        const angle = time * 1.6 + (i * Math.PI / 2);
        const r = 1.35;
        node.position.set(
          Math.cos(angle) * r,
          1.7 + Math.sin(angle * 2) * 0.35,
          -27.0 + Math.sin(angle) * r
        );
      });
    }

    // Subtle breathing pulse for active hotspot rings
    const ringPulse = 1.0 + Math.sin(time * 3.5) * 0.06;
    if (this.hotspots) {
      this.hotspots.forEach(h => {
        if (h.isMesh && h.geometry && h.geometry.type === 'RingGeometry') {
          h.scale.set(ringPulse, ringPulse, 1);
        }
      });
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
