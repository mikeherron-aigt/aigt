import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export type VrMuseumSceneHandle = {
  dispose: () => void;
  focusArtwork?: (id: string) => void;
  clearFocus?: () => void;
};

type CreateArgs = {
  container: HTMLDivElement;
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

type ArtMeshRecord = {
  artwork: MuseumArtwork;
  clickable: THREE.Object3D;
  frameGroup: THREE.Group;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToSeed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Generates a realistic staggered plank floor texture.
 * Planks run along the long axis (room depth).
 * Each row has consistent plank width; lengths vary; end joints stagger.
 */
function generateStaggeredPlankTextures(opts: {
  seed: number;
  textureSize: number; // px
  roomW: number; // world units
  roomD: number; // world units
  plankWidth: number; // world units
  minPlankLen: number; // world units
  maxPlankLen: number; // world units
}) {
  const {
    seed,
    textureSize,
    roomW,
    roomD,
    plankWidth,
    minPlankLen,
    maxPlankLen,
  } = opts;

  const rand = mulberry32(seed);

  // Two canvases: color + roughness
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = textureSize;
  colorCanvas.height = textureSize;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = textureSize;
  roughCanvas.height = textureSize;

  const cctx = colorCanvas.getContext('2d');
  const rctx = roughCanvas.getContext('2d');

  if (!cctx || !rctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  // Background base
  cctx.fillStyle = '#caa36b';
  cctx.fillRect(0, 0, textureSize, textureSize);

  rctx.fillStyle = 'rgb(170,170,170)'; // mid roughness base
  rctx.fillRect(0, 0, textureSize, textureSize);

  // Map world units to texture pixels
  const pxPerWorldX = textureSize / roomW;
  const pxPerWorldY = textureSize / roomD;

  // Plank layout along X (rows)
  const rowPx = Math.max(6, Math.floor(plankWidth * pxPerWorldX));
  const numRows = Math.ceil(textureSize / rowPx);

  // Subtle per-row variation
  for (let row = 0; row < numRows; row++) {
    const x0 = row * rowPx;
    const x1 = Math.min(textureSize, x0 + rowPx);

    // Row tone variation
    const hueShift = (rand() - 0.5) * 6; // subtle
    const lightShift = (rand() - 0.5) * 14;

    // Start offset so joints stagger
    let y = 0;
    let prevJoint = -9999;

    // Randomize starting offset for each row (stagger)
    const startOffsetWorld = lerp(0.15, 0.85, rand()) * maxPlankLen;
    const startOffsetPx = Math.floor(startOffsetWorld * pxPerWorldY);
    y -= startOffsetPx;

    while (y < textureSize) {
      const plankLenWorld = lerp(minPlankLen, maxPlankLen, rand());
      const plankLenPx = Math.max(10, Math.floor(plankLenWorld * pxPerWorldY));

      const y0 = y;
      const y1 = y + plankLenPx;

      // Enforce stagger: avoid joints lining up too closely with previous row joint
      if (Math.abs(y0 - prevJoint) < 14) {
        y += Math.floor(lerp(0.1, 0.3, rand()) * plankLenPx);
        continue;
      }
      prevJoint = y0;

      // Plank base color per plank
      const plankWarm = 180 + Math.floor((rand() - 0.5) * 18);
      const plankRed = 150 + Math.floor((rand() - 0.5) * 16);
      const plankGreen = 115 + Math.floor((rand() - 0.5) * 14);
      const plankBlue = 70 + Math.floor((rand() - 0.5) * 12);

      // Apply row shifts
      const rr = clamp(plankRed + lightShift, 0, 255);
      const gg = clamp(plankGreen + lightShift, 0, 255);
      const bb = clamp(plankBlue + lightShift, 0, 255);

      cctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      cctx.fillRect(x0, y0, x1 - x0, y1 - y0);

      // Grain lines (run along Y axis because boards run along depth)
      const grainCount = 10 + Math.floor(rand() * 12);
      for (let g = 0; g < grainCount; g++) {
        const gx = x0 + Math.floor(rand() * (x1 - x0));
        const alpha = 0.06 + rand() * 0.08;
        cctx.fillStyle = `rgba(60,40,20,${alpha})`;
        cctx.fillRect(gx, y0 + 2, 1, (y1 - y0) - 4);

        // Roughness grain (slight contrast)
        const ra = 0.06 + rand() * 0.10;
        rctx.fillStyle = `rgba(255,255,255,${ra})`;
        rctx.fillRect(gx, y0 + 2, 1, (y1 - y0) - 4);
      }

      // Seams (between planks)
      cctx.fillStyle = 'rgba(25,18,12,0.22)';
      cctx.fillRect(x0, y0, 1, (y1 - y0)); // left seam
      cctx.fillRect(x1 - 1, y0, 1, (y1 - y0)); // right seam
      cctx.fillRect(x0, y1 - 1, x1 - x0, 1); // end joint seam

      rctx.fillStyle = 'rgba(0,0,0,0.22)';
      rctx.fillRect(x0, y0, 1, (y1 - y0));
      rctx.fillRect(x1 - 1, y0, 1, (y1 - y0));
      rctx.fillRect(x0, y1 - 1, x1 - x0, 1);

      y = y1;
    }

    // Very subtle hue wash per row to break uniformity
    if (Math.abs(hueShift) > 0.1) {
      cctx.fillStyle = `rgba(255,190,120,${Math.abs(hueShift) / 400})`;
      cctx.fillRect(x0, 0, x1 - x0, textureSize);
    }
  }

  // Soft vignette so floor feels less flat
  const grad = cctx.createRadialGradient(
    textureSize * 0.5,
    textureSize * 0.7,
    textureSize * 0.1,
    textureSize * 0.5,
    textureSize * 0.7,
    textureSize * 0.9
  );
  grad.addColorStop(0, 'rgba(255,255,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0.08)');
  cctx.fillStyle = grad;
  cctx.fillRect(0, 0, textureSize, textureSize);

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.colorSpace = THREE.SRGBColorSpace;
  colorTex.wrapS = THREE.ClampToEdgeWrapping;
  colorTex.wrapT = THREE.ClampToEdgeWrapping;
  colorTex.anisotropy = 8;
  colorTex.needsUpdate = true;

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  roughTex.colorSpace = THREE.NoColorSpace;
  roughTex.wrapS = THREE.ClampToEdgeWrapping;
  roughTex.wrapT = THREE.ClampToEdgeWrapping;
  roughTex.anisotropy = 8;
  roughTex.needsUpdate = true;

  return { colorTex, roughTex };
}

function generateSkyFallbackTexture(size = 1024) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, '#bfe5ff');
  g.addColorStop(0.55, '#dff2ff');
  g.addColorStop(0.72, '#9fd2ff');
  g.addColorStop(1, '#6cb0e6');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // Horizon band
  ctx.fillStyle = 'rgba(200,240,255,0.55)';
  ctx.fillRect(0, size * 0.62, size, size * 0.06);

  // Dunes and sea suggestion
  ctx.fillStyle = 'rgba(60,140,90,0.55)';
  ctx.fillRect(0, size * 0.64, size, size * 0.10);

  ctx.fillStyle = 'rgba(70,140,200,0.55)';
  ctx.fillRect(0, size * 0.74, size, size * 0.12);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

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

/**
 * Main scene
 */
export function createVrMuseumScene({
  container,
  artworks,
  onArtworkClick,
}: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // Scene and camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f6f6f6');

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 140);
  camera.position.set(0, 1.55, 6.6);

  // Room sizing (keep similar proportions to Jeff baseline)
  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  // Group
  const room = new THREE.Group();
  scene.add(room);

  // Materials (stark gallery white)
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.94,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.98,
    metalness: 0.0,
  });

  // Floor textures (staggered planks)
  const { colorTex: floorColor, roughTex: floorRough } = generateStaggeredPlankTextures({
    seed: 1337,
    textureSize: 1024,
    roomW,
    roomD,
    plankWidth: 0.22, // approx 8.5 inches
    minPlankLen: 1.2, // approx 4 ft
    maxPlankLen: 2.6, // approx 8.5 ft
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: floorColor,
    roughnessMap: floorRough,
    roughness: 0.62,
    metalness: 0.02,
  });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  // Walls: back wall will be replaced with a window wall
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
    color: new THREE.Color('#f1f1f1'),
    roughness: 0.85,
    metalness: 0.0,
  });

  const baseboardH = 0.09;
  const baseboardT = 0.03;

  function addBaseboard(length: number, x: number, z: number, rotY: number) {
    const geo = new THREE.BoxGeometry(length, baseboardH, baseboardT);
    const mesh = new THREE.Mesh(geo, baseboardMat);
    mesh.position.set(x, baseboardH / 2, z);
    mesh.rotation.y = rotY;
    room.add(mesh);
  }

  addBaseboard(roomW, 0, roomD / 2 - baseboardT / 2, 0);
  addBaseboard(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboard(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // Window wall (back wall at -roomD/2)
  const windowWall = new THREE.Group();
  room.add(windowWall);

  const backZ = -roomD / 2;

  // Opening size
  const openingW = roomW * 0.86;
  const openingH = roomH * 0.62;
  const openingBottom = 0.55;

  // Surrounding wall pieces: left, right, top, bottom
  const sideW = (roomW - openingW) / 2;

  // Bottom band
  const bottomH = openingBottom;
  const bottomBand = new THREE.Mesh(new THREE.PlaneGeometry(roomW, bottomH), wallMat);
  bottomBand.position.set(0, bottomH / 2, backZ);
  windowWall.add(bottomBand);

  // Top band
  const topY0 = openingBottom + openingH;
  const topH = roomH - topY0;
  const topBand = new THREE.Mesh(new THREE.PlaneGeometry(roomW, topH), wallMat);
  topBand.position.set(0, topY0 + topH / 2, backZ);
  windowWall.add(topBand);

  // Left band
  const leftBand = new THREE.Mesh(new THREE.PlaneGeometry(sideW, openingH), wallMat);
  leftBand.position.set(-(openingW / 2 + sideW / 2), openingBottom + openingH / 2, backZ);
  windowWall.add(leftBand);

  // Right band
  const rightBand = new THREE.Mesh(new THREE.PlaneGeometry(sideW, openingH), wallMat);
  rightBand.position.set(openingW / 2 + sideW / 2, openingBottom + openingH / 2, backZ);
  windowWall.add(rightBand);

  // Baseboard on back wall only for the bottom band edges
  addBaseboard(roomW, 0, backZ + baseboardT / 2, 0);

  // Window frame and mullions
  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f7f7f7'),
    roughness: 0.6,
    metalness: 0.0,
  });

  const mullionT = 0.04;
  const frameDepth = 0.06;

  // Outer frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(openingW, openingH, frameDepth),
    frameMat
  );
  frame.position.set(0, openingBottom + openingH / 2, backZ + frameDepth / 2);
  frame.castShadow = true;
  frame.receiveShadow = true;
  windowWall.add(frame);

  // Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#dff3ff'),
    roughness: 0.08,
    metalness: 0.0,
    transmission: 0.96,
    thickness: 0.04,
    transparent: true,
    opacity: 1.0,
    ior: 1.45,
  });

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(openingW - 0.06, openingH - 0.06), glassMat);
  glass.position.set(0, openingBottom + openingH / 2, backZ + frameDepth / 2 + 0.01);
  windowWall.add(glass);

  // Mullions grid (modern wall of windows)
  const cols = 4;
  const rows = 2;

  for (let c = 1; c < cols; c++) {
    const x = -openingW / 2 + (openingW * c) / cols;
    const v = new THREE.Mesh(new THREE.BoxGeometry(mullionT, openingH - 0.08, frameDepth), frameMat);
    v.position.set(x, openingBottom + openingH / 2, backZ + frameDepth / 2);
    v.castShadow = true;
    windowWall.add(v);
  }

  for (let r = 1; r < rows; r++) {
    const y = openingBottom + (openingH * r) / rows;
    const h = new THREE.Mesh(new THREE.BoxGeometry(openingW - 0.08, mullionT, frameDepth), frameMat);
    h.position.set(0, y, backZ + frameDepth / 2);
    h.castShadow = true;
    windowWall.add(h);
  }

  // Outside landscape plane
  const texLoader = new THREE.TextureLoader();
  const outsideTex = (() => {
    try {
      // This will succeed only if you place the file in /vr/hamptons.jpg
      const t = texLoader.load(
        '/hamptons.jpg',
        undefined,
        undefined,
        () => {
          // swallow, fallback will still render
        }
      );
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      t.needsUpdate = true;
      return t;
    } catch {
      return generateSkyFallbackTexture(1024);
    }
  })();

  const outsideMat = new THREE.MeshBasicMaterial({
    map: outsideTex,
  });

  const outsidePlane = new THREE.Mesh(new THREE.PlaneGeometry(openingW * 1.12, openingH * 1.12), outsideMat);
  outsidePlane.position.set(0, openingBottom + openingH / 2, backZ - 2.0);
  windowWall.add(outsidePlane);

  // Lighting
  // Bright, clean, and consistent with Jeff baseline
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));

  // Key sun from the window side (behind the back wall)
  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(0, 7.5, -18);
  sun.target.position.set(0, 1.4, -6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  scene.add(sun);
  scene.add(sun.target);

  // Soft fill from above/front
  const fill = new THREE.DirectionalLight(0xffffff, 0.30);
  fill.position.set(6, 10, 10);
  scene.add(fill);

  // Window glow panel (fake light portal so it feels like daylight comes in)
  const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(openingW * 0.98, openingH * 0.98),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 })
  );
  portal.position.set(0, openingBottom + openingH / 2, backZ + 0.02);
  windowWall.add(portal);

  // Track lighting on ceiling (subtle, not a black bar)
  const trackMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#eaeaea'),
    roughness: 0.55,
    metalness: 0.05,
  });

  const track = new THREE.Mesh(new THREE.BoxGeometry(roomW * 0.82, 0.04, 0.04), trackMat);
  track.position.set(0, roomH - 0.18, 0);
  track.castShadow = true;
  room.add(track);

  // A few soft ceiling spots down the room centerline
  const spotCount = 5;
  for (let i = 0; i < spotCount; i++) {
    const z = lerp(-8, 10, i / (spotCount - 1));
    const s = new THREE.SpotLight(0xffffff, 0.35, 20, Math.PI / 7, 0.6, 1.2);
    s.position.set(0, roomH - 0.15, z);
    s.target.position.set(0, 1.3, z - 1.4);
    s.castShadow = true;
    s.shadow.mapSize.set(1024, 1024);
    room.add(s);
    room.add(s.target);
  }

  // Art frames and placements
  const framesGroup = new THREE.Group();
  room.add(framesGroup);

  const frameOuterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1a'),
    roughness: 0.35,
    metalness: 0.12,
  });

  const matteMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f8f8f8'),
    roughness: 0.98,
    metalness: 0.0,
  });

  const clickableMeshes: ArtMeshRecord[] = [];

  function loadArtworkTexture(url: string): Promise<THREE.Texture | null> {
    const src = normalizeImageUrl(url);
    return new Promise((resolve) => {
      texLoader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;

    const tex = await loadArtworkTexture(artwork.imageUrl);

    let aspect = 4 / 5;
    const img: any = tex?.image;
    if (img?.width && img?.height) aspect = img.width / img.height;

    let artW = targetMaxWidth;
    let artH = artW / aspect;
    if (artH > targetMaxHeight) {
      artH = targetMaxHeight;
      artW = artH * aspect;
    }

    const g = new THREE.Group();
    g.position.copy(position);
    g.rotation.y = rotationY;

    const depth = 0.08;
    const frameT = 0.09;

    const outer = new THREE.Mesh(
      new THREE.BoxGeometry(artW + frameT, artH + frameT, depth),
      frameOuterMat
    );
    outer.castShadow = true;
    outer.receiveShadow = true;
    g.add(outer);

    const matte = new THREE.Mesh(
      new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.006),
      matteMat
    );
    matte.position.z = depth / 2 + 0.004;
    g.add(matte);

    // Keep art bright and faithful by using Basic material
    const artMat = new THREE.MeshBasicMaterial({
      color: tex ? 0xffffff : 0x2b2b2b,
      map: tex ?? undefined,
    });

    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    artPlane.position.z = depth / 2 + 0.01;
    artPlane.userData.__artworkId = artwork.id;
    g.add(artPlane);

    framesGroup.add(g);

    clickableMeshes.push({
      artwork,
      clickable: artPlane,
      frameGroup: g,
    });
  }

  // Place artworks similarly to Jeff baseline: mostly right wall, then left
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const artY = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({
      pos: new THREE.Vector3(roomW / 2 - 0.06, artY, z),
      rotY: -Math.PI / 2,
    });
  }

  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({
      pos: new THREE.Vector3(-roomW / 2 + 0.06, artY, z),
      rotY: Math.PI / 2,
    });
  }

  (async () => {
    for (let i = 0; i < artworks.length; i++) {
      if (disposed) return;
      const p = placements[i] ?? {
        pos: new THREE.Vector3(roomW / 2 - 0.06, artY, 9 - i * 5.2),
        rotY: -Math.PI / 2,
      };
      await addFramedArtwork({
        artwork: artworks[i],
        position: p.pos,
        rotationY: p.rotY,
        targetMaxWidth: 1.6,
        targetMaxHeight: 2.0,
      });
    }
  })();

  // Controls: drag look + wheel move
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    dragMoved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;

    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * 0.0032;
    pitch -= dy * 0.0032;
    pitch = clamp(pitch, minPitch, maxPitch);
  }

  function onPointerUp(e: PointerEvent) {
    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {}
    renderer.domElement.style.cursor = 'grab';

    // If it was a click (not a drag), raycast for artwork
    if (!dragMoved) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const targets = clickableMeshes.map((m) => m.clickable);
      const hits = raycaster.intersectObjects(targets, true);

      if (hits.length) {
        const hit = hits[0].object;
        const id = (hit.userData?.__artworkId as string) ?? '';
        const rec = clickableMeshes.find((m) => m.artwork.id === id);
        if (rec) onArtworkClick?.(rec.artwork);
      }
    }
  }

  function onWheel(e: WheelEvent) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    basePos.addScaledVector(forward, step);

    const margin = 0.9;
    basePos.x = clamp(basePos.x, -roomW / 2 + margin, roomW / 2 - margin);
    basePos.z = clamp(basePos.z, -roomD / 2 + margin, roomD / 2 - margin);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  // Resize
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

  // Focus helpers (no zoom behavior yet, just snap-to-face if you call it)
  function focusArtwork(id: string) {
    const rec = clickableMeshes.find((m) => m.artwork.id === id);
    if (!rec) return;

    // World position slightly in front of the frame
    const worldPos = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldPos);

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rec.frameGroup.quaternion);
    const targetPos = worldPos.clone().add(forward.clone().multiplyScalar(2.6));
    targetPos.y = 1.55;

    basePos.copy(targetPos);

    // Face the artwork
    const lookAt = worldPos.clone();
    lookAt.y = 1.55;
    camera.lookAt(lookAt);

    // Update yaw and pitch from camera quaternion
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    yaw = euler.y;
    pitch = clamp(euler.x, minPitch, maxPitch);
  }

  function clearFocus() {
    basePos.set(0, 1.55, 6.6);
    yaw = 0;
    pitch = 0;
  }

  // Loop
  function animate() {
    if (disposed) return;

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.position.copy(basePos);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Dispose
  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerUp);
    renderer.domElement.removeEventListener('wheel', onWheel as any);

    scene.traverse((obj) => {
      const anyObj: any = obj;
      if (anyObj.geometry?.dispose) anyObj.geometry.dispose();

      const mat = anyObj.material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if (m.map?.dispose) m.map.dispose();
          if (m.roughnessMap?.dispose) m.roughnessMap.dispose();
          if (m.dispose) m.dispose();
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
