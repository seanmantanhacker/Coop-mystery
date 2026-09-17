/* ==========================================================================
   MAP 1: 'SILO 44' - COLD WAR UNDERGROUND BUNKER 3D ENVIRONMENT
   Complete Three.js 3D Room, Props, Dynamic Lighting & Inspection Hotspots
   ========================================================================== */

class Silo44Environment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Interactive Hotspots Registry
    this.hotspots = [];

    // Animated Lighting References
    this.pendantSpot = null;
    this.pendantPoint = null;
    this.emergencyPoint = null;
    this.flickerBase = 2.4;

    // Props with interactive or dynamic parts
    this.blastWheel = null;
    this.phoneHandset = null;
    this.radioGauges = [];

    // Camera Presets
    this.cameraPresets = {
      OVERVIEW: {
        pos: new THREE.Vector3(0.0, 2.35, 3.8),
        target: new THREE.Vector3(0.0, 1.05, 0.0),
        fov: 52,
        label: 'BUNKER OVERVIEW'
      },
      INSPECT_BOMB: {
        pos: new THREE.Vector3(0.0, 1.95, 0.95),
        target: new THREE.Vector3(0.0, 1.15, 0.0),
        fov: 40,
        label: 'TACTICAL ORDNANCE'
      },
      INSPECT_SCHEMATIC: {
        pos: new THREE.Vector3(-2.2, 1.70, -1.8),
        target: new THREE.Vector3(-3.90, 1.70, -1.8),
        fov: 44,
        label: 'DEFUSAL SCHEMATICS'
      },
      INSPECT_RADIO: {
        pos: new THREE.Vector3(1.85, 1.78, -0.6),
        target: new THREE.Vector3(3.60, 1.78, -0.6),
        fov: 42,
        label: 'MILITARY TRANSCEIVER'
      },
      INSPECT_KEYPAD: {
        pos: new THREE.Vector3(2.1, 1.5, -3.4),
        target: new THREE.Vector3(2.1, 1.5, -4.9),
        fov: 40,
        label: 'BLAST DOOR CONTROLS'
      }
    };
  }

  build() {
    this.buildStructuralShell();
    this.buildBlastDoor();
    this.buildHVACAndCeiling();
    this.buildFloorGrates();
    this.buildHeavyWorkbench();
    this.buildBoltedStool();
    this.buildHazardBarrels();
    this.buildToolboxAndWrenches();
    this.buildEmergencyWallPhone();
    this.buildWallSchematicsBoard();
    this.buildRadioTransceiverShelf();
    this.buildBlastDoorKeypad();
    this.buildOverheadCageLamp();
    this.setupLighting();
    this.registerHotspots();
    return this.group;
  }

  // 1. Structural Concrete Shell (8m W x 10m D x 4m H)
  buildStructuralShell() {
    // Floor Slab
    const floorGeo = new THREE.PlaneGeometry(8.0, 10.0);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.88,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Concrete Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x282f38,
      roughness: 0.92,
      metalness: 0.10
    });

    // North Wall (Z = -5.0) with door cutouts
    const northLeft = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.0, 0.4), wallMat);
    northLeft.position.set(-2.6, 2.0, -5.0);
    northLeft.receiveShadow = true;
    this.group.add(northLeft);

    const northRight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.0, 0.4), wallMat);
    northRight.position.set(2.6, 2.0, -5.0);
    northRight.receiveShadow = true;
    this.group.add(northRight);

    const northTopLintel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.4), wallMat);
    northTopLintel.position.set(0.0, 3.5, -5.0);
    northTopLintel.receiveShadow = true;
    this.group.add(northTopLintel);

    // West Wall (X = -4.0)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.0, 10.0), wallMat);
    westWall.position.set(-4.0, 2.0, 0.0);
    westWall.receiveShadow = true;
    this.group.add(westWall);

    // East Wall (X = +4.0)
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.0, 10.0), wallMat);
    eastWall.position.set(4.0, 2.0, 0.0);
    eastWall.receiveShadow = true;
    this.group.add(eastWall);

    // South Wall (Z = +5.0)
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 4.0, 0.4), wallMat);
    southWall.position.set(0.0, 2.0, 5.0);
    this.group.add(southWall);
  }

  // 2. Heavy Steel Blast Door
  buildBlastDoor() {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0.0, 1.5, -4.95);

    // Massive Steel Frame (Chamfered)
    const frameGeo = new THREE.BoxGeometry(2.2, 2.9, 0.35);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e242c,
      roughness: 0.4,
      metalness: 0.85
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -0.05;
    doorGroup.add(frame);

    // Door Leaf (Armored Plate)
    const leafGeo = new THREE.BoxGeometry(1.8, 2.6, 0.2);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e3830, // Weathered olive drab
      roughness: 0.65,
      metalness: 0.8
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    doorGroup.add(leaf);

    // Central Locking Wheel (Helm)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(0.0, 0.0, 0.12);

    const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x7a838d, metalness: 0.9, roughness: 0.3 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(hub);

    const rimGeo = new THREE.TorusGeometry(0.42, 0.035, 16, 36);
    const rim = new THREE.Mesh(rimGeo, hubMat);
    wheelGroup.add(rim);

    // 6 Wheel Spokes
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const spokeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 12);
      const spoke = new THREE.Mesh(spokeGeo, hubMat);
      spoke.position.set(Math.cos(angle) * 0.21, Math.sin(angle) * 0.21, 0);
      spoke.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spoke);
    }
    this.blastWheel = wheelGroup;
    doorGroup.add(wheelGroup);

    // 4 Hydraulic Locking Rams
    [[-0.95, 0.8], [-0.95, -0.8], [0.95, 0.8], [0.95, -0.8]].forEach(([rx, ry]) => {
      const ramGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 16);
      const ram = new THREE.Mesh(ramGeo, hubMat);
      ram.rotation.z = Math.PI / 2;
      ram.position.set(rx, ry, 0.0);
      doorGroup.add(ram);
    });

    // Hazard Stripes Header Trim
    const stripeGeo = new THREE.BoxGeometry(2.2, 0.18, 0.05);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffb700,
      roughness: 0.5,
      metalness: 0.2
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0.0, 1.4, 0.12);
    doorGroup.add(stripe);

    this.group.add(doorGroup);
  }

  // 3. Corrugated Ceiling & Industrial Ventilation Ducts
  buildHVACAndCeiling() {
    // Corrugated Galvanized Steel Decking
    const ceilingGeo = new THREE.PlaneGeometry(8.0, 10.0);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1a2027,
      roughness: 0.55,
      metalness: 0.70
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.0, 0);
    this.group.add(ceiling);

    // Main Rectangular HVAC Duct (runs along Z at X = -2.5, Y = 3.65)
    const ductGeo = new THREE.BoxGeometry(0.8, 0.5, 9.6);
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0x3a4450,
      roughness: 0.42,
      metalness: 0.78
    });
    const mainDuct = new THREE.Mesh(ductGeo, ductMat);
    mainDuct.position.set(-2.5, 3.65, 0.0);
    mainDuct.castShadow = true;
    this.group.add(mainDuct);

    // Duct Flanges / Seams every 2 meters
    for (let z = -4.0; z <= 4.0; z += 2.0) {
      const flangeGeo = new THREE.BoxGeometry(0.86, 0.56, 0.06);
      const flange = new THREE.Mesh(flangeGeo, ductMat);
      flange.position.set(-2.5, 3.65, z);
      this.group.add(flange);

      // Threaded All-Thread Hanger Rods to ceiling
      const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.35);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
      const rod1 = new THREE.Mesh(rodGeo, rodMat);
      rod1.position.set(-2.1, 3.82, z);
      const rod2 = new THREE.Mesh(rodGeo, rodMat);
      rod2.position.set(-2.9, 3.82, z);
      this.group.add(rod1);
      this.group.add(rod2);
    }

    // Branch Drop Vent with Intake Louvers
    const dropGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.7, 16);
    const dropVent = new THREE.Mesh(dropGeo, ductMat);
    dropVent.position.set(-2.5, 3.1, 1.2);
    this.group.add(dropVent);

    // Louvered Vent Grille Cap
    const louverGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 16);
    const louver = new THREE.Mesh(louverGeo, ductMat);
    louver.position.set(-2.5, 2.75, 1.2);
    this.group.add(louver);
  }

  // 4. Floor Drainage Metal Grates
  buildFloorGrates() {
    const grateGroup = new THREE.Group();
    grateGroup.position.set(0.0, 0.005, 0.0);

    const grateMat = new THREE.MeshStandardMaterial({
      color: 0x2d343e,
      roughness: 0.45,
      metalness: 0.85
    });

    // Central longitudinal drainage channel (0.8m wide x 8m long)
    for (let z = -4.0; z <= 4.0; z += 0.2) {
      const barGeo = new THREE.BoxGeometry(0.76, 0.02, 0.04);
      const bar = new THREE.Mesh(barGeo, grateMat);
      bar.position.set(0.0, 0.0, z);
      bar.receiveShadow = true;
      grateGroup.add(bar);
    }

    // Side border rails
    const railMat = new THREE.MeshStandardMaterial({ color: 0xcca322, metalness: 0.5, roughness: 0.5 });
    const railGeo = new THREE.BoxGeometry(0.05, 0.025, 8.2);
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-0.4, 0.0, 0.0);
    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(0.4, 0.0, 0.0);
    grateGroup.add(leftRail);
    grateGroup.add(rightRail);

    this.group.add(grateGroup);
  }

  // 5. Heavy Steel Workbench (Centerpiece)
  buildHeavyWorkbench() {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.0, 0.0, 0.0);

    // Cold-rolled Steel Top Plate (2.6m x 1.4m x 0.08m at Y=0.85m)
    const topGeo = new THREE.BoxGeometry(2.6, 0.08, 1.4);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x2b3440,
      roughness: 0.45,
      metalness: 0.75
    });
    const topPlate = new THREE.Mesh(topGeo, topMat);
    topPlate.position.set(0.0, 0.85, 0.0);
    topPlate.castShadow = true;
    topPlate.receiveShadow = true;
    tableGroup.add(topPlate);

    // C-Channel Apron Support under plate
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x1e242c, metalness: 0.85 });
    const apronFront = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.05), apronMat);
    apronFront.position.set(0.0, 0.78, 0.65);
    const apronBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.05), apronMat);
    apronBack.position.set(0.0, 0.78, -0.65);
    tableGroup.add(apronFront);
    tableGroup.add(apronBack);

    // 4 Tubular Steel Legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.81, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x161b22, metalness: 0.85, roughness: 0.4 });
    const legPositions = [
      [-1.18, 0.405, -0.58],
      [1.18, 0.405, -0.58],
      [-1.18, 0.405, 0.58],
      [1.18, 0.405, 0.58]
    ];

    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      tableGroup.add(leg);

      // Floor Foot Flange & Anchor Bolts
      const footGeo = new THREE.BoxGeometry(0.16, 0.02, 0.16);
      const foot = new THREE.Mesh(footGeo, legMat);
      foot.position.set(lx, 0.01, lz);
      tableGroup.add(foot);
    });

    // Lower Expanded Metal Mesh Shelf
    const shelfGeo = new THREE.BoxGeometry(2.3, 0.03, 1.15);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x1d2229, metalness: 0.8, roughness: 0.6 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0.0, 0.22, 0.0);
    tableGroup.add(shelf);

    // Cast-Iron Bench Vice (Mounted on Left Front Corner)
    const viceGroup = new THREE.Group();
    viceGroup.position.set(-1.15, 0.89, 0.55);

    const viceBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.18), apronMat);
    const viceBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.24), legMat);
    viceBody.position.set(0.0, 0.08, 0.0);

    const leadScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3), apronMat);
    leadScrew.rotation.x = Math.PI / 2;
    leadScrew.position.set(0.0, 0.08, 0.12);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2), apronMat);
    handle.position.set(0.0, 0.08, 0.26);

    viceGroup.add(viceBase);
    viceGroup.add(viceBody);
    viceGroup.add(leadScrew);
    viceGroup.add(handle);
    tableGroup.add(viceGroup);

    this.group.add(tableGroup);
  }

  // 6. Bolted Swivel Stool
  buildBoltedStool() {
    const stoolGroup = new THREE.Group();
    stoolGroup.position.set(0.3, 0.0, 1.2);

    // Flanged Cast Iron Circular Base
    const baseGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.04, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1b2027, metalness: 0.85, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.02;
    stoolGroup.add(base);

    // 4 Base Floor Anchor Bolts
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
      const bolt = new THREE.Mesh(boltGeo, baseMat);
      bolt.position.set(Math.cos(a) * 0.18, 0.04, Math.sin(a) * 0.18);
      stoolGroup.add(bolt);
    }

    // Threaded Acme Screw Central Pillar
    const screwGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.52, 16);
    const screwMat = new THREE.MeshStandardMaterial({ color: 0x757f8c, metalness: 0.9, roughness: 0.3 });
    const screw = new THREE.Mesh(screwGeo, screwMat);
    screw.position.y = 0.28;
    stoolGroup.add(screw);

    // Round Distressed Vinyl Cushion Top
    const seatGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.07, 24);
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x362f26, // Distressed olive-brown vinyl
      roughness: 0.75,
      metalness: 0.1
    });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.56;
    seat.castShadow = true;
    stoolGroup.add(seat);

    // Rim Trim & Rivets
    const rimGeo = new THREE.TorusGeometry(0.19, 0.01, 8, 24);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xb08d4b, metalness: 0.8 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.54;
    stoolGroup.add(rim);

    this.group.add(stoolGroup);
  }

  // 7. Rusted Hazard Drum Barrels (SW Corner)
  buildHazardBarrels() {
    const barrelsGroup = new THREE.Group();

    const drumGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.92, 24);
    const rustMat = new THREE.MeshStandardMaterial({
      color: 0xb5881b, // Weathered toxic yellow with rust
      roughness: 0.85,
      metalness: 0.52
    });

    const createDrum = (x, y, z, rotX = 0, rotZ = 0) => {
      const drum = new THREE.Group();
      drum.position.set(x, y, z);
      drum.rotation.set(rotX, 0, rotZ);

      const body = new THREE.Mesh(drumGeo, rustMat);
      body.castShadow = true;
      body.receiveShadow = true;
      drum.add(body);

      // 3 Circumferential Expansion Ribs
      [-0.25, 0.0, 0.25].forEach(ry => {
        const ribGeo = new THREE.TorusGeometry(0.295, 0.012, 8, 24);
        const rib = new THREE.Mesh(ribGeo, rustMat);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = ry;
        drum.add(rib);
      });

      // Recessed Lid with 2 Bungholes
      const bung1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02), rustMat);
      bung1.position.set(0.14, 0.46, 0.0);
      const bung2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02), rustMat);
      bung2.position.set(-0.14, 0.46, 0.0);
      drum.add(bung1);
      drum.add(bung2);

      // Black Trefoil Warning Hazard Stencil Band
      const bandGeo = new THREE.CylinderGeometry(0.293, 0.293, 0.18, 24);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = 0.1;
      drum.add(band);

      return drum;
    };

    barrelsGroup.add(createDrum(-3.2, 0.46, 3.4));
    barrelsGroup.add(createDrum(-2.6, 0.46, 3.8));
    // Tilted knocked-over drum
    barrelsGroup.add(createDrum(-3.0, 0.32, 2.5, 0, 1.45));

    this.group.add(barrelsGroup);
  }

  // 8. Cantilever Red Toolbox & Wrenches (Workbench Right)
  buildToolboxAndWrenches() {
    const toolGroup = new THREE.Group();
    toolGroup.position.set(0.95, 0.89, 0.35);
    toolGroup.rotation.y = 0.3;

    // Toolbox Body (Crimson Industrial Enamel)
    const boxGeo = new THREE.BoxGeometry(0.5, 0.22, 0.22);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x8a1c1c,
      roughness: 0.48,
      metalness: 0.42
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.11;
    box.castShadow = true;
    toolGroup.add(box);

    // Chrome Toggle Latches
    const latchMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.2 });
    [-0.15, 0.15].forEach(lx => {
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.02), latchMat);
      latch.position.set(lx, 0.12, 0.115);
      toolGroup.add(latch);
    });

    // Top Center Carry Handle
    const handleGeo = new THREE.TorusGeometry(0.07, 0.012, 8, 16, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.0, 0.22, 0.0);
    toolGroup.add(handle);

    // Shop Rag (Oily Navy Cotton)
    const ragGeo = new THREE.BoxGeometry(0.35, 0.01, 0.25);
    const ragMat = new THREE.MeshStandardMaterial({ color: 0x203548, roughness: 0.9 });
    const rag = new THREE.Mesh(ragGeo, ragMat);
    rag.position.set(0.35, 0.005, 0.0);
    toolGroup.add(rag);

    // 3 Chrome Vanadium Combination Wrenches
    const wrenchMat = new THREE.MeshStandardMaterial({ color: 0xd8dde3, metalness: 0.95, roughness: 0.18 });
    for (let i = 0; i < 3; i++) {
      const wGroup = new THREE.Group();
      wGroup.position.set(0.3 + (i * 0.08), 0.015, -0.05 + (i * 0.06));
      wGroup.rotation.y = 0.2 + (i * 0.15);

      // Beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.2 - (i * 0.03)), wrenchMat);
      // Open End Jaw
      const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.008, 12), wrenchMat);
      jaw.position.z = 0.1 - (i * 0.015);
      // Ring Box End
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.006, 8, 16), wrenchMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.z = -(0.1 - (i * 0.015));

      wGroup.add(beam);
      wGroup.add(jaw);
      wGroup.add(ring);
      toolGroup.add(wGroup);
    }

    this.group.add(toolGroup);
  }

  // 9. Emergency Bakelite Wall Phone (West Wall)
  buildEmergencyWallPhone() {
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(-3.95, 1.65, 0.5);
    phoneGroup.rotation.y = Math.PI / 2;

    // Bakelite Main Housing
    const bodyGeo = new THREE.BoxGeometry(0.22, 0.32, 0.14);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x14171a,
      roughness: 0.32,
      metalness: 0.15
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    phoneGroup.add(body);

    // Twin Brass Bells (Mounted on top)
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xcc9a33, metalness: 0.88, roughness: 0.25 });
    [-0.05, 0.05].forEach(bx => {
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), bellMat);
      bell.position.set(bx, 0.17, 0.0);
      phoneGroup.add(bell);
    });

    // Rotary Dial Face
    const dialGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 24);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4 });
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0.0, -0.04, 0.075);
    phoneGroup.add(dial);

    // Handset Receiver (Resting in left cradle)
    const handsetGroup = new THREE.Group();
    handsetGroup.position.set(-0.15, 0.0, 0.06);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22), bodyMat);
    const earpiece = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.04), bodyMat);
    earpiece.position.y = 0.11;
    const mouthpiece = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.04), bodyMat);
    mouthpiece.position.y = -0.11;

    handsetGroup.add(handle);
    handsetGroup.add(earpiece);
    handsetGroup.add(mouthpiece);
    this.phoneHandset = handsetGroup;
    phoneGroup.add(handsetGroup);

    // Catenary Coiled Cord
    const cordGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.45);
    const cordMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.set(-0.15, -0.25, 0.04);
    phoneGroup.add(cord);

    this.group.add(phoneGroup);
  }

  // 10. Wall Clipboard / Schematic Board (West Wall)
  buildWallSchematicsBoard() {
    const boardGroup = new THREE.Group();
    boardGroup.position.set(-3.95, 1.7, -1.8);
    boardGroup.rotation.y = Math.PI / 2;

    // Aluminum Clipboard Plate
    const plateGeo = new THREE.BoxGeometry(0.65, 0.9, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x7c8590,
      metalness: 0.85,
      roughness: 0.35
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    boardGroup.add(plate);

    // Top Spring Clip
    const clipGeo = new THREE.BoxGeometry(0.24, 0.08, 0.04);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9 });
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clip.position.set(0.0, 0.42, 0.02);
    boardGroup.add(clip);

    // Weathered Technical Blueprint Paper
    const paperGeo = new THREE.PlaneGeometry(0.58, 0.82);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0x1a385a, // Blueprint cyan-navy
      roughness: 0.8
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.position.set(0.0, -0.01, 0.015);
    boardGroup.add(paper);

    // Grease Pencil Defusal Annotation Note
    const noteGeo = new THREE.PlaneGeometry(0.26, 0.22);
    const noteMat = new THREE.MeshStandardMaterial({
      color: 0xf5eeaa, // Yellow sticky memo
      roughness: 0.9
    });
    const note = new THREE.Mesh(noteGeo, noteMat);
    note.position.set(0.12, -0.22, 0.02);
    note.rotation.z = -0.08;
    boardGroup.add(note);

    boardGroup.userData = { isHotspot: true, targetView: 'INSPECT_SCHEMATIC', label: 'DEFUSAL SCHEMATICS' };
    boardGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_SCHEMATIC'; });
    this.boardGroup = boardGroup;
    this.group.add(boardGroup);
  }

  // 11. Military Radio Transceiver Shelf (East Wall)
  buildRadioTransceiverShelf() {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(3.75, 1.6, -0.6);
    shelfGroup.rotation.y = -Math.PI / 2;

    // Steel Wall Bracket Shelf
    const shelfGeo = new THREE.BoxGeometry(1.2, 0.04, 0.45);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x252c35, metalness: 0.85 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelfGroup.add(shelf);

    // Cold War Transceiver Console Chassis (R-390 Style)
    const radioGeo = new THREE.BoxGeometry(0.75, 0.36, 0.38);
    const radioMat = new THREE.MeshStandardMaterial({
      color: 0x333d36, // Olive military green
      metalness: 0.65,
      roughness: 0.45
    });
    const radio = new THREE.Mesh(radioGeo, radioMat);
    radio.position.set(0.0, 0.2, 0.0);
    radio.castShadow = true;
    shelfGroup.add(radio);

    // Dual Analog VU Meters
    [-0.18, 0.18].forEach(mx => {
      const meterGeo = new THREE.BoxGeometry(0.14, 0.09, 0.02);
      const meterMat = new THREE.MeshStandardMaterial({ color: 0xfffae0, roughness: 0.2 });
      const meter = new THREE.Mesh(meterGeo, meterMat);
      meter.position.set(mx, 0.28, 0.195);
      shelfGroup.add(meter);

      // Gauge needle
      const needleGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.06);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.set(mx, 0.27, 0.205);
      needle.rotation.z = 0.4;
      this.radioGauges.push(needle);
      shelfGroup.add(needle);
    });

    // Heavy Knurled Tuning Knob
    const knobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.035, 24);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0.0, 0.14, 0.205);
    shelfGroup.add(knob);

    shelfGroup.userData = { isHotspot: true, targetView: 'INSPECT_RADIO', label: 'MILITARY TRANSCEIVER' };
    shelfGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_RADIO'; });
    this.shelfGroup = shelfGroup;
    this.group.add(shelfGroup);
  }

  // 12. Blast Door Keypad Panel (North Wall Jamb)
  buildBlastDoorKeypad() {
    const padGroup = new THREE.Group();
    padGroup.position.set(2.1, 1.5, -4.9);

    // Stainless Steel Enclosure Box
    const boxGeo = new THREE.BoxGeometry(0.32, 0.48, 0.08);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x828b94,
      metalness: 0.9,
      roughness: 0.28
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    padGroup.add(box);

    // 7-Segment LED Digital Status Display
    const displayGeo = new THREE.PlaneGeometry(0.22, 0.08);
    const displayMat = new THREE.MeshBasicMaterial({ color: 0xff1122 });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0.0, 0.14, 0.042);
    padGroup.add(display);

    // Keypad Push Buttons (3x4 Matrix)
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6 });
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const btnGeo = new THREE.BoxGeometry(0.045, 0.045, 0.015);
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.position.set(-0.06 + (c * 0.06), 0.04 - (r * 0.06), 0.045);
        padGroup.add(btn);
      }
    }

    padGroup.userData = { isHotspot: true, targetView: 'INSPECT_KEYPAD', label: 'BLAST DOOR CONTROLS' };
    padGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_KEYPAD'; });
    this.padGroup = padGroup;
    this.group.add(padGroup);
  }

  // 13. Overhead Industrial Cage Lamp
  buildOverheadCageLamp() {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0.0, 2.65, 0.0);

    // Ceiling Mount Canopy & Hanging Cord
    const cordGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.35);
    const cordMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.y = 0.68;
    lampGroup.add(cord);

    // Enameled Bell Shade (Dark Industrial Green)
    const shadeGeo = new THREE.ConeGeometry(0.26, 0.22, 24, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x1b2921,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 0.05;
    lampGroup.add(shade);

    // Wire Cage Enclosure Basket
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.85 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.24);
      const wire = new THREE.Mesh(wireGeo, cageMat);
      wire.position.set(Math.cos(a) * 0.12, -0.1, Math.sin(a) * 0.12);
      lampGroup.add(wire);
    }
    const cageRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.006, 8, 24), cageMat);
    cageRing.rotation.x = Math.PI / 2;
    cageRing.position.y = -0.22;
    lampGroup.add(cageRing);

    // Glowing Edison Filament Bulb
    const bulbGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe8a0 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = -0.05;
    lampGroup.add(bulb);

    this.group.add(lampGroup);
  }

  // 14. Dynamic Lighting & Volumetric Haze Setup
  setupLighting() {
    // Key Overhead Downward Spotlight onto Workbench
    this.pendantSpot = new THREE.SpotLight(0xffaa55, this.flickerBase, 8.5, Math.PI / 3.2, 0.65, 2.0);
    this.pendantSpot.position.set(0.0, 2.62, 0.0);
    this.pendantSpot.target.position.set(0.0, 0.85, 0.0);
    this.pendantSpot.castShadow = true;
    this.pendantSpot.shadow.mapSize.width = 2048;
    this.pendantSpot.shadow.mapSize.height = 2048;
    this.pendantSpot.shadow.bias = -0.0004;
    this.group.add(this.pendantSpot);
    this.group.add(this.pendantSpot.target);

    // Omni Fill Light from Bulb
    this.pendantPoint = new THREE.PointLight(0xff8822, 0.8, 5.0, 1.8);
    this.pendantPoint.position.set(0.0, 2.55, 0.0);
    this.group.add(this.pendantPoint);

    // Emergency Amber Status LED Light on Blast Door
    this.emergencyPoint = new THREE.PointLight(0xff4400, 0.75, 3.0);
    this.emergencyPoint.position.set(2.1, 1.9, -4.85);
    this.group.add(this.emergencyPoint);

    // Cool Concrete Ambient Shadow Softener
    const ambient = new THREE.AmbientLight(0x1a2330, 0.35);
    this.group.add(ambient);

    // Industrial Fog
    this.scene.fog = new THREE.FogExp2(0x0e1319, 0.04);
  }

  // 15. Register Interactive Hotspots
  registerHotspots() {
    this.hotspots = [];

    const createRing = (viewKey, pos, label) => {
      const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff, // Tactical Holographic Cyan
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(pos);
      ring.userData = {
        isHotspot: true,
        targetView: viewKey,
        label: label,
        originalY: pos.y
      };

      // Solid hit disc filling center so clicks anywhere inside circle hit
      const discGeo = new THREE.CircleGeometry(0.48, 24);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.userData = { isHotspot: true, targetView: viewKey, label: label };
      ring.add(disc);

      this.group.add(ring);
      this.hotspots.push(ring);
      this.hotspots.push(disc);
      return ring;
    };

    // Hotspot 1: Tactical Bomb on table
    createRing('INSPECT_BOMB', new THREE.Vector3(0.0, 1.25, 0.0), 'INSPECT BOMB ORDNANCE');

    // Hotspot 2: Wall Clipboard / Schematic
    const hSchematic = createRing('INSPECT_SCHEMATIC', new THREE.Vector3(-3.88, 1.7, -1.8), 'INSPECT WALL SCHEMATIC');
    hSchematic.rotation.set(0, Math.PI / 2, 0);

    // Hotspot 3: Radio Transceiver on Shelf
    const hRadio = createRing('INSPECT_RADIO', new THREE.Vector3(3.68, 1.8, -0.6), 'INSPECT RADIO TRANSCEIVER');
    hRadio.rotation.set(0, -Math.PI / 2, 0);

    // Hotspot 4: Blast Door Keypad
    const hKeypad = createRing('INSPECT_KEYPAD', new THREE.Vector3(2.1, 1.5, -4.82), 'INSPECT BLAST KEYPAD');
    hKeypad.rotation.set(0, 0, 0);
  }

  // Animation Frame Loop
  update(time, delta) {
    // 1. Voltage Generator Brownout Light Flicker
    if (this.pendantSpot) {
      const wave = Math.sin(time * 19.3) * 0.06 + Math.sin(time * 41.7) * 0.04 + Math.sin(time * 83.1) * 0.02;
      const spike = (Math.sin(time * 2.3) > 0.96) ? (Math.random() * -0.45) : 0.0;
      const flickerFactor = Math.max(0.2, 1.0 + wave + spike);
      this.pendantSpot.intensity = this.flickerBase * flickerFactor;
      if (this.pendantPoint) this.pendantPoint.intensity = 0.8 * flickerFactor;
    }

    // 2. Pulse Hotspot Rings
    const pulse = 1.0 + Math.sin(time * 5.0) * 0.12;
    this.hotspots.forEach(ring => {
      ring.scale.set(pulse, pulse, 1.0);
    });

    // 3. Jiggle Radio VU Gauge Needles
    if (this.radioGauges.length > 0) {
      this.radioGauges.forEach((needle, idx) => {
        needle.rotation.z = 0.35 + Math.sin(time * 8.0 + idx * 2.0) * 0.15;
      });
    }
  }

  destroy() {
    this.scene.remove(this.group);
  }
}
