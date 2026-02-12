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

type RaycastTarget = {
  mesh: THREE.Mesh;
  artwork: MuseumArtwork;
};

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

  // Keep your “nice bright” baseline
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // ---------------------------
  // Scene + Camera
  // ---------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe9ecef);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 160);
  camera.position.set(0, 1.55, 6.6);

  // ---------------------------
  // Room dims
  // ---------------------------
  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  // ---------------------------
  // Materials
  // ---------------------------
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'), // stark gallery white
    roughness: 0.93,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.98,
    metalness: 0.0,
  });

  // Baseboards
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f3f3f3'),
    roughness: 0.8,
    metalness: 0.0,
  });

  // ---------------------------
  // Procedural textures
  // ---------------------------
  function makeCanvas(size: number) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context not available');
    return { canvas, ctx };
  }

  function rand(seed: number) {
    // deterministic-ish PRNG
    let t = seed + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  // A much nicer outside view without pulling in external images.
  function createHamptonsBackdropTexture(size = 1024) {
    const { canvas, ctx } = makeCanvas(size);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, size * 0.65);
    sky.addColorStop(0, '#bfe3ff');
    sky.addColorStop(0.55, '#eaf6ff');
    sky.addColorStop(1, '#ffffff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, size, size);

    // Soft clouds
    for (let i = 0; i < 120; i++) {
      const x = rand(i * 7.1) * size;
      const y = rand(i * 9.3) * (size * 0.45);
      const r = 30 + rand(i * 11.7) * 120;
      const a = 0.03 + rand(i * 3.7) * 0.05;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.ellipse(x, y, r * 1.4, r, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Horizon line position
    const horizonY = Math.floor(size * 0.58);

    // Distant tree line (layered, blurred-ish)
    for (let layer = 0; layer < 3; layer++) {
      const baseY = horizonY - 35 + layer * 12;
      const greenBase = layer === 0 ? 110 : layer === 1 ? 95 : 80;
      ctx.fillStyle = `rgba(40, ${greenBase}, 55, ${0.55 - layer * 0.12})`;
      ctx.beginPath();
      ctx.moveTo(0, baseY);

      const bumps = 60;
      for (let b = 0; b <= bumps; b++) {
        const x = (b / bumps) * size;
        const n = Math.sin(b * 0.9 + layer * 1.7) * 10 + (rand(b * 37 + layer * 101) - 0.5) * 18;
        ctx.lineTo(x, baseY + n);
      }
      ctx.lineTo(size, baseY + 90);
      ctx.lineTo(0, baseY + 90);
      ctx.closePath();
      ctx.fill();
    }

    // Water band
    const water = ctx.createLinearGradient(0, horizonY, 0, horizonY + size * 0.18);
    water.addColorStop(0, 'rgba(120, 180, 210, 0.90)');
    water.addColorStop(1, 'rgba(90, 150, 190, 0.65)');
    ctx.fillStyle = water;
    ctx.fillRect(0, horizonY, size, Math.floor(size * 0.22));

    // Water shimmer
    for (let i = 0; i < 180; i++) {
      const x = rand(i * 19.2) * size;
      const y = horizonY + rand(i * 13.1) * (size * 0.18);
      const w = 20 + rand(i * 5.3) * 120;
      const h = 1 + rand(i * 2.2) * 2;
      const a = 0.03 + rand(i * 4.2) * 0.05;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(x, y, w, h);
    }

    // Foreground sand / light path hint
    const sandY = horizonY + Math.floor(size * 0.20);
    const sand = ctx.createLinearGradient(0, sandY, 0, size);
    sand.addColorStop(0, 'rgba(245, 238, 222, 0.9)');
    sand.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
    ctx.fillStyle = sand;
    ctx.fillRect(0, sandY, size, size - sandY);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  // Staggered plank pattern baked into one texture.
  // Planks run along +Z (long direction of the room).
  function createWoodFloorTextures(size = 2048) {
    const { canvas: cColor, ctx: ctxC } = makeCanvas(size);
    const { canvas: cBump, ctx: ctxB } = makeCanvas(size);

    // Base tone
    ctxC.fillStyle = '#d8b07a'; // warm light oak
    ctxC.fillRect(0, 0, size, size);

    ctxB.fillStyle = 'rgb(128,128,128)';
    ctxB.fillRect(0, 0, size, size);

    // Plank sizing in texture space
    const plankW = Math.floor(size * 0.08); // width across X
    const minLen = Math.floor(size * 0.22); // length along Z
    const maxLen = Math.floor(size * 0.52);

    const cols = Math.ceil(size / plankW);

    // Helpers
    function drawGrain(ctx: CanvasRenderingContext2D, x0: number, y0: number, w: number, h: number, seedBase: number) {
      // Grain runs along long axis (here: along Y of the texture).
      const lines = Math.floor(w * 0.55);
      for (let i = 0; i < lines; i++) {
        const gx = x0 + rand(seedBase * 1000 + i * 13) * w;
        const alpha = 0.02 + rand(seedBase * 2000 + i * 17) * 0.04;
        ctx.fillStyle = `rgba(80,55,30,${alpha})`;
        ctx.fillRect(gx, y0 + 4, 1, h - 8);
      }
    }

    function drawKnots(ctx: CanvasRenderingContext2D, x0: number, y0: number, w: number, h: number, seedBase: number) {
      const count = 1 + Math.floor(rand(seedBase * 9.7) * 3);
      for (let k = 0; k < count; k++) {
        const cx = x0 + rand(seedBase * 71 + k * 11) * w;
        const cy = y0 + rand(seedBase * 91 + k * 19) * h;
        const r = 6 + rand(seedBase * 31 + k * 7) * 22;

        const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
        g.addColorStop(0, 'rgba(90,60,35,0.22)');
        g.addColorStop(1, 'rgba(90,60,35,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Stagger: for each column, fill the length with variable boards whose end joints are offset.
    for (let col = 0; col < cols; col++) {
      const x0 = col * plankW;
      const w = Math.min(plankW + 1, size - x0);

      // Start offset so end joints are staggered between adjacent planks
      let y = Math.floor(rand(col * 103.3) * (maxLen - minLen)) * 0.35;

      let boardIndex = 0;
      while (y < size) {
        const seedBase = col * 1000 + boardIndex * 17;

        const len = Math.floor(minLen + rand(seedBase * 3.3) * (maxLen - minLen));
        const h = Math.min(len, size - y);

        // Slight plank-to-plank color variance
        const warmth = 0.92 + rand(seedBase * 2.1) * 0.18; // 0.92..1.10
        const shade = 0.95 + rand(seedBase * 5.7) * 0.14; // 0.95..1.09
        const r = Math.floor(216 * shade * warmth);
        const g = Math.floor(176 * shade);
        const b = Math.floor(122 * shade * (1.02 - (warmth - 1) * 0.6));

        ctxC.fillStyle = `rgb(${r},${g},${b})`;
        ctxC.fillRect(x0, y, w, h);

        // Grain + knots
        drawGrain(ctxC, x0, y, w, h, seedBase);
        drawKnots(ctxC, x0, y, w, h, seedBase);

        // Plank bevel lines (subtle)
        ctxC.fillStyle = 'rgba(0,0,0,0.05)';
        ctxC.fillRect(x0, y, 1, h);
        ctxC.fillRect(x0 + w - 1, y, 1, h);

        // End joint line
        ctxC.fillStyle = 'rgba(0,0,0,0.08)';
        ctxC.fillRect(x0, y + h - 1, w, 1);

        // Bump: map some grain to bump by drawing light/dark variation
        ctxB.fillStyle = 'rgba(140,140,140,0.18)';
        ctxB.fillRect(x0, y, w, h);

        // Bump grain
        const bumpLines = Math.floor(w * 0.6);
        for (let i = 0; i < bumpLines; i++) {
          const gx = x0 + rand(seedBase * 4000 + i * 23) * w;
          const a = 0.05 + rand(seedBase * 5000 + i * 29) * 0.08;
          ctxB.fillStyle = `rgba(160,160,160,${a})`;
          ctxB.fillRect(gx, y + 4, 1, h - 8);
        }

        // Ensure next end joint is staggered. Minimum offset feels like “6 to 10 inches” in real life.
        y += h;
        boardIndex++;
      }
    }

    // Very subtle global vignette to reduce “flat CG”
    const vignette = ctxC.createRadialGradient(size * 0.5, size * 0.55, size * 0.25, size * 0.5, size * 0.55, size * 0.85);
    vignette.addColorStop(0, 'rgba(255,255,255,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctxC.fillStyle = vignette;
    ctxC.fillRect(0, 0, size, size);

    const colorTex = new THREE.CanvasTexture(cColor);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.minFilter = THREE.LinearMipmapLinearFilter;
    colorTex.magFilter = THREE.LinearFilter;
    colorTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    const bumpTex = new THREE.CanvasTexture(cBump);
    bumpTex.colorSpace = THREE.NoColorSpace;
    bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
    bumpTex.magFilter = THREE.LinearFilter;
    bumpTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    // Repeat so the pattern reads like real planks at scale.
    // We want planks running along Z (roomD). In UV space, V maps to height of plane (roomD).
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.RepeatWrapping;
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;

    // Tune repeat until it feels right in your camera shots
    colorTex.repeat.set(2.2, 6.0);
    bumpTex.repeat.set(2.2, 6.0);

    colorTex.needsUpdate = true;
    bumpTex.needsUpdate = true;

    return { colorTex, bumpTex };
  }

  const { colorTex: floorColorTex, bumpTex: floorBumpTex } = createWoodFloorTextures(2048);

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorColorTex,
    bumpMap: floorBumpTex,
    bumpScale: 0.035,
    roughness: 0.42,
    metalness: 0.0,
  });

  // ---------------------------
  // Room geometry
  // ---------------------------
  const room = new THREE.Group();
  scene.add(room);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  // Walls: we will make the back wall a window wall
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

  // Back wall base (still there so it seals the room edges visually)
  const backWallBase = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWallBase.position.set(0, roomH / 2, -roomD / 2);
  room.add(backWallBase);

  // Baseboards
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
  // Lighting (keep your “good brightness” but make it more believable)
  // ---------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe7e7e7, 0.55);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.28);
  scene.add(ambient);

  // Key directional, aimed down the room
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(7, 10.5, 9);
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
  keyTarget.position.set(0, 1.6, -2);
  scene.add(keyTarget);
  key.target = keyTarget;

  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.42);
  fill.position.set(-9, 7, -7);
  scene.add(fill);

  // Window light: soft, wide contribution from the window wall end
  const windowLight = new THREE.DirectionalLight(0xffffff, 0.55);
  windowLight.position.set(0, 6.5, -roomD / 2 - 6);
  const windowTarget = new THREE.Object3D();
  windowTarget.position.set(0, 1.4, -roomD / 2 + 3);
  scene.add(windowTarget);
  windowLight.target = windowTarget;
  scene.add(windowLight);

  // ---------------------------
  // Track fixture (real object, not a weird bar)
  // ---------------------------
  const trackMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#efefef'),
    roughness: 0.65,
    metalness: 0.0,
  });

  const track = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, roomW - 1.2, 16), trackMat);
  track.rotation.z = Math.PI / 2;
  track.position.set(0, roomH - 0.28, 2.0);
  room.add(track);

  // Little spot heads along track (cheap realism)
  const spotHeadMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f6f6f6'),
    roughness: 0.55,
    metalness: 0.0,
  });

  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const x = THREE.MathUtils.lerp(-(roomW / 2) + 1.2, (roomW / 2) - 1.2, t);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.12, 14), spotHeadMat);
    head.position.set(x, roomH - 0.33, 2.0);
    head.rotation.x = Math.PI / 2;
    room.add(head);
  }

  // ---------------------------
  // Window wall (big modern grid) + outside backdrop
  // ---------------------------
  const windowGroup = new THREE.Group();
  room.add(windowGroup);

  const windowWallZ = -roomD / 2 + 0.02;
  const windowWidth = roomW - 1.6;
  const windowHeight = roomH - 0.9;
  const windowBottom = 0.45;

  // Backdrop outside (behind glass)
  const outsideTex = createHamptonsBackdropTexture(1024);
  const outsideMat = new THREE.MeshBasicMaterial({ map: outsideTex });
  const outsidePlane = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), outsideMat);
  outsidePlane.position.set(0, windowBottom + windowHeight / 2, windowWallZ - 0.03);
  windowGroup.add(outsidePlane);

  // Glass
  const glassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.15,
    metalness: 0.0,
    transparent: true,
    opacity: 0.22,
  });

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), glassMat);
  glass.position.set(0, windowBottom + windowHeight / 2, windowWallZ);
  windowGroup.add(glass);

  // Mullions/frame
  const mullionMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f4f4f4'),
    roughness: 0.7,
    metalness: 0.0,
  });

  const frameT = 0.05;

  // Outer frame
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, frameT, frameT), mullionMat);
  frameTop.position.set(0, windowBottom + windowHeight + frameT / 2, windowWallZ + frameT / 2);
  windowGroup.add(frameTop);

  const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, frameT, frameT), mullionMat);
  frameBottom.position.set(0, windowBottom - frameT / 2, windowWallZ + frameT / 2);
  windowGroup.add(frameBottom);

  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(frameT, windowHeight + frameT * 2, frameT), mullionMat);
  frameLeft.position.set(-windowWidth / 2 - frameT / 2, windowBottom + windowHeight / 2, windowWallZ + frameT / 2);
  windowGroup.add(frameLeft);

  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(frameT, windowHeight + frameT * 2, frameT), mullionMat);
  frameRight.position.set(windowWidth / 2 + frameT / 2, windowBottom + windowHeight / 2, windowWallZ + frameT / 2);
  windowGroup.add(frameRight);

  // Grid mullions
  const cols = 5;
  const rows = 3;

  for (let c = 1; c < cols; c++) {
    const x = -windowWidth / 2 + (windowWidth * c) / cols;
    const v = new THREE.Mesh(new THREE.BoxGeometry(frameT * 0.75, windowHeight, frameT * 0.6), mullionMat);
    v.position.set(x, windowBottom + windowHeight / 2, windowWallZ + frameT * 0.35);
    windowGroup.add(v);
  }

  for (let r = 1; r < rows; r++) {
    const y = windowBottom + (windowHeight * r) / rows;
    const h = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, frameT * 0.75, frameT * 0.6), mullionMat);
    h.position.set(0, y, windowWallZ + frameT * 0.35);
    windowGroup.add(h);
  }

  // ---------------------------
  // Artwork frames + raycast targets
  // ---------------------------
  const framesGroup = new THREE.Group();
  room.add(framesGroup);

  const rayTargets: RaycastTarget[] = [];
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
        reject
      );
    });
  }

  const frameOuterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1a'),
    roughness: 0.35,
    metalness: 0.12,
  });

  const matteMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f7f7f7'),
    roughness: 0.95,
    metalness: 0.0,
  });

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;

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

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), matteMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    artPlane.position.z = depth / 2 + 0.01;
    group.add(artPlane);

    rayTargets.push({ mesh: artPlane, artwork });

    framesGroup.add(group);
  }

  // Layout: right wall then left wall, like your baseline
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const y = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({
      pos: new THREE.Vector3(roomW / 2 - 0.06, y, z),
      rotY: -Math.PI / 2,
    });
  }

  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({
      pos: new THREE.Vector3(-roomW / 2 + 0.06, y, z),
      rotY: Math.PI / 2,
    });
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
  // Controls: drag look + wheel move
  // ---------------------------
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
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
  }

  function onWheel(e: WheelEvent) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    basePos.addScaledVector(forward, step);

    const margin = 0.9;
    basePos.x = THREE.MathUtils.clamp(basePos.x, -roomW / 2 + margin, roomW / 2 - margin);
    basePos.z = THREE.MathUtils.clamp(basePos.z, -roomD / 2 + margin, roomD / 2 - margin);
  }

  // Click raycast
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pointerDownAt = 0;

  function onClick(e: MouseEvent) {
    // Ignore drags
    if (Date.now() - pointerDownAt > 350) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    ndc.set(x, y);

    raycaster.setFromCamera(ndc, camera);
    const meshes = rayTargets.map((t) => t.mesh);
    const hits = raycaster.intersectObjects(meshes, true);

    if (!hits.length) return;

    const hit = hits[0].object as THREE.Mesh;
    const target = rayTargets.find((t) => t.mesh === hit);
    if (target) onArtworkClick?.(target.artwork);
  }

  function onMouseDown() {
    pointerDownAt = Date.now();
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('click', onClick);

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
  // Focus API (no zoom for now, just a gentle look-at)
  // ---------------------------
  let hasFocus = false;
  let focusYaw = 0;
  let focusPitch = 0;

  function focusArtwork(artworkId: string) {
    const t = rayTargets.find((r) => r.artwork.id === artworkId);
    if (!t) return;

    const wp = new THREE.Vector3();
    t.mesh.getWorldPosition(wp);

    const dir = wp.clone().sub(camera.position).normalize();

    // Convert direction to yaw/pitch
    focusYaw = Math.atan2(-dir.x, -dir.z);
    focusPitch = Math.asin(dir.y);

    focusPitch = Math.max(minPitch, Math.min(maxPitch, focusPitch));
    hasFocus = true;
  }

  function clearFocus() {
    hasFocus = false;
  }

  // ---------------------------
  // Loop
  // ---------------------------
  function animate() {
    if (disposed) return;

    // Smooth focus
    if (hasFocus) {
      yaw = THREE.MathUtils.lerp(yaw, focusYaw, 0.06);
      pitch = THREE.MathUtils.lerp(pitch, focusPitch, 0.06);
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
    renderer.domElement.removeEventListener('mousedown', onMouseDown);
    renderer.domElement.removeEventListener('click', onClick);

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();

      const mat = (mesh as any).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if (m.map) m.map.dispose?.();
          if ((m as any).bumpMap) (m as any).bumpMap.dispose?.();
          m.dispose?.();
        }
      }
    });

    renderer.dispose();

    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return {
    dispose,
    focusArtwork,
    clearFocus,
  };
}
