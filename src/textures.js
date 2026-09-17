/* ==========================================================================
   OPERATION: ZERO HOUR - PROCEDURAL TEXTURE GENERATOR
   Creates photorealistic canvas-based textures in pure client-side JS.
   ========================================================================== */

class TextureGenerator {
  // 1. Heavy Military Pelican Casing Texture
  createPelicanTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark ballistic polymer base
    ctx.fillStyle = '#14181f';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle noise & scratches
    for (let i = 0; i < 40000; i++) {
      const val = Math.random() * 25;
      ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.15)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
    }

    // Molded reinforcement ribs
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    for (let y = 60; y < 512; y += 90) {
      ctx.fillRect(40, y, 432, 18);
    }

    return new THREE.CanvasTexture(canvas);
  }

  // 2. Yellow & Black Hazard Caution Stripes
  createHazardTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffb700';
    ctx.fillRect(0, 0, 256, 64);

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    for (let x = -64; x < 320; x += 32) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 16, 0);
      ctx.lineTo(x - 8, 64);
      ctx.lineTo(x - 24, 64);
      ctx.closePath();
    }
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // 3. Stamped Aluminum Serial Number Badge
  createSerialPlateTexture(serialNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Brushed metal plate
    const grad = ctx.createLinearGradient(0, 0, 256, 128);
    grad.addColorStop(0, '#8a9ba8');
    grad.addColorStop(0.5, '#c5d5e2');
    grad.addColorStop(1, '#7a8b98');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);

    // Corner rivets
    ctx.fillStyle = '#333';
    [[12, 12], [244, 12], [12, 116], [244, 116]].forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stamped Text
    ctx.fillStyle = '#111822';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('ORDNANCE DEPT - SPEC 9', 32, 34);

    ctx.font = 'bold 10px monospace';
    ctx.fillText('SERIAL NUMBER:', 32, 58);

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#0a1018';
    ctx.fillText(serialNumber, 32, 90);

    return new THREE.CanvasTexture(canvas);
  }

  // 4. Aged Classified Document Parchment
  createParchmentTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // Aged yellowed paper
    ctx.fillStyle = '#e8dcc4';
    ctx.fillRect(0, 0, 512, 700);

    // Coffee stain ring
    ctx.strokeStyle = 'rgba(110, 80, 50, 0.12)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(380, 520, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Red "TOP SECRET" stamp
    ctx.save();
    ctx.translate(256, 70);
    ctx.rotate(-0.06);
    ctx.strokeStyle = '#c92a2a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-120, -25, 240, 50);
    ctx.fillStyle = '#c92a2a';
    ctx.font = 'bold 22px Courier';
    ctx.textAlign = 'center';
    ctx.fillText('CONFIDENTIAL // TOP SECRET', 0, 8);
    ctx.restore();

    return canvas.toDataURL();
  }
}

const textureGen = new TextureGenerator();
