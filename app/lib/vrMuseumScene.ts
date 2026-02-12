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
 * VR Museum Scene (Room-first version)
 *
 * Goals for this pass:
 * - Keep Jeff baseline vibe (bright, tan-ish floor, windows)
 * - Stark white walls
 * - Lighter wood floor with realistic staggered planks and correct grain direction
 * - Big modern window wall on one end with "Hamptons-like" outside
 * - Keep click-to-open details working
 * - No camera zoom/focus yet (focusArtwork exists but is a no-op)
 *
 * Notes:
 * - Artwork planes use MeshBasicMaterial so art stays true and bright
 * - Room uses physicallyCorrectLights when available (typed safely)
 */
export function createVrMuseumScene({ container, artworks, onArtworkClick }: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  function normalizeImageUrl(url: string) {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  }

  function rand(seed: number) {
    // Simple deterministic-ish hash for texture generation
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  function hexToRgb(hex: string) {
    const h = hex.replace('#', '').trim();
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  // ------------------------------------------------------------
  // Procedural wood floor texture with staggered joints
  // ------------------------------------------------------------
  function createWoodFloorTextures(opts: {
    widthMeters: number;
    depthMeters: number;
    texW?: number;
    texH?: number;
    plankWidthM?: number;
    minPlankLenM?: number;
    maxPlankLenM?: number;
    minJointOffsetM?: number;
    baseColorHex?: string;
  }) {
    const {
      widthMeters,
      depthMeters,
      texW = 4096,
      texH = 2048,
      plankWidthM = 0.18, // about 7 inches
      minPlankLenM = 1.2,
      maxPlankLenM = 2.6,
      minJointOffsetM = 0.22, // about 9 inches
      baseColorHex = '#caa06a', // light oak-ish
    } = opts;

    const base = hexToRgb(baseColorHex);

    const canvas = document.createElement('canvas');
    canvas.width = texW;
    canvas.height = texH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2d context missing');

    const bump = document.createElement('canvas');
    bump.width = texW;
    bump.height = texH;
    const bctx = bump.getContext('2d');
    if (!bctx) throw new Error('2d context missing');

    // Background
    ctx.fillStyle = `rgb(${base.r},${base.g},${base.b})`;
    ctx.fillRect(0, 0, texW, texH);

    bctx.fillStyle = 'rgb(128,128,128)';
    bctx.fillRect(0, 0, texW, texH);

    // Pixels per meter
    const pxPerM_X = texW / widthMeters;
    const pxPerM_Y = texH / depthMeters;

    const plankWpx = Math.max(10, Math.floor(plankWidthM * pxPerM_X));
    const rows = Math.max(1, Math.floor(texW / plankWpx));

    // Helper to draw subtle grain lines aligned with plank length (Y direction)
    function drawGrainInPlank(x: number, y: number, w: number, h: number, seed: number) {
      const lines = Math.max(6, Math.floor(w / 10));
      for (let i = 0; i < lines; i++) {
        const t = i / lines;
        const gx = x + Math.floor(t * w) + Math.floor((rand(seed + i * 13.7) - 0.5) * 4);
        const alpha = 0.06 + rand(seed + i * 9.1) * 0.06;

        // Color texture grain
        ctx.fillStyle = `rgba(60,40,20,${alpha})`;
        ctx.fillRect(gx, y + 4, 1, h - 8);

        // Bump texture grain (lighter/darker)
        const bumpV = 128 + Math.floor((rand(seed + i * 3.3) - 0.5) * 24);
        bctx.fillStyle = `rgb(${bumpV},${bumpV},${bumpV})`;
        bctx.fillRect(gx, y + 4, 1, h - 8);
      }

      // Occasional knot / variation, still aligned lengthwise
      if (rand(seed + 101.1) > 0.72) {
        const ky = y + Math.floor(h * (0.2 + rand(seed + 55.5) * 0.6));
        const kx = x + Math.floor(w * (0.25 + rand(seed + 77.7) * 0.5));
        const kr = Math.max(6, Math.floor(Math.min(w, h) * 0.06));

        ctx.beginPath();
        ctx.fillStyle = `rgba(90,60,35,0.18)`;
        ctx.ellipse(kx, ky, kr * 1.1, kr * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();

        bctx.beginPath();
        const bv = 128 + Math.floor((rand(seed + 12.2) - 0.5) * 32);
        bctx.fillStyle = `rgb(${bv},${bv},${bv})`;
        bctx.ellipse(kx, ky, kr * 1.05, kr * 0.7, 0, 0, Math.PI * 2);
        bctx.fill();
      }
    }

    // Track end-joint positions per row to avoid aligning with previous row too closely
    const prevRowJoints: number[] = [];

    for (let r = 0; r < rows; r++) {
      const x0 = r * plankWpx;
      const w = r === rows - 1 ? texW - x0 : plankWpx;

      // Slight color drift per row (subtle)
      const drift = (rand(r * 19.3) - 0.5) * 18;
      const rowColor = {
        r: clamp(base.r + drift, 0, 255),
        g: clamp(base.g + drift * 0.7, 0, 255),
        b: clamp(base.b + drift * 0.45, 0, 255),
      };

      // Build staggered plank segments along Y
      let y = 0;
      const jointsThisRow: number[] = [];

      // Start offset to force random stagger between rows
      // Ensure at least minJointOffset from previous row's first joint when possible
      let startLenM = lerp(minPlankLenM, maxPlankLenM, rand(r * 31.7));
      if (r > 0 && prevRowJoints.length) {
        // If the first joint would align too closely with previous row, nudge
        const firstJointPxCandidate = Math.floor(startLenM * pxPerM_Y);
        const closestPrev = prevRowJoints.reduce((best, j) => (Math.abs(j - firstJointPxCandidate) < Math.abs(best - firstJointPxCandidate) ? j : best), prevRowJoints[0]);
        const minPx = Math.floor(minJointOffsetM * pxPerM_Y);
        if (Math.abs(closestPrev - firstJointPxCandidate) < minPx) {
          startLenM = clamp(startLenM + 0.45, minPlankLenM, maxPlankLenM);
        }
      }

      while (y < texH) {
        // Choose plank length
        const seed = r * 1000 + y * 0.01;
        let lenM = lerp(minPlankLenM, maxPlankLenM, rand(seed));
        if (y === 0) lenM = startLenM;

        let h = Math.floor(lenM * pxPerM_Y);
        if (h < 40) h = 40;
        if (y + h > texH) h = texH - y;

        // Slight per-plank color variation
        const v = (rand(seed + 7.7) - 0.5) * 24;
        const pr = clamp(rowColor.r + v, 0, 255);
        const pg = clamp(rowColor.g + v * 0.85, 0, 255);
        const pb = clamp(rowColor.b + v * 0.65, 0, 255);

        ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
        ctx.fillRect(x0, y, w, h);

        // Grain and bump
        drawGrainInPlank(x0, y, w, h, seed + 99.9);

        // Seams: vertical seams between rows (board edges)
        // Draw a subtle dark line at the right edge of each row
        if (r > 0) {
          ctx.fillStyle = 'rgba(30,20,12,0.10)';
          ctx.fillRect(x0, y, 1, h);
          bctx.fillStyle = 'rgb(120,120,120)';
          bctx.fillRect(x0, y, 1, h);
        }

        // End joint seam
        if (y + h < texH) {
          ctx.fillStyle = 'rgba(30,20,12,0.12)';
          ctx.fillRect(x0, y + h - 1, w, 1);
          bctx.fillStyle = 'rgb(120,120,120)';
          bctx.fillRect(x0, y + h - 1, w, 1);

          jointsThisRow.push(y + h);
        }

        y += h;
      }

      prevRowJoints.length = 0;
      prevRowJoints.push(...jointsThisRow);
    }

    // Very subtle vignette to reduce flat CG look
    const grad = ctx.createRadialGradient(texW * 0.5, texH * 0.55, texH * 0.1, texW * 0.5, texH * 0.55, texH * 0.85);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, texW, texH);

    const colorTex = new THREE.CanvasTexture(canvas);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = 8;
    colorTex.wrapS = THREE.ClampToEdgeWrapping;
    colorTex.wrapT = THREE.ClampToEdgeWrapping;
    colorTex.needsUpdate = true;

    const bumpTex = new THREE.CanvasTexture(bump);
    bumpTex.colorSpace = THREE.NoColorSpace;
    bumpTex.anisotropy = 8;
    bumpTex.wrapS = THREE.ClampToEdgeWrapping;
    bumpTex.wrapT = THREE.ClampToEdgeWrapping;
    bumpTex.needsUpdate = true;

    return { colorTex, bumpTex };
  }

  // ------------------------------------------------------------
  // Renderer
  // ------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Cross-version: typings can differ by three version
  (renderer as any).physicallyCorrectLights = true;
  if ('useLegacyLights' in renderer) (renderer as any).useLegacyLights = false;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // ------------------------------------------------------------
  // Scene + Camera
  // ------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf6f7f9);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 1.55, 6.6);

  // ------------------------------------------------------------
  // Room
  // ------------------------------------------------------------
  const room = new THREE.Group();
  scene.add(room);

  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  // Walls: stark white
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.99,
    metalness: 0.0,
  });

  // Floor: wood texture with correct grain direction (along depth)
  const { colorTex: floorColor, bumpTex: floorBump } = createWoodFloorTextures({
    widthMeters: roomW,
    depthMeters: roomD,
    baseColorHex: '#caa06a',
    plankWidthM: 0.18,
    minPlankLenM: 1.2,
    maxPlankLenM: 2.6,
    minJointOffsetM: 0.22,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorColor,
    bumpMap: floorBump,
    bumpScale: 0.025,
    roughness: 0.62,
    metalness: 0.02,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  // Walls (we will replace the front wall with a window wall)
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  room.add(backWall);

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
    color: new THREE.Color('#f1f1f1'),
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
  addBaseboardAlongWall(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboardAlongWall(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // ------------------------------------------------------------
  // Window wall (front end of the room, z = +roomD/2)
  // ------------------------------------------------------------
  const windowWall = new THREE.Group();
  windowWall.position.set(0, 0, roomD / 2);
  room.add(windowWall);

  // Low wall under windows
  const sillH = 0.65;
  const lowWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, sillH), wallMat);
  lowWall.position.set(0, sillH / 2, -0.001);
  lowWall.rotation.y = Math.PI; // face inward
  windowWall.add(lowWall);

  // Side columns
  const colW = 0.38;
  const colGeo = new THREE.BoxGeometry(colW, roomH, 0.08);
  const leftCol = new THREE.Mesh(colGeo, wallMat);
  leftCol.position.set(-roomW / 2 + colW / 2, roomH / 2, -0.02);
  windowWall.add(leftCol);

  const rightCol = new THREE.Mesh(colGeo, wallMat);
  rightCol.position.set(roomW / 2 - colW / 2, roomH / 2, -0.02);
  windowWall.add(rightCol);

  // Top beam
  const beamH = 0.28;
  const beamGeo = new THREE.BoxGeometry(roomW, beamH, 0.08);
  const topBeam = new THREE.Mesh(beamGeo, wallMat);
  topBeam.position.set(0, roomH - beamH / 2, -0.02);
  windowWall.add(topBeam);

  // Window frames
  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dcdcdc'),
    roughness: 0.65,
    metalness: 0.05,
  });

  const mullionMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cfcfcf'),
    roughness: 0.7,
    metalness: 0.05,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d8ecff'),
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.9,
    transparent: true,
    opacity: 1,
    ior: 1.45,
    thickness: 0.02,
  });

  // Glass area dimensions
  const glassY0 = sillH;
  const glassY1 = roomH - beamH;
  const glassH = glassY1 - glassY0;
  const glassW = roomW - colW * 2;

  // Divide into bays like a modern museum wall of windows
  const bays = 5;
  const bayGap = 0.02;
  const bayW = (glassW - (bays - 1) * bayGap) / bays;

  const frameDepth = 0.04;

  for (let i = 0; i < bays; i++) {
    const xCenter = -glassW / 2 + bayW / 2 + i * (bayW + bayGap);

    // Outer frame for the bay
    const outer = new THREE.Mesh(new THREE.BoxGeometry(bayW, glassH, frameDepth), frameMat);
    outer.position.set(xCenter, glassY0 + glassH / 2, -0.035);
    windowWall.add(outer);

    // Inner glass (slightly in front)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(bayW - 0.08, glassH - 0.08), glassMat);
    glass.position.set(xCenter, glassY0 + glassH / 2, -0.01);
    glass.rotation.y = Math.PI; // face inward
    windowWall.add(glass);

    // Mullions (2x2 grid per bay)
    const mullionW = 0.03;
    const mullionZ = 0.02;

    const vM = new THREE.Mesh(new THREE.BoxGeometry(mullionW, glassH - 0.1, mullionZ), mullionMat);
    vM.position.set(xCenter, glassY0 + glassH / 2, -0.02);
    windowWall.add(vM);

    const hM = new THREE.Mesh(new THREE.BoxGeometry(bayW - 0.1, mullionW, mullionZ), mullionMat);
    hM.position.set(xCenter, glassY0 + glassH / 2, -0.02);
    windowWall.add(hM);
  }

  // Baseboard on the window wall low section
  addBaseboardAlongWall(roomW, 0, roomD / 2 - baseboardT / 2, 0);

  // ------------------------------------------------------------
  // Outside scene (Hamptons vibe, lightweight)
  // ------------------------------------------------------------
  const outside = new THREE.Group();
  outside.position.set(0, 0, roomD / 2 + 0.6);
  scene.add(outside);

  // Sky dome (simple gradient texture)
  function createSkyTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const g = c.getContext('2d');
    if (!g) throw new Error('2d context missing');

    const grd = g.createLinearGradient(0, 0, 0, c.height);
    grd.addColorStop(0, '#a9d6ff');
    grd.addColorStop(0.55, '#dff1ff');
    grd.addColorStop(1, '#ffffff');

    g.fillStyle = grd;
    g.fillRect(0, 0, c.width, c.height);

    // Soft clouds
    for (let i = 0; i < 90; i++) {
      const x = Math.floor(rand(i * 12.7) * c.width);
      const y = Math.floor(rand(i * 33.1) * c.height * 0.55);
      const r = 30 + rand(i * 9.9) * 90;
      g.beginPath();
      g.fillStyle = `rgba(255,255,255,${0.08 + rand(i * 1.7) * 0.10})`;
      g.ellipse(x, y, r * 1.3, r * 0.7, 0, 0, Math.PI * 2);
      g.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  const skyTex = createSkyTexture();
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), skyMat);
  skyDome.position.set(0, 18, 18);
  outside.add(skyDome);

  // Ocean plane far away
  const oceanMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#7fb6c8'),
    roughness: 0.22,
    metalness: 0.02,
  });
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(200, 80), oceanMat);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, 0.02, 48);
  outside.add(ocean);

  // Dune / ground
  const duneMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d6c7a6'),
    roughness: 0.95,
    metalness: 0.0,
  });
  const dune = new THREE.Mesh(new THREE.PlaneGeometry(200, 80), duneMat);
  dune.rotation.x = -Math.PI / 2;
  dune.position.set(0, 0.01, 18);
  outside.add(dune);

  // Tree line as simple "billboard strip" with procedural texture
  function createTreeLineTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const g = c.getContext('2d');
    if (!g) throw new Error('2d context missing');

    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(0,0,0,0)';
    g.fillRect(0, 0, c.width, c.height);

    for (let i = 0; i < 220; i++) {
      const x = rand(i * 12.13) * c.width;
      const h = 40 + rand(i * 91.7) * 160;
      const w = 18 + rand(i * 7.77) * 42;
      const y = c.height - h;

      const green = 90 + Math.floor(rand(i * 2.17) * 70);
      g.fillStyle = `rgba(30,${green},40,0.70)`;
      g.beginPath();
      g.ellipse(x, y + h * 0.55, w, h * 0.55, 0, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = `rgba(20,${green - 10},30,0.45)`;
      g.beginPath();
      g.ellipse(x + w * 0.2, y + h * 0.62, w * 0.75, h * 0.45, 0, 0, Math.PI * 2);
      g.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  const treeTex = createTreeLineTexture();
  const treeMat = new THREE.MeshBasicMaterial({ map: treeTex, transparent: true, opacity: 0.95 });
  const treeStrip = new THREE.Mesh(new THREE.PlaneGeometry(160, 24), treeMat);
  treeStrip.position.set(0, 12, 28);
  outside.add(treeStrip);

  // ------------------------------------------------------------
  // Lighting (bright, museum-like, natural light from windows)
  // ------------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0xbfd2e6, 0.65);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.26);
  scene.add(ambient);

  // Sun coming in from window wall direction
  const sun = new THREE.DirectionalLight(0xffffff, 1.35);
  sun.position.set(0, 10.5, roomD / 2 + 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 120;
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;
  sun.shadow.bias = -0.00015;
  sun.shadow.normalBias = 0.02;

  const sunTarget = new THREE.Object3D();
  sunTarget.position.set(0, 1.6, 0);
  scene.add(sunTarget);
  sun.target = sunTarget;

  scene.add(sun);

  // Subtle fill from behind so corners do not crush
  const fill = new THREE.DirectionalLight(0xffffff, 0.38);
  fill.position.set(-8, 6, -8);
  scene.add(fill);

  // Track light fixture (visible, boosts realism)
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
    emissiveIntensity: 0.25,
  });

  const track = new THREE.Mesh(new THREE.BoxGeometry(roomW - 1.5, 0.06, 0.06), trackMat);
  track.position.set(0, roomH - 0.25, 0);
  room.add(track);

  const glow = new THREE.Mesh(new THREE.BoxGeometry(roomW - 1.7, 0.02, 0.02), trackGlowMat);
  glow.position.set(0, roomH - 0.29, 0);
  room.add(glow);

  // ------------------------------------------------------------
  // Artworks
  // ------------------------------------------------------------
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
    outer.receiveShadow = false;
    group.add(outer);

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    art.position.z = depth / 2 + 0.011;
    art.userData = { artworkId: artwork.id };
    group.add(art);

    artMeshById.set(artwork.id, art);

    // Soft wall wash spotlight per artwork (no shadows to avoid floor artifacts)
    const spot = new THREE.SpotLight(0xffffff, 0.9, 10, Math.PI / 8, 0.65, 1.0);
    spot.position.set(0, 3.9, 1.45);
    spot.target = art;
    spot.castShadow = false;
    group.add(spot);
    group.add(spot.target);

    framesGroup.add(group);
  }

  // Layout: right wall then left wall (like baseline)
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

  // ------------------------------------------------------------
  // Controls: drag look + wheel move (no focus mode)
  // ------------------------------------------------------------
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
  }

  function onWheel(e: WheelEvent) {
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

  // ------------------------------------------------------------
  // Resize
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Loop
  // ------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;

    clock.getDelta();

    basePos.lerp(camTargetPos, 0.14);

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.position.copy(basePos);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ------------------------------------------------------------
  // Handle (zoom removed for now)
  // ------------------------------------------------------------
  function focusArtwork(_artworkId: string) {
    // Intentionally no-op for this "room dial-in" pass
  }

  function clearFocus() {
    // Intentionally no-op
  }

  // ------------------------------------------------------------
  // Dispose
  // ------------------------------------------------------------
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
          const mm = m as any;
          if (mm.map) mm.map.dispose?.();
          if (mm.bumpMap) mm.bumpMap.dispose?.();
          if (mm.normalMap) mm.normalMap.dispose?.();
          mm.dispose?.();
        }
      }
    });

    // Dispose procedural textures explicitly
    floorColor.dispose();
    floorBump.dispose();
    skyTex.dispose();
    treeTex.dispose();

    renderer.dispose();
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
  }

  return { dispose, focusArtwork, clearFocus };
}
