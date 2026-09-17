const { spawn } = require('child_process');
const path = require('path');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function inspectBombViewport() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '..', '.chrome-inspect-test');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch('http://localhost:9226/json/list');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    // Set mobile device metrics: iPhone 13/14 (390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });

    await send('Page.navigate', { url: 'http://localhost:8000' });
    await sleep(2000);

    // Host starts room and selects defuser
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('room-input').value = 'TEST';
        document.getElementById('btn-create-room').click();
        game.toggleRole('defuser');
        document.getElementById('btn-start-game').click();
      `
    });
    await sleep(1500);

    // Click bomb to inspect using standard in-game setView!
    await send('Runtime.evaluate', {
      expression: `
        bomb3D.setView('INSPECT_BOMB');
      `
    });
    // Wait for camera lerp
    await sleep(1200);

    // Test across multiple device viewports:
    const testViewports = [
      { name: 'iPhone (390x844)', width: 390, height: 844, mobile: true },
      { name: 'iPad Portrait (768x1024)', width: 768, height: 1024, mobile: true },
      { name: 'Desktop (1280x720)', width: 1280, height: 720, mobile: false }
    ];

    for (const vp of testViewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });

      // Resize window in game
      await send('Runtime.evaluate', {
        expression: `
          window.dispatchEvent(new Event('resize'));
          bomb3D.onWindowResize();
          bomb3D.setView('INSPECT_BOMB');
        `
      });
      await sleep(800);

      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const cam = bomb3D.camera;
            const projectPos = (x, y, z) => {
              const v = new THREE.Vector3(x, y, z);
              v.project(cam);
              return {
                ndcX: parseFloat(v.x.toFixed(2)),
                ndcY: parseFloat(v.y.toFixed(2)),
                visibleOnScreen: (v.x >= -0.95 && v.x <= 0.95 && v.y >= -0.95 && v.y <= 0.95)
              };
            };

            return {
              cameraFov: cam.fov,
              cameraPos: { x: parseFloat(cam.position.x.toFixed(2)), y: parseFloat(cam.position.y.toFixed(2)), z: parseFloat(cam.position.z.toFixed(2)) },
              aspect: parseFloat(cam.aspect.toFixed(3)),
              module1_Wires: projectPos(-1.8, 1.42, 1.1),
              module2_Keypad: projectPos(1.8, 1.42, 1.1),
              module3_RF: projectPos(-1.8, 1.42, -1.1),
              module4_Simon: projectPos(1.8, 1.42, -1.1)
            };
          })()
        `,
        returnByValue: true
      });

      const data = res.result?.result?.value || res.result?.value;
      console.log(`\n=== Viewport: ${vp.name} ===`);
      console.log(JSON.stringify(data, null, 2));

      const allVisible = data.module1_Wires.visibleOnScreen &&
        data.module2_Keypad.visibleOnScreen &&
        data.module3_RF.visibleOnScreen &&
        data.module4_Simon.visibleOnScreen;

      if (!allVisible) {
        console.error(`FAIL for ${vp.name}: One or more modules cut off!`);
        process.exit(1);
      } else {
        console.log(`PASS: All 4 modules visible and well-framed for ${vp.name}!`);
      }
    }

    // Verify mobile interactivity: Click on wire and click step back
    console.log('\n--- Testing Mobile Interactivity & Navigation ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `
        bomb3D.onWindowResize();
        bomb3D.setView('INSPECT_BOMB');
      `
    });
    await sleep(800);

    // Get screen pixel coordinates of wire 0
    const clickCoordsRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const wire = bomb3D.clickableWires[0];
          if (!wire) return null;
          // Wire mid-point in local space converted to world space
          const pos = new THREE.Vector3().addVectors(wire.userData.start, wire.userData.end).multiplyScalar(0.5);
          pos.y += 0.15; // arch of catenary
          wire.localToWorld(pos);
          pos.project(bomb3D.camera);
          const canvas = bomb3D.renderer.domElement;
          const rect = canvas.getBoundingClientRect();
          const screenX = rect.left + (pos.x * 0.5 + 0.5) * rect.width;
          const screenY = rect.top + (-pos.y * 0.5 + 0.5) * rect.height;
          return { screenX, screenY, wasCut: !!wire.userData.isCut };
        })()
      `,
      returnByValue: true
    });

    const coords = clickCoordsRes.result?.result?.value || clickCoordsRes.result?.value;
    console.log('Wire 0 screen target coordinates:', coords);

    // Test raycasting and onPointerClick directly
    const testRaycastRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const wire = bomb3D.clickableWires[0];
          // Pick an actual surface vertex of the tube mesh
          const posAttr = wire.geometry.attributes.position;
          const vertex = new THREE.Vector3(posAttr.getX(20), posAttr.getY(20), posAttr.getZ(20));
          wire.localToWorld(vertex);
          const projected = vertex.clone().project(bomb3D.camera);

          const canvas = bomb3D.renderer.domElement;
          const rect = canvas.getBoundingClientRect();
          const clientX = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
          const clientY = rect.top + (-projected.y * 0.5 + 0.5) * rect.height;

          // Test raycast
          const ray = new THREE.Raycaster();
          ray.setFromCamera(new THREE.Vector2(projected.x, projected.y), bomb3D.camera);
          const hits = ray.intersectObjects(bomb3D.clickableWires);

          // Now call onPointerClick with these client coords
          bomb3D.onPointerClick({ clientX, clientY });

          return {
            vertex: { x: vertex.x, y: vertex.y, z: vertex.z },
            projected: { x: projected.x, y: projected.y },
            clientX,
            clientY,
            hitCount: hits.length,
            hitWireIndex: hits[0]?.object?.userData?.wireIndex,
            isCut: !!bomb3D.clickableWires[0].userData.cut
          };
        })()
      `,
      returnByValue: true
    });

    if (testRaycastRes.result?.exceptionDetails) {
      console.error('Exception in testRaycast:', testRaycastRes.result.exceptionDetails);
    }
    const diag = testRaycastRes.result?.result?.value || testRaycastRes.result?.value;
    console.log('Raycast & Click Diagnostic:', diag);

    if (!diag.isCut) {
      console.error('FAIL: Wire was not cut!');
      process.exit(1);
    }
    console.log('PASS: Wire 3D mesh successfully clicked and cut via screen touch coordinates!');

    // Test Step-Back button
    await send('Runtime.evaluate', {
      expression: `document.getElementById('btn-step-back').click();`
    });
    await sleep(600);

    const viewRes = await send('Runtime.evaluate', {
      expression: `bomb3D.currentView`,
      returnByValue: true
    });
    const currentView = viewRes.result?.result?.value || viewRes.result?.value;
    console.log('Current view after clicking STEP BACK:', currentView);

    if (currentView !== 'OVERVIEW') {
      console.error('FAIL: Step-Back did not return to OVERVIEW!');
      process.exit(1);
    }
    console.log('PASS: Mobile navigation and interaction verified successfully!');

    chromeProc.kill();
    ws.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    process.exit(1);
  }
}

inspectBombViewport();
