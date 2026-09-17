/* ==========================================================================
   MAP 2: 'THE ALCHEMIST'S STUDY' - VICTORIAN LIBRARY / MANOR ROOM
   Complete Three.js 3D Room, Props, Dynamic Lighting & Inspection Hotspots
   ========================================================================== */

class AlchemistStudyEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Interactive Hotspots Registry
    this.hotspots = [];

    // Animated Elements & Lighting References
    this.fireLight = null;
    this.fireLightSecondary = null;
    this.fireParticles = null;
    this.bankerSpot = null;
    this.bankerHalo = null;
    this.lightningLight = null;
    this.pendulumArm = null;
    this.astrolabeRings = [];
    this.lightningTimer = 0;
    this.nextLightningTime = 6.0;

    // Camera Presets
    this.cameraPresets = {
      OVERVIEW: {
        pos: new THREE.Vector3(0.00, 2.60, 4.60),
        target: new THREE.Vector3(0.00, 1.10, -0.40),
        fov: 50,
        label: "ALCHEMIST'S STUDY OVERVIEW"
      },
      INSPECT_PUZZLE_BOX: {
        pos: new THREE.Vector3(0.25, 1.48, 0.38),
        target: new THREE.Vector3(0.25, 0.90, -0.20),
        fov: 38,
        label: 'ORNATE BRASS PUZZLE BOX'
      },
      INSPECT_ASTROLABE: {
        pos: new THREE.Vector3(-1.10, 1.42, 0.45),
        target: new THREE.Vector3(-1.10, 1.05, -0.20),
        fov: 38,
        label: 'CELESTIAL ASTROLABE'
      },
      INSPECT_GRIMOIRE: {
        pos: new THREE.Vector3(-2.10, 1.60, -1.75),
        target: new THREE.Vector3(-2.80, 1.15, -2.40),
        fov: 38,
        label: 'ALCHEMICAL GRIMOIRE'
      },
      INSPECT_CLOCK: {
        pos: new THREE.Vector3(2.40, 1.95, -2.90),
        target: new THREE.Vector3(3.60, 1.95, -4.50),
        fov: 40,
        label: 'GRANDFATHER CLOCK DIAL'
      }
    };
  }

  build() {
    this.buildStructuralShell();
    this.buildGothicWindow();
    this.buildPersianRug();
    this.buildCarvedMahoganyDesk();
    this.buildBankersLamp();
    this.buildWingbackArmchair();
    this.buildFloorToCeilingBookshelves();
    this.buildGrandfatherClock();
    this.buildStoneFireplace();
    this.buildOrnatePuzzleBox();
    this.buildAstrolabeGlobe();
    this.buildGrimoireLectern();
    this.setupLighting();
    this.registerHotspots();
    return this.group;
  }

  // 1. Structural Shell: Dark Oak Wainscoting, Damask Wallpaper, Parquet Hardwood (9m W x 11m D x 4.8m H)
  buildStructuralShell() {
    // Polished Parquet Hardwood Floor
    const floorGeo = new THREE.PlaneGeometry(9.0, 11.0);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x382215, // Dark walnut parquet
      roughness: 0.28,
      metalness: 0.06,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Wainscoting Material (Lower Walls Y = 0 to 1.25m)
    const wainscotMat = new THREE.MeshStandardMaterial({
      color: 0x26140b,
      roughness: 0.42,
      metalness: 0.08
    });

    // Damask Wallpaper Material (Upper Walls Y = 1.25 to 4.8m)
    const damaskMat = new THREE.MeshStandardMaterial({
      color: 0x3d1018, // Deep Victorian burgundy
      roughness: 0.65,
      metalness: 0.12
    });

    // Builder helper for composite two-tone walls
    const createCompositeWall = (w, h, d, px, pz, ry = 0) => {
      const wallGroup = new THREE.Group();
      wallGroup.position.set(px, 0, pz);
      wallGroup.rotation.y = ry;

      // Lower Wainscot (1.25m)
      const lower = new THREE.Mesh(new THREE.BoxGeometry(w, 1.25, d), wainscotMat);
      lower.position.y = 0.625;
      lower.receiveShadow = true;
      wallGroup.add(lower);

      // Chair Rail Moulding
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d + 0.04), wainscotMat);
      rail.position.y = 1.25;
      wallGroup.add(rail);

      // Upper Damask Wallpaper (3.55m)
      const upper = new THREE.Mesh(new THREE.BoxGeometry(w, 3.55, d), damaskMat);
      upper.position.y = 3.025;
      upper.receiveShadow = true;
      wallGroup.add(upper);

      return wallGroup;
    };

    // North Wall Left & Right of Gothic Window
    this.group.add(createCompositeWall(3.2, 4.8, 0.4, -2.9, -5.5));
    this.group.add(createCompositeWall(3.2, 4.8, 0.4, 2.9, -5.5));
    // North Wall Header above window
    const northHeader = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 0.4), damaskMat);
    northHeader.position.set(0.0, 4.3, -5.5);
    this.group.add(northHeader);

    // West Wall (Fireplace wall)
    this.group.add(createCompositeWall(11.0, 4.8, 0.4, -4.5, 0.0, Math.PI / 2));

    // East Wall (Bookshelf wall)
    this.group.add(createCompositeWall(11.0, 4.8, 0.4, 4.5, 0.0, -Math.PI / 2));

    // South Wall
    this.group.add(createCompositeWall(9.0, 4.8, 0.4, 0.0, 5.5, Math.PI));

    // Coffered Timber Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(9.0, 11.0);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1c0d06,
      roughness: 0.55,
      metalness: 0.05
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.8, 0);
    this.group.add(ceiling);

    // Coffered Ceiling Timber Beams Grid
    for (let x = -3.0; x <= 3.0; x += 2.0) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 11.0), wainscotMat);
      beam.position.set(x, 4.675, 0.0);
      this.group.add(beam);
    }
    for (let z = -4.0; z <= 4.0; z += 2.0) {
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.25, 0.2), wainscotMat);
      crossBeam.position.set(0.0, 4.675, z);
      this.group.add(crossBeam);
    }
  }

  // 2. Large Arched Gothic Leaded-Glass Window (North Wall Z = -5.48)
  buildGothicWindow() {
    const winGroup = new THREE.Group();
    winGroup.position.set(0.0, 2.4, -5.45);

    // Stone Frame Tracery
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d3934, roughness: 0.88 });
    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.2, 0.25), stoneMat);
    leftJamb.position.set(-1.25, 0, 0);
    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.2, 0.25), stoneMat);
    rightJamb.position.set(1.25, 0, 0);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 0.35), stoneMat);
    sill.position.set(0, -1.6, 0);
    const topArch = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.22, 0.25), stoneMat);
    topArch.position.set(0, 1.6, 0);

    winGroup.add(leftJamb);
    winGroup.add(rightJamb);
    winGroup.add(sill);
    winGroup.add(topArch);

    // Leaded Glass Window Panes (Physical Glass)
    const glassGeo = new THREE.PlaneGeometry(2.35, 3.0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbed6ee,
      transmission: 0.88,
      roughness: 0.12,
      ior: 1.52,
      transparent: true,
      opacity: 0.95
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = 0.02;
    winGroup.add(glass);

    // Leaded Diamond Came Grid (Decorative lattice bars)
    const leadMat = new THREE.MeshStandardMaterial({ color: 0x1e2024, metalness: 0.8, roughness: 0.3 });
    for (let i = -1.0; i <= 1.0; i += 0.4) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.018, 3.0, 0.015), leadMat);
      bar.position.set(i, 0, 0.03);
      winGroup.add(bar);
    }
    for (let j = -1.2; j <= 1.2; j += 0.4) {
      const hbar = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.018, 0.015), leadMat);
      hbar.position.set(0, j, 0.03);
      winGroup.add(hbar);
    }

    // Exterior Rain Streak Plane
    const rainGeo = new THREE.PlaneGeometry(3.5, 4.5);
    const rainMat = new THREE.MeshBasicMaterial({
      color: 0x3d4b60,
      transparent: true,
      opacity: 0.4
    });
    const rain = new THREE.Mesh(rainGeo, rainMat);
    rain.position.set(0.0, 0.0, -0.6);
    winGroup.add(rain);

    this.group.add(winGroup);
  }

  // 3. Ornate Persian Rug Centerpiece
  buildPersianRug() {
    const rugGeo = new THREE.BoxGeometry(3.6, 0.008, 4.8);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x6e1b22, // Rich Persian deep crimson
      roughness: 0.85,
      metalness: 0.05
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0.0, 0.004, -0.3);
    rug.receiveShadow = true;

    // Gold Arabesque Medallion Center
    const medalGeo = new THREE.BoxGeometry(2.0, 0.009, 2.8);
    const medalMat = new THREE.MeshStandardMaterial({ color: 0xb58e38, roughness: 0.8 });
    const medallion = new THREE.Mesh(medalGeo, medalMat);
    medallion.position.set(0.0, 0.005, -0.3);
    this.group.add(medallion);

    // Fringed White Ends
    const fringeMat = new THREE.MeshBasicMaterial({ color: 0xded8c8 });
    const fringeNorth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.006, 0.12), fringeMat);
    fringeNorth.position.set(0.0, 0.004, -2.76);
    const fringeSouth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.006, 0.12), fringeMat);
    fringeSouth.position.set(0.0, 0.004, 2.16);

    this.group.add(rug);
    this.group.add(fringeNorth);
    this.group.add(fringeSouth);
  }

  // 4. Heavy Carved Mahogany Desk (Partner's Desk)
  buildCarvedMahoganyDesk() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0.0, 0.0, -0.4);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x2e1208, // Dark red mahogany
      roughness: 0.35,
      metalness: 0.08
    });

    // Twin Pedestals
    [-0.85, 0.85].forEach(px => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.74, 1.1), woodMat);
      ped.position.set(px, 0.37, 0.0);
      ped.castShadow = true;
      ped.receiveShadow = true;
      deskGroup.add(ped);

      // Brass Drawer Pull Handles
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.88, roughness: 0.22 });
      [-0.2, 0.0, 0.2].forEach(py => {
        const pull = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 16, Math.PI), brassMat);
        pull.position.set(px, 0.37 + py, 0.555);
        deskGroup.add(pull);
      });
    });

    // Carved Acanthus Scroll Corbels
    [[-1.18, 0.55], [1.18, 0.55], [-1.18, -0.55], [1.18, -0.55]].forEach(([cx, cz]) => {
      const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), woodMat);
      corbel.position.set(cx, 0.37, cz);
      deskGroup.add(corbel);
    });

    // Solid Beveled Mahogany Top Plate (2.4m x 1.2m x 0.08m at Y=0.82m)
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), woodMat);
    topPlate.position.set(0.0, 0.78, 0.0);
    topPlate.castShadow = true;
    topPlate.receiveShadow = true;
    deskGroup.add(topPlate);

    // Green Leather Insert Blotter with Gold-Tooled Trim
    const blotterGeo = new THREE.BoxGeometry(1.4, 0.01, 0.8);
    const blotterMat = new THREE.MeshStandardMaterial({
      color: 0x152e1c, // Bottle green leather
      roughness: 0.62,
      metalness: 0.04
    });
    const blotter = new THREE.Mesh(blotterGeo, blotterMat);
    blotter.position.set(0.0, 0.825, 0.0);
    deskGroup.add(blotter);

    this.group.add(deskGroup);
  }

  // 5. Brass Banker's Lamp with Emerald Glass Shade
  buildBankersLamp() {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.95, 0.82, -0.35);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.2
    });

    // Stepped Circular Brass Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.035, 32), brassMat);
    base.position.y = 0.0175;
    lampGroup.add(base);

    // Curved Brass Arm & Swivel Screws
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26), brassMat);
    stem.position.set(0.0, 0.15, 0.0);
    lampGroup.add(stem);

    const armCurve = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 8, 16, Math.PI / 1.6), brassMat);
    armCurve.rotation.z = -Math.PI / 4;
    armCurve.position.set(0.05, 0.26, 0.0);
    lampGroup.add(armCurve);

    // Emerald Green Cased-Glass Hood Shade
    const shadeGeo = new THREE.BoxGeometry(0.25, 0.09, 0.13);
    const shadeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f6333, // Emerald green
      transmission: 0.70,
      roughness: 0.12,
      clearcoat: 1.0,
      ior: 1.5,
      transparent: true
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0.12, 0.29, 0.0);
    lampGroup.add(shade);

    // Pull Chain with Brass Acorn Bead
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16), brassMat);
    chain.position.set(0.18, 0.18, 0.05);
    lampGroup.add(chain);

    this.group.add(lampGroup);
  }

  // 6. Tufted Leather Wingback Armchair
  buildWingbackArmchair() {
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0.0, 0.0, 0.95);
    chairGroup.rotation.y = Math.PI;

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x4a1217, // Distressed oxblood red
      roughness: 0.58,
      metalness: 0.08
    });
    const woodLegMat = new THREE.MeshStandardMaterial({ color: 0x1f0b04, roughness: 0.4 });

    // Seat Cushion
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.68), leatherMat);
    cushion.position.y = 0.45;
    cushion.castShadow = true;
    chairGroup.add(cushion);

    // Diamond Tufted Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.85, 0.18), leatherMat);
    back.position.set(0.0, 0.92, -0.28);
    back.rotation.x = -0.1;
    chairGroup.add(back);

    // Flared Side Wings
    [-0.38, 0.38].forEach(wx => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.35), leatherMat);
      wing.position.set(wx, 1.0, -0.15);
      wing.rotation.y = wx > 0 ? -0.2 : 0.2;
      chairGroup.add(wing);
    });

    // Rolled Scroll Arms
    [-0.42, 0.42].forEach(ax => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.62, 16), leatherMat);
      arm.rotation.x = Math.PI / 2;
      arm.position.set(ax, 0.62, 0.0);
      chairGroup.add(arm);
    });

    // 4 Turned Cabriole Wood Legs
    [[-0.32, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.32, 0.26]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.36, 12), woodLegMat);
      leg.position.set(lx, 0.18, lz);
      chairGroup.add(leg);
    });

    this.group.add(chairGroup);
  }

  // 7. Floor-to-Ceiling Bookshelves with 400+ Books (East Wall X = 4.15m)
  buildFloorToCeilingBookshelves() {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(4.15, 0.0, 0.0);
    shelfGroup.rotation.y = -Math.PI / 2;

    const oakMat = new THREE.MeshStandardMaterial({ color: 0x221008, roughness: 0.45 });

    // 3 Bays Bookcase Structure (Width 7.6m, Depth 0.45m, Height 4.2m)
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.2, 0.08), oakMat);
    backPanel.position.set(0.0, 2.1, -0.2);
    shelfGroup.add(backPanel);

    // Upright Vertical Fluted Dividers
    [-3.8, -1.27, 1.27, 3.8].forEach(px => {
      const divider = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.2, 0.48), oakMat);
      divider.position.set(px, 2.1, 0.0);
      shelfGroup.add(divider);
    });

    // 5 Shelf Tiers across all bays
    const bookColors = [0x5a1b22, 0x18283d, 0x1b3624, 0x694b1f, 0x242220, 0x822424];
    for (let tier = 0; tier < 5; tier++) {
      const sy = 0.5 + (tier * 0.8);
      const shelfPlank = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.06, 0.44), oakMat);
      shelfPlank.position.set(0.0, sy, 0.0);
      shelfGroup.add(shelfPlank);

      // Populate shelf with procedural books
      for (let bx = -3.6; bx < 3.6; bx += 0.085) {
        if (Math.random() > 0.12) {
          const bHeight = 0.32 + Math.sin(bx * 7) * 0.06;
          const bDepth = 0.24 + Math.cos(bx * 3) * 0.03;
          const bWidth = 0.055 + Math.random() * 0.02;
          const col = bookColors[Math.floor(Math.random() * bookColors.length)];

          const bookGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
          const bookMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
          const book = new THREE.Mesh(bookGeo, bookMat);
          book.position.set(bx, sy + (bHeight / 2) + 0.03, -0.05);

          // Occasional tilted book
          if (Math.random() > 0.88) {
            book.rotation.z = (Math.random() - 0.5) * 0.25;
          }
          shelfGroup.add(book);
        }
      }
    }

    this.group.add(shelfGroup);
  }

  // 8. Antique Grandfather Clock with Animated Pendulum (NE Corner)
  buildGrandfatherClock() {
    const clockGroup = new THREE.Group();
    clockGroup.position.set(3.6, 0.0, -4.6);
    clockGroup.rotation.y = -Math.PI / 4;

    const mahogMat = new THREE.MeshStandardMaterial({ color: 0x2c0f06, roughness: 0.38 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.22 });

    // Plinth Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.4), mahogMat);
    base.position.y = 0.275;
    clockGroup.add(base);

    // Waist Trunk with Glass Door
    const waist = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.25, 0.34), mahogMat);
    waist.position.y = 1.175;
    clockGroup.add(waist);

    const waistGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.95),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1, transparent: true })
    );
    waistGlass.position.set(0.0, 1.175, 0.175);
    clockGroup.add(waistGlass);

    // Twin Brass Weights inside waist
    [-0.08, 0.08].forEach(wx => {
      const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.28, 16), brassMat);
      weight.position.set(wx, 1.3, 0.05);
      clockGroup.add(weight);
    });

    // Animated Brass Pendulum (Pivot at Y = 1.6m)
    const pendPivot = new THREE.Group();
    pendPivot.position.set(0.0, 1.6, 0.05);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.72), brassMat);
    rod.position.y = -0.36;
    const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), brassMat);
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -0.68;

    pendPivot.add(rod);
    pendPivot.add(bob);
    this.pendulumArm = pendPivot;
    clockGroup.add(pendPivot);

    // Arched Bonnet Hood
    const bonnet = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.42), mahogMat);
    bonnet.position.y = 2.1;
    clockGroup.add(bonnet);

    // Brass Eagle Finial at top peak
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), brassMat);
    finial.position.set(0.0, 2.46, 0.0);
    clockGroup.add(finial);

    // Circular Brass Dial Face
    const dialFace = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 32), brassMat);
    dialFace.rotation.x = Math.PI / 2;
    dialFace.position.set(0.0, 2.05, 0.215);
    clockGroup.add(dialFace);

    // Filigree Blued Steel Hands
    const handMat = new THREE.MeshBasicMaterial({ color: 0x111c2e });
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.09, 0.005), handMat);
    hourHand.position.set(0.0, 2.08, 0.23);
    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.14, 0.005), handMat);
    minuteHand.position.set(0.04, 2.05, 0.232);
    minuteHand.rotation.z = -Math.PI / 3;
    clockGroup.add(hourHand);
    clockGroup.add(minuteHand);

    clockGroup.userData = { isHotspot: true, targetView: 'INSPECT_CLOCK', label: 'GRANDFATHER CLOCK' };
    clockGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_CLOCK'; });
    this.clockGroup = clockGroup;
    this.group.add(clockGroup);
  }

  // 9. Glowing Stone Fireplace (West Wall X = -4.4m)
  buildStoneFireplace() {
    const fireGroup = new THREE.Group();
    fireGroup.position.set(-4.4, 0.0, 0.0);
    fireGroup.rotation.y = Math.PI / 2;

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x48423d, roughness: 0.92 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x2d1d16, roughness: 0.95 });

    // Limestone Mantel & Columns
    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.5, 0.45), stoneMat);
    leftCol.position.set(-1.0, 0.75, 0.0);
    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.5, 0.45), stoneMat);
    rightCol.position.set(1.0, 0.75, 0.0);
    const mantel = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 0.55), stoneMat);
    mantel.position.set(0.0, 1.55, 0.05);

    fireGroup.add(leftCol);
    fireGroup.add(rightCol);
    fireGroup.add(mantel);

    // Firebrick Firebox Interior (Recessed)
    const firebox = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.35, 0.7), brickMat);
    firebox.position.set(0.0, 0.68, -0.2);
    fireGroup.add(firebox);

    // Cast-Iron Log Andiron Grate
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.85 });
    const grate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.4), grateMat);
    grate.position.set(0.0, 0.12, -0.15);
    fireGroup.add(grate);

    // Charred Oak Split Logs
    const logMat = new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.75, 12), logMat);
      log.rotation.z = Math.PI / 2 + (i * 0.15);
      log.position.set(0.0, 0.22 + (i * 0.08), -0.15 + ((i % 2) * 0.06));
      fireGroup.add(log);
    }

    // Glowing Core Embers Mesh
    const emberGeo = new THREE.BoxGeometry(0.75, 0.1, 0.3);
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff2200,
      emissiveIntensity: 2.2
    });
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.set(0.0, 0.16, -0.15);
    fireGroup.add(ember);

    // Rising Flame Sparks Particle System
    const particleCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      pPos[p * 3] = (Math.random() - 0.5) * 0.6;
      pPos[p * 3 + 1] = 0.2 + Math.random() * 0.7;
      pPos[p * 3 + 2] = -0.15 + (Math.random() - 0.5) * 0.25;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffaa33,
      size: 0.045,
      transparent: true,
      opacity: 0.85
    });
    this.fireParticles = new THREE.Points(pGeo, pMat);
    fireGroup.add(this.fireParticles);

    fireGroup.userData = { isHotspot: true, targetView: 'INSPECT_FIREPLACE', label: 'STONE FIREPLACE' };
    fireGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_FIREPLACE'; });
    this.fireGroup = fireGroup;
    this.group.add(fireGroup);
  }

  // 10. Ornate Brass Puzzle Box (Desk Center Right)
  buildOrnatePuzzleBox() {
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0.25, 0.85, -0.2);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25
    });
    const rosewoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d1512,
      roughness: 0.4
    });

    // Octagonal / Cubic Inlaid Body
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.26), rosewoodMat);
    core.position.y = 0.09;
    core.castShadow = true;
    boxGroup.add(core);

    // Brass Filigree Corner Edge Brackets
    [[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(([cx, cz]) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.185, 0.025), brassMat);
      bracket.position.set(cx, 0.09, cz);
      boxGroup.add(bracket);
    });

    // Concentric Rotating Brass Glyphic Ring on Top Lid
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.01, 8, 24), brassMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.182;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 8, 24), brassMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.183;

    // Center Ruby Gem Lock
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.022),
      new THREE.MeshPhysicalMaterial({ color: 0xcc1133, transmission: 0.6, roughness: 0.1 })
    );
    gem.position.y = 0.19;

    boxGroup.add(ring1);
    boxGroup.add(ring2);
    boxGroup.add(gem);

    boxGroup.userData = { isHotspot: true, targetView: 'INSPECT_PUZZLE_BOX', label: 'ORNATE BRASS PUZZLE BOX' };
    boxGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_PUZZLE_BOX'; });
    this.boxGroup = boxGroup;
    this.group.add(boxGroup);
  }

  // 11. Celestial Astrolabe / Armillary Globe (Desk Left Wing)
  buildAstrolabeGlobe() {
    const astroGroup = new THREE.Group();
    astroGroup.position.set(-1.1, 0.86, -0.2);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xcca033,
      metalness: 0.92,
      roughness: 0.2
    });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x221008, roughness: 0.4 });

    // Turned Mahogany Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.14, 24), woodMat);
    stand.position.y = 0.07;
    astroGroup.add(stand);

    // Brass Horizon Ring Support
    const horizRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 32), brassMat);
    horizRing.rotation.x = Math.PI / 2;
    horizRing.position.y = 0.26;
    astroGroup.add(horizRing);

    // 3 Concentric Gimbal Rings
    this.astrolabeRings = [];
    [0.17, 0.14, 0.11].forEach((rad, idx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.008, 8, 32), brassMat);
      ring.position.y = 0.26;
      ring.rotation.x = (idx * Math.PI) / 3;
      ring.rotation.y = (idx * Math.PI) / 4;
      astroGroup.add(ring);
      this.astrolabeRings.push(ring);
    });

    // Center Celestial Earth/Moon Sphere
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x3d7b99, roughness: 0.3, metalness: 0.4 })
    );
    centerSphere.position.y = 0.26;
    astroGroup.add(centerSphere);

    astroGroup.userData = { isHotspot: true, targetView: 'INSPECT_ASTROLABE', label: 'CELESTIAL ASTROLABE' };
    astroGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_ASTROLABE'; });
    this.astroGroup = astroGroup;
    this.group.add(astroGroup);
  }

  // 12. Ancient Grimoire on Carved Oak Lectern Stand (West Alcove)
  buildGrimoireLectern() {
    const lecternGroup = new THREE.Group();
    lecternGroup.position.set(-2.8, 0.0, -2.4);
    lecternGroup.rotation.y = Math.PI / 3;

    const oakMat = new THREE.MeshStandardMaterial({ color: 0x281208, roughness: 0.4 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.88 });

    // Turned Tripod Lectern Post & Base
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.05, 16), oakMat);
    post.position.y = 0.525;
    lecternGroup.add(post);

    // Slanted Reading Shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.48), oakMat);
    shelf.position.set(0.0, 1.1, 0.0);
    shelf.rotation.x = 0.42; // Slanted towards player
    lecternGroup.add(shelf);

    // Leather-Bound Grimoire Book Open Flat
    const grimoireGroup = new THREE.Group();
    grimoireGroup.position.set(0.0, 1.13, 0.0);
    grimoireGroup.rotation.x = 0.42;

    // Dark Leather Binding Cover
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.02, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x301217, roughness: 0.7 })
    );
    grimoireGroup.add(cover);

    // Aged Parchment Pages Left & Right
    const parchMat = new THREE.MeshStandardMaterial({ color: 0xe8dcbe, roughness: 0.85 });
    const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.34), parchMat);
    leftPage.position.set(-0.13, 0.02, 0.0);
    const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.34), parchMat);
    rightPage.position.set(0.13, 0.02, 0.0);
    grimoireGroup.add(leftPage);
    grimoireGroup.add(rightPage);

    // Hermetic Wax Seal Ribbon bookmark
    const seal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16),
      new THREE.MeshStandardMaterial({ color: 0xaa2211, roughness: 0.3 })
    );
    seal.rotation.x = -Math.PI / 2;
    seal.position.set(0.13, 0.029, 0.0);
    grimoireGroup.add(seal);

    lecternGroup.add(grimoireGroup);

    lecternGroup.userData = { isHotspot: true, targetView: 'INSPECT_GRIMOIRE', label: 'ALCHEMICAL GRIMOIRE' };
    lecternGroup.traverse(c => { if (c.isMesh) c.userData.targetView = 'INSPECT_GRIMOIRE'; });
    this.lecternGroup = lecternGroup;
    this.group.add(lecternGroup);
  }

  // 13. Dynamic Victorian Lighting Setup
  setupLighting() {
    // 1. Primary Fireplace PointLight (Warm Amber)
    this.fireLight = new THREE.PointLight(0xff6818, 2.6, 9.5, 1.8);
    this.fireLight.position.set(-3.9, 0.55, 0.0);
    this.fireLight.castShadow = true;
    this.fireLight.shadow.mapSize.width = 1024;
    this.fireLight.shadow.mapSize.height = 1024;
    this.fireLight.shadow.bias = -0.0003;
    this.group.add(this.fireLight);

    // Secondary Fireplace Light for broader warm bounce
    this.fireLightSecondary = new THREE.PointLight(0xff9922, 1.2, 6.0);
    this.fireLightSecondary.position.set(-3.5, 0.8, 0.0);
    this.group.add(this.fireLightSecondary);

    // 2. Green Banker's Desk Lamp Spot
    this.bankerSpot = new THREE.SpotLight(0xffeedd, 3.8, 6.0, Math.PI / 4, 0.45);
    this.bankerSpot.position.set(0.65, 1.35, -0.15);
    this.bankerSpot.target.position.set(0.0, 0.85, -0.2);
    this.bankerSpot.castShadow = true;
    this.group.add(this.bankerSpot);
    this.group.add(this.bankerSpot.target);

    // 3. Lightning Flash Directional Window Light
    this.lightningLight = new THREE.DirectionalLight(0xb0d0ff, 0.0);
    this.lightningLight.position.set(0.0, 4.0, -5.5);
    this.lightningLight.target.position.set(0.0, 1.0, 0.0);
    this.group.add(this.lightningLight);
    this.group.add(this.lightningLight.target);

    // 4. Candlelit Room Ambient Warmth
    const ambient = new THREE.AmbientLight(0x28160e, 0.40);
    this.group.add(ambient);
  }

  // 14. Interactive Hotspots Registration
  registerHotspots() {
    this.hotspots = [];

    const createOccultRing = (viewKey, pos, label) => {
      const ringGeo = new THREE.RingGeometry(0.32, 0.38, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37, // Polished Alchemical Gold
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
        label: label
      };

      // Solid hit disc filling center so clicks anywhere inside circle hit
      const discGeo = new THREE.CircleGeometry(0.46, 24);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
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

    // Hotspot 1: Ornate Brass Puzzle Box
    createOccultRing('INSPECT_PUZZLE_BOX', new THREE.Vector3(0.25, 0.855, -0.2), 'INSPECT BRASS PUZZLE BOX');

    // Hotspot 2: Celestial Astrolabe Globe
    createOccultRing('INSPECT_ASTROLABE', new THREE.Vector3(-1.1, 0.865, -0.2), 'INSPECT CELESTIAL ASTROLABE');

    // Hotspot 3: Alchemical Grimoire on Lectern
    const hGrimoire = createOccultRing('INSPECT_GRIMOIRE', new THREE.Vector3(-2.8, 1.22, -2.4), 'INSPECT ANCIENT GRIMOIRE');
    hGrimoire.rotation.set(0.42, 0, 0);

    // Hotspot 4: Grandfather Clock Dial
    const hClock = createOccultRing('INSPECT_CLOCK', new THREE.Vector3(3.52, 2.05, -4.52), 'INSPECT CLOCKWORK DIAL');
    hClock.rotation.set(0, -Math.PI / 4, 0);
  }

  // Animation Frame Loop
  update(time, delta) {
    // 1. Natural Fireplace Multi-Frequency Flicker
    if (this.fireLight) {
      const n1 = Math.sin(time * 5.2) * 0.14;
      const n2 = Math.sin(time * 11.7) * 0.09;
      const n3 = Math.sin(time * 23.4) * 0.05;
      const flicker = 1.0 + n1 + n2 + n3;
      this.fireLight.intensity = 2.6 * flicker;
      if (this.fireLightSecondary) this.fireLightSecondary.intensity = 1.2 * flicker;
    }

    // 2. Harmonic Pendulum Swing
    if (this.pendulumArm) {
      // 0.85 Hz frequency = ~1 second tick-tock period
      const angle = Math.cos(time * Math.PI * 1.7) * 0.22;
      this.pendulumArm.rotation.z = angle;
    }

    // 3. Astrolabe Rings Gentle Rotation
    if (this.astrolabeRings.length > 0) {
      this.astrolabeRings[0].rotation.z = time * 0.2;
      this.astrolabeRings[1].rotation.x = time * 0.15;
      this.astrolabeRings[2].rotation.y = time * 0.25;
    }

    // 4. Fire Particles Rise
    if (this.fireParticles) {
      const pos = this.fireParticles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 0.35;
        if (pos[i] > 1.1) pos[i] = 0.2;
      }
      this.fireParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Stochastic Window Lightning Flash Generator
    this.lightningTimer += delta;
    if (this.lightningTimer >= this.nextLightningTime) {
      // Trigger double-pulse flash
      const flashProgress = this.lightningTimer - this.nextLightningTime;
      if (flashProgress < 0.06) {
        this.lightningLight.intensity = 4.2;
      } else if (flashProgress < 0.14) {
        this.lightningLight.intensity = 0.5;
      } else if (flashProgress < 0.22) {
        this.lightningLight.intensity = 3.6;
      } else {
        this.lightningLight.intensity = 0.0;
        this.lightningTimer = 0;
        this.nextLightningTime = 8.0 + Math.random() * 14.0;
      }
    }

    // 6. Pulse Hotspot Rings
    const pulse = 1.0 + Math.sin(time * 4.5) * 0.1;
    this.hotspots.forEach(ring => {
      ring.scale.set(pulse, pulse, 1.0);
    });
  }

  destroy() {
    this.scene.remove(this.group);
  }
}
