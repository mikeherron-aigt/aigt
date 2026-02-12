import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export type VrMuseumSceneHandle = {
  dispose: () => void;
  focusArtwork: (artworkId: string) => void;
  clearFocus: () => void;
};

type CreateArgs = {
  container: HTMLDivElement;
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

/**
 * VR Museum Scene (Jeff baseline upgraded)
 *
 * What this version focuses on:
 * - Stark white museum walls
 * - Light wood floor with realistic staggered plank joints
 * - Large modern window wall with Hamptons backdrop and daylight direction
 * - Keep existing interaction: click artwork triggers focus + onArtworkClick callback
 *
 * Zoom modal work is handled outside this file. This only controls the camera focus.
 */
export function createVrMuseumScene({ container, artworks, onArtworkClick }: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  function normalizeImageUrl(url: string) {
    if (!url) return url;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  }

  // ---------------------------
  // Procedural textures
  // ---------------------------
  function mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  function mix(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function makeWoodFloorTexture(opts?: {
    size?: number;
    plankWidthPx?: number;
    minPlankLenPx?: number;
    maxPlankLenPx?: number;
    minJointOffsetPx?: number;
    seed?: number;
    baseHue?: number; // 0..360
    baseSat?: number; // 0..1
    baseLight?: number; // 0..1
  }) {
    const size = opts?.size ?? 2048;
    const plankW = opts?.plankWidthPx ?? 150; // about 6 to 8 inch vibe
    const minLen = opts?.minPlankLenPx ?? 520;
    const maxLen = opts?.maxPlankLenPx ?? 980;
    const minOffset = opts?.minJointOffsetPx ?? 90; // 6 to 10 inch offset rule
    const seed = opts?.seed ?? 1337;

    const baseHue = opts?.baseHue ?? 34; // warm oak
    const baseSat = opts?.baseSat ?? 0.45;
    const baseLight = opts?.baseLight ?? 0.52;

    const rand = mulberry32(seed);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const fallback = new THREE.DataTexture(new Uint8Array([200, 170, 120, 255]), 1, 1);
      fallback.colorSpace = THREE.SRGBColorSpace;
      fallback.needsUpdate = true;
      return fallback;
    }

    // Background
    ctx.fillStyle = `hsl(${baseHue}, ${Math.round(baseSat * 100)}%, ${Math.round(baseLight * 100)}%)`;
    ctx.fillRect(0, 0, size, size);

    // Subtle lighting gradient across the floor (helps realism)
    {
      const g = ctx.createLinearGradient(0, 0, size, size);
      g.addColorStop(0, 'rgba(255,255,255,0.10)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.02)');
      g.addColorStop(1, 'rgba(0,0,0,0.06)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }

    // How many rows
    const rows = Math.ceil(size / plankW);

    // Track joints to enforce min offset between rows
    // Store last row joint x positions for checks
    let prevRowJoints: number[] = [];

    // Draw each row
    for (let r = 0; r < rows; r++) {
      const y0 = r * plankW;
      const y1 = Math.min(size, y0 + plankW);

      // Wood tone variation per row
      const rowToneJitter = (rand() - 0.5) * 0.06;

      // Build segments in this row with randomized lengths
      let x = 0;

      // Stagger starting offset so joints do not align
      // Try to pick a start offset that is not close to previous row's first joint
      let startOffset = Math.floor(rand() * (plankW * 1.2));
      if (prevRowJoints.length) {
        const tooClose = prevRowJoints.some((j) => Math.abs(j - startOffset) < minOffset);
        if (tooClose) startOffset = Math.floor((startOffset + plankW * 0.6) % plankW);
      }
      x -= startOffset;

      const joints: number[] = [];

      while (x < size) {
        const len = Math.floor(mix(minLen, maxLen, rand()));
        const segX0 = x;
        const segX1 = x + len;

        // record joint line (end of plank) when inside canvas
        if (segX1 > 0 && segX1 < size) joints.push(segX1);

        // Plank fill
        const hueJitter = (rand() - 0.5) * 6;
        const satJitter = (rand() - 0.5) * 0.10;
        const lightJitter = (rand() - 0.5) * 0.10;

        const h = baseHue + hueJitter;
        const s = clamp01(baseSat + satJitter);
        const l = clamp01(baseLight + rowToneJitter + lightJitter);

        ctx.fillStyle = `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        ctx.fillRect(Math.max(0, segX0), y0, Math.min(size, segX1) - Math.max(0, segX0), y1 - y0);

        // Grain direction: along the long side of the board (x direction)
        // Add fine grain lines with low alpha
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = 'rgba(60,40,20,0.30)';
        ctx.lineWidth = 1;

        const grainCount = 14 + Math.floor(rand() * 18);
        for (let g = 0; g < grainCount; g++) {
          const gy = mix(y0 + 3, y1 - 3, rand());
          const gx0 = Math.max(0, segX0) + rand() * 40;
          const gx1 = Math.min(size, segX1) - rand() * 40;

          ctx.beginPath();
          ctx.moveTo(gx0, gy);
          ctx.bezierCurveTo(
            mix(gx0, gx1, 0.33),
            gy + (rand() - 0.5) * 6,
            mix(gx0, gx1, 0.66),
            gy + (rand() - 0.5) * 6,
            gx1,
            gy
          );
          ctx.stroke();
        }
        ctx.restore();

        // Occasional knots
        if (rand() < 0.18) {
          const kx = mix(Math.max(0, segX0) + 50, Math.min(size, segX1) - 50, rand());
          const ky = mix(y0 + 8, y1 - 8, rand());
          const kr = mix(6, 20, rand());

          ctx.save();
          ctx.globalAlpha = 0.18;
          const knot = ctx.createRadialGradient(kx, ky, 1, kx, ky, kr);
          knot.addColorStop(0, 'rgba(30,20,10,0.55)');
          knot.addColorStop(1, 'rgba(30,20,10,0)');
          ctx.fillStyle = knot;
          ctx.beginPath();
          ctx.ellipse(kx, ky, kr * 1.2, kr * 0.9, rand() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        x += len;
      }

      // Draw seams between planks and rows
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = 'rgba(40,25,15,0.30)';
      ctx.lineWidth = 2;

      // Horizontal seam line at bottom of row
      ctx.beginPath();
      ctx.moveTo(0, y1);
      ctx.lineTo(size, y1);
      ctx.stroke();

      // Vertical seams at joints
      for (const j of joints) {
        // Respect staggering: avoid obvious alignment with previous row joints
        // If too close, soften the seam (still allow, but reduced visibility)
        let alpha = 0.35;
        if (prevRowJoints.some((p) => Math.abs(p - j) < minOffset)) alpha = 0.12;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(j, y0);
        ctx.lineTo(j, y1);
        ctx.stroke();
      }
      ctx.restore();

      prevRowJoints = joints;
    }

    // Subtle finish sheen (very mild)
    ctx.save();
    ctx.globalAlpha = 0.06;
    const sheen = ctx.createLinearGradient(0, 0, size, 0);
    sheen.addColorStop(0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,1)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.6, 1.6);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }

  function makeHamptonsBackdropTexture(size = 1536) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const fallback = new THREE.DataTexture(new Uint8Array([135, 206, 235, 255]), 1, 1);
      fallback.colorSpace = THREE.SRGBColorSpace;
      fallback.needsUpdate = true;
      return fallback;
    }

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, size);
    skyGrad.addColorStop(0.0, '#9fd3ff');
    skyGrad.addColorStop(0.35, '#cfe9ff');
    skyGrad.addColorStop(0.55, '#eaf6ff');
    skyGrad.addColorStop(1.0, '#f7fbff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, size, size);

    // Soft clouds
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 22; i++) {
      const x = Math.random() * size;
      const y = Math.random() * (size * 0.45);
      const w = 220 + Math.random() * 460;
      const h = 60 + Math.random() * 160;

      const g = ctx.createRadialGradient(x, y, 10, x, y, w);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Horizon line
    const horizonY = Math.floor(size * 0.58);

    // Sea
    const seaGrad = ctx.createLinearGradient(0, horizonY, 0, size);
    seaGrad.addColorStop(0.0, '#7bb9d8');
    seaGrad.addColorStop(0.55, '#5a9bbf');
    seaGrad.addColorStop(1.0, '#3f7897');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, horizonY, size, size - horizonY);

    // Gentle sea shimmer
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = '#ffffff';
    for (let i = 0; i < 180; i++) {
      const y = horizonY + Math.random() * (size * 0.38);
      const x0 = Math.random() * size;
      const x1 = x0 + 30 + Math.random() * 140;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Land band
    const landH = Math.floor(size * 0.10);
    const landY = horizonY - landH;

    const landGrad = ctx.createLinearGradient(0, landY, 0, horizonY);
    landGrad.addColorStop(0, '#6a8a61');
    landGrad.addColorStop(1, '#b6b08f');
    ctx.fillStyle = landGrad;
    ctx.fillRect(0, landY, size, landH);

    // Trees / bushes
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#2f4b2f';
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * size;
      const y = landY + Math.random() * (landH * 0.65);
      const r = 10 + Math.random() * 40;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.7, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Haze near horizon
    ctx.globalAlpha = 0.20;
    const hazeGrad = ctx.createLinearGradient(0, landY - 40, 0, horizonY + 40);
    hazeGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
    hazeGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, landY - 80, size, 200);
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }

  // ---------------------------
  // Renderer
  // ---------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Cross-version: typings may not include this
  (renderer as any).physicallyCorrectLights = true;
  if ('useLegacyLights' in renderer) (renderer as any).useLegacyLights = false;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // ---------------------------
  // Scene + Camera
  // ---------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0b0b);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 160);
  camera.position.set(0, 1.55, 6.6);

  // ---------------------------
  // Room geometry/materials
  // ---------------------------
  const room = new THREE.Group();
  scene.add(room);

  // Stark white walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.98,
    metalness: 0.0,
  });

  // Wood floor
  const woodTex = makeWoodFloorTexture({
    size: 2048,
    plankWidthPx: 150,
    minPlankLenPx: 520,
    maxPlankLenPx: 980,
    minJointOffsetPx: 110,
    seed: 8128,
    baseHue: 34,
    baseSat: 0.46,
    baseLight: 0.55,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    map: woodTex,
    roughness: 0.72,
    metalness: 0.0,
  });

  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  room.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  frontWall.position.set(0, roomH / 2, roomD / 2);
  frontWall.rotation.y = Math.PI;
  room.add(frontWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  room.add(rightWall);

  // Baseboards
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0f0f0'),
    roughness: 0.85,
    metalness: 0.0,
  });

  const baseboardH = 0.09;
  const baseboardT = 0.035;

  function addBaseboardAlongWall(length: number, x: number, z: number, rotY: number) {
    const geo = new THREE.BoxGeometry(length, baseboardH, baseboardT);
    const mesh = new THREE.Mesh(geo, baseboardMat);
    mesh.position.set(x, baseboardH / 2, z);
    mesh.rotation.y = rotY;
    room.add(mesh);
  }

  addBaseboardAlongWall(roomW, 0, -roomD / 2 + baseboardT / 2, 0);
  addBaseboardAlongWall(roomW, 0, roomD / 2 - baseboardT / 2, 0);
  addBaseboardAlongWall(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboardAlongWall(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // ---------------------------
  // Window wall (modern museum end wall)
  // ---------------------------
  (function addWindowWall() {
    const wallZ = roomD / 2;

    // Remove the flat wall so windows show through
    room.remove(frontWall);

    const windowWall = new THREE.Group();
    room.add(windowWall);

    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f5f5f5'),
      roughness: 0.75,
      metalness: 0.0,
    });

    const mullionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#eaeaea'),
      roughness: 0.7,
      metalness: 0.0,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.06,
      metalness: 0.0,
      transmission: 0.92,
      thickness: 0.06,
      ior: 1.45,
      transparent: true,
      opacity: 1.0,
    });

    const inset = 0.02;
    const wallWidth = roomW;
    const wallHeight = roomH;

    const frameMarginX = 0.8;
    const frameMarginTop = 0.55;
    const frameMarginBottom = 0.35;

    const winW = wallWidth - frameMarginX * 2;
    const winH = wallHeight - frameMarginTop - frameMarginBottom;

    const frameThickness = 0.10;
    const frameDepth = 0.08;

    // Surround wall panel (gives a wall outside the window cutout)
    const surround = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), wallMat);
    surround.position.set(0, wallHeight / 2, wallZ - inset - 0.02);
    surround.rotation.y = Math.PI;
    windowWall.add(surround);

    // Outer frame
    const outerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(winW + frameThickness * 2, winH + frameThickness * 2, frameDepth),
      frameMat
    );
    outerFrame.position.set(0, frameMarginBottom + winH / 2, wallZ - inset);
    windowWall.add(outerFrame);

    // Glass plane
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), glassMat);
    glass.position.set(0, frameMarginBottom + winH / 2, wallZ - inset + frameDepth / 2 + 0.002);
    glass.rotation.y = Math.PI;
    windowWall.add(glass);

    // Mullions
    const mullionW = 0.06;
    const mullionD = 0.05;

    const vCount = 5;
    const hCount = 3;

    for (let i = 1; i < vCount; i++) {
      const x = -winW / 2 + (winW * i) / vCount;
      const m = new THREE.Mesh(new THREE.BoxGeometry(mullionW, winH, mullionD), mullionMat);
      m.position.set(x, frameMarginBottom + winH / 2, wallZ - inset + frameDepth / 2 + 0.004);
      windowWall.add(m);
    }

    for (let j = 1; j < hCount; j++) {
      const y = frameMarginBottom + (winH * j) / hCount;
      const m = new THREE.Mesh(new THREE.BoxGeometry(winW, mullionW, mullionD), mullionMat);
      m.position.set(0, y, wallZ - inset + frameDepth / 2 + 0.004);
      windowWall.add(m);
    }

    // Exterior backdrop
    const backdropTex = makeHamptonsBackdropTexture(1536);
    const backdropMat = new THREE.MeshBasicMaterial({ map: backdropTex });
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(winW * 1.22, winH * 1.22), backdropMat);
    backdrop.position.set(0, frameMarginBottom + winH / 2, wallZ + 0.45);
    backdrop.rotation.y = Math.PI;
    windowWall.add(backdrop);

    // Daylight coming through windows
    const sun = new THREE.DirectionalLight(0xffffff, 1.10);
    sun.position.set(0, 9, wallZ + 12);

    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(0, 1.5, 0);
    scene.add(sunTarget);
    sun.target = sunTarget;

    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.0002;
    sun.shadow.normalBias = 0.02;

    scene.add(sun);

    // Warm interior bounce
    const warmFill = new THREE.PointLight(0xfff1dd, 0.18, 45);
    warmFill.position.set(0, 3.5, wallZ - 2.0);
    scene.add(warmFill);
  })();

  // ---------------------------
  // Lighting (baseline + tuned for white room)
  // ---------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.62);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.30);
  scene.add(ambient);

  // Key light aimed at room center (keeps the baseline consistent)
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(6, 10, 10);
  key.castShadow = true;

  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 90;
  key.shadow.camera.left = -22;
  key.shadow.camera.right = 22;
  key.shadow.camera.top = 22;
  key.shadow.camera.bottom = -22;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;

  const keyTarget = new THREE.Object3D();
  keyTarget.position.set(0, 1.6, 0);
  scene.add(keyTarget);
  key.target = keyTarget;

  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(-8, 6, -6);
  scene.add(fill);

  // Visible track fixture (simple but strong realism cue)
  const trackMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111111'),
    roughness: 0.35,
    metalness: 0.25,
  });

  const trackGlowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 1,
    metalness: 0,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.28,
  });

  const track = new THREE.Mesh(new THREE.BoxGeometry(roomW - 1.5, 0.06, 0.06), trackMat);
  track.position.set(0, roomH - 0.25, 0);
  room.add(track);

  const glow = new THREE.Mesh(new THREE.BoxGeometry(roomW - 1.7, 0.02, 0.02), trackGlowMat);
  glow.position.set(0, roomH - 0.29, 0);
  room.add(glow);

  // ---------------------------
  // Texture loading
  // ---------------------------
  const texLoader = new THREE.TextureLoader();

  function loadArtworkTexture(url: string): Promise<THREE.Texture> {
    const src = normalizeImageUrl(url);
    return new Promise((resolve, reject) => {
      texLoader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  // ---------------------------
  // Frames + artwork placement
  // ---------------------------
  const framesGroup = new THREE.Group();
  room.add(framesGroup);

  const frameOuterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#141414'),
    roughness: 0.35,
    metalness: 0.15,
  });

  const frameInnerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f6f6f6'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const artMeshById = new Map<string, THREE.Mesh>();
  const artworkById = new Map<string, MuseumArtwork>();

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;

    artworkById.set(artwork.id, artwork);

    let texture: THREE.Texture | null = null;
    try {
      texture = await loadArtworkTexture(artwork.imageUrl);
    } catch {
      texture = null;
    }

    let aspect = 4 / 5;
    if (texture?.image && (texture.image as any).width && (texture.image as any).height) {
      const w = (texture.image as any).width as number;
      const h = (texture.image as any).height as number;
      aspect = w / h;
    }

    let artW = targetMaxWidth;
    let artH = artW / aspect;
    if (artH > targetMaxHeight) {
      artH = targetMaxHeight;
      artW = artH * aspect;
    }

    const group = new THREE.Group();
    group.position.copy(position);
    group.rotation.y = rotationY;

    const frameT = 0.08;
    const depth = 0.08;

    const outer = new THREE.Mesh(new THREE.BoxGeometry(artW + frameT, artH + frameT, depth), frameOuterMat);
    outer.castShadow = true;
    group.add(outer);

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    // Artwork plane: MeshBasicMaterial so art is never crushed by lighting
    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    art.position.z = depth / 2 + 0.011;
    art.userData = { artworkId: artwork.id, width: artW, height: artH };
    group.add(art);

    artMeshById.set(artwork.id, art);

    // Wall wash spotlight for realism (no shadows to avoid floor artifacts)
    const spot = new THREE.SpotLight(0xffffff, 1.05, 10, Math.PI / 8, 0.65, 1.0);
    spot.position.set(0, 3.9, 1.45);
    spot.target = art;
    spot.castShadow = false;
    group.add(spot);
    group.add(spot.target);

    framesGroup.add(group);
  }

  // Placement: right wall then left wall
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const y = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({ pos: new THREE.Vector3(roomW / 2 - 0.06, y, z), rotY: -Math.PI / 2 });
  }
  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({ pos: new THREE.Vector3(-roomW / 2 + 0.06, y, z), rotY: Math.PI / 2 });
  }

  (async () => {
    for (let i = 0; i < artworks.length; i++) {
      if (disposed) return;

      const p =
        placements[i] ??
        ({
          pos: new THREE.Vector3(roomW / 2 - 0.06, y, 9 - i * 5.2),
          rotY: -Math.PI / 2,
        } as const);

      await addFramedArtwork({
        artwork: artworks[i],
        position: p.pos,
        rotationY: p.rotY,
        targetMaxWidth: 1.6,
        targetMaxHeight: 2.0,
      });
    }
  })();

  // ---------------------------
  // Controls + camera state
  // ---------------------------
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();
  const camTargetPos = basePos.clone();

  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownTime = 0;

  const returnPose = {
    pos: basePos.clone(),
    yaw,
    pitch,
  };

  let isFocused = false;

  const focusAnim = {
    active: false,
    t: 0,
    yawFrom: 0,
    yawTo: 0,
    pitchFrom: 0,
    pitchTo: 0,
    posFrom: basePos.clone(),
    posTo: basePos.clone(),
  };

  function easeInOut(t: number) {
    return t * t * (3 - 2 * t);
  }

  function computeFitDistance(planeW: number, planeH: number) {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = camera.aspect;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    const distV = (planeH * 0.5) / Math.tan(vFov / 2);
    const distH = (planeW * 0.5) / Math.tan(hFov / 2);

    return Math.max(distV, distH) * 1.12;
  }

  function focusArtwork(artworkId: string) {
    const art = artMeshById.get(artworkId);
    if (!art) return;

    // Store return pose
    returnPose.pos.copy(basePos);
    returnPose.yaw = yaw;
    returnPose.pitch = pitch;

    const center = new THREE.Vector3();
    art.getWorldPosition(center);

    const normal = new THREE.Vector3(0, 0, 1);
    normal.applyQuaternion(art.getWorldQuaternion(new THREE.Quaternion()));
    normal.normalize();

    const planeW = Number(art.userData?.width ?? 1.2);
    const planeH = Number(art.userData?.height ?? 1.5);

    const dist = computeFitDistance(planeW, planeH);
    const targetPos = new THREE.Vector3().copy(center).addScaledVector(normal, dist);

    const dir = new THREE.Vector3().subVectors(center, targetPos).normalize();
    const targetYaw = Math.atan2(dir.x, dir.z);
    const targetPitch = THREE.MathUtils.clamp(Math.asin(dir.y), minPitch, maxPitch);

    focusAnim.active = true;
    focusAnim.t = 0;
    focusAnim.yawFrom = yaw;
    focusAnim.yawTo = targetYaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.pitchTo = targetPitch;
    focusAnim.posFrom.copy(basePos);
    focusAnim.posTo.copy(targetPos);

    isFocused = true;
  }

  function clearFocus() {
    if (!isFocused) return;

    focusAnim.active = true;
    focusAnim.t = 0;
    focusAnim.yawFrom = yaw;
    focusAnim.yawTo = returnPose.yaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.pitchTo = returnPose.pitch;
    focusAnim.posFrom.copy(basePos);
    focusAnim.posTo.copy(returnPose.pos);

    isFocused = false;
  }

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownTime = performance.now();

    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    if (isFocused) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * 0.0032;
    pitch -= dy * 0.0032;
    pitch = Math.max(minPitch, Math.min(maxPitch, pitch));
  }

  function onPointerUp(e: PointerEvent) {
    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {}
    renderer.domElement.style.cursor = 'grab';

    if (isFocused) return;

    const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    const dt = performance.now() - pointerDownTime;

    // click, not drag
    if (moved > 6 || dt > 450) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);

    const hits = raycaster.intersectObjects(Array.from(artMeshById.values()), true);
    if (!hits.length) return;

    const hit = hits[0].object as THREE.Mesh;
    const artworkId = hit.userData?.artworkId as string | undefined;
    if (!artworkId) return;

    const artwork = artworkById.get(artworkId);
    if (artwork) onArtworkClick?.(artwork);

    focusArtwork(artworkId);
  }

  function onWheel(e: WheelEvent) {
    if (isFocused) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    camTargetPos.copy(basePos).addScaledVector(forward, step);

    const margin = 0.9;
    camTargetPos.x = THREE.MathUtils.clamp(camTargetPos.x, -roomW / 2 + margin, roomW / 2 - margin);
    camTargetPos.z = THREE.MathUtils.clamp(camTargetPos.z, -roomD / 2 + margin, roomD / 2 - margin);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  // ---------------------------
  // Resize
  // ---------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  // ---------------------------
  // Loop
  // ---------------------------
  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;

    const dt = clock.getDelta();

    if (focusAnim.active) {
      focusAnim.t = Math.min(1, focusAnim.t + dt / 0.55);
      const k = easeInOut(focusAnim.t);

      yaw = THREE.MathUtils.lerp(focusAnim.yawFrom, focusAnim.yawTo, k);
      pitch = THREE.MathUtils.lerp(focusAnim.pitchFrom, focusAnim.pitchTo, k);

      basePos.lerpVectors(focusAnim.posFrom, focusAnim.posTo, k);

      if (focusAnim.t >= 1) focusAnim.active = false;
    } else {
      basePos.lerp(camTargetPos, 0.14);
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.position.copy(basePos);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ---------------------------
  // Dispose
  // ---------------------------
  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerUp);
    renderer.domElement.removeEventListener('wheel', onWheel as any);

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();

      const mat = (mesh as any).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if ((m as any).map) (m as any).map.dispose?.();
          m.dispose?.();
        }
      }
    });

    renderer.dispose();
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
  }

  return { dispose, focusArtwork, clearFocus };
}
