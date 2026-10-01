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
    this.faradaySwitch = null;
    this.faradayStatusLight = null;
    this.monitorScreens = [];
    this.lights = {};

    // Camera Presets for 5 Distinct Enclosed Rooms & Close-Up Inspections
    this.cameraPresets = {
      OVERVIEW: {
        pos: new THREE.Vector3(0, 18, 18),
        target: new THREE.Vector3(0, 0, -2),
        fov: 52,
        label: '1979: PROMETHEUS FACILITY OVERVIEW'
      },
      NODE_1_LAB: {
        pos: new THREE.Vector3(-8.0, 2.2, -6.5),
        target: new THREE.Vector3(-8.0, 1.4, -13.0),
        fov: 52,
        label: 'NODE 1: RESEARCH LABORATORY'
      },
      NODE_2_OFFICE: {
        pos: new THREE.Vector3(8.0, 2.2, -6.5),
        target: new THREE.Vector3(8.0, 1.4, -13.0),
        fov: 52,
        label: "NODE 2: DIRECTOR'S OFFICE"
      },
      NODE_3_VAULT: {
        pos: new THREE.Vector3(0, 2.2, -7.5),
        target: new THREE.Vector3(0, 1.6, -14.2),
        fov: 52,
        label: 'NODE 3: TEMPORAL VAULT BULKHEAD'
      },
      NODE_4_COURTYARD: {
        pos: new THREE.Vector3(-7.5, 3.2, 9.5),
        target: new THREE.Vector3(-7.5, 0.6, 2.5),
        fov: 54,
        label: 'NODE 4: CENTRAL DRAINAGE COURTYARD'
      },
      NODE_5_SECURITY: {
        pos: new THREE.Vector3(7.5, 2.4, 9.5),
        target: new THREE.Vector3(7.5, 1.2, 2.5),
        fov: 52,
        label: 'NODE 5: SECURITY MAIN HUB'
      },
      INSPECT_VALVE: {
        pos: new THREE.Vector3(-8.2, 1.8, -11.5),
        target: new THREE.Vector3(-8.2, 1.8, -13.1),
        fov: 36,
        label: 'COOLANT PRESSURE MANIFOLD'
      },
      INSPECT_CISTERN: {
        pos: new THREE.Vector3(-7.5, 1.8, 4.5),
        target: new THREE.Vector3(-7.5, 0.1, 3.5),
        fov: 38,
        label: 'SUBTERRANEAN CISTERN GRATE'
      },
      INSPECT_SAFE: {
        pos: new THREE.Vector3(12.5, 1.8, -10.0),
        target: new THREE.Vector3(14.0, 1.8, -10.0),
        fov: 36,
        label: 'BIOMETRIC WALL SAFE'
      },
      INSPECT_SECURITY_CONSOLE: {
        pos: new THREE.Vector3(7.5, 1.8, 5.2),
        target: new THREE.Vector3(7.5, 1.1, 3.3),
        fov: 38,
        label: 'SECURITY SURVEILLANCE CONSOLE & FARADAY CONTROLS'
      }
    };

    this.built = false;
    this.handDrawerCollapsed = false;
    this.nodesNavCollapsed = false;
    this.whisperBannerDismissed = false;
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
    const whisperModal = document.getElementById('triad-whisper-modal');
    if (whisperModal) whisperModal.remove();

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
  // 2. FACILITY FLOOR, WALLS, PARTITIONS & ARCHITECTURAL ROOMS
  // =========================================================================
  buildFacilityFloor() {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.9, metalness: 0.1 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.9 });
    const partitionMat = new THREE.MeshStandardMaterial({ color: 0x2a3442, roughness: 0.85, metalness: 0.2 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });

    // Main facility base foundation floor (30m wide x 32m deep)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 32), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -2);
    this.group.add(floor);

    // North perimeter wall (behind Lab, Vault, Office)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(30, 4.5, 0.6), wallMat);
    northWall.position.set(0, 2.25, -16);
    this.group.add(northWall);

    // East outer wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.5, 32), wallMat);
    eastWall.position.set(15, 2.25, -2);
    this.group.add(eastWall);

    // West outer wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.5, 32), wallMat);
    westWall.position.set(-15, 2.25, -2);
    this.group.add(westWall);

    // South perimeter wall
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(30, 4.5, 0.6), wallMat);
    southWall.position.set(0, 2.25, 13);
    this.group.add(southWall);

    // -------------------------------------------------------------------------
    // INTERIOR ARCHITECTURAL PARTITION WALLS (ENCLOSES EACH ROOM AS DISTINCT SPACE)
    // -------------------------------------------------------------------------

    // 1. Vault West Partition Wall (Separates Node 1 Lab from Node 3 Vault Corridor)
    // Runs Z: -16 to -5.5 at X = -3.5
    const vaultWestWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 10.5), partitionMat);
    vaultWestWall.position.set(-3.5, 2.25, -10.75);
    this.group.add(vaultWestWall);

    // 2. Vault East Partition Wall (Separates Node 2 Office from Node 3 Vault Corridor)
    // Runs Z: -16 to -5.5 at X = +3.5
    const vaultEastWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 10.5), partitionMat);
    vaultEastWall.position.set(3.5, 2.25, -10.75);
    this.group.add(vaultEastWall);

    // 3. North/South Dividing Wall - West Section (Separates Lab from Courtyard)
    // Runs X: -15 to -3.5 at Z = -5.5, with doorway opening at X: -5.5
    const labSouthWall1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.5, 0.5), partitionMat);
    labSouthWall1.position.set(-10.5, 2.25, -5.5);
    this.group.add(labSouthWall1);

    const labDoorArch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 0.5), metalMat);
    labDoorArch.position.set(-5.5, 3.9, -5.5);
    this.group.add(labDoorArch);

    // 4. North/South Dividing Wall - East Section (Separates Office from Security Hub)
    // Runs X: +3.5 to +15 at Z = -5.5, with doorway opening at X: +5.5
    const officeSouthWall1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.5, 0.5), partitionMat);
    officeSouthWall1.position.set(10.5, 2.25, -5.5);
    this.group.add(officeSouthWall1);

    const officeDoorArch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 0.5), metalMat);
    officeDoorArch.position.set(5.5, 3.9, -5.5);
    this.group.add(officeDoorArch);

    // 5. South Facility Central Dividing Wall (Separates Node 4 Courtyard from Node 5 Security Hub)
    // Runs Z: -5.5 to +13 at X = 0, with central industrial portal at Z = +3.5
    const southMidWallNorth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 7.0), partitionMat);
    southMidWallNorth.position.set(0, 2.25, -2.0);
    this.group.add(southMidWallNorth);

    const southMidWallSouth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.5, 7.5), partitionMat);
    southMidWallSouth.position.set(0, 2.25, 9.25);
    this.group.add(southMidWallSouth);

    const courtyardPortalTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.3, 4.0), metalMat);
    courtyardPortalTop.position.set(0, 3.85, 3.5);
    this.group.add(courtyardPortalTop);

    // -------------------------------------------------------------------------
    // DISTINCT ROOM FLOOR MATERIALS & AMBIANCE TILES
    // -------------------------------------------------------------------------
    // Lab Floor: Clinical Cleanroom Tiles (Teal/Grey)
    const labFloorMat = new THREE.MeshStandardMaterial({ color: 0x1e2e38, roughness: 0.3, metalness: 0.3 });
    const labFloor = new THREE.Mesh(new THREE.PlaneGeometry(11, 10), labFloorMat);
    labFloor.rotation.x = -Math.PI / 2;
    labFloor.position.set(-9.25, 0.02, -10.75);
    this.group.add(labFloor);

    // Office Floor: Warm Executive Parquet Hardwood
    const officeFloorMat = new THREE.MeshStandardMaterial({ color: 0x36180a, roughness: 0.6 });
    const officeFloor = new THREE.Mesh(new THREE.PlaneGeometry(11, 10), officeFloorMat);
    officeFloor.rotation.x = -Math.PI / 2;
    officeFloor.position.set(9.25, 0.02, -10.75);
    this.group.add(officeFloor);

    // Director's Persian Rug (Center of Office)
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 4.5), rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(8.5, 0.03, -11.0);
    this.group.add(rug);

    // Vault Floor: Titanium Blast Plating with Violet Tachyon Lines
    const vaultFloorMat = new THREE.MeshStandardMaterial({ color: 0x111624, metalness: 0.85, roughness: 0.2 });
    const vaultFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 9.5), vaultFloorMat);
    vaultFloor.rotation.x = -Math.PI / 2;
    vaultFloor.position.set(0, 0.02, -10.75);
    this.group.add(vaultFloor);

    // Courtyard Floor: Wet Dark Flagstone / Asphalt Paving
    const courtyardFloorMat = new THREE.MeshStandardMaterial({ color: 0x171e27, roughness: 0.95 });
    const courtyardFloor = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 17.5), courtyardFloorMat);
    courtyardFloor.rotation.x = -Math.PI / 2;
    courtyardFloor.position.set(-7.25, 0.02, 3.75);
    this.group.add(courtyardFloor);

    // Security Floor: Raised Anti-Static Slate Grid
    const securityFloorMat = new THREE.MeshStandardMaterial({ color: 0x1c222d, roughness: 0.7, metalness: 0.4 });
    const securityFloor = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 17.5), securityFloorMat);
    securityFloor.rotation.x = -Math.PI / 2;
    securityFloor.position.set(7.25, 0.02, 3.75);
    this.group.add(securityFloor);
  }

  // =========================================================================
  // 3. NODE 1: RESEARCH LABORATORY (Sector Alpha: Enclosed Lab Chamber)
  // =========================================================================
  buildNode1_Laboratory() {
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.3 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, roughness: 0.1 });

    // Laboratory Main Counter Station (Facing North inside Lab)
    const bench = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.9, 1.5), benchMat);
    bench.position.set(-8.0, 0.45, -12.5);
    this.group.add(bench);

    // Mass Spectrometer & Centrifuge on Bench
    const spectro = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 1.0), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    spectro.position.set(-9.5, 1.35, -12.5);
    this.group.add(spectro);

    // Glowing Oscilloscope Screen
    const oscScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.35), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    oscScreen.position.set(-9.5, 1.45, -11.99);
    this.group.add(oscScreen);

    // Chemical Reagent Glassware on Bench
    for (let i = -0.5; i <= 0.5; i += 0.35) {
      const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.35, 12), glassMat);
      flask.position.set(-7.0 + i, 1.08, -12.4);
      this.group.add(flask);
    }

    // Heavy Coolant Pressure Manifold Pipe on North Wall
    const coolantPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.0, 16), pipeMat);
    coolantPipe.rotation.z = Math.PI / 2;
    coolantPipe.position.set(-8.0, 1.8, -15.5);
    this.group.add(coolantPipe);

    // Pressure Gauge Dial
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16), brassMat);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(-7.2, 2.2, -15.4);
    this.group.add(gauge);

    // Large Red Hydraulic Valve Wheel (Interactive Ripple Control)
    const valveGroup = new THREE.Group();
    valveGroup.position.set(-8.2, 1.8, -15.4);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.045, 8, 24), redMat);
    valveGroup.add(rim);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12), brassMat);
    hub.rotation.x = Math.PI / 2;
    valveGroup.add(hub);

    const spoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), brassMat);
    valveGroup.add(spoke1);

    const spoke2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), brassMat);
    spoke2.rotation.z = Math.PI / 2;
    valveGroup.add(spoke2);

    this.group.add(valveGroup);
    this.valveWheel = valveGroup;

    // West Wall Blackboard with Tachyon Calculations
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.0, 3.5), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }));
    board.position.set(-14.65, 2.2, -10.5);
    this.group.add(board);

    // Reagent Storage Shelving on West Wall
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.0, 2.0), benchMat);
    shelf.position.set(-14.4, 1.6, -13.5);
    this.group.add(shelf);
  }

  // =========================================================================
  // 4. NODE 2: DIRECTOR'S OFFICE (Sector Beta: Enclosed Executive Suite)
  // =========================================================================
  buildNode2_DirectorOffice() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1e3a29, roughness: 0.8 }); // Emerald green leather

    // Julian Vance's Massive Executive Mahogany Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.88, 2.0), woodMat);
    desk.position.set(8.5, 0.44, -11.5);
    this.group.add(desk);

    // Desk Blotter & Documents
    const blotter = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.02, 1.2), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    blotter.position.set(8.5, 0.89, -11.5);
    this.group.add(blotter);

    // Brass Banker's Lamp with Emerald Glass Shade
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.05, 16), goldMat);
    lampBase.position.set(10.0, 0.91, -11.8);
    this.group.add(lampBase);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    lampShade.position.set(10.0, 1.18, -11.8);
    this.group.add(lampShade);

    // High-back Executive Armchair behind Desk
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.2), leatherMat);
    chairBack.position.set(8.5, 1.3, -13.0);
    this.group.add(chairBack);

    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1.0), leatherMat);
    chairSeat.position.set(8.5, 0.65, -12.5);
    this.group.add(chairSeat);

    // Executive Bookcase on East Wall
    const bookcase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.4, 4.0), woodMat);
    bookcase.position.set(14.3, 1.7, -12.0);
    this.group.add(bookcase);

    // Biometric Wall Safe embedded in East Wall (Interactive Ripple Control)
    const safeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.6, 1.6), steelMat);
    safeFrame.position.set(14.5, 1.8, -9.0);
    this.group.add(safeFrame);

    const safeDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 1.4), steelMat);
    safeDoorMesh.position.set(14.45, 1.8, -9.0);

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.09, 16), goldMat);
    dial.rotation.z = Math.PI / 2;
    dial.position.set(-0.07, 0, 0);
    safeDoorMesh.add(dial);

    this.group.add(safeDoorMesh);
    this.safeDoor = safeDoorMesh;

    // Grandfather Clock on West Partition Wall
    const clock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.6), woodMat);
    clock.position.set(4.0, 1.6, -10.0);
    this.group.add(clock);
  }

  // =========================================================================
  // 5. NODE 3: TEMPORAL VAULT (Sector Omega: Enclosed Blast Chamber)
  // =========================================================================
  buildNode3_TemporalVault() {
    const vaultMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7c3aed, emissiveIntensity: 0.9, roughness: 0.1 });

    // Reinforced Blast Portal Entrance Archway (Z = -6.5)
    const portalArch = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.5, 0.8), vaultMat);
    portalArch.position.set(0, 2.25, -6.5);
    this.group.add(portalArch);

    // Portal Cutout Frame & Hazard Stripes
    const hazardStripeTop = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 0.9), hazardMat);
    hazardStripeTop.position.set(0, 3.5, -6.5);
    this.group.add(hazardStripeTop);

    // Massive Circular Titanium Bulkhead Door (North Wall of Chamber Z = -15.4)
    const door = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.5, 32), vaultMat);
    door.rotation.x = Math.PI / 2;
    door.position.set(0, 2.2, -15.4);

    // 8 Radial Locking Lugs
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.6), hazardMat);
      lug.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
      door.add(lug);
    }
    this.group.add(door);
    this.vaultBulkhead = door;

    // Tachyon Resonance Core Plinth (Center of Chamber)
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.6, 8), vaultMat);
    plinth.position.set(0, 0.3, -11.5);
    this.group.add(plinth);

    // Floating Glowing Tachyon Ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.14, 16, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 1.5, -11.5);
    this.group.add(ring);
    this.tachyonRing = ring;

    // Magnetic Containment Pylons surrounding Tachyon Core
    const pylonGeo = new THREE.CylinderGeometry(0.12, 0.15, 2.8, 12);
    [[-1.8, -10.0], [1.8, -10.0], [-1.8, -13.0], [1.8, -13.0]].forEach(([px, pz]) => {
      const pylon = new THREE.Mesh(pylonGeo, vaultMat);
      pylon.position.set(px, 1.4, pz);
      this.group.add(pylon);
    });
  }

  // =========================================================================
  // 6. NODE 4: CENTRAL DRAINAGE COURTYARD (Sector Gamma: Exterior Courtyard)
  // =========================================================================
  buildNode4_Courtyard() {
    const wetStoneMat = new THREE.MeshStandardMaterial({ color: 0x1e2631, roughness: 0.95 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 });

    // Recessed Courtyard Cistern Basin Pit
    const pit = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.5, 6.5), wetStoneMat);
    pit.position.set(-7.5, 0.05, 3.5);
    this.group.add(pit);

    // Heavy Subterranean Iron Cistern Grate (Interactive Ripple Control)
    const grateGroup = new THREE.Group();
    grateGroup.position.set(-7.5, 0.28, 3.5);

    const grateFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 2.6), grateMat);
    grateGroup.add(grateFrame);

    for (let i = -1.1; i <= 1.1; i += 0.22) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, 2.3), grateMat);
      bar.position.set(i, 0, 0);
      grateGroup.add(bar);
    }

    this.group.add(grateGroup);
    this.cisternGrate = grateGroup;

    // Storm Downspouts descending on West Wall
    const downspout = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.5, 12), pipeMat);
    downspout.position.set(-14.4, 2.25, 3.5);
    this.group.add(downspout);

    // Industrial Safety Railings around Courtyard Pit
    const railMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5 });
    const railNorth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.8, 0.06), railMat);
    railNorth.position.set(-7.5, 0.7, 0.2);
    this.group.add(railNorth);

    const railSouth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.8, 0.06), railMat);
    railSouth.position.set(-7.5, 0.7, 6.8);
    this.group.add(railSouth);
  }

  // =========================================================================
  // 7. NODE 5: SECURITY MAIN HUB (Sector Delta: Enclosed Surveillance Station)
  // =========================================================================
  buildNode5_SecurityHub() {
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.4 });
    const crtMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

    // Mainframe Computer Server Rack Cabinets on East Wall
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.4, 5.0), rackMat);
    rack.position.set(14.0, 1.7, 3.5);
    this.group.add(rack);

    // 6 Spinning Reel-to-Reel Tape Drives
    for (let y = 1.3; y <= 2.5; y += 0.8) {
      for (let z = 2.2; z <= 4.8; z += 1.3) {
        const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 24), tapeMat);
        reel.rotation.z = Math.PI / 2;
        reel.position.set(13.25, y, z);
        this.group.add(reel);
        this.tapeReels.push(reel);
      }
    }

    // Security Operator Workstation Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.88, 1.8), rackMat);
    desk.position.set(7.5, 0.44, 3.5);
    this.group.add(desk);

    // Bank of 3 CRT Surveillance Monitors
    const monOffsets = [-1.0, 0, 1.0];
    monOffsets.forEach((ox) => {
      const monBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.65, 0.55), rackMat);
      monBox.position.set(7.5 + ox, 1.25, 3.3);
      this.group.add(monBox);

      const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.5), crtMat);
      monScreen.position.set(7.5 + ox, 1.25, 3.59);
      this.group.add(monScreen);
      this.monitorScreens.push(monScreen);
    });

    // Interactive Faraday Cage Heavy Breaker Switch on Desk
    const switchBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.16, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 })
    );
    switchBase.position.set(7.5, 0.94, 3.9);
    this.group.add(switchBase);

    // Faraday Switch Lever Group
    const switchLeverGroup = new THREE.Group();
    switchLeverGroup.position.set(7.5, 1.02, 3.9);

    const switchArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
    );
    switchArm.position.set(0, 0.15, 0);
    switchLeverGroup.add(switchArm);

    const switchHandle = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    switchHandle.position.set(0, 0.32, 0);
    switchLeverGroup.add(switchHandle);

    switchLeverGroup.rotation.x = 0.45; // default position (unshielded)
    switchLeverGroup.userData = { isFaradaySwitch: true };
    this.group.add(switchLeverGroup);
    this.faradaySwitch = switchLeverGroup;

    // Faraday Status LED Indicator Light
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), ledMat);
    ledMesh.position.set(7.85, 1.05, 3.9);
    this.group.add(ledMesh);
    this.faradayStatusLight = ledMesh;
  }

  // =========================================================================
  // 8. HOTSPOTS & CAMERA INTERACTION TARGETS
  // =========================================================================
  buildHotspots() {
    this.addHotspot(new THREE.Vector3(-8.0, 1.8, -12.5), 'INSPECT_VALVE', 'COOLANT PRESSURE MANIFOLD', 1);
    this.addHotspot(new THREE.Vector3(13.8, 1.8, -9.0), 'INSPECT_SAFE', 'BIOMETRIC WALL SAFE', 2);
    this.addHotspot(new THREE.Vector3(0, 2.0, -13.5), 'NODE_3_VAULT', 'TEMPORAL VAULT BULKHEAD', 3);
    this.addHotspot(new THREE.Vector3(-7.5, 0.5, 3.5), 'INSPECT_CISTERN', 'DRAINAGE CISTERN GRATE', 4);
    this.addHotspot(new THREE.Vector3(7.5, 1.2, 3.9), 'INSPECT_SECURITY_CONSOLE', 'SURVEILLANCE TERMINAL & FARADAY SWITCH', 5);
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

    // 5. Node 5 Faraday Shield Status & Switch Animation
    if (window.triadState && window.triadState.rippleTracks) {
      const isShielded = (window.triadState.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED');
      
      // Animate lever position
      if (this.faradaySwitch) {
        const targetRot = isShielded ? -0.45 : 0.45;
        this.faradaySwitch.rotation.x += (targetRot - this.faradaySwitch.rotation.x) * 0.15;
      }

      // Update LED indicator
      if (this.faradayStatusLight) {
        this.faradayStatusLight.material.color.setHex(isShielded ? 0x10b981 : 0xef4444);
      }

      // Update CRT Monitor Screens
      if (this.monitorScreens && this.monitorScreens.length > 0) {
        this.monitorScreens.forEach(screen => {
          if (isShielded) {
            // Amber/Gold shielded surveillance stream
            screen.material.color.setHex(0xf59e0b);
          } else {
            // Standard phosphor green
            screen.material.color.setHex(0x059669);
          }
        });
      }
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

    const state = window.triadState;
    const currentNode = state ? state.meepleNodes['1979'] : 5;
    const currentNodeName = state ? state.nodeNames[currentNode - 1] : 'Security Hub';
    const stab = state ? state.chronalStability : 20;
    const ap = state ? state.ap['1979'] : 3;

    let hud = document.getElementById('triad-1979-hud');

    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'triad-1979-hud';
      hud.className = 'triad-architect-hud';
      hud.innerHTML = `
        <!-- TOP COMMAND BAR (ULTRA-SLIM SINGLE STRIP, DOES NOT OBSTRUCT 3D FACILITY) -->
        <div class="hud-top-bar glass-panel">
          <div class="station-identity">
            <span class="station-era-badge badge-1979">1979 ARCHITECT</span>
            <span class="facility-status-pill">PRISTINE FACILITY</span>
          </div>

          <div class="station-metrics">
            <div class="metric-chip" title="Temporal Fabric Integrity">
              <span class="m-label">STABILITY:</span>
              <strong id="hud-1979-stab" class="m-val" style="color:${stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff')};">${stab}</strong>
            </div>
            <div class="metric-chip" title="Turn Action Points (Recharges each round)">
              <span class="m-label">AP:</span>
              <strong id="hud-1979-ap" class="m-val ap-val">${ap} / 3</strong>
            </div>
            <div class="metric-chip" title="Current Facility Room">
              <span class="m-label">LOCATION:</span>
              <strong id="hud-1979-loc" class="m-val">N${currentNode}: ${currentNodeName}</strong>
            </div>
          </div>

          <div class="hud-top-actions">
            <button class="btn btn-hud-action action-briefing" onclick="window.triadShowMissionBriefing()" title="Open Mission Operation Briefing guide">
              <span class="act-icon">🧭</span>
              <span class="act-text">BRIEFING</span>
            </button>
            <button class="btn btn-hud-action action-search" onclick="triadEnv.onSearchClick()" title="Search current room for confidential blueprints and items (1 AP)">
              <span class="act-icon">🔍</span>
              <span class="act-text">SEARCH <span class="ap-badge">1 AP</span></span>
            </button>
            <button class="btn btn-hud-action action-ripple" onclick="triadRippleUI.openModal()" title="Modify physical causality tracks on the Ripple Matrix (2 AP)">
              <span class="act-icon">🌀</span>
              <span class="act-text">RIPPLE <span class="ap-badge">2 AP</span></span>
            </button>
            <button class="btn btn-hud-action action-consensus" onclick="triadRippleUI.openModal()" title="View timeline consensus notebook">
              <span class="act-icon">⚖️</span>
              <span class="act-text">NOTEBOOK</span>
            </button>
            <button class="btn btn-hud-action action-rooms ${this.nodesNavCollapsed ? '' : 'active'}" id="btn-top-toggle-rooms" onclick="triadEnv.toggleNodesNav()" title="Toggle Facility Room Movement buttons">
              <span class="act-icon">🗺️</span>
              <span class="act-text">ROOMS</span>
            </button>
            <button class="btn btn-hud-action action-overview" onclick="triadEnv.onOverviewClick()" title="Reset 3D camera to full facility overview">
              <span class="act-icon">🎥</span>
              <span class="act-text">OVERVIEW</span>
            </button>
            <button class="btn btn-hud-action action-end-turn" onclick="triadEnv.onPassTurn()" title="End your turn and pass remaining AP for this round">
              <span class="act-icon">⏭️</span>
              <span class="act-text">END TURN</span>
            </button>
          </div>
        </div>

        <!-- BOTTOM CONTROL DOCK (ROOM NAVIGATION & PRIVATE HAND DOCKED AT BOTTOM) -->
        <div class="hud-bottom-dock">
          <!-- 1979 FACILITY ROOM MOVEMENT BAR (SLIM, COLLAPSIBLE, SITS ABOVE HAND DRAWER) -->
          <div class="triad-nodes-navbar glass-panel ${this.nodesNavCollapsed ? 'nav-collapsed' : ''}" id="hud-1979-nodes-bar">
            <div class="nodes-nav-header" onclick="triadEnv.toggleNodesNav()">
              <div class="nodes-header-left">
                <span class="nav-icon">🗺️</span>
                <span class="nav-label">FACILITY ROOM MOVEMENT (1 AP):</span>
                <span class="nav-loc-chip">CURRENT: <strong>${currentNodeName.toUpperCase()}</strong></span>
              </div>
              <div class="nodes-header-right">
                <button class="btn-toggle-nodes" id="btn-toggle-nodes-state" onclick="event.stopPropagation(); triadEnv.toggleNodesNav();">
                  <span class="toggle-icon">${this.nodesNavCollapsed ? '▴' : '▾'}</span>
                  <span class="toggle-text">${this.nodesNavCollapsed ? 'EXPAND ROOMS' : 'MINIMIZE'}</span>
                </button>
              </div>
            </div>
            <div class="nodes-nav-grid" id="hud-1979-nodes-grid">
              ${this.renderNodesGridHtml(state, currentNode)}
            </div>
          </div>

          <!-- BOTTOM SECTION: ARCHITECT PRIVATE HAND (WHISPER RULE APPLIES) -->
          <div class="hud-hand-drawer glass-panel ${this.handDrawerCollapsed ? 'drawer-collapsed' : ''}" id="hud-1979-hand-drawer">
            <div class="hand-drawer-header" onclick="triadEnv.toggleHandDrawer()">
              <div class="drawer-header-left">
                <span class="drawer-drag-pill"></span>
                <span class="drawer-folder-icon">📐</span>
                <div class="drawer-title-group">
                  <strong class="drawer-main-title">ARCHITECT PRIVATE HAND</strong>
                  <span class="drawer-sub-title">1979 BLUEPRINT DOSSIERS & PROTOTYPES</span>
                </div>
                <span class="hand-count-badge" id="hud-hand-count-badge">0 CARDS</span>
              </div>

              <div class="drawer-header-center">
                <div class="whisper-rule-pill radio-comms-pill" onclick="event.stopPropagation(); triadEnv.showCommsProtocolModal();" title="Click to view Open Comms & System Rules">
                  <span class="whisper-lock-icon radio-comms-icon">📡</span>
                  <span class="whisper-pill-text">OPEN RADIO COMMS (ACTIVE)</span>
                  <span class="whisper-help-icon">ℹ️</span>
                </div>
              </div>

              <div class="drawer-header-right">
                <button class="btn-drawer-toggle" id="btn-drawer-toggle-state" aria-label="Toggle Hand Drawer" onclick="event.stopPropagation(); triadEnv.toggleHandDrawer();">
                  <span class="toggle-icon">${this.handDrawerCollapsed ? '▴' : '▾'}</span>
                  <span class="toggle-label">${this.handDrawerCollapsed ? 'EXPAND' : 'COLLAPSE'}</span>
                </button>
              </div>
            </div>

            <!-- OPEN RADIO COMMS INLINE STATUS BANNER -->
            <div class="hand-whisper-banner ${this.whisperBannerDismissed ? 'hidden' : ''}" id="hand-whisper-banner">
              <div class="whisper-banner-left">
                <span class="whisper-banner-icon">📡</span>
                <div class="whisper-banner-text">
                  <strong>OPEN CHRONAL RADIO ACTIVE:</strong>
                  <span>You may talk freely and read clues aloud to Operatives 2 &amp; 3! Station actions, AP costs, and 2019 Quantum Synthesis are mechanically enforced by code.</span>
                </div>
              </div>
              <div class="whisper-banner-right">
                <button class="btn-whisper-details" onclick="event.stopPropagation(); triadEnv.showCommsProtocolModal();">SYSTEM RULES</button>
                <button class="btn-dismiss-whisper" title="Dismiss banner" onclick="event.stopPropagation(); triadEnv.dismissWhisperBanner();">✕</button>
              </div>
            </div>

            <!-- CARDS CONTAINER (HORIZONTAL CAROUSEL ON DESKTOP & TOUCH SLIDER ON MOBILE) -->
            <div class="hand-cards-container" id="hud-1979-cards-container">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>
      `;

      const container = document.getElementById('screen-defuser');
      if (container) {
        container.appendChild(hud);
      }
    } else {
      // Dynamic update of existing DOM without resetting scroll/collapse state
      const stabEl = document.getElementById('hud-1979-stab');
      const apEl = document.getElementById('hud-1979-ap');
      const locEl = document.getElementById('hud-1979-loc');
      const gridEl = document.getElementById('hud-1979-nodes-grid');
      const locChip = document.querySelector('.nav-loc-chip');

      if (stabEl) {
        stabEl.innerText = stab;
        stabEl.style.color = stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff');
      }
      if (apEl) apEl.innerText = `${ap} / 3`;
      if (locEl) locEl.innerText = `N${currentNode}: ${currentNodeName}`;
      if (locChip) locChip.innerHTML = `CURRENT: <strong>${currentNodeName.toUpperCase()}</strong>`;
      if (gridEl) gridEl.innerHTML = this.renderNodesGridHtml(state, currentNode);
    }

    this.render1979Hand();
  }

  toggleNodesNav(forcedState) {
    if (typeof forcedState === 'boolean') {
      this.nodesNavCollapsed = forcedState;
    } else {
      this.nodesNavCollapsed = !this.nodesNavCollapsed;
    }

    const navBar = document.getElementById('hud-1979-nodes-bar');
    const toggleBtn = document.getElementById('btn-toggle-nodes-state');
    const topBtn = document.getElementById('btn-top-toggle-rooms');

    if (navBar) {
      if (this.nodesNavCollapsed) {
        navBar.classList.add('nav-collapsed');
      } else {
        navBar.classList.remove('nav-collapsed');
      }
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="toggle-icon">${this.nodesNavCollapsed ? '▴' : '▾'}</span>
        <span class="toggle-text">${this.nodesNavCollapsed ? 'EXPAND ROOMS' : 'MINIMIZE'}</span>
      `;
    }
    if (topBtn) {
      if (this.nodesNavCollapsed) {
        topBtn.classList.remove('active');
      } else {
        topBtn.classList.add('active');
      }
    }
  }

  onOverviewClick() {
    if (window.bomb3D) {
      window.bomb3D.setView('OVERVIEW');
    }
  }

  renderNodesGridHtml(state, currentNode) {
    const hasAP = state ? state.hasAP('1979', 1) : true;
    return [1, 2, 3, 4, 5].map(n => {
      const isHere = (currentNode === n);
      let statusNotice = '';
      if (state) {
        // Operator 1: If room is not locked, do not add any status or locked label!
        const isRestricted = state.isNodeRestricted ? state.isNodeRestricted('1979', n) : false;
        if (isRestricted) {
          statusNotice = '<span class="node-tag locked">🔒 LOCKED</span>';
        }
        if (state.plantedItems && state.plantedItems[n]) {
          statusNotice += '<span class="node-tag planted">🌱 ITEM STASHED</span>';
        }
      }
      const noAPClass = (!isHere && !hasAP) ? 'node-no-ap' : '';
      const tooltip = (!isHere && !hasAP) ? 'title="Insufficient AP (Requires 1 AP)"' : '';
      return `
        <button class="btn-node-nav ${isHere ? 'active' : ''} ${noAPClass}" ${tooltip} onclick="triadEnv.onMoveNode(${n})">
          <span class="node-num-tag">NODE ${n}</span>
          <span class="node-title-tag">${state ? state.nodeNames[n - 1] : ''}</span>
          ${isHere ? '<span class="meeple-here-badge">YOU ARE HERE</span>' : ''}
          ${statusNotice}
        </button>
      `;
    }).join('');
  }

  toggleHandDrawer(forcedState) {
    if (typeof forcedState === 'boolean') {
      this.handDrawerCollapsed = forcedState;
    } else {
      this.handDrawerCollapsed = !this.handDrawerCollapsed;
    }

    const drawer = document.getElementById('hud-1979-hand-drawer');
    const toggleBtn = document.getElementById('btn-drawer-toggle-state');
    if (drawer) {
      if (this.handDrawerCollapsed) {
        drawer.classList.add('drawer-collapsed');
      } else {
        drawer.classList.remove('drawer-collapsed');
      }
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="toggle-icon">${this.handDrawerCollapsed ? '▴' : '▾'}</span>
        <span class="toggle-label">${this.handDrawerCollapsed ? 'EXPAND' : 'COLLAPSE'}</span>
      `;
    }
  }

  dismissWhisperBanner() {
    this.whisperBannerDismissed = true;
    const banner = document.getElementById('hand-whisper-banner');
    if (banner) banner.classList.add('hidden');
  }

  showCommsProtocolModal() {
    let modal = document.getElementById('triad-whisper-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'triad-whisper-modal';
      modal.className = 'triad-modal-overlay';
      modal.innerHTML = `
        <div class="triad-modal-card whisper-modal-card" style="max-width: 620px; max-height: 88vh;">
          <div class="triad-modal-header" style="background: rgba(30, 20, 10, 0.95); border-bottom: 2px solid #f59e0b;">
            <div class="triad-header-title">
              <h2 style="color: #fbbf24; display: flex; align-items: center; gap: 8px;">
                <span>📡</span> OPEN RADIO COMMS &amp; SYSTEM RULES
              </h2>
              <span class="triad-case-tag" style="color: #f59e0b;">CASE 005: THE TRIAD PARADOX // SYSTEM-ENFORCED CO-OP</span>
            </div>
            <button class="modal-close-btn" onclick="triadEnv.closeCommsProtocolModal()">✕</button>
          </div>
          <div class="triad-modal-body" style="padding: 20px; font-family: 'Rajdhani', sans-serif; font-size: 1.02rem; line-height: 1.45; color: #e2e8f0;">
            <div style="background: rgba(16, 185, 129, 0.12); border-left: 4px solid #10b981; padding: 10px 14px; border-radius: 4px; margin-bottom: 16px;">
              <strong style="color: #34d399; font-size: 1.08rem; display: block; margin-bottom: 2px;">🗣️ UNRESTRICTED VOICE COMMS (TALK ANYTHING)</strong>
              <p style="margin: 0; font-size: 0.92rem; color: #a7f3d0;">Operatives may freely talk, read text aloud word-for-word, and coordinate over Discord/voice chat without artificial restrictions. Asymmetry is strictly enforced by in-game code:</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="font-size: 1.4rem; line-height: 1;">🔒</span>
                <div>
                  <strong style="color: #f59e0b;">1. HARD STATION LOCKOUT (PHYSICAL CONTROL)</strong>
                  <p style="margin: 2px 0 0 0; font-size: 0.88rem; color: #94a3b8;">Controls are era-locked: <strong>ONLY 1979</strong> can physically flip the breakers, valves, and switches in the past. <strong>ONLY 1999</strong> can analyze crime scene ballistics. <strong>ONLY 2019</strong> can operate the Quantum Terminal. Voice cannot touch hardware!</p>
                </div>
              </div>

              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="font-size: 1.4rem; line-height: 1;">📜</span>
                <div>
                  <strong style="color: #00f0ff;">2. INTEL UPLOAD (1 AP) MANDATORY FOR SYNTHESIS</strong>
                  <p style="margin: 2px 0 0 0; font-size: 0.88rem; color: #94a3b8;">Even if you read clues aloud to Operative 3, the 2019 Quantum Engine programmatically requires cards to be uploaded to the Public Board with <strong>1 AP</strong> before synthesis is possible.</p>
                </div>
              </div>

              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="font-size: 1.4rem; line-height: 1;">⚠️</span>
                <div>
                  <strong style="color: #ef4444;">3. AUTOMATIC CAUSAL PARADOX (-3 STABILITY)</strong>
                  <p style="margin: 2px 0 0 0; font-size: 0.88rem; color: #94a3b8;">The continuum engine mechanically validates timeline integrity. Manipulating 1979 reality in a way that contradicts verified future facts instantly triggers a -3 Chronal Paradox in code.</p>
                </div>
              </div>

              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="font-size: 1.4rem; line-height: 1;">🌱</span>
                <div>
                  <strong style="color: #10b981;">4. TIME CAPSULE STASH (1 AP)</strong>
                  <p style="margin: 2px 0 0 0; font-size: 0.88rem; color: #94a3b8;">To transmit a prototype to 1999, 1979 must physically stash it in the room (1 AP). In 1999, the Detective must physically spend 1 AP to secure it from the safe.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="triad-modal-footer" style="padding: 10px 18px; background: rgba(18, 14, 10, 0.95); border-top: 1px solid rgba(245, 158, 11, 0.2); display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="triadEnv.closeCommsProtocolModal()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #111; font-weight: 800; font-family: 'JetBrains Mono', monospace; padding: 8px 18px; border-radius: 4px; border: none; cursor: pointer;">
              CONFIRMED // RESUME OPERATION
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
  }

  closeCommsProtocolModal() {
    const modal = document.getElementById('triad-whisper-modal');
    if (modal) modal.style.display = 'none';
  }

  showWhisperModal() {
    this.showCommsProtocolModal();
  }

  closeWhisperModal() {
    this.closeCommsProtocolModal();
  }

  renderHUD() {
    this.inject1979HUD();
  }

  onMoveNode(nodeNum) {
    if (!window.triadState) return;
    if (window.triadState.meepleNodes['1979'] === nodeNum) {
      return;
    }
    const ok = window.triadState.moveMeeple('1979', nodeNum);
    this.inject1979HUD();
    if (!ok) {
      return;
    }
    const viewKeys = ['', 'NODE_1_LAB', 'NODE_2_OFFICE', 'NODE_3_VAULT', 'NODE_4_COURTYARD', 'NODE_5_SECURITY'];
    if (window.bomb3D && viewKeys[nodeNum]) {
      window.bomb3D.setView(viewKeys[nodeNum]);
    }
    this.showRoomTransitNotice(nodeNum);
  }

  showRoomTransitNotice(nodeNum) {
    const state = window.triadState;
    const roomName = (state && state.nodeNames[nodeNum - 1]) ? state.nodeNames[nodeNum - 1] : `Node ${nodeNum}`;
    
    // Play transition sound effect
    if (window.audio) {
      if (window.audio.playSlide) window.audio.playSlide();
      else if (window.audio.playClick) window.audio.playClick();
    }

    let banner = document.getElementById('triad-room-transit-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'triad-room-transit-banner';
      banner.className = 'triad-room-transit-banner';
      document.body.appendChild(banner);
    }

    const subNotice = (nodeNum === 3)
      ? (state && state.rippleTracks.vaultDoor.state === 'UNLOCKED' ? 'OUTER BULKHEAD // INNER VAULT UNLOCKED ✓' : 'OUTER BULKHEAD // INNER VAULT LOCKED (SEALS 1999 CRIME SCENE)')
      : 'PRESSURIZED AIRLOCK SEAL VERIFIED ✓';

    banner.innerHTML = `
      <div class="transit-banner-content">
        <span class="transit-era-tag">1979 ARCHITECT // FACILITY TRANSIT</span>
        <div class="transit-room-name">
          <span class="transit-node-badge">SECTOR 0${nodeNum}</span>
          <strong>${roomName.toUpperCase()}</strong>
        </div>
        <span class="transit-status-sub">${subNotice}</span>
      </div>
    `;

    banner.classList.remove('active');
    void banner.offsetWidth; // Force reflow
    banner.classList.add('active');

    if (this._transitTimeout) clearTimeout(this._transitTimeout);
    this._transitTimeout = setTimeout(() => {
      banner.classList.remove('active');
    }, 2200);
  }

  render1979Hand() {
    const container = document.getElementById('hud-1979-cards-container');
    const badgeEl = document.getElementById('hud-hand-count-badge');
    const shortcutEl = document.getElementById('hud-hand-count-shortcut');
    const state = window.triadState;
    if (!container || !state) return;

    const hand = state.hands['1979'] || [];
    const count = hand.length;

    if (badgeEl) badgeEl.innerText = `${count} CARD${count === 1 ? '' : 'S'}`;
    if (shortcutEl) shortcutEl.innerText = `${count}`;

    const currentNode = state.meepleNodes['1979'];
    const currentNodeName = state.nodeNames[currentNode - 1] || `Node ${currentNode}`;

    if (count === 0) {
      container.innerHTML = `
        <div class="empty-hand-blueprint">
          <div class="empty-hand-icon">📂</div>
          <div class="empty-hand-title">NO BLUEPRINTS IN PRIVATE HAND</div>
          <p class="empty-hand-desc">Search the current facility station (<strong>${currentNodeName}</strong>) to gather 1979 engineering schematics, physical prototypes, and classified files.</p>
          <button class="btn btn-primary btn-search-prompt" onclick="triadEnv.onSearchClick()">
            🔍 SEARCH ${currentNodeName.toUpperCase()} (1 AP)
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = hand.map(card => {
      const typeLower = (card.type || 'clue').toLowerCase();
      let typeIcon = '🔍';
      if (card.type === 'ITEM') typeIcon = '🔧';
      else if (card.type === 'EVENT') typeIcon = '⚡';

      const originName = (card.node && state.nodeNames[card.node - 1]) 
        ? state.nodeNames[card.node - 1] 
        : `NODE ${card.node || 1}`;

      const keywords = (card.keywords || []).map(kw => 
        `<span class="card-kw-chip" title="Consensus Keyword">🔑 ${kw}</span>`
      ).join('');

      let plantHtml = '';
      if (card.canPlant) {
        plantHtml = `
          <button class="btn btn-card-action btn-plant" onclick="triadEnv.onPlantClick('${card.id}')" title="Stash in ${currentNodeName} for 1999 detective to uncover">
            <span class="btn-icon">🌱</span>
            <div class="btn-text-col">
              <span class="btn-primary-text">PLANT ITEM (1 AP)</span>
              <span class="btn-sub-text">Stash in ${currentNodeName}</span>
            </div>
          </button>
        `;
      }

      return `
        <div class="hand-card-chip card-type-${typeLower}">
          <!-- Card Header Strip -->
          <div class="card-chip-header">
            <div class="card-header-left">
              <span class="card-type-tag tag-${typeLower}">
                ${typeIcon} ${card.type}
              </span>
              <span class="card-origin-tag">📍 ${originName}</span>
            </div>
            <span class="card-whisper-stamp">PRIVATE</span>
          </div>

          <!-- Card Body -->
          <div class="card-chip-body">
            <h4 class="card-chip-title">${card.title}</h4>
            <p class="card-chip-desc">${card.text}</p>
            ${keywords ? `<div class="card-chip-keywords">${keywords}</div>` : ''}
          </div>

          <!-- Card Actions -->
          <div class="card-chip-footer">
            <button class="btn btn-card-action btn-analyze" onclick="triadEnv.onAnalyzeClick('${card.id}')" title="Spend 1 AP to reveal exact text to all 3 operatives on the Public Intel Board">
              <span class="btn-icon">📜</span>
              <div class="btn-text-col">
                <span class="btn-primary-text">ANALYZE (1 AP)</span>
                <span class="btn-sub-text">Reveal to Public Intel</span>
              </div>
            </button>
            ${plantHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  onPassTurn() {
    if (!window.triadState) return;
    window.triadState.passTurn('1979');
    this.inject1979HUD();
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

  toggleFaradayShield() {
    if (!window.triadState) return;
    const currentTrack = window.triadState.rippleTracks.securityArchive;
    if (!currentTrack) return;
    const targetState = (currentTrack.state === 'FARADAY_SHIELDED') ? 'UNSHIELDED' : 'FARADAY_SHIELDED';
    
    const ok = window.triadState.temporalRipple('securityArchive', targetState);
    if (ok) {
      if (window.audio && window.audio.playLeverSwitch) {
        window.audio.playLeverSwitch();
      } else if (window.audio && window.audio.playClick) {
        window.audio.playClick();
      }
      this.inject1979HUD();
    }
  }
}

window.TriadEnvironment = TriadEnvironment;
