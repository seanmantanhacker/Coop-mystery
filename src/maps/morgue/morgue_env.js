/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE (ENVIRONMENT)
   Subterranean Clinical Autopsy Theater & High-Security Bio-Containment Vault
   ========================================================================== */

class MorgueEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Interactive Hotspots Registry
    this.hotspots = [];

    // Animated References
    this.surgicalLight = null;
    this.ventFan = null;
    this.centrifugeRotor = null;
    this.doorIndicatorLight = null;
    this.gasFog = null;

    // Camera Presets
    this.cameraPresets = {
      OVERVIEW: {
        pos: new THREE.Vector3(0.00, 2.50, 4.20),
        target: new THREE.Vector3(0.00, 1.05, -0.40),
        fov: 50,
        label: "MORGUE THEATER OVERVIEW"
      },
      INSPECT_TOXICOLOGY: {
        pos: new THREE.Vector3(-1.90, 1.48, 0.35),
        target: new THREE.Vector3(-1.90, 0.95, -0.45),
        fov: 38,
        label: "CENTRIFUGE & TOXICOLOGY BENCH"
      },
      INSPECT_AUTOPSY: {
        pos: new THREE.Vector3(0.00, 1.75, 0.55),
        target: new THREE.Vector3(0.00, 0.95, -0.20),
        fov: 38,
        label: "CADAVER & FORENSIC CALIPERS"
      },
      INSPECT_DOOR: {
        pos: new THREE.Vector3(2.20, 1.55, -0.80),
        target: new THREE.Vector3(2.85, 1.35, -2.10),
        fov: 40,
        label: "AIRLOCK DOOR & SECURITY KEYPAD"
      },
      INSPECT_VENT: {
        pos: new THREE.Vector3(1.10, 2.15, 0.20),
        target: new THREE.Vector3(1.50, 2.65, -1.60),
        fov: 44,
        label: "VENTILATION DUCT & AIR DAMPER"
      },
      INSPECT_LOG: {
        pos: new THREE.Vector3(-0.90, 1.35, 1.10),
        target: new THREE.Vector3(-0.90, 0.88, 0.35),
        fov: 38,
        label: "CORONER'S DICTAPHONE & NOTES"
      }
    };
  }

  build() {
    this.buildClinicalRoom();
    this.buildAutopsyTableAndCadaver();
    this.buildMortuaryWall();
    this.buildToxicologyBench();
    this.buildAirlockDoor();
    this.buildVentilationSystem();
    this.buildCoronerCart();
    this.buildLighting();
    this.createHotspots();
  }

  buildClinicalRoom() {
    // 1. Tiled Floor (Dark slate ceramic tiles with glossy sheen)
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x141a22,
      roughness: 0.25,
      metalness: 0.35
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Drain grate in center beneath autopsy table
    const drainGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 16);
    const drainMat = new THREE.MeshStandardMaterial({
      color: 0x080b0e,
      roughness: 0.6,
      metalness: 0.8
    });
    const drain = new THREE.Mesh(drainGeo, drainMat);
    drain.position.set(0, 0.01, -0.2);
    this.group.add(drain);

    // 2. Stainless Steel & Tiled Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x222c38,
      roughness: 0.5,
      metalness: 0.4
    });

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
    backWall.position.set(0, 2.5, -4.5);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
    leftWall.position.set(-4.5, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
    rightWall.position.set(4.5, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.group.add(rightWall);

    // Ceiling with recessed cleanroom light panels
    const ceilingGeo = new THREE.PlaneGeometry(12, 12);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x10151c,
      roughness: 0.8
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4.2;
    this.group.add(ceiling);

    // Biohazard Warning Floor Lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe6b800 });
    const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 4.0), lineMat);
    line1.rotation.x = -Math.PI / 2;
    line1.position.set(-1.4, 0.012, -0.2);
    this.group.add(line1);

    const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 4.0), lineMat);
    line2.rotation.x = -Math.PI / 2;
    line2.position.set(1.4, 0.012, -0.2);
    this.group.add(line2);
  }

  buildAutopsyTableAndCadaver() {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, -0.2);
    tableGroup.userData = { targetView: 'INSPECT_AUTOPSY' };

    // Heavy Central Stainless Steel Pedestal
    const baseGeo = new THREE.BoxGeometry(0.7, 0.75, 1.4);
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x90a4ae,
      roughness: 0.25,
      metalness: 0.85
    });
    const base = new THREE.Mesh(baseGeo, steelMat);
    base.position.y = 0.375;
    base.castShadow = true;
    tableGroup.add(base);

    // Contoured Autopsy Table Surface with Raised Rim
    const topGeo = new THREE.BoxGeometry(1.1, 0.08, 2.4);
    const topMesh = new THREE.Mesh(topGeo, steelMat);
    topMesh.position.y = 0.8;
    topMesh.castShadow = true;
    tableGroup.add(topMesh);

    // Fluid Drainage Slope / Rim
    const rimGeo = new THREE.BoxGeometry(1.14, 0.04, 2.44);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x607d8b, roughness: 0.3, metalness: 0.9 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.84;
    tableGroup.add(rimMesh);

    // Draped Cadaver Silhouette (Medical Sheet covering torso and legs, head exposed)
    const cadaverGroup = new THREE.Group();
    cadaverGroup.position.set(0, 0.84, 0);

    // Sheet covering body
    const sheetGeo = new THREE.BoxGeometry(0.65, 0.22, 1.7);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xdde6ed,
      roughness: 0.85,
      metalness: 0.05
    });
    const sheet = new THREE.Mesh(sheetGeo, sheetMat);
    sheet.position.set(0, 0.11, 0.1);
    sheet.castShadow = true;
    cadaverGroup.add(sheet);

    // Exposed Arms with Cyanotic Fingernails
    const armMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.6 });
    const cyanoticMat = new THREE.MeshStandardMaterial({ color: 0x2979ff, roughness: 0.4 }); // Blue nails

    // Left Arm
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.6), armMat);
    leftArm.rotation.x = Math.PI / 2;
    leftArm.position.set(-0.38, 0.1, 0.1);
    cadaverGroup.add(leftArm);

    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.12), cyanoticMat);
    leftHand.position.set(-0.38, 0.1, 0.44);
    cadaverGroup.add(leftHand);

    // Right Arm
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.6), armMat);
    rightArm.rotation.x = Math.PI / 2;
    rightArm.position.set(0.38, 0.1, 0.1);
    cadaverGroup.add(rightArm);

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.12), cyanoticMat);
    rightHand.position.set(0.38, 0.1, 0.44);
    cadaverGroup.add(rightHand);

    // Calipers / Surgical Ruler on table side
    const rulerGeo = new THREE.BoxGeometry(0.05, 0.01, 0.35);
    const rulerMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3, metalness: 0.7 });
    const ruler = new THREE.Mesh(rulerGeo, rulerMat);
    ruler.position.set(0.48, 0.85, -0.6);
    tableGroup.add(ruler);

    tableGroup.add(cadaverGroup);
    this.group.add(tableGroup);

    // Overhead Surgical Ring Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, 2.7, -0.2);

    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), steelMat);
    arm1.rotation.z = Math.PI / 6;
    lampGroup.add(arm1);

    const ringGeo = new THREE.TorusGeometry(0.45, 0.06, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.3, metalness: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0.3, -0.6, 0);
    lampGroup.add(ringMesh);

    // Center Cool Bulb
    const bulbGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0x90caf9 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.3, -0.6, 0);
    lampGroup.add(bulb);

    this.surgicalLight = new THREE.SpotLight(0xddf0ff, 2.4, 6.0, Math.PI / 4, 0.3, 1.2);
    this.surgicalLight.position.set(0.3, -0.6, 0);
    this.surgicalLight.target = topMesh;
    lampGroup.add(this.surgicalLight);

    this.group.add(lampGroup);
  }

  buildMortuaryWall() {
    // 6 Stainless Steel Mortuary Refrigeration Doors on Back Wall
    const freezerGroup = new THREE.Group();
    freezerGroup.position.set(-2.0, 1.4, -4.4);

    const frameGeo = new THREE.BoxGeometry(3.6, 2.4, 0.15);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.4, metalness: 0.7 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    freezerGroup.add(frame);

    const doorMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.25, metalness: 0.85 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.2, metalness: 0.9 });

    // 2 rows of 3 doors
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const dx = (col - 1) * 1.1;
        const dy = (row === 0 ? 0.55 : -0.55);

        const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.04), doorMat);
        doorMesh.position.set(dx, dy, 0.08);
        freezerGroup.add(doorMesh);

        // Chrome pull latch
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), handleMat);
        handle.position.set(dx + 0.32, dy, 0.12);
        freezerGroup.add(handle);

        // Nameplate tag
        const tag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.01), new THREE.MeshBasicMaterial({ color: 0xf5f5f5 }));
        tag.position.set(dx, dy + 0.2, 0.11);
        freezerGroup.add(tag);
      }
    }

    this.group.add(freezerGroup);
  }

  buildToxicologyBench() {
    // Left Wall Workstation
    const benchGroup = new THREE.Group();
    benchGroup.position.set(-3.2, 0, 0);
    benchGroup.userData = { targetView: 'INSPECT_TOXICOLOGY' };

    // Stainless Steel Table
    const benchTable = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.85, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.3, metalness: 0.8 })
    );
    benchTable.position.y = 0.425;
    benchTable.castShadow = true;
    benchGroup.add(benchTable);

    // Centrifuge Appliance
    const centGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.28, 24);
    const centMat = new THREE.MeshStandardMaterial({ color: 0xeceff1, roughness: 0.3, metalness: 0.5 });
    const centrifuge = new THREE.Mesh(centGeo, centMat);
    centrifuge.position.set(0, 0.99, -0.4);
    benchGroup.add(centrifuge);

    // Centrifuge spinning rotor visible through glass dome lid
    const domeGeo = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x80d8ff, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.6 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 1.13, -0.4);
    benchGroup.add(dome);

    // Rotor disc inside
    const rotorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 6);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.4, metalness: 0.9 });
    this.centrifugeRotor = new THREE.Mesh(rotorGeo, rotorMat);
    this.centrifugeRotor.position.set(0, 1.14, -0.4);
    benchGroup.add(this.centrifugeRotor);

    // Test Tube Rack with 5 Colored Reagents
    const rackGeo = new THREE.BoxGeometry(0.18, 0.12, 0.6);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.6 });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(0.3, 0.91, 0.4);
    benchGroup.add(rack);

    const reagentColors = [0x5ce1e6, 0xff7043, 0x66bb6a, 0xab47bc, 0xffeb3b];
    for (let i = 0; i < 5; i++) {
      const tubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
      const tubeMat = new THREE.MeshStandardMaterial({ color: reagentColors[i], roughness: 0.2, metalness: 0.3 });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.position.set(0.3, 1.02, 0.18 + (i * 0.1));
      benchGroup.add(tube);
    }

    // Digital Titration Pipette Apparatus
    const pumpGeo = new THREE.BoxGeometry(0.24, 0.35, 0.24);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.4 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(-0.35, 1.02, 0.3);
    benchGroup.add(pump);

    // Glowing LED Screen on pump
    const screenGeo = new THREE.PlaneGeometry(0.16, 0.1);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-0.22, 1.05, 0.3);
    screen.rotation.y = Math.PI / 2;
    benchGroup.add(screen);

    this.group.add(benchGroup);
  }

  buildAirlockDoor() {
    // Heavy Sealed Door with Keypad on Right Wall
    const doorGroup = new THREE.Group();
    doorGroup.position.set(4.4, 0, -2.0);
    doorGroup.rotation.y = -Math.PI / 2;
    doorGroup.userData = { targetView: 'INSPECT_DOOR' };

    // Massive Steel Airlock Frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.2, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5, metalness: 0.8 })
    );
    frame.position.y = 1.6;
    doorGroup.add(frame);

    // Inner Sliding Magnetic Door Panel
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.8, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.3, metalness: 0.9 })
    );
    panel.position.set(0, 1.5, 0.05);
    doorGroup.add(panel);

    // Circular Biohazard Observation Window
    const winFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.3, metalness: 0.9 })
    );
    winFrame.position.set(0, 1.9, 0.11);
    doorGroup.add(winFrame);

    const glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.32, 24),
      new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.7 })
    );
    glass.position.set(0, 1.9, 0.12);
    doorGroup.add(glass);

    // Heavy Locking Boltheads
    for (let i = 0; i < 4; i++) {
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.2, metalness: 1.0 })
      );
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(0.75, 0.8 + (i * 0.5), 0.11);
      doorGroup.add(bolt);
    }

    // Door Status Indicator LED
    this.doorIndicatorLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff1744 }) // Red = Sealed
    );
    this.doorIndicatorLight.position.set(0, 2.7, 0.14);
    doorGroup.add(this.doorIndicatorLight);

    // Wall-Mounted 4-Digit Security Keypad Station
    const keypadBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.55, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.4, metalness: 0.7 })
    );
    keypadBox.position.set(1.35, 1.45, 0.1);
    doorGroup.add(keypadBox);

    // LCD Readout Display on Keypad
    const lcd = new THREE.Mesh(
      new THREE.PlaneGeometry(0.25, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    lcd.position.set(1.35, 1.62, 0.17);
    doorGroup.add(lcd);

    this.group.add(doorGroup);
  }

  buildVentilationSystem() {
    // Industrial Air Duct & Life Support Exhaust in Upper Right Corner
    const ventGroup = new THREE.Group();
    ventGroup.position.set(2.4, 3.2, -1.8);
    ventGroup.userData = { targetView: 'INSPECT_VENT' };

    // Galvanized Sheet Metal Duct
    const ductGeo = new THREE.BoxGeometry(1.6, 0.9, 1.8);
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x607d8b, roughness: 0.4, metalness: 0.85 });
    const duct = new THREE.Mesh(ductGeo, ductMat);
    ventGroup.add(duct);

    // Protective Wire Mesh Grate
    const grateGeo = new THREE.PlaneGeometry(1.4, 0.75);
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.6, metalness: 0.8, wireframe: true });
    const grate = new THREE.Mesh(grateGeo, grateMat);
    grate.position.set(0, 0, 0.91);
    ventGroup.add(grate);

    // Ventilation Fan Blades inside duct
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 0, 0.5);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4, metalness: 0.9 });
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.02), bladeMat);
      blade.rotation.z = (i * Math.PI) / 2;
      fanGroup.add(blade);
    }
    this.ventFan = fanGroup;
    ventGroup.add(fanGroup);

    // Mechanical Emergency Air Damper Lever
    const leverBase = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.1), new THREE.MeshStandardMaterial({ color: 0xb71c1c }));
    leverBase.position.set(-0.95, -0.15, 0.6);
    ventGroup.add(leverBase);

    const leverHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.3, metalness: 0.8 })
    );
    leverHandle.position.set(-0.95, 0.05, 0.7);
    leverHandle.rotation.x = Math.PI / 4;
    ventGroup.add(leverHandle);

    this.group.add(ventGroup);
  }

  buildCoronerCart() {
    // Rolling Cart with Coroner's Cassette Dictaphone & Crime Scene Notes
    const cartGroup = new THREE.Group();
    cartGroup.position.set(-1.4, 0, 1.8);
    cartGroup.userData = { targetView: 'INSPECT_LOG' };

    // Tubular Steel Frame with 2 Shelves
    const shelfGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.3, metalness: 0.85 });

    const topShelf = new THREE.Mesh(shelfGeo, shelfMat);
    topShelf.position.y = 0.82;
    topShelf.castShadow = true;
    cartGroup.add(topShelf);

    const bottomShelf = new THREE.Mesh(shelfGeo, shelfMat);
    bottomShelf.position.y = 0.22;
    cartGroup.add(bottomShelf);

    // Legs with casters
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.82);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.4, metalness: 0.9 });
    const positions = [
      [-0.32, 0.41, -0.42],
      [0.32, 0.41, -0.42],
      [-0.32, 0.41, 0.42],
      [0.32, 0.41, 0.42]
    ];
    positions.forEach(p => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(...p);
      cartGroup.add(leg);
    });

    // 1994 Microcassette Dictaphone
    const dictGeo = new THREE.BoxGeometry(0.18, 0.04, 0.28);
    const dictMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.5 });
    const dictaphone = new THREE.Mesh(dictGeo, dictMat);
    dictaphone.position.set(-0.12, 0.86, -0.15);
    cartGroup.add(dictaphone);

    // Glowing REC LED on dictaphone
    const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
    recLed.position.set(-0.15, 0.885, -0.22);
    cartGroup.add(recLed);

    // Manilla Autopsy Report Folder with Red "CONFIDENTIAL" Stamp
    const folderGeo = new THREE.BoxGeometry(0.32, 0.02, 0.42);
    const folderMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 });
    const folder = new THREE.Mesh(folderGeo, folderMat);
    folder.position.set(0.15, 0.85, 0.1);
    folder.rotation.y = 0.2;
    cartGroup.add(folder);

    this.group.add(cartGroup);
  }

  buildLighting() {
    // Cool Fluorescent Ambient Fill
    const ambLight = new THREE.AmbientLight(0x78909c, 0.55);
    this.group.add(ambLight);

    // Clinical Overhead Area Light (Cool Ice Cyan)
    const ceilingSpot = new THREE.PointLight(0x5ce1e6, 1.6, 10.0, 1.4);
    ceilingSpot.position.set(0, 3.8, 0);
    this.group.add(ceilingSpot);

    // Secondary Rim Light (Emergency Amber Tint)
    const amberRim = new THREE.PointLight(0xffb74d, 0.8, 8.0);
    amberRim.position.set(3.5, 2.2, 2.5);
    this.group.add(amberRim);
  }

  createHotspots() {
    const hotspotsData = [
      { view: 'INSPECT_TOXICOLOGY', pos: new THREE.Vector3(-2.0, 1.1, -0.2), label: 'TOXICOLOGY' },
      { view: 'INSPECT_AUTOPSY', pos: new THREE.Vector3(0.0, 1.05, -0.2), label: 'CADAVER AUTOPSY' },
      { view: 'INSPECT_DOOR', pos: new THREE.Vector3(2.6, 1.45, -1.8), label: 'SECURITY AIRLOCK' },
      { view: 'INSPECT_VENT', pos: new THREE.Vector3(1.8, 2.6, -1.6), label: 'EXHAUST DAMPER' },
      { view: 'INSPECT_LOG', pos: new THREE.Vector3(-1.2, 1.05, 1.4), label: 'DICTAPHONE LOG' }
    ];

    const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
    const hitGeo = new THREE.CircleGeometry(0.18, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    hotspotsData.forEach(h => {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x5ce1e6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(h.pos);
      ring.lookAt(this.cameraPresets.OVERVIEW.pos);
      ring.userData = { targetView: h.view, label: h.label };

      const hitDisc = new THREE.Mesh(hitGeo, hitMat);
      hitDisc.userData = { targetView: h.view };
      ring.add(hitDisc);

      this.hotspots.push(ring);
      this.group.add(ring);
    });
  }

  update(time, delta) {
    // 1. Rotate Vent Fan Blades
    if (this.ventFan) {
      this.ventFan.rotation.z += delta * 4.5;
    }

    // 2. Rotate Centrifuge Rotor when active
    if (this.centrifugeRotor) {
      const isCentrifuging = window.toxicologyModule ? window.toxicologyModule.centrifuging : false;
      if (isCentrifuging) {
        this.centrifugeRotor.rotation.y += delta * 24.0;
      }
    }

    // 3. Pulse Hotspot Rings
    const pulse = 1.0 + Math.sin(time * 4.0) * 0.12;
    this.hotspots.forEach(ring => {
      ring.scale.set(pulse, pulse, 1.0);
    });

    // 4. Update Door Indicator LED
    if (this.doorIndicatorLight) {
      const doorSolved = window.morgueKeypadModule ? window.morgueKeypadModule.solved : false;
      this.doorIndicatorLight.material.color.setHex(doorSolved ? 0x00e676 : 0xff1744);
    }
  }

  destroy() {
    this.scene.remove(this.group);
  }
}

window.MorgueEnvironment = MorgueEnvironment;
